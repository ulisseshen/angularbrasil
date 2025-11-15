<!-- ia-translate: true -->
<docs-decorative-header title="Listbox">
</docs-decorative-header>

## Visão Geral

Uma directive que exibe uma lista de opções para os usuários selecionarem, com suporte para navegação por teclado, seleção única ou múltipla, e suporte para leitores de tela.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/basic/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/basic/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/basic/app/app.html"/>
  <docs-code header="app.css" path="adev/src/content/examples/aria/listbox/src/basic/app/app.css"/>
</docs-code-multifile>

## Uso

Listbox é uma directive fundamental usada pelos padrões [Select](guide/aria/select), [Multiselect](guide/aria/multiselect) e [Autocomplete](guide/aria/autocomplete). Para a maioria das necessidades de dropdown, use esses padrões documentados.

Considere usar listbox diretamente quando:

- **Construindo componentes de seleção personalizados** - Criando interfaces especializadas com comportamento específico
- **Listas de seleção visíveis** - Exibindo itens selecionáveis diretamente na página (não em dropdowns)
- **Padrões de integração personalizados** - Integrando com requisitos únicos de popup ou layout

Evite listbox quando:

- **Menus de navegação são necessários** - Use a directive [Menu](guide/aria/menu) para ações e comandos

## Recursos

O listbox do Angular fornece uma implementação de lista totalmente acessível com:

- **Navegação por Teclado** - Navegue pelas opções com as setas, selecione com Enter ou Espaço
- **Suporte para Leitores de Tela** - Atributos ARIA integrados incluindo role="listbox"
- **Seleção Única ou Múltipla** - Atributo `multi` controla o modo de seleção
- **Horizontal ou Vertical** - Atributo `orientation` para direção do layout
- **Busca por Digitação** - Digite caracteres para pular para opções correspondentes
- **Reatividade Baseada em Signals** - Gerenciamento de estado reativo usando signals do Angular

## Exemplos

### Listbox básico

Aplicações às vezes precisam de listas selecionáveis visíveis diretamente na página em vez de ocultas em um dropdown. Um listbox independente fornece navegação por teclado e seleção para essas interfaces de lista visíveis.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/basic/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/basic/app/app.ts" />
  <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/basic/app/app.html" />
</docs-code-multifile>

O signal model `values` fornece vinculação bidirecional aos itens selecionados. Com `selectionMode="explicit"`, os usuários pressionam Espaço ou Enter para selecionar opções. Para padrões de dropdown que combinam listbox com combobox e posicionamento de overlay, veja o padrão [Select](guide/aria/select).

### Listbox horizontal

Listas às vezes funcionam melhor horizontalmente, como interfaces estilo toolbar ou seleções estilo aba. O atributo `orientation` muda tanto o layout quanto a direção da navegação por teclado.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/horizontal/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/horizontal/app/app.ts" />
  <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/horizontal/app/app.html" />
</docs-code-multifile>

Com `orientation="horizontal"`, as setas esquerda e direita navegam entre as opções em vez de cima e baixo. O listbox automaticamente lida com idiomas da direita para a esquerda (RTL) invertendo a direção de navegação.

### Modos de seleção

Listbox suporta dois modos de seleção que controlam quando os itens são selecionados. Escolha o modo que corresponde ao padrão de interação da sua interface.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/modes/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/modes/app/app.ts" />
  <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/modes/app/app.html" />
</docs-code-multifile>

O modo `'follow'` seleciona automaticamente o item focado, fornecendo interação mais rápida quando a seleção muda frequentemente. O modo `'explicit'` requer Espaço ou Enter para confirmar a seleção, prevenindo mudanças acidentais durante a navegação. Padrões de dropdown tipicamente usam o modo `'follow'` para seleção única.

## Showcase

TBD

## APIs

### Listbox Directive

A directive `ngListbox` cria uma lista acessível de opções selecionáveis.

#### Inputs

