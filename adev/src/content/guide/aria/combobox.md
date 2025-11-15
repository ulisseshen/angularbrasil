<!-- ia-translate: true -->
<docs-decorative-header title="Combobox">
</docs-decorative-header>

## Visão Geral

Uma directive que coordena um input de texto com um popup, fornecendo a directive primitiva para padrões de autocomplete, select e multiselect.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/basic/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/basic/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/basic/app/app.html"/>
  <docs-code header="app.css" path="adev/src/content/examples/aria/combobox/src/basic/app/app.css"/>
</docs-code-multifile>

## Uso

Combobox é a directive primitiva que coordena um input de texto com um popup. Ela fornece a base para padrões de autocomplete, select e multiselect. Considere usar combobox diretamente quando:

- **Construindo padrões de autocomplete personalizados** - Criando comportamento especializado de filtragem ou sugestão
- **Criando componentes de seleção personalizados** - Desenvolvendo dropdowns com requisitos únicos
- **Coordenando input com popup** - Pareando input de texto com conteúdo de listbox, tree ou dialog
- **Implementando modos de filtro específicos** - Usando comportamentos manual, de seleção automática ou de destaque

Use padrões documentados em vez disso quando:

- Autocomplete padrão com filtragem for necessário - Veja o [padrão Autocomplete](guide/aria/autocomplete) para exemplos prontos para uso
- Dropdowns de seleção única forem necessários - Veja o [padrão Select](guide/aria/select) para implementação completa de dropdown
- Dropdowns de seleção múltipla forem necessários - Veja o [padrão Multiselect](guide/aria/multiselect) para multi-seleção com exibição compacta

Nota: Os guias de [Autocomplete](guide/aria/autocomplete), [Select](guide/aria/select) e [Multiselect](guide/aria/multiselect) mostram padrões documentados que combinam esta directive com [Listbox](guide/aria/listbox) para casos de uso específicos.

## Recursos

O combobox do Angular fornece um sistema de coordenação input-popup totalmente acessível com:

- **Input de Texto com Popup** - Coordena campo de input com conteúdo de popup
- **Três Modos de Filtro** - Comportamentos manual, de seleção automática ou de destaque
- **Navegação por Teclado** - Tratamento das setas, Enter e Escape
- **Suporte para Leitores de Tela** - Atributos ARIA integrados incluindo role="combobox" e aria-expanded
- **Gerenciamento de Popup** - Mostrar/ocultar automático baseado em interação do usuário
- **Reatividade Baseada em Signals** - Gerenciamento de estado reativo usando signals do Angular

## Exemplos

### Modo de filtro manual

Aplicações precisam de controle sobre o comportamento de filtragem e seleção. O modo manual fornece controle total onde os usuários selecionam opções explicitamente e a aplicação gerencia a lógica de filtragem.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/basic/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/basic/app/app.ts" visibleLines="[18,26,30,40]"/>
  <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/basic/app/app.html" visibleLines="[1,6,10,15]"/>
</docs-code-multifile>

A configuração `filterMode="manual"` dá controle completo sobre filtragem e seleção. O input atualiza um signal que filtra a lista de opções. Os usuários navegam com as setas e selecionam com Enter ou clique. Este modo fornece a maior flexibilidade para lógica de filtragem personalizada. Veja o [guia de Autocomplete](guide/aria/autocomplete) para padrões completos de filtragem e exemplos.

### Modo de seleção automática

Formulários às vezes se beneficiam de selecionar automaticamente a primeira opção correspondente conforme os usuários digitam. O modo de seleção automática atualiza o valor do input para corresponder à primeira opção, fornecendo interação mais rápida.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/auto-select/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/auto-select/app/app.ts" visibleLines="[18,26,30,40]"/>
  <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/auto-select/app/app.html" visibleLines="[1,6]"/>
</docs-code-multifile>

