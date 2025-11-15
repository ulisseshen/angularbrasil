<!-- ia-translate: true -->
# Importar variantes globais dos dados de locale

O [Angular CLI][CliMain] automaticamente inclui dados de locale se você executar o comando [`ng build`][CliBuild] com a opção `--localize`.

<!--todo: replace with docs-code -->

<docs-code language="shell">

ng build --localize

</docs-code>

HELPFUL: A instalação inicial do Angular já contém dados de locale para inglês nos Estados Unidos \(`en-US`\).
O [Angular CLI][CliMain] automaticamente inclui os dados de locale e define o valor `LOCALE_ID` quando você usa a opção `--localize` com o comando [`ng build`][CliBuild].

O pacote `@angular/common` no npm contém os arquivos de dados de locale.
Variantes globais dos dados de locale estão disponíveis em `@angular/common/locales/global`.

## Exemplo de `import` para francês

Por exemplo, você poderia importar as variantes globais para francês \(`fr`\) em `main.ts` onde você faz o bootstrap da aplicação.

<docs-code header="src/main.ts (import locale)" path="adev/src/content/examples/i18n/src/main.ts" visibleRegion="global-locale"/>

HELPFUL: Em uma aplicação `NgModules`, você importaria no seu `app.module`.

[CliMain]: cli 'CLI Overview and Command Reference | Angular'
[CliBuild]: cli/build 'ng build | CLI | Angular'
