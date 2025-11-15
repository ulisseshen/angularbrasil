<!-- ia-translate: true -->
# Personalizando o comportamento de rotas

O Angular Router fornece pontos de extensão poderosos que permitem personalizar como as rotas se comportam em sua aplicação. Embora o comportamento padrão de routing funcione bem para a maioria das aplicações, requisitos específicos frequentemente exigem implementações customizadas para otimização de performance, manipulação especializada de URLs ou lógica de routing complexa.

A customização de rotas pode se tornar valiosa quando sua aplicação precisa de:

- **Preservação de estado de componentes** entre navegações para evitar re-buscar dados
- **Carregamento estratégico de módulos lazy** baseado no comportamento do usuário ou condições de rede
- **Integração com URLs externas** ou manipulação de rotas Angular junto com sistemas legados
- **Correspondência dinâmica de rotas** baseada em condições de runtime além de padrões simples de caminho

NOTA: Antes de implementar estratégias customizadas, certifique-se de que o comportamento padrão do router não atende suas necessidades. O routing padrão do Angular é otimizado para casos de uso comuns e fornece o melhor equilíbrio entre performance e simplicidade. Personalizar estratégias de rotas pode criar complexidade adicional no código e ter implicações de performance no uso de memória se não for gerenciado cuidadosamente.

## Opções de configuração do Router

O `withRouterConfig` ou `RouterModule.forRoot` permite fornecer `RouterConfigOptions` adicionais para ajustar o comportamento do Router.

### Manipular navegações canceladas

`canceledNavigationResolution` controla como o Router restaura o histórico do browser quando uma navegação é cancelada. O valor padrão é `'replace'`, que reverte para a URL pré-navegação com `location.replaceState`. Na prática, isso significa que sempre que a barra de endereços já foi atualizada para a navegação, como com os botões de voltar ou avançar do browser, a entrada do histórico é sobrescrita com o "rollback" se a navegação falhar ou for rejeitada por um guard.
Mudar para `'computed'` mantém o índice do histórico em andamento sincronizado com a navegação Angular, então cancelar uma navegação do botão de voltar aciona uma navegação para frente (e vice-versa) para retornar à página original.

Esta configuração é mais útil quando sua aplicação usa `urlUpdateStrategy: 'eager'` ou quando guards frequentemente cancelam navegações popstate iniciadas pelo browser.

```ts
provideRouter(routes, withRouterConfig({ canceledNavigationResolution: 'computed' }));
```

### Reagir a navegações para a mesma URL

`onSameUrlNavigation` configura o que deve acontecer quando o usuário pede para navegar para a URL atual. O padrão `'ignore'` pula o trabalho, enquanto `'reload'` executa guards e resolvers novamente e atualiza as instâncias de componentes.

Isso é útil quando você quer que cliques repetidos em um filtro de lista, item de navegação lateral ou botão de atualizar acionem nova recuperação de dados mesmo que a URL não mude.

```ts
provideRouter(routes, withRouterConfig({ onSameUrlNavigation: 'reload' }));
```

Você também pode controlar esse comportamento em navegações individuais em vez de globalmente. Isso permite que você mantenha o padrão de `'ignore'` enquanto habilita seletivamente o comportamento de reload para casos de uso específicos:

```ts
router.navigate(['/some-path'], { onSameUrlNavigation: 'reload' });
```

### Controlar herança de parâmetros

`paramsInheritanceStrategy` define como parâmetros de rotas e dados fluem de rotas pai.

Com o padrão `'emptyOnly'`, rotas filhas herdam parâmetros apenas quando seu caminho está vazio ou o pai não declara um component.

```ts
provideRouter(routes, withRouterConfig({ paramsInheritanceStrategy: 'always' }));
```

```ts
export const routes: Routes = [
  {
    path: 'org/:orgId',
    component: Organization,
    children: [
      {
        path: 'projects/:projectId',
        component: Project,
        children: [
          {
            path: 'customers/:customerId',
            component: Customer
          }
        ]
      }
    ]
  }
];
```

```ts
@Component({ /* ... */})
export class CustomerComponent {
  private route = inject(ActivatedRoute);

  orgId = this.route.parent?.parent?.snapshot.params['orgId'];
  projectId = this.route.parent?.snapshot.params['projectId'];
  customerId = this.route.snapshot.params['customerId'];
}
```

Usar `'always'` garante que parâmetros matrix, dados de rotas e valores resolvidos estejam disponíveis mais abaixo na árvore de rotas—útil quando você compartilha identificadores contextuais entre áreas de funcionalidade como `/org/:orgId/projects/:projectId/customers/:customerId`.

