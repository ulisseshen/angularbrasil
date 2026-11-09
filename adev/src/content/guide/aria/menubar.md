<!-- ia-translate: true -->
# Menubar

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/menubar/" title="Padrão ARIA de menubar"/>
  <docs-pill href="/api/aria/menu/MenuBar" title="Referência da API da Menubar"/>
</docs-pill-row>

## Visão geral {#overview}

A menubar é uma barra de navegação horizontal que oferece acesso permanente aos menus da aplicação. Menubars organizam comandos em categorias lógicas como Arquivo, Editar e Exibir, ajudando os usuários a descobrir e executar recursos da aplicação por meio de interação com o teclado ou o mouse.

<docs-tab-group>
  <docs-tab label="Básico">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## Uso {#usage}

Menubars funcionam bem para organizar comandos da aplicação em uma navegação persistente e fácil de descobrir.

**Use menubars quando:**

- Construir barras de comandos da aplicação (como Arquivo, Editar, Exibir, Inserir, Formatar)
- Criar uma navegação persistente que permaneça visível em toda a interface
- Organizar comandos em categorias lógicas de nível superior
- Precisar de navegação por menu horizontal com suporte ao teclado
- Construir interfaces de aplicação no estilo desktop

**Evite menubars quando:**

- Construir menus suspensos para ações individuais (use [Menu com trigger](guide/aria/menu) no lugar)
- Criar menus de contexto (use o padrão do guia [Menu](guide/aria/menu))
- Exibir listas simples de ações standalone (use [Menu](guide/aria/menu) no lugar)
- Criar interfaces mobile, onde o espaço horizontal é limitado
- A navegação pertencer a um padrão de navegação em sidebar ou em header

## Recursos {#features}

- **Navegação horizontal** - As teclas de seta para a esquerda e para a direita movem entre as categorias de nível superior
- **Visibilidade persistente** - Sempre visível, não é modal nem pode ser dispensada
- **Abertura ao passar o mouse** - Submenus abrem ao passar o mouse após a primeira interação pelo teclado ou clique
- **Submenus aninhados** - Suporte a múltiplos níveis de profundidade de menu
- **Navegação pelo teclado** - Teclas de seta, Enter/Espaço, Escape e busca por digitação (typeahead)
- **Estados desabilitados** - Desabilite a menubar inteira ou itens individuais
- **Suporte a RTL** - Navegação automática em idiomas da direita para a esquerda

## Exemplos {#examples}

### Menubar básica {#basic-menubar}

Uma menubar oferece acesso persistente aos comandos da aplicação organizados em categorias de nível superior. Os usuários navegam entre as categorias com as setas para a esquerda e para a direita e abrem os menus com Enter ou a seta para baixo.

<docs-tab-group>
  <docs-tab label="Básico">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Pressione a seta para a direita para mover entre Arquivo, Editar e Exibir. Pressione Enter ou a seta para baixo para abrir um menu e navegar pelos itens do submenu com as setas para cima e para baixo.

### Itens desabilitados da menubar {#disabled-menubar-items}

Desabilite itens específicos do menu ou a menubar inteira para impedir a interação. Controle se os itens desabilitados podem receber foco do teclado com a entrada `softDisabled`.

<docs-tab-group>
  <docs-tab label="Básico">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/disabled/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/disabled/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/disabled/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/disabled/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/disabled/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/disabled/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/disabled/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/disabled/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/disabled/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/disabled/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/disabled/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/disabled/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Quando `[softDisabled]="true"` na menubar, itens desabilitados podem receber foco, mas não podem ser ativados. Quando `[softDisabled]="false"`, itens desabilitados são ignorados durante a navegação pelo teclado.

### Suporte a RTL {#rtl-support}

Menubars se adaptam automaticamente a idiomas da direita para a esquerda (RTL). A navegação pelas teclas de seta inverte a direção, e os submenus são posicionados do lado esquerdo.

<docs-tab-group>
  <docs-tab label="Básico">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/rtl/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/rtl/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/rtl/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/rtl/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/rtl/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/rtl/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/rtl/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/rtl/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/menubar/src/rtl/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/menubar/src/rtl/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/menubar/src/rtl/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/menubar/src/rtl/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

O atributo `dir="rtl"` habilita o modo RTL. A seta para a esquerda move para a direita, e a seta para a direita move para a esquerda, mantendo a navegação natural para usuários de idiomas RTL.

## Testes {#testing}

A Angular Aria oferece harnesses de componente para testar componentes de menubar.
Veja a seguir um exemplo de como usar os harnesses em um teste de componente:

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {MenuHarness} from '@angular/aria/menu/testing';
import {MyMenubarComponent} from './my-menubar'; // Seu componente

describe('MyMenubarComponent', () => {
  let fixture: ComponentFixture<MyMenubarComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MyMenubarComponent],
    });

    fixture = TestBed.createComponent(MyMenubarComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should interact with menubar items', async () => {
    // Carrega o harness da menubar (que é um MenuHarness com seletor '[ngMenuBar]')
    const menubar = await loader.getHarness(MenuHarness.with({selector: '[ngMenuBar]'}));

    // Menubars são persistentes e sempre "abertas"
    expect(await menubar.isOpen()).toBe(true);
    expect(await menubar.isMenuBar()).toBe(true);

    // Obtém os itens de nível superior
    const items = await menubar.getItems();
    expect(items.length).toBe(2);
    expect(await items[0].getText()).toBe('File');
    expect(await items[1].getText()).toBe('Edit');

    // Clica em um item para abrir o seu menu suspenso
    await items[0].click();

    const fileMenu = await items[0].getSubmenu();
    expect(fileMenu).toBeTruthy();
    expect(await fileMenu!.isOpen()).toBe(true);
  });
});
```

## Referência da API {#api-reference}

Para a documentação detalhada da API, consulte as seguintes referências:

- [`MenuBar`](/api/aria/menu/MenuBar)
- [`MenuItem`](/api/aria/menu/MenuItem)
- [`MenuTrigger`](/api/aria/menu/MenuTrigger)
- [`Menu`](/api/aria/menu/Menu)
