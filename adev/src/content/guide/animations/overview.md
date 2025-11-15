<!-- ia-translate: true -->
# Introdução às animações Angular

IMPORTANTE: O pacote `@angular/animations` está agora depreciado. O time do Angular recomenda usar CSS nativo com `animate.enter` e `animate.leave` para animações em todo código novo. Saiba mais no novo [guia](guide/animations/enter-and-leave) de animações enter e leave. Veja também [Migrando do pacote de Animations do Angular](guide/animations/migration) para aprender como você pode começar a migrar para animações CSS puras em suas aplicações.

Animação fornece a ilusão de movimento: elementos HTML mudam o estilo ao longo do tempo.
Animações bem projetadas podem tornar sua aplicação mais divertida e direta de usar, mas elas não são apenas cosméticas.
Animações podem melhorar sua aplicação e experiência do usuário de várias formas:

- Sem animações, transições de páginas web podem parecer abruptas e chocantes
- Movimento aumenta muito a experiência do usuário, então animações dão aos usuários uma chance de detectar a resposta da aplicação às suas ações
- Boas animações intuitivamente chamam a atenção do usuário para onde ela é necessária

Tipicamente, animações envolvem múltiplas _transformações_ de estilo ao longo do tempo.
Um elemento HTML pode se mover, mudar de cor, crescer ou encolher, desvanecer ou deslizar para fora da página.
Essas mudanças podem ocorrer simultaneamente ou sequencialmente. Você pode controlar o timing de cada transformação.

