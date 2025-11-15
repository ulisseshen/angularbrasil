<!-- ia-translate: true -->
# Herança

TIP: Este guia pressupõe que você já leu o [Guia de Fundamentos](essentials). Leia-o primeiro se você é novo no Angular.

Components Angular são classes TypeScript e participam da semântica de herança padrão do JavaScript.

Um component pode estender qualquer classe base:

```ts
export class ListboxBase {
  value: string;
}

@Component({ ... })
export class CustomListbox extends ListboxBase {
  // CustomListbox inherits the `value` property.
}
```

## Estendendo outros components e directives

Quando um component estende outro component ou uma directive, ele herda alguns dos metadados definidos no decorator da classe base e nos membros decorados da classe base. Isso inclui bindings de host, inputs, outputs e métodos de ciclo de vida.

```angular-ts
@Component({
  selector: 'base-listbox',
  template: `
    ...
  `,
  host: {
    '(keydown)': 'handleKey($event)',
  },
})
export class ListboxBase {
  value = input.required<string>();
  handleKey(event: KeyboardEvent) {
    /* ... */
  }
}

@Component({
  selector: 'custom-listbox',
  template: `
    ...
  `,
  host: {
    '(click)': 'focusActiveOption()',
  },
})
export class CustomListbox extends ListboxBase {
  disabled = input(false);
  focusActiveOption() {
    /* ... */
  }
}
```

No exemplo acima, `CustomListbox` herda todas as informações associadas a `ListboxBase`, sobrescrevendo o seletor e o template com seus próprios valores. `CustomListbox` tem dois inputs (`value` e `disabled`) e dois event listeners (`keydown` e `click`).

Classes filhas acabam com a _união_ de todos os inputs, outputs e bindings de host de seus ancestrais e os seus próprios.

### Encaminhando dependências injetadas

Se uma classe base injeta dependências como parâmetros do constructor, a classe filha deve explicitamente passar essas dependências para `super`.

```ts
@Component({ ... })
export class ListboxBase {
  constructor(private element: ElementRef) { }
}

@Component({ ... })
export class CustomListbox extends ListboxBase {
  constructor(element: ElementRef) {
    super(element);
  }
}
```

### Sobrescrevendo métodos de ciclo de vida

Se uma classe base define um método de ciclo de vida, como `ngOnInit`, uma classe filha que também implementa `ngOnInit` _sobrescreve_ a implementação da classe base. Se você quiser preservar o método de ciclo de vida da classe base, chame explicitamente o método com `super`:

```ts
@Component({ ... })
export class ListboxBase {
  protected isInitialized = false;
  ngOnInit() {
    this.isInitialized = true;
  }
}

@Component({ ... })
export class CustomListbox extends ListboxBase {
  override ngOnInit() {
    super.ngOnInit();
    /* ... */
  }
}
```
