<!-- ia-translate: true -->
# Angular package format

Este documento descreve o Angular Package Format \(APF\).
APF é uma especificação específica do Angular para a estrutura e formato de packages npm que é usado por todos os packages Angular de primeira parte \(`@angular/core`, `@angular/material`, etc.\) e pela maioria das bibliotecas Angular de terceiros.

APF permite que um package funcione perfeitamente na maioria dos cenários comuns que usam Angular.
Packages que usam APF são compatíveis com as ferramentas oferecidas pela equipe Angular, bem como com o ecossistema JavaScript mais amplo.
É recomendado que desenvolvedores de bibliotecas de terceiros sigam o mesmo formato de package npm.

HELPFUL: APF é versionado junto com o restante do Angular, e cada versão principal melhora o formato do package.
Você pode encontrar as versões da especificação anteriores à v13 neste [google doc](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview).

## Por que especificar um formato de package?

No cenário JavaScript de hoje, desenvolvedores consomem packages de muitas maneiras diferentes, usando muitas toolchains diferentes \(webpack, Rollup, esbuild, etc.\).
Essas ferramentas podem entender e exigir diferentes inputs - algumas ferramentas podem ser capazes de processar a versão mais recente da linguagem ES, enquanto outras podem se beneficiar de consumir diretamente uma versão ES mais antiga.

O formato de distribuição Angular suporta todas as ferramentas de desenvolvimento e workflows comumente usados, e adiciona ênfase em otimizações que resultam em um tamanho de payload de aplicação menor ou em um ciclo de iteração de desenvolvimento mais rápido \(tempo de build\).

