<!-- ia-translate: true -->
# Entendendo a comunicação com backend services usando HTTP

A maioria das aplicações front-end precisa se comunicar com um servidor através do protocolo HTTP, para baixar ou enviar dados e acessar outros back-end services. O Angular fornece uma API HTTP client para aplicações Angular, a classe de service `HttpClient` em `@angular/common/http`.

## Recursos do HTTP client service

O HTTP client service oferece os seguintes recursos principais:

- A capacidade de requisitar [valores de resposta tipados](guide/http/making-requests#fetching-json-data)
- [Tratamento de erros](guide/http/making-requests#handling-request-failure) simplificado
- [Interceptação](guide/http/interceptors) de requisição e resposta
- [Utilitários de teste](guide/http/testing) robustos

## Próximos passos

<docs-pill-row>
  <docs-pill href="guide/http/setup" title="Setting up HttpClient"/>
  <docs-pill href="guide/http/making-requests" title="Making HTTP requests"/>
</docs-pill-row>
