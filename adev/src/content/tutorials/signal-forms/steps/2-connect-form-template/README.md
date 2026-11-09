<!-- ia-translate: true -->
# Conecte seu formulário ao template {#connect-your-form-to-the-template}

Agora, você precisa conectar seu formulário ao template usando a diretiva `[formField]`. Isso cria um data binding bidirecional entre o modelo do seu formulário e os elementos de input.

Nesta lição, você vai aprender como:

- Importar a diretiva `FormField`
- Usar a diretiva `[formField]` para vincular campos do formulário aos inputs
- Conectar inputs de texto e checkboxes ao seu formulário
- Exibir os valores dos campos do formulário no template

Vamos conectar o template!

<hr />

<docs-workflow>

<docs-step title="Importe a diretiva FormField {#import-the-formfield-directive}">
Importe a diretiva `FormField` de `@angular/forms/signals` e adicione-a ao array `imports` do seu component:

```ts
import { form, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [FormField],
})
```

</docs-step>

<docs-step title="Vincule o campo de e-mail {#bind-the-email-field}">
No seu template, adicione a diretiva `[formField]` ao input de e-mail:

```html
<input type="email" [formField]="loginForm.email" />
```

A expressão `loginForm.email` acessa o campo de e-mail do seu formulário.
</docs-step>

<docs-step title="Vincule o campo de senha {#bind-the-password-field}">
Adicione a diretiva `[formField]` ao input de senha:

```html
<input type="password" [formField]="loginForm.password" />
```

</docs-step>

<docs-step title="Vincule o campo de checkbox {#bind-the-checkbox-field}">
Adicione a diretiva `[formField]` ao input do checkbox:

```html
<input type="checkbox" [formField]="loginForm.rememberMe" />
```

</docs-step>

<docs-step title="Exiba os valores do formulário {#display-the-form-values}">
Abaixo do formulário, há uma seção de debug para mostrar os valores atuais do formulário. Exiba o valor de cada campo usando `.value()`:

```angular-html
<p>Email: {{ loginForm.email().value() }}</p>
<p>Senha: {{ loginForm.password().value() ? '••••••••' : '(vazio)' }}</p>
<p>Lembrar de mim: {{ loginForm.rememberMe().value() ? 'Sim' : 'Não' }}</p>
```

Os valores dos campos do formulário são signals, então os valores exibidos são atualizados automaticamente conforme você digita.
</docs-step>

</docs-workflow>

Ótimo trabalho! Você conectou seu formulário ao template e exibiu os valores do formulário. A diretiva `[formField]` cuida do two-way data binding automaticamente: conforme você digita, o signal `loginModel` é atualizado e os valores exibidos mudam imediatamente.

Em seguida, você vai aprender [como adicionar validação ao seu formulário](/tutorials/signal-forms/3-add-validation)!
