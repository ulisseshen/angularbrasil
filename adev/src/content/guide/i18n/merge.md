<!-- ia-translate: true -->
# Mesclar traduções na aplicação {#merge-translations-into-the-application}

Para mesclar as traduções concluídas no seu projeto, siga estas ações

1. Use o [Angular CLI][CliMain] para gerar o build de uma cópia dos arquivos distribuíveis do seu projeto
1. Use a opção `"localize"` para substituir todas as mensagens i18n pelas traduções válidas e gerar o build de uma aplicação de variante localizada.
   Uma aplicação de variante é uma cópia completa dos arquivos distribuíveis da sua aplicação, traduzida para um único locale.

Depois de mesclar as traduções, sirva cada cópia distribuível da aplicação usando detecção de idioma no servidor ou subdiretórios diferentes.

HELPFUL: Para mais informações sobre como servir cada cópia distribuível da aplicação, veja [fazer deploy de múltiplos locales](guide/i18n/deploy).

Para uma tradução em tempo de compilação da aplicação, o processo de build usa a compilação ahead-of-time (AOT) para produzir uma aplicação pequena, rápida e pronta para execução.

HELPFUL: Para uma explicação detalhada do processo de build, veja [Building and serving Angular apps][GuideBuild].
O processo de build funciona com arquivos de tradução no formato `.xlf` ou em outro formato que o Angular entenda, como `.xtb`.
Para mais informações sobre os formatos de arquivo de tradução usados pelo Angular, veja [Alterar o formato do arquivo de idioma de origem][GuideI18nCommonTranslationFilesChangeTheSourceLanguageFileFormat]

Para gerar o build de uma cópia distribuível separada da aplicação para cada locale, [defina os locales na configuração de build][GuideI18nCommonMergeDefineLocalesInTheBuildConfiguration] no arquivo de configuração de build do workspace [`angular.json`][GuideWorkspaceConfig] do seu projeto.

Esse método encurta o processo de build, eliminando a necessidade de executar um build completo da aplicação para cada locale.

Para [gerar variantes da aplicação para cada locale][GuideI18nCommonMergeGenerateApplicationVariantsForEachLocale], use a opção `"localize"` no arquivo de configuração de build do workspace [`angular.json`][GuideWorkspaceConfig].
Além disso, para [fazer o build pela linha de comando][GuideI18nCommonMergeBuildFromTheCommandLine], use o comando [`build`][CliBuild] do [Angular CLI][CliMain] com a opção `--localize`.

HELPFUL: Opcionalmente, [aplique opções de build específicas para apenas um locale][GuideI18nCommonMergeApplySpecificBuildOptionsForJustOneLocale] para uma configuração de locale personalizada.

## Definir locales na configuração de build {#define-locales-in-the-build-configuration}

Use a opção de projeto `i18n` no arquivo de configuração de build do workspace [`angular.json`][GuideWorkspaceConfig] do seu projeto para definir os locales de um projeto.

As seguintes sub-opções identificam o idioma de origem e informam ao compilador onde encontrar as traduções suportadas do projeto.

