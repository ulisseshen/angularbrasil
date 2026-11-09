<!-- ia-translate: true -->

# Testes unitários

Testar sua aplicação Angular ajuda você a verificar se ela está funcionando como você espera. Testes unitários são essenciais para identificar bugs cedo, garantir a qualidade do código e facilitar refatorações seguras.

NOTE: Este guia cobre a configuração de testes padrão para novos projetos do Angular CLI, que usa o Vitest. Se você estiver migrando um projeto existente do Karma, veja o [guia de migração do Karma para o Vitest](guide/testing/migrating-to-vitest). O Karma continua sendo suportado; para mais informações, veja o [guia de testes com Karma](guide/testing/karma).

## Configurar para testes {#set-up-for-testing}

O Angular CLI baixa e instala tudo o que você precisa para testar uma aplicação Angular com o [framework de testes Vitest](https://vitest.dev). Novos projetos já incluem `vitest` e `jsdom` por padrão.

O Vitest executa seus testes unitários em um ambiente Node.js. Para simular o DOM do browser, o Vitest usa uma biblioteca chamada `jsdom`. Isso torna a execução dos testes mais rápida, pois evita o custo de iniciar um browser. Você pode trocar o `jsdom` por uma alternativa, como o `happy-dom`, instalando-a e desinstalando o `jsdom`. Atualmente, `jsdom` e `happy-dom` são as bibliotecas de emulação de DOM suportadas.

O projeto que você cria com o CLI já está pronto para ser testado. Execute o comando [`ng test`](cli/test):

```shell
ng test
```

O comando `ng test` faz o build da aplicação em _modo watch_ e inicia o [test runner Vitest](https://vitest.dev).

A saída do console se parece com isto:

```shell
 ✓ src/app/app.spec.ts (2)
   ✓ App should create the app
   ✓ App should render title
 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  18:18:01
   Duration  2.46s (transform 615ms, setup 2ms, collect 2.21s, tests 5ms)
```

O comando `ng test` também monitora seus arquivos em busca de alterações. Se você modificar um arquivo e salvar, os testes serão executados novamente.

## Configuração {#configuration}

O Angular CLI cuida da maior parte da configuração do Vitest para você. Você pode personalizar o comportamento dos testes modificando as opções do target `test` no seu arquivo `angular.json`.

### Opções do angular.json {#angularjson-options}

- `include`: padrões glob dos arquivos a serem incluídos nos testes. O padrão é `['**/*.spec.ts', '**/*.test.ts']`.
- `exclude`: padrões glob dos arquivos a serem excluídos dos testes.
- `setupFiles`: uma lista de caminhos para arquivos de configuração global (por exemplo, polyfills ou mocks globais) que são executados antes dos seus testes.
- `providersFile`: o caminho para um arquivo que exporta, como padrão, um array de providers do Angular para o ambiente de teste. É útil para configurar providers globais de teste, que são injetados nos seus testes.
- `coverage`: um booleano para habilitar ou desabilitar o relatório de cobertura de código. O padrão é `false`.
- `browsers`: um array com os nomes de browsers nos quais os testes serão executados (por exemplo, `["chromium"]`). Requer que um provider de browser esteja instalado. Veja a seção [Executando testes em um browser](#running-tests-in-a-browser) para mais detalhes.

### Configuração global de testes e providers {#global-test-setup-and-providers}

As opções `setupFiles` e `providersFile` são especialmente úteis para gerenciar a configuração global de testes.

Por exemplo, você pode criar um arquivo `src/test-providers.ts` para fornecer o `provideHttpClientTesting` a todos os seus testes:

```typescript {header: "src/test-providers.ts"}
import {EnvironmentProviders, Provider} from '@angular/core';
import {provideHttpClientTesting} from '@angular/common/http/testing';

const testProviders: (Provider | EnvironmentProviders)[] = [provideHttpClientTesting()];

export default testProviders;
```

Em seguida, você referencia esse arquivo no seu `angular.json`:

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "providersFile": "src/test-providers.ts"
          }
        }
      }
    }
  }
}
```

HELPFUL: Ao criar novos arquivos TypeScript para configuração de testes ou providers, como `src/test-providers.ts`, certifique-se de que eles estejam incluídos no arquivo de configuração TypeScript de testes do projeto (normalmente `tsconfig.spec.json`). Isso permite que o compilador TypeScript processe corretamente esses arquivos durante a execução dos testes.

### Configuração avançada do Vitest {#advanced-vitest-configuration}

Para casos de uso avançados, você pode fornecer um arquivo de configuração personalizado do Vitest usando a opção `runnerConfig` no `angular.json`.

IMPORTANT: Embora o uso de uma configuração personalizada habilite opções avançadas, a equipe do Angular não oferece suporte ao conteúdo do arquivo de configuração nem a quaisquer plugins de terceiros. O CLI também sobrescreverá algumas propriedades (`test.projects`, `test.include`) para garantir a integração adequada.

Você pode criar um arquivo de configuração do Vitest (por exemplo, `vitest-base.config.ts`) e referenciá-lo no seu `angular.json`:

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "runnerConfig": "vitest-base.config.ts"
          }
        }
      }
    }
  }
}
```

Você também pode gerar um arquivo de configuração base usando o CLI:

```shell
ng generate config vitest
```

Isso cria um arquivo `vitest-base.config.ts` que você pode personalizar.

