<!-- ia-translate: true -->

# Migrando de Karma para Vitest {#migrating-from-karma-to-vitest}

O Angular CLI usa [Vitest](https://vitest.dev/) como test runner unitário padrão para novos projetos. Este guia fornece instruções para migrar um projeto existente de Karma e Jasmine para Vitest.

IMPORTANT: Migrar um projeto existente para Vitest é considerado experimental. Este processo também exige o uso do sistema de build `application`, que é o padrão para todos os projetos recém-criados.

## Passos de migração manual {#manual-migration-steps}

Antes de usar o schematic de refatoração automatizada, você deve atualizar manualmente seu projeto para usar o test runner Vitest.

### 1. Instalar dependências {#1-install-dependencies}

Instale `vitest` e uma biblioteca de emulação de DOM. Embora testes em browser ainda sejam possíveis (veja o [passo 5](#5-configure-browser-mode-optional)), o Vitest usa, por padrão, uma biblioteca de emulação de DOM para simular um ambiente de browser dentro do Node.js, o que deixa a execução dos testes mais rápida. O CLI detecta e usa automaticamente o `happy-dom` se ele estiver instalado; caso contrário, usa o `jsdom` como alternativa. Você deve ter um desses pacotes instalado.

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install --save-dev vitest jsdom
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add --dev vitest jsdom
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add -D vitest jsdom
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add --dev vitest jsdom
  </docs-code>
</docs-code-multifile>

### 2. Atualizar `angular.json` {#2-update-angularjson}

No seu arquivo `angular.json`, encontre o target `test` do seu projeto e altere o `builder` para `@angular/build:unit-test`.

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test"
        }
      }
    }
  }
}
```

O builder `unit-test` usa, por padrão, `"tsConfig": "tsconfig.spec.json"` e `"buildTarget": "::development"`. Você pode definir essas opções explicitamente se o seu projeto exigir valores diferentes. Por exemplo, se a configuração de build `development` não existir ou se você precisar de opções diferentes para os testes, pode criar e usar uma configuração de build `testing` ou com nome semelhante para o `buildTarget`.

O builder `@angular/build:karma` permitia anteriormente que opções de build (como `polyfills`, `assets` ou `styles`) fossem configuradas diretamente dentro do target `test`. O novo builder `@angular/build:unit-test` não oferece suporte a isso. Se as opções de build específicas para teste forem diferentes da sua configuração de build `development`, você deve movê-las para uma configuração de target de build dedicada. Se as suas opções de build de teste já corresponderem à configuração `development`, nenhuma ação é necessária.

### 3. Lidar com configurações personalizadas de `karma.conf.js` {#3-handle-custom-karmaconfjs-configurations}

Configurações personalizadas em `karma.conf.js` não são migradas automaticamente. Antes de excluir o arquivo `karma.conf.js`, revise-o em busca de configurações personalizadas que precisem ser migradas.

Muitas opções do Karma têm equivalentes no Vitest, que podem ser definidas em um arquivo de configuração personalizado do Vitest (por exemplo, `vitest.config.ts`) e vinculadas ao seu `angular.json` pela opção `runnerConfig`.

Caminhos de migração comuns incluem:

- **Reporters**: os reporters do Karma devem ser substituídos por reporters compatíveis com o Vitest. Eles podem frequentemente ser configurados diretamente no seu `angular.json`, na propriedade `test.options.reporters`. Para configurações mais avançadas, use um arquivo `vitest.config.ts` personalizado.
- **Plugins**: plugins do Karma podem ter equivalentes no Vitest que você precisará encontrar e instalar. Observe que a cobertura de código é um recurso nativo do Angular CLI e pode ser habilitada com `ng test --coverage`.
- **Custom Browser Launchers**: são substituídos pela opção `browsers` no `angular.json` e pela instalação de um provider de browser, como `@vitest/browser-playwright`.

Para outras configurações, consulte a [documentação oficial do Vitest](https://vitest.dev/config/).

### 4. Remover arquivos Karma e `test.ts` {#4-remove-karma-and-testts-files}

Agora você pode excluir `karma.conf.js` e `src/test.ts` do seu projeto e desinstalar os pacotes relacionados ao Karma. Os comandos a seguir são baseados nos pacotes instalados em um novo projeto Angular CLI; o seu projeto pode ter outros pacotes relacionados ao Karma para remover.

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm uninstall karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn remove karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm remove karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core
  </docs-code>
  <docs-code header="bun" language="shell">
    bun remove karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter jasmine-core
  </docs-code>
</docs-code-multifile>

### 5. Configurar modo browser (opcional) {#5-configure-browser-mode-optional}

Se você precisar executar testes em um browser real, deve instalar um provider de browser e configurar o seu `angular.json`.

**Instalar um provider de browser:**

Escolha um dos seguintes providers de browser, de acordo com as suas necessidades:

- **Playwright**: `@vitest/browser-playwright` para Chromium, Firefox e WebKit.
- **WebdriverIO**: `@vitest/browser-webdriverio` para Chrome, Firefox, Safari e Edge.
- **Preview**: `@vitest/browser-preview` para ambientes WebContainer (como o StackBlitz).

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install --save-dev @vitest/browser-playwright
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add --dev @vitest/browser-playwright
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add -D @vitest/browser-playwright
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add --dev @vitest/browser-playwright
  </docs-code>
</docs-code-multifile>

**Atualizar `angular.json` para o modo browser:**

Adicione a opção `browsers` às opções do target `test`. O nome do browser depende do provider que você instalou (por exemplo, `chromium` para o Playwright, `chrome` para o WebdriverIO).

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "browsers": ["chromium"]
          }
        }
      }
    }
  }
}
```

