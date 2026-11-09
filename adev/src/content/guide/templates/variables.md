<!-- ia-translate: true -->
# Variáveis em templates

O Angular tem dois tipos de declarações de variáveis em templates: variáveis locais de template e template reference variables.

HELPFUL: Neste guia, “template” não significa o arquivo HTML inteiro. Refere-se apenas a uma construção ou expressão específica de template dentro do arquivo.

## Variáveis locais de template com `@let` {#local-template-variables-with-let}

A sintaxe `@let` do Angular permite definir uma variável local e reutilizá-la em um template, de forma semelhante à [sintaxe `let` do JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let).

### Usando `@let` {#using-let}

Use `@let` para declarar uma variável cujo valor é baseado no resultado de uma expressão de template. O Angular mantém automaticamente o valor da variável atualizado com a expressão fornecida, de forma semelhante aos [bindings](/guide/templates/binding).

```angular-html
@let name = user.name;
@let greeting = 'Hello, ' + name;
@let data = data$ | async;
@let pi = 3.14159;
@let coordinates = {x: 50, y: 100};
@let longExpression =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit ' +
  'sed do eiusmod tempor incididunt ut labore et dolore magna ' +
  'Ut enim ad minim veniam...';
```

Cada bloco `@let` pode declarar exatamente uma variável. Não é possível declarar múltiplas variáveis no mesmo bloco separando-as por vírgula.

### Referenciando o valor de `@let` {#referencing-the-value-of-let}

Depois de declarar uma variável com `@let`, você pode reutilizá-la no mesmo template:

```angular-html
@let user = user$ | async;

@if (user) {
  <h1>Hello, {{ user.name }}</h1>
  <user-avatar [photo]="user.photo" />

  <ul>
    @for (snack of user.favoriteSnacks; track snack.id) {
      <li>{{ snack.name }}</li>
    }
  </ul>

  <button (click)="update(user)">Update profile</button>
}
```

### Atribuibilidade {#assignability}

Uma diferença importante entre `@let` e o `let` do JavaScript é que `@let` não pode ser reatribuído após a declaração. No entanto, o Angular mantém automaticamente o valor da variável atualizado com a expressão fornecida.

```angular-html
@let value = 1;

<!-- Invalid - This does not work! -->
<button (click)="value = value + 1">Increment the value</button>
```

### Escopo de variável {#variable-scope}

Declarações `@let` têm escopo na view atual e em seus descendentes. O Angular cria uma nova view nos limites de components e sempre que um template possa conter conteúdo dinâmico, como blocos de control flow, blocos `@defer` ou structural directives.

Como declarações `@let` não sofrem hoisting, elas **não podem** ser acessadas por views pai ou views irmãs:

```angular-html
@let topLevel = value;

<div>
  @let insideDiv = value;
</div>

<!-- Valid -->
{{ topLevel }}
<!-- Valid -->
{{ insideDiv }}

@if (condition) {
  <!-- Valid -->
  {{ topLevel + insideDiv }}

  @let nested = value;

  @if (condition) {
    <!-- Valid -->
    {{ topLevel + insideDiv + nested }}
  }
}

<!-- Error, not hoisted from @if -->
{{ nested }}
```

### Sintaxe completa {#full-syntax}

A sintaxe `@let` é formalmente definida como:

- A palavra-chave `@let`.
- Seguida por um ou mais espaços em branco, sem incluir quebras de linha.
- Seguida por um nome JavaScript válido e zero ou mais espaços em branco.
- Seguida pelo símbolo = e zero ou mais espaços em branco.
- Seguida por uma expressão Angular, que pode ocupar várias linhas.
- Terminada pelo símbolo `;`.

## Template reference variables

Template reference variables fornecem uma maneira de declarar uma variável que referencia um valor de um elemento do seu template.

Uma template reference variable pode se referir ao seguinte:

