<!-- ia-translate: true -->
# Animando sua aplicação com CSS

CSS oferece um conjunto robusto de ferramentas para você criar animações bonitas e envolventes dentro de sua aplicação.

## Como escrever animações em CSS nativo {#how-to-write-animations-in-native-css}

Se você nunca escreveu animações CSS nativas, existem vários guias excelentes para começar. Aqui estão alguns deles:
[Guia de Animações CSS do MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations/Using_CSS_animations)
[Guia de Animações CSS3 do W3Schools](https://www.w3schools.com/css/css3_animations.asp)
[Tutorial Completo de Animações CSS](https://www.lambdatest.com/blog/css-animations-tutorial/)
[Animação CSS para Iniciantes](https://thoughtbot.com/blog/css-animation-for-beginners)

e alguns vídeos:
[Aprenda Animação CSS em 9 Minutos](https://www.youtube.com/watch?v=z2LQYsZhsFw)
[Playlist de Tutorial de Animação CSS do Net Ninja](https://www.youtube.com/watch?v=jgw82b5Y2MU&list=PL4cUxeGkcC9iGYgmEd2dm3zAKzyCGDtM5)

Confira alguns destes guias e tutoriais, e depois volte a este guia.

## Criando animações reutilizáveis {#creating-reusable-animations}

Você pode criar animações reutilizáveis que podem ser compartilhadas em toda a sua aplicação usando `@keyframes`. Defina animações de keyframe em um arquivo CSS compartilhado, e você poderá reutilizar essas animações de keyframe onde quiser dentro de sua aplicação.

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="animation-shared"/>

Adicionar a classe `animated-class` a um elemento acionará a animação nesse elemento.

## Animando uma transição {#animating-a-transition}

### Animando estado e estilos {#animating-state-and-styles}

Você pode querer animar entre dois estados diferentes, por exemplo, quando um elemento é aberto ou fechado. Você pode fazer isso usando classes CSS, seja com uma animação de keyframe ou com estilização de transition.

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="animation-states"/>

Acionar o estado `open` ou `closed` é feito alternando classes no elemento em seu component. Você pode encontrar exemplos de como fazer isso em nosso [guia de template](guide/templates/binding#css-class-and-style-property-bindings).

Você pode ver exemplos semelhantes no guia de template para [animar estilos diretamente](guide/templates/binding#css-style-properties).

### Transitions, timing e easing {#transitions-timing-and-easing}

Animar frequentemente exige ajustar timing, delays e comportamentos de easing. Isso pode ser feito usando várias propriedades CSS ou propriedades de atalho.

Especifique `animation-duration`, `animation-delay` e `animation-timing-function` para uma animação de keyframe em CSS, ou alternativamente use a propriedade de atalho `animation`.

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="animation-timing"/>

Da mesma forma, você pode usar `transition-duration`, `transition-delay` e `transition-timing-function`, e o atalho `transition`, para animações que não usam `@keyframes`.

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="transition-timing"/>

### Acionando uma animação {#triggering-an-animation}

Animações podem ser acionadas alternando estilos ou classes CSS. Assim que uma classe está presente em um elemento, a animação acontece. Remover a classe reverte o elemento para qualquer CSS definido para ele. Aqui está um exemplo:

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/open-close.ts">
    <docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/native-css/open-close.ts" />
    <docs-code header="open-close.html" path="adev/src/content/examples/animations/src/app/native-css/open-close.html" />
    <docs-code header="open-close.css" path="adev/src/content/examples/animations/src/app/native-css/open-close.css"/>
</docs-code-multifile>

## Transition e triggers {#transition-and-triggers}

### Animando altura automática {#animating-auto-height}

Você pode usar CSS Grid para animar para altura automática.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/auto-height.ts">
    <docs-code header="auto-height.ts" path="adev/src/content/examples/animations/src/app/native-css/auto-height.ts" />
    <docs-code header="auto-height.html" path="adev/src/content/examples/animations/src/app/native-css/auto-height.html" />
    <docs-code header="auto-height.css" path="adev/src/content/examples/animations/src/app/native-css/auto-height.css"  />
</docs-code-multifile>

Se você não precisa se preocupar em suportar todos os navegadores, também pode conferir `calc-size()`, que é a verdadeira solução para animar altura automática. Veja [a documentação do MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/calc-size) e [este tutorial](https://frontendmasters.com/blog/one-of-the-boss-battles-of-css-is-almost-won-transitioning-to-auto/) para mais informações.

### Animar entrada e saída de uma view {#animate-entering-and-leaving-a-view}

Você pode criar animações para quando um item entra em uma view ou sai de uma view. Vamos começar vendo como animar um elemento entrando em uma view. Faremos isso com `animate.enter`, que aplicará classes de animação quando um elemento entrar na view.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/insert.ts">
    <docs-code header="insert.ts" path="adev/src/content/examples/animations/src/app/native-css/insert.ts" />
    <docs-code header="insert.html" path="adev/src/content/examples/animations/src/app/native-css/insert.html" />
    <docs-code header="insert.css" path="adev/src/content/examples/animations/src/app/native-css/insert.css"  />
</docs-code-multifile>

Animar um elemento quando ele sai da view é semelhante a animar quando ele entra. Use `animate.leave` para especificar quais classes CSS aplicar quando o elemento sair da view.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/remove.ts">
    <docs-code header="remove.ts" path="adev/src/content/examples/animations/src/app/native-css/remove.ts" />
    <docs-code header="remove.html" path="adev/src/content/examples/animations/src/app/native-css/remove.html" />
    <docs-code header="remove.css" path="adev/src/content/examples/animations/src/app/native-css/remove.css"  />
</docs-code-multifile>

NOTA: Animações `animate.leave` de elementos filhos disparam apenas dentro do mesmo template de component. Animações `animate.leave` de components aninhados não disparam quando um elemento pai é removido.

Para mais informações sobre `animate.enter` e `animate.leave`, veja o [guia de animações Enter e Leave](guide/animations).

### Animando incremento e decremento {#animating-increment-and-decrement}

Animar em incremento e decremento é um padrão comum em aplicações. Aqui está um exemplo de como você pode realizar esse comportamento.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.ts">
    <docs-code header="increment-decrement.ts" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.ts" />
    <docs-code header="increment-decrement.html" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.html" />
    <docs-code header="increment-decrement.css" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.css" />
</docs-code-multifile>

### Desabilitando uma animação ou todas as animações {#disabling-an-animation-or-all-animations}

Se você quiser desabilitar as animações que especificou, você tem várias opções.

1. Crie uma classe personalizada que force animation e transition para `none`.

```css
.no-animation {
  animation: none !important;
  transition: none !important;
}
```

Aplicar esta classe a um elemento impede que qualquer animação dispare nesse elemento. Você pode, alternativamente, delimitar isso a todo o seu DOM ou a uma seção dele para impor esse comportamento. No entanto, isso impede que eventos de animação disparem. Se você está aguardando eventos de animação para remoção de elemento, essa solução não funcionará. Uma solução alternativa é definir as durações para 1 milissegundo.

2. Use a media query [`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) para garantir que nenhuma animação seja reproduzida para usuários que preferem menos animação.

3. Impeça a adição de classes de animação programaticamente

### Callbacks de animação {#animation-callbacks}

Se você tem ações que quer executar em certos pontos durante as animações, há vários eventos disponíveis que você pode escutar. Aqui estão alguns deles.

[`OnAnimationStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationstart_event)  
[`OnAnimationEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationend_event)  
[`OnAnimationIteration`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationiteration_event)  
[`OnAnimationCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationcancel_event)

[`OnTransitionStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionstart_event)  
[`OnTransitionRun`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionrun_event)  
[`OnTransitionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionend_event)  
[`OnTransitionCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitioncancel_event)

A Web Animations API tem muita funcionalidade adicional. [Dê uma olhada na documentação](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) para ver todas as APIs de animação disponíveis.

NOTA: Esteja ciente de problemas de bubbling com esses callbacks. Se você está animando filhos e pais, os eventos sobem dos filhos para os pais. Considere parar a propagação ou olhar mais detalhes dentro do evento para determinar se você está respondendo ao evento alvo desejado em vez de um evento subindo de um nó filho. Você pode examinar a propriedade `animationname` ou as propriedades sendo transicionadas para verificar se você tem os nós certos.

## Sequências complexas {#complex-sequences}

Animações costumam ser mais complicadas do que apenas um simples fade in ou fade out. Você pode ter várias sequências complicadas de animações que deseja executar. Vamos ver alguns desses cenários possíveis.

### Escalonando animações em uma lista {#staggering-animations-in-a-list}

Um efeito comum é escalonar as animações de cada item de uma lista para criar um efeito cascata. Isso pode ser feito usando `animation-delay` ou `transition-delay`. Aqui está um exemplo de como esse CSS pode ficar.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/stagger.ts">
    <docs-code header="stagger.ts" path="adev/src/content/examples/animations/src/app/native-css/stagger.ts" />
    <docs-code header="stagger.html" path="adev/src/content/examples/animations/src/app/native-css/stagger.html" />
    <docs-code header="stagger.css" path="adev/src/content/examples/animations/src/app/native-css/stagger.css" />
</docs-code-multifile>

### Animações paralelas {#parallel-animations}

Você pode aplicar várias animações a um elemento de uma só vez usando a propriedade de atalho `animation`. Cada uma pode ter suas próprias durações e delays. Isso permite compor animações e criar efeitos complicados.

```css
.target-element {
  animation:
    rotate 3s,
    fade-in 2s;
}
```

Neste exemplo, as animações `rotate` e `fade-in` disparam ao mesmo tempo, mas têm durações diferentes.

### Animando os itens de uma lista reordenada {#animating-the-items-of-a-reordering-list}

Itens em um loop `@for` serão removidos e readicionados, o que disparará animações usando `@starting-styles` para animações de entrada. Alternativamente, você pode usar `animate.enter` para esse mesmo comportamento. Use `animate.leave` para animar elementos conforme eles são removidos, como visto no exemplo abaixo.

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/reorder.ts">
    <docs-code header="reorder.ts" path="adev/src/content/examples/animations/src/app/native-css/reorder.ts" />
    <docs-code header="reorder.html" path="adev/src/content/examples/animations/src/app/native-css/reorder.html" />
    <docs-code header="reorder.css" path="adev/src/content/examples/animations/src/app/native-css/reorder.css" />
</docs-code-multifile>

## Controle programático de animações {#programmatic-control-of-animations}

Você pode recuperar animações de um elemento diretamente usando [`Element.getAnimations()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAnimations). Isso retorna um array de cada [`Animation`](https://developer.mozilla.org/en-US/docs/Web/API/Animation) naquele elemento. Você pode usar a API `Animation` para fazer muito mais do que poderia com o que o `AnimationPlayer` do pacote de animations oferecia. A partir daqui você pode `cancel()`, `play()`, `pause()`, `reverse()` e muito mais. Esta API nativa deve fornecer tudo que você precisa para controlar suas animações.

## Mais sobre animações do Angular {#more-on-angular-animations}

Você também pode estar interessado no seguinte:

<docs-pill-row>
  <docs-pill href="guide/animations" title="Animações Enter e Leave"/>
  <docs-pill href="guide/routing/route-transition-animations" title="Animações de transição de rota"/>
</docs-pill-row>
