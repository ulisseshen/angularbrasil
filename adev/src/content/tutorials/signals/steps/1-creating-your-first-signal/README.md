<!-- ia-translate: true -->
# Criando e atualizando seu primeiro signal

Bem-vindo ao tutorial de Angular signals! [Signals](/essentials/signals) são a primitiva reativa do Angular que fornece uma maneira de gerenciar estado e atualizar automaticamente sua UI quando esse estado muda.

Nesta atividade, você aprenderá como:

- Criar seu primeiro signal usando a função `signal()`
- Exibir seu valor em um template
- Atualizar o valor do signal usando os métodos `set()` e `update()`

Vamos construir um sistema interativo de status de usuário com signals!

<hr />

<docs-workflow>

<docs-step title="Importe a função signal">
Importe a função `signal` de `@angular/core` no topo do arquivo do seu componente.

```ts
import {Component, signal, ChangeDetectionStrategy} from '@angular/core';
```

</docs-step>

<docs-step title="Crie um signal em seu componente">
Adicione um signal `userStatus` à sua classe de componente que é inicializado com um valor de `'offline'`.

```ts
@Component({
  /* Config omitida */
})
export class App {
  userStatus = signal<'online' | 'offline'>('offline');
}
```

</docs-step>

<docs-step title="Exiba o valor do signal no template">
Atualize o indicador de status para exibir o status atual do usuário:
1. Vinculando o signal ao atributo class com `[class]="userStatus()"`
2. Exibindo o texto de status substituindo `???` por `{{ userStatus() }}`

```html
<!-- Atualize de: -->
<div class="status-indicator offline">
  <span class="status-dot"></span>
  Status: ???
</div>

<!-- Para: -->
<div class="status-indicator" [class]="userStatus()">
  <span class="status-dot"></span>
  Status: {{ userStatus() }}
</div>
```

Note como chamamos o signal `userStatus()` com parênteses para ler seu valor.
</docs-step>

<docs-step title="Adicione métodos para atualizar o signal">
Adicione métodos ao seu componente que alteram o status do usuário usando o método `set()`.

```ts
goOnline() {
  this.userStatus.set('online');
}

goOffline() {
  this.userStatus.set('offline');
}
```

O método `set()` substitui completamente o valor do signal por um novo valor.

</docs-step>

<docs-step title="Conecte os botões de controle">
Os botões já estão no template. Agora conecte-os aos seus métodos adicionando:
1. Manipuladores de clique com `(click)`
2. Estados desabilitados com `[disabled]` quando já estiver naquele status

```html
<!-- Adicione vinculações aos botões existentes: -->
<button (click)="goOnline()" [disabled]="userStatus() === 'online'">
  Go Online
</button>
<button (click)="goOffline()" [disabled]="userStatus() === 'offline'">
  Go Offline
</button>
```

</docs-step>

<docs-step title="Adicione um método de alternância usando update()">
Adicione um método `toggleStatus()` que alterna entre online e offline usando o método `update()`.

```ts
toggleStatus() {
  this.userStatus.update(current => current === 'online' ? 'offline' : 'online');
}
```

O método `update()` recebe uma função que recebe o valor atual e retorna o novo valor. Isso é útil quando você precisa modificar o valor existente com base em seu estado atual.

</docs-step>

<docs-step title="Adicione o manipulador do botão de alternância">
O botão de alternância já está no template. Conecte-o ao seu método `toggleStatus()`:

```html
<button (click)="toggleStatus()" class="toggle-btn">
  Toggle Status
</button>
```

</docs-step>

</docs-workflow>

Parabéns! Você criou seu primeiro signal e aprendeu como atualizá-lo usando os métodos `set()` e `update()`. A função `signal()` cria um valor reativo que o Angular rastreia, e quando você o atualiza, sua UI reflete automaticamente as mudanças.

Em seguida, você aprenderá [como derivar estado de signals usando computed](/tutorials/signals/2-deriving-state-with-computed-signals)!

<docs-callout helpful title="Sobre ChangeDetectionStrategy.OnPush">

Você pode notar `ChangeDetectionStrategy.OnPush` no decorator do componente ao longo deste tutorial. Esta é uma otimização de desempenho para componentes Angular que usam signals. Por enquanto, você pode ignorá-la com segurança—apenas saiba que ela ajuda sua aplicação a rodar mais rápido ao usar signals! Você pode aprender mais na [documentação da API de estratégias de detecção de mudanças](/api/core/ChangeDetectionStrategy).

</docs-callout>
