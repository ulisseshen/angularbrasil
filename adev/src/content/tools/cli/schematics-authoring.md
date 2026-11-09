<!-- ia-translate: true -->
# Criando schematics {#authoring-schematics}

Você pode criar seus próprios schematics para operar em projetos Angular.
Desenvolvedores de bibliotecas geralmente empacotam schematics com suas bibliotecas para integrá-las ao Angular CLI.
Você também pode criar schematics independentes para manipular os arquivos e construções em aplicações Angular, como uma forma de personalizá-las para o seu ambiente de desenvolvimento e fazê-las seguir seus padrões e restrições.
Schematics podem ser encadeados, executando outros schematics para realizar operações complexas.

Manipular o código de uma aplicação tem o potencial de ser muito poderoso e, na mesma medida, perigoso.
Por exemplo, criar um arquivo que já existe seria um erro, e se isso fosse aplicado imediatamente, descartaria todas as outras mudanças aplicadas até então.
As ferramentas do Angular Schematics protegem contra efeitos colaterais e erros criando um sistema de arquivos virtual.
Um schematic descreve um pipeline de transformações que podem ser aplicadas ao sistema de arquivos virtual.
Quando um schematic é executado, as transformações são registradas na memória e só são aplicadas no sistema de arquivos real depois de confirmadas como válidas.

## Conceitos de schematics {#schematics-concepts}

A API pública para schematics define classes que representam os conceitos básicos.

- O sistema de arquivos virtual é representado por uma `Tree`.
  A estrutura de dados `Tree` contém uma _base_ \(um conjunto de arquivos que já existe\) e uma _área de staging_ \(uma lista de mudanças a serem aplicadas à base\).
  Ao fazer modificações, você não altera a base de fato, mas adiciona essas modificações à área de staging.

- Um `Rule` é um objeto que define uma função que recebe uma `Tree`, aplica transformações e retorna uma nova `Tree`.
  O arquivo principal de um schematic, `index.ts`, define um conjunto de regras que implementam a lógica do schematic.

- Uma transformação é representada por uma `Action`.
  Existem quatro tipos de action: `Create`, `Rename`, `Overwrite` e `Delete`.

- Cada schematic é executado em um contexto, representado por um objeto `SchematicContext`.

O objeto de contexto passado para uma regra dá acesso a funções utilitárias e metadados de que o schematic pode precisar, incluindo uma API de logging para ajudar na depuração.
O contexto também define uma _estratégia de merge_, que determina como as mudanças são mescladas da árvore de staging para a árvore base.
Uma mudança pode ser aceita, ignorada ou gerar uma exceção.

### Definindo regras e ações {#defining-rules-and-actions}

