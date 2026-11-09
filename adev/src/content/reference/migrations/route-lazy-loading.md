<!-- ia-translate: true -->
# Migração para rotas com lazy-loading {#migration-to-lazy-loaded-routes}

Este schematic ajuda desenvolvedores a converter rotas de components carregadas de forma eager para rotas com lazy loading. Isso permite que o processo de build divida o bundle de produção em chunks menores, evitando um grande bundle JS que inclui todas as rotas, o que afeta negativamente o carregamento inicial da página de uma aplicação.

Execute o schematic usando o seguinte comando:

```shell
ng generate @angular/core:route-lazy-loading
```

### Opção de configuração `path` {#path-config-option}

Por padrão, a migração percorrerá toda a aplicação. Se você quiser aplicar esta migração a um subconjunto dos arquivos, pode passar o argumento path como mostrado abaixo:

```shell
ng generate @angular/core:route-lazy-loading --path src/app/sub-component
```

O valor do parâmetro path é um caminho relativo dentro do projeto.

### Como funciona? {#how-does-it-work}

O schematic tentará encontrar todos os lugares onde as rotas da aplicação são definidas:

- `RouterModule.forRoot` e `RouterModule.forChild`
- `Router.resetConfig`
- `provideRouter`
- variáveis do tipo `Routes` ou `Route[]` (por exemplo, `const routes: Routes = [{...}]`)

A migração verificará todos os components nas rotas, checará se eles são standalone e carregados de forma eager e, se forem, os converterá para rotas lazy loaded.

#### Antes {#before}

```typescript {header: "app.module.ts"}
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {Home} from './home';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: 'home',
        // Home é standalone e carregado de forma eager
        component: Home,
      },
    ]),
  ],
})
export class AppModule {}
```

#### Depois {#after}

```typescript {header: "app.module.ts"}
@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: 'home',
        // ↓ Home agora é lazy loaded
        loadComponent: () => import('./home').then((m) => m.Home),
      },
    ]),
  ],
})
export class AppModule {}
```

Esta migração também coletará informações sobre todos os components declarados em NgModules e exibirá a lista de rotas que os utilizam (incluindo a localização correspondente do arquivo). Considere tornar esses components standalone e executar esta migração novamente. Você pode usar uma migração existente ([veja](reference/migrations/standalone)) para converter esses components em standalone.
