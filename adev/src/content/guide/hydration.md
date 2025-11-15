<!-- ia-translate: true -->

# Hydration

## O que é hydration

Hydration é o processo que restaura a aplicação renderizada no servidor (server-side rendered) no cliente. Isso inclui coisas como reutilizar as estruturas DOM renderizadas no servidor, persistir o estado da aplicação, transferir dados da aplicação que já foram recuperados pelo servidor e outros processos.

## Por que hydration é importante?

Hydration melhora o desempenho da aplicação evitando trabalho extra para recriar nós do DOM. Em vez disso, o Angular tenta combinar elementos DOM existentes com a estrutura da aplicação em tempo de execução e reutiliza nós do DOM quando possível. Isso resulta em uma melhoria de desempenho que pode ser medida usando estatísticas de [Core Web Vitals (CWV)](https://web.dev/learn-core-web-vitals/), como a redução do First Input Delay ([FID](https://web.dev/fid/)) e Largest Contentful Paint ([LCP](https://web.dev/lcp/)), bem como Cumulative Layout Shift ([CLS](https://web.dev/cls/)). Melhorar esses números também afeta coisas como desempenho de SEO.

Sem hydration habilitado, aplicações Angular renderizadas no servidor irão destruir e re-renderizar o DOM da aplicação, o que pode resultar em uma oscilação visível na UI. Essa re-renderização pode impactar negativamente os [Core Web Vitals](https://web.dev/learn-core-web-vitals/) como [LCP](https://web.dev/lcp/) e causar um layout shift. Habilitar hydration permite que o DOM existente seja reutilizado e previne a oscilação.

## Como você habilita hydration no Angular

Hydration pode ser habilitado apenas para aplicações renderizadas no servidor (SSR). Siga o [Guia de SSR do Angular](guide/ssr) para habilitar server-side rendering primeiro.

### Usando Angular CLI

Se você usou o Angular CLI para habilitar SSR (seja habilitando durante a criação da aplicação ou posteriormente via `ng add @angular/ssr`), o código que habilita hydration já deve estar incluído na sua aplicação.

### Configuração manual {#constraints}

Se você tem uma configuração customizada e não usou o Angular CLI para habilitar SSR, você pode habilitar hydration manualmente visitando o component ou módulo principal da sua aplicação e importando `provideClientHydration` de `@angular/platform-browser`. Você então adiciona esse provider à lista de providers de bootstrap da sua aplicação.

```typescript
import {
  bootstrapApplication,
  provideClientHydration,
} from '@angular/platform-browser';
...

bootstrapApplication(AppComponent, {
  providers: [provideClientHydration()]
});
```

Alternativamente, se você está usando NgModules, você adicionaria `provideClientHydration` à lista de providers do módulo raiz da sua aplicação.

```typescript
import {provideClientHydration} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

@NgModule({
  declarations: [AppComponent],
  exports: [AppComponent],
  bootstrap: [AppComponent],
  providers: [provideClientHydration()],
})
export class AppModule {}
```

IMPORTANTE: Certifique-se de que a chamada `provideClientHydration()` também esteja incluída em um conjunto de providers que é usado para fazer o bootstrap de uma aplicação no **servidor**. Em aplicações com a estrutura de projeto padrão (gerada pelo comando `ng new`), adicionar uma chamada ao `AppModule` raiz deve ser suficiente, pois este módulo é importado pelo módulo do servidor. Se você usa uma configuração customizada, adicione a chamada `provideClientHydration()` à lista de providers na configuração de bootstrap do servidor.

### Verificar que hydration está habilitado

Depois que você configurou hydration e iniciou seu servidor, carregue sua aplicação no navegador.

ÚTIL: Você provavelmente precisará corrigir instâncias de Manipulação Direta do DOM antes que hydration funcione completamente, seja mudando para construtos do Angular ou usando `ngSkipHydration`. Veja [Restrições](#constraints), [Manipulação Direta do DOM](#direct-dom-manipulation), e [Como pular hydration para components específicos](#how-to-skip-hydration-for-particular-components) para mais detalhes.

Ao executar uma aplicação em modo de desenvolvimento, você pode confirmar que hydration está habilitado abrindo as Ferramentas do Desenvolvedor no seu navegador e visualizando o console. Você deve ver uma mensagem que inclui estatísticas relacionadas a hydration, como o número de components e nós hidratados. O Angular calcula as estatísticas baseado em todos os components renderizados em uma página, incluindo aqueles que vêm de bibliotecas de terceiros.

Você também pode usar a [extensão de navegador Angular DevTools](tools/devtools) para ver o status de hydration dos components em uma página. Angular DevTools também permite habilitar um overlay para indicar quais partes da página foram hidratadas. Se houver um erro de incompatibilidade de hydration - DevTools também destacaria um component que causou o erro.

## Capturando e reproduzindo eventos

Quando uma aplicação é renderizada no servidor, ela fica visível em um navegador assim que o HTML produzido carrega. Os usuários podem assumir que podem interagir com a página, mas os event listeners não são anexados até que hydration seja concluído. A partir do v18, você pode habilitar o recurso Event Replay que permite capturar todos os eventos que acontecem antes de hydration e reproduzir esses eventos assim que hydration for concluída. Você pode habilitá-lo usando a função `withEventReplay()`, por exemplo:

```typescript
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';

bootstrapApplication(App, {
  providers: [
    provideClientHydration(withEventReplay())
  ]
});
```

### Como event replay funciona

Event Replay é um recurso que melhora a experiência do usuário capturando eventos de usuário que foram acionados antes do processo de hydration estar completo. Então esses eventos são reproduzidos, garantindo que nenhuma dessas interações foi perdida.

O Event Replay é dividido em três fases principais:

- **Capturando interações do usuário**<br>
  Antes de **Hydration**, Event Replay captura e armazena todas as interações que o usuário pode realizar, como cliques e outros eventos nativos do navegador.

- **Armazenando eventos**<br>
  O **Event Contract** mantém na memória todas as interações gravadas na etapa anterior, garantindo que elas não sejam perdidas para reprodução posterior.

- **Relançamento de eventos**<br>
  Uma vez que **Hydration** é concluída, o Angular re-invoca os eventos capturados.

Event replay suporta _eventos nativos do navegador_, por exemplo `click`, `mouseover`, e `focusin`. Se você quiser aprender mais sobre JSAction, a biblioteca que alimenta event replay, você pode ler mais [no readme](https://github.com/angular/angular/tree/main/packages/core/primitives/event-dispatch#readme).

---

Este recurso garante uma experiência de usuário consistente, prevenindo que ações do usuário realizadas antes de Hydration sejam ignoradas. NOTA: se você tem [incremental hydration](guide/incremental-hydration) habilitado, event replay é automaticamente habilitado por baixo dos panos.

## Restrições

Hydration impõe algumas restrições na sua aplicação que não estão presentes sem hydration habilitado. Sua aplicação deve ter a mesma estrutura DOM gerada tanto no servidor quanto no cliente. O processo de hydration espera que a árvore DOM tenha a mesma estrutura em ambos os lugares. Isso também inclui espaços em branco e nós de comentário que o Angular produz durante a renderização no servidor. Esses espaços em branco e nós devem estar presentes no HTML gerado pelo processo de server-side rendering.

IMPORTANTE: O HTML produzido pela operação de server-side rendering **não deve** ser alterado entre o servidor e o cliente.

Se houver uma incompatibilidade entre as estruturas da árvore DOM do servidor e do cliente, o processo de hydration encontrará problemas ao tentar combinar o que era esperado com o que realmente está presente no DOM. Components que fazem manipulação direta do DOM usando APIs DOM nativas são os culpados mais comuns.

### Manipulação Direta do DOM {#direct-dom-manipulation}

Se você tem components que manipulam o DOM usando APIs DOM nativas ou usam `innerHTML` ou `outerHTML`, o processo de hydration encontrará erros. Casos específicos onde manipulação do DOM é um problema são situações como acessar o `document`, consultar elementos específicos e injetar nós adicionais usando `appendChild`. Desanexar nós do DOM e movê-los para outros locais também resultará em erros.

Isso ocorre porque o Angular desconhece essas mudanças no DOM e não pode resolvê-las durante o processo de hydration. O Angular esperará uma certa estrutura, mas encontrará uma estrutura diferente ao tentar hidratar. Essa incompatibilidade resultará em falha de hydration e lançará um erro de incompatibilidade de DOM ([veja abaixo](#errors)).

É melhor refatorar seu component para evitar esse tipo de manipulação do DOM. Tente usar APIs do Angular para fazer esse trabalho, se possível. Se você não pode refatorar esse comportamento, use o atributo `ngSkipHydration` ([descrito abaixo](#how-to-skip-hydration-for-particular-components)) até que você possa refatorar para uma solução amigável ao hydration.

### Estrutura HTML válida {#valid-html-structure}

Existem alguns casos onde se você tem um template de component que não tem estrutura HTML válida, isso pode resultar em um erro de incompatibilidade de DOM durante hydration.

Como exemplo, aqui estão alguns dos casos mais comuns deste problema.

- `<table>` sem um `<tbody>`
- `<div>` dentro de um `<p>`
- `<a>` dentro de outro `<a>`

Se você não tem certeza se seu HTML é válido, você pode usar um [validador de sintaxe](https://validator.w3.org/) para verificá-lo.

NOTA: Enquanto o padrão HTML não exige o elemento `<tbody>` dentro de tabelas, navegadores modernos criam automaticamente um elemento `<tbody>` em tabelas que não declaram um. Por causa dessa inconsistência, sempre declare explicitamente um elemento `<tbody>` em tabelas para evitar erros de hydration.

### Configuração de Preserve Whitespaces

Ao usar o recurso de hydration, recomendamos usar a configuração padrão de `false` para `preserveWhitespaces`. Se essa configuração não estiver no seu tsconfig, o valor será `false` e nenhuma mudança é necessária. Se você optar por habilitar a preservação de espaços em branco adicionando `preserveWhitespaces: true` ao seu tsconfig, é possível que você encontre problemas com hydration. Esta ainda não é uma configuração totalmente suportada.

ÚTIL: Certifique-se de que esta configuração está definida **consistentemente** em `tsconfig.server.json` para o seu servidor e `tsconfig.app.json` para suas builds do navegador. Um valor incompatível causará quebra de hydration.

Se você optar por definir esta configuração no seu tsconfig, recomendamos defini-la apenas em `tsconfig.app.json`, do qual por padrão o `tsconfig.server.json` irá herdá-la.

### Zone.js customizado ou Noop ainda não são suportados

Hydration depende de um sinal de Zone.js quando ele se torna estável dentro de uma aplicação, para que o Angular possa iniciar o processo de serialização no servidor ou limpeza pós-hydration no cliente para remover nós do DOM que permaneceram não reclamados.

Fornecer uma implementação Zone.js customizada ou "noop" pode levar a um timing diferente do evento "stable", assim acionando a serialização ou a limpeza muito cedo ou muito tarde. Esta ainda não é uma configuração totalmente suportada e você pode precisar ajustar o timing do evento `onStable` na implementação Zone.js customizada.

## Erros {#errors}

Existem vários erros relacionados a hydration que você pode encontrar, variando de incompatibilidades de nó a casos onde o `ngSkipHydration` foi usado em um nó host inválido. O caso de erro mais comum que pode ocorrer é devido à manipulação direta do DOM usando APIs nativas que resulta em hydration sendo incapaz de encontrar ou combinar a estrutura da árvore DOM esperada no cliente que foi renderizada pelo servidor. O outro caso em que você pode encontrar este tipo de erro foi mencionado na seção [Estrutura HTML válida](#valid-html-structure) anteriormente. Então, certifique-se de que o HTML nos seus templates está usando estrutura válida, e você evitará esse caso de erro.

Para uma referência completa sobre erros relacionados a hydration, visite o [Guia de Referência de Erros](/errors).

## Como pular hydration para components específicos {#how-to-skip-hydration-for-particular-components}

Alguns components podem não funcionar adequadamente com hydration habilitado devido a alguns dos problemas mencionados anteriormente, como [Manipulação Direta do DOM](#direct-dom-manipulation). Como solução alternativa, você pode adicionar o atributo `ngSkipHydration` à tag de um component para pular a hidratação de todo o component.

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

O atributo `ngSkipHydration` forçará o Angular a pular hydration de todo o component e seus filhos. Usar este atributo significa que o component se comportará como se hydration não estivesse habilitado, ou seja, ele irá destruir e re-renderizar a si mesmo.

ÚTIL: Isso corrigirá problemas de renderização, mas significa que para este component (e seus filhos), você não obtém os benefícios de hydration. Você precisará ajustar a implementação do seu component para evitar padrões que quebram hydration (ou seja, Manipulação Direta do DOM) para poder remover a anotação de pular hydration.

O atributo `ngSkipHydration` só pode ser usado em nós host de components. O Angular lança um erro se este atributo for adicionado a outros nós.

Tenha em mente que adicionar o atributo `ngSkipHydration` ao seu component de aplicação raiz efetivamente desabilitaria hydration para toda a sua aplicação. Seja cuidadoso e ponderado ao usar este atributo. Ele é pretendido como uma solução alternativa de último recurso. Components que quebram hydration devem ser considerados bugs que precisam ser corrigidos.

## Timing de Hydration e Estabilidade da Aplicação

Estabilidade da aplicação é uma parte importante do processo de hydration. Hydration e quaisquer processos pós-hydration só ocorrem uma vez que a aplicação tenha reportado estabilidade. Existem várias maneiras que a estabilidade pode ser atrasada. Exemplos incluem definir timeouts e intervals, promises não resolvidas e microtasks pendentes. Nesses casos, você pode encontrar o erro [Application remains unstable](errors/NG0506), que indica que sua aplicação ainda não alcançou o estado estável após 10 segundos. Se você está descobrindo que sua aplicação não está hidratando imediatamente, dê uma olhada no que está impactando a estabilidade da aplicação e refatore para evitar causar esses atrasos.

## I18N

ÚTIL: Por padrão, o Angular pulará hydration para components que usam blocos i18n, efetivamente re-renderizando esses components do zero.

Para habilitar hydration para blocos i18n, você pode adicionar [`withI18nSupport`](/api/platform-browser/withI18nSupport) à sua chamada `provideClientHydration`.

```typescript
import {
  bootstrapApplication,
  provideClientHydration,
  withI18nSupport,
} from '@angular/platform-browser';
...

bootstrapApplication(AppComponent, {
  providers: [provideClientHydration(withI18nSupport())]
});
```

## Renderização consistente entre server-side e client-side

Evite introduzir blocos `@if` e outros condicionais que exibem conteúdo diferente ao renderizar no servidor do que ao renderizar no cliente, como usar um bloco `@if` com a função `isPlatformBrowser` do Angular. Essas diferenças de renderização causam layout shifts, impactando negativamente a experiência do usuário final e core web vitals.

## Bibliotecas de Terceiros com Manipulação do DOM

Existem várias bibliotecas de terceiros que dependem de manipulação do DOM para serem capazes de renderizar. Gráficos D3 são um exemplo primordial. Essas bibliotecas funcionavam sem hydration, mas podem causar erros de incompatibilidade de DOM quando hydration está habilitado. Por enquanto, se você encontrar erros de incompatibilidade de DOM usando uma dessas bibliotecas, você pode adicionar o atributo `ngSkipHydration` ao component que renderiza usando essa biblioteca.

## Scripts de Terceiros com Manipulação do DOM

Muitos scripts de terceiros, como rastreadores de anúncios e análises, modificam o DOM antes que hydration possa ocorrer. Esses scripts podem causar erros de hydration porque a página não corresponde mais à estrutura esperada pelo Angular. Prefira adiar este tipo de script até após hydration sempre que possível. Considere usar [`AfterNextRender`](api/core/afterNextRender) para atrasar o script até que processos pós-hydration tenham ocorrido.

## Incremental Hydration

Incremental hydration é uma forma avançada de hydration que permite controle mais granular sobre quando hydration acontece. Veja o [guia de incremental hydration](guide/incremental-hydration) para mais informações.
