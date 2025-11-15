<!-- ia-translate: true -->
# Form models

Form models são a fundação de Signal Forms, servindo como a única fonte de verdade para os dados do seu formulário. Este guia explora como criar form models, atualizá-los e projetá-los para manutenibilidade.

NOTE: Form models são distintos do signal `model()` do Angular usado para two-way binding de components. Um form model é um signal gravável que armazena dados de formulário, enquanto `model()` cria inputs/outputs para comunicação entre components pai/filho.

## O que form models resolvem

Formulários requerem gerenciamento de dados que mudam ao longo do tempo. Sem uma estrutura clara, esses dados podem ficar dispersos por propriedades de components, tornando difícil rastrear mudanças, validar entrada ou enviar dados para um servidor.

Form models resolvem isso centralizando dados de formulário em um único signal gravável. Quando o model é atualizado, o formulário reflete automaticamente essas mudanças. Quando usuários interagem com o formulário, o model é atualizado adequadamente.

## Criando models

Um form model é um signal gravável criado com a função `signal()` do Angular. O signal contém um objeto que representa a estrutura de dados do seu formulário.

```ts
import { Component, signal } from '@angular/core'
import { form, Field } from '@angular/forms/signals'

@Component({
  selector: 'app-login',
  imports: [Field],
  template: `
    <input type="email" [field]="loginForm.email" />
    <input type="password" [field]="loginForm.password" />
  `
})
export class LoginComponent {
  loginModel = signal({
    email: '',
    password: ''
  })

  loginForm = form(this.loginModel)
}
```

A função `form()` aceita o model signal e cria uma **field tree** - uma estrutura de objeto especial que espelha a forma do seu model. A field tree é tanto navegável (acessa campos filhos com notação de ponto como `loginForm.email`) quanto chamável (chama um field como uma função para acessar seu estado).

A directive `[field]` vincula cada elemento input ao seu field correspondente na field tree, habilitando sincronização automática de duas vias entre a UI e o model.

### Usando tipos TypeScript

Embora o TypeScript infira tipos de literais de objeto, definir tipos explícitos melhora a qualidade do código e fornece melhor suporte IntelliSense.

```ts
interface LoginData {
  email: string
  password: string
}

export class LoginComponent {
  loginModel = signal<LoginData>({
    email: '',
    password: ''
  })

  loginForm = form(this.loginModel)
}
```

Com tipos explícitos, a field tree fornece type safety completo. Acessar `loginForm.email` é tipado como `FieldTree<string>`, e tentar acessar uma propriedade inexistente resulta em um erro em tempo de compilação.

```ts
// TypeScript knows this is FieldTree<string>
const emailField = loginForm.email

// TypeScript error: Property 'username' does not exist
const usernameField = loginForm.username
```

### Inicializando todos os fields

Form models devem fornecer valores iniciais para todos os fields que você deseja incluir na field tree.

```ts
// Good: All fields initialized
const userModel = signal({
  name: '',
  email: '',
  age: 0
})

// Avoid: Missing initial value
const userModel = signal({
  name: '',
  email: ''
  // age field is not defined - cannot access userForm.age
})
```

Para fields opcionais, defina-os explicitamente como `null` ou um valor vazio:

```ts
interface UserData {
  name: string
  email: string
  phoneNumber: string | null
}

const userModel = signal<UserData>({
  name: '',
  email: '',
  phoneNumber: null
})
```

Fields definidos como `undefined` são excluídos da field tree. Um model com `{value: undefined}` se comporta identicamente a `{}` - acessar o field retorna `undefined` ao invés de um `FieldTree`.

### Adição dinâmica de field

Você pode adicionar fields dinamicamente atualizando o model com novas propriedades. A field tree atualiza automaticamente para incluir novos fields quando eles aparecem no valor do model.

```ts
// Start with just email
const model = signal({ email: '' })
const myForm = form(model)

// Later, add a password field
model.update(current => ({ ...current, password: '' }))
// myForm.password is now available
```

Este padrão é útil quando fields se tornam relevantes baseado em escolhas do usuário ou dados carregados.

## Lendo valores do model

Você pode acessar valores de formulário de duas formas: diretamente do model signal, ou através de fields individuais. Cada abordagem serve a um propósito diferente.

### Lendo do model

Acesse o model signal quando você precisar dos dados completos do formulário, como durante o envio do formulário:

```ts
onSubmit() {
  const formData = this.loginModel();
  console.log(formData.email, formData.password);

  // Send to server
  await this.authService.login(formData);
}
```

O model signal retorna o objeto de dados inteiro, tornando-o ideal para operações que trabalham com o estado completo do formulário.

### Lendo do field state

Cada field na field tree é uma função. Chamar um field retorna um objeto `FieldState` contendo signals reativos para o valor do field, status de validação e estado de interação.

Acesse field state ao trabalhar com fields individuais em templates ou computações reativas:

```ts
@Component({
  template: `
    <p>Current email: {{ loginForm.email().value() }}</p>
    <p>Password length: {{ passwordLength() }}</p>
  `
})
export class LoginComponent {
  loginModel = signal({ email: '', password: '' })
  loginForm = form(this.loginModel)

  passwordLength = computed(() => {
    return this.loginForm.password().value().length
  })
}
```

Field state fornece signals reativos para o valor de cada field, tornando-o adequado para exibir informações específicas do field ou criar estado derivado.

TIP: Field state inclui muitos mais signals além de `value()`, como estado de validação (por exemplo, valid, invalid, errors), rastreamento de interação (por exemplo, touched, dirty), e visibilidade (por exemplo, hidden, disabled).

<!-- TODO: UNCOMMENT BELOW WHEN GUIDE IS AVAILABLE -->
<!-- See the [Field State Management guide](guide/forms/signal-forms/field-state-management) for complete coverage. -->

## Atualizando form models programaticamente

Form models atualizam através de mecanismos programáticos:

1. [Substituir o form model inteiro](#replacing-form-models-with-set) com `set()`
2. [Atualizar um ou mais fields](#update-one-or-more-fields-with-update) com `update()`
3. [Atualizar um único field diretamente](#update-a-single-field-directly-with-set) através de field state

### Substituindo form models com `set()`

Use `set()` no form model para substituir o valor inteiro:

```ts
loadUserData() {
  this.userModel.set({
    name: 'Alice',
    email: 'alice@example.com',
    age: 30,
  });
}

resetForm() {
  this.userModel.set({
    name: '',
    email: '',
    age: 0,
  });
}
```

Esta abordagem funciona bem ao carregar dados de uma API ou resetar o formulário inteiro.

### Atualizar um ou mais fields com `update()`

Use `update()` para modificar fields específicos enquanto preserva outros:

```ts
updateEmail(newEmail: string) {
  this.userModel.update(current => ({
    ...current,
    email: newEmail,
  }));
}
```

Este padrão é útil quando você precisa mudar um ou mais fields baseado no estado atual do model.

### Atualizar um único field diretamente com `set()`

Use `set()` em valores de field individuais para atualizar diretamente o field state:

```ts
clearEmail() {
  this.userForm.email().value.set('');
}

incrementAge() {
  const currentAge = this.userForm.age().value();
  this.userForm.age().value.set(currentAge + 1);
}
```

Estas também são conhecidas como "atualizações em nível de field". Elas propagam automaticamente para o model signal e mantêm ambos sincronizados.

### Exemplo: Carregando dados de uma API

Um padrão comum envolve buscar dados e popular o model:

```ts
export class UserProfileComponent {
  userModel = signal({
    name: '',
    email: '',
    bio: ''
  })

  userForm = form(this.userModel)
  private userService = inject(UserService)

  ngOnInit() {
    this.loadUserProfile()
  }

  async loadUserProfile() {
    const userData = await this.userService.getUserProfile()
    this.userModel.set(userData)
  }
}
```

Os fields do formulário atualizam automaticamente quando o model muda, exibindo os dados buscados sem código adicional.

## Two-way data binding

A directive `[field]` cria sincronização automática de duas vias entre o model, form state e UI.

### Como os dados fluem

Mudanças fluem bidirecionalmente:

**Input do usuário → Model:**

1. Usuário digita em um elemento input
2. A directive `[field]` detecta a mudança
3. Field state atualiza
4. Model signal atualiza

**Atualização programática → UI:**

1. Código atualiza o model com `set()` ou `update()`
2. Model signal notifica subscribers
3. Field state atualiza
4. A directive `[field]` atualiza o elemento input

Esta sincronização acontece automaticamente. Você não escreve subscrições ou event handlers para manter o model e a UI sincronizados.

### Exemplo: Ambas as direções

```ts
@Component({
  template: `
    <input type="text" [field]="userForm.name" />
    <button (click)="setName('Bob')">Set Name to Bob</button>
    <p>Current name: {{ userModel().name }}</p>
  `
})
export class UserComponent {
  userModel = signal({ name: '' })
  userForm = form(this.userModel)

  setName(name: string) {
    this.userModel.update(current => ({ ...current, name }))
    // Input automatically displays 'Bob'
  }
}
```

Quando o usuário digita no input, `userModel().name` atualiza. Quando o botão é clicado, o valor do input muda para "Bob". Nenhum código de sincronização manual é necessário.

## Padrões de estrutura de model

Form models podem ser objetos planos ou conter objetos e arrays aninhados. A estrutura que você escolhe afeta como você acessa fields e organiza validação.

### Models planos vs aninhados

Form models planos mantêm todos os fields no nível superior:

```ts
// Flat structure
const userModel = signal({
  name: '',
  email: '',
  street: '',
  city: '',
  state: '',
  zip: ''
})
```

Models aninhados agrupam fields relacionados:

```ts
// Nested structure
const userModel = signal({
  name: '',
  email: '',
  address: {
    street: '',
    city: '',
    state: '',
    zip: ''
  }
})
```

**Use estruturas planas quando:**

- Fields não têm agrupamentos conceituais claros
- Você quer acesso mais simples a fields (`userForm.city` vs `userForm.address.city`)
- Regras de validação abrangem múltiplos grupos potenciais

**Use estruturas aninhadas quando:**

- Fields formam um grupo conceitual claro (como um endereço)
- Os dados agrupados correspondem à estrutura da sua API
- Você quer validar o grupo como uma unidade

### Trabalhando com objetos aninhados

Você pode acessar fields aninhados seguindo o caminho do objeto:

```ts
const userModel = signal({
  profile: {
    firstName: '',
    lastName: ''
  },
  settings: {
    theme: 'light',
    notifications: true
  }
})

const userForm = form(userModel)

// Access nested fields
userForm.profile.firstName // FieldTree<string>
userForm.settings.theme // FieldTree<string>
```

Em templates, você vincula fields aninhados da mesma forma que fields de nível superior:

```ts
@Component({
  template: `
    <input [field]="userForm.profile.firstName" />
    <input [field]="userForm.profile.lastName" />

    <select [field]="userForm.settings.theme">
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  `,
})
```

### Trabalhando com arrays

Models podem incluir arrays para coleções de itens:

```ts
const orderModel = signal({
  customerName: '',
  items: [{ product: '', quantity: 0, price: 0 }]
})

const orderForm = form(orderModel)

// Access array items by index
orderForm.items[0].product // FieldTree<string>
orderForm.items[0].quantity // FieldTree<number>
```

Itens de array contendo objetos recebem automaticamente identidades de rastreamento, o que ajuda a manter o field state mesmo quando itens mudam de posição no array. Isso garante que o estado de validação e interações do usuário persistam corretamente quando arrays são reordenados.

<!-- TBD: For dynamic arrays and complex array operations, see the [Working with arrays guide](guide/forms/signal-forms/arrays). -->

## Boas práticas de design de model

Form models bem projetados tornam formulários mais fáceis de manter e estender. Siga esses padrões ao projetar seus models.

### Use tipos específicos

Sempre defina interfaces ou tipos para seus models como mostrado em [Usando tipos TypeScript](#using-typescript-types). Tipos explícitos fornecem melhor IntelliSense, capturam erros em tempo de compilação e servem como documentação para quais dados o formulário contém.

### Inicialize todos os fields

Forneça valores iniciais para cada field no seu model:

```ts
// Good: All fields initialized
const taskModel = signal({
  title: '',
  description: '',
  priority: 'medium',
  completed: false
})
```

```ts
// Avoid: Partial initialization
const taskModel = signal({
  title: ''
  // Missing description, priority, completed
})
```

Valores iniciais faltantes significam que esses fields não existirão na field tree, tornando-os inacessíveis para interações de formulário.

### Mantenha models focados

Cada model deve representar um único formulário ou um conjunto coeso de dados relacionados:

```ts
// Good: Focused on login
const loginModel = signal({
  email: '',
  password: ''
})
```

```ts
// Avoid: Mixing unrelated concerns
const appModel = signal({
  // Login data
  email: '',
  password: '',
  // User preferences
  theme: 'light',
  language: 'en',
  // Shopping cart
  cartItems: []
})
```

Models separados para diferentes preocupações tornam formulários mais fáceis de entender e reutilizar. Crie múltiplos formulários se você estiver gerenciando conjuntos distintos de dados.

### Considere requisitos de validação

Projete models com validação em mente. Agrupe fields que validam juntos:

```ts
// Good: Password fields grouped for comparison
interface PasswordChangeData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}
```

Esta estrutura torna a validação entre fields (como verificar se `newPassword` corresponde a `confirmPassword`) mais natural.

### Planeje para o estado inicial

Considere se seu formulário começa vazio ou pré-populado:

```ts
// Form that starts empty (new user)
const newUserModel = signal({
  name: '',
  email: '',
});

// Form that loads existing data
const editUserModel = signal({
  name: '',
  email: '',
});

// Later, in ngOnInit:
ngOnInit() {
  this.loadExistingUser();
}

async loadExistingUser() {
  const user = await this.userService.getUser(this.userId);
  this.editUserModel.set(user);
}
```

Para formulários que sempre começam com dados existentes, você pode esperar para renderizar o formulário até que os dados sejam carregados para evitar um flash de fields vazios.

<!-- TODO: UNCOMMENT WHEN THE GUIDES ARE AVAILABLE -->
<!-- ## Next steps

<docs-pill-row>
  <docs-pill href="guide/forms/signal-forms/field-state-management" title="Field State Management" />
  <docs-pill href="guide/forms/signal-forms/validation" title="Validation" />
  <docs-pill href="guide/forms/signal-forms/arrays" title="Working with Arrays" />
</docs-pill-row> -->
