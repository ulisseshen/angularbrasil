<!-- ia-translate: true -->
# Schematics para bibliotecas

Quando você cria uma biblioteca Angular, pode fornecê-la e empacotá-la com schematics que a integram com o Angular CLI.
Com seus schematics, seus usuários podem usar `ng add` para instalar uma versão inicial de sua biblioteca,
`ng generate` para criar artefatos definidos em sua biblioteca e `ng update` para ajustar seu projeto para uma nova versão de sua biblioteca que introduz mudanças incompatíveis.

Todos os três tipos de schematics podem fazer parte de uma coleção que você empacota com sua biblioteca.

## Criando uma coleção de schematics

Para iniciar uma coleção, você precisa criar os arquivos de schematic.
Os passos a seguir mostram como adicionar suporte inicial sem modificar nenhum arquivo do projeto.

1. Na pasta raiz de sua biblioteca, crie uma pasta `schematics`.
1. Na pasta `schematics/`, crie uma pasta `ng-add` para seu primeiro schematic.
1. No nível raiz da pasta `schematics`, crie um arquivo `collection.json`.
1. Edite o arquivo `collection.json` para definir o schema inicial para sua coleção.

   <docs-code header="projects/my-lib/schematics/collection.json (Schematics Collection)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/collection.1.json"/>
   - O caminho `$schema` é relativo ao schema de coleção do Angular Devkit.
   - O objeto `schematics` descreve os schematics nomeados que fazem parte desta coleção.
   - A primeira entrada é para um schematic chamado `ng-add`.
     Ela contém a descrição e aponta para a função factory que é chamada quando seu schematic é executado.

1. No arquivo `package.json` do projeto de sua biblioteca, adicione uma entrada "schematics" com o caminho para seu arquivo de schema.
   O Angular CLI usa esta entrada para encontrar schematics nomeados em sua coleção quando executa comandos.

<docs-code header="projects/my-lib/package.json (Schematics Collection Reference)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/package.json" visibleRegion="collection"/>

O schema inicial que você criou diz ao CLI onde encontrar o schematic que suporta o comando `ng add`.
Agora você está pronto para criar esse schematic.

## Fornecendo suporte de instalação

Um schematic para o comando `ng add` pode aprimorar o processo de instalação inicial para seus usuários.
Os passos a seguir definem este tipo de schematic.

1. Vá para a pasta `<lib-root>/schematics/ng-add`.
1. Crie o arquivo principal, `index.ts`.
1. Abra `index.ts` e adicione o código-fonte para sua função factory de schematic.

<docs-code header="projects/my-lib/schematics/ng-add/index.ts (ng-add Rule Factory)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/ng-add/index.ts"/>

O Angular CLI instalará a versão mais recente da biblioteca automaticamente, e este exemplo está indo um passo além adicionando o `MyLibModule` à raiz da aplicação. A função `addRootImport` aceita um callback que precisa retornar um bloco de código. Você pode escrever qualquer código dentro da string marcada com a função `code` e qualquer símbolo externo deve ser envolvido com a função `external` para garantir que as instruções de import apropriadas sejam geradas.

### Definir tipo de dependência

Use a opção `save` de `ng-add` para configurar se a biblioteca deve ser adicionada às `dependencies`, às `devDependencies` ou não salva no arquivo de configuração `package.json` do projeto.

<docs-code header="projects/my-lib/package.json (ng-add Reference)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/package.json" visibleRegion="ng-add"/>

Valores possíveis são:

| Valores             | Detalhes                                    |
| :------------------ | :------------------------------------------ |
| `false`             | Não adicione o pacote ao `package.json`     |
| `true`              | Adicione o pacote às dependencies           |
| `"dependencies"`    | Adicione o pacote às dependencies           |
| `"devDependencies"` | Adicione o pacote às devDependencies        |

## Construindo seus schematics

Para empacotar seus schematics junto com sua biblioteca, você deve configurar a biblioteca para construir os schematics separadamente e depois adicioná-los ao pacote.
Você deve construir seus schematics _depois_ de construir sua biblioteca, para que sejam colocados no diretório correto.

