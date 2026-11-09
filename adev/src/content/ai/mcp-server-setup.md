<!-- ia-translate: true -->
# Angular CLI MCP Server {#angular-cli-mcp-server}

O Angular CLI inclui um Model Context Protocol (MCP) server que permite que assistentes de IA (como Cursor, Antigravity, JetBrains AI, etc.) interajam diretamente com o Angular CLI. Ele oferece ferramentas para geração de código, análise de workspace e execução de builds e testes.

<docs-callout title="Integração com as Skills de agente de IA do Angular">
  Se o seu ambiente host oferece suporte a Skills de agente personalizadas (como o Antigravity), você pode combinar o Angular CLI MCP server com as [Skills de IA do Angular](https://angular.dev/ai/agent-skills) oficiais. Enquanto as skills fornecem ao agente orientações detalhadas em nível de instrução e padrões de código, o MCP server fornece as ferramentas de ação (como compilar, executar testes e analisar workspaces) para executar essas diretrizes, resultando em um agente de desenvolvimento completo e poderoso.
</docs-callout>

## Começando {#get-started}

Para usar o MCP server, configure o seu ambiente host (IDE ou CLI) para executar `npx @angular/cli mcp`.

<docs-tab-group>
  <docs-tab label="Antigravity IDE">
    Crie um arquivo chamado `.antigravity/mcp.json` na raiz do seu projeto:

    ```json
    {
      "mcpServers": {
        "angular-cli": {
          "command": "npx",
          "args": ["-y", "@angular/cli", "mcp"]
        }
      }
    }
    ```

  </docs-tab>

  <docs-tab label="Cursor">
    Crie `.cursor/mcp.json` na raiz do projeto (ou globalmente em `~/.cursor/mcp.json`):

    ```json
    {
      "mcpServers": {
        "angular-cli": {
          "command": "npx",
          "args": ["-y", "@angular/cli", "mcp"]
        }
      }
    }
    ```

  </docs-tab>

  <docs-tab label="VS Code">
    Crie `.vscode/mcp.json`:

    ```json
    {
      "servers": {
        "angular-cli": {
          "command": "npx",
          "args": ["-y", "@angular/cli", "mcp"]
        }
      }
    }
    ```

  </docs-tab>
</docs-tab-group>

## Ferramentas disponíveis (padrão) {#available-tools-default}

Quando o MCP server está habilitado, os agentes de IA têm acesso às seguintes ferramentas:

| Nome                        | Descrição                                                                                                                                  |
| :-------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------- |
| `ai_tutor`                  | Inicia um tutor Angular interativo com IA.                                                                                                 |
| `devserver_start`           | Inicia de forma assíncrona um servidor de desenvolvimento (`ng serve`). Retorna imediatamente.                                             |
| `devserver_stop`            | Interrompe o servidor de desenvolvimento.                                                                                                  |
| `devserver_wait_for_build`  | Retorna os logs da build mais recente em um servidor de desenvolvimento em execução.                                                       |
| `get_best_practices`        | Recupera o Guia de Boas Práticas do Angular (essencial para standalone components, typed forms, etc.).                                     |
| `list_projects`             | Lista todas as aplicações e bibliotecas do workspace lendo o arquivo `angular.json`.                                                       |
| `onpush_zoneless_migration` | Analisa o código e fornece um plano para migrá-lo para a change detection `OnPush` (pré-requisito para zoneless).                          |
| `run_target`                | Executa um target configurado (por exemplo, build, test, lint, e2e, deploy).                                                               |
| `search_documentation`      | Pesquisa a documentação oficial em `https://angular.dev`.                                                                                  |

## Fluxos de trabalho comuns {#common-workflows}

Estes fluxos de trabalho mostram como os assistentes de IA coordenam diferentes ferramentas MCP para concluir automaticamente histórias complexas de desenvolvimento.

### 1. Ajuste de desempenho: migração para Zoneless e OnPush {#1-performance-tuning-zoneless-onpush-migration}

O agente de IA otimiza o desempenho da change detection e migra os components para um estado pronto para zoneless.

1. **Descobrir o workspace**: o agente de IA chama `list_projects` para localizar components, projetos e configurações de estilo e de testes no workspace.
2. **Modernização por schematics (pré-requisito)**: o agente de IA executa as migrações de signals necessárias usando comandos `ng generate` padrão (por exemplo, Signal Inputs, Signal Queries).
3. **Planejar a migração**: o agente de IA chama `onpush_zoneless_migration` com o caminho absoluto do diretório ou do arquivo do component.
4. **Aplicar as alterações**: o agente de IA aplica automaticamente à base de código a única alteração acionável retornada pela ferramenta.
5. **Verificar as alterações**: o agente de IA executa os testes unitários chamando `run_target` com o target definido como `"test"`.
6. **Repetir**: o agente de IA chama `onpush_zoneless_migration` novamente para obter o próximo passo, repetindo até que a ferramenta indique que a migração foi concluída.

### 2. Desenvolvimento de features e loop de TDD {#2-feature-development-tdd-loop}

O agente de IA automatiza a pesquisa, a implementação e a verificação ao desenvolver novas features.

1. **Pesquisa de APIs e sintaxe**: o agente de IA usa `search_documentation` para consultar APIs ou regras de sintaxe do Angular (por exemplo, opções do bloco `@defer`).
2. **Carregar os padrões de código**: o agente de IA chama `get_best_practices` com o caminho do workspace para carregar as regras de código alinhadas à versão do Angular.
3. **Iniciar o servidor de desenvolvimento local**: o agente de IA inicia um servidor em segundo plano chamando `devserver_start`.
4. **Monitorar a build**: o agente de IA usa `devserver_wait_for_build` para acompanhar os logs de build e garantir que a compilação seja bem-sucedida enquanto edita o código.
5. **Escrever e executar os testes**: o agente de IA identifica o framework de testes do projeto (por exemplo, Jasmine, Jest, Vitest) por meio de `list_projects`, escreve o arquivo de teste correspondente e executa os testes usando `run_target` com `"test"`.
6. **Parar o servidor de desenvolvimento**: ao terminar, o agente de IA interrompe o servidor de desenvolvimento ativo chamando `devserver_stop`.

### 3. Onboarding e aprendizado do desenvolvedor {#3-developer-onboarding-and-learning}

O agente de IA guia o desenvolvedor pelos conceitos do Angular em um ambiente interativo de sandbox.

1. **Descobrir os projetos**: o agente de IA chama `list_projects` para examinar o workspace e identificar a estrutura da base de código.
2. **Iniciar o tutor**: o agente de IA executa `ai_tutor` para carregar as instruções do currículo, a persona e as diretrizes de tutoria.
3. **Seguir o currículo**: o agente de IA conduz o usuário pelo currículo, explicando os conceitos e indicando quais components criar ou modificar.
4. **Implementar e verificar**: o agente de IA ajuda a implementar o código da sandbox e verifica as alterações usando `run_target` com `"test"` ou `"build"`.

## Opções de comando {#command-options}

Você pode passar argumentos para o MCP server no array `args` da sua configuração:

- `--read-only`: registra apenas as ferramentas que não modificam o projeto.
- `--local-only`: registra apenas as ferramentas que não exigem conexão com a internet.

Exemplo para o modo somente leitura:

```json
"args": ["-y", "@angular/cli", "mcp", "--read-only"]
```
