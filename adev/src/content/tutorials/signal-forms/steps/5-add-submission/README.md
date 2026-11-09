<!-- ia-translate: true -->
# Adicione o envio do formulário {#add-form-submission}

Por fim, vamos aprender como lidar com o envio do formulário. Você vai aprender a usar a função `submit()` para executar operações assíncronas quando o formulário for válido, e a desabilitar o botão de envio quando o formulário tiver erros.

Nesta atividade, você vai aprender como:

- Importar a função `submit()`
- Criar um método de tratamento de envio
- Usar `submit()` para executar lógica somente quando o formulário for válido
- Desabilitar o botão de envio com base no estado do formulário

Vamos concluir o formulário!

<hr />

<docs-workflow>

<docs-step title="Importe a função submit {#import-the-submit-function}">
Importe a função `submit` de `@angular/forms/signals`:

```ts
import {form, FormField, required, email, submit} from '@angular/forms/signals';
```

</docs-step>

<docs-step title="Adicione o método onSubmit {#add-the-onsubmit-method}">
Na classe do seu component, adicione um método `onSubmit()` que trata o envio do formulário:

```ts
onSubmit(event: Event) {
  event.preventDefault();
  submit(this.loginForm, async () => {
    const credentials = this.loginModel();
    console.log('Fazendo login com:', credentials);
    // Adicione aqui a sua lógica de login
  });
}
```

A função `submit()` só executa o seu callback assíncrono se o formulário for válido. Ela também gerencia automaticamente o estado de envio do formulário.
</docs-step>

<docs-step title="Vincule o tratador de envio ao formulário {#bind-the-submit-handler-to-the-form}">
No seu template, vincule o método `onSubmit()` ao evento submit do formulário:

```html
<form (submit)="onSubmit($event)"></form>
```

</docs-step>

<docs-step title="Desabilite o botão quando o formulário for inválido {#disable-the-button-when-form-is-invalid}">
Atualize o botão de envio para ficar desabilitado quando o formulário for inválido:

```html
<button type="submit" [disabled]="loginForm().invalid()">Entrar</button>
```

Isso impede o envio quando o formulário tiver erros de validação.
</docs-step>

</docs-workflow>

Parabéns! Você criou um formulário de login completo com Signal Forms.

Pronto para revisar o que aprendeu e explorar tópicos avançados? Continue para [os próximos passos](/tutorials/signal-forms/6-next-steps)!
