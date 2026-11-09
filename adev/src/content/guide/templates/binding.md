<!-- ia-translate: true -->

# Vinculando texto, propriedades e atributos dinâmicos {#binding-dynamic-text-properties-and-attributes}

No Angular, um **binding** cria uma conexão dinâmica entre o template de um component e os seus dados. Essa conexão garante que mudanças nos dados do component atualizem automaticamente o template renderizado.

## Renderizar texto dinâmico com text interpolation {#render-dynamic-text-with-text-interpolation}

Você pode vincular texto dinâmico em templates usando chaves duplas, o que informa ao Angular que ele é responsável pela expressão dentro delas e deve garantir que ela seja atualizada corretamente. Isso é chamado de **text interpolation**.

```angular-ts
@Component({
  template: `
    <p>Your color preference is {{ theme }}.</p>
  `,
  ...
})
export class App {
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

    <p>Your color preference is {{ theme() }}.</p> <!-- Always updates when the value of the `theme` signal changes. -->
  `
  ...
})
export class App {
  welcomeMessage = "Welcome, enjoy this app that we built for you";
  theme = signal('dark');
}
```

Para mais detalhes, consulte o [guia de Signals](/guide/signals).

Continuando o exemplo do tema: se um usuário clicar em um botão que atualiza o signal `theme` para `'light'` depois que a página carregar, a página será atualizada de acordo com:

```angular-html
<!-- Rendered Output -->
<p>Your color preference is light.</p>
```

Você pode usar text interpolation em qualquer lugar onde normalmente escreveria texto em HTML.

Valores de expressão são convertidos para string. `null` e `undefined` são renderizados como uma string vazia. Objetos e arrays são convertidos usando o método `toString` do valor.

## Vinculando propriedades e atributos dinâmicos {#binding-dynamic-properties-and-attributes}

O Angular permite vincular valores dinâmicos a propriedades de objetos e a atributos HTML usando colchetes.

Você pode vincular a propriedades da instância DOM de um elemento HTML, da instância de um [component](/guide/components) ou da instância de uma [directive](/guide/directives).

### Propriedades de elementos nativos {#native-element-properties}

Todo elemento HTML tem uma representação DOM correspondente. Por exemplo, cada elemento HTML `<button>` corresponde a uma instância de `HTMLButtonElement` no DOM. No Angular, você usa property bindings para definir valores diretamente na representação DOM do elemento.

```angular-html
<!-- Vincula a propriedade `disabled` do objeto DOM do elemento button -->
<button [disabled]="isFormValid()">Save</button>
```

Neste exemplo, sempre que `isFormValid` muda, o Angular define automaticamente a propriedade `disabled` da instância de `HTMLButtonElement`.

### Propriedades de components e directives {#component-and-directive-properties}

Quando um elemento é um component Angular, você pode usar property bindings para definir as propriedades de input do component com a mesma sintaxe de colchetes.

```angular-html
<!-- Vincula a propriedade `value` da instância do component `MyListbox`. -->
<my-listbox [value]="mySelection()" />
```

Neste exemplo, sempre que `mySelection` muda, o Angular define automaticamente a propriedade `value` da instância de `MyListbox`.

Você também pode vincular a propriedades de directives.

```angular-html
<!-- Vincula à propriedade `ngSrc` da directive `NgOptimizedImage` -->
<img [ngSrc]="profilePhotoUrl()" alt="The current user's profile photo" />
```

### Atributos {#attributes}

Quando você precisa definir atributos HTML que não têm propriedades DOM correspondentes, como atributos SVG, pode vincular atributos a elementos no seu template com o prefixo `attr.`.

<!-- prettier-ignore -->
```angular-html
<!-- Vincula o atributo `role` do elemento `<ul>` à propriedade `listRole` do component. -->
<ul [attr.role]="listRole()">
```

Neste exemplo, sempre que `listRole` muda, o Angular define automaticamente o atributo `role` do elemento `<ul>` chamando `setAttribute`.

Se o valor de um attribute binding for `null` ou `undefined`, o Angular remove o atributo chamando `removeAttribute`.

### Text interpolation em propriedades e atributos {#text-interpolation-in-properties-and-attributes}

Você também pode usar a sintaxe de text interpolation em propriedades e atributos, usando chaves duplas em vez de colchetes ao redor do nome da propriedade ou do atributo. Ao usar essa sintaxe, o Angular trata a atribuição como um property binding.

```angular-html
<!-- Vincula um valor à propriedade `alt` do objeto DOM do elemento de imagem. -->
<img src="profile-photo.jpg" alt="Profile photo of {{ firstName() }}" />
```

## Bindings de classes CSS e propriedades de estilo {#css-class-and-style-property-bindings}

O Angular oferece recursos adicionais para vincular classes CSS e propriedades de estilo CSS a elementos.

### Classes CSS {#css-classes}

Você pode criar um CSS class binding para adicionar ou remover condicionalmente uma classe CSS de um elemento, conforme o valor vinculado seja [truthy ou falsy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy).

<!-- prettier-ignore -->
```angular-html
<!-- Quando `isExpanded` for truthy, adiciona a classe CSS `expanded`. -->
<ul [class.expanded]="isExpanded()">
```

Você também pode vincular diretamente a propriedade `class`. O Angular aceita três tipos de valor:

| Descrição do valor de `class`                                                                                                                                                  | Tipo TypeScript       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| Uma string contendo uma ou mais classes CSS separadas por espaços                                                                                                               | `string`              |
| Um array de strings de classes CSS                                                                                                                                              | `string[]`            |
| Um objeto em que cada nome de propriedade é um nome de classe CSS e cada valor correspondente determina, com base em truthiness, se aquela classe é aplicada ao elemento.    | `Record<string, any>` |

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

<!-- prettier-ignore -->
```angular-html
<ul class="full-width outlined"> ... </ul>
<section class="expandable elevated"> ... </section>
<button class="highlighted"> ... </button>
```

O Angular divide um valor de string em espaços em branco e ignora strings vazias.

Ao usar classes CSS estáticas, vincular `class` diretamente e vincular classes específicas, o Angular combina de forma inteligente todas as classes no resultado renderizado.

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

<!-- prettier-ignore -->
```angular-html
<ul class="list box expanded">
```

O Angular não garante nenhuma ordem específica para as classes CSS nos elementos renderizados.

Ao vincular `class` a um array ou a um objeto, o Angular compara o valor anterior com o valor atual usando o operador de igualdade estrita (`===`). Você deve criar uma nova instância de objeto ou de array ao modificar esses valores para que o Angular aplique as atualizações.

Se um elemento tiver vários bindings para a mesma classe CSS, o Angular resolve os conflitos seguindo a ordem de precedência de estilos.

NOTE: Class bindings não suportam nomes de classe separados por espaço em uma única chave. Eles também não suportam mutações em objetos, pois a referência do binding permanece a mesma. Se você precisar de um ou de outro, use a directive [ngClass](/api/common/NgClass).

### Propriedades de estilo CSS {#css-style-properties}

Você também pode vincular diretamente propriedades de estilo CSS em um elemento.

<!-- prettier-ignore -->
```angular-html
<!-- Define a propriedade CSS `display` com base na propriedade `isExpanded`. -->
<section [style.display]="isExpanded() ? 'block' : 'none'">
```

Você pode especificar unidades para propriedades CSS que aceitam unidades.

<!-- prettier-ignore -->
```angular-html
<!-- Define a propriedade CSS `height` como um valor em pixels, com base na propriedade `sectionHeightInPixels`. -->
<section [style.height.px]="sectionHeightInPixels()">
```

Você também pode definir vários valores de estilo em um único binding. O Angular aceita os seguintes tipos de valor:

| Descrição do valor de `style`                                                                                                                                  | Tipo TypeScript       |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| Uma string contendo zero ou mais declarações CSS, como `"display: flex; margin: 8px"`.                                                                         | `string`              |
| Um objeto em que cada nome de propriedade é um nome de propriedade CSS e cada valor correspondente é o valor daquela propriedade CSS.                          | `Record<string, any>` |

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

<!-- prettier-ignore -->
```angular-html
<ul style="display: flex; padding: 8px"> ... </ul>
<section style="border: 1px solid black; font-weight: bold"> ... </section>
```

Ao vincular `style` a um objeto, o Angular compara o valor anterior com o valor atual usando o operador de igualdade estrita (`===`). Você deve criar uma nova instância de objeto ao modificar esses valores para que o Angular aplique as atualizações.

Se um elemento tiver vários bindings para a mesma propriedade de estilo, o Angular resolve os conflitos seguindo a ordem de precedência de estilos.

## Atributos ARIA {#aria-attributes}

O Angular oferece suporte à vinculação de valores de string a atributos ARIA.

```angular-html
<button type="button" [aria-label]="actionLabel()">
  {{ actionLabel() }}
</button>
```

O Angular grava o valor de string no atributo `aria-label` do elemento e o remove quando o valor vinculado é `null` ou `undefined`.

Alguns recursos ARIA expõem propriedades do DOM ou inputs de directives que aceitam valores estruturados (como referências a elementos). Nesses casos, use property bindings padrão. Consulte o [guia de acessibilidade](/best-practices/a11y#aria-attributes-and-properties) para ver exemplos e orientações adicionais.
