<!-- ia-translate: true -->
# Elementos host de components

TIP: Este guia pressupõe que você já leu o [Guia de Fundamentos](essentials). Leia-o primeiro se você é novo no Angular.

O Angular cria uma instância de um component para cada elemento HTML que corresponde ao seletor do component. O elemento DOM que corresponde ao seletor de um component é o **elemento host** daquele component. O conteúdo do template de um component é renderizado dentro de seu elemento host.

```angular-ts
// Component source
@Component({
  selector: 'profile-photo',
  template: `
    <img src="profile-photo.jpg" alt="Your profile photo" />
  `,
})
export class ProfilePhoto {}
```

```angular-html
<!-- Using the component -->
<h3>Your profile photo</h3>
<profile-photo />
<button>Upload a new profile photo</button>
```

```angular-html
<!-- Rendered DOM -->
<h3>Your profile photo</h3>
<profile-photo>
  <img src="profile-photo.jpg" alt="Your profile photo" />
</profile-photo>
<button>Upload a new profile photo</button>
```

No exemplo acima, `<profile-photo>` é o elemento host do component `ProfilePhoto`.

## Binding ao elemento host

Um component pode vincular propriedades, atributos, estilos e eventos ao seu elemento host. Isso se comporta de forma idêntica aos bindings em elementos dentro do template do component, mas em vez disso é definido com a propriedade `host` no decorator `@Component`:

```angular-ts
@Component({
  ...,
  host: {
    'role': 'slider',
    '[attr.aria-valuenow]': 'value',
    '[class.active]': 'isActive()',
    '[style.background] : `hasError() ? 'red' : 'green'`,
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

## Os decorators `@HostBinding` e `@HostListener`

Você pode alternativamente vincular ao elemento host aplicando os decorators `@HostBinding` e `@HostListener` aos membros da classe.

`@HostBinding` permite vincular propriedades e atributos do host a propriedades e getters:

```ts
@Component({
  /* ... */
})
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

## Colisões de binding

Quando você usa um component em um template, você pode adicionar bindings ao elemento daquela instância do component. O component também pode definir bindings de host para as mesmas propriedades ou atributos.

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

Em casos como esse, as seguintes regras determinam qual valor vence:

- Se ambos os valores forem estáticos, o binding da instância vence.
- Se um valor for estático e o outro dinâmico, o valor dinâmico vence.
- Se ambos os valores forem dinâmicos, o binding de host do component vence.

## Estilização com propriedades personalizadas CSS

Desenvolvedores frequentemente dependem de [Propriedades Personalizadas CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties) para permitir uma configuração flexível dos estilos de seus components. Você pode definir tais propriedades personalizadas em um elemento host com um [binding de estilo](guide/templates/binding#css-style-properties).

```angular-ts
@Component({
  /* ... */
  host: {
    '[style.--my-background]': 'color()',
  }
})
export class MyComponent {
  color = signal('lightgreen');
}
```

Neste exemplo, a propriedade personalizada CSS `--my-background` está vinculada ao signal `color`. O valor da propriedade personalizada será atualizado automaticamente sempre que o signal `color` mudar. Isso afetará o component atual e todos os seus filhos que dependem desta propriedade personalizada.

### Definindo propriedades personalizadas em components filhos

Alternativamente, também é possível definir propriedades personalizadas css no elemento host de components filhos com um [binding de estilo](guide/templates/binding#css-style-properties).

```angular-ts
@Component({
  selector: 'my-component',
  template: `<my-child [style.--my-background]="color()">`,
})
export class MyComponent {
  color = signal('lightgreen');
}
```
