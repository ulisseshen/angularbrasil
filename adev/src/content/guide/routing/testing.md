<!-- ia-translate: true -->
# Testando routing e navegação

Testar routing e navegação é essencial para garantir que sua aplicação se comporte corretamente quando os usuários navegam entre diferentes routes. Este guia cobre diversas estratégias para testar a funcionalidade de routing em aplicações Angular.

## Pré-requisitos {#prerequisites}

Este guia pressupõe que você está familiarizado com as seguintes ferramentas e bibliotecas:

- **[Vitest](https://vitest.dev/)** - Framework de testes JavaScript que fornece a sintaxe de teste (`describe`, `it`, `expect`)
- **[Angular Testing Utilities](guide/testing)** - Ferramentas de teste integradas do Angular ([`TestBed`](api/core/testing/TestBed), [`ComponentFixture`](api/core/testing/ComponentFixture))
- **[`RouterTestingHarness`](api/router/testing/RouterTestingHarness)** - Test harness para testar components roteados, com capacidades integradas de navegação e teste de component

## Cenários de teste {#testing-scenarios}

### Parâmetros de route {#route-parameters}

Components frequentemente dependem de parâmetros de route da URL para buscar dados, como o ID de um usuário em uma página de perfil.

O exemplo a seguir mostra como testar um component `UserProfile` que exibe um ID de usuário vindo da route.

```ts { header: 'user-profile.spec.ts'}
import {TestBed} from '@angular/core/testing';
import {provideRouter, Router} from '@angular/router';
import {RouterTestingHarness} from '@angular/router/testing';
import {UserProfile} from './user-profile';

describe('UserProfile', () => {
  it('should display user ID from route parameters', async () => {
    TestBed.configureTestingModule({
      imports: [UserProfile],
      providers: [provideRouter([{path: 'user/:id', component: UserProfile}])],
    });

    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/user/123', UserProfile);

    expect(harness.routeNativeElement?.textContent).toContain('User Profile: 123');
  });
});
```

```angular-ts {header: 'user-profile.ts'}
import {Component, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  template: '<h1>User Profile: {{userId}}</h1>',
})
export class UserProfile {
  private route = inject(ActivatedRoute);
  userId: string | null = this.route.snapshot.paramMap.get('id');
}
```

### Guards de route {#route-guards}

Route guards controlam o acesso às routes com base em condições como autenticação ou permissões. Ao testar guards, concentre-se em simular dependências e verificar os resultados da navegação.

O exemplo a seguir testa um `authGuard` que permite a navegação para usuários autenticados e redireciona usuários não autenticados para uma página de login.

```ts {header: 'auth.guard.spec.ts'}
import {describe, expect, it, vi, type Mocked} from 'vitest';
import {RouterTestingHarness} from '@angular/router/testing';
import {provideRouter, Router} from '@angular/router';
import {authGuard} from './auth.guard';
import {AuthStore} from './auth-store';
import {Component} from '@angular/core';
import {TestBed} from '@angular/core/testing';

@Component({template: '<h1>Protected Page</h1>'})
class Protected {}

@Component({template: '<h1>Login Page</h1>'})
class Login {}

describe('authGuard', () => {
  let authStore: Mocked<AuthStore>;
  let harness: RouterTestingHarness;

  async function setup(isAuthenticated: boolean) {
    authStore = {isAuthenticated: vi.fn().mockReturnValue(isAuthenticated)} as Mocked<AuthStore>;

    TestBed.configureTestingModule({
      providers: [
        {provide: AuthStore, useValue: authStore},
        provideRouter([
          {path: 'protected', component: Protected, canActivate: [authGuard]},
          {path: 'login', component: Login},
        ]),
      ],
    });

    harness = await RouterTestingHarness.create();
  }

  it('allows navigation when user is authenticated', async () => {
    await setup(true);
    await harness.navigateByUrl('/protected', Protected);
    // O component protegido deve ser renderizado quando o usuário está autenticado
    expect(harness.routeNativeElement?.textContent).toContain('Protected Page');
  });

  it('redirects to login when user is not authenticated', async () => {
    await setup(false);
    await harness.navigateByUrl('/protected', Login);
    // O component de login deve ser renderizado após o redirecionamento
    expect(harness.routeNativeElement?.textContent).toContain('Login Page');
  });
});
```

```ts {header: 'auth.guard.ts'}
import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {AuthStore} from './auth-store';

export const authGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  return authStore.isAuthenticated() ? true : router.parseUrl('/login');
};
```

### Outlets do router {#router-outlets}

Testes de router outlet são mais próximos de um teste de integração, pois você está essencialmente testando a integração entre o [`Router`](api/router/Router), o outlet e os components exibidos.

Veja a seguir um exemplo de como configurar um teste que verifica se components diferentes são exibidos para routes diferentes:

```ts {header: 'app.spec.ts'}
import {TestBed} from '@angular/core/testing';
import {RouterTestingHarness} from '@angular/router/testing';
import {provideRouter} from '@angular/router';
import {Component} from '@angular/core';
import {App} from './app';

@Component({
  template: '<h1>Home Page</h1>',
})
class MockHome {}

@Component({
  template: '<h1>About Page</h1>',
})
class MockAbout {}

describe('App Router Outlet', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([
          {path: '', component: MockHome},
          {path: 'about', component: MockAbout},
        ]),
      ],
    });

    harness = await RouterTestingHarness.create();
  });

  it('should display home component for default route', async () => {
    await harness.navigateByUrl('');

    expect(harness.routeNativeElement?.textContent).toContain('Home Page');
  });

  it('should display about component for about route', async () => {
    await harness.navigateByUrl('/about');

    expect(harness.routeNativeElement?.textContent).toContain('About Page');
  });
});
```

```angular-ts {header: 'app.ts'}
import {Component} from '@angular/core';
import {RouterOutlet, RouterLink} from '@angular/router';

@Component({
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav>
      <a routerLink="/">Home</a>
      <a routerLink="/about">About</a>
    </nav>
    <router-outlet />
  `,
})
export class App {}
```

### Rotas aninhadas {#nested-routes}

Testar routes aninhadas garante que tanto o component pai quanto o filho sejam renderizados corretamente ao navegar para URLs aninhadas. Isso é importante porque routes aninhadas envolvem múltiplas camadas.

Você precisa verificar que:

1. O component pai é renderizado corretamente.
2. O component filho é renderizado dentro dele.
3. Ambos os components conseguem acessar seus respectivos dados de route.

Veja a seguir um exemplo de teste de uma estrutura de routes pai-filho:

```ts {header: 'nested-routes.spec.ts'}
import {TestBed} from '@angular/core/testing';
import {RouterTestingHarness} from '@angular/router/testing';
import {provideRouter} from '@angular/router';
import {Parent, Child} from './nested-components';

