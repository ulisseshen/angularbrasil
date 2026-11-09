<!-- ia-translate: true -->

# Fazendo requisições HTTP

`HttpClient` tem métodos correspondentes aos diferentes verbos HTTP usados para fazer requisições, tanto para carregar dados quanto para aplicar mutações no servidor. Cada método retorna um [RxJS `Observable`](https://rxjs.dev/guide/observable) que, quando inscrito, envia a requisição e então emite os resultados quando o servidor responde.

NOTE: `Observable`s criados por `HttpClient` podem ser inscritos qualquer número de vezes e farão uma nova requisição ao backend para cada inscrição.

Através de um objeto de opções passado para o método de requisição, várias propriedades da requisição e o tipo de resposta retornado podem ser ajustados.

## Buscando dados JSON {#fetching-json-data}

Buscar dados de um backend frequentemente requer fazer uma requisição GET usando o método [`HttpClient.get()`](api/common/http/HttpClient#get). Este método recebe dois argumentos: a string da URL do endpoint do qual buscar, e um _objeto de opções_ opcional para configurar a requisição.

Por exemplo, para buscar dados de configuração de uma API hipotética usando o método `HttpClient.get()`:

```ts
http.get<Config>('/api/config').subscribe((config) => {
  // processa a configuração.
});
```

Observe o argumento de tipo genérico que especifica que os dados retornados pelo servidor serão do tipo `Config`. Este argumento é opcional, e se você omiti-lo, então os dados retornados terão o tipo `Object`.

TIP: Ao lidar com dados de estrutura incerta e valores potencialmente `undefined` ou `null`, considere usar o tipo `unknown` em vez de `Object` como o tipo de resposta.

CRITICAL: O tipo genérico dos métodos de requisição é uma **asserção** de tipo sobre os dados retornados pelo servidor. `HttpClient` não verifica se os dados de retorno reais correspondem a este tipo.

## Buscando outros tipos de dados {#fetching-other-types-of-data}

Por padrão, `HttpClient` assume que os servidores retornarão dados JSON. Ao interagir com uma API não-JSON, você pode dizer ao `HttpClient` qual tipo de resposta esperar ao fazer a requisição. Isso é feito com a opção `responseType`.

| **Valor de `responseType`** | **Tipo de resposta retornado**                                                                                                                |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `'json'` (padrão)           | Dados JSON do tipo genérico dado                                                                                                          |
| `'text'`                    | Dados string                                                                                                                              |
| `'arraybuffer'`             | [`ArrayBuffer`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) contendo os bytes brutos da resposta |
| `'blob'`                    | Instância de [`Blob`](https://developer.mozilla.org/docs/Web/API/Blob)                                                                    |

Por exemplo, você pode pedir ao `HttpClient` para baixar os bytes brutos de uma imagem `.jpeg` em um `ArrayBuffer`:

```ts
http.get('/images/dog.jpg', {responseType: 'arraybuffer'}).subscribe((buffer) => {
  console.log('The image is ' + buffer.byteLength + ' bytes large');
});
```

<docs-callout important title="Valor literal para `responseType`">
Como o valor de `responseType` afeta o tipo retornado por `HttpClient`, ele deve ter um tipo literal e não um tipo `string`.

Isso acontece automaticamente se o objeto de opções passado para o método de requisição for um objeto literal, mas se você estiver extraindo as opções de requisição para uma variável ou método auxiliar, pode precisar especificá-lo explicitamente como um literal, como `responseType: 'text' as const`.
</docs-callout>

## Mutando o estado do servidor {#mutating-server-state}

APIs de servidor que realizam mutações frequentemente exigem requisições POST com um corpo de requisição especificando o novo estado ou a mudança a ser feita.

O método [`HttpClient.post()`](api/common/http/HttpClient#post) se comporta de forma semelhante a `get()`, e aceita um argumento `body` adicional antes de suas opções:

```ts
http.post<Config>('/api/config', newConfig).subscribe((config) => {
  console.log('Updated config:', config);
});
```

Muitos tipos diferentes de valores podem ser fornecidos como o `body` da requisição, e `HttpClient` os serializará de acordo:

| **Tipo de `body`**                                                                                                            | **Serializado como**                                 |
| ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| string                                                                                                                        | Texto simples                                        |
| number, boolean, array ou plain object                                                                                        | JSON                                                 |
| [`ArrayBuffer`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)                       | dados brutos do buffer                               |
| [`Blob`](https://developer.mozilla.org/docs/Web/API/Blob)                                                                     | dados brutos com o content type do `Blob`            |
| [`FormData`](https://developer.mozilla.org/docs/Web/API/FormData)                                                             | dados codificados como `multipart/form-data`         |
| [`HttpParams`](api/common/http/HttpParams) ou [`URLSearchParams`](https://developer.mozilla.org/docs/Web/API/URLSearchParams) | string formatada como `application/x-www-form-urlencoded` |

IMPORTANT: Lembre-se de fazer `.subscribe()` nos `Observable`s de requisições de mutação para realmente disparar a requisição.

## Definindo parâmetros de URL {#setting-url-parameters}

Especifique os parâmetros de requisição que devem ser incluídos na URL da requisição usando a opção `params`.

Passar um objeto literal é a maneira mais simples de configurar parâmetros de URL:

```ts
http
  .get('/api/config', {
    params: {filter: 'all'},
  })
  .subscribe((config) => {
    // ...
  });
```

Alternativamente, passe uma instância de `HttpParams` se você precisar de mais controle sobre a construção ou serialização dos parâmetros.

IMPORTANT: Instâncias de `HttpParams` são _imutáveis_ e não podem ser alteradas diretamente. Em vez disso, métodos de mutação como `append()` retornam uma nova instância de `HttpParams` com a mutação aplicada.

```ts
const baseParams = new HttpParams().set('filter', 'all');

http
  .get('/api/config', {
    params: baseParams.set('details', 'enabled'),
  })
  .subscribe((config) => {
    // ...
  });
```

Você pode instanciar `HttpParams` com um `HttpParameterCodec` personalizado que determina como `HttpClient` codificará os parâmetros na URL.

### Codificação de parâmetros personalizada {#custom-parameter-encoding}

Por padrão, `HttpParams` usa o [`HttpUrlEncodingCodec`](api/common/http/HttpUrlEncodingCodec) embutido para codificar e decodificar chaves e valores de parâmetros.

Você pode fornecer sua própria implementação de [`HttpParameterCodec`](api/common/http/HttpParameterCodec) para personalizar como a codificação e a decodificação são aplicadas.

```ts
import {HttpClient, HttpParams, HttpParameterCodec} from '@angular/common/http';
import {inject} from '@angular/core';

export class CustomHttpParamEncoder implements HttpParameterCodec {
  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }

  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }

  decodeKey(key: string): string {
    return decodeURIComponent(key);
  }

  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}

export class ApiService {
  private http = inject(HttpClient);

  search() {
    const params = new HttpParams({
      encoder: new CustomHttpParamEncoder(),
    })
      .set('email', 'dev+alerts@example.com')
      .set('q', 'a & b? c/d = e');

    return this.http.get('/api/items', {params});
  }
}
```

## Definindo headers de requisição {#setting-request-headers}

Especifique os headers de requisição que devem ser incluídos na requisição usando a opção `headers`.

Passar um objeto literal é a maneira mais simples de configurar headers de requisição:

```ts
http
  .get('/api/config', {
    headers: {
      'X-Debug-Level': 'verbose',
    },
  })
  .subscribe((config) => {
    // ...
  });
```

Alternativamente, passe uma instância de `HttpHeaders` se você precisar de mais controle sobre a construção dos headers.

IMPORTANT: Instâncias de `HttpHeaders` são _imutáveis_ e não podem ser alteradas diretamente. Em vez disso, métodos de mutação como `append()` retornam uma nova instância de `HttpHeaders` com a mutação aplicada.

```ts
const baseHeaders = new HttpHeaders().set('X-Debug-Level', 'minimal');

http
  .get<Config>('/api/config', {
    headers: baseHeaders.set('X-Debug-Level', 'verbose'),
  })
  .subscribe((config) => {
    // ...
  });
```

## Interagindo com os eventos de resposta do servidor {#interacting-with-the-server-response-events}

Por conveniência, `HttpClient` por padrão retorna um `Observable` dos dados retornados pelo servidor (o corpo da resposta). Ocasionalmente é desejável examinar a resposta real, por exemplo para recuperar headers de resposta específicos.

Para acessar a resposta inteira, defina a opção `observe` como `'response'`:

```ts
http.get<Config>('/api/config', {observe: 'response'}).subscribe((res) => {
  console.log('Response status:', res.status);
  console.log('Body:', res.body);
});
```

<docs-callout important title="Valor literal para `observe`">
Como o valor de `observe` afeta o tipo retornado por `HttpClient`, ele deve ter um tipo literal e não um tipo `string`.

Isso acontece automaticamente se o objeto de opções passado para o método de requisição for um objeto literal, mas se você estiver extraindo as opções de requisição para uma variável ou método auxiliar, pode precisar especificá-lo explicitamente como um literal, como `observe: 'response' as const`.
</docs-callout>

## Recebendo eventos de progresso brutos {#receiving-raw-progress-events}

Além do corpo da resposta ou do objeto de resposta, `HttpClient` também pode retornar um fluxo de _eventos_ brutos correspondentes a momentos específicos no ciclo de vida da requisição. Esses eventos incluem quando a requisição é enviada, quando o header da resposta é retornado e quando o corpo está completo. Esses eventos também podem incluir _eventos de progresso_ que informam o status de upload e download de corpos de requisição ou resposta grandes.

Eventos de progresso são desabilitados por padrão (pois têm um custo de desempenho), mas podem ser habilitados com as opções `reportUploadProgress` e `reportDownloadProgress`.

NOTE: O backend fetch padrão do `HttpClient` não oferece suporte a eventos de progresso de _upload_ e lança um erro se você definir `reportUploadProgress`. Se a sua aplicação precisar de eventos de progresso de upload, configure o `HttpClient` com `withXhr()` em `provideHttpClient(...)`.

Para observar o fluxo de eventos, defina a opção `observe` como `'events'`:

```ts
http
  .get('/api/download', {
    reportDownloadProgress: true,
    observe: 'events',
  })
  .subscribe((event) => {
    switch (event.type) {
      case HttpEventType.DownloadProgress:
        console.log('Downloaded ' + event.loaded + ' out of ' + event.total + ' bytes');
        break;
      case HttpEventType.Response:
        console.log('Finished downloading!');
        break;
    }
  });
```

<docs-callout important title="Valor literal para `observe`">
Como o valor de `observe` afeta o tipo retornado por `HttpClient`, ele deve ter um tipo literal e não um tipo `string`.

Isso acontece automaticamente se o objeto de opções passado para o método de requisição for um objeto literal, mas se você estiver extraindo as opções de requisição para uma variável ou método auxiliar, pode precisar especificá-lo explicitamente como um literal, como `observe: 'events' as const`.
</docs-callout>

Cada `HttpEvent` relatado no fluxo de eventos tem um `type` que distingue o que o evento representa:

| **Valor de `type`**              | **Significado do evento**                                                          |
| -------------------------------- | ---------------------------------------------------------------------------------- |
| `HttpEventType.Sent`             | A requisição foi despachada para o servidor                                        |
| `HttpEventType.UploadProgress`   | Um `HttpUploadProgressEvent` informando o progresso no upload do corpo da requisição |
| `HttpEventType.ResponseHeader`   | O cabeçalho da resposta foi recebido, incluindo status e headers                   |
| `HttpEventType.DownloadProgress` | Um `HttpDownloadProgressEvent` informando o progresso no download do corpo da resposta |
| `HttpEventType.Response`         | A resposta inteira foi recebida, incluindo o corpo da resposta                     |
| `HttpEventType.User`             | Um evento personalizado de um interceptor HTTP.                                    |

## Lidando com falha de requisição {#handling-request-failure}

Existem três maneiras de uma requisição HTTP falhar:

- Um erro de rede ou de conexão pode impedir que a requisição alcance o servidor backend.
- Uma requisição não obteve resposta a tempo quando a opção de timeout foi definida.
- O backend pode receber a requisição, mas falhar ao processá-la e retornar uma resposta de erro.

`HttpClient` captura todos os tipos de erro acima em um `HttpErrorResponse`, que ele retorna através do canal de erro do `Observable`. Erros de rede e de timeout têm um código de `status` igual a `0`. Para timeouts, o `error` é um `DOMException` chamado `TimeoutError`; para erros de rede, é o erro lançado pelo `fetch` (ou um [`ProgressEvent`](https://developer.mozilla.org/docs/Web/API/ProgressEvent) ao usar `withXhr()`). Erros de backend têm o código de `status` de falha retornado pelo backend, e a resposta de erro como o `error`. Inspecione a resposta para identificar a causa do erro e a ação apropriada para tratá-lo.

A [biblioteca RxJS](https://rxjs.dev/) oferece vários operadores que podem ser úteis para o tratamento de erros.

Você pode usar o operador `catchError` para transformar uma resposta de erro em um valor para a UI. Esse valor pode dizer à UI para exibir uma página ou valor de erro, e capturar a causa do erro, se necessário.

Às vezes, erros transitórios como interrupções de rede podem fazer uma requisição falhar inesperadamente, e simplesmente tentar a requisição novamente permitirá que ela tenha sucesso. O RxJS fornece vários operadores de _retry_ que se reinscrevem automaticamente em um `Observable` que falhou sob certas condições. Por exemplo, o operador `retry()` tentará automaticamente se reinscrever um número especificado de vezes.

### Timeouts

Para definir um timeout para uma requisição, você pode definir a opção `timeout` com um número de milissegundos junto com as outras opções da requisição. Se a requisição ao backend não for concluída dentro do tempo especificado, a requisição será abortada e um erro será emitido.

NOTE: O timeout se aplica somente à requisição HTTP ao backend em si. Ele não é um timeout para toda a cadeia de processamento da requisição. Portanto, esta opção não é afetada por qualquer atraso introduzido por interceptors.

```ts
http
  .get('/api/config', {
    timeout: 3000,
  })
  .subscribe({
    next: (config) => {
      console.log('Config fetched successfully:', config);
    },
    error: (err) => {
      // Se a requisição der timeout, um erro terá sido emitido.
    },
  });
```

## Opções avançadas de fetch {#advanced-fetch-options}

O `HttpClient` do Angular oferece suporte a opções avançadas da API fetch que podem melhorar o desempenho e a experiência do usuário. Essas opções estão disponíveis ao usar o backend fetch, que é o padrão.

### Opções de Fetch {#fetch-options}

As seguintes opções oferecem controle refinado sobre o comportamento da requisição ao usar o backend fetch.

#### Conexões keep-alive {#keep-alive-connections}

A opção `keepalive` permite que uma requisição sobreviva à página que a iniciou. Isso é particularmente útil para requisições de analytics ou de logging que precisam ser concluídas mesmo se o usuário navegar para longe da página.

```ts
http
  .post('/api/analytics', analyticsData, {
    keepalive: true,
  })
  .subscribe();
```

#### Controle de cache HTTP {#http-caching-control}

A opção `cache` controla como a requisição interage com o cache HTTP do navegador, o que pode melhorar significativamente o desempenho de requisições repetidas.

```ts
//  Usa a resposta em cache independentemente da validade
http
  .get('/api/config', {
    cache: 'force-cache',
  })
  .subscribe((config) => {
    // ...
  });

// Sempre busca na rede, ignorando o cache
http
  .get('/api/live-data', {
    cache: 'no-cache',
  })
  .subscribe((data) => {
    // ...
  });

// Usa apenas a resposta em cache, falha se não estiver no cache
http
  .get('/api/static-data', {
    cache: 'only-if-cached',
  })
  .subscribe((data) => {
    // ...
  });
```

#### Prioridade de requisição para Core Web Vitals {#request-priority-for-core-web-vitals}

A opção `priority` permite indicar a importância relativa de uma requisição, ajudando os navegadores a otimizar o carregamento de recursos para melhores pontuações de Core Web Vitals.

```ts
// Prioridade alta para recursos críticos
http
  .get('/api/user-profile', {
    priority: 'high',
  })
  .subscribe((profile) => {
    // ...
  });

// Prioridade baixa para recursos não críticos
http
  .get('/api/recommendations', {
    priority: 'low',
  })
  .subscribe((recommendations) => {
    // ...
  });

// Prioridade automática (padrão) deixa o navegador decidir
http
  .get('/api/settings', {
    priority: 'auto',
  })
  .subscribe((settings) => {
    // ...
  });
```

Valores disponíveis para `priority`:

- `'high'`: Prioridade alta, carregado cedo (ex.: dados críticos do usuário, conteúdo acima da dobra)
- `'low'`: Prioridade baixa, carregado quando os recursos estiverem disponíveis (ex.: analytics, dados de prefetch)
- `'auto'`: O navegador determina a prioridade com base no contexto da requisição (padrão)

TIP: Use `priority: 'high'` para requisições que afetam o Largest Contentful Paint (LCP) e `priority: 'low'` para requisições que não impactam a experiência inicial do usuário.

#### Modo de requisição {#request-mode}

A opção `mode` controla como a requisição lida com requisições cross-origin e determina o tipo de resposta.

```ts
// Apenas requisições same-origin
http
  .get('/api/local-data', {
    mode: 'same-origin',
  })
  .subscribe((data) => {
    // ...
  });

// Requisições cross-origin com CORS habilitado
http
  .get('https://api.external.com/data', {
    mode: 'cors',
  })
  .subscribe((data) => {
    // ...
  });

// Modo no-cors para requisições cross-origin simples
http
  .get('https://external-api.com/public-data', {
    mode: 'no-cors',
  })
  .subscribe((data) => {
    // ...
  });
```

Valores disponíveis para `mode`:

- `'same-origin'`: Permite apenas requisições same-origin, falha para requisições cross-origin
- `'cors'`: Permite requisições cross-origin com CORS (padrão)
- `'no-cors'`: Permite requisições cross-origin simples sem CORS; a resposta é opaca

TIP: No navegador, use `mode: 'same-origin'` para requisições sensíveis que nunca devem ir para outra origem.

IMPORTANT: Durante o SSR no Node.js, o `HttpClient` usa a implementação de Fetch baseada em [Undici do Node.js](https://nodejs.org/api/globals.html#fetch). [O Undici não aplica as verificações de CORS do navegador](https://undici.nodejs.org/#cors), então `mode: 'same-origin'` não restringe requisições do lado do servidor. Valide URLs influenciadas pelo usuário contra uma lista de permissões.

#### Tratamento de redirecionamento {#redirect-handling}

A opção `redirect` especifica como lidar com respostas de redirecionamento do servidor.

```ts
// Segue os redirecionamentos automaticamente (comportamento padrão)
http
  .get('/api/resource', {
    redirect: 'follow',
  })
  .subscribe((data) => {
    // ...
  });

// Impede redirecionamentos automáticos
http
  .get('/api/resource', {
    redirect: 'manual',
  })
  .subscribe((response) => {
    // Trata o redirecionamento manualmente
  });

// Trata redirecionamentos como erros
http
  .get('/api/resource', {
    redirect: 'error',
  })
  .subscribe({
    next: (data) => {
      // Resposta de sucesso
    },
    error: (err) => {
      // Respostas de redirecionamento acionarão este handler de erro
    },
  });
```

Valores disponíveis para `redirect`:

- `'follow'`: Segue os redirecionamentos automaticamente (padrão)
- `'error'`: Trata redirecionamentos como erros
- `'manual'`: Não segue os redirecionamentos automaticamente, retorna a resposta de redirecionamento

TIP: Use `redirect: 'manual'` quando você precisar tratar redirecionamentos com lógica personalizada.

#### Tratamento de credenciais {#credentials-handling}

A opção `credentials` controla se cookies, headers de autorização e outras credenciais são enviados com requisições cross-origin. Isso é particularmente importante para cenários de autenticação.

```ts
// Inclui credenciais para requisições cross-origin
http
  .get('https://api.example.com/protected-data', {
    credentials: 'include',
  })
  .subscribe((data) => {
    // ...
  });

// Nunca envia credenciais (padrão para cross-origin)
http
  .get('https://api.example.com/public-data', {
    credentials: 'omit',
  })
  .subscribe((data) => {
    // ...
  });

// Envia credenciais apenas para requisições same-origin
http
  .get('/api/user-data', {
    credentials: 'same-origin',
  })
  .subscribe((data) => {
    // ...
  });

// withCredentials sobrescreve a configuração de credentials
http
  .get('https://api.example.com/data', {
    credentials: 'omit', // Isto será ignorado
    withCredentials: true, // Isto força credentials: 'include'
  })
  .subscribe((data) => {
    // A requisição incluirá credenciais apesar de credentials: 'omit'
  });

// Abordagem legada (ainda suportada)
http
  .get('https://api.example.com/data', {
    withCredentials: true,
  })
  .subscribe((data) => {
    // Equivalente a credentials: 'include'
  });
```

IMPORTANT: A opção `withCredentials` tem precedência sobre a opção `credentials`. Se ambas forem especificadas, `withCredentials: true` sempre resultará em `credentials: 'include'`, independentemente do valor explícito de `credentials`.

Valores disponíveis para `credentials`:

- `'omit'`: Nunca envia credenciais
- `'same-origin'`: Envia credenciais apenas para requisições same-origin (padrão)
- `'include'`: Sempre envia credenciais, mesmo para requisições cross-origin

TIP: Use `credentials: 'include'` quando você precisar enviar cookies ou headers de autenticação para um domínio diferente que suporte CORS. Evite misturar as opções `credentials` e `withCredentials` para não causar confusão.

IMPORTANT: Durante o SSR no Node.js, `credentials: 'include'` não encaminha automaticamente os cookies da requisição do navegador recebida. A opção `credentials` também não remove os headers `Cookie` ou `Authorization` que você adicionar explicitamente. [O Undici permite alguns headers que os navegadores proíbem](https://undici.nodejs.org/#forbidden-and-safelisted-header-names), então encaminhe headers de credenciais apenas para origens confiáveis.

#### Referrer

A opção `referrer` permite controlar quais informações de referrer são enviadas com a requisição. Isso é importante para considerações de privacidade e segurança.

```ts
// Envia uma URL de referrer específica
http
  .get('/api/data', {
    referrer: 'https://example.com/page',
  })
  .subscribe((data) => {
    // ...
  });

// Usa a página atual como referrer (comportamento padrão)
http
  .get('/api/analytics', {
    referrer: 'about:client',
  })
  .subscribe((data) => {
    // ...
  });
```

A opção `referrer` aceita:

- Uma string de URL válida: define a URL de referrer específica a ser enviada
- Uma string vazia `''`: não envia informações de referrer
- `'about:client'`: usa o referrer padrão (URL da página atual)

TIP: Use `referrer: ''` para requisições sensíveis em que você não quer vazar a URL da página de origem.

#### Política de referrer {#referrer-policy}

A opção `referrerPolicy` controla quanta informação de referrer, ou seja, a URL da página que faz a requisição, é enviada junto com uma requisição HTTP. Essa configuração afeta tanto a privacidade quanto o analytics, permitindo equilibrar a visibilidade dos dados com considerações de segurança.

```ts
// Não envia nenhuma informação de referrer, independentemente da página atual
http
  .get('/api/data', {
    referrerPolicy: 'no-referrer',
  })
  .subscribe();

// Envia apenas a origem (ex.: https://example.com)
http
  .get('/api/analytics', {
    referrerPolicy: 'origin',
  })
  .subscribe();
```

A opção `referrerPolicy` aceita:

- `'no-referrer'` Nunca envia o header `Referer`.
- `'no-referrer-when-downgrade'` Envia o referrer para requisições same-origin e seguras (HTTPS→HTTPS), mas o omite ao navegar de uma origem segura para uma menos segura (HTTPS→HTTP).
- `'origin'` Envia apenas a origem (scheme, host, port) do referrer, omitindo as informações de path e query.
- `'origin-when-cross-origin'` Envia a URL completa para requisições same-origin, mas apenas a origem para requisições cross-origin.
- `'same-origin'` Envia a URL completa para requisições same-origin e nenhum referrer para requisições cross-origin.
- `'strict-origin'` Envia apenas a origem, e somente se o nível de segurança do protocolo não for rebaixado (ex.: HTTPS→HTTPS). Omite o referrer em caso de rebaixamento.
- `'strict-origin-when-cross-origin'` Comportamento padrão do navegador. Envia a URL completa para requisições same-origin, a origem para requisições cross-origin quando não há rebaixamento, e omite o referrer em caso de rebaixamento.
- `'unsafe-url'` Sempre envia a URL completa (incluindo path e query). Isso pode expor dados sensíveis e deve ser usado com cautela.

TIP: Prefira valores conservadores, como `'no-referrer'`, `'origin'` ou `'strict-origin-when-cross-origin'`, para requisições sensíveis à privacidade.

#### Integridade {#integrity}

A opção `integrity` permite verificar que a resposta não foi adulterada, fornecendo um hash criptográfico do conteúdo esperado. Isso é particularmente útil para carregar scripts ou outros recursos de CDNs.

```ts
// Verifica a integridade da resposta com hash SHA-256
http
  .get('/api/script.js', {
    integrity: 'sha256-ABC123...',
    responseType: 'text',
  })
  .subscribe((script) => {
    // O conteúdo do script é verificado contra o hash
  });
```

IMPORTANT: A opção `integrity` exige uma correspondência exata entre o conteúdo da resposta e o hash fornecido. Se o conteúdo não corresponder, a requisição falhará com um erro de rede.

CRITICAL: Durante o SSR, a implementação de Fetch lê o corpo inteiro da resposta para verificar o `integrity` antes de retornar uma resposta, conforme exigido pelo [Fetch Standard](https://fetch.spec.whatwg.org/#concept-main-fetch). O Angular aplica o [`maxResponseBodySize`](/guide/ssr#configuring-the-response-body-size-limit) somente depois que o Fetch retorna uma resposta, então esse limite não restringe os dados armazenados em buffer durante a verificação de integridade.

TIP: Use integridade de subrecursos ao carregar recursos críticos de fontes externas, para garantir que não foram modificados. Gere os hashes usando ferramentas como o `openssl`.

## `Observable`s HTTP {#http-observables}

Cada método de requisição do `HttpClient` constrói e retorna um `Observable` do tipo de resposta solicitado. Entender como esses `Observable`s funcionam é importante ao usar o `HttpClient`.

O `HttpClient` produz o que o RxJS chama de `Observable`s "frios", o que significa que nenhuma requisição real acontece até que o `Observable` seja inscrito. Somente então a requisição é de fato despachada para o servidor. Inscrever-se no mesmo `Observable` várias vezes acionará múltiplas requisições ao backend. Cada inscrição é independente.

TIP: Você pode pensar nos `Observable`s do `HttpClient` como _blueprints_ para requisições reais ao servidor.

Uma vez inscrito, cancelar a inscrição abortará a requisição em andamento. Isso é muito útil se o `Observable` for inscrito via pipe `async`, pois cancelará automaticamente a requisição se o usuário navegar para longe da página atual. Além disso, se você usar o `Observable` com um combinador do RxJS como `switchMap`, esse cancelamento limpará quaisquer requisições obsoletas.

Quando a resposta retorna, os `Observable`s do `HttpClient` geralmente completam (embora interceptors possam influenciar isso).

Por causa da conclusão automática, geralmente não há risco de vazamento de memória se as inscrições do `HttpClient` não forem limpas. No entanto, como com qualquer operação assíncrona, recomendamos fortemente que você limpe as inscrições quando o component que as usa for destruído, pois o callback de inscrição pode, de outra forma, executar e encontrar erros ao tentar interagir com o component destruído.

TIP: Usar o pipe `async` ou a operação `toSignal` para se inscrever em `Observable`s garante que as inscrições sejam descartadas corretamente.

## Melhores práticas {#best-practices}

Embora o `HttpClient` possa ser injetado e usado diretamente em components, geralmente recomendamos que você crie services reutilizáveis e injetáveis que isolem e encapsulem a lógica de acesso a dados. Por exemplo, este `UserService` encapsula a lógica para solicitar os dados de um usuário pelo seu id:

```ts
@Service()
export class UserService {
  private http = inject(HttpClient);

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`/api/user/${id}`);
  }
}
```

Dentro de um component, você pode combinar `@if` com o pipe `async` para renderizar a UI dos dados somente depois que eles terminarem de carregar:

```angular-ts
import {AsyncPipe} from '@angular/common';
import {Component, input, inject, effect} from '@angular/core';
import {Observable} from 'rxjs';

@Component({
  imports: [AsyncPipe],
  template: `
    @if (user$ | async; as user) {
      <p>Name: {{ user.name }}</p>
      <p>Biography: {{ user.biography }}</p>
    }
  `,
})
export class UserProfile {
  userId = input.required<string>();
  user$!: Observable<User>;

  private userService = inject(UserService);

  constructor() {
    effect(() => {
      this.user$ = this.userService.getUser(this.userId());
    });
  }
}
```
