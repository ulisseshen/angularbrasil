<!-- ia-translate: true -->

# Ciclo de vida e eventos do Router

O Router Angular fornece um conjunto abrangente de hooks de ciclo de vida e eventos que permitem que você responda a mudanças de navegação e execute lógica customizada durante o processo de roteamento.

## Eventos comuns do router {#common-router-events}

O Router Angular emite eventos de navegação que você pode fazer subscription para rastrear o ciclo de vida da navegação. Estes eventos estão disponíveis através do observable `Router.events`. Esta seção cobre eventos comuns de ciclo de vida de roteamento para navegação e rastreamento de erros (em ordem cronológica).

| Eventos                                             | Descrição                                                                                                     |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| [`NavigationStart`](api/router/NavigationStart)     | Ocorre quando a navegação começa e contém a URL requisitada.                                                  |
| [`RoutesRecognized`](api/router/RoutesRecognized)   | Ocorre depois que o router determina qual route corresponde à URL e contém as informações de estado da route. |
| [`GuardsCheckStart`](api/router/GuardsCheckStart)   | Inicia a fase de guards de route. O router avalia guards de route como `canActivate` e `canDeactivate`.       |
| [`GuardsCheckEnd`](api/router/GuardsCheckEnd)       | Sinaliza a conclusão da avaliação dos guards. Contém o resultado (permitido/negado).                          |
| [`ResolveStart`](api/router/ResolveStart)           | Inicia a fase de resolução de dados. Resolvers de route e resources começam a buscar dados.                   |
| [`ResolveEnd`](api/router/ResolveEnd)               | A resolução de dados é concluída. Todos os dados e recursos bloqueantes necessários ficam disponíveis.        |
| [`NavigationEnd`](api/router/NavigationEnd)         | Evento final quando a navegação é concluída com sucesso. O router atualiza a URL.                             |
| [`NavigationSkipped`](api/router/NavigationSkipped) | Ocorre quando o router pula a navegação (ex.: navegação para a mesma URL).                                    |

Os seguintes são eventos de erro comuns:

| Evento                                            | Descrição                                                                                                                  |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| [`NavigationCancel`](api/router/NavigationCancel) | Ocorre quando o router cancela a navegação. Frequentemente devido a um guard retornar false.                               |
| [`NavigationError`](api/router/NavigationError)   | Ocorre quando a navegação falha. Pode ser devido a routes inválidas, erros de resolver ou recursos bloqueantes rejeitados. |

Para uma lista de todos os eventos de ciclo de vida, confira a [tabela completa deste guia](#all-router-events).

## Como fazer subscription em eventos do router {#how-to-subscribe-to-router-events}

Quando você quiser executar código durante eventos específicos do ciclo de vida da navegação, pode fazer isso através de subscription em `router.events` e verificando a instância do evento:

```ts
// Exemplo de subscription em eventos do router
import {Component, inject, signal, effect} from '@angular/core';
import {Event, Router, NavigationStart, NavigationEnd} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component(/* ... */)
export class RouterEvents {
  private readonly router = inject(Router);

  constructor() {
    // Faz subscription em eventos do router e reage a eventos
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // Navegação iniciando
        console.log('Navigation starting:', event.url);
      }
      if (event instanceof NavigationEnd) {
        // Navegação concluída
        console.log('Navigation completed:', event.url);
      }
    });
  }
}
```

NOTE: O tipo [`Event`](api/router/Event) de `@angular/router` tem o mesmo nome que o tipo global [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event), mas é diferente do tipo [`RouterEvent`](api/router/RouterEvent).

## Como depurar eventos de roteamento {#how-to-debug-routing-events}

Depurar problemas de navegação do router pode ser desafiador sem visibilidade da sequência de eventos. O Angular fornece um recurso de depuração integrado que registra no console todos os eventos do router, ajudando você a entender o fluxo de navegação e identificar onde os problemas ocorrem.

Quando você precisar inspecionar a sequência de eventos do Router, pode habilitar o log dos eventos internos de navegação para depuração. Isso pode ser configurado passando uma opção de configuração (`withDebugTracing()`) que habilita o log detalhado no console de todos os eventos de roteamento.

```ts
import {provideRouter, Routes, withDebugTracing} from '@angular/router';
import {bootstrapApplication} from '@angular/platform-browser';

const appRoutes: Routes = [];
bootstrapApplication(App, {
  providers: [provideRouter(appRoutes, withDebugTracing())],
});
```

Para mais informações, confira a documentação oficial sobre [`withDebugTracing`](api/router/withDebugTracing).

## Casos de uso comuns {#common-use-cases}

Eventos do router habilitam muitos recursos práticos em aplicações do mundo real. Aqui estão alguns padrões comuns usados com eventos do router.

### Indicadores de carregamento {#loading-indicators}

Mostre indicadores de carregamento durante a navegação:

```angular-ts
import {Component, computed, inject} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    @if (isNavigating()) {
      <div class="loading-bar">Loading...</div>
    }
    <router-outlet />
  `,
})
export class App {
  private router = inject(Router);
  isNavigating = computed(() => !!this.router.currentNavigation());
}
```

### Rastreamento de analytics {#analytics-tracking}

Rastreie visualizações de página para analytics:

```ts
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {inject, DestroyRef, Service} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';

