<!-- ia-translate: true -->
# Schematics para bibliotecas {#schematics-for-libraries}

Quando você cria uma biblioteca Angular, pode fornecê-la e empacotá-la com schematics que a integram ao Angular CLI.
Com seus schematics, seus usuários podem usar `ng add` para instalar uma versão inicial da sua biblioteca,
`ng generate` para criar artefatos definidos na sua biblioteca e `ng update` para ajustar o projeto deles para uma nova versão da sua biblioteca que introduz mudanças incompatíveis.

Todos os três tipos de schematics podem fazer parte de uma coleção que você empacota com sua biblioteca.

## Criando uma coleção de schematics {#creating-a-schematics-collection}

Para iniciar uma coleção, você precisa criar os arquivos de schematic.
Os passos a seguir mostram como adicionar suporte inicial sem modificar nenhum arquivo do projeto.

1. Na pasta raiz da sua biblioteca, crie uma pasta `schematics`.
1. Na pasta `schematics/`, crie uma pasta `ng-add` para o seu primeiro schematic.
1. No nível raiz da pasta `schematics`, crie um arquivo `collection.json`.
1. Edite o arquivo `collection.json` para definir o schema inicial da sua coleção.

   <docs-code header="projects/my-lib/schematics/collection.json (Coleção de Schematics)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/collection.1.json"/>
   - O caminho `$schema` é relativo ao schema de coleção do Angular Devkit.
   - O objeto `schematics` descreve os schematics nomeados que fazem parte desta coleção.
   - A primeira entrada é para um schematic chamado `ng-add`.
     Ela contém a descrição e aponta para a função factory que é chamada quando o seu schematic é executado.

1. No arquivo `package.json` do projeto da sua biblioteca, adicione uma entrada "schematics" com o caminho para o arquivo de schema.
   O Angular CLI usa essa entrada para encontrar os schematics nomeados na sua coleção quando executa comandos.

<docs-code header="projects/my-lib/package.json (Referência da Coleção de Schematics)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/package.json" region="collection"/>

O schema inicial que você criou diz ao CLI onde encontrar o schematic que dá suporte ao comando `ng add`.
Agora você está pronto para criar esse schematic.

## Fornecendo suporte à instalação {#providing-installation-support}

Um schematic para o comando `ng add` pode aprimorar o processo de instalação inicial para os seus usuários.
Os passos a seguir definem esse tipo de schematic.

1. Vá para a pasta `<lib-root>/schematics/ng-add`.
1. Crie um arquivo `schema.json` para definir as opções que o schematic aceita.

   <docs-code header="projects/my-lib/schematics/ng-add/schema.json (Schema do ng-add)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/ng-add/schema.json"/>

1. Crie um arquivo `schema.ts` para definir uma interface para as opções definidas no arquivo `schema.json`.

   <docs-code header="projects/my-lib/schematics/ng-add/schema.ts (Interface do Schema do ng-add)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/ng-add/schema.ts"/>

1. Crie o arquivo principal, `index.ts`, e adicione o código-fonte da função factory do seu schematic.

   <docs-code header="projects/my-lib/schematics/ng-add/index.ts (Rule Factory do ng-add)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/ng-add/index.ts"/>

O Angular CLI instalará automaticamente a versão mais recente da biblioteca, e este exemplo vai um passo além ao adicionar o `MyLibModule` à raiz da aplicação. A função `addRootImport` aceita um callback que precisa retornar um bloco de código. Você pode escrever qualquer código dentro da string marcada com a função `code`, e qualquer símbolo externo precisa ser envolvido com a função `external` para garantir que as instruções de import apropriadas sejam geradas.

### Definir tipo de dependência {#define-dependency-type}

Use a opção `save` do `ng-add` para configurar se a biblioteca deve ser adicionada às `dependencies`, às `devDependencies` ou não ser salva no arquivo de configuração `package.json` do projeto.

<docs-code header="projects/my-lib/package.json (Referência do ng-add)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/package.json" region="ng-add"/>

Os valores possíveis são:

| Valores             | Detalhes                                 |
| :------------------ | :--------------------------------------- |
| `false`             | Não adiciona o pacote ao `package.json`  |
| `true`              | Adiciona o pacote às dependencies        |
| `"dependencies"`    | Adiciona o pacote às dependencies        |
| `"devDependencies"` | Adiciona o pacote às devDependencies     |

## Construindo seus schematics {#building-your-schematics}

