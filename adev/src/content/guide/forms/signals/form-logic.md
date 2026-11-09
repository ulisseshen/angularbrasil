<!-- ia-translate: true -->
# Adicionando lógica ao formulário {#adding-form-logic}

O Signal Forms permite adicionar lógica ao seu formulário usando schemas. A lógica de validação é abordada no [guia de Validação](guide/forms/signals/validation), e este guia trata de outras regras disponíveis nos schemas. Você pode desabilitar campos condicionalmente, ocultá-los com base em outros valores, torná-los somente leitura, aplicar debounce à entrada do usuário e anexar metadados para controles personalizados.

Este guia mostra como usar regras como `disabled()`, `hidden()`, `readonly()`, `debounce()` e `metadata()` para controlar o comportamento dos campos.

## Quando adicionar lógica ao formulário {#when-to-add-form-logic}

Use regras quando o comportamento de um campo depender dos valores de outros campos ou precisar ser atualizado de forma reativa. Por exemplo:

- Um campo de cupom de desconto que fica desabilitado quando o total do pedido é baixo
- Um campo de endereço que fica oculto, a menos que a entrega seja necessária
- Um campo de busca que aplica debounce para reduzir chamadas à API

## Como as regras funcionam {#how-rules-work}

As regras vinculam lógica reativa a campos específicos do seu formulário. A maioria das regras condicionais aceita um objeto de opções com uma função `when`. A função `when` é recalculada automaticamente sempre que os signals que ela referencia mudam, assim como um `computed`.

```ts
const orderForm = form(this.orderModel, (schemaPath) => {
  disabled(schemaPath.couponCode, {when: ({valueOf}) => valueOf(schemaPath.total) < 50});
  //~~~~~~ ~~~~~~~~~~~~~~~~~~~~~  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //regra   caminho                 função de lógica reativa
});
```

As funções de lógica reativa recebem um objeto `FieldContext`, que fornece acesso aos valores e ao estado dos campos por meio de funções auxiliares como `valueOf()` e `stateOf()`. Ele costuma ser desestruturado para acessar essas funções diretamente.

NOTE: O parâmetro de callback do schema (`schemaPath` nestes exemplos) é um objeto `SchemaPathTree` que fornece caminhos para todos os campos do seu formulário. Você pode dar a esse parâmetro o nome que quiser.

Para detalhes completos sobre as propriedades e os métodos de `FieldContext`, consulte o [guia de Validação](guide/forms/signals/validation).

## Impedir atualizações de campo com `disabled()` {#prevent-field-updates-with-disabled}

A regra `disabled()` configura o estado desabilitado de um campo.

Ela funciona com a diretiva `[formField]` para vincular automaticamente o atributo `disabled` com base no estado do campo, então você não precisa adicionar manualmente `[disabled]="yourForm.fieldName().disabled()"` ao template.

NOTE: Campos desabilitados ignoram a validação: eles não participam das verificações de validação do formulário. O valor do campo é preservado, mas não é validado. Para detalhes sobre o comportamento da validação, consulte o [guia de Validação](guide/forms/signals/validation).

### Sempre desabilitado {#always-disabled}

Para desabilitar um campo permanentemente, chame `disabled()` apenas com o caminho do campo:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, disabled} from '@angular/forms/signals';

@Component({
  selector: 'app-settings',
  imports: [FormField],
  template: `
    <label>
      ID do sistema (não pode ser alterado)
      <input [formField]="settingsForm.systemId" />
    </label>
  `,
})
export class Settings {
  settingsModel = signal({
    systemId: 'SYS-12345',
    userName: '',
  });

  settingsForm = form(this.settingsModel, (schemaPath) => {
    disabled(schemaPath.systemId);
  });
}
```

### Desabilitação condicional {#conditional-disabling}

Para desabilitar um campo com base em condições, forneça uma função `when` que retorne `true` (desabilitado) ou `false` (habilitado):

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, disabled} from '@angular/forms/signals';

@Component({
  selector: 'app-order',
  imports: [FormField],
  template: `
    <label>
      Total do pedido
      <input type="number" [formField]="orderForm.total" />
    </label>

    <label>
      Cupom de desconto
      <input [formField]="orderForm.couponCode" />
    </label>
  `,
})
export class Order {
  orderModel = signal({
    total: 25,
    couponCode: '',
  });

  orderForm = form(this.orderModel, (schemaPath) => {
    disabled(schemaPath.couponCode, {when: ({valueOf}) => valueOf(schemaPath.total) < 50});
  });
}
```

