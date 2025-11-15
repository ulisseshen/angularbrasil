<!-- ia-translate: true -->
<docs-decorative-header title="Multiselect">
</docs-decorative-header>

## Visão Geral

Um padrão que combina combobox somente leitura com listbox habilitado para múltipla seleção para criar dropdowns de seleção múltipla com navegação por teclado e suporte para leitores de tela.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/basic/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/basic/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/basic/app/app.html"/>
  <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/basic/app/app.css"/>
</docs-code-multifile>

## Uso

O padrão multiselect funciona melhor quando os usuários precisam escolher múltiplos itens relacionados de um conjunto familiar de opções.

Considere usar este padrão quando:

- **Usuários precisam de múltiplas seleções** - Tags, categorias, filtros ou rótulos onde múltiplas escolhas se aplicam
- **A lista de opções é fixa** (menos de 20 itens) - Os usuários podem escanear as opções sem busca
- **Filtrando conteúdo** - Múltiplos critérios podem estar ativos simultaneamente
- **Atribuindo atributos** - Rótulos, permissões ou recursos onde múltiplos valores fazem sentido
- **Escolhas relacionadas** - Opções que logicamente funcionam juntas (como selecionar múltiplos membros da equipe)

Evite este padrão quando:

- **Apenas seleção única é necessária** - Use o [padrão Select](guide/aria/select) para dropdowns de escolha única mais simples
- **A lista tem mais de 20 itens com busca necessária** - Use o [padrão Autocomplete](guide/aria/autocomplete) com capacidade de multisseleção
- **A maioria ou todas as opções serão selecionadas** - Um padrão de checklist fornece melhor visibilidade
- **As escolhas são opções binárias independentes** - Checkboxes individuais comunicam as escolhas mais claramente

## Recursos

O padrão multiselect combina as directives [Combobox](guide/aria/combobox) e [Listbox](guide/aria/listbox) para fornecer um dropdown totalmente acessível com:

- **Navegação por Teclado** - Navegue pelas opções com as setas, alterne com Espaço, feche com Escape
- **Suporte para Leitores de Tela** - Atributos ARIA integrados incluindo aria-multiselectable
- **Exibição de Contagem de Seleção** - Mostra padrão compacto "Item + 2 mais" para múltiplas seleções
- **Reatividade Baseada em Signals** - Gerenciamento de estado reativo usando signals do Angular
- **Posicionamento Inteligente** - CDK Overlay lida com bordas do viewport e rolagem
- **Suporte para Texto Bidirecional** - Lida automaticamente com idiomas da direita para a esquerda (RTL)
- **Seleção Persistente** - Opções selecionadas permanecem visíveis com marcas de verificação após a seleção

## Exemplos

### Multiselect básico

Usuários precisam selecionar múltiplos itens de uma lista de opções. Um combobox somente leitura pareado com um listbox habilitado para múltipla seleção fornece funcionalidade de multisseleção familiar com suporte completo de acessibilidade.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/basic/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/basic/app/app.ts" />
  <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/basic/app/app.html" />
</docs-code-multifile>

O atributo `multi` em `ngListbox` habilita múltipla seleção. Pressione Espaço para alternar opções, e o popup permanece aberto para seleções adicionais. A exibição mostra o primeiro item selecionado mais uma contagem das seleções restantes.

### Multiselect com exibição personalizada

Opções frequentemente precisam de indicadores visuais como ícones ou cores para ajudar os usuários a identificar escolhas. Templates personalizados dentro das opções permitem formatação rica enquanto o valor de exibição mostra um resumo compacto.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/icons/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/icons/app/app.ts" />
  <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/icons/app/app.html" />
</docs-code-multifile>

Cada opção exibe um ícone ao lado de seu rótulo. O valor de exibição atualiza para mostrar o ícone e texto da primeira seleção, seguido por uma contagem de seleções adicionais. Opções selecionadas mostram uma marca de verificação para feedback visual claro.

### Multiselect com chips

Quando os usuários se beneficiam de ver todos os itens selecionados rapidamente, chips fornecem uma representação visual de cada seleção com a capacidade de remover itens individuais.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/chips/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/chips/app/app.ts" />
  <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/chips/app/app.html" />
</docs-code-multifile>

Chips aparecem na área do trigger mostrando todos os itens selecionados. Cada chip inclui um botão de remoção que desmarca o item quando clicado. Este padrão funciona melhor quando o número de seleções permanece gerenciável (tipicamente menos de 5 itens).

