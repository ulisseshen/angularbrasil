<!-- ia-translate: true -->

# Ler o estado da route

O Angular Router permite que você leia e use informações associadas a uma route para criar components responsivos e conscientes do contexto.

## Obter informações sobre a route atual com ActivatedRoute {#get-information-about-the-current-route-with-activatedroute}

`ActivatedRoute` é um service de `@angular/router` que fornece todas as informações associadas à route atual.

```angular-ts
import {Component, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-product',
})
export class Product {
  private activatedRoute = inject(ActivatedRoute);

  constructor() {
    console.log(this.activatedRoute);
  }
}
```

O `ActivatedRoute` pode fornecer diferentes informações sobre a route. Algumas propriedades comuns incluem:

| Propriedade   | Detalhes                                                                                                                                       |
| :------------ | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| `url`         | Um `Observable` com os caminhos da route, representados como um array de objetos `UrlSegment`, um para cada parte do caminho da route.       |
| `data`        | Um `Observable` que contém o objeto `data` fornecido para a route. Também contém quaisquer valores resolvidos pelo guard de resolução.        |
| `params`      | Um `Observable` que contém os parâmetros obrigatórios e opcionais específicos da route.                                                        |
| `queryParams` | Um `Observable` que contém os query parameters disponíveis para todas as routes.                                                               |
| `resources`   | Um registro opcional de instâncias `Resource` somente leitura definidas na route ou herdadas por ela (requer `withRouterResources()`).         |

Confira a [documentação da API de `ActivatedRoute`](/api/router/ActivatedRoute) para ver a lista completa do que você pode acessar dentro da route.

## Entendendo os snapshots de route {#understanding-route-snapshots}

Navegações de página são eventos ao longo do tempo, e você pode acessar o estado do router em um determinado momento obtendo um snapshot da route.

Os snapshots de route contêm informações essenciais sobre a route, incluindo seus parâmetros, dados e routes filhas. Além disso, os snapshots são estáticos e não refletem mudanças futuras.

Veja um exemplo de como você acessaria um snapshot de route:

```angular-ts
import {Component, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component(/* ... */)
export class UserProfile {
  readonly userId: string | null;
  private route = inject(ActivatedRoute);

  constructor() {
    // Example URL: https://www.angular.dev/users/123?role=admin&status=active#contact

    // Access route parameters from snapshot
    this.userId = this.route.snapshot.paramMap.get('id');

    // Access multiple route elements
    const snapshot = this.route.snapshot;
    console.log({
      url: snapshot.url, // Array of UrlSegments matched by this route
      // Route parameters object: {id: '123'}
      params: snapshot.params,
      // Query parameters object: {role: 'admin', status: 'active'}
      queryParams: snapshot.queryParams, // Query parameters
    });
  }
}
```

Confira a [documentação da API de `ActivatedRoute`](/api/router/ActivatedRoute) e a [documentação da API de `ActivatedRouteSnapshot`](/api/router/ActivatedRouteSnapshot) para ver a lista completa de todas as propriedades que você pode acessar.

## Lendo parâmetros em uma route {#reading-parameters-on-a-route}

Existem dois tipos de parâmetros que os desenvolvedores podem usar em uma route: parâmetros de route e query parameters.

### Parâmetros de route {#route-parameters}

Parâmetros de route permitem que você passe dados para um component por meio da URL. Isso é útil quando você quer exibir conteúdo específico com base em um identificador presente na URL, como um ID de usuário ou um ID de produto.

