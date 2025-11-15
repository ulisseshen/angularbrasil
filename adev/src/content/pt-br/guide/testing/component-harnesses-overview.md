<!-- ia-translate: true -->
# Visão geral de component harnesses

Um <strong>component harness</strong> é uma classe que permite que testes interajam com components da mesma forma que um usuário final faz através de uma API suportada. Você pode criar test harnesses para qualquer component, desde pequenos widgets reutilizáveis até páginas completas.

Harnesses oferecem vários benefícios:

- Eles tornam os testes menos frágeis, isolando-se contra detalhes de implementação de um component, como sua estrutura DOM
- Eles tornam os testes mais legíveis e fáceis de manter
- Eles podem ser usados em múltiplos ambientes de teste

<docs-code language="typescript">
// Exemplo de teste com um harness para um component chamado MyButtonComponent
it('should load button with exact text', async () => {
  const button = await loader.getHarness(MyButtonComponentHarness);
  expect(await button.getText()).toBe('Confirm');
});
</docs-code>

Component harnesses são especialmente úteis para widgets de UI compartilhados. Desenvolvedores frequentemente escrevem testes que dependem de detalhes de implementação privados de widgets, como estrutura DOM e classes CSS. Essas dependências tornam os testes frágeis e difíceis de manter. Harnesses oferecem uma alternativa— uma API suportada que interage com o widget da mesma forma que um usuário final faz. Mudanças na implementação do widget agora se tornam menos propensas a quebrar testes de usuários. Por exemplo, [Angular Material](https://material.angular.dev/components/categories) fornece um test harness para cada component na biblioteca.

Component harnesses suportam múltiplos ambientes de teste. Você pode usar a mesma implementação de harness em testes unitários e end-to-end. Autores de testes precisam apenas aprender uma API e autores de components não precisam manter implementações de teste unitário e end-to-end separadas.

Muitos desenvolvedores podem ser categorizados por uma das seguintes categorias de tipo de desenvolvedor: autores de testes, autores de component harness, e autores de ambiente de harness. Use a tabela abaixo para encontrar a seção mais relevante neste guia baseado nessas categorias:

| Tipo de Desenvolvedor           | Descrição                                                                                                                                                                                                                                                                                                      | Seção Relevante                                                                                              |
| :------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------- |
| Autores de Testes               | Desenvolvedores que usam component harnesses escritos por outra pessoa para testar sua aplicação. Por exemplo, isso pode ser um desenvolvedor de app que usa um component de menu de terceiros e precisa interagir com o menu em um teste unitário.                                                           | [Usando component harnesses em testes](guide/testing/using-component-harnesses)                                |
| Autores de Component Harness    | Desenvolvedores que mantêm alguns components Angular reutilizáveis e querem criar um test harness para seus usuários usarem em seus testes. Por exemplo, um autor de uma biblioteca de components Angular de terceiros ou um desenvolvedor que mantém um conjunto de components comuns para uma aplicação Angular grande. | [Criando component harnesses para seus components](guide/testing/creating-component-harnesses)               |
| Autores de Ambiente de Harness  | Desenvolvedores que querem adicionar suporte para usar component harnesses em ambientes de teste adicionais. Para informações sobre ambientes de teste suportados fora da caixa, veja o [test harness environments e loaders](guide/testing/using-component-harnesses#test-harness-environments-and-loaders). | [Adicionando suporte para ambientes de teste adicionais](guide/testing/component-harnesses-testing-environments) |

Para a referência completa da API, por favor veja a [página de referência da API de component harness do Angular CDK](/api#angular_cdk_testing).
