<!-- ia-translate: true -->
# Controles personalizados

NOTE: Este guia pressupõe familiaridade com [essenciais de Signal Forms](essentials/signal-forms).

Os controles de formulário nativos do navegador (como input, select, textarea) atendem aos casos comuns, mas as aplicações frequentemente precisam de campos especializados. Um seletor de data com interface de calendário, um editor de texto rico com barra de ferramentas de formatação ou um seletor de tags com autocompletar exigem implementações personalizadas.

Os Signal Forms funcionam com qualquer componente que implemente interfaces específicas. Uma **interface de controle** define as propriedades e os signals que permitem ao seu componente se comunicar com o sistema de formulários. Quando o seu componente implementa uma dessas interfaces, a diretiva `[formField]` conecta automaticamente o seu controle ao estado do formulário, à validação e ao data binding.

HELPFUL: Controles personalizados de Signal Forms [podem ser usados](guide/forms/signals/migration#custom-controls) com Signal, Reactive e Template-Driven Forms sem nenhum código extra de compatibilidade.

## Criando um controle personalizado básico {#creating-a-basic-custom-control}

Vamos começar com uma implementação mínima e adicionar recursos conforme necessário.

### Controle de entrada mínimo {#minimal-input-control}

Uma entrada personalizada básica só precisa implementar a interface `FormValueControl` e definir o signal de modelo `value` obrigatório.

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
  /** The current input value */
  value = model('');
}
```

### Controle de checkbox mínimo {#minimal-checkbox-control}

Um controle no estilo checkbox precisa de duas coisas:

1. Implementar a interface `FormCheckboxControl`, para que a diretiva `FormField` reconheça o componente como um controle de formulário
2. Fornecer um signal de modelo `checked`

```angular-ts
import {Component, model, ChangeDetectionStrategy} from '@angular/core';
import {FormCheckboxControl} from '@angular/forms/signals';

@Component({
  selector: 'app-basic-toggle',
  template: `
    <button type="button" [class.active]="checked()" (click)="toggle()">
      <span class="toggle-slider"></span>
    </button>
  `,
})
export class BasicToggle implements FormCheckboxControl {
  /** Whether the toggle is checked */
  checked = model<boolean>(false);

  toggle() {
    this.checked.update((val) => !val);
  }
}
```

### Usando seu controle personalizado {#using-your-custom-control}

Depois de criar um controle, você pode usá-lo em qualquer lugar onde usaria uma entrada nativa, adicionando a diretiva `FormField` a ele:

```angular-ts
import {Component, signal, ChangeDetectionStrategy} from '@angular/core';
import {form, FormField, required} from '@angular/forms/signals';
import {BasicInput} from './basic-input';
import {BasicToggle} from './basic-toggle';

@Component({
  imports: [FormField, BasicInput, BasicToggle],
  template: `
    <form novalidate>
      <label>
        Email
        <app-basic-input [formField]="registrationForm.email" />
      </label>

      <label>
        Accept terms
        <app-basic-toggle [formField]="registrationForm.acceptTerms" />
      </label>

      <button type="submit" [disabled]="registrationForm().invalid()">Register</button>
    </form>
  `,
})
export class Registration {
  registrationModel = signal({
    email: '',
    acceptTerms: false,
  });

