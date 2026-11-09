<!-- ia-translate: true -->
# Gerenciamento do estado de campos {#field-state-management}

O estado de campo do Signal Forms permite reagir às interações do usuário por meio de signals reativos para o status de validação (como `valid`, `invalid`, `errors`), o rastreamento de interações (como `touched`, `dirty`) e a disponibilidade (como `disabled`, `hidden`).

## Entendendo o estado do campo {#understanding-field-state}

Quando você cria um formulário com a função [`form()`](api/forms/signals/form), ela retorna uma **árvore de campos (field tree)**: uma estrutura de objeto que espelha o model do seu formulário. Cada campo da árvore é acessível por meio de dot notation (como [`form.email`](api/forms/signals/FieldTree)).

### Acessando o estado do campo {#accessing-field-state}

Quando você chama qualquer campo da árvore de campos como uma função (como [`form.email()`](api/forms/signals/FieldState)), ela retorna um objeto `FieldState` contendo signals reativos que acompanham a validação, a interação e a disponibilidade do campo. Por exemplo, o signal `invalid()` informa se o campo tem erros de validação:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, required, email} from '@angular/forms/signals';

@Component({
  selector: 'app-registration',
  imports: [FormField],
  template: `
    <input type="email" [formField]="registrationForm.email" />

    @if (registrationForm.email().invalid()) {
      <p class="error">O e-mail tem erros de validação:</p>
      <ul>
        @for (error of registrationForm.email().errors(); track error) {
          <li>{{ error.message }}</li>
        }
      </ul>
    }
  `,
})
export class Registration {
  registrationModel = signal({
    email: '',
    password: '',
  });

