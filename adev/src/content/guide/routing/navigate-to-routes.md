<!-- ia-translate: true -->
# Navegar para routes

A directive RouterLink é a abordagem declarativa do Angular para navegação. Ela permite que você use elementos âncora padrão (`<a>`) que se integram perfeitamente ao sistema de routing do Angular.

## Como usar RouterLink

Em vez de usar elementos âncora regulares `<a>` com um atributo `href`, você adiciona uma directive RouterLink com o caminho apropriado para aproveitar o routing do Angular.

```angular-ts
import {RouterLink} from '@angular/router';
@Component({
  template: `
    <nav>
      <a routerLink="/user-profile">User profile</a>
      <a routerLink="/settings">Settings</a>
    </nav>
  `
  imports: [RouterLink],
  ...
})
export class App {}
```

### Usando links absolutos ou relativos

**URLs relativas** no routing do Angular permitem que você defina caminhos de navegação relativos à localização da route atual. Isso contrasta com **URLs absolutas**, que contêm o caminho completo com o protocolo (por exemplo, `http://`) e o **domínio raiz** (por exemplo, `google.com`).

```angular-html
<!-- Absolute URL -->
<a href="https://www.angular.dev/essentials">Angular Essentials Guide</a>

<!-- Relative URL -->
<a href="/essentials">Angular Essentials Guide</a>
```

Neste exemplo, o primeiro exemplo contém o caminho completo com o protocolo (ou seja, `https://`) e o domínio raiz (ou seja, `angular.dev`) explicitamente definidos para a página essentials. Em contraste, o segundo exemplo assume que o usuário já está no domínio raiz correto para `/essentials`.

De modo geral, URLs relativas são preferidas porque são mais fáceis de manter em aplicações, pois não precisam conhecer sua posição absoluta dentro da hierarquia de routing.

### Como funcionam as URLs relativas

O routing do Angular possui duas sintaxes para definir URLs relativas: strings e arrays.

```angular-html
<!-- Navigates user to /dashboard -->
<a routerLink="dashboard">Dashboard</a>
<a [routerLink]="['dashboard']">Dashboard</a>
```

ÚTIL: Passar uma string é a maneira mais comum de definir URLs relativas.

Quando você precisa definir parâmetros dinâmicos em uma URL relativa, use a sintaxe de array:

```angular-html
<a [routerLink]="['user', currentUserId]">Current User</a>
```

Além disso, o routing do Angular permite que você especifique se deseja que o caminho seja relativo à URL atual ou ao domínio raiz, com base em se o caminho relativo é prefixado com uma barra (`/`) ou não.

Por exemplo, se o usuário está em `example.com/settings`, veja como diferentes caminhos relativos podem ser definidos para vários cenários:

```angular-html
<!-- Navigates to /settings/notifications -->
<a routerLink="notifications">Notifications</a>
<a routerLink="/settings/notifications">Notifications</a>

<!-- Navigates to /team/:teamId/user/:userId -->
<a routerLink="/team/123/user/456">User 456</a>
<a [routerLink]="['/team', teamId, 'user', userId]">Current User</a>"
```

## Navegação programática para routes

Enquanto o `RouterLink` lida com navegação declarativa em templates, o Angular fornece navegação programática para cenários onde você precisa navegar com base em lógica, ações do usuário ou estado da aplicação. Ao injetar o `Router`, você pode navegar dinamicamente para routes, passar parâmetros e controlar o comportamento de navegação no seu código TypeScript.

### `router.navigate()`

Você pode usar o método `router.navigate()` para navegar programaticamente entre routes especificando um array de caminhos de URL.

```angular-ts
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  template: `
    <button (click)="navigateToProfile()">View Profile</button>
  `
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
      queryParams: { category: 'books', sort: 'price' }
    });

    // With matrix parameters
    this.router.navigate(['/products', { featured: true, onSale: true }]);
  }
}
```

O `router.navigate()` suporta cenários de routing simples e complexos, permitindo que você passe parâmetros de route, [query parameters](/guide/routing/read-route-state#query-parameters) e controle o comportamento de navegação.

Você também pode construir caminhos de navegação dinâmicos relativos à localização do seu component na árvore de routing usando a opção `relativeTo`.

```angular-ts
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-detail',
  template: `
    <button (click)="navigateToEdit()">Edit User</button>
    <button (click)="navigateToParent()">Back to List</button>
  `
})
export class UserDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  constructor() {}

  // Navigate to a sibling route
  navigateToEdit() {
    // From: /users/123
    // To:   /users/123/edit
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  // Navigate to parent
  navigateToParent() {
    // From: /users/123
    // To:   /users
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
```

### `router.navigateByUrl()`

O método `router.navigateByUrl()` fornece uma maneira direta de navegar programaticamente usando strings de caminho de URL em vez de segmentos de array. Este método é ideal quando você tem um caminho de URL completo e precisa realizar navegação absoluta, especialmente ao trabalhar com URLs fornecidas externamente ou cenários de deep linking.

```ts
// Standard route navigation
router.navigateByUrl('/products);

// Navigate to nested route
router.navigateByUrl('/products/featured');

// Complete URL with parameters and fragment
router.navigateByUrl('/products/123?view=details#reviews');

// Navigate with query parameters
router.navigateByUrl('/search?category=books&sortBy=price');

// With matrix parameters
router.navigateByUrl('/sales-awesome;isOffer=true;showModal=false')
```

No caso de você precisar substituir a URL atual no histórico, `navigateByUrl` também aceita um objeto de configuração que possui uma opção `replaceUrl`.

```ts
// Replace current URL in history
router.navigateByUrl('/checkout', {
  replaceUrl: true
});
```

## Próximos passos

Aprenda como [ler o estado da route](/guide/routing/read-route-state) para criar components responsivos e conscientes do contexto.
