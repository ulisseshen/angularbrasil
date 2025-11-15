<!-- ia-translate: true -->
# Preparar component para tradução

Para preparar seu projeto para tradução, complete as seguintes ações.

- Use o atributo `i18n` para marcar texto em templates de components
- Use o atributo `i18n-` para marcar strings de texto de atributos em templates de components
- Use a tagged message string `$localize` para marcar strings de texto no código do component

## Marcar texto no template do component

Em um template de component, os metadados i18n são o valor do atributo `i18n`.

<docs-code language="html">
<element i18n="{i18n_metadata}">{string_to_translate}</element>
</docs-code>

Use o atributo `i18n` para marcar uma mensagem de texto estática em seus templates de components para tradução.
Coloque-o em cada tag de elemento que contenha texto fixo que você deseja traduzir.

HELPFUL: O atributo `i18n` é um atributo personalizado que as ferramentas e compiladores do Angular reconhecem.

### Exemplo de `i18n`

A seguinte tag `<h1>` exibe uma saudação simples em inglês, "Hello i18n!".

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" visibleRegion="greeting"/>

Para marcar a saudação para tradução, adicione o atributo `i18n` à tag `<h1>`.

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" visibleRegion="i18n-attribute"/>

### Usando declaração condicional com `i18n`

A seguinte tag `<div>` exibirá texto traduzido como parte da `div` e `aria-label` baseado no status de alternância

<docs-code-multifile>
    <docs-code header="src/app/app.component.html" path="adev/src/content/examples/i18n/src/app/app.component.html"  visibleRegion="i18n-conditional"/>
    <docs-code header="src/app/app.component.ts" path="adev/src/content/examples/i18n/src/app/app.component.ts" visibleLines="[[14,21],[33,37]]"/>
</docs-code-multifile>

### Traduzir texto inline sem elemento HTML

Use o elemento `<ng-container>` para associar um comportamento de tradução para texto específico sem alterar a forma como o texto é exibido.

HELPFUL: Cada elemento HTML cria um novo elemento DOM.
Para evitar criar um novo elemento DOM, envolva o texto em um elemento `<ng-container>`.
O exemplo a seguir mostra o elemento `<ng-container>` transformado em um comentário HTML não exibido.

<docs-code path="adev/src/content/examples/i18n/src/app/app.component.html" visibleRegion="i18n-ng-container"/>

## Marcar atributos de elementos para traduções

Em um template de component, os metadados i18n são o valor do atributo `i18n-{attribute_name}`.

<docs-code language="html">
<element i18n-{attribute_name}="{i18n_metadata}" {attribute_name}="{attribute_value}" />
</docs-code>

Os atributos de elementos HTML incluem texto que deve ser traduzido junto com o resto do texto exibido no template do component.

Use `i18n-{attribute_name}` com qualquer atributo de qualquer elemento e substitua `{attribute_name}` pelo nome do atributo.
Use a seguinte sintaxe para atribuir um significado, descrição e ID personalizado.

<!--todo: replace with docs-code -->

<docs-code language="html">
i18n-{attribute_name}="{meaning}|{description}@@{id}"
</docs-code>

### Exemplo de `i18n-title`

Para traduzir o título de uma imagem, revise este exemplo.
O exemplo a seguir exibe uma imagem com um atributo `title`.

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" visibleRegion="i18n-title"/>

Para marcar o atributo title para tradução, complete a seguinte ação.

1. Adicione o atributo `i18n-title`

   O exemplo a seguir mostra como marcar o atributo `title` na tag `img` adicionando `i18n-title`.

   <docs-code header="src/app/app.component.html" path="adev/src/content/examples/i18n/src/app/app.component.html" visibleRegion="i18n-title-translate"/>

## Marcar texto no código do component

