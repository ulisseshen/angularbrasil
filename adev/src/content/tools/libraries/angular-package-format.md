<!-- ia-translate: true -->
# Formato de pacote Angular

Este documento descreve o Formato de Pacote Angular \(APF\).
APF é uma especificação específica do Angular para a estrutura e formato de pacotes npm que é usada por todos os pacotes Angular de primeira parte \(`@angular/core`, `@angular/material`, etc.\) e pela maioria das bibliotecas Angular de terceiros.

APF permite que um pacote funcione perfeitamente nos cenários mais comuns que usam Angular.
Pacotes que usam APF são compatíveis com as ferramentas oferecidas pela equipe Angular, bem como com o ecossistema JavaScript mais amplo.
Recomenda-se que desenvolvedores de bibliotecas de terceiros sigam o mesmo formato de pacote npm.

ÚTIL: APF é versionado junto com o resto do Angular, e cada versão principal melhora o formato do pacote.
Você pode encontrar as versões da especificação anteriores à v13 neste [google doc](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview).

## Por que especificar um formato de pacote?

No cenário JavaScript de hoje, desenvolvedores consomem pacotes de muitas maneiras diferentes, usando muitas toolchains diferentes \(webpack, Rollup, esbuild, etc.\).
Essas ferramentas podem entender e exigir entradas diferentes - algumas ferramentas podem processar a versão de linguagem ES mais recente, enquanto outras podem se beneficiar do consumo direto de uma versão ES mais antiga.

O formato de distribuição Angular suporta todas as ferramentas de desenvolvimento e workflows comumente usados, e adiciona ênfase em otimizações que resultam em tamanho de payload de aplicação menor ou ciclo de iteração de desenvolvimento mais rápido \(tempo de build\).