O sistema de animação do Angular é construído sobre a funcionalidade CSS, o que significa que você pode animar qualquer propriedade que o navegador considere animável.
Isso inclui posições, tamanhos, transforms, cores, bordas e mais.
O W3C mantém uma lista de propriedades animáveis em sua página [CSS Transitions](https://www.w3.org/TR/css-transitions-1).

## Sobre este guia

Este guia cobre as funcionalidades básicas de animação do Angular para você começar a adicionar animações Angular ao seu projeto.

## Começando

Os principais módulos Angular para animações são `@angular/animations` e `@angular/platform-browser`.

Para começar a adicionar animações Angular ao seu projeto, importe os módulos específicos de animação junto com a funcionalidade padrão do Angular.

<docs-workflow>
<docs-step title="Habilitando o módulo de animações">
Importe `provideAnimationsAsync` de `@angular/platform-browser/animations/async` e adicione-o à lista de providers na chamada da função `bootstrapApplication`.

<docs-code header="Enabling Animations" language="ts" linenums>
bootstrapApplication(AppComponent, {
  providers: [
    provideAnimationsAsync(),
  ]
});
</docs-code>

<docs-callout important title="Se você precisa de animações imediatas em sua aplicação">
  Se você precisa ter uma animação acontecer imediatamente quando sua aplicação é carregada,
  você vai querer mudar para o módulo de animações carregado eagerly. Importe `provideAnimations`
  de `@angular/platform-browser/animations` em vez disso, e use `provideAnimations` **no lugar de**
  `provideAnimationsAsync` na chamada da função `bootstrapApplication`.
</docs-callout>

Para aplicações baseadas em `NgModule` importe `BrowserAnimationsModule`, que introduz as capacidades de animação no módulo raiz da aplicação Angular.

<docs-code header="app.module.ts" path="adev/src/content/examples/animations/src/app/app.module.1.ts"/>
</docs-step>
<docs-step title="Importando funções de animação em arquivos de components">
Se você planeja usar funções de animação específicas em arquivos de components, importe essas funções de `@angular/animations`.

<docs-code header="app.component.ts" path="adev/src/content/examples/animations/src/app/app.component.ts" visibleRegion="imports"/>

Veja todas as [funções de animação disponíveis](guide/legacy-animations#animations-api-summary) no final deste guia.

</docs-step>
<docs-step title="Adicionando a propriedade de metadados de animação">
No arquivo do component, adicione uma propriedade de metadados chamada `animations:` dentro do decorator `@Component()`.
Você coloca o trigger que define uma animação dentro da propriedade de metadados `animations`.

<docs-code header="app.component.ts" path="adev/src/content/examples/animations/src/app/app.component.ts" visibleRegion="decorator"/>
</docs-step>
</docs-workflow>

## Animando uma transição

Vamos animar uma transição que muda um único elemento HTML de um estado para outro.
Por exemplo, você pode especificar que um botão exibe **Open** ou **Closed** baseado na última ação do usuário.
Quando o botão está no estado `open`, ele é visível e amarelo.
Quando está no estado `closed`, ele é translúcido e azul.

Em HTML, esses atributos são definidos usando estilos CSS comuns como color e opacity.
No Angular, use a função `style()` para especificar um conjunto de estilos CSS para uso com animações.
Colete um conjunto de estilos em um estado de animação, e dê ao estado um nome, como `open` ou `closed`.

DICA: Vamos criar um novo component `open-close` para animar com transições simples.

Execute o seguinte comando no terminal para gerar o component:

<docs-code language="shell">

ng g component open-close

</docs-code>

Isso criará o component em `src/app/open-close.component.ts`.

### Estado e estilos de animação

Use a função [`state()`](api/animations/state) do Angular para definir diferentes estados para chamar no final de cada transição.
Esta função recebe dois argumentos:
Um nome único como `open` ou `closed` e uma função `style()`.

Use a função `style()` para definir um conjunto de estilos para associar com um nome de estado dado.
Você deve usar _camelCase_ para atributos de estilo que contêm hífens, como `backgroundColor` ou envolvê-los em aspas, como `'background-color'`.

Vamos ver como a função [`state()`](api/animations/state) do Angular funciona com a função `style⁣­(⁠)` para definir atributos de estilo CSS.
Neste trecho de código, múltiplos atributos de estilo são definidos ao mesmo tempo para o estado.
No estado `open`, o botão tem uma altura de 200 pixels, uma opacidade de 1 e uma cor de fundo amarela.

<docs-code header="open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="state1"/>

No seguinte estado `closed`, o botão tem uma altura de 100 pixels, uma opacidade de 0.8 e uma cor de fundo azul.

<docs-code header="open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="state2"/>

### Transições e timing

No Angular, você pode definir múltiplos estilos sem qualquer animação.
Contudo, sem refinamento adicional, o botão se transforma instantaneamente sem desvanecimento, sem encolhimento ou outro indicador visível de que uma mudança está ocorrendo.

Para tornar a mudança menos abrupta, você precisa definir uma _transição_ de animação para especificar as mudanças que ocorrem entre um estado e outro ao longo de um período de tempo.
A função `transition()` aceita dois argumentos:
O primeiro argumento aceita uma expressão que define a direção entre dois estados de transição, e o segundo argumento aceita um ou uma série de passos `animate()`.

Use a função `animate()` para definir o comprimento, atraso e easing de uma transição, e para designar a função de estilo para definir estilos enquanto as transições estão ocorrendo.
Use a função `animate()` para definir a função `keyframes()` para animações de múltiplos passos.
Essas definições são colocadas no segundo argumento da função `animate()`.

#### Metadados de animação: duração, atraso e easing

A função `animate()` \(segundo argumento da função transition\) aceita os parâmetros de entrada `timings` e `styles`.

O parâmetro `timings` recebe ou um número ou uma string definida em três partes.

<docs-code language="typescript">

animate (duration)

</docs-code>

ou

<docs-code language="typescript">

animate ('duration delay easing')

</docs-code>

A primeira parte, `duration`, é obrigatória.
A duração pode ser expressa em milissegundos como um número sem aspas, ou em segundos com aspas e um especificador de tempo.
Por exemplo, uma duração de um décimo de segundo pode ser expressa da seguinte forma:

- Como um número simples, em milissegundos:
  `100`

- Em uma string, como milissegundos:
  `'100ms'`

- Em uma string, como segundos:
  `'0.1s'`

O segundo argumento, `delay`, tem a mesma sintaxe que `duration`.
Por exemplo:

- Espere por 100ms e então execute por 200ms: `'0.2s 100ms'`

O terceiro argumento, `easing`, controla como a animação [acelera e desacelera](https://easings.net) durante seu tempo de execução.
Por exemplo, `ease-in` faz com que a animação comece lentamente e ganhe velocidade conforme progride.

- Espere por 100ms, execute por 200ms.
  Use uma curva de desaceleração para começar rápido e desacelerar lentamente para um ponto de repouso:
  `'0.2s 100ms ease-out'`

- Execute por 200ms, sem atraso.
  Use uma curva padrão para começar lento, acelerar no meio e então desacelerar lentamente no final:
  `'0.2s ease-in-out'`

- Comece imediatamente, execute por 200ms.
  Use uma curva de aceleração para começar lento e terminar em velocidade total:
  `'0.2s ease-in'`

DICA: Veja o tópico do site Material Design sobre [curvas de easing naturais](https://material.io/design/motion/speed.html#easing) para informações gerais sobre curvas de easing.

Este exemplo fornece uma transição de estado de `open` para `closed` com uma transição de 1 segundo entre estados.

<docs-code header="open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="transition1"/>

No trecho de código anterior, o operador `=>` indica transições unidirecionais, e `<=>` é bidirecional.
Dentro da transição, `animate()` especifica quanto tempo a transição leva.
Neste caso, a mudança de estado de `open` para `closed` leva 1 segundo, expresso aqui como `1s`.

Este exemplo adiciona uma transição de estado do estado `closed` para o estado `open` com um arco de animação de transição de 0.5 segundos.

<docs-code header="open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="transition2"/>

DICA: Algumas notas adicionais sobre o uso de estilos dentro das funções [`state`](api/animations/state) e `transition`.

- Use [`state()`](api/animations/state) para definir estilos que são aplicados no final de cada transição, eles persistem após a animação completar
- Use `transition()` para definir estilos intermediários, que criam a ilusão de movimento durante a animação
- Quando animações estão desabilitadas, estilos de `transition()` podem ser pulados, mas estilos de [`state()`](api/animations/state) não podem
- Inclua múltiplos pares de estados dentro do mesmo argumento `transition()`:

    <docs-code language="typescript">

  transition( 'on => off, off => void' )

    </docs-code>

### Acionando a animação

Uma animação requer um _trigger_, para que ela saiba quando começar.
A função `trigger()` coleta os estados e transições, e dá à animação um nome, para que você possa anexá-la ao elemento de acionamento no template HTML.

A função `trigger()` descreve o nome da propriedade para observar mudanças.
Quando uma mudança ocorre, o trigger inicia as ações incluídas em sua definição.
Essas ações podem ser transições ou outras funções, como veremos mais tarde.

Neste exemplo, vamos nomear o trigger `openClose`, e anexá-lo ao elemento `button`.
O trigger descreve os estados open e closed, e os timings para as duas transições.

DICA: Dentro de cada chamada de função `trigger()`, um elemento só pode estar em um estado em qualquer momento dado.
Contudo, é possível que múltiplos triggers estejam ativos ao mesmo tempo.

### Definindo animações e anexando-as ao template HTML

Animações são definidas nos metadados do component que controla o elemento HTML a ser animado.
Coloque o código que define suas animações sob a propriedade `animations:` dentro do decorator `@Component()`.

<docs-code header="open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="component"/>

Quando você definiu um trigger de animação para um component, anexe-o a um elemento no template daquele component envolvendo o nome do trigger em colchetes e precedendo-o com um símbolo `@`.
Então, você pode vincular o trigger a uma expressão de template usando a sintaxe padrão de property binding do Angular como mostrado abaixo, onde `triggerName` é o nome do trigger, e `expression` avalia para um estado de animação definido.

<docs-code language="typescript">

<div [@triggerName]="expression">…</div>;

</docs-code>

A animação é executada ou acionada quando o valor da expressão muda para um novo estado.

O seguinte trecho de código vincula o trigger ao valor da propriedade `isOpen`.

<docs-code header="open-close.component.html" path="adev/src/content/examples/animations/src/app/open-close.component.1.html" visibleRegion="trigger"/>

Neste exemplo, quando a expressão `isOpen` avalia para um estado definido de `open` ou `closed`, ela notifica o trigger `openClose` de uma mudança de estado.
Então cabe ao código `openClose` manipular a mudança de estado e iniciar uma animação de mudança de estado.

Para elementos entrando ou saindo de uma página \(inseridos ou removidos do DOM\), você pode tornar as animações condicionais.
Por exemplo, use `*ngIf` com o trigger de animação no template HTML.

DICA: No arquivo do component, defina o trigger que define as animações como o valor da propriedade `animations:` no decorator `@Component()`.

No arquivo de template HTML, use o nome do trigger para anexar as animações definidas ao elemento HTML a ser animado.

### Revisão de código

Aqui estão os arquivos de código discutidos no exemplo de transição.

<docs-code-multifile>
    <docs-code header="open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="component"/>
    <docs-code header="open-close.component.html" path="adev/src/content/examples/animations/src/app/open-close.component.1.html" visibleRegion="trigger"/>
    <docs-code header="open-close.component.css" path="adev/src/content/examples/animations/src/app/open-close.component.css"/>
</docs-code-multifile>

### Resumo

Você aprendeu a adicionar animação a uma transição entre dois estados, usando `style()` e [`state()`](api/animations/state) junto com `animate()` para o timing.

Aprenda sobre funcionalidades mais avançadas em animações Angular na seção Animation, começando com técnicas avançadas em [transição e triggers](guide/legacy-animations/transition-and-triggers).

## Resumo da API de Animations

A API funcional fornecida pelo módulo `@angular/animations` fornece uma linguagem específica de domínio \(DSL\) para criar e controlar animações em aplicações Angular.
Veja a [referência da API](api#animations) para uma listagem completa e detalhes de sintaxe das funções principais e estruturas de dados relacionadas.

| Nome da função                    | O que faz                                                                                                                                                                                                |
| :-------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `trigger()`                       | Inicia a animação e serve como um container para todas as outras chamadas de função de animação. Template HTML vincula a `triggerName`. Use o primeiro argumento para declarar um nome de trigger único. Usa sintaxe de array. |
| `style()`                         | Define um ou mais estilos CSS para usar em animações. Controla a aparência visual de elementos HTML durante animações. Usa sintaxe de objeto.                                                                 |
| [`state()`](api/animations/state) | Cria um conjunto nomeado de estilos CSS que devem ser aplicados em transição bem-sucedida para um dado estado. O estado pode então ser referenciado por nome dentro de outras funções de animação.                              |
| `animate()`                       | Especifica as informações de timing para uma transição. Valores opcionais para `delay` e `easing`. Pode conter chamadas `style()` dentro.                                                                            |
| `transition()`                    | Define a sequência de animação entre dois estados nomeados. Usa sintaxe de array.                                                                                                                                 |
| `keyframes()`                     | Permite uma mudança sequencial entre estilos dentro de um intervalo de tempo especificado. Use dentro de `animate()`. Pode incluir múltiplas chamadas `style()` dentro de cada `keyframe()`. Usa sintaxe de array.                       |
| [`group()`](api/animations/group) | Especifica um grupo de passos de animação \(_animações internas_\) para serem executados em paralelo. A animação continua apenas após todos os passos de animação internos terem completado. Usado dentro de `sequence()` ou `transition()`.     |
| `query()`                         | Encontra um ou mais elementos HTML internos dentro do elemento atual.                                                                                                                                           |
| `sequence()`                      | Especifica uma lista de passos de animação que são executados sequencialmente, um por um.                                                                                                                                  |
| `stagger()`                       | Escalonar o tempo de início para animações de múltiplos elementos.                                                                                                                                            |
| `animation()`                     | Produz uma animação reutilizável que pode ser invocada de outro lugar. Usado junto com `useAnimation()`.                                                                                                      |
| `useAnimation()`                  | Ativa uma animação reutilizável. Usado com `animation()`.                                                                                                                                                    |
| `animateChild()`                  | Permite que animações em componentes filhos sejam executadas dentro do mesmo timeframe que o pai.                                                                                                                    |

</table>

## Mais sobre animações Angular

DICA: Confira esta [apresentação](https://www.youtube.com/watch?v=rnTK9meY5us), mostrada na conferência AngularConnect em novembro de 2017, e o [código fonte](https://github.com/matsko/animationsftw.in) que a acompanha.

Você também pode se interessar pelo seguinte:

<docs-pill-row>
  <docs-pill href="guide/legacy-animations/transition-and-triggers" title="Transition and triggers"/>
  <docs-pill href="guide/legacy-animations/complex-sequences" title="Complex animation sequences"/>
  <docs-pill href="guide/legacy-animations/reusable-animations" title="Reusable animations"/>
  <docs-pill href="guide/routing/route-transition-animations" title="Route transition animations"/>
  <docs-pill href="guide/animations/migration" title="Migrating to Native CSS Animations"/>
</docs-pill-row>
