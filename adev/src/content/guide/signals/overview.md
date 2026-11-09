<!-- ia-translate: true -->
<docs-decorative-header title="Angular Signals" imgSrc="adev/src/assets/images/signals.svg"> <!-- markdownlint-disable-line -->
Angular Signals é um sistema que rastreia granularmente como e onde seu estado é usado em toda a aplicação, permitindo que o framework otimize as atualizações de renderização.
</docs-decorative-header>

TIP: Confira os [Fundamentos](essentials/signals) do Angular antes de mergulhar neste guia completo.

## O que são signals? {#what-are-signals}

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
count.update((value) => value + 1);
```

Writable signals têm o tipo `WritableSignal`.

#### Convertendo writable signals em readonly {#converting-writable-signals-to-readonly}

`WritableSignal` fornece um método `asReadonly()` que retorna uma versão readonly do signal. Isso é útil quando você quer expor o valor de um signal para os consumidores sem permitir que eles o modifiquem diretamente:

```ts
@Service()
export class CounterState {
  // Private writable state
  private readonly _count = signal(0);

  readonly count = this._count.asReadonly(); // public readonly

  increment() {
    this._count.update((v) => v + 1);
  }
}

@Component({/* ... */})
export class AwesomeCounter {
  state = inject(CounterState);

  count = this.state.count; // can read but not modify

  increment() {
    this.state.increment();
  }
}
```

O signal readonly reflete quaisquer mudanças feitas no writable signal original, mas não pode ser modificado pelos métodos `set()` ou `update()`.

IMPORTANT: Os signals readonly **não** possuem nenhum mecanismo integrado que impeça a mutação profunda do seu valor.

### Computed signals

**Computed signals** são signals read-only que derivam seu valor de outros signals. Você define computed signals usando a função `computed` e especificando uma derivação:

```typescript
const count: WritableSignal<number> = signal(0);
const doubleCount: Signal<number> = computed(() => count() * 2);
```

O signal `doubleCount` depende do signal `count`. Sempre que `count` é atualizado, o Angular sabe que `doubleCount` também precisa ser atualizado.

#### Computed signals são avaliados preguiçosamente e memoizados {#computed-signals-are-both-lazily-evaluated-and-memoized}

A função de derivação do `doubleCount` não executa para calcular seu valor até a primeira vez que você lê `doubleCount`. O valor calculado é então armazenado em cache, e se você ler `doubleCount` novamente, ele retornará o valor em cache sem recalcular.

Se você então alterar `count`, o Angular sabe que o valor em cache de `doubleCount` não é mais válido, e na próxima vez que você ler `doubleCount` seu novo valor será calculado.

Como resultado, você pode realizar com segurança derivações computacionalmente caras em computed signals, como filtrar arrays.

#### Computed signals não são writable signals {#computed-signals-are-not-writable-signals}

Você não pode atribuir valores diretamente a um computed signal. Ou seja,

```ts
doubleCount.set(3);
```

produz um erro de compilação, porque `doubleCount` não é um `WritableSignal`.

#### Dependências de computed signals são dinâmicas {#computed-signal-dependencies-are-dynamic}

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

## Contextos reativos {#reactive-contexts}

Um **contexto reativo** é um estado de execução em que o Angular monitora as leituras de signals para estabelecer uma dependência. O código que lê o signal é o _consumidor_, e o signal que está sendo lido é o _produtor_.

O Angular entra automaticamente em um contexto reativo quando:

- Executa um callback de `effect` ou de `afterRenderEffect`.
- Avalia um `computed` signal.
- Avalia um `linkedSignal`.
- Avalia a função de `params` de um `resource`.
- Renderiza um template de component (incluindo bindings na [propriedade do host](guide/components/host-elements#binding-to-the-host-element)).

Durante essas operações, o Angular cria uma conexão _ativa_. Se um signal rastreado mudar, o Angular _eventualmente_ executará o consumidor novamente.

### Verificando o contexto reativo {#asserts-the-reactive-context}

O Angular fornece a função auxiliar `assertNotInReactiveContext` para verificar que o código não está sendo executado dentro de um contexto reativo. Passe uma referência à função chamadora para que a mensagem de erro aponte para o ponto de entrada correto da API caso a verificação falhe. Isso produz uma mensagem de erro mais clara e acionável do que um erro genérico de contexto reativo.

```ts
import {assertNotInReactiveContext} from '@angular/core';

