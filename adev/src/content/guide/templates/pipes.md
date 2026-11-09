<!-- ia-translate: true -->

# Pipes

## Visão Geral {#overview}

Pipes são operadores especiais em expressões de template do Angular que permitem transformar dados de forma declarativa no seu template. Pipes permitem declarar uma função de transformação uma única vez e depois usar essa transformação em vários templates. Os pipes do Angular usam o caractere barra vertical (`|`), inspirado no [pipe do Unix](<https://en.wikipedia.org/wiki/Pipeline_(Unix)>).

NOTE: A sintaxe de pipe do Angular se desvia do JavaScript padrão, que usa o caractere barra vertical para o [operador bitwise OR](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_OR). Expressões de template do Angular não suportam operadores bitwise.

Aqui está um exemplo usando alguns pipes integrados que o Angular fornece:

```angular-ts
import {Component} from '@angular/core';
import {CurrencyPipe, DatePipe, TitleCasePipe} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [CurrencyPipe, DatePipe, TitleCasePipe],
  template: `
    <main>
      <!-- Transforma o nome da empresa para title-case e
       transforma a data purchasedOn para uma string formatada de acordo com a localidade -->
      <h1>Purchases from {{ company | titlecase }} on {{ purchasedOn | date }}</h1>

      <!-- Transforma o valor para uma string formatada como moeda -->
      <p>Total: {{ amount | currency }}</p>
    </main>
  `,
})
export class ShoppingCart {
  amount = 123.45;
  company = 'acme corporation';
  purchasedOn = '2024-07-08';
}
```

Quando o Angular renderiza o componente, ele garante que o formato de data e a moeda apropriados sejam baseados na localidade do usuário. Se o usuário estiver nos Estados Unidos, ele renderizaria:

```angular-html
<main>
  <h1>Purchases from Acme Corporation on Jul 8, 2024</h1>
  <p>Total: $123.45</p>
</main>
```

Veja o [guia detalhado sobre i18n](/guide/i18n) para saber mais sobre como o Angular localiza valores.

### Pipes Integrados {#built-in-pipes}

O Angular inclui um conjunto de pipes integrados no pacote `@angular/common`:

| Nome                                          | Descrição                                                                                                  |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| [`AsyncPipe`](api/common/AsyncPipe)           | Lê o valor de uma `Promise` ou de um `Observable` do RxJS.                                                 |
| [`CurrencyPipe`](api/common/CurrencyPipe)     | Transforma um número em uma string de moeda, formatada de acordo com as regras da localidade.              |
| [`DatePipe`](api/common/DatePipe)             | Formata um valor `Date` de acordo com as regras da localidade.                                             |
| [`DecimalPipe`](api/common/DecimalPipe)       | Transforma um número em uma string com ponto decimal, formatada de acordo com as regras da localidade.     |
| [`I18nPluralPipe`](api/common/I18nPluralPipe) | Mapeia um valor para uma string que pluraliza o valor de acordo com as regras da localidade.               |
| [`I18nSelectPipe`](api/common/I18nSelectPipe) | Mapeia uma chave para um seletor personalizado que retorna o valor desejado.                               |
| [`JsonPipe`](api/common/JsonPipe)             | Transforma um objeto em uma representação em string via `JSON.stringify`, destinada à depuração.          |
| [`KeyValuePipe`](api/common/KeyValuePipe)     | Transforma um Object ou Map em um array de pares chave-valor.                                              |
| [`LowerCasePipe`](api/common/LowerCasePipe)   | Transforma o texto para minúsculas.                                                                        |
| [`PercentPipe`](api/common/PercentPipe)       | Transforma um número em uma string de porcentagem, formatada de acordo com as regras da localidade.        |
| [`SlicePipe`](api/common/SlicePipe)           | Cria um novo Array ou String contendo um subconjunto (slice) dos elementos.                                |
| [`TitleCasePipe`](api/common/TitleCasePipe)   | Transforma o texto para title case.                                                                        |
| [`UpperCasePipe`](api/common/UpperCasePipe)   | Transforma o texto para maiúsculas.                                                                        |

## Usando pipes {#using-pipes}

O operador pipe do Angular usa o caractere barra vertical (`|`) dentro de uma expressão de template. O operador pipe é um operador binário: o operando do lado esquerdo é o valor passado para a função de transformação, e o operando do lado direito é o nome do pipe e quaisquer argumentos adicionais (descritos abaixo).

```angular-html
<p>Total: {{ amount | currency }}</p>
```

Neste exemplo, o valor de `amount` é passado para o `CurrencyPipe`, cujo nome de pipe é `currency`. Em seguida, ele renderiza a moeda padrão da localidade do usuário.

### Combinando múltiplos pipes na mesma expressão {#combining-multiple-pipes-in-the-same-expression}

Você pode aplicar múltiplas transformações a um valor usando vários operadores pipe. O Angular executa os pipes da esquerda para a direita.

O exemplo a seguir demonstra uma combinação de pipes para exibir uma data localizada em letras maiúsculas:

```angular-html
<p>O evento ocorrerá em {{ scheduledOn | date | uppercase }}.</p>
```

### Passando parâmetros para pipes {#passing-parameters-to-pipes}

Alguns pipes aceitam parâmetros para configurar a transformação. Para especificar um parâmetro, adicione ao nome do pipe dois-pontos (`:`) seguido do valor do parâmetro.

Por exemplo, o `DatePipe` pode receber parâmetros para formatar a data de uma maneira específica.

```angular-html
<p>O evento ocorrerá às {{ scheduledOn | date: 'hh:mm' }}.</p>
```

Alguns pipes podem aceitar múltiplos parâmetros. Você pode especificar valores de parâmetros adicionais separados pelo caractere dois-pontos (`:`).

Por exemplo, também podemos passar um segundo parâmetro opcional para controlar o fuso horário.

```angular-html
<p>O evento ocorrerá às {{ scheduledOn | date: 'hh:mm' : 'UTC' }}.</p>
```

## Como pipes funcionam {#how-pipes-work}

Conceitualmente, pipes são funções que aceitam um valor de entrada e retornam um valor transformado.

```angular-ts
import {Component} from '@angular/core';
import {CurrencyPipe} from '@angular/common';

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
1. Os dados de `amount` são passados para o pipe `currency`

### Precedência do operador pipe {#pipe-operator-precedence}

O operador pipe tem precedência menor do que outros operadores binários, incluindo `+`, `-`, `*`, `/`, `%`, `&&`, `||` e `??`.

```angular-html
<!-- firstName e lastName são concatenados antes que o resultado seja passado para o pipe uppercase -->
{{ firstName + lastName | uppercase }}
```

O operador pipe tem precedência maior do que o operador condicional (ternário).

```angular-html
{{ (isAdmin ? 'Acesso concedido' : 'Acesso negado') | uppercase }}
```

Se a mesma expressão fosse escrita sem parênteses:

<!-- prettier-ignore -->
```angular-html
{{ isAdmin ? 'Acesso concedido' : 'Acesso negado' | uppercase }}
```

Ela seria analisada da seguinte forma:

```angular-html
{{ isAdmin ? 'Acesso concedido' : ('Acesso negado' | uppercase) }}
```

Sempre use parênteses nas suas expressões quando a precedência dos operadores puder ser ambígua.

### Detecção de mudanças com pipes {#change-detection-with-pipes}

Por padrão, todos os pipes são considerados `pure`, o que significa que eles só são executados quando um valor de entrada primitivo (como `String`, `Number`, `Boolean` ou `Symbol`) ou uma referência de objeto (como `Array`, `Object`, `Function` ou `Date`) é alterado. Pipes puros oferecem uma vantagem de desempenho porque o Angular pode evitar chamar a função de transformação se o valor passado não tiver mudado.

Como resultado, mutações em propriedades de objetos ou em itens de array não são detectadas, a menos que a referência inteira do objeto ou do array seja substituída por uma instância diferente. Se você quiser esse nível de detecção de mudanças, consulte [detectando mudanças dentro de arrays ou objetos](#detecting-change-within-arrays-or-objects).

## Criando pipes personalizados {#creating-custom-pipes}

Você pode definir um pipe personalizado implementando uma classe TypeScript com o decorator `@Pipe`. Um pipe deve ter duas coisas:

- Um nome, especificado no decorator do pipe
- Um método chamado `transform` que realiza a transformação do valor.

A classe TypeScript deve, adicionalmente, implementar a interface `PipeTransform` para garantir que ela satisfaça a assinatura de tipo de um pipe.

Aqui está um exemplo de um pipe personalizado que transforma strings para kebab case:

```angular-ts {header: "kebab-case.pipe.ts"}
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'kebabCase',
})
export class KebabCasePipe implements PipeTransform {
  transform(value: string): string {
    return value.toLowerCase().replace(/ /g, '-');
  }
}
```

### Usando o decorator `@Pipe` {#using-the-pipe-decorator}

Ao criar um pipe personalizado, importe `Pipe` do pacote `@angular/core` e use-o como um decorator para a classe TypeScript.

```angular-ts
import {Pipe} from '@angular/core';

