<!-- ia-translate: true -->
# Trabalhar com arquivos de tradução

Após preparar um component para tradução, use o comando [`extract-i18n`][CliExtractI18n] do [Angular CLI][CliMain] para extrair o texto marcado no component em um arquivo de _idioma de origem_.

O texto marcado inclui texto marcado com `i18n`, atributos marcados com `i18n-`_attribute_, e texto marcado com `$localize` conforme descrito em [Preparar component para tradução][GuideI18nCommonPrepare].

Complete os seguintes passos para criar e atualizar arquivos de tradução para o seu projeto.

1. [Extrair o arquivo de idioma de origem][GuideI18nCommonTranslationFilesExtractTheSourceLanguageFile].
   1. Opcionalmente, altere a localização, formato e nome.
1. Copie o arquivo de idioma de origem para [criar um arquivo de tradução para cada idioma][GuideI18nCommonTranslationFilesCreateATranslationFileForEachLanguage].
1. [Traduza cada arquivo de tradução][GuideI18nCommonTranslationFilesTranslateEachTranslationFile].
1. Traduza plurais e expressões alternativas separadamente.
   1. [Traduza plurais][GuideI18nCommonTranslationFilesTranslatePlurals].
   1. [Traduza expressões alternativas][GuideI18nCommonTranslationFilesTranslateAlternateExpressions].
   1. [Traduza expressões aninhadas][GuideI18nCommonTranslationFilesTranslateNestedExpressions].

## Extrair o arquivo de idioma de origem

Para extrair o arquivo de idioma de origem, complete as seguintes ações.

1. Abra uma janela de terminal.
1. Mude para o diretório raiz do seu projeto.
1. Execute o seguinte comando CLI.

<docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" visibleRegion="extract-i18n-default"/>

O comando `extract-i18n` cria um arquivo de idioma de origem chamado `messages.xlf` no diretório raiz do seu projeto.
Para mais informações sobre o XML Localization Interchange File Format \(XLIFF, versão 1.2\), veja [XLIFF][WikipediaWikiXliff].

Use as seguintes opções do comando [`extract-i18n`][CliExtractI18n] para alterar a localização, formato e nome do arquivo de idioma de origem.

| Opção do comando | Detalhes                                      |
| :--------------- | :-------------------------------------------- |
| `--format`       | Define o formato do arquivo de saída          |
| `--out-file`     | Define o nome do arquivo de saída             |
| `--output-path`  | Define o caminho do diretório de saída        |

### Alterar a localização do arquivo de idioma de origem

Para criar um arquivo no diretório `src/locale`, especifique o caminho de saída como uma opção.

#### Exemplo de `extract-i18n --output-path`

O exemplo a seguir especifica o caminho de saída como uma opção.

<docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" visibleRegion="extract-i18n-output-path"/>

### Alterar o formato do arquivo de idioma de origem

O comando `extract-i18n` cria arquivos nos seguintes formatos de tradução.

| Formato de tradução | Detalhes                                                                                                          | Extensão do arquivo |
| :------------------ | :---------------------------------------------------------------------------------------------------------------- | :------------------ |
| ARB                 | [Application Resource Bundle][GithubGoogleAppResourceBundleWikiApplicationresourcebundlespecification]           | `.arb`              |
| JSON                | [JavaScript Object Notation][JsonMain]                                                                            | `.json`             |
| XLIFF 1.2           | [XML Localization Interchange File Format, versão 1.2][OasisOpenDocsXliffXliffCoreXliffCoreHtml]                 | `.xlf`              |
| XLIFF 2             | [XML Localization Interchange File Format, versão 2][OasisOpenDocsXliffXliffCoreV20Cos01XliffCoreV20Cose01Html]  | `.xlf`              |
| XMB                 | [XML Message Bundle][UnicodeCldrDevelopmentDevelopmentProcessDesignProposalsXmb]                                  | `.xmb` \(`.xtb`\)   |

Especifique o formato de tradução explicitamente com a opção de comando `--format`.

HELPFUL: O formato XMB gera arquivos de idioma de origem `.xmb`, mas usa arquivos de tradução `.xtb`.

#### Exemplo de `extract-i18n --format`

O exemplo a seguir demonstra vários formatos de tradução.

<docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" visibleRegion="extract-i18n-formats"/>

### Alterar o nome do arquivo de idioma de origem

Para alterar o nome do arquivo de idioma de origem gerado pela ferramenta de extração, use a opção de comando `--out-file`.

#### Exemplo de `extract-i18n --out-file`

O exemplo a seguir demonstra como nomear o arquivo de saída.

<docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" visibleRegion="extract-i18n-out-file"/>

## Criar um arquivo de tradução para cada idioma

