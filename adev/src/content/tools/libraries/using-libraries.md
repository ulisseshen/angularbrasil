<!-- ia-translate: true -->
# Uso de libraries do Angular publicadas no npm

Quando você constrói sua aplicação Angular, aproveite libraries sofisticadas de primeira parte, bem como um rico ecossistema de libraries de terceiros.
[Angular Material][AngularMaterialMain] é um exemplo de uma library sofisticada de primeira parte.

## Instalar libraries

Libraries são publicadas como [pacotes npm][GuideNpmPackages], geralmente junto com schematics que as integram com o Angular CLI.
Para integrar código de library reutilizável em uma aplicação, você precisa instalar o pacote e importar a funcionalidade fornecida no local onde a utiliza.
Para a maioria das libraries do Angular publicadas, use o comando `ng add <lib_name>` do Angular CLI.

O comando `ng add` do Angular CLI usa um gerenciador de pacotes para instalar o pacote da library e invoca schematics que estão incluídos no pacote para outros scaffolding dentro do código do projeto.
Exemplos de gerenciadores de pacotes incluem [npm][NpmjsMain] ou [yarn][YarnpkgMain].
Scaffolding adicional dentro do código do projeto inclui declarações de import, fontes e temas.

Uma library publicada normalmente fornece um arquivo `README` ou outra documentação sobre como adicionar essa library à sua aplicação.
Para um exemplo, veja a documentação do [Angular Material][AngularMaterialMain].

### Tipagens de library

Normalmente, pacotes de library incluem tipagens em arquivos `.d.ts`; veja exemplos em `node_modules/@angular/material`.
Se o pacote da sua library não incluir tipagens e seu IDE reclamar, você pode precisar instalar o pacote `@types/<lib_name>` com a library.

Por exemplo, suponha que você tenha uma library chamada `d3`:

```shell

npm install d3 --save
npm install @types/d3 --save-dev

```

Tipos definidos em um pacote `@types/` para uma library instalada no workspace são automaticamente adicionados à configuração do TypeScript para o projeto que usa essa library.
O TypeScript procura por tipos no diretório `node_modules/@types` por padrão, então você não precisa adicionar cada pacote de tipo individualmente.

Se uma library não tiver tipagens disponíveis em `@types/`, você pode usá-la adicionando manualmente tipagens para ela.
Para fazer isso:

1. Crie um arquivo `typings.d.ts` no seu diretório `src/`.
   Este arquivo é automaticamente incluído como definição de tipo global.

1. Adicione o seguinte código em `src/typings.d.ts`:

```ts
declare module 'host' {
  export interface Host {
    protocol?: string;
    hostname?: string;
    pathname?: string;
  }
  export function parse(url: string, queryString?: string): Host;
}

```

1. No component ou arquivo que usa a library, adicione o seguinte código:

```ts
import * as host from 'host';
const parsedUrl = host.parse('https://angular.dev');
console.log(parsedUrl.hostname);

```

Defina mais tipagens conforme necessário.

## Atualizando libraries

Uma library pode ser atualizada pelo publicador, e também possui dependências individuais que precisam ser mantidas atualizadas.
Para verificar atualizações das suas libraries instaladas, use o comando [`ng update`][CliUpdate] do Angular CLI.

Use o comando `ng update <lib_name>` do Angular CLI para atualizar versões de libraries individuais.
O Angular CLI verifica a versão publicada mais recente da library, e se a versão mais recente for mais nova que sua versão instalada, baixa e atualiza seu `package.json` para corresponder à versão mais recente.

Quando você atualiza o Angular para uma nova versão, precisa garantir que quaisquer libraries que você esteja usando estejam atualizadas.
Se libraries tiverem interdependências, você pode precisar atualizá-las em uma ordem específica.
Veja o [Angular Update Guide][AngularUpdateMain] para obter ajuda.

## Adicionando uma library ao escopo global de runtime

Se uma library JavaScript legada não for importada em uma aplicação, você pode adicioná-la ao escopo global de runtime e carregá-la como se tivesse sido adicionada em uma tag script.
Configure o Angular CLI para fazer isso no momento do build usando as opções `scripts` e `styles` do build target no arquivo de configuração de build do workspace [`angular.json`][GuideWorkspaceConfig].

Por exemplo, para usar a library [Bootstrap 4][GetbootstrapDocs40GettingStartedIntroduction]

1. Instale a library e as dependências associadas usando o gerenciador de pacotes npm:

```shell
npm install jquery --save
npm install popper.js --save
npm install bootstrap --save

```

1. No arquivo de configuração `angular.json`, adicione os arquivos de script associados ao array `scripts`:

```json
"scripts": [
  "node_modules/jquery/dist/jquery.slim.js",
  "node_modules/popper.js/dist/umd/popper.js",
  "node_modules/bootstrap/dist/js/bootstrap.js"
],

```

1. Adicione o arquivo CSS `bootstrap.css` ao array `styles`:

```json
"styles": [
  "node_modules/bootstrap/dist/css/bootstrap.css",
  "src/styles.css"
],

```

1. Execute ou reinicie o comando `ng serve` do Angular CLI para ver o Bootstrap 4 funcionar na sua aplicação.

### Usando libraries runtime-global dentro da sua aplicação

Depois de importar uma library usando o array "scripts", **não** a importe usando uma declaração import no seu código TypeScript.
O seguinte trecho de código é um exemplo de declaração import.

```ts

import * as $ from 'jquery';

```

Se você importá-la usando declarações import, terá duas cópias diferentes da library: uma importada como library global e uma importada como módulo.
Isso é especialmente ruim para libraries com plugins, como JQuery, porque cada cópia inclui plugins diferentes.

Em vez disso, execute o comando `npm install @types/jquery` do Angular CLI para baixar tipagens para sua library e então siga as etapas de instalação da library.
Isso lhe dá acesso às variáveis globais expostas por essa library.

### Definindo tipagens para libraries runtime-global

Se a library global que você precisa usar não tiver tipagens globais, você pode declará-las manualmente como `any` em `src/typings.d.ts`.

Por exemplo:

```ts

declare var libraryName: any;

```

Alguns scripts estendem outras libraries; por exemplo, com plugins JQuery:

```ts

$('.test').myPlugin();

```

Neste caso, o `@types/jquery` instalado não inclui `myPlugin`, então você precisa adicionar uma interface em `src/typings.d.ts`.
Por exemplo:

```ts

interface JQuery {
  myPlugin(options?: any): any;
}

```

Se você não adicionar a interface para a extensão definida pelo script, seu IDE mostrará um erro:

```text

[TS][Error] Property 'myPlugin' does not exist on type 'JQuery'

```

[CliUpdate]: cli/update 'ng update | CLI |Angular'
[GuideNpmPackages]: reference/configs/npm-packages 'Workspace npm dependencies | Angular'
[GuideWorkspaceConfig]: reference/configs/workspace-config 'Angular workspace configuration | Angular'
[Resources]: resources 'Explore Angular Resources | Angular'
[AngularMaterialMain]: https://material.angular.dev 'Angular Material | Angular'
[AngularUpdateMain]: https://angular.dev/update-guide 'Angular Update Guide | Angular'
[GetbootstrapDocs40GettingStartedIntroduction]: https://getbootstrap.com/docs/4.0/getting-started/introduction 'Introduction | Bootstrap'
[NpmjsMain]: https://www.npmjs.com 'npm'
[YarnpkgMain]: https://yarnpkg.com ' Yarn'
