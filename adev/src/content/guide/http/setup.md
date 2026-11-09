<!-- ia-translate: true -->

# Configurando o `HttpClient`

O `HttpClient` está disponível para injeção por padrão no Angular v21 e versões posteriores.

## Fornecendo o `HttpClient` através de dependency injection {#providing-httpclient-through-dependency-injection}

Você pode usar a função auxiliar `provideHttpClient` para configurar o conjunto de funcionalidades HTTP padrão ou adicionar recursos aos `providers` da aplicação em `app.config.ts`.

```ts
export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(/* adicione recursos aqui, como withInterceptors(...) */)],
};
```

Se sua aplicação usar bootstrap baseado em NgModule, você pode incluir `provideHttpClient` nos providers do NgModule da aplicação para configurar o conjunto de funcionalidades HTTP padrão ou adicionar recursos:

```ts
@NgModule({
  providers: [provideHttpClient(/* adicione recursos aqui, como withInterceptors(...) */)],
  // ... outras configurações da aplicação
})
export class AppModule {}
```

Você pode então injetar o service `HttpClient` como uma dependência de seus components, services ou outras classes:

```ts
@Service()
export class ConfigService {
  private http = inject(HttpClient);
  // Este service agora pode fazer requisições HTTP via `this.http`.
}
```

## Configurando recursos do `HttpClient` {#configuring-features-of-httpclient}

`provideHttpClient` aceita uma lista de configurações de recursos opcionais para habilitar ou configurar diferentes aspectos do cliente. Esta seção detalha os recursos opcionais e seus usos.

### `withXhr`

```ts
export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withXhr())],
};
```

Por padrão, o `HttpClient` usa a API [`fetch`](https://developer.mozilla.org/docs/Web/API/Fetch_API) para fazer requisições. O recurso `withXhr` altera o cliente para usar a API [`XMLHttpRequest`](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest) no lugar.

A API `fetch` é mais moderna e está disponível em alguns ambientes onde `XMLHttpRequest` não é suportada. Ela tem algumas limitações, como não produzir eventos de progresso de upload.

<docs-callout critical title="Não use `withXhr` em ambientes de renderização do lado do servidor (SSR)">

O suporte a XHR no servidor está **obsoleto** e deve ser removido no Angular 23. A biblioteca `xhr2` subjacente não trata redirecionamentos de forma segura: ela pode encaminhar headers `Authorization` em redirecionamentos cross-origin e está sujeita a ataques de negação de serviço (DoS) por meio de loops de redirecionamento. Para aplicações SSR, use o backend `fetch` padrão.

</docs-callout>

### `withInterceptors(...)`

`withInterceptors` configura o conjunto de funções interceptor que processarão as requisições feitas através do `HttpClient`. Consulte o [guia de interceptors](guide/http/interceptors) para mais informações.

### `withInterceptorsFromDi()`

`withInterceptorsFromDi` inclui o estilo antigo de interceptors baseados em classe na configuração do `HttpClient`. Consulte o [guia de interceptors](guide/http/interceptors) para mais informações.

HELPFUL: Interceptors funcionais (através de `withInterceptors`) têm ordenação mais previsível, e recomendamos usá-los no lugar dos interceptors baseados em DI.

### `withRequestsMadeViaParent()`

Por padrão, quando você configura o `HttpClient` usando `provideHttpClient` dentro de um determinado injector, essa configuração substitui qualquer configuração do `HttpClient` que possa existir no injector pai.

Quando você adiciona `withRequestsMadeViaParent()`, o `HttpClient` passa as requisições para a instância do `HttpClient` no injector pai, depois que elas tiverem passado pelos interceptors configurados neste nível. Isso é útil se você quiser _adicionar_ interceptors em um injector filho, mas ainda enviar a requisição pelos interceptors do injector pai.

CRITICAL: Você deve configurar uma instância de `HttpClient` acima do injector atual; caso contrário, esta opção não é válida e você receberá um erro de execução ao tentar usá-la.

### `withJsonpSupport()`

<docs-callout critical title="JSONP está obsoleto">

`withJsonpSupport`, `HttpClientJsonpModule` e o método `.jsonp()` do `HttpClient` estão obsoletos, pois JSONP pode causar vulnerabilidades de cross-site scripting (XSS). Use requisições HTTP padrão com [CORS](https://developer.mozilla.org/docs/Web/HTTP/CORS) no lugar.

</docs-callout>

Incluir `withJsonpSupport` habilita o método `.jsonp()` no `HttpClient`, que faz uma requisição GET através da [convenção JSONP](https://en.wikipedia.org/wiki/JSONP) para o carregamento de dados entre domínios.

HELPFUL: Prefira usar [CORS](https://developer.mozilla.org/docs/Web/HTTP/CORS) para fazer requisições entre domínios em vez de JSONP, quando possível.

### `withXsrfConfiguration(...)`

Incluir esta opção permite personalizar a funcionalidade de segurança XSRF integrada do `HttpClient`. Consulte o [guia de segurança](best-practices/security) para mais informações.

### `withNoXsrfProtection()`

Incluir esta opção desabilita a funcionalidade de segurança XSRF integrada do `HttpClient`. Consulte o [guia de segurança](best-practices/security) para mais informações.

## Configuração baseada em `HttpClientModule` {#httpclientmodule-based-configuration}

Algumas aplicações podem configurar o `HttpClient` usando a API antiga baseada em NgModules.

Esta tabela lista os NgModules disponíveis em `@angular/common/http` e como eles se relacionam com as funções de configuração de provider acima.

| **NgModule**                            | Equivalente em `provideHttpClient()`                     |
| --------------------------------------- | -------------------------------------------------------- |
| `HttpClientModule`                      | `provideHttpClient(withInterceptorsFromDi(), withXhr())` |
| `HttpClientJsonpModule` (obsoleto)      | `withJsonpSupport()` (obsoleto)                          |
| `HttpClientXsrfModule.withOptions(...)` | `withXsrfConfiguration(...)`                             |
| `HttpClientXsrfModule.disable()`        | `withNoXsrfProtection()`                                 |

NOTE: `HttpClientModule` e `HttpClientXsrfModule` também estão obsoletos. Use `provideHttpClient` com os recursos correspondentes.

<docs-callout important title="Use com cuidado ao usar HttpClientModule em múltiplos injectors">
Quando o `HttpClientModule` está presente em múltiplos injectors, o comportamento dos interceptors não é bem definido e depende das opções exatas e da ordem de providers/imports.

Prefira `provideHttpClient` para configurações com múltiplos injectors, pois ele tem um comportamento mais estável. Veja o recurso `withRequestsMadeViaParent` acima.
</docs-callout>
