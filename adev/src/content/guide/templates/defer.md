<!-- ia-translate: true -->
# Carregamento diferido com `@defer`

Views diferíveis, também conhecidas como blocos `@defer`, reduzem o tamanho do bundle inicial da sua aplicação adiando o carregamento de código que não é estritamente necessário para a renderização inicial de uma página. Isso frequentemente resulta em um carregamento inicial mais rápido e melhoria nos Core Web Vitals (CWV), principalmente Largest Contentful Paint (LCP) e Time to First Byte (TTFB).

Para usar este recurso, você pode declarativamente envolver uma seção do seu template em um bloco @defer:

```angular-html
@defer {
  <large-component />
}
```

O código para quaisquer components, directives e pipes dentro do bloco `@defer` é dividido em um arquivo JavaScript separado e carregado apenas quando necessário, após o resto do template ter sido renderizado.

Views diferíveis suportam uma variedade de triggers, opções de prefetching e sub-blocos para gerenciamento de estado de placeholder, loading e error.

## Quais dependências são diferidas?

Components, directives, pipes e quaisquer estilos CSS de components podem ser diferidos ao carregar uma aplicação.

Para que as dependências dentro de um bloco `@defer` sejam diferidas, elas precisam atender duas condições:

1. **Elas devem ser standalone.** Dependências não-standalone não podem ser diferidas e ainda são carregadas eagerly, mesmo se estiverem dentro de blocos `@defer`.
1. **Elas não podem ser referenciadas fora de blocos `@defer` dentro do mesmo arquivo.** Se elas forem referenciadas fora do bloco `@defer` ou referenciadas dentro de queries ViewChild, as dependências serão carregadas eagerly.

As dependências _transitivas_ dos components, directives e pipes usados no bloco `@defer` não precisam estritamente ser standalone; dependências transitivas ainda podem ser declaradas em um `NgModule` e participar do carregamento diferido.

O compilador do Angular produz uma instrução [dynamic import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) para cada component, directive e pipe usado no bloco `@defer`. O conteúdo principal do bloco renderiza após todos os imports serem resolvidos. O Angular não garante nenhuma ordem específica para esses imports.

## Como gerenciar diferentes estágios do carregamento diferido

Blocos `@defer` têm vários sub-blocos para permitir que você gerencie graciosamente diferentes estágios no processo de carregamento diferido.

### `@defer`