Neste exemplo, quando o total do pedido é menor que R$ 50, o campo de cupom de desconto fica desabilitado.

### Motivos de desabilitação {#disabled-reasons}

Ao desabilitar um campo, forneça explicações para o usuário retornando uma string em vez de `true`:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, disabled} from '@angular/forms/signals';

@Component({
  selector: 'app-order',
  imports: [FormField],
  template: `
    <label>
      Total do pedido
      <input type="number" [formField]="orderForm.total" />
    </label>

    <label>
      Cupom de desconto
      <input [formField]="orderForm.couponCode" />
    </label>

    @if (orderForm.couponCode().disabled()) {
      <div class="info">
        @for (reason of orderForm.couponCode().disabledReasons(); track reason) {
          <p>{{ reason.message }}</p>
        }
      </div>
    }
  `,
})
export class Order {
  orderModel = signal({
    total: 25,
    couponCode: '',
  });

  orderForm = form(this.orderModel, (schemaPath) => {
    disabled(schemaPath.couponCode, {
      when: ({valueOf}) =>
        valueOf(schemaPath.total) < 50 ? 'O pedido precisa ser de R$ 50 ou mais para usar um cupom' : false,
    });
  });
}
```

A função `when` retorna:

- Uma **string** para desabilitar o campo com um motivo
- `false` para habilitar o campo (não apenas qualquer valor falsy: use `false` explicitamente)

Acesse os motivos pelo signal `disabledReasons()` no estado do campo. Cada motivo tem uma propriedade `message` que contém a string retornada.

#### Múltiplos motivos de desabilitação {#multiple-disabled-reasons}

Você também pode chamar `disabled()` várias vezes no mesmo campo, e todos os motivos retornados se acumulam:

```angular-ts
orderForm = form(this.orderModel, (schemaPath) => {
  disabled(schemaPath.promoCode, {
    when: ({valueOf}) =>
      !valueOf(schemaPath.hasAccount) ? 'Você precisa ter uma conta para usar códigos promocionais' : false,
  });
  disabled(schemaPath.promoCode, {
    when: ({valueOf}) => (valueOf(schemaPath.total) < 25 ? 'O pedido deve ser de pelo menos R$ 25' : false),
  });
});
```

Se as duas condições forem verdadeiras, o campo exibe os dois motivos de desabilitação. Esse padrão é útil para regras de disponibilidade complexas que você quer manter separadas.

## Configurando o estado `hidden()` nos campos {#configuring-hidden-state-on-fields}

A regra `hidden()` configura o estado oculto de um campo. No entanto, ela define apenas um estado programático. **Você controla se o campo aparece na interface**.

IMPORTANT: Diferente de `disabled` e `readonly`, não existe uma propriedade nativa do DOM para o estado `hidden`. A diretiva `[formField]` não aplica o atributo `hidden` aos elementos. Você precisa usar `@if` ou CSS no template para renderizar campos condicionalmente com base no estado `hidden()`.

NOTE: Assim como os campos desabilitados, os campos ocultos também ignoram a validação. Consulte o [guia de Validação](guide/forms/signals/validation) para detalhes.

### Ocultação básica de campo {#basic-field-hiding}

Use `hidden()` com uma função `when` que retorne `true` (oculto) ou `false` (visível):

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, hidden} from '@angular/forms/signals';

@Component({
  selector: 'app-profile',
  imports: [FormField],
  template: `
    <label>
      <input type="checkbox" [formField]="profileForm.isPublic" />
      Tornar o perfil público
    </label>

    @if (!profileForm.publicUrl().hidden()) {
      <label>
        URL pública
        <input [formField]="profileForm.publicUrl" />
      </label>
    }
  `,
})
export class Profile {
  profileModel = signal({
    isPublic: false,
    publicUrl: '',
  });

  profileForm = form(this.profileModel, (schemaPath) => {
    hidden(schemaPath.publicUrl, {when: ({valueOf}) => !valueOf(schemaPath.isPublic)});
  });
}
```

