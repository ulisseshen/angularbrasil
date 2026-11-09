<!-- ia-translate: true -->
# Definindo rotas {#define-routes}

As rotas servem como os blocos de construção fundamentais para a navegação dentro de uma aplicação Angular.

## O que são rotas? {#what-are-routes}

No Angular, uma **rota** é um objeto que define qual componente deve ser renderizado para um caminho ou padrão de URL específico, além de opções de configuração adicionais sobre o que acontece quando um usuário navega para essa URL.

Aqui está um exemplo básico de rota:

```ts
import {AdminPage} from './app-admin';

const adminPage = {
  path: 'admin',
  component: AdminPage,
};
```

Para esta rota, quando um usuário visita o caminho `/admin`, a aplicação exibe o componente `AdminPage`.

### Gerenciando rotas na sua aplicação {#managing-routes-in-your-application}

A maioria dos projetos define as rotas em um arquivo separado que contém `routes` no nome do arquivo.

Uma coleção de rotas tem a seguinte aparência:

```ts
import {Routes} from '@angular/router';
import {HomePage} from './home-page';
import {AdminPage} from './admin-page';

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

TIP: Se você gerou um projeto com o Angular CLI, suas rotas são definidas em `src/app/app.routes.ts`.

### Adicionando o router à sua aplicação {#adding-the-router-to-your-application}

Ao inicializar uma aplicação Angular sem o Angular CLI, você pode passar um objeto de configuração que inclua um array `providers`.

Dentro do array `providers`, você pode adicionar o Angular router à sua aplicação incluindo uma chamada à função `provideRouter` com as suas rotas.

```ts
import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // ...
  ],
};
```

## Caminhos de URL das rotas {#route-url-paths}

### Caminhos de URL estáticos {#static-url-paths}

Os caminhos de URL estáticos são rotas com caminhos predefinidos que não mudam com base em parâmetros dinâmicos. São rotas que correspondem exatamente a uma string `path` e têm um resultado fixo.

Exemplos disso incluem:

- "/admin"
- "/blog"
- "/settings/account"

### Definindo caminhos de URL com parâmetros de rota {#define-url-paths-with-route-parameters}

As URLs parametrizadas permitem definir caminhos dinâmicos que possibilitam várias URLs para o mesmo componente, exibindo dados de forma dinâmica com base nos parâmetros da URL.

Você pode definir esse tipo de padrão adicionando parâmetros à string `path` da sua rota e prefixando cada parâmetro com o caractere dois-pontos (`:`).

IMPORTANT: Parâmetros são diferentes das informações contidas na [query string](https://en.wikipedia.org/wiki/Query_string) da URL.
Saiba mais sobre [parâmetros de consulta no Angular neste guia](/guide/routing/read-route-state#query-parameters).

O exemplo a seguir exibe um componente de perfil de usuário com base no id do usuário passado pela URL.

```ts
import {Routes} from '@angular/router';
import {UserProfile} from './user-profile/user-profile';

const routes: Routes = [{path: 'user/:id', component: UserProfile}];
```

Neste exemplo, URLs como `/user/leeroy` e `/user/jenkins` renderizam o componente `UserProfile`. Esse componente pode então ler o parâmetro `id` e usá-lo para realizar trabalho adicional, como buscar dados. Veja o [guia de leitura do estado de rotas](/guide/routing/read-route-state) para detalhes sobre como ler os parâmetros de rota.

Nomes de parâmetros de rota válidos devem começar com uma letra (a-z, A-Z) e podem conter apenas:

- Letras (a-z, A-Z)
- Números (0-9)
- Underscore (\_)
- Hífen (-)

Você também pode definir caminhos com múltiplos parâmetros:

```ts
import {Routes} from '@angular/router';
import {UserProfile} from './user-profile';
import {SocialMediaFeed} from './social-media-feed';

const routes: Routes = [
  {path: 'user/:id/:social-media', component: SocialMediaFeed},
  {path: 'user/:id', component: UserProfile},
];
```

Com este novo caminho, os usuários podem visitar `/user/leeroy/youtube` e `/user/leeroy/bluesky` e ver os respectivos feeds de redes sociais com base no parâmetro do usuário leeroy.

Veja [Lendo o estado de rotas](/guide/routing/read-route-state) para detalhes sobre como ler os parâmetros de rota.

### Curingas {#wildcards}

Quando você precisa capturar todas as rotas de um caminho específico, a solução é uma rota curinga, definida com o asterisco duplo (`**`).

Um exemplo comum é definir um componente de Página não encontrada.

```ts
import {Routes} from '@angular/router';
import {Home} from './home/home';
import {UserProfile} from './user-profile';
import {NotFound} from './not-found';

