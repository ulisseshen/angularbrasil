<!-- ia-translate: true -->
# Resolvers de dados {#data-resolvers}

Os resolvers de dados permitem buscar dados antes de navegar para uma rota, garantindo que seus componentes recebam os dados de que precisam antes da renderização. Isso ajuda a evitar a necessidade de estados de carregamento e melhora a experiência do usuário ao pré-carregar dados essenciais.

TIP: Se a sua aplicação usa Angular Signals, considere usar [recursos de rota](/guide/routing/data-fetching-with-resources) para a busca de dados reativa com as APIs `Resource` e suporte integrado ao carregamento de dados não bloqueante.

## O que são resolvers de dados? {#what-are-data-resolvers}

Um resolver de dados é um serviço que implementa a função `ResolveFn`. Ele é executado antes que uma rota seja ativada e pode buscar dados de APIs, bancos de dados ou outras fontes. Os dados resolvidos ficam disponíveis para o componente por meio do `ActivatedRoute`.

Os resolvers de dados têm acesso aos [serviços fornecidos no nível da rota](guide/di/defining-dependency-providers#route-providers), bem como às informações específicas da rota, por meio do argumento `route`.

## Por que usar resolvers de dados? {#why-use-data-resolvers}

Os resolvers de dados resolvem desafios comuns de roteamento:

- **Evitar estados vazios**: Os componentes recebem os dados imediatamente ao carregar
- **Melhor experiência do usuário**: Sem spinners de carregamento para dados críticos
- **Tratamento de erros**: Lidar com falhas na busca de dados antes da navegação
- **Consistência dos dados**: Garantir que os dados necessários estejam disponíveis antes da renderização, o que é importante para SSR

## Criando um resolver {#creating-a-resolver}

Você cria um resolver escrevendo uma função do tipo `ResolveFn`.

Ela recebe o `ActivatedRouteSnapshot` e o `RouterStateSnapshot` como parâmetros.

Aqui está um resolver que obtém as informações do usuário antes de renderizar uma rota, usando a função [`inject`](api/core/inject):

```ts
import {inject} from '@angular/core';
import {UserStore, SettingsStore} from './user-store';
import type {ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot} from '@angular/router';
import type {User, Settings} from './types';

export const userResolver: ResolveFn<User> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const userStore = inject(UserStore);
  const userId = route.paramMap.get('id')!;
  return userStore.getUser(userId);
};

export const settingsResolver: ResolveFn<Settings> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const settingsStore = inject(SettingsStore);
  const userId = route.paramMap.get('id')!;
  return settingsStore.getUserSettings(userId);
};
```

## Configurando rotas com resolvers {#configuring-routes-with-resolvers}

Quando você quiser adicionar um ou mais resolvers de dados a uma rota, pode incluí-los na chave `resolve` da configuração da rota. O tipo `Routes` define a estrutura das configurações de rota:

```ts
import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'user/:id',
    component: UserDetail,
    resolve: {
      user: userResolver,
      settings: settingsResolver,
    },
  },
];
```

Você pode saber mais sobre a [configuração `resolve` na documentação da API](api/router/Route#resolve).

## Acessando dados resolvidos em componentes {#accessing-resolved-data-in-components}

### Usando ActivatedRoute {#using-activatedroute}

Você pode acessar os dados resolvidos em um componente convertendo o observable `data` do `ActivatedRoute` em um signal, com a função `toSignal`:

```angular-ts
import {Component, inject, computed} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import type {User, Settings} from './types';

@Component({
  template: `
    <h1>{{ user().name }}</h1>
    <p>{{ user().email }}</p>
    <div>Tema: {{ settings().theme }}</div>
  `,
})
export class UserDetail {
  private route = inject(ActivatedRoute);
  private data = toSignal(this.route.data, {requireSync: true});
  user = computed(() => this.data().user as User);
  settings = computed(() => this.data().settings as Settings);
}
```

### Usando withComponentInputBinding {#using-withcomponentinputbinding}

Uma abordagem diferente para acessar os dados resolvidos é usar `withComponentInputBinding()` ao configurar o seu router com `provideRouter`. Isso permite passar os dados resolvidos diretamente como inputs do componente:

```ts
import {bootstrapApplication} from '@angular/platform-browser';
import {provideRouter, withComponentInputBinding} from '@angular/router';
import {routes} from './app.routes';

bootstrapApplication(App, {
  providers: [provideRouter(routes, withComponentInputBinding())],
});
```

Com essa configuração, você pode definir inputs no seu componente que correspondam às chaves do resolver, usando a função `input` e `input.required` para os inputs obrigatórios:

```angular-ts
import {Component, input} from '@angular/core';
import type {User, Settings} from './types';

@Component({
  template: `
    <h1>{{ user().name }}</h1>
    <p>{{ user().email }}</p>
    <div>Tema: {{ settings().theme }}</div>
  `,
})
export class UserDetail {
  user = input.required<User>();
  settings = input.required<Settings>();
}
```

Essa abordagem oferece melhor segurança de tipos e elimina a necessidade de injetar o `ActivatedRoute` apenas para acessar os dados resolvidos.

## Tratamento de erros em resolvers {#error-handling-in-resolvers}

Em caso de falhas de navegação, é importante tratar os erros com cuidado nos seus resolvers de dados. Caso contrário, um `NavigationError` será gerado e a navegação para a rota atual falhará, o que resulta em uma experiência ruim para os usuários.

Existem três formas principais de lidar com erros em resolvers de dados:

1. Centralizar o tratamento de erros em `withNavigationErrorHandler`
2. Gerenciar os erros por meio de uma inscrição nos eventos do router
3. Tratar os erros diretamente no resolver

### Centralizando o tratamento de erros em `withNavigationErrorHandler` {#centralize-error-handling-in-withnavigationerrorhandler}

O recurso [`withNavigationErrorHandler`](api/router/withNavigationErrorHandler) oferece uma forma centralizada de tratar todos os erros de navegação, incluindo os de resolvers de dados que falharam. Essa abordagem mantém a lógica de tratamento de erros em um só lugar e evita código duplicado de tratamento de erros entre os resolvers.

```ts
import {bootstrapApplication} from '@angular/platform-browser';
import {provideRouter, Router, withNavigationErrorHandler} from '@angular/router';
import {inject} from '@angular/core';
import {routes} from './app.routes';

bootstrapApplication(App, {
  providers: [
    provideRouter(
      routes,
      withNavigationErrorHandler((error) => {
        const router = inject(Router);

        if (error.error?.message) {
          console.error('Erro de navegação:', error.error.message);
        }

        router.navigate(['/error']);
      }),
    ),
  ],
});
```

Com essa configuração, seus resolvers podem focar na busca de dados, enquanto o handler centralizado cuida dos cenários de erro:

```ts
export const userResolver: ResolveFn<User> = (route) => {
  const userStore = inject(UserStore);
  const userId = route.paramMap.get('id')!;
  // Não é necessário tratamento explícito de erros - deixe o erro se propagar
  return userStore.getUser(userId);
};
```

### Gerenciando erros por meio de uma inscrição nos eventos do router {#managing-errors-through-a-subscription-to-router-events}

Você também pode tratar os erros dos resolvers se inscrevendo nos eventos do router e escutando os eventos `NavigationError`. Essa abordagem oferece um controle mais granular sobre o tratamento de erros e permite implementar uma lógica customizada de recuperação.

```angular-ts
import {Component, inject, signal} from '@angular/core';
import {Router, NavigationError, RouterOutlet} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    @if (errorMessage()) {
      <div class="error-banner">
        {{ errorMessage() }}
        <button (click)="retryNavigation()">Tentar novamente</button>
      </div>
    }
    <router-outlet />
  `,
})
export class App {
  private router = inject(Router);
  private lastFailedUrl = signal('');

