<!-- ia-translate: true -->
# Testes de services

Para verificar se seus services estão funcionando conforme você pretende, você pode escrever testes especificamente para eles.

Services são frequentemente os arquivos mais suaves para fazer unit test.
Aqui estão alguns unit tests síncronos e assíncronos do `ValueService` escritos sem assistência dos utilitários de teste do Angular.

<docs-code header="app/demo/demo.spec.ts" path="adev/src/content/examples/testing/src/app/demo/demo.spec.ts" visibleRegion="ValueService"/>

## Testes de services com o `TestBed`

Sua aplicação depende da [injeção de dependência (DI)](guide/di) do Angular para criar services.
Quando um service tem um service dependente, DI encontra ou cria aquele service dependente.
E se aquele service dependente tem suas próprias dependências, DI as encontra ou cria também.

Como um _consumidor_ de service, você não se preocupa com nada disso.
Você não se preocupa com a ordem dos argumentos do constructor ou como eles são criados.

Como um _testador_ de service, você deve pelo menos pensar sobre o primeiro nível de dependências de service, mas você _pode_ deixar o DI do Angular fazer a criação do service e lidar com a ordem dos argumentos do constructor quando você usa o utilitário de teste `TestBed` para fornecer e criar services.

## `TestBed` do Angular

O `TestBed` é o mais importante dos utilitários de teste do Angular.
O `TestBed` cria um module _test_ do Angular construído dinamicamente que emula um [@NgModule](guide/ngmodules) do Angular.

O método `TestBed.configureTestingModule()` recebe um objeto de metadata que pode ter a maioria das propriedades de um [@NgModule](guide/ngmodules).

Para testar um service, você define a propriedade de metadata `providers` com um array dos services que você vai testar ou simular.

<docs-code header="app/demo/demo.testbed.spec.ts (provide ValueService in beforeEach)" path="adev/src/content/examples/testing/src/app/demo/demo.testbed.spec.ts" visibleRegion="value-service-before-each"/>

Então injete-o dentro de um teste chamando `TestBed.inject()` com a classe do service como argumento.

ÚTIL: `TestBed.get()` foi depreciado a partir do Angular versão 9.
Para ajudar a minimizar mudanças breaking, o Angular introduz uma nova função chamada `TestBed.inject()`, que você deve usar em vez disso.

<docs-code path="adev/src/content/examples/testing/src/app/demo/demo.testbed.spec.ts" visibleRegion="value-service-inject-it"/>

Ou dentro do `beforeEach()` se você preferir injetar o service como parte de sua configuração.

<docs-code path="adev/src/content/examples/testing/src/app/demo/demo.testbed.spec.ts" visibleRegion="value-service-inject-before-each"> </docs-code>

Ao testar um service com uma dependência, forneça o mock no array `providers`.

No exemplo seguinte, o mock é um objeto spy.

<docs-code path="adev/src/content/examples/testing/src/app/demo/demo.testbed.spec.ts" visibleRegion="master-service-before-each"/>

O teste consome aquele spy da mesma maneira que fez anteriormente.

<docs-code path="adev/src/content/examples/testing/src/app/demo/demo.testbed.spec.ts" visibleRegion="master-service-it"/>

## Testes sem `beforeEach()`

A maioria dos conjuntos de testes neste guia chama `beforeEach()` para definir as pré-condições para cada teste `it()` e depende do `TestBed` para criar classes e injetar services.

Há outra escola de testes que nunca chama `beforeEach()` e prefere criar classes explicitamente em vez de usar o `TestBed`.

Aqui está como você pode reescrever um dos testes `MasterService` nesse estilo.

Comece colocando código preparatório reutilizável em uma função _setup_ em vez de `beforeEach()`.

<docs-code header="app/demo/demo.spec.ts (setup)" path="adev/src/content/examples/testing/src/app/demo/demo.spec.ts" visibleRegion="no-before-each-setup"/>

A função `setup()` retorna um objeto literal com as variáveis, como `masterService`, que um teste pode referenciar.
Você não define variáveis _semi-globais_ \(por exemplo, `let masterService: MasterService`\) no corpo do `describe()`.

Então cada teste invoca `setup()` em sua primeira linha, antes de continuar com passos que manipulam o subject do teste e afirmam expectations.

<docs-code path="adev/src/content/examples/testing/src/app/demo/demo.spec.ts" visibleRegion="no-before-each-test"/>

Observe como o teste usa [_destructuring assignment_](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) para extrair as variáveis de setup que ele precisa.

<docs-code path="adev/src/content/examples/testing/src/app/demo/demo.spec.ts" visibleRegion="no-before-each-setup-call"/>

Muitos desenvolvedores sentem que esta abordagem é mais limpa e mais explícita do que o estilo tradicional `beforeEach()`.

Embora este guia de testes siga o estilo tradicional e os [schematics CLI](https://github.com/angular/angular-cli) padrão gerem arquivos de teste com `beforeEach()` e `TestBed`, sinta-se livre para adotar _esta abordagem alternativa_ em seus próprios projetos.

## Testes de services HTTP

Services de dados que fazem chamadas HTTP para servidores remotos normalmente injetam e delegam ao service [`HttpClient`](guide/http/testing) do Angular para chamadas XHR.

Você pode testar um service de dados com um spy `HttpClient` injetado como você testaria qualquer service com uma dependência.

<docs-code header="app/model/hero.service.spec.ts (tests with spies)" path="adev/src/content/examples/testing/src/app/model/hero.service.spec.ts" visibleRegion="test-with-spies"/>

IMPORTANTE: Os métodos `HeroService` retornam `Observables`.
Você deve _se inscrever_ em um observable para \(a\) fazer com que ele execute e \(b\) afirmar que o método teve sucesso ou falhou.

O método `subscribe()` recebe um callback de sucesso \(`next`\) e falha \(`error`\).
Certifique-se de fornecer _ambos_ os callbacks para que você capture erros.
Negligenciar isso produz um erro de observable assíncrono não capturado que o test runner provavelmente atribuirá a um teste completamente diferente.

## `HttpClientTestingModule`

Interações estendidas entre um service de dados e o `HttpClient` podem ser complexas e difíceis de simular com spies.

O `HttpClientTestingModule` pode tornar esses cenários de teste mais gerenciáveis.

Embora o _código de exemplo_ que acompanha este guia demonstre `HttpClientTestingModule`, esta página adia para o [guia Http](guide/http/testing), que cobre testes com o `HttpClientTestingModule` em detalhes.
