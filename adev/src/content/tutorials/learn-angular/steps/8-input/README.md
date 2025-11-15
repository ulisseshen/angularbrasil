<!-- ia-translate: true -->
# Propriedades input de components

Às vezes, o desenvolvimento de aplicações requer que você envie dados para um component. Esses dados podem ser usados para personalizar um component ou talvez enviar informações de um component pai para um component filho.

O Angular usa um conceito chamado `input`. Isso é similar a `props` em outros frameworks. Para criar uma propriedade `input`, use a função `input()`.

Nota: Saiba mais sobre [aceitar dados com propriedades input no guia de inputs](/guide/components/inputs).

Nesta atividade, você aprenderá como usar a função `input()` para enviar informações para components.

<hr>

Para criar uma propriedade `input`, adicione a função `input()` para inicializar uma propriedade de uma classe de component:

<docs-code header="user.ts" language="ts">
class User {
  occupation = input<string>();
}
</docs-code>

Quando você estiver pronto para passar um valor através de um `input`, os valores podem ser definidos em templates usando a sintaxe de atributo. Aqui está um exemplo:

<docs-code header="app.ts" language="angular-ts" highlight="[3]">
@Component({
  ...
  template: `<app-user occupation="Angular Developer"></app-user>`
})
export class App {}
</docs-code>

A função `input` retorna um `InputSignal`. Você pode ler o valor chamando o signal.

<docs-code header="user.ts" language="angular-ts">
@Component({
  ...
  template: `<p>The user's occupation is {{occupation()}}</p>`
})
</docs-code>

<docs-workflow>

<docs-step title="Defina uma propriedade `input()`">
Atualize o código em `user.ts` para definir uma propriedade `input` no `User` chamada `name` e especifique o tipo `string`. Por enquanto, não defina um valor inicial e invoque `input()` sem argumentos. Certifique-se de atualizar o template para invocar e interpolar a propriedade `name` no final da frase.
</docs-step>

<docs-step title="Passe um valor para a propriedade `input`">
Atualize o código em `app.ts` para enviar a propriedade `name` com um valor de `"Simran"`.
<br>

Quando o código for atualizado com sucesso, a aplicação exibirá `The user's name is Simran`.
</docs-step>

</docs-workflow>

Embora isso seja ótimo, é apenas uma direção da comunicação entre components. E se você quiser enviar informações e dados para um component pai a partir de um component filho? Confira a próxima lição para descobrir.

P.S. você está indo muito bem - continue assim 🎉
