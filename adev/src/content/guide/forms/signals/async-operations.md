<!-- ia-translate: true -->

# Operações assíncronas

Algumas validações exigem dados de fontes externas, como APIs de backend ou serviços de terceiros. Signal Forms fornece duas funções para validação assíncrona: `validateHttp()` para validação baseada em HTTP e `validateAsync()` para validação personalizada baseada em recurso.

## Quando usar validação assíncrona {#when-to-use-async-validation}

Use validação assíncrona quando sua lógica de validação exigir dados externos. Alguns exemplos comuns incluem:

- **Verificações de unicidade** - Verificar se nomes de usuário ou e-mails já não existem
- **Consultas em banco de dados** - Verificar valores em relação a dados do servidor
- **Validação por API externa** - Validar endereços, CPFs/CNPJs ou outros dados com serviços de terceiros
- **Regras de negócio do servidor** - Aplicar regras de validação que só o servidor pode verificar

Não use validação assíncrona para verificações que você pode fazer de forma síncrona no cliente. Use regras de validação síncronas como `pattern()`, `email()` ou `validate()` para validação de formato e regras estáticas.

## Como a validação assíncrona funciona {#how-async-validation-works}

A validação assíncrona só é executada depois que toda a validação síncrona passa. Enquanto a validação é executada, o signal `pending()` do campo retorna `true`. A validação pode direcionar erros a campos específicos, e as requisições pendentes são canceladas automaticamente quando os valores dos campos mudam.

Veja um exemplo que verifica a disponibilidade de um nome de usuário:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, validateHttp, FormField} from '@angular/forms/signals';

@Component({
  selector: 'app-registration',
  imports: [FormField],
  template: `
    <form>
      <label>
        Username:
        <input [formField]="registrationForm.username" />
      </label>

      @if (registrationForm.username().pending()) {
        <span class="checking">Checking availability...</span>
      }
      @if (registrationForm.username().invalid()) {
        @for (error of registrationForm.username().errors(); track $index) {
          <span class="error">{{ error.message }}</span>
        }
      }
    </form>
  `,
})
export class Registration {
  registrationModel = signal({username: ''});

  registrationForm = form(this.registrationModel, (schemaPath) => {
    validateHttp(schemaPath.username, {
      request: ({value}) => {
        const username = value();
        return username ? `/api/users/check?username=${username}` : undefined;
      },
      onSuccess: (response: {available: boolean}) => {
        return response.available
          ? null
          : {
              kind: 'usernameTaken',
              message: 'Username is already taken',
            };
      },
      onError: (error) => {
        console.error('Validation request failed:', error);
        return {
          kind: 'serverError',
          message: 'Could not verify username availability',
        };
      },
    });
  });
}
```

O fluxo de validação funciona assim:

1. O usuário digita um valor
2. As regras de validação síncronas são executadas primeiro
3. Se a validação síncrona falhar, a validação assíncrona não é executada
4. Se a validação síncrona passar, a validação assíncrona começa e `pending()` passa a ser `true`
5. A requisição é concluída e `pending()` passa a ser `false`
6. Os erros são atualizados com base na resposta

## Validação HTTP com validateHttp() {#http-validation-with-validatehttp}

A função `validateHttp()` oferece a forma mais comum de validação assíncrona. Use-a quando precisar validar contra uma API REST ou qualquer endpoint HTTP.

### Função request {#request-function}

A função `request` retorna uma string de URL ou um objeto `HttpResourceRequest`. Retorne `undefined` para ignorar a validação:

```ts
import {Component, signal} from '@angular/core';
import {form, validateHttp, FormField} from '@angular/forms/signals';

@Component({
  selector: 'app-registration',
  imports: [FormField],
  template: `...`,
})
export class Registration {
  registrationModel = signal({username: ''});

  // Armazena em cache os nomes de usuário que passaram na validação
  private validatedUsernames = new Set<string>();

