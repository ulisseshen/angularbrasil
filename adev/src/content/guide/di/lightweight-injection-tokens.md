<!-- ia-translate: true -->
# Otimizando o tamanho da aplicação cliente com lightweight injection tokens

Esta página fornece uma visão geral conceitual de uma técnica de dependency injection que é recomendada para desenvolvedores de bibliotecas.
Projetar sua biblioteca com _lightweight injection tokens_ ajuda a otimizar o tamanho do bundle de aplicações cliente que usam sua biblioteca.

Você pode gerenciar a estrutura de dependência entre seus components e injectable services para otimizar o tamanho do bundle usando tree-shakable providers.
Isso normalmente garante que se um component ou service fornecido nunca for realmente usado pela aplicação, o compilador pode remover seu código do bundle.

Devido à forma como o Angular armazena injection tokens, é possível que tal component ou service não utilizado acabe no bundle de qualquer forma.
Esta página descreve um padrão de design de dependency injection que suporta tree-shaking adequado usando lightweight injection tokens.

O padrão de design de lightweight injection token é especialmente importante para desenvolvedores de bibliotecas.
Ele garante que quando uma aplicação usa apenas algumas das capacidades da sua biblioteca, o código não usado pode ser eliminado do bundle da aplicação cliente.

Quando uma aplicação usa sua biblioteca, pode haver alguns services que sua biblioteca fornece que a aplicação cliente não usa.
Neste caso, o desenvolvedor da aplicação deve esperar que o service seja tree-shaken, e não contribua para o tamanho da aplicação compilada.
Como o desenvolvedor da aplicação não pode saber sobre ou remediar um problema de tree-shaking na biblioteca, é responsabilidade do desenvolvedor da biblioteca fazê-lo.
Para prevenir a retenção de components não usados, sua biblioteca deve usar o padrão de design de lightweight injection token.

## Quando tokens são retidos

Para explicar melhor a condição sob a qual a retenção de token ocorre, considere uma biblioteca que fornece um component library-card.
Este component contém um corpo e pode conter um header opcional:

<docs-code language="html">

<lib-card>;
<lib-header>…</lib-header>;
</lib-card>;

</docs-code>

Em uma implementação provável, o component `<lib-card>` usa `@ContentChild()` ou `@ContentChildren()` para obter `<lib-header>` e `<lib-body>`, como no seguinte:

<docs-code language="typescript" highlight="[12]">
@Component({
  selector: 'lib-header',
  …,
})
class LibHeaderComponent {}

@Component({
selector: 'lib-card',
…,
})
class LibCardComponent {
@ContentChild(LibHeaderComponent) header: LibHeaderComponent|null = null;
}

</docs-code>

Como `<lib-header>` é opcional, o elemento pode aparecer no template em sua forma mínima, `<lib-card></lib-card>`.
Neste caso, `<lib-header>` não é usado e você esperaria que fosse tree-shaken, mas isso não é o que acontece.
Isso ocorre porque `LibCardComponent` na verdade contém duas referências ao `LibHeaderComponent`:

<docs-code language="typescript">
@ContentChild(LibHeaderComponent) header: LibHeaderComponent;
</docs-code>

- Uma dessas referências está na _posição de tipo_-- ou seja, ela especifica `LibHeaderComponent` como um tipo: `header: LibHeaderComponent;`.
- A outra referência está na _posição de valor_-- ou seja, LibHeaderComponent é o valor do parâmetro decorator `@ContentChild()`: `@ContentChild(LibHeaderComponent)`.

O compilador lida com referências de token nessas posições de forma diferente:

- O compilador apaga referências de _posição de tipo_ após conversão do TypeScript, então elas não têm impacto no tree-shaking.
- O compilador deve manter referências de _posição de valor_ em tempo de execução, o que **previne** o component de ser tree-shaken.

No exemplo, o compilador retém o token `LibHeaderComponent` que ocorre na posição de valor.
Isso previne o component referenciado de ser tree-shaken, mesmo se a aplicação não usar realmente `<lib-header>` em lugar algum.
Se o código, template e estilos do `LibHeaderComponent` se combinarem para se tornar muito grandes, incluí-lo desnecessariamente pode aumentar significativamente o tamanho da aplicação cliente.

## Quando usar o padrão de lightweight injection token

O problema de tree-shaking surge quando um component é usado como um injection token.
Há dois casos quando isso pode acontecer:

