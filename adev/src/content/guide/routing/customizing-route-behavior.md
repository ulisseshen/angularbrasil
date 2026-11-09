<!-- ia-translate: true -->
# Personalizando o comportamento de rotas

O Angular Router oferece pontos de extensão poderosos que permitem personalizar como as rotas se comportam na sua aplicação. Embora o comportamento padrão de roteamento funcione bem para a maioria das aplicações, requisitos específicos frequentemente exigem implementações customizadas para otimização de desempenho, tratamento especializado de URLs ou lógica de roteamento complexa.

A personalização de rotas pode se tornar valiosa quando sua aplicação precisa de:

- **Preservação de estado de componentes** entre navegações para evitar buscar dados novamente
- **Carregamento estratégico de módulos lazy** com base no comportamento do usuário ou nas condições de rede
- **Integração com URLs externas** ou tratamento de rotas do Angular junto com sistemas legados
- **Correspondência dinâmica de rotas** com base em condições de runtime, além de padrões simples de caminho
  patterns

NOTE: Antes de implementar estratégias customizadas, certifique-se de que o comportamento padrão do router não atende às suas necessidades. O roteamento padrão do Angular é otimizado para casos de uso comuns e oferece o melhor equilíbrio entre desempenho e simplicidade. Personalizar estratégias de rotas pode adicionar complexidade ao código e ter implicações de desempenho no uso de memória se não for gerenciado com cuidado.

## Opções de configuração do router {#router-configuration-options}

O `withRouterConfig` ou o `RouterModule.forRoot` permite fornecer `RouterConfigOptions` adicionais para ajustar o comportamento do Router.

### Lidar com navegações canceladas {#handle-canceled-navigations}

`canceledNavigationResolution` controla como o Router restaura o histórico do browser quando uma navegação é cancelada. O valor padrão é `'replace'`, que reverte para a URL anterior à navegação com `location.replaceState`. Na prática, isso significa que, sempre que a barra de endereços já tiver sido atualizada para a navegação, como ao usar os botões de voltar ou avançar do browser, a entrada do histórico é sobrescrita pelo "rollback" caso a navegação falhe ou seja rejeitada por um guard.
Mudar para `'computed'` mantém o índice do histórico em andamento sincronizado com a navegação do Angular, então cancelar uma navegação do botão de voltar dispara uma navegação para frente (e vice-versa) para retornar à página original.

Esta configuração é mais útil quando sua aplicação usa `urlUpdateStrategy: 'eager'` ou quando guards frequentemente cancelam navegações popstate iniciadas pelo browser.

```ts
provideRouter(routes, withRouterConfig({canceledNavigationResolution: 'computed'}));
```

### Reagir a navegações para a mesma URL {#react-to-same-url-navigations}