  registrationForm = form(this.registrationModel, (schemaPath) => {
    validateHttp(schemaPath.username, {
      request: ({value}) => {
        const username = value();
        // Ignora a requisição HTTP se já foi validado
        if (this.validatedUsernames.has(username)) return undefined;

        return `/api/users/check?username=${username}`;
      },
      onSuccess: (response: {available: boolean}, {value}) => {
        if (response.available) {
          // Armazena em cache as validações bem-sucedidas
          this.validatedUsernames.add(value());
          return null;
        }
        return {
          kind: 'usernameTaken',
          message: 'Username is already taken',
        };
      },
      onError: () => ({
        kind: 'serverError',
        message: 'Could not verify username',
      }),
    });
  });
}
```

Para requisições POST ou cabeçalhos personalizados, retorne um objeto `HttpResourceRequest`:

```ts
request: ({value}) => ({
  url: '/api/validate',
  method: 'POST',
  body: {username: value()},
}) // prettier-ignore
```

### Handlers de sucesso e erro {#success-and-error-handlers}

A função `onSuccess` recebe a resposta HTTP e retorna os erros de validação ou `undefined` para valores válidos:

```ts
onSuccess: (response: { valid: boolean; message?: string }) => {
  if (response.valid) return undefined;

  return {
    kind: 'invalid',
    message: response.message || 'Validation failed',
  };
} // prettier-ignore
```

Retorne vários erros quando necessário:

```ts
onSuccess: (response: { usernameTaken: boolean; profanity: boolean }) => {
  const errors = [];
  if (response.usernameTaken) {
    errors.push({
      kind: 'usernameTaken',
      message: 'Username taken',
    });
  }
  if (response.profanity) {
    errors.push({
      kind: 'profanity',
      message: 'Username contains inappropriate content',
    });
  }
  return errors.length > 0 ? errors : undefined;
} // prettier-ignore
```

O tipo de `onSuccess` pode ser especificado diretamente no parâmetro ou com a propriedade `parse` das `options` de `validateHttp`:

```ts
onSuccess: (response: { usernameTaken: boolean; profanity: boolean }) => {
  // ...
} // prettier-ignore

// ou

options: {
  parse: (response) => response as {usernameTaken: boolean; profanity: boolean};
}
onSuccess: (response) => {
  // ...
} // prettier-ignore
```

A função `onError` trata falhas de requisição, como erros de rede ou erros HTTP:

```ts
onError: (error) => {
  console.error('Validation request failed:', error);
  return {
    kind: 'serverError',
    message: 'Could not verify. Please try again later.',
  };
} // prettier-ignore
```

### Opções HTTP {#http-options}

Personalize a requisição HTTP retornando um objeto `HttpResourceRequest` na função `request`:

```ts
import {HttpHeaders} from '@angular/common/http';
import {validateHttp} from '@angular/forms/signals';

validateHttp(schemaPath.field, {
  request: ({value}) => ({
    url: `/api/validate?value=${value()}`,
    headers: new HttpHeaders({
      Authorization: 'Bearer token',
    }),
    timeout: 5000,
  }),
  onSuccess: (response: {valid: boolean}) =>
    response.valid
      ? null
      : {
          kind: 'invalid',
          message: 'Invalid value',
        },
  onError: () => ({
    kind: 'requestFailed',
    message: 'Unable to reach server to validate.',
  }),
});
```

TIP: Consulte a [documentação da API de httpResource](api/common/http/httpResource) para todas as opções disponíveis.

## Validação assíncrona personalizada com validateAsync() {#custom-async-validation-with-validateasync}

A maioria das aplicações deve usar `validateHttp()` para validação assíncrona. Ela lida com requisições HTTP com configuração mínima e cobre a maioria dos casos de uso.

`validateAsync()` é uma API de nível mais baixo que expõe diretamente o primitivo de recurso do Angular. Ela oferece controle completo, mas exige mais código e familiaridade com a API de resource do Angular.

Considere `validateAsync()` apenas quando `validateHttp()` não atender às suas necessidades. Alguns exemplos incluem:

- **Validação não HTTP** - Conexões WebSocket, consultas em IndexedDB ou computações em Web Workers
- **Estratégias de cache personalizadas** - Cache específico da aplicação, além da memoização simples
- **Lógica de retry complexa** - Estratégias de backoff personalizadas ou retries condicionais
- **Acesso direto a resources** - Quando você precisa do ciclo de vida completo do resource

### Criando uma regra de validação personalizada {#creating-a-custom-validation-rule}

A função `validateAsync()` exige quatro propriedades: `params`, `factory`, `onSuccess` e `onError`. A função `params` retorna os parâmetros do seu resource, enquanto `factory` cria o resource:

```ts
import {Component, inject, signal, resource, Signal} from '@angular/core';
import {form, validateAsync, FormField} from '@angular/forms/signals';
import {UsernameValidator} from './username-validator';

