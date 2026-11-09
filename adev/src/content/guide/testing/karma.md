<!-- ia-translate: true -->

# Testando com Karma e Jasmine

Embora o [Vitest](https://vitest.dev) seja o test runner padrão para novos projetos Angular, o [Karma](https://karma-runner.github.io) ainda é um test runner suportado e amplamente usado. Este guia fornece instruções para testar sua aplicação Angular usando o test runner Karma com o framework de testes [Jasmine](https://jasmine.github.io).

## Configurando Karma e Jasmine {#setting-up-karma-and-jasmine}

Você pode configurar o Karma e o Jasmine para um novo projeto ou adicioná-los a um projeto existente.

### Para novos projetos {#for-new-projects}

Para criar um novo projeto com Karma e Jasmine pré-configurados, execute o comando `ng new` com a opção `--test-runner=karma`:

```shell
ng new my-karma-app --test-runner=karma
```

### Para projetos existentes {#for-existing-projects}

Para adicionar Karma e Jasmine a um projeto existente, siga estes passos:

1.  **Instale os pacotes necessários:**

    <docs-code-multifile>
      <docs-code header="npm" language="shell">
        npm install --save-dev karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core @types/jasmine
      </docs-code>
      <docs-code header="yarn" language="shell">
        yarn add --dev karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core @types/jasmine
      </docs-code>
      <docs-code header="pnpm" language="shell">
        pnpm add -D karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core @types/jasmine
      </docs-code>
      <docs-code header="bun" language="shell">
        bun add --dev karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core @types/jasmine
      </docs-code>
    </docs-code-multifile>

2.  **Configure o test runner no `angular.json`:**

    No seu arquivo `angular.json`, localize o target `test` e defina a opção `runner` como `karma`:

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
                "runner": "karma"
                // ... other options
              }
            }
          }
        }
      }
    }
    ```

3.  **Atualize o `tsconfig.spec.json` para os tipos do Jasmine:**

    Para garantir que o TypeScript reconheça funções globais de teste como `describe` e `it`, adicione `"jasmine"` ao array `types` do seu `tsconfig.spec.json`:

    ```json
    {
      // ...
      "compilerOptions": {
        // ...
        "types": ["jasmine"]
      }
      // ...
    }
    ```

## Executando testes {#running-tests}

Depois que o projeto estiver configurado, execute os testes usando o comando [`ng test`](cli/test):

```shell
ng test
```

O comando `ng test` builda a aplicação no _modo watch_ e inicia o [test runner Karma](https://karma-runner.github.io).

A saída do console se parece com o seguinte:

```shell

02 11 2022 09:08:28.605:INFO [karma-server]: Karma v6.4.1 server started at http://localhost:9876/
02 11 2022 09:08:28.607:INFO [launcher]: Launching browsers Chrome with concurrency unlimited
02 11 2022 09:08:28.620:INFO [launcher]: Starting browser Chrome
02 11 2022 09:08:31.312:INFO [Chrome]: Connected on socket -LaEYvD2R7MdcS0-AAAB with id 31534482
Chrome: Executed 3 of 3 SUCCESS (0.193 secs / 0.172 secs)
TOTAL: 3 SUCCESS

```

A saída dos testes é exibida no browser usando o [Karma Jasmine HTML Reporter](https://github.com/dfederm/karma-jasmine-html-reporter).

<img alt="Jasmine HTML Reporter no browser" src="assets/images/guide/testing/initial-jasmine-html-reporter.png">

Clique em uma linha de teste para executar novamente apenas aquele teste, ou clique em uma descrição para executar novamente os testes do grupo selecionado ("test suite").

Enquanto isso, o comando `ng test` continua observando alterações. Para ver isso em ação, faça uma pequena alteração em um arquivo de código-fonte e salve. Os testes são executados novamente, o browser é atualizado e os novos resultados aparecem.

## Configuração {#configuration}

O Angular CLI cuida da configuração do Jasmine e do Karma para você. Ele monta a configuração completa em memória, com base nas opções especificadas no arquivo `angular.json`.

### Personalizando a configuração do Karma {#customizing-karma-configuration}

Se você quiser personalizar o Karma, pode criar um `karma.conf.js` executando o seguinte comando:

```shell

ng generate config karma

```

HELPFUL: Leia mais sobre a configuração do Karma no [guia de configuração do Karma](https://karma-runner.github.io/6.4/config/configuration-file.html).

### Definindo o test runner no `angular.json` {#setting-the-test-runner-in-angularjson}

Para definir explicitamente o Karma como test runner do seu projeto, localize o target `test` no arquivo `angular.json` e defina a opção `runner` como `karma`:

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

## Imposição de cobertura de código {#code-coverage-enforcement}

Para impor um nível mínimo de cobertura de código, você pode usar a propriedade `check` na seção `coverageReporter` do seu arquivo `karma.conf.js`.

Por exemplo, para exigir um mínimo de 80% de cobertura:

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

Isso fará com que a execução dos testes falhe se os limites de cobertura especificados não forem atingidos.

## Testando em integração contínua {#testing-in-continuous-integration}

Para executar seus testes Karma em um ambiente de CI, use o seguinte comando:

```shell
ng test --no-watch --no-progress --browsers=ChromeHeadless
```

NOTE: As flags `--no-watch` e `--no-progress` são essenciais para o Karma em ambientes de CI, para garantir que os testes sejam executados uma única vez e encerrem de forma limpa. A flag `--browsers=ChromeHeadless` também é essencial para executar testes em um ambiente de browser sem interface gráfica.

## Debug de testes {#debugging-tests}

Se seus testes não estiverem funcionando como você espera, você pode inspecionar e fazer debug deles no browser.

Para fazer debug de uma aplicação com o test runner Karma:

1.  Revele a janela do browser do Karma. Veja [Configurar testes](guide/testing#set-up-for-testing) se você precisar de ajuda com este passo.
2.  Clique no botão **DEBUG** para abrir uma nova aba do browser e executar os testes novamente.
3.  Abra as **Ferramentas do Desenvolvedor** do browser. No Windows, pressione `Ctrl-Shift-I`. No macOS, pressione `Command-Option-I`.
4.  Escolha a seção **Sources**.
5.  Pressione `Control/Command-P` e comece a digitar o nome do seu arquivo de teste para abri-lo.
6.  Defina um breakpoint no teste.
7.  Atualize o browser e observe como ele para no breakpoint.

<img alt="Debug com Karma" src="assets/images/guide/testing/karma-1st-spec-debug.png">
