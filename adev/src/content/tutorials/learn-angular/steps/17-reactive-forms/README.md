<!-- ia-translate: true -->
# Reactive Forms

Quando você quer gerenciar seus forms programaticamente em vez de depender puramente do template, reactive forms são a resposta.

Nota: Saiba mais sobre [reactive forms no guia detalhado](/guide/forms/reactive-forms).

Nesta atividade, você aprenderá como configurar reactive forms.

<hr>

<docs-workflow>

<docs-step title="Importe o módulo `ReactiveForms`">

Em `app.ts`, importe `ReactiveFormsModule` de `@angular/forms` e adicione-o ao array `imports` do component.

```angular-ts
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  template: `
    <form>
      <label>Name
        <input type="text" />
      </label>
      <label>Email
        <input type="email" />
      </label>
      <button type="submit">Submit</button>
    </form>
  `,
  imports: [ReactiveFormsModule],
})
```

</docs-step>

<docs-step title="Crie o objeto `FormGroup` com FormControls">

Reactive forms usam a classe `FormControl` para representar os form controls (por exemplo, inputs). O Angular fornece a classe `FormGroup` para servir como um agrupamento de form controls em um objeto útil que torna o manuseio de forms grandes mais conveniente para desenvolvedores.

Adicione `FormControl` e `FormGroup` ao import de `@angular/forms` para que você possa criar um FormGroup para cada form, com as propriedades `name` e `email` como FormControls.

```ts
import {ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
...
export class App {
  profileForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
  });
}
```

</docs-step>

<docs-step title="Vincule o FormGroup e FormControls ao form">

Cada `FormGroup` deve ser anexado a um form usando a directive `[formGroup]`.

Além disso, cada `FormControl` pode ser anexado com a directive `formControlName` e atribuído à propriedade correspondente. Atualize o template com o seguinte código de form:

```angular-html
<form [formGroup]="profileForm">
  <label>
    Name
    <input type="text" formControlName="name" />
  </label>
  <label>
    Email
    <input type="email" formControlName="email" />
  </label>
  <button type="submit">Submit</button>
</form>
```

</docs-step>

<docs-step title="Lide com atualizações do form">

Quando você quer acessar dados do `FormGroup`, isso pode ser feito acessando o valor do `FormGroup`. Atualize o `template` para exibir os valores do form:

```angular-html
...
<h2>Profile Form</h2>
<p>Name: {{ profileForm.value.name }}</p>
<p>Email: {{ profileForm.value.email }}</p>
```

</docs-step>

<docs-step title="Acesse valores do FormGroup">
Adicione um novo método à classe do component chamado `handleSubmit` que você usará posteriormente para lidar com o envio do form.
Este método exibirá valores do form, você pode acessar os valores do FormGroup.

Na classe do component, adicione o método `handleSubmit()` para lidar com o envio do form.

<docs-code language="ts">
handleSubmit() {
  alert(
    this.profileForm.value.name + ' | ' + this.profileForm.value.email
  );
}
</docs-code>
</docs-step>

<docs-step title="Adicione `ngSubmit` ao form">
Você tem acesso aos valores do form, agora é hora de lidar com o evento de envio e usar o método `handleSubmit`.
O Angular tem um event handler para este propósito específico chamado `ngSubmit`. Atualize o elemento form para chamar o método `handleSubmit` quando o form for enviado.

<docs-code language="angular-html" highlight="[3]">
<form
  [formGroup]="profileForm"
  (ngSubmit)="handleSubmit()">
</docs-code>

</docs-step>

</docs-workflow>

E assim, você sabe como trabalhar com reactive forms no Angular.

Trabalho fantástico com esta atividade. Continue para aprender sobre validação de forms.
