<!-- ia-translate: true -->
# Formatando dados com pipes

Você pode levar seu uso de pipes ainda mais longe configurando-os. Pipes podem ser configurados passando opções para eles.

Nota: Saiba mais sobre [formatação de dados com pipes no guia detalhado](/guide/templates/pipes).

Nesta atividade, você trabalhará com alguns pipes e parâmetros de pipe.

<hr>

Para passar parâmetros para um pipe, use a sintaxe `:` seguida pelo valor do parâmetro. Aqui está um exemplo:

```ts
template: `{{ date | date:'medium' }}`;
```

A saída é `Jun 15, 2015, 9:43:11 PM`.

Hora de personalizar a saída de alguns pipes:

<docs-workflow>

<docs-step title="Formatar um número com `DecimalPipe`">

Em `app.ts`, atualize o template para incluir o parâmetro para o pipe `decimal`.

<docs-code language="ts" highlight="[3]">
template: `
  ...
  <li>Number with "decimal" {{ num | number:"3.2-2" }}</li>
`
</docs-code>

NOTA: O que é esse formato? O parâmetro para o `DecimalPipe` é chamado `digitsInfo`, este parâmetro usa o formato: `{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}`

</docs-step>

<docs-step title="Formatar uma data com `DatePipe`">

Agora, atualize o template para usar o pipe `date`.

<docs-code language="ts" highlight="[3]">
template: `
  ...
  <li>Date with "date" {{ birthday | date: 'medium' }}</li>
`
</docs-code>

Para diversão extra, experimente alguns parâmetros diferentes para `date`. Mais informações podem ser encontradas na [documentação do Angular](guide/templates/pipes).

</docs-step>

<docs-step title="Formatar uma moeda com `CurrencyPipe`">

Para sua última tarefa, atualize o template para usar o pipe `currency`.

<docs-code language="ts" highlight="[3]">
template: `
  ...
  <li>Currency with "currency" {{ cost | currency }}</li>
`
</docs-code>

Você também pode experimentar parâmetros diferentes para `currency`. Mais informações podem ser encontradas na [documentação do Angular](guide/templates/pipes).

</docs-step>

</docs-workflow>

Ótimo trabalho com pipes. Você fez um grande progresso até agora.

Existem ainda mais pipes integrados que você pode usar em suas aplicações. Você pode encontrar a lista na [documentação do Angular](guide/templates/pipes).

No caso de os pipes integrados não cobrirem suas necessidades, você também pode criar um pipe personalizado. Confira a próxima lição para descobrir mais.
