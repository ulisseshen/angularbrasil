<!-- ia-translate: true -->
# Incremental Hydration

**Incremental hydration** é um tipo avançado de [hydration](guide/hydration) que pode deixar seções da sua aplicação desidratadas e _incrementalmente_ acionar a hydration dessas seções conforme elas são necessárias.

## Por que usar incremental hydration? {#why-use-incremental-hydration}

Incremental hydration é uma melhoria de performance que se baseia em cima de full application hydration. Ela pode produzir bundles iniciais menores, ainda fornecendo uma experiência de usuário final comparável a uma experiência de full application hydration. Bundles menores melhoram os tempos de carregamento inicial, reduzindo o [First Input Delay (FID)](https://web.dev/fid) e o [Cumulative Layout Shift (CLS)](https://web.dev/cls).

Incremental hydration também permite que você use deferrable views (`@defer`) para conteúdo que pode não ter sido adiável antes. Especificamente, você agora pode usar deferrable views para conteúdo que está acima da dobra (above the fold). Antes do incremental hydration, colocar um bloco `@defer` acima da dobra resultaria em conteúdo placeholder sendo renderizado e depois substituído pelo conteúdo do template principal do bloco `@defer`. Isso resultaria em um layout shift. Incremental hydration significa que o template principal do bloco `@defer` será renderizado sem layout shift na hydration.

## Como você habilita incremental hydration no Angular? {#how-do-you-enable-incremental-hydration-in-angular}

Você pode habilitar incremental hydration para aplicações que já usam server-side rendering (SSR) com hydration. Siga o [Guia de SSR do Angular](guide/ssr) para habilitar server-side rendering e o [Guia de Hydration do Angular](guide/hydration) para habilitar hydration primeiro.

A incremental hydration é habilitada por padrão quando você usa `provideClientHydration()`.

```ts
import {bootstrapApplication, provideClientHydration} from '@angular/platform-browser';

bootstrapApplication(App, {
  providers: [provideClientHydration()],
});
```

NOTE: Incremental Hydration depende e habilita [event replay](guide/hydration#capturing-and-replaying-events) automaticamente. Se você já tem `withEventReplay()` na sua lista, pode removê-lo com segurança.

Para desativar a incremental hydration, use `withNoIncrementalHydration()`:

```ts
import {
  bootstrapApplication,
  provideClientHydration,
  withNoIncrementalHydration,
} from '@angular/platform-browser';

bootstrapApplication(App, {
  providers: [provideClientHydration(withNoIncrementalHydration())],
});
```

## Como incremental hydration funciona? {#how-does-incremental-hydration-work}

Incremental hydration se baseia em cima de full-application [hydration](guide/hydration), [deferrable views](/guide/templates/defer) e [event replay](guide/hydration#capturing-and-replaying-events). Com incremental hydration, você pode adicionar triggers adicionais a blocos `@defer` que definem os limites da incremental hydration. Adicionar um trigger `hydrate` a um bloco defer diz ao Angular que ele deve carregar as dependências desse bloco defer durante a server-side rendering e renderizar o template principal em vez do `@placeholder`. Ao renderizar no client-side, as dependências continuam adiadas, e o conteúdo do bloco defer permanece desidratado até que seu trigger `hydrate` dispare. Esse trigger diz ao bloco defer para buscar suas dependências e hidratar o conteúdo. Quaisquer eventos do navegador, especificamente aqueles que correspondem a listeners registrados no seu component, que são disparados pelo usuário antes da hydration são enfileirados e reproduzidos assim que o processo de hydration estiver completo.

## Controlando hydration de conteúdo com triggers {#controlling-hydration-of-content-with-triggers}

Você pode especificar **hydrate triggers** que controlam quando o Angular carrega e hidrata o conteúdo adiado. Esses são triggers adicionais que podem ser usados junto com os triggers `@defer` regulares.

Cada bloco `@defer` pode ter múltiplos event triggers de hydrate, separados com ponto e vírgula (`;`). O Angular aciona a hydration quando _qualquer_ um dos triggers dispara.

Existem três tipos de hydrate triggers: `hydrate on`, `hydrate when` e `hydrate never`.

### `hydrate on`

`hydrate on` especifica uma condição para quando a hydration é acionada para o bloco `@defer`.

Os triggers disponíveis são os seguintes:

| Trigger                                             | Descrição                                                              |
| --------------------------------------------------- | ---------------------------------------------------------------------- |
| [`hydrate on idle`](#hydrate-on-idle)               | Aciona quando o navegador está ocioso. Aceita um timeout opcional.     |
| [`hydrate on viewport`](#hydrate-on-viewport)       | Aciona quando o conteúdo especificado entra no viewport                |
| [`hydrate on interaction`](#hydrate-on-interaction) | Aciona quando o usuário interage com o elemento especificado           |
| [`hydrate on hover`](#hydrate-on-hover)             | Aciona quando o mouse passa sobre a área especificada                  |
| [`hydrate on immediate`](#hydrate-on-immediate)     | Aciona imediatamente após o término da renderização do conteúdo não adiado |
| [`hydrate on timer`](#hydrate-on-timer)             | Aciona após uma duração específica                                     |

#### `hydrate on idle`

O trigger `hydrate on idle` carrega as dependências da deferrable view e hidrata o conteúdo assim que o navegador atinge um estado ocioso, com base em `requestIdleCallback`.

Você pode opcionalmente especificar um timeout em milissegundos, que é passado para o [`requestIdleCallback`](https://developer.mozilla.org/docs/Web/API/Window/requestIdleCallback). Se o navegador não agendar o callback com rapidez suficiente, o trabalho será executado no mais tardar após o timeout especificado.

```angular-html
@defer (hydrate on idle) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}

<!-- Com timeout de 500ms -->
@defer (hydrate on idle(500)) {
  <large-cmp />
}
```

#### `hydrate on viewport`

O trigger `hydrate on viewport` carrega as dependências da deferrable view e hidrata a página correspondente da aplicação quando o conteúdo especificado entra no viewport, usando a
[Intersection Observer API](https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API).

```angular-html
@defer (hydrate on viewport) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

#### `hydrate on interaction`

O trigger `hydrate on interaction` carrega as dependências da deferrable view e hidrata o conteúdo quando o usuário interage com o elemento especificado através dos eventos `click` ou `keydown`.

```angular-html
@defer (hydrate on interaction) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

#### `hydrate on hover`

O trigger `hydrate on hover` carrega as dependências da deferrable view e hidrata o conteúdo quando o mouse passa sobre a área acionadora, através dos eventos `mouseover` e `focusin`.

```angular-html
@defer (hydrate on hover) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

#### `hydrate on immediate`

O trigger `hydrate on immediate` carrega as dependências da deferrable view e hidrata o conteúdo imediatamente. Isso significa que o bloco adiado é carregado assim que todo o outro conteúdo não adiado terminar de renderizar.

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

O parâmetro de duração deve ser especificado em milissegundos (`ms`) ou em segundos (`s`).

### `hydrate when`

O trigger `hydrate when` aceita uma expressão condicional customizada e carrega as dependências da deferrable view e hidrata o conteúdo quando a condição se torna verdadeira.

```angular-html
@defer (hydrate when condition) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

NOTE: condições `hydrate when` só são acionadas quando o bloco `@defer` desidratado é o mais externo. A condição fornecida para o trigger é especificada no component pai, que precisa existir antes que possa ser acionada. Se o bloco pai estiver desidratado, essa expressão ainda não será resolvível pelo Angular.

### `hydrate never`

O `hydrate never` permite que você especifique que o conteúdo do bloco defer deve permanecer desidratado indefinidamente, tornando-se efetivamente conteúdo estático. Note que isso se aplica apenas à renderização inicial. Durante uma renderização client-side posterior, um bloco `@defer` com `hydrate never` ainda buscaria as dependências, pois a hydration só se aplica ao carregamento inicial de conteúdo renderizado no servidor. No exemplo abaixo, renderizações client-side posteriores carregariam as dependências do bloco `@defer` no viewport.

```angular-html
@defer (on viewport; hydrate never) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

NOTE: Usar `hydrate never` impede a hydration de toda a subárvore aninhada de um determinado bloco `@defer`. Nenhum outro trigger `hydrate` dispara para conteúdo aninhado abaixo desse bloco.

## Hydrate triggers junto com triggers regulares {#hydrate-triggers-alongside-regular-triggers}

Hydrate triggers são triggers adicionais usados junto com os triggers regulares em um bloco `@defer`. A hydration é uma otimização do carregamento inicial, e isso significa que os hydrate triggers só se aplicam a esse carregamento inicial. Qualquer renderização client-side posterior ainda usará o trigger regular.

```angular-html
@defer (on idle; hydrate on interaction) {
  <example-cmp />
} @placeholder {
  <div>Example Placeholder</div>
}
```

Neste exemplo, no carregamento inicial, o `hydrate on interaction` se aplica. A hydration será acionada na interação com o component `<example-cmp />`. Em qualquer carregamento de página posterior que seja renderizado no client-side, por exemplo quando um usuário clica em um routerLink que carrega uma página com este component, o `on idle` será aplicado.

## Como incremental hydration funciona com blocos `@defer` aninhados? {#how-does-incremental-hydration-work-with-nested-defer-blocks}

O sistema de components e dependências do Angular é hierárquico, o que significa que hidratar qualquer component requer que todos os seus pais também sejam hidratados. Então, se a hydration é acionada para um bloco `@defer` filho de um conjunto aninhado de blocos `@defer` desidratados, a hydration é acionada do bloco `@defer` desidratado mais externo até o filho acionado, e dispara nessa ordem.

```angular-html
@defer (hydrate on interaction) {
  <parent-block-cmp />
  @defer (hydrate on hover) {
    <child-block-cmp />
  } @placeholder {
    <div>Child placeholder</div>
  }
} @placeholder {
  <div>Parent Placeholder</div>
}
```

No exemplo acima, passar o mouse sobre o bloco `@defer` aninhado aciona a hydration. O bloco `@defer` pai com o `<parent-block-cmp />` é hidratado primeiro, e então o bloco `@defer` filho com `<child-block-cmp />` é hidratado em seguida.

## Restrições {#constraints}

A incremental hydration tem as mesmas restrições da full-application hydration, incluindo limites na manipulação direta do DOM e a exigência de uma estrutura HTML válida. Visite a seção [restrições do guia de Hydration](guide/hydration#constraints) para mais detalhes.

## Eu ainda preciso especificar blocos `@placeholder`? {#do-i-still-need-to-specify-placeholder-blocks}

Sim. O conteúdo do bloco `@placeholder` não é usado para a incremental hydration, mas um `@placeholder` ainda é necessário para casos de renderização client-side posteriores. Se o seu conteúdo não estava na rota que fez parte do carregamento inicial, então qualquer navegação para a rota que tem o conteúdo do seu bloco `@defer` é renderizada como um bloco `@defer` regular. Então o `@placeholder` é renderizado nesses casos de renderização client-side.