### Sempre oculto {#always-hidden}

Para tornar um campo permanentemente oculto, chame `hidden()` apenas com o caminho do campo:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, hidden} from '@angular/forms/signals';

@Component({
  selector: 'app-profile',
  imports: [FormField],
  template: `
    <label>
      <input type="checkbox" [formField]="profileForm.isPublic" />
      Tornar o perfil público
    </label>

    <!-- O publicUrl está permanentemente oculto, então este bloco nunca é renderizado -->
    @if (!profileForm.publicUrl().hidden()) {
      <label>
        URL pública
        <input [formField]="profileForm.publicUrl" />
      </label>
    }
  `,
})
export class Profile {
  profileModel = signal({
    isPublic: false,
    publicUrl: '',
  });

  profileForm = form(this.profileModel, (schemaPath) => {
    // Este campo agora está permanentemente oculto e fica excluído da validação ativa
    hidden(schemaPath.publicUrl);
  });
}
```

## Exibindo campos não editáveis com `readonly()` {#display-uneditable-fields-with-readonly}

A regra `readonly()` impede que o usuário altere um campo. A diretiva `[FormField]` vincula automaticamente esse estado ao atributo HTML `readonly`, que impede a edição, mas ainda permite que o usuário foque o campo e selecione o texto.

NOTE: Campos somente leitura ignoram a [validação](guide/forms/signals/validation).

### Sempre somente leitura {#always-readonly}

Para tornar um campo permanentemente somente leitura, chame `readonly()` apenas com o caminho do campo:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, readonly} from '@angular/forms/signals';

@Component({
  selector: 'app-account',
  imports: [FormField],
  template: `
    <label>
      Nome de usuário (não pode ser alterado)
      <input [formField]="accountForm.username" />
    </label>

    <label>
      E-mail
      <input [formField]="accountForm.email" />
    </label>
  `,
})
export class Account {
  accountModel = signal({
    username: 'johndoe',
    email: 'john@example.com',
  });

  accountForm = form(this.accountModel, (schemaPath) => {
    readonly(schemaPath.username);
  });
}
```

A diretiva `[FormField]` vincula automaticamente o atributo `readonly` com base no estado do campo.

### Somente leitura condicional {#conditional-readonly}

Para tornar um campo somente leitura com base em condições, forneça uma função `when`:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, readonly} from '@angular/forms/signals';

@Component({
  selector: 'app-document',
  imports: [FormField],
  template: `
    <label>
      <input type="checkbox" [formField]="documentForm.isLocked" />
      Bloquear documento
    </label>

    <label>
      Título do documento
      <input [formField]="documentForm.title" />
    </label>
  `,
})
export class Document {
  documentModel = signal({
    isLocked: false,
    title: 'Sem título',
  });

