<!-- ia-translate: true -->
# Deferrable views

Às vezes, no desenvolvimento de aplicações, você acaba com muitos components que precisa referenciar na sua aplicação, mas alguns deles não precisam ser carregados imediatamente, por diversos motivos.

Talvez eles estejam abaixo da dobra visível ou sejam components pesados com os quais o usuário só interage mais tarde. Nesse caso, podemos carregar alguns desses recursos depois, com deferrable views.

NOTE: Saiba mais sobre [carregamento adiado com @defer no guia detalhado](/guide/templates/defer).

Nesta atividade, você aprenderá como usar deferrable views para adiar o carregamento de uma seção do template do seu component.

<hr>

<docs-workflow>

<docs-step title="Adicione um bloco `@defer` em torno do component de comentários">

Na sua aplicação, a página de post do blog tem um component de comentários após os detalhes do post.

Envolva o component de comentários com um bloco `@defer` para adiar o carregamento dele.

```angular-html
@defer {
  <comments />
}
```

O código acima é um exemplo de como usar um bloco `@defer` básico. Por padrão, `@defer` carregará o component `comments` quando o browser estiver ocioso.

</docs-step>

<docs-step title="Adicione um placeholder">

Adicione um bloco `@placeholder` ao bloco `@defer`. O bloco `@placeholder` é onde você coloca o HTML que será mostrado antes do início do carregamento adiado. O conteúdo dos blocos `@placeholder` é carregado de forma eager.

```angular-html {highlight:[3,4,5]}
@defer {
  <comments />
} @placeholder {
  <p>Future comments</p>
}
```

</docs-step>

<docs-step title="Adicione um bloco de loading">

Adicione um bloco `@loading` ao bloco `@defer`. O bloco `@loading` é onde você coloca o HTML que será mostrado _enquanto_ o conteúdo adiado está sendo buscado, mas ainda não terminou. O conteúdo dos blocos `@loading` é carregado de forma eager.

```angular-html {highlight:[5,6,7]}
@defer {
  <comments />
} @placeholder {
  <p>Future comments</p>
} @loading {
  <p>Loading comments...</p>
}
```

</docs-step>

<docs-step title="Adicione uma duração mínima">

As seções `@placeholder` e `@loading` têm parâmetros opcionais para evitar que ocorra cintilação quando o carregamento acontece rapidamente. `@placeholder` tem `minimum`, e `@loading` tem `minimum` e `after`. Adicione uma duração `minimum` ao bloco `@loading` para que ele seja renderizado por pelo menos 2 segundos.

```angular-html {highlight:[5]}
@defer {
  <comments />
} @placeholder {
  <p>Future comments</p>
} @loading (minimum 2s) {
  <p>Loading comments...</p>
}
```

</docs-step>

<docs-step title="Adicione um trigger de viewport">

Deferrable views têm várias opções de trigger. Adicione um trigger de viewport para que o conteúdo seja carregado de forma adiada assim que entrar na viewport.

```angular-html {highlight:[1]}
@defer (on viewport) {
  <comments />
} @placeholder {
  <p>Future comments</p>
} @loading (minimum 2s) {
  <p>Loading comments...</p>
}
```

</docs-step>

<docs-step title="Adicione conteúdo">

Um trigger de viewport é mais útil quando você está adiando conteúdo que fica longe o suficiente na página e precisa ser rolado para ser visto. Então, vamos adicionar algum conteúdo ao nosso post do blog. Você pode escrever o seu próprio, ou pode copiar o conteúdo abaixo e colocá-lo dentro do elemento `<article>`.

```html {highlight:[1]}
<article>
  <p>
    Angular is my favorite framework, and this is why. Angular has the coolest deferrable view
    feature that makes defer loading content the easiest and most ergonomic it could possibly be.
    The Angular community is also filled with amazing contributors and experts that create excellent
    content. The community is welcoming and friendly, and it really is the best community out there.
  </p>
  <p>
    I can't express enough how much I enjoy working with Angular. It offers the best developer
    experience I've ever had. I love that the Angular team puts their developers first and takes
    care to make us very happy. They genuinely want Angular to be the best framework it can be, and
    they're doing such an amazing job at it, too. This statement comes from my heart and is not at
    all copied and pasted. In fact, I think I'll say these exact same things again a few times.
  </p>
  <p>
    Angular is my favorite framework, and this is why. Angular has the coolest deferrable view
    feature that makes defer loading content the easiest and most ergonomic it could possibly be.
    The Angular community is also filled with amazing contributors and experts that create excellent
    content. The community is welcoming and friendly, and it really is the best community out there.
  </p>
  <p>
    I can't express enough how much I enjoy working with Angular. It offers the best developer
    experience I've ever had. I love that the Angular team puts their developers first and takes
    care to make us very happy. They genuinely want Angular to be the best framework it can be, and
    they're doing such an amazing job at it, too. This statement comes from my heart and is not at
    all copied and pasted. In fact, I think I'll say these exact same things again a few times.
  </p>
  <p>
    Angular is my favorite framework, and this is why. Angular has the coolest deferrable view
    feature that makes defer loading content the easiest and most ergonomic it could possibly be.
    The Angular community is also filled with amazing contributors and experts that create excellent
    content. The community is welcoming and friendly, and it really is the best community out there.
  </p>
  <p>
    I can't express enough how much I enjoy working with Angular. It offers the best developer
    experience I've ever had. I love that the Angular team puts their developers first and takes
    care to make us very happy. They genuinely want Angular to be the best framework it can be, and
    they're doing such an amazing job at it, too. This statement comes from my heart and is not at
    all copied and pasted.
  </p>
</article>
```

Depois de adicionar este código, role a página para baixo para ver o conteúdo adiado carregar quando ele entrar na viewport.

</docs-step>

</docs-workflow>

Na atividade, você aprendeu como usar deferrable views nas suas aplicações. Ótimo trabalho. 🙌

Há ainda mais que você pode fazer com elas, como diferentes triggers, prefetching e blocos `@error`.

Se quiser aprender mais, confira a [documentação de Deferrable views](/guide/templates/defer).
