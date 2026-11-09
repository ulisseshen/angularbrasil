<!-- ia-translate: true -->

# Reatividade assíncrona com resources

Todas as APIs de signal são síncronas— `signal`, `computed`, `input`, etc. No entanto, aplicações frequentemente precisam lidar com dados que estão disponíveis de forma assíncrona. Um `Resource` oferece uma maneira de incorporar dados assíncronos ao código baseado em signals da sua aplicação, permitindo ainda acessar esses dados de forma síncrona.

Você pode usar um `Resource` para realizar qualquer tipo de operação assíncrona, mas o caso de uso mais comum para `Resource` é buscar dados de um servidor. O exemplo a seguir cria um resource para buscar alguns dados de usuário.

A maneira mais fácil de criar um `Resource` é a função `resource`.

```typescript
import {computed, resource, Signal} from '@angular/core';

const userId: Signal<string> = getUserId();

const userResource = resource({
  // Define a reactive computation.
  // The params value recomputes whenever any read signals change.
  params: () => ({id: userId()}),

  // Define an async loader that retrieves data.
  // The resource calls this function every time the `params` value changes.
  loader: ({params}) => fetchUser(params),
});

// Create a computed signal based on the result of the resource's loader function.
const firstName = computed(() => {
  if (userResource.hasValue()) {
    // `hasValue` serves 2 purposes:
    // - It acts as type guard to strip `undefined` from the type
    // - It protects against reading a throwing `value` when the resource is in error state
    return userResource.value().firstName;
  }

  // fallback in case the resource value is `undefined` or if the resource is in error state
  return undefined;
});
```

A função `resource` aceita um objeto `ResourceOptions` com duas propriedades principais: `params` e `loader`.

A propriedade `params` define uma computação reativa que produz um valor de parâmetro. Sempre que os signals lidos nessa computação mudam, o resource produz um novo valor de parâmetro, de forma semelhante ao `computed`.

