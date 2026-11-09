<!-- ia-translate: true -->

# Control flow

Os templates do Angular oferecem suporte a blocos de control flow que permitem mostrar, ocultar e repetir elementos condicionalmente.

## Exibir conteúdo condicionalmente com `@if`, `@else if` e `@else` {#conditionally-display-content-with-if-else-if-and-else}

O bloco `@if` exibe seu conteúdo condicionalmente quando a expressão de condição é truthy:

```angular-html
@if (a > b) {
  <p>{{ a }} is greater than {{ b }}</p>
}
```

Se você quiser exibir conteúdo alternativo, pode fazê-lo fornecendo quantos blocos `@else if` forem necessários e um único bloco `@else`.

```angular-html
@if (a > b) {
  {{ a }} is greater than {{ b }}
} @else if (b > a) {
  {{ a }} is less than {{ b }}
} @else {
  {{ a }} is equal to {{ b }}
}
```

### Referenciando o resultado da expressão condicional {#referencing-the-conditional-expressions-result}

O condicional `@if` permite salvar o resultado da expressão condicional em uma variável para reutilização dentro do bloco.

```angular-html
@if (user.profile.settings.startDate; as startDate) {
  {{ startDate }}
}
```

Isso pode ser útil para referenciar expressões mais longas, que seriam mais fáceis de ler e manter dentro do template.

## Repetir conteúdo com o bloco `@for` {#repeat-content-with-the-for-block}

O bloco `@for` percorre uma coleção e renderiza repetidamente o conteúdo de um bloco. A coleção pode ser qualquer [iterable](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Iteration_protocols) do JavaScript, mas o Angular tem otimizações de performance adicionais para valores do tipo `Array`.

Um loop `@for` típico se parece com:

```angular-html
@for (item of items; track item.id) {
  {{ item.name }}
}
```

O bloco `@for` do Angular não oferece suporte a instruções que modificam o fluxo, como `continue` ou `break` do JavaScript.

### Por que `track` em blocos `@for` é importante? {#why-is-track-in-for-blocks-important}

A expressão `track` permite que o Angular mantenha uma relação entre os seus dados e os nós DOM da página. Isso permite que o Angular otimize a performance, executando o mínimo necessário de operações no DOM quando os dados mudam.

Usar `track` de forma eficaz pode melhorar significativamente a performance de renderização da sua aplicação ao percorrer coleções de dados.

Selecione uma propriedade que identifique de forma única cada item na expressão `track`. Se o seu modelo de dados incluir uma propriedade de identificação única, normalmente `id` ou `uuid`, use esse valor. Se os seus dados não tiverem um campo como esse, considere fortemente adicionar um.

Para coleções estáticas que nunca mudam, você pode usar `$index` para informar ao Angular que deve rastrear cada item pelo seu índice na coleção.

Se nenhuma outra opção estiver disponível, você pode usar o próprio item como chave de rastreamento. Isso informa ao Angular para rastrear o item pela sua identidade de referência, usando o operador de igualdade estrita (`===`). Evite essa opção sempre que possível, pois ela pode levar a atualizações de renderização significativamente mais lentas, já que o Angular não tem como mapear qual item de dados corresponde a quais nós DOM.

```angular-html
@for (item of items; track item) {
  {{ item.name }}
}
```

NOTE: Diferentemente de `*ngFor`, o bloco `@for` prioriza o reaproveitamento de views. Se uma propriedade rastreada mudar, mas a referência do objeto permanecer a mesma, o Angular atualiza os bindings da view (incluindo os inputs de component), em vez de destruir e recriar todo o elemento.

### Variáveis contextuais em blocos `@for` {#contextual-variables-in-for-blocks}

Dentro dos blocos `@for`, várias variáveis implícitas estão sempre disponíveis:

| Variável | Significado                                        |
| -------- | -------------------------------------------------- |
| `$count` | Número de itens na coleção iterada                 |
| `$index` | Índice da linha atual                              |
| `$first` | Se a linha atual é a primeira linha                |
| `$last`  | Se a linha atual é a última linha                  |
| `$even`  | Se o índice da linha atual é par                   |
| `$odd`   | Se o índice da linha atual é ímpar                 |