@Service()
export class AnalyticsService {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  startTracking() {
    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
      // Rastreia visualizações de página quando a URL muda
      if (event instanceof NavigationEnd) {
        // Envia a visualização de página para analytics
        this.analytics.trackPageView(event.url);
      }
    });
  }

  private analytics = {
    trackPageView: (url: string) => {
      console.log('Page view tracked:', url);
    },
  };
}
```

### Tratamento de erros {#error-handling}

Trate erros de navegação de forma elegante e forneça feedback ao usuário:

```angular-ts
import {Component, inject, signal} from '@angular/core';
import {
  Router,
  NavigationStart,
  NavigationError,
  NavigationCancel,
  NavigationCancellationCode,
} from '@angular/router';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-error-handler',
  template: `
    @if (errorMessage()) {
      <div class="error-banner">
        {{ errorMessage() }}
        <button (click)="dismissError()">Dismiss</button>
      </div>
    }
  `,
})
export class ErrorHandler {
  private router = inject(Router);
  readonly errorMessage = signal('');

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.errorMessage.set('');
      } else if (event instanceof NavigationError) {
        console.error('Navigation error:', event.error);
        this.errorMessage.set('Failed to load page. Please try again.');
      } else if (event instanceof NavigationCancel) {
        console.warn('Navigation cancelled:', event.reason);
        if (event.code === NavigationCancellationCode.GuardRejected) {
          this.errorMessage.set('Access denied. Please check your permissions.');
        }
      }
    });
  }

  dismissError() {
    this.errorMessage.set('');
  }
}
```

## Todos os eventos do router {#all-router-events}

Para referência, aqui está a lista completa de todos os eventos do router disponíveis no Angular. Estes eventos são organizados por categoria e listados na ordem em que tipicamente ocorrem durante a navegação.

### Eventos de navegação {#navigation-events}

Estes eventos rastreiam o processo principal de navegação, desde o início, passando pelo reconhecimento da route, verificações de guards e resolução de dados. Eles fornecem visibilidade de cada fase do ciclo de vida da navegação.

| Evento                                                    | Descrição                                                              |
| --------------------------------------------------------- | ---------------------------------------------------------------------- |
| [`NavigationStart`](api/router/NavigationStart)           | Ocorre quando a navegação inicia                                       |
| [`RouteConfigLoadStart`](api/router/RouteConfigLoadStart) | Ocorre antes de fazer lazy loading de uma configuração de route        |
| [`RouteConfigLoadEnd`](api/router/RouteConfigLoadEnd)     | Ocorre depois que uma configuração de route com lazy loading é carregada |
| [`RoutesRecognized`](api/router/RoutesRecognized)         | Ocorre quando o router analisa a URL e reconhece as routes             |
| [`GuardsCheckStart`](api/router/GuardsCheckStart)         | Ocorre no início da fase de guards                                     |
| [`GuardsCheckEnd`](api/router/GuardsCheckEnd)             | Ocorre no final da fase de guards                                      |
| [`ResolveStart`](api/router/ResolveStart)                 | Ocorre no início da fase de resolução                                  |
| [`ResolveEnd`](api/router/ResolveEnd)                     | Ocorre no final da fase de resolução                                   |

### Eventos de ativação {#activation-events}

Estes eventos ocorrem durante a fase de ativação, quando os components das routes estão sendo instanciados e inicializados. Eventos de ativação disparam para cada route na árvore de routes, incluindo routes pai e filhas.

| Evento                                                    | Descrição                                     |
| --------------------------------------------------------- | --------------------------------------------- |
| [`ActivationStart`](api/router/ActivationStart)           | Ocorre no início da ativação da route         |
| [`ChildActivationStart`](api/router/ChildActivationStart) | Ocorre no início da ativação da route filha   |
| [`ActivationEnd`](api/router/ActivationEnd)               | Ocorre no final da ativação da route          |
| [`ChildActivationEnd`](api/router/ChildActivationEnd)     | Ocorre no final da ativação da route filha    |

### Eventos de conclusão de navegação {#navigation-completion-events}

Estes eventos representam o resultado final de uma tentativa de navegação. Toda navegação terminará com exatamente um destes eventos, indicando se teve sucesso, foi cancelada, falhou ou foi pulada.

| Evento                                              | Descrição                                                                |
| --------------------------------------------------- | ------------------------------------------------------------------------ |
| [`NavigationEnd`](api/router/NavigationEnd)         | Ocorre quando a navegação termina com sucesso                            |
| [`NavigationCancel`](api/router/NavigationCancel)   | Ocorre quando o router cancela a navegação                               |
| [`NavigationError`](api/router/NavigationError)     | Ocorre quando a navegação falha devido a um erro inesperado              |
| [`NavigationSkipped`](api/router/NavigationSkipped) | Ocorre quando o router pula a navegação (ex.: navegação para a mesma URL) |

### Outros eventos {#other-events}

Há um evento adicional que ocorre fora do ciclo de vida principal da navegação, mas que ainda faz parte do sistema de eventos do router.

| Evento                        | Descrição                |
| ----------------------------- | ------------------------ |
| [`Scroll`](api/router/Scroll) | Ocorre durante a rolagem |

## Próximos passos {#next-steps}

Saiba mais sobre [guards de route](/guide/routing/route-guards), [data fetching com resources](/guide/routing/data-fetching-with-resources) e [tarefas comuns do router](/guide/routing/common-router-tasks).