  registrationForm = form(this.registrationModel, (schemaPath) => {
    required(schemaPath.email, {message: 'O e-mail é obrigatório'});
    email(schemaPath.email, {message: 'Informe um endereço de e-mail válido'});
  });
}
```

Neste exemplo, o template verifica `registrationForm.email().invalid()` para decidir se deve exibir uma mensagem de erro.

### Signals do estado do campo {#field-state-signals}

O signal mais usado é `value()`, um `WritableSignal` que dá acesso ao valor atual do campo:

```ts
const emailValue = registrationForm.email().value();
console.log(emailValue); // String de e-mail atual
```

Além de `value()`, o estado do campo inclui signals para validação, rastreamento de interação e controle de disponibilidade:

| Categoria                               | Signal       | Descrição                                                                                 |
| --------------------------------------- | ------------ | ----------------------------------------------------------------------------------------- |
| **[Validação](#validation-state)**      | `valid()`    | O campo passa em todas as regras de validação e não tem validadores pendentes             |
|                                         | `invalid()`  | O campo tem erros de validação                                                            |
|                                         | `errors()`   | Array de objetos de erro de validação                                                     |
|                                         | `pending()`  | Validação assíncrona em andamento                                                         |
| **[Interação](#interaction-state)**     | `touched()`  | O usuário focou e saiu do campo (se for interativo)                                       |
|                                         | `dirty()`    | O usuário modificou o campo (se for interativo), mesmo que o valor seja igual ao inicial  |
| **[Disponibilidade](#availability-state)** | `disabled()` | O campo está desabilitado e não afeta o estado do formulário pai                        |
|                                         | `hidden()`   | Indica que o campo deve ser ocultado; a visibilidade no template é controlada com `@if`   |
|                                         | `readonly()` | O campo é somente leitura e não afeta o estado do formulário pai                          |

Esses signals permitem criar experiências de formulário responsivas, que reagem ao comportamento do usuário. As seções abaixo exploram cada categoria em detalhes.

## Estado de validação {#validation-state}

Os signals de estado de validação informam se um campo é válido e quais erros ele contém.

NOTE: Este guia foca em **usar** o estado de validação nos seus templates e na sua lógica (como ler `valid()`, `invalid()` e `errors()` para exibir feedback). Para informações sobre **definir** regras de validação e criar validadores personalizados, consulte o [guia de Validação](guide/forms/signals/validation).

### Verificando a validade {#checking-validity}

Use `valid()` e `invalid()` para verificar o status de validação:

```angular-ts
@Component({
  template: `
    <input type="email" [formField]="loginForm.email" />

    @if (loginForm.email().invalid()) {
      <p class="error">O e-mail é inválido</p>
    }
    @if (loginForm.email().valid()) {
      <p class="success">O e-mail está correto</p>
    }
  `,
})
export class Login {
  loginModel = signal({email: '', password: ''});
  loginForm = form(this.loginModel);
}
```

| Signal      | Retorna `true` quando                                                              |
| ----------- | ---------------------------------------------------------------------------------- |
| `valid()`   | O campo passa em todas as regras de validação e não tem validadores pendentes     |
| `invalid()` | O campo tem erros de validação                                                     |

Ao verificar a validade no código, use `invalid()` em vez de `!valid()` se quiser distinguir entre "tem erros" e "validação pendente". O motivo é que `valid()` e `invalid()` podem ser `false` ao mesmo tempo quando a validação assíncrona está pendente: o campo ainda não é válido, porque a validação não foi concluída, e também não é inválido, porque nenhum erro foi encontrado até o momento.

### Lendo erros de validação {#reading-validation-errors}

Acesse o array de erros de validação com `errors()`, ou um erro individual com `getError()`. Cada objeto de erro contém:

| Propriedade | Descrição                                                                         |
| ----------- | --------------------------------------------------------------------------------- |
| `kind`      | A regra de validação que falhou (como `"required"` ou `"email"`)                  |
| `message`   | Mensagem de erro legível para humanos (opcional)                                  |
| `fieldTree` | Referência à `FieldTree` onde o erro ocorreu                                      |

NOTE: A propriedade `message` é opcional. Os validadores podem fornecer mensagens de erro personalizadas, mas, se nenhuma for especificada, talvez você precise mapear os valores de `kind` do erro para as suas próprias mensagens.

Veja um exemplo de como exibir erros no template por meio de um array de erros de validação:

```angular-ts
@Component({
  template: `
    <input type="email" [formField]="loginForm.email" />

    @if (loginForm.email().errors().length > 0) {
      <div class="errors">
        @for (error of loginForm.email().errors(); track error) {
          <p>{{ error.message }}</p>
        }
      </div>
    }
  `
})
```

Essa abordagem percorre todos os erros de um campo e exibe cada mensagem de erro para o usuário.

Veja um exemplo de como exibir um erro no template com `getError()`:

```angular-ts
@Component({
  template: `
    <input type="email" [formField]="loginForm.email" />

    @if (loginForm.email().getError('required'); as error) {
      <div class="errors">
        <p>{{ error.message }}</p>
      </div>
    }
  `
})
```

`getError()` aceita qualquer string como `kind` de um erro e reconhece os tipos de erro de validação integrados (por exemplo, `"required"`, `"email"`, `"minLength"`).

### Validação pendente {#pending-validation}

O signal `pending()` indica que uma validação assíncrona está em andamento:

```angular-ts
@Component({
  template: `
    <input type="email" [formField]="signupForm.email" />

    @if (signupForm.email().pending()) {
      <p>Verificando se o e-mail está disponível...</p>
    }

    @if (signupForm.email().invalid() && !signupForm.email().pending()) {
      <p>Este e-mail já está em uso</p>
    }
  `
})
```

Este signal permite mostrar estados de carregamento enquanto a validação assíncrona é executada.

## Estado de interação {#interaction-state}

O estado de interação registra se os usuários interagiram com os campos, possibilitando padrões como "mostrar erros somente depois que o usuário tocar em um campo".

### Estado touched {#touched-state}

O signal `touched()` registra se o usuário focou e depois saiu de um campo, ou se o campo foi marcado como tocado programaticamente. Somente campos interativos podem ficar touched; campos ocultos, desabilitados e somente leitura não ficam touched por interações do usuário nem por `markAsTouched()`.

Quando você precisa de uma ação em nível de seção para revelar os erros de validação dentro dessa seção, chame `markAsTouched()` no campo da seção. O valor padrão de `skipDescendants` é `false`, então a chamada marca o campo da seção e cada campo descendente como touched.

Por exemplo, um fluxo de checkout pode validar a seção de entrega antes de permitir que o usuário avance para a próxima etapa:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, required} from '@angular/forms/signals';

@Component({
  selector: 'app-checkout-shipping',
  imports: [FormField],
  template: `
    <label>
      Nome
      <input [formField]="checkoutForm.shipping.name" />
    </label>
    @if (checkoutForm.shipping.name().touched() && checkoutForm.shipping.name().invalid()) {
      <p>{{ checkoutForm.shipping.name().errors()[0].message }}</p>
    }

    <label>
      Endereço
      <input [formField]="checkoutForm.shipping.address" />
    </label>
    @if (checkoutForm.shipping.address().touched() && checkoutForm.shipping.address().invalid()) {
      <p>{{ checkoutForm.shipping.address().errors()[0].message }}</p>
    }

    <button type="button" (click)="continueToPayment()">Continuar</button>

    @if (showPayment() && checkoutForm.shipping().valid()) {
      <p>Pronto para o pagamento.</p>
    }
  `,
})
export class CheckoutShipping {
  checkoutModel = signal({
    shipping: {
      name: '',
      address: '',
    },
  });

  showPayment = signal(false);

  checkoutForm = form(this.checkoutModel, (schemaPath) => {
    required(schemaPath.shipping.name, {message: 'Informe um nome'});
    required(schemaPath.shipping.address, {message: 'Informe um endereço'});
  });

  continueToPayment() {
    this.checkoutForm.shipping().markAsTouched();

    if (this.checkoutForm.shipping().invalid()) {
      return;
    }

    this.showPayment.set(true);
  }
}
```

