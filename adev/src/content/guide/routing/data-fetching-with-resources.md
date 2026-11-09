<!-- ia-translate: true -->
# Buscando dados com recursos

IMPORTANT: Os recursos de rota estão em [prévia para desenvolvedores](reference/releases#developer-preview).

O Angular Router se integra aos signals do Angular por meio da configuração de rota `resources`. Isso permite buscar dados de forma reativa usando as APIs `Resource`.

## Por que usar recursos de rota? {#why-use-route-resources}

Os recursos de rota oferecem várias vantagens em relação aos [resolvers de dados](/guide/routing/data-resolvers) tradicionais:

- **Execução paralela**: Os recursos de rota de todas as rotas correspondidas são carregados simultaneamente, em vez de uma rota por vez.
- **Carregamento de dados não bloqueante**: Use `nonBlocking()` para ativar a rota imediatamente e renderizar esqueletos de carregamento ou estados de interface enquanto os dados são carregados em segundo plano.
- **Recarregamento sem renavegação**: Chame `.reload()` em recursos individuais ou atualize os parâmetros de signal para atualizar os dados sem executar novamente os guards nem a correspondência de rotas.
- **Busca de dados reativa**: Os recursos se integram diretamente aos signals do Angular, sendo reavaliados automaticamente quando suas dependências de signal mudam, e expõem signals de status reativos, como `isLoading()` e `error()`.

## Habilitando recursos de rota {#enabling-route-resources}

Para habilitar os recursos de rota, forneça `withRouterResources()` na configuração do seu router:

```ts
import {provideRouter, withComponentInputBinding, withRouterResources} from '@angular/router';
import {bootstrapApplication} from '@angular/platform-browser';

bootstrapApplication(App, {
  providers: [provideRouter(routes, withComponentInputBinding(), withRouterResources())],
});
```

TIP: Habilite `withComponentInputBinding()` para que o router possa vincular os recursos resolvidos diretamente aos inputs de componentes.

## Definindo recursos de rota {#defining-route-resources}

Você define recursos em uma rota com a função `resources`. Essa função é executada em um contexto de injeção, então você pode usar `inject()` para acessar serviços, clientes de API ou stores diretamente dentro da definição da rota.

```angular-ts
import {Component, inject, input, resource} from '@angular/core';
import {Routes} from '@angular/router';
import {UserService} from './user.service';

const routes: Routes = [
  {
    path: 'user/:id',
    component: UserProfile,
    resources: (ctx) => {
      const userService = inject(UserService);
      return {
        user: resource({
          params: () => ctx.params()['id'],
          loader: ({params: id}) => userService.getUser(id),
        }),
      };
    },
  },
];

@Component({
  template: `<p>Usuário: {{ user().name }}</p>`,
})
export class UserProfile {
  // O router vincula apenas o valor dos recursos bloqueantes
  user = input.required<User>();
}
```

### O objeto `ResourceContext` {#the-resourcecontext-object}

A função `resources` recebe um `ResourceContext` que fornece:

- Signals de rota: `params`, `queryParams`, `fragment` e `data`.
- `resources`: um signal com os recursos herdados das rotas ancestrais. Veja [Herança de recursos](#resource-inheritance).

### Implementações de recurso suportadas {#supported-resource-implementations}

A função `resources` pode retornar qualquer implementação de `Resource` do Angular, como `resource()`, `rxResource()` ou um recurso customizado.

```ts
import {Routes} from '@angular/router';
import {rxResource} from '@angular/core/rxjs-interop';

const routes: Routes = [
  {
    path: 'user/:id',
    component: UserProfile,
    resources: (ctx) => ({
      user: rxResource({
        params: () => ctx.params()['id'],
        stream: ({params: id}) => fetchUserObservable(id),
      }),
    }),
  },
];
```

NOTE: `rxResource` usa a propriedade `stream` em vez de `loader` para aceitar uma função que retorna um Observable.

A função `resources` também pode ser `async` e retornar uma `Promise`, caso você precise executar uma configuração assíncrona ou importações dinâmicas antes de configurar os recursos:

```ts
resources: async (ctx) => {
  const injector = inject(Injector);
  const {fetchUserData} = await import('./user-api');
  return {
    user: resource({
      params: () => ctx.params()['id'],
      loader: ({params: id}) => fetchUserData(id),
      injector,
    }),
  };
},
```

## Rastreamento de mudanças refinado com signals {#fine-grained-change-tracking-with-signals}

Um recurso rastreia os signals que a sua função `params` lê. Leia exatamente o valor de que você precisa, para que o recurso seja buscado novamente apenas quando esse valor mudar:

```ts
resources: (ctx) => ({
  products: resource({
    // Rastreia apenas o query parameter 'category'
    params: () => ctx.queryParams()['category'],
    loader: ({params: category}) => fetchProducts(category),
  }),
}),
```

Uma navegação que altera um query parameter não relacionado, como `?sort=desc` ou `?page=2`, deixa `category` inalterado, então o recurso não é buscado novamente.

TIP: Leia propriedades específicas, como `ctx.params()['id']`, em vez de retornar o objeto inteiro de parâmetros, como `ctx.params()`. O router cria um novo objeto a cada navegação, então retornar o objeto inteiro faz o recurso ser buscado novamente mesmo quando os valores individuais não mudaram.

## Execução paralela {#parallel-execution}

Os resolvers de dados são executados sequencialmente, do pai para o filho. Se o resolver de uma rota pai levar 200 ms e o de uma rota filha levar 300 ms, a navegação fica bloqueada por 500 ms.

Os recursos de rota ao longo da hierarquia de rotas correspondidas são executados simultaneamente, então a mesma navegação é concluída em 300 ms, o tempo do recurso mais lento. Os recursos que dependem de dados de uma rota ancestral também são configurados imediatamente, em vez de esperar; veja [Encadeando um recurso a partir de um recurso ancestral](#chaining-a-resource-off-an-ancestor-resource).

## Herança de recursos {#resource-inheritance}

Toda rota herda os recursos das suas rotas ancestrais. O Angular expõe esses recursos herdados em duas formas:

| API                                                               | Contém                                           | Comportamento                                                                                                   | Use para                                                              |
| :---------------------------------------------------------------- | :----------------------------------------------- | :-------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------- |
| `ctx.resources()` dentro de uma função `resources`                | Apenas os recursos ancestrais                    | Os recursos brutos retornados pelas funções `resources` ancestrais. O estado deles está sempre ativo.           | Encadear um recurso a partir de um recurso ancestral                  |
| `ActivatedRoute.resources` e `ActivatedRouteSnapshot.resources`   | Os recursos próprios da rota e os recursos ancestrais | Recursos somente leitura gerenciados pelo router. O estado deles fica congelado enquanto uma navegação está pendente. | Ler dados ou chamar `reload()` a partir de um componente, diretiva ou guard |

Se uma rota definir um recurso com o mesmo nome de um recurso ancestral, o recurso próprio da rota sobrescreve (shadows) o herdado.

### Vinculando recursos herdados a inputs de componentes {#binding-inherited-resources-to-component-inputs}

Com `withComponentInputBinding()`, o router vincula tanto os recursos herdados quanto os recursos próprios da rota aos inputs de componentes correspondentes:

```angular-ts
import {Component, input, resource} from '@angular/core';
import {Routes} from '@angular/router';

interface Project {
  id: string;
  name: string;
}

interface Task {
  id: string;
  title: string;
}

const routes: Routes = [
  {
    path: 'projects/:projectId',
    resources: (ctx) => ({
      project: resource({
        params: () => ctx.params()['projectId'],
        loader: ({params: id}) => fetchProject(id),
      }),
    }),
    children: [
      {
        path: 'tasks/:taskId',
        component: TaskDetail,
        resources: (ctx) => ({
          task: resource({
            params: () => ctx.params()['taskId'],
            loader: ({params: id}) => fetchTask(id),
          }),
        }),
      },
    ],
  },
];

@Component({
  template: `
    <h1>Projeto: {{ project().name }}</h1>
    <h2>Tarefa: {{ task().title }}</h2>
  `,
})
export class TaskDetail {
  // Herdado da rota pai 'projects/:projectId'
  project = input.required<Project>();

  // Vinculado a partir do recurso próprio da rota
  task = input.required<Task>();
}
```

NOTE: Quando o router vincula o estado da rota a inputs de componentes, os nomes dos recursos têm precedência sobre os `data` da rota (incluindo os valores resolvidos), os parâmetros de caminho e os query parameters.

### Encadeando um recurso a partir de um recurso ancestral {#chaining-a-resource-off-an-ancestor-resource}

Uma rota filha frequentemente precisa de dados de uma rota ancestral antes de carregar os próprios dados. Em vez de esperar que a rota ancestral termine de carregar, encadeie a função `params` da filha ao recurso ancestral com [`chain()`](/guide/signals/resource#chaining-resources). O Angular passa a todas as funções `params` um objeto de contexto que contém `chain`:

```ts
import {Resource, resource} from '@angular/core';
import {Routes} from '@angular/router';

interface User {
  id: string;
  role: string;
}

const routes: Routes = [
  {
    path: 'user/:id',
    resources: (ctx) => ({
      user: resource({
        params: () => ctx.params()['id'],
        loader: ({params: id}) => fetchUser(id),
      }),
    }),
    children: [
      {
        path: 'details',
        component: UserDetails,
        resources: (ctx) => ({
          details: resource({
            // Mantém o estado de carregamento até que o recurso herdado 'user' seja resolvido
            params: ({chain}) => chain(ctx.resources()['user'] as Resource<User>).role,
            loader: ({params: role}) => fetchRoleDetails(role),
          }),
        }),
      },
    ],
  },
];
```

IMPORTANT: Nunca desestruture nem invoque `ctx.resources()` diretamente no corpo externo da função `resources` (por exemplo, `const {user} = ctx.resources()`). Como as rotas ancestrais são inicializadas em paralelo e isso pode acontecer de forma assíncrona, os recursos ancestrais não estão disponíveis durante a configuração da rota. Chamar `ctx.resources()` de forma síncrona fora de um contexto reativo gera um erro e faz a navegação falhar. Sempre leia `ctx.resources()` de forma reativa dentro da função `params` de um recurso.

NOTE: Como `ctx.resources()` é tipado como um registro de `Resource<unknown>`, converta o recurso herdado para o seu tipo de valor (como `as Resource<User>`) ao lê-lo.

`chain()` também propaga o estado do recurso ancestral. Se o ancestral apresentar erro, o recurso encadeado apresenta erro com um `ResourceDependencyError`, e o router cancela a navegação quando esse recurso encadeado é bloqueante. Se o ancestral estiver `idle`, o recurso encadeado também fica `idle`.

## Recursos bloqueantes e não bloqueantes {#blocking-and-non-blocking-resources}

Por padrão, todo recurso retornado por `resources` é bloqueante: o router espera até que os dados sejam totalmente carregados antes de ativar a rota e o componente.

Para um recurso bloqueante, o router vincula o valor resolvido ao input do componente, então o tipo do input é `T` em vez de `Resource<T>`. O componente nunca observa um estado `loading`, porque o router bloqueia a navegação até que o recurso seja carregado, e nunca observa um estado `error`, porque o router cancela a navegação se o recurso falhar.

Para tratar os estados de carregamento na interface, envolva o recurso em `nonBlocking()`. O router ativa o componente imediatamente e vincula o objeto `Resource<T>` completo ao input do componente, o que dá acesso a `isLoading()`, `error()` e os demais signals do recurso:

```angular-ts
import {Component, input, Resource, resource} from '@angular/core';
import {Routes, nonBlocking} from '@angular/router';

const routes: Routes = [
  {
    path: 'reports',
    component: Reports,
    resources: () => ({
      reportData: nonBlocking(
        resource({
          loader: () => fetchHeavyReportData(),
        }),
      ),
    }),
  },
];

@Component({
  template: `
    @if (reportData().isLoading()) {
      <p>Carregando...</p>
    } @else if (reportData().error()) {
      <p>Erro ao carregar o relatório.</p>
    } @else if (reportData().hasValue()) {
      <report-view [data]="reportData().value()" />
    }
  `,
})
export class Reports {
  reportData = input.required<Resource<ReportData>>();
}
```

NOTE: Se um recurso bloqueante apresentar erro, o router cancela a navegação e emite um evento `NavigationError`. Um recurso envolvido em `nonBlocking()` conclui a navegação e expõe a falha pelo signal `error()`.

### Redirecionando a partir de um recurso {#redirecting-from-a-resource}

Se um recurso bloqueante precisar redirecionar o usuário (por exemplo, quando um item não é encontrado), lance um `RedirectCommand` dentro do loader do recurso. O router cancela a navegação atual e redireciona para a URL especificada:

```ts
import {inject, resource} from '@angular/core';
import {RedirectCommand, Router, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: 'user/:id',
    component: UserProfile,
    resources: (ctx) => {
      const router = inject(Router);

      return {
        user: resource({
          params: () => ctx.params()['id'],
          loader: async ({params: id}) => {
            const user = await fetchUser(id);
            if (!user) {
              throw new RedirectCommand(router.parseUrl('/not-found'));
            }
            return user;
          },
        }),
      };
    },
  },
];
```

## Recarregando recursos sem renavegação {#reloading-resources-without-renavigation}

Com os resolvers de dados, buscar os dados novamente exige uma navegação de rota (por exemplo, navegando com `onSameUrlNavigation: 'reload'`), o que faz as rotas serem correspondidas de novo e os guards e resolvers serem executados novamente.

Os recursos de rota oferecem duas formas de atualizar os dados no próprio lugar:

1. **Recarregamento programático**: Chame `.reload()` na instância de `Resource`.
2. **Recarregamento reativo**: Atualize um signal que a função `params` do recurso lê, como um signal de filtro ou de estado da aplicação, o que executa novamente o loader.

Como o router vincula apenas o valor de um recurso bloqueante a um input de componente, leia a instância de `Resource` a partir de `ActivatedRoute` ou `ActivatedRouteSnapshot` quando precisar chamar `.reload()` ou inspecionar os signals de status:

```angular-ts
import {Component, inject, input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  template: `
    <p>Usuário: {{ user().name }}</p>
    <button (click)="refreshUser()">Atualizar</button>
  `,
})
export class UserProfile {
  user = input.required<User>();
  private userResource = inject(ActivatedRoute).resources?.['user'];

  refreshUser() {
    // Recarrega apenas este recurso específico, sem renavegar a rota
    this.userResource?.reload();
  }
}
```

## Estados transitórios durante navegações pendentes {#transitional-states-during-pending-navigations}

Enquanto uma navegação está pendente, o router congela os recursos que expõe em `ActivatedRoute`, o que mascara os estados intermediários `loading` e `reloading`.

Se você navegar de `/user/1` para `/user/2` e o router reutilizar o componente `UserProfile`, o componente continua exibindo os dados de `/user/1` até que `/user/2` seja resolvido. Em seguida, o router descongela os recursos e a interface passa diretamente para os novos dados, sem um flash de carregamento.

O router expõe esses recursos como somente leitura, mesmo quando a função `resources` retorna um recurso gravável, como `resource()`. Você pode ler os signals do recurso e chamar `reload()`, mas não `set()` nem `update()`. Uma chamada a `reload()` durante uma navegação ativa ou durante a recuperação por rollback retorna `false`, para não interromper o rastreamento de transições do router.

NOTE: O congelamento se aplica apenas aos recursos que o router expõe em `ActivatedRoute`. Os recursos brutos disponíveis em `ctx.resources()` sempre informam o estado ativo, o que permite que um recurso encadeado reaja a um recurso ancestral durante uma navegação.

### Recuperação por rollback no cancelamento {#rollback-recovery-on-cancellation}

Se uma navegação for cancelada (por exemplo, por um guard), o router reverte a árvore de estado para o estado anterior. Essa reversão pode fazer com que as dependências de signal do recurso, como os parâmetros de rota, voltem aos valores anteriores.

Como os parâmetros voltaram, o recurso pode disparar automaticamente um novo carregamento para buscar os dados dos parâmetros antigos. Para evitar exibir um estado de carregamento para dados que já estavam visíveis, o router mantém o snapshot anterior do recurso na interface até que ele se estabilize no estado revertido.

TIP: Repasse o `abortSignal` fornecido pelo loader do recurso às suas chamadas assíncronas (como `fetch`). Quando o router reverte os parâmetros ou substitui navegações, a requisição pendente é abortada de forma limpa: `loader: ({params: id, abortSignal}) => fetchUser(id, {signal: abortSignal})`.
