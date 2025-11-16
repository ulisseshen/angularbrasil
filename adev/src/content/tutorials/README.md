<!-- ia-translate: true -->

# Tutorial de documentação embarcada do Angular

- [Arquivos do tutorial](#arquivos-do-tutorial)
- [Estrutura de diretórios dos tutorials](#tutorial-directory-structure)
- [Diretórios de tutorials reservados](#reserved-tutorial-directories)

## Arquivos do tutorial

O conteúdo dos tutorials consiste do conteúdo do tutorial, código-fonte e configuração.

### Conteúdo: `README.md`

O conteúdo do tutorial deve estar localizado em um arquivo `README.md` no diretório do tutorial.

Tomando o tutorial `learn-angular` como exemplo, veja: [`src/content/tutorials/learn-angular/intro/README.md`](/src/content/tutorials/learn-angular/intro/README.md)

### Configuração: `config.json`

Cada tutorial é definido por um `config.json`, que pode ter as seguintes opções:

- `title`: define o título do tutorial usado na navegação do tutorial
- `nextTutorial`: o caminho do próximo tutorial (apenas no passo `intro/`)
- `src`: o caminho relativo para um diretório externo, que define o código-fonte do tutorial usado no editor embarcado
- `answerSrc`: o caminho relativo para um diretório externo, que define a resposta do tutorial usada no editor embarcado
- `openFiles`: um array de arquivos a serem abertos no editor
- `type`: o tipo denota como o tutorial será apresentado e quais components são necessários para aquele tutorial
  - `cli`: um tutorial com tipo `cli` conterá apenas o conteúdo e um terminal interativo com o Angular CLI
  - `editor`: usado para o editor embarcado completo, contendo o editor de código, a pré-visualização, um terminal interativo e o console com saídas do servidor de desenvolvimento
  - `local`: desabilita o editor embarcado e mostra apenas o conteúdo
  - `editor-only`: uma configuração especial usada para o playground do tutorial e o playground da homepage, que desabilita o conteúdo e mostra apenas o editor embarcado

### Código-fonte

O código-fonte do tutorial inclui cada arquivo no diretório do tutorial, exceto `README.md` e `config.json`.

O código-fonte do tutorial tem precedência sobre o arquivo do projeto [`common`](#common), então se um arquivo existir tanto em [`common`](#common) quanto no diretório do tutorial, contendo o mesmo caminho relativo, o arquivo do tutorial irá sobrescrever o arquivo [`common`](#common).

## Estrutura de diretórios dos tutorials {#tutorial-directory-structure}

Um tutorial é composto de uma introdução e passos. Tanto a introdução quanto cada passo contém seu próprio conteúdo, configuração e código-fonte.

Tomando o tutorial `learn-angular` como exemplo:

### Introdução

[`src/content/tutorials/learn-angular/intro`](/src/content/tutorials/learn-angular/intro)

é a introdução do tutorial, que estará disponível na rota `/tutorials/learn-angular`.

### Passos

[`src/content/tutorials/learn-angular/steps`](/src/content/tutorials/learn-angular/steps) é o diretório que contém os passos do tutorial.

Estes são alguns exemplos do tutorial `learn-angular`:

- [`learn-angular/steps/1-components-in-angular`](/src/content/tutorials/learn-angular/steps/1-components-in-angular): A rota será `/tutorials/learn-angular/components-in-angular`
- [`learn-angular/steps/2-updating-the-component-class`](/src/content/tutorials/learn-angular/steps/2-updating-the-component-class): A rota será `/tutorials/learn-angular/updating-the-component-class`

Cada diretório de passo deve começar com um número seguido por um hífen, depois seguido pelo pathname do passo.

- O número denota o passo, definindo qual será o passo anterior e o próximo dentro de um tutorial.
- O hífen é um delimitador :).
- O pathname obtido do nome do diretório define a URL do passo.

## Diretórios de tutorials reservados {#reserved-tutorial-directories}

### `common`

O projeto common é um projeto Angular completo que é reutilizado por todos os tutorials. Ele contém todas as
dependências (`package.json`, `package-lock.json`), configuração do projeto (`tsconfig.json`, `angular.json`) e arquivos principais para inicializar a aplicação (`index.html`, `main.ts`, `app.module.ts`).

Um projeto common é usado por várias razões:

- Evitar duplicação de arquivos nos tutorials.
- Otimizar a performance na aplicação solicitando os arquivos do projeto common e dependências apenas uma vez, beneficiando-se do
  cache do browser em requisições subsequentes.
- Requerer apenas um único `npm install` para todos os tutorials, portanto reduzindo o tempo para interação com o tutorial
  ao navegar entre diferentes tutorials e passos.
- Fornecer um ambiente consistente para todos os tutorials.
- Permitir que cada tutorial foque no código-fonte específico para o que está sendo ensinado e não na configuração do projeto.

Veja [`src/content/tutorials/common`](/src/content/tutorials/common)

### `playground`

O playground contém o código-fonte para o playground dos tutorials em `/playground`. Não deve conter nenhum conteúdo.

Veja [`src/content/tutorials/playground`](/src/content/tutorials/playground)

### `homepage`

O homepage contém o código-fonte para o playground da homepage. Não deve conter nenhum conteúdo.

Veja [`src/content/tutorials/homepage`](/src/content/tutorials/homepage)

## Atualizar dependências

Para atualizar as dependências de todos os tutorials você pode executar o seguinte script

```bash
rm ./adev/src/content/tutorials/homepage/package-lock.json  ./adev/src/content/tutorials/first-app/common/package-lock.json ./adev/src/content/tutorials/learn-angular/common/package-lock.json ./adev/src/content/tutorials/playground/common/package-lock.json ./adev/src/content/tutorials/deferrable-views/common/package-lock.json

npm i --package-lock-only --prefix ./adev/src/content/tutorials/homepage
npm i --package-lock-only --prefix ./adev/src/content/tutorials/first-app/common
npm i --package-lock-only --prefix ./adev/src/content/tutorials/learn-angular/common
npm i --package-lock-only --prefix ./adev/src/content/tutorials/playground/common
npm i --package-lock-only --prefix ./adev/src/content/tutorials/deferrable-views/common
```
