<!-- ia-translate: true -->
# Redirecionando Routes

Redirecionamentos de route permitem que você navegue automaticamente usuários de uma route para outra. Pense nisso como encaminhamento de correspondência, onde correspondências destinadas a um endereço são enviadas para um endereço diferente. Isso é útil para lidar com URLs legadas, implementar routes padrão ou gerenciar controle de acesso.

## Como configurar redirecionamentos

Você pode definir redirecionamentos na sua configuração de route com a propriedade `redirectTo`. Esta propriedade aceita uma string.

```ts
import { Routes } from '@angular/router';

const routes: Routes = [
  // Simple redirect
  { path: 'marketing', redirectTo: 'newsletter' },

  // Redirect with path parameters
  { path: 'legacy-user/:id', redirectTo: 'users/:id' },

  // Redirect any other URLs that don't match
  // (also known as a "wildcard" redirect)
  { path: '**', redirectTo: '/login' }
];
```

Neste exemplo, existem três redirecionamentos:

1. Quando um usuário visita o caminho `/marketing`, ele é redirecionado para `/newsletter`.
2. Quando um usuário visita qualquer caminho `/legacy-user/:id`, ele é roteado para o caminho `/users/:id` correspondente.
3. Quando um usuário visita qualquer caminho que não está definido no router, ele é redirecionado para a página de login por causa da definição de caminho curinga `**`.

## Entendendo `pathMatch`

A propriedade `pathMatch` em routes permite que os desenvolvedores controlem como o Angular corresponde uma URL às routes.

Existem dois valores que `pathMatch` aceita:

| Value      | Description                                       |
| ---------- | ------------------------------------------------- |
| `'full'`   | O caminho completo da URL deve corresponder exatamente |
| `'prefix'` | Apenas o início da URL precisa corresponder      |

Por padrão, todos os redirecionamentos usam a estratégia `prefix`.

### `pathMatch: 'prefix'`

`pathMatch: 'prefix'` é a estratégia padrão e ideal quando você quer que o Angular Router corresponda todas as routes subsequentes ao disparar um redirecionamento.

```ts
export const routes: Routes = [
  // This redirect route is equivalent to…
  { path: 'news', redirectTo: 'blog },

  // This explicitly defined route redirect pathMatch
  { path: 'news', redirectTo: 'blog', pathMatch: 'prefix' },
];
```

Neste exemplo, todas as routes que são prefixadas com `news` são redirecionadas para seus equivalentes `/blog`. Aqui estão alguns exemplos onde os usuários são redirecionados ao visitar o antigo prefixo `news`:

- `/news` redireciona para `/blog`
- `/news/article` redireciona para `/blog/article`
- `/news/article/:id` redireciona para `/blog/article/:id`

### `pathMatch: 'full'`

Por outro lado, `pathMatch: 'full'` é útil quando você quer que o Angular Router redirecione apenas um caminho específico.

```ts
export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];
```

Neste exemplo, toda vez que o usuário visita a URL raiz (ou seja, `''`), o router redireciona esse usuário para a página `'/dashboard'`.

Quaisquer páginas subsequentes (por exemplo, `/login`, `/about`, `/product/id`, etc.), são ignoradas e não disparam um redirecionamento.

DICA: Tenha cuidado ao configurar um redirecionamento na página raiz (ou seja, `"/"` ou `""`). Se você não definir `pathMatch: 'full'`, o router redirecionará todas as URLs.

Para ilustrar ainda mais isso, se o exemplo de `news` da seção anterior usasse `pathMatch: 'full'` em vez disso:

```ts
export const routes: Routes = [
  { path: 'news', redirectTo: '/blog', pathMatch: 'full' },
];
```

Isso significa que:

1. Apenas o caminho `/news` será redirecionado para `/blog`.
2. Quaisquer segmentos subsequentes, como `/news/articles` ou `/news/articles/1`, não redirecionariam com o novo prefixo `/blog`.

## Redirecionamentos condicionais

A propriedade `redirectTo` também pode aceitar uma função para adicionar lógica a como os usuários são redirecionados.

A [função](api/router/RedirectFunction) tem acesso apenas a parte dos dados de [`ActivatedRouteSnapshot`](api/router/ActivatedRouteSnapshot), já que alguns dados não são conhecidos com precisão na fase de correspondência de route. Exemplos incluem: títulos resolvidos, components carregados sob demanda, etc.

Ela normalmente retorna uma string ou [`URLTree`](api/router/UrlTree), mas também pode retornar um observable ou promise.

Aqui está um exemplo onde o usuário é redirecionado para um menu diferente com base na hora do dia:

```ts
import { Routes } from '@angular/router';
import { MenuComponent } from './menu/menu.component';

export const routes: Routes = [
  {
    path: 'restaurant/:location/menu',
    redirectTo: (activatedRouteSnapshot) => {
      const location = activatedRouteSnapshot.params['location'];
      const currentHour = new Date().getHours();

      // Check if user requested a specific meal via query parameter
      if (activatedRouteSnapshot.queryParams['meal']) {
        return `/restaurant/${location}/menu/${queryParams['meal']}`;
      }

      // Auto-redirect based on time of day
      if (currentHour >= 5 && currentHour < 11) {
        return `/restaurant/${location}/menu/breakfast`;
      } else if (currentHour >= 11 && currentHour < 17) {
        return `/restaurant/${location}/menu/lunch`;
      } else {
        return `/restaurant/${location}/menu/dinner`;
      }
    }
  },

  // Destination routes
  { path: 'restaurant/:location/menu/breakfast', component: MenuComponent },
  { path: 'restaurant/:location/menu/lunch', component: MenuComponent },
  { path: 'restaurant/:location/menu/dinner', component: MenuComponent },

  // Default redirect
  { path: '', redirectTo: '/restaurant/downtown/menu', pathMatch: 'full' }
];
```

Para saber mais, confira [a documentação da API para RedirectFunction](api/router/RedirectFunction).

## Próximos passos

Para mais informações sobre a propriedade `redirectTo`, confira a [documentação da API](api/router/Route#redirectTo).
