<!-- ia-translate: true -->
# Migrando formulários existentes para Signal Forms {#migrating-existing-forms-to-signal-forms}

Este guia apresenta estratégias para migrar bases de código existentes para Signal Forms, com foco na interoperabilidade com
Reactive Forms existentes.

## Migração top-down usando `compatForm` {#top-down-migration-using-compatform}

Às vezes você pode querer usar instâncias existentes de `FormControl` reativos dentro de um Signal Form. Isso é útil para
controles que envolvem:

- Lógica assíncrona complexa.
- Operadores RxJS intrincados que ainda não foram portados.
- Integração com bibliotecas de terceiros existentes.

### Integrando um `FormControl` em um signal form {#integrating-a-formcontrol-into-a-signal-form}

Considere um `passwordControl` existente que usa um `enterprisePasswordValidator` especializado. Em vez de reescrever o
validador, você pode fazer a ponte entre o controle e o seu state de signal.

Podemos fazer isso usando `compatForm`:

```typescript
import {signal} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {compatForm} from '@angular/forms/signals/compat';

// 1. Controle existente com um validador especializado
const passwordControl = new FormControl('', {
  validators: [Validators.required, enterprisePasswordValidator()],
  nonNullable: true,
});

// 2. Envolva-o dentro do signal de state do formulário
const user = signal({
  email: '',
  password: passwordControl, // Aninhe o controle existente diretamente
});

// 3. Crie o formulário
const f = compatForm(user);

// Acesse os valores pela árvore de signals
console.log(f.email().value()); // Valor atual do email
console.log(f.password().value()); // Valor atual do passwordControl

// O state reativo é acessado por proxy automaticamente
const isPasswordValid = f.password().valid();
const passwordErrors = f.password().errors(); // Retorna CompatValidationError se o validador existente falhar
```

No template, use a sintaxe reativa padrão vinculando o controle subjacente:

```angular-html
<form novalidate>
  <div>
    <label>
      Email:
      <input [formField]="f.email" />
    </label>
  </div>

  <div>
    <label>
      Password:
      <input [formField]="f.password" type="password" />
    </label>

    @if (f.password().touched() && f.password().invalid()) {
      <div class="error-list">
        @for (error of f.password().errors(); track error) {
          <p>{{ errorMessage(error) }}</p>
        }
      </div>
    }
  </div>
</form>
```

Erros dos validadores existentes são `CompatValidationError`s. Eles não definem `message`; o objeto de erro retornado pelo validador fica disponível em `context`:

```typescript
import {ValidationError} from '@angular/forms/signals';
import {CompatValidationError} from '@angular/forms/signals/compat';

errorMessage(error: ValidationError) {
  if (error instanceof CompatValidationError) {
    return (error.context as {message?: string} | null)?.message ?? error.kind;
  }
  return error.message ?? error.kind;
}
```

<docs-code-multifile preview path="adev/src/content/examples/signal-forms/src/compat-form-control-integration/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/signal-forms/src/compat-form-control-integration/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/signal-forms/src/compat-form-control-integration/app/app.html"/>
</docs-code-multifile>

### Integrando um `FormGroup` em um signal form {#integrating-a-formgroup-into-a-signal-form}

Você também pode envolver um `FormGroup` inteiro. Isso é comum quando uma subseção reutilizável de um formulário, como um
**Bloco de endereço**, ainda é gerenciada por Reactive Forms existentes.

```typescript
import {signal} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {compatForm} from '@angular/forms/signals/compat';
import {required} from '@angular/forms/signals';

// 1. Um grupo de endereço existente com sua própria lógica de validação
const addressGroup = new FormGroup({
  street: new FormControl('123 Angular Way', Validators.required),
  city: new FormControl('Mountain View', Validators.required),
  zip: new FormControl('94043', Validators.required),
});

// 2. Inclua-o no state como se fosse um valor
const checkoutModel = signal({
  customerName: 'Pirojok the Cat',
  shippingAddress: addressGroup,
});

const f = compatForm(checkoutModel, (p) => {
  required(p.customerName);
});
```

