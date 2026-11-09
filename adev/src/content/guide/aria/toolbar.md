<!-- ia-translate: true -->
# Toolbar

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/" title="Padrão ARIA de toolbar"/>
  <docs-pill href="/api/aria/toolbar/Toolbar" title="Referência da API de Toolbar"/>
</docs-pill-row>

## Visão geral {#overview}

Um container para agrupar controles e ações relacionados com navegação por teclado, comumente usado para formatação de texto, barras de ferramentas e painéis de comandos.

<docs-tab-group>
  <docs-tab label="Básico">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## Uso {#usage}

O toolbar funciona melhor para agrupar controles relacionados que os usuários acessam com frequência. Considere usar o toolbar quando:

- **Múltiplas ações relacionadas** - Você tem vários controles que executam funções relacionadas (como botões de formatação de texto)
- **A eficiência pelo teclado importa** - Os usuários se beneficiam da navegação rápida pelo teclado com as setas
- **Controles agrupados** - Você precisa organizar os controles em seções lógicas com separadores
- **Acesso frequente** - Os controles são usados repetidamente dentro de um fluxo de trabalho

Evite o toolbar quando:

- Um grupo simples de botões for suficiente - Para apenas 2 ou 3 ações não relacionadas, botões individuais funcionam melhor
- Os controles não forem relacionados - O toolbar implica um agrupamento lógico; controles não relacionados confundem os usuários
- Houver navegação aninhada complexa - Hierarquias profundas são mais bem atendidas por menus ou componentes de navegação

## Recursos {#features}

O toolbar do Angular fornece uma implementação de toolbar totalmente acessível, com:

- **Navegação por teclado** - Navegue pelos widgets com as setas, Home e End usando roving tabindex, enquanto os controles mantêm a ativação nativa
- **Suporte a leitores de tela** - Atributos ARIA integrados para tecnologias assistivas
- **Grupos de widgets** - Organize widgets relacionados, como grupos de botões de opção ou grupos de botões de alternância
- **Orientação flexível** - Layouts horizontais ou verticais com navegação por teclado automática
- **Reatividade baseada em signals** - Gerenciamento de estado reativo usando signals do Angular
- **Suporte a texto bidirecional** - Lida automaticamente com idiomas da direita para a esquerda (RTL)
- **Foco configurável** - Escolha entre navegação circular ou paradas fixas nas bordas

## Exemplos {#examples}

### Toolbar horizontal básica {#basic-horizontal-toolbar}

Toolbars horizontais organizam os controles da esquerda para a direita, seguindo o padrão comum em editores de texto e ferramentas de design. As setas navegam entre os widgets, mantendo o foco dentro do toolbar até que o usuário pressione Tab para ir ao próximo elemento da página.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/basic/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.html"/>
  <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/basic/app/app.css"/>
</docs-code-multifile>

### Toolbar vertical {#vertical-toolbar}

Toolbars verticais empilham os controles de cima para baixo, úteis para painéis laterais ou paletas de comandos verticais. As setas para cima e para baixo navegam entre os widgets.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/vertical/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/vertical/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/vertical/app/app.html" highlight="[3]"/>
  <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/vertical/app/app.css"/>
</docs-code-multifile>

### Grupos de widgets {#widget-groups}

Grupos de widgets organizam controles relacionados que funcionam juntos, como opções de alinhamento de texto ou alternâncias de formatação. Os grupos mantêm a navegação com roving tabindex e apresentam a estrutura semântica adequada para tecnologias assistivas.

Nos exemplos acima, os botões de alinhamento são envolvidos por `ngToolbarWidgetGroup` com `role="radiogroup"`. A seleção é desacoplada do container do toolbar, permitindo gerenciar o estado com signals do Angular ou com directives personalizadas:

```angular-html
<!-- Grupo de radio com seleção mutuamente exclusiva -->
<div ngToolbarWidgetGroup role="radiogroup" aria-label="Alinhamento">
  <button
    ngToolbarWidget
    role="radio"
    type="button"
    [attr.aria-checked]="alignment() === 'left'"
    (click)="alignment.set('left')"
  >
    Esquerda
  </button>
  <button
    ngToolbarWidget
    role="radio"
    type="button"
    [attr.aria-checked]="alignment() === 'center'"
    (click)="alignment.set('center')"
  >
    Centro
  </button>
  <button
    ngToolbarWidget
    role="radio"
    type="button"
    [attr.aria-checked]="alignment() === 'right'"
    (click)="alignment.set('right')"
  >
    Direita
  </button>
</div>

<!-- Grupo de botões de alternância -->
<div class="group" role="group" aria-label="Estilo do texto">
  <button ngToolbarWidget type="button" [attr.aria-pressed]="bold()" (click)="bold.set(!bold())">
    Negrito
  </button>
  <button
    ngToolbarWidget
    type="button"
    [attr.aria-pressed]="italic()"
    (click)="italic.set(!italic())"
  >
    Itálico
  </button>
</div>
```

### Widgets desabilitados {#disabled-widgets}

Toolbars suportam dois modos de desabilitação:

1. **Widgets soft-disabled** permanecem focáveis, mas indicam visualmente que estão indisponíveis
2. **Widgets hard-disabled** são completamente removidos da navegação por teclado.

Por padrão, `softDisabled` é `true`, o que permite que os widgets desabilitados ainda recebam foco. Se você quiser habilitar o modo hard-disabled, defina `[softDisabled]="false"` no toolbar.

<docs-tab-group>
  <docs-tab label="Básico">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/disabled/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/disabled/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/disabled/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/disabled/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/disabled/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/disabled/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/disabled/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/disabled/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/disabled/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/disabled/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/disabled/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/disabled/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

### Suporte a direita-para-esquerda (RTL) {#right-to-left-rtl-support}

Toolbars suportam automaticamente idiomas da direita para a esquerda. Envolva o toolbar em um container com `dir="rtl"` para inverter o layout e a direção de navegação pelo teclado. A navegação com as setas se ajusta automaticamente: a seta para a esquerda move para o próximo widget, e a seta para a direita move para o anterior.

<docs-tab-group>
  <docs-tab label="Básico">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/rtl/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/rtl/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/rtl/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/rtl/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/rtl/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/rtl/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/rtl/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/rtl/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/toolbar/src/rtl/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/toolbar/src/rtl/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/toolbar/src/rtl/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/toolbar/src/rtl/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## Testes {#testing}

A Angular Aria oferece harnesses de componente para testar componentes de toolbar.
Veja a seguir um exemplo de como usar os harnesses em um teste de componente:

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ToolbarHarness} from '@angular/aria/toolbar/testing';
import {MyToolbarComponent} from './my-toolbar'; // Seu componente

describe('MyToolbarComponent', () => {
  let fixture: ComponentFixture<MyToolbarComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MyToolbarComponent],
    });

    fixture = TestBed.createComponent(MyToolbarComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should have widgets and update toggle state on click', async () => {
    // Carrega o harness do toolbar
    const toolbar = await loader.getHarness(ToolbarHarness);

    // Obtém todos os widgets
    const widgets = await toolbar.getWidgets();
    expect(widgets.length).toBe(3);

    // Clica no primeiro widget
    await widgets[0].click();

    // Verifica se o estado pressionado foi atualizado pelo handler de clique
    expect(await widgets[0].isSelected()).toBe(true);
  });
});
```

## Referência da API {#api-reference}

Para a documentação detalhada da API, consulte as seguintes referências:

- [`Toolbar`](/api/aria/toolbar/Toolbar)
- [`ToolbarWidget`](/api/aria/toolbar/ToolbarWidget)
- [`ToolbarWidgetGroup`](/api/aria/toolbar/ToolbarWidgetGroup)
