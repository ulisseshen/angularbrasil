<!-- ia-translate: true -->
# Validação

Formulários precisam de validação para garantir que os usuários forneçam dados corretos e completos antes do envio. Sem validação, você precisaria tratar problemas de qualidade dos dados no servidor, oferecer uma experiência ruim com mensagens de erro pouco claras e verificar manualmente cada restrição.

Signal Forms oferece uma abordagem de validação baseada em schema. As regras de validação são vinculadas aos campos por meio de uma função de schema, são executadas automaticamente quando os valores mudam e expõem erros por meio de signals de estado do campo. Isso permite uma validação reativa que é atualizada conforme os usuários interagem com o formulário.

<docs-code-multifile preview hideCode path="adev/src/content/examples/signal-forms/src/login-validation-complete/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/signal-forms/src/login-validation-complete/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/signal-forms/src/login-validation-complete/app/app.html"/>
  <docs-code header="app.css" path="adev/src/content/examples/signal-forms/src/login-validation-complete/app/app.css"/>
</docs-code-multifile>

## Noções básicas de validação {#validation-basics}

A validação no Signal Forms é definida por meio de uma função de schema passada como segundo argumento para `form()`.

### A função de schema {#the-schema-function}

A função de schema recebe um objeto `SchemaPathTree` que permite definir suas regras de validação:

<docs-code
  header="app.ts"
  path="adev/src/content/examples/signal-forms/src/login-validation-complete/app/app.ts"
  visibleLines="[29,30,31,32,33,34]"
  highlight="[30,31,33]"
/>

A função de schema é executada uma única vez durante a inicialização do formulário. As regras de validação são vinculadas aos campos usando o parâmetro de caminho do schema (como `schemaPath.email` e `schemaPath.password`), e a validação é executada automaticamente sempre que os valores dos campos mudam.

NOTE: O parâmetro de callback do schema (`schemaPath` nestes exemplos) é um objeto `SchemaPathTree` que fornece caminhos para todos os campos do seu formulário. Você pode dar a este parâmetro o nome que quiser.

### Como a validação funciona {#how-validation-works}

A validação no Signal Forms segue este padrão:

1. **Definir regras de validação no schema** - Vincule as regras de validação aos campos na função de schema
2. **Execução automática** - As regras de validação são executadas quando os valores dos campos mudam
3. **Propagação de erros** - Os erros de validação são expostos por meio de signals de estado do campo
4. **Atualizações reativas** - A UI é atualizada automaticamente quando o estado de validação muda

A validação é executada a cada mudança de valor em campos interativos. Campos ocultos, desabilitados e somente leitura não executam validação: suas regras de validação são ignoradas até que o campo volte a ser interativo.

### Momento da validação {#validation-timing}

As regras de validação são executadas nesta ordem:

1. **Validação síncrona** - Todas as regras de validação síncronas são executadas quando o valor muda
2. **Validação assíncrona** - As regras de validação assíncronas são executadas somente depois que todas as regras de validação síncronas passam
3. **Atualização do estado do campo** - Os signals `valid()`, `invalid()`, `errors()` e `pending()` são atualizados

As regras de validação síncronas (como `required()` e `email()`) são concluídas imediatamente. As regras de validação assíncronas (como `validateHttp()`) podem levar algum tempo e definem o signal `pending()` como `true` enquanto são executadas.

Todas as regras de validação são executadas a cada mudança: a validação não para no primeiro erro. Se um campo tiver as regras `required()` e `email()`, ambas são executadas e ambas podem produzir erros ao mesmo tempo.

### Validação HTML nativa {#native-html-validation}

O Signal Forms **não** usa a [validação de restrições](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Constraint_validation) embutida do navegador para executar as regras de validação. Isso é intencional: o Signal Forms permite que qualquer componente atue como um controle de formulário, e não apenas elementos nativos de formulário.

Em vez disso, suas regras de validação são executadas inteiramente no Angular, e o estado de validação é exposto por meio de signals de estado do campo, como `valid()`, `invalid()` e `errors()`, e não pelo estado de validade nativo do elemento. A [directive `FormRoot`](guide/forms/signals/form-submission) também define o atributo `novalidate` no elemento do formulário para que o navegador não bloqueie o envio.

