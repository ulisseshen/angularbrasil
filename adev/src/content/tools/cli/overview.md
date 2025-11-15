<!-- ia-translate: true -->
# O Angular CLI

O Angular CLI é uma ferramenta de interface de linha de comando que permite criar, desenvolver, testar, fazer deploy e manter aplicações Angular diretamente de um shell de comando.

O Angular CLI é publicado no npm como o pacote `@angular/cli` e inclui um binário chamado `ng`. Comandos que invocam `ng` estão usando o Angular CLI.

<docs-callout title="Experimente o Angular sem configuração local">

Se você é novo no Angular, talvez queira começar com [Experimente agora!](tutorials/learn-angular), que apresenta os fundamentos do Angular no contexto de uma aplicação básica de loja online pronta para você examinar e modificar.
Este tutorial independente aproveita o ambiente interativo [StackBlitz](https://stackblitz.com) para desenvolvimento online.
Você não precisa configurar seu ambiente local até estar pronto.

</docs-callout>

<docs-card-container>
  <docs-card title="Começando" link="Começar" href="tools/cli/setup-local">
    Instale o Angular CLI para criar e fazer o build da sua primeira aplicação.
  </docs-card>
  <docs-card title="Referência de Comandos" link="Saiba Mais" href="cli">
    Descubra comandos do CLI para torná-lo mais produtivo com Angular.
  </docs-card>
  <docs-card title="Schematics" link="Saiba Mais" href="tools/cli/schematics">
    Crie e execute schematics para gerar e modificar arquivos de código na sua aplicação automaticamente.
  </docs-card>
  <docs-card title="Builders" link="Saiba Mais" href="tools/cli/cli-builder">
    Crie e execute builders para realizar transformações complexas do seu código-fonte para saídas de build geradas.
  </docs-card>
</docs-card-container>

## Sintaxe da linguagem de comandos do CLI

O Angular CLI segue aproximadamente as convenções Unix/POSIX para sintaxe de opções.

### Opções booleanas

Opções booleanas têm duas formas: `--this-option` define a flag como `true`, `--no-this-option` define como `false`.
Você também pode usar `--this-option=false` ou `--this-option=true`.
Se nenhuma opção for fornecida, a flag permanece em seu estado padrão, conforme listado na documentação de referência.

### Opções de array

Opções de array podem ser fornecidas em duas formas: `--option value1 value2` ou `--option value1 --option value2`.

### Opções chave/valor

Algumas opções como `--define` esperam um array de pares `key=value` como seus valores.
Assim como opções de array, opções chave/valor podem ser fornecidas em duas formas:
`--define 'KEY_1="value1"' KEY_2=true` ou `--define 'KEY_1="value1"' --define KEY_2=true`.

### Caminhos relativos

Opções que especificam arquivos podem ser fornecidas como caminhos absolutos ou como caminhos relativos ao diretório de trabalho atual, que geralmente é a raiz do workspace ou do projeto.
