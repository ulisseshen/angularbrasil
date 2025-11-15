<!-- ia-translate: true -->
<docs-decorative-header title="Angular Aria">
</docs-decorative-header>

## O que é Angular Aria?

Construir componentes acessíveis parece direto, mas implementá-los de acordo com as Diretrizes de Acessibilidade do W3 requer esforço significativo e expertise em acessibilidade.

Angular Aria é uma coleção de directives acessíveis e headless que implementam padrões WAI-ARIA comuns. As directives lidam com interações de teclado, atributos ARIA, gerenciamento de foco e suporte para leitores de tela. Tudo que você precisa fazer é fornecer a estrutura HTML, estilização CSS e lógica de negócio!

## Instalação

<docs-code language="shell">
  ng add @angular/aria
</docs-code>

## Demonstração / Showcase

Por exemplo, vamos pegar um menu de toolbar. Embora possa parecer uma "simples" linha de botões vinculados com lógica específica, navegação por teclado e leitores de tela adicionam muita complexidade inesperada para aqueles não familiarizados com acessibilidade.

```
<!------------------------------------->
<!-- INSERT EMBEDDED DEMO OF TOOLBAR -->
<!------------------------------------->
```

Neste único cenário, desenvolvedores precisam considerar:

- **Navegação por teclado**. Usuários precisam abrir o menu com Enter ou Espaço, navegar pelas opções com as setas, selecionar com Enter e fechar com Escape.
- **Leitores de tela** precisam anunciar o estado do menu, o número de opções e qual opção tem foco.
- **Gerenciamento de foco** precisa mover logicamente entre o trigger e os itens do menu.
- **Idiomas da direita para a esquerda** requerem a capacidade de navegar em ordem reversa.

## O que está incluído?

Angular Aria inclui directives para padrões interativos comuns:

| Component                               | Description                                                        |
| --------------------------------------- | ------------------------------------------------------------------ |
| [Accordion](guide/aria/accordion)       | Painéis de conteúdo recolhíveis que podem expandir individualmente ou exclusivamente |
| [Autocomplete](guide/aria/autocomplete) | Input de texto com sugestões filtradas que aparecem conforme os usuários digitam |
| [Combobox](guide/aria/combobox)         | Directive primitiva que coordena um input de texto com um popup    |
| [Grid](guide/aria/grid)                 | Exibição de dados bidimensional com navegação por teclado célula por célula |
| [Listbox](guide/aria/listbox)           | Listas de opções de seleção única ou múltipla com navegação por teclado |
| [Menu](guide/aria/menu)                 | Menus dropdown com submenus aninhados e atalhos de teclado         |
| [Multiselect](guide/aria/multiselect)   | Padrão de dropdown de seleção múltipla com exibição compacta       |
| [Select](guide/aria/select)             | Padrão de dropdown de seleção única com navegação por teclado      |
| [Tabs](guide/aria/tabs)                 | Interfaces com abas com modos de ativação automática ou manual     |
| [Toolbar](guide/aria/toolbar)           | Conjuntos agrupados de controles com navegação por teclado lógica  |
| [Tree](guide/aria/tree)                 | Listas hierárquicas com funcionalidade de expandir/recolher        |

Cada componente inclui documentação abrangente, exemplos funcionais e referências de API.

## Quando usar Angular Aria

Angular Aria funciona bem quando você precisa de componentes interativos acessíveis que sejam compatíveis com WCAG com estilização personalizada. Exemplos incluem:

- **Construindo um design system** - Sua equipe mantém uma biblioteca de componentes com padrões visuais específicos que precisam de implementações acessíveis
- **Bibliotecas de componentes empresariais** - Você está criando componentes reutilizáveis para múltiplas aplicações dentro de uma organização
- **Requisitos de marca personalizados** - A interface precisa corresponder a especificações de design precisas que bibliotecas de componentes pré-estilizadas não podem acomodar facilmente

## Quando não usar Angular Aria

Angular Aria pode não se encaixar em todos os cenários:

- **Componentes pré-estilizados** - Se você precisa de componentes que pareçam completos sem estilização personalizada, use Angular Material em vez disso
- **Formulários simples** - Controles de formulário HTML nativos como <button> e <input type="radio"> fornecem acessibilidade integrada para casos de uso diretos
- **Prototipagem rápida** - Ao validar conceitos rapidamente, bibliotecas de componentes pré-estilizadas reduzem o tempo de desenvolvimento inicial

## Próximos passos

Explore os guias de componentes para encontrar o padrão que se encaixa nas suas necessidades:

**Busca e seleção**

- Autocomplete - Busque e filtre opções conforme os usuários digitam
- Listbox - Selecione um ou múltiplos itens de uma lista
- Select - Escolha uma opção de uma lista de opções
- Multiselect - Escolha múltiplas opções de uma lista de opções

**Navegação e chamadas para ação**

- Menu - Menus de ação com submenus aninhados opcionais
- Tabs - Alterne entre painéis de conteúdo relacionados
- Toolbar - Agrupe controles e ações relacionados

**Organização de conteúdo**

- Accordion - Mostre e oculte seções de conteúdo
- Tree - Exiba estruturas de dados hierárquicas
  Exibição de dados
- Grid - Navegue e interaja com dados tabulares