Quando um campo está vinculado a um elemento nativo de formulário, algumas regras de validação embutidas espelham sua restrição no atributo nativo correspondente: `required()`, `min()`, `max()`, `minLength()` e `maxLength()` definem os atributos `required`, `min`, `max`, `minlength` e `maxlength` quando o elemento suporta esses atributos. Uma exceção é `pattern()`, que não define o atributo nativo `pattern`. O Signal Forms define esses atributos para controlar o comportamento da entrada e melhorar a acessibilidade, **e não para acionar a validação nativa**.

NOTE: Há um caso em que o Signal Forms lê o estado de validade nativo: quando o navegador não consegue interpretar o valor de uma entrada nativa (por exemplo, uma data parcialmente digitada). Mesmo nesse caso, o erro aparece pelo signal `errors()` do campo, como qualquer outro erro de validação. Veja [Transformação de valor](guide/forms/signals/custom-controls#value-transformation) para detalhes.

IMPORTANT: Não dependa de recursos de validade nativa, como os pseudo-classes CSS `:valid` e `:invalid`, a propriedade `validity` do elemento ou `validationMessage`. O navegador pode marcar algumas entradas como inválidas como efeito colateral dos atributos espelhados (por exemplo, um input do tipo number com valor abaixo do seu `min`), mas esse comportamento varia conforme a regra de validação e o tipo de entrada, e não é uma forma suportada de observar o estado de validação.

Para estilizar controles com base no estado de validação, vincule classes aos signals de estado do campo (veja [Gerenciamento de estado do campo](guide/forms/signals/field-state-management#conditional-error-display)) ou configure classes de status automáticas (veja [Classes de status automáticas](guide/forms/signals/migration#automatic-status-classes)).

## Regras de validação embutidas {#built-in-validation-rules}

O Signal Forms oferece regras de validação para cenários comuns. Todas as regras de validação embutidas aceitam um objeto de opções para mensagens de erro personalizadas e lógica condicional.

### required() {#required}

A regra de validação `required()` garante que um campo tenha um valor:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, required} from '@angular/forms/signals';

@Component({
  selector: 'app-registration',
  imports: [FormField],
  template: `
    <form novalidate>
      <label>
        Username
        <input [formField]="registrationForm.username" />
      </label>

      <label>
        Email
        <input type="email" [formField]="registrationForm.email" />
      </label>

      <button type="submit">Register</button>
    </form>
  `,
})
export class RegistrationComponent {
  registrationModel = signal({
    username: '',
    email: '',
  });

  registrationForm = form(this.registrationModel, (schemaPath) => {
    required(schemaPath.username, {message: 'Username is required'});
    required(schemaPath.email, {message: 'Email is required'});
  });
}
```

Um campo é considerado "vazio" quando seu valor é um dos seguintes, e não vazio para qualquer outro valor, incluindo `0` e o array vazio `[]`:

| Condição                    | Exemplo     |
| --------------------------- | ----------- |
| O valor é `null`            | `null`      |
| O valor é `undefined`       | `undefined` |
| O valor é uma string vazia  | `''`        |
| O valor é `false`           | `false`     |
| O valor é `NaN`             | `NaN`       |

Os dois últimos merecem destaque:

- `false` é considerado vazio para seguir a semântica nativa de `required` em `<input type="checkbox">`, em que uma caixa desmarcada falha na validação.
- `NaN` é considerado vazio porque geralmente é resultado de um erro de interpretação e não é um número válido.

Para requisitos condicionais, use a opção `when`:

```ts
registrationForm = form(this.registrationModel, (schemaPath) => {
  required(schemaPath.promoCode, {
    message: 'Promo code is required for discounts',
    when: ({valueOf}) => valueOf(schemaPath.applyDiscount),
  });
});
```

A regra de validação só é executada quando a função `when` retorna `true`.

NOTE: `required` trata um array vazio como presente (válido), então use [`minLength()`](#minlength-and-maxlength) para exigir um número mínimo de itens em um array.

### email() {#email}

A regra de validação `email()` verifica se o formato do e-mail é válido:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, email} from '@angular/forms/signals';

@Component({
  selector: 'app-contact',
  imports: [FormField],
  template: `
    <form novalidate>
      <label>
        Your Email
        <input type="email" [formField]="contactForm.email" />
      </label>
    </form>
  `,
})
export class ContactComponent {
  contactModel = signal({email: ''});

  contactForm = form(this.contactModel, (schemaPath) => {
    email(schemaPath.email, {message: 'Please enter a valid email address'});
  });
}
```

A regra de validação `email()` usa uma expressão regular de formato de e-mail padrão. Ela aceita endereços como `usuario@exemplo.com`, mas rejeita endereços malformados como `usuario@` ou `@exemplo.com`.

### min() e max() {#min-and-max}

As regras de validação `min()` e `max()` funcionam com valores numéricos:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, min, max} from '@angular/forms/signals';

@Component({
  selector: 'app-age-form',
  imports: [FormField],
  template: `
    <form novalidate>
      <label>
        Age
        <input type="number" [formField]="ageForm.age" />
      </label>

      <label>
        Rating (1-5)
        <input type="number" [formField]="ageForm.rating" />
      </label>
    </form>
  `,
})
export class AgeFormComponent {
  ageModel = signal({
    age: 0,
    rating: 0,
  });

  ageForm = form(this.ageModel, (schemaPath) => {
    min(schemaPath.age, 18, {message: 'You must be at least 18 years old'});
    max(schemaPath.age, 120, {message: 'Please enter a valid age'});

    min(schemaPath.rating, 1, {message: 'Rating must be at least 1'});
    max(schemaPath.rating, 5, {message: 'Rating cannot exceed 5'});
  });
}
```

Você pode usar valores computados para restrições dinâmicas:

```ts
ageForm = form(this.ageModel, (schemaPath) => {
  min(schemaPath.participants, () => this.minimumRequired(), {
    message: 'Not enough participants',
  });
});
```

### minDate() e maxDate() {#mindate-and-maxdate}

As regras de validação `minDate()` e `maxDate()` funcionam com valores `Date`, como um campo vinculado a um `<input type="date">`. Elas também definem os atributos `min` e `max` dessa entrada.

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, minDate, maxDate} from '@angular/forms/signals';

@Component({
  selector: 'app-booking-form',
  imports: [FormField],
  template: `
    <form novalidate>
      <label>
        Check-in
        <input type="date" [formField]="bookingForm.checkIn" />
      </label>
    </form>
  `,
})
export class BookingFormComponent {
  bookingModel = signal<{checkIn: Date | null}>({checkIn: null});

  bookingForm = form(this.bookingModel, (schemaPath) => {
    minDate(schemaPath.checkIn, new Date('2026-06-01'), {message: 'Bookings open on June 1'});
    maxDate(schemaPath.checkIn, new Date('2026-08-31'), {message: 'Bookings close on August 31'});
  });
}
```

IMPORTANT: Um `<input type="date">` lê e grava valores `Date` à meia-noite UTC, independentemente do fuso horário do usuário, porque é assim que o `valueAsDate` do navegador funciona. Crie os limites da mesma forma, por exemplo com `new Date('2026-06-01')` ou `new Date(Date.UTC(2026, 5, 1))`. Um `Date` criado a partir do horário local, como `new Date(2026, 5, 1)` ou `new Date()`, é deslocado pelo deslocamento UTC do usuário. Dependendo do fuso horário, o atributo `min` ou `max` pode ficar um dia errado, e a própria data limite pode ser rejeitada.

Para exigir uma data que não seja anterior a hoje, use a data de calendário atual no fuso horário do usuário, expressa à meia-noite UTC:

```ts
const now = new Date();
const today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));

minDate(schemaPath.checkIn, today, {message: 'Check-in cannot be in the past'});
```

Passar `new Date()` diretamente pode rejeitar a data de hoje, porque o valor escolhido no input é a meia-noite UTC, que é anterior ao horário atual. Isso acontece em UTC e nos fusos horários atrás dele.

### minLength() e maxLength() {#minlength-and-maxlength}

As regras de validação `minLength()` e `maxLength()` funcionam com strings e arrays:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, minLength, maxLength} from '@angular/forms/signals';

