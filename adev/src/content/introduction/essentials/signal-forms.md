<!-- ia-translate: true -->
<docs-decorative-header title="Forms with signals" imgSrc="adev/src/assets/images/signals.svg"> <!-- markdownlint-disable-line -->
Signal Forms é construído em cima dos signals do Angular para fornecer uma maneira reativa e type-safe de gerenciar o estado de formulários.
</docs-decorative-header>

Signal Forms gerencia o estado de formulários usando signals do Angular para fornecer sincronização automática entre seu modelo de dados e a UI.

Este guia apresenta os conceitos principais para criar formulários com Signal Forms. Veja como funciona:

## Criando seu primeiro formulário

### 1. Crie um modelo de formulário

Todo formulário começa criando um signal que armazena o modelo de dados do seu formulário:

```ts
interface LoginData {
  email: string;
  password: string;
}

const loginModel = signal<LoginData>({
  email: '',
  password: '',
});
```

### 2. Passe o modelo de formulário para `form()`

Em seguida, você passa seu modelo de formulário para a função `form()` para criar uma **field tree** - uma estrutura de objeto que espelha a forma do seu modelo, permitindo que você acesse campos com notação de ponto:

```ts
form(loginModel);

// Access fields directly by property name
loginForm.email
loginForm.password
```

### 3. Vincule inputs com a directive `[field]`

Em seguida, você vincula seus inputs HTML ao formulário usando a directive `[field]`, que cria um binding bidirecional entre eles:

```html
<input type="email" [field]="loginForm.email" />
<input type="password" [field]="loginForm.password" />
```

Como resultado, mudanças do usuário (como digitar no campo) atualizam automaticamente o formulário, e quaisquer mudanças programáticas também atualizam o valor exibido:

```ts
// Update the value programmatically
loginForm.email().value.set('alice@wonderland.com');

// The model signal is also updated
console.log(loginModel().email); // 'alice@wonderland.com'
```

NOTA: A directive `[field]` também sincroniza o estado do campo para atributos como `required`, `disabled` e `readonly` quando apropriado.

### 4. Leia valores de campos do formulário com `value()`

Você pode acessar o estado do campo chamando o campo como uma função. Isso retorna um objeto `FieldState` contendo signals reativos para o valor do campo, status de validação e estado de interação:

```ts
loginForm.email() // Returns FieldState with value(), valid(), touched(), etc.
```

Para ler o valor atual do campo, acesse o signal `value()`:

```html
<!-- Render form value that updates automatically as user types -->
<p>Email: {{ loginForm.email().value() }}</p>
```

```ts
// Get the current value
const currentEmail = loginForm.email().value();
```

Aqui está um exemplo completo:

<docs-code-multifile preview path="adev/src/content/examples/signal-forms/src/login-simple/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/signal-forms/src/login-simple/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/signal-forms/src/login-simple/app/app.html"/>
  <docs-code header="app.css" path="adev/src/content/examples/signal-forms/src/login-simple/app/app.css"/>
</docs-code-multifile>

## Uso básico

A directive `[field]` funciona com todos os tipos de input HTML padrão. Aqui estão os padrões mais comuns:

### Inputs de texto

Inputs de texto funcionam com vários atributos `type` e textareas:

```html
<!-- Text and email -->
<input type="text" [field]="form.name" />
<input type="email" [field]="form.email" />
```

#### Números

Inputs de número convertem automaticamente entre strings e números:

```html
<!-- Number - automatically converts to number type -->
<input type="number" [field]="form.age" />
```

#### Data e hora

Inputs de data armazenam valores como strings `YYYY-MM-DD`, e inputs de hora usam o formato `HH:mm`:

```html
<!-- Date and time - stores as ISO format strings -->
<input type="date" [field]="form.eventDate" />
<input type="time" [field]="form.eventTime" />
```

Se você precisar converter strings de data para objetos Date, você pode fazer isso passando o valor do campo para `Date()`:

```ts
const dateObject = new Date(form.eventDate().value());
```

#### Texto multilinha

Textareas funcionam da mesma forma que inputs de texto:

```html
<!-- Textarea -->
<textarea [field]="form.message" rows="4"></textarea>
```

### Checkboxes

Checkboxes vinculam a valores booleanos:

