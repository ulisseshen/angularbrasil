<!-- ia-translate: true -->
# Prompts de LLM e configuração de IDE com IA

Gerar código com modelos de linguagem grandes (LLMs) é uma área de interesse em rápido crescimento para desenvolvedores. Embora os LLMs frequentemente sejam capazes de gerar código funcional, pode ser um desafio gerar código para frameworks em constante evolução como o Angular.

Instruções avançadas e prompting são um padrão emergente para dar suporte à geração de código moderna com detalhes específicos de domínio. Esta seção reúne conteúdo e recursos selecionados para apoiar uma geração de código mais precisa para Angular e LLMs.

## Prompts customizados e instruções de sistema {#custom-prompts-and-system-instructions}

Melhore sua experiência gerando código com LLMs usando um dos seguintes arquivos customizados e específicos de domínio.

NOTE: Esses arquivos serão atualizados regularmente, acompanhando as convenções do Angular.

Aqui está um conjunto de instruções para ajudar os LLMs a gerar código correto que segue as boas práticas do Angular. Este arquivo pode ser incluído como instruções de sistema nas suas ferramentas de IA ou incluído junto com o seu prompt como contexto.

<docs-code language="md" path="packages/core/resources/best-practices.md" class="compact"/>

<a download href="/assets/context/best-practices.md" target="_blank">Clique aqui para baixar o arquivo best-practices.md.</a>

## Arquivos de regras {#rules-files}

Várias ferramentas, como o <a href="https://antigravity.google?utm_source=adev&utm_medium=website&utm_campaign=BUILD_WITH_AI_ANGULAR&utm_term=angular_devrel&utm_content=build_with_ai_angular_antigravity" target="_blank">Antigravity</a>, possuem arquivos de regras úteis para fornecer contexto crítico aos LLMs.

| Ambiente/IDE         | Arquivo de regras                                                                                                      | Instruções de instalação                                                                                                                                        |
| :------------------- | :--------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Antigravity          | <a download href="/assets/context/GEMINI.md" target="_blank">GEMINI.md</a>                                             | <a href="https://antigravity.google/docs/rules-workflows" target="_blank">Configure `GEMINI.md`</a>                                                             |
| Copilot powered IDEs | <a download="copilot-instructions.md" href="/assets/context/guidelines.md" target="_blank">copilot-instructions.md</a> | <a href="https://code.visualstudio.com/docs/copilot/copilot-customization#_custom-instructions" target="_blank">Configure `.github/copilot-instructions.md`</a> |
| Cursor               | <a download href="/assets/context/angular-20.mdc" target="_blank">cursor.md</a>                                        | <a href="https://docs.cursor.com/context/rules" target="_blank">Configure `cursorrules.md`</a>                                                                  |
| JetBrains IDEs       | <a download href="/assets/context/AGENTS.md" target="_blank">AGENTS.md</a>                                             | <a href="https://junie.jetbrains.com/docs/guidelines-and-memory.html#how-junie-cli-discovers-guidelines" target="_blank">Configure `AGENTS.md`</a>              |
| VS Code              | <a download=".instructions.md" href="/assets/context/guidelines.md" target="_blank">.instructions.md</a>               | <a href="https://code.visualstudio.com/docs/copilot/copilot-customization#_custom-instructions" target="_blank">Configure `.instructions.md`</a>                |
| Windsurf             | <a download href="/assets/context/guidelines.md" target="_blank">guidelines.md</a>                                     | <a href="https://docs.windsurf.com/windsurf/cascade/memories#rules" target="_blank">Configure `guidelines.md`</a>                                               |

## Configuração do Angular CLI MCP Server {#angular-cli-mcp-server-setup}

O Angular CLI inclui um [Model Context Protocol (MCP) server](https://modelcontextprotocol.io/) experimental que permite que assistentes de IA no seu ambiente de desenvolvimento interajam com o Angular CLI.

[**Aprenda a configurar o Angular CLI MCP Server**](/ai/mcp)

## Fornecendo contexto com `llms.txt` {#providing-context-with-llmstxt}

`llms.txt` é um padrão proposto para sites, projetado para ajudar os LLMs a entender e processar melhor o seu conteúdo. A equipe do Angular desenvolveu duas versões deste arquivo para ajudar os LLMs e as ferramentas que usam LLMs para geração de código a criar código Angular moderno de forma melhor.

- <a href="/llms.txt" target="_blank">llms.txt</a> - um arquivo de índice com links para os arquivos e recursos-chave.
- <a href="/assets/context/llms-full.txt" target="_blank">llms-full.txt</a> - um conjunto compilado e mais completo de recursos que descreve como o Angular funciona e como construir aplicações Angular.

Confira a [página de visão geral](/ai) para mais informações sobre como integrar IA às suas aplicações Angular.
