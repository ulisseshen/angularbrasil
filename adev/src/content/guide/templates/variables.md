<!-- ia-translate: true -->
# Variáveis em templates

O Angular tem dois tipos de declarações de variáveis em templates: variáveis locais de template e template reference variables.

## Variáveis locais de template com `@let`

A sintaxe `@let` do Angular permite que você defina uma variável local e a reutilize em um template, semelhante à [sintaxe `let` do JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let).

### Usando `@let`

Use `@let` para declarar uma variável cujo valor é baseado no resultado de uma expressão de template. O Angular mantém automaticamente o valor da variável atualizado com a expressão fornecida, semelhante aos [bindings](./templates/bindings).

```angular-html
@let name = user.name;
@let greeting = 'Hello, ' + name;
@let data = data$ | async;
@let pi = 3.14159;
@let coordinates = {x: 50, y: 100};
@let longExpression = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ' +
                      'sed do eiusmod tempor incididunt ut labore et dolore magna ' +
                      'Ut enim ad minim veniam...';
```

Cada bloco `@let` pode declarar exatamente uma variável. Você não pode declarar múltiplas variáveis no mesmo bloco com uma vírgula.

### Referenciando o valor de `@let`

Uma vez que você tenha declarado uma variável com `@let`, pode reutilizá-la no mesmo template:

```angular-html
@let user = user$ | async;

@if (user) {
  <h1>Hello, {{user.name}}</h1>
  <user-avatar [photo]="user.photo"/>

  <ul>
    @for (snack of user.favoriteSnacks; track snack.id) {
      <li>{{snack.name}}</li>
    }
  </ul>

  <button (click)="update(user)">Update profile</button>
}
```

### Atribuibilidade

Uma diferença chave entre `@let` e o `let` do JavaScript é que `@let` não pode ser reatribuído após a declaração. No entanto, o Angular mantém automaticamente o valor da variável atualizado com a expressão fornecida.

```angular-html
@let value = 1;

<!-- Invalid - This does not work! -->
<button (click)="value = value + 1">Increment the value</button>
```

### Escopo de variável

Declarações `@let` têm escopo na view atual e seus descendentes. O Angular cria uma nova view nos limites de components e onde quer que um template possa conter conteúdo dinâmico, como blocos de control flow, blocos `@defer` ou structural directives.

Como declarações `@let` não sofrem hoisting, elas **não podem** ser acessadas por views pai ou siblings:

```angular-html
@let topLevel = value;

<div>
  @let insideDiv = value;
</div>

{{topLevel}} <!-- Valid -->
{{insideDiv}} <!-- Valid -->

@if (condition) {
  {{topLevel + insideDiv}} <!-- Valid -->

  @let nested = value;

  @if (condition) {
    {{topLevel + insideDiv + nested}} <!-- Valid -->
  }
}

{{nested}} <!-- Error, not hoisted from @if -->
```

### Sintaxe completa

A sintaxe `@let` é formalmente definida como:

- A palavra-chave `@let`.
- Seguida por um ou mais espaços em branco, não incluindo novas linhas.
- Seguida por um nome JavaScript válido e zero ou mais espaços em branco.
- Seguida pelo símbolo = e zero ou mais espaços em branco.
- Seguida por uma expressão Angular que pode ser multi-linha.
- Terminada pelo símbolo `;`.

## Template reference variables

Template reference variables fornecem uma maneira de declarar uma variável que referencia um valor de um elemento em seu template.

Uma template reference variable pode se referir ao seguinte:

- um elemento DOM dentro de um template (incluindo [custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements))
- um component ou directive do Angular
- um [TemplateRef](/api/core/TemplateRef) de um [ng-template](/api/core/ng-template)

Você pode usar template reference variables para ler informações de uma parte do template em outra parte do mesmo template.

### Declarando uma template reference variable

Você pode declarar uma variável em um elemento em um template adicionando um atributo que começa com o caractere hash (`#`) seguido pelo nome da variável.

```angular-html
<!-- Create a template reference variable named "taskInput", referring to the HTMLInputElement. -->
<input #taskInput placeholder="Enter task name">
```

### Atribuindo valores a template reference variables

O Angular atribui um valor às template variables baseado no elemento no qual a variável é declarada.

Se você declarar a variável em um component Angular, a variável se refere à instância do component.

```angular-html
<!-- The `startDate` variable is assigned the instance of `MyDatepicker`. -->
<my-datepicker #startDate />
```

Se você declarar a variável em um elemento `<ng-template>`, a variável se refere a uma instância de TemplateRef que representa o template. Para mais informações, consulte [Como o Angular usa o asterisco, \*, na sintaxe](/guide/directives/structural-directives#structural-directive-shorthand) em [Structural directives](/guide/directives/structural-directives).

```angular-html
<!-- The `myFragment` variable is assigned the `TemplateRef` instance corresponding to this template fragment. -->
<ng-template #myFragment>
  <p>This is a template fragment</p>
</ng-template>
```

Se você declarar a variável em qualquer outro elemento exibido, a variável se refere à instância `HTMLElement`.

```angular-html
<!-- The "taskInput" variable refers to the HTMLInputElement instance. -->
<input #taskInput placeholder="Enter task name">
```

#### Atribuindo uma referência a uma directive Angular

Directives Angular podem ter uma propriedade `exportAs` que define um nome pelo qual a directive pode ser referenciada em um template:

```angular-ts
@Directive({
  selector: '[dropZone]',
  exportAs: 'dropZone',
})
export class DropZone { /* ... */ }
```

Quando você declara uma template variable em um elemento, pode atribuir a essa variável uma instância de directive especificando este nome `exportAs`:

```angular-html
<!-- The `firstZone` variable refers to the `DropZone` directive instance. -->
<section dropZone #firstZone="dropZone"> ... </section>
```

Você não pode se referir a uma directive que não especifica um nome `exportAs`.

### Usando template reference variables com queries

Além de usar template variables para ler valores de outra parte do mesmo template, você também pode usar este estilo de declaração de variável para "marcar" um elemento para [queries de component e directive](/guide/components/queries).

Quando você quer fazer uma query por um elemento específico em um template, pode declarar uma template variable nesse elemento e então fazer uma query pelo elemento baseando-se no nome da variável.

```angular-html
 <input #description value="Original description">
```

```angular-ts
@Component({
  /* ... */,
  template: `<input #description value="Original description">`,
})
export class AppComponent {
  // Query for the input element based on the template variable name.
  @ViewChild('description') input: ElementRef | undefined;
}
```

Consulte [Referenciando filhos com queries](/guide/components/queries) para mais informações sobre queries.
