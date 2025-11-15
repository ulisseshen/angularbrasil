<!-- ia-translate: true -->
<docs-decorative-header title="Angular Signals" imgSrc="adev/src/assets/images/signals.svg"> <!-- markdownlint-disable-line -->
Angular Signals é um sistema que rastreia granularmente como e onde seu estado é usado em toda a aplicação, permitindo que o framework otimize as atualizações de renderização.
</docs-decorative-header>

TIP: Confira os [Fundamentos](essentials/signals) do Angular antes de mergulhar neste guia completo.

## O que são signals?

Um **signal** é um envoltório em torno de um valor que notifica os consumidores interessados quando esse valor muda. Signals podem conter qualquer valor, desde primitivos até estruturas de dados complexas.

Você lê o valor de um signal chamando sua função getter, o que permite ao Angular rastrear onde o signal é usado.

Signals podem ser _writable_ ou _read-only_.

### Writable signals

Writable signals fornecem uma API para atualizar seus valores diretamente. Você cria writable signals chamando a função `signal` com o valor inicial do signal:

```ts
const count = signal(0);

// Signals são funções getter - chamá-las lê seu valor.
console.log('The count is: ' + count());
```

Para alterar o valor de um writable signal, use `.set()` diretamente:

```ts
count.set(3);
```

ou use a operação `.update()` para calcular um novo valor a partir do anterior:

```ts
// Increment the count by 1.
count.update(value => value + 1);
```

Writable signals têm o type `WritableSignal`.

### Computed signals

**Computed signals** são signals read-only que derivam seu valor de outros signals. Você define computed signals usando a função `computed` e especificando uma derivação:

```typescript
const count: WritableSignal<number> = signal(0);
const doubleCount: Signal<number> = computed(() => count() * 2);
```

O signal `doubleCount` depende do signal `count`. Sempre que `count` é atualizado, o Angular sabe que `doubleCount` também precisa ser atualizado.

#### Computed signals são avaliados preguiçosamente e memoizados

A função de derivação do `doubleCount` não executa para calcular seu valor até a primeira vez que você lê `doubleCount`. O valor calculado é então armazenado em cache, e se você ler `doubleCount` novamente, ele retornará o valor em cache sem recalcular.

Se você então alterar `count`, o Angular sabe que o valor em cache de `doubleCount` não é mais válido, e na próxima vez que você ler `doubleCount` seu novo valor será calculado.

Como resultado, você pode realizar com segurança derivações computacionalmente caras em computed signals, como filtrar arrays.

#### Computed signals não são writable signals

Você não pode atribuir valores diretamente a um computed signal. Ou seja,

```ts
doubleCount.set(3);
```

produz um erro de compilação, porque `doubleCount` não é um `WritableSignal`.

#### Dependências de computed signals são dinâmicas

Apenas os signals efetivamente lidos durante a derivação são rastreados. Por exemplo, neste `computed` o signal `count` só é lido se o signal `showCount` for true:

```ts
const showCount = signal(false);
const count = signal(0);
const conditionalCount = computed(() => {
  if (showCount()) {
    return `The count is ${count()}.`;
  } else {
    return 'Nothing to see here!';
  }
});
```

Quando você lê `conditionalCount`, se `showCount` é `false` a mensagem "Nothing to see here!" é retornada _sem_ ler o signal `count`. Isso significa que se você atualizar `count` posteriormente, isso _não_ resultará em um recálculo de `conditionalCount`.

Se você definir `showCount` como `true` e então ler `conditionalCount` novamente, a derivação será reexecutada e seguirá o branch onde `showCount` é `true`, retornando a mensagem que mostra o valor de `count`. Alterar `count` então invalidará o valor em cache de `conditionalCount`.

Note que dependências podem ser removidas durante uma derivação, assim como adicionadas. Se você posteriormente definir `showCount` de volta para `false`, então `count` não será mais considerado uma dependência de `conditionalCount`.

## Lendo signals em components `OnPush`

