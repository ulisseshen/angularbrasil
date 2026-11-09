<!-- ia-translate: true -->
# Formatando dados com pipes {#formatting-data-with-pipes}

Você pode levar o uso de pipes ainda mais longe, configurando-os. Pipes podem ser configurados passando opções para eles.

NOTE: Saiba mais sobre [formatação de dados com pipes no guia detalhado](/guide/templates/pipes).

Nesta atividade, você trabalhará com alguns pipes e parâmetros de pipe.

<hr>

Para passar parâmetros para um pipe, use a sintaxe `:` seguida pelo valor do parâmetro. Aqui está um exemplo:

```angular-html
template: `{{ date | date: 'medium' }}`;
```

A saída é `Jun 15, 2015, 9:43:11 PM`.

Hora de personalizar a saída de alguns pipes:

<docs-workflow>

<docs-step title="Formatar um número com `DecimalPipe`">

Em `app.ts`, atualize o template para incluir o parâmetro do pipe `decimal`.

```angular-html {highlight:[2]}
template: ` ...
<li>Number with "decimal" {{ num | number: '3.2-2' }}</li>
`
```

NOTE: Que formato é esse? O parâmetro do `DecimalPipe` se chama `digitsInfo`, e este parâmetro usa o formato: `{minIntegerDigits}.{minFractionDigits}-{maxFractionDigits}`

</docs-step>

<docs-step title="Formatar uma data com `DatePipe`">

Agora, atualize o template para usar o pipe `date`.

```angular-html {highlight:[2]}
template: ` ...
<li>Date with "date" {{ birthday | date: 'medium' }}</li>
`
```

Para diversão extra, experimente alguns parâmetros diferentes para `date`. Mais informações podem ser encontradas na [documentação do Angular](guide/templates/pipes).

</docs-step>

<docs-step title="Formatar uma moeda com `CurrencyPipe`">

Para a sua última tarefa, atualize o template para usar o pipe `currency`.

```angular-html {highlight:[2]}
template: ` ...
<li>Currency with "currency" {{ cost | currency }}</li>
`
```

Você também pode experimentar parâmetros diferentes para `currency`. Mais informações podem ser encontradas na [documentação do Angular](guide/templates/pipes).

</docs-step>

</docs-workflow>

Ótimo trabalho com pipes. Você já fez um grande progresso até aqui.

Existem ainda mais pipes integrados que você pode usar nas suas aplicações. Você pode encontrar a lista na [documentação do Angular](guide/templates/pipes).

Caso os pipes integrados não atendam às suas necessidades, você também pode criar um pipe personalizado. Confira a próxima lição para descobrir mais.
