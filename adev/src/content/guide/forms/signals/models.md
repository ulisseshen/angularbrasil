<!-- ia-translate: true -->

# Form models

Form models são a fundação de Signal Forms, servindo como a única fonte de verdade para os dados do seu formulário. Este guia explora como criar form models, atualizá-los e projetá-los para manutenibilidade.

NOTE: Form models são distintos do `model()` signal do Angular usado para two-way binding de components. Um form model é um signal gravável que armazena dados de formulário, enquanto `model()` cria inputs/outputs para comunicação entre components pai/filho.

## O que form models resolvem {#what-form-models-solve}

Formulários requerem gerenciamento de dados que mudam ao longo do tempo. Sem uma estrutura clara, esses dados podem ficar espalhados por propriedades de components, tornando difícil rastrear mudanças, validar entradas ou enviar dados para um servidor.

Form models resolvem isso centralizando os dados do formulário em um único signal gravável. Quando o model é atualizado, o formulário reflete essas mudanças automaticamente. Quando os usuários interagem com o formulário, o model é atualizado de acordo.

## Criando models {#creating-models}

Um form model é um signal gravável criado com a função `signal()` do Angular. O signal contém um objeto que representa a estrutura de dados do seu formulário.

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField} from '@angular/forms/signals';

@Component({
  selector: 'app-login',
  imports: [FormField],
  template: `
    <input type="email" [formField]="loginForm.email" />
    <input type="password" [formField]="loginForm.password" />
  `,
})
export class LoginComponent {
  loginModel = signal({
    email: '',
    password: '',
  });

  loginForm = form(this.loginModel);
}
```

A função [`form()`](api/forms/signals/form) aceita o model signal e cria uma **field tree**, uma estrutura de objeto especial que espelha o formato do seu model. A field tree é ao mesmo tempo navegável (você acessa os fields filhos com notação de ponto, como `loginForm.email`) e chamável (você chama um field como função para acessar o state dele).

A directive `[formField]` vincula cada elemento de input ao field correspondente na field tree, habilitando sincronização bidirecional automática entre a UI e o model.

### Estruturas de model suportadas {#supported-model-structures}

Signal Forms constrói a field tree percorrendo o seu model. Os objetos e arrays que ele percorre (a **camada estrutural**) devem ser objetos e arrays JavaScript simples. Os valores nas **folhas** (posições sem fields aninhados) costumam ser primitivos (strings, números, booleanos) ou `null`. Os inputs nativos `date`, `month`, `time` e `week` também aceitam `Date`, e custom controls podem aceitar qualquer tipo de valor que eles entendam.

```ts {prefer, header: 'Plain structure'}
interface UserFormModel {
  name: string;
  birthday: Date | null;
  preferences: {
    theme: string;
    notifications: boolean;
  };
  tags: string[];
}

const userModel = signal<UserFormModel>({
  name: '',
  birthday: null,
  preferences: {
    theme: 'dark',
    notifications: true,
  },
  tags: [],
});
```

IMPORTANTE: Instâncias de classe, `Map` e `Set` **não são suportados na camada estrutural**, mesmo que o TypeScript os aceite. Signal Forms não valida o formato do model em tempo de execução, então o framework aceita esses valores sem lançar erro e produz comportamentos incorretos de formas diferentes, dependendo do formato:

- **Instâncias de classe** perdem seu prototype na primeira escrita, porque Signal Forms faz uma cópia rasa dos objetos pai durante a atualização. Métodos, getters e verificações com `instanceof` deixam de funcionar depois disso.
- **Objetos não extensíveis ou congelados dentro de arrays** lançam erro quando Signal Forms atribui um símbolo de rastreamento para preservar a identidade dos itens durante reordenações.
- **`Map` e `Set`** produzem field trees vazias, porque Signal Forms enumera os filhos com `Object.keys`.

Se a sua aplicação usa classes para modelagem de domínio, converta para objetos simples na fronteira do formulário. Veja [Traduzindo entre o model do formulário e o model de domínio](guide/forms/signals/model-design#translating-between-form-model-and-domain-model).

### Usando tipos TypeScript {#using-typescript-types}

Embora o TypeScript infira tipos a partir de object literals, definir tipos explícitos melhora a qualidade do código e oferece melhor suporte de IntelliSense.

```ts
interface LoginData {
  email: string;
  password: string;
}

export class LoginComponent {
  loginModel = signal<LoginData>({
    email: '',
    password: '',
  });

  loginForm = form(this.loginModel);
}
```

Com tipos explícitos, a field tree oferece type safety completo. Acessar `loginForm.email` é tipado como `FieldTree<string>`, e tentar acessar uma propriedade inexistente resulta em erro de compilação.

```ts
// O TypeScript sabe que isto é FieldTree<string>
const emailField = loginForm.email;