  documentForm = form(this.documentModel, (schemaPath) => {
    readonly(schemaPath.title, {when: ({valueOf}) => valueOf(schemaPath.isLocked)});
  });
}
```

Quando `isLocked` é `true`, o campo de título se torna somente leitura.

## Escolhendo entre hidden, disabled e readonly {#choose-between-hidden-disabled-and-readonly}

Estas três funções de configuração controlam a disponibilidade dos campos de maneiras diferentes:

Escolha `hidden()` quando o campo:

- Não deve aparecer na interface de forma alguma
- É irrelevante para o estado atual do formulário
- Exemplo: campos de endereço de entrega quando "igual ao de cobrança" está marcado

Escolha `disabled()` quando o campo:

- Deve ficar visível, mas não editável
- Precisa mostrar por que está indisponível (usando motivos de desabilitação)
- Deve ser excluído do envio do formulário HTML
- Exemplo: botão de envio desabilitado até que o formulário seja válido, campos de aprovação desabilitados para usuários que não são administradores

Escolha `readonly()` quando o campo:

- Deve ficar visível, mas não editável
- Contém dados que o usuário precisa ver, selecionar ou copiar
- Deve ser incluído no envio do formulário HTML
- Exemplo: número de confirmação do pedido, códigos de referência gerados pelo sistema

Todos os três ignoram a validação e impedem a edição do usuário enquanto estiverem ativos. As diferenças principais são:

| Característica                       | `hidden()` | `disabled()` | `readonly()` |
| ------------------------------------ | ---------- | ------------ | ------------ |
| Visível na interface                 | Não        | Sim          | Sim          |
| O usuário pode focar/selecionar      | Não        | Não          | Sim          |
| Incluído no envio do formulário HTML | Não        | Não          | Sim          |

## Atrasando operações de entrada com `debounce()` {#delay-input-operations-with-debounce}

A regra `debounce()` atrasa a atualização do model do formulário. Isso é útil para otimização de desempenho e para reduzir operações desnecessárias durante a digitação rápida.

### O que o debounce faz {#what-debouncing-does}

Sem debounce, cada tecla pressionada atualiza imediatamente o model do formulário. Isso pode disparar:

- Signals computados caros que são recalculados a cada alteração
- Verificações de validação após cada caractere
- Chamadas de API ou outros efeitos colaterais ligados ao valor do model

O debounce adia essas atualizações e reduz o trabalho desnecessário.

### Debounce básico {#basic-debouncing}

Você pode aplicar debounce a um campo especificando um atraso em milissegundos:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, debounce} from '@angular/forms/signals';

@Component({
  selector: 'app-search',
  imports: [FormField],
  template: `
    <label>
      Pesquisar
      <input [formField]="searchForm.query" />
    </label>

    <p>Pesquisando por: {{ searchForm.query().value() }}</p>
  `,
})
export class Search {
  searchModel = signal({
    query: '',
  });

  searchForm = form(this.searchModel, (schemaPath) => {
    debounce(schemaPath.query, 300);
  });
}
```

Com um debounce de 300 ms:

- O usuário digita no campo de entrada
- O model do formulário só é atualizado após 300 ms sem digitação
- Se o usuário continuar digitando, o temporizador é reiniciado a cada tecla
- Quando o usuário pausa por 300 ms, o model é atualizado com o valor final

### Garantias de tempo {#timing-guarantees}

A função `debounce()` garante que os usuários não percam dados por meio destes mecanismos:

- **Quando marcado como touched:** o valor é sincronizado imediatamente, cancelando qualquer atraso de debounce pendente. Isso acontece quando o campo perde o foco (blur) ou quando ele é explicitamente marcado como touched.
- **No envio do formulário:** todos os campos são marcados como touched antes da validação, o que garante que todos os valores com debounce sejam sincronizados imediatamente.

Isso significa que os usuários podem digitar rapidamente, sair do campo ou enviar o formulário sem esperar que os atrasos de debounce expirem.

### Lógica de debounce personalizada {#custom-debounce-logic}

Para um controle mais avançado, forneça uma função debouncer que controle quando sincronizar o valor. Essa função é chamada toda vez que o valor do controle é atualizado e pode retornar `undefined` para sincronizar imediatamente, ou uma Promise que impede a sincronização até que ela seja resolvida:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, debounce} from '@angular/forms/signals';

@Component({
  selector: 'app-search',
  imports: [FormField],
  template: `
    <label>
      Pesquisar
      <input [formField]="searchForm.query" />
    </label>
  `,
})
export class Search {
  searchModel = signal({
    query: '',
  });

