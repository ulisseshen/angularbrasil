<!-- ia-translate: true -->

# Criando schematics

Você pode criar seus próprios schematics para operar em projetos Angular.
Desenvolvedores de bibliotecas geralmente empacotam schematics com suas bibliotecas para integrá-las ao Angular CLI.
Você também pode criar schematics independentes para manipular os arquivos e estruturas em aplicações Angular como uma forma de personalizá-las para seu ambiente de desenvolvimento e fazê-las conformar-se aos seus padrões e restrições.
Schematics podem ser encadeados, executando outros schematics para realizar operações complexas.

Manipular o código em uma aplicação tem o potencial de ser muito poderoso e correspondentemente perigoso.
Por exemplo, criar um arquivo que já existe seria um erro, e se fosse aplicado imediatamente, descartaria todas as outras mudanças aplicadas até agora.
A ferramenta Angular Schematics protege contra efeitos colaterais e erros criando um sistema de arquivos virtual.
Um schematic descreve um pipeline de transformações que podem ser aplicadas ao sistema de arquivos virtual.
Quando um schematic é executado, as transformações são registradas na memória e só são aplicadas no sistema de arquivos real quando confirmadas como válidas.

## Conceitos de schematics

A API pública para schematics define classes que representam os conceitos básicos.

- O sistema de arquivos virtual é representado por uma `Tree`.
  A estrutura de dados `Tree` contém uma _base_ \(um conjunto de arquivos que já existe\) e uma _área de staging_ \(uma lista de mudanças a serem aplicadas à base\).
  Ao fazer modificações, você não altera realmente a base, mas adiciona essas modificações à área de staging.

- Um objeto `Rule` define uma função que recebe uma `Tree`, aplica transformações e retorna uma nova `Tree`.
  O arquivo principal de um schematic, `index.ts`, define um conjunto de regras que implementam a lógica do schematic.

- Uma transformação é representada por uma `Action`.
  Existem quatro tipos de action: `Create`, `Rename`, `Overwrite` e `Delete`.

- Cada schematic é executado em um contexto, representado por um objeto `SchematicContext`.

O objeto de contexto passado para uma regra fornece acesso a funções utilitárias e metadados que o schematic pode precisar para trabalhar, incluindo uma API de logging para ajudar na depuração.
O contexto também define uma _estratégia de merge_ que determina como as mudanças são mescladas da árvore em staging para a árvore base.
Uma mudança pode ser aceita ou ignorada, ou lançar uma exceção.

### Definindo regras e ações

