<!-- ia-translate: true -->
# Resolvers de dados

Resolvers de dados permitem que você busque dados antes de navegar para uma route, garantindo que seus components recebam os dados que precisam antes da renderização. Isso pode ajudar a prevenir a necessidade de estados de carregamento e melhorar a experiência do usuário ao pré-carregar dados essenciais.

## O que são resolvers de dados?

Um resolver de dados é um service que implementa a função `ResolveFn`. Ele é executado antes que uma route seja ativada e pode buscar dados de APIs, bancos de dados ou outras fontes. Os dados resolvidos ficam disponíveis para o component através do `ActivatedRoute`.

## Por que usar resolvers de dados?

Resolvers de dados resolvem desafios comuns de roteamento:

- **Prevenir estados vazios**: Components recebem dados imediatamente ao carregar
- **Melhor experiência do usuário**: Sem spinners de carregamento para dados críticos
- **Tratamento de erros**: Lidar com erros de busca de dados antes da navegação
- **Consistência de dados**: Garantir que os dados necessários estejam disponíveis antes da renderização, o que é importante para SSR

## Criando um resolver

Você cria um resolver escrevendo uma função com o tipo `ResolveFn`.

Ele recebe o `ActivatedRouteSnapshot` e `RouterStateSnapshot` como parâmetros.

Aqui está um resolver que obtém as informações do usuário antes de renderizar uma route usando a função [`inject`](api/core/inject):

```ts
import { inject } from '@angular/core';
import { UserStore, SettingsStore } from './user-store';
import type { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import type { User, Settings } from './types';

export const userResolver: ResolveFn<User> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const userStore = inject(UserStore);
  const userId = route.paramMap.get('id')!;
  return userStore.getUser(userId);
};

export const settingsResolver: ResolveFn<Settings> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const settingsStore = inject(SettingsStore);
  const userId = route.paramMap.get('id')!;
  return settingsStore.getUserSettings(userId);
};
```

## Configurando routes com resolvers

Quando você deseja adicionar um ou mais resolvers de dados a uma route, você pode adicioná-lo sob a chave `resolve` na configuração da route. O tipo `Routes` define a estrutura para configurações de route:

```ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'user/:id',
    component: UserDetail,
    resolve: {
      user: userResolver,
      settings: settingsResolver
    }
  }
];
```

Você pode aprender mais sobre a [configuração `resolve` na documentação da API](api/router/Route#resolve).

## Acessando dados resolvidos em components

### Usando ActivatedRoute

Você pode acessar os dados resolvidos em um component acessando o snapshot data do `ActivatedRoute` usando a função `signal`:

```angular-ts
import { Component, inject, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import type { User, Settings } from './types';

@Component({
  template: `
    <h1>{{ user().name }}</h1>
    <p>{{ user().email }}</p>
    <div>Theme: {{ settings().theme }}</div>
  `
})
export class UserDetail {
  private route = inject(ActivatedRoute);
  private data = toSignal(this.route.data);
  user = computed(() => this.data().user as User);
  settings = computed(() => this.data().settings as Settings);
}
```

### Usando withComponentInputBinding

Uma abordagem diferente para acessar os dados resolvidos é usar `withComponentInputBinding()` ao configurar seu router com `provideRouter`. Isso permite que dados resolvidos sejam passados diretamente como inputs do component:

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes, withComponentInputBinding())
  ]
});
```

Com esta configuração, você pode definir inputs no seu component que correspondem às chaves do resolver usando a função `input` e `input.required` para inputs obrigatórios:

```angular-ts
import { Component, input } from '@angular/core';
import type { User, Settings } from './types';

@Component({
  template: `
    <h1>{{ user().name }}</h1>
    <p>{{ user().email }}</p>
    <div>Theme: {{ settings().theme }}</div>
  `
})
export class UserDetail {
  user = input.required<User>();
  settings = input.required<Settings>();
}
```

Esta abordagem fornece melhor segurança de tipos e elimina a necessidade de injetar `ActivatedRoute` apenas para acessar dados resolvidos.

## Tratamento de erros em resolvers

No caso de falhas de navegação, é importante tratar erros graciosamente em seus resolvers de dados. Caso contrário, um `NavigationError` ocorrerá e a navegação para a route atual falhará, o que levará a uma experiência ruim para seus usuários.

Existem três maneiras principais de lidar com erros com resolvers de dados:

1. Centralizar o tratamento de erros em `withNavigationErrorHandler`
2. Gerenciar erros através de uma subscription para eventos do router
3. Lidar com erros diretamente no resolver

### Centralizar o tratamento de erros em `withNavigationErrorHandler`

O recurso [`withNavigationErrorHandler`](api/router/withNavigationErrorHandler) fornece uma maneira centralizada de lidar com todos os erros de navegação, incluindo aqueles de resolvers de dados que falharam. Esta abordagem mantém a lógica de tratamento de erros em um só lugar e previne código duplicado de tratamento de erros entre resolvers.

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withNavigationErrorHandler } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from './app.routes';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes, withNavigationErrorHandler((error) => {
      const router = inject(Router);

      if (error?.message) {
        console.error('Navigation error occurred:', error.message)
      }

      router.navigate(['/error']);
    }))
  ]
});
```

