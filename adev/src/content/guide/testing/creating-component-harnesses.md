<!-- ia-translate: true -->

# Criando harnesses para seus components

## Antes de começar {#before-you-start}

TIP: Este guia pressupõe que você já leu o [guia de visão geral dos component harnesses](guide/testing/component-harnesses-overview). Leia-o primeiro se você é novo no uso de component harnesses.

### Quando criar um test harness faz sentido? {#when-does-creating-a-test-harness-make-sense}

A equipe do Angular recomenda criar component test harnesses para components compartilhados que são usados em muitos lugares e têm alguma interatividade com o usuário. Isso se aplica com mais frequência a bibliotecas de widgets e components reutilizáveis semelhantes. Harnesses são valiosos nesses casos porque oferecem aos consumidores desses components compartilhados uma API bem suportada para interagir com o component. Testes que usam harnesses podem evitar depender de detalhes de implementação pouco confiáveis desses components compartilhados, como a estrutura do DOM e os event listeners específicos.

Para components que aparecem em apenas um lugar, como uma página de uma aplicação, os harnesses não trazem tanto benefício. Nessas situações, os testes de um component podem depender razoavelmente dos detalhes de implementação desse component, já que os testes e os components são atualizados ao mesmo tempo. No entanto, os harnesses ainda agregam algum valor se você for usá-los tanto em testes unitários quanto em testes end-to-end.

### Instalação do CDK {#cdk-installation}