Quando você cria um novo schematic em branco com o [Schematics CLI](#schematics-cli), a função de entrada gerada é uma _rule factory_.
Um objeto `RuleFactory` define uma função de ordem superior que cria uma `Rule`.

<docs-code header="index.ts" language="typescript">

import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

// You don't have to export the function as default.
// You can also have more than one rule factory per file.
export function helloWorld(\_options: any): Rule {
return (tree: Tree,\_context: SchematicContext) => {
return tree;
};
}

</docs-code>

Suas regras podem fazer alterações em seus projetos chamando ferramentas externas e implementando lógica.
Você precisa de uma regra, por exemplo, para definir como um template no schematic deve ser mesclado ao projeto hospedeiro.

Regras podem fazer uso de utilitários fornecidos com o pacote `@schematics/angular`.
Procure por funções auxiliares para trabalhar com modules, dependências, TypeScript, AST, JSON, workspaces e projetos Angular CLI, e mais.

<docs-code header="index.ts" language="typescript">

import {
JsonAstObject,
JsonObject,
JsonValue,
Path,
normalize,
parseJsonAst,
strings,
} from '@angular-devkit/core';

</docs-code>

### Definindo opções de entrada com um schema e interfaces

Regras podem coletar valores de opções do chamador e injetá-los em templates.
As opções disponíveis para suas regras, com seus valores permitidos e padrões, são definidas no arquivo de schema JSON do schematic, `<schematic>/schema.json`.
Defina tipos de dados variáveis ou enumerados para o schema usando interfaces TypeScript.

O schema define os tipos e valores padrão de variáveis usadas no schematic.
Por exemplo, o hipotético schematic "Hello World" pode ter o seguinte schema.

<docs-code header="src/hello-world/schema.json" language="json">

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
</docs-code>

Veja exemplos de arquivos de schema para os schematics de comandos do Angular CLI em [`@schematics/angular`](https://github.com/angular/angular-cli/blob/main/packages/schematics/angular/application/schema.json).

### Prompts de schematic

_Prompts_ de schematic introduzem interação do usuário na execução do schematic.
Configure opções de schematic para exibir uma pergunta personalizável ao usuário.
Os prompts são exibidos antes da execução do schematic, que então usa a resposta como valor para a opção.
Isso permite que os usuários direcionem a operação do schematic sem exigir conhecimento profundo de todo o espectro de opções disponíveis.

O schematic "Hello World" pode, por exemplo, perguntar ao usuário seu nome e exibir esse nome no lugar do nome padrão "world".
Para definir tal prompt, adicione uma propriedade `x-prompt` ao schema para a variável `name`.

Da mesma forma, você pode adicionar um prompt para permitir que o usuário decida se o schematic usa cor ao executar sua ação hello.
O schema com ambos os prompts seria o seguinte.

<docs-code header="src/hello-world/schema.json" language="json">

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
</docs-code>

#### Sintaxe abreviada de prompt

Estes exemplos usam uma forma abreviada da sintaxe de prompt, fornecendo apenas o texto da pergunta.
Na maioria dos casos, isso é tudo que é necessário.
Note, no entanto, que os dois prompts esperam tipos diferentes de entrada.
Ao usar a forma abreviada, o tipo mais apropriado é selecionado automaticamente com base no schema da propriedade.
No exemplo, o prompt `name` usa o tipo `input` porque é uma propriedade string.
O prompt `useColor` usa um tipo `confirmation` porque é uma propriedade Boolean.
Neste caso, "yes" corresponde a `true` e "no" corresponde a `false`.

Existem três tipos de entrada suportados.

| Tipo de entrada | Detalhes                                             |
| :-------------- | :--------------------------------------------------- |
| confirmation    | Uma pergunta sim ou não; ideal para opções Boolean.  |
| input           | Entrada textual; ideal para opções string ou number. |
| list            | Um conjunto predefinido de valores permitidos.       |

Na forma abreviada, o tipo é inferido do tipo e restrições da propriedade.

| Schema da propriedade | Tipo de prompt                                       |
| :-------------------- | :--------------------------------------------------- |
| "type": "boolean"     | confirmation \("yes"=`true`, "no"=`false`\)          |
| "type": "string"      | input                                                |
| "type": "number"      | input \(apenas números válidos aceitos\)             |
| "type": "integer"     | input \(apenas números válidos aceitos\)             |
| "enum": […]           | list \(membros do enum tornam-se seleções da lista\) |

No exemplo a seguir, a propriedade recebe um valor enumerado, então o schematic escolhe automaticamente o tipo list e cria um menu a partir dos valores possíveis.

<docs-code header="schema.json" language="json">

"style": {
"description": "The file extension or preprocessor to use for style files.",
"type": "string",
"default": "css",
"enum": [
"css",
"scss",
"sass",
"less",
"styl"
],
"x-prompt": "Which stylesheet format would you like to use?"
}

</docs-code>

O runtime do prompt valida automaticamente a resposta fornecida contra as restrições fornecidas no schema JSON.
Se o valor não for aceitável, o usuário é solicitado por um novo valor.
Isso garante que quaisquer valores passados ao schematic atendam às expectativas da implementação do schematic, de modo que você não precisa adicionar verificações adicionais dentro do código do schematic.

#### Sintaxe longa de prompt

A sintaxe do campo `x-prompt` suporta uma forma longa para casos onde você requer personalização e controle adicionais sobre o prompt.
Nesta forma, o valor do campo `x-prompt` é um objeto JSON com subcampos que personalizam o comportamento do prompt.

| Campo   | Valor de dados                                                                       |
| :------ | :----------------------------------------------------------------------------------- |
| type    | `confirmation`, `input` ou `list` \(selecionado automaticamente na forma abreviada\) |
| message | string \(obrigatório\)                                                               |
| items   | string e/ou par de objeto label/value \(válido apenas com type `list`\)              |

O exemplo a seguir da forma longa é do schema JSON para o schematic que o CLI usa para [gerar aplicações](https://github.com/angular/angular-cli/blob/ba8a6ea59983bb52a6f1e66d105c5a77517f062e/packages/schematics/angular/application/schema.json#L56).
Ele define o prompt que permite aos usuários escolher qual pré-processador de estilo desejam usar para a aplicação sendo criada.
Ao usar a forma longa, o schematic pode fornecer formatação mais explícita das opções do menu.

<docs-code header="package/schematics/angular/application/schema.json" language="json">

"style": {
"description": "The file extension or preprocessor to use for style files.",
"type": "string",
"default": "css",
"enum": [
"css",
"scss",
"sass",
"less"
],
"x-prompt": {
"message": "Which stylesheet format would you like to use?",
"type": "list",
"items": [
{ "value": "css", "label": "CSS" },
{ "value": "scss", "label": "SCSS [ https://sass-lang.com/documentation/syntax#scss ]" },
{ "value": "sass", "label": "Sass [ https://sass-lang.com/documentation/syntax#the-indented-syntax ]" },
{ "value": "less", "label": "Less [ https://lesscss.org/ ]" }
]
},
},

</docs-code>

#### Schema do x-prompt

O schema JSON que define as opções de um schematic suporta extensões para permitir a definição declarativa de prompts e seus respectivos comportamentos.
Nenhuma lógica adicional ou mudanças são necessárias no código de um schematic para suportar os prompts.
O schema JSON a seguir é uma descrição completa da sintaxe longa para o campo `x-prompt`.

<docs-code header="x-prompt schema" language="json">

{
"oneOf": [
{ "type": "string" },
{
"type": "object",
"properties": {
"type": { "type": "string" },
"message": { "type": "string" },
"items": {
"type": "array",
"items": {
"oneOf": [
{ "type": "string" },
{
"type": "object",
"properties": {
"label": { "type": "string" },
"value": { }
},
"required": [ "value" ]
}
]
}
}
},
"required": [ "message" ]
}
]
}

</docs-code>

## Schematics CLI

Schematics vêm com sua própria ferramenta de linha de comando.
Usando Node 6.9 ou posterior, instale a ferramenta de linha de comando Schematics globalmente:

```shell

npm install -g @angular-devkit/schematics-cli

```

Isso instala o executável `schematics`, que você pode usar para criar uma nova coleção de schematics em sua própria pasta de projeto, adicionar um novo schematic a uma coleção existente ou estender um schematic existente.

Nas seções a seguir, você criará uma nova coleção de schematics usando o CLI para introduzir os arquivos e estrutura de arquivos, e alguns dos conceitos básicos.

O uso mais comum de schematics, no entanto, é integrar uma biblioteca Angular com o Angular CLI.
Faça isso criando os arquivos de schematic diretamente dentro do projeto da biblioteca em um workspace Angular, sem usar o Schematics CLI.
Veja [Schematics para Bibliotecas](tools/cli/schematics-for-libraries).

### Criando uma coleção de schematics

O comando a seguir cria um novo schematic chamado `hello-world` em uma nova pasta de projeto com o mesmo nome.

```shell

schematics blank --name=hello-world

```

O schematic `blank` é fornecido pelo Schematics CLI.
O comando cria uma nova pasta de projeto \(a pasta raiz para a coleção\) e um schematic nomeado inicial na coleção.

Vá para a pasta da coleção, instale suas dependências npm e abra sua nova coleção em seu editor favorito para ver os arquivos gerados.
Por exemplo, se você estiver usando VS Code:

```shell

cd hello-world
npm install
npm run build
code .

```

O schematic inicial obtém o mesmo nome que a pasta do projeto e é gerado em `src/hello-world`.
Adicione schematics relacionados a esta coleção e modifique o código esqueleto gerado para definir a funcionalidade do seu schematic.
Cada nome de schematic deve ser único dentro da coleção.

### Executando um schematic

Use o comando `schematics` para executar um schematic nomeado.
Forneça o caminho para a pasta do projeto, o nome do schematic e quaisquer opções obrigatórias, no seguinte formato.

```shell

schematics <path-to-schematics-project>:<schematics-name> --<required-option>=<value>

```

O caminho pode ser absoluto ou relativo ao diretório de trabalho atual onde o comando é executado.
Por exemplo, para executar o schematic que você acabou de gerar \(que não tem opções obrigatórias\), use o seguinte comando.

```shell

schematics .:hello-world

```

### Adicionando um schematic a uma coleção

Para adicionar um schematic a uma coleção existente, use o mesmo comando que você usa para iniciar um novo projeto de schematics, mas execute o comando dentro da pasta do projeto.

```shell

cd hello-world
schematics blank --name=goodbye-world

```

O comando gera o novo schematic nomeado dentro de sua coleção, com um arquivo principal `index.ts` e sua especificação de teste associada.
Ele também adiciona o nome, descrição e função factory para o novo schematic ao schema da coleção no arquivo `collection.json`.

## Conteúdo da coleção

O nível superior da pasta raiz do projeto para uma coleção contém arquivos de configuração, uma pasta `node_modules` e uma pasta `src/`.
A pasta `src/` contém subpastas para schematics nomeados na coleção e um schema, `collection.json`, que descreve os schematics coletados.
Cada schematic é criado com um nome, descrição e função factory.

```json

{
  "$schema":
     "../node_modules/@angular-devkit/schematics/collection-schema.json",
  "schematics": {
    "hello-world": {
      "description": "A blank schematic.",
      "factory": "./hello-world/index#helloWorld"
    }
  }
}

```

- A propriedade `$schema` especifica o schema que o CLI usa para validação.
- A propriedade `schematics` lista schematics nomeados que pertencem a esta coleção.
  Cada schematic tem uma descrição em texto simples e aponta para a função de entrada gerada no arquivo principal.

- A propriedade `factory` aponta para a função de entrada gerada.
  Neste exemplo, você invoca o schematic `hello-world` chamando a função factory `helloWorld()`.

- A propriedade opcional `schema` aponta para um arquivo de schema JSON que define as opções de linha de comando disponíveis para o schematic.
- O array opcional `aliases` especifica uma ou mais strings que podem ser usadas para invocar o schematic.
  Por exemplo, o schematic para o comando "generate" do Angular CLI tem um alias "g", que permite usar o comando `ng g`.

### Schematics nomeados

Quando você usa o Schematics CLI para criar um projeto de schematics em branco, o novo schematic em branco é o primeiro membro da coleção e tem o mesmo nome da coleção.
Quando você adiciona um novo schematic nomeado a esta coleção, ele é automaticamente adicionado ao schema `collection.json`.

Além do nome e descrição, cada schematic tem uma propriedade `factory` que identifica o ponto de entrada do schematic.
No exemplo, você invoca a funcionalidade definida do schematic chamando a função `helloWorld()` no arquivo principal, `hello-world/index.ts`.

<img alt="overview" src="assets/images/guide/schematics/collection-files.gif">

Cada schematic nomeado na coleção tem as seguintes partes principais.

| Partes        | Detalhes                                                               |
| :------------ | :--------------------------------------------------------------------- |
| `index.ts`    | Código que define a lógica de transformação para um schematic nomeado. |
| `schema.json` | Definição de variável de schematic.                                    |
| `schema.d.ts` | Variáveis de schematic.                                                |
| `files/`      | Arquivos opcionais de component/template para replicar.                |

É possível para um schematic fornecer toda a sua lógica no arquivo `index.ts`, sem templates adicionais.
Você pode criar schematics dinâmicos para Angular, no entanto, fornecendo components e templates na pasta `files`, como aqueles em projetos Angular independentes.
A lógica no arquivo index configura esses templates definindo regras que injetam dados e modificam variáveis.
