<!-- ia-translate: true -->
# Ler o estado da route

O Angular Router permite que você leia e use informações associadas a uma route para criar components responsivos e conscientes do contexto.

## Obter informações sobre a route atual com ActivatedRoute

`ActivatedRoute` é um service de `@angular/router` que fornece todas as informações associadas à route atual.

```angular-ts
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product',
})
export class ProductComponent {
  private activatedRoute = inject(ActivatedRoute);

  constructor() {
    console.log(this.activatedRoute);
  }
}
```

O `ActivatedRoute` pode fornecer diferentes informações sobre a route. Algumas propriedades comuns incluem:

| Property      | Details                                                                                                                                      |
| :------------ | :------------------------------------------------------------------------------------------------------------------------------------------- |
| `url`         | Um `Observable` dos caminhos da route, representados como um array de strings para cada parte do caminho da route.                          |
| `data`        | Um `Observable` que contém o objeto `data` fornecido para a route. Também contém quaisquer valores resolvidos do resolve guard.             |
| `params`      | Um `Observable` que contém os parâmetros obrigatórios e opcionais específicos da route.                                                     |
| `queryParams` | Um `Observable` que contém os query parameters disponíveis para todas as routes.                                                            |

Confira a [documentação da API `ActivatedRoute`](/api/router/ActivatedRoute) para uma lista completa do que você pode acessar na route.

## Entendendo snapshots de route

Navegações de página são eventos ao longo do tempo, e você pode acessar o estado do router em um determinado momento recuperando um snapshot da route.

Snapshots de route contêm informações essenciais sobre a route, incluindo seus parâmetros, dados e routes filhas. Além disso, snapshots são estáticos e não refletirão mudanças futuras.

Aqui está um exemplo de como você acessaria um snapshot de route:

```angular-ts
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

@Component({ ... })
export class UserProfileComponent {
  readonly userId: string;
  private route = inject(ActivatedRoute);

  constructor() {
    // Example URL: https://www.angular.dev/users/123?role=admin&status=active#contact

    // Access route parameters from snapshot
    this.userId = this.route.snapshot.paramMap.get('id');

    // Access multiple route elements
    const snapshot = this.route.snapshot;
    console.log({
      url: snapshot.url,           // https://www.angular.dev
      // Route parameters object: {id: '123'}
      params: snapshot.params,
      // Query parameters object: {role: 'admin', status: 'active'}
      queryParams: snapshot.queryParams,  // Query parameters
    });
  }
}
```

Confira a [documentação da API `ActivatedRoute`](/api/router/ActivatedRoute) e a [documentação da API `ActivatedRouteSnapshot`](/api/router/ActivatedRouteSnapshot) para uma lista completa de todas as propriedades que você pode acessar.

## Lendo parâmetros em uma route

Existem dois tipos de parâmetros que os desenvolvedores podem utilizar de uma route: parâmetros de route e query parameters.

### Parâmetros de Route

Parâmetros de route permitem que você passe dados para um component através da URL. Isso é útil quando você deseja exibir conteúdo específico com base em um identificador na URL, como um ID de usuário ou um ID de produto.