| Property         | Type                               | Default      | Description                                  |
| ---------------- | ---------------------------------- | ------------ | -------------------------------------------- |
| `id`             | `string`                           | auto         | Identificador único para o listbox           |
| `multi`          | `boolean`                          | `false`      | Habilita seleção múltipla                    |
| `orientation`    | `'vertical'` \| `'horizontal'`     | `'vertical'` | Direção do layout da lista                   |
| `wrap`           | `boolean`                          | `true`       | Se o foco retorna ao início nas bordas da lista |
| `selectionMode`  | `'follow'` \| `'explicit'`         | `'follow'`   | Como a seleção é acionada                    |
| `focusMode`      | `'roving'` \| `'activedescendant'` | `'roving'`   | Estratégia de gerenciamento de foco          |
| `softDisabled`   | `boolean`                          | `true`       | Se itens desabilitados são focáveis          |
| `disabled`       | `boolean`                          | `false`      | Desabilita o listbox inteiro                 |
| `readonly`       | `boolean`                          | `false`      | Torna o listbox somente leitura              |
| `typeaheadDelay` | `number`                           | `500`        | Milissegundos antes da busca por digitação reiniciar |

#### Model

| Property | Type  | Description                                      |
| -------- | ----- | ------------------------------------------------ |
| `values` | `V[]` | Array bidirecional vinculável de valores selecionados |

#### Signals

| Property | Type          | Description                           |
| -------- | ------------- | ------------------------------------- |
| `values` | `Signal<V[]>` | Valores atualmente selecionados como signal |

#### Methods

| Method                     | Parameters                        | Description                                |
| -------------------------- | --------------------------------- | ------------------------------------------ |
| `scrollActiveItemIntoView` | `options?: ScrollIntoViewOptions` | Rola o item ativo para a visualização      |
| `gotoFirst`                | none                              | Navega para o primeiro item no listbox     |

### Option Directive

A directive `ngOption` marca um item dentro de um listbox.

#### Inputs

| Property   | Type      | Default | Description                                         |
| ---------- | --------- | ------- | --------------------------------------------------- |
| `id`       | `string`  | auto    | Identificador único para a opção                    |
| `value`    | `V`       | -       | O valor associado a esta opção (obrigatório)        |
| `label`    | `string`  | -       | Rótulo opcional para leitores de tela               |
| `disabled` | `boolean` | `false` | Se esta opção está desabilitada                     |

#### Signals

| Property   | Type              | Description                     |
| ---------- | ----------------- | ------------------------------- |
| `selected` | `Signal<boolean>` | Se esta opção está selecionada  |
| `active`   | `Signal<boolean>` | Se esta opção tem foco          |

### Padrões relacionados

Listbox é usado por estes padrões documentados de dropdown:

- **[Select](guide/aria/select)** - Padrão de dropdown de seleção única usando combobox somente leitura + listbox
- **[Multiselect](guide/aria/multiselect)** - Padrão de dropdown de seleção múltipla usando combobox somente leitura + listbox com `multi`
- **[Autocomplete](guide/aria/autocomplete)** - Padrão de dropdown filtrável usando combobox + listbox

Para padrões completos de dropdown com trigger, popup e posicionamento de overlay, veja esses guias de padrões em vez de usar listbox sozinho.

## Estilização

As directives de listbox não incluem estilos padrão. Isso permite personalização completa para corresponder ao seu design system. Aplique estilos através de classes CSS padrão ou bindings de estilo.

### Estilizando o listbox

A directive `ngListbox` adiciona automaticamente o atributo `ngListbox` ao seu elemento host, permitindo que você o alveje com seletores de atributo. A directive `ngOption` adiciona similarmente o atributo `ngOption` a cada elemento de opção.

```css
[ngListbox] {
  display: block;
  padding: 4px 0;
  margin: 0;
  list-style: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  max-height: 300px;
  overflow-y: auto;
}

[ngListbox][orientation="horizontal"] {
  display: flex;
  max-height: none;
  overflow-x: auto;
  overflow-y: hidden;
}
```

### Estilizando opções

```css
[ngOption] {
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

[ngOption]:hover {
  background: #f5f5f5;
}

[ngOption][aria-selected="true"] {
  background: #e3f2fd;
  color: #1976d2;
}

[ngOption][aria-disabled="true"] {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Estilizando foco

```css
[ngOption][data-active="true"] {
  outline: 2px solid blue;
  outline-offset: -2px;
}
```
