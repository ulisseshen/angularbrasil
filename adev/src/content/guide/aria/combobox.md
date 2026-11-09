<!-- ia-translate: true -->
# Combobox

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/combobox/" title="Padrão ARIA de combobox"/>
  <docs-pill href="/api?query=combobox#angular_aria_combobox" title="Referência da API de Combobox"/>
</docs-pill-row>

## Visão geral {#overview}

Uma directive que coordena um elemento de gatilho (como um input de texto, um botão ou uma `div`) com um popup, oferecendo a directive primitiva para os padrões de autocomplete, select e multiselect.

<docs-tab-group>
  <docs-tab label="Básico">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/manual/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/manual/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/manual/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/manual/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/manual/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/manual/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/manual/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/manual/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/manual/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/manual/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/manual/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/manual/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## Uso {#usage}

Combobox é a directive primitiva que coordena um elemento de gatilho interativo (como um input de texto, um botão ou uma `div`) com um popup. Ela serve de base para os padrões de autocomplete, select e multiselect. Considere usar combobox diretamente quando:

- **Estiver construindo padrões de autocomplete personalizados** - Criando comportamentos especializados de filtragem ou de sugestão
- **Estiver criando components de seleção personalizados** - Desenvolvendo dropdowns com requisitos únicos
- **Precisar coordenar o input com um popup** - Associando um input de texto a conteúdo de listbox, tree ou dialog
- **Estiver implementando filtragem personalizada** - Filtrando e orquestrando as opções correspondentes no código da sua aplicação

Use os padrões documentados no lugar quando:

- Precisar de um autocomplete padrão com filtragem - Veja o [padrão de Autocomplete](guide/aria/autocomplete) para exemplos prontos para uso
- Precisar de dropdowns de seleção única - Veja o [padrão de Select](guide/aria/select) para uma implementação completa de dropdown
- Precisar de dropdowns de seleção múltipla - Veja o [padrão de Multiselect](guide/aria/multiselect) para seleção múltipla com exibição compacta

NOTE: Os guias de [Autocomplete](guide/aria/autocomplete), [Select](guide/aria/select) e [Multiselect](guide/aria/multiselect) mostram padrões documentados que combinam esta directive com o [Listbox](guide/aria/listbox) para casos de uso específicos.

## Recursos {#features}

O combobox do Angular fornece um sistema totalmente acessível de coordenação entre input e popup, com:

- **Elemento de gatilho com popup** - Coordena o elemento de gatilho com o conteúdo do popup
- **Coordenação flexível** - Integra-se perfeitamente com layouts padrão (listbox, tree, grid ou dialog)
- **Navegação por teclado** - Tratamento de setas, Enter e Escape
- **Suporte a leitores de tela** - Atributos ARIA integrados, incluindo role="combobox" e aria-expanded
- **Gerenciamento de popup** - Exibição e ocultação automáticas com base na interação do usuário
- **Reatividade baseada em signals** - Gerenciamento de estado reativo usando signals do Angular

## Exemplos {#examples}

### Autocomplete {#autocomplete}

Um campo de input acessível que filtra e sugere opções conforme o usuário digita, ajudando-o a encontrar e selecionar valores de uma lista.

<docs-tab-group>
  <docs-tab label="Básico">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/autocomplete/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

A filtragem é gerenciada no código da sua aplicação, atualizando um signal que filtra a lista de opções de forma reativa. Os usuários navegam com as setas e selecionam com Enter ou clique. Isso oferece controle completo e máxima flexibilidade para uma lógica de seleção personalizada. Veja o [guia de Autocomplete](guide/aria/autocomplete) para padrões e exemplos completos de filtragem.

### Modo somente leitura {#readonly-mode}

Um padrão que combina um combobox somente leitura com um listbox para criar dropdowns de seleção única com navegação por teclado e suporte a leitores de tela.

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

Para disparar um dropdown sem input de texto, use um botão como elemento host do gatilho ou aplique o atributo nativo HTML `readonly` ao input do gatilho. O popup abre com um clique ou com as setas do teclado.

Esta configuração é a base dos padrões [Select](guide/aria/select) e [Multiselect](guide/aria/multiselect). Veja esses guias para implementações completas de dropdown, com gatilhos e posicionamento de overlay.

### Grid de datepicker {#datepicker-grid}

O combobox pode coordenar um grid bidimensional para criar datepickers acessíveis. Os usuários navegam pelas datas dentro da tabela de grid do calendário usando as setas direcionais e confirmam a seleção com clique, Enter ou Spacebar.

<docs-tab-group>
  <docs-tab label="Básico">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/datepicker/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/datepicker/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/datepicker/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/combobox/src/datepicker/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/datepicker/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/datepicker/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/datepicker/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/combobox/src/datepicker/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/datepicker/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/datepicker/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/datepicker/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/combobox/src/datepicker/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

### Popup de dialog {#dialog-popup}

Popups de dialog combinam o gatilho do combobox com layouts de dialog padrão e focus traps (como o `cdkTrapFocus` do CDK). Use popups de dialog quando o overlay exigir comportamento modal ou interação com o backdrop.

<docs-tab-group>
  <docs-tab label="Básico">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/dialog/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/dialog/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/dialog/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/combobox/src/dialog/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/dialog/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/dialog/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/dialog/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/combobox/src/dialog/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/dialog/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/dialog/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/dialog/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/combobox/src/dialog/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## Testes {#testing}

O Angular Aria fornece um `ComboboxHarness` para testar components de combobox.
Veja um exemplo de como usar o harness em um teste de component:

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ComboboxHarness} from '@angular/aria/combobox/testing';
import {MyComboboxComponent} from './my-combobox'; // Seu component

describe('MyComboboxComponent', () => {
  let fixture: ComponentFixture<MyComboboxComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MyComboboxComponent],
    });

    fixture = TestBed.createComponent(MyComboboxComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should allow opening and closing the popup', async () => {
    const combobox = await loader.getHarness(ComboboxHarness);

    // Verifica o estado inicial
    expect(await combobox.isOpen()).toBe(false);

    // Abre o popup
    await combobox.open();
    expect(await combobox.isOpen()).toBe(true);

    // Fecha o popup
    await combobox.close();
    expect(await combobox.isOpen()).toBe(false);
  });
});
```

## Referência da API {#api-reference}

Para a documentação detalhada da API, consulte as seguintes referências:

- [`Combobox`](/api/aria/combobox/Combobox)
- [`ComboboxPopup`](/api/aria/combobox/ComboboxPopup)
- [`ComboboxWidget`](/api/aria/combobox/ComboboxWidget)

### Padrões e directives relacionados {#related-patterns-and-directives}

O combobox é a directive primitiva para estes padrões documentados:

- [Autocomplete](guide/aria/autocomplete) - Padrão de filtragem e sugestões (coordena a digitação no input com a lista de opções)
- [Select](guide/aria/select) - Padrão de dropdown de seleção única (aplicado diretamente em gatilhos de botão não editáveis)
- [Multiselect](guide/aria/multiselect) - Padrão de seleção múltipla (aplicado em gatilhos não editáveis com Listbox multi habilitado)

O combobox normalmente é combinado com:

- [Listbox](guide/aria/listbox) - Conteúdo de popup mais comum
- [Tree](guide/aria/tree) - Conteúdo de popup hierárquico (veja o guia de Tree para exemplos)
