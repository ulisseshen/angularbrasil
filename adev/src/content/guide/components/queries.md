<!-- ia-translate: true -->
# Referenciando filhos de components com queries

TIP: Este guia assume que você já leu o [Guia de Fundamentos](essentials). Leia-o primeiro se você é novo no Angular.

Um component pode definir **queries** que encontram elementos filhos e leem valores dos seus injectors.

Desenvolvedores usam queries com mais frequência para obter referências a components filhos, directives, elementos do DOM e outros.

Todas as funções de query retornam signals que refletem os resultados mais atualizados. Você pode ler o resultado chamando a função do signal, inclusive em [contextos reativos](guide/signals#reactive-contexts), como `computed` e `effect`.

Existem duas categorias de query: **view queries** e **content queries.**

## Queries de view {#view-queries}

View queries obtêm resultados dos elementos na _view_ do component, ou seja, os elementos definidos no próprio template do component. Você pode consultar um único resultado com a função `viewChild`.

```angular-ts {highlight: [14, 15]}
@Component({
  selector: 'custom-card-header',
  /*...*/
})
export class CustomCardHeader {
  text: string;
}

@Component({
  selector: 'custom-card',
  template: '<custom-card-header>Visit sunny California!</custom-card-header>',
})
export class CustomCard {
  header = viewChild(CustomCardHeader);
  headerText = computed(() => this.header()?.text);
}
```

Neste exemplo, o component `CustomCard` consulta um filho `CustomCardHeader` e usa o resultado em um `computed`.

Se a query não encontrar um resultado, seu valor é `undefined`. Isso pode acontecer se o elemento alvo estiver oculto por `@if`. O Angular mantém o resultado de `viewChild` atualizado conforme o estado da sua aplicação muda.

Você também pode consultar múltiplos resultados com a função `viewChildren`.

```angular-ts {highlight: [17]}
@Component({
  selector: 'custom-card-action',
  /*...*/
})
export class CustomCardAction {
  text: string;
}

@Component({
  selector: 'custom-card',
  template: `
    <custom-card-action>Save</custom-card-action>
    <custom-card-action>Cancel</custom-card-action>
  `,
})
export class CustomCard {
  actions = viewChildren(CustomCardAction);
  actionsTexts = computed(() => this.actions().map((action) => action.text));
}
```

`viewChildren` cria um signal com um `Array` contendo os resultados da query.

**Queries nunca atravessam os limites de um component.** View queries só podem obter resultados do template do próprio component.

## Queries de conteúdo {#content-queries}

Content queries obtêm resultados dos elementos no _content_ do component, ou seja, os elementos aninhados dentro do component no template onde ele é usado. Você pode consultar um único resultado com a função `contentChild`.

```angular-ts {highlight: [14, 15]}
@Component({
  selector: 'custom-toggle',
  /*...*/
})
export class CustomToggle {
  text: string;
}

@Component({
  selector: 'custom-expando',
  /* ... */
})
export class CustomExpando {
  toggle = contentChild(CustomToggle);
  toggleText = computed(() => this.toggle()?.text);
}

@Component({
  /* ... */
  // CustomToggle é usado dentro de CustomExpando como conteúdo.
  template: `
    <custom-expando>
      <custom-toggle>Show</custom-toggle>
    </custom-expando>
  `,
})
export class UserProfile {}
```

Se a query não encontrar um resultado, seu valor é `undefined`. Isso pode acontecer se o elemento alvo estiver ausente ou oculto por `@if`. O Angular mantém o resultado de `contentChild` atualizado conforme o estado da sua aplicação muda.

Por padrão, queries `contentChild` percorrem os descendentes, enquanto queries `contentChildren` encontram apenas os filhos _diretos_. Veja [Descendentes de conteúdo](#content-descendants).

Você também pode consultar múltiplos resultados com a função `contentChildren`.

```angular-ts {highlight: [14, 15]}
@Component({
  selector: 'custom-menu-item',
  /*...*/
})
export class CustomMenuItem {
  text: string;
}

@Component({
  selector: 'custom-menu',
  /*...*/
})
export class CustomMenu {
  items = contentChildren(CustomMenuItem);
  itemTexts = computed(() => this.items().map((item) => item.text));
}

@Component({
  selector: 'user-profile',
  template: `
    <custom-menu>
      <custom-menu-item>Cheese</custom-menu-item>
      <custom-menu-item>Tomato</custom-menu-item>
    </custom-menu>
  `,
})
export class UserProfile {}
```

`contentChildren` cria um signal com um `Array` contendo os resultados da query.

**Queries nunca atravessam os limites de um component.** Content queries só podem obter resultados do mesmo template do próprio component.

## Queries obrigatórias {#required-queries}

Se uma child query (`viewChild` ou `contentChild`) não encontrar um resultado, seu valor é `undefined`. Isso pode acontecer se o elemento alvo estiver oculto por uma estrutura de controle de fluxo, como `@if` ou `@for`. Por causa disso, as child queries retornam um signal cujo tipo de valor inclui `undefined`.

Em alguns casos, especialmente com `viewChild`, você sabe com certeza que um filho específico está sempre disponível. Em outros casos, você pode querer exigir que um filho específico esteja presente. Para esses casos, você pode usar uma _required query_.

```ts
@Component(/* ... */)
export class CustomCard {
  header = viewChild.required(CustomCardHeader);
  body = contentChild.required(CustomCardBody);
}
```

Se uma required query não encontrar um resultado correspondente, o Angular reporta um erro. Como isso garante que um resultado está disponível, required queries não incluem automaticamente `undefined` no tipo de valor do signal.

## Locators de query {#query-locators}

O primeiro parâmetro de cada decorator de query é o seu **locator**.

Na maioria das vezes, você deve usar um component ou uma directive como locator.

Alternativamente, você pode especificar um locator em forma de string, correspondente a uma [variável de referência de template](guide/templates/variables#template-reference-variables).

```angular-ts
@Component({
  /*...*/
  template: `
    <button #save>Save</button>
    <button #cancel>Cancel</button>
  `,
})
export class ActionBar {
  saveButton = viewChild<ElementRef<HTMLButtonElement>>('save');
}
```

Se mais de um elemento definir a mesma variável de referência de template, a query obtém o primeiro elemento correspondente.

O Angular não suporta seletores CSS como locators de query.

### Queries e a árvore de injetores {#queries-and-the-injector-tree}

TIP: Veja [Injeção de dependência](guide/di) para informações sobre providers e a árvore de injeção do Angular.

Para casos mais avançados, você pode usar qualquer `ProviderToken` como locator. Isso permite localizar elementos com base nos providers de components e directives.

```angular-ts
const SUB_ITEM = new InjectionToken<string>('sub-item');

@Component({
  /*...*/
  providers: [{provide: SUB_ITEM, useValue: 'special-item'}],
})
export class SpecialItem {}

@Component(/* ... */)
export class CustomList {
  subItemType = contentChild(SUB_ITEM);
}
```

O exemplo acima usa um `InjectionToken` como locator, mas você pode usar qualquer `ProviderToken` para localizar elementos específicos.

## Opções de query {#query-options}

Todas as funções de query aceitam um objeto de opções como segundo parâmetro. Essas opções controlam como a query encontra os resultados.

### Lendo valores específicos do injector de um elemento {#reading-specific-values-from-an-elements-injector}

Por padrão, o locator da query indica tanto o elemento que você procura quanto o valor obtido. Alternativamente, você pode especificar a opção `read` para obter um valor diferente do elemento correspondido pelo locator.

```ts
@Component(/* ... */)
export class CustomExpando {
  toggle = contentChild(ExpandoContent, {read: TemplateRef});
}
```

O exemplo acima localiza um elemento com a directive `ExpandoContent` e obtém o `TemplateRef` associado a esse elemento.

Desenvolvedores usam `read` com mais frequência para obter `ElementRef` e `TemplateRef`.

Você também pode passar `Injector` para `read`.

```angular-ts
@Component({
  selector: 'custom-table',
  template: `
    <third-party-table #inner>
      <ng-template>
        <ng-container [ngTemplateOutlet]="columns()" [ngTemplateOutletInjector]="innerInjector()" />
      </ng-template>
    </third-party-table>
  `,
})
export class CustomTable {
  columns = contentChild(TemplateRef);
  innerInjector = viewChild('inner', {read: Injector});
}
```

O exemplo acima obtém o node injector do elemento `third-party-table`, ou seja, o injector visto a partir da posição desse elemento na árvore. Ao passá-lo para `NgTemplateOutlet` por meio de `ngTemplateOutletInjector`, as directives no template projetado podem injetar valores fornecidos pelo component de terceiros.

### Descendentes de conteúdo {#content-descendants}

Por padrão, queries `contentChildren` encontram apenas os filhos _diretos_ do component e não percorrem descendentes.
Queries `contentChild` percorrem descendentes por padrão.

```angular-ts {highlight: [13, 14, 15, 16, 17]}
@Component({
  selector: 'custom-expando',
  /*...*/
})
export class CustomExpando {
  toggle = contentChildren(CustomToggle); // none found
  // toggle = contentChild(CustomToggle); // found
}

@Component({
  selector: 'user-profile',
  template: `
    <custom-expando>
      <some-other-component>
        <custom-toggle>Show</custom-toggle>
      </some-other-component>
    </custom-expando>
  `,
})
export class UserProfile {}
```

No exemplo acima, `CustomExpando` não consegue encontrar `<custom-toggle>` com `contentChildren`, porque ele não é um filho direto de `<custom-expando>`. Ao definir `descendants: true`, você configura a query para percorrer todos os descendentes no mesmo template. Queries, no entanto, _nunca_ atravessam components para percorrer elementos de outros templates.

View queries não têm essa opção, porque elas _sempre_ percorrem descendentes.

## Queries baseadas em decorator {#decorator-based-queries}

TIP: Embora a equipe do Angular recomende usar a função de query baseada em signal para novos projetos, as APIs de query baseadas em decorator originais continuam totalmente suportadas.

Alternativamente, você pode declarar queries adicionando o decorator correspondente a uma propriedade. Queries baseadas em decorator se comportam da mesma forma que as queries baseadas em signal, exceto conforme descrito abaixo.

### Queries de view {#decorator-view-queries}

Você pode consultar um único resultado com o decorator `@ViewChild`.

```angular-ts {highlight: [14, 16, 17, 18]}
@Component({
  selector: 'custom-card-header',
  /*...*/
})
export class CustomCardHeader {
  text: string;
}

@Component({
  selector: 'custom-card',
  template: '<custom-card-header>Visit sunny California!</custom-card-header>',
})
export class CustomCard implements AfterViewInit {
  @ViewChild(CustomCardHeader) header: CustomCardHeader;

  ngAfterViewInit() {
    console.log(this.header.text);
  }
}
```

Neste exemplo, o component `CustomCard` consulta um filho `CustomCardHeader` e acessa o resultado em `ngAfterViewInit`.

O Angular mantém o resultado de `@ViewChild` atualizado conforme o estado da sua aplicação muda.

**Os resultados de view query ficam disponíveis no método de lifecycle `ngAfterViewInit`**. Antes desse ponto, o valor é `undefined`. Veja a seção [Lifecycle](guide/components/lifecycle) para detalhes sobre o ciclo de vida do component.

Você também pode consultar múltiplos resultados com o decorator `@ViewChildren`.

```angular-ts {highlight: [17, 19, 20, 21, 22, 23]}
@Component({
  selector: 'custom-card-action',
  /*...*/
})
export class CustomCardAction {
  text: string;
}

@Component({
  selector: 'custom-card',
  template: `
    <custom-card-action>Save</custom-card-action>
    <custom-card-action>Cancel</custom-card-action>
  `,
})
export class CustomCard implements AfterViewInit {
  @ViewChildren(CustomCardAction) actions: QueryList<CustomCardAction>;

  ngAfterViewInit() {
    this.actions.forEach((action) => {
      console.log(action.text);
    });
  }
}
```

`@ViewChildren` cria um objeto `QueryList` que contém os resultados da query. Você pode se inscrever para receber as mudanças nos resultados da query ao longo do tempo pela propriedade `changes`.

### Queries de conteúdo {#decorator-content-queries}

Você pode consultar um único resultado com o decorator `@ContentChild`.

```angular-ts {highlight: [14, 16, 17, 18]}
@Component({
  selector: 'custom-toggle',
  /*...*/
})
export class CustomToggle {
  text: string;
}

@Component({
  selector: 'custom-expando',
  /*...*/
})
export class CustomExpando implements AfterContentInit {
  @ContentChild(CustomToggle) toggle: CustomToggle;

  ngAfterContentInit() {
    console.log(this.toggle.text);
  }
}

@Component({
  selector: 'user-profile',
  template: `
    <custom-expando>
      <custom-toggle>Show</custom-toggle>
    </custom-expando>
  `,
})
export class UserProfile {}
```

Neste exemplo, o component `CustomExpando` consulta um filho `CustomToggle` e acessa o resultado em `ngAfterContentInit`.

O Angular mantém o resultado de `@ContentChild` atualizado conforme o estado da sua aplicação muda.

**Os resultados de content query ficam disponíveis no método de lifecycle `ngAfterContentInit`**. Antes desse ponto, o valor é `undefined`. Veja a seção [Lifecycle](guide/components/lifecycle) para detalhes sobre o ciclo de vida do component.

Você também pode consultar múltiplos resultados com o decorator `@ContentChildren`.

```angular-ts {highlight: [14, 16, 17, 18, 19, 20]}
@Component({
  selector: 'custom-menu-item',
  /*...*/
})
export class CustomMenuItem {
  text: string;
}

@Component({
  selector: 'custom-menu',
  /*...*/
})
export class CustomMenu implements AfterContentInit {
  @ContentChildren(CustomMenuItem) items: QueryList<CustomMenuItem>;

  ngAfterContentInit() {
    this.items.forEach((item) => {
      console.log(item.text);
    });
  }
}

@Component({
  selector: 'user-profile',
  template: `
    <custom-menu>
      <custom-menu-item>Cheese</custom-menu-item>
      <custom-menu-item>Tomato</custom-menu-item>
    </custom-menu>
  `,
})
export class UserProfile {}
```

`@ContentChildren` cria um objeto `QueryList` que contém os resultados da query. Você pode se inscrever para receber as mudanças nos resultados da query ao longo do tempo pela propriedade `changes`.

### Opções de query baseadas em decorator {#decorator-based-query-options}

Todos os decorators de query aceitam um objeto de opções como segundo parâmetro. Essas opções funcionam da mesma forma que nas queries baseadas em signal, exceto onde descrito abaixo.

### Queries estáticas {#static-queries}

Os decorators `@ViewChild` e `@ContentChild` aceitam a opção `static`.

```angular-ts
@Component({
  selector: 'custom-card',
  template: '<custom-card-header>Visit sunny California!</custom-card-header>',
})
export class CustomCard implements OnInit {
  @ViewChild(CustomCardHeader, {static: true}) header: CustomCardHeader;

  ngOnInit() {
    console.log(this.header.text);
  }
}
```

Ao definir `static: true`, você garante ao Angular que o alvo desta query está _sempre_ presente e não é renderizado condicionalmente. Isso torna o resultado disponível mais cedo, no método de lifecycle `ngOnInit`.

Os resultados de static query não são atualizados após a inicialização.

A opção `static` não está disponível para as queries `@ViewChildren` e `@ContentChildren`.

### Usando QueryList {#using-querylist}

`@ViewChildren` e `@ContentChildren` fornecem um objeto `QueryList` que contém uma lista de resultados.

`QueryList` oferece várias APIs de conveniência para trabalhar com os resultados de forma semelhante a um array, como `map`, `reduce` e `forEach`. Você pode obter um array com os resultados atuais chamando `toArray`.

Você pode assinar a propriedade `changes` para executar algo sempre que os resultados mudarem.

## Armadilhas comuns de query {#common-query-pitfalls}

Ao usar queries, armadilhas comuns podem tornar seu código mais difícil de entender e manter.

Sempre mantenha uma única fonte de verdade para o estado compartilhado entre múltiplos components. Isso evita cenários em que estados repetidos em components diferentes ficam dessincronizados.

Evite escrever estado diretamente em components filhos. Esse padrão pode levar a código frágil, difícil de entender, e é propenso a erros [ExpressionChangedAfterItHasBeenChecked](errors/NG0100).

Nunca escreva estado diretamente em components pais ou ancestrais. Esse padrão pode levar a código frágil, difícil de entender, e é propenso a erros [ExpressionChangedAfterItHasBeenChecked](errors/NG0100).
