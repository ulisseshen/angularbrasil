<!-- ia-translate: true -->
# Angular Language Service

O Angular Language Service fornece aos editores de código uma forma de obter completions, erros, dicas e navegação dentro de templates Angular.
Ele funciona com templates externos, em arquivos HTML separados, e também com templates inline.

## Configurando opções do compilador para o Angular Language Service {#configuring-compiler-options-for-the-angular-language-service}

Para habilitar os recursos mais recentes do Language Service, defina a opção `strictTemplates` no `tsconfig.json` como `true`, como mostrado no exemplo a seguir:

```json

"angularCompilerOptions": {
  "strictTemplates": true
}

```

Para mais informações, veja o guia [Opções do compilador Angular](reference/configs/angular-compiler-options).

## Recursos {#features}

Seu editor detecta automaticamente que você está abrindo um arquivo Angular.
Ele então usa o Angular Language Service para ler seu arquivo `tsconfig.json`, encontrar todos os templates da sua aplicação e fornecer serviços de linguagem para qualquer template que você abrir.

Os serviços de linguagem incluem:

- Listas de completions
- Mensagens de diagnóstico do AOT
- Quick info
- Ir para definição

### Autocompletar {#autocompletion}

O autocompletar pode acelerar seu tempo de desenvolvimento, fornecendo possibilidades e dicas contextuais conforme você digita.
Este exemplo mostra o autocomplete em uma interpolação.
Conforme você digita, pode pressionar tab para completar.

<img alt="autocompletion" src="assets/images/guide/language-service/language-completion.gif">

Também há completions dentro de elements.
Qualquer element que você tenha como seletor de component aparecerá na lista de completions.

### Verificação de erros {#error-checking}

O Angular Language Service pode avisar você sobre erros no seu código com antecedência.
Neste exemplo, o Angular não sabe o que é `orders` nem de onde ele vem.

<img alt="error checking" src="assets/images/guide/language-service/language-error.gif">

### Quick info e navegação {#quick-info-and-navigation}

O recurso quick info permite passar o mouse para ver de onde vêm components, directives e modules.
Você pode então clicar em "Go to definition" ou pressionar F12 para ir diretamente à definição.

<img alt="navigation" src="assets/images/guide/language-service/language-navigation.gif">

## Angular Language Service no seu editor {#angular-language-service-in-your-editor}

