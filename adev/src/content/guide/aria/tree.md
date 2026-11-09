<!-- ia-translate: true -->
# Tree

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/treeview/" title="Padrão ARIA de tree"/>
  <docs-pill href="/api/aria/tree/Tree" title="Referência da API de Tree"/>
</docs-pill-row>

## Visão geral {#overview}

Uma tree exibe dados hierárquicos em que os itens podem ser expandidos para revelar seus filhos ou recolhidos para ocultá-los. Os usuários navegam com as setas, expandem e recolhem nós e, opcionalmente, selecionam itens para cenários de navegação ou de seleção de dados.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.ts">
  <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.ts"/>
  <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.html"/>
  <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.css"/>
</docs-code-multifile>

## Uso {#usage}

Trees funcionam bem para exibir dados hierárquicos em que os usuários precisam navegar por estruturas aninhadas.

**Use trees quando:**

- Construir a navegação de um sistema de arquivos
- Exibir hierarquias de pastas e documentos
- Criar estruturas de menu aninhadas
- Exibir organogramas
- Navegar por dados hierárquicos
- Implementar a navegação de um site com seções aninhadas

**Evite trees quando:**

- Exibir listas planas (use o [Listbox](guide/aria/listbox) no lugar)
- Mostrar tabelas de dados (use o [Grid](guide/aria/grid) no lugar)
- Criar dropdowns simples (use o [Select](guide/aria/select) no lugar)
- Construir uma navegação em breadcrumb (use os padrões de breadcrumb)

## Recursos {#features}

- **Navegação hierárquica** - Estrutura de árvore aninhada com funcionalidade de expandir e recolher
- **Modos de seleção** - Seleção única ou múltipla com comportamento explícito ou de seguir o foco
- **Seleção segue o foco** - Seleção automática opcional quando o foco muda
- **Navegação por teclado** - Teclas de seta, Home, End e busca por digitação (type-ahead)
- **Expandir/recolher** - Setas para a direita/esquerda ou Enter para alternar nós pai
- **Itens desabilitados** - Desabilite nós específicos com gerenciamento de foco
- **Modos de foco** - Estratégias de foco roving tabindex ou activedescendant
- **Suporte a RTL** - Navegação em idiomas da direita para a esquerda

## Exemplos {#examples}

### Árvore de navegação {#navigation-tree}

Use uma tree para navegação, em que clicar nos itens dispara ações em vez de selecioná-los.

<docs-tab-group>
  <docs-tab label="Básico">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/nav/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/nav/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/nav/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/nav/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Defina `[nav]="true"` para habilitar o modo de navegação. Isso usa `aria-current` para indicar a página atual, em vez de seleção.

### Seleção única {#single-selection}

Habilite a seleção única para cenários em que o usuário escolhe um item da tree.

<docs-tab-group>
  <docs-tab label="Básico">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/single-select/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/single-select/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/single-select/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/single-select/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/single-select/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Mantenha `[multi]="false"` (o padrão) para a seleção única. Os usuários pressionam Espaço para selecionar o item em foco.

### Seleção múltipla {#multi-selection}

Permita que os usuários selecionem múltiplos itens da tree.

<docs-tab-group>
  <docs-tab label="Básico">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/multi-select/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/multi-select/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/multi-select/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/multi-select/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/multi-select/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/multi-select/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/multi-select/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/multi-select/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Defina `[multi]="true"` na tree. Os usuários selecionam itens individualmente com Espaço ou selecionam intervalos com as teclas Shift + setas.

### Seleção segue o foco {#selection-follows-focus}

Quando a seleção segue o foco, o item em foco é selecionado automaticamente. Isso simplifica a interação em cenários de navegação.

<docs-tab-group>
  <docs-tab label="Básico">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/single-select-follow-focus/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Defina `[selectionMode]="'follow'"` na tree. A seleção é atualizada automaticamente conforme os usuários navegam com as setas.

### Itens desabilitados da tree {#disabled-tree-items}

Desabilite nós específicos da tree para impedir a interação. Controle se os itens desabilitados podem receber foco.

<docs-tab-group>
  <docs-tab label="Básico">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/disabled-focusable/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/disabled-focusable/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/disabled-focusable/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/disabled-focusable/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/tree/src/disabled-focusable/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/tree/src/disabled-focusable/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/tree/src/disabled-focusable/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/tree/src/disabled-focusable/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Quando `[softDisabled]="true"` na tree, os itens desabilitados podem receber foco, mas não podem ser ativados nem selecionados. Quando `[softDisabled]="false"`, os itens desabilitados são ignorados durante a navegação pelo teclado.

## Testes {#testing}

A Angular Aria oferece harnesses de componente para testar componentes de tree.
Veja a seguir um exemplo de como usar os harnesses em um teste de componente:

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {TreeHarness} from '@angular/aria/tree/testing';
import {MyTreeComponent} from './my-tree'; // Seu componente

describe('MyTreeComponent', () => {
  let fixture: ComponentFixture<MyTreeComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MyTreeComponent],
    });

    fixture = TestBed.createComponent(MyTreeComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should navigate and expand tree items', async () => {
    const tree = await loader.getHarness(TreeHarness);

    // Obtém a representação da estrutura de nível superior
    expect(await tree.getTreeStructure()).toEqual({
      children: [{text: 'public'}, {text: 'src'}, {text: 'package.json'}],
    });

    // Obtém todos os itens (atualmente visíveis)
    const items = await tree.getItems();
    expect(items.length).toBe(3);

    // Expande o primeiro item ('public')
    expect(await items[0].isExpanded()).toBe(false);
    await items[0].click();
    expect(await items[0].isExpanded()).toBe(true);

    // Verifica se a estrutura da tree é atualizada após a expansão
    expect(await tree.getTreeStructure()).toEqual({
      children: [
        {
          text: 'public',
          children: [{text: 'index.html'}, {text: 'styles.css'}],
        },
        {text: 'src'},
        {text: 'package.json'},
      ],
    });
  });
});
```

## Referência da API {#api-reference}

Para a documentação detalhada da API, consulte as seguintes referências:

- [`Tree`](/api/aria/tree/Tree)
- [`TreeItem`](/api/aria/tree/TreeItem)
- [`TreeItemGroup`](/api/aria/tree/TreeItemGroup)
