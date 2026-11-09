<!-- ia-translate: true -->
# Migrando para longe do pacote Animations do Angular {#migrating-away-from-angulars-animations-package}

O pacote `@angular/animations` está descontinuado a partir da v20.2, que também introduziu o novo recurso `animate.enter` e `animate.leave` para adicionar animações à sua aplicação. Usando esses novos recursos, você pode substituir todas as animações baseadas em `@angular/animations` por CSS puro ou bibliotecas de animação JS. Remover `@angular/animations` da sua aplicação pode reduzir significativamente o tamanho do seu bundle JavaScript. Animações CSS nativas geralmente oferecem performance superior, pois podem se beneficiar de aceleração por hardware. Este guia percorre o processo de refatoração do seu código de `@angular/animations` para animações CSS nativas.

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

Assim como com o pacote de Animations, você pode criar animações reutilizáveis que podem ser compartilhadas em toda a sua aplicação. A versão do pacote de Animations fazia uso da função `animation()` em um arquivo TypeScript compartilhado. A versão em CSS nativo é parecida, mas fica em um arquivo CSS compartilhado.

#### Com pacote de Animations {#with-animations-package}

<docs-code header="animations.ts" path="adev/src/content/examples/animations/src/app/animations.1.ts" region="animation-example"/>

#### Com CSS nativo {#with-native-css}

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="animation-shared"/>

Adicionar a classe `animated-class` a um elemento acionará a animação nesse elemento.

## Animando uma transição {#animating-a-transition}

### Animando estado e estilos {#animating-state-and-styles}

O pacote de Animations permitia definir vários estados usando a função [`state()`](api/animations/state) dentro de um component. Exemplos podem ser um estado `open` ou `closed` contendo os estilos de cada respectivo estado dentro da definição. Por exemplo:

#### Com pacote de Animations {#animating-state-and-styles-with-animations-package}

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="state1"/>

Esse mesmo comportamento pode ser obtido nativamente usando classes CSS, seja com uma animação de keyframe ou com estilização de transition.

#### Com CSS nativo {#animating-state-and-styles-with-native-css}

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="animation-states"/>

