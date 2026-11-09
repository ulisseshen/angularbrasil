<!-- ia-translate: true -->
# Tratamento de eventos {#event-handling}

O tratamento de eventos habilita recursos interativos em aplicações web. Ele dá a você, como desenvolvedor, a capacidade de responder a ações do usuário, como cliques em botões, envios de formulários e muito mais.

NOTE: Saiba mais sobre [lidar com a interação do usuário no guia de fundamentos](/essentials/templates#handling-user-interaction).

Nesta atividade, você aprenderá como adicionar um event handler.

<hr />

No Angular, você vincula eventos com a sintaxe de parênteses `()`. Em um elemento, envolva o evento ao qual você quer vincular com parênteses e defina um event handler. Considere este exemplo de `button`:

```angular-ts
@Component({
  ...
  template: `<button (click)="greet()">`
})
export class App {
  greet() {
    console.log('Hello, there 👋');
  }
}
```

Neste exemplo, a função `greet()` será executada toda vez que o botão for clicado. Observe que a sintaxe `greet()` inclui os parênteses finais.

Agora é sua vez de tentar:

<docs-workflow>

<docs-step title="Adicionar um event handler">
Na classe `App`, preencha o corpo do método `showSecretMessage()` existente com o seguinte código:

```ts
this.message = 'Way to go 🚀';
```

</docs-step>

<docs-step title="Vincular ao evento do template">
Atualize o código do template em `app.ts` para vincular ao evento `mouseover` do elemento `section`.

<!-- prettier-ignore -->
```angular-html
<section (mouseover)="showSecretMessage()">
```

</docs-step>

</docs-workflow>

Com alguns passos no código, você criou seu primeiro event handler no Angular. Parece que você está ficando muito bom nisso. Continue com o bom trabalho.
