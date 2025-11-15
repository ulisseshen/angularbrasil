<!-- ia-translate: true -->
# Referenciar locales por ID

O Angular usa o _identificador de locale_ Unicode \(Unicode locale ID\) para encontrar os dados corretos de locale para internacionalização de strings de texto.

<docs-callout title="Unicode locale ID">

- Um locale ID está em conformidade com a [especificação principal do Unicode Common Locale Data Repository (CLDR)][UnicodeCldrDevelopmentCoreSpecification].
  Para mais informações sobre locale IDs, veja [Identificadores de Idioma e Locale do Unicode][UnicodeCldrDevelopmentCoreSpecificationLocaleIDs].

- CLDR e Angular usam [tags BCP 47][RfcEditorInfoBcp47] como base para o locale ID

</docs-callout>

Um locale ID especifica o idioma, país e um código opcional para variantes ou subdivisões adicionais.
Um locale ID consiste do identificador de idioma, um caractere de hífen \(`-`\) e a extensão de locale.

<docs-code language="html">
{language_id}-{locale_extension}
</docs-code>

HELPFUL: Para traduzir com precisão seu projeto Angular, você deve decidir quais idiomas e locales você está mirando para internacionalização.

Muitos países compartilham o mesmo idioma, mas diferem no uso.
As diferenças incluem gramática, pontuação, formatos para moeda, números decimais, datas e assim por diante.

Para os exemplos neste guia, use os seguintes idiomas e locales.

| Idioma    | Locale               | Unicode locale ID |
| :-------- | :------------------- | :---------------- |
| Inglês    | Canadá               | `en-CA`           |
| Inglês    | Estados Unidos       | `en-US`           |
| Francês   | Canadá               | `fr-CA`           |
| Francês   | França               | `fr-FR`           |

O [repositório Angular][GithubAngularAngularTreeMasterPackagesCommonLocales] inclui locales comuns.

<docs-callout>
Para uma lista de códigos de idioma, veja [ISO 639-2](https://www.loc.gov/standards/iso639-2).
</docs-callout>

## Definir o locale ID de origem

Use o Angular CLI para definir o idioma de origem no qual você está escrevendo o template do component e o código.

Por padrão, o Angular usa `en-US` como o locale de origem do seu projeto.

Para alterar o locale de origem do seu projeto para o build, complete as seguintes ações.

1. Abra o arquivo de configuração do workspace [`angular.json`][GuideWorkspaceConfig].
2. Adicione ou modifique o campo `sourceLocale` dentro da seção `i18n`:

```json
{
  "projects": {
    "your-project": {
      "i18n": {
        "sourceLocale": "ca"  // Use your desired locale code
      }
    }
  }
}
```

## Próximos passos

<docs-pill-row>
  <docs-pill href="guide/i18n/format-data-locale" title="Formatar dados baseado no locale"/>
</docs-pill-row>

[GuideWorkspaceConfig]: reference/configs/workspace-config 'Angular workspace configuration | Angular'
[GithubAngularAngularTreeMasterPackagesCommonLocales]: https://github.com/angular/angular/tree/main/packages/common/locales 'angular/packages/common/locales | angular/angular | GitHub'
[RfcEditorInfoBcp47]: https://www.rfc-editor.org/info/bcp47 'BCP 47 | RFC Editor'
[UnicodeCldrDevelopmentCoreSpecification]: https://cldr.unicode.org/index/cldr-spec 'Core Specification | Unicode CLDR Project'
[UnicodeCldrDevelopmentCoreSpecificationLocaleID]: https://cldr.unicode.org/index/cldr-spec/picking-the-right-language-code 'Unicode Language and Locale Identifiers - Core Specification | Unicode CLDR Project'