Quando `continueToPayment()` chama `markAsTouched()` em `checkoutForm.shipping()`, ele usa o comportamento padrão `skipDescendants: false`. O Angular marca `shipping`, `shipping.name` e `shipping.address` como touched, então as mensagens de erro filhas `touched() && invalid()` ficam visíveis antes de o formulário inteiro ser enviado.

NOTE: Passe `{skipDescendants: true}` somente quando o campo que recebe a chamada deve ficar touched sem alterar o estado touched dos seus descendentes.

### Estado dirty {#dirty-state}

Formulários frequentemente precisam detectar se os dados realmente mudaram, por exemplo, para avisar o usuário sobre alterações não salvas ou para habilitar um botão de salvar apenas quando necessário. O signal `dirty()` registra se o usuário modificou o campo.

O signal `dirty()` passa a `true` quando o usuário altera o valor de um campo interativo, e permanece `true` mesmo que o valor volte a ser igual ao valor inicial:

```angular-ts
@Component({
  template: `
    <form novalidate>
      <input [formField]="profileForm.name" />
      <input [formField]="profileForm.bio" />

      @if (profileForm().dirty()) {
        <p class="warning">Você tem alterações não salvas</p>
      }
    </form>
  `,
})
export class Profile {
  profileModel = signal({name: 'Alice', bio: 'Desenvolvedora'});
  profileForm = form(this.profileModel);
}
```

Use `dirty()` para avisos de "alterações não salvas" ou para habilitar botões de salvar somente quando os dados tiverem mudado.

### Touched x dirty {#touched-vs-dirty}

Esses signals registram tipos diferentes de estado de interação:

| Signal      | Quando se torna true                                                                                                                  |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `touched()` | O usuário focou e saiu de um campo interativo, ou o campo foi marcado como tocado programaticamente                                  |
| `dirty()`   | O usuário modificou um campo interativo (mesmo que nunca tenha saído dele, e mesmo que o valor atual seja igual ao inicial)          |

Um campo pode estar em diferentes combinações:

| Estado                    | Cenário                                                       |
| ------------------------- | ------------------------------------------------------------- |
| Touched, mas não dirty    | O usuário focou e saiu do campo, mas não fez alterações       |
| Touched e dirty           | O usuário focou o campo, alterou o valor e saiu do campo      |

NOTE: Campos ocultos, desabilitados e somente leitura são não interativos: eles não ficam touched nem dirty por interações do usuário.

## Estado de disponibilidade {#availability-state}

Os signals de estado de disponibilidade controlam se os campos são interativos, editáveis ou visíveis. Campos desabilitados, ocultos e somente leitura são não interativos. Eles não afetam se o formulário pai é válido, touched ou dirty.

### Campos desabilitados {#disabled-fields}

