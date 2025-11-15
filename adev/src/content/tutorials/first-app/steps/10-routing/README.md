<!-- ia-translate: true -->
# Adicione rotas à aplicação

Esta lição do tutorial demonstra como adicionar rotas à sua aplicação.

<docs-video src="https://www.youtube.com/embed/r5DEBMuStPw?si=H6Bx6nLJoMLaMxkx" />

IMPORTANTE: Recomendamos usar seu ambiente local para aprender routing.

## O que você vai aprender

No final desta lição sua aplicação terá suporte para routing.

## Prévia conceitual de routing

Este tutorial introduz routing no Angular. Routing é a habilidade de navegar de um component na aplicação para outro. Em [Single Page Applications (SPA)](guide/routing), apenas partes da página são atualizadas para representar a view solicitada para o usuário.

O [Angular Router](guide/routing) permite que usuários declarem rotas e especifiquem qual component deve ser exibido na tela se aquela rota for solicitada pela aplicação.

Nesta lição, você habilitará routing na sua aplicação para navegar até a página de detalhes.

<docs-workflow>

<docs-step title="Crie um component de detalhes padrão ">
1. Do terminal, digite o seguinte comando para criar o `Details`:

    <docs-code language="shell">
    ng generate component details
    </docs-code>

    Este component representará a página de detalhes que fornece mais informações sobre uma determinada localização de moradia.

</docs-step>

<docs-step title="Adicione routing à aplicação">
1.  No diretório `src/app`, crie um arquivo chamado `routes.ts`. Este arquivo é onde definiremos as rotas na aplicação.

1. Em `main.ts`, faça as seguintes atualizações para habilitar routing na aplicação:
   1. Importe o arquivo de rotas e a função `provideRouter`:

   <docs-code header="Importe detalhes de routing em src/main.ts" path="adev/src/content/tutorials/first-app/steps/11-details-page/src/main.ts" visibleLines="[7,8]"/>
   1. Atualize a chamada a `bootstrapApplication` para incluir a configuração de routing:

   <docs-code header="Adicione configuração de router em src/main.ts" path="adev/src/content/tutorials/first-app/steps/11-details-page/src/main.ts" visibleLines="[10,17]"/>

1. Em `src/app/app.ts`, atualize o component para usar routing:
   1. Adicione imports no nível do arquivo para as directives de router `RouterOutlet` e `RouterLink`:

   <docs-code language="angular-ts" header="Importe directives de router em src/app/app.ts" path="adev/src/content/tutorials/first-app/steps/11-details-page/src/app/app.ts" visibleLines="[3]"/>
   1. Adicione `RouterOutlet` e `RouterLink` aos imports dos metadados do `@Component`

   <docs-code language="angular-ts" header="Adicione directives de router aos imports do component em src/app/app.ts" path="adev/src/content/tutorials/first-app/steps/11-details-page/src/app/app.ts" visibleLines="[6]"/>
   1. Na propriedade `template`, substitua a tag `<app-home></app-home>` pela directive `<router-outlet>` e adicione um link de volta para a página inicial. Seu código deve corresponder a este código:

   <docs-code language="angular-ts" header="Adicione router-outlet em src/app/app.ts" path="adev/src/content/tutorials/first-app/steps/11-details-page/src/app/app.ts" visibleLines="[7,18]"/>

</docs-step>

<docs-step title="Adicione rota ao novo component">
No passo anterior você removeu a referência ao component `<app-home>` no template. Neste passo, você adicionará uma nova rota a esse component.

1. Em `routes.ts`, execute as seguintes atualizações para criar uma rota.
   1. Adicione imports no nível do arquivo para `Home`, `Details` e o tipo `Routes` que você usará nas definições de rota.

   <docs-code header="Importe components e Routes" path="adev/src/content/tutorials/first-app/steps/11-details-page/src/app/routes.ts" visibleLines="[1,3]"/>
   1. Defina uma variável chamada `routeConfig` do tipo `Routes` e defina duas rotas para a aplicação:
      <docs-code header="Adicione rotas à aplicação" path="adev/src/content/tutorials/first-app/steps/11-details-page/src/app/routes.ts" visibleLines="[5,18]"/>

   As entradas no array `routeConfig` representam as rotas na aplicação. A primeira entrada navega para o `Home` sempre que a url corresponder a `''`. A segunda entrada usa alguma formatação especial que será revisitada em uma lição futura.

1. Salve todas as alterações e confirme que a aplicação funciona no browser. A aplicação ainda deve exibir a lista de localizações de moradia.
   </docs-step>

</docs-workflow>

RESUMO: Nesta lição, você habilitou routing na sua aplicação assim como definiu novas rotas. Agora sua aplicação pode suportar navegação entre views. Na próxima lição, você aprenderá a navegar para a página de "detalhes" para uma determinada localização de moradia.

Você está fazendo um ótimo progresso com sua aplicação, muito bem.

Para mais informações sobre os tópicos cobertos nesta lição, visite:

<docs-pill-row>
  <docs-pill href="guide/routing" title="Visão Geral de Routing no Angular"/>
  <docs-pill href="guide/routing/common-router-tasks" title="Tarefas Comuns de Routing"/>
</docs-pill-row>