Acionar o estado `open` ou `closed` é feito alternando classes no elemento em seu component. Você pode encontrar exemplos de como fazer isso em nosso [guia de template](guide/templates/binding#css-class-and-style-property-bindings).

Você pode ver exemplos semelhantes no guia de template para [animar estilos diretamente](guide/templates/binding#css-style-properties).

### Transitions, timing e easing {#transitions-timing-and-easing}

A função `animate()` do pacote de Animations permite fornecer timing, como duração, delays e easing. Isso pode ser feito nativamente com CSS, usando várias propriedades CSS ou propriedades de atalho.

Especifique `animation-duration`, `animation-delay` e `animation-timing-function` para uma animação de keyframe em CSS, ou alternativamente use a propriedade de atalho `animation`.

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="animation-timing"/>

Da mesma forma, você pode usar `transition-duration`, `transition-delay` e `transition-timing-function`, e o atalho `transition`, para animações que não usam `@keyframes`.

<docs-code header="animations.css" path="adev/src/content/examples/animations/src/app/animations.css" region="transition-timing"/>

### Acionando uma animação {#triggering-an-animation}

O pacote de Animations exigia especificar triggers usando a função `trigger()` e aninhar todos os seus estados dentro dela. Com CSS nativo, isso é desnecessário. Animações podem ser acionadas alternando estilos ou classes CSS. Assim que uma classe está presente em um elemento, a animação acontece. Remover a classe reverte o elemento para qualquer CSS definido para ele. Isso resulta em significativamente menos código para fazer a mesma animação. Aqui está um exemplo:

#### Com pacote de Animations {#triggering-an-animation-with-animations-package}

<docs-code-multifile>
    <docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/animations-package/open-close.ts" />
    <docs-code header="open-close.html" path="adev/src/content/examples/animations/src/app/animations-package/open-close.html" />
    <docs-code header="open-close.css" path="adev/src/content/examples/animations/src/app/animations-package/open-close.css"/>
</docs-code-multifile>

#### Com CSS nativo {#triggering-an-animation-with-native-css}

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/open-close.ts">
    <docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/native-css/open-close.ts" />
    <docs-code header="open-close.html" path="adev/src/content/examples/animations/src/app/native-css/open-close.html" />
    <docs-code header="open-close.css" path="adev/src/content/examples/animations/src/app/native-css/open-close.css"/>
</docs-code-multifile>

## Transition e triggers {#transition-and-triggers}

### Estado predefinido e correspondência com wildcard {#predefined-state-and-wildcard-matching}

O pacote de Animations oferece a capacidade de associar seus estados definidos a uma transition por meio de strings. Por exemplo, animar de `open` para `closed` seria `open => closed`. Você pode usar wildcards para associar qualquer estado a um estado alvo, como `* => closed`, e a palavra-chave `void` pode ser usada para estados de entrada e saída. Por exemplo: `* => void` para quando um elemento sai de uma view, ou `void => *` para quando o elemento entra em uma view.

Esses padrões de correspondência de estados não são necessários de forma alguma ao animar diretamente com CSS. Você pode gerenciar quais transitions e animações `@keyframes` são aplicadas com base em quaisquer classes e/ou estilos que você definir nos elementos. Você também pode adicionar `@starting-style` para controlar como o elemento aparece ao entrar imediatamente no DOM.

### Cálculo automático de propriedades com wildcards {#automatic-property-calculation-with-wildcards}

O pacote de Animations oferece a capacidade de animar coisas que historicamente foram difíceis de animar, como animar uma altura definida para `height: auto`. Agora você pode fazer isso também com CSS puro.

#### Com pacote de Animations {#automatic-property-calculation-with-animations-package}

<docs-code-multifile>
    <docs-code header="auto-height.ts" path="adev/src/content/examples/animations/src/app/animations-package/auto-height.ts" />
    <docs-code header="auto-height.html" path="adev/src/content/examples/animations/src/app/animations-package/auto-height.html" />
    <docs-code header="auto-height.css" path="adev/src/content/examples/animations/src/app/animations-package/auto-height.css" />
</docs-code-multifile>

Você pode usar CSS Grid para animar para altura automática.

#### Com CSS nativo {#automatic-property-calculation-with-native-css}

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/auto-height.ts">
    <docs-code header="auto-height.ts" path="adev/src/content/examples/animations/src/app/native-css/auto-height.ts" />
    <docs-code header="auto-height.html" path="adev/src/content/examples/animations/src/app/native-css/auto-height.html" />
    <docs-code header="auto-height.css" path="adev/src/content/examples/animations/src/app/native-css/auto-height.css"  />
</docs-code-multifile>

Se você não precisa se preocupar em suportar todos os navegadores, também pode conferir `calc-size()`, que é a verdadeira solução para animar altura automática. Veja [a documentação do MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/calc-size) e [este tutorial](https://frontendmasters.com/blog/one-of-the-boss-battles-of-css-is-almost-won-transitioning-to-auto/) para mais informações.

### Animar entrada e saída de uma view {#animate-entering-and-leaving-a-view}

O pacote de Animations oferecia o padrão de correspondência mencionado anteriormente para entrada e saída, mas também incluía os aliases de atalho `:enter` e `:leave`.

#### Com pacote de Animations {#enter-and-leave-with-animations-package}

<docs-code-multifile>
    <docs-code header="insert-remove.ts" path="adev/src/content/examples/animations/src/app/animations-package/insert-remove.ts" />
    <docs-code header="insert-remove.html" path="adev/src/content/examples/animations/src/app/animations-package/insert-remove.html" />
    <docs-code header="insert-remove.css" path="adev/src/content/examples/animations/src/app/animations-package/insert-remove.css" />
</docs-code-multifile>

#### Com CSS nativo {#enter-with-native-css}

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/insert.ts">
    <docs-code header="insert.ts" path="adev/src/content/examples/animations/src/app/native-css/insert.ts" />
    <docs-code header="insert.html" path="adev/src/content/examples/animations/src/app/native-css/insert.html" />
    <docs-code header="insert.css" path="adev/src/content/examples/animations/src/app/native-css/insert.css"  />
</docs-code-multifile>

#### Com CSS nativo {#leave-with-native-css}

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/remove.ts">
    <docs-code header="remove.ts" path="adev/src/content/examples/animations/src/app/native-css/remove.ts" />
    <docs-code header="remove.html" path="adev/src/content/examples/animations/src/app/native-css/remove.html" />
    <docs-code header="remove.css" path="adev/src/content/examples/animations/src/app/native-css/remove.css"  />
</docs-code-multifile>

Para mais informações sobre `animate.enter` e `animate.leave`, veja o [guia de animações Enter e Leave](guide/animations).

### Animando incremento e decremento {#animating-increment-and-decrement}

Junto com os mencionados `:enter` e `:leave`, também existem `:increment` e `:decrement`. Você pode animar esses também adicionando e removendo classes. Diferente dos aliases integrados do pacote de Animations, não há aplicação automática de classes quando os valores sobem ou descem. Você pode aplicar as classes apropriadas programaticamente. Aqui está um exemplo:

#### Com pacote de Animations {#increment-and-decrement-with-animations-package}

<docs-code-multifile>
    <docs-code header="increment-decrement.ts" path="adev/src/content/examples/animations/src/app/animations-package/increment-decrement.ts" />
    <docs-code header="increment-decrement.html" path="adev/src/content/examples/animations/src/app/animations-package/increment-decrement.html" />
    <docs-code header="increment-decrement.css" path="adev/src/content/examples/animations/src/app/animations-package/increment-decrement.css" />
</docs-code-multifile>

#### Com CSS nativo {#increment-and-decrement-with-native-css}

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.ts">
    <docs-code header="increment-decrement.ts" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.ts" />
    <docs-code header="increment-decrement.html" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.html" />
    <docs-code header="increment-decrement.css" path="adev/src/content/examples/animations/src/app/native-css/increment-decrement.css" />
</docs-code-multifile>

### Animações pai / filho {#parent---child-animations}

Diferente do pacote de Animations, quando várias animações são especificadas dentro de um determinado component, nenhuma animação tem prioridade sobre outra e nada bloqueia qualquer animação de disparar. Qualquer sequenciamento de animações precisaria ser tratado pela definição da sua animação CSS, usando `animation` / `transition-delay` e/ou usando `animationend` ou `transitionend` para tratar a adição do próximo CSS a ser animado.

Animações filhas disparam apenas dentro do mesmo template de component. No pacote `@angular/animations`, animações pai podiam consultar e disparar animações em components filhos aninhados usando `query()` e `animateChild()`. Com `animate.leave` e animações CSS nativas, as animações definidas dentro de templates de components filhos aninhados não disparam quando um component pai remove um elemento ou uma view. Somente animações aninhadas dentro do mesmo template de component Angular são executadas. Veja o [guia de animações Enter e Leave](guide/animations#element-removal-order) para mais informações sobre isso.

### Desabilitando uma animação ou todas as animações {#disabling-an-animation-or-all-animations}

Com animações CSS nativas, se você quiser desabilitar as animações que especificou, você tem várias opções.

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

O pacote de Animations expunha callbacks para você usar caso queira fazer algo quando a animação terminar. Animações CSS nativas também têm esses callbacks.

[`OnAnimationStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationstart_event)  
[`OnAnimationEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationend_event)  
[`OnAnimationIteration`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationiteration_event)  
[`OnAnimationCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationcancel_event)

[`OnTransitionStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionstart_event)  
[`OnTransitionRun`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionrun_event)  
[`OnTransitionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionend_event)  
[`OnTransitionCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitioncancel_event)

A Web Animations API tem muita funcionalidade adicional. [Dê uma olhada na documentação](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) para ver todas as APIs de animação disponíveis.

NOTA: Esteja ciente de problemas de bubbling com esses callbacks. Se você está animando filhos e pais, os eventos sobem dos filhos para os pais. Considere parar a propagação ou olhar mais detalhes dentro do evento para determinar se você está respondendo ao evento alvo desejado, em vez de um evento subindo de um nó filho. Você pode examinar a propriedade `animationname` ou as propriedades sendo transicionadas para verificar se você tem os nós certos.

## Sequências complexas {#complex-sequences}

O pacote de Animations tem funcionalidade integrada para criar sequências complexas. Essas sequências são todas totalmente possíveis sem o pacote de Animations.

### Direcionando elementos específicos {#targeting-specific-elements}

No pacote de Animations, você podia direcionar elementos específicos usando a função `query()` para encontrar elementos específicos por um nome de classe CSS, de forma semelhante a [`document.querySelector()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector). Isso é desnecessário em um cenário de animações CSS nativas. Em vez disso, você pode usar seus seletores CSS para direcionar subclasses e aplicar qualquer `transform` ou `animation` desejada.

Para alternar classes de nós filhos dentro de um template, você pode usar bindings de classe e de estilo para adicionar as animações nos pontos certos.

### Stagger()

A função `stagger()` permitia atrasar a animação de cada item de uma lista de itens por um tempo especificado, para criar um efeito cascata. Você pode replicar esse comportamento em CSS nativo usando `animation-delay` ou `transition-delay`. Aqui está um exemplo de como esse CSS pode ficar.

#### Com pacote de Animations {#stagger-with-animations-package}

<docs-code-multifile>
    <docs-code header="stagger.ts" path="adev/src/content/examples/animations/src/app/animations-package/stagger.ts" />
    <docs-code header="stagger.html" path="adev/src/content/examples/animations/src/app/animations-package/stagger.html" />
    <docs-code header="stagger.css" path="adev/src/content/examples/animations/src/app/animations-package/stagger.css" />
</docs-code-multifile>

#### Com CSS nativo {#stagger-with-native-css}

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/stagger.ts">
    <docs-code header="stagger.ts" path="adev/src/content/examples/animations/src/app/native-css/stagger.ts" />
    <docs-code header="stagger.html" path="adev/src/content/examples/animations/src/app/native-css/stagger.html" />
    <docs-code header="stagger.css" path="adev/src/content/examples/animations/src/app/native-css/stagger.css" />
</docs-code-multifile>

### Animações paralelas {#parallel-animations}

O pacote de Animations tem uma função `group()` para reproduzir várias animações ao mesmo tempo. Em CSS, você tem controle total sobre o timing da animação. Se você tiver várias animações definidas, poderá aplicar todas elas de uma só vez.

```css
.target-element {
  animation:
    rotate 3s,
    fade-in 2s;
}
```

Neste exemplo, as animações `rotate` e `fade-in` disparam ao mesmo tempo.

### Animando os itens de uma lista reordenada {#animating-the-items-of-a-reordering-list}

Itens reordenados em uma lista funcionam imediatamente usando as técnicas descritas anteriormente. Nenhum trabalho especial adicional é necessário. Itens em um loop `@for` serão removidos e readicionados corretamente, o que disparará animações usando `@starting-styles` para animações de entrada. Alternativamente, você pode usar `animate.enter` para esse mesmo comportamento. Use `animate.leave` para animar elementos conforme eles são removidos, como visto no exemplo acima.

#### Com pacote de Animations {#reordering-list-with-animations-package}

<docs-code-multifile>
    <docs-code header="reorder.ts" path="adev/src/content/examples/animations/src/app/animations-package/reorder.ts" />
    <docs-code header="reorder.html" path="adev/src/content/examples/animations/src/app/animations-package/reorder.html" />
    <docs-code header="reorder.css" path="adev/src/content/examples/animations/src/app/animations-package/reorder.css" />
</docs-code-multifile>

#### Com CSS nativo {#reordering-list-with-native-css}

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/reorder.ts">
    <docs-code header="reorder.ts" path="adev/src/content/examples/animations/src/app/native-css/reorder.ts" />
    <docs-code header="reorder.html" path="adev/src/content/examples/animations/src/app/native-css/reorder.html" />
    <docs-code header="reorder.css" path="adev/src/content/examples/animations/src/app/native-css/reorder.css" />
</docs-code-multifile>

## Migrando usos de AnimationPlayer {#migrating-usages-of-animationplayer}

A classe `AnimationPlayer` permite acesso a uma animação para fazer coisas mais avançadas, como pausar, reproduzir, reiniciar e finalizar uma animação por meio de código. Todas essas operações também podem ser tratadas nativamente.

Você pode recuperar animações de um elemento diretamente usando [`Element.getAnimations()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAnimations). Isso retorna um array de cada [`Animation`](https://developer.mozilla.org/en-US/docs/Web/API/Animation) naquele elemento. Você pode usar a API `Animation` para fazer muito mais do que o `AnimationPlayer` do pacote de Animations oferecia. A partir daqui você pode `cancel()`, `play()`, `pause()`, `reverse()` e muito mais. Esta API nativa deve fornecer tudo que você precisa para controlar suas animações.

## Transições de rota {#route-transitions}

Você pode usar view transitions para animar entre rotas. Veja o [guia de animações de transição de rota](guide/routing/route-transition-animations) para começar.