- um elemento DOM dentro de um template (incluindo [custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements))
- um component ou uma directive do Angular
- um [TemplateRef](/api/core/TemplateRef) de um [ng-template](/api/core/ng-template)

Você pode usar template reference variables para ler informações de uma parte do template em outra parte do mesmo template.

### Declarando uma template reference variable {#declaring-a-template-reference-variable}

Você pode declarar uma variável em um elemento de um template adicionando um atributo que começa com o caractere hash (`#`), seguido pelo nome da variável.

```angular-html
<!-- Create a template reference variable named "taskInput", referring to the HTMLInputElement. -->
<input #taskInput placeholder="Enter task name" />
```

### Atribuindo valores a template reference variables {#assigning-values-to-template-reference-variables}

O Angular atribui um valor às template variables com base no elemento em que a variável é declarada.

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

Se você declarar a variável em qualquer outro elemento exibido, a variável se refere à instância de `HTMLElement`.

```angular-html
<!-- The "taskInput" variable refers to the HTMLInputElement instance. -->
<input #taskInput placeholder="Enter task name" />
```

#### Atribuindo uma referência a uma directive Angular {#assigning-a-reference-to-an-angular-directive}

Directives do Angular podem ter uma propriedade `exportAs` que define um nome pelo qual a directive pode ser referenciada em um template:

```angular-ts
@Directive({
  selector: '[dropZone]',
  exportAs: 'dropZone',
})
export class DropZone {
  /* ... */
}
```

Quando você declara uma template variable em um elemento, pode atribuir a essa variável uma instância de directive especificando este nome `exportAs`:

```angular-html
<!-- The `firstZone` variable refers to the `DropZone` directive instance. -->
<section dropZone #firstZone="dropZone">...</section>
```

Você não pode se referir a uma directive que não especifica um nome `exportAs`.

### Usando template reference variables com queries {#using-template-reference-variables-with-queries}

Além de usar template variables para ler valores de outra parte do mesmo template, você também pode usar esse estilo de declaração de variável para "marcar" um elemento para [queries de component e directive](/guide/components/queries).

Quando você quiser fazer uma query por um elemento específico em um template, pode declarar uma template variable nesse elemento e depois consultar o elemento com base no nome da variável.

```angular-html
<input #description value="Original description" />
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

### Escopo de variáveis de template {#template-variable-scope}

Assim como as variáveis em código JavaScript ou TypeScript, as template variables têm escopo no template que as declara.

De forma semelhante, [blocos de control flow](guide/templates/control-flow) como `@if` e `@for`, [structural directives](guide/directives/structural-directives) e declarações `<ng-template>` criam um novo escopo de template aninhado, assim como as instruções de controle de fluxo do JavaScript, como `if` e `for`, criam novos escopos léxicos. Você não pode acessar template variables de dentro de um desses templates aninhados a partir de fora de seus limites.

HELPFUL: Defina uma variável apenas uma vez no template, para que o valor em tempo de execução permaneça previsível.

#### Acessando em um template aninhado {#accessing-in-a-nested-template}

Um template interno pode acessar as template variables definidas pelo template externo.

No exemplo a seguir, alterar o texto no `<input>` altera o valor no `<span>`, porque o Angular atualiza imediatamente as mudanças por meio da template variable `ref1`.

```angular-html
<input #ref1 type="text" [(ngModel)]="firstExample" />

@if (true) {
  <span>Value: {{ ref1.value }}</span>
}
```

Neste caso, o bloco `@if` cria um novo escopo de template, que inclui a variável `ref1` do seu escopo pai.

No entanto, acessar uma template variable de um escopo filho no template pai não funciona:

```angular-html {avoid}
@if (true) {
  <input #ref2 type="text" [(ngModel)]="secondExample" />
}

<span>Value: {{ ref2?.value }}</span>
```

Aqui, `ref2` é declarada no escopo filho criado por `@if` e não é acessível a partir do template pai.
