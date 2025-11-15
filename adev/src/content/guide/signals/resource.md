<!-- ia-translate: true -->
# Reatividade assíncrona com resources

IMPORTANT: `resource` é [experimental](reference/releases#experimental). Está pronto para você experimentar, mas pode mudar antes de ser estável.

A maioria das APIs de signal são síncronas— `signal`, `computed`, `input`, etc. No entanto, aplicações frequentemente precisam lidar com dados que estão disponíveis de forma assíncrona. Um `Resource` oferece uma forma de incorporar dados assíncronos no código baseado em signals da sua aplicação.

Você pode usar um `Resource` para realizar qualquer tipo de operação assíncrona, mas o caso de uso mais comum para `Resource` é buscar dados de um servidor. O exemplo a seguir cria um resource para buscar alguns dados de usuário.

A maneira mais fácil de criar um `Resource` é a função `resource`.

```typescript
import {resource, Signal} from '@angular/core';

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
    // - If protects against reading a throwing `value` when the resource is in error state
    return userResource.value().firstName;
  }

  // fallback in case the resource value is `undefined` or if the resource is in error state
  return undefined;
});
```

A função `resource` aceita um objeto `ResourceOptions` com duas propriedades principais: `params` e `loader`.

A propriedade `params` define uma computação reativa que produz um valor de parâmetro. Sempre que signals lidos nesta computação mudam, o resource produz um novo valor de parâmetro, similar ao `computed`.

A propriedade `loader` define um `ResourceLoader`— uma função assíncrona que recupera algum estado. O resource chama o loader toda vez que a computação `params` produz um novo valor, passando esse valor para o loader. Veja [Loaders de Resource](#resource-loaders) abaixo para mais detalhes.

`Resource` tem um signal `value` que contém os resultados do loader.

## Loaders de Resource

Ao criar um resource, você especifica um `ResourceLoader`. Este loader é uma função assíncrona que aceita um único parâmetro— um objeto `ResourceLoaderParams`— e retorna um valor.

O objeto `ResourceLoaderParams` contém três propriedades: `params`, `previous` e `abortSignal`.

| Propriedade   | Descrição                                                                                                                                         |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `params`      | O valor da computação `params` do resource.                                                                                                       |
| `previous`    | Um objeto com uma propriedade `status`, contendo o `ResourceStatus` anterior.                                                                     |
| `abortSignal` | Um [`AbortSignal`](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal). Veja [Abortando requisições](#aborting-requests) abaixo para detalhes. |

Se a computação `params` retorna `undefined`, a função loader não executa e o status do resource se torna `'idle'`.

### Abortando requisições

Um resource aborta uma operação de carregamento em andamento se a computação `params` muda enquanto o resource está carregando.

Você pode usar o `abortSignal` em `ResourceLoaderParams` para responder a requisições abortadas. Por exemplo, a função nativa `fetch` aceita um `AbortSignal`:

```typescript
const userId: Signal<string> = getUserId();

const userResource = resource({
  params: () => ({id: userId()}),
  loader: ({params, abortSignal}): Promise<User> => {
    // fetch cancels any outstanding HTTP requests when the given `AbortSignal`
    // indicates that the request has been aborted.
    return fetch(`users/${params.id}`, {signal: abortSignal});
  },
});
```

Veja [`AbortSignal` no MDN](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) para mais detalhes sobre cancelamento de requisições com `AbortSignal`.

### Recarregando

Você pode disparar programaticamente o `loader` de um resource chamando o método `reload`.

```typescript
const userId: Signal<string> = getUserId();

const userResource = resource({
  params: () => ({id: userId()}),
  loader: ({params}) => fetchUser(params),
});

// ...

userResource.reload();
```

## Status de Resource

O objeto resource tem várias propriedades signal para ler o status do loader assíncrono.

| Propriedade | Descrição                                                                                                       |
| ----------- | --------------------------------------------------------------------------------------------------------------- |
| `value`     | O valor mais recente do resource, ou `undefined` se nenhum valor foi recebido.                                  |
| `hasValue`  | Se o resource tem um valor.                                                                                     |
| `error`     | O erro mais recente encontrado ao executar o loader do resource, ou `undefined` se nenhum erro ocorreu.         |
| `isLoading` | Se o loader do resource está executando atualmente.                                                             |
| `status`    | O `ResourceStatus` específico do resource, conforme descrito abaixo.                                            |

O signal `status` fornece um `ResourceStatus` específico que descreve o estado do resource usando uma constante string.

| Status        | `value()`         | Descrição                                                                        |
| ------------- | :---------------- | -------------------------------------------------------------------------------- |
| `'idle'`      | `undefined`       | O resource não tem requisição válida e o loader não executou.                    |
| `'error'`     | `undefined`       | O loader encontrou um erro.                                                      |
| `'loading'`   | `undefined`       | O loader está executando como resultado da mudança do valor `params`.            |
| `'reloading'` | Valor anterior    | O loader está executando como resultado de chamar o método `reload` do resource. |
| `'resolved'`  | Valor resolvido   | O loader foi concluído.                                                          |
| `'local'`     | Valor local       | O valor do resource foi definido localmente via `.set()` ou `.update()`          |

Você pode usar essas informações de status para exibir condicionalmente elementos de interface de usuário, como indicadores de carregamento e mensagens de erro.

## Busca de dados reativa com `httpResource`

[`httpResource`](/guide/http/http-resource) é um wrapper em torno do `HttpClient` que fornece o status da requisição e a resposta como signals. Ele faz requisições HTTP através da stack HTTP do Angular, incluindo interceptors.
