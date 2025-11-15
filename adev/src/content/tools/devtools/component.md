<!-- ia-translate: true -->
# Inspecione a árvore de components

## Debugar sua aplicação

A aba **Components** permite explorar a estrutura da sua aplicação.
Você pode visualizar as instâncias de components e directives no DOM e inspecionar ou modificar seu estado.

### Explorar a estrutura da aplicação

A árvore de components exibe uma relação hierárquica dos _components e directives_ dentro da sua aplicação.

<img src="assets/images/guide/devtools/component-explorer.png" alt="A screenshot of the 'Components' tab showing a tree of Angular components and directives starting the root of the application.">

Clique nos components ou directives individuais no explorador de components para selecioná-los e visualizar suas propriedades.
O Angular DevTools exibe propriedades e metadados no lado direito da árvore de components.

Para procurar um component ou directive por nome, use a caixa de busca acima da árvore de components.

<img src="assets/images/guide/devtools/search.png" alt="A screenshot of the 'Components' tab. The filter bar immediately underneath the tab is searching for 'todo' and all components with 'todo' in the name are highlighted in the tree. `app-todos` is currently selected and a sidebar to the right displays information about the component's properties. This includes a section of `@Output` fields and another section for other properties.">

### Navegar para o host node

Para ir ao elemento host de um component ou directive específico, clique duas vezes nele no explorador de components.
O Angular DevTools abrirá a aba Elements no Chrome ou a aba Inspector no Firefox, e selecionará o nó DOM associado.

### Navegar para o código-fonte

Para components, o Angular DevTools permite navegar para a definição do component na aba Sources (Chrome) e aba Debugger (Firefox).
Após selecionar um component específico, clique no ícone no canto superior direito da visualização de propriedades:

<img src="assets/images/guide/devtools/navigate-source.png" alt="A screenshot of the 'Components' tab. The properties view on the right is visible for a component and the mouse rests in the upper right corner of that view on top of a `<>` icon. An adjacent tooltip reads 'Open component source'.">

### Atualizar valor de propriedade

Assim como as DevTools dos navegadores, a visualização de propriedades permite editar o valor de um input, output ou outras propriedades.
Clique com o botão direito no valor da propriedade e, se a funcionalidade de edição estiver disponível para este tipo de valor, uma entrada de texto aparecerá.
Digite o novo valor e pressione `Enter` para aplicar este valor à propriedade.

<img src="assets/images/guide/devtools/update-property.png" alt="A screenshot of the 'Components' tab with the properties view open for a component. An `@Input` named `todo` contains a `label` property which is currently selected and has been manually updated to the value 'Buy milk'.">

### Acessar component ou directive selecionado no console

Como um atalho no console, o Angular DevTools fornece acesso a instâncias de components ou directives recentemente selecionados.
Digite `$ng0` para obter uma referência à instância do component ou directive atualmente selecionado, e digite `$ng1` para a instância selecionada anteriormente, `$ng2` para a instância selecionada antes dela, e assim por diante.

<img src="assets/images/guide/devtools/access-console.png" alt="A screenshot of the 'Components' tab with the browser console underneath. In the console, the user has typed three commands, `$ng0`, `$ng1`, and `$ng2` to view the three most recently selected elements. After each statement, the console prints a different component reference.">

### Selecionar um directive ou component

Semelhante às DevTools dos navegadores, você pode inspecionar a página para selecionar um component ou directive específico.
Clique no ícone **_Inspect element_** no canto superior esquerdo dentro do Angular DevTools e passe o mouse sobre um elemento DOM na página.
A extensão reconhece os directives e/ou components associados e permite selecionar o elemento correspondente na árvore de Components.

<img src="assets/images/guide/devtools/inspect-element.png" alt="A screenshot of the 'Components' tab with an Angular todo application visible. In the very top-left corner of Angular DevTools, an icon of a screen with a mouse icon inside it is selected. The mouse rests on a todo element in the Angular application UI. The element is highlighted with a `<TodoComponent>` label displayed in an adjacent tooltip.">

## Inspecione seus injectors

NOTA: A Árvore de Injector está disponível para aplicações Angular construídas com a versão 17 ou superior.

### Visualizar a hierarquia de injectors da sua aplicação

A aba **Injector Tree** permite explorar a estrutura dos Injectors configurados na sua aplicação. Aqui você verá duas árvores representando a [hierarquia de injectors](guide/di/hierarchical-dependency-injection) da sua aplicação. Uma árvore é sua hierarquia de environment, a outra é sua hierarquia de element.

<img src="assets/images/guide/devtools/di-injector-tree.png" alt="A screenshot of the 'Profiler' tab displaying the injector tree tab in Angular Devtools visualizing the injector graph for an example application.">

### Visualizar caminhos de resolução

Quando um injector específico é selecionado, o caminho que o algoritmo de injeção de dependência do Angular percorre daquele injector até a raiz é destacado. Para element injectors, isso inclui destacar os environment injectors para os quais o algoritmo de injeção de dependência salta quando uma dependência não pode ser resolvida na hierarquia de element.

Veja [regras de resolução](guide/di/hierarchical-dependency-injection#resolution-rules) para mais detalhes sobre como o Angular resolve caminhos de resolução.

<img src="assets/images/guide/devtools/di-injector-tree-selected.png" alt="A screenshot of the 'Profiler' tab displaying how the injector tree visualize highlights resolution paths when an injector is selected.">

### Visualizar providers do injector

Clicar em um injector que possui providers configurados exibirá esses providers em uma lista à direita da visualização da árvore de injector. Aqui você pode visualizar o token fornecido e seu tipo.

<img src="assets/images/guide/devtools/di-injector-tree-providers.png" alt="A screenshot of the 'Profiler' tab displaying how providers are made visible when an injector is selected.">