O signal `disabled()` indica se um campo aceita a entrada do usuário. Campos desabilitados aparecem na interface, mas o usuário não consegue interagir com eles.

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, disabled} from '@angular/forms/signals';

@Component({
  selector: 'app-order',
  imports: [FormField],
  // DICA: A diretiva `[formField]` vincula automaticamente o atributo `disabled` com base
  // no estado `disabled()` do campo, então você não precisa adicionar manualmente `[disabled]="field().disabled()"`
  template: `
    <input [formField]="orderForm.couponCode" />

    @if (orderForm.couponCode().disabled()) {
      <p class="info">O cupom está disponível somente para pedidos acima de R$ 50</p>
    }
  `,
})
export class Order {
  orderModel = signal({
    total: 25,
    couponCode: '',
  });

  orderForm = form(this.orderModel, (schemaPath) => {
    disabled(schemaPath.couponCode, {when: ({valueOf}) => valueOf(schemaPath.total) < 50});
  });
}
```

Neste exemplo, usamos `valueOf(schemaPath.total)` para verificar o valor do campo `total` e determinar se `couponCode` deve ficar desabilitado.

NOTE: O parâmetro de callback do schema (`schemaPath` nestes exemplos) é um objeto `SchemaPathTree` que fornece caminhos para todos os campos do seu formulário. Você pode dar a esse parâmetro o nome que quiser.

Ao definir regras como `disabled()`, `hidden()` ou `readonly()`, a função `when` recebe um objeto `FieldContext`, que normalmente é desestruturado (como `({valueOf})`). Dois métodos comumente usados em regras de validação são:

- `valueOf(schemaPath.otherField)`: lê o valor de outro campo do formulário
- `value()`: um signal com o valor do campo ao qual a regra é aplicada

Campos desabilitados não contribuem para o estado de validação do formulário pai. Mesmo que um campo desabilitado fosse inválido, o formulário pai ainda pode ser válido. O estado `disabled()` afeta a interatividade e a validação, mas não altera o valor do campo.

### Campos ocultos {#hidden-fields}

O signal `hidden()` indica se um campo está oculto de forma condicional. Use `hidden()` com `@if` para mostrar ou ocultar campos com base em condições:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, hidden} from '@angular/forms/signals';

@Component({
  selector: 'app-profile',
  imports: [FormField],
  template: `
    <label>
      <input type="checkbox" [formField]="profileForm.isPublic" />
      Tornar o perfil público
    </label>

    @if (!profileForm.publicUrl().hidden()) {
      <label>
        URL pública
        <input [formField]="profileForm.publicUrl" />
      </label>
    }
  `,
})
export class Profile {
  profileModel = signal({
    isPublic: false,
    publicUrl: '',
  });

  profileForm = form(this.profileModel, (schemaPath) => {
    hidden(schemaPath.publicUrl, {when: ({valueOf}) => !valueOf(schemaPath.isPublic)});
  });
}
```

Campos ocultos não participam da validação. Se um campo obrigatório estiver oculto, ele não impedirá o envio do formulário. O estado `hidden()` afeta a disponibilidade e a validação, mas não altera o valor do campo.

### Campos somente leitura {#readonly-fields}

O signal `readonly()` indica se um campo é somente leitura. Campos somente leitura exibem o valor, mas os usuários não podem editá-lo:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, readonly} from '@angular/forms/signals';

@Component({
  selector: 'app-account',
  imports: [FormField],
  template: `
    <label>
      Nome de usuário (não pode ser alterado)
      <input [formField]="accountForm.username" />
    </label>

    <label>
      E-mail
      <input [formField]="accountForm.email" />
    </label>
  `,
})
export class Account {
  accountModel = signal({
    username: 'johndoe',
    email: 'john@example.com',
  });

