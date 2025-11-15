<!-- ia-translate: true -->
<docs-decorative-header title="Angular Routing" imgSrc="adev/src/assets/images/routing.svg"> <!-- markdownlint-disable-line -->
Routing ajuda você a mudar o que o usuário vê em uma aplicação de página única.
</docs-decorative-header>

O Angular Router (`@angular/router`) é a biblioteca oficial para gerenciar navegação em aplicações Angular e uma parte central do framework. Ele é incluído por padrão em todos os projetos criados pelo Angular CLI.

## Por que routing é necessário em uma SPA?

Quando você navega para uma URL no seu navegador web, o navegador normalmente faz uma requisição de rede para um servidor web e exibe a página HTML retornada. Quando você navega para uma URL diferente, como clicar em um link, o navegador faz outra requisição de rede e substitui a página inteira por uma nova.

Uma aplicação de página única (SPA) difere no sentido de que o navegador só faz uma requisição para um servidor web para a primeira página, o `index.html`. Depois disso, um router do lado do cliente assume o controle, controlando qual conteúdo é exibido baseado na URL. Quando um usuário navega para uma URL diferente, o router atualiza o conteúdo da página no local sem acionar um recarregamento completo da página.

## Como o Angular gerencia routing

Routing no Angular é composto de três partes principais:

1. **Routes** definem qual component é exibido quando um usuário visita uma URL específica.
2. **Outlets** são placeholders em seus templates que carregam e renderizam componentes dinamicamente baseados na rota ativa.
3. **Links** fornecem uma forma para os usuários navegarem entre diferentes rotas em sua aplicação sem acionar um recarregamento completo da página.

Além disso, a biblioteca Angular Routing oferece funcionalidade adicional como:

- Rotas aninhadas
- Navegação programática
- Parâmetros de rota, queries e wildcards
- Informação de rota ativada com `ActivatedRoute`
- Efeitos de transição de view
- Guards de navegação

## Próximos passos

Saiba mais sobre como você pode [definir rotas usando o Angular router](/guide/routing/define-routes).
