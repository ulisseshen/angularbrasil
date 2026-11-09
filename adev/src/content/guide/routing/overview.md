<!-- ia-translate: true -->

<docs-decorative-header title="Angular Routing" imgSrc="adev/src/assets/images/routing.svg"> <!-- markdownlint-disable-line -->
Roteamento ajuda você a mudar o que o usuário vê em uma aplicação de página única.
</docs-decorative-header>

O Angular Router (`@angular/router`) é a biblioteca oficial para gerenciar a navegação em aplicações Angular e uma parte central do framework. Ele vem incluído por padrão em todos os projetos criados pelo Angular CLI.

## Por que o roteamento é necessário em uma SPA? {#why-is-routing-necessary-in-a-spa}

Quando você navega até uma URL no navegador web, o navegador normalmente faz uma requisição de rede para um servidor web e exibe a página HTML retornada. Quando você navega para uma URL diferente, como ao clicar em um link, o navegador faz outra requisição de rede e substitui a página inteira por uma nova.

Uma aplicação de página única (SPA) difere porque o navegador faz uma requisição a um servidor web apenas para a primeira página, o `index.html`. Depois disso, um router do lado do cliente assume o controle, decidindo qual conteúdo é exibido com base na URL. Quando o usuário navega para uma URL diferente, o router atualiza o conteúdo da página no próprio lugar, sem acionar um recarregamento completo da página.

## Como o Angular gerencia o roteamento {#how-angular-manages-routing}

O roteamento no Angular é composto por três partes principais:

1. **Routes** definem qual component é exibido quando um usuário visita uma URL específica.
2. **Outlets** são placeholders em seus templates que carregam e renderizam components dinamicamente com base na route ativa.
3. **Links** oferecem uma forma de os usuários navegarem entre diferentes routes da aplicação sem acionar um recarregamento completo da página.

Além disso, a biblioteca Angular Routing oferece funcionalidades adicionais, como:

- Routes aninhadas
- Navegação programática
- Parâmetros de route, queries e wildcards
- Informações da route ativada com `ActivatedRoute`
- Data fetching com resources e resolvers de route
- Efeitos de transição de view
- Guards de navegação

## Próximos passos {#next-steps}

Saiba como [definir routes usando o Angular router](/guide/routing/define-routes).
