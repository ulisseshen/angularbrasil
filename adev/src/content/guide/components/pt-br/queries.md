<!-- ia-translate: true -->
# Referenciando filhos de components com queries

TIP: Este guia assume que você já leu o [Guia de Fundamentos](essentials). Leia-o primeiro se você é novo no Angular.

Um component pode definir **queries** que encontram elementos filhos e leem valores de seus injectors.

Desenvolvedores mais comumente usam queries para recuperar referências a components filhos, directives, elementos DOM, e mais.

Todas as funções de query retornam signals que refletem os resultados mais atualizados. Você pode ler o
resultado chamando a função signal, incluindo em contextos reativos como `computed` e `effect`.

Existem duas categorias de query: **view queries** e **content queries.**

## View queries

View queries recuperam resultados dos elementos na _view_ do component — os elementos definidos no próprio template do component. Você pode consultar um único resultado com a função `viewChild`.

<docs-code language="angular-ts" highlight="[14, 15]">
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
</docs-code>

Neste exemplo, o component `CustomCard` consulta por um filho `CustomCardHeader` e usa o resultado em um `computed`.

Se a query não encontrar um resultado, seu valor é `undefined`. Isto pode ocorrer se o elemento alvo estiver oculto por `@if`. O Angular mantém o resultado de `viewChild` atualizado conforme o estado da sua aplicação muda.

Você também pode consultar múltiplos resultados com a função `viewChildren`.

<docs-code language="angular-ts" highlight="[17, 19, 20, 21, 22, 23]">
@Component({
  selector: 'custom-card-action',
  /*...*/
})
export class CustomCardAction {
  text: string;
}

@Component({
selector: 'custom-card',
template: `     <custom-card-action>Save</custom-card-action>
    <custom-card-action>Cancel</custom-card-action>
  `,
})
export class CustomCard {
actions = viewChildren(CustomCardAction);
actionsTexts = computed(() => this.actions().map(action => action.text);
}
</docs-code>

`viewChildren` cria um signal com um `Array` dos resultados da query.

**Queries nunca atravessam limites de components.** View queries podem recuperar resultados apenas do template do component.

## Content queries

Content queries recuperam resultados dos elementos no _content_ do component— os elementos aninhados dentro do component no template onde ele é usado. Você pode consultar um único resultado com a função `contentChild`.

<docs-code language="angular-ts" highlight="[14, 15]">
@Component({
  selector: 'custom-toggle',
  /*...*/
})
export class CustomToggle {
  text: string;
}

@Component({
selector: 'custom-expando',
/_..._/
})
export class CustomExpando {
toggle = contentChild(CustomToggle);
toggleText = computed(() => this.toggle()?.text);
}

@Component({
/_ ... _/
// CustomToggle is used inside CustomExpando as content.
 template: `     <custom-expando>
      <custom-toggle>Show</custom-toggle>
    </custom-expando>
  `
})
export class UserProfile { }
</docs-code>

Neste exemplo, o component `CustomExpando` consulta por um filho `CustomToggle` e acessa o resultado em um `computed`.

Se a query não encontrar um resultado, seu valor é `undefined`. Isto pode ocorrer se o elemento alvo estiver ausente ou oculto por `@if`. O Angular mantém o resultado de `contentChild` atualizado conforme o estado da sua aplicação muda.

Por padrão, content queries encontram apenas filhos _diretos_ do component e não percorrem descendentes.

Você também pode consultar múltiplos resultados com a função `contentChildren`.

<docs-code language="angular-ts" highlight="[14, 16, 17, 18, 19, 20]">
@Component({
  selector: 'custom-menu-item',
  /*...*/
})
export class CustomMenuItem {
  text: string;
}

@Component({
selector: 'custom-menu',
/_..._/
})
export class CustomMenu {
items = contentChildren(CustomMenuItem);
itemTexts = computed(() => this.items().map(item => item.text));
}

@Component({
selector: 'user-profile',
template: `     <custom-menu>
      <custom-menu-item>Cheese</custom-menu-item>
      <custom-menu-item>Tomato</custom-menu-item>
    </custom-menu>
  `
})
export class UserProfile { }
</docs-code>

`contentChildren` cria um signal com um `Array` dos resultados da query.

**Queries nunca atravessam limites de components.** Content queries podem recuperar resultados apenas do mesmo template que o próprio component.

## Required queries

Se uma child query (`viewChild` ou `contentChild`) não encontrar um resultado, seu valor é `undefined`. Isto pode ocorrer se o elemento alvo estiver oculto por uma declaração de controle de fluxo como `@if` ou `@for`. Por causa disso, as child queries retornam um signal que inclui `undefined` em seu tipo de valor.

Em alguns casos, especialmente com `viewChild`, você sabe com certeza que um filho específico está sempre disponível. Em outros casos, você pode querer impor estritamente que um filho específico esteja presente. Para esses casos, você pode usar uma _required query_.

```angular-ts
@Component({/* ... */})
export class CustomCard {
  header = viewChild.required(CustomCardHeader);
  body = contentChild.required(CustomCardBody);
}
```

Se uma required query não encontrar um resultado correspondente, o Angular reporta um erro. Como isso garante que um resultado está disponível, required queries não incluem automaticamente `undefined` no tipo de valor do signal.

## Query locators

O primeiro parâmetro para cada decorator de query é seu **locator**.

Na maioria das vezes, você quer usar um component ou directive como seu locator.

Você pode, alternativamente, especificar um locator string correspondente a
uma [variável de referência de template](guide/templates/variables#template-reference-variables).

```angular-ts
@Component({
  /*...*/
  template: `
    <button #save>Save</button>
    <button #cancel>Cancel</button>
  `
})
export class ActionBar {
  saveButton = viewChild<ElementRef<HTMLButtonElement>>('save');
}
```

Se mais de um elemento definir a mesma variável de referência de template, a query recupera o primeiro elemento correspondente.

O Angular não suporta seletores CSS como locators de query.

### Queries e a árvore de injector

TIP: Veja [Injeção de Dependência](guide/di) para informações sobre providers e a árvore de injeção do Angular.

Para casos mais avançados, você pode usar qualquer `ProviderToken` como um locator. Isso permite localizar elementos baseado em providers de components e directives.

```angular-ts
const SUB_ITEM = new InjectionToken<string>('sub-item');

@Component({
  /*...*/
  providers: [{provide: SUB_ITEM, useValue: 'special-item'}],
})
export class SpecialItem { }

@Component({/*...*/})
export class CustomList {
  subItemType = contentChild(SUB_ITEM);
}
```

O exemplo acima usa um `InjectionToken` como um locator, mas você pode usar qualquer `ProviderToken` para localizar elementos específicos.

## Query options

Todas as funções de query aceitam um objeto de opções como segundo parâmetro. Essas opções controlam como a query encontra seus resultados.

### Lendo valores específicos do injector de um elemento

Por padrão, o locator da query indica tanto o elemento que você está procurando quanto o valor recuperado. Você pode, alternativamente, especificar a opção `read` para recuperar um valor diferente do elemento correspondido pelo locator.

```ts
@Component({/*...*/})
export class CustomExpando {
  toggle = contentChild(ExpandoContent, {read: TemplateRef});
}
```

O exemplo acima localiza um elemento com a directive `ExpandoContent` e recupera
o `TemplateRef` associado com aquele elemento.

Desenvolvedores mais comumente usam `read` para recuperar `ElementRef` e `TemplateRef`.

### Content descendants

Por padrão, queries `contentChildren` encontram apenas filhos _diretos_ do component e não percorrem descendentes.
Queries `contentChild` percorrem descendentes por padrão.

<docs-code language="angular-ts" highlight="[13, 14, 15, 16]">
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
template: `     <custom-expando>
      <some-other-component>
        <custom-toggle>Show</custom-toggle>
      </some-other-component>
    </custom-expando>
  `
})
export class UserProfile { }
</docs-code>

