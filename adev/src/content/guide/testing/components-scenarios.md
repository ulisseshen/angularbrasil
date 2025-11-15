<!-- ia-translate: true -->

# Cenários de testes de components

Este guia explora casos de uso comuns de testes de components.

## Binding de component

Na aplicação de exemplo, o `BannerComponent` apresenta texto de título estático no template HTML.

Após algumas mudanças, o `BannerComponent` apresenta um título dinâmico fazendo binding com a propriedade `title` do component assim.

<docs-code header="app/banner/banner.component.ts" path="adev/src/content/examples/testing/src/app/banner/banner.component.ts" visibleRegion="component"/>

Por mais mínimo que seja, você decide adicionar um teste para confirmar que o component realmente exibe o conteúdo correto onde você pensa que deveria.

### Query para o `<h1>`

Você escreverá uma sequência de testes que inspecionam o valor do elemento `<h1>` que envolve o binding de interpolação da propriedade _title_.

Você atualiza o `beforeEach` para encontrar esse elemento com um `querySelector` HTML padrão e atribuí-lo à variável `h1`.

<docs-code header="app/banner/banner.component.spec.ts (setup)" path="adev/src/content/examples/testing/src/app/banner/banner.component.spec.ts" visibleRegion="setup"/>

### `createComponent()` não faz bind de dados

Para seu primeiro teste, você gostaria de ver que a tela exibe o `title` padrão.
Seu instinto é escrever um teste que imediatamente inspeciona o `<h1>` assim:

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner.component.spec.ts" visibleRegion="expect-h1-default-v1"/>

_Esse teste falha_ com a mensagem:

<docs-code language="javascript">

expected '' to contain 'Test Tour of Heroes'.

</docs-code>

Binding acontece quando o Angular executa **change detection**.

Em produção, change detection é acionado automaticamente quando o Angular cria um component ou o usuário pressiona uma tecla, por exemplo.

O `TestBed.createComponent` não aciona change detection por padrão; um fato confirmado no teste revisado:

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner.component.spec.ts" visibleRegion="test-w-o-detect-changes"/>

### `detectChanges()`

Você pode dizer ao `TestBed` para executar data binding chamando `fixture.detectChanges()`.
Somente então o `<h1>` tem o título esperado.

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner.component.spec.ts" visibleRegion="expect-h1-default"/>

Change detection atrasado é intencional e útil.
Ele dá ao testador uma oportunidade de inspecionar e alterar o estado do component _antes que o Angular inicie data binding e chame [lifecycle hooks](guide/components/lifecycle)_.

Aqui está outro teste que altera a propriedade `title` do component _antes_ de chamar `fixture.detectChanges()`.

<docs-code path="adev/src/content/examples/testing/src/app/banner/banner.component.spec.ts" visibleRegion="after-change"/>

### Change detection automático

Os testes de `BannerComponent` frequentemente chamam `detectChanges`.
Muitos testadores preferem que o ambiente de teste do Angular execute change detection automaticamente como faz em produção.

Isso é possível configurando o `TestBed` com o provider `ComponentFixtureAutoDetect`.
Primeiro importe-o da biblioteca utilitária de testes:

<docs-code header="app/banner/banner.component.detect-changes.spec.ts (import)" path="adev/src/content/examples/testing/src/app/banner/banner.component.detect-changes.spec.ts" visibleRegion="import-ComponentFixtureAutoDetect"/>

Então adicione-o ao array `providers` da configuração do module de teste:

<docs-code header="app/banner/banner.component.detect-changes.spec.ts (AutoDetect)" path="adev/src/content/examples/testing/src/app/banner/banner.component.detect-changes.spec.ts" visibleRegion="auto-detect"/>

ÚTIL: Você também pode usar a função `fixture.autoDetectChanges()` se quiser apenas ativar change detection automático
após fazer atualizações no estado do component do fixture. Além disso, change detection automático é ativado por padrão
quando se usa `provideZonelessChangeDetection` e desativá-lo não é recomendado.

Aqui estão três testes que ilustram como change detection automático funciona.

<docs-code header="app/banner/banner.component.detect-changes.spec.ts (AutoDetect Tests)" path="adev/src/content/examples/testing/src/app/banner/banner.component.detect-changes.spec.ts" visibleRegion="auto-detect-tests"/>

O primeiro teste mostra o benefício de change detection automático.

O segundo e terceiro testes revelam uma limitação importante.
O ambiente de testes do Angular não executa change detection sincronamente quando atualizações acontecem dentro do caso de teste que alterou o `title` do component.
O teste deve chamar `await fixture.whenStable` para esperar por outra rodada de change detection.

ÚTIL: O Angular não sabe sobre atualizações diretas em valores que não são signals. A maneira mais fácil de garantir que
change detection seja agendado é usar signals para valores lidos no template.

### Alterar um valor de input com `dispatchEvent()`

Para simular entrada do usuário, encontre o elemento input e defina sua propriedade `value`.

Mas há um passo essencial e intermediário.

O Angular não sabe que você definiu a propriedade `value` do elemento input.
Ele não lerá essa propriedade até que você acione o evento `input` do elemento chamando `dispatchEvent()`.

O exemplo seguinte demonstra a sequência adequada.

<docs-code header="app/hero/hero-detail.component.spec.ts (pipe test)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="title-case-pipe"/>

## Component com arquivos externos

O `BannerComponent` anterior é definido com um _template inline_ e _css inline_, especificados nas propriedades `@Component.template` e `@Component.styles` respectivamente.

