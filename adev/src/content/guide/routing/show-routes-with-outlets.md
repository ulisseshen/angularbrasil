<!-- ia-translate: true -->
# Mostrar routes com outlets

A directive `RouterOutlet` é um espaço reservado que marca o local onde o router deve renderizar o component para a URL atual.

```angular-html
<app-header />
<router-outlet />  <!-- Angular inserts your route content here -->
<app-footer />
```

```ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {}
```

Neste exemplo, se uma aplicação tem as seguintes routes definidas:

```ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home Page'
  },
  {
    path: 'products',
    component: ProductsComponent,
    title: 'Our Products'
  }
];
```

Quando um usuário visita `/products`, o Angular renderiza o seguinte:

```angular-html
<app-header />
<app-products />
<app-footer />
```

Se o usuário volta para a página inicial, então o Angular renderiza:

```angular-html
<app-header />
<app-home />
<app-footer />
```

Ao exibir uma route, o elemento `<router-outlet>` permanece presente no DOM como um ponto de referência para navegações futuras. O Angular insere o conteúdo roteado logo após o elemento outlet como um irmão.

```angular-html
<!-- Contents of the component's template -->
<app-header />
<router-outlet />
<app-footer />
```

```angular-html
<!-- Content rendered on the page when the user visits /admin -->
<app-header>...</app-header>
<router-outlet></router-outlet>
<app-admin-page>...</app-admin-page>
<app-footer>...</app-footer>
```

## Aninhando routes com routes filhas

À medida que sua aplicação cresce em complexidade, você pode querer criar routes que sejam relativas a um component diferente do seu component raiz. Isso permite que você crie experiências onde apenas parte da aplicação muda quando a URL muda, em vez de os usuários sentirem que a página inteira está sendo atualizada.

Esses tipos de routes aninhadas são chamadas de routes filhas. Isso significa que você está adicionando um segundo `<router-outlet>` à sua aplicação, porque ele é adicional ao `<router-outlet>` no AppComponent.

Neste exemplo, o component `Settings` exibirá o painel desejado com base no que o usuário selecionar. Uma das coisas únicas que você notará sobre routes filhas é que o component frequentemente tem seu próprio `<nav>` e `<router-outlet>`.

```angular-html
<h1>Settings</h1>
<nav>
  <ul>
    <li><a routerLink="profile">Profile</a></li>
    <li><a routerLink="security">Security</a></li>
  </ul>
</nav>
<router-outlet />
```

Uma route filha é como qualquer outra route, pois precisa tanto de um `path` quanto de um `component`. A única diferença é que você coloca routes filhas em um array children dentro da route pai.

```ts
const routes: Routes = [
  {
    path: 'settings-component',
    component: SettingsComponent, // this is the component with the <router-outlet> in the template
    children: [
      {
        path: 'profile', // child route path
        component: ProfileComponent, // child route component that the router renders
      },
      {
        path: 'security',
        component: SecurityComponent, // another child route component that the router renders
      },
    ],
  },
];
```

Uma vez que tanto as `routes` quanto o `<router-outlet>` estejam configurados corretamente, sua aplicação agora está usando routes aninhadas!

## Routes secundárias com outlets nomeados

Páginas podem ter múltiplos outlets— você pode atribuir um nome a cada outlet para especificar qual conteúdo pertence a qual outlet.

```angular-html
<app-header />
<router-outlet />
<router-outlet name='read-more' />
<router-outlet name='additional-actions' />
<app-footer />
```

Cada outlet deve ter um nome único. O nome não pode ser definido ou alterado dinamicamente. Por padrão, o nome é `'primary'`.

O Angular corresponde o nome do outlet à propriedade `outlet` definida em cada route:

```ts
{
  path: 'user/:id',
  component: UserDetails,
  outlet: 'additional-actions'
}
```

## Eventos de ciclo de vida do outlet

Existem quatro eventos de ciclo de vida que um router outlet pode emitir:

| Event        | Description                                                                 |
| ------------ | --------------------------------------------------------------------------- |
| `activate`   | Quando um novo component é instanciado                                     |
| `deactivate` | Quando um component é destruído                                            |
| `attach`     | Quando o `RouteReuseStrategy` instrui o outlet a anexar a subárvore        |
| `detach`     | Quando o `RouteReuseStrategy` instrui o outlet a desanexar a subárvore     |

Você pode adicionar event listeners com a sintaxe padrão de event binding:

```angular-html
<router-outlet
  (activate)='onActivate($event)'
  (deactivate)='onDeactivate($event)'
  (attach)='onAttach($event)'
  (detach)='onDetach($event)'
/>
```

Confira a [documentação da API para RouterOutlet](/api/router/RouterOutlet?tab=api) se você quiser saber mais.

## Passando dados contextuais para components roteados

Passar dados contextuais para components roteados frequentemente requer estado global ou configurações de route complicadas. Para facilitar isso, cada `RouterOutlet` suporta um input `routerOutletData`. Components roteados e seus filhos podem ler esses dados como um signal usando o token de injeção `ROUTER_OUTLET_DATA`, permitindo configuração específica do outlet sem modificar definições de route.

```angular-ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet],
  template: `
    <h2>Dashboard</h2>
    <router-outlet [routerOutletData]="{ layout: 'sidebar' }" />
  `,
})
export class DashboardComponent {}
```

O component roteado pode injetar os dados do outlet fornecidos usando `ROUTER_OUTLET_DATA`:

```angular-ts
import { Component, inject } from '@angular/core';
import { ROUTER_OUTLET_DATA } from '@angular/router';

@Component({
  selector: 'app-stats',
  template: `<p>Stats view (layout: {{ outletData().layout }})</p>`,
})
export class StatsComponent {
  outletData = inject(ROUTER_OUTLET_DATA) as Signal<{ layout: string }>;
}
```

Quando o Angular ativa o `StatsComponent` nesse outlet, ele recebe `{ layout: 'sidebar' }` como dados injetados.

NOTA: Quando o input `routerOutletData` não está definido, o valor injetado é null por padrão.

---

## Próximos passos

Aprenda como [navegar para routes](/guide/routing/navigate-to-routes) com o Angular Router.
