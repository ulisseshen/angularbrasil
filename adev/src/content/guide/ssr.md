<!-- ia-translate: true -->

# Renderização server e hybrid

O Angular entrega todas as aplicações como client-side rendered (CSR) por padrão. Embora essa abordagem forneça um payload inicial leve, ela introduz trade-offs incluindo tempos de carregamento mais lentos, métricas de desempenho degradadas e maiores demandas de recursos, já que o dispositivo do usuário executa a maioria dos cálculos. Como resultado, muitas aplicações alcançam melhorias significativas de desempenho ao integrar server-side rendering (SSR) em uma estratégia de hybrid rendering.

## O que é hybrid rendering?

Hybrid rendering permite que desenvolvedores aproveitem os benefícios de server-side rendering (SSR), pré-renderização (também conhecida como "static site generation" ou SSG) e client-side rendering (CSR) para otimizar sua aplicação Angular. Isso dá a você controle refinado sobre como as diferentes partes da sua aplicação são renderizadas para dar aos seus usuários a melhor experiência possível.

## Configurando hybrid rendering

Você pode criar um **novo** projeto com hybrid rendering usando a flag server-side rendering (ou seja, `--ssr`) com o comando `ng new` do Angular CLI:

```shell
ng new --ssr
```

Você também pode habilitar hybrid rendering adicionando server-side rendering a um projeto existente com o comando `ng add`:

```shell
ng add @angular/ssr
```

