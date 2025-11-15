<!-- ia-translate: true -->
# Angular Language Service

O Angular Language Service fornece aos editores de código uma maneira de obter completions, erros, dicas e navegação dentro de templates do Angular.
Ele funciona com templates externos em arquivos HTML separados, e também com templates inline.

## Configurando opções do compilador para o Angular Language Service

Para habilitar os recursos mais recentes do Language Service, configure a opção `strictTemplates` no `tsconfig.json` definindo `strictTemplates` como `true`, conforme mostrado no exemplo a seguir:

```json

"angularCompilerOptions": {
  "strictTemplates": true
}

```

Para mais informações, veja o guia [Opções do compilador Angular](reference/configs/angular-compiler-options).

## Recursos

Seu editor detecta automaticamente que você está abrindo um arquivo Angular.
Ele então usa o Angular Language Service para ler seu arquivo `tsconfig.json`, encontrar todos os templates que você tem na sua aplicação e então fornecer serviços de linguagem para quaisquer templates que você abrir.

Os serviços de linguagem incluem:

- Listas de completions
- Mensagens de diagnóstico AOT
- Quick info
- Ir para definição

### Autocompletion

Autocompletion pode acelerar seu tempo de desenvolvimento fornecendo possibilidades e dicas contextuais conforme você digita.
Este exemplo mostra autocomplete em uma interpolation.
Conforme você digita, pode pressionar tab para completar.

<img alt="autocompletion" src="assets/images/guide/language-service/language-completion.gif">

Também há completions dentro de elements.
Quaisquer elements que você tenha como seletor de component aparecerão na lista de completion.

### Verificação de erros

O Angular Language Service pode alertá-lo sobre erros no seu código.
Neste exemplo, o Angular não sabe o que é `orders` ou de onde vem.

<img alt="error checking" src="assets/images/guide/language-service/language-error.gif">

### Quick info e navegação

O recurso quick-info permite que você passe o mouse para ver de onde vêm components, directives e modules.
Você pode então clicar em "Go to definition" ou pressionar F12 para ir diretamente à definição.

<img alt="navigation" src="assets/images/guide/language-service/language-navigation.gif">

## Angular Language Service no seu editor

