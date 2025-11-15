<!-- ia-translate: true -->
# Incremental Hydration

**Incremental hydration** é um tipo avançado de [hydration](guide/hydration) que pode deixar seções da sua aplicação desidratadas e _incrementalmente_ acionar hydration dessas seções conforme elas são necessárias.

## Por que usar incremental hydration?

Incremental hydration é uma melhoria de desempenho que se baseia em cima de full application hydration. Pode produzir bundles iniciais menores enquanto ainda fornece uma experiência de usuário final que é comparável a uma experiência de full application hydration. Bundles menores melhoram os tempos de carregamento inicial, reduzindo [First Input Delay (FID)](https://web.dev/fid) e [Cumulative Layout Shift (CLS)](https://web.dev/cls).

Incremental hydration também permite que você use deferrable views (`@defer`) para conteúdo que pode não ter sido adiável antes. Especificamente, você agora pode usar deferrable views para conteúdo que está acima da dobra (above the fold). Antes do incremental hydration, colocar um bloco `@defer` acima da dobra resultaria em conteúdo placeholder sendo renderizado e então sendo substituído pelo conteúdo do template principal do bloco `@defer`. Isso resultaria em um layout shift. Incremental hydration significa que o template principal do bloco `@defer` será renderizado sem layout shift em hydration.

## Como você habilita incremental hydration no Angular?

Você pode habilitar incremental hydration para aplicações que já usam server-side rendering (SSR) com hydration. Siga o [Guia de SSR do Angular](guide/ssr) para habilitar server-side rendering e o [Guia de Hydration do Angular](guide/hydration) para habilitar hydration primeiro.

Habilite incremental hydration adicionando a função `withIncrementalHydration()` ao provider `provideClientHydration`.

```typescript
import {
  bootstrapApplication,
  provideClientHydration,
  withIncrementalHydration,
} from '@angular/platform-browser';
...

bootstrapApplication(AppComponent, {
  providers: [provideClientHydration(withIncrementalHydration())]
});
```

Incremental Hydration depende e habilita [event replay](guide/hydration#capturing-and-replaying-events) automaticamente. Se você já tem `withEventReplay()` na sua lista, você pode removê-lo com segurança após habilitar incremental hydration.

## Como incremental hydration funciona?

Incremental hydration se baseia em cima de full-application [hydration](guide/hydration), [deferrable views](guide/defer), e [event replay](guide/hydration#capturing-and-replaying-events). Com incremental hydration, você pode adicionar triggers adicionais a blocos `@defer` que definem limites de incremental hydration. Adicionar um trigger `hydrate` a um bloco defer diz ao Angular que ele deve carregar as dependências desse bloco defer durante server-side rendering e renderizar o template principal em vez do `@placeholder`. Ao renderizar no client-side, as dependências ainda são adiadas, e o conteúdo do bloco defer permanece desidratado até que seu trigger `hydrate` dispare. Esse trigger diz ao bloco defer para buscar suas dependências e hidratar o conteúdo. Quaisquer eventos do navegador, especificamente aqueles que correspondem a listeners registrados no seu component, que são acionados pelo usuário antes de hydration são enfileirados e reproduzidos uma vez que o processo de hydration está completo.

## Controlando hydration de conteúdo com triggers

Você pode especificar **hydrate triggers** que controlam quando o Angular carrega e hidrata conteúdo adiado. Esses são triggers adicionais que podem ser usados junto com triggers `@defer` regulares.

Cada bloco `@defer` pode ter múltiplos event triggers de hydrate, separados com ponto e vírgula (`;`). O Angular aciona hydration quando _qualquer_ dos triggers dispara.

Existem três tipos de hydrate triggers: `hydrate on`, `hydrate when`, e `hydrate never`.

### `hydrate on`

`hydrate on` especifica uma condição para quando hydration é acionada para o bloco `@defer`.

Os triggers disponíveis são os seguintes:

| Trigger                                             | Descrição                                                                   |
| --------------------------------------------------- | --------------------------------------------------------------------------- |
| [`hydrate on idle`](#hydrate-on-idle)               | Aciona quando o navegador está ocioso.                                      |
| [`hydrate on viewport`](#hydrate-on-viewport)       | Aciona quando o conteúdo especificado entra no viewport                     |
| [`hydrate on interaction`](#hydrate-on-interaction) | Aciona quando o usuário interage com o elemento especificado                |
| [`hydrate on hover`](#hydrate-on-hover)             | Aciona quando o mouse passa sobre a área especificada                       |
| [`hydrate on immediate`](#hydrate-on-immediate)     | Aciona imediatamente após o conteúdo não adiado ter terminado de renderizar |
| [`hydrate on timer`](#hydrate-on-timer)             | Aciona após uma duração específica                                          |

#### `hydrate on idle`

O trigger `hydrate on idle` carrega as dependências da deferrable view e hidrata o conteúdo uma vez que o navegador alcançou um estado ocioso, baseado em `requestIdleCallback`.

```angular-html
@defer (hydrate on idle) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

#### `hydrate on viewport`

O trigger `hydrate on viewport` carrega as dependências da deferrable view e hidrata a página correspondente da aplicação quando o conteúdo especificado entra no viewport usando a
[Intersection Observer API](https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API).

```angular-html
@defer (hydrate on viewport) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

#### `hydrate on interaction`

O trigger `hydrate on interaction` carrega as dependências da deferrable view e hidrata o conteúdo quando o usuário interage com o elemento especificado através de
eventos `click` ou `keydown`.

```angular-html
@defer (hydrate on interaction) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

#### `hydrate on hover`

O trigger `hydrate on hover` carrega as dependências da deferrable view e hidrata o conteúdo quando o mouse passou sobre a área acionada através dos
eventos `mouseover` e `focusin`.

```angular-html
@defer (hydrate on hover) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

#### `hydrate on immediate`

O trigger `hydrate on immediate` carrega as dependências da deferrable view e hidrata o conteúdo imediatamente. Isso significa que o bloco adiado carrega assim que
todo outro conteúdo não adiado terminou de renderizar.

```angular-html
@defer (hydrate on immediate) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

#### `hydrate on timer`

O trigger `hydrate on timer` carrega as dependências da deferrable view e hidrata o conteúdo após uma duração especificada.

```angular-html
@defer (hydrate on timer(500ms)) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

O parâmetro de duração deve ser especificado em milissegundos (`ms`) ou segundos (`s`).

### `hydrate when`

O trigger `hydrate when` aceita uma expressão condicional customizada e carrega as dependências da deferrable view e hidrata o conteúdo quando a
condição se torna verdadeira.

```angular-html
@defer (hydrate when condition) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

NOTA: condições `hydrate when` só acionam quando são o bloco `@defer` desidratado mais no topo. A condição fornecida para o trigger é
especificada no component pai, que precisa existir antes que possa ser acionado. Se o bloco pai estiver desidratado, essa expressão ainda não será
resolvível pelo Angular.

### `hydrate never`

O `hydrate never` permite que os usuários especifiquem que o conteúdo no bloco defer deve permanecer desidratado indefinidamente, efetivamente se tornando conteúdo estático. Note que isso se aplica apenas à renderização inicial. Durante uma renderização client-side subsequente, um bloco `@defer` com `hydrate never`
ainda buscaria dependências, pois hydration só se aplica ao carregamento inicial de conteúdo renderizado no servidor. No exemplo abaixo, renderizações client-side subsequentes carregariam as dependências do bloco `@defer` no viewport.

```angular-html
@defer (on viewport; hydrate never) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

NOTA: Usar `hydrate never` previne hydration de toda a subárvore aninhada de um determinado bloco `@defer`. Nenhum outro trigger `hydrate` dispara para conteúdo aninhado abaixo desse bloco.

## Hydrate triggers junto com triggers regulares

Hydrate triggers são triggers adicionais que são usados junto com triggers regulares em um bloco `@defer`. Hydration é uma otimização de carregamento inicial, e isso significa que hydrate triggers só se aplicam a esse carregamento inicial. Qualquer renderização client-side subsequente ainda usará o trigger regular.

```angular-html
@defer (on idle; hydrate on interaction) {
  <example-cmp />
} @placeholder{
  <div>Example Placeholder</div>
}
```

Neste exemplo, no carregamento inicial, o `hydrate on interaction` se aplica. Hydration será acionada na interação com o component `<example-cmp />`. Em qualquer carregamento de página subsequente que seja renderizado no client-side, por exemplo quando um usuário clica em um routerLink que carrega uma página com este component, o `on idle` será aplicado.

## Como incremental hydration funciona com blocos `@defer` aninhados?

O sistema de components e dependências do Angular é hierárquico, o que significa que hidratar qualquer component requer que todos os seus pais também sejam hidratados. Então, se hydration é acionada para um bloco `@defer` filho de um conjunto aninhado de blocos `@defer` desidratados, hydration é acionada do bloco `@defer` desidratado mais no topo até o filho acionado e dispara nessa ordem.

```angular-html
@defer (hydrate on interaction) {
  <parent-block-cmp />
  @defer (hydrate on hover) {
    <child-block-cmp />
  } @placeholder {
    <div>Child placeholder</div>
  }
} @placeholder{
  <div>Parent Placeholder</div>
}
```

No exemplo acima, passar o mouse sobre o bloco `@defer` aninhado aciona hydration. O bloco `@defer` pai com o `<parent-block-cmp />` hidrata primeiro, então o bloco `@defer` filho com `<child-block-cmp />` hidrata depois.

## Restrições

Incremental hydration tem as mesmas restrições que full-application hydration, incluindo limites na manipulação direta do DOM e exigindo estrutura HTML válida. Visite a seção [restrições do guia de Hydration](guide/hydration#constraints) para mais detalhes.

## Eu ainda preciso especificar blocos `@placeholder`?

Sim. O conteúdo do bloco `@placeholder` não é usado para incremental hydration, mas um `@placeholder` ainda é necessário para casos de renderização client-side subsequentes. Se seu conteúdo não estava na rota que fazia parte do carregamento inicial, então qualquer navegação para a rota que tem o conteúdo do seu bloco `@defer` renderiza como um bloco `@defer` regular. Então o `@placeholder` é renderizado nesses casos de renderização client-side.
