<!-- ia-translate: true -->
# Migrando do package Animations do Angular

O package `@angular/animations` está deprecado a partir da v20.2, que também introduziu o novo recurso `animate.enter` e `animate.leave` para adicionar animations à sua aplicação. Usando esses novos recursos, você pode substituir todas as animations baseadas em `@angular/animations` com CSS puro ou bibliotecas de animation JS. Remover `@angular/animations` da sua aplicação pode reduzir significativamente o tamanho do seu bundle JavaScript. Animations CSS nativas geralmente oferecem desempenho superior, pois podem se beneficiar de aceleração de hardware. Este guia percorre o processo de refatorar seu código de `@angular/animations` para animations CSS nativas.

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

Assim como com o package de animations, você pode criar animations reutilizáveis que podem ser compartilhadas em toda a sua aplicação. A versão do package de animations tinha você usando a função `animation()` em um arquivo typescript compartilhado. A versão CSS nativa disso é semelhante, mas vive em um arquivo CSS compartilhado.

#### Com Animations Package

<docs-code header="src/app/animations.ts" path="adev/src/content/examples/animations/src/app/animations.1.ts" visibleRegion="animation-example"/>

#### Com CSS Nativo

<docs-code header="src/app/animations.css" path="adev/src/content/examples/animations/src/app/animations.css" visibleRegion="animation-shared"/>

Adicionar a classe `animated-class` a um elemento dispararia a animation nesse elemento.

## Animando uma Transição

### Animando State e Styles

O package de animations permitia que você definisse vários states usando a função [`state()`](api/animations/state) dentro de um component. Exemplos podem ser um state `open` ou `closed` contendo os styles para cada state respectivo dentro da definição. Por exemplo:

#### Com Animations Package

<docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="state1"/>

Esse mesmo comportamento pode ser realizado nativamente usando classes CSS usando uma keyframe animation ou estilo de transition.

#### Com CSS Nativo

<docs-code header="src/app/animations.css" path="adev/src/content/examples/animations/src/app/animations.css" visibleRegion="animation-states"/>

