<!-- ia-translate: true -->
# Reactive forms {#reactive-forms}

Quando você quer gerenciar seus forms programaticamente, em vez de depender apenas do template, os reactive forms são a resposta.

NOTE: Saiba mais sobre [reactive forms no guia detalhado](/guide/forms/reactive-forms).

Nesta atividade, você aprenderá como configurar reactive forms.

<hr>

<docs-workflow>

<docs-step title="Importe o módulo `ReactiveForms` {#import-reactiveforms-module}">

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

<docs-step title="Crie o objeto `FormGroup` com FormControls {#create-the-formgroup-object-with-formcontrols}">

Reactive forms usam a classe `FormControl` para representar os form controls (por exemplo, inputs). O Angular fornece a classe `FormGroup` para agrupar form controls em um objeto útil, o que torna mais conveniente para os desenvolvedores lidar com forms grandes.

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

<docs-step title="Vincule o FormGroup e os FormControls ao form {#link-the-formgroup-and-formcontrols-to-the-form}">

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

<docs-step title="Trate as atualizações do form {#handle-update-to-the-form}">

Quando você quiser acessar os dados do `FormGroup`, isso pode ser feito acessando o valor do `FormGroup`. Atualize o `template` para exibir os valores do form:

```angular-html
...
<h2>Profile Form</h2>
<p>Name: {{ profileForm.value.name }}</p>
<p>Email: {{ profileForm.value.email }}</p>
```

</docs-step>

<docs-step title="Acesse os valores do FormGroup {#access-formgroup-values}">
Adicione à classe do component um novo método chamado `handleSubmit`, que você usará depois para tratar o envio do form.
Este método exibirá os valores do form. Você pode acessar os valores a partir do FormGroup.

Na classe do component, adicione o método `handleSubmit()` para tratar o envio do form.

```ts
handleSubmit() {
  alert(
    this.profileForm.value.name + ' | ' + this.profileForm.value.email
  );
}
```

</docs-step>

<docs-step title="Adicione `ngSubmit` ao form {#add-ngsubmit-to-the-form}">
Agora você tem acesso aos valores do form. Chegou a hora de tratar o evento de envio e usar o método `handleSubmit`.
O Angular tem um event handler com esse propósito específico, chamado `ngSubmit`. Atualize o elemento form para chamar o método `handleSubmit` quando o form for enviado.

```angular-html {highlight:[1]}
<form [formGroup]="profileForm" (ngSubmit)="handleSubmit()"></form>
```

</docs-step>

</docs-workflow>

E assim você já sabe como trabalhar com reactive forms no Angular.

Trabalho fantástico com esta atividade. Continue para aprender sobre validação de forms.