| Sub-opção      | Detalhes                                                                                                                                                                                                  |
| :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sourceLocale` | O locale que você usa dentro do código-fonte da aplicação (`en-US` por padrão). Também pode ser um objeto com as propriedades `code`, `baseHref` e `subPath`.                                              |
| `locales`      | Um mapa de identificadores de locale para arquivos de tradução. Cada entrada também pode ser um objeto com as propriedades `translation`, `baseHref` e `subPath`.                                         |

Para a lista completa de propriedades `i18n` e seus tipos, veja [opções de i18n][GuideWorkspaceConfigI18n].

### Exemplo de `angular.json` para `en-US` e `fr` {#angularjson-for-en-us-and-fr-example}

Por exemplo, o trecho a seguir de um arquivo de configuração de build do workspace [`angular.json`][GuideWorkspaceConfig] define o locale de origem como `en-US` e informa o caminho para o arquivo de tradução do locale francês (`fr`).

<docs-code header="angular.json" path="adev/src/content/examples/i18n/angular.json" region="locale-config"/>

## Gerar variantes da aplicação para cada locale {#generate-application-variants-for-each-locale}

Para usar a definição de locale na configuração de build, use a opção `"localize"` no arquivo de configuração de build do workspace [`angular.json`][GuideWorkspaceConfig] para informar ao CLI quais locales gerar para a configuração de build.

- Defina `"localize"` como `true` para todos os locales definidos anteriormente na configuração de build.
- Defina `"localize"` como um array com um subconjunto dos identificadores de locale definidos anteriormente para gerar o build somente dessas versões de locale.
- Defina `"localize"` como `false` para desabilitar a localização e não gerar nenhuma versão específica de locale.

HELPFUL: A compilação ahead-of-time (AOT) é necessária para localizar templates de components.

Se você alterou essa configuração, defina `"aot"` como `true` para usar a AOT.

HELPFUL: Devido às complexidades de deploy do i18n e à necessidade de minimizar o tempo de rebuild, o servidor de desenvolvimento suporta a localização de apenas um locale por vez.
Se você definir a opção `"localize"` como `true` ou como um array com mais de um locale e usar `ng serve`, o servidor de desenvolvimento registra um aviso e desabilita a localização.
Se você quiser desenvolver com um locale específico, defina a opção `"localize"` para esse locale.
Por exemplo, para o francês (`fr`), especifique `"localize": ["fr"]`.

O CLI carrega e registra os dados de locale, coloca cada versão gerada em um diretório específico do locale para mantê-la separada das outras versões e coloca os diretórios dentro do `outputPath` configurado para o projeto.
Para cada variante da aplicação, o atributo `lang` do elemento `html` é definido com o locale.
O CLI também ajusta o HREF base do HTML de cada versão da aplicação, adicionando o locale ao `baseHref` configurado.

Defina a propriedade `"localize"` como uma configuração compartilhada para herdá-la em todas as configurações.
Você também pode definir a propriedade para sobrescrever outras configurações.

### Exemplo de `angular.json` incluindo todos os locales do build {#angularjson-include-all-locales-from-build-example}

O exemplo a seguir mostra a opção `"localize"` definida como `true` no arquivo de configuração de build do workspace [`angular.json`][GuideWorkspaceConfig], de modo que todos os locales definidos na configuração de build sejam gerados.

<docs-code header="angular.json" path="adev/src/content/examples/i18n/angular.json" region="build-localize-true"/>

## Fazer o build pela linha de comando {#build-from-the-command-line}

Você também pode usar a opção `--localize` com o comando [`ng build`][CliBuild] e a sua configuração `production` existente.
O CLI gera o build de todos os locales definidos na configuração de build.
Se você definir os locales na configuração de build, o resultado é semelhante a definir a opção `"localize"` como `true`.

HELPFUL: Para mais informações sobre como definir os locales, veja [Gerar variantes da aplicação para cada locale][GuideI18nCommonMergeGenerateApplicationVariantsForEachLocale].

<docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" region="build-localize"/>

## Aplicar opções de build específicas para apenas um locale {#apply-specific-build-options-for-just-one-locale}

Para aplicar opções de build específicas a apenas um locale, especifique um único locale para criar uma configuração personalizada específica para esse locale.

IMPORTANT: Use o servidor de desenvolvimento do [Angular CLI][CliMain] (`ng serve`) somente com um único locale.

### Exemplo de build para francês {#build-for-french-example}

O exemplo a seguir mostra uma configuração personalizada específica de locale usando um único locale.

<docs-code header="angular.json" path="adev/src/content/examples/i18n/angular.json" region="build-single-locale"/>

Passe essa configuração para os comandos `ng serve` ou `ng build`.
O exemplo de código a seguir mostra como servir o arquivo de idioma francês.

<docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" region="serve-french"/>

Para builds de produção, use a composição de configurações para executar as duas configurações.

<docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" region="build-production-french"/>

<docs-code header="angular.json" path="adev/src/content/examples/i18n/angular.json" region="build-production-french" />

## Relatar traduções ausentes {#report-missing-translations}

Quando uma tradução está ausente, o build é concluído com sucesso, mas gera um aviso como `Missing translation for message "{translation_text}"`.
Para configurar o nível de aviso gerado pelo compilador do Angular, especifique um dos seguintes níveis.

| Nível de aviso | Detalhes                                              | Saída                                                  |
| :------------- | :---------------------------------------------------- | :----------------------------------------------------- |
| `error`        | Lança um erro e o build falha                         | n/a                                                    |
| `ignore`       | Não faz nada                                          | n/a                                                    |
| `warning`      | Exibe o aviso padrão no console ou no shell           | `Missing translation for message "{translation_text}"` |

Especifique o nível de aviso na seção `options` do target `build` do arquivo de configuração de build do workspace [`angular.json`][GuideWorkspaceConfig].

### Exemplo de aviso `error` no `angular.json` {#angularjson-error-warning-example}

O exemplo a seguir mostra como definir o nível de aviso como `error`.

<docs-code header="angular.json" path="adev/src/content/examples/i18n/angular.json" region="missing-translation-error" />

HELPFUL: Quando você compila seu projeto Angular em uma aplicação Angular, as instâncias do atributo `i18n` são substituídas por instâncias da tagged message string [`$localize`][ApiLocalizeInitLocalize].
Isso significa que a sua aplicação Angular é traduzida após a compilação.
Isso também significa que você pode criar versões localizadas da sua aplicação Angular sem recompilar todo o projeto para cada locale.

Quando você traduz sua aplicação Angular, a _transformação de tradução_ substitui e reordena as partes (strings estáticas e expressões) do template literal com strings de uma coleção de traduções.
Para mais informações, veja [`$localize`][ApiLocalizeInitLocalize].

TLDR: Compile uma vez e depois traduza para cada locale.

## Próximos passos {#whats-next}

<docs-pill-row>
  <docs-pill href="guide/i18n/deploy" title="Fazer deploy de múltiplos locales"/>
</docs-pill-row>

[ApiLocalizeInitLocalize]: api/localize/init/$localize '$localize | init - localize - API | Angular'
[CliMain]: cli 'CLI Overview and Command Reference | Angular'
[CliBuild]: cli/build 'ng build | CLI | Angular'
[GuideBuild]: tools/cli/build 'Building and serving Angular apps | Angular'
[GuideI18nCommonMergeApplySpecificBuildOptionsForJustOneLocale]: guide/i18n/merge#apply-specific-build-options-for-just-one-locale 'Apply specific build options for just one locale - Merge translations into the application | Angular'
[GuideI18nCommonMergeBuildFromTheCommandLine]: guide/i18n/merge#build-from-the-command-line 'Build from the command line - Merge translations into the application | Angular'
[GuideI18nCommonMergeDefineLocalesInTheBuildConfiguration]: guide/i18n/merge#define-locales-in-the-build-configuration 'Define locales in the build configuration - Merge translations into the application | Angular'
[GuideI18nCommonMergeGenerateApplicationVariantsForEachLocale]: guide/i18n/merge#generate-application-variants-for-each-locale 'Generate application variants for each locale - Merge translations into the application | Angular'
[GuideI18nCommonTranslationFilesChangeTheSourceLanguageFileFormat]: guide/i18n/translation-files#change-the-source-language-file-format 'Change the source language file format - Work with translation files | Angular'
[GuideWorkspaceConfig]: reference/configs/workspace-config 'Angular workspace configuration | Angular'
[GuideWorkspaceConfigI18n]: reference/configs/workspace-config#i18n-options 'i18n options - Angular workspace configuration | Angular'
