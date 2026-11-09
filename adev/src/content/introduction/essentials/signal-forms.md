<!-- ia-translate: true -->
<docs-decorative-header title="Forms com signals" imgSrc="adev/src/assets/images/signals.svg"> </docs-decorative-header>

Signal Forms gerencia o estado dos formulários usando signals do Angular para fornecer sincronização automática entre o seu modelo de dados e a UI com Angular Signals.

Este guia apresenta os conceitos principais para criar formulários com Signal Forms. Veja como funciona:

## Criando seu primeiro formulário {#creating-your-first-form}

### 1. Crie um modelo de formulário com `signal()` {#1-create-a-form-model-with-signal}

Todo formulário começa criando um signal que armazena o modelo de dados do formulário:

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

### 2. Passe o modelo de formulário para `form()` para criar um `FieldTree` {#2-pass-the-form-model-to-form-to-create-a-fieldtree}

Em seguida, você passa o modelo de formulário para a função `form()` para criar uma **field tree**, uma estrutura de objeto que espelha o formato do seu modelo e permite acessar os campos com notação de ponto:

Tanto o objeto raiz do formulário quanto as suas propriedades aninhadas são nós `FieldTree`:

```ts
const loginForm = form(loginModel);

loginForm; // é um FieldTree
loginForm.email; // também é um FieldTree
```

### 3. Vincule inputs HTML com a directive `[formField]` {#3-bind-html-inputs-with-formfield-directive}

Em seguida, você vincula os inputs HTML ao formulário usando a directive `[formField]`, que cria um binding bidirecional entre eles:

```html
<input type="email" [formField]="loginForm.email" />
<input type="password" [formField]="loginForm.password" />
```

Como resultado, as mudanças do usuário (como digitar no campo) atualizam o formulário automaticamente.

NOTE: A directive `[formField]` também sincroniza o estado do campo para atributos como `required`, `disabled` e `readonly`, quando apropriado.

### 4. Leia o estado com signals do `FieldTree` {#4-read-state-with-fieldtree-signals}

Você pode acessar o estado de qualquer parte da árvore chamando o nó `FieldTree` como uma função. Isso retorna um objeto de estado contendo signals reativos para o valor, o status de validação e o estado de interação:

```ts
loginForm(); // Returns state for the whole form
loginForm.email(); // Returns state for the email field
```

Para ler o valor atual, acesse o signal `value()`:

```html
<!-- Renderiza valores que são atualizados automaticamente conforme o usuário digita -->
<p>Form value: {{ loginForm().value() | json }}</p>
<p>Email: {{ loginForm.email().value() }}</p>
```

```ts
// Obtém o valor atual
const currentEmail = loginForm.email().value();
```

### 5. Atualize valores com `set()` {#5-update-values-with-set}

Você pode atualizar valores programaticamente usando o método `value.set()` em qualquer nó. Isso atualiza tanto o `FieldTree` quanto o signal do modelo subjacente:

```ts
// Atualiza o valor programaticamente
loginForm.email().value.set('alice@wonderland.com');
```

Como resultado, tanto o valor do campo quanto o signal do modelo são atualizados automaticamente:

```ts
// O signal do modelo também é atualizado
console.log(loginModel().email); // 'alice@wonderland.com'
```

### Exemplo completo {#complete-example}

<docs-code-multifile preview path="adev/src/content/examples/signal-forms/src/login-simple/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/signal-forms/src/login-simple/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/signal-forms/src/login-simple/app/app.html"/>
  <docs-code header="app.css" path="adev/src/content/examples/signal-forms/src/login-simple/app/app.css"/>
</docs-code-multifile>

## Uso básico {#basic-usage}

A directive `[formField]` funciona com todos os tipos padrão de input HTML. Aqui estão os padrões mais comuns:

### Inputs de texto {#text-inputs}

Inputs de texto funcionam com vários atributos `type` e também com textareas:

```html
<!-- Text and email -->
<input type="text" [formField]="form.name" />
<input type="email" [formField]="form.email" />
```

#### Números {#numbers}

Inputs numéricos convertem automaticamente entre strings e números:

```html
<!-- Number - automatically converts to number type -->
<input type="number" [formField]="form.age" />
```

#### Data e hora {#date-and-time}

Inputs de data armazenam valores como strings `YYYY-MM-DD`, e inputs de hora usam o formato `HH:mm`:

```html
<!-- Date and time - stores as ISO format strings -->
<input type="date" [formField]="form.eventDate" />
<input type="time" [formField]="form.eventTime" />
```

Se você precisar converter strings de data em objetos Date, pode fazer isso passando o valor do campo para `Date()`:

```ts
const dateObject = new Date(form.eventDate().value());
```

#### Texto multilinha {#multiline-text}

Textareas funcionam da mesma forma que os inputs de texto:

```html
<!-- Textarea -->
<textarea [formField]="form.message" rows="4"></textarea>
```

### Checkboxes

Checkboxes são vinculadas a valores booleanos:

```html
<!-- Single checkbox -->
<label>
  <input type="checkbox" [formField]="form.agreeToTerms" />
  I agree to the terms
</label>
```

