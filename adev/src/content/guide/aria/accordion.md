<!-- ia-translate: true -->
# Accordion

<docs-pill-row>
  <docs-pill href="https://www.w3.org/WAI/ARIA/apg/patterns/accordion/" title="Padrão ARIA de accordion"/>
  <docs-pill href="/api?query=accordion#angular_aria_accordion" title="Referência da API de Accordion"/>
</docs-pill-row>

## Visão geral {#overview}

Um accordion organiza conteúdos relacionados em seções expansíveis e recolhíveis, reduzindo a rolagem da página e ajudando o usuário a focar nas informações relevantes. Cada seção tem um botão de gatilho (trigger) e um painel de conteúdo. Ao clicar em um gatilho, a visibilidade do painel associado é alternada.

<docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.ts">
  <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.ts"/>
  <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.html"/>
  <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.css"/>
</docs-code-multifile>

## Uso {#usage}

Accordions funcionam bem para organizar conteúdos em grupos lógicos, nos quais o usuário normalmente precisa ver uma seção por vez.

**Use accordions quando:**

- Estiver exibindo FAQs com várias perguntas e respostas
- Estiver organizando formulários longos em seções gerenciáveis
- Quiser reduzir a rolagem em páginas com muito conteúdo
- Estiver revelando progressivamente informações relacionadas

**Evite accordions quando:**

- Estiver construindo menus de navegação (use o component [Menu](guide/aria/menu) no lugar)
- Estiver criando interfaces com abas (use o component [Tabs](guide/aria/tabs) no lugar)
- Precisar mostrar uma única seção recolhível (use um padrão de disclosure no lugar)
- Os usuários precisarem ver várias seções ao mesmo tempo (considere um layout diferente)

## Recursos {#features}

- **Modos de expansão** - Controle se um ou vários painéis podem ficar abertos ao mesmo tempo
- **Navegação por teclado** - Navegue entre os gatilhos usando as teclas de seta, Home e End
- **Renderização preguiçosa (lazy)** - O conteúdo só é criado quando um painel é expandido, melhorando o desempenho do carregamento inicial
- **Estados desabilitados** - Desabilite o grupo inteiro ou gatilhos individuais
- **Gerenciamento de foco** - Controle se os itens desabilitados podem receber o foco do teclado
- **Controle programático** - Expanda, recolha ou alterne painéis a partir do código do seu component
- **Suporte a RTL** - Suporte automático para idiomas da direita para a esquerda

## Exemplos {#examples}

### Modo de expansão única {#single-expansion-mode}

Defina `[multiExpandable]="false"` para permitir que apenas um painel fique aberto por vez. Ao abrir um novo painel, qualquer painel aberto anteriormente é fechado automaticamente.

<docs-tab-group>
  <docs-tab label="Básico">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/single-expansion/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/single-expansion/material/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/single-expansion/material/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/single-expansion/material/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/single-expansion/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/single-expansion/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/single-expansion/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/single-expansion/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/single-expansion/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Este modo funciona bem para FAQs ou em situações nas quais você quer que o usuário foque em uma resposta por vez.

### Modo de expansão múltipla {#multiple-expansion-mode}

Defina `[multiExpandable]="true"` para permitir que vários painéis fiquem abertos simultaneamente. Os usuários podem expandir quantos painéis forem necessários sem fechar os outros.

<docs-tab-group>
  <docs-tab label="Básico">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/multi-expansion/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/multi-expansion/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/multi-expansion/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/multi-expansion/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/multi-expansion/material/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/multi-expansion/material/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/multi-expansion/material/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/multi-expansion/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/multi-expansion/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/multi-expansion/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/multi-expansion/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/multi-expansion/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Este modo é útil para seções de formulários ou quando os usuários precisam comparar conteúdos em vários painéis.

NOTE: O input `multiExpandable` tem `true` como padrão. Defina-o explicitamente como `false` se quiser o comportamento de expansão única.