Para empacotar seus schematics junto com a sua biblioteca, você deve configurar a biblioteca para construir os schematics separadamente e depois adicioná-los ao pacote.
Você deve construir os schematics _depois_ de construir a biblioteca, para que sejam colocados no diretório correto.

- Sua biblioteca precisa de um arquivo de configuração TypeScript personalizado com instruções sobre como compilar seus schematics na biblioteca distribuída
- Para adicionar os schematics ao pacote da biblioteca, adicione scripts ao arquivo `package.json` da biblioteca

Suponha que você tenha uma biblioteca `my-lib` no seu workspace Angular.
Para dizer à biblioteca como construir os schematics, adicione um arquivo `tsconfig.schematics.json` ao lado do arquivo `tsconfig.lib.json` gerado, que configura o build da biblioteca.

1. Edite o arquivo `tsconfig.schematics.json` para adicionar o seguinte conteúdo.

   <docs-code header="projects/my-lib/tsconfig.schematics.json (Configuração TypeScript)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/tsconfig.schematics.json"/>

   | Opções    | Detalhes                                                                                                         |
   | :-------- | :--------------------------------------------------------------------------------------------------------------- |
   | `rootDir` | Especifica que sua pasta `schematics` contém os arquivos de entrada a serem compilados.                          |
   | `outDir`  | Aponta para a pasta de saída da biblioteca. Por padrão, é a pasta `dist/my-lib` na raiz do seu workspace.        |

1. Para garantir que os arquivos-fonte dos seus schematics sejam compilados no pacote da biblioteca, adicione os seguintes scripts ao arquivo `package.json` na pasta raiz do projeto da sua biblioteca \(`projects/my-lib`\).

   <docs-code header="projects/my-lib/package.json (Scripts de Build)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/package.json"/>
   - O script `build` compila seu schematic usando o arquivo personalizado `tsconfig.schematics.json`
   - O script `postbuild` copia os arquivos de schematic após a conclusão do script `build`
   - Tanto o script `build` quanto o `postbuild` exigem as dependências `copyfiles` e `typescript`.
     Para instalar as dependências, acesse o caminho definido em `devDependencies` e execute `npm install` antes de executar os scripts.

## Fornecendo suporte à geração {#providing-generation-support}

Você pode adicionar um schematic nomeado à sua coleção que permite que seus usuários usem o comando `ng generate` para criar um artefato definido na sua biblioteca.

Vamos supor que sua biblioteca defina um service, `my-service`, que requer alguma configuração.
Você quer que seus usuários possam gerá-lo usando o seguinte comando do CLI.

```shell

ng generate my-lib:my-service

```

Para começar, crie uma nova subpasta, `my-service`, na pasta `schematics`.

### Configurar o novo schematic {#configure-the-new-schematic}

Ao adicionar um schematic à coleção, você precisa apontá-lo no schema da coleção e fornecer arquivos de configuração para definir as opções que um usuário pode passar ao comando.

1. Edite o arquivo `schematics/collection.json` para apontar para a nova subpasta do schematic e incluir uma referência a um arquivo de schema que especifica as entradas do novo schematic.

   <docs-code header="projects/my-lib/schematics/collection.json (Coleção de Schematics)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/collection.json"/>

1. Vá para a pasta `<lib-root>/schematics/my-service`.
1. Crie um arquivo `schema.json` e defina as opções disponíveis para o schematic.

   <docs-code header="projects/my-lib/schematics/my-service/schema.json (JSON Schema do Schematic)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/schema.json"/>
   - _id_: Um ID único para o schema na coleção.
   - _title_: Uma descrição legível do schema.
   - _type_: Um descritor para o tipo fornecido pelas propriedades.
   - _properties_: Um objeto que define as opções disponíveis para o schematic.

   Cada opção associa uma chave a um tipo, uma descrição e um alias opcional.
   O tipo define o formato do valor esperado, e a descrição é exibida quando o usuário solicita ajuda de uso para o seu schematic.

   Veja o schema do workspace para personalizações adicionais das opções de schematic.

1. Crie um arquivo `schema.ts` e defina uma interface que armazena os valores das opções definidas no arquivo `schema.json`.

   <docs-code header="projects/my-lib/schematics/my-service/schema.ts (Interface do Schematic)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/schema.ts"/>

   | Opções  | Detalhes                                                                                                                                       |
   | :------ | :--------------------------------------------------------------------------------------------------------------------------------------------- |
   | name    | O nome que você deseja dar ao service criado.                                                                                                  |
   | path    | Substitui o caminho fornecido ao schematic. O valor padrão do caminho é baseado no diretório de trabalho atual.                                |
   | project | Fornece um projeto específico no qual executar o schematic. No schematic, você pode definir um padrão caso a opção não seja fornecida pelo usuário. |

