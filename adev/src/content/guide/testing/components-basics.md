<!-- ia-translate: true -->
# Fundamentos de testes de components

Um component, diferentemente de todas as outras partes de uma aplicação Angular, combina um template HTML e uma classe TypeScript.
O component é verdadeiramente o template e a classe _trabalhando juntos_.
Para testar adequadamente um component, você deve testar que eles funcionam juntos conforme pretendido.

Tais testes exigem criar o elemento host do component no DOM do browser, assim como o Angular faz, e investigar a interação da classe do component com o DOM conforme descrito pelo seu template.

O `TestBed` do Angular facilita esse tipo de teste, como você verá nas seções seguintes.
Mas em muitos casos, _testar apenas a classe do component_, sem envolvimento do DOM, pode validar muito do comportamento do component de forma direta e mais óbvia.

## Testes DOM de component

Um component é mais do que apenas sua classe.
Um component interage com o DOM e com outros components.
Classes sozinhas não podem dizer se o component vai renderizar corretamente, responder a entradas e gestos do usuário, ou integrar com seus components pai e filho.

- O `Lightswitch.clicked()` está vinculado a algo de modo que o usuário possa invocá-lo?
- A `Lightswitch.message` é exibida?
- O usuário pode realmente selecionar o hero exibido por `DashboardHeroComponent`?
- O nome do hero é exibido conforme esperado \(como em maiúsculas\)?
- A mensagem de boas-vindas é exibida pelo template de `WelcomeComponent`?

Estas podem não ser questões problemáticas para os components simples precedentes ilustrados.
Mas muitos components têm interações complexas com os elementos DOM descritos em seus templates, fazendo com que HTML apareça e desapareça conforme o estado do component muda.

Para responder a esses tipos de perguntas, você precisa criar os elementos DOM associados aos components, deve examinar o DOM para confirmar que o estado do component é exibido corretamente nos momentos apropriados, e deve simular a interação do usuário com a tela para determinar se essas interações fazem o component se comportar conforme esperado.

Para escrever esses tipos de teste, você usará recursos adicionais do `TestBed`, bem como outros helpers de teste.

### Testes gerados pela CLI

A CLI cria um arquivo de teste inicial para você por padrão quando você pede para gerar um novo component.

Por exemplo, o seguinte comando da CLI gera um `BannerComponent` na pasta `app/banner` \(com template e estilos inline\):

<docs-code language="shell">

ng generate component banner --inline-template --inline-style --module app

</docs-code>

Ele também gera um arquivo de teste inicial para o component, `banner-external.component.spec.ts`, que se parece com isto:

<docs-code header="app/banner/banner-external.component.spec.ts (inicial)" path="adev/src/content/examples/testing/src/app/banner/banner-initial.component.spec.ts" visibleRegion="v1"/>

ÚTIL: Como `compileComponents` é assíncrono, ele usa a função utilitária [`waitForAsync`](api/core/testing/waitForAsync) importada de `@angular/core/testing`.

