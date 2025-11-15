<!-- ia-translate: true -->
<docs-decorative-header title="Signals" imgSrc="adev/src/assets/images/signals.svg"> <!-- markdownlint-disable-line -->
Crie e gerencie dados dinâmicos.
</docs-decorative-header>

No Angular, você usa _signals_ para criar e gerenciar estado. Um signal é um wrapper leve em torno de um valor.

Use a função `signal` para criar um signal para armazenar estado local:

```typescript
import {signal} from '@angular/core';

// Create a signal with the `signal` function.
const firstName = signal('Morgan');

// Read a signal value by calling it— signals are functions.
console.log(firstName());

// Change the value of this signal by calling its `set` method with a new value.
firstName.set('Jaime');

// You can also use the `update` method to change the value
// based on the previous value.
firstName.update(name => name.toUpperCase());
```

O Angular rastreia onde os signals são lidos e quando são atualizados. O framework usa essa informação para realizar trabalhos adicionais, como atualizar o DOM com o novo estado. Essa capacidade de responder a valores de signal que mudam ao longo do tempo é conhecida como _reatividade_.

## Expressões computed

Um `computed` é um signal que produz seu valor com base em outros signals.

```typescript
import {signal, computed} from '@angular/core';

const firstName = signal('Morgan');
const firstNameCapitalized = computed(() => firstName().toUpperCase());

console.log(firstNameCapitalized()); // MORGAN
```

Um signal `computed` é somente leitura; ele não possui um método `set` ou `update`. Em vez disso, o valor do signal `computed` muda automaticamente quando qualquer um dos signals que ele lê muda:

```typescript
import {signal, computed} from '@angular/core';

const firstName = signal('Morgan');
const firstNameCapitalized = computed(() => firstName().toUpperCase());
console.log(firstNameCapitalized()); // MORGAN

firstName.set('Jaime');
console.log(firstNameCapitalized()); // JAIME
```

## Usando signals em components

Use `signal` e `computed` dentro de seus components para criar e gerenciar estado:

```typescript
@Component({/* ... */})
export class UserProfile {
  isTrial = signal(false);
  isTrialExpired = signal(false);
  showTrialDuration = computed(() => this.isTrial() && !this.isTrialExpired());

  activateTrial() {
    this.isTrial.set(true);
  }
}
```

DICA: Quer saber mais sobre Angular Signals? Consulte o [guia detalhado de Signals](guide/signals) para todos os detalhes.

## Próximo Passo

Agora que você aprendeu como declarar e gerenciar dados dinâmicos, é hora de aprender como usar esses dados dentro de templates.

<docs-pill-row>
  <docs-pill title="Interfaces dinâmicas com templates" href="essentials/templates" />
  <docs-pill title="Guia detalhado de signals" href="guide/signals" />
</docs-pill-row>
