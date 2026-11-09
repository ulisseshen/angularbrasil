<!-- ia-translate: true -->

# Renderização server e hybrid {#server-and-hybrid-rendering}

O Angular entrega todas as aplicações como client-side rendered (CSR) por padrão. Embora essa abordagem forneça um payload inicial leve, ela introduz trade-offs, incluindo tempos de carregamento mais lentos, métricas de desempenho degradadas e maiores demandas de recursos, já que o dispositivo do usuário executa a maior parte dos cálculos. Como resultado, muitas aplicações alcançam melhorias significativas de desempenho ao integrar server-side rendering (SSR) em uma estratégia de hybrid rendering.

## O que é hybrid rendering? {#what-is-hybrid-rendering}

Hybrid rendering permite que desenvolvedores aproveitem os benefícios de server-side rendering (SSR), pré-renderização (também conhecida como "static site generation" ou SSG) e client-side rendering (CSR) para otimizar sua aplicação Angular. Isso oferece controle refinado sobre como as diferentes partes da sua aplicação são renderizadas, para proporcionar aos seus usuários a melhor experiência possível.

## Configurando hybrid rendering {#setting-up-hybrid-rendering}

Você pode criar um **novo** projeto com hybrid rendering usando a flag de server-side rendering (ou seja, `--ssr`) com o comando `ng new` do Angular CLI:

```shell
ng new --ssr
```

Você também pode habilitar hybrid rendering adicionando server-side rendering a um projeto existente com o comando `ng add`:

```shell
ng add @angular/ssr
```