O [Component Dev Kit (CDK)](https://material.angular.dev/cdk/categories) é um conjunto de primitivas de comportamento para construir components. Para usar os component harnesses, primeiro instale o `@angular/cdk` pelo npm. Você pode fazer isso no terminal usando o Angular CLI:

```shell
ng add @angular/cdk
```

## Estendendo o `ComponentHarness` {#extending-componentharness}

A classe abstrata `ComponentHarness` é a classe base de todos os component harnesses. Para criar um component harness personalizado, estenda `ComponentHarness` e implemente a propriedade estática `hostSelector`.

A propriedade `hostSelector` identifica os elementos no DOM que correspondem a esta subclasse de harness. Na maioria dos casos, o `hostSelector` deve ser igual ao seletor do `Component` ou da `Directive` correspondente. Por exemplo, considere um component de popup simples:

```ts
@Component({
  selector: 'my-popup',
  template: `
    <button (click)="toggle()">{{ triggerText() }}</button>
    @if (isOpen()) {
      <div class="my-popup-content"><ng-content /></div>
    }
  `,
})
class MyPopup {
  triggerText = input('');

  isOpen = signal(false);

  toggle() {
    this.isOpen.update((value) => !value);
  }
}
```

Neste caso, um harness mínimo para o component ficaria assim:

```ts
class MyPopupHarness extends ComponentHarness {
  static hostSelector = 'my-popup';
}
```

Embora as subclasses de `ComponentHarness` exijam apenas a propriedade `hostSelector`, a maioria dos harnesses também deve implementar um método estático `with` para gerar instâncias de `HarnessPredicate`. A [seção de harnesses com filtros](guide/testing/using-component-harnesses#filtering-harnesses) aborda isso com mais detalhes.

## Encontrando elementos no DOM do component {#finding-elements-in-the-components-dom}

Cada instância de uma subclasse de `ComponentHarness` representa uma instância específica do component correspondente. Você pode acessar o elemento host do component pelo método `host() ` da classe base `ComponentHarness`.

`ComponentHarness` também oferece vários métodos para localizar elementos dentro do DOM do component. Esses métodos são `locatorFor()`, `locatorForOptional()` e `locatorForAll()`. Eles criam funções que encontram elementos; não encontram os elementos diretamente. Essa abordagem protege contra o cache de referências a elementos desatualizados. Por exemplo, quando um bloco `@if` oculta e depois mostra um elemento, o resultado é um novo elemento DOM; usar funções garante que os testes sempre referenciem o estado atual do DOM.

Veja a [página de referência da API do ComponentHarness](/api/cdk/testing/ComponentHarness) para a lista completa de detalhes dos diferentes métodos `locatorFor`.

Por exemplo, o `MyPopupHarness` discutido acima poderia fornecer métodos para obter os elementos de trigger e de conteúdo, assim:

```ts
class MyPopupHarness extends ComponentHarness {
  static hostSelector = 'my-popup';

  // Obtém o elemento trigger
  getTriggerElement = this.locatorFor('button');

  // Obtém o elemento de conteúdo.
  getContentElement = this.locatorForOptional('.my-popup-content');
}
```

## Trabalhando com instâncias de `TestElement` {#working-with-testelement-instances}

`TestElement` é uma abstração projetada para funcionar em diferentes ambientes de teste (testes unitários, WebDriver etc.). Ao usar harnesses, você deve fazer toda a interação com o DOM por meio dessa interface. Outras formas de acessar elementos do DOM, como `document.querySelector()`, não funcionam em todos os ambientes de teste.

`TestElement` tem vários métodos para interagir com o DOM subjacente, como `blur()`, `click()`, `getAttribute()` e outros. Veja a [página de referência da API do TestElement](/api/cdk/testing/TestElement) para a lista completa de métodos.

Não exponha instâncias de `TestElement` aos usuários do harness, a menos que seja um elemento que o consumidor do component define diretamente, como o elemento host do component. Expor instâncias de `TestElement` de elementos internos leva os usuários a depender da estrutura DOM interna de um component.

Em vez disso, forneça métodos mais focados em ações específicas que o usuário final pode realizar ou em estados particulares que ele pode observar. Por exemplo, o `MyPopupHarness` das seções anteriores poderia fornecer métodos como `toggle` e `isOpen`:

```ts
class MyPopupHarness extends ComponentHarness {
  static hostSelector = 'my-popup';

  protected getTriggerElement = this.locatorFor('button');
  protected getContentElement = this.locatorForOptional('.my-popup-content');

  /** Alterna o estado aberto do popup. */
  async toggle() {
    const trigger = await this.getTriggerElement();
    return trigger.click();
  }

  /** Verifica se o popup está aberto. */
  async isOpen() {
    const content = await this.getContentElement();
    return !!content;
  }
}
```

## Carregando harnesses para subcomponents {#loading-harnesses-for-subcomponents}

Components maiores frequentemente compõem sub-components. Você pode refletir essa estrutura também no harness de um component. Cada um dos métodos `locatorFor` do `ComponentHarness` tem uma assinatura alternativa que pode ser usada para localizar sub-harnesses em vez de elementos.

Veja a [página de referência da API do ComponentHarness](/api/cdk/testing/ComponentHarness) para a lista completa dos diferentes métodos locatorFor.

Por exemplo, considere um menu construído com o popup visto acima:

```ts
@Directive({
  selector: 'my-menu-item',
})
class MyMenuItem {}

@Component({
  selector: 'my-menu',
  template: `
    <my-popup>
      <ng-content />
    </my-popup>
  `,
})
class MyMenu {
  triggerText = input('');

  items = contentChildren(MyMenuItem);
}
```

O harness de `MyMenu` pode então aproveitar os outros harnesses de `MyPopup` e `MyMenuItem`:

```ts
class MyMenuHarness extends ComponentHarness {
  static hostSelector = 'my-menu';

  protected getPopupHarness = this.locatorFor(MyPopupHarness);

  /** Obtém os itens do menu atualmente exibidos (lista vazia se o menu estiver fechado). */
  getItems = this.locatorForAll(MyMenuItemHarness);

  /** Alterna o estado aberto do menu. */
  async toggle() {
    const popupHarness = await this.getPopupHarness();
    return popupHarness.toggle();
  }
}

class MyMenuItemHarness extends ComponentHarness {
  static hostSelector = 'my-menu-item';
}
```

## Filtrando instâncias de harness com `HarnessPredicate` {#filtering-harness-instances-with-harnesspredicate}

Quando uma página contém várias instâncias de um component específico, você pode querer filtrar com base em alguma propriedade do component para obter uma instância específica. Por exemplo, você pode querer um botão com um texto específico, ou um menu com um ID específico. A classe `HarnessPredicate` pode capturar critérios como esses para uma subclasse de `ComponentHarness`. Embora o autor do teste consiga construir instâncias de `HarnessPredicate` manualmente, é mais fácil quando a subclasse de `ComponentHarness` fornece um método auxiliar para construir predicados para filtros comuns.

Você deve criar um método estático `with()` em cada subclasse de `ComponentHarness`, que retorna um `HarnessPredicate` para essa classe. Isso permite que os autores de testes escrevam código de fácil compreensão, por exemplo `loader.getHarness(MyMenuHarness.with({selector: '#menu1'}))`. Além das opções padrão de selector e ancestor, o método `with` deve adicionar quaisquer outras opções que façam sentido para a subclasse específica.

Harnesses que precisam adicionar opções extras devem estender a interface `BaseHarnessFilters` e incluir propriedades opcionais adicionais conforme necessário. `HarnessPredicate` fornece vários métodos de conveniência para adicionar opções: `stringMatches()`, `addOption()` e `add()`. Veja a [página da API do HarnessPredicate](/api/cdk/testing/HarnessPredicate) para a descrição completa.

Por exemplo, ao trabalhar com um menu, é útil filtrar com base no texto do trigger e filtrar os itens do menu com base no seu texto:

```ts
interface MyMenuHarnessFilters extends BaseHarnessFilters {
  /** Filtra com base no texto do trigger do menu. */
  triggerText?: string | RegExp;
}

interface MyMenuItemHarnessFilters extends BaseHarnessFilters {
  /** Filtra com base no texto do item do menu. */
  text?: string | RegExp;
}

class MyMenuHarness extends ComponentHarness {
  static hostSelector = 'my-menu';

  /** Cria um `HarnessPredicate` usado para localizar um `MyMenuHarness` específico. */
  static with(options: MyMenuHarnessFilters): HarnessPredicate<MyMenuHarness> {
    return new HarnessPredicate(MyMenuHarness, options).addOption(
      'trigger text',
      options.triggerText,
      (harness, text) => HarnessPredicate.stringMatches(harness.getTriggerText(), text),
    );
  }

  protected getPopupHarness = this.locatorFor(MyPopupHarness);

  /** Obtém o texto do trigger do menu. */
  async getTriggerText(): Promise<string> {
    const popupHarness = await this.getPopupHarness();
    return popupHarness.getTriggerText();
  }
}

class MyMenuItemHarness extends ComponentHarness {
  static hostSelector = 'my-menu-item';

  /** Cria um `HarnessPredicate` usado para localizar um `MyMenuItemHarness` específico. */
  static with(options: MyMenuItemHarnessFilters): HarnessPredicate<MyMenuItemHarness> {
    return new HarnessPredicate(MyMenuItemHarness, options).addOption(
      'text',
      options.text,
      (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text),
    );
  }

  /** Obtém o texto do item do menu. */
  async getText(): Promise<string> {
    const host = await this.host();
    return host.text();
  }
}
```

Você pode passar um `HarnessPredicate` em vez de uma classe `ComponentHarness` para qualquer uma das APIs de `HarnessLoader`, `LocatorFactory` ou `ComponentHarness`. Isso permite que os autores de testes direcionem facilmente uma instância específica de component ao criar uma instância de harness. Também permite que o autor do harness use o mesmo `HarnessPredicate` para habilitar APIs mais poderosas na sua classe de harness. Por exemplo, considere o método `getItems` do `MyMenuHarness` mostrado acima. Adicionar uma API de filtragem permite que os usuários do harness procurem itens de menu específicos:

```ts
class MyMenuHarness extends ComponentHarness {
  static hostSelector = 'my-menu';

  /** Obtém uma lista de itens do menu, opcionalmente filtrada com base nos critérios informados. */
  async getItems(filters: MyMenuItemHarnessFilters = {}): Promise<MyMenuItemHarness[]> {
    const getFilteredItems = this.locatorForAll(MyMenuItemHarness.with(filters));
    return getFilteredItems();
  }
  ...
}
```

## Criando `HarnessLoader` para elementos que usam projeção de conteúdo {#creating-harnessloader-for-elements-that-use-content-projection}

Alguns components projetam conteúdo adicional no template do component. Veja o [guia de projeção de conteúdo](guide/components/content-projection) para mais informações.

Adicione uma instância de `HarnessLoader` com escopo no elemento que contém o `<ng-content>` ao criar um harness para um component que usa projeção de conteúdo. Isso permite que o usuário do harness carregue harnesses adicionais para quaisquer components passados como conteúdo. `ComponentHarness` tem vários métodos que podem ser usados para criar instâncias de HarnessLoader nesses casos: `harnessLoaderFor()`, `harnessLoaderForOptional()` e `harnessLoaderForAll()`. Veja a [página de referência da interface HarnessLoader](/api/cdk/testing/HarnessLoader) para mais detalhes.

Por exemplo, o `MyPopupHarness` visto acima pode estender `ContentContainerComponentHarness` para adicionar suporte ao carregamento de harnesses dentro do `<ng-content>` do component.

```ts
class MyPopupHarness extends ContentContainerComponentHarness<string> {
  static hostSelector = 'my-popup';
}
```

## Acessando elementos fora do elemento host do component {#accessing-elements-outside-of-the-components-host-element}

Há momentos em que um component harness pode precisar acessar elementos fora do elemento host do seu component correspondente. Por exemplo, código que exibe um elemento flutuante ou pop-up frequentemente anexa elementos DOM diretamente ao body do documento, como o service `Overlay` do Angular CDK.

Nesse caso, `ComponentHarness` fornece um método que pode ser usado para obter um `LocatorFactory` para o elemento raiz do documento. O `LocatorFactory` oferece a maioria das mesmas APIs da classe base `ComponentHarness` e pode então ser usado para consultar relativamente ao elemento raiz do documento.

Considere que o component `MyPopup` acima usasse o overlay do CDK para o conteúdo do popup, em vez de um elemento no próprio template. Nesse caso, o `MyPopupHarness` teria que acessar o elemento de conteúdo pelo método `documentRootLocatorFactory()`, que obtém um locator factory com raiz na raiz do documento.

```ts
class MyPopupHarness extends ComponentHarness {
  static hostSelector = 'my-popup';

  /** Obtém um `HarnessLoader` cujo elemento raiz é o elemento de conteúdo do popup. */
  async getHarnessLoaderForContent(): Promise<HarnessLoader> {
    const rootLocator = this.documentRootLocatorFactory();
    return rootLocator.harnessLoaderFor('my-popup-content');
  }
}
```

## Aguardando tarefas assíncronas {#waiting-for-asynchronous-tasks}

Os métodos de `TestElement` acionam automaticamente o change detection do Angular e aguardam as tarefas dentro da `NgZone`. Na maioria dos casos, os autores de harness não precisam de nenhum esforço especial para aguardar tarefas assíncronas. No entanto, há alguns casos extremos em que isso pode não ser suficiente.

Em algumas circunstâncias, as animações do Angular podem exigir um segundo ciclo de change detection e a subsequente estabilização da `NgZone` antes que os eventos de animação sejam totalmente processados. Nos casos em que isso for necessário, o `ComponentHarness` oferece um método `forceStabilize()` que pode ser chamado para executar a segunda rodada.

Você pode usar `NgZone.runOutsideAngular()` para agendar tarefas fora da NgZone. Chame o método `waitForTasksOutsideAngular()` no harness correspondente se precisar aguardar explicitamente tarefas fora da `NgZone`, já que isso não acontece automaticamente.