No exemplo acima, `CustomExpando` não consegue encontrar `<custom-toggle>` com `contentChildren` porque não é um filho direto de `<custom-expando>`. Ao definir `descendants: true`, você configura a query para percorrer todos os descendentes no mesmo template. Queries, no entanto, _nunca_ atravessam components para percorrer elementos em outros templates.

View queries não têm esta opção porque elas _sempre_ percorrem descendentes.

## Decorator-based queries

TIP: Embora o time do Angular recomende usar a função de query baseada em signal para novos projetos, as
APIs de query originais baseadas em decorator permanecem totalmente suportadas.

Você pode, alternativamente, declarar queries adicionando o decorator correspondente a uma propriedade. Decorator-based queries se comportam da mesma forma que signal-based queries exceto como descrito abaixo.

### View queries

Você pode consultar um único resultado com o decorator `@ViewChild`.

<docs-code language="angular-ts" highlight="[14, 16, 17, 18]">
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
@ViewChild(CustomCardHeader) header: CustomCardHeader;

ngAfterViewInit() {
console.log(this.header.text);
}
}
</docs-code>

Neste exemplo, o component `CustomCard` consulta por um filho `CustomCardHeader` e acessa o resultado em `ngAfterViewInit`.

O Angular mantém o resultado de `@ViewChild` atualizado conforme o estado da sua aplicação muda.

**Resultados de view query ficam disponíveis no método de lifecycle `ngAfterViewInit`**. Antes deste ponto, o valor é `undefined`. Veja a seção [Lifecycle](guide/components/lifecycle) para detalhes sobre o ciclo de vida do component.

Você também pode consultar múltiplos resultados com o decorator `@ViewChildren`.

<docs-code language="angular-ts" highlight="[17, 19, 20, 21, 22, 23]">
@Component({
  selector: 'custom-card-action',
  /*...*/
})
export class CustomCardAction {
  text: string;
}

