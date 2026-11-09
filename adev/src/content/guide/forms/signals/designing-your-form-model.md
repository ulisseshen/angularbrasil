<!-- ia-translate: true -->
# Projetando o seu modelo de formulário {#designing-your-form-model}

Os Signal Forms usam uma abordagem orientada a modelo, derivando o estado e a estrutura do formulário diretamente do modelo que você fornece. Como ele é a base de todo o formulário, é importante começar com um modelo bem projetado. Este guia explora as melhores práticas para projetar modelos de formulário.

## Modelo de formulário versus modelo de domínio {#form-model-vs-domain-model}

Formulários são usados para coletar a entrada do usuário. A sua aplicação provavelmente tem um modelo de domínio usado para representar essa entrada de uma forma otimizada para a lógica de negócio ou para o armazenamento. No entanto, isso costuma ser _diferente_ de como queremos modelar os dados no formulário.

O modelo de formulário representa a entrada bruta do usuário como ela aparece na interface. Por exemplo, em um formulário você pode pedir ao usuário que escolha uma data e um horário de atendimento em campos separados, mesmo que o seu modelo de domínio represente isso como um único objeto `Date` do JavaScript:

```ts
interface AppointmentFormModel {
  name: string; // Appointment owner's name
  date: Date; // Appointment date (carries only date information, time component is unused)
  time: string; // Selected time as a string
}

interface AppointmentDomainModel {
  name: string; // Appointment owner's name
  time: Date; // Appointment time (carries both date and time information)
}
```

Os formulários devem usar um modelo de formulário adaptado à experiência de entrada, em vez de simplesmente reaproveitar o modelo de domínio.

## Melhores práticas para modelos de formulário {#form-model-best-practices}

### Use tipos específicos {#use-specific-types}

