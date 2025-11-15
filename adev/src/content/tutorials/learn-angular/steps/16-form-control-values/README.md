<!-- ia-translate: true -->
# Obtendo o valor do form control

Agora que seus forms estão configurados com o Angular, o próximo passo é acessar os valores dos form controls.

Nota: Saiba mais sobre [adicionar um form control básico no guia detalhado](/guide/forms/reactive-forms#adding-a-basic-form-control).

Nesta atividade, você aprenderá como obter o valor do seu input de form.

<hr>

<docs-workflow>

<docs-step title="Mostre o valor do campo input no template">

Para exibir o valor do input em um template, você pode usar a sintaxe de interpolação `{{}}` assim como qualquer outra propriedade de classe do component:

<docs-code language="angular-ts" highlight="[5]">
@Component({
  selector: 'app-user',
  template: `
    ...
    <p>Framework: {{ favoriteFramework }}</p>
    <label for="framework">
      Favorite Framework:
      <input id="framework" type="text" [(ngModel)]="favoriteFramework" />
    </label>
  `,
})
export class User {
  favoriteFramework = '';
}
</docs-code>

</docs-step>

<docs-step title="Recupere o valor de um campo input">

Quando você precisa referenciar o valor do campo input na classe do component, você pode fazer isso acessando a propriedade da classe com a sintaxe `this`.

<docs-code language="angular-ts" highlight="[15]">
...
@Component({
  selector: 'app-user',
  template: `
    ...
    <button (click)="showFramework()">Show Framework</button>
  `,
  ...
})
export class User {
  favoriteFramework = '';
  ...

showFramework() {
alert(this.favoriteFramework);
}
}
</docs-code>

</docs-step>

</docs-workflow>

Ótimo trabalho aprendendo como exibir os valores do input no seu template e acessá-los programaticamente.

Hora de progredir para a próxima forma de gerenciar forms com Angular: reactive forms. Se você quiser aprender mais sobre template-driven forms, consulte a [documentação de forms do Angular](guide/forms/template-driven-forms).