@Component({
selector: 'custom-card',
template: `     <custom-card-action>Save</custom-card-action>
    <custom-card-action>Cancel</custom-card-action>
  `,
})
export class CustomCard {
@ViewChildren(CustomCardAction) actions: QueryList<CustomCardAction>;

ngAfterViewInit() {
this.actions.forEach(action => {
console.log(action.text);
});
}
}
</docs-code>

`@ViewChildren` cria um objeto `QueryList` que contém os resultados da query. Você pode se inscrever para mudanças nos resultados da query ao longo do tempo via a propriedade `changes`.

### Content queries

Você pode consultar um único resultado com o decorator `@ContentChild`.

<docs-code language="angular-ts" highlight="[14, 16, 17, 18, 25]">
@Component({
  selector: 'custom-toggle',
  /*...*/
})
export class CustomToggle {
  text: string;
}

@Component({
selector: 'custom-expando',
/_..._/
})
export class CustomExpando {
@ContentChild(CustomToggle) toggle: CustomToggle;

ngAfterContentInit() {
console.log(this.toggle.text);
}
}

@Component({
selector: 'user-profile',
template: `     <custom-expando>
      <custom-toggle>Show</custom-toggle>
    </custom-expando>
  `
})
export class UserProfile { }
</docs-code>

Neste exemplo, o component `CustomExpando` consulta por um filho `CustomToggle` e acessa o resultado em `ngAfterContentInit`.

O Angular mantém o resultado de `@ContentChild` atualizado conforme o estado da sua aplicação muda.

**Resultados de content query ficam disponíveis no método de lifecycle `ngAfterContentInit`**. Antes deste ponto, o valor é `undefined`. Veja a seção [Lifecycle](guide/components/lifecycle) para detalhes sobre o ciclo de vida do component.

Você também pode consultar múltiplos resultados com o decorator `@ContentChildren`.

<docs-code language="angular-ts" highlight="[14, 16, 17, 18, 19, 20]">
@Component({
  selector: 'custom-menu-item',
  /*...*/
})
export class CustomMenuItem {
  text: string;
}

@Component({
selector: 'custom-menu',
/_..._/
})
export class CustomMenu {
@ContentChildren(CustomMenuItem) items: QueryList<CustomMenuItem>;

ngAfterContentInit() {
this.items.forEach(item => {
console.log(item.text);
});
}
}

@Component({
selector: 'user-profile',
template: `     <custom-menu>
      <custom-menu-item>Cheese</custom-menu-item>
      <custom-menu-item>Tomato</custom-menu-item>
    </custom-menu>
  `
})
export class UserProfile { }
</docs-code>

`@ContentChildren` cria um objeto `QueryList` que contém os resultados da query. Você pode se inscrever para mudanças nos resultados da query ao longo do tempo via a propriedade `changes`.

### Decorator-based query options

Todos os decorators de query aceitam um objeto de opções como segundo parâmetro. Essas opções funcionam da mesma forma que signal-based queries exceto onde descrito abaixo.

### Static queries

Os decorators `@ViewChild` e `@ContentChild` aceitam a opção `static`.

```angular-ts
@Component({
  selector: 'custom-card',
  template: '<custom-card-header>Visit sunny California!</custom-card-header>',
})
export class CustomCard {
  @ViewChild(CustomCardHeader, {static: true}) header: CustomCardHeader;

  ngOnInit() {
    console.log(this.header.text);
  }
}
```

Ao definir `static: true`, você garante ao Angular que o alvo desta query está _sempre_ presente e não é renderizado condicionalmente. Isso torna o resultado disponível mais cedo, no método de lifecycle `ngOnInit`.

Resultados de static query não atualizam após a inicialização.

A opção `static` não está disponível para queries `@ViewChildren` e `@ContentChildren`.

### Usando QueryList

`@ViewChildren` e `@ContentChildren` ambos fornecem um objeto `QueryList` que contém uma lista de resultados.

`QueryList` oferece uma série de APIs de conveniência para trabalhar com resultados de forma semelhante a array, como `map`, `reduce`, e `forEach`. Você pode obter um array dos resultados atuais chamando `toArray`.

Você pode se inscrever na propriedade `changes` para fazer algo sempre que os resultados mudarem.

## Armadilhas comuns de query

Ao usar queries, armadilhas comuns podem tornar seu código mais difícil de entender e manter.

Sempre mantenha uma única fonte de verdade para estado compartilhado entre múltiplos components. Isso evita cenários onde estado repetido em diferentes components fica dessincronizado.

Evite escrever estado diretamente em components filhos. Este padrão pode levar a código frágil que é difícil de entender e é propenso a erros [ExpressionChangedAfterItHasBeenChecked](errors/NG0100).

Nunca escreva estado diretamente em components pais ou ancestrais. Este padrão pode levar a código frágil que é difícil de entender e é propenso a erros [ExpressionChangedAfterItHasBeenChecked](errors/NG0100).
