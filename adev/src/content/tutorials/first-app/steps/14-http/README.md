<!-- ia-translate: true -->
# Adicione comunicação HTTP à sua aplicação

Este tutorial demonstra como integrar HTTP e uma API à sua aplicação.

Até este ponto, sua aplicação leu dados de um array estático em um service Angular. O próximo passo é usar um JSON server com o qual sua aplicação se comunicará via HTTP. A requisição HTTP simulará a experiência de trabalhar com dados de um servidor.

<docs-video src="https://www.youtube.com/embed/5K10oYJ5Y-E?si=TiuNKx_teR9baO7k"/>

IMPORTANTE: Recomendamos usar seu ambiente local para esta etapa do tutorial.

## O que você aprenderá

Sua aplicação usará dados de um JSON server

<docs-workflow>

<docs-step title="Configure o JSON server">
JSON Server é uma ferramenta de código aberto usada para criar APIs REST simuladas. Você a usará para servir os dados de locais de moradia que estão atualmente armazenados no housing service.

1. Instale o `json-server` do npm usando o seguinte comando.

   ```bash
       npm install -g json-server
   ```

1. No diretório raiz do seu projeto, crie um arquivo chamado `db.json`. É aqui que você armazenará os dados para o `json-server`.

1. Abra `db.json` e copie o seguinte código para o arquivo

   ```json
   {
     "locations": [
       {
         "id": 0,
         "name": "Acme Fresh Start Housing",
         "city": "Chicago",
         "state": "IL",
         "photo": "https://angular.dev/assets/images/tutorials/common/bernard-hermant-CLKGGwIBTaY-unsplash.jpg",
         "availableUnits": 4,
         "wifi": true,
         "laundry": true
       },
       {
         "id": 1,
         "name": "A113 Transitional Housing",
         "city": "Santa Monica",
         "state": "CA",
         "photo": "https://angular.dev/assets/images/tutorials/common/brandon-griggs-wR11KBaB86U-unsplash.jpg",
         "availableUnits": 0,
         "wifi": false,
         "laundry": true
       },
       {
         "id": 2,
         "name": "Warm Beds Housing Support",
         "city": "Juneau",
         "state": "AK",
         "photo": "https://angular.dev/assets/images/tutorials/common/i-do-nothing-but-love-lAyXdl1-Wmc-unsplash.jpg",
         "availableUnits": 1,
         "wifi": false,
         "laundry": false
       },
       {
         "id": 3,
         "name": "Homesteady Housing",
         "city": "Chicago",
         "state": "IL",
         "photo": "https://angular.dev/assets/images/tutorials/common/ian-macdonald-W8z6aiwfi1E-unsplash.jpg",
         "availableUnits": 1,
         "wifi": true,
         "laundry": false
       },
       {
         "id": 4,
         "name": "Happy Homes Group",
         "city": "Gary",
         "state": "IN",
         "photo": "https://angular.dev/assets/images/tutorials/common/krzysztof-hepner-978RAXoXnH4-unsplash.jpg",
         "availableUnits": 1,
         "wifi": true,
         "laundry": false
       },
       {
         "id": 5,
         "name": "Hopeful Apartment Group",
         "city": "Oakland",
         "state": "CA",
         "photo": "https://angular.dev/assets/images/tutorials/common/r-architecture-JvQ0Q5IkeMM-unsplash.jpg",
         "availableUnits": 2,
         "wifi": true,
         "laundry": true
       },
       {
         "id": 6,
         "name": "Seriously Safe Towns",
         "city": "Oakland",
         "state": "CA",
         "photo": "https://angular.dev/assets/images/tutorials/common/phil-hearing-IYfp2Ixe9nM-unsplash.jpg",
         "availableUnits": 5,
         "wifi": true,
         "laundry": true
       },
       {
         "id": 7,
         "name": "Hopeful Housing Solutions",
         "city": "Oakland",
         "state": "CA",
         "photo": "https://angular.dev/assets/images/tutorials/common/r-architecture-GGupkreKwxA-unsplash.jpg",
         "availableUnits": 2,
         "wifi": true,
         "laundry": true
       },
       {
         "id": 8,
         "name": "Seriously Safe Towns",
         "city": "Oakland",
         "state": "CA",
         "photo": "https://angular.dev/assets/images/tutorials/common/saru-robert-9rP3mxf8qWI-unsplash.jpg",
         "availableUnits": 10,
         "wifi": false,
         "laundry": false
       },
       {
         "id": 9,
         "name": "Capital Safe Towns",
         "city": "Portland",
         "state": "OR",
         "photo": "https://angular.dev/assets/images/tutorials/common/webaliser-_TPTXZd9mOo-unsplash.jpg",
         "availableUnits": 6,
         "wifi": true,
         "laundry": true
       }
     ]
   }
   ```