### Itens de accordion desabilitados {#disabled-accordion-items}

Desabilite gatilhos específicos usando o input `disabled`. Controle como os itens desabilitados se comportam durante a navegação por teclado usando o input `softDisabled` no grupo do accordion.

<docs-tab-group>
  <docs-tab label="Básico">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/disabled-focusable/basic/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/basic/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/basic/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/basic/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Material">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/disabled-focusable/material/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/material/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/material/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/material/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
  <docs-tab label="Retro">
    <docs-code-multifile preview hideCode path="adev/src/content/examples/aria/accordion/src/disabled-focusable/retro/app/app.ts">
      <docs-code header="TS" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/retro/app/app.ts"/>
      <docs-code header="HTML" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/retro/app/app.html"/>
      <docs-code header="CSS" path="adev/src/content/examples/aria/accordion/src/disabled-focusable/retro/app/app.css"/>
    </docs-code-multifile>
  </docs-tab>
</docs-tab-group>

Quando `[softDisabled]="true"` (o padrão), os itens desabilitados podem receber o foco, mas não podem ser ativados. Quando `[softDisabled]="false"`, os itens desabilitados são totalmente ignorados durante a navegação por teclado.

### Renderização preguiçosa de conteúdo {#lazy-content-rendering}

Use a diretiva `ngAccordionContent` em um `ng-template` para adiar a renderização do conteúdo até que o painel seja expandido. Isso melhora o desempenho de accordions com conteúdos pesados, como imagens, gráficos ou components complexos.

```angular-html
<div ngAccordionGroup>
  <div>
    <button ngAccordionTrigger [panel]="panel1">Trigger Text</button>
    <div ngAccordionPanel #panel1="ngAccordionPanel">
      <ng-template ngAccordionContent>
        <!-- Este conteúdo só é renderizado quando o painel abre -->
        <img src="large-image.jpg" alt="Description" />
        <app-expensive-component />
      </ng-template>
    </div>
  </div>
</div>
```

Por padrão, o conteúdo é removido do DOM quando o painel é recolhido. Defina `[preserveContent]="true"` para mantê-lo, por exemplo, quando o painel contém um vídeo que não deve reiniciar ao ser recolhido.

## Testes {#testing}

O Angular Aria fornece harnesses de component para testar components de accordion.
Veja um exemplo de como usar os harnesses em um teste de component:

```typescript
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {AccordionGroupHarness} from '@angular/aria/accordion/testing';
import {MyAccordionComponent} from './my-accordion'; // Seu component

describe('MyAccordionComponent', () => {
  let fixture: ComponentFixture<MyAccordionComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [MyAccordionComponent],
    });

    fixture = TestBed.createComponent(MyAccordionComponent);
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should allow expanding panels', async () => {
    // Carrega o harness do grupo de accordion
    const group = await loader.getHarness(AccordionGroupHarness);

    // Obtém todos os accordions individuais (itens) do grupo
    const accordions = await group.getAccordions();
    expect(accordions.length).toBe(3);

    // Verifica o estado inicial (o primeiro expandido, os outros recolhidos)
    expect(await accordions[0].isExpanded()).toBe(true);
    expect(await accordions[1].isExpanded()).toBe(false);

    // Expande o segundo painel
    await accordions[1].expand();

    // Verifica o estado atualizado
    expect(await accordions[1].isExpanded()).toBe(true);
    // Se multiExpandable for false, o primeiro agora deve estar recolhido
    expect(await accordions[0].isExpanded()).toBe(false);
  });
});
```

## Referência da API {#api-reference}

Para a documentação detalhada da API, consulte as seguintes referências:

- [`AccordionGroup`](/api/aria/accordion/AccordionGroup)
- [`AccordionTrigger`](/api/aria/accordion/AccordionTrigger)
- [`AccordionPanel`](/api/aria/accordion/AccordionPanel)
- [`AccordionContent`](/api/aria/accordion/AccordionContent)
