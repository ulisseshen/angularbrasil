<!-- ia-translate: true -->

# Compilação Ahead-of-time (AOT)

Uma aplicação Angular consiste principalmente de components e seus templates HTML.
Como os components e templates fornecidos pelo Angular não podem ser compreendidos diretamente pelo browser, as aplicações Angular requerem um processo de compilação antes que possam ser executadas em um browser.

O compilador Angular ahead-of-time (AOT) converte seu código Angular HTML e TypeScript em código JavaScript eficiente durante a fase de build _antes_ que o browser baixe e execute esse código.
Compilar sua aplicação durante o processo de build proporciona uma renderização mais rápida no browser.

Este guia explica como especificar metadados e aplicar as opções de compilador disponíveis para compilar suas aplicações de forma eficiente usando o compilador AOT.

HELPFUL: [Assista Alex Rickabaugh explicar o compilador Angular](https://www.youtube.com/watch?v=anphffaCZrQ) no AngularConnect 2019.

Aqui estão algumas razões pelas quais você pode querer usar AOT.

| Razões                                         | Detalhes                                                                                                                                                                                                                                          |
| :--------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Renderização mais rápida                       | Com AOT, o browser baixa uma versão pré-compilada da aplicação. O browser carrega código executável para que possa renderizar a aplicação imediatamente, sem esperar para compilar a aplicação primeiro.                                          |
| Menos requisições assíncronas                  | O compilador _incorpora_ templates HTML externos e folhas de estilo CSS dentro do JavaScript da aplicação, eliminando requisições ajax separadas para esses arquivos fonte.                                                                       |
| Tamanho menor de download do framework Angular | Não há necessidade de baixar o compilador Angular se a aplicação já está compilada. O compilador é aproximadamente metade do Angular em si, então omiti-lo reduz drasticamente a carga útil da aplicação.                                         |
| Detectar erros de template mais cedo           | O compilador AOT detecta e reporta erros de binding em templates durante a etapa de build antes que os usuários possam vê-los.                                                                                                                    |
| Melhor segurança                               | AOT compila templates HTML e components em arquivos JavaScript muito antes de serem servidos ao client. Sem templates para ler e sem avaliação arriscada de HTML ou JavaScript no lado do client, há menos oportunidades para ataques de injeção. |

## Escolhendo um compilador

Angular oferece duas formas de compilar sua aplicação:

| Compilação Angular    | Detalhes                                                                                      |
| :-------------------- | :-------------------------------------------------------------------------------------------- |
| Just-in-Time \(JIT\)  | Compila sua aplicação no browser em tempo de execução. Isso era o padrão até o Angular 8.     |
| Ahead-of-Time \(AOT\) | Compila sua aplicação e bibliotecas em tempo de build. Isso é o padrão a partir do Angular 9. |

Quando você executa os comandos CLI [`ng build`](cli/build) \(somente build\) ou [`ng serve`](cli/serve) \(build e servir localmente\), o tipo de compilação \(JIT ou AOT\) depende do valor da propriedade `aot` na sua configuração de build especificada em `angular.json`.
Por padrão, `aot` é definido como `true` para novas aplicações CLI.

Veja a [referência de comandos CLI](cli) e [Construindo e servindo aplicações Angular](tools/cli/build) para mais informações.

## Como AOT funciona

O compilador Angular AOT extrai **metadados** para interpretar as partes da aplicação que o Angular deve gerenciar.
Você pode especificar os metadados explicitamente em **decorators** como `@Component()`, ou implicitamente nas declarações de construtor das classes decoradas.
Os metadados dizem ao Angular como construir instâncias das suas classes de aplicação e interagir com elas em tempo de execução.

No exemplo a seguir, o objeto de metadados `@Component()` e o construtor da classe dizem ao Angular como criar e exibir uma instância de `TypicalComponent`.

```angular-ts

@Component({
  selector: 'app-typical',
  template: '<div>A typical component for {{data.name}}</div>'
})
export class TypicalComponent {
  data = input.required<TypicalData>();
  private someService = inject(SomeService);
}

```

O compilador Angular extrai os metadados _uma vez_ e gera uma _factory_ para `TypicalComponent`.
Quando precisa criar uma instância de `TypicalComponent`, o Angular chama a factory, que produz um novo elemento visual, vinculado a uma nova instância da classe component com sua dependência injetada.

### Fases de compilação

Existem três fases de compilação AOT.

|     | Fase                            | Detalhes                                                                                                                                                                                                                                                                                                              |
| :-- | :------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | análise de código               | Nesta fase, o compilador TypeScript e o _AOT collector_ criam uma representação do código fonte. O collector não tenta interpretar os metadados que coleta. Ele representa os metadados da melhor forma possível e registra erros quando detecta uma violação de sintaxe de metadados.                                |
| 2   | geração de código               | Nesta fase, o `StaticReflector` do compilador interpreta os metadados coletados na fase 1, realiza validação adicional dos metadados e lança um erro se detectar uma violação de restrição de metadados.                                                                                                              |
| 3   | verificação de tipo de template | Nesta fase opcional, o _template compiler_ do Angular usa o compilador TypeScript para validar as expressões de binding em templates. Você pode ativar esta fase explicitamente definindo a opção de configuração `strictTemplates`; veja [Opções do compilador Angular](reference/configs/angular-compiler-options). |

### Restrições de metadados

Você escreve metadados em um _subconjunto_ de TypeScript que deve estar em conformidade com as seguintes restrições gerais:

- Limitar a [sintaxe de expressão](#expression-syntax-limitations) ao subconjunto suportado de JavaScript
- Apenas referenciar símbolos exportados após [code folding](#code-folding)
- Apenas chamar [funções suportadas](#supported-classes-and-functions) pelo compilador
- Membros de classe de Input/Outputs e vinculados a dados devem ser public ou protected.

Para diretrizes e instruções adicionais sobre como preparar uma aplicação para compilação AOT, veja [Angular: Writing AOT-friendly applications](https://medium.com/sparkles-blog/angular-writing-aot-friendly-applications-7b64c8afbe3f).

HELPFUL: Erros na compilação AOT ocorrem comumente devido a metadados que não estão em conformidade com os requisitos do compilador \(como descrito mais completamente abaixo\).
Para ajuda em compreender e resolver esses problemas, veja [Erros de Metadados AOT](tools/cli/aot-metadata-errors).

### Configurando a compilação AOT

Você pode fornecer opções no [arquivo de configuração TypeScript](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) que controla o processo de compilação.
Veja [Opções do compilador Angular](reference/configs/angular-compiler-options) para uma lista completa de opções disponíveis.

## Fase 1: Análise de código

O compilador TypeScript faz parte do trabalho analítico da primeira fase.
Ele emite os arquivos _type definition_ `.d.ts` com informações de tipo que o compilador AOT precisa para gerar código da aplicação.
Ao mesmo tempo, o **collector** AOT analisa os metadados registrados nos decorators Angular e produz informações de metadados em arquivos **`.metadata.json`**, um por arquivo `.d.ts`.

Você pode pensar em `.metadata.json` como um diagrama da estrutura geral dos metadados de um decorator, representado como uma [árvore de sintaxe abstrata (AST)](https://en.wikipedia.org/wiki/Abstract_syntax_tree).

HELPFUL: O [schema.ts](https://github.com/angular/angular/blob/main/packages/compiler-cli/src/metadata/schema.ts) do Angular descreve o formato JSON como uma coleção de interfaces TypeScript.

### Limitações de sintaxe de expressão {#supported-classes-and-functions}

O collector AOT entende apenas um subconjunto de JavaScript.
Defina objetos de metadados com a seguinte sintaxe limitada:

| Sintaxe                    | Exemplo                                                    |
| :------------------------- | :--------------------------------------------------------- |
| Literal object             | `{cherry: true, apple: true, mincemeat: false}`            |
| Literal array              | `['cherries', 'flour', 'sugar']`                           |
| Spread em literal array    | `['apples', 'flour', …]`                                   |
| Calls                      | `bake(ingredients)`                                        |
| New                        | `new Oven()`                                               |
| Property access            | `pie.slice`                                                |
| Array index                | `ingredients[0]`                                           |
| Identity reference         | `Component`                                                |
| A template string          | <code>`pie is ${multiplier} times better than cake`</code> |
| Literal string             | `'pi'`                                                     |
| Literal number             | `3.14153265`                                               |
| Literal boolean            | `true`                                                     |
| Literal null               | `null`                                                     |
| Operador prefixo suportado | `!cake`                                                    |
| Operador binário suportado | `a+b`                                                      |
| Operador condicional       | `a ? b : c`                                                |
| Parênteses                 | `(a+b)`                                                    |

Se uma expressão usa sintaxe não suportada, o collector escreve um nó de erro no arquivo `.metadata.json`.
O compilador mais tarde reporta o erro se precisar daquela parte de metadados para gerar o código da aplicação.

HELPFUL: Se você quiser que `ngc` reporte erros de sintaxe imediatamente em vez de produzir um arquivo `.metadata.json` com erros, defina a opção `strictMetadataEmit` no arquivo de configuração TypeScript.

```json

"angularCompilerOptions": {
  …
  "strictMetadataEmit" : true
}

```

Bibliotecas Angular têm esta opção para garantir que todos os arquivos `.metadata.json` do Angular estejam limpos e é uma boa prática fazer o mesmo ao construir suas próprias bibliotecas.

### Sem arrow functions

O compilador AOT não suporta [expressões de função](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/function)
e [arrow functions](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/Arrow_functions), também chamadas de funções _lambda_.

Considere o seguinte decorator de component:

```ts

@Component({
  …
  providers: [{provide: server, useFactory: () => new Server()}]
})

```

O collector AOT não suporta a arrow function, `() => new Server()`, em uma expressão de metadados.
Ele gera um nó de erro no lugar da função.
Quando o compilador mais tarde interpreta este nó, ele reporta um erro que convida você a transformar a arrow function em uma _função exportada_.

Você pode corrigir o erro convertendo para isto:

```ts

export function serverFactory() {
  return new Server();
}

@Component({
  …
  providers: [{provide: server, useFactory: serverFactory}]
})

```

Na versão 5 e posteriores, o compilador automaticamente realiza esta reescrita ao emitir o arquivo `.js`.

### Code folding

O compilador só pode resolver referências a símbolos **_exportados_**.
O collector, no entanto, pode avaliar uma expressão durante a coleta e registrar o resultado no `.metadata.json`, em vez da expressão original.
Isso permite que você faça uso limitado de símbolos não exportados dentro de expressões.

Por exemplo, o collector pode avaliar a expressão `1 + 2 + 3 + 4` e substituí-la pelo resultado, `10`.
Este processo é chamado de _folding_.
Uma expressão que pode ser reduzida desta maneira é _foldable_.

O collector pode avaliar referências a declarações `const` locais do módulo e declarações `var` e `let` inicializadas, efetivamente removendo-as do arquivo `.metadata.json`.

Considere a seguinte definição de component:

```angular-ts

const template = '<div>{{hero().name}}</div>';

@Component({
  selector: 'app-hero',
  template: template
})
export class HeroComponent {
  hero = input.required<Hero>();
}

```

O compilador não poderia referenciar a constante `template` porque ela não é exportada.
O collector, no entanto, pode fazer fold da constante `template` na definição de metadados incorporando seu conteúdo.
O efeito é o mesmo como se você tivesse escrito:

```angular-ts

@Component({
  selector: 'app-hero',
  template: '<div>{{hero().name}}</div>'
})
export class HeroComponent {
  hero = input.required<Hero>();
}

```

Não há mais uma referência a `template` e, portanto, nada para incomodar o compilador quando ele mais tarde interpretar a saída do _collector_ em `.metadata.json`.

Você pode levar este exemplo um passo adiante incluindo a constante `template` em outra expressão:

```angular-ts

const template = '<div>{{hero().name}}</div>';

@Component({
  selector: 'app-hero',
  template: template + '<div>{{hero().title}}</div>'
})
export class HeroComponent {
  hero = input.required<Hero>();
}

```

O collector reduz esta expressão à sua string _folded_ equivalente:

```angular-ts

'<div>{{hero().name}}</div><div>{{hero().title}}</div>'

```

#### Sintaxe foldable

A tabela a seguir descreve quais expressões o collector pode e não pode fazer fold:

| Sintaxe                       | Foldable                                  |
| :---------------------------- | :---------------------------------------- |
| Literal object                | sim                                       |
| Literal array                 | sim                                       |
| Spread em literal array       | não                                       |
| Calls                         | não                                       |
| New                           | não                                       |
| Property access               | sim, se o target for foldable             |
| Array index                   | sim, se target e index forem foldable     |
| Identity reference            | sim, se for uma referência a um local     |
| Um template sem substituições | sim                                       |
| Um template com substituições | sim, se as substituições forem foldable   |
| Literal string                | sim                                       |
| Literal number                | sim                                       |
| Literal boolean               | sim                                       |
| Literal null                  | sim                                       |
| Operador prefixo suportado    | sim, se o operando for foldable           |
| Operador binário suportado    | sim, se esquerda e direita forem foldable |
| Operador condicional          | sim, se a condição for foldable           |
| Parênteses                    | sim, se a expressão for foldable          |

Se uma expressão não é foldable, o collector a escreve em `.metadata.json` como uma [AST](https://en.wikipedia.org/wiki/Abstract*syntax*tree) para o compilador resolver.

## Fase 2: geração de código

O collector não tenta entender os metadados que coleta e envia para `.metadata.json`.
Ele representa os metadados da melhor forma possível e registra erros quando detecta uma violação de sintaxe de metadados.
É trabalho do compilador interpretar o `.metadata.json` na fase de geração de código.

O compilador entende todas as formas de sintaxe que o collector suporta, mas pode rejeitar metadados _sintaticamente_ corretos se a _semântica_ violar as regras do compilador.

### Símbolos públicos ou protegidos {#expression-syntax-limitations}

O compilador só pode referenciar símbolos _exportados_.

- Membros de classe component decorados devem ser public ou protected.
  Você não pode tornar uma propriedade `input()` private.

- Propriedades vinculadas a dados também devem ser public ou protected

### Classes e funções suportadas

O collector pode representar uma chamada de função ou criação de objeto com `new` desde que a sintaxe seja válida.
O compilador, no entanto, pode mais tarde se recusar a gerar uma chamada a uma função _específica_ ou criação de um objeto _específico_.

O compilador só pode criar instâncias de certas classes, suporta apenas decorators principais e suporta apenas chamadas a macros \(funções ou métodos estáticos\) que retornam expressões.

| Ação do compilador    | Detalhes                                                                                                                                                |
| :-------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Novas instâncias      | O compilador permite apenas metadados que criam instâncias da classe `InjectionToken` de `@angular/core`.                                               |
| Decorators suportados | O compilador suporta apenas metadados para os [decorators Angular no módulo `@angular/core`](api/core#decorators).                                      |
| Chamadas de função    | Factory functions devem ser funções exportadas e nomeadas. O compilador AOT não suporta expressões lambda \("arrow functions"\) para factory functions. |

### Chamadas de funções e métodos estáticos

O collector aceita qualquer função ou método estático que contenha uma única instrução `return`.
O compilador, no entanto, suporta apenas macros na forma de funções ou métodos estáticos que retornam uma _expressão_.

Por exemplo, considere a seguinte função:

```ts

export function wrapInArray<T>(value: T): T[] {
  return [value];
}

```

Você pode chamar `wrapInArray` em uma definição de metadados porque ela retorna o valor de uma expressão que está em conformidade com o subconjunto restritivo de JavaScript do compilador.

Você pode usar `wrapInArray()` assim:

```ts

@NgModule({
  declarations: wrapInArray(TypicalComponent)
})
export class TypicalModule {}

```

O compilador trata este uso como se você tivesse escrito:

```ts

@NgModule({
  declarations: [TypicalComponent]
})
export class TypicalModule {}

```

O [`RouterModule`](api/router/RouterModule) do Angular exporta dois métodos estáticos macro, `forRoot` e `forChild`, para ajudar a declarar rotas raiz e filhas.
Revise o [código fonte](https://github.com/angular/angular/blob/main/packages/router/src/router_module.ts#L139 'Código fonte do RouterModule.forRoot')
para esses métodos para ver como macros podem simplificar a configuração de [NgModules](guide/ngmodules) complexos.

### Reescrita de metadados

O compilador trata literais de objeto contendo os campos `useClass`, `useValue`, `useFactory` e `data` de forma especial, convertendo a expressão que inicializa um desses campos em uma variável exportada que substitui a expressão.
Este processo de reescrita dessas expressões remove todas as restrições sobre o que pode estar nelas porque
o compilador não precisa saber o valor da expressão — ele só precisa ser capaz de gerar uma referência ao valor.

Você pode escrever algo como:

```ts

class TypicalServer {

}

@NgModule({
  providers: [{provide: SERVER, useFactory: () => TypicalServer}]
})
export class TypicalModule {}

```

Sem reescrita, isso seria inválido porque lambdas não são suportadas e `TypicalServer` não é exportado.
Para permitir isso, o compilador automaticamente reescreve isso para algo como:

```ts

class TypicalServer {

}

export const θ0 = () => new TypicalServer();

@NgModule({
  providers: [{provide: SERVER, useFactory: θ0}]
})
export class TypicalModule {}

```

Isso permite que o compilador gere uma referência a `θ0` na factory sem ter que saber qual é o valor de `θ0`.

O compilador faz a reescrita durante a emissão do arquivo `.js`.
No entanto, ele não reescreve o arquivo `.d.ts`, então o TypeScript não o reconhece como sendo uma exportação.
E isso não interfere com a API exportada do módulo ES.

## Fase 3: Verificação de tipo de template

Uma das características mais úteis do compilador Angular é a capacidade de verificar tipos de expressões dentro de templates e capturar quaisquer erros antes que causem falhas em tempo de execução.
Na fase de verificação de tipo de template, o template compiler Angular usa o compilador TypeScript para validar as expressões de binding em templates.

Ative esta fase explicitamente adicionando a opção de compilador `"fullTemplateTypeCheck"` nas `"angularCompilerOptions"` do arquivo de configuração TypeScript do projeto
(veja [Opções do Compilador Angular](reference/configs/angular-compiler-options)).

A validação de template produz mensagens de erro quando um erro de tipo é detectado em uma expressão de binding de template, similar a como erros de tipo são reportados pelo compilador TypeScript contra código em um arquivo `.ts`.

Por exemplo, considere o seguinte component:

```angular-ts

@Component({
  selector: 'my-component',
  template: '{{person.addresss.street}}'
})
class MyComponent {
  person?: Person;
}

```

Isso produz o seguinte erro:

<docs-code hideCopy language="shell">

my.component.ts.MyComponent.html(1,1): : Property 'addresss' does not exist on type 'Person'. Did you mean 'address'?

</docs-code>

O nome do arquivo reportado na mensagem de erro, `my.component.ts.MyComponent.html`, é um arquivo sintético
gerado pelo template compiler que contém o conteúdo do template da classe `MyComponent`.
O compilador nunca grava este arquivo no disco.
Os números de linha e coluna são relativos à string de template na anotação `@Component` da classe, `MyComponent` neste caso.
Se um component usa `templateUrl` em vez de `template`, os erros são reportados no arquivo HTML referenciado pelo `templateUrl` em vez de um arquivo sintético.

A localização do erro é o início do nó de texto que contém a expressão de interpolação com o erro.
Se o erro está em um binding de atributo como `[value]="person.address.street"`, a localização do erro
é a localização do atributo que contém o erro.

A validação usa o verificador de tipo TypeScript e as opções fornecidas ao compilador TypeScript para controlar quão detalhada é a validação de tipo.
Por exemplo, se `strictTypeChecks` é especificado, o erro

<docs-code hideCopy language="shell">

my.component.ts.MyComponent.html(1,1): : Object is possibly 'undefined'

</docs-code>

é reportado assim como a mensagem de erro acima.

### Type narrowing

A expressão usada em uma diretiva `ngIf` é usada para estreitar uniões de tipo no template compiler Angular, da mesma forma que a expressão `if` faz em TypeScript.
Por exemplo, para evitar o erro `Object is possibly 'undefined'` no template acima, modifique-o para emitir a interpolação apenas se o valor de `person` estiver inicializado como mostrado abaixo:

```angular-ts

@Component({
  selector: 'my-component',
  template: '<span *ngIf="person"> {{person.address.street}} </span>'
})
class MyComponent {
  person?: Person;
}

```

Usar `*ngIf` permite ao compilador TypeScript inferir que o `person` usado na expressão de binding nunca será `undefined`.

Para mais informações sobre type narrowing de input, veja [Melhorando a verificação de tipo de template para diretivas personalizadas](guide/directives/structural-directives#directive-type-checks).

### Operador de asserção de tipo não-nulo

Use o operador de asserção de tipo não-nulo para suprimir o erro `Object is possibly 'undefined'` quando for inconveniente usar `*ngIf` ou quando alguma restrição no component garante que a expressão sempre será não-nula quando a expressão de binding for interpolada.

No exemplo a seguir, as propriedades `person` e `address` são sempre definidas juntas, implicando que `address` sempre é não-nula se `person` for não-nula.
Não há uma maneira conveniente de descrever esta restrição para o TypeScript e o template compiler, mas o erro é suprimido no exemplo usando `address!.street`.

```ts

@Component({
  selector: 'my-component',
  template: '<span *ngIf="person"> {{person.name}} lives on {{address!.street}} </span>'
})
class MyComponent {
  person?: Person;
  address?: Address;

  setData(person: Person, address: Address) {
    this.person = person;
    this.address = address;
  }
}

```

O operador de asserção não-nulo deve ser usado com moderação, pois a refatoração do component pode quebrar esta restrição.

Neste exemplo, é recomendado incluir a verificação de `address` no `*ngIf` como mostrado abaixo:

```ts

@Component({
  selector: 'my-component',
  template: '<span *ngIf="person && address"> {{person.name}} lives on {{address.street}} </span>'
})
class MyComponent {
  person?: Person;
  address?: Address;

  setData(person: Person, address: Address) {
    this.person = person;
    this.address = address;
  }
}

```
