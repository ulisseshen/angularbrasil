<!-- ia-translate: true -->
# Fazer merge das traduções na aplicação

Para fazer merge das traduções concluídas no seu projeto, complete as seguintes ações

1. Use o [Angular CLI][CliMain] para construir uma cópia dos arquivos distribuíveis do seu projeto
1. Use a opção `"localize"` para substituir todas as mensagens i18n pelas traduções válidas e construir uma variante de aplicação localizada.
   Uma variante de aplicação é uma cópia completa dos arquivos distribuíveis da sua aplicação traduzida para um único locale.

Após fazer merge das traduções, sirva cada cópia distribuível da aplicação usando detecção de idioma do lado do servidor ou diferentes subdiretórios.

HELPFUL: Para mais informações sobre como servir cada cópia distribuível da aplicação, veja [deploying multiple locales](guide/i18n/deploy).

Para uma tradução em tempo de compilação da aplicação, o processo de build usa compilação ahead-of-time (AOT) para produzir uma aplicação pequena, rápida e pronta para rodar.

HELPFUL: Para uma explicação detalhada do processo de build, veja [Building and serving Angular apps][GuideBuild].
O processo de build funciona para arquivos de tradução no formato `.xlf` ou em outro formato que o Angular entende, como `.xtb`.
Para mais informações sobre formatos de arquivos de tradução usados pelo Angular, veja [Change the source language file format][GuideI18nCommonTranslationFilesChangeTheSourceLanguageFileFormat]

Para construir uma cópia distribuível separada da aplicação para cada locale, [defina os locales na configuração de build][GuideI18nCommonMergeDefineLocalesInTheBuildConfiguration] no arquivo de configuração de build do workspace [`angular.json`][GuideWorkspaceConfig] do seu projeto.

Este método encurta o processo de build removendo a necessidade de realizar um build completo da aplicação para cada locale.

Para [gerar variantes de aplicação para cada locale][GuideI18nCommonMergeGenerateApplicationVariantsForEachLocale], use a opção `"localize"` no arquivo de configuração de build do workspace [`angular.json`][GuideWorkspaceConfig].
Além disso, para [fazer build a partir da linha de comando][GuideI18nCommonMergeBuildFromTheCommandLine], use o comando [`build`][CliBuild] do [Angular CLI][CliMain] com a opção `--localize`.

HELPFUL: Opcionalmente, [aplique opções de build específicas para apenas um locale][GuideI18nCommonMergeApplySpecificBuildOptionsForJustOneLocale] para uma configuração de locale personalizada.

## Definir locales na configuração de build

Use a opção de projeto `i18n` no arquivo de configuração de build do workspace [`angular.json`][GuideWorkspaceConfig] do seu projeto para definir locales para um projeto.

As seguintes sub-opções identificam o idioma de origem e informam ao compilador onde encontrar as traduções suportadas para o projeto.

| Sub-opção      | Detalhes                                                                               |
| :------------- | :------------------------------------------------------------------------------------- |
| `sourceLocale` | O locale que você usa dentro do código-fonte da aplicação \(`en-US` por padrão\)      |
| `locales`      | Um mapa de identificadores de locale para arquivos de tradução                         |

### Exemplo de `angular.json` para `en-US` e `fr`

Por exemplo, o seguinte trecho de um arquivo de configuração de build do workspace [`angular.json`][GuideWorkspaceConfig] define o locale de origem como `en-US` e fornece o caminho para o arquivo de tradução do locale francês \(`fr`\).

<docs-code header="angular.json" path="adev/src/content/examples/i18n/angular.json" visibleRegion="locale-config"/>

## Gerar variantes de aplicação para cada locale

Para usar sua definição de locale na configuração de build, use a opção `"localize"` no arquivo de configuração de build do workspace [`angular.json`][GuideWorkspaceConfig] para informar ao CLI quais locales gerar para a configuração de build.

- Defina `"localize"` como `true` para todos os locales previamente definidos na configuração de build.
- Defina `"localize"` como um array de um subconjunto dos identificadores de locale previamente definidos para construir apenas essas versões de locale.
- Defina `"localize"` como `false` para desabilitar a localização e não gerar nenhuma versão específica de locale.

HELPFUL: A compilação ahead-of-time (AOT) é necessária para localizar templates de component.

Se você alterou esta configuração, defina `"aot"` como `true` para usar AOT.

HELPFUL: Devido às complexidades de deployment do i18n e à necessidade de minimizar o tempo de rebuild, o servidor de desenvolvimento suporta apenas a localização de um único locale por vez.
Se você definir a opção `"localize"` como `true`, definir mais de um locale e usar `ng serve`; então ocorrerá um erro.
Se você quiser desenvolver para um locale específico, defina a opção `"localize"` para um locale específico.
Por exemplo, para francês \(`fr`\), especifique `"localize": ["fr"]`.