- Sua biblioteca precisa de um arquivo de configuração TypeScript personalizado com instruções sobre como compilar seus schematics em sua biblioteca distribuída
- Para adicionar os schematics ao pacote da biblioteca, adicione scripts ao arquivo `package.json` da biblioteca

Suponha que você tenha um projeto de biblioteca `my-lib` em seu workspace Angular.
Para dizer à biblioteca como construir os schematics, adicione um arquivo `tsconfig.schematics.json` ao lado do arquivo `tsconfig.lib.json` gerado que configura a construção da biblioteca.

1. Edite o arquivo `tsconfig.schematics.json` para adicionar o seguinte conteúdo.

   <docs-code header="projects/my-lib/tsconfig.schematics.json (TypeScript Config)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/tsconfig.schematics.json"/>

   | Opções    | Detalhes                                                                                               |
   | :-------- | :----------------------------------------------------------------------------------------------------- |
   | `rootDir` | Especifica que sua pasta `schematics` contém os arquivos de entrada a serem compilados.               |
   | `outDir`  | Mapeia para a pasta de saída da biblioteca. Por padrão, esta é a pasta `dist/my-lib` na raiz de seu workspace. |

1. Para garantir que seus arquivos-fonte de schematics sejam compilados no pacote da biblioteca, adicione os seguintes scripts ao arquivo `package.json` na pasta raiz do projeto de sua biblioteca \(`projects/my-lib`\).

   <docs-code header="projects/my-lib/package.json (Build Scripts)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/package.json"/>
   - O script `build` compila seu schematic usando o arquivo personalizado `tsconfig.schematics.json`
   - O script `postbuild` copia os arquivos de schematic após a conclusão do script `build`
   - Tanto o script `build` quanto o `postbuild` requerem as dependências `copyfiles` e `typescript`.
     Para instalar as dependências, navegue até o caminho definido em `devDependencies` e execute `npm install` antes de executar os scripts.

## Fornecendo suporte de geração

Você pode adicionar um schematic nomeado à sua coleção que permite que seus usuários usem o comando `ng generate` para criar um artefato definido em sua biblioteca.

Vamos supor que sua biblioteca defina um service, `my-service`, que requer alguma configuração.
Você quer que seus usuários possam gerá-lo usando o seguinte comando CLI.

```shell

ng generate my-lib:my-service

```

Para começar, crie uma nova subpasta, `my-service`, na pasta `schematics`.

### Configurar o novo schematic

Quando você adiciona um schematic à coleção, você precisa apontá-lo no schema da coleção e fornecer arquivos de configuração para definir opções que um usuário pode passar ao comando.

1. Edite o arquivo `schematics/collection.json` para apontar para a nova subpasta de schematic e incluir um ponteiro para um arquivo de schema que especifica entradas para o novo schematic.

<docs-code header="projects/my-lib/schematics/collection.json (Schematics Collection)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/collection.json"/>

1. Vá para a pasta `<lib-root>/schematics/my-service`.
1. Crie um arquivo `schema.json` e defina as opções disponíveis para o schematic.

   <docs-code header="projects/my-lib/schematics/my-service/schema.json (Schematic JSON Schema)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/schema.json"/>
   - _id_: Um ID único para o schema na coleção.
   - _title_: Uma descrição legível do schema.
   - _type_: Um descritor para o tipo fornecido pelas propriedades.
   - _properties_: Um objeto que define as opções disponíveis para o schematic.

   Cada opção associa uma chave com um tipo, descrição e alias opcional.
   O tipo define a forma do valor que você espera, e a descrição é exibida quando o usuário solicita ajuda de uso para seu schematic.

   Veja o schema do workspace para personalizações adicionais para opções de schematic.

1. Crie um arquivo `schema.ts` e defina uma interface que armazena os valores das opções definidas no arquivo `schema.json`.

   <docs-code header="projects/my-lib/schematics/my-service/schema.ts (Schematic Interface)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/schema.ts"/>

   | Opções  | Detalhes                                                                                                                        |
   | :------ | :------------------------------------------------------------------------------------------------------------------------------ |
   | name    | O nome que você deseja fornecer para o service criado.                                                                          |
   | path    | Substitui o caminho fornecido ao schematic. O valor padrão do caminho é baseado no diretório de trabalho atual.                |
   | project | Fornece um projeto específico para executar o schematic. No schematic, você pode fornecer um padrão se a opção não for fornecida pelo usuário. |

