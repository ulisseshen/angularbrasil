<!-- ia-translate: true -->
# Computações lentas {#slow-computations}

A cada ciclo de change detection, o Angular, de forma síncrona:

- Avalia todas as expressões de template em todos os components, a menos que especificado de outra forma, com base na estratégia de detecção de cada component
- Executa os lifecycle hooks `ngDoCheck`, `ngAfterContentChecked`, `ngAfterViewChecked` e `ngOnChanges`.
  Uma única computação lenta dentro de um template ou de um lifecycle hook pode desacelerar todo o processo de change detection, porque o Angular executa as computações sequencialmente.

## Identificando computações lentas {#identifying-slow-computations}

Você pode identificar computações pesadas com o profiler do Angular DevTools. Na timeline de performance, clique em uma barra para visualizar um ciclo de change detection específico. Isso exibe um gráfico de barras que mostra quanto tempo o framework gastou em change detection para cada component. Ao clicar em um component, você pode visualizar quanto tempo o Angular gastou avaliando o template e os lifecycle hooks dele.

<img alt="Angular DevTools profiler preview showing slow computation" src="assets/images/best-practices/runtime-performance/slow-computations.png">

Por exemplo, na captura de tela anterior, o segundo ciclo de change detection gravado está selecionado. O Angular gastou mais de 573 ms nesse ciclo, com a maior parte do tempo no `EmployeeListComponent`. No painel de detalhes, você pode ver que o Angular gastou mais de 297 ms avaliando o template do `EmployeeListComponent`.

## Otimizando computações lentas {#optimizing-slow-computations}

Aqui estão várias técnicas para remover computações lentas:

- **Otimizando o algoritmo subjacente**. Esta é a abordagem recomendada. Se você conseguir acelerar o algoritmo que está causando o problema, poderá acelerar todo o mecanismo de change detection.
- **Fazendo cache com pure pipes**. Você pode mover a computação pesada para um [pipe](guide/templates/pipes) puro. O Angular reavalia um pure pipe somente se detectar que seus inputs mudaram em relação à última vez em que o Angular o chamou.
- **Usando memoization**. [Memoization](https://en.wikipedia.org/wiki/Memoization) é uma técnica semelhante aos pure pipes, com a diferença de que pure pipes preservam apenas o último resultado da computação, enquanto a memoization pode armazenar múltiplos resultados.
- **Evite repaints/reflows em lifecycle hooks**. Certas [operações](https://web.dev/avoid-large-complex-layouts-and-layout-thrashing/) fazem com que o navegador recalcule sincronamente o layout da página ou a renderize novamente. Como reflows e repaints geralmente são lentos, você deve evitar executá-los a cada ciclo de change detection.

Pure pipes e memoization têm trade-offs diferentes. Pure pipes são um conceito integrado ao Angular, enquanto a memoization é uma prática geral de engenharia de software para fazer cache de resultados de funções. A sobrecarga de memória da memoization pode ser significativa se você invocar a computação pesada com frequência e com argumentos diferentes.
