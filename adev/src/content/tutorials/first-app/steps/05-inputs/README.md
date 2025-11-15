<!-- ia-translate: true -->
# Adicione um parâmetro de input ao component

Esta lição do tutorial demonstra como criar um `input` de component e usá-lo para passar dados a um component para customização.

<docs-video src="https://www.youtube.com/embed/eM3zi_n7lNs?si=WvRGFSkW_7_zDIFD&amp;start=241"/>

NOTA: Este vídeo reflete uma sintaxe mais antiga, mas os conceitos principais permanecem válidos.

## O que você vai aprender

O template `HousingLocation` da sua aplicação tem uma propriedade `HousingLocation` para receber input.

## Prévia conceitual de Inputs

[Inputs](api/core/input) permitem que components especifiquem dados que podem ser passados a ele de um component pai.

Nesta lição, você definirá uma propriedade `input` no component `HousingLocation` que permite customizar os dados exibidos no component.

Saiba mais nos guias [Aceitando dados com propriedades de input](guide/components/inputs) e [Eventos customizados com outputs](guide/components/outputs).

<docs-workflow>

<docs-step title="Importe a função input()">
No editor de código, importe o método auxiliar `input` de `@angular/core` para o component `HousingLocation`.

<docs-code header="Importe input em housing-location.ts" path="adev/src/content/tutorials/first-app/steps/06-property-binding/src/app/housing-location/housing-location.ts" visibleLines="[1]"/>

</docs-step>

<docs-step title="Adicione a propriedade Input">
Adicione uma propriedade obrigatória chamada `housingLocation` e inicialize-a usando `input.required()` com o tipo `HousingLocationInfo`.

  <docs-code header="Declare a propriedade input em housing-location.ts" path="adev/src/content/tutorials/first-app/steps/06-property-binding/src/app/housing-location/housing-location.ts" visibleLines="[12]"/>

Você precisa invocar o método `required` em `input` para indicar que o component pai deve fornecer um valor. Na nossa aplicação de exemplo, sabemos que esse valor sempre será passado — isso é por design. A chamada `.required()` garante que o compilador TypeScript force isso e trate a propriedade como não-nula quando este component for usado em um template.

</docs-step>

<docs-step title="Passe dados para o input">
Envie o valor `housingLocation` do component `Home` para a propriedade `housingLocation` do component HousingLocation.

<docs-code language="angular-ts" header="Declare a propriedade input para HousingLocation em home.ts" path="adev/src/content/tutorials/first-app/steps/06-property-binding/src/app/home/home.ts" visibleLines="[16]"/>

</docs-step>

</docs-workflow>

RESUMO: Nesta lição, você criou uma nova propriedade `input`. Você também usou o método `.required` para garantir que o valor do signal esteja sempre definido.

<docs-pill-row>
  <docs-pill href="guide/components/inputs" title="Aceitando dados com propriedades de input"/>
  <docs-pill href="guide/components/outputs" title="Eventos customizados com outputs"/>
</docs-pill-row>