O modo headless é habilitado automaticamente se a variável de ambiente `CI` estiver definida ou se um nome de browser incluir "Headless" (por exemplo, `ChromeHeadless`). Caso contrário, os testes serão executados em um browser com interface gráfica.

## Refatoração automatizada de testes com schematics {#automated-test-refactoring-with-schematics}

IMPORTANT: O schematic `refactor-jasmine-vitest` é experimental e pode não cobrir todos os padrões de teste possíveis. Sempre revise as alterações feitas pelo schematic.

O Angular CLI fornece o schematic `refactor-jasmine-vitest` para refatorar automaticamente seus testes Jasmine para usar o Vitest.

### Visão geral {#overview}

O schematic automatiza as seguintes transformações nos seus arquivos de teste (`.spec.ts`):

- Converte `fit` e `fdescribe` para `it.only` e `describe.only`.
- Converte `xit` e `xdescribe` para `it.skip` e `describe.skip`.
- Converte chamadas `spyOn` para o equivalente `vi.spyOn`.
- Substitui `jasmine.objectContaining` por `expect.objectContaining`.
- Substitui `jasmine.any` por `expect.any`.
- Substitui `jasmine.createSpy` por `vi.fn`.
- Atualiza `beforeAll`, `beforeEach`, `afterAll` e `afterEach` para os equivalentes do Vitest.
- Converte `fail()` para o `expect.fail()` do Vitest.
- Ajusta as expectations para corresponder às APIs do Vitest.
- Adiciona comentários TODO para o código que não pode ser convertido automaticamente.

O schematic **não** realiza as seguintes ações:

- Não instala o `vitest` ou outras dependências relacionadas.
- Não altera seu `angular.json` para usar o builder do Vitest nem migra opções de build (como `polyfills` ou `styles`) do target `test`.
- Não remove os arquivos `karma.conf.js` ou `test.ts`.
- Não lida com cenários de spies complexos ou aninhados, que podem exigir refatoração manual.

### Executando o schematic {#running-the-schematic}

Depois que o seu projeto estiver configurado para o Vitest, você pode executar o schematic para refatorar seus arquivos de teste.