  registrationForm = form(this.registrationModel, (schemaPath) => {
    required(schemaPath.email, {message: 'Email is required'});
    required(schemaPath.acceptTerms, {message: 'You must accept the terms'});
  });
}
```

NOTE: O parâmetro de callback do schema (`schemaPath` nestes exemplos) é um objeto `SchemaPathTree` que fornece caminhos para todos os campos do seu formulário. Você pode dar a esse parâmetro o nome que quiser.

A diretiva `[formField]` funciona de forma idêntica para controles personalizados e entradas nativas. Os Signal Forms tratam ambos da mesma maneira — a validação é executada, o estado é atualizado e o data binding funciona automaticamente.

## Entendendo as interfaces de controle {#understanding-control-interfaces}

Agora que você viu controles personalizados em ação, vamos explorar como eles se integram aos Signal Forms.

### Interfaces de controle {#control-interfaces}

Os componentes `BasicInput` e `BasicToggle` que você criou implementam interfaces de controle específicas que informam aos Signal Forms como interagir com eles.

#### FormValueControl

`FormValueControl` é a interface para a maioria dos tipos de entrada — campos de texto, campos numéricos, seletores de data, listas suspensas de seleção e qualquer controle que edite um único valor. Quando o seu componente implementa essa interface:

- **Propriedade obrigatória**: seu componente deve fornecer um signal de modelo `value`
- **O que a diretiva FormField faz**: vincula o valor do campo do formulário ao signal `value` do seu controle

IMPORTANT: Controles que implementam `FormValueControl` NÃO podem ter uma propriedade `checked`

#### FormCheckboxControl

`FormCheckboxControl` é a interface para controles no estilo checkbox — toggles, switches e qualquer controle que represente um estado booleano de ligado/desligado. Quando o seu componente implementa essa interface:

- **Propriedade obrigatória**: seu componente deve fornecer um signal de modelo `checked`
- **O que a diretiva FormField faz**: vincula o valor do campo do formulário ao signal `checked` do seu controle

IMPORTANT: Controles que implementam `FormCheckboxControl` NÃO podem ter uma propriedade `value`

### Signals de estado opcionais {#optional-state-properties}

Tanto `FormValueControl` quanto `FormCheckboxControl` estendem `FormUiControl` — uma interface base que fornece propriedades opcionais para integração com o estado do formulário.

Todas as propriedades são opcionais. Implemente apenas o que o seu controle precisar.

#### Estado de interação {#interaction-state}

Acompanhe quando os usuários interagem com o seu controle:

| Propriedade | Finalidade                                                                       |
| ----------- | -------------------------------------------------------------------------------- |
| `touched`   | Se o usuário interagiu com o campo                                               |
| `dirty`     | Se o usuário modificou o valor, mesmo que tenha voltado ao valor original        |

#### Estado de validação {#validation-state}

Exiba feedback de validação para os usuários:

| Propriedade | Finalidade                                       |
| ----------- | ------------------------------------------------ |
| `errors`    | Array com os erros de validação atuais           |
| `invalid`   | Se o campo tem erros de validação                |
| `pending`   | Se a validação assíncrona está em andamento      |

#### Estado de disponibilidade {#availability-state}

Controle se os usuários podem interagir com o seu campo:

| Propriedade       | Finalidade                                                              |
| ----------------- | ----------------------------------------------------------------------- |
| `disabled`        | Se o campo está desabilitado                                            |
| `disabledReasons` | Motivos pelos quais o campo está desabilitado                           |
| `readonly`        | Se o campo está somente leitura (visível, mas não editável)             |
| `hidden`          | Se o campo está oculto da visualização                                  |

NOTE: `disabledReasons` é um array de objetos `DisabledReason`. Cada objeto tem uma propriedade `fieldTree` (referência à árvore do campo) e uma propriedade `message` opcional. Acesse a mensagem por meio de `reason.message`.

#### Restrições de validação {#validation-constraints}

Receba os valores das restrições de validação do formulário:

| Propriedade | Finalidade                                                   |
| ----------- | ------------------------------------------------------------ |
| `required`  | Se o campo é obrigatório                                     |
| `min`       | Valor numérico mínimo (`undefined` se não houver restrição)  |
| `max`       | Valor numérico máximo (`undefined` se não houver restrição)  |
| `minLength` | Tamanho mínimo da string (undefined se não houver restrição) |
| `maxLength` | Tamanho máximo da string (undefined se não houver restrição) |
| `pattern`   | Array de padrões de expressões regulares a serem atendidos   |

#### Metadados do campo {#field-metadata}

| Propriedade | Finalidade                                                                              |
| ----------- | --------------------------------------------------------------------------------------- |
| `name`      | O atributo name do campo (que é único entre formulários e aplicações)                   |

A seção "[Adicionando signals de estado](#adding-state-signals)", abaixo, mostra como implementar essas propriedades nos seus controles.

### Como a diretiva FormField funciona {#how-the-formfield-directive-works}

A diretiva `[formField]` detecta qual interface o seu controle implementa e vincula automaticamente os signals apropriados:

```angular-ts
import {Component, signal, ChangeDetectionStrategy} from '@angular/core';
import {form, FormField, required} from '@angular/forms/signals';
import {CustomInput} from './custom-input';
import {CustomToggle} from './custom-toggle';

@Component({
  selector: 'app-my-form',
  imports: [FormField, CustomInput, CustomToggle],
  template: `
    <form novalidate>
      <app-custom-input [formField]="userForm.username" />
      <app-custom-toggle [formField]="userForm.subscribe" />
    </form>
  `,
})
export class MyForm {
  formModel = signal({
    username: '',
    subscribe: false,
  });

