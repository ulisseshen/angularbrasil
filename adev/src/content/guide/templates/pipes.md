<!-- ia-translate: true -->
# Pipes

## Visão Geral

Pipes são um operador especial em expressões de template Angular que permite transformar dados de forma declarativa no seu template. Pipes permitem que você declare uma função de transformação uma vez e então use essa transformação em múltiplos templates. Os pipes do Angular usam o caractere barra vertical (`|`), inspirado no [pipe do Unix](<https://en.wikipedia.org/wiki/Pipeline_(Unix)>).

NOTA: A sintaxe de pipe do Angular se desvia do JavaScript padrão, que usa o caractere barra vertical para o [operador bitwise OR](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_OR). Expressões de template Angular não suportam operadores bitwise.

Aqui está um exemplo usando alguns pipes integrados que o Angular fornece:

```angular-ts
import { Component } from '@angular/core';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CurrencyPipe, DatePipe, TitleCasePipe],
  template: `
    <main>
       <!-- Transforma o nome da empresa para title-case e
       transforma a data purchasedOn para uma string formatada pela localidade -->
<h1>Purchases from {{ company | titlecase }} on {{ purchasedOn | date }}</h1>

	    <!-- Transforma o valor para uma string formatada em moeda -->
      <p>Total: {{ amount | currency }}</p>
    </main>
  `,
})
export class ShoppingCartComponent {
  amount = 123.45;
  company = 'acme corporation';
  purchasedOn = '2024-07-08';
}
```

Quando o Angular renderiza o component, ele garante que o formato de data e moeda apropriados sejam baseados na localidade do usuário. Se o usuário estiver nos Estados Unidos, renderizará:

```angular-html
<main>
  <h1>Purchases from Acme Corporation on Jul 8, 2024</h1>
  <p>Total: $123.45</p>
</main>
```

Veja o [guia detalhado sobre i18n](/guide/i18n) para aprender mais sobre como o Angular localiza valores.

### Pipes Integrados

O Angular inclui um conjunto de pipes integrados no pacote `@angular/common`:

| Nome                                          | Descrição                                                                                                     |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| [`AsyncPipe`](api/common/AsyncPipe)           | Lê o valor de uma `Promise` ou de um `Observable` RxJS.                                                      |
| [`CurrencyPipe`](api/common/CurrencyPipe)     | Transforma um número para uma string de moeda, formatada de acordo com as regras da localidade.              |
| [`DatePipe`](api/common/DatePipe)             | Formata um valor `Date` de acordo com as regras da localidade.                                               |
| [`DecimalPipe`](api/common/DecimalPipe)       | Transforma um número em uma string com ponto decimal, formatada de acordo com as regras da localidade.       |
| [`I18nPluralPipe`](api/common/I18nPluralPipe) | Mapeia um valor para uma string que pluraliza o valor de acordo com as regras da localidade.                 |
| [`I18nSelectPipe`](api/common/I18nSelectPipe) | Mapeia uma chave para um seletor personalizado que retorna um valor desejado.                                |
| [`JsonPipe`](api/common/JsonPipe)             | Transforma um objeto para uma representação em string via `JSON.stringify`, destinado para debugging.        |
| [`KeyValuePipe`](api/common/KeyValuePipe)     | Transforma Object ou Map em um array de pares chave-valor.                                                   |
| [`LowerCasePipe`](api/common/LowerCasePipe)   | Transforma texto para minúsculas.                                                                            |
| [`PercentPipe`](api/common/PercentPipe)       | Transforma um número para uma string de porcentagem, formatada de acordo com as regras da localidade.        |
| [`SlicePipe`](api/common/SlicePipe)           | Cria um novo Array ou String contendo um subconjunto (slice) dos elementos.                                  |
| [`TitleCasePipe`](api/common/TitleCasePipe)   | Transforma texto para title case.                                                                            |
| [`UpperCasePipe`](api/common/UpperCasePipe)   | Transforma texto para maiúsculas.                                                                            |

## Usando pipes

O operador pipe do Angular usa o caractere barra vertical (`|`), dentro de uma expressão de template. O operador pipe é um operador binário - o operando do lado esquerdo é o valor passado para a função de transformação, e o operando do lado direito é o nome do pipe e quaisquer argumentos adicionais (descritos abaixo).

```angular-html
<p>Total: {{ amount | currency }}</p>
```

Neste exemplo, o valor de `amount` é passado para o `CurrencyPipe` onde o nome do pipe é `currency`. Ele então renderiza a moeda padrão para a localidade do usuário.

### Combinando múltiplos pipes na mesma expressão

Você pode aplicar múltiplas transformações a um valor usando múltiplos operadores pipe. O Angular executa os pipes da esquerda para a direita.

O exemplo a seguir demonstra uma combinação de pipes para exibir uma data localizada em maiúsculas:

```angular-html
<p>The event will occur on {{ scheduledOn | date | uppercase }}.</p>
```

### Passando parâmetros para pipes

Alguns pipes aceitam parâmetros para configurar a transformação. Para especificar um parâmetro, adicione ao nome do pipe dois pontos (`:`) seguido do valor do parâmetro.

Por exemplo, o `DatePipe` pode receber parâmetros para formatar a data de uma maneira específica.

```angular-html
<p>The event will occur at {{ scheduledOn | date:'hh:mm' }}.</p>
```

Alguns pipes podem aceitar múltiplos parâmetros. Você pode especificar valores de parâmetros adicionais separados pelo caractere dois pontos (`:`).

Por exemplo, podemos também passar um segundo parâmetro opcional para controlar o fuso horário.

```angular-html
<p>The event will occur at {{ scheduledOn | date:'hh:mm':'UTC' }}.</p>
```

## Como pipes funcionam

Conceitualmente, pipes são funções que aceitam um valor de entrada e retornam um valor transformado.

```angular-ts
import { Component } from '@angular/core';
import { CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CurrencyPipe],
  template: `
    <main>
      <p>Total: {{ amount | currency }}</p>
    </main>
  `,
})
export class AppComponent {
  amount = 123.45;
}
```

Neste exemplo:

1. `CurrencyPipe` é importado de `@angular/common`
1. `CurrencyPipe` é adicionado ao array `imports`
1. Os dados `amount` são passados para o pipe `currency`

### Precedência do operador pipe

O operador pipe tem precedência menor do que outros operadores binários, incluindo `+`, `-`, `*`, `/`, `%`, `&&`, `||` e `??`.

```angular-html
<!-- firstName e lastName são concatenados antes que o resultado seja passado para o pipe uppercase -->
{{ firstName + lastName | uppercase }}
```

O operador pipe tem precedência maior do que o operador condicional (ternário).

```angular-html
{{ (isAdmin ? 'Access granted' : 'Access denied') | uppercase }}
```

Se a mesma expressão fosse escrita sem parênteses:

```angular-html
{{ isAdmin ? 'Access granted' : 'Access denied' | uppercase }}
```

Ela seria analisada em vez disso como:

```angular-html
{{ isAdmin ? 'Access granted' : ('Access denied' | uppercase) }}
```

Sempre use parênteses em suas expressões quando a precedência de operadores puder ser ambígua.

### Detecção de mudanças com pipes

Por padrão, todos os pipes são considerados `pure`, o que significa que só é executado quando um valor de entrada primitivo (como `String`, `Number`, `Boolean` ou `Symbol`) ou uma referência de objeto (como `Array`, `Object`, `Function` ou `Date`) é alterado. Pipes puros oferecem uma vantagem de desempenho porque o Angular pode evitar chamar a função de transformação se o valor passado não mudou.

Como resultado, isso significa que mutações em propriedades de objetos ou itens de array não são detectadas a menos que toda a referência do objeto ou array seja substituída por uma instância diferente. Se você quer este nível de detecção de mudanças, consulte [detectando mudanças dentro de arrays ou objetos](#detecting-change-within-arrays-or-objects).

## Criando pipes personalizados

Você pode definir um pipe personalizado implementando uma classe TypeScript com o decorator `@Pipe`. Um pipe deve ter duas coisas:

- Um nome, especificado no decorator do pipe
- Um método chamado `transform` que realiza a transformação do valor.

A classe TypeScript deve adicionalmente implementar a interface `PipeTransform` para garantir que ela satisfaça a assinatura de tipo para um pipe.

Aqui está um exemplo de um pipe personalizado que transforma strings para kebab case:

```angular-ts
// kebab-case.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kebabCase',
})
export class KebabCasePipe implements PipeTransform {
  transform(value: string): string {
    return value.toLowerCase().replace(/ /g, '-');
  }
}
```

### Usando o decorator `@Pipe`

Ao criar um pipe personalizado, importe `Pipe` do pacote `@angular/core` e use-o como um decorator para a classe TypeScript.

```angular-ts
import { Pipe } from '@angular/core';

@Pipe({
  name: 'myCustomTransformation',
})
export class MyCustomTransformationPipe {}
```

O decorator `@Pipe` requer um `name` que controla como o pipe é usado em um template.

### Convenção de nomenclatura para pipes personalizados

A convenção de nomenclatura para pipes personalizados consiste em duas convenções:

- `name` - camelCase é recomendado. Não use hífens.
- `class name` - versão PascalCase do `name` com `Pipe` adicionado ao final

### Implementar a interface `PipeTransform`

Além do decorator `@Pipe`, pipes personalizados devem sempre implementar a interface `PipeTransform` de `@angular/core`.

```angular-ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myCustomTransformation',
})
export class MyCustomTransformationPipe implements PipeTransform {}
```

Implementar esta interface garante que sua classe pipe tenha a estrutura correta.

### Transformando o valor de um pipe

Toda transformação é invocada pelo método `transform` com o primeiro parâmetro sendo o valor sendo passado e o valor de retorno sendo o valor transformado.

```angular-ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myCustomTransformation',
})
export class MyCustomTransformationPipe implements PipeTransform {
  transform(value: string): string {
    return `My custom transformation of ${value}.`
  }
}
```

### Adicionando parâmetros a um pipe personalizado

Você pode adicionar parâmetros à sua transformação adicionando parâmetros adicionais ao método `transform`:

```angular-ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myCustomTransformation',
})
export class MyCustomTransformationPipe implements PipeTransform {
  transform(value: string, format: string): string {
    let msg = `My custom transformation of ${value}.`

    if (format === 'uppercase') {
      return msg.toUpperCase()
    } else {
      return msg
    }
  }
}
```

### Detectando mudanças dentro de arrays ou objetos

Quando você quer que um pipe detecte mudanças dentro de arrays ou objetos, ele deve ser marcado como uma função impura passando a flag `pure` com um valor de `false`.

Evite criar pipes impuros a menos que absolutamente necessário, pois eles podem incorrer em uma penalidade significativa de desempenho se usados sem cuidado.

```angular-ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'joinNamesImpure',
  pure: false,
})
export class JoinNamesImpurePipe implements PipeTransform {
  transform(names: string[]): string {
    return names.join();
  }
}
```

Desenvolvedores Angular frequentemente adotam a convenção de incluir `Impure` no `name` do pipe e no nome da classe para indicar a potencial armadilha de desempenho para outros desenvolvedores.