Você pode [definir parâmetros de route](/guide/routing/define-routes#define-url-paths-with-route-parameters) prefixando o nome do parâmetro com dois pontos (`:`).

```angular-ts
import { Routes } from '@angular/router';
import { ProductComponent } from './product/product.component';

const routes: Routes = [
  { path: 'product/:id', component: ProductComponent }
];
```

Você pode acessar parâmetros assinando `route.params`.

```angular-ts
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  template: `<h1>Product Details: {{ productId() }}</h1>`,
})
export class ProductDetailComponent {
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

### Query Parameters

[Query parameters](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) fornecem uma maneira flexível de passar dados opcionais através de URLs sem afetar a estrutura da route. Diferentemente dos parâmetros de route, query parameters podem persistir entre eventos de navegação e são perfeitos para lidar com filtragem, ordenação, paginação e outros elementos de UI com estado.

```angular-ts
// Single parameter structure
// /products?category=electronics
router.navigate(['/products'], {
  queryParams: { category: 'electronics' }
});

// Multiple parameters
// /products?category=electronics&sort=price&page=1
router.navigate(['/products'], {
  queryParams: {
    category: 'electronics',
    sort: 'price',
    page: 1
  }
});
```

Você pode acessar query parameters com `route.queryParams`.

Aqui está um exemplo de um `ProductListComponent` que atualiza os query parameters que afetam como ele exibe uma lista de produtos:

```angular-ts
import { ActivatedRoute, Router } from '@angular/router';

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
  `
})
export class ProductListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor() {
    // Access query parameters reactively
    this.route.queryParams.subscribe(params => {
      const sort = params['sort'] || 'price';
      const page = Number(params['page']) || 1;
      this.loadProducts(sort, page);
    });
  }

  updateSort(event: Event) {
    const sort = (event.target as HTMLSelectElement).value;
    // Update URL with new query parameter
    this.router.navigate([], {
      queryParams: { sort },
      queryParamsHandling: 'merge' // Preserve other query parameters
    });
  }
}
```

Neste exemplo, os usuários podem usar um elemento select para ordenar a lista de produtos por nome ou preço. O manipulador de mudança associado atualiza os query parameters da URL, que por sua vez dispara um evento de mudança que pode ler os query parameters atualizados e atualizar a lista de produtos.

Para mais informações, confira a [documentação oficial sobre QueryParamsHandling](/api/router/QueryParamsHandling).

### Matrix Parameters

Matrix parameters são parâmetros opcionais que pertencem a um segmento de URL específico, em vez de se aplicarem a toda a route. Diferentemente dos query parameters que aparecem depois de um `?` e se aplicam globalmente, matrix parameters usam ponto e vírgula (`;`) e têm escopo para segmentos de caminho individuais.

Matrix parameters são úteis quando você precisa passar dados auxiliares para um segmento de route específico sem afetar a definição da route ou o comportamento de correspondência. Assim como os query parameters, eles não precisam ser definidos na sua configuração de route.

```ts
// URL format: /path;key=value
// Multiple parameters: /path;key1=value1;key2=value2

// Navigate with matrix parameters
this.router.navigate(['/awesome-products', { view: 'grid', filter: 'new' }]);
// Results in URL: /awesome-products;view=grid;filter=new
```

**Usando ActivatedRoute**

```ts
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component(/* ... */)
export class AwesomeProducts  {
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

NOTA: Como alternativa ao uso de `ActivatedRoute`, matrix parameters também são vinculados a inputs de component ao usar o `withComponentInputBinding`.

## Detectar a route ativa atual com RouterLinkActive

Você pode usar a directive `RouterLinkActive` para estilizar dinamicamente elementos de navegação com base na route ativa atual. Isso é comum em elementos de navegação para informar aos usuários qual é a route ativa.

```angular-html
<nav>
  <a class="button"
     routerLink="/about"
     routerLinkActive="active-button"
     ariaCurrentWhenActive="page">
    About
  </a> |
  <a class="button"
     routerLink="/settings"
     routerLinkActive="active-button"
     ariaCurrentWhenActive="page">
    Settings
  </a>
</nav>
```

Neste exemplo, o Angular Router aplicará a classe `active-button` ao link âncora correto e `ariaCurrentWhenActive` como `page` quando a URL corresponder ao `routerLink` correspondente.

Se você precisar adicionar várias classes ao elemento, você pode usar uma string separada por espaços ou um array:

```angular-html
<!-- Space-separated string syntax -->
<a routerLink="/user/bob" routerLinkActive="class1 class2">Bob</a>

<!-- Array syntax -->
<a routerLink="/user/bob" [routerLinkActive]="['class1', 'class2']">Bob</a>
```

Quando você especifica um valor para routerLinkActive, você também está definindo o mesmo valor para `ariaCurrentWhenActive`. Isso garante que usuários com deficiência visual (que podem não perceber a estilização diferente sendo aplicada) também possam identificar o botão ativo.

Se você quiser definir um valor diferente para aria, você precisará definir explicitamente o valor usando a directive `ariaCurrentWhenActive`.

### Estratégia de correspondência de route

Por padrão, `RouterLinkActive` considera quaisquer ancestrais na route como uma correspondência.

```angular-html
<a [routerLink]="['/user/jane']" routerLinkActive="active-link">
  User
</a>
<a [routerLink]="['/user/jane/role/admin']" routerLinkActive="active-link">
  Role
</a>
```

Quando o usuário visita `/user/jane/role/admin`, ambos os links teriam a classe `active-link`.

### Aplicar RouterLinkActive apenas em correspondências exatas de route

Se você quiser aplicar a classe apenas em uma correspondência exata, você precisa fornecer a directive `routerLinkActiveOptions` com um objeto de configuração que contém o valor `exact: true`.

```angular-html
<a [routerLink]="['/user/jane']"
  routerLinkActive="active-link"
  [routerLinkActiveOptions]="{exact: true}"
>
  User
</a>
<a [routerLink]="['/user/jane/role/admin']"
  routerLinkActive="active-link"
  [routerLinkActiveOptions]="{exact: true}"
>
  Role
</a>
```

Se você quiser ser mais preciso em como uma route é correspondida, vale a pena notar que `exact: true` é na verdade açúcar sintático para o conjunto completo de opções de correspondência:

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

Para mais informações, confira a documentação oficial para [isActiveMatchOptions](/api/router/IsActiveMatchOptions).

### Aplicar RouterLinkActive a um ancestral

A directive RouterLinkActive também pode ser aplicada a um elemento ancestral para permitir que os desenvolvedores estilizem os elementos conforme desejado.

```angular-html
<div routerLinkActive="active-link" [routerLinkActiveOptions]="{exact: true}">
  <a routerLink="/user/jim">Jim</a>
  <a routerLink="/user/bob">Bob</a>
</div>
```

Para mais informações, confira a [documentação da API para RouterLinkActive](/api/router/RouterLinkActive).