@Component({
  selector: 'app-registration',
  imports: [FormField],
  template: `...`,
})
export class Registration {
  registrationModel = signal({username: ''});

  private usernameValidator = inject(UsernameValidator);
  private cache = new Map<string, {available: boolean}>();

  // Factory de resource personalizada com cache
  createUsernameResource = (usernameSignal: Signal<string | undefined>) => {
    return resource({
      params: () => usernameSignal(),
      loader: async ({params: username}) => {
        if (!username) return undefined;

        // Verifica o cache primeiro
        const cached = this.cache.get(username);
        if (cached !== undefined) return cached;

        // Usa o serviço injetado para a validação
        const result = await this.usernameValidator.checkAvailability(username);

        // Armazena o resultado em cache
        this.cache.set(username, result);
        return result;
      },
    });
  };

  registrationForm = form(this.registrationModel, (schemaPath) => {
    validateAsync(schemaPath.username, {
      params: ({value}) => {
        const username = value();
        return username.length >= 3 ? username : undefined!;
      },
      factory: this.createUsernameResource,
      onSuccess: (result) => {
        return result?.available
          ? null
          : {
              kind: 'usernameTaken',
              message: 'Username taken',
            };
      },
      onError: (error) => {
        console.error('Validation failed:', error);
        return {
          kind: 'serverError',
          message: 'Could not verify username',
        };
      },
    });
  });
}
```

A função `params` é executada a cada mudança de valor. Retorne `undefined` para ignorar a validação. A função `factory` é executada uma vez durante a configuração e recebe os parâmetros como um signal. O resource é atualizado automaticamente quando os parâmetros mudam.

### Usando serviços baseados em Observable {#using-observable-based-services}

Se a sua aplicação tiver serviços existentes que retornam Observables, use `rxResource` de `@angular/core/rxjs-interop`:

```ts
import {Component, inject, signal, Signal} from '@angular/core';
import {rxResource} from '@angular/core/rxjs-interop';
import {form, validateAsync, FormField} from '@angular/forms/signals';
import {UsernameService} from './username-service';

@Component({
  selector: 'app-registration',
  imports: [FormField],
  template: `...`,
})
export class Registration {
  registrationModel = signal({username: ''});

  private usernameService = inject(UsernameService);

  private createUsernameResource = (usernameSignal: Signal<string | undefined>) => {
    return rxResource({
      params: () => usernameSignal(),
      stream: ({params: username}) => this.usernameService.checkUsername(username),
    });
  };

  registrationForm = form(this.registrationModel, (schemaPath) => {
    validateAsync(schemaPath.username, {
      params: ({value}) => value(),
      factory: this.createUsernameResource,
      onSuccess: (result) =>
        result?.available ? null : {kind: 'usernameTaken', message: 'Username taken'},
      onError: () => ({
        kind: 'serverError',
        message: 'Could not verify username',
      }),
    });
  });
}
```

A função `rxResource` trabalha diretamente com Observables e cuida automaticamente da limpeza da assinatura quando o valor do campo muda.

## Debouncing {#debouncing}

A regra `debounce` adia o momento em que a entrada do usuário é gravada no model do formulário. Você pode pensar nela como uma regra que segura os valores até o usuário parar de digitar. Isso é útil quando o comportamento posterior não deve reagir a cada tecla, como cálculos derivados caros, validação que pisca erros no meio de uma palavra ou filtros de busca que são reaplicados a cada caractere.

Adicione a regra `debounce` dentro de um schema para adiar quando as mudanças da UI de um campo chegam ao model do formulário. Na forma mais simples, `debounce(path, ms)` mantém cada mudança da UI pelo número de milissegundos informado antes de gravá-la no model. Uma nova mudança dentro dessa janela reinicia o timer.

O exemplo a seguir aplica `debounce` e `validateHttp` ao campo de nome de usuário, para adiar a verificação de disponibilidade em um formulário de cadastro até o usuário parar de digitar:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, debounce, validateHttp, FormField} from '@angular/forms/signals';

@Component({
  selector: 'app-registration',
  imports: [FormField],
  template: `
    <label>
      Username:
      <input [formField]="registrationForm.username" />
    </label>

    @if (registrationForm.username().pending()) {
      <span class="checking">Checking availability...</span>
    }
  `,
})
export class Registration {
  registrationModel = signal({username: ''});

  registrationForm = form(this.registrationModel, (schemaPath) => {
    // Segura as atualizações da UI por 300 ms antes de gravar no model
    debounce(schemaPath.username, 300);

    // Executa com o valor debounced do model, não a cada tecla
    validateHttp(schemaPath.username, {
      request: ({value}) => {
        const username = value();
        // Ignora a requisição para valores em branco
        return username ? `/api/users/check?username=${username}` : undefined;
      },
      onSuccess: (response: {available: boolean}) =>
        response.available ? null : {kind: 'usernameTaken', message: 'Username is already taken'},
      onError: () => ({
        kind: 'serverError',
        message: 'Could not verify username availability',
      }),
    });
  });
}
```