// Erro do TypeScript: a propriedade 'username' não existe
const usernameField = loginForm.username;
```

### Inicializando todos os fields {#initializing-all-fields}

Form models devem fornecer valores iniciais para todos os fields que você quer incluir na field tree.

```ts {prefer}
// Bom: todos os fields inicializados
const userModel = signal({
  name: '',
  email: '',
  age: 0,
});
```

```ts {avoid}
// Evite: valor inicial ausente
const userModel = signal({
  name: '',
  email: '',
  // o field age não está definido: não é possível acessar userForm.age
});
```

Para fields opcionais, defina-os explicitamente como um valor vazio ou `null`:

```ts
interface UserData {
  name: string;
  email: string;
  phoneNumber: string | null;
}

const userModel = signal<UserData>({
  name: '',
  email: '',
  phoneNumber: null,
});
```

HELPFUL: Controles de texto nativos como `<input type=text>` e `<textarea>` não suportam `null`; use `''` para representar um valor vazio.

Fields definidos como `undefined` são excluídos da field tree. Um model com `{value: undefined}` se comporta de forma idêntica a `{}`: acessar o field retorna `undefined` em vez de um `FieldTree`.

## Lendo valores do model {#reading-model-values}

Você pode acessar os valores do formulário de duas formas: diretamente do model signal ou por meio de fields individuais. Cada abordagem serve a um propósito diferente.

### Lendo do model {#reading-from-the-model}

Acesse o model signal quando precisar dos dados completos do formulário, como no envio do formulário:

```ts
async onSubmit() {
  const formData = this.loginModel();
  console.log(formData.email, formData.password);

  // Envia para o servidor
  await this.authService.login(formData);
}
```

O model signal retorna o objeto de dados inteiro, o que o torna ideal para operações que trabalham com o state completo do formulário.

### Lendo do field state {#reading-from-field-state}

Cada field na field tree é uma função. Chamar um field retorna um objeto `FieldState` que contém signals reativos para o valor do field, o status de validação e o state de interação.

Acesse o field state ao trabalhar com fields individuais em templates ou computações reativas:

```angular-ts
@Component({
  template: `
    <p>Current email: {{ loginForm.email().value() }}</p>
    <p>Password length: {{ passwordLength() }}</p>
  `,
})
export class LoginComponent {
  loginModel = signal({email: '', password: ''});
  loginForm = form(this.loginModel);

  passwordLength = computed(() => {
    return this.loginForm.password().value().length;
  });
}
```

O field state fornece signals reativos para o valor de cada field, o que o torna adequado para exibir informações específicas de um field ou criar state derivado.

TIP: O field state inclui muitos outros signals além de `value()`, como validação (por exemplo, valid, invalid, errors), rastreamento de interação (por exemplo, touched, dirty) e visibilidade (por exemplo, hidden, disabled).

Veja o [guia de Gerenciamento de field state](guide/forms/signals/field-state-management) para a cobertura completa.

## Atualizando form models programaticamente {#updating-form-models-programmatically}

### Substituindo form models com `set()` {#replacing-form-models-with-set}

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

Essa abordagem funciona bem ao carregar dados de uma API ou ao resetar o formulário inteiro.

### Atualizar um único field diretamente com `set()` ou `update()` {#update-a-single-field-directly-with-set-or-update}

Use `set()` nos valores de fields individuais para atualizar diretamente o field state:

```ts
clearEmail() {
  this.userForm.email().value.set('');
}

incrementAge() {
  this.userForm.age().value.update(currentAge => currentAge + 1);
}
```

Elas também são conhecidas como "atualizações em nível de field". Elas se propagam automaticamente para o model signal e mantêm os dois sincronizados.

### Exemplo: carregando dados de uma API {#example-loading-data-from-an-api}

Um padrão comum envolve buscar dados e preencher o model:

```ts
export class UserProfileComponent {
  userModel = signal({
    name: '',
    email: '',
    bio: '',
  });

  userForm = form(this.userModel);
  private userService = inject(UserService);

  ngOnInit() {
    this.loadUserProfile();
  }

  async loadUserProfile() {
    const userData = await this.userService.getUserProfile();
    this.userModel.set(userData);
  }
}
```

Os fields do formulário são atualizados automaticamente quando o model muda, exibindo os dados buscados sem código adicional.

### Exemplo: sincronizando com um service {#example-synchronizing-to-a-service}

Em alguns casos, um service pode armazenar um form model:

```ts
@Service()
export class FormService {
  private readonly formModel = signal<UserFormModel>({ name: '', birthday: null });
  public readonly model = this.formModel.asReadonly();

  public syncFormModel(value: UserFormModel) {
    this.formModel.set(value);
  }

  // O model é definido de forma síncrona ou assíncrona em outro ponto do service
}

@Component(...)
export class UserForm {
  private readonly formService = inject(FormService);

  private readonly formModel = linkedSignal(() => this.formService.model(), {
    set: (value) => this.formService.syncFormModel(value),
  });

