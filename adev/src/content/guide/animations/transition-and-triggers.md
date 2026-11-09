<!-- ia-translate: true -->
# Transições e triggers de animação {#animation-transitions-and-triggers}

IMPORTANTE: O pacote `@angular/animations` agora está depreciado. A equipe do Angular recomenda usar CSS nativo com `animate.enter` e `animate.leave` para animações em todos os códigos novos. Saiba mais no novo [guia de animação](guide/animations) de entrada e saída. Veja também [Migrando do pacote de Animations do Angular](guide/animations/migration) para aprender como você pode começar a migrar para animações CSS puras em suas aplicações.

Este guia aprofunda os estados de transição especiais, como o wildcard `*` e o `void`. Ele também mostra como esses estados são usados para elementos que entram e saem de uma view.
Esta seção também explora múltiplos triggers de animação, callbacks de animação e animações baseadas em sequência usando keyframes.

## Estados predefinidos e correspondência com wildcard {#predefined-states-and-wildcard-matching}

No Angular, os estados de transição podem ser definidos explicitamente pela função [`state()`](api/animations/state) ou usando os estados predefinidos `*` (wildcard) e `void`.

### Estado wildcard {#wildcard-state}

Um asterisco `*`, ou _wildcard_, corresponde a qualquer estado de animação.
Isso é útil para definir transições que se aplicam independentemente do estado inicial ou final do elemento HTML.

Por exemplo, uma transição `open => *` se aplica quando o estado do elemento muda de open para qualquer outro estado.

<img alt="wildcard state expressions" src="assets/images/guide/animations/wildcard-state-500.png">

O código a seguir é outro exemplo que usa o estado wildcard junto com o exemplo anterior, que usa os estados `open` e `closed`.
Em vez de definir cada par de transição estado a estado, qualquer transição para `closed` leva 1 segundo, e qualquer transição para `open` leva 0,5 segundo.

Isso permite adicionar novos estados sem precisar incluir transições separadas para cada um.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="trigger-wildcard1"/>

Use a sintaxe de seta dupla para especificar transições estado a estado nas duas direções.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="trigger-wildcard2"/>

### Use o estado wildcard com múltiplos estados de transição {#use-wildcard-state-with-multiple-transition-states}

No exemplo do botão de dois estados, o wildcard não é tão útil, porque há apenas dois estados possíveis, `open` e `closed`.
Em geral, use estados wildcard quando um elemento tiver vários estados potenciais para os quais possa mudar.
Se o botão pode mudar de `open` para `closed` ou para algo como `inProgress`, usar um estado wildcard pode reduzir a quantidade de código necessária.

<img alt="wildcard state with 3 states" src="assets/images/guide/animations/wildcard-3-states.png">

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="trigger-transition"/>

A transição `* => *` se aplica quando ocorre qualquer mudança entre dois estados.

As transições são correspondidas na ordem em que são definidas.
Assim, você pode aplicar outras transições por cima da transição `* => *`.
Por exemplo, defina mudanças de estilo ou animações que se apliquem apenas a `open => closed` e, em seguida, use `* => *` como fallback para os pares de estados que não foram especificados de outra forma.

Para isso, liste as transições mais específicas _antes_ de `* => *`.

### Use wildcards com estilos {#use-wildcards-with-styles}

Use o wildcard `*` com um estilo para dizer à animação que use o valor atual desse estilo e anime a partir dele.
O wildcard é um valor de fallback usado quando o estado animado não está declarado dentro do trigger.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="transition4"/>

### Estado void {#void-state}

