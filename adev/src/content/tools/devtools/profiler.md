<!-- ia-translate: true -->
# Faça o profile da sua aplicação

A aba **Profiler** permite visualizar a execução da detecção de mudanças do Angular.
Isso é útil para determinar quando e como a detecção de mudanças impacta a performance da sua aplicação.

<img src="assets/images/guide/devtools/profiler.png" alt="A screenshot of the 'Profiler' tab which reads 'Click the play button to start a new recording, or upload a json file containing profiler data.' Next to this is a record button to begin recording a new profile as well as a file picker to select an existing profile.">

A aba Profiler permite iniciar o profiling da aplicação atual ou importar um profile existente de uma execução anterior.
Para começar a fazer o profile da sua aplicação, passe o mouse sobre o círculo no canto superior esquerdo dentro da aba **Profiler** e clique em **Start recording**.

Durante o profiling, o Angular DevTools captura eventos de execução, como detecção de mudanças e execução de lifecycle hooks.
Interaja com sua aplicação para disparar a detecção de mudanças e gerar dados que o Angular DevTools possa usar.
Para finalizar a gravação, clique no círculo novamente para **Stop recording**.

Você também pode importar uma gravação existente.
Leia mais sobre este recurso na seção [Importar gravação](tools/devtools#import-and-export-recordings).

## Entender a execução da sua aplicação

Após gravar ou importar um profile, o Angular DevTools exibe uma visualização dos ciclos de detecção de mudanças.

<img src="assets/images/guide/devtools/default-profiler-view.png" alt="A screenshot of the 'Profiler' tab after a profile has been recorded or uploaded. It displays a bar chart illustrating various change detection cycles with some text which reads 'Select a bar to preview a particular change detection cycle'.">

Cada barra na sequência representa um ciclo de detecção de mudanças na sua aplicação.
Quanto mais alta a barra, mais tempo a aplicação gastou executando a detecção de mudanças neste ciclo.
Quando você seleciona uma barra, as DevTools exibem informações úteis sobre ela, incluindo:

- Um gráfico de barras com todos os components e directives que foram capturados durante este ciclo
- Quanto tempo o Angular gastou executando a detecção de mudanças neste ciclo.
- Uma taxa de quadros estimada conforme experimentada pelo usuário.
- A fonte que disparou a detecção de mudanças.

<img src="assets/images/guide/devtools/profiler-selected-bar.png" alt="A screenshot of the 'Profiler' tab. A single bar has been selected by the user and a nearby dropdown menu displays 'Bar chart`, showing a second bar chart underneath it. The new chart has two bars which take up the majority of the space, one labeled `TodosComponent` and the other labeled `NgForOf`. The other bars are small enough to be negligible in comparison.">

## Entender a execução de components

O gráfico de barras exibido após clicar em um ciclo de detecção de mudanças mostra uma visualização detalhada sobre quanto tempo sua aplicação gastou executando a detecção de mudanças naquele component ou directive específico.

Este exemplo mostra o tempo total gasto pelo directive `NgForOf` e qual método foi chamado nele.

<img src="assets/images/guide/devtools/directive-details.png" alt="A screenshot of the 'Profiler' tab where the `NgForOf` bar is selected. A detailed view of `NgForOf` is visible to the right where it lists 'Total time spent: 1.76 ms'. It includes a with exactly one row, listing `NgForOf` as a directives with an `ngDoCheck` method which took 1.76 ms. It also includes a list labeled 'Parent Hierarchy' containing the parent components of this directive.">

## Visualizações hierárquicas

<img src="assets/images/guide/devtools/flame-graph-view.png" alt="A screenshot of the 'Profiler' tab. A single bar has been selected by the user and a nearby dropdown menu now displays 'Flame graph', showing a flame graph underneath it. The flame graph starts with a row called 'Entire application' and another row called 'AppComponent'. Beneath those, the rows start to break up into multiple items, starting with `[RouterOutlet]` and `DemoAppComponent` on the third row. A few layers deep, one cell is highlighted red.">

Você também pode visualizar a execução da detecção de mudanças em uma visualização semelhante a um flame graph.

Cada célula no gráfico representa um elemento na tela em uma posição específica na árvore de renderização.
Por exemplo, considere um ciclo de detecção de mudanças onde um `LoggedOutUserComponent` é removido e em seu lugar o Angular renderiza um `LoggedInUserComponent`. Neste cenário, ambos os components serão exibidos na mesma célula.

O eixo x representa o tempo total que levou para renderizar este ciclo de detecção de mudanças.
O eixo y representa a hierarquia de elements. Executar a detecção de mudanças para um element requer renderizar seus directives e components filhos.
Juntos, este gráfico visualiza quais components estão levando mais tempo para renderizar e para onde esse tempo está indo.

Cada célula é colorida dependendo de quanto tempo o Angular gastou ali.
O Angular DevTools determina a intensidade da cor pelo tempo gasto em relação à célula onde a renderização levou mais tempo.

Quando você clica em uma determinada célula, verá detalhes sobre ela no painel à direita.
Clicar duas vezes na célula amplia a visualização para que você possa ver mais facilmente seus filhos aninhados.

## Debugar detecção de mudanças e components `OnPush`

Normalmente, o gráfico visualiza o tempo que leva para _renderizar_ uma aplicação, para qualquer quadro de detecção de mudanças. No entanto, alguns components, como components `OnPush`, só serão renderizados novamente se suas propriedades de input mudarem. Pode ser útil visualizar o flame graph sem esses components para quadros específicos.

Para visualizar apenas os components em um quadro de detecção de mudanças que passaram pelo processo de detecção de mudanças, marque a caixa de seleção **Change detection** no topo, acima do flame graph.

Esta visualização destaca todos os components que passaram pela detecção de mudanças e exibe aqueles que não passaram em cinza, como components `OnPush` que não foram renderizados novamente.

<img src="assets/images/guide/devtools/debugging-onpush.png" alt="A screenshot of the 'Profiler' tab displaying a flame chart visualization of a change detection cycle. A checkbox labeled 'Show only change detection' is now checked. The flame graph looks very similar to before, however the color of components has changed from orange to blue. Several tiles labeled `[RouterOutlet]` are no longer highlighted with any color.">

## Importar e exportar gravações

Clique no botão **Save Profile** no canto superior direito de uma sessão de profiling gravada para exportá-la como um arquivo JSON e salvá-la no disco.
Posteriormente, importe o arquivo na visualização inicial do profiler clicando na entrada **Choose file**.

<img src="assets/images/guide/devtools/save-profile.png" alt="A screenshot of the 'Profiler' tab displaying change detection cycles. On the right side a 'Save Profile' button is visible.">
