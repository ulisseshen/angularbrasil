<!-- ia-translate: true -->
# Builders do Angular CLI

Vários comandos do Angular CLI executam um processo complexo no seu código, como construir, testar ou servir sua aplicação.
Os comandos usam uma ferramenta interna chamada Architect para executar _builders do CLI_, que invocam outra ferramenta (bundler, test runner, servidor) para realizar a tarefa desejada.
Builders customizados podem executar uma tarefa inteiramente nova, ou alterar qual ferramenta de terceiros é usada por um comando existente.

Este documento explica como os builders do CLI se integram com o arquivo de configuração do workspace, e mostra como você pode criar seu próprio builder.

ÚTIL: Encontre o código dos exemplos usados aqui neste [repositório GitHub](https://github.com/mgechev/cli-builders-demo).

## Builders do CLI

A ferramenta interna Architect delega trabalho para funções manipuladoras chamadas _builders_.
Uma função manipuladora de builder recebe dois argumentos:

| Argumento | Tipo             |
| :-------- | :--------------- |
| `options` | `JSONObject`     |
| `context` | `BuilderContext` |

A separação de responsabilidades aqui é a mesma dos [schematics](tools/cli/schematics-authoring), que são usados para outros comandos CLI que tocam seu código (como `ng generate`).

- O objeto `options` é fornecido pelas opções e configuração do usuário do CLI, enquanto o objeto `context` é fornecido pela API Builder do CLI automaticamente.
- Além das informações contextuais, o objeto `context` também fornece acesso a um método de agendamento, `context.scheduleTarget()`.
  O scheduler executa a função manipuladora do builder com uma determinada configuração de target.

A função manipuladora do builder pode ser síncrona (retornar um valor), assíncrona (retornar uma `Promise`), ou observar e retornar múltiplos valores (retornar um `Observable`).
Os valores de retorno devem sempre ser do tipo `BuilderOutput`.
Este objeto contém um campo Booleano `success` e um campo opcional `error` que pode conter uma mensagem de erro.

O Angular fornece alguns builders que são usados pelo CLI para comandos como `ng build` e `ng test`.
Configurações de target padrão para estes e outros builders integrados do CLI podem ser encontradas e configuradas na seção "architect" do [arquivo de configuração do workspace](reference/configs/workspace-config), `angular.json`.
Além disso, estenda e personalize o Angular criando seus próprios builders, que você pode executar diretamente usando o [comando CLI `ng run`](cli/run).

### Estrutura de projeto do builder

Um builder reside em uma pasta de "projeto" que é similar em estrutura a um workspace Angular, com arquivos de configuração global no nível superior, e configuração mais específica em uma pasta source com os arquivos de código que definem o comportamento.
Por exemplo, sua pasta `myBuilder` poderia conter os seguintes arquivos.

| Arquivos                 | Propósito                                                                                                 |
| :----------------------- | :-------------------------------------------------------------------------------------------------------- |
| `src/my-builder.ts`      | Arquivo fonte principal para a definição do builder.                                                      |
| `src/my-builder.spec.ts` | Arquivo fonte para testes.                                                                                |
| `src/schema.json`        | Definição das opções de entrada do builder.                                                               |
| `builders.json`          | Definição de builders.                                                                                    |
| `package.json`           | Dependências. Veja [https://docs.npmjs.com/files/package.json](https://docs.npmjs.com/files/package.json). |
| `tsconfig.json`          | [Configuração TypeScript](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).              |

Builders podem ser publicados no `npm`, veja [Publicando sua Biblioteca](tools/libraries/creating-libraries).

## Criando um builder

Como exemplo, crie um builder que copia um arquivo para um novo local.
Para criar um builder, use a função `createBuilder()` do CLI Builder, e retorne um objeto `Promise<BuilderOutput>`.

<docs-code header="src/my-builder.ts (esqueleto do builder)" path="adev/src/content/examples/cli-builder/src/my-builder.ts" visibleRegion="builder-skeleton"/>

Agora vamos adicionar alguma lógica a ele.
O código a seguir recupera os caminhos do arquivo de origem e destino das opções do usuário e copia o arquivo da origem para o destino \(usando a [versão Promise da função integrada do NodeJS `copyFile()`](https://nodejs.org/api/fs.html#fs_fspromises_copyfile_src_dest_mode)\).
Se a operação de cópia falhar, ela retorna um erro com uma mensagem sobre o problema subjacente.

<docs-code header="src/my-builder.ts (builder)" path="adev/src/content/examples/cli-builder/src/my-builder.ts" visibleRegion="builder"/>

### Manipulando saída

Por padrão, `copyFile()` não imprime nada na saída padrão ou erro do processo.
Se ocorrer um erro, pode ser difícil entender exatamente o que o builder estava tentando fazer quando o problema ocorreu.
Adicione algum contexto adicional registrando informações adicionais usando a API `Logger`.
Isso também permite que o próprio builder seja executado em um processo separado, mesmo se a saída padrão e o erro estiverem desativados.

Você pode recuperar uma instância `Logger` do contexto.

<docs-code header="src/my-builder.ts (manipulando saída)" path="adev/src/content/examples/cli-builder/src/my-builder.ts" visibleRegion="handling-output"/>

### Relatório de progresso e status

A API Builder do CLI inclui ferramentas de relatório de progresso e status, que podem fornecer dicas para certas funções e interfaces.

Para reportar progresso, use o método `context.reportProgress()`, que recebe um valor atual, total opcional e string de status como argumentos.
O total pode ser qualquer número. Por exemplo, se você sabe quantos arquivos você tem para processar, o total poderia ser o número de arquivos, e atual deveria ser o número processado até agora.
A string de status não é modificada a menos que você passe um novo valor de string.

Em nosso exemplo, a operação de cópia ou termina ou ainda está executando, então não há necessidade de um relatório de progresso, mas você pode reportar status para que um builder pai que chamou nosso builder saiba o que está acontecendo.
Use o método `context.reportStatus()` para gerar uma string de status de qualquer comprimento.

ÚTIL: Não há garantia de que uma string longa será mostrada inteiramente; ela pode ser cortada para caber na UI que a exibe.

Passe uma string vazia para remover o status.

<docs-code header="src/my-builder.ts (relatório de progresso)" path="adev/src/content/examples/cli-builder/src/my-builder.ts" visibleRegion="progress-reporting"/>

## Entrada do builder

Você pode invocar um builder indiretamente através de um comando CLI como `ng build`, ou diretamente com o comando `ng run` do Angular CLI.
Em qualquer caso, você deve fornecer entradas obrigatórias, mas pode deixar outras entradas assumirem valores padrão que são pré-configurados para um _target_ específico, especificado por uma [configuração](tools/cli/environments), ou definido na linha de comando.

### Validação de entrada

Você define entradas do builder em um schema JSON associado a esse builder.
Similar aos schematics, a ferramenta Architect coleta os valores de entrada resolvidos em um objeto `options`, e valida seus tipos contra o schema antes de passá-los para a função do builder.

Para nosso builder de exemplo, `options` deve ser um `JsonObject` com duas chaves:
um `source` e um `destination`, cada um dos quais são uma string.

Você pode fornecer o seguinte schema para validação de tipo desses valores.

<docs-code header="src/schema.json" language="json">

{
"$schema": "http://json-schema.org/schema",
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

</docs-code>

ÚTIL: Este é um exemplo mínimo, mas o uso de um schema para validação pode ser muito poderoso.
Para mais informações, veja o [site JSON schemas](http://json-schema.org).

Para vincular nossa implementação do builder com seu schema e nome, você precisa criar um arquivo de _definição do builder_, para o qual você pode apontar no `package.json`.

Crie um arquivo chamado `builders.json` que se parece com isso:

<docs-code header="builders.json" language="json">

{
"builders": {
"copy": {
"implementation": "./dist/my-builder.js",
"schema": "./src/schema.json",
"description": "Copies a file."
}
}
}

</docs-code>

No arquivo `package.json`, adicione uma chave `builders` que diz à ferramenta Architect onde encontrar nosso arquivo de definição do builder.

<docs-code header="package.json" language="json">

{
"name": "@example/copy-file",
"version": "1.0.0",
"description": "Builder for copying files",
"builders": "builders.json",
"dependencies": {
"@angular-devkit/architect": "~0.1200.0",
"@angular-devkit/core": "^12.0.0"
}
}

</docs-code>

O nome oficial do nosso builder é agora `@example/copy-file:copy`.
A primeira parte disso é o nome do pacote e a segunda parte é o nome do builder conforme especificado no arquivo `builders.json`.

Esses valores são acessados em `options.source` e `options.destination`.

<docs-code header="src/my-builder.ts (reportar status)" path="adev/src/content/examples/cli-builder/src/my-builder.ts" visibleRegion="report-status"/>

### Configuração de target

Um builder deve ter um target definido que o associa com uma configuração de entrada específica e projeto.

Targets são definidos no [arquivo de configuração CLI](reference/configs/workspace-config) `angular.json`.
Um target especifica o builder a usar, sua configuração de opções padrão, e configurações alternativas nomeadas.
O Architect no Angular CLI usa a definição do target para resolver opções de entrada para uma determinada execução.

O arquivo `angular.json` tem uma seção para cada projeto, e a seção "architect" de cada projeto configura targets para builders usados por comandos CLI como 'build', 'test' e 'serve'.
Por padrão, por exemplo, o comando `ng build` executa o builder `@angular-devkit/build-angular:browser` para executar a tarefa de build, e passa valores de opção padrão conforme especificado para o target `build` em `angular.json`.

<docs-code header="angular.json" language="json">

…

"myApp": {
…
"architect": {
"build": {
"builder": "@angular-devkit/build-angular:browser",
"options": {
"outputPath": "dist/myApp",
"index": "src/index.html",
…
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
…
}
}
},
…
}
}

…

</docs-code>

O comando passa ao builder o conjunto de opções padrão especificadas na seção "options".
Se você passar a flag `--configuration=production`, ele usa os valores de substituição especificados na configuração `production`.
Especifique substituições de opção adicionais individualmente na linha de comando.

#### Strings de target

O comando genérico `ng run` do CLI recebe como seu primeiro argumento uma string de target do seguinte formato.

```shell

project:target[:configuration]

```

|               | Detalhes                                                                                                                      |
| :------------ | :---------------------------------------------------------------------------------------------------------------------------- |
| project       | O nome do projeto Angular CLI ao qual o target está associado.                                                                |
| target        | Uma configuração de builder nomeada da seção `architect` do arquivo `angular.json`.                                           |
| configuration | (opcional) O nome de uma substituição de configuração específica para o target dado, conforme definido no arquivo `angular.json`. |

Se seu builder chamar outro builder, ele pode precisar ler uma string de target passada.
Analise esta string em um objeto usando a função utilitária `targetFromTargetString()` de `@angular-devkit/architect`.

## Agendar e executar

O Architect executa builders de forma assíncrona.
Para invocar um builder, você agenda uma tarefa para ser executada quando toda a resolução de configuração estiver completa.

A função do builder não é executada até que o scheduler retorne um objeto de controle `BuilderRun`.
O CLI normalmente agenda tarefas chamando a função `context.scheduleTarget()`, e então resolve opções de entrada usando a definição de target no arquivo `angular.json`.

O Architect resolve opções de entrada para um determinado target pegando o objeto de opções padrão, então sobrescrevendo valores da configuração, e então sobrescrevendo ainda mais valores do objeto de substituições passado para `context.scheduleTarget()`.
Para o Angular CLI, o objeto de substituições é construído a partir de argumentos de linha de comando.

O Architect valida os valores de opções resultantes contra o schema do builder.
Se as entradas forem válidas, o Architect cria o contexto e executa o builder.

Para mais informações, veja [Configuração do Workspace](reference/configs/workspace-config).

ÚTIL: Você também pode invocar um builder diretamente de outro builder ou teste chamando `context.scheduleBuilder()`.
Você passa um objeto `options` diretamente para o método, e esses valores de opção são validados contra o schema do builder sem ajuste adicional.

Apenas o método `context.scheduleTarget()` resolve a configuração e substituições através do arquivo `angular.json`.

### Configuração padrão do architect

Vamos criar um arquivo `angular.json` simples que coloca configurações de target em contexto.

Você pode publicar o builder no npm (veja [Publicando sua Biblioteca](tools/libraries/creating-libraries#publishing-your-library)), e instalá-lo usando o seguinte comando:

```shell

npm install @example/copy-file

```

Se você criar um novo projeto com `ng new builder-test`, o arquivo `angular.json` gerado se parece com isso, com apenas configurações de builder padrão.

<docs-code header="angular.json" language="json">

{
"projects": {
"builder-test": {
"architect": {
"build": {
"builder": "@angular-devkit/build-angular:browser",
"options": {
// mais opções...
"outputPath": "dist/builder-test",
"index": "src/index.html",
"main": "src/main.ts",
"polyfills": "src/polyfills.ts",
"tsConfig": "src/tsconfig.app.json"
},
"configurations": {
"production": {
// mais opções...
"optimization": true,
"aot": true,
"buildOptimizer": true
}
}
}
}
}
}
}
</docs-code>

### Adicionando um target

Adicione um novo target que executará nosso builder para copiar um arquivo.
Este target diz ao builder para copiar o arquivo `package.json`.

- Vamos adicionar uma nova seção de target ao objeto `architect` para nosso projeto
- O target chamado `copy-package` usa nosso builder, que você publicou em `@example/copy-file`.
- O objeto options fornece valores padrão para as duas entradas que você definiu.
  - `source` - O arquivo existente que você está copiando.
  - `destination` - O caminho para o qual você quer copiar.

<docs-code header="angular.json" language="json">

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
},

        // Targets existentes...
      }
    }

}
}
</docs-code>

### Executando o builder

Para executar nosso builder com a configuração padrão do novo target, use o seguinte comando CLI.

```shell

ng run builder-test:copy-package

```

Isso copia o arquivo `package.json` para `package-copy.json`.

Use argumentos de linha de comando para substituir os padrões configurados.
Por exemplo, para executar com um valor `destination` diferente, use o seguinte comando CLI.

```shell

ng run builder-test:copy-package --destination=package-other.json

```

Isso copia o arquivo para `package-other.json` em vez de `package-copy.json`.
Como você não substituiu a opção _source_, ela ainda copiará do arquivo padrão `package.json`.

## Testando um builder

Use testes de integração para seu builder, para que você possa usar o scheduler Architect para criar um contexto, como neste [exemplo](https://github.com/mgechev/cli-builders-demo).
No diretório fonte do builder, crie um novo arquivo de teste `my-builder.spec.ts`. O teste cria novas instâncias de `JsonSchemaRegistry` (para validação de schema), `TestingArchitectHost` (uma implementação em memória de `ArchitectHost`), e `Architect`.

Aqui está um exemplo de um teste que executa o builder de copiar arquivo.
O teste usa o builder para copiar o arquivo `package.json` e valida que o conteúdo do arquivo copiado é o mesmo da origem.

<docs-code header="src/my-builder.spec.ts" path="adev/src/content/examples/cli-builder/src/my-builder.spec.ts"/>

ÚTIL: Ao executar este teste no seu repositório, você precisa do pacote [`ts-node`](https://github.com/TypeStrong/ts-node).
Você pode evitar isso renomeando `my-builder.spec.ts` para `my-builder.spec.js`.

### Modo watch

A maioria dos builders executa uma vez e retorna. No entanto, esse comportamento não é totalmente compatível com um builder que observa mudanças (como um devserver, por exemplo).
O Architect pode suportar o modo watch, mas há algumas coisas a observar.

- Para ser usado com o modo watch, uma função manipuladora de builder deve retornar um `Observable`.
  O Architect se inscreve no `Observable` até que ele seja concluído e pode reutilizá-lo se o builder for agendado novamente com os mesmos argumentos.

- O builder deve sempre emitir um objeto `BuilderOutput` após cada execução.
  Uma vez que tenha sido executado, ele pode entrar em um modo watch, para ser acionado por um evento externo.
  Se um evento o acionar para reiniciar, o builder deve executar a função `context.reportRunning()` para dizer ao Architect que ele está executando novamente.
  Isso impede que o Architect pare o builder se outra execução for agendada.

Quando seu builder chama `BuilderRun.stop()` para sair do modo watch, o Architect cancela a inscrição no `Observable` do builder e chama a lógica de desmontagem do builder para limpar.
Este comportamento também permite que builds de longa duração sejam parados e limpos.

Em geral, se seu builder está observando um evento externo, você deve separar sua execução em três fases.

| Fases      | Detalhes                                                                                                                                                                                                                                                          |
| :--------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Running    | A tarefa sendo executada, como invocar um compilador. Isso termina quando o compilador termina e seu builder emite um objeto `BuilderOutput`.                                                                                                                     |
| Watching   | Entre duas execuções, observar um fluxo de evento externo. Por exemplo, observar o sistema de arquivos para quaisquer mudanças. Isso termina quando o compilador reinicia, e `context.reportRunning()` é chamado.                                                  |
| Completion | Ou a tarefa está totalmente concluída, como um compilador que precisa executar várias vezes, ou a execução do builder foi parada (usando `BuilderRun.stop()`). O Architect executa a lógica de desmontagem e cancela a inscrição no `Observable` do seu builder. |

## Resumo

A API Builder do CLI fornece um meio de alterar o comportamento do Angular CLI usando builders para executar lógica customizada.

- Builders podem ser síncronos ou assíncronos, executar uma vez ou observar eventos externos, e podem agendar outros builders ou targets.
- Builders têm padrões de opção especificados no arquivo de configuração `angular.json`, que podem ser sobrescritos por uma configuração alternativa para o target, e ainda mais sobrescritos por flags de linha de comando
- A equipe Angular recomenda que você use testes de integração para testar builders Architect. Use testes unitários para validar a lógica que o builder executa.
- Se seu builder retornar um `Observable`, ele deve limpar o builder na lógica de desmontagem desse `Observable`.