```ts
@Component({ /* ... */})
export class CustomerComponent {
  private route = inject(ActivatedRoute);

  // All parent parameters are available directly
  orgId = this.route.snapshot.params['orgId'];
  projectId = this.route.snapshot.params['projectId'];
  customerId = this.route.snapshot.params['customerId'];
}
```

### Decidir quando a URL atualiza

`urlUpdateStrategy` determina quando o Angular escreve na barra de endereços do browser. O padrão `'deferred'` espera por uma navegação bem-sucedida antes de mudar a URL. Use `'eager'` para atualizar imediatamente quando a navegação começar. Atualizações eager facilitam exibir a URL tentada se a navegação falhar devido a guards ou erros, mas pode mostrar brevemente uma URL em progresso se você tiver guards de longa duração.

Considere isso quando seu pipeline de analytics precisar ver a rota tentada mesmo que guards a bloqueiem.

```ts
provideRouter(routes, withRouterConfig({ urlUpdateStrategy: 'eager' }));
```

### Escolher manipulação padrão de parâmetros de query

`defaultQueryParamsHandling` define o comportamento de fallback para `Router.createUrlTree` quando a chamada não especifica `queryParamsHandling`. `'replace'` é o padrão e substitui a query string existente. `'merge'` combina os valores fornecidos com os atuais, e `'preserve'` mantém os parâmetros de query existentes a menos que você forneça explicitamente novos.

```ts
provideRouter(routes, withRouterConfig({ defaultQueryParamsHandling: 'merge' }));
```

Isso é especialmente útil para páginas de busca e filtro para reter automaticamente filtros existentes quando parâmetros adicionais são fornecidos.

O Angular Router expõe quatro áreas principais para customização:

  <docs-pill-row>
    <docs-pill href="#route-reuse-strategy" title="Route reuse strategy"/>
    <docs-pill href="#preloading-strategy" title="Preloading strategy"/>
    <docs-pill href="#url-handling-strategy" title="URL handling strategy"/>
    <docs-pill href="#custom-route-matchers" title="Custom route matchers"/>
  </docs-pill-row>

## Route reuse strategy

Route reuse strategy controla se o Angular destrói e recria componentes durante a navegação ou os preserva para reutilização. Por padrão, o Angular destrói instâncias de componentes ao navegar para fora de uma rota e cria novas instâncias ao navegar de volta.

### Quando implementar route reuse

Estratégias customizadas de route reuse beneficiam aplicações que precisam de:

- **Preservação de estado de formulários** - Manter formulários parcialmente preenchidos quando usuários navegam para fora e retornam
- **Retenção de dados caros** - Evitar re-buscar grandes conjuntos de dados ou cálculos complexos
- **Manutenção de posição de scroll** - Preservar posições de scroll em listas longas ou implementações de scroll infinito
- **Interfaces tipo abas** - Manter estado de componentes ao alternar entre abas

### Criando uma custom route reuse strategy

A classe `RouteReuseStrategy` do Angular permite personalizar o comportamento de navegação através do conceito de "detached route handles."

"Detached route handles" são a forma do Angular de armazenar instâncias de componentes e toda sua hierarquia de view. Quando uma rota é desanexada, o Angular preserva a instância do component, seus componentes filhos e todo o estado associado na memória. Este estado preservado pode posteriormente ser reanexado ao navegar de volta para a rota.

A classe `RouteReuseStrategy` fornece cinco métodos que controlam o ciclo de vida de componentes de rotas:

| Método                                                               | Descrição                                                                                                 |
| -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| [`shouldDetach`](api/router/RouteReuseStrategy#shouldDetach)         | Determina se uma rota deve ser armazenada para reutilização posterior ao navegar para fora                                 |
| [`store`](api/router/RouteReuseStrategy#store)                       | Armazena o detached route handle quando `shouldDetach` retorna true                                           |
| [`shouldAttach`](api/router/RouteReuseStrategy#shouldAttach)         | Determina se uma rota armazenada deve ser reanexada ao navegar para ela                                     |
| [`retrieve`](api/router/RouteReuseStrategy#retrieve)                 | Retorna o route handle previamente armazenado para reanexação                                                 |
| [`shouldReuseRoute`](api/router/RouteReuseStrategy#shouldReuseRoute) | Determina se o router deve reutilizar a instância da rota atual em vez de destruí-la durante a navegação |

O exemplo a seguir demonstra uma custom route reuse strategy que preserva seletivamente o estado do component baseado em metadados da rota:

```ts
import { RouteReuseStrategy, Route, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  private handlers = new Map<Route | null, DetachedRouteHandle>();

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // Determines if a route should be stored for later reuse
    return route.data['reuse'] === true;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    // Stores the detached route handle when shouldDetach returns true
    if (handle && route.data['reuse'] === true) {
      const key = this.getRouteKey(route);
      this.handlers.set(key, handle);
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    // Checks if a stored route should be reattached
    const key = this.getRouteKey(route);
    return route.data['reuse'] === true && this.handlers.has(key);
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    // Returns the stored route handle for reattachment
    const key = this.getRouteKey(route);
    return route.data['reuse'] === true ? this.handlers.get(key) ?? null : null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    // Determines if the router should reuse the current route instance
    return future.routeConfig === curr.routeConfig;
  }

  private getRouteKey(route: ActivatedRouteSnapshot): Route | null {
    return route.routeConfig;
  }
}
```

NOTA: Evite usar o caminho da rota como chave quando guards `canMatch` estão envolvidos, pois pode levar a entradas duplicadas.

### Configurando uma rota para usar uma custom route reuse strategy

Rotas podem optar pelo comportamento de reuse através de metadados de configuração de rota. Esta abordagem mantém a lógica de reuse separada do código do component, facilitando ajustar o comportamento sem modificar componentes:

```ts
export const routes: Routes = [
  {
    path: 'products',
    component: ProductListComponent,
    data: { reuse: true }  // Component state persists across navigations
  },
  {
    path: 'products/:id',
    component: ProductDetailComponent,
    // No reuse flag - component recreates on each navigation
  },
  {
    path: 'search',
    component: SearchComponent,
    data: { reuse: true }  // Preserves search results and filter state
  }
];
```

Você também pode configurar uma custom route reuse strategy no nível da aplicação através do sistema de injeção de dependência do Angular. Neste caso, o Angular cria uma única instância da strategy que gerencia todas as decisões de reuse de rotas em toda a aplicação:

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy }
  ]
};
```

## Preloading strategy

Preloading strategies determinam quando o Angular carrega módulos de rotas lazy-loaded em background. Enquanto lazy loading melhora o tempo de carregamento inicial adiando downloads de módulos, usuários ainda experimentam um atraso quando navegam pela primeira vez para uma rota lazy. Preloading strategies eliminam este atraso carregando módulos antes que os usuários os solicitem.

### Built-in preloading strategies

O Angular fornece duas preloading strategies prontas:

| Strategy                                            | Descrição                                                                                                      |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| [`NoPreloading`](api/router/NoPreloading)           | A strategy padrão que desabilita todo preloading. Em outras palavras, módulos só carregam quando usuários navegam para eles |
| [`PreloadAllModules`](api/router/PreloadAllModules) | Carrega todos os módulos lazy-loaded imediatamente após a navegação inicial                                           |

A strategy `PreloadAllModules` pode ser configurada da seguinte forma:

```ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withPreloading(PreloadAllModules)
    )
  ]
};
```

A strategy `PreloadAllModules` funciona bem para aplicações pequenas a médias onde baixar todos os módulos não impacta significativamente a performance. Contudo, aplicações maiores com muitos módulos de funcionalidades podem se beneficiar de preloading mais seletivo.

### Criando uma custom preloading strategy

Custom preloading strategies implementam a interface `PreloadingStrategy`, que requer um único método `preload`. Este método recebe a configuração da rota e uma função que aciona o carregamento real do módulo. A strategy retorna um Observable que emite quando o preloading completa ou um Observable vazio para pular o preloading:

```ts
import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class SelectivePreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // Only preload routes marked with data: { preload: true }
    if (route.data?.['preload']) {
      return load();
    }
    return of(null);
  }
}
```

Esta strategy seletiva verifica metadados de rota para determinar o comportamento de preloading. Rotas podem optar pelo preloading através de sua configuração:

```ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.routes'),
    data: { preload: true }  // Preload immediately after initial navigation
  },
  {
    path: 'reports',
    loadChildren: () => import('./reports/reports.routes'),
    data: { preload: false } // Only load when user navigates to reports
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes')
    // No preload flag - won't be preloaded
  }
];
```

### Considerações de performance para preloading

Preloading impacta tanto o uso de rede quanto o consumo de memória. Cada módulo pré-carregado consome largura de banda e aumenta a pegada de memória da aplicação. Usuários mobile em conexões medidas podem preferir preloading mínimo, enquanto usuários desktop em redes rápidas podem lidar com estratégias agressivas de preloading.

O timing do preloading também importa. Preloading imediato após o carregamento inicial pode competir com outros recursos críticos como imagens ou chamadas de API. Strategies devem considerar o comportamento pós-carregamento da aplicação e coordenar com outras tarefas em background para evitar degradação de performance.

Limites de recursos do browser também afetam o comportamento de preloading. Browsers limitam conexões HTTP concorrentes, então preloading agressivo pode ficar em fila atrás de outras requisições. Service workers podem ajudar fornecendo controle refinado sobre caching e requisições de rede, complementando a preloading strategy.

## URL handling strategy

URL handling strategies determinam quais URLs o Angular router processa versus quais ele ignora. Por padrão, o Angular tenta manipular todos os eventos de navegação dentro da aplicação, mas aplicações do mundo real frequentemente precisam coexistir com outros sistemas, manipular links externos ou integrar com aplicações legadas que gerenciam suas próprias rotas.

A classe `UrlHandlingStrategy` dá a você controle sobre esta fronteira entre rotas gerenciadas pelo Angular e URLs externas. Isso se torna essencial ao migrar aplicações para Angular incrementalmente ou quando aplicações Angular precisam compartilhar espaço de URL com outros frameworks.

### Implementando uma custom URL handling strategy

Custom URL handling strategies estendem a classe `UrlHandlingStrategy` e implementam três métodos. O método `shouldProcessUrl` determina se o Angular deve manipular uma dada URL, `extract` retorna a porção da URL que o Angular deve processar, e `merge` combina o fragmento da URL com o resto da URL:

```ts
import { Injectable } from '@angular/core';
import { UrlHandlingStrategy, UrlTree } from '@angular/router';