Essas variáveis estão sempre disponíveis com esses nomes, mas podem receber aliases por meio de um segmento `let`:

```angular-html
@for (item of items; track item.id; let idx = $index, e = $even) {
  <p>Item #{{ idx }}: {{ item.name }}</p>
}
```

O alias é útil ao aninhar blocos `@for`, permitindo ler variáveis do bloco `@for` externo a partir de um bloco `@for` interno.

### Fornecendo um fallback para blocos `@for` com o bloco `@empty` {#providing-a-fallback-for-for-blocks-with-the-empty-block}

Você pode, opcionalmente, incluir uma seção `@empty` imediatamente após o conteúdo do bloco `@for`. O conteúdo do bloco `@empty` é exibido quando não há itens:

```angular-html
@for (item of items; track item.name) {
  <li>{{ item.name }}</li>
} @empty {
  <li>There are no items.</li>
}
```

## Exibir conteúdo condicionalmente com o bloco `@switch` {#conditionally-display-content-with-the-switch-block}

Embora o bloco `@if` seja ótimo para a maioria dos cenários, o bloco `@switch` oferece uma sintaxe alternativa para renderizar dados condicionalmente. Sua sintaxe se assemelha bastante à instrução `switch` do JavaScript.

```angular-html
@switch (userPermissions) {
  @case ('admin') {
    <app-admin-dashboard />
  }
  @case ('reviewer')
  @case ('editor') {
    <app-editor-dashboard />
  }
  @default {
    <app-viewer-dashboard />
  }
}
```

O valor da expressão condicional é comparado com a expressão de case usando o operador de igualdade estrita (`===`).

**`@switch` não tem fallthrough**, então você não precisa de um equivalente à instrução `break` ou `return` no bloco.

Você pode especificar várias condições para um único bloco usando `@case` consecutivos.

Você pode, opcionalmente, incluir um bloco `@default`. O conteúdo do bloco `@default` é exibido se nenhuma das expressões de case anteriores corresponder ao valor do switch.

Se nenhum `@case` corresponder à expressão e não houver um bloco `@default`, nada será exibido.

### Verificação de tipos exaustiva {#exhaustive-type-checking}

`@switch` oferece suporte à verificação de tipos exaustiva, permitindo que o Angular verifique em tempo de compilação se todos os valores possíveis de um union type são tratados.

Ao usar `@default never;`, você declara explicitamente que não deve existir nenhum caso restante. Se o union type for estendido posteriormente e um novo caso não for coberto por um @case, o verificador de tipos de template do Angular reportará um erro, ajudando você a identificar branches ausentes mais cedo.

NOTE: A verificação de exaustividade depende do type narrowing do TypeScript, que funciona apenas com variáveis. Ela não funcionará se a condição do switch for uma chamada de função ou um signal (por exemplo, `@switch (state())`). Para contornar isso, atribua o signal a uma variável `@let`, por exemplo: `@let mySignal = this.mySignal()`.

```angular-ts
@Component({
  template: `
    @switch (state) {
      @case ('loggedOut') {
        <button>Login</button>
      }

      @case ('loggedIn') {
        <p>Welcome back!</p>
      }

      @default never;
      <!-- lança erro porque @case ('loading') está ausente -->
    }
  `,
})
export class AppComponent {
  state: 'loggedOut' | 'loading' | 'loggedIn' = 'loggedOut';
}
```

Quando a expressão do switch estiver aninhada dentro de um union, você deve especificar explicitamente a expressão a ser verificada quanto à exaustividade.

<!-- prettier-ignore -->
```angular-ts
@Component({
  template: `
    @switch (state.mode) {
      @case ('show') {
        {{ state.menu }};
      }
      @case ('hide') {}
      @default never(state);
    }
  `,
})
export class App {
  state!: {mode: 'hide'} | {mode: 'show'; menu: number};
}
```
