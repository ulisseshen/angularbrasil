<!-- ia-translate: true -->
# Construindo aplicações Angular

Você pode fazer o build da sua aplicação ou library Angular CLI com o comando `ng build`.
Isso compilará seu código TypeScript para JavaScript, além de otimizar, fazer o bundle e minificar a saída conforme apropriado.

`ng build` apenas executa o builder para o target `build` no projeto padrão conforme especificado em `angular.json`.
O Angular CLI inclui quatro builders normalmente usados como targets de `build`:

| Builder                                         | Propósito                                                                                                                                                                                                                                        |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@angular-devkit/build-angular:application`     | Faz o build de uma aplicação com um bundle client-side, um servidor Node e rotas pré-renderizadas em tempo de build com [esbuild](https://esbuild.github.io/).                                                                                                  |
| `@angular-devkit/build-angular:browser-esbuild` | Faz o bundle de uma aplicação client-side para uso em um browser com [esbuild](https://esbuild.github.io/). Veja a [documentação do `browser-esbuild`](tools/cli/build-system-migration#manual-migration-to-the-compatibility-builder) para mais informações. |
| `@angular-devkit/build-angular:browser`         | Faz o bundle de uma aplicação client-side para uso em um browser com [webpack](https://webpack.js.org/).                                                                                                                                                |
| `@angular-devkit/build-angular:ng-packagr`      | Faz o build de uma library Angular seguindo o [Angular Package Format](tools/libraries/angular-package-format).                                                                                                                                        |

Aplicações geradas por `ng new` usam `@angular-devkit/build-angular:application` por padrão.
Libraries geradas por `ng generate library` usam `@angular-devkit/build-angular:ng-packagr` por padrão.

Você pode determinar qual builder está sendo usado para um projeto específico procurando o target `build` desse projeto.

```json
{
  "projects": {
    "my-app": {
      "architect": {
        // `ng build` invoca o Architect target chamado `build`.
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          …
        },
        "serve": { … }
        "test": { … }
        …
      }
    }
  }
}
```

Esta página discute o uso e as opções de `@angular-devkit/build-angular:application`.

## Diretório de saída

O resultado deste processo de build é gerado em um diretório (`dist/${PROJECT_NAME}` por padrão).

## Configurando budgets de tamanho

À medida que as aplicações crescem em funcionalidade, elas também crescem em tamanho.
O CLI permite que você defina limites de tamanho em sua configuração para garantir que partes de sua aplicação permaneçam dentro dos limites de tamanho que você define.

Defina seus limites de tamanho no arquivo de configuração do CLI, `angular.json`, em uma seção `budgets` para cada [ambiente configurado](tools/cli/environments).

```json
{
  …
  "configurations": {
    "production": {
      …
      "budgets": [
        {
          "type": "initial",
          "maximumWarning": "250kb",
          "maximumError": "500kb"
        },
      ]
    }
  }
}
```

Você pode especificar budgets de tamanho para toda a aplicação e para partes específicas.
Cada entrada de budget configura um budget de um determinado tipo.
Especifique valores de tamanho nos seguintes formatos:

| Valor de tamanho | Detalhes                                                                     |
| :-------------- | :-------------------------------------------------------------------------- |
| `123` ou `123b` | Tamanho em bytes.                                                              |
| `123kb`         | Tamanho em kilobytes.                                                          |
| `123mb`         | Tamanho em megabytes.                                                          |
| `12%`           | Porcentagem do tamanho relativa à linha de base. \(Não válido para valores de linha de base.\) |

Quando você configura um budget, o builder avisa ou reporta um erro quando uma determinada parte da aplicação atinge ou excede um limite de tamanho que você definiu.

Cada entrada de budget é um objeto JSON com as seguintes propriedades:

| Propriedade       | Valor                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type           | O tipo de budget. Um de: <table> <thead> <tr> <th> Valor </th> <th> Detalhes </th> </tr> </thead> <tbody> <tr> <td> <code>bundle</code> </td> <td> O tamanho de um bundle específico. </td> </tr> <tr> <td> <code>initial</code> </td> <td> O tamanho de JavaScript e CSS necessário para inicializar a aplicação. Por padrão, avisa em 500kb e reporta erro em 1mb. </td> </tr> <tr> <td> <code>allScript</code> </td> <td> O tamanho de todos os scripts. </td> </tr> <tr> <td> <code>all</code> </td> <td> O tamanho de toda a aplicação. </td> </tr> <tr> <td> <code>anyComponentStyle</code> </td> <td> O tamanho de qualquer stylesheet de component. Por padrão, avisa em 2kb e reporta erro em 4kb. </td> </tr> <tr> <td> <code>anyScript</code> </td> <td> O tamanho de qualquer script. </td> </tr> <tr> <td> <code>any</code> </td> <td> O tamanho de qualquer arquivo. </td> </tr> </tbody> </table> |
| name           | O nome do bundle (para `type=bundle`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| baseline       | O tamanho de linha de base para comparação.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| maximumWarning | O limite máximo para aviso relativo à linha de base.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| maximumError   | O limite máximo para erro relativo à linha de base.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| minimumWarning | O limite mínimo para aviso relativo à linha de base.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| minimumError   | O limite mínimo para erro relativo à linha de base.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| warning        | O limite para aviso relativo à linha de base (mín & máx).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| error          | O limite para erro relativo à linha de base (mín & máx).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

## Configurando dependências CommonJS

Sempre prefira [módulos ECMAScript](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import) (ESM) nativos em toda a sua aplicação e suas dependências.
ESM é um padrão web totalmente especificado e uma funcionalidade da linguagem JavaScript com forte suporte de análise estática. Isso torna as otimizações de bundle mais poderosas do que outros formatos de módulos.

O Angular CLI também suporta a importação de dependências [CommonJS](https://nodejs.org/api/modules.html) em seu projeto e fará o bundle dessas dependências automaticamente.
No entanto, módulos CommonJS podem impedir que bundlers e minificadores otimizem esses módulos de forma eficaz, o que resulta em tamanhos de bundle maiores.
Para mais informações, veja [How CommonJS is making your bundles larger](https://web.dev/commonjs-larger-bundles).

O Angular CLI gera avisos se detectar que sua aplicação de browser depende de módulos CommonJS.
Quando você encontrar uma dependência CommonJS, considere pedir ao mantenedor para suportar módulos ECMAScript, contribuir com esse suporte você mesmo ou usar uma dependência alternativa que atenda às suas necessidades.
Se a melhor opção for usar uma dependência CommonJS, você pode desabilitar esses avisos adicionando o nome do módulo CommonJS à opção `allowedCommonJsDependencies` nas opções de `build` localizadas em `angular.json`.

```json
"build": {
  "builder": "@angular-devkit/build-angular:browser",
  "options": {
     "allowedCommonJsDependencies": [
        "lodash"
     ]
     …
   }
   …
},
```

## Configurando compatibilidade de browser

O Angular CLI usa [Browserslist](https://github.com/browserslist/browserslist) para garantir compatibilidade com diferentes versões de browsers.
Dependendo dos browsers suportados, o Angular transformará automaticamente certos recursos JavaScript e CSS para garantir que a aplicação construída não use um recurso que não foi implementado por um browser suportado. No entanto, o Angular CLI não adicionará automaticamente polyfills para suplementar APIs Web ausentes. Use a opção `polyfills` em `angular.json` para adicionar polyfills.

Por padrão, o Angular CLI usa uma configuração `browserslist` que [corresponde aos browsers suportados pelo Angular](reference/versions#browser-support) para a versão principal atual.

Para sobrescrever a configuração interna, execute [`ng generate config browserslist`](cli/generate/config), que gera um arquivo de configuração `.browserslistrc` no diretório do projeto correspondendo aos browsers suportados pelo Angular.

Veja o [repositório browserslist](https://github.com/browserslist/browserslist) para mais exemplos de como segmentar browsers e versões específicos.
Evite expandir esta lista para mais browsers. Mesmo que o código da sua aplicação seja mais amplamente compatível, o próprio Angular pode não ser.
Você deve apenas _reduzir_ o conjunto de browsers ou versões nesta lista.

HELPFUL: Use [browsersl.ist](https://browsersl.ist) para exibir browsers compatíveis para uma consulta `browserslist`.

## Configurando Tailwind

Angular suporta [Tailwind CSS](https://tailwindcss.com/), um framework CSS utility-first.

Para integrar Tailwind CSS com Angular CLI, veja [Usando Tailwind CSS com Angular](guide/tailwind)

## Inlining de CSS crítico

Angular pode fazer o inline das definições de CSS crítico de sua aplicação para melhorar o [First Contentful Paint (FCP)](https://web.dev/first-contentful-paint).
Esta opção está habilitada por padrão. Você pode desabilitar este inlining nas [opções de customização de `styles`](reference/configs/workspace-config#styles-optimization-options).

Esta otimização extrai o CSS necessário para renderizar o viewport inicial e o incorpora diretamente no HTML gerado, permitindo que o browser exiba o conteúdo mais rapidamente sem esperar que as folhas de estilo completas sejam carregadas. O CSS restante é então carregado de forma assíncrona em segundo plano. O Angular CLI usa [Beasties](https://github.com/danielroe/beasties) para analisar o HTML e os estilos de sua aplicação.