`onSameUrlNavigation` configura o que deve acontecer quando o usuário pede para navegar para a URL atual. O padrão `'ignore'` pula o trabalho, enquanto `'reload'` instrui o Router a processar a URL no seu pipeline de navegação em vez de ignorá-la. A reexecução de guards e resolvers é controlada por [`runGuardsAndResolvers`](api/router/RunGuardsAndResolvers), e a reutilização de componentes é determinada pela [estratégia de reutilização de rotas](#route-reuse-strategy).

Isso é útil quando você quer que cliques repetidos em um filtro de lista, em um item da navegação lateral ou em um botão de atualizar disparem uma nova busca de dados, mesmo que a URL não mude.

```ts
provideRouter(routes, withRouterConfig({onSameUrlNavigation: 'reload'}));
```

Você também pode controlar esse comportamento em navegações individuais, em vez de globalmente. Isso permite manter o padrão `'ignore'` enquanto habilita seletivamente o comportamento de reload para casos de uso específicos:

```ts
router.navigate(['/some-path'], {onSameUrlNavigation: 'reload'});
```

TIP: Se você usa [recursos de rota](/guide/routing/data-fetching-with-resources#reloading-resources-without-renavigation), pode atualizar os dados sob demanda chamando `.reload()` no recurso ou atualizando os signals lidos em `params`, sem precisar configurar `onSameUrlNavigation` nem disparar uma navegação do router.

### Controlar a herança de parâmetros {#control-parameter-inheritance}

`paramsInheritanceStrategy` define como os parâmetros e os dados de rota fluem a partir das rotas pai.

Por padrão (`'always'`), as rotas filhas herdam automaticamente os parâmetros, os dados de rota e os valores resolvidos das rotas pai. Isso garante que os parâmetros de matriz, os dados de rota e os valores resolvidos estejam disponíveis mais abaixo na árvore de rotas, o que é útil quando você compartilha identificadores contextuais entre áreas de funcionalidades, como:

```text {hideCopy}
/org/:orgId/projects/:projectId/customers/:customerId
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
            component: Customer,
          },
        ],
      },
    ],
  },
];
```

```ts
@Component({/* ... */})
export class Customer {
  private route = inject(ActivatedRoute);

  // Todos os parâmetros dos pais ficam disponíveis diretamente
  orgId = this.route.snapshot.params['orgId'];
  projectId = this.route.snapshot.params['projectId'];
  customerId = this.route.snapshot.params['customerId'];
}
```

Para restaurar o comportamento legado, defina `paramsInheritanceStrategy` como `'emptyOnly'`. Com `'emptyOnly'`, as rotas filhas herdam parâmetros apenas quando o caminho delas está vazio ou quando a rota pai não declara um component:

```ts
provideRouter(routes, withRouterConfig({paramsInheritanceStrategy: 'emptyOnly'}));
```

Nesse caso, o componente `Customer` precisa ler os parâmetros do pai a partir das rotas ancestrais:

```ts
@Component({/* ... */})
export class Customer {
  private route = inject(ActivatedRoute);

  orgId = this.route.parent?.parent?.snapshot.params['orgId'];
  projectId = this.route.parent?.snapshot.params['projectId'];
  customerId = this.route.snapshot.params['customerId'];
}
```

### Decidir quando a URL é atualizada {#decide-when-the-url-updates}

`urlUpdateStrategy` determina quando o Angular escreve na barra de endereços do browser. O padrão `'deferred'` espera por uma navegação bem-sucedida antes de alterar a URL. Use `'eager'` para atualizar a URL imediatamente, assim que a navegação começar. Atualizações eager facilitam exibir a URL tentada caso a navegação falhe por causa de guards ou erros, mas podem mostrar brevemente uma URL em andamento se você tiver guards de longa duração.

Considere isso quando seu pipeline de analytics precisar enxergar a rota tentada, mesmo que guards a bloqueiem.

```ts
provideRouter(routes, withRouterConfig({urlUpdateStrategy: 'eager'}));
```

### Escolher o tratamento padrão de parâmetros de consulta {#choose-default-query-parameter-handling}

`defaultQueryParamsHandling` define o comportamento de fallback para `Router.createUrlTree` quando a chamada não especifica `queryParamsHandling`. `'replace'` é o padrão e substitui a query string existente. `'merge'` combina os valores fornecidos com os atuais, e `'preserve'` mantém os parâmetros de consulta existentes, a menos que você forneça novos explicitamente.

```ts
provideRouter(routes, withRouterConfig({defaultQueryParamsHandling: 'merge'}));
```

Isso é especialmente útil em páginas de busca e filtro, para manter automaticamente os filtros existentes quando parâmetros adicionais são fornecidos.

### Configurar o tratamento de barra final {#configure-trailing-slash-handling}

Por padrão, o serviço `Location` remove as barras finais das URLs ao lê-las.

Você pode configurar o serviço `Location` para forçar uma barra final em todas as URLs escritas no browser, fornecendo a `TrailingSlashPathLocationStrategy` na sua aplicação.

```ts
import {LocationStrategy, TrailingSlashPathLocationStrategy} from '@angular/common';
import {bootstrapApplication} from '@angular/platform-browser';

bootstrapApplication(App, {
  providers: [{provide: LocationStrategy, useClass: TrailingSlashPathLocationStrategy}],
});
```

Você também pode forçar o serviço `Location` a nunca ter barra final em todas as URLs escritas no browser, fornecendo a `NoTrailingSlashPathLocationStrategy` na sua aplicação.

```ts
import {LocationStrategy, NoTrailingSlashPathLocationStrategy} from '@angular/common';
import {bootstrapApplication} from '@angular/platform-browser';

bootstrapApplication(App, {
  providers: [{provide: LocationStrategy, useClass: NoTrailingSlashPathLocationStrategy}],
});
```

Essas estratégias afetam apenas a URL escrita no browser.
`Location.path()` e `Location.normalize()` continuarão removendo as barras finais ao ler a URL.

O Angular Router expõe quatro áreas principais para customização:

  <docs-pill-row>
    <docs-pill href="#route-reuse-strategy" title="Estratégia de reutilização de rotas"/>
    <docs-pill href="#preloading-strategy" title="Estratégia de pré-carregamento"/>
    <docs-pill href="#url-handling-strategy" title="Estratégia de tratamento de URLs"/>
    <docs-pill href="#custom-route-matchers" title="Matchers de rota customizados"/>
  </docs-pill-row>

## Estratégia de reutilização de rotas {#route-reuse-strategy}

A estratégia de reutilização de rotas controla se o Angular destrói e recria componentes durante a navegação ou se os preserva para reutilização. Por padrão, o Angular destrói as instâncias de componentes ao navegar para fora de uma rota e cria novas instâncias ao navegar de volta.

### Quando implementar a reutilização de rotas {#when-to-implement-route-reuse}

Estratégias customizadas de reutilização de rotas beneficiam aplicações que precisam de:

- **Preservação de estado de formulários** - Manter formulários parcialmente preenchidos quando os usuários navegam para fora e voltam
- **Retenção de dados custosos** - Evitar buscar novamente grandes conjuntos de dados ou cálculos complexos
- **Manutenção da posição de rolagem** - Preservar a posição de rolagem em listas longas ou em implementações de rolagem infinita
- **Interfaces do tipo abas** - Manter o estado dos componentes ao alternar entre abas

### Criando uma estratégia customizada de reutilização de rotas {#creating-a-custom-route-reuse-strategy}

A classe `RouteReuseStrategy` do Angular permite customizar o comportamento de navegação por meio do conceito de "detached route handles".

"Detached route handles" são a forma que o Angular usa para armazenar instâncias de componentes e toda a sua hierarquia de views. Quando uma rota é desanexada, o Angular preserva a instância do componente, seus componentes filhos e todo o estado associado na memória. Esse estado preservado pode ser reanexado posteriormente, quando você voltar para a rota.

A classe `RouteReuseStrategy` fornece os seguintes métodos, que controlam o ciclo de vida dos componentes das rotas:

| Método                                                                         | Descrição                                                                                                                                |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| [`shouldDetach`](api/router/RouteReuseStrategy#shouldDetach)                   | Determina se uma rota deve ser armazenada para reutilização posterior ao navegar para fora                                               |
| [`store`](api/router/RouteReuseStrategy#store)                                 | Armazena o detached route handle quando `shouldDetach` retorna true                                                                      |
| [`shouldAttach`](api/router/RouteReuseStrategy#shouldAttach)                   | Determina se uma rota armazenada deve ser reanexada ao navegar para ela                                                                  |
| [`retrieve`](api/router/RouteReuseStrategy#retrieve)                           | Retorna o detached route handle armazenado anteriormente para reanexação                                                                 |
| [`shouldReuseRoute`](api/router/RouteReuseStrategy#shouldReuseRoute)           | Determina se o router deve reutilizar a instância atual da rota em vez de destruí-la durante a navegação                                 |
| [`shouldDestroyInjector`](api/router/RouteReuseStrategy#shouldDestroyInjector) | Determina se o router deve destruir o injector de uma rota desanexada quando ela não está mais armazenada                                |

O exemplo a seguir demonstra uma estratégia customizada de reutilização de rotas que preserva seletivamente o estado do componente com base nos metadados da rota:

```ts
import {
  RouteReuseStrategy,
  Route,
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
} from '@angular/router';
import {Injectable} from '@angular/core';

@Injectable()
export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  private handlers = new Map<Route | null, DetachedRouteHandle>();

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // Determina se uma rota deve ser armazenada para reutilização posterior
    return route.data['reuse'] === true;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    // Armazena o detached route handle quando shouldDetach retorna true
    if (handle && route.data['reuse'] === true) {
      const key = this.getRouteKey(route);
      this.handlers.set(key, handle);
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    // Verifica se uma rota armazenada deve ser reanexada
    const key = this.getRouteKey(route);
    return route.data['reuse'] === true && this.handlers.has(key);
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    // Retorna o detached route handle armazenado para reanexação
    const key = this.getRouteKey(route);
    return route.data['reuse'] === true ? (this.handlers.get(key) ?? null) : null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    // Determina se o router deve reutilizar a instância atual da rota
    return future.routeConfig === curr.routeConfig;
  }

  private getRouteKey(route: ActivatedRouteSnapshot): Route | null {
    return route.routeConfig;
  }
}
```

IMPORTANT: Os [recursos](guide/routing/data-fetching-with-resources#resource-inheritance) de rota herdados não funcionam com uma `RouteReuseStrategy` customizada que desanexa uma rota sem também desanexar os ancestrais dos quais ela depende.

### Destruindo manualmente detached route handles {#manually-destroying-detached-route-handles}

Ao implementar uma `RouteReuseStrategy` customizada, pode ser necessário destruir manualmente um `DetachedRouteHandle` caso você decida descartá-lo sem reanexá-lo. Por exemplo, se sua estratégia tiver um limite de tamanho de cache ou expirar os handles após um certo tempo, você precisa garantir que o componente e o seu estado sejam destruídos corretamente para evitar vazamentos de memória.

Como `DetachedRouteHandle` é um tipo opaco, você não pode chamar um método de destruição diretamente nele. Em vez disso, use a função `destroyDetachedRouteHandle` fornecida pelo Router.

```ts
import {destroyDetachedRouteHandle} from '@angular/router';

// ... dentro da sua estratégia
if (this.handles.size > MAX_CACHE_SIZE) {
  const handle = this.handles.get(oldestKey);
  if (handle) {
    destroyDetachedRouteHandle(handle);
    this.handles.delete(oldestKey);
  }
}
```

NOTE: Evite usar o caminho da rota como chave quando houver guards `canMatch` envolvidos, pois isso pode levar a entradas duplicadas.

### Limpeza automática de injectors de rotas não utilizados {#automatic-cleanup-of-unused-route-injectors}

Por padrão, o Angular não destrói os injectors de rotas desanexadas, mesmo que elas não estejam mais armazenadas pela `RouteReuseStrategy`. Isso acontece principalmente porque esse nível de gerenciamento de memória geralmente não é necessário na maioria das aplicações.

Para ativar a limpeza automática de injectors de rotas não utilizados, use o recurso `withAutoCleanupInjectors` na configuração do router. Esse recurso verifica quais rotas estão armazenadas atualmente pela estratégia após as navegações e destrói os injectors de quaisquer rotas desanexadas que não estejam armazenadas pela estratégia de reutilização.

```ts
import {provideRouter, withAutoCleanupInjectors} from '@angular/router';
import {ApplicationConfig} from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withAutoCleanupInjectors())],
};
```

Se você não fornecer uma `RouteReuseStrategy` customizada, ou se a sua estratégia customizada estender `BaseRouteReuseStrategy`, os injectors serão destruídos quando a rota estiver inativa.

#### Limpeza com um `RouteReuseStrategy` customizado {#cleanup-with-a-custom-routereusestrategy}

Se a sua aplicação usa uma `RouteReuseStrategy` customizada _e_ a estratégia não estende `BaseRouteReuseStrategy`, você precisa implementar `shouldDestroyInjector` para informar ao router quais rotas devem ter seus injectors destruídos:

```ts
@Injectable()
export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  // ... outros métodos

  shouldDestroyInjector(route: Route): boolean {
    return !route.data['retainInjector'];
  }
}
```

Se a sua estratégia armazenar um `DetachedRouteHandle`, você também precisará informar isso ao Router, para que ele não destrua nenhum injector necessário por esse handle desanexado:

```ts
@Injectable()
export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  private readonly handles = new Map<Route, DetachedRouteHandle>();

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null) {
    if (handle) {
      this.handles.set(route.routeConfig!, handle);
    }
  }

  retrieveStoredRouteHandles(): DetachedRouteHandle[] {
    return Array.from(this.handles.values());
  }

  // ... outros métodos
}
```

### Configurando uma rota para usar uma estratégia customizada de reutilização de rotas {#configuring-a-route-to-use-a-custom-route-reuse-strategy}

As rotas podem optar pelo comportamento de reutilização por meio dos metadados de configuração da rota. Essa abordagem mantém a lógica de reutilização separada do código do componente, facilitando ajustar o comportamento sem modificar os componentes:

```ts
export const routes: Routes = [
  {
    path: 'products',
    component: ProductList,
    data: {reuse: true}, // O estado do componente persiste entre navegações
  },
  {
    path: 'products/:id',
    component: ProductDetail,
    // Sem flag de reutilização - o componente é recriado a cada navegação
  },
  {
    path: 'search',
    component: Search,
    data: {reuse: true}, // Preserva os resultados da busca e o estado dos filtros
  },
];
```

Você também pode configurar uma estratégia customizada de reutilização de rotas no nível da aplicação, por meio do sistema de injeção de dependência do Angular. Nesse caso, o Angular cria uma única instância da estratégia, que gerencia todas as decisões de reutilização de rotas em toda a aplicação:

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy},
  ],
};
```

## Estratégia de pré-carregamento {#preloading-strategy}

As estratégias de pré-carregamento determinam quando o Angular carrega, em segundo plano, os módulos de rotas com lazy loading. Enquanto o lazy loading melhora o tempo de carregamento inicial ao adiar o download dos módulos, os usuários ainda experimentam um atraso quando navegam pela primeira vez para uma rota lazy. As estratégias de pré-carregamento eliminam esse atraso ao carregar os módulos antes que os usuários os solicitem.

### Estratégias de pré-carregamento integradas {#built-in-preloading-strategies}

O Angular oferece duas estratégias de pré-carregamento prontas para uso:

| Estratégia                                          | Descrição                                                                                                                             |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| [`NoPreloading`](api/router/NoPreloading)           | A estratégia padrão, que desabilita todo o pré-carregamento. Em outras palavras, os módulos só são carregados quando os usuários navegam até eles |
| [`PreloadAllModules`](api/router/PreloadAllModules) | Carrega todos os módulos lazy imediatamente após a navegação inicial                                                                  |

A estratégia `PreloadAllModules` pode ser configurada da seguinte forma:

```ts
import {ApplicationConfig} from '@angular/core';
import {provideRouter, withPreloading, PreloadAllModules} from '@angular/router';
import {routes} from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withPreloading(PreloadAllModules))],
};
```

A estratégia `PreloadAllModules` funciona bem para aplicações pequenas e médias, nas quais baixar todos os módulos não impacta significativamente o desempenho. No entanto, aplicações maiores, com muitos módulos de funcionalidades, podem se beneficiar de um pré-carregamento mais seletivo.

### Criando uma estratégia customizada de pré-carregamento {#creating-a-custom-preloading-strategy}

As estratégias customizadas de pré-carregamento implementam a interface `PreloadingStrategy`, que exige um único método `preload`. Esse método recebe a configuração da rota e uma função que dispara o carregamento real do módulo. A estratégia retorna um Observable que emite quando o pré-carregamento é concluído, ou um Observable vazio para pular o pré-carregamento:

```ts
import {Injectable} from '@angular/core';
import {PreloadingStrategy, Route} from '@angular/router';
import {Observable, of, timer} from 'rxjs';
import {mergeMap} from 'rxjs/operators';

@Injectable()
export class SelectivePreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // Pré-carrega apenas as rotas marcadas com data: { preload: true }
    if (route.data?.['preload']) {
      return load();
    }
    return of(null);
  }
}
```

Essa estratégia seletiva verifica os metadados da rota para determinar o comportamento do pré-carregamento. As rotas podem optar pelo pré-carregamento por meio da sua configuração:

```ts
import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.routes'),
    data: {preload: true}, // Pré-carrega imediatamente após a navegação inicial
  },
  {
    path: 'reports',
    loadChildren: () => import('./reports/reports.routes'),
    data: {preload: false}, // Só é carregada quando o usuário navega para reports
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes'),
    // Sem flag de preload - não será pré-carregada
  },
];
```

### Considerações de desempenho para pré-carregamento {#performance-considerations-for-preloading}

O pré-carregamento impacta tanto o uso de rede quanto o consumo de memória. Cada módulo pré-carregado consome banda e aumenta a pegada de memória da aplicação. Usuários em dispositivos móveis com conexões medidas podem preferir um pré-carregamento mínimo, enquanto usuários de desktop em redes rápidas podem lidar com estratégias de pré-carregamento mais agressivas.

O momento do pré-carregamento também importa. Um pré-carregamento imediato após o carregamento inicial pode competir com outros recursos críticos, como imagens ou chamadas de API. As estratégias devem considerar o comportamento da aplicação após o carregamento e coordenar-se com outras tarefas em segundo plano para evitar degradação de desempenho.

Os limites de recursos do browser também afetam o comportamento do pré-carregamento. Os browsers limitam o número de conexões HTTP simultâneas, então um pré-carregamento agressivo pode ficar na fila atrás de outras requisições. Service workers podem ajudar, oferecendo controle refinado sobre o cache e as requisições de rede, complementando a estratégia de pré-carregamento.

## Estratégia de tratamento de URLs {#url-handling-strategy}

As estratégias de tratamento de URLs determinam quais URLs o Angular router processa e quais ele ignora. Por padrão, o Angular tenta tratar todos os eventos de navegação dentro da aplicação, mas aplicações do mundo real frequentemente precisam coexistir com outros sistemas, tratar links externos ou integrar-se com aplicações legadas que gerenciam as próprias rotas.

A classe `UrlHandlingStrategy` oferece controle sobre essa fronteira entre as rotas gerenciadas pelo Angular e as URLs externas. Isso se torna essencial ao migrar aplicações para o Angular de forma incremental ou quando aplicações Angular precisam compartilhar o espaço de URLs com outros frameworks.

### Implementando uma estratégia customizada de tratamento de URLs {#implementing-a-custom-url-handling-strategy}

As estratégias customizadas de tratamento de URLs estendem a classe `UrlHandlingStrategy` e implementam três métodos. O método `shouldProcessUrl` determina se o Angular deve tratar uma determinada URL, `extract` retorna a parte da URL que o Angular deve processar, e `merge` combina o fragmento da URL com o restante dela:

```ts
import {Injectable} from '@angular/core';
import {UrlHandlingStrategy, UrlTree} from '@angular/router';

