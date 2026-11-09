<!-- ia-translate: true -->
# Sintaxe de expressão {#expression-syntax}

As expressões do Angular são baseadas em JavaScript, mas diferem em alguns pontos importantes. Este guia percorre as semelhanças e diferenças entre as expressões do Angular e o JavaScript padrão.

## Literais de valor {#value-literals}

O Angular suporta um subconjunto dos [valores literais](https://developer.mozilla.org/en-US/docs/Glossary/Literal) do JavaScript.

### Literais de valor suportados {#supported-value-literals}

| Tipo de literal          | Valores de exemplo              |
| ------------------------ | ------------------------------- |
| String                   | `'Hello'`, `"World"`            |
| Boolean                  | `true`, `false`                 |
| Number                   | `123`, `3.14`                   |
| Object                   | `{name: 'Alice'}`               |
| Array                    | `['Onion', 'Cheese', 'Garlic']` |
| null                     | `null`                          |
| RegExp                   | `/\d+/`                         |
| Template string          | `` `Hello ${name}` ``           |
| Tagged template string   | `` tag`Hello ${name}` ``        |

### Literais de valor não suportados {#unsupported-value-literals}

| Tipo de literal | Valores de exemplo |
| --------------- | ------------------ |
| BigInt          | `1n`               |

## Globais {#globals}

As expressões do Angular suportam os seguintes [globais](https://developer.mozilla.org/en-US/docs/Glossary/Global_object):

- [undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)
- [$any](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any)

Nenhum outro global do JavaScript é suportado. Globais comuns do JavaScript incluem `Number`, `Boolean`, `NaN`, `Infinity`, `parseInt` e outros.

## Variáveis locais {#local-variables}

O Angular disponibiliza automaticamente variáveis locais especiais para uso em expressões em contextos específicos. Essas variáveis especiais sempre começam com o caractere de cifrão (`$`).

Por exemplo, blocos `@for` criam várias variáveis locais correspondentes a informações sobre o loop, como `$index`.

## Quais operadores são suportados? {#what-operators-are-supported}

### Operadores suportados {#supported-operators}

O Angular suporta os seguintes operadores do JavaScript padrão.

| Operador                      | Exemplo(s)                                     |
| ----------------------------- | ---------------------------------------------- |
| Add / Concatenate             | `1 + 2`                                        |
| Subtract                      | `52 - 3`                                       |
| Multiply                      | `41 * 6`                                       |
| Divide                        | `20 / 4`                                       |
| Remainder (Modulo)            | `17 % 5`                                       |
| Exponentiation                | `10 ** 3`                                      |
| Parenthesis                   | `9 * (8 + 4)`                                  |
| Conditional (Ternary)         | `a > b ? true : false`                         |
| And (Logical)                 | `&&`                                           |
| Or (Logical)                  | `\|\|`                                         |
| Not (Logical)                 | `!`                                            |
| Nullish Coalescing            | `possiblyNullValue ?? 'default'`               |
| Comparison Operators          | `<`, `<=`, `>`, `>=`, `==`, `===`, `!==`, `!=` |
| Unary Negation                | `-x`                                           |
| Unary Plus                    | `+y`                                           |
| Property Accessor             | `person['name']`                               |
| typeof                        | `typeof 42`                                    |
| void                          | `void 1`                                       |
| in                            | `'model' in car`                               |
| instanceof                    | `car instanceof Automobile`                    |
| Assignment                    | `a = b`                                        |
| Increment                     | `a++`, `++a`                                   |
| Decrement                     | `a--`, `--a`                                   |
| Addition Assignment           | `a += b`                                       |
| Subtraction Assignment        | `a -= b`                                       |
| Multiplication Assignment     | `a *= b`                                       |
| Division Assignment           | `a /= b`                                       |
| Remainder Assignment          | `a %= b`                                       |
| Exponentiation Assignment     | `a **= b`                                      |
| Logical AND Assignment        | `a &&= b`                                      |
| Logical OR Assignment         | `a \|\|= b`                                    |
| Nullish Coalescing Assignment | `a ??= b`                                      |
| Spread in object literals     | `{...obj, foo: 'bar'}`                         |
| Spread in array literals      | `[...arr, 1, 2, 3]`                            |
| Rest in function calls        | `fn(...args)`                                  |
| Arrow function                | `items.filter((i) => i.active)`                |

NOTE: Os operadores de atribuição e de incremento/decremento são válidos apenas em [instruções de event listener](#event-listener-statements). Usá-los em um binding ou em uma interpolação é um erro de compilação, a menos que estejam dentro de uma arrow function.

Arrow functions devem ter um corpo de expressão. Pipes não podem ser usados dentro de uma arrow function, mas você pode passar uma arrow function como argumento para um pipe.

As expressões do Angular também suportam os seguintes operadores não padrão:

| Operador                        | Exemplo(s)                     |
| ------------------------------- | ------------------------------ |
| [Pipe](/guide/templates/pipes)  | `{{ total \| currency }}`      |
| Optional chaining\*             | `someObj.someProp?.nestedProp` |
| Non-null assertion (TypeScript) | `someObj!.someProp`            |

### Migração da navegação segura {#safe-navigation-migration}

Antes do Angular 22, o operador de optional chaining (`?.`) retornava `null` quando o lado esquerdo era `null` ou `undefined`, enquanto o `?.` do JavaScript padrão retorna `undefined`.
A partir do Angular 22, o comportamento do operador de optional chaining nas expressões do Angular está alinhado com o comportamento padrão do JavaScript.

Durante a migração para a v22, os schematics do `ng update` adicionam uma função `$safeNavigationMigration` às expressões existentes para preservar o comportamento anterior.

```html
{{ $safeNavigationMigration(foo?.bar) }}
```

`$safeNavigationMigration` é apenas um **auxiliar temporário de migração**. Ele instrui o compilador a compilar a expressão de navegação segura envolvida usando a semântica legada, que retorna `null`, em vez da semântica padrão do `?.` do JavaScript. Não se trata de uma função real e não pode ser chamada a partir do TypeScript.

NOTE: Prefira migrar as expressões para que deixem de depender da distinção entre `null` e `undefined`, de modo que `$safeNavigationMigration` possa ser removido. Essa função pode ser removida em uma versão futura do Angular.

### Operadores não suportados {#unsupported-operators}

| Operador              | Exemplo(s)                        |
| --------------------- | --------------------------------- |
| All bitwise operators | `&`, `&=`, `~`, `\|=`, `^=`, etc. |
| Object destructuring  | `const { name } = person`         |
| Array destructuring   | `const [firstItem] = items`       |
| Comma operator        | `x = (x++, x)`                    |
| new                   | `new Car()`                       |

## Contexto léxico para expressões {#lexical-context-for-expressions}

As expressões do Angular são avaliadas no contexto da classe do component, bem como em quaisquer [variáveis de template](/guide/templates/variables), locais e globais relevantes.

Ao se referir a membros da classe do component, `this` é sempre implícito. No entanto, se um template declarar uma [variável de template](guide/templates/variables) com o mesmo nome de um membro, a variável sombreia esse membro. Você pode referenciar inequivocamente esse membro da classe usando `this.` explicitamente. Isso pode ser útil ao criar uma declaração `@let` que sombreia um membro da classe, por exemplo, para fins de narrowing de signals.

## Declarações {#declarations}

De modo geral, declarações não são suportadas nas expressões do Angular. Isso inclui, mas não se limita a:

| Declarações                       | Exemplo(s)                                  |
| --------------------------------- | ------------------------------------------- |
| Variáveis                         | `let label = 'abc'`, `const item = 'apple'` |
| Funções                           | `function myCustomFunction() { }`           |
| Arrow functions com corpo de bloco | `() => { }`                                 |
| Classes                           | `class Rectangle { }`                       |

## Instruções de event listener {#event-listener-statements}

Event handlers são **instruções** em vez de expressões. Embora suportem toda a mesma sintaxe das expressões do Angular, há duas diferenças principais:

1. Instruções **suportam** operadores de atribuição (mas não atribuições por desestruturação)
1. Instruções **não suportam** pipes
