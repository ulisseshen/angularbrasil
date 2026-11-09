<!-- ia-translate: true -->
# Faça o profile da sua aplicação {#profile-your-application}

A aba **Profiler** permite visualizar a execução da detecção de mudanças do Angular.
Isso é útil para determinar quando e como a detecção de mudanças impacta a performance da sua aplicação.

<img src="assets/images/guide/devtools/profiler.png" alt="Captura de tela da aba 'Profiler' com o texto 'Click the play button to start a new recording, or upload a json file containing profiler data.' Ao lado, há um botão de gravação para iniciar um novo profile, além de um seletor de arquivos para escolher um profile existente.">

A aba Profiler permite iniciar o profiling da aplicação atual ou importar um profile existente de uma execução anterior.
Para começar a fazer o profile da sua aplicação, passe o mouse sobre o círculo no canto superior esquerdo da aba **Profiler** e clique em **Start recording**.

Durante o profiling, o Angular DevTools captura eventos de execução, como a detecção de mudanças e a execução de lifecycle hooks.
Interaja com sua aplicação para disparar a detecção de mudanças e gerar dados que o Angular DevTools possa usar.
Para finalizar a gravação, clique no círculo novamente para **Stop recording**.

Você também pode importar uma gravação existente.
Leia mais sobre este recurso na seção [Importar e exportar gravações](tools/devtools/profiler#import-and-export-recordings).

## Entender a execução da sua aplicação {#understand-your-applications-execution}

Após gravar ou importar um profile, o Angular DevTools exibe uma visualização dos ciclos de detecção de mudanças.

<img src="assets/images/guide/devtools/default-profiler-view.png" alt="Captura de tela da aba 'Profiler' depois que um profile foi gravado ou enviado. Ela exibe um gráfico de barras com vários ciclos de detecção de mudanças e o texto 'Select a bar to preview a particular change detection cycle'.">

Cada barra da sequência representa um ciclo de detecção de mudanças na sua aplicação.
Quanto mais alta a barra, mais tempo a aplicação gastou executando a detecção de mudanças nesse ciclo.
Quando você seleciona uma barra, o DevTools exibe informações úteis sobre ela, incluindo:

- Um gráfico de barras com todos os components e directives que foram capturados durante esse ciclo
- Quanto tempo o Angular gastou executando a detecção de mudanças nesse ciclo.
- Uma taxa de quadros estimada, conforme experimentada pelo usuário (se abaixo de 60 fps)

<img src="assets/images/guide/devtools/profiler-selected-bar.png" alt="Captura de tela da aba 'Profiler'. Uma única barra foi selecionada pelo usuário e um menu suspenso próximo exibe 'Bar chart', mostrando um segundo gráfico de barras abaixo dele. O novo gráfico tem duas barras que ocupam a maior parte do espaço, uma com o rótulo `TodosComponent` e outra com o rótulo `NgForOf`. As demais barras são pequenas o suficiente para serem insignificantes em comparação.">

## Entender a execução de components {#understand-component-execution}

O gráfico de barras exibido após clicar em um ciclo de detecção de mudanças mostra uma visualização detalhada de quanto tempo a aplicação gastou executando a detecção de mudanças naquele component ou directive específico.

Este exemplo mostra o tempo total gasto pelo directive `NgForOf` e qual método foi chamado nele.

<img src="assets/images/guide/devtools/directive-details.png" alt="Captura de tela da aba 'Profiler' com a barra `NgForOf` selecionada. Uma visualização detalhada de `NgForOf` aparece à direita, com 'Total time spent: 1.76 ms'. Inclui uma tabela com exatamente uma linha, listando `NgForOf` como um directive com um método `ngDoCheck` que levou 1.76 ms. Também inclui uma lista chamada 'Parent Hierarchy' com os components pais desse directive.">

## Visualizações hierárquicas {#hierarchical-views}

<img src="assets/images/guide/devtools/flame-graph-view.png" alt="Captura de tela da aba 'Profiler'. Uma única barra foi selecionada pelo usuário e um menu suspenso próximo agora exibe 'Flame graph', mostrando um flame graph abaixo dele. O flame graph começa com uma linha chamada 'Entire application' e outra linha chamada 'AppComponent'. Abaixo delas, as linhas começam a se dividir em vários itens, começando por `[RouterOutlet]` e `DemoAppComponent` na terceira linha. A algumas camadas de profundidade, uma célula está destacada em vermelho.">

Você também pode visualizar a execução da detecção de mudanças em uma visualização semelhante a um flame graph.

Cada célula do gráfico representa um elemento na tela em uma posição específica na árvore de renderização.
Por exemplo, considere um ciclo de detecção de mudanças em que um `LoggedOutUserComponent` é removido e, em seu lugar, o Angular renderiza um `LoggedInUserComponent`. Nesse cenário, ambos os components serão exibidos na mesma célula.

O eixo x representa o tempo total que levou para renderizar este ciclo de detecção de mudanças.
O eixo y representa a hierarquia de elements. Executar a detecção de mudanças para um element exige renderizar seus directives e components filhos.
Juntos, esses dados mostram quais components estão levando mais tempo para renderizar e para onde esse tempo está indo.

Cada célula é colorida de acordo com o tempo que o Angular gastou ali.
O Angular DevTools determina a intensidade da cor pelo tempo gasto em relação à célula em que a renderização levou mais tempo.

Quando você clica em uma célula, vê os detalhes dela no painel à direita.
Clicar duas vezes na célula a amplia, para que você possa ver mais facilmente os filhos aninhados.

## Debugar detecção de mudanças e components `OnPush` {#debug-change-detection-and-onpush-components}

Normalmente, o gráfico visualiza o tempo que leva para _renderizar_ uma aplicação, para qualquer quadro de detecção de mudanças. No entanto, alguns components, como os components `OnPush`, só são renderizados novamente se suas propriedades de input mudarem. Pode ser útil visualizar o flame graph sem esses components para quadros específicos.

Para visualizar apenas os components de um quadro de detecção de mudanças que passaram pelo processo de detecção, marque a caixa de seleção **Change detection** no topo, acima do flame graph.

Essa visualização destaca todos os components que passaram pela detecção de mudanças e exibe em cinza aqueles que não passaram, como os components `OnPush` que não foram renderizados novamente.

<img src="assets/images/guide/devtools/debugging-onpush.png" alt="Captura de tela da aba 'Profiler' exibindo a visualização de flame chart de um ciclo de detecção de mudanças. A caixa de seleção 'Show only change detection' agora está marcada. O flame graph parece muito semelhante ao anterior, porém a cor dos components mudou de laranja para azul. Várias células com o rótulo `[RouterOutlet]` não estão mais destacadas com nenhuma cor.">

## Importar e exportar gravações {#import-and-export-recordings}

Clique no botão **Save Profile** no canto superior direito de uma sessão de profiling gravada para exportá-la como um arquivo JSON e salvá-la no disco.
Depois, importe o arquivo na visualização inicial do profiler clicando na entrada **Choose file**.

<img src="assets/images/guide/devtools/save-profile.png" alt="Captura de tela da aba 'Profiler' exibindo ciclos de detecção de mudanças. No lado direito, o botão 'Save Profile' está visível.">
</content>
