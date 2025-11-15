<!-- ia-translate: true -->
# Triggers de defer

Embora as opções padrão para `@defer` ofereçam ótimas opções para lazy loading de partes dos seus components, ainda pode ser desejável personalizar ainda mais a experiência de carregamento deferido.

Por padrão, o conteúdo deferido carrega quando o browser está ocioso. Você pode, no entanto, personalizar quando esse carregamento ocorre especificando um **trigger**. Isso permite que você escolha o comportamento de carregamento mais adequado ao seu component.

Deferrable views oferecem dois tipos de trigger de carregamento:

<div class="docs-table docs-scroll-track-transparent">
  <table>
    <tr>
      <td><code>on</code></td>
      <td>
        Uma condição de trigger usando um trigger da lista de triggers integrados.<br/>
        Por exemplo: <code>@defer (on viewport)</code>
      </td>
    </tr>
    <tr>
      <td><code>when</code></td>
      <td>
        Uma condição como uma expressão que é avaliada quanto à veracidade. Quando a expressão é verdadeira, o placeholder é trocado pelo conteúdo carregado lazily.<br/>
        Por exemplo: <code>@defer (when customizedCondition)</code>
      </td>
    </tr>
  </table>
</div>

Se a condição `when` avaliar para `false`, o bloco `defer` não é revertido de volta ao placeholder. A troca é uma operação única.

Você pode definir múltiplos triggers de evento ao mesmo tempo, esses triggers serão avaliados como condições OR.

- Ex: `@defer (on viewport; on timer(2s))`
- Ex: `@defer (on viewport; when customizedCondition)`

Nesta atividade, você aprenderá como usar triggers para especificar a condição para carregar as deferrable views.

<hr>

<docs-workflow>

<docs-step title="Adicione o trigger on hover">
No seu `app.ts`, adicione um trigger `on hover` ao bloco `@defer`.

<docs-code language="angular-html" hightlight="[1]">
@defer (on hover) {
  <article-comments />
} @placeholder (minimum 1s) {
  <p>Placeholder for comments</p>
} @loading (minimum 1s; after 500ms) {
  <p>Loading comments...</p>
} @error {
  <p>Failed to load comments</p>
}
</docs-code>

Agora, a página não renderizará a seção de comentários até que você passe o mouse sobre seu placeholder.
</docs-step>

<docs-step title="Adicione um botão 'Show all comments'">
Em seguida, atualize o template para incluir um botão com o rótulo "Show all comments". Inclua uma variável de template chamada `#showComments` com o botão.

<docs-code language="angular-html" hightlight="[1]">
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
</docs-code>

NOTA: para mais informações sobre [variáveis de template, confira a documentação](https://angular.dev/guide/templates/reference-variables#).

</docs-step>

<docs-step title="Adicione o trigger on interaction">
Atualize o bloco `@defer` no template para usar o trigger `on interaction`. Forneça a variável de template `showComments` como parâmetro para `interaction`.

<docs-code language="angular-html" hightlight="[3]">
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
</docs-code>

Com essas mudanças, a página aguardará uma das seguintes condições antes de renderizar a seção de comentários:

- Usuário passa o mouse sobre o placeholder da seção de comentários
- Usuário clica no botão "Show all comments"

Você pode recarregar a página para experimentar diferentes triggers para renderizar a seção de comentários.
</docs-step>
</docs-workflow>

Se você gostaria de aprender mais, confira a documentação para [Deferrable View](https://angular.dev/guide/defer).
Continue aprendendo para desbloquear mais recursos fantásticos do Angular.
