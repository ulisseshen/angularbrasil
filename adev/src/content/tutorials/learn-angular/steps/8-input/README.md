<!-- ia-translate: true -->
# Propriedades input de components {#component-input-properties}

Às vezes, o desenvolvimento de aplicações exige que você envie dados para um component. Esses dados podem ser usados para personalizar um component ou para enviar informações de um component pai para um component filho.

O Angular usa um conceito chamado `input`. Ele é semelhante a `props` em outros frameworks. Para criar uma propriedade `input`, use a função `input()`.

NOTE: Saiba mais sobre [aceitar dados com propriedades input no guia de inputs](/guide/components/inputs).

Nesta atividade, você aprenderá como usar a função `input()` para enviar informações para components.

<hr>

Para criar uma propriedade `input`, adicione a função `input()` para inicializar uma propriedade da classe do component:

```ts {header:"user.ts"}
class User {
  occupation = input<string>();
}
```

Quando você estiver pronto para passar um valor por um `input`, os valores podem ser definidos em templates usando a sintaxe de atributo. Aqui está um exemplo:

```angular-ts {header:"app.ts", highlight:[3]}
@Component({
  ...
  template: `<app-user occupation="Angular Developer"></app-user>`
})
export class App {}
```

A função `input` retorna um `InputSignal`. Você pode ler o valor chamando o signal.

```angular-ts {header:"user.ts"}
@Component({
  ...
  template: `<p>The user's occupation is {{occupation()}}</p>`
})
```

<docs-workflow>

<docs-step title="Defina uma propriedade `input()` {#define-an-input-property}">
Atualize o código em `user.ts` para definir uma propriedade `input` em `User` chamada `name` e especifique o tipo `string`. Por enquanto, não defina um valor inicial e invoque `input()` sem argumentos. Não se esqueça de atualizar o template para invocar e interpolar a propriedade `name` no final da frase.
</docs-step>

<docs-step title="Passe um valor para a propriedade `input` {#pass-a-value-to-the-input-property}">
Atualize o código em `app.ts` para enviar a propriedade `name` com o valor `"Simran"`.
<br>

Quando o código for atualizado com sucesso, a aplicação exibirá `The user's name is Simran`.
</docs-step>

</docs-workflow>

Embora isso seja ótimo, é apenas uma direção da comunicação entre components. E se você quiser enviar informações e dados de um component filho para um component pai? Confira a próxima lição para descobrir.

P.S. você está indo muito bem. Continue assim 🎉
