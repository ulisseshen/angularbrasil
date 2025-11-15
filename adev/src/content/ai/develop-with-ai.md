<!-- ia-translate: true -->
# Prompts de LLM e configuração de IDE com IA

Gerar código com modelos de linguagem grandes (LLMs) é uma área de interesse em rápido crescimento para desenvolvedores. Embora os LLMs frequentemente sejam capazes de gerar código funcional, pode ser um desafio gerar código para frameworks em constante evolução como Angular.

Instruções avançadas e prompting são um padrão emergente para suportar geração de código moderna com detalhes específicos de domínio. Esta seção contém conteúdo e recursos selecionados para suportar geração de código mais precisa para Angular e LLMs.

## Prompts Customizados e Instruções de Sistema

Melhore sua experiência gerando código com LLMs usando um dos seguintes arquivos customizados e específicos de domínio.

NOTE: Esses arquivos serão atualizados regularmente, mantendo-se atualizados com as convenções do Angular.

Aqui está um conjunto de instruções para ajudar LLMs a gerar código correto que segue as boas práticas do Angular. Este arquivo pode ser incluído como instruções de sistema para suas ferramentas de IA ou incluído junto com seu prompt como contexto.

<docs-code language="md" path="packages/core/resources/best-practices.md" class="compact"/>

<a download href="/assets/context/best-practices.md" target="_blank">Clique aqui para baixar o arquivo best-practices.md.</a>

## Arquivos de Regras

Vários editores, como <a href="https://studio.firebase.google.com?utm_source=adev&utm_medium=website&utm_campaign=BUILD_WITH_AI_ANGULAR&utm_term=angular_devrel&utm_content=build_with_ai_angular_firebase_studio">Firebase Studio</a> possuem arquivos de regras úteis para fornecer contexto crítico aos LLMs.

| Ambiente/IDE         | Arquivo de Regras                                                                                                      | Instruções de Instalação                                                                                                                                        |
| :------------------- | :--------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Firebase Studio      | <a download href="/assets/context/airules.md" target="_blank">airules.md</a>                                           | <a href="https://firebase.google.com/docs/studio/set-up-gemini#custom-instructions">Configure `airules.md`</a>                                                  |
| Copilot powered IDEs | <a download="copilot-instructions.md" href="/assets/context/guidelines.md" target="_blank">copilot-instructions.md</a> | <a href="https://code.visualstudio.com/docs/copilot/copilot-customization#_custom-instructions" target="_blank">Configure `.github/copilot-instructions.md`</a> |
| Cursor               | <a download href="/assets/context/angular-20.mdc" target="_blank">cursor.md</a>                                        | <a href="https://docs.cursor.com/context/rules" target="_blank">Configure `cursorrules.md`</a>                                                                  |
| JetBrains IDEs       | <a download href="/assets/context/guidelines.md" target="_blank">guidelines.md</a>                                     | <a href="https://www.jetbrains.com/help/junie/customize-guidelines.html" target="_blank">Configure `guidelines.md`</a>                                          |
| VS Code              | <a download=".instructions.md" href="/assets/context/guidelines.md" target="_blank">.instructions.md</a>               | <a href="https://code.visualstudio.com/docs/copilot/copilot-customization#_custom-instructions" target="_blank">Configure `.instructions.md`</a>                |
| Windsurf             | <a download href="/assets/context/guidelines.md" target="_blank">guidelines.md</a>                                     | <a href="https://docs.windsurf.com/windsurf/cascade/memories#rules" target="_blank">Configure `guidelines.md`</a>                                               |

## Configuração do Angular CLI MCP Server

O Angular CLI inclui um [Model Context Protocol (MCP) server](https://modelcontextprotocol.io/) experimental que permite que assistentes de IA em seu ambiente de desenvolvimento interajam com o Angular CLI.

[**Aprenda a configurar o Angular CLI MCP Server**](/ai/mcp)

## Fornecendo Contexto com `llms.txt`

`llms.txt` é um padrão proposto para sites projetado para ajudar LLMs a entender e processar melhor seu conteúdo. A equipe Angular desenvolveu duas versões deste arquivo para ajudar LLMs e ferramentas que usam LLMs para geração de código a criar código Angular moderno melhor.

- <a href="/llms.txt" target="_blank">llms.txt</a> - um arquivo de índice fornecendo links para arquivos e recursos-chave.
- <a href="/assets/context/llms-full.txt" target="_blank">llms-full.txt</a> - um conjunto compilado mais robusto de recursos descrevendo como Angular funciona e como construir aplicações Angular.

Certifique-se de [conferir a página de visão geral](/ai) para mais informações sobre como integrar IA em suas aplicações Angular.

## Web Codegen Scorer

A equipe Angular desenvolveu e disponibilizou como open-source o [Web Codegen Scorer](https://github.com/angular/web-codegen-scorer), uma ferramenta para avaliar e pontuar a qualidade do código web gerado por IA. Você pode usar esta ferramenta para tomar decisões baseadas em evidências relacionadas a código gerado por IA, como ajustar prompts para melhorar a precisão do código gerado por LLM para Angular. Esses prompts podem ser incluídos como instruções de sistema para suas ferramentas de IA ou como contexto com seu prompt. Você também pode usar esta ferramenta para comparar a qualidade do código produzido por diferentes modelos e monitorar a qualidade ao longo do tempo à medida que modelos e agentes evoluem.
