<!-- ia-translate: true -->
<docs-decorative-header title="Instalação" imgSrc="adev/src/assets/images/what_is_angular.svg"> <!-- markdownlint-disable-line -->
</docs-decorative-header>

Comece com Angular rapidamente com starters online ou localmente com seu terminal.

## Experimente Online

Se você quer apenas experimentar o Angular no seu navegador sem configurar um projeto, você pode usar nossa sandbox online:

<docs-card-container>
  <docs-card title="" href="/playground" link="Abrir no Playground">
  A maneira mais rápida de experimentar uma aplicação Angular. Nenhuma configuração necessária.
  </docs-card>
</docs-card-container>

## Configure um novo projeto localmente

Se você está iniciando um novo projeto, você provavelmente vai querer criar um projeto local para poder usar ferramentas como Git.

### Pré-requisitos

- **Node.js** - [v20.19.0 ou mais recente](/reference/versions)
- **Editor de texto** - Recomendamos [Visual Studio Code](https://code.visualstudio.com/)
- **Terminal** - Necessário para executar comandos do Angular CLI
- **Ferramenta de Desenvolvimento** - Para melhorar seu fluxo de trabalho de desenvolvimento, recomendamos o [Angular Language Service](/tools/language-service)

### Instruções

O guia a seguir vai orientá-lo na configuração de um projeto Angular local.

#### Instale o Angular CLI

Abra um terminal (se você está usando [Visual Studio Code](https://code.visualstudio.com/), você pode abrir um [terminal integrado](https://code.visualstudio.com/docs/editor/integrated-terminal)) e execute o seguinte comando:

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

Se você está tendo problemas para executar este comando no Windows ou Unix, consulte a [documentação do CLI](/tools/cli/setup-local#install-the-angular-cli) para mais informações.

#### Crie um novo projeto

No seu terminal, execute o comando `ng new` do CLI com o nome desejado do projeto. Nos exemplos a seguir, usaremos o nome de projeto de exemplo `my-first-angular-app`.

<docs-code language="shell">

ng new <project-name>

</docs-code>

Você verá algumas opções de configuração para seu projeto. Use as teclas de seta e enter para navegar e selecionar as opções que você desejar.

Se você não tem preferências, apenas pressione a tecla enter para aceitar as opções padrão e continuar com a configuração.

Depois que você selecionar as opções de configuração e o CLI executar a configuração, você deverá ver a seguinte mensagem:

```text
✔ Packages installed successfully.
    Successfully initialized git.
```

Neste ponto, você está pronto para executar seu projeto localmente!

#### Executando seu novo projeto localmente

No seu terminal, mude para o seu novo projeto Angular.

<docs-code language="shell">

cd my-first-angular-app

</docs-code>

Todas as suas dependências devem estar instaladas neste ponto (o que você pode verificar checando a existência de uma pasta `node_modules` no seu projeto), então você pode iniciar seu projeto executando o comando:

<docs-code language="shell">

npm start

</docs-code>

Se tudo der certo, você deverá ver uma mensagem de confirmação similar no seu terminal:

```text
Watch mode enabled. Watching for file changes...
NOTE: Raw file sizes do not reflect development server per-request transformations.
  ➜  Local:   http://localhost:4200/
  ➜  press h + enter to show help
```

E agora você pode visitar o caminho em `Local` (por exemplo, `http://localhost:4200`) para ver sua aplicação. Bons códigos! 🎉

### Usando IA para Desenvolvimento

Para começar a construir no seu IDE preferido com suporte a IA, [confira as regras de prompt e boas práticas do Angular](/ai/develop-with-ai).

## Próximos passos

Agora que você criou seu projeto Angular, você pode aprender mais sobre Angular no nosso [guia Essentials](/essentials) ou escolher um tópico nos nossos guias detalhados!