@Pipe({
  name: 'myCustomTransformation',
})
export class MyCustomTransformationPipe {}
```

O decorator `@Pipe` exige um `name` que controla como o pipe é usado em um template.

### Convenção de nomenclatura para pipes personalizados {#naming-convention-for-custom-pipes}

A convenção de nomenclatura para pipes personalizados consiste em duas convenções:

- `name` - recomenda-se camelCase. Não use hífens.
- `class name` - versão PascalCase do `name` com `Pipe` adicionado ao final

### Implementar a interface `PipeTransform` {#implement-the-pipetransform-interface}

Além do decorator `@Pipe`, pipes personalizados devem sempre implementar a interface `PipeTransform` de `@angular/core`.

```angular-ts
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'myCustomTransformation',
})
export class MyCustomTransformationPipe implements PipeTransform {}
```

Implementar essa interface garante que a sua classe de pipe tenha a estrutura correta.

### Transformando o valor de um pipe {#transforming-the-value-of-a-pipe}

Toda transformação é invocada pelo método `transform`, com o primeiro parâmetro sendo o valor passado e o valor de retorno sendo o valor transformado.

```angular-ts
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'myCustomTransformation',
})
export class MyCustomTransformationPipe implements PipeTransform {
  transform(value: string): string {
    return `Minha transformação personalizada de ${value}.`;
  }
}
```

### Adicionando parâmetros a um pipe personalizado {#adding-parameters-to-a-custom-pipe}

Você pode adicionar parâmetros à sua transformação incluindo parâmetros adicionais no método `transform`:

```angular-ts
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'myCustomTransformation',
})
export class MyCustomTransformationPipe implements PipeTransform {
  transform(value: string, format: string): string {
    let msg = `Minha transformação personalizada de ${value}.`;

    if (format === 'uppercase') {
      return msg.toUpperCase();
    } else {
      return msg;
    }
  }
}
```

### Detectando mudanças dentro de arrays ou objetos {#detecting-change-within-arrays-or-objects}

Quando você quer que um pipe detecte mudanças dentro de arrays ou objetos, ele deve ser marcado como uma função impura, passando a flag `pure` com o valor `false`.

IMPORTANT: Evite criar pipes impuros, a menos que seja absolutamente necessário, pois eles podem incorrer em uma penalidade significativa de desempenho se usados sem cuidado.

```angular-ts
import {Pipe, PipeTransform} from '@angular/core';

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

