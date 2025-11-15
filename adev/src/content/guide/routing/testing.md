<!-- ia-translate: true -->
# Testando routing e navegação

Testar routing e navegação é essencial para garantir que sua aplicação se comporte corretamente quando os usuários navegam entre diferentes routes. Este guia cobre várias estratégias para testar funcionalidade de routing em aplicações Angular.

## Pré-requisitos

Este guia assume que você está familiarizado com as seguintes ferramentas e bibliotecas:

- **[Jasmine](https://jasmine.github.io/)** - Framework de testes JavaScript que fornece a sintaxe de teste (`describe`, `it`, `expect`)
- **[Karma](https://karma-runner.github.io/)** - Test runner que executa testes em navegadores
- **[Angular Testing Utilities](guide/testing)** - Ferramentas de teste integradas do Angular ([`TestBed`](api/core/testing/TestBed), [`ComponentFixture`](api/core/testing/ComponentFixture))
- **[`RouterTestingHarness`](api/router/testing/RouterTestingHarness)** - Test harness para testar components roteados com capacidades integradas de navegação e teste de component

## Cenários de teste

### Parâmetros de route

Components frequentemente dependem de parâmetros de route da URL para buscar dados, como um ID de usuário para uma página de perfil.

O exemplo a seguir mostra como testar um component `UserProfile` que exibe um ID de usuário da route.

```ts
// user-profile.component.spec.ts
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideRouter } from '@angular/router';
import { UserProfile } from './user-profile';

describe('UserProfile', () => {
  it('should display user ID from route parameters', async () => {
    TestBed.configureTestingModule({
      imports: [UserProfile],
      providers: [
        provideRouter([
          { path: 'user/:id', component: UserProfile }
        ])
      ]
    });

    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/user/123', UserProfile);

    expect(harness.routeNativeElement?.textContent).toContain('User Profile: 123');
  });
});
```

```angular-ts
// user-profile.component.ts
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  template: '<h1>User Profile: {{userId}}</h1>'
})
export class UserProfile {
  private route = inject(ActivatedRoute);
  userId: string | null = this.route.snapshot.paramMap.get('id');
}
```

### Route guards

Route guards controlam o acesso a routes com base em condições como autenticação ou permissões. Ao testar guards, concentre-se em simular dependências e verificar resultados de navegação.

O exemplo a seguir testa um `authGuard` que permite navegação para usuários autenticados e redireciona usuários não autenticados para uma página de login.

```ts
// auth.guard.spec.ts
import { RouterTestingHarness } from '@angular/router/testing';
import { provideRouter, Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthStore } from './auth-store';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

@Component({ template: '<h1>Protected Page</h1>' })
class ProtectedComponent {}

@Component({ template: '<h1>Login Page</h1>' })
class LoginComponent {}

describe('authGuard', () => {
  let authStore: jasmine.SpyObj<AuthStore>;
  let harness: RouterTestingHarness;

  async function setup(isAuthenticated: boolean) {
    authStore = jasmine.createSpyObj('AuthStore', ['isAuthenticated']);
    authStore.isAuthenticated.and.returnValue(isAuthenticated);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthStore, useValue: authStore },
        provideRouter([
          { path: 'protected', component: ProtectedComponent, canActivate: [authGuard] },
          { path: 'login', component: LoginComponent },
        ]),
      ],
    });

    harness = await RouterTestingHarness.create();
  }

  it('allows navigation when user is authenticated', async () => {
    await setup(true);
    await harness.navigateByUrl('/protected', ProtectedComponent);
    // The protected component should render when authenticated
    expect(harness.routeNativeElement?.textContent).toContain('Protected Page');
  });

  it('redirects to login when user is not authenticated', async () => {
    await setup(false);
    await harness.navigateByUrl('/protected', LoginComponent);
    // The login component should render after redirect
    expect(harness.routeNativeElement?.textContent).toContain('Login Page');
  });
});
```

```ts
// auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from './auth-store';

export const authGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  return authStore.isAuthenticated() ? true : router.parseUrl('/login');
};
```

### Router outlets

Testes de router outlet são mais de um teste de integração, já que você está essencialmente testando a integração entre o [`Router`](api/router/Router), o outlet e os components sendo exibidos.

Aqui está um exemplo de como configurar um teste que verifica se diferentes components são exibidos para diferentes routes:

```ts
// app.component.spec.ts
import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideRouter } from '@angular/router';
import { Component } from '@angular/core';
import { App } from './app';

@Component({
  template: '<h1>Home Page</h1>'
})
class MockHome {}

@Component({
  template: '<h1>About Page</h1>'
})
class MockAbout {}

describe('App Router Outlet', () => {
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([
          { path: '', component: MockHome },
          { path: 'about', component: MockAbout }
        ])
      ]
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

```angular-ts
// app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav>
      <a routerLink="/">Home</a>
      <a routerLink="/about">About</a>
    </nav>
    <router-outlet />
  `
})
export class App {}
```

### Routes aninhadas

Testar routes aninhadas garante que tanto os components pai quanto filho renderizem corretamente ao navegar para URLs aninhadas. Isso é importante porque routes aninhadas envolvem múltiplas camadas.

Você precisa verificar que:

1. O component pai renderiza adequadamente.
2. O component filho renderiza dentro dele.
3. Garantir que ambos os components possam acessar seus respectivos dados de route.

Aqui está um exemplo de teste de uma estrutura de route pai-filho:

```ts
// nested-routes.spec.ts
import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideRouter } from '@angular/router';
import { Parent, Child } from './nested-components';

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
            children: [
              { path: 'child', component: Child }
            ]
          }
        ])
      ]
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

```angular-ts
// nested-components.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterOutlet],
  template: `
    <h1>Parent Component</h1>
    <router-outlet />
  `
})
export class Parent {}