@Component({
  selector: 'app-password-form',
  imports: [FormField],
  template: `
    <form novalidate>
      <label>
        Password
        <input type="password" [formField]="passwordForm.password" />
      </label>

      <label>
        Bio
        <textarea [formField]="passwordForm.bio"></textarea>
      </label>
    </form>
  `,
})
export class PasswordFormComponent {
  passwordModel = signal({
    password: '',
    bio: '',
  });

  passwordForm = form(this.passwordModel, (schemaPath) => {
    minLength(schemaPath.password, 8, {message: 'Password must be at least 8 characters'});
    maxLength(schemaPath.password, 100, {message: 'Password is too long'});

    maxLength(schemaPath.bio, 500, {message: 'Bio cannot exceed 500 characters'});
  });
}
```

Para strings, "tamanho" significa o número de caracteres. Para arrays, "tamanho" significa o número de elementos.

### pattern() {#pattern}

A regra de validação `pattern()` valida um valor contra uma expressão regular:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, pattern} from '@angular/forms/signals';

@Component({
  selector: 'app-phone-form',
  imports: [FormField],
  template: `
    <form novalidate>
      <label>
        Phone Number
        <input [formField]="phoneForm.phone" placeholder="555-123-4567" />
      </label>

      <label>
        Postal Code
        <input [formField]="phoneForm.postalCode" placeholder="12345" />
      </label>
    </form>
  `,
})
export class PhoneFormComponent {
  phoneModel = signal({
    phone: '',
    postalCode: '',
  });

  phoneForm = form(this.phoneModel, (schemaPath) => {
    pattern(schemaPath.phone, /^\d{3}-\d{3}-\d{4}$/, {
      message: 'Phone must be in format: 555-123-4567',
    });

    pattern(schemaPath.postalCode, /^\d{5}$/, {
      message: 'Postal code must be 5 digits',
    });
  });
}
```