A propriedade `loader` define um `ResourceLoader`— uma função assíncrona que recupera algum estado. O resource chama o loader toda vez que a computação `params` produz um novo valor, passando esse valor para o loader. Veja [Resource loaders](#resource-loaders) abaixo para mais detalhes.

`Resource` tem um signal `value` que contém os resultados do loader.

## Resource loaders

Ao criar um resource, você especifica um `ResourceLoader`. Este loader é uma função assíncrona que aceita um único parâmetro— um objeto `ResourceLoaderParams`— e retorna um valor.

O objeto `ResourceLoaderParams` contém três propriedades: `params`, `previous` e `abortSignal`.

| Propriedade   | Descrição                                                                                                                                                 |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `params`      | O valor da computação `params` do resource.                                                                                                               |
| `previous`    | Um objeto com uma propriedade `status`, contendo o `ResourceStatus` anterior.                                                                             |
| `abortSignal` | Um [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). Veja [Abortar requisições](#aborting-requests) abaixo para detalhes. |

Se a computação `params` retornar `undefined`, a função loader não executa e o status do resource se torna `'idle'`.

### Resources de streaming {#streaming-resources}

Algumas fontes de dados assíncronos produzem múltiplos valores ao longo do tempo, em vez de retornar um único resultado. Exemplos incluem WebSockets, Server-Sent Events (SSE) e listeners `onSnapshot` do Firestore.

Use `stream` para essas fontes de dados que se atualizam continuamente. Diferentemente de `loader`, que resolve uma vez para cada requisição, `stream` retorna um signal cujo valor pode continuar a se atualizar conforme novos dados ficam disponíveis.

Use `loader` para operações assíncronas pontuais, como buscar dados de um endpoint HTTP.

Neste exemplo, `userUpdates` simula uma fonte externa, como uma conexão WebSocket ou SSE.

```typescript
const userUpdates = signal({value: 'Alice'});

const userResource = resource({
  stream: () => userUpdates,
});

// Simulate a new value arriving from the external data source:
userUpdates.set({value: 'Bob'});
```

### Abortar requisições {#aborting-requests}

Um resource aborta uma operação de carregamento pendente se a computação `params` mudar enquanto o resource está carregando.

Você pode usar o `abortSignal` em `ResourceLoaderParams` para responder a requisições abortadas. Por exemplo, a função nativa `fetch` aceita um `AbortSignal`:

```typescript
const userId: Signal<string> = getUserId();

const userResource = resource({
  params: () => ({id: userId()}),
  loader: ({params, abortSignal}): Promise<User> => {
    // fetch cancels any outstanding HTTP requests when the given `AbortSignal`
    // indicates that the request has been aborted.
    return fetch(`users/${params.id}`, {signal: abortSignal}).then((res) => res.json());
  },
});
```

Veja [`AbortSignal` no MDN](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) para mais detalhes sobre cancelamento de requisições com `AbortSignal`.

### Recarregando {#reloading}

Você pode acionar programaticamente o `loader` de um resource chamando o método `reload`.

```typescript
const userId: Signal<string> = getUserId();

const userResource = resource({
  params: () => ({id: userId()}),
  loader: ({params}) => fetchUser(params),
});

// ...

userResource.reload();
```

## Status do Resource {#resource-status}

O objeto resource tem várias propriedades de signal para ler o status do loader assíncrono.

| Propriedade | Descrição                                                                                                                                                                                                                       |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value`     | O valor mais recente do resource, ou o valor padrão (`undefined`, a menos que `defaultValue` seja definido) caso nenhum valor tenha sido recebido. Ler `value()` lança um erro quando o status é `'error'`.                        |
| `hasValue`  | Se o resource tem um valor.                                                                                                                                                                                                     |
| `error`     | O erro mais recente encontrado ao executar o loader do resource, ou `undefined` se nenhum erro ocorreu.                                                                                                                       |
| `isLoading` | Se o loader do resource está em execução no momento.                                                                                                                                                                            |
| `status`    | O `ResourceStatus` específico do resource, conforme descrito abaixo.                                                                                                                                                            |

O signal `status` fornece um `ResourceStatus` específico que descreve o estado do resource usando uma constante string.

| Status        | `value()`                 | Descrição                                                                                 |
| ------------- | :------------------------ | ----------------------------------------------------------------------------------------- |
| `'idle'`      | `undefined`               | O resource não tem requisição válida e o loader não foi executado.                        |
| `'error'`     | Lança um erro             | O loader encontrou um erro.                                                               |
| `'loading'`   | `undefined`               | O loader está em execução como resultado da mudança do valor de `params`.                 |
| `'reloading'` | Valor anterior            | O loader está em execução como resultado da chamada do método `reload` do resource.       |
| `'resolved'`  | Valor resolvido           | O loader foi concluído.                                                                   |
| `'local'`     | Valor definido localmente | O valor do resource foi definido localmente via `.set()` ou `.update()`                   |

Você pode usar essas informações de status para exibir condicionalmente elementos de interface do usuário, como indicadores de carregamento e mensagens de erro.

## Armazenando em cache dados de `resource` com SSR {#caching-resource-data-with-ssr}

Quando uma aplicação é renderizada no servidor, um loader de resource é executado uma vez para produzir o HTML inicial. Durante a hidratação, o navegador normalmente executa o mesmo loader novamente.

Para reutilizar o resultado do servidor, forneça um `id` para o resource. O Angular armazena o valor resolvido em `TransferState` no servidor e o usa no cliente para inicializar o resource em um estado `'resolved'`.

```ts
const userId: Signal<string> = getUserId();

const userResource = resource({
  params: () => ({id: userId()}),
  loader: ({params}) => fetchUser(params),
  id: 'user-unique-id',
});
```

O valor de `id` deve ser único dentro da sua aplicação e idêntico no servidor e no cliente, para que o Angular consiga associar a entrada em cache ao resource que a requisitou.

IMPORTANT: Como o valor em cache é serializado no HTML da página, evite definir `id` em resources que carregam dados específicos do usuário que disparou a renderização no servidor, especialmente se o HTML renderizado puder ser armazenado em cache ou compartilhado entre usuários.

## Encadeando resources {#chaining-resources}

Às vezes, um resource depende do resultado de outro. Você pode expressar essa dependência usando a função `chain`, disponível no objeto de contexto de `params`.

```typescript
import {resource} from '@angular/core';

const userResource = resource({
  params: () => ({id: getUserId()}),
  loader: ({params}) => fetchUser(params),
});

const companyResource = resource({
  params: ({chain}) => chain(userResource)?.companyId,
  loader: ({params: companyId}) => fetchCompany(companyId),
});
```

Aqui, `companyResource` depende do `companyId` do usuário, que só é conhecido depois que `userResource` é carregado. `chain(userResource)` lê o valor de `userResource` e propaga automaticamente o status dele para `companyResource`:

- Se `userResource` está **idle**, `companyResource` também fica `idle`.
- Se `userResource` está **loading** ou **reloading**, `companyResource` entra no estado `loading` e seu loader não é executado. Observe que, durante `reloading`, `chain` não retorna o valor resolvido anterior.
- Se `userResource` está em estado de **error**, `companyResource` também entra no estado `error`.
- Se `userResource` está **resolved** ou **local**, `chain` retorna seu valor atual, que `companyResource` então usa como seus params.

Quando `chain` propaga um status de `userResource` (`idle`, `loading`, `reloading` ou `error`), a função de params não continua. Quando `userResource` está `resolved` ou `local`, `chain` retorna seu valor, que pode ser `undefined`. O exemplo trata isso com `chain(userResource)?.companyId`, de modo que um valor `undefined` resulta em params `undefined` e `companyResource` fica `idle`.

NOTE: Passe o valor encadeado diretamente como valor de params, em vez de envolvê-lo em um objeto. Um valor de params como `{companyId: undefined}` ainda é um valor definido, então o loader seria executado com um `companyId` `undefined`, em vez de o resource ficar `idle`.

### Encadeamento versus leitura direta dos valores de resource {#chaining-vs-reading-resource-values-directly}

Você pode ser tentado a ler o valor de um resource diretamente dentro de `params`:

```typescript {avoid, header: 'reads value() directly without status propagation'}
const companyResource = resource({
  params: () => {
    const user = userResource.value(); // may be undefined
    return user ? {companyId: user.companyId} : undefined;
  },
  loader: ({params}) => fetchCompany(params.companyId),
});
```

Embora isso funcione, retornar `undefined` de `params` faz o resource ficar `idle` em vez de refletir o estado real do resource de origem. Usar `chain` é preferível, porque reflete corretamente os estados `loading` e `error`.

Recorra a `chain` apenas quando o resource downstream executar o próprio trabalho assíncrono que depende do valor de origem. Se você só precisa derivar um valor de forma síncrona a partir de um resource, use `computed`.

## Busca de dados reativa com `httpResource` {#reactive-data-fetching-with-httpresource}

[`httpResource`](/guide/http/http-resource) é um wrapper em torno do `HttpClient` que fornece o status da requisição e a resposta como signals. Ele faz requisições HTTP através da pilha HTTP do Angular, incluindo interceptors.

## Composição de resources com snapshots {#resource-composition-with-snapshots}

Um `ResourceSnapshot` é uma representação estruturada do estado atual de um resource. Todo resource tem uma propriedade `snapshot` que fornece um signal com o seu estado atual.

```ts
const userId: Signal<string> = getUserId();

const userResource = resource({
  params: () => ({id: userId()}),
  loader: ({params}) => fetchUser(params),
});

const userSnapshot = userResource.snapshot;
```

Cada snapshot contém um `status` e também um `value` ou um `error`.

### Compondo resources com snapshots {#composing-resources-with-snapshots}

IMPORTANT: `resourceFromSnapshots` é [experimental](reference/releases#experimental). Está pronto para você experimentar, mas pode mudar antes de se tornar estável.

Você pode criar novos resources a partir de snapshots usando `resourceFromSnapshots`. Isso permite a composição com APIs de signal, como `computed` e `linkedSignal`, para transformar o comportamento de um resource.

```ts
import {
  Component,
  input,
  linkedSignal,
  resourceFromSnapshots,
  Resource,
  ResourceSnapshot,
} from '@angular/core';
import {httpResource} from '@angular/common/http';

function withPreviousValue<T>(input: Resource<T>): Resource<T> {
  const derived = linkedSignal<ResourceSnapshot<T>, ResourceSnapshot<T>>({
    source: input.snapshot,
    computation: (snap, previous) => {
      if (snap.status === 'loading' && previous && previous.value.status !== 'error') {
        // When the input resource enters loading state, we keep the value
        // from its previous state, if any.
        return {status: 'loading' as const, value: previous.value.value};
      }

      // Otherwise we simply forward the state of the input resource.
      return snap;
    },
  });

  return resourceFromSnapshots(derived);
}

@Component({/*... */})
export class AwesomeProfile {
  userId = input.required<number>();
  user = withPreviousValue(httpResource(() => `/user/${this.userId()}`));
  // When userId changes, user.value() keeps the old user data until the new one loads
}
```
