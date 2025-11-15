<!-- ia-translate: true -->
# Segurança do `HttpClient`

O `HttpClient` inclui suporte integrado para dois mecanismos comuns de segurança HTTP: proteção XSSI e proteção XSRF/CSRF.

TIP: Considere também adotar uma [Content Security Policy](https://developer.mozilla.org/docs/Web/HTTP/Headers/Content-Security-Policy) para suas APIs.

## Proteção XSSI

Cross-Site Script Inclusion (XSSI) é uma forma de ataque de [Cross-Site Scripting](https://en.wikipedia.org/wiki/Cross-site_scripting) onde um atacante carrega dados JSON dos seus endpoints de API como `<script>`s em uma página que eles controlam. Diferentes técnicas JavaScript podem então ser usadas para acessar esses dados.

Uma técnica comum para prevenir XSSI é servir respostas JSON com um "prefixo não-executável", comumente `)]}',\n`. Este prefixo impede que a resposta JSON seja interpretada como JavaScript executável válido. Quando a API é carregada como dados, o prefixo pode ser removido antes da análise JSON.

O `HttpClient` automaticamente remove este prefixo XSSI (se presente) ao analisar JSON de uma resposta.

## Proteção XSRF/CSRF

[Cross-Site Request Forgery (XSRF ou CSRF)](https://en.wikipedia.org/wiki/Cross-site_request_forgery) é uma técnica de ataque pela qual o atacante pode enganar um usuário autenticado para executar ações sem saber em seu website.

O `HttpClient` suporta um [mecanismo comum](https://en.wikipedia.org/wiki/Cross-site_request_forgery#Cookie-to-header_token) usado para prevenir ataques XSRF. Ao realizar requisições HTTP, um interceptor lê um token de um cookie, por padrão `XSRF-TOKEN`, e o define como um header HTTP, `X-XSRF-TOKEN`. Como apenas código que executa no seu domínio pode ler o cookie, o backend pode ter certeza de que a requisição HTTP veio da sua aplicação cliente e não de um atacante.

Por padrão, um interceptor envia este header em todas as requisições mutantes (como `POST`) para URLs relativas, mas não em requisições GET/HEAD ou em requisições com URL absoluta.

<docs-callout helpful title="Por que não proteger requisições GET?">
Proteção CSRF é necessária apenas para requisições que podem mudar o estado no backend. Por natureza, ataques CSRF cruzam limites de domínio, e a [same-origin policy](https://developer.mozilla.org/docs/Web/Security/Same-origin_policy) da web impedirá que uma página atacante recupere os resultados de requisições GET autenticadas.
</docs-callout>

Para aproveitar isso, seu servidor precisa definir um token em um cookie de sessão legível por JavaScript chamado `XSRF-TOKEN` ou no carregamento da página ou na primeira requisição GET. Em requisições subsequentes, o servidor pode verificar se o cookie corresponde ao header HTTP `X-XSRF-TOKEN`, e portanto ter certeza de que apenas código executando em seu domínio poderia ter enviado a requisição. O token deve ser único para cada usuário e deve ser verificável pelo servidor; isso impede que o cliente crie seus próprios tokens. Defina o token como um digest do cookie de autenticação do seu site com um salt para segurança adicional.

Para prevenir colisões em ambientes onde múltiplas aplicações Angular compartilham o mesmo domínio ou subdomínio, dê a cada aplicação um nome de cookie único.

<docs-callout important title="HttpClient suporta apenas a metade cliente do esquema de proteção XSRF">
  Seu service de backend deve ser configurado para definir o cookie para sua página, e para verificar que o header está presente em todas as requisições elegíveis. Falhar em fazer isso torna a proteção padrão do Angular ineficaz.
</docs-callout>

### Configurar nomes personalizados de cookie/header

Se seu service de backend usa nomes diferentes para o cookie ou header do token XSRF, use `withXsrfConfiguration` para sobrescrever os padrões.

Adicione-o à chamada `provideHttpClient` da seguinte forma:

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withXsrfConfiguration({
        cookieName: 'CUSTOM_XSRF_TOKEN',
        headerName: 'X-Custom-Xsrf-Header',
      }),
    ),
  ]
};
```

### Desabilitando a proteção XSRF

Se o mecanismo de proteção XSRF integrado não funciona para sua aplicação, você pode desabilitá-lo usando o recurso `withNoXsrfProtection`:

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withNoXsrfProtection(),
    ),
  ]
};
```
