<!-- ia-translate: true -->
# Otimizando o tamanho da aplicação cliente com lightweight injection tokens {#optimizing-client-application-size-with-lightweight-injection-tokens}

Esta página fornece uma visão geral conceitual de uma técnica de injeção de dependência recomendada para desenvolvedores de bibliotecas.
Projetar sua biblioteca com _lightweight injection tokens_ ajuda a otimizar o tamanho do bundle das aplicações cliente que usam sua biblioteca.

Você pode gerenciar a estrutura de dependências entre seus components e services injetáveis para otimizar o tamanho do bundle, usando tree-shakable providers.
Isso normalmente garante que, se um component ou service fornecido nunca for realmente usado pela aplicação, o compilador pode remover o seu código do bundle.

Devido à forma como o Angular armazena os injection tokens, é possível que um component ou service não utilizado acabe no bundle de qualquer forma.
Esta página descreve um padrão de design de injeção de dependência que oferece suporte ao tree-shaking adequado, usando lightweight injection tokens.

O padrão de design de lightweight injection token é especialmente importante para desenvolvedores de bibliotecas.
Ele garante que, quando uma aplicação usa apenas algumas das capacidades da sua biblioteca, o código não utilizado pode ser eliminado do bundle da aplicação cliente.

Quando uma aplicação usa sua biblioteca, pode haver alguns services fornecidos pela biblioteca que a aplicação cliente não usa.
Nesse caso, o desenvolvedor da aplicação deve esperar que esse service sofra tree-shaking e não contribua para o tamanho da aplicação compilada.
Como o desenvolvedor da aplicação não pode conhecer nem corrigir um problema de tree-shaking na biblioteca, cabe ao desenvolvedor da biblioteca resolvê-lo.
Para evitar a retenção de components não utilizados, sua biblioteca deve usar o padrão de design de lightweight injection token.

## Quando tokens são retidos {#when-tokens-are-retained}

Para explicar melhor a condição sob a qual a retenção de tokens ocorre, considere uma biblioteca que fornece um component library-card.
Esse component contém um corpo e pode conter um header opcional:

```html
<lib-card>
  <lib-header>…</lib-header>
</lib-card>
```

Em uma implementação provável, o component `<lib-card>` usa `contentChild` ou `contentChildren` para obter `<lib-header>` e `<lib-body>`, como no exemplo a seguir:

```ts {highlight: [14]}
import {Component, contentChild} from '@angular/core';

@Component({
  selector: 'lib-header',
  …,
})
class LibHeader {}

@Component({
  selector: 'lib-card',
  …,
})
class LibCard {
  readonly header = contentChild(LibHeader);
}
```

Como `<lib-header>` é opcional, o elemento pode aparecer no template em sua forma mínima, `<lib-card />`.
Nesse caso, `<lib-header>` não é usado e você esperaria que sofresse tree-shaking, mas não é isso que acontece.
Isso acontece porque `LibCard` na verdade contém duas referências a `LibHeader`:

```ts
readonly header = contentChild(LibHeader);
```

- Uma dessas referências está na _posição de tipo_, ou seja, ela especifica `LibHeader` como um tipo: `readonly header: Signal<LibHeader|undefined>`.
- A outra referência está na _posição de valor_, ou seja, `LibHeader` é o valor passado para a função `contentChild`: `contentChild(LibHeader)`.

O compilador trata as referências de token nessas posições de forma diferente:

- O compilador apaga as referências em _posição de tipo_ após a conversão do TypeScript, então elas não têm impacto no tree-shaking.
- O compilador precisa manter as referências em _posição de valor_ em tempo de execução, o que **impede** o component de sofrer tree-shaking.

No exemplo, o compilador retém o token `LibHeader` que ocorre na posição de valor.
Isso impede que o component referenciado sofra tree-shaking, mesmo que a aplicação não use `<lib-header>` em lugar algum.
Se o código, o template e os estilos de `LibHeader` juntos ficarem muito grandes, incluí-lo desnecessariamente pode aumentar significativamente o tamanho da aplicação cliente.

## Quando usar o padrão de lightweight injection token {#when-to-use-the-lightweight-injection-token-pattern}

O problema de tree-shaking surge quando um component é usado como injection token.
Há dois casos em que isso pode acontecer:

- O token é usado na posição de valor de uma [content query](guide/components/queries#content-queries).
- O token é usado com a função `inject`.

No exemplo a seguir, ambos os usos do token `CustomOther` causam a retenção de `CustomOther`, impedindo que ele sofra tree-shaking quando não é usado:

```ts {highlight: [[2],[4]]}
class App {
  private readonly other = inject(CustomOther, {optional: true});

  readonly header = contentChild(CustomOther);
}
```

Embora tokens usados apenas como especificadores de tipo sejam removidos na conversão para JavaScript, todos os tokens usados para injeção de dependência são necessários em tempo de execução.
Ao usar `inject(CustomOther)`, `CustomOther` é passado como argumento de valor.
O token passa a estar em uma posição de valor, o que faz o tree-shaker manter a referência.

HELPFUL: Bibliotecas devem usar [tree-shakable providers](guide/di/defining-dependency-providers) para todos os services, fornecendo as dependências no nível raiz, em vez de em components ou modules.

## Usando lightweight injection tokens {#using-lightweight-injection-tokens}

O padrão de design de lightweight injection token consiste em usar uma pequena classe abstrata como injection token e fornecer a implementação real em uma etapa posterior.
A classe abstrata é retida, não sofre tree-shaking, mas é pequena e não tem impacto material no tamanho da aplicação.

O exemplo a seguir mostra como isso funciona para o `LibHeader`:

```ts {highlight: [[1],[5], [15]]}
abstract class LibHeaderToken {}

@Component({
  selector: 'lib-header',
  providers: [{provide: LibHeaderToken, useExisting: LibHeader}],
  …,
})
class LibHeader extends LibHeaderToken {}

@Component({
  selector: 'lib-card',
  …,
})
class LibCard {
  readonly header = contentChild(LibHeaderToken);
}
```

Neste exemplo, a implementação de `LibCard` não se refere mais a `LibHeader`, nem na posição de tipo nem na posição de valor.
Isso permite que `LibHeader` sofra tree-shaking completo.
O `LibHeaderToken` é retido, mas é apenas uma declaração de classe, sem implementação concreta.
Ele é pequeno e não impacta materialmente o tamanho da aplicação quando retido após a compilação.

Em vez disso, o próprio `LibHeader` implementa a classe abstrata `LibHeaderToken`.
Você pode usar com segurança esse token como provider na definição do component, permitindo que o Angular injete corretamente o tipo concreto.

Resumindo, o padrão de lightweight injection token consiste no seguinte:

1. Um lightweight injection token, representado como uma classe abstrata.
2. Uma definição de component que implementa a classe abstrata.
3. A injeção do padrão lightweight, usando `contentChild` ou `contentChildren`.
4. Um provider na implementação do lightweight injection token, que associa o lightweight injection token à implementação.

### Use o lightweight injection token para definir a API {#use-the-lightweight-injection-token-for-api-definition}

Um component que injeta um lightweight injection token pode precisar invocar um método da classe injetada.
O token agora é uma classe abstrata. Como o component injetável implementa essa classe, você também deve declarar um método abstrato na classe abstrata do lightweight injection token.
A implementação do método, com toda a sua sobrecarga de código, reside no component injetável, que pode sofrer tree-shaking.
Isso permite que o pai se comunique com o filho, se ele estiver presente, de forma type-safe.

Por exemplo, o `LibCard` agora consulta `LibHeaderToken` em vez de `LibHeader`.
O exemplo a seguir mostra como o padrão permite que `LibCard` se comunique com `LibHeader` sem se referir diretamente a `LibHeader`:

```ts {highlight: [[2],[7],[11],[19]]}
abstract class LibHeaderToken {
  abstract doSomething(): void;
}

@Component({
  selector: 'lib-header',
  providers: [{provide: LibHeaderToken, useExisting: LibHeader}],
})
class LibHeader extends LibHeaderToken {
  doSomething(): void {
    // Implementação concreta de `doSomething`
  }
}

@Component({
  selector: 'lib-card',
})
class LibCard implements AfterContentInit {
  readonly header = contentChild(LibHeaderToken);

  ngAfterContentInit(): void {
    if (this.header() !== undefined) {
      this.header()!.doSomething();
    }
  }
}
```

Neste exemplo, o pai consulta o token para obter o component filho e armazena a referência resultante, se ela estiver presente.
Antes de chamar um método do filho, o component pai verifica se o component filho está presente.
Se o component filho tiver sofrido tree-shaking, não há referência em tempo de execução a ele e nenhuma chamada ao seu método.

### Nomeando seu lightweight injection token {#naming-your-lightweight-injection-token}

Lightweight injection tokens são úteis apenas com components.
O [Guia de Estilo do Angular](style-guide) sugere que você nomeie components sem o sufixo `Component`.
O exemplo `LibHeader` segue essa convenção.

Você deve manter a relação entre o component e o seu token, mas ainda distinguindo um do outro.
O estilo recomendado é usar o nome base do component com o sufixo `Token` para nomear seus lightweight injection tokens: `LibHeaderToken`.
