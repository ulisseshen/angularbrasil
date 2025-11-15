<!-- ia-translate: true -->
# Reagindo a mudanças de signal com effect

Agora que você aprendeu a [consultar elementos filhos com signal queries](/tutorials/signals/9-query-child-elements-with-signal-queries), vamos explorar como reagir a mudanças de signal com effects. Effects são funções que executam automaticamente quando suas dependências mudam, tornando-os perfeitos para efeitos colaterais como logging, manipulação do DOM ou chamadas de API.

**Importante: Effects devem ser a última API que você deve usar.** Sempre prefira `computed()` para valores derivados e `linkedSignal()` para valores que podem ser tanto derivados quanto definidos manualmente. Se você se pegar copiando dados de um signal para outro com um effect, é um sinal de que você deve mover sua fonte de verdade para um nível superior e usar `computed()` ou `linkedSignal()` em vez disso. Effects são melhores para sincronizar estado de signal com APIs imperativas e não-signal.

Nesta atividade, você aprenderá como usar a função `effect()` apropriadamente para efeitos colaterais legítimos que respondem a mudanças de signal.

<hr />

Você tem um app gerenciador de tema com signals já configurados. Agora você adicionará effects para reagir automaticamente a mudanças de signal.

<docs-workflow>

<docs-step title="Importe a função effect">
Adicione `effect` aos seus imports existentes.

```ts
// Add effect to existing imports
import {Component, signal, computed, effect, ChangeDetectionStrategy} from '@angular/core';
```

A função `effect` cria um efeito colateral reativo que executa automaticamente quando quaisquer signals que ele lê mudam.
</docs-step>

<docs-step title="Crie um effect para local storage">
Adicione um effect que salva automaticamente o tema no local storage quando ele muda.

```ts
constructor() {
  // Save theme to localStorage whenever it changes
  effect(() => {
    localStorage.setItem('theme', this.theme());
    console.log('Theme saved to localStorage:', this.theme());
  });
}
```

Este effect executa sempre que o signal theme muda, persistindo automaticamente a preferência do usuário.
</docs-step>

<docs-step title="Crie um effect para logging de atividade do usuário">
Adicione um effect que registra quando o usuário faz login ou logout.

```ts
constructor() {
  // ... previous effect

  // Log user activity changes
  effect(() => {
    const status = this.isLoggedIn() ? 'logged in' : 'logged out';
    const user = this.username();
    console.log(`User ${user} is ${status}`);
  });
}
```

Este effect demonstra como effects podem ler múltiplos signals e reagir a mudanças em qualquer um deles.
</docs-step>

<docs-step title="Crie um effect com cleanup">
Adicione um effect que configura um timer e limpa quando o component é destruído.

```ts
constructor() {
  // ... previous effects

  // Timer effect with cleanup
  effect((onCleanup) => {
    const interval = setInterval(() => {
      console.log('Timer tick - Current theme:', this.theme());
    }, 5000);

    // Clean up the interval when the effect is destroyed
    onCleanup(() => {
      clearInterval(interval);
      console.log('Timer cleaned up');
    });
  });
}
```

Este effect demonstra como limpar recursos quando effects são destruídos ou re-executados.
</docs-step>

<docs-step title="Teste os effects">
Abra o console do browser e interaja com o app:

- **Toggle Theme** - Veja salvamentos no localStorage e logs do timer
- **Login/Logout** - Veja logging de atividade do usuário
- **Watch Timer** - Veja logging periódico do tema a cada 5 segundos

Os effects executam automaticamente sempre que seus signals rastreados mudam!
</docs-step>

</docs-workflow>

Excelente! Você agora aprendeu como usar effects com signals. Conceitos-chave para lembrar:

- **Effects são reativos**: Eles executam automaticamente quando qualquer signal que eles leem muda
- **Somente efeitos colaterais**: Perfeitos para logging, manipulação do DOM, chamadas de API e sincronização com APIs imperativas
- **Cleanup**: Use o callback `onCleanup` para limpar recursos como timers ou subscriptions
- **Rastreamento automático**: Effects rastreiam automaticamente quais signals eles leem e re-executam quando esses signals mudam

**Lembre-se: Use effects com moderação!** Os exemplos nesta lição (sincronização com localStorage, logging, timers) são usos apropriados. Evite effects para:

- Derivar valores de outros signals - use `computed()` em vez disso
- Criar estado derivado modificável - use `linkedSignal()` em vez disso
- Copiar dados entre signals - reestruture para usar uma fonte de verdade compartilhada

Effects são poderosos, mas devem ser seu último recurso quando `computed()` e `linkedSignal()` não puderem resolver seu caso de uso.
