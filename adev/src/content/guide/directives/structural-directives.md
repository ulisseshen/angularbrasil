<!-- ia-translate: true -->
# Structural directives

Structural directives são directives aplicadas a um elemento `<ng-template>` que renderizam condicionalmente ou repetidamente o conteúdo desse `<ng-template>`.

Para renderização condicional e repetida do dia a dia, use os [blocos de control flow](guide/templates/control-flow) nativos do Angular (`@if`, `@for` e `@switch`). Escreva uma structural directive quando precisar de um comportamento de renderização reutilizável que o control flow não cobre, como restringir um conteúdo por trás de uma verificação de permissão ou fornecer um template com dados de uma fonte externa.

## Exemplo de caso de uso {#example-use-case}

Este guia usa uma directive chamada `SelectDirective` como exemplo ao longo do texto. A directive busca dados de uma fonte de dados informada e renderiza seu template quando esses dados estão disponíveis. Ela recebe o nome da palavra-chave SQL `SELECT` e é associada por um seletor de atributo, `[select]`.

`SelectDirective` tem um input que indica a fonte de dados a ser usada, chamado `selectFrom`. O prefixo `select` desse input é importante para a [sintaxe abreviada](#structural-directive-shorthand). A directive instancia seu `<ng-template>` com um contexto de template que fornece os dados selecionados.

Usar essa directive diretamente em um `<ng-template>` fica assim:

```angular-html
<ng-template select let-data [selectFrom]="source">
  <p>The data is: {{ data }}</p>
</ng-template>
```

A structural directive pode aguardar até que os dados estejam disponíveis e então renderizar seu `<ng-template>`.

HELPFUL: O elemento `<ng-template>` do Angular define um template que não renderiza nada por padrão. Se você envolver elementos em um `<ng-template>` sem aplicar uma structural directive, esses elementos não são renderizados.

Para mais informações, veja a documentação da [API ng-template](api/core/ng-template).

## Sintaxe abreviada de structural directive {#structural-directive-shorthand}

O Angular oferece uma sintaxe abreviada para structural directives, que evita a necessidade de escrever explicitamente um elemento `<ng-template>`.

Structural directives podem ser aplicadas diretamente a um elemento prefixando o seletor de atributo da directive com um asterisco (`*`), como `*select`. O Angular transforma o asterisco à frente de uma structural directive em um `<ng-template>` que hospeda a directive e envolve o elemento e seus descendentes.

Você pode usar isso com `SelectDirective` assim:

```angular-html
<p *select="let data; from: source">The data is: {{ data }}</p>
```

Este exemplo mostra a flexibilidade da sintaxe abreviada de structural directive, que às vezes é chamada de _microsyntax_.

Quando usada dessa forma, apenas a structural directive e seus bindings são aplicados ao `<ng-template>`. Quaisquer outros atributos ou bindings na tag `<p>` são mantidos como estão. Por exemplo, estas duas formas são equivalentes:

```angular-html
<!-- Sintaxe abreviada: -->
<p class="data-view" *select="let data; from: source">The data is: {{ data }}</p>

<!-- Sintaxe longa: -->
<ng-template select let-data [selectFrom]="source">
  <p class="data-view">The data is: {{ data }}</p>
</ng-template>
```

A sintaxe abreviada é expandida por meio de um conjunto de convenções. Uma [gramática](#structural-directive-syntax-reference) mais completa é definida abaixo, mas, no exemplo acima, essa transformação pode ser explicada assim:

A primeira parte da expressão `*select` é `let data`, que declara uma variável de template `data`. Como nenhuma atribuição segue, a variável de template é vinculada à propriedade `$implicit` do contexto de template.

A segunda parte da sintaxe é um par chave-expressão, `from source`. `from` é uma chave de binding e `source` é uma expressão de template comum. As chaves de binding são mapeadas para propriedades transformando-as em PascalCase e prefixando-as com o seletor da structural directive. A chave `from` é mapeada para `selectFrom`, que então é vinculada à expressão `source`. É por isso que muitas structural directives têm inputs que são todos prefixados com o seletor da structural directive.

## Uma structural directive por elemento {#one-structural-directive-per-element}

Você pode aplicar apenas uma structural directive por elemento ao usar a sintaxe abreviada. Isso acontece porque há apenas um elemento `<ng-template>` no qual essa directive é desembrulhada. Várias directives exigiriam vários `<ng-template>` aninhados, e não ficaria claro qual directive deveria vir primeiro. Um `<ng-container>` pode ser usado para criar camadas de encapsulamento quando várias structural directives precisam ser aplicadas em volta do mesmo elemento DOM físico ou component, o que permite ao usuário definir a estrutura aninhada.

## Criando uma structural directive {#creating-a-structural-directive}

Uma structural directive é uma classe de directive que injeta duas dependências:

- [`TemplateRef`](api/core/TemplateRef) dá à directive acesso ao conteúdo do `<ng-template>` ao qual ela é aplicada.
- [`ViewContainerRef`](api/core/ViewContainerRef) representa o local no DOM onde a directive pode renderizar esse template.

A directive controla a renderização criando, ou não criando, embedded views a partir do template no view container. A `SelectDirective` completa fica assim:

```ts
import {Directive, TemplateRef, ViewContainerRef, inject, input} from '@angular/core';

export interface DataSource<T> {
  load(): Promise<T>;
}

@Directive({
  selector: '[select]',
})
export class SelectDirective {
  private templateRef = inject(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);

  selectFrom = input.required<DataSource<unknown>>();

  async ngOnInit() {
    const data = await this.selectFrom().load();
    this.viewContainerRef.createEmbeddedView(this.templateRef, {
      // Cria a embedded view com um objeto de contexto que contém
      // os dados pela chave `$implicit`.
      $implicit: data,
    });
  }
}
```

O input `selectFrom` indica a fonte de dados que a directive lê. Ele usa [`input.required()`](guide/components/inputs#required-inputs) porque a directive não consegue fazer nada útil sem uma fonte de dados.

Quando o Angular inicializa a directive, ele carrega os dados e então renderiza o template chamando `createEmbeddedView()`. O segundo argumento é o _objeto de contexto_ do template: valores aos quais o template pode vincular com declarações `let`. Atribuir os dados à chave `$implicit` faz deles o valor padrão recebido por `let-data` (ou `let data`, na sintaxe abreviada).

NOTE: Este exemplo renderiza seu template uma única vez, quando a directive é inicializada. Ele não é renderizado novamente quando a fonte de dados vinculada muda.

Depois que a directive funcionar, considere [adicionar suporte à verificação de tipo de template](#typing-the-directives-context).

HELPFUL: O comando CLI [`ng generate directive`](tools/cli/schematics) gera o esqueleto de uma directive junto com o arquivo de teste dela.

## Referência de sintaxe de structural directive {#structural-directive-syntax-reference}

Ao escrever suas próprias structural directives, use a seguinte sintaxe:

```ts {hideCopy}
_: prefix = "( :let | :expression ) (';' | ',')? ( :let | :as | :keyExp )_";
```

Os padrões a seguir descrevem cada parte da gramática de structural directive:

```ts
as = :export "as" :local ";"?
keyExp = :key ":"? :expression ("as" :local)? ";"?
let = "let" :local "=" :export ";"?
```

| Palavra-chave | Detalhes                                                  |
| :------------ | :-------------------------------------------------------- |
| `prefix`      | Chave de atributo HTML                                    |
| `key`         | Chave de atributo HTML                                    |
| `local`       | Nome da variável local usada no template                  |
| `export`      | Valor exportado pela directive sob um nome específico     |
| `expression`  | Expressão Angular padrão                                  |

### Como o Angular traduz a sintaxe abreviada {#how-angular-translates-shorthand}

O Angular traduz a sintaxe abreviada de structural directive para a sintaxe normal de binding da seguinte forma:

| Sintaxe abreviada               | Tradução                                                     |
| :------------------------------ | :----------------------------------------------------------- |
| `prefix` e `expression` sozinho | `[prefix]="expression"`                                      |
| `keyExp`                        | `[prefixKey]="expression"` (O `prefix` é adicionado à `key`) |
| `let local`                     | `let-local="export"`                                         |

### Exemplos de sintaxe abreviada {#shorthand-examples}

A tabela a seguir traz exemplos de sintaxe abreviada:

| Sintaxe abreviada                                                     | Como o Angular interpreta a sintaxe                                                                           |
| :-------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------ |
| `*myDir="let item of [1,2,3]"`                                        | `<ng-template myDir let-item [myDirOf]="[1, 2, 3]">`                                                          |
| `*myDir="let item of [1,2,3] as items; trackBy: myTrack; index as i"` | `<ng-template myDir let-item [myDirOf]="[1,2,3]" let-items="myDirOf" [myDirTrackBy]="myTrack" let-i="index">` |
| `*ngComponentOutlet="componentClass"`                                 | `<ng-template [ngComponentOutlet]="componentClass">`                                                          |
| `*ngComponentOutlet="componentClass; inputs: myInputs"`               | `<ng-template [ngComponentOutlet]="componentClass" [ngComponentOutletInputs]="myInputs">`                     |
| `*myDir="exp as value"`                                               | `<ng-template [myDir]="exp" let-value="myDir">`                                                               |

## Melhorando a verificação de tipo de template para directives personalizadas {#improving-template-type-checking-for-custom-directives}

Você pode melhorar a verificação de tipo de template para directives personalizadas adicionando template guards à definição da directive.
Esses guards ajudam o verificador de tipo de template do Angular a encontrar erros no template em tempo de compilação, o que pode evitar erros em tempo de execução.
Há dois tipos diferentes de guards:

- `ngTemplateGuard_(input)` permite controlar como uma expressão de input deve ser restringida com base no tipo de um input específico.
- `ngTemplateContextGuard` é usado para determinar o tipo do objeto de contexto do template, com base no tipo da própria directive.

Esta seção traz exemplos dos dois tipos de guards.
Para mais informações, veja [Verificação de tipo de template](tools/cli/template-typecheck 'Guia de verificação de tipo de template').

### Restrição de tipo com template guards {#type-narrowing-with-template-guards}

Uma structural directive em um template controla se esse template é renderizado em tempo de execução. Algumas structural directives querem realizar restrição de tipo com base no tipo da expressão de input.

Existem duas restrições possíveis com input guards:

- Restringir a expressão de input com base em uma função de asserção de tipo do TypeScript.
- Restringir a expressão de input com base em sua veracidade (truthiness).

Para restringir a expressão de input definindo uma função de asserção de tipo:

```ts
// Esta directive só renderiza seu template se o actor for um usuário.
// Você quer afirmar que, dentro do template, o tipo da expressão `actor`
// é restringido para `User`.
@Directive(...)
class ActorIsUser {
  actor = input<User | Robot>();

  static ngTemplateGuard_actor(dir: ActorIsUser, expr: User | Robot): expr is User {
    // A instrução return não é necessária na prática, mas está incluída para
    // evitar erros do TypeScript.
    return true;
  }
}
```

A verificação de tipo se comportará dentro do template como se `ngTemplateGuard_actor` tivesse sido afirmado sobre a expressão vinculada ao input.

Algumas directives só renderizam seus templates quando um input é truthy. Não é possível capturar toda a semântica de veracidade em uma função de asserção de tipo; por isso, um tipo literal `'binding'` pode ser usado para sinalizar ao verificador de tipo de template que a própria expressão de binding deve ser usada como guard:

```ts
@Directive(...)
class CustomIf {
  condition = input.required<boolean>();

  static ngTemplateGuard_condition: 'binding';
}
```

O verificador de tipo de template se comportará como se a expressão vinculada a `condition` tivesse sido afirmada como truthy dentro do template.

### Tipando o contexto da directive {#typing-the-directives-context}

Se sua structural directive fornece um contexto ao template instanciado, você pode tipá-lo corretamente dentro do template fornecendo uma função de asserção de tipo estática `ngTemplateContextGuard`. Essa função pode usar o tipo da directive para derivar o tipo do contexto, o que é útil quando o tipo da directive é genérico.

Para a `SelectDirective` descrita acima, você pode implementar um `ngTemplateContextGuard` para especificar corretamente o tipo dos dados, mesmo se a fonte de dados for genérica.

```ts
// Declare uma interface para o contexto do template:
export interface SelectTemplateContext<T> {
  $implicit: T;
}

@Directive(...)
export class SelectDirective<T> {
  // O tipo genérico `T` da directive será inferido a partir do tipo `DataSource`
  // passado ao input.
  selectFrom = input.required<DataSource<T>>();

  // Restringe o tipo do contexto usando o tipo genérico da directive.
  static ngTemplateContextGuard<T>(dir: SelectDirective<T>, ctx: any): ctx is SelectTemplateContext<T> {
    // Como antes, o corpo do guard não é usado em tempo de execução, e está incluído apenas para evitar
    // erros do TypeScript.
    return true;
  }
}
```

## Próximos passos {#whats-next}

<docs-pill-row>
  <docs-pill href="guide/directives/directive-composition-api" title="API de composição de directives"/>
  <docs-pill href="guide/templates/ng-template" title="ng-template"/>
  <docs-pill href="guide/templates/control-flow" title="Fluxo de controle"/>
</docs-pill-row>