Quando você cria um novo schematic em branco com o [Schematics CLI](#schematics-cli), a função de entrada gerada é uma _rule factory_.
Um `RuleFactory` é um objeto que define uma função de ordem superior que cria uma `Rule`.

```ts {header: "index.ts"}
import {Rule, SchematicContext, Tree} from '@angular-devkit/schematics';

// Você não precisa exportar a função como default.
// Você também pode ter mais de uma rule factory por arquivo.
export function helloWorld(_options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    return tree;
  };
}
```

Suas regras podem fazer alterações nos seus projetos chamando ferramentas externas e implementando lógica.
Você precisa de uma regra, por exemplo, para definir como um template do schematic será mesclado ao projeto hospedeiro.

As regras podem usar utilitários fornecidos com o pacote `@schematics/angular`.
Procure funções auxiliares para trabalhar com modules, dependências, TypeScript, AST, JSON, workspaces e projetos do Angular CLI, e muito mais.

```ts {header: "index.ts"}
import {
  JsonAstObject,
  JsonObject,
  JsonValue,
  Path,
  normalize,
  parseJsonAst,
  strings,
} from '@angular-devkit/core';
```

### Definindo opções de entrada com um schema e interfaces {#defining-input-options-with-a-schema-and-interfaces}

As regras podem coletar valores de opções do chamador e injetá-los em templates.
As opções disponíveis para suas regras, com seus valores permitidos e padrões, são definidas no arquivo de schema JSON do schematic, `<schematic>/schema.json`.
Defina tipos de dados variáveis ou enumerados para o schema usando interfaces TypeScript.

O schema define os tipos e valores padrão das variáveis usadas no schematic.
Por exemplo, o schematic hipotético "Hello World" pode ter o seguinte schema.

```json {header: "schema.json"}
{
  "properties": {
    "name": {
      "type": "string",
      "minLength": 1,
      "default": "world"
    },
    "useColor": {
      "type": "boolean"
    }
  }
}
```

Veja exemplos de arquivos de schema dos schematics de comandos do Angular CLI em [`@schematics/angular`](https://github.com/angular/angular-cli/blob/main/packages/schematics/angular/application/schema.json).

### Prompts de schematic {#schematic-prompts}

_Prompts_ de schematic introduzem interação com o usuário na execução do schematic.
Configure as opções do schematic para exibir uma pergunta personalizável ao usuário.
Os prompts são exibidos antes da execução do schematic, que então usa a resposta como valor para a opção.
Isso permite que os usuários direcionem a operação do schematic sem exigir conhecimento profundo de todo o espectro de opções disponíveis.

O schematic "Hello World" pode, por exemplo, perguntar o nome do usuário e exibir esse nome no lugar do nome padrão "world".
Para definir esse prompt, adicione uma propriedade `x-prompt` ao schema para a variável `name`.

Da mesma forma, você pode adicionar um prompt para permitir que o usuário decida se o schematic usa cor ao executar sua ação hello.
O schema com os dois prompts ficaria assim.

```json {header: "schema.json"}
{
  "properties": {
    "name": {
      "type": "string",
      "minLength": 1,
      "default": "world",
      "x-prompt": "What is your name?"
    },
    "useColor": {
      "type": "boolean",
      "x-prompt": "Would you like the response in color?"
    }
  }
}
```

#### Sintaxe abreviada de prompt {#prompt-short-form-syntax}

Estes exemplos usam a forma abreviada da sintaxe de prompt, que fornece apenas o texto da pergunta.
Na maioria dos casos, isso é tudo o que é necessário.
Note, porém, que os dois prompts esperam tipos diferentes de entrada.
Na forma abreviada, o tipo mais apropriado é selecionado automaticamente com base no schema da propriedade.
No exemplo, o prompt `name` usa o tipo `input` porque é uma propriedade string.
O prompt `useColor` usa o tipo `confirmation` porque é uma propriedade Boolean.
Neste caso, "yes" corresponde a `true` e "no" corresponde a `false`.

Existem três tipos de entrada suportados.

| Tipo de entrada | Detalhes                                             |
| :-------------- | :--------------------------------------------------- |
| confirmation    | Uma pergunta de sim ou não; ideal para opções Boolean. |
| input           | Entrada textual; ideal para opções string ou number. |
| list            | Um conjunto predefinido de valores permitidos.       |

Na forma abreviada, o tipo é inferido a partir do tipo e das restrições da propriedade.

| Schema da propriedade | Tipo de prompt                                       |
| :-------------------- | :--------------------------------------------------- |
| "type": "boolean"     | confirmation \("yes"=`true`, "no"=`false`\)          |
| "type": "string"      | input                                                |
| "type": "number"      | input \(apenas números válidos são aceitos\)         |
| "type": "integer"     | input \(apenas números válidos são aceitos\)         |
| "enum": […]           | list \(os membros do enum se tornam seleções da lista\) |

No exemplo a seguir, a propriedade recebe um valor enumerado, então o schematic escolhe automaticamente o tipo list e cria um menu a partir dos valores possíveis.

```json {header: "schema.json"}
{
  "style": {
    "description": "The file extension or preprocessor to use for style files.",
    "type": "string",
    "default": "css",
    "enum": ["css", "scss", "sass", "less", "styl"],
    "x-prompt": "Which stylesheet format would you like to use?"
  }
}
```

O runtime do prompt valida automaticamente a resposta fornecida contra as restrições definidas no schema JSON.
Se o valor não for aceitável, o usuário é solicitado a informar um novo valor.
Isso garante que quaisquer valores passados ao schematic atendam às expectativas da implementação do schematic, de modo que você não precisa adicionar verificações extras no código do schematic.

#### Sintaxe longa de prompt {#prompt-long-form-syntax}

A sintaxe do campo `x-prompt` oferece uma forma longa para os casos em que você precisa de mais personalização e controle sobre o prompt.
Nessa forma, o valor do campo `x-prompt` é um objeto JSON com subcampos que personalizam o comportamento do prompt.

| Campo   | Valor de dados                                                                        |
| :------ | :------------------------------------------------------------------------------------ |
| type    | `confirmation`, `input` ou `list` \(selecionado automaticamente na forma abreviada\)  |
| message | string \(obrigatório\)                                                                |
| items   | string e/ou par de objeto label/value \(válido apenas com type `list`\)               |

O exemplo a seguir da forma longa vem do schema JSON do schematic que o CLI usa para [gerar aplicações](https://github.com/angular/angular-cli/blob/ba8a6ea59983bb52a6f1e66d105c5a77517f062e/packages/schematics/angular/application/schema.json#L56).
Ele define o prompt que permite aos usuários escolher qual pré-processador de estilo querem usar para a aplicação sendo criada.
Ao usar a forma longa, o schematic pode fornecer uma formatação mais explícita das opções do menu.

```json {header: "schema.json"}
{
  "style": {
    "description": "The file extension or preprocessor to use for style files.",
    "type": "string",
    "default": "css",
    "enum": ["css", "scss", "sass", "less"],
    "x-prompt": {
      "message": "Which stylesheet format would you like to use?",
      "type": "list",
      "items": [
        {"value": "css", "label": "CSS"},
        {"value": "scss", "label": "SCSS [ https://sass-lang.com/documentation/syntax#scss ]"},
        {
          "value": "sass",
          "label": "Sass [ https://sass-lang.com/documentation/syntax#the-indented-syntax ]"
        },
        {"value": "less", "label": "Less [ https://lesscss.org/ ]"}
      ]
    }
  }
}
```

#### Schema do x-prompt {#x-prompt-schema}

O schema JSON que define as opções de um schematic oferece suporte a extensões que permitem a definição declarativa de prompts e do seu comportamento.
Nenhuma lógica adicional ou mudança no código do schematic é necessária para oferecer suporte aos prompts.
O schema JSON a seguir é uma descrição completa da sintaxe longa do campo `x-prompt`.

```json {header: "x-prompt schema"}
{
  "oneOf": [
    {
      "type": "string"
    },
    {
      "type": "object",
      "properties": {
        "type": {
          "type": "string"
        },
        "message": {
          "type": "string"
        },
        "items": {
          "type": "array",
          "items": {
            "oneOf": [
              {
                "type": "string"
              },
              {
                "type": "object",
                "properties": {
                  "label": {
                    "type": "string"
                  },
                  "value": {}
                },
                "required": ["value"]
              }
            ]
          }
        }
      },
      "required": ["message"]
    }
  ]
}
```

## Schematics CLI

Schematics vêm com sua própria ferramenta de linha de comando.
Instale a ferramenta de linha de comando do Schematics globalmente:

```shell

npm install -g @angular-devkit/schematics-cli

```

Isso instala o executável `schematics`, que você pode usar para criar uma nova coleção de schematics em sua própria pasta de projeto, adicionar um novo schematic a uma coleção existente ou estender um schematic existente.

Nas seções a seguir, você criará uma nova coleção de schematics usando o CLI para conhecer os arquivos, a estrutura de arquivos e alguns dos conceitos básicos.

O uso mais comum de schematics, porém, é integrar uma biblioteca Angular ao Angular CLI.
Faça isso criando os arquivos do schematic diretamente dentro do projeto da biblioteca em um workspace Angular, sem usar o Schematics CLI.
Veja [Schematics para bibliotecas](tools/cli/schematics-for-libraries).

### Criando uma coleção de schematics {#creating-a-schematics-collection}

O comando a seguir cria um novo schematic chamado `hello-world` em uma nova pasta de projeto de mesmo nome.

```shell

schematics blank --name=hello-world

```

O schematic `blank` é fornecido pelo Schematics CLI.
O comando cria uma nova pasta de projeto (a pasta raiz da coleção) e um schematic inicial nomeado dentro da coleção.

Vá até a pasta da coleção, instale suas dependências npm e abra sua nova coleção no seu editor favorito para ver os arquivos gerados.
Por exemplo, se você estiver usando o VS Code:

```shell

cd hello-world
npm install
npm run build
code .

```

O schematic inicial recebe o mesmo nome da pasta do projeto e é gerado em `src/hello-world`.
Adicione schematics relacionados a esta coleção e modifique o código esqueleto gerado para definir a funcionalidade do seu schematic.
Cada nome de schematic deve ser único dentro da coleção.

### Executando um schematic {#running-a-schematic}

Use o comando `schematics` para executar um schematic nomeado.
Forneça o caminho para a pasta do projeto, o nome do schematic e quaisquer opções obrigatórias, no formato a seguir.

```shell

schematics <path-to-schematics-project>:<schematics-name> --<required-option>=<value>

```

O caminho pode ser absoluto ou relativo ao diretório de trabalho atual, onde o comando é executado.
Por exemplo, para executar o schematic que você acabou de gerar (que não tem opções obrigatórias), use o seguinte comando.

```shell

schematics .:hello-world

```

### Adicionando um schematic a uma coleção {#adding-a-schematic-to-a-collection}

Para adicionar um schematic a uma coleção existente, use o mesmo comando que você usa para iniciar um novo projeto de schematics, mas execute-o dentro da pasta do projeto.

```shell

cd hello-world
schematics blank --name=goodbye-world

```

O comando gera o novo schematic nomeado dentro da sua coleção, com um arquivo principal `index.ts` e sua spec de teste associada.
Ele também adiciona o nome, a descrição e a função factory do novo schematic ao schema da coleção, no arquivo `collection.json`.

## Conteúdo da coleção {#collection-contents}

O nível superior da pasta raiz do projeto de uma coleção contém arquivos de configuração, uma pasta `node_modules` e uma pasta `src/`.
A pasta `src/` contém subpastas para os schematics nomeados da coleção e um schema, `collection.json`, que descreve os schematics da coleção.
Cada schematic é criado com um nome, uma descrição e uma função factory.

```json

{
  "$schema": "../node_modules/@angular-devkit/schematics/collection-schema.json",
  "schematics": {
    "hello-world": {
      "description": "A blank schematic.",
      "factory": "./hello-world/index#helloWorld"
    }
  }
}

```

- A propriedade `$schema` especifica o schema que o CLI usa para validação.
- A propriedade `schematics` lista os schematics nomeados que pertencem a esta coleção.
  Cada schematic tem uma descrição em texto simples e aponta para a função de entrada gerada no arquivo principal.

- A propriedade `factory` aponta para a função de entrada gerada.
  Neste exemplo, você invoca o schematic `hello-world` chamando a função factory `helloWorld()`.

- A propriedade opcional `schema` aponta para um arquivo de schema JSON que define as opções de linha de comando disponíveis para o schematic.
- O array opcional `aliases` especifica uma ou mais strings que podem ser usadas para invocar o schematic.
  Por exemplo, o schematic do comando "generate" do Angular CLI tem o alias "g", que permite usar o comando `ng g`.

### Schematics nomeados {#named-schematics}

Quando você usa o Schematics CLI para criar um projeto de schematics em branco, o novo schematic em branco é o primeiro membro da coleção e tem o mesmo nome da coleção.
Quando você adiciona um novo schematic nomeado a esta coleção, ele é automaticamente incluído no schema `collection.json`.

Além do nome e da descrição, cada schematic tem uma propriedade `factory` que identifica o ponto de entrada do schematic.
No exemplo, você invoca a funcionalidade definida do schematic chamando a função `helloWorld()` no arquivo principal, `hello-world/index.ts`.

<img alt="visão geral" src="assets/images/guide/schematics/collection-files.gif">

Cada schematic nomeado na coleção tem as seguintes partes principais.

| Partes        | Detalhes                                                               |
| :------------ | :--------------------------------------------------------------------- |
| `index.ts`    | Código que define a lógica de transformação para um schematic nomeado. |
| `schema.json` | Definição das variáveis do schematic.                                  |
| `schema.d.ts` | Variáveis do schematic.                                                |
| `files/`      | Arquivos opcionais de component/template para replicar.                |

É possível que um schematic forneça toda a sua lógica no arquivo `index.ts`, sem templates adicionais.
Você pode criar schematics dinâmicos para Angular, porém, fornecendo components e templates na pasta `files`, como os de projetos Angular independentes.
A lógica no arquivo index configura esses templates definindo regras que injetam dados e modificam variáveis.