@Injectable()
export class CustomUrlHandlingStrategy implements UrlHandlingStrategy {
  shouldProcessUrl(url: UrlTree): boolean {
    // Only handle URLs that start with /app or /admin
    return url.toString().startsWith('/app') ||
           url.toString().startsWith('/admin');
  }

  extract(url: UrlTree): UrlTree {
    // Return the URL unchanged if we should process it
    return url;
  }

  merge(newUrlPart: UrlTree, rawUrl: UrlTree): UrlTree {
    // Combine the URL fragment with the rest of the URL
    return newUrlPart;
  }
}
```

Esta strategy cria fronteiras claras no espaço de URL. O Angular manipula caminhos `/app` e `/admin` enquanto ignora todo o resto. Este padrão funciona bem ao migrar aplicações legadas onde o Angular controla seções específicas enquanto o sistema legado mantém outras.

### Configurando uma custom URL handling strategy

Você pode registrar uma strategy customizada através do sistema de injeção de dependência do Angular:

```ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { UrlHandlingStrategy } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    { provide: UrlHandlingStrategy, useClass: CustomUrlHandlingStrategy }
  ]
};
```

## Custom route matchers

Por padrão, o router do Angular itera através de rotas na ordem em que são definidas, tentando corresponder o caminho da URL com o padrão de caminho de cada rota. Ele suporta segmentos estáticos, segmentos parametrizados (`:id`) e wildcards (`**`). A primeira rota que corresponde vence, e o router para de buscar.

Quando aplicações requerem lógica de correspondência mais sofisticada baseada em condições de runtime, padrões de URL complexos ou outras regras customizadas, custom matchers fornecem esta flexibilidade sem comprometer a simplicidade de rotas padrão.

O router avalia custom matchers durante a fase de correspondência de rotas, antes que a correspondência de caminho ocorra. Quando um matcher retorna uma correspondência bem-sucedida, ele também pode extrair parâmetros da URL, tornando-os disponíveis para o component ativado assim como parâmetros de rota padrão.

### Criando um custom matcher

Um custom matcher é uma função que recebe segmentos de URL e retorna ou um resultado de correspondência com segmentos consumidos e parâmetros, ou null para indicar nenhuma correspondência. A função matcher é executada antes que o Angular avalie a propriedade path da rota:

```ts
import { Route, UrlSegment, UrlSegmentGroup, UrlMatchResult } from '@angular/router';

export function customMatcher(
  segments: UrlSegment[],
  group: UrlSegmentGroup,
  route: Route
): UrlMatchResult | null {
  // Matching logic here
  if (matchSuccessful) {
    return {
      consumed: segments,
      posParams: {
        paramName: new UrlSegment('paramValue', {})
      }
    };
  }
  return null;
}
```

### Implementando routing baseado em versão

Considere um site de documentação de API que precisa rotear baseado em números de versão na URL. Diferentes versões podem ter diferentes estruturas de componentes ou conjuntos de funcionalidades:

```ts
import { Routes, UrlSegment, UrlMatchResult } from '@angular/router';

