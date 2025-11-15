<!-- ia-translate: true -->
# Animações de transição de route

Animações de transição de route melhoram a experiência do usuário fornecendo transições visuais suaves ao navegar entre diferentes visualizações na sua aplicação Angular. O [Angular Router](/guide/routing/overview) inclui suporte integrado para a API de View Transitions do navegador, permitindo animações perfeitas entre mudanças de route em navegadores suportados.

ÚTIL: A integração nativa de View Transitions do Router está atualmente em [developer preview](/reference/releases#developer-preview). View Transitions nativas são um recurso de navegador relativamente novo com suporte limitado em todos os navegadores.

## Como funcionam as View Transitions

View transitions usam a API nativa do navegador [`document.startViewTransition`](https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition) para criar animações suaves entre diferentes estados da sua aplicação. A API funciona:

1. **Capturando o estado atual** - O navegador tira uma captura de tela da página atual
2. **Executando a atualização do DOM** - Sua função de callback roda para atualizar o DOM
3. **Capturando o novo estado** - O navegador captura o estado atualizado da página
4. **Reproduzindo a transição** - O navegador anima entre os estados antigo e novo

Aqui está a estrutura básica da API `startViewTransition`:

```ts
document.startViewTransition(async () => {
  await updateTheDOMSomehow();
});
```

Para mais detalhes sobre a API do navegador, veja o [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions).

## Como o Router usa view transitions

O Angular Router integra view transitions no ciclo de vida de navegação para criar mudanças de route perfeitas. Durante a navegação, o Router:

1. **Completa a preparação da navegação** - Correspondência de route, [lazy loading](/guide/routing/define-routes#lazily-loaded-components), [guards](/guide/routing/route-guards) e [resolvers](/guide/routing/data-resolvers) são executados
2. **Inicia a view transition** - O Router chama `startViewTransition` quando as routes estão prontas para ativação
3. **Atualiza o DOM** - O Router ativa novas routes e desativa antigas dentro do callback de transição
4. **Finaliza a transição** - A Promise de transição é resolvida quando o Angular completa a renderização

A integração de view transition do Router age como um [progressive enhancement](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement). Quando os navegadores não suportam a API de View Transitions, o Router realiza atualizações normais do DOM sem animação, garantindo que sua aplicação funcione em todos os navegadores.

## Habilitando View Transitions no Router

Habilite view transitions adicionando o recurso `withViewTransitions` à sua [configuração de router](/guide/routing/define-routes#adding-the-router-to-your-application). O Angular suporta abordagens de bootstrap standalone e NgModule:

### Bootstrap standalone

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';

bootstrapApplication(MyApp, {
  providers: [
    provideRouter(routes, withViewTransitions()),
  ]
});
```

### Bootstrap NgModule

```ts
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableViewTransitions: true})]
})
export class AppRouting {}
```

[Experimente o exemplo "count" no StackBlitz](https://stackblitz.com/edit/stackblitz-starters-2dnvtm?file=src%2Fmain.ts)

Este exemplo demonstra como a navegação do router pode substituir chamadas diretas de `startViewTransition` para atualizações de contador.

## Personalizando transições com CSS

Você pode personalizar view transitions usando CSS para criar efeitos de animação únicos. O navegador cria elementos de transição separados que você pode segmentar com seletores CSS.

Para criar transições personalizadas:

1. **Adicione view-transition-name** - Atribua nomes únicos aos elementos que você deseja animar
2. **Defina animações globais** - Crie animações CSS nos seus estilos globais
3. **Segmente pseudo-elementos de transição** - Use os seletores `::view-transition-old()` e `::view-transition-new()`

Aqui está um exemplo que adiciona um efeito de rotação a um elemento contador:

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

IMPORTANTE: Defina animações de view transition no seu arquivo de estilos globais, não nos estilos de component. O [view encapsulation](/guide/components/styling#view-encapsulation) do Angular escopa estilos de component, o que impede que eles segmentem os pseudo-elementos de transição corretamente.

[Experimente o exemplo "count" atualizado no StackBlitz](https://stackblitz.com/edit/stackblitz-starters-fwn4i7?file=src%2Fmain.ts)

## Controle avançado de transição com onViewTransitionCreated

O recurso `withViewTransitions` aceita um objeto de opções com um callback `onViewTransitionCreated` para controle avançado sobre view transitions. Este callback:

- Roda em um [injection context](/guide/di/dependency-injection-context#run-within-an-injection-context)
- Recebe um objeto [`ViewTransitionInfo`](/api/router/ViewTransitionInfo) contendo:
  - A instância `ViewTransition` de `startViewTransition`
  - O [`ActivatedRouteSnapshot`](/api/router/ActivatedRouteSnapshot) para a route de onde está navegando
  - O [`ActivatedRouteSnapshot`](/api/router/ActivatedRouteSnapshot) para a route para onde está navegando

Use este callback para personalizar o comportamento de transição com base no contexto de navegação. Por exemplo, você pode pular transições para tipos específicos de navegação:

```ts
import { inject } from '@angular/core';
import { Router, withViewTransitions } from '@angular/router';

