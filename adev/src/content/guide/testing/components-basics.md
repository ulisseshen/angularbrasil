<!-- ia-translate: true -->
# Fundamentos de testes de components {#basics-of-testing-components}

Um component, diferentemente de todas as outras partes de uma aplicação Angular, combina um template HTML e uma classe TypeScript.
O component é verdadeiramente o template e a classe _trabalhando juntos_.
Para testar um component adequadamente, você deve verificar se eles funcionam juntos conforme o esperado.

Esses testes exigem criar o elemento host do component no DOM do browser, como o Angular faz, e investigar a interação da classe do component com o DOM conforme descrito pelo seu template.

O `TestBed` do Angular facilita esse tipo de teste, como você verá nas seções seguintes.
Mas, em muitos casos, _testar apenas a classe do component_, sem envolvimento do DOM, pode validar grande parte do comportamento do component de forma mais direta e óbvia.

## Testes de DOM de component {#component-dom-testing}

Um component é mais do que apenas a sua classe.
Um component interage com o DOM e com outros components.
Somente classes não conseguem dizer se o component vai renderizar corretamente, responder à entrada e aos gestos do usuário ou se integrar aos seus components pai e filho.

- `Lightswitch.clicked()` está vinculado a algo para que o usuário possa invocá-lo?
- `Lightswitch.message` é exibida?
- O usuário consegue realmente selecionar o hero exibido pelo component `DashboardHero`?
- O nome do hero é exibido conforme o esperado \(como em letras maiúsculas\)?
- A mensagem de boas-vindas é exibida pelo template do component `Welcome`?

Essas perguntas podem não ser problemáticas para os components simples ilustrados acima.
Mas muitos components têm interações complexas com os elementos DOM descritos em seus templates, fazendo com que HTML apareça e desapareça conforme o estado do component muda.

Para responder a esses tipos de pergunta, você precisa criar os elementos DOM associados aos components, examinar o DOM para confirmar que o estado do component é exibido corretamente nos momentos apropriados e simular a interação do usuário com a tela para determinar se essas interações fazem o component se comportar conforme o esperado.

Para escrever esses tipos de teste, você usará recursos adicionais do `TestBed`, bem como outros helpers de teste.

### Testes gerados pela CLI {#cli-generated-tests}

A CLI cria um arquivo de teste inicial para você, por padrão, quando você pede para gerar um novo component.

Por exemplo, o seguinte comando da CLI gera um component `Banner` na pasta `app/banner` \(com template e estilos inline\):

```shell
ng generate component banner --inline-template --inline-style
```

Ele também gera um arquivo de teste inicial para o component, `banner.spec.ts`, que se parece com isto:

