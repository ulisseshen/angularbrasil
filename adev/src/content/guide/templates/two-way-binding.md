<!-- ia-translate: true -->
# Two-way binding

**Two way binding** é um atalho para simultaneamente vincular um valor a um elemento, enquanto também dá a esse elemento a capacidade de propagar mudanças de volta através desse binding.

## Sintaxe

A sintaxe para two-way binding é uma combinação de colchetes e parênteses, `[()]`. Ela combina a sintaxe de property binding, `[]`, e a sintaxe de event binding, `()`. A comunidade Angular informalmente se refere a essa sintaxe como "banana-in-a-box".

## Two-way binding com form controls

Desenvolvedores comumente usam two-way binding para manter os dados do component sincronizados com um form control enquanto o usuário interage com o control. Por exemplo, quando um usuário preenche um input de texto, ele deve atualizar o estado no component.

O exemplo a seguir atualiza dinamicamente o atributo `firstName` na página:

```angular-ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  template: `
    <main>
      <h2>Hello {{ firstName }}!</h2>
      <input type="text" [(ngModel)]="firstName" />
    </main>
  `
})
export class AppComponent {
  firstName = 'Ada';
}
```

Para usar two-way binding com form controls nativos, você precisa:

1. Importar o `FormsModule` de `@angular/forms`
1. Usar a directive `ngModel` com a sintaxe de two-way binding (ex., `[(ngModel)]`)
1. Atribuí-lo ao estado que você quer atualizar (ex., `firstName`)

Uma vez configurado, o Angular garantirá que quaisquer atualizações no input de texto sejam refletidas corretamente dentro do estado do component!

Saiba mais sobre [`NgModel`](guide/directives#displaying-and-updating-properties-with-ngmodel) na documentação oficial.

## Two-way binding entre components

Aproveitar two-way binding entre um component pai e filho requer mais configuração comparado a elementos de formulário.

Aqui está um exemplo onde o `AppComponent` é responsável por definir o estado inicial do count, mas a lógica para atualizar e renderizar a UI do contador reside principalmente dentro do seu component filho `CounterComponent`.

```angular-ts
// ./app.component.ts
import { Component } from '@angular/core';
import { CounterComponent } from './counter/counter.component';

@Component({
  selector: 'app-root',
  imports: [CounterComponent],
  template: `
    <main>
      <h1>Counter: {{ initialCount }}</h1>
      <app-counter [(count)]="initialCount"></app-counter>
    </main>
  `,
})
export class AppComponent {
  initialCount = 18;
}
```

```angular-ts
// './counter/counter.component.ts';
import { Component, model } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: `
    <button (click)="updateCount(-1)">-</button>
    <span>{{ count() }}</span>
    <button (click)="updateCount(+1)">+</button>
  `,
})
export class CounterComponent {
  count = model<number>(0);

  updateCount(amount: number): void {
    this.count.update(currentCount => currentCount + amount);
  }
}
```

### Habilitando two-way binding entre components

Se quebrarmos o exemplo acima em sua essência, cada two-way binding para components requer o seguinte:

O component filho deve conter uma propriedade `model`.

Aqui está um exemplo simplificado:

```angular-ts
// './counter/counter.component.ts';
import { Component, model } from '@angular/core';

@Component({ /* Omitido para brevidade */ })
export class CounterComponent {
  count = model<number>(0);

  updateCount(amount: number): void {
    this.count.update(currentCount => currentCount + amount);
  }
}
```

O component pai deve:

1. Envolver o nome da propriedade `model` na sintaxe de two-way binding.
1. Atribuir uma propriedade ou um signal à propriedade `model`.

Aqui está um exemplo simplificado:

```angular-ts
// ./app.component.ts
import { Component } from '@angular/core';
import { CounterComponent } from './counter/counter.component';

@Component({
  selector: 'app-root',
  imports: [CounterComponent],
  template: `
    <main>
      <app-counter [(count)]="initialCount"></app-counter>
    </main>
  `,
})
export class AppComponent {
  initialCount = 18;
}
```
