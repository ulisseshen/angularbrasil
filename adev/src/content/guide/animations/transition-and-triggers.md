<!-- ia-translate: true -->
# Transitions e triggers de animação

IMPORTANTE: O pacote `@angular/animations` agora está obsoleto. A equipe do Angular recomenda usar CSS nativo com `animate.enter` e `animate.leave` para animações em todos os códigos novos. Saiba mais no novo [guia de animação](guide/animations/enter-and-leave) de enter e leave. Veja também [Migrando do pacote de Animations do Angular](guide/animations/migration) para aprender como você pode começar a migrar para animações CSS puras em suas aplicações.

Este guia aprofunda em estados de transição especiais como o wildcard `*` e `void`. Ele mostra como esses estados especiais são usados para elementos entrando e saindo de uma view.
Esta seção também explora múltiplos triggers de animação, callbacks de animação e animação baseada em sequência usando keyframes.

## Estados predefinidos e correspondência com wildcard

No Angular, estados de transição podem ser definidos explicitamente através da função [`state()`](api/animations/state), ou usando os estados predefinidos wildcard `*` e `void`.

### Estado wildcard

Um asterisco `*` ou _wildcard_ corresponde a qualquer estado de animação.
Isso é útil para definir transições que se aplicam independentemente do estado inicial ou final do elemento HTML.

Por exemplo, uma transição de `open => *` se aplica quando o estado do elemento muda de open para qualquer outra coisa.

<img alt="wildcard state expressions" src="assets/images/guide/animations/wildcard-state-500.png">

O código a seguir é outro exemplo usando o estado wildcard junto com o exemplo anterior usando os estados `open` e `closed`.
Em vez de definir cada par de transição estado-para-estado, qualquer transição para `closed` leva 1 segundo, e qualquer transição para `open` leva 0.5 segundos.

Isso permite a adição de novos estados sem ter que incluir transições separadas para cada um.

<docs-code header="open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="trigger-wildcard1"/>

Use uma sintaxe de seta dupla para especificar transições estado-para-estado em ambas as direções.

<docs-code header="open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="trigger-wildcard2"/>

### Use o estado wildcard com múltiplos estados de transição

No exemplo do botão de dois estados, o wildcard não é tão útil porque há apenas dois estados possíveis, `open` e `closed`.
Em geral, use estados wildcard quando um elemento tiver múltiplos estados potenciais para os quais ele pode mudar.
Se o botão pode mudar de `open` para `closed` ou para algo como `inProgress`, usar um estado wildcard pode reduzir a quantidade de código necessária.

<img alt="wildcard state with 3 states" src="assets/images/guide/animations/wildcard-3-states.png">

<docs-code header="open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="trigger-transition"/>

A transição `* => *` se aplica quando qualquer mudança entre dois estados ocorre.

As transições são correspondidas na ordem em que são definidas.
Assim, você pode aplicar outras transições sobre a transição `* => *`.
Por exemplo, defina mudanças de estilo ou animações que se aplicariam apenas a `open => closed`, e então use `* => *` como um fallback para pares de estados que não são especificados de outra forma.

Para fazer isso, liste as transições mais específicas _antes_ de `* => *`.

### Use wildcards com estilos

Use o wildcard `*` com um estilo para dizer à animação para usar qualquer que seja o valor de estilo atual, e animar com ele.
Wildcard é um valor de fallback usado se o estado sendo animado não for declarado dentro do trigger.

<docs-code header="open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="transition4"/>

### Estado void

