<!-- ia-translate: true -->

# Controlar acesso a routes com guards

CRÍTICO: Nunca confie apenas em guards do lado do cliente como única fonte de controle de acesso. Todo JavaScript que roda em um navegador pode ser modificado pelo usuário que está usando o navegador. Sempre aplique autorização de usuário no lado do servidor, além de quaisquer guards do lado do cliente.

Route guards são funções que controlam se um usuário pode navegar para ou sair de uma route específica. Eles são como pontos de verificação que gerenciam se um usuário pode acessar routes específicas. Exemplos comuns de uso de route guards incluem autenticação e controle de acesso.

## Criando um route guard {#route-guard-return-types}

Você pode gerar um route guard usando o Angular CLI:

```bash
ng generate guard CUSTOM_NAME
```

Isso solicitará que você selecione qual [tipo de route guard](#types-of-route-guards) usar e então criará o arquivo `CUSTOM_NAME-guard.ts` correspondente.

DICA: Você também pode criar um route guard manualmente criando um arquivo TypeScript separado no seu projeto Angular. Desenvolvedores normalmente adicionam um sufixo de `-guard.ts` no nome do arquivo para distingui-lo de outros arquivos.

## Tipos de retorno de route guard

Todos os route guards compartilham os mesmos tipos de retorno possíveis. Isso oferece flexibilidade em como você controla a navegação:

| Return types                    | Description                                                                          |
| ------------------------------- | ------------------------------------------------------------------------------------ |
| `boolean`                       | `true` permite navegação, `false` bloqueia (veja nota para o route guard `CanMatch`) |
| `UrlTree` ou `RedirectCommand`  | Redireciona para outra route em vez de bloquear                                      |
| `Promise<T>` ou `Observable<T>` | O router usa o primeiro valor emitido e então cancela a inscrição                    |

Nota: `CanMatch` se comporta de forma diferente— quando retorna `false`, o Angular tenta outras routes correspondentes em vez de bloquear completamente a navegação.

## Tipos de route guards {#types-of-route-guards}

O Angular fornece quatro tipos de route guards, cada um servindo propósitos diferentes:

<docs-pill-row>
  <docs-pill href="#canactivate" title="CanActivate"/>
  <docs-pill href="#canactivatechild" title="CanActivateChild"/>
  <docs-pill href="#candeactivate" title="CanDeactivate"/>
  <docs-pill href="#canmatch" title="CanMatch"/>
</docs-pill-row>

### CanActivate

O guard `CanActivate` determina se um usuário pode acessar uma route. É mais comumente usado para autenticação e autorização.

Ele tem acesso aos seguintes argumentos padrão:

- `route: ActivatedRouteSnapshot` - Contém informações sobre a route sendo ativada
- `state: RouterStateSnapshot` - Contém o estado atual do router

Ele pode retornar os [tipos de retorno padrão de guard](#route-guard-return-types).

```ts
export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  return authService.isAuthenticated();
};
```

Dica: Se você precisar redirecionar o usuário, retorne uma [`URLTree`](api/router/UrlTree) ou [`RedirectCommand`](api/router/RedirectCommand). **Não** retorne `false` e então navegue o usuário programaticamente.

Para mais informações, confira a [documentação da API para CanActivateFn](api/router/CanActivateFn).

### CanActivateChild

O guard `CanActivateChild` determina se um usuário pode acessar routes filhas de uma route pai específica. Isso é útil quando você quer proteger uma seção inteira de routes aninhadas. Em outras palavras, `canActivateChild` roda para _todas_ as filhas. Se houver um component filho com outro component filho abaixo dele, `canActivateChild` rodará uma vez para ambos os components.

Ele tem acesso aos seguintes argumentos padrão:

- `childRoute: ActivatedRouteSnapshot` - Contém informações sobre o snapshot "futuro" (ou seja, estado para o qual o router está tentando navegar) da route filha sendo ativada
- `state: RouterStateSnapshot` - Contém o estado atual do router

Ele pode retornar os [tipos de retorno padrão de guard](#route-guard-return-types).

```ts
export const adminChildGuard: CanActivateChildFn = (childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  return authService.hasRole('admin');
};
```

Para mais informações, confira a [documentação da API para CanActivateChildFn](api/router/CanActivateChildFn).

### CanDeactivate

O guard `CanDeactivate` determina se um usuário pode sair de uma route. Um cenário comum é prevenir navegação para fora de formulários não salvos.

Ele tem acesso aos seguintes argumentos padrão:

- `component: T` - A instância do component sendo desativada
- `currentRoute: ActivatedRouteSnapshot` - Contém informações sobre a route atual
- `currentState: RouterStateSnapshot` - Contém o estado atual do router
- `nextState: RouterStateSnapshot` - Contém o próximo estado do router sendo navegado

Ele pode retornar os [tipos de retorno padrão de guard](#route-guard-return-types).

```ts
export const unsavedChangesGuard: CanDeactivateFn<FormComponent> = (component: FormComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState: RouterStateSnapshot) => {
  return component.hasUnsavedChanges()
    ? confirm('You have unsaved changes. Are you sure you want to leave?')
    : true;
};
```

Para mais informações, confira a [documentação da API para CanDeactivateFn](api/router/CanDeactivateFn).

### CanMatch

O guard `CanMatch` determina se uma route pode ser correspondida durante a correspondência de caminho. Diferentemente de outros guards, a rejeição passa adiante para tentar outras routes correspondentes em vez de bloquear a navegação inteiramente. Isso pode ser útil para feature flags, testes A/B ou carregamento condicional de route.

Ele tem acesso aos seguintes argumentos padrão:

- `route: Route` - A configuração de route sendo avaliada
- `segments: UrlSegment[]` - Os segmentos de URL que não foram consumidos por avaliações de route pai anteriores

Ele pode retornar os [tipos de retorno padrão de guard](#route-guard-return-types), mas quando retorna `false`, o Angular tenta outras routes correspondentes em vez de bloquear completamente a navegação.

```ts
export const featureToggleGuard: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  const featureService = inject(FeatureService);
  return featureService.isFeatureEnabled('newDashboard');
};
```

Ele também pode permitir que você use diferentes components para o mesmo caminho.

```ts
// 📄 routes.ts
const routes: Routes = [
  {
    path: 'dashboard',
    component: AdminDashboard,
    canMatch: [adminGuard]
  },
  {
    path: 'dashboard',
    component: UserDashboard,
    canMatch: [userGuard]
  }
]
```

Neste exemplo, quando o usuário visita `/dashboard`, o primeiro que corresponder ao guard correto será usado.

Para mais informações, confira a [documentação da API para CanMatchFn](api/router/CanMatchFn).

## Aplicando guards a routes

Depois de criar seus route guards, você precisa configurá-los nas suas definições de route.

Guards são especificados como arrays na configuração de route para permitir que você aplique múltiplos guards a uma única route. Eles são executados na ordem em que aparecem no array.

```ts
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { canDeactivateGuard } from './guards/can-deactivate.guard';
import { featureToggleGuard } from './guards/feature-toggle.guard';

const routes: Routes = [
  // Basic CanActivate - requires authentication
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },

  // Multiple CanActivate guards - requires authentication AND admin role
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard, adminGuard]
  },

  // CanActivate + CanDeactivate - protected route with unsaved changes check
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
    canDeactivate: [canDeactivateGuard]
  },

  // CanActivateChild - protects all child routes
  {
    path: 'users', // /user - NOT protected
    canActivateChild: [authGuard],
    children: [
      // /users/list - PROTECTED
      { path: 'list', component: UserListComponent },
      // /users/detail/:id - PROTECTED
      { path: 'detail/:id', component: UserDetailComponent }
    ]
  },

  // CanMatch - conditionally matches route based on feature flag
  {
    path: 'beta-feature',
    component: BetaFeatureComponent,
    canMatch: [featureToggleGuard]
  },

  // Fallback route if beta feature is disabled
  {
    path: 'beta-feature',
    component: ComingSoonComponent
  }
];
```
