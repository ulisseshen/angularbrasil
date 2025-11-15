<!-- ia-translate: true -->
# Visão Geral de Routing

Para a maioria das aplicações, chega um ponto em que a aplicação requer mais de uma única página. Quando esse momento inevitavelmente chega, routing se torna uma grande parte da história de performance para os usuários.

Nota: Saiba mais sobre [routing no guia detalhado](/guide/routing).

Nesta atividade, você aprenderá como configurar sua aplicação para usar o Angular Router.

<hr>

<docs-workflow>

<docs-step title="Crie um arquivo app.routes.ts">

Dentro de `app.routes.ts`, faça as seguintes alterações:

1. Importe `Routes` do pacote `@angular/router`.
2. Exporte uma constante chamada `routes` do tipo `Routes`, atribua `[]` como valor.

```ts
import {Routes} from '@angular/router';

export const routes: Routes = [];
```

</docs-step>

<docs-step title="Adicione routing ao provider">

Em `app.config.ts`, configure a aplicação para o Angular Router com os seguintes passos:

1. Importe a função `provideRouter` de `@angular/router`.
1. Importe `routes` de `./app.routes.ts`.
1. Chame a função `provideRouter` com `routes` passado como argumento no array `providers`.

<docs-code language="ts" highlight="[2,3,6]">
import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';

export const appConfig: ApplicationConfig = {
providers: [provideRouter(routes)],
};
</docs-code>

</docs-step>

<docs-step title="Importe `RouterOutlet` no component">

Finalmente, para ter certeza de que sua aplicação está pronta para usar o Angular Router, você precisa dizer à aplicação onde você espera que o router exiba o conteúdo desejado. Faça isso usando a directive `RouterOutlet` de `@angular/router`.

Atualize o template do `App` adicionando `<router-outlet />`

<docs-code language="angular-ts" highlight="[11]">
import {RouterOutlet} from '@angular/router';

@Component({
...
template: `     <nav>
      <a href="/">Home</a>
      |
      <a href="/user">User</a>
    </nav>
    <router-outlet />
  `,
imports: [RouterOutlet],
})
export class App {}
</docs-code>

</docs-step>

</docs-workflow>

Sua aplicação agora está configurada para usar o Angular Router. Bom trabalho! 🙌

Continue com o momentum para aprender o próximo passo de definir as rotas para nossa aplicação.