NOTE: Por padrão, o Angular pré-renderiza toda a sua aplicação e gera um arquivo de servidor. Para desabilitar isso e criar uma aplicação totalmente estática, defina `outputMode` como `static`. Para habilitar SSR, atualize as rotas do servidor para usar `RenderMode.Server`. Para mais detalhes, consulte [`Server routing`](#server-routing) e [`Generate a fully static application`](#generate-a-fully-static-application).

## Server routing

### Configurando rotas de servidor

Você pode criar uma configuração de rota de servidor declarando um array de objetos [`ServerRoute`](api/ssr/ServerRoute 'API reference'). Esta configuração normalmente fica em um arquivo chamado `app.routes.server.ts`.

```typescript
// app.routes.server.ts
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '', // Isso renderiza a rota "/" no cliente (CSR)
    renderMode: RenderMode.Client,
  },
  {
    path: 'about', // Esta página é estática, então nós pré-renderizamos (SSG)
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'profile', // Esta página requer dados específicos do usuário, então usamos SSR
    renderMode: RenderMode.Server,
  },
  {
    path: '**', // Todas as outras rotas serão renderizadas no servidor (SSR)
    renderMode: RenderMode.Server,
  },
];
```

Você pode adicionar essa configuração à sua aplicação com [`provideServerRendering`](api/ssr/provideServerRendering 'API reference') usando a função [`withRoutes`](api/ssr/withRoutes 'API reference'):

```typescript
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { serverRoutes } from './app.routes.server';

// app.config.server.ts
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    // ... outros providers ...
  ]
};
```

Ao usar o [App shell pattern](ecosystem/service-workers/app-shell), você deve especificar o component a ser usado como app shell para rotas renderizadas client-side. Para fazer isso, use a feature [`withAppShell`](api/ssr/withAppShell 'API reference'):

```typescript
import { provideServerRendering, withRoutes, withAppShell } from '@angular/ssr';
import { AppShellComponent } from './app-shell/app-shell.component';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(
      withRoutes(serverRoutes),
      withAppShell(AppShellComponent),
    ),
    // ... outros providers ...
  ]
};
```

### Modos de renderização

A configuração de server routing permite que você especifique como cada rota na sua aplicação deve renderizar definindo um [`RenderMode`](api/ssr/RenderMode 'API reference'):

| Modo de renderização | Descrição                                                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Server (SSR)**     | Renderiza a aplicação no servidor para cada requisição, enviando uma página HTML totalmente populada ao navegador. |
| **Client (CSR)**     | Renderiza a aplicação no navegador. Este é o comportamento padrão do Angular.                                      |
| **Prerender (SSG)**  | Pré-renderiza a aplicação em build time, gerando arquivos HTML estáticos para cada rota.                           |

#### Escolhendo um modo de renderização

Cada modo de renderização tem diferentes benefícios e desvantagens. Você pode escolher modos de renderização baseados nas necessidades específicas da sua aplicação.

##### Client-side rendering (CSR)

Client-side rendering tem o modelo de desenvolvimento mais simples, já que você pode escrever código que assume que sempre executa em um navegador web. Isso permite que você use uma ampla gama de bibliotecas client-side que também assumem que executam em um navegador.

Client-side rendering geralmente tem pior desempenho do que outros modos de renderização, pois deve baixar, analisar e executar o JavaScript da sua página antes que o usuário possa ver qualquer conteúdo renderizado. Se sua página busca mais dados do servidor enquanto renderiza, os usuários também têm que esperar por essas requisições adicionais antes que possam visualizar o conteúdo completo.

Se sua página é indexada por rastreadores de busca, client-side rendering pode afetar negativamente a otimização para mecanismos de busca (SEO), já que rastreadores de busca têm limites de quanto JavaScript eles executam ao indexar uma página.

Ao usar client-side rendering, o servidor não precisa fazer nenhum trabalho para renderizar uma página além de servir assets JavaScript estáticos. Você pode considerar esse fator se o custo do servidor é uma preocupação.

Aplicações que suportam experiências instaláveis e offline com [service workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) podem depender de client-side rendering sem precisar se comunicar com um servidor.

##### Server-side rendering (SSR)

Server-side rendering oferece carregamentos de página mais rápidos do que client-side rendering. Em vez de esperar que o JavaScript baixe e execute, o servidor renderiza diretamente um documento HTML ao receber uma requisição do navegador. O usuário experimenta apenas a latência necessária para o servidor buscar dados e renderizar a página solicitada. Este modo também elimina a necessidade de requisições de rede adicionais do navegador, já que seu código pode buscar dados durante a renderização no servidor.

Server-side rendering geralmente tem excelente otimização para mecanismos de busca (SEO), já que rastreadores de busca recebem um documento HTML totalmente renderizado.

Server-side rendering requer que você escreva código que não dependa estritamente de APIs do navegador e limita sua seleção de bibliotecas JavaScript que assumem que executam em um navegador.

Ao usar server-side rendering, seu servidor executa Angular para produzir uma resposta HTML para cada requisição, o que pode aumentar os custos de hospedagem do servidor.

##### Pré-renderização em build-time

Pré-renderização oferece carregamentos de página mais rápidos do que tanto client-side rendering quanto server-side rendering. Como a pré-renderização cria documentos HTML em _build-time_, o servidor pode responder diretamente a requisições com o documento HTML estático sem nenhum trabalho adicional.

Pré-renderização requer que todas as informações necessárias para renderizar uma página estejam disponíveis em _build-time_. Isso significa que páginas pré-renderizadas não podem incluir quaisquer dados específicos do usuário que está carregando a página. Pré-renderização é principalmente útil para páginas que são as mesmas para todos os usuários da sua aplicação.

Como a pré-renderização ocorre em build-time, ela pode adicionar tempo significativo aos seus builds de produção. Usar [`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference') para produzir um grande número de documentos HTML pode afetar o tamanho total do arquivo dos seus deployments, e assim levar a deployments mais lentos.

Pré-renderização geralmente tem excelente otimização para mecanismos de busca (SEO), já que rastreadores de busca recebem um documento HTML totalmente renderizado.

Pré-renderização requer que você escreva código que não dependa estritamente de APIs do navegador e limita sua seleção de bibliotecas JavaScript que assumem que executam em um navegador.

Pré-renderização incorre em sobrecarga extremamente pequena por requisição de servidor, já que seu servidor responde com documentos HTML estáticos. Arquivos estáticos também são facilmente armazenados em cache por Content Delivery Networks (CDNs), navegadores e camadas de cache intermediárias para carregamentos de página subsequentes ainda mais rápidos. Sites totalmente estáticos também podem ser deployados exclusivamente através de um CDN ou servidor de arquivos estáticos, eliminando a necessidade de manter um runtime de servidor customizado para sua aplicação. Isso melhora a escalabilidade ao transferir trabalho de um servidor web de aplicação, tornando-o particularmente benéfico para aplicações de alto tráfego.

NOTE: Ao usar Angular service worker, a primeira requisição é renderizada no servidor, mas todas as requisições subsequentes são manipuladas pelo service worker e renderizadas client-side.

### Definindo headers e status codes

Você pode definir headers e status codes customizados para rotas de servidor individuais usando as propriedades `headers` e `status` na configuração `ServerRoute`.

```typescript
// app.routes.server.ts
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'profile',
    renderMode: RenderMode.Server,
    headers: {
      'X-My-Custom-Header': 'some-value',
    },
    status: 201,
  },
  // ... outras rotas
];
```

### Redirects

O Angular manipula redirects especificados pela propriedade [`redirectTo`](api/router/Route#redirectTo 'API reference') em configurações de rota, de forma diferente no lado do servidor.

**Server-Side Rendering (SSR)**
Redirects são executados usando redirects HTTP padrão (por exemplo, 301, 302) dentro do processo de server-side rendering.

**Pré-renderização (SSG)**
Redirects são implementados como "soft redirects" usando tags [`<meta http-equiv="refresh">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#refresh) no HTML pré-renderizado.