O field `shippingAddress` atua como um ramo na sua árvore de Signal Forms. Você pode vincular esses controles aninhados no
template acessando os controles existentes subjacentes via `.control()`:

```angular-html
<form novalidate>
  <h3>Shipping Details</h3>

  <div>
    <label>
      Customer Name:
      <input [formField]="f.customerName" />
    </label>

    @if (f.customerName().touched() && f.customerName().invalid()) {
      <div class="error-list">
        <p>Customer name is required.</p>
      </div>
    }
  </div>

  <fieldset>
    <legend>Address</legend>

    @let street = f.shippingAddress().control().controls.street;
    <div>
      <label>
        Street:
        <input [formControl]="street" />
      </label>
      @if (street.touched && street.invalid) {
        <div class="error-list">
          <p>Street is required</p>
        </div>
      }
    </div>

    @let city = f.shippingAddress().control().controls.city;
    <div>
      <label>
        City:
        <input [formControl]="city" />
      </label>
      @if (city.touched && city.invalid) {
        <div class="error-list">
          <p>City is required</p>
        </div>
      }
    </div>

    @let zip = f.shippingAddress().control().controls.zip;
    <div>
      <label>
        Zip Code:
        <input [formControl]="zip" />
      </label>
      @if (zip.touched && zip.invalid) {
        <div class="error-list">
          <p>Zip Code is required</p>
        </div>
      }
    </div>
  </fieldset>
</form>
```

<docs-code-multifile preview path="adev/src/content/examples/signal-forms/src/compat-form-group-integration/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/signal-forms/src/compat-form-group-integration/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/signal-forms/src/compat-form-group-integration/app/app.html"/>
</docs-code-multifile>

### Acessando valores {#accessing-values}

Embora `compatForm` faça proxy do acesso aos valores no nível do `FormControl`, o valor completo do formulário preserva o controle:

```typescript
const passwordControl = new FormControl('password' /** ... */);

const user = signal({
  email: '',
  password: passwordControl, // Aninhe o controle existente diretamente
});

const form = compatForm(user);
form.password().value(); // 'password'
form().value(); // { email: '', password: FormControl}
```

Se você precisar do valor completo do formulário, terá que construí-lo manualmente:

```typescript
const formValue = computed(() => ({
  email: form.email().value(),
  password: form.password().value(),
})); // {email: '', password: ''}
```

## Migração bottom-up {#bottom-up-migration}

### Integrando um Signal Form em um `FormGroup` {#integrating-a-signal-form-into-a-formgroup}

Você pode usar `SignalFormControl` para expor um formulário baseado em signals como um `FormControl` padrão. Isso é útil quando
você quer migrar nós folha de um formulário para signals, mantendo a estrutura do `FormGroup` pai.

```typescript
import {Component, signal} from '@angular/core';
import {ReactiveFormsModule, FormGroup} from '@angular/forms';
import {SignalFormControl} from '@angular/forms/signals/compat';
import {required} from '@angular/forms/signals';

@Component({
  // ...
  imports: [ReactiveFormsModule],
})
export class UserProfile {
  // 1. Crie um SignalFormControl, usando regras de signal form.
  emailControl = new SignalFormControl('', (p) => {
    required(p, {message: 'Email is required'});
  });

  // 2. Use-o em um FormGroup existente
  form = new FormGroup({
    email: this.emailControl,
  });
}
```

O `SignalFormControl` sincroniza valores de forma bidirecional entre o sistema de **Signal Forms** e o sistema de **Reactive Forms**:

- **Signal -> Reactive**: Atualizar o valor via Signal Forms atualiza o controle de Reactive Forms imediatamente.

```typescript
// Atualização em Signal Forms
this.emailControl.fieldTree().value.set('new@example.com');

// Reactive Forms reflete a mudança
console.log(this.form.value); // {email: 'new@example.com'}
```

- **Reactive -> Signal**: Atualizar o valor via o `FormGroup` pai atualiza o state de Signal Forms.

