<!-- ia-translate: true -->

# Builders do Angular CLI {#angular-cli-builders}

Vários comandos do Angular CLI executam um processo complexo no seu código, como construir, testar ou servir sua aplicação.
Os comandos usam uma ferramenta interna chamada Architect para executar _builders do CLI_, que invocam outra ferramenta (bundler, test runner, servidor) para realizar a tarefa desejada.
Builders customizados podem executar uma tarefa inteiramente nova ou alterar qual ferramenta de terceiros é usada por um comando existente.

Este documento explica como os builders do CLI se integram ao arquivo de configuração do workspace e mostra como você pode criar seu próprio builder.

HELPFUL: Encontre o código dos exemplos usados aqui neste [repositório GitHub](https://github.com/mgechev/cli-builders-demo).

## Builders do CLI {#cli-builders}

A ferramenta interna Architect delega o trabalho para funções manipuladoras chamadas _builders_.
Uma função manipuladora de builder recebe dois argumentos:

| Argumento | Tipo             |
| :-------- | :--------------- |
| `options` | `JSONObject`     |
| `context` | `BuilderContext` |

A separação de responsabilidades aqui é a mesma dos [schematics](tools/cli/schematics-authoring), que são usados por outros comandos do CLI que tocam no seu código (como `ng generate`).

- O objeto `options` é fornecido pelas opções e configuração do usuário do CLI, enquanto o objeto `context` é fornecido automaticamente pela API de Builder do CLI.
- Além das informações contextuais, o objeto `context` também fornece acesso a um método de agendamento, `context.scheduleTarget()`.
  O scheduler executa a função manipuladora do builder com uma determinada configuração de target.

A função manipuladora do builder pode ser síncrona (retornar um valor), assíncrona (retornar uma `Promise`) ou observar e retornar múltiplos valores (retornar um `Observable`).
Os valores de retorno devem sempre ser do tipo `BuilderOutput`.
Este objeto contém um campo booleano `success` e um campo opcional `error`, que pode conter uma mensagem de erro.

O Angular fornece alguns builders que são usados pelo CLI em comandos como `ng build` e `ng test`.
As configurações de target padrão para estes e outros builders integrados do CLI podem ser encontradas e configuradas na seção "architect" do [arquivo de configuração do workspace](reference/configs/workspace-config), `angular.json`.
Além disso, você pode estender e personalizar o Angular criando seus próprios builders, que podem ser executados diretamente usando o [comando `ng run` do CLI](cli/run).

### Estrutura de projeto do builder {#builder-project-structure}

Um builder reside em uma pasta de "projeto" semelhante em estrutura a um workspace Angular, com arquivos de configuração global no nível superior e configuração mais específica em uma pasta de código-fonte, com os arquivos que definem o comportamento.
Por exemplo, sua pasta `myBuilder` pode conter os seguintes arquivos.

| Arquivos                 | Propósito                                                                                                   |
| :----------------------- | :---------------------------------------------------------------------------------------------------------- |
| `src/my-builder.ts`      | Arquivo de código-fonte principal da definição do builder.                                                  |
| `src/my-builder.spec.ts` | Arquivo de código-fonte para testes.                                                                        |
| `src/schema.json`        | Definição das opções de entrada do builder.                                                                 |
| `builders.json`          | Definição dos builders.                                                                                     |
| `package.json`           | Dependências. Veja [https://docs.npmjs.com/files/package.json](https://docs.npmjs.com/files/package.json). |
| `tsconfig.json`          | [Configuração do TypeScript](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).              |

Builders podem ser publicados no `npm`, veja [Publicando sua Biblioteca](tools/libraries/creating-libraries).

## Criando um builder {#creating-a-builder}

Como exemplo, crie um builder que copia um arquivo para um novo local.
Para criar um builder, use a função `createBuilder()` da API do CLI Builder e retorne um objeto `Promise<BuilderOutput>`.

<docs-code header="src/my-builder.ts (esqueleto do builder)" path="adev/src/content/examples/cli-builder/src/my-builder.ts" region="builder-skeleton"/>

Agora vamos adicionar alguma lógica a ele.
O código a seguir recupera os caminhos do arquivo de origem e de destino a partir das opções do usuário e copia o arquivo da origem para o destino \(usando a [versão Promise da função integrada `copyFile()` do Node.js](https://nodejs.org/api/fs.html#fs_fspromises_copyfile_src_dest_mode)\).
Se a operação de cópia falhar, ela retorna um erro com uma mensagem sobre o problema subjacente.

<docs-code header="src/my-builder.ts (builder)" path="adev/src/content/examples/cli-builder/src/my-builder.ts" region="builder"/>

### Manipulando a saída {#handling-output}

Por padrão, `copyFile()` não imprime nada na saída padrão ou na saída de erro do processo.
Se ocorrer um erro, pode ser difícil entender exatamente o que o builder estava tentando fazer quando o problema aconteceu.
Adicione contexto registrando informações extras usando a API `Logger`.
Isso também permite que o próprio builder seja executado em um processo separado, mesmo se a saída padrão e a saída de erro estiverem desativadas.

Você pode obter uma instância de `Logger` a partir do contexto.

<docs-code header="src/my-builder.ts (manipulando a saída)" path="adev/src/content/examples/cli-builder/src/my-builder.ts" region="handling-output"/>

### Relatório de progresso e status {#progress-and-status-reporting}

A API do CLI Builder inclui ferramentas de relatório de progresso e status, que podem fornecer dicas para certas funções e interfaces.

Para relatar progresso, use o método `context.reportProgress()`, que recebe como argumentos um valor atual, um total opcional e uma string de status.
O total pode ser qualquer número. Por exemplo, se você sabe quantos arquivos precisa processar, o total pode ser o número de arquivos, e o valor atual deve ser o número processado até o momento.
A string de status não é modificada, a menos que você passe um novo valor de string.

No nosso exemplo, a operação de cópia ou termina ou ainda está em execução, então não há necessidade de relatório de progresso. Mesmo assim, você pode relatar o status para que um builder pai que chamou o nosso saiba o que está acontecendo.
Use o método `context.reportStatus()` para gerar uma string de status de qualquer comprimento.

HELPFUL: Não há garantia de que uma string longa será mostrada por inteiro; ela pode ser cortada para caber na interface que a exibe.

Passe uma string vazia para remover o status.

<docs-code header="src/my-builder.ts (relatório de progresso)" path="adev/src/content/examples/cli-builder/src/my-builder.ts" region="progress-reporting"/>

## Entrada do builder {#builder-input}

Você pode invocar um builder indiretamente por meio de um comando do CLI, como `ng build`, ou diretamente com o comando `ng run` do Angular CLI.
Em qualquer caso, você deve fornecer as entradas obrigatórias, mas pode deixar outras entradas assumirem valores padrão pré-configurados para um _target_ específico, definido por uma [configuração](tools/cli/environments), ou definidos na linha de comando.

### Validação de entrada {#input-validation}

Você define as entradas do builder em um JSON schema associado a esse builder.
Assim como nos schematics, a ferramenta Architect coleta os valores de entrada resolvidos em um objeto `options` e valida seus tipos contra o schema antes de passá-los para a função do builder.

Para o nosso builder de exemplo, `options` deve ser um `JsonObject` com duas chaves,
`source` e `destination`, sendo ambas strings.

Você pode fornecer o seguinte schema para a validação de tipo desses valores.

```json {header: "schema.json"}
{
  "$schema": "https://json-schema.org/schema",
  "type": "object",
  "properties": {
    "source": {
      "type": "string"
    },
    "destination": {
      "type": "string"
    }
  }
}
```

HELPFUL: Este é um exemplo mínimo, mas o uso de um schema para validação pode ser muito poderoso.
Para mais informações, veja o [site JSON Schema](https://json-schema.org).

Para vincular a implementação do builder ao seu schema e ao seu nome, você precisa criar um arquivo de _definição do builder_, que pode ser apontado no `package.json`.

Crie um arquivo chamado `builders.json` com este conteúdo:

```json {header: "builders.json"}
{
  "builders": {
    "copy": {
      "implementation": "./dist/my-builder.js",
      "schema": "./src/schema.json",
      "description": "Copies a file."
    }
  }
}
```

No arquivo `package.json`, adicione uma chave `builders` que indica à ferramenta Architect onde encontrar o arquivo de definição do builder.

```json {header: "package.json"}
{
  "name": "@example/copy-file",
  "version": "1.0.0",
  "description": "Builder for copying files",
  "builders": "builders.json",
  "dependencies": {
    "@angular/build": "^21.2.0"
  }
}
```

O nome oficial do nosso builder agora é `@example/copy-file:copy`.
A primeira parte é o nome do pacote, e a segunda parte é o nome do builder conforme especificado no arquivo `builders.json`.

Esses valores são acessados em `options.source` e `options.destination`.

<docs-code header="src/my-builder.ts (reportar status)" path="adev/src/content/examples/cli-builder/src/my-builder.ts" region="report-status"/>

### Configuração de target {#target-configuration}

Um builder deve ter um target definido que o associe a uma configuração de entrada específica e a um projeto.

Os targets são definidos no arquivo de configuração do CLI [`angular.json`](reference/configs/workspace-config).
Um target especifica o builder a ser usado, sua configuração padrão de opções e configurações alternativas nomeadas.
O Architect no Angular CLI usa a definição do target para resolver os valores de entrada de uma determinada execução.

O arquivo `angular.json` tem uma seção para cada projeto, e a seção "architect" de cada projeto configura os targets para os builders usados por comandos do CLI, como 'build', 'test' e 'serve'.
Por padrão, por exemplo, o comando `ng build` executa o builder `@angular/build:application` para realizar a tarefa de build e passa os valores de opção padrão especificados para o target `build` em `angular.json`.

```json {header: "angular.json"}
{
  "myApp": {
    "...": "...",
    "architect": {
      "build": {
        "builder": "@angular/build:application",
        "options": {
          "outputPath": "dist/myApp",
          "index": "src/index.html",
          "...": "..."
        },
        "configurations": {
          "production": {
            "fileReplacements": [
              {
                "replace": "src/environments/environment.ts",
                "with": "src/environments/environment.prod.ts"
              }
            ],
            "optimization": true,
            "outputHashing": "all",
            "...": "..."
          }
        }
      },
      "...": "..."
    }
  }
}
```

O comando passa ao builder o conjunto de opções padrão especificado na seção "options".
Se você passar a flag `--configuration=production`, ele usa os valores de substituição especificados na configuração `production`.
Especifique substituições de opções adicionais individualmente na linha de comando.

#### Strings de target {#target-strings}

O comando genérico `ng run` do CLI recebe como primeiro argumento uma string de target no seguinte formato.

```shell

project:target[:configuration]

```

|               | Detalhes                                                                                                                                 |
| :------------ | :--------------------------------------------------------------------------------------------------------------------------------------- |
| project       | O nome do projeto do Angular CLI ao qual o target está associado.                                                                        |
| target        | Uma configuração de builder nomeada da seção `architect` do arquivo `angular.json`.                                                      |
| configuration | (opcional) O nome de uma substituição de configuração específica para o target dado, conforme definido no arquivo `angular.json`.        |

Se o seu builder chamar outro builder, ele pode precisar ler uma string de target passada.
Analise essa string em um objeto usando a função utilitária `targetFromTargetString()` de `@angular-devkit/architect`.

## Agendar e executar {#schedule-and-run}

O Architect executa os builders de forma assíncrona.
Para invocar um builder, você agenda uma tarefa para ser executada quando toda a resolução de configuração estiver concluída.

A função do builder não é executada até que o scheduler retorne um objeto de controle `BuilderRun`.
O CLI normalmente agenda tarefas chamando a função `context.scheduleTarget()` e então resolve as opções de entrada usando a definição do target no arquivo `angular.json`.

O Architect resolve as opções de entrada para um determinado target pegando o objeto de opções padrão, sobrescrevendo em seguida os valores da configuração e, por fim, sobrescrevendo os valores do objeto de substituições passado para `context.scheduleTarget()`.
Para o Angular CLI, o objeto de substituições é construído a partir dos argumentos de linha de comando.

O Architect valida os valores de opções resultantes contra o schema do builder.
Se as entradas forem válidas, o Architect cria o contexto e executa o builder.

Para mais informações, veja [Configuração do Workspace](reference/configs/workspace-config).

HELPFUL: Você também pode invocar um builder diretamente de outro builder ou de um teste chamando `context.scheduleBuilder()`.
Você passa um objeto `options` diretamente para o método, e esses valores de opção são validados contra o schema do builder sem nenhum ajuste adicional.

Somente o método `context.scheduleTarget()` resolve a configuração e as substituições por meio do arquivo `angular.json`.

### Configuração padrão do Architect {#default-architect-configuration}

Vamos criar um arquivo `angular.json` simples que coloca as configurações de target em contexto.

Você pode publicar o builder no npm (veja [Publicando sua Biblioteca](tools/libraries/creating-libraries#publishing-your-library)) e instalá-lo usando o seguinte comando:

```shell

npm install @example/copy-file

```

Se você criar um novo projeto com `ng new builder-test`, o arquivo `angular.json` gerado terá aproximadamente esta aparência, apenas com as configurações padrão dos builders.

```json {header: "angular.json"}
{
  "projects": {
    "builder-test": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "outputPath": "dist/builder-test",
            "index": "src/index.html",
            "browser": "src/main.ts",
            "tsConfig": "tsconfig.app.json"
          },
          "configurations": {
            "production": {
              "optimization": true,
              "aot": true
            }
          }
        }
      }
    }
  }
}
```

### Adicionando um target {#adding-a-target}

Adicione um novo target que executará nosso builder para copiar um arquivo.
Este target diz ao builder para copiar o arquivo `package.json`.

- Vamos adicionar uma nova seção de target ao objeto `architect` do nosso projeto.
- O target chamado `copy-package` usa nosso builder, que você publicou como `@example/copy-file`.
- O objeto `options` fornece valores padrão para as duas entradas que você definiu.
  - `source` - O arquivo existente que você está copiando.
  - `destination` - O caminho para o qual você quer copiar.

```json {header: "angular.json"}
{
  "projects": {
    "builder-test": {
      "architect": {
        "copy-package": {
          "builder": "@example/copy-file:copy",
          "options": {
            "source": "package.json",
            "destination": "package-copy.json"
          }
        }
        // Targets existentes...
      }
    }
  }
}
```

### Executando o builder {#running-the-builder}

Para executar nosso builder com a configuração padrão do novo target, use o seguinte comando do CLI.

```shell

ng run builder-test:copy-package

```

Isso copia o arquivo `package.json` para `package-copy.json`.

Use argumentos de linha de comando para substituir os padrões configurados.
Por exemplo, para executar com um valor de `destination` diferente, use o seguinte comando do CLI.

```shell

ng run builder-test:copy-package --destination=package-other.json

```

Isso copia o arquivo para `package-other.json` em vez de `package-copy.json`.
Como você não substituiu a opção _source_, ela ainda copiará do arquivo padrão `package.json`.

## Testando um builder {#testing-a-builder}

Use testes de integração para o seu builder, para que você possa usar o scheduler do Architect para criar um contexto, como neste [exemplo](https://github.com/mgechev/cli-builders-demo).
No diretório de código-fonte do builder, crie um novo arquivo de teste `my-builder.spec.ts`. O teste cria novas instâncias de `JsonSchemaRegistry` (para validação de schema), `TestingArchitectHost` (uma implementação em memória de `ArchitectHost`) e `Architect`.

Aqui está um exemplo de teste que executa o builder de cópia de arquivo.
O teste usa o builder para copiar o arquivo `package.json` e valida que o conteúdo do arquivo copiado é igual ao da origem.

<docs-code header="src/my-builder.spec.ts" path="adev/src/content/examples/cli-builder/src/my-builder.spec.ts"/>

HELPFUL: Ao executar este teste no seu repositório, você precisa do pacote [`ts-node`](https://github.com/TypeStrong/ts-node).
Você pode evitar isso renomeando `my-builder.spec.ts` para `my-builder.spec.js`.

### Modo watch {#watch-mode}

A maioria dos builders executa uma vez e retorna. No entanto, esse comportamento não é totalmente compatível com um builder que observa mudanças (como um devserver, por exemplo).
O Architect pode suportar o modo watch, mas há alguns pontos a observar.

- Para ser usada no modo watch, uma função manipuladora de builder deve retornar um `Observable`.
  O Architect se inscreve no `Observable` até que ele seja concluído e pode reutilizá-lo se o builder for agendado novamente com os mesmos argumentos.

- O builder deve sempre emitir um objeto `BuilderOutput` após cada execução.
  Depois de executado, ele pode entrar em modo watch, para ser acionado por um evento externo.
  Se um evento o acionar para reiniciar, o builder deve executar a função `context.reportRunning()` para informar ao Architect que está executando novamente.
  Isso impede que o Architect pare o builder se outra execução for agendada.

Quando o seu builder chama `BuilderRun.stop()` para sair do modo watch, o Architect cancela a inscrição no `Observable` do builder e chama a lógica de teardown do builder para fazer a limpeza.
Esse comportamento também permite que builds de longa duração sejam interrompidos e limpos.

Em geral, se o seu builder estiver observando um evento externo, você deve separar a execução em três fases.

| Fases      | Detalhes                                                                                                                                                                                                                                       |
| :--------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Execução   | A tarefa sendo realizada, como invocar um compilador. Termina quando o compilador finaliza e o seu builder emite um objeto `BuilderOutput`.                                                                                                  |
| Observação | Entre duas execuções, observar um fluxo de eventos externos. Por exemplo, observar o sistema de arquivos em busca de quaisquer mudanças. Termina quando o compilador reinicia e `context.reportRunning()` é chamado.                          |
| Conclusão  | Ou a tarefa está totalmente concluída, como um compilador que precisa executar várias vezes, ou a execução do builder foi interrompida (usando `BuilderRun.stop()`). O Architect executa a lógica de teardown e cancela a inscrição no `Observable` do seu builder. |

## Resumo {#summary}

A API do CLI Builder fornece um meio de alterar o comportamento do Angular CLI usando builders para executar lógica personalizada.

- Builders podem ser síncronos ou assíncronos, executar uma vez ou observar eventos externos, e podem agendar outros builders ou targets.
- Builders têm padrões de opções especificados no arquivo de configuração `angular.json`, que podem ser sobrescritos por uma configuração alternativa do target e, em seguida, por flags da linha de comando.
- A equipe Angular recomenda que você use testes de integração para testar builders do Architect. Use testes unitários para validar a lógica que o builder executa.
- Se o seu builder retornar um `Observable`, ele deve limpar o builder na lógica de teardown desse `Observable`.
