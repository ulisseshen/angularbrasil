<!-- ia-translate: true -->
# Formatar dados baseado no locale

O Angular fornece os seguintes [pipes](guide/templates/pipes) de transformação de dados integrados.
Os pipes de transformação de dados usam o token [`LOCALE_ID`][ApiCoreLocaleId] para formatar dados baseado nas regras de cada locale.

| Pipe de transformação de dados          | Detalhes                                              |
| :-------------------------------------- | :---------------------------------------------------- |
| [`DatePipe`][ApiCommonDatepipe]         | Formata um valor de data.                             |
| [`CurrencyPipe`][ApiCommonCurrencypipe] | Transforma um número em uma string de moeda.          |
| [`DecimalPipe`][ApiCommonDecimalpipe]   | Transforma um número em uma string de número decimal. |
| [`PercentPipe`][ApiCommonPercentpipe]   | Transforma um número em uma string de porcentagem.    |

## Usar DatePipe para exibir a data atual

Para exibir a data atual no formato do locale atual, use o seguinte formato para o `DatePipe`.

<!--todo: replace with docs-code -->

<docs-code language="typescript">

{{ today | date }}

</docs-code>

## Sobrescrever o locale atual para CurrencyPipe

Adicione o parâmetro `locale` ao pipe para sobrescrever o valor atual do token `LOCALE_ID`.

Para forçar a moeda a usar Inglês Americano \(`en-US`\), use o seguinte formato para o `CurrencyPipe`

<!--todo: replace with docs-code -->

<docs-code language="typescript">

{{ amount | currency : 'en-US' }}

</docs-code>

HELPFUL: O locale especificado para o `CurrencyPipe` sobrescreve o token `LOCALE_ID` global da sua aplicação.

## Próximos passos

<docs-pill-row>
  <docs-pill href="guide/i18n/prepare" title="Preparar component para tradução"/>
</docs-pill-row>

[ApiCommonCurrencypipe]: api/common/CurrencyPipe 'CurrencyPipe | Common - API | Angular'
[ApiCommonDatepipe]: api/common/DatePipe 'DatePipe | Common - API | Angular'
[ApiCommonDecimalpipe]: api/common/DecimalPipe 'DecimalPipe | Common - API | Angular'
[ApiCommonPercentpipe]: api/common/PercentPipe 'PercentPipe | Common - API | Angular'
[ApiCoreLocaleId]: api/core/LOCALE_ID 'LOCALE_ID | Core - API | Angular'