  private navigationErrors = toSignal(
    this.router.events.pipe(
      map((event) => {
        if (event instanceof NavigationError) {
          this.lastFailedUrl.set(event.url);

          if (event.error) {
            console.error('Erro de navegação', event.error);
          }

          return 'A navegação falhou. Tente novamente.';
        }
        return '';
      }),
    ),
    {initialValue: ''},
  );

  errorMessage = this.navigationErrors;

  retryNavigation() {
    if (this.lastFailedUrl()) {
      this.router.navigateByUrl(this.lastFailedUrl());
    }
  }
}
```

Essa abordagem é especialmente útil quando você precisa:

- Implementar uma lógica de nova tentativa customizada para navegações que falharam
- Exibir mensagens de erro específicas de acordo com o tipo de falha
- Rastrear falhas de navegação para fins de analytics

### Tratando erros diretamente no resolver {#handling-errors-directly-in-the-resolver}

Aqui está uma versão atualizada do `userResolver` que registra o erro e navega de volta para a página genérica `/users`, usando o serviço `Router`:

```ts
import {inject} from '@angular/core';
import {ResolveFn, RedirectCommand, Router} from '@angular/router';
import {catchError, of, EMPTY} from 'rxjs';
import {UserStore} from './user-store';
import type {User} from './types';

