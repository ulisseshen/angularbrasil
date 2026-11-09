<!-- ia-translate: true -->
# Select

## Visão geral {#overview}

Um padrão que combina um combobox com um listbox para criar listas suspensas de seleção única com navegação por teclado e suporte a leitores de tela.

<docs-tab-group>
  <docs-tab label="Básico">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/icons/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/icons/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/icons/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/icons/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/icons/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/icons/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/icons/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/icons/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/icons/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/icons/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/icons/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/icons/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## Uso {#usage}

O padrão select funciona melhor quando o usuário precisa escolher um único valor de um conjunto familiar de opções.

Considere usar este padrão quando:

- **A lista de opções é fixa** (menos de 20 itens) - Os usuários conseguem examinar e escolher sem filtrar
- **As opções são familiares** - Os usuários reconhecem as escolhas sem precisar pesquisar
- **Formulários precisam de campos padrão** - Seleção de país, estado, categoria ou status
- **Configurações e ajustes** - Menus suspensos para preferências ou opções
- **Rótulos de opção claros** - Cada escolha tem um nome distinto e fácil de examinar

Evite este padrão quando:

- **A lista tem mais de 20 itens** - Use o [padrão Autocomplete](guide/aria/autocomplete) para uma filtragem melhor
- **Os usuários precisam pesquisar opções** - [Autocomplete](guide/aria/autocomplete) oferece campo de texto e filtragem
- **É necessária seleção múltipla** - Use o [padrão Multiselect](guide/aria/multiselect)
- **Existem poucas opções (2-3)** - Botões de opção oferecem melhor visibilidade de todas as escolhas

## Funcionalidades {#features}

O padrão select combina as diretivas [Combobox](guide/aria/combobox) e [Listbox](guide/aria/listbox) para oferecer uma lista suspensa totalmente acessível, com:

- **Navegação por teclado** - Navegue pelas opções com as setas, selecione com Enter e feche com Escape
- **Suporte a leitores de tela** - Atributos ARIA integrados para tecnologias assistivas
- **Exibição personalizada** - Exiba os valores selecionados com ícones, formatação ou conteúdo rico
- **Reatividade baseada em signals** - Gerenciamento de estado reativo usando signals do Angular
- **Posicionamento inteligente** - O CDK Overlay trata as bordas da janela e a rolagem
- **Suporte a texto bidirecional** - Trata automaticamente idiomas da direita para a esquerda (RTL)

## Exemplos {#examples}

### Select básico {#basic-select}

Os usuários precisam de uma lista suspensa padrão para escolher um valor entre uma lista de opções. Um combobox combinado com um listbox oferece a experiência familiar de select, com suporte completo à acessibilidade.

<docs-tab-group>
  <docs-tab label="Básico">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

A digitação de texto é impedida ao aplicar a diretiva `ngCombobox` diretamente em um elemento host não interativo (como um `div` ou um `button`), em vez de um `<input>`. Os usuários interagem com a lista suspensa usando as setas e Enter, exatamente como em um elemento select nativo.

### Select com exibição personalizada {#select-with-custom-display}

As opções muitas vezes precisam de indicadores visuais, como ícones ou badges, para ajudar os usuários a identificar as escolhas rapidamente. Templates personalizados dentro das opções permitem uma formatação rica, mantendo a acessibilidade.

<docs-tab-group>
  <docs-tab label="Básico">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/icons/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/icons/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/icons/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/icons/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/icons/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/icons/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/icons/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/icons/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/icons/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/icons/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/icons/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/icons/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Cada opção exibe um ícone ao lado do rótulo. O valor selecionado é atualizado para mostrar o ícone e o texto da opção escolhida, oferecendo retorno visual claro.

### Select desabilitado {#disabled-select}

Selects podem ser desabilitados para impedir a interação do usuário quando certas condições do formulário não são atendidas. O estado desabilitado oferece retorno visual e impede a interação pelo teclado.

<docs-tab-group>
  <docs-tab label="Básico">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/disabled/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/disabled/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/disabled/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/disabled/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/disabled/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/disabled/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/disabled/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/disabled/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/disabled/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/disabled/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/disabled/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/disabled/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Quando desabilitado, o select mostra um estado visual de desabilitado e bloqueia toda a interação do usuário. Leitores de tela anunciam o estado desabilitado para usuários de tecnologias assistivas.

## Testes {#testing}

O padrão select pode ser testado usando uma combinação de `ComboboxHarness` e `ListboxHarness`, de `@angular/aria/combobox/testing` e `@angular/aria/listbox/testing`.
Veja a seguir um exemplo de como usar os harnesses para testar um componente select:

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComboboxHarness} from '@angular/aria/combobox/testing';
import {ListboxHarness} from '@angular/aria/listbox/testing';
import {MySelectComponent} from './my-select'; // Seu componente

describe('MySelectComponent', () => {
  let fixture: ComponentFixture<MySelectComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MySelectComponent],
    });

    fixture = TestBed.createComponent(MySelectComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should allow selecting an option', async () => {
    // Carrega o harness do combobox (que atua como o gatilho do select)
    const select = await loader.getHarness(ComboboxHarness);

    // Verifica que está fechado inicialmente
    expect(await select.isOpen()).toBe(false);

    // Abre a lista suspensa
    await select.open();
    expect(await select.isOpen()).toBe(true);

    // Obtém o harness do listbox a partir do popup
    const listbox = await select.getPopupWidget(ListboxHarness);
    const options = await listbox.getOptions();
    expect(options.length).toBe(3);

    // Clica na segunda opção
    await options[1].click();

    // Verifica que a lista suspensa foi fechada e o valor foi atualizado
    expect(await select.isOpen()).toBe(false);
    expect(await (await select.host()).text()).toContain('Option 2');
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

### Posicionamento {#positioning}

O padrão select se integra ao [CDK Overlay](https://material.angular.dev/cdk/overlay/overview) para um posicionamento inteligente. Use `cdkConnectedOverlay` para tratar as bordas da janela e a rolagem automaticamente.
