<!-- ia-translate: true -->
# Testando requisições

Como para qualquer dependência externa, você deve fazer mock do backend HTTP para que seus testes possam simular interação com um servidor remoto. A biblioteca `@angular/common/http/testing` fornece ferramentas para capturar requisições feitas pela aplicação, fazer assertions sobre elas, e fazer mock das respostas para emular o comportamento do seu backend.

A biblioteca de teste é projetada para um padrão no qual a aplicação executa código e faz requisições primeiro. O teste então espera que certas requisições tenham ou não sido feitas, executa assertions contra essas requisições, e finalmente fornece respostas "liberando" (flushing) cada requisição esperada.

No final, os testes podem verificar que a aplicação não fez requisições inesperadas.

## Configuração para teste

Para começar a testar o uso do `HttpClient`, configure o `TestBed` e inclua `provideHttpClient()` e `provideHttpClientTesting()` na configuração do seu teste. Isso configura o `HttpClient` para usar um backend de teste ao invés da rede real. Também fornece o `HttpTestingController`, que você usará para interagir com o backend de teste, definir expectativas sobre quais requisições foram feitas, e liberar respostas para essas requisições. O `HttpTestingController` pode ser injetado do `TestBed` uma vez configurado.

IMPORTANT: Lembre-se de fornecer `provideHttpClient()` **antes** de `provideHttpClientTesting()`, pois `provideHttpClientTesting()` sobrescreverá partes de `provideHttpClient()`. Fazer o contrário pode potencialmente quebrar seus testes.

```ts
TestBed.configureTestingModule({
  providers: [
    // ... other test providers
    provideHttpClient(),
    provideHttpClientTesting(),
  ],
});

const httpTesting = TestBed.inject(HttpTestingController);
```

Agora quando seus testes fazem requisições, elas atingirão o backend de teste ao invés do normal. Você pode usar `httpTesting` para fazer assertions sobre essas requisições.

## Esperando e respondendo requisições

Por exemplo, você pode escrever um teste que espera que uma requisição GET ocorra e forneça uma resposta mock:

```ts
TestBed.configureTestingModule({
  providers: [
    ConfigService,
    provideHttpClient(),
    provideHttpClientTesting(),
  ],
});

const httpTesting = TestBed.inject(HttpTestingController);

// Load `ConfigService` and request the current configuration.
const service = TestBed.inject(ConfigService);
const config$ = service.getConfig<Config>();

// `firstValueFrom` subscribes to the `Observable`, which makes the HTTP request,
// and creates a `Promise` of the response.
const configPromise = firstValueFrom(config$);

// At this point, the request is pending, and we can assert it was made
// via the `HttpTestingController`:
const req = httpTesting.expectOne('/api/config', 'Request to load the configuration');

// We can assert various properties of the request if desired.
expect(req.request.method).toBe('GET');

// Flushing the request causes it to complete, delivering the result.
req.flush(DEFAULT_CONFIG);

// We can then assert that the response was successfully delivered by the `ConfigService`:
expect(await configPromise).toEqual(DEFAULT_CONFIG);

// Finally, we can assert that no other requests were made.
httpTesting.verify();
```

NOTE: `expectOne` falhará se o teste tiver feito mais de uma requisição que corresponde aos critérios fornecidos.

Como alternativa para fazer assertion em `req.method`, você pode usar uma forma expandida de `expectOne` para também corresponder ao método da requisição:

```ts
const req = httpTesting.expectOne({
  method: 'GET',
  url: '/api/config',
}, 'Request to load the configuration');
```

HELPFUL: As APIs de expectativa correspondem à URL completa das requisições, incluindo quaisquer parâmetros de query.

O último passo, verificar que nenhuma requisição permanece pendente, é comum o suficiente para você movê-lo para um passo `afterEach()`:

```ts
afterEach(() => {
  // Verify that none of the tests make any extra HTTP requests.
  TestBed.inject(HttpTestingController).verify();
});
```

## Lidando com mais de uma requisição por vez

Se você precisa responder a requisições duplicadas em seu teste, use a API `match()` ao invés de `expectOne()`. Ela aceita os mesmos argumentos mas retorna um array de requisições correspondentes. Uma vez retornadas, essas requisições são removidas das correspondências futuras e você é responsável por liberar e verificá-las.

```ts
const allGetRequests = httpTesting.match({method: 'GET'});
for (const req of allGetRequests) {
  // Handle responding to each request.
}
```

## Correspondência avançada

Todas as funções de correspondência aceitam uma função predicado para lógica de correspondência customizada:

```ts
// Look for one request that has a request body.
const requestsWithBody = httpTesting.expectOne(req => req.body !== null);
```

A função `expectNone` faz assertion de que nenhuma requisição corresponde aos critérios fornecidos.

```ts
// Assert that no mutation requests have been issued.
httpTesting.expectNone(req => req.method !== 'GET');
```

## Testando tratamento de erros

Você deve testar as respostas da sua aplicação quando requisições HTTP falham.

### Erros de backend

Para testar o tratamento de erros de backend (quando o servidor retorna um código de status sem sucesso), libere requisições com uma resposta de erro que emula o que seu backend retornaria quando uma requisição falha.

```ts
const req = httpTesting.expectOne('/api/config');
req.flush('Failed!', {status: 500, statusText: 'Internal Server Error'});

// Assert that the application successfully handled the backend error.
```

### Erros de rede

Requisições também podem falhar devido a erros de rede, que aparecem como erros `ProgressEvent`. Estes podem ser entregues com o método `error()`:

```ts
const req = httpTesting.expectOne('/api/config');
req.error(new ProgressEvent('network error!'));

// Assert that the application successfully handled the network error.
```

## Testando um Interceptor

Você deve testar que seus interceptors funcionam nas circunstâncias desejadas.

Por exemplo, uma aplicação pode ser obrigada a adicionar um token de autenticação gerado por um service a cada requisição de saída.
Este comportamento pode ser imposto com o uso de um interceptor:

```ts
export function authInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);

  const clonedRequest = request.clone({
    headers: request.headers.append('X-Authentication-Token', authService.getAuthToken()),
  });
  return next(clonedRequest);
}
```

A configuração do `TestBed` para este interceptor deve depender do recurso `withInterceptors`.

```ts
TestBed.configureTestingModule({
  providers: [
    AuthService,
    // Testing one interceptor at a time is recommended.
    provideHttpClient(withInterceptors([authInterceptor])),
    provideHttpClientTesting(),
  ],
});
```

O `HttpTestingController` pode recuperar a instância de requisição que pode então ser inspecionada para garantir que a requisição foi modificada.

```ts
const service = TestBed.inject(AuthService);
const req = httpTesting.expectOne('/api/config');

expect(req.request.headers.get('X-Authentication-Token')).toEqual(service.getAuthToken());
```

Um interceptor similar poderia ser implementado com interceptors baseados em classe:

```ts
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const clonedRequest = request.clone({
      headers: request.headers.append('X-Authentication-Token', this.authService.getAuthToken()),
    });
    return next.handle(clonedRequest);
  }
}
```

Para testá-lo, a configuração do `TestBed` deve ser ao invés:

```ts
TestBed.configureTestingModule({
  providers: [
    AuthService,
    provideHttpClient(withInterceptorsFromDi()),
    provideHttpClientTesting(),
    // We rely on the HTTP_INTERCEPTORS token to register the AuthInterceptor as an HttpInterceptor
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
});
```
