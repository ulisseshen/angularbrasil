<!-- ia-translate: true -->
# Busca de dados reativa com `httpResource`

IMPORTANT: `httpResource` é [experimental](reference/releases#experimental). Está pronto para você experimentar, mas pode mudar antes de ser estável.

`httpResource` é um wrapper reativo em torno do `HttpClient` que fornece o status da requisição e a resposta como signals. Você pode, assim, usar esses signals com `computed`, `effect`, `linkedSignal`, ou qualquer outra API reativa. Por ser construído em cima do `HttpClient`, `httpResource` suporta todos os mesmos recursos, como interceptors.

Para mais sobre o padrão `resource` do Angular, veja [Reatividade assíncrona com `resource`](/guide/signals/resource).

## `Usando httpResource`

TIP: Certifique-se de incluir `provideHttpClient` nos providers da sua aplicação. Veja [Configurando HttpClient](/guide/http/setup) para detalhes.

Você pode definir um HTTP resource retornando uma url:

```ts
userId = input.required<string>();

user = httpResource(() => `/api/user/${userId()}`); // A reactive function as argument
```

`httpResource` é reativo, significando que sempre que um dos signals dos quais depende muda (como `userId`), o resource emitirá uma nova requisição http.
Se uma requisição já estiver pendente, o resource cancela a requisição pendente antes de emitir uma nova.

HELPFUL: `httpResource` difere do `HttpClient` pois inicia a requisição _ansiosamente_. Em contraste, o `HttpClient` inicia requisições apenas mediante inscrição no `Observable` retornado.

Para requisições mais avançadas, você pode definir um objeto de requisição similar à requisição aceita pelo `HttpClient`.
Cada propriedade do objeto de requisição que deve ser reativa deve ser composta por um signal.

```ts
user = httpResource(() => ({
  url: `/api/user/${userId()}`,
  method: 'GET',
  headers: {
    'X-Special': 'true',
  },
  params: {
    'fast': 'yes',
  },
  reportProgress: true,
  transferCache: true,
  keepalive: true,
  mode: 'cors',
  redirect: 'error',
  priority: 'high',
  cache : 'force-cache',
  credentials: 'include',
  referrer: 'no-referrer',
  integrity: 'sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GhEXAMPLEKEY=',
  referrerPolicy: 'no-referrer'
}));
```

TIP: Evite usar `httpResource` para _mutações_ como `POST` ou `PUT`. Em vez disso, prefira usar diretamente as APIs do `HttpClient` subjacente.

Os signals do `httpResource` podem ser usados no template para controlar quais elementos devem ser exibidos.

```angular-html
@if(user.hasValue()) {
  <user-details [user]="user.value()">
} @else if (user.error()) {
  <div>Could not load user information</div>
} @else if (user.isLoading()) {
  <div>Loading user info...</div>
}
```

HELPFUL: Ler o signal `value` em um `resource` que está em estado de erro lança em tempo de execução. É recomendado proteger leituras de `value` com `hasValue()`.

### Tipos de resposta

Por padrão, `httpResource` retorna e analisa a resposta como JSON. No entanto, você pode especificar retorno alternativo com funções adicionais em `httpResource`:

```ts
httpResource.text(() => ({ … })); // returns a string in value()

httpResource.blob(() => ({ … })); // returns a Blob object in value()

httpResource.arrayBuffer(() => ({ … })); // returns an ArrayBuffer in value()
```

## Análise e validação de resposta

Ao buscar dados, você pode querer validar respostas contra um schema predefinido, frequentemente usando bibliotecas populares de código aberto como [Zod](https://zod.dev) ou [Valibot](https://valibot.dev). Você pode integrar bibliotecas de validação como esta com `httpResource` especificando uma opção `parse`. O tipo de retorno da função `parse` determina o tipo do `value` do resource.

O exemplo a seguir usa Zod para analisar e validar a resposta da [StarWars API](https://swapi.info/). O resource é então tipado da mesma forma que o tipo de saída da análise do Zod.

```ts
const starWarsPersonSchema = z.object({
  name: z.string(),
  height: z.number({ coerce: true }),
  edited: z.string().datetime(),
  films: z.array(z.string()),
});

export class CharacterViewer {
  id = signal(1);

  swPersonResource = httpResource(
    () => `https://swapi.info/api/people/${this.id()}`,
    { parse: starWarsPersonSchema.parse }
  );
}
```

## Testando um httpResource

Como `httpResource` é um wrapper em torno do `HttpClient`, você pode testar `httpResource` com exatamente as mesmas APIs que `HttpClient`. Veja [HttpClient Testing](/guide/http/testing) para detalhes.

O exemplo a seguir mostra um teste unitário para código usando `httpResource`.

```ts
TestBed.configureTestingModule({
  providers: [
    provideHttpClient(),
    provideHttpClientTesting(),
  ],
});

const id = signal(0);
const mockBackend = TestBed.inject(HttpTestingController);
const response = httpResource(() => `/data/${id()}`, {injector: TestBed.inject(Injector)});
TestBed.tick(); // Triggers the effect
const firstRequest = mockBackend.expectOne('/data/0');
firstRequest.flush(0);

// Ensures the values are propagated to the httpResource
await TestBed.inject(ApplicationRef).whenStable();

expect(response.value()).toEqual(0);
```