Padrões comuns:

| Tipo de padrão   | Expressão regular       | Exemplo      |
| ---------------- | ----------------------- | ------------ |
| Telefone         | `/^\d{3}-\d{3}-\d{4}$/` | 555-123-4567 |
| CEP (EUA)        | `/^\d{5}$/`             | 12345        |
| Alfanumérico     | `/^[a-zA-Z0-9]+$/`      | abc123       |
| Seguro para URL  | `/^[a-zA-Z0-9_-]+$/`    | my-url_123   |

## Validação de itens de array {#validation-of-array-items}

Formulários podem incluir arrays de objetos aninhados (por exemplo, uma lista de itens de pedido). Para aplicar regras de validação a cada item de um array, use `applyEach()` dentro da sua função de schema. `applyEach()` percorre o caminho do array e fornece um caminho para cada item, onde você pode aplicar validadores da mesma forma que faria com campos de nível superior.

```ts
import {Component, signal} from '@angular/core';
import {applyEach, FormField, form, min, required, SchemaPathTree} from '@angular/forms/signals';

type Item = {name: string; quantity: number};

interface Order {
  title: string;
  description: string;
  items: Item[];
}

function ItemSchema(item: SchemaPathTree<Item>) {
  required(item.name, {message: 'Item name is required'});
  min(item.quantity, 1, {message: 'Quantity must be at least 1'});
}

@Component(/* ... */)
export class OrderComponent {
  orderModel = signal<Order>({
    title: '',
    description: '',
    items: [{name: '', quantity: 0}],
  });

  orderForm = form(this.orderModel, (schemaPath) => {
    required(schemaPath.title);
    required(schemaPath.description);

    applyEach(schemaPath.items, ItemSchema);
  });
}
```

## Erros de validação {#validation-errors}

Quando as regras de validação falham, elas produzem objetos de erro que descrevem o que deu errado. Entender a estrutura do erro ajuda a dar um feedback claro aos usuários.

NOTE: Esta seção trata dos erros que as regras de validação produzem. Para exibir e usar erros de validação na sua UI, veja o [guia de Gerenciamento de estado do campo](guide/forms/signals/field-state-management).

### Estrutura do erro {#error-structure}

Cada objeto de erro de validação contém estas propriedades:

| Propriedade | Descrição                                                                                   |
| ----------- | ------------------------------------------------------------------------------------------- |
| `kind`      | A regra de validação que falhou (por exemplo, "required", "email", "minLength")             |
| `message`   | Mensagem de erro opcional e legível por humanos                                             |

As regras de validação embutidas definem automaticamente a propriedade `kind`. A propriedade `message` é opcional: você pode fornecer mensagens personalizadas pelas opções da regra de validação.

### Mensagens de erro personalizadas {#custom-error-messages}

Todas as regras de validação embutidas aceitam uma opção `message` para textos de erro personalizados:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, required, minLength} from '@angular/forms/signals';

