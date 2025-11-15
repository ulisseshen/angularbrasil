<!-- ia-translate: true -->
# Definir routes

Routes servem como blocos de construção fundamentais para navegação dentro de uma aplicação Angular.

## O que são routes?

No Angular, uma **route** é um objeto que define qual component deve ser renderizado para um caminho ou padrão de URL específico, bem como opções de configuração adicionais sobre o que acontece quando um usuário navega para aquela URL.

Aqui está um exemplo básico de uma route:

```ts
import { AdminPage } from './app-admin/app-admin.component';

const adminPage = {
  path: 'admin',
  component: AdminPage
}
```

Para esta route, quando um usuário visita o caminho `/admin`, a aplicação exibirá o component `AdminPage`.

### Gerenciando routes em sua aplicação

A maioria dos projetos define routes em um arquivo separado que contém `routes` no nome do arquivo.

Uma coleção de routes se parece com isto:

```ts
import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page.component';
import { AdminPage } from './about-page/admin-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'admin',
    component: AdminPage,
  },
];
```

Dica: Se você gerou um projeto com o Angular CLI, suas routes são definidas em `src/app/app.routes.ts`.

### Adicionando o router à sua aplicação

Ao fazer bootstrap de uma aplicação Angular sem o Angular CLI, você pode passar um objeto de configuração que inclui um array `providers`.

Dentro do array `providers`, você pode adicionar o router Angular à sua aplicação adicionando uma chamada de função `provideRouter` com suas routes.

```ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // ...
  ]
};
```

## Caminhos de URL de Route

### Caminhos de URL Estáticos

Caminhos de URL estáticos referem-se a routes com caminhos predefinidos que não mudam com base em parâmetros dinâmicos. Estas são routes que correspondem a uma string `path` exatamente e têm um resultado fixo.

Exemplos disso incluem:

- "/admin"
- "/blog"
- "/settings/account"

### Definir Caminhos de URL com Parâmetros de Route

URLs parametrizadas permitem que você defina caminhos dinâmicos que permitem múltiplas URLs para o mesmo component, enquanto exibem dados dinamicamente com base em parâmetros na URL.

Você pode definir este tipo de padrão adicionando parâmetros à string `path` da sua route e prefixando cada parâmetro com o caractere dois-pontos (`:`).

