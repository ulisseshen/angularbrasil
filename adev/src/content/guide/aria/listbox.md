<!-- ia-translate: true -->
# Listbox

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/listbox/" title="Padrão ARIA de listbox"/>
  <docs-pill href="/api?query=listbox#angular_aria_listbox" title="Referência da API de Listbox"/>
</docs-pill-row>

## Visão geral {#overview}

Uma directive que exibe uma lista de opções para o usuário selecionar, com suporte a navegação por teclado, seleção única ou múltipla e suporte a leitores de tela.

<docs-tab-group>
  <docs-tab label="Básico">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/basic/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/basic/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/basic/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/listbox/src/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/basic/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/basic/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/basic/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/listbox/src/basic/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/basic/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/basic/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/basic/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/listbox/src/basic/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

## Uso {#usage}

Listbox é uma directive fundamental usada pelos padrões [Select](guide/aria/select), [Multiselect](guide/aria/multiselect) e [Autocomplete](guide/aria/autocomplete). Para a maioria das necessidades de dropdown, use esses padrões documentados.

Considere usar o listbox diretamente quando:

- **Estiver construindo components de seleção personalizados** - Criando interfaces especializadas com comportamento específico
- **Precisar de listas de seleção visíveis** - Exibindo itens selecionáveis diretamente na página (e não em dropdowns)
- **Precisar de padrões de integração personalizados** - Integrando com requisitos únicos de popup ou layout

Evite listbox quando:

- **Forem necessários menus de navegação** - Use a directive [Menu](guide/aria/menu) para ações e comandos

## Recursos {#features}

O listbox do Angular fornece uma implementação de lista totalmente acessível, com:

- **Navegação por teclado** - Navegue pelas opções com as setas e selecione com Enter ou Space
- **Suporte a leitores de tela** - Atributos ARIA integrados, incluindo role="listbox"
- **Seleção única ou múltipla** - O atributo `multi` controla o modo de seleção
- **Horizontal ou vertical** - O atributo `orientation` define a direção do layout
- **Busca por digitação (type-ahead)** - Digite caracteres para pular para as opções correspondentes
- **Reatividade baseada em signals** - Gerenciamento de estado reativo usando signals do Angular

## Exemplos {#examples}

### Listbox básico {#basic-listbox}

Às vezes, as aplicações precisam de listas selecionáveis visíveis diretamente na página, em vez de ocultas em um dropdown. Um listbox independente oferece navegação por teclado e seleção para essas interfaces de lista visíveis.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/basic/app/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/basic/app/app.ts" />
  <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/basic/app/app.html" />
</docs-code-multifile>

O signal model `value` fornece vinculação bidirecional aos itens selecionados. Com `selectionMode="explicit"`, os usuários pressionam Space ou Enter para selecionar opções. Para padrões de dropdown que combinam listbox com combobox e posicionamento de overlay, veja o padrão [Select](guide/aria/select).

### Listbox horizontal {#horizontal-listbox}

Listas às vezes funcionam melhor na horizontal, como em interfaces semelhantes a toolbars ou seleções no estilo de abas. O atributo `orientation` altera tanto o layout quanto a direção da navegação por teclado.

<docs-tab-group>
  <docs-tab label="Básico">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/horizontal/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/horizontal/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/horizontal/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/listbox/src/horizontal/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/horizontal/material/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/horizontal/material/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/horizontal/material/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/listbox/src/horizontal/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>

  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/horizontal/retro/app/app.ts">
      <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/horizontal/retro/app/app.ts"/>
      <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/horizontal/retro/app/app.html"/>
      <docs-code header="app.css" path="adev/src/content/examples/aria/listbox/src/horizontal/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Com `orientation="horizontal"`, as setas para a esquerda e para a direita navegam entre as opções, em vez das setas para cima e para baixo. O listbox lida automaticamente com idiomas da direita para a esquerda (RTL), invertendo a direção da navegação.

### Modos de seleção {#selection-modes}

O listbox oferece dois modos de seleção, que controlam quando os itens são selecionados.

O modo `'follow'` seleciona automaticamente o item focado, oferecendo uma interação mais rápida quando a seleção muda com frequência. O modo `'explicit'` exige Space ou Enter para confirmar a seleção, evitando mudanças acidentais durante a navegação. Padrões de dropdown normalmente usam o modo `'follow'` para seleção única.

#### Explícito {#explicit}

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/modes/app/explicit/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/modes/app/explicit/app.ts" />
  <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/modes/app/explicit/app.html" />
</docs-code-multifile>

#### Follow {#follow}

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/listbox/src/modes/app/follow/app.ts">
  <docs-code header="app.ts" path="adev/src/content/examples/aria/listbox/src/modes/app/follow/app.ts" />
  <docs-code header="app.html" path="adev/src/content/examples/aria/listbox/src/modes/app/follow/app.html" />
</docs-code-multifile>

| Modo         | Descrição                                                                                                                   |
| ------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `'follow'`   | Seleciona automaticamente o item focado, oferecendo uma interação mais rápida quando a seleção muda com frequência         |
| `'explicit'` | Exige Space ou Enter para confirmar a seleção, evitando mudanças acidentais durante a navegação                             |

DICA: Padrões de dropdown normalmente usam o modo `'follow'` para seleção única.

## Testes {#testing}

O Angular Aria fornece harnesses de component para testar components de listbox.
Veja um exemplo de como usar os harnesses em um teste de component:

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {ListboxHarness} from '@angular/aria/listbox/testing';
import {MyListboxComponent} from './my-listbox'; // Seu component

describe('MyListboxComponent', () => {
  let fixture: ComponentFixture<MyListboxComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MyListboxComponent],
    });

    fixture = TestBed.createComponent(MyListboxComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should allow selecting options', async () => {
    const listbox = await loader.getHarness(ListboxHarness);

    // Verifica as propriedades do listbox
    expect(await listbox.isMulti()).toBe(true);

    // Obtém todas as opções
    const options = await listbox.getOptions();
    expect(options.length).toBe(2);

    // Clica em uma opção
    await options[0].click();

    // Verifica se a opção está selecionada
    expect(await options[0].isSelected()).toBe(true);

    // Filtra as opções pelo texto
    const bananaOption = await listbox.getOptions({text: 'Banana'});
    expect(bananaOption.length).toBe(1);
  });
});
```

## Referência da API {#api-reference}

Para a documentação detalhada da API, consulte as seguintes referências:

- [`Listbox`](/api/aria/listbox/Listbox)
- [`Option`](/api/aria/listbox/Option)

### Padrões relacionados {#related-patterns}

O listbox é usado por estes padrões documentados de dropdown:

- [Select](guide/aria/select) - Padrão de dropdown de seleção única, usando combobox somente leitura + listbox
- [Multiselect](guide/aria/multiselect) - Padrão de dropdown de seleção múltipla, usando combobox somente leitura + listbox com `multi`
- [Autocomplete](guide/aria/autocomplete) - Padrão de dropdown filtrável, usando combobox + listbox

Para padrões completos de dropdown com trigger, popup e posicionamento de overlay, veja esses guias de padrão em vez de usar o listbox sozinho.
