<!-- ia-translate: true -->
# Criando uma interface

Esta lição do tutorial demonstra como criar uma interface e incluí-la em um component da sua aplicação.

<docs-video src="https://www.youtube.com/embed/eM3zi_n7lNs?si=YkFSeUeV8Ixtz8pm"/>

## O que você vai aprender

- Sua aplicação tem uma nova interface que ela pode usar como um tipo de dado.
- Sua aplicação tem uma instância da nova interface com dados de exemplo.

## Prévia conceitual de interfaces

[Interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html) são tipos de dados customizados para sua aplicação.

Angular usa TypeScript para aproveitar as vantagens de trabalhar em um ambiente de programação fortemente tipado.
A verificação de tipo forte reduz a probabilidade de um elemento na sua aplicação enviar dados formatados incorretamente para outro.
Tais erros de incompatibilidade de tipo são capturados pelo compilador TypeScript e muitos desses erros também podem ser capturados no seu IDE.

Nesta lição, você criará uma interface para definir propriedades que representam dados sobre uma única localização de moradia.

<docs-workflow>

<docs-step title="Crie uma nova interface Angular">
Este passo cria uma nova interface na sua aplicação.

No painel **Terminal** do seu IDE:

1. No diretório do seu projeto, navegue até o diretório `first-app`.
1. No diretório `first-app`, execute este comando para criar a nova interface.

   ```shell

   ng generate interface housinglocation

   ```

1. Execute `ng serve` para buildar a aplicação e servi-la em `http://localhost:4200`.
1. Em um browser, abra `http://localhost:4200` para ver sua aplicação.
1. Confirme que a aplicação builda sem erro.
   Corrija quaisquer erros antes de continuar para o próximo passo.
   </docs-step>

<docs-step title="Adicione propriedades à nova interface">
Este passo adiciona as propriedades à interface que sua aplicação precisa para representar uma localização de moradia.

1. No painel **Terminal** do seu IDE, inicie o comando `ng serve`, se ele ainda não estiver rodando, para buildar a aplicação e servi-la em `http://localhost:4200`.
1. No painel **Edit** do seu IDE, abra o arquivo `src/app/housinglocation.ts`.
1. Em `housinglocation.ts`, substitua o conteúdo padrão com o seguinte código para fazer sua nova interface corresponder a este exemplo.

<docs-code header="Atualize src/app/housinglocation.ts para corresponder a este código" path="adev/src/content/tutorials/first-app/steps/05-inputs/src/app/housinglocation.ts" visibleLines="[1,10]" />

1. Salve suas alterações e confirme que a aplicação não exibe nenhum erro. Corrija quaisquer erros antes de continuar para o próximo passo.

Neste ponto, você definiu uma interface que representa dados sobre uma localização de moradia incluindo um `id`, `name` e informações de localização.
</docs-step>

<docs-step title="Crie uma casa de teste para sua aplicação">
Você tem uma interface, mas ainda não está usando ela.

Neste passo, você cria uma instância da interface e atribui alguns dados de exemplo a ela.
Você ainda não verá esses dados de exemplo aparecer na sua aplicação.
Há mais algumas lições para completar antes que isso aconteça.

1. No painel **Terminal** do seu IDE, execute o comando `ng serve`, se ele ainda não estiver rodando, para buildar a aplicação e servir sua aplicação em `http://localhost:4200`.
1. No painel **Edit** do seu IDE, abra `src/app/home/home.ts`.
1. Em `src/app/home/home.ts`, adicione esta declaração de import após as declarações `import` existentes para que `Home` possa usar a nova interface.

<docs-code language="angular-ts" header="Importe Home em src/app/home/home.ts" path="adev/src/content/tutorials/first-app/steps/05-inputs/src/app/home/home.ts" visibleLines="[3]"/>

1. Em `src/app/home/home.ts`, substitua a definição vazia `export class Home {}` com este código para criar uma única instância da nova interface no component.

<docs-code language="angular-ts" header="Adicione dados de exemplo a src/app/home/home.ts" path="adev/src/content/tutorials/first-app/steps/05-inputs/src/app/home/home.ts" visibleLines="[22,35]"/>

1. Confirme que seu arquivo `home.ts` corresponde a este exemplo.

   <docs-code language="angular-ts" header="src/app/home/home.ts" path="adev/src/content/tutorials/first-app/steps/05-inputs/src/app/home/home.ts" visibleLines="[[1,7],[9,36]]" />

   Ao adicionar a propriedade `housingLocation` do tipo `HousingLocation` à classe `Home`, somos capazes de confirmar que os dados correspondem à descrição da interface. Se os dados não satisfizessem a descrição da interface, o IDE tem informação suficiente para nos dar erros úteis.

1. Salve suas alterações e confirme que a aplicação não tem nenhum erro. Abra o browser e confirme que sua aplicação ainda exibe a mensagem "housing-location works!"

<img alt="frame do browser da aplicação homes-app exibindo logo, campo de texto de filtro e botão de busca e a mensagem 'housing-location works!'" src="assets/images/tutorials/first-app/homes-app-lesson-03-step-2.png">

1. Corrija quaisquer erros antes de continuar para o próximo passo.
   </docs-step>

</docs-workflow>

RESUMO: Nesta lição, você criou uma interface que criou um novo tipo de dado para sua aplicação.
Este novo tipo de dado torna possível especificar onde dados de `HousingLocation` são necessários.
Este novo tipo de dado também torna possível que seu IDE e o compilador TypeScript possam garantir que dados de `HousingLocation` sejam usados onde são necessários.

Para mais informações sobre os tópicos cobertos nesta lição, visite:

<docs-pill-row>
  <docs-pill href="cli/generate/interface" title="ng generate interface"/>
  <docs-pill href="cli/generate" title="ng generate"/>
</docs-pill-row>
