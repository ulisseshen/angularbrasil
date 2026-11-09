<!-- ia-translate: true -->

# Configuração do workspace Angular {#angular-workspace-configuration}

O arquivo `angular.json` no nível raiz de um workspace Angular fornece padrões de configuração para todo o workspace e específicos de projeto. Estes são usados pelas ferramentas de build e desenvolvimento fornecidas pelo Angular CLI.
Os valores de caminho fornecidos na configuração são relativos ao diretório raiz do workspace.

## Estrutura geral do JSON {#general-json-structure}

No nível superior do `angular.json`, algumas propriedades configuram o workspace e uma seção `projects` contém as demais opções de configuração por projeto.
Você pode sobrescrever os padrões do Angular CLI definidos no nível do workspace por meio de padrões definidos no nível do projeto.
Você também pode sobrescrever padrões definidos no nível do projeto usando a linha de comando.

As seguintes propriedades, no nível superior do arquivo, configuram o workspace.

| Propriedades     | Detalhes |
| :--------------- | :------- |
| `version`        | A versão do arquivo de configuração. |
| `newProjectRoot` | Caminho onde novos projetos são criados por meio de ferramentas como `ng generate application` ou `ng generate library`. O caminho pode ser absoluto ou relativo ao diretório do workspace. O padrão é `projects`. |
| `cli`            | Um conjunto de opções que personalizam o [Angular CLI](tools/cli). Veja [Opções de configuração do Angular CLI](#angular-cli-configuration-options) abaixo. |
| `schematics`     | Um conjunto de [schematics](tools/cli/schematics) que personalizam os padrões de opções do sub-comando `ng generate` para este workspace. Veja [schematics](#schematics) abaixo. |
| `projects`       | Contém uma subseção para cada aplicação ou biblioteca no workspace, com opções de configuração específicas do projeto. |

A aplicação inicial que você cria com `ng new app-name` é listada em "projects":

Quando você cria um projeto de biblioteca com `ng generate library`, o projeto de biblioteca também é adicionado à seção `projects`.

HELPFUL: A seção `projects` do arquivo de configuração não corresponde exatamente à estrutura de arquivos do workspace.

<!-- markdownlint-disable-next-line MD032 -->

- A aplicação inicial criada por `ng new` fica no nível superior da estrutura de arquivos do workspace.
- Outras aplicações e bibliotecas ficam sob o diretório `projects` por padrão.

Para mais informações, veja [Estrutura de arquivos do workspace e projeto](reference/configs/file-structure).

## Opções de configuração do Angular CLI {#angular-cli-configuration-options}

As seguintes propriedades são um conjunto de opções que personalizam o Angular CLI.

| Propriedade            | Detalhes | Tipo de valor | Valor padrão |
| :--------------------- | :------- | :------------ | :----------- |
| `analytics`            | Compartilha dados de uso anônimos com a equipe Angular. Um valor booleano indica se deve compartilhar dados ou não, enquanto uma string UUID compartilha dados usando um identificador pseudônimo. | `boolean` \| `string` | `false` |
| `cache`                | Controla o [cache persistente em disco](cli/cache) usado pelos [Angular CLI Builders](tools/cli/cli-builder). | [Opções de cache](#cache-options) | `{}` |
| `schematicCollections` | Lista as coleções de schematics a usar em `ng generate`. | `string[]` | `[]` |
| `packageManager`       | A ferramenta de gerenciamento de pacotes preferida a usar. | `npm` \| `pnpm` \| `yarn` \| `bun` | `npm` |
| `warnings`             | Controla os avisos do console específicos do Angular CLI. | [Opções de avisos](#warnings-options) | `{}` |

### Opções de cache {#cache-options}

| Propriedade   | Detalhes | Tipo de valor | Valor padrão |
| :------------ | :------- | :------------ | :----------- |
| `enabled`     | Configura se o cache em disco está habilitado para os builds. | `boolean` | `true` |
| `environment` | Configura em qual ambiente o cache em disco está habilitado.<br><br>_ `ci` habilita o cache apenas em ambientes de integração contínua (CI).<br>_ `local` habilita o cache apenas _fora_ de ambientes de CI.<br>\* `all` habilita o cache em todos os lugares. | `local` \| `ci` \| `all` | `local` |
| `path`        | O diretório usado para armazenar os resultados do cache. | `string` | `.angular/cache` |

### Opções de avisos {#warnings-options}

| Propriedade       | Detalhes | Tipo de valor | Valor padrão |
| :---------------- | :------- | :------------ | :----------- |
| `versionMismatch` | Mostra um aviso quando a versão global do Angular CLI é mais recente que a versão local. | `boolean` | `true` |

## Opções de configuração de projeto {#project-configuration-options}

As seguintes propriedades de configuração de nível superior estão disponíveis para cada projeto, em `projects['project-name']`.

| Propriedade   | Detalhes | Tipo de valor | Valor padrão |
| :------------ | :------- | :------------ | :----------- |
| `root`        | O diretório raiz dos arquivos deste projeto, relativo ao diretório do workspace. Vazio para a aplicação inicial, que reside no nível superior do workspace. | `string` | Nenhum (obrigatório) |
| `projectType` | Um de "application" ou "library". Uma aplicação pode ser executada de forma independente em um browser, enquanto uma biblioteca não. | `application` \| `library` | Nenhum (obrigatório) |
| `sourceRoot`  | O diretório raiz dos arquivos de origem deste projeto. | `string` | `''` |
| `prefix`      | Uma string que o Angular adiciona aos seletores ao gerar novos components, diretivas e pipes usando `ng generate`. Pode ser personalizada para identificar uma aplicação ou área de funcionalidade. | `string` | `'app'` |
| `i18n`        | Opções de internacionalização para o projeto. Define o locale de origem e locales adicionais a serem construídos. Veja [Defina locales na configuração de build](guide/i18n/merge#define-locales-in-the-build-configuration). | Veja [opções de i18n](#i18n-options) | `{}` |
| `schematics`  | Um conjunto de schematics que personalizam os padrões de opções do sub-comando `ng generate` para este projeto. Veja a seção [Schematics de geração](#schematics). | Veja [schematics](#schematics) | `{}` |
| `architect`   | Padrões de configuração para os targets de builder Architect deste projeto. | Veja [Configurando targets de builder](#configuring-builder-targets) | `{}` |

## Opções de i18n {#i18n-options}

Use a opção de projeto `i18n` para definir o locale de origem da aplicação e quaisquer locales adicionais a serem construídos.

| Propriedade    | Detalhes | Tipo de valor | Valor padrão |
| :------------- | :------- | :------------ | :----------- |
| `sourceLocale` | O locale usado no código fonte da aplicação. Pode ser uma string com o identificador de locale ou um [objeto de configuração](#sourcelocale-object). | `string` \| [objeto sourceLocale](#sourcelocale-object) | `"en-US"` |
| `locales`      | Um mapa de identificadores de locale para arquivos de tradução ou [objetos de configuração de locale](#locale-object). | `object` | `{}` |

### Objeto `sourceLocale` {#sourcelocale-object}

Passe um objeto em vez de uma string para personalizar o diretório de saída ou o HREF base do locale de origem:

| Propriedade | Detalhes | Tipo de valor | Valor padrão |
| :---------- | :------- | :------------ | :----------- |
| `code`      | O identificador do locale de origem. | `string` | `"en-US"` |
| `baseHref`  | Sobrescreve o `<base href>` HTML para este locale. O nome do diretório de saída permanece como o código do locale. Não pode ser usado junto com `subPath`. | `string` | Código do locale |
| `subPath`   | Define tanto o nome do diretório de saída quanto o `<base href>` HTML para este locale. Não pode ser usado junto com `baseHref`. | `string` | Código do locale |

### Objeto de locale {#locale-object}

Cada entrada de `locales` pode ser uma string de caminho, um array de caminhos ou um objeto:

| Propriedade   | Detalhes | Tipo de valor | Valor padrão |
| :------------ | :------- | :------------ | :----------- |
| `translation` | Caminho ou caminhos para o(s) arquivo(s) de tradução deste locale. | `string` \| `string[]` | |
| `baseHref`    | Sobrescreve o `<base href>` HTML para este locale. O nome do diretório de saída permanece como o identificador do locale. Não pode ser usado junto com `subPath`. | `string` | Código do locale |
| `subPath`     | Define tanto o nome do diretório de saída quanto o `<base href>` HTML para este locale. Não pode ser usado junto com `baseHref`. | `string` | Código do locale |

HELPFUL: Use `subPath` em vez de `baseHref` quando também precisar renomear o diretório de saída, por exemplo, para gerar em `de-DE/` em vez de `de/`.

## Schematics {#schematics}

[Schematics do Angular](tools/cli/schematics) são instruções para modificar um projeto adicionando novos arquivos ou alterando arquivos existentes.
Eles podem ser configurados mapeando o nome do schematic para um conjunto de opções padrão.

O "nome" de um schematic tem o formato: `<schematic-package>:<schematic-name>`.
Os schematics dos sub-comandos padrão `ng generate` do Angular CLI são reunidos no pacote [`@schematics/angular`](https://github.com/angular/angular-cli/blob/main/packages/schematics/angular/application/schema.json).
Por exemplo, o schematic para gerar um component com `ng generate component` é `@schematics/angular:component`.

Os campos fornecidos no schema do schematic correspondem aos valores de argumentos de linha de comando permitidos e aos padrões das opções do sub-comando do Angular CLI.
Você pode atualizar o arquivo de schema do seu workspace para definir um padrão diferente para uma opção de sub-comando. Por exemplo, para desabilitar `standalone` em `ng generate component` por padrão:

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

## Configurando builders CLI {#configuring-cli-builders}

Architect é a ferramenta que o Angular CLI usa para executar tarefas complexas, como compilação e execução de testes.
Architect é um shell que executa um builder especificado para realizar uma determinada tarefa, de acordo com a configuração de um target.
Você pode definir e configurar novos builders e targets para estender o Angular CLI.
Veja [Angular CLI Builders](tools/cli/cli-builder).

### Builders e targets Architect padrão {#default-architect-builders-and-targets}

O Angular define builders padrão para uso com comandos específicos ou com o comando geral `ng run`.
Os schemas JSON que definem as opções e os padrões de cada um desses builders são reunidos no pacote [`@angular/build`](https://github.com/angular/angular-cli/blob/main/packages/angular/build/builders.json).
Os schemas configuram as opções para os seguintes builders.

### Configurando targets de builder {#configuring-builder-targets}

A seção `architect` do `angular.json` contém um conjunto de targets Architect.
Muitos dos targets correspondem aos comandos do Angular CLI que os executam.
Outros targets podem ser executados usando o comando `ng run`, e você pode definir seus próprios targets.

Cada objeto de target especifica o `builder` desse target, que é o pacote npm da ferramenta que o Architect executa.
Cada target também tem uma seção `options`, que configura as opções padrão do target, e uma seção `configurations`, que nomeia e especifica configurações alternativas para o target.
Veja o exemplo em [Target de build](#build-target) abaixo.

| Propriedade    | Detalhes |
| :------------- | :------- |
| `build`        | Configura os padrões para as opções do comando `ng build`. Veja a seção [Target de build](#build-target) para mais informações. |
| `serve`        | Configura os padrões para as opções do comando `ng serve`. O servidor de desenvolvimento tem suas próprias opções e constrói a aplicação com o target de build definido na sua opção `buildTarget`. |
| `e2e`          | Configura os padrões para as opções do comando `ng e2e`, que executa testes end-to-end. Não é gerado por `ng new`. Executar `ng e2e` sem este target oferece a opção de adicionar um pacote de testes end-to-end. |
| `test`         | Configura os padrões para as opções do comando `ng test`. O builder de testes unitários usa o target de build definido na sua opção `buildTarget` para construir os testes. |
| `lint`         | Configura os padrões para as opções do comando `ng lint`, que realiza análise estática de código nos arquivos de origem do projeto. Não é gerado por `ng new`. Executar `ng lint` sem este target oferece a opção de adicionar o `angular-eslint`. |
| `extract-i18n` | Configura os padrões para as opções do comando `ng extract-i18n`, que extrai strings de mensagens localizáveis do código fonte e gera arquivos de tradução para internacionalização. |

HELPFUL: Todas as opções no arquivo de configuração devem usar `camelCase`, em vez de `dash-case`, como é usado na linha de comando.

## Target de build {#build-target}

Cada target em `architect` tem as seguintes propriedades:

| Propriedade      | Detalhes |
| :--------------- | :------- |
| `builder`        | O builder CLI usado para criar este target, na forma `<package-name>:<builder-name>`. |
| `options`        | Opções padrão do target de build. |
| `configurations` | Configurações alternativas para executar o target. Cada configuração define as opções padrão para aquele ambiente, sobrescrevendo o valor correspondente em `options`. Veja [Configurações alternativas de build](#alternate-build-configurations) abaixo. |

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
- Remoção de espaços em branco excessivos
- Remoção de comentários e código morto
- Minificação do código para usar nomes curtos e ofuscados

Você pode definir e nomear configurações alternativas extras (como `staging`, por exemplo) apropriadas ao seu processo de desenvolvimento.
Você pode selecionar uma configuração alternativa passando o nome dela para a flag de linha de comando `--configuration`.

Por exemplo, para configurar um build em que a otimização fique habilitada apenas para builds de produção (`ng build --configuration production`):

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
Por exemplo, para aplicar as configurações de build `staging` e `french` ao mesmo tempo, use o comando `ng build --configuration staging,french`.
Nesse caso, o comando analisa as configurações nomeadas da esquerda para a direita.
Se várias configurações alterarem a mesma opção, o último valor definido é o valor final.
Neste exemplo, se as configurações `staging` e `french` definirem o caminho de saída, o valor de `french` será o usado.

### Opções extras de build e teste {#extra-build-and-test-options}

As opções configuráveis de um build padrão ou direcionado geralmente correspondem às opções disponíveis para os comandos [`ng build`](cli/build) e [`ng test`](cli/test).
Para detalhes dessas opções e de seus valores possíveis, veja a [Referência do Angular CLI](cli).

| Propriedades de opções     | Detalhes |
| :------------------------- | :------- |
| `assets`                   | Um objeto contendo caminhos para assets estáticos a servir com a aplicação. Os caminhos padrão apontam para o diretório `public` do projeto. Veja mais na seção [Configuração de assets](#assets-configuration). |
| `styles`                   | Um array de arquivos CSS a adicionar ao contexto global do projeto. O Angular CLI oferece suporte a importações CSS e a todos os principais pré-processadores CSS. Veja mais na seção [Configuração de estilos e scripts](#styles-and-scripts-configuration). |
| `stylePreprocessorOptions` | Um objeto contendo pares opção-valor a passar para os pré-processadores de estilo. Veja mais na seção [Configuração de estilos e scripts](#styles-and-scripts-configuration). |
| `inlineStyleLanguage`      | A linguagem de folha de estilos usada nos estilos inline dos components da aplicação. Aceita `css`, `less`, `sass` ou `scss`, e o padrão é `css`. |
| `scripts`                  | Um objeto contendo arquivos JavaScript a adicionar à aplicação. Os scripts são carregados exatamente como se você os tivesse adicionado em uma tag `<script>` dentro do `index.html`. Veja mais na seção [Configuração de estilos e scripts](#styles-and-scripts-configuration). |
| `budgets`                  | Tipo padrão de orçamento de tamanho e limites para toda a aplicação ou partes dela. Você pode configurar o builder para reportar um aviso ou um erro quando a saída atingir ou exceder um limite de tamanho. Veja [Configurar orçamentos de tamanho](tools/cli/build#configuring-size-budgets). |
| `fileReplacements`         | Um objeto contendo arquivos e suas substituições em tempo de compilação. Veja mais em [Configurar substituições de arquivo específicas do target](tools/cli/environments#configure-environment-specific-defaults). |
| `index`                    | Um documento HTML base que carrega a aplicação. Veja mais em [Configuração de index](#index-configuration). |
| `security`                 | Um objeto que configura os recursos de segurança. Veja mais na seção [Configuração de segurança](#security-configuration). |

### Opções extras de serve {#extra-serve-options}

O servidor de desenvolvimento vem com seu próprio conjunto de opções, que geralmente correspondem às opções disponíveis para o comando [`ng serve`](cli/serve).

| Propriedades de opções | Detalhes |
| :--------------------- | :------- |
| `allowedHosts`         | Um array de hosts aos quais o servidor de desenvolvimento responderá. Esta opção define a opção do Vite de mesmo nome. Para mais detalhes, [consulte a documentação do Vite](https://vite.dev/config/server-options.html#server-allowedhosts). |

## Valores de configuração complexos {#complex-configuration-values}

As opções `assets`, `index`, `outputPath`, `styles` e `scripts` podem ter valores de caminho em string simples ou valores de objeto com campos específicos.
As opções `sourceMap` e `optimization` podem ser definidas como um valor booleano simples. Elas também podem receber um valor complexo no arquivo de configuração.

As seções a seguir detalham como esses valores complexos são usados em cada caso.

### Configuração de assets {#assets-configuration}

Cada configuração de target `build` pode incluir um array `assets`, que lista arquivos ou pastas que você deseja copiar como estão ao construir seu projeto.
Por padrão, o conteúdo do diretório `public/` é copiado.

Para excluir um asset, você pode removê-lo da configuração de assets.

Você pode configurar ainda mais os assets a serem copiados especificando-os como objetos, em vez de caminhos simples relativos à raiz do workspace.
Um objeto de especificação de asset pode ter os seguintes campos.

| Campos           | Detalhes |
| :--------------- | :------- |
| `glob`           | Um [node-glob](https://github.com/isaacs/node-glob/blob/main/README.md) que usa `input` como diretório base. |
| `input`          | Um caminho relativo à raiz do workspace. |
| `output`         | Um caminho relativo a `outDir`. Por causa das implicações de segurança, o Angular CLI nunca grava arquivos fora do caminho de saída do projeto. |
| `ignore`         | Uma lista de globs a excluir. |
| `followSymlinks` | Permite que os padrões glob sigam diretórios de link simbólico. Isso permite que os subdiretórios do link simbólico sejam pesquisados. O padrão é `false`. |

Por exemplo, os objetos de asset a seguir copiam o conteúdo de `src/assets/` para `/assets/` e `src/favicon.ico` para a raiz da saída.

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

O exemplo a seguir usa o campo `ignore` para excluir da cópia para o build alguns arquivos do diretório de assets:

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

### Configuração de estilos e scripts {#styles-and-scripts-configuration}

Uma entrada de array para as opções `styles` e `scripts` pode ser uma string de caminho simples ou um objeto que aponta para um arquivo de ponto de entrada extra.
O builder associado carrega esse arquivo e suas dependências como um bundle separado durante o build.
Com um objeto de configuração, você pode nomear o bundle do ponto de entrada usando o campo `bundleName`.

O bundle é injetado por padrão, mas você pode definir `inject` como `false` para excluí-lo da injeção.
Por exemplo, os valores de objeto a seguir criam e nomeiam um bundle que contém estilos e scripts, e o excluem da injeção:

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

#### Opções de pré-processador de estilo {#style-preprocessor-options}

No Sass, você pode usar o recurso `includePaths` tanto para estilos de component quanto para estilos globais. Isso permite adicionar caminhos base extras que são verificados nos imports.

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
              "includePaths": ["src/style-paths"]
            }
          }
        }
      }
    }
  }
}
```

Os arquivos desse diretório, como `src/style-paths/_variables.scss`, podem ser importados de qualquer lugar do seu projeto sem a necessidade de um caminho relativo:

```scss {header: "src/app/app.scss"}
// Um caminho relativo funciona
@import '../style-paths/variables';

// Mas agora isto também funciona
@import 'variables';
```

HELPFUL: O builder `@angular/build:unit-test` padrão não tem as opções `styles` ou `scripts`. Ele herda `styles` e `stylePreprocessorOptions` do target de build definido na sua opção `buildTarget`, mas não `scripts`.
Para executar um script antes dos seus testes unitários, adicione-o à opção `setupFiles` do target `test`.
Se o seu projeto usa o builder `@angular/build:karma`, adicione quaisquer estilos ou scripts de que seus testes unitários precisem ao target `test`.
Veja também [Usando bibliotecas globais de runtime dentro da sua aplicação](tools/libraries/using-libraries#using-runtime-global-libraries-inside-your-app).

### Configuração de otimização {#optimization-configuration}

A opção `optimization` pode ser um booleano ou um objeto para uma configuração mais refinada.
Esta opção habilita várias otimizações da saída do build, incluindo:

- Minificação de scripts e estilos
- Tree-shaking
- Eliminação de código morto
- [Inlining de CSS crítico](/tools/cli/build#critical-css-inlining)
- Inlining de fontes

Várias opções podem ser usadas para refinar a otimização de uma aplicação.

| Opções    | Detalhes | Tipo de valor | Valor padrão |
| :-------- | :------- | :------------ | :----------- |
| `scripts` | Habilita a otimização da saída de scripts. | `boolean` | `true` |
| `styles`  | Habilita a otimização da saída de estilos. | `boolean` \| [Opções de otimização de estilos](#styles-optimization-options) | `true` |
| `fonts`   | Habilita a otimização de fontes. Isso requer acesso à internet. | `boolean` \| [Opções de otimização de fontes](#fonts-optimization-options) | `true` |

#### Opções de otimização de estilos {#styles-optimization-options}

| Opções                  | Detalhes | Tipo de valor | Valor padrão |
| :---------------------- | :------- | :------------ | :----------- |
| `minify`                | Minifica as definições CSS removendo espaços em branco e comentários desnecessários, mesclando identificadores e minimizando valores. | `boolean` | `true` |
| `inlineCritical`        | Extrai e incorpora as definições CSS críticas para melhorar a [First Contentful Paint](https://web.dev/first-contentful-paint). | `boolean` | `true` |
| `removeSpecialComments` | Remove comentários do CSS global que contêm `@license` ou `@preserve`, ou que começam com `//!` ou `/*!`. | `boolean` | `true` |

#### Opções de otimização de fontes {#fonts-optimization-options}

| Opções   | Detalhes | Tipo de valor | Valor padrão |
| :------- | :------- | :------------ | :----------- |
| `inline` | Reduz [requisições que bloqueiam a renderização](https://web.dev/render-blocking-resources) incorporando as definições CSS de Google Fonts e Adobe Fonts externas no arquivo HTML index da aplicação. Isso requer acesso à internet. | `boolean` | `true` |

Você pode fornecer um valor como o seguinte para aplicar a otimização a um ou outro:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "optimization": {
              "scripts": true,
              "styles": {
                "minify": true,
                "inlineCritical": true
              },
              "fonts": true
            }
          }
        }
      }
    }
  }
}
```

### Configuração de source map {#source-map-configuration}

A opção de builder `sourceMap` pode ser um booleano ou um objeto para uma configuração mais refinada, que controla os source maps de uma aplicação.

| Opções           | Detalhes | Tipo de valor | Valor padrão |
| :--------------- | :------- | :------------ | :----------- |
| `scripts`        | Gera source maps para todos os scripts. | `boolean` | `true` |
| `styles`         | Gera source maps para todos os estilos. | `boolean` | `true` |
| `vendor`         | Resolve os source maps de pacotes vendor. | `boolean` | `false` |
| `hidden`         | Omite o link para os sourcemaps no JavaScript de saída. | `boolean` | `false` |
| `sourcesContent` | Gera o conteúdo original dos arquivos de origem dentro dos source maps. | `boolean` | `true` |

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
Eles são úteis se você quer apenas source maps para mapear stack traces em ferramentas de relatório de erros, sem que apareçam nas ferramentas de desenvolvedor do browser.
Observe que, embora `hidden` impeça que o source map seja vinculado no bundle de saída, seu processo de deploy deve garantir que os sourcemaps gerados não sejam servidos em produção, ou a informação continua vazando.

#### Source maps sem conteúdo de fontes {#source-maps-without-sources-content}

Você pode gerar source maps sem o campo `sourcesContent`, que contém o código fonte original.
Isso permite fazer o deploy de source maps para produção para um melhor relatório de erros com os nomes de origem originais, protegendo ao mesmo tempo o seu código fonte contra exposição.

Para excluir o conteúdo de origem dos source maps, defina a opção `sourcesContent` como `false`:

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

A opção `index` pode ser uma string ou um objeto para uma configuração mais refinada.
Defina-a como `false` para não gerar um arquivo HTML index.

Ao fornecer o valor como uma string, o nome do arquivo do caminho especificado será usado para o arquivo gerado, que será criado na raiz do caminho de saída configurado da aplicação.

#### Opções de index {#index-options}

| Opções           | Detalhes | Tipo de valor | Valor padrão |
| :--------------- | :------- | :------------ | :----------- |
| `input`          | O caminho de um arquivo a usar para o HTML index gerado da aplicação. | `string` | Nenhum (obrigatório) |
| `output`         | O caminho de saída do arquivo HTML index gerado da aplicação. O caminho completo fornecido será usado e será considerado relativo ao caminho de saída configurado da aplicação. | `string` | `index.html` |
| `preloadInitial` | Gera os elementos de link `preload`, `modulepreload` e `preconnect` para os arquivos e recursos iniciais da aplicação. | `boolean` | `false` quando um service worker está habilitado, caso contrário `true` |

### Configuração de segurança {#security-configuration}

A opção `security` é um objeto que habilita recursos de segurança individuais.

| Opções         | Detalhes |
| :------------- | :------- |
| `autoCsp`      | Gera uma Content Security Policy baseada em hash quando definida como `true`, ou como `{"unsafeEval": true}` para também permitir `eval`. Veja [Faça hash de scripts inline com `autoCsp`](best-practices/security#hash-inline-scripts-with-autocsp). |
| `allowedHosts` | Os nomes de host autorizados a acessar a aplicação do lado do servidor. Veja [Prevenindo Server-Side Request Forgery (SSRF)](best-practices/security#preventing-server-side-request-forgery-ssrf). |

### Configuração do caminho de saída {#output-path-configuration}

A opção `outputPath` pode ser uma String, que será usada como valor de `base`, ou um Objeto para uma configuração mais refinada.

Várias opções podem ser usadas para refinar a estrutura de saída de uma aplicação.

| Opções    | Detalhes | Tipo de valor | Valor padrão |
| :-------- | :------- | :------------ | :----------- |
| `base`    | Especifica o caminho de saída relativo à raiz do workspace. | `string` | |
| `browser` | O nome do diretório de saída do seu build para browser, dentro do caminho de saída base. Pode ser servido aos usuários com segurança. | `string` | `browser` |
| `server`  | O nome do diretório de saída do seu build de servidor, dentro do caminho base de saída. | `string` | `server` |
| `media`   | O nome do diretório de saída dos seus arquivos de mídia, localizado dentro do diretório de saída do browser. Esses arquivos de mídia são comumente chamados de recursos nos arquivos CSS. | `string` | `media` |
