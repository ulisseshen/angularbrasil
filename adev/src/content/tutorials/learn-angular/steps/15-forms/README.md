<!-- ia-translate: true -->
# Visão Geral de Forms

Forms são uma grande parte de muitas aplicações porque permitem que sua aplicação aceite entrada do usuário. Vamos aprender sobre como forms são tratados no Angular.

No Angular, existem dois tipos de forms: template-driven e reactive. Você aprenderá sobre ambos nas próximas atividades.

Nota: Saiba mais sobre [forms no Angular no guia detalhado](/guide/forms).

Nesta atividade, você aprenderá como configurar um form usando uma abordagem template-driven.

<hr>

<docs-workflow>

<docs-step title="Crie um campo input">

Em `user.ts`, atualize o template adicionando um input de texto com o `id` definido como `framework`, tipo definido como `text`.

```angular-html
<label for="framework">
  Favorite Framework:
  <input id="framework" type="text" />
</label>
```

</docs-step>

<docs-step title="Importe `FormsModule`">

Para que este form use recursos do Angular que habilitam data binding para forms, você precisará importar o `FormsModule`.

Importe o `FormsModule` de `@angular/forms` e adicione-o ao array `imports` do `User`.

<docs-code language="ts" highlight="[2, 7]">
import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
...
imports: [FormsModule],
})
export class User {}
</docs-code>

</docs-step>

<docs-step title="Adicione binding ao valor do input">

O `FormsModule` tem uma directive chamada `ngModel` que vincula o valor do input a uma propriedade em sua classe.

Atualize o input para usar a directive `ngModel`, especificamente com a seguinte sintaxe `[(ngModel)]="favoriteFramework"` para vincular à propriedade `favoriteFramework`.

<docs-code language="html" highlight="[3]">
<label for="framework">
  Favorite Framework:
  <input id="framework" type="text" [(ngModel)]="favoriteFramework" />
</label>
</docs-code>

Depois de fazer as alterações, tente inserir um valor no campo de input. Observe como ele atualiza na tela (sim, muito legal).

NOTA: A sintaxe `[()]` é conhecida como "banana in a box" mas representa two-way binding: property binding e event binding. Saiba mais na [documentação do Angular sobre two-way data binding](guide/templates/two-way-binding).

</docs-step>

</docs-workflow>

Você deu um importante primeiro passo para construir forms com Angular.

Bom trabalho. Vamos manter o momentum!
