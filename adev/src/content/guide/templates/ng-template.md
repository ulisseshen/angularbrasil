<!-- ia-translate: true -->
# Criar fragmentos de template com ng-template

Inspirado no [elemento nativo `<template>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template), o elemento `<ng-template>` permite que você declare um **fragmento de template** – uma seção de conteúdo que você pode renderizar dinâmica ou programaticamente.

## Criando um fragmento de template

Você pode criar um fragmento de template dentro de qualquer template de component com o elemento `<ng-template>`:

```angular-html
<p>This is a normal element</p>

<ng-template>
  <p>This is a template fragment</p>
</ng-template>
```

Quando o código acima é renderizado, o conteúdo do elemento `<ng-template>` não é renderizado na página. Em vez disso, você pode obter uma referência ao fragmento de template e escrever código para renderizá-lo dinamicamente.

### Contexto de binding para fragmentos

Fragmentos de template podem conter bindings com expressões dinâmicas:

```angular-ts
@Component({
  /* ... */,
  template: `<ng-template>You've selected {{count}} items.</ng-template>`,
})
export class ItemCounter {
  count: number = 0;
}
```

Expressões ou declarações em um fragmento de template são avaliadas em relação ao component no qual o fragmento é declarado, independentemente de onde o fragmento é renderizado.

## Obtendo uma referência a um fragmento de template

Você pode obter uma referência a um fragmento de template de três maneiras:

- Declarando uma [template reference variable](/guide/templates/variables#template-reference-variables) no elemento `<ng-template>`
- Fazendo uma query pelo fragmento com [uma query de component ou directive](/guide/components/queries)
- Injetando o fragmento em uma directive que é aplicada diretamente a um elemento `<ng-template>`.

Em todos os três casos, o fragmento é representado por um objeto [TemplateRef](/api/core/TemplateRef).

### Referenciando um fragmento de template com uma template reference variable

Você pode adicionar uma template reference variable a um elemento `<ng-template>` para referenciar esse fragmento de template em outras partes do mesmo arquivo de template:

```angular-html
<p>This is a normal element</p>

<ng-template #myFragment>
  <p>This is a template fragment</p>
</ng-template>
```

Você pode então referenciar esse fragmento em qualquer outro lugar do template através da variável `myFragment`.

### Referenciando um fragmento de template com queries

Você pode obter uma referência a um fragmento de template usando qualquer [API de query de component ou directive](/guide/components/queries).

Você pode fazer uma query diretamente do objeto `TemplateRef` usando uma query `viewChild`.

```angular-ts
@Component({
  /* ... */,
  template: `
    <p>This is a normal element</p>

    <ng-template>
      <p>This is a template fragment</p>
    </ng-template>
  `,
})
export class ComponentWithFragment {
  templateRef = viewChild<TemplateRef<unknown>>(TemplateRef);
}
```

Você pode então referenciar esse fragmento no código do seu component ou no template do component como qualquer outro membro da classe.

Se um template contiver múltiplos fragmentos, você pode atribuir um nome a cada fragmento adicionando uma template reference variable a cada elemento `<ng-template>` e fazendo queries pelos fragmentos baseando-se nesse nome:

```angular-ts
@Component({
  /* ... */,
  template: `
    <p>This is a normal element</p>

    <ng-template #fragmentOne>
      <p>This is one template fragment</p>
    </ng-template>

    <ng-template #fragmentTwo>
      <p>This is another template fragment</p>
    </ng-template>
  `,
})
export class ComponentWithFragment {
    fragmentOne = viewChild<TemplateRef<unknown>>('fragmentOne');
    fragmentTwo = viewChild<TemplateRef<unknown>>('fragmentTwo');
}
```

Novamente, você pode então referenciar esses fragmentos no código do seu component ou no template do component como qualquer outro membro da classe.

### Injetando um fragmento de template

Uma directive pode injetar um `TemplateRef` se essa directive for aplicada diretamente a um elemento `<ng-template>`:

```angular-ts
@Directive({
  selector: '[myDirective]'
})
export class MyDirective {
  private fragment = inject(TemplateRef);
}
```

```angular-html
<ng-template myDirective>
  <p>This is one template fragment</p>
</ng-template>
```

Você pode então referenciar esse fragmento no código da sua directive como qualquer outro membro da classe.

## Renderizando um fragmento de template

Uma vez que você tenha uma referência ao objeto `TemplateRef` de um fragmento de template, você pode renderizar um fragmento de duas maneiras: no seu template com a directive `NgTemplateOutlet` ou no seu código TypeScript com `ViewContainerRef`.

### Usando `NgTemplateOutlet`

A directive `NgTemplateOutlet` de `@angular/common` aceita um `TemplateRef` e renderiza o fragmento como um **sibling** do elemento com o outlet. Você geralmente deve usar `NgTemplateOutlet` em um [elemento `<ng-container>`](/guide/templates/ng-container).

Primeiro, importe `NgTemplateOutlet`:

```typescript
import { NgTemplateOutlet } from '@angular/common';
```

O exemplo a seguir declara um fragmento de template e renderiza esse fragmento em um elemento `<ng-container>` com `NgTemplateOutlet`:

```angular-html
<p>This is a normal element</p>

<ng-template #myFragment>
  <p>This is a fragment</p>
</ng-template>

<ng-container *ngTemplateOutlet="myFragment"></ng-container>
```

Este exemplo produz o seguinte DOM renderizado:

```angular-html
<p>This is a normal element</p>
<p>This is a fragment</p>
```

### Usando `ViewContainerRef`

Um **view container** é um nó na árvore de components do Angular que pode conter conteúdo. Qualquer component ou directive pode injetar `ViewContainerRef` para obter uma referência a um view container correspondente à localização desse component ou directive no DOM.

Você pode usar o método `createEmbeddedView` em `ViewContainerRef` para renderizar dinamicamente um fragmento de template. Quando você renderiza um fragmento com um `ViewContainerRef`, o Angular o anexa ao DOM como o próximo sibling do component ou directive que injetou o `ViewContainerRef`.

O exemplo a seguir mostra um component que aceita uma referência a um fragmento de template como um input e renderiza esse fragmento no DOM ao clicar em um botão.

```angular-ts
@Component({
  /* ... */,
  selector: 'component-with-fragment',
  template: `
    <h2>Component with a fragment</h2>
    <ng-template #myFragment>
      <p>This is the fragment</p>
    </ng-template>
    <my-outlet [fragment]="myFragment" />
  `,
})
export class ComponentWithFragment { }

@Component({
  /* ... */,
  selector: 'my-outlet',
  template: `<button (click)="showFragment()">Show</button>`,
})
export class MyOutlet {
  private viewContainer = inject(ViewContainerRef);
  fragment = input<TemplateRef<unknown> | undefined>();

  showFragment() {
    if (this.fragment()) {
      this.viewContainer.createEmbeddedView(this.fragment());
    }
  }
}
```

No exemplo acima, clicar no botão "Show" resulta na seguinte saída:

```angular-html
<component-with-fragment>
  <h2>Component with a fragment>
  <my-outlet>
    <button>Show</button>
  </my-outlet>
  <p>This is the fragment</p>
</component-with-fragment>
```

## Passando parâmetros ao renderizar um fragmento de template

Ao declarar um fragmento de template com `<ng-template>`, você pode declarar adicionalmente parâmetros aceitos pelo fragmento. Quando você renderiza um fragmento, pode opcionalmente passar um objeto `context` correspondente a esses parâmetros. Você pode usar dados deste objeto de contexto em expressões de binding e declarações, além de referenciar dados do component no qual o fragmento é declarado.

Cada parâmetro é escrito como um atributo prefixado com `let-` com um valor correspondente a um nome de propriedade no objeto de contexto:

```angular-html
<ng-template let-pizzaTopping="topping">
  <p>You selected: {{pizzaTopping}}</p>
</ng-template>
```

### Usando `NgTemplateOutlet`

Você pode vincular um objeto de contexto ao input `ngTemplateOutletContext`:

```angular-html
<ng-template #myFragment let-pizzaTopping="topping">
  <p>You selected: {{pizzaTopping}}</p>
</ng-template>

<ng-container
  [ngTemplateOutlet]="myFragment"
  [ngTemplateOutletContext]="{topping: 'onion'}"
/>
```

### Usando `ViewContainerRef`

Você pode passar um objeto de contexto como o segundo argumento para `createEmbeddedView`:

```angular-ts
this.viewContainer.createEmbeddedView(this.myFragment, {topping: 'onion'});
```

## Structural directives

Uma **structural directive** é qualquer directive que:

- Injeta `TemplateRef`
- Injeta `ViewContainerRef` e renderiza programaticamente o `TemplateRef` injetado

O Angular suporta uma sintaxe de conveniência especial para structural directives. Se você aplicar a directive a um elemento e prefixar o seletor da directive com um caractere asterisco (`*`), o Angular interpreta o elemento inteiro e todo o seu conteúdo como um fragmento de template:

```angular-html
<section *myDirective>
  <p>This is a fragment</p>
</section>
```

Isso é equivalente a:

```angular-html
<ng-template myDirective>
  <section>
    <p>This is a fragment</p>
  </section>
</ng-template>
```

Desenvolvedores tipicamente usam structural directives para renderizar condicionalmente fragmentos ou renderizar fragmentos múltiplas vezes.

Para mais detalhes, consulte [Structural Directives](/guide/directives/structural-directives).

## Recursos adicionais

Para exemplos de como `ng-template` é usado em outras bibliotecas, confira:

- [Tabs do Angular Material](https://material.angular.dev/components/tabs/overview) - nada é renderizado no DOM até que a aba seja ativada
- [Table do Angular Material](https://material.angular.dev/components/table/overview) - permite que desenvolvedores definam diferentes maneiras de renderizar dados
