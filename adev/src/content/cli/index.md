<!-- ia-translate: true -->
# Visão Geral do CLI e Referência de Comandos

O Angular CLI é uma ferramenta de interface de linha de comando que você usa para inicializar, desenvolver, estruturar e manter aplicações Angular diretamente de um shell de comando.

## Instalando o Angular CLI

Versões principais do Angular CLI seguem a versão principal suportada do Angular, mas versões menores podem ser lançadas separadamente.

Instale o CLI usando o gerenciador de pacotes `npm`:

<code-example format="shell" language="shell">

npm install -g @angular/cli<aio-angular-dist-tag class="pln"></aio-angular-dist-tag>

</code-example>

Para detalhes sobre mudanças entre versões e informações sobre atualização de lançamentos anteriores, veja a aba Releases no GitHub: https://github.com/angular/angular-cli/releases

## Fluxo de trabalho básico

Invoque a ferramenta na linha de comando através do executável `ng`.
Ajuda online está disponível na linha de comando.
Digite o seguinte para listar comandos ou opções para um determinado comando \(como [new](cli/new)\) com uma breve descrição.

<code-example format="shell" language="shell">

ng --help
ng new --help

</code-example>

Para criar, construir e servir um novo projeto Angular básico em um servidor de desenvolvimento, vá para o diretório pai do seu novo workspace e use os seguintes comandos:

<code-example format="shell" language="shell">

ng new my-first-project
cd my-first-project
ng serve

</code-example>

No seu navegador, abra http://localhost:4200/ para ver a nova aplicação executar.
Quando você usa o comando [ng serve](cli/serve) para construir uma aplicação e servi-la localmente, o servidor automaticamente reconstrói a aplicação e recarrega a página quando você altera qualquer um dos arquivos fonte.

<div class="docs-alert docs-alert-helpful">

Quando você executa `ng new my-first-project`, uma nova pasta, chamada `my-first-project`, será criada no diretório de trabalho atual.
Como você quer ser capaz de criar arquivos dentro dessa pasta, certifique-se de que você tem direitos suficientes no diretório de trabalho atual antes de executar o comando.

Se o diretório de trabalho atual não é o lugar certo para seu projeto, você pode mudar para um diretório mais apropriado executando `cd <caminho-para-outro-diretorio>`.

</div>

## Workspaces e arquivos de projeto

O comando [ng new](cli/new) cria uma pasta de _workspace Angular_ e gera um novo esqueleto de aplicação.
Um workspace pode conter múltiplas aplicações e bibliotecas.
A aplicação inicial criada pelo comando [ng new](cli/new) está no nível superior do workspace.
Quando você gera uma aplicação ou biblioteca adicional em um workspace, ela vai para uma subpasta `projects/`.

Uma aplicação recém-gerada contém os arquivos fonte para um módulo raiz, com um component raiz e template.
Cada aplicação tem uma pasta `src` que contém a lógica, dados e assets.

Você pode editar os arquivos gerados diretamente, ou adicionar e modificá-los usando comandos CLI.
Use o comando [ng generate](cli/generate) para adicionar novos arquivos para components e services adicionais, e código para novos pipes, directives e assim por diante.
Comandos como [add](cli/add) e [generate](cli/generate), que criam ou operam em aplicações e bibliotecas, devem ser executados de dentro de uma pasta de workspace ou projeto.

- Veja mais sobre a [estrutura de arquivos do Workspace](guide/file-structure).

### Configuração de workspace e projeto

Um único arquivo de configuração de workspace, `angular.json`, é criado no nível superior do workspace.
É aqui que você pode definir padrões por projeto para opções de comando CLI e especificar configurações a serem usadas quando o CLI constrói um projeto para diferentes targets.

O comando [ng config](cli/config) permite que você defina e recupere valores de configuração da linha de comando, ou você pode editar o arquivo `angular.json` diretamente.

<div class="alert is-helpful">

**NOTE**: <br />
Nomes de opções no arquivo de configuração devem usar [camelCase](guide/glossary#case-types), enquanto nomes de opções fornecidos aos comandos devem ser dash-case.

</div>

- Veja mais sobre [Configuração de Workspace](guide/workspace-config).

## Sintaxe de linguagem de comando do CLI

A sintaxe de comando é mostrada da seguinte forma:

`ng` _<command-name>_ _<required-arg>_ [*optional-arg*] `[options]`

- A maioria dos comandos, e algumas opções, têm aliases.
  Aliases são mostrados na declaração de sintaxe para cada comando.

- Nomes de opções são prefixados com caracteres de traço duplo \(`--`\).
  Aliases de opções são prefixados com um caractere de traço simples \(`-`\).
  Argumentos não são prefixados.
  Por exemplo:

  <code-example format="shell" language="shell">

  ng build my-app -c production

  </code-example>

- Tipicamente, o nome de um artefato gerado pode ser fornecido como argumento para o comando ou especificado com a opção `--name`.

- Argumentos e nomes de opções devem ser fornecidos em [dash-case](guide/glossary#case-types).
  Por exemplo: `--my-option-name`

### Opções booleanas

Opções booleanas têm duas formas: `--this-option` define a flag como `true`, `--no-this-option` define como `false`.
Se nenhuma opção for fornecida, a flag permanece em seu estado padrão, conforme listado na documentação de referência.

### Opções de array

Opções de array podem ser fornecidas de duas formas: `--option value1 value2` ou `--option value1 --option value2`.

### Caminhos relativos

Opções que especificam arquivos podem ser fornecidas como caminhos absolutos, ou como caminhos relativos ao diretório de trabalho atual, que geralmente é a raiz do workspace ou projeto.

### Schematics

Os comandos [ng generate](cli/generate) e [ng add](cli/add) recebem, como argumento, o artefato ou biblioteca a ser gerado ou adicionado ao projeto atual.
Além de quaisquer opções gerais, cada artefato ou biblioteca define suas próprias opções em um _schematic_.
Opções de schematic são fornecidas ao comando no mesmo formato que opções de comando imediatas.

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28
