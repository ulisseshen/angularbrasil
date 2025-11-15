<!-- ia-translate: true -->
# Attribute directives

Mude a aparência ou comportamento de elementos DOM e components Angular com attribute directives.

## Construindo uma attribute directive

Esta seção orienta você na criação de uma directive de destaque que define a cor de fundo do elemento host para amarelo.

1. Para criar uma directive, use o comando CLI [`ng generate directive`](tools/cli/schematics).

   <docs-code language="shell">

   ng generate directive highlight

   </docs-code>

   O CLI cria `src/app/highlight.directive.ts`, um arquivo de teste correspondente `src/app/highlight.directive.spec.ts`.

   <docs-code header="src/app/highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.0.ts"/>

   A propriedade de configuração do decorator `@Directive()` especifica o seletor de atributo CSS da directive, `[appHighlight]`.

1. Importe `ElementRef` de `@angular/core`.
   `ElementRef` concede acesso direto ao elemento DOM host através de sua propriedade `nativeElement`.

1. Adicione `ElementRef` no `constructor()` da directive para [injetar](guide/di) uma referência ao elemento DOM host, o elemento ao qual você aplica `appHighlight`.

1. Adicione lógica à classe `HighlightDirective` que define o fundo como amarelo.

<docs-code header="src/app/highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.1.ts"/>

ÚTIL: Directives _não_ suportam namespaces.

<docs-code header="src/app/app.component.avoid.html (não suportado)" path="adev/src/content/examples/attribute-directives/src/app/app.component.avoid.html" visibleRegion="unsupported"/>

## Aplicando uma attribute directive

1. Para usar a `HighlightDirective`, adicione um elemento `<p>` ao template HTML com a directive como um atributo.

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/attribute-directives/src/app/app.component.1.html" visibleRegion="applied"/>

O Angular cria uma instância da classe `HighlightDirective` e injeta uma referência ao elemento `<p>` no constructor da directive, que define o estilo de fundo do elemento `<p>` como amarelo.

## Manipulando eventos do usuário

Esta seção mostra como detectar quando um usuário passa o mouse sobre o elemento ou sai dele e responder definindo ou limpando a cor de destaque.

1. Importe `HostListener` de '@angular/core'.

<docs-code header="src/app/highlight.directive.ts (imports)" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.2.ts" visibleRegion="imports"/>

1. Adicione dois event handlers que respondem quando o mouse entra ou sai, cada um com o decorator `@HostListener()`.

<docs-code header="src/app/highlight.directive.ts (mouse-methods)" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.2.ts" visibleRegion="mouse-methods"/>

Inscreva-se em eventos do elemento DOM que hospeda uma attribute directive, o `<p>` neste caso, com o decorator `@HostListener()`.

ÚTIL: Os handlers delegam para um método auxiliar, `highlight()`, que define a cor no elemento DOM host, `el`.

A directive completa é a seguinte:

<docs-code header="src/app/highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.2.ts"/>

A cor de fundo aparece quando o ponteiro passa sobre o elemento de parágrafo e desaparece quando o ponteiro se move para fora.

<img alt="Second Highlight" src="assets/images/guide/attribute-directives/highlight-directive-anim.gif">

## Passando valores para uma attribute directive

Esta seção orienta você a definir a cor de destaque ao aplicar a `HighlightDirective`.

1. Em `highlight.directive.ts`, importe `Input` de `@angular/core`.

<docs-code header="src/app/highlight.directive.ts (imports)" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.3.ts" visibleRegion="imports"/>

1. Adicione uma propriedade `input` `appHighlight`.

   <docs-code header="src/app/highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.3.ts" visibleRegion="input"/>

   A função `input()` adiciona metadados à classe que torna a propriedade `appHighlight` da directive disponível para binding.

1. Em `app.component.ts`, adicione uma propriedade `color` ao `AppComponent`.

<docs-code header="src/app/app.component.ts (class)" path="adev/src/content/examples/attribute-directives/src/app/app.component.1.ts" visibleRegion="class"/>

