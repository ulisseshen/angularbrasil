<!-- ia-translate: true -->
# Criando harnesses para seus components

## Antes de começar

TIP: Este guia assume que você já leu o [guia de visão geral de component harnesses](guide/testing/component-harnesses-overview). Leia-o primeiro se você é novo em usar component harnesses.

### Quando criar um test harness faz sentido?

A equipe do Angular recomenda criar component test harnesses para components compartilhados que são usados em muitos lugares e têm alguma interatividade do usuário. Isso se aplica mais comumente a bibliotecas de widgets e components reutilizáveis similares. Harnesses são valiosos para esses casos porque fornecem aos consumidores desses components compartilhados uma API bem suportada para interagir com um component. Testes que usam harnesses podem evitar depender de detalhes de implementação não confiáveis desses components compartilhados, como estrutura DOM e event listeners específicos.

Para components que aparecem em apenas um lugar, como uma página em uma aplicação, harnesses não fornecem tanto benefício. Nessas situações, os testes de um component podem razoavelmente depender dos detalhes de implementação deste component, pois os testes e components são atualizados ao mesmo tempo. No entanto, harnesses ainda fornecem algum valor se você usar o harness em testes unitários e end-to-end.

### Instalação do CDK

O [Component Dev Kit (CDK)](https://material.angular.dev/cdk/categories) é um conjunto de primitivas de comportamento para construir components. Para usar os component harnesses, primeiro instale `@angular/cdk` do npm. Você pode fazer isso do seu terminal usando o Angular CLI:

<docs-code language="shell">
  ng add @angular/cdk
</docs-code>

## Estendendo `ComponentHarness`

A classe abstrata `ComponentHarness` é a classe base para todos os component harnesses. Para criar um component harness personalizado, estenda `ComponentHarness` e implemente a propriedade estática `hostSelector`.

A propriedade `hostSelector` identifica elementos no DOM que correspondem a esta subclasse harness. Na maioria dos casos, o `hostSelector` deve ser o mesmo que o seletor do `Component` ou `Directive` correspondente. Por exemplo, considere um component de popup simples:

<docs-code language="typescript">
@Component({
  selector: 'my-popup',
  template: `
    <button (click)="toggle()">{{triggerText()}}</button>
    @if (isOpen()) {
      <div class="my-popup-content"><ng-content></ng-content></div>
    }
  `
})
class MyPopup {
  triggerText = input('');

isOpen = signal(false);

toggle() {
this.isOpen.update((value) => !value);
}
}
</docs-code>

Neste caso, um harness mínimo para o component ficaria assim:

<docs-code language="typescript">
class MyPopupHarness extends ComponentHarness {
  static hostSelector = 'my-popup';
}
</docs-code>

Embora subclasses de `ComponentHarness` exijam apenas a propriedade `hostSelector`, a maioria dos harnesses também deve implementar um método estático `with` para gerar instâncias de `HarnessPredicate`. A [seção filtrando harnesses](guide/testing/using-component-harnesses#filtering-harnesses) cobre isso em mais detalhes.

## Encontrando elementos no DOM do component

Cada instância de uma subclasse `ComponentHarness` representa uma instância particular do component correspondente. Você pode acessar o elemento host do component via o método `host()` da classe base `ComponentHarness`.

`ComponentHarness` também oferece vários métodos para localizar elementos dentro do DOM do component. Esses métodos são `locatorFor()`, `locatorForOptional()` e `locatorForAll()`. Esses métodos criam funções que encontram elementos, eles não encontram elementos diretamente. Esta abordagem protege contra o cache de referências a elementos desatualizados. Por exemplo, quando um bloco `@if` oculta e depois mostra um elemento, o resultado é um novo elemento DOM; usar funções garante que os testes sempre referenciem o estado atual do DOM.

Veja a [página de referência da API ComponentHarness](/api/cdk/testing/ComponentHarness) para a lista completa de detalhes dos diferentes métodos `locatorFor`.

Por exemplo, o exemplo `MyPopupHarness` discutido acima poderia fornecer métodos para obter os elementos trigger e content da seguinte forma:

<docs-code language="typescript">
class MyPopupHarness extends ComponentHarness {
  static hostSelector = 'my-popup';

// Gets the trigger element
getTriggerElement = this.locatorFor('button');

// Gets the content element.
getContentElement = this.locatorForOptional('.my-popup-content');
}
</docs-code>

## Trabalhando com instâncias de `TestElement`

`TestElement` é uma abstração projetada para funcionar em diferentes ambientes de teste (testes unitários, WebDriver, etc). Ao usar harnesses, você deve realizar toda a interação DOM por meio desta interface. Outros meios de acessar elementos DOM, como `document.querySelector()`, não funcionam em todos os ambientes de teste.

`TestElement` tem vários métodos para interagir com o DOM subjacente, como `blur()`, `click()`, `getAttribute()` e mais. Veja a [página de referência da API TestElement](/api/cdk/testing/TestElement) para a lista completa de métodos.

Não exponha instâncias de `TestElement` aos usuários de harness, a menos que seja um elemento que o consumidor do component define diretamente, como o elemento host do component. Expor instâncias de `TestElement` para elementos internos leva os usuários a depender da estrutura DOM interna de um component.

Em vez disso, forneça métodos mais focados para ações específicas que o usuário final pode realizar ou estado particular que eles podem observar. Por exemplo, `MyPopupHarness` das seções anteriores poderia fornecer métodos como `toggle` e `isOpen`:

<docs-code language="typescript">
class MyPopupHarness extends ComponentHarness {
  static hostSelector = 'my-popup';

protected getTriggerElement = this.locatorFor('button');
protected getContentElement = this.locatorForOptional('.my-popup-content');

/\*_ Toggles the open state of the popup. _/
async toggle() {
const trigger = await this.getTriggerElement();
return trigger.click();
}

/\*_ Checks if the popup us open. _/
async isOpen() {
const content = await this.getContentElement();
return !!content;
}
}
</docs-code>

## Carregando harnesses para subcomponents

Components maiores frequentemente compõem sub-components. Você pode refletir esta estrutura no harness de um component também. Cada um dos métodos `locatorFor` em `ComponentHarness` tem uma assinatura alternativa que pode ser usada para localizar sub-harnesses ao invés de elementos.

Veja a [página de referência da API ComponentHarness](/api/cdk/testing/ComponentHarness) para a lista completa dos diferentes métodos locatorFor.

Por exemplo, considere um menu construído usando o popup de cima:

<docs-code language="typescript">
@Directive({
  selector: 'my-menu-item'
})
class MyMenuItem {}

@Component({
selector: 'my-menu',
template: `     <my-popup>
      <ng-content></ng-content>
    </my-popup>
  `
})
class MyMenu {
triggerText = input('');

@ContentChildren(MyMenuItem) items: QueryList<MyMenuItem>;
}
</docs-code>

O harness para `MyMenu` pode então aproveitar outros harnesses para `MyPopup` e `MyMenuItem`:

<docs-code language="typescript">
class MyMenuHarness extends ComponentHarness {
  static hostSelector = 'my-menu';

protected getPopupHarness = this.locatorFor(MyPopupHarness);

/\*_ Gets the currently shown menu items (empty list if menu is closed). _/
getItems = this.locatorForAll(MyMenuItemHarness);

/\*_ Toggles open state of the menu. _/
async toggle() {
const popupHarness = await this.getPopupHarness();
return popupHarness.toggle();
}
}

class MyMenuItemHarness extends ComponentHarness {
static hostSelector = 'my-menu-item';
}
</docs-code>

## Filtrando instâncias de harness com `HarnessPredicate`

Quando uma página contém múltiplas instâncias de um component particular, você pode querer filtrar baseado em alguma propriedade do component para obter uma instância de component particular. Por exemplo, você pode querer um botão com algum texto específico, ou um menu com um ID específico. A classe `HarnessPredicate` pode capturar critérios como este para uma subclasse `ComponentHarness`. Embora o autor do teste seja capaz de construir instâncias de `HarnessPredicate` manualmente, é mais fácil quando a subclasse `ComponentHarness` fornece um método auxiliar para construir predicados para filtros comuns.

Você deve criar um método estático `with()` em cada subclasse `ComponentHarness` que retorna um `HarnessPredicate` para aquela classe. Isso permite que autores de teste escrevam código facilmente compreensível, por exemplo `loader.getHarness(MyMenuHarness.with({selector: '#menu1'}))`. Além das opções padrão de selector e ancestor, o método `with` deve adicionar quaisquer outras opções que façam sentido para a subclasse particular.

Harnesses que precisam adicionar opções adicionais devem estender a interface `BaseHarnessFilters` e propriedades opcionais adicionais conforme necessário. `HarnessPredicate` fornece vários métodos de conveniência para adicionar opções: `stringMatches()`, `addOption()` e `add()`. Veja a [página da API HarnessPredicate](/api/cdk/testing/HarnessPredicate) para a descrição completa.

Por exemplo, ao trabalhar com um menu, é útil filtrar baseado no texto do trigger e filtrar itens do menu baseado no seu texto:

<docs-code language="typescript">
interface MyMenuHarnessFilters extends BaseHarnessFilters {
  /** Filters based on the trigger text for the menu. */
  triggerText?: string | RegExp;
}

interface MyMenuItemHarnessFilters extends BaseHarnessFilters {
/\*_ Filters based on the text of the menu item. _/
text?: string | RegExp;
}

class MyMenuHarness extends ComponentHarness {
static hostSelector = 'my-menu';

/\*_ Creates a `HarnessPredicate` used to locate a particular `MyMenuHarness`. _/
static with(options: MyMenuHarnessFilters): HarnessPredicate<MyMenuHarness> {
return new HarnessPredicate(MyMenuHarness, options)
.addOption('trigger text', options.triggerText,
(harness, text) => HarnessPredicate.stringMatches(harness.getTriggerText(), text));
}

protected getPopupHarness = this.locatorFor(MyPopupHarness);

/\*_ Gets the text of the menu trigger. _/
async getTriggerText(): Promise<string> {
const popupHarness = await this.getPopupHarness();
return popupHarness.getTriggerText();
}
...
}

class MyMenuItemHarness extends ComponentHarness {
static hostSelector = 'my-menu-item';

/\*_ Creates a `HarnessPredicate` used to locate a particular `MyMenuItemHarness`. _/
static with(options: MyMenuItemHarnessFilters): HarnessPredicate<MyMenuItemHarness> {
return new HarnessPredicate(MyMenuItemHarness, options)
.addOption('text', options.text,
(harness, text) => HarnessPredicate.stringMatches(harness.getText(), text));
}

/\*_ Gets the text of the menu item. _/
async getText(): Promise<string> {
const host = await this.host();
return host.text();
}
}
</docs-code>

Você pode passar um `HarnessPredicate` ao invés de uma classe `ComponentHarness` para qualquer uma das APIs em `HarnessLoader`, `LocatorFactory` ou `ComponentHarness`. Isso permite que autores de teste direcionem facilmente uma instância de component particular ao criar uma instância de harness. Também permite que o autor do harness aproveite o mesmo `HarnessPredicate` para habilitar APIs mais poderosas em sua classe harness. Por exemplo, considere o método `getItems` no `MyMenuHarness` mostrado acima. Adicionar uma API de filtragem permite que usuários do harness procurem itens de menu particulares:

<docs-code language="typescript">
class MyMenuHarness extends ComponentHarness {
  static hostSelector = 'my-menu';

/\*_ Gets a list of items in the menu, optionally filtered based on the given criteria. _/
async getItems(filters: MyMenuItemHarnessFilters = {}): Promise<MyMenuItemHarness[]> {
const getFilteredItems = this.locatorForAll(MyMenuItemHarness.with(filters));
return getFilteredItems();
}
...
}
</docs-code>

## Criando `HarnessLoader` para elementos que usam projeção de conteúdo

Alguns components projetam conteúdo adicional no template do component. Veja o [guia de projeção de conteúdo](guide/components/content-projection) para mais informações.

Adicione uma instância `HarnessLoader` com escopo para o elemento que contém o `<ng-content>` quando você criar um harness para um component que usa projeção de conteúdo. Isso permite que o usuário do harness carregue harnesses adicionais para quaisquer components que foram passados como conteúdo. `ComponentHarness` tem vários métodos que podem ser usados para criar instâncias HarnessLoader para casos como este: `harnessLoaderFor()`, `harnessLoaderForOptional()`, `harnessLoaderForAll()`. Veja a [página de referência da API da interface HarnessLoader](/api/cdk/testing/HarnessLoader) para mais detalhes.

Por exemplo, o exemplo `MyPopupHarness` de cima pode estender `ContentContainerComponentHarness` para adicionar suporte para carregar harnesses dentro do `<ng-content>` do component.

<docs-code language="typescript">
class MyPopupHarness extends ContentContainerComponentHarness<string> {
  static hostSelector = 'my-popup';
}
</docs-code>

## Acessando elementos fora do elemento host do component

Há momentos em que um component harness pode precisar acessar elementos fora do elemento host de seu component correspondente. Por exemplo, código que exibe um elemento flutuante ou pop-up frequentemente anexa elementos DOM diretamente ao corpo do documento, como o service `Overlay` no Angular CDK.

Neste caso, `ComponentHarness` fornece um método que pode ser usado para obter um `LocatorFactory` para o elemento raiz do documento. O `LocatorFactory` suporta a maioria das mesmas APIs que a classe base `ComponentHarness`, e pode então ser usado para consultar relativo ao elemento raiz do documento.

Considere se o component `MyPopup` acima usasse o overlay CDK para o conteúdo do popup, ao invés de um elemento em seu próprio template. Neste caso, `MyPopupHarness` teria que acessar o elemento content via método `documentRootLocatorFactory()` que obtém um locator factory enraizado na raiz do documento.

<docs-code language="typescript">
class MyPopupHarness extends ComponentHarness {
  static hostSelector = 'my-popup';

/\*_ Gets a `HarnessLoader` whose root element is the popup's content element. _/
async getHarnessLoaderForContent(): Promise<HarnessLoader> {
const rootLocator = this.documentRootLocatorFactory();
return rootLocator.harnessLoaderFor('my-popup-content');
}
}
</docs-code>

## Esperando por tarefas assíncronas

Os métodos em `TestElement` acionam automaticamente a detecção de mudanças do Angular e esperam por tarefas dentro da `NgZone`. Na maioria dos casos, nenhum esforço especial é necessário para autores de harness esperarem por tarefas assíncronas. No entanto, há alguns casos extremos onde isso pode não ser suficiente.

Sob algumas circunstâncias, animações do Angular podem requerer um segundo ciclo de detecção de mudanças e subsequente estabilização `NgZone` antes que eventos de animação sejam completamente liberados. Em casos onde isso é necessário, o `ComponentHarness` oferece um método `forceStabilize()` que pode ser chamado para fazer a segunda rodada.

Você pode usar `NgZone.runOutsideAngular()` para agendar tarefas fora de NgZone. Chame o método `waitForTasksOutsideAngular()` no harness correspondente se você precisar esperar explicitamente por tarefas fora de `NgZone`, pois isso não acontece automaticamente.
