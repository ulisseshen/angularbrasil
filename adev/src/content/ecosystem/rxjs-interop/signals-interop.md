<!-- ia-translate: true -->
# Interoperabilidade do RxJS com signals do Angular {#rxjs-interop-with-angular-signals}

O pacote `@angular/core/rxjs-interop` oferece APIs que ajudam você a integrar o RxJS e os signals do Angular.

## Criar um signal a partir de um Observable do RxJS com `toSignal` {#create-a-signal-from-an-rxjs-observable-with-tosignal}

Use a função `toSignal` para criar um signal que acompanha o valor de um Observable. Ela se comporta de forma semelhante ao pipe `async` nos templates, mas é mais flexível e pode ser usada em qualquer lugar da aplicação.

```angular-ts
import {Component} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {interval} from 'rxjs';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  template: `{{ counter() }}`,
})
export class Ticker {
  counterObservable = interval(1000);

  // Get a `Signal` representing the `counterObservable`'s value.
  counter = toSignal(this.counterObservable, {initialValue: 0});
}
```

Assim como o pipe `async`, o `toSignal` se inscreve no Observable imediatamente, o que pode disparar efeitos colaterais. A inscrição criada pelo `toSignal` cancela automaticamente a inscrição no Observable quando o component ou service que chama o `toSignal` é destruído.

IMPORTANTE: o `toSignal` cria uma inscrição. Evite chamá-lo repetidamente para o mesmo Observable e, em vez disso, reutilize o signal que ele retorna.

### Contexto de injeção {#injection-context}

Por padrão, o `toSignal` precisa ser executado em um [contexto de injeção](guide/di/dependency-injection-context), como durante a construção de um component ou service. Se um contexto de injeção não estiver disponível, você pode especificar manualmente o `Injector` a ser usado.

### Valores iniciais {#initial-values}

Observables podem não produzir um valor de forma síncrona na inscrição, mas signals sempre precisam de um valor atual. Existem várias maneiras de lidar com esse valor "inicial" dos signals criados com `toSignal`.

#### A opção `initialValue` {#the-initialvalue-option}

Como no exemplo acima, você pode especificar a opção `initialValue` com o valor que o signal deve retornar antes de o Observable emitir pela primeira vez.

#### Valores iniciais `undefined` {#undefined-initial-values}

Se você não fornecer um `initialValue`, o signal resultante retornará `undefined` até que o Observable emita. Isso é semelhante ao comportamento do pipe `async`, que retorna `null`.

#### A opção `requireSync` {#the-requiresync-option}

Alguns Observables têm a garantia de emitir de forma síncrona, como o `BehaviorSubject`. Nesses casos, você pode especificar a opção `requireSync: true`.

Quando `requireSync` é `true`, o `toSignal` garante que o Observable emita de forma síncrona na inscrição. Isso garante que o signal sempre tenha um valor, e nenhum tipo `undefined` ou valor inicial é necessário.

### `manualCleanup`

Por padrão, o `toSignal` cancela automaticamente a inscrição no Observable quando o component ou service que o criou é destruído.

Para substituir esse comportamento, você pode passar a opção `manualCleanup`. Você pode usar essa configuração para Observables que se completam naturalmente.

#### Comparação de igualdade personalizada {#custom-equality-comparison}

Alguns observables podem emitir valores que são **iguais**, mesmo que difiram por referência ou por detalhes menores. A opção `equal` permite que você defina uma **função de igualdade personalizada** para determinar quando dois valores consecutivos devem ser considerados o mesmo.

Quando dois valores emitidos são considerados iguais, o signal resultante **não é atualizado**. Isso evita computações redundantes, atualizações do DOM ou effects sendo executados desnecessariamente.

```ts
import {Component} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {interval, map} from 'rxjs';

@Component(/* ... */)
export class EqualExample {
  temperature$ = interval(1000).pipe(
    map(() => ({temperature: Math.floor(Math.random() * 3) + 20})), // 20, 21, or 22 randomly
  );

  // Only update if the temperature changes
  temperature = toSignal(this.temperature$, {
    initialValue: {temperature: 20},
    equal: (prev, curr) => prev.temperature === curr.temperature,
  });
}
```

