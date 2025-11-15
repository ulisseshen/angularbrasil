<!-- ia-translate: true -->
# Animando sua Aplicação com CSS

CSS oferece um conjunto robusto de ferramentas para você criar animações bonitas e envolventes dentro da sua aplicação.

## Como escrever animations em CSS nativo

Se você nunca escreveu nenhuma animation em CSS nativo, existem vários guias excelentes para você começar. Aqui estão alguns deles:
[Guia de CSS Animations do MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations/Using_CSS_animations)
[Guia de CSS3 Animations da W3Schools](https://www.w3schools.com/css/css3_animations.asp)
[Tutorial Completo de CSS Animations](https://www.lambdatest.com/blog/css-animations-tutorial/)
[CSS Animation para Iniciantes](https://thoughtbot.com/blog/css-animation-for-beginners)

e alguns vídeos:
[Aprenda CSS Animation em 9 Minutos](https://www.youtube.com/watch?v=z2LQYsZhsFw)
[Playlist de Tutorial CSS Animation do Net Ninja](https://www.youtube.com/watch?v=jgw82b5Y2MU&list=PL4cUxeGkcC9iGYgmEd2dm3zAKzyCGDtM5)

Confira alguns desses vários guias e tutoriais, e depois volte para este guia.

## Criando Animations Reutilizáveis

Você pode criar animations reutilizáveis que podem ser compartilhadas em toda a sua aplicação usando `@keyframes`. Defina keyframe animations em um arquivo CSS compartilhado, e você será capaz de reutilizar essas keyframe animations onde quiser dentro da sua aplicação.

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" visibleRegion="animation-shared"/>

Adicionar a classe `animated-class` a um elemento dispararia a animation nesse elemento.

## Animando uma Transição

### Animando State e Styles

Você pode querer animar entre dois estados diferentes, por exemplo quando um elemento é aberto ou fechado. Você pode fazer isso usando classes CSS usando uma keyframe animation ou estilo de transition.

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" visibleRegion="animation-states"/>

Disparar o state `open` ou `closed` é feito alternando classes no elemento em seu component. Você pode encontrar exemplos de como fazer isso em nosso [guia de templates](guide/templates/binding#css-class-and-style-property-bindings).

Você pode ver exemplos semelhantes no guia de templates para [animar styles diretamente](guide/templates/binding#css-style-properties).

### Transitions, Timing, e Easing

Animar frequentemente requer ajustar timing, delays e comportamentos de easing. Isso pode ser feito usando várias propriedades CSS ou propriedades shorthand.

Especifique `animation-duration`, `animation-delay`, e `animation-timing-function` para uma keyframe animation em CSS, ou alternativamente use a propriedade shorthand `animation`.

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" visibleRegion="animation-timing"/>

Similarmente, você pode usar `transition-duration`, `transition-delay`, e `transition-timing-function` e o shorthand `transition` para animations que não estão usando `@keyframes`.

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" visibleRegion="transition-timing"/>

### Disparando uma Animation

Animations podem ser disparadas alternando estilos ou classes CSS. Uma vez que uma classe está presente em um elemento, a animation ocorrerá. Remover a classe reverterá o elemento de volta para qualquer CSS que esteja definido para esse elemento. Aqui está um exemplo:

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/open-close.component.ts">
    <docs-code header="open-close.component.ts" path="adev/src/content/examples/animations/src/app/native-css/open-close.component.ts" />
    <docs-code header="open-close.component.html" path="adev/src/content/examples/animations/src/app/native-css/open-close.component.html" />
    <docs-code header="open-close.component.css" path="adev/src/content/examples/animations/src/app/native-css/open-close.component.css"/>
</docs-code-multifile>

## Transition e Triggers

### Animando Auto Height

Você pode usar css-grid para animar para altura automática.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/auto-height.component.ts">
    <docs-code header="auto-height.component.ts" path="adev/src/content/examples/animations/src/app/native-css/auto-height.component.ts" />
    <docs-code header="auto-height.component.html" path="adev/src/content/examples/animations/src/app/native-css/auto-height.component.html" />
    <docs-code header="auto-height.component.css" path="adev/src/content/examples/animations/src/app/native-css/auto-height.component.css"  />
</docs-code-multifile>

Se você não precisa se preocupar em dar suporte a todos os browsers, você também pode conferir `calc-size()`, que é a verdadeira solução para animar altura automática. Veja [documentação do MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/calc-size) e (este tutorial)[https://frontendmasters.com/blog/one-of-the-boss-battles-of-css-is-almost-won-transitioning-to-auto/] para mais informações.

### Animar entrada e saída de uma view

Você pode criar animations para quando um item entra em uma view ou sai de uma view. Vamos começar olhando como animar um elemento entrando em uma view. Faremos isso com `animate.enter`, que aplicará classes de animation quando um elemento entrar na view.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/insert.component.ts">
    <docs-code header="insert.component.ts" path="adev/src/content/examples/animations/src/app/native-css/insert.component.ts" />
    <docs-code header="insert.component.html" path="adev/src/content/examples/animations/src/app/native-css/insert.component.html" />
    <docs-code header="insert.component.css" path="adev/src/content/examples/animations/src/app/native-css/insert.component.css"  />
</docs-code-multifile>

Animar um elemento quando ele sai da view é semelhante a animar quando entra em uma view. Use `animate.leave` para especificar quais classes CSS aplicar quando o elemento sai da view.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/remove.component.ts">
    <docs-code header="remove.component.ts" path="adev/src/content/examples/animations/src/app/native-css/remove.component.ts" />
    <docs-code header="remove.component.html" path="adev/src/content/examples/animations/src/app/native-css/remove.component.html" />
    <docs-code header="remove.component.css" path="adev/src/content/examples/animations/src/app/native-css/remove.component.css"  />
</docs-code-multifile>

Para mais informações sobre `animate.enter` e `animate.leave`, veja o [guia de animations Enter e Leave](guide/animations).

### Animando incremento e decremento

Animar incremento e decremento é um padrão comum em aplicações. Aqui está um exemplo de como você pode realizar esse comportamento.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.component.ts">
    <docs-code header="increment-decrement.component.ts" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.component.ts" />
    <docs-code header="increment-decrement.component.html" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.component.html" />
    <docs-code header="increment-decrement.component.css" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.component.css" />
</docs-code-multifile>

### Desabilitando uma animation ou todas as animations

Se você gostaria de desabilitar as animations que especificou, você tem várias opções.

1. Crie uma classe customizada que força animation e transition para `none`.

```css
.no-animation {
  animation: none !important;
  transition: none !important;
}
```

Aplicar esta classe a um elemento previne qualquer animation de disparar nesse elemento. Você poderia alternativamente definir o escopo disso para todo o seu DOM ou seção do seu DOM para forçar esse comportamento. No entanto, isso previne eventos de animation de disparar. Se você está aguardando eventos de animation para remoção de elementos, essa solução não funcionará. Uma solução alternativa é definir durações para 1 milissegundo em vez disso.

2. Use a media query [`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) para garantir que nenhuma animation seja reproduzida para usuários que preferem menos animation.

3. Prevenir a adição de classes de animation programaticamente

### Animation Callbacks

Se você tem ações que gostaria de executar em certos pontos durante as animations, há vários eventos disponíveis que você pode escutar. Aqui estão alguns deles.

[`OnAnimationStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationstart_event)
[`OnAnimationEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationend_event)
[`OnAnimationIteration`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationitration_event)
[`OnAnimationCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationcancel_event)

[`OnTransitionStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionstart_event)
[`OnTransitionRun`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionrun_event)
[`OnTransitionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionend_event)
[`OnTransitionCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitioncancel_event)

A Web Animations API tem muita funcionalidade adicional. [Dê uma olhada na documentação](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) para ver todas as APIs de animation disponíveis.

NOTA: Esteja ciente de problemas de bubbling com esses callbacks. Se você está animando filhos e pais, os eventos sobem de filhos para pais. Considere parar a propagação ou olhar mais detalhes dentro do evento para determinar se você está respondendo ao alvo do evento desejado em vez de um evento subindo de um nó filho. Você pode examinar a propriedade `animationname` ou as propriedades sendo transicionadas para verificar se você tem os nós corretos.

## Sequências Complexas

Animations são frequentemente mais complicadas do que apenas um simples fade in ou fade out. Você pode ter muitas sequências complicadas de animations que pode querer executar. Vamos dar uma olhada em alguns desses cenários possíveis.

### Escalonando animations em uma lista

Um efeito comum é escalonar as animations de cada item em uma lista para criar um efeito cascata. Isso pode ser feito utilizando `animation-delay` ou `transition-delay`. Aqui está um exemplo de como esse CSS poderia parecer.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/stagger.component.ts">
    <docs-code header="stagger.component.ts" path="adev/src/content/examples/animations/src/app/native-css/stagger.component.ts" />
    <docs-code header="stagger.component.html" path="adev/src/content/examples/animations/src/app/native-css/stagger.component.html" />
    <docs-code header="stagger.component.css" path="adev/src/content/examples/animations/src/app/native-css/stagger.component.css" />
</docs-code-multifile>

### Animations Paralelas

Você pode aplicar múltiplas animations a um elemento de uma vez usando a propriedade shorthand `animation`. Cada uma pode ter suas próprias durações e delays. Isso permite que você componha animations juntas e crie efeitos complicados.

```css
.target-element {
  animation: rotate 3s, fade-in 2s;
}
```

Neste exemplo, as animations `rotate` e `fade-in` disparam ao mesmo tempo, mas têm durações diferentes.

### Animando os itens de uma lista de reordenação

Itens em um loop `@for` serão removidos e re-adicionados, o que disparará animations usando `@starting-styles` para animations de entrada. Alternativamente, você pode usar `animate.enter` para esse mesmo comportamento. Use `animate.leave` para animar elementos conforme eles são removidos, como visto no exemplo abaixo.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/reorder.component.ts">
    <docs-code header="reorder.component.ts" path="adev/src/content/examples/animations/src/app/native-css/reorder.component.ts" />
    <docs-code header="reorder.component.html" path="adev/src/content/examples/animations/src/app/native-css/reorder.component.html" />
    <docs-code header="reorder.component.css" path="adev/src/content/examples/animations/src/app/native-css/reorder.component.css" />
</docs-code-multifile>

## Controle programático de animations

Você pode recuperar animations de um elemento diretamente usando [`Element.getAnimations()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAnimations). Isso retorna um array de cada [`Animation`](https://developer.mozilla.org/en-US/docs/Web/API/Animation) nesse elemento. Você pode usar a API `Animation` para fazer muito mais do que você poderia com o que o `AnimationPlayer` do package de animations oferecia. A partir daqui você pode `cancel()`, `play()`, `pause()`, `reverse()` e muito mais. Esta API nativa deve fornecer tudo que você precisa para controlar suas animations.

## Mais sobre animations Angular

Você também pode estar interessado no seguinte:

<docs-pill-row>
  <docs-pill href="guide/animations" title="Enter e Leave animations"/>
  <docs-pill href="guide/routing/route-transition-animations" title="Route transition animations"/>
</docs-pill-row>