IMPORTANTE: Parâmetros são distintos de informações na [query string](https://en.wikipedia.org/wiki/Query_string) da URL.
Saiba mais sobre [query parameters no Angular neste guia](/guide/routing/read-route-state#query-parameters).

O exemplo a seguir exibe um component de perfil de usuário com base no id do usuário passado através da URL.

```ts
import { Routes } from '@angular/router';
import { UserProfile } from './user-profile/user-profile';

const routes: Routes = [
  { path: 'user/:id', component: UserProfile }
];
```

Neste exemplo, URLs como `/user/leeroy` e `/user/jenkins` renderizam o component `UserProfile`. Este component pode então ler o parâmetro `id` e usá-lo para realizar trabalho adicional, como buscar dados. Veja o [guia de leitura de estado de route](/guide/routing/read-route-state) para detalhes sobre como ler parâmetros de route.

Nomes de parâmetros de route válidos devem começar com uma letra (a-z, A-Z) e podem conter apenas:

- Letras (a-z, A-Z)
- Números (0-9)
- Underscore (\_)
- Hífen (-)

Você também pode definir caminhos com múltiplos parâmetros:

```ts
import { Routes } from '@angular/router';
import { UserProfile } from './user-profile/user-profile.component';
import { SocialMediaFeed } from './user-profile/social–media-feed.component';

const routes: Routes = [
  { path: 'user/:id/:social-media', component: SocialMediaFeed },
  { path: 'user/:id/', component: UserProfile },
];
```

Com este novo caminho, os usuários podem visitar `/user/leeroy/youtube` e `/user/leeroy/bluesky` e ver respectivos feeds de mídia social baseados no parâmetro para o usuário leeroy.

Veja [Lendo estado de route](/guide/routing/read-route-state) para detalhes sobre como ler parâmetros de route.

### Wildcards

Quando você precisa capturar todas as routes para um caminho específico, a solução é uma route wildcard que é definida com o duplo asterisco (`**`).

Um exemplo comum é definir um component de Página Não Encontrada.

```ts
import { Home } from './home/home.component';
import { UserProfile } from './user-profile/user-profile.component';
import { NotFound } from './not-found/not-found.component';

const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'user/:id', component: UserProfile },
  { path: '**', component: NotFound }
];
```

Neste array de routes, a aplicação exibe o component `NotFound` quando o usuário visita qualquer caminho fora de `home` e `user/:id`.

Dica: Routes wildcard são tipicamente colocadas no final de um array de routes.

## Como o Angular corresponde URLs

Quando você define routes, a ordem é importante porque o Angular usa uma estratégia de primeira correspondência ganha. Isso significa que uma vez que o Angular corresponde uma URL com um `path` de route, ele para de verificar quaisquer outras routes. Como resultado, sempre coloque routes mais específicas antes de routes menos específicas.

O exemplo a seguir mostra routes definidas da mais específica para a menos específica:

```ts
const routes: Routes = [
  { path: '', component: HomeComponent },              // Caminho vazio
  { path: 'users/new', component: NewUserComponent },  // Estático, mais específico
  { path: 'users/:id', component: UserDetailComponent }, // Dinâmico
  { path: 'users', component: UsersComponent },        // Estático, menos específico
  { path: '**', component: NotFoundComponent }         // Wildcard - sempre por último
];
```

Se um usuário visita `/users/new`, o router Angular passaria pelos seguintes passos:

1. Verifica `''` - não corresponde
1. Verifica `users/new` - corresponde! Para aqui
1. Nunca alcança `users/:id` mesmo que pudesse corresponder
1. Nunca alcança `users`
1. Nunca alcança `**`

## Estratégias de Carregamento de Component de Route

Entender como e quando components carregam no roteamento Angular é crucial para construir aplicações web responsivas. O Angular oferece duas estratégias principais para controlar o comportamento de carregamento de components:

1. **Carregamento eagerly (imediato)**: Components que são carregados imediatamente
2. **Carregamento lazily (preguiçoso)**: Components carregados apenas quando necessário

Cada abordagem oferece vantagens distintas para diferentes cenários.

### Components carregados eagerly

Quando você define uma route com a propriedade `component`, o component referenciado é carregado eagerly como parte do mesmo bundle JavaScript que a configuração da route.

```ts
import { Routes } from "@angular/router";
import { HomePage } from "./components/home/home-page"
import { LoginPage } from "./components/auth/login-page"

export const routes: Routes = [
  // HomePage e LoginPage são ambos diretamente referenciados nesta config,
  // então seu código é incluído eagerly no mesmo bundle JavaScript que este arquivo.
  {
    path: "",
    component: HomePage
  },
  {
    path: "login",
    component: LoginPage
  }
]
```

Carregar components de route eagerly assim significa que o browser tem que fazer download e analisar todo o JavaScript para estes components como parte do carregamento inicial da página, mas os components estão disponíveis para o Angular imediatamente.

Embora incluir mais JavaScript no carregamento inicial da página leve a tempos de carregamento inicial mais lentos, isso pode levar a transições mais suaves conforme o usuário navega pela aplicação.

### Components carregados lazily

Você pode usar a propriedade `loadComponent` para carregar lazily o JavaScript de uma route apenas no ponto em que aquela route se tornaria ativa.

```ts
import { Routes } from "@angular/router";

export const routes: Routes = [
  // Os components HomePage e LoginPage são carregados lazily no ponto em que
  // suas routes correspondentes se tornam ativas.
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login-page').then(m => m.LoginPage)
  },
  {
    path: '',
    loadComponent: () => import('./components/home/home-page').then(m => m.HomePage)
  }
]
```

A propriedade `loadComponent` aceita uma função loader que retorna uma Promise que resolve para um component Angular. Na maioria dos casos, esta função usa a [API de importação dinâmica padrão do JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import). Você pode, no entanto, usar qualquer função loader assíncrona arbitrária.

Carregar routes lazily pode melhorar significativamente a velocidade de carregamento da sua aplicação Angular removendo grandes porções de JavaScript do bundle inicial. Estas porções do seu código compilam em "chunks" JavaScript separados que o router requisita apenas quando o usuário visita a route correspondente.

### Lazy loading com contexto de injeção

O Router executa `loadComponent` e `loadChildren` dentro do **contexto de injeção da route atual**, permitindo que você chame `inject` dentro destas funções loader para acessar providers declarados naquela route, herdados de routes pai através de injeção de dependência hierárquica, ou disponíveis globalmente. Isso habilita lazy loading consciente do contexto.

```ts
import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { FeatureFlags } from './feature-flags';

export const routes: Routes = [
  {
    path: 'dashboard',
    // Executa dentro do contexto de injeção da route
    loadComponent: () => {
      const flags = inject(FeatureFlags);
      return flags.isPremium
        ? import('./dashboard/premium-dashboard').then(m => m.PremiumDashboard)
        : import('./dashboard/basic-dashboard').then(m => m.BasicDashboard);
    },
  },
];
```

### Devo usar uma route eager ou lazy?

Existem muitos fatores a considerar ao decidir se uma route deve ser eager ou lazy.

Em geral, carregamento eager é recomendado para página(s) de destino primária(s) enquanto outras páginas seriam carregadas lazily.

Nota: Embora routes lazy tenham o benefício de performance inicial de reduzir a quantidade de dados iniciais requisitados pelo usuário, isso adiciona requisições futuras de dados que podem ser indesejáveis. Isso é particularmente verdadeiro ao lidar com lazy loading aninhado em múltiplos níveis, o que pode impactar significativamente a performance.

## Redirecionamentos

Você pode definir uma route que redireciona para outra route em vez de renderizar um component:

```ts
import { BlogComponent } from './home/blog.component';

const routes: Routes = [
  {
    path: 'articles',
    redirectTo: '/blog',
  },
  {
    path: 'blog',
    component: BlogComponent
  },
];
```

Se você modificar ou remover uma route, alguns usuários ainda podem clicar em links desatualizados ou favoritos para aquela route. Você pode adicionar um redirecionamento para direcionar esses usuários para uma route alternativa apropriada em vez de uma página "não encontrada".

## Títulos de página

Você pode associar um **title** com cada route. O Angular atualiza automaticamente o [título da página](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title) quando uma route é ativada. Sempre defina títulos de página apropriados para sua aplicação, pois estes títulos são necessários para criar uma experiência acessível.

```ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ProductsComponent } from './products/products.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home Page'
  },
  {
    path: 'about',
    component: AboutComponent,
    title: 'About Us'
  },
];
```

A propriedade `title` da página pode ser definida dinamicamente para uma função resolver usando [`ResolveFn`](/api/router/ResolveFn).

```ts
const titleResolver: ResolveFn<string> = (route) => route.queryParams['id'];
const routes: Routes = [
   ...
  {
    path: 'products',
    component: ProductsComponent,
    title: titleResolver,
  }
];

```

Títulos de route também podem ser definidos através de um service que estende a classe abstrata [`TitleStrategy`](/api/router/TitleStrategy). Por padrão, o Angular usa a [`DefaultTitleStrategy`](/api/router/DefaultTitleStrategy).

### Usando TitleStrategy para títulos de página

Para cenários avançados onde você precisa de controle centralizado sobre como o título do documento é composto, implemente uma `TitleStrategy`.

`TitleStrategy` é um token que você pode fornecer para sobrescrever a estratégia de título padrão usada pelo Angular. Você pode fornecer uma `TitleStrategy` customizada para implementar convenções como adicionar um sufixo de aplicação, formatar títulos de breadcrumbs, ou gerar títulos dinamicamente a partir de dados de route.

```ts
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TitleStrategy, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AppTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);

  updateTitle(snapshot: RouterStateSnapshot): void {
    // PageTitle é igual ao "Title" de uma route se estiver definido
    // Se não estiver definido, usará o "title" fornecido em index.html
    const pageTitle = this.buildTitle(snapshot) || this.title.getTitle();
    this.title.setTitle(`MyAwesomeApp - ${pageTitle}`);
  }
}
```

Para usar a estratégia customizada, forneça-a com o token `TitleStrategy` no nível da aplicação:

```ts
import { provideRouter, TitleStrategy } from '@angular/router';
import { AppTitleStrategy } from './app-title.strategy';

export const appConfig = {
  providers: [
    provideRouter(routes),
    { provide: TitleStrategy, useClass: AppTitleStrategy },
  ],
};
```

## Providers em nível de route para injeção de dependência

Cada route tem uma propriedade `providers` que permite que você forneça dependências para o conteúdo daquela route via [injeção de dependência](/guide/di).

Cenários comuns onde isso pode ser útil incluem aplicações que têm diferentes services baseados em se o usuário é admin ou não.

```ts
export const ROUTES: Route[] = [
  {
    path: 'admin',
    providers: [
      AdminService,
      {provide: ADMIN_API_KEY, useValue: '12345'},
    ],
    children: [
      {path: 'users', component: AdminUsersComponent},
      {path: 'teams', component: AdminTeamsComponent},
    ],
  },
  // ... outras routes da aplicação que não
  //     têm acesso a ADMIN_API_KEY ou AdminService.
];
```

Neste exemplo de código, o caminho `admin` contém uma propriedade de dados protegida de `ADMIN_API_KEY` que está disponível apenas para filhos dentro de sua seção. Como resultado, nenhum outro caminho será capaz de acessar os dados fornecidos via `ADMIN_API_KEY`.

Veja o [guia de Injeção de dependência](/guide/di) para mais informações sobre providers e injeção no Angular.

## Associando dados com routes

Dados de route permitem que você anexe informações adicionais a routes. Você é capaz de configurar como components se comportam com base nestes dados.

Existem duas maneiras de trabalhar com dados de route: dados estáticos que permanecem constantes, e dados dinâmicos que podem mudar com base em condições de runtime.

### Dados estáticos

Você pode associar dados estáticos arbitrários com uma route via a propriedade `data` a fim de centralizar coisas como metadados específicos de route (ex: rastreamento de analytics, permissões, etc.):

```ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ProductsComponent } from './products/products.component';

const routes: Routes = [
  {
    path: 'about',
    component: AboutComponent,
    data: { analyticsId: '456' }
  },
  {
    path: '',
    component: HomeComponent,
    data: { analyticsId: '123' }
  }
];
```

Neste exemplo de código, as páginas home e about são configuradas com `analyticsId` específico que seria então usado em seus respectivos components para rastreamento de analytics da página.

Você pode ler estes dados estáticos injetando o `ActivatedRoute`. Veja [Lendo estado de route](/guide/routing/read-route-state) para detalhes.

### Dados dinâmicos com resolvers de dados

Quando você precisa fornecer dados dinâmicos para uma route, confira o [guia sobre resolvers de dados de route](/guide/routing/data-resolvers).

## Routes Aninhadas

Routes aninhadas, também conhecidas como routes filhas, são uma técnica comum para gerenciar routes de navegação mais complexas onde um component tem uma sub-visualização que muda com base na URL.

<img alt="Diagrama para ilustrar routes aninhadas" src="assets/images/guide/router/nested-routing-diagram.svg">

Você pode adicionar routes filhas a qualquer definição de route com a propriedade `children`:

```ts
const routes: Routes = [
  {
    path: 'product/:id',
    component: ProductComponent,
    children: [
      {
        path: 'info',
        component: ProductInfoComponent
      },
      {
        path: 'reviews',
        component: ProductReviewsComponent
      }
    ]
  }
]
```

O exemplo acima define uma route para uma página de produto que permite ao usuário mudar se as informações do produto ou reviews são exibidas com base na url.

A propriedade `children` aceita um array de objetos `Route`.

Para exibir routes filhas, o component pai (`ProductComponent` no exemplo acima) inclui seu próprio `<router-outlet>`.

```angular-html
<!-- ProductComponent -->
<article>
  <h1>Product {{ id }}</h1>
  <router-outlet />
</article>
```

Depois de adicionar routes filhas à configuração e adicionar um `<router-outlet>` ao component, a navegação entre URLs que correspondem às routes filhas atualiza apenas o outlet aninhado.

## Próximos passos

Saiba como [exibir o conteúdo de suas routes com Outlets](/guide/routing/show-routes-with-outlets).
