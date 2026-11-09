<!-- ia-translate: true -->
# Multiselect

## Visão geral {#overview}

O padrão multiselect combina um trigger de combobox somente leitura com um popup de listbox de múltipla seleção para criar dropdowns de seleção múltipla altamente acessíveis, com navegação por teclado e suporte a leitores de tela.

<docs-tab-group>
  <docs-tab label="Básico">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/icons/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/icons/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/icons/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/icons/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## Uso {#usage}

O padrão multiselect funciona melhor quando os usuários precisam escolher múltiplos itens relacionados de um conjunto familiar de opções.

Considere usar este padrão quando:

- **Os usuários precisam de múltiplas seleções** - Tags, categorias, filtros ou rótulos em que várias escolhas se aplicam
- **A lista de opções é fixa** (menos de 20 itens) - Os usuários podem escanear as opções sem usar busca
- **Filtrar conteúdo** - Múltiplos critérios podem estar ativos ao mesmo tempo
- **Atribuir atributos** - Rótulos, permissões ou recursos em que múltiplos valores fazem sentido
- **Escolhas relacionadas** - Opções que funcionam logicamente em conjunto (como selecionar vários membros de uma equipe)

Evite este padrão quando:

- **Apenas seleção única é necessária** - Use o [padrão Select](guide/aria/select) para dropdowns de escolha única mais simples
- **A lista tem mais de 20 itens e é necessária busca** - Use o [padrão Autocomplete](guide/aria/autocomplete) com capacidade de multisseleção
- **A maioria ou todas as opções serão selecionadas** - Um padrão de checklist oferece melhor visibilidade
- **As escolhas são opções binárias independentes** - Caixas de seleção individuais comunicam as escolhas com mais clareza

## Recursos {#features}

O padrão multiselect combina as directives [Combobox](guide/aria/combobox) e [Listbox](guide/aria/listbox) para fornecer um dropdown totalmente acessível com:

- **Navegação por teclado** - Navegue pelas opções com as setas, alterne com Espaço e feche com Escape
- **Suporte a leitores de tela** - Atributos ARIA integrados, incluindo aria-multiselectable
- **Exibição da contagem de seleção** - Mostra um padrão compacto "Item + 2 mais" para múltiplas seleções
- **Reatividade baseada em signals** - Gerenciamento de estado reativo usando signals do Angular
- **Posicionamento inteligente** - O CDK Overlay lida com as bordas da viewport e com a rolagem
- **Seleção persistente** - As opções selecionadas permanecem visíveis com marcas de seleção após a escolha

## Exemplos {#examples}

### Multiselect básico {#basic-multiselect}

Os usuários precisam selecionar múltiplos itens de uma lista de opções. Um combobox somente leitura pareado com um listbox habilitado para múltipla seleção oferece uma funcionalidade de multisseleção familiar, com suporte completo de acessibilidade.

<docs-tab-group>
  <docs-tab label="Básico">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

O atributo `multi` em `ngListbox` habilita a múltipla seleção. Pressione Espaço para alternar as opções, e o popup permanece aberto para seleções adicionais. A exibição mostra o primeiro item selecionado seguido de uma contagem das seleções restantes.

### Multiselect com exibição personalizada {#multiselect-with-custom-display}

As opções frequentemente precisam de indicadores visuais, como ícones ou cores, para ajudar os usuários a identificar as escolhas. Templates personalizados dentro das opções permitem uma formatação rica, enquanto o valor de exibição mostra um resumo compacto.

<docs-tab-group>
  <docs-tab label="Básico">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/icons/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/icons/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/icons/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/icons/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/icons/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/icons/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Cada opção exibe um ícone ao lado do seu rótulo. O valor de exibição é atualizado para mostrar o ícone e o texto da primeira seleção, seguidos de uma contagem das seleções adicionais. As opções selecionadas mostram uma marca de seleção para um feedback visual claro.

### Seleção controlada {#controlled-selection}

Os formulários às vezes precisam limitar o número de seleções ou validar as escolhas do usuário. O controle programático sobre a seleção possibilita essas restrições e mantém a acessibilidade.

<docs-tab-group>
  <docs-tab label="Básico">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/limited/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/limited/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/limited/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/limited/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/limited/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/limited/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/limited/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/limited/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/limited/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/limited/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/limited/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/limited/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Este exemplo limita as seleções a dois itens. Quando o limite é atingido, as opções não selecionadas são desabilitadas para impedir novas seleções, e o display do combobox é atualizado para refletir as escolhas.

## Testes {#testing}

O padrão multiselect pode ser testado com uma combinação de `ComboboxHarness` e `ListboxHarness`, de `@angular/aria/combobox/testing` e `@angular/aria/listbox/testing`.
Veja a seguir um exemplo de como usar os harnesses para testar um componente multiselect:

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComboboxHarness} from '@angular/aria/combobox/testing';
import {ListboxHarness} from '@angular/aria/listbox/testing';
import {MyMultiselectComponent} from './my-multiselect'; // Seu componente

describe('MyMultiselectComponent', () => {
  let fixture: ComponentFixture<MyMultiselectComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MyMultiselectComponent],
    });

    fixture = TestBed.createComponent(MyMultiselectComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should allow selecting multiple options', async () => {
    const select = await loader.getHarness(ComboboxHarness);

    // Abre o dropdown
    await select.open();

    // Obtém o harness do listbox a partir do popup
    const listbox = await select.getPopupWidget(ListboxHarness);
    expect(await listbox.isMulti()).toBe(true);

    const options = await listbox.getOptions();

    // Seleciona a primeira e a segunda opções
    await options[0].click();
    await options[1].click();

    // Verifica se as duas opções estão selecionadas
    expect(await options[0].isSelected()).toBe(true);
    expect(await options[1].isSelected()).toBe(true);

    // Fecha o dropdown
    await select.close();

    // Verifica se o valor foi atualizado (por exemplo, lista separada por vírgulas ou contagem)
    expect(await (await select.host()).text()).toContain('Option 1, Option 2');
  });
});
```

## Referência da API {#api-reference}

Para a documentação detalhada da API, consulte as seguintes referências:

- [`Combobox`](/api/aria/combobox/Combobox)
- [`ComboboxPopup`](/api/aria/combobox/ComboboxPopup)
- [`ComboboxWidget`](/api/aria/combobox/ComboboxWidget)
- [`Listbox`](/api/aria/listbox/Listbox)
- [`Option`](/api/aria/listbox/Option)
