<!-- ia-translate: true -->

# Hydration

## O que é hydration {#what-is-hydration}

Hydration é o processo que restaura a aplicação renderizada no servidor (server-side rendering) no cliente. Isso inclui coisas como reutilizar as estruturas DOM renderizadas no servidor, persistir o estado da aplicação, transferir dados da aplicação que já foram recuperados pelo servidor e outros processos.

## Por que hydration é importante? {#why-is-hydration-important}

Hydration melhora o desempenho da aplicação evitando trabalho extra para recriar nós do DOM. Em vez disso, o Angular tenta combinar os elementos DOM existentes com a estrutura da aplicação em tempo de execução e reutiliza os nós do DOM sempre que possível. Isso resulta em uma melhoria de desempenho que pode ser medida usando estatísticas de [Core Web Vitals (CWV)](https://web.dev/learn-core-web-vitals/), como a redução do First Input Delay ([FID](https://web.dev/fid/)) e do Largest Contentful Paint ([LCP](https://web.dev/lcp/)), além do Cumulative Layout Shift ([CLS](https://web.dev/cls/)). Melhorar esses números também afeta coisas como o desempenho de SEO.

Sem hydration habilitado, aplicações Angular renderizadas no servidor destroem e re-renderizam o DOM da aplicação, o que pode resultar em uma oscilação visível na interface. Essa re-renderização pode impactar negativamente os [Core Web Vitals](https://web.dev/learn-core-web-vitals/) como o [LCP](https://web.dev/lcp/) e causar um layout shift. Habilitar hydration permite que o DOM existente seja reutilizado e evita a oscilação.

## Como habilitar hydration no Angular {#how-do-you-enable-hydration-in-angular}

Hydration pode ser habilitado apenas para aplicações renderizadas no servidor (SSR). Siga o [Guia de SSR do Angular](guide/ssr) para habilitar server-side rendering primeiro.

### Usando o Angular CLI {#using-angular-cli}

Se você usou o Angular CLI para habilitar SSR (seja durante a criação da aplicação ou depois, via `ng add @angular/ssr`), o código que habilita hydration já deve estar incluído na sua aplicação.

### Configuração manual {#manual-setup}

Se você tem uma configuração customizada e não usou o Angular CLI para habilitar SSR, pode habilitar hydration manualmente, acessando o component ou módulo principal da sua aplicação e importando `provideClientHydration` de `@angular/platform-browser`. Depois, você adiciona esse provider à lista de providers de bootstrap da aplicação.

```typescript
import {
  bootstrapApplication,
  provideClientHydration,
} from '@angular/platform-browser';
...

bootstrapApplication(App, {
  providers: [provideClientHydration()]
});
```

Alternativamente, se você estiver usando NgModules, adicione `provideClientHydration` à lista de providers do módulo raiz da aplicação.

```typescript
import {provideClientHydration} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

@NgModule({
  declarations: [App],
  exports: [App],
  bootstrap: [App],
  providers: [provideClientHydration()],
})
export class AppModule {}
```

IMPORTANT: Certifique-se de que a chamada `provideClientHydration()` também esteja incluída no conjunto de providers usado para fazer o bootstrap da aplicação no **servidor**. Em aplicações com a estrutura de projeto padrão (gerada pelo comando `ng new`), adicionar a chamada ao `AppModule` raiz deve ser suficiente, pois esse módulo é importado pelo módulo do servidor. Se você usa uma configuração customizada, adicione a chamada `provideClientHydration()` à lista de providers na configuração de bootstrap do servidor.

### Verificar se hydration está habilitado {#verify-that-hydration-is-enabled}

Depois de configurar hydration e iniciar o servidor, carregue sua aplicação no navegador.

HELPFUL: Você provavelmente precisará corrigir instâncias de manipulação direta do DOM antes que hydration funcione por completo, seja mudando para construções do Angular ou usando `ngSkipHydration`. Veja [Restrições](#constraints), [Manipulação Direta do DOM](#direct-dom-manipulation) e [Como pular hydration para componentes específicos](#how-to-skip-hydration-for-particular-components) para mais detalhes.

Ao executar a aplicação em modo de desenvolvimento, você pode confirmar que hydration está habilitado abrindo as Ferramentas do Desenvolvedor do navegador e visualizando o console. Você deve ver uma mensagem com estatísticas de hydration, como o número de components e nós hidratados. O Angular calcula as estatísticas com base em todos os components renderizados na página, incluindo os que vêm de bibliotecas de terceiros.

Você também pode usar a [extensão Angular DevTools para navegador](tools/devtools) para ver o status de hydration dos components em uma página. O Angular DevTools também permite habilitar um overlay para indicar quais partes da página foram hidratadas. Se houver um erro de incompatibilidade de hydration, o DevTools também destacará o component que causou o erro.

## Capturando e reproduzindo eventos {#capturing-and-replaying-events}

Quando uma aplicação é renderizada no servidor, ela fica visível no navegador assim que o HTML produzido é carregado. Os usuários podem presumir que conseguem interagir com a página, mas os event listeners só são anexados quando hydration é concluída. O recurso Event Replay captura todos os eventos que acontecem antes de hydration e reproduz esses eventos assim que hydration é concluída.

Event replay é habilitado junto com o [incremental hydration](guide/incremental-hydration). Se você desativar o incremental hydration com `withNoIncrementalHydration()`, ainda pode habilitar o event replay usando a função `withEventReplay()`:

```typescript
import {
  provideClientHydration,
  withEventReplay,
  withNoIncrementalHydration,
  bootstrapApplication,
} from '@angular/platform-browser';

bootstrapApplication(App, {
  providers: [provideClientHydration(withNoIncrementalHydration(), withEventReplay())],
});
```

### Como o event replay funciona {#how-event-replay-works}

Event Replay é um recurso que melhora a experiência do usuário ao capturar eventos de usuário que foram disparados antes de o processo de hydration ser concluído. Em seguida, esses eventos são reproduzidos, garantindo que nenhuma dessas interações seja perdida.

O Event Replay é dividido em três fases principais:

- **Capturando interações do usuário**<br>
  Antes da **Hydration**, o Event Replay captura e armazena todas as interações que o usuário pode realizar, como cliques e outros eventos nativos do navegador.

- **Armazenando eventos**<br>
  O **Event Contract** mantém na memória todas as interações registradas na etapa anterior, garantindo que elas não sejam perdidas para reprodução posterior.

- **Reexecução dos eventos**<br>
  Quando a **Hydration** é concluída, o Angular reinvoca os eventos capturados.

O Event replay oferece suporte a _eventos nativos do navegador_, por exemplo `click`, `mouseover` e `focusin`. Se você quiser saber mais sobre o JSAction, a biblioteca que alimenta o event replay, pode ler mais [no readme](https://github.com/angular/angular/tree/main/packages/core/primitives/event-dispatch#readme).

Esse recurso garante uma experiência de usuário consistente, evitando que ações realizadas pelo usuário antes da hydration sejam ignoradas.

## Restrições {#constraints}

A hydration impõe algumas restrições à sua aplicação que não existem quando ela não está habilitada. Sua aplicação deve ter a mesma estrutura DOM gerada tanto no servidor quanto no cliente. O processo de hydration espera que a árvore DOM tenha a mesma estrutura nos dois lugares. Isso também inclui os espaços em branco e os nós de comentário que o Angular produz durante a renderização no servidor. Esses espaços em branco e nós devem estar presentes no HTML gerado pelo processo de server-side rendering.

IMPORTANT: O HTML produzido pela operação de server-side rendering **não deve** ser alterado entre o servidor e o cliente.

Se houver uma incompatibilidade entre as estruturas da árvore DOM do servidor e do cliente, o processo de hydration terá problemas ao tentar combinar o que era esperado com o que realmente está presente no DOM. Components que fazem manipulação direta do DOM usando APIs nativas do DOM são os culpados mais comuns.

### Manipulação direta do DOM {#direct-dom-manipulation}

Se você tem components que manipulam o DOM usando APIs nativas ou usam `innerHTML` ou `outerHTML`, o processo de hydration encontrará erros. Casos específicos em que a manipulação do DOM é um problema incluem situações como acessar o `document`, consultar elementos específicos e injetar nós adicionais usando `appendChild`. Desanexar nós do DOM e movê-los para outros locais também resultará em erros.

Isso acontece porque o Angular desconhece essas mudanças no DOM e não consegue resolvê-las durante o processo de hydration. O Angular espera uma determinada estrutura, mas encontrará uma estrutura diferente ao tentar hidratar. Essa incompatibilidade resultará em falha de hydration e lançará um erro de incompatibilidade do DOM ([veja abaixo](#errors)).

É melhor refatorar seu component para evitar esse tipo de manipulação do DOM. Tente usar APIs do Angular para fazer esse trabalho, se possível. Se não for possível refatorar esse comportamento, use o atributo `ngSkipHydration` ([descrito abaixo](#how-to-skip-hydration-for-particular-components)) até que você consiga refatorar para uma solução compatível com hydration.

### Estrutura HTML válida {#valid-html-structure}

Há alguns casos em que, se o template de um component não tiver uma estrutura HTML válida, isso pode resultar em um erro de incompatibilidade do DOM durante a hydration.

Como exemplo, aqui estão alguns dos casos mais comuns desse problema.

- `<table>` sem um `<tbody>`
- `<div>` dentro de um `<p>`
- `<a>` dentro de outro `<a>`

Se você não tiver certeza de que seu HTML é válido, pode usar um [validador de sintaxe](https://validator.w3.org/) para verificá-lo.

NOTE: Embora o padrão HTML não exija o elemento `<tbody>` dentro de tabelas, navegadores modernos criam automaticamente um elemento `<tbody>` em tabelas que não declaram um. Por causa dessa inconsistência, sempre declare explicitamente um elemento `<tbody>` em tabelas para evitar erros de hydration.

### Configuração de preserveWhitespaces {#preserve-whitespaces-configuration}

Ao usar o recurso de hydration, recomendamos usar a configuração padrão `false` para `preserveWhitespaces`. Se essa configuração não estiver no seu tsconfig, o valor será `false` e nenhuma mudança será necessária. Se você optar por habilitar a preservação de espaços em branco adicionando `preserveWhitespaces: true` ao seu tsconfig, é possível que encontre problemas com hydration. Essa ainda não é uma configuração totalmente suportada.

HELPFUL: Certifique-se de que essa configuração esteja definida **de forma consistente** em `tsconfig.server.json` para o seu servidor e em `tsconfig.app.json` para as builds do navegador. Um valor incompatível fará a hydration quebrar.

Se você optar por definir essa configuração no seu tsconfig, recomendamos defini-la apenas em `tsconfig.app.json`, do qual o `tsconfig.server.json` herda o valor por padrão.

### Zone.js customizado ou noop ainda não são suportados {#custom-or-noop-zonejs-are-not-yet-supported}

A hydration depende de um sinal do Zone.js quando ele se torna estável dentro de uma aplicação, para que o Angular possa iniciar o processo de serialização no servidor ou a limpeza pós-hydration no cliente, removendo os nós do DOM que ficaram sem correspondência.

Fornecer uma implementação customizada ou "noop" do Zone.js pode levar a um momento diferente para o evento "stable", acionando a serialização ou a limpeza cedo demais ou tarde demais. Essa ainda não é uma configuração totalmente suportada, e você pode precisar ajustar o momento do evento `onStable` na implementação customizada do Zone.js.

## Erros {#errors}

Há vários erros relacionados à hydration que você pode encontrar, desde incompatibilidades de nós até casos em que o `ngSkipHydration` foi usado em um nó host inválido. O caso de erro mais comum é causado pela manipulação direta do DOM com APIs nativas, o que faz a hydration não conseguir encontrar ou combinar a estrutura da árvore DOM esperada no cliente que foi renderizada pelo servidor. O outro caso em que você pode encontrar esse tipo de erro foi mencionado anteriormente na seção [Estrutura HTML válida](#valid-html-structure). Portanto, certifique-se de que o HTML nos seus templates use uma estrutura válida, e você evitará esse caso de erro.

Para uma referência completa sobre erros relacionados à hydration, visite o [Guia de Referência de Erros](/errors).

## Como pular hydration para componentes específicos {#how-to-skip-hydration-for-particular-components}

Alguns components podem não funcionar adequadamente com hydration habilitado por causa de alguns dos problemas mencionados anteriormente, como a [Manipulação Direta do DOM](#direct-dom-manipulation). Como solução alternativa, você pode adicionar o atributo `ngSkipHydration` à tag de um component para pular a hydration de todo o component.

```angular-html
<app-example ngSkipHydration />
```

Alternativamente, você pode definir `ngSkipHydration` como um host binding.

```typescript
@Component({
  ...
  host: {ngSkipHydration: 'true'},
})
class ExampleComponent {}
```

O atributo `ngSkipHydration` força o Angular a pular a hydration de todo o component e de seus filhos. Usar esse atributo significa que o component se comportará como se hydration não estivesse habilitado, ou seja, ele destruirá e re-renderizará a si mesmo.

HELPFUL: Isso corrige problemas de renderização, mas significa que, para esse component (e seus filhos), você não obtém os benefícios da hydration. Você precisará ajustar a implementação do component para evitar padrões que quebram a hydration (como a manipulação direta do DOM) para poder remover a anotação de pular hydration.

O atributo `ngSkipHydration` só pode ser usado em nós host de components. O Angular lança um erro se esse atributo for adicionado a outros nós.

Tenha em mente que adicionar o atributo `ngSkipHydration` ao component raiz da aplicação desabilitaria efetivamente a hydration para toda a aplicação. Seja cuidadoso e criterioso ao usar esse atributo. Ele se destina a ser uma solução alternativa de último recurso. Components que quebram a hydration devem ser considerados bugs que precisam ser corrigidos.

## Timing de hydration e estabilidade da aplicação {#hydration-timing-and-application-stability}

A estabilidade da aplicação é uma parte importante do processo de hydration. A hydration e quaisquer processos pós-hydration só ocorrem depois que a aplicação informa que está estável. Há várias maneiras de atrasar a estabilidade. Exemplos incluem definir timeouts e intervals, promises não resolvidas e microtasks pendentes. Nesses casos, você pode encontrar o erro [Application remains unstable](errors/NG0506), que indica que sua aplicação ainda não alcançou o estado estável após 10 segundos. Se perceber que sua aplicação não está hidratando imediatamente, verifique o que está afetando a estabilidade da aplicação e refatore para evitar esses atrasos.

### Depurando a estabilidade da aplicação {#debugging-application-stability}

O utilitário `provideStabilityDebugging` ajuda a identificar por que sua aplicação não consegue estabilizar. Esse utilitário é fornecido por padrão no modo de desenvolvimento ao usar `provideClientHydration`. Você também pode adicioná-lo manualmente aos providers da aplicação para uso em bundles de produção ou ao usar SSR sem hydration, por exemplo. O recurso registra informações no console se a aplicação levar mais tempo do que o esperado para estabilizar.

```typescript
import {provideStabilityDebugging} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import 'zone.js/plugins/task-tracking'; // Use se você tiver Zone.js com `provideZoneChangeDetection`

bootstrapApplication(App, {
  providers: [provideStabilityDebugging()],
});
```

Quando habilitado, o utilitário registra no console as tarefas pendentes (`PendingTasks`). Se sua aplicação usa Zone.js, você também pode importar `zone.js/plugins/task-tracking` para ver quais macrotasks estão impedindo a Angular Zone de estabilizar. Esse plugin fornece o stack trace da criação da macrotask, ajudando efetivamente a identificar a origem do atraso.

IMPORTANT: O Angular não remove o plugin de task tracking do zone.js nem esse utilitário dos bundles de produção. Use-os somente para depuração temporária de problemas de estabilidade durante o desenvolvimento, inclusive em builds de produção otimizadas.

## I18N

HELPFUL: Por padrão, o Angular pula a hydration para components que usam blocos i18n, re-renderizando efetivamente esses components do zero.

Para habilitar a hydration de blocos i18n, você pode adicionar [`withI18nSupport`](/api/platform-browser/withI18nSupport) à sua chamada de `provideClientHydration`.

```typescript
import {
  bootstrapApplication,
  provideClientHydration,
  withI18nSupport,
} from '@angular/platform-browser';
...

bootstrapApplication(App, {
  providers: [provideClientHydration(withI18nSupport())]
});
```

## Renderização consistente entre server-side e client-side {#consistent-rendering-across-server-side-and-client-side}

Evite introduzir blocos `@if` e outros condicionais que exibem conteúdo diferente na renderização no servidor e na renderização no cliente, como usar um bloco `@if` com a função `isPlatformBrowser` do Angular. Essas diferenças de renderização causam layout shifts, impactando negativamente a experiência do usuário final e os core web vitals.

## Bibliotecas de terceiros com manipulação do DOM {#third-party-libraries-with-dom-manipulation}

Há várias bibliotecas de terceiros que dependem de manipulação do DOM para conseguir renderizar. Os gráficos D3 são um exemplo clássico. Essas bibliotecas funcionavam sem hydration, mas podem causar erros de incompatibilidade do DOM quando a hydration está habilitada. Por enquanto, se você encontrar erros de incompatibilidade do DOM usando uma dessas bibliotecas, pode adicionar o atributo `ngSkipHydration` ao component que renderiza com essa biblioteca.

## Scripts de terceiros com manipulação do DOM {#third-party-scripts-with-dom-manipulation}

Muitos scripts de terceiros, como rastreadores de anúncios e ferramentas de análise, modificam o DOM antes que a hydration possa ocorrer. Esses scripts podem causar erros de hydration porque a página não corresponde mais à estrutura esperada pelo Angular. Prefira adiar esse tipo de script até depois da hydration sempre que possível. Considere usar o [`AfterNextRender`](api/core/afterNextRender) para atrasar o script até que os processos pós-hydration tenham ocorrido.

## Hydration incremental {#incremental-hydration}

Hydration incremental é uma forma avançada de hydration que permite um controle mais granular sobre quando a hydration acontece. Veja o [guia de hydration incremental](guide/incremental-hydration) para mais informações.
