<!-- ia-translate: true -->
# Estilizando components {#styling-components}

TIP: Este guia assume que você já leu o [Guia Essencial](essentials). Leia-o primeiro se você é novo no Angular.

Components podem, opcionalmente, incluir estilos CSS que se aplicam ao DOM desse component:

```angular-ts {highlight:[4]}
@Component({
  selector: 'profile-photo',
  template: `<img src="profile-photo.jpg" alt="Your profile photo" />`,
  styles: `
    img {
      border-radius: 50%;
    }
  `,
})
export class ProfilePhoto {}
```

Você também pode optar por escrever seus estilos em arquivos separados:

```angular-ts {highlight:[4]}
@Component({
  selector: 'profile-photo',
  templateUrl: 'profile-photo.html',
  styleUrl: 'profile-photo.css',
})
export class ProfilePhoto {}
```

Quando o Angular compila seu component, esses estilos são emitidos junto com a saída JavaScript do component. Isso significa que os estilos do component participam do sistema de módulos JavaScript. Quando você renderiza um component Angular, o framework inclui automaticamente os estilos associados a ele, mesmo ao fazer lazy-loading de um component.

O Angular funciona com qualquer ferramenta que gere CSS, incluindo [Sass](https://sass-lang.com), [Less](https://lesscss.org) e [Stylus](https://stylus-lang.com).

## Escopo de estilos {#style-scoping}

Todo component tem uma configuração de **view encapsulation** que determina como o framework define o escopo dos estilos do component. Existem quatro modos de view encapsulation: `Emulated`, `ShadowDom`, `ExperimentalIsolatedShadowDom` e `None`. Você pode especificar o modo no decorator `@Component`:

```angular-ts {highlight:[3]}
@Component({
  ...,
  encapsulation: ViewEncapsulation.None,
})
export class ProfilePhoto { }
```

### ViewEncapsulation.Emulated

Por padrão, o Angular usa encapsulation emulado, para que os estilos de um component se apliquem apenas aos elementos definidos no template desse component. Nesse modo, o framework gera um atributo HTML único para cada instância do component, adiciona esse atributo aos elementos do template do component e insere esse atributo nos seletores CSS definidos nos estilos do component.

Esse modo garante que os estilos de um component não vazem e afetem outros components. No entanto, estilos globais definidos fora de um component ainda podem afetar elementos dentro de um component com encapsulation emulado.

No modo emulado, o Angular suporta a pseudo-classe [`:host`](https://developer.mozilla.org/docs/Web/CSS/:host). Embora a pseudo-classe [`:host-context()`](https://developer.mozilla.org/docs/Web/CSS/:host-context) esteja obsoleta em navegadores modernos, o compilador do Angular oferece suporte completo a ela. Ambas as pseudo-classes podem ser usadas sem depender do [Shadow DOM](https://developer.mozilla.org/docs/Web/Web_Components/Using_shadow_DOM) nativo. Durante a compilação, o framework transforma essas pseudo-classes em atributos, então elas não seguem as regras das pseudo-classes nativas em tempo de execução (por exemplo, compatibilidade com navegadores, especificidade). O modo de encapsulation emulado do Angular não suporta nenhuma outra pseudo-classe relacionada ao Shadow DOM, como `::shadow` ou `::part`.

#### `::ng-deep`

O modo de encapsulation emulado do Angular suporta uma pseudo-classe personalizada, `::ng-deep`.
**A equipe do Angular desencoraja fortemente o novo uso de `::ng-deep`**. Essas APIs permanecem exclusivamente por compatibilidade com versões anteriores.

Quando um seletor contém `::ng-deep`, o Angular deixa de aplicar os limites de view encapsulation a partir desse ponto do seletor. Qualquer parte do seletor que venha depois de `::ng-deep` pode corresponder a elementos fora do template do component.

Por exemplo:

- uma regra CSS com o seletor `p a`, usando encapsulation emulado, vai corresponder a elementos `<a>` que são descendentes de um elemento `<p>`, ambos dentro do próprio template do component.

- Um seletor como `::ng-deep p a` vai corresponder a elementos `<a>` em qualquer lugar da aplicação, descendentes de um elemento `<p>` em qualquer lugar da aplicação.

  Isso faz com que, na prática, ele se comporte como um estilo global.

- Em `p ::ng-deep a`, o Angular exige que o elemento `<p>` venha do próprio template do component, mas o elemento `<a>` pode estar em qualquer lugar da aplicação.

  Assim, na prática, o elemento `<a>` pode estar no template do component ou em qualquer um dos seus conteúdos projetados ou filhos.

- Com `:host ::ng-deep p a`, tanto o elemento `<a>` quanto o `<p>` devem ser descendentes do elemento host do component.

  Eles podem vir do template do component ou das views dos seus components filhos, mas não de outros lugares da aplicação.

### ViewEncapsulation.ShadowDom

Este modo define o escopo dos estilos dentro de um component usando [a API padrão da web Shadow DOM](https://developer.mozilla.org/docs/Web/Web_Components/Using_shadow_DOM). Ao ativar este modo, o Angular anexa uma shadow root ao elemento host do component e renderiza o template e os estilos do component na shadow tree correspondente.

Estilos dentro da shadow tree não podem afetar elementos fora dessa shadow tree.

Ativar o encapsulation `ShadowDom`, no entanto, afeta mais do que o escopo dos estilos. Renderizar o component em uma shadow tree afeta a propagação de eventos, a interação com [a API `<slot>`](https://developer.mozilla.org/docs/Web/Web_Components/Using_templates_and_slots) e a forma como as ferramentas de desenvolvedor do navegador exibem os elementos. Sempre entenda todas as implicações do uso de Shadow DOM na sua aplicação antes de ativar esta opção.

### ViewEncapsulation.ExperimentalIsolatedShadowDom

Comporta-se como descrito acima, exceto que este modo garante estritamente que _apenas_ os estilos desse component se apliquem aos elementos do template do component. Estilos globais não podem afetar elementos em uma shadow tree, e estilos dentro da shadow tree não podem afetar elementos fora dessa shadow tree.

### ViewEncapsulation.None

Este modo desativa todo o encapsulation de estilos do component. Quaisquer estilos associados ao component se comportam como estilos globais.

NOTE: Nos modos `Emulated` e `ShadowDom`, o Angular não garante 100% que os estilos do seu component sempre sobrescreverão os estilos vindos de fora dele. Assume-se que esses estilos têm a mesma especificidade que os estilos do seu component em caso de conflito.

## Definindo estilos em templates {#defining-styles-in-templates}

Você pode usar o elemento `<style>` no template de um component para definir estilos adicionais. O modo de view encapsulation do component se aplica aos estilos definidos dessa forma.

O Angular não suporta bindings dentro de elementos de estilo.

## Referenciando arquivos de estilo externos {#referencing-external-style-files}

Templates de components podem usar [o elemento `<link>`](https://developer.mozilla.org/docs/Web/HTML/Element/link) para referenciar arquivos CSS. Além disso, seu CSS pode usar [a at-rule `@import`](https://developer.mozilla.org/docs/Web/CSS/@import) para referenciar arquivos CSS. O Angular trata essas referências como estilos _externos_. Estilos externos não são afetados pelo encapsulation emulado.

## Namespacing de propriedades customizadas CSS {#namespacing-css-custom-properties}

O Angular pode adicionar um prefixo às propriedades customizadas CSS (também chamadas de variáveis CSS) que os estilos do seu component declaram e leem. Propriedades customizadas são herdadas pela árvore do DOM, então, quando algo fora da sua aplicação define uma propriedade customizada como `--primary-color` em um elemento ancestral, os seus components leem esse valor. Isso importa quando sua aplicação compartilha uma página com outra aplicação ou com um markup que você não controla. O Angular não aplica namespace às propriedades customizadas até que você peça, e uma aplicação que é dona da sua página não precisa de namespacing.

Para limitar as propriedades customizadas dos estilos do seu component à sua aplicação, adicione [`provideCssVarNamespacing`](api/platform-browser/provideCssVarNamespacing) aos providers da sua aplicação. Ela usa o [`APP_ID`](api/core/APP_ID) da aplicação como namespace:

```ts {header: "app.config.ts"}
import {APP_ID, ApplicationConfig} from '@angular/core';
import {provideCssVarNamespacing} from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [{provide: APP_ID, useValue: 'my-app'}, provideCssVarNamespacing()],
};
```

O Angular prefixa as propriedades customizadas dos estilos do seu component com esse namespace seguido de um underscore, então `--primary-color` vira `--my-app_primary-color`. O prefixo se aplica às declarações, às referências `var()`, às regras `@property` e aos bindings de estilo como `[style.--primary-color]`, incluindo os bindings de estilo que um component declara no seu objeto `host`.

`APP_ID` é `ng` a menos que você o defina, então dê a cada aplicação na página o seu próprio `APP_ID`. Caso contrário, as aplicações compartilham um prefixo e voltam a colidir. Para usar um namespace diferente do id da aplicação, passe-o para `provideCssVarNamespacing`. O Angular adiciona o underscore por conta própria: `provideCssVarNamespacing('my-app_')` produz `--my-app__primary-color`.

O Angular aplica namespace aos estilos que compila em um component: o `styles` e o `styleUrl` do component, os estilos que você [escreve em um elemento `<style>`](#defining-styles-in-templates) no template dele, as folhas de estilo que o template referencia com um `<link rel="stylesheet">` relativo, e os estilos de um component que usa `ViewEncapsulation.None`. O Angular não aplica namespace a uma folha de estilo que o navegador carrega em tempo de execução, como uma folha de estilo global listada na sua configuração de build, ou um [estilo externo](#referencing-external-style-files) que o seu build não embute.

O namespacing se aplica a todo component que o Angular compila, inclusive aos components das bibliotecas que você instala. Quando os estilos de uma biblioteca leem uma propriedade customizada que uma folha de estilo global define, como as propriedades de um tema, a referência deixa de corresponder, o navegador usa o fallback do `var()`, se houver, ou, caso contrário, [o valor herdado ou inicial da propriedade](https://www.w3.org/TR/css-variables-1/#invalid-variables), e nada reporta um erro. Antes de ativar o namespacing em uma aplicação existente, revise as propriedades customizadas que passam entre as suas folhas de estilo globais e os seus components.

IMPORTANT: O Angular reescreve nomes de propriedades customizadas apenas nos estilos e bindings que ele compila. Em todos os outros lugares, o nome que você escreveu é mantido, e nada reporta a divergência.

O Angular não reescreve o nome em:

- Atributos de estilo estáticos, como `style="--primary-color: red"`, incluindo a entrada `style` do objeto `host` de um component.
- Bindings de estilo em objeto e em string, como `[style]="{'--primary-color': color}"`, `[style]="'--primary-color: red'"` e `ngStyle`, incluindo a entrada `[style]` do objeto `host` de um component.
- Nomes de propriedades customizadas dentro do valor de um binding, como `[style.border-color]="'var(--primary-color)'"`.
- Chamadas a `Renderer2.setStyle`.

Cada um desses casos produz uma propriedade que os seus estilos com namespace não leem mais. Aplique o namespace a esses nomes você mesmo, como descrito em [Usando propriedades com namespace no TypeScript](#using-namespaced-properties-in-typescript).

### Desativando o namespacing {#opting-out-of-namespacing}

Para declarar ou ler uma propriedade customizada à qual o Angular não aplica namespace, como uma definida em uma folha de estilo global, prefixe o nome dela com `--global--`. O Angular remove `--global` e mantém o `--` restante e o resto do nome inalterados:

```css
:host {
  /* Declara --accent-color e lê --brand-color, não --my-app_brand-color. */
  --global--accent-color: navy;
  color: var(--global--brand-color);
}
```

Escreva dois hífens depois de `global`. Um único hífen, como em `--global-brand-color`, não desativa o namespacing, e o Angular aplica namespace a esse nome como a qualquer outro. Evite nomes que começam com `--global-` seguido de qualquer coisa diferente de um segundo hífen; uma versão major futura está prevista para rejeitá-los no momento do build. O Angular remove `--global` em todas as aplicações, inclusive nas aplicações que nunca configuram um namespace.

### Usando propriedades com namespace no TypeScript {#using-namespaced-properties-in-typescript}

Prefira um binding de estilo como `[style.--primary-color]`, que o Angular aplica o namespace por você. Quando você usa uma API do DOM, passe o nome que você escreveu nos seus estilos para [`CssVarNamespacer`](api/platform-browser/CssVarNamespacer), incluindo os `--` iniciais:

```angular-ts {header: "profile-photo.ts"}
import {Component, ElementRef, inject} from '@angular/core';
import {CssVarNamespacer} from '@angular/platform-browser';

@Component({
  selector: 'profile-photo',
  template: `<img src="profile-photo.jpg" alt="Your profile photo" />`,
  styles: `
    img {
      border: 2px solid var(--primary-color);
    }
  `,
})
export class ProfilePhoto {
  private readonly host: HTMLElement = inject(ElementRef).nativeElement;
  private readonly cssVarNamespacer = inject(CssVarNamespacer);

  setPrimaryColor(color: string): void {
    this.host.style.setProperty(this.cssVarNamespacer.namespace('--primary-color'), color);
  }
}
```

Use o nome simples para uma propriedade declarada com `--global--`, já que o Angular nunca aplica namespace a elas. Para todas as outras, `namespace` retorna o nome inalterado quando a aplicação não configura nenhum namespace, então uma biblioteca pode chamá-lo para as propriedades customizadas que os seus próprios estilos declaram.
