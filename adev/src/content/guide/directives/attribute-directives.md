<!-- ia-translate: true -->
# Attribute directives

As attribute directives alteram a aparência ou o comportamento de elementos DOM e de components Angular.

## Use template bindings para comportamentos pontuais {#use-template-bindings-for-one-off-behavior}

A sintaxe de template do Angular já cobre a alteração das classes, dos estilos, das propriedades e dos eventos de um único elemento:

- [Class and style bindings](guide/templates/binding#css-class-and-style-property-bindings) adicionam e removem classes CSS e estilos inline.
- [Property and attribute bindings](guide/templates/binding) definem propriedades do DOM e atributos HTML.
- [Event listeners](guide/templates/event-listeners) respondem à interação do usuário.

Attribute directives são úteis quando você quer empacotar esse tipo de comportamento em uma unidade reutilizável que pode ser aplicada a qualquer elemento ou component.

## Construindo uma attribute directive {#building-an-attribute-directive}

Uma attribute directive customizada é uma classe JavaScript com o decorator `@Directive()`. A propriedade `selector` do decorator define o atributo que aplica a directive. Os colchetes tornam isso um seletor de atributo, então a directive corresponde a elementos que carregam esse atributo. Por convenção, use um prefixo como `app` para evitar conflitos de nomes:

```ts
import {Directive} from '@angular/core';

@Directive({
  selector: '[appHighlight]',
})
export class HighlightDirective {}
```

HELPFUL: O comando CLI [`ng generate directive`](tools/cli/schematics) gera o esqueleto de uma directive junto com o arquivo de teste dela.

Uma directive pode alterar seu host de forma declarativa, por meio de host bindings, ou de forma imperativa, por meio de uma referência ao elemento host. Este exemplo [injeta](guide/di) [`ElementRef`](api/core/ElementRef) e acessa o elemento pela propriedade `nativeElement` para definir o fundo como amarelo:

<docs-code header="highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.1.ts"/>

IMPORTANT: Directives _não_ suportam namespaces.

```angular-html {avoid}
<p app:Highlight>This is invalid</p>
```

## Aplicando uma attribute directive {#applying-an-attribute-directive}

Para aplicar a directive, adicione o seletor dela como um atributo em um elemento:

<docs-code header="app.component.html" path="adev/src/content/examples/attribute-directives/src/app/app.component.1.html" region="applied"/>

O Angular cria uma instância de `HighlightDirective` para aquele elemento `<p>`, injeta uma referência ao elemento e define o fundo dele como amarelo.

## Manipulando eventos do usuário {#handling-user-events}

Para responder à interação do usuário, vincule eventos do elemento host a métodos handler pela propriedade `host` do decorator `@Directive()`. A directive a seguir destaca o elemento host enquanto o ponteiro está sobre ele e remove o destaque quando o ponteiro sai:

<docs-code header="highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.2.ts"/>

A propriedade `host` mapeia os eventos `mouseenter` e `mouseleave` para os métodos `onMouseEnter()` e `onMouseLeave()`, que delegam para um helper `highlight()` que define a cor de fundo do elemento host. Para saber mais sobre host event bindings, veja [binding no elemento host](guide/components/host-elements#binding-to-the-host-element).

## Aceitando valores de entrada {#accepting-input-values}

Assim como components, directives aceitam inputs pela função [`input()`](guide/components/inputs). Dê a um input o mesmo nome do seletor, para que um único binding aplique a directive e passe um valor para ela:

<docs-code header="highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.3.ts" region="input"/>

Leia o input chamando-o como um signal e use um valor padrão quando nenhuma cor estiver definida:

<docs-code header="highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.3.ts" region="mouse-enter"/>

No template, vincule o valor ao seletor. Como o input compartilha o nome do seletor, `[appHighlight]` tanto aplica a directive quanto define o valor dela. Aqui, o `color` vinculado é uma propriedade do component:

<docs-code header="app.component.html" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" region="color"/>

<docs-code header="app.component.ts" path="adev/src/content/examples/attribute-directives/src/app/app.component.ts" region="class"/>

Uma directive pode declarar mais de um input. A directive a seguir adiciona um input `defaultColor` e, em seguida, faz fallback por `appHighlight`, `defaultColor` e, por fim, `red`:

<docs-code header="highlight.directive.ts" path="adev/src/content/examples/attribute-directives/src/app/highlight.directive.ts"/>

Vincule os dois inputs no mesmo elemento. Como `defaultColor` recebe uma string estática em vez de uma expressão dinâmica, ele não precisa de colchetes:

<docs-code header="app.component.html" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" region="defaultColor"/>

## Desativando o processamento do Angular com `NgNonBindable` {#deactivating-angular-processing-with-ngnonbindable}

Para impedir a avaliação de expressões no navegador, adicione `ngNonBindable` ao elemento host.
`ngNonBindable` desativa interpolation, directives e binding em templates.

No exemplo a seguir, a expressão `{{ 1 + 1 }}` é renderizada exatamente como aparece no seu editor de código, e não exibe `2`.

<docs-code header="app.component.html" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" region="ngNonBindable"/>

Aplicar `ngNonBindable` a um elemento interrompe o binding para os elementos filhos desse elemento.
No entanto, `ngNonBindable` ainda permite que directives funcionem no elemento em que você aplica `ngNonBindable`.
No exemplo a seguir, a directive `appHighlight` continua ativa, mas o Angular não avalia a expressão `{{ 1 + 1 }}`.

<docs-code header="app.component.html" path="adev/src/content/examples/attribute-directives/src/app/app.component.html" region="ngNonBindable-with-directive"/>

Se você aplicar `ngNonBindable` a um elemento pai, o Angular desativa interpolation e binding de qualquer tipo, como property binding ou event binding, para os filhos desse elemento.

## Próximos passos {#whats-next}

<docs-pill-row>
  <docs-pill href="guide/directives/structural-directives" title="Diretivas estruturais"/>
  <docs-pill href="guide/directives/directive-composition-api" title="API de composição de directives"/>
</docs-pill-row>
