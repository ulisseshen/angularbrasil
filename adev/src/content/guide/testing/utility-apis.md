<!-- ia-translate: true -->
# APIs Utilitárias de Teste

Esta página descreve os recursos de teste do Angular mais úteis.

As utilitários de teste do Angular incluem o `TestBed`, o `ComponentFixture` e um punhado de funções que controlam o ambiente de teste.
As classes [`TestBed`](#testbed-class-summary) e [`ComponentFixture`](#the-componentfixture) são cobertas separadamente.

Aqui está um resumo das funções autônomas, em ordem de utilidade provável:

| Função                       | Detalhes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| :--------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `waitForAsync`               | Executa o corpo de uma função de teste \(`it`\) ou configuração \(`beforeEach`\) dentro de uma _zona de teste assíncrona_ especial. Veja [waitForAsync](guide/testing/components-scenarios#waitForAsync).                                                                                                                                                                                                                                                                                                                                                                                    |
| `fakeAsync`                  | Executa o corpo de um teste \(`it`\) dentro de uma _zona de teste fakeAsync_ especial, permitindo um estilo de codificação de fluxo de controle linear. Veja [fakeAsync](guide/testing/components-scenarios#fake-async).                                                                                                                                                                                                                                                                                                                                                                           |
| `tick`                       | Simula a passagem do tempo e a conclusão de atividades assíncronas pendentes liberando ambas as filas de _timer_ e _micro-task_ dentro da _zona de teste fakeAsync_. O leitor curioso e dedicado pode gostar deste longo post de blog, ["_Tasks, microtasks, queues and schedules_"](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules). Aceita um argumento opcional que move o relógio virtual para frente pelo número especificado de milissegundos, limpando atividades assíncronas agendadas dentro desse período de tempo. Veja [tick](guide/testing/components-scenarios#tick). |
| `inject`                     | Injeta um ou mais services do injetor `TestBed` atual em uma função de teste. Não pode injetar um service fornecido pelo próprio component. Veja discussão do [debugElement.injector](guide/testing/components-scenarios#get-injected-services).                                                                                                                                                                                                                                                                                                                                                    |
| `discardPeriodicTasks`       | Quando um teste `fakeAsync()` termina com _tasks_ de evento de timer pendentes \(callbacks `setTimeOut` e `setInterval` enfileirados\), o teste falha com uma mensagem de erro clara. <br /> Em geral, um teste deve terminar sem tasks enfileiradas. Quando tasks de timer pendentes são esperadas, chame `discardPeriodicTasks` para liberar a fila de _task_ e evitar o erro.                                                                                                                                                                                                                    |
| `flushMicrotasks`            | Quando um teste `fakeAsync()` termina com _micro-tasks_ pendentes como promises não resolvidas, o teste falha com uma mensagem de erro clara. <br /> Em geral, um teste deve esperar que micro-tasks terminem. Quando microtasks pendentes são esperados, chame `flushMicrotasks` para liberar a fila de _micro-task_ e evitar o erro.                                                                                                                                                                                                                                                            |
| `ComponentFixtureAutoDetect` | Um token de provider para um service que ativa a [detecção automática de mudanças](guide/testing/components-scenarios#automatic-change-detection).                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `getTestBed`                 | Obtém a instância atual do `TestBed`. Geralmente desnecessário porque os métodos de classe estáticos da classe `TestBed` são tipicamente suficientes. A instância `TestBed` expõe alguns membros raramente usados que não estão disponíveis como métodos estáticos.                                                                                                                                                                                                                                                                                                                            |

## Resumo da classe `TestBed`

A classe `TestBed` é uma das principais utilitários de teste do Angular.
Sua API é bastante grande e pode ser avassaladora até que você a explore, um pouco de cada vez.
Leia a parte inicial deste guia primeiro para obter o básico antes de tentar absorver a API completa.

A definição do módulo passada para `configureTestingModule` é um subconjunto das propriedades de metadados `@NgModule`.

<docs-code language="javascript">

type TestModuleMetadata = {
providers?: any[];
declarations?: any[];
imports?: any[];
schemas?: Array<SchemaMetadata | any[]>;
};

</docs-code>

Cada método override recebe um `MetadataOverride<T>` onde `T` é o tipo de metadados apropriado para o método, ou seja, o parâmetro de um `@NgModule`, `@Component`, `@Directive` ou `@Pipe`.

<docs-code language="javascript">

type MetadataOverride<T> = {
add?: Partial<T>;
remove?: Partial<T>;
set?: Partial<T>;
};

</docs-code>

A API `TestBed` consiste de métodos de classe estáticos que atualizam ou referenciam uma instância _global_ do `TestBed`.

Internamente, todos os métodos estáticos cobrem métodos da instância `TestBed` de runtime atual, que também é retornada pela função `getTestBed()`.

Chame métodos `TestBed` _dentro_ de um `beforeEach()` para garantir um novo começo antes de cada teste individual.

Aqui estão os métodos estáticos mais importantes, em ordem de utilidade provável.

| Métodos                  | Detalhes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| :----------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `configureTestingModule` | Os shims de teste estabelecem o [ambiente de teste inicial](guide/testing) e um módulo de teste padrão. O módulo de teste padrão é configurado com declarações básicas e alguns substitutos de service do Angular que todo testador precisa. <br /> Chame `configureTestingModule` para refinar a configuração do módulo de teste para um conjunto particular de testes adicionando e removendo imports, declarations \(de components, directives e pipes\) e providers.                                |
| `compileComponents`      | Compile o módulo de teste de forma assíncrona depois de ter terminado de configurá-lo. Você **deve** chamar este método se _qualquer_ um dos components do módulo de teste tiver um `templateUrl` ou `styleUrls` porque buscar arquivos de template e estilo de component é necessariamente assíncrono. Veja [compileComponents](guide/testing/components-scenarios#calling-compilecomponents). <br /> Após chamar `compileComponents`, a configuração `TestBed` é congelada para a duração da spec atual. |
| `createComponent<T>`     | Crie uma instância de um component do tipo `T` baseado na configuração `TestBed` atual. Após chamar `createComponent`, a configuração `TestBed` é congelada para a duração da spec atual.                                                                                                                                                                                                                                                                                                  |
| `overrideModule`         | Substitua metadados para o `NgModule` fornecido. Lembre-se que módulos podem importar outros módulos. O método `overrideModule` pode alcançar profundamente no módulo de teste atual para modificar um desses módulos internos.                                                                                                                                                                                                                                                               |
| `overrideComponent`      | Substitua metadados para a classe de component fornecida, que poderia estar aninhada profundamente dentro de um módulo interno.                                                                                                                                                                                                                                                                                                                                                      |
| `overrideDirective`      | Substitua metadados para a classe de directive fornecida, que poderia estar aninhada profundamente dentro de um módulo interno.                                                                                                                                                                                                                                                                                                                                                      |
| `overridePipe`           | Substitua metadados para a classe de pipe fornecida, que poderia estar aninhada profundamente dentro de um módulo interno.                                                                                                                                                                                                                                                                                                                                                           |

|
`inject` | Recupere um service do injetor `TestBed` atual. A função `inject` é frequentemente adequada para este propósito. Mas `inject` lança um erro se não puder fornecer o service. <br /> E se o service for opcional? <br /> O método `TestBed.inject()` recebe um segundo parâmetro opcional, o objeto a retornar se o Angular não puder encontrar o provider \(`null` neste exemplo\): <docs-code header="app/demo/demo.testbed.spec.ts" path="adev/src/content/examples/testing/src/app/demo/demo.testbed.spec.ts" visibleRegion="testbed-get-w-null"/> Após chamar `TestBed.inject`, a configuração `TestBed` é congelada para a duração da spec atual. |
|
`initTestEnvironment` | Inicialize o ambiente de teste para toda a execução de teste. <br /> Os shims de teste o chamam para você, então raramente há razão para você chamá-lo você mesmo. <br /> Chame este método _exatamente uma vez_. Para mudar este padrão no meio de uma execução de teste, chame `resetTestEnvironment` primeiro. <br /> Especifique a factory do compilador Angular, um `PlatformRef` e um módulo de teste Angular padrão. Alternativas para plataformas não-browser estão disponíveis na forma geral `@angular/platform-<platform_name>/testing/<platform_name>`. |
| `resetTestEnvironment` | Redefina o ambiente de teste inicial, incluindo o módulo de teste padrão. |

Alguns dos métodos de instância `TestBed` não são cobertos por métodos de _classe_ estáticos `TestBed`.
Estes são raramente necessários.

## O `ComponentFixture`

O `TestBed.createComponent<T>` cria uma instância do component `T` e retorna um `ComponentFixture` fortemente tipado para aquele component.

As propriedades e métodos `ComponentFixture` fornecem acesso ao component, sua representação DOM e aspectos de seu ambiente Angular.

### Propriedades de `ComponentFixture`

Aqui estão as propriedades mais importantes para testadores, em ordem de utilidade provável.

| Propriedades        | Detalhes                                                                                                                                                                                                                                                                                  |
| :------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `componentInstance` | A instância da classe de component criada por `TestBed.createComponent`.                                                                                                                                                                                                                 |
| `debugElement`      | O `DebugElement` associado com o elemento raiz do component. <br /> O `debugElement` fornece insight sobre o component e seu elemento DOM durante teste e debugging. É uma propriedade crítica para testadores. Os membros mais interessantes são cobertos [abaixo](#debugelement). |
| `nativeElement`     | O elemento DOM nativo na raiz do component.                                                                                                                                                                                                                                              |
| `changeDetectorRef` | O `ChangeDetectorRef` para o component. <br /> O `ChangeDetectorRef` é mais valioso ao testar um component que tem o método `ChangeDetectionStrategy.OnPush` ou a detecção de mudanças do component está sob seu controle programático.                                          |

### Métodos de `ComponentFixture`

Os métodos _fixture_ fazem o Angular realizar certas tarefas na árvore de components.
Chame esses métodos para acionar comportamento Angular em resposta à ação simulada do usuário.

Aqui estão os métodos mais úteis para testadores.

| Métodos             | Detalhes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| :------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `detectChanges`     | Aciona um ciclo de detecção de mudanças para o component. <br /> Chame-o para inicializar o component \(ele chama `ngOnInit`\) e depois que seu código de teste alterar os valores de propriedade vinculados a dados do component. O Angular não pode ver que você mudou `personComponent.name` e não atualizará o binding `name` até que você chame `detectChanges`. <br /> Executa `checkNoChanges` depois para confirmar que não há atualizações circulares, a menos que chamado como `detectChanges(false)`;                                                                                    |
| `autoDetectChanges` | Defina isso como `true` quando você quiser que o fixture detecte mudanças automaticamente. <br /> Quando autodetect é `true`, o fixture de teste chama `detectChanges` imediatamente após criar o component. Então ele escuta eventos de zone pertinentes e chama `detectChanges` de acordo. Quando seu código de teste modifica valores de propriedade do component diretamente, você provavelmente ainda terá que chamar `fixture.detectChanges` para acionar atualizações de data binding. <br /> O padrão é `false`. Testadores que preferem controle fino sobre comportamento de teste tendem a mantê-lo `false`. |
| `checkNoChanges`    | Execute uma execução de detecção de mudanças para garantir que não haja mudanças pendentes. Lança exceções se houver.                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `isStable`          | Se o fixture está atualmente _estável_, retorna `true`. Se há tarefas assíncronas que não foram completadas, retorna `false`.                                                                                                                                                                                                                                                                                                                                                                                                               |
| `whenStable`        | Retorna uma promise que resolve quando o fixture está estável. <br /> Para retomar testes após conclusão de atividade assíncrona ou detecção de mudanças assíncrona, conecte essa promise. Veja [whenStable](guide/testing/components-scenarios#whenstable).                                                                                                                                                                                                                                                                                   |
| `destroy`           | Aciona a destruição do component.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

#### `DebugElement`

O `DebugElement` fornece insights cruciais sobre a representação DOM do component.

A partir do `DebugElement` do component raiz de teste retornado por `fixture.debugElement`, você pode caminhar \(e consultar\) toda a árvore de elementos e components do fixture.

Aqui estão os membros `DebugElement` mais úteis para testadores, em ordem aproximada de utilidade:

| Membros               | Detalhes                                                                                                                                                                                                                                                                                                                                                                                               |
| :-------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `nativeElement`       | O elemento DOM correspondente no browser                                                                                                                                                                                                                                                                                                                                                           |
| `query`               | Chamar `query(predicate: Predicate<DebugElement>)` retorna o primeiro `DebugElement` que corresponde ao predicado em qualquer profundidade na subárvore.                                                                                                                                                                                                                                           |
| `queryAll`            | Chamar `queryAll(predicate: Predicate<DebugElement>)` retorna todos os `DebugElements` que correspondem ao predicado em qualquer profundidade na subárvore.                                                                                                                                                                                                                                                 |
| `injector`            | O injetor de dependência do host. Por exemplo, o injetor da instância de component do elemento raiz.                                                                                                                                                                                                                                                                                             |
| `componentInstance`   | A própria instância de component do elemento, se houver uma.                                                                                                                                                                                                                                                                                                                                                   |
| `context`             | Um objeto que fornece contexto pai para este elemento. Frequentemente uma instância de component ancestral que governa este elemento. <br /> Quando um elemento é repetido dentro de um bloco `@for`, o context é um `RepeaterContext` cuja propriedade `$implicit` é o valor da instância de linha. Por exemplo, o `hero` em `@for(hero of heroes; ...)`.                                                        |
| `children`            | Os filhos `DebugElement` imediatos. Caminhe pela árvore descendo através de `children`. `DebugElement` também tem `childNodes`, uma lista de objetos `DebugNode`. `DebugElement` deriva de objetos `DebugNode` e frequentemente há mais nodes do que elementos. Testadores geralmente podem ignorar nodes simples.                                                                                      |
| `parent`              | O pai `DebugElement`. Null se este for o elemento raiz.                                                                                                                                                                                                                                                                                                                                           |
| `name`                | O nome da tag do elemento, se for um elemento.                                                                                                                                                                                                                                                                                                                                                             |
| `triggerEventHandler` | Aciona o evento por seu nome se houver um listener correspondente na coleção `listeners` do elemento. O segundo parâmetro é o _objeto de evento_ esperado pelo handler. Veja [triggerEventHandler](guide/testing/components-scenarios#trigger-event-handler). <br /> Se o evento não tiver um listener ou houver algum outro problema, considere chamar `nativeElement.dispatchEvent(eventObject)`. |
| `listeners`           | Os callbacks anexados às propriedades `@Output` do component e/ou às propriedades de evento do elemento.                                                                                                                                                                                                                                                                                                  |
| `providerTokens`      | Os tokens de lookup do injetor deste component. Inclui o próprio component além dos tokens que o component lista em seus metadados `providers`.                                                                                                                                                                                                                                                           |
| `source`              | Onde encontrar este elemento no template de component fonte.                                                                                                                                                                                                                                                                                                                                           |
| `references`          | Dicionário de objetos associados com variáveis locais de template \(por exemplo, `#foo`\), indexado pelo nome da variável local.                                                                                                                                                                                                                                                                              |

Os métodos `DebugElement.query(predicate)` e `DebugElement.queryAll(predicate)` recebem um predicado que filtra a subárvore do elemento fonte para `DebugElement` correspondentes.

O predicado é qualquer método que recebe um `DebugElement` e retorna um valor _truthy_.
O exemplo a seguir encontra todos os `DebugElements` com uma referência a uma variável local de template chamada "content":

<docs-code header="app/demo/demo.testbed.spec.ts" path="adev/src/content/examples/testing/src/app/demo/demo.testbed.spec.ts" visibleRegion="custom-predicate"/>

A classe `By` do Angular tem três métodos estáticos para predicados comuns:

| Método estático           | Detalhes                                                                           |
| :------------------------ | :--------------------------------------------------------------------------------- |
| `By.all`                  | Retorna todos os elementos                                                         |
| `By.css(selector)`        | Retorna elementos com seletores CSS correspondentes                                |
| `By.directive(directive)` | Retorna elementos que o Angular correspondeu a uma instância da classe de directive |

<docs-code header="app/hero/hero-list.component.spec.ts" path="adev/src/content/examples/testing/src/app/hero/hero-list.component.spec.ts" visibleRegion="by"/>