@Component({
  selector: 'app-signup',
  imports: [FormField],
  template: `
    <form novalidate>
      <label>
        Username
        <input [formField]="signupForm.username" />
      </label>

      <label>
        Password
        <input type="password" [formField]="signupForm.password" />
      </label>
    </form>
  `,
})
export class SignupComponent {
  signupModel = signal({
    username: '',
    password: '',
  });

  signupForm = form(this.signupModel, (schemaPath) => {
    required(schemaPath.username, {
      message: 'Please choose a username',
    });

    required(schemaPath.password, {
      message: 'Password cannot be empty',
    });
    minLength(schemaPath.password, 12, {
      message: 'Password must be at least 12 characters for security',
    });
  });
}
```

Mensagens personalizadas devem ser claras, específicas e dizer ao usuário como corrigir o problema. Em vez de "Entrada inválida", use "A senha deve ter pelo menos 12 caracteres por segurança".

### Várias mensagens de erro por campo {#multiple-errors-per-field}

Quando um campo tem várias regras de validação, cada regra é executada de forma independente e pode produzir um erro:

```ts
signupForm = form(this.signupModel, (schemaPath) => {
  required(schemaPath.email, {message: 'Email is required'});
  email(schemaPath.email, {message: 'Enter a valid email address'});
  minLength(schemaPath.email, 5, {message: 'Email is too short'});
});
```

Se o campo de e-mail estiver vazio, apenas o erro de `required()` aparece. Se o usuário digitar "a@b", os erros de `email()` e `minLength()` aparecem. Todas as regras de validação são executadas: a validação não para na primeira falha.

TIP: Use o padrão `touched() && invalid()` nos seus templates para evitar que erros apareçam antes de o usuário interagir com um campo. Para orientações completas sobre como exibir erros de validação, veja o [guia de Gerenciamento de estado do campo](guide/forms/signals/field-state-management#conditional-error-display).

## Regras de validação personalizadas {#custom-validation-rules}

Embora as regras de validação embutidas cubram os casos comuns, você frequentemente precisará de lógica de validação personalizada para regras de negócio, formatos complexos ou restrições específicas de domínio.

### Usando validate() {#using-validate}

A função `validate()` cria regras de validação personalizadas. Ela recebe uma função validadora que acessa o contexto do campo e retorna:

| Valor retornado       | Significado         |
| --------------------- | ------------------- |
| Objeto de erro        | O valor é inválido  |
| `null` ou `undefined` | O valor é válido    |

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, validate} from '@angular/forms/signals';

@Component({
  selector: 'app-url-form',
  imports: [FormField],
  template: `
    <form novalidate>
      <label>
        Website URL
        <input [formField]="urlForm.website" />
      </label>
    </form>
  `,
})
export class UrlFormComponent {
  urlModel = signal({website: ''});

  urlForm = form(this.urlModel, (schemaPath) => {
    validate(schemaPath.website, ({value}) => {
      if (!value().startsWith('https://')) {
        return {
          kind: 'https',
          message: 'URL must start with https://',
        };
      }

      return null;
    });
  });
}
```

A função validadora recebe um objeto `FieldContext` com:

| Propriedade     | Tipo       | Descrição                                                   |
| --------------- | ---------- | ----------------------------------------------------------- |
| `value`         | Signal     | Signal que contém o valor atual do campo                    |
| `state`         | FieldState | A referência ao estado do campo                             |
| `fieldTree`     | FieldTree  | A referência à árvore do campo                              |
| `valueOf()`     | Método     | Obtém o valor de outro campo pelo caminho                   |
| `stateOf()`     | Método     | Obtém o estado de outro campo pelo caminho                  |
| `fieldTreeOf()` | Método     | Obtém a árvore de campo de outro campo pelo caminho         |
| `pathKeys`      | Signal     | Chaves do caminho, da raiz até o campo atual                |

NOTE: Campos filhos também têm um signal `key`, e os campos de itens de array têm os signals `key` e `index`.

Retorne um objeto de erro com `kind` e `message` quando a validação falhar. Retorne `null` ou `undefined` quando a validação passar.

### Usando validateTree() {#using-validatetree}

A função `validateTree()` cria regras de validação personalizadas que podem atingir vários campos ou fornecer lógica de validação complexa para uma subárvore inteira.

