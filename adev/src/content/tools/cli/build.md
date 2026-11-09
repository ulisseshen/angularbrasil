<!-- ia-translate: true -->
# Construindo aplicações Angular

Você pode fazer o build da sua aplicação ou library Angular CLI com o comando `ng build`.
Isso compilará seu código TypeScript para JavaScript, além de otimizar, fazer o bundle e minificar a saída conforme apropriado.

`ng build` apenas executa o builder para o target `build` no projeto padrão, conforme especificado em `angular.json`.
O Angular CLI inclui quatro builders normalmente usados como targets de `build`:

| Builder                                         | Propósito                                                                                                                                                                                                                                        |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@angular/build:application`                    | Faz o build de uma aplicação com um bundle client-side, um servidor Node e rotas pré-renderizadas em tempo de build com [esbuild](https://esbuild.github.io/).                                                                                  |
| `@angular-devkit/build-angular:browser-esbuild` | Faz o bundle de uma aplicação client-side para uso em um browser com [esbuild](https://esbuild.github.io/). Veja a [documentação do `browser-esbuild`](tools/cli/build-system-migration#manual-migration-to-the-compatibility-builder) para mais informações. |
| `@angular-devkit/build-angular:browser`         | Faz o bundle de uma aplicação client-side para uso em um browser com [webpack](https://webpack.js.org/).                                                                                                                                                |
| `@angular/build:ng-packagr`                     | Faz o build de uma library Angular seguindo o [Angular Package Format](tools/libraries/angular-package-format).                                                                                                                                        |

Aplicações geradas por `ng new` usam `@angular/build:application` por padrão.
Libraries geradas por `ng generate library` usam `@angular/build:ng-packagr` por padrão.

Você pode determinar qual builder está sendo usado para um projeto específico consultando o target `build` desse projeto.

```json
{
  "projects": {
    "my-app": {
      "architect": {
        // `ng build` invoca o Architect target chamado `build`.
        "build": {
          "builder": "@angular/build:application",
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

Esta página discute o uso e as opções de `@angular/build:application`.

## Diretório de saída {#output-directory}

O resultado deste processo de build é gerado em um diretório (`dist/${PROJECT_NAME}` por padrão).

## Configurando budgets de tamanho {#configuring-size-budgets}

À medida que as aplicações crescem em funcionalidade, elas também crescem em tamanho.
O CLI permite que você defina limites de tamanho em sua configuração para garantir que partes da sua aplicação permaneçam dentro dos limites de tamanho que você define.

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

Você pode especificar budgets de tamanho para a aplicação inteira e para partes específicas.
Cada entrada de budget configura um budget de um determinado tipo.
Por exemplo, o budget `initial` mede o JavaScript e o CSS usados para inicializar a aplicação, o que corresponde ao valor `Initial Total` exibido no resumo da saída do build.
Especifique valores de tamanho nos seguintes formatos:

| Valor de tamanho | Detalhes                                                                                    |
| :--------------- | :------------------------------------------------------------------------------------------ |
| `123` ou `123b`  | Tamanho em bytes.                                                                           |
| `123kb`          | Tamanho em kilobytes.                                                                       |
| `123mb`          | Tamanho em megabytes.                                                                       |
| `12%`            | Porcentagem do tamanho relativa à linha de base. \(Não válido para valores de linha de base.\) |

Quando você configura um budget, o builder emite um aviso ou reporta um erro quando uma determinada parte da aplicação atinge ou excede um limite de tamanho que você definiu.

Cada entrada de budget é um objeto JSON com as seguintes propriedades:

| Propriedade    | Valor                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type           | O tipo de budget. Um de: <table> <thead> <tr> <th> Valor </th> <th> Detalhes </th> </tr> </thead> <tbody> <tr> <td> <code>bundle</code> </td> <td> O tamanho de um bundle específico. Use este tipo junto com <code>name</code> para definir um budget para um bundle específico, incluindo um bundle carregado de forma lazy. </td> </tr> <tr> <td> <code>initial</code> </td> <td> O tamanho de JavaScript e CSS necessário para inicializar a aplicação. Isso corresponde ao valor <code>Initial Total</code> exibido no resumo da saída do build. Por padrão, avisa em 500kb e reporta erro em 1mb. </td> </tr> <tr> <td> <code>allScript</code> </td> <td> O tamanho de todos os scripts. </td> </tr> <tr> <td> <code>all</code> </td> <td> O tamanho de toda a aplicação. </td> </tr> <tr> <td> <code>anyComponentStyle</code> </td> <td> O tamanho de qualquer folha de estilo de component. Por padrão, avisa em 4kb e reporta erro em 8kb. </td> </tr> <tr> <td> <code>anyScript</code> </td> <td> O tamanho de qualquer script. </td> </tr> <tr> <td> <code>any</code> </td> <td> O tamanho de qualquer arquivo. </td> </tr> </tbody> </table> |
| name           | O nome do bundle para `type=bundle`. Este é o nome do bundle informado pelo builder, não o nome do arquivo de saída gerado.                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| baseline       | O tamanho de linha de base para comparação. Se não for definido, a linha de base assume `0` por padrão, e os valores de limite são calculados em relação a essa linha de base.                                                                                                                                                                                                                                                                                                                                                                                                  |
| maximumWarning | O limite máximo para aviso, relativo à linha de base.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| maximumError   | O limite máximo para erro, relativo à linha de base.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| minimumWarning | O limite mínimo para aviso, relativo à linha de base.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| minimumError   | O limite mínimo para erro, relativo à linha de base.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| warning        | O limite para aviso, relativo à linha de base (mín e máx).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| error          | O limite para erro, relativo à linha de base (mín e máx).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |

Para configurar um budget para um bundle carregado de forma lazy, use `type: "bundle"` e defina `name` com o nome desse bundle.

```json
{
  "budgets": [
    {
      "type": "bundle",
      "name": "admin",
      "maximumWarning": "250kb",
      "maximumError": "300kb"
    }
  ]
}
```

O campo `name` corresponde ao nome do bundle, não ao arquivo emitido, por isso não usa padrões com wildcard ou expressões regulares, como `admin.*.js`.

O exemplo a seguir mostra um budget que usa uma linha de base:

```json
{
  "type": "bundle",
  "name": "main",
  "baseline": "200kb",
  "maximumWarning": "10%",
  "maximumError": "20%"
}
```

Neste exemplo, o builder emite um aviso quando o bundle cresce além de `220kb` e reporta um erro quando cresce além de `240kb`.

## Configurando dependências CommonJS {#configuring-commonjs-dependencies}

Sempre prefira [módulos ECMAScript](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import) (ESM) nativos em toda a sua aplicação e em suas dependências.
ESM é um padrão web totalmente especificado e um recurso da linguagem JavaScript com forte suporte à análise estática. Isso torna as otimizações de bundle mais poderosas do que com outros formatos de módulos.

O Angular CLI também suporta a importação de dependências [CommonJS](https://nodejs.org/api/modules.html) para o seu projeto e fará o bundle dessas dependências automaticamente.
No entanto, módulos CommonJS podem impedir que bundlers e minificadores otimizem esses módulos de forma eficaz, o que resulta em bundles maiores.
Para mais informações, veja [How CommonJS is making your bundles larger](https://web.dev/commonjs-larger-bundles).

O Angular CLI emite avisos se detectar que sua aplicação para browser depende de módulos CommonJS.
Ao encontrar uma dependência CommonJS, considere pedir ao mantenedor que suporte módulos ECMAScript, contribuir com esse suporte você mesmo ou usar uma dependência alternativa que atenda às suas necessidades.
Se a melhor opção for usar uma dependência CommonJS, você pode desabilitar esses avisos adicionando o nome do módulo CommonJS à opção `allowedCommonJsDependencies` nas opções do target `build` localizado em `angular.json`.

```json
"build": {
  "builder": "@angular/build:application",
  "options": {
     "allowedCommonJsDependencies": [
        "lodash"
     ]
     …
   }
   …
},
```

## Configurando compatibilidade de browser {#configuring-browser-compatibility}

O Angular CLI usa o [Browserslist](https://github.com/browserslist/browserslist) para garantir compatibilidade com diferentes versões de browsers.
Dependendo dos browsers suportados, o Angular transformará automaticamente certos recursos de JavaScript e CSS para garantir que a aplicação construída não use um recurso que não foi implementado por um browser suportado. No entanto, o Angular CLI não adicionará automaticamente polyfills para complementar APIs Web ausentes. Use a opção `polyfills` em `angular.json` para adicionar polyfills.

Por padrão, o Angular CLI usa uma configuração `browserslist` que [corresponde aos browsers suportados pelo Angular](reference/versions#browser-support) para a versão principal atual.

Para substituir a configuração interna, execute [`ng generate config browserslist`](cli/generate/config), que gera um arquivo de configuração `.browserslistrc` no diretório do projeto, correspondendo aos browsers suportados pelo Angular.

Veja o [repositório do browserslist](https://github.com/browserslist/browserslist) para mais exemplos de como segmentar browsers e versões específicos.
Evite expandir esta lista para mais browsers. Mesmo que o código da sua aplicação seja mais amplamente compatível, o próprio Angular pode não ser.
Você deve apenas _reduzir_ o conjunto de browsers ou versões nesta lista.

HELPFUL: Use o [browsersl.ist](https://browsersl.ist) para exibir os browsers compatíveis com uma consulta `browserslist`.

## Configurando Tailwind {#configuring-tailwind}

O Angular oferece suporte ao [Tailwind CSS](https://tailwindcss.com/), um framework CSS utility-first.

Para integrar o Tailwind CSS com o Angular CLI, veja [Usando Tailwind CSS com Angular](guide/tailwind)

## Inlining de CSS crítico {#critical-css-inlining}

O Angular pode fazer o inline das definições de CSS crítico da sua aplicação para melhorar o [First Contentful Paint (FCP)](https://web.dev/first-contentful-paint).
Esta opção está habilitada por padrão. Você pode desabilitar este inlining nas [opções de customização de `styles`](reference/configs/workspace-config#styles-optimization-options).

Esta otimização extrai o CSS necessário para renderizar o viewport inicial e o incorpora diretamente no HTML gerado, permitindo que o browser exiba o conteúdo mais rapidamente, sem esperar que as folhas de estilo completas sejam carregadas. O CSS restante é então carregado de forma assíncrona em segundo plano. O Angular CLI usa o [Beasties](https://github.com/danielroe/beasties) para analisar o HTML e os estilos da sua aplicação.
