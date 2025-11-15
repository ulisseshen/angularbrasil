<!-- ia-translate: true -->

# Configurando ambientes de aplicação

Você pode definir diferentes configurações de build nomeadas para seu projeto, como `development` e `staging`, com diferentes padrões.

Cada configuração nomeada pode ter padrões para qualquer uma das opções que se aplicam aos vários targets de builder, como `build`, `serve` e `test`.
Os comandos `build`, `serve` e `test` do [Angular CLI](tools/cli) podem então substituir arquivos pelas versões apropriadas para seu ambiente de destino pretendido.

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
            // Por padrão, desabilitar geração de source map.
            "sourceMap": false
          },
          "configurations": {
            // Para a configuração `debug`, habilitar source maps.
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

`@angular-devkit/build-angular:browser` suporta substituições de arquivo, uma opção para substituir arquivos fonte antes de executar um build.
Usar isso em combinação com `--configuration` fornece um mecanismo para configurar dados específicos de ambiente em sua aplicação.

Comece [gerando environments](cli/generate/environments) para criar o diretório `src/environments/` e configurar o projeto para usar substituições de arquivo.

```shell

ng generate environments

```

O diretório `src/environments/` do projeto contém o arquivo de configuração base, `environment.ts`, que fornece a configuração padrão para produção.
Você pode sobrescrever valores padrão para ambientes adicionais, como `development` e `staging`, em arquivos de configuração específicos de target.

Por exemplo:

```text

my-app/src/environments
├── environment.development.ts
├── environment.staging.ts
└── environment.ts

```

O arquivo base `environment.ts`, contém as configurações de ambiente padrão.
Por exemplo:

```ts

export const environment = {
  production: true
};

```

O comando `build` usa isso como target de build quando nenhum ambiente é especificado.
Você pode adicionar mais variáveis, seja como propriedades adicionais no objeto environment, ou como objetos separados.
Por exemplo, o seguinte adiciona um padrão para uma variável ao ambiente padrão:

```ts

export const environment = {
  production: true,
  apiUrl: 'http://my-prod-url'
};

```

Você pode adicionar arquivos de configuração específicos de target, como `environment.development.ts`.
O seguinte conteúdo define valores padrão para o target de build development:

```ts

export const environment = {
  production: false,
  apiUrl: 'http://my-dev-url'
};

```

## Usando variáveis específicas de ambiente na sua aplicação

Para usar as configurações de ambiente que você definiu, seus components devem importar o arquivo environments original:

```ts

import { environment } from './environments/environment';

```

Isso garante que os comandos build e serve possam encontrar as configurações para targets de build específicos.

O código a seguir no arquivo do component (`app.component.ts`) usa uma variável de ambiente definida nos arquivos de configuração.

```ts

import { environment } from './../environments/environment';

// Busca de `http://my-prod-url` em produção, `http://my-dev-url` em desenvolvimento.
fetch(environment.apiUrl);

```

O arquivo de configuração principal do CLI, `angular.json`, contém uma seção `fileReplacements` na configuração para cada target de build, que permite substituir qualquer arquivo no programa TypeScript por uma versão específica de target desse arquivo.
Isso é útil para incluir código ou variáveis específicas de target em um build que tem como alvo um ambiente específico, como produção ou staging.

Por padrão nenhum arquivo é substituído, no entanto `ng generate environments` configura essa configuração automaticamente.
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

Isso significa que quando você constrói sua configuração de desenvolvimento com `ng build --configuration development`, o arquivo `src/environments/environment.ts` é substituído pela versão específica de target do arquivo, `src/environments/environment.development.ts`.

Para adicionar um ambiente staging, crie uma cópia de `src/environments/environment.ts` chamada `src/environments/environment.staging.ts`, então adicione uma configuração `staging` ao `angular.json`:

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

Para construir usando a configuração staging, execute o seguinte comando:

```shell

ng build --configuration staging

```

Por padrão, o target `build` inclui configurações `production` e `development` e `ng serve` usa o build de desenvolvimento da aplicação.
Você também pode configurar `ng serve` para usar a configuração de build direcionada se definir a opção `buildTarget`:

```json

  "serve": {
    "builder": "@angular-devkit/build-angular:dev-server",
    "options": { … },
    "configurations": {
      "development": {
        // Usar a configuração `development` do target `build`.
        "buildTarget": "my-app:build:development"
      },
      "production": {
        // Usar a configuração `production` do target `build`.
        "buildTarget": "my-app:build:production"
      }
    },
    "defaultConfiguration": "development"
  },

```

A opção `defaultConfiguration` especifica qual configuração é usada por padrão.
Quando `defaultConfiguration` não está definida, `options` são usadas diretamente sem modificação.