```ts
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Banner} from './banner';

describe('Banner', () => {
  let component: Banner;
  let fixture: ComponentFixture<Banner>;

  beforeEach(async () => {
    TestBed.configureTestingModule({});

    fixture = TestBed.createComponent(Banner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### Reduzir a configuração {#reduce-the-setup}

Apenas as três últimas linhas deste arquivo realmente testam o component, e tudo o que elas fazem é afirmar que o Angular consegue criar o component.

O restante do arquivo é código de configuração boilerplate, que antecipa testes mais avançados que _podem_ se tornar necessários se o component evoluir para algo substancial.

Você aprenderá sobre esses recursos avançados de teste nas seções seguintes.
Por enquanto, você pode reduzir radicalmente este arquivo de teste para um tamanho mais gerenciável:

```ts
describe('Banner (minimal)', () => {
  it('should create', () => {
    const fixture = TestBed.createComponent(Banner);
    const component = fixture.componentInstance;
    expect(component).toBeDefined();
  });
});
```

Mais tarde, você chamará `TestBed.configureTestingModule()` com imports, providers e mais declarações para atender às suas necessidades de teste.
Métodos `override` opcionais podem ajustar ainda mais aspectos da configuração.

NOTE: `TestBed.compileComponents` só é necessário quando blocos `@defer` são usados nos components testados.

### `createComponent()`

Após configurar o `TestBed`, você chama o método `createComponent()`.

```ts
const fixture = TestBed.createComponent(Banner);
```

`TestBed.createComponent()` cria uma instância do component `Banner`, adiciona um elemento correspondente ao DOM do test-runner e retorna um [`ComponentFixture`](#componentfixture).

IMPORTANT: Não reconfigure o `TestBed` depois de chamar `createComponent`.

O método `createComponent` congela a definição atual do `TestBed`, fechando-o para mais configurações.

Você não pode mais chamar nenhum método de configuração do `TestBed`, nem `configureTestingModule()`, nem qualquer um dos métodos `override...`.
Se tentar, o `TestBed` lança um erro.

### `ComponentFixture`

O [`ComponentFixture`](api/core/testing/ComponentFixture) é um test harness para interagir com o component criado e com seu elemento correspondente.

Acesse a instância do component por meio do fixture e confirme que ela existe com uma expectation:

```ts
const component = fixture.componentInstance;
expect(component).toBeDefined();
```

### `beforeEach()`

Você adicionará mais testes conforme este component evoluir.
Em vez de duplicar a configuração do `TestBed` para cada teste, você refatora para colocar a configuração em um `beforeEach()` e algumas variáveis de apoio:

```ts
describe('Banner (with beforeEach)', () => {
  let component: Banner;
  let fixture: ComponentFixture<Banner>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(Banner);
    component = fixture.componentInstance;

    await fixture.whenStable(); // necessary to wait for the initial rendering
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
```

HELPFUL: Ao aguardar a renderização inicial no `beforeEach` com `await fixture.whenStable`, os testes individuais ficam síncronos.

Agora adicione um teste que obtém o elemento do component a partir de `fixture.nativeElement` e procura pelo texto esperado.

```ts
it('should contain "banner works!"', () => {
  const bannerElement: HTMLElement = fixture.nativeElement;
  expect(bannerElement.textContent).toContain('banner works!');
});
```

### Criar uma função `setup` {#create-a-setup-function}

Como alternativa ao `beforeEach`, você também pode criar uma função de setup que chama em cada teste.
Uma função de setup tem a vantagem de ser personalizável por meio de parâmetros.

Aqui está um exemplo de como uma função de setup pode ser:

```ts
function setup(providers?: Provider[]): ComponentFixture<Banner> {
  TestBed.configureTestingModule({providers});
  return TestBed.createComponent(Banner);
}
```

### `nativeElement`

O valor de `ComponentFixture.nativeElement` tem o tipo `any`.
Mais adiante você encontrará o `DebugElement.nativeElement`, que também tem o tipo `any`.

O Angular não pode saber em tempo de compilação que tipo de elemento HTML é o `nativeElement`, nem se ele é realmente um elemento HTML.
A aplicação pode estar executando em uma _plataforma não-browser_, como o servidor ou um ambiente Node, onde o elemento pode ter uma API reduzida ou nem existir.

Os testes deste guia são projetados para executar em um browser, então um valor `nativeElement` sempre será um `HTMLElement` ou uma de suas classes derivadas.

Sabendo que é um `HTMLElement` de algum tipo, use o `querySelector` padrão do HTML para se aprofundar na árvore de elementos.

Aqui está outro teste que chama `HTMLElement.querySelector` para obter o elemento de parágrafo e procurar pelo texto do banner:

```ts
it('should have <p> with "banner works!"', () => {
  const bannerElement: HTMLElement = fixture.nativeElement;
  const p = bannerElement.querySelector('p')!;
  expect(p.textContent).toEqual('banner works!');
});
```

### `DebugElement`

O _fixture_ do Angular fornece o elemento do component diretamente por meio de `fixture.nativeElement`.

```ts
const bannerElement: HTMLElement = fixture.nativeElement;
```

Isso é, na verdade, um método de conveniência, implementado como `fixture.debugElement.nativeElement`.

```ts
const bannerDe: DebugElement = fixture.debugElement;
const bannerEl: HTMLElement = bannerDe.nativeElement;
```

Há um bom motivo para esse caminho tortuoso até o elemento.

As propriedades do `nativeElement` dependem do ambiente de execução.
Você pode estar executando esses testes em uma plataforma _não-browser_ que não tem um DOM ou cuja emulação de DOM não oferece suporte à API completa do `HTMLElement`.

O Angular depende da abstração `DebugElement` para funcionar com segurança em _todas as plataformas suportadas_.
Em vez de criar uma árvore de elementos HTML, o Angular cria uma árvore `DebugElement` que envolve os _elementos nativos_ da plataforma de execução.
A propriedade `nativeElement` desembrulha o `DebugElement` e retorna o objeto de elemento específico da plataforma.

Como os testes de exemplo deste guia são projetados para executar apenas em um browser, um `nativeElement` nesses testes é sempre um `HTMLElement`, cujos métodos e propriedades familiares você pode explorar dentro de um teste.

Aqui está o teste anterior, reimplementado com `fixture.debugElement.nativeElement`:

```ts
it('should find the <p> with fixture.debugElement.nativeElement', () => {
  const bannerDe: DebugElement = fixture.debugElement;
  const bannerEl: HTMLElement = bannerDe.nativeElement;
  const p = bannerEl.querySelector('p')!;
  expect(p.textContent).toEqual('banner works!');
});
```

O `DebugElement` tem outros métodos e propriedades que são úteis em testes, como você verá em outras partes deste guia.

Você importa o símbolo `DebugElement` da biblioteca core do Angular.

```ts
import {DebugElement} from '@angular/core';
```

### `By.css()`

Embora os testes deste guia sejam todos executados no browser, algumas aplicações podem executar em uma plataforma diferente pelo menos parte do tempo.

Por exemplo, o component pode renderizar primeiro no servidor como parte de uma estratégia para fazer a aplicação iniciar mais rápido em dispositivos com conexão ruim.
O renderizador server-side pode não oferecer suporte à API completa de elementos HTML.
Se ele não suportar `querySelector`, o teste anterior poderia falhar.

O `DebugElement` oferece métodos de query que funcionam em todas as plataformas suportadas.
Esses métodos de query recebem uma função _predicate_ que retorna `true` quando um nó na árvore `DebugElement` corresponde aos critérios de seleção.

Você cria um _predicate_ com a ajuda de uma classe `By`, importada de uma biblioteca para a plataforma de execução.
Aqui está o import de `By` para a plataforma browser:

```ts
import {By} from '@angular/platform-browser';
```

O exemplo a seguir reimplementa o teste anterior com `DebugElement.query()` e o método `By.css` do browser.

```ts
it('should find the <p> with fixture.debugElement.query(By.css)', () => {
  const bannerDe: DebugElement = fixture.debugElement;
  const paragraphDe = bannerDe.query(By.css('p'));
  const p: HTMLElement = paragraphDe.nativeElement;
  expect(p.textContent).toEqual('banner works!');
});
```

Algumas observações importantes:

- O método estático `By.css()` seleciona nós `DebugElement` com um [seletor CSS padrão](https://developer.mozilla.org/docs/Learn/CSS/Building_blocks/Selectors 'CSS selectors').
- A query retorna um `DebugElement` para o parágrafo.
- Você deve desembrulhar esse resultado para obter o elemento de parágrafo.

Quando você está filtrando por seletor CSS e testando apenas propriedades de um _elemento nativo_ do browser, a abordagem `By.css` pode ser excessiva.

Geralmente é mais direto e claro filtrar com um método padrão de `HTMLElement`, como `querySelector()` ou `querySelectorAll()`.
