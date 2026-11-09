<!-- ia-translate: true -->
# Preparar component para tradução {#prepare-component-for-translation}

Para preparar seu projeto para tradução, siga estas ações.

- Use o atributo `i18n` para marcar texto em templates de components
- Use o atributo `i18n-` para marcar strings de texto de atributos em templates de components
- Use a tagged message string `$localize` para marcar strings de texto no código do component

## Marcar texto no template do component {#mark-text-in-component-template}

Em um template de component, os metadados i18n são o valor do atributo `i18n`.

```html
<element i18n="{i18n_metadata}">{string_to_translate}</element>
```

Use o atributo `i18n` para marcar uma mensagem de texto estática nos templates dos seus components para tradução.
Coloque-o em cada tag de elemento que contenha texto fixo que você deseja traduzir.

HELPFUL: O atributo `i18n` é um atributo personalizado que as ferramentas e os compiladores do Angular reconhecem.

### Exemplo de `i18n` {#i18n-example}

A tag `<h1>` a seguir exibe uma saudação simples em inglês, "Hello i18n!".

<docs-code header="app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" region="greeting"/>

Para marcar a saudação para tradução, adicione o atributo `i18n` à tag `<h1>`.

<docs-code header="app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" region="i18n-attribute"/>

### Usando instrução condicional com `i18n` {#using-conditional-statement-with-i18n}

A tag `<div>` a seguir exibirá texto traduzido como parte da `div` e do `aria-label`, com base no status do toggle

<docs-code-multifile>
    <docs-code header="app.component.html" path="adev/src/content/examples/i18n/src/app/app.component.html"  region="i18n-conditional"/>
    <docs-code header="app.component.ts" path="adev/src/content/examples/i18n/src/app/app.component.ts" visibleLines="[[13,18],[32,34]]"/>
</docs-code-multifile>

### Traduzir texto inline sem elemento HTML {#translate-inline-text-without-html-element}

Use o elemento `<ng-container>` para associar um comportamento de tradução a um texto específico sem alterar a forma como o texto é exibido.

HELPFUL: Cada elemento HTML cria um novo elemento DOM.
Para evitar criar um novo elemento DOM, envolva o texto em um elemento `<ng-container>`.
O exemplo a seguir mostra o elemento `<ng-container>` transformado em um comentário HTML não exibido.

<docs-code path="adev/src/content/examples/i18n/src/app/app.component.html" region="i18n-ng-container"/>

### Nomear o placeholder de interpolação {#name-the-interpolation-placeholder}

Por padrão, o Angular gera um nome de placeholder para cada interpolação em uma mensagem traduzida. Para dar a ele um nome significativo que ajude os tradutores a entender o contexto, adicione um comentário `//i18n(ph="name")` dentro da interpolação.

```html
<element i18n>{{ expression //i18n(ph="placeholder_name") }}</element>
```

Por exemplo:

```html
<p i18n>Hello, {{ username //i18n(ph="name") }}!</p>
```

Isso é o equivalente, no template, de nomear um placeholder no código do component com [`$localize`][ApiLocalizeInitLocalize]:

```ts
$localize`Hello, ${username}:name:!`;
```

## Marcar atributos de elementos para tradução {#mark-element-attributes-for-translations}

Em um template de component, os metadados i18n são o valor do atributo `i18n-{attribute_name}`.

```html
<element i18n-{attribute_name}="{i18n_metadata}" {attribute_name}="{attribute_value}" />
```

Os atributos dos elementos HTML incluem textos que devem ser traduzidos junto com o restante do texto exibido no template do component.

Use `i18n-{attribute_name}` com qualquer atributo de qualquer elemento e substitua `{attribute_name}` pelo nome do atributo.
Use a seguinte sintaxe para atribuir um significado, uma descrição e um ID personalizado.

```html
i18n-{attribute_name}="{meaning}|{description}@@{id}"
```