NOTE: Por padrão, o Angular pré-renderiza toda a sua aplicação e gera um arquivo de servidor. Para desabilitar isso e criar uma aplicação totalmente estática, defina `outputMode` como `static`. Para habilitar SSR, atualize as rotas do servidor para usar `RenderMode.Server`. Para mais detalhes, consulte [`Server routing`](#server-routing) e [Gerar uma aplicação totalmente estática](#generate-a-fully-static-application).

## Server routing

### Configurando rotas de servidor {#configuring-server-routes}

Você pode criar uma configuração de rotas de servidor declarando um array de objetos [`ServerRoute`](api/ssr/ServerRoute 'API reference'). Essa configuração normalmente fica em um arquivo chamado `app.routes.server.ts`.

```typescript {header: "app.routes.server.ts"}
import {RenderMode, ServerRoute} from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '', // Isso renderiza a rota "/" no cliente (CSR)
    renderMode: RenderMode.Client,
  },
  {
    path: 'about', // Esta página é estática, então a pré-renderizamos (SSG)
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

```typescript {header: "app.config.server.ts"}
import {provideServerRendering, withRoutes} from '@angular/ssr';
import {ApplicationConfig} from '@angular/core';
import {serverRoutes} from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    // ... outros providers ...
  ],
};
```

Ao usar o [App shell pattern](ecosystem/service-workers/app-shell), você deve especificar o component que será usado como app shell para as rotas renderizadas no cliente (CSR). Para isso, use a feature [`withAppShell`](api/ssr/withAppShell 'API reference'):

```typescript
import {provideServerRendering, withRoutes, withAppShell} from '@angular/ssr';
import {ApplicationConfig} from '@angular/core';
import {AppShell} from './app-shell';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes), withAppShell(AppShell)),
    // ... outros providers ...
  ],
};
```

### Modos de renderização {#rendering-modes}

A configuração de server routing permite especificar como cada rota da sua aplicação deve ser renderizada, definindo um [`RenderMode`](api/ssr/RenderMode 'API reference'):

| Modo de renderização | Descrição                                                                                                       |
| -------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Server (SSR)**     | Renderiza a aplicação no servidor para cada requisição, enviando uma página HTML totalmente populada ao navegador. |
| **Client (CSR)**     | Renderiza a aplicação no navegador. Este é o comportamento padrão do Angular.                                   |
| **Prerender (SSG)**  | Pré-renderiza a aplicação em build-time, gerando arquivos HTML estáticos para cada rota.                        |

#### Escolhendo um modo de renderização {#choosing-a-rendering-mode}

Cada modo de renderização tem benefícios e desvantagens diferentes. Você pode escolher os modos de renderização com base nas necessidades específicas da sua aplicação.

##### Client-side rendering (CSR)

Client-side rendering tem o modelo de desenvolvimento mais simples, já que você pode escrever código que assume que sempre executa em um navegador web. Isso permite usar uma ampla gama de bibliotecas client-side, que também assumem que executam em um navegador.

Client-side rendering geralmente tem desempenho pior do que os outros modos de renderização, pois precisa baixar, analisar e executar o JavaScript da sua página antes que o usuário possa ver qualquer conteúdo renderizado. Se a sua página busca mais dados do servidor enquanto renderiza, os usuários também precisam esperar por essas requisições adicionais antes de visualizar o conteúdo completo.

Se a sua página é indexada por rastreadores de busca, client-side rendering pode afetar negativamente a otimização para mecanismos de busca (SEO), já que os rastreadores têm limites de quanto JavaScript executam ao indexar uma página.

Ao usar client-side rendering, o servidor não precisa fazer nenhum trabalho para renderizar uma página, além de servir assets JavaScript estáticos. Considere esse fator se o custo do servidor for uma preocupação.

Aplicações que oferecem experiências instaláveis e offline com [service workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) podem depender de client-side rendering sem precisar se comunicar com um servidor.

##### Server-side rendering (SSR)

Server-side rendering oferece carregamentos de página mais rápidos do que client-side rendering. Em vez de esperar o JavaScript ser baixado e executado, o servidor renderiza diretamente um documento HTML ao receber uma requisição do navegador. O usuário experimenta apenas a latência necessária para o servidor buscar dados e renderizar a página solicitada. Esse modo também elimina a necessidade de requisições de rede adicionais a partir do navegador, já que o seu código pode buscar dados durante a renderização no servidor.

Server-side rendering geralmente tem excelente otimização para mecanismos de busca (SEO), já que os rastreadores de busca recebem um documento HTML totalmente renderizado.

Server-side rendering exige que você escreva código que não dependa estritamente de APIs do navegador, e limita a sua seleção de bibliotecas JavaScript que assumem que executam em um navegador.

Ao usar server-side rendering, o seu servidor executa o Angular para produzir uma resposta HTML para cada requisição, o que pode aumentar os custos de hospedagem do servidor.

##### Pré-renderização em build-time {#build-time-prerendering}

A pré-renderização oferece carregamentos de página mais rápidos do que client-side rendering e server-side rendering. Como a pré-renderização cria documentos HTML em _build-time_, o servidor pode responder diretamente às requisições com o documento HTML estático, sem nenhum trabalho adicional.

A pré-renderização exige que todas as informações necessárias para renderizar uma página estejam disponíveis em _build-time_. Isso significa que páginas pré-renderizadas não podem incluir dados específicos do usuário que está carregando a página. A pré-renderização é útil principalmente para páginas que são iguais para todos os usuários da sua aplicação.

Como a pré-renderização ocorre em build-time, ela pode adicionar um tempo significativo às suas builds de produção. Usar [`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference') para produzir um grande número de documentos HTML pode afetar o tamanho total dos arquivos do seu deploy e, assim, deixar os deploys mais lentos.

A pré-renderização geralmente tem excelente otimização para mecanismos de busca (SEO), já que os rastreadores de busca recebem um documento HTML totalmente renderizado.

A pré-renderização exige que você escreva código que não dependa estritamente de APIs do navegador, e limita a sua seleção de bibliotecas JavaScript que assumem que executam em um navegador.

A pré-renderização gera um overhead extremamente pequeno por requisição ao servidor, já que o seu servidor responde com documentos HTML estáticos. Arquivos estáticos também são facilmente armazenados em cache por Content Delivery Networks (CDNs), navegadores e camadas de cache intermediárias, para carregamentos de página subsequentes ainda mais rápidos. Sites totalmente estáticos também podem ser publicados somente por meio de um CDN ou servidor de arquivos estáticos, eliminando a necessidade de manter um runtime de servidor customizado para a sua aplicação. Isso melhora a escalabilidade ao transferir trabalho de um servidor web de aplicação, tornando-a particularmente benéfica para aplicações de alto tráfego.

