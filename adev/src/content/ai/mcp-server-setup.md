<!-- ia-translate: true -->
# Configuração do Angular CLI MCP Server

O Angular CLI inclui um [Model Context Protocol (MCP) server](https://modelcontextprotocol.io/) experimental que permite que assistentes de IA em seu ambiente de desenvolvimento interajam com o Angular CLI. Incluímos suporte para geração de código com CLI, adição de pacotes e muito mais.

## Ferramentas Disponíveis

O Angular CLI MCP server fornece várias ferramentas para auxiliá-lo em seu fluxo de trabalho de desenvolvimento. Por padrão, as seguintes ferramentas estão habilitadas:

| Nome                        | Descrição                                                                                                                                                                                                     | `local-only` | `read-only` |
| :-------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :----------: | :---------: |
| `ai_tutor`                  | Inicia um tutor Angular interativo com IA. Recomendado executar a partir de um novo projeto Angular usando v20 ou posterior. [Saiba mais](https://github.com/angular/ai-tutor/blob/main/README.md).          |      ✅      |     ✅      |
| `find_examples`             | Encontra exemplos de código autoritativos de um banco de dados selecionado de exemplos oficiais de boas práticas, focando em recursos Angular **modernos, novos e recentemente atualizados**.                |      ✅      |     ✅      |
| `get_best_practices`        | Recupera o Guia de Boas Práticas do Angular. Este guia é essencial para garantir que todo código adere aos padrões modernos, incluindo standalone components, typed forms e modern control flow.             |      ✅      |     ✅      |
| `list_projects`             | Lista os nomes de todas as aplicações e bibliotecas definidas em um workspace Angular. Lê o arquivo de configuração `angular.json` para identificar os projetos.                                             |      ✅      |     ✅      |
| `onpush-zoneless-migration` | Analisa código Angular e fornece um plano iterativo passo a passo para migrá-lo para change detection `OnPush`, um pré-requisito para uma aplicação zoneless.                                                |      ✅      |     ✅      |
| `search_documentation`      | Pesquisa a documentação oficial do Angular em <https://angular.dev>. Esta ferramenta deve ser usada para responder quaisquer perguntas sobre Angular, como para APIs, tutoriais e boas práticas.             |      ❌      |     ✅      |

### Ferramentas Experimentais

Algumas ferramentas são fornecidas em status experimental/preview, pois são novas ou não totalmente testadas. Habilite-as individualmente com a opção [`--experimental-tool`](#command-options) e use-as com cautela.

| Nome        | Descrição                                                                                                                                                                                                       | `local-only` | `read-only` |
| :---------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------: | :---------: |
| `modernize` | Executa migrações de código e fornece instruções adicionais sobre como modernizar código Angular para alinhar com as últimas boas práticas e sintaxe. [Saiba mais](https://angular.dev/reference/migrations) |      ✅      |     ❌      |

## Começando

Para começar, execute o seguinte comando em seu terminal:

```bash
ng mcp
```

Quando executado a partir de um terminal interativo, este comando exibe instruções sobre como configurar um ambiente host para usar o MCP server. As seções a seguir fornecem exemplos de configurações para vários editores e ferramentas populares.

### Cursor

Crie um arquivo chamado `.cursor/mcp.json` na raiz do seu projeto e adicione a seguinte configuração. Você também pode configurá-lo globalmente em `~/.cursor/mcp.json`.

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

### Firebase Studio

Crie um arquivo chamado `.idx/mcp.json` na raiz do seu projeto e adicione a seguinte configuração:

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

### Gemini CLI

Crie um arquivo chamado `.gemini/settings.json` na raiz do seu projeto e adicione a seguinte configuração:

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

### JetBrains IDEs

Nos IDEs JetBrains (como IntelliJ IDEA ou WebStorm), após instalar o plugin JetBrains AI Assistant, vá para `Settings | Tools | AI Assistant | Model Context Protocol (MCP)`. Adicione um novo servidor e selecione `As JSON`. Cole a seguinte configuração, que não usa uma propriedade de nível superior para a lista de servidores.

```json
{
  "name": "Angular CLI",
  "command": "npx",
  "args": [
    "-y",
    "@angular/cli",
    "mcp"
  ]
}
```

### VS Code

Na raiz do seu projeto, crie um arquivo chamado `.vscode/mcp.json` e adicione a seguinte configuração. Note o uso da propriedade `servers`.

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

### Outros IDEs

Para outros IDEs, verifique a documentação do seu IDE para a localização adequada do arquivo de configuração MCP (frequentemente `mcp.json`). A configuração deve conter o seguinte trecho.

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

## Opções de Comando

O comando `mcp` pode ser configurado com as seguintes opções passadas como argumentos na configuração MCP do seu IDE:

| Opção                         | Tipo      | Descrição                                                                                                                                                      | Padrão  |
| :---------------------------- | :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------ |
| `--read-only`                 | `boolean` | Registrar apenas ferramentas que não fazem alterações no projeto. Seu editor ou agente de codificação ainda pode realizar edições.                            | `false` |
| `--local-only`                | `boolean` | Registrar apenas ferramentas que não requerem conexão com a internet. Seu editor ou agente de codificação ainda pode enviar dados pela rede.                  | `false` |
| `--experimental-tool`<br>`-E` | `string`  | Habilitar uma [ferramenta experimental](#experimental-tools). Separe múltiplas opções por espaços, por exemplo, `-E tool_a tool_b`.                           |         |

Por exemplo, para executar o servidor em modo somente leitura no VS Code, você atualizaria seu `mcp.json` assim:

```json
{
  "servers": {
    "angular-cli": {
      "command": "npx",
      "args": ["-y", "@angular/cli", "mcp", "--read-only"]
    }
  }
}
```

## Feedback e Novas Ideias

A equipe Angular dá boas-vindas ao seu feedback sobre as capacidades MCP existentes e quaisquer ideias que você tenha para novas ferramentas ou recursos. Por favor, compartilhe seus pensamentos abrindo uma issue no [repositório GitHub angular/angular](https://github.com/angular/angular/issues).