Use o estado `void` para configurar transições de um elemento que está entrando ou saindo de uma página.
Veja [Animando a entrada e a saída de uma view](guide/legacy-animations/transition-and-triggers#aliases-enter-and-leave).

### Combine os estados wildcard e void {#combine-wildcard-and-void-states}

Combine os estados wildcard e void em uma transição para disparar animações que entram e saem da página:

- Uma transição `* => void` se aplica quando o elemento sai de uma view, independentemente do estado em que estava antes de sair
- Uma transição `void => *` se aplica quando o elemento entra em uma view, independentemente do estado que ele assume ao entrar
- O estado wildcard `*` corresponde a _qualquer_ estado, incluindo `void`

## Animando a entrada e a saída de uma view {#animate-entering-and-leaving-a-view}

Esta seção mostra como animar elementos que entram ou saem de uma página.

Adicione um novo comportamento:

- Quando você adiciona um herói à lista de heróis, ele aparece voando para dentro da página pela esquerda
- Quando você remove um herói da lista, ele sai voando pela direita

<docs-code header="hero-list-enter-leave.ts" path="adev/src/content/examples/animations/src/app/hero-list-enter-leave.ts" region="animationdef"/>

No código anterior, você aplicou o estado `void` quando o elemento HTML não está anexado a uma view.

## Aliases :enter e :leave {#aliases-enter-and-leave}

`:enter` e `:leave` são aliases para as transições `void => *` e `* => void`.
Esses aliases são usados por várias funções de animação.

```ts {hideCopy}

transition ( ':enter', [ … ] ); // alias para void => _
transition ( ':leave', [ … ] ); // alias para _ => void

```

É mais difícil segmentar um elemento que está entrando em uma view, porque ele ainda não está no DOM.
Use os aliases `:enter` e `:leave` para segmentar elementos HTML que são inseridos ou removidos de uma view.

### Use `*ngIf` e `*ngFor` com :enter e :leave {#use-ngif-and-ngfor-with-enter-and-leave}

A transição `:enter` é executada quando quaisquer views de `*ngIf` ou `*ngFor` são colocadas na página, e `:leave` é executada quando essas views são removidas da página.

IMPORTANTE: Os comportamentos de entrada e saída às vezes podem ser confusos.
Como regra prática, considere que qualquer elemento adicionado ao DOM pelo Angular passa pela transição `:enter`. Apenas elementos removidos diretamente do DOM pelo Angular passam pela transição `:leave`. Por exemplo, a view de um elemento é removida do DOM porque seu pai está sendo removido do DOM.

Este exemplo tem um trigger especial para a animação de entrada e saída chamado `myInsertRemoveTrigger`.
O template HTML contém o seguinte código.

<docs-code header="insert-remove.html" path="adev/src/content/examples/animations/src/app/insert-remove.html" region="insert-remove"/>

No arquivo do component, a transição `:enter` define uma opacidade inicial de 0. Em seguida, ela anima essa opacidade para 1 à medida que o elemento é inserido na view.

<docs-code header="insert-remove.ts" path="adev/src/content/examples/animations/src/app/insert-remove.ts" region="enter-leave-trigger"/>

Observe que este exemplo não precisa usar [`state()`](api/animations/state).

## Transições :increment e :decrement {#transition-increment-and-decrement}

A função `transition()` aceita outros valores de seletor, `:increment` e `:decrement`.
Use-os para iniciar uma transição quando um valor numérico aumentar ou diminuir.

ÚTIL: O exemplo a seguir usa os métodos `query()` e `stagger()`.
Para mais informações sobre esses métodos, veja a página sobre [sequências complexas](guide/legacy-animations/complex-sequences).

<docs-code header="hero-list-page.ts" path="adev/src/content/examples/animations/src/app/hero-list-page.ts" region="increment"/>

## Valores booleanos em transições {#boolean-values-in-transitions}

Se um trigger contém um valor booleano como valor de binding, esse valor pode ser comparado usando uma expressão `transition()` que compara `true` e `false`, ou `1` e `0`.

<docs-code header="open-close.html" path="adev/src/content/examples/animations/src/app/open-close.2.html" region="trigger-boolean"/>

No trecho de código anterior, o template HTML vincula um elemento `<div>` a um trigger chamado `openClose`, com uma expressão de status `isOpen` e valores possíveis de `true` e `false`.
Esse padrão é uma alternativa à prática de criar dois estados nomeados, como `open` e `close`.

Dentro dos metadados do `@Component`, na propriedade `animations:`, quando o estado é avaliado como `true`, a altura do elemento HTML associado é um estilo wildcard ou padrão.
Nesse caso, a animação usa a altura que o elemento já tinha antes de a animação começar.
Quando o elemento está `closed`, ele é animado para uma altura de 0, o que o torna invisível.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.2.ts" region="trigger-boolean"/>

## Múltiplos triggers de animação {#multiple-animation-triggers}

Você pode definir mais de um trigger de animação para um component.
Anexe triggers de animação a elementos diferentes, e as relações pai-filho entre os elementos afetam como e quando as animações são executadas.

### Animações pai-filho {#parent-child-animations}

Sempre que uma animação é disparada no Angular, a animação do pai tem prioridade e as animações dos filhos são bloqueadas.
Para que uma animação filha seja executada, a animação do pai deve consultar cada um dos elementos que contêm animações filhas. Em seguida, ela deixa as animações serem executadas usando a função [`animateChild()`](api/animations/animateChild).

#### Desabilitar uma animação em um elemento HTML {#disable-an-animation-on-an-html-element}

Um binding especial de controle de animação chamado `@.disabled` pode ser colocado em um elemento HTML para desativar as animações desse elemento, assim como em quaisquer elementos aninhados.
Quando verdadeiro, o binding `@.disabled` impede que todas as animações sejam renderizadas.

O exemplo de código a seguir mostra como usar esse recurso.

<docs-code-multifile>
    <docs-code header="open-close.html" path="adev/src/content/examples/animations/src/app/open-close.4.html" region="toggle-animation"/>
    <docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.4.ts" region="toggle-animation" language="typescript"/>
</docs-code-multifile>

Quando o binding `@.disabled` é true, o trigger `@childAnimation` não é acionado.

Quando um elemento dentro de um template HTML tem as animações desativadas pelo host binding `@.disabled`, as animações também são desativadas em todos os elementos internos.
Você não pode desativar seletivamente várias animações em um único elemento.<!-- vale off -->

Animações filhas seletivas ainda podem ser executadas em um pai desabilitado de uma das seguintes formas:

- Uma animação do pai pode usar a função [`query()`](api/animations/query) para coletar elementos internos localizados em áreas desabilitadas do template HTML.
Esses elementos ainda podem ser animados.
<!-- vale on -->

- Uma animação filha pode ser consultada por um pai e, depois, animada com a função `animateChild()`

#### Desabilitar todas as animações {#disable-all-animations}

Para desativar todas as animações de uma aplicação Angular, coloque o host binding `@.disabled` no component Angular de nível mais alto.

<docs-code header="app.ts" path="adev/src/content/examples/animations/src/app/app.ts" region="toggle-app-animations"/>

HELPFUL: Desabilitar as animações em toda a aplicação é útil durante testes end-to-end \(E2E\).

## Callbacks de animação {#animation-callbacks}

A função `trigger()` de animação emite _callbacks_ quando inicia e quando termina.
O exemplo a seguir apresenta um component que contém um trigger `openClose`.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="events1"/>

No template HTML, o evento de animação é passado de volta por `$event`, como `@triggerName.start` e `@triggerName.done`, em que `triggerName` é o nome do trigger usado.
Neste exemplo, o trigger `openClose` aparece da seguinte forma.

<docs-code header="open-close.html" path="adev/src/content/examples/animations/src/app/open-close.3.html" region="callbacks"/>

Um uso potencial para os callbacks de animação é cobrir uma chamada de API lenta, como uma consulta a banco de dados.
Por exemplo, um botão **InProgress** pode ser configurado para ter sua própria animação em loop enquanto a operação do sistema backend termina.

Outra animação pode ser chamada quando a animação atual termina.
Por exemplo, o botão passa do estado `inProgress` para o estado `closed` quando a chamada de API é concluída.

Uma animação pode fazer o usuário final _perceber_ a operação como mais rápida, mesmo quando não é.

Os callbacks também podem servir como ferramenta de depuração, por exemplo, em conjunto com `console.warn()`, para acompanhar o progresso da aplicação no console JavaScript do navegador.
O trecho de código a seguir cria uma saída de log no console para o exemplo original, um botão com os dois estados `open` e `closed`.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="events"/>

## Keyframes {#keyframes}

Para criar uma animação com múltiplas etapas executadas em sequência, use _keyframes_.

A função `keyframe()` do Angular permite várias mudanças de estilo dentro de um único segmento de tempo.
Por exemplo, em vez de desaparecer, o botão poderia mudar de cor várias vezes ao longo de um único intervalo de 2 segundos.

<img alt="keyframes" src="assets/images/guide/animations/keyframes-500.png">

O código para essa mudança de cor poderia ser assim.

<docs-code header="status-slider.ts" path="adev/src/content/examples/animations/src/app/status-slider.ts" region="keyframes"/>

### Offset {#offset}

Os keyframes incluem um `offset` que define o ponto da animação em que cada mudança de estilo acontece.
Offsets são medidas relativas de zero a um, marcando o início e o fim da animação. Eles devem ser aplicados a cada uma das etapas de keyframe, caso sejam usados em pelo menos uma delas.

Definir offsets para os keyframes é opcional.
Se você os omitir, offsets igualmente espaçados são atribuídos automaticamente.
Por exemplo, três keyframes sem offsets predefinidos recebem offsets de 0, 0.5 e 1.
Especificar um offset de 0.8 para a transição do meio no exemplo anterior poderia ser assim.

<img alt="keyframes with offset" src="assets/images/guide/animations/keyframes-offset-500.png">

O código com os offsets especificados seria o seguinte.

<docs-code header="status-slider.ts" path="adev/src/content/examples/animations/src/app/status-slider.ts" region="keyframesWithOffsets"/>

Você pode combinar keyframes com `duration`, `delay` e `easing` dentro de uma única animação.

### Keyframes com pulsação {#keyframes-with-a-pulsation}

Use keyframes para criar um efeito de pulsação em suas animações, definindo estilos em offsets específicos ao longo da animação.

Aqui está um exemplo de uso de keyframes para criar um efeito de pulsação:

- Os estados originais `open` e `closed`, com as mudanças originais de altura, cor e opacidade, ocorrendo em um intervalo de 1 segundo
- Uma sequência de keyframes inserida no meio, que faz o botão parecer pulsar de forma irregular ao longo desse mesmo intervalo de 1 segundo

<img alt="keyframes with irregular pulsation" src="assets/images/guide/animations/keyframes-pulsation.png">

O trecho de código para essa animação poderia ser assim.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.1.ts" region="trigger"/>

### Propriedades animáveis e unidades {#animatable-properties-and-units}

As animações do Angular são construídas sobre web animations, então você pode animar qualquer propriedade que o navegador considere animável.
Isso inclui posições, tamanhos, transformações, cores, bordas e muito mais.
O W3C mantém uma lista de propriedades animáveis em sua página de [CSS Transitions](https://www.w3.org/TR/css-transitions-1).

Para propriedades com valor numérico, defina uma unidade fornecendo o valor como uma string, entre aspas, com o sufixo apropriado:

- 50 pixels:
  `'50px'`

- Tamanho de fonte relativo:
  `'3em'`

- Porcentagem:
  `'100%'`

Você também pode fornecer o valor como número. Nesses casos, o Angular assume a unidade padrão de pixels, ou `px`.
Expressar 50 pixels como `50` é o mesmo que escrever `'50px'`.

ÚTIL: A string `"50"` não seria considerada válida\).

### Cálculo automático de propriedades com wildcards {#automatic-property-calculation-with-wildcards}

Às vezes, o valor de uma propriedade de estilo dimensional não é conhecido até o runtime.
Por exemplo, elementos frequentemente têm larguras e alturas que dependem do seu conteúdo ou do tamanho da tela.
Essas propriedades costumam ser difíceis de animar usando CSS.

Nesses casos, você pode usar um valor especial de propriedade wildcard `*` em `style()`. O valor dessa propriedade de estilo é calculado em runtime e então inserido na animação.

O exemplo a seguir tem um trigger chamado `shrinkOut`, usado quando um elemento HTML sai da página.
A animação pega a altura que o elemento tem antes de sair e anima essa altura até zero.

<docs-code header="hero-list-auto.ts" path="adev/src/content/examples/animations/src/app/hero-list-auto.ts" region="auto-calc"/>

### Resumo de keyframes {#keyframes-summary}

A função `keyframes()` no Angular permite especificar vários estilos intermediários dentro de uma única transição. Um `offset` opcional pode ser usado para definir o ponto da animação em que cada mudança de estilo deve acontecer.

## Mais sobre animações do Angular {#more-on-angular-animations}

Você também pode se interessar pelo seguinte:

<docs-pill-row>
  <docs-pill href="guide/legacy-animations" title="Introdução às animações do Angular"/>
  <docs-pill href="guide/legacy-animations/complex-sequences" title="Sequências de animação complexas"/>
  <docs-pill href="guide/legacy-animations/reusable-animations" title="Animações reutilizáveis"/>
  <docs-pill href="guide/routing/route-transition-animations" title="Animações de transição de rotas"/>
  <docs-pill href="guide/animations/migration" title="Migrando para animações CSS nativas"/>
</docs-pill-row>
