<!-- ia-translate: true -->
# Event handling

Event handling habilita recursos interativos em aplicações web. Isso permite que você, como desenvolvedor, responda a ações do usuário como cliques de botões, submissões de formulários e muito mais.

Nota: Saiba mais sobre [lidar com interação do usuário no guia de fundamentos](/essentials/templates#handling-user-interaction).

Nesta atividade, você aprenderá como adicionar um event handler.

<hr />

No Angular você vincula a eventos com a sintaxe de parênteses `()`. Em um elemento, envolva o evento ao qual você quer vincular com parênteses e defina um event handler. Considere este exemplo de `button`:

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

Tudo bem, agora é sua vez de tentar:

<docs-workflow>

<docs-step title="Adicionar um event handler">
Adicione a função event handler `showSecretMessage()` na classe `App`. Use o seguinte código como implementação:

```ts
showSecretMessage() {
  this.message = 'Way to go 🚀';
}
```

</docs-step>

<docs-step title="Vincular ao evento do template">
Atualize o código do template em `app.ts` para vincular ao evento `mouseover` do elemento `section`.

```angular-html
<section (mouseover)="showSecretMessage()">
```

</docs-step>

</docs-workflow>

E com alguns passos no código você criou seu primeiro event handler no Angular. Parece que você está ficando muito bom nisso, continue com o bom trabalho.
