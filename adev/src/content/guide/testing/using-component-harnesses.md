<!-- ia-translate: true -->

# Usando component harnesses em testes {#using-component-harnesses-in-tests}

## Antes de começar {#before-you-start}

TIP: Este guia pressupõe que você já leu o [guia de visão geral de component harnesses](guide/testing/component-harnesses-overview). Leia-o primeiro se você for novo no uso de component harnesses.

### Instalação do CDK {#cdk-installation}

O [Component Dev Kit (CDK)](https://material.angular.dev/cdk/categories) é um conjunto de primitivas de comportamento para construir components. Para usar os component harnesses, primeiro instale o `@angular/cdk` pelo npm. Você pode fazer isso no seu terminal usando o Angular CLI:

```shell
ng add @angular/cdk
```

## Ambientes e loaders de test harness {#test-harness-environments-and-loaders}

Você pode usar component test harnesses em diferentes ambientes de teste. O Angular CDK oferece suporte a dois ambientes integrados:

- Testes unitários com o `TestBed` do Angular
- Testes end-to-end com [WebDriver](https://developer.mozilla.org/en-US/docs/Web/WebDriver)

Cada ambiente fornece um <strong>harness loader</strong>. O loader cria as instâncias de harness que você usa ao longo dos seus testes. Veja abaixo orientações mais específicas sobre os ambientes de teste suportados.

Ambientes de teste adicionais exigem bindings personalizados. Veja o [guia de adição de suporte a harnesses em ambientes de teste adicionais](guide/testing/component-harnesses-testing-environments) para mais informações.

### Usando o loader de `TestbedHarnessEnvironment` para testes unitários {#using-the-loader-from-testbedharnessenvironment-for-unit-tests}

Para testes unitários, você pode criar um harness loader a partir de [TestbedHarnessEnvironment](/api/cdk/testing/testbed/TestbedHarnessEnvironment). Este ambiente usa um [component fixture](api/core/testing/ComponentFixture) criado pelo `TestBed` do Angular.

Para criar um harness loader com raiz no elemento raiz do fixture, use o método `loader()`:

```ts
const fixture = TestBed.createComponent(MyComponent);

// Create a harness loader from the fixture
const loader = TestbedHarnessEnvironment.loader(fixture);
...

// Use the loader to get harness instances
const myComponentHarness = await loader.getHarness(MyComponent);
```

Para criar um harness loader para harnesses de elementos que ficam fora do fixture, use o método `documentRootLoader()`. Por exemplo, código que exibe um elemento flutuante ou um pop-up frequentemente anexa elementos DOM diretamente ao corpo do documento, como o service `Overlay` do Angular CDK.

Você também pode criar um harness loader diretamente com `harnessForFixture()` para um harness no elemento raiz desse fixture.

### Usando o loader de `SeleniumWebDriverHarnessEnvironment` para testes end-to-end {#using-the-loader-from-seleniumwebdriverharnessenvironment-for-end-to-end-tests}

Para testes end-to-end baseados em WebDriver, você pode criar um harness loader com `SeleniumWebDriverHarnessEnvironment`.

Use o método `loader()` para obter a instância do harness loader para o documento HTML atual, com raiz no elemento raiz do documento. Este ambiente usa um client WebDriver.

```ts
let wd: webdriver.WebDriver = getMyWebDriverClient();
const loader = SeleniumWebDriverHarnessEnvironment.loader(wd);
...
const myComponentHarness = await loader.getHarness(MyComponent);
```

## Usando um harness loader {#using-a-harness-loader}

Instâncias de harness loader correspondem a um elemento DOM específico e são usadas para criar instâncias de component harness para os elementos abaixo desse elemento específico.

Para obter o `ComponentHarness` da primeira instância do elemento, use o método `getHarness()`. Para obter todas as instâncias de `ComponentHarness`, use o método `getAllHarnesses()`.

```ts
// Get harness for first instance of the element
const myComponentHarness = await loader.getHarness(MyComponent);

// Get harnesses for all instances of the element
const myComponentHarnesses = await loader.getAllHarnesses(MyComponent);
```

Além de `getHarness` e `getAllHarnesses`, o `HarnessLoader` tem vários outros métodos úteis para consultar harnesses:

- `getHarnessAtIndex(...)`: obtém o harness de um component que corresponde aos critérios fornecidos em um índice específico.
- `countHarnesses(...)`: conta o número de instâncias de component que correspondem aos critérios fornecidos.
- `hasHarness(...)`: verifica se pelo menos uma instância de component corresponde aos critérios fornecidos.

Como exemplo, considere um component reutilizável de botão de diálogo que abre um diálogo ao ser clicado. Ele contém os seguintes components, cada um com um harness correspondente:

- `MyDialogButton` (compõe o `MyButton` e o `MyDialog` com uma API prática)
- `MyButton` (um component de botão padrão)
- `MyDialog` (um diálogo anexado ao `document.body` pelo `MyDialogButton` ao clicar)

O teste a seguir carrega os harnesses de cada um desses components:

```ts
let fixture: ComponentFixture<MyDialogButton>;
let loader: HarnessLoader;
let rootLoader: HarnessLoader;

beforeEach(() => {
  fixture = TestBed.createComponent(MyDialogButton);
  loader = TestbedHarnessEnvironment.loader(fixture);
  rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
});

it('loads harnesses', async () => {
  // Load a harness for the bootstrapped component with `harnessForFixture`
  dialogButtonHarness = await TestbedHarnessEnvironment.harnessForFixture(
    fixture,
    MyDialogButtonHarness,
  );

  // The button element is inside the fixture's root element, so we use `loader`.
  const buttonHarness = await loader.getHarness(MyButtonHarness);

  // Click the button to open the dialog
  await buttonHarness.click();

  // The dialog is appended to `document.body`, outside of the fixture's root element,
  // so we use `rootLoader` in this case.
  const dialogHarness = await rootLoader.getHarness(MyDialogHarness);

  // ... make some assertions
});
```

### Comportamento dos harnesses em diferentes ambientes {#harness-behavior-in-different-environments}

Harnesses podem não se comportar exatamente da mesma forma em todos os ambientes. Algumas diferenças são inevitáveis entre a interação real do usuário e os eventos simulados gerados nos testes unitários. O Angular CDK faz o melhor esforço para normalizar o comportamento na medida do possível.

### Interagindo com elementos filhos {#interacting-with-child-elements}

Para interagir com elementos abaixo do elemento raiz deste harness loader, use o `HarnessLoader` de um elemento filho. Para a primeira instância do elemento filho, use o método `getChildLoader()`. Para todas as instâncias do elemento filho, use o método `getAllChildLoaders()`.

```ts
const myComponentHarness = await loader.getHarness(MyComponent);

// Get loader for first instance of child element with '.child' selector
const childLoader = await loader.getChildLoader('.child');

// Get loaders for all instances of child elements with '.child' selector
const allChildLoaders = await loader.getAllChildLoaders('.child');
```

### Filtrando harnesses {#filtering-harnesses}

Quando uma página contém várias instâncias de um component específico, você pode querer filtrar com base em alguma propriedade do component para obter uma instância específica. Para isso, você pode usar um <strong>harness predicate</strong>, uma classe usada para associar uma classe `ComponentHarness` a funções de predicado que podem ser usadas para filtrar instâncias de component.

Quando você pede um harness a um `HarnessLoader`, na verdade está fornecendo um HarnessQuery. Uma query pode ser uma de duas coisas:

- Um construtor de harness. Isso simplesmente obtém aquele harness
- Um `HarnessPredicate`, que obtém harnesses filtrados com base em uma ou mais condições

O `HarnessPredicate` oferece suporte a alguns filtros base (selector, ancestor) que funcionam em qualquer coisa que estenda o `ComponentHarness`.

```ts
// Example of loading a MyButtonComponentHarness with a harness predicate
const disabledButtonPredicate = new HarnessPredicate(MyButtonComponentHarness, {
  selector: '[disabled]',
});
const disabledButton = await loader.getHarness(disabledButtonPredicate);
```

No entanto, é comum que os harnesses implementem um método estático `with()` que aceita opções de filtragem específicas do component e retorna um `HarnessPredicate`.

```ts
// Example of loading a MyButtonComponentHarness with a specific selector
const button = await loader.getHarness(MyButtonComponentHarness.with({selector: 'btn'}));
```

Para mais detalhes, consulte a documentação específica do harness, já que as opções de filtragem adicionais são específicas de cada implementação de harness.

## Usando as APIs de test harness {#using-test-harness-apis}

Embora cada harness defina uma API específica para o seu component correspondente, todos compartilham uma classe base comum, o [ComponentHarness](/api/cdk/testing/ComponentHarness). Essa classe base define uma propriedade estática, `hostSelector`, que associa a classe do harness às instâncias do component no DOM.

Além disso, a API de cada harness é específica do seu component correspondente; consulte a documentação do component para aprender como usar um harness específico.

Como exemplo, o teste a seguir é para um component que usa o [harness do component slider do Angular Material](https://material.angular.dev/components/slider/api#MatSliderHarness):

```ts
it('should get value of slider thumb', async () => {
  const slider = await loader.getHarness(MatSliderHarness);
  const thumb = await slider.getEndThumb();
  expect(await thumb.getValue()).toBe(50);
});
```

## Interoperabilidade com a detecção de mudanças do Angular {#interop-with-angular-change-detection}

Por padrão, os test harnesses executam a [detecção de mudanças](/best-practices/runtime-performance) do Angular antes de ler o estado de um elemento DOM e depois de interagir com um elemento DOM.

Pode haver momentos em que você precisa de um controle mais refinado sobre a detecção de mudanças nos seus testes, como verificar o estado de um component enquanto uma operação assíncrona está pendente. Nesses casos, use a função `manualChangeDetection` para desabilitar o tratamento automático da detecção de mudanças em um bloco de código.

```ts
it('checks state while async action is in progress', async () => {
  const buttonHarness = await loader.getHarness(MyButtonHarness);
  await manualChangeDetection(async () => {
    await buttonHarness.click();
    fixture.detectChanges();
    // Check expectations while async click operation is in progress.
    expect(isProgressSpinnerVisible()).toBe(true);
    await fixture.whenStable();
    // Check expectations after async click operation complete.
    expect(isProgressSpinnerVisible()).toBe(false);
  });
});
```

Quase todos os métodos de harness são assíncronos e retornam uma `Promise` para oferecer suporte ao seguinte:

- Suporte a testes unitários
- Suporte a testes end-to-end
- Isolamento dos testes contra mudanças no comportamento assíncrono

A equipe do Angular recomenda usar o [await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) para melhorar a legibilidade dos testes. Chamar `await` bloqueia a execução do seu teste até que a `Promise` associada seja resolvida.

Ocasionalmente, você pode querer executar várias ações simultaneamente e esperar até que todas terminem, em vez de executar cada ação sequencialmente. Por exemplo, ler várias propriedades de um único component. Nessas situações, use a função `parallel` para paralelizar as operações. A função `parallel` funciona de forma semelhante ao `Promise.all`, além de otimizar as verificações de detecção de mudanças.

```ts
it('reads properties in parallel', async () => {
  const checkboxHarness = await loader.getHarness(MyCheckboxHarness);
  // Read the checked and intermediate properties simultaneously.
  const [checked, indeterminate] = await parallel(() => [
    checkboxHarness.isChecked(),
    checkboxHarness.isIndeterminate(),
  ]);
  expect(checked).toBe(false);
  expect(indeterminate).toBe(true);
});
```
