<!-- ia-translate: true -->
# Angular services

Esta lição do tutorial demonstra como criar um service Angular e usar injeção de dependência para incluí-lo na sua aplicação.

<docs-video src="https://www.youtube.com/embed/-jRxG84AzCI?si=rieGfJawp9xJ00Sz"/>

## O que você vai aprender

Sua aplicação tem um service para fornecer os dados à sua aplicação.
No final desta lição, o service lê dados de dados locais e estáticos.
Em uma lição posterior, você atualizará o service para obter dados de um web service.

## Prévia conceitual de services

Este tutorial apresenta services Angular e injeção de dependência.

### Angular services

_Angular services_ fornecem uma maneira de separar dados e funções da aplicação Angular que podem ser usados por múltiplos components na sua aplicação.
Para ser usado por múltiplos components, um service deve ser tornado _injectable_.
Services que são injectable e usados por um component tornam-se dependências desse component.
O component depende desses services e não pode funcionar sem eles.

### Dependency injection

_Dependency injection_ é o mecanismo que gerencia as dependências dos components de uma aplicação e os services que outros components podem usar.

<docs-workflow>

<docs-step title="Crie um novo service para sua aplicação">
Este passo cria um service injectable para sua aplicação.

No painel **Terminal** do seu IDE:

1. No diretório do seu projeto, navegue até o diretório `first-app`.
1. No diretório `first-app`, execute este comando para criar o novo service.

<docs-code language="shell">
ng generate service housing --skip-tests
</docs-code>

1. Execute `ng serve` para buildar a aplicação e servi-la em `http://localhost:4200`.
1. Confirme que a aplicação builda sem erro.
   Corrija quaisquer erros antes de continuar para o próximo passo.
   </docs-step>

<docs-step title="Adicione dados estáticos ao novo service">
Este passo adiciona alguns dados de exemplo ao seu novo service.
Em uma lição posterior, você substituirá os dados estáticos por uma interface web para obter dados como você poderia fazer em uma aplicação real.
Por enquanto, o novo service da sua aplicação usa os dados que foram, até agora, criados localmente no `Home`.

No painel **Edit** do seu IDE:

1. Em `src/app/home/home.ts`, de `Home`, copie a variável `housingLocationList` e seu valor de array.
1. Em `src/app/housing.service.ts`:
   1. Dentro da classe `HousingService`, cole a variável que você copiou de `Home` no passo anterior.
   1. Dentro da classe `HousingService`, cole estas funções após os dados que você acabou de copiar.
      Estas funções permitem que dependências acessem os dados do service.

      <docs-code header="Funções do service em src/app/housing.service.ts" path="adev/src/content/tutorials/first-app/steps/10-routing/src/app/housing.service.ts" visibleLines="[112,118]"/>

      Você precisará destas funções em uma lição futura. Por enquanto, é suficiente entender que essas funções retornam ou um `HousingLocation` específico por id ou a lista inteira.

   1. Adicione um import no nível do arquivo para o `HousingLocation`.

   <docs-code header="Importe o tipo HousingLocation em src/app/housing.service.ts" path="adev/src/content/tutorials/first-app/steps/10-routing/src/app/housing.service.ts" visibleLines="[2]"/>

1. Confirme que a aplicação builda sem erro.
   Corrija quaisquer erros antes de continuar para o próximo passo.
   </docs-step>

<docs-step title="Injete o novo service no `Home`">
Este passo injeta o novo service no `Home` da sua aplicação para que ele possa ler os dados da aplicação de um service.
Em uma lição posterior, você substituirá os dados estáticos por uma fonte de dados ao vivo para obter dados como você poderia fazer em uma aplicação real.

No painel **Edit** do seu IDE, em `src/app/home/home.ts`:

1. No topo de `src/app/home/home.ts`, adicione o `inject` aos itens importados de `@angular/core`. Isso importará a função `inject` para a classe `Home`.

<docs-code language="angular-ts" header="Atualize src/app/home/home.ts" path="adev/src/content/tutorials/first-app/steps/10-routing/src/app/home/home.ts" visibleLines="[1]"/>

1. Adicione um novo import no nível do arquivo para o `HousingService`:

<docs-code language="angular-ts" header="Adicione import a src/app/home/home.ts" path="adev/src/content/tutorials/first-app/steps/10-routing/src/app/home/home.ts" visibleLines="[4]"/>

1. De `Home`, delete as entradas do array `housingLocationList` e atribua a `housingLocationList` o valor de array vazio (`[]`). Em alguns passos você atualizará o código para puxar os dados do `HousingService`.

1. Em `Home`, adicione o seguinte código para injetar o novo service e inicializar os dados para a aplicação. O `constructor` é a primeira função que roda quando este component é criado. O código no `constructor` atribuirá a `housingLocationList` o valor retornado da chamada a `getAllHousingLocations`.

<docs-code language="angular-ts" header="Inicialize dados do service em src/app/home/home.ts" path="adev/src/content/tutorials/first-app/steps/10-routing/src/app/home/home.ts" visibleLines="[23,30]"/>

1. Salve as alterações em `src/app/home/home.ts` e confirme que sua aplicação builda sem erro.
   Corrija quaisquer erros antes de continuar para o próximo passo.
   </docs-step>

</docs-workflow>

RESUMO: Nesta lição, você adicionou um service Angular à sua aplicação e o injetou na classe `Home`.
Isso compartimentaliza como sua aplicação obtém seus dados.
Por enquanto, o novo service obtém seus dados de um array estático de dados.
Em uma lição posterior, você refatorará o service para obter seus dados de um endpoint de API.

Para mais informações sobre os tópicos cobertos nesta lição, visite:

<docs-pill-row>
  <docs-pill href="guide/di/creating-injectable-service" title="Criando um service injectable"/>
  <docs-pill href="guide/di" title="Dependency injection no Angular"/>
  <docs-pill href="cli/generate/service" title="ng generate service"/>
  <docs-pill href="cli/generate" title="ng generate"/>
</docs-pill-row>
