<!-- ia-translate: true -->
# Visão geral de forms

Forms são uma parte importante de muitos apps, porque permitem que seu app aceite a entrada do usuário. Vamos aprender como os forms são tratados no Angular.

No Angular, existem dois tipos de forms: template-driven e reactive. Você aprenderá sobre ambos nas próximas atividades.

NOTE: Saiba mais sobre [forms no Angular no guia detalhado](/guide/forms).

Nesta atividade, você aprenderá como configurar um form usando uma abordagem template-driven.

<hr>

<docs-workflow>

<docs-step title="Crie um campo de input {#create-an-input-field}">

Em `user.ts`, atualize o template adicionando um input de texto com o `id` definido como `framework` e o tipo definido como `text`.

```angular-html
<label for="framework">
  Favorite Framework:
  <input id="framework" type="text" />
</label>
```

</docs-step>

<docs-step title="Importe `FormsModule` {#import-formsmodule}">

Para que este form use os recursos do Angular que habilitam o data binding em forms, você precisará importar o `FormsModule`.

Importe o `FormsModule` de `@angular/forms` e adicione-o ao array `imports` do `User`.

```ts {highlight:[[2],[6]]}
import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
...
imports: [FormsModule],
})
export class User {}
```

</docs-step>

<docs-step title="Adicione binding ao valor do input {#add-binding-to-the-value-of-the-input}">

O `FormsModule` tem uma directive chamada `ngModel`, que vincula o valor do input a uma propriedade na sua classe.

Atualize o input para usar a directive `ngModel`, especificamente com a sintaxe `[(ngModel)]="favoriteFramework"`, para vincular à propriedade `favoriteFramework`.

```html {highlight:[3]}
<label for="framework">
  Favorite Framework:
  <input id="framework" type="text" [(ngModel)]="favoriteFramework" />
</label>
```

Depois de fazer as alterações, tente digitar um valor no campo de input. Observe como ele é atualizado na tela (sim, muito legal).

NOTE: A sintaxe `[()]` é conhecida como "banana in a box", mas representa two-way binding: property binding e event binding. Saiba mais na [documentação do Angular sobre two-way data binding](guide/templates/two-way-binding).

</docs-step>

</docs-workflow>

Você deu um importante primeiro passo para construir forms com Angular.

Bom trabalho. Vamos manter o embalo!
