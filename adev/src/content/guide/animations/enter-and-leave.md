<!-- ia-translate: true -->
# Animando suas aplicações com `animate.enter` e `animate.leave` {#animating-your-applications-with-animateenter-and-animateleave}

Animações bem projetadas podem tornar sua aplicação mais intuitiva e envolvente, mas elas não são apenas cosméticas.
Animações podem melhorar sua aplicação e a experiência do usuário de várias maneiras:

- Sem animações, transições de páginas web podem parecer abruptas e desconfortáveis
- Movimento melhora muito a experiência do usuário, então animações dão aos usuários a chance de perceber a resposta da aplicação às suas ações
- Boas animações podem direcionar suavemente a atenção do usuário ao longo de um fluxo de trabalho

O Angular fornece `animate.enter` e `animate.leave` para animar os elementos da sua aplicação. Esses dois recursos aplicam classes CSS de entrada e saída nos momentos apropriados ou chamam funções para aplicar animações de bibliotecas de terceiros. `animate.enter` e `animate.leave` não são directives. São APIs especiais suportadas diretamente pelo compilador do Angular. Elas podem ser usadas diretamente em elementos e também como um host binding.

## `animate.enter`

Você pode usar `animate.enter` para animar elementos conforme eles _entram_ no DOM. Você pode definir animações de entrada usando classes CSS com transitions ou animações de keyframe.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/enter.ts">
    <docs-code header="enter.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter.ts" />
    <docs-code header="enter.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter.html" />
    <docs-code header="enter.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter.css"/>
</docs-code-multifile>

Quando a animação é concluída, o Angular remove do DOM a classe ou classes que você especificou em `animate.enter`. As classes de animação ficam presentes apenas enquanto a animação está ativa.

NOTA: Ao usar múltiplas animações de keyframe ou propriedades de transition em um elemento, o Angular remove todas as classes somente _depois_ que a animação mais longa for concluída.

Você pode usar `animate.enter` com quaisquer outros recursos do Angular, como control flow ou expressões dinâmicas. `animate.enter` aceita tanto uma única string de classe (com múltiplas classes separadas por espaços) quanto um array de strings de classe.

Uma nota rápida sobre o uso de transitions CSS: se você optar por usar transitions em vez de animações de keyframe, as classes adicionadas ao elemento com `animate.enter` representam o estado para o qual a transition vai animar _até_. O CSS base do seu elemento é como ele ficará quando nenhuma animação estiver em execução, o que provavelmente é parecido com o estado final da transition CSS. Por isso, você ainda precisaria combiná-lo com `@starting-style` para ter um estado _de origem_ apropriado para que sua transition funcione.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/enter-binding.ts">
    <docs-code header="enter-binding.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter-binding.ts" />
    <docs-code header="enter-binding.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter-binding.html" />
    <docs-code header="enter-binding.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/enter-binding.css"/>
</docs-code-multifile>

## `animate.leave`

Você pode usar `animate.leave` para animar elementos conforme eles _saem_ do DOM. Você pode definir animações de saída usando classes CSS com transforms ou animações de keyframe.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/leave.ts">
    <docs-code header="leave.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave.ts" />
    <docs-code header="leave.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave.html" />
    <docs-code header="leave.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave.css"/>
</docs-code-multifile>

Quando a animação é concluída, o Angular remove automaticamente o elemento animado do DOM.

NOTA: Ao usar múltiplas animações de keyframe ou propriedades de transition em um elemento, o Angular aguarda para remover o elemento somente _depois_ que a mais longa dessas animações for concluída.

`animate.leave` também pode ser usado com signals e outros bindings. Você pode usar `animate.leave` com uma única classe ou com múltiplas classes. Especifique como uma string simples com espaços ou como um array de strings.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-binding.ts">
    <docs-code header="leave-binding.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-binding.ts" />
    <docs-code header="leave-binding.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-binding.html" />
    <docs-code header="leave-binding.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-binding.css"/>
</docs-code-multifile>

### Ordem de remoção de elementos {#element-removal-order}