  accountForm = form(this.accountModel, (schemaPath) => {
    readonly(schemaPath.username);
  });
}
```

NOTE: A diretiva `[formField]` vincula automaticamente o atributo `readonly` com base no estado `readonly()` do campo, então você não precisa adicionar manualmente `[readonly]="field().readonly()"`.

Assim como os campos desabilitados e ocultos, os campos somente leitura são não interativos e não afetam o estado do formulário pai. O estado `readonly()` afeta a editabilidade e a validação, mas não altera o valor do campo.

### Quando usar cada um {#when-to-use-each}

| Estado       | Use quando                                                              | O usuário pode ver | O usuário pode interagir | Contribui para a validação |
| ------------ | ----------------------------------------------------------------------- | ------------------ | ------------------------ | -------------------------- |
| `disabled()` | O campo está temporariamente indisponível (por exemplo, com base em outros valores) | Sim        | Não                      | Não                        |
| `hidden()`   | O campo não é relevante no contexto atual                               | Não (com @if)      | Não                      | Não                        |
| `readonly()` | O valor deve ficar visível, mas não editável                            | Sim                | Não                      | Não                        |

## Estado no nível do formulário {#form-level-state}

O formulário raiz também é um campo na árvore de campos. Quando você o chama como uma função, ele também retorna um objeto `FieldState` que agrega o estado de todos os campos filhos.

### Acessando o estado do formulário {#accessing-form-state}

```angular-ts
@Component({
  template: `
    <form novalidate>
      <input [formField]="loginForm.email" />
      <input [formField]="loginForm.password" />

      <button [disabled]="!loginForm().valid()">Entrar</button>
    </form>
  `,
})
export class Login {
  loginModel = signal({email: '', password: ''});
  loginForm = form(this.loginModel);
}
```

Neste exemplo, o formulário só é válido quando todos os campos filhos são válidos. Isso permite habilitar ou desabilitar botões de envio com base na validade geral do formulário.

### Signals no nível do formulário {#form-level-signals}

Como o formulário raiz é um campo, ele tem os mesmos signals (como `valid()`, `invalid()`, `touched()`, `dirty()` etc.).

| Signal      | Comportamento no nível do formulário                                                  |
| ----------- | ------------------------------------------------------------------------------------- |
| `valid()`   | Todos os campos interativos são válidos e nenhum validador está pendente              |
| `invalid()` | Pelo menos um campo interativo tem erros de validação                                 |
| `pending()` | Pelo menos um campo interativo tem validação assíncrona pendente                      |
| `touched()` | O formulário, ou pelo menos um descendente interativo, está touched                   |
| `dirty()`   | O usuário modificou pelo menos um campo interativo                                    |

### Quando usar estado no nível do formulário ou do campo {#when-to-use-form-level-vs-field-level}

**Use o estado no nível do formulário para:**

- Estado habilitado/desabilitado do botão de envio
- Estado do botão "Salvar"
- Verificações gerais de validade do formulário
- Avisos de alterações não salvas

**Use o estado no nível do campo para:**

- Mensagens de erro de campos individuais
- Estilização específica de campos
- Feedback de validação por campo
- Disponibilidade condicional de campos

## Propagação de estado {#state-propagation}

O estado do campo se propaga dos campos filhos, passando pelos grupos de campos pais, até o formulário raiz.

### Como o estado dos filhos afeta os formulários pais {#how-child-state-affects-parent-forms}

Quando um campo filho fica inválido, o grupo de campos pai também fica inválido, e o mesmo acontece com o formulário raiz. Quando um filho fica touched ou dirty, o grupo de campos pai e o formulário raiz refletem essa mudança. Essa agregação permite verificar a validade em qualquer nível, seja no campo ou no formulário inteiro.

```ts
const userModel = signal({
  profile: {
    firstName: '',
    lastName: '',
  },
  address: {
    street: '',
    city: '',
  },
});

const userForm = form(userModel);

// Se firstName for inválido, profile fica inválido
userForm.profile.firstName().invalid() === true;
// → userForm.profile().invalid() === true
// → userForm().invalid() === true
```

### Campos ocultos, desabilitados e somente leitura {#hidden-disabled-and-readonly-fields}

Campos ocultos, desabilitados e somente leitura são não interativos e não afetam o estado do formulário pai:

```ts
const orderModel = signal({
  customerName: '',
  requiresShipping: false,
  shippingAddress: '',
});

