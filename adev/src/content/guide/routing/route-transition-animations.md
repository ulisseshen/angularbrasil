<!-- ia-translate: true -->

# Animações de transição de routes {#route-transition-animations}

As animações de transição de routes melhoram a experiência do usuário ao oferecer transições visuais suaves ao navegar entre diferentes views na sua aplicação Angular. O [Angular Router](/guide/routing) inclui suporte nativo à API View Transitions do navegador, o que permite animações fluidas entre as mudanças de route em navegadores compatíveis.

HELPFUL: A integração nativa de View Transitions do Router está atualmente em [developer preview](/reference/releases#developer-preview). View Transitions nativas são um recurso relativamente novo dos navegadores, com suporte limitado entre eles.

## Como funcionam as View Transitions {#how-view-transitions-work}

As view transitions usam a API nativa do navegador [`document.startViewTransition`](https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition) para criar animações suaves entre diferentes estados da sua aplicação. A API funciona da seguinte forma:

1. **Capturando o estado atual**: o navegador tira uma captura de tela da página atual
2. **Executando a atualização do DOM**: sua função de callback é executada para atualizar o DOM
3. **Capturando o novo estado**: o navegador captura o estado atualizado da página
4. **Reproduzindo a transição**: o navegador anima a passagem entre os estados antigo e novo

Esta é a estrutura básica da API `startViewTransition`:

```ts
document.startViewTransition(async () => {
  await updateTheDOMSomehow();
});
```

Para mais detalhes sobre a API do navegador, veja o [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions).

## Como o Router usa as view transitions {#how-the-router-uses-view-transitions}

O Angular Router integra as view transitions ao ciclo de vida da navegação para criar mudanças de route fluidas. Durante a navegação, o Router:

1. **Conclui a preparação da navegação**: correspondência de routes, [lazy loading](guide/routing/loading-strategies#lazily-loaded-components-and-routes), [guards](/guide/routing/route-guards), [resources](/guide/routing/data-fetching-with-resources) e [resolvers](/guide/routing/data-resolvers) são executados
2. **Inicia a view transition**: o Router chama `startViewTransition` quando as routes estão prontas para ativação
3. **Atualiza o DOM**: o Router ativa as novas routes e desativa as antigas dentro do callback da transição
4. **Finaliza a transição**: a Promise da transição é resolvida quando o Angular conclui a renderização

A integração de view transitions do Router funciona como um [progressive enhancement](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement). Quando os navegadores não suportam a API View Transitions, o Router realiza atualizações normais do DOM, sem animação, garantindo que sua aplicação funcione em todos os navegadores.

## Habilitando View Transitions no Router {#enabling-view-transitions-in-the-router}

Habilite as view transitions adicionando o recurso `withViewTransitions` à sua [configuração do router](/guide/routing/define-routes#adding-the-router-to-your-application). O Angular oferece suporte tanto à abordagem de bootstrap standalone quanto à de NgModule:

### Bootstrap standalone {#standalone-bootstrap}

```ts
import {bootstrapApplication} from '@angular/platform-browser';
import {provideRouter, withViewTransitions} from '@angular/router';
import {routes} from './app.routes';

bootstrapApplication(MyApp, {
  providers: [provideRouter(routes, withViewTransitions())],
});
```

### Bootstrap com NgModule {#ngmodule-bootstrap}

```ts
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableViewTransitions: true})],
})
export class AppRouting {}
```

[Experimente o exemplo "count" no StackBlitz](https://stackblitz.com/edit/stackblitz-starters-2dnvtm?file=src%2Fmain.ts)

Este exemplo demonstra como a navegação do router pode substituir chamadas diretas a `startViewTransition` para atualizações de contador.

## Personalizando as transições com CSS {#customizing-transitions-with-css}

Você pode personalizar as view transitions usando CSS para criar efeitos de animação exclusivos. O navegador cria elementos de transição separados, que podem ser direcionados com seletores CSS.

Para criar transições personalizadas:

1. **Adicione view-transition-name**: atribua nomes exclusivos aos elementos que você quer animar
2. **Defina animações globais**: crie animações CSS nos seus estilos globais
3. **Direcione os pseudo-elementos de transição**: use os seletores `::view-transition-old()` e `::view-transition-new()`

Veja um exemplo que adiciona um efeito de rotação a um elemento de contador:

```css
/* Define keyframe animations */
@keyframes rotate-out {
  to {
    transform: rotate(90deg);
  }
}

@keyframes rotate-in {
  from {
    transform: rotate(-90deg);
  }
}

/* Target view transition pseudo-elements */
::view-transition-old(count),
::view-transition-new(count) {
  animation-duration: 200ms;
  animation-name: -ua-view-transition-fade-in, rotate-in;
}

::view-transition-old(count) {
  animation-name: -ua-view-transition-fade-out, rotate-out;
}
```

IMPORTANT: Defina as animações de view transition no seu arquivo de estilos globais, não nos estilos de component. O [view encapsulation](/guide/components/styling#style-scoping) do Angular limita o escopo dos estilos de component, o que impede que eles direcionem corretamente os pseudo-elementos de transição.

[Experimente o exemplo "count" atualizado no StackBlitz](https://stackblitz.com/edit/stackblitz-starters-fwn4i7?file=src%2Fmain.ts)

## Controle avançado de transição com onViewTransitionCreated {#advanced-transition-control-with-onviewtransitioncreated}

O recurso `withViewTransitions` aceita um objeto de opções com um callback `onViewTransitionCreated`, para controle avançado sobre as view transitions. Este callback:

- É executado em um [injection context](/guide/di/dependency-injection-context#run-within-an-injection-context)
- Recebe um objeto [`ViewTransitionInfo`](/api/router/ViewTransitionInfo) contendo:
  - A instância de `ViewTransition` retornada por `startViewTransition`
  - O [`ActivatedRouteSnapshot`](/api/router/ActivatedRouteSnapshot) da route de onde a navegação parte
  - O [`ActivatedRouteSnapshot`](/api/router/ActivatedRouteSnapshot) da route para onde a navegação vai

Use este callback para personalizar o comportamento da transição com base no contexto da navegação. Por exemplo, você pode pular transições para tipos específicos de navegação:

```ts
import {inject} from '@angular/core';
import {Router, withViewTransitions, isActive, IsActiveMatchOptions} from '@angular/router';

withViewTransitions({
  onViewTransitionCreated: ({transition}) => {
    const router = inject(Router);
    const targetUrl = router.currentNavigation()!.finalUrl!;

    // Skip transition if only fragment or query params change
    const config: Partial<IsActiveMatchOptions> = {
      paths: 'exact',
      matrixParams: 'exact',
      fragment: 'ignored',
      queryParams: 'ignored',
    };

    const isTargetRouteCurrent = isActive(targetUrl, router, config);

    if (isTargetRouteCurrent()) {
      transition.skipTransition();
    }
  },
});
```

Este exemplo pula a view transition quando a navegação altera apenas o [fragmento da URL ou os query parameters](/guide/routing/read-route-state#query-parameters) (como links âncora dentro da mesma página). O método `skipTransition()` impede a animação, mas ainda permite que a navegação seja concluída.

## Respeitando as preferências de movimento do usuário {#respecting-the-users-motion-preferences}

O Router executa as view transitions independentemente da configuração [`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) do usuário. Uma preferência por movimento reduzido não significa necessariamente que o usuário não quer nenhum movimento, por isso o framework deixa a escolha para a aplicação: você pode [oferecer animações mais sutis](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#react_to_the_reduced_motion_preference) para esses usuários ou pular a transição por completo com o callback `onViewTransitionCreated`:

```ts
withViewTransitions({
  onViewTransitionCreated: ({transition}) => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      transition.skipTransition();
    }
  },
});
```

## Exemplos do Chrome explainer adaptados para Angular {#examples-from-the-chrome-explainer-adapted-to-angular}

Os exemplos a seguir demonstram várias técnicas de view transition adaptadas da documentação da equipe do Chrome para uso com o Angular Router:

### Elementos em transição não precisam ser o mesmo elemento DOM {#transitioning-elements-dont-need-to-be-the-same-dom-element}

Elementos podem transicionar suavemente entre diferentes elementos DOM, desde que compartilhem o mesmo `view-transition-name`.

- [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#transitioning_elements_dont_need_to_be_the_same_dom_element)
- [Exemplo Angular no StackBlitz](https://stackblitz.com/edit/stackblitz-starters-dh8npr?file=src%2Fmain.ts)

### Animações personalizadas de entrada e saída {#custom-entry-and-exit-animations}

Crie animações exclusivas para elementos que entram e saem da viewport durante as transições de route.

- [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#custom_entry_and_exit_transitions)
- [Exemplo Angular no StackBlitz](https://stackblitz.com/edit/stackblitz-starters-8kly3o)

### Atualizações assíncronas do DOM e espera por conteúdo {#async-dom-updates-and-waiting-for-content}

O Angular Router prioriza transições imediatas em vez de esperar que conteúdo adicional seja carregado.

- [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#async_dom_updates_and_waiting_for_content)

NOTE: O Angular Router não oferece uma forma de atrasar as view transitions. Essa decisão de design evita que as páginas fiquem não interativas enquanto aguardam conteúdo adicional. Como observa a documentação do Chrome: "Durante esse tempo, a página fica congelada, então os atrasos devem ser mantidos no mínimo… em alguns casos, é melhor evitar o atraso por completo e usar o conteúdo que você já tem."

### Lidando com múltiplos estilos de view transition com view transition types {#handle-multiple-view-transition-styles-with-view-transition-types}

Use view transition types para aplicar diferentes estilos de animação com base no contexto da navegação.

- [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#view-transition-types)
- [Exemplo Angular no StackBlitz](https://stackblitz.com/edit/stackblitz-starters-vxzcam)

### Lidando com múltiplos estilos de view transition com um nome de classe na raiz da view transition (descontinuado) {#handle-multiple-view-transition-styles-with-a-class-name-on-the-view-transition-root-deprecated}

Esta abordagem usa classes CSS no elemento raiz da transição para controlar os estilos de animação.

- [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#changing-on-navigation-type)
- [Exemplo Angular no StackBlitz](https://stackblitz.com/edit/stackblitz-starters-nmnzzg?file=src%2Fmain.ts)

### Transicionando sem congelar outras animações {#transitioning-without-freezing-other-animations}

Mantenha outras animações da página durante as view transitions para criar experiências de usuário mais dinâmicas.

- [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#transitioning-without-freezing)
- [Exemplo Angular no StackBlitz](https://stackblitz.com/edit/stackblitz-starters-76kgww)

### Animando com JavaScript {#animating-with-javascript}

Controle as view transitions programaticamente usando APIs JavaScript para cenários de animação complexos.

- [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#animating-with-javascript)
- [Exemplo Angular no StackBlitz](https://stackblitz.com/edit/stackblitz-starters-cklnkm)