### Exemplo de `i18n-title` {#i18n-title-example}

Para traduzir o título de uma imagem, veja este exemplo.
O exemplo a seguir exibe uma imagem com um atributo `title`.

<docs-code header="app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" region="i18n-title"/>

Para marcar o atributo title para tradução, siga esta ação.

Adicione o atributo `i18n-title`

O exemplo a seguir mostra como marcar o atributo `title` na tag `img` adicionando `i18n-title`.

<docs-code header="app.component.html" path="adev/src/content/examples/i18n/src/app/app.component.html" region="i18n-title-translate"/>

## Marcar texto no código do component {#mark-text-in-component-code}

No código do component, o texto de origem da tradução e os metadados ficam entre caracteres de crase \(<code>&#96;</code>\).

Use a [`$localize`][ApiLocalizeInitLocalize] tagged message string para marcar uma string no seu código para tradução.

```ts
$localize`string_to_translate`;
```

Os metadados i18n ficam entre caracteres de dois-pontos \(`:`\) e precedem o texto de origem da tradução.

```ts
$localize`:{i18n_metadata}:string_to_translate`;
```

### Incluir texto interpolado {#include-interpolated-text}

Inclua [interpolações](guide/templates/binding#render-dynamic-text-with-text-interpolation) em uma [`$localize`][ApiLocalizeInitLocalize] tagged message string.

```ts
$localize`string_to_translate ${variable_name}`;
```

### Nomear o placeholder de interpolação {#name-the-interpolation-placeholder-in-code}

```ts
$localize`string_to_translate ${variable_name}:placeholder_name:`;
```

### Sintaxe condicional para traduções {#conditional-syntax-for-translations}

```ts
return this.show ? $localize`Show Tabs` : $localize`Hide tabs`;
```

## Metadados i18n para tradução {#i18n-metadata-for-translation}

```html
{meaning}|{description}@@{custom_id}
```

Os seguintes parâmetros fornecem contexto e informações adicionais para reduzir a confusão do seu tradutor.

| Parâmetro de metadados | Detalhes                                                                  |
| :--------------------- | :------------------------------------------------------------------------ |
| Custom ID              | Fornece um identificador personalizado                                    |
| Description            | Fornece informações adicionais ou contexto                                |
| Meaning                | Fornece o significado ou a intenção do texto dentro do contexto específico |

Para informações adicionais sobre custom IDs, veja [Gerenciar texto marcado com IDs personalizados][GuideI18nOptionalManageMarkedText].

### Adicionar descrições e significados úteis {#add-helpful-descriptions-and-meanings}

Para traduzir uma mensagem de texto com precisão, forneça informações adicionais ou contexto para o tradutor.

Adicione uma _descrição_ da mensagem de texto como valor do atributo `i18n` ou da tagged message string [`$localize`][ApiLocalizeInitLocalize].

O exemplo a seguir mostra o valor do atributo `i18n`.

<docs-code header="app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" region="i18n-attribute-desc"/>

O exemplo a seguir mostra o valor da tagged message string [`$localize`][ApiLocalizeInitLocalize] com uma descrição.

```ts
$localize`:An introduction header for this sample:Hello i18n!`;
```

O tradutor também pode precisar saber o significado ou a intenção da mensagem de texto neste contexto específico da aplicação, para traduzi-la da mesma forma que outros textos com o mesmo significado.
Comece o valor do atributo `i18n` com o _significado_ e separe-o da _descrição_ com o caractere `|`: `{meaning}|{description}`.

#### Exemplo de `h1` {#h1-example}

Por exemplo, você pode querer especificar que a tag `<h1>` é um cabeçalho do site que precisa ser traduzido da mesma forma, seja ele usado como cabeçalho ou referenciado em outra seção do texto.

O exemplo a seguir mostra como especificar que a tag `<h1>` deve ser traduzida como um cabeçalho ou referenciada em outro lugar.

<docs-code header="app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" region="i18n-attribute-meaning"/>

O resultado é que qualquer texto marcado com `site header` é traduzido exatamente da mesma forma, já que o _significado_ é o mesmo.

O exemplo de código a seguir mostra o valor da tagged message string [`$localize`][ApiLocalizeInitLocalize] com um significado e uma descrição.

```ts
$localize`:site header|An introduction header for this sample:Hello i18n!`;
```

<docs-callout title="Como os significados controlam a extração e a mesclagem de textos">

A ferramenta de extração do Angular gera uma entrada de unidade de tradução para cada atributo `i18n` em um template.
A ferramenta de extração do Angular atribui a cada unidade de tradução um ID único baseado no seu texto de origem e no _significado_. A _descrição_ não afeta o ID.

HELPFUL: Para mais informações sobre a ferramenta de extração do Angular, veja [Trabalhar com arquivos de tradução](guide/i18n/translation-files).

Os mesmos elementos de texto com _significados_ diferentes são extraídos com IDs diferentes.
Por exemplo, se a palavra "right" tiver as duas definições a seguir em dois locais diferentes, ela será traduzida de forma diferente e mesclada de volta na aplicação como entradas de tradução distintas.

- `correct` como em "you are right"
- `direction` como em "turn right"

Se os mesmos elementos de texto atenderem às seguintes condições, eles são extraídos apenas uma vez e usam o mesmo ID.

- Mesmo significado ou definição
- Descrições diferentes

Essa única entrada de tradução é mesclada de volta na aplicação onde quer que os mesmos elementos de texto apareçam.

</docs-callout>

## Expressões ICU {#icu-expressions}

As expressões ICU ajudam você a marcar texto alternativo nos templates dos components para atender a condições.
Uma expressão ICU inclui uma propriedade do component, uma cláusula ICU e as declarações de case, delimitadas pelos caracteres de chave de abertura \(`{`\) e chave de fechamento \(`}`\).

```html
{ component_property, icu_clause, case_statements }
```

A propriedade do component define a variável.
Uma cláusula ICU define o tipo de texto condicional.

| Cláusula ICU                                                         | Detalhes                                                                          |
| :------------------------------------------------------------------- | :-------------------------------------------------------------------------------- |
| [`plural`][GuideI18nCommonPrepareMarkPlurals]                        | Marca o uso de números no plural                                                  |
| [`select`][GuideI18nCommonPrepareMarkAlternatesAndNestedExpressions] | Marca as opções de texto alternativo com base nos valores de string definidos     |

Para simplificar a tradução, use as cláusulas International Components for Unicode \(cláusulas ICU\) com expressões regulares.

HELPFUL: As cláusulas ICU seguem o [Formato de Mensagem ICU][GithubUnicodeOrgIcuUserguideFormatParseMessages] especificado nas [regras de pluralização do CLDR][UnicodeCldrIndexCldrSpecPluralRules].

### Marcar plurais {#mark-plurals}

Idiomas diferentes têm regras de pluralização diferentes, o que aumenta a dificuldade da tradução.
Como outros locales expressam a cardinalidade de forma diferente, você pode precisar definir categorias de pluralização que não coincidam com as do inglês.
Use a cláusula `plural` para marcar expressões que podem não fazer sentido se traduzidas palavra por palavra.

```html
{ component_property, plural, pluralization_categories }
```

Após a categoria de pluralização, insira o texto padrão \(em inglês\) entre os caracteres de chave de abertura \(`{`\) e chave de fechamento \(`}`\).

```html
pluralization_category { }
```

As seguintes categorias de pluralização estão disponíveis para o inglês e podem mudar conforme o locale.

| Categoria de pluralização | Detalhes                           | Exemplo                    |
| :------------------------ | :--------------------------------- | :------------------------- |
| `zero`                    | A quantidade é zero                | `=0 { }` <br /> `zero { }` |
| `one`                     | A quantidade é 1                   | `=1 { }` <br /> `one { }`  |
| `two`                     | A quantidade é 2                   | `=2 { }` <br /> `two { }`  |
| `few`                     | A quantidade é 2 ou mais           | `few { }`                  |
| `many`                    | A quantidade é um número grande    | `many { }`                 |
| `other`                   | A quantidade padrão                | `other { }`                |

Se nenhuma das categorias de pluralização corresponder, o Angular usa `other` como fallback padrão para uma categoria ausente.

```html
other { default_quantity }
```

HELPFUL: Para mais informações sobre as categorias de pluralização, veja [Escolhendo nomes de categorias de plural][UnicodeCldrIndexCldrSpecPluralRulesTocChoosingPluralCategoryNames] no [CLDR - Unicode Common Locale Data Repository][UnicodeCldrMain].

<docs-callout title="Contexto: locales podem não suportar algumas categorias de pluralização">

Muitos locales não suportam algumas das categorias de pluralização.
O locale padrão \(`en-US`\) usa uma função `plural()` muito simples que não suporta a categoria de pluralização `few`.
Outro locale com uma função `plural()` simples é o `es`.
O exemplo de código a seguir mostra a [função `plural()` do en-US][GithubAngularAngularBlobEcffc3557fe1bff9718c01277498e877ca44588dPackagesCoreSrcI18nLocaleEnTsL14L18].

<docs-code path="adev/src/content/examples/i18n/doc-files/locale_plural_function.ts" class="no-box" hideCopy/>

A função `plural()` retorna apenas 1 \(`one`\) ou 5 \(`other`\).
A categoria `few` nunca corresponde.

</docs-callout>

#### Exemplo de `minutes` {#minutes-example}

Se você quiser exibir a seguinte frase em inglês, em que `x` é um número.

<!--todo: replace output docs-code with screen capture image --->

```html
updated x minutes ago
```

E você também quiser exibir as seguintes frases com base na cardinalidade de `x`.

<!--todo: replace output docs-code with screen capture image --->

```html
updated just now
```

<!--todo: replace output docs-code with screen capture image --->

```html
updated one minute ago
```

Use marcação HTML e [interpolações](guide/templates/binding#render-dynamic-text-with-text-interpolation).
O exemplo de código a seguir mostra como usar a cláusula `plural` para expressar as três situações anteriores em um elemento `<span>`.

<docs-code header="app.component.html" path="adev/src/content/examples/i18n/src/app/app.component.html" region="i18n-plural"/>

Revise os seguintes detalhes no exemplo de código anterior.

| Parâmetros                        | Detalhes                                                                                                                                  |
| :-------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| `minutes`                         | O primeiro parâmetro especifica que a propriedade do component é `minutes` e determina o número de minutos.                               |
| `plural`                          | O segundo parâmetro especifica que a cláusula ICU é `plural`.                                                                             |
| `=0 {just now}`                   | Para zero minutos, a categoria de pluralização é `=0`. O valor é `just now`.                                                              |
| `=1 {one minute}`                 | Para um minuto, a categoria de pluralização é `=1`. O valor é `one minute`.                                                               |
| `other {{{minutes}} minutes ago}` | Para qualquer cardinalidade sem correspondência, a categoria de pluralização padrão é `other`. O valor é `{{minutes}} minutes ago`.       |

`{{minutes}}` é uma [interpolação](guide/templates/binding#render-dynamic-text-with-text-interpolation).

### Marcar alternativas e expressões aninhadas {#mark-alternates-and-nested-expressions}

A cláusula `select` marca as opções de texto alternativo com base nos valores de string definidos.

```html
{ component_property, select, selection_categories }
```

Traduza todas as alternativas para exibir o texto alternativo com base no valor de uma variável.

Após a categoria de seleção, insira o texto \(em inglês\) entre os caracteres de chave de abertura \(`{`\) e chave de fechamento \(`}`\).

```html
selection_category { text }
```

Locales diferentes têm construções gramaticais diferentes, o que aumenta a dificuldade da tradução.
Use marcação HTML.
Se nenhuma das categorias de seleção corresponder, o Angular usa `other` como fallback padrão para uma categoria ausente.

```html
other { default_value }
```

#### Exemplo de `gender` {#gender-example}

Se você quiser exibir a seguinte frase em inglês.

<!--todo: replace output docs-code with screen capture image --->

```html
The author is other
```

E você também quiser exibir as seguintes frases com base na propriedade `gender` do component.

<!--todo: replace output docs-code with screen capture image --->

```html
The author is female
```

<!--todo: replace output docs-code with screen capture image --->

```html
The author is male
```

O exemplo de código a seguir mostra como vincular a propriedade `gender` do component e usar a cláusula `select` para expressar as três situações anteriores em um elemento `<span>`.

A propriedade `gender` vincula as saídas a cada um dos seguintes valores de string.

| Valor  | Valor em inglês |
| :----- | :-------------- |
| female | `female`        |
| male   | `male`          |
| other  | `other`         |

A cláusula `select` mapeia os valores para as traduções apropriadas.
O exemplo de código a seguir mostra a propriedade `gender` usada com a cláusula select.

<docs-code header="app.component.html" path="adev/src/content/examples/i18n/src/app/app.component.html" region="i18n-select"/>

#### Exemplo de `gender` e `minutes` {#gender-and-minutes-example}

Combine cláusulas diferentes, como as cláusulas `plural` e `select`.
O exemplo de código a seguir mostra cláusulas aninhadas com base nos exemplos de `gender` e `minutes`.

<docs-code header="app.component.html" path="adev/src/content/examples/i18n/src/app/app.component.html" region="i18n-nested"/>

## Próximos passos {#whats-next}

<docs-pill-row>
  <docs-pill href="guide/i18n/translation-files" title="Trabalhar com arquivos de tradução"/>
</docs-pill-row>

[ApiLocalizeInitLocalize]: api/localize/init/$localize '$localize | init - localize - API  | Angular'
[GuideI18nCommonPrepareMarkAlternatesAndNestedExpressions]: guide/i18n/prepare#mark-alternates-and-nested-expressions 'Mark alternates and nested expressions - Prepare templates for translation | Angular'
[GuideI18nCommonPrepareMarkPlurals]: guide/i18n/prepare#mark-plurals 'Mark plurals - Prepare component for translation | Angular'
[GuideI18nOptionalManageMarkedText]: guide/i18n/manage-marked-text 'Manage marked text with custom IDs | Angular'
[GithubAngularAngularBlobEcffc3557fe1bff9718c01277498e877ca44588dPackagesCoreSrcI18nLocaleEnTsL14L18]: https://github.com/angular/angular/blob/ecffc3557fe1bff9718c01277498e877ca44588d/packages/core/src/i18n/locale_en.ts#L14-L18 'Line 14 to 18 - angular/packages/core/src/i18n/locale_en.ts | angular/angular | GitHub'
[GithubUnicodeOrgIcuUserguideFormatParseMessages]: https://unicode-org.github.io/icu/userguide/format_parse/messages 'ICU Message Format - ICU Documentation | Unicode | GitHub'
[UnicodeCldrMain]: https://cldr.unicode.org 'Unicode CLDR Project'
[UnicodeCldrIndexCldrSpecPluralRules]: https://cldr.unicode.org/index/cldr-spec/plural-rules 'Plural Rules | CLDR - Unicode Common Locale Data Repository | Unicode'
[UnicodeCldrIndexCldrSpecPluralRulesTocChoosingPluralCategoryNames]: https://cldr.unicode.org/index/cldr-spec/plural-rules#TOC-Choosing-Plural-Category-Names 'Choosing Plural Category Names - Plural Rules | CLDR - Unicode Common Locale Data Repository | Unicode'
