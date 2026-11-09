<!-- ia-translate: true -->
# Blocos @loading, @error e @placeholder

Deferrable views permitem definir conteúdo a ser mostrado em diferentes estados de carregamento.

| Bloco          | Descrição                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@placeholder` | Por padrão, blocos defer não renderizam nenhum conteúdo antes de serem acionados. O `@placeholder` é um bloco opcional que declara o conteúdo a ser mostrado antes que o conteúdo deferido seja carregado. O Angular substitui o placeholder pelo conteúdo deferido quando o carregamento é concluído. Embora esse bloco seja opcional, a equipe do Angular recomenda sempre incluir um placeholder. [Saiba mais na documentação completa de deferrable views](guide/templates/defer) |
| `@loading`     | Este bloco opcional permite declarar o conteúdo a ser mostrado durante o carregamento de quaisquer dependências deferidas.                                                                                                                                                                                                                                                                                                                         |
| `@error`       | Este bloco permite declarar o conteúdo que é mostrado se o carregamento deferido falhar.                                                                                                                                                                                                                                                                                                                                                             |

O conteúdo de todos os sub-blocos acima é carregado de forma eager. Além disso, alguns recursos exigem um bloco `@placeholder`.

Nesta atividade, você aprenderá como usar os blocos `@loading`, `@error` e `@placeholder` para gerenciar os estados das deferrable views.

<hr>

<docs-workflow>

<docs-step title="Adicione o bloco `@placeholder` {#add-placeholder-block}">
No seu `app.ts`, adicione um bloco `@placeholder` ao bloco `@defer`.

```angular-html {highlight:[3,4,5]}
@defer {
  <article-comments />
} @placeholder {
  <p>Placeholder for comments</p>
}
```

</docs-step>

<docs-step title="Configure o bloco `@placeholder` {#configure-the-placeholder-block}">
O bloco `@placeholder` aceita um parâmetro opcional para especificar a quantidade `minimum` de tempo em que este placeholder deve ser mostrado. Esse parâmetro `minimum` é especificado em incrementos de tempo de milissegundos (ms) ou segundos (s). Ele existe para evitar que o conteúdo do placeholder pisque rapidamente caso as dependências deferidas sejam buscadas em pouco tempo.

```angular-html {highlight:[3,4,5]}
@defer {
  <article-comments />
} @placeholder (minimum 1s) {
  <p>Placeholder for comments</p>
}
```

</docs-step>

<docs-step title="Adicione o bloco `@loading` {#add-loading-block}">
Em seguida, adicione um bloco `@loading` ao template do component.

O bloco `@loading` aceita dois parâmetros opcionais:

- `minimum`: a quantidade de tempo em que este bloco deve ser mostrado
- `after`: a quantidade de tempo a aguardar após o início do carregamento antes de mostrar o template de loading

Ambos os parâmetros são especificados em incrementos de tempo de milissegundos (ms) ou segundos (s).

Atualize `app.ts` para incluir um bloco `@loading` com um parâmetro `minimum` de `1s`, bem como um parâmetro `after` com o valor 500ms no bloco @loading.

```angular-html {highlight:[5,6,7]}
@defer {
  <article-comments />
} @placeholder (minimum 1s) {
  <p>Placeholder for comments</p>
} @loading (minimum 1s; after 500ms) {
  <p>Loading comments...</p>
}
```

NOTA: este exemplo usa dois parâmetros, separados pelo caractere ;.

</docs-step>

<docs-step title="Adicione o bloco `@error` {#add-error-block}">
Por fim, adicione um bloco `@error` ao bloco `@defer`.

```angular-html {highlight:[7,8,9]}
@defer {
  <article-comments />
} @placeholder (minimum 1s) {
  <p>Placeholder for comments</p>
} @loading (minimum 1s; after 500ms) {
  <p>Loading comments...</p>
} @error {
  <p>Failed to load comments</p>
}
```

</docs-step>
</docs-workflow>

Parabéns! Neste ponto, você tem uma boa compreensão sobre deferrable views. Continue com o ótimo trabalho e vamos aprender sobre triggers a seguir.