Quando você lê um signal dentro do template de um component `OnPush`, o Angular rastreia o signal como uma dependência desse component. Quando o valor desse signal muda, o Angular automaticamente [marca](api/core/ChangeDetectorRef#markforcheck) o component para garantir que ele seja atualizado na próxima vez que a detecção de mudanças for executada. Consulte o guia [Pulando subárvores de components](best-practices/skipping-subtrees) para mais informações sobre components `OnPush`.

## Effects

Signals são úteis porque notificam os consumidores interessados quando mudam. Um **effect** é uma operação que executa sempre que um ou mais valores de signal mudam. Você pode criar um effect com a função `effect`:

```ts
effect(() => {
  console.log(`The current count is: ${count()}`);
});
```

Effects sempre executam **pelo menos uma vez.** Quando um effect executa, ele rastreia quaisquer leituras de valores de signal. Sempre que qualquer um desses valores de signal muda, o effect executa novamente. Similarmente aos computed signals, effects mantêm o controle de suas dependências dinamicamente, e apenas rastreiam signals que foram lidos na execução mais recente.

Effects sempre executam **assincronamente**, durante o processo de detecção de mudanças.

### Casos de uso para effects

Effects raramente são necessários na maioria do código de aplicação, mas podem ser úteis em circunstâncias específicas. Aqui estão alguns exemplos de situações onde um `effect` pode ser uma boa solução:

- Registrar dados sendo exibidos e quando eles mudam, seja para analytics ou como uma ferramenta de depuração.
- Manter dados em sincronia com `window.localStorage`.
- Adicionar comportamento DOM customizado que não pode ser expresso com sintaxe de template.
- Realizar renderização customizada para um `<canvas>`, biblioteca de gráficos ou outra biblioteca de UI de terceiros.

<docs-callout critical title="Quando não usar effects">
Evite usar effects para propagação de mudanças de estado. Isso pode resultar em erros `ExpressionChangedAfterItHasBeenChecked`, atualizações circulares infinitas ou ciclos desnecessários de detecção de mudanças.

Em vez disso, use computed signals para modelar estado que depende de outro estado.
</docs-callout>

### Contexto de injeção

Por padrão, você só pode criar um `effect()` dentro de um [contexto de injeção](guide/di/dependency-injection-context) (onde você tem acesso à função `inject`). A maneira mais fácil de satisfazer esse requisito é chamar `effect` dentro do `constructor` de um component, directive ou service:

```ts
@Component({...})
export class EffectiveCounterComponent {
  readonly count = signal(0);
  constructor() {
    // Register a new effect.
    effect(() => {
      console.log(`The count is: ${this.count()}`);
    });
  }
}
```

Alternativamente, você pode atribuir o effect a um field (o que também lhe dá um nome descritivo).

```ts
@Component({...})
export class EffectiveCounterComponent {
  readonly count = signal(0);

  private loggingEffect = effect(() => {
    console.log(`The count is: ${this.count()}`);
  });
}
```

Para criar um effect fora do constructor, você pode passar um `Injector` para `effect` através de suas opções:

```ts
@Component({...})
export class EffectiveCounterComponent {
  readonly count = signal(0);
  private injector = inject(Injector);

  initializeLogging(): void {
    effect(() => {
      console.log(`The count is: ${this.count()}`);
    }, {injector: this.injector});
  }
}
```

### Destruindo effects

Quando você cria um effect, ele é automaticamente destruído quando seu contexto envolvente é destruído. Isso significa que effects criados dentro de components são destruídos quando o component é destruído. O mesmo vale para effects dentro de directives, services, etc.

Effects retornam um `EffectRef` que você pode usar para destruí-los manualmente, chamando o método `.destroy()`. Você pode combinar isso com a opção `manualCleanup` para criar um effect que dura até ser destruído manualmente. Tenha cuidado para realmente limpar tais effects quando eles não forem mais necessários.

## Tópicos avançados

### Funções de igualdade de signals

Ao criar um signal, você pode opcionalmente fornecer uma função de igualdade, que será usada para verificar se o novo valor é realmente diferente do anterior.

```ts
import _ from 'lodash';

const data = signal(['test'], {equal: _.isEqual});

// Even though this is a different array instance, the deep equality
// function will consider the values to be equal, and the signal won't
// trigger any updates.
data.set(['test']);
```

Funções de igualdade podem ser fornecidas tanto para writable quanto para computed signals.

HELPFUL: Por padrão, signals usam igualdade referencial (comparação [`Object.is()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/is)).

### Lendo sem rastrear dependências

Raramente, você pode querer executar código que pode ler signals dentro de uma função reativa como `computed` ou `effect` _sem_ criar uma dependência.

Por exemplo, suponha que quando `currentUser` muda, o valor de um `counter` deve ser registrado. Você poderia criar um `effect` que lê ambos os signals:

```ts
effect(() => {
  console.log(`User set to ${currentUser()} and the counter is ${counter()}`);
});
```

Este exemplo registrará uma mensagem quando _tanto_ `currentUser` _quanto_ `counter` mudarem. No entanto, se o effect deve executar apenas quando `currentUser` muda, então a leitura de `counter` é apenas incidental e mudanças em `counter` não devem registrar uma nova mensagem.

Você pode evitar que uma leitura de signal seja rastreada chamando seu getter com `untracked`:

```ts
effect(() => {
  console.log(`User set to ${currentUser()} and the counter is ${untracked(counter)}`);
});
```

`untracked` também é útil quando um effect precisa invocar algum código externo que não deve ser tratado como uma dependência:

```ts
effect(() => {
  const user = currentUser();
  untracked(() => {
    // If the `loggingService` reads signals, they won't be counted as
    // dependencies of this effect.
    this.loggingService.log(`User set to ${user}`);
  });
});
```

### Funções de limpeza de effects

Effects podem iniciar operações de longa duração, que você deve cancelar se o effect for destruído ou executar novamente antes que a primeira operação termine. Quando você cria um effect, sua função pode opcionalmente aceitar uma função `onCleanup` como seu primeiro parâmetro. Esta função `onCleanup` permite que você registre um callback que é invocado antes da próxima execução do effect começar, ou quando o effect é destruído.

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

## Usando signals com RxJS

Veja [Interoperabilidade RxJS com Angular signals](ecosystem/rxjs-interop) para detalhes sobre interoperabilidade entre signals e RxJS.
