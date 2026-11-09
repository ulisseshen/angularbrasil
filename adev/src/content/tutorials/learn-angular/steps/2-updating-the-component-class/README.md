<!-- ia-translate: true -->
# Atualizando a classe do component {#updating-the-component-class}

No Angular, a lógica e o comportamento do component são definidos na classe TypeScript do component.

NOTE: Saiba mais sobre [mostrar texto dinâmico no guia de fundamentos](/essentials/templates#showing-dynamic-text).

Nesta atividade, você aprenderá como atualizar a classe do component e como usar [interpolation](/guide/templates/binding#render-dynamic-text-with-text-interpolation).

<hr />

<docs-workflow>

<docs-step title="Adicionar uma propriedade chamada `city` {#add-a-property-called-city}">
Atualize a classe do component adicionando uma propriedade chamada `city` à classe `App`.

```ts
export class App {
  city = 'San Francisco';
}
```

A propriedade `city` é do tipo `string`, mas você pode omitir o tipo devido à [inferência de tipos no TypeScript](https://www.typescriptlang.org/docs/handbook/type-inference.html). A propriedade `city` pode ser usada na classe `App` e pode ser referenciada no template do component.

<br>

Para usar uma propriedade de classe em um template, você precisa usar a sintaxe `{{ }}`.
</docs-step>

<docs-step title="Atualizar o template do component {#update-the-component-template}">
Atualize a propriedade `template` para corresponder ao seguinte HTML:

```ts
template: `Hello {{ city }}`,
```

Este é um exemplo de interpolation, parte da sintaxe de template do Angular. Ela permite que você faça muito mais do que colocar texto dinâmico em um template. Você também pode usar esta sintaxe para chamar funções, escrever expressões e muito mais.
</docs-step>

<docs-step title="Mais prática com interpolation {#more-practice-with-interpolation}">
Tente isto: adicione outro conjunto de `{{ }}` com o conteúdo `1 + 1`:

```ts
template: `Hello {{ city }}, {{ 1 + 1 }}`,
```

O Angular avalia o conteúdo de `{{ }}` e renderiza a saída no template.
</docs-step>

</docs-workflow>

Este é apenas o começo do que é possível com templates do Angular. Continue aprendendo para descobrir mais.
