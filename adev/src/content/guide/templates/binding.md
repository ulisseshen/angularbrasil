<!-- ia-translate: true -->
# Vinculando texto, propriedades e atributos dinâmicos

No Angular, um **binding** cria uma conexão dinâmica entre o template de um component e seus dados. Esta conexão garante que mudanças nos dados do component atualizem automaticamente o template renderizado.

## Renderizar texto dinâmico com text interpolation

Você pode vincular texto dinâmico em templates com chaves duplas, o que informa ao Angular que ele é responsável pela expressão dentro e garantir que ela seja atualizada corretamente. Isso é chamado de **text interpolation**.

```angular-ts
@Component({
  template: `
    <p>Your color preference is {{ theme }}.</p>
  `,
  ...
})
export class AppComponent {
  theme = 'dark';
}
```

Neste exemplo, quando o trecho é renderizado na página, o Angular substituirá `{{ theme }}` por `dark`.

```angular-html
<!-- Rendered Output -->
<p>Your color preference is dark.</p>
```

Bindings que mudam ao longo do tempo devem ler valores de [signals](/guide/signals). O Angular rastreia os signals lidos no template e atualiza a página renderizada quando esses valores de signal mudam.

```angular-ts
@Component({
  template: `
    <!-- Does not necessarily update when `welcomeMessage` changes. -->
    <p>{{ welcomeMessage }}</p>

    <p>Your color preference is {{ theme() }}.</p> <!-- Always updates when the value of the `name` signal changes. -->
  `
  ...
})
export class AppComponent {
  welcomeMessage = "Welcome, enjoy this app that we built for you";
  theme = signal('dark');
}
```

Para mais detalhes, veja o [guia de Signals](/guide/signals).

Continuando o exemplo do tema, se um usuário clicar em um botão que atualiza o signal `theme` para `'light'` após o carregamento da página, a página atualiza de acordo para:

```angular-html
<!-- Rendered Output -->
<p>Your color preference is light.</p>
```

Você pode usar text interpolation em qualquer lugar onde você normalmente escreveria texto em HTML.

Todos os valores de expressão são convertidos para uma string. Objetos e arrays são convertidos usando o método `toString` do valor.

## Vinculando propriedades e atributos dinâmicos

O Angular suporta vincular valores dinâmicos a propriedades de objetos e atributos HTML com colchetes.

Você pode vincular a propriedades em uma instância DOM de um elemento HTML, uma instância de [component](guide/components), ou uma instância de [directive](guide/directives).

### Propriedades de elementos nativos

Cada elemento HTML tem uma representação DOM correspondente. Por exemplo, cada elemento HTML `<button>` corresponde a uma instância de `HTMLButtonElement` no DOM. No Angular, você usa property bindings para definir valores diretamente na representação DOM do elemento.

```angular-html
<!-- Bind the `disabled` property on the button element's DOM object -->
<button [disabled]="isFormValid()">Save</button>
```

Neste exemplo, toda vez que `isFormValid` muda, o Angular define automaticamente a propriedade `disabled` da instância `HTMLButtonElement`.

### Propriedades de components e directives

Quando um elemento é um component Angular, você pode usar property bindings para definir propriedades de input do component usando a mesma sintaxe de colchetes.

```angular-html
<!-- Bind the `value` property on the `MyListbox` component instance. -->
<my-listbox [value]="mySelection()" />
```

Neste exemplo, toda vez que `mySelection` muda, o Angular define automaticamente a propriedade `value` da instância `MyListbox`.

Você também pode vincular a propriedades de directives.

```angular-html
<!-- Bind to the `ngSrc` property of the `NgOptimizedImage` directive  -->
<img [ngSrc]="profilePhotoUrl()" alt="The current user's profile photo">
```

### Atributos

Quando você precisa definir atributos HTML que não têm propriedades DOM correspondentes, como atributos ARIA ou atributos SVG, você pode vincular atributos a elementos em seu template com o prefixo `attr.`.

```angular-html
<!-- Bind the `role` attribute on the `<ul>` element to the component's `listRole` property. -->
<ul [attr.role]="listRole()">
```

Neste exemplo, toda vez que `listRole` muda, o Angular define automaticamente o atributo `role` do elemento `<ul>` chamando `setAttribute`.

Se o valor de um attribute binding for `null`, o Angular remove o atributo chamando `removeAttribute`.

### Text interpolation em propriedades e atributos

Você também pode usar a sintaxe de text interpolation em propriedades e atributos usando a sintaxe de chaves duplas em vez de colchetes ao redor do nome da propriedade ou atributo. Ao usar esta sintaxe, o Angular trata a atribuição como um property binding.

```angular-html
<!-- Binds a value to the `alt` property of the image element's DOM object. -->
<img src="profile-photo.jpg" alt="Profile photo of {{ firstName() }}" >
```

Para vincular a um atributo com a sintaxe de text interpolation, prefixe o nome do atributo com `attr.`

```angular-html
<button attr.aria-label="Save changes to {{ objectType() }}">
```

