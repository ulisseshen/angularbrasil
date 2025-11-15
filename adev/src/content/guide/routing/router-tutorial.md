<!-- ia-translate: true -->
# Usando rotas Angular em uma aplicação de página única

Este tutorial descreve como construir uma aplicação de página única, SPA, que usa múltiplas rotas Angular.

Em uma Aplicação de Página Única \(SPA\), todas as funções de sua aplicação existem em uma única página HTML.
Conforme os usuários acessam as funcionalidades de sua aplicação, o navegador precisa renderizar apenas as partes que importam para o usuário, em vez de carregar uma nova página.
Este padrão pode melhorar significativamente a experiência do usuário de sua aplicação.

Para definir como os usuários navegam através de sua aplicação, você usa rotas.
Adicione rotas para definir como os usuários navegam de uma parte de sua aplicação para outra.
Você também pode configurar rotas para proteger contra comportamento inesperado ou não autorizado.

## Objetivos

- Organizar as funcionalidades de uma aplicação de exemplo em módulos.
- Definir como navegar para um component.
- Passar informações para um component usando um parâmetro.
- Estruturar rotas aninhando várias rotas.
- Verificar se os usuários podem acessar uma rota.
- Controlar se a aplicação pode descartar mudanças não salvas.
- Melhorar a performance pré-buscando dados de rotas e fazendo lazy loading de módulos de funcionalidade.
- Exigir critérios específicos para carregar componentes.

## Criar uma aplicação de exemplo

Usando o Angular CLI, crie uma nova aplicação, _angular-router-sample_.
Esta aplicação terá dois componentes: _crisis-list_ e _heroes-list_.

1. Crie um novo projeto Angular, _angular-router-sample_.

   <docs-code language="shell">
   ng new angular-router-sample
   </docs-code>

   Quando perguntado com `Would you like to add Angular routing?`, selecione `N`.

   Quando perguntado com `Which stylesheet format would you like to use?`, selecione `CSS`.

   Após alguns momentos, um novo projeto, `angular-router-sample`, está pronto.

1. Do seu terminal, navegue para o diretório `angular-router-sample`.
1. Crie um component, _crisis-list_.

<docs-code language="shell">
ng generate component crisis-list
</docs-code>

1. No seu editor de código, localize o arquivo, `crisis-list.component.html` e substitua o conteúdo placeholder pelo seguinte HTML.

<docs-code header="src/app/crisis-list/crisis-list.component.html" path="adev/src/content/examples/router-tutorial/src/app/crisis-list/crisis-list.component.html"/>

1. Crie um segundo component, _heroes-list_.

<docs-code language="shell">
ng generate component heroes-list
</docs-code>

1. No seu editor de código, localize o arquivo, `heroes-list.component.html` e substitua o conteúdo placeholder pelo seguinte HTML.

<docs-code header="src/app/heroes-list/heroes-list.component.html" path="adev/src/content/examples/router-tutorial/src/app/heroes-list/heroes-list.component.html"/>

1. No seu editor de código, abra o arquivo, `app.component.html` e substitua seus conteúdos pelo seguinte HTML.

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/router-tutorial/src/app/app.component.html" visibleRegion="setup"/>

1. Verifique se sua nova aplicação funciona como esperado executando o comando `ng serve`.

<docs-code language="shell">
ng serve
</docs-code>

1. Abra um navegador em `http://localhost:4200`.

   Você deve ver uma única página web, consistindo de um título e o HTML de seus dois componentes.

## Defina suas rotas

Nesta seção, você definirá duas rotas:

- A rota `/crisis-center` abre o component `crisis-center`.
- A rota `/heroes-list` abre o component `heroes-list`.

Uma definição de rota é um objeto JavaScript.
Cada rota tipicamente tem duas propriedades.
A primeira propriedade, `path`, é uma string que especifica o caminho da URL para a rota.
A segunda propriedade, `component`, é uma string que especifica qual component sua aplicação deve exibir para aquele caminho.

1. Do seu editor de código, crie e abra o arquivo `app.routes.ts`.
1. Crie e exporte uma lista de rotas para sua aplicação:

   ```ts
   import {Routes} from '@angular/router';

   export const routes = [];
   ```

1. Adicione duas rotas para seus dois primeiros componentes:

   ```ts
   {path: 'crisis-list', component: CrisisListComponent},
   {path: 'heroes-list', component: HeroesListComponent},
   ```