Com esta configuração, seus resolvers podem focar na busca de dados enquanto deixam o handler centralizado gerenciar cenários de erro:

```ts
export const userResolver: ResolveFn<User> = (route) => {
  const userStore = inject(UserStore);
  const userId = route.paramMap.get('id')!;
  // Não é necessário tratamento explícito de erro - deixe borbulhar
  return userStore.getUser(userId);
};
```

### Gerenciando erros através de uma subscription para eventos do router

Você também pode lidar com erros de resolver fazendo subscription em eventos do router e ouvindo eventos `NavigationError`. Esta abordagem dá a você mais controle granular sobre o tratamento de erros e permite que você implemente lógica customizada de recuperação de erros.

```angular-ts
import { Component, inject, signal } from '@angular/core';
import { Router, NavigationError } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
    @if (errorMessage()) {
      <div class="error-banner">
        {{ errorMessage() }}
        <button (click)="retryNavigation()">Retry</button>
      </div>
    }
    <router-outlet />
  `
})
export class App {
  private router = inject(Router);
  private lastFailedUrl = signal('');

  private navigationErrors = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationError => event instanceof NavigationError),
      map(event => {
        this.lastFailedUrl.set(event.url);

        if (event.error) {
          console.error('Navigation error', event.error)
        }

        return 'Navigation failed. Please try again.';
      })
    ),
    { initialValue: '' }
  );

  errorMessage = this.navigationErrors;

  retryNavigation() {
    if (this.lastFailedUrl()) {
      this.router.navigateByUrl(this.lastFailedUrl());
    }
  }
}
```

Esta abordagem é particularmente útil quando você precisa:

- Implementar lógica de retry customizada para navegação falhada
- Mostrar mensagens de erro específicas baseadas no tipo de falha
- Rastrear falhas de navegação para propósitos de analytics

### Lidando com erros diretamente no resolver

Aqui está um exemplo atualizado do `userResolver` que registra o erro e navega de volta para a página genérica `/users` usando o service `Router`:

```ts
import { inject } from '@angular/core';
import { ResolveFn, RedirectCommand, Router } from '@angular/router';
import { catchError, of, EMPTY } from 'rxjs';
import { UserStore } from './user-store';
import type { User } from './types';

export const userResolver: ResolveFn<User | RedirectCommand> = (route) => {
  const userStore = inject(UserStore);
  const router = inject(Router);
  const userId = route.paramMap.get('id')!;

  return userStore.getUser(userId).pipe(
    catchError(error => {
      console.error('Failed to load user:', error);
      return of(new RedirectCommand(router.parseUrl('/users')));
    })
  );
};
```

## Considerações sobre carregamento de navegação

Embora os resolvers de dados previnam estados de carregamento dentro de components, eles introduzem uma consideração de UX diferente: a navegação é bloqueada enquanto os resolvers são executados. Os usuários podem experimentar atrasos entre clicar em um link e ver a nova route, especialmente com requisições de rede lentas.

### Fornecendo feedback de navegação

Para melhorar a experiência do usuário durante a execução do resolver, você pode ouvir eventos do router e mostrar indicadores de carregamento:

```angular-ts
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
    @if (isNavigating()) {
      <div class="loading-bar">Loading...</div>
    }
    <router-outlet />
  `
})
export class App {
  private router = inject(Router);
  isNavigating = computed(() => !!this.router.currentNavigation());
}
```

Esta abordagem garante que os usuários recebam feedback visual de que a navegação está em progresso enquanto os resolvers buscam dados.

## Boas práticas

- **Mantenha resolvers leves**: Resolvers devem buscar apenas dados essenciais e não tudo que a página poderia possivelmente precisar
- **Trate erros**: Sempre lembre-se de tratar erros graciosamente para fornecer a melhor experiência possível aos usuários
- **Use cache**: Considere fazer cache de dados resolvidos para melhorar a performance
- **Considere a UX de navegação**: Implemente indicadores de carregamento para a execução do resolver, já que a navegação é bloqueada durante a busca de dados
- **Defina timeouts razoáveis**: Evite resolvers que possam travar indefinidamente e bloquear a navegação
- **Segurança de tipos**: Use interfaces TypeScript para dados resolvidos

## Lendo dados resolvidos do pai em resolvers filhos

Resolvers executam do pai para o filho. Quando uma route pai define um resolver, seus dados resolvidos estão disponíveis para resolvers filhos que executam depois.

```ts
import { inject } from '@angular/core';
import { provideRouter , ActivatedRouteSnapshot } from '@angular/router';
import { userResolver } from './resolvers';
import { UserPosts } from './pages';
import { PostService } from './services',
import type { User } from './types';

provideRouter([
  {
    path: 'users/:id',
    resolve: { user: userResolver }, // resolver de usuário na route pai
    children: [
      {
        path: 'posts',
        component: UserPosts,
        // route.data.user está disponível aqui enquanto este resolver executa
        resolve: {
          posts: (route: ActivatedRouteSnapshot) => {
            const postService = inject(PostService);
            const user = route.data['user'] as User; // dados do pai
            const userId = user.id;
            return postService.getPostByUser(userId);
          },
        },
      },
    ],
  },
]);
```
