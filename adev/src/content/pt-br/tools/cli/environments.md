<!-- ia-translate: true -->
# Configurando ambientes de aplicação

Você pode definir diferentes configurações de build nomeadas para seu projeto, como `development` e `staging`, com diferentes padrões.

Cada configuração nomeada pode ter padrões para qualquer uma das opções que se aplicam aos vários targets de builder, como `build`, `serve` e `test`.
Os comandos `build`, `serve` e `test` do [Angular CLI](tools/cli) podem então substituir arquivos com versões apropriadas para seu ambiente de destino pretendido.

## Configurações do Angular CLI

Os builders do Angular CLI suportam um objeto `configurations`, que permite sobrescrever opções específicas para um builder com base na configuração fornecida na linha de comando.

```json

{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            // By default, disable source map generation.
            "sourceMap": false
          },
          "configurations": {
            // For the `debug` configuration, enable source maps.
            "debug": {
              "sourceMap": true
            }
          }
        },
        …
      }
    }
  }
}

```

Você pode escolher qual configuração usar com a opção `--configuration`.

```shell

ng build --configuration debug

```

Configurações podem ser aplicadas a qualquer builder do Angular CLI. Múltiplas configurações podem ser especificadas com um separador de vírgula. As configurações são aplicadas em ordem, com opções conflitantes usando o valor da última configuração.

```shell

ng build --configuration debug,production,customer-facing

```

## Configurar padrões específicos de ambiente

`@angular-devkit/build-angular:browser` suporta substituição de arquivos, uma opção para substituir arquivos de origem antes de executar um build.
Usar isso em combinação com `--configuration` fornece um mecanismo para configurar dados específicos de ambiente em sua aplicação.

Comece [gerando environments](cli/generate/environments) para criar o diretório `src/environments/` e configurar o projeto para usar substituição de arquivos.

```shell

ng generate environments

```

O diretório `src/environments/` do projeto contém o arquivo de configuração base, `environment.ts`, que fornece a configuração padrão para produção.
Você pode sobrescrever valores padrão para ambientes adicionais, como `development` e `staging`, em arquivos de configuração específicos do target.

Por exemplo:

```text

my-app/src/environments
├── environment.development.ts
├── environment.staging.ts
└── environment.ts

```

O arquivo base `environment.ts` contém as configurações de ambiente padrão.
Por exemplo:

```ts

export const environment = {
  production: true
};

```

O comando `build` usa isso como o target de build quando nenhum ambiente é especificado.
Você pode adicionar mais variáveis, seja como propriedades adicionais no objeto environment, ou como objetos separados.
Por exemplo, o seguinte adiciona um padrão para uma variável ao ambiente padrão:

```ts

export const environment = {
  production: true,
  apiUrl: 'http://my-prod-url'
};

```

Você pode adicionar arquivos de configuração específicos do target, como `environment.development.ts`.
O seguinte conteúdo define valores padrão para o target de build de desenvolvimento:

```ts

export const environment = {
  production: false,
  apiUrl: 'http://my-dev-url'
};

```

## Usando variáveis específicas de ambiente em sua aplicação

Para usar as configurações de ambiente que você definiu, seus components devem importar o arquivo de environments original:

```ts

import { environment } from './environments/environment';

```

Isso garante que os comandos build e serve possam encontrar as configurações para targets de build específicos.

O código a seguir no arquivo de component (`app.component.ts`) usa uma variável de ambiente definida nos arquivos de configuração.

```ts

import { environment } from './../environments/environment';

// Fetches from `http://my-prod-url` in production, `http://my-dev-url` in development.
fetch(environment.apiUrl);

```

O arquivo de configuração principal do CLI, `angular.json`, contém uma seção `fileReplacements` na configuração para cada target de build, que permite substituir qualquer arquivo no programa TypeScript com uma versão específica do target desse arquivo.
Isso é útil para incluir código ou variáveis específicas do target em um build que visa um ambiente específico, como produção ou staging.

Por padrão, nenhum arquivo é substituído, no entanto `ng generate environments` configura isso automaticamente.
Você pode alterar ou adicionar substituições de arquivo para targets de build específicos editando a configuração `angular.json` diretamente.

```json

  "configurations": {
    "development": {
      "fileReplacements": [
          {
            "replace": "src/environments/environment.ts",
            "with": "src/environments/environment.development.ts"
          }
        ],
        …

```

Isso significa que quando você faz o build da sua configuração de desenvolvimento com `ng build --configuration development`, o arquivo `src/environments/environment.ts` é substituído pela versão específica do target do arquivo, `src/environments/environment.development.ts`.

Para adicionar um ambiente de staging, crie uma cópia de `src/environments/environment.ts` chamada `src/environments/environment.staging.ts`, e então adicione uma configuração `staging` ao `angular.json`:

```json

  "configurations": {
    "development": { … },
    "production": { … },
    "staging": {
      "fileReplacements": [
        {
          "replace": "src/environments/environment.ts",
          "with": "src/environments/environment.staging.ts"
        }
      ]
    }
  }

```

Você pode adicionar mais opções de configuração a este ambiente de target também.
Qualquer opção que seu build suporte pode ser sobrescrita em uma configuração de target de build.

Para fazer o build usando a configuração de staging, execute o seguinte comando:

```shell

ng build --configuration staging

```

Por padrão, o target `build` inclui configurações `production` e `development` e `ng serve` usa o build de desenvolvimento da aplicação.
Você também pode configurar `ng serve` para usar a configuração de build visada se você definir a opção `buildTarget`:

```json

  "serve": {
    "builder": "@angular-devkit/build-angular:dev-server",
    "options": { … },
    "configurations": {
      "development": {
        // Use the `development` configuration of the `build` target.
        "buildTarget": "my-app:build:development"
      },
      "production": {
        // Use the `production` configuration of the `build` target.
        "buildTarget": "my-app:build:production"
      }
    },
    "defaultConfiguration": "development"
  },

```

A opção `defaultConfiguration` especifica qual configuração é usada por padrão.
Quando `defaultConfiguration` não está definida, `options` são usadas diretamente sem modificação.
