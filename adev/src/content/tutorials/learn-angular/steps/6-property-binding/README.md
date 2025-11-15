<!-- ia-translate: true -->
# Property Binding no Angular

Property binding no Angular permite que você defina valores para propriedades de elementos HTML, components do Angular e muito mais.

Use property binding para definir dinamicamente valores para propriedades e atributos. Você pode fazer coisas como alternar recursos de botões, definir caminhos de imagens programaticamente e compartilhar valores entre components.

Nota: Saiba mais sobre [definir propriedades e atributos dinâmicos no guia de fundamentos](/essentials/templates#setting-dynamic-properties-and-attributes).

Nesta atividade, você aprenderá como usar property binding em templates.

<hr />

Para vincular a um atributo de elemento, envolva o nome do atributo em colchetes. Aqui está um exemplo:

```angular-html
<img alt="photo" [src]="imageURL">
```

Neste exemplo, o valor do atributo `src` será vinculado à propriedade da classe `imageURL`. Qualquer valor que `imageURL` tenha será definido como o atributo `src` da tag `img`.

<docs-workflow>

<docs-step title="Adicionar uma propriedade chamada `isEditable`" header="app.ts" language="ts">
Atualize o código em `app.ts` adicionando uma propriedade à classe `App` chamada `isEditable` com o valor inicial definido como `true`.

<docs-code highlight="[2]">
export class App {
  isEditable = true;
}
</docs-code>
</docs-step>

<docs-step title="Vincular a `contentEditable`" header="app.ts" language="ts">
Em seguida, vincule o atributo `contentEditable` da `div` à propriedade `isEditable` usando a sintaxe de <code aria-label="square brackets">[]</code>.

<docs-code highlight="[3]" language="angular-ts">
@Component({
  ...
  template: `<div [contentEditable]="isEditable"></div>`,
})
</docs-code>
</docs-step>

</docs-workflow>

A div agora é editável. Bom trabalho 👍

Property binding é um dos muitos recursos poderosos do Angular. Se você quiser aprender mais, confira [a documentação do Angular](guide/templates/property-binding).