export const userResolver: ResolveFn<User | RedirectCommand> = (route) => {
  const userStore = inject(UserStore);
  const router = inject(Router);
  const userId = route.paramMap.get('id')!;

  return userStore.getUser(userId).pipe(
    catchError((error) => {
      console.error('Falha ao carregar o usuário:', error);
      return of(new RedirectCommand(router.parseUrl('/users')));
    }),
  );
};
```

## Considerações sobre o carregamento na navegação {#navigation-loading-considerations}

Embora os resolvers de dados evitem estados de carregamento dentro dos componentes, eles trazem outra consideração de UX: a navegação fica bloqueada enquanto os resolvers são executados. Os usuários podem notar atrasos entre clicar em um link e ver a nova rota, especialmente com requisições de rede lentas.

TIP: Para evitar o bloqueio da navegação e renderizar os componentes imediatamente com esqueletos ou indicadores de carregamento, use [recursos de rota não bloqueantes](/guide/routing/data-fetching-with-resources#blocking-and-non-blocking-resources).

### Fornecendo feedback de navegação {#providing-navigation-feedback}

Para melhorar a experiência do usuário durante a execução do resolver, você pode escutar os eventos do router e exibir indicadores de carregamento:

```angular-ts
import {Component, computed, inject} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    @if (isNavigating()) {
      <div class="loading-bar">Carregando...</div>
    }
    <router-outlet />
  `,
})
export class App {
  private router = inject(Router);
  isNavigating = computed(() => !!this.router.currentNavigation());
}
```

Essa abordagem garante que os usuários recebam um feedback visual de que a navegação está em andamento enquanto os resolvers buscam os dados.

## Boas práticas {#best-practices}

- **Mantenha os resolvers leves**: Os resolvers devem buscar apenas os dados essenciais, e não tudo o que a página pode precisar
- **Trate os erros**: Lembre-se sempre de tratar os erros com cuidado para oferecer a melhor experiência possível aos usuários
- **Use cache**: Considere armazenar em cache os dados resolvidos para melhorar o desempenho
- **Considere a UX da navegação**: Implemente indicadores de carregamento para a execução dos resolvers, já que a navegação fica bloqueada durante a busca de dados
- **Defina timeouts razoáveis**: Evite resolvers que possam travar indefinidamente e bloquear a navegação
- **Segurança de tipos**: Use interfaces TypeScript para os dados resolvidos

## Lendo dados resolvidos do pai em resolvers filhos {#reading-parent-resolved-data-in-child-resolvers}

Os resolvers são executados do pai para o filho. Quando uma rota pai define um resolver, seus dados resolvidos ficam disponíveis para os resolvers filhos que são executados depois.

NOTE: Como os resolvers são executados sequencialmente, do pai para o filho, cada nível aninhado soma ao tempo total de espera da navegação (uma cascata de requisições). Se as suas rotas filhas não dependem dos dados do pai, considere usar [recursos de rota](/guide/routing/data-fetching-with-resources), que são executados simultaneamente em todas as rotas.

```ts
import {inject} from '@angular/core';
import {provideRouter, ActivatedRouteSnapshot} from '@angular/router';
import {userResolver} from './resolvers';
import {UserPosts} from './pages';
import {PostService} from './services';
import type {User} from './types';

provideRouter([
  {
    path: 'users/:id',
    resolve: {user: userResolver}, // resolver de usuário na rota pai
    children: [
      {
        path: 'posts',
        component: UserPosts,
        // route.data.user está disponível aqui enquanto este resolver é executado
        resolve: {
          posts: (route: ActivatedRouteSnapshot) => {
            const postService = inject(PostService);
            const user = route.parent?.data['user'] as User; // dados do pai
            const userId = user.id;
            return postService.getPostByUser(userId);
          },
        },
      },
    ],
  },
]);
```

## Próximos passos {#next-steps}

<docs-pill-row>
  <docs-pill href="/guide/routing/data-fetching-with-resources" title="Busca de dados com recursos"/>
  <docs-pill href="/guide/routing/route-guards" title="Controle o acesso às rotas com guards"/>
</docs-pill-row>
