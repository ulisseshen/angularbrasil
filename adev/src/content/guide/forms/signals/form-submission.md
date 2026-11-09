<!-- ia-translate: true -->
# Envio de formulário {#form-submission}

Quando um usuário envia um formulário, sua aplicação normalmente precisa tratar várias questões ao mesmo tempo: exibir erros de validação, impedir o envio duplicado, enviar os dados para um servidor e muito mais. Tratar cada uma dessas questões manualmente pode ser trabalhoso e propenso a erros.

O Signal Forms fornece uma função `submit()` que ajuda a gerenciar o ciclo de vida do envio do formulário. Este guia mostra como usá-la.

## O que o `submit()` faz? {#what-does-submit-do}

A função `submit()` segue uma sequência específica:

1. **Marca os campos interativos como touched**: os campos que exibem erros somente depois de tocados agora mostrarão seus erros de validação. Campos ocultos, desabilitados e somente leitura são ignorados.
1. **Verifica a validação**: se alguma regra de validação tiver falhado, o envio para e a função `action` não é executada.
1. **Executa a ação**: a função `action` é executada com o valor atual do formulário. Enquanto ela roda, `submitting()` retorna `true`.
1. **Trata o resultado**: se a ação retornar erros, eles são direcionados aos seus campos de destino. Se não retornar nada, o envio é considerado bem-sucedido.

A função `submit()` retorna uma `Promise<boolean>` que é resolvida como `true` quando a ação é concluída sem erros, e como `false` quando a validação falha, quando a ação retorna erros ou quando já há um envio em andamento. Se a ação lançar uma exceção, a promise é rejeitada com esse erro.

## Configurando o envio de formulário com `FormRoot` {#setting-up-form-submission-with-formroot}

A forma mais comum de usar a função `submit()` é por meio da diretiva `FormRoot`.

A diretiva `FormRoot` cuida de três coisas automaticamente quando é vinculada a um elemento `<form>`:

1. **Define [`novalidate`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Reference/Elements/form#novalidate)**: desativa a validação integrada do navegador, para que o Signal Forms gerencie a validação
1. **Previne o comportamento padrão**: impede que o navegador navegue ao enviar o formulário
1. **Chama `submit()`**: dispara o fluxo de envio quando o usuário envia o formulário, se o formulário foi criado com a opção `submission`

NOTE: A diretiva `FormRoot` define o atributo `novalidate` no elemento `form` automaticamente. Você não precisa adicioná-lo manualmente ao usar `FormRoot`.

`FormRoot` trata o evento de envio, mas você ainda precisa dizer _o que fazer_ com os dados do formulário. Para isso, são necessárias três coisas:

1. Vincular o seu formulário à diretiva `FormRoot`
1. Passar uma opção `submission` para a função `form()`
1. Definir uma função `action` dentro da opção `submission` que gerencie os dados enviados

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, FormRoot, required} from '@angular/forms/signals';

@Component({
  selector: 'app-contact',
  imports: [FormField, FormRoot],
  template: `
    <form [formRoot]="contactForm">
      <label>
        Nome
        <input [formField]="contactForm.name" />
      </label>

      <label>
        E-mail
        <input type="email" [formField]="contactForm.email" />
      </label>

      <button type="submit">Enviar</button>
    </form>
  `,
})
export class Contact {
  contactModel = signal({
    name: '',
    email: '',
  });

  contactForm = form(
    this.contactModel,
    (schemaPath) => {
      required(schemaPath.name);
      required(schemaPath.email);
    },
    {
      submission: {
        action: async (field) => {
          const result = await saveContact(field().value());
          if (result.ok) return;

          return {kind: 'serverError', message: 'Falha ao enviar o formulário'};
        },
      },
    },
  );
}
```

A função `action` é executada somente quando nenhuma regra de validação falhou. Por padrão, validadores assíncronos pendentes não bloqueiam o envio (veja [Controlando o bloqueio por validação com `ignoreValidators`](#controlling-validation-gating-with-ignorevalidators) para mais detalhes). A ação recebe a árvore de campos e um objeto `detail` com as árvores de campos `root` e `submitted`, o que é útil ao enviar um subformulário.

Depois que a validação passa, a própria ação ainda pode falhar, por exemplo, devido a um erro de rede ou a uma entrada duplicada. Nesses casos, você pode exibir a falha retornando o(s) erro(s). Por outro lado, para indicar sucesso, basta retornar `null` ou `undefined`, ou fazer um `return` vazio.

## Mostrando o estado do envio com `submitting()` {#showing-submission-state-with-submitting}

Quando você precisa acompanhar se o formulário está em processo de envio, o Signal Forms fornece um signal `submitting()` que retorna `true` enquanto a função `action` está em execução. Use-o para mostrar indicadores de carregamento ou desabilitar o botão de envio e evitar envios duplicados.

```angular-html
<button type="submit" [disabled]="contactForm().submitting()">
  @if (contactForm().submitting()) {
    Enviando...
  } @else {
    Enviar
  }
