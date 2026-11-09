<!-- ia-translate: true -->
# Resolvendo zone pollution {#resolving-zone-pollution}

**Zone.js** é um mecanismo de sinalização que o Angular usa para detectar quando o estado de uma aplicação pode ter mudado. Ele captura operações assíncronas como `setTimeout`, requisições de rede e event listeners. O Angular agenda a change detection com base nos sinais do Zone.js.

Em alguns casos, [tasks](https://developer.mozilla.org/docs/Web/API/HTML_DOM_API/Microtask_guide#tasks) ou [microtasks](https://developer.mozilla.org/docs/Web/API/HTML_DOM_API/Microtask_guide#microtasks) agendadas não fazem nenhuma mudança no modelo de dados, o que torna a execução de change detection desnecessária. Exemplos comuns são:

- `requestAnimationFrame`, `setTimeout` ou `setInterval`
- Agendamento de tasks ou microtasks por bibliotecas de terceiros

Esta seção cobre como identificar essas condições e como executar código fora do Angular zone para evitar chamadas desnecessárias de change detection.

## Identificando chamadas desnecessárias de change detection {#identifying-unnecessary-change-detection-calls}

Você pode detectar chamadas desnecessárias de change detection usando o Angular DevTools. Frequentemente, elas aparecem como barras consecutivas na timeline do profiler, com source `setTimeout`, `setInterval`, `requestAnimationFrame` ou um event handler. Quando há poucas chamadas dessas APIs na sua aplicação, a invocação de change detection geralmente é causada por uma biblioteca de terceiros.

<img alt="Visualização do profiler do Angular DevTools mostrando Zone pollution" src="assets/images/best-practices/runtime-performance/zone-pollution.png">

Na imagem acima, há uma série de chamadas de change detection disparadas por event handlers associados a um elemento. Esse é um desafio comum ao usar components de terceiros não nativos do Angular, que não alteram o comportamento padrão do `NgZone`.

## Execute tasks fora do `NgZone` {#run-tasks-outside-ngzone}

Nesses casos, você pode instruir o Angular a evitar chamar change detection para as tasks agendadas por um determinado trecho de código usando o [NgZone](/api/core/NgZone).

```ts {header:"Execute fora do Zone" , linenums}
import { Component, NgZone, OnInit, inject } from '@angular/core';

@Component(...)
class App implements OnInit {
  private ngZone = inject(NgZone);

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => setInterval(pollForUpdates, 500));
  }
}
```

O trecho acima instrui o Angular a chamar `setInterval` fora do Angular Zone e a pular a execução de change detection depois que `pollForUpdates` é executado.

Bibliotecas de terceiros comumente disparam ciclos desnecessários de change detection quando suas APIs são invocadas dentro do Angular zone. Isso afeta principalmente bibliotecas que configuram event listeners ou iniciam outras tasks (como timers, requisições XHR, etc.). Evite esses ciclos extras chamando as APIs da biblioteca fora do Angular zone:

```ts {header:"Mova a inicialização do plot para fora do Zone" , linenums}
import { Component, NgZone, OnInit, inject } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';

@Component(...)
class App implements OnInit {
  private ngZone = inject(NgZone);

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      Plotly.newPlot('chart', data);
    });
  }
}
```

Executar `Plotly.newPlot('chart', data);` dentro de `runOutsideAngular` instrui o framework a não executar change detection após a execução das tasks agendadas pela lógica de inicialização.

Por exemplo, se `Plotly.newPlot('chart', data)` adicionar event listeners a um elemento DOM, o Angular não executará change detection depois da execução dos handlers deles.

Mas, às vezes, você pode precisar ouvir eventos disparados por APIs de terceiros. Nesses casos, é importante lembrar que esses event listeners também serão executados fora do Angular zone se a lógica de inicialização tiver sido feita ali:

```ts {header:"Verifique se o handler é chamado fora do Zone" , linenums}
import { Component, NgZone, OnInit, output, inject } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';

@Component(...)
class App implements OnInit {
  private ngZone = inject(NgZone);

  plotlyClick = output<Plotly.PlotMouseEvent>();

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.createPlotly();
    });
  }

  private async createPlotly() {
    const plotly = await Plotly.newPlot('chart', data);

    plotly.on('plotly_click', (event: Plotly.PlotMouseEvent) => {
      // Este handler será chamado fora do Angular zone porque
      // a lógica de inicialização também é chamada fora do zone. Para verificar
      // se estamos no Angular zone, podemos chamar o seguinte:
      console.log(NgZone.isInAngularZone());
      this.plotlyClick.emit(event);
    });
  }
}
```

Se você precisar despachar eventos para components pais e executar lógica específica de atualização de view, deve considerar reentrar no Angular zone para instruir o framework a executar change detection, ou executar change detection manualmente:

```ts {header:"Reentre no Angular zone ao despachar o evento" , linenums}
import { Component, NgZone, OnInit, output, inject } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';

@Component(...)
class App implements OnInit {
  private ngZone = inject(NgZone);

  plotlyClick = output<Plotly.PlotMouseEvent>();

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.createPlotly();
    });
  }

  private async createPlotly() {
    const plotly = await Plotly.newPlot('chart', data);

    plotly.on('plotly_click', (event: Plotly.PlotMouseEvent) => {
      this.ngZone.run(() => {
        this.plotlyClick.emit(event);
      });
    });
  }
}
```

O cenário de despachar eventos fora do Angular zone também pode surgir. É importante lembrar que disparar change detection (por exemplo, manualmente) pode resultar na criação ou atualização de views fora do Angular zone.
