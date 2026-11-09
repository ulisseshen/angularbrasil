<!-- ia-translate: true -->

# Dependências npm do workspace

O Angular Framework, o Angular CLI e os components usados por aplicações Angular são empacotados como [pacotes npm](https://docs.npmjs.com/getting-started/what-is-npm 'O que é npm?') e distribuídos usando o [registro npm](https://docs.npmjs.com).

Você pode baixar e instalar esses pacotes npm usando o [cliente de linha de comando npm](https://docs.npmjs.com/cli/install).
Por padrão, o Angular CLI usa o cliente npm.

HELPFUL: Consulte [Configuração do ambiente local](tools/cli/setup-local 'Configurando para desenvolvimento local') para informações sobre as versões necessárias e a instalação do `Node.js` e do `npm`.

Se você já tem projetos executando em sua máquina que usam outras versões do Node.js e do npm, considere usar o [nvm](https://github.com/creationix/nvm) para gerenciar as múltiplas versões do Node.js e do npm.

## `package.json`

`npm` instala os pacotes identificados em um arquivo [`package.json`](https://docs.npmjs.com/files/package.json).

O comando CLI `ng new` cria um arquivo `package.json` quando cria o novo workspace.
Este `package.json` é usado por todos os projetos no workspace, incluindo o projeto inicial da aplicação que é criado pelo CLI quando ele cria o workspace.
Bibliotecas criadas com `ng generate library` incluirão seu próprio arquivo `package.json`.

Inicialmente, este `package.json` inclui _um conjunto inicial de pacotes_, alguns dos quais são necessários pelo Angular e outros que dão suporte a cenários comuns de aplicações.
Você adiciona pacotes ao `package.json` conforme sua aplicação evolui.

## Dependências padrão {#default-dependencies}

Os seguintes pacotes Angular são incluídos como dependências no arquivo `package.json` padrão de um novo workspace Angular.
Para uma lista completa dos pacotes Angular, consulte a [referência da API](api).

| Nome do pacote | Detalhes |
| :------------- | :------- |
| [`@angular/common`](api#angular_common) | Os services, pipes e diretivas comumente necessários, fornecidos pela equipe Angular. |
| `@angular/compiler` | O compilador de templates do Angular. Ele entende templates Angular e pode convertê-los em código que faz a aplicação executar. |
| `@angular/compiler-cli` | O compilador do Angular, invocado pelos comandos `ng build` e `ng serve` do Angular CLI. Ele processa templates Angular com `@angular/compiler` dentro de uma compilação TypeScript padrão. |
| [`@angular/core`](api#angular_core) | Partes críticas de runtime do framework, necessárias por toda aplicação. Inclui todos os decorators de metadados, como `@Component`, injeção de dependência e hooks do ciclo de vida de components. |
| [`@angular/forms`](api#angular_forms) | Suporte para [formulários orientados a template](guide/forms) e [formulários reativos](guide/forms/reactive-forms). Veja [Introdução a formulários](guide/forms). |
| [`@angular/platform-browser`](api#angular_platform-browser) | Tudo relacionado ao DOM e ao browser, especialmente as partes que ajudam a renderizar no DOM. |
| [`@angular/router`](api#angular_router) | O módulo router navega entre as páginas da sua aplicação quando a URL do browser muda. Para mais informações, veja [Roteamento e Navegação](guide/routing). |
| [`@angular/cli`](https://github.com/angular/angular-cli) | Contém o binário do Angular CLI para executar comandos `ng`. |
| [`@angular/build`](https://www.npmjs.com/package/@angular/build) | Contém os builders padrão do CLI para empacotar, testar e servir aplicações e bibliotecas Angular. |
| [`rxjs`](https://www.npmjs.com/package/rxjs) | Uma biblioteca para programação reativa usando `Observables`. |
| [`typescript`](https://www.npmjs.com/package/typescript) | O compilador TypeScript, o servidor de linguagem e as definições de tipo integradas. |
