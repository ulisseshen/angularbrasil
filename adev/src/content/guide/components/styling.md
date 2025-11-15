<!-- ia-translate: true -->
# Estilizando components

TIP: Este guia assume que você já leu o [Guia Essencial](essentials). Leia-o primeiro se você é novo no Angular.

Components podem opcionalmente incluir estilos CSS que se aplicam ao DOM daquele component:

<docs-code language="angular-ts" highlight="[4]">
@Component({
  selector: 'profile-photo',
  template: `<img src="profile-photo.jpg" alt="Your profile photo">`,
  styles: ` img { border-radius: 50%; } `,
})
export class ProfilePhoto { }
</docs-code>

Você também pode optar por escrever seus estilos em arquivos separados:

<docs-code language="angular-ts" highlight="[4]">
@Component({
  selector: 'profile-photo',
  templateUrl: 'profile-photo.html',
  styleUrl: 'profile-photo.css',
})
export class ProfilePhoto { }
</docs-code>

Quando o Angular compila seu component, esses estilos são emitidos com a saída JavaScript do seu component. Isso significa que os estilos do component participam do sistema de módulos JavaScript. Quando você renderiza um component Angular, o framework inclui automaticamente seus estilos associados, mesmo ao fazer lazy-loading de um component.

O Angular funciona com qualquer ferramenta que gera CSS, incluindo [Sass](https://sass-lang.com), [less](https://lesscss.org) e [stylus](https://stylus-lang.com).

## Escopo de estilos

Cada component tem uma configuração de **view encapsulation** que determina como o framework define o escopo dos estilos de um component. Existem quatro modos de view encapsulation: `Emulated`, `ShadowDom`, `ExperimentalIsolatedShadowDom` e `None`. Você pode especificar o modo no decorator `@Component`:

<docs-code language="angular-ts" highlight="[3]">
@Component({
  ...,
  encapsulation: ViewEncapsulation.None,
})
export class ProfilePhoto { }
</docs-code>

### ViewEncapsulation.Emulated

Por padrão, o Angular usa encapsulation emulado para que os estilos de um component se apliquem apenas aos elementos definidos no template daquele component. Neste modo, o framework gera um atributo HTML único para cada instância de component, adiciona esse atributo aos elementos no template do component e insere esse atributo nos seletores CSS definidos nos estilos do seu component.

Este modo garante que os estilos de um component não vazem e afetem outros components. No entanto, estilos globais definidos fora de um component ainda podem afetar elementos dentro de um component com encapsulation emulado.

No modo emulado, o Angular suporta a pseudo-classe [`:host`](https://developer.mozilla.org/docs/Web/CSS/:host). Embora a pseudo-classe [`:host-context()`](https://developer.mozilla.org/docs/Web/CSS/:host-context) esteja depreciada em navegadores modernos, o compilador do Angular fornece suporte completo para ela. Ambas as pseudo-classes podem ser usadas sem depender do [Shadow DOM](https://developer.mozilla.org/docs/Web/Web_Components/Using_shadow_DOM) nativo. Durante a compilação, o framework transforma essas pseudo-classes em atributos, então ele não está em conformidade com as regras dessas pseudo-classes nativas em tempo de execução (por exemplo, compatibilidade do navegador, especificidade). O modo de encapsulation emulado do Angular não suporta nenhuma outra pseudo-classe relacionada ao Shadow DOM, como `::shadow` ou `::part`.

#### `::ng-deep`

O modo de encapsulation emulado do Angular suporta uma pseudo-classe customizada, `::ng-deep`. Aplicar esta pseudo-classe a uma regra CSS desabilita o encapsulation para aquela regra, efetivamente transformando-a em um estilo global. **O time do Angular desencoraja fortemente o novo uso de `::ng-deep`**. Essas APIs permanecem exclusivamente para compatibilidade retroativa.

### ViewEncapsulation.ShadowDom

Este modo define o escopo dos estilos dentro de um component usando [a API padrão web Shadow DOM](https://developer.mozilla.org/docs/Web/Web_Components/Using_shadow_DOM). Ao ativar este modo, o Angular anexa uma shadow root ao host element do component e renderiza o template e os estilos do component na shadow tree correspondente.

Estilos dentro da shadow tree não podem afetar elementos fora daquela shadow tree.

Habilitar o encapsulation `ShadowDom`, no entanto, impacta mais do que o escopo de estilos. Renderizar o component em uma shadow tree afeta a propagação de eventos, interação com [a API `<slot>`](https://developer.mozilla.org/docs/Web/Web_Components/Using_templates_and_slots), e como as ferramentas de desenvolvedor do navegador exibem elementos. Sempre entenda as implicações completas do uso de Shadow DOM em sua aplicação antes de ativar esta opção.

### ViewEncapsulation.ExperimentalIsolatedShadowDom

Comporta-se como acima, exceto que este modo garante estritamente que _apenas_ os estilos daquele component se aplicam aos elementos no template do component. Estilos globais não podem afetar elementos em uma shadow tree e estilos dentro da shadow tree não podem afetar elementos fora daquela shadow tree.

### ViewEncapsulation.None

Este modo desabilita todo o encapsulation de estilos para o component. Quaisquer estilos associados ao component se comportam como estilos globais.

NOTE: Nos modos `Emulated` e `ShadowDom`, o Angular não garante 100% que os estilos do seu component sempre sobrescreverão estilos vindos de fora dele. Assume-se que esses estilos têm a mesma especificidade que os estilos do seu component em caso de colisão.

## Definindo estilos em templates

Você pode usar o elemento `<style>` no template de um component para definir estilos adicionais. O modo de view encapsulation do component se aplica aos estilos definidos desta forma.

O Angular não suporta bindings dentro de elementos style.

## Referenciando arquivos de estilos externos

Templates de components podem usar [o elemento `<link>`](https://developer.mozilla.org/docs/Web/HTML/Element/link) para referenciar arquivos CSS. Além disso, seu CSS pode usar [a at-rule `@import`](https://developer.mozilla.org/docs/Web/CSS/@import) para referenciar arquivos CSS. O Angular trata essas referências como estilos _externos_. Estilos externos não são afetados pelo view encapsulation emulado.