Com um debounce de 300 ms, o model é atualizado e validado somente depois que o usuário para de digitar por mais tempo que a duração configurada. Por exemplo, digitar "signal forms" em uma rajada rápida dispara uma requisição de validação em vez de doze.

### Touch libera o model {#touch-flushes-the-model}

Independentemente da duração do debounce, o framework grava o `controlValue()` do campo no model imediatamente quando o campo fica touched. Campos nativos ficam touched no blur, então um usuário que termina de digitar e sai do campo não precisa esperar o timer do debounce expirar. Controls personalizados podem marcar o campo como touched em resposta a qualquer evento que escolherem.

No caso típico, isso é importante para o envio do formulário. Quando o usuário clica em um botão de envio, o input em foco perde o foco (blur), o que marca o campo como touched e libera seu debounce pendente antes que o handler de envio seja executado.

### Confirmar somente no blur {#commit-only-on-blur}

Alguns campos não devem ser atualizados no meio da digitação. Em vez disso, devem ser atualizados apenas depois que o usuário terminar de digitar o valor. Por exemplo, se você tem um filtro de busca que é reaplicado a cada mudança, ou um formulário que dispara um estado derivado caro, muitas vezes é melhor que o model espere até o usuário terminar de digitar.

Nesses cenários, passe `'blur'` em vez de uma duração para adiar todas as atualizações até o campo ficar touched:

```ts
form(this.registrationModel, (schemaPath) => {
  debounce(schemaPath.username, 'blur');
});
```

Com `'blur'`, o model mantém o valor anterior enquanto o usuário digita. As validações síncronas e assíncronas, os signals derivados e quaisquer regras reativas que leiam o campo veem o valor anterior até que o campo fique touched. Isso ocorre normalmente quando o usuário sai de um input nativo, ou quando um control personalizado sinaliza o touch por conta própria.

### Lógica de tempo personalizada {#custom-timing-logic}

Para lógica de tempo que uma duração ou `'blur'` não consegue expressar, passe uma função `Debouncer`. A função recebe o contexto do campo e um [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal), e retorna uma `Promise<void>` que é resolvida quando o model deve ser atualizado:

```ts
import {debounce, type Debouncer, form} from '@angular/forms/signals';

const shorterWhenLonger: Debouncer<string> = ({value}, abortSignal) => {
  // Consultas mais curtas recebem um atraso maior, já que o usuário provavelmente ainda está digitando.
  const ms = value().length < 3 ? 500 : 200;
  return new Promise((resolve) => {
    const timeoutId = setTimeout(resolve, ms);
    // O abort é disparado quando este campo fica touched ou seu valor muda, então o timer pendente é limpo
    abortSignal.addEventListener(
      'abort',
      () => {
        clearTimeout(timeoutId);
        resolve();
      },
      {once: true},
    );
  });
};

const registrationForm = form(registrationModel, (schemaPath) => {
  debounce(schemaPath.username, shorterWhenLonger);
});
```