## Usando a lógica de pipes fora dos templates {#using-pipe-logic-outside-templates}

Pipes são operadores de template projetados para transformar dados de forma declarativa em templates. Quando você precisar da mesma lógica de transformação em um service, em uma classe utilitária ou em qualquer outro contexto fora de templates, **evite injetar a classe do pipe**. Pipes não são projetados como services injetáveis.

### Extraia a lógica dos pipes personalizados {#extract-the-logic-from-custom-pipes}

Ao criar um pipe personalizado, extraia a transformação para uma função standalone. Faça o método `transform()` do pipe delegar para essa função e importe a função diretamente sempre que precisar dela em outros lugares.

```ts {header: "kebab-case.ts"}
export function toKebabCase(value: string): string {
  return value.toLowerCase().replace(/ /g, '-');
}
```

```ts {header: "kebab-case.pipe.ts" , prefer}
import {Pipe, PipeTransform} from '@angular/core';
import {toKebabCase} from './kebab-case';

@Pipe({name: 'kebabCase'})
export class KebabCasePipe implements PipeTransform {
  transform(value: string): string {
    return toKebabCase(value);
  }
}
```

```ts {header: "formatter.service.ts" , prefer}
import {Service} from '@angular/core';
import {toKebabCase} from './kebab-case';

@Service()
export class FormatterService {
  formatSlug(title: string): string {
    return toKebabCase(title);
  }
}
```

```ts {header: "formatter.service.ts" , avoid}
import {inject, Service} from '@angular/core';
import {KebabCasePipe} from './kebab-case.pipe';

@Service()
export class FormatterService {
  // Evite injetar a classe do pipe em services ou em outras classes.
  private kebabCasePipe = inject(KebabCasePipe);

  formatSlug(title: string): string {
    return this.kebabCasePipe.transform(title);
  }
}
```

### Use funções de formatação para pipes integrados {#use-formatting-functions-for-built-in-pipes}

Cada um dos pipes integrados do Angular sensíveis à localidade possui uma função de formatação standalone correspondente, exportada de `@angular/common`. Use essas funções em vez de injetar a classe do pipe.

| Pipe           | Função standalone |
| -------------- | ----------------- |
| `DatePipe`     | `formatDate`      |
| `CurrencyPipe` | `formatCurrency`  |
| `DecimalPipe`  | `formatNumber`    |
| `PercentPipe`  | `formatPercent`   |

```ts {prefer}
import {Service, LOCALE_ID, inject} from '@angular/core';
import {formatNumber} from '@angular/common';

@Service()
export class PriceService {
  private locale = inject(LOCALE_ID);

  format(value: number) {
    return formatNumber(value, this.locale, '1.2-2');
  }
}
```

```ts {avoid}
import {inject, Service} from '@angular/core';
import {DecimalPipe} from '@angular/common';

@Service()
export class PriceService {
  private decimalPipe = inject(DecimalPipe);

  format(value: number) {
    return this.decimalPipe.transform(value, '1.2-2');
  }
}
```