### Customizando pré-renderização em build-time (SSG)

Ao usar [`RenderMode.Prerender`](api/ssr/RenderMode#Prerender 'API reference'), você pode especificar várias opções de configuração para customizar o processo de pré-renderização e serving.

#### Rotas parametrizadas

Para cada rota com [`RenderMode.Prerender`](api/ssr/RenderMode#Prerender 'API reference'), você pode especificar uma função [`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference'). Esta função permite que você controle quais parâmetros específicos produzem documentos pré-renderizados separados.

A função [`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference') retorna uma `Promise` que resolve para um array de objetos. Cada objeto é um mapa chave-valor de nome de parâmetro de rota para valor. Por exemplo, se você definir uma rota como `post/:id`, `getPrerenderParams` poderia retornar o array `[{id: 123}, {id: 456}]`, e assim renderizar documentos separados para `post/123` e `post/456`.

O corpo de [`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference') pode usar a função [`inject`](api/core/inject 'API reference') do Angular para injetar dependências e executar qualquer trabalho para determinar quais rotas pré-renderizar. Isso normalmente inclui fazer requisições para buscar dados para construir o array de valores de parâmetros.

Você também pode usar essa função com rotas catch-all (por exemplo, `/**`), onde o nome do parâmetro será `"**"` e o valor de retorno será os segmentos do caminho, como `foo/bar`. Estes podem ser combinados com outros parâmetros (por exemplo, `/post/:id/**`) para lidar com configurações de rota mais complexas.

```ts
// app.routes.server.ts
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'post/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const dataService = inject(PostService);
      const ids = await dataService.getIds(); // Assumindo que isso retorna ['1', '2', '3']

      return ids.map(id => ({ id })); // Gera caminhos como: /post/1, /post/2, /post/3
    },
  },
  {
    path: 'post/:id/**',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return [
        { id: '1', '**': 'foo/3' },
        { id: '2', '**': 'bar/4' },
      ]; // Gera caminhos como: /post/1/foo/3, /post/2/bar/4
    },
  },
];
```

Como [`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference') se aplica exclusivamente a [`RenderMode.Prerender`](api/ssr/RenderMode#Prerender 'API reference'), essa função sempre executa em _build-time_. `getPrerenderParams` não deve depender de quaisquer APIs específicas do navegador ou do servidor para dados.

IMPORTANT: Ao usar [`inject`](api/core/inject 'API reference') dentro de `getPrerenderParams`, lembre-se de que `inject` deve ser usado de forma síncrona. Ele não pode ser invocado dentro de callbacks assíncronos ou seguindo quaisquer declarações `await`. Para mais informações, consulte [`runInInjectionContext`](api/core/runInInjectionContext).

#### Estratégias de fallback

Ao usar o modo [`RenderMode.Prerender`](api/ssr/RenderMode#Prerender 'API reference'), você pode especificar uma estratégia de fallback para lidar com requisições para caminhos que não foram pré-renderizados.

As estratégias de fallback disponíveis são:

- **Server:** Volta para server-side rendering. Este é o comportamento **padrão** se nenhuma propriedade `fallback` for especificada.
- **Client:** Volta para client-side rendering.
- **None:** Nenhum fallback. O Angular não manipulará requisições para caminhos que não estão pré-renderizados.

```typescript
// app.routes.server.ts
import { RenderMode, PrerenderFallback, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'post/:id',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Client, // Fallback para CSR se não pré-renderizado
    async getPrerenderParams() {
      // Esta função retorna um array de objetos representando posts pré-renderizados nos caminhos:
      // `/post/1`, `/post/2`, e `/post/3`.
      // O caminho `/post/4` utilizará o comportamento de fallback se for requisitado.
      return [{ id: 1 }, { id: 2 }, { id: 3 }];
    },
  },
];
```

## Escrevendo components compatíveis com servidor

Algumas APIs e capacidades comuns do navegador podem não estar disponíveis no servidor. Aplicações não podem usar objetos globais específicos do navegador como `window`, `document`, `navigator` ou `location`, bem como certas propriedades de `HTMLElement`.

Em geral, código que depende de símbolos específicos do navegador só deve ser executado no navegador, não no servidor. Isso pode ser forçado através dos lifecycle hooks [`afterEveryRender`](api/core/afterEveryRender) e [`afterNextRender`](api/core/afterNextRender). Estes são executados apenas no navegador e pulados no servidor.

```angular-ts
import { Component, ViewChild, afterNextRender } from '@angular/core';

@Component({
  selector: 'my-cmp',
  template: `<span #content>{{ ... }}</span>`,
})
export class MyComponent {
  @ViewChild('content') contentRef: ElementRef;

  constructor() {
    afterNextRender(() => {
      // Seguro verificar `scrollHeight` porque isso só executará no navegador, não no servidor.
      console.log('content height: ' + this.contentRef.nativeElement.scrollHeight);
    });
  }
}
```

## Definindo providers no servidor

No lado do servidor, valores de provider de nível superior são definidos uma vez quando o código da aplicação é inicialmente analisado e avaliado.
Isso significa que providers configurados com `useValue` manterão seu valor através de múltiplas requisições, até que a aplicação do servidor seja reiniciada.

Se você quiser gerar um novo valor para cada requisição, use um factory provider com `useFactory`. A função factory será executada para cada requisição recebida, garantindo que um novo valor seja criado e atribuído ao token a cada vez.

## Acessando Request e Response via DI

O pacote `@angular/core` fornece vários tokens para interagir com o ambiente de server-side rendering. Esses tokens dão acesso a informações e objetos cruciais dentro da sua aplicação Angular durante SSR.

- **[`REQUEST`](api/core/REQUEST 'API reference'):** Fornece acesso ao objeto de requisição atual, que é do tipo [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) da Web API. Isso permite que você acesse headers, cookies e outras informações de requisição.
- **[`RESPONSE_INIT`](api/core/RESPONSE_INIT 'API reference'):** Fornece acesso às opções de inicialização de resposta, que é do tipo [`ResponseInit`](https://developer.mozilla.org/en-US/docs/Web/API/Response/Response#parameters) da Web API. Isso permite que você defina headers e o status code para a resposta dinamicamente. Use este token para definir headers ou status codes que precisam ser determinados em runtime.
- **[`REQUEST_CONTEXT`](api/core/REQUEST_CONTEXT 'API reference'):** Fornece acesso a contexto adicional relacionado à requisição atual. Este contexto pode ser passado como o segundo parâmetro da função [`handle`](api/ssr/AngularAppEngine#handle 'API reference'). Tipicamente, isso é usado para fornecer informações adicionais relacionadas à requisição que não fazem parte da Web API padrão.

```angular-ts
import { inject, REQUEST } from '@angular/core';

@Component({
  selector: 'app-my-component',
  template: `<h1>My Component</h1>`,
})
export class MyComponent {
  constructor() {
    const request = inject(REQUEST);
    console.log(request?.url);
  }
}
```

IMPORTANT: Os tokens acima serão `null` nos seguintes cenários:

- Durante os processos de build.
- Quando a aplicação é renderizada no navegador (CSR).
- Ao executar static site generation (SSG).
- Durante a extração de rota em desenvolvimento (no momento da requisição).

## Gerar uma aplicação totalmente estática {#generate-a-fully-static-application}

Por padrão, o Angular pré-renderiza toda a sua aplicação e gera um arquivo de servidor para manipular requisições. Isso permite que sua aplicação sirva conteúdo pré-renderizado aos usuários. No entanto, se você preferir um site totalmente estático sem um servidor, pode optar por não ter esse comportamento definindo o `outputMode` como `static` no seu arquivo de configuração `angular.json`.

Quando `outputMode` está definido como `static`, o Angular gera arquivos HTML pré-renderizados para cada rota em build time, mas não gera um arquivo de servidor ou requer um servidor Node.js para servir a aplicação. Isso é útil para deploy em provedores de hospedagem estática onde um servidor backend não é necessário.

Para configurar isso, atualize seu arquivo `angular.json` da seguinte forma:

```json
{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "options": {
            "outputMode": "static"
          }
        }
      }
    }
  }
}
```

## Caching de dados ao usar HttpClient

`HttpClient` faz cache de requisições de rede de saída ao executar no servidor. Esta informação é serializada e transferida para o navegador como parte do HTML inicial enviado do servidor. No navegador, `HttpClient` verifica se tem dados no cache e, se tiver, os reutiliza em vez de fazer uma nova requisição HTTP durante a renderização inicial da aplicação. `HttpClient` para de usar o cache assim que uma aplicação se torna [stable](api/core/ApplicationRef#isStable) enquanto executa em um navegador.

### Configurando as opções de caching

Você pode customizar como o Angular faz cache de respostas HTTP durante server‑side rendering (SSR) e as reutiliza durante hydration configurando `HttpTransferCacheOptions`.
Esta configuração é fornecida globalmente usando `withHttpTransferCacheOptions` dentro de `provideClientHydration()`.

Por padrão, `HttpClient` faz cache de todas as requisições `HEAD` e `GET` que não contêm headers `Authorization` ou `Proxy-Authorization`. Você pode sobrescrever essas configurações usando `withHttpTransferCacheOptions` na configuração de hydration.

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideClientHydration, withHttpTransferCacheOptions } from '@angular/platform-browser';

bootstrapApplication(AppComponent, {
  providers: [
    provideClientHydration(
      withHttpTransferCacheOptions({
        includeHeaders: ['ETag', 'Cache-Control'],
        filter: (req) => !req.url.includes('/api/profile'),
        includePostRequests: true,
        includeRequestsWithAuthHeaders: false,
      }),
    ),
  ],
});
```