O Angular Language Service está atualmente disponível como uma extensão para [Visual Studio Code](https://code.visualstudio.com), [WebStorm](https://www.jetbrains.com/webstorm), [Sublime Text](https://www.sublimetext.com), [Zed](https://zed.dev), [Neovim](https://neovim.io) e [Eclipse IDE](https://www.eclipse.org/eclipseide).

### Visual Studio Code

No [Visual Studio Code](https://code.visualstudio.com), instale a extensão do [Extensions: Marketplace](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template).
Abra o marketplace do editor usando o ícone Extensions no painel de menu à esquerda, ou use VS Quick Open \(⌘+P no Mac, CTRL+P no Windows\) e digite "? ext".
No marketplace, procure por extensão Angular Language Service e clique no botão **Install**.

A integração do Visual Studio Code com o Angular language service é mantida e distribuída pela equipe do Angular.

### Visual Studio

No [Visual Studio](https://visualstudio.microsoft.com), instale a extensão do [Extensions: Marketplace](https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.AngularLanguageService).
Abra o marketplace do editor selecionando Extensions no painel de menu superior e, em seguida, selecionando Manage Extensions.
No marketplace, procure por extensão Angular Language Service e clique no botão **Install**.

A integração do Visual Studio com o Angular language service é mantida e distribuída pela Microsoft com ajuda da equipe do Angular.
Confira o projeto [aqui](https://github.com/microsoft/vs-ng-language-service).

### WebStorm

No [WebStorm](https://www.jetbrains.com/webstorm), habilite o plugin [Angular and AngularJS](https://plugins.jetbrains.com/plugin/6971-angular-and-angularjs).

Desde o WebStorm 2019.1, o `@angular/language-service` não é mais necessário e deve ser removido do seu `package.json`.

### Sublime Text

No [Sublime Text](https://www.sublimetext.com), o Language Service suporta apenas templates inline quando instalado como um plug-in.
Você precisa de um plug-in Sublime personalizado \(ou modificações no plug-in atual\) para completions em arquivos HTML.

Para usar o Language Service para templates inline, você deve primeiro adicionar uma extensão para permitir TypeScript e então instalar o plug-in Angular Language Service.
A partir do TypeScript 2.3, o TypeScript tem um modelo de plug-in que o language service pode usar.

1. Instale a versão mais recente do TypeScript em um diretório local `node_modules`:

```shell

npm install --save-dev typescript

```

1. Instale o pacote Angular Language Service no mesmo local:

```shell

npm install --save-dev @angular/language-service

```

1. Uma vez que o pacote esteja instalado, adicione o seguinte à seção `"compilerOptions"` do `tsconfig.json` do seu projeto.

   ```json {header:"tsconfig.json"}
   "plugins": [
     {"name": "@angular/language-service"}
   ]
   ```

2. Nas preferências de usuário do seu editor \(`Cmd+,` ou `Ctrl+,`\), adicione o seguinte:

   ```json {header:"Sublime Text user preferences"}

   "typescript-tsdk": "<path to your folder>/node_modules/typescript/lib"

   ```

Isso permite que o Angular Language Service forneça diagnósticos e completions em arquivos `.ts`.

### Eclipse IDE

Instale diretamente o pacote "Eclipse IDE for Web and JavaScript developers" que vem com o Angular Language Server incluído, ou de outros pacotes Eclipse IDE, use Help > Eclipse Marketplace para encontrar e instalar [Eclipse Wild Web Developer](https://marketplace.eclipse.org/content/wild-web-developer-html-css-javascript-typescript-nodejs-angular-json-yaml-kubernetes-xml).

### Neovim

#### Conquer of Completion com Node.js

O Angular Language Service usa o tsserver, que não segue as especificações LSP exatamente. Portanto, se você estiver usando neovim ou vim com JavaScript ou TypeScript ou Angular, pode descobrir que [Conquer of Completion](https://github.com/neoclide/coc.nvim) (COC) tem a implementação mais completa do Angular Language Service e do tsserver. Isso ocorre porque o COC porta a implementação do VSCode do tsserver, que acomoda a implementação do tsserver.

1. [Setup coc.nvim](https://github.com/neoclide/coc.nvim)

2. Configure o Angular Language Service

   Uma vez instalado, execute o comando de linha de comando vim `CocConfig` para abrir o arquivo de configuração `coc-settings.json` e adicione a propriedade angular.

   Certifique-se de substituir os caminhos corretos para seus `node_modules` globais de modo que eles apontem para diretórios que contenham `tsserver` e `ngserver` respectivamente.

   ```json {header:"CocConfig example file coc-settings.json"}
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

#### LSP Integrado do Neovim

O Angular Language Service pode ser usado com Neovim usando o plugin [nvim-lspconfig](https://github.com/neovim/nvim-lspconfig).

1. [Install nvim-lspconfig](https://github.com/neovim/nvim-lspconfig?tab=readme-ov-file#install)

2. [Configure angularls for nvim-lspconfig](https://github.com/neovim/nvim-lspconfig/blob/master/doc/configs.md#angularls)

### Zed

No [Zed](https://zed.dev), instale a extensão do [Extensions: Marketplace](https://zed.dev/extensions/angular).

## Como o Language Service funciona

Quando você usa um editor com um language service, o editor inicia um processo de language-service separado e se comunica com ele através de um [RPC](https://en.wikipedia.org/wiki/Remote_procedure_call), usando o [Language Server Protocol](https://microsoft.github.io/language-server-protocol).
Quando você digita no editor, o editor envia informações ao processo do language-service para rastrear o estado do seu projeto.

Quando você aciona uma lista de completion dentro de um template, o editor primeiro analisa o template em uma [árvore de sintaxe abstrata (AST)](https://en.wikipedia.org/wiki/Abstract_syntax_tree) HTML.
O compilador do Angular interpreta essa árvore para determinar o contexto: de qual módulo o template faz parte, o escopo atual, o seletor do component e onde seu cursor está no AST do template.
Ele pode então determinar os símbolos que poderiam potencialmente estar naquela posição.

É um pouco mais envolvido se você estiver em uma interpolation.
Se você tiver uma interpolation de `{{data.---}}` dentro de uma `div` e precisar da lista de completion após `data.---`, o compilador não pode usar o AST HTML para encontrar a resposta.
O AST HTML só pode dizer ao compilador que há algum texto com os caracteres "`{{data.---}}`".
É quando o template parser produz um AST de expressão, que reside dentro do AST do template.
O Angular Language Services então analisa `data.---` dentro de seu contexto, pergunta ao TypeScript Language Service quais são os membros de `data` e retorna a lista de possibilidades.

## Mais informações

- Para informações mais detalhadas sobre a implementação, veja o [código-fonte do Angular Language Service](https://github.com/angular/angular/blob/main/packages/language-service/src)
- Para mais sobre as considerações de design e intenções, veja [documentação de design aqui](https://github.com/angular/vscode-ng-language-service/wiki/Design)
