<!-- ia-translate: true -->
# Effects

Signals são úteis porque notificam os consumidores interessados quando eles mudam. Um **effect** é uma operação que executa sempre que um ou mais valores de signal mudam. Você pode criar um effect com a função `effect`:

```ts
import {effect} from '@angular/core';

effect(() => {
  console.log(`The current count is: ${count()}`);
});
```

Effects sempre executam **pelo menos uma vez.** Quando um effect executa, ele rastreia quaisquer leituras de valores de signal. Sempre que algum desses valores de signal muda, o effect executa novamente. Assim como os computed signals, os effects mantêm o controle de suas dependências dinamicamente e rastreiam apenas os signals que foram lidos na execução mais recente.

Effects sempre executam **de forma assíncrona**, durante o processo de detecção de mudanças.

## Casos de uso para effects {#use-cases-for-effects}

Effects devem ser a última API à qual você recorre. Sempre prefira `computed()` para valores derivados e `linkedSignal()` para valores que podem ser tanto derivados quanto definidos manualmente. Se você se pegar copiando dados de um signal para outro com um effect, é sinal de que você deve mover sua fonte da verdade para mais acima e usar `computed()` ou `linkedSignal()` no lugar. Effects são mais indicados para sincronizar o estado dos signals com APIs imperativas que não são baseadas em signals.

TIP: Não há situações em que effect seja uma boa escolha, apenas situações em que ele é apropriado.

- Registrar valores de signals, seja para analytics ou como ferramenta de depuração.
- Manter dados sincronizados com diferentes tipos de armazenamento: `window.localStorage`, session storage, cookies, etc.
- Adicionar comportamento customizado no DOM que não pode ser expresso com a sintaxe de template.
- Realizar renderização customizada em um elemento `<canvas>`, biblioteca de gráficos ou outra biblioteca de UI de terceiros.

<docs-callout critical title="Quando não usar effects">
Evite usar effects para propagação de mudanças de estado. Isso pode resultar em erros `ExpressionChangedAfterItHasBeenChecked`, atualizações circulares infinitas ou ciclos desnecessários de detecção de mudanças.

Em vez disso, use `computed` signals para modelar estado que depende de outro estado.
</docs-callout>

## Contexto de injeção {#injection-context}

Por padrão, você só pode criar um `effect()` dentro de um [contexto de injeção](guide/di/dependency-injection-context) (onde você tem acesso à função `inject`). A forma mais fácil de atender a esse requisito é chamar `effect` dentro do `constructor` de um component, directive ou service:

```ts
@Component(/* ... */)
export class EffectiveCounter {
  readonly count = signal(0);

  constructor() {
    // Registra um novo effect.
    effect(() => {
      console.log(`The count is: ${this.count()}`);
    });
  }
}
```

Para criar um effect fora do constructor, você pode passar um `Injector` para `effect` por meio de suas opções:

```ts
@Component(/* ... */)
export class EffectiveCounter {
  readonly count = signal(0);
  private injector = inject(Injector);

  initializeLogging(): void {
    effect(
      () => {
        console.log(`The count is: ${this.count()}`);
      },
      {injector: this.injector},
    );
  }
}
```

## Execução de effects {#execution-of-effects}

O Angular define implicitamente dois comportamentos para seus effects, dependendo do contexto em que eles foram criados.

Um "View Effect" é um `effect` criado no contexto da instanciação de um component. Isso inclui effects criados por services vinculados aos injectors de component.<br>
Um "Root Effect" é criado no contexto da instanciação de um service fornecido na raiz.

A execução de ambos os tipos de `effect` está vinculada ao processo de detecção de mudanças.

- "View effects" são executados _antes_ de seu component correspondente ser verificado pelo processo de detecção de mudanças.
- "Root effects" são executados antes de todos os components serem verificados pelo processo de detecção de mudanças.

Em ambos os casos, se pelo menos uma das dependências do effect mudar durante a execução do effect, o effect será executado novamente antes de o processo de detecção de mudanças prosseguir.

## Destruindo effects {#destroying-effects}

Quando um component ou directive é destruído, o Angular limpa automaticamente quaisquer effects associados.

Um `effect` pode ser criado em dois contextos diferentes que afetam quando ele é destruído:

- Um "View effect" é destruído quando o component é destruído.
- Um "Root effect" é destruído quando a aplicação é destruída.

Effects retornam um `EffectRef`. Você pode usar o método `destroy` da referência para descartar manualmente um effect. Você pode combiná-lo com a opção `manualCleanup` ao criar um effect para desativar a limpeza automática. Tenha cuidado para realmente destruir esses effects quando eles não forem mais necessários.

## Funções de limpeza de effects {#effect-cleanup-functions}

Quando um component ou directive é destruído, o Angular limpa automaticamente quaisquer effects associados.
Effects podem iniciar operações de longa duração, que você deve cancelar se o effect for destruído ou executar novamente antes que a primeira operação termine. Quando você cria um effect, sua função pode opcionalmente aceitar uma função `onCleanup` como primeiro parâmetro. Essa função `onCleanup` permite registrar um callback que é invocado antes de a próxima execução do effect começar, ou quando o effect é destruído.