### Adicionar arquivos de template {#add-template-files}

Para adicionar artefatos a um projeto, seu schematic precisa dos seus próprios arquivos de template.
Templates de schematic suportam uma sintaxe especial para executar código e substituir variáveis.

1. Crie uma pasta `files/` dentro da pasta `schematics/my-service/`.
1. Crie um arquivo chamado `__name@dasherize__.service.ts.template` que define um template a ser usado para gerar arquivos.
   Este template vai gerar um service que já tem o `HttpClient` do Angular injetado em uma propriedade `http`.

   ```ts {header: "projects/my-lib/schematics/my-service/files/__name@dasherize__.service.ts.template (Template do Schematic)"}

   import { Service } from '@angular/core';
   import { HttpClient } from '@angular/common/http';

   @Service()
   export class <%= classify(name) %>Service {
      private http = inject(HttpClient);
   }

   ```

   - Os métodos `classify` e `dasherize` são funções utilitárias que seu schematic usa para transformar o template de origem e o nome do arquivo.
   - O `name` é fornecido como uma propriedade da sua função factory.
     É o mesmo `name` que você definiu no schema.

### Adicionar a função factory {#add-the-factory-function}

Agora que a infraestrutura está no lugar, você pode definir a função principal que executa as modificações necessárias no projeto do usuário.

O framework Schematics fornece um sistema de templates de arquivo, que suporta templates de caminho e de conteúdo.
O sistema opera sobre placeholders definidos dentro de arquivos ou caminhos carregados na `Tree` de entrada.
Ele os preenche usando valores passados para a `Rule`.

Para detalhes dessas estruturas de dados e da sintaxe, veja o [README do Schematics](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/schematics/README.md).

1. Crie o arquivo principal `index.ts` e adicione o código-fonte da sua função factory de schematic.
1. Primeiro, importe as definições de schematics de que você vai precisar.
   O framework Schematics oferece muitas funções utilitárias para criar e usar regras ao executar um schematic.

   <docs-code header="projects/my-lib/schematics/my-service/index.ts (Imports)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="schematics-imports"/>

1. Importe a interface de schema definida, que fornece as informações de tipo para as opções do seu schematic.

   <docs-code header="projects/my-lib/schematics/my-service/index.ts (Import do Schema)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="schema-imports"/>

1. Para construir o schematic de geração, comece com uma rule factory vazia.

   <docs-code header="projects/my-lib/schematics/my-service/index.ts (Regra Inicial)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.1.ts" region="factory"/>

Esta rule factory retorna a tree sem modificação.
As opções são os valores passados pelo comando `ng generate`.

## Definir uma regra de geração {#define-a-generation-rule}

Agora você tem o framework no lugar para criar o código que de fato modifica a aplicação do usuário, configurando-a para o service definido na sua biblioteca.

O workspace Angular onde o usuário instalou sua biblioteca contém vários projetos (aplicações e bibliotecas).
O usuário pode especificar o projeto na linha de comando ou deixar o valor padrão.
Em qualquer caso, seu código precisa identificar o projeto específico ao qual este schematic está sendo aplicado, para que você possa recuperar informações da configuração do projeto.

Faça isso usando o objeto `Tree` que é passado para a função factory.
Os métodos de `Tree` dão acesso à árvore completa de arquivos do seu workspace, permitindo ler e escrever arquivos durante a execução do schematic.

### Obter a configuração do projeto {#get-the-project-configuration}

1. Para determinar o projeto de destino, use o método `workspaces.readWorkspace` para ler o conteúdo do arquivo de configuração do workspace, `angular.json`.
   Para usar `workspaces.readWorkspace`, você precisa criar um `workspaces.WorkspaceHost` a partir da `Tree`.
   Adicione o seguinte código à sua função factory.

   <docs-code header="projects/my-lib/schematics/my-service/index.ts (Import do Schema)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="workspace"/>

   Certifique-se de verificar se o contexto existe e de lançar o erro apropriado.

