<!-- ia-translate: true -->
# Control Flow em Components - `@if`

Decidir o que exibir na tela para um usuário é uma tarefa comum no desenvolvimento de aplicações. Muitas vezes, a decisão é tomada programaticamente usando condições.

Para expressar exibições condicionais em templates, o Angular usa a sintaxe de template `@if`.

Nota: Saiba mais sobre [control flow no guia de fundamentos](/essentials/templates#control-flow-with-if-and-for).

Nesta atividade, você aprenderá como usar condicionais em templates.

<hr/>

A sintaxe que habilita a exibição condicional de elementos em um template é `@if`.

Aqui está um exemplo de como usar a sintaxe `@if` em um component:

```angular-ts
@Component({
  ...
  template: `
    @if (isLoggedIn) {
      <p>Welcome back, Friend!</p>
    }
  `,
})
export class App {
  isLoggedIn = true;
}
```

Duas coisas a se observar:

- Há um prefixo `@` para o `if` porque é um tipo especial de sintaxe chamada [sintaxe de template do Angular](guide/templates)
- Para aplicações usando v16 e versões anteriores, consulte a [documentação do Angular para NgIf](guide/directives/structural-directives) para mais informações.

<docs-workflow>

<docs-step title="Criar uma propriedade chamada `isServerRunning`">
Na classe `App`, adicione uma propriedade `boolean` chamada `isServerRunning`, defina o valor inicial como `true`.
</docs-step>

<docs-step title="Usar `@if` no template">
Atualize o template para exibir a mensagem `Yes, the server is running` se o valor de `isServerRunning` for `true`.

</docs-step>

<docs-step title="Usar `@else` no template">
Agora o Angular suporta sintaxe de template nativa para definir o caso else com a sintaxe `@else`. Atualize o template para exibir a mensagem `No, the server is not running` como o caso else.

Aqui está um exemplo:

```angular-ts
template: `
  @if (isServerRunning) { ... }
  @else { ... }
`;
```

Adicione seu código para preencher a marcação faltante.

</docs-step>

</docs-workflow>

Este tipo de funcionalidade é chamado de conditional control flow. A seguir, você aprenderá como repetir itens em um template.
