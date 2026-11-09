<!-- ia-translate: true -->
# Comparação com outras abordagens de formulários

O Angular oferece três abordagens para construir formulários: Signal Forms, Reactive Forms e Template-driven Forms. Cada uma tem padrões distintos para gerenciar estado, validação e fluxo de dados. Este guia ajuda você a entender as diferenças e a escolher a abordagem certa para o seu projeto.

## Comparação rápida {#quick-comparison}

| Recurso          | Signal Forms                         | Reactive Forms                          | Template-driven Forms     |
| ---------------- | ------------------------------------ | --------------------------------------- | ------------------------- |
| Fonte da verdade | Signal gravável definido pelo usuário | `FormControl`/`FormGroup`               | Modelo do usuário no componente |
| Segurança de tipos | Inferida do modelo                 | Explícita com formulários tipados       | Mínima                    |
| Validação        | Schema com validadores baseados em caminho | Lista de validadores passada aos controles | Baseada em diretivas      |
| Gerenciamento de estado | Baseado em signals             | Baseado em observables                  | Gerenciado pelo Angular   |
| Configuração     | Signal + função de schema            | Árvore de `FormControl`                 | `NgModel` no template     |
| Ideal para       | Aplicações baseadas em signals       | Formulários complexos                   | Formulários simples       |
| Curva de aprendizado | Média                            | Média-alta                              | Baixa                     |
| Status           | Estável (v22+)                       | Estável                                 | Estável                   |

## Por exemplo: formulário de login {#by-example-login-form}

A melhor forma de entender as diferenças é ver o mesmo formulário implementado nas três abordagens.

<docs-code-multifile>
  <docs-code language="angular-ts" header="Signal Forms" path="adev/src/content/examples/signal-forms/src/comparison/app/signal-forms.ts"/>
  <docs-code header="Reactive Forms" path="adev/src/content/examples/signal-forms/src/comparison/app/reactive-forms.ts"/>
  <docs-code header="Template-driven Forms" path="adev/src/content/examples/signal-forms/src/comparison/app/template-driven-forms.ts"/>
</docs-code-multifile>

## Entendendo as diferenças {#understanding-the-differences}

As três abordagens fazem escolhas de design diferentes, que afetam como você escreve e mantém seus formulários. Essas diferenças decorrem de onde cada abordagem armazena o estado do formulário e de como ela gerencia a validação.

### Onde os dados do seu formulário ficam {#where-your-form-data-lives}

A diferença mais fundamental é onde cada abordagem considera a "fonte da verdade" para os valores do formulário.

O Signal Forms armazena os dados em um signal gravável. Quando você precisa dos valores atuais do formulário, chama o signal:

```ts
const credentials = this.loginModel(); // { email: '...', password: '...' }
```

Isso mantém os dados do formulário em um único contêiner reativo que notifica o Angular automaticamente quando os valores mudam. A estrutura do formulário espelha exatamente o seu modelo de dados.

O Reactive Forms armazena os dados dentro das instâncias de `FormControl` e `FormGroup`. Você acessa os valores pela hierarquia do formulário:

```ts
const credentials = this.loginForm.value; // { email: '...', password: '...' }
```

Isso separa o gerenciamento de estado do formulário do modelo de dados do componente. A estrutura do formulário é explícita, mas exige mais código de configuração.

O Template-driven Forms armazena os dados em propriedades do componente. Você acessa os valores diretamente:

```ts
const credentials = {email: this.email, password: this.password};
```

Essa é a abordagem mais direta, mas exige montar os valores manualmente sempre que precisar deles. O Angular gerencia o estado do formulário por meio de diretivas no template.

### Como a validação funciona {#how-validation-works}

Cada abordagem define as regras de validação de forma diferente, o que afeta onde fica a lógica de validação e como você a mantém.

O Signal Forms usa uma função de schema em que você vincula validadores a caminhos de campos:

```ts
loginForm = form(this.loginModel, (fieldPath) => {
  required(fieldPath.email, {message: 'Email is required'});
  email(fieldPath.email, {message: 'Enter a valid email address'});
});
```

Todas as regras de validação ficam juntas em um só lugar. A função de schema é executada uma vez durante a criação do formulário, e os validadores são executados automaticamente quando os valores dos campos mudam. As mensagens de erro fazem parte da definição da validação.

O Reactive Forms anexa os validadores ao criar os controles:

```ts
loginForm = new FormGroup({
  email: new FormControl('', [Validators.required, Validators.email]),
});
```

Os validadores ficam vinculados a controles individuais na estrutura do formulário. Isso distribui a validação pela definição do formulário. As mensagens de erro normalmente ficam no template.

O Template-driven Forms usa atributos de diretivas no template:

```html
<input [(ngModel)]="email" required email />
```

As regras de validação ficam no template, junto com o HTML. Isso mantém a validação próxima da interface, mas espalha a lógica entre o template e o componente.

### Segurança de tipos e autocompletar {#type-safety-and-autocomplete}

A integração com TypeScript varia bastante entre as abordagens, afetando quanto o compilador ajuda a evitar erros.

O Signal Forms infere os tipos a partir da estrutura do seu modelo:

```ts
const loginModel = signal({email: '', password: ''});
const loginForm = form(loginModel);
// TypeScript sabe: loginForm.email existe e retorna FieldState<string>
```

Você define o formato dos dados uma única vez no signal, e o TypeScript descobre automaticamente quais campos existem e quais são os seus tipos. Acessar `loginForm.username` (que não existe) produz um erro de tipo.

O Reactive Forms exige anotações de tipo explícitas com formulários tipados:

```ts
const loginForm = new FormGroup({
  email: new FormControl<string>(''),
  password: new FormControl<string>(''),
});
// TypeScript sabe: loginForm.controls.email é FormControl<string>
```

Você especifica os tipos de cada controle individualmente. O TypeScript valida a estrutura do formulário, mas você mantém as informações de tipo separadamente do modelo de dados.

O Template-driven Forms oferece segurança de tipos mínima:

```ts
email = '';
password = '';
// TypeScript only knows these are strings, no form-level typing
```

O TypeScript entende as propriedades do componente, mas não tem conhecimento da estrutura nem da validação do formulário. Você perde a verificação em tempo de compilação para as operações do formulário.

## Escolha a sua abordagem {#choose-your-approach}

### Use Signal Forms se: {#use-signal-forms-if}

- Você está construindo novas aplicações baseadas em signals (Angular v22+)
- Você quer segurança de tipos inferida da estrutura do seu modelo
- A validação baseada em schema atrai você
- Sua equipe já conhece signals

### Use Reactive Forms se: {#use-reactive-forms-if}

- Você precisa de estabilidade pronta para produção
- Você está construindo formulários complexos e dinâmicos
- Você prefere padrões baseados em observables
- Você precisa de controle refinado sobre o estado do formulário
- Você está trabalhando em uma base de código existente de reactive forms

### Use Template-driven Forms se: {#use-template-driven-forms-if}

- Você está construindo formulários simples (login, contato, busca)
- Você está fazendo prototipagem rápida
- A lógica do seu formulário é direta
- Você prefere manter a lógica do formulário nos templates
- Você está trabalhando em uma base de código existente de template-driven forms

## Próximos passos {#next-steps}

Para saber mais sobre cada abordagem:

- **Signal Forms**: veja o [guia de visão geral](guide/forms/signals/overview) para começar, ou aprofunde-se em [Modelos de formulário](guide/forms/signals/models), [Validação](guide/forms/signals/validation) e [Gerenciamento de estado do campo](guide/forms/signals/field-state-management)
- **Reactive Forms**: veja o [guia de Reactive Forms](guide/forms/reactive-forms) na documentação do Angular
- **Template-driven Forms**: veja o [guia de Template-driven Forms](guide/forms/template-driven-forms) na documentação do Angular