  searchForm = form(this.searchModel, (schemaPath) => {
    debounce(schemaPath.query, () => {
      // Retorna uma promise que é resolvida após 500 ms
      return new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 500);
      });
    });
  });
}
```

A função debouncer pode retornar:

- `undefined` para sincronizar o valor imediatamente
- Uma `Promise<void>` que impede a sincronização até que ela seja resolvida

Casos de uso para lógica de debounce personalizada:

- Implementar uma lógica de tempo personalizada, além de atrasos simples
- Coordenar a sincronização com eventos externos
- Debounce condicional com base no estado da aplicação

### Quando usar debounce {#when-to-use-debouncing}

O debounce é mais útil quando:

- Você tem signals computados caros que dependem do valor do campo
- O campo dispara chamadas de API ou outros efeitos colaterais
- Você quer reduzir a sobrecarga de validação durante a digitação rápida
- A análise de desempenho mostra que as atualizações do model estão causando lentidão

Não use debounce se:

- O campo precisa de atualizações imediatas para uma boa experiência (como campos de calculadora)
- O ganho de desempenho é insignificante
- Os usuários esperam feedback em tempo real

## Associando dados a um campo com `metadata()` {#associate-data-with-a-field-using-metadata}

Metadados anexam dados reativos a um campo. As regras de validação usam esse sistema internamente, e você pode publicar suas próprias chaves para informações específicas da aplicação, como textos de ajuda, configurações ou valores de exibição computados.

O Signal Forms fornece chaves de metadados predefinidas que os validadores integrados preenchem automaticamente:

| Chave        | Preenchida por       | Lida por              |
| ------------ | -------------------- | --------------------- |
| `REQUIRED`   | `required()`         | `field().required()`  |
| `MIN`        | `min()`, `minDate()` | `field().min()`       |
| `MAX`        | `max()`, `maxDate()` | `field().max()`       |
| `MIN_LENGTH` | `minLength()`        | `field().minLength()` |
| `MAX_LENGTH` | `maxLength()`        | `field().maxLength()` |
| `PATTERN`    | `pattern()`          | `field().pattern()`   |

A diretiva `[formField]` vincula automaticamente cinco dessas chaves (`REQUIRED`, `MIN`, `MAX`, `MIN_LENGTH` e `MAX_LENGTH`) ao atributo HTML correspondente em um controle de formulário nativo. `PATTERN` é a exceção, porque o Signal Forms oferece suporte a múltiplos padrões por campo, mas o atributo HTML `pattern` aceita apenas uma única expressão regular.

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, required, min, max} from '@angular/forms/signals';

@Component({
  selector: 'app-age',
  imports: [FormField],
  template: `
    <label>
      Idade (entre {{ ageForm.age().min?.() }} e {{ ageForm.age().max?.() }})
      <input type="number" [formField]="ageForm.age" />
    </label>

    @if (ageForm.age().required()) {
      <span class="required-indicator">*</span>
    }
  `,
})
export class Age {
  ageModel = signal({age: 0});

  ageForm = form(this.ageModel, (schemaPath) => {
    required(schemaPath.age);
    min(schemaPath.age, 18);
    max(schemaPath.age, 120);
  });
}
```

### Metadados reativos {#reactive-metadata}

As regras de validação podem derivar suas restrições de outros campos, tornando os metadados publicados reativos:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, max} from '@angular/forms/signals';

@Component({
  selector: 'app-inventory',
  imports: [FormField],
  template: `
    <label>
      Item
      <select [formField]="inventoryForm.item">
        <option value="widget">Widget</option>
        <option value="gadget">Gadget</option>
      </select>
    </label>

    <label>
      Quantidade (máximo: {{ inventoryForm.quantity().max?.() }})
      <input type="number" [formField]="inventoryForm.quantity" />
    </label>
  `,
})
export class Inventory {
  inventoryModel = signal({
    item: 'widget',
    quantity: 0,
  });

  inventoryForm = form(this.inventoryModel, (schemaPath) => {
    max(schemaPath.quantity, ({valueOf}) => {
      const item = valueOf(schemaPath.item);
      return item === 'widget' ? 100 : 50;
    });
  });
}
```

A regra de validação `max()` define o metadado `MAX` de forma reativa com base no item selecionado, então qualquer template ou controle que leia `field().max()` é atualizado sempre que o item muda.

Para uma cobertura mais profunda, incluindo como definir chaves personalizadas, combinar contribuições com reducers e usar metadados gerenciados para objetos com ciclo de vida, consulte o [guia de Metadados de campo](guide/forms/signals/field-metadata).

## Combinando regras {#combining-rules}

Você pode aplicar várias regras ao mesmo campo e usar lógica condicional para aplicar grupos inteiros de regras com base no estado do formulário.

### Várias regras em um campo {#multiple-rules-on-one-field}

Aplique várias regras para configurar todos os aspectos do comportamento de um campo:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, disabled, hidden, debounce, metadata} from '@angular/forms/signals';
import {PLACEHOLDER} from './metadata-keys';

@Component({
  selector: 'app-promo',
  imports: [FormField],
  template: `
    @if (!promoForm.promoCode().hidden()) {
      <label>
        Código promocional
        <input [formField]="promoForm.promoCode" />
      </label>
    }
  `,
})
export class Promo {
  promoModel = signal({
    hasAccount: false,
    subscriptionType: 'free' as 'free' | 'premium',
    promoCode: '',
  });

  promoForm = form(this.promoModel, (schemaPath) => {
    disabled(schemaPath.promoCode, {
      when: ({valueOf}) => (!valueOf(schemaPath.hasAccount) ? 'Você precisa ter uma conta' : false),
    });
    hidden(schemaPath.promoCode, {
      when: ({valueOf}) => valueOf(schemaPath.subscriptionType) === 'free',
    });
    debounce(schemaPath.promoCode, 300);
    metadata(schemaPath.promoCode, PLACEHOLDER, () => 'Digite o código promocional');
  });
}
```