#### Múltiplas checkboxes {#multiple-checkboxes}

Para múltiplas opções, crie um `formField` booleano separado para cada uma:

```html
<label>
  <input type="checkbox" [formField]="form.emailNotifications" />
  Email notifications
</label>
<label>
  <input type="checkbox" [formField]="form.smsNotifications" />
  SMS notifications
</label>
```

### Radio buttons

Radio buttons funcionam de forma semelhante às checkboxes. Desde que os radio buttons usem o mesmo valor de `[formField]`, o Signal Forms vincula automaticamente o mesmo atributo `name` a todos eles:

```html
<label>
  <input type="radio" value="free" [formField]="form.plan" />
  Free
</label>
<label>
  <input type="radio" value="premium" [formField]="form.plan" />
  Premium
</label>
```

Quando um usuário seleciona um radio button, o `formField` do formulário armazena o valor do atributo `value` desse radio button. Por exemplo, selecionar "Premium" define `form.plan().value()` como `"premium"`.

### Listas suspensas (select) {#select-dropdowns}

Elementos select funcionam com opções estáticas e dinâmicas:

```angular-html
<!-- Static options -->
<select [formField]="form.country">
  <option value="">Select a country</option>
  <option value="us">United States</option>
  <option value="ca">Canada</option>
</select>

<!-- Dynamic options with @for -->
<select [formField]="form.productId">
  <option value="">Select a product</option>
  @for (product of products; track product.id) {
    <option [value]="product.id">{{ product.name }}</option>
  }
</select>
```

NOTE: Select múltiplo (`<select multiple>`) não é suportado pela directive `[formField]` no momento.

## Validação e estado {#validation-and-state}

O Signal Forms fornece validators integrados que você pode aplicar aos campos do formulário. Para adicionar validação, passe uma função de schema como segundo argumento para `form()`:

```ts
const loginForm = form(loginModel, (schemaPath) => {
  debounce(schemaPath.email, 500);
  required(schemaPath.email);
  email(schemaPath.email);
});
```

A função de schema recebe um parâmetro **schema path**, que fornece caminhos para os seus campos para configurar as regras de validação.

Validators comuns incluem:

- **`required()`** - Garante que o campo tenha um valor
- **`email()`** - Valida o formato do email
- **`min()`** / **`max()`** - Valida intervalos de números
- **`minLength()`** / **`maxLength()`** - Valida o tamanho de strings ou coleções
- **`pattern()`** - Valida contra um padrão de regex

Você também pode personalizar as mensagens de erro passando um objeto de opções como segundo argumento do validator:

```ts
required(schemaPath.email, {message: 'Email is required'});
email(schemaPath.email, {message: 'Please enter a valid email address'});
```

Cada nó do `FieldTree` expõe seu estado de validação e de interação por meio de signals reativos.

### Signals de estado do FieldTree {#fieldtree-state-signals}

Todo nó da árvore, incluindo o objeto raiz do formulário, fornece os mesmos signals para acompanhar o seu estado. Como todo nó é um `FieldTree`, a API para monitorar validade e interação é idêntica em todos os níveis.

| Estado       | Descrição                                                                             |
| ------------ | ------------------------------------------------------------------------------------- |
| `valid()`    | Retorna `true` se o nó passa em todas as regras de validação                          |
| `invalid()`  | Retorna `true` se há erros de validação                                               |
| `pending()`  | Retorna `true` se a validação assíncrona está em andamento                            |
| `touched()`  | Retorna `true` se o usuário focou e desfocou o campo ou qualquer campo filho          |
| `dirty()`    | Retorna `true` se o valor foi alterado pelo usuário                                   |
| `disabled()` | Retorna `true` se o nó está desabilitado                                              |
| `readonly()` | Retorna `true` se o nó é somente leitura                                              |
| `errors()`   | Retorna um array de erros de validação com as propriedades `kind` e `message`         |

### Exemplo completo {#complete-example-validation}

<docs-code-multifile preview path="adev/src/content/examples/signal-forms/src/login-validation/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/signal-forms/src/login-validation/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/signal-forms/src/login-validation/app/app.html"/>
  <docs-code header="app.css" path="adev/src/content/examples/signal-forms/src/login-validation/app/app.css"/>
</docs-code-multifile>

## Próximos passos {#next-steps}

Para saber mais sobre o Signal Forms e como ele funciona, confira os guias detalhados:

- [Visão geral](guide/forms/signals/overview) - Introdução ao Signal Forms e quando usá-lo
- [Modelos de formulário](guide/forms/signals/models) - Criação e gerenciamento de dados de formulário com signals
- [Gerenciamento de estado dos campos](guide/forms/signals/field-state-management) - Trabalhando com estado de validação, rastreamento de interação e visibilidade de campos
- [Validação](guide/forms/signals/validation) - Validators integrados, regras de validação personalizadas e validação assíncrona

<docs-pill-row>
  <docs-pill title="Design modular com injeção de dependência" href="essentials/dependency-injection" />
</docs-pill-row>
