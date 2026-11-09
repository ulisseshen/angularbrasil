<!-- ia-translate: true -->
# Mostrar routes com outlets

A diretiva `RouterOutlet` é um placeholder que marca o local onde o router deve renderizar o component para a URL atual.

```html
<app-header />
<!-- O Angular insere o conteúdo da sua route aqui -->
<router-outlet />
<app-footer />
```

```ts
import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
```

Neste exemplo, se uma aplicação tiver as seguintes routes definidas:

```ts
import {Routes} from '@angular/router';
import {Home} from './home';
import {Products} from './products';

const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Home Page',
  },
  {
    path: 'products',
    component: Products,
    title: 'Our Products',
  },
];
```

Quando um usuário visita `/products`, o Angular renderiza o seguinte:

```angular-html
<app-header />
<app-products />
<app-footer />
```

Se o usuário voltar para a página inicial, então o Angular renderiza:

```angular-html
<app-header />
<app-home />
<app-footer />
```

Ao exibir uma route, o elemento `<router-outlet>` permanece presente no DOM como ponto de referência para navegações futuras. O Angular insere o conteúdo da route logo após o elemento outlet, como um irmão.

```angular-html
<!-- Conteúdo do template do component -->
<app-header />
<router-outlet />
<app-footer />
```

```angular-html
<!-- Conteúdo renderizado na página quando o usuário visita /admin -->
<app-header />
<router-outlet />
<app-admin-page />
<app-footer />
```

## Aninhando routes com child routes {#nesting-routes-with-child-routes}

À medida que sua aplicação fica mais complexa, você pode querer criar routes que sejam relativas a um component diferente do component raiz. Isso permite criar experiências em que apenas parte da aplicação muda quando a URL muda, em vez de o usuário sentir que a página inteira foi recarregada.

Esses tipos de routes aninhadas são chamados de child routes. Isso significa que você está adicionando um segundo `<router-outlet>` à sua aplicação, pois ele se soma ao `<router-outlet>` do AppComponent.

Neste exemplo, o component `Settings` exibirá o painel desejado de acordo com a opção selecionada pelo usuário. Uma das coisas únicas que você notará nas child routes é que o component frequentemente tem seu próprio `<nav>` e `<router-outlet>`.

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

Uma child route é como qualquer outra route, pois precisa tanto de um `path` quanto de um `component`. A única diferença é que você coloca as child routes em um array `children` dentro da route pai.

```ts
const routes: Routes = [
  {
    path: 'settings',
    component: Settings, // este é o component com o <router-outlet> no template
    children: [
      {
        path: 'profile', // caminho da child route
        component: Profile, // component da child route que o router renderiza
      },
      {
        path: 'security',
        component: Security, // outro component de child route que o router renderiza
      },
    ],
  },
];
```

Depois que tanto as `routes` quanto o `<router-outlet>` estiverem configurados corretamente, sua aplicação estará usando routes aninhadas!

## Routes secundárias com outlets nomeados {#secondary-routes-with-named-outlets}

As páginas podem ter múltiplos outlets. Você pode atribuir um nome a cada outlet para especificar qual conteúdo pertence a qual outlet.

```angular-html
<app-header />
<router-outlet />
<router-outlet name="read-more" />
<router-outlet name="additional-actions" />
<app-footer />
```

Cada outlet deve ter um nome único. Você pode vincular o nome a um valor. Quando o valor muda, o outlet destrói o component atual e renderiza a route para o novo nome, caso exista uma correspondente. Por padrão, o nome é `'primary'`.

O Angular faz a correspondência entre o nome do outlet e a propriedade `outlet` definida em cada route:

```ts
{
  path: 'user/:id',
  component: UserDetails,
  outlet: 'additional-actions'
}
```

## Eventos de ciclo de vida do outlet {#outlet-lifecycle-events}

Existem quatro eventos de ciclo de vida que um router outlet pode emitir:

| Evento       | Descrição                                                                          |
| ------------ | ---------------------------------------------------------------------------------- |
| `activate`   | Quando um novo component é instanciado                                             |
| `deactivate` | Quando um component é destruído                                                    |
| `attach`     | Quando o `RouteReuseStrategy` instrui o outlet a anexar a subárvore                |
| `detach`     | Quando o `RouteReuseStrategy` instrui o outlet a desanexar a subárvore             |

Você pode adicionar event listeners com a sintaxe padrão de event binding:

```angular-html
<router-outlet
  (activate)="onActivate($event)"
  (deactivate)="onDeactivate($event)"
  (attach)="onAttach($event)"
  (detach)="onDetach($event)"
/>
```

Confira a [documentação da API do RouterOutlet](/api/router/RouterOutlet?tab=api) se quiser saber mais.

## Passando dados contextuais para components roteados {#passing-contextual-data-to-routed-components}

Passar dados contextuais para components roteados frequentemente exige estado global ou configurações de route complicadas. Para facilitar isso, cada `RouterOutlet` oferece suporte a um input `routerOutletData`. Components roteados e seus filhos podem ler esses dados como um signal usando o token de injeção `ROUTER_OUTLET_DATA`, o que permite configuração específica de cada outlet sem modificar as definições de route.

```angular-ts
import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet],
  template: `
    <h2>Dashboard</h2>
    <router-outlet [routerOutletData]="{layout: 'sidebar'}" />
  `,
})
export class Dashboard {}
```

O component roteado pode injetar os dados do outlet fornecidos usando `ROUTER_OUTLET_DATA`:

```angular-ts
import {Component, inject, Signal} from '@angular/core';
import {ROUTER_OUTLET_DATA} from '@angular/router';

@Component({
  selector: 'app-stats',
  template: `<p>Stats view (layout: {{ outletData().layout }})</p>`,
})
export class Stats {
  outletData = inject(ROUTER_OUTLET_DATA) as Signal<{layout: string}>;
}
```

Quando o Angular ativa o `Stats` nesse outlet, ele recebe `{ layout: 'sidebar' }` como dados injetados.

NOTE: Quando o input `routerOutletData` não está definido, o valor do signal injetado é `undefined` por padrão.

---

## Próximos passos {#next-steps}

Aprenda como [navegar para routes](/guide/routing/navigate-to-routes) com o Angular Router.
