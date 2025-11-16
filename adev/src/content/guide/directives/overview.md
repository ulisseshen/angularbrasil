<!-- ia-translate: true -->

<docs-decorative-header title="Built-in directives" imgSrc="adev/src/assets/images/directives.svg"> <!-- markdownlint-disable-line -->
Directives são classes que adicionam comportamento adicional a elementos em suas aplicações Angular.
</docs-decorative-header>

Use as directives built-in do Angular para gerenciar formulários, listas, estilos e o que os usuários veem.

Os diferentes tipos de directives Angular são os seguintes:

| Tipos de Directive                                               | Detalhes                                                                         |
| :--------------------------------------------------------------- | :------------------------------------------------------------------------------- |
| [Components](guide/components)                                   | Usados com um template. Este tipo de directive é o tipo de directive mais comum. |
| [Attribute directives](#built-in-attribute-directives)           | Mudam a aparência ou comportamento de um elemento, component ou outra directive. |
| [Structural directives](/guide/directives/structural-directives) | Mudam o layout do DOM adicionando e removendo elementos DOM.                     |

Este guia cobre [attribute directives](#built-in-attribute-directives) built-in.

## Attribute directives built-in {#built-in-attribute-directives}

Attribute directives escutam e modificam o comportamento de outros elementos HTML, atributos, propriedades e components.

As attribute directives mais comuns são as seguintes:

| Directives comuns                                      | Detalhes                                                        |
| :----------------------------------------------------- | :-------------------------------------------------------------- |
| [`NgClass`](#adding-and-removing-classes-with-ngclass) | Adiciona e remove um conjunto de classes CSS.                   |
| [`NgStyle`](#setting-inline-styles-with-ngstyle)       | Adiciona e remove um conjunto de estilos HTML.                  |
| [`NgModel`](guide/forms/template-driven-forms)         | Adiciona two-way data binding a um elemento de formulário HTML. |

HELPFUL: Directives built-in usam apenas APIs públicas. Elas não têm acesso especial a nenhuma API privada que outras directives não possam acessar.

## Adicionando e removendo classes com `NgClass` {#adding-and-removing-classes-with-ngclass}

Adicione ou remova múltiplas classes CSS simultaneamente com `ngClass`.

HELPFUL: Para adicionar ou remover uma _única_ classe, use [class binding](guide/templates/class-binding) em vez de `NgClass`.

### Importar `NgClass` no component

Para usar `NgClass`, adicione-o à lista de `imports` do component.

<docs-code header="src/app/app.component.ts (NgClass import)" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" visibleRegion="import-ng-class"/>

### Usando `NgClass` com uma expressão

No elemento que você gostaria de estilizar, adicione `[ngClass]` e defina-o igual a uma expressão.
Neste caso, `isSpecial` é um boolean definido como `true` em `app.component.ts`.
Como `isSpecial` é true, `ngClass` aplica a classe `special` ao `<div>`.

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="special-div"/>

### Usando `NgClass` com um method

1. Para usar `NgClass` com um method, adicione o method à classe do component.
   No exemplo a seguir, `setCurrentClasses()` define a propriedade `currentClasses` com um objeto que adiciona ou remove três classes baseado no estado `true` ou `false` de três outras propriedades do component.

   Cada chave do objeto é um nome de classe CSS.
   Se uma chave é `true`, `ngClass` adiciona a classe.
   Se uma chave é `false`, `ngClass` remove a classe.

   <docs-code header="src/app/app.component.ts" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" visibleRegion="setClasses"/>

1. No template, adicione o property binding `ngClass` a `currentClasses` para definir as classes do elemento:

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="NgClass-1"/>

Para este caso de uso, o Angular aplica as classes na inicialização e em caso de mudanças causadas pela reatribuição do objeto `currentClasses`.
O exemplo completo chama `setCurrentClasses()` inicialmente com `ngOnInit()` quando o usuário clica no botão `Refresh currentClasses`.
Esses passos não são necessários para implementar `ngClass`.

## Definindo estilos inline com `NgStyle` {#setting-inline-styles-with-ngstyle}

HELPFUL: Para adicionar ou remover um _único_ estilo, use [style bindings](guide/templates/binding#css-class-and-style-property-bindings) em vez de `NgStyle`.

### Importar `NgStyle` no component

Para usar `NgStyle`, adicione-o à lista de `imports` do component.

<docs-code header="src/app/app.component.ts (NgStyle import)" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" visibleRegion="import-ng-style"/>

Use `NgStyle` para definir múltiplos estilos inline simultaneamente, baseado no estado do component.

1. Para usar `NgStyle`, adicione um method à classe do component.

   No exemplo a seguir, `setCurrentStyles()` define a propriedade `currentStyles` com um objeto que define três estilos, baseado no estado de três outras propriedades do component.

   <docs-code header="src/app/app.component.ts" path="adev/src/content/examples/built-in-directives/src/app/app.component.ts" visibleRegion="setStyles"/>

1. Para definir os estilos do elemento, adicione um property binding `ngStyle` a `currentStyles`.

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/built-in-directives/src/app/app.component.html" visibleRegion="NgStyle-2"/>

Para este caso de uso, o Angular aplica os estilos na inicialização e em caso de mudanças.
Para fazer isso, o exemplo completo chama `setCurrentStyles()` inicialmente com `ngOnInit()` e quando as propriedades dependentes mudam através de um clique de botão.
No entanto, esses passos não são necessários para implementar `ngStyle` por si só.

## Hospedando uma directive sem um elemento DOM

O `<ng-container>` do Angular é um elemento de agrupamento que não interfere com estilos ou layout porque o Angular não o coloca no DOM.

Use `<ng-container>` quando não houver um único elemento para hospedar a directive.

Aqui está um parágrafo condicional usando `<ng-container>`.

<docs-code header="src/app/app.component.html (ngif-ngcontainer)" path="adev/src/content/examples/structural-directives/src/app/app.component.html" visibleRegion="ngif-ngcontainer"/>

<img alt="ngcontainer paragraph with proper style" src="assets/images/guide/structural-directives/good-paragraph.png">

1. Importe a directive `ngModel` de `FormsModule`.

1. Adicione `FormsModule` à seção de imports do módulo Angular relevante.

1. Para excluir condicionalmente um `<option>`, envolva o `<option>` em um `<ng-container>`.

   <docs-code header="src/app/app.component.html (select-ngcontainer)" path="adev/src/content/examples/structural-directives/src/app/app.component.html" visibleRegion="select-ngcontainer"/>

   <img alt="ngcontainer options work properly" src="assets/images/guide/structural-directives/select-ngcontainer-anim.gif">

## Próximos passos

<docs-pill-row>
  <docs-pill href="guide/directives/attribute-directives" title="Attribute Directives"/>
  <docs-pill href="guide/directives/structural-directives" title="Structural Directives"/>
  <docs-pill href="guide/directives/directive-composition-api" title="Directive composition API"/>
</docs-pill-row>