export function versionMatcher(segments: UrlSegment[]): UrlMatchResult | null {
  // Match patterns like /v1/docs, /v2.1/docs, /v3.0.1/docs
  if (segments.length >= 2 && segments[0].path.match(/^v\d+(\.\d+)*$/)) {
    return {
      consumed: segments.slice(0, 2),  // Consume version and 'docs'
      posParams: {
        version: segments[0],  // Make version available as a parameter
        section: segments[1]   // Make section available too
      }
    };
  }
  return null;
}

// Route configuration
export const routes: Routes = [
  {
    matcher: versionMatcher,
    component: DocumentationComponent
  },
  {
    path: 'latest/docs',
    redirectTo: 'v3/docs'
  }
];
```

O component recebe os parâmetros extraídos através de route inputs:

```angular-ts
import { Component, input, inject } from '@angular/core';
import { resource } from '@angular/core';

@Component({
  selector: 'app-documentation',
  template: `
    @if (documentation.isLoading()) {
      <div>Loading documentation...</div>
    } @else if (documentation.error()) {
      <div>Error loading documentation</div>
    } @else if (documentation.value(); as docs) {
      <article>{{ docs.content }}</article>
    }
  `
})
export class DocumentationComponent {
  // Route parameters are automatically bound to signal inputs
  version = input.required<string>();  // Receives the version parameter
  section = input.required<string>();  // Receives the section parameter

  private docsService = inject(DocumentationService);

  // Resource automatically loads documentation when version or section changes
  documentation = resource({
    params: () => {
      if (!this.version() || !this.section()) return;

      return {
        version: this.version(),
        section: this.section()
      }
    },
    loader: ({ params }) => {
      return this.docsService.loadDocumentation(params.version, params.section);
    }
  })
}
```

### Routing consciente de locale

Aplicações internacionais frequentemente codificam informações de locale em URLs. Um custom matcher pode extrair códigos de locale e rotear para componentes apropriados enquanto torna o locale disponível como parâmetro:

```ts
// Supported locales
const locales = ['en', 'es', 'fr', 'de', 'ja', 'zh'];

export function localeMatcher(segments: UrlSegment[]): UrlMatchResult | null {
  if (segments.length > 0) {
    const potentialLocale = segments[0].path;

    if (locales.includes(potentialLocale)) {
      // This is a locale prefix, consume it and continue matching
      return {
        consumed: [segments[0]],
        posParams: {
          locale: segments[0]
        }
      };
    } else {
      // No locale prefix, use default locale
      return {
        consumed: [],  // Don't consume any segments
        posParams: {
          locale: new UrlSegment('en', {})
        }
      };
    }
  }

  return null;
}
```

### Correspondência de lógica de negócio complexa

Custom matchers se destacam ao implementar regras de negócio que seriam desajeitadas de expressar em padrões de caminho. Considere um site de e-commerce onde URLs de produtos seguem padrões diferentes baseados no tipo de produto:

```ts
export function productMatcher(segments: UrlSegment[]): UrlMatchResult | null {
  if (segments.length === 0) return null;

  const firstSegment = segments[0].path;

  // Books: /isbn-1234567890
  if (firstSegment.startsWith('isbn-')) {
    return {
      consumed: [segments[0]],
      posParams: {
        productType: new UrlSegment('book', {}),
        identifier: new UrlSegment(firstSegment.substring(5), {})
      }
    };
  }

  // Electronics: /sku/ABC123
  if (firstSegment === 'sku' && segments.length > 1) {
    return {
      consumed: segments.slice(0, 2),
      posParams: {
        productType: new UrlSegment('electronics', {}),
        identifier: segments[1]
      }
    };
  }

  // Clothing: /style/BRAND/ITEM
  if (firstSegment === 'style' && segments.length > 2) {
    return {
      consumed: segments.slice(0, 3),
      posParams: {
        productType: new UrlSegment('clothing', {}),
        brand: segments[1],
        identifier: segments[2]
      }
    };
  }

  return null;
}
```

### Considerações de performance para custom matchers

Custom matchers são executados para cada tentativa de navegação até que uma correspondência seja encontrada. Como resultado, lógica de correspondência complexa pode impactar a performance de navegação, especialmente em aplicações com muitas rotas. Mantenha matchers focados e eficientes:

- Retorne cedo quando uma correspondência for impossível
- Evite operações caras como chamadas de API ou expressões regulares complexas
- Considere fazer cache de resultados para padrões de URL repetidos

Embora custom matchers resolvam requisitos complexos de routing elegantemente, o uso excessivo pode tornar a configuração de rotas mais difícil de entender e manter. Reserve custom matchers para cenários onde a correspondência de caminho padrão genuinamente não é suficiente.