Desenvolvedores podem confiar no Angular CLI e no [ng-packagr](https://github.com/ng-packagr/ng-packagr) \(uma ferramenta de build que o Angular CLI usa\) para produzir packages no formato Angular package.
Veja o guia [Creating Libraries](tools/libraries/creating-libraries) para mais detalhes.

## Layout de arquivos

O exemplo a seguir mostra uma versão simplificada do layout de arquivos do package `@angular/core`, com uma explicação para cada arquivo no package.

```markdown
node_modules/@angular/core
├── README.md
├── package.json
├── fesm2022
│   ├── core.mjs
│   ├── core.mjs.map
│   ├── testing.mjs
│   └── testing.mjs.map
└── types
│   ├── core.d.ts
│   ├── testing.d.ts
```

Esta tabela descreve o layout de arquivos em `node_modules/@angular/core` anotado para descrever o propósito dos arquivos e diretórios:

| Arquivos                                                                                                                                                     | Propósito                                                                                                                                                                                        |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `README.md`                                                                                                                                               | README do package, usado pela interface web do npmjs.                                                                                                                                                          |
| `package.json`                                                                                                                                            | `package.json` principal, descrevendo o package em si, bem como todos os entrypoints disponíveis e formatos de código. Este arquivo contém o mapeamento "exports" usado por runtimes e ferramentas para realizar a resolução de módulos. |
| `fesm2022/` <br /> &nbsp;&nbsp;─ `core.mjs` <br /> &nbsp;&nbsp;─ `core.mjs.map` <br /> &nbsp;&nbsp;─ `testing.mjs` <br /> &nbsp;&nbsp;─ `testing.mjs.map` | Código para todos os entrypoints em formato ES2022 achatado \(FESM\), junto com source maps.                                                                                                                          |
| `types/` <br /> &nbsp;&nbsp;─ `core.d.ts` <br /> &nbsp;&nbsp;─ `testing.d.ts`                                                                             | Definições de tipo TypeScript empacotadas para todos os entrypoints públicos.                                                                                                                                |

## `package.json`

O `package.json` principal contém metadados importantes do package, incluindo o seguinte:

- Ele [declara](#esm-declaration) que o package está no formato EcmaScript Module \(ESM\)
- Ele contém um campo `"exports"` que define os formatos de código-fonte disponíveis de todos os entrypoints
- Ele contém [chaves](#legacy-resolution-keys) que definem os formatos de código-fonte disponíveis do entrypoint principal `@angular/core`, para ferramentas que não entendem `"exports"`.
  Essas chaves são consideradas obsoletas e podem ser removidas à medida que o suporte para `"exports"` se dissemina pelo ecossistema.

- Ele declara se o package contém [efeitos colaterais](#side-effects)

### Declaração ESM

O `package.json` de nível superior contém a chave:

```js
{
  "type": "module"
}
```

Isso informa aos resolvedores que o código dentro do package está usando EcmaScript Modules em oposição a módulos CommonJS.

### `"exports"`

O campo `"exports"` tem a seguinte estrutura:

```js
"exports": {
  "./schematics/*": {
    "default": "./schematics/*.js"
  },
  "./package.json": {
    "default": "./package.json"
  },
  ".": {
    "types": "./types/core.d.ts",
    "default": "./fesm2022/core.mjs"
  },
  "./testing": {
    "types": "./types/testing.d.ts",
    "default": "./fesm2022/testing.mjs"
  }
}
```

De interesse principal são as chaves `"."` e `"./testing"`, que definem os formatos de código disponíveis para o entrypoint principal `@angular/core` e o entrypoint secundário `@angular/core/testing`, respectivamente.
Para cada entrypoint, os formatos disponíveis são:

| Formatos                   | Detalhes                                                                 |
| :------------------------ | :---------------------------------------------------------------------- |
| Typings \(arquivos `.d.ts`\) | Arquivos `.d.ts` são usados pelo TypeScript ao depender de um package específico. |
| `default`                 | Código ES2022 achatado em uma única fonte.                             |

Ferramentas que estão cientes dessas chaves podem selecionar preferencialmente um formato de código desejável de `"exports"`.

Bibliotecas podem querer expor arquivos estáticos adicionais que não são capturados pelas exports dos entry-points baseados em JavaScript, como mixins Sass ou CSS pré-compilado.

Para mais informações, veja [Managing assets in a library](tools/libraries/creating-libraries#managing-assets-in-a-library).

### Chaves de resolução legadas

Além de `"exports"`, o `package.json` de nível superior também define chaves de resolução de módulo legadas para resolvedores que não suportam `"exports"`.
Para `@angular/core` estas são:

```js
{
  "module": "./fesm2022/core.mjs",
  "typings": "./types/core.d.ts",
}
```

Como mostrado no trecho de código anterior, um resolvedor de módulo pode usar essas chaves para carregar um formato de código específico.

### Efeitos colaterais

A última função do `package.json` é declarar se o package tem [efeitos colaterais](#sideeffects-flag).

```js
{
  "sideEffects": false
}
```

A maioria dos packages Angular não deve depender de efeitos colaterais de nível superior e, portanto, deve incluir esta declaração.

## Entrypoints e divisão de código

Packages no Angular Package Format contêm um entrypoint principal e zero ou mais entrypoints secundários \(por exemplo, `@angular/common/http`\).
Entrypoints servem várias funções.

1. Eles definem os especificadores de módulo dos quais os usuários importam código \(por exemplo, `@angular/core` e `@angular/core/testing`\).

   Os usuários normalmente percebem esses entrypoints como grupos distintos de símbolos, com propósitos ou capacidades diferentes.

   Entrypoints específicos podem ser usados apenas para propósitos especiais, como testes.
   Tais APIs podem ser separadas do entrypoint principal para reduzir a chance de serem usadas acidentalmente ou incorretamente.

1. Eles definem a granularidade com a qual o código pode ser carregado de forma lazy.

   Muitas ferramentas de build modernas são capazes apenas de "divisão de código" \(também conhecido como lazy loading\) no nível de ES Module.
   O Angular Package Format usa principalmente um único ES Module "achatado" por entry point. Isso significa que a maioria das ferramentas de build não consegue dividir código com um único entry point em múltiplos chunks de saída.

A regra geral para packages APF é usar entrypoints para os menores conjuntos de código logicamente conectados possível.
Por exemplo, o package Angular Material publica cada componente lógico ou conjunto de componentes como um entrypoint separado - um para Button, um para Tabs, etc.
Isso permite que cada componente Material seja carregado de forma lazy separadamente, se desejado.

Nem todas as bibliotecas requerem tal granularidade.
A maioria das bibliotecas com um único propósito lógico deve ser publicada como um único entrypoint.
`@angular/core`, por exemplo, usa um único entrypoint para o runtime, porque o runtime Angular geralmente é usado como uma única entidade.

### Resolução de entry points secundários

Entry points secundários podem ser resolvidos via o campo `"exports"` do `package.json` para o package.

## README.md

O arquivo README no formato Markdown que é usado para exibir a descrição de um package no npm e no GitHub.

Exemplo de conteúdo README do package @angular/core:

```html

Angular
&equals;&equals;&equals;&equals;&equals;&equals;&equals;

The sources for this package are in the main [Angular](https://github.com/angular/angular) repo.Please file issues and pull requests against that repo.

License: MIT

```

## Compilação parcial

Bibliotecas no Angular Package Format devem ser publicadas no modo "compilação parcial".
Este é um modo de compilação para `ngc` que produz código Angular compilado que não está vinculado a uma versão específica do runtime Angular, em contraste com a compilação completa usada para aplicações, onde as versões do compilador e do runtime Angular devem corresponder exatamente.

Para compilar parcialmente código Angular, use a flag `compilationMode` na propriedade `angularCompilerOptions` do seu `tsconfig.json`:

```js
{
  …
  "angularCompilerOptions": {
    "compilationMode": "partial",
  }
}
```

O código de biblioteca parcialmente compilado é então convertido em código totalmente compilado durante o processo de build da aplicação pelo Angular CLI.

Se o seu pipeline de build não usa o Angular CLI, então consulte o guia [Consuming partial ivy code outside the Angular CLI](tools/libraries/creating-libraries#consuming-partial-ivy-code-outside-the-angular-cli).

## Otimizações

### Achatamento de módulos ES

O Angular Package Format especifica que o código seja publicado no formato de módulo ES "achatado".
Isso reduz significativamente o tempo de build de aplicações Angular, bem como o tempo de download e análise do bundle final da aplicação.
Por favor, confira o excelente post ["The cost of small modules"](https://nolanlawson.com/2016/08/15/the-cost-of-small-modules) de Nolan Lawson.

O compilador Angular pode gerar arquivos de índice de módulo ES. Ferramentas como Rollup podem usar esses arquivos para gerar módulos achatados em um formato de arquivo _Flattened ES Module_ (FESM).

FESM é um formato de arquivo criado achatando todos os ES Modules acessíveis de um entrypoint em um único ES Module.
É formado seguindo todos os imports de um package e copiando esse código em um único arquivo, preservando todos os exports ES públicos e removendo todos os imports privados.

O nome abreviado, FESM, pronunciado _fé-som_, pode ser seguido por um número como FESM2020.
O número refere-se ao nível de linguagem do JavaScript dentro do módulo.
Consequentemente, um arquivo FESM2022 seria ESM+ES2022 e incluiria declarações import/export e código-fonte ES2022.

Para gerar um arquivo de índice de módulo ES achatado, use as seguintes opções de configuração no seu arquivo tsconfig.json:

```js
{
  "compilerOptions": {
    …
    "module": "esnext",
    "target": "es2022",
    …
  },
  "angularCompilerOptions": {
    …
    "flatModuleOutFile": "my-ui-lib.js",
    "flatModuleId": "my-ui-lib"
  }
}
```

Uma vez que o arquivo de índice \(por exemplo, `my-ui-lib.js`\) é gerado pelo ngc, bundlers e otimizadores como Rollup podem ser usados para produzir o arquivo ESM achatado.

### Flag "sideEffects"

Por padrão, EcmaScript Modules têm efeitos colaterais: importar de um módulo garante que qualquer código no nível superior desse módulo deve ser executado.
Isso geralmente é indesejável, pois a maioria do código com efeitos colaterais em módulos típicos não é verdadeiramente com efeitos colaterais, mas afeta apenas símbolos específicos.
Se esses símbolos não forem importados e usados, muitas vezes é desejável removê-los em um processo de otimização conhecido como tree-shaking, e o código com efeitos colaterais pode impedir isso.

Ferramentas de build como webpack suportam uma flag que permite que packages declarem que não dependem de código com efeitos colaterais no nível superior de seus módulos, dando às ferramentas mais liberdade para fazer tree-shaking do código do package.
O resultado final dessas otimizações deve ser um tamanho de bundle menor e melhor distribuição de código em chunks de bundle após a divisão de código.
Esta otimização pode quebrar seu código se ele contiver efeitos colaterais não-locais - isso, no entanto, não é comum em aplicações Angular e geralmente é um sinal de design ruim.
A recomendação é que todos os packages reivindiquem o status livre de efeitos colaterais definindo a propriedade `sideEffects` como `false`, e que os desenvolvedores sigam o [Angular Style Guide](/style-guide) que naturalmente resulta em código sem efeitos colaterais não-locais.

Mais informações: [documentação do webpack sobre efeitos colaterais](https://github.com/webpack/webpack/tree/master/examples/side-effects)

### Nível de linguagem ES2022

ES2022 é agora o nível de linguagem padrão que é consumido pelo Angular CLI e outras ferramentas.
O Angular CLI faz o down-level do bundle para um nível de linguagem que é suportado por todos os navegadores alvo no momento do build da aplicação.

### Empacotamento de d.ts / achatamento de definição de tipo

A partir do APF v8, é recomendado empacotar definições TypeScript.
O empacotamento de definições de tipo pode acelerar significativamente as compilações para os usuários, especialmente se houver muitos arquivos-fonte `.ts` individuais em sua biblioteca.

Angular usa [`rollup-plugin-dts`](https://github.com/Swatinem/rollup-plugin-dts) para achatar arquivos `.d.ts` (usando `rollup`, semelhante a como os arquivos FESM são criados).

Usar rollup para empacotamento de `.d.ts` é benéfico, pois suporta divisão de código entre entry-points.
Por exemplo, considere que você tem múltiplos entrypoints dependendo do mesmo tipo compartilhado, um arquivo `.d.ts` compartilhado seria criado junto com os arquivos `.d.ts` achatados maiores.
Isso é desejável e evita duplicação de tipos.

### Tslib

A partir do APF v10, é recomendado adicionar tslib como uma dependência direta do seu entry-point principal.
Isso ocorre porque a versão do tslib está vinculada à versão do TypeScript usada para compilar sua biblioteca.

## Exemplos

<docs-pill-row>
  <docs-pill href="https://unpkg.com/browse/@angular/core@17.0.0/" title="@angular/core package"/>
  <docs-pill href="https://unpkg.com/browse/@angular/material@17.0.0/" title="@angular/material package"/>
</docs-pill-row>

## Definição de termos

Os termos a seguir são usados intencionalmente ao longo deste documento.
Nesta seção estão as definições de todos eles para fornecer clareza adicional.

### Package

O menor conjunto de arquivos que são publicados no NPM e instalados juntos, por exemplo `@angular/core`.
Este package inclui um manifesto chamado package.json, código-fonte compilado, arquivos de definição typescript, source maps, metadados, etc.
O package é instalado com `npm install @angular/core`.

### Symbol

Uma classe, função, constante ou variável contida em um módulo e opcionalmente tornada visível ao mundo externo via export de módulo.

### Module

Abreviação de ECMAScript Modules.
Um arquivo contendo declarações que importam e exportam símbolos.
Isso é idêntico à definição de módulos na especificação ECMAScript.

### ESM

Abreviação de ECMAScript Modules \(veja acima\).

### FESM

Abreviação de Flattened ES Modules e consiste em um formato de arquivo criado achatando todos os ES Modules acessíveis de um entry point em um único ES Module.

### Module ID

O identificador de um módulo usado nas declarações import \(por exemplo, `@angular/core`\).
O ID geralmente mapeia diretamente para um caminho no sistema de arquivos, mas isso nem sempre é o caso devido a várias estratégias de resolução de módulo.

### Module specifier

Um identificador de módulo \(veja acima\).

### Estratégia de resolução de módulo

Algoritmo usado para converter Module IDs em caminhos no sistema de arquivos.
Node.js tem um que é bem especificado e amplamente usado, TypeScript suporta várias estratégias de resolução de módulo, [Closure Compiler](https://developers.google.com/closure/compiler) tem ainda outra estratégia.

### Formato de módulo

Especificação da sintaxe do módulo que cobre no mínimo a sintaxe para importação e exportação de um arquivo.
Formatos de módulo comuns são CommonJS \(CJS, normalmente usado para aplicações Node.js\) ou ECMAScript Modules \(ESM\).
O formato do módulo indica apenas o empacotamento dos módulos individuais, mas não os recursos da linguagem JavaScript usados para compor o conteúdo do módulo.
Por causa disso, a equipe Angular frequentemente usa o especificador de nível de linguagem como sufixo para o formato do módulo, \(por exemplo, ESM+ES2022 especifica que o módulo está em formato ESM e contém código ES2022\).

### Bundle

Um artefato na forma de um único arquivo JS, produzido por uma ferramenta de build \(por exemplo, [webpack](https://webpack.js.org) ou [Rollup](https://rollupjs.org)\) que contém símbolos originários de um ou mais módulos.
Bundles são uma solução específica do navegador que reduz a carga de rede que seria causada se os navegadores começassem a baixar centenas, senão dezenas de milhares de arquivos.
Node.js normalmente não usa bundles.
Formatos de bundle comuns são UMD e System.register.

### Nível de linguagem

A linguagem do código \(ES2022\).
Independente do formato do módulo.

### Entry point

Um módulo destinado a ser importado pelo usuário.
Ele é referenciado por um module ID único e exporta a API pública referenciada por esse module ID.
Um exemplo é `@angular/core` ou `@angular/core/testing`.
Ambos os entry points existem no package `@angular/core`, mas eles exportam símbolos diferentes.
Um package pode ter muitos entry points.

### Deep import

Um processo de recuperação de símbolos de módulos que não são Entry Points.
Esses module IDs geralmente são considerados APIs privadas que podem mudar durante o tempo de vida do projeto ou enquanto o bundle para o package específico está sendo criado.

### Top-Level import

Um import proveniente de um entry point.
Os top-level imports disponíveis são o que define a API pública e são expostos em módulos "@angular/name", como `@angular/core` ou `@angular/common`.

### Tree-shaking

O processo de identificar e remover código não usado por uma aplicação - também conhecido como eliminação de código morto.
Esta é uma otimização global realizada no nível da aplicação usando ferramentas como [Rollup](https://rollupjs.org), [Closure Compiler](https://developers.google.com/closure/compiler), ou [Terser](https://github.com/terser/terser).

### Compilador AOT

O Ahead of Time Compiler para Angular.

### Definições de tipo achatadas

As definições TypeScript empacotadas geradas a partir do [API Extractor](https://api-extractor.com).
