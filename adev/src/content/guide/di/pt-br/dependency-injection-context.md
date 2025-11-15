<!-- ia-translate: true -->
# Contexto de injeção

O sistema de injeção de dependência (DI) depende internamente de um contexto de tempo de execução onde o injector atual está disponível.

Isso significa que injectors podem funcionar apenas quando o código é executado em tal contexto.

O contexto de injeção está disponível nestas situações:

- Durante a construção (via `constructor`) de uma classe sendo instanciada pelo sistema de DI, como um `@Injectable` ou `@Component`.
- No inicializador para campos de tais classes.
- Na factory function especificada para `useFactory` de um `Provider` ou um `@Injectable`.
- Na factory function especificada para um `InjectionToken`.
- Dentro de um stack frame que executa em um contexto de injeção.

Saber quando você está em um contexto de injeção permitirá que você use a função [`inject`](api/core/inject) para injetar instâncias.

NOTE: Para exemplos básicos de uso de `inject()` em construtores de classe e inicializadores de campo, veja o [guia de visão geral](guide/di/overview#where-can-inject-be-used).

## Stack frame em contexto

Algumas APIs são projetadas para serem executadas em um contexto de injeção. Este é o caso, por exemplo, com router guards. Isso permite o uso de [`inject`](api/core/inject) dentro da função guard para acessar um service.

Aqui está um exemplo para `CanActivateFn`

<docs-code language="typescript" highlight="[3]">
const canActivateTeam: CanActivateFn =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      return inject(PermissionsService).canActivate(inject(UserToken), route.params.id);
    };
</docs-code>

## Executar dentro de um contexto de injeção

Quando você quer executar uma determinada função em um contexto de injeção sem já estar em um, você pode fazer isso com `runInInjectionContext`.
Isso requer acesso a um injector específico, como o `EnvironmentInjector`, por exemplo:

<docs-code header="src/app/heroes/hero.service.ts" language="typescript"
           highlight="[9]">
@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private environmentInjector = inject(EnvironmentInjector);

  someMethod() {
    runInInjectionContext(this.environmentInjector, () => {
      inject(SomeService); // Do what you need with the injected service
    });
  }
}
</docs-code>

Note que `inject` retornará uma instância apenas se o injector puder resolver o token requerido.

## Verificando o contexto

O Angular fornece a função helper `assertInInjectionContext` para verificar que o contexto atual é um contexto de injeção e lança um erro claro se não for. Passe uma referência para a função chamadora para que a mensagem de erro aponte para o ponto de entrada correto da API. Isso produz uma mensagem mais clara e acionável do que o erro genérico de injeção padrão.

```ts
import { ElementRef, assertInInjectionContext, inject } from '@angular/core';

export function injectNativeElement<T extends Element>(): T {
    assertInInjectionContext(injectNativeElement);
    return inject(ElementRef).nativeElement;
}
```

Você pode então chamar este helper **de um contexto de injeção** (constructor, inicializador de campo, provider factory, ou código executado via `runInInjectionContext`):

```ts
import { Component, inject } from '@angular/core';
import { injectNativeElement } from './dom-helpers';

@Component({ /* … */ })
export class PreviewCard {
  readonly hostEl = injectNativeElement<HTMLElement>(); // Field initializer runs in an injection context.

  onAction() {
    const anotherRef = injectNativeElement<HTMLElement>(); // Fails: runs outside an injection context.
  }
}
```

## Usando DI fora de um contexto

Chamar [`inject`](api/core/inject) ou chamar `assertInInjectionContext` fora de um contexto de injeção lançará [erro NG0203](/errors/NG0203).
