<!-- ia-translate: true -->
# Projeção de conteúdo com ng-content

TIP: Este guia pressupõe que você já leu o [Guia de Fundamentos](essentials). Leia-o primeiro se você é novo no Angular.

Frequentemente você precisa criar components que atuam como containers para diferentes tipos de conteúdo. Por exemplo, você pode querer criar um component de card personalizado:

```angular-ts
@Component({
  selector: 'custom-card',
  template: '<div class="card-shadow"> <!-- card content goes here --> </div>',
})
export class CustomCard {/* ... */}
```

**Você pode usar o elemento `<ng-content>` como um espaço reservado para marcar onde o conteúdo deve ir**:

```angular-ts
@Component({
  selector: 'custom-card',
  template: '<div class="card-shadow"> <ng-content/> </div>',
})
export class CustomCard {/* ... */}
```

TIP: `<ng-content>` funciona de forma semelhante ao [elemento nativo `<slot>`](https://developer.mozilla.org/docs/Web/HTML/Element/slot), mas com algumas funcionalidades específicas do Angular.

Quando você usa um component com `<ng-content>`, quaisquer filhos do elemento host do component são renderizados, ou **projetados**, no local daquele `<ng-content>`:

```angular-ts
// Component source
@Component({
  selector: 'custom-card',
  template: `
    <div class="card-shadow">
      <ng-content />
    </div>
  `,
})
export class CustomCard {/* ... */}
```

```angular-html
<!-- Using the component -->
<custom-card>
  <p>This is the projected content</p>
</custom-card>
```

```angular-html
<!-- The rendered DOM -->
<custom-card>
  <div class="card-shadow">
    <p>This is the projected content</p>
  </div>
</custom-card>
```

O Angular se refere a quaisquer filhos de um component passados desta forma como o **conteúdo** daquele component. Isso é distinto da **view** do component, que se refere aos elementos definidos no template do component.

**O elemento `<ng-content>` não é um component nem um elemento DOM**. Em vez disso, é um espaço reservado especial que diz ao Angular onde renderizar o conteúdo. O compilador do Angular processa todos os elementos `<ng-content>` em tempo de build. Você não pode inserir, remover ou modificar `<ng-content>` em tempo de execução. Você não pode adicionar directives, estilos ou atributos arbitrários ao `<ng-content>`.

IMPORTANT: Você não deve incluir condicionalmente `<ng-content>` com `@if`, `@for` ou `@switch`. O Angular sempre instancia e cria nós DOM para conteúdo renderizado em um espaço reservado `<ng-content>`, mesmo se aquele espaço reservado `<ng-content>` estiver oculto. Para renderização condicional de conteúdo de component, consulte [Fragmentos de template](api/core/ng-template).

## Múltiplos espaços reservados de conteúdo

O Angular suporta projetar múltiplos elementos diferentes em diferentes espaços reservados `<ng-content>` com base em seletor CSS. Expandindo o exemplo do card acima, você poderia criar dois espaços reservados para um título de card e um corpo de card usando o atributo `select`:

```angular-ts
@Component({
  selector: 'card-title',
  template: `<ng-content>card-title</ng-content>`,
})
export class CardTitle {}

@Component({
  selector: 'card-body',
  template: `<ng-content>card-body</ng-content>`,
})
export class CardBody {}
```

```angular-ts
<!-- Component template -->
Component({
  selector: 'custom-card',
  template: `
  <div class="card-shadow">
    <ng-content select="card-title"></ng-content>
    <div class="card-divider"></div>
    <ng-content select="card-body"></ng-content>
  </div>
  `,
})
export class CustomCard {}
```

```angular-ts
<!-- Using the component -->
@Component({
  selector: 'app-root',
  imports: [CustomCard, CardTitle, CardBody],
  template: `
    <custom-card>
      <card-title>Hello</card-title>
      <card-body>Welcome to the example</card-body>
    </custom-card>
`,
})
export class App {}
```

```angular-html
<!-- Rendered DOM -->
<custom-card>
  <div class="card-shadow">
    <card-title>Hello</card-title>
    <div class="card-divider"></div>
    <card-body>Welcome to the example</card-body>
  </div>
</custom-card>
```

O espaço reservado `<ng-content>` suporta os mesmos seletores CSS que os [seletores de components](guide/components/selectors).

Se você incluir um ou mais espaços reservados `<ng-content>` com um atributo `select` e um espaço reservado `<ng-content>` sem um atributo `select`, o último captura todos os elementos que não corresponderam a um atributo `select`:

```angular-html
<!-- Component template -->
<div class="card-shadow">
  <ng-content select="card-title"></ng-content>
  <div class="card-divider"></div>
  <!-- capture anything except "card-title" -->
  <ng-content></ng-content>
</div>
```

```angular-html
<!-- Using the component -->
<custom-card>
  <card-title>Hello</card-title>
  <img src="..." />
  <p>Welcome to the example</p>
</custom-card>
```

```angular-html
<!-- Rendered DOM -->
<custom-card>
  <div class="card-shadow">
    <card-title>Hello</card-title>
    <div class="card-divider"></div>
    <img src="..." />
    <p>Welcome to the example</p>
  </div>
</custom-card>
```

Se um component não incluir um espaço reservado `<ng-content>` sem um atributo `select`, quaisquer elementos que não correspondam a um dos espaços reservados do component não serão renderizados no DOM.

## Conteúdo de fallback

O Angular pode mostrar _conteúdo de fallback_ para um espaço reservado `<ng-content>` de um component se aquele component não tiver nenhum conteúdo filho correspondente. Você pode especificar o conteúdo de fallback adicionando conteúdo filho ao próprio elemento `<ng-content>`.

```angular-html
<!-- Component template -->
<div class="card-shadow">
  <ng-content select="card-title">Default Title</ng-content>
  <div class="card-divider"></div>
  <ng-content select="card-body">Default Body</ng-content>
</div>
```

```angular-html
<!-- Using the component -->
<custom-card>
  <card-title>Hello</card-title>
  <!-- No card-body provided -->
</custom-card>
```

```angular-html
<!-- Rendered DOM -->
<custom-card>
  <div class="card-shadow">
    <card-title>Hello</card-title>
    <div class="card-divider"></div>
    Default Body
  </div>
</custom-card>
```

## Criando alias de conteúdo para projeção

O Angular suporta um atributo especial, `ngProjectAs`, que permite especificar um seletor CSS em qualquer elemento. Sempre que um elemento com `ngProjectAs` é verificado contra um espaço reservado `<ng-content>`, o Angular compara contra o valor de `ngProjectAs` em vez da identidade do elemento:

```angular-html
<!-- Component template -->
<div class="card-shadow">
  <ng-content select="card-title"></ng-content>
  <div class="card-divider"></div>
  <ng-content></ng-content>
</div>
```

```angular-html
<!-- Using the component -->
<custom-card>
  <h3 ngProjectAs="card-title">Hello</h3>

  <p>Welcome to the example</p>
</custom-card>
```

```angular-html
<!-- Rendered DOM -->
<custom-card>
  <div class="card-shadow">
    <h3>Hello</h3>
    <div class="card-divider"></div>
    <p>Welcome to the example</p>
  </div>
</custom-card>
```

`ngProjectAs` suporta apenas valores estáticos e não pode ser vinculado a expressões dinâmicas.
