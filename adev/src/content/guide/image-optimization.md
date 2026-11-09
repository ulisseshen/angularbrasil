<!-- ia-translate: true -->

# Começando com NgOptimizedImage {#getting-started-with-ngoptimizedimage}

A directive `NgOptimizedImage` facilita a adoção de boas práticas de performance para carregamento de imagens.

A directive garante que o carregamento da imagem [Largest Contentful Paint (LCP)](http://web.dev/lcp) seja priorizado ao:

- Configurar automaticamente o atributo `fetchpriority` na tag `<img>`
- Fazer lazy loading de outras imagens por padrão
- Gerar automaticamente uma tag de link preconnect no head do documento
- Gerar automaticamente um atributo `srcset`
- Gerar uma [dica de preload](https://developer.mozilla.org/docs/Web/HTML/Link_types/preload) se a aplicação estiver usando SSR

Além de otimizar o carregamento da imagem LCP, `NgOptimizedImage` aplica várias boas práticas de imagem, tais como:

- Usar [URLs de CDN de imagem para aplicar otimizações de imagem](https://web.dev/image-cdns/#how-image-cdns-use-urls-to-indicate-optimization-options)
- Prevenir layout shift ao exigir `width` e `height`
- Avisar se `width` ou `height` foram configurados incorretamente
- Avisar se a imagem será visualmente distorcida quando renderizada

Se você estiver usando uma imagem de background em CSS, [comece aqui](#how-to-migrate-your-background-image).

NOTE: Embora a directive `NgOptimizedImage` tenha se tornado uma funcionalidade estável na versão 15 do Angular, ela foi backportada e está disponível como funcionalidade estável nas versões 13.4.0 e 14.3.0 também.

## Começando {#getting-started}

<docs-workflow>
<docs-step title="Importar a directive `NgOptimizedImage`">
Importe a directive `NgOptimizedImage` de `@angular/common`:

```ts
import {NgOptimizedImage} from '@angular/common';
```

e inclua-a no array `imports` de um component standalone ou de um NgModule:

```ts
imports: [
  NgOptimizedImage,
  // ...
],
```

</docs-step>
<docs-step title="(Opcional) Configurar um Loader {#optional-set-up-a-loader}">
Um image loader **não é obrigatório** para usar NgOptimizedImage, mas usar um com uma CDN de imagem habilita funcionalidades poderosas de performance, incluindo `srcset`s automáticos para suas imagens.

Um guia breve para configurar um loader pode ser encontrado na seção [Configurando um image loader](#configuring-an-image-loader-for-ngoptimizedimage) no final desta página.
</docs-step>
<docs-step title="Ativar a directive">
Para ativar a directive `NgOptimizedImage`, substitua o atributo `src` da sua imagem por `ngSrc`.

```html
<img ngSrc="cat.jpg" />
```

Se você estiver usando um [loader nativo de terceiros](#built-in-loaders), certifique-se de omitir o caminho da URL base do `src`, pois ele será adicionado automaticamente pelo loader.
</docs-step>
<docs-step title="Marcar imagens como `priority`">
Sempre marque a [imagem LCP](https://web.dev/lcp/#what-elements-are-considered) na sua página como `priority` para priorizar o carregamento dela.

```html
<img ngSrc="cat.jpg" width="400" height="200" priority />
```

Marcar uma imagem como `priority` aplica as seguintes otimizações:

- Define `fetchpriority=high` (leia mais sobre priority hints [aqui](https://web.dev/priority-hints))
- Define `loading=eager` (leia mais sobre lazy loading nativo [aqui](https://web.dev/browser-level-image-lazy-loading))
- Gera automaticamente um [elemento de link preload](https://developer.mozilla.org/docs/Web/HTML/Link_types/preload) se estiver [renderizando no servidor](guide/ssr).

O Angular exibe um aviso durante o desenvolvimento se o elemento LCP é uma imagem que não tem o atributo `priority`. O elemento LCP de uma página pode variar com base em vários fatores, como as dimensões da tela do usuário, então uma página pode ter múltiplas imagens que devem ser marcadas como `priority`. Veja [CSS for Web Vitals](https://web.dev/css-web-vitals/#images-and-largest-contentful-paint-lcp) para mais detalhes.
</docs-step>
<docs-step title="Incluir Width e Height">
Para prevenir [layout shifts relacionados a imagens](https://web.dev/css-web-vitals/#images-and-layout-shifts), NgOptimizedImage requer que você especifique altura e largura para sua imagem, da seguinte forma:

```html
<img ngSrc="cat.jpg" width="400" height="200" />
```

Para **imagens responsivas** (imagens que você estilizou para crescer e diminuir em relação ao viewport), os atributos `width` e `height` devem ser o tamanho intrínseco do arquivo de imagem. Para imagens responsivas também é importante [definir um valor para `sizes`.](#responsive-images)

Para **imagens de tamanho fixo**, os atributos `width` e `height` devem refletir o tamanho de renderização desejado da imagem. A proporção desses atributos deve sempre corresponder à proporção intrínseca da imagem.

NOTE: Se você não souber o tamanho de suas imagens, considere usar o "fill mode" para herdar o tamanho do container pai, conforme descrito abaixo.
</docs-step>
</docs-workflow>

## Usando o modo `fill` {#using-fill-mode}

Nos casos em que você deseja que uma imagem preencha um elemento container, você pode usar o atributo `fill`. Isso é frequentemente útil quando você quer obter um comportamento de "imagem de background". Também pode ser útil quando você não sabe a largura e a altura exatas da sua imagem, mas tem um container pai com um tamanho conhecido no qual gostaria de ajustar sua imagem (veja "object-fit" abaixo).

Quando você adiciona o atributo `fill` à sua imagem, você não precisa e não deve incluir `width` e `height`, como neste exemplo:

```html
<img ngSrc="cat.jpg" fill />
```

Você pode usar a propriedade CSS [object-fit](https://developer.mozilla.org/docs/Web/CSS/object-fit) para mudar como a imagem preencherá seu container. Se você estilizar sua imagem com `object-fit: "contain"`, a imagem manterá sua proporção e será "letterboxed" para caber no elemento. Se você definir `object-fit: "cover"`, o elemento reterá sua proporção, preencherá completamente o elemento, e parte do conteúdo pode ser "cortada".

Veja exemplos visuais do acima na [documentação object-fit do MDN.](https://developer.mozilla.org/docs/Web/CSS/object-fit)

Você também pode estilizar sua imagem com a [propriedade object-position](https://developer.mozilla.org/docs/Web/CSS/object-position) para ajustar sua posição dentro de seu elemento container.

IMPORTANT: Para que a imagem "fill" renderize adequadamente, seu elemento pai **deve** ser estilizado com `position: "relative"`, `position: "fixed"`, ou `position: "absolute"`.

## Como migrar sua imagem de background {#how-to-migrate-your-background-image}

Aqui está um processo simples passo a passo para migrar de `background-image` para `NgOptimizedImage`. Para estes passos, vamos nos referir ao elemento que tem uma imagem de background como o "elemento container":

1. Remova o estilo `background-image` do elemento container.
2. Certifique-se de que o elemento container tem `position: "relative"`, `position: "fixed"`, ou `position: "absolute"`.
3. Crie um novo elemento de imagem como filho do elemento container, usando `ngSrc` para habilitar a directive `NgOptimizedImage`.
4. Dê a esse elemento o atributo `fill`. Não inclua `height` e `width`.
5. Se você acredita que esta imagem pode ser seu [elemento LCP](https://web.dev/lcp/), adicione o atributo `priority` ao elemento de imagem.

Você pode ajustar como a imagem de background preenche o container conforme descrito na seção [Usando o modo fill](#using-fill-mode).

## Usando placeholders {#using-placeholders}

### Placeholders automáticos {#automatic-placeholders}

NgOptimizedImage pode exibir um placeholder automático de baixa resolução para sua imagem se você estiver usando uma CDN ou host de imagem que fornece redimensionamento automático de imagem. Aproveite esse recurso adicionando o atributo `placeholder` à sua imagem:

```html
<img ngSrc="cat.jpg" width="400" height="200" placeholder />
```

Adicionar este atributo solicita automaticamente uma segunda versão menor da imagem usando o seu image loader especificado. Esta imagem pequena será aplicada como um estilo `background-image` com um blur CSS enquanto sua imagem carrega. Se nenhum image loader for fornecido, nenhuma imagem placeholder pode ser gerada e um erro será lançado.

O tamanho padrão para placeholders gerados é 30px de largura. Você pode mudar este tamanho especificando um valor em pixels no provider `IMAGE_CONFIG`, conforme visto abaixo:

```ts
providers: [
  {
    provide: IMAGE_CONFIG,
    useValue: {
      placeholderResolution: 40
    }
  },
],
```

Se você quiser bordas nítidas ao redor do seu placeholder desfocado, pode envolver sua imagem em uma `<div>` container com o estilo `overflow: hidden`. Desde que a `<div>` tenha o mesmo tamanho da imagem (como usando o estilo `width: fit-content`), as "bordas difusas" do placeholder ficarão ocultas.

### Placeholders de Data URL {#data-url-placeholders}

Você também pode especificar um placeholder usando uma [data URL](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URLs) base64 sem um image loader. O formato da data URL é `data:image/[imagetype];[data]`, onde `[imagetype]` é o formato da imagem, como `png`, e `[data]` é uma codificação base64 da imagem. Essa codificação pode ser feita usando a linha de comando ou em JavaScript. Para comandos específicos, veja [a documentação do MDN](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URLs#encoding_data_into_base64_format). Um exemplo de um placeholder de data URL com dados truncados é mostrado abaixo:

```html
<img ngSrc="cat.jpg" width="400" height="200" placeholder="data:image/png;base64,iVBORw0K..." />
```

No entanto, data URLs grandes aumentam o tamanho dos seus bundles Angular e deixam o carregamento da página mais lento. Se você não puder usar um image loader, o time do Angular recomenda manter imagens placeholder em base64 menores que 4KB e usá-las exclusivamente em imagens críticas. Além de diminuir as dimensões do placeholder, considere mudar os formatos de imagem ou os parâmetros usados ao salvar imagens. Em resoluções muito baixas, esses parâmetros podem ter um grande efeito no tamanho do arquivo.

### Placeholders sem blur {#non-blurred-placeholders}

Por padrão, NgOptimizedImage aplica um efeito de blur CSS aos placeholders de imagem. Para renderizar um placeholder sem blur, forneça um argumento `placeholderConfig` com um objeto que inclui a propriedade `blur`, definida como false. Por exemplo:

```html
<img ngSrc="cat.jpg" width="400" height="200" placeholder [placeholderConfig]="{blur: false}" />
```

## Ajustando a estilização da imagem {#adjusting-image-styling}

Dependendo da estilização da imagem, adicionar os atributos `width` e `height` pode fazer com que a imagem seja renderizada de forma diferente. `NgOptimizedImage` avisa você se a estilização da sua imagem renderiza a imagem com uma proporção distorcida.

Você normalmente pode corrigir isso adicionando `height: auto` ou `width: auto` aos estilos da sua imagem. Para mais informações, veja o [artigo do web.dev sobre a tag `<img>`](https://web.dev/patterns/web-vitals-patterns/images/img-tag).

Se os atributos `width` e `height` na imagem estiverem impedindo você de dimensionar a imagem da forma que deseja com CSS, considere usar o modo `fill` no lugar, e estilizar o elemento pai da imagem.

## Funcionalidades de performance {#performance-features}

NgOptimizedImage inclui várias funcionalidades projetadas para melhorar a performance de carregamento na sua aplicação. Essas funcionalidades são descritas nesta seção.

### Adicionar resource hints {#add-resource-hints}

Uma [resource hint `preconnect`](https://web.dev/preconnect-and-dns-prefetch) para a origem da sua imagem garante que a imagem LCP carregue o mais rápido possível.

Links preconnect são gerados automaticamente para domínios fornecidos como argumento para um [loader](#optional-set-up-a-loader). Se uma origem de imagem não puder ser identificada automaticamente, e nenhum link preconnect for detectado para a imagem LCP, `NgOptimizedImage` avisará durante o desenvolvimento. Nesse caso, você deve adicionar manualmente uma resource hint ao `index.html`. Dentro do `<head>` do documento, adicione uma tag `link` com `rel="preconnect"`, como mostrado abaixo:

```html
<link rel="preconnect" href="https://my.cdn.origin" />
```

Para desabilitar os avisos de preconnect, injete o token `PRECONNECT_CHECK_BLOCKLIST`:

```ts

providers: [
{provide: PRECONNECT_CHECK_BLOCKLIST, useValue: 'https://your-domain.com'}
],

```

Veja mais informações sobre a geração automática de preconnect [aqui](#why-is-a-preconnect-element-not-being-generated-for-my-image-domain).

### Solicitar imagens no tamanho correto com `srcset` automático {#request-images-at-the-correct-size-with-automatic-srcset}

Definir um [atributo `srcset`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/srcset) garante que o browser solicite uma imagem no tamanho certo para o viewport do seu usuário, então ele não perde tempo baixando uma imagem que é muito grande. `NgOptimizedImage` gera um `srcset` apropriado para a imagem, com base na presença e no valor do [atributo `sizes`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/sizes) na tag de imagem.

#### Imagens de tamanho fixo {#fixed-size-images}

Se sua imagem deve ter tamanho "fixo" (ou seja, o mesmo tamanho em todos os dispositivos, exceto pela [densidade de pixels](https://web.dev/codelab-density-descriptors/)), não há necessidade de definir um atributo `sizes`. Um `srcset` pode ser gerado automaticamente a partir dos atributos width e height da imagem, sem nenhuma entrada adicional.

Exemplo de srcset gerado:

```html
<img ... srcset="image-400w.jpg 1x, image-800w.jpg 2x" />
```

#### Imagens responsivas {#responsive-images}

Se sua imagem deve ser responsiva (ou seja, crescer e diminuir de acordo com o tamanho do viewport), então você precisará definir um [atributo `sizes`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/sizes) para gerar o `srcset`.

Se você não usou `sizes` antes, um bom lugar para começar é defini-lo com base na largura do viewport. Por exemplo, se seu CSS faz com que a imagem preencha 100% da largura do viewport, defina `sizes` como `100vw` e o browser selecionará a imagem no `srcset` que está mais próxima da largura do viewport (depois de considerar a densidade de pixels). Se sua imagem provavelmente ocupará apenas metade da tela (ex: em uma sidebar), defina `sizes` como `50vw` para garantir que o browser selecione uma imagem menor. E assim por diante.

Se você achar que o acima não cobre o comportamento desejado da sua imagem, veja a documentação sobre [valores avançados de sizes](#advanced-sizes-values).

Note que, para imagens com lazy loading, `NgOptimizedImage` adiciona automaticamente `"auto"` ao início do valor de `sizes` fornecido. Esta é uma otimização que aumenta a precisão da seleção do srcset em browsers que suportam `sizes="auto"`, e é ignorada por browsers que não suportam. Imagens que não usam lazy loading, como as imagens `priority`, mantêm o valor de `sizes` como fornecido.

Por padrão, os breakpoints responsivos são:

`[16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840]`

Se você quiser customizar esses breakpoints, pode fazer isso usando o provider `IMAGE_CONFIG`:

```ts
providers: [
  {
    provide: IMAGE_CONFIG,
    useValue: {
      breakpoints: [16, 48, 96, 128, 384, 640, 750, 828, 1080, 1200, 1920]
    }
  },
],
```

Se você quiser definir manualmente um atributo `srcset`, pode fornecer o seu próprio usando o atributo `ngSrcset`:

```html
<img ngSrc="hero.jpg" ngSrcset="100w, 200w, 300w" />
```

Se o atributo `ngSrcset` estiver presente, `NgOptimizedImage` gera e define o `srcset` com base nos tamanhos incluídos. Não inclua nomes de arquivo de imagem no `ngSrcset` - a directive infere essa informação do `ngSrc`. A directive suporta tanto descritores de largura (ex: `100w`) quanto descritores de densidade (ex: `1x`).

```html
<img ngSrc="hero.jpg" ngSrcset="100w, 200w, 300w" sizes="50vw" />
```

### Desabilitando a geração automática de srcset {#disabling-automatic-srcset-generation}

Para desabilitar a geração de srcset para uma única imagem, você pode adicionar o atributo `disableOptimizedSrcset` na imagem:

```html
<img ngSrc="about.jpg" disableOptimizedSrcset />
```

### Desabilitando lazy loading de imagem {#disabling-image-lazy-loading}

Por padrão, `NgOptimizedImage` define `loading=lazy` para todas as imagens que não estão marcadas como `priority`. Você pode desabilitar esse comportamento para imagens não-priority definindo o atributo `loading`. Este atributo aceita os valores `eager`, `auto` e `lazy`. [Veja a documentação do atributo `loading` padrão de imagem para detalhes](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/loading#value).

```html
<img ngSrc="cat.jpg" width="400" height="200" loading="eager" />
```

### Controlando a decodificação da imagem {#controlling-image-decoding}

Por padrão, `NgOptimizedImage` define `decoding="auto"` para todas as imagens. Isso permite que o browser decida o momento ideal para decodificar uma imagem depois que ela foi baixada. Quando uma imagem é marcada como `priority`, o Angular define automaticamente `decoding="sync"` para garantir que a imagem seja decodificada e pintada o mais cedo possível, ajudando a melhorar a performance de **Largest Contentful Paint (LCP)**.

Você pode sobrescrever o padrão `auto` para imagens não-priority definindo explicitamente o atributo `decoding`. Imagens priority sempre usam `decoding="sync"`.
[Veja a documentação do atributo `decoding` padrão de imagem para detalhes](https://developer.mozilla.org/docs/Web/HTML/Element/img#decoding).

```html
<!-- Padrão: decoding é 'auto' -->
<img ngSrc="gallery/landscape.jpg" width="1200" height="800" />

<!-- Decodificar a imagem de forma assíncrona para evitar bloquear a thread principal. -->
<img ngSrc="gallery/preview.jpg" width="600" height="400" decoding="async" />

<!-- Imagens priority usam automaticamente decoding="sync" -->
<img ngSrc="awesome.jpg" width="500" height="625" priority />

<!-- Decodificar imediatamente (pode bloquear) quando você precisa dos pixels de imediato -->
<img ngSrc="hero.jpg" width="1600" height="900" decoding="sync" />
```

**Valores permitidos**

- `auto` (padrão): deixa o browser escolher a estratégia ideal.
- `async`: decodifica a imagem de forma assíncrona, evitando o bloqueio da thread principal sempre que possível.
- `sync`: decodifica a imagem imediatamente; pode bloquear a renderização, mas garante que os pixels estejam prontos assim que a imagem estiver disponível.

### Valores avançados de 'sizes' {#advanced-sizes-values}

Você pode querer exibir imagens em larguras variadas em telas de tamanhos diferentes. Um exemplo comum desse padrão é um layout baseado em grid ou colunas que renderiza uma única coluna em dispositivos móveis e duas colunas em dispositivos maiores. Você pode capturar esse comportamento no atributo `sizes`, usando uma sintaxe de "media query", como a seguinte:

```html
<img ngSrc="cat.jpg" width="400" height="200" sizes="(max-width: 768px) 100vw, 50vw" />
```

O atributo `sizes` no exemplo acima diz "Eu espero que esta imagem tenha 100 por cento da largura da tela em dispositivos com menos de 768px de largura. Caso contrário, espero que ela tenha 50 por cento da largura da tela.

Para informações adicionais sobre o atributo `sizes`, veja [web.dev](https://web.dev/learn/design/responsive-images/#sizes) ou [mdn](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/sizes).

## Configurando um image loader para `NgOptimizedImage` {#configuring-an-image-loader-for-ngoptimizedimage}

Um "loader" é uma função que gera uma [URL de transformação de imagem](https://web.dev/image-cdns/#how-image-cdns-use-urls-to-indicate-optimization-options) para um determinado arquivo de imagem. Quando apropriado, `NgOptimizedImage` define o tamanho, o formato e as transformações de qualidade da imagem.

`NgOptimizedImage` fornece tanto um loader genérico que não aplica transformações, quanto loaders para vários serviços de imagem de terceiros. Ele também suporta a escrita do seu próprio loader customizado.

| Tipo de loader                               | Comportamento                                                                                                                                                                                                                                                 |
| :------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Loader genérico                              | A URL retornada pelo loader genérico sempre corresponderá ao valor de `src`. Em outras palavras, este loader não aplica transformações. Sites que usam Angular para servir imagens são o principal caso de uso pretendido para este loader.             |
| Loaders para serviços de imagem de terceiros | A URL retornada pelos loaders para serviços de imagem de terceiros seguirá as convenções de API usadas por aquele serviço de imagem específico.                                                                                                              |
| Loaders customizados                         | O comportamento de um loader customizado é definido pelo seu desenvolvedor. Você deve usar um loader customizado se o seu serviço de imagem não for suportado pelos loaders que vêm pré-configurados com `NgOptimizedImage`.                                 |

Com base nos serviços de imagem comumente usados com aplicações Angular, `NgOptimizedImage` fornece loaders pré-configurados para trabalhar com os seguintes serviços de imagem:

| Serviço de Imagem         | API Angular               | Documentação                                                                |
| :------------------------ | :------------------------ | :-------------------------------------------------------------------------- |
| Cloudflare Image Resizing | `provideCloudflareLoader` | [Documentação](https://developers.cloudflare.com/images/image-resizing/)    |
| Cloudinary                | `provideCloudinaryLoader` | [Documentação](https://cloudinary.com/documentation/resizing_and_cropping)  |
| ImageKit                  | `provideImageKitLoader`   | [Documentação](https://docs.imagekit.io/)                                   |
| Imgix                     | `provideImgixLoader`      | [Documentação](https://docs.imgix.com/)                                     |
| Netlify                   | `provideNetlifyLoader`    | [Documentação](https://docs.netlify.com/image-cdn/overview/)                |

Para usar o **loader genérico**, nenhuma alteração adicional de código é necessária. Este é o comportamento padrão.

### Loaders nativos {#built-in-loaders}

Para usar um loader existente para um **serviço de imagem de terceiros**, adicione a factory do provider do serviço escolhido ao array `providers`. No exemplo abaixo, o loader Imgix é usado:

```ts
providers: [
  provideImgixLoader('https://my.base.url/'),
],
```

A URL base dos seus assets de imagem deve ser passada para a factory do provider como argumento. Para a maioria dos sites, esta URL base deve corresponder a um dos seguintes padrões:

- <https://yoursite.yourcdn.com>
- <https://subdomain.yoursite.com>
- <https://subdomain.yourcdn.com/yoursite>

Você pode aprender mais sobre a estrutura da URL base na documentação de um provider de CDN correspondente.

### Loaders customizados {#custom-loaders}

Para usar um **loader customizado**, forneça sua função de loader como valor do token DI `IMAGE_LOADER`. No exemplo abaixo, a função de loader customizado retorna uma URL começando com `https://example.com` que inclui `src`, `width` e `height` como parâmetros de URL.

```ts
providers: [
  {
    provide: IMAGE_LOADER,
    useValue: (config: ImageLoaderConfig) => {
      return `https://example.com/images?src=${config.src}&width=${config.width}&height=${config.height}`;
    },
  },
],
```

Uma função de loader para a directive `NgOptimizedImage` recebe um objeto do tipo `ImageLoaderConfig` (de `@angular/common`) como argumento e retorna a URL absoluta do asset de imagem. O objeto `ImageLoaderConfig` contém a propriedade `src` e as propriedades opcionais `width`, `height` e `loaderParams`.

NOTE: mesmo que a propriedade `width` nem sempre esteja presente, um loader customizado deve usá-la para suportar a solicitação de imagens em várias larguras para que `ngSrcset` funcione corretamente.

### A propriedade `loaderParams` {#the-loaderparams-property}

Há um atributo adicional suportado pela directive `NgOptimizedImage`, chamado `loaderParams`, que é especificamente projetado para suportar o uso de loaders customizados. O atributo `loaderParams` recebe um objeto com quaisquer propriedades como valor e não faz nada por conta própria. Os dados em `loaderParams` são adicionados ao objeto `ImageLoaderConfig` passado para o seu loader customizado, e podem ser usados para controlar o comportamento do loader.

Um uso comum para `loaderParams` é controlar funcionalidades avançadas de CDN de imagem.

### Usando a propriedade `transform` com loaders nativos {#using-the-transform-property-with-built-in-loaders}

Os loaders nativos para Cloudinary, Cloudflare, ImageKit e Imgix suportam uma propriedade especial `transform` dentro de `loaderParams`. Essa propriedade permite aplicar transformações de imagem personalizadas fornecidas pelo seu CDN.

A propriedade `transform` aceita dois formatos:

#### Formato de string {#string-format}

Forneça as transformações como uma string separada por vírgulas, usando a sintaxe de transformação do seu CDN:

```html
<img
  ngSrc="my-image.jpg"
  width="400"
  height="300"
  [loaderParams]="{transform: 'e_grayscale,r_10'}"
/>
```

#### Formato de objeto {#object-format}

Forneça as transformações como um objeto com pares chave-valor.

```html
<img
  ngSrc="my-image.jpg"
  width="400"
  height="300"
  [loaderParams]="{transform: {e: 'grayscale', r: 10}}"
/>
```

NOTE: A propriedade `transform` não é suportada pelo loader da Netlify, pois o CDN de imagens da Netlify não oferece parâmetros de transformação customizados.

### Exemplo de loader customizado {#example-custom-loader}

A seguir, um exemplo de uma função de loader customizado. Esta função de exemplo concatena `src`, `width` e `height`, e usa `loaderParams` para controlar um recurso customizado de CDN para cantos arredondados:

```ts
const myCustomLoader = (config: ImageLoaderConfig) => {
  let url = `https://example.com/images/${config.src}?`;
  let queryParams = [];
  if (config.width) {
    queryParams.push(`w=${config.width}`);
  }
  if (config.height) {
    queryParams.push(`h=${config.height}`);
  }
  if (config.loaderParams?.roundedCorners) {
    queryParams.push('mask=corners&corner-radius=5');
  }
  return url + queryParams.join('&');
};
```

Note que, no exemplo acima, inventamos o nome de propriedade 'roundedCorners' para controlar um recurso do nosso loader customizado. Poderíamos então usar esse recurso ao criar uma imagem, da seguinte forma:

```html
<img ngSrc="profile.jpg" width="300" height="300" [loaderParams]="{roundedCorners: true}" />
```

## Perguntas frequentes {#frequently-asked-questions}

### O NgOptimizedImage suporta a propriedade css `background-image`? {#does-ngoptimizedimage-support-the-background-image-css-property}

O NgOptimizedImage não suporta diretamente a propriedade css `background-image`, mas é projetado para acomodar facilmente o caso de uso de ter uma imagem como background de outro elemento.

Para um processo passo a passo de migração de `background-image` para `NgOptimizedImage`, veja a seção [Como migrar sua imagem de background](#how-to-migrate-your-background-image) acima.

### Por que não posso usar `src` com `NgOptimizedImage`? {#why-cant-i-use-src-with-ngoptimizedimage}

O atributo `ngSrc` foi escolhido como gatilho para o NgOptimizedImage devido a considerações técnicas sobre como imagens são carregadas pelo browser. O NgOptimizedImage faz mudanças programáticas no atributo `loading` -- se o browser vir o atributo `src` antes que essas mudanças sejam feitas, ele começará a baixar a imagem avidamente, e as mudanças de carregamento serão ignoradas.

### Por que um elemento preconnect não está sendo gerado para meu domínio de imagem? {#why-is-a-preconnect-element-not-being-generated-for-my-image-domain}

A geração de preconnect é realizada com base em análise estática da sua aplicação. Isso significa que o domínio da imagem deve estar diretamente incluído no parâmetro do loader, como no seguinte exemplo:

```ts
providers: [
  provideImgixLoader('https://my.base.url/'),
],
```

Se você usar uma variável para passar a string de domínio para o loader, ou não estiver usando um loader, a análise estática não será capaz de identificar o domínio, e nenhum link preconnect será gerado. Neste caso, você deve adicionar manualmente um link preconnect ao head do documento, como [descrito acima](#add-resource-hints).

### Posso usar dois domínios de imagem diferentes na mesma página? {#can-i-use-two-different-image-domains-in-the-same-page}

O padrão de provider de [image loaders](#configuring-an-image-loader-for-ngoptimizedimage) é projetado para ser o mais simples possível para o caso de uso comum de ter apenas uma única CDN de imagem usada dentro de um component. No entanto, ainda é totalmente possível gerenciar múltiplas CDNs de imagem usando um único provider.

Para isso, recomendamos escrever um [loader de imagem customizado](#custom-loaders) que use a [propriedade `loaderParams`](#the-loaderparams-property) para passar uma flag que especifica qual CDN de imagem deve ser usada, e então invoque o loader apropriado com base nessa flag.

### Vocês podem adicionar um novo loader nativo para minha CDN preferida? {#can-you-add-a-new-built-in-loader-for-my-preferred-cdn}

Por razões de manutenção, atualmente não planejamos suportar loaders nativos adicionais no repositório do Angular. Em vez disso, encorajamos os desenvolvedores a publicar quaisquer loaders de imagem adicionais como pacotes de terceiros.

### Posso usar isso com a tag `<picture>` {#can-i-use-this-with-the-picture-tag}

Não, mas isso está no nosso roadmap, então fique ligado.

Se você estiver esperando por essa funcionalidade, por favor vote positivamente na issue do GitHub [aqui](https://github.com/angular/angular/issues/56594).

### Como encontro minha imagem LCP com o Chrome DevTools? {#how-do-i-find-my-lcp-image-with-chrome-devtools}

1. Usando a aba performance do Chrome DevTools, clique no botão "start profiling and reload page" no canto superior esquerdo. Ele se parece com um ícone de atualização de página.

2. Isso acionará um snapshot de profiling da sua aplicação Angular.

3. Quando o resultado do profiling estiver disponível, selecione "LCP" na seção de timings.

4. Uma entrada de resumo deve aparecer no painel na parte inferior. Você pode encontrar o elemento LCP na linha de "related node". Clicar nele revelará o elemento no painel Elements.

<img alt="LCP no Chrome DevTools" src="assets/images/guide/image-optimization/devtools-lcp.png">

NOTE: Isso apenas identifica o elemento LCP dentro do viewport da página que você está testando. Também é recomendado usar emulação mobile para identificar o elemento LCP em telas menores.
