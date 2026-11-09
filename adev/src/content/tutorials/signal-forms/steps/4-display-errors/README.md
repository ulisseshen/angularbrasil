<!-- ia-translate: true -->
# Exiba erros de validação

Agora que você consegue validar o formulário, é importante mostrar os erros de validação aos usuários.

Nesta atividade, você vai aprender como:

- Acessar o estado do campo com os signals de validação
- Usar `@if` para exibir erros condicionalmente
- Percorrer os erros com `@for`
- Mostrar os erros somente após a interação do usuário

Vamos exibir o feedback de validação!

<hr />

<docs-workflow>

<docs-step title="Adicione a exibição de erros do campo de e-mail {#add-error-display-for-email-field}">
Abaixo do input de e-mail, adicione a exibição condicional de erros. Os erros só serão mostrados quando o campo estiver inválido e tiver sido tocado:

```angular-html
<label>
  E-mail
  <input type="email" [formField]="loginForm.email" />
</label>
@if (loginForm.email().invalid() && loginForm.email().touched()) {
  <div class="error">
    @for (error of loginForm.email().errors(); track error.kind) {
      <span>{{ error.message }}</span>
    }
  </div>
}
```

A chamada `loginForm.email()` acessa o signal de estado do campo. O método `invalid()` retorna `true` quando a validação falha, `touched()` retorna `true` depois que o usuário interagiu com o campo, e `errors()` fornece um array de erros de validação com as mensagens personalizadas.
</docs-step>

<docs-step title="Adicione a exibição de erros do campo de senha {#add-error-display-for-password-field}">
Abaixo do input de senha, adicione o mesmo padrão para os erros de senha:

```angular-html
<label>
  Senha
  <input type="password" [formField]="loginForm.password" />
</label>
@if (loginForm.password().invalid() && loginForm.password().touched()) {
  <div class="error">
    @for (error of loginForm.password().errors(); track error.kind) {
      <span>{{ error.message }}</span>
    }
  </div>
}
```

</docs-step>

</docs-workflow>

Excelente! Você adicionou a exibição de erros ao seu formulário. Os erros aparecem somente depois que os usuários interagem com um campo, oferecendo feedback útil sem ser intrusivo.

Em seguida, você vai aprender [como lidar com o envio do formulário](/tutorials/signal-forms/5-add-submission)!