```angular-ts
import {Component, model} from '@angular/core';
import {form, FormField, validateTree} from '@angular/forms/signals';

interface User {
  firstName: string;
  lastName: string;
}

@Component({/* ... */})
export class UserFormComponent {
  readonly userModel = model<User>({
    firstName: '',
    lastName: '',
  });

  userForm = form(this.userModel, (path) => {
    validateTree(path, (ctx) => {
      if (ctx.valueOf(path.firstName).length < 5) {
        return {
          kind: 'minLength5',
          message: 'First name must be at least 5 characters',
          fieldTree: ctx.fieldTree.lastName,
        };
      }

      return null;
    });
  });
}
```

A função validadora de `validateTree()` recebe o mesmo objeto `FieldContext` que `validate()`.

### Regras de validação reutilizáveis {#reusable-validation-rules}

Crie funções de regras de validação reutilizáveis encapsulando `validate()`:

```ts
function url(path: SchemaPath<string>, options?: {message?: string}) {
  validate(path, ({value}) => {
    try {
      new URL(value());
      return null;
    } catch {
      return {
        kind: 'url',
        message: options?.message || 'Enter a valid URL',
      };
    }
  });
}

function phoneNumber(path: SchemaPath<string>, options?: {message?: string}) {
  validate(path, ({value}) => {
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;

    if (!phoneRegex.test(value())) {
      return {
        kind: 'phoneNumber',
        message: options?.message || 'Phone must be in format: 555-123-4567',
      };
    }

    return null;
  });
}
```

Você pode usar regras de validação personalizadas da mesma forma que as regras embutidas:

```ts
urlForm = form(this.urlModel, (schemaPath) => {
  url(schemaPath.website, {message: 'Please enter a valid website URL'});
  phoneNumber(schemaPath.phone);
});
```

## Validação entre campos {#cross-field-validation}

A validação entre campos compara ou relaciona os valores de vários campos.

Um cenário comum de validação entre campos é a confirmação de senha:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, required, minLength, validate} from '@angular/forms/signals';

@Component({
  selector: 'app-password-change',
  imports: [FormField],
  template: `
    <form novalidate>
      <label>
        New Password
        <input type="password" [formField]="passwordForm.password" />
      </label>

      <label>
        Confirm Password
        <input type="password" [formField]="passwordForm.confirmPassword" />
      </label>

      <button type="submit">Change Password</button>
    </form>
  `,
})
export class PasswordChangeComponent {
  passwordModel = signal({
    password: '',
    confirmPassword: '',
  });

  passwordForm = form(this.passwordModel, (schemaPath) => {
    required(schemaPath.password, {message: 'Password is required'});
    minLength(schemaPath.password, 8, {message: 'Password must be at least 8 characters'});

    required(schemaPath.confirmPassword, {message: 'Please confirm your password'});

    validate(schemaPath.confirmPassword, ({value, valueOf}) => {
      const confirmPassword = value();
      const password = valueOf(schemaPath.password);

      if (confirmPassword !== password) {
        return {
          kind: 'passwordMismatch',
          message: 'Passwords do not match',
        };
      }

      return null;
    });
  });
}
```

A regra de validação de confirmação acessa o valor do campo de senha usando `valueOf(schemaPath.password)` e o compara com o valor de confirmação. Essa regra é executada de forma reativa: se qualquer uma das senhas mudar, a validação é executada novamente automaticamente.

## Validação condicional {#conditional-validation}

Às vezes, uma regra de validação deve se aplicar apenas em certas condições, como validar um endereço de entrega somente quando um pedido é enviado para o exterior, ou aplicar um conjunto diferente de regras a cada variante de um campo de tipo união.

Como as regras de validação ficam na função de schema, você as aplica condicionalmente com as mesmas funções estruturais que compõem schemas:

- Use [`applyWhen()`](guide/forms/signals/form-logic#conditional-logic-with-applywhen) para ativar um grupo de regras com base no estado reativo do formulário, incluindo os valores de outros campos.
- Use [`applyWhenValue()`](guide/forms/signals/schemas#type-narrowing-with-applywhenvalue) para aplicar regras com base no próprio valor de um campo. Quando o predicado é um type guard, as regras são tipadas para o valor restringido, o que torna esta a forma recomendada de validar uniões discriminadas e outros tipos de variantes.

Para exemplos completos, incluindo schemas reutilizáveis e uniões discriminadas, veja o [guia de Schemas e composabilidade de schemas](guide/forms/signals/schemas).

## Validação assíncrona {#async-validation}

A validação assíncrona lida com validações que exigem fontes de dados externas, como verificar a disponibilidade de um nome de usuário no servidor ou validar contra uma API.

### Usando validateHttp() {#using-validatehttp}

A função `validateHttp()` executa validação baseada em HTTP:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, required, validateHttp} from '@angular/forms/signals';

@Component({
  selector: 'app-username-form',
  imports: [FormField],
  template: `
    <form novalidate>
      <label>
        Username
        <input [formField]="usernameForm.username" />

        @if (usernameForm.username().pending()) {
          <span class="checking">Checking availability...</span>
        }
      </label>
    </form>
  `,
})
export class UsernameFormComponent {
  usernameModel = signal({username: ''});

  usernameForm = form(this.usernameModel, (schemaPath) => {
    required(schemaPath.username, {message: 'Username is required'});

    validateHttp(schemaPath.username, {
      request: ({value}) => `/api/check-username?username=${value()}`,
      onSuccess: (response: any) => {
        if (response.taken) {
          return {
            kind: 'usernameTaken',
            message: 'Username is already taken',
          };
        }
        return null;
      },
      onError: (error) => ({
        kind: 'networkError',
        message: 'Could not verify username availability',
      }),
    });
  });
}
```