</button>
```

Assim que a função `action` tiver sucesso ou retornar um erro, o signal `submitting()` volta automaticamente para `false`.

## Gerenciando erros de envio {#managing-submission-errors}

### Erros do servidor {#server-errors}

Quando a sua função `action` se comunica com um servidor, o servidor pode retornar erros que precisam aparecer em campos específicos. Retorne esses erros a partir da `action` para direcioná-los aos seus campos de destino.

#### Erros no campo enviado {#errors-on-the-submitted-field}

Por padrão, os erros retornados pela `action` são atribuídos ao campo enviado (a árvore de campos que você passou para `submit()`):

```ts
action: async (field) => {
  const result = await saveContact(field().value());
  if (result.ok) return;

  return {kind: 'serverError', message: 'Falha ao enviar o formulário'};
};
```

#### Erros em campos específicos {#errors-on-specific-fields}

Quando você quer direcionar um erro a um campo específico, inclua uma propriedade `fieldTree` apontando para esse campo:

```ts
action: async (field) => {
  const result = await saveContact(field().value());
  if (result.ok) return;

  return {kind: 'taken', message: result.message, fieldTree: field.email};
};
```

#### Múltiplos erros {#multiple-errors}

Quando você quer informar erros em vários campos, retorne um array:

```ts
action: async (field) => {
  const result = await registerUser(field().value());
  if (result.ok) return;

  return result.errors.map((err: {field: string; message: string}) => ({
    kind: 'serverError',
    message: err.message,
    fieldTree: field[err.field as keyof typeof field],
  }));
};
```

### Limpeza automática de erros de envio {#auto-clearing-submission-errors}

Os erros de envio são limpos automaticamente quando o usuário edita o campo. Se a `action` retornar um erro no campo de e-mail, esse erro desaparece assim que o usuário alterar o valor do e-mail.

Isso difere dos erros de validação, que são recalculados de forma reativa. As regras de validação são executadas novamente a cada alteração e podem produzir o mesmo erro. Os erros de envio são resultados pontuais do servidor: depois de limpos, não reaparecem, a menos que o formulário seja enviado novamente.

TIP: Os erros de envio aparecem junto com os erros de validação no signal `errors()` do campo. Para orientações sobre como exibir erros no template, consulte o [guia de Gerenciamento do estado de campos](guide/forms/signals/field-state-management).

## Tratando envios inválidos com `onInvalid` {#handling-invalid-submissions-with-oninvalid}

Quando a validação falha, a função `action` não é executada. Se você precisar responder a uma tentativa de envio que falhou, como rolar até o primeiro erro, exibir uma notificação ou focar um campo inválido, use o callback `onInvalid`.

```ts
contactForm = form(
  this.contactModel,
  (schemaPath) => {
    required(schemaPath.name);
    required(schemaPath.email);
  },
  {
    submission: {
      action: async (field) => {
        await saveContact(field().value());
      },
      onInvalid: (field) => {
        const firstError = field().errorSummary()[0];
        firstError?.fieldTree().focusBoundControl();
      },
    },
  },
);
```

O callback `onInvalid` recebe os mesmos parâmetros `(field, detail)` que a `action`. Ele é executado depois que todos os campos interativos são marcados como touched, então os erros de validação já estão visíveis na interface quando ele roda.

## Controlando o bloqueio por validação com `ignoreValidators` {#controlling-validation-gating-with-ignorevalidators}

Por padrão, `submit()` ignora os validadores pendentes. Se nenhum validador tiver falhado, a ação é executada mesmo que alguns validadores assíncronos ainda estejam em andamento. A opção `ignoreValidators` permite controlar esse comportamento.

| Valor       | Comportamento                                                                              |
| ----------- | ------------------------------------------------------------------------------------------ |
| `'pending'` | Envia se nenhum validador tiver falhado, mesmo que alguns estejam pendentes (padrão)       |
| `'none'`    | Envia somente se todos os validadores passarem: validadores pendentes bloqueiam o envio     |
| `'all'`     | Sempre envia, independentemente do estado da validação                                     |

```ts
contactForm = form(
  this.contactModel,
  (schemaPath) => {
    required(schemaPath.name);
    required(schemaPath.email);
  },
  {
    submission: {
      action: async (field) => {
        await saveContact(field().value());
      },
      ignoreValidators: 'none',
    },
  },
);
```

Use `'none'` quando seu formulário tiver validadores assíncronos (como a verificação de disponibilidade de um nome de usuário) e você precisar que toda a validação seja concluída antes do envio. Use `'all'` em cenários de salvamento de rascunhos, em que você quer persistir os dados independentemente do estado da validação.

## Envio manual com `submit()` {#manual-submission-with-submit}

A diretiva `FormRoot` é a forma mais comum de disparar o envio, mas você também pode chamar `submit()` diretamente. Isso é útil em assistentes de várias etapas, salvamento automático ou quando o envio é disparado de fora do elemento do formulário.

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, required, submit} from '@angular/forms/signals';

@Component({
  selector: 'app-contact',
  imports: [FormField],
  template: `
    <label>
      Nome
      <input [formField]="contactForm.name" />
    </label>

    <label>
      E-mail
      <input type="email" [formField]="contactForm.email" />
    </label>

    <button (click)="onSave()">Salvar</button>
  `,
})
export class Contact {
  contactModel = signal({
    name: '',
    email: '',
  });

  contactForm = form(this.contactModel, (schemaPath) => {
    required(schemaPath.name);
    required(schemaPath.email);
  });

  async onSave() {
    // Ao chamar `submit()` diretamente, você passa a ação como segundo argumento
    // em vez de configurá-la em `FormOptions`.
    const success = await submit(this.contactForm, async (field) => {
      const result = await saveContact(field().value());
      if (result.ok) return;

      return {kind: 'serverError', message: 'Falha ao salvar'};
    });

    if (success) {
      // Trata o sucesso: navega, mostra uma confirmação etc.
    }
  }
}
```