  userForm = form(this.formModel, (schemaPath) => {
    required(schemaPath.username, {message: 'Username is required'});
  });
}
```

TIP: Para a cobertura completa da criação e do gerenciamento de modelos de formulário, veja o [guia de Modelos de formulário](guide/forms/signals/models).

Quando você vincula `[formField]="userForm.username"`, a diretiva FormField:

1. Detecta que o seu controle implementa `FormValueControl`
2. Acessa internamente `userForm.username().value()` e o vincula ao signal de modelo `value` do seu controle
3. Vincula os signals de estado do formulário (`disabled()`, `errors()` etc.) aos signals de entrada opcionais do seu controle
4. Atualiza tudo automaticamente por meio da reatividade dos signals

## Adicionando signals de estado {#adding-state-signals}

Os controles mínimos mostrados acima funcionam, mas não reagem ao estado do formulário. Você pode adicionar signals de entrada opcionais para fazer seus controles reagirem ao estado desabilitado, exibirem erros de validação e acompanharem a interação do usuário.

Aqui está um exemplo completo que implementa as propriedades de estado mais comuns:

```angular-ts
import {Component, model, input, output, ChangeDetectionStrategy} from '@angular/core';
import {
  FormValueControl,
  WithOptionalFieldTree,
  ValidationError,
  DisabledReason,
} from '@angular/forms/signals';

@Component({
  selector: 'app-stateful-input',
  template: `
    @if (!hidden()) {
      <div class="input-container">
        <input
          type="text"
          [value]="value()"
          (input)="value.set($event.target.value)"
          [disabled]="disabled()"
          [readonly]="readonly()"
          [class.invalid]="invalid()"
          [attr.aria-invalid]="invalid()"
          (blur)="touch.emit()"
        />

        @if (invalid()) {
          <div class="error-messages" role="alert">
            @for (error of errors(); track error) {
              <span class="error">{{ error.message }}</span>
            }
          </div>
        }

        @if (disabled() && disabledReasons().length > 0) {
          <div class="disabled-reasons">
            @for (reason of disabledReasons(); track reason) {
              <span>{{ reason.message }}</span>
            }
          </div>
        }
      </div>
    }
  `,
})
export class StatefulInput implements FormValueControl<string> {
  // Required
  value = model<string>('');

  // Writable interaction state - control updates these
  touched = input<boolean>(false);
  touch = output<void>();

  // Read-only state - form system manages these
  disabled = input<boolean>(false);
  disabledReasons = input<readonly WithOptionalFieldTree<DisabledReason>[]>([]);
  readonly = input<boolean>(false);
  hidden = input<boolean>(false);
  invalid = input<boolean>(false);
  errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
}
```

Como resultado, você pode usar o controle com validação e gerenciamento de estado:

```angular-ts
import {Component, signal, ChangeDetectionStrategy} from '@angular/core';
import {form, FormField, required, email} from '@angular/forms/signals';
import {StatefulInput} from './stateful-input';

@Component({
  imports: [FormField, StatefulInput],
  template: `
    <form novalidate>
      <label>
        Email
        <app-stateful-input [formField]="loginForm.email" />
      </label>
    </form>
  `,
})
export class Login {
  loginModel = signal({email: ''});

  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, {message: 'Email is required'});
    email(schemaPath.email, {message: 'Enter a valid email address'});
  });
}
```

Quando o usuário digita um e-mail inválido, a diretiva FormField atualiza automaticamente `invalid()` e `errors()`. Seu controle pode exibir o feedback de validação.

### Trabalhando com `debounce('blur')` {#working-with-debounceblur}

A regra [`debounce('blur')`](api/forms/signals/debounce) atrasa as atualizações da interface para o modelo do formulário até que o campo perca o foco, em vez de aplicá-las a cada tecla pressionada. Os controles nativos informam o blur ao formulário automaticamente. Um controle personalizado só participa se emitir sua saída `touch` em resposta ao evento nativo [`blur`](https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event):

```angular-ts
import {Component, model, output} from '@angular/core';
import {FormValueControl} from '@angular/forms/signals';

@Component({
  selector: 'app-custom-input',
  template: `
    <input
      type="text"
      [value]="value()"
      (input)="value.set($event.target.value)"
      (blur)="touch.emit()"
    />
  `,
})
export class CustomInput implements FormValueControl<string> {
  value = model('');
  touch = output<void>();
}
```

Com a saída `touch` configurada, `debounce('blur')` se comporta da mesma forma para o seu controle como se comporta para as entradas nativas:

```angular-ts
import {Component, signal} from '@angular/core';
import {debounce, form, FormField} from '@angular/forms/signals';
import {CustomInput} from './custom-input';

