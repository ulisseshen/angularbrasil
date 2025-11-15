<!-- ia-translate: true -->
# Fazendo requisições HTTP

`HttpClient` tem métodos correspondentes aos diferentes verbos HTTP usados para fazer requisições, tanto para carregar dados quanto para aplicar mutações no servidor. Cada método retorna um [RxJS `Observable`](https://rxjs.dev/guide/observable) que, quando inscrito, envia a requisição e então emite os resultados quando o servidor responde.

NOTE: `Observable`s criados por `HttpClient` podem ser inscritos qualquer número de vezes e farão uma nova requisição backend para cada inscrição.

Através de um objeto de opções passado para o método de requisição, várias propriedades da requisição e o tipo de resposta retornado podem ser ajustados.

## Buscando dados JSON

Buscar dados de um backend frequentemente requer fazer uma requisição GET usando o método [`HttpClient.get()`](api/common/http/HttpClient#get). Este método recebe dois argumentos: a string da URL do endpoint do qual buscar, e um _objeto de opções opcional_ para configurar a requisição.

Por exemplo, para buscar dados de configuração de uma API hipotética usando o método `HttpClient.get()`:

```ts
http.get<Config>('/api/config').subscribe(config => {
  // process the configuration.
});
```

Note o argumento de tipo genérico que especifica que os dados retornados pelo servidor serão do tipo `Config`. Este argumento é opcional, e se você omiti-lo então os dados retornados terão o tipo `Object`.

TIP: Ao lidar com dados de estrutura incerta e valores potenciais `undefined` ou `null`, considere usar o tipo `unknown` em vez de `Object` como o tipo de resposta.

CRITICAL: O tipo genérico dos métodos de requisição é uma **asserção** de tipo sobre os dados retornados pelo servidor. `HttpClient` não verifica se os dados de retorno reais correspondem a este tipo.

## Buscando outros tipos de dados

Por padrão, `HttpClient` assume que os servidores retornarão dados JSON. Ao interagir com uma API não-JSON, você pode dizer ao `HttpClient` que tipo de resposta esperar e retornar ao fazer a requisição. Isso é feito com a opção `responseType`.

| **Valor de `responseType`** | **Tipo de resposta retornado**                                                                                                                |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `'json'` (padrão)       | Dados JSON do tipo genérico dado                                                                                                       |
| `'text'`                 | Dados string                                                                                                                               |
| `'arraybuffer'`          | [`ArrayBuffer`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) contendo os bytes brutos da resposta |
| `'blob'`                 | Instância [`Blob`](https://developer.mozilla.org/docs/Web/API/Blob)                                                                        |

Por exemplo, você pode pedir ao `HttpClient` para baixar os bytes brutos de uma imagem `.jpeg` em um `ArrayBuffer`:

```ts
http.get('/images/dog.jpg', {responseType: 'arraybuffer'}).subscribe(buffer => {
  console.log('The image is ' + buffer.byteLength + ' bytes large');
});
```

<docs-callout important title="Valor literal para `responseType`">
Como o valor de `responseType` afeta o tipo retornado por `HttpClient`, ele deve ter um tipo literal e não um tipo `string`.

Isso acontece automaticamente se o objeto de opções passado para o método de requisição for um objeto literal, mas se você estiver extraindo as opções de requisição para uma variável ou método auxiliar, pode precisar especificá-lo explicitamente como um literal, como `responseType: 'text' as const`.
</docs-callout>

## Mutando o estado do servidor

APIs de servidor que realizam mutações frequentemente requerem fazer requisições POST com um corpo de requisição especificando o novo estado ou a mudança a ser feita.

O método [`HttpClient.post()`](api/common/http/HttpClient#post) se comporta de forma semelhante a `get()`, e aceita um argumento `body` adicional antes de suas opções:

```ts
http.post<Config>('/api/config', newConfig).subscribe(config => {
  console.log('Updated config:', config);
});
```

Muitos tipos diferentes de valores podem ser fornecidos como o `body` da requisição, e `HttpClient` os serializará adequadamente:

| **Tipo de `body`**                                                                                                               | **Serializado como**                                    |
| ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| string                                                                                                                        | Texto simples                                           |
| number, boolean, array ou plain object                                                                                       | JSON                                                 |
| [`ArrayBuffer`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)                       | dados brutos do buffer                             |
| [`Blob`](https://developer.mozilla.org/docs/Web/API/Blob)                                                                     | dados brutos com o content type do `Blob`              |
| [`FormData`](https://developer.mozilla.org/docs/Web/API/FormData)                                                             | dados codificados como `multipart/form-data`                   |
| [`HttpParams`](api/common/http/HttpParams) ou [`URLSearchParams`](https://developer.mozilla.org/docs/Web/API/URLSearchParams) | string formatada como `application/x-www-form-urlencoded` |

IMPORTANT: Lembre-se de fazer `.subscribe()` nos `Observable`s de requisição de mutação para realmente disparar a requisição.

## Definindo parâmetros de URL

Especifique parâmetros de requisição que devem ser incluídos na URL da requisição usando a opção `params`.

Passar um objeto literal é a maneira mais simples de configurar parâmetros de URL:

```ts
http.get('/api/config', {
  params: {filter: 'all'},
}).subscribe(config => {
  // ...
});
```

Alternativamente, passe uma instância de `HttpParams` se você precisar de mais controle sobre a construção ou serialização dos parâmetros.

IMPORTANT: Instâncias de `HttpParams` são _imutáveis_ e não podem ser alteradas diretamente. Em vez disso, métodos de mutação como `append()` retornam uma nova instância de `HttpParams` com a mutação aplicada.

```ts
const baseParams = new HttpParams().set('filter', 'all');

http.get('/api/config', {
  params: baseParams.set('details', 'enabled'),
}).subscribe(config => {
  // ...
});
```

Você pode instanciar `HttpParams` com um `HttpParameterCodec` personalizado que determina como `HttpClient` codificará os parâmetros na URL.

### Codificação de parâmetros personalizada

Por padrão, `HttpParams` usa o [`HttpUrlEncodingCodec`](api/common/http/HttpUrlEncodingCodec) embutido para codificar e decodificar chaves e valores de parâmetros.

Você pode fornecer sua própria implementação de [`HttpParameterCodec`](api/common/http/HttpParameterCodec) para personalizar como a codificação e decodificação são aplicadas.

```ts
import { HttpClient, HttpParams, HttpParameterCodec } from '@angular/common/http';
import { inject } from '@angular/core';

export class CustomHttpParamEncoder  implements HttpParameterCodec {
  encodeKey(key: string): string   {
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

    return this.http.get('/api/items', { params });
  }
}
```

## Definindo headers de requisição

Especifique headers de requisição que devem ser incluídos na requisição usando a opção `headers`.

Passar um objeto literal é a maneira mais simples de configurar headers de requisição:

```ts
http.get('/api/config', {
  headers: {
    'X-Debug-Level': 'verbose',
  }
}).subscribe(config => {
  // ...
});
```

Alternativamente, passe uma instância de `HttpHeaders` se você precisar de mais controle sobre a construção de headers

IMPORTANT: Instâncias de `HttpHeaders` são _imutáveis_ e não podem ser alteradas diretamente. Em vez disso, métodos de mutação como `append()` retornam uma nova instância de `HttpHeaders` com a mutação aplicada.

```ts
const baseHeaders = new HttpHeaders().set('X-Debug-Level', 'minimal');

http.get<Config>('/api/config', {
  headers: baseHeaders.set('X-Debug-Level', 'verbose'),
}).subscribe(config => {
  // ...
});
```

## Interagindo com os eventos de resposta do servidor

Por conveniência, `HttpClient` por padrão retorna um `Observable` dos dados retornados pelo servidor (o corpo da resposta). Ocasionalmente é desejável examinar a resposta real, por exemplo para recuperar headers de resposta específicos.

Para acessar a resposta inteira, defina a opção `observe` como `'response'`:

```ts
http.get<Config>('/api/config', {observe: 'response'}).subscribe(res => {
  console.log('Response status:', res.status);
  console.log('Body:', res.body);
});
```

<docs-callout important title="Valor literal para `observe`">
Como o valor de `observe` afeta o tipo retornado por `HttpClient`, ele deve ter um tipo literal e não um tipo `string`.

Isso acontece automaticamente se o objeto de opções passado para o método de requisição for um objeto literal, mas se você estiver extraindo as opções de requisição para uma variável ou método auxiliar, pode precisar especificá-lo explicitamente como um literal, como `observe: 'response' as const`.
</docs-callout>

## Recebendo eventos de progresso brutos

Além do corpo da resposta ou objeto de resposta, `HttpClient` também pode retornar um fluxo de _eventos_ brutos correspondentes a momentos específicos no ciclo de vida da requisição. Esses eventos incluem quando a requisição é enviada, quando o header da resposta é retornado e quando o corpo está completo. Esses eventos também podem incluir _eventos de progresso_ que relatam o status de upload e download para corpos de requisição ou resposta grandes.

Eventos de progresso são desabilitados por padrão (pois têm um custo de desempenho) mas podem ser habilitados com a opção `reportProgress`.

NOTE: A implementação `fetch` opcional de `HttpClient` não relata eventos de progresso de _upload_.

Para observar o fluxo de eventos, defina a opção `observe` como `'events'`:

```ts
http.post('/api/upload', myData, {
  reportProgress: true,
  observe: 'events',
}).subscribe(event => {
  switch (event.type) {
    case HttpEventType.UploadProgress:
      console.log('Uploaded ' + event.loaded + ' out of ' + event.total + ' bytes');
      break;
    case HttpEventType.Response:
      console.log('Finished uploading!');
      break;
  }
});
```

<docs-callout important title="Valor literal para `observe`">
Como o valor de `observe` afeta o tipo retornado por `HttpClient`, ele deve ter um tipo literal e não um tipo `string`.

Isso acontece automaticamente se o objeto de opções passado para o método de requisição for um objeto literal, mas se você estiver extraindo as opções de requisição para uma variável ou método auxiliar, pode precisar especificá-lo explicitamente como um literal, como `observe: 'events' as const`.
</docs-callout>

Cada `HttpEvent` relatado no fluxo de eventos tem um `type` que distingue o que o evento representa:

| **Valor de `type`**                 | **Significado do evento**                                                                  |
| -------------------------------- | ---------------------------------------------------------------------------------- |
| `HttpEventType.Sent`             | A requisição foi despachada para o servidor                                      |
| `HttpEventType.UploadProgress`   | Um `HttpUploadProgressEvent` relatando progresso no upload do corpo da requisição      |
| `HttpEventType.ResponseHeader`   | O cabeçalho da resposta foi recebido, incluindo status e headers           |
| `HttpEventType.DownloadProgress` | Um `HttpDownloadProgressEvent` relatando progresso no download do corpo da resposta |
| `HttpEventType.Response`         | A resposta inteira foi recebida, incluindo o corpo da resposta                 |
| `HttpEventType.User`             | Um evento personalizado de um interceptor HTTP.                                           |

## Lidando com falha de requisição

Existem três maneiras de uma requisição HTTP falhar:

- Um erro de rede ou conexão pode impedir que a requisição alcance o servidor backend.
- Uma requisição não respondeu a tempo quando a opção de timeout foi definida.
- O backend pode receber a requisição mas falhar ao processá-la, e retornar uma resposta de erro.

`HttpClient` captura todos os tipos de erros acima em um `HttpErrorResponse` que ele retorna através do canal de erro do `Observable`. Erros de rede e timeout têm um código de `status` de `0` e um `error` que é uma instância de [`ProgressEvent`](https://developer.mozilla.org/docs/Web/API/ProgressEvent). Erros de backend têm o código de `status` de falha retornado pelo backend, e a resposta de erro como o `error`. Inspecione a resposta para identificar a causa do erro e a ação apropriada para lidar com o erro.

A [biblioteca RxJS](https://rxjs.dev/) oferece vários operadores que podem ser úteis para tratamento de erros.

Você pode usar o operador `catchError` para transformar uma resposta de erro em um valor para a UI. Este valor pode dizer à UI para exibir uma página ou valor de erro, e capturar a causa do erro se necessário.

Às vezes erros transitórios como interrupções de rede podem causar uma falha inesperada na requisição, e simplesmente tentar novamente a requisição permitirá que ela seja bem-sucedida. RxJS fornece vários operadores de _retry_ que automaticamente re-inscrevem em um `Observable` que falhou sob certas condições. Por exemplo, o operador `retry()` tentará automaticamente re-inscrever um número especificado de vezes.

### Timeouts

Para definir um timeout para uma requisição, você pode definir a opção `timeout` para um número de milissegundos junto com outras opções de requisição. Se a requisição backend não for concluída dentro do tempo especificado, a requisição será abortada e um erro será emitido.

NOTE: O timeout só se aplicará à requisição HTTP backend em si. Não é um timeout para toda a cadeia de processamento de requisição. Portanto, esta opção não é afetada por qualquer atraso introduzido por interceptors.

```ts
http.get('/api/config', {
  timeout: 3000,
}).subscribe({
  next: config => {
    console.log('Config fetched successfully:', config);
  },
  error: err => {
    // If the request times out, an error will have been emitted.
  }
});
```

## Opções avançadas de fetch

Ao usar o provider `withFetch()`, o `HttpClient` do Angular fornece acesso a opções avançadas da API fetch que podem melhorar o desempenho e a experiência do usuário. Essas opções estão disponíveis apenas ao usar o backend fetch.

### Opções de Fetch

As seguintes opções fornecem controle refinado sobre o comportamento da requisição ao usar o backend fetch.

#### Conexões keep-alive

A opção `keepalive` permite que uma requisição sobreviva à página que a iniciou. Isso é particularmente útil para requisições de analytics ou logging que precisam ser concluídas mesmo se o usuário navegar para longe da página.

```ts
http.post('/api/analytics', analyticsData, {
  keepalive: true
}).subscribe();
```

#### Controle de cache HTTP

A opção `cache` controla como a requisição interage com o cache HTTP do navegador, o que pode melhorar significativamente o desempenho para requisições repetidas.

```ts
//  Use cached response regardless of freshness
http.get('/api/config', {
  cache: 'force-cache'
}).subscribe(config => {
  // ...
});

// Always fetch from network, bypass cache
http.get('/api/live-data', {
  cache: 'no-cache'
}).subscribe(data => {
  // ...
});

// Use cached response only, fail if not in cache
http.get('/api/static-data', {
  cache: 'only-if-cached'
}).subscribe(data => {
  // ...
});
```

#### Prioridade de requisição para Core Web Vitals

A opção `priority` permite que você indique a importância relativa de uma requisição, ajudando os navegadores a otimizar o carregamento de recursos para melhores pontuações de Core Web Vitals.

```ts
// High priority for critical resources
http.get('/api/user-profile', {
  priority: 'high'
}).subscribe(profile => {
  // ...
});

// Low priority for non-critical resources
http.get('/api/recommendations', {
  priority: 'low'
}).subscribe(recommendations => {
  // ...
});

// Auto priority (default) lets the browser decide
http.get('/api/settings', {
  priority: 'auto'
}).subscribe(settings => {
  // ...
});
```

Valores de `priority` disponíveis:

- `'high'`: Alta prioridade, carregado cedo (ex: dados críticos do usuário, conteúdo above-the-fold)
- `'low'`: Baixa prioridade, carregado quando recursos estão disponíveis (ex: analytics, dados de prefetch)
- `'auto'`: Navegador determina prioridade com base no contexto da requisição (padrão)

TIP: Use `priority: 'high'` para requisições que afetam o Largest Contentful Paint (LCP) e `priority: 'low'` para requisições que não impactam a experiência inicial do usuário.

#### Modo de requisição

A opção `mode` controla como a requisição lida com requisições cross-origin e determina o tipo de resposta.

```ts
// Same-origin requests only
http.get('/api/local-data', {
  mode: 'same-origin'
}).subscribe(data => {
  // ...
});

// CORS-enabled cross-origin requests
http.get('https://api.external.com/data', {
  mode: 'cors'
}).subscribe(data => {
  // ...
});

// No-CORS mode for simple cross-origin requests
http.get('https://external-api.com/public-data', {
  mode: 'no-cors'
}).subscribe(data => {
  // ...
});
```

Valores de `mode` disponíveis:

- `'same-origin'`: Permitir apenas requisições same-origin, falhar para requisições cross-origin
- `'cors'`: Permitir requisições cross-origin com CORS (padrão)
- `'no-cors'`: Permitir requisições cross-origin simples sem CORS, resposta é opaca

TIP: Use `mode: 'same-origin'` para requisições sensíveis que nunca devem ir cross-origin.

#### Tratamento de redirecionamento

A opção `redirect` especifica como lidar com respostas de redirecionamento do servidor.

```ts
// Follow redirects automatically (default behavior)
http.get('/api/resource', {
  redirect: 'follow'
}).subscribe(data => {
  // ...
});

// Prevent automatic redirects
http.get('/api/resource', {
  redirect: 'manual'
}).subscribe(response => {
  // Handle redirect manually
});

// Treat redirects as errors
http.get('/api/resource', {
  redirect: 'error'
}).subscribe({
  next: data => {
    // Success response
  },
  error: err => {
    // Redirect responses will trigger this error handler
  }
});
```

Valores de `redirect` disponíveis:

- `'follow'`: Seguir redirecionamentos automaticamente (padrão)
- `'error'`: Tratar redirecionamentos como erros
- `'manual'`: Não seguir redirecionamentos automaticamente, retornar resposta de redirecionamento

TIP: Use `redirect: 'manual'` quando você precisar lidar com redirecionamentos com lógica personalizada.

#### Tratamento de credenciais

A opção `credentials` controla se cookies, headers de autorização e outras credenciais são enviados com requisições cross-origin. Isso é particularmente importante para cenários de autenticação.

```ts
// Include credentials for cross-origin requests
http.get('https://api.example.com/protected-data', {
  credentials: 'include'
}).subscribe(data => {
  // ...
});

// Never send credentials (default for cross-origin)
http.get('https://api.example.com/public-data', {
  credentials: 'omit'
}).subscribe(data => {
  // ...
});

// Send credentials only for same-origin requests
http.get('/api/user-data', {
  credentials: 'same-origin'
}).subscribe(data => {
  // ...
});

// withCredentials overrides credentials setting
http.get('https://api.example.com/data', {
  credentials: 'omit',        // This will be ignored
  withCredentials: true       // This forces credentials: 'include'
}).subscribe(data => {
  // Request will include credentials despite credentials: 'omit'
});

// Legacy approach (still supported)
http.get('https://api.example.com/data', {
  withCredentials: true
}).subscribe(data => {
  // Equivalent to credentials: 'include'
});
```

IMPORTANT: A opção `withCredentials` tem precedência sobre a opção `credentials`. Se ambas forem especificadas, `withCredentials: true` sempre resultará em `credentials: 'include'`, independentemente do valor explícito de `credentials`.

Valores de `credentials` disponíveis:

- `'omit'`: Nunca enviar credenciais
- `'same-origin'`: Enviar credenciais apenas para requisições same-origin (padrão)
- `'include'`: Sempre enviar credenciais, mesmo para requisições cross-origin

TIP: Use `credentials: 'include'` quando você precisar enviar cookies ou headers de autenticação para um domínio diferente que suporta CORS. Evite misturar opções `credentials` e `withCredentials` para evitar confusão.

#### Referrer

A opção `referrer` permite que você controle quais informações de referrer são enviadas com a requisição. Isso é importante para considerações de privacidade e segurança.

```ts
// Send a specific referrer URL
http.get('/api/data', {
  referrer: 'https://example.com/page'
}).subscribe(data => {
  // ...
});

// Use the current page as referrer (default behavior)
http.get('/api/analytics', {
  referrer: 'about:client'
}).subscribe(data => {
  // ...
});
```

A opção `referrer` aceita:

- Uma string de URL válida: Define a URL de referrer específica a enviar
- Uma string vazia `''`: Não envia informações de referrer
- `'about:client'`: Usa o referrer padrão (URL da página atual)

TIP: Use `referrer: ''` para requisições sensíveis onde você não quer vazar a URL da página referenciadora.

#### Política de referrer

A opção `referrerPolicy` controla quanta informação de referrer, a URL da página fazendo a requisição é enviada junto com uma requisição HTTP. Esta configuração afeta tanto privacidade quanto analytics, permitindo que você equilibre visibilidade de dados com considerações de segurança.

```ts
// Send no referrer information regardless of the current page
http.get('/api/data', {
  referrerPolicy: 'no-referrer'
}).subscribe();

// Send origin only (e.g. https://example.com)
http.get('/api/analytics', {
  referrerPolicy: 'origin'
}).subscribe();
```

A opção `referrerPolicy` aceita:

- `'no-referrer'` Nunca enviar o header `Referer`.
- `'no-referrer-when-downgrade'` Envia o referrer para requisições same-origin e seguras (HTTPS→HTTPS), mas omite ao navegar de uma origem segura para uma menos segura (HTTPS→HTTP).
- `'origin'` Envia apenas a origem (scheme, host, port) do referrer, omitindo informações de path e query.
- `'origin-when-cross-origin'` Envia a URL completa para requisições same-origin, mas apenas a origem para requisições cross-origin.
- `'same-origin'` Envia a URL completa para requisições same-origin e nenhum referrer para requisições cross-origin.
- `'strict-origin'` Envia apenas a origem, e apenas se o nível de segurança do protocolo não for rebaixado (ex: HTTPS→HTTPS). Omite o referrer no rebaixamento.
- `'strict-origin-when-cross-origin'` Comportamento padrão do navegador. Envia a URL completa para requisições same-origin, a origem para requisições cross-origin quando não rebaixado, e omite o referrer no rebaixamento.
- `'unsafe-url'` Sempre envia a URL completa (incluindo path e query). Isso pode expor dados sensíveis e deve ser usado com cautela.

TIP: Prefira valores conservadores como `'no-referrer'`, `'origin'` ou `'strict-origin-when-cross-origin'` para requisições sensíveis à privacidade.

#### Integridade

A opção `integrity` permite que você verifique que a resposta não foi adulterada fornecendo um hash criptográfico do conteúdo esperado. Isso é particularmente útil para carregar scripts ou outros recursos de CDNs.

```ts
// Verify response integrity with SHA-256 hash
http.get('/api/script.js', {
  integrity: 'sha256-ABC123...',
  responseType: 'text'
}).subscribe(script => {
  // Script content is verified against the hash
});
```

IMPORTANT: A opção `integrity` requer uma correspondência exata entre o conteúdo da resposta e o hash fornecido. Se o conteúdo não corresponder, a requisição falhará com um erro de rede.

TIP: Use integridade de subrecurso ao carregar recursos críticos de fontes externas para garantir que não foram modificados. Gere hashes usando ferramentas como `openssl`.

## `Observable`s HTTP

Cada método de requisição em `HttpClient` constrói e retorna um `Observable` do tipo de resposta solicitado. Entender como esses `Observable`s funcionam é importante ao usar `HttpClient`.

`HttpClient` produz o que RxJS chama de `Observable`s "frios", o que significa que nenhuma requisição real acontece até que o `Observable` seja inscrito. Somente então a requisição é realmente despachada para o servidor. Inscrever-se no mesmo `Observable` várias vezes acionará múltiplas requisições backend. Cada inscrição é independente.

TIP: Você pode pensar nos `Observable`s de `HttpClient` como _blueprints_ para requisições de servidor reais.

Uma vez inscrito, cancelar a inscrição abortará a requisição em andamento. Isso é muito útil se o `Observable` for inscrito via pipe `async`, pois automaticamente cancelará a requisição se o usuário navegar para longe da página atual. Além disso, se você usar o `Observable` com um combinador RxJS como `switchMap`, esse cancelamento limpará quaisquer requisições obsoletas.

Uma vez que a resposta retorna, `Observable`s de `HttpClient` geralmente completam (embora interceptors possam influenciar isso).

Por causa da conclusão automática, geralmente não há risco de vazamentos de memória se inscrições de `HttpClient` não forem limpas. No entanto, como com qualquer operação assíncrona, recomendamos fortemente que você limpe inscrições quando o component que as usa for destruído, pois o callback de inscrição pode de outra forma executar e encontrar erros quando tentar interagir com o component destruído.

TIP: Usar o pipe `async` ou a operação `toSignal` para se inscrever em `Observable`s garante que inscrições sejam descartadas adequadamente.

## Melhores práticas

Embora `HttpClient` possa ser injetado e usado diretamente de components, geralmente recomendamos que você crie services reutilizáveis e injetáveis que isolam e encapsulam lógica de acesso a dados. Por exemplo, este `UserService` encapsula a lógica para solicitar dados para um usuário por seu id:

```ts
@Injectable({providedIn: 'root'})
export class UserService {
  private http = inject(HttpClient);

  getUser(id: string): Observable<User> {
    return this.http.get<User>(`/api/user/${id}`);
  }
}
```

Dentro de um component, você pode combinar `@if` com o pipe `async` para renderizar a UI para os dados apenas depois que terminar de carregar:

```angular-ts
import { AsyncPipe } from '@angular/common';

@Component({
  imports: [AsyncPipe],
  template: `
    @if (user$ | async; as user) {
      <p>Name: {{ user.name }}</p>
      <p>Biography: {{ user.biography }}</p>
    }
  `,
})
export class UserProfileComponent {
  userId = input.required<string>();
  user$!: Observable<User>;

  private userService = inject(UserService);

  constructor(): void {
    effect(() => {
      this.user$ = this.userService.getUser(this.userId());
    });
  }
}
```
