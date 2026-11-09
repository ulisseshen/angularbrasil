<!-- ia-translate: true -->
# Adicionando event listeners

O Angular permite definir event listeners em um elemento do seu template especificando o nome do evento entre parênteses, junto com uma instrução que é executada toda vez que o evento ocorre.

## Ouvindo eventos nativos {#listening-to-native-events}

Quando você quer adicionar event listeners a um elemento HTML, envolve o evento com parênteses, `()`, o que permite especificar uma instrução de listener.

```angular-ts
@Component({
  template: `
    <input type="text" (keyup)="updateField()" />
  `,
  ...
})
export class App{
  updateField(): void {
    console.log('Field is updated!');
  }
}
```

Neste exemplo, o Angular chama `updateField` toda vez que o elemento `<input>` emite um evento `keyup`.

Você pode adicionar listeners para quaisquer eventos nativos, como `click`, `keydown`, `mouseover` etc. Para saber mais, confira [todos os eventos disponíveis em elementos no MDN](https://developer.mozilla.org/en-US/docs/Web/API/Element#events).

## Acessando o argumento do evento {#accessing-the-event-argument}

Em todo event listener de template, o Angular fornece uma variável chamada `$event`, que contém uma referência ao objeto do evento.

```angular-ts
@Component({
  template: `
    <input type="text" (keyup)="updateField($event)" />
  `,
  ...
})
export class App {
  updateField(event: KeyboardEvent): void {
    console.log(`The user pressed: ${event.key}`);
  }
}
```

## Usando modificadores de tecla {#using-key-modifiers}

Quando você quer capturar eventos de teclado específicos para uma determinada tecla, pode escrever um código como o seguinte:

```angular-ts
@Component({
  template: `
    <input type="text" (keyup)="updateField($event)" />
  `,
  ...
})
export class App {
  updateField(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      console.log('The user pressed enter in the text field.');
    }
  }
}
```

No entanto, como este é um cenário comum, o Angular permite filtrar os eventos especificando uma tecla específica com o caractere de ponto (`.`). Assim, o código pode ser simplificado para:

```angular-ts
@Component({
  template: `
    <input type="text" (keyup.enter)="updateField($event)" />
  `,
  ...
})
export class App{
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

O Angular oferece suporte aos modificadores `alt`, `control`, `meta` e `shift`.

Você pode especificar a tecla ou o código que deseja vincular aos eventos de teclado. Os campos `key` e `code` são parte nativa do objeto de evento de teclado do navegador. Por padrão, o event binding assume que você quer usar os [valores de Key para eventos de teclado](https://developer.mozilla.org/docs/Web/API/UI_Events/Keyboard_event_key_values).

O Angular também permite especificar [valores de Code para eventos de teclado](https://developer.mozilla.org/docs/Web/API/UI_Events/Keyboard_event_code_values) usando um sufixo `code` integrado.

```angular-html
<!-- Matches alt and left shift -->
<input type="text" (keydown.code.alt.shift.shiftleft)="updateField($event)" />
```

Isso pode ser útil para tratar eventos de teclado de forma consistente em diferentes sistemas operacionais. Por exemplo, ao usar a tecla Alt em dispositivos macOS, a propriedade `key` informa a tecla com base no caractere já modificado pela tecla Alt. Isso significa que uma combinação como Alt + S informa um valor `key` de `'ß'`. Já a propriedade `code` corresponde ao botão físico ou virtual pressionado, e não ao caractere produzido.

## Ouvindo alvos globais {#listening-on-global-targets}

Nomes de alvos globais podem ser usados como prefixo de um evento. Os 3 alvos globais suportados são `window`, `document` e `body`.

```angular-ts
@Component({
  /* ... */
  host: {
    '(window:click)': 'onWindowClick()',
    '(document:click)': 'onDocumentClick()',
    '(body:click)': 'onBodyClick()',
  },
})
export class MyView {}
```

## Prevenindo o comportamento padrão do evento {#preventing-event-default-behavior}

Se o seu event handler deve substituir o comportamento nativo do navegador, você pode usar o [método `preventDefault`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault) do objeto de evento:

```angular-ts
@Component({
  template: `
    <a href="#overlay" (click)="showOverlay($event)">
  `,
  ...
})
export class App{
  showOverlay(event: PointerEvent): void {
    event.preventDefault();
    console.log('Show overlay without updating the URL!');
  }
}
```

Se a instrução do event handler resultar em `false`, o Angular chama `preventDefault()` automaticamente, de maneira semelhante aos [atributos de event handler nativos](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes#event_handler_attributes). _Prefira sempre chamar `preventDefault` explicitamente_, pois essa abordagem deixa a intenção do código óbvia.

## Estendendo o tratamento de eventos {#extend-event-handling}

O sistema de eventos do Angular é extensível por meio de plugins de eventos customizados, registrados com o token de injeção `EVENT_MANAGER_PLUGINS`.

### Implementando um Event Plugin {#implementing-event-plugin}

Para criar um plugin de evento customizado, estenda a classe `EventManagerPlugin` e implemente os métodos necessários.

```ts
import {Injectable} from '@angular/core';
import {EventManagerPlugin} from '@angular/platform-browser';

@Injectable()
export class DebounceEventPlugin extends EventManagerPlugin {
  constructor() {
    super(document);
  }

  // Define quais eventos este plugin suporta
  override supports(eventName: string) {
    return /debounce/.test(eventName);
  }

  // Trata o registro do evento
  override addEventListener(element: HTMLElement, eventName: string, handler: Function) {
    // Faz o parse do evento: por exemplo, "click.debounce.500"
    // event: "click", delay: 500
    const [event, , delay = '300'] = eventName.split('.');

    let timeoutId: ReturnType<typeof setTimeout>;

    const listener = (e: Event) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        handler(e);
      }, Number(delay));
    };

    element.addEventListener(event, listener);

    // Retorna a função de limpeza
    return () => {
      clearTimeout(timeoutId);
      element.removeEventListener(event, listener);
    };
  }
}
```

Registre seu plugin customizado usando o token `EVENT_MANAGER_PLUGINS` nos providers da sua aplicação:

```ts
import {bootstrapApplication, EVENT_MANAGER_PLUGINS} from '@angular/platform-browser';
import {App} from './app';
import {DebounceEventPlugin} from './debounce-event-plugin';

bootstrapApplication(App, {
  providers: [
    {
      provide: EVENT_MANAGER_PLUGINS,
      useClass: DebounceEventPlugin,
      multi: true,
    },
  ],
});
```

Depois de registrado, você pode usar sua sintaxe de evento customizada nos templates, assim como na propriedade `host`:

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
