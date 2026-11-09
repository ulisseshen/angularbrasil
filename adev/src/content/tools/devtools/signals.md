<!-- ia-translate: true -->
# Depure o grafo de signals {#debug-the-signal-graph}

A aba **Components** pode exibir um grafo de signals em tempo real para o component ou directive selecionado.
O grafo mostra como os signals, computeds, effects e outros nós reativos desse component dependem uns dos outros, o que facilita entender e depurar os fluxos de dados reativos.

<img src="assets/images/guide/devtools/signal-graph.png" alt="Captura de tela da aba 'Components' no Angular DevTools com o grafo de signals aberto para o component selecionado. O grafo mostra um nó de signal conectado por arestas a três nós computed que o template do component lê, e as propriedades do component são listadas em uma barra lateral à direita.">

## Abrir o grafo de signals {#open-the-signal-graph}

Na aba **Components**, selecione um component ou directive.
No cabeçalho do painel de propriedades, clique em **Show Signal Graph**.
O grafo de signals abre ao lado da árvore de components.

Você também pode ir diretamente para um signal específico: na visualização de propriedades, clique no botão do grafo de signals ao lado da propriedade ou, quando a propriedade tiver mais de uma ação, abra o menu de ações dela e escolha **Show in signal graph**.

O botão **Show Signal Graph** aparece automaticamente quando a aplicação inspecionada oferece suporte à API do grafo de signals — não há nenhuma configuração para habilitá-lo.

## Ler o grafo {#read-the-graph}

Os nós do grafo representam os nós reativos que participam do component selecionado:

- **Signal**: um signal gravável criado com `signal()`.
- **Computed**: um valor derivado criado com `computed()`.
- **Effect**: um efeito colateral criado com `effect()` ou `afterRenderEffect()`.
- **Linked signal**: um signal gravável criado com `linkedSignal()`.
- **Template**: o template do component, que lê signals quando renderiza.
- **Resource**: signals que pertencem a um `resource()` ou `rxResource()` são agrupados em um cluster recolhível. Clique em **Expand** no nó do cluster para ver os nós individuais dentro dele.

As linhas entre os nós mostram as dependências reativas: cada nó está conectado aos produtores dos quais ele lê (upstream) e aos dependentes que o leem (downstream).

DICA: Os nós são rotulados com o `debugName` do nó reativo. Dar aos seus signals, computeds e, principalmente, aos effects — que geralmente não são atribuídos a um membro da classe — um `debugName` torna o grafo bem mais fácil de ler:

```ts
effect(
  () => {
    // ...
  },
  {debugName: 'name in graph'},
);
```

## Pesquisar no grafo {#search-the-graph}

Clique no ícone de busca na barra de ferramentas do grafo para encontrar um nó pelo nome.
O Angular DevTools destaca todas as correspondências e permite navegar por elas uma a uma.

## Inspecionar um nó {#inspect-a-node}

Clique em um nó para abrir o painel de detalhes dele, que mostra o valor atual do nó como uma árvore expansível e oferece as seguintes ações:

- **View source**: navega até a definição do nó na aba Sources (Chrome) ou na aba Debugger (Firefox). A ação fica desabilitada quando a localização do código-fonte não está disponível.
- **Set breakpoint**: pausa a execução quando o signal é atualizado. Breakpoints estão disponíveis apenas em navegadores baseados em Chromium.
- **Watch signal**: registra no console do navegador as atualizações e invalidações do signal. Clique na ação novamente para parar de observar.
- **Highlight upstream / downstream**: rastreia os caminhos das dependências do nó ou dos seus dependentes.

Se o component não usar signals, o Angular DevTools exibe a mensagem "No signals in this component" no lugar do grafo.

## Suporte a versões {#version-support}

O grafo de signals requer uma aplicação construída com Angular 19 ou superior executando em modo de desenvolvimento.
