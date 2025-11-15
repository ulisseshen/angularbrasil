<!-- ia-translate: true -->
# Testando com Karma e Jasmine

Embora [Vitest](https://vitest.dev) seja o test runner padrão para novos projetos Angular, [Karma](https://karma-runner.github.io) ainda é um test runner suportado e amplamente usado. Este guia fornece instruções para testar sua aplicação Angular usando o test runner Karma com o framework de teste [Jasmine](https://jasmine.github.io).

## Configurando Karma e Jasmine

Você pode configurar Karma e Jasmine para um novo projeto ou adicioná-lo a um existente.

### Para Novos Projetos

Para criar um novo projeto com Karma e Jasmine pré-configurados, execute o comando `ng new` com a opção `--test-runner=karma`:

```shell
ng new my-karma-app --test-runner=karma
```

### Para Projetos Existentes

Para adicionar Karma e Jasmine a um projeto existente, siga estes passos:

1.  **Instale os pacotes necessários:**

    <docs-code-multifile>
      <docs-code header="pnpm" language="shell">
        pnpm add -D karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core @types/jasmine
      </docs-code>
      <docs-code header="npm" language="shell">
        npm install --save-dev karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core @types/jasmine
      </docs-code>
      <docs-code header="yarn" language="shell">
        yarn add --dev karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core @types/jasmine
      </docs-code>
    </docs-code-multifile>

2.  **Configure o test runner em `angular.json`:**

    No seu arquivo `angular.json`, encontre o target `test` e defina a opção `runner` como `karma`:

    ```json
    {
      // ...
      "projects": {
        "your-project-name": {
          // ...
          "architect": {
            "test": {
              "builder": "@angular/build:unit-test",
              "options": {
                "runner": "karma",
                // ... other options
              }
            }
          }
        }
      }
    }
    ```

3.  **Atualize `tsconfig.spec.json` para tipos Jasmine:**

    Para garantir que o TypeScript reconheça funções de teste globais como `describe` e `it`, adicione `"jasmine"` ao array `types` em seu `tsconfig.spec.json`:

    ```json
    {
      // ...
      "compilerOptions": {
        // ...
        "types": [
          "jasmine"
        ]
      },
      // ...
    }
    ```

## Executando Testes

Depois que seu projeto estiver configurado, execute os testes usando o comando [`ng test`](cli/test):

```shell
ng test
```

O comando `ng test` builda a aplicação no modo _watch_ e lança o [test runner Karma](https://karma-runner.github.io).

A saída do console parece com o seguinte:

```shell

02 11 2022 09:08:28.605:INFO [karma-server]: Karma v6.4.1 server started at http://localhost:9876/
02 11 2022 09:08:28.607:INFO [launcher]: Launching browsers Chrome with concurrency unlimited
02 11 2022 09:08:28.620:INFO [launcher]: Starting browser Chrome
02 11 2022 09:08:31.312:INFO [Chrome]: Connected on socket -LaEYvD2R7MdcS0-AAAB with id 31534482
Chrome: Executed 3 of 3 SUCCESS (0.193 secs / 0.172 secs)
TOTAL: 3 SUCCESS

```

A saída do teste é exibida no browser usando [Karma Jasmine HTML Reporter](https://github.com/dfederm/karma-jasmine-html-reporter).

<img alt="Jasmine HTML Reporter no browser" src="assets/images/guide/testing/initial-jasmine-html-reporter.png">

Clique em uma linha de teste para executar novamente apenas aquele teste ou clique em uma descrição para executar novamente os testes no grupo de teste selecionado ("test suite").

Enquanto isso, o comando `ng test` está observando mudanças. Para ver isso em ação, faça uma pequena alteração em um arquivo fonte e salve. Os testes executam novamente, o browser atualiza, e os novos resultados do teste aparecem.

## Configuração

O Angular CLI cuida da configuração do Jasmine e Karma para você. Ele constrói a configuração completa na memória, baseada em opções especificadas no arquivo `angular.json`.

### Personalizando Configuração do Karma

Se você quiser personalizar o Karma, pode criar um `karma.conf.js` executando o seguinte comando:

```shell

ng generate config karma

```

HELPFUL: Leia mais sobre configuração do Karma no [guia de configuração do Karma](http://karma-runner.github.io/6.4/config/configuration-file.html).

### Definindo o Test Runner em `angular.json`

Para definir explicitamente o Karma como test runner para seu projeto, localize o target `test` em seu arquivo `angular.json` e defina a opção `runner` como `karma`:

```json
{
  // ...
  "projects": {
    "your-project-name": {
      // ...
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "runner": "karma",
            // ... other options
          }
        }
      }
    }
  }
}
```

## Aplicação de cobertura de código

Para aplicar um nível mínimo de cobertura de código, você pode usar a propriedade `check` na seção `coverageReporter` do seu arquivo `karma.conf.js`.

Por exemplo, para requerer um mínimo de 80% de cobertura:

```javascript
coverageReporter: {
  dir: require('path').join(__dirname, './coverage/<project-name>'),
  subdir: '.',
  reporters: [
    { type: 'html' },
    { type: 'text-summary' }
  ],
  check: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
}
```

Isso fará com que a execução do teste falhe se os limites de cobertura especificados não forem atingidos.

## Testando em integração contínua

Para executar seus testes Karma em um ambiente CI, use o seguinte comando:

```shell
ng test --no-watch --no-progress --browsers=ChromeHeadless
```

NOTE: As flags `--no-watch` e `--no-progress` são cruciais para o Karma em ambientes CI para garantir que os testes executem uma vez e saiam de forma limpa. A flag `--browsers=ChromeHeadless` também é essencial para executar testes em um ambiente de browser sem uma interface gráfica.