```ts
effect((onCleanup) => {
  const user = currentUser();

  const timer = setTimeout(() => {
    console.log(`1 second ago, the user became ${user}`);
  }, 1000);

  onCleanup(() => {
    clearTimeout(timer);
  });
});
```

## Efeitos colaterais em elementos do DOM {#side-effects-on-dom-elements}

A função `effect` é uma ferramenta de uso geral para executar código em reação a mudanças de signals. No entanto, ela executa _antes_ de o Angular atualizar o DOM. Em algumas situações, você pode precisar inspecionar ou modificar manualmente o DOM, ou integrar uma biblioteca de terceiros que requer acesso direto ao DOM.

Para essas situações, você pode usar `afterRenderEffect`. Ela funciona como `effect`, mas executa depois que o Angular terminou de renderizar e confirmou suas mudanças no DOM.

```ts
@Component(/* ... */)
export class MyFancyChart {
  chartData = input.required<ChartData>();
  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  chart: ChartInstance;

  constructor() {
    // Executa uma única vez para criar a instância do gráfico
    afterNextRender({
      write: () => {
        this.chart = initializeChart(this.canvas().nativeElement, this.chartData());
      },
    });

    // Executa novamente após o DOM ser atualizado sempre que `chartData` mudar
    afterRenderEffect(() => {
      this.chart.updateData(this.chartData());
    });
  }
}
```

Neste exemplo, `afterRenderEffect` é usado para atualizar um gráfico criado por uma biblioteca de terceiros.

TIP: Você frequentemente não precisa de `afterRenderEffect` para verificar mudanças no DOM. APIs como `ResizeObserver`, `MutationObserver` e `IntersectionObserver` são preferíveis a `effect` ou `afterRenderEffect` sempre que possível.

### Fases de renderização {#render-phases}

Acessar o DOM e modificá-lo pode impactar o desempenho da sua aplicação, por exemplo, disparando muitos [reflows](https://developer.mozilla.org/en-US/docs/Glossary/Reflow) desnecessários.

Para otimizar essas operações, `afterRenderEffect` oferece quatro fases para agrupar os callbacks e executá-los em uma ordem otimizada.

As fases são:

| Fase             | Descrição                                                                                                                                                                                          |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `earlyRead`      | Use esta fase para ler do DOM antes de um callback de escrita subsequente, por exemplo, para realizar um layout customizado que o navegador não suporta nativamente. Prefira a fase de leitura se a leitura puder esperar. |
| `write`          | Use esta fase para escrever no DOM. **Nunca** leia do DOM nesta fase.                                                                                                                             |
| `mixedReadWrite` | Use esta fase para ler e escrever no DOM simultaneamente. Nunca use esta fase se for possível dividir o trabalho entre as outras fases.                                                           |
| `read`           | Use esta fase para ler do DOM. **Nunca** escreva no DOM nesta fase.                                                                                                                               |

Usar essas fases ajuda a prevenir layout thrashing e garante que suas operações no DOM sejam executadas de forma segura e eficiente.

Você pode especificar as fases passando para `afterRenderEffect` um objeto com um callback para cada fase:

```ts
afterRenderEffect({
  earlyRead: (cleanupFn) => {
    /* ... */
  },
  write: (previousPhaseValue, cleanupFn) => {
    /* ... */
  },
  mixedReadWrite: (previousPhaseValue, cleanupFn) => {
    /* ... */
  },
  read: (previousPhaseValue, cleanupFn) => {
    /* ... */
  },
});
```

CRITICAL: Se você não especificar a fase, `afterRenderEffect` executa os callbacks durante a fase `mixedReadWrite`. Isso pode piorar o desempenho da aplicação ao causar reflows adicionais no DOM.

#### Execuções de fases {#phase-executions}

O callback da fase `earlyRead` recebe apenas a função de limpeza. Cada fase subsequente recebe, como um Signal, o valor retornado pelo callback da fase anterior. Você pode usar isso para coordenar o trabalho entre as fases.

Os effects executam na seguinte ordem de fases:

1. `earlyRead`
2. `write`
3. `mixedReadWrite`
4. `read`

Se uma das fases modificar um valor de signal rastreado pelo `afterRenderEffect`, as fases afetadas são executadas novamente.

#### Limpeza {#cleanup}

Cada fase fornece uma função de callback de limpeza como argumento. Os callbacks de limpeza são executados quando o `afterRenderEffect` é destruído ou antes de as fases do effect serem executadas novamente.

### Ressalvas de renderização no servidor {#server-side-rendering-caveats}

`afterRenderEffect`, assim como `afterNextRender`/`afterEveryRender`, executa apenas no cliente.

NOTE: Os components não são necessariamente [hidratados](/guide/hydration) antes de o callback executar. Você deve ter cuidado ao ler ou escrever diretamente no DOM e no layout.
