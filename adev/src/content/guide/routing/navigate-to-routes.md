<!-- ia-translate: true -->

# Navegar para routes {#navigate-to-routes}

A directive RouterLink é a abordagem declarativa do Angular para navegação. Ela permite que você use elementos âncora padrão (`<a>`) que se integram perfeitamente ao sistema de roteamento do Angular.

## Como usar RouterLink {#how-to-use-routerlink}

Em vez de usar elementos âncora comuns `<a>` com um atributo `href`, você adiciona uma directive RouterLink com o caminho apropriado para aproveitar o roteamento do Angular.

```angular-ts
import {RouterLink} from '@angular/router';
import {Component} from '@angular/core';

@Component({
  template: `
    <nav>
      <a routerLink="/user-profile">User profile</a>
      <a routerLink="/settings">Settings</a>
    </nav>
  `,
  imports: [RouterLink],
  ...
})
export class App {}
```

### Usando links absolutos ou relativos {#using-absolute-or-relative-links}

**URLs relativas** no roteamento do Angular permitem que você defina caminhos de navegação relativos à localização da route atual. Isso contrasta com **URLs absolutas**, que contêm o caminho completo, com o protocolo (por exemplo, `http://`) e o **domínio raiz** (por exemplo, `google.com`).

```angular-html
<!-- Absolute URL -->
<a href="https://www.angular.dev/essentials">Angular Essentials Guide</a>

<!-- Relative URL -->
<a href="/essentials">Angular Essentials Guide</a>
```

Neste exemplo, o primeiro link contém o caminho completo, com o protocolo (ou seja, `https://`) e o domínio raiz (ou seja, `angular.dev`) definidos explicitamente para a página essentials. Já o segundo exemplo assume que o usuário já está no domínio raiz correto para `/essentials`.

De modo geral, URLs relativas são preferidas, pois são mais fáceis de manter entre aplicações, já que não precisam conhecer sua posição absoluta na hierarquia de roteamento.

### Como funcionam as URLs relativas {#how-relative-urls-work}

O roteamento do Angular possui duas sintaxes para definir URLs relativas: strings e arrays.

```angular-html
<!-- Navigates user to /dashboard -->
<a routerLink="dashboard">Dashboard</a>
<a [routerLink]="['dashboard']">Dashboard</a>
```

ÚTIL: Passar uma string é a forma mais comum de definir URLs relativas.

Quando você precisar definir parâmetros dinâmicos em uma URL relativa, use a sintaxe de array:

```angular-html
<a [routerLink]="['user', currentUserId]">Current User</a>
```

Além disso, o roteamento do Angular permite especificar se o caminho deve ser relativo à URL atual ou ao domínio raiz, dependendo de o caminho relativo começar com uma barra (`/`) ou não.

Por exemplo, se o usuário está em `example.com/settings`, veja como diferentes caminhos relativos podem ser definidos para vários cenários:

```angular-html
<!-- Navigates to /settings/notifications -->
<a routerLink="notifications">Notifications</a>
<a routerLink="/settings/notifications">Notifications</a>

<!-- Navigates to /team/:teamId/user/:userId -->
<a routerLink="/team/123/user/456">User 456</a>
<a [routerLink]="['/team', teamId, 'user', userId]">Current User</a>
```

## Navegação programática para routes {#programmatic-navigation-to-routes}

Enquanto o `RouterLink` lida com a navegação declarativa nos templates, o Angular oferece navegação programática para cenários em que você precisa navegar com base em lógica, ações do usuário ou estado da aplicação. Ao injetar o `Router`, você pode navegar dinamicamente para routes, passar parâmetros e controlar o comportamento da navegação no seu código TypeScript.

### `router.navigate()` {#routernavigate}

Você pode usar o método `router.navigate()` para navegar programaticamente entre routes, especificando um array com o caminho da URL.

```angular-ts
import {Router} from '@angular/router';
import {Component, inject} from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: ` <button (click)="navigateToProfile()">View Profile</button> `,
})
export class AppDashboard {
  private router = inject(Router);

  navigateToProfile() {
    // Standard navigation
    this.router.navigate(['/profile']);

    // With route parameters
    this.router.navigate(['/users', userId]);

    // With query parameters
    this.router.navigate(['/search'], {
      queryParams: {category: 'books', sort: 'price'},
    });

    // With matrix parameters
    this.router.navigate(['/products', {featured: true, onSale: true}]);
  }
}
```

