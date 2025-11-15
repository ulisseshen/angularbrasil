<!-- ia-translate: true -->

# Erros de metadados AOT

Os seguintes são erros de metadados que você pode encontrar, com explicações e correções sugeridas.

## Forma de expressão não suportada

HELPFUL: O compilador encontrou uma expressão que não entendeu ao avaliar metadados Angular.

Recursos de linguagem fora da [sintaxe de expressão restrita](tools/cli/aot-compiler#expression-syntax) do compilador
podem produzir este erro, como visto no exemplo a seguir:

```ts
// ERROR
export class Fooish { … }
…
const prop = typeof Fooish; // typeof não é válido em metadados
  …
  // notação de colchetes não é válida em metadados
  { provide: 'token', useValue: { [prop]: 'value' } };
  …
```

Você pode usar `typeof` e notação de colchetes em código de aplicação normal.
Você apenas não pode usar esses recursos dentro de expressões que definem metadados Angular.

Evite este erro aderindo à [sintaxe de expressão restrita](tools/cli/aot-compiler#expression-syntax) do compilador
ao escrever metadados Angular
e fique atento a recursos novos ou incomuns do TypeScript.

## Referência a um símbolo local (não exportado) {#only-initialized-variables-and-constants}

HELPFUL: Referência a um símbolo local \(não exportado\) 'nome do símbolo'. Considere exportar o símbolo.

O compilador encontrou uma referência a um símbolo definido localmente que não foi exportado ou não foi inicializado.

Aqui está um exemplo de `provider` do problema.

```ts

// ERROR
let foo: number; // nem exportado nem inicializado

@Component({
  selector: 'my-component',
  template: … ,
  providers: [
    { provide: Foo, useValue: foo }
  ]
})
export class MyComponent {}

```

O compilador gera a factory do component, que inclui o código do provider `useValue`, em um módulo separado. _Aquele_ módulo factory não pode voltar a _este_ módulo fonte para acessar a variável local \(não exportada\) `foo`.

Você poderia corrigir o problema inicializando `foo`.

```ts
let foo = 42; // inicializado
```

O compilador irá fazer [fold](tools/cli/aot-compiler#code-folding) da expressão no provider como se você tivesse escrito isto.

```ts
providers: [
  { provide: Foo, useValue: 42 }
]
```

Alternativamente, você pode corrigir exportando `foo` com a expectativa de que `foo` será atribuído em tempo de execução quando você realmente souber seu valor.

```ts
// CORRECTED
export let foo: number; // exportado

@Component({
  selector: 'my-component',
  template: … ,
  providers: [
    { provide: Foo, useValue: foo }
  ]
})
export class MyComponent {}
```

Adicionar `export` frequentemente funciona para variáveis referenciadas em metadados como `providers` e `animations` porque o compilador pode gerar _referências_ às variáveis exportadas nessas expressões. Ele não precisa dos _valores_ dessas variáveis.

Adicionar `export` não funciona quando o compilador precisa do _valor real_
para gerar código.
Por exemplo, não funciona para a propriedade `template`.

```ts
// ERROR
export let someTemplate: string; // exportado mas não inicializado

@Component({
  selector: 'my-component',
  template: someTemplate
})
export class MyComponent {}
```

O compilador precisa do valor da propriedade `template` _agora mesmo_ para gerar a factory do component.
A referência de variável sozinha é insuficiente.
Prefixar a declaração com `export` apenas produz um novo erro, "[`Somente variáveis e constantes inicializadas podem ser referenciadas`](#only-initialized-variables-and-constants)".

## Somente variáveis e constantes inicializadas

HELPFUL: _Somente variáveis e constantes inicializadas podem ser referenciadas porque o valor desta variável é necessário pelo template compiler._

O compilador encontrou uma referência a uma variável exportada ou campo estático que não foi inicializado.
Ele precisa do valor dessa variável para gerar código.

O exemplo a seguir tenta definir a propriedade `template` do component para o valor da variável exportada `someTemplate` que é declarada mas _não atribuída_.

```ts
// ERROR
export let someTemplate: string;

@Component({
  selector: 'my-component',
  template: someTemplate
})
export class MyComponent {}
```

Você também obteria este erro se importasse `someTemplate` de algum outro módulo e negligenciasse inicializá-la lá.

```ts
// ERROR - não inicializada lá também
import { someTemplate } from './config';

@Component({
  selector: 'my-component',
  template: someTemplate
})
export class MyComponent {}
```

O compilador não pode esperar até o tempo de execução para obter as informações do template.
Ele deve derivar estaticamente o valor da variável `someTemplate` do código fonte para que possa gerar a factory do component, que inclui instruções para construir o elemento baseado no template.

Para corrigir este erro, forneça o valor inicial da variável em uma cláusula inicializadora _na mesma linha_.

```ts
// CORRECTED
export let someTemplate = '<h1>Greetings from Angular</h1>';

@Component({
  selector: 'my-component',
  template: someTemplate
})
export class MyComponent {}
```

## Referência a uma classe não exportada

HELPFUL: _Referência a uma classe não exportada `<nome da classe>`._
_Considere exportar a classe._

Metadados referenciaram uma classe que não foi exportada.

Por exemplo, você pode ter definido uma classe e usado-a como um token de injeção em um array de providers mas negligenciado exportar essa classe.

```ts
// ERROR
abstract class MyStrategy { }

  …
  providers: [
    { provide: MyStrategy, useValue: … }
  ]
  …
```

Angular gera uma factory de classe em um módulo separado e essa factory [só pode acessar classes exportadas](tools/cli/aot-compiler#exported-symbols).
Para corrigir este erro, exporte a classe referenciada.

```ts
// CORRECTED
export abstract class MyStrategy { }

  …
  providers: [
    { provide: MyStrategy, useValue: … }
  ]
  …
```

## Referência a uma função não exportada

HELPFUL: _Metadados referenciaram uma função que não foi exportada._

Por exemplo, você pode ter definido uma propriedade `useFactory` de providers para uma função definida localmente que você negligenciou exportar.

```ts
// ERROR
function myStrategy() { … }

  …
  providers: [
    { provide: MyStrategy, useFactory: myStrategy }
  ]
  …
```

Angular gera uma factory de classe em um módulo separado e essa factory [só pode acessar funções exportadas](tools/cli/aot-compiler#exported-symbols).
Para corrigir este erro, exporte a função.

```ts
// CORRECTED
export function myStrategy() { … }

  …
  providers: [
    { provide: MyStrategy, useFactory: myStrategy }
  ]
  …
```

## Chamadas de função não são suportadas

HELPFUL: _Chamadas de função não são suportadas. Considere substituir a função ou lambda por uma referência a uma função exportada._

O compilador atualmente não suporta [expressões de função ou funções lambda](tools/cli/aot-compiler#function-expression).
Por exemplo, você não pode definir um `useFactory` de provider para uma função anônima ou arrow function como esta.

```ts
// ERROR
  …
  providers: [
    { provide: MyStrategy, useFactory: function() { … } },
    { provide: OtherStrategy, useFactory: () => { … } }
  ]
  …
```

Você também obtém este erro se chamar uma função ou método em um `useValue` de provider.

```ts
// ERROR
import { calculateValue } from './utilities';

  …
  providers: [
    { provide: SomeValue, useValue: calculateValue() }
  ]
  …
```

Para corrigir este erro, exporte uma função do módulo e refira-se à função em um provider `useFactory`.

```ts
// CORRECTED
import { calculateValue } from './utilities';

export function myStrategy() { … }
export function otherStrategy() { … }
export function someValueFactory() {
  return calculateValue();
}
  …
  providers: [
    { provide: MyStrategy, useFactory: myStrategy },
    { provide: OtherStrategy, useFactory: otherStrategy },
    { provide: SomeValue, useFactory: someValueFactory }
  ]
  …
```

## Variável ou constante desestruturada não suportada

HELPFUL: _Referenciar uma variável ou constante desestruturada exportada não é suportado pelo template compiler. Considere simplificar isso para evitar desestruturação._

O compilador não suporta referências a variáveis atribuídas por [desestruturação](https://www.typescriptlang.org/docs/handbook/variable-declarations.html#destructuring).

Por exemplo, você não pode escrever algo como isto:

```ts
// ERROR
import { configuration } from './configuration';

// atribuição desestruturada para foo e bar
const {foo, bar} = configuration;
  …
  providers: [
    {provide: Foo, useValue: foo},
    {provide: Bar, useValue: bar},
  ]
  …
```

Para corrigir este erro, refira-se a valores não desestruturados.

```ts
// CORRECTED
import { configuration } from './configuration';
  …
  providers: [
    {provide: Foo, useValue: configuration.foo},
    {provide: Bar, useValue: configuration.bar},
  ]
  …
```

## Não foi possível resolver tipo

HELPFUL: _O compilador encontrou um tipo e não pode determinar qual módulo exporta esse tipo._

Isso pode acontecer se você se referir a um tipo ambiente.
Por exemplo, o tipo `Window` é um tipo ambiente declarado no arquivo global `.d.ts`.

Você obterá um erro se referenciá-lo no construtor do component, que o compilador deve analisar estaticamente.

```ts
// ERROR
@Component({ })
export class MyComponent {
  constructor (private win: Window) { … }
}
```

TypeScript entende tipos ambiente então você não os importa.
O compilador Angular não entende um tipo que você negligencia exportar ou importar.

Neste caso, o compilador não entende como injetar algo com o token `Window`.

Não se refira a tipos ambiente em expressões de metadados.

Se você deve injetar uma instância de um tipo ambiente,
você pode contornar o problema em quatro passos:

1. Crie um token de injeção para uma instância do tipo ambiente.
1. Crie uma factory function que retorna essa instância.
1. Adicione um provider `useFactory` com essa factory function.
1. Use `@Inject` para injetar a instância.

Aqui está um exemplo ilustrativo.

```ts
// CORRECTED
import { Inject } from '@angular/core';

export const WINDOW = new InjectionToken('Window');
export function _window() { return window; }

@Component({
  …
  providers: [
    { provide: WINDOW, useFactory: _window }
  ]
})
export class MyComponent {
  constructor (@Inject(WINDOW) private win: Window) { … }
}
```

O tipo `Window` no construtor não é mais um problema para o compilador porque ele
usa o `@Inject(WINDOW)` para gerar o código de injeção.

Angular faz algo similar com o token `DOCUMENT` para que você possa injetar o objeto `document` do browser \(ou uma abstração dele, dependendo da plataforma na qual a aplicação é executada\).

```ts
import { Inject }   from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({ … })
export class MyComponent {
  constructor (@Inject(DOCUMENT) private doc: Document) { … }
}
```

## Nome esperado

HELPFUL: _O compilador esperava um nome em uma expressão que estava avaliando._

Isso pode acontecer se você usar um número como nome de propriedade como no exemplo a seguir.

```ts
// ERROR
provider: [{ provide: Foo, useValue: { 0: 'test' } }]
```

Mude o nome da propriedade para algo não numérico.

```ts
// CORRECTED
provider: [{ provide: Foo, useValue: { '0': 'test' } }]
```

## Nome de membro enum não suportado

HELPFUL: _Angular não pôde determinar o valor do [membro enum](https://www.typescriptlang.org/docs/handbook/enums.html) que você referenciou em metadados._

O compilador pode entender valores enum simples mas não valores complexos como aqueles derivados de propriedades computadas.

```ts
// ERROR
enum Colors {
  Red = 1,
  White,
  Blue = "Blue".length // computado
}

  …
  providers: [
    { provide: BaseColor,   useValue: Colors.White } // ok
    { provide: DangerColor, useValue: Colors.Red }   // ok
    { provide: StrongColor, useValue: Colors.Blue }  // ruim
  ]
  …
```

Evite se referir a enums com inicializadores complicados ou propriedades computadas.

## Expressões tagged template não são suportadas

HELPFUL: _Expressões tagged template não são suportadas em metadados._

O compilador encontrou uma [expressão tagged template](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Template_literals#Tagged_template_literals) JavaScript ES2015 como a seguinte.

```ts

// ERROR
const expression = 'funky';
const raw = String.raw`A tagged template ${expression} string`;
 …
 template: '<div>' + raw + '</div>'
 …

```

[`String.raw()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/raw) é uma _tag function_ nativa do JavaScript ES2015.

O compilador AOT não suporta expressões tagged template; evite-as em expressões de metadados.

## Referência de símbolo esperada

HELPFUL: _O compilador esperava uma referência a um símbolo no local especificado na mensagem de erro._

Este erro pode ocorrer se você usar uma expressão na cláusula `extends` de uma classe.

<!--todo: Chuck: After reviewing your PR comment I'm still at a loss. See [comment there](https://github.com/angular/angular/pull/17712#discussion_r132025495). -->