@Component({
  template: '<h2>Child Component</h2>'
})
export class Child {}
```

### Query parameters e fragments

Query parameters (como `?search=angular&category=web`) e fragmentos de URL (como `#section1`) fornecem dados adicionais através da URL que não afetam qual component carrega, mas afetam como o component se comporta. Components que leem query parameters através de [`ActivatedRoute.queryParams`](api/router/ActivatedRoute#queryParams) precisam ser testados para garantir que lidem corretamente com diferentes cenários de parâmetros.

Diferentemente dos parâmetros de route que fazem parte da definição de route, query parameters são opcionais e podem mudar sem disparar navegação de route. Isso significa que você precisa testar tanto o carregamento inicial quanto as atualizações reativas quando os query parameters mudam.

Aqui está um exemplo de como testar query parameters e fragments:

```ts
// search.component.spec.ts
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Search } from './search';

describe('Search', () => {
  let component: Search;
  let harness: RouterTestingHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [Search],
      providers: [
        provideRouter([
          { path: 'search', component: Search }
        ])
      ]
    });

    harness = await RouterTestingHarness.create();
  });

  it('should read search term from query parameters', async () => {
    component = await harness.navigateByUrl('/search?q=angular', Search);

    expect(component.searchTerm()).toBe('angular');
  });
});
```

```angular-ts
// search.component.ts
import { Component, inject, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  template: '<div>Search term: {{searchTerm()}}</div>'
})
export class Search {
  private route = inject(ActivatedRoute);
  private queryParams = toSignal(this.route.queryParams, { initialValue: {} });

  searchTerm = computed(() => this.queryParams()['q'] || null);
}
```

## Melhores práticas para testes de router

1. **Use RouterTestingHarness** - Para testar components roteados, use [`RouterTestingHarness`](api/router/testing/RouterTestingHarness) que fornece uma API mais limpa e elimina a necessidade de components host de teste. Ele oferece acesso direto ao component, navegação integrada e melhor segurança de tipo. No entanto, não é tão adequado para alguns cenários, como testar outlets nomeados, onde você pode precisar criar components host personalizados.
2. **Lide com dependências externas cuidadosamente** - Prefira implementações reais quando possível para testes mais realistas. Se implementações reais não forem viáveis (por exemplo, APIs externas), use fakes que aproximem o comportamento real. Use mocks ou stubs apenas como último recurso, pois eles podem tornar os testes frágeis e menos confiáveis.
3. **Teste o estado de navegação** - Verifique tanto a ação de navegação quanto o estado resultante da aplicação, incluindo mudanças de URL e renderização de component.
4. **Lide com operações assíncronas** - A navegação do router é assíncrona. Use `async/await` ou [`fakeAsync`](api/core/testing/fakeAsync) para lidar adequadamente com o timing nos seus testes.
5. **Teste cenários de erro** - Inclua testes para routes inválidas, navegação falha e rejeições de guard para garantir que sua aplicação lide com casos extremos graciosamente.
6. **Não simule o Angular Router** - Em vez disso, forneça configurações de route reais e use o harness para navegar. Isso torna seus testes mais robustos e menos propensos a quebrar em atualizações internas do Angular, ao mesmo tempo em que garante que você capture problemas reais quando o router atualizar, já que mocks podem ocultar mudanças que quebram compatibilidade.
