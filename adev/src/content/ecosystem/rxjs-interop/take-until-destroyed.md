<!-- ia-translate: true -->
# Cancelando inscrição com `takeUntilDestroyed`

DICA: Este guia assume que você está familiarizado com [ciclo de vida de component e directive](guide/components/lifecycle).

O operador `takeUntilDestroyed`, do `@angular/core/rxjs-interop`, fornece uma maneira concisa e confiável de cancelar automaticamente a inscrição de um Observable quando um component ou directive é destruído. Isso previne vazamentos de memória comuns com inscrições RxJS. Ele funciona de forma similar ao operador [`takeUntil`](https://rxjs.dev/api/operators/takeUntil) do RxJS, mas sem a necessidade de um Subject separado.

```typescript
import {Component, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {NotificationDispatcher, CustomPopupShower} from './some-shared-project-code';

@Component(/* ... */)
export class UserProfile {
  private dispatcher = inject(NotificationDispatcher);
  private popup = inject(CustomPopupShower);

  constructor() {
    // This subscription the 'notifications' Observable is automatically
    // unsubscribed when the 'UserProfile' component is destroyed.
    const messages: Observable<string> = this.dispatcher.notifications;
    messages.pipe(takeUntilDestroyed()).subscribe(message => {
      this.popup.show(message);
    });
  }
}
```

O operador `takeUntilDestroyed` aceita um único argumento opcional [`DestroyRef`](https://angular.dev/api/core/DestroyRef). O operador usa `DestroyRef` para saber quando o component ou directive foi destruído. Você pode omitir esse argumento ao chamar `takeUntilDestroyed` em um [contexto de injeção](https://angular.dev/guide/di/dependency-injection-context), tipicamente o constructor de um component ou directive. Sempre forneça um `DestroyRef` se seu código puder chamar `takeUntilDestroyed` fora de um contexto de injeção.

```typescript
@Component(/* ... */)
export class UserProfile {
  private dispatcher = inject(NotificationDispatcher);
  private popup = inject(CustomPopupShower);
  private destroyRef = inject(DestroyRef);

  startListeningToNotifications() {
    // Always pass a `DestroyRef` if you call `takeUntilDestroyed` outside
    // of an injection context.
    const messages: Observable<string> = this.dispatcher.notifications;
    messages.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(message => {
      this.popup.show(message);
    });
  }
}
```