NOTE: Ao usar o service worker do Angular, a primeira requisição é renderizada no servidor, mas todas as requisições subsequentes são tratadas pelo service worker e renderizadas no cliente.

### Definindo headers e status codes {#setting-headers-and-status-codes}

Você pode definir headers e status codes customizados para rotas de servidor individuais, usando as propriedades `headers` e `status` na configuração de `ServerRoute`.

```typescript {header: "app.routes.server.ts"}
import {RenderMode, ServerRoute} from '@angular/ssr';

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

O Angular trata redirects especificados pela propriedade [`redirectTo`](api/router/Route#redirectTo 'API reference') nas configurações de rota de forma diferente no lado do servidor.

**Server-Side Rendering (SSR)**
Os redirects são executados usando redirects HTTP padrão (por exemplo, 301, 302) dentro do processo de server-side rendering.

**Pré-renderização (SSG)**
Os redirects são implementados como "soft redirects", usando tags [`<meta http-equiv="refresh">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta#refresh) no HTML pré-renderizado.

### Customizando pré-renderização em build-time (SSG) {#customizing-build-time-prerendering-ssg}

Ao usar [`RenderMode.Prerender`](api/ssr/RenderMode#Prerender 'API reference'), você pode especificar várias opções de configuração para customizar o processo de pré-renderização e de serving.

#### Rotas parametrizadas {#parameterized-routes}

Para cada rota com [`RenderMode.Prerender`](api/ssr/RenderMode#Prerender 'API reference'), você pode especificar uma função [`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference'). Essa função permite controlar quais parâmetros específicos produzem documentos pré-renderizados separados.

A função [`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference') retorna uma `Promise` que resolve para um array de objetos. Cada objeto é um mapa chave-valor do nome do parâmetro de rota para o valor. Por exemplo, se você definir uma rota como `post/:id`, `getPrerenderParams` pode retornar o array `[{id: '123'}, {id: '456'}]`, e assim renderizar documentos separados para `post/123` e `post/456`.

O corpo de [`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference') pode usar a função [`inject`](api/core/inject 'API reference') do Angular para injetar dependências e executar qualquer trabalho necessário para determinar quais rotas pré-renderizar. Isso normalmente inclui fazer requisições para buscar dados que serão usados na construção do array de valores dos parâmetros.

Você também pode usar essa função com rotas catch-all (por exemplo, `/**`), onde o nome do parâmetro será `"**"` e o valor de retorno serão os segmentos do caminho, como `foo/bar`. Eles podem ser combinados com outros parâmetros (por exemplo, `/post/:id/**`) para lidar com configurações de rota mais complexas.

```ts {header: "app.routes.server.ts"}
import {RenderMode, ServerRoute} from '@angular/ssr';
import {inject} from '@angular/core';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'post/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const dataService = inject(PostService);
      const ids = await dataService.getIds(); // Assumindo que isso retorna ['1', '2', '3']

      return ids.map((id) => ({id})); // Gera caminhos como: /post/1, /post/2, /post/3
    },
  },
  {
    path: 'post/:id/**',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return [
        {id: '1', '**': 'foo/3'},
        {id: '2', '**': 'bar/4'},
      ]; // Gera caminhos como: /post/1/foo/3, /post/2/bar/4
    },
  },
];
```

Como [`getPrerenderParams`](api/ssr/ServerRoutePrerenderWithParams#getPrerenderParams 'API reference') se aplica exclusivamente a [`RenderMode.Prerender`](api/ssr/RenderMode#Prerender 'API reference'), essa função sempre executa em _build-time_. `getPrerenderParams` não deve depender de APIs específicas do navegador ou do servidor para obter dados.

IMPORTANT: Ao usar [`inject`](api/core/inject 'API reference') dentro de `getPrerenderParams`, lembre-se de que `inject` deve ser usado de forma síncrona. Ele não pode ser invocado dentro de callbacks assíncronos nem depois de qualquer `await`. Para mais informações, consulte `runInInjectionContext`.

#### Estratégias de fallback {#fallback-strategies}

Ao usar o modo [`RenderMode.Prerender`](api/ssr/RenderMode#Prerender 'API reference'), você pode especificar uma estratégia de fallback para tratar requisições de caminhos que não foram pré-renderizados.

As estratégias de fallback disponíveis são:

- **Server:** Recorre à renderização no servidor (SSR). Este é o comportamento **padrão** se nenhuma propriedade `fallback` for especificada.
- **Client:** Recorre à renderização no cliente (CSR).
- **None:** Nenhum fallback. O Angular não tratará requisições para caminhos que não estão pré-renderizados.

```ts {header: "app.routes.server.ts"}
import {RenderMode, PrerenderFallback, ServerRoute} from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'post/:id',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Client, // Fallback para CSR se não estiver pré-renderizado
    async getPrerenderParams() {
      // Esta função retorna um array de objetos representando posts pré-renderizados nos caminhos:
      // `/post/1`, `/post/2` e `/post/3`.
      // O caminho `/post/4` utilizará o comportamento de fallback se for requisitado.
      return [{id: '1'}, {id: '2'}, {id: '3'}];
    },
  },
];
```

## Escrevendo components compatíveis com servidor {#authoring-server-compatible-components}

Algumas APIs e capacidades comuns do navegador podem não estar disponíveis no servidor. Aplicações não podem usar objetos globais específicos do navegador, como `window`, `document`, `navigator` ou `location`, bem como certas propriedades de `HTMLElement`.

Em geral, código que depende de símbolos específicos do navegador deve ser executado apenas no navegador, não no servidor. Isso pode ser garantido pelos lifecycle hooks `afterEveryRender` e `afterNextRender`. Eles são executados somente no navegador e são ignorados no servidor.

```angular-ts
import {Component, ElementRef, viewChild, afterNextRender} from '@angular/core';

@Component({
  selector: 'my-cmp',
  template: `<span #content>{{ ... }}</span>`,
})
export class MyComponent {
  contentRef = viewChild.required<ElementRef>('content');

  constructor() {
    afterNextRender(() => {
      // É seguro verificar `scrollHeight` porque isso só será executado no navegador, não no servidor.
      console.log('content height: ' + this.contentRef().nativeElement.scrollHeight);
    });
  }
}
```

NOTE: Prefira [providers específicos de plataforma](guide/ssr#providing-platform-specific-implementations) a verificações em runtime com `isPlatformBrowser` ou `isPlatformServer`.

IMPORTANT: Evite usar `isPlatformBrowser` em templates com `@if` ou outras condicionais para renderizar conteúdos diferentes no servidor e no cliente. Isso causa incompatibilidades de hydration e layout shifts, prejudicando a experiência do usuário e os [Core Web Vitals](https://web.dev/learn-core-web-vitals/). Em vez disso, use `afterNextRender` para inicializações específicas do navegador e mantenha o conteúdo renderizado consistente entre as plataformas.

## Definindo providers no servidor {#setting-providers-on-the-server}

No lado do servidor, os valores dos providers de nível superior são definidos uma vez, quando o código da aplicação é analisado e avaliado pela primeira vez.
Isso significa que providers configurados com `useValue` manterão o mesmo valor entre várias requisições, até que a aplicação do servidor seja reiniciada.

Se você quiser gerar um novo valor para cada requisição, use um factory provider com `useFactory`. A função factory será executada para cada requisição recebida, garantindo que um novo valor seja criado e atribuído ao token a cada vez.

## Fornecendo implementações específicas de plataforma {#providing-platform-specific-implementations}

Quando a sua aplicação precisa de comportamentos diferentes no navegador e no servidor, forneça implementações de serviço separadas para cada plataforma. Essa abordagem centraliza a lógica específica de plataforma em serviços dedicados.

```ts
export abstract class AnalyticsService {
  abstract trackEvent(name: string): void;
}
```

Crie a implementação para o navegador:

```ts
@Injectable()
export class BrowserAnalyticsService implements AnalyticsService {
  trackEvent(name: string): void {
    // Envia o evento para o provedor de analytics de terceiros baseado no navegador
  }
}
```

Crie a implementação para o servidor:

```ts
@Injectable()
export class ServerAnalyticsService implements AnalyticsService {
  trackEvent(name: string): void {
    // Registra o evento no servidor
  }
}
```

Registre a implementação para o navegador na configuração principal da sua aplicação:

```ts {header: "app.config.ts"}
export const appConfig: ApplicationConfig = {
  providers: [{provide: AnalyticsService, useClass: BrowserAnalyticsService}],
};
```

Substitua pela implementação do servidor na configuração do servidor:

```ts {header: "app.config.server.ts"}
const serverConfig: ApplicationConfig = {
  providers: [{provide: AnalyticsService, useClass: ServerAnalyticsService}],
};
```

Injete e use o serviço nos seus components:

```ts
@Component(/* ... */)
export class Checkout {
  private analytics = inject(AnalyticsService);

  onAction() {
    this.analytics.trackEvent('action');
  }
}
```

## Acessando Document via DI {#accessing-document-via-di}

Ao trabalhar com server-side rendering, evite referenciar diretamente globais específicos do navegador, como `document`. Em vez disso, use o token [`DOCUMENT`](api/core/DOCUMENT) para acessar o objeto document de forma independente da plataforma.

```ts
import {inject, DOCUMENT, Service} from '@angular/core';

@Service()
export class CanonicalLinkService {
  private readonly document = inject(DOCUMENT);

  // Durante a renderização no servidor, injeta uma tag <link rel="canonical">
  // para que o HTML gerado inclua a URL canônica correta
  setCanonical(href: string): void {
    const link = this.document.createElement('link');
    link.rel = 'canonical';
    link.href = href;
    this.document.head.appendChild(link);
  }
}
```

HELPFUL: Para gerenciar meta tags, o Angular fornece o serviço `Meta`.

## Acessando Request e Response via DI {#accessing-request-and-response-via-di}

O pacote `@angular/core` fornece vários tokens para interagir com o ambiente de server-side rendering. Esses tokens dão acesso a informações e objetos importantes dentro da sua aplicação Angular durante o SSR.

- **[`REQUEST`](api/core/REQUEST 'API reference'):** Fornece acesso ao objeto de requisição atual, que é do tipo [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) da Web API. Isso permite acessar headers, cookies e outras informações da requisição.
- **[`RESPONSE_INIT`](api/core/RESPONSE_INIT 'API reference'):** Fornece acesso às opções de inicialização da resposta, que é do tipo [`ResponseInit`](https://developer.mozilla.org/en-US/docs/Web/API/Response/Response#parameters) da Web API. Isso permite definir headers e o status code da resposta dinamicamente. Use este token para definir headers ou status codes que precisam ser determinados em runtime.
- **[`REQUEST_CONTEXT`](api/core/REQUEST_CONTEXT 'API reference'):** Fornece acesso a contexto adicional relacionado à requisição atual. Esse contexto pode ser passado como o segundo parâmetro da função [`handle`](api/ssr/AngularAppEngine#handle 'API reference'). Normalmente, isso é usado para fornecer informações adicionais relacionadas à requisição que não fazem parte da Web API padrão.

```angular-ts
import {inject, REQUEST, Component} from '@angular/core';

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

<!-- UL é usado abaixo, pois caso contrário a lista não será incluída como parte da nota. -->
<!-- prettier-ignore-start -->

IMPORTANT: Os tokens acima serão `null` nos seguintes cenários:<ul class="docs-list">
  <li>Durante os processos de build.</li>
  <li>Quando a aplicação é renderizada no navegador (CSR).</li>
  <li>Ao executar static site generation (SSG).</li>
  <li>Durante a extração de rotas em desenvolvimento (no momento da requisição).</li>
</ul>

<!-- prettier-ignore-end -->

## Gerar uma aplicação totalmente estática {#generate-a-fully-static-application}

Por padrão, o Angular pré-renderiza toda a sua aplicação e gera um arquivo de servidor para tratar requisições. Isso permite que sua aplicação sirva conteúdo pré-renderizado aos usuários. No entanto, se você preferir um site totalmente estático, sem servidor, pode desativar esse comportamento definindo `outputMode` como `static` no seu arquivo de configuração `angular.json`.

Quando `outputMode` está definido como `static`, o Angular gera arquivos HTML pré-renderizados para cada rota em build-time, mas não gera um arquivo de servidor nem exige um servidor Node.js para servir a aplicação. Isso é útil para fazer deploy em provedores de hospedagem estática, onde um servidor backend não é necessário.

Para configurar isso, atualize o seu arquivo `angular.json` da seguinte forma:

```json
{
  "projects": {
    "my-app": {
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

### Formato de saída dos arquivos pré-renderizados {#prerendered-file-output-format}

A propriedade `format` da opção `prerender` controla a estrutura de arquivos que o Angular grava para cada rota pré-renderizada. Para uma rota com o caminho `about`:

| `format`              | Arquivo pré-renderizado |
| --------------------- | ----------------------- |
| `directory` (padrão)  | `about/index.html`      |
| `file`                | `about.html`            |

Dependendo do seu provedor de hospedagem estática, você pode definir `format` como `"file"` se o seu host exigir arquivos `<route>.html` para servir as rotas sem redirecionar para uma barra final.

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "options": {
            "outputMode": "static",
            "prerender": {
              "format": "file"
            }
          }
        }
      }
    }
  }
}
```

NOTE: A opção `format` só é considerada quando o build não produz um servidor.

## Caching de dados ao usar HttpClient {#caching-data-when-using-httpclient}

`HttpClient` faz cache das requisições de rede de saída ao executar no servidor. Essa informação é serializada e transferida para o navegador como parte do HTML inicial enviado pelo servidor. No navegador, `HttpClient` verifica se há dados no cache e, se houver, os reutiliza em vez de fazer uma nova requisição HTTP durante a renderização inicial da aplicação. `HttpClient` deixa de usar o cache assim que uma aplicação se torna [stable](api/core/ApplicationRef#isStable) enquanto executa em um navegador.

### Configurando o limite de tamanho do corpo da resposta {#configuring-the-response-body-size-limit}

Quando `HttpClient` usa o backend fetch padrão durante a renderização no servidor (SSR), o Angular limita o corpo de cada resposta a 1 MB. Esse limite impede que o servidor armazene em buffer respostas inesperadamente grandes durante a renderização. Se uma resposta exceder o limite configurado, a requisição falha com o erro [NG02825](errors/NG02825).

Se a sua aplicação precisar buscar respostas maiores durante a renderização no servidor, defina `maxResponseBodySize` nas opções de `provideServerRendering`:

```ts
import {provideServerRendering, withRoutes} from '@angular/ssr';
import {ApplicationConfig} from '@angular/core';
import {serverRoutes} from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(
      {
        maxResponseBodySize: 5 * 1024 * 1024, // 5MB
      },
      withRoutes(serverRoutes),
    ),
  ],
};
```

`maxResponseBodySize` é configurado em bytes e se aplica globalmente às requisições `HttpClient` feitas no servidor que usam o backend fetch.

IMPORTANT: Mantenha esse limite o menor possível para a sua aplicação. Aumentá-lo permite que requisições no servidor armazenem em buffer corpos de resposta maiores, o que pode aumentar o uso de memória e o risco de denial of service. Prefira mover downloads grandes para fora da renderização no servidor.

CRITICAL: Durante o SSR, a implementação de Fetch lê o corpo inteiro da resposta para verificar o `integrity` antes de retornar uma resposta, como exigido pelo [Fetch Standard](https://fetch.spec.whatwg.org/#concept-main-fetch). O Angular aplica o [`maxResponseBodySize`](/guide/ssr#configuring-the-response-body-size-limit) somente depois que o Fetch retorna uma resposta; portanto, esse limite não restringe os dados armazenados em buffer durante a verificação de integridade.

### Configurando as opções de caching {#configuring-the-caching-options}

Você pode personalizar como o Angular faz cache das respostas HTTP durante a renderização no servidor (SSR) e as reutiliza durante a hydration, configurando `HttpTransferCacheOptions`.  
Essa configuração é fornecida globalmente usando `withHttpTransferCacheOptions` dentro de `provideClientHydration()`.

Por padrão, `HttpClient` faz cache de todas as requisições `HEAD` e `GET` que não contêm os headers `Authorization`, `Proxy-Authorization` ou `Cookie` e que não são enviadas com `withCredentials` ou com os modos de `credentials` da Fetch API que podem enviar credenciais. O Angular também ignora o transfer cache quando a requisição ou a resposta inclui diretivas de `Cache-Control` que proíbem o cache (`no-store`, `no-cache` ou `private`), ou quando a opção `cache` da Fetch API está definida como `no-store` ou `no-cache`. Respostas que carregam um header `Set-Cookie` também são ignoradas. Você pode sobrescrever as configurações de filtragem de requisições usando `withHttpTransferCacheOptions` na configuração de hydration.

```ts
import {
  bootstrapApplication,
  provideClientHydration,
  withHttpTransferCacheOptions,
} from '@angular/platform-browser';

bootstrapApplication(App, {
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

### `includeHeaders`

Especifica quais headers da resposta do servidor devem ser incluídos nas entradas em cache.  
Nenhum header é incluído por padrão.

```ts
withHttpTransferCacheOptions({
  includeHeaders: ['ETag', 'Cache-Control'],
});
```

IMPORTANT: Evite incluir headers sensíveis, como tokens de autenticação. Eles podem vazar dados específicos do usuário entre requisições.

Incluir `Cache-Control` em `includeHeaders` apenas torna esse header disponível na resposta hidratada. O Angular já avalia os headers `Cache-Control` automaticamente ao decidir se uma requisição ou resposta é elegível para o transfer cache.

### `includePostRequests`

Por padrão, somente requisições `GET` e `HEAD` são armazenadas em cache.  
Você pode habilitar o cache para requisições `POST` quando elas são usadas como operações de leitura, como queries GraphQL.

```ts
withHttpTransferCacheOptions({
  includePostRequests: true,
});
```

Use isso somente quando as requisições `POST` forem **idempotentes** e seguras para reutilizar entre a renderização no servidor e no cliente.

### `includeRequestsWithAuthHeaders`

Determina se requisições que contêm os headers `Authorization`, `Proxy‑Authorization` ou `Cookie` são elegíveis para cache.  
Por padrão, elas são excluídas para evitar o cache de respostas específicas do usuário.

```ts
withHttpTransferCacheOptions({
  includeRequestsWithAuthHeaders: true,
});
```

Habilite somente quando os headers de autenticação **não** afetarem o conteúdo da resposta (por exemplo, tokens públicos para APIs de analytics).

### `includeRequestsWithCredentials`

Determina se requisições enviadas com `withCredentials` ou com os modos de `credentials` da Fetch API (`include` ou `same-origin`) são elegíveis para cache.  
Por padrão, elas são excluídas para evitar o cache de respostas específicas do usuário.

```ts
withHttpTransferCacheOptions({
  includeRequestsWithCredentials: true,
});
```

Habilite somente quando as respostas de requisições com credenciais forem seguras para cache.

### `includeNonCacheableRequests`

Determina se requisições e respostas que contêm diretivas de `Cache-Control` que proíbem o cache (`no-store`, `no-cache` ou `private`), respostas com um header `Set-Cookie`, ou requisições que usam as opções `cache` da Fetch API (`no-store` ou `no-cache`) são elegíveis para cache.  
Por padrão, elas são excluídas para respeitar os controles de cache HTTP.

```ts
withHttpTransferCacheOptions({
  includeNonCacheableRequests: true,
});
```

Habilite somente quando você precisar ignorar as restrições de `Cache-Control` para o transfer cache.

### Sobrescrições por requisição {#perrequest-overrides}

Você pode sobrescrever o comportamento de cache de uma requisição específica usando a opção de requisição `transferCache`.

```ts
// Inclui headers específicos para esta requisição
http.get('/api/profile', {transferCache: {includeHeaders: ['CustomHeader']}});
```

### Desabilitando caching {#disabling-caching}

Você pode desabilitar o cache HTTP das requisições enviadas pelo servidor, globalmente ou individualmente.

#### Globalmente {#globally}

Para desabilitar o cache de todas as requisições da sua aplicação, use a feature `withNoHttpTransferCache`:

```ts
import {
  bootstrapApplication,
  provideClientHydration,
  withNoHttpTransferCache,
} from '@angular/platform-browser';

bootstrapApplication(App, {
  providers: [provideClientHydration(withNoHttpTransferCache())],
});
```

#### Filtragem {#filtering}

Você também pode desabilitar seletivamente o cache de determinadas requisições usando a opção [`filter`](api/common/http/HttpTransferCacheOptions) em `withHttpTransferCacheOptions`. Por exemplo, você pode desabilitar o cache de um endpoint de API específico:

```ts
import {
  bootstrapApplication,
  provideClientHydration,
  withHttpTransferCacheOptions,
} from '@angular/platform-browser';

bootstrapApplication(App, {
  providers: [
    provideClientHydration(
      withHttpTransferCacheOptions({
        filter: (req) => !req.url.includes('/api/sensitive-data'),
      }),
    ),
  ],
});
```

Use essa opção para excluir endpoints com dados específicos do usuário ou dinâmicos (por exemplo, `/api/profile`).

#### Por requisição {#per-request}

Para desabilitar o cache de uma requisição individual, você pode especificar a opção [`transferCache`](api/common/http/HttpRequest#transferCache) em um `HttpRequest`.

```ts
httpClient.get('/api/sensitive-data', {transferCache: false});
```

O `HttpTransferCache` não armazena requisições ou respostas que optam explicitamente por não usar cache. O Angular ignora as entradas do transfer cache quando uma requisição inclui um header `Cache-Control` com `no-store`, `no-cache` ou `private`, ou quando a requisição usa a opção `cache` da Fetch API definida como `no-store` ou `no-cache`. Respostas com `Cache-Control: no-store`, `Cache-Control: no-cache` ou `Cache-Control: private` também não são armazenadas no transfer cache. Respostas que incluem um header `Set-Cookie` igualmente não são armazenadas, pois normalmente carregam estado específico do usuário.

NOTE: Se a sua aplicação usar origens HTTP diferentes para fazer chamadas de API no servidor e no cliente, o token `HTTP_TRANSFER_CACHE_ORIGIN_MAP` permite estabelecer um mapeamento entre essas origens, para que a feature `HttpTransferCache` reconheça essas requisições como as mesmas e reutilize, na hydration no cliente, os dados armazenados em cache no servidor.

## Configurando um servidor {#configuring-a-server}

### Node.js

O `@angular/ssr/node` estende o `@angular/ssr` especificamente para ambientes Node.js. Ele fornece APIs que facilitam a implementação de server-side rendering dentro da sua aplicação Node.js. Para uma lista completa de funções e exemplos de uso, consulte a [referência da API `@angular/ssr/node`](api/ssr/node/AngularNodeAppEngine).

```ts {header: "server.ts"}
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => {
      if (response) {
        writeResponseToNodeResponse(response, res);
      } else {
        next(); // Passa o controle para o próximo middleware
      }
    })
    .catch(next);
});

/**
 * O request handler usado pelo Angular CLI (dev-server e durante o build).
 */
export const reqHandler = createNodeRequestHandler(app);
```

### Non-Node.js

O `@angular/ssr` fornece as APIs essenciais para fazer server-side rendering da sua aplicação Angular em plataformas que não são Node.js. Ele utiliza os objetos padrão [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) e [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) da Web API, permitindo integrar o Angular SSR a vários ambientes de servidor. Para informações detalhadas e exemplos, consulte a [referência da API `@angular/ssr`](api/ssr/AngularAppEngine).

```ts {header: "server.ts"}
import {AngularAppEngine, createRequestHandler} from '@angular/ssr';

const angularApp = new AngularAppEngine();

/**
 * Este é um request handler usado pelo Angular CLI (dev-server e durante o build).
 */
export const reqHandler = createRequestHandler(async (req: Request) => {
  const res: Response | null = await angularApp.handle(req);

  // ...
});
```

## Segurança {#security}

Para informações detalhadas sobre como prevenir Server-Side Request Forgery (SSRF) e configurar hosts permitidos, consulte o guia [Segurança no lado do servidor](best-practices/security#preventing-server-side-request-forgery-ssrf).