Esta lista de rotas é um array de objetos JavaScript, com cada objeto definindo as propriedades de uma rota.

## Importar `provideRouter` de `@angular/router`

Routing permite que você exiba views específicas de sua aplicação dependendo do caminho da URL.
Para adicionar esta funcionalidade à sua aplicação de exemplo, você precisa atualizar o arquivo `app.config.ts` para usar a função de providers do router, `provideRouter`.
Você importa esta função de provider de `@angular/router`.

1. Do seu editor de código, abra o arquivo `app.config.ts`.
1. Adicione as seguintes declarações de import:

   ```ts
   import { provideRouter } from '@angular/router';
   import { routes } from './app.routes';
   ```

1. Atualize os providers no `appConfig`:

   ```ts
   providers: [provideRouter(routes)]
   ```

Para aplicações baseadas em `NgModule`, coloque o `provideRouter` na lista `providers` do `AppModule`, ou qualquer módulo que seja passado para `bootstrapModule` na aplicação.

## Atualize seu component com `router-outlet`

Neste ponto, você definiu duas rotas para sua aplicação.
Contudo, sua aplicação ainda tem ambos os componentes `crisis-list` e `heroes-list` codificados diretamente no seu template `app.component.html`.
Para que suas rotas funcionem, você precisa atualizar seu template para carregar dinamicamente um component baseado no caminho da URL.

Para implementar esta funcionalidade, você adiciona a directive `router-outlet` ao seu arquivo de template.

1. Do seu editor de código, abra o arquivo `app.component.html`.
1. Delete as seguintes linhas.

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/router-tutorial/src/app/app.component.html" visibleRegion="components"/>

1. Adicione a directive `router-outlet`.

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/router-tutorial/src/app/app.component.html" visibleRegion="router-outlet"/>

1. Adicione `RouterOutlet` aos imports do `AppComponent` em `app.component.ts`

   ```ts
   imports: [RouterOutlet],
   ```

Visualize sua aplicação atualizada no seu navegador.
Você deve ver apenas o título da aplicação.
Para visualizar o component `crisis-list`, adicione `crisis-list` ao final do caminho na barra de endereços do seu navegador.
Por exemplo:

<docs-code language="http">
http://localhost:4200/crisis-list
</docs-code>

Observe que o component `crisis-list` é exibido.
O Angular está usando a rota que você definiu para carregar dinamicamente o component.
Você pode carregar o component `heroes-list` da mesma forma:

<docs-code language="http">
http://localhost:4200/heroes-list
</docs-code>

## Controlar navegação com elementos de UI

Atualmente, sua aplicação suporta duas rotas.
Contudo, a única forma de usar essas rotas é o usuário digitar manualmente o caminho na barra de endereços do navegador.
Nesta seção, você adicionará dois links nos quais os usuários podem clicar para navegar entre os componentes `heroes-list` e `crisis-list`.
Você também adicionará alguns estilos CSS.
Embora esses estilos não sejam obrigatórios, eles facilitam identificar o link para o component atualmente exibido.
Você adicionará essa funcionalidade na próxima seção.

1. Abra o arquivo `app.component.html` e adicione o seguinte HTML abaixo do título.

   <docs-code header="src/app/app.component.html" path="adev/src/content/examples/router-tutorial/src/app/app.component.html" visibleRegion="nav"/>

   Este HTML usa uma directive Angular, `routerLink`.
   Esta directive conecta as rotas que você definiu aos seus arquivos de template.

1. Adicione a directive `RouterLink` à lista de imports de `AppComponent` em `app.component.ts`.

1. Abra o arquivo `app.component.css` e adicione os seguintes estilos.

<docs-code header="src/app/app.component.css" path="adev/src/content/examples/router-tutorial/src/app/app.component.css"/>

Se você visualizar sua aplicação no navegador, deverá ver esses dois links.
Quando você clica em um link, o component correspondente aparece.

## Identificar a rota ativa

Embora os usuários possam navegar sua aplicação usando os links que você adicionou na seção anterior, eles não têm uma forma direta de identificar qual é a rota ativa.
Adicione esta funcionalidade usando a directive `routerLinkActive` do Angular.

1. Do seu editor de código, abra o arquivo `app.component.html`.
1. Atualize as tags âncora para incluir a directive `routerLinkActive`.

