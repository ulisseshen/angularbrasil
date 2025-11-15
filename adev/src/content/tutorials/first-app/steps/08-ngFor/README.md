<!-- ia-translate: true -->
# Use @for para listar objetos no component

Esta lição do tutorial demonstra como usar o bloco `@for` em templates Angular para exibir dados repetidos dinamicamente em um template.

<docs-video src="https://www.youtube.com/embed/eM3zi_n7lNs?si=MIl5NcRxvcLjYt5f&amp;start=477"/>

NOTA: Este vídeo reflete uma sintaxe mais antiga, mas os conceitos principais permanecem válidos.

## O que você vai aprender

- Você terá adicionado um conjunto de dados à aplicação
- Sua aplicação exibirá uma lista de elementos do novo conjunto de dados usando `@for`

## Prévia conceitual de `@for`

No Angular, `@for` é um tipo específico de [bloco de control flow](/guide/templates/control-flow) usado para repetir dados dinamicamente em um template. Em JavaScript puro você usaria um loop for - `@for` fornece funcionalidade similar para templates Angular.

Você pode utilizar `@for` para iterar sobre arrays e até valores assíncronos. Nesta lição, você adicionará um novo array de dados para iterar.

Para uma explicação mais detalhada, consulte o guia [control flow](guide/templates/control-flow#repeat-content-with-the-for-block).

<docs-workflow>

<docs-step title="Adicione dados de moradia ao `Home`">

No `Home` há apenas uma única localização de moradia. Neste passo, você adicionará um array de entradas `HousingLocation`.

1. Em `src/app/home/home.ts`, remova a propriedade `housingLocation` da classe `Home`.
1. Atualize a classe `Home` para ter uma propriedade chamada `housingLocationList`. Atualize seu código para corresponder ao seguinte código:
   <docs-code language="angular-ts"  header="Adicione a propriedade housingLocationList em home.ts" path="adev/src/content/tutorials/first-app/steps/09-services/src/app/home/home.ts" visibleLines="26-131"/>

   IMPORTANTE: Não remova o decorator `@Component`, você atualizará esse código em um passo futuro.

</docs-step>

<docs-step title="Atualize o template `Home` para usar `@for`">
Agora a aplicação tem um conjunto de dados que você pode usar para exibir as entradas no browser usando o bloco `@for`.

1. Atualize a tag `<app-housing-location>` no código do template para isto:
   <docs-code language="angular-ts"  header="Adicione @for ao template Home em home.ts" path="adev/src/content/tutorials/first-app/steps/09-services/src/app/home/home.ts" visibleLines="[15,19]"/>

   Note que, no código `[housingLocation] = "housingLocation"`, o valor `housingLocation` agora se refere à variável usada no bloco `@for`. Antes desta alteração, ele se referia à propriedade na classe `Home`.

1. Salve todas as alterações.

1. Atualize o browser e confirme que a aplicação agora renderiza uma grade de localizações de moradia.

<section class="lightbox">
<img alt="frame do browser da aplicação homes-app exibindo logo, campo de texto de filtro, botão de busca e uma grade de cards de localização de moradia" src="assets/images/tutorials/first-app/homes-app-lesson-08-step-2.png">
</section>

</docs-step>

</docs-workflow>

RESUMO: Nesta lição, você usou o bloco `@for` para repetir dados dinamicamente em templates Angular. Você também adicionou um novo array de dados para ser usado na aplicação Angular. A aplicação agora renderiza dinamicamente uma lista de localizações de moradia no browser.

A aplicação está tomando forma, ótimo trabalho.

Para mais informações sobre os tópicos cobertos nesta lição, visite:

<docs-pill-row>
  <docs-pill href="guide/templates/control-flow" title="Blocos de control flow"/>
  <docs-pill href="guide/templates/control-flow#repeat-content-with-the-for-block" title="Guia do @for"/>
  <docs-pill href="/api/core/@for" title="@for"/>
</docs-pill-row>