@Injectable()
export class CustomUrlHandlingStrategy implements UrlHandlingStrategy {
  shouldProcessUrl(url: UrlTree): boolean {
    // Trata apenas URLs que começam com /app ou /admin
    return url.toString().startsWith('/app') || url.toString().startsWith('/admin');
  }

  extract(url: UrlTree): UrlTree {
    // Retorna a URL sem alterações se ela deve ser processada
    return url;
  }

  merge(newUrlPart: UrlTree, rawUrl: UrlTree): UrlTree {
    // Combina o fragmento da URL com o restante da URL
    return newUrlPart;
  }
}
```

Essa estratégia cria fronteiras claras no espaço de URLs. O Angular trata os caminhos `/app` e `/admin`, enquanto ignora todo o resto. Esse padrão funciona bem ao migrar aplicações legadas, em que o Angular controla seções específicas enquanto o sistema legado mantém as demais.

### Configurando uma estratégia customizada de tratamento de URLs {#configuring-a-custom-url-handling-strategy}

Você pode registrar uma estratégia customizada por meio do sistema de injeção de dependência do Angular:

```ts
import {ApplicationConfig} from '@angular/core';
import {provideRouter, UrlHandlingStrategy} from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {provide: UrlHandlingStrategy, useClass: CustomUrlHandlingStrategy},
  ],
};
```

## Matchers de rota customizados {#custom-route-matchers}

Por padrão, o router do Angular percorre as rotas na ordem em que são definidas, tentando corresponder o caminho da URL ao padrão de caminho de cada rota. Ele oferece suporte a segmentos estáticos, segmentos parametrizados (`:id`) e curingas (`**`). A primeira rota que corresponde vence, e o router interrompe a busca.

Quando as aplicações exigem uma lógica de correspondência mais sofisticada, baseada em condições de runtime, padrões de URL complexos ou outras regras customizadas, os matchers customizados oferecem essa flexibilidade sem comprometer a simplicidade das rotas padrão.

O router avalia os matchers customizados durante a fase de correspondência de rotas, antes que a correspondência de caminho ocorra. Quando um matcher retorna uma correspondência bem-sucedida, ele também pode extrair parâmetros da URL, tornando-os disponíveis para o componente ativado da mesma forma que os parâmetros de rota padrão.

### Criando um matcher customizado {#creating-a-custom-matcher}

Um matcher customizado é uma função que recebe os segmentos da URL e retorna um resultado de correspondência com os segmentos consumidos e os parâmetros, ou `null` para indicar que não há correspondência. A função do matcher é executada antes que o Angular avalie a propriedade `path` da rota:

```ts
import {Route, UrlSegment, UrlSegmentGroup, UrlMatchResult} from '@angular/router';