Para refatorar **todos** os arquivos de teste do seu projeto padrão, execute:

```bash
ng g @schematics/angular:refactor-jasmine-vitest
```

### Opções {#options}

Você pode usar as seguintes opções para personalizar o comportamento do schematic:

| Opção                    | Descrição                                                                                                    |
| :----------------------- | :----------------------------------------------------------------------------------------------------------- |
| `--project <name>`       | Especifique o projeto a ser refatorado em um workspace com múltiplos projetos. <br> Exemplo: `--project=my-lib` |
| `--include <path>`       | Refatore apenas um arquivo ou diretório específico. <br> Exemplo: `--include=src/app/app.component.spec.ts`  |
| `--file-suffix <suffix>` | Especifique um sufixo de arquivo diferente para os arquivos de teste. <br> Exemplo: `--file-suffix=.test.ts`  |
| `--add-imports`          | Adicione imports explícitos de `vitest` se você desabilitou os globals na sua configuração do Vitest.        |
| `--verbose`              | Veja o log detalhado de todas as transformações aplicadas.                                                   |
| `--browser-mode`         | Use se você pretende executar os testes em modo browser.                                                     |

### Após migrar {#after-migrating}

Depois que o schematic terminar, é uma boa prática:

1.  **Execute seus testes**: execute `ng test` para garantir que todos os testes ainda passem após a refatoração.
2.  **Revise as alterações**: examine as mudanças feitas pelo schematic, prestando atenção especial a testes complexos, principalmente aqueles com spies ou mocks intrincados, pois eles podem exigir ajustes manuais adicionais.

O comando `ng test` faz o build da aplicação no _modo watch_ e inicia o runner configurado. O modo watch é habilitado por padrão ao usar um terminal interativo e não executar em CI.

## Configuração {#configuration}

O Angular CLI cuida da configuração do Vitest para você, construindo a configuração completa em memória com base nas opções definidas no `angular.json`.

### Configuração personalizada do Vitest {#custom-vitest-configuration}

IMPORTANT: Embora o uso de uma configuração personalizada habilite opções avançadas, a equipe do Angular não oferece suporte direto ao conteúdo específico do arquivo de configuração nem a quaisquer plugins de terceiros usados nele. O CLI também sobrescreverá algumas propriedades (`test.projects`, `test.include`) para garantir o funcionamento adequado.

Você pode fornecer um arquivo de configuração personalizado do Vitest para sobrescrever as configurações padrão. Para uma lista completa de opções disponíveis, veja a [documentação oficial do Vitest](https://vitest.dev/config/).

**1. Caminho direto:**
Forneça um caminho direto para um arquivo de configuração do Vitest no seu `angular.json`:

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {"runnerConfig": "vitest.config.ts"}
        }
      }
    }
  }
}
```

**2. Busca automática por configuração base:**
Se você definir `runnerConfig` como `true`, o builder procurará automaticamente por um arquivo `vitest-base.config.*` compartilhado nas raízes do projeto e do workspace.

## Patch do `zone.js` para o Vitest {#zonejs-vitest-patch}

Para usar funções como `fakeAsync`, `flush` ou `waitForAsync`, ou para fazer seus testes existentes funcionarem com elas, você pode adicionar `zone.js/plugins/vitest-patch` aos polyfills do target de teste no seu `angular.json`.

Independentemente disso, recomendamos fortemente que você comece a planejar a conversão das suas suítes de teste existentes para `async` nativo e fake timers do Vitest, pois essa é a abordagem consolidada.

Veja [um exemplo aqui](/guide/testing/components-scenarios#async-test-with-a-vitest-fake-timers) sobre o uso de fake timers com o Vitest.

## Relatórios de bugs {#bug-reports}

Relate problemas e solicitações de recursos no [GitHub](https://github.com/angular/angular-cli/issues).

Sempre que possível, forneça uma reprodução mínima para ajudar a equipe a resolver os problemas.
