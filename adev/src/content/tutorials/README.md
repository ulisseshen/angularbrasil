<!-- ia-translate: true -->

# Documentação incorporada de tutoriais do Angular

- [Arquivos dos tutoriais](#tutorial-files)
- [Estrutura de diretórios dos tutoriais](#tutorials-directory-structure)
- [Diretórios de tutoriais reservados](#reserved-tutorials-directories)

## Arquivos dos tutoriais {#tutorial-files}

O conteúdo dos tutoriais consiste em conteúdo do tutorial, código-fonte e configuração.

### Conteúdo: `README.md` {#content-readmemd}

O conteúdo do tutorial deve estar localizado em um arquivo `README.md` no diretório do tutorial.

Tomando o tutorial `learn-angular` como exemplo, veja: [`adev/src/content/tutorials/learn-angular/intro/README.md`](/adev/src/content/tutorials/learn-angular/intro/README.md)

### Configuração: `config.json` {#configuration-configjson}

Cada tutorial é definido por um `config.json`, que pode ter as seguintes opções:

- `title`: define o título do tutorial usado na navegação de tutoriais
- `nextTutorial`: o caminho do próximo tutorial (somente na pasta `intro/`)
- `src`: o caminho relativo para um diretório externo, que define o código-fonte do tutorial usado no editor incorporado
- `answerSrc`: o caminho relativo para um diretório externo, que define a resposta do tutorial usada no editor incorporado
- `openFiles`: um array de arquivos a serem abertos no editor
- `type`: o tipo indica como o tutorial será apresentado e quais componentes são necessários para ele
  - `cli`: um tutorial do tipo `cli` terá apenas o conteúdo e um terminal interativo com o Angular CLI
  - `editor`: usado para o editor incorporado completo, contendo o editor de código, a visualização, um terminal interativo e o console com as saídas do servidor de desenvolvimento
  - `local`: desabilita o editor incorporado e mostra apenas o conteúdo
  - `editor-only`: uma configuração especial usada para o playground de tutoriais e o playground da página inicial, que desabilita o conteúdo e mostra apenas o editor incorporado

### Código-fonte {#source-code}

O código-fonte do tutorial inclui todos os arquivos do diretório do tutorial, exceto `README.md` e `config.json`.

O código-fonte do tutorial tem precedência sobre o projeto [`common`](#common). Assim, se um arquivo existir tanto em [`common`](#common) quanto no diretório do tutorial, com o mesmo caminho relativo, o arquivo do tutorial substituirá o arquivo de [`common`](#common).

## Estrutura de diretórios dos tutoriais {#tutorials-directory-structure}

Um tutorial é composto por uma introdução e passos. Tanto a introdução quanto cada passo contêm seu próprio conteúdo, configuração e código-fonte.

Tomando o tutorial `learn-angular` como exemplo:

### Introdução {#introduction}

[`adev/src/content/tutorials/learn-angular/intro`](/adev/src/content/tutorials/learn-angular/intro)

é a introdução do tutorial, que ficará disponível na rota `/tutorials/learn-angular`.

### Passos {#steps}

[`adev/src/content/tutorials/learn-angular/steps`](/adev/src/content/tutorials/learn-angular/steps) é o diretório que contém os passos do tutorial.

Estes são alguns exemplos do tutorial `learn-angular`:

- [`learn-angular/steps/1-components-in-angular`](/adev/src/content/tutorials/learn-angular/steps/1-components-in-angular): A rota será `/tutorials/learn-angular/1-components-in-angular`
- [`learn-angular/steps/2-updating-the-component-class`](/adev/src/content/tutorials/learn-angular/steps/2-updating-the-component-class): A rota será `/tutorials/learn-angular/2-updating-the-component-class`

Cada diretório de passo deve começar com um número, seguido de um hífen e depois do nome do caminho do passo.

- O número indica o passo, definindo qual será o passo anterior e o próximo dentro de um tutorial.
- O hífen é um delimitador :).
- O nome do diretório, incluindo o número e o hífen, define a URL do passo.

## Diretórios de tutoriais reservados {#reserved-tutorials-directories}

### `common`

O projeto common é um projeto Angular completo reutilizado por todos os tutoriais. Ele contém todas as
dependências (`package.json`, `package-lock.json`), a configuração do projeto (`tsconfig.json`, `angular.json`) e os arquivos principais para inicializar a aplicação (`index.html`, `main.ts`, `app.config.ts`).

Um projeto common é usado por vários motivos:

- Evitar a duplicação de arquivos nos tutoriais.
- Otimizar o desempenho dentro do aplicativo, solicitando os arquivos e as dependências do projeto common apenas uma vez, aproveitando o
  cache do navegador nas requisições seguintes.
- Exigir um único `npm install` para todos os tutoriais, reduzindo assim o tempo até a interatividade com o tutorial
  ao navegar entre diferentes tutoriais e passos.
- Fornecer um ambiente consistente para todos os tutoriais.
- Permitir que cada tutorial foque no código-fonte específico do que está sendo ensinado, e não na configuração do projeto.

Veja [`adev/shared-docs/pipeline/tutorials/common`](/adev/shared-docs/pipeline/tutorials/common)

Um tutorial também pode fornecer seu próprio diretório `common`, cujos arquivos são aplicados sobre o projeto common compartilhado, tanto para a introdução quanto para cada passo daquele tutorial. Veja [`adev/src/content/tutorials/signals/common`](/adev/src/content/tutorials/signals/common) como exemplo.

### `playground`

O playground contém o código-fonte do playground de tutoriais em `/playground`. Ele não deve conter nenhum conteúdo.

Veja [`adev/src/content/tutorials/playground`](/adev/src/content/tutorials/playground)

### `homepage`

O homepage contém o código-fonte do playground da página inicial. Ele não deve conter nenhum conteúdo.

Veja [`adev/src/content/tutorials/homepage`](/adev/src/content/tutorials/homepage)

## Atualizar dependências {#update-dependencies}

Para atualizar as dependências de todos os tutoriais, você pode executar o seguinte script:

```bash
rm ./adev/src/content/tutorials/homepage/package-lock.json  ./adev/src/content/tutorials/first-app/common/package-lock.json ./adev/src/content/tutorials/learn-angular/common/package-lock.json ./adev/src/content/tutorials/playground/common/package-lock.json ./adev/src/content/tutorials/deferrable-views/common/package-lock.json ./adev/src/content/tutorials/signals/common/package-lock.json ./adev/src/content/tutorials/signal-forms/common/package-lock.json ./adev/shared-docs/pipeline/tutorials/common/package-lock.json

npm i --package-lock-only --prefix ./adev/src/content/tutorials/homepage
npm i --package-lock-only --prefix ./adev/src/content/tutorials/first-app/common
npm i --package-lock-only --prefix ./adev/src/content/tutorials/learn-angular/common
npm i --package-lock-only --prefix ./adev/src/content/tutorials/playground/common
npm i --package-lock-only --prefix ./adev/src/content/tutorials/deferrable-views/common
npm i --package-lock-only --prefix ./adev/src/content/tutorials/signals/common
npm i --package-lock-only --prefix ./adev/src/content/tutorials/signal-forms/common
npm i --package-lock-only --prefix ./adev/shared-docs/pipeline/tutorials/common
```
