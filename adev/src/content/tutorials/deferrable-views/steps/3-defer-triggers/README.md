<!-- ia-translate: true -->
# Triggers de defer {#defer-triggers}

Embora as opções padrão de `@defer` ofereçam ótimas possibilidades para o lazy loading de partes dos seus components, ainda pode ser desejável personalizar melhor a experiência de carregamento deferido.

Por padrão, o conteúdo deferido carrega quando o browser está ocioso. Você pode, porém, personalizar quando esse carregamento acontece especificando um **trigger**. Isso permite escolher o comportamento de carregamento mais adequado ao seu component.

Deferrable views oferecem dois tipos de trigger de carregamento:

| Trigger | Descrição                                                                                                                                                                                                      |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `on`    | Uma condição de trigger que usa um trigger da lista de triggers integrados.<br/>Por exemplo: `@defer (on viewport)`                                                                                            |
| `when`  | Uma condição como uma expressão que é avaliada quanto à veracidade. Quando a expressão é verdadeira, o placeholder é trocado pelo conteúdo carregado de forma lazy.<br/>Por exemplo: `@defer (when customizedCondition)` |

Se a condição `when` for avaliada como `false`, o bloco `defer` não volta ao placeholder. A troca é uma operação única.

Você pode definir múltiplos triggers de evento ao mesmo tempo. Esses triggers são avaliados como condições OR.

- Ex: `@defer (on viewport; on timer(2s))`
- Ex: `@defer (on viewport; when customizedCondition)`

Nesta atividade, você aprenderá como usar triggers para especificar a condição de carregamento das deferrable views.

<hr>

<docs-workflow>

<docs-step title="Adicione o trigger `on hover`">
No seu `app.ts`, adicione um trigger `on hover` ao bloco `@defer`.

```angular-html {highlight:[1]}
@defer (on hover) {
  <article-comments />
} @placeholder (minimum 1s) {
  <p>Placeholder for comments</p>
} @loading (minimum 1s; after 500ms) {
  <p>Loading comments...</p>
} @error {
  <p>Failed to load comments</p>
}
```

Agora, a página não renderizará a seção de comentários até que você passe o mouse sobre o placeholder dela.
</docs-step>

<docs-step title="Adicione um botão 'Show all comments'">
Em seguida, atualize o template para incluir um botão com o rótulo "Show all comments". Inclua uma variável de template chamada `#showComments` no botão.

```angular-html {highlight:[1]}
<button type="button" #showComments>Show all comments</button>

@defer (on hover) {
  <article-comments />
} @placeholder (minimum 1s) {
  <p>Placeholder for comments</p>
} @loading (minimum 1s; after 500ms) {
  <p>Loading comments...</p>
} @error {
  <p>Failed to load comments</p>
}
```

NOTA: para mais informações sobre [variáveis de template, confira a documentação](/guide/templates/variables#declaring-a-template-reference-variable).

</docs-step>

<docs-step title="Adicione o trigger `on interaction`">
Atualize o bloco `@defer` no template para usar o trigger `on interaction`. Forneça a variável de template `showComments` como parâmetro de `interaction`.

```angular-html {highlight:[3]}
<button type="button" #showComments>Show all comments</button>

@defer (on hover; on interaction(showComments)) {
  <article-comments />
} @placeholder (minimum 1s) {
  <p>Placeholder for comments</p>
} @loading (minimum 1s; after 500ms) {
  <p>Loading comments...</p>
} @error {
  <p>Failed to load comments</p>
}
```

Com essas mudanças, a página aguardará uma das seguintes condições antes de renderizar a seção de comentários:

- O usuário passa o mouse sobre o placeholder da seção de comentários
- O usuário clica no botão "Show all comments"

Você pode recarregar a página para testar os diferentes triggers que renderizam a seção de comentários.
</docs-step>
</docs-workflow>

Se você quiser aprender mais, confira a documentação de [Deferrable View](/guide/templates/defer).
Continue aprendendo para desbloquear mais recursos incríveis do Angular.
