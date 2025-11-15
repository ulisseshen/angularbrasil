<!-- ia-translate: true -->
# Control Flow em Components - `@for`

Frequentemente ao construir aplicações web, você precisa repetir algum código um número específico de vezes - por exemplo, dado um array de nomes, você pode querer exibir cada nome em uma tag `<p>`.

Nota: Saiba mais sobre [control flow no guia de fundamentos](/essentials/templates#control-flow-with-if-and-for).

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
  operatingSystems = [{id: 'win', name: 'Windows'}, {id: 'osx', name: 'MacOS'}, {id: 'linux', name: 'Linux'}];
}
```

Duas coisas a se observar:

- Há um prefixo `@` para o `for` porque é uma sintaxe especial chamada [sintaxe de template do Angular](guide/templates)
- Para aplicações usando v16 e versões anteriores, consulte a [documentação do Angular para NgFor](guide/directives/structural-directives)

<docs-workflow>

<docs-step title="Adicionar a propriedade `users`">
Na classe `App`, adicione uma propriedade chamada `users` que contém usuários e seus nomes.

```ts
[{id: 0, name: 'Sarah'}, {id: 1, name: 'Amy'}, {id: 2, name: 'Rachel'}, {id: 3, name: 'Jessica'}, {id: 4, name: 'Poornima'}]
```

</docs-step>

<docs-step title="Atualizar o template">
Atualize o template para exibir cada nome de usuário em um elemento `p` usando a sintaxe de template `@for`.

```angular-html
@for (user of users; track user.id) {
  <p>{{ user.name }}</p>
}
```

NOTA: o uso de `track` é obrigatório, você pode usar o `id` ou algum outro identificador único.

</docs-step>

</docs-workflow>

Este tipo de funcionalidade é chamado de control flow. A seguir, você aprenderá a personalizar e comunicar-se com components - a propósito, você está indo muito bem até agora.
