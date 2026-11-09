<!-- ia-translate: true -->
<docs-decorative-header title="Angular Aria" imgSrc="adev/src/assets/images/aria.svg"> <!-- markdownlint-disable-line -->
</docs-decorative-header>

## O que é Angular Aria? {#what-is-angular-aria}

Construir componentes acessíveis parece simples, mas implementá-los de acordo com as [Diretrizes de Acessibilidade do W3C](https://www.w3.org/TR/wcag/) exige um esforço considerável e conhecimento específico de acessibilidade.

O Angular Aria é uma coleção de directives headless e acessíveis que implementam [padrões WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/patterns/) comuns. As directives cuidam das interações de teclado, dos atributos ARIA, do gerenciamento de foco e do suporte a leitores de tela. Tudo o que você precisa fazer é fornecer a estrutura HTML, a estilização em CSS e a lógica de negócio!

## Instalação {#installation}

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install @angular/aria
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add @angular/aria
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add @angular/aria
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add @angular/aria
  </docs-code>
</docs-code-multifile>

## Demonstração {#showcase}

Por exemplo, vamos pegar um menu de toolbar. Embora possa parecer uma "simples" linha de botões ligados a uma lógica específica, a navegação por teclado e os leitores de tela adicionam muita complexidade inesperada para quem não está familiarizado com acessibilidade.

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

Nesse cenário específico, os desenvolvedores precisam considerar:

- **Navegação por teclado**. Os usuários precisam abrir o menu com Enter ou Espaço, navegar pelas opções com as setas, selecionar com Enter e fechar com Escape.
- **Leitores de tela** precisam anunciar o estado do menu, o número de opções e qual opção está com foco.
- **Gerenciamento de foco** precisa se mover de forma lógica entre o trigger e os itens do menu.
- **Idiomas da direita para a esquerda** exigem a capacidade de navegar na ordem inversa.

## O que está incluído? {#whats-included}

O Angular Aria inclui directives com documentação completa, exemplos funcionais e referências de API para padrões interativos comuns:

### Busca e seleção {#search-and-selection}

| Componente                              | Descrição                                                      |
| --------------------------------------- | -------------------------------------------------------------- |
| [Autocomplete](guide/aria/autocomplete) | Campo de texto com sugestões filtradas que aparecem conforme o usuário digita |
| [Listbox](guide/aria/listbox)           | Listas de opções de seleção única ou múltipla com navegação por teclado |
| [Select](guide/aria/select)             | Padrão de dropdown de seleção única com navegação por teclado  |
| [Multiselect](guide/aria/multiselect)   | Padrão de dropdown de seleção múltipla com exibição compacta   |
| [Combobox](guide/aria/combobox)         | Directive primitiva que coordena um campo de texto com um popup |

### Navegação e chamadas para ação {#navigation-and-call-to-actions}

| Componente                    | Descrição                                                  |
| ----------------------------- | ---------------------------------------------------------- |
| [Menu](guide/aria/menu)       | Menus suspensos com submenus aninhados e atalhos de teclado |
| [Menubar](guide/aria/menubar) | Barra de navegação horizontal para menus persistentes da aplicação |
| [Toolbar](guide/aria/toolbar) | Conjuntos agrupados de controles com navegação por teclado lógica |

### Organização de conteúdo {#content-organization}

| Componente                        | Descrição                                                              |
| --------------------------------- | ---------------------------------------------------------------------- |
| [Accordion](guide/aria/accordion) | Painéis de conteúdo recolhíveis que podem ser expandidos individualmente ou de forma exclusiva |
| [Tabs](guide/aria/tabs)           | Interfaces com abas e modos de ativação automática ou manual           |
| [Tree](guide/aria/tree)           | Listas hierárquicas com funcionalidade de expandir e recolher          |
| [Grid](guide/aria/grid)           | Exibição de dados bidimensional com navegação por teclado célula a célula |

## Quando usar Angular Aria {#when-to-use-angular-aria}

O Angular Aria funciona bem quando você precisa de componentes interativos acessíveis, em conformidade com a WCAG, e com estilização personalizada. Alguns exemplos:

- **Construir um design system** - Sua equipe mantém uma biblioteca de componentes com padrões visuais específicos que precisam de implementações acessíveis
- **Bibliotecas de componentes corporativas** - Você está criando componentes reutilizáveis para várias aplicações dentro de uma organização
- **Requisitos de marca personalizados** - A interface precisa seguir especificações de design precisas que bibliotecas de componentes pré-estilizados não conseguem acomodar facilmente

## Quando não usar Angular Aria {#when-not-to-use-angular-aria}

O Angular Aria pode não se encaixar em todos os cenários:

- **Componentes pré-estilizados** - Se você precisa de componentes que pareçam completos sem estilização personalizada, use o Angular Material
- **Formulários simples** - Controles de formulário HTML nativos, como `<button>` e `<input type="radio">`, oferecem acessibilidade integrada para casos de uso diretos
- **Prototipagem rápida** - Ao validar conceitos rapidamente, bibliotecas de componentes pré-estilizados reduzem o tempo de desenvolvimento inicial

## Próximos passos {#next-steps}

Confira um componente na barra lateral de navegação ou na [lista acima](#whats-included), ou comece pelo [Toolbar](guide/aria/toolbar) para ver um exemplo completo de como as directives do Angular Aria funcionam!