@Component({
  selector: 'app-root',
  imports: [CustomInput, FormField],
  template: `<app-custom-input [formField]="userForm.name" />`,
})
export class App {
  userModel = signal({name: ''});

  userForm = form(this.userModel, (schemaPath) => {
    debounce(schemaPath.name, 'blur');
  });
}
```

IMPORTANT: Emita `touch` no `blur` (quando o foco sai do controle), e não no `focus`. Se o seu controle não emitir `touch`, o campo nunca será marcado como tocado, e `debounce('blur')` nunca gravará no modelo do formulário o valor emitido pelo seu controle.

## Transformação de valor {#value-transformation}

Os controles às vezes exibem os valores de forma diferente da que o modelo do formulário os armazena — um seletor de data pode exibir "15 de janeiro de 2024" enquanto armazena "2024-01-15", ou uma entrada de moeda pode mostrar "R$ 1.234,56" enquanto armazena 1234.56.

Use `transformedValue()` (de `@angular/forms/signals`) para manter o valor bruto exibido na interface sincronizado com o valor do modelo. Ela recebe o signal `value` do controle mais as funções `parse` e `format`, e retorna um signal gravável que contém o valor bruto:

- `format` converte o valor do modelo no valor bruto que o template renderiza.
- `parse` converte o que o usuário digitou de volta em um valor do modelo, e pode informar erros de análise em vez disso.

```angular-ts
import {Component, model} from '@angular/core';
import {FormValueControl, transformedValue} from '@angular/forms/signals';

@Component({
  selector: 'number-input',
  template: `
    <input type="text" [value]="rawValue()" (input)="rawValue.set($event.target.value)" />
  `,
})
export class NumberInput implements FormValueControl<number | null> {
  readonly value = model.required<number | null>();

  protected readonly rawValue = transformedValue(this.value, {
    parse: (val: string): {value: number | null} => ({value: val ? Number(val) : null}),
    format: (val: number | null): string => val?.toString() ?? '',
  });
}
```

Gravar no signal retornado (`rawValue.set(...)`) executa `parse` e grava o resultado em `value`. Sempre que o modelo mudar a partir de outro lugar — um `reset()`, uma regra de schema ou outra parte da aplicação — `format` é executada novamente e o valor bruto é atualizado para corresponder.

### Informando erros de análise {#reporting-parse-errors}

Às vezes, o valor bruto não tem uma representação válida no modelo — uma data pela metade ou letras em um campo numérico. O `NumberInput` acima tem esse problema: `Number('abc')` é `NaN`, que `parse` grava no modelo sem questionar.

Retorne `{error}` no lugar:

```ts
export class NumberInput implements FormValueControl<number | null> {
  readonly value = model.required<number | null>();

  protected readonly rawValue = transformedValue(this.value, {
    parse: (val) => {
      const parsed = val ? Number(val) : null;

      return Number.isNaN(parsed)
        ? {error: {kind: 'parse', message: `${val} is not a number`}}
        : {value: parsed};
    },
    format: (val) => val?.toString() ?? '',
  });
}
```

Retorne `value` e `error` juntos quando quiser atualizar o modelo _e_ sinalizar um problema.

Quando o controle é vinculado com `[formField]`, os erros de análise são informados automaticamente ao campo, então aparecem no signal `errors()` do campo junto com os erros de validação:

```angular-ts
@Component({
  imports: [NumberInput, FormField],
  template: `
    <number-input [formField]="orderForm.amount" />

    @for (error of orderForm.amount().errors(); track $index) {
      <!-- {kind: 'parse', message: '...'} is reported here too -->
      <p class="error">{{ error.message }}</p>
    }
  `,
})
export class Order {
  orderModel = signal<{amount: number | null}>({amount: null});
  orderForm = form(this.orderModel);
}
```

Um campo com erros de análise é inválido, o que bloqueia o envio da mesma forma que uma regra de validação que falhou.

HELPFUL: Os Signal Forms usam o mesmo mecanismo para entradas nativas. Quando o navegador não consegue analisar um valor (por exemplo, uma data parcialmente digitada em `<input type="date">`), isso aparece como um erro `parse` no campo. Veja [Validação HTML nativa](guide/forms/signals/validation#native-html-validation) para mais detalhes.

### Redefinindo {#resetting}

Chamar `reset()` no campo limpa quaisquer erros de análise pendentes e reformata o valor bruto a partir do modelo, de modo que um controle que ficou em um estado não analisável volte a exibir um valor limpo:

```ts
orderForm.amount().reset();
```

## Integração com a validação {#validation-integration}

Os controles exibem o estado de validação, mas não realizam a validação. A validação acontece no schema do formulário — seu controle recebe os signals `invalid()` e `errors()` da diretiva FormField e os exibe (como mostrado no exemplo de StatefulInput acima).

A diretiva FormField também passa os valores das restrições de validação, como `required`, `min`, `max`, `minLength`, `maxLength` e `pattern`. Seu controle pode usá-los para aprimorar a interface:

```ts
export class NumberInput implements FormValueControl<number> {
  value = model<number>(0);

