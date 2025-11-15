<!-- ia-translate: true -->

# Testing Utility APIs {#the-componentfixture} {#testbed-class-summary}

Esta página descreve as funcionalidades de testes do Angular mais úteis.

As utilidades de testes do Angular incluem o `TestBed`, o `ComponentFixture` e um conjunto de funções que controlam o ambiente de testes.
As classes [`TestBed`](#testbed-class-summary) e [`ComponentFixture`](#the-componentfixture) são abordadas separadamente.

Aqui está um resumo das funções independentes, em ordem de utilidade provável:

| Function                     | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| :--------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `waitForAsync`               | Executa o corpo de um teste \(`it`\) ou função de configuração \(`beforeEach`\) dentro de uma _async test zone_ especial. Veja [waitForAsync](guide/testing/components-scenarios#waitForAsync).                                                                                                                                                                                                                                                                                                                                                                                          |
| `fakeAsync`                  | Executa o corpo de um teste \(`it`\) dentro de uma _fakeAsync test zone_ especial, possibilitando um estilo de código com fluxo de controle linear. Veja [fakeAsync](guide/testing/components-scenarios#fake-async).                                                                                                                                                                                                                                                                                                                                                                     |
| `tick`                       | Simula a passagem do tempo e a conclusão de atividades assíncronas pendentes limpando as filas de _timer_ e _micro-task_ dentro da _fakeAsync test zone_. O leitor curioso e dedicado pode aproveitar este longo post de blog, ["_Tasks, microtasks, queues and schedules_"](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules). Aceita um argumento opcional que move o relógio virtual para frente pelo número especificado de milissegundos, limpando atividades assíncronas agendadas dentro desse período. Veja [tick](guide/testing/components-scenarios#tick). |
| `inject`                     | Injeta um ou mais services do injector `TestBed` atual em uma função de teste. Não pode injetar um service fornecido pelo próprio component. Veja a discussão sobre o [debugElement.injector](guide/testing/components-scenarios#get-injected-services).                                                                                                                                                                                                                                                                                                                                 |
| `discardPeriodicTasks`       | Quando um teste `fakeAsync()` termina com _tasks_ de eventos de timer pendentes \(callbacks `setTimeOut` e `setInterval` enfileirados\), o teste falha com uma mensagem de erro clara. <br /> Em geral, um teste deve terminar sem tasks enfileiradas. Quando tasks de timer pendentes são esperadas, chame `discardPeriodicTasks` para limpar a fila de _task_ e evitar o erro.                                                                                                                                                                                                         |
| `flushMicrotasks`            | Quando um teste `fakeAsync()` termina com _micro-tasks_ pendentes, como promises não resolvidas, o teste falha com uma mensagem de erro clara. <br /> Em geral, um teste deve aguardar a conclusão das micro-tasks. Quando microtasks pendentes são esperadas, chame `flushMicrotasks` para limpar a fila de _micro-task_ e evitar o erro.                                                                                                                                                                                                                                               |
| `ComponentFixtureAutoDetect` | Um token de provider para um service que ativa a [detecção automática de mudanças](guide/testing/components-scenarios#automatic-change-detection).                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `getTestBed`                 | Obtém a instância atual do `TestBed`. Geralmente desnecessário porque os métodos de classe estáticos da classe `TestBed` são tipicamente suficientes. A instância do `TestBed` expõe alguns membros raramente usados que não estão disponíveis como métodos estáticos.                                                                                                                                                                                                                                                                                                                   |

## Resumo da classe `TestBed`

A classe `TestBed` é uma das principais utilidades de testes do Angular.
Sua API é bastante extensa e pode ser sobrecarregadora até que você a explore, um pouco de cada vez.
Leia a parte inicial deste guia primeiro para obter os conceitos básicos antes de tentar absorver a API completa.

A definição de module passada para `configureTestingModule` é um subconjunto das propriedades de metadata `@NgModule`.

<docs-code language="javascript">

type TestModuleMetadata = {
providers?: any[];
declarations?: any[];
imports?: any[];
schemas?: Array<SchemaMetadata | any[]>;
};

</docs-code>

Cada método override recebe um `MetadataOverride<T>` onde `T` é o tipo de metadata apropriado para o método, ou seja, o parâmetro de um `@NgModule`, `@Component`, `@Directive` ou `@Pipe`.

<docs-code language="javascript">

type MetadataOverride<T> = {
add?: Partial<T>;
remove?: Partial<T>;
set?: Partial<T>;
};

</docs-code>

A API do `TestBed` consiste em métodos de classe estáticos que atualizam ou referenciam uma instância _global_ do `TestBed`.

Internamente, todos os métodos estáticos cobrem métodos da instância `TestBed` de runtime atual, que também é retornada pela função `getTestBed()`.

Chame métodos do `TestBed` _dentro_ de um `beforeEach()` para garantir um início limpo antes de cada teste individual.

Aqui estão os métodos estáticos mais importantes, em ordem de utilidade provável.

| Methods                  | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| :----------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `configureTestingModule` | Os shims de testes estabelecem o [ambiente de testes inicial](guide/testing) e um module de testes padrão. O module de testes padrão é configurado com declarativas básicas e alguns substitutos de services Angular que todo testador precisa. <br /> Chame `configureTestingModule` para refinar a configuração do module de testes para um conjunto específico de testes adicionando e removendo imports, declarations \(de components, directives e pipes\) e providers.                         |
| `compileComponents`      | Compile o module de testes de forma assíncrona após terminar de configurá-lo. Você **deve** chamar este método se _algum_ dos components do module de testes tiver um `templateUrl` ou `styleUrls` porque buscar arquivos de template e estilos de component é necessariamente assíncrono. Veja [compileComponents](guide/testing/components-scenarios#calling-compilecomponents). <br /> Após chamar `compileComponents`, a configuração do `TestBed` é congelada durante a execução da spec atual. |
| `createComponent<T>`     | Cria uma instância de um component do tipo `T` com base na configuração atual do `TestBed`. Após chamar `createComponent`, a configuração do `TestBed` é congelada durante a execução da spec atual.                                                                                                                                                                                                                                                                                                 |
| `overrideModule`         | Substitui metadata para o `NgModule` fornecido. Lembre-se de que modules podem importar outros modules. O método `overrideModule` pode alcançar profundamente o module de testes atual para modificar um desses modules internos.                                                                                                                                                                                                                                                                    |
| `overrideComponent`      | Substitui metadata para a classe de component fornecida, que pode estar aninhada profundamente dentro de um module interno.                                                                                                                                                                                                                                                                                                                                                                          |
| `overrideDirective`      | Substitui metadata para a classe de directive fornecida, que pode estar aninhada profundamente dentro de um module interno.                                                                                                                                                                                                                                                                                                                                                                          |
| `overridePipe`           | Substitui metadata para a classe de pipe fornecida, que pode estar aninhada profundamente dentro de um module interno.                                                                                                                                                                                                                                                                                                                                                                               |

|
`inject` | Recupera um service do injector `TestBed` atual. A função `inject` geralmente é adequada para este propósito. Mas `inject` lança um erro se não puder fornecer o service. <br /> E se o service for opcional? <br /> O método `TestBed.inject()` recebe um segundo parâmetro opcional, o objeto a ser retornado se o Angular não encontrar o provider \(`null` neste exemplo\): <docs-code header="app/demo/demo.testbed.spec.ts" path="adev/src/content/examples/testing/src/app/demo/demo.testbed.spec.ts" visibleRegion="testbed-get-w-null"/> Após chamar `TestBed.inject`, a configuração do `TestBed` é congelada durante a execução da spec atual. |
|
`initTestEnvironment` | Inicializa o ambiente de testes para toda a execução de testes. <br /> Os shims de testes o chamam para você, então raramente há uma razão para você chamá-lo por conta própria. <br /> Chame este método _exatamente uma vez_. Para alterar este padrão no meio de uma execução de testes, chame `resetTestEnvironment` primeiro. <br /> Especifique a factory do compilador Angular, uma `PlatformRef` e um module de testes Angular padrão. Alternativas para plataformas não-browser estão disponíveis na forma geral `@angular/platform-<platform_name>/testing/<platform_name>`. |
| `resetTestEnvironment` | Reseta o ambiente de testes inicial, incluindo o module de testes padrão. |

Alguns dos métodos de instância do `TestBed` não são cobertos pelos métodos de _classe_ estáticos do `TestBed`.
Estes são raramente necessários.

## O `ComponentFixture`

O `TestBed.createComponent<T>` cria uma instância do component `T` e retorna um `ComponentFixture` fortemente tipado para esse component.

As propriedades e métodos do `ComponentFixture` fornecem acesso ao component, sua representação DOM e aspectos de seu ambiente Angular.

### Propriedades do `ComponentFixture`

Aqui estão as propriedades mais importantes para testadores, em ordem de utilidade provável.

| Properties          | Details                                                                                                                                                                                                                                                                             |
| :------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `componentInstance` | A instância da classe do component criada por `TestBed.createComponent`.                                                                                                                                                                                                            |
| `debugElement`      | O `DebugElement` associado ao elemento raiz do component. <br /> O `debugElement` fornece insights sobre o component e seu elemento DOM durante testes e debugging. É uma propriedade crítica para testadores. Os membros mais interessantes são abordados [abaixo](#debugelement). |
| `nativeElement`     | O elemento DOM nativo na raiz do component.                                                                                                                                                                                                                                         |
| `changeDetectorRef` | O `ChangeDetectorRef` para o component. <br /> O `ChangeDetectorRef` é mais valioso ao testar um component que tem o método `ChangeDetectionStrategy.OnPush` ou a detecção de mudanças do component está sob seu controle programático.                                             |

### Métodos do `ComponentFixture`

Os métodos do _fixture_ fazem o Angular executar determinadas tarefas na árvore de components.
Chame esses métodos para acionar o comportamento do Angular em resposta a ações simuladas do usuário.

Aqui estão os métodos mais úteis para testadores.

| Methods             | Details                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| :------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `detectChanges`     | Aciona um ciclo de detecção de mudanças para o component. <br /> Chame-o para inicializar o component \(ele chama `ngOnInit`\) e depois que seu código de teste alterar os valores de propriedades vinculadas aos dados do component. O Angular não pode ver que você alterou `personComponent.name` e não atualizará o binding de `name` até que você chame `detectChanges`. <br /> Executa `checkNoChanges` posteriormente para confirmar que não há atualizações circulares, a menos que chamado como `detectChanges(false)`;                                                                                                    |
| `autoDetectChanges` | Defina isso como `true` quando você quiser que o fixture detecte mudanças automaticamente. <br /> Quando autodetect é `true`, o fixture de teste chama `detectChanges` imediatamente após criar o component. Em seguida, ele escuta eventos de zone pertinentes e chama `detectChanges` de acordo. Quando seu código de teste modifica valores de propriedades do component diretamente, você provavelmente ainda terá que chamar `fixture.detectChanges` para acionar atualizações de binding de dados. <br /> O padrão é `false`. Testadores que preferem controle fino sobre o comportamento do teste tendem a mantê-lo `false`. |
| `checkNoChanges`    | Executa um ciclo de detecção de mudanças para garantir que não haja mudanças pendentes. Lança exceções se houver.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `isStable`          | Se o fixture está atualmente _stable_, retorna `true`. Se há tasks assíncronas que não foram concluídas, retorna `false`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `whenStable`        | Retorna uma promise que é resolvida quando o fixture está estável. <br /> Para retomar os testes após a conclusão de atividade assíncrona ou detecção de mudanças assíncrona, conecte essa promise. Veja [whenStable](guide/testing/components-scenarios#whenstable).                                                                                                                                                                                                                                                                                                                                                               |
| `destroy`           | Aciona a destruição do component.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

#### `DebugElement`

O `DebugElement` fornece insights cruciais sobre a representação DOM do component.

Do `DebugElement` do component raiz de teste retornado por `fixture.debugElement`, você pode percorrer \(e consultar\) toda a subárvore de elementos e components do fixture.

Aqui estão os membros do `DebugElement` mais úteis para testadores, em ordem aproximada de utilidade:

| Members               | Details                                                                                                                                                                                                                                                                                                                                                                                             |
| :-------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `nativeElement`       | O elemento DOM correspondente no browser                                                                                                                                                                                                                                                                                                                                                            |
| `query`               | Chamar `query(predicate: Predicate<DebugElement>)` retorna o primeiro `DebugElement` que corresponde ao predicado em qualquer profundidade na subárvore.                                                                                                                                                                                                                                            |
| `queryAll`            | Chamar `queryAll(predicate: Predicate<DebugElement>)` retorna todos os `DebugElements` que correspondem ao predicado em qualquer profundidade na subárvore.                                                                                                                                                                                                                                         |
| `injector`            | O injector de dependências do host. Por exemplo, o injector da instância do component do elemento raiz.                                                                                                                                                                                                                                                                                             |
| `componentInstance`   | A própria instância do component do elemento, se tiver uma.                                                                                                                                                                                                                                                                                                                                         |
| `context`             | Um objeto que fornece o contexto pai para este elemento. Geralmente uma instância de component ancestral que governa este elemento. <br /> Quando um elemento é repetido dentro de um bloco `@for`, o context é um `RepeaterContext` cuja propriedade `$implicit` é o valor da instância da linha. Por exemplo, o `hero` em `@for(hero of heroes; ...)`.                                            |
| `children`            | Os filhos `DebugElement` imediatos. Percorra a árvore descendo pelos `children`. `DebugElement` também tem `childNodes`, uma lista de objetos `DebugNode`. `DebugElement` deriva de objetos `DebugNode` e geralmente há mais nodes do que elementos. Testadores geralmente podem ignorar nodes simples.                                                                                             |
| `parent`              | O `DebugElement` pai. Null se este for o elemento raiz.                                                                                                                                                                                                                                                                                                                                             |
| `name`                | O nome da tag do elemento, se for um elemento.                                                                                                                                                                                                                                                                                                                                                      |
| `triggerEventHandler` | Aciona o evento por seu nome se houver um listener correspondente na coleção `listeners` do elemento. O segundo parâmetro é o _objeto de evento_ esperado pelo handler. Veja [triggerEventHandler](guide/testing/components-scenarios#trigger-event-handler). <br /> Se o evento não tiver um listener ou houver algum outro problema, considere chamar `nativeElement.dispatchEvent(eventObject)`. |
| `listeners`           | Os callbacks anexados às propriedades `@Output` do component e/ou às propriedades de evento do elemento.                                                                                                                                                                                                                                                                                            |
| `providerTokens`      | Os tokens de lookup do injector deste component. Inclui o próprio component mais os tokens que o component lista em sua metadata `providers`.                                                                                                                                                                                                                                                       |
| `source`              | Onde encontrar este elemento no template do component de origem.                                                                                                                                                                                                                                                                                                                                    |
| `references`          | Dicionário de objetos associados a variáveis locais de template \(por exemplo, `#foo`\), indexado pelo nome da variável local.                                                                                                                                                                                                                                                                      |

Os métodos `DebugElement.query(predicate)` e `DebugElement.queryAll(predicate)` recebem um predicado que filtra a subárvore do elemento de origem para `DebugElement` correspondentes.

O predicado é qualquer método que recebe um `DebugElement` e retorna um valor _truthy_.
O exemplo a seguir encontra todos os `DebugElements` com uma referência a uma variável local de template chamada "content":

<docs-code header="app/demo/demo.testbed.spec.ts" path="adev/src/content/examples/testing/src/app/demo/demo.testbed.spec.ts" visibleRegion="custom-predicate"/>

A classe `By` do Angular tem três métodos estáticos para predicados comuns:

| Static method             | Details                                                                          |
| :------------------------ | :------------------------------------------------------------------------------- |
| `By.all`                  | Retorna todos os elementos                                                       |
| `By.css(selector)`        | Retorna elementos com seletores CSS correspondentes                              |
| `By.directive(directive)` | Retorna elementos que o Angular correspondeu a uma instância da classe directive |

<docs-code header="app/hero/hero-list.component.spec.ts" path="adev/src/content/examples/testing/src/app/hero/hero-list.component.spec.ts" visibleRegion="by"/>