const routes: Routes = [
  {path: 'home', component: Home},
  {path: 'user/:id', component: UserProfile},
  {path: '**', component: NotFound},
];
```

Neste array de rotas, a aplicação exibe o componente `NotFound` quando o usuário visita qualquer caminho fora de `home` e `user/:id`.

TIP: As rotas curinga geralmente são colocadas no final de um array de rotas.

## Como o Angular corresponde às URLs {#how-angular-matches-urls}

Ao definir rotas, a ordem é importante, porque o Angular usa uma estratégia de primeira correspondência vence. Isso significa que, assim que o Angular corresponde uma URL a um `path` de rota, ele deixa de verificar as demais rotas. Por isso, sempre coloque as rotas mais específicas antes das menos específicas.

O exemplo a seguir mostra rotas definidas da mais específica para a menos específica:

```ts
const routes: Routes = [
  {path: '', component: Home}, // Caminho vazio
  {path: 'users/new', component: NewUser}, // Estático, mais específico
  {path: 'users/:id', component: UserDetail}, // Dinâmico
  {path: 'users', component: Users}, // Estático, menos específico
  {path: '**', component: NotFound}, // Curinga - sempre por último
];
```

Se um usuário visita `/users/new`, o router do Angular passaria pelas seguintes etapas:

1. Verifica `''` - não corresponde
1. Verifica `users/new` - corresponde! Para aqui
1. Nunca alcança `users/:id`, mesmo que ela pudesse corresponder
1. Nunca alcança `users`
1. Nunca alcança `**`

## Redirecionamentos {#redirects}

Você pode definir uma rota que redireciona para outra rota em vez de renderizar um componente:

```ts
import {Routes} from '@angular/router';
import {Blog} from './home/blog';

const routes: Routes = [
  {
    path: 'articles',
    redirectTo: '/blog',
  },
  {
    path: 'blog',
    component: Blog,
  },
];
```

Se você modificar ou remover uma rota, alguns usuários ainda podem clicar em links desatualizados ou em favoritos para essa rota. Você pode adicionar um redirecionamento para levar esses usuários a uma rota alternativa apropriada, em vez de uma página "não encontrada".

## Títulos de página {#page-titles}

Você pode associar um **título** a cada rota. O Angular atualiza automaticamente o [título da página](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title) quando uma rota é ativada. Sempre defina títulos de página apropriados para a sua aplicação, pois eles são necessários para criar uma experiência acessível.

```ts
import {Routes} from '@angular/router';
import {Home} from './home';
import {About} from './about';
import {Products} from './products';

const routes: Routes = [
  {
    path: '',
    component: Home,
    title: 'Página inicial',
  },
  {
    path: 'about',
    component: About,
    title: 'Sobre nós',
  },
];
```

A propriedade `title` da página pode ser definida dinamicamente com uma função resolver, usando [`ResolveFn`](/api/router/ResolveFn).

```ts
const titleResolver: ResolveFn<string> = (route) => route.queryParams['id'];
const routes: Routes = [
  // ...
  {
    path: 'products',
    component: Products,
    title: titleResolver,
  },
];
```

Os títulos de rota também podem ser definidos por meio de um serviço que estende a classe abstrata [`TitleStrategy`](/api/router/TitleStrategy). Por padrão, o Angular usa a [`DefaultTitleStrategy`](/api/router/DefaultTitleStrategy).

### Usando TitleStrategy para títulos de página {#using-titlestrategy-for-page-titles}

Para cenários avançados em que você precisa de controle centralizado sobre como o título do documento é composto, implemente uma `TitleStrategy`.

`TitleStrategy` é um token que você pode fornecer para substituir a estratégia de título padrão usada pelo Angular. Você pode fornecer uma `TitleStrategy` customizada para implementar convenções como adicionar um sufixo com o nome da aplicação, formatar títulos a partir de breadcrumbs ou gerar títulos dinamicamente a partir dos dados da rota.

```ts
import {inject, Injectable} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {TitleStrategy, RouterStateSnapshot} from '@angular/router';

@Injectable()
export class AppTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);

  updateTitle(snapshot: RouterStateSnapshot): void {
    // O PageTitle é igual ao "Title" da rota, se ele estiver definido
    // Se não estiver definido, usará o "title" fornecido em index.html
    const pageTitle = this.buildTitle(snapshot) || this.title.getTitle();
    this.title.setTitle(`MyAwesomeApp - ${pageTitle}`);
  }
}
```

Para usar a estratégia customizada, forneça-a com o token `TitleStrategy` no nível da aplicação:

```ts
import {provideRouter, TitleStrategy} from '@angular/router';
import {AppTitleStrategy} from './app-title.strategy';

