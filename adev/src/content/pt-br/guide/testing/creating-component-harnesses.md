<!-- ia-translate: true -->
# Criando harnesses para seus components

## Antes de começar

DICA: Este guia assume que você já leu o [guia de visão geral de component harnesses](guide/testing/component-harnesses-overview). Leia aquele primeiro se você é novo no uso de component harnesses.

### Quando faz sentido criar um test harness?

A equipe Angular recomenda criar component test harnesses para components compartilhados que são usados em muitos lugares e têm alguma interatividade com usuário. Isso se aplica mais comumente a bibliotecas de widgets e components reutilizáveis similares. Harnesses são valiosos para esses casos porque fornecem aos consumidores desses components compartilhados uma API bem suportada para interagir com um component. Testes que usam harnesses podem evitar depender de detalhes de implementação não confiáveis desses components compartilhados, como estrutura DOM e event listeners específicos.

Para components que aparecem em apenas um lugar, como uma página em uma aplicação, harnesses não fornecem tanto benefício. Nessas situações, os testes de um component podem razoavelmente depender dos detalhes de implementação deste component, já que os testes e components são atualizados ao mesmo tempo. No entanto, harnesses ainda fornecem algum valor se você usaria o harness em testes unitários e end-to-end.

### Instalação do CDK

O [Component Dev Kit (CDK)](https://material.angular.dev/cdk/categories) é um conjunto de primitivos de comportamento para construção de components. Para usar os component harnesses, primeiro instale `@angular/cdk` do npm. Você pode fazer isso do seu terminal usando o Angular CLI:

<docs-code language="shell">
  ng add @angular/cdk
</docs-code>

## Estendendo `ComponentHarness`

A classe abstrata `ComponentHarness` é a classe base para todos os component harnesses. Para criar um component harness customizado, estenda `ComponentHarness` e implemente a propriedade estática `hostSelector`.

A propriedade `hostSelector` identifica elementos no DOM que correspondem a esta subclasse de harness. Na maioria dos casos, o `hostSelector` deve ser o mesmo que o seletor do `Component` ou `Directive` correspondente. Por exemplo, considere um component de popup simples:

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

Embora subclasses de `ComponentHarness` exijam apenas a propriedade `hostSelector`, a maioria dos harnesses também deve implementar um método estático `with` para gerar instâncias de `HarnessPredicate`. A [seção filtering harnesses](guide/testing/using-component-harnesses#filtering-harnesses) cobre isso com mais detalhes.

## Encontrando elementos no DOM do component

Cada instância de uma subclasse de `ComponentHarness` representa uma instância particular do component correspondente. Você pode acessar o elemento host do component através do método `host()` da classe base `ComponentHarness`.

`ComponentHarness` também oferece vários métodos para localizar elementos dentro do DOM do component. Esses métodos são `locatorFor()`, `locatorForOptional()`, e `locatorForAll()`. Esses métodos criam funções que encontram elementos, eles não encontram elementos diretamente. Essa abordagem protege contra cache de referências a elementos desatualizados. Por exemplo, quando um bloco `@if` oculta e depois mostra um elemento, o resultado é um novo elemento DOM; usar funções garante que os testes sempre referenciem o estado atual do DOM.

Veja a [página de referência da API ComponentHarness](/api/cdk/testing/ComponentHarness) para os detalhes completos dos diferentes métodos `locatorFor`.

Por exemplo, o exemplo `MyPopupHarness` discutido acima poderia fornecer métodos para obter os elementos trigger e content da seguinte forma:

<docs-code language="typescript">
class MyPopupHarness extends ComponentHarness {
  static hostSelector = 'my-popup';

// Obtém o elemento trigger
getTriggerElement = this.locatorFor('button');

// Obtém o elemento content.
getContentElement = this.locatorForOptional('.my-popup-content');
}
</docs-code>

## Trabalhando com instâncias de `TestElement`

`TestElement` é uma abstração projetada para funcionar em diferentes ambientes de teste (Unit tests, WebDriver, etc). Ao usar harnesses, você deve realizar toda interação DOM através desta interface. Outros meios de acessar elementos DOM, como `document.querySelector()`, não funcionam em todos os ambientes de teste.

`TestElement` tem vários métodos para interagir com o DOM subjacente, como `blur()`, `click()`, `getAttribute()`, e mais. Veja a [página de referência da API TestElement](/api/cdk/testing/TestElement) para a lista completa de métodos.

Não exponha instâncias de `TestElement` para usuários de harness a menos que seja um elemento que o consumidor do component define diretamente, como o elemento host do component. Expor instâncias de `TestElement` para elementos internos leva usuários a depender da estrutura DOM interna de um component.

Em vez disso, forneça métodos mais focados para ações específicas que o usuário final pode realizar ou estado particular que ele pode observar. Por exemplo, `MyPopupHarness` das seções anteriores poderia fornecer métodos como `toggle` e `isOpen`:

<docs-code language="typescript">
class MyPopupHarness extends ComponentHarness {
  static hostSelector = 'my-popup';

protected getTriggerElement = this.locatorFor('button');
protected getContentElement = this.locatorForOptional('.my-popup-content');

/\*_ Alterna o estado aberto do popup. _/
async toggle() {
const trigger = await this.getTriggerElement();
return trigger.click();
}

/\*_ Verifica se o popup está aberto. _/
async isOpen() {
const content = await this.getContentElement();
return !!content;
}
}
</docs-code>

## Carregando harnesses para subcomponents

Components maiores frequentemente compõem sub-components. Você pode refletir essa estrutura no harness de um component também. Cada um dos métodos `locatorFor` em `ComponentHarness` tem uma assinatura alternativa que pode ser usada para localizar sub-harnesses em vez de elementos.

Veja a [página de referência da API ComponentHarness](/api/cdk/testing/ComponentHarness) para a lista completa dos diferentes métodos locatorFor.

Por exemplo, considere um menu construído usando o popup acima:

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

/\*_ Obtém os itens de menu atualmente mostrados (lista vazia se menu está fechado). _/
getItems = this.locatorForAll(MyMenuItemHarness);

/\*_ Alterna estado aberto do menu. _/
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

Quando uma página contém múltiplas instâncias de um component particular, você pode querer filtrar baseado em alguma propriedade do component para obter uma instância de component particular. Por exemplo, você pode querer um botão com algum texto específico, ou um menu com um ID específico. A classe `HarnessPredicate` pode capturar critérios como este para uma subclasse de `ComponentHarness`. Embora o autor do teste seja capaz de construir instâncias de `HarnessPredicate` manualmente, é mais fácil quando a subclasse `ComponentHarness` fornece um método helper para construir predicados para filtros comuns.

Você deve criar um método estático `with()` em cada subclasse de `ComponentHarness` que retorna um `HarnessPredicate` para aquela classe. Isso permite que autores de testes escrevam código facilmente compreensível, por exemplo `loader.getHarness(MyMenuHarness.with({selector: '#menu1'}))`. Além das opções padrão selector e ancestor, o método `with` deve adicionar quaisquer outras opções que façam sentido para a subclasse particular.

Harnesses que precisam adicionar opções adicionais devem estender a interface `BaseHarnessFilters` e propriedades opcionais adicionais conforme necessário. `HarnessPredicate` fornece vários métodos de conveniência para adicionar opções: `stringMatches()`, `addOption()`, e `add()`. Veja a [página da API HarnessPredicate](/api/cdk/testing/HarnessPredicate) para a descrição completa.

Por exemplo, ao trabalhar com um menu é útil filtrar baseado no texto do trigger e filtrar itens de menu baseado em seu texto:

<docs-code language="typescript">
interface MyMenuHarnessFilters extends BaseHarnessFilters {
  /** Filtra baseado no texto do trigger para o menu. */
  triggerText?: string | RegExp;
}

interface MyMenuItemHarnessFilters extends BaseHarnessFilters {
/\*_ Filtra baseado no texto do item de menu. _/
text?: string | RegExp;
}

class MyMenuHarness extends ComponentHarness {
static hostSelector = 'my-menu';

/\*_ Cria um `HarnessPredicate` usado para localizar um `MyMenuHarness` particular. _/
static with(options: MyMenuHarnessFilters): HarnessPredicate<MyMenuHarness> {
return new HarnessPredicate(MyMenuHarness, options)
.addOption('trigger text', options.triggerText,
(harness, text) => HarnessPredicate.stringMatches(harness.getTriggerText(), text));
}

protected getPopupHarness = this.locatorFor(MyPopupHarness);

/\*_ Obtém o texto do trigger do menu. _/
async getTriggerText(): Promise<string> {
const popupHarness = await this.getPopupHarness();
return popupHarness.getTriggerText();
}
...
}

class MyMenuItemHarness extends ComponentHarness {
static hostSelector = 'my-menu-item';

/\*_ Cria um `HarnessPredicate` usado para localizar um `MyMenuItemHarness` particular. _/
static with(options: MyMenuItemHarnessFilters): HarnessPredicate<MyMenuItemHarness> {
return new HarnessPredicate(MyMenuItemHarness, options)
.addOption('text', options.text,
(harness, text) => HarnessPredicate.stringMatches(harness.getText(), text));
}

/\*_ Obtém o texto do item de menu. _/
async getText(): Promise<string> {
const host = await this.host();
return host.text();
}
}
</docs-code>

Você pode passar um `HarnessPredicate` em vez de uma classe `ComponentHarness` para qualquer uma das APIs em `HarnessLoader`, `LocatorFactory`, ou `ComponentHarness`. Isso permite que autores de testes facilmente alvejam uma instância de component particular ao criar uma instância de harness. Também permite que o autor do harness aproveite o mesmo `HarnessPredicate` para habilitar APIs mais poderosas em sua classe de harness. Por exemplo, considere o método `getItems` no `MyMenuHarness` mostrado acima. Adicionar uma API de filtragem permite que usuários do harness procurem por itens de menu particulares:

<docs-code language="typescript">
class MyMenuHarness extends ComponentHarness {
  static hostSelector = 'my-menu';

/\*_ Obtém uma lista de itens no menu, opcionalmente filtrados baseado nos critérios fornecidos. _/
async getItems(filters: MyMenuItemHarnessFilters = {}): Promise<MyMenuItemHarness[]> {
const getFilteredItems = this.locatorForAll(MyMenuItemHarness.with(filters));
return getFilteredItems();
}
...
}
</docs-code>

## Criando `HarnessLoader` para elementos que usam projeção de conteúdo

Alguns components projetam conteúdo adicional no template do component. Veja o [guia de projeção de conteúdo](guide/components/content-projection) para mais informações.

Adicione uma instância de `HarnessLoader` com escopo ao elemento contendo o `<ng-content>` quando você cria um harness para um component que usa projeção de conteúdo. Isso permite que o usuário do harness carregue harnesses adicionais para quaisquer components que foram passados como conteúdo. `ComponentHarness` tem vários métodos que podem ser usados para criar instâncias de HarnessLoader para casos como este: `harnessLoaderFor()`, `harnessLoaderForOptional()`, `harnessLoaderForAll()`. Veja a [página de referência da API da interface HarnessLoader](/api/cdk/testing/HarnessLoader) para mais detalhes.

Por exemplo, o exemplo `MyPopupHarness` acima pode estender `ContentContainerComponentHarness` para adicionar suporte para carregar harnesses dentro do `<ng-content>` do component.

<docs-code language="typescript">
class MyPopupHarness extends ContentContainerComponentHarness<string> {
  static hostSelector = 'my-popup';
}
</docs-code>

## Acessando elementos fora do elemento host do component

Há momentos em que um component harness pode precisar acessar elementos fora do elemento host de seu component correspondente. Por exemplo, código que exibe um elemento flutuante ou pop-up frequentemente anexa elementos DOM diretamente ao body do documento, como o service `Overlay` no Angular CDK.

Neste caso, `ComponentHarness` fornece um método que pode ser usado para obter um `LocatorFactory` para o elemento raiz do documento. O `LocatorFactory` suporta a maioria das mesmas APIs que a classe base `ComponentHarness`, e pode então ser usado para consultar relativo ao elemento raiz do documento.

Considere se o component `MyPopup` acima usasse o CDK overlay para o conteúdo do popup, em vez de um elemento em seu próprio template. Neste caso, `MyPopupHarness` teria que acessar o elemento de conteúdo através do método `documentRootLocatorFactory()` que obtém um locator factory enraizado na raiz do documento.

<docs-code language="typescript">
class MyPopupHarness extends ComponentHarness {
  static hostSelector = 'my-popup';

/\*_ Obtém um `HarnessLoader` cujo elemento raiz é o elemento de conteúdo do popup. _/
async getHarnessLoaderForContent(): Promise<HarnessLoader> {
const rootLocator = this.documentRootLocatorFactory();
return rootLocator.harnessLoaderFor('my-popup-content');
}
}
</docs-code>

## Aguardando por tarefas assíncronas

Os métodos em `TestElement` automaticamente disparam a detecção de mudanças do Angular e aguardam por tarefas dentro da `NgZone`. Na maioria dos casos nenhum esforço especial é necessário para autores de harness aguardarem por tarefas assíncronas. No entanto, há alguns casos extremos onde isso pode não ser suficiente.

Sob algumas circunstâncias, animations Angular podem requerer um segundo ciclo de detecção de mudanças e subsequente estabilização da `NgZone` antes que eventos de animation sejam totalmente liberados. Em casos onde isso é necessário, o `ComponentHarness` oferece um método `forceStabilize()` que pode ser chamado para fazer a segunda rodada.

Você pode usar `NgZone.runOutsideAngular()` para agendar tarefas fora da NgZone. Chame o método `waitForTasksOutsideAngular()` no harness correspondente se você precisa explicitamente aguardar por tarefas fora da `NgZone` já que isso não acontece automaticamente.
