<!-- ia-translate: true -->
# Seletores de components

TIP: Este guia assume que você já leu o [Guia de Fundamentos](essentials). Leia-o primeiro se você é novo no Angular.

Todo component define um [seletor CSS](https://developer.mozilla.org/docs/Web/CSS/CSS_selectors) que determina como o component é usado:

```angular-ts {highlight: [2]}
@Component({
  selector: 'profile-photo',
  ...
})
export class ProfilePhoto { }
```

Você usa um component criando um elemento HTML correspondente nos templates de _outros_ components:

```angular-ts {highlight: [3]}
@Component({
  template: `
    <profile-photo />
    <button>Upload a new profile photo</button>`,
  ...,
})
export class UserProfile { }
```

**O Angular faz a correspondência dos seletores estaticamente, em tempo de compilação**. Alterar o DOM em tempo de execução, seja por meio de bindings do Angular ou com APIs do DOM, não afeta os components renderizados.

**Um elemento pode corresponder a exatamente um seletor de component.** Se múltiplos seletores de component corresponderem a um único elemento, o Angular reporta um erro.

**Seletores de components diferenciam maiúsculas de minúsculas.**

## Tipos de seletores {#types-of-selectors}

O Angular suporta um subconjunto limitado de [tipos básicos de seletores CSS](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors) em seletores de components:

| **Tipo de seletor** | **Descrição**                                                                                                   | **Exemplos**                  |
| ------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| Type selector       | Corresponde a elementos com base no nome da tag HTML, ou nome do nó.                                            | `profile-photo`               |
| Attribute selector  | Corresponde a elementos com base na presença de um atributo HTML e, opcionalmente, em um valor exato para esse atributo. | `[dropzone]` `[type="reset"]` |
| Class selector      | Corresponde a elementos com base na presença de uma classe CSS.                                                 | `.menu-item`                  |

Para valores de atributo, o Angular suporta a correspondência de um valor exato de atributo com o operador de igualdade (`=`). O Angular não suporta outros operadores de valor de atributo.

Seletores de components do Angular não suportam combinadores, incluindo o [combinador descendente](https://developer.mozilla.org/docs/Web/CSS/Descendant_combinator) ou o [combinador filho](https://developer.mozilla.org/docs/Web/CSS/Child_combinator).

Seletores de components do Angular não suportam especificar [namespaces](https://developer.mozilla.org/docs/Web/SVG/Namespaces_Crash_Course).

### A pseudo-classe `:not` {#the-not-pseudo-class}

O Angular suporta [a pseudo-classe `:not`](https://developer.mozilla.org/docs/Web/CSS/:not). Você pode anexar essa pseudo-classe a qualquer outro seletor para restringir quais elementos o seletor de um component corresponde. Por exemplo, você pode definir um seletor de atributo `[dropzone]` e impedir a correspondência com elementos `textarea`:

```angular-ts {highlight: [2]}
@Component({
  selector: '[dropzone]:not(textarea)',
  ...
})
export class DropZone { }
```

O Angular não suporta nenhuma outra pseudo-classe ou pseudo-elemento em seletores de components.

### Combinando seletores {#combining-selectors}

Você pode combinar múltiplos seletores concatenando-os. Por exemplo, você pode corresponder a elementos `<button>` que especificam `type="reset"`:

```angular-ts {highlight: [2]}
@Component({
  selector: 'button[type="reset"]',
  ...
})
export class ResetButton { }
```

Você também pode definir múltiplos seletores com uma lista separada por vírgulas:

```angular-ts {highlight: [2]}
@Component({
  selector: 'drop-zone, [dropzone]',
  ...
})
export class DropZone { }
```

O Angular cria um component para cada elemento que corresponde a _qualquer_ um dos seletores da lista.

## Escolhendo um seletor {#choosing-a-selector}

A grande maioria dos components deve usar um nome de elemento personalizado como seletor. Todos os nomes de elementos personalizados devem incluir um hífen, conforme descrito pela [especificação HTML](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name). Por padrão, o Angular reporta um erro se encontrar um nome de tag personalizado que não corresponda a nenhum component disponível, evitando bugs causados por nomes de components digitados incorretamente.

Veja [Configuração avançada de components](guide/components/advanced-configuration) para detalhes sobre como usar [custom elements nativos](https://developer.mozilla.org/docs/Web/Web_Components) em templates Angular.

### Prefixos de seletor {#selector-prefixes}

A equipe do Angular recomenda usar um prefixo curto e consistente para todos os components personalizados definidos dentro do seu projeto. Por exemplo, se você fosse construir o YouTube com Angular, poderia prefixar seus components com `yt-`, com components como `yt-menu`, `yt-player` etc. Nomear seus seletores dessa forma deixa imediatamente claro de onde um component específico vem. Por padrão, o Angular CLI usa `app-`.

IMPORTANT: O Angular usa o prefixo de seletor `ng` para as próprias APIs do framework. Nunca use `ng` como prefixo de seletor para seus próprios components personalizados.

### Quando usar um attribute selector {#when-to-use-an-attribute-selector}

Você deve considerar um attribute selector quando quiser criar um component sobre um elemento nativo padrão. Por exemplo, se você quiser criar um component de botão personalizado, pode aproveitar o elemento `<button>` padrão usando um attribute selector:

```angular-ts {highlight: [2]}
@Component({
  selector: 'button[yt-upload]',
   ...
})
export class YouTubeUploadButton { }
```

Essa abordagem permite que os consumidores do component usem diretamente todas as APIs padrão do elemento, sem trabalho extra. Isso é especialmente útil para atributos ARIA, como `aria-label`.

O Angular não reporta erros quando encontra atributos personalizados que não correspondem a um component disponível. Ao usar components com attribute selectors, os consumidores podem esquecer de importar o component ou o seu NgModule, fazendo com que o component não seja renderizado. Veja [Importando e usando components](guide/components#imports-in-the-component-decorator) para mais informações.

Components que definem attribute selectors devem usar atributos em minúsculas, no formato dash-case. Você pode seguir a mesma recomendação de prefixos descrita acima.
