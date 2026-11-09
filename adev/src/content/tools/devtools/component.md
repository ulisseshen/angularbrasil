<!-- ia-translate: true -->
# Inspecione a árvore de components {#inspect-the-component-tree}

## Debugar sua aplicação {#debug-your-application}

A aba **Components** permite explorar a estrutura da sua aplicação.
Você pode visualizar as instâncias de components e directives no DOM e inspecionar ou modificar o estado delas.

### Explorar a estrutura da aplicação {#explore-the-application-structure}

A árvore de components exibe a relação hierárquica dos _components e directives_ dentro da sua aplicação.

<img src="assets/images/guide/devtools/component-explorer.png" alt="Captura de tela da aba 'Components' mostrando uma árvore de components e directives do Angular, começando na raiz da aplicação.">

Clique nos components ou directives individuais no explorador de components para selecioná-los e visualizar suas propriedades.
O Angular DevTools exibe propriedades e metadados no lado direito da árvore de components.

Para procurar um component ou directive pelo nome, use a caixa de busca acima da árvore de components.

<img src="assets/images/guide/devtools/search.png" alt="Captura de tela da aba 'Components'. A barra de filtro logo abaixo da aba está buscando 'todo', e todos os components com 'todo' no nome estão destacados na árvore. `app-todos` está selecionado no momento, e uma barra lateral à direita exibe informações sobre as propriedades do component. Isso inclui uma seção de campos `@Output` e outra seção para as demais propriedades.">

### Navegar para o host node {#navigate-to-the-host-node}

Para ir ao elemento host de um component ou directive específico, clique duas vezes nele no explorador de components.
O Angular DevTools abrirá a aba Elements no Chrome ou a aba Inspector no Firefox, e selecionará o nó DOM associado.

### Navegar para o código-fonte {#navigate-to-source}

Para components, o Angular DevTools permite navegar até a definição do component na aba Sources (Chrome) ou na aba Debugger (Firefox).
Depois de selecionar um component específico, clique no ícone no canto superior direito da visualização de propriedades:

<img src="assets/images/guide/devtools/navigate-source.png" alt="Captura de tela da aba 'Components'. A visualização de propriedades à direita está visível para um component, e o mouse está posicionado no canto superior direito dessa visualização, sobre um ícone `<>`. Uma dica de ferramenta ao lado diz 'Open component source'.">

### Atualizar valor de propriedade {#update-property-value}

Assim como as DevTools dos navegadores, a visualização de propriedades permite editar o valor de um input, output ou outras propriedades.
Clique com o botão direito no valor da propriedade e, se a funcionalidade de edição estiver disponível para esse tipo de valor, um campo de texto aparecerá.
Digite o novo valor e pressione `Enter` para aplicá-lo à propriedade.

<img src="assets/images/guide/devtools/update-property.png" alt="Captura de tela da aba 'Components' com a visualização de propriedades aberta para um component. Um `@Input` chamado `todo` contém uma propriedade `label`, que está selecionada e foi atualizada manualmente para o valor 'Buy milk'.">

### Acessar component ou directive selecionado no console {#access-selected-component-or-directive-in-console}

Como atalho no console, o Angular DevTools fornece acesso às instâncias dos components ou directives selecionados recentemente.
Digite `$ng0` para obter uma referência à instância do component ou directive atualmente selecionado, `$ng1` para a instância selecionada anteriormente, `$ng2` para a instância selecionada antes dessa, e assim por diante.

<img src="assets/images/guide/devtools/access-console.png" alt="Captura de tela da aba 'Components' com o console do navegador logo abaixo. No console, o usuário digitou três comandos, `$ng0`, `$ng1` e `$ng2`, para visualizar os três elementos selecionados mais recentemente. Após cada instrução, o console exibe uma referência de component diferente.">

### Selecionar um directive ou component {#select-a-directive-or-component}

Assim como nas DevTools dos navegadores, você pode inspecionar a página para selecionar um component ou directive específico.
Clique no ícone **_Inspect element_** no canto superior esquerdo do Angular DevTools e passe o mouse sobre um elemento DOM na página.
A extensão reconhece os directives e/ou components associados e permite selecionar o elemento correspondente na árvore de Components.

<img src="assets/images/guide/devtools/inspect-element.png" alt="Captura de tela da aba 'Components' com uma aplicação todo do Angular visível. No canto superior esquerdo do Angular DevTools, um ícone de tela com um ícone de mouse dentro está selecionado. O mouse está sobre um elemento todo na interface da aplicação Angular. O elemento está destacado com um rótulo `<TodoComponent>` exibido em uma dica de ferramenta ao lado.">

### Inspecionar views deferrable {#inspect-deferrable-views}

Junto com as directives, a árvore de directives também inclui os [blocos `@defer`](/guide/templates/defer).

<img src="assets/images/guide/devtools/defer-block.png" />

Clicar em um bloco defer mostra mais detalhes na barra lateral de propriedades: os diferentes blocos opcionais (por exemplo, `@loading`, `@placeholder` e `@error`), os triggers configurados (triggers de defer, triggers de prefetch e triggers de hydrate) e opções de tempo, como os valores `minimum` e `after`.

### Hidratação {#hydration}

Quando a [hidratação](/guide/hydration) está habilitada na sua aplicação SSR/SSG, a árvore de directives mostra o status de hidratação de cada component.

Em caso de erros, uma mensagem de erro é exibida no component afetado.

<img src="assets/images/guide/devtools/hydration-status.png" />

O status de hidratação também pode ser visualizado na própria aplicação, habilitando o overlay.

<img src="assets/images/guide/devtools/hydration-overlay-ecom.png" />

Aqui está uma ilustração dos overlays de hidratação em um app de e-shop de exemplo do Angular.

### Depurar o grafo de signals {#debug-the-signal-graph}

Para visualizar como os signals, computeds e effects de um component dependem uns dos outros, veja [Depure o grafo de signals](tools/devtools/signals).
