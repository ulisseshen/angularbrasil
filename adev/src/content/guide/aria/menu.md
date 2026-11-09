<!-- ia-translate: true -->
# Menu

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/menubar/" title="Padrão ARIA de menu"/>
  <docs-pill href="/api/aria/menu/Menu" title="Referência da API do Menu"/>
</docs-pill-row>

## Visão geral {#overview}

Um menu oferece aos usuários uma lista de ações ou opções, normalmente exibida em resposta a um clique em um botão ou a um clique com o botão direito. Menus oferecem suporte à navegação pelo teclado com as teclas de seta, submenus, caixas de seleção, botões de opção e itens desabilitados.

<docs-tab-group>
  <docs-tab label="Básico">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## Uso {#usage}

Menus são adequados para apresentar listas de ações ou comandos dos quais o usuário pode escolher.

**Use menus quando:**

- Criar menus de comandos da aplicação (Arquivo, Editar, Exibir)
- Criar menus de contexto (ações do clique com o botão direito)
- Exibir listas de ações suspensas
- Implementar listas suspensas em barras de ferramentas
- Organizar configurações ou opções

**Evite menus quando:**

- Construir a navegação do site (use landmarks de navegação)
- Criar selects de formulário (use o componente [Select](guide/aria/select))
- Alternar entre painéis de conteúdo (use [Tabs](guide/aria/tabs))
- Exibir conteúdo recolhível (use [Accordion](guide/aria/accordion))

## Recursos {#features}

- **Navegação pelo teclado** - Teclas de seta, Home/End e busca por caractere para uma navegação eficiente
- **Submenus** - Suporte a menus aninhados com posicionamento automático
- **Tipos de menu** - Menus standalone, menus disparados por trigger e barras de menu
- **Caixas de seleção e botões de opção** - Itens de menu para alternar e selecionar
- **Itens desabilitados** - Estados desabilitados suaves ou rígidos com gerenciamento de foco
- **Fechamento automático** - Fechamento configurável ao selecionar uma opção
- **Suporte a RTL** - Navegação em idiomas da direita para a esquerda

## Exemplos {#examples}

### Menu com trigger {#menu-with-trigger}

Crie um menu suspenso combinando um botão de trigger com um menu. O trigger abre e fecha o menu.

<docs-tab-group>
  <docs-tab label="Básico">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

O menu fecha automaticamente quando o usuário seleciona um item ou pressiona Escape.

### Menu de contexto {#context-menu}

Menus de contexto aparecem na posição do cursor quando o usuário clica com o botão direito em um elemento.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-context/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-context/app/app.ts"/>
  <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-context/app/app.html"/>
</docs-code-multifile>

Posicione o menu usando as coordenadas do evento `contextmenu`.

### Menu standalone {#standalone-menu}

Um menu standalone não precisa de um trigger e permanece visível na interface.

<docs-tab-group>
  <docs-tab label="Básico">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-standalone/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-standalone/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-standalone/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-standalone/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-standalone/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-standalone/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-standalone/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-standalone/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-standalone/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-standalone/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-standalone/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-standalone/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Menus standalone funcionam bem para listas de ações ou de navegação que devem estar sempre visíveis.

### Itens de menu desabilitados {#disabled-menu-items}

Desabilite itens específicos do menu usando a entrada `disabled`. Controle o comportamento do foco com `softDisabled`.

<docs-tab-group>
  <docs-tab label="Básico">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menu/src/menu-trigger-disabled/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Quando `[softDisabled]="true"`, itens desabilitados podem receber foco, mas não podem ser ativados. Quando `[softDisabled]="false"`, itens desabilitados são ignorados durante a navegação pelo teclado.

## Testes {#testing}

A Angular Aria oferece harnesses de componente para testar componentes de menu.
Veja a seguir um exemplo de como usar os harnesses em um teste de componente:

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {MenuHarness, MenuItemHarness} from '@angular/aria/menu/testing';
import {MyMenuComponent} from './my-menu'; // Seu componente

describe('MyMenuComponent', () => {
  let fixture: ComponentFixture<MyMenuComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MyMenuComponent],
    });

    fixture = TestBed.createComponent(MyMenuComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should open menu and click item', async () => {
    // Carrega o harness do menu pelo texto do trigger
    const menu = await loader.getHarness(MenuHarness.with({triggerText: 'Open Menu'}));

    // Verifica o estado inicial
    expect(await menu.isOpen()).toBe(false);

    // Abre o menu
    await menu.open();
    expect(await menu.isOpen()).toBe(true);

    // Obtém os itens
    const items = await menu.getItems();
    expect(items.length).toBe(3);
    expect(await items[0].getText()).toBe('Item 1');

    // Clica no primeiro item
    await items[0].click();

    // O menu deve fechar após a seleção (depende da sua implementação)
    expect(await menu.isOpen()).toBe(false);
  });

  it('should interact with submenus', async () => {
    const menu = await loader.getHarness(MenuHarness.with({triggerText: 'Open Menu'}));
    await menu.open();

    // Obtém o item que abre um submenu
    const subItem = await loader.getHarness(MenuItemHarness.with({text: 'Submenu'}));
    expect(await subItem.hasSubmenu()).toBe(true);

    // Abre o submenu
    await subItem.click();
    const submenu = await subItem.getSubmenu();
    expect(submenu).toBeTruthy();
    expect(await submenu!.isOpen()).toBe(true);

    // Interage com os itens do submenu
    const subItems = await submenu!.getItems();
    expect(subItems.length).toBe(1);
  });
});
```

## Referência da API {#api-reference}

Para a documentação detalhada da API, consulte as seguintes referências:

- [`Menu`](/api/aria/menu/Menu)
- [`MenuBar`](/api/aria/menu/MenuBar)
- [`MenuItem`](/api/aria/menu/MenuItem)
- [`MenuTrigger`](/api/aria/menu/MenuTrigger)
- [`MenuContent`](/api/aria/menu/MenuContent)