HELPFUL: Leia mais sobre a configuração do Vitest na [documentação oficial do Vitest](https://vitest.dev/config/).

## Cobertura de código {#code-coverage}

Você pode gerar um relatório de cobertura de código adicionando a flag `--coverage` ao comando `ng test`. O relatório é gerado no diretório `coverage/`.

Para informações mais detalhadas, veja o [guia de cobertura de código](guide/testing/code-coverage).

## Executando testes em um browser {#running-tests-in-a-browser}

Embora o ambiente Node.js padrão seja mais rápido para a maioria dos testes unitários, você também pode executar seus testes em um browser real. Isso é útil para testes que dependem de APIs específicas do browser (como renderização) ou para depuração.

Para executar testes em um browser, primeiro você precisa instalar um provider de browser. Leia mais sobre o modo browser do Vitest na [documentação oficial](https://vitest.dev/guide/browser).

Depois que o provider estiver instalado, você pode executar seus testes no browser configurando a opção `browsers` no `angular.json` ou usando a flag `--browsers` do CLI. Por padrão, os testes são executados em um browser com interface gráfica. Se a variável de ambiente `CI` estiver definida, o modo headless é usado no lugar. Para controlar explicitamente o modo headless, você pode adicionar o sufixo `Headless` ao nome do browser (por exemplo, `chromiumHeadless`).

```bash
# Exemplo para Playwright (com interface gráfica)
ng test --browsers=chromium

# Exemplo para Playwright (headless)
ng test --browsers=chromiumHeadless

# Exemplo para WebdriverIO (com interface gráfica)
ng test --browsers=chrome

# Exemplo para WebdriverIO (headless)
ng test --browsers=chromeHeadless
```

Escolha um dos seguintes providers de browser, de acordo com as suas necessidades:

### Playwright

[Playwright](https://playwright.dev/) é uma biblioteca de automação de browser que oferece suporte a Chromium, Firefox e WebKit.

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install --save-dev @vitest/browser-playwright playwright
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add --dev @vitest/browser-playwright playwright
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add -D @vitest/browser-playwright playwright
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add --dev @vitest/browser-playwright playwright
  </docs-code>
</docs-code-multifile>

### WebdriverIO

[WebdriverIO](https://webdriver.io/) é um framework de testes de automação para browsers e dispositivos móveis que oferece suporte a Chrome, Firefox, Safari e Edge.

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install --save-dev @vitest/browser-webdriverio webdriverio
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add --dev @vitest/browser-webdriverio webdriverio
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add -D @vitest/browser-webdriverio webdriverio
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add --dev @vitest/browser-webdriverio webdriverio
  </docs-code>
</docs-code-multifile>

### Preview

O provider `@vitest/browser-preview` foi projetado para ambientes WebContainer, como o StackBlitz, e não é indicado para uso em CI/CD.

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install --save-dev @vitest/browser-preview
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add --dev @vitest/browser-preview
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add -D @vitest/browser-preview
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add --dev @vitest/browser-preview
  </docs-code>
</docs-code-multifile>

HELPFUL: Para configurações mais avançadas específicas de browser, veja a seção [Configuração avançada do Vitest](#advanced-vitest-configuration).

## Outros frameworks de teste {#other-test-frameworks}

Você também pode executar testes unitários de uma aplicação Angular com outras bibliotecas e test runners. Cada biblioteca e runner tem seus próprios procedimentos de instalação, configuração e sintaxe.

## Testes em integração contínua {#testing-in-continuous-integration}

Um conjunto de testes robusto é parte essencial de um pipeline de integração contínua (CI). Servidores de CI permitem automatizar seus testes para serem executados em cada commit e pull request.

Para testar sua aplicação Angular em um servidor de CI, execute o comando de teste padrão:

```shell
ng test
```

A maioria dos servidores de CI define a variável de ambiente `CI=true`, que o `ng test` detecta. Isso configura automaticamente seus testes para serem executados em modo não interativo, com uma única execução.

Se o seu servidor de CI não definir essa variável, ou se você precisar forçar manualmente o modo de execução única, pode usar as flags `--no-watch` e `--no-progress`:

```shell
ng test --no-watch --no-progress
```

## Mais informações sobre testes {#more-information-on-testing}

Depois de configurar sua aplicação para testes, você pode achar úteis os seguintes guias de testes.

|                                                                    | Detalhes                                                                          |
| :----------------------------------------------------------------- | :-------------------------------------------------------------------------------- |
| [Cobertura de código](guide/testing/code-coverage)                 | Quanto da sua aplicação os testes estão cobrindo e como especificar quantidades mínimas exigidas. |
| [Testando services](guide/testing/services)                        | Como testar os services que sua aplicação usa.                                    |
| [Fundamentos de testes de components](guide/testing/components-basics) | Fundamentos dos testes de components Angular.                                 |
| [Cenários de testes de components](guide/testing/components-scenarios) | Diversos tipos de cenários e casos de uso de testes de components.           |
| [Testando attribute directives](guide/testing/attribute-directives) | Como testar suas attribute directives.                                           |
| [Testando pipes](guide/testing/pipes)                              | Como testar pipes.                                                                |
| [Depurando testes](guide/testing/debugging)                        | Bugs comuns em testes.                                                            |
| [Testando APIs utilitárias](guide/testing/utility-apis)            | Recursos de teste do Angular.                                                     |
