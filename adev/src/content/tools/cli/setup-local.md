<!-- ia-translate: true -->

# Configurando o ambiente local e workspace

Este guia explica como configurar seu ambiente para desenvolvimento Angular usando o [Angular CLI](cli 'CLI command reference').
Ele inclui informações sobre a instalação do CLI, criação de um workspace inicial e aplicação starter, e execução dessa aplicação localmente para verificar sua configuração.

<docs-callout title="Experimente Angular sem configuração local">

Se você é novo no Angular, você pode querer começar com [Experimente agora!](tutorials/learn-angular), que introduz os fundamentos do Angular no seu browser.
Este tutorial standalone aproveita o ambiente interativo [StackBlitz](https://stackblitz.com) para desenvolvimento online.
Você não precisa configurar seu ambiente local até estar pronto.

</docs-callout>

## Antes de começar

Para usar o Angular CLI, você deve estar familiarizado com o seguinte:

<docs-pill-row>
  <docs-pill href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" title="JavaScript"/>
  <docs-pill href="https://developer.mozilla.org/en-US/docs/Web/HTML" title="HTML"/>
  <docs-pill href="https://developer.mozilla.org/en-US/docs/Web/CSS" title="CSS"/>
</docs-pill-row>

Você também deve estar familiarizado com o uso de ferramentas de interface de linha de comando (CLI) e ter um entendimento geral de shells de comando.
Conhecimento de [TypeScript](https://www.typescriptlang.org) é útil, mas não obrigatório.

## Dependências

Para instalar o Angular CLI no seu sistema local, você precisa instalar o [Node.js](https://nodejs.org/).
O Angular CLI usa o Node e seu gerenciador de pacotes associado, npm, para instalar e executar ferramentas JavaScript fora do browser.

[Baixe e instale o Node.js](https://nodejs.org/en/download), que incluirá o CLI `npm` também.
O Angular requer uma versão [LTS ativa ou LTS de manutenção](https://nodejs.org/en/about/previous-releases) do Node.js.
Veja o guia de [compatibilidade de versões do Angular](reference/versions) para mais informações.

## Instalar o Angular CLI

Para instalar o Angular CLI, abra uma janela de terminal e execute o seguinte comando:

<docs-code-multifile>
   <docs-code
     header="npm"
     language="shell"
     >
     npm install -g @angular/cli
     </docs-code>
   <docs-code
     header="pnpm"
     language="shell"
     >
     pnpm install -g @angular/cli
     </docs-code>
   <docs-code
     header="yarn"
     language="shell"
     >
     yarn global add @angular/cli
     </docs-code>
   <docs-code
     header="bun"
     language="shell"
     >
     bun install -g @angular/cli
     </docs-code>

 </docs-code-multifile>

### Política de execução do Powershell

Em computadores cliente Windows, a execução de scripts PowerShell é desabilitada por padrão, então o comando acima pode falhar com um erro.
Para permitir a execução de scripts PowerShell, que é necessária para binários globais do npm, você deve definir a seguinte <a href="https://docs.microsoft.com/powershell/module/microsoft.powershell.core/about/about_execution_policies">política de execução</a>:

```sh

Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned

```

Leia cuidadosamente a mensagem exibida após executar o comando e siga as instruções. Certifique-se de entender as implicações de definir uma política de execução.

### Permissões Unix

Em algumas configurações do tipo Unix, scripts globais podem ser de propriedade do usuário root, então o comando acima pode falhar com um erro de permissão.
Execute com `sudo` para executar o comando como usuário root e digite sua senha quando solicitado:

<docs-code-multifile>
   <docs-code
     header="npm"
     language="shell"
     >
     sudo npm install -g @angular/cli
     </docs-code>
   <docs-code
     header="pnpm"
     language="shell"
     >
     sudo pnpm install -g @angular/cli
     </docs-code>
   <docs-code
     header="yarn"
     language="shell"
     >
     sudo yarn global add @angular/cli
     </docs-code>
   <docs-code
     header="bun"
     language="shell"
     >
     sudo bun install -g @angular/cli
     </docs-code>

 </docs-code-multifile>

Certifique-se de entender as implicações de executar comandos como root.

## Criar um workspace e aplicação inicial

Você desenvolve aplicações no contexto de um **workspace** Angular.

Para criar um novo workspace e aplicação starter inicial, execute o comando CLI `ng new` e forneça o nome `my-app`, como mostrado aqui, então responda às perguntas sobre recursos a incluir:

```shell

ng new my-app

```

O Angular CLI instala os pacotes npm do Angular necessários e outras dependências.
Isso pode levar alguns minutos.

O CLI cria um novo workspace e uma pequena aplicação de boas-vindas em um novo diretório com o mesmo nome do workspace, pronta para executar.
Navegue até o novo diretório para que comandos subsequentes usem este workspace.

```shell

cd my-app

```

## Executar a aplicação

O Angular CLI inclui um servidor de desenvolvimento, para você construir e servir sua aplicação localmente. Execute o seguinte comando:

```shell

ng serve --open

```

O comando `ng serve` inicia o servidor, observa seus arquivos, além de reconstruir a aplicação e recarregar o browser à medida que você faz alterações nesses arquivos.

A opção `--open` (ou apenas `-o`) abre automaticamente seu browser em `http://localhost:4200/` para visualizar a aplicação gerada.

## Workspaces e arquivos de projeto

O comando [`ng new`](cli/new) cria uma pasta de [workspace Angular](reference/configs/workspace-config) e gera uma nova aplicação dentro dela.
Um workspace pode conter múltiplas aplicações e bibliotecas.
A aplicação inicial criada pelo comando [`ng new`](cli/new) está no diretório raiz do workspace.
Quando você gera uma aplicação ou biblioteca adicional em um workspace existente, ela vai para uma subpasta `projects/` por padrão.

Uma aplicação recém-gerada contém os arquivos fonte para um component raiz e template.
Cada aplicação tem uma pasta `src` que contém seus components, dados e assets.

Você pode editar os arquivos gerados diretamente, ou adicionar e modificá-los usando comandos CLI.
Use o comando [`ng generate`](cli/generate) para adicionar novos arquivos para components, directives, pipes, services e mais adicionais.
Comandos como [`ng add`](cli/add) e [`ng generate`](cli/generate), que criam ou operam em aplicações e bibliotecas, devem ser executados
de dentro de um workspace. Em contraste, comandos como `ng new` devem ser executados _fora_ de um workspace porque eles criarão um novo.

## Próximos passos

- Saiba mais sobre a [estrutura de arquivos](reference/configs/file-structure) e [configuração](reference/configs/workspace-config) do workspace gerado.

- Teste sua nova aplicação com [`ng test`](cli/test).

- Gere código boilerplate como components, directives e pipes com [`ng generate`](cli/generate).

- Faça o deploy da sua nova aplicação e torne-a disponível para usuários reais com [`ng deploy`](cli/deploy).

- Configure e execute testes end-to-end da sua aplicação com [`ng e2e`](cli/e2e).
