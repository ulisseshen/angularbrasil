<!-- ia-translate: true -->

# Ciclo de Vida do Router e Eventos

O Router Angular fornece um conjunto abrangente de hooks de ciclo de vida e eventos que permitem que você responda a mudanças de navegação e execute lógica customizada durante o processo de roteamento.

## Eventos comuns do router

O Router Angular emite eventos de navegação que você pode fazer subscription para rastrear o ciclo de vida da navegação. Estes eventos estão disponíveis através do observable `Router.events`. Esta seção cobre eventos comuns de ciclo de vida de roteamento para navegação e rastreamento de erros (em ordem cronológica).

| Eventos                                             | Descrição                                                                                                     |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| [`NavigationStart`](api/router/NavigationStart)     | Ocorre quando a navegação começa e contém a URL requisitada.                                                  |
| [`RoutesRecognized`](api/router/RoutesRecognized)   | Ocorre depois que o router determina qual route corresponde à URL e contém as informações de estado da route. |
| [`GuardsCheckStart`](api/router/GuardsCheckStart)   | Inicia a fase de guard de route. O router avalia guards de route como `canActivate` e `canDeactivate`.        |
| [`GuardsCheckEnd`](api/router/GuardsCheckEnd)       | Sinaliza a conclusão da avaliação de guards. Contém o resultado (permitido/negado).                           |
| [`ResolveStart`](api/router/ResolveStart)           | Inicia a fase de resolução de dados. Resolvers de route começam a buscar dados.                               |
| [`ResolveEnd`](api/router/ResolveEnd)               | A resolução de dados é concluída. Todos os dados necessários ficam disponíveis.                               |
| [`NavigationEnd`](api/router/NavigationEnd)         | Evento final quando a navegação é concluída com sucesso. O router atualiza a URL.                             |
| [`NavigationSkipped`](api/router/NavigationSkipped) | Ocorre quando o router pula a navegação (ex: navegação para a mesma URL).                                     |

Os seguintes são eventos de erro comuns:

| Evento                                            | Descrição                                                                                    |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| [`NavigationCancel`](api/router/NavigationCancel) | Ocorre quando o router cancela a navegação. Frequentemente devido a um guard retornar false. |
| [`NavigationError`](api/router/NavigationError)   | Ocorre quando a navegação falha. Pode ser devido a routes inválidas ou erros de resolver.    |

Para uma lista de todos os eventos de ciclo de vida, confira a [tabela completa deste guia](#all-router-events).

## Como fazer subscription em eventos do router

Quando você deseja executar código durante eventos específicos do ciclo de vida de navegação, você pode fazer isso fazendo subscription em `router.events` e verificando a instância do evento:

```ts
// Exemplo de fazer subscription em eventos do router
import { Component, inject, signal, effect } from '@angular/core';
import { Event, Router, NavigationStart, NavigationEnd } from '@angular/router';

@Component({ ... })
export class RouterEventsComponent {
  private readonly router = inject(Router);

  constructor() {
    // Fazer subscription em eventos do router e reagir a eventos
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

Nota: O tipo [`Event`](api/router/Event) de `@angular/router` tem o mesmo nome que o tipo global regular [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event), mas é diferente do tipo [`RouterEvent`](api/router/RouterEvent).

## Como debugar eventos de roteamento

Debugar problemas de navegação do router pode ser desafiador sem visibilidade na sequência de eventos. O Angular fornece um recurso de debugging integrado que registra todos os eventos do router no console, ajudando você a entender o fluxo de navegação e identificar onde os problemas ocorrem.

Quando você precisa inspecionar uma sequência de eventos do Router, você pode habilitar logging para eventos internos de navegação para debugging. Você pode configurar isso passando uma opção de configuração (`withDebugTracing()`) que habilita logging detalhado no console de todos os eventos de roteamento.

```ts
import { provideRouter, withDebugTracing } from '@angular/router';

const appRoutes: Routes = [];
bootstrapApplication(AppComponent,
  {
    providers: [
      provideRouter(appRoutes, withDebugTracing())
    ]
  }
);
```

Para mais informações, confira a documentação oficial sobre [`withDebugTracing`](api/router/withDebugTracing).

## Casos de uso comuns

Eventos do router habilitam muitos recursos práticos em aplicações do mundo real. Aqui estão alguns padrões comuns que são usados com eventos do router.

### Indicadores de carregamento

Mostrar indicadores de carregamento durante a navegação:

```angular-ts
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-loading',
  template: `
    @if (loading()) {
      <div class="loading-spinner">Loading...</div>
    }
  `
})
export class AppComponent {
  private router = inject(Router);