export function customMatcher(
  segments: UrlSegment[],
  group: UrlSegmentGroup,
  route: Route,
): UrlMatchResult | null {
  // Lógica de correspondência aqui
  if (matchSuccessful) {
    return {
      consumed: segments,
      posParams: {
        paramName: new UrlSegment('paramValue', {}),
      },
    };
  }
  return null;
}
```

### Implementando roteamento baseado em versão {#implementing-version-based-routing}

Considere um site de documentação de API que precisa rotear com base em números de versão presentes na URL. Versões diferentes podem ter estruturas de componentes ou conjuntos de funcionalidades diferentes:

```ts
import {Routes, UrlSegment, UrlMatchResult} from '@angular/router';

export function versionMatcher(segments: UrlSegment[]): UrlMatchResult | null {
  // Corresponde a padrões como /v1/docs, /v2.1/docs, /v3.0.1/docs
  if (segments.length >= 2 && segments[0].path.match(/^v\d+(\.\d+)*$/)) {
    return {
      consumed: segments.slice(0, 2), // Consome a versão e 'docs'
      posParams: {
        version: segments[0], // Disponibiliza a versão como parâmetro
        section: segments[1], // Disponibiliza também a seção
      },
    };
  }
  return null;
}

// Configuração de rotas
export const routes: Routes = [
  {
    matcher: versionMatcher,
    component: Documentation,
  },
  {
    path: 'latest/docs',
    redirectTo: 'v3/docs',
  },
];
```

O componente recebe os parâmetros extraídos por meio de inputs de rota:

```angular-ts
import {Component, input, inject, resource} from '@angular/core';

