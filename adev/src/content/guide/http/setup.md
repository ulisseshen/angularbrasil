<!-- ia-translate: true -->
# Configurando o `HttpClient`

Antes de usar o `HttpClient` em sua aplicação, você deve configurá-lo usando [dependency injection](guide/di).

## Fornecendo o `HttpClient` através de dependency injection

O `HttpClient` é fornecido usando a função auxiliar `provideHttpClient`, que a maioria das aplicações inclui nos `providers` da aplicação no arquivo `app.config.ts`.

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
  ]
};
```

Se sua aplicação está usando bootstrap baseado em NgModule, você pode incluir `provideHttpClient` nos providers do NgModule da sua aplicação:

```ts
@NgModule({
  providers: [
    provideHttpClient(),
  ],
  // ... other application configuration
})
export class AppModule {}
```

Você pode então injetar o service `HttpClient` como uma dependência de seus components, services ou outras classes:

```ts
@Injectable({providedIn: 'root'})
export class ConfigService {
  private http = inject(HttpClient);
  // This service can now make HTTP requests via `this.http`.
}
```

## Configurando recursos do `HttpClient`

`provideHttpClient` aceita uma lista de configurações de recursos opcionais, para habilitar ou configurar o comportamento de diferentes aspectos do cliente. Esta seção detalha os recursos opcionais e seus usos.

### `withFetch`

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withFetch(),
    ),
  ]
};
```

Por padrão, o `HttpClient` usa a API [`XMLHttpRequest`](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest) para fazer requisições. O recurso `withFetch` altera o cliente para usar a API [`fetch`](https://developer.mozilla.org/docs/Web/API/Fetch_API) ao invés disso.

`fetch` é uma API mais moderna e está disponível em alguns ambientes onde `XMLHttpRequest` não é suportada. No entanto, ela possui algumas limitações, como não produzir eventos de progresso de upload.

### `withInterceptors(...)`

`withInterceptors` configura o conjunto de funções interceptor que processarão as requisições feitas através do `HttpClient`. Consulte o [guia de interceptors](guide/http/interceptors) para mais informações.

### `withInterceptorsFromDi()`

`withInterceptorsFromDi` inclui o estilo antigo de interceptors baseados em classe na configuração do `HttpClient`. Consulte o [guia de interceptors](guide/http/interceptors) para mais informações.

HELPFUL: Interceptors funcionais (através de `withInterceptors`) têm ordenação mais previsível e nós os recomendamos ao invés de interceptors baseados em DI.

### `withRequestsMadeViaParent()`

Por padrão, quando você configura o `HttpClient` usando `provideHttpClient` dentro de um determinado injector, esta configuração substitui qualquer configuração para `HttpClient` que possa estar presente no injector pai.

Quando você adiciona `withRequestsMadeViaParent()`, o `HttpClient` é configurado para passar as requisições para a instância `HttpClient` no injector pai, uma vez que elas tenham passado por quaisquer interceptors configurados neste nível. Isso é útil se você deseja _adicionar_ interceptors em um injector filho, enquanto ainda envia a requisição através dos interceptors do injector pai também.

CRITICAL: Você deve configurar uma instância de `HttpClient` acima do injector atual, ou esta opção não é válida e você receberá um erro de execução quando tentar usá-la.

### `withJsonpSupport()`

Incluir `withJsonpSupport` habilita o método `.jsonp()` no `HttpClient`, que faz uma requisição GET através da [convenção JSONP](https://en.wikipedia.org/wiki/JSONP) para carregamento de dados entre domínios.

HELPFUL: Prefira usar [CORS](https://developer.mozilla.org/docs/Web/HTTP/CORS) para fazer requisições entre domínios ao invés de JSONP quando possível.

### `withXsrfConfiguration(...)`

Incluir esta opção permite a customização da funcionalidade de segurança XSRF integrada do `HttpClient`. Consulte o [guia de segurança](best-practices/security) para mais informações.

### `withNoXsrfProtection()`

Incluir esta opção desabilita a funcionalidade de segurança XSRF integrada do `HttpClient`. Consulte o [guia de segurança](best-practices/security) para mais informações.

## Configuração baseada em `HttpClientModule`

Algumas aplicações podem configurar o `HttpClient` usando a API antiga baseada em NgModules.

Esta tabela lista os NgModules disponíveis em `@angular/common/http` e como eles se relacionam com as funções de configuração de provider acima.

| **NgModule**                            | Equivalente em `provideHttpClient()`          |
| --------------------------------------- | --------------------------------------------- |
| `HttpClientModule`                      | `provideHttpClient(withInterceptorsFromDi())` |
| `HttpClientJsonpModule`                 | `withJsonpSupport()`                          |
| `HttpClientXsrfModule.withOptions(...)` | `withXsrfConfiguration(...)`                  |
| `HttpClientXsrfModule.disable()`        | `withNoXsrfProtection()`                      |

<docs-callout important title="Use com cuidado ao usar HttpClientModule em múltiplos injectors">
Quando `HttpClientModule` está presente em múltiplos injectors, o comportamento dos interceptors é mal definido e depende das opções exatas e da ordenação de provider/import.

Prefira `provideHttpClient` para configurações com múltiplos injectors, pois ele tem comportamento mais estável. Veja o recurso `withRequestsMadeViaParent` acima.
</docs-callout>
