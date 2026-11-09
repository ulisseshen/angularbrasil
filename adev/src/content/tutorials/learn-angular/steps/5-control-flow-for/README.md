<!-- ia-translate: true -->
# Control flow em components - `@for` {#control-flow-in-components--for}

Muitas vezes, ao construir aplicações web, você precisa repetir algum código um número específico de vezes. Por exemplo, dado um array de nomes, você pode querer exibir cada nome em uma tag `<p>`.

NOTE: Saiba mais sobre [control flow no guia de fundamentos](/essentials/templates#control-flow-with-if-and-for).

Nesta atividade, você aprenderá como usar `@for` para repetir elementos em um template.

<hr/>

A sintaxe que habilita a repetição de elementos em um template é `@for`.

Aqui está um exemplo de como usar a sintaxe `@for` em um component:

```angular-ts
@Component({
  ...
  template: `
    @for (os of operatingSystems; track os.id) {
      {{ os.name }}
    }
  `,
})
export class App {
  operatingSystems = [{id: 'win', name: 'Windows'}, {id: 'osx', name: 'macOS'}, {id: 'linux', name: 'Linux'}];
}
```

Duas coisas para observar:

- Há um prefixo `@` antes do `for` porque ele é uma sintaxe especial chamada [sintaxe de template do Angular](guide/templates)
- Para aplicações que ainda usam `*ngFor`, consulte a [documentação do Angular para NgFor](guide/directives/structural-directives)

<docs-workflow>

<docs-step title="Adicionar a propriedade `users` {#add-the-users-property}">
Na classe `App`, adicione uma propriedade chamada `users` que contenha usuários e seus nomes.

```ts
[
  {id: 0, name: 'Sarah'},
  {id: 1, name: 'Amy'},
  {id: 2, name: 'Rachel'},
  {id: 3, name: 'Jessica'},
  {id: 4, name: 'Poornima'},
];
```

</docs-step>

<docs-step title="Atualizar o template {#update-the-template}">
Atualize o template para exibir o nome de cada usuário em um elemento `p`, usando a sintaxe de template `@for`.

```angular-html
@for (user of users; track user.id) {
  <p>{{ user.name }}</p>
}
```

NOTE: o uso de `track` é obrigatório. Você pode usar o `id` ou algum outro identificador único.

</docs-step>

</docs-workflow>

Este tipo de funcionalidade é chamado de control flow. A seguir, você aprenderá a personalizar e a se comunicar com components. Aliás, você está indo muito bem até aqui.