- O token é usado na posição de valor de uma [content query](guide/components/queries#content-queries).
- O token é usado como um especificador de tipo para injeção de constructor.

No exemplo a seguir, ambos os usos do token `OtherComponent` causam retenção de `OtherComponent`, prevenindo-o de ser tree-shaken quando não é usado:

<docs-code language="typescript" highlight="[[2],[4]]">
class MyComponent {
  constructor(@Optional() other: OtherComponent) {}

@ContentChild(OtherComponent) other: OtherComponent|null;
}
</docs-code>

Embora tokens usados apenas como especificadores de tipo sejam removidos quando convertidos para JavaScript, todos os tokens usados para dependency injection são necessários em tempo de execução.
Estes efetivamente mudam `constructor(@Optional() other: OtherComponent)` para `constructor(@Optional() @Inject(OtherComponent) other)`.
O token está agora em uma posição de valor, o que faz com que o tree-shaker mantenha a referência.

ÚTIL: Bibliotecas devem usar [tree-shakable providers](guide/di/dependency-injection#providing-dependency) para todos os services, fornecendo dependências no nível raiz ao invés de em components ou modules.

## Usando lightweight injection tokens

O padrão de design de lightweight injection token consiste em usar uma pequena classe abstrata como um injection token, e fornecer a implementação real em um estágio posterior.
A classe abstrata é retida, não tree-shaken, mas ela é pequena e não tem impacto material no tamanho da aplicação.

O exemplo a seguir mostra como isso funciona para o `LibHeaderComponent`:

<docs-code language="typescript" language="[[1],[6],[17]]">
abstract class LibHeaderToken {}

@Component({
selector: 'lib-header',
providers: [
{provide: LibHeaderToken, useExisting: LibHeaderComponent}
]
…,
})
class LibHeaderComponent extends LibHeaderToken {}

@Component({
selector: 'lib-card',
…,
})
class LibCardComponent {
@ContentChild(LibHeaderToken) header: LibHeaderToken|null = null;
}
</docs-code>

Neste exemplo, a implementação de `LibCardComponent` não se refere mais a `LibHeaderComponent` nem na posição de tipo nem na posição de valor.
Isso permite que o tree-shaking completo de `LibHeaderComponent` ocorra.
O `LibHeaderToken` é retido, mas é apenas uma declaração de classe, sem implementação concreta.
É pequeno e não impacta materialmente o tamanho da aplicação quando retido após compilação.

Em vez disso, `LibHeaderComponent` em si implementa a classe abstrata `LibHeaderToken`.
Você pode usar com segurança esse token como o provider na definição do component, permitindo que o Angular injete corretamente o tipo concreto.

Para resumir, o padrão de lightweight injection token consiste do seguinte:

1. Um lightweight injection token que é representado como uma classe abstrata.
1. Uma definição de component que implementa a classe abstrata.
1. Injeção do padrão lightweight, usando `@ContentChild()` ou `@ContentChildren()`.
1. Um provider na implementação do lightweight injection token que associa o lightweight injection token com a implementação.

### Use o lightweight injection token para definição de API

Um component que injeta um lightweight injection token pode precisar invocar um método na classe injetada.
O token agora é uma classe abstrata. Como o component injetável implementa aquela classe, você também deve declarar um método abstrato na classe abstrata de lightweight injection token.
A implementação do método, com toda sua sobrecarga de código, reside no component injetável que pode ser tree-shaken.
Isso permite que o pai se comunique com o filho, se estiver presente, de maneira type-safe.

Por exemplo, o `LibCardComponent` agora consulta `LibHeaderToken` ao invés de `LibHeaderComponent`.
O exemplo a seguir mostra como o padrão permite que `LibCardComponent` se comunique com o `LibHeaderComponent` sem realmente se referir a `LibHeaderComponent`:

<docs-code language="typescript" highlight="[[3],[13,16],[27]]">
abstract class LibHeaderToken {
  abstract doSomething(): void;
}

@Component({
selector: 'lib-header',
providers: [
{provide: LibHeaderToken, useExisting: LibHeaderComponent}
]
…,
})
class LibHeaderComponent extends LibHeaderToken {
doSomething(): void {
// Concrete implementation of `doSomething`
}
}

@Component({
selector: 'lib-card',
…,
})
class LibCardComponent implement AfterContentInit {
@ContentChild(LibHeaderToken) header: LibHeaderToken|null = null;

ngAfterContentInit(): void {
if (this.header !== null) {
this.header?.doSomething();
}
}
}
</docs-code>

Neste exemplo, o pai consulta o token para obter o component filho, e armazena a referência do component resultante se estiver presente.
Antes de chamar um método no filho, o component pai verifica se o component filho está presente.
Se o component filho foi tree-shaken, não há referência em runtime a ele, e nenhuma chamada ao seu método.

### Nomeando seu lightweight injection token

Lightweight injection tokens são úteis apenas com components.
O guia de estilo do Angular sugere que você nomeie components usando o sufixo "Component".
O exemplo "LibHeaderComponent" segue esta convenção.

Você deve manter a relação entre o component e seu token enquanto ainda os distingue.
O estilo recomendado é usar o nome base do component com o sufixo "`Token`" para nomear seus lightweight injection tokens: "`LibHeaderToken`."