A regra de validação `validateHttp()`:

1. Chama a URL ou a requisição retornada pela função `request`
2. Mapeia a resposta bem-sucedida para um erro de validação ou `null` usando `onSuccess`
3. Trata falhas da requisição (erros de rede, erros HTTP) usando `onError`
4. Define `pending()` como `true` enquanto a requisição está em andamento
5. Só é executada depois que todas as regras de validação síncronas passam

### Estado pendente {#pending-state}

Enquanto a validação assíncrona é executada, o signal `pending()` do campo retorna `true`. Use isso para mostrar indicadores de carregamento:

```angular-html
@if (form.username().pending()) {
  <span class="spinner">Checking...</span>
}
```

O signal `valid()` retorna `false` enquanto a validação está pendente, mesmo que ainda não haja erros. O signal `invalid()` só retorna `true` se existirem erros.

## Integração com bibliotecas de validação de schema {#integration-with-schema-validation-libraries}

O Signal Forms tem suporte embutido para bibliotecas compatíveis com o [Standard Schema](https://standardschema.dev/), como [Zod](https://zod.dev/) ou [Valibot](https://valibot.dev/). A integração é fornecida pela função `validateStandardSchema`. Isso permite usar schemas existentes mantendo os benefícios reativos de validação do Signal Forms.

```ts
import {form, validateStandardSchema} from '@angular/forms/signals';
import {signal} from '@angular/core';
import * as z from 'zod';

// Define your schema
const userSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

// Use with Signal Forms
const userForm = form(signal({email: '', password: ''}), (schemaPath) => {
  validateStandardSchema(schemaPath, userSchema);
});
```

### Schemas dinâmicos {#dynamic-schemas}

Você pode passar um signal em vez de um schema estático, para que o schema de validação seja atualizado automaticamente quando suas dependências mudarem.

```angular-ts
import {Component, computed, signal} from '@angular/core';
import {form, FormField, validateStandardSchema} from '@angular/forms/signals';
import z from 'zod';

@Component({/* ... */})
export class DynamicSchema {
  model = signal({document: '', type: 'dni'});

  // Schema reacts automatically to type changes
  schema = computed(() =>
    z.object({
      document:
        this.model().type === 'dni'
          ? z.string().length(8, 'DNI must be 8 digits')
          : z.string().min(12, 'Passport must be at least 12 characters'),
    }),
  );

  f = form(this.model, (p) => validateStandardSchema(p, () => this.schema()));
}
```

## Próximos passos {#next-steps}

Este guia tratou da criação e aplicação de regras de validação. Guias relacionados exploram outros aspectos do Signal Forms:

<docs-pill-row>
  <docs-pill href="guide/forms/signals/field-state-management" title="Gerenciamento de estado do campo" />
  <docs-pill href="guide/forms/signals/models" title="Modelos de formulário" />
  <docs-pill href="guide/forms/signals/form-logic" title="Adicionando lógica ao formulário" />
  <docs-pill href="guide/forms/signals/schemas" title="Schemas e composabilidade de schemas" />
</docs-pill-row>
