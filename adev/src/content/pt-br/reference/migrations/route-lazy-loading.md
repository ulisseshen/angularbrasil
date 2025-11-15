<!-- ia-translate: true -->
# Migração para routes com lazy loading

Este schematic ajuda desenvolvedores a converter routes de components carregados ansiosamente (eagerly loaded) para routes com lazy loading. Isso permite que o processo de build divida o bundle de produção em partes menores, para evitar um grande bundle JS que inclui todas as routes, o que afeta negativamente o carregamento inicial da página de uma aplicação.

Execute o schematic usando o seguinte comando:

<docs-code language="shell">

ng generate @angular/core:route-lazy-loading

</docs-code>

### Opção de configuração `path`

Por padrão, a migração irá percorrer toda a aplicação. Se você quiser aplicar esta migração a um subconjunto de arquivos, você pode passar o argumento path conforme mostrado abaixo:

<docs-code language="shell">

ng generate @angular/core:route-lazy-loading --path src/app/sub-component

</docs-code>

O valor do parâmetro path é um caminho relativo dentro do projeto.

### Como funciona?

O schematic tentará encontrar todos os lugares onde as routes da aplicação são definidas:

- `RouterModule.forRoot` e `RouterModule.forChild`
- `Router.resetConfig`
- `provideRouter`
- `provideRoutes`
- variáveis do tipo `Routes` ou `Route[]` (ex: `const routes: Routes = [{...}]`)

A migração verificará todos os components nas routes, checará se eles são standalone e carregados ansiosamente, e se for o caso, os converterá para routes com lazy loading.

#### Antes

```typescript
// app.module.ts
import {HomeComponent} from './home/home.component';

@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: 'home',
        // HomeComponent is standalone and eagerly loaded
        component: HomeComponent,
      },
    ]),
  ],
})
export class AppModule {}
```

#### Depois

```typescript
// app.module.ts
@NgModule({
  imports: [
    RouterModule.forRoot([
      {
        path: 'home',
        // ↓ HomeComponent is now lazy loaded
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
      },
    ]),
  ],
})
export class AppModule {}
```

Esta migração também coletará informações sobre todos os components declarados em NgModules e exibirá a lista de routes que os utilizam (incluindo a localização correspondente do arquivo). Considere tornar esses components standalone e execute esta migração novamente. Você pode usar uma migração existente ([veja](reference/migrations/standalone)) para converter esses components para standalone.