Disparar o state `open` ou `closed` é feito alternando classes no elemento em seu component. Você pode encontrar exemplos de como fazer isso em nosso [guia de templates](guide/templates/binding#css-class-and-style-property-bindings).

Você pode ver exemplos semelhantes no guia de templates para [animar styles diretamente](guide/templates/binding#css-style-properties).

### Transitions, Timing, e Easing

A função `animate()` do package de animations permite fornecer timing, como duração, delays e easing. Isso pode ser feito nativamente com CSS usando várias propriedades CSS ou propriedades shorthand.

Especifique `animation-duration`, `animation-delay`, e `animation-timing-function` para uma keyframe animation em CSS, ou alternativamente use a propriedade shorthand `animation`.

<docs-code header="src/app/animations.css" path="adev/src/content/examples/animations/src/app/animations.css" visibleRegion="animation-timing"/>

Similarmente, você pode usar `transition-duration`, `transition-delay`, e `transition-timing-function` e o shorthand `transition` para animations que não estão usando `@keyframes`.

<docs-code header="src/app/animations.css" path="adev/src/content/examples/animations/src/app/animations.css" visibleRegion="transition-timing"/>

### Disparando uma Animation

O package de animations exigia especificar triggers usando a função `trigger()` e aninhar todos os seus states dentro dele. Com CSS nativo, isso é desnecessário. Animations podem ser disparadas alternando estilos ou classes CSS. Uma vez que uma classe está presente em um elemento, a animation ocorrerá. Remover a classe reverterá o elemento de volta para qualquer CSS que esteja definido para esse elemento. Isso resulta em significativamente menos código para fazer a mesma animation. Aqui está um exemplo:

#### Com Animations Package

<docs-code-multifile>
    <docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/animations-package/open-close.component.ts" />
    <docs-code header="src/app/open-close.component.html" path="adev/src/content/examples/animations/src/app/animations-package/open-close.component.html" />
    <docs-code header="src/app/open-close.component.css" path="adev/src/content/examples/animations/src/app/animations-package/open-close.component.css"/>
</docs-code-multifile>

#### Com CSS Nativo

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/open-close.component.ts">
    <docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/native-css/open-close.component.ts" />
    <docs-code header="src/app/open-close.component.html" path="adev/src/content/examples/animations/src/app/native-css/open-close.component.html" />
    <docs-code header="src/app/open-close.component.css" path="adev/src/content/examples/animations/src/app/native-css/open-close.component.css"/>
</docs-code-multifile>

## Transition e Triggers

### State predefinido e wildcard matching

O package de animations oferece a habilidade de combinar seus states definidos a uma transition via strings. Por exemplo, animar de open para closed seria `open => closed`. Você pode usar wildcards para combinar qualquer state com um state alvo, como `* => closed` e a palavra-chave `void` pode ser usada para states de entrada e saída. Por exemplo: `* => void` para quando um elemento sai de uma view ou `void => *` para quando o elemento entra em uma view.

Esses padrões de combinação de state não são necessários quando animando com CSS diretamente. Você pode gerenciar quais transitions e animations `@keyframes` se aplicam baseado em quaisquer classes que você definir e/ou styles que você definir nos elementos. Você também pode adicionar `@starting-style` para controlar como o elemento parece ao entrar imediatamente no DOM.

### Cálculo Automático de Propriedade com Wildcards

O package de animations oferece a habilidade de animar coisas que historicamente têm sido difíceis de animar, como animar uma altura definida para `height: auto`. Você agora pode fazer isso com CSS puro também.

#### Com Animations Package

<docs-code-multifile>
    <docs-code header="src/app/auto-height.component.ts" path="adev/src/content/examples/animations/src/app/animations-package/auto-height.component.ts" />
    <docs-code header="src/app/auto-height.component.html" path="adev/src/content/examples/animations/src/app/animations-package/auto-height.component.html" />
    <docs-code header="src/app/auto-height.component.css" path="adev/src/content/examples/animations/src/app/animations-package/auto-height.component.css" />
</docs-code-multifile>

Você pode usar css-grid para animar para altura automática.

#### Com CSS Nativo

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/auto-height.component.ts">
    <docs-code header="src/app/auto-height.component.ts" path="adev/src/content/examples/animations/src/app/native-css/auto-height.component.ts" />
    <docs-code header="src/app/auto-height.component.html" path="adev/src/content/examples/animations/src/app/native-css/auto-height.component.html" />
    <docs-code header="src/app/auto-height.component.css" path="adev/src/content/examples/animations/src/app/native-css/auto-height.component.css"  />
</docs-code-multifile>

Se você não precisa se preocupar em dar suporte a todos os browsers, você também pode conferir `calc-size()`, que é a verdadeira solução para animar altura automática. Veja [documentação do MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/calc-size) e (este tutorial)[https://frontendmasters.com/blog/one-of-the-boss-battles-of-css-is-almost-won-transitioning-to-auto/] para mais informações.

### Animar entrada e saída de uma view

O package de animations oferecia o padrão de combinação mencionado anteriormente para entrada e saída, mas também incluía os aliases shorthand de `:enter` e `:leave`.

#### Com Animations Package

<docs-code-multifile>
    <docs-code header="src/app/insert-remove.component.ts" path="adev/src/content/examples/animations/src/app/animations-package/insert-remove.component.ts" />
    <docs-code header="src/app/insert-remove.component.html" path="adev/src/content/examples/animations/src/app/animations-package/insert-remove.component.html" />
    <docs-code header="src/app/insert-remove.component.css" path="adev/src/content/examples/animations/src/app/animations-package/insert-remove.component.css" />
</docs-code-multifile>

Aqui está como a mesma coisa pode ser realizada sem o package de animations usando `animate.enter`.

#### Com CSS Nativo

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/insert.component.ts">
    <docs-code header="src/app/insert.component.ts" path="adev/src/content/examples/animations/src/app/native-css/insert.component.ts" />
    <docs-code header="src/app/insert.component.html" path="adev/src/content/examples/animations/src/app/native-css/insert.component.html" />
    <docs-code header="src/app/insert.component.css" path="adev/src/content/examples/animations/src/app/native-css/insert.component.css"  />
</docs-code-multifile>

Use `animate.leave` para animar elementos conforme eles saem da view, que aplicará as classes CSS especificadas ao elemento conforme ele sai da view.

#### Com CSS Nativo

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/remove.component.ts">
    <docs-code header="src/app/remove.component.ts" path="adev/src/content/examples/animations/src/app/native-css/remove.component.ts" />
    <docs-code header="src/app/remove.component.html" path="adev/src/content/examples/animations/src/app/native-css/remove.component.html" />
    <docs-code header="src/app/remove.component.css" path="adev/src/content/examples/animations/src/app/native-css/remove.component.css"  />
</docs-code-multifile>

Para mais informações sobre `animate.enter` e `animate.leave`, veja o [guia de animations Enter e Leave](guide/animations).

### Animando incremento e decremento

Junto com os mencionados `:enter` e `:leave`, há também `:increment` e `:decrement`. Você pode animar esses também adicionando e removendo classes. Diferente dos aliases integrados do package de animations, não há aplicação automática de classes quando os valores sobem ou descem. Você pode aplicar as classes apropriadas programaticamente. Aqui está um exemplo:

#### Com Animations Package

<docs-code-multifile>
    <docs-code header="src/app/increment-decrement.component.ts" path="adev/src/content/examples/animations/src/app/animations-package/increment-decrement.component.ts" />
    <docs-code header="src/app/increment-decrement.component.html" path="adev/src/content/examples/animations/src/app/animations-package/increment-decrement.component.html" />
    <docs-code header="src/app/increment-decrement.component.css" path="adev/src/content/examples/animations/src/app/animations-package/increment-decrement.component.css" />
</docs-code-multifile>

#### Com CSS Nativo

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.component.ts">
    <docs-code header="src/app/increment-decrement.component.ts" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.component.ts" />
    <docs-code header="src/app/increment-decrement.component.html" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.component.html" />
    <docs-code header="src/app/increment-decrement.component.css" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.component.css" />
</docs-code-multifile>

### Animations Pai / Filho

Diferente do package de animations, quando múltiplas animations são especificadas dentro de um determinado component, nenhuma animation tem prioridade sobre outra e nada bloqueia nenhuma animation de disparar. Qualquer sequenciamento de animations teria que ser tratado pela sua definição de sua animation CSS, usando delay de animation / transition, e / ou usando `animationend` ou `transitionend` para lidar com a adição do próximo CSS a ser animado.

### Desabilitando uma animation ou todas as animations

Com animations CSS nativas, se você gostaria de desabilitar as animations que especificou, você tem várias opções.

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

O package de animations expôs callbacks para você usar no caso de querer fazer algo quando a animation terminou. Animations CSS nativas também têm esses callbacks.

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

O package de animations tem funcionalidade integrada para criar sequências complexas. Essas sequências são todas totalmente possíveis sem o package de animations.

### Mirando elementos específicos

No package de animations, você poderia mirar elementos específicos usando a função `query()` para encontrar elementos específicos por um nome de classe CSS, similar a [`document.querySelector()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector). Isso é desnecessário em um mundo de animation CSS nativa. Em vez disso, você pode usar seus seletores CSS para mirar sub-classes e aplicar qualquer `transform` ou `animation` desejada.

Para alternar classes para nós filhos dentro de um template, você pode usar bindings de classe e estilo para adicionar as animations nos pontos certos.

### Stagger()

A função `stagger()` permitia que você atrasasse a animation de cada item em uma lista de itens por um tempo especificado para criar um efeito cascata. Você pode replicar esse comportamento em CSS nativo utilizando `animation-delay` ou `transition-delay`. Aqui está um exemplo de como esse CSS poderia parecer.

#### Com Animations Package

<docs-code-multifile>
    <docs-code header="src/app/stagger.component.ts" path="adev/src/content/examples/animations/src/app/animations-package/stagger.component.ts" />
    <docs-code header="src/app/stagger.component.html" path="adev/src/content/examples/animations/src/app/animations-package/stagger.component.html" />
    <docs-code header="src/app/stagger.component.css" path="adev/src/content/examples/animations/src/app/animations-package/stagger.component.css" />
</docs-code-multifile>

#### Com CSS Nativo

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/stagger.component.ts">
    <docs-code header="src/app/stagger.component.ts" path="adev/src/content/examples/animations/src/app/native-css/stagger.component.ts" />
    <docs-code header="src/app/stagger.component.html" path="adev/src/content/examples/animations/src/app/native-css/stagger.component.html" />
    <docs-code header="src/app/stagger.component.css" path="adev/src/content/examples/animations/src/app/native-css/stagger.component.css" />
</docs-code-multifile>

### Animations Paralelas

O package de animations tem uma função `group()` para reproduzir múltiplas animations ao mesmo tempo. Em CSS, você tem controle total sobre o timing de animation. Se você tem múltiplas animations definidas, você pode aplicar todas elas de uma vez.

```css
.target-element {
  animation: rotate 3s, fade-in 2s;
}
```

Neste exemplo, as animations `rotate` e `fade-in` disparam ao mesmo tempo.

### Animando os itens de uma lista de reordenação

Itens reordenando em uma lista funcionam imediatamente usando as técnicas descritas anteriormente. Nenhum trabalho especial adicional é necessário. Itens em um loop `@for` serão removidos e re-adicionados corretamente, o que disparará animations usando `@starting-styles` para animations de entrada. Alternativamente, você pode usar `animate.enter` para esse mesmo comportamento. Use `animate.leave` para animar elementos conforme eles são removidos, como visto no exemplo acima.

#### Com Animations Package<

<docs-code-multifile>
    <docs-code header="src/app/reorder.component.ts" path="adev/src/content/examples/animations/src/app/animations-package/reorder.component.ts" />
    <docs-code header="src/app/reorder.component.html" path="adev/src/content/examples/animations/src/app/animations-package/reorder.component.html" />
    <docs-code header="src/app/reorder.component.css" path="adev/src/content/examples/animations/src/app/animations-package/reorder.component.css" />
</docs-code-multifile>

#### Com CSS Nativo

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/reorder.component.ts">
    <docs-code header="src/app/reorder.component.ts" path="adev/src/content/examples/animations/src/app/native-css/reorder.component.ts" />
    <docs-code header="src/app/reorder.component.html" path="adev/src/content/examples/animations/src/app/native-css/reorder.component.html" />
    <docs-code header="src/app/reorder.component.css" path="adev/src/content/examples/animations/src/app/native-css/reorder.component.css" />
</docs-code-multifile>

## Migrando usos de AnimationPlayer

A classe `AnimationPlayer` permite acesso a uma animation para fazer coisas mais avançadas como pausar, reproduzir, reiniciar e finalizar uma animation através de código. Todas essas coisas podem ser tratadas nativamente também.

Você pode recuperar animations de um elemento diretamente usando [`Element.getAnimations()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAnimations). Isso retorna um array de cada [`Animation`](https://developer.mozilla.org/en-US/docs/Web/API/Animation) nesse elemento. Você pode usar a API `Animation` para fazer muito mais do que você poderia com o que o `AnimationPlayer` do package de animations oferecia. A partir daqui você pode `cancel()`, `play()`, `pause()`, `reverse()` e muito mais. Esta API nativa deve fornecer tudo que você precisa para controlar suas animations.

## Route Transitions

Você pode usar view transitions para animar entre routes. Veja o [Guia de Route Transition Animations](guide/routing/route-transition-animations) para começar.
