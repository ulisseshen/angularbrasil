<!-- ia-translate: true -->
# Obtendo o valor do form control

Agora que seus forms estão configurados com o Angular, o próximo passo é acessar os valores dos form controls.

NOTE: Saiba mais sobre [adicionar um form control básico no guia detalhado](/guide/forms/reactive-forms#adding-a-basic-form-control).

Nesta atividade, você aprenderá como obter o valor do seu input de form.

<hr>

<docs-workflow>

<docs-step title="Mostre o valor do campo de input no template {#show-the-value-of-the-input-field-in-the-template}">

Para exibir o valor do input em um template, você pode usar a sintaxe de interpolação `{{}}`, assim como qualquer outra propriedade de classe do component:

```angular-ts {highlight:[5]}
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
```

</docs-step>

<docs-step title="Recupere o valor de um campo de input {#retrieve-the-value-of-an-input-field}">

Quando você precisar referenciar o valor do campo de input na classe do component, pode fazer isso acessando a propriedade da classe com a sintaxe `this`.

```angular-ts {highlight:[15]}
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
```

</docs-step>

</docs-workflow>

Ótimo trabalho aprendendo a exibir os valores dos inputs no seu template e a acessá-los programaticamente.

Hora de avançar para a próxima forma de gerenciar forms com Angular: reactive forms. Se quiser aprender mais sobre template-driven forms, consulte a [documentação de forms do Angular](guide/forms/template-driven-forms).