O `abortSignal` é disparado quando o campo fica touched ou quando seu valor muda antes que o debounce seja resolvido. Resolva a promise no abort para que seu debouncer libere quaisquer timers pendentes. O framework grava o valor pendente no model no touch e o descarta quando um valor mais recente chega. Consulte a [referência da API de `debounce`](api/forms/signals/debounce) para a assinatura completa de `Debouncer`.

### Aplicando debounce a um único validador assíncrono {#debouncing-a-single-async-validator}

A regra `debounce` segura todas as reações ao campo, desde a validação síncrona até os signals derivados e a validação assíncrona. Porém, há casos em que você quer o oposto: validadores síncronos baratos, como `required` ou `email`, rodando imediatamente para dar feedback instantâneo, enquanto apenas a chamada assíncrona cara espera o usuário parar. Tanto `validateHttp()` quanto `validateAsync()` aceitam sua própria [opção `debounce`](api/forms/signals/validateAsync), que limita apenas esse validador:

```ts
form(this.registrationModel, (schemaPath) => {
  validateHttp(schemaPath.username, {
    // Limita apenas esta chamada HTTP
    debounce: 300,
    request: ({value}) => {
      const username = value();
      // Ignora a requisição para valores em branco
      return username ? `/api/users/check?username=${username}` : undefined;
    },
    onSuccess: (response: {available: boolean}) =>
      response.available ? null : {kind: 'usernameTaken', message: 'Username is already taken'},
    onError: () => ({
      kind: 'serverError',
      message: 'Could not verify username availability',
    }),
  });
});
```

O model ainda é atualizado a cada tecla, e quaisquer outras regras anexadas ao campo continuam reagindo imediatamente. Apenas a requisição HTTP sofre debounce: cada mudança espera 300 ms de silêncio antes de disparar, então uma requisição só é enviada depois que o usuário para de digitar.

Escolha entre as duas camadas com base no escopo:

| Opção | Quando usar |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Regra `debounce()` | Validação síncrona, estado derivado e envio devem esperar até o campo ser confirmado. O campo inteiro não deve reagir no meio da digitação. |
| `validateHttp({ debounce })` ou `validateAsync({ debounce })` | Validadores síncronos baratos devem dar feedback imediato, mas chamadas assíncronas caras devem esperar o usuário pausar. |

As duas opções aceitam uma duração em milissegundos. Seus callbacks de temporização personalizada são diferentes: a regra no nível do formulário recebe um `Debouncer`, e a opção no nível do validador recebe um `DebounceTimer` de `@angular/core`. As duas assinaturas não são intercambiáveis.

## Compondo resources na validação assíncrona com uma factory {#composing-resources-in-async-validation-with-a-factory}

A opção [`debounce`](api/forms/signals/validateAsync) integrada cuida da limitação de frequência, mas `validateAsync()` expõe um ponto de composição mais profundo: a função `factory`. A factory recebe os parâmetros como um signal e retorna um resource. Entre esses dois pontos, você é livre para compor o que precisar.

Na forma mais simples, uma factory envolve um único resource. Uma verificação de disponibilidade de nome de usuário pode viver como um método na classe do component e ser conectada ao `validateAsync` por referência:

```ts
export class Registration {
  registrationModel = signal({username: ''});
  private usernameValidator = inject(UsernameValidator);

  // Função factory
  checkUsernameAvailable = (username: Signal<string | undefined>) =>
    resource({
      params: () => username(),
      loader: async ({params: name}) => this.usernameValidator.checkAvailability(name),
    });

  registrationForm = form(this.registrationModel, (schemaPath) => {
    validateAsync(schemaPath.username, {
      params: ({value}) => {
        const username = value();
        // Ignora a validação para nomes de usuário curtos
        return username.length >= 3 ? username : undefined!;
      },
      debounce: 300,
      // Referência à factory definida acima
      factory: this.checkUsernameAvailable,
      onSuccess: (result) =>
        result?.available ? null : {kind: 'usernameTaken', message: 'Username taken'},
      onError: () => ({kind: 'serverError', message: 'Could not verify'}),
    });
  });
}
```

O callback `params` retorna `undefined` para nomes de usuário curtos, sinalizando que a validação deve ser ignorada. Com `debounce: 300` aplicado, o resource espera o usuário parar de digitar por 300 ms antes de agir em cada mudança. Em seguida, executa o loader para nomes de usuário válidos e permanece ocioso quando o valor debounced se estabiliza em `undefined`.