1. Para aplicar simultaneamente a directive e a cor, use property binding com o seletor da directive `appHighlight`, definindo-o igual a `color`.

   <docs-code header="src/app/app.component.html (color)" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" visibleRegion="color"/>

   O attribute binding `[appHighlight]` executa duas tarefas:
   - Aplica a directive de destaque ao elemento `<p>`
   - Define a cor de destaque da directive com um property binding

### Definindo o valor com entrada do usuário

Esta seção orienta você a adicionar botões de opção para vincular sua escolha de cor à directive `appHighlight`.

1. Adicione marcação a `app.component.html` para escolher uma cor da seguinte forma:

<docs-code header="src/app/app.component.html (v2)" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" visibleRegion="v2"/>

1. Revise o `AppComponent.color` para que ele não tenha valor inicial.

<docs-code header="src/app/app.component.ts (class)" path="adev/src/content/examples/attribute-directives/src/app/app.component.ts" visibleRegion="class"/>

1. Em `highlight.directive.ts`, revise o método `onMouseEnter` para que ele primeiro tente destacar com `appHighlight` e volte para `red` se `appHighlight` for `undefined`.

<docs-code header="src/app/highlight.directive.ts (mouse-enter)" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.3.ts" visibleRegion="mouse-enter"/>

1. Sirva sua aplicação para verificar que o usuário pode escolher a cor com os botões de opção.

<img alt="Gif animado da directive de destaque refatorada mudando de cor de acordo com o botão de opção que o usuário seleciona" src="assets/images/guide/attribute-directives/highlight-directive-v2-anim.gif">

## Binding para uma segunda propriedade

Esta seção orienta você a configurar sua aplicação para que o desenvolvedor possa definir a cor padrão.

1. Adicione uma segunda propriedade `Input()` à `HighlightDirective` chamada `defaultColor`.

<docs-code header="src/app/highlight.directive.ts (defaultColor)" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.ts" visibleRegion="defaultColor"/>

1. Revise o `onMouseEnter` da directive para que ele primeiro tente destacar com o `appHighlight`, depois com o `defaultColor`, e volte para `red` se ambas as propriedades forem `undefined`.

<docs-code header="src/app/highlight.directive.ts (mouse-enter)" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.ts" visibleRegion="mouse-enter"/>

1. Para fazer binding com `AppComponent.color` e voltar para "violet" como a cor padrão, adicione o seguinte HTML.
   Neste caso, o binding `defaultColor` não usa colchetes, `[]`, porque é estático.

   <docs-code header="src/app/app.component.html (defaultColor)" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" visibleRegion="defaultColor"/>

   Assim como com components, você pode adicionar múltiplos property bindings de directive a um elemento host.

A cor padrão é vermelho se não houver binding de cor padrão.
Quando o usuário escolhe uma cor, a cor selecionada se torna a cor de destaque ativa.

<img alt="Gif animado da directive de destaque final que mostra cor vermelha sem binding e violeta com a cor padrão definida. Quando o usuário seleciona a cor, a seleção tem precedência." src="assets/images/guide/attribute-directives/highlight-directive-final-anim.gif">

## Desativando o processamento do Angular com `NgNonBindable`

Para prevenir a avaliação de expressões no navegador, adicione `ngNonBindable` ao elemento host.
`ngNonBindable` desativa interpolation, directives e binding em templates.

No exemplo a seguir, a expressão `{{ 1 + 1 }}` renderiza exatamente como aparece no seu editor de código, e não exibe `2`.

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" visibleRegion="ngNonBindable"/>

Aplicar `ngNonBindable` a um elemento interrompe o binding para os elementos filhos desse elemento.
No entanto, `ngNonBindable` ainda permite que directives funcionem no elemento onde você aplica `ngNonBindable`.
No exemplo a seguir, a directive `appHighlight` ainda está ativa, mas o Angular não avalia a expressão `{{ 1 + 1 }}`.

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" visibleRegion="ngNonBindable-with-directive"/>

Se você aplicar `ngNonBindable` a um elemento pai, o Angular desativa interpolation e binding de qualquer tipo, como property binding ou event binding, para os filhos do elemento.
