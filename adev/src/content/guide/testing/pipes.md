<!-- ia-translate: true -->
# Testes de Pipes

Você pode testar [pipes](guide/templates/pipes) sem os utilitários de teste do Angular.

## Testes do `TitleCasePipe`

Uma classe pipe tem um método, `transform`, que manipula o valor de entrada em um valor de saída transformado.
A implementação `transform` raramente interage com o DOM.
A maioria dos pipes não tem dependência do Angular além da metadata `@Pipe` e uma interface.

Considere um `TitleCasePipe` que capitaliza a primeira letra de cada palavra.
Aqui está uma implementação com uma expressão regular.

<docs-code header="app/shared/title-case.pipe.ts" path="adev/src/content/examples/testing/src/app/shared/title-case.pipe.ts"/>

Qualquer coisa que use uma expressão regular vale a pena testar completamente.
Use Jasmine simples para explorar os casos esperados e os casos extremos.

<docs-code header="app/shared/title-case.pipe.spec.ts" path="adev/src/content/examples/testing/src/app/shared/title-case.pipe.spec.ts" visibleRegion="excerpt"/>

## Escrevendo testes DOM para suportar um teste de pipe

Estes são testes do pipe _isoladamente_.
Eles não podem dizer se o `TitleCasePipe` está funcionando corretamente quando aplicado nos components da aplicação.

Considere adicionar testes de component como este:

<docs-code header="app/hero/hero-detail.component.spec.ts (pipe test)" path="adev/src/content/examples/testing/src/app/hero/hero-detail.component.spec.ts" visibleRegion="title-case-pipe"/>