@Component({
  selector: 'app-documentation',
  template: `
    @if (documentation.isLoading()) {
      <div>Carregando documentação...</div>
    } @else if (documentation.error()) {
      <div>Erro ao carregar a documentação</div>
    } @else if (documentation.value(); as docs) {
      <article>{{ docs.content }}</article>
    }
  `,
})
export class Documentation {
  // Os parâmetros de rota são vinculados automaticamente a signal inputs
  version = input.required<string>(); // Recebe o parâmetro version
  section = input.required<string>(); // Recebe o parâmetro section

  private docsService = inject(DocumentationService);

  // O resource carrega a documentação automaticamente quando version ou section mudam
  documentation = resource({
    params: () => {
      if (!this.version() || !this.section()) return;

      return {
        version: this.version(),
        section: this.section(),
      };
    },
    loader: ({params}) => {
      return this.docsService.loadDocumentation(params.version, params.section);
    },
  });
}
```

### Roteamento com reconhecimento de locale {#locale-aware-routing}

Aplicações internacionais frequentemente codificam informações de locale nas URLs. Um matcher customizado pode extrair códigos de locale e rotear para os componentes apropriados, disponibilizando o locale como parâmetro:

```ts
// Locales suportados
const locales = ['en', 'es', 'fr', 'de', 'ja', 'zh'];

