<!-- ia-translate: true -->
# Carregamento diferido com `@defer`

Views diferíveis, também conhecidas como blocos `@defer`, reduzem o tamanho inicial do bundle da sua aplicação ao adiar o carregamento de código que não é estritamente necessário para a renderização inicial de uma página. Isso geralmente resulta em um carregamento inicial mais rápido e em melhorias nos Core Web Vitals (CWV), principalmente Largest Contentful Paint (LCP) e Time to First Byte (TTFB).

Para usar este recurso, você pode envolver declarativamente uma seção do seu template em um bloco @defer:

```angular-html
@defer {
  <large-component />
}
```

O código de quaisquer components, directives e pipes dentro do bloco `@defer` é dividido em um arquivo JavaScript separado e carregado somente quando necessário, depois que o restante do template tiver sido renderizado.

Views diferíveis oferecem suporte a uma variedade de triggers, opções de prefetching e sub-blocos para o gerenciamento dos estados de placeholder, loading e error.

## Quais dependências são diferidas? {#which-dependencies-are-deferred}

Components, directives, pipes e quaisquer estilos CSS de components podem ser diferidos ao carregar uma aplicação.

Para que as dependências dentro de um bloco `@defer` sejam diferidas, elas precisam atender a duas condições:

1. **Elas devem ser standalone.** Dependências não standalone não podem ser diferidas e continuam sendo carregadas de forma eager, mesmo que estejam dentro de blocos `@defer`.
1. **Elas não podem ser referenciadas fora de blocos `@defer` dentro do mesmo arquivo.** Se forem referenciadas fora do bloco `@defer` ou dentro de queries ViewChild, as dependências serão carregadas de forma eager.

As dependências _transitivas_ dos components, directives e pipes usados no bloco `@defer` não precisam, estritamente, ser standalone; dependências transitivas ainda podem ser declaradas em um `NgModule` e participar do carregamento diferido.

O compilador do Angular produz uma instrução de [dynamic import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) para cada component, directive e pipe usado no bloco `@defer`. O conteúdo principal do bloco é renderizado depois que todos os imports forem resolvidos. O Angular não garante nenhuma ordem específica para esses imports.

## Como gerenciar os diferentes estágios do carregamento diferido {#how-to-manage-different-stages-of-deferred-loading}

Blocos `@defer` possuem vários sub-blocos que permitem tratar de forma elegante os diferentes estágios do processo de carregamento diferido.

### `@defer`

