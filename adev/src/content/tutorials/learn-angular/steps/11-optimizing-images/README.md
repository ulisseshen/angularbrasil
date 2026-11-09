<!-- ia-translate: true -->
# Otimizando imagens {#optimizing-images}

Imagens são uma grande parte de muitas aplicações e podem ser um grande contribuinte para problemas de performance, incluindo pontuações baixas de [Core Web Vitals](https://web.dev/explore/learn-core-web-vitals).

A otimização de imagens pode ser um tema complexo, mas o Angular cuida da maior parte disso para você, com a directive `NgOptimizedImage`.

NOTE: Saiba mais sobre [otimização de imagens com NgOptimizedImage no guia detalhado](/guide/image-optimization).

Nesta atividade, você aprenderá como usar `NgOptimizedImage` para garantir que suas imagens sejam carregadas de forma eficiente.

<hr>

<docs-workflow>

<docs-step title="Importe a directive NgOptimizedImage">

Para usar a directive `NgOptimizedImage`, primeiro importe-a da biblioteca `@angular/common` e adicione-a ao array `imports` do component.

```ts
import { NgOptimizedImage } from '@angular/common';

@Component({
  imports: [NgOptimizedImage],
  ...
})
```

</docs-step>

<docs-step title="Atualize o atributo src para ser ngSrc">

Para habilitar a directive `NgOptimizedImage`, troque o atributo `src` por `ngSrc`. Isso se aplica tanto a fontes de imagem estáticas (ou seja, `src`) quanto a fontes de imagem dinâmicas (ou seja, `[src]`).

```angular-ts {highlight:[[7],[11]]}
import { NgOptimizedImage } from '@angular/common';

@Component({
template: `     ...
    <li>
      Static Image:
      <img ngSrc="/logo.svg" alt="Angular logo" width="32" height="32" />
    </li>
    <li>
      Dynamic Image:
      <img [ngSrc]="logoUrl" [alt]="logoAlt" width="32" height="32" />
    </li>
    ...
  `,
imports: [NgOptimizedImage],
})
```

</docs-step>

<docs-step title="Adicione atributos de width e height">

Observe que, no exemplo de código acima, cada imagem tem os atributos `width` e `height`. Para evitar o [layout shift](https://web.dev/articles/cls), a directive `NgOptimizedImage` exige os dois atributos de tamanho em cada imagem.

Em situações em que você não pode ou não quer especificar um `height` e `width` estáticos para as imagens, pode usar [o atributo `fill`](/guide/image-optimization#using-fill-mode) para fazer a imagem agir como uma "imagem de fundo", preenchendo o elemento que a contém:

```angular-html
// Container div has 'position: "relative"'
<div class="image-container">
  <img ngSrc="www.example.com/image.png" fill />
</div>
```

NOTE: Para que a imagem `fill` seja renderizada corretamente, seu elemento pai deve ter estilo `position: "relative"`, `position: "fixed"` ou `position: "absolute"`.

</docs-step>

<docs-step title="Priorize imagens importantes">

Uma das otimizações mais importantes para a performance de carregamento é priorizar qualquer imagem que possa ser o ["elemento LCP"](https://web.dev/articles/optimize-lcp), que é o maior elemento gráfico visível na tela quando a página carrega. Para otimizar seus tempos de carregamento, certifique-se de adicionar o atributo `priority` à sua "imagem principal" ou a quaisquer outras imagens que você acredite poderem ser um elemento LCP.

```ts
<img ngSrc="www.example.com/image.png" height="600" width="800" priority />
```

</docs-step>

<docs-step title="Opcional: use um image loader">

`NgOptimizedImage` permite que você especifique um [image loader](guide/image-optimization#configuring-an-image-loader-for-ngoptimizedimage), que diz à directive como formatar as URLs das suas imagens. Usar um loader permite que você defina suas imagens com URLs curtas e relativas:

```ts
providers: [provideImgixLoader('https://my.base.url/')],
```

A URL final será 'https://my.base.url/image.png'

```angular-html
<img ngSrc="image.png" height="600" width="800" />
```

Image loaders são mais do que apenas conveniência: eles permitem que você use todas as capacidades do `NgOptimizedImage`. Saiba mais sobre essas otimizações e sobre os loaders integrados para CDNs populares [aqui](guide/image-optimization#configuring-an-image-loader-for-ngoptimizedimage).

</docs-step>

</docs-workflow>

Ao adicionar esta directive ao seu fluxo de trabalho, suas imagens agora são carregadas seguindo as melhores práticas, com a ajuda do Angular 🎉

Se quiser aprender mais, confira a [documentação do `NgOptimizedImage`](guide/image-optimization). Continue com o ótimo trabalho e vamos aprender sobre routing a seguir.
