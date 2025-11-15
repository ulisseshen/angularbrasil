<!-- ia-translate: true -->
# Compondo Components

Você aprendeu a atualizar o template do component, a lógica do component e os estilos do component, mas como você usa um component na sua aplicação?

A propriedade `selector` da configuração do component fornece um nome para usar ao referenciar o component em outro template. Você usa o `selector` como uma tag HTML, por exemplo `app-user` seria `<app-user />` no template.

Nota: Saiba mais sobre [usar components no guia de fundamentos](/essentials/components#using-components).

Nesta atividade, você aprenderá como compor components.

<hr/>

Neste exemplo, existem dois components `User` e `App`.

<docs-workflow>

<docs-step title="Adicionar uma referência a `User`">
Atualize o template de `App` para incluir uma referência ao `User` que usa o selector `app-user`. Certifique-se de adicionar `User` ao array imports de `App`, isso o torna disponível para uso no template de `App`.

```ts
template: `<app-user />`,
imports: [User]
```

O component agora exibe a mensagem `Username: youngTech`. Você pode atualizar o código do template para incluir mais marcação.
</docs-step>

<docs-step title="Adicionar mais marcação">
Como você pode usar qualquer marcação HTML que desejar em um template, tente atualizar o template de `App` para também incluir mais elementos HTML. Este exemplo adicionará um elemento `<section>` como pai do elemento `<app-user>`.

```ts
template: `<section><app-user /></section>`,
```

</docs-step>

</docs-workflow>
Você pode usar tanta marcação HTML e quantos components precisar para transformar sua ideia de aplicação em realidade. Você pode até ter múltiplas cópias do seu component na mesma página.

Isso é uma ótima transição, como você mostraria condicionalmente um component baseado em dados? Vá para a próxima seção para descobrir.
