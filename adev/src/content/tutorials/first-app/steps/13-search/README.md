<!-- ia-translate: true -->
# Adicione a funcionalidade de busca à sua aplicação

Este tutorial demonstra como adicionar uma funcionalidade de busca à sua aplicação Angular.

A aplicação permitirá que os usuários busquem pelos dados fornecidos pela sua aplicação e exiba apenas os resultados que correspondem ao termo inserido.

<docs-video src="https://www.youtube.com/embed/5K10oYJ5Y-E?si=TiuNKx_teR9baO7k&amp;start=457"/>

IMPORTANTE: Recomendamos usar seu ambiente local para esta etapa do tutorial.

## O que você aprenderá

- Sua aplicação usará dados de um formulário para buscar locais de moradia correspondentes
- Sua aplicação exibirá apenas os locais de moradia correspondentes

<docs-workflow>

<docs-step title="Atualize as propriedades do componente home">
Nesta etapa, você atualizará a classe `Home` para armazenar dados em uma nova propriedade de array que você usará para filtragem.

1. Em `src/app/home/home.ts`, adicione uma nova propriedade à classe chamada `filteredLocationList`.

   <docs-code header="Adicione a propriedade filteredLocationList em home.ts" path="adev/src/content/tutorials/first-app/steps/14-http/src/app/home/home.ts" visibleLines="[27]"/>

   A `filteredLocationList` armazenará os valores que correspondem aos critérios de busca inseridos pelo usuário.

1. A `filteredLocationList` deve conter o conjunto total de valores de locais de moradia por padrão quando a página carregar. Atualize o `constructor` da classe `Home` para definir o valor.

   <docs-code header="Defina o valor de filteredLocationList" path="adev/src/content/tutorials/first-app/steps/14-http/src/app/home/home.ts" visibleLines="[29,32]"/>

</docs-step>

<docs-step title="Atualize o template do componente home">
O componente `Home` já contém um campo de entrada que você usará para capturar a entrada do usuário. Esse texto será usado para filtrar os resultados.

1. Atualize o template do `Home` para incluir uma variável de template no elemento `input` chamada `#filter`.

   <docs-code language="angular-ts" header="Adicione uma variável de template ao elemento HTML input em home.ts" path="adev/src/content/tutorials/first-app/steps/14-http/src/app/home/home.ts" visibleLines="[12]"/>
   Este exemplo usa uma [variável de referência de template](guide/templates) para obter acesso ao elemento `input` como seu valor.

1. Em seguida, atualize o template do componente para anexar um manipulador de evento ao botão "Search".

   <docs-code language="angular-ts" header="Vincule o evento click do botão a um método em home.ts" path="adev/src/content/tutorials/first-app/steps/14-http/src/app/home/home.ts" visibleLines="[13]"/>

   Ao vincular ao evento `click` no elemento `button`, você pode chamar a função `filterResults`. O argumento para a função é a propriedade `value` da variável de template `filter`. Especificamente, a propriedade `.value` do elemento HTML `input`.

1. A última atualização do template é na diretiva `@for`. Atualize o `@for` para iterar sobre os valores do array `filteredLocationList`.

   <docs-code header="Atualize a diretiva de template @for em home.ts" path="adev/src/content/tutorials/first-app/steps/14-http/src/app/home/home.ts" visibleLines="[17,19]" language="html"/>

</docs-step>

<docs-step title="Implemente a função manipuladora de evento">
O template foi atualizado para vincular a função `filterResults` ao evento `click`. Em seguida, sua tarefa é implementar a função `filterResults` na classe `Home`.

1. Atualize a classe `Home` para incluir a implementação da função `filterResults`.

   <docs-code header="Adicione a implementação da função filterResults" path="adev/src/content/tutorials/first-app/steps/14-http/src/app/home/home.ts" visibleLines="[34,43]"/>

   Esta função usa a função `filter` de `String` para comparar o valor do parâmetro `text` com a propriedade `housingLocation.city`. Você pode atualizar esta função para corresponder a qualquer propriedade ou múltiplas propriedades como um exercício divertido.

1. Salve seu código.

1. Atualize o navegador e confirme que você pode buscar os dados de locais de moradia por cidade quando clicar no botão "Search" após inserir o texto.

<img alt="resultados de busca filtrados baseados na entrada do usuário" src="assets/images/tutorials/first-app/homes-app-lesson-13-step-3.png">
</docs-step>

</docs-workflow>

RESUMO: Nesta lição, você atualizou sua aplicação para usar variáveis de template para interagir com valores de template, e adicionou funcionalidade de busca usando vinculação de eventos e funções de array.

Para mais informações sobre os tópicos abordados nesta lição, visite:

<docs-pill-row>
  <docs-pill href="guide/templates" title="Variáveis de Template"/>
  <docs-pill href="guide/templates/event-listeners" title="Manipulação de Eventos"/>
</docs-pill-row>
