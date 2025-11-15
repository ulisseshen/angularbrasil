<!-- ia-translate: true -->
# Integre a página de detalhes à aplicação

Esta lição do tutorial demonstra como conectar a página de detalhes à sua aplicação.

<docs-video src="https://www.youtube.com/embed/-jRxG84AzCI?si=CbqIpmRpwp5ZZDnu&amp;start=345"/>

IMPORTANTE: Recomendamos usar seu ambiente local para aprender routing.

## O que você vai aprender

No final desta lição sua aplicação terá suporte para routing até a página de detalhes.

## Prévia conceitual de routing com parâmetros de rota

Cada localização de moradia tem detalhes específicos que devem ser exibidos quando um usuário navega para a página de detalhes daquele item. Para alcançar este objetivo, você precisará usar parâmetros de rota.

Parâmetros de rota permitem que você inclua informações dinâmicas como parte da sua URL de rota. Para identificar qual localização de moradia um usuário clicou, você usará a propriedade `id` do tipo `HousingLocation`.

<docs-workflow>

<docs-step title="Usando `routerLink` para navegação dinâmica">
Na lição 10, você adicionou uma segunda rota a `src/app/routes.ts` que inclui um segmento especial que identifica o parâmetro de rota, `id`:

```
'details/:id'
```

Neste caso, `:id` é dinâmico e mudará baseado em como a rota é solicitada pelo código.

1. Em `src/app/housing-location/housing-location.ts`, adicione uma tag anchor ao elemento `section` e inclua a directive `routerLink`:

   <docs-code language="angular-ts" header="Adicione anchor com uma directive routerLink a housing-location.ts" path="adev/src/content/tutorials/first-app/steps/12-forms/src/app/housing-location/housing-location.ts" visibleLines="[18]"/>

   A directive `routerLink` permite que o router do Angular crie links dinâmicos na aplicação. O valor atribuído ao `routerLink` é um array com duas entradas: a porção estática do caminho e os dados dinâmicos.

   Para que o `routerLink` funcione no template, adicione um import no nível do arquivo de `RouterLink` e `RouterOutlet` de '@angular/router', então atualize o array `imports` do component para incluir tanto `RouterLink` quanto `RouterOutlet`.

1. Neste ponto você pode confirmar que o routing está funcionando na sua aplicação. No browser, atualize a página inicial e clique no botão "Learn More" para uma localização de moradia.

<img alt="página de detalhes exibindo o texto 'details works!'" src="assets/images/tutorials/first-app/homes-app-lesson-11-step-1.png">

</docs-step>

<docs-step title="Obtenha parâmetros de rota">
Neste passo, você obterá o parâmetro de rota no `Details`. Atualmente, a aplicação exibe `details works!`. Em seguida você atualizará o código para exibir o valor `id` passado usando os parâmetros de rota.

1. Em `src/app/details/details.ts` atualize o template para importar as funções, classes e services que você precisará usar no `Details`:

<docs-code header="Atualize imports no nível do arquivo" path="adev/src/content/tutorials/first-app/steps/12-forms/src/app/details/details.ts" visibleLines="[1,4]"/>

1. Atualize a propriedade `template` do decorator `@Component` para exibir o valor `housingLocationId`:

   ```angular-ts
     template: `<p>details works! {{ housingLocationId }}</p>`,
   ```

1. Atualize o corpo da classe `Details` com o seguinte código:

   ```ts
   export class Details {
     route: ActivatedRoute = inject(ActivatedRoute);
     housingLocationId = -1;
     constructor() {
       this.housingLocationId = Number(this.route.snapshot.params['id']);
     }
   }
   ```

   Este código dá ao `Details` acesso ao recurso de router `ActivatedRoute` que permite que você tenha acesso aos dados sobre a rota atual. No `constructor`, o código converte o parâmetro `id` obtido da rota de uma string para um número.

1. Salve todas as alterações.