```html
<!-- Single checkbox -->
<label>
  <input type="checkbox" [field]="form.agreeToTerms" />
  I agree to the terms
</label>
```

#### Múltiplas checkboxes

Para múltiplas opções, crie um `field` booleano separado para cada:

```html
<label>
  <input type="checkbox" [field]="form.emailNotifications" />
  Email notifications
</label>
<label>
  <input type="checkbox" [field]="form.smsNotifications" />
  SMS notifications
</label>
```

### Radio buttons

Radio buttons funcionam de forma similar a checkboxes. Desde que os radio buttons usem o mesmo valor `[field]`, Signal Forms automaticamente vinculará o mesmo atributo `name` a todos eles:

```html
<label>
  <input type="radio" value="free" [field]="form.plan" />
  Free
</label>
<label>
  <input type="radio" value="premium" [field]="form.plan" />
  Premium
</label>
```

Quando um usuário seleciona um radio button, o `field` do formulário armazena o valor do atributo `value` daquele radio button. Por exemplo, selecionar "Premium" define `form.plan().value()` como `"premium"`.

### Select dropdowns

Elementos select funcionam com opções estáticas e dinâmicas:

```html
<!-- Static options -->
<select [field]="form.country">
  <option value="">Select a country</option>
  <option value="us">United States</option>
  <option value="ca">Canada</option>
</select>

<!-- Dynamic options with @for -->
<select [field]="form.productId">
  <option value="">Select a product</option>
  @for (product of products; track product.id) {
    <option [value]="product.id">{{ product.name }}</option>
  }
</select>
```

NOTA: Select múltiplo (`<select multiple>`) não é suportado pela directive `[field]` neste momento.

## Validação e estado

Signal Forms fornece validators integrados que você pode aplicar aos campos do seu formulário. Para adicionar validação, passe uma função schema como segundo argumento para `form()`. Esta função recebe um parâmetro **FieldPath** que permite referenciar os campos no modelo do seu formulário:

```ts
const loginForm = form(loginModel, (fieldPath) => {
  required(fieldPath.email);
  email(fieldPath.email);
});
```

NOTA: FieldPath apenas espelha a forma dos seus dados e não permite acessar value ou qualquer outro estado.

Validators comuns incluem:

- **`required()`** - Garante que o campo tenha um valor
- **`email()`** - Valida o formato de email
- **`min()`** / **`max()`** - Valida intervalos de números
- **`minLength()`** / **`maxLength()`** - Valida o comprimento de string ou coleção
- **`pattern()`** - Valida contra um padrão regex

Você também pode personalizar mensagens de erro passando um objeto de opções como segundo argumento para o validator:

```ts
required(p.email, { message: 'Email is required' });
email(p.email, { message: 'Please enter a valid email address' });
```

Cada campo do formulário expõe seu estado de validação através de signals. Por exemplo, você pode verificar `field().valid()` para ver se a validação passa, `field().touched()` para ver se o usuário interagiu com ele, e `field().errors()` para obter a lista de erros de validação.

Aqui está um exemplo completo:

<docs-code-multifile preview path="adev/src/content/examples/signal-forms/src/login-validation/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/signal-forms/src/login-validation/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/signal-forms/src/login-validation/app/app.html"/>
  <docs-code header="app.css" path="adev/src/content/examples/signal-forms/src/login-validation/app/app.css"/>
</docs-code-multifile>

### Field State Signals

Cada `field()` fornece estes signals de estado:

| Estado       | Descrição                                                                         |
| ------------ | --------------------------------------------------------------------------------- |
| `valid()`    | Retorna `true` se o campo passa em todas as regras de validação                   |
| `touched()`  | Retorna `true` se o usuário focou e desfocou o campo                              |
| `dirty()`    | Retorna `true` se o usuário mudou o valor                                         |
| `disabled()` | Retorna `true` se o campo está desabilitado                                       |
| `pending()`  | Retorna `true` se a validação assíncrona está em progresso                        |
| `errors()`   | Retorna um array de erros de validação com propriedades `kind` e `message`        |

DICA: Mostre erros apenas após `field().touched()` ser verdadeiro para evitar exibir mensagens de validação antes que o usuário tenha interagido com um campo.
