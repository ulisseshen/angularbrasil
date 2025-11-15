<!-- ia-translate: true -->
# Adicione um property binding ao template de um component

Esta lição do tutorial demonstra como adicionar property binding a um template e usá-lo para passar dados dinâmicos a components.

<docs-video src="https://www.youtube.com/embed/eM3zi_n7lNs?si=AsiczpWnMz5HhJqB&amp;start=599"/>

## O que você vai aprender

- Sua aplicação tem data bindings no template `Home`.
- Sua aplicação envia dados do `Home` para o `HousingLocation`.

## Prévia conceitual de Inputs

Nesta lição, você continuará o processo de compartilhar dados do component pai para o component filho vinculando dados a essas propriedades no template usando property binding.

Property binding permite que você conecte uma variável a um `Input` em um template Angular. Os dados são então vinculados dinamicamente ao `Input`.

Para uma explicação mais detalhada, consulte o guia [Property binding](guide/templates/property-binding).

<docs-workflow>

<docs-step title="Atualize o template `Home`">
Este passo adiciona property binding à tag `<app-housing-location>`.

No editor de código:

1.  Navegue até `src/app/home/home.ts`
1.  Na propriedade template do decorator `@Component`, atualize o código para corresponder ao código abaixo:
    <docs-code language="angular-ts" header="Adicione property binding de housingLocation" path="adev/src/content/tutorials/first-app/steps/07-dynamic-template-values/src/app/home/home.ts" visibleLines="[15,17]"/>

        Ao adicionar um property binding a uma tag de component, usamos a sintaxe `[attribute] = "value"` para notificar o Angular de que o valor atribuído deve ser tratado como uma propriedade da classe do component e não como um valor string.

        O valor do lado direito é o nome da propriedade do `Home`.

    </docs-step>

<docs-step title="Confirme que o código ainda funciona">
1.  Salve suas alterações e confirme que a aplicação não tem nenhum erro.
1.  Corrija quaisquer erros antes de continuar para o próximo passo.
</docs-step>

</docs-workflow>

RESUMO: Nesta lição, você adicionou um novo property binding e passou uma referência a uma propriedade de classe. Agora, o `HousingLocation` tem acesso aos dados que pode usar para customizar a exibição do component.

Para mais informações sobre os tópicos cobertos nesta lição, visite:

<docs-pill-row>
  <docs-pill href="/guide/templates/property-binding" title="Property binding"/>
</docs-pill-row>
