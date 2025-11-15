<!-- ia-translate: true -->
# Interoperabilidade entre RxJS e signals do Angular

O pacote `@angular/core/rxjs-interop` oferece APIs que ajudam você a integrar RxJS e signals do Angular.

## Criar um signal a partir de um Observable RxJs com `toSignal`

Use a função `toSignal` para criar um signal que rastreia o valor de um Observable. Ela se comporta de forma similar ao pipe `async` em templates, mas é mais flexível e pode ser usada em qualquer lugar de uma aplicação.

```angular-ts
import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { interval } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  template: `{{ counter() }}`,
})
export class Ticker {
  counterObservable = interval(1000);

  // Get a `Signal` representing the `counterObservable`'s value.
  counter = toSignal(this.counterObservable, {initialValue: 0});
}
```

Assim como o pipe `async`, `toSignal` se inscreve no Observable imediatamente, o que pode disparar efeitos colaterais. A inscrição criada por `toSignal` automaticamente cancela a inscrição do Observable quando o component ou service que chama `toSignal` é destruído.

IMPORTANTE: `toSignal` cria uma inscrição. Você deve evitar chamá-lo repetidamente para o mesmo Observable, e em vez disso reutilizar o signal que ele retorna.

### Contexto de injeção

`toSignal` por padrão precisa executar em um [contexto de injeção](guide/di/dependency-injection-context), como durante a construção de um component ou service. Se um contexto de injeção não estiver disponível, você pode especificar manualmente o `Injector` a ser usado.

### Valores iniciais

Observables podem não produzir um valor de forma síncrona na inscrição, mas signals sempre requerem um valor atual. Existem várias maneiras de lidar com esse valor "inicial" dos signals `toSignal`.

#### A opção `initialValue`

Como no exemplo acima, você pode especificar uma opção `initialValue` com o valor que o signal deve retornar antes que o Observable emita pela primeira vez.

#### Valores iniciais `undefined`

Se você não fornecer um `initialValue`, o signal resultante retornará `undefined` até que o Observable emita. Isso é similar ao comportamento do pipe `async` de retornar `null`.

#### A opção `requireSync`

Alguns Observables são garantidos para emitir de forma síncrona, como `BehaviorSubject`. Nesses casos, você pode especificar a opção `requireSync: true`.

Quando `requiredSync` é `true`, `toSignal` garante que o Observable emita de forma síncrona na inscrição. Isso garante que o signal sempre tenha um valor, e nenhum tipo `undefined` ou valor inicial é necessário.

### `manualCleanup`

Por padrão, `toSignal` automaticamente cancela a inscrição do Observable quando o component ou service que o cria é destruído.

Para substituir esse comportamento, você pode passar a opção `manualCleanup`. Você pode usar essa configuração para Observables que se completam naturalmente.

#### Comparação de igualdade personalizada

Alguns observables podem emitir valores que são **iguais** mesmo que difiram por referência ou detalhe menor. A opção `equal` permite que você defina uma **função de igualdade personalizada** para determinar quando dois valores consecutivos devem ser considerados iguais.

Quando dois valores emitidos são considerados iguais, o signal resultante **não atualiza**. Isso evita computações redundantes, atualizações de DOM ou effects sendo executados desnecessariamente.

```ts
import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { interval, map } from 'rxjs';

@Component(/* ... */)
export class EqualExample {
  temperature$ = interval(1000).pipe(
    map(() => ({ temperature: Math.floor(Math.random() * 3) + 20 }) ) // 20, 21, or 22 randomly
  );

  // Only update if the temperature changes
  temperature = toSignal(this.temperature$, {
    initialValue: { temperature : 20  },
    equal: (prev, curr) => prev.temperature === curr.temperature
  });
}
```

### Erro e Conclusão

Se um Observable usado em `toSignal` produz um erro, esse erro é lançado quando o signal é lido.

Se um Observable usado em `toSignal` se completa, o signal continua a retornar o valor emitido mais recente antes da conclusão.

## Criar um Observable RxJS a partir de um signal com `toObservable`

Use o utilitário `toObservable` para criar um `Observable` que rastreia o valor de um signal. O valor do signal é monitorado com um `effect` que emite o valor para o Observable quando ele muda.

```ts
import { Component, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

@Component(/* ... */)
export class SearchResults {
  query: Signal<string> = inject(QueryService).query;
  query$ = toObservable(this.query);

  results$ = this.query$.pipe(
    switchMap(query => this.http.get('/search?q=' + query ))
  );
}
```

Conforme o signal `query` muda, o Observable `query$` emite a última query e dispara uma nova requisição HTTP.

### Contexto de injeção

`toObservable` por padrão precisa executar em um [contexto de injeção](guide/di/dependency-injection-context), como durante a construção de um component ou service. Se um contexto de injeção não estiver disponível, você pode especificar manualmente o `Injector` a ser usado.

### Timing de `toObservable`

`toObservable` usa um effect para rastrear o valor do signal em um `ReplaySubject`. Na inscrição, o primeiro valor (se disponível) pode ser emitido de forma síncrona, e todos os valores subsequentes serão assíncronos.

Diferente de Observables, signals nunca fornecem uma notificação síncrona de mudanças. Mesmo se você atualizar o valor de um signal várias vezes, `toObservable` só emitirá o valor depois que o signal estabilizar.

```ts
const obs$ = toObservable(mySignal);
obs$.subscribe(value => console.log(value));

mySignal.set(1);
mySignal.set(2);
mySignal.set(3);
```

Aqui, apenas o último valor (3) será registrado no log.

## Usando `rxResource` para dados assíncronos

IMPORTANTE: `rxResource` é [experimental](reference/releases#experimental). Está pronto para você testar, mas pode mudar antes de se tornar estável.

A [função `resource` do Angular](/guide/signals/resource) fornece uma maneira de incorporar dados assíncronos no código baseado em signals da sua aplicação. Construindo em cima desse padrão, `rxResource` permite que você defina um resource onde a fonte dos seus dados é definida em termos de um `Observable` RxJS. Em vez de aceitar uma função `loader`, `rxResource` aceita uma função `stream` que aceita um `Observable` RxJS.

```typescript
import {Component, inject} from '@angular/core';
import {rxResource} from '@angular/core/rxjs-interop';

@Component(/* ... */)
export class UserProfile {
  // This component relies on a service that exposes data through an RxJS Observable.
  private userData = inject(MyUserDataClient);

  protected userId = input<string>();

  private userResource = rxResource({
    params: () => ({ userId: this.userId() }),

    // The `stream` property expects a factory function that returns
    // a data stream as an RxJS Observable.
    stream: ({params}) => this.userData.load(params.userId),
  });
}
```

A propriedade `stream` aceita uma função factory para um `Observable` RxJS. Essa função factory recebe o valor `params` do resource e retorna um `Observable`. O resource chama essa função factory toda vez que a computação `params` produz um novo valor. Veja [Resource loaders](/guide/signals/resource#resource-loaders) para mais detalhes sobre os parâmetros passados para a função factory.

Em todos os outros aspectos, `rxResource` se comporta como e fornece as mesmas APIs que `resource` para especificar parâmetros, ler valores, verificar estado de carregamento e examinar erros.