### Seleção controlada

Formulários às vezes precisam limitar o número de seleções ou validar escolhas do usuário. Controle programático sobre a seleção habilita essas restrições enquanto mantém a acessibilidade.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/limited/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/limited/app/app.ts" />
  <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/limited/app/app.html" />
</docs-code-multifile>

Este exemplo limita as seleções a três itens. Quando o limite é atingido, opções não selecionadas ficam desabilitadas, prevenindo seleções adicionais. Uma mensagem informa os usuários sobre a restrição.

### Suporte para direita-para-esquerda (RTL)

Multiselect suporta automaticamente idiomas da direita para a esquerda. Envolva o multiselect em um container com `dir="rtl"` para inverter o layout. A navegação por setas se ajusta automaticamente.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/multiselect/src/rtl/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/multiselect/src/rtl/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/aria/multiselect/src/rtl/app/app.html" highlight="[1]"/>
  <docs-code header="app.css" path="adev/src/content/examples/aria/multiselect/src/rtl/app/app.css"/>
</docs-code-multifile>

O atributo de direção inverte automaticamente o layout visual e a direção de navegação por teclado enquanto mantém a ordem lógica de seleção.

## Showcase

TBD

## APIs

O padrão multiselect usa as seguintes directives da biblioteca Aria do Angular. Veja a documentação completa da API nos guias linkados.

### Combobox Directives

O padrão multiselect usa `ngCombobox` com o atributo `readonly` para prevenir entrada de texto enquanto preserva a navegação por teclado.

#### Inputs

| Property   | Type      | Default | Description                                      |
| ---------- | --------- | ------- | ------------------------------------------------ |
| `readonly` | `boolean` | `false` | Defina como `true` para criar comportamento de dropdown |
| `disabled` | `boolean` | `false` | Desabilita o multiselect inteiro                 |

Veja a [documentação da API do Combobox](guide/aria/combobox#apis) para detalhes completos sobre todos os inputs e signals disponíveis.

### Listbox Directives

O padrão multiselect usa `ngListbox` com o atributo `multi` para seleção múltipla e `ngOption` para cada item selecionável.

#### Inputs

| Property | Type      | Default | Description                                   |
| -------- | --------- | ------- | --------------------------------------------- |
| `multi`  | `boolean` | `false` | Defina como `true` para habilitar seleção múltipla |

#### Model

| Property | Type    | Description                                      |
| -------- | ------- | ------------------------------------------------ |
| `values` | `any[]` | Array bidirecional vinculável de valores selecionados |

Quando `multi` é true, os usuários podem selecionar múltiplas opções usando Espaço para alternar a seleção. O popup permanece aberto após a seleção, permitindo escolhas adicionais.

Veja a [documentação da API do Listbox](guide/aria/listbox#apis) para detalhes completos sobre configuração do listbox, modos de seleção e propriedades das opções.

### Posicionamento

O padrão multiselect integra com [CDK Overlay](api/cdk/overlay/CdkConnectedOverlay) para posicionamento inteligente. Use `cdkConnectedOverlay` para lidar com bordas do viewport e rolagem automaticamente.

## Estilização

As directives usadas no padrão multiselect não incluem estilos padrão. Isso permite personalização completa para corresponder ao seu design system. Aplique estilos através de classes CSS padrão ou bindings de estilo.

### Estilizando o trigger do multiselect

```css
.multiselect-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  min-height: 40px;
  gap: 8px;
}

.multiselect-trigger:focus-within {
  outline: 2px solid blue;
  border-color: blue;
}

.selection-count {
  color: #666;
  font-size: 0.875rem;
}
```

### Estilizando chips

```css
.chip {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  background: #e0e0e0;
  border-radius: 16px;
  gap: 4px;
  margin: 2px;
  font-size: 0.875rem;
}

.chip-remove {
  cursor: pointer;
  font-size: 16px;
  color: #666;
}

.chip-remove:hover {
  color: #333;
}
```

### Estilizando opções selecionadas

```css
[ngOption][aria-selected="true"] {
  background: #e3f2fd;
}

.option-check {
  visibility: hidden;
  color: #1976d2;
}

[ngOption][aria-selected="true"] .option-check {
  visibility: visible;
}
```

Veja o [guia de estilização do Listbox](guide/aria/listbox#styling) para padrões detalhados de personalização incluindo estados de hover e estilos desabilitados.