withViewTransitions({
  onViewTransitionCreated: ({transition}) => {
    const router = inject(Router);
    const targetUrl = router.getCurrentNavigation()!.finalUrl!;

    // Skip transition if only fragment or query params change
    const config = {
      paths: 'exact',
      matrixParams: 'exact',
      fragment: 'ignored',
      queryParams: 'ignored',
    };

    if (router.isActive(targetUrl, config)) {
      transition.skipTransition();
    }
  },
})
```

Este exemplo pula a view transition quando a navegação apenas muda o [fragmento de URL ou query parameters](/guide/routing/read-route-state#query-parameters) (como links âncora dentro da mesma página). O método `skipTransition()` previne a animação enquanto ainda permite que a navegação seja completada.

## Exemplos do Chrome explainer adaptados para Angular

Os exemplos a seguir demonstram várias técnicas de view transition adaptadas da documentação da equipe do Chrome para uso com o Angular Router:

### Elementos em transição não precisam ser o mesmo elemento DOM

Elementos podem transicionar suavemente entre diferentes elementos DOM, desde que compartilhem o mesmo `view-transition-name`.

- [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#transitioning_elements_dont_need_to_be_the_same_dom_element)
- [Exemplo Angular no StackBlitz](https://stackblitz.com/edit/stackblitz-starters-dh8npr?file=src%2Fmain.ts)

### Animações de entrada e saída personalizadas

Crie animações únicas para elementos entrando e saindo do viewport durante transições de route.

- [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#custom_entry_and_exit_transitions)
- [Exemplo Angular no StackBlitz](https://stackblitz.com/edit/stackblitz-starters-8kly3o)

### Atualizações assíncronas do DOM e espera por conteúdo

O Angular Router prioriza transições imediatas sobre esperar por conteúdo adicional para carregar.

- [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#async_dom_updates_and_waiting_for_content)

NOTA: O Angular Router não fornece uma maneira de atrasar view transitions. Esta escolha de design evita que as páginas se tornem não interativas enquanto aguardam conteúdo adicional. Como a documentação do Chrome observa: "Durante este tempo, a página está congelada, então os atrasos aqui devem ser mantidos ao mínimo...em alguns casos é melhor evitar o atraso completamente e usar o conteúdo que você já tem."

### Lidar com múltiplos estilos de view transition com view transition types

Use view transition types para aplicar diferentes estilos de animação com base no contexto de navegação.

- [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#view-transition-types)
- [Exemplo Angular no StackBlitz](https://stackblitz.com/edit/stackblitz-starters-vxzcam)

### Lidar com múltiplos estilos de view transition com um nome de classe na raiz de view transition (descontinuado)

Esta abordagem usa classes CSS no elemento raiz de transição para controlar estilos de animação.

- [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#changing-on-navigation-type)
- [Exemplo Angular no StackBlitz](https://stackblitz.com/edit/stackblitz-starters-nmnzzg?file=src%2Fmain.ts)

### Transicionando sem congelar outras animações

Mantenha outras animações de página durante view transitions para criar experiências de usuário mais dinâmicas.

- [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#transitioning-without-freezing)
- [Exemplo Angular no StackBlitz](https://stackblitz.com/edit/stackblitz-starters-76kgww)

### Animando com JavaScript

Controle view transitions programaticamente usando APIs JavaScript para cenários de animação complexos.

- [Chrome Explainer](https://developer.chrome.com/docs/web-platform/view-transitions/same-document#animating-with-javascript)
- [Exemplo Angular no StackBlitz](https://stackblitz.com/edit/stackblitz-starters-cklnkm)
