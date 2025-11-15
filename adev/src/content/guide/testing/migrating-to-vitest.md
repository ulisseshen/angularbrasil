<!-- ia-translate: true -->
# Migrando de Karma para Vitest

O Angular CLI usa [Vitest](https://vitest.dev/) como test runner de teste unitário padrão para novos projetos. Este guia fornece instruções para migrar um projeto existente de Karma e Jasmine para Vitest.

IMPORTANT: Migrar um projeto existente para Vitest é considerado experimental. Este processo também requer o uso do sistema de build `application`, que é o padrão para todos os projetos recém-criados.

## Passos de migração manual

Antes de usar o schematic de refatoração automatizada, você deve atualizar manualmente seu projeto para usar o test runner Vitest.

### 1. Instalar dependências

Instale `vitest` e uma biblioteca de emulação DOM. Embora testes em browser ainda sejam possíveis (veja [passo 5](#5-configure-browser-mode-optional)), Vitest usa uma biblioteca de emulação DOM por padrão para simular um ambiente de browser dentro do Node.js para execução de teste mais rápida. O CLI detecta e usa automaticamente `happy-dom` se estiver instalado; caso contrário, faz fallback para `jsdom`. Você deve ter um desses pacotes instalado.

<docs-code-multifile>
  <docs-code header="pnpm" language="shell">
    pnpm add -D vitest jsdom
  </docs-code>
  <docs-code header="npm" language="shell">
    npm install --save-dev vitest jsdom
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add --dev vitest jsdom
  </docs-code>
</docs-code-multifile>

### 2. Atualizar `angular.json`

No seu arquivo `angular.json`, encontre o target `test` para seu projeto e mude o `builder` para `@angular/build:unit-test`.

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

O builder `unit-test` usa como padrão `"tsConfig": "tsconfig.spec.json"` e `"buildTarget": "::development"`. Você pode definir explicitamente essas opções se seu projeto requer valores diferentes. Por exemplo, se a configuração de build `development` está faltando ou você precisa de opções diferentes para teste, você pode criar e usar uma configuração de build `testing` ou com nome similar para `buildTarget`.

O builder `@angular/build:karma` anteriormente permitia que opções de build (como `polyfills`, `assets` ou `styles`) fossem configuradas diretamente dentro do target `test`. O novo builder `@angular/build:unit-test` não suporta isso. Se suas opções de build específicas de teste diferem de sua configuração de build `development` existente, você deve movê-las para uma configuração de target de build dedicada. Se suas opções de build de teste já correspondem à sua configuração de build `development`, nenhuma ação é necessária.

### 3. Lidar com configurações personalizadas de `karma.conf.js`

Configurações personalizadas em `karma.conf.js` não são migradas automaticamente. Antes de excluir seu arquivo `karma.conf.js`, revise-o para quaisquer configurações personalizadas que precisem ser migradas.

Muitas opções do Karma têm equivalentes no Vitest que podem ser definidas em um arquivo de configuração Vitest personalizado (por exemplo, `vitest.config.ts`) e vinculadas ao seu `angular.json` via opção `runnerConfig`.

Caminhos de migração comuns incluem:

- **Reporters**: Reporters do Karma devem ser substituídos por reporters compatíveis com Vitest. Estes podem frequentemente ser configurados diretamente em seu `angular.json` sob a propriedade `test.options.reporters`. Para configurações mais avançadas, use um arquivo `vitest.config.ts` personalizado.
- **Plugins**: Plugins do Karma podem ter equivalentes no Vitest que você precisará encontrar e instalar. Note que cobertura de código é um recurso de primeira classe no Angular CLI e pode ser habilitado com `ng test --coverage`.
- **Custom Browser Launchers**: Estes são substituídos pela opção `browsers` em `angular.json` e pela instalação de um provider de browser como `@vitest/browser-playwright`.

Para outras configurações, consulte a [documentação oficial do Vitest](https://vitest.dev/config/).

### 4. Remover arquivos Karma e `test.ts`

Você pode agora excluir `karma.conf.js` e `src/test.ts` do seu projeto e desinstalar os pacotes relacionados ao Karma. Os seguintes comandos são baseados nos pacotes instalados em um novo projeto Angular CLI; seu projeto pode ter outros pacotes relacionados ao Karma para remover.

<docs-code-multifile>
  <docs-code header="pnpm" language="shell">
    pnpm remove karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter
  </docs-code>
  <docs-code header="npm" language="shell">
    npm uninstall karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn remove karma karma-chrome-launcher karma-coverage karma-jasmine karma-jasmine-html-reporter
  </docs-code>
</docs-code-multifile>

### 5. Configurar modo browser (opcional)

Se você precisar executar testes em um browser real, deve instalar um provider de browser e configurar seu `angular.json`.

**Instalar um provider de browser:**

Escolha um dos seguintes providers de browser baseado em suas necessidades:

- **Playwright**: `@vitest/browser-playwright` para Chromium, Firefox e WebKit.
- **WebdriverIO**: `@vitest/browser-webdriverio` para Chrome, Firefox, Safari e Edge.
- **Preview**: `@vitest/browser-preview` para ambientes Webcontainer (como StackBlitz).

<docs-code-multifile>
  <docs-code header="pnpm" language="shell">
    pnpm add -D @vitest/browser-playwright
  </docs-code>
  <docs-code header="npm" language="shell">
    npm install --save-dev @vitest/browser-playwright
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add --dev @vitest/browser-playwright
  </docs-code>
</docs-code-multifile>

**Atualizar `angular.json` para modo browser:**

Adicione a opção `browsers` às opções do seu target `test`. O nome do browser depende do provider que você instalou (por exemplo, `chromium` para Playwright, `chrome` para WebdriverIO).

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

O modo headless é habilitado automaticamente se a variável de ambiente `CI` estiver definida ou se um nome de browser incluir "Headless" (por exemplo, `ChromeHeadless`). Caso contrário, os testes serão executados em um browser headed.

## Refatoração automatizada de testes com schematics

IMPORTANT: O schematic `refactor-jasmine-vitest` é experimental e pode não cobrir todos os padrões de teste possíveis. Sempre revise as mudanças feitas pelo schematic.

O Angular CLI fornece o schematic `refactor-jasmine-vitest` para refatorar automaticamente seus testes Jasmine para usar Vitest.

### Visão geral

O schematic automatiza as seguintes transformações em seus arquivos de teste (`.spec.ts`):

- Converte `fit` e `fdescribe` para `it.only` e `describe.only`.
- Converte `xit` e `xdescribe` para `it.skip` e `describe.skip`.
- Converte chamadas `spyOn` para o equivalente `vi.spyOn`.
- Substitui `jasmine.objectContaining` com `expect.objectContaining`.
- Substitui `jasmine.any` com `expect.any`.
- Substitui `jasmine.createSpy` com `vi.fn`.
- Atualiza `beforeAll`, `beforeEach`, `afterAll` e `afterEach` para seus equivalentes Vitest.
- Converte `fail()` para `vi.fail()` do Vitest.
- Ajusta expectations para corresponder às APIs do Vitest
- Adiciona comentários TODO para código que não pode ser convertido automaticamente

O schematic **não** realiza as seguintes ações:

- Não instala `vitest` ou outras dependências relacionadas.
- Não muda seu `angular.json` para usar o builder Vitest ou migra quaisquer opções de build (como `polyfills` ou `styles`) do target `test`.
- Não remove arquivos `karma.conf.js` ou `test.ts`.
- Não lida com cenários de spy complexos ou aninhados, que podem requerer refatoração manual.

### Executando o schematic

Depois que seu projeto estiver configurado para Vitest, você pode executar o schematic para refatorar seus arquivos de teste.

Para refatorar **todos** os arquivos de teste em seu projeto padrão, execute:

```bash
ng g @schematics/angular:refactor-jasmine-vitest
```

### Opções

Você pode usar as seguintes opções para customizar o comportamento do schematic:

| Opção                    | Descrição                                                                                           |
| :----------------------- | :-------------------------------------------------------------------------------------------------- |
| `--project <name>`       | Especifique o projeto a refatorar em um workspace multi-projeto. <br> Exemplo: `--project=my-lib`      |
| `--include <path>`       | Refatore apenas um arquivo ou diretório específico. <br> Exemplo: `--include=src/app/app.component.spec.ts` |
| `--file-suffix <suffix>` | Especifique um sufixo de arquivo diferente para arquivos de teste. <br> Exemplo: `--file-suffix=.test.ts`              |
| `--add-imports`          | Adicione imports `vitest` explícitos se você desabilitou globals em sua configuração Vitest.            |
| `--verbose`              | Veja logging detalhado de todas as transformações aplicadas.                                                |

### Após migrar

Após o schematic completar, é uma boa prática:

1.  **Execute seus testes**: Execute `ng test` para garantir que todos os testes ainda passam após a refatoração.
2.  **Revise as mudanças**: Examine as mudanças feitas pelo schematic, prestando atenção especial a quaisquer testes complexos, especialmente aqueles com spies ou mocks intrincados, pois eles podem requerer ajustes manuais adicionais.

O comando `ng test` builda a aplicação no modo _watch_ e lança o runner configurado. O modo watch é habilitado por padrão ao usar um terminal interativo e não executando em CI.

## Configuração

O Angular CLI cuida da configuração do Vitest para você, construindo a configuração completa na memória baseada em opções em `angular.json`.

### Configuração personalizada do Vitest

IMPORTANT: Embora usar uma configuração personalizada habilite opções avançadas, a equipe do Angular não fornece suporte direto para o conteúdo específico do arquivo de configuração ou para quaisquer plugins de terceiros usados dentro dele. O CLI também sobrescreverá certas propriedades (`test.projects`, `test.include`) para garantir operação adequada.

Você pode fornecer um arquivo de configuração Vitest personalizado para sobrescrever as configurações padrão. Para uma lista completa de opções disponíveis, veja a [documentação oficial do Vitest](https://vitest.dev/config/).

**1. Caminho direto:**
Forneça um caminho direto para um arquivo de configuração Vitest em seu `angular.json`:

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": { "runnerConfig": "vitest.config.ts" }
        }
      }
    }
  }
}
```

**2. Busca automática por configuração base:**
Se você definir `runnerConfig` como `true`, o builder automaticamente procurará por um arquivo `vitest-base.config.*` compartilhado em suas raízes de projeto e workspace.

## Relatórios de bugs

Relate problemas e solicitações de recursos no [GitHub](https://github.com/angular/angular-cli/issues).

Por favor, forneça uma reprodução mínima quando possível para ajudar a equipe a resolver problemas.
