<!-- ia-translate: true -->
# Derivando estado com linked signals

Agora que você aprendeu [como derivar estado com computed signals](/tutorials/signals/2-deriving-state-with-computed-signals), você criou um computed signal para `notificationsEnabled` que automaticamente seguia seu status de usuário. Mas e se os usuários quiserem desabilitar manualmente as notificações mesmo quando estão online? É aí que os linked signals entram.

Linked signals são signals graváveis que mantêm uma conexão reativa com seus signals de origem. Eles são perfeitos para criar estado que normalmente segue uma computação, mas pode ser sobrescrito quando necessário.

Nesta atividade, você aprenderá como `linkedSignal()` difere de `computed()` aprimorando o `notificationsEnabled` computado do sistema de status de usuário anterior para um linked signal gravável.

<hr />

<docs-workflow>

<docs-step title="Importe a função linkedSignal">
Adicione `linkedSignal` aos seus imports existentes.

```ts
// Adicione linkedSignal aos imports existentes
import {Component, signal, computed, linkedSignal, ChangeDetectionStrategy} from '@angular/core';
```

</docs-step>

<docs-step title="Converta computed para linkedSignal com a mesma expressão">
Substitua o `notificationsEnabled` computado por um linkedSignal usando exatamente a mesma expressão:

```ts
// Anteriormente (da lição 2):
// notificationsEnabled = computed(() => this.userStatus() === 'online');

// Agora com linkedSignal - mesma expressão, mas gravável:
notificationsEnabled = linkedSignal(() => this.userStatus() === 'online');
```

A expressão é idêntica, mas linkedSignal cria um signal gravável. Ele ainda se atualizará automaticamente quando `userStatus` mudar, mas você também pode defini-lo manualmente.
</docs-step>

<docs-step title="Adicione um método para alternar notificações manualmente">
Adicione um método para demonstrar que linked signals podem ser escritos diretamente:

```ts
toggleNotifications() {
  // Isso funciona com linkedSignal mas daria erro com computed!
  this.notificationsEnabled.set(!this.notificationsEnabled());
}
```

Esta é a diferença chave: computed signals são somente leitura, mas linked signals podem ser atualizados manualmente enquanto ainda mantêm sua conexão reativa.
</docs-step>

<docs-step title="Atualize o template para adicionar controle manual de notificação">
Atualize seu template para adicionar um botão de alternância para notificações:

```angular-html
<div class="status-info">
  <div class="notifications">
    <strong>Notifications:</strong>
    @if (notificationsEnabled()) {
      Enabled
    } @else {
      Disabled
    }
    <button (click)="toggleNotifications()" class="override-btn">
      @if (notificationsEnabled()) {
        Disable
      } @else {
        Enable
      }
    </button>
  </div>
  <!-- divs de message e working-hours existentes permanecem -->
</div>
```

</docs-step>

<docs-step title="Observe o comportamento reativo">
Agora teste o comportamento:

1. Mude o status do usuário - note como `notificationsEnabled` se atualiza automaticamente
2. Alterne manualmente as notificações - isso sobrescreve o valor computado
3. Mude o status novamente - o linked signal ressincroniza com sua computação

Isso demonstra que linked signals mantêm sua conexão reativa mesmo após serem definidos manualmente!
</docs-step>

</docs-workflow>

Excelente! Você aprendeu as diferenças principais entre computed e linked signals:

- **Computed signals**: Somente leitura, sempre derivados de outros signals
- **Linked signals**: Graváveis, podem ser tanto derivados QUANTO atualizados manualmente
- **Use computed quando**: O valor deve sempre ser calculado
- **Use linkedSignal quando**: Você precisa de uma computação padrão que pode ser sobrescrita

Na próxima lição, você aprenderá [como gerenciar dados assíncronos com signals](/tutorials/signals/4-managing-async-data-with-signals)!