No código do component, o texto fonte de tradução e os metadados são cercados por caracteres de crase \(<code>&#96;</code>\).

Use a tagged message string [`$localize`][ApiLocalizeInitLocalize] para marcar uma string em seu código para tradução.

<!--todo: replace with docs-code -->

<docs-code language="typescript">
$localize`string_to_translate`;
</docs-code>

Os metadados i18n são cercados por caracteres de dois pontos \(`:`\) e precedem o texto fonte de tradução.

<!--todo: replace with docs-code -->

<docs-code language="typescript">
$localize`:{i18n_metadata}:string_to_translate`
</docs-code>

### Incluir texto interpolado

Inclua [interpolações](guide/templates/binding#render-dynamic-text-with-text-interpolation) em uma tagged message string [`$localize`][ApiLocalizeInitLocalize].

<!--todo: replace with docs-code -->

<docs-code language="typescript">
$localize`string_to_translate ${variable_name}`;
</docs-code>

### Nomear o placeholder de interpolação

<docs-code language="typescript">
$localize`string_to_translate ${variable_name}:placeholder_name:`;
</docs-code>

### Sintaxe condicional para traduções

<docs-code language="typescript">
return this.show ? $localize`Show Tabs` : $localize`Hide tabs`;
</docs-code>

## Metadados i18n para tradução

<!--todo: replace with docs-code -->

<docs-code language="html">
{meaning}|{description}@@{custom_id}
</docs-code>

Os seguintes parâmetros fornecem contexto e informações adicionais para reduzir confusão para seu tradutor.

| Parâmetro de metadados | Detalhes                                                             |
| :--------------------- | :------------------------------------------------------------------- |
| Custom ID              | Fornecer um identificador personalizado                             |
| Description            | Fornecer informação adicional ou contexto                            |
| Meaning                | Fornecer o significado ou intenção do texto dentro do contexto específico |

Para informações adicionais sobre custom IDs, veja [Gerenciar texto marcado com IDs personalizados][GuideI18nOptionalManageMarkedText].

### Adicionar descrições e significados úteis

Para traduzir uma mensagem de texto com precisão, forneça informação adicional ou contexto para o tradutor.

Adicione uma _descrição_ da mensagem de texto como o valor do atributo `i18n` ou tagged message string [`$localize`][ApiLocalizeInitLocalize].

O exemplo a seguir mostra o valor do atributo `i18n`.

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" visibleRegion="i18n-attribute-desc"/>

O exemplo a seguir mostra o valor da tagged message string [`$localize`][ApiLocalizeInitLocalize] com uma descrição.

<!--todo: replace with docs-code -->

<docs-code language="typescript">

$localize`:An introduction header for this sample:Hello i18n!`;

</docs-code>

O tradutor também pode precisar saber o significado ou intenção da mensagem de texto dentro deste contexto de aplicação particular, para traduzi-la da mesma forma que outro texto com o mesmo significado.
Inicie o valor do atributo `i18n` com o _significado_ e separe-o da _descrição_ com o caractere `|`: `{meaning}|{description}`.

#### Exemplo de `h1`

Por exemplo, você pode querer especificar que a tag `<h1>` é um cabeçalho do site que você precisa traduzido da mesma forma, seja usado como cabeçalho ou referenciado em outra seção de texto.

O exemplo a seguir mostra como especificar que a tag `<h1>` deve ser traduzida como um cabeçalho ou referenciada em outro lugar.

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" visibleRegion="i18n-attribute-meaning"/>

O resultado é que qualquer texto marcado com `site header`, como o _significado_, é traduzido exatamente da mesma forma.

O exemplo de código a seguir mostra o valor da tagged message string [`$localize`][ApiLocalizeInitLocalize] com um significado e uma descrição.

<!--todo: replace with docs-code -->

<docs-code language="typescript">

$localize`:site header|An introduction header for this sample:Hello i18n!`;

</docs-code>

<docs-callout title="Como os significados controlam a extração e mesclagem de texto">

A ferramenta de extração do Angular gera uma entrada de unidade de tradução para cada atributo `i18n` em um template.
A ferramenta de extração do Angular atribui a cada unidade de tradução um ID único baseado no _significado_ e _descrição_.

HELPFUL: Para mais informações sobre a ferramenta de extração do Angular, veja [Trabalhar com arquivos de tradução](guide/i18n/translation-files).

Os mesmos elementos de texto com _significados_ diferentes são extraídos com IDs diferentes.
Por exemplo, se a palavra "right" usa as seguintes duas definições em dois locais diferentes, a palavra é traduzida de forma diferente e mesclada de volta na aplicação como entradas de tradução diferentes.

- `correct` como em "you are right"
- `direction` como em "turn right"

Se os mesmos elementos de texto atenderem às seguintes condições, os elementos de texto são extraídos apenas uma vez e usam o mesmo ID.

- Mesmo significado ou definição
- Descrições diferentes

Essa única entrada de tradução é mesclada de volta na aplicação onde quer que os mesmos elementos de texto apareçam.

</docs-callout>

## Expressões ICU

Expressões ICU ajudam você a marcar texto alternativo em templates de components para atender condições.
Uma expressão ICU inclui uma propriedade do component, uma cláusula ICU e as declarações case cercadas por caracteres de chave de abertura \(`{`\) e chave de fechamento \(`}`\).

<!--todo: replace with docs-code -->

<docs-code language="html">

{ component_property, icu_clause, case_statements }

</docs-code>

A propriedade do component define a variável.
Uma cláusula ICU define o tipo de texto condicional.

| Cláusula ICU                                                         | Detalhes                                                                        |
| :------------------------------------------------------------------- | :------------------------------------------------------------------------------ |
| [`plural`][GuideI18nCommonPrepareMarkPlurals]                        | Marcar o uso de números no plural                                               |
| [`select`][GuideI18nCommonPrepareMarkAlternatesAndNestedExpressions] | Marcar escolhas para texto alternativo baseado em seus valores de string definidos |

Para simplificar a tradução, use cláusulas International Components for Unicode \(cláusulas ICU\) com expressões regulares.

HELPFUL: As cláusulas ICU aderem ao [Formato de Mensagem ICU][GithubUnicodeOrgIcuUserguideFormatParseMessages] especificado nas [regras de pluralização CLDR][UnicodeCldrIndexCldrSpecPluralRules].

### Marcar plurais

Idiomas diferentes têm regras de pluralização diferentes que aumentam a dificuldade da tradução.
Como outros locales expressam cardinalidade de forma diferente, você pode precisar definir categorias de pluralização que não se alinham com o inglês.
Use a cláusula `plural` para marcar expressões que podem não ser significativas se traduzidas palavra por palavra.

<!--todo: replace with docs-code -->

<docs-code language="html">

{ component_property, plural, pluralization_categories }

</docs-code>

Após a categoria de pluralização, insira o texto padrão \(inglês\) cercado por caracteres de chave de abertura \(`{`\) e chave de fechamento \(`}`\).

<!--todo: replace with docs-code -->

<docs-code language="html">

pluralization_category { }

</docs-code>

As seguintes categorias de pluralização estão disponíveis para o inglês e podem mudar com base no locale.

| Categoria de pluralização | Detalhes                    | Exemplo                    |
| :------------------------ | :-------------------------- | :------------------------- |
| `zero`                    | Quantidade é zero           | `=0 { }` <br /> `zero { }` |
| `one`                     | Quantidade é 1              | `=1 { }` <br /> `one { }`  |
| `two`                     | Quantidade é 2              | `=2 { }` <br /> `two { }`  |
| `few`                     | Quantidade é 2 ou mais      | `few { }`                  |
| `many`                    | Quantidade é um número grande | `many { }`               |
| `other`                   | A quantidade padrão         | `other { }`                |

Se nenhuma das categorias de pluralização corresponder, o Angular usa `other` para corresponder ao fallback padrão para uma categoria ausente.

<!--todo: replace with docs-code -->

<docs-code language="html">

other { default_quantity }

</docs-code>

HELPFUL: Para mais informações sobre categorias de pluralização, veja [Escolhendo nomes de categoria de plural][UnicodeCldrIndexCldrSpecPluralRulesTocChoosingPluralCategoryNames] no [CLDR - Unicode Common Locale Data Repository][UnicodeCldrMain].

<docs-callout header='Contexto: Locales podem não suportar algumas categorias de pluralização'>

Muitos locales não suportam algumas das categorias de pluralização.
O locale padrão \(`en-US`\) usa uma função `plural()` muito simples que não suporta a categoria de pluralização `few`.
Outro locale com uma função `plural()` simples é `es`.
O exemplo de código a seguir mostra a [função `plural()` en-US][GithubAngularAngularBlobEcffc3557fe1bff9718c01277498e877ca44588dPackagesCoreSrcI18nLocaleEnTsL14L18].

<docs-code path="adev/src/content/examples/i18n/doc-files/locale_plural_function.ts" class="no-box" hideCopy/>

A função `plural()` retorna apenas 1 \(`one`\) ou 5 \(`other`\).
A categoria `few` nunca corresponde.

</docs-callout>

#### Exemplo de `minutes`

Se você deseja exibir a seguinte frase em inglês, onde `x` é um número.

<!--todo: replace output docs-code with screen capture image --->

<docs-code language="html">

updated x minutes ago

</docs-code>

E você também deseja exibir as seguintes frases baseado na cardinalidade de `x`.

<!--todo: replace output docs-code with screen capture image --->

<docs-code language="html">

updated just now

</docs-code>

<!--todo: replace output docs-code with screen capture image --->

<docs-code language="html">

updated one minute ago

</docs-code>

Use marcação HTML e [interpolações](guide/templates/binding#render-dynamic-text-with-text-interpolation).
O exemplo de código a seguir mostra como usar a cláusula `plural` para expressar as três situações anteriores em um elemento `<span>`.

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/i18n/src/app/app.component.html" visibleRegion="i18n-plural"/>

Revise os seguintes detalhes no exemplo de código anterior.

| Parâmetros                        | Detalhes                                                                                                                  |
| :-------------------------------- | :------------------------------------------------------------------------------------------------------------------------ |
| `minutes`                         | O primeiro parâmetro especifica que a propriedade do component é `minutes` e determina o número de minutos.               |
| `plural`                          | O segundo parâmetro especifica que a cláusula ICU é `plural`.                                                             |
| `=0 {just now}`                   | Para zero minutos, a categoria de pluralização é `=0`. O valor é `just now`.                                              |
| `=1 {one minute}`                 | Para um minuto, a categoria de pluralização é `=1`. O valor é `one minute`.                                               |
| `other {{{minutes}} minutes ago}` | Para qualquer cardinalidade sem correspondência, a categoria de pluralização padrão é `other`. O valor é `{{minutes}} minutes ago`. |

`{{minutes}}` é uma [interpolação](guide/templates/binding#render-dynamic-text-with-text-interpolation).

### Marcar alternativas e expressões aninhadas

A cláusula `select` marca escolhas para texto alternativo baseado em seus valores de string definidos.

<!--todo: replace with docs-code -->

<docs-code language="html">

{ component_property, select, selection_categories }

</docs-code>

Traduza todas as alternativas para exibir texto alternativo baseado no valor de uma variável.

Após a categoria de seleção, insira o texto \(inglês\) cercado por caracteres de chave de abertura \(`{`\) e chave de fechamento \(`}`\).

<!--todo: replace with docs-code -->

<docs-code language="html">

selection_category { text }

</docs-code>

Locales diferentes têm construções gramaticais diferentes que aumentam a dificuldade da tradução.
Use marcação HTML.
Se nenhuma das categorias de seleção corresponder, o Angular usa `other` para corresponder ao fallback padrão para uma categoria ausente.

<!--todo: replace with docs-code -->

<docs-code language="html">

other { default_value }

</docs-code>

#### Exemplo de `gender`

Se você deseja exibir a seguinte frase em inglês.

<!--todo: replace output docs-code with screen capture image --->

<docs-code language="html">

The author is other

</docs-code>

E você também deseja exibir as seguintes frases baseado na propriedade `gender` do component.

<!--todo: replace output docs-code with screen capture image --->

<docs-code language="html">

The author is female

</docs-code>

<!--todo: replace output docs-code with screen capture image --->

<docs-code language="html">

The author is male

</docs-code>

O exemplo de código a seguir mostra como vincular a propriedade `gender` do component e usar a cláusula `select` para expressar as três situações anteriores em um elemento `<span>`.

A propriedade `gender` vincula as saídas a cada um dos seguintes valores de string.

| Valor  | Valor em inglês |
| :----- | :-------------- |
| female | `female`        |
| male   | `male`          |
| other  | `other`         |

A cláusula `select` mapeia os valores para as traduções apropriadas.
O exemplo de código a seguir mostra a propriedade `gender` usada com a cláusula select.

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/i18n/src/app/app.component.html" visibleRegion="i18n-select"/>

#### Exemplo de `gender` e `minutes`

Combine cláusulas diferentes juntas, como as cláusulas `plural` e `select`.
O exemplo de código a seguir mostra cláusulas aninhadas baseadas nos exemplos `gender` e `minutes`.

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/i18n/src/app/app.component.html" visibleRegion="i18n-nested"/>

## Próximos passos

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
[UnicodeCldrIndexCldrSpecPluralRules]: http://cldr.unicode.org/index/cldr-spec/plural-rules 'Plural Rules | CLDR - Unicode Common Locale Data Repository | Unicode'
[UnicodeCldrIndexCldrSpecPluralRulesTocChoosingPluralCategoryNames]: http://cldr.unicode.org/index/cldr-spec/plural-rules#TOC-Choosing-Plural-Category-Names 'Choosing Plural Category Names - Plural Rules | CLDR - Unicode Common Locale Data Repository | Unicode'
