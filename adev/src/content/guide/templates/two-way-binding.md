<!-- ia-translate: true -->
# Two-way binding

**Two way binding** é um atalho para vincular simultaneamente um valor a um elemento, ao mesmo tempo que dá a esse elemento a capacidade de propagar mudanças de volta por meio desse binding.

## Sintaxe {#syntax}

A sintaxe para two-way binding é uma combinação de colchetes e parênteses, `[()]`. Ela combina a sintaxe de property binding, `[]`, e a sintaxe de event binding, `()`. A comunidade Angular se refere informalmente a essa sintaxe como "banana-in-a-box".

## Two-way binding com form controls {#two-way-binding-with-form-controls}

Desenvolvedores comumente usam two-way binding para manter os dados do component sincronizados com um form control enquanto o usuário interage com o control. Por exemplo, quando um usuário preenche um campo de texto, o estado no component deve ser atualizado.

O exemplo a seguir atualiza dinamicamente o atributo `firstName` na página:

```angular-ts
import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  imports: [FormsModule],
  template: `
    <main>
      <h2>Hello {{ firstName }}!</h2>
      <input type="text" [(ngModel)]="firstName" />
    </main>
  `,
})
export class App {
  firstName = 'Ada';
}
```

Para usar two-way binding com form controls nativos, você precisa:

1. Importar o `FormsModule` de `@angular/forms`
1. Usar a directive `ngModel` com a sintaxe de two-way binding (por exemplo, `[(ngModel)]`)
1. Atribuir a ela o estado que você quer atualizar (por exemplo, `firstName`)

Depois de configurado, o Angular garante que quaisquer atualizações no campo de texto sejam refletidas corretamente dentro do estado do component!

Saiba mais sobre [`NgModel`](/api/forms/NgModel) na documentação oficial.

## Two-way binding entre components {#two-way-binding-between-components}

Aproveitar o two-way binding entre um component pai e um component filho exige mais configuração do que com elementos de formulário.

Aqui está um exemplo em que o `App` é responsável por definir o estado inicial do count, mas a lógica para atualizar e renderizar a UI do contador reside principalmente dentro do seu component filho `Counter`.

```angular-ts {header: 'app.ts'}
import {Component} from '@angular/core';
import {Counter} from './counter';

@Component({
  selector: 'app-root',
  imports: [Counter],
  template: `
    <main>
      <h1>Counter: {{ initialCount }}</h1>
      <app-counter [(count)]="initialCount"></app-counter>
    </main>
  `,
})
export class App {
  initialCount = 18;
}
```

```angular-ts {header: 'counter.ts'}
import {Component, model} from '@angular/core';

@Component({
  selector: 'app-counter',
  template: `
    <button (click)="updateCount(-1)">-</button>
    <span>{{ count() }}</span>
    <button (click)="updateCount(+1)">+</button>
  `,
})
export class Counter {
  count = model<number>(0);

  updateCount(amount: number): void {
    this.count.update((currentCount) => currentCount + amount);
  }
}
```

### Habilitando two-way binding entre components {#enabling-two-way-binding-between-components}

Se reduzirmos o exemplo acima ao seu essencial, cada two-way binding para components exige o seguinte:

O component filho deve conter uma propriedade `model`.

Aqui está um exemplo simplificado:

```angular-ts {header: 'counter.ts'}
import {Component, model} from '@angular/core';

@Component({
  /* Omitted for brevity */
})
export class Counter {
  count = model<number>(0);

  updateCount(amount: number): void {
    this.count.update((currentCount) => currentCount + amount);
  }
}
```

O component pai deve:

1. Envolver o nome da propriedade `model` na sintaxe de two-way binding.
1. Atribuir uma propriedade ou um signal à propriedade `model`.

Aqui está um exemplo simplificado:

```angular-ts {header: 'app.ts'}
import {Component} from '@angular/core';
import {Counter} from './counter';

@Component({
  selector: 'app-root',
  imports: [Counter],
  template: `
    <main>
      <app-counter [(count)]="initialCount"></app-counter>
    </main>
  `,
})
export class App {
  initialCount = 18;
}
```
