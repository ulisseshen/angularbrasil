<!-- ia-translate: true -->
<docs-decorative-header title="Instalação" imgSrc="adev/src/assets/images/what_is_angular.svg"> <!-- markdownlint-disable-line -->
</docs-decorative-header>

Comece a usar o Angular rapidamente com starters online ou localmente, pelo seu terminal.

## Experimente online {#play-online}

Se você quer apenas experimentar o Angular no navegador, sem configurar um projeto, pode usar nossa sandbox online:

<docs-card title="Playground" href="/playground" link="Abrir no Playground" iconImgSrc="adev/src/assets/icons/playground.svg" titleInline>
A forma mais rápida de experimentar uma aplicação Angular. Não é necessária nenhuma configuração.
</docs-card>

## Configure um novo projeto localmente {#set-up-a-new-project-locally}

Se você está começando um novo projeto, provavelmente vai querer criar um projeto local para poder usar ferramentas como o Git.

### Pré-requisitos {#prerequisites}

- **Node.js** - [v22.22.3 ou mais recente](/reference/versions)
- **Editor de texto** - Recomendamos o [Visual Studio Code](https://code.visualstudio.com/)
- **Terminal** - Necessário para executar comandos do [Angular CLI](/tools/cli)
- **Ferramenta de desenvolvimento** - Para melhorar seu fluxo de trabalho, recomendamos o [Angular Language Service](/tools/language-service)

### Instruções {#instructions}

O guia a seguir vai orientar você na configuração de um projeto Angular local.

#### Instale o Angular CLI {#install-angular-cli}

Abra um terminal (se você estiver usando o [Visual Studio Code](https://code.visualstudio.com/), pode abrir um [terminal integrado](https://code.visualstudio.com/docs/editor/integrated-terminal)) e execute o seguinte comando:

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

Se você tiver problemas para executar este comando no Windows ou no Unix, consulte a [documentação do CLI](/tools/cli/setup-local#install-the-angular-cli) para mais informações.

#### Crie um novo projeto {#create-a-new-project}

No seu terminal, execute o comando do CLI [`ng new`](cli/new) com o nome desejado para o projeto. Nos exemplos a seguir, usaremos o nome de exemplo `my-first-angular-app`.

```shell
ng new <project-name>
```

Você verá algumas opções de configuração para o seu projeto. Use as teclas de seta e Enter para navegar e selecionar as opções que desejar.

Se você não tiver preferências, basta pressionar Enter para aceitar as opções padrão e continuar com a configuração.

Depois que você selecionar as opções de configuração e o CLI concluir a configuração, você deverá ver a seguinte mensagem:

```text
✔ Packages installed successfully.
    Successfully initialized git.
```

Neste ponto, você está pronto para executar o seu projeto localmente!

#### Executando seu novo projeto localmente {#running-your-new-project-locally}

No seu terminal, mude para o seu novo projeto Angular.

```shell
cd my-first-angular-app
```

Todas as dependências devem estar instaladas neste ponto (o que você pode verificar conferindo se existe uma pasta `node_modules` no projeto), então você pode iniciar o projeto executando o comando:

```shell
npm start
```

Se tudo der certo, você deverá ver uma mensagem de confirmação semelhante no seu terminal:

```text
Watch mode enabled. Watching for file changes...
NOTE: Raw file sizes do not reflect development server per-request transformations.
  ➜  Local:   http://localhost:4200/
  ➜  press h + enter to show help
```

Agora você pode acessar o endereço em `Local` (por exemplo, `http://localhost:4200`) para ver sua aplicação. Bons códigos! 🎉

### Usando IA para desenvolvimento {#using-ai-for-development}

Para começar a construir no seu IDE preferido com suporte a IA, [confira as regras de prompt e as boas práticas do Angular](/ai/develop-with-ai).

## Próximos passos {#next-steps}

Agora que você criou seu projeto Angular, pode aprender mais sobre o Angular no nosso [guia Essentials](/essentials) ou escolher um tópico nos nossos guias detalhados!