Você pode [definir parâmetros de route](/guide/routing/define-routes#define-url-paths-with-route-parameters) prefixando o nome do parâmetro com dois-pontos (`:`).

```angular-ts
import {Routes} from '@angular/router';
import {Product} from './product';

const routes: Routes = [{path: 'product/:id', component: Product}];
```

Você pode acessar os parâmetros fazendo subscription em `route.params`.

```angular-ts
import {Component, inject, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-product-detail',
  template: `<h1>Product Details: {{ productId() }}</h1>`,
})
export class ProductDetail {
  productId = signal('');
  private activatedRoute = inject(ActivatedRoute);

  constructor() {
    // Access route parameters
    this.activatedRoute.params.subscribe((params) => {
      this.productId.set(params['id']);
    });
  }
}
```

### Query parameters {#query-parameters}

[Query parameters](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) oferecem uma forma flexível de passar dados opcionais por meio de URLs sem afetar a estrutura da route. Diferentemente dos parâmetros de route, os query parameters podem persistir entre eventos de navegação e são ideais para filtragem, ordenação, paginação e outros elementos de UI com estado.

```angular-ts
// Single parameter structure
// /products?category=electronics
router.navigate(['/products'], {
  queryParams: {category: 'electronics'},
});

// Multiple parameters
// /products?category=electronics&sort=price&page=1
router.navigate(['/products'], {
  queryParams: {
    category: 'electronics',
    sort: 'price',
    page: 1,
  },
});
```

Você pode acessar os query parameters com `route.queryParams`.

Veja a seguir um exemplo de um `ProductList` que atualiza os query parameters que afetam a forma como ele exibe uma lista de produtos:

```angular-ts
import {Component, inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-product-list',
  template: `
    <div>
      <select (change)="updateSort($event)">
        <option value="price">Price</option>
        <option value="name">Name</option>
      </select>
      <!-- Products list -->
    </div>
  `,
})
export class ProductList {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor() {
    // Access query parameters reactively
    this.route.queryParams.subscribe((params) => {
      const sort = params['sort'] || 'price';
      const page = Number(params['page']) || 1;
      this.loadProducts(sort, page);
    });
  }

  updateSort(event: Event) {
    const sort = (event.target as HTMLSelectElement).value;
    // Update URL with new query parameter
    this.router.navigate([], {
      queryParams: {sort},
      queryParamsHandling: 'merge', // Preserve other query parameters
    });
  }
}
```

Neste exemplo, os usuários podem usar um elemento select para ordenar a lista de produtos por nome ou preço. O handler de change associado atualiza os query parameters da URL, o que por sua vez dispara um evento que pode ler os query parameters atualizados e atualizar a lista de produtos.

Para mais informações, confira a [documentação oficial sobre QueryParamsHandling](/api/router/QueryParamsHandling).

### Matrix parameters {#matrix-parameters}

Matrix parameters são parâmetros opcionais que pertencem a um segmento de URL específico, em vez de se aplicarem à route inteira. Diferentemente dos query parameters, que aparecem depois de um `?` e se aplicam globalmente, os matrix parameters usam ponto e vírgula (`;`) e têm escopo em segmentos de caminho individuais.

Matrix parameters são úteis quando você precisa passar dados auxiliares para um segmento de route específico sem afetar a definição da route nem o comportamento de correspondência. Assim como os query parameters, eles não precisam ser definidos na configuração das routes.

```ts
// URL format: /path;key=value
// Multiple parameters: /path;key1=value1;key2=value2

// Navigate with matrix parameters
this.router.navigate(['/awesome-products', {view: 'grid', filter: 'new'}]);
// Results in URL: /awesome-products;view=grid;filter=new
```

**Usando ActivatedRoute**

```ts
import {Component, inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component(/* ... */)
export class AwesomeProducts {
  private route = inject(ActivatedRoute);

  constructor() {
    // Access matrix parameters via params
    this.route.params.subscribe((params) => {
      const view = params['view']; // e.g., 'grid'
      const filter = params['filter']; // e.g., 'new'
    });
  }
}
```

NOTE: Como alternativa ao uso de `ActivatedRoute`, os matrix parameters também são vinculados às entradas de component quando se usa `withComponentInputBinding`.

## Detectar a route ativa atual com RouterLinkActive {#detect-active-current-route-with-routerlinkactive}

Você pode usar a directive `RouterLinkActive` para estilizar dinamicamente elementos de navegação com base na route ativa atual. Isso é comum em elementos de navegação, para informar aos usuários qual é a route ativa.

```angular-html
<nav>
  <a
    class="button"
    routerLink="/about"
    routerLinkActive="active-button"
    ariaCurrentWhenActive="page"
  >
    About
  </a>
  |
  <a
    class="button"
    routerLink="/settings"
    routerLinkActive="active-button"
    ariaCurrentWhenActive="page"
  >
    Settings
  </a>
</nav>
```

Neste exemplo, o Angular Router aplicará a classe `active-button` ao link correto e `ariaCurrentWhenActive` com o valor `page` quando a URL corresponder ao `routerLink` correspondente.

Se precisar adicionar várias classes ao elemento, você pode usar uma string separada por espaços ou um array:

```angular-html
<!-- Space-separated string syntax -->
<a routerLink="/user/bob" routerLinkActive="class1 class2">Bob</a>

<!-- Array syntax -->
<a routerLink="/user/bob" [routerLinkActive]="['class1', 'class2']">Bob</a>
```

Definir apenas `routerLinkActive` não define o `aria-current`. Defina a entrada `ariaCurrentWhenActive`, como no exemplo acima, para que usuários com deficiência visual (que podem não perceber a estilização diferente aplicada) também consigam identificar o link ativo.

### Estratégia de correspondência de route {#route-matching-strategy}

Por padrão, `RouterLinkActive` considera qualquer ancestral da route como uma correspondência.

```angular-html
<a [routerLink]="['/user/jane']" routerLinkActive="active-link"> User </a>
<a [routerLink]="['/user/jane/role/admin']" routerLinkActive="active-link"> Role </a>
```

Quando o usuário visita `/user/jane/role/admin`, ambos os links terão a classe `active-link`.

### Aplicar RouterLinkActive somente em correspondências exatas de route {#only-apply-routerlinkactive-on-exact-route-matches}

Se você quiser aplicar a classe somente em uma correspondência exata, precisa fornecer à directive `routerLinkActiveOptions` um objeto de configuração que contenha o valor `exact: true`.

```angular-html
<a
  [routerLink]="['/user/jane']"
  routerLinkActive="active-link"
  [routerLinkActiveOptions]="{exact: true}"
>
  User
</a>
<a
  [routerLink]="['/user/jane/role/admin']"
  routerLinkActive="active-link"
  [routerLinkActiveOptions]="{exact: true}"
>
  Role
</a>
```

Se quiser ser mais preciso na forma como uma route é correspondida, vale notar que `exact: true` é, na verdade, um açúcar sintático para o conjunto completo de opções de correspondência:

```angular-ts
// `exact: true` is equivalent to
{
  paths: 'exact',
  fragment: 'ignored',
  matrixParams: 'ignored',
  queryParams: 'exact',
}

// `exact: false` is equivalent
{
  paths: 'subset',
  fragment: 'ignored',
  matrixParams: 'ignored',
  queryParams: 'subset',
}
```

Para mais informações, confira a documentação oficial de [isActiveMatchOptions](/api/router/IsActiveMatchOptions).

### Aplicar RouterLinkActive a um ancestral {#apply-routerlinkactive-to-an-ancestor}

A directive RouterLinkActive também pode ser aplicada a um elemento ancestral, para permitir que os desenvolvedores estilizem os elementos como desejarem.

```angular-html
<div routerLinkActive="active-link" [routerLinkActiveOptions]="{exact: true}">
  <a routerLink="/user/jim">Jim</a>
  <a routerLink="/user/bob">Bob</a>
</div>
```

Para mais informações, confira a [documentação da API de RouterLinkActive](/api/router/RouterLinkActive).

## Verificar se uma URL está ativa {#check-if-a-url-is-active}

A função `isActive` retorna um signal computado que acompanha se uma determinada URL está atualmente ativa no router. O signal é atualizado automaticamente conforme o estado do router muda.

```angular-ts
import {Component, inject} from '@angular/core';
import {isActive, Router} from '@angular/router';

@Component({
  template: `
    <div [class.active]="isSettingsActive()">
      <h2>Settings</h2>
    </div>
  `,
})
export class Panel {
  private router = inject(Router);

  isSettingsActive = isActive('/settings', this.router, {
    paths: 'subset',
    queryParams: 'ignored',
    fragment: 'ignored',
    matrixParams: 'ignored',
  });
}
```
