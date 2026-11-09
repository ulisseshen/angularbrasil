<!-- ia-translate: true -->
# Criando correspondências de rotas customizadas {#creating-custom-route-matches}

O Angular Router suporta uma estratégia de correspondência poderosa que você pode usar para ajudar usuários a navegar na sua aplicação.
Essa estratégia de correspondência suporta rotas estáticas, rotas variáveis com parâmetros, rotas wildcard e assim por diante.
Além disso, construa seu próprio padrão de correspondência customizado para situações em que as URLs são mais complicadas.

Neste tutorial, você construirá um custom route matcher usando o `UrlMatcher` do Angular.
Esse matcher procura por um handle do X (anteriormente Twitter) na URL.

## Objetivos {#objectives}

Implementar o `UrlMatcher` do Angular para criar um custom route matcher.

## Criar uma aplicação de exemplo {#create-a-sample-application}

Usando o Angular CLI, crie uma nova aplicação, _angular-custom-route-match_.
Além do framework padrão de aplicação Angular, você também criará um component _profile_.

1. Crie um novo projeto Angular, _angular-custom-route-match_.

   ```shell
   ng new angular-custom-route-match
   ```

   Quando for perguntado com `Would you like to add Angular routing?`, selecione `Y`.

   Quando for perguntado com `Which stylesheet format would you like to use?`, selecione `CSS`.

   Após alguns instantes, um novo projeto, `angular-custom-route-match`, estará pronto.

1. No seu terminal, navegue até o diretório `angular-custom-route-match`.
1. Crie um component, _profile_.

   ```shell
   ng generate component profile
   ```

1. No seu editor de código, localize o arquivo `profile.html` e substitua o conteúdo placeholder pelo HTML a seguir.

   <docs-code header="profile.html" path="adev/src/content/examples/routing-with-urlmatcher/src/app/profile/profile.html"/>

1. No seu editor de código, localize o arquivo `app.html` e substitua o conteúdo placeholder pelo HTML a seguir.

   <docs-code header="app.html" path="adev/src/content/examples/routing-with-urlmatcher/src/app/app.html"/>

## Configure suas rotas para sua aplicação {#configure-your-routes-for-your-application}

Com o framework da sua aplicação no lugar, você precisa adicionar recursos de routing ao arquivo `app.config.ts`.
Como parte desse processo, você criará um URL matcher customizado que procura por um handle do X na URL.
Esse handle é identificado por um símbolo `@` precedente.

1. No seu editor de código, abra o seu arquivo `app.config.ts`.
1. Adicione um statement `import` para `provideRouter` e `withComponentInputBinding` do Angular, bem como para as rotas da aplicação.

   ```ts
   import {provideRouter, withComponentInputBinding} from '@angular/router';

   import {routes} from './app.routes';
   ```

1. No array de providers, adicione um statement `provideRouter(routes, withComponentInputBinding())`.

1. Defina o custom route matcher adicionando o código a seguir às rotas da aplicação.

   <docs-code header="app.routes.ts" path="adev/src/content/examples/routing-with-urlmatcher/src/app/app.routes.ts" region="matcher"/>

Este custom matcher é uma função que executa as seguintes tarefas:

- O matcher verifica se o array contém apenas um segmento
- O matcher emprega uma expressão regular para garantir que o formato do username corresponda
- Se houver correspondência, a função retorna a URL inteira, definindo um parâmetro de rota `username` como uma substring do caminho
- Se não houver correspondência, a função retorna null e o router continua procurando outras rotas que correspondam à URL

HELPFUL: Um custom URL matcher se comporta como qualquer outra definição de rota. Defina rotas filhas ou rotas lazy loaded da mesma forma que faria com qualquer outra rota.

## Lendo os parâmetros de rota {#reading-the-route-parameters}

Com o custom matcher no lugar, agora você pode vincular o parâmetro de rota no component `profile`.

No seu editor de código, abra o arquivo `profile.ts` e crie um `input` correspondente ao parâmetro `username`.
Adicionamos o recurso `withComponentInputBinding` anteriormente
no `provideRouter`. Isso permite que o `Router` vincule informações diretamente aos components de rota.

```ts
username = input.required<string>();
```

## Teste seu custom URL matcher {#test-your-custom-url-matcher}

Com o seu código no lugar, agora você pode testar seu custom URL matcher.

1. De uma janela de terminal, execute o comando `ng serve`.

   ```shell
   ng serve
   ```

1. Abra um navegador em `http://localhost:4200`.

   Você deve ver uma única página web, composta por uma frase que diz `Navigate to my profile`.

1. Clique no hyperlink **my profile**.

   Uma nova frase, dizendo `Hello, Angular!`, aparece na página.

## Próximos passos {#next-steps}

A correspondência de padrões com o Angular Router oferece muita flexibilidade quando você tem URLs dinâmicas na sua aplicação.
Para saber mais sobre o Angular Router, veja os tópicos a seguir:

<docs-pill-row>
  <docs-pill href="guide/routing/common-router-tasks" title="Roteamento e navegação no app"/>
  <docs-pill href="api/router/Router" title="API do Router"/>
</docs-pill-row>

HELPFUL: Este conteúdo é baseado em [Custom Route Matching with the Angular Router](https://medium.com/@brandontroberts/custom-route-matching-with-the-angular-router-fbdd48665483), por [Brandon Roberts](https://x.com/brandontroberts).
