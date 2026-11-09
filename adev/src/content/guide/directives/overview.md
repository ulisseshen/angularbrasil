<!-- ia-translate: true -->

<docs-decorative-header title="Diretivas" imgSrc="adev/src/assets/images/directives.svg"> <!-- markdownlint-disable-line -->
Diretivas adicionam comportamento a elementos e components em suas aplicações Angular.
</docs-decorative-header>

Uma directive pode mudar a aparência de um elemento, o comportamento dele ou a forma como ele se encaixa no DOM. O Angular inclui várias directives built-in, e você também pode criar as suas.

## Quando usar uma directive {#when-to-use-a-directive}

Directives são mais eficazes quando encapsulam comportamento **reutilizável** que você quer aplicar a um elemento ou component existente.

Exemplos comuns incluem:

- Aplicar a mesma aparência ou o mesmo comportamento em vários elementos, como autofocus ou um tooltip.
- Ler ou escrever no DOM, nos atributos ou nas classes do elemento host.
- Adicionar comportamento a um component que você não possui, sem alterar o código-fonte dele.

Se você precisa renderizar sua própria marcação ou gerenciar um trecho de UI com template próprio, use um [component](guide/components), que é uma directive especializada com template próprio.

## Um exemplo rápido {#a-quick-example}

Suponha que você queira que elementos sejam destacados quando o usuário passa o mouse sobre eles, mudando a cor de fundo para amarelo. Em vez de repetir a mesma lógica de tratamento de eventos em cada elemento, você pode empacotar esse comportamento em uma directive e aplicá-la onde precisar.

A directive `appHighlight` a seguir define a cor de fundo do elemento host quando o mouse entra e a limpa quando o mouse sai:

```ts
import {Directive, signal} from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  host: {
    '(mouseenter)': 'isHovered.set(true)',
    '(mouseleave)': 'isHovered.set(false)',
    '[style.background-color]': 'isHovered() ? "yellow" : null',
  },
})
export class HighlightDirective {
  protected isHovered = signal(false);
}
```

Os metadados `host` escutam eventos do mouse para atualizar o signal `isHovered`, e vinculam o estilo `background-color` do elemento host ao valor desse signal.

Aplique a directive adicionando o seletor dela como um atributo em um elemento:

```angular-html
<p appHighlight>Highlight me!</p>
```

Todo elemento que carrega o atributo `appHighlight` ganha o mesmo comportamento de hover, com a lógica definida em um único lugar.

## Tipos de directives {#types-of-directives}

O Angular tem três tipos principais de directives:

| Tipo de directive                                               | Detalhes                                                                                       |
| :-------------------------------------------------------------- | :--------------------------------------------------------------------------------------------- |
| [Components](guide/components)                                  | Definem UI reutilizável com template próprio.                                                  |
| [Attribute directives](guide/directives/attribute-directives)   | Alteram a aparência ou o comportamento de um elemento, component ou outra directive.           |
| [Structural directives](guide/directives/structural-directives) | Alteram o layout do DOM adicionando e removendo elementos do DOM.                              |

## Próximos passos {#whats-next}

Saiba mais sobre cada tipo de directive nos guias a seguir.

<docs-pill-row>
  <docs-pill href="guide/directives/attribute-directives" title="Diretivas de atributo"/>
  <docs-pill href="guide/directives/structural-directives" title="Diretivas estruturais"/>
  <docs-pill href="guide/directives/directive-composition-api" title="API de composição de directives"/>
</docs-pill-row>
