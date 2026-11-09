<!-- ia-translate: true -->

# Requisições de teste

Como para qualquer dependência externa, você deve fazer mock do backend HTTP para que seus testes possam simular a interação com um servidor remoto. A biblioteca `@angular/common/http/testing` fornece ferramentas para capturar as requisições feitas pela aplicação, fazer assertions sobre elas e fazer mock das respostas para emular o comportamento do seu backend.

A biblioteca de teste é projetada para um padrão no qual a aplicação executa código e faz requisições primeiro. O teste então espera que certas requisições tenham ou não sido feitas, executa assertions contra essas requisições e, por fim, fornece respostas "liberando" (flushing) cada requisição esperada.

Por último, os testes podem verificar que a aplicação não fez requisições inesperadas.

## Configuração para teste {#setup-for-testing}

Para começar a testar o uso do `HttpClient`, configure o `TestBed` e inclua `provideHttpClientTesting()` na configuração do seu teste. O `HttpClient` é fornecido pelo ambiente de testes do Angular, e `provideHttpClientTesting()` o configura para usar um backend de teste em vez da rede real. Ele também fornece o `HttpTestingController`, que você usará para interagir com o backend de teste, definir expectativas sobre quais requisições foram feitas e liberar respostas para essas requisições. O `HttpTestingController` pode ser injetado a partir do `TestBed` depois de configurado.

```ts
TestBed.configureTestingModule({
  providers: [
    // ... outros providers de teste
    provideHttpClientTesting(),
  ],
});

const httpTesting = TestBed.inject(HttpTestingController);
```

Agora, quando seus testes fizerem requisições, elas atingirão o backend de teste em vez do normal. Você pode usar `httpTesting` para fazer assertions sobre essas requisições.

### Configurando o `HttpClient` em testes {#configuring-httpclient-in-tests}

Se um teste precisar configurar recursos do `HttpClient`, como interceptors, inclua `provideHttpClient(...)` antes de `provideHttpClientTesting()`.
IMPORTANT: Lembre-se de fornecer `provideHttpClient()` **antes** de `provideHttpClientTesting()`, pois `provideHttpClientTesting()` sobrescreve partes de `provideHttpClient()`. Fazer o contrário pode quebrar seus testes.

```ts
TestBed.configureTestingModule({
  providers: [provideHttpClient(withInterceptors([authInterceptor])), provideHttpClientTesting()],
});
```

## Esperando e respondendo requisições {#expecting-and-answering-requests}

Por exemplo, você pode escrever um teste que espera que uma requisição GET ocorra e fornece uma resposta mock:

```ts
TestBed.configureTestingModule({
  providers: [ConfigService, provideHttpClientTesting()],
});

const httpTesting = TestBed.inject(HttpTestingController);

// Carrega o `ConfigService` e solicita a configuração atual.
const service = TestBed.inject(ConfigService);
const config$ = service.getConfig<Config>();

// `firstValueFrom` se inscreve no `Observable`, o que faz a requisição HTTP,
// e cria uma `Promise` da resposta.
const configPromise = firstValueFrom(config$);

// Neste ponto, a requisição está pendente, e podemos verificar que ela foi feita
// através do `HttpTestingController`:
const req = httpTesting.expectOne('/api/config', 'Request to load the configuration');

// Podemos verificar várias propriedades da requisição, se desejado.
expect(req.request.method).toBe('GET');

// Liberar a requisição faz com que ela seja concluída, entregando o resultado.
req.flush(DEFAULT_CONFIG);

// Podemos então verificar que a resposta foi entregue com sucesso pelo `ConfigService`:
expect(await configPromise).toEqual(DEFAULT_CONFIG);

// Por fim, podemos verificar que nenhuma outra requisição foi feita.
httpTesting.verify();
```

NOTE: `expectOne` falhará se o teste tiver feito mais de uma requisição que corresponda aos critérios fornecidos.

Como alternativa a fazer assertion sobre `req.method`, você pode usar uma forma expandida de `expectOne` para também corresponder ao método da requisição:

