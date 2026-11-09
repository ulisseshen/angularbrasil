<!-- ia-translate: true -->
# Definir uma route {#define-a-route}

Agora que você configurou o app para usar o Angular Router, precisa definir as rotas.

NOTE: Saiba mais sobre [definir uma rota básica no guia detalhado](/guide/routing/define-routes).

Nesta atividade, você aprenderá como adicionar e configurar rotas no seu app.

<hr>

<docs-workflow>

<docs-step title="Defina uma route em `app.routes.ts`">

No seu app, há duas páginas para exibir: (1) Home Page e (2) User Page.

Para definir uma route, adicione um objeto de route ao array `routes` em `app.routes.ts`, contendo:

- O `path` da route (que começa automaticamente no caminho raiz, ou seja, `/`)
- O `component` que você quer que a route exiba

```ts
import {Routes} from '@angular/router';
import {Home} from './home/home';

export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
];
```

O código acima é um exemplo de como `Home` pode ser adicionado como uma route. Agora, implemente isso junto com o `User` no playground.

Use `'user'` como path do `User`.

</docs-step>

<docs-step title="Adicione um title à definição da route">

Além de definir as rotas corretamente, o Angular Router também permite que você defina o título da página sempre que os usuários estiverem navegando, adicionando a propriedade `title` a cada route.

Em `app.routes.ts`, adicione a propriedade `title` à route padrão (`path: ''`) e à route `user`. Aqui está um exemplo:

```ts {highlight:[7]}
import {Routes} from '@angular/router';
import {Home} from './home/home';

export const routes: Routes = [
  {
    path: '',
    title: 'App Home Page',
    component: Home,
  },
];
```

</docs-step>

</docs-workflow>

Na atividade, você aprendeu como definir e configurar rotas no seu app Angular. Bom trabalho. 🙌

A jornada para habilitar completamente o routing no seu app está quase completa. Continue assim.