O CLI carrega e registra os dados do locale, coloca cada versão gerada em um diretório específico de locale para mantê-la separada de outras versões de locale, e coloca os diretórios dentro do `outputPath` configurado para o projeto.
Para cada variante de aplicação, o atributo `lang` do elemento `html` é definido como o locale.
O CLI também ajusta o HREF base HTML para cada versão da aplicação adicionando o locale ao `baseHref` configurado.

Defina a propriedade `"localize"` como uma configuração compartilhada para herdar efetivamente para todas as configurações.
Além disso, defina a propriedade para sobrescrever outras configurações.

### Exemplo de `angular.json` incluindo todos os locales do build

O seguinte exemplo exibe a opção `"localize"` definida como `true` no arquivo de configuração de build do workspace [`angular.json`][GuideWorkspaceConfig], para que todos os locales definidos na configuração de build sejam construídos.

<docs-code header="angular.json" path="adev/src/content/examples/i18n/angular.json" visibleRegion="build-localize-true"/>

## Fazer build a partir da linha de comando

Além disso, use a opção `--localize` com o comando [`ng build`][CliBuild] e sua configuração `production` existente.
O CLI constrói todos os locales definidos na configuração de build.
Se você definir os locales na configuração de build, é semelhante a quando você define a opção `"localize"` como `true`.

HELPFUL: Para mais informações sobre como definir os locales, veja [Generate application variants for each locale][GuideI18nCommonMergeGenerateApplicationVariantsForEachLocale].

<docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" visibleRegion="build-localize"/>

## Aplicar opções de build específicas para apenas um locale

Para aplicar opções de build específicas a apenas um locale, especifique um único locale para criar uma configuração personalizada específica de locale.

IMPORTANT: Use o servidor de desenvolvimento do [Angular CLI][CliMain] \(`ng serve`\) com apenas um único locale.

### Exemplo de build para francês

O seguinte exemplo exibe uma configuração personalizada específica de locale usando um único locale.

<docs-code header="angular.json" path="adev/src/content/examples/i18n/angular.json" visibleRegion="build-single-locale"/>

Passe esta configuração para os comandos `ng serve` ou `ng build`.
O seguinte exemplo de código exibe como servir o arquivo de idioma francês.

<docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" visibleRegion="serve-french"/>

Para builds de produção, use composição de configuração para executar ambas as configurações.

<docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" visibleRegion="build-production-french"/>

<docs-code header="angular.json" path="adev/src/content/examples/i18n/angular.json" visibleRegion="build-production-french" />

## Reportar traduções ausentes

Quando uma tradução está ausente, o build é bem-sucedido mas gera um aviso como `Missing translation for message "{translation_text}"`.
Para configurar o nível de aviso que é gerado pelo compilador Angular, especifique um dos seguintes níveis.

| Nível de aviso | Detalhes                                            | Saída                                                  |
| :------------- | :-------------------------------------------------- | :----------------------------------------------------- |
| `error`        | Lança um erro e o build falha                       | n/a                                                    |
| `ignore`       | Não faz nada                                        | n/a                                                    |
| `warning`      | Exibe o aviso padrão no console ou shell            | `Missing translation for message "{translation_text}"` |

Especifique o nível de aviso na seção `options` para o target `build` do arquivo de configuração de build do workspace [`angular.json`][GuideWorkspaceConfig].

### Exemplo de aviso `error` no `angular.json`

O seguinte exemplo exibe como definir o nível de aviso como `error`.

<docs-code header="angular.json" path="adev/src/content/examples/i18n/angular.json" visibleRegion="missing-translation-error" />

HELPFUL: Quando você compila seu projeto Angular em uma aplicação Angular, as instâncias do atributo `i18n` são substituídas por instâncias da string de mensagem marcada [`$localize`][ApiLocalizeInitLocalize].
Isso significa que sua aplicação Angular é traduzida após a compilação.
Isso também significa que você pode criar versões localizadas da sua aplicação Angular sem recompilar todo o seu projeto Angular para cada locale.

Quando você traduz sua aplicação Angular, a _transformação de tradução_ substitui e reordena as partes \(strings estáticas e expressões\) da string literal do template com strings de uma coleção de traduções.
Para mais informações, veja [`$localize`][ApiLocalizeInitLocalize].

TLDR: Compile uma vez, depois traduza para cada locale.

## Próximos passos

<docs-pill-row>
  <docs-pill href="guide/i18n/deploy" title="Deploy multiple locales"/>
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