### Combinando debounce com lógica adicional {#combining-debounce-with-additional-logic}

Quando você precisa de lógica além de um debounce de duração simples, use uma factory personalizada para combinar o debounce com essa lógica. Um caso comum é o cache de respostas validadas. Por exemplo, depois que o servidor confirmou um nome de usuário, você não precisa perguntar de novo nas teclas seguintes que voltam ao mesmo valor.

```ts
export class Registration {
  registrationModel = signal({username: ''});
  private usernameValidator = inject(UsernameValidator);

  registrationForm = form(this.registrationModel, (schemaPath) => {
    validateAsync(schemaPath.username, {
      params: ({value}) => {
        const username = value();
        return username.length >= 3 ? username : undefined;
      },
      factory: (username) => {
        // Primitivo principal: estabiliza 300 ms depois que a origem para de mudar
        const debouncedUsername = debounced(username, 300);
        // O cache fica no closure da factory e persiste pelo tempo de vida do campo
        const cache = new Map<string, {available: boolean}>();
        return resource({
          // Lê do signal debounced, não do signal bruto
          params: () => debouncedUsername.value(),
          loader: async ({params: name}) => {
            const cached = cache.get(name);
            if (cached) return cached;

            const result = await this.usernameValidator.checkAvailability(name);
            cache.set(name, result);
            return result;
          },
        });
      },
      onSuccess: (result) =>
        result?.available ? null : {kind: 'usernameTaken', message: 'Username taken'},
      onError: () => ({
        kind: 'serverError',
        message: 'Could not verify username',
      }),
    });
  });
}
```

O `cache` fica no closure da factory, então persiste pelo tempo de vida do campo. Quando o usuário digita um nome de usuário que o servidor já verificou, o loader lê do cache em vez de fazer uma nova requisição de rede.

## Entendendo o estado pending {#understanding-pending-state}

Quando a validação assíncrona está em execução, o signal `pending()` do campo retorna `true`. Durante esse período:

- `valid()` retorna `false`
- `invalid()` retorna `false`
- `errors()` retorna um array vazio
- `submit()` não aguarda a validação; por padrão, a `action` é executada mesmo assim (consulte [`ignoreValidators`](guide/forms/signals/form-submission#controlling-validation-gating-with-ignorevalidators))

Mostre o estado pending no template para dar feedback ao usuário:

```angular-html
<input [formField]="loginForm.username" />

@if (loginForm.username().pending()) {
  <span class="loading">Checking availability...</span>
}

@if (loginForm.username().touched() && loginForm.username().invalid()) {
  @for (error of loginForm.username().errors(); track $index) {
    <span class="error">{{ error.message }}</span>
  }
}
```

Desabilite o envio do formulário enquanto a validação estiver pendente:

```angular-html
<button type="submit" [disabled]="loginForm().pending()">
  @if (loginForm().pending()) {
    Validating...
  } @else {
    Submit
  }
</button>
```

TIP: Consulte o [guia de Gerenciamento de estado de campos](guide/forms/signals/field-state-management) para mais padrões usando os signals `pending()`, `valid()` e `invalid()`.

### Ordem de execução da validação {#validation-execution-order}

A validação assíncrona só é executada depois que a validação síncrona passa. Isso evita requisições desnecessárias ao servidor para entradas inválidas:

```ts
import {form, required, minLength, validateHttp} from '@angular/forms/signals';
import {model} from '@angular/core';

form(model, (schemaPath) => {
  // 1. Estas regras de validação síncronas são executadas primeiro
  required(schemaPath.username);
  minLength(schemaPath.username, 3);

  // 2. Esta regra de validação assíncrona só é executada se a validação síncrona passar
  validateHttp(schemaPath.username, {
    request: ({value}) => `/api/check?username=${value()}`,
    onSuccess: (result: {valid: boolean}) =>
      result.valid
        ? null
        : {
            kind: 'usernameTaken',
            message: 'Username taken',
          },
    onError: () => ({
      kind: 'serverError',
      message: 'Validation failed',
    }),
  });
});
```

Essa ordem de execução melhora o desempenho, reduzindo a carga no servidor e detectando erros de formato instantaneamente.

### Cancelamento de requisições {#request-cancellation}

Quando o valor de um campo muda, o Signal Forms cancela automaticamente qualquer requisição de validação assíncrona pendente para esse campo. Isso evita condições de corrida e garante que a validação sempre reflita o valor atual. Você não precisa implementar a lógica de cancelamento por conta própria.

## Boas práticas {#best-practices}

### Combine com validação síncrona {#combine-with-synchronous-validation}

Sempre valide o formato antes de fazer requisições assíncronas. Isso detecta erros instantaneamente e evita requisições desnecessárias ao servidor:

```ts
import {form, required, email, validateHttp} from '@angular/forms/signals';
import {model} from '@angular/core';

form(model, (schemaPath) => {
  // Valide o formato primeiro
  required(schemaPath.email);
  email(schemaPath.email);

  // Depois verifique a disponibilidade
  validateHttp(schemaPath.email, {
    request: ({value}) => `/api/emails/check?email=${value()}`,
    onSuccess: (result: {available: boolean}) =>
      result.available
        ? null
        : {
            kind: 'emailInUse',
            message: 'Email already in use',
          },
    onError: () => ({
      kind: 'serverError',
      message: 'Could not verify email',
    }),
  });
});
```

### Ignore a validação quando apropriado {#skip-validation-when-appropriate}

Retorne `undefined` da função `request` para ignorar a validação. Use isso para evitar validar campos vazios ou valores que não atendem aos requisitos mínimos:

```ts
import {validateHttp} from '@angular/forms/signals';

validateHttp(schemaPath.username, {
  request: ({value}) => {
    const username = value();
    // Ignora a validação para nomes de usuário vazios ou curtos
    if (!username || username.length < 3) return undefined;

    return `/api/users/check?username=${username}`;
  },
  onSuccess: (result: {valid: boolean}) =>
    result.valid
      ? null
      : {
          kind: 'usernameTaken',
          message: 'Username taken',
        },
  onError: () => ({
    kind: 'serverError',
    message: 'Validation failed',
  }),
});
```

### Trate erros com elegância {#handle-errors-gracefully}

Forneça mensagens de erro claras e amigáveis ao usuário. Registre os detalhes técnicos para depuração, mas mostre mensagens simples aos usuários:

```ts
import {validateHttp} from '@angular/forms/signals';

validateHttp(schemaPath.field, {
  request: ({value}) => `/api/validate?field=${value()}`,
  onSuccess: (result: {valid: boolean; message?: string}) => {
    if (result.valid) return null;
    // Usa a mensagem do servidor quando disponível
    return {
      kind: 'serverError',
      message: result.message || 'Validation failed',
    };
  },
  onError: (error) => {
    // Registra para depuração
    console.error('Validation request failed:', error);

    // Mostra uma mensagem amigável ao usuário
    return {
      kind: 'serverError',
      message: 'Unable to validate. Please try again later.',
    };
  },
});
```

### Mostre um feedback claro {#show-clear-feedback}

Use o signal `pending()` para mostrar quando a validação está em andamento. Isso ajuda o usuário a entender os atrasos e melhora a percepção de desempenho:

```angular-html
@if (field().pending()) {
  <span class="checking">
    <span class="spinner"></span>
    Checking...
  </span>
}
@if (field().valid() && !field().pending()) {
  <span class="success">Available</span>
}
@if (field().invalid()) {
  <span class="error">{{ field().errors()[0]?.message }}</span>
}
```

## Próximos passos {#next-steps}

Este guia abordou a validação assíncrona com `validateHttp()` e `validateAsync()`. Guias relacionados exploram outros aspectos do Signal Forms:

<docs-pill-row>
  <docs-pill href="guide/forms/signals/validation" title="Validação"/>
  <docs-pill href="guide/forms/signals/field-state-management" title="Gerenciamento de estado de campos"/>
</docs-pill-row>

Para a documentação detalhada da API, consulte:

- [`validateHttp()`](api/forms/signals/validateHttp) - Validação assíncrona baseada em HTTP
- [`validateAsync()`](api/forms/signals/validateAsync) - Validação assíncrona personalizada baseada em resource
- [`httpResource()`](api/common/http/httpResource) - API de HTTP resource do Angular
- [`resource()`](api/core/resource) - Primitivo de resource do Angular
