<!-- ia-translate: true -->
# Adicione validação ao seu formulário {#add-validation-to-your-form}

Adicionar validação ao seu formulário é essencial para garantir que os usuários insiram dados válidos. Signal Forms usa validators em uma schema function que você passa para a função `form()`.

Nesta atividade, você vai aprender como:

- Importar os validators nativos
- Definir uma schema function para o seu formulário
- Aplicar validators a campos específicos com mensagens de erro personalizadas

Vamos adicionar validação!

<hr />

<docs-workflow>

<docs-step title="Importe os validators">
Importe os validators `required` e `email` de `@angular/forms/signals`:

```ts
import {form, FormField, required, email} from '@angular/forms/signals';
```

</docs-step>

<docs-step title="Adicione uma schema function ao seu formulário">
Atualize a chamada de `form()` para incluir uma schema function como segundo parâmetro. A schema function recebe um parâmetro `fieldPath` que permite acessar cada campo:

```ts
loginForm = form(this.loginModel, (fieldPath) => {
  // Os validators vão aqui
});
```

</docs-step>

<docs-step title="Adicione validação ao campo de e-mail">
Dentro da schema function, adicione a validação do campo de e-mail. Use os validators `required()` e `email()`:

```ts
loginForm = form(this.loginModel, (fieldPath) => {
  required(fieldPath.email, {message: 'O e-mail é obrigatório'});
  email(fieldPath.email, {message: 'Insira um endereço de e-mail válido'});
});
```

A opção `message` fornece mensagens de erro personalizadas para os usuários.
</docs-step>

<docs-step title="Adicione validação ao campo de senha">
Adicione a validação do campo de senha usando o validator `required()`:

```ts
loginForm = form(this.loginModel, (fieldPath) => {
  required(fieldPath.email, {message: 'O e-mail é obrigatório'});
  email(fieldPath.email, {message: 'Insira um endereço de e-mail válido'});
  required(fieldPath.password, {message: 'A senha é obrigatória'});
});
```

</docs-step>

</docs-workflow>

Perfeito! Você adicionou validação ao seu formulário. Os validators são executados automaticamente conforme os usuários interagem com o formulário. Quando a validação falha, o estado do campo reflete os erros.

Em seguida, você vai aprender [como exibir erros de validação no template](/tutorials/signal-forms/4-display-errors)!
