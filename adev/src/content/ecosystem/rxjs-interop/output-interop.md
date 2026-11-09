<!-- ia-translate: true -->
# Interoperabilidade do RxJS com outputs de component e directive {#rxjs-interop-with-component-and-directive-outputs}

TIP: Este guia assume que você já está familiarizado com [outputs de component e directive](guide/components/outputs).

O pacote `@angular/core/rxjs-interop` oferece duas APIs relacionadas aos outputs de component e directive.

## Criando um output baseado em um Observable do RxJS {#creating-an-output-based-on-an-rxjs-observable}

O `outputFromObservable` permite que você crie um output de component ou directive que emite valores com base em um observable do RxJS:

```ts {highlight:[9]}
import {Directive} from '@angular/core';
import {outputFromObservable} from '@angular/core/rxjs-interop';
import {Observable} from 'rxjs';

@Directive(/* ... */)
class Draggable {
  pointerMoves$: Observable<PointerMovements> = listenToPointerMoves();

  // Whenever `pointerMoves$` emits, the `pointerMove` event fires.
  pointerMove = outputFromObservable(this.pointerMoves$);
}
```

A função `outputFromObservable` tem um significado especial para o compilador Angular. **Você só pode chamar `outputFromObservable` em inicializadores de propriedades de components e directives.**

Quando você faz `subscribe` no output, o Angular encaminha automaticamente a inscrição para o observable subjacente. O Angular para de encaminhar valores quando o component ou a directive é destruído.

HELPFUL: Considere usar `output()` diretamente se você puder emitir valores de forma imperativa.

## Criando um Observable do RxJS a partir de um output de component ou directive {#creating-an-rxjs-observable-from-a-component-or-directive-output}

A função `outputToObservable` permite que você crie um observable do RxJS a partir de um output de component.

```ts {highlight:[11]}
import {outputToObservable} from '@angular/core/rxjs-interop';
import {Component, output} from '@angular/core';

@Component(/*...*/)
class CustomSlider {
    valueChange = output<number>();
}

// Instance reference to `CustomSlider`.
const slider: CustomSlider = createSlider();

outputToObservable(slider.valueChange) // Observable<number>
    .pipe(...)
    .subscribe(...);
```

HELPFUL: Considere usar o método `subscribe` do `OutputRef` diretamente se ele atender às suas necessidades.
