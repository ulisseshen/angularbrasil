<!-- ia-translate: true -->

# Estrutura de arquivos do workspace e projeto {#workspace-and-project-file-structure}

Você desenvolve aplicações no contexto de um workspace Angular.
Um workspace contém os arquivos para um ou mais projetos.
Um projeto é o conjunto de arquivos que compõem uma aplicação ou uma biblioteca compartilhável.

O comando `ng new` do Angular CLI cria um workspace.

```shell
ng new my-project
```

Quando você executa este comando, o CLI instala os pacotes npm do Angular necessários e outras dependências em um novo workspace, com uma aplicação de nível raiz chamada _my-project_.

Por padrão, `ng new` cria uma aplicação esqueleto inicial no nível raiz do workspace.
O esqueleto é para uma aplicação de boas-vindas simples que está pronta para executar e fácil de modificar.
A aplicação de nível raiz tem o mesmo nome do workspace, e os arquivos de origem residem na subpasta `src/` do workspace.

Esse comportamento padrão é adequado para um estilo típico de desenvolvimento "multi-repo", em que cada aplicação reside em seu próprio workspace.
Iniciantes e usuários intermediários são encorajados a usar `ng new` para criar um workspace separado para cada aplicação.

O Angular também suporta workspaces com [múltiplos projetos](#multiple-projects).
Este tipo de ambiente de desenvolvimento é adequado para usuários avançados que desenvolvem bibliotecas compartilháveis,
e para empresas que usam um estilo de desenvolvimento "monorepo", com um único repositório e configuração global para todos os projetos Angular.

Para configurar um workspace monorepo, você deve pular a criação da aplicação raiz.
Veja [Configurando para um workspace multi-projeto](#multiple-projects) abaixo.

## Arquivos de configuração do workspace {#workspace-configuration-files}

Todos os projetos dentro de um workspace compartilham uma [configuração](reference/configs/workspace-config).
O nível superior do workspace contém arquivos de configuração de todo o workspace, arquivos de configuração para a aplicação de nível raiz e subpastas para os arquivos de origem e teste da aplicação de nível raiz.

| Arquivos de configuração do workspace | Propósito |
| :------------------------------------ | :-------- |
| `.editorconfig`                       | Configuração para editores de código. Veja [EditorConfig](https://editorconfig.org). |
| `.gitignore`                          | Especifica arquivos intencionalmente não rastreados que o [Git](https://git-scm.com) deve ignorar. |
| `README.md`                           | Documentação para o workspace. |
| `angular.json`                        | Configuração do CLI para todos os projetos no workspace, incluindo opções de configuração para como construir, servir e testar cada projeto. Para detalhes, veja [Configuração do Workspace Angular](reference/configs/workspace-config). |
| `package.json`                        | Configura [dependências de pacotes npm](reference/configs/npm-packages) que estão disponíveis para todos os projetos no workspace. Veja a [documentação do npm](https://docs.npmjs.com/files/package.json) para o formato e conteúdo específicos deste arquivo. |
| `package-lock.json`                   | Fornece informações de versão para todos os pacotes instalados em `node_modules` pelo cliente npm. Veja a [documentação do npm](https://docs.npmjs.com/files/package-lock.json) para detalhes. |
| `src/`                                | Arquivos de origem para o projeto de aplicação de nível raiz. |
| `public/`                             | Contém imagens e outros arquivos de assets para serem servidos como arquivos estáticos pelo servidor de desenvolvimento e copiados como estão quando você constrói sua aplicação. |
| `node_modules/`                       | [Pacotes npm](reference/configs/npm-packages) instalados para todo o workspace. Dependências `node_modules` de todo o workspace são visíveis para todos os projetos. |
| `tsconfig.json`                       | A configuração base do [TypeScript](https://www.typescriptlang.org) para projetos no workspace. Todos os outros arquivos de configuração herdam deste arquivo base. Para mais informações, veja a [documentação relevante do TypeScript](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#tsconfig-bases). |

## Arquivos de projeto de aplicação {#application-project-files}

Por padrão, o comando CLI `ng new my-app` cria uma pasta de workspace chamada "my-app" e gera um novo esqueleto de aplicação em uma pasta `src/` no nível superior do workspace.
Uma aplicação recém-gerada contém arquivos de origem para um component raiz e seu template.

Quando a estrutura de arquivos do workspace está no lugar, você pode usar o comando `ng generate` na linha de comando para adicionar funcionalidade e dados à aplicação.
Esta aplicação raiz inicial é o _app padrão_ para os comandos CLI (a menos que você altere o padrão após criar [apps adicionais](#multiple-projects)).

Para um workspace de aplicação única, a subpasta `src` do workspace contém os arquivos de origem (lógica da aplicação, dados e assets) da aplicação raiz.
Para um workspace multi-projeto, projetos adicionais na pasta `projects` contêm uma subpasta `project-name/src/` com a mesma estrutura.

### Arquivos de origem da aplicação {#application-source-files}

Arquivos no nível superior de `src/` dão suporte à execução da sua aplicação.
Subpastas contêm a origem da aplicação e a configuração específica da aplicação.

| Arquivos de suporte da aplicação | Propósito |
| :------------------------------- | :-------- |
| `app/`                           | Contém os arquivos de component nos quais a lógica e os dados da sua aplicação são definidos. Veja detalhes abaixo. |
| `index.html`                     | A página HTML principal que é servida quando alguém visita seu site. O CLI adiciona automaticamente todos os arquivos JavaScript e CSS ao construir seu app, então você normalmente não precisa adicionar tags `<script>` ou `<link>` aqui manualmente. |
| `main.ts`                        | O ponto de entrada principal para sua aplicação. |
| `styles.css`                     | Estilos CSS globais aplicados a toda a aplicação. |

Dentro da pasta `src`, a pasta `app` contém a lógica e os dados do seu projeto.
Components, templates e estilos Angular ficam aqui.

| Arquivos `src/app/` | Propósito |
| :------------------ | :-------- |
| `app.config.ts`     | Define a configuração da aplicação que diz ao Angular como montar a aplicação. À medida que você adiciona mais providers ao app, eles devem ser declarados aqui.<br><br>_Gerado apenas ao usar a opção `--standalone`._ |
| `app.ts`            | Define o component raiz da aplicação, chamado `App`. A view associada a este component raiz se torna a raiz da hierarquia de views à medida que você adiciona components e services à sua aplicação. |
| `app.html`          | Define o template HTML associado ao `App`. |
| `app.css`           | Define a folha de estilos CSS para o `App`. |
| `app.spec.ts`       | Define um teste unitário para o `App`. |
| `app-module.ts`     | Define o módulo raiz, chamado `AppModule`, que diz ao Angular como montar a aplicação. Inicialmente declara apenas o component `App`. À medida que você adiciona mais components ao app, eles devem ser declarados aqui.<br><br>_Gerado apenas ao usar a opção `--standalone false`._ |
| `app.routes.ts`     | Define a configuração de roteamento da aplicação. |

### Arquivos de configuração da aplicação {#application-configuration-files}

Arquivos de configuração específicos da aplicação para a aplicação raiz residem no nível raiz do workspace.
Para um workspace multi-projeto, arquivos de configuração específicos do projeto ficam na raiz do projeto, em `projects/project-name/`.

Arquivos de configuração do [TypeScript](https://www.typescriptlang.org) específicos do projeto herdam do `tsconfig.json` de todo o workspace.

| Arquivos de configuração específicos da aplicação | Propósito |
| :------------------------------------------------ | :-------- |
| `tsconfig.app.json`                               | Configuração do [TypeScript](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) específica da aplicação, incluindo [opções do compilador Angular](reference/configs/angular-compiler-options). |
| `tsconfig.spec.json`                              | Configuração do [TypeScript](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) para os testes da aplicação. |

## Múltiplos projetos {#multiple-projects}

Um workspace multi-projeto é adequado para uma organização que usa um único repositório e configuração global para múltiplos projetos Angular (o modelo "monorepo").
Um workspace multi-projeto também dá suporte ao desenvolvimento de bibliotecas.

### Configurando para um workspace multi-projeto {#setting-up-for-a-multi-project-workspace}

Se você pretende ter múltiplos projetos em um workspace, pode pular a geração inicial da aplicação ao criar o workspace e dar a ele um nome único.
O comando a seguir cria um workspace com todos os arquivos de configuração de todo o workspace, mas nenhuma aplicação de nível raiz.

```shell
ng new my-workspace --no-create-application
```

Você pode então gerar aplicações e bibliotecas com nomes que são únicos dentro do workspace.

```shell
cd my-workspace
ng generate application my-app
ng generate library my-lib
```

### Estrutura de arquivos de múltiplos projetos {#multiple-project-file-structure}

A primeira aplicação explicitamente gerada vai para a pasta `projects`, junto com todos os outros projetos no workspace.
Bibliotecas recém-geradas também são adicionadas em `projects`.
Quando você cria projetos dessa forma, a estrutura de arquivos do workspace é totalmente consistente com a estrutura do [arquivo de configuração do workspace](reference/configs/workspace-config), `angular.json`.

```markdown
my-workspace/
├── … (arquivos de configuração de todo o workspace)
└── projects/ (aplicações e bibliotecas)
├── my-app/ (uma aplicação explicitamente gerada)
│ └── … (código e configuração específicos da aplicação)
└── my-lib/ (uma biblioteca gerada)
└── … (código e configuração específicos da biblioteca)
```

## Arquivos de projeto de biblioteca {#library-project-files}

Quando você gera uma biblioteca usando o CLI (com um comando como `ng generate library my-lib`), os arquivos gerados vão para a pasta `projects/` do workspace.
Para mais informações sobre como criar suas próprias bibliotecas, veja [Criando Bibliotecas](tools/libraries/creating-libraries).

Diferente de uma aplicação, uma biblioteca tem seu próprio arquivo de configuração `package.json`.

Dentro da pasta `projects/`, a pasta `my-lib` contém o código da sua biblioteca.

| Arquivos de origem da biblioteca | Propósito |
| :------------------------------- | :-------- |
| `src/lib`                        | Contém a lógica e os dados do seu projeto de biblioteca. Como um projeto de aplicação, um projeto de biblioteca pode conter components, services, módulos, diretivas e pipes. |
| `src/public-api.ts`              | Especifica todos os arquivos que são exportados da sua biblioteca. |
| `ng-package.json`                | Arquivo de configuração usado pelo [ng-packagr](https://github.com/ng-packagr/ng-packagr) para construir sua biblioteca. |
| `package.json`                   | Configura [dependências de pacotes npm](reference/configs/npm-packages) que são necessárias para esta biblioteca. |
| `tsconfig.lib.json`              | Configuração do [TypeScript](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) específica da biblioteca, incluindo [opções do compilador Angular](reference/configs/angular-compiler-options). |
| `tsconfig.lib.prod.json`         | Configuração do [TypeScript](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) específica da biblioteca que é usada ao construir a biblioteca em modo de produção. |
| `tsconfig.spec.json`             | Configuração do [TypeScript](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) para os testes unitários da biblioteca. |
