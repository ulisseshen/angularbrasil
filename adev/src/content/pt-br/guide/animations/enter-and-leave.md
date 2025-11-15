<!-- ia-translate: true -->
# Animando suas aplicações com `animate.enter` e `animate.leave`

Animations bem projetadas podem tornar sua aplicação mais divertida e simples de usar, mas elas não são apenas cosméticas.
Animations podem melhorar sua aplicação e experiência do usuário de várias maneiras:

- Sem animations, as transições de páginas web podem parecer abruptas e bruscas
- O movimento melhora muito a experiência do usuário, então animations dão aos usuários uma chance de detectar a resposta da aplicação às suas ações
- Boas animations podem direcionar suavemente a atenção do usuário durante um fluxo de trabalho

Angular fornece `animate.enter` e `animate.leave` para animar os elementos da sua aplicação. Esses dois recursos aplicam classes CSS de entrada e saída nos momentos apropriados ou chamam funções para aplicar animations de bibliotecas de terceiros. `animate.enter` e `animate.leave` não são directives. Eles são APIs especiais suportadas diretamente pelo compilador Angular. Eles podem ser usados em elementos diretamente e também podem ser usados como host binding.

## `animate.enter`

Você pode usar `animate.enter` para animar elementos conforme eles _entram_ no DOM. Você pode definir animations de entrada usando classes CSS com transitions ou keyframe animations.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/enter.ts">
    <docs-code header="enter.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter.ts" />
    <docs-code header="enter.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter.html" />
    <docs-code header="enter.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter.css"/>
</docs-code-multifile>

Quando a animation é concluída, Angular remove a classe ou classes que você especificou em `animate.enter` do DOM. Classes de animation estarão presentes apenas enquanto a animation estiver ativa.

NOTA: Ao usar múltiplas keyframe animations ou propriedades de transition em um elemento, Angular remove todas as classes apenas _depois_ que a animation mais longa foi concluída.

Você pode usar `animate.enter` com quaisquer outros recursos do Angular, como control flow ou expressões dinâmicas. `animate.enter` aceita tanto uma string de classe única (com múltiplas classes separadas por espaços), ou um array de strings de classe.

Uma observação rápida sobre o uso de CSS transitions: Se você escolher usar transitions em vez de keyframe animations, as classes adicionadas ao elemento com `animate.enter` representam o estado para o qual a transition irá animar. Seu CSS de elemento base é como o elemento ficará quando nenhuma animation for executada, que provavelmente é similar ao estado final da CSS transition. Então você ainda precisaria emparelhá-lo com `@starting-style` para ter um estado _from_ apropriado para sua transition funcionar.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/enter-binding.ts">
    <docs-code header="enter-binding.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter-binding.ts" />
    <docs-code header="enter-binding.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter-binding.html" />
    <docs-code header="enter-binding.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter-binding.css"/>
</docs-code-multifile>

## `animate.leave`

Você pode usar `animate.leave` para animar elementos conforme eles _saem_ do DOM. Você pode definir animations de saída usando classes CSS com transforms ou keyframe animations.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/leave.ts">
    <docs-code header="leave.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave.ts" />
    <docs-code header="leave.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave.html" />
    <docs-code header="leave.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave.css"/>
</docs-code-multifile>

Quando a animation é concluída, Angular automaticamente remove o elemento animado do DOM.

NOTA: Ao usar múltiplas keyframe animations ou propriedades de transition em um elemento, Angular espera para remover o elemento apenas _depois_ que a mais longa dessas animations foi concluída.

`animate.leave` também pode ser usado com signals, e outros bindings. Você pode usar `animate.leave` com uma única classe ou múltiplas classes. Especifique como uma string simples com espaços ou um array de strings.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-binding.ts">
    <docs-code header="leave-binding.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-binding.ts" />
    <docs-code header="leave-binding.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-binding.html" />
    <docs-code header="leave-binding.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-binding.css"/>
</docs-code-multifile>

## Event Bindings, Functions, e Bibliotecas de Terceiros

Tanto `animate.enter` quanto `animate.leave` suportam sintaxe de event binding que permite chamadas de função. Você pode usar essa sintaxe para chamar uma função no código do seu component ou utilizar bibliotecas de animation de terceiros, como [GSAP](https://gsap.com/), [anime.js](https://animejs.com/), ou qualquer outra biblioteca JavaScript de animation.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-event.ts">
    <docs-code header="leave-event.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-event.ts" />
    <docs-code header="leave-event.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-event.html" />
    <docs-code header="leave-event.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-event.css"/>
</docs-code-multifile>

O objeto `$event` tem o tipo `AnimationCallbackEvent`. Ele inclui o elemento como `target` e fornece uma função `animationComplete()` para notificar o framework quando a animation termina.

IMPORTANTE: Você **deve** chamar a função `animationComplete()` ao usar `animate.leave` para o Angular remover o elemento.

Se você não chamar `animationComplete()` ao usar `animate.leave`, Angular chama a função automaticamente após um delay de quatro segundos. Você pode configurar a duração do delay fornecendo o token `MAX_ANIMATION_TIMEOUT` em milissegundos.

```typescript
  { provide: MAX_ANIMATION_TIMEOUT, useValue: 6000 }
```

## Compatibilidade com Animations Legadas do Angular

Você não pode usar animations legadas juntamente com `animate.enter` e `animate.leave` dentro do mesmo component. Fazer isso resultaria em classes de entrada permanecendo no elemento ou nós de saída não sendo removidos. Caso contrário, é perfeitamente aceitável usar tanto animations legadas quanto as novas animations `animate.enter` e `animate.leave` dentro da mesma _aplicação_. A única ressalva é projeção de conteúdo. Se você está projetando conteúdo de um component com animations legadas em outro component com `animate.enter` ou `animate.leave`, ou vice-versa, isso resultará no mesmo comportamento como se fossem usadas juntas no mesmo component. Isso não é suportado.

## Testing

TestBed fornece suporte integrado para habilitar ou desabilitar animations no seu ambiente de teste. CSS animations requerem um browser para rodar, e muitas das APIs não estão disponíveis em um ambiente de teste. Por padrão, TestBed desabilita animations para você nos seus ambientes de teste.

Se você quiser testar que as animations estão animando em um teste de browser, por exemplo um teste end-to-end, você pode configurar TestBed para habilitar animations especificando `animationsEnabled: true` na sua configuração de teste.

```typescript
  TestBed.configureTestingModule({animationsEnabled: true});
```

Isso configurará animations no seu ambiente de teste para se comportarem normalmente.

NOTA: Alguns ambientes de teste não emitem eventos de animation como `animationstart`, `animationend` e seus equivalentes de evento de transition.

## Mais sobre animations Angular

Você também pode estar interessado no seguinte:

<docs-pill-row>
  <docs-pill href="guide/animations/css" title="Animations Complexas com CSS"/>
  <docs-pill href="guide/routing/route-transition-animations" title="Route transition animations"/>
</docs-pill-row>
