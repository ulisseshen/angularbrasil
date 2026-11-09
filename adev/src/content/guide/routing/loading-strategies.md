<!-- ia-translate: true -->

# Estratégias de carregamento de routes {#route-loading-strategies}

Entender como e quando as routes e os components são carregados no roteamento do Angular é essencial para construir aplicações web responsivas. O Angular oferece duas estratégias principais para controlar o comportamento de carregamento:

1. **Carregados antecipadamente (eager)**: routes e components que são carregados imediatamente
2. **Carregados preguiçosamente (lazy)**: routes e components carregados apenas quando necessário

Cada abordagem oferece vantagens distintas para diferentes cenários.

## Components carregados antecipadamente {#eagerly-loaded-components}

Quando você define uma route com a propriedade [`component`](api/router/Route#component), o component referenciado é carregado antecipadamente como parte do mesmo bundle JavaScript da configuração de routes.

```ts
import {Routes} from '@angular/router';
import {HomePage} from './components/home/home-page';
import {LoginPage} from './components/auth/login-page';

export const routes: Routes = [
  // HomePage e LoginPage são ambos referenciados diretamente nesta configuração,
  // então o código deles é incluído antecipadamente no mesmo bundle JavaScript deste arquivo.
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'login',
    component: LoginPage,
  },
];
```

Carregar antecipadamente os components de route dessa forma significa que o navegador precisa baixar e analisar todo o JavaScript desses components como parte do carregamento inicial da página, mas os components ficam disponíveis para o Angular imediatamente.

Embora incluir mais JavaScript no carregamento inicial leve a tempos de carregamento inicial mais lentos, isso pode gerar transições mais fluidas conforme o usuário navega pela aplicação.

## Components e routes carregados preguiçosamente {#lazily-loaded-components-and-routes}

Você pode usar a propriedade [`loadComponent`](api/router/Route#loadComponent) para carregar preguiçosamente o JavaScript de um component no momento em que aquela route se tornaria ativa. A propriedade [`loadChildren`](api/router/Route#loadChildren) carrega preguiçosamente as routes filhas durante a correspondência de routes.

```ts
import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login-page'),
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.component'),
    loadChildren: () => import('./admin/admin.routes'),
  },
];
```

As propriedades [`loadComponent`](/api/router/Route#loadComponent) e [`loadChildren`](/api/router/Route#loadChildren) aceitam uma função de carregamento que retorna uma Promise que resolve para um component Angular ou para um conjunto de routes, respectivamente. Na maioria dos casos, essa função usa a [API padrão de import dinâmico do JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import). No entanto, você pode usar qualquer função de carregamento assíncrona arbitrária.

Se o arquivo carregado preguiçosamente usar um export `default`, você pode retornar diretamente a Promise do `import()`, sem uma chamada `.then` adicional para selecionar a classe exportada.

Carregar routes preguiçosamente pode melhorar significativamente a velocidade de carregamento da sua aplicação Angular, removendo grandes partes do JavaScript do bundle inicial. Essas partes do seu código são compiladas em "chunks" JavaScript separados, que o router solicita somente quando o usuário visita a route correspondente.

## Carregamento preguiçoso com contexto de injeção {#injection-context-lazy-loading}

O Router executa [`loadComponent`](/api/router/Route#loadComponent) e [`loadChildren`](/api/router/Route#loadChildren) dentro do **contexto de injeção da route atual**, permitindo que você chame [`inject`](/api/core/inject) dentro dessas funções de carregamento para acessar providers declarados naquela route, herdados de routes pai por meio da injeção de dependência hierárquica, ou disponíveis globalmente. Isso possibilita um carregamento preguiçoso sensível ao contexto.

```ts
import {Routes} from '@angular/router';
import {inject} from '@angular/core';
import {FeatureFlags} from './feature-flags';

export const routes: Routes = [
  {
    path: 'dashboard',
    // Executa dentro do contexto de injeção da route
    loadComponent: () => {
      const flags = inject(FeatureFlags);
      return flags.isPremium
        ? import('./dashboard/premium-dashboard')
        : import('./dashboard/basic-dashboard');
    },
  },
];
```

## Devo usar uma route antecipada ou preguiçosa? {#should-i-use-an-eager-or-a-lazy-route}

Há muitos fatores a considerar ao decidir se uma route deve ser antecipada ou preguiçosa.

De modo geral, o carregamento antecipado é recomendado para a(s) página(s) inicial(is) principal(is), enquanto as demais páginas devem ser carregadas preguiçosamente.

NOTE: Embora routes preguiçosas tenham o benefício de desempenho inicial de reduzir a quantidade de dados que o usuário solicita no começo, elas adicionam solicitações de dados futuras que podem ser indesejáveis. Isso é especialmente verdadeiro ao lidar com carregamento preguiçoso aninhado em múltiplos níveis, o que pode impactar significativamente o desempenho.

## Próximos passos {#next-steps}

Saiba como [exibir o conteúdo das suas routes com Outlets](/guide/routing/show-routes-with-outlets).