---

### `includeHeaders`

Especifica quais headers da resposta do servidor devem ser incluídos em entradas em cache.
Nenhum header é incluído por padrão.

```ts
withHttpTransferCacheOptions({
  includeHeaders: ['ETag', 'Cache-Control'],
});
```

IMPORTANT: Evite incluir headers sensíveis como tokens de autenticação. Estes podem vazar dados específicos do usuário entre requisições.

---

### `includePostRequests`

Por padrão, apenas requisições `GET` e `HEAD` são armazenadas em cache.
Você pode habilitar cache para requisições `POST` quando elas são usadas como operações de leitura, como queries GraphQL.

```ts
withHttpTransferCacheOptions({
  includePostRequests: true,
});
```

Use isso apenas quando requisições `POST` são **idempotentes** e seguras para reutilizar entre renderizações de servidor e cliente.

---

### `includeRequestsWithAuthHeaders`

Determina se requisições contendo headers `Authorization` ou `Proxy‑Authorization` são elegíveis para cache.
Por padrão, estas são excluídas para prevenir cache de respostas específicas do usuário.

```ts
withHttpTransferCacheOptions({
  includeRequestsWithAuthHeaders: true,
});
```

Habilite apenas quando headers de autenticação **não** afetam o conteúdo da resposta (por exemplo, tokens públicos para APIs de analytics).

