<!-- ia-translate: true -->
# Cancelando a inscrição com `takeUntilDestroyed` {#unsubscribing-with-takeuntildestroyed}

TIP: Este guia assume que você está familiarizado com o [ciclo de vida de components e directives](guide/components/lifecycle).

O operador `takeUntilDestroyed`, do `@angular/core/rxjs-interop`, oferece uma forma concisa e confiável de cancelar automaticamente a inscrição em um Observable quando um component ou directive é destruído. Isso evita vazamentos de memória comuns com inscrições do RxJS. Ele funciona de forma semelhante ao operador [`takeUntil`](https://rxjs.dev/api/operators/takeUntil) do RxJS, mas sem a necessidade de um Subject separado.

```typescript
import {Component, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Observable} from 'rxjs';
import {NotificationDispatcher, CustomPopupShower} from './some-shared-project-code';

@Component(/* ... */)
export class UserProfile {
  private dispatcher = inject(NotificationDispatcher);
  private popup = inject(CustomPopupShower);

  constructor() {
    // This subscription the 'notifications' Observable is automatically
    // unsubscribed when the 'UserProfile' component is destroyed.
    const messages: Observable<string> = this.dispatcher.notifications;
    messages.pipe(takeUntilDestroyed()).subscribe((message) => {
      this.popup.show(message);
    });
  }
}
```

O operador `takeUntilDestroyed` aceita um único argumento opcional do tipo [`DestroyRef`](/api/core/DestroyRef). O operador usa o `DestroyRef` para saber quando o component ou directive foi destruído. Você pode omitir esse argumento ao chamar `takeUntilDestroyed` em um [contexto de injeção](/guide/di/dependency-injection-context), tipicamente o construtor de um component ou directive. Sempre forneça um `DestroyRef` se o seu código puder chamar `takeUntilDestroyed` fora de um contexto de injeção.

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
    messages.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((message) => {
      this.popup.show(message);
    });
  }
}
```
