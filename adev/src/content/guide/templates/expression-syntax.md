<!-- ia-translate: true -->
# Sintaxe de Expressão

Expressões Angular são baseadas em JavaScript, mas diferem de algumas maneiras importantes. Este guia percorre as semelhanças e diferenças entre expressões Angular e JavaScript padrão.

## Literais de valor

O Angular suporta um subconjunto de [valores literais](https://developer.mozilla.org/en-US/docs/Glossary/Literal) do JavaScript.

### Literais de valor suportados

| Tipo de literal | Valores de exemplo                |
| --------------- | --------------------------------- |
| String          | `'Hello'`, `"World"`              |
| Boolean         | `true`, `false`                   |
| Number          | `123`, `3.14`                     |
| Object          | `{name: 'Alice'}`                 |
| Array           | `['Onion', 'Cheese', 'Garlic']`   |
| null            | `null`                            |
| Template string | `` `Hello ${name}` ``             |
| RegExp          | `/\d+/`                           |

### Literais de valor não suportados

| Tipo de literal | Valores de exemplo |
| --------------- | ------------------ |
| BigInt          | `1n`               |

## Globais

Expressões Angular suportam os seguintes [globais](https://developer.mozilla.org/en-US/docs/Glossary/Global_object):

- [undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)
- [$any](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any)

Nenhum outro global JavaScript é suportado. Globais JavaScript comuns incluem `Number`, `Boolean`, `NaN`, `Infinity`, `parseInt`, e mais.

## Variáveis locais

O Angular automaticamente disponibiliza variáveis locais especiais para uso em expressões em contextos específicos. Essas variáveis especiais sempre começam com o caractere de cifrão (`$`).

Por exemplo, blocos `@for` disponibilizam várias variáveis locais correspondentes a informações sobre o loop, como `$index`.

## Quais operadores são suportados?

### Operadores suportados

O Angular suporta os seguintes operadores do JavaScript padrão.

| Operador                         | Exemplo(s)                                     |
| -------------------------------- | ---------------------------------------------- |
| Adicionar / Concatenar           | `1 + 2`                                        |
| Subtrair                         | `52 - 3`                                       |
| Multiplicar                      | `41 * 6`                                       |
| Dividir                          | `20 / 4`                                       |
| Resto (Módulo)                   | `17 % 5`                                       |
| Exponenciação                    | `10 ** 3`                                      |
| Parênteses                       | `9 * (8 + 4)`                                  |
| Condicional (Ternário)           | `a > b ? true : false`                         |
| And (Lógico)                     | `&&`                                           |
| Or (Lógico)                      | `\|\|`                                         |
| Not (Lógico)                     | `!`                                            |
| Nullish Coalescing               | `possiblyNullValue ?? 'default'`               |
| Operadores de Comparação         | `<`, `<=`, `>`, `>=`, `==`, `===`, `!==`, `!=` |
| Negação Unária                   | `-x`                                           |
| Plus Unário                      | `+y`                                           |
| Property Accessor                | `person['name']`                               |
| Atribuição                       | `a = b`                                        |
| Atribuição de Adição             | `a += b`                                       |
| Atribuição de Subtração          | `a -= b`                                       |
| Atribuição de Multiplicação      | `a *= b`                                       |
| Atribuição de Divisão            | `a /= b`                                       |
| Atribuição de Resto              | `a %= b`                                       |
| Atribuição de Exponenciação      | `a **= b`                                      |
| Atribuição AND Lógico            | `a &&= b`                                      |
| Atribuição OR Lógico             | `a \|\|= b`                                    |
| Atribuição Nullish Coalescing    | `a ??= b`                                      |

Expressões Angular adicionalmente também suportam os seguintes operadores não-padrão:

| Operador                        | Exemplo(s)                     |
| ------------------------------- | ------------------------------ |
| [Pipe](/guide/templates/pipes)  | `{{ total \| currency }}`      |
| Optional chaining\*             | `someObj.someProp?.nestedProp` |
| Non-null assertion (TypeScript) | `someObj!.someProp`            |

NOTE: Optional chaining se comporta de forma diferente da versão JavaScript padrão em que se o lado esquerdo do operador optional chaining do Angular for `null` ou `undefined`, ele retorna `null` ao invés de `undefined`.

### Operadores não suportados

| Operador                      | Exemplo(s)                        |
| ----------------------------- | --------------------------------- |
| Todos operadores bitwise      | `&`, `&=`, `~`, `\|=`, `^=`, etc. |
| Desestruturação de objeto     | `const { name } = person`         |
| Desestruturação de array      | `const [firstItem] = items`       |
| Operador vírgula              | `x = (x++, x)`                    |
| instanceof                    | `car instanceof Automobile`       |
| new                           | `new Car()`                       |

## Contexto léxico para expressões

Expressões Angular são avaliadas dentro do contexto da classe do component, bem como quaisquer [variáveis de template](/guide/templates/variables), locais e globais relevantes.

Ao se referir a membros da classe do component, `this` está sempre implícito. No entanto, se um template declara uma [variável de template](guide/templates/variables) com o mesmo nome que um membro, a variável sombreia aquele membro. Você pode referenciar inequivocamente tal membro da classe usando explicitamente `this.`. Isso pode ser útil ao criar uma declaração `@let` que sombreia um membro da classe, por exemplo, para fins de narrowing de signal.

## Declarações

De modo geral, declarações não são suportadas em expressões Angular. Isso inclui, mas não está limitado a:

| Declarações    | Exemplo(s)                                  |
| -------------- | ------------------------------------------- |
| Variáveis      | `let label = 'abc'`, `const item = 'apple'` |
| Funções        | `function myCustomFunction() { }`           |
| Arrow Functions| `() => { }`                                 |
| Classes        | `class Rectangle { }`                       |

# Instruções de event listener

Event handlers são **instruções** ao invés de expressões. Embora eles suportem toda a mesma sintaxe que expressões Angular, existem duas diferenças principais:

1. Instruções **suportam** operadores de atribuição (mas não atribuições de desestruturação)
1. Instruções **não suportam** pipes
