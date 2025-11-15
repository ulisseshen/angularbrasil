<!-- ia-translate: true -->
# Testes de Attribute Directives

Uma _attribute directive_ modifica o comportamento de um elemento, component ou outra directive.
Seu nome reflete a maneira como a directive é aplicada: como um atributo em um elemento host.

## Testes da `HighlightDirective`

A `HighlightDirective` da aplicação de exemplo define a cor de fundo de um elemento com base em uma cor vinculada por data ou uma cor padrão \(lightgray\).
Ela também define uma propriedade personalizada do elemento \(`customProperty`\) para `true` por nenhuma outra razão além de mostrar que pode.

<docs-code header="app/shared/highlight.directive.ts" path="adev/src/content/examples/testing/src/app/shared/highlight.directive.ts"/>

Ela é usada em toda a aplicação, talvez mais simplesmente no `AboutComponent`:

<docs-code header="app/about/about.component.ts" path="adev/src/content/examples/testing/src/app/about/about.component.ts"/>

Testar o uso específico da `HighlightDirective` dentro do `AboutComponent` requer apenas as técnicas exploradas na seção ["Testes de components aninhados"](guide/testing/components-scenarios#nested-component-tests) de [Cenários de testes de components](guide/testing/components-scenarios).

<docs-code header="app/about/about.component.spec.ts" path="adev/src/content/examples/testing/src/app/about/about.component.spec.ts" visibleRegion="tests"/>

No entanto, testar um único caso de uso é improvável de explorar toda a gama de capacidades de uma directive.
Encontrar e testar todos os components que usam a directive é tedioso, frágil e quase tão improvável de proporcionar cobertura total.

_Testes somente de classe_ podem ser úteis, mas attribute directives como esta tendem a manipular o DOM.
Testes de unidade isolados não tocam o DOM e, portanto, não inspiram confiança na eficácia da directive.

Uma solução melhor é criar um component de teste artificial que demonstre todas as maneiras de aplicar a directive.

<docs-code header="app/shared/highlight.directive.spec.ts (TestComponent)" path="adev/src/content/examples/testing/src/app/shared/highlight.directive.spec.ts" visibleRegion="test-component"/>

<img alt="HighlightDirective spec in action" src="assets/images/guide/testing/highlight-directive-spec.png">

ÚTIL: O caso `<input>` vincula a `HighlightDirective` ao nome de um valor de cor na caixa de input.
O valor inicial é a palavra "cyan" que deve ser a cor de fundo da caixa de input.

Aqui estão alguns testes deste component:

<docs-code header="app/shared/highlight.directive.spec.ts (selected tests)" path="adev/src/content/examples/testing/src/app/shared/highlight.directive.spec.ts" visibleRegion="selected-tests"/>

Algumas técnicas são notáveis:

- O predicate `By.directive` é uma ótima maneira de obter os elementos que têm esta directive _quando seus tipos de elementos são desconhecidos_
- A [pseudo-classe `:not`](https://developer.mozilla.org/docs/Web/CSS/:not) em `By.css('h2:not([highlight])')` ajuda a encontrar elementos `<h2>` que _não_ têm a directive.
  `By.css('*:not([highlight])')` encontra _qualquer_ elemento que não tenha a directive.

- `DebugElement.styles` proporciona acesso aos estilos do elemento mesmo na ausência de um browser real, graças à abstração `DebugElement`.
  Mas sinta-se livre para explorar o `nativeElement` quando isso parecer mais fácil ou mais claro do que a abstração.

- O Angular adiciona uma directive ao injector do elemento ao qual ela é aplicada.
  O teste para a cor padrão usa o injector do segundo `<h2>` para obter sua instância `HighlightDirective` e sua `defaultColor`.

- `DebugElement.properties` proporciona acesso à propriedade personalizada artificial que é definida pela directive
