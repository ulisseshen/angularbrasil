<!-- ia-translate: true -->
# Testes End-to-End

Testes end-to-end ou (E2E) são uma forma de teste usada para validar que sua aplicação inteira funciona como esperado do início ao fim ou _"end-to-end"_ (de ponta a ponta). Testes E2E diferem de testes unitários por serem completamente desacoplados dos detalhes de implementação subjacentes do seu código. Eles são tipicamente usados para validar uma aplicação de uma maneira que imita como um usuário interagiria com ela. Esta página serve como um guia para começar com testes end-to-end no Angular usando o Angular CLI.

## Configurar Testes E2E

O Angular CLI baixa e instala tudo que você precisa para executar testes end-to-end para sua aplicação Angular.

```shell

ng e2e

```

O comando `ng e2e` irá primeiro verificar seu projeto pelo target "e2e". Se não conseguir localizá-lo, o CLI irá então perguntar qual pacote e2e você gostaria de usar e irá guiá-lo através da configuração.

```text

Cannot find "e2e" target for the specified project.
You can add a package that implements these capabilities.

For example:
Cypress: ng add @cypress/schematic
Nightwatch: ng add @nightwatch/schematics
WebdriverIO: ng add @wdio/schematics
Playwright: ng add playwright-ng-schematics
Puppeteer: ng add @puppeteer/ng-schematics

Would you like to add a package with "e2e" capabilities now?
No
❯ Cypress
Nightwatch
WebdriverIO
Playwright
Puppeteer

```

Se você não encontrar o test runner que gostaria de usar na lista acima, você pode adicionar manualmente um pacote usando `ng add`.

## Executando Testes E2E

Agora que sua aplicação está configurada para testes end-to-end, podemos executar o mesmo comando para rodar seus testes.

```shell

ng e2e

```

Note que não há nada "especial" sobre executar seus testes com qualquer um dos pacotes e2e integrados. O comando `ng e2e` está realmente apenas executando o builder `e2e` por baixo dos panos. Você sempre pode [criar seu próprio builder personalizado](tools/cli/cli-builder#creating-a-builder) chamado `e2e` e executá-lo usando `ng e2e`.

## Mais informações sobre ferramentas de testes end-to-end

| Ferramenta de Testes | Detalhes                                                                                                             |
| :------------------- | :------------------------------------------------------------------------------------------------------------------- |
| Cypress              | [Começando com Cypress](https://docs.cypress.io/guides/end-to-end-testing/writing-your-first-end-to-end-test)       |
| Nightwatch           | [Começando com Nightwatch](https://nightwatchjs.org/guide/writing-tests/introduction.html)                          |
| WebdriverIO          | [Começando com Webdriver.io](https://webdriver.io/docs/gettingstarted)                                              |
| Playwright           | [Começando com Playwright](https://playwright.dev/docs/writing-tests)                                               |
| Puppeteer            | [Começando com Puppeteer](https://pptr.dev)                                                                          |
