<!-- ia-translate: true -->
# Property binding no Angular

Property binding no Angular permite que você defina valores para propriedades de elementos HTML, components do Angular e muito mais.

Use property binding para definir valores dinamicamente para propriedades e atributos. Você pode fazer coisas como ativar ou desativar recursos de botões, definir caminhos de imagens programaticamente e compartilhar valores entre components.

NOTE: Saiba mais sobre [definir propriedades e atributos dinâmicos no guia de fundamentos](/essentials/templates#setting-dynamic-properties-and-attributes).

Nesta atividade, você aprenderá como usar property binding em templates.

<hr />

Para vincular a um atributo de elemento, envolva o nome do atributo em colchetes. Aqui está um exemplo:

```angular-html
<img alt="photo" [src]="imageURL" />
```

Neste exemplo, o valor do atributo `src` será vinculado à propriedade da classe `imageURL`. Qualquer valor que `imageURL` tenha será definido como o atributo `src` da tag `img`.

<docs-workflow>

<docs-step title="Adicionar uma propriedade chamada `isEditable` {#add-a-property-called-iseditable}" header="app.ts" language="ts">
Atualize o código em `app.ts` adicionando à classe `App` uma propriedade chamada `isEditable`, com o valor inicial definido como `true`.

```ts {highlight:[2]}
export class App {
  isEditable = true;
}
```

</docs-step>

<docs-step title="Vincular a `contentEditable` {#bind-to-contenteditable}" header="app.ts" language="ts">
Em seguida, vincule o atributo `contentEditable` da `div` à propriedade `isEditable`, usando a sintaxe de <code aria-label="colchetes">[]</code>.

```angular-ts {highlight:[3]}
@Component({
  ...
  template: `<div [contentEditable]="isEditable"></div>`,
})
```

</docs-step>

</docs-workflow>

A div agora é editável. Bom trabalho 👍

Property binding é um dos muitos recursos poderosos do Angular. Se quiser aprender mais, confira [a documentação do Angular](guide/templates/binding#css-class-and-style-property-bindings).
