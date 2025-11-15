<!-- ia-translate: true -->
<docs-decorative-header title="Autocomplete">
</docs-decorative-header>

## Visão Geral

Um campo de input acessível que filtra e sugere opções conforme os usuários digitam, ajudando-os a encontrar e selecionar valores de uma lista.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.component.ts">
  <docs-code header="app.component.ts" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.component.ts"/>
  <docs-code header="app.component.html" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.component.html"/>
  <docs-code header="app.component.css" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.component.css"/>
</docs-code-multifile>

## Uso

Autocomplete funciona melhor quando os usuários precisam selecionar de um grande conjunto de opções onde digitar é mais rápido do que rolar a página. Considere usar autocomplete quando:

- **A lista de opções é longa** (mais de 20 itens) - Digitar reduz as escolhas mais rápido do que rolar por um dropdown
- **Os usuários sabem o que estão procurando** - Eles podem digitar parte do valor esperado (como nome de estado, produto ou nome de usuário)
- **As opções seguem padrões previsíveis** - Os usuários podem adivinhar correspondências parciais (como códigos de país, domínios de email ou categorias)
- **Velocidade importa** - Formulários se beneficiam de seleção rápida sem navegação extensa

Evite autocomplete quando:

- A lista tem menos de 10 opções - Um dropdown regular ou grupo de radio buttons fornece melhor visibilidade
- Os usuários precisam navegar pelas opções - Se a descoberta é importante, mostre todas as opções antecipadamente
- As opções são desconhecidas - Os usuários não podem digitar o que não sabem que existe na lista

## Recursos

O autocomplete do Angular fornece uma implementação de combobox totalmente acessível com:

- **Navegação por Teclado** - Navegue pelas opções com as setas, selecione com Enter, feche com Escape
- **Suporte para Leitores de Tela** - Atributos ARIA integrados para tecnologias assistivas
- **Três Modos de Filtro** - Escolha entre seleção automática, seleção manual ou comportamento de destaque
- **Reatividade Baseada em Signals** - Gerenciamento de estado reativo usando signals do Angular
- **Integração com Popover API** - Aproveita a Popover API nativa do HTML para posicionamento ideal
- **Suporte para Texto Bidirecional** - Lida automaticamente com idiomas da direita para a esquerda (RTL)

## Exemplos

### Modo de seleção automática

Usuários digitando texto parcial esperam confirmação imediata de que sua entrada corresponde a uma opção disponível. O modo de seleção automática atualiza o valor do input para corresponder à primeira opção filtrada conforme os usuários digitam, reduzindo o número de teclas pressionadas necessárias e fornecendo feedback instantâneo de que sua busca está no caminho certo.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.component.ts">
  <docs-code header="app.component.ts" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.component.ts" visibleLines="[1,7,33,40]"/>
  <docs-code header="app.component.html" path="adev/src/content/examples/aria/autocomplete/src/basic/app/app.component.html"/>
</docs-code-multifile>

### Modo de seleção manual

O modo de seleção manual mantém o texto digitado inalterado enquanto os usuários navegam pela lista de sugestões, evitando confusão com atualizações automáticas. O input só muda quando os usuários confirmam explicitamente sua escolha com Enter ou um clique.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/manual/app/app.component.ts">
  <docs-code header="app.component.html" path="adev/src/content/examples/aria/autocomplete/src/manual/app/app.component.html" visibleLines="[1]"/>
</docs-code-multifile>

### Modo de destaque

O modo de destaque permite que o usuário navegue pelas opções com as setas sem alterar o valor do input conforme navegam até que selecionem explicitamente uma nova opção com Enter ou clique.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/autocomplete/src/highlight/app/app.component.ts">
  <docs-code header="app.component.html" path="adev/src/content/examples/aria/autocomplete/src/highlight/app/app.component.html" visibleLines="[1]"/>
</docs-code-multifile>

## Showcase

TBD

## APIs

### Combobox Directive

A directive `ngCombobox` fornece o container para a funcionalidade de autocomplete.

#### Inputs

| Property     | Type                                           | Default    | Description                                              |
| ------------ | ---------------------------------------------- | ---------- | -------------------------------------------------------- |
| `filterMode` | `'auto-select'` \| `'manual'` \| `'highlight'` | `'manual'` | Controla o comportamento de seleção                      |
| `disabled`   | `boolean`                                      | `false`    | Desabilita o combobox                                    |
| `firstMatch` | `string`                                       | -          | O valor do primeiro item correspondente no popup         |

#### Outputs

| Property   | Type              | Description                                          |
| ---------- | ----------------- | ---------------------------------------------------- |
| `expanded` | `Signal<boolean>` | Signal indicando se o popup está atualmente aberto   |

### ComboboxInput Directive

A directive `ngComboboxInput` conecta um elemento input ao combobox.

#### Model

| Property | Type     | Description                                                              |
| -------- | -------- | ------------------------------------------------------------------------ |
| `value`  | `string` | Valor string bidirecional vinculável do input usando `[(value)]`         |

### ComboboxPopupContainer Directive

A directive `ngComboboxPopupContainer` envolve o conteúdo do popup e gerencia sua exibição.

Deve ser usado com `<ng-template>` dentro de um elemento popover.

### Componentes relacionados

Autocomplete usa as directives [Listbox](https://angular.dev/api/aria/listbox/Listbox) e [Option](https://angular.dev/api/aria/listbox/Option) para renderizar a lista de sugestões. Veja a [documentação do Listbox](https://angular.dev/guide/aria/listbox) para opções adicionais de personalização.

## Estilização

Os componentes de autocomplete não incluem estilos padrão. Isso permite personalização completa para corresponder ao seu design system. Aplique estilos através de classes CSS padrão ou bindings de estilo.

### Estilizando o input

```css
input[ngComboboxInput] {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

input[ngComboboxInput]:focus {
  outline: 2px solid blue;
  border-color: blue;
}
```

### Estilizando o popup

```css
[popover] {
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 0;
}
```

### Estilizando opções

As opções usam a estilização do listbox. Veja o [guia de estilização do Listbox](https://angular.dev/guide/aria/listbox#styling) para padrões detalhados de personalização.
