<!-- ia-translate: true -->
# Configure o modelo do form {#set-up-the-form-model}

Todo Signal Form começa com um modelo de dados do form: um signal que define o formato dos seus dados e armazena os valores do form.

Nesta lição, você aprenderá como:

- Definir uma interface TypeScript para os dados do seu form
- Criar um signal para armazenar os valores do form
- Usar a função `form()` para criar um Signal Form

Vamos construir a base do nosso formulário de login!

<hr />

<docs-workflow>

<docs-step title="Defina a interface LoginData">
Crie uma interface TypeScript que defina a estrutura dos dados do form de login. O form terá:

- Um campo `email` (string)
- Um campo `password` (string)
- Um campo `rememberMe` (boolean)

```ts
interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}
```

Adicione esta interface acima do decorator `@Component`.
</docs-step>

<docs-step title="Importe signal e form">
Importe a função `signal` de `@angular/core` e a função `form` de `@angular/forms/signals`:

```ts
import {Component, signal} from '@angular/core';
import {form} from '@angular/forms/signals';
```

</docs-step>

<docs-step title="Crie o signal do modelo do form">
Na classe do seu component, crie um signal `loginModel` com valores iniciais. Use a interface `LoginData` como parâmetro de tipo:

```ts
loginModel = signal<LoginData>({
  email: '',
  password: '',
  rememberMe: false,
});
```

Os valores iniciais começam como strings vazias para os campos de texto e como `false` para a caixa de seleção.
</docs-step>

<docs-step title="Crie o form">
Agora crie o form passando seu signal de modelo para a função `form()`:

```ts
loginForm = form(this.loginModel);
```

A função `form()` cria um form a partir do seu modelo, dando acesso ao estado e à validação de cada campo.
</docs-step>

</docs-workflow>

Excelente! Você configurou o modelo do seu form. O signal `loginModel` armazena os dados do form, e o `loginForm` oferece acesso a cada campo com segurança de tipos.

A seguir, você aprenderá [como conectar seu form ao template](/tutorials/signal-forms/2-connect-form-template)!