`router.navigate()` oferece suporte a cenários de roteamento simples e complexos, permitindo que você passe parâmetros de route, [query parameters](/guide/routing/read-route-state#query-parameters) e controle o comportamento da navegação.

Você também pode construir caminhos de navegação dinâmicos relativos à localização do seu component na árvore de roteamento, usando a opção `relativeTo`.

```angular-ts
import {Router, ActivatedRoute} from '@angular/router';
import {Component, inject} from '@angular/core';

@Component({
  selector: 'app-user-detail',
  template: `
    <button (click)="navigateToEdit()">Edit User</button>
    <button (click)="navigateToParent()">Back to List</button>
  `,
})
export class UserDetail {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Navigate to a sibling route
  navigateToEdit() {
    // From: /users/123
    // To:   /users/123/edit
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  // Navigate to parent
  navigateToParent() {
    // From: /users/123
    // To:   /users
    this.router.navigate(['..'], {relativeTo: this.route});
  }

  navigateToList() {
    // O Angular resolve o array de comandos como um único caminho de navegação relativo à route atual.
    // From: /users/123
    // Result: /users/list
    this.router.navigate(['..', 'list'], {relativeTo: this.route});
  }
}
```

Ao navegar vários níveis para cima, todos os segmentos `..` devem estar no **primeiro elemento** do array de comandos. O router só interpreta `..` a partir da primeira string de comando; os elementos seguintes do array são tratados como segmentos de caminho literais.

```angular-ts {prefer}
// From: /team/123/users/456
// Result: /team/123/settings
this.router.navigate(['../../settings'], {relativeTo: this.route});
```

Ao usar `relativeTo`, nunca prefixe o primeiro comando com `/`. Uma barra inicial torna a navegação absoluta e ignora completamente o `relativeTo`.

```angular-ts {prefer}
// From: /team/123/users/456
// Result: /team/123/users/456/edit
this.router.navigate(['edit'], {relativeTo: this.route});
```

```angular-ts {avoid}
// From: /team/123/users/456
// Leading '/' causes absolute navigation — relativeTo is ignored
// Result: /edit
this.router.navigate(['/edit'], {relativeTo: this.route});
```

### `router.navigateByUrl()` {#routernavigatebyurl}

O método `router.navigateByUrl()` oferece uma forma direta de navegar programaticamente usando strings de caminho de URL, em vez de segmentos de array. Este método é ideal quando você tem um caminho de URL completo e precisa fazer uma navegação absoluta, especialmente ao trabalhar com URLs fornecidas externamente ou em cenários de deep linking.

```ts
// Standard route navigation
router.navigateByUrl('/products');

// Navigate to nested route
router.navigateByUrl('/products/featured');

// Complete URL with parameters and fragment
router.navigateByUrl('/products/123?view=details#reviews');

// Navigate with query parameters
router.navigateByUrl('/search?category=books&sortBy=price');

// With matrix parameters
router.navigateByUrl('/sales-awesome;isOffer=true;showModal=false');
```

Caso seja necessário substituir a URL atual no histórico, `navigateByUrl` também aceita um objeto de configuração com a opção `replaceUrl`.

```ts
// Replace current URL in history
router.navigateByUrl('/checkout', {
  replaceUrl: true,
});
```

### Exibir uma URL diferente na barra de endereços {#display-a-different-url-in-the-address-bar}

Você pode passar a opção browserUrl para navigateByUrl a fim de exibir na barra de endereços do navegador uma URL diferente daquela usada para a correspondência de routes.

Isso é útil quando você quer redirecionar o usuário para outra route, como uma página de erro, sem alterar a URL que ele tentou acessar originalmente.

```ts
router.navigateByUrl('/not-found', {browserUrl: '/products/missing-item'});
```

O Angular navega até a route `/not-found` e a renderiza, mas a barra de endereços do navegador mostra `/products/missing-item`.

NOTE: `browserUrl` afeta apenas o que aparece na barra de endereços do navegador.

## Personalizando a URL do navegador com RouterLink {#customizing-the-browser-url-with-routerlink}

A directive `RouterLink` também oferece suporte a uma entrada `browserUrl`, que permite controlar a URL exibida na barra de endereços do navegador quando um link é clicado, independentemente da route para a qual o Angular navega.

```angular-html
<!-- Navigates to /dashboard, but the address bar shows /home -->
<a [routerLink]="['/dashboard']" [browserUrl]="'/home'">Go to Dashboard</a>
```

Você também pode vincular um `UrlTree` para casos de uso mais dinâmicos:

```angular-ts
import {Component, inject} from '@angular/core';
import {Router, RouterLink, UrlTree} from '@angular/router';

@Component({
  template: `
    <a [routerLink]="['/products', product.id]" [browserUrl]="displayUrl">
      {{ product.name }}
    </a>
  `,
  imports: [RouterLink],
})
export class ProductList {
  private router = inject(Router);

  product = {id: 42, name: 'Widget'};

  // Create a UrlTree to display in the address bar
  displayUrl: UrlTree = this.router.createUrlTree(['/products', 'widget']);
}
```

## Controlando a rolagem com RouterLink {#controlling-scrolling-with-routerlink}

Quando a rolagem em memória está habilitada com `withInMemoryScrolling({scrollPositionRestoration: 'enabled'})` (ou `'top'`), o router rola para o topo da página depois que um link é clicado, mesmo quando o link altera apenas um query parameter. A directive `RouterLink` oferece suporte a uma entrada `scroll`, que permite que um link específico desative esse comportamento:

```angular-html
<!-- Switches tabs without scrolling back to the top of the page -->
<a routerLink="/products/42" [queryParams]="{tab: 'reviews'}" scroll="manual">Reviews</a>
```

Com `scroll="manual"`, o router não rola a página para aquela navegação. O valor padrão, `'after-transition'`, rola de acordo com a configuração de rolagem do router.

A mesma opção está disponível para a navegação programática:

```ts
router.navigateByUrl('/products/42?tab=reviews', {scroll: 'manual'});
```

## Próximos passos {#next-steps}

Saiba como [ler o estado da route](/guide/routing/read-route-state) para criar components responsivos e conscientes do contexto.