  // Constraint values from schema validation rules
  required = input<boolean>(false);
  min = input<number | undefined>(undefined);
  max = input<number | undefined>(undefined);
}
```

Quando você adiciona as regras de validação `min()` e `max()` ao schema, a diretiva FormField passa esses valores ao seu controle. Use-os para aplicar atributos HTML5 ou mostrar dicas de restrição no template.

IMPORTANT: Não implemente lógica de validação no seu controle. Defina as regras de validação no schema do formulário e deixe o controle exibir os resultados:

```ts {avoid}
// Avoid: Validation in control
export class BadControl implements FormValueControl<string> {
  value = model<string>('');
  isValid() {
    return this.value().length >= 8;
  } // Don't do this!
}
```

```ts {prefer}
// Good: Validation in schema, control displays results
accountForm = form(this.accountModel, (schemaPath) => {
  minLength(schemaPath.password, 8, {message: 'Password must be at least 8 characters'});
});
```

## Tornando os controles reutilizáveis {#making-controls-reusable}

Um controle personalizado geralmente carrega expectativas implícitas sobre validação. Uma entrada de e-mail precisa das regras `required` e `email` em todo formulário que a utiliza. Em vez de depender de cada consumidor declarar essas regras novamente, empacote um schema complementar junto com o controle e exporte os dois do mesmo módulo:

```ts {header: 'email-input.ts'}
import {schema, required, email} from '@angular/forms/signals';

export const emailFieldSchema = schema<string>((path) => {
  required(path, {message: 'Email is required'});
  email(path, {message: 'Enter a valid email address'});
});
```

Um consumidor importa o schema complementar e o compõe ao seu formulário com `apply()`:

```ts {header: 'registration.ts'}
import {form, apply} from '@angular/forms/signals';
import {emailFieldSchema} from './email-input';

registrationForm = form(this.registrationModel, (path) => {
  apply(path.email, emailFieldSchema);
});
```

`apply()` mescla as regras do schema complementar ao formulário pai no caminho especificado. O consumidor ainda pode adicionar mais regras ao mesmo campo, porque `apply()` compõe com as outras regras em vez de substituí-las. Veja o [guia de Schemas](guide/forms/signals/schemas) para a cobertura completa de `schema()`, `apply()` e da composição condicional com `applyWhen()`.

### Considerações de design {#design-considerations}

O modelo do consumidor deve inicializar cada campo com um valor definido. Nos Signal Forms, `undefined` significa a ausência de um campo, e não um valor vazio. Para um controle reutilizável de e-mail, isso significa que o consumidor deve usar `''` como valor inicial, e não deixar a propriedade indefinida. Veja o [guia de Modelos de formulário](guide/forms/signals/models) para detalhes sobre como escolher valores iniciais.

Além disso, os controles não devem registrar os próprios effects para gerenciar o estado. O sistema de formulários gerencia o estado do campo por meio de effects internos. Isso significa que seu controle recebe as atualizações de estado por meio de signals de entrada. Se um controle precisar transformar valores, use `transformedValue()`, como mostrado na seção "[Transformação de valor](#value-transformation)", em vez de um `effect()`.

## Próximos passos {#next-steps}

Este guia abordou a criação de controles personalizados que se integram aos Signal Forms. Guias relacionados exploram outros aspectos dos Signal Forms:

<docs-pill-row>
  <docs-pill href="guide/forms/signals/models" title="Modelos de formulário" />
  <docs-pill href="guide/forms/signals/field-state-management" title="Gerenciamento de estado do campo" />
  <docs-pill href="guide/forms/signals/validation" title="Validação" />
  <!-- <docs-pill href="guide/forms/signals/arrays" title="Trabalhando com arrays" /> -->
</docs-pill-row>