### Adicionar arquivos de template

Para adicionar artefatos a um projeto, seu schematic precisa de seus próprios arquivos de template.
Templates de schematic suportam sintaxe especial para executar código e substituição de variáveis.

1. Crie uma pasta `files/` dentro da pasta `schematics/my-service/`.
1. Crie um arquivo chamado `__name@dasherize__.service.ts.template` que define um template a ser usado para gerar arquivos.
   Este template gerará um service que já tem o `HttpClient` do Angular injetado em uma propriedade `http`.

   <docs-code lang="typescript" header="projects/my-lib/schematics/my-service/files/__name@dasherize__.service.ts.template (Schematic Template)">

   import { Injectable } from '@angular/core';
   import { HttpClient } from '@angular/common/http';

   @Injectable({
   providedIn: 'root'
   })
   export class <%= classify(name) %>Service {
   private http = inject(HttpClient);
   }

   </docs-code>
   - Os métodos `classify` e `dasherize` são funções utilitárias que seu schematic usa para transformar seu template de origem e nome de arquivo.
   - O `name` é fornecido como uma propriedade de sua função factory.
     É o mesmo `name` que você definiu no schema.

### Adicionar a função factory

Agora que você tem a infraestrutura em vigor, pode definir a função principal que executa as modificações necessárias no projeto do usuário.

O framework Schematics fornece um sistema de template de arquivo, que suporta templates de caminho e conteúdo.
O sistema opera em placeholders definidos dentro de arquivos ou caminhos que são carregados na `Tree` de entrada.
Ele os preenche usando valores passados para a `Rule`.

Para detalhes dessas estruturas de dados e sintaxe, veja o [Schematics README](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/schematics/README.md).

1. Crie o arquivo principal `index.ts` e adicione o código-fonte para sua função factory de schematic.
1. Primeiro, importe as definições de schematics que você precisará.
   O framework Schematics oferece muitas funções utilitárias para criar e usar regras ao executar um schematic.

<docs-code header="projects/my-lib/schematics/my-service/index.ts (Imports)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" visibleRegion="schematics-imports"/>

1. Importe a interface de schema definida que fornece as informações de tipo para as opções do seu schematic.

<docs-code header="projects/my-lib/schematics/my-service/index.ts (Schema Import)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" visibleRegion="schema-imports"/>

1. Para construir o schematic de geração, comece com uma rule factory vazia.

<docs-code header="projects/my-lib/schematics/my-service/index.ts (Initial Rule)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.1.ts" visibleRegion="factory"/>

Esta rule factory retorna a tree sem modificação.
As opções são os valores de opção passados através do comando `ng generate`.

## Definir uma regra de geração

Agora você tem a estrutura em vigor para criar o código que realmente modifica a aplicação do usuário para configurá-la para o service definido em sua biblioteca.

O workspace Angular onde o usuário instalou sua biblioteca contém múltiplos projetos \(aplicações e bibliotecas\).
O usuário pode especificar o projeto na linha de comando ou deixá-lo como padrão.
Em qualquer caso, seu código precisa identificar o projeto específico ao qual este schematic está sendo aplicado, para que você possa recuperar informações da configuração do projeto.

Faça isso usando o objeto `Tree` que é passado para a função factory.
Os métodos de `Tree` dão acesso à árvore de arquivos completa em seu workspace, permitindo que você leia e escreva arquivos durante a execução do schematic.

### Obter a configuração do projeto

1. Para determinar o projeto de destino, use o método `workspaces.readWorkspace` para ler o conteúdo do arquivo de configuração do workspace, `angular.json`.
   Para usar `workspaces.readWorkspace` você precisa criar um `workspaces.WorkspaceHost` a partir da `Tree`.
   Adicione o seguinte código à sua função factory.

   <docs-code header="projects/my-lib/schematics/my-service/index.ts (Schema Import)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" visibleRegion="workspace"/>

   Certifique-se de verificar que o contexto existe e lançar o erro apropriado.