## Bindings de classes CSS e propriedades de estilo

O Angular suporta recursos adicionais para vincular classes CSS e propriedades de estilo CSS a elementos.

### Classes CSS

Você pode criar um CSS class binding para adicionar ou remover condicionalmente uma classe CSS em um elemento com base em se o valor vinculado é [truthy ou falsy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy).

```angular-html
<!-- When `isExpanded` is truthy, add the `expanded` CSS class. -->
<ul [class.expanded]="isExpanded()">
```

Você também pode vincular diretamente à propriedade `class`. O Angular aceita três tipos de valor:

| Descrição do valor de `class`                                                                                                                                        | Tipo TypeScript       |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| Uma string contendo uma ou mais classes CSS separadas por espaços                                                                                                     | `string`              |
| Um array de strings de classes CSS                                                                                                                                    | `string[]`            |
| Um objeto onde cada nome de propriedade é um nome de classe CSS e cada valor correspondente determina se aquela classe é aplicada ao elemento, com base em truthiness. | `Record<string, any>` |

```angular-ts
@Component({
  template: `
    <ul [class]="listClasses"> ... </ul>
    <section [class]="sectionClasses()"> ... </section>
    <button [class]="buttonClasses()"> ... </button>
  `,
  ...
})
export class UserProfile {
  listClasses = 'full-width outlined';
  sectionClasses = signal(['expandable', 'elevated']);
  buttonClasses = signal({
    highlighted: true,
    embiggened: false,
  });
}
```

O exemplo acima renderiza o seguinte DOM:

```angular-html
<ul class="full-width outlined"> ... </ul>
<section class="expandable elevated"> ... </section>
<button class="highlighted"> ... </button>
```

O Angular ignora quaisquer valores de string que não sejam nomes de classes CSS válidos.

Ao usar classes CSS estáticas, vincular diretamente `class` e vincular classes específicas, o Angular combina inteligentemente todas as classes no resultado renderizado.

```angular-ts
@Component({
  template: `<ul class="list" [class]="listType()" [class.expanded]="isExpanded()"> ...`,
  ...
})
export class Listbox {
  listType = signal('box');
  isExpanded = signal(true);
}
```

No exemplo acima, o Angular renderiza o elemento `ul` com todas as três classes CSS.

```angular-html
<ul class="list box expanded">
```

O Angular não garante nenhuma ordem específica de classes CSS em elementos renderizados.

Ao vincular `class` a um array ou um objeto, o Angular compara o valor anterior com o valor atual usando o operador de igualdade tripla (`===`). Você deve criar uma nova instância de objeto ou array quando modificar esses valores para que o Angular aplique quaisquer atualizações.

Se um elemento tiver vários bindings para a mesma classe CSS, o Angular resolve colisões seguindo sua ordem de precedência de estilo.

NOTE: Class bindings não suportam nomes de classe separados por espaço em uma única chave. Eles também não suportam mutações em objetos, pois a referência do binding permanece a mesma. Se você precisar de um ou outro, use a directive [ngClass](/api/common/NgClass).

### Propriedades de estilo CSS

Você também pode vincular diretamente a propriedades de estilo CSS em um elemento.

```angular-html
<!-- Set the CSS `display` property based on the `isExpanded` property. -->
<section [style.display]="isExpanded() ? 'block' : 'none'">
```

Você pode especificar ainda mais unidades para propriedades CSS que aceitam unidades.

```angular-html
<!-- Set the CSS `height` property to a pixel value based on the `sectionHeightInPixels` property. -->
<section [style.height.px]="sectionHeightInPixels()">
```

Você também pode definir vários valores de estilo em um único binding. O Angular aceita os seguintes tipos de valor:

| Descrição do valor de `style`                                                                                                 | Tipo TypeScript       |
| ----------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| Uma string contendo zero ou mais declarações CSS, como `"display: flex; margin: 8px"`.                                        | `string`              |
| Um objeto onde cada nome de propriedade é um nome de propriedade CSS e cada valor correspondente é o valor daquela propriedade CSS. | `Record<string, any>` |

```angular-ts
@Component({
  template: `
    <ul [style]="listStyles()"> ... </ul>
    <section [style]="sectionStyles()"> ... </section>
  `,
  ...
})
export class UserProfile {
  listStyles = signal('display: flex; padding: 8px');
  sectionStyles = signal({
    border: '1px solid black',
    'font-weight': 'bold',
  });
}
```

O exemplo acima renderiza o seguinte DOM.

```angular-html
<ul style="display: flex; padding: 8px"> ... </ul>
<section style="border: 1px solid black; font-weight: bold"> ... </section>
```

Ao vincular `style` a um objeto, o Angular compara o valor anterior com o valor atual usando o operador de igualdade tripla (`===`). Você deve criar uma nova instância de objeto quando modificar esses valores para que o Angular aplique quaisquer atualizações.

Se um elemento tiver vários bindings para a mesma propriedade de estilo, o Angular resolve colisões seguindo sua ordem de precedência de estilo.
