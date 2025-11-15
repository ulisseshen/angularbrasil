<!-- ia-translate: true -->
# Blocos @loading, @error e @placeholder

Deferrable views permitem que você defina conteúdo a ser mostrado em diferentes estados de carregamento.

<div class="docs-table docs-scroll-track-transparent">
  <table>
    <tr>
      <td><code>@placeholder</code></td>
      <td>
        Por padrão, blocos defer não renderizam nenhum conteúdo antes de serem acionados. O <code>@placeholder</code> é um bloco opcional que declara conteúdo a ser mostrado antes que o conteúdo deferido carregue. O Angular substitui o placeholder pelo conteúdo deferido após a conclusão do carregamento. Embora este bloco seja opcional, o time do Angular recomenda sempre incluir um placeholder.
        <a href="https://angular.dev/guide/templates/defer#triggers" target="_blank">
          Saiba mais na documentação completa de deferrable views
        </a>
      </td>
    </tr>
    <tr>
      <td><code>@loading</code></td>
      <td>
        Este bloco opcional permite que você declare conteúdo a ser mostrado durante o carregamento de quaisquer dependências deferidas.
      </td>
    </tr>
    <tr>
      <td><code>@error</code></td>
      <td>
        Este bloco permite que você declare conteúdo que é mostrado se o carregamento deferido falhar.
      </td>
    </tr>
  </table>
</div>

Os conteúdos de todos os sub-blocos acima são carregados eagerly. Além disso, alguns recursos requerem um bloco `@placeholder`.

Nesta atividade, você aprenderá como usar os blocos `@loading`, `@error` e `@placeholder` para gerenciar os estados de deferrable views.

<hr>

<docs-workflow>

<docs-step title="Adicione o bloco @placeholder">
No seu `app.ts`, adicione um bloco `@placeholder` ao bloco `@defer`.

<docs-code language="angular-html" highlight="[3,4,5]">
@defer {
  <article-comments />
} @placeholder {
  <p>Placeholder for comments</p>
}
</docs-code>
</docs-step>

<docs-step title="Configure o bloco @placeholder">
O bloco `@placeholder` aceita um parâmetro opcional para especificar a quantidade `minimum` de tempo que este placeholder deve ser mostrado. Este parâmetro `minimum` é especificado em incrementos de tempo de milissegundos (ms) ou segundos (s). Este parâmetro existe para prevenir piscar rápido do conteúdo de placeholder no caso de as dependências deferidas serem buscadas rapidamente.

<docs-code language="angular-html" highlight="[3,4,5]">
@defer {
  <article-comments />
} @placeholder (minimum 1s) {
  <p>Placeholder for comments</p>
}
</docs-code>
</docs-step>

<docs-step title="Adicione o bloco @loading">
Em seguida, adicione um bloco `@loading` ao template do component.

O bloco `@loading` aceita dois parâmetros opcionais:

- `minimum`: a quantidade de tempo que este bloco deve ser mostrado
- `after`: a quantidade de tempo a esperar após o carregamento começar antes de mostrar o template de loading

Ambos os parâmetros são especificados em incrementos de tempo de milissegundos (ms) ou segundos (s).

Atualize `app.ts` para incluir um bloco `@loading` com um parâmetro minimum de `1s`, bem como um parâmetro after com o valor 500ms para o bloco @loading.

<docs-code language="angular-html" highlight="[5,6,7]">
@defer {
  <article-comments />
} @placeholder (minimum 1s) {
  <p>Placeholder for comments</p>
} @loading (minimum 1s; after 500ms) {
  <p>Loading comments...</p>
}
</docs-code>

NOTA: este exemplo usa dois parâmetros, separados pelo caractere ;.

</docs-step>

<docs-step title="Adicione o bloco @error">
Finalmente, adicione um bloco `@error` ao bloco `@defer`.

<docs-code language="angular-html" highlight="[7,8,9]">
@defer {
  <article-comments />
} @placeholder (minimum 1s) {
  <p>Placeholder for comments</p>
} @loading (minimum 1s; after 500ms) {
  <p>Loading comments...</p>
} @error {
  <p>Failed to load comments</p>
}
</docs-code>
</docs-step>
</docs-workflow>

Parabéns! Neste ponto, você tem uma boa compreensão sobre deferrable views. Continue o ótimo trabalho e vamos aprender sobre triggers a seguir.
