<!-- ia-translate: true -->
# Sequências complexas de animação

IMPORTANTE: O package `@angular/animations` agora está deprecado. O time do Angular recomenda usar CSS nativo com `animate.enter` e `animate.leave` para animações em todo código novo. Saiba mais no novo [guia de animação](guide/animations/enter-and-leave) de enter e leave. Veja também [Migrando do package de Animations do Angular](guide/animations/migration) para aprender como você pode começar a migrar para animações CSS puras em suas aplicações.

Até agora, aprendemos animações simples de elementos HTML individuais.
O Angular também permite animar sequências coordenadas, como uma grade inteira ou lista de elementos conforme eles entram e saem de uma página.
Você pode escolher executar múltiplas animações em paralelo, ou executar animações discretas sequencialmente, uma após a outra.

As funções que controlam sequências complexas de animação são:

| Funções                           | Detalhes                                                                    |
| :-------------------------------- | :-------------------------------------------------------------------------- |
| `query()`                         | Encontra um ou mais elementos HTML internos.                                |
| `stagger()`                       | Aplica um atraso em cascata às animações para múltiplos elementos.          |
| [`group()`](api/animations/group) | Executa múltiplas etapas de animação em paralelo.                           |
| `sequence()`                      | Executa etapas de animação uma após a outra.                                |

## A função query()

A maioria das animações complexas depende da função `query()` para encontrar elementos filhos e aplicar animações a eles, exemplos básicos disso são:

| Exemplos                               | Detalhes                                                                                                                                                                                                                               |
| :------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `query()` seguido de `animate()`       | Usado para consultar elementos HTML simples e aplicar animações diretamente a eles.                                                                                                                                                    |
| `query()` seguido de `animateChild()`  | Usado para consultar elementos filhos, que por si só têm metadados de animações aplicados a eles e disparar tal animação \(que de outra forma seria bloqueada pela animação do elemento atual/pai\).                                  |

O primeiro argumento de `query()` é uma string de [seletor css](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors) que também pode conter os seguintes tokens específicos do Angular:

| Tokens                     | Detalhes                                      |
| :------------------------- | :-------------------------------------------- |
| `:enter` <br /> `:leave`   | Para elementos entrando/saindo.               |
| `:animating`               | Para elementos atualmente animando.           |
| `@*` <br /> `@triggerName` | Para elementos com qualquer—ou um—trigger específico. |
| `:self`                    | O próprio elemento animando.                  |

<docs-callout title="Elementos Entrando e Saindo">