Use o estado `void` para configurar transições para um elemento que está entrando ou saindo de uma página.
Veja [Animando entrada e saída de uma view](guide/legacy-animations/transition-and-triggers#aliases-enter-and-leave).

### Combine estados wildcard e void

Combine estados wildcard e void em uma transição para disparar animações que entram e saem da página:

- Uma transição de `* => void` se aplica quando o elemento sai de uma view, independentemente de qual estado ele estava antes de sair
- Uma transição de `void => *` se aplica quando o elemento entra em uma view, independentemente de qual estado ele assume ao entrar
- O estado wildcard `*` corresponde a _qualquer_ estado, incluindo `void`

## Animando entrada e saída de uma view

Esta seção mostra como animar elementos entrando ou saindo de uma página.

Adicione um novo comportamento:

- Quando você adiciona um herói à lista de heróis, ele parece voar para a página pela esquerda
- Quando você remove um herói da lista, ele parece voar para fora pela direita

<docs-code header="hero-list-enter-leave.component.ts" path="adev/src/content/examples/animations/src/app/hero-list-enter-leave.component.ts" visibleRegion="animationdef"/>

No código acima, você aplicou o estado `void` quando o elemento HTML não está anexado a uma view.

## Aliases :enter e :leave

`:enter` e `:leave` são aliases para as transições `void => *` e `* => void`.
Esses aliases são usados por várias funções de animação.

<docs-code hideCopy language="typescript">

transition ( ':enter', [ … ] ); // alias for void => _
transition ( ':leave', [ … ] ); // alias for _ => void

</docs-code>

É mais difícil segmentar um elemento que está entrando em uma view porque ele ainda não está no DOM.
Use os aliases `:enter` e `:leave` para segmentar elementos HTML que são inseridos ou removidos de uma view.

### Use `*ngIf` e `*ngFor` com :enter e :leave

A transição `:enter` é executada quando quaisquer views `*ngIf` ou `*ngFor` são colocadas na página, e `:leave` é executada quando essas views são removidas da página.

IMPORTANTE: Comportamentos de entrada/saída podem às vezes ser confusos.
Como regra geral, considere que qualquer elemento sendo adicionado ao DOM pelo Angular passa pela transição `:enter`. Apenas elementos sendo diretamente removidos do DOM pelo Angular passam pela transição `:leave`. Por exemplo, a view de um elemento é removida do DOM porque seu pai está sendo removido do DOM.

Este exemplo tem um trigger especial para a animação de entrada e saída chamado `myInsertRemoveTrigger`.
O template HTML contém o seguinte código.

<docs-code header="insert-remove.component.html" path="adev/src/content/examples/animations/src/app/insert-remove.component.html" visibleRegion="insert-remove"/>

No arquivo do component, a transição `:enter` define uma opacidade inicial de 0. Em seguida, ela anima para mudar essa opacidade para 1 à medida que o elemento é inserido na view.

<docs-code header="insert-remove.component.ts" path="adev/src/content/examples/animations/src/app/insert-remove.component.ts" visibleRegion="enter-leave-trigger"/>

Note que este exemplo não precisa usar [`state()`](api/animations/state).

## Transições :increment e :decrement

A função `transition()` aceita outros valores de seletor, `:increment` e `:decrement`.
Use-os para iniciar uma transição quando um valor numérico aumentou ou diminuiu em valor.

ÚTIL: O exemplo a seguir usa os métodos `query()` e `stagger()`.
Para mais informações sobre esses métodos, veja a página de [sequências complexas](guide/legacy-animations/complex-sequences).

<docs-code header="hero-list-page.component.ts" path="adev/src/content/examples/animations/src/app/hero-list-page.component.ts" visibleRegion="increment"/>

## Valores booleanos em transições

Se um trigger contém um valor booleano como valor de binding, então este valor pode ser correspondido usando uma expressão `transition()` que compara `true` e `false`, ou `1` e `0`.

<docs-code header="open-close.component.html" path="adev/src/content/examples/animations/src/app/open-close.component.2.html" visibleRegion="trigger-boolean"/>

No trecho de código acima, o template HTML vincula um elemento `<div>` a um trigger chamado `openClose` com uma expressão de status de `isOpen`, e com valores possíveis de `true` e `false`.
Este padrão é uma alternativa à prática de criar dois estados nomeados como `open` e `close`.

Dentro dos metadados do `@Component` sob a propriedade `animations:`, quando o estado avalia para `true`, a altura do elemento HTML associado é um estilo wildcard ou padrão.
Neste caso, a animação usa qualquer altura que o elemento já tinha antes da animação começar.
Quando o elemento está `closed`, o elemento é animado para uma altura de 0, o que o torna invisível.

<docs-code header="open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.2.ts" visibleRegion="trigger-boolean"/>

## Múltiplos triggers de animação

Você pode definir mais de um trigger de animação para um component.
Anexe triggers de animação a diferentes elementos, e as relações pai-filho entre os elementos afetam como e quando as animações são executadas.

### Animações pai-filho

Cada vez que uma animação é disparada no Angular, a animação pai sempre tem prioridade e as animações filhas são bloqueadas.
Para que uma animação filha seja executada, a animação pai deve consultar cada um dos elementos que contêm animações filhas. Em seguida, ela permite que as animações sejam executadas usando a função [`animateChild()`](api/animations/animateChild).

#### Desabilitar uma animação em um elemento HTML

Um binding especial de controle de animação chamado `@.disabled` pode ser colocado em um elemento HTML para desativar animações nesse elemento, bem como em quaisquer elementos aninhados.
Quando true, o binding `@.disabled` impede que todas as animações sejam renderizadas.

O exemplo de código a seguir mostra como usar este recurso.

<docs-code-multifile>
    <docs-code header="open-close.component.html" path="adev/src/content/examples/animations/src/app/open-close.component.4.html" visibleRegion="toggle-animation"/>
    <docs-code header="open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.4.ts" visibleRegion="toggle-animation" language="typescript"/>
</docs-code-multifile>

Quando o binding `@.disabled` é true, o trigger `@childAnimation` não é acionado.

Quando um elemento dentro de um template HTML tem animações desativadas usando o host binding `@.disabled`, as animações são desativadas em todos os elementos internos também.
Você não pode desativar seletivamente múltiplas animações em um único elemento.<!-- vale off -->

Animações filhas seletivas ainda podem ser executadas em um pai desabilitado de uma das seguintes maneiras:

- Uma animação pai pode usar a função [`query()`](api/animations/query) para coletar elementos internos localizados em áreas desabilitadas do template HTML.
Esses elementos ainda podem ser animados.
<!-- vale on -->

- Uma animação filha pode ser consultada por um pai e então animada posteriormente com a função `animateChild()`

#### Desabilitar todas as animações

Para desativar todas as animações de uma aplicação Angular, coloque o host binding `@.disabled` no component Angular de nível superior.

<docs-code header="app.component.ts" path="adev/src/content/examples/animations/src/app/app.component.ts" visibleRegion="toggle-app-animations"/>

ÚTIL: Desabilitar animações em toda a aplicação é útil durante testes end-to-end \(E2E\).

## Callbacks de animação

A função `trigger()` de animação emite _callbacks_ quando ela inicia e quando termina.
O exemplo a seguir apresenta um component que contém um trigger `openClose`.

<docs-code header="open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="events1"/>

No template HTML, o evento de animação é passado de volta via `$event`, como `@triggerName.start` e `@triggerName.done`, onde `triggerName` é o nome do trigger sendo usado.
Neste exemplo, o trigger `openClose` aparece da seguinte forma.

<docs-code header="open-close.component.html" path="adev/src/content/examples/animations/src/app/open-close.component.3.html" visibleRegion="callbacks"/>

Um uso potencial para callbacks de animação poderia ser cobrir uma chamada de API lenta, como uma consulta a banco de dados.
Por exemplo, um botão **InProgress** pode ser configurado para ter sua própria animação em loop enquanto a operação do sistema backend termina.

Outra animação pode ser chamada quando a animação atual termina.
Por exemplo, o botão vai do estado `inProgress` para o estado `closed` quando a chamada de API é concluída.

Uma animação pode influenciar um usuário final a _perceber_ a operação como mais rápida, mesmo quando não é.

Callbacks podem servir como uma ferramenta de depuração, por exemplo, em conjunto com `console.warn()` para visualizar o progresso da aplicação no Console JavaScript do navegador para desenvolvedores.
O trecho de código a seguir cria uma saída de log do console para o exemplo original, um botão com os dois estados `open` e `closed`.

<docs-code header="open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.ts" visibleRegion="events"/>

## Keyframes

Para criar uma animação com múltiplas etapas executadas em sequência, use _keyframes_.

A função `keyframe()` do Angular permite várias mudanças de estilo dentro de um único segmento de tempo.
Por exemplo, o botão, em vez de desaparecer, poderia mudar de cor várias vezes ao longo de um único período de 2 segundos.

<img alt="keyframes" src="assets/images/guide/animations/keyframes-500.png">

O código para esta mudança de cor poderia ser assim.

<docs-code header="status-slider.component.ts" path="adev/src/content/examples/animations/src/app/status-slider.component.ts" visibleRegion="keyframes"/>

### Offset

Keyframes incluem um `offset` que define o ponto na animação onde cada mudança de estilo ocorre.
Offsets são medidas relativas de zero a um, marcando o início e o fim da animação. Eles devem ser aplicados a cada uma das etapas de keyframe se usados pelo menos uma vez.

Definir offsets para keyframes é opcional.
Se você omiti-los, offsets igualmente espaçados são atribuídos automaticamente.
Por exemplo, três keyframes sem offsets predefinidos recebem offsets de 0, 0.5 e 1.
Especificar um offset de 0.8 para a transição do meio no exemplo anterior poderia ser assim.

<img alt="keyframes with offset" src="assets/images/guide/animations/keyframes-offset-500.png">

O código com offsets especificados seria o seguinte.

<docs-code header="status-slider.component.ts" path="adev/src/content/examples/animations/src/app/status-slider.component.ts" visibleRegion="keyframesWithOffsets"/>

Você pode combinar keyframes com `duration`, `delay` e `easing` dentro de uma única animação.

### Keyframes com pulsação

Use keyframes para criar um efeito de pulsação em suas animações definindo estilos em offsets específicos ao longo da animação.

Aqui está um exemplo de uso de keyframes para criar um efeito de pulsação:

- Os estados originais `open` e `closed`, com as mudanças originais de altura, cor e opacidade, ocorrendo ao longo de um período de tempo de 1 segundo
- Uma sequência de keyframes inserida no meio que faz com que o botão pareça pulsar irregularmente ao longo desse mesmo período de tempo de 1 segundo

<img alt="keyframes with irregular pulsation" src="assets/images/guide/animations/keyframes-pulsation.png">

O trecho de código para esta animação poderia ser assim.

<docs-code header="open-close.component.ts" path="adev/src/content/examples/animations/src/app/open-close.component.1.ts" visibleRegion="trigger"/>

### Propriedades e unidades animáveis

As animações do Angular são construídas sobre web animations, então você pode animar qualquer propriedade que o navegador considere animável.
Isso inclui posições, tamanhos, transformações, cores, bordas e muito mais.
O W3C mantém uma lista de propriedades animáveis em sua página de [CSS Transitions](https://www.w3.org/TR/css-transitions-1).

Para propriedades com um valor numérico, defina uma unidade fornecendo o valor como uma string, entre aspas, com o sufixo apropriado:

- 50 pixels:
  `'50px'`

- Tamanho de fonte relativo:
  `'3em'`

- Porcentagem:
  `'100%'`

Você também pode fornecer o valor como um número. Nesses casos, o Angular assume uma unidade padrão de pixels, ou `px`.
Expressar 50 pixels como `50` é o mesmo que dizer `'50px'`.

ÚTIL: A string `"50"` não seria considerada válida\).

### Cálculo automático de propriedade com wildcards

Às vezes, o valor de uma propriedade de estilo dimensional não é conhecido até o runtime.
Por exemplo, elementos frequentemente têm larguras e alturas que dependem de seu conteúdo ou do tamanho da tela.
Essas propriedades são frequentemente desafiadoras de animar usando CSS.

Nesses casos, você pode usar um valor de propriedade wildcard `*` especial sob `style()`. O valor dessa propriedade de estilo específica é computado em runtime e então conectado à animação.

O exemplo a seguir tem um trigger chamado `shrinkOut`, usado quando um elemento HTML sai da página.
A animação pega qualquer altura que o elemento tenha antes de sair, e anima dessa altura para zero.

<docs-code header="hero-list-auto.component.ts" path="adev/src/content/examples/animations/src/app/hero-list-auto.component.ts" visibleRegion="auto-calc"/>

### Resumo de keyframes

A função `keyframes()` no Angular permite especificar múltiplos estilos intermediários dentro de uma única transição. Um `offset` opcional pode ser usado para definir o ponto na animação onde cada mudança de estilo deve ocorrer.

## Mais sobre animações do Angular

Você também pode estar interessado no seguinte:

<docs-pill-row>
  <docs-pill href="guide/legacy-animations" title="Introdução às animações do Angular"/>
  <docs-pill href="guide/legacy-animations/complex-sequences" title="Sequências de animação complexas"/>
  <docs-pill href="guide/legacy-animations/reusable-animations" title="Animações reutilizáveis"/>
  <docs-pill href="guide/routing/route-transition-animations" title="Animações de transição de rotas"/>
  <docs-pill href="guide/animations/migration" title="Migrando para animações CSS nativas"/>
</docs-pill-row>
