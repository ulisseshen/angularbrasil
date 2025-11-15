<!-- ia-translate: true -->

# Testing Utility APIs {#testing-utility-apis}

Esta página descreve os recursos de testes Angular mais úteis.

Os utilitários de testes Angular incluem o `TestBed`, o `ComponentFixture`, e um punhado de funções que controlam o ambiente de teste.
As classes [`TestBed`](#testbed-class-summary) e [`ComponentFixture`](#the-componentfixture) são cobertas separadamente.

Aqui está um resumo das funções independentes, em ordem de utilidade provável:

| Função                       | Detalhes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| :--------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `waitForAsync`               | Executa o corpo de um teste \(`it`\) ou setup \(`beforeEach`\) função dentro de uma _async test zone_ especial. Veja [waitForAsync](guide/testing/components-scenarios#waitForAsync).                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `fakeAsync`                  | Executa o corpo de um teste \(`it`\) dentro de uma _fakeAsync test zone_ especial, habilitando um estilo de codificação de fluxo de controle linear. Veja [fakeAsync](guide/testing/components-scenarios#fake-async).                                                                                                                                                                                                                                                                                                                                                                                         |
| `tick`                       | Simula a passagem de tempo e a conclusão de atividades assíncronas pendentes liberando tanto as filas de _timer_ quanto _micro-task_ dentro da _fakeAsync test zone_. O leitor curioso e dedicado pode aproveitar este longo post de blog, ["_Tasks, microtasks, queues and schedules_"](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules). Aceita um argumento opcional que move o relógio virtual para frente pelo número especificado de milissegundos, limpando atividades assíncronas agendadas dentro desse período de tempo. Veja [tick](guide/testing/components-scenarios#tick). |
| `inject`                     | Injeta um ou mais services do injector `TestBed` atual em uma função de teste. Não pode injetar um service fornecido pelo próprio component. Veja discussão do [debugElement.injector](guide/testing/components-scenarios#get-injected-services).                                                                                                                                                                                                                                                                                                                                                             |
| `discardPeriodicTasks`       | Quando um teste `fakeAsync()` termina com _tasks_ de evento de timer pendentes \(callbacks `setTimeOut` e `setInterval` enfileirados\), o teste falha com uma mensagem de erro clara. <br /> Em geral, um teste deve terminar sem tasks enfileiradas. Quando tasks de timer pendentes são esperadas, chame `discardPeriodicTasks` para liberar a fila de _task_ e evitar o erro.                                                                                                                                                                                                                              |
| `flushMicrotasks`            | Quando um teste `fakeAsync()` termina com _micro-tasks_ pendentes como promises não resolvidas, o teste falha com uma mensagem de erro clara. <br /> Em geral, um teste deve aguardar que micro-tasks terminem. Quando microtasks pendentes são esperadas, chame `flushMicrotasks` para liberar a fila de _micro-task_ e evitar o erro.                                                                                                                                                                                                                                                                       |
| `ComponentFixtureAutoDetect` | Um token de provider para um service que ativa [detecção de mudanças automática](guide/testing/components-scenarios#automatic-change-detection).                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `getTestBed`                 | Obtém a instância atual do `TestBed`. Geralmente desnecessário porque os métodos de classe estáticos da classe `TestBed` são tipicamente suficientes. A instância `TestBed` expõe alguns membros raramente usados que não estão disponíveis como métodos estáticos.                                                                                                                                                                                                                                                                                                                                           |

## Resumo da classe `TestBed` {#testbed-class-summary}

A classe `TestBed` é um dos principais utilitários de testes Angular.
Sua API é bastante grande e pode ser esmagadora até que você a tenha explorado, um pouco de cada vez.
Leia a parte inicial deste guia primeiro para obter o básico antes de tentar absorver a API completa.

A definição de module passada para `configureTestingModule` é um subconjunto das propriedades de metadata `@NgModule`.

<docs-code language="javascript">

type TestModuleMetadata = {
providers?: any[];
declarations?: any[];
imports?: any[];
schemas?: Array<SchemaMetadata | any[]>;
};

</docs-code>

Cada método override recebe um `MetadataOverride<T>` onde `T` é o tipo de metadata apropriado para o método, ou seja, o parâmetro de um `@NgModule`, `@Component`, `@Directive`, ou `@Pipe`.

<docs-code language="javascript">

type MetadataOverride<T> = {
add?: Partial<T>;
remove?: Partial<T>;
set?: Partial<T>;
};

</docs-code>

A API `TestBed` consiste em métodos de classe estáticos que atualizam ou referenciam uma instância _global_ do `TestBed`.

Internamente, todos os métodos estáticos cobrem métodos da instância `TestBed` de runtime atual, que também é retornada pela função `getTestBed()`.

Chame métodos `TestBed` _dentro_ de um `beforeEach()` para garantir um começo novo antes de cada teste individual.

Aqui estão os métodos estáticos mais importantes, em ordem de utilidade provável.

| Métodos                  | Detalhes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| :----------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `configureTestingModule` | Os shims de testes estabelecem o [ambiente de teste inicial](guide/testing) e um module de testes padrão. O module de testes padrão é configurado com declarativas básicas e alguns substitutos de service Angular que todo testador precisa. <br /> Chame `configureTestingModule` para refinar a configuração do module de testes para um conjunto particular de testes adicionando e removendo imports, declarations \(de components, directives, e pipes\), e providers.                         |
| `compileComponents`      | Compile o module de testes assincronamente após você ter terminado de configurá-lo. Você **deve** chamar este método se _qualquer_ um dos components do module de testes tem um `templateUrl` ou `styleUrls` porque buscar arquivos de template e estilo de component é necessariamente assíncrono. Veja [compileComponents](guide/testing/components-scenarios#calling-compilecomponents). <br /> Após chamar `compileComponents`, a configuração `TestBed` é congelada pela duração da spec atual. |
| `createComponent<T>`     | Crie uma instância de um component do tipo `T` baseado na configuração `TestBed` atual. Após chamar `createComponent`, a configuração `TestBed` é congelada pela duração da spec atual.                                                                                                                                                                                                                                                                                                              |
| `overrideModule`         | Substitua metadata para o `NgModule` fornecido. Lembre-se que modules podem importar outros modules. O método `overrideModule` pode alcançar profundamente dentro do module de testes atual para modificar um desses modules internos.                                                                                                                                                                                                                                                               |
| `overrideComponent`      | Substitua metadata para a classe de component fornecida, que poderia estar aninhada profundamente dentro de um module interno.                                                                                                                                                                                                                                                                                                                                                                       |
| `overrideDirective`      | Substitua metadata para a classe de directive fornecida, que poderia estar aninhada profundamente dentro de um module interno.                                                                                                                                                                                                                                                                                                                                                                       |
| `overridePipe`           | Substitua metadata para a classe de pipe fornecida, que poderia estar aninhada profundamente dentro de um module interno.                                                                                                                                                                                                                                                                                                                                                                            |

|
`inject` | Recupere um service do injector `TestBed` atual. A função `inject` é frequentemente adequada para este propósito. Mas `inject` lança um erro se não puder fornecer o service. <br /> E se o service é opcional? <br /> O método `TestBed.inject()` recebe um segundo parâmetro opcional, o objeto a retornar se Angular não conseguir encontrar o provider \(`null` neste exemplo\): <docs-code header="app/demo/demo.testbed.spec.ts" path="adev/src/content/examples/testing/src/app/demo/demo.testbed.spec.ts" visibleRegion="testbed-get-w-null"/> Após chamar `TestBed.inject`, a configuração `TestBed` é congelada pela duração da spec atual. |
|
`initTestEnvironment` | Inicialize o ambiente de testes para toda a execução de testes. <br /> Os shims de testes chamam isso para você então raramente há uma razão para você chamá-lo você mesmo. <br /> Chame este método _exatamente uma vez_. Para mudar esse padrão no meio de uma execução de testes, chame `resetTestEnvironment` primeiro. <br /> Especifique a factory de compilador Angular, uma `PlatformRef`, e um module de testes Angular padrão. Alternativas para plataformas não-browser estão disponíveis na forma geral `@angular/platform-<platform_name>/testing/<platform_name>`. |
| `resetTestEnvironment` | Redefina o ambiente de teste inicial, incluindo o module de testes padrão. |

Alguns dos métodos de instância `TestBed` não são cobertos por métodos de _classe_ estáticos `TestBed`.
Estes são raramente necessários.

## O `ComponentFixture` {#the-componentfixture}

O `TestBed.createComponent<T>` cria uma instância do component `T` e retorna um `ComponentFixture` fortemente tipado para aquele component.

As propriedades e métodos `ComponentFixture` fornecem acesso ao component, sua representação DOM, e aspectos de seu ambiente Angular.

### Propriedades `ComponentFixture`

Aqui estão as propriedades mais importantes para testadores, em ordem de utilidade provável.

| Propriedades        | Detalhes                                                                                                                                                                                                                                                                            |
| :------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `componentInstance` | A instância da classe de component criada por `TestBed.createComponent`.                                                                                                                                                                                                            |
| `debugElement`      | O `DebugElement` associado com o elemento raiz do component. <br /> O `debugElement` fornece insight sobre o component e seu elemento DOM durante teste e depuração. É uma propriedade crítica para testadores. Os membros mais interessantes são cobertos [abaixo](#debugelement). |
| `nativeElement`     | O elemento DOM nativo na raiz do component.                                                                                                                                                                                                                                         |
| `changeDetectorRef` | O `ChangeDetectorRef` para o component. <br /> O `ChangeDetectorRef` é mais valioso ao testar um component que tem o método `ChangeDetectionStrategy.OnPush` ou a detecção de mudanças do component está sob seu controle programático.                                             |

### Métodos `ComponentFixture`

Os métodos _fixture_ fazem Angular executar certas tarefas na árvore de components.
Chame esses métodos para disparar comportamento Angular em resposta à ação de usuário simulada.

Aqui estão os métodos mais úteis para testadores.

| Métodos             | Detalhes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| :------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `detectChanges`     | Dispare um ciclo de detecção de mudanças para o component. <br /> Chame-o para inicializar o component \(ele chama `ngOnInit`\) e após o código do seu teste mudar os valores de propriedade vinculados a dados do component. Angular não pode ver que você mudou `personComponent.name` e não atualizará o binding `name` até que você chame `detectChanges`. <br /> Executa `checkNoChanges` depois para confirmar que não há atualizações circulares a menos que chamado como `detectChanges(false)`;                                                                                                               |
| `autoDetectChanges` | Defina isso como `true` quando você quer que o fixture detecte mudanças automaticamente. <br /> Quando autodetect é `true`, o test fixture chama `detectChanges` imediatamente após criar o component. Então ele escuta por eventos de zone pertinentes e chama `detectChanges` de acordo. Quando o código do seu teste modifica valores de propriedade de component diretamente, você provavelmente ainda tem que chamar `fixture.detectChanges` para disparar atualizações de data binding. <br /> O padrão é `false`. Testadores que preferem controle fino sobre comportamento de teste tendem a mantê-lo `false`. |
| `checkNoChanges`    | Faça uma execução de detecção de mudanças para ter certeza que não há mudanças pendentes. Lança exceções se houver.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `isStable`          | Se o fixture está atualmente _stable_, retorna `true`. Se há tarefas assíncronas que não foram completadas, retorna `false`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `whenStable`        | Retorna uma promise que resolve quando o fixture está stable. <br /> Para resumir testes após conclusão de atividade assíncrona ou detecção de mudanças assíncrona, conecte essa promise. Veja [whenStable](guide/testing/components-scenarios#whenstable).                                                                                                                                                                                                                                                                                                                                                            |
| `destroy`           | Dispare destruição de component.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |

#### `DebugElement`

O `DebugElement` fornece insights cruciais na representação DOM do component.

Do `DebugElement` do component raiz de teste retornado por `fixture.debugElement`, você pode caminhar \(e consultar\) a árvore inteira de elementos e components do fixture.

Aqui estão os membros `DebugElement` mais úteis para testadores, em ordem aproximada de utilidade:

| Membros               | Detalhes                                                                                                                                                                                                                                                                                                                                                                                   |
| :-------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `nativeElement`       | O elemento DOM correspondente no browser                                                                                                                                                                                                                                                                                                                                                   |
| `query`               | Chamar `query(predicate: Predicate<DebugElement>)` retorna o primeiro `DebugElement` que corresponde ao predicado em qualquer profundidade na subárvore.                                                                                                                                                                                                                                   |
| `queryAll`            | Chamar `queryAll(predicate: Predicate<DebugElement>)` retorna todos os `DebugElements` que correspondem ao predicado em qualquer profundidade na subárvore.                                                                                                                                                                                                                                |
| `injector`            | O injector de dependência do host. Por exemplo, o injector de instância de component do elemento raiz.                                                                                                                                                                                                                                                                                     |
| `componentInstance`   | A própria instância de component do elemento, se tiver uma.                                                                                                                                                                                                                                                                                                                                |
| `context`             | Um objeto que fornece contexto pai para este elemento. Frequentemente uma instância de component ancestral que governa este elemento. <br /> Quando um elemento é repetido dentro de um bloco `@for`, o contexto é um `RepeaterContext` cuja propriedade `$implicit` é o valor da instância da linha. Por exemplo, o `hero` em `@for(hero of heroes; ...)`.                                |
| `children`            | Os filhos `DebugElement` imediatos. Caminhe pela árvore descendo através de `children`. `DebugElement` também tem `childNodes`, uma lista de objetos `DebugNode`. `DebugElement` deriva de objetos `DebugNode` e frequentemente há mais nós que elementos. Testadores geralmente podem ignorar nós simples.                                                                                |
| `parent`              | O `DebugElement` pai. Null se este é o elemento raiz.                                                                                                                                                                                                                                                                                                                                      |
| `name`                | O nome da tag do elemento, se for um elemento.                                                                                                                                                                                                                                                                                                                                             |
| `triggerEventHandler` | Dispara o evento por seu nome se há um listener correspondente na coleção `listeners` do elemento. O segundo parâmetro é o _objeto de evento_ esperado pelo handler. Veja [triggerEventHandler](guide/testing/components-scenarios#trigger-event-handler). <br /> Se o evento não tem um listener ou há algum outro problema, considere chamar `nativeElement.dispatchEvent(eventObject)`. |
| `listeners`           | Os callbacks anexados às propriedades `@Output` do component e/ou às propriedades de evento do elemento.                                                                                                                                                                                                                                                                                   |
| `providerTokens`      | Os tokens de busca de injector deste component. Inclui o próprio component mais os tokens que o component lista em sua metadata `providers`.                                                                                                                                                                                                                                               |
| `source`              | Onde encontrar este elemento no template de component fonte.                                                                                                                                                                                                                                                                                                                               |
| `references`          | Dicionário de objetos associados com variáveis locais de template \(por exemplo, `#foo`\), indexados pelo nome da variável local.                                                                                                                                                                                                                                                          |

Os métodos `DebugElement.query(predicate)` e `DebugElement.queryAll(predicate)` recebem um predicado que filtra a subárvore do elemento fonte para `DebugElement` correspondentes.

O predicado é qualquer método que recebe um `DebugElement` e retorna um valor _truthy_.
O seguinte exemplo encontra todos os `DebugElements` com uma referência a uma variável local de template chamada "content":

<docs-code header="app/demo/demo.testbed.spec.ts" path="adev/src/content/examples/testing/src/app/demo/demo.testbed.spec.ts" visibleRegion="custom-predicate"/>

A classe `By` do Angular tem três métodos estáticos para predicados comuns:

| Método estático           | Detalhes                                                                       |
| :------------------------ | :----------------------------------------------------------------------------- |
| `By.all`                  | Retorna todos os elementos                                                     |
| `By.css(selector)`        | Retorna elementos com seletores CSS correspondentes                            |
| `By.directive(directive)` | Retorna elementos que Angular correspondeu a uma instância da classe directive |

<docs-code header="app/hero/hero-list.component.spec.ts" path="adev/src/content/examples/testing/src/app/hero/hero-list.component.spec.ts" visibleRegion="by"/>