### Sobrescrições por requisição

Você pode sobrescrever o comportamento de cache para uma requisição específica usando a opção de requisição `transferCache`.

```ts
// Incluir headers específicos para esta requisição
http.get('/api/profile', { transferCache: { includeHeaders: ['CustomHeader'] } });
```

### Desabilitando caching

Você pode desabilitar o cache HTTP de requisições enviadas do servidor globalmente ou individualmente.

#### Globalmente

Para desabilitar cache para todas as requisições na sua aplicação, use a feature `withNoHttpTransferCache`:

```ts
import { bootstrapApplication, provideClientHydration, withNoHttpTransferCache } from '@angular/platform-browser';

bootstrapApplication(AppComponent, {
  providers: [
    provideClientHydration(withNoHttpTransferCache())
  ]
});
```

#### `filter`

Você também pode desabilitar seletivamente o cache para certas requisições usando a opção [`filter`](api/common/http/HttpTransferCacheOptions) em `withHttpTransferCacheOptions`. Por exemplo, você pode desabilitar cache para um endpoint de API específico:

```ts
import { bootstrapApplication, provideClientHydration, withHttpTransferCacheOptions } from '@angular/platform-browser';

bootstrapApplication(AppComponent, {
  providers: [
    provideClientHydration(withHttpTransferCacheOptions({
      filter: (req) => !req.url.includes('/api/sensitive-data')
    }))
  ]
});
```

