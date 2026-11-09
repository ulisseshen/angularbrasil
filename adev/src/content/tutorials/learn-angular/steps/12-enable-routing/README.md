<!-- ia-translate: true -->
# Visão geral de routing {#routing-overview}

Para a maioria das aplicações, chega um momento em que o app precisa de mais de uma única página. Quando esse momento inevitavelmente chega, o routing se torna uma parte importante da história de performance para os usuários.

NOTE: Saiba mais sobre [routing no guia detalhado](/guide/routing).

Nesta atividade, você aprenderá como configurar seu app para usar o Angular Router.

<hr>

<docs-workflow>

<docs-step title="Crie um arquivo app.routes.ts">

Dentro de `app.routes.ts`, faça as seguintes alterações:

1. Importe `Routes` do pacote `@angular/router`.
2. Exporte uma constante chamada `routes` do tipo `Routes` e atribua `[]` como valor.

```ts
import {Routes} from '@angular/router';

export const routes: Routes = [];
```

</docs-step>

<docs-step title="Adicione o routing ao provider">

Em `app.config.ts`, configure o app para o Angular Router com os seguintes passos:

1. Importe a função `provideRouter` de `@angular/router`.
1. Importe `routes` de `./app.routes.ts`.
1. Chame a função `provideRouter` com `routes` passado como argumento no array `providers`.

```ts {highlight:[2,3,6]}
import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)],
};
```

</docs-step>

<docs-step title="Importe `RouterOutlet` no component">

Por fim, para garantir que seu app esteja pronto para usar o Angular Router, você precisa dizer ao app onde espera que o router exiba o conteúdo desejado. Faça isso usando a directive `RouterOutlet` de `@angular/router`.

Atualize o template do `App` adicionando `<router-outlet />`

```angular-ts {highlight:[9]}
@Component({
...
template: `
    <nav>
      <a href="/">Home</a>
      |
      <a href="/user">User</a>
    </nav>
    <router-outlet />
  `,
imports: [RouterOutlet],
})
export class App {}
```

</docs-step>

</docs-workflow>

Seu app agora está configurado para usar o Angular Router. Bom trabalho! 🙌

Continue com o embalo para aprender o próximo passo, que é definir as rotas do nosso app.