```typescript
// Atualização em Reactive Forms
this.form.patchValue({email: 'other@example.com'});

// Signal Forms reflete a mudança
console.log(this.emailControl.fieldTree().value()); // 'other@example.com'
```

### Vinculando `SignalFormControl` {#binding-signalformcontrol}

Para usar `SignalFormControl` em um `FormGroup`, passe-o como controle e vincule-o no template usando `.fieldTree`:

```typescript
readonly emailControl = new SignalFormControl('', (p) => { required(p); });

readonly form = new FormGroup({
  name: new FormControl('Alice'),
  email: this.emailControl,
});
```

```angular-html {prefer}
<form [formGroup]="form">
  <!-- Controle padrão -->
  <input formControlName="name" />

  <!-- Controle de signal -->
  <input [formField]="emailControl.fieldTree" />
</form>
```

```angular-html {avoid}
<!-- Evite: usar formControlName ou [formControl] para SignalFormControl -->
<input formControlName="email" />
<input [formControl]="emailControl" />
```

### Por que `SignalFormControl` recebe um valor em vez de um signal {#why-signalformcontrol-takes-a-value-instead-of-a-signal}

Em Signal Forms padrão, você cria um formulário passando um signal: `form(mySignal)`.

No entanto, `SignalFormControl` recebe um **valor bruto** (como uma string ou objeto) como primeiro argumento:

```typescript
// Recebe um valor bruto, não um signal
const userControl = new SignalFormControl({
  email: 'pirojok@example.com',
});
```

`SignalFormControl` cria o signal internamente para interceptar escritas e disparar as **atualizações síncronas** esperadas pelo Reactive Forms.

Você ainda pode acessar o signal interno via `.sourceValue`:

```typescript
const value = userControl.sourceValue();
```

### Desabilitando/habilitando controle {#disablingenabling-control}

APIs imperativas para alterar o estado habilitado/desabilitado (como `enable()` e `disable()`) não são suportadas de propósito
em `SignalFormControl`. Isso acontece porque o state do controle deve ser derivado do state e das regras do signal.

Tentar chamar disable/enable lançará um erro.

```typescript {avoid}
import {signal, effect} from '@angular/core';
import {SignalFormControl} from '@angular/forms/signals/compat';

export class UserProfile {
  readonly emailControl = new SignalFormControl('');

  readonly isLoading = signal(false);

  constructor() {
    // Isso vai lançar um erro
    effect(() => {
      if (this.isLoading()) {
        this.emailControl.disable();
      } else {
        this.emailControl.enable();
      }
    });
  }
}
```

Em vez disso, use a regra disabled:

```typescript {prefer}
import {signal} from '@angular/core';
import {SignalFormControl} from '@angular/forms/signals/compat';
import {disabled} from '@angular/forms/signals';

export class UserProfile {
  readonly isLoading = signal(false);

  readonly emailControl = new SignalFormControl('', (p) => {
    // O controle fica desabilitado sempre que isLoading for true
    disabled(p, {when: () => this.isLoading()});
  });

  async saveData() {
    this.isLoading.set(true);
    // ... executa o salvamento ...
    this.isLoading.set(false);
  }
}
```

### Manipulação dinâmica {#dynamic-manipulation}

APIs imperativas para adicionar ou remover validadores (como `addValidators()`, `removeValidators()`, `setValidators()`) não são
suportadas de propósito em `SignalFormControl`.

Chamar esses métodos lançará um erro.

```typescript {avoid}
export class UserProfile {
  readonly emailControl = new SignalFormControl('');
  readonly isRequired = signal(false);

  toggleRequired() {
    this.isRequired.update((v) => !v);
    // Isso vai lançar um erro
    if (this.isRequired()) {
      this.emailControl.addValidators(Validators.required);
    } else {
      this.emailControl.removeValidators(Validators.required);
    }
  }
}
```

Em vez disso, use a regra `applyWhen` para aplicar validadores condicionalmente:

```typescript {prefer}
import {signal} from '@angular/core';
import {SignalFormControl} from '@angular/forms/signals/compat';
import {applyWhen, required} from '@angular/forms/signals';

export class UserProfile {
  readonly isRequired = signal(false);

  readonly emailControl = new SignalFormControl('', (p) => {
    // O controle fica obrigatório sempre que isRequired for true
    applyWhen(
      p,
      () => this.isRequired(),
      (p) => {
        required(p);
      },
    );
  });
}
```

### Seleção manual de erros {#manual-error-selection}

Os métodos `setErrors()` e `markAsPending()` não são suportados. Em Signal Forms, os erros são derivados das regras de
validação e do status de validação assíncrona. Se você precisar reportar um erro, isso deve ser feito de forma declarativa,
por meio de uma regra de validação no schema.

## Classes de status automáticas {#automatic-status-classes}

Reactive/Template Forms adicionam automaticamente [atributos de classe](/guide/forms/template-driven-forms#track-control-states)
(como `.ng-valid` ou `.ng-dirty`) para facilitar a estilização dos states dos controles. Signal Forms não faz isso.

Se você quiser preservar esse comportamento, pode fornecer o preset `NG_STATUS_CLASSES`:

```typescript
import {provideSignalFormsConfig} from '@angular/forms/signals';
import {NG_STATUS_CLASSES} from '@angular/forms/signals/compat';
import {bootstrapApplication} from '@angular/platform-browser';

bootstrapApplication(App, {
  providers: [
    provideSignalFormsConfig({
      classes: NG_STATUS_CLASSES,
    }),
  ],
});
```

Você também pode fornecer sua própria configuração customizada para aplicar as classes que quiser com base na sua lógica:

```typescript
import {provideSignalFormsConfig} from '@angular/forms/signals';
import {bootstrapApplication} from '@angular/platform-browser';

bootstrapApplication(App, {
  providers: [
    provideSignalFormsConfig({
      classes: {
        'ng-valid': ({state}) => state().valid(),
        'ng-invalid': ({state}) => state().invalid(),
        'ng-touched': ({state}) => state().touched(),
        'ng-dirty': ({state}) => state().dirty(),
      },
    }),
  ],
});
```

## Controles customizados {#custom-controls}

Qualquer [Signal Form Control customizado](guide/forms/signals/custom-controls) pode ser usado com Reactive (e Template-Driven)
Forms exatamente como está. Isso permite migrar implementações existentes de `ControlValueAccessor` para
`FormValueControl`/`FormCheckboxControl` sem quebrar os usos existentes.

IMPORTANTE: **não** implemente `ControlValueAccessor` e `FormValueControl`/`FormCheckboxControl` no mesmo component. Implemente
um ou outro.

Dado o seguinte custom control:

```angular-ts
import {Component, model} from '@angular/core';
import {FormValueControl} from '@angular/forms/signals';

@Component({
  selector: 'app-basic-input',
  template: `
    <div class="basic-input">
      <input
        type="text"
        [value]="value()"
        (input)="value.set($event.target.value)"
        placeholder="Enter text..."
      />
    </div>
  `,
})
export class BasicInput implements FormValueControl<string> {
  /** O valor atual do input */
  value = model('');
}
```

Você pode usar esse custom control com reactive forms da mesma forma que usaria um input nativo ou um custom control baseado em
`ControlValueAccessor`. Por exemplo, considere este component simples com um Reactive Form.

```angular-ts
import {Component} from '@angular/core';
import {FormGroup, FormControl, ReactiveFormsModule} from '@angular/forms';
import {BasicInput} from './basic-input';

@Component({
  selector: 'app-example',
  template: `
    <form [formGroup]="reactiveFormGroup">
      <app-basic-input formControlName="reactiveControlName" />
    </form>
    <p>Text: {{ reactiveFormGroup.value.reactiveControlName }}</p>
  `,
  imports: [ReactiveFormsModule, BasicInput],
})
export class ExampleComponent {
  readonly reactiveFormGroup = new FormGroup({
    reactiveControlName: new FormControl(''),
  });
}
```

Qualquer alteração no custom control `app-basic-input` será refletida no `FormControl` reativo.