1. Agora que você tem o nome do projeto, use-o para recuperar as informações de configuração específicas do projeto.

   <docs-code header="projects/my-lib/schematics/my-service/index.ts (Projeto)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="project-info"/>

   O objeto `workspace.projects` contém todas as informações de configuração específicas de cada projeto.

1. O `options.path` determina para onde os arquivos de template do schematic são movidos depois que o schematic é aplicado.

   A opção `path` no schema do schematic é substituída, por padrão, pelo diretório de trabalho atual.
   Se o `path` não estiver definido, use o `sourceRoot` da configuração do projeto junto com o `projectType`.

   <docs-code header="projects/my-lib/schematics/my-service/index.ts (Informações do Projeto)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="path"/>

### Definir a regra {#define-the-rule}

Uma `Rule` pode usar arquivos de template externos, transformá-los e retornar outro objeto `Rule` com o template transformado.
Use o templating para gerar quaisquer arquivos personalizados necessários para o seu schematic.

1. Adicione o seguinte código à sua função factory.

   <docs-code header="projects/my-lib/schematics/my-service/index.ts (Transformação de Template)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="template"/>

   | Métodos            | Detalhes                                                                                                                                                                                                                                               |
   | :----------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | `apply()`          | Aplica múltiplas regras a uma origem e retorna a origem transformada. Recebe 2 argumentos, uma origem e um array de regras.                                                                                                                             |
   | `url()`            | Lê arquivos-fonte do seu sistema de arquivos, relativos ao schematic.                                                                                                                                                                                  |
   | `applyTemplates()` | Recebe um argumento com métodos e propriedades que você deseja disponibilizar para o template do schematic e para os nomes de arquivo do schematic. Retorna uma `Rule`. É aqui que você define os métodos `classify()` e `dasherize()`, e a propriedade `name`. |
   | `classify()`       | Recebe um valor e retorna o valor em title case. Por exemplo, se o nome fornecido for `my service`, ele é retornado como `MyService`.                                                                                                                   |
   | `dasherize()`      | Recebe um valor e retorna o valor em dashed e minúsculas. Por exemplo, se o nome fornecido for MyService, ele é retornado como `my-service`.                                                                                                           |
   | `move()`           | Move os arquivos-fonte fornecidos para o destino quando o schematic é aplicado.                                                                                                                                                                        |

1. Por fim, a rule factory deve retornar uma regra.

   <docs-code header="projects/my-lib/schematics/my-service/index.ts (Encadear Regras)" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts" region="chain"/>

   O método `chain()` permite combinar múltiplas regras em uma única regra, para que você possa executar várias operações em um único schematic.
   Aqui você está apenas mesclando as regras de template com qualquer código executado pelo schematic.

Veja um exemplo completo da função de regra do schematic a seguir.

<docs-code header="projects/my-lib/schematics/my-service/index.ts" path="adev/src/content/examples/schematics-for-libraries/projects/my-lib/schematics/my-service/index.ts"/>

Para mais informações sobre regras e métodos utilitários, veja [Provided Rules](https://github.com/angular/angular-cli/tree/main/packages/angular_devkit/schematics#provided-rules).

## Executando seu schematic de biblioteca {#running-your-library-schematic}

Depois de construir sua biblioteca e seus schematics, você pode instalar a coleção de schematics para executá-la no seu projeto.
Os passos a seguir mostram como gerar um service usando o schematic que você criou anteriormente.

### Construir sua biblioteca e schematics {#build-your-library-and-schematics}

Na raiz do seu workspace, execute o comando `ng build` para a sua biblioteca.

```shell

ng build my-lib

```

Em seguida, entre no diretório da sua biblioteca para construir o schematic

```shell

cd projects/my-lib
npm run build

```

### Vincular a biblioteca {#link-the-library}

Sua biblioteca e seus schematics são empacotados e colocados na pasta `dist/my-lib` na raiz do seu workspace.
Para executar o schematic, você precisa vincular a biblioteca na sua pasta `node_modules`.
Na raiz do seu workspace, execute o comando `npm link` com o caminho para a sua biblioteca distribuível.

```shell

npm link dist/my-lib

```

### Executar o schematic {#run-the-schematic}

Agora que sua biblioteca está instalada, execute o schematic usando o comando `ng generate`.

```shell

ng generate my-lib:my-service --name my-data

```

No console, você verá que o schematic foi executado e que o arquivo `my-data.service.ts` foi criado na pasta da sua aplicação.

```shell {hideCopy}

CREATE src/app/my-data.service.ts (208 bytes)

```
</content>