Muitos components especificam _templates externos_ e _css externo_ com as propriedades `@Component.templateUrl` e `@Component.styleUrls` respectivamente, como a seguinte variante de `BannerComponent` faz.

<docs-code header="app/banner/banner-external.component.ts (metadata)" path="adev/src/content/examples/testing/src/app/banner/banner-external.component.ts" visibleRegion="metadata"/>

Esta sintaxe diz ao compilador Angular para ler os arquivos externos durante a compilação do component.

Isso não é um problema quando você executa o comando `ng test` da CLI porque ele _compila a aplicação antes de executar os testes_.

No entanto, se você executar os testes em um **ambiente não-CLI**, testes deste component podem falhar.
Por exemplo, se você executar os testes de `BannerComponent` em um ambiente de codificação web como [plunker](https://plnkr.co), você verá uma mensagem como esta:

<docs-code hideCopy language="shell">

Error: This test module uses the component BannerComponent
which is using a "templateUrl" or "styleUrls", but they were never compiled.
Please call "TestBed.compileComponents" before your test.

</docs-code>

Você obtém esta mensagem de falha de teste quando o ambiente de runtime compila o código fonte _durante os próprios testes_.

Para corrigir o problema, chame `compileComponents()`.

## Component com uma dependência

Components frequentemente têm dependências de services.

O `WelcomeComponent` exibe uma mensagem de boas-vindas ao usuário logado.
Ele sabe quem é o usuário com base em uma propriedade do `UserService` injetado:

<docs-code header="app/welcome/welcome.component.ts" path="adev/src/content/examples/testing/src/app/welcome/welcome.component.ts"/>

O `WelcomeComponent` tem lógica de decisão que interage com o service, lógica que torna este component digno de teste.

### Fornecer test doubles de service

Um _component-under-test_ não precisa receber services reais.

Injetar o `UserService` real poderia ser difícil.
O service real pode pedir credenciais de login do usuário e tentar alcançar um servidor de autenticação.
Esses comportamentos podem ser difíceis de interceptar. Esteja ciente de que usar test doubles faz o teste se comportar de forma diferente da produção, então use-os com moderação.

### Obter services injetados

Os testes precisam de acesso ao `UserService` injetado no `WelcomeComponent`.

O Angular tem um sistema de injeção hierárquico.
Pode haver injectors em múltiplos níveis, do injector raiz criado pelo `TestBed` até a árvore de components.

A maneira mais segura de obter o service injetado, a maneira que **_sempre funciona_**,
é **obtê-lo do injector do _component-under-test_**.
O injector do component é uma propriedade do `DebugElement` do fixture.

<docs-code header="WelcomeComponent's injector" path="adev/src/content/examples/testing/src/app/welcome/welcome.component.spec.ts" visibleRegion="injected-service"/>

ÚTIL: Isso _geralmente_ não é necessário. Services são frequentemente fornecidos na raiz ou o TestBed os sobrescreve e podem ser recuperados mais facilmente com `TestBed.inject()` (veja abaixo).

### `TestBed.inject()`

Isso é mais fácil de lembrar e menos verboso do que recuperar um service usando o `DebugElement` do fixture.

Neste conjunto de testes, o _único_ provider de `UserService` é o module de teste raiz, então é seguro chamar `TestBed.inject()` da seguinte forma:

<docs-code header="TestBed injector" path="adev/src/content/examples/testing/src/app/welcome/welcome.component.spec.ts" visibleRegion="inject-from-testbed" />

ÚTIL: Para um caso de uso em que `TestBed.inject()` não funciona, veja a seção [_Override component providers_](#override-component-providers) que explica quando e por que você deve obter o service do injector do component.

### Configuração final e testes

Aqui está o `beforeEach()` completo, usando `TestBed.inject()`:

<docs-code header="app/welcome/welcome.component.spec.ts" path="adev/src/content/examples/testing/src/app/welcome/welcome.component.spec.ts" visibleRegion="setup"/>

E aqui estão alguns testes:

<docs-code header="app/welcome/welcome.component.spec.ts" path="adev/src/content/examples/testing/src/app/welcome/welcome.component.spec.ts" visibleRegion="tests"/>

O primeiro é um teste de sanidade; ele confirma que o `UserService` é chamado e está funcionando.

ÚTIL: A função withContext \(por exemplo, `'expected name'`\) é um rótulo de falha opcional.
Se a expectation falhar, o Jasmine anexa este rótulo à mensagem de falha da expectation.
Em uma spec com múltiplas expectations, pode ajudar a esclarecer o que deu errado e qual expectation falhou.

Os testes restantes confirmam a lógica do component quando o service retorna valores diferentes.
O segundo teste valida o efeito de alterar o nome do usuário.
O terceiro teste verifica que o component exibe a mensagem adequada quando não há usuário logado.

## Component com service assíncrono

Neste exemplo, o template `AboutComponent` hospeda um `TwainComponent`.
O `TwainComponent` exibe citações de Mark Twain.

<docs-code header="app/twain/twain.component.ts (template)" path="adev/src/content/examples/testing/src/app/twain/twain.component.ts" visibleRegion="template" />

ÚTIL: O valor da propriedade `quote` do component passa por um `AsyncPipe`.
Isso significa que a propriedade retorna ou uma `Promise` ou um `Observable`.

Neste exemplo, o método `TwainComponent.getQuote()` diz que a propriedade `quote` retorna um `Observable`.

<docs-code header="app/twain/twain.component.ts (getQuote)" path="adev/src/content/examples/testing/src/app/twain/twain.component.ts" visibleRegion="get-quote"/>

O `TwainComponent` obtém citações de um `TwainService` injetado.
O component inicia o `Observable` retornado com um valor placeholder \(`'...'`\), antes que o service possa retornar sua primeira citação.

O `catchError` intercepta erros do service, prepara uma mensagem de erro e retorna o valor placeholder no canal de sucesso.

Estes são todos recursos que você vai querer testar.

### Testes com um spy

Ao testar um component, apenas a API pública do service deve importar.
Em geral, os próprios testes não devem fazer chamadas a servidores remotos.
Eles devem emular tais chamadas.
A configuração neste `app/twain/twain.component.spec.ts` mostra uma maneira de fazer isso:

<docs-code header="app/twain/twain.component.spec.ts (setup)" path="adev/src/content/examples/testing/src/app/twain/twain.component.spec.ts" visibleRegion="setup"/>

Foque no spy.

<docs-code path="adev/src/content/examples/testing/src/app/twain/twain.component.spec.ts" visibleRegion="spy"/>

O spy é projetado de modo que qualquer chamada a `getQuote` recebe um observable com uma citação de teste.
Diferentemente do método `getQuote()` real, este spy ignora o servidor e retorna um observable síncrono cujo valor está disponível imediatamente.

Você pode escrever muitos testes úteis com este spy, mesmo que seu `Observable` seja síncrono.

ÚTIL: É melhor limitar o uso de spies apenas ao que é necessário para o teste. Criar mocks ou spies para mais do que o necessário pode ser frágil. À medida que o component e o injectable evoluem, os testes não relacionados podem falhar porque não simulam mais comportamentos suficientes que de outra forma não afetariam o teste.

### Teste assíncrono com `fakeAsync()`

Para usar a funcionalidade `fakeAsync()`, você deve importar `zone.js/testing` no seu arquivo de configuração de teste.
Se você criou seu projeto com a Angular CLI, `zone-testing` já está importado em `src/test.ts`.

O teste seguinte confirma o comportamento esperado quando o service retorna um `ErrorObservable`.

<docs-code path="adev/src/content/examples/testing/src/app/twain/twain.component.spec.ts" visibleRegion="error-test"/>

ÚTIL: A função `it()` recebe um argumento da seguinte forma.

<docs-code language="javascript">

fakeAsync(() => { /_test body_/ })

</docs-code>

A função `fakeAsync()` habilita um estilo de codificação linear executando o corpo do teste em uma `fakeAsync test zone` especial.
O corpo do teste parece ser síncrono.
Não há sintaxe aninhada \(como um `Promise.then()`\) para interromper o fluxo de controle.

ÚTIL: Limitação: A função `fakeAsync()` não funcionará se o corpo do teste fizer uma chamada `XMLHttpRequest` \(XHR\).
Chamadas XHR dentro de um teste são raras, mas se você precisar chamar XHR, use `waitForAsync()`.

IMPORTANTE: Esteja ciente de que tarefas assíncronas que acontecem dentro da zona `fakeAsync` precisam ser executadas manualmente com `flush` ou `tick`. Se você tentar
aguardar que elas sejam concluídas (ou seja, usando `fixture.whenStable`) sem usar os
helpers de teste `fakeAsync` para avançar o tempo, seu teste provavelmente falhará. Veja abaixo para mais informações.

### A função `tick()`

Você precisa chamar [tick()](api/core/testing/tick) para avançar o relógio virtual.

Chamar [tick()](api/core/testing/tick) simula a passagem do tempo até que todas as atividades assíncronas pendentes terminem.
Neste caso, ele espera pelo `setTimeout()` do observable.

A função [tick()](api/core/testing/tick) aceita `millis` e `tickOptions` como parâmetros. O parâmetro `millis` especifica quanto o relógio virtual avança e o padrão é `0` se não fornecido.
Por exemplo, se você tiver um `setTimeout(fn, 100)` em um teste `fakeAsync()`, você precisa usar `tick(100)` para acionar o callback fn.
O parâmetro `tickOptions` opcional tem uma propriedade chamada `processNewMacroTasksSynchronously`. A propriedade `processNewMacroTasksSynchronously` representa se deve invocar novas macro tasks geradas ao fazer tick e o padrão é `true`.

<docs-code path="adev/src/content/examples/testing/src/app/demo/async-helper.spec.ts" visibleRegion="fake-async-test-tick"/>

A função [tick()](api/core/testing/tick) é um dos utilitários de teste do Angular que você importa com `TestBed`.
É uma companheira de `fakeAsync()` e você só pode chamá-la dentro de um corpo `fakeAsync()`.

### tickOptions

Neste exemplo, você tem uma nova macro task, a função `setTimeout` aninhada. Por padrão, quando o `tick` é setTimeout, `outside` e `nested` serão ambos acionados.

<docs-code path="adev/src/content/examples/testing/src/app/demo/async-helper.spec.ts" visibleRegion="fake-async-test-tick-new-macro-task-sync"/>

Em alguns casos, você não quer acionar a nova macro task ao fazer tick. Você pode usar `tick(millis, {processNewMacroTasksSynchronously: false})` para não invocar uma nova macro task.

<docs-code path="adev/src/content/examples/testing/src/app/demo/async-helper.spec.ts" visibleRegion="fake-async-test-tick-new-macro-task-async"/>

### Comparando datas dentro de fakeAsync()

`fakeAsync()` simula a passagem do tempo, o que permite calcular a diferença entre datas dentro de `fakeAsync()`.

<docs-code path="adev/src/content/examples/testing/src/app/demo/async-helper.spec.ts" visibleRegion="fake-async-test-date"/>

### jasmine.clock com fakeAsync()

O Jasmine também fornece um recurso `clock` para simular datas.
O Angular executa automaticamente testes que são executados após `jasmine.clock().install()` ser chamado dentro de um método `fakeAsync()` até que `jasmine.clock().uninstall()` seja chamado.
`fakeAsync()` não é necessário e lança um erro se aninhado.

Por padrão, este recurso está desabilitado.
Para habilitá-lo, defina uma flag global antes de importar `zone-testing`.

Se você usa a Angular CLI, configure esta flag em `src/test.ts`.

<docs-code language="typescript">

[window as any]('__zone_symbol__fakeAsyncPatchLock') = true;
import 'zone.js/testing';

</docs-code>

<docs-code path="adev/src/content/examples/testing/src/app/demo/async-helper.spec.ts" visibleRegion="fake-async-test-clock"/>

### Usando o scheduler RxJS dentro de fakeAsync()

Você também pode usar o scheduler RxJS em `fakeAsync()` assim como usar `setTimeout()` ou `setInterval()`, mas você precisa importar `zone.js/plugins/zone-patch-rxjs-fake-async` para aplicar patch no scheduler RxJS.

<docs-code path="adev/src/content/examples/testing/src/app/demo/async-helper.spec.ts" visibleRegion="fake-async-test-rxjs"/>

### Suportar mais macroTasks

Por padrão, `fakeAsync()` suporta as seguintes macro tasks.

- `setTimeout`
- `setInterval`
- `requestAnimationFrame`
- `webkitRequestAnimationFrame`
- `mozRequestAnimationFrame`

Se você executar outras macro tasks como `HTMLCanvasElement.toBlob()`, um erro _"Unknown macroTask scheduled in fake async test"_ é lançado.

<docs-code-multifile>
    <docs-code header="src/app/shared/canvas.component.spec.ts (failing)" path="adev/src/content/examples/testing/src/app/shared/canvas.component.spec.ts" visibleRegion="without-toBlob-macrotask"/>
    <docs-code header="src/app/shared/canvas.component.ts" path="adev/src/content/examples/testing/src/app/shared/canvas.component.ts" visibleRegion="main"/>
</docs-code-multifile>

Se você quiser suportar tal caso, você precisa definir a macro task que quer suportar em `beforeEach()`.
Por exemplo:

<docs-code header="src/app/shared/canvas.component.spec.ts (excerpt)" path="adev/src/content/examples/testing/src/app/shared/canvas.component.spec.ts" visibleRegion="enable-toBlob-macrotask"/>

ÚTIL: Para tornar o elemento `<canvas>` ciente do Zone.js em sua aplicação, você precisa importar o patch `zone-patch-canvas` \(seja em `polyfills.ts` ou no arquivo específico que usa `<canvas>`\):

<docs-code header="src/polyfills.ts or src/app/shared/canvas.component.ts" path="adev/src/content/examples/testing/src/app/shared/canvas.component.ts" visibleRegion="import-canvas-patch"/>

### Observables assíncronos

Você pode estar satisfeito com a cobertura de testes desses testes.

No entanto, você pode estar preocupado com o fato de que o service real não se comporta exatamente assim.
O service real envia requisições a um servidor remoto.
Um servidor leva tempo para responder e a resposta certamente não estará disponível imediatamente como nos dois testes anteriores.

Seus testes refletirão o mundo real com mais fidelidade se você retornar um observable _assíncrono_ do spy `getQuote()` assim.

<docs-code path="adev/src/content/examples/testing/src/app/twain/twain.component.spec.ts" visibleRegion="async-setup"/>

### Helpers de observable assíncrono

O observable assíncrono foi produzido por um helper `asyncData`.
O helper `asyncData` é uma função utilitária que você terá que escrever você mesmo, ou copiar esta do código de exemplo.

<docs-code header="testing/async-observable-helpers.ts" path="adev/src/content/examples/testing/src/testing/async-observable-helpers.ts" visibleRegion="async-data"/>

Este observable do helper emite o valor `data` no próximo turno do motor JavaScript.

O [operador `defer()` do RxJS](http://reactivex.io/documentation/operators/defer.html) retorna um observable.
Ele recebe uma função factory que retorna uma promise ou um observable.
Quando algo se inscreve no observable do _defer_, ele adiciona o subscriber a um novo observable criado com aquela factory.

O operador `defer()` transforma o `Promise.resolve()` em um novo observable que, como `HttpClient`, emite uma vez e completa.
Subscribers são desincritos após receberem o valor de dados.

Há um helper similar para produzir um erro assíncrono.

<docs-code path="adev/src/content/examples/testing/src/testing/async-observable-helpers.ts" visibleRegion="async-error"/>

### Mais testes assíncronos

Agora que o spy `getQuote()` está retornando observables assíncronos, a maioria de seus testes terá que ser assíncrona também.

Aqui está um teste `fakeAsync()` que demonstra o fluxo de dados que você esperaria no mundo real.

<docs-code path="adev/src/content/examples/testing/src/app/twain/twain.component.spec.ts" visibleRegion="fake-async-test"/>

Observe que o elemento de citação exibe o valor placeholder \(`'...'`\) após `ngOnInit()`.
A primeira citação ainda não chegou.

Para liberar a primeira citação do observable, você chama [tick()](api/core/testing/tick).
Então chame `detectChanges()` para dizer ao Angular para atualizar a tela.

Então você pode afirmar que o elemento de citação exibe o texto esperado.

### Teste assíncrono sem `fakeAsync()`

Aqui está o teste `fakeAsync()` anterior, reescrito com `async`.

<docs-code path="adev/src/content/examples/testing/src/app/twain/twain.component.spec.ts" visibleRegion="async-test"/>

### `whenStable`

O teste deve esperar que o observable `getQuote()` emita a próxima citação.
Em vez de chamar [tick()](api/core/testing/tick), ele chama `fixture.whenStable()`.

O `fixture.whenStable()` retorna uma promise que resolve quando a fila de tarefas do motor JavaScript fica vazia.
Neste exemplo, a fila de tarefas fica vazia quando o observable emite a primeira citação.

## Component com inputs e outputs

Um component com inputs e outputs normalmente aparece dentro do template de view de um component host.
O host usa um property binding para definir a propriedade input e um event binding para ouvir eventos levantados pela propriedade output.

O objetivo do teste é verificar que tais bindings funcionam conforme esperado.
Os testes devem definir valores input e ouvir eventos output.

O `DashboardHeroComponent` é um pequeno exemplo de um component neste papel.
Ele exibe um hero individual fornecido pelo `DashboardComponent`.
Clicar naquele hero diz ao `DashboardComponent` que o usuário selecionou o hero.

O `DashboardHeroComponent` é incorporado no template `DashboardComponent` assim:

<docs-code header="app/dashboard/dashboard.component.html (excerpt)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard.component.html" visibleRegion="dashboard-hero"/>

O `DashboardHeroComponent` aparece em um bloco `@for`, que define a propriedade input `hero` de cada component para o valor em loop e ouve o evento `selected` do component.

Aqui está a definição completa do component:

<docs-code header="app/dashboard/dashboard-hero.component.ts (component)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.ts" visibleRegion="component"/>

Embora testar um component tão simples tenha pouco valor intrínseco, vale a pena saber como.
Use uma dessas abordagens:

- Teste-o como usado por `DashboardComponent`
- Teste-o como um component autônomo
- Teste-o como usado por um substituto para `DashboardComponent`

O objetivo imediato é testar o `DashboardHeroComponent`, não o `DashboardComponent`, então tente a segunda e terceira opções.

### Testar `DashboardHeroComponent` autônomo {#provide-a-spy-stub-herodetailservicespy}

Aqui está a parte principal da configuração do arquivo spec.

<docs-code header="app/dashboard/dashboard-hero.component.spec.ts (setup)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="setup"/>

Observe como o código de configuração atribui um hero de teste \(`expectedHero`\) à propriedade `hero` do component, emulando a maneira como o `DashboardComponent` a definiria usando o property binding em seu repetidor.

O teste seguinte verifica que o nome do hero é propagado para o template usando um binding.

<docs-code path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="name-test"/>

Como o template passa o nome do hero através do `UpperCasePipe` do Angular, o teste deve corresponder o valor do elemento com o nome em maiúsculas.

### Clicar

Clicar no hero deve acionar um evento `selected` que o component host \(presumivelmente `DashboardComponent`\) pode ouvir:

<docs-code path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="click-test"/>

A propriedade `selected` do component retorna um `EventEmitter`, que parece um `Observable` síncrono RxJS para consumidores.
O teste se inscreve nele _explicitamente_ assim como o component host faz _implicitamente_.

Se o component se comporta como esperado, clicar no elemento do hero deve dizer à propriedade `selected` do component para emitir o objeto `hero`.

O teste detecta aquele evento através de sua inscrição em `selected`.

### `triggerEventHandler`

O `heroDe` no teste anterior é um `DebugElement` que representa o `<div>` do hero.

Ele tem propriedades e métodos do Angular que abstraem a interação com o elemento nativo.
Este teste chama o `DebugElement.triggerEventHandler` com o nome do evento "click".
O binding do evento "click" responde chamando `DashboardHeroComponent.click()`.

O `DebugElement.triggerEventHandler` do Angular pode acionar _qualquer evento data-bound_ por seu _nome de evento_.
O segundo parâmetro é o objeto de evento passado ao handler.

O teste acionou um evento "click".

<docs-code path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="trigger-event-handler"/>

Neste caso, o teste assume corretamente que o handler de evento runtime, o método `click()` do component, não se importa com o objeto de evento.

ÚTIL: Outros handlers são menos tolerantes.
Por exemplo, a directive `RouterLink` espera um objeto com uma propriedade `button` que identifica qual botão do mouse, se houver, foi pressionado durante o clique.
A directive `RouterLink` lança um erro se o objeto de evento estiver faltando.

### Clicar no elemento

A seguinte alternativa de teste chama o método `click()` próprio do elemento nativo, o que é perfeitamente adequado para _este component_.

<docs-code path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="click-test-2"/>

### Helper `click()`

Clicar em um botão, uma âncora ou um elemento HTML arbitrário é uma tarefa de teste comum.

Torne isso consistente e direto encapsulando o processo de _acionamento de clique_ em um helper como a seguinte função `click()`:

<docs-code header="testing/index.ts (click helper)" path="adev/src/content/examples/testing/src/testing/index.ts" visibleRegion="click-event"/>

O primeiro parâmetro é o _elemento-para-clicar_.
Se quiser, passe um objeto de evento personalizado como segundo parâmetro.
O padrão é um [objeto de evento de mouse de botão esquerdo](https://developer.mozilla.org/docs/Web/API/MouseEvent/button) parcial aceito por muitos handlers incluindo a directive `RouterLink`.

IMPORTANTE: A função helper `click()` **não** é um dos utilitários de teste do Angular.
É uma função definida no _código de exemplo deste guia_.
Todos os testes de exemplo a usam.
Se você gostar, adicione-a à sua própria coleção de helpers.

Aqui está o teste anterior, reescrito usando o helper click.

<docs-code header="app/dashboard/dashboard-hero.component.spec.ts (test with click helper)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="click-test-3"/>

## Component dentro de um test host

Os testes anteriores desempenharam o papel do `DashboardComponent` host eles mesmos.
Mas o `DashboardHeroComponent` funciona corretamente quando adequadamente vinculado por data-binding a um component host?

<docs-code header="app/dashboard/dashboard-hero.component.spec.ts (test host)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="test-host"/>

O test host define a propriedade input `hero` do component com seu hero de teste.
Ele vincula o evento `selected` do component com seu handler `onSelected`, que registra o hero emitido em sua propriedade `selectedHero`.

Mais tarde, os testes poderão verificar `selectedHero` para verificar que o evento `DashboardHeroComponent.selected` emitiu o hero esperado.

A configuração para os testes `test-host` é similar à configuração para os testes autônomos:

<docs-code header="app/dashboard/dashboard-hero.component.spec.ts (test host setup)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="test-host-setup"/>

Esta configuração do module de testes mostra duas diferenças importantes:

- Ele _cria_ o `TestHostComponent` em vez do `DashboardHeroComponent`
- O `TestHostComponent` define o `DashboardHeroComponent.hero` com um binding

O `createComponent` retorna um `fixture` que contém uma instância de `TestHostComponent` em vez de uma instância de `DashboardHeroComponent`.

Criar o `TestHostComponent` tem o efeito colateral de criar um `DashboardHeroComponent` porque o último aparece dentro do template do primeiro.
A query para o elemento hero \(`heroEl`\) ainda o encontra no DOM de teste, embora a maior profundidade na árvore de elementos do que antes.

Os próprios testes são quase idênticos à versão autônoma:

<docs-code header="app/dashboard/dashboard-hero.component.spec.ts (test-host)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard-hero.component.spec.ts" visibleRegion="test-host-tests"/>

Apenas o teste do evento selected difere.
Ele confirma que o hero `DashboardHeroComponent` selecionado realmente encontra seu caminho através do event binding até o component host.

## Routing component

Um _routing component_ é um component que diz ao `Router` para navegar para outro component.
O `DashboardComponent` é um _routing component_ porque o usuário pode navegar para o `HeroDetailComponent` clicando em um dos _botões de hero_ no dashboard.

O Angular fornece helpers de teste para reduzir boilerplate e testar código de forma mais eficaz que depende de `HttpClient`. A função `provideRouter` também pode ser usada diretamente no module de teste.

<docs-code header="app/dashboard/dashboard.component.spec.ts" path="adev/src/content/examples/testing/src/app/dashboard/dashboard.component.spec.ts" visibleRegion="router-harness"/>

O teste seguinte clica no hero exibido e confirma que navegamos para a URL esperada.

<docs-code header="app/dashboard/dashboard.component.spec.ts (navigate test)" path="adev/src/content/examples/testing/src/app/dashboard/dashboard.component.spec.ts" visibleRegion="navigate-test"/>

## Routed components

Um _routed component_ é o destino de uma navegação do `Router`.
Pode ser mais complicado de testar, especialmente quando a rota para o component _inclui parâmetros_.
O `HeroDetailComponent` é um _routed component_ que é o destino de tal rota.

Quando um usuário clica em um hero do _Dashboard_, o `DashboardComponent` diz ao `Router` para navegar para `heroes/:id`.
O `:id` é um parâmetro de rota cujo valor é o `id` do hero a ser editado.

O `Router` corresponde aquela URL a uma rota para o `HeroDetailComponent`.
Ele cria um objeto `ActivatedRoute` com as informações de roteamento e o injeta em uma nova instância do `HeroDetailComponent`.

Aqui estão os services injetados no `HeroDetailComponent`:

<docs-code header="app/hero/hero-detail.component.ts (inject)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.ts" visibleRegion="inject"/>

O `HeroDetail` component precisa do parâmetro `id` para que possa buscar o hero correspondente usando o `HeroDetailService`.
O component tem que obter o `id` da propriedade `ActivatedRoute.paramMap` que é um `Observable`.

Ele não pode simplesmente referenciar a propriedade `id` do `ActivatedRoute.paramMap`.
O component tem que _se inscrever_ no observable `ActivatedRoute.paramMap` e estar preparado para o `id` mudar durante seu tempo de vida.

<docs-code header="app/hero/hero-detail.component.ts (constructor)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.ts" visibleRegion="ctor"/>

Os testes podem explorar como o `HeroDetailComponent` responde a diferentes valores do parâmetro `id` navegando para rotas diferentes.

## Testes de components aninhados

Templates de components frequentemente têm components aninhados, cujos templates podem conter mais components.

A árvore de components pode ser muito profunda e às vezes os components aninhados não desempenham papel algum em testar o component no topo da árvore.

O `AppComponent`, por exemplo, exibe uma barra de navegação com âncoras e suas directives `RouterLink`.

<docs-code header="app/app.component.html" path="adev/src/content/examples/testing/src/app/app.component.html"/>

Para validar os links mas não a navegação, você não precisa do `Router` para navegar e não precisa do `<router-outlet>` para marcar onde o `Router` insere _routed components_.

O `BannerComponent` e `WelcomeComponent` \(indicados por `<app-banner>` e `<app-welcome>`\) também são irrelevantes.

No entanto, qualquer teste que cria o `AppComponent` no DOM também cria instâncias desses três components e, se você deixar isso acontecer, terá que configurar o `TestBed` para criá-los.

Se você negligenciar declará-los, o compilador Angular não reconhecerá as tags `<app-banner>`, `<app-welcome>` e `<router-outlet>` no template `AppComponent` e lançará um erro.

Se você declarar os components reais, também terá que declarar _seus_ components aninhados e fornecer _todos_ os services injetados em _qualquer_ component na árvore.

Esta seção descreve duas técnicas para minimizar a configuração.
Use-as, sozinhas ou em combinação, para permanecer focado em testar o component primário.

### Stubbing de components desnecessários

Na primeira técnica, você cria e declara versões stub dos components e directive que desempenham pouco ou nenhum papel nos testes.

<docs-code header="app/app.component.spec.ts (stub declaration)" path="adev/src/content/examples/testing/src/app/app.component.spec.ts" visibleRegion="component-stubs"/>

Os seletores stub correspondem aos seletores dos components reais correspondentes.
Mas seus templates e classes estão vazios.

Então declare-os sobrescrevendo os `imports` do seu component usando `TestBed.overrideComponent`.

<docs-code header="app/app.component.spec.ts (TestBed stubs)" path="adev/src/content/examples/testing/src/app/app.component.spec.ts" visibleRegion="testbed-stubs"/>

ÚTIL: A chave `set` neste exemplo substitui todos os imports existentes no seu component, certifique-se de importar todas as dependências, não apenas os stubs. Alternativamente, você pode usar as chaves `remove`/`add` para remover e adicionar imports seletivamente.

### `NO_ERRORS_SCHEMA`

Na segunda abordagem, adicione `NO_ERRORS_SCHEMA` aos overrides de metadata do seu component.

<docs-code header="app/app.component.spec.ts (NO_ERRORS_SCHEMA)" path="adev/src/content/examples/testing/src/app/app.component.spec.ts" visibleRegion="no-errors-schema"/>

O `NO_ERRORS_SCHEMA` diz ao compilador Angular para ignorar elementos e atributos não reconhecidos.

O compilador reconhece o elemento `<app-root>` e o atributo `routerLink` porque você declarou um `AppComponent` e `RouterLink` correspondentes na configuração do `TestBed`.

Mas o compilador não lançará um erro quando encontrar `<app-banner>`, `<app-welcome>` ou `<router-outlet>`.
Ele simplesmente os renderiza como tags vazias e o browser os ignora.

Você não precisa mais dos stub components.

### Use ambas as técnicas juntas

Estas são técnicas para _Shallow Component Testing_, assim chamadas porque reduzem a superfície visual do component apenas àqueles elementos no template do component que importam para os testes.

A abordagem `NO_ERRORS_SCHEMA` é a mais fácil das duas, mas não a use em excesso.

O `NO_ERRORS_SCHEMA` também impede que o compilador diga sobre os components e atributos faltantes que você omitiu inadvertidamente ou digitou incorretamente.
Você pode desperdiçar horas perseguindo bugs fantasmas que o compilador teria capturado em um instante.

A abordagem de _stub component_ tem outra vantagem.
Embora os stubs neste _exemplo_ estivessem vazios, você poderia dar a eles templates e classes simplificados se seus testes precisarem interagir com eles de alguma forma.

Na prática, você combinará as duas técnicas na mesma configuração, como visto neste exemplo.

<docs-code header="app/app.component.spec.ts (mixed setup)" path="adev/src/content/examples/testing/src/app/app.component.spec.ts" visibleRegion="mixed-setup"/>

O compilador Angular cria o `BannerStubComponent` para o elemento `<app-banner>` e aplica o `RouterLink` às âncoras com o atributo `routerLink`, mas ignora as tags `<app-welcome>` e `<router-outlet>`.

### `By.directive` e directives injetadas

Um pouco mais de configuração aciona o data binding inicial e obtém referências aos links de navegação:

<docs-code header="app/app.component.spec.ts (test setup)" path="adev/src/content/examples/testing/src/app/app.component.spec.ts" visibleRegion="test-setup"/>

Três pontos de interesse especial:

- Localize os elementos âncora com uma directive anexada usando `By.directive`
- A query retorna wrappers `DebugElement` em torno dos elementos correspondentes
- Cada `DebugElement` expõe um dependency injector com a instância específica da directive anexada àquele elemento

Os links do `AppComponent` a validar são os seguintes:

<docs-code header="app/app.component.html (navigation links)" path="adev/src/content/examples/testing/src/app/app.component.html" visibleRegion="links"/>

Aqui estão alguns testes que confirmam que esses links estão conectados às directives `routerLink` conforme esperado:

<docs-code header="app/app.component.spec.ts (selected tests)" path="adev/src/content/examples/testing/src/app/app.component.spec.ts" visibleRegion="tests"/>

## Usar um objeto `page`

O `HeroDetailComponent` é uma view simples com um título, dois campos hero e dois botões.

Mas há bastante complexidade de template mesmo neste formulário simples.

<docs-code
  path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.html" header="app/hero/hero-detail.component.html"/>

Testes que exercitam o component precisam …

- Esperar até que um hero chegue antes que elementos apareçam no DOM
- Uma referência ao texto do título
- Uma referência à caixa de input do nome para inspecioná-la e defini-la
- Referências aos dois botões para que possam clicar neles

Mesmo um formulário pequeno como este pode produzir uma confusão de configuração condicional torturada e seleção de elementos CSS.

Domar a complexidade com uma classe `Page` que lida com acesso a propriedades do component e encapsula a lógica que as define.

Aqui está tal classe `Page` para o `hero-detail.component.spec.ts`

<docs-code header="app/hero/hero-detail.component.spec.ts (Page)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="page"/>

Agora os hooks importantes para manipulação e inspeção do component estão organizados de forma organizada e acessíveis a partir de uma instância de `Page`.

Um método `createComponent` cria um objeto `page` e preenche os espaços em branco uma vez que o `hero` chega.

<docs-code header="app/hero/hero-detail.component.spec.ts (createComponent)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="create-component"/>

Aqui estão mais alguns testes `HeroDetailComponent` para reforçar o ponto.

<docs-code header="app/hero/hero-detail.component.spec.ts (selected tests)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="selected-tests"/>

## Override de component providers {#override-component-providers}

O `HeroDetailComponent` fornece seu próprio `HeroDetailService`.

<docs-code header="app/hero/hero-detail.component.ts (prototype)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.ts" visibleRegion="prototype"/>

Não é possível fazer stub do `HeroDetailService` do component nos `providers` do `TestBed.configureTestingModule`.
Esses são providers para o _module de teste_, não o component.
Eles preparam o dependency injector no _nível do fixture_.

O Angular cria o component com seu _próprio_ injector, que é um _filho_ do injector do fixture.
Ele registra os providers do component \(o `HeroDetailService` neste caso\) com o injector filho.

Um teste não pode obter services do injector filho a partir do injector do fixture.
E `TestBed.configureTestingModule` também não pode configurá-los.

O Angular criou novas instâncias do `HeroDetailService` real o tempo todo!

ÚTIL: Esses testes podem falhar ou expirar se o `HeroDetailService` fizer suas próprias chamadas XHR a um servidor remoto.
Pode não haver um servidor remoto para chamar.

Felizmente, o `HeroDetailService` delega responsabilidade por acesso a dados remotos a um `HeroService` injetado.

<docs-code header="app/hero/hero-detail.service.ts (prototype)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.service.ts" visibleRegion="prototype"/>

A configuração de teste anterior substitui o `HeroService` real por um `TestHeroService` que intercepta requisições do servidor e falsifica suas respostas.

E se você não tiver tanta sorte.
E se falsificar o `HeroService` for difícil?
E se `HeroDetailService` fizer suas próprias requisições ao servidor?

O método `TestBed.overrideComponent` pode substituir os `providers` do component por _test doubles_ fáceis de gerenciar como visto na seguinte variação de configuração:

<docs-code header="app/hero/hero-detail.component.spec.ts (Override setup)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="setup-override"/>

Observe que `TestBed.configureTestingModule` não fornece mais um `HeroService` falso porque não é [necessário](#provide-a-spy-stub-herodetailservicespy).

### O método `overrideComponent`

Foque no método `overrideComponent`.

<docs-code header="app/hero/hero-detail.component.spec.ts (overrideComponent)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="override-component-method"/>

Ele recebe dois argumentos: o tipo de component a sobrescrever \(`HeroDetailComponent`\) e um objeto de metadata de override.
O [objeto de metadata de override](guide/testing/utility-apis#metadata-override-object) é um genérico definido da seguinte forma:

<docs-code language="javascript">

type MetadataOverride<T> = {
add?: Partial<T>;
remove?: Partial<T>;
set?: Partial<T>;
};

</docs-code>

Um objeto de metadata de override pode adicionar e remover elementos nas propriedades de metadata ou redefinir completamente essas propriedades.
Este exemplo redefine a metadata `providers` do component.

O parâmetro de tipo, `T`, é o tipo de metadata que você passaria para o decorator `@Component`:

<docs-code language="javascript">

selector?: string;
template?: string;
templateUrl?: string;
providers?: any[];
…

</docs-code>

### Fornecer um _spy stub_ (`HeroDetailServiceSpy`)

Este exemplo substitui completamente o array `providers` do component por um novo array contendo um `HeroDetailServiceSpy`.

O `HeroDetailServiceSpy` é uma versão stubbed do `HeroDetailService` real que falsifica todos os recursos necessários daquele service.
Ele nem injeta nem delega para o `HeroService` de nível inferior, então não há necessidade de fornecer um test double para isso.

Os testes `HeroDetailComponent` relacionados afirmarão que métodos do `HeroDetailService` foram chamados espiando os métodos do service.
Consequentemente, o stub implementa seus métodos como spies:

<docs-code header="app/hero/hero-detail.component.spec.ts (HeroDetailServiceSpy)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="hds-spy"/>

### Os testes de override

Agora os testes podem controlar o hero do component diretamente manipulando o `testHero` do spy-stub e confirmar que métodos do service foram chamados.

<docs-code header="app/hero/hero-detail.component.spec.ts (override tests)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="override-tests"/>

### Mais overrides

O método `TestBed.overrideComponent` pode ser chamado várias vezes para os mesmos ou diferentes components.
O `TestBed` oferece métodos similares `overrideDirective`, `overrideModule` e `overridePipe` para cavar e substituir partes dessas outras classes.

Explore as opções e combinações por conta própria.