  protected readonly form = form(this.formModel);
}
```

A função de computação do `linkedSignal` lê o form model do service, e a função `set` nas opções permite sincronizar o form model do component com o form model do service. Os fields do formulário são atualizados automaticamente quando o model do service muda, e também atualizam automaticamente o form model do service quando os fields modificam o form model do component.

## Two-way data binding

A directive `[formField]` cria sincronização bidirecional automática entre o model, o form state e a UI.

### Como os dados fluem {#how-data-flows}

As mudanças fluem nas duas direções:

**Input do usuário → Model:**

1. O usuário digita em um elemento de input
2. A directive `[formField]` detecta a mudança
3. O field state é atualizado
4. O model signal é atualizado

**Atualização programática → UI:**

1. O código atualiza o model com `set()` ou `update()`
2. O model signal notifica os subscribers
3. O field state é atualizado
4. A directive `[formField]` atualiza o elemento de input

Essa sincronização acontece automaticamente. Você não precisa escrever subscriptions ou event handlers para manter o model e a UI sincronizados.

### Exemplo: nas duas direções {#example-both-directions}

```angular-ts
@Component({
  template: `
    <input type="text" [formField]="userForm.name" />
    <button (click)="setName('Bob')">Set Name to Bob</button>
    <p>Current name: {{ userModel().name }}</p>
  `,
})
export class UserComponent {
  userModel = signal({name: ''});
  userForm = form(this.userModel);

  setName(name: string) {
    this.userForm.name().value.set(name);
    // O input passa a exibir 'Bob' automaticamente
  }
}
```

Quando o usuário digita no input, `userModel().name` é atualizado. Quando o botão é clicado, o valor do input muda para "Bob". Nenhum código de sincronização manual é necessário.

## Padrões de estrutura de model {#model-structure-patterns}

Form models podem ser objetos planos ou conter objetos e arrays aninhados. A estrutura que você escolhe afeta como você acessa os fields e organiza a validação.

### Models planos vs aninhados {#flat-vs-nested-models}

Form models planos mantêm todos os fields no nível superior:

```ts
// Estrutura plana
const userModel = signal({
  name: '',
  email: '',
  street: '',
  city: '',
  state: '',
  zip: '',
});
```

Models aninhados agrupam fields relacionados:

```ts
// Estrutura aninhada
const userModel = signal({
  name: '',
  email: '',
  address: {
    street: '',
    city: '',
    state: '',
    zip: '',
  },
});
```

**Use estruturas planas quando:**

- Os fields não têm agrupamentos conceituais claros
- Você quer um acesso mais simples aos fields (`userForm.city` em vez de `userForm.address.city`)
- As regras de validação abrangem múltiplos grupos potenciais

**Use estruturas aninhadas quando:**

- Os fields formam um grupo conceitual claro (como um endereço)
- Os dados agrupados correspondem à estrutura da sua API
- Você quer validar o grupo como uma unidade

### Trabalhando com objetos aninhados {#working-with-nested-objects}

Você pode acessar fields aninhados seguindo o caminho do objeto:

```ts
const userModel = signal({
  profile: {
    firstName: '',
    lastName: '',
  },
  settings: {
    theme: 'light',
    notifications: true,
  },
});

const userForm = form(userModel);

// Acessando fields aninhados
userForm.profile.firstName; // FieldTree<string>
userForm.settings.theme; // FieldTree<string>
```

Em templates, você vincula fields aninhados da mesma forma que fields de nível superior:

```angular-ts
@Component({
  template: `
    <input [formField]="userForm.profile.firstName" />
    <input [formField]="userForm.profile.lastName" />

    <select [formField]="userForm.settings.theme">
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  `,
})
```

### Trabalhando com arrays {#working-with-arrays}

Models podem incluir arrays para coleções de itens:

```ts
const orderModel = signal({
  customerName: '',
  items: [{product: '', quantity: 0, price: 0}],
});

const orderForm = form(orderModel);

// Acessando itens do array pelo índice
orderForm.items[0].product; // FieldTree<string>
orderForm.items[0].quantity; // FieldTree<number>
```

Itens de array que contêm objetos recebem automaticamente identidades de rastreamento, o que ajuda a manter o field state mesmo quando os itens mudam de posição no array. Isso garante que o state de validação e as interações do usuário persistam corretamente quando os arrays são reordenados.

<!-- TBD: Para arrays dinâmicos e operações complexas com arrays, veja o [guia Trabalhando com arrays](guide/forms/signals/arrays). -->

## Próximos passos {#next-steps}

Este guia abordou a criação de models e a atualização de valores. Guias relacionados exploram outros aspectos de Signal Forms:

<docs-pill-row>
  <docs-pill href="guide/forms/signals/field-state-management" title="Field state management" />
  <docs-pill href="guide/forms/signals/validation" title="Validation" />
  <docs-pill href="guide/forms/signals/custom-controls" title="Custom controls" />
  <!-- <docs-pill href="guide/forms/signals/arrays" title="Working with Arrays" /> -->
</docs-pill-row>
