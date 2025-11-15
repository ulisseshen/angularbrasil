<!-- ia-translate: true -->
# Crie o component HousingLocation da aplicação

Esta lição do tutorial demonstra como adicionar o component `HousingLocation` à sua aplicação Angular.

<docs-video src="https://www.youtube.com/embed/R0nRX8jD2D0?si=U4ONEbPvtptdUHTt&amp;start=440"/>

## O que você vai aprender

- Sua aplicação tem um novo component: `HousingLocation` e ele exibe uma mensagem confirmando que o component foi adicionado à sua aplicação.

<docs-workflow>

<docs-step title="Crie o `HousingLocation`">
Neste passo, você cria um novo component para sua aplicação.

No painel **Terminal** do seu IDE:

1. No diretório do seu projeto, navegue até o diretório `first-app`.

1. Execute este comando para criar um novo `HousingLocation`

   ```shell
   ng generate component housingLocation
   ```

1. Execute este comando para buildar e servir sua aplicação.

   ```shell
   ng serve
   ```

   NOTA: Este passo é apenas para seu ambiente local!

1. Abra um browser e navegue até `http://localhost:4200` para encontrar a aplicação.
1. Confirme que a aplicação builda sem erro.

   ÚTIL: Ela deve renderizar da mesma forma que na lição anterior porque, embora você tenha adicionado um novo component, você ainda não o incluiu em nenhum dos templates da aplicação.

1. Deixe o `ng serve` rodando enquanto você completa os próximos passos.
   </docs-step>

<docs-step title="Adicione o novo component ao layout da sua aplicação">
Neste passo, você adiciona o novo component, `HousingLocation`, ao `Home` da sua aplicação, para que ele seja exibido no layout da sua aplicação.

No painel **Edit** do seu IDE:

1. Abra `home.ts` no editor.
1. Em `home.ts`, importe `HousingLocation` adicionando esta linha aos imports no nível do arquivo.

<docs-code header="Importe HousingLocation em src/app/home/home.ts" path="adev/src/content/tutorials/first-app/steps/04-interfaces/src/app/home/home.ts" visibleLines="[2]"/>

1. Em seguida, atualize a propriedade `imports` dos metadados do `@Component` adicionando `HousingLocation` ao array.

<docs-code  header="Adicione HousingLocation ao array de imports em src/app/home/home.ts" path="adev/src/content/tutorials/first-app/steps/04-interfaces/src/app/home/home.ts" visibleLines="[6]"/>

1. Agora o component está pronto para uso no template do `Home`. Atualize a propriedade `template` dos metadados do `@Component` para incluir uma referência à tag `<app-housing-location>`.

<docs-code language="angular-ts" header="Adicione housing location ao template do component em src/app/home/home.ts" path="adev/src/content/tutorials/first-app/steps/04-interfaces/src/app/home/home.ts" visibleLines="[7,17]"/>

</docs-step>

<docs-step title="Adicione os estilos para o component">
Neste passo, você vai copiar os estilos pré-escritos para o `HousingLocation` na sua aplicação para que a aplicação renderize adequadamente.

1. Abra `src/app/housing-location/housing-location.css`, e cole os estilos abaixo no arquivo:

   NOTA: No browser, estes podem ir em `src/app/housing-location/housing-location.ts` no array `styles`.

   <docs-code header="Adicione estilos CSS ao housing location no component em src/app/housing-location/housing-location.css" path="adev/src/content/tutorials/first-app/steps/04-interfaces/src/app/housing-location/housing-location.css"/>

1. Salve seu código, retorne ao browser e confirme que a aplicação builda sem erro. Você deve encontrar a mensagem "housing-location works!" renderizada na tela. Corrija quaisquer erros antes de continuar para o próximo passo.

<img alt="frame do browser da aplicação homes-app exibindo logo, campo de texto de filtro e botão de busca e a mensagem 'housing-location works!" src="assets/images/tutorials/first-app/homes-app-lesson-03-step-2.png">

</docs-step>

</docs-workflow>

RESUMO: Nesta lição, você criou um novo component para sua aplicação e o adicionou ao layout da aplicação.
