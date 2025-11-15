<!-- ia-translate: true -->
# Control flow

Templates Angular suportam blocos de control flow que permitem mostrar, ocultar e repetir elementos condicionalmente.

## Exibir conteúdo condicionalmente com `@if`, `@else-if` e `@else`

O bloco `@if` exibe condicionalmente seu conteúdo quando sua expressão de condição é truthy:

```angular-html
@if (a > b) {
  <p>{{a}} is greater than {{b}}</p>
}
```

Se você quiser exibir conteúdo alternativo, você pode fazê-lo fornecendo qualquer número de blocos `@else if` e um único bloco `@else`.

```angular-html
@if (a > b) {
  {{a}} is greater than {{b}}
} @else if (b > a) {
  {{a}} is less than {{b}}
} @else {
  {{a}} is equal to {{b}}
}
```

### Referenciando o resultado da expressão condicional

O condicional `@if` suporta salvar o resultado da expressão condicional em uma variável para reutilização dentro do bloco.

```angular-html
@if (user.profile.settings.startDate; as startDate) {
  {{ startDate }}
}
```

Isso pode ser útil para referenciar expressões mais longas que seriam mais fáceis de ler e manter dentro do template.

## Repetir conteúdo com o bloco `@for`

O bloco `@for` percorre uma coleção e renderiza repetidamente o conteúdo de um bloco. A coleção pode ser qualquer [iterable](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols) JavaScript, mas o Angular tem otimizações de performance adicionais para valores `Array`.

Um loop `@for` típico se parece com:

```angular-html
@for (item of items; track item.id) {
  {{ item.name }}
}
```

O bloco `@for` do Angular não suporta instruções que modificam o fluxo como `continue` ou `break` do JavaScript.

### Por que `track` em blocos `@for` é importante?

A expressão `track` permite que o Angular mantenha uma relação entre seus dados e os nós DOM na página. Isso permite que o Angular otimize a performance executando as operações DOM mínimas necessárias quando os dados mudam.

Usar track efetivamente pode melhorar significativamente a performance de renderização da sua aplicação ao percorrer coleções de dados.

Selecione uma propriedade que identifica exclusivamente cada item na expressão `track`. Se seu modelo de dados incluir uma propriedade de identificação única, comumente `id` ou `uuid`, use este valor. Se seus dados não incluírem um campo como este, considere fortemente adicionar um.

Para coleções estáticas que nunca mudam, você pode usar `$index` para informar ao Angular para rastrear cada item por seu índice na coleção.

Se nenhuma outra opção estiver disponível, você pode especificar `identity`. Isso informa ao Angular para rastrear o item por sua identidade de referência usando o operador de igualdade tripla (`===`). Evite esta opção sempre que possível, pois pode levar a atualizações de renderização significativamente mais lentas, já que o Angular não tem como mapear qual item de dados corresponde a quais nós DOM.

### Variáveis contextuais em blocos `@for`

Dentro de blocos `@for`, várias variáveis implícitas estão sempre disponíveis:

| Variável | Significado                                   |
| -------- | --------------------------------------------- |
| `$count` | Número de itens em uma coleção iterada        |
| `$index` | Índice da linha atual                         |
| `$first` | Se a linha atual é a primeira linha           |
| `$last`  | Se a linha atual é a última linha             |
| `$even`  | Se o índice da linha atual é par              |
| `$odd`   | Se o índice da linha atual é ímpar            |

Essas variáveis estão sempre disponíveis com esses nomes, mas podem receber aliases via um segmento `let`:

```angular-html
@for (item of items; track item.id; let idx = $index, e = $even) {
  <p>Item #{{ idx }}: {{ item.name }}</p>
}
```

O alias é útil ao aninhar blocos `@for`, permitindo que você leia variáveis do bloco `@for` externo de um bloco `@for` interno.

### Fornecendo um fallback para blocos `@for` com o bloco `@empty`

Você pode opcionalmente incluir uma seção `@empty` imediatamente após o conteúdo do bloco `@for`. O conteúdo do bloco `@empty` é exibido quando não há itens:

```angular-html
@for (item of items; track item.name) {
  <li> {{ item.name }}</li>
} @empty {
  <li> There are no items. </li>
}
```

## Exibir conteúdo condicionalmente com o bloco `@switch`

Embora o bloco `@if` seja ótimo para a maioria dos cenários, o bloco `@switch` fornece uma sintaxe alternativa para renderizar dados condicionalmente. Sua sintaxe se assemelha muito à instrução `switch` do JavaScript.

```angular-html
@switch (userPermissions) {
  @case ('admin') {
    <app-admin-dashboard />
  }
  @case ('reviewer') {
    <app-reviewer-dashboard />
  }
  @case ('editor') {
    <app-editor-dashboard />
  }
  @default {
    <app-viewer-dashboard />
  }
}
```

O valor da expressão condicional é comparado com a expressão case usando o operador de igualdade tripla (`===`).

**`@switch` não tem fallthrough**, então você não precisa de um equivalente a uma instrução `break` ou `return` no bloco.

Você pode opcionalmente incluir um bloco `@default`. O conteúdo do bloco `@default` é exibido se nenhuma das expressões case anteriores corresponder ao valor do switch.

Se nenhum `@case` corresponder à expressão e não houver um bloco `@default`, nada é mostrado.
