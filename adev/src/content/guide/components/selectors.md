<!-- ia-translate: true -->
# Seletores de components

TIP: Este guia assume que você já leu o [Guia de Fundamentos](essentials). Leia-o primeiro se você é novo no Angular.

Todo component define
um [seletor CSS](https://developer.mozilla.org/docs/Web/CSS/CSS_selectors) que determina como
o component é usado:

<docs-code language="angular-ts" highlight="[2]">
@Component({
  selector: 'profile-photo',
  ...
})
export class ProfilePhoto { }
</docs-code>

Você usa um component criando um elemento HTML correspondente nos templates de _outros_ components:

<docs-code language="angular-ts" highlight="[3]">
@Component({
  template: `
    <profile-photo />
    <button>Upload a new profile photo</button>`,
  ...,
})
export class UserProfile { }
</docs-code>

**O Angular corresponde seletores estaticamente em tempo de compilação**. Alterar o DOM em tempo de execução, seja via
bindings do Angular ou com APIs do DOM, não afeta os components renderizados.

**Um elemento pode corresponder exatamente a um seletor de component.** Se múltiplos seletores de component corresponderem a um
único elemento, o Angular reporta um erro.

**Seletores de components são case-sensitive.**

## Tipos de seletores

O Angular suporta um subconjunto limitado
de [tipos básicos de seletor CSS](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors) em
seletores de components:

| **Tipo de seletor**       | **Descrição**                                                                                                             | **Exemplos**                  |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| Type selector             | Corresponde elementos baseado em seu nome de tag HTML, ou nome de nó.                                                     | `profile-photo`               |
| Attribute selector        | Corresponde elementos baseado na presença de um atributo HTML e, opcionalmente, um valor exato para aquele atributo.      | `[dropzone]` `[type="reset"]` |
| Class selector            | Corresponde elementos baseado na presença de uma classe CSS.                                                              | `.menu-item`                  |

Para valores de atributo, o Angular suporta correspondência de um valor de atributo exato com o operador igual (`=`).
O Angular não suporta outros operadores de valor de atributo.

Seletores de components do Angular não suportam combinadores, incluindo
o [combinador descendente](https://developer.mozilla.org/docs/Web/CSS/Descendant_combinator)
ou [combinador filho](https://developer.mozilla.org/docs/Web/CSS/Child_combinator).

Seletores de components do Angular não suportam
especificar [namespaces](https://developer.mozilla.org/docs/Web/SVG/Namespaces_Crash_Course).

### A pseudo-classe `:not`

O Angular suporta [a pseudo-classe `:not`](https://developer.mozilla.org/docs/Web/CSS/:not).
Você pode anexar esta pseudo-classe a qualquer outro seletor para restringir quais elementos o
seletor de um component corresponde. Por exemplo, você poderia definir um seletor de atributo `[dropzone]` e prevenir
correspondência com elementos `textarea`:

<docs-code language="angular-ts" highlight="[2]">
@Component({
  selector: '[dropzone]:not(textarea)',
  ...
})
export class DropZone { }
</docs-code>

O Angular não suporta nenhuma outra pseudo-classe ou pseudo-elemento em seletores de components.

### Combinando seletores

Você pode combinar múltiplos seletores concatenando-os. Por exemplo, você pode corresponder elementos `<button>`
que especificam `type="reset"`:

<docs-code language="angular-ts" highlight="[2]">
@Component({
  selector: 'button[type="reset"]',
  ...
})
export class ResetButton { }
</docs-code>

Você também pode definir múltiplos seletores com uma lista separada por vírgulas:

<docs-code language="angular-ts" highlight="[2]">
@Component({
  selector: 'drop-zone, [dropzone]',
  ...
})
export class DropZone { }
</docs-code>

O Angular cria um component para cada elemento que corresponde a _qualquer_ um dos seletores na lista.

## Escolhendo um seletor

A grande maioria dos components deve usar um nome de elemento personalizado como seu seletor. Todos os nomes de
elementos personalizados devem incluir um hífen conforme descrito
pela [especificação HTML](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name).
Por padrão, o Angular reporta um erro se encontrar um nome de tag personalizado que não corresponde a nenhum
component disponível, prevenindo bugs devido a nomes de components digitados incorretamente.

Veja [Configuração avançada de components](guide/components/advanced-configuration) para detalhes sobre
usar [custom elements nativos](https://developer.mozilla.org/docs/Web/Web_Components) em
templates Angular.

### Prefixos de seletor

O time do Angular recomenda usar um prefixo curto e consistente para todos os components personalizados
definidos dentro do seu projeto. Por exemplo, se você fosse construir o YouTube com Angular, você poderia
prefixar seus components com `yt-`, com components como `yt-menu`, `yt-player`, etc. Nomear
seus seletores dessa forma deixa imediatamente claro de onde um component particular vem. Por
padrão, o Angular CLI usa `app-`.

IMPORTANT: O Angular usa o prefixo de seletor `ng` para suas próprias APIs do framework. Nunca use `ng` como prefixo de seletor para seus próprios components personalizados.

### Quando usar um attribute selector

Você deve considerar um attribute selector quando quiser criar um component em um elemento
nativo padrão. Por exemplo, se você quiser criar um component de botão personalizado, você pode aproveitar o
elemento `<button>` padrão usando um attribute selector:

<docs-code language="angular-ts" highlight="[2]">
@Component({
  selector: 'button[yt-upload]',
   ...
})
export class YouTubeUploadButton { }
</docs-code>

Esta abordagem permite que consumidores do component usem diretamente todas as APIs padrão do elemento
sem trabalho extra. Isso é especialmente valioso para atributos ARIA como `aria-label`.

O Angular não reporta erros quando encontra atributos personalizados que não correspondem a um
component disponível. Ao usar components com attribute selectors, consumidores podem esquecer de importar o
component ou seu NgModule, resultando em o component não renderizar.
Veja [Importando e usando components](guide/components/importing) para mais informações.

Components que definem attribute selectors devem usar atributos em minúsculas, separados por hífen (dash-case). Você pode
seguir a mesma recomendação de prefixação descrita acima.