Use esta opção para excluir endpoints com dados específicos do usuário ou dinâmicos (por exemplo `/api/profile`).

#### Individualmente

Para desabilitar cache para uma requisição individual, você pode especificar a opção [`transferCache`](api/common/http/HttpRequest#transferCache) em um `HttpRequest`.

```ts
httpClient.get('/api/sensitive-data', { transferCache: false });
```

## Configurando um servidor

### Node.js

O `@angular/ssr/node` estende `@angular/ssr` especificamente para ambientes Node.js. Ele fornece APIs que facilitam a implementação de server-side rendering dentro da sua aplicação Node.js. Para uma lista completa de funções e exemplos de uso, consulte a referência da API [`@angular/ssr/node` API reference](api/ssr/node/AngularNodeAppEngine).

```typescript
// server.ts
import { AngularNodeAppEngine, createNodeRequestHandler, writeResponseToNodeResponse } from '@angular/ssr/node';
import express from 'express';

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use('*', (req, res, next) => {
  angularApp
    .handle(req)
    .then(response => {
      if (response) {
        writeResponseToNodeResponse(response, res);
      } else {
        next(); // Passa controle para o próximo middleware
      }
    })
    .catch(next);
});

/**
 * O request handler usado pelo Angular CLI (dev-server e durante build).
 */
export const reqHandler = createNodeRequestHandler(app);
```

### Non-Node.js

O `@angular/ssr` fornece APIs essenciais para server-side rendering da sua aplicação Angular em plataformas diferentes de Node.js. Ele aproveita os objetos padrão [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) e [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) da Web API, permitindo que você integre Angular SSR em vários ambientes de servidor. Para informações detalhadas e exemplos, consulte a referência da API [`@angular/ssr` API reference](api/ssr/AngularAppEngine).

```typescript
// server.ts
import { AngularAppEngine, createRequestHandler } from '@angular/ssr';

const angularApp = new AngularAppEngine();

/**
 * Este é um request handler usado pelo Angular CLI (dev-server e durante build).
 */
export const reqHandler = createRequestHandler(async (req: Request) => {
  const res: Response|null = await angularApp.render(req);

  // ...
});
```