Desenvolvedores podem confiar no Angular CLI e [ng-packagr](https://github.com/ng-packagr/ng-packagr) \(uma ferramenta de build que o Angular CLI usa\) para produzir pacotes no formato de pacote Angular.
Veja o guia [Criando Bibliotecas](tools/libraries/creating-libraries) para mais detalhes.

## Layout de arquivos

O exemplo a seguir mostra uma versão simplificada do layout de arquivos do pacote `@angular/core`, com uma explicação para cada arquivo no pacote.

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

Esta tabela descreve o layout de arquivos sob `node_modules/@angular/core` anotado para descrever o propósito de arquivos e diretórios:

| Arquivos                                                                                                                                                  | Propósito                                                                                                                                                                                                      |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `README.md`                                                                                                                                               | README do pacote, usado pela UI web do npmjs.                                                                                                                                                                  |
| `package.json`                                                                                                                                            | `package.json` primário, descrevendo o pacote em si, bem como todos os entrypoints disponíveis e formatos de código. Este arquivo contém o mapeamento "exports" usado por runtimes e ferramentas para realizar resolução de módulo. |
| `fesm2022/` <br /> &nbsp;&nbsp;─ `core.mjs` <br /> &nbsp;&nbsp;─ `core.mjs.map` <br /> &nbsp;&nbsp;─ `testing.mjs` <br /> &nbsp;&nbsp;─ `testing.mjs.map` | Código para todos os entrypoints em formato ES2022 achatado \(FESM\), junto com source maps.                                                                                                                  |
| `types/` <br /> &nbsp;&nbsp;─ `core.d.ts` <br /> &nbsp;&nbsp;─ `testing.d.ts`                                                                             | Definições de tipo TypeScript empacotadas para todos os entrypoints públicos.                                                                                                                                 |

## `package.json`

O `package.json` primário contém metadados importantes do pacote, incluindo o seguinte:

- Ele [declara](#esm-declaration) que o pacote está no formato EcmaScript Module \(ESM\)
- Ele contém um campo `"exports"` que define os formatos de código-fonte disponíveis de todos os entrypoints
- Ele contém [chaves](#legacy-resolution-keys) que definem os formatos de código-fonte disponíveis do entrypoint primário `@angular/core`, para ferramentas que não entendem `"exports"`.
  Essas chaves são consideradas descontinuadas e podem ser removidas à medida que o suporte para `"exports"` se espalha pelo ecossistema.

- Ele declara se o pacote contém [efeitos colaterais](#side-effects)

### Declaração ESM

O `package.json` de nível superior contém a chave:

```js
{
  "type": "module"
}
```

Isso informa aos resolvers que o código dentro do pacote está usando EcmaScript Modules em vez de módulos CommonJS.

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

De interesse primário são as chaves `"."` e `"./testing"`, que definem os formatos de código disponíveis para o entrypoint primário `@angular/core` e o entrypoint secundário `@angular/core/testing`, respectivamente.
Para cada entrypoint, os formatos disponíveis são:

| Formatos                  | Detalhes                                                                |
| :------------------------ | :---------------------------------------------------------------------- |
| Typings \(arquivos `.d.ts`\) | Arquivos `.d.ts` são usados pelo TypeScript ao depender de um determinado pacote. |
| `default`                 | Código ES2022 achatado em uma única fonte.                             |

Ferramentas que estão cientes dessas chaves podem selecionar preferencialmente um formato de código desejável de `"exports"`.

Bibliotecas podem querer expor arquivos estáticos adicionais que não são capturados pelas exportações dos entry-points baseados em JavaScript, como mixins Sass ou CSS pré-compilado.

Para mais informações, veja [Gerenciando assets em uma biblioteca](tools/libraries/creating-libraries#managing-assets-in-a-library).

### Chaves de resolução legadas

Além de `"exports"`, o `package.json` de nível superior também define chaves de resolução de módulo legadas para resolvers que não suportam `"exports"`.
Para `@angular/core` estas são:

```js
{
  "module": "./fesm2022/core.mjs",
  "typings": "./types/core.d.ts",
}
```

Como mostrado no trecho de código anterior, um resolver de módulo pode usar essas chaves para carregar um formato de código específico.

### Efeitos colaterais

A última função do `package.json` é declarar se o pacote tem [efeitos colaterais](#sideeffects-flag).

```js
{
  "sideEffects": false
}
```

A maioria dos pacotes Angular não deve depender de efeitos colaterais de nível superior e, portanto, deve incluir esta declaração.

## Entrypoints e code splitting

Pacotes no Formato de Pacote Angular contêm um entrypoint primário e zero ou mais entrypoints secundários \(por exemplo, `@angular/common/http`\).
Entrypoints servem várias funções.

1. Eles definem os especificadores de módulo dos quais os usuários importam código \(por exemplo, `@angular/core` e `@angular/core/testing`\).

   Os usuários normalmente percebem esses entrypoints como grupos distintos de símbolos, com propósitos ou capacidades diferentes.

   Entrypoints específicos podem ser usados apenas para propósitos especiais, como testes.
   Tais APIs podem ser separadas do entrypoint primário para reduzir a chance de serem usadas acidental ou incorretamente.

1. Eles definem a granularidade na qual o código pode ser carregado preguiçosamente.

   Muitas ferramentas de build modernas são capazes apenas de "code splitting" \(também conhecido como lazy loading\) no nível de ES Module.
   O Formato de Pacote Angular usa principalmente um único ES Module "achatado" por entry point. Isso significa que a maioria das ferramentas de build não é capaz de dividir código com um único entry point em múltiplos chunks de saída.

A regra geral para pacotes APF é usar entrypoints para os menores conjuntos de código logicamente conectado possível.
Por exemplo, o pacote Angular Material publica cada component lógico ou conjunto de components como um entrypoint separado - um para Button, um para Tabs, etc.
Isso permite que cada component Material seja carregado preguiçosamente separadamente, se desejado.

Nem todas as bibliotecas requerem tal granularidade.
A maioria das bibliotecas com um único propósito lógico deve ser publicada como um único entrypoint.
`@angular/core`, por exemplo, usa um único entrypoint para o runtime, porque o runtime Angular é geralmente usado como uma única entidade.

### Resolução de entry points secundários

Entry points secundários podem ser resolvidos através do campo `"exports"` do `package.json` para o pacote.

## README.md

O arquivo README no formato Markdown que é usado para exibir a descrição de um pacote no npm e GitHub.

Exemplo de conteúdo README do pacote @angular/core:

```html

Angular
&equals;&equals;&equals;&equals;&equals;&equals;&equals;

The sources for this package are in the main [Angular](https://github.com/angular/angular) repo.Please file issues and pull requests against that repo.

License: MIT

```

## Compilação parcial

Bibliotecas no Formato de Pacote Angular devem ser publicadas no modo "compilação parcial".
Este é um modo de compilação para `ngc` que produz código Angular compilado que não está vinculado a uma versão específica do runtime Angular, em contraste com a compilação completa usada para aplicações, onde as versões do compilador e runtime Angular devem corresponder exatamente.

Para compilar parcialmente código Angular, use a flag `compilationMode` na propriedade `angularCompilerOptions` de seu `tsconfig.json`:

```js
{
  …
  "angularCompilerOptions": {
    "compilationMode": "partial",
  }
}
```

Código de biblioteca parcialmente compilado é então convertido para código totalmente compilado durante o processo de build da aplicação pelo Angular CLI.

Se seu pipeline de build não usa o Angular CLI, então consulte o guia [Consumindo código partial ivy fora do Angular CLI](tools/libraries/creating-libraries#consuming-partial-ivy-code-outside-the-angular-cli).

## Otimizações

### Achatamento de ES modules

O Formato de Pacote Angular especifica que o código seja publicado em formato ES module "achatado".
Isso reduz significativamente o tempo de build de aplicações Angular, bem como o tempo de download e parse do pacote final da aplicação.
Por favor, confira o excelente post ["The cost of small modules"](https://nolanlawson.com/2016/08/15/the-cost-of-small-modules) de Nolan Lawson.

O compilador Angular pode gerar arquivos index ES module. Ferramentas como Rollup podem usar esses arquivos para gerar módulos achatados em um formato de arquivo _Flattened ES Module_ (FESM).

FESM é um formato de arquivo criado ao achatar todos os ES Modules acessíveis de um entrypoint em um único ES Module.
É formado seguindo todos os imports de um pacote e copiando esse código em um único arquivo, preservando todas as exportações públicas ES e removendo todos os imports privados.

O nome abreviado, FESM, pronunciado _fe-som_, pode ser seguido por um número como FESM2020.
O número se refere ao nível de linguagem do JavaScript dentro do módulo.
Consequentemente, um arquivo FESM2022 seria ESM+ES2022 e incluiria instruções import/export e código-fonte ES2022.

Para gerar um arquivo index ES Module achatado, use as seguintes opções de configuração em seu arquivo tsconfig.json:

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

Uma vez que o arquivo index \(por exemplo, `my-ui-lib.js`\) é gerado pelo ngc, bundlers e otimizadores como Rollup podem ser usados para produzir o arquivo ESM achatado.

### Flag "sideEffects"

Por padrão, EcmaScript Modules têm efeitos colaterais: importar de um módulo garante que qualquer código no nível superior desse módulo deve ser executado.
Isso é frequentemente indesejável, pois a maioria do código com efeitos colaterais em módulos típicos não é verdadeiramente com efeitos colaterais, mas apenas afeta símbolos específicos.
Se esses símbolos não forem importados e usados, muitas vezes é desejável removê-los em um processo de otimização conhecido como tree-shaking, e o código com efeitos colaterais pode impedir isso.

Ferramentas de build como webpack suportam uma flag que permite que pacotes declarem que não dependem de código com efeitos colaterais no nível superior de seus módulos, dando às ferramentas mais liberdade para fazer tree-shake do código do pacote.
O resultado final dessas otimizações deve ser menor tamanho de pacote e melhor distribuição de código em chunks de pacote após code-splitting.
Esta otimização pode quebrar seu código se ele contiver efeitos colaterais não-locais - isso, no entanto, não é comum em aplicações Angular e geralmente é um sinal de design ruim.
A recomendação é que todos os pacotes reivindiquem o status livre de efeitos colaterais definindo a propriedade `sideEffects` como `false`, e que os desenvolvedores sigam o [Guia de Estilo Angular](/style-guide) que naturalmente resulta em código sem efeitos colaterais não-locais.

Mais informações: [documentação do webpack sobre efeitos colaterais](https://github.com/webpack/webpack/tree/master/examples/side-effects)

### Nível de linguagem ES2022

ES2022 Language level é agora o nível de linguagem padrão que é consumido pelo Angular CLI e outras ferramentas.
O Angular CLI reduz o pacote para um nível de linguagem que é suportado por todos os browsers alvos no momento do build da aplicação.

### Empacotamento de d.ts / achatamento de definição de tipo

A partir do APF v8, é recomendado empacotar definições TypeScript.
O empacotamento de definições de tipo pode acelerar significativamente as compilações para usuários, especialmente se houver muitos arquivos-fonte `.ts` individuais em sua biblioteca.

Angular usa [`rollup-plugin-dts`](https://github.com/Swatinem/rollup-plugin-dts) para achatar arquivos `.d.ts` (usando `rollup`, similar a como arquivos FESM são criados).

Usar rollup para empacotamento de `.d.ts` é benéfico, pois suporta code splitting entre entry-points.
Por exemplo, considere que você tem múltiplos entrypoints dependendo do mesmo tipo compartilhado, um arquivo `.d.ts` compartilhado seria criado junto com os arquivos `.d.ts` achatados maiores.
Isso é desejável e evita duplicação de tipos.

### Tslib

A partir do APF v10, é recomendado adicionar tslib como uma dependência direta de seu entry-point primário.
Isso ocorre porque a versão do tslib está vinculada à versão do TypeScript usada para compilar sua biblioteca.

## Exemplos

<docs-pill-row>
  <docs-pill href="https://unpkg.com/browse/@angular/core@17.0.0/" title="@angular/core package"/>
  <docs-pill href="https://unpkg.com/browse/@angular/material@17.0.0/" title="@angular/material package"/>
</docs-pill-row>

## Definição de termos

Os seguintes termos são usados ao longo deste documento intencionalmente.
Nesta seção estão as definições de todos eles para fornecer clareza adicional.

### Package

O menor conjunto de arquivos que são publicados no NPM e instalados juntos, por exemplo `@angular/core`.
Este pacote inclui um manifesto chamado package.json, código-fonte compilado, arquivos de definição typescript, source maps, metadados, etc.
O pacote é instalado com `npm install @angular/core`.

### Symbol

Uma classe, função, constante ou variável contida em um módulo e opcionalmente tornada visível ao mundo externo via uma exportação de módulo.

### Module

Abreviação de ECMAScript Modules.
Um arquivo contendo instruções que importam e exportam símbolos.
Isso é idêntico à definição de módulos na especificação ECMAScript.

### ESM

Abreviação de ECMAScript Modules \(veja acima\).

### FESM

Abreviação de Flattened ES Modules e consiste em um formato de arquivo criado ao achatar todos os ES Modules acessíveis de um entry point em um único ES Module.

### Module ID

O identificador de um módulo usado nas instruções import \(por exemplo, `@angular/core`\).
O ID geralmente mapeia diretamente para um caminho no sistema de arquivos, mas isso nem sempre é o caso devido a várias estratégias de resolução de módulo.

### Module specifier

Um identificador de módulo \(veja acima\).

### Module resolution strategy

Algoritmo usado para converter IDs de Módulo em caminhos no sistema de arquivos.
Node.js tem um que é bem especificado e amplamente usado, TypeScript suporta várias estratégias de resolução de módulo, [Closure Compiler](https://developers.google.com/closure/compiler) tem ainda outra estratégia.

### Module format

Especificação da sintaxe do módulo que cobre no mínimo a sintaxe para importar e exportar de um arquivo.
Formatos de módulo comuns são CommonJS \(CJS, tipicamente usado para aplicações Node.js\) ou ECMAScript Modules \(ESM\).
O formato do módulo indica apenas o empacotamento dos módulos individuais, mas não os recursos de linguagem JavaScript usados para compor o conteúdo do módulo.
Por causa disso, a equipe Angular frequentemente usa o especificador de nível de linguagem como um sufixo para o formato do módulo, \(por exemplo, ESM+ES2022 especifica que o módulo está em formato ESM e contém código ES2022\).

### Bundle

Um artefato na forma de um único arquivo JS, produzido por uma ferramenta de build \(por exemplo, [webpack](https://webpack.js.org) ou [Rollup](https://rollupjs.org)\) que contém símbolos originados em um ou mais módulos.
Bundles são uma solução específica para browsers que reduz a carga da rede que seria causada se os browsers começassem a baixar centenas, se não dezenas de milhares de arquivos.
Node.js normalmente não usa bundles.
Formatos de bundle comuns são UMD e System.register.

### Language level

A linguagem do código \(ES2022\).
Independente do formato do módulo.

### Entry point

Um módulo destinado a ser importado pelo usuário.
É referenciado por um ID de módulo único e exporta a API pública referenciada por esse ID de módulo.
Um exemplo é `@angular/core` ou `@angular/core/testing`.
Ambos os entry points existem no pacote `@angular/core`, mas exportam símbolos diferentes.
Um pacote pode ter muitos entry points.

### Deep import

Um processo de recuperar símbolos de módulos que não são Entry Points.
Esses IDs de módulo são geralmente considerados APIs privadas que podem mudar ao longo da vida do projeto ou enquanto o bundle para o pacote dado está sendo criado.

### Top-Level import

Um import vindo de um entry point.
Os imports de nível superior disponíveis são o que define a API pública e são expostos em módulos "@angular/name", como `@angular/core` ou `@angular/common`.

### Tree-shaking

O processo de identificar e remover código não usado por uma aplicação - também conhecido como eliminação de código morto.
Esta é uma otimização global realizada no nível da aplicação usando ferramentas como [Rollup](https://rollupjs.org), [Closure Compiler](https://developers.google.com/closure/compiler) ou [Terser](https://github.com/terser/terser).

### AOT compiler

O compilador Ahead of Time para Angular.

### Flattened type definitions

As definições TypeScript empacotadas geradas pelo [API Extractor](https://api-extractor.com).