Este é o bloco principal, que define a seção de conteúdo carregada de forma lazy. Ele não é renderizado inicialmente: o conteúdo diferido é carregado e renderizado assim que o [trigger](#controlling-deferred-content-loading-with-triggers) especificado ocorrer ou a condição `when` for atendida.

Por padrão, um bloco `@defer` é acionado quando o estado do navegador se torna [idle](/guide/templates/defer#idle).

```angular-html
@defer {
  <large-component />
}
```

### Mostrar conteúdo de placeholder com `@placeholder` {#show-placeholder-content-with-placeholder}

Por padrão, blocos defer não renderizam nenhum conteúdo antes de serem acionados.

O `@placeholder` é um bloco opcional que declara qual conteúdo mostrar antes que o bloco `@defer` seja acionado.

```angular-html
@defer {
  <large-component />
} @placeholder {
  <p>Conteúdo de placeholder</p>
}
```

Embora opcional, certos triggers podem exigir a presença de um `@placeholder` ou de uma [template reference variable](/guide/templates/variables#template-reference-variables) para funcionar. Consulte a seção [Triggers](#controlling-deferred-content-loading-with-triggers) para mais detalhes.

O Angular substitui o conteúdo do placeholder pelo conteúdo principal assim que o carregamento é concluído. Você pode usar qualquer conteúdo na seção de placeholder, incluindo HTML simples, components, directives e pipes. Tenha em mente que as _dependências do bloco placeholder são carregadas de forma eager_.

O bloco `@placeholder` aceita um parâmetro opcional para especificar a quantidade `minimum` de tempo que este placeholder deve ser exibido após o conteúdo do placeholder ser renderizado inicialmente.

```angular-html
@defer {
  <large-component />
} @placeholder (minimum 500ms) {
  <p>Conteúdo de placeholder</p>
}
```

Este parâmetro `minimum` é especificado em incrementos de tempo de milissegundos (ms) ou segundos (s). Você pode usá-lo para evitar um piscar rápido do conteúdo do placeholder caso as dependências diferidas sejam buscadas muito rapidamente.

### Mostrar conteúdo de loading com `@loading` {#show-loading-content-with-loading}

O bloco `@loading` é um bloco opcional que permite declarar o conteúdo exibido enquanto as dependências diferidas estão sendo carregadas. Ele substitui o bloco `@placeholder` assim que o carregamento é acionado.

```angular-html
@defer {
  <large-component />
} @loading {
  <img alt="carregando..." src="loading.gif" />
} @placeholder {
  <p>Conteúdo de placeholder</p>
}
```

Suas dependências são carregadas de forma eager (de maneira semelhante ao `@placeholder`).

O bloco `@loading` aceita dois parâmetros opcionais que ajudam a evitar o piscar rápido de conteúdo que pode ocorrer quando as dependências diferidas são buscadas rapidamente:

- `minimum` - a quantidade mínima de tempo que este placeholder deve ser exibido
- `after` - a quantidade de tempo a esperar após o início do carregamento antes de mostrar o template de loading

```angular-html
@defer {
  <large-component />
} @loading (after 100ms; minimum 1s) {
  <img alt="carregando..." src="loading.gif" />
}
```

Ambos os parâmetros são especificados em incrementos de tempo de milissegundos (ms) ou segundos (s). Além disso, os temporizadores dos dois parâmetros começam imediatamente após o carregamento ser acionado.

### Mostrar estado de erro quando o carregamento diferido falha com `@error` {#show-error-state-when-deferred-loading-fails-with-error}

O bloco `@error` é um bloco opcional que é exibido caso o carregamento diferido falhe. Assim como ocorre com `@placeholder` e `@loading`, as dependências do bloco @error são carregadas de forma eager.

```angular-html
@defer {
  <large-component />
} @error {
  <p>Falha ao carregar o component grande.</p>
}
```

## Controlando o carregamento de conteúdo diferido com triggers {#controlling-deferred-content-loading-with-triggers}

Você pode especificar **triggers** que controlam quando o Angular carrega e exibe o conteúdo diferido.

Quando um bloco `@defer` é acionado, ele substitui o conteúdo do placeholder pelo conteúdo carregado de forma lazy.

Vários event triggers podem ser definidos separando-os com ponto e vírgula, `;`, e serão avaliados como condições OR.

Existem dois tipos de triggers: `on` e `when`.

### `on`

`on` especifica uma condição para quando o bloco `@defer` é acionado.

Os triggers disponíveis são os seguintes:

| Trigger                       | Descrição                                                                   |
| ----------------------------- | --------------------------------------------------------------------------- |
| [`idle`](#idle)               | Aciona quando o navegador está ocioso. Aceita um timeout opcional.          |
| [`viewport`](#viewport)       | Aciona quando o conteúdo especificado entra na viewport                     |
| [`interaction`](#interaction) | Aciona quando o usuário interage com o elemento especificado                |
| [`hover`](#hover)             | Aciona quando o mouse passa sobre a área especificada                       |
| [`immediate`](#immediate)     | Aciona imediatamente após o término da renderização do conteúdo não diferido |
| [`timer`](#timer)             | Aciona após uma duração específica                                          |

#### `idle`

O trigger `idle` carrega o conteúdo diferido assim que o navegador atinge um estado ocioso, com base em requestIdleCallback. Este é o comportamento padrão de um bloco defer.

Opcionalmente, você pode especificar um timeout em milissegundos que é passado para [`requestIdleCallback`](https://developer.mozilla.org/docs/Web/API/Window/requestIdleCallback). Se o navegador não agendar o callback rápido o suficiente, o trabalho será executado no mais tardar após o timeout especificado.

```angular-html
<!-- @defer (on idle) -->
@defer {
  <large-cmp />
} @placeholder {
  <div>Placeholder do component grande</div>
}

<!-- Com timeout de 500ms -->
@defer (on idle(500)) {
  <large-cmp />
}
```

##### Personalizando o comportamento de `idle` {#customizing-idle-behavior}

Você pode personalizar o trigger `idle` fornecendo sua própria implementação de `IdleService` e registrando-a com `provideIdleServiceWith` nos providers da sua aplicação.

```ts
@Service()
class CustomIdleService implements IdleService {
  requestOnIdle(callback: (deadline?: IdleDeadline) => void, options?: IdleRequestOptions): number {
    // A lógica personalizada de agendamento ocioso pode ser implementada aqui.
    return requestIdleCallback(callback, options);
  }

  cancelOnIdle(id: number) {
    // Implemente aqui o cancelamento personalizado de tarefas ociosas.
  }
}

bootstrapApplication(App, {
  providers: [provideIdleServiceWith(CustomIdleService)],
});
```

#### `viewport`

O trigger `viewport` carrega o conteúdo diferido quando o conteúdo especificado entra na viewport, usando a [Intersection Observer API](https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API). O conteúdo observado pode ser o conteúdo do `@placeholder` ou uma referência explícita a um elemento.

Por padrão, o `@defer` observa o placeholder entrando na viewport. Placeholders usados dessa forma devem ter um único elemento raiz.

```angular-html
@defer (on viewport) {
  <large-cmp />
} @placeholder {
  <div>Placeholder do component grande</div>
}
```

Alternativamente, você pode especificar uma [template reference variable](/guide/templates/variables) no mesmo template que o bloco `@defer` como o elemento observado para entrar na viewport. Essa variável é passada como parâmetro no trigger viewport.

```angular-html
<div #greeting>Olá!</div>
@defer (on viewport(greeting)) {
  <greetings-cmp />
}
```

Se você quiser personalizar as opções do `IntersectionObserver`, o trigger `viewport` aceita um objeto literal. O literal suporta todas as propriedades do segundo parâmetro de `IntersectionObserver`, exceto `root`. Ao usar a notação de objeto literal, você precisa passar seu trigger pela propriedade `trigger`.

```angular-html
<div #greeting>Olá!</div>

<!-- Com opções e um trigger -->
@defer (
  on viewport({trigger: greeting, rootMargin: '100px', scrollMargin: '50px', threshold: 0.5})
) {
  <greetings-cmp />
}

<!-- Com opções e um trigger implícito -->
@defer (on viewport({rootMargin: '100px', scrollMargin: '50px', threshold: 0.5})) {
  <greetings-cmp />
} @placeholder {
  <div>Trigger implícito</div>
}
```

#### `interaction`

O trigger `interaction` carrega o conteúdo diferido quando o usuário interage com o elemento especificado por meio dos eventos `click` ou `keydown`.

Por padrão, o placeholder atua como o elemento de interação. Placeholders usados dessa forma devem ter um único elemento raiz.

```angular-html
@defer (on interaction) {
  <large-cmp />
} @placeholder {
  <div>Placeholder do component grande</div>
}
```

Alternativamente, você pode especificar uma [template reference variable](/guide/templates/variables) no mesmo template que o bloco `@defer` como o elemento observado para interações. Essa variável é passada como parâmetro no trigger interaction.

```angular-html
<div #greeting>Olá!</div>
@defer (on interaction(greeting)) {
  <greetings-cmp />
}
```

#### `hover`

O trigger `hover` carrega o conteúdo diferido quando o mouse passa sobre a área acionada, por meio dos eventos `mouseover` e `focusin`.

Por padrão, o placeholder atua como o elemento de interação. Placeholders usados dessa forma devem ter um único elemento raiz.

```angular-html
@defer (on hover) {
  <large-cmp />
} @placeholder {
  <div>Placeholder do component grande</div>
}
```

Alternativamente, você pode especificar uma [template reference variable](/guide/templates/variables) no mesmo template que o bloco `@defer` como o elemento sobre o qual o mouse passa. Essa variável é passada como parâmetro no trigger hover.

```angular-html
<div #greeting>Olá!</div>
@defer (on hover(greeting)) {
  <greetings-cmp />
}
```

#### `immediate`

O trigger `immediate` carrega o conteúdo diferido imediatamente. Isso significa que o bloco diferido é carregado assim que todo o restante do conteúdo não diferido tiver terminado de renderizar.

```angular-html
@defer (on immediate) {
  <large-cmp />
} @placeholder {
  <div>Placeholder do component grande</div>
}
```

#### `timer`

O trigger `timer` carrega o conteúdo diferido após uma duração especificada.

```angular-html
@defer (on timer(500ms)) {
  <large-cmp />
} @placeholder {
  <div>Placeholder do component grande</div>
}
```

O parâmetro de duração deve ser especificado em milissegundos (`ms`) ou segundos (`s`).

### `when`

O trigger `when` aceita uma expressão condicional personalizada e carrega o conteúdo diferido quando a condição se torna truthy.

```angular-html
@defer (when condition) {
  <large-cmp />
} @placeholder {
  <div>Placeholder do component grande</div>
}
```

Esta é uma operação única: o bloco `@defer` não volta ao placeholder se a condição mudar para um valor falsy depois de se tornar truthy.

## Pré-buscando dados com `prefetch` {#prefetching-data-with-prefetch}

Além de especificar uma condição que determina quando o conteúdo diferido é exibido, você pode, opcionalmente, especificar um **prefetch trigger**. Esse trigger permite carregar o JavaScript associado ao bloco `@defer` antes que o conteúdo diferido seja exibido.

O prefetching habilita comportamentos mais avançados, como começar a pré-buscar recursos antes que o usuário tenha de fato visto ou interagido com um bloco defer, mas que possa interagir com ele em breve, deixando os recursos disponíveis mais rapidamente.

Você pode especificar um prefetch trigger de forma semelhante ao trigger principal do bloco, mas prefixado com a palavra-chave `prefetch`. O trigger principal do bloco e o prefetch trigger são separados por um caractere de ponto e vírgula (`;`).

No exemplo abaixo, o prefetching começa quando o navegador fica ocioso, e o conteúdo do bloco é renderizado somente depois que o usuário interage com o placeholder.

```angular-html
@defer (on interaction; prefetch on idle) {
  <large-cmp />
} @placeholder {
  <div>Placeholder do component grande</div>
}

<!-- Prefetching com timeout de 500ms para o idle -->
@defer (on interaction; prefetch on idle(500)) {
  <large-cmp />
}
```

## Testando blocos `@defer` {#testing-defer-blocks}

O Angular fornece APIs do TestBed para simplificar o processo de testar blocos `@defer` e acionar diferentes estados durante o teste. Por padrão, os blocos `@defer` nos testes se comportam como se comportariam em uma aplicação real. Se você quiser percorrer os estados manualmente, pode mudar o comportamento do bloco defer para `Manual` na configuração do TestBed.

```angular-ts
it('should render a defer block in different states', async () => {
  // configura o comportamento do bloco defer para iniciar no estado "pausado", para controle manual.
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
    `,
  })
  class ExampleA {}
  // Cria o fixture do component.
  const componentFixture = TestBed.createComponent(ExampleA);
  // Obtém a lista de todos os fixtures de blocos defer e pega o primeiro bloco.
  const deferBlockFixture = (await componentFixture.getDeferBlocks())[0];
  // Renderiza o estado de placeholder por padrão.
  expect(componentFixture.nativeElement.innerHTML).toContain('Placeholder');
  // Renderiza o estado de loading e verifica a saída renderizada.
  await deferBlockFixture.render(DeferBlockState.Loading);
  expect(componentFixture.nativeElement.innerHTML).toContain('Loading');
  // Renderiza o estado final e verifica a saída.
  await deferBlockFixture.render(DeferBlockState.Complete);
  expect(componentFixture.nativeElement.innerHTML).toContain('large works!');
});
```

## O `@defer` funciona com `NgModule`? {#does-defer-work-with-ngmodule}

Blocos `@defer` são compatíveis tanto com components, directives e pipes standalone quanto com os baseados em NgModule. No entanto, **apenas components, directives e pipes standalone podem ser diferidos**. Dependências baseadas em NgModule não são diferidas e são incluídas no bundle carregado de forma eager.

## Compatibilidade entre blocos `@defer` e Hot Module Reload (HMR) {#compatibility-between-defer-blocks-and-hot-module-reload-hmr}

Quando o Hot Module Replacement (HMR) está ativo, todos os chunks dos blocos `@defer` são buscados de forma eager, sobrescrevendo quaisquer triggers configurados. Para restaurar o comportamento padrão dos triggers, você deve desabilitar o HMR, servindo sua aplicação com a flag `--no-hmr`.

## Como o `@defer` funciona com server-side rendering (SSR) e static-site generation (SSG)? {#how-does-defer-work-with-server-side-rendering-ssr-and-static-site-generation-ssg}

Por padrão, ao renderizar uma aplicação no servidor (usando SSR ou SSG), os blocos defer sempre renderizam seu `@placeholder` (ou nada, caso um placeholder não seja especificado) e os triggers não são invocados. No cliente, o conteúdo do `@placeholder` é hidratado e os triggers são ativados.

Para renderizar o conteúdo principal dos blocos `@defer` no servidor (tanto em SSR quanto em SSG), você pode habilitar [o recurso de Incremental Hydration](/guide/incremental-hydration) e configurar triggers `hydrate` para os blocos necessários.

## Barrel files e chunks lazy {#barrel-files-and-lazy-chunks}

Se você está usando `@defer`, mas não vê um chunk lazy separado na saída do build, verifique como está importando o component diferido. Importar por meio de um barrel file (`index.ts`) é um vilão comum: os bundlers veem o barrel como um único módulo e mantêm todas as suas exportações juntas, então seu component acaba no bundle principal independentemente do `@defer`.

```typescript {header: "index.ts"}
export {HeavyComponent} from './heavy.component';
export {OtherComponent} from './other.component';
```

```typescript {header: "parent.component.ts"}
import {Component} from '@angular/core';
import {HeavyComponent} from './index'; // puxa o OtherComponent também

@Component({
  imports: [HeavyComponent],
  template: `@defer {
    <heavy-component />
  }`,
})
export class ParentComponent {}
```

A correção é simples: importe diretamente do próprio arquivo do component:

```typescript
import {HeavyComponent} from './heavy.component';
```

Isso basta para o bundler separá-lo em um chunk próprio e carregá-lo de forma lazy quando o trigger for acionado.

## Boas práticas para diferir views {#best-practices-for-deferring-views}

### Evite carregamentos em cascata com blocos `@defer` aninhados {#avoid-cascading-loads-with-nested-defer-blocks}

Quando você tem blocos `@defer` aninhados, eles devem ter triggers diferentes para evitar o carregamento simultâneo, que causa requisições em cascata e pode afetar negativamente a performance de carregamento da página.

### Evite mudanças de layout {#avoid-layout-shifts}

Evite diferir components que estão visíveis na viewport do usuário no carregamento inicial. Fazer isso pode afetar negativamente os Core Web Vitals, causando um aumento no cumulative layout shift (CLS).

Caso isso seja necessário, evite os triggers `immediate`, `timer`, `viewport` e `when` personalizados que causam o carregamento do conteúdo durante a renderização inicial da página.

### Mantenha a acessibilidade em mente {#keep-accessibility-in-mind}

Ao usar blocos `@defer`, considere o impacto em usuários que utilizam tecnologias assistivas, como leitores de tela. Leitores de tela que focam em uma seção diferida inicialmente vão ler o conteúdo do placeholder ou do loading, mas podem não anunciar as mudanças quando o conteúdo diferido for carregado.

Para garantir que as mudanças no conteúdo diferido sejam anunciadas aos leitores de tela, você pode envolver seu bloco `@defer` em um elemento com uma live region:

```angular-html
<div aria-live="polite" aria-atomic="true">
  @defer (on timer(2000)) {
    <user-profile [user]="currentUser" />
  } @placeholder {
    Carregando perfil do usuário...
  } @loading {
    Aguarde...
  } @error {
    Falha ao carregar o perfil
  }
</div>
```

Isso garante que as mudanças sejam anunciadas ao usuário quando as transições (placeholder &rarr; loading &rarr; conteúdo/erro) ocorrem.