Sempre defina interfaces ou tipos para os seus modelos, como mostrado em [Usando tipos do TypeScript](/guide/forms/signals/models#using-typescript-types). Tipos explícitos oferecem melhor IntelliSense, detectam erros em tempo de compilação e servem como documentação de quais dados o formulário contém.

### Inicialize todos os campos {#initialize-all-fields}

Forneça valores iniciais para todos os campos do seu modelo:

```ts {prefer, header: 'All fields initialized'}
const taskModel = signal({
  title: '',
  description: '',
  priority: 'medium',
  completed: false,
});
```

```ts {avoid, header: 'Partial initialization'}
const taskModel = signal({
  title: '',
  // Missing description, priority, completed
});
```

Valores iniciais ausentes significam que esses campos não existirão na árvore de campos, tornando-os inacessíveis para interações com o formulário.

### Mantenha os modelos focados {#keep-models-focused}

Cada modelo deve representar um único formulário ou um conjunto coeso de dados relacionados:

```ts {prefer, header: 'Focused on a single purpose'}
const loginModel = signal({
  email: '',
  password: '',
});
```

```ts {avoid, header: 'Mixing unrelated concerns'}
const appModel = signal({
  // Login data
  email: '',
  password: '',
  // User preferences
  theme: 'light',
  language: 'en',
  // Shopping cart
  cartItems: [],
});
```

Modelos separados para preocupações diferentes tornam os formulários mais fáceis de entender e reutilizar. Crie vários formulários se estiver gerenciando conjuntos distintos de dados.

### Considere os requisitos de validação {#consider-validation-requirements}

Projete os modelos pensando na validação. Agrupe os campos que são validados em conjunto:

```ts {prefer, header: 'Related fields grouped for comparison'}
// Password fields grouped for comparison
interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
```

Essa estrutura torna a validação entre campos (como verificar se `newPassword` corresponde a `confirmPassword`) mais natural.

### Faça os tipos de dados corresponderem aos controles de interface {#match-data-types-to-ui-controls}

As propriedades do seu modelo de formulário devem corresponder aos tipos de dados esperados pelos controles de interface.

Por exemplo, considere um formulário de pedido de bebidas com um campo `size` (pacote de 6, 12 ou 24 unidades) e um campo `quantity`. A interface usa uma lista suspensa (`<select>`) para o tamanho e um campo numérico (`<input type="number">`) para a quantidade.

Embora as opções de tamanho pareçam numéricas, os elementos `<select>` trabalham com valores de string, então `size` deve ser modelado como string. Já um `<input type="number">` trabalha com números, então `quantity` pode ser modelado como número.

```ts {prefer, header: 'Appropriate data types for the bound UI controls'}
interface BeverageOrderFormModel {
  size: string; // Bound to: <select> (option values: "6", "12", "24")
  quantity: number; // Bound to: <input type="number">
}
```

### Evite `undefined` {#avoid-undefined}

Um modelo de formulário não pode conter valores ou propriedades `undefined`. Nos Signal Forms, a estrutura do formulário é derivada da estrutura do modelo, e `undefined` significa a _ausência de um campo_, e não um campo com valor vazio. Isso significa que você também deve evitar campos opcionais (por exemplo, `{property?: string}`), pois eles permitem implicitamente `undefined`.

Para representar uma propriedade com valor vazio no seu modelo de formulário, use um valor que o controle de interface entenda como "vazio" (por exemplo, `""` para um `<input type="text">`). Se você estiver projetando um controle de interface personalizado, `null` costuma funcionar bem para sinalizar "vazio".

```ts {prefer, header: 'Appropriate empty values'}
interface UserFormModel {
  name: string; // Bound to <input type="text">
  birthday: Date | null; // Bound to <input type="date">
}

// Initialize our form with empty values.
form(signal({name: '', birthday: null}));
```

### Evite modelos com estrutura dinâmica {#avoid-models-with-dynamic-structure}

Um modelo de formulário tem estrutura dinâmica se muda de formato (se as propriedades do objeto mudam) com base no seu valor. Isso acontece quando o tipo do modelo permite valores com formatos diferentes, como uma união de tipos de objeto com propriedades diferentes, ou uma união de um objeto com um primitivo. As seções a seguir examinam alguns cenários comuns em que modelos com estrutura dinâmica parecem atraentes, mas acabam se mostrando problemáticos.

#### Valor vazio para um objeto complexo {#empty-value-for-a-complex-object}

Frequentemente usamos formulários para pedir que os usuários insiram dados totalmente novos, em vez de editar dados existentes em um sistema. Um bom exemplo é um formulário de criação de conta. Podemos modelá-lo com o seguinte modelo de formulário:

```ts
interface CreateAccountFormModel {
  name: {
    first: string;
    last: string;
  };
  username: string;
}
```

Ao criar o formulário, encontramos um dilema: qual deve ser o valor inicial do modelo? Pode ser tentador criar um `form<CreateAccountFormModel | null>()`, já que ainda não temos nenhuma entrada do usuário.

```ts {avoid, header: 'Using null as empty value for complex object'}
createAccountForm = form<CreateAccountFormModel | null>(signal(/* what goes here, null? */));
```

No entanto, é importante lembrar que os Signal Forms são _orientados a modelo_. Se o nosso modelo é `null` e `null` não tem as propriedades `name` ou `username`, isso significa que o formulário também não terá esses subcampos. O que realmente queremos é uma instância de `CreateAccountFormModel` com todos os seus campos-folha definidos com um valor vazio:

```ts {prefer, header: 'Same shape value with empty values for properties'}
createAccountForm = form<CreateAccountFormModel>(
  signal({
    name: {
      first: '',
      last: '',
    },
    username: '',
  }),
);
```

Com essa representação, todos os subcampos de que precisamos agora existem, e podemos vinculá-los usando a diretiva `[formField]` no nosso template.

```html
First: <input [formField]="createAccountForm.name.first" /> Last:
<input [formField]="createAccountForm.name.last" /> Username:
<input [formField]="createAccountForm.username" />
```

#### Campos ocultos ou indisponíveis condicionalmente {#fields-that-are-conditionally-hidden-or-unavailable}

Formulários nem sempre são lineares. Muitas vezes você precisa criar caminhos condicionais com base na entrada anterior do usuário. Um exemplo é um formulário em que oferecemos ao usuário diferentes opções de pagamento. Vamos começar imaginando como a interface desse formulário poderia ser:

```html
Name: <input type="text" />

<section>
  <h2>Payment Info</h2>
  <input type="radio" /> Credit Card @if (/* credit card selected */) {
  <section>
    Card Number <input type="text" /> Security Code <input type="text" /> Expiration
    <input type="text" />
  </section>
  }
  <input type="radio" /> Bank Account @if (/* bank account selected */) {
  <section>Account Number <input type="text" /> Routing Number <input type="text" /></section>
  }
</section>
```

A melhor forma de lidar com isso é usar um modelo de formulário com uma estrutura estática que inclua campos para _todas_ as formas de pagamento possíveis. No nosso schema, podemos ocultar ou desabilitar os campos que não estão disponíveis no momento.

```ts {prefer, header: 'Static structure model'}
interface BillPayFormModel {
  name: string;
  method: {
    type: string;
    card: {
      cardNumber: string;
      securityCode: string;
      expiration: string;
    };
    bank: {
      accountNumber: string;
      routingNumber: string;
    };
  };
}

const billPaySchema = schema<BillPayFormModel>((billPay) => {
  // Hide credit card details when user has selected a method other than credit card.
  hidden(billPay.method.card, {when: ({valueOf}) => valueOf(billPay.method.type) !== 'card'});
  // Hide bank account details when user has selected a method other than bank account.
  hidden(billPay.method.bank, {when: ({valueOf}) => valueOf(billPay.method.type) !== 'bank'});
});
```

Com esse modelo, os objetos `card` e `bank` estão sempre presentes no estado do formulário. Quando o usuário troca de forma de pagamento, atualizamos apenas a propriedade `type`. Os dados que ele digitou nos campos do cartão permanecem armazenados com segurança no objeto `card`, prontos para serem exibidos novamente caso ele volte para essa opção.

Em contraste, um modelo de formulário dinâmico pode parecer inicialmente uma boa escolha para esse caso de uso. Afinal, não precisamos de campos para número da conta e código de roteamento se o usuário selecionou "Cartão de crédito". Podemos ser tentados a modelar isso como uma união discriminada:

```ts {avoid, header: 'Dynamic structure model'}
interface BillPayFormModel {
  name: string;
  method:
    | {
        type: 'card';
        cardNumber: string;
        securityCode: string;
        expiration: string;
      }
    | {
        type: 'bank';
        accountNumber: string;
        routingNumber: string;
      };
}
```

No entanto, considere o que aconteceria no seguinte cenário:

1. O usuário preenche o nome e as informações do cartão de crédito
2. Ele está prestes a enviar, mas no último momento percebe a taxa de conveniência
3. Ele muda para a opção de conta bancária, pensando que pode evitar a taxa
4. Quando está prestes a digitar os dados da conta bancária, muda de ideia, pois não quer que eles vazem
5. Ele volta para a opção de cartão de crédito, mas percebe que todas as informações que acabou de digitar sumiram!

Isso ilustra outro problema dos modelos de formulário com estrutura dinâmica: eles podem causar perda de dados. Um modelo assim pressupõe que, quando um campo fica oculto, a informação nele nunca mais será necessária. Ele substitui os dados do cartão de crédito pelos dados bancários e não tem como recuperar os dados do cartão.

#### Exceções {#exceptions}

Embora a estrutura estática seja geralmente preferida, há cenários específicos em que a estrutura dinâmica é necessária e suportada.

##### Arrays

Arrays são a exceção mais comum. Formulários frequentemente precisam coletar um número variável de itens, como uma lista de números de telefone, participantes ou itens de um pedido.

```ts
interface SendEmailFormModel {
  subject: string;
  recipientEmails: string[];
}
```

Nesse caso, o array `recipientEmails` cresce e diminui conforme o usuário interage com o formulário. Embora o tamanho do array seja dinâmico, a estrutura dos itens individuais deve ser consistente (cada item deve ter o mesmo formato).

##### Campos tratados atomicamente pelo controle de interface {#fields-that-are-treated-atomically-by-the-ui-control}

Outro caso em que a estrutura dinâmica é aceitável é quando um objeto complexo é tratado como um único valor atômico pelo controle de interface. Ou seja, o controle não tenta vincular ou acessar nenhum dos seus subcampos individualmente. Nesse cenário, o controle atualiza o valor substituindo o objeto inteiro de uma só vez, em vez de modificar suas propriedades internas. Como a estrutura do formulário é irrelevante nesse cenário, é aceitável que essa estrutura seja dinâmica.

Por exemplo, considere um formulário de perfil de usuário que inclui um campo `location`. A localização é selecionada usando um "seletor de localização" complexo (talvez um mapa ou uma lista suspensa com busca antecipada), que retorna um objeto de coordenadas. Caso a localização ainda não tenha sido selecionada, ou o usuário opte por não compartilhá-la, o seletor indica a localização como `null`.

```ts {prefer, header: 'Dynamic structure is ok when field is treated as atomic'}
interface Location {
  lat: number;
  lng: number;
}

interface UserProfileFormModel {
  username: string;
  // This property has dynamic structure,
  // but that's ok because the location picker treats this field as atomic.
  location: Location | null;
}
```

No template, vinculamos o campo `location` diretamente ao nosso controle personalizado:

```html
Username: <input [formField]="userForm.username" /> Location:
<location-picker [formField]="userForm.location"></location-picker>
```

Aqui, o `<location-picker>` consome e produz o objeto `Location` inteiro (ou `null`), e não acessa `userForm.location.lat` nem `userForm.location.lng`. Portanto, `location` pode ter um formato dinâmico com segurança, sem violar os princípios dos formulários orientados a modelo.

## Convertendo entre modelo de formulário e modelo de domínio {#translating-between-form-model-and-domain-model}

Como o modelo de formulário e o modelo de domínio representam o mesmo conceito de formas diferentes, precisamos de uma maneira de converter entre essas representações. Quando queremos apresentar ao usuário, em um formulário, dados existentes no sistema, precisamos transformá-los do formato do modelo de domínio para o formato do modelo de formulário. Por outro lado, ao salvar as alterações do usuário, transformamos os dados do modelo de formulário para o modelo de domínio.

Vamos imaginar que temos um modelo de domínio e um modelo de formulário, e escrevemos algumas funções para convertê-los entre si.

```ts
interface MyDomainModel { ... }

interface MyFormModel { ... }

// Instance of `MyFormModel` populated with empty input (e.g. `''` for string inputs, etc.)
const EMPTY_MY_FORM_MODEL: MyFormModel = { ... };

function domainModelToFormModel(domainModel: MyDomainModel): MyFormModel { ... }

function formModelToDomainModel(formModel: MyFormModel): MyDomainModel { ... }
```

### Do modelo de domínio para o modelo de formulário {#domain-model-to-form-model}

Quando criamos um formulário para editar um modelo de domínio existente no sistema, normalmente recebemos esse modelo de domínio como um `input()` do componente do formulário ou do backend (por exemplo, via um resource). Em ambos os casos, `linkedSignal` oferece uma excelente forma de aplicar a transformação.

No caso em que recebemos o modelo de domínio como um `input()`, podemos usar `linkedSignal` para criar um modelo de formulário gravável a partir do signal de entrada.

```ts {prefer, header: 'Use linkedSignal to convert domain model to form model'}
@Component(...)
class MyForm {
  // The domain model to initialize the form with, if not given we start with an empty form.
  readonly domainModel = input<MyDomainModel>();

  private readonly formModel = linkedSignal({
    // Linked signal based on the domain model
    source: this.domainModel,
    // If domain model is defined convert it to a form model, otherwise use an empty form model.
    computation: (domainModel) => domainModel
      ? domainModelToFormModel(domainModel)
      : EMPTY_MY_FORM_MODEL
  });

  protected readonly myForm = form(this.formModel);
}
```

De forma semelhante, quando recebemos o modelo de domínio do backend por meio de um resource, podemos criar um `linkedSignal` com base no valor dele para criar o nosso `formModel`. Nesse cenário, o modelo de domínio pode levar algum tempo para ser buscado, e devemos desabilitar o formulário até que os dados sejam carregados.

```ts {prefer, header: 'Disable or hide the form when data is unavailable'}
@Component(...)
class MyForm {
  // Fetch the domain model from the backend.
  readonly domainModelResource: ResourceRef<MyDomainModel | undefined> = httpResource(...);

  private readonly formModel = linkedSignal({
    // Linked signal based on the domain model resource
    source: this.domainModelResource.value,
    // Convert the domain model once it loads, use an empty form model while loading.
    computation: (domainModel) => domainModel
      ? domainModelToFormModel(domainModel)
      : EMPTY_MY_FORM_MODEL
  });

  protected readonly myForm = form(this.formModel, (root) => {
    // Disable the entire form when the resource is loading.
    disabled(root, {when: () => this.domainModelResource.isLoading()});
  });
}
```

Os exemplos acima mostram uma derivação pura do modelo de formulário, diretamente do modelo de domínio. No entanto, em alguns casos você pode querer fazer uma operação de comparação mais avançada entre o novo valor do modelo de domínio e os valores anteriores do modelo de domínio e do modelo de formulário. Isso pode ser implementado com base no [estado anterior](/guide/signals/linked-signal#accounting-for-previous-state) do `linkedSignal`.

### Do modelo de formulário para o modelo de domínio {#form-model-to-domain-model}

Quando estivermos prontos para salvar a entrada do usuário de volta no sistema, precisamos convertê-la para a representação do modelo de domínio. Isso normalmente aconteceria quando o usuário envia o formulário, ou continuamente enquanto ele edita, no caso de um formulário com salvamento automático.

Para salvar no envio, podemos fazer a conversão na função `submit`.

```ts {prefer, header: 'Convert form model to domain model on submit'}
@Component(...)
class MyForm {
  private readonly myDataService = inject(MyDataService);

  protected readonly myForm = form<MyFormModel>(...);

  handleSubmit() {
    submit(this.myForm, async () => {
      await this.myDataService.update(formModelToDomainModel(this.myForm().value()));
    });
  };
}
```

Alternativamente, você também pode enviar o modelo de formulário diretamente ao servidor e fazer a conversão de modelo de formulário para modelo de domínio no servidor.

Para salvamento contínuo, atualize o modelo de domínio em um `effect`.

```ts {prefer, header: 'Convert form model to domain model in an effect for auto-saving'}
@Component(...)
class MyForm {
  readonly domainModel = model.required<MyDomainModel>()

  protected readonly myForm = form(...);

  constructor() {
    effect(() => {
      // When the form model changes to a valid value, update the domain model.
      if (this.myForm().valid()) {
        this.domainModel.set(formModelToDomainModel(this.myForm().value()));
      }
    });
  };
}
```

Os exemplos acima mostram uma conversão pura do modelo de formulário para o modelo de domínio. No entanto, é perfeitamente aceitável considerar o estado completo do formulário, além apenas do valor do modelo. Por exemplo, para economizar bytes, podemos querer enviar ao servidor apenas atualizações parciais, com base no que o usuário alterou. Nesse caso, a nossa função de conversão pode ser projetada para receber o estado inteiro do formulário e retornar um modelo de domínio esparso, com base nos valores e na sujeira do formulário.

```ts
type Sparse<T> = T extends object ? {
    [P in keyof T]?: Sparse<T[P]>;
} : T;

function formStateToPartialDomainModel(
  formState: FieldState<MyFormModel>
): Sparse<MyDomainModel> { ... }
```
