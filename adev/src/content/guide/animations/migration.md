<!-- ia-translate: true -->
# Migrando do pacote de Animações do Angular

O pacote `@angular/animations` está descontinuado a partir da v20.2, que também introduziu os novos recursos `animate.enter` e `animate.leave` para adicionar animações à sua aplicação. Usando esses novos recursos, você pode substituir todas as animações baseadas em `@angular/animations` por CSS puro ou bibliotecas de animação JS. Remover `@angular/animations` da sua aplicação pode reduzir significativamente o tamanho do seu bundle JavaScript. Animações CSS nativas geralmente oferecem performance superior, pois podem se beneficiar de aceleração por hardware. Este guia percorre o processo de refatoração do seu código de `@angular/animations` para animações CSS nativas.

## Como escrever animações em CSS nativo

Se você nunca escreveu animações CSS nativas, existem vários guias excelentes para começar. Aqui estão alguns deles:
[Guia de Animações CSS do MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations/Using_CSS_animations)
[Guia de Animações CSS3 do W3Schools](https://www.w3schools.com/css/css3_animations.asp)
[Tutorial Completo de Animações CSS](https://www.lambdatest.com/blog/css-animations-tutorial/)
[Animação CSS para Iniciantes](https://thoughtbot.com/blog/css-animation-for-beginners)

e alguns vídeos:
[Aprenda Animação CSS em 9 Minutos](https://www.youtube.com/watch?v=z2LQYsZhsFw)
[Playlist de Tutorial de Animação CSS do Net Ninja](https://www.youtube.com/watch?v=jgw82b5Y2MU&list=PL4cUxeGkcC9iGYgmEd2dm3zAKzyCGDtM5)

Confira alguns destes vários guias e tutoriais, e depois volte a este guia.

## Criando Animações Reutilizáveis

Assim como com o pacote de animations, você pode criar animações reutilizáveis que podem ser compartilhadas em toda a sua aplicação. A versão do pacote de animations tinha você usando a função `animation()` em um arquivo typescript compartilhado. A versão CSS nativa disso é similar, mas fica em um arquivo CSS compartilhado.

#### Com Pacote de Animations

<docs-code header="src/app/animations.ts" path="adev/src/content/examples/animations/src/app/animations.1.ts" visibleRegion="animation-example"/>

#### Com CSS Nativo

<docs-code header="src/app/animations.css" path="adev/src/content/examples/animations/src/app/animations.css" visibleRegion="animation-shared"/>

Adicionar a classe `animated-class` a um elemento acionaria a animação nesse elemento.

## Animando uma Transição

### Animando Estado e Estilos

O pacote de animations permitia que você definisse vários estados usando a função [`state()`](api/animations/state) dentro de um component. Exemplos podem ser um estado `open` ou `closed` contendo os estilos para cada respectivo estado dentro da definição. Por exemplo:

#### Com Pacote de Animations

<docs-code header="src/app/open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="state1"/>

Esse mesmo comportamento pode ser realizado nativamente usando classes CSS, seja usando uma animação de keyframe ou estilização de transition.

#### Com CSS Nativo

<docs-code header="src/app/animations.css" path="adev/src/content/examples/animations/src/app/animations.css" visibleRegion="animation-states"/>

Acionar o estado `open` ou `closed` é feito alternando classes no elemento em seu component. Você pode encontrar exemplos de como fazer isso em nosso [guia de template](guide/templates/binding#css-class-and-style-property-bindings).

Você pode ver exemplos semelhantes no guia de template para [animar estilos diretamente](guide/templates/binding#css-style-properties).

### Transitions, Timing e Easing

A função `animate()` do pacote de animations permite fornecer timing, como duração, delays e easing. Isso pode ser feito nativamente com CSS usando várias propriedades CSS ou propriedades de atalho.

Especifique `animation-duration`, `animation-delay` e `animation-timing-function` para uma animação de keyframe em CSS, ou alternativamente use a propriedade de atalho `animation`.

<docs-code header="src/app/animations.css" path="adev/src/content/examples/animations/src/app/animations.css" visibleRegion="animation-timing"/>

Da mesma forma, você pode usar `transition-duration`, `transition-delay` e `transition-timing-function` e o atalho `transition` para animações que não estão usando `@keyframes`.

<docs-code header="src/app/animations.css" path="adev/src/content/examples/animations/src/app/animations.css" visibleRegion="transition-timing"/>

### Acionando uma Animação

O pacote de animations requeria especificar triggers usando a função `trigger()` e aninhar todos os seus estados dentro dela. Com CSS nativo, isso é desnecessário. Animações podem ser acionadas alternando estilos ou classes CSS. Uma vez que uma classe está presente em um elemento, a animação ocorrerá. Remover a classe reverterá o elemento de volta para qualquer CSS que esteja definido para esse elemento. Isso resulta em significativamente menos código para fazer a mesma animação. Aqui está um exemplo:

#### Com Pacote de Animations

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

### Estado Predefinido e correspondência com wildcard

O pacote de animations oferece a capacidade de corresponder seus estados definidos a uma transition via strings. Por exemplo, animar de open para closed seria `open => closed`. Você pode usar wildcards para corresponder qualquer estado a um estado alvo, como `* => closed` e a palavra-chave `void` pode ser usada para estados de entrada e saída. Por exemplo: `* => void` para quando um elemento sai de uma view ou `void => *` para quando o elemento entra em uma view.

Esses padrões de correspondência de estado não são necessários de forma alguma ao animar com CSS diretamente. Você pode gerenciar quais transitions e animações `@keyframes` aplicam com base em quaisquer classes que você define e/ou estilos que você define nos elementos. Você também pode adicionar `@starting-style` para controlar como o elemento fica ao entrar imediatamente no DOM.

### Cálculo Automático de Propriedade com Wildcards

O pacote de animations oferece a capacidade de animar coisas que foram historicamente difíceis de animar, como animar uma altura definida para `height: auto`. Você agora pode fazer isso com CSS puro também.

#### Com Pacote de Animations

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

Se você não precisa se preocupar em suportar todos os browsers, você também pode conferir `calc-size()`, que é a verdadeira solução para animar altura automática. Veja [a documentação do MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/calc-size) e [este tutorial](https://frontendmasters.com/blog/one-of-the-boss-battles-of-css-is-almost-won-transitioning-to-auto/) para mais informações.

### Animar entrada e saída de uma view

O pacote de animations oferecia o padrão de correspondência mencionado anteriormente para entrada e saída, mas também incluía os aliases de atalho de `:enter` e `:leave`.

#### Com Pacote de Animations

<docs-code-multifile>
    <docs-code header="src/app/insert-remove.component.ts" path="adev/src/content/examples/animations/src/app/animations-package/insert-remove.component.ts" />
    <docs-code header="src/app/insert-remove.component.html" path="adev/src/content/examples/animations/src/app/animations-package/insert-remove.component.html" />
    <docs-code header="src/app/insert-remove.component.css" path="adev/src/content/examples/animations/src/app/animations-package/insert-remove.component.css" />
</docs-code-multifile>

Aqui está como a mesma coisa pode ser realizada sem o pacote de animations usando `animate.enter`.

#### Com CSS Nativo

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/insert.component.ts">
    <docs-code header="src/app/insert.component.ts" path="adev/src/content/examples/animations/src/app/native-css/insert.component.ts" />
    <docs-code header="src/app/insert.component.html" path="adev/src/content/examples/animations/src/app/native-css/insert.component.html" />
    <docs-code header="src/app/insert.component.css" path="adev/src/content/examples/animations/src/app/native-css/insert.component.css"  />
</docs-code-multifile>

Use `animate.leave` para animar elementos à medida que eles saem da view, o que aplicará as classes CSS especificadas ao elemento à medida que ele sai da view.

#### Com CSS Nativo

<docs-code-multifile preview path="adev/src/content/examples/animations/src/app/native-css/remove.component.ts">
    <docs-code header="src/app/remove.component.ts" path="adev/src/content/examples/animations/src/app/native-css/remove.component.ts" />
    <docs-code header="src/app/remove.component.html" path="adev/src/content/examples/animations/src/app/native-css/remove.component.html" />
    <docs-code header="src/app/remove.component.css" path="adev/src/content/examples/animations/src/app/native-css/remove.component.css"  />
</docs-code-multifile>

Para mais informações sobre `animate.enter` e `animate.leave`, veja o [guia de animações Enter e Leave](guide/animations).

### Animando incremento e decremento

Juntamente com os mencionados `:enter` e `:leave`, também há `:increment` e `:decrement`. Você pode animar esses também adicionando e removendo classes. Ao contrário dos aliases integrados do pacote de animation, não há aplicação automática de classes quando os valores sobem ou descem. Você pode aplicar as classes apropriadas programaticamente. Aqui está um exemplo:

#### Com Pacote de Animations

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

### Animações Pai / Filho

Ao contrário do pacote de animations, quando múltiplas animações são especificadas dentro de um determinado component, nenhuma animação tem prioridade sobre outra e nada bloqueia qualquer animação de disparar. Qualquer sequenciamento de animações teria que ser tratado pela sua definição da sua animação CSS, usando animation / transition delay, e/ou usando `animationend` ou `transitionend` para tratar a adição do próximo CSS a ser animado.

### Desabilitando uma animação ou todas as animações

Com animações CSS nativas, se você quiser desabilitar as animações que especificou, você tem múltiplas opções.

1. Crie uma classe personalizada que force animation e transition para `none`.

```css
.no-animation {
  animation: none !important;
  transition: none !important;
}
```

Aplicar esta classe a um elemento impede que qualquer animação seja disparada nesse elemento. Você poderia alternativamente delimitar isso ao seu DOM inteiro ou seção do seu DOM para aplicar esse comportamento. No entanto, isso impede que eventos de animação sejam disparados. Se você está aguardando eventos de animação para remoção de elemento, essa solução não funcionará. Uma solução alternativa é definir as durações para 1 milissegundo.

2. Use a media query [`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) para garantir que nenhuma animação seja reproduzida para usuários que preferem menos animação.

3. Previna adicionar classes de animação programaticamente

### Callbacks de Animação

O pacote de animations expunha callbacks para você usar no caso de querer fazer algo quando a animação terminou. Animações CSS nativas também têm esses callbacks.

[`OnAnimationStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationstart_event)
[`OnAnimationEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationend_event)
[`OnAnimationIteration`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationitration_event)
[`OnAnimationCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationcancel_event)

[`OnTransitionStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionstart_event)
[`OnTransitionRun`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionrun_event)
[`OnTransitionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionend_event)
[`OnTransitionCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitioncancel_event)

A Web Animations API tem muita funcionalidade adicional. [Dê uma olhada na documentação](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) para ver todas as APIs de animação disponíveis.

NOTA: Esteja ciente de problemas de bubbling com esses callbacks. Se você está animando filhos e pais, os eventos sobem dos filhos para os pais. Considere parar a propagação ou olhar mais detalhes dentro do evento para determinar se você está respondendo ao evento alvo desejado em vez de um evento subindo de um nó filho. Você pode examinar a propriedade `animationname` ou as propriedades sendo transicionadas para verificar se você tem os nós certos.

## Sequências Complexas

O pacote de animations tem funcionalidade integrada para criar sequências complexas. Essas sequências são todas inteiramente possíveis sem o pacote de animations.

### Direcionando elementos específicos

No pacote de animations, você poderia direcionar elementos específicos usando a função `query()` para encontrar elementos específicos por um nome de classe CSS, similar a [`document.querySelector()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector). Isso é desnecessário em um mundo de animação CSS nativa. Em vez disso, você pode usar seus seletores CSS para direcionar subclasses e aplicar qualquer `transform` ou `animation` desejada.

Para alternar classes para nós filhos dentro de um template, você pode usar bindings de classe e estilo para adicionar as animações nos pontos certos.

### Stagger()

A função `stagger()` permitia que você atrasasse a animação de cada item em uma lista de itens por um tempo especificado para criar um efeito cascata. Você pode replicar esse comportamento em CSS nativo utilizando `animation-delay` ou `transition-delay`. Aqui está um exemplo de como esse CSS pode parecer.

#### Com Pacote de Animations

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

### Animações Paralelas

O pacote de animations tem uma função `group()` para reproduzir múltiplas animações ao mesmo tempo. Em CSS, você tem controle total sobre o timing da animação. Se você tem múltiplas animações definidas, você pode aplicar todas elas de uma vez.

```css
.target-element {
  animation: rotate 3s, fade-in 2s;
}
```

Neste exemplo, as animações `rotate` e `fade-in` disparam ao mesmo tempo.

### Animando os itens de uma lista reordenada

Itens reordenando em uma lista funciona imediatamente usando as técnicas descritas anteriormente. Nenhum trabalho especial adicional é necessário. Itens em um loop `@for` serão removidos e readicionados adequadamente, o que disparará animações usando `@starting-styles` para animações de entrada. Alternativamente, você pode usar `animate.enter` para esse mesmo comportamento. Use `animate.leave` para animar elementos à medida que eles são removidos, como visto no exemplo acima.

#### Com Pacote de Animations<

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

A classe `AnimationPlayer` permite acesso a uma animação para fazer coisas mais avançadas como pausar, reproduzir, reiniciar e terminar uma animação através de código. Todas essas coisas podem ser tratadas nativamente também.

Você pode recuperar animações de um elemento diretamente usando [`Element.getAnimations()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getAnimations). Isso retorna um array de cada [`Animation`](https://developer.mozilla.org/en-US/docs/Web/API/Animation) naquele elemento. Você pode usar a API `Animation` para fazer muito mais do que poderia com o que o `AnimationPlayer` do pacote de animations oferecia. A partir daqui você pode `cancel()`, `play()`, `pause()`, `reverse()` e muito mais. Esta API nativa deve fornecer tudo que você precisa para controlar suas animações.

## Transições de Rota

Você pode usar view transitions para animar entre rotas. Veja o [Guia de Animações de Transição de Rota](guide/routing/route-transition-animations) para começar.
