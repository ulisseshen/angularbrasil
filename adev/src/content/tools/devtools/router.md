<!-- ia-translate: true -->
# Inspecione a árvore de rotas

A aba **Router Tree** permite visualizar a árvore de rotas da sua aplicação. Você pode explorar como as rotas são aninhadas e ver detalhes de rotas específicas.

<img src="assets/images/guide/devtools/router-tree.png" alt="Captura de tela da aba 'Router Tree' no Angular DevTools mostrando uma árvore de rotas configuradas. As rotas ativas estão destacadas em verde, enquanto as inativas aparecem em branco.">

### Visualizar detalhes da rota {#view-route-details}

Quando você seleciona uma rota específica na árvore, o Angular DevTools exibe as propriedades dela na barra lateral à direita. Essas informações incluem:

- **Path**: O caminho de URL da rota. Se a rota usa um URL matcher customizado, o DevTools exibe o **Matcher** no lugar.
- **Component**: O component renderizado para esta rota. Se a rota for um redirecionamento, o DevTools exibe o destino **Redirect to** no lugar.
- **Path Match**: A estratégia de correspondência de caminho (`prefix` ou `full`), se configurada.
- **Data**: Dados estáticos associados à rota, exibidos como uma árvore JSON.
- **Resolvers**: Resolvers da rota, exibidos como pares chave-valor.
- **Guards**: Quaisquer guards configurados na rota, agrupados por tipo — `canActivate`, `canActivateChild`, `canDeactivate` e `canMatch`.
- **Providers**: Providers no nível da rota, se configurados.
- **Title**: O título da rota, se configurado.
- **RunGuardsAndResolvers**: A estratégia de reexecução de guards e resolvers, se configurada.
- **Active**: Indica se esta rota está ativa no momento.
- **Auxiliary**: Indica se a rota é uma rota auxiliar (por exemplo, em um outlet nomeado).
- **Lazy**: Indica se a rota é carregada de forma lazy.

NOTA: Propriedades como Path Match, Data, Resolvers, Guards, Providers, Title e RunGuardsAndResolvers só aparecem na barra lateral quando estão configuradas na rota selecionada.

### Navegar para uma rota específica {#navigate-to-a-specific-route}

Você pode disparar a navegação diretamente pelo DevTools com facilidade. Enquanto inspeciona os detalhes de uma rota na barra lateral à direita, clique no ícone **Navigate** ao lado do caminho. Isso faz o router do Angular navegar para essa URL na sua aplicação.

<img src="assets/images/guide/devtools/router-tree-navigate.png" alt="Captura de tela mostrando a dica de ferramenta 'Navigate to' sobre o caminho da rota na barra lateral 'Routes Details'.">
