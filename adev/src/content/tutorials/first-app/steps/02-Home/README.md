<!-- ia-translate: true -->
# Criar component Home

Esta lição do tutorial demonstra como criar um novo [component](guide/components) para sua aplicação Angular.

<docs-video src="https://www.youtube.com/embed/R0nRX8jD2D0?si=OMVaw71EIa44yIOJ"/>

## O que você aprenderá

Sua aplicação tem um novo component: `Home`.

## Pré-visualização conceitual de components Angular

Aplicações Angular são construídas em torno de components, que são os blocos de construção do Angular.
Components contêm o código, layout HTML e informações de estilo CSS que fornecem a função e aparência de um elemento na aplicação.
No Angular, components podem conter outros components. As funções e aparência de uma aplicação podem ser divididas e particionadas em components.

No Angular, components têm metadados que definem suas propriedades.
Quando você cria seu `Home`, você usa essas propriedades:

- `selector`: para descrever como o Angular se refere ao component em templates.
- `standalone`: para descrever se o component requer um `NgModule`.
- `imports`: para descrever as dependências do component.
- `template`: para descrever a marcação HTML e layout do component.
- `styleUrls`: para listar as URLs dos arquivos CSS que o component usa em um array.

<docs-pill-row>
  <docs-pill href="api/core/Component" title="Saiba mais sobre Components"/>
</docs-pill-row>

<docs-workflow>

<docs-step title="Criar o `Home`">
Neste passo, você cria um novo component para sua aplicação.

No painel **Terminal** do seu IDE:

1. No diretório do seu projeto, navegue até o diretório `first-app`.
1. Execute este comando para criar um novo `Home`

   ```shell
   ng generate component home
   ```

1. Execute este comando para construir e servir sua aplicação.

   NOTA: Este passo é apenas para seu ambiente local!

   ```shell
   ng serve
   ```

1. Abra um navegador e navegue para `http://localhost:4200` para encontrar a aplicação.

1. Confirme que a aplicação constrói sem erro.

   ÚTIL: Ela deve renderizar da mesma forma que na lição anterior porque mesmo que você tenha adicionado um novo component, você ainda não o incluiu em nenhum dos templates da aplicação.

1. Deixe o `ng serve` rodando enquanto você completa os próximos passos.
   </docs-step>

<docs-step title="Adicionar o novo component ao layout da sua aplicação">
Neste passo, você adiciona o novo component, `Home` ao component raiz da sua aplicação, `App`, para que ele seja exibido no layout da sua aplicação.

No painel **Edit** do seu IDE:

1. Abra `app.ts` no editor.
1. Em `app.ts`, importe `Home` adicionando esta linha aos imports no nível do arquivo.

<docs-code header="Import Home in src/app/app.ts" path="adev/src/content/tutorials/first-app/steps/03-HousingLocation/src/app/app.ts" visibleLines="[2]"/>

1. Em `app.ts`, em `@Component`, atualize a propriedade do array `imports` e adicione `Home`.

<docs-code header="Replace in src/app/app.ts" path="adev/src/content/tutorials/first-app/steps/03-HousingLocation/src/app/app.ts" visibleLines="[6]"/>

1. Em `app.ts`, em `@Component`, atualize a propriedade `template` para incluir o seguinte código HTML.

<docs-code language="angular-ts" header="Replace in src/app/app.ts" path="adev/src/content/tutorials/first-app/steps/03-HousingLocation/src/app/app.ts" visibleLines="[7,16]"/>

1. Salve suas alterações em `app.ts`.
1. Se o `ng serve` estiver rodando, a aplicação deve atualizar.
   Se o `ng serve` não estiver rodando, inicie-o novamente.
   _Hello world_ na sua aplicação deve mudar para _home works!_ do `Home`.
1. Verifique a aplicação em execução no navegador e confirme que a aplicação foi atualizada.

<img alt="browser frame of page displaying the text 'home works!'" src="assets/images/tutorials/first-app/homes-app-lesson-02-step-2.png">

</docs-step>

<docs-step title="Adicionar recursos ao `Home`">

Neste passo você adiciona recursos ao `Home`.

No passo anterior, você adicionou o `Home` padrão ao template da sua aplicação para que seu HTML padrão aparecesse na aplicação.
Neste passo, você adiciona um filtro de busca e botão que será usado em uma lição posterior.
Por enquanto, isso é tudo que o `Home` tem.
Note que, este passo apenas adiciona os elementos de busca ao layout sem nenhuma funcionalidade ainda.

No painel **Edit** do seu IDE:

1. No diretório `first-app`, abra `home.ts` no editor.
1. Em `home.ts`, em `@Component`, atualize a propriedade `template` com este código.

<docs-code language="angular-ts" header="Replace in src/app/home/home.ts" path="adev/src/content/tutorials/first-app/steps/03-HousingLocation/src/app/home/home.ts" visibleLines="[5,12]"/>

1. Em seguida, abra `home.css` no editor e atualize o conteúdo com estes estilos.

   NOTA: No navegador, estes podem ir em `src/app/home/home.ts` no array `styles`.

   <docs-code header="Replace in src/app/home/home.css" path="adev/src/content/tutorials/first-app/steps/03-HousingLocation/src/app/home/home.css"/>

1. Confirme que a aplicação constrói sem erro.
   Você deve encontrar a caixa de consulta de filtro e o botão em sua aplicação e eles devem estar estilizados.
   Corrija quaisquer erros antes de continuar para o próximo passo.

<img alt="browser frame of homes-app displaying logo, filter text input box and search button" src="assets/images/tutorials/first-app/homes-app-lesson-02-step-3.png">
</docs-step>

</docs-workflow>

RESUMO: Nesta lição, você criou um novo component para sua aplicação e deu a ele um controle de edição de filtro e botão.

Para mais informações sobre os tópicos cobertos nesta lição, visite:

<docs-pill-row>
  <docs-pill href="cli/generate/component" title="`ng generate component`"/>
  <docs-pill href="api/core/Component" title="Referência de `Component`"/>
  <docs-pill href="guide/components" title="Visão geral de components Angular"/>
</docs-pill-row>