### Erro e conclusão {#error-and-completion}

Se um Observable usado no `toSignal` produzir um erro, esse erro será lançado quando o signal for lido.

Se um Observable usado no `toSignal` for concluído, o signal continuará retornando o valor emitido mais recentemente antes da conclusão.

## Criar um Observable do RxJS a partir de um signal com `toObservable` {#create-an-rxjs-observable-from-a-signal-with-toobservable}

Use o utilitário `toObservable` para criar um `Observable` que acompanha o valor de um signal. O valor do signal é monitorado com um `effect`, que emite o valor para o Observable quando ele muda.

```ts
import {Component, signal, Signal, inject} from '@angular/core';
import {toObservable} from '@angular/core/rxjs-interop';
import {switchMap} from 'rxjs';

@Component(/* ... */)
export class SearchResults {
  query: Signal<string> = inject(QueryService).query;
  query$ = toObservable(this.query);

  results$ = this.query$.pipe(switchMap((query) => this.http.get('/search?q=' + query)));
}
```

Conforme o signal `query` muda, o Observable `query$` emite a consulta mais recente e dispara uma nova requisição HTTP.

### Contexto de injeção {#injection-context-to-observable}

Por padrão, o `toObservable` precisa ser executado em um [contexto de injeção](guide/di/dependency-injection-context), como durante a construção de um component ou service. Se um contexto de injeção não estiver disponível, você pode especificar manualmente o `Injector` a ser usado.

### Timing do `toObservable` {#timing-of-toobservable}

O `toObservable` usa um effect para acompanhar o valor do signal em um `ReplaySubject`. Na inscrição, o primeiro valor (se disponível) pode ser emitido de forma síncrona, e todos os valores subsequentes serão assíncronos.

Diferentemente dos Observables, os signals nunca fornecem uma notificação síncrona de mudanças. Mesmo que você atualize o valor de um signal várias vezes, o `toObservable` só emitirá o valor depois que o signal estabilizar.

```ts
const obs$ = toObservable(mySignal);
obs$.subscribe((value) => console.log(value));

mySignal.set(1);
mySignal.set(2);
mySignal.set(3);
```

Aqui, apenas o último valor (3) será registrado no log.

## Usando `rxResource` para dados assíncronos {#using-rxresource-for-async-data}

A [função `resource` do Angular](/guide/signals/resource) oferece uma forma de incorporar dados assíncronos ao código baseado em signals da aplicação. Partindo desse padrão, o `rxResource` permite definir um resource cuja fonte de dados é definida em termos de um `Observable` do RxJS. Em vez de aceitar uma função `loader`, o `rxResource` aceita uma função `stream`, que retorna um `Observable` do RxJS.

```typescript
import {Component, inject, input} from '@angular/core';
import {rxResource} from '@angular/core/rxjs-interop';

@Component(/* ... */)
export class UserProfile {
  // This component relies on a service that exposes data through an RxJS Observable.
  private userData = inject(MyUserDataClient);

  protected userId = input<string>();

  private userResource = rxResource({
    params: () => ({userId: this.userId()}),

    // The `stream` property expects a factory function that returns
    // a data stream as an RxJS Observable.
    stream: ({params}) => this.userData.load(params.userId),
  });
}
```

A propriedade `stream` aceita uma função factory para um `Observable` do RxJS. Essa função factory recebe o valor `params` do resource e retorna um `Observable`. O resource chama essa função factory toda vez que a computação `params` produz um novo valor. Veja [Resource loaders](/guide/signals/resource#resource-loaders) para mais detalhes sobre os parâmetros passados para a função factory.

Em todos os outros aspectos, o `rxResource` se comporta como o `resource` e fornece as mesmas APIs para especificar parâmetros, ler valores, verificar o estado de carregamento e examinar erros.

O `Observable` retornado por `stream` deve sempre emitir um valor ou um erro antes de se completar; veja [`NG0991`](/errors/NG0991) para saber o que acontece caso contrário e como evitar isso.
