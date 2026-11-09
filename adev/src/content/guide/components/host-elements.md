<!-- ia-translate: true -->
# Elementos host de components

TIP: Este guia pressupõe que você já leu o [Guia de Fundamentos](essentials). Leia-o primeiro se você é novo no Angular.

O Angular cria uma instância de component para cada elemento HTML que corresponde ao seletor do component. O elemento DOM que corresponde ao seletor de um component é o **elemento host** desse component. O conteúdo do template de um component é renderizado dentro do seu elemento host.

```angular-ts
// Código-fonte do component
@Component({
  selector: 'profile-photo',
  template: `<img src="profile-photo.jpg" alt="Sua foto de perfil" />`,
})
export class ProfilePhoto {}
```

```angular-html
<!-- Usando o component -->
<h3>Sua foto de perfil</h3>
<profile-photo />
<button>Envie uma nova foto de perfil</button>
```

```angular-html
<!-- DOM renderizado -->
<h3>Sua foto de perfil</h3>
<profile-photo>
  <img src="profile-photo.jpg" alt="Sua foto de perfil" />
</profile-photo>
<button>Envie uma nova foto de perfil</button>
```

No exemplo acima, `<profile-photo>` é o elemento host do component `ProfilePhoto`.

## Binding ao elemento host {#binding-to-the-host-element}

Um component pode vincular propriedades, atributos, estilos e eventos ao seu elemento host. Isso se comporta de forma idêntica aos bindings em elementos dentro do template do component, mas é definido na propriedade `host` do decorator `@Component`:

```angular-ts
@Component({
  ...,
  host: {
    'role': 'slider',
    '[attr.aria-valuenow]': 'value',
    '[class.active]': 'isActive()',
    '[style.background]' : `hasError() ? 'red' : 'green'`,
    '[tabIndex]': 'disabled ? -1 : 0',
    '(keydown)': 'updateValue($event)',
  },
})
export class CustomSlider {
  value: number = 0;
  disabled: boolean = false;
  isActive = signal(false);
  hasError = signal(false);
  updateValue(event: KeyboardEvent) { /* ... */ }

  /* ... */
}
```

NOTE: Os nomes de alvos globais que podem ser usados como prefixo de um nome de evento são `document:`, `window:` e `body:`.

NOTE: Nomes de teclas como `'(keydown.enter)'` são comparados com `KeyboardEvent.key`, que depende do layout do teclado e do idioma de entrada do usuário. Para comparar uma tecla física independentemente do layout, use o modificador `code`, por exemplo `'(keydown.code.Enter)'`. Consulte [Usando modificadores de tecla](guide/templates/event-listeners#using-key-modifiers) para mais detalhes.

## Os decorators `@HostBinding` e `@HostListener` {#the-hostbinding-and-hostlistener-decorators}

Alternativamente, você pode vincular ao elemento host aplicando os decorators `@HostBinding` e `@HostListener` aos membros da classe.

`@HostBinding` permite vincular propriedades e atributos do host a propriedades e getters:

```ts
@Component({/* ... */})
export class CustomSlider {
  @HostBinding('attr.aria-valuenow')
  value: number = 0;

  @HostBinding('tabIndex')
  get tabIndex() {
    return this.disabled ? -1 : 0;
  }

  /* ... */
}
```

`@HostListener` permite vincular event listeners ao elemento host. O decorator aceita um nome de evento e um array opcional de argumentos:

```ts
export class CustomSlider {
  @HostListener('keydown', ['$event'])
  updateValue(event: KeyboardEvent) {
    /* ... */
  }
}
```

<docs-callout critical title="Prefira usar a propriedade `host` em vez dos decorators">
  **Sempre prefira usar a propriedade `host` em vez de `@HostBinding` e `@HostListener`.** Esses decorators existem exclusivamente para compatibilidade com versões anteriores.
</docs-callout>

## Colisões de binding {#binding-collisions}

Quando você usa um component em um template, pode adicionar bindings ao elemento dessa instância do component. O component também pode definir bindings de host para as mesmas propriedades ou atributos.

```angular-ts
@Component({
  ...,
  host: {
    'role': 'presentation',
    '[id]': 'id',
  }
})
export class ProfilePhoto { /* ... */ }
```

```angular-html
<profile-photo role="group" [id]="otherId" />
```

Nesses casos, as seguintes regras determinam qual valor prevalece:

- Se ambos os valores forem estáticos, o binding da instância prevalece.
- Se um valor for estático e o outro dinâmico, o valor dinâmico prevalece.
- Se ambos os valores forem dinâmicos, o binding de host do component prevalece.

## Estilização com propriedades personalizadas CSS {#styling-with-css-custom-properties}

Desenvolvedores frequentemente dependem de [Propriedades Personalizadas CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties) para permitir uma configuração flexível dos estilos de seus components. Você pode definir essas propriedades personalizadas em um elemento host com um [binding de estilo](guide/templates/binding#css-style-properties).

```angular-ts
@Component({
  /* ... */
  host: {
    '[style.--my-background]': 'color()',
  },
})
export class MyComponent {
  color = signal('lightgreen');
}
```

Neste exemplo, a propriedade personalizada CSS `--my-background` está vinculada ao signal `color`. O valor da propriedade personalizada é atualizado automaticamente sempre que o signal `color` muda. Isso afeta o component atual e todos os seus filhos que dependem dessa propriedade personalizada.

### Definindo propriedades personalizadas em components filhos {#setting-custom-properties-on-children-components}

Alternativamente, também é possível definir propriedades personalizadas CSS no elemento host de components filhos com um [binding de estilo](guide/templates/binding#css-style-properties).

```angular-ts
@Component({
  selector: 'my-component',
  template: `<my-child [style.--my-background]="color()" />`,
})
export class MyComponent {
  color = signal('lightgreen');
}
```

## Injetando atributos do elemento host {#injecting-host-element-attributes}

Components e directives podem ler atributos estáticos do seu elemento host usando `HostAttributeToken` em conjunto com a função [`inject`](api/core/inject).

```ts
import { Component, HostAttributeToken, inject } from '@angular/core';

@Component({
  selector: 'app-button',
  ...,
})
export class Button {
  variation = inject(new HostAttributeToken('variation'));
}
```

```angular-html
<app-button variation="primary">Clique aqui</app-button>
```

HELPFUL: `HostAttributeToken` lança um erro se o atributo estiver ausente, a menos que a injeção seja marcada como opcional.
