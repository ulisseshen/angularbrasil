<!-- ia-translate: true -->
# Skills de agente {#agent-skills}

Skills de agente são instruções e capacidades especializadas e específicas de domínio, projetadas para agentes de IA como o Gemini CLI. Essas skills oferecem orientação arquitetural, geram código Angular idiomático e ajudam a criar novos projetos usando boas práticas modernas.

Ao usar Skills de agente, você pode garantir que o agente de IA com o qual está trabalhando tenha as informações mais atualizadas sobre as convenções do Angular, os modelos de reatividade (como Signals) e a estrutura do projeto.

## Skills disponíveis {#available-skills}

A equipe do Angular mantém uma coleção de skills oficiais que são atualizadas regularmente para acompanhar as melhorias mais recentes do framework.

| Skill                   | Descrição                                                                                                                                                                                                                                                                                       |
| :---------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`angular-developer`** | Gera código Angular e fornece orientação arquitetural. Útil para criar components, services ou obter boas práticas sobre reatividade (signals, linkedSignal, resource), formulários, injeção de dependência, roteamento, SSR, acessibilidade (ARIA), animações, estilização, testes ou ferramentas da CLI. |
| **`angular-new-app`**   | Cria um novo aplicativo Angular usando a Angular CLI. Fornece diretrizes importantes para configurar e estruturar de forma eficaz um aplicativo Angular moderno.                                                                                                                                           |

## Usando Skills de agente {#using-agent-skills}

Skills de agente são projetadas para uso com ferramentas de codificação agentivas como o [Gemini CLI](https://geminicli.com/docs/cli/skills/), o [Antigravity](https://antigravity.google/docs/skills) e outras. Ativar uma skill carrega as instruções e os recursos específicos necessários para aquela tarefa.

Para usar essas skills no seu ambiente, você pode seguir as instruções da sua ferramenta específica ou usar uma ferramenta da comunidade, como o [skills.sh](https://skills.sh/).

```bash
npx skills add https://github.com/angular/skills
```
