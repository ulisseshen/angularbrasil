<!-- ia-translate: true -->
# Interceptors

`HttpClient` suporta uma forma de middleware conhecida como _interceptors_.

TLDR: Interceptors são middleware que permitem que padrões comuns relacionados a novas tentativas, caching, logging e autenticação sejam abstraídos das requisições individuais.

`HttpClient` suporta dois tipos de interceptors: funcionais e baseados em DI. Nossa recomendação é usar interceptors funcionais porque eles têm comportamento mais previsível, especialmente em configurações complexas. Nossos exemplos neste guia usam interceptors funcionais, e cobrimos [interceptors baseados em DI](#di-based-interceptors) em sua própria seção no final.

## Interceptors

Interceptors são geralmente funções que você pode executar para cada requisição, e têm amplas capacidades para afetar o conteúdo e o fluxo geral de requisições e respostas. Você pode instalar múltiplos interceptors, que formam uma cadeia de interceptors onde cada interceptor processa a requisição ou resposta antes de encaminhá-la para o próximo interceptor na cadeia.

Você pode usar interceptors para implementar uma variedade de padrões comuns, como:

- Adicionar headers de autenticação a requisições de saída para uma API específica.
- Tentar novamente requisições que falharam com backoff exponencial.
- Fazer cache de respostas por um período de tempo, ou até que sejam invalidadas por mutações.
- Personalizar o parsing de respostas.
- Medir tempos de resposta do servidor e registrá-los.
- Controlar elementos de UI como um spinner de carregamento enquanto operações de rede estão em andamento.
- Coletar e agrupar requisições feitas dentro de um determinado período de tempo.
- Falhar automaticamente requisições após um prazo ou timeout configurável.
- Consultar regularmente o servidor e atualizar resultados.

## Definindo um interceptor

A forma básica de um interceptor é uma função que recebe a `HttpRequest` de saída e uma função `next` representando o próximo passo de processamento na cadeia de interceptors.

Por exemplo, este `loggingInterceptor` irá registrar a URL da requisição de saída no `console.log` antes de encaminhar a requisição:

```ts
export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  console.log(req.url);
  return next(req);
}
```

Para que este interceptor realmente intercepte requisições, você deve configurar o `HttpClient` para usá-lo.

## Configurando interceptors

Você declara o conjunto de interceptors a serem usados ao configurar o `HttpClient` através de dependency injection, usando a feature `withInterceptors`:

```ts
bootstrapApplication(AppComponent, {providers: [
  provideHttpClient(
    withInterceptors([loggingInterceptor, cachingInterceptor]),
  )
]});
```

Os interceptors que você configura são encadeados na ordem em que você os listou nos providers. No exemplo acima, o `loggingInterceptor` processaria a requisição e então a encaminharia para o `cachingInterceptor`.

### Interceptando eventos de resposta

Um interceptor pode transformar o stream `Observable` de `HttpEvent`s retornado por `next` para acessar ou manipular a resposta. Como este stream inclui todos os eventos de resposta, inspecionar o `.type` de cada evento pode ser necessário para identificar o objeto de resposta final.

```ts
export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  return next(req).pipe(tap(event => {
    if (event.type === HttpEventType.Response) {
      console.log(req.url, 'returned a response with status', event.status);
    }
  }));
}
```

DICA: Interceptors naturalmente associam respostas com suas requisições de saída, porque eles transformam o stream de resposta em um closure que captura o objeto da requisição.

## Modificando requisições

A maioria dos aspectos das instâncias de `HttpRequest` e `HttpResponse` são _imutáveis_, e interceptors não podem modificá-los diretamente. Em vez disso, interceptors aplicam mutações clonando esses objetos usando a operação `.clone()`, e especificando quais propriedades devem ser mutadas na nova instância. Isso pode envolver realizar atualizações imutáveis no próprio valor (como `HttpHeaders` ou `HttpParams`).

Por exemplo, para adicionar um header a uma requisição:

```ts
const reqWithHeader = req.clone({
  headers: req.headers.set('X-New-Header', 'new header value'),
});
```

Esta imutabilidade permite que a maioria dos interceptors sejam idempotentes se a mesma `HttpRequest` for submetida à cadeia de interceptors múltiplas vezes. Isso pode acontecer por algumas razões, incluindo quando uma requisição é tentada novamente após falha.

CRÍTICO: O body de uma requisição ou resposta **não** está protegido contra mutações profundas. Se um interceptor deve mutar o body, tenha cuidado ao lidar com execução múltipla na mesma requisição.

## Dependency injection em interceptors

Interceptors são executados no _contexto de injeção_ do injector que os registrou, e podem usar a API `inject` do Angular para recuperar dependências.

Por exemplo, suponha que uma aplicação tenha um service chamado `AuthService`, que cria tokens de autenticação para requisições de saída. Um interceptor pode injetar e usar este service:

```ts
export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  // Inject the current `AuthService` and use it to get an authentication token:
  const authToken = inject(AuthService).getAuthToken();

  // Clone the request to add the authentication header.
  const newReq = req.clone({
    headers: req.headers.append('X-Authentication-Token', authToken),
  });
  return next(newReq);
}
```

## Metadados de requisição e resposta

Frequentemente é útil incluir informações em uma requisição que não são enviadas para o backend, mas são especificamente destinadas a interceptors. `HttpRequest`s têm um objeto `.context` que armazena esse tipo de metadado como uma instância de `HttpContext`. Este objeto funciona como um mapa tipado, com chaves do tipo `HttpContextToken`.

Para ilustrar como este sistema funciona, vamos usar metadados para controlar se um interceptor de caching está habilitado para uma determinada requisição.

### Definindo tokens de contexto

Para armazenar se o interceptor de caching deve fazer cache de uma requisição específica no mapa `.context` dessa requisição, defina um novo `HttpContextToken` para atuar como uma chave:

```ts
export const CACHING_ENABLED = new HttpContextToken<boolean>(() => true);
```

A função fornecida cria o valor padrão para o token para requisições que não definiram explicitamente um valor para ele. Usar uma função garante que se o valor do token for um objeto ou array, cada requisição obtenha sua própria instância.

### Lendo o token em um interceptor

Um interceptor pode então ler o token e escolher aplicar lógica de caching ou não com base em seu valor:

```ts
export function cachingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  if (req.context.get(CACHING_ENABLED)) {
    // apply caching logic
    return ...;
  } else {
    // caching has been disabled for this request
    return next(req);
  }
}
```

### Definindo tokens de contexto ao fazer uma requisição

Ao fazer uma requisição via API `HttpClient`, você pode fornecer valores para `HttpContextToken`s:

```ts
const data$ = http.get('/sensitive/data', {
  context: new HttpContext().set(CACHING_ENABLED, false),
});
```

Interceptors podem ler esses valores do `HttpContext` da requisição.

### O contexto da requisição é mutável

Diferentemente de outras propriedades de `HttpRequest`s, o `HttpContext` associado é _mutável_. Se um interceptor mudar o contexto de uma requisição que é tentada novamente mais tarde, o mesmo interceptor observará a mutação do contexto quando executar novamente. Isso é útil para passar estado através de múltiplas tentativas se necessário.

## Respostas sintéticas

A maioria dos interceptors simplesmente invocará o handler `next` enquanto transforma a requisição ou a resposta, mas isso não é estritamente um requisito. Esta seção discute várias das maneiras pelas quais um interceptor pode incorporar comportamento mais avançado.

Interceptors não são obrigados a invocar `next`. Eles podem em vez disso escolher construir respostas através de algum outro mecanismo, como de um cache ou enviando a requisição através de um mecanismo alternativo.

Construir uma resposta é possível usando o construtor `HttpResponse`:

```ts
const resp = new HttpResponse({
  body: 'response body',
});
```

## Trabalhando com informações de redirecionamento

Ao usar `HttpClient` com o provider `withFetch`, as respostas incluem uma propriedade `redirected` que indica se a resposta foi o resultado de um redirecionamento. Esta propriedade se alinha com a especificação da API Fetch nativa e pode ser útil em interceptors para lidar com cenários de redirecionamento.

Um interceptor pode acessar e agir sobre as informações de redirecionamento:

```ts
export function redirectTrackingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  return next(req).pipe(tap(event => {
    if (event.type === HttpEventType.Response && event.redirected) {
      console.log('Request to', req.url, 'was redirected to', event.url);
      // Handle redirect logic - maybe update analytics, security checks, etc.
    }
  }));
}
```

Você também pode usar as informações de redirecionamento para implementar lógica condicional em seus interceptors:

```ts
export function authRedirectInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  return next(req).pipe(tap(event => {
    if (event.type === HttpEventType.Response && event.redirected) {
      // Check if we were redirected to a login page
      if (event.url?.includes('/login')) {
        // Handle authentication redirect
        handleAuthRedirect();
      }
    }
  }));
}
```

## Trabalhando com tipos de resposta

Ao usar `HttpClient` com o provider `withFetch`, as respostas incluem uma propriedade `type` que indica como o browser lidou com a resposta com base em políticas CORS e modo de requisição. Esta propriedade se alinha com a especificação da API Fetch nativa e fornece insights valiosos para debugar problemas de CORS e entender a acessibilidade da resposta.

A propriedade `type` da resposta pode ter os seguintes valores:

- `'basic'` - Resposta de mesma origem com todos os headers acessíveis
- `'cors'` - Resposta de origem cruzada com headers CORS configurados adequadamente
- `'opaque'` - Resposta de origem cruzada sem CORS, headers e body podem ser limitados
- `'opaqueredirect'` - Resposta de uma requisição redirecionada em modo no-cors
- `'error'` - Ocorreu um erro de rede

Um interceptor pode usar informações de tipo de resposta para debugging de CORS e tratamento de erros:

```ts
export function responseTypeInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  return next(req).pipe(map(event => {
    if (event.type === HttpEventType.Response) {
      // Handle different response types appropriately
      switch (event.responseType) {
        case 'opaque':
          // Limited access to response data
          console.warn('Limited response data due to CORS policy');
          break;
        case 'cors':
        case 'basic':
          // Full access to response data
          break;
        case 'error':
          // Handle network errors
          console.error('Network error in response');
          break;
      }
    }
  }));
}
```

## Interceptors baseados em DI

`HttpClient` também suporta interceptors que são definidos como classes injetáveis e configurados através do sistema de DI. As capacidades de interceptors baseados em DI são idênticas às de interceptors funcionais, mas o mecanismo de configuração é diferente.

Um interceptor baseado em DI é uma classe injetável que implementa a interface `HttpInterceptor`:

```ts
@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Request URL: ' + req.url);
    return handler.handle(req);
  }
}
```

Interceptors baseados em DI são configurados através de um multi-provider de dependency injection:

```ts
bootstrapApplication(AppComponent, {providers: [
  provideHttpClient(
    // DI-based interceptors must be explicitly enabled.
    withInterceptorsFromDi(),
  ),

  {provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true},
]});
```

Interceptors baseados em DI executam na ordem em que seus providers são registrados. Em uma aplicação com uma configuração de DI extensa e hierárquica, esta ordem pode ser muito difícil de prever.
