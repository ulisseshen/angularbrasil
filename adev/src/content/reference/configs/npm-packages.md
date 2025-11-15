<!-- ia-translate: true -->
# Dependências npm do workspace

O Angular Framework, Angular CLI e os components usados por aplicações Angular são empacotados como [pacotes npm](https://docs.npmjs.com/getting-started/what-is-npm 'What is npm?') e distribuídos usando o [registro npm](https://docs.npmjs.com).

Você pode baixar e instalar esses pacotes npm usando o [cliente npm CLI](https://docs.npmjs.com/cli/install).
Por padrão, o Angular CLI usa o cliente npm.

HELPFUL: Consulte [Configuração do Ambiente Local](tools/cli/setup-local 'Setting up for Local Development') para informações sobre as versões necessárias e instalação do `Node.js` e `npm`.

Se você já tem projetos executando em sua máquina que usam outras versões do Node.js e npm, considere usar [nvm](https://github.com/creationix/nvm) para gerenciar as múltiplas versões do Node.js e npm.

## `package.json`

`npm` instala os pacotes identificados em um arquivo [`package.json`](https://docs.npmjs.com/files/package.json).

O comando CLI `ng new` cria um arquivo `package.json` quando cria o novo workspace.
Este `package.json` é usado por todos os projetos no workspace, incluindo o projeto inicial da aplicação que é criado pelo CLI quando ele cria o workspace.
Bibliotecas criadas com `ng generate library` incluirão seu próprio arquivo `package.json`.

Inicialmente, este `package.json` inclui _um conjunto inicial de pacotes_, alguns dos quais são necessários pelo Angular e outros que suportam cenários comuns de aplicações.
Você adiciona pacotes ao `package.json` conforme sua aplicação evolui.

## Dependências Padrão

Os seguintes pacotes Angular são incluídos como dependências no arquivo `package.json` padrão para um novo workspace Angular.
Para uma lista completa de pacotes Angular, consulte a [referência da API](api).

| Nome do pacote                                                                                 | Detalhes                                                                                                                                                                                                       |
| :--------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`@angular/animations`](api#animations)                                                        | A biblioteca de animações legada do Angular facilita a definição e aplicação de efeitos de animação, como transições de página e lista. Para mais informações, consulte o [guia de Animações Legadas](guide/legacy-animations). |
| [`@angular/common`](api#common)                                                                | Os services, pipes e directives comumente necessários fornecidos pela equipe Angular.                                                                                                                          |
| `@angular/compiler`                                                                            | O compilador de template do Angular. Ele entende templates Angular e pode convertê-los em código que faz a aplicação executar.                                                                                |
| `@angular/compiler-cli`                                                                        | O compilador do Angular que é invocado pelos comandos `ng build` e `ng serve` do Angular CLI. Ele processa templates Angular com `@angular/compiler` dentro de uma compilação TypeScript padrão.              |
| [`@angular/core`](api#core)                                                                    | Partes críticas de runtime do framework que são necessárias por toda aplicação. Inclui todos os decorators de metadados como `@Component`, injeção de dependência e hooks do ciclo de vida de components.     |
| [`@angular/forms`](api#forms)                                                                  | Suporte para [formulários orientados a template](guide/forms) e [formulários reativos](guide/forms/reactive-forms). Consulte [Introdução a formulários](guide/forms).                                         |
| [`@angular/platform-browser`](api#platform-browser)                                            | Tudo relacionado ao DOM e browser, especialmente as peças que ajudam a renderizar no DOM.                                                                                                                      |
| [`@angular/platform-browser-dynamic`](api#platform-browser-dynamic)                            | Inclui [providers](api/core/Provider) e métodos para compilar e executar a aplicação no cliente usando o [compilador JIT](tools/cli/aot-compiler#choosing-a-compiler).                                        |
| [`@angular/router`](api#router)                                                                | O módulo router navega entre as páginas da sua aplicação quando a URL do browser muda. Para mais informações, consulte [Roteamento e Navegação](guide/routing).                                               |
| [`@angular/cli`](https://github.com/angular/angular-cli)                                       | Contém o binário do Angular CLI para executar comandos `ng`.                                                                                                                                                  |
| [`@angular-devkit/build-angular`](https://www.npmjs.com/package/@angular-devkit/build-angular) | Contém builders CLI padrão para empacotamento, teste e execução de aplicações e bibliotecas Angular.                                                                                                          |
| [`rxjs`](https://www.npmjs.com/package/rxjs)                                                   | Uma biblioteca para programação reativa usando `Observables`.                                                                                                                                                 |
| [`zone.js`](https://github.com/angular/zone.js)                                                | O Angular depende do `zone.js` para executar os processos de detecção de mudanças do Angular quando operações JavaScript nativas disparam eventos.                                                            |
| [`typescript`](https://www.npmjs.com/package/typescript)                                       | O compilador TypeScript, servidor de linguagem e definições de tipo integradas.                                                                                                                               |
