<!-- ia-translate: true -->
<docs-decorative-header title="Toolbar">
</docs-decorative-header>

## Visão Geral

Um container para agrupar controles e ações relacionados com navegação por teclado, comumente usado para formatação de texto, toolbars e painéis de comando.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/basic/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.html"/>
  <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.css"/>
</docs-code-multifile>

## Uso

Toolbar funciona melhor para agrupar controles relacionados que os usuários acessam frequentemente. Considere usar toolbar quando:

- **Múltiplas ações relacionadas** - Você tem vários controles que executam funções relacionadas (como botões de formatação de texto)
- **Eficiência de teclado importa** - Os usuários se beneficiam de navegação rápida por teclado através das setas
- **Controles agrupados** - Você precisa organizar controles em seções lógicas com separadores
- **Acesso frequente** - Controles são usados repetidamente dentro de um fluxo de trabalho

Evite toolbar quando:

- Um grupo de botões simples é suficiente - Para apenas 2-3 ações não relacionadas, botões individuais funcionam melhor
- Controles não são relacionados - Toolbar implica um agrupamento lógico; controles não relacionados confundem os usuários
- Navegação aninhada complexa - Hierarquias profundas são melhor servidas por menus ou componentes de navegação

## Recursos

O toolbar do Angular fornece uma implementação de toolbar totalmente acessível com:

- **Navegação por Teclado** - Navegue pelos widgets com as setas, ative com Enter ou Espaço
- **Suporte para Leitores de Tela** - Atributos ARIA integrados para tecnologias assistivas
- **Grupos de Widgets** - Organize widgets relacionados como grupos de radio buttons ou grupos de toggle buttons
- **Orientação Flexível** - Layouts horizontal ou vertical com navegação por teclado automática
- **Reatividade Baseada em Signals** - Gerenciamento de estado reativo usando signals do Angular
- **Suporte para Texto Bidirecional** - Lida automaticamente com idiomas da direita para a esquerda (RTL)
- **Foco Configurável** - Escolha entre navegação circular ou paradas fixas nas bordas

## Exemplos

### Toolbar horizontal básico

Toolbars horizontais organizam controles da esquerda para a direita, correspondendo ao padrão comum em editores de texto e ferramentas de design. As setas navegam entre widgets, mantendo o foco dentro do toolbar até que os usuários pressionem Tab para mover para o próximo elemento da página.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/basic/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.html"/>
  <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.css"/>
</docs-code-multifile>

### Toolbar vertical

Toolbars verticais empilham controles de cima para baixo, úteis para painéis laterais ou paletas de comandos verticais. As setas para cima e para baixo navegam entre widgets.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/vertical/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/vertical/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/vertical/app/app.html" highlight="[3]"/>
  <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/vertical/app/app.css"/>
</docs-code-multifile>

### Grupos de widgets

Grupos de widgets contêm controles relacionados que funcionam juntos, como opções de alinhamento de texto ou escolhas de formatação de lista. Grupos mantêm seu próprio estado interno enquanto participam da navegação do toolbar.

Nos exemplos acima, os botões de alinhamento são envolvidos em `ngToolbarWidgetGroup` com `role="radiogroup"` para criar um grupo de seleção mutuamente exclusivo.

O input `multi` controla se múltiplos widgets dentro de um grupo podem ser selecionados simultaneamente:

<docs-code language="html" highlight="[15]">
<!-- Seleção única (grupo de radio) -->
<div
  ngToolbarWidgetGroup
  role="radiogroup"
  aria-label="Alignment"
>
  <button ngToolbarWidget value="left">Left</button>
  <button ngToolbarWidget value="center">Center</button>
  <button ngToolbarWidget value="right">Right</button>
</div>

<!-- Seleção múltipla (grupo de toggle) -->
<div
  ngToolbarWidgetGroup
  [multi]="true"
  aria-label="Formatting"
>
  <button ngToolbarWidget value="bold">Bold</button>
  <button ngToolbarWidget value="italic">Italic</button>
  <button ngToolbarWidget value="underline">Underline</button>
</div>
</docs-code>

### Widgets desabilitados

Toolbars suportam dois modos de desabilitação:

1. **Widgets soft-disabled** permanecem focáveis mas indicam visualmente que estão indisponíveis
2. **Widgets hard-disabled** são completamente removidos da navegação por teclado.

Por padrão, `softDisabled` é `true`, o que permite que widgets desabilitados ainda recebam foco. Se você quiser habilitar o modo hard-disabled, defina `[softDisabled]="false"` no toolbar.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/disabled/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/disabled/app/app.html" highlight="[3,8,19,27]"/>
</docs-code-multifile>

### Suporte para direita-para-esquerda (RTL)

Toolbars suportam automaticamente idiomas da direita para a esquerda. Envolva o toolbar em um container com `dir="rtl"` para inverter o layout e a direção de navegação por teclado. A navegação por setas se ajusta automaticamente: seta esquerda move para o próximo widget, seta direita para o anterior.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/rtl/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/rtl/app/app.html" highlight="[1]"/>
</docs-code-multifile>

## Showcase

TBD

## APIs

### Toolbar Directive

A directive `ngToolbar` fornece o container para a funcionalidade de toolbar.

#### Inputs

| Property       | Type                           | Default        | Description                                             |
| -------------- | ------------------------------ | -------------- | ------------------------------------------------------- |
| `orientation`  | `'vertical'` \| `'horizontal'` | `'horizontal'` | Se o toolbar é orientado verticalmente ou horizontalmente |
| `disabled`     | `boolean`                      | `false`        | Desabilita o toolbar inteiro                            |
| `softDisabled` | `boolean`                      | `true`         | Se itens desabilitados podem receber foco               |
| `wrap`         | `boolean`                      | `true`         | Se o foco deve retornar ao início nas bordas            |

### ToolbarWidget Directive

A directive `ngToolbarWidget` marca um elemento como um widget navegável dentro do toolbar.

#### Inputs

| Property   | Type      | Default | Description                                     |
| ---------- | --------- | ------- | ----------------------------------------------- |
| `id`       | `string`  | auto    | Identificador único para o widget               |
| `disabled` | `boolean` | `false` | Desabilita o widget                             |
| `value`    | `V`       | -       | O valor associado ao widget (obrigatório)       |

#### Signals

| Property   | Type              | Description                                 |
| ---------- | ----------------- | ------------------------------------------- |
| `active`   | `Signal<boolean>` | Se o widget está atualmente focado          |
| `selected` | `Signal<boolean>` | Se o widget está selecionado (em um grupo)  |

### ToolbarWidgetGroup Directive

A directive `ngToolbarWidgetGroup` agrupa widgets relacionados juntos.

#### Inputs

| Property   | Type      | Default | Description                                 |
| ---------- | --------- | ------- | ------------------------------------------- |
| `disabled` | `boolean` | `false` | Desabilita todos os widgets no grupo        |
| `multi`    | `boolean` | `false` | Se múltiplos widgets podem ser selecionados |

### Componentes relacionados

Toolbar pode conter vários tipos de widget incluindo buttons, trees e comboboxes. Veja a documentação de componentes individuais para implementações específicas de widgets.
