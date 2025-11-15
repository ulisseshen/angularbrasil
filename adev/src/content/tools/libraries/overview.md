<!-- ia-translate: true -->
# Visão Geral de libraries do Angular

Muitas aplicações precisam resolver os mesmos problemas gerais, como apresentar uma interface de usuário unificada, apresentar dados e permitir a entrada de dados.
Desenvolvedores podem criar soluções gerais para domínios específicos que podem ser adaptadas para reutilização em diferentes aplicações.
Essa solução pode ser construída como _libraries_ do Angular e essas libraries podem ser publicadas e compartilhadas como _pacotes npm_.

Uma library do Angular é um projeto Angular que difere de uma aplicação por não poder ser executada sozinha.
Uma library deve ser importada e usada em uma aplicação.

Libraries estendem os recursos base do Angular.
Por exemplo, para adicionar [reactive forms](guide/forms/reactive-forms) a uma aplicação, adicione o pacote da library usando `ng add @angular/forms`, depois importe o `ReactiveFormsModule` da library `@angular/forms` no código da sua aplicação.
Da mesma forma, adicionar a library de [service worker](ecosystem/service-workers) a uma aplicação Angular é uma das etapas para transformar uma aplicação em uma [Progressive Web App](https://developers.google.com/web/progressive-web-apps) \(PWA\).
[Angular Material](https://material.angular.dev) é um exemplo de uma library grande e de uso geral que fornece components de UI sofisticados, reutilizáveis e adaptáveis.

Qualquer desenvolvedor de aplicações pode usar essas e outras libraries que foram publicadas como pacotes npm pela equipe do Angular ou por terceiros.
Veja [Usando Libraries Publicadas](tools/libraries/using-libraries).

HELPFUL: Libraries são destinadas a serem usadas por aplicações Angular. Para adicionar recursos do Angular a aplicações web não-Angular, use [Angular custom elements](guide/elements).

## Criando libraries

Se você desenvolveu recursos adequados para reutilização, pode criar suas próprias libraries.
Essas libraries podem ser usadas localmente no seu workspace, ou você pode publicá-las como [pacotes npm](reference/configs/npm-packages) para compartilhar com outros projetos ou outros desenvolvedores Angular.
Esses pacotes podem ser publicados no registro npm, em um registro npm Enterprise privado ou em um sistema de gerenciamento de pacotes privado que suporte pacotes npm.
Veja [Criando Libraries](tools/libraries/creating-libraries).

Decidir empacotar recursos como uma library é uma decisão arquitetural. É comparável a decidir se um recurso é um component ou um service, ou decidir o escopo de um component.

Empacotar recursos como uma library força os artefatos na library a serem desacoplados da lógica de negócios da aplicação.
Isso pode ajudar a evitar várias práticas ruins ou erros de arquitetura que podem dificultar o desacoplamento e a reutilização de código no futuro.

Colocar código em uma library separada é mais complexo do que simplesmente colocar tudo em uma aplicação.
Requer mais investimento em tempo e pensamento para gerenciar, manter e atualizar a library.
Essa complexidade pode valer a pena quando a library está sendo usada em múltiplas aplicações.
