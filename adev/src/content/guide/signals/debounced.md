<!-- ia-translate: true -->
# Aplicando debounce a signals com `debounced` {#debouncing-signals-with-debounced}

IMPORTANT: `debounced` é [experimental](reference/releases#experimental). Ele está pronto para você experimentar, mas pode mudar antes de se tornar estável.

Use `debounced` para atrasar a reação ao valor de um signal até que ele pare de mudar. Ele retorna um `Resource` cujo valor reflete o valor com debounce do signal de origem.

```angular-ts
import {Component, debounced, resource, signal} from '@angular/core';

@Component({
  template: `
    <input (input)="query.set($event.target.value)" />

    @if (results.isLoading()) {
      <p>Pesquisando…</p>
    }
    @for (item of results.value(); track item.id) {
      <li>{{ item.name }}</li>
    }
  `,
})
export class Search {
  query = signal('');

  debouncedQuery = debounced(this.query, 300);

  results = resource({
    params: () => this.debouncedQuery.value(),
    loader: ({params}) => fetchResults(params),
  });
}
```

`debounced` recebe o signal de origem e uma duração de espera em milissegundos. O `value()` do resource retornado sempre contém o último valor estabilizado, e `status()` informa se um novo valor ainda está pendente.

## Status durante o debounce {#status-during-debounce}

Enquanto o timer de debounce está em contagem regressiva, `status()` é `'loading'` e `value()` retorna o valor resolvido anteriormente. Quando o timer expira, o resource se estabiliza em `'resolved'`. Se o signal de origem lançar um erro, o resource entra imediatamente em `'error'`; nenhum timer é executado.

Veja [Status do resource](/guide/signals/resource#resource-status) para a lista completa de status e o comportamento de `value()` em cada um deles.

## Função de espera customizada {#custom-wait-function}

Em vez de uma duração em milissegundos, você pode passar uma função que retorna uma `Promise<void>`. O resource é resolvido quando a promise é resolvida. Se o signal de origem mudar antes de a promise ser estabilizada, o Angular descarta a promise anterior e inicia uma nova.

```ts
debouncedQuery = debounced(query, (value, lastSnapshot) => {
  // Tenta novamente imediatamente após um erro, em vez de fazer o usuário esperar de novo.
  if (lastSnapshot.status === 'error') return;
  // Consultas curtas recebem um atraso maior, pois o usuário provavelmente ainda está digitando.
  const ms = value.length < 3 ? 500 : 200;
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
});
```

Veja o tipo `DebounceTimer` na referência da API para mais detalhes.

## Igualdade {#equality}

Por padrão, `debounced` usa `Object.is` para comparar valores.

Forneça uma função de igualdade customizada com a opção `equal` quando a verificação de identidade padrão for rigorosa demais:

```ts
debouncedFilter = debounced(filter, 200, {
  equal: (a, b) => a.category === b.category && a.minPrice === b.minPrice,
});
```

## Contexto de injeção {#injection-context}

`debounced` deve ser chamado dentro de um [contexto de injeção](guide/di/dependency-injection-context). O Angular destrói automaticamente o resource com debounce e cancela qualquer timer pendente quando o injector é destruído.

Para usar `debounced` fora de um contexto de injeção, passe um `Injector` explícito nas opções:

```ts
@Service()
export class SearchService {
  private injector = inject(Injector);

  createDebouncedQuery(query: Signal<string>): Resource<string> {
    return debounced(query, 300, {injector: this.injector});
  }
}
```