Há algumas nuances em como as animações `animate.leave` são executadas e em quando uma animação ocorre. `animate.leave` funciona se for colocado no elemento que está sendo removido. Se `animate.leave` for colocado em um elemento que é _descendente_ do elemento sendo removido _dentro do mesmo template de component_, essas animações `animate.leave` dos filhos acontecerão _antes_ de o nó pai ser removido do DOM. Isso garante que você possa animar com segurança a saída de elementos filhos sem que o nó pai desapareça prematuramente.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-parent.ts">
    <docs-code header="leave-parent.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-parent.ts" />
    <docs-code header="leave-parent.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-parent.html" />
    <docs-code header="leave-parent.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-parent.css"/>
</docs-code-multifile>

IMPORTANTE: Animações de filhos disparam apenas para elementos dentro do mesmo template de component. Se um elemento que está sendo removido contiver components filhos, quaisquer animações `animate.leave` definidas dentro dos templates desses components filhos **não** serão executadas antes de o pai ser removido. Para animar um component filho na remoção, aplique `animate.leave` diretamente ao elemento host do component filho dentro do template pai, ou trate programaticamente o disparo da animação no component filho e atrase a remoção do pai até que essa animação seja concluída.

## Event bindings, funções e bibliotecas de terceiros {#event-bindings-functions-and-third-party-libraries}

Tanto `animate.enter` quanto `animate.leave` suportam a sintaxe de event binding, que permite chamadas de função. Você pode usar essa sintaxe para chamar uma função no código do seu component ou para utilizar bibliotecas de animação de terceiros, como [GSAP](https://gsap.com/), [anime.js](https://animejs.com/) ou qualquer outra biblioteca de animação JavaScript.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-event.ts">
    <docs-code header="leave-event.ts" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-event.ts" />
    <docs-code header="leave-event.html" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-event.html" />
    <docs-code header="leave-event.css" path="adev/src/content/examples/animations/src/app/enter-and-leave/leave-event.css"/>
</docs-code-multifile>

O objeto `$event` tem o tipo `AnimationCallbackEvent`. Ele inclui o elemento como `target` e fornece uma função `animationComplete()` para notificar o framework quando a animação terminar.

IMPORTANTE: Você **deve** chamar a função `animationComplete()` ao usar `animate.leave` para que o Angular remova o elemento.

Se você não chamar `animationComplete()` ao usar `animate.leave`, o Angular a chama automaticamente após um delay de quatro segundos. Você pode configurar a duração desse delay fornecendo o token `MAX_ANIMATION_TIMEOUT`, em milissegundos.

```typescript
  { provide: MAX_ANIMATION_TIMEOUT, useValue: 6000 }
```

## Compatibilidade com animações legadas do Angular {#compatibility-with-legacy-angular-animations}

Você não pode usar animações legadas junto com `animate.enter` e `animate.leave` dentro do mesmo component. Fazer isso resultaria em classes de entrada permanecendo no elemento ou em nós de saída que não são removidos. Caso contrário, é perfeitamente adequado usar tanto animações legadas quanto as novas animações `animate.enter` e `animate.leave` dentro da mesma _aplicação_. A única ressalva é a content projection. Se você projetar conteúdo de um component com animações legadas em outro component com `animate.enter` ou `animate.leave`, ou vice-versa, isso resultará no mesmo comportamento que ocorreria se eles fossem usados juntos no mesmo component. Esse cenário não é suportado.

## Testes {#testing}

O TestBed fornece suporte integrado para habilitar ou desabilitar animações no seu ambiente de teste. Animações CSS exigem um navegador para rodar, e muitas das APIs não estão disponíveis em um ambiente de teste. Por padrão, o TestBed desabilita animações para você em seus ambientes de teste.

Se você quiser testar se as animações estão de fato animando em um teste de navegador, por exemplo um teste end-to-end, pode configurar o TestBed para habilitar animações especificando `animationsEnabled: true` na sua configuração de teste.

```typescript
TestBed.configureTestingModule({animationsEnabled: true});
```

Isso configurará as animações no seu ambiente de teste para se comportarem normalmente.

NOTA: Alguns ambientes de teste não emitem eventos de animação como `animationstart`, `animationend` e seus equivalentes de eventos de transition.

## Mais sobre animações do Angular {#more-on-angular-animations}

Você também pode estar interessado no seguinte:

<docs-pill-row>
  <docs-pill href="guide/animations/css" title="Animações complexas com CSS"/>
  <docs-pill href="guide/routing/route-transition-animations" title="Animações de transição de rota"/>
</docs-pill-row>
