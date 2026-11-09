<!-- ia-translate: true -->
# Grid

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/grid/" title="Padrão ARIA de grid"/>
  <docs-pill href="/api?query=grid#angular_aria_grid" title="Referência da API de Grid"/>
</docs-pill-row>

## Visão geral {#overview}

Um grid permite que os usuários naveguem por dados bidimensionais ou elementos interativos usando as teclas de seta direcionais, Home, End e Page Up/Down. Grids funcionam para tabelas de dados, calendários, planilhas e padrões de layout que agrupam elementos interativos relacionados.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/overview/basic/app/app.ts">
  <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/overview/basic/app/app.ts"/>
  <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/overview/basic/app/app.html"/>
  <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/overview/basic/app/app.css"/>
</docs-code-multifile>

## Uso {#usage}

Grids funcionam bem para dados ou elementos interativos organizados em linhas e colunas, nos quais os usuários precisam de navegação por teclado em múltiplas direções.

**Use grids quando:**

- Estiver construindo tabelas de dados interativas com células editáveis ou selecionáveis
- Estiver criando calendários ou seletores de data
- Estiver implementando interfaces semelhantes a planilhas
- Estiver agrupando elementos interativos (botões, caixas de seleção) para reduzir as paradas do tab em uma página
- Estiver construindo interfaces que exigem navegação por teclado bidimensional

**Evite grids quando:**

- Estiver exibindo tabelas simples somente leitura (use o `<table>` HTML semântico no lugar)
- Estiver mostrando listas de coluna única (use [Listbox](guide/aria/listbox) no lugar)
- Estiver exibindo dados hierárquicos (use [Tree](guide/aria/tree) no lugar)
- Estiver construindo formulários sem layout tabular (use os controles de formulário padrão)

## Recursos {#features}

- **Navegação bidimensional** - As teclas de seta movem entre as células em todas as direções
- **Modos de foco** - Escolha entre as estratégias de foco roving tabindex ou activedescendant
- **Suporte a seleção** - Seleção de células opcional, com modos de seleção única ou múltipla
- **Comportamento de quebra** - Configure como a navegação se comporta nas bordas do grid (contínua, em loop ou sem quebra)
- **Seleção por intervalo** - Selecione várias células com teclas modificadoras ou arrastando
- **Estados desabilitados** - Desabilite o grid inteiro ou células individuais
- **Suporte a RTL** - Navegação automática para idiomas da direita para a esquerda

## Exemplos {#examples}

### Grid de tabela de dados {#data-table-grid}

Use um grid para tabelas interativas nas quais os usuários precisam navegar entre as células com as teclas de seta. Este exemplo mostra uma tabela de dados básica com navegação por teclado.

<docs-tab-group>
  <docs-tab label="Básico">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/table/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/table/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/table/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/table/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/table/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/table/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/table/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/table/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Aplique a diretiva `ngGrid` ao elemento da tabela, `ngGridRow` a cada linha e `ngGridCell` a cada célula.

### Grid de calendário {#calendar-grid}

Calendários são um caso de uso comum para grids. Este exemplo mostra uma visualização mensal em que os usuários navegam pelas datas usando as teclas de seta.

<docs-tab-group>
  <docs-tab label="Básico">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/calendar/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/calendar/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/calendar/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/calendar/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/calendar/material/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/calendar/material/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/calendar/material/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/calendar/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/calendar/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/calendar/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/calendar/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/calendar/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Os usuários podem ativar uma data pressionando Enter ou Space quando a célula estiver focada.

### Grid de layout {#layout-grid}

Use um grid de layout para agrupar elementos interativos e reduzir as paradas do tab. Este exemplo mostra um grid de botões em formato de pílula.

<docs-tab-group>
  <docs-tab label="Básico">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/pill-list/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/pill-list/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/pill-list/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/pill-list/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/pill-list/material/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/pill-list/material/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/pill-list/material/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/pill-list/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/grid/src/pill-list/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/grid/src/pill-list/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/grid/src/pill-list/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/grid/src/pill-list/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Em vez de percorrer cada botão com o tab, os usuários navegam com as teclas de seta e apenas um botão recebe o foco do tab.

### Modos de seleção e de foco {#selection-and-focus-modes}

Habilite a seleção com `[enableSelection]="true"` e configure como o foco e a seleção interagem.

```angular-html
<table
  ngGrid
  [enableSelection]="true"
  [selectionMode]="'explicit'"
  [multi]="true"
  [focusMode]="'roving'"
>
  <tr ngGridRow>
    <td ngGridCell>Cell 1</td>
    <td ngGridCell>Cell 2</td>
  </tr>
</table>
```

**Modos de seleção:**

- `follow`: a célula focada é selecionada automaticamente
- `explicit`: os usuários selecionam as células com Space ou clique

**Modos de foco:**

- `roving`: o foco se move entre as células usando `tabindex` (melhor para grids simples)
- `activedescendant`: o foco permanece no container do grid, e `aria-activedescendant` indica a célula ativa (melhor para rolagem virtual)

## Testes {#testing}

O Angular Aria fornece harnesses de componente para testar componentes de grid.
Veja um exemplo de como usar os harnesses em um teste de component:

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {GridHarness} from '@angular/aria/grid/testing';
import {MyGridComponent} from './my-grid'; // Seu component

describe('MyGridComponent', () => {
  let fixture: ComponentFixture<MyGridComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MyGridComponent],
    });

    fixture = TestBed.createComponent(MyGridComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should read cell values and focus cells', async () => {
    const grid = await loader.getHarness(GridHarness);

    // Obtém o texto de todas as células em um array 2D organizado por linhas
    const cellTexts = await grid.getCellTextByIndex();
    expect(cellTexts).toEqual([
      ['Cell 1.1', 'Cell 1.2'],
      ['Cell 2.1', 'Cell 2.2'],
    ]);

    // Obtém uma célula específica pelo texto
    const cells = await grid.getCells({text: 'Cell 1.1'});
    expect(cells.length).toBe(1);
    const cell = cells[0];

    // Verifica o estado da célula
    expect(await cell.isSelected()).toBe(true);
    expect(await cell.isActive()).toBe(true);

    // Foca a célula
    await cell.focus();
    expect(await cell.isFocused()).toBe(true);
  });
});
```

## Referência da API {#api-reference}

Para a documentação detalhada da API, consulte as seguintes referências:

- [`Grid`](/api/aria/grid/Grid)
- [`GridRow`](/api/aria/grid/GridRow)
- [`GridCell`](/api/aria/grid/GridCell)
- [`GridCellWidget`](/api/aria/grid/GridCellWidget)
