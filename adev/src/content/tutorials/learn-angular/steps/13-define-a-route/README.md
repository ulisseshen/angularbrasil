<!-- ia-translate: true -->
# Definir uma Route

Agora que você configurou a aplicação para usar o Angular Router, você precisa definir as rotas.

Nota: Saiba mais sobre [definir uma rota básica no guia detalhado](/guide/routing/common-router-tasks#defining-a-basic-route).

Nesta atividade, você aprenderá como adicionar e configurar rotas com sua aplicação.

<hr>

<docs-workflow>

<docs-step title="Defina uma rota em `app.routes.ts`">

Em sua aplicação, há duas páginas para exibir: (1) Home Page e (2) User Page.

Para definir uma rota, adicione um objeto de rota ao array `routes` em `app.routes.ts` que contém:

- O `path` da rota (que automaticamente começa no caminho raiz (ou seja, `/`))
- O `component` que você quer que a rota exiba

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

O código acima é um exemplo de como `Home` pode ser adicionado como uma rota. Agora vá em frente e implemente isso junto com o `User` no playground.

Use `'user'` para o path do `User`.

</docs-step>

<docs-step title="Adicione title à definição da rota">

Além de definir as rotas corretamente, o Angular Router também permite que você defina o título da página sempre que os usuários estão navegando, adicionando a propriedade `title` a cada rota.

Em `app.routes.ts`, adicione a propriedade `title` à rota padrão (`path: ''`) e à rota `user`. Aqui está um exemplo:

<docs-code language="ts" highlight="[8]">
import {Routes} from '@angular/router';
import {Home} from './home/home';

export const routes: Routes = [
{
path: '',
title: 'App Home Page',
component: Home,
},
];
</docs-code>

</docs-step>

</docs-workflow>

Na atividade, você aprendeu como definir e configurar rotas em sua aplicação Angular. Bom trabalho. 🙌

A jornada para habilitar completamente o routing em sua aplicação está quase completa, continue assim.