1. Salve este arquivo.

1. Hora de testar sua configuração. Na linha de comando, na raiz do seu projeto, execute os seguintes comandos.

   ```bash
       json-server --watch db.json
   ```

1. No seu navegador web, navegue até `http://localhost:3000/locations` e confirme que a resposta inclui os dados armazenados em `db.json`.

Se você tiver algum problema com sua configuração, pode encontrar mais detalhes na [documentação oficial](https://www.npmjs.com/package/json-server).
</docs-step>

<docs-step title="Atualize o service para usar o web server em vez do array local">
A fonte de dados foi configurada, o próximo passo é atualizar sua aplicação web para se conectar a ela e usar os dados.

1. Em `src/app/housing.service.ts`, faça as seguintes alterações:

1. Atualize o código para remover a propriedade `housingLocationList` e o array contendo os dados, bem como a propriedade `baseUrl`.

1. Adicione uma propriedade string chamada `url` e defina seu valor como `'http://localhost:3000/locations'`

   <docs-code header="Adicione a propriedade url ao housing.service.ts" path="adev/src/content/tutorials/first-app/steps/14-http/src-final/app/housing.service.ts" visibleLines="[8]"/>

   Este código resultará em erros no restante do arquivo porque depende da propriedade `housingLocationList`. Vamos atualizar os métodos do service em seguida.

1. Atualize a função `getAllHousingLocations` para fazer uma chamada ao web server que você configurou.

    <docs-code header="Atualize o método getAllHousingLocations em housing.service.ts" path="adev/src/content/tutorials/first-app/steps/14-http/src-final/app/housing.service.ts" visibleLines="[10,13]"/>

   O código agora usa código assíncrono para fazer uma requisição **GET** via HTTP.

   ÚTIL: Para este exemplo, o código usa `fetch`. Para casos de uso mais avançados, considere usar o `HttpClient` fornecido pelo Angular.

1. Atualize a função `getHousingLocationsById` para fazer uma chamada ao web server que você configurou.

   ÚTIL: Note que o método `fetch` foi atualizado para _consultar_ os dados de location com um valor de propriedade `id` correspondente. Veja [URL Search Parameter](https://developer.mozilla.org/en-US/docs/Web/API/URL/search) para mais informações.

    <docs-code header="Atualize o método getHousingLocationById em housing.service.ts" path="adev/src/content/tutorials/first-app/steps/14-http/src-final/app/housing.service.ts" visibleLines="[15,19]"/>

1. Uma vez que todas as atualizações estejam completas, seu service atualizado deve corresponder ao seguinte código.

<docs-code header="Versão final de housing.service.ts" path="adev/src/content/tutorials/first-app/steps/14-http/src-final/app/housing.service.ts" visibleLines="[1,25]" />

</docs-step>

<docs-step title="Atualize os componentes para usar chamadas assíncronas ao housing service">
O servidor agora está lendo dados da requisição HTTP, mas os componentes que dependem do service agora têm erros porque foram programados para usar a versão síncrona do service.

1. Em `src/app/home/home.ts`, atualize o `constructor` para usar a nova versão assíncrona do método `getAllHousingLocations`.

<docs-code header="Atualize o constructor em home.ts" path="adev/src/content/tutorials/first-app/steps/14-http/src-final/app/home/home.ts" visibleLines="[29,36]"/>

1. Em `src/app/details/details.ts`, atualize o `constructor` para usar a nova versão assíncrona do método `getHousingLocationById`.

<docs-code header="Atualize o constructor em details.ts" path="adev/src/content/tutorials/first-app/steps/14-http/src-final/app/details/details.ts" visibleLines="[59,64]"/>

1. Salve seu código.

1. Abra a aplicação no navegador e confirme que ela funciona sem nenhum erro.
   </docs-step>

</docs-workflow>

NOTA: Esta lição depende da API `fetch` do navegador. Para o suporte de interceptors, consulte a [documentação do Http Client](/guide/http)

RESUMO: Nesta lição, você atualizou sua aplicação para usar um web server local (`json-server`) e usar métodos de service assíncronos para recuperar dados.

Parabéns! Você concluiu com sucesso este tutorial e está pronto para continuar sua jornada construindo aplicações Angular ainda mais complexas.

Se você gostaria de aprender mais, considere completar alguns dos outros [tutoriais](tutorials) e [guias](overview) para desenvolvedores do Angular.
