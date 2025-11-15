<!-- ia-translate: true -->
# Derivando estado com computed signals

Agora que você aprendeu [como criar e atualizar signals](/tutorials/signals/1-creating-and-updating-your-first-signal), vamos aprender sobre computed signals. Computed signals são valores derivados que se atualizam automaticamente quando suas dependências mudam. Eles são perfeitos para criar cálculos reativos baseados em outros signals.

Nesta atividade, você aprenderá como usar a função `computed()` para criar estado derivado que se atualiza automaticamente quando os signals subjacentes mudam.

Vamos aprimorar nosso sistema de status de usuário adicionando valores computados que derivam informações do nosso signal de status de usuário. O código inicial agora inclui três opções de status: `'online'`, `'away'` e `'offline'`.

<hr />

<docs-workflow>

<docs-step title="Importe a função computed">
Adicione `computed` aos seus imports existentes.

```ts
// Adicione computed aos imports existentes
import {Component, signal, computed, ChangeDetectionStrategy} from '@angular/core';
```

</docs-step>

<docs-step title="Crie um computed signal para notificações">
Adicione um computed signal que determina se as notificações devem ser habilitadas com base no status do usuário.

```ts
notificationsEnabled = computed(() => this.userStatus() === 'online');
```

Este computed signal será recalculado automaticamente sempre que o signal `userStatus` mudar. Note como chamamos `this.userStatus()` dentro da função computed para ler o valor do signal.
</docs-step>

<docs-step title="Crie um computed signal para uma mensagem descritiva">
Adicione um computed signal que cria uma mensagem descritiva com base no status do usuário.

```ts
statusMessage = computed(() => {
  const status = this.userStatus();
  switch (status) {
    case 'online': return 'Available for meetings and messages';
    case 'away': return 'Temporarily away, will respond soon';
    case 'offline': return 'Not available, check back later';
    default: return 'Status unknown';
  }
});
```

Isso mostra como computed signals podem lidar com lógica mais complexa com instruções switch e transformações de string.
</docs-step>

<docs-step title="Crie um computed signal que calcula a disponibilidade em horário de trabalho">
Adicione um computed signal que calcula se o usuário está dentro do horário de trabalho.

```ts
isWithinWorkingHours = computed(() => {
  const now = new Date();
  const hour = now.getHours();
  const isWeekday = now.getDay() > 0 && now.getDay() < 6;
  return isWeekday && hour >= 9 && hour < 17 && this.userStatus() !== 'offline';
});
```

Isso demonstra como computed signals podem realizar cálculos e combinar múltiplas fontes de dados. O valor se atualiza automaticamente quando o `userStatus` muda.
</docs-step>

<docs-step title="Exiba os valores computados no template">
O template já tem placeholders mostrando "Loading...". Substitua-os pelos seus computed signals:

1. Para notificações, substitua `Loading...` por um bloco @if:

```angular-html
@if (notificationsEnabled()) {
  Enabled
} @else {
  Disabled
}
```

2. Para a mensagem, substitua `Loading...` por:

```angular-html
{{ statusMessage() }}
```

3. Para horário de trabalho, substitua `Loading...` por um bloco @if:

```angular-html
@if (isWithinWorkingHours()) {
  Yes
} @else {
  No
}
```

Note como computed signals são chamados assim como signals regulares - com parênteses!
</docs-step>

</docs-workflow>

Excelente! Agora você aprendeu como criar computed signals.

Aqui estão alguns pontos-chave para lembrar:

- **Computed signals são reativos**: Eles se atualizam automaticamente quando suas dependências mudam
- **Eles são somente leitura**: Você não pode definir diretamente valores computados, eles são derivados de outros signals
- **Eles podem conter lógica complexa**: Use-os para cálculos, transformações e estado derivado
- **Eles fornecem uma maneira de fazer computações performáticas baseadas em estado dinâmico**: O Angular só os recalcula quando suas dependências realmente mudam

Na próxima lição, você aprenderá sobre [uma maneira diferente de derivar estado com linkedSignals](/tutorials/signals/3-deriving-state-with-linked-signals)!