const orderForm = form(orderModel, (schemaPath) => {
  hidden(schemaPath.shippingAddress, {when: ({valueOf}) => !valueOf(schemaPath.requiresShipping)});
});
```

Neste exemplo, quando `shippingAddress` está oculto, ele não afeta a validade do formulário. Por isso, mesmo que `shippingAddress` esteja vazio e seja obrigatório, o formulário pode ser válido.

Esse comportamento impede que campos ocultos, desabilitados ou somente leitura bloqueiem o envio do formulário ou afetem os estados de validação, touched e dirty.

## Usando o estado nos templates {#using-state-in-templates}

Os signals de estado do campo se integram perfeitamente aos templates do Angular, possibilitando experiências de formulário reativas sem tratamento manual de eventos.

### Exibição condicional de erros {#conditional-error-display}

Mostre erros somente depois que o usuário interagir com um campo:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, email} from '@angular/forms/signals';

@Component({
  selector: 'app-signup',
  imports: [FormField],
  template: `
    <label>
      E-mail
      <input type="email" [formField]="signupForm.email" />
    </label>

    @if (signupForm.email().touched() && signupForm.email().invalid()) {
      <p class="error">{{ signupForm.email().errors()[0].message }}</p>
    }
  `,
})
export class Signup {
  signupModel = signal({email: '', password: ''});

  signupForm = form(this.signupModel, (schemaPath) => {
    email(schemaPath.email);
  });
}
```

Esse padrão evita exibir erros antes que o usuário tenha tido a chance de interagir com o campo. Os erros aparecem somente depois que o usuário focou e depois saiu do campo.

### Disponibilidade condicional de campos {#conditional-field-availability}

Use o signal `hidden()` com `@if` para mostrar ou ocultar campos condicionalmente:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, hidden} from '@angular/forms/signals';

@Component({
  selector: 'app-order',
  imports: [FormField],
  template: `
    <label>
      <input type="checkbox" [formField]="orderForm.requiresShipping" />
      Requer entrega
    </label>

    @if (!orderForm.shippingAddress().hidden()) {
      <label>
        Endereço de entrega
        <input [formField]="orderForm.shippingAddress" />
      </label>
    }
  `,
})
export class Order {
  orderModel = signal({
    requiresShipping: false,
    shippingAddress: '',
  });

  orderForm = form(this.orderModel, (schemaPath) => {
    hidden(schemaPath.shippingAddress, {
      when: ({valueOf}) => !valueOf(schemaPath.requiresShipping),
    });
  });
}
```

Campos ocultos não participam da validação, o que permite enviar o formulário mesmo que o campo oculto fosse inválido.

### Rastreando valores de campos em arrays {#tracking-values-for-array-fields}

No Signal Forms, um bloco `@for` sobre um conjunto de campos deve ser rastreado pela identidade do campo.

```angular-ts
@Component({
  imports: [FormField],
  template: `
    @for (field of form.emails; track field) {
      <input [formField]="field" />
    }
  `,
})
export class App {
  formModel = signal({emails: ['john.doe@mail.com', 'max.musterman@mail.com']});
  form = form(this.formModel);
}
```

O sistema de formulários já rastreia os valores do model dentro do array e mantém uma identidade estável para os campos que ele cria automaticamente.

Quando um item muda, ele pode representar uma nova entidade lógica, mesmo que algumas de suas propriedades pareçam iguais. Rastrear pela identidade garante que o framework trate o item como um elemento distinto, em vez de reutilizar elementos da interface existentes. Isso evita que elementos com estado, como campos de entrada, sejam compartilhados incorretamente, e mantém os bindings alinhados com a parte correta do model.

## Usando o estado do campo na lógica do componente {#using-field-state-in-component-logic}

Os signals de estado do campo funcionam com os primitivos reativos do Angular, como `computed()` e `effect()`, para lógica de formulário avançada.

### Verificações de validação antes do envio {#validation-checks-before-submission}

Verifique a validade do formulário nos métodos do componente:

```ts
export class Registration {
  registrationModel = signal({
    username: '',
    email: '',
    password: '',
  });

  registrationForm = form(this.registrationModel);

  async onSubmit() {
    // Aguarda qualquer validação assíncrona pendente
    if (this.registrationForm().pending()) {
      console.log('Aguardando validação...');
      return;
    }

    // Protege contra envios inválidos
    if (this.registrationForm().invalid()) {
      console.error('O formulário é inválido');
      return;
    }

    const data = this.registrationModel();
    await this.api.register(data);
  }
}
```

Isso garante que somente dados válidos e totalmente validados cheguem à sua API.

### Estado derivado com computed {#derived-state-with-computed}

Crie signals computados com base no estado do campo para que eles sejam atualizados automaticamente quando o estado subjacente mudar:

```ts
export class Password {
  passwordModel = signal({password: '', confirmPassword: ''});
  passwordForm = form(this.passwordModel);

