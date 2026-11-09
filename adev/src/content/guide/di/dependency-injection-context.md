<!-- ia-translate: true -->

# Contexto de injeção

O sistema de injeção de dependência (DI) depende de um contexto de runtime em que o injector atual está disponível.

Isso significa que os injectors só funcionam quando você executa código dentro desse contexto.

Você tem um contexto de injeção disponível nas seguintes situações:

- Durante a construção (via `constructor`) de uma classe instanciada pelo sistema de DI, como um `@Injectable` ou `@Component`.
- Nos inicializadores de campo dessas classes.
- Na função factory especificada em `useFactory` de um `Provider` ou de um `@Injectable`.
- Na função `factory` especificada para um `InjectionToken`.
- Dentro de um stack frame que roda em um contexto de injeção.

Saber quando você está em um contexto de injeção permite usar a função [`inject`](api/core/inject) para recuperar dependências.

NOTE: Para exemplos básicos de uso de `inject()` em construtores de classes e inicializadores de campo, veja o [guia de visão geral](/guide/di#where-can-inject-be-used).

## Stack frame em contexto {#stack-frame-in-context}

Algumas APIs são projetadas para rodar dentro de um contexto de injeção. É o caso, por exemplo, dos router guards. Isso permite usar [`inject`](api/core/inject) dentro da função do guard para acessar services.

Aqui está um exemplo para `CanActivateFn`:

```ts {highlight: [3]}
const canActivateTeam: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  return inject(PermissionsService).canActivate(inject(UserToken), route.params.id);
};
```

## Executar dentro de um contexto de injeção {#run-within-an-injection-context}

Se você precisa executar uma função dentro de um contexto de injeção sem já estar em um, pode usar `runInInjectionContext`.
Isso exige acesso a um injector, como o `EnvironmentInjector`:

```ts {highlight: [7], header:"hero.service.ts"}
@Service()
export class HeroService {
  private environmentInjector = inject(EnvironmentInjector);

  someMethod() {
    runInInjectionContext(this.environmentInjector, () => {
      inject(SomeService); // Faça o que precisar com o service injetado
    });
  }
}
```

Observe que o [`inject`](/api/core/inject) só retorna uma instância se o injector conseguir resolver o token solicitado.

## Verificando o contexto {#asserts-the-context}

O Angular oferece a função auxiliar `assertInInjectionContext` para verificar se o contexto atual é um contexto de injeção e lançar um erro claro caso não seja. Passe uma referência à função que chama para que a mensagem de erro aponte para o ponto de entrada correto da API. Isso gera uma mensagem mais clara e acionável do que o erro genérico de injeção padrão.

```ts
import {ElementRef, assertInInjectionContext, inject} from '@angular/core';

export function injectNativeElement<T extends Element>(): T {
  assertInInjectionContext(injectNativeElement);
  return inject(ElementRef).nativeElement;
}
```

Você pode então chamar essa função auxiliar **a partir de um contexto de injeção** (construtor, inicializador de campo, factory de provider ou código executado via `runInInjectionContext`):

```ts
import {Component, inject} from '@angular/core';
import {injectNativeElement} from './dom-helpers';

@Component({/* … */})
export class PreviewCard {
  readonly hostEl = injectNativeElement<HTMLElement>(); // O inicializador de campo roda em um contexto de injeção.

  onAction() {
    const anotherRef = injectNativeElement<HTMLElement>(); // Falha: roda fora de um contexto de injeção.
  }
}
```

## Usando DI fora de um contexto {#using-di-outside-of-a-context}

Se você chamar [`inject`](api/core/inject) ou `assertInInjectionContext` fora de um contexto de injeção, o Angular lança o [erro NG0203](/errors/NG0203).
