<!-- ia-translate: true -->
# Interoperabilidade entre RxJS e outputs de component e directive

DICA: Este guia assume que você está familiarizado com [outputs de component e directive](guide/components/outputs).

O pacote `@angular/rxjs-interop` oferece duas APIs relacionadas a outputs de component e directive.

## Criando um output baseado em um Observable RxJs

O `outputFromObservable` permite que você crie um output de component ou directive que emite baseado em um observable RxJS:

```ts {highlight:[9]}
import {Directive} from '@angular/core';
import {outputFromObservable} from '@angular/core/rxjs-interop';

@Directive({/*...*/})
class Draggable {
    pointerMoves$: Observable<PointerMovements> = listenToPointerMoves();

    // Whenever `pointerMoves$` emits, the `pointerMove` event fires.
    pointerMove = outputFromObservable(this.pointerMoves$);
}
```

A função `outputFromObservable` tem um significado especial para o compilador Angular. **Você só pode chamar `outputFromObservable` em inicializadores de propriedade de component e directive.**

Quando você faz `subscribe` no output, o Angular automaticamente encaminha a inscrição para o observable subjacente. O Angular para de encaminhar valores quando o component ou directive é destruído.

ÚTIL: Considere usar `output()` diretamente se você puder emitir valores de forma imperativa.

## Criando um Observable RxJS a partir de um output de component ou directive

A função `outputToObservable` permite que você crie um observable RxJS a partir de um output de component.

```ts {highlight:[11]}
import {outputToObservable} from '@angular/core/rxjs-interop';

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

ÚTIL: Considere usar o method `subscribe` em `OutputRef` diretamente se ele atender suas necessidades.
