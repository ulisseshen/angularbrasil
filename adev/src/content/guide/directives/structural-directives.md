<!-- ia-translate: true -->

# Structural directives {#structural-directives}

Structural directives são directives aplicadas a um elemento `<ng-template>` que renderizam condicionalmente ou repetidamente o conteúdo daquele `<ng-template>`.

## Exemplo de caso de uso

Neste guia você construirá uma structural directive que busca dados de uma fonte de dados fornecida e renderiza seu template quando esses dados estão disponíveis. Esta directive é chamada `SelectDirective`, após a palavra-chave SQL `SELECT`, e a combina com um seletor de atributo `[select]`.

`SelectDirective` terá um input nomeando a fonte de dados a ser usada, que você chamará de `selectFrom`. O prefixo `select` para este input é importante para a [sintaxe abreviada](#structural-directive-shorthand). A directive instanciará seu `<ng-template>` com um contexto de template fornecendo os dados selecionados.

O seguinte é um exemplo de uso desta directive diretamente em um `<ng-template>`:

```angular-html
<ng-template select let-data [selectFrom]="source">
  <p>The data is: {{ data }}</p>
</ng-template>
```

A structural directive pode aguardar que os dados fiquem disponíveis e então renderizar seu `<ng-template>`.

ÚTIL: Note que o elemento `<ng-template>` do Angular define um template que não renderiza nada por padrão, se você apenas envolver elementos em um `<ng-template>` sem aplicar uma structural directive, esses elementos não serão renderizados.

Para mais informações, veja a documentação da [API ng-template](api/core/ng-template).

## Sintaxe abreviada de structural directive {#structural-directive-shorthand}

O Angular suporta uma sintaxe abreviada para structural directives que evita a necessidade de criar explicitamente um elemento `<ng-template>`.

Structural directives podem ser aplicadas diretamente em um elemento prefixando o seletor de atributo da directive com um asterisco (`*`), como `*select`. O Angular transforma o asterisco na frente de uma structural directive em um `<ng-template>` que hospeda a directive e envolve o elemento e seus descendentes.

Você pode usar isso com `SelectDirective` da seguinte forma:

```angular-html
<p *select="let data from source">The data is: {{data}}</p>
```

Este exemplo mostra a flexibilidade da sintaxe abreviada de structural directive, que às vezes é chamada de _microsyntax_.

Quando usada desta forma, apenas a structural directive e seus bindings são aplicados ao `<ng-template>`. Quaisquer outros atributos ou bindings na tag `<p>` são deixados intactos. Por exemplo, essas duas formas são equivalentes:

```angular-html
<!-- Sintaxe abreviada: -->
<p class="data-view" *select="let data from source">The data is: {{data}}</p>

<!-- Sintaxe longa: -->
<ng-template select let-data [selectFrom]="source">
  <p class="data-view">The data is: {{data}}</p>
</ng-template>
```

A sintaxe abreviada é expandida através de um conjunto de convenções. Uma [gramática](#structural-directive-syntax-reference) mais completa é definida abaixo, mas no exemplo acima, esta transformação pode ser explicada da seguinte forma:

A primeira parte da expressão `*select` é `let data`, que declara uma variável de template `data`. Como nenhuma atribuição segue, a variável de template é vinculada à propriedade do contexto de template `$implicit`.

A segunda parte da sintaxe é um par chave-expressão, `from source`. `from` é uma chave de binding e `source` é uma expressão de template regular. Chaves de binding são mapeadas para propriedades transformando-as para PascalCase e prefixando com o seletor da structural directive. A chave `from` é mapeada para `selectFrom`, que é então vinculada à expressão `source`. É por isso que muitas structural directives terão inputs que são todos prefixados com o seletor da structural directive.

## Uma structural directive por elemento

Você pode aplicar apenas uma structural directive por elemento ao usar a sintaxe abreviada. Isso ocorre porque há apenas um elemento `<ng-template>` no qual essa directive é desembrulhada. Múltiplas directives exigiriam múltiplos `<ng-template>` aninhados, e não está claro qual directive deveria ser a primeira. `<ng-container>` pode ser usado para criar camadas wrapper quando múltiplas structural directives precisam ser aplicadas ao redor do mesmo elemento DOM físico ou component, o que permite ao usuário definir a estrutura aninhada.

## Criando uma structural directive

Esta seção orienta você na criação da `SelectDirective`.

<docs-workflow>
<docs-step title="Gerar a directive">
Usando o Angular CLI, execute o seguinte comando, onde `select` é o nome da directive:

```shell
ng generate directive select
```

O Angular cria a classe da directive e especifica o seletor CSS, `[select]`, que identifica a directive em um template.
</docs-step>
<docs-step title="Tornar a directive estrutural {#typing-the-directives-context}">
Importe `TemplateRef` e `ViewContainerRef`. Injete `TemplateRef` e `ViewContainerRef` na directive como propriedades privadas.

```ts
import {Directive, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[select]',
})
export class SelectDirective {
  private templateRef = inject(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);
}

```

</docs-step>
<docs-step title="Adicionar o input 'selectFrom'">
Adicione uma propriedade `input()` `selectFrom`.

```ts
export class SelectDirective {
  // ...

  selectFrom = input.required<DataSource>();
}
```

</docs-step>
<docs-step title="Adicionar a lógica de negócio">
Com `SelectDirective` agora estruturada como uma structural directive com seu input, você pode agora adicionar a lógica para buscar os dados e renderizar o template com eles:

```ts
export class SelectDirective {
  // ...

  async ngOnInit() {
    const data = await this.selectFrom.load();
    this.viewContainerRef.createEmbeddedView(this.templateRef, {
      // Cria a embedded view com um objeto de contexto que contém
      // os dados através da chave `$implicit`.
      $implicit: data,
    });
  }
}
```

</docs-step>
</docs-workflow>

É isso - `SelectDirective` está pronta e funcionando. Um próximo passo poderia ser [adicionar suporte à verificação de tipo de template](#typing-the-directives-context).

## Referência de sintaxe de structural directive {#structural-directive-syntax-reference}

Quando você escreve suas próprias structural directives, use a seguinte sintaxe:

<docs-code hideCopy language="typescript">

_:prefix="( :let | :expression ) (';' | ',')? ( :let | :as | :keyExp )_"

</docs-code>

Os seguintes padrões descrevem cada parte da gramática de structural directive:

```ts
as = :export "as" :local ";"?
keyExp = :key ":"? :expression ("as" :local)? ";"?
let = "let" :local "=" :export ";"?
```

| Palavra-chave | Detalhes                                        |
| :------------ | :---------------------------------------------- |
| `prefix`      | Chave de atributo HTML                          |
| `key`         | Chave de atributo HTML                          |
| `local`       | Nome da variável local usada no template        |
| `export`      | Valor exportado pela directive sob um dado nome |
| `expression`  | Expressão Angular padrão                        |

### Como o Angular traduz a sintaxe abreviada

O Angular traduz a sintaxe abreviada de structural directive para a sintaxe de binding normal da seguinte forma:

| Abreviado                       | Tradução                                                     |
| :------------------------------ | :----------------------------------------------------------- |
| `prefix` e `expression` sozinho | `[prefix]="expression"`                                      |
| `keyExp`                        | `[prefixKey]="expression"` (O `prefix` é adicionado à `key`) |
| `let local`                     | `let-local="export"`                                         |

### Exemplos de sintaxe abreviada

A tabela a seguir fornece exemplos de sintaxe abreviada:

| Abreviado                                                             | Como o Angular interpreta a sintaxe                                                                           |
| :-------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------ |
| `*myDir="let item of [1,2,3]"`                                        | `<ng-template myDir let-item [myDirOf]="[1, 2, 3]">`                                                          |
| `*myDir="let item of [1,2,3] as items; trackBy: myTrack; index as i"` | `<ng-template myDir let-item [myDirOf]="[1,2,3]" let-items="myDirOf" [myDirTrackBy]="myTrack" let-i="index">` |
| `*ngComponentOutlet="componentClass";`                                | `<ng-template [ngComponentOutlet]="componentClass">`                                                          |
| `*ngComponentOutlet="componentClass; inputs: myInputs";`              | `<ng-template [ngComponentOutlet]="componentClass" [ngComponentOutletInputs]="myInputs">`                     |
| `*myDir="exp as value"`                                               | `<ng-template [myDir]="exp" let-value="myDir">`                                                               |

## Melhorando a verificação de tipo de template para directives personalizadas

Você pode melhorar a verificação de tipo de template para directives personalizadas adicionando guards de template à sua definição de directive.
Esses guards ajudam o verificador de tipo de template Angular a encontrar erros no template em tempo de compilação, o que pode evitar erros em runtime.
Dois tipos diferentes de guards são possíveis:

- `ngTemplateGuard_(input)` permite que você controle como uma expressão de input deve ser restringida com base no tipo de um input específico.
- `ngTemplateContextGuard` é usado para determinar o tipo do objeto de contexto para o template, com base no tipo da própria directive.

Esta seção fornece exemplos de ambos os tipos de guards.
Para mais informações, veja [Verificação de tipo de template](tools/cli/template-typecheck 'Guia de verificação de tipo de template').

### Restrição de tipo com template guards

Uma structural directive em um template controla se esse template é renderizado em runtime. Algumas structural directives querem realizar restrição de tipo com base no tipo da expressão de input.

Existem duas restrições possíveis com input guards:

- Restringir a expressão de input com base em uma função de asserção de tipo TypeScript.
- Restringir a expressão de input com base em sua veracidade.

Para restringir a expressão de input definindo uma função de asserção de tipo:

```ts
// Esta directive apenas renderiza seu template se o actor for um usuário.
// Você quer afirmar que dentro do template, o tipo da expressão `actor`
// é restringido para `User`.
@Directive(...)
class ActorIsUser {
  actor = input<User | Robot>();

  static ngTemplateGuard_actor(dir: ActorIsUser, expr: User | Robot): expr is User {
    // A declaração de retorno é desnecessária na prática, mas incluída para
    // prevenir erros do TypeScript.
    return true;
  }
}
```

A verificação de tipo se comportará dentro do template como se o `ngTemplateGuard_actor` tivesse sido afirmado na expressão vinculada ao input.

Algumas directives apenas renderizam seus templates quando um input é verdadeiro. Não é possível capturar toda a semântica de veracidade em uma função de asserção de tipo, então, em vez disso, um tipo literal de `'binding'` pode ser usado para sinalizar ao verificador de tipo de template que a própria expressão de binding deve ser usada como guard:

```ts
@Directive(...)
class CustomIf {
  condition = input.required<boolean>();

  static ngTemplateGuard_condition: 'binding';
}
```

O verificador de tipo de template se comportará como se a expressão vinculada a `condition` fosse afirmada como verdadeira dentro do template.

### Tipando o contexto da directive

Se sua structural directive fornece um contexto para o template instanciado, você pode tipá-lo adequadamente dentro do template fornecendo uma função de asserção de tipo estática `ngTemplateContextGuard`. Esta função pode usar o tipo da directive para derivar o tipo do contexto, o que é útil quando o tipo da directive é genérico.

Para a `SelectDirective` descrita acima, você pode implementar um `ngTemplateContextGuard` para especificar corretamente o tipo de dados, mesmo se a fonte de dados for genérica.

```ts
// Declare uma interface para o contexto do template:
export interface SelectTemplateContext<T> {
  $implicit: T;
}

@Directive(...)
export class SelectDirective<T> {
  // O tipo genérico `T` da directive será inferido do tipo `DataSource`
  // passado para o input.
  selectFrom = input.required<DataSource<T>>();

  // Restringe o tipo do contexto usando o tipo genérico da directive.
  static ngTemplateContextGuard<T>(dir: SelectDirective<T>, ctx: any): ctx is SelectTemplateContext<T> {
    // Como antes, o corpo do guard não é usado em runtime, e incluído apenas para evitar
    // erros do TypeScript.
    return true;
  }
}
```
