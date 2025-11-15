<!-- ia-translate: true -->
# Adicionando event listeners

O Angular suporta definir event listeners em um elemento no seu template especificando o nome do evento dentro de parênteses junto com uma instrução que executa toda vez que o evento ocorre.

## Ouvindo eventos nativos

Quando você quer adicionar event listeners a um elemento HTML, você envolve o evento com parênteses, `()`, o que permite que você especifique uma instrução de listener.

```angular-ts
@Component({
  template: `
    <input type="text" (keyup)="updateField()" />
  `,
  ...
})
export class AppComponent{
  updateField(): void {
    console.log('Field is updated!');
  }
}
```

Neste exemplo, o Angular chama `updateField` toda vez que o elemento `<input>` emite um evento `keyup`.

Você pode adicionar listeners para quaisquer eventos nativos, como: `click`, `keydown`, `mouseover`, etc. Para saber mais, confira [todos os eventos disponíveis em elementos no MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element#events).

## Acessando o argumento de evento

Em todo template event listener, o Angular fornece uma variável chamada `$event` que contém uma referência ao objeto de evento.

```angular-ts
@Component({
  template: `
    <input type="text" (keyup)="updateField($event)" />
  `,
  ...
})
export class AppComponent {
  updateField(event: KeyboardEvent): void {
    console.log(`The user pressed: ${event.key}`);
  }
}
```

## Usando modificadores de tecla

Quando você quer capturar eventos de teclado específicos para uma tecla específica, você pode escrever algum código como o seguinte:

```angular-ts
@Component({
  template: `
    <input type="text" (keyup)="updateField($event)" />
  `,
  ...
})
export class AppComponent {
  updateField(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      console.log('The user pressed enter in the text field.');
    }
  }
}
```

No entanto, como este é um cenário comum, o Angular permite que você filtre os eventos especificando uma tecla específica usando o caractere de ponto (`.`). Ao fazer isso, o código pode ser simplificado para:

```angular-ts
@Component({
  template: `
    <input type="text" (keyup.enter)="updateField($event)" />
  `,
  ...
})
export class AppComponent{
  updateField(event: KeyboardEvent): void {
    console.log('The user pressed enter in the text field.');
  }
}
```

Você também pode adicionar modificadores de tecla adicionais:

```angular-html
<!-- Matches shift and enter -->
<input type="text" (keyup.shift.enter)="updateField($event)" />
```

O Angular suporta os modificadores `alt`, `control`, `meta` e `shift`.

Você pode especificar a tecla ou código que você gostaria de vincular a eventos de teclado. Os campos key e code são uma parte nativa do objeto de evento de teclado do navegador. Por padrão, o event binding assume que você quer usar os [valores de Key para eventos de teclado](https://developer.mozilla.org/docs/Web/API/UI_Events/Keyboard_event_key_values).

O Angular também permite que você especifique [valores de Code para eventos de teclado](https://developer.mozilla.org/docs/Web/API/UI_Events/Keyboard_event_code_values) fornecendo um sufixo `code` integrado.

```angular-html
<!-- Matches alt and left shift -->
<input type="text" (keydown.code.alt.shiftleft)="updateField($event)" />
```

Isso pode ser útil para lidar com eventos de teclado de forma consistente em diferentes sistemas operacionais. Por exemplo, ao usar a tecla Alt em dispositivos MacOS, a propriedade `key` reporta a tecla baseada no caractere já modificado pela tecla Alt. Isso significa que uma combinação como Alt + S reporta um valor `key` de `'ß'`. A propriedade `code`, no entanto, corresponde ao botão físico ou virtual pressionado ao invés do caractere produzido.

## Prevenindo comportamento padrão de evento

Se seu event handler deve substituir o comportamento nativo do navegador, você pode usar o [método `preventDefault`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault) do objeto de evento:

```angular-ts
@Component({
  template: `
    <a href="#overlay" (click)="showOverlay($event)">
  `,
  ...
})
export class AppComponent{
  showOverlay(event: PointerEvent): void {
    event.preventDefault();
    console.log('Show overlay without updating the URL!');
  }
}
```

Se a instrução do event handler avaliar para `false`, o Angular automaticamente chama `preventDefault()`, similar aos [atributos de event handler nativos](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes#event_handler_attributes). _Sempre prefira chamar explicitamente `preventDefault`_, pois esta abordagem torna a intenção do código óbvia.

## Estender manipulação de eventos

O sistema de eventos do Angular é extensível via plugins de eventos customizados registrados com o token de injeção `EVENT_MANAGER_PLUGINS`.

### Implementando Event Plugin

Para criar um plugin de evento customizado, estenda a classe `EventManagerPlugin` e implemente os métodos necessários.

```ts
import { Injectable } from '@angular/core';
import { EventManagerPlugin } from '@angular/platform-browser';

@Injectable()
export class DebounceEventPlugin extends EventManagerPlugin {
  constructor() {
    super(document);
  }

  // Define which events this plugin supports
  override supports(eventName: string) {
    return /debounce/.test(eventName);
  }

  // Handle the event registration
  override addEventListener(
    element: HTMLElement,
    eventName: string,
    handler: Function
  ) {
    // Parse the event: e.g., "click.debounce.500"
    // event: "click", delay: 500
    const [event, method , delay = 300 ] = eventName.split('.');

    let timeoutId: number;

    const listener = (event: Event) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
          handler(event);
      }, delay);
    };

    element.addEventListener(event, listener);

    // Return cleanup function
    return () => {
      clearTimeout(timeoutId);
      element.removeEventListener(event, listener);
    };
  }
}
```

Registre seu plugin customizado usando o token `EVENT_MANAGER_PLUGINS` nos providers da sua aplicação:

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { DebounceEventPlugin } from './debounce-event-plugin';

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: EVENT_MANAGER_PLUGINS,
      useClass: DebounceEventPlugin,
      multi: true
    }
  ]
});
```

Uma vez registrado, você pode usar sua sintaxe de evento customizada em templates, bem como com a propriedade `host`:

```angular-ts
@Component({
  template: `
    <input
      type="text"
      (input.debounce.500)="onSearch($event.target.value)"
      placeholder="Search..."
    />
  `,
  ...
})
export class Search {
 onSearch(query: string): void {
    console.log('Searching for:', query);
  }
}
```

```ts
@Component({
  ...,
  host: {
    '(click.debounce.500)': 'handleDebouncedClick()',
  },
})
export class AwesomeCard {
  handleDebouncedClick(): void {
   console.log('Debounced click!');
  }
}
```