```ts
const req = httpTesting.expectOne(
  {
    method: 'GET',
    url: '/api/config',
  },
  'Request to load the configuration',
);
```

HELPFUL: As APIs de expectativa correspondem à URL completa das requisições, incluindo quaisquer parâmetros de query.

A última etapa, verificar que não há requisições pendentes, é comum o suficiente para que você a mova para um passo `afterEach()`:

```ts
afterEach(() => {
  // Verifica que nenhum dos testes faz requisições HTTP extras.
  TestBed.inject(HttpTestingController).verify();
});
```

## Lidando com mais de uma requisição por vez {#handling-more-than-one-request-at-once}

Se você precisar responder a requisições duplicadas em seu teste, use a API `match()` em vez de `expectOne()`. Ela aceita os mesmos argumentos, mas retorna um array de requisições correspondentes. Depois de retornadas, essas requisições são removidas das correspondências futuras, e você é responsável por liberá-las e verificá-las.

```ts
const allGetRequests = httpTesting.match({method: 'GET'});
for (const req of allGetRequests) {
  // Trata a resposta de cada requisição.
}
```

## Correspondência avançada {#advanced-matching}

Todas as funções de correspondência aceitam uma função predicado para lógica de correspondência personalizada:

```ts
// Procura uma requisição que tenha um corpo de requisição.
const requestsWithBody = httpTesting.expectOne((req) => req.body !== null);
```

A função `expectNone` faz assertion de que nenhuma requisição corresponde aos critérios fornecidos.

```ts
// Verifica que nenhuma requisição de mutação foi emitida.
httpTesting.expectNone((req) => req.method !== 'GET');
```

## Testando tratamento de erros {#testing-error-handling}

Você deve testar as respostas da sua aplicação quando requisições HTTP falham.

### Erros de backend {#backend-errors}

Para testar o tratamento de erros de backend (quando o servidor retorna um código de status sem sucesso), libere as requisições com uma resposta de erro que emule o que seu backend retornaria quando uma requisição falha.

```ts
const req = httpTesting.expectOne('/api/config');
req.flush('Failed!', {status: 500, statusText: 'Internal Server Error'});

// Verifica que a aplicação tratou o erro de backend com sucesso.
```

### Erros de rede {#network-errors}

Requisições também podem falhar devido a erros de rede, que aparecem como erros `ProgressEvent`. Eles podem ser entregues com o método `error()`:

```ts
const req = httpTesting.expectOne('/api/config');
req.error(new ProgressEvent('network error!'));

// Verifica que a aplicação tratou o erro de rede com sucesso.
```

## Testando um interceptor {#testing-an-interceptor}

Você deve testar que seus interceptors funcionam nas circunstâncias desejadas.

Por exemplo, uma aplicação pode precisar adicionar um token de autenticação gerado por um service a cada requisição de saída.
Esse comportamento pode ser imposto com o uso de um interceptor:

```ts
export function authInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
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
    // Recomenda-se testar um interceptor por vez.
    provideHttpClient(withInterceptors([authInterceptor])),
    provideHttpClientTesting(),
  ],
});
```

O `HttpTestingController` pode recuperar a instância da requisição, que pode então ser inspecionada para garantir que a requisição foi modificada.

```ts
const service = TestBed.inject(AuthService);
const http = TestBed.inject(HttpClient);

// Faz uma requisição HTTP.
const response = firstValueFrom(http.get('/api/config'));

const req = httpTesting.expectOne('/api/config');

expect(req.request.headers.get('X-Authentication-Token')).toEqual(service.getAuthToken());
```

Um interceptor semelhante poderia ser implementado com interceptors baseados em classe:

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

Para testá-lo, a configuração do `TestBed` deve ser, em vez disso:

```ts
TestBed.configureTestingModule({
  providers: [
    AuthService,
    provideHttpClient(withInterceptorsFromDi()),
    provideHttpClientTesting(),
    // Contamos com o token HTTP_INTERCEPTORS para registrar o AuthInterceptor como um HttpInterceptor
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ],
});
```