  // Calcula o indicador de força da senha
  passwordStrength = computed(() => {
    const password = this.passwordForm.password().value();
    if (password.length < 8) return 'fraca';
    if (password.length < 12) return 'média';
    return 'forte';
  });

  // Verifica se todos os campos obrigatórios estão preenchidos
  allFieldsFilled = computed(() => {
    return (
      this.passwordForm.password().value().length > 0 &&
      this.passwordForm.confirmPassword().value().length > 0
    );
  });
}
```

### Alterações de estado programáticas {#programmatic-state-changes}

Embora o estado do campo normalmente seja atualizado pelas interações do usuário (digitar, focar, sair do campo), às vezes você precisa controlá-lo programaticamente. Cenários comuns incluem o envio do formulário e a redefinição de formulários.

#### Envio do formulário {#form-submission}

O Signal Forms fornece a diretiva `FormRoot`, que simplifica o envio do formulário. Ela impede automaticamente o comportamento padrão de envio do navegador e define o atributo `novalidate` no elemento `<form>`.

```angular-ts
import {FormField, FormRoot, form, required, email} from '@angular/forms/signals';
import {Component, signal} from '@angular/core';

@Component({
  imports: [FormRoot, FormField],
  template: `
    <form [formRoot]="registrationForm">
      <input [formField]="registrationForm.username" />
      <input type="email" [formField]="registrationForm.email" />
      <input type="password" [formField]="registrationForm.password" />

      <button type="submit">Cadastrar</button>
    </form>
  `,
})
export class Registration {
  registrationModel = signal({username: '', email: '', password: ''});

  registrationForm = form(
    this.registrationModel,
    (schemaPath) => {
      required(schemaPath.username);
      email(schemaPath.email);
      required(schemaPath.password);
    },
    {
      submission: {
        action: async () => this.submitToServer(),
      },
    },
  );

  private submitToServer() {
    // Envia os dados para o servidor
  }
}
```

Quando você usa `FormRoot`, enviar o formulário chama automaticamente a função `submit()`, que marca todos os campos como touched (revelando os erros de validação) e executa o callback `action` se o formulário for válido.

Você também pode enviar um formulário manualmente, sem usar a diretiva, chamando `submit(this.registrationForm)`. Ao chamar a função `submit` diretamente dessa forma, você pode passar um `FormSubmitOptions` para substituir a lógica padrão de `submission` do formulário: `submit(this.registrationForm, {action: () => /* ... */ })`.

#### Redefinindo formulários após o envio {#resetting-forms-after-submission}

Depois de enviar um formulário com sucesso, você pode querer devolvê-lo ao estado inicial, limpando o histórico de interação do usuário e os valores dos campos. O método `reset()` limpa as flags touched e dirty. Você também pode passar um valor opcional para `reset()` para atualizar os dados do model:

```ts
export class Contact {
  private readonly INITIAL_MODEL = {name: '', email: '', message: ''};
  contactModel = signal({...this.INITIAL_MODEL});
  contactForm = form(this.contactModel, {
    submission: {
      action: async (f) => {
        await this.api.sendMessage(this.contactModel());
        // Limpa o estado de interação (touched, dirty) e volta aos valores iniciais
        f().reset({...this.INITIAL_MODEL});
      },
    },
  });
}
```

Isso garante que o formulário esteja pronto para novas entradas, sem exibir mensagens de erro desatualizadas nem indicadores de estado dirty.

## Estilizando com base no estado de validação {#styling-based-on-validation-state}

Você pode aplicar estilos personalizados ao formulário vinculando classes CSS com base no estado de validação:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, email} from '@angular/forms/signals';

@Component({
  imports: [FormField],
  template: `
    <input
      type="email"
      [formField]="form.email"
      [class.is-invalid]="form.email().touched() && form.email().invalid()"
      [class.is-valid]="form.email().touched() && form.email().valid()"
    />
  `,
  styles: `
    input.is-invalid {
      border: 2px solid red;
      background-color: white;
    }

    input.is-valid {
      border: 2px solid green;
    }
  `,
})
export class StyleExample {
  model = signal({email: ''});

  form = form(this.model, (schemaPath) => {
    email(schemaPath.email);
  });
}
```