1. No browser, clique em um dos links "Learn More" da localização de moradia e confirme que o valor numérico exibido na página corresponde à propriedade `id` daquela localização nos dados.
   </docs-step>

<docs-step title="Customize o `Details`">
Agora que o routing está funcionando adequadamente na aplicação, este é um ótimo momento para atualizar o template do `Details` para exibir os dados específicos representados pela localização de moradia para o parâmetro de rota.

Para acessar os dados você adicionará uma chamada ao `HousingService`.

1. Atualize o código do template para corresponder ao seguinte código:

   <docs-code language="angular-ts" header="Atualize o template Details em src/app/details/details.ts" path="adev/src/content/tutorials/first-app/steps/12-forms/src/app/details/details.ts" visibleLines="[8,29]"/>

   Note que as propriedades `housingLocation` estão sendo acessadas com o operador de encadeamento opcional `?`. Isso garante que se o valor `housingLocation` for null ou undefined, a aplicação não trave.

1. Atualize o corpo da classe `Details` para corresponder ao seguinte código:

   <docs-code language="angular-ts" header="Atualize a classe Details em src/app/details/details.ts" path="adev/src/content/tutorials/first-app/steps/12-forms/src/app/details/details.ts" visibleLines="[32,41]"/>

   Agora o component tem o código para exibir a informação correta baseada na localização de moradia selecionada. O `constructor` agora inclui uma chamada ao `HousingService` para passar o parâmetro de rota como um argumento para a função do service `getHousingLocationById`.

1. Copie os seguintes estilos para o arquivo `src/app/details/details.css`:

   <docs-code header="Adicione estilos para o Details" path="adev/src/content/tutorials/first-app/steps/12-forms/src/app/details/details.css" visibleLines="[1,71]"/>

   e salve suas alterações

1. Em `Details` use o arquivo `details.css` recém-criado como a fonte para os estilos:
   <docs-code language="angular-ts" header="Atualize details.ts para usar o arquivo css criado" path="adev/src/content/tutorials/first-app/steps/12-forms/src/app/details/details.ts" visibleLines="[30]"/>

1. No browser atualize a página e confirme que quando você clicar no link "Learn More" para uma determinada localização de moradia, a página de detalhes exibe a informação correta baseada nos dados para aquele item selecionado.

<img alt="Página de detalhes listando informações da casa" src="assets/images/tutorials/first-app/homes-app-lesson-11-step-3.png">

</docs-step>

<docs-step title="Verifique a navegação no `Home`">
Em uma lição anterior você atualizou o template `App` para incluir um `routerLink`. Adicionar esse código atualizou sua aplicação para habilitar navegação de volta ao `Home` sempre que o logo é clicado.

1.  Confirme que seu código corresponde ao seguinte:

        <docs-code language="angular-ts" header="Confirme o routerLink em app.ts" path="adev/src/content/tutorials/first-app/steps/12-forms/src/app/app.ts" visibleLines="[8,19]"/>

        Seu código já deve estar atualizado, mas confirme para ter certeza.

    </docs-step>

</docs-workflow>

RESUMO: Nesta lição você adicionou routing para mostrar páginas de detalhes.

Você agora sabe como:

- usar parâmetros de rota para passar dados a uma rota
- usar a directive `routerLink` para usar dados dinâmicos para criar uma rota
- usar parâmetro de rota para recuperar dados do `HousingService` para exibir informações específicas de localização de moradia.

Trabalho realmente ótimo até agora.

Para mais informações sobre os tópicos cobertos nesta lição, visite:

<docs-pill-row>
  <docs-pill href="guide/routing/common-router-tasks#accessing-query-parameters-and-fragments" title="Parâmetros de Rota"/>
  <docs-pill href="guide/routing" title="Visão Geral de Routing no Angular"/>
  <docs-pill href="guide/routing/common-router-tasks" title="Tarefas Comuns de Routing"/>
  <docs-pill href="https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Optional_chaining" title="Operador de Encadeamento Opcional"/>
</docs-pill-row>
