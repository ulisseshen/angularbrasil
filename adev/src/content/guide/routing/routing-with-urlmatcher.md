<!-- ia-translate: true -->
# Criando correspondências de rotas customizadas

O Angular Router suporta uma estratégia de correspondência poderosa que você pode usar para ajudar usuários a navegar em sua aplicação.
Esta estratégia de correspondência suporta rotas estáticas, rotas variáveis com parâmetros, rotas wildcard e assim por diante.
Além disso, construa seu próprio padrão de correspondência customizado para situações nas quais as URLs são mais complicadas.

Neste tutorial, você construirá um custom route matcher usando o `UrlMatcher` do Angular.
Este matcher procura por um handle do Twitter na URL.

## Objetivos

Implementar o `UrlMatcher` do Angular para criar um custom route matcher.

## Criar uma aplicação de exemplo

Usando o Angular CLI, crie uma nova aplicação, _angular-custom-route-match_.
Além do framework padrão de aplicação Angular, você também criará um component _profile_.

1. Crie um novo projeto Angular, _angular-custom-route-match_.

   ```shell
   ng new angular-custom-route-match
   ```

   Quando perguntado com `Would you like to add Angular routing?`, selecione `Y`.

   Quando perguntado com `Which stylesheet format would you like to use?`, selecione `CSS`.

   Após alguns momentos, um novo projeto, `angular-custom-route-match`, está pronto.

1. Do seu terminal, navegue para o diretório `angular-custom-route-match`.
1. Crie um component, _profile_.

   ```shell
   ng generate component profile
   ```

1. No seu editor de código, localize o arquivo, `profile.component.html` e substitua o conteúdo placeholder pelo seguinte HTML.

<docs-code header="src/app/profile/profile.component.html" path="adev/src/content/examples/routing-with-urlmatcher/src/app/profile/profile.component.html"/>

1. No seu editor de código, localize o arquivo, `app.component.html` e substitua o conteúdo placeholder pelo seguinte HTML.

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/routing-with-urlmatcher/src/app/app.component.html"/>

## Configure suas rotas para sua aplicação

Com o framework de sua aplicação no lugar, você precisa adicionar capacidades de routing ao arquivo `app.config.ts`.
Como parte deste processo, você criará um URL matcher customizado que procura por um handle do Twitter na URL.
Este handle é identificado por um símbolo `@` precedente.

1. No seu editor de código, abra seu arquivo `app.config.ts`.
1. Adicione uma declaração `import` para `provideRouter` e `withComponentInputBinding` do Angular bem como as rotas da aplicação.

   ```ts
   import {provideRouter, withComponentInputBinding} from '@angular/router';

   import {routes} from './app.routes';
   ```

1. No array de providers, adicione uma declaração `provideRouter(routes, withComponentInputBinding())`.

1. Defina o custom route matcher adicionando o seguinte código às rotas da aplicação.

<docs-code header="src/app/app.routes.ts" path="adev/src/content/examples/routing-with-urlmatcher/src/app/app.routes.ts" visibleRegion="matcher"/>

Este custom matcher é uma função que executa as seguintes tarefas:

- O matcher verifica se o array contém apenas um segmento
- O matcher emprega uma expressão regular para garantir que o formato do username seja uma correspondência
- Se houver uma correspondência, a função retorna a URL inteira, definindo um parâmetro de rota `username` como uma substring do caminho
- Se não houver correspondência, a função retorna null e o router continua a procurar por outras rotas que correspondam à URL

DICA: Um custom URL matcher se comporta como qualquer outra definição de rota. Defina rotas filhas ou rotas lazy loaded como você faria com qualquer outra rota.

## Lendo os parâmetros de rota

Com o custom matcher no lugar, você agora pode vincular o parâmetro de rota no component `profile`.

No seu editor de código, abra seu arquivo `profile.component.ts` e crie um `input` correspondente ao parâmetro `username`.
Adicionamos a feature `withComponentInputBinding` anteriormente
no `provideRouter`. Isso permite ao `Router` vincular informações diretamente aos route components.

```ts
username = input.required<string>();
```

## Teste seu custom URL matcher

Com seu código no lugar, você agora pode testar seu custom URL matcher.

1. De uma janela de terminal, execute o comando `ng serve`.

   ```shell
   ng serve
   ```

1. Abra um navegador em `http://localhost:4200`.

   Você deve ver uma única página web, consistindo de uma frase que diz `Navigate to my profile`.

1. Clique no hyperlink **my profile**.

   Uma nova frase, dizendo `Hello, Angular!` aparece na página.

## Próximos passos

Correspondência de padrões com o Angular Router fornece muita flexibilidade quando você tem URLs dinâmicas em sua aplicação.
Para saber mais sobre o Angular Router, veja os seguintes tópicos:

<docs-pill-row>
  <docs-pill href="guide/routing/common-router-tasks" title="In-app Routing and Navigation"/>
  <docs-pill href="api/router/Router" title="Router API"/>
</docs-pill-row>

DICA: Este conteúdo é baseado em [Custom Route Matching with the Angular Router](https://medium.com/@brandontroberts/custom-route-matching-with-the-angular-router-fbdd48665483), por [Brandon Roberts](https://twitter.com/brandontroberts).
