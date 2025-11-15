<!-- ia-translate: true -->
# Usando component harnesses em testes

## Antes de começar

DICA: Este guia assume que você já leu o [guia de visão geral de component harnesses](guide/testing/component-harnesses-overview). Leia aquele primeiro se você é novo no uso de component harnesses.

### Instalação do CDK

O [Component Dev Kit (CDK)](https://material.angular.dev/cdk/categories) é um conjunto de primitivos de comportamento para construção de components. Para usar os component harnesses, primeiro instale `@angular/cdk` do npm. Você pode fazer isso do seu terminal usando o Angular CLI:

<docs-code language="shell">
  ng add @angular/cdk
</docs-code>

## Test harness environments e loaders

Você pode usar component test harnesses em diferentes ambientes de teste. Angular CDK suporta dois ambientes integrados:

- Unit tests com `TestBed` do Angular
- Testes end-to-end com [WebDriver](https://developer.mozilla.org/en-US/docs/Web/WebDriver)

Cada ambiente fornece um <strong>harness loader</strong>. O loader cria as instâncias de harness que você usa ao longo dos seus testes. Veja abaixo para orientação mais específica sobre ambientes de teste suportados.

Ambientes de teste adicionais requerem bindings customizados. Veja o [guia adicionando suporte de harness para ambientes de teste adicionais](guide/testing/component-harnesses-testing-environments) para mais informações.

### Usando o loader de `TestbedHarnessEnvironment` para unit tests

Para unit tests você pode criar um harness loader de [TestbedHarnessEnvironment](/api/cdk/testing/TestbedHarnessEnvironment). Este ambiente usa um [component fixture](api/core/testing/ComponentFixture) criado pelo `TestBed` do Angular.

Para criar um harness loader enraizado no elemento raiz do fixture, use o método `loader()`:

<docs-code language="typescript">
const fixture = TestBed.createComponent(MyComponent);

// Crie um harness loader do fixture
const loader = TestbedHarnessEnvironment.loader(fixture);
...

// Use o loader para obter instâncias de harness
const myComponentHarness = await loader.getHarness(MyComponent);
</docs-code>

Para criar um harness loader para harnesses para elementos que caem fora do fixture, use o método `documentRootLoader()`. Por exemplo, código que exibe um elemento flutuante ou pop-up frequentemente anexa elementos DOM diretamente ao body do documento, como o service `Overlay` no Angular CDK.

Você também pode criar um harness loader diretamente com `harnessForFixture()` para um harness no elemento raiz daquele fixture diretamente.

### Usando o loader de `SeleniumWebDriverHarnessEnvironment` para testes end-to-end

Para testes end-to-end baseados em WebDriver você pode criar um harness loader com `SeleniumWebDriverHarnessEnvironment`.

Use o método `loader()` para obter a instância de harness loader para o documento HTML atual, enraizado no elemento raiz do documento. Este ambiente usa um cliente WebDriver.

<docs-code language="typescript">
let wd: webdriver.WebDriver = getMyWebDriverClient();
const loader = SeleniumWebDriverHarnessEnvironment.loader(wd);
...
const myComponentHarness = await loader.getHarness(MyComponent);
</docs-code>

## Usando um harness loader

Instâncias de harness loader correspondem a um elemento DOM específico e são usadas para criar instâncias de component harness para elementos sob esse elemento específico.

Para obter `ComponentHarness` para a primeira instância do elemento, use o método `getHarness()`. Para obter todas as instâncias de `ComponentHarness`, use o método `getAllHarnesses()`.

<docs-code language="typescript">
// Obtenha harness para primeira instância do elemento
const myComponentHarness = await loader.getHarness(MyComponent);

// Obtenha harnesses para todas as instâncias do elemento
const myComponentHarnesses = await loader.getHarnesses(MyComponent);
</docs-code>

Além de `getHarness` e `getAllHarnesses`, `HarnessLoader` tem vários outros métodos úteis para consultar por harnesses:

- `getHarnessAtIndex(...)`: Obtém o harness para um component que corresponde aos critérios fornecidos em um índice específico.
- `countHarnesses(...)`: Conta o número de instâncias de component que correspondem aos critérios fornecidos.
- `hasHarness(...)`: Verifica se pelo menos uma instância de component corresponde aos critérios fornecidos.

Como exemplo, considere um component de botão de diálogo reutilizável que abre um diálogo ao clicar. Ele contém os seguintes components, cada um com um harness correspondente:

- `MyDialogButton` (compõe o `MyButton` e `MyDialog` com uma API conveniente)
- `MyButton` (um component de botão padrão)
- `MyDialog` (um diálogo anexado a `document.body` por `MyDialogButton` ao clicar)

O seguinte teste carrega harnesses para cada um desses components:

<docs-code language="typescript">
let fixture: ComponentFixture<MyDialogButton>;
let loader: HarnessLoader;
let rootLoader: HarnessLoader;

beforeEach(() => {
fixture = TestBed.createComponent(MyDialogButton);
loader = TestbedHarnessEnvironment.loader(fixture);
rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
});

it('loads harnesses', async () => {
// Carregue um harness para o component inicializado com `harnessForFixture`
dialogButtonHarness =
await TestbedHarnessEnvironment.harnessForFixture(fixture, MyDialogButtonHarness);

// O elemento button está dentro do elemento raiz do fixture, então usamos `loader`.
const buttonHarness = await loader.getHarness(MyButtonHarness);

// Clique no botão para abrir o diálogo
await buttonHarness.click();

// O diálogo é anexado a `document.body`, fora do elemento raiz do fixture,
// então usamos `rootLoader` neste caso.
const dialogHarness = await rootLoader.getHarness(MyDialogHarness);

// ... faça algumas asserções
});
</docs-code>

### Comportamento de harness em diferentes ambientes

Harnesses podem não se comportar exatamente da mesma forma em todos os ambientes. Algumas diferenças são inevitáveis entre a interação real do usuário versus os eventos simulados gerados em unit tests. Angular CDK faz um melhor esforço para normalizar o comportamento na medida do possível.

### Interagindo com elementos filhos

Para interagir com elementos abaixo do elemento raiz deste harness loader, use a instância `HarnessLoader` de um elemento filho. Para a primeira instância do elemento filho, use o método `getChildLoader()`. Para todas as instâncias do elemento filho, use o método `getAllChildLoaders()`.

<docs-code language="typescript">
const myComponentHarness = await loader.getHarness(MyComponent);

// Obtenha loader para primeira instância de elemento filho com seletor '.child'
const childLoader = await myComponentHarness.getLoader('.child');

// Obtenha loaders para todas as instâncias de elementos filhos com seletor '.child'
const allChildLoaders = await myComponentHarness.getAllChildLoaders('.child');
</docs-code>

### Filtrando harnesses

Quando uma página contém múltiplas instâncias de um component particular, você pode querer filtrar baseado em alguma propriedade do component para obter uma instância de component particular. Você pode usar um <strong>harness predicate</strong>, uma classe usada para associar uma classe `ComponentHarness` com funções de predicados que podem ser usadas para filtrar instâncias de component, para fazer isso.

Quando você pede a um `HarnessLoader` por um harness, você está na verdade fornecendo um HarnessQuery. Uma query pode ser uma de duas coisas:

- Um construtor de harness. Isso apenas obtém aquele harness
- Um `HarnessPredicate`, que obtém harnesses que são filtrados baseados em uma ou mais condições

`HarnessPredicate` suporta alguns filtros base (selector, ancestor) que funcionam em qualquer coisa que estende `ComponentHarness`.

<docs-code language="typescript">
// Exemplo de carregar um MyButtonComponentHarness com um harness predicate
const disabledButtonPredicate = new HarnessPredicate(MyButtonComponentHarness, {selector: '[disabled]'});
const disabledButton = await loader.getHarness(disabledButtonPredicate);
</docs-code>

No entanto é comum para harnesses implementarem um método estático `with()` que aceita opções de filtragem específicas do component e retorna um `HarnessPredicate`.

<docs-code language="typescript">
// Exemplo de carregar um MyButtonComponentHarness com um seletor específico
const button = await loader.getHarness(MyButtonComponentHarness.with({selector: 'btn'}))
</docs-code>

Para mais detalhes consulte a documentação específica do harness já que opções de filtragem adicionais são específicas para cada implementação de harness.

## Usando APIs de test harness

Embora cada harness defina uma API específica para seu component correspondente, todos eles compartilham uma classe base comum, [ComponentHarness](/api/cdk/testing/ComponentHarness). Esta classe base define uma propriedade estática, `hostSelector`, que corresponde a classe harness a instâncias do component no DOM.

Além disso, a API de qualquer harness dado é específica para seu component correspondente; consulte a documentação do component para aprender como usar um harness específico.

Como exemplo, o seguinte é um teste para um component que usa o [harness de component slider do Angular Material](https://material.angular.dev/components/slider/api#MatSliderHarness):

<docs-code language="typescript">
it('should get value of slider thumb', async () => {
  const slider = await loader.getHarness(MatSliderHarness);
  const thumb = await slider.getEndThumb();
  expect(await thumb.getValue()).toBe(50);
});
</docs-code>

## Interoperabilidade com detecção de mudanças do Angular

Por padrão, test harnesses executa a [detecção de mudanças](https://angular.dev/best-practices/runtime-performance) do Angular antes de ler o estado de um elemento DOM e após interagir com um elemento DOM.

Pode haver momentos que você precisa de controle mais refinado sobre detecção de mudanças nos seus testes, como verificar o estado de um component enquanto uma operação assíncrona está pendente. Nesses casos use a função `manualChangeDetection` para desabilitar o tratamento automático de detecção de mudanças para um bloco de código.

<docs-code language="typescript">
it('checks state while async action is in progress', async () => {
  const buttonHarness = loader.getHarness(MyButtonHarness);
  await manualChangeDetection(async () => {
    await buttonHarness.click();
    fixture.detectChanges();
    // Verifique expectations enquanto operação de clique assíncrona está em progresso.
    expect(isProgressSpinnerVisible()).toBe(true);
    await fixture.whenStable();
    // Verifique expectations após operação de clique assíncrona completar.
    expect(isProgressSpinnerVisible()).toBe(false);
  });
});
</docs-code>

Quase todos os métodos de harness são assíncronos e retornam uma `Promise` para suportar o seguinte:

- Suporte para unit tests
- Suporte para testes end-to-end
- Isolar testes contra mudanças em comportamento assíncrono

A equipe Angular recomenda usar [await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) para melhorar a legibilidade do teste. Chamar `await` bloqueia a execução do seu teste até que a `Promise` associada resolva.

Ocasionalmente, você pode querer executar múltiplas ações simultaneamente e aguardar até que todas estejam concluídas em vez de executar cada ação sequencialmente. Por exemplo, ler múltiplas propriedades de um único component. Nessas situações use a função `parallel` para paralelizar as operações. A função parallel funciona similarmente a `Promise.all`, enquanto também otimiza verificações de detecção de mudanças.

<docs-code language="typescript">
it('reads properties in parallel', async () => {
  const checkboxHarness = loader.getHarness(MyCheckboxHarness);
  // Leia as propriedades checked e intermediate simultaneamente.
  const [checked, indeterminate] = await parallel(() => [
    checkboxHarness.isChecked(),
    checkboxHarness.isIndeterminate()
  ]);
  expect(checked).toBe(false);
  expect(indeterminate).toBe(true);
});
</docs-code>