  readonly loading = toSignal(
    this.router.events.pipe(
      map(() => !!this.router.getCurrentNavigation())
    ),
    { initialValue: false }
  );
}
```

### Rastreamento de analytics

Rastrear visualizações de página para analytics:

```ts
import { Component, inject, signal, effect } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  startTracking() {
    this.router.events.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(event => {
        // Rastrear visualizações de página quando a URL muda
        if (event instanceof NavigationEnd) {
           // Enviar visualização de página para analytics
          this.analytics.trackPageView(url);
        }
      });
  }

  private analytics = {
    trackPageView: (url: string) => {
      console.log('Page view tracked:', url);
    }
  };
}
```

### Tratamento de erros

Lidar com erros de navegação graciosamente e fornecer feedback ao usuário:

```angular-ts
import { Component, inject, signal } from '@angular/core';
import { Router, NavigationStart, NavigationError, NavigationCancel, NavigationCancellationCode } from '@angular/router';

@Component({
  selector: 'app-error-handler',
  template: `
    @if (errorMessage()) {
      <div class="error-banner">
        {{ errorMessage() }}
        <button (click)="dismissError()">Dismiss</button>
      </div>
    }
  `
})
export class ErrorHandlerComponent {
  private router = inject(Router);
  readonly errorMessage = signal('');

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe(event => {
      if (event instanceof NavigationStart) {
        this.errorMessage.set('');
      } else if (event instanceof NavigationError) {
        console.error('Navigation error:', event.error);
        this.errorMessage.set('Failed to load page. Please try again.');
      } else if (event instanceof NavigationCancel) {
        console.warn('Navigation cancelled:', event.reason);
        if (event.reason === NavigationCancellationCode.GuardRejected) {
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

## Todos os eventos do router

Para referência, aqui está a lista completa de todos os eventos do router disponíveis no Angular. Estes eventos são organizados por categoria e listados na ordem em que tipicamente ocorrem durante a navegação.

### Eventos de navegação

Estes eventos rastreiam o processo de navegação principal desde o início através do reconhecimento de route, verificações de guard e resolução de dados. Eles fornecem visibilidade em cada fase do ciclo de vida de navegação.

| Evento                                                    | Descrição                                                            |
| --------------------------------------------------------- | -------------------------------------------------------------------- |
| [`NavigationStart`](api/router/NavigationStart)           | Ocorre quando a navegação inicia                                     |
| [`RouteConfigLoadStart`](api/router/RouteConfigLoadStart) | Ocorre antes de fazer lazy loading de uma configuração de route      |
| [`RouteConfigLoadEnd`](api/router/RouteConfigLoadEnd)     | Ocorre depois que uma configuração de route com lazy loading carrega |
| [`RoutesRecognized`](api/router/RoutesRecognized)         | Ocorre quando o router analisa a URL e reconhece as routes           |
| [`GuardsCheckStart`](api/router/GuardsCheckStart)         | Ocorre no início da fase de guard                                    |
| [`GuardsCheckEnd`](api/router/GuardsCheckEnd)             | Ocorre no final da fase de guard                                     |
| [`ResolveStart`](api/router/ResolveStart)                 | Ocorre no início da fase de resolve                                  |
| [`ResolveEnd`](api/router/ResolveEnd)                     | Ocorre no final da fase de resolve                                   |

### Eventos de ativação {#all-router-events}

Estes eventos ocorrem durante a fase de ativação quando components de route estão sendo instanciados e inicializados. Eventos de ativação disparam para cada route na árvore de routes, incluindo routes pai e filha.

| Evento                                                    | Descrição                                   |
| --------------------------------------------------------- | ------------------------------------------- |
| [`ActivationStart`](api/router/ActivationStart)           | Ocorre no início da ativação de route       |
| [`ChildActivationStart`](api/router/ChildActivationStart) | Ocorre no início da ativação de route filha |
| [`ActivationEnd`](api/router/ActivationEnd)               | Ocorre no final da ativação de route        |
| [`ChildActivationEnd`](api/router/ChildActivationEnd)     | Ocorre no final da ativação de route filha  |

### Eventos de conclusão de navegação

Estes eventos representam o resultado final de uma tentativa de navegação. Toda navegação terminará com exatamente um destes eventos, indicando se teve sucesso, foi cancelada, falhou ou foi pulada.

| Evento                                              | Descrição                                                                |
| --------------------------------------------------- | ------------------------------------------------------------------------ |
| [`NavigationEnd`](api/router/NavigationEnd)         | Ocorre quando a navegação termina com sucesso                            |
| [`NavigationCancel`](api/router/NavigationCancel)   | Ocorre quando o router cancela a navegação                               |
| [`NavigationError`](api/router/NavigationError)     | Ocorre quando a navegação falha devido a um erro inesperado              |
| [`NavigationSkipped`](api/router/NavigationSkipped) | Ocorre quando o router pula a navegação (ex: navegação para a mesma URL) |

### Outros eventos

Há um evento adicional que ocorre fora do ciclo de vida principal de navegação, mas ainda é parte do sistema de eventos do router.

| Evento                        | Descrição                |
| ----------------------------- | ------------------------ |
| [`Scroll`](api/router/Scroll) | Ocorre durante a rolagem |

## Próximos passos

Saiba mais sobre [guards de route](/guide/routing/route-guards) e [tarefas comuns do router](/guide/routing/common-router-tasks).