Nem todos os elementos filhos são realmente considerados como entrando/saindo; isso pode, às vezes, ser contraintuitivo e confuso. Por favor, veja a [documentação da api query](api/animations/query#entering-and-leaving-elements) para mais informações.

Você também pode ver uma ilustração disso no exemplo de animações \(introduzido na [seção de introdução](guide/legacy-animations#about-this-guide) de animações\) sob a aba Querying.

</docs-callout>

## Animar múltiplos elementos usando as funções query() e stagger()

Após ter consultado elementos filhos via `query()`, a função `stagger()` permite que você defina um intervalo de tempo entre cada item consultado que é animado e, assim, anima elementos com um atraso entre eles.

O exemplo a seguir demonstra como usar as funções `query()` e `stagger()` para animar uma lista \(de heróis\) adicionando cada um em sequência, com um leve atraso, de cima para baixo.

- Use `query()` para procurar por um elemento entrando na página que atenda determinados critérios
- Para cada um desses elementos, use `style()` para definir o mesmo estilo inicial para o elemento.
  Torne-o transparente e use `transform` para movê-lo para fora da posição para que possa deslizar para o lugar.

- Use `stagger()` para atrasar cada animação em 30 milissegundos
- Anime cada elemento na tela por 0,5 segundos usando uma curva de easing personalizada, simultaneamente fazendo fade in e desfazendo a transformação

<docs-code header="hero-list-page.component.ts" path="adev/src/content/examples/animations/src/app/hero-list-page.component.ts" visibleRegion="page-animations"/>

## Animação paralela usando a função group()

Você viu como adicionar um atraso entre cada animação sucessiva.
Mas você também pode querer configurar animações que acontecem em paralelo.
Por exemplo, você pode querer animar duas propriedades CSS do mesmo elemento, mas usar uma função de `easing` diferente para cada uma.
Para isso, você pode usar a função de animação [`group()`](api/animations/group).

ÚTIL: A função [`group()`](api/animations/group) é usada para agrupar _etapas_ de animação, em vez de elementos animados.

O exemplo a seguir usa [`group()`](api/animations/group)s tanto em `:enter` quanto em `:leave` para duas configurações de tempo diferentes, aplicando assim duas animações independentes ao mesmo elemento em paralelo.

<docs-code header="hero-list-groups.component.ts (trecho)" path="adev/src/content/examples/animations/src/app/hero-list-groups.component.ts" visibleRegion="animationdef"/>

## Animações sequenciais vs. paralelas

Animações complexas podem ter muitas coisas acontecendo ao mesmo tempo.
Mas e se você quiser criar uma animação envolvendo várias animações acontecendo uma após a outra? Anteriormente você usou [`group()`](api/animations/group) para executar múltiplas animações todas ao mesmo tempo, em paralelo.

Uma segunda função chamada `sequence()` permite que você execute essas mesmas animações uma após a outra.
Dentro de `sequence()`, as etapas de animação consistem em chamadas de função `style()` ou `animate()`.

- Use `style()` para aplicar os dados de estilo fornecidos imediatamente.
- Use `animate()` para aplicar dados de estilo durante um determinado intervalo de tempo.

## Exemplo de animação de filtro

Dê uma olhada em outra animação na página de exemplo.
Sob a aba Filter/Stagger, digite algum texto na caixa de texto **Search Heroes**, como `Magnet` ou `tornado`.

O filtro funciona em tempo real conforme você digita.
Os elementos saem da página conforme você digita cada nova letra e o filtro fica progressivamente mais rigoroso.
A lista de heróis gradualmente reentra na página conforme você deleta cada letra na caixa de filtro.

O template HTML contém um trigger chamado `filterAnimation`.

<docs-code header="hero-list-page.component.html" path="adev/src/content/examples/animations/src/app/hero-list-page.component.html" visibleRegion="filter-animations" language="angular-html"/>

O `filterAnimation` no decorator do component contém três transições.

<docs-code header="hero-list-page.component.ts" path="adev/src/content/examples/animations/src/app/hero-list-page.component.ts" visibleRegion="filter-animations"/>

O código neste exemplo executa as seguintes tarefas:

- Pula animações quando o usuário abre ou navega para esta página pela primeira vez \(a animação de filtro limita o que já está lá, então ela só funciona em elementos que já existem no DOM\)
- Filtra heróis com base no valor de entrada de busca

Para cada mudança:

- Oculta um elemento saindo do DOM definindo sua opacity e width para 0
- Anima um elemento entrando no DOM ao longo de 300 milissegundos.
  Durante a animação, o elemento assume sua width e opacity padrão.

- Se houver múltiplos elementos entrando ou saindo do DOM, escalonar cada animação começando no topo da página, com um atraso de 50 milissegundos entre cada elemento

## Animando os itens de uma lista reordenada

Embora o Angular anime corretamente os itens de lista `*ngFor` de forma nativa, ele não será capaz de fazê-lo se a ordenação deles mudar.
Isso ocorre porque ele perderá o rastreamento de qual elemento é qual, resultando em animações quebradas.
A única maneira de ajudar o Angular a rastrear esses elementos é atribuindo uma `TrackByFunction` à diretiva `NgForOf`.
Isso garante que o Angular sempre saiba qual elemento é qual, permitindo que ele aplique as animações corretas aos elementos corretos o tempo todo.

IMPORTANTE: Se você precisar animar os itens de uma lista `*ngFor` e houver possibilidade de que a ordem de tais itens mude durante a execução, sempre use uma `TrackByFunction`.

## Animações e View Encapsulation de Component

As animações do Angular são baseadas na estrutura DOM dos components e não levam diretamente em conta o [View Encapsulation](guide/components/styling#style-scoping), isso significa que components usando `ViewEncapsulation.Emulated` se comportam exatamente como se estivessem usando `ViewEncapsulation.None` (`ViewEncapsulation.ShadowDom` e `ViewEncapsulation.ExperimentalIsolatedShadowDom` se comportam de forma diferente, como discutiremos em breve).

Por exemplo, se a função `query()` (que você verá mais no restante do guia de Animações) fosse aplicada no topo de uma árvore de components usando view encapsulation emulado, tal query seria capaz de identificar (e assim animar) elementos DOM em qualquer profundidade da árvore.

Por outro lado, o `ViewEncapsulation.ShadowDom` e `ViewEncapsulation.ExperimentalIsolatedShadowDom` mudam a estrutura DOM do component "escondendo" elementos DOM dentro de elementos [`ShadowRoot`](https://developer.mozilla.org/docs/Web/API/ShadowRoot). Tais manipulações DOM impedem que algumas das implementações de animações funcionem adequadamente, pois dependem de estruturas DOM simples e não levam em conta elementos `ShadowRoot`. Portanto, é aconselhável evitar aplicar animações a views que incorporam components usando view encapsulation ShadowDom.

## Resumo de sequência de animação

As funções do Angular para animar múltiplos elementos começam com `query()` para encontrar elementos internos; por exemplo, reunindo todas as imagens dentro de uma `<div>`.
As funções restantes, `stagger()`, [`group()`](api/animations/group) e `sequence()`, aplicam cascatas ou permitem que você controle como múltiplas etapas de animação são aplicadas.

## Mais sobre animações do Angular

Você também pode estar interessado em:

<docs-pill-row>
  <docs-pill href="guide/legacy-animations" title="Introdução às animações do Angular"/>
  <docs-pill href="guide/legacy-animations/transition-and-triggers" title="Transição e triggers"/>
  <docs-pill href="guide/legacy-animations/reusable-animations" title="Animações reutilizáveis"/>
  <docs-pill href="guide/routing/route-transition-animations" title="Animações de transição de rota"/>
  <docs-pill href="guide/animations/migration" title="Migrando para Animações CSS Nativas"/>
</docs-pill-row>