## Tratando efeitos colaterais {#handling-side-effects}

A função `submit()` retorna uma `Promise<boolean>`: `true` quando a ação é concluída sem erros, `false` quando a validação falha, quando a ação retorna erros ou quando já há um envio em andamento. Se a ação lançar uma exceção, a promise é rejeitada. Use isso para disparar efeitos colaterais como navegação ou notificações.

```ts
async onSave() {
  const success = await submit(this.contactForm, async (field) => {
    await saveContact(field().value());
  });

  if (success) {
    await this.router.navigate(['/confirmation']);
  }
}
```

Quando a ação produz dados de que um efeito colateral precisa, como um ID gerado pelo servidor, trate o efeito colateral dentro da própria ação:

```ts
async onSave() {
  await submit(this.contactForm, async (field) => {
    const contact = await createContact(field().value());
    await this.router.navigate(['/confirmation', contact.id]);
  });
}
```

Ao usar `FormRoot`, os efeitos colaterais também ficam dentro da `action`, já que `FormRoot` chama `submit()` internamente:

```ts
submission: {
  action: async (field) => {
    const result = await saveContact(field().value());
    if (result.ok) {
      await this.router.navigate(['/confirmation']);
      return;
    }

    return {kind: 'serverError', message: 'Falha ao enviar o formulário'};
  },
}
```

## Envios concorrentes {#concurrent-submissions}

Quando um envio está em andamento, chamadas subsequentes de `submit()` para o mesmo formulário ou para qualquer um dos seus descendentes retornam `false` imediatamente, sem executar a ação. Isso evita envios duplicados e efeitos colaterais repetidos caso o usuário dispare a ação de envio várias vezes rapidamente.

## Próximos passos {#next-steps}

Este guia abordou o envio de formulários e o tratamento de erros de envio. Guias relacionados exploram outros aspectos do Signal Forms:

<docs-pill-row>
  <docs-pill href="guide/forms/signals/validation" title="Validação" />
  <docs-pill href="guide/forms/signals/field-state-management" title="Gerenciamento do estado de campos" />
  <docs-pill href="guide/forms/signals/form-logic" title="Adicionando lógica ao formulário" />
</docs-pill-row>