Este é o bloco primário que define a seção de conteúdo que é carregada lazily. Ele não é renderizado inicialmente– o conteúdo diferido carrega e renderiza uma vez que o [trigger](/guide/templates/defer#triggers) especificado ocorre ou a condição `when` é atendida.

Por padrão, um bloco `@defer` é acionado quando o estado do navegador se torna [idle](/guide/templates/defer#idle).

```angular-html
@defer {
  <large-component />
}
```

### Mostrar conteúdo de placeholder com `@placeholder`

Por padrão, blocos defer não renderizam nenhum conteúdo antes de serem acionados.

O `@placeholder` é um bloco opcional que declara qual conteúdo mostrar antes que o bloco `@defer` seja acionado.

```angular-html
@defer {
  <large-component />
} @placeholder {
  <p>Placeholder content</p>
}
```

Embora opcional, certos triggers podem exigir a presença de um `@placeholder` ou uma [template reference variable](/guide/templates/variables#template-reference-variables) para funcionar. Veja a seção [Triggers](/guide/templates/defer#triggers) para mais detalhes.

O Angular substitui o conteúdo do placeholder pelo conteúdo principal uma vez que o carregamento está completo. Você pode usar qualquer conteúdo na seção de placeholder incluindo HTML simples, components, directives e pipes. Tenha em mente que as _dependências do bloco placeholder são carregadas eagerly_.

O bloco `@placeholder` aceita um parâmetro opcional para especificar a quantidade `minimum` de tempo que este placeholder deve ser mostrado após o conteúdo do placeholder renderizar inicialmente.

```angular-html
@defer {
  <large-component />
} @placeholder (minimum 500ms) {
  <p>Placeholder content</p>
}
```

Este parâmetro `minimum` é especificado em incrementos de tempo de milissegundos (ms) ou segundos (s). Você pode usar este parâmetro para prevenir flickering rápido do conteúdo do placeholder no caso das dependências diferidas serem buscadas rapidamente.

### Mostrar conteúdo de loading com `@loading`

O bloco `@loading` é um bloco opcional que permite que você declare conteúdo que é mostrado enquanto as dependências diferidas estão carregando. Ele substitui o bloco `@placeholder` uma vez que o carregamento é acionado.

```angular-html
@defer {
  <large-component />
} @loading {
  <img alt="loading..." src="loading.gif" />
} @placeholder {
  <p>Placeholder content</p>
}
```

Suas dependências são carregadas eagerly (similar ao `@placeholder`).

O bloco `@loading` aceita dois parâmetros opcionais para ajudar a prevenir flickering rápido de conteúdo que pode ocorrer quando dependências diferidas são buscadas rapidamente:

- `minimum` - a quantidade mínima de tempo que este placeholder deve ser mostrado
- `after` - a quantidade de tempo para esperar após o início do carregamento antes de mostrar o template de loading

```angular-html
@defer {
  <large-component />
} @loading (after 100ms; minimum 1s) {
  <img alt="loading..." src="loading.gif" />
}
```

Ambos os parâmetros são especificados em incrementos de tempo de milissegundos (ms) ou segundos (s). Além disso, os temporizadores para ambos os parâmetros começam imediatamente após o carregamento ter sido acionado.

### Mostrar estado de erro quando o carregamento diferido falha com `@error`

O bloco `@error` é um bloco opcional que exibe se o carregamento diferido falhar. Similar ao `@placeholder` e `@loading`, as dependências do bloco @error são carregadas eagerly.

```angular-html
@defer {
  <large-component />
} @error {
  <p>Failed to load large component.</p>
}
```

## Controlando o carregamento de conteúdo diferido com triggers

Você pode especificar **triggers** que controlam quando o Angular carrega e exibe conteúdo diferido.

Quando um bloco `@defer` é acionado, ele substitui o conteúdo do placeholder pelo conteúdo carregado lazily.

Vários event triggers podem ser definidos separando-os com ponto e vírgula, `;` e serão avaliados como condições OR.

Existem dois tipos de triggers: `on` e `when`.

### `on`

`on` especifica uma condição para quando o bloco `@defer` é acionado.

Os triggers disponíveis são os seguintes:

| Trigger                       | Descrição                                                             |
| ----------------------------- | --------------------------------------------------------------------- |
| [`idle`](#idle)               | Aciona quando o navegador está ocioso.                                |
| [`viewport`](#viewport)       | Aciona quando o conteúdo especificado entra no viewport               |
| [`interaction`](#interaction) | Aciona quando o usuário interage com o elemento especificado          |
| [`hover`](#hover)             | Aciona quando o mouse passa sobre a área especificada                 |
| [`immediate`](#immediate)     | Aciona imediatamente após o conteúdo não diferido ter terminado de renderizar |
| [`timer`](#timer)             | Aciona após uma duração específica                                    |

#### `idle`

O trigger `idle` carrega o conteúdo diferido uma vez que o navegador tenha atingido um estado ocioso, baseado em requestIdleCallback. Este é o comportamento padrão com um bloco defer.

```angular-html
<!-- @defer (on idle) -->
@defer {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

#### `viewport`

O trigger `viewport` carrega o conteúdo diferido quando o conteúdo especificado entra no viewport usando a [Intersection Observer API](https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API). O conteúdo observado pode ser o conteúdo `@placeholder` ou uma referência de elemento explícita.

Por padrão, o `@defer` observa o placeholder entrando no viewport. Placeholders usados desta forma devem ter um único elemento raiz.

```angular-html
@defer (on viewport) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

Alternativamente, você pode especificar uma [template reference variable](/guide/templates/variables) no mesmo template que o bloco `@defer` como o elemento que é observado para entrar no viewport. Esta variável é passada como um parâmetro no trigger viewport.

```angular-html
<div #greeting>Hello!</div>
@defer (on viewport(greeting)) {
  <greetings-cmp />
}
```

Se você quiser customizar as opções do `IntersectionObserver`, o trigger `viewport` suporta passar um objeto literal. O literal suporta todas as propriedades do segundo parâmetro de `IntersectionObserver`, exceto `root`. Ao usar a notação de objeto literal, você tem que passar seu trigger usando a propriedade `trigger`.

```angular-html
<div #greeting>Hello!</div>

<!-- With options and a trigger -->
@defer (on viewport({trigger: greeting, rootMargin: '100px', threshold: 0.5})) {
  <greetings-cmp />
}

<!-- With options and an implied trigger -->
@defer (on viewport({rootMargin: '100px', threshold: 0.5})) {
  <greetings-cmp />
} @placeholder {
  <div>Implied trigger</div>
}
```

#### `interaction`

O trigger `interaction` carrega o conteúdo diferido quando o usuário interage com o elemento especificado através de eventos `click` ou `keydown`.

Por padrão, o placeholder atua como o elemento de interação. Placeholders usados desta forma devem ter um único elemento raiz.

```angular-html
@defer (on interaction) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

Alternativamente, você pode especificar uma [template reference variable](/guide/templates/variables) no mesmo template que o bloco `@defer` como o elemento que é observado para interações. Esta variável é passada como um parâmetro no trigger viewport.

```angular-html
<div #greeting>Hello!</div>
@defer (on interaction(greeting)) {
  <greetings-cmp />
}
```

#### `hover`

O trigger `hover` carrega o conteúdo diferido quando o mouse passou sobre a área acionada através dos eventos `mouseover` e `focusin`.

Por padrão, o placeholder atua como o elemento de interação. Placeholders usados desta forma devem ter um único elemento raiz.

```angular-html
@defer (on hover) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

Alternativamente, você pode especificar uma [template reference variable](/guide/templates/variables) no mesmo template que o bloco `@defer` como o elemento que é observado para entrar no viewport. Esta variável é passada como um parâmetro no trigger viewport.

```angular-html
<div #greeting>Hello!</div>
@defer (on hover(greeting)) {
  <greetings-cmp />
}
```

#### `immediate`

O trigger `immediate` carrega o conteúdo diferido imediatamente. Isso significa que o bloco diferido carrega assim que todo o outro conteúdo não diferido tiver terminado de renderizar.

```angular-html
@defer (on immediate) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

#### `timer`

O trigger `timer` carrega o conteúdo diferido após uma duração especificada.

```angular-html
@defer (on timer(500ms)) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

O parâmetro de duração deve ser especificado em milissegundos (`ms`) ou segundos (`s`).

### `when`

O trigger `when` aceita uma expressão condicional customizada e carrega o conteúdo diferido quando a condição se torna truthy.

```angular-html
@defer (when condition) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

Esta é uma operação única– o bloco `@defer` não reverte de volta para o placeholder se a condição mudar para um valor falsy após se tornar truthy.

## Pré-buscar dados com `prefetch`

Além de especificar uma condição que determina quando o conteúdo diferido é mostrado, você pode opcionalmente especificar um **prefetch trigger**. Este trigger permite que você carregue o JavaScript associado ao bloco `@defer` antes que o conteúdo diferido seja mostrado.

Prefetching habilita comportamentos mais avançados, como permitir que você comece a pré-buscar recursos antes que um usuário tenha realmente visto ou interagido com um bloco defer, mas possa interagir com ele em breve, tornando os recursos disponíveis mais rapidamente.

Você pode especificar um prefetch trigger de forma similar ao trigger principal do bloco, mas prefixado com a palavra-chave `prefetch`. O trigger principal do bloco e o prefetch trigger são separados com um caractere de ponto e vírgula (`;`).

No exemplo abaixo, o prefetching inicia quando um navegador se torna ocioso e o conteúdo do bloco é renderizado apenas uma vez que o usuário interage com o placeholder.

```angular-html
@defer (on interaction; prefetch on idle) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```

## Testando blocos `@defer`

O Angular fornece APIs do TestBed para simplificar o processo de testar blocos `@defer` e acionar diferentes estados durante o teste. Por padrão, blocos `@defer` em testes funcionam como um bloco defer se comportaria em uma aplicação real. Se você quiser percorrer manualmente os estados, pode mudar o comportamento do bloco defer para `Manual` na configuração do TestBed.

```angular-ts
it('should render a defer block in different states', async () => {
  // configures the defer block behavior to start in "paused" state for manual control.
  TestBed.configureTestingModule({deferBlockBehavior: DeferBlockBehavior.Manual});
  @Component({
    // ...
    template: `
      @defer {
        <large-component />
      } @placeholder {
        Placeholder
      } @loading {
        Loading...
      }
    `
  })
  class ComponentA {}
  // Create component fixture.
  const componentFixture = TestBed.createComponent(ComponentA);
  // Retrieve the list of all defer block fixtures and get the first block.
  const deferBlockFixture = (await componentFixture.getDeferBlocks())[0];
  // Renders placeholder state by default.
  expect(componentFixture.nativeElement.innerHTML).toContain('Placeholder');
  // Render loading state and verify rendered output.
  await deferBlockFixture.render(DeferBlockState.Loading);
  expect(componentFixture.nativeElement.innerHTML).toContain('Loading');
  // Render final state and verify the output.
  await deferBlockFixture.render(DeferBlockState.Complete);
  expect(componentFixture.nativeElement.innerHTML).toContain('large works!');
});
```

## `@defer` funciona com `NgModule`?

Blocos `@defer` são compatíveis tanto com components, directives e pipes standalone quanto baseados em NgModule. No entanto, **apenas components, directives e pipes standalone podem ser diferidos**. Dependências baseadas em NgModule não são diferidas e são incluídas no bundle carregado eagerly.

## Compatibilidade entre blocos `@defer` e Hot Module Reload (HMR)

Quando Hot Module Replacement (HMR) está ativo, todos os chunks de blocos `@defer` são buscados eagerly, sobrescrevendo quaisquer triggers configurados. Para restaurar o comportamento de trigger padrão, você deve desabilitar o HMR servindo sua aplicação com a flag `--no-hmr`.

## Como `@defer` funciona com server-side rendering (SSR) e static-site generation (SSG)?

Por padrão, ao renderizar uma aplicação no servidor (usando SSR ou SSG), blocos defer sempre renderizam seu `@placeholder` (ou nada se um placeholder não for especificado) e triggers não são invocados. No cliente, o conteúdo do `@placeholder` é hidratado e triggers são ativados.

Para renderizar o conteúdo principal de blocos `@defer` no servidor (tanto SSR quanto SSG), você pode habilitar [o recurso de Incremental Hydration](/guide/incremental-hydration) e configurar triggers `hydrate` para os blocos necessários.

## Boas práticas para diferir views

### Evite carregamentos em cascata com blocos `@defer` aninhados

Quando você tem blocos `@defer` aninhados, eles devem ter triggers diferentes para evitar carregamento simultâneo, o que causa requisições em cascata e pode impactar negativamente a performance de carregamento da página.

### Evite mudanças de layout

Evite diferir components que são visíveis no viewport do usuário no carregamento inicial. Fazer isso pode impactar negativamente os Core Web Vitals causando um aumento no cumulative layout shift (CLS).

No caso de isso ser necessário, evite triggers `immediate`, `timer`, `viewport` e `when` customizados que causam o carregamento do conteúdo durante a renderização inicial da página.

### Mantenha a acessibilidade em mente

Ao usar blocos `@defer`, considere o impacto em usuários com tecnologias assistivas como leitores de tela. Leitores de tela que focam em uma seção diferida inicialmente lerão o conteúdo do placeholder ou loading, mas podem não anunciar mudanças quando o conteúdo diferido carregar.

Para garantir que mudanças de conteúdo diferido sejam anunciadas para leitores de tela, você pode envolver seu bloco `@defer` em um elemento com uma região live:

```angular-html
<div aria-live="polite" aria-atomic="true">
  @defer (on timer(2000)) {
    <user-profile [user]="currentUser" />
  } @placeholder {
    Loading user profile...
  } @loading {
    Please wait...
  } @error {
    Failed to load profile
  }
</div>
```

Isso garante que mudanças sejam anunciadas ao usuário quando transições (placeholder &rarr; loading &rarr; content/error) ocorrem.
