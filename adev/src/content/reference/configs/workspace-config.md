<!-- ia-translate: true -->

# Configuração do workspace Angular

O arquivo `angular.json` no nível raiz de um workspace Angular fornece padrões de configuração para todo o workspace e específicos de projeto. Estes são usados pelas ferramentas de build e desenvolvimento fornecidas pelo Angular CLI.
Os valores de caminho fornecidos na configuração são relativos ao diretório raiz do workspace.

## Estrutura geral do JSON

No nível superior do `angular.json`, algumas propriedades configuram o workspace e uma seção `projects` contém as opções de configuração restantes por projeto.
Você pode sobrescrever os padrões do Angular CLI definidos no nível do workspace através de padrões definidos no nível do projeto.
Você também pode sobrescrever padrões definidos no nível do projeto usando a linha de comando.

As seguintes propriedades, no nível superior do arquivo, configuram o workspace.

| Propriedades     | Detalhes                                                                                                                                                                                                      |
| :--------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `version`        | A versão do arquivo de configuração.                                                                                                                                                                          |
| `newProjectRoot` | Caminho onde novos projetos são criados através de ferramentas como `ng generate application` ou `ng generate library`. O caminho pode ser absoluto ou relativo ao diretório do workspace. Padrão: `projects` |
| `cli`            | Um conjunto de opções que personalizam o [Angular CLI](tools/cli). Consulte [Opções de configuração do Angular CLI](#angular-cli-configuration-options) abaixo.                                               |
| `schematics`     | Um conjunto de [schematics](tools/cli/schematics) que personalizam os padrões de opção do sub-comando `ng generate` para este workspace. Consulte [schematics](#schematics) abaixo.                           |
| `projects`       | Contém uma subseção para cada aplicação ou biblioteca no workspace, com opções de configuração específicas do projeto.                                                                                        |

A aplicação inicial que você cria com `ng new app-name` é listada em "projects":

Quando você cria um projeto de biblioteca com `ng generate library`, o projeto de biblioteca também é adicionado à seção `projects`.

HELPFUL: A seção `projects` do arquivo de configuração não corresponde exatamente à estrutura de arquivos do workspace.

<!-- markdownlint-disable-next-line MD032 -->

- A aplicação inicial criada por `ng new` está no nível superior da estrutura de arquivos do workspace.
- Outras aplicações e bibliotecas ficam sob o diretório `projects` por padrão.

Para mais informações, consulte [Estrutura de arquivos do workspace e projeto](reference/configs/file-structure).

## Opções de configuração do Angular CLI {#angular-cli-configuration-options}

As seguintes propriedades são um conjunto de opções que personalizam o Angular CLI.

| Propriedade            | Detalhes                                                                                                                                                                                            | Tipo de valor                               | Valor padrão |
| :--------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------ | :----------- |
| `analytics`            | Compartilhar dados de uso anônimos com a equipe Angular. Um valor booleano indica se deve compartilhar dados ou não, enquanto uma string UUID compartilha dados usando um identificador pseudônimo. | `boolean` \| `string`                       | `false`      |
| `cache`                | Controla o [cache persistente em disco](cli/cache) usado pelos [Angular CLI Builders](tools/cli/cli-builder).                                                                                       | [Opções de cache](#cache-options)           | `{}`         |
| `schematicCollections` | Lista de coleções de schematics para usar em `ng generate`.                                                                                                                                         | `string[]`                                  | `[]`         |
| `packageManager`       | A ferramenta de gerenciador de pacotes preferida para usar.                                                                                                                                         | `npm` \| `cnpm` \| `pnpm` \| `yarn`\| `bun` | `npm`        |
| `warnings`             | Controla avisos do console específicos do Angular CLI.                                                                                                                                              | [Opções de avisos](#warnings-options)       | `{}`         |

### Opções de cache {#cache-options}

| Propriedade   | Detalhes                                                                                                                                                                                                                                              | Tipo de valor            | Valor padrão     |
| :------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------- | :--------------- |
| `enabled`     | Configura se o cache em disco está habilitado para builds.                                                                                                                                                                                            | `boolean`                | `true`           |
| `environment` | Configura em qual ambiente o cache em disco está habilitado.<br><br>_ `ci` habilita cache apenas em ambientes de integração contínua (CI).<br>_ `local` habilita cache apenas _fora_ de ambientes CI.<br>\* `all` habilita cache em todos os lugares. | `local` \| `ci` \| `all` | `local`          |
| `path`        | O diretório usado para armazenar resultados do cache.                                                                                                                                                                                                 | `string`                 | `.angular/cache` |

### Opções de avisos {#warnings-options}

| Propriedade       | Detalhes                                                                                 | Tipo de valor | Valor padrão |
| :---------------- | :--------------------------------------------------------------------------------------- | :------------ | :----------- |
| `versionMismatch` | Mostra um aviso quando a versão global do Angular CLI é mais recente que a versão local. | `boolean`     | `true`       |

## Opções de configuração de projeto

As seguintes propriedades de configuração de nível superior estão disponíveis para cada projeto, em `projects['project-name']`.

| Propriedade   | Detalhes                                                                                                                                                                                      | Tipo de valor                                                            | Valor padrão         |
| :------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------- | :------------------- |
| `root`        | O diretório raiz para os arquivos deste projeto, relativo ao diretório do workspace. Vazio para a aplicação inicial, que reside no nível superior do workspace.                               | `string`                                                                 | Nenhum (obrigatório) |
| `projectType` | Um de "application" ou "library". Uma aplicação pode executar independentemente em um browser, enquanto uma biblioteca não pode.                                                              | `application` \| `library`                                               | Nenhum (obrigatório) |
| `sourceRoot`  | O diretório raiz para os arquivos fonte deste projeto.                                                                                                                                        | `string`                                                                 | `''`                 |
| `prefix`      | Uma string que o Angular adiciona aos seletores ao gerar novos components, directives e pipes usando `ng generate`. Pode ser personalizada para identificar uma aplicação ou área de recurso. | `string`                                                                 | `'app'`              |
| `schematics`  | Um conjunto de schematics que personalizam os padrões de opção do sub-comando `ng generate` para este projeto. Consulte a seção [Schematics de geração](#schematics).                         | Consulte [schematics](#schematics)                                       | `{}`                 |
| `architect`   | Padrões de configuração para targets de builder Architect para este projeto.                                                                                                                  | Consulte [Configurando targets de builder](#configuring-builder-targets) | `{}`                 |

## Schematics

[Angular schematics](tools/cli/schematics) são instruções para modificar um projeto adicionando novos arquivos ou modificando arquivos existentes.
Estes podem ser configurados mapeando o nome do schematic para um conjunto de opções padrão.

O "nome" de um schematic está no formato: `<schematic-package>:<schematic-name>`.
Schematics para os sub-comandos `ng generate` padrão do Angular CLI são coletados no pacote [`@schematics/angular`](https://github.com/angular/angular-cli/blob/main/packages/schematics/angular/application/schema.json).
Por exemplo, o schematic para gerar um component com `ng generate component` é `@schematics/angular:component`.

Os campos fornecidos no schema do schematic correspondem aos valores de argumentos de linha de comando permitidos e padrões para as opções do sub-comando do Angular CLI.
Você pode atualizar seu arquivo de schema do workspace para definir um padrão diferente para uma opção de sub-comando. Por exemplo, para desabilitar `standalone` em `ng generate component` por padrão:

```json
{
  "projects": {
    "my-app": {
      "schematics": {
        "@schematics/angular:component": {
          "standalone": false
        }
      }
    }
  }
}
```

## Configurando builders CLI {#configuring-builder-targets}

Architect é a ferramenta que o Angular CLI usa para realizar tarefas complexas, como compilação e execução de testes.
Architect é um shell que executa um builder especificado para realizar uma determinada tarefa, de acordo com uma configuração de target.
Você pode definir e configurar novos builders e targets para estender o Angular CLI.
Consulte [Angular CLI Builders](tools/cli/cli-builder).

### Builders e targets Architect padrão

O Angular define builders padrão para uso com comandos específicos, ou com o comando geral `ng run`.
Os schemas JSON que definem as opções e padrões para cada um desses builders são coletados no pacote [`@angular-devkit/build-angular`](https://github.com/angular/angular-cli/blob/main/packages/angular_devkit/build_angular/builders.json).
Os schemas configuram opções para os seguintes builders.

### Configurando targets de builder

A seção `architect` do `angular.json` contém um conjunto de targets Architect.
Muitos dos targets correspondem aos comandos do Angular CLI que os executam.
Outros targets podem ser executados usando o comando `ng run`, e você pode definir seus próprios targets.

Cada objeto target especifica o `builder` para esse target, que é o pacote npm para a ferramenta que o Architect executa.
Cada target também tem uma seção `options` que configura opções padrão para o target, e uma seção `configurations` que nomeia e especifica configurações alternativas para o target.
Consulte o exemplo em [Target de build](#build-target) abaixo.

| Propriedade    | Detalhes                                                                                                                                                                                               |
| :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `build`        | Configura padrões para opções do comando `ng build`. Consulte a seção [Target de build](#build-target) para mais informações.                                                                          |
| `serve`        | Sobrescreve padrões de build e fornece padrões extras de serve para o comando `ng serve`. Além das opções disponíveis para o comando `ng build`, adiciona opções relacionadas à execução da aplicação. |
| `e2e`          | Sobrescreve padrões de build para construir aplicações de teste end-to-end usando o comando `ng e2e`.                                                                                                  |
| `test`         | Sobrescreve padrões de build para builds de teste e fornece padrões extras de execução de testes para o comando `ng test`.                                                                             |
| `lint`         | Configura padrões para opções do comando `ng lint`, que realiza análise estática de código nos arquivos fonte do projeto.                                                                              |
| `extract-i18n` | Configura padrões para opções do comando `ng extract-i18n`, que extrai strings de mensagem localizadas do código fonte e gera arquivos de tradução para internacionalização.                           |

HELPFUL: Todas as opções no arquivo de configuração devem usar `camelCase`, em vez de `dash-case` como usado na linha de comando.

## Target de build {#build-target}

Cada target sob `architect` tem as seguintes propriedades:

| Propriedade      | Detalhes                                                                                                                                                                                                                                                             |
| :--------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `builder`        | O builder CLI usado para criar este target na forma de `<package-name>:<builder-name>`.                                                                                                                                                                              |
| `options`        | Opções padrão do target de build.                                                                                                                                                                                                                                    |
| `configurations` | Configurações alternativas para executar o target. Cada configuração define as opções padrão para aquele ambiente pretendido, sobrescrevendo o valor associado em `options`. Consulte [Configurações alternativas de build](#alternate-build-configurations) abaixo. |

Por exemplo, para configurar um build com otimizações desabilitadas:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "optimization": false
          }
        }
      }
    }
  }
}
```

### Configurações alternativas de build {#alternate-build-configurations}

O Angular CLI vem com duas configurações de build: `production` e `development`.
Por padrão, o comando `ng build` usa a configuração `production`, que aplica várias otimizações de build, incluindo:

- Empacotamento de arquivos
- Minimização de espaços em branco excessivos
- Remoção de comentários e código morto
- Minificação de código para usar nomes curtos e alterados

Você pode definir e nomear configurações alternativas extras (como `staging`, por exemplo) apropriadas ao seu processo de desenvolvimento.
Você pode selecionar uma configuração alternativa passando seu nome para a flag de linha de comando `--configuration`.

Por exemplo, para configurar um build onde a otimização está habilitada apenas para builds de produção (`ng build --configuration production`):

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "optimization": false
          },
          "configurations": {
            "production": {
              "optimization": true
            }
          }
        }
      }
    }
  }
}
```

Você também pode passar mais de um nome de configuração como uma lista separada por vírgulas.
Por exemplo, para aplicar ambas as configurações de build `staging` e `french`, use o comando `ng build --configuration staging,french`.
Neste caso, o comando analisa as configurações nomeadas da esquerda para a direita.
Se várias configurações alterarem a mesma configuração, o último valor definido é o final.
Neste exemplo, se ambas as configurações `staging` e `french` definirem o caminho de saída, o valor em `french` seria usado.

### Opções extras de build e teste

As opções configuráveis para um build padrão ou direcionado geralmente correspondem às opções disponíveis para os comandos [`ng build`](cli/build) e [`ng test`](cli/test).
Para detalhes dessas opções e seus valores possíveis, consulte a [Referência do Angular CLI](cli).

| Propriedades de opções     | Detalhes                                                                                                                                                                                                                                                                                        |
| :------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `assets`                   | Um objeto contendo caminhos para assets estáticos para servir com a aplicação. Os caminhos padrão apontam para o diretório `public` do projeto. Consulte mais na seção [Configuração de assets](#assets-configuration).                                                                         |
| `styles`                   | Um array de arquivos CSS para adicionar ao contexto global do projeto. O Angular CLI suporta importações CSS e todos os principais pré-processadores CSS. Consulte mais na seção [Configuração de estilos e scripts](#styles-and-scripts-configuration).                                        |
| `stylePreprocessorOptions` | Um objeto contendo pares opção-valor para passar aos pré-processadores de estilo. Consulte mais na seção [Configuração de estilos e scripts](#styles-and-scripts-configuration).                                                                                                                |
| `scripts`                  | Um objeto contendo arquivos JavaScript para adicionar à aplicação. Os scripts são carregados exatamente como se você os tivesse adicionado em uma tag `<script>` dentro do `index.html`. Consulte mais na seção [Configuração de estilos e scripts](#styles-and-scripts-configuration).         |
| `budgets`                  | Tipo de orçamento de tamanho padrão e limites para toda ou partes da sua aplicação. Você pode configurar o builder para reportar um aviso ou erro quando a saída alcançar ou exceder um limite de tamanho. Consulte [Configurar orçamentos de tamanho](tools/cli/build#configure-size-budgets). |
| `fileReplacements`         | Um objeto contendo arquivos e suas substituições em tempo de compilação. Consulte mais em [Configurar substituições de arquivo específicas do target](tools/cli/build#configure-target-specific-file-replacements).                                                                             |
| `index`                    | Um documento HTML base que carrega a aplicação. Consulte mais em [Configuração de index](#index-configuration).                                                                                                                                                                                 |
| `security`                 | Um objeto contendo a chave `autoCsp` que pode ser definida como `true` ou `false`                                                                                                                                                                                                               |

### Opções extras de serve {#assets-configuration}

O servidor de desenvolvimento vem com seu próprio conjunto de opções que geralmente correspondem às opções disponíveis para o comando [`ng serve`](cli/serve).

| Propriedades de opções | Detalhes                                                                                                                                                                                                                                  |
| :--------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `allowedHosts`         | Um array de hosts aos quais o servidor de desenvolvimento responderá. Esta opção define a opção Vite de mesmo nome. Para mais detalhes [consulte a documentação do vite](https://vite.dev/config/server-options.html#server-allowedhosts) |

## Valores de configuração complexos

As opções `assets`, `index`, `outputPath`, `styles` e `scripts` podem ter valores de caminho de string simples ou valores de objeto com campos específicos.
As opções `sourceMap` e `optimization` podem ser definidas como um valor booleano simples. Elas também podem receber um valor complexo usando o arquivo de configuração.

As seções a seguir fornecem mais detalhes de como esses valores complexos são usados em cada caso.

### Configuração de assets

Cada configuração de target `build` pode incluir um array `assets` que lista arquivos ou pastas que você deseja copiar como estão ao construir seu projeto.
Por padrão, o conteúdo do diretório `public/` é copiado.

Para excluir um asset, você pode removê-lo da configuração de assets.

Você pode configurar ainda mais os assets a serem copiados especificando assets como objetos, em vez de caminhos simples relativos à raiz do workspace.
Um objeto de especificação de asset pode ter os seguintes campos.

| Campos           | Detalhes                                                                                                                                           |
| :--------------- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| `glob`           | Um [node-glob](https://github.com/isaacs/node-glob/blob/master/README.md) usando `input` como diretório base.                                      |
| `input`          | Um caminho relativo à raiz do workspace.                                                                                                           |
| `output`         | Um caminho relativo a `outDir`. Devido às implicações de segurança, o Angular CLI nunca escreve arquivos fora do caminho de saída do projeto.      |
| `ignore`         | Uma lista de globs para excluir.                                                                                                                   |
| `followSymlinks` | Permitir que padrões glob sigam diretórios de link simbólico. Isso permite que subdiretórios do link simbólico sejam pesquisados. Padrão: `false`. |

Por exemplo, os caminhos de asset padrão podem ser representados em mais detalhes usando os seguintes objetos.

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "assets": [
              {
                "glob": "**/*",
                "input": "src/assets/",
                "output": "/assets/"
              },
              {
                "glob": "favicon.ico",
                "input": "src/",
                "output": "/"
              }
            ]
          }
        }
      }
    }
  }
}
```

O exemplo a seguir usa o campo `ignore` para excluir certos arquivos no diretório de assets de serem copiados para o build:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "assets": [
              {
                "glob": "**/*",
                "input": "src/assets/",
                "ignore": ["**/*.svg"],
                "output": "/assets/"
              }
            ]
          }
        }
      }
    }
  }
}
```

### Configuração de estilos e scripts

Uma entrada de array para as opções `styles` e `scripts` pode ser uma string de caminho simples, ou um objeto que aponta para um arquivo de ponto de entrada extra.
O builder associado carrega esse arquivo e suas dependências como um bundle separado durante o build.
Com um objeto de configuração, você tem a opção de nomear o bundle para o ponto de entrada, usando um campo `bundleName`.

O bundle é injetado por padrão, mas você pode definir `inject` como `false` para excluir o bundle da injeção.
Por exemplo, os seguintes valores de objeto criam e nomeiam um bundle que contém estilos e scripts, e o excluem da injeção:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "styles": [
              {
                "input": "src/external-module/styles.scss",
                "inject": false,
                "bundleName": "external-module"
              }
            ],
            "scripts": [
              {
                "input": "src/external-module/main.js",
                "inject": false,
                "bundleName": "external-module"
              }
            ]
          }
        }
      }
    }
  }
}
```

#### Opções de pré-processador de estilo

No Sass, você pode fazer uso do recurso `includePaths` tanto para estilos de component quanto globais. Isso permite adicionar caminhos base extras que são verificados para imports.

Para adicionar caminhos, use a opção `stylePreprocessorOptions`:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "stylePreprocessorOptions": {
              "includePaths": [
                "src/style-paths"
              ]
            }
          }
        }
      }
    }
  }
}
```

Arquivos nesse diretório, como `src/style-paths/_variables.scss`, podem ser importados de qualquer lugar em seu projeto sem a necessidade de um caminho relativo:

```scss
// src/app/app.component.scss
// Um caminho relativo funciona
@import '../style-paths/variables';

// Mas agora isso também funciona
@import 'variables';
```

HELPFUL: Você também precisa adicionar quaisquer estilos ou scripts ao builder `test` se precisar deles para testes unitários.
Consulte também [Usando bibliotecas globais de runtime dentro da sua aplicação](tools/libraries/using-libraries#using-runtime-global-libraries-inside-your-app).

### Configuração de otimização

A opção `optimization` pode ser um booleano ou um objeto para configuração mais refinada.
Esta opção habilita várias otimizações da saída do build, incluindo:

- Minificação de scripts e estilos
- Tree-shaking
- Eliminação de código morto
- [Inlining de CSS crítico](/tools/cli/build#critical-css-inlining)
- Inlining de fontes

Várias opções podem ser usadas para refinar a otimização de uma aplicação.

| Opções    | Detalhes                                                        | Tipo de valor                                                                | Valor padrão |
| :-------- | :-------------------------------------------------------------- | :--------------------------------------------------------------------------- | :----------- |
| `scripts` | Habilita otimização da saída de scripts.                        | `boolean`                                                                    | `true`       |
| `styles`  | Habilita otimização da saída de estilos.                        | `boolean` \| [Opções de otimização de estilos](#styles-optimization-options) | `true`       |
| `fonts`   | Habilita otimização para fontes. Isso requer acesso à internet. | `boolean` \| [Opções de otimização de fontes](#fonts-optimization-options)   | `true`       |

#### Opções de otimização de estilos {#styles-optimization-options}

| Opções                  | Detalhes                                                                                                                      | Tipo de valor | Valor padrão |
| :---------------------- | :---------------------------------------------------------------------------------------------------------------------------- | :------------ | :----------- |
| `minify`                | Minifica definições CSS removendo espaços em branco e comentários extrâneos, mesclando identificadores e minimizando valores. | `boolean`     | `true`       |
| `inlineCritical`        | Extrai e incorpora definições CSS críticas para melhorar a [First Contentful Paint](https://web.dev/first-contentful-paint).  | `boolean`     | `true`       |
| `removeSpecialComments` | Remove comentários em CSS global que contém `@license` ou `@preserve` ou que começa com `//!` ou `/*!`.                       | `boolean`     | `true`       |

#### Opções de otimização de fontes {#fonts-optimization-options}

| Opções   | Detalhes                                                                                                                                                                                                                         | Tipo de valor | Valor padrão |
| :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------ | :----------- |
| `inline` | Reduz [requisições de bloqueio de renderização](https://web.dev/render-blocking-resources) incorporando definições CSS de Google Fonts e Adobe Fonts externas no arquivo HTML index da aplicação. Isso requer acesso à internet. | `boolean`     | `true`       |

Você pode fornecer um valor como o seguinte para aplicar otimização a um ou outro:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "stylePreprocessorOptions": {
              "includePaths": [
                "src/style-paths"
              ]
            }
          }
        }
      }
    }
  }
}
```

### Configuração de source map

A opção de builder `sourceMap` pode ser um booleano ou um objeto para configuração mais refinada para controlar os source maps de uma aplicação.

| Opções           | Detalhes                                                           | Tipo de valor | Valor padrão |
| :--------------- | :----------------------------------------------------------------- | :------------ | :----------- |
| `scripts`        | Gera source maps para todos os scripts.                            | `boolean`     | `true`       |
| `styles`         | Gera source maps para todos os estilos.                            | `boolean`     | `true`       |
| `vendor`         | Resolve source maps de pacotes vendor.                             | `boolean`     | `false`      |
| `hidden`         | Omite link para sourcemaps do JavaScript de saída.                 | `boolean`     | `false`      |
| `sourcesContent` | Gera conteúdo fonte original para arquivos dentro dos source maps. | `boolean`     | `true`       |

O exemplo abaixo mostra como alternar um ou mais valores para configurar as saídas de source map:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "sourceMap": {
              "scripts": true,
              "styles": false,
              "hidden": true,
              "vendor": true
            }
          }
        }
      }
    }
  }
}
```

HELPFUL: Ao usar source maps ocultos, os source maps não são referenciados no bundle.
Estes são úteis se você deseja apenas source maps para mapear stack traces em ferramentas de relatório de erro sem aparecer nas ferramentas de desenvolvedor do browser.
Observe que, embora `hidden` impeça que o source map seja vinculado no bundle de saída, seu processo de deployment deve cuidar para não servir os sourcemaps gerados em produção, caso contrário a informação ainda é vazada.

#### Source maps sem conteúdo de fontes {#styles-and-scripts-configuration}

Você pode gerar source maps sem o campo `sourcesContent`, que contém o código fonte original.
Isso permite que você faça deploy de source maps para produção para melhor relatório de erros com nomes de fonte originais enquanto protege seu código fonte de exposição.

Para excluir o conteúdo de fontes dos source maps, defina a opção `sourcesContent` como `false`:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "sourceMap": {
              "scripts": true,
              "styles": true,
              "sourcesContent": false
            }
          }
        }
      }
    }
  }
}
```

### Configuração de index {#index-configuration}

Configura a geração do HTML index da aplicação.

A opção `index` pode ser uma string ou um objeto para configuração mais refinada.

Ao fornecer o valor como uma string, o nome do arquivo do caminho especificado será usado para o arquivo gerado e será criado na raiz do caminho de saída configurado da aplicação.

#### Opções de index

| Opções   | Detalhes                                                                                                                                                                        | Tipo de valor | Valor padrão         |
| :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------------ | :------------------- |
| `input`  | O caminho de um arquivo para usar para o HTML index gerado da aplicação.                                                                                                        | `string`      | Nenhum (obrigatório) |
| `output` | O caminho de saída do arquivo HTML index gerado da aplicação. O caminho completo fornecido será usado e será considerado relativo ao caminho de saída configurado da aplicação. | `string`      | `index.html`         |

### Configuração do caminho de saída

A opção `outputPath` pode ser uma String que será usada como valor `base` ou um Objeto para configuração mais refinada.

Várias opções podem ser usadas para refinar a estrutura de saída de uma aplicação.

| Opções    | Detalhes                                                                                                                                                                                     | Tipo de valor | Valor padrão |
| :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------ | :----------- |
| `base`    | Especifica o caminho de saída relativo à raiz do workspace.                                                                                                                                  | `string`      |              |
| `browser` | O nome do diretório de saída para seu build de browser está dentro do caminho de saída base. Isso pode ser servido com segurança aos usuários.                                               | `string`      | `browser`    |
| `server`  | O nome do diretório de saída do seu build de servidor dentro do caminho base de saída.                                                                                                       | `string`      | `server`     |
| `media`   | O nome do diretório de saída para seus arquivos de mídia localizados dentro do diretório de saída do browser. Esses arquivos de mídia são comumente referidos como recursos em arquivos CSS. | `string`      | `media`      |