Essas regras funcionam em conjunto:

- Oculto tem precedência: se o campo estiver oculto, o estado de desabilitado não importa
- Desabilitado impede a edição, independentemente do estado de somente leitura
- O debounce afeta as atualizações do model independentemente dos outros estados
- Os metadados são independentes e sempre estão disponíveis

### Lógica condicional com applyWhen {#conditional-logic-with-applywhen}

Use `applyWhen()` para aplicar grupos inteiros de regras condicionalmente:

```angular-ts
import {Component, signal} from '@angular/core';
import {form, FormField, applyWhen, required, pattern} from '@angular/forms/signals';

@Component({
  selector: 'app-address',
  imports: [FormField],
  template: `
    <label>
      País
      <select [formField]="addressForm.country">
        <option value="US">Estados Unidos</option>
        <option value="CA">Canadá</option>
      </select>
    </label>

    <label>
      CEP / Código postal
      <input [formField]="addressForm.zipCode" />
    </label>
  `,
})
export class Address {
  addressModel = signal({
    country: 'US',
    zipCode: '',
  });

  addressForm = form(this.addressModel, (schemaPath) => {
    applyWhen(
      schemaPath,
      ({valueOf}) => valueOf(schemaPath.country) === 'US',
      (schemaPath) => {
        // Aplicado somente quando o país é US
        required(schemaPath.zipCode);
        pattern(schemaPath.zipCode, /^\d{5}(-\d{4})?$/);
      },
    );
  });
}
```

A função `applyWhen()` recebe:

1. Um caminho ao qual aplicar a lógica (geralmente o caminho do formulário raiz)
2. Uma função de lógica reativa que retorna `true` (aplicar) ou `false` (não aplicar)
3. Uma função de schema que define as regras condicionais

As regras condicionais só são executadas quando a condição é verdadeira. Isso é útil em formulários complexos em que as regras de validação ou o comportamento mudam de acordo com as escolhas do usuário.

### Funções de schema reutilizáveis {#reusable-schema-functions}

Extraia configurações de regras comuns para funções reutilizáveis:

```ts
import {SchemaPath, debounce, metadata, maxLength, form} from '@angular/forms/signals';
import {PLACEHOLDER} from './metadata-keys';

function emailFieldConfig(path: SchemaPath<string>) {
  debounce(path, 300);
  metadata(path, PLACEHOLDER, () => 'usuario@exemplo.com');
  maxLength(path, 255);
}

// Use em vários formulários
const contactForm = form(contactModel, (schemaPath) => {
  emailFieldConfig(schemaPath.email);
  emailFieldConfig(schemaPath.alternateEmail);
});

const registrationForm = form(registrationModel, (schemaPath) => {
  emailFieldConfig(schemaPath.email);
});
```

Esse padrão é útil quando você tem configurações padrão de campos que usa em vários formulários da aplicação.

## Próximos passos {#next-steps}

Para saber mais sobre o Signal Forms, confira estes guias relacionados:

- [Gerenciamento do estado de campos](guide/forms/signals/field-state-management): aprenda a usar, nos seus templates e na lógica do componente, os signals de estado criados por estas funções
- [Validação](guide/forms/signals/validation): aprenda sobre regras de validação e tratamento de erros
- [Controles personalizados](guide/forms/signals/custom-controls): veja como controles personalizados podem ler metadados e estado para se configurar automaticamente