export const appConfig = {
  providers: [provideRouter(routes), {provide: TitleStrategy, useClass: AppTitleStrategy}],
};
```

## Providers em nível de rota para injeção de dependência {#route-level-providers-for-dependency-injection}

Cada rota tem uma propriedade `providers` que permite fornecer dependências para o conteúdo dessa rota por meio da [injeção de dependência](/guide/di).

Cenários comuns em que isso pode ser útil incluem aplicações que têm serviços diferentes dependendo de o usuário ser administrador ou não.

```ts
export const ROUTES: Route[] = [
  {
    path: 'admin',
    providers: [AdminService, {provide: ADMIN_API_KEY, useValue: '12345'}],
    children: [
      {path: 'users', component: AdminUsers},
      {path: 'teams', component: AdminTeams},
    ],
  },
  // ... outras rotas da aplicação que não
  //     têm acesso a ADMIN_API_KEY ou AdminService.
];
```

Neste exemplo de código, o caminho `admin` contém um dado protegido, `ADMIN_API_KEY`, que fica disponível apenas para os filhos dentro da sua seção. Como resultado, nenhum outro caminho consegue acessar os dados fornecidos por meio de `ADMIN_API_KEY`.

Veja o [guia de injeção de dependência](/guide/di) para mais informações sobre providers e injeção no Angular.

## Associando dados às rotas {#associating-data-with-routes}

Os dados de rota permitem anexar informações adicionais às rotas. Você consegue configurar como os componentes se comportam com base nesses dados.

Há duas formas de trabalhar com dados de rota: dados estáticos, que permanecem constantes, e dados dinâmicos, que podem mudar de acordo com as condições de runtime.

### Dados estáticos {#static-data}

Você pode associar dados estáticos arbitrários a uma rota por meio da propriedade `data`, a fim de centralizar informações como metadados específicos da rota (por exemplo, rastreamento de analytics, permissões etc.):

```ts
import {Routes} from '@angular/router';
import {Home} from './home';
import {About} from './about';
import {Products} from './products';

const routes: Routes = [
  {
    path: 'about',
    component: About,
    data: {analyticsId: '456'},
  },
  {
    path: '',
    component: Home,
    data: {analyticsId: '123'},
  },
];
```

Neste exemplo de código, as páginas inicial e about são configuradas com um `analyticsId` específico, que seria usado nos respectivos componentes para o rastreamento de analytics da página.

Você pode ler esses dados estáticos injetando o `ActivatedRoute`. Veja [Lendo o estado de rotas](/guide/routing/read-route-state) para detalhes.

### Dados dinâmicos com recursos e resolvers {#dynamic-data-with-resources-and-resolvers}

Quando você precisa buscar dados para uma rota, o Angular Router oferece suporte tanto a recursos de rota reativos quanto a resolvers de dados:

- [Busca de dados com recursos](/guide/routing/data-fetching-with-resources): Busca dados de forma reativa usando as APIs `Resource` dos Angular Signals.
- [Resolvers de dados de rota](/guide/routing/data-resolvers): Busca dados antes da ativação da rota, usando funções resolver.

## Rotas aninhadas {#nested-routes}

As rotas aninhadas, também conhecidas como rotas filhas, são uma técnica comum para gerenciar rotas de navegação mais complexas, nas quais um componente tem uma subvisualização que muda de acordo com a URL.

<img alt="Diagrama para ilustrar rotas aninhadas" src="assets/images/guide/router/nested-routing-diagram.svg">

Você pode adicionar rotas filhas a qualquer definição de rota com a propriedade `children`:

```ts
const routes: Routes = [
  {
    path: 'product/:id',
    component: Product,
    children: [
      {
        path: 'info',
        component: ProductInfo,
      },
      {
        path: 'reviews',
        component: ProductReviews,
      },
    ],
  },
];
```

O exemplo acima define uma rota para uma página de produto que permite ao usuário alternar entre a exibição das informações do produto e das avaliações, com base na URL.

A propriedade `children` aceita um array de objetos `Route`.

Para exibir as rotas filhas, o componente pai (`Product`, no exemplo acima) inclui o seu próprio `<router-outlet>`.

```angular-html
<!-- Product -->
<article>
  <h1>Produto {{ id }}</h1>
  <router-outlet />
</article>
```

Depois de adicionar as rotas filhas à configuração e um `<router-outlet>` ao componente, a navegação entre as URLs que correspondem às rotas filhas atualiza apenas o outlet aninhado.

## Próximos passos {#next-steps}

<docs-pill-row>
  <docs-pill href="/guide/routing/loading-strategies" title="Estratégias de carregamento de rotas"/>
  <docs-pill href="/guide/routing/show-routes-with-outlets" title="Exibindo o conteúdo das suas rotas com outlets"/>
</docs-pill-row>
