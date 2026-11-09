<!-- ia-translate: true -->

# APIs utilitárias de teste

NOTE: Enquanto este guia está sendo atualizado para o Vitest, algumas descrições e exemplos das APIs utilitárias são apresentados atualmente no contexto de Karma/Jasmine. Estamos trabalhando ativamente para fornecer equivalentes do Vitest e orientações atualizadas, quando aplicável.

Esta página descreve os recursos de teste mais úteis do Angular.

As utilidades de teste do Angular incluem o `TestBed`, o `ComponentFixture` e um punhado de funções que controlam o ambiente de teste.
As classes [`TestBed`](#testbed-class-summary) e [`ComponentFixture`](#the-componentfixture) são abordadas separadamente.

Aqui está um resumo das funções independentes, em ordem de utilidade provável:

| Função       | Detalhes                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| :----------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`inject`]   | Injeta um ou mais services do injetor do `TestBed` atual em uma função de teste. Não é possível injetar um service fornecido pelo próprio component. Veja a discussão sobre o [debugElement.injector](guide/testing/components-scenarios#get-injected-services).                                                                                                                                                                         |
| `getTestBed` | Obtém a instância atual do `TestBed`. Geralmente desnecessário, porque os métodos estáticos da classe `TestBed` costumam ser suficientes. A instância do `TestBed` expõe alguns membros raramente usados que não estão disponíveis como métodos estáticos.                                                                                                                                                                             |

Para lidar com cenários assíncronos complexos ou testar aplicações legadas baseadas em Zone.js, veja o guia [Utilitários de teste do Zone.js](guide/testing/zone-js-testing-utilities).

## Resumo da classe `TestBed` {#testbed-class-summary}

A classe `TestBed` é um dos principais utilitários de teste do Angular.
Sua API é bastante extensa e pode ser avassaladora até que você a explore aos poucos.
Leia primeiro a parte inicial deste guia para entender o básico antes de tentar absorver a API completa.

A definição do módulo passada para `configureTestingModule` é um subconjunto das propriedades de metadados do `@NgModule`.

```ts
type TestModuleMetadata = {
  providers?: any[];
  declarations?: any[];
  imports?: any[];
  schemas?: Array<SchemaMetadata | any[]>;
};
```

Cada método de override recebe um `MetadataOverride<T>`, em que `T` é o tipo de metadados apropriado para o método, ou seja, o parâmetro de um `@NgModule`, `@Component`, `@Directive` ou `@Pipe`.

```ts
type MetadataOverride<T> = {
  add?: Partial<T>;
  remove?: Partial<T>;
  set?: Partial<T>;
};
```

A API do `TestBed` consiste em métodos estáticos de classe que atualizam ou referenciam uma instância _global_ do `TestBed`.

Internamente, todos os métodos estáticos encapsulam métodos da instância atual do `TestBed` em tempo de execução, que também é retornada pela função `getTestBed()`.

Chame os métodos do `TestBed` _dentro_ de um `beforeEach()` para garantir um novo começo antes de cada teste individual.

Aqui estão os métodos estáticos mais importantes, em ordem de utilidade provável.

| Métodos                  | Detalhes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| :----------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `configureTestingModule` | Os shims de teste estabelecem o [ambiente de teste inicial](guide/testing) e um módulo de teste padrão. O módulo de teste padrão é configurado com declarações básicas e alguns substitutos de services do Angular que todo testador precisa. <br /> Chame `configureTestingModule` para refinar a configuração do módulo de teste para um conjunto específico de testes, adicionando e removendo imports, declarations \(de components, directives e pipes\) e providers.                                                                                               |
| `compileComponents`      | Compila o módulo de teste de forma assíncrona depois de terminar de configurá-lo. Você **deve** chamar este método se _algum_ dos components do módulo de teste tiver recursos carregados de forma assíncrona (como blocos @defer). |
| `createComponent<T>`     | Cria uma instância de um component do tipo `T` com base na configuração atual do `TestBed`. Depois de chamar `createComponent`, a configuração do `TestBed` fica congelada pela duração da spec atual.                                                                                                                                                                                                                                                                                                                                                   |
| `overrideModule`         | Substitui os metadados do `NgModule` fornecido. Lembre-se de que módulos podem importar outros módulos. O método `overrideModule` pode chegar fundo no módulo de teste atual para modificar um desses módulos internos.                                                                                                                                                                                                                                                                                                                                    |
| `overrideComponent`      | Substitui os metadados da classe de component fornecida, que pode estar aninhada profundamente dentro de um módulo interno.                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `overrideDirective`      | Substitui os metadados da classe de directive fornecida, que pode estar aninhada profundamente dentro de um módulo interno.                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `overridePipe`           | Substitui os metadados da classe de pipe fornecida, que pode estar aninhada profundamente dentro de um módulo interno.                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `inject`                 | Recupera um service do injetor atual do `TestBed`. A função `inject` costuma ser adequada para esse propósito. Mas `inject` lança um erro se não conseguir fornecer o service. <br /> E se o service for opcional? <br /> O método `TestBed.inject()` aceita um segundo parâmetro opcional, o objeto a ser retornado se o Angular não encontrar o provider \(`null` neste exemplo\): `expect(TestBed.inject(NotProvided, null)).toBeNull();` Depois de chamar `TestBed.inject`, a configuração do `TestBed` fica congelada pela duração da spec atual. |
| `initTestEnvironment`    | Inicializa o ambiente de teste para toda a execução dos testes. <br /> Os shims de teste o chamam para você, então raramente há motivo para você chamá-lo manualmente. <br /> Chame este método _exatamente uma vez_. Para alterar este padrão no meio de uma execução de testes, chame `resetTestEnvironment` primeiro. <br /> Especifique um módulo de teste padrão do Angular e um `PlatformRef`. Alternativas para plataformas que não são browser estão disponíveis na forma geral `@angular/platform-<platform_name>/testing`. |
| `resetTestEnvironment`   | Redefine o ambiente de teste inicial, incluindo o módulo de teste padrão.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

Alguns dos métodos de instância do `TestBed` não são cobertos pelos métodos estáticos de _classe_ do `TestBed`.
Eles raramente são necessários.

## O `ComponentFixture` {#the-componentfixture}

O `TestBed.createComponent<T>` cria uma instância do component `T` e retorna um `ComponentFixture` fortemente tipado para esse component.

As propriedades e os métodos do `ComponentFixture` dão acesso ao component, à sua representação no DOM e a aspectos do seu ambiente Angular.

### Propriedades do `ComponentFixture` {#componentfixture-properties}

Aqui estão as propriedades mais importantes para testadores, em ordem de utilidade provável.

| Propriedades        | Detalhes                                                                                                                                                                                                                                                                                                                                                                   |
| :------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `componentInstance` | A instância da classe do component criada por `TestBed.createComponent`.                                                                                                                                                                                                                                                                                                    |
| `debugElement`      | O `DebugElement` associado ao elemento raiz do component. <br /> O `debugElement` fornece insights sobre o component e seu elemento DOM durante os testes e a depuração. É uma propriedade essencial para testadores. Os membros mais interessantes são abordados [abaixo](#debugelement).                                                                                  |
| `nativeElement`     | O elemento DOM nativo na raiz do component.                                                                                                                                                                                                                                                                                                                                 |
| `changeDetectorRef` | O `ChangeDetectorRef` da view host do component, e não do próprio component. Veja [Usando Zoneless no `TestBed`](guide/zoneless#using-zoneless-in-testbed).                                                                                                                                                                                                              |

### Métodos do `ComponentFixture` {#componentfixture-methods}

Os métodos do _fixture_ fazem o Angular executar certas tarefas na árvore de components.
Chame esses métodos para disparar o comportamento do Angular em resposta a ações simuladas do usuário.

Aqui estão os métodos mais úteis para testadores.

| Métodos             | Detalhes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| :------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `detectChanges`     | Dispara um ciclo de detecção de mudanças para o component. <br /> Chame-o para inicializar o component \(ele chama `ngOnInit`\) e depois que seu código de teste alterar os valores das propriedades vinculadas a dados do component. O Angular não consegue perceber que você mudou `personComponent.name` e não atualizará o binding `name` até que você chame `detectChanges`. <br /> Executa `checkNoChanges` depois para confirmar que não há atualizações circulares, a menos que seja chamado como `detectChanges(false)`;                                                                                                                                          |
| `autoDetectChanges` | Defina como `true` quando quiser que o fixture detecte mudanças automaticamente. <br /> Quando o autodetect está `true`, o fixture de teste chama `detectChanges` imediatamente após criar o component. Em seguida, ele escuta os eventos de zone relevantes e chama `detectChanges` de acordo. Quando seu código de teste modifica valores de propriedades do component diretamente, você provavelmente ainda precisará chamar `fixture.detectChanges` para disparar as atualizações de data binding. <br /> O padrão é `true` com a detecção de mudanças zoneless (padrão do `TestBed`) e `false` com a detecção de mudanças baseada em Zone. |
| `checkNoChanges`    | Executa uma rodada de detecção de mudanças para garantir que não haja mudanças pendentes. Lança uma exceção se houver.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `isStable`          | Se o fixture está _estável_ no momento, retorna `true`. Se há tarefas assíncronas que ainda não foram concluídas, retorna `false`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `whenStable`        | Retorna uma promise que é resolvida quando o fixture estiver estável. <br /> Para retomar os testes após a conclusão de uma atividade assíncrona ou de uma detecção de mudanças assíncrona, encadeie essa promise. Veja [whenStable](guide/testing/components-scenarios#whenstable).                                                                                                                                                                                                                                                                                                                                                                   |
| `destroy`           | Dispara a destruição do component.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

#### `DebugElement`

O `DebugElement` fornece insights essenciais sobre a representação DOM do component.

A partir do `DebugElement` do component raiz do teste, retornado por `fixture.debugElement`, você pode percorrer (e consultar) toda a árvore de elementos e components do fixture.

Aqui estão os membros do `DebugElement` mais úteis para testadores, em ordem aproximada de utilidade:

| Membros               | Detalhes                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| :-------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `nativeElement`       | O elemento DOM correspondente no browser                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `query`               | Chamar `query(predicate: Predicate<DebugElement>)` retorna o primeiro `DebugElement` que corresponde ao predicado em qualquer profundidade da subárvore.                                                                                                                                                                                                                                                                                                                          |
| `queryAll`            | Chamar `queryAll(predicate: Predicate<DebugElement>)` retorna todos os `DebugElements` que correspondem ao predicado em qualquer profundidade da subárvore.                                                                                                                                                                                                                                                                                                                       |
| `injector`            | O injetor de dependência do host. Por exemplo, o injetor da instância de component do elemento raiz.                                                                                                                                                                                                                                                                                                                                                                              |
| `componentInstance`   | A instância de component do próprio elemento, se houver uma.                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `context`             | Um objeto que fornece o contexto pai deste elemento. Frequentemente, é a instância de um component ancestral que governa este elemento. <br /> Quando um elemento é repetido dentro de um bloco `@for`, o context é um `RepeaterContext` cuja propriedade `$implicit` é o valor da instância da linha. Por exemplo, o `hero` em `@for(hero of heroes; ...)`.                                                                                                                         |
| `children`            | Os `DebugElement` filhos imediatos. Percorra a árvore descendo pelos `children`. `DebugElement` também tem `childNodes`, uma lista de objetos `DebugNode`. `DebugElement` deriva de `DebugNode`, e frequentemente há mais nodes do que elementos. Testadores geralmente podem ignorar os nodes simples.                                                                                                                                                                              |
| `parent`              | O `DebugElement` pai. Null se este for o elemento raiz.                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `name`                | O nome da tag do elemento, se for um elemento.                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `triggerEventHandler` | Dispara o evento pelo seu nome se houver um listener correspondente na coleção `listeners` do elemento. O segundo parâmetro é o _objeto de evento_ esperado pelo handler. <br /> Se o evento não tiver um listener ou houver outro problema, considere chamar `nativeElement.dispatchEvent(eventObject)`.                                                                                                                                                                         |
| `listeners`           | Os callbacks anexados às propriedades `@Output` do component e/ou às propriedades de evento do elemento.                                                                                                                                                                                                                                                                                                                                                                          |
| `providerTokens`      | Os tokens de lookup do injetor deste component. Inclui o próprio component, além dos tokens que o component lista em seus metadados `providers`.                                                                                                                                                                                                                                                                                                                                 |
| `references`          | Dicionário de objetos associados às variáveis locais do template (por exemplo, `#foo`), indexado pelo nome da variável local.                                                                                                                                                                                                                                                                                                                                                     |

Os métodos `DebugElement.query(predicate)` e `DebugElement.queryAll(predicate)` recebem um predicado que filtra a subárvore do elemento de origem para encontrar os `DebugElement` correspondentes.

O predicado é qualquer método que recebe um `DebugElement` e retorna um valor _truthy_.
O exemplo a seguir encontra todos os `DebugElements` com uma referência a uma variável local de template chamada "content":

```ts
// Filtra os DebugElements com uma referência #content
const contentRefs = el.queryAll((de) => de.references['content']);
```

A classe `By` do Angular tem três métodos estáticos para predicados comuns:

| Método estático           | Detalhes                                                                            |
| :------------------------ | :---------------------------------------------------------------------------------- |
| `By.all`                  | Retorna todos os elementos                                                          |
| `By.css(selector)`        | Retorna os elementos com seletores CSS correspondentes                              |
| `By.directive(directive)` | Retorna os elementos aos quais o Angular associou uma instância da classe da directive |

```ts
// Pode encontrar o DebugElement pelo seletor CSS ou pela directive
const h2 = fixture.debugElement.query(By.css('h2'));
const directive = fixture.debugElement.query(By.directive(Highlight));
```