1. Agora que você tem o nome do projeto, use-o para recuperar as informações de configuração específicas do projeto.

   <docs-code header="projects/my-lib/schematics/my-service/index.ts (Project)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" visibleRegion="project-info"/>

   O objeto `workspace.projects` contém todas as informações de configuração específicas do projeto.

1. O `options.path` determina para onde os arquivos de template do schematic são movidos uma vez que o schematic é aplicado.

   A opção `path` no schema do schematic é substituída por padrão pelo diretório de trabalho atual.
   Se o `path` não estiver definido, use o `sourceRoot` da configuração do projeto junto com o `projectType`.

   <docs-code header="projects/my-lib/schematics/my-service/index.ts (Project Info)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" visibleRegion="path"/>

### Definir a regra

Uma `Rule` pode usar arquivos de template externos, transformá-los e retornar outro objeto `Rule` com o template transformado.
Use o templating para gerar quaisquer arquivos personalizados necessários para seu schematic.

1. Adicione o seguinte código à sua função factory.

   <docs-code header="projects/my-lib/schematics/my-service/index.ts (Template transform)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" visibleRegion="template"/>

   | Métodos            | Detalhes                                                                                                                                                                                                                     |
   | :----------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | `apply()`          | Aplica múltiplas regras a uma fonte e retorna a fonte transformada. Recebe 2 argumentos, uma fonte e um array de regras.                                                                                                    |
   | `url()`            | Lê arquivos-fonte do seu sistema de arquivos, relativo ao schematic.                                                                                                                                                         |
   | `applyTemplates()` | Recebe um argumento de métodos e propriedades que você deseja disponibilizar ao template do schematic e aos nomes de arquivo do schematic. Retorna uma `Rule`. É aqui que você define os métodos `classify()` e `dasherize()`, e a propriedade `name`. |
   | `classify()`       | Recebe um valor e retorna o valor em title case. Por exemplo, se o nome fornecido é `my service`, é retornado como `MyService`.                                                                                              |
   | `dasherize()`      | Recebe um valor e retorna o valor em dashed e minúsculas. Por exemplo, se o nome fornecido é MyService, é retornado como `my-service`.                                                                                       |
   | `move()`           | Move os arquivos-fonte fornecidos para seu destino quando o schematic é aplicado.                                                                                                                                            |

1. Finalmente, a rule factory deve retornar uma regra.

   <docs-code header="projects/my-lib/schematics/my-service/index.ts (Chain Rule)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" visibleRegion="chain"/>

   O método `chain()` permite combinar múltiplas regras em uma única regra, para que você possa executar múltiplas operações em um único schematic.
   Aqui você está apenas mesclando as regras de template com qualquer código executado pelo schematic.

Veja um exemplo completo da seguinte função de regra de schematic.

<docs-code header="projects/my-lib/schematics/my-service/index.ts" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts"/>

Para mais informações sobre regras e métodos utilitários, veja [Provided Rules](https://github.com/angular/angular-cli/tree/main/packages/angular_devkit/schematics#provided-rules).

## Executando seu schematic de biblioteca

Depois de construir sua biblioteca e schematics, você pode instalar a coleção de schematics para executar contra seu projeto.
Os passos a seguir mostram como gerar um service usando o schematic que você criou anteriormente.

### Construir sua biblioteca e schematics

Da raiz de seu workspace, execute o comando `ng build` para sua biblioteca.

```shell

ng build my-lib

```

Então, você muda para o diretório de sua biblioteca para construir o schematic

```shell

cd projects/my-lib
npm run build

```

### Fazer link da biblioteca

Sua biblioteca e schematics são empacotados e colocados na pasta `dist/my-lib` na raiz de seu workspace.
Para executar o schematic, você precisa fazer link da biblioteca em sua pasta `node_modules`.
Da raiz de seu workspace, execute o comando `npm link` com o caminho para sua biblioteca distribuível.

```shell

npm link dist/my-lib

```

### Executar o schematic

Agora que sua biblioteca está instalada, execute o schematic usando o comando `ng generate`.

```shell

ng generate my-lib:my-service --name my-data

```

No console, você vê que o schematic foi executado e o arquivo `my-data.service.ts` foi criado na pasta de sua aplicação.

<docs-code language="shell" hideCopy>

CREATE src/app/my-data.service.ts (208 bytes)

</docs-code>
