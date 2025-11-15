<!-- ia-translate: true -->
# Computações lentas

Em cada ciclo de change detection, o Angular sincronamente:

- Avalia todas as expressões de template em todos os components, a menos que especificado de outra forma, com base na estratégia de detecção de cada component
- Executa os lifecycle hooks `ngDoCheck`, `ngAfterContentChecked`, `ngAfterViewChecked` e `ngOnChanges`.
  Uma única computação lenta dentro de um template ou lifecycle hook pode desacelerar todo o processo de change detection porque o Angular executa as computações sequencialmente.

## Identificando computações lentas

Você pode identificar computações pesadas com o profiler do Angular DevTools. Na timeline de performance, clique em uma barra para visualizar um ciclo de change detection específico. Isso exibe um gráfico de barras, que mostra quanto tempo o framework gastou em change detection para cada component. Quando você clica em um component, pode visualizar quanto tempo o Angular gastou avaliando seu template e lifecycle hooks.

<img alt="Visualização do profiler do Angular DevTools mostrando computação lenta" src="assets/images/best-practices/runtime-performance/slow-computations.png">

Por exemplo, na captura de tela acima, o segundo ciclo de change detection gravado está selecionado. O Angular gastou mais de 573 ms neste ciclo, com a maior parte do tempo gasto no `EmployeeListComponent`. No painel de detalhes, você pode ver que o Angular gastou mais de 297 ms avaliando o template do `EmployeeListComponent`.

## Otimizando computações lentas

Aqui estão várias técnicas para remover computações lentas:

- **Otimizando o algoritmo subjacente**. Esta é a abordagem recomendada. Se você conseguir acelerar o algoritmo que está causando o problema, você pode acelerar todo o mecanismo de change detection.
- **Caching usando pure pipes**. Você pode mover a computação pesada para um [pipe](guide/pipes) puro. O Angular reavalia um pure pipe apenas se detectar que seus inputs mudaram, comparado com a vez anterior que o Angular o chamou.
- **Usando memoization**. [Memoization](https://en.wikipedia.org/wiki/Memoization) é uma técnica similar aos pure pipes, com a diferença de que pure pipes preservam apenas o último resultado da computação, enquanto memoization pode armazenar múltiplos resultados.
- **Evite repaints/reflows em lifecycle hooks**. Certas [operações](https://web.dev/avoid-large-complex-layouts-and-layout-thrashing/) fazem com que o browser recalcule sincronamente o layout da página ou a renderize novamente. Como reflows e repaints geralmente são lentos, você deve evitar executá-los em cada ciclo de change detection.

Pure pipes e memoization têm trade-offs diferentes. Pure pipes são um conceito integrado do Angular, comparado com memoization, que é uma prática geral de engenharia de software para fazer cache de resultados de funções. A sobrecarga de memória da memoization pode ser significativa se você invocar a computação pesada frequentemente com argumentos diferentes.