function subscribeToEvents() {
  assertNotInReactiveContext(subscribeToEvents);
  // Safe to proceed - subscription logic here
}
```

### Lendo sem rastrear dependências {#reading-without-tracking-dependencies}

Raramente, você pode querer executar código que pode ler signals dentro de uma função reativa, como `computed` ou `effect`, _sem_ criar uma dependência.

Por exemplo, suponha que quando `currentUser` muda, o valor de um `counter` deve ser registrado. Você poderia criar um `effect` que lê ambos os signals:

```ts
effect(() => {
  console.log(`User set to ${currentUser()} and the counter is ${counter()}`);
});
```

Este exemplo registrará uma mensagem quando _tanto_ `currentUser` _quanto_ `counter` mudarem. No entanto, se o effect deve executar apenas quando `currentUser` muda, então a leitura de `counter` é apenas incidental e mudanças em `counter` não devem registrar uma nova mensagem.

Você pode evitar que a leitura de um signal seja rastreada chamando seu getter com `untracked`:

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

### Contexto reativo e operações assíncronas {#reactive-context-and-async-operations}

O contexto reativo só fica ativo para código síncrono. Quaisquer leituras de signals que ocorram após um limite assíncrono não serão rastreadas como dependências.

```ts {avoid}
effect(async () => {
  const data = await fetchUserData();
  // Reactive context is lost here - theme() won't be tracked
  console.log(`User: ${data.name}, Theme: ${theme()}`);
});
```

Para garantir que todas as leituras de signals sejam rastreadas, leia os signals antes do `await`. Isso inclui passá-los como argumentos para a função aguardada, já que os argumentos são avaliados de forma síncrona:

```ts {prefer}
effect(async () => {
  const currentTheme = theme(); // Read before await
  const data = await fetchUserData();
  console.log(`User: ${data.name}, Theme: ${currentTheme}`);
});
```

```ts {prefer}
effect(async () => {
  // Also works: signal is read before await (as function argument)
  await renderContent(docContent());
});
```

## Derivações avançadas {#advanced-derivations}

Enquanto o `computed` lida com derivações readonly simples, você pode precisar de um estado gravável que dependa de outros signals.
Para mais informações, veja o guia [Estado dependente com linkedSignal](/guide/signals/linked-signal).

Todas as APIs de signal são síncronas— `signal`, `computed`, `input`, etc. No entanto, aplicações frequentemente precisam lidar com dados que estão disponíveis de forma assíncrona. Um `Resource` oferece uma maneira de incorporar dados assíncronos ao código baseado em signals da sua aplicação e ainda permitir que você acesse esses dados de forma síncrona. Para mais informações, veja o guia [Reatividade assíncrona com resources](/guide/signals/resource).

## Executando efeitos colaterais em APIs não reativas {#executing-side-effects-on-non-reactive-apis}

Derivações síncronas ou assíncronas são recomendadas quando queremos reagir a mudanças de estado. No entanto, isso não cobre todos os casos de uso possíveis, e às vezes você se encontrará em uma situação em que precisa reagir a mudanças de signals em APIs não reativas. Use `effect` ou `afterRenderEffect` para esses casos específicos. Para mais informações, veja o guia [Efeitos colaterais para APIs não reativas](/guide/signals/effect).

## Lendo signals em components `OnPush` {#reading-signals-in-onpush-components}

Quando você lê um signal dentro do template de um component `OnPush`, o Angular rastreia o signal como uma dependência desse component. Quando o valor desse signal muda, o Angular automaticamente [marca](api/core/ChangeDetectorRef#markForCheck) o component para garantir que ele seja atualizado na próxima vez que a detecção de mudanças for executada. Consulte o guia [Pulando subárvores de components](best-practices/skipping-subtrees) para mais informações sobre components `OnPush`.

## Tópicos avançados {#advanced-topics}

### Funções de igualdade de signals {#signal-equality-functions}

Ao criar um signal, você pode opcionalmente fornecer uma função de igualdade, que será usada para verificar se o novo valor é realmente diferente do anterior.

```ts
import {signal} from '@angular/core';
import isEqual from 'lodash/isEqual';

const data = signal(['test'], {equal: isEqual});

// Even though this is a different array instance, the deep equality
// function will consider the values to be equal, and the signal won't
// trigger any updates.
data.set(['test']);
```

Funções de igualdade podem ser fornecidas tanto para writable quanto para computed signals.

HELPFUL: Por padrão, signals usam igualdade referencial (comparação [`Object.is()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/is)).

### Verificando o tipo de signals {#type-checking-signals}

Você pode usar `isSignal` para verificar se um valor é um `Signal`:

```ts
const count = signal(0);
const doubled = computed(() => count() * 2);

isSignal(count); // true
isSignal(doubled); // true
isSignal(42); // false
```

Para verificar especificamente se um signal é gravável, use `isWritableSignal`:

```ts
const count = signal(0);
const doubled = computed(() => count() * 2);

isWritableSignal(count); // true
isWritableSignal(doubled); // false
```

## Usando signals com RxJS {#using-signals-with-rxjs}

Veja [Interoperabilidade RxJS com Angular signals](ecosystem/rxjs-interop) para detalhes sobre interoperabilidade entre signals e RxJS.

## Depurando signals {#debugging-signals}

O Angular DevTools pode visualizar o grafo de signals de um component ou directive, mostrando como seus signals, computeds, effects e outros nós reativos dependem uns dos outros.
Veja [Depure o grafo de signals](tools/devtools/signals) para aprender como abrir, ler e inspecionar o grafo.