O Angular Language Service está atualmente disponível como extensão para [Visual Studio Code](https://code.visualstudio.com), [WebStorm](https://www.jetbrains.com/webstorm), [Sublime Text](https://www.sublimetext.com), [Zed](https://zed.dev), [Neovim](https://neovim.io) e [Eclipse IDE](https://www.eclipse.org/eclipseide).

NOTA: A equipe do Angular mantém e distribui a extensão do Visual Studio Code, que é compatível com o Visual Studio Code e com editores baseados nele, como Cursor e Antigravity. As integrações para outros editores são mantidas pelos respectivos fornecedores ou pela comunidade. Reporte problemas específicos dessas integrações aos seus mantenedores.

### Visual Studio Code

No [Visual Studio Code](https://code.visualstudio.com), instale a extensão pelo [Extensions: Marketplace](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template).
Abra o marketplace pelo editor usando o ícone Extensions no menu lateral esquerdo, ou use o VS Quick Open \(⌘+P no Mac, CTRL+P no Windows\) e digite "? ext".
No marketplace, procure pela extensão Angular Language Service e clique no botão **Install**.

A integração do Visual Studio Code com o Angular language service é mantida e distribuída pela equipe do Angular.

### Visual Studio

No [Visual Studio](https://visualstudio.microsoft.com), instale a extensão pelo [Extensions: Marketplace](https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.AngularLanguageService).
Abra o marketplace pelo editor selecionando Extensions no menu superior e, em seguida, Manage Extensions.
No marketplace, procure pela extensão Angular Language Service e clique no botão **Install**.

A integração do Visual Studio com o Angular language service é mantida e distribuída pela Microsoft, com ajuda da equipe do Angular.
Confira o projeto [aqui](https://github.com/microsoft/vs-ng-language-service).

### WebStorm

No [WebStorm](https://www.jetbrains.com/webstorm), habilite o plugin [Angular and AngularJS](https://plugins.jetbrains.com/plugin/6971-angular-and-angularjs).

Desde o WebStorm 2019.1, o `@angular/language-service` não é mais necessário e deve ser removido do seu `package.json`.

### Sublime Text

No [Sublime Text](https://www.sublimetext.com), o Language Service suporta apenas templates inline quando instalado como plug-in.
Você precisa de um plug-in Sublime personalizado \(ou de modificações no plug-in atual\) para ter completions em arquivos HTML.

Para usar o Language Service com templates inline, primeiro você deve adicionar uma extensão para permitir o TypeScript e depois instalar o plug-in Angular Language Service.
A partir do TypeScript 2.3, o TypeScript tem um modelo de plug-in que o language service pode usar.

1. Instale a versão mais recente do TypeScript em um diretório `node_modules` local:

   ```shell
   npm install --save-dev typescript
   ```

1. Instale o pacote Angular Language Service no mesmo local:

   ```shell

   npm install --save-dev @angular/language-service

   ```

1. Depois que o pacote estiver instalado, adicione o seguinte à seção `"compilerOptions"` do `tsconfig.json` do seu projeto.

   ```json {header:"tsconfig.json"}
   "plugins": [
     {"name": "@angular/language-service"}
   ]
   ```

1. Nas preferências de usuário do seu editor \(`Cmd+,` ou `Ctrl+,`\), adicione o seguinte:

   ```json {header:"Sublime Text user preferences"}

   "typescript-tsdk": "<path to your folder>/node_modules/typescript/lib"

   ```

Isso permite que o Angular Language Service forneça diagnósticos e completions em arquivos `.ts`.

### Eclipse IDE

Instale diretamente o pacote "Eclipse IDE for Web and JavaScript developers", que já inclui o Angular Language Server, ou, a partir de outros pacotes do Eclipse IDE, use Help > Eclipse Marketplace para encontrar e instalar o [Eclipse Wild Web Developer](https://marketplace.eclipse.org/content/wild-web-developer-html-css-javascript-typescript-nodejs-angular-json-yaml-kubernetes-xml).

### Neovim

#### Conquer of Completion com Node.js {#conquer-of-completion-with-nodejs}

O Angular Language Service usa o tsserver, que não segue as especificações do LSP exatamente. Por isso, se você usa neovim ou vim com JavaScript, TypeScript ou Angular, pode descobrir que o [Conquer of Completion](https://github.com/neoclide/coc.nvim) (COC) tem a implementação mais completa do Angular Language Service e do tsserver. Isso acontece porque o COC porta a implementação do tsserver do VSCode, que acomoda o comportamento do tsserver.

1. [Setup coc.nvim](https://github.com/neoclide/coc.nvim)

2. Configure o Angular Language Service

   Depois de instalado, execute o comando de linha do vim `CocConfig` para abrir o arquivo de configuração `coc-settings.json` e adicione a propriedade angular.

   Certifique-se de substituir os caminhos pelos seus `node_modules` globais, de modo que apontem para os diretórios que contêm o `tsserver` e o `ngserver`, respectivamente.

   ```json {header:"Exemplo de arquivo CocConfig coc-settings.json"}
   {
     "languageserver": {
       "angular": {
         "command": "ngserver",
         "args": [
           "--stdio",
           "--tsProbeLocations",
           "/usr/local/lib/node_modules/typescript/lib/CHANGE/THIS/TO/YOUR/GLOBAL/NODE_MODULES",
           "--ngProbeLocations",
           "/usr/local/lib/node_modules/@angular/language-server/bin/CHANGE/THIS/TO/YOUR/GLOBAL/NODE_MODULES"
         ],
         "filetypes": ["ts", "typescript", "html"],
         "trace.server.verbosity": "verbose"
       }
     }
   }
   ```

HELPFUL: `/usr/local/lib/node_modules/typescript/lib` e `/usr/local/lib/node_modules/@angular/language-server/bin` acima devem apontar para a localização dos seus node modules globais, que pode ser diferente.

#### LSP integrado do Neovim {#built-in-neovim-lsp}

O Angular Language Service pode ser usado com o Neovim através do plugin [nvim-lspconfig](https://github.com/neovim/nvim-lspconfig).

1. [Install nvim-lspconfig](https://github.com/neovim/nvim-lspconfig?tab=readme-ov-file#install)

2. [Configure angularls for nvim-lspconfig](https://github.com/neovim/nvim-lspconfig/blob/master/doc/configs.md#angularls)

### Zed

No [Zed](https://zed.dev), instale a extensão mantida pela comunidade a partir do [Extensions: Marketplace](https://zed.dev/extensions/angular).

## Como o Language Service funciona {#how-the-language-service-works}

Quando você usa um editor com um language service, o editor inicia um processo separado de language service e se comunica com ele por meio de um [RPC](https://en.wikipedia.org/wiki/Remote_procedure_call), usando o [Language Server Protocol](https://microsoft.github.io/language-server-protocol).
Quando você digita no editor, ele envia informações ao processo do language service para acompanhar o estado do seu projeto.

Quando você aciona uma lista de completions dentro de um template, o editor primeiro analisa o template e o transforma em uma [árvore de sintaxe abstrata (AST)](https://en.wikipedia.org/wiki/Abstract_syntax_tree) HTML.
O compilador do Angular interpreta essa árvore para determinar o contexto: a qual módulo o template pertence, o escopo atual, o seletor do component e onde está o seu cursor na AST do template.
Ele pode então determinar os símbolos que potencialmente estão naquela posição.

É um pouco mais complexo se você estiver dentro de uma interpolação.
Se você tiver uma interpolação `{{data.---}}` dentro de uma `div` e precisar da lista de completions após `data.---`, o compilador não consegue usar a AST HTML para encontrar a resposta.
A AST HTML só consegue informar ao compilador que há algum texto com os caracteres "`{{data.---}}`".
É aí que o parser de template produz uma AST de expressão, que fica dentro da AST do template.
O Angular Language Service então analisa `data.---` dentro do seu contexto, pergunta ao TypeScript Language Service quais são os membros de `data` e retorna a lista de possibilidades.

## Mais informações {#more-information}

- Para informações mais detalhadas sobre a implementação, veja o [código-fonte do Angular Language Service](https://github.com/angular/angular/blob/main/packages/language-service/src)
- Para mais sobre as considerações e intenções de design, veja a [documentação de design aqui](https://github.com/angular/vscode-ng-language-service/wiki/Design)
