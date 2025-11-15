<!-- ia-translate: true -->
# Adicione uma interpolação ao template de um component

Esta lição do tutorial demonstra como adicionar interpolação a templates Angular para exibir dados dinâmicos em um template.

<docs-video src="https://www.youtube.com/embed/eM3zi_n7lNs?si=IFAly3Ss8dwqFx8N&amp;start=338"/>

## O que você vai aprender

- Sua aplicação exibirá valores interpolados no template `HousingLocation`.
- Sua aplicação renderizará dados de localização de moradia no browser.

## Prévia conceitual de interpolação

Neste passo você exibirá valores lidos de propriedades `input` em um template usando interpolação.

Usando `{{ expression }}` em templates Angular, você pode renderizar valores de propriedades, `inputs` e expressões JavaScript válidas.

Para uma explicação mais detalhada, consulte o guia [Exibindo valores com interpolação](guide/templates/binding#render-dynamic-text-with-text-interpolation).

<docs-workflow>

<docs-step title="Atualize o template `HousingLocation` para incluir valores interpolados">
Este passo adiciona nova estrutura HTML e valores interpolados no template `HousingLocation`.

No editor de código:

1.  Navegue até `src/app/housing-location/housing-location.ts`
1.  Na propriedade template do decorator `@Component`, substitua a marcação HTML existente pelo seguinte código:

<docs-code language="angular-ts"  header="Atualize o template HousingLocation em housing-location.ts" path="adev/src/content/tutorials/first-app/steps/08-ngFor/src/app/housing-location/housing-location.ts" visibleLines="[6,17]"/>

Neste código de template atualizado você usou property binding para vincular o `housingLocation.photo` ao atributo `src`. O atributo `alt` usa interpolação para dar mais contexto ao texto alternativo da imagem.

Você usa interpolação para incluir os valores de `name`, `city` e `state` da propriedade `housingLocation`.

</docs-step>

<docs-step title="Confirme que as alterações renderizam no browser">
1.  Salve todas as alterações.
1.  Abra o browser e confirme que a aplicação renderiza a foto, cidade e estado dos dados de exemplo.
    <img alt="frame do browser da aplicação homes-app exibindo logo, campo de texto de filtro, botão de busca e o mesmo card de UI de localização de moradia" src="assets/images/tutorials/first-app/homes-app-lesson-07-step-2.png">
</docs-step>

</docs-workflow>

RESUMO: Nesta lição, você adicionou uma nova estrutura HTML e usou a sintaxe de template Angular para renderizar valores no template `HousingLocation`.

Agora, você tem duas habilidades importantes:

- passar dados para components
- Interpolar valores em um template

Com essas habilidades, sua aplicação agora pode compartilhar dados e exibir valores dinâmicos no browser. Ótimo trabalho até agora.

Para mais informações sobre os tópicos cobertos nesta lição, visite:

<docs-pill-row>
  <docs-pill href="guide/templates" title="Sintaxe de template"/>
  <docs-pill href="guide/templates/binding#render-dynamic-text-with-text-interpolation" title="Exibindo valores com interpolação"/>
</docs-pill-row>