Consulte a seção [waitForAsync](guide/testing/components-scenarios#waitForAsync) para mais detalhes.

### Reduzir a configuração

Apenas as últimas três linhas deste arquivo realmente testam o component e tudo o que fazem é afirmar que o Angular pode criar o component.

O resto do arquivo é código de configuração boilerplate antecipando testes mais avançados que _podem_ se tornar necessários se o component evoluir para algo substancial.

Você aprenderá sobre esses recursos avançados de teste nas seções seguintes.
Por enquanto, você pode reduzir radicalmente este arquivo de teste para um tamanho mais gerenciável:

<docs-code header="app/banner/banner-initial.component.spec.ts (mínimo)" path="adev/src/content/examples/testing/src/app/banner/banner-initial.component.spec.ts" visibleRegion="v2"/>

Neste exemplo, o objeto de metadata passado para `TestBed.configureTestingModule` simplesmente declara `BannerComponent`, o component a ser testado.

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner-initial.component.spec.ts" visibleRegion="configureTestingModule"/>

ÚTIL: Não há necessidade de declarar ou importar mais nada.
O module de teste padrão é pré-configurado com algo como o `BrowserModule` de `@angular/platform-browser`.

Mais tarde você chamará `TestBed.configureTestingModule()` com imports, providers e mais declarações para atender às suas necessidades de teste.
Métodos `override` opcionais podem ajustar ainda mais aspectos da configuração.

### `createComponent()`

Após configurar o `TestBed`, você chama seu método `createComponent()`.

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner-initial.component.spec.ts" visibleRegion="createComponent"/>

`TestBed.createComponent()` cria uma instância do `BannerComponent`, adiciona um elemento correspondente ao DOM do test-runner e retorna um [`ComponentFixture`](#componentfixture).

IMPORTANTE: Não reconfigure o `TestBed` após chamar `createComponent`.

O método `createComponent` congela a definição atual do `TestBed`, fechando-o para configuração adicional.

Você não pode chamar mais nenhum método de configuração do `TestBed`, nem `configureTestingModule()`, nem `get()`, nem qualquer um dos métodos `override...`.
Se você tentar, o `TestBed` lança um erro.

### `ComponentFixture`

O [ComponentFixture](api/core/testing/ComponentFixture) é um test harness para interagir com o component criado e seu elemento correspondente.

Acesse a instância do component através do fixture e confirme que ela existe com uma expectation do Jasmine:

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner-initial.component.spec.ts" visibleRegion="componentInstance"/>

### `beforeEach()`

Você adicionará mais testes conforme este component evolui.
Em vez de duplicar a configuração do `TestBed` para cada teste, você refatora para colocar a configuração em um `beforeEach()` do Jasmine e algumas variáveis de suporte:

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner-initial.component.spec.ts" visibleRegion="v3"/>

Agora adicione um teste que obtém o elemento do component de `fixture.nativeElement` e procura pelo texto esperado.

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner-initial.component.spec.ts" visibleRegion="v4-test-2"/>

### `nativeElement`

O valor de `ComponentFixture.nativeElement` tem o tipo `any`.
Mais tarde você encontrará o `DebugElement.nativeElement` e ele também tem o tipo `any`.

O Angular não pode saber em tempo de compilação que tipo de elemento HTML o `nativeElement` é ou se é mesmo um elemento HTML.
A aplicação pode estar sendo executada em uma _plataforma não-browser_, como o servidor ou um [Web Worker](https://developer.mozilla.org/docs/Web/API/Web_Workers_API), onde o elemento pode ter uma API reduzida ou não existir de modo algum.

Os testes neste guia são projetados para executar em um browser, então um valor `nativeElement` sempre será um `HTMLElement` ou uma de suas classes derivadas.

Sabendo que é um `HTMLElement` de algum tipo, use o `querySelector` padrão HTML para mergulhar mais fundo na árvore de elementos.

Aqui está outro teste que chama `HTMLElement.querySelector` para obter o elemento de parágrafo e procurar pelo texto do banner:

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner-initial.component.spec.ts" visibleRegion="v4-test-3"/>

### `DebugElement`

O _fixture_ do Angular fornece o elemento do component diretamente através de `fixture.nativeElement`.

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner-initial.component.spec.ts" visibleRegion="nativeElement"/>

Isto é na verdade um método de conveniência, implementado como `fixture.debugElement.nativeElement`.

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner-initial.component.spec.ts" visibleRegion="debugElement-nativeElement"/>

Há uma boa razão para este caminho tortuoso até o elemento.

As propriedades do `nativeElement` dependem do ambiente de runtime.
Você pode estar executando esses testes em uma plataforma _não-browser_ que não tem um DOM ou cuja emulação de DOM não suporta a API completa do `HTMLElement`.

O Angular depende da abstração `DebugElement` para funcionar com segurança em _todas as plataformas suportadas_.
Em vez de criar uma árvore de elementos HTML, o Angular cria uma árvore `DebugElement` que envolve os _elementos nativos_ para a plataforma de runtime.
A propriedade `nativeElement` desempacota o `DebugElement` e retorna o objeto de elemento específico da plataforma.

Como os testes de exemplo deste guia são projetados para executar apenas em um browser, um `nativeElement` nesses testes é sempre um `HTMLElement` cujos métodos e propriedades familiares você pode explorar dentro de um teste.

Aqui está o teste anterior, reimplementado com `fixture.debugElement.nativeElement`:

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner-initial.component.spec.ts" visibleRegion="v4-test-4"/>

O `DebugElement` tem outros métodos e propriedades que são úteis em testes, como você verá em outros lugares neste guia.

Você importa o símbolo `DebugElement` da biblioteca core do Angular.

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner-initial.component.spec.ts" visibleRegion="import-debug-element"/>

### `By.css()`

Embora os testes neste guia sejam todos executados no browser, algumas aplicações podem executar em uma plataforma diferente pelo menos parte do tempo.

Por exemplo, o component pode renderizar primeiro no servidor como parte de uma estratégia para fazer a aplicação iniciar mais rápido em dispositivos com conexão ruim.
O renderer server-side pode não suportar a API completa de elementos HTML.
Se ele não suportar `querySelector`, o teste anterior poderia falhar.

O `DebugElement` oferece métodos de query que funcionam para todas as plataformas suportadas.
Esses métodos de query recebem uma função _predicate_ que retorna `true` quando um nó na árvore `DebugElement` corresponde aos critérios de seleção.

Você cria um _predicate_ com a ajuda de uma classe `By` importada de uma biblioteca para a plataforma de runtime.
Aqui está o import `By` para a plataforma browser:

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner-initial.component.spec.ts" visibleRegion="import-by"/>

O exemplo seguinte reimplementa o teste anterior com `DebugElement.query()` e o método `By.css` do browser.

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner-initial.component.spec.ts" visibleRegion="v4-test-5"/>

Algumas observações notáveis:

- O método estático `By.css()` seleciona nós `DebugElement` com um [seletor CSS padrão](https://developer.mozilla.org/docs/Learn/CSS/Building_blocks/Selectors 'CSS selectors').
- A query retorna um `DebugElement` para o parágrafo.
- Você deve desempacotar esse resultado para obter o elemento de parágrafo.

Quando você está filtrando por seletor CSS e testando apenas propriedades de um _elemento nativo_ do browser, a abordagem `By.css` pode ser excessiva.

Geralmente é mais direto e claro filtrar com um método `HTMLElement` padrão como `querySelector()` ou `querySelectorAll()`.