A configuração `filterMode="auto-select"` atualiza automaticamente o valor do input para a primeira opção correspondente. O input `firstMatch` fornece coordenação entre a lógica de filtragem e a seleção. Este modo funciona bem quando a primeira correspondência é tipicamente o que os usuários querem. Veja o [guia de Autocomplete](guide/aria/autocomplete#auto-select-mode) para exemplos detalhados.

### Modo somente leitura

O atributo `readonly` impede digitação no campo de input. O popup abre ao clicar ou usar as setas. Os usuários navegam pelas opções com o teclado e selecionam com Enter ou clique.

Esta configuração fornece a base para os padrões [Select](guide/aria/select) e [Multiselect](guide/aria/multiselect). Veja esses guias para implementações completas de dropdown com triggers e posicionamento de overlay.

### Popup de diálogo

Popups às vezes precisam de comportamento modal com backdrop e focus trap. A directive de dialog do combobox fornece este padrão para casos de uso especializados.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/combobox/src/dialog/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/combobox/src/dialog/app/app.ts" visibleLines="[18,26]"/>
  <docs-code header="app.html" path="adev/src/content/examples/aria/combobox/src/dialog/app/app.html" visibleLines="[1,5]"/>
</docs-code-multifile>

A directive `ngComboboxDialog` cria um popup modal usando o elemento dialog nativo. Isso fornece comportamento de backdrop e focus trapping. Use popups de dialog quando a interface de seleção requer interação modal ou quando o conteúdo do popup é complexo o suficiente para garantir foco em tela cheia.

## Showcase

TBD

## APIs

### Combobox Directive

A directive `ngCombobox` coordena um input de texto com um popup.

#### Inputs

| Property         | Type                                           | Default    | Description                                          |
| ---------------- | ---------------------------------------------- | ---------- | ---------------------------------------------------- |
| `filterMode`     | `'manual'` \| `'auto-select'` \| `'highlight'` | `'manual'` | Controla o comportamento de seleção                  |
| `disabled`       | `boolean`                                      | `false`    | Desabilita o combobox                                |
| `readonly`       | `boolean`                                      | `false`    | Torna o combobox somente leitura (para Select/Multiselect) |
| `firstMatch`     | `V`                                            | -          | Valor do primeiro item correspondente para seleção automática |
| `alwaysExpanded` | `boolean`                                      | `false`    | Mantém o popup sempre aberto                         |

**Modos de Filtro:**

- **`'manual'`** - Usuário controla filtragem e seleção explicitamente. O popup mostra opções baseadas em sua lógica de filtragem. Os usuários selecionam com Enter ou clique. Este modo fornece a maior flexibilidade.
- **`'auto-select'`** - O valor do input atualiza automaticamente para a primeira opção correspondente conforme os usuários digitam. Requer o input `firstMatch` para coordenação. Veja o [guia de Autocomplete](guide/aria/autocomplete#auto-select-mode) para exemplos.
- **`'highlight'`** - Destaca texto correspondente sem alterar o valor do input. Os usuários navegam com as setas e selecionam com Enter.

#### Signals

| Property   | Type              | Description                     |
| ---------- | ----------------- | ------------------------------- |
| `expanded` | `Signal<boolean>` | Se o popup está atualmente aberto |

#### Methods

| Method     | Parameters | Description            |
| ---------- | ---------- | ---------------------- |
| `open`     | none       | Abre o combobox        |
| `close`    | none       | Fecha o combobox       |
| `expand`   | none       | Expande o combobox     |
| `collapse` | none       | Recolhe o combobox     |

### ComboboxInput Directive

A directive `ngComboboxInput` conecta um elemento input ao combobox.

#### Model

| Property | Type     | Description                                      |
| -------- | -------- | ------------------------------------------------ |
| `value`  | `string` | Valor bidirecional vinculável usando `[(value)]` |

O elemento input recebe tratamento de teclado e atributos ARIA automaticamente.

### ComboboxPopup Directive

A directive `ngComboboxPopup` (host directive) gerencia visibilidade e coordenação do popup. Tipicamente usada com `ngComboboxPopupContainer` em um `ng-template` ou com CDK Overlay.

### ComboboxPopupContainer Directive

A directive `ngComboboxPopupContainer` marca um `ng-template` como o conteúdo do popup.

```html
<ng-template ngComboboxPopupContainer>
  <div ngListbox>...</div>
</ng-template>
```

Usado com Popover API ou CDK Overlay para posicionamento.

### ComboboxDialog Directive

A directive `ngComboboxDialog` cria um popup modal de combobox.

```html
<dialog ngComboboxDialog>
  <div ngListbox>...</div>
</dialog>
```

Use para comportamento de popup modal com backdrop e focus trap.

### Padrões e directives relacionados

Combobox é a directive primitiva para estes padrões documentados:

- **[Autocomplete](guide/aria/autocomplete)** - Padrão de filtragem e sugestões (usa Combobox com modos de filtro)
- **[Select](guide/aria/select)** - Padrão de dropdown de seleção única (usa Combobox com `readonly`)
- **[Multiselect](guide/aria/multiselect)** - Padrão de seleção múltipla (usa Combobox com `readonly` + Listbox com multi habilitado)

Combobox tipicamente combina com:

- **[Listbox](guide/aria/listbox)** - Conteúdo de popup mais comum
- **[Tree](guide/aria/tree)** - Conteúdo de popup hierárquico (veja o guia de Tree para exemplos)

## Estilização

As directives de combobox não incluem estilos padrão. Isso permite personalização completa para corresponder ao seu design system. Aplique estilos através de classes CSS padrão ou bindings de estilo.

### Estilizando o container do combobox

A directive `ngCombobox` adiciona automaticamente o atributo `ngCombobox` ao seu elemento host, permitindo que você o alveje com seletores de atributo. A directive `ngComboboxInput` adiciona similarmente o atributo `ngComboboxInput` ao elemento input.

```css
[ngCombobox] {
  position: relative;
  display: inline-block;
}
```

### Estilizando o estado expandido

```css
[ngCombobox][data-expanded="true"] .combobox-icon {
  transform: rotate(180deg);
}
```

### Estilizando o input

```css
[ngComboboxInput] {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

[ngComboboxInput]:focus {
  outline: 2px solid blue;
  border-color: blue;
}
```

Para padrões completos de estilização com popups e opções, veja:

- [Estilização de Autocomplete](guide/aria/autocomplete#styling) - Input com sugestões
- [Estilização de Select](guide/aria/select#styling) - Trigger de dropdown e popup
- [Estilização de Listbox](guide/aria/listbox#styling) - Estilização de opções