Para criar um arquivo de tradução para um locale ou idioma, complete as seguintes ações.

1. [Extraia o arquivo de idioma de origem][GuideI18nCommonTranslationFilesExtractTheSourceLanguageFile].
1. Faça uma cópia do arquivo de idioma de origem para criar um arquivo de _tradução_ para cada idioma.
1. Renomeie o arquivo de _tradução_ para adicionar o locale.

   <docs-code language="file">

   messages.xlf --> messages.{locale}.xlf

   </docs-code>

1. Crie um novo diretório na raiz do seu projeto chamado `locale`.

   <docs-code language="file">

   src/locale

   </docs-code>

1. Mova o arquivo de _tradução_ para o novo diretório.
1. Envie o arquivo de _tradução_ para o seu tradutor.
1. Repita os passos acima para cada idioma que você deseja adicionar à sua aplicação.

### Exemplo de `extract-i18n` para francês

Por exemplo, para criar um arquivo de tradução para francês, complete as seguintes ações.

1. Execute o comando `extract-i18n`.
1. Faça uma cópia do arquivo de idioma de origem `messages.xlf`.
1. Renomeie a cópia para `messages.fr.xlf` para a tradução do idioma francês \(`fr`\).
1. Mova o arquivo de tradução `fr` para o diretório `src/locale`.
1. Envie o arquivo de tradução `fr` para o tradutor.

## Traduzir cada arquivo de tradução

A menos que você seja fluente no idioma e tenha tempo para editar traduções, você provavelmente completará os seguintes passos.

1. Envie cada arquivo de tradução para um tradutor.
1. O tradutor usa um editor de arquivos XLIFF para completar as seguintes ações.
   1. Criar a tradução.
   1. Editar a tradução.

### Exemplo de processo de tradução para francês

Para demonstrar o processo, revise o arquivo `messages.fr.xlf` na [aplicação de exemplo de Internacionalização do Angular][GuideI18nExample]. A [aplicação de exemplo de Internacionalização do Angular][GuideI18nExample] inclui uma tradução para francês que você pode editar sem um editor XLIFF especial ou conhecimento de francês.

As seguintes ações descrevem o processo de tradução para francês.

1. Abra `messages.fr.xlf` e encontre o primeiro elemento `<trans-unit>`.
   Esta é uma _unidade de tradução_, também conhecida como _nó de texto_, que representa a tradução da tag de saudação `<h1>` que foi previamente marcada com o atributo `i18n`.

   <docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="translated-hello-before"/>

   O `id="introductionHeader"` é um [ID personalizado][GuideI18nOptionalManageMarkedText], mas sem o prefixo `@@` exigido no HTML de origem.

1. Duplique o elemento `<source>... </source>` no nó de texto, renomeie-o para `target`, e então substitua o conteúdo com o texto em francês.

   <docs-code header="src/locale/messages.fr.xlf (<trans-unit>, após tradução)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="translated-hello"/>

   Em uma tradução mais complexa, a informação e contexto nos [elementos de descrição e significado][GuideI18nCommonPrepareAddHelpfulDescriptionsAndMeanings] ajudam você a escolher as palavras certas para a tradução.

1. Traduza os outros nós de texto.
   O exemplo a seguir exibe a forma de traduzir.

<docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="translated-other-nodes"/>

IMPORTANT: Não altere os IDs das unidades de tradução.
Cada atributo `id` é gerado pelo Angular e depende do conteúdo do texto do component e do significado atribuído.

Se você alterar o texto ou o significado, então o atributo `id` muda.
Para mais informações sobre gerenciamento de atualizações de texto e IDs, veja [IDs personalizados][GuideI18nOptionalManageMarkedText].

## Traduzir plurais

Adicione ou remova casos de plural conforme necessário para cada idioma.

HELPFUL: Para regras de plural de idiomas, veja [regras de plural do CLDR][GithubUnicodeOrgCldrStagingChartsLatestSupplementalLanguagePluralRulesHtml].

### Exemplo de `plural` de `minute`

Para traduzir um `plural`, traduza os valores de correspondência do formato ICU.

- `just now`
- `one minute ago`
- `<x id="INTERPOLATION" equiv-text="{{minutes}}"/> minutes ago`

O exemplo a seguir exibe a forma de traduzir.

<docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="translated-plural"/>

## Traduzir expressões alternativas

O Angular também extrai expressões ICU `select` alternativas como unidades de tradução separadas.

### Exemplo de `select` de `gender`

O exemplo a seguir exibe uma expressão ICU `select` no template do component.

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/i18n/src/app/app.component.html" visibleRegion="i18n-select"/>

Neste exemplo, o Angular extrai a expressão em duas unidades de tradução.
A primeira contém o texto fora da cláusula `select`, e usa um placeholder para `select` \(`<x id="ICU">`\):

<docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="translate-select-1"/>

IMPORTANT: Quando você traduzir o texto, mova o placeholder se necessário, mas não o remova.
Se você remover o placeholder, a expressão ICU é removida da sua aplicação traduzida.

O exemplo a seguir exibe a segunda unidade de tradução que contém a cláusula `select`.

<docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="translate-select-2"/>

O exemplo a seguir exibe ambas as unidades de tradução após a tradução estar completa.

<docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="translated-select"/>

## Traduzir expressões aninhadas

O Angular trata uma expressão aninhada da mesma forma que uma expressão alternativa.
O Angular extrai a expressão em duas unidades de tradução.

### Exemplo de `plural` aninhado

O exemplo a seguir exibe a primeira unidade de tradução que contém o texto fora da expressão aninhada.

<docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="translate-nested-1"/>

O exemplo a seguir exibe a segunda unidade de tradução que contém a expressão aninhada completa.

<docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="translate-nested-2"/>

O exemplo a seguir exibe ambas as unidades de tradução após traduzir.

<docs-code header="src/locale/messages.fr.xlf (<trans-unit>)" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="translate-nested"/>

## Próximos passos

<docs-pill-row>
  <docs-pill href="guide/i18n/merge" title="Merge translations into the app"/>
</docs-pill-row>

[CliMain]: cli 'CLI Overview and Command Reference | Angular'
[CliExtractI18n]: cli/extract-i18n 'ng extract-i18n | CLI | Angular'
[GuideI18nCommonPrepare]: guide/i18n/prepare 'Prepare component for translation | Angular'
[GuideI18nCommonPrepareAddHelpfulDescriptionsAndMeanings]: guide/i18n/prepare#add-helpful-descriptions-and-meanings 'Add helpful descriptions and meanings - Prepare component for translation | Angular'
[GuideI18nCommonTranslationFilesCreateATranslationFileForEachLanguage]: guide/i18n/translation-files#create-a-translation-file-for-each-language 'Create a translation file for each language - Work with translation files | Angular'
[GuideI18nCommonTranslationFilesExtractTheSourceLanguageFile]: guide/i18n/translation-files#extract-the-source-language-file 'Extract the source language file - Work with translation files | Angular'
[GuideI18nCommonTranslationFilesTranslateAlternateExpressions]: guide/i18n/translation-files#translate-alternate-expressions 'Translate alternate expressions - Work with translation files | Angular'
[GuideI18nCommonTranslationFilesTranslateEachTranslationFile]: guide/i18n/translation-files#translate-each-translation-file 'Translate each translation file - Work with translation files | Angular'
[GuideI18nCommonTranslationFilesTranslateNestedExpressions]: guide/i18n/translation-files#translate-nested-expressions 'Translate nested expressions - Work with translation files | Angular'
[GuideI18nCommonTranslationFilesTranslatePlurals]: guide/i18n/translation-files#translate-plurals 'Translate plurals - Work with translation files | Angular'
[GuideI18nExample]: guide/i18n/example 'Example Angular Internationalization application | Angular'
[GuideI18nOptionalManageMarkedText]: guide/i18n/manage-marked-text 'Manage marked text with custom IDs | Angular'
[GithubGoogleAppResourceBundleWikiApplicationresourcebundlespecification]: https://github.com/google/app-resource-bundle/wiki/ApplicationResourceBundleSpecification 'ApplicationResourceBundleSpecification | google/app-resource-bundle | GitHub'
[GithubUnicodeOrgCldrStagingChartsLatestSupplementalLanguagePluralRulesHtml]: https://cldr.unicode.org/index/cldr-spec/plural-rules 'Language Plural Rules - CLDR Charts | Unicode | GitHub'
[JsonMain]: https://www.json.org 'Introducing JSON | JSON'
[OasisOpenDocsXliffXliffCoreXliffCoreHtml]: https://docs.oasis-open.org/xliff/v1.2/os/xliff-core.html 'XLIFF Version 1.2 Specification | Oasis Open Docs'
[OasisOpenDocsXliffXliffCoreV20Cos01XliffCoreV20Cose01Html]: http://docs.oasis-open.org/xliff/xliff-core/v2.0/cos01/xliff-core-v2.0-cos01.html 'XLIFF Version 2.0 | Oasis Open Docs'
[UnicodeCldrDevelopmentDevelopmentProcessDesignProposalsXmb]: http://cldr.unicode.org/development/development-process/design-proposals/xmb 'XMB | CLDR - Unicode Common Locale Data Repository | Unicode'
[WikipediaWikiXliff]: https://en.wikipedia.org/wiki/XLIFF 'XLIFF | Wikipedia'
