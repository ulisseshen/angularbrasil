<!-- ia-translate: true -->

# Controlar o acesso a routes com guards {#control-route-access-with-guards}

CRITICAL: Nunca confie apenas em guards do lado do cliente como única fonte de controle de acesso. Todo JavaScript executado em um navegador web pode ser modificado pelo usuário que está usando o navegador. Sempre aplique a autorização do usuário no servidor, além de quaisquer guards do lado do cliente.

Route guards são funções que controlam se um usuário pode navegar para uma route específica ou sair dela. Eles funcionam como pontos de verificação que gerenciam se um usuário pode acessar determinadas routes. Exemplos comuns de uso de route guards incluem autenticação e controle de acesso.

## Criando um route guard {#creating-a-route-guard}

Você pode gerar um route guard usando o Angular CLI:

```bash
ng generate guard CUSTOM_NAME
```

Isso solicitará que você escolha qual [tipo de route guard](#types-of-route-guards) usar e, em seguida, criará o arquivo `CUSTOM_NAME-guard.ts` correspondente.

TIP: Você também pode criar um route guard manualmente, criando um arquivo TypeScript separado no seu projeto Angular. Os desenvolvedores normalmente adicionam o sufixo `-guard.ts` ao nome do arquivo para diferenciá-lo de outros arquivos.

## Tipos de retorno de route guards {#route-guard-return-types}

Todos os route guards compartilham os mesmos tipos de retorno possíveis. Isso oferece flexibilidade para controlar a navegação:

| Tipos de retorno                | Descrição                                                                                                  |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `boolean`                       | `true` permite a navegação, `false` a bloqueia (veja a nota sobre o route guard `CanMatch`)               |
| `UrlTree` ou `RedirectCommand`  | Redireciona para outra route em vez de bloquear                                                            |
| `Promise<T>` ou `Observable<T>` | O router usa o primeiro valor emitido e, em seguida, cancela a subscription                                |

NOTE: `CanMatch` se comporta de forma diferente: quando retorna `false`, o Angular tenta outras routes correspondentes em vez de bloquear completamente a navegação.

## Tipos de route guards {#types-of-route-guards}

O Angular oferece quatro tipos de route guards, cada um com finalidades diferentes:

<docs-pill-row>
  <docs-pill href="#canactivate" title="CanActivate"/>
  <docs-pill href="#canactivatechild" title="CanActivateChild"/>
  <docs-pill href="#candeactivate" title="CanDeactivate"/>
  <docs-pill href="#canmatch" title="CanMatch"/>
</docs-pill-row>

Todos os guards têm acesso aos [services fornecidos no nível da route](guide/di/defining-dependency-providers#route-providers), bem como às informações específicas da route, por meio do argumento `route`.

### CanActivate {#canactivate}

O guard `CanActivate` determina se um usuário pode acessar uma route. Ele é mais comumente usado para autenticação e autorização.

Ele tem acesso aos seguintes argumentos padrão:

- `route`: `ActivatedRouteSnapshot`: contém informações sobre a route que está sendo ativada
- `state`: `RouterStateSnapshot`: contém o estado atual do router

Ele pode retornar os [tipos de retorno padrão dos guards](#route-guard-return-types).

```ts
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const authService = inject(AuthService);
  return authService.isAuthenticated();
};
```

TIP: Se você precisar redirecionar o usuário, retorne uma [`URLTree`](api/router/UrlTree) ou um [`RedirectCommand`](api/router/RedirectCommand). **Não** retorne `false` e depois navegue programaticamente o usuário.

Para mais informações, confira a [documentação da API de CanActivateFn](api/router/CanActivateFn).

### CanActivateChild {#canactivatechild}

O guard `CanActivateChild` determina se um usuário pode acessar as routes filhas de uma route pai específica. Isso é útil quando você quer proteger uma seção inteira de routes aninhadas. Em outras palavras, `canActivateChild` é executado para _todas_ as routes filhas. Se houver um component filho com outro component filho abaixo dele, `canActivateChild` será executado uma vez para cada um deles.

Ele tem acesso aos seguintes argumentos padrão:

- `childRoute`: `ActivatedRouteSnapshot`: contém informações sobre o snapshot "futuro" (ou seja, o estado para o qual o router está tentando navegar) da route filha que está sendo ativada
- `state`: `RouterStateSnapshot`: contém o estado atual do router

Ele pode retornar os [tipos de retorno padrão dos guards](#route-guard-return-types).

```ts
export const adminChildGuard: CanActivateChildFn = (
  childRoute: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const authService = inject(AuthService);
  return authService.hasRole('admin');
};
```

Para mais informações, confira a [documentação da API de CanActivateChildFn](api/router/CanActivateChildFn).

### CanDeactivate {#candeactivate}

O guard `CanDeactivate` determina se um usuário pode sair de uma route. Um cenário comum é impedir a navegação para fora de formulários não salvos.

Ele tem acesso aos seguintes argumentos padrão:

- `component`: `T`: a instância do component que está sendo desativado
- `currentRoute`: `ActivatedRouteSnapshot`: contém informações sobre a route atual
- `currentState`: `RouterStateSnapshot`: contém o estado atual do router
- `nextState`: `RouterStateSnapshot`: contém o próximo estado do router para o qual a navegação está sendo feita

Ele pode retornar os [tipos de retorno padrão dos guards](#route-guard-return-types).

```ts
export const unsavedChangesGuard: CanDeactivateFn<Form> = (
  component: Form,
  currentRoute: ActivatedRouteSnapshot,
  currentState: RouterStateSnapshot,
  nextState: RouterStateSnapshot,
) => {
  return component.hasUnsavedChanges()
    ? confirm('You have unsaved changes. Are you sure you want to leave?')
    : true;
};
```

Para mais informações, confira a [documentação da API de CanDeactivateFn](api/router/CanDeactivateFn).

### CanMatch {#canmatch}

O guard `CanMatch` determina se uma route pode ser correspondida durante a correspondência de caminhos. Diferentemente de outros guards, a rejeição passa para as demais routes correspondentes, em vez de bloquear a navegação por completo. Isso pode ser útil para feature flags, testes A/B ou carregamento condicional de routes.

Ele tem acesso aos seguintes argumentos padrão:

- `route`: `Route`: a configuração da route que está sendo avaliada
- `segments`: `UrlSegment[]`: os segmentos da URL que não foram consumidos pelas avaliações das routes pai anteriores
- `currentSnapshot: PartialMatchRouteSnapshot`: o snapshot atual da route até este ponto do processo de correspondência

Ele pode retornar os [tipos de retorno padrão dos guards](#route-guard-return-types), mas, quando retorna `false`, o Angular tenta outras routes correspondentes em vez de bloquear completamente a navegação.

```ts
export const featureToggleGuard: CanMatchFn = (
  route: Route,
  segments: UrlSegment[],
  currentSnapshot: PartialMatchRouteSnapshot,
) => {
  const featureService = inject(FeatureService);
  return featureService.isFeatureEnabled('newDashboard');
};
```

Ele também pode permitir que você use components diferentes para o mesmo caminho.

```ts {header: "routes.ts"}
const routes: Routes = [
  {
    path: 'dashboard',
    component: AdminDashboard,
    canMatch: [adminGuard],
  },
  {
    path: 'dashboard',
    component: UserDashboard,
    canMatch: [userGuard],
  },
];
```

Neste exemplo, quando o usuário visita `/dashboard`, é usada a primeira route cujo guard correspondente for aprovado.

Para mais informações, confira a [documentação da API de CanMatchFn](api/router/CanMatchFn).

## Aplicando guards a routes {#applying-guards-to-routes}

Depois de criar seus route guards, você precisa configurá-los nas definições de route.

Os guards são especificados como arrays na configuração de route, para que você possa aplicar vários guards a uma única route. O router inicia os guards na ordem em que aparecem no array, mas não espera que um guard termine antes de iniciar o próximo. Por isso, os guards que retornam uma `Promise` ou um `Observable` são executados de forma concorrente.

A ordem do array determina qual resultado tem prioridade. A navegação só continua se todos os guards retornarem `true`. Caso contrário, o router usa o resultado do primeiro guard do array que não retornou `true`, mesmo que um guard posterior tenha terminado antes.

NOTE: Como os guards assíncronos são executados de forma concorrente, um guard não pode depender do trabalho feito por um guard anterior no mesmo array, como carregar o usuário atual. Coloque esse trabalho em um service usado pelos dois guards ou combine as verificações em um único guard.

```ts
import {Routes} from '@angular/router';
import {authGuard} from './guards/auth.guard';
import {adminGuard} from './guards/admin.guard';
import {canDeactivateGuard} from './guards/can-deactivate.guard';
import {featureToggleGuard} from './guards/feature-toggle.guard';

const routes: Routes = [
  // Basic CanActivate - requires authentication
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard],
  },

  // Multiple CanActivate guards - requires authentication AND admin role
  {
    path: 'admin',
    component: Admin,
    canActivate: [authGuard, adminGuard],
  },

  // CanActivate + CanDeactivate - protected route with unsaved changes check
  {
    path: 'profile',
    component: Profile,
    canActivate: [authGuard],
    canDeactivate: [canDeactivateGuard],
  },

  // CanActivateChild - protects all child routes
  {
    path: 'users', // /user - NOT protected
    canActivateChild: [authGuard],
    children: [
      // /users/list - PROTECTED
      {path: 'list', component: UserList},
      // /users/detail/:id - PROTECTED
      {path: 'detail/:id', component: UserDetail},
    ],
  },

  // CanMatch - conditionally matches route based on feature flag
  {
    path: 'beta-feature',
    component: BetaFeature,
    canMatch: [featureToggleGuard],
  },

  // Fallback route if beta feature is disabled
  {
    path: 'beta-feature',
    component: ComingSoon,
  },
];
```