<docs-code header="src/app/app.component.html" path="adev/src/content/examples/router-tutorial/src/app/app.component.html" visibleRegion="routeractivelink"/>

1. Adicione a directive `RouterLinkActive` à lista de `imports` de `AppComponent` em `app.component.ts`.

Visualize sua aplicação novamente.
Conforme você clica em um dos botões, o estilo para aquele botão atualiza automaticamente, identificando o component ativo para o usuário.
Ao adicionar a directive `routerLinkActive`, você informa sua aplicação para aplicar uma classe CSS específica à rota ativa.
Neste tutorial, essa classe CSS é `activebutton`, mas você poderia usar qualquer classe que quiser.

Note que também estamos especificando um valor para o `ariaCurrentWhenActive` do `routerLinkActive`. Isso garante que usuários com deficiência visual (que podem não perceber o estilo diferente sendo aplicado) também possam identificar o botão ativo. Para mais informações veja as Boas Práticas de Acessibilidade [seção de identificação de links ativos](/best-practices/a11y#active-links-identification).

## Adicionando um redirect

Nesta etapa do tutorial, você adiciona uma rota que redireciona o usuário para exibir o component `/heroes-list`.

1. Do seu editor de código, abra o arquivo `app.routes.ts`.
1. Atualize a seção `routes` como a seguir.

   ```ts
   {path: '', redirectTo: '/heroes-list', pathMatch: 'full'},
   ```

   Observe que esta nova rota usa uma string vazia como seu caminho.
   Além disso, ela substitui a propriedade `component` por duas novas:

   | Propriedades | Detalhes                                                                                                                                                                                                                                                                                           |
   | :----------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | `redirectTo` | Esta propriedade instrui o Angular a redirecionar de um caminho vazio para o caminho `heroes-list`.                                                                                                                                                                                                         |
   | `pathMatch`  | Esta propriedade instrui o Angular sobre quanto da URL corresponder. Para este tutorial, você deve definir esta propriedade como `full`. Esta estratégia é recomendada quando você tem uma string vazia para um caminho. Para mais informações sobre esta propriedade, veja a [documentação da API Route](api/router/Route). |

Agora quando você abre sua aplicação, ela exibe o component `heroes-list` por padrão.

## Adicionando uma página 404

É possível que um usuário tente acessar uma rota que você não definiu.
Para contabilizar este comportamento, a melhor prática é exibir uma página 404.
Nesta seção, você criará uma página 404 e atualizará sua configuração de rotas para mostrar aquela página para quaisquer rotas não especificadas.

1. Do terminal, crie um novo component, `PageNotFound`.

<docs-code language="shell">
ng generate component page-not-found
</docs-code>

1. Do seu editor de código, abra o arquivo `page-not-found.component.html` e substitua seus conteúdos pelo seguinte HTML.

<docs-code header="src/app/page-not-found/page-not-found.component.html" path="adev/src/content/examples/router-tutorial/src/app/page-not-found/page-not-found.component.html"/>

1. Abra o arquivo `app.routes.ts` e adicione a seguinte rota à lista de rotas:

   ```ts
   {path: '**', component: PageNotFoundComponent}
   ```

   A nova rota usa um caminho, `**`.
   Este caminho é como o Angular identifica uma rota wildcard.
   Qualquer rota que não corresponda a uma rota existente em sua configuração usará esta rota.

IMPORTANTE: Observe que a rota wildcard é colocada no final do array.
A ordem de suas rotas é importante, pois o Angular aplica rotas em ordem e usa a primeira correspondência que encontrar.

Tente navegar para uma rota não existente em sua aplicação, como `http://localhost:4200/powers`.
Esta rota não corresponde a nada definido em seu arquivo `app.routes.ts`.
Contudo, porque você definiu uma rota wildcard, a aplicação automaticamente exibe seu component `PageNotFound`.

## Próximos passos

Neste ponto, você tem uma aplicação básica que usa a funcionalidade de routing do Angular para mudar quais componentes o usuário pode ver baseado no endereço da URL.
Você estendeu essas funcionalidades para incluir um redirect, bem como uma rota wildcard para exibir uma página 404 customizada.

Para mais informações sobre routing, veja os seguintes tópicos:

<docs-pill-row>
  <docs-pill href="guide/routing/common-router-tasks" title="In-app Routing and Navigation"/>
  <docs-pill href="api/router/Router" title="Router API"/>
</docs-pill-row>