export function localeMatcher(segments: UrlSegment[]): UrlMatchResult | null {
  if (segments.length > 0) {
    const potentialLocale = segments[0].path;

    if (locales.includes(potentialLocale)) {
      // É um prefixo de locale: consome-o e continua a correspondência
      return {
        consumed: [segments[0]],
        posParams: {
          locale: segments[0],
        },
      };
    } else {
      // Sem prefixo de locale: usa o locale padrão
      return {
        consumed: [], // Não consome nenhum segmento
        posParams: {
          locale: new UrlSegment('en', {}),
        },
      };
    }
  }

  return null;
}
```

### Correspondência de lógica de negócio complexa {#complex-business-logic-matching}

Matchers customizados se destacam ao implementar regras de negócio que seriam difíceis de expressar em padrões de caminho. Considere um site de e-commerce em que as URLs dos produtos seguem padrões diferentes com base no tipo do produto:

```ts
export function productMatcher(segments: UrlSegment[]): UrlMatchResult | null {
  if (segments.length === 0) return null;

  const firstSegment = segments[0].path;

  // Livros: /isbn-1234567890
  if (firstSegment.startsWith('isbn-')) {
    return {
      consumed: [segments[0]],
      posParams: {
        productType: new UrlSegment('book', {}),
        identifier: new UrlSegment(firstSegment.substring(5), {}),
      },
    };
  }

  // Eletrônicos: /sku/ABC123
  if (firstSegment === 'sku' && segments.length > 1) {
    return {
      consumed: segments.slice(0, 2),
      posParams: {
        productType: new UrlSegment('electronics', {}),
        identifier: segments[1],
      },
    };
  }

  // Vestuário: /style/BRAND/ITEM
  if (firstSegment === 'style' && segments.length > 2) {
    return {
      consumed: segments.slice(0, 3),
      posParams: {
        productType: new UrlSegment('clothing', {}),
        brand: segments[1],
        identifier: segments[2],
      },
    };
  }

  return null;
}
```

### Considerações de desempenho para matchers customizados {#performance-considerations-for-custom-matchers}

Os matchers customizados são executados a cada tentativa de navegação até que uma correspondência seja encontrada. Por isso, uma lógica de correspondência complexa pode impactar o desempenho da navegação, especialmente em aplicações com muitas rotas. Mantenha os matchers focados e eficientes:

- Retorne cedo quando uma correspondência for impossível
- Evite operações custosas, como chamadas de API ou expressões regulares complexas
- Considere armazenar em cache os resultados de padrões de URL que se repetem

Embora os matchers customizados resolvam requisitos complexos de roteamento com elegância, o uso excessivo pode tornar a configuração das rotas mais difícil de entender e manter. Reserve os matchers customizados para cenários em que a correspondência de caminho padrão realmente não é suficiente.
