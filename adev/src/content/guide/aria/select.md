<!-- ia-translate: true -->
<docs-decorative-header title="Select">
</docs-decorative-header>

## Visão Geral

Um padrão que combina combobox somente leitura com listbox para criar dropdowns de seleção única com navegação por teclado e suporte para leitores de tela.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/basic/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/basic/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/basic/app/app.html"/>
  <docs-code header="app.css" path="adev/src/content/examples/aria/select/src/basic/app/app.css"/>
</docs-code-multifile>

## Uso

O padrão select funciona melhor quando os usuários precisam escolher um único valor de um conjunto familiar de opções.

Considere usar este padrão quando:

- **A lista de opções é fixa** (menos de 20 itens) - Os usuários podem escanear e escolher sem filtragem
- **As opções são familiares** - Os usuários reconhecem as escolhas sem precisar buscar
- **Formulários precisam de campos padrão** - Seleção de país, estado, categoria ou status
- **Configurações e ajustes** - Menus dropdown para preferências ou opções
- **Rótulos de opção claros** - Cada escolha tem um nome distinto e escaneável

Evite este padrão quando:

- **A lista tem mais de 20 itens** - Use o [padrão Autocomplete](guide/aria/autocomplete) para melhor filtragem
- **Usuários precisam buscar opções** - [Autocomplete](guide/aria/autocomplete) fornece entrada de texto e filtragem
- **Seleção múltipla é necessária** - Use o [padrão Multiselect](guide/aria/multiselect) em vez disso
- **Existem poucas opções (2-3)** - Radio buttons fornecem melhor visibilidade de todas as escolhas

## Recursos

O padrão select combina as directives [Combobox](guide/aria/combobox) e [Listbox](guide/aria/listbox) para fornecer um dropdown totalmente acessível com:

- **Navegação por Teclado** - Navegue pelas opções com as setas, selecione com Enter, feche com Escape
- **Suporte para Leitores de Tela** - Atributos ARIA integrados para tecnologias assistivas
- **Exibição Personalizada** - Mostre valores selecionados com ícones, formatação ou conteúdo rico
- **Reatividade Baseada em Signals** - Gerenciamento de estado reativo usando signals do Angular
- **Posicionamento Inteligente** - CDK Overlay lida com bordas do viewport e rolagem
- **Suporte para Texto Bidirecional** - Lida automaticamente com idiomas da direita para a esquerda (RTL)

## Exemplos

### Select básico

Usuários precisam de um dropdown padrão para escolher de uma lista de valores. Um combobox somente leitura pareado com um listbox fornece a experiência familiar de select com suporte completo de acessibilidade.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/basic/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/basic/app/app.ts" />
  <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/basic/app/app.html"/>
</docs-code-multifile>

O atributo `readonly` em `ngCombobox` previne entrada de texto enquanto preserva a navegação por teclado. Os usuários interagem com o dropdown usando setas e Enter, assim como um elemento select nativo.

### Select com exibição personalizada

Opções frequentemente precisam de indicadores visuais como ícones ou badges para ajudar os usuários a identificar escolhas rapidamente. Templates personalizados dentro das opções permitem formatação rica enquanto mantêm a acessibilidade.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/icons/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/icons/app/app.ts" />
  <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/icons/app/app.html" />
</docs-code-multifile>

Cada opção exibe um ícone ao lado do rótulo. O valor selecionado atualiza para mostrar o ícone e texto da opção escolhida, fornecendo feedback visual claro.

### Select com valores de objeto

Formulários frequentemente trabalham com estruturas de dados complexas onde o rótulo exibido difere do valor armazenado. Separar o valor da opção de seu rótulo de exibição acomoda este padrão.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/objects/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/select/src/objects/app/app.ts" />
  <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/objects/app/app.html" />
</docs-code-multifile>

A propriedade `value` em cada opção mantém o objeto ou identificador, enquanto a propriedade `label` fornece o texto de exibição. Esta separação mantém os dados do formulário limpos enquanto mostra texto amigável ao usuário.

### Select desabilitado

Selects podem ser desabilitados para prevenir interação do usuário quando certas condições do formulário não são atendidas. O estado desabilitado fornece feedback visual e previne interação por teclado.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/select/src/disabled/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/aria/select/src/disabled/app/app.html" />
</docs-code-multifile>

Quando desabilitado, o select mostra um estado visual desabilitado e bloqueia toda interação do usuário. Leitores de tela anunciam o estado desabilitado para usuários de tecnologia assistiva.

## Showcase

TBD

## APIs

O padrão select usa as seguintes directives da biblioteca Aria do Angular. Veja a documentação completa da API nos guias linkados.

### Combobox Directives

O padrão select usa `ngCombobox` com o atributo `readonly` para prevenir entrada de texto enquanto preserva a navegação por teclado.

#### Inputs

| Property   | Type      | Default | Description                                      |
| ---------- | --------- | ------- | ------------------------------------------------ |
| `readonly` | `boolean` | `false` | Defina como `true` para criar comportamento de dropdown |
| `disabled` | `boolean` | `false` | Desabilita o select inteiro                      |

Veja a [documentação da API do Combobox](guide/aria/combobox#apis) para detalhes completos sobre todos os inputs e signals disponíveis.

### Listbox Directives

O padrão select usa `ngListbox` para a lista dropdown e `ngOption` para cada item selecionável.

#### Model

| Property | Type    | Description                                                             |
| -------- | ------- | ----------------------------------------------------------------------- |
| `values` | `any[]` | Array bidirecional vinculável de valores selecionados (contém um único valor para select) |

Veja a [documentação da API do Listbox](guide/aria/listbox#apis) para detalhes completos sobre configuração do listbox, modos de seleção e propriedades das opções.

### Posicionamento

O padrão select integra com [CDK Overlay](api/cdk/overlay/CdkConnectedOverlay) para posicionamento inteligente. Use `cdkConnectedOverlay` para lidar com bordas do viewport e rolagem automaticamente.

## Estilização

As directives usadas no padrão select não incluem estilos padrão. Isso permite personalização completa para corresponder ao seu design system. Aplique estilos através de classes CSS padrão ou bindings de estilo.

### Estilizando o trigger do select

```css
.select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  background: white;
}

.select-trigger:focus-within {
  outline: 2px solid blue;
  border-color: blue;
}

.select-arrow {
  color: #666;
  transition: transform 0.2s;
}
```

### Estilizando o dropdown

```css
.select-popup {
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background: white;
  max-height: 300px;
  overflow-y: auto;
}
```

### Estilizando opções

As opções usam a estilização do listbox. Veja o [guia de estilização do Listbox](guide/aria/listbox#styling) para padrões detalhados de personalização incluindo estados de hover, indicadores de seleção e estilos desabilitados.