describe('Nested Routes', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [Parent, Child],
      providers: [
        provideRouter([
          {
            path: 'parent',
            component: Parent,
            children: [{path: 'child', component: Child}],
          },
        ]),
      ],
    });

    harness = await RouterTestingHarness.create();
  });

  it('should render parent and child components for nested route', async () => {
    await harness.navigateByUrl('/parent/child');

    expect(harness.routeNativeElement?.textContent).toContain('Parent Component');
    expect(harness.routeNativeElement?.textContent).toContain('Child Component');
  });
});
```

```angular-ts {header: 'nested.ts'}
import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  imports: [RouterOutlet],
  template: `
    <h1>Parent Component</h1>
    <router-outlet />
  `,
})
export class Parent {}

@Component({
  template: '<h2>Child Component</h2>',
})
export class Child {}
```

### Query parameters e fragments {#query-parameters-and-fragments}

Query parameters (como `?search=angular&category=web`) e fragmentos de URL (como `#section1`) fornecem dados adicionais pela URL que não afetam qual component é carregado, mas afetam como o component se comporta. Components que leem query parameters por meio de [`ActivatedRoute.queryParams`](api/router/ActivatedRoute#queryParams) precisam ser testados para garantir que lidem corretamente com diferentes cenários de parâmetros.

Diferentemente dos parâmetros de route, que fazem parte da definição da route, os query parameters são opcionais e podem mudar sem disparar uma navegação de route. Isso significa que você precisa testar tanto o carregamento inicial quanto as atualizações reativas quando os query parameters mudam.

Veja a seguir um exemplo de como testar query parameters e fragments:

```ts {header: 'search.spec.ts'}
import {TestBed} from '@angular/core/testing';
import {Router, provideRouter} from '@angular/router';
import {RouterTestingHarness} from '@angular/router/testing';
import {Search} from './search';

describe('Search', () => {
  let component: Search;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [Search],
      providers: [provideRouter([{path: 'search', component: Search}])],
    });

    harness = await RouterTestingHarness.create();
  });

  it('should read search term from query parameters', async () => {
    component = await harness.navigateByUrl('/search?q=angular', Search);

    expect(component.searchTerm()).toBe('angular');
  });

  it('should read search term and fragment passed as navigation extras', async () => {
    component = await harness.navigate(
      ['/search'],
      {queryParams: {q: 'angular'}, fragment: 'results'},
      Search,
    );

    expect(component.searchTerm()).toBe('angular');
    expect(component.fragment()).toBe('results');
    expect(TestBed.inject(Router).url).toBe('/search?q=angular#results');
  });
});
```

```angular-ts {header: 'search.ts'}
import {Component, inject, computed} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  template: `
    <div>Search term: {{ searchTerm() }}</div>
    <div>Fragment: {{ fragment() }}</div>
  `,
})
export class Search {
  private route = inject(ActivatedRoute);
  private queryParams = toSignal(this.route.queryParams, {initialValue: {}});

  searchTerm = computed(() => this.queryParams()['q'] || null);
  fragment = toSignal(this.route.fragment, {initialValue: null});
}
```

## Melhores práticas para testes de router {#best-practices-for-router-testing}

1. **Use RouterTestingHarness** - Para testar components roteados, use o [`RouterTestingHarness`](api/router/testing/RouterTestingHarness), que oferece uma API mais limpa e elimina a necessidade de components host de teste. Ele oferece acesso direto ao component, navegação integrada e melhor segurança de tipos. No entanto, ele não é tão adequado para alguns cenários, como testar outlets nomeados, em que você pode precisar criar components host personalizados.
2. **Lide com dependências externas com cuidado** - Prefira implementações reais sempre que possível, para testes mais realistas. Se implementações reais não forem viáveis (por exemplo, APIs externas), use fakes que aproximem o comportamento real. Use mocks ou stubs apenas como último recurso, pois eles podem tornar os testes frágeis e menos confiáveis.
3. **Teste o estado da navegação** - Verifique tanto a ação de navegação quanto o estado resultante da aplicação, incluindo mudanças de URL e renderização de components.
4. **Lide com operações assíncronas** - A navegação do router é assíncrona. Use `async/await` para tratar corretamente o timing nos seus testes.
5. **Teste cenários de erro** - Inclua testes para routes inválidas, navegações que falham e rejeições de guards, para garantir que sua aplicação trate casos extremos com elegância.
6. **Não faça mock do Angular Router** - Em vez disso, forneça configurações reais de route e use o harness para navegar. Isso torna seus testes mais robustos e menos propensos a quebrar com atualizações internas do Angular, além de garantir que você identifique problemas reais quando o router for atualizado, já que mocks podem esconder mudanças que quebram compatibilidade.