Verificar `touched()` e o estado de validação juntos garante que os estilos apareçam somente depois que o usuário tiver interagido com o campo.

## Dar foco a um controle de formulário vinculado a um campo {#focus-a-form-control-bound-to-a-form-field}

O Signal Forms fornece um método `focusBoundControl()` no estado do campo que permite mover programaticamente o [foco](https://developer.mozilla.org/pt-BR/docs/Web/API/HTMLElement/focus) para o controle de formulário associado a um determinado campo.

Um caso de uso comum é melhorar a acessibilidade no envio do formulário: quando um formulário é inválido, exibir as mensagens de erro e mover automaticamente o foco para o primeiro campo inválido, guiando o usuário para a correção.

### Uso básico {#basic-usage}

Dado um formulário de cadastro:

```ts
@Component({/* ... */})
export class Registration {
  registrationModel = signal({username: '', email: '', password: ''});
  registrationForm = form(this.registrationModel, (schemaPath) => {
    required(schemaPath.username);
    email(schemaPath.email);
    required(schemaPath.password);
  });
}
```

Para mover o foco para o controle vinculado ao campo `email`:

```ts
registrationForm.email().focusBoundControl();
```

### Evitando a rolagem {#preventing-scroll}

Se o controle de destino estiver fora da área visível e você quiser focá-lo sem provocar uma rolagem, defina a opção [preventScroll](https://developer.mozilla.org/pt-BR/docs/Web/API/HTMLElement/focus#preventscroll) como `true` ao chamar o método `focusBoundControl()`.

```ts
registrationForm.email().focusBoundControl({preventScroll: true});
```

### Focando o primeiro campo inválido no envio {#focusing-the-first-invalid-field-on-submission}

Use `errorSummary()` para localizar o primeiro campo inválido e focá-lo quando o usuário enviar o formulário com erros:

```ts
onSubmit() {
  const firstError = this.registrationForm().errorSummary()[0];
  if (firstError?.fieldTree) {
    firstError.fieldTree().focusBoundControl();
  } else {
    // prossegue com o envio
  }
}
```

### Controles personalizados {#custom-controls}

Por padrão, chamar `focusBoundControl()` em um controle personalizado não tem efeito, porque um controle personalizado pode conter vários inputs nativos. Por exemplo, um seletor de data pode conter campos separados para dia, mês e ano. Por isso, o Angular não consegue determinar qual elemento deve receber o foco nem qual ação executar.

Para oferecer suporte a foco programático em um controle personalizado, implemente um método `focus()`. Quando `focusBoundControl()` é chamado no estado do campo associado a um controle personalizado, o Angular chama o método `focus()` do controle, se ele existir.

Considere um campo de senha personalizado:

```html
<div class="password-block">
  <input type="password" #passwordCtrl [value]="value()" (input)="value.set($event.target.value)" />
</div>
```

```ts
@Component({/* ... */})
export class PasswordInput implements FormValueControl<string> {
  readonly value = model<string>('');
  readonly passwordCtrl = viewChild.required<ElementRef<HTMLInputElement>>('passwordCtrl');

  // Chamado automaticamente quando focusBoundControl() é invocado
  // no estado do campo associado a este controle personalizado
  focus(): void {
    this.passwordCtrl().nativeElement.focus();
  }
}
```

## Próximos passos {#next-steps}

Este guia abordou o tratamento de status de disponibilidade e validação, o rastreamento de interações e a propagação do estado do campo. Guias relacionados exploram outros aspectos do Signal Forms:

<docs-pill-row>
  <docs-pill href="guide/forms/signals/models" title="Modelos de formulário" />
  <docs-pill href="guide/forms/signals/validation" title="Validação" />
  <docs-pill href="guide/forms/signals/custom-controls" title="Controles personalizados" />
  <!-- <docs-pill href="guide/forms/signals/arrays" title="Trabalhando com arrays" /> -->
</docs-pill-row>
