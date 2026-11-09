<!-- ia-translate: true -->

# Formato de pacote Angular

Este documento descreve o Formato de Pacote Angular \(APF\).
APF é uma especificação específica do Angular para a estrutura e o formato de pacotes npm que é usada por todos os pacotes Angular de primeira parte \(`@angular/core`, `@angular/material`, etc.\) e pela maioria das bibliotecas Angular de terceiros.

APF permite que um pacote funcione perfeitamente nos cenários mais comuns que usam Angular.
Pacotes que usam APF são compatíveis com as ferramentas oferecidas pela equipe Angular, bem como com o ecossistema JavaScript mais amplo.
Recomenda-se que desenvolvedores de bibliotecas de terceiros sigam o mesmo formato de pacote npm.

ÚTIL: APF é versionado junto com o restante do Angular, e cada versão principal melhora o formato do pacote.
Você pode encontrar as versões da especificação anteriores à v13 neste [google doc](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/preview).

## Por que especificar um formato de pacote? {#why-specify-a-package-format}

No cenário JavaScript atual, desenvolvedores consomem pacotes de muitas maneiras diferentes, usando muitas toolchains diferentes \(webpack, Rollup, Rolldown, esbuild, etc.\).
Essas ferramentas podem entender e exigir entradas diferentes - algumas podem processar a versão mais recente da linguagem ES, enquanto outras podem se beneficiar do consumo direto de uma versão ES mais antiga.

O formato de distribuição Angular oferece suporte a todas as ferramentas e workflows de desenvolvimento comumente usados, e dá ênfase a otimizações que resultam em um tamanho de payload de aplicação menor ou em um ciclo de iteração de desenvolvimento mais rápido \(tempo de build\).

Desenvolvedores podem contar com o Angular CLI e o [ng-packagr](https://github.com/ng-packagr/ng-packagr) \(uma ferramenta de build que o Angular CLI usa\) para produzir pacotes no Formato de Pacote Angular.
Veja o guia [Criando Bibliotecas](tools/libraries/creating-libraries) para mais detalhes.

## Layout de arquivos {#file-layout}

O exemplo a seguir mostra uma versão simplificada do layout de arquivos do pacote `@angular/core`, com uma explicação para cada arquivo do pacote.

```markdown
node_modules/@angular/core
├── README.md
├── package.json
├── fesm2022
│ ├── core.mjs
│ ├── core.mjs.map
│ ├── testing.mjs
│ └── testing.mjs.map
└── types
│ ├── core.d.ts
│ ├── testing.d.ts
```

Esta tabela descreve o layout de arquivos em `node_modules/@angular/core`, anotado para descrever a finalidade dos arquivos e diretórios:

| Arquivos                                                                                                                                                  | Propósito                                                                                                                                                                                                                           |
| :-------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `README.md`                                                                                                                                               | README do pacote, usado pela UI web do npmjs.                                                                                                                                                                                       |
| `package.json`                                                                                                                                            | `package.json` primário, descrevendo o próprio pacote, bem como todos os entrypoints disponíveis e formatos de código. Este arquivo contém o mapeamento "exports" usado por runtimes e ferramentas para realizar a resolução de módulos. |
| `fesm2022/` <br /> &nbsp;&nbsp;─ `core.mjs` <br /> &nbsp;&nbsp;─ `core.mjs.map` <br /> &nbsp;&nbsp;─ `testing.mjs` <br /> &nbsp;&nbsp;─ `testing.mjs.map` | Código de todos os entrypoints em formato ES2022 achatado \(FESM\), junto com source maps.                                                                                                                                          |
| `types/` <br /> &nbsp;&nbsp;─ `core.d.ts` <br /> &nbsp;&nbsp;─ `testing.d.ts`                                                                             | Definições de tipos TypeScript empacotadas para todos os entrypoints públicos.                                                                                                                                                      |

### `package.json`

O `package.json` primário contém metadados importantes do pacote, incluindo o seguinte:

- Ele [declara](#esm-declaration) que o pacote está no formato EcmaScript Module \(ESM\)
- Ele contém um campo `"exports"` que define os formatos de código-fonte disponíveis de todos os entrypoints
- Ele contém [chaves](#legacy-resolution-keys) que definem os formatos de código-fonte disponíveis do entrypoint primário `@angular/core`, para ferramentas que não entendem `"exports"`.
  Essas chaves são consideradas obsoletas e podem ser removidas à medida que o suporte a `"exports"` se espalhar pelo ecossistema.

- Ele declara se o pacote contém [efeitos colaterais](#side-effects)

### Declaração ESM {#esm-declaration}

O `package.json` de nível superior contém a chave:

```js
{
  "type": "module"
}
```

Isso informa aos resolvers que o código dentro do pacote usa EcmaScript Modules em vez de módulos CommonJS.

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

As principais chaves de interesse são `"."` e `"./testing"`, que definem os formatos de código disponíveis para o entrypoint primário `@angular/core` e para o entrypoint secundário `@angular/core/testing`, respectivamente.
Para cada entrypoint, os formatos disponíveis são:

| Formatos                     | Detalhes                                                                          |
| :--------------------------- | :-------------------------------------------------------------------------------- |
| Typings \(arquivos `.d.ts`\) | Arquivos `.d.ts` são usados pelo TypeScript ao depender de um determinado pacote. |
| `default`                    | Código ES2022 achatado em uma única fonte.                                        |

Ferramentas que reconhecem essas chaves podem preferencialmente selecionar um formato de código desejável a partir de `"exports"`.

Bibliotecas podem querer expor arquivos estáticos adicionais que não são capturados pelas exportações dos entry-points baseados em JavaScript, como mixins Sass ou CSS pré-compilado.

Para mais informações, veja [Gerenciando assets em uma biblioteca](tools/libraries/creating-libraries#managing-assets-in-a-library).

### Chaves de resolução legadas {#legacy-resolution-keys}

Além de `"exports"`, o `package.json` de nível superior também define chaves de resolução de módulo legadas para resolvers que não suportam `"exports"`.
Para `@angular/core`, elas são:

```js
{
  "module": "./fesm2022/core.mjs",
  "typings": "./types/core.d.ts",
}
```

Como mostrado no trecho de código anterior, um resolver de módulo pode usar essas chaves para carregar um formato de código específico.

### Efeitos colaterais {#side-effects}

A última função do `package.json` é declarar se o pacote tem [efeitos colaterais](#sideeffects-flag).

```js
{
  "sideEffects": false
}
```

A maioria dos pacotes Angular não deve depender de efeitos colaterais de nível superior e, por isso, deve incluir esta declaração.

### Entrypoints e code splitting {#entrypoints-and-code-splitting}

Pacotes no Formato de Pacote Angular contêm um entrypoint primário e zero ou mais entrypoints secundários \(por exemplo, `@angular/common/http`\).
Entrypoints servem a várias funções.

1. Eles definem os especificadores de módulo dos quais os usuários importam código \(por exemplo, `@angular/core` e `@angular/core/testing`\).

   Os usuários normalmente percebem esses entrypoints como grupos distintos de símbolos, com propósitos ou capacidades diferentes.

   Entrypoints específicos podem ser usados apenas para fins especiais, como testes.
   Essas APIs podem ser separadas do entrypoint primário para reduzir a chance de serem usadas acidental ou incorretamente.

1. Eles definem a granularidade na qual o código pode ser carregado sob demanda.

   Muitas ferramentas de build modernas são capazes apenas de "code splitting" \(também conhecido como lazy loading\) no nível de ES Module.
   O Formato de Pacote Angular usa, principalmente, um único ES Module "achatado" por entry point. Isso significa que a maioria das ferramentas de build não consegue dividir o código de um único entry point em múltiplos chunks de saída.

A regra geral para pacotes APF é usar entrypoints para os menores conjuntos possíveis de código logicamente relacionado.
Por exemplo, o pacote Angular Material publica cada component lógico, ou conjunto de components, como um entrypoint separado - um para Button, um para Tabs, etc.
Isso permite que cada component do Material seja carregado sob demanda separadamente, se desejado.

Nem todas as bibliotecas exigem tamanha granularidade.
A maioria das bibliotecas com um único propósito lógico deve ser publicada como um único entrypoint.
`@angular/core`, por exemplo, usa um único entrypoint para o runtime, porque o runtime Angular geralmente é usado como uma única entidade.

#### Resolução de entry points secundários {#resolution-of-secondary-entry-points}

Entry points secundários podem ser resolvidos pelo campo `"exports"` do `package.json` do pacote.

Para saber como configurar entry points secundários em uma biblioteca, veja [Entry points](tools/libraries/creating-libraries#entry-points).

### README.md

O arquivo README no formato Markdown é usado para exibir a descrição de um pacote no npm e no GitHub.

Exemplo de conteúdo de README do pacote @angular/core:

```html
Angular &equals;&equals;&equals;&equals;&equals;&equals;&equals; The sources for this package are in
the main [Angular](https://github.com/angular/angular) repo.Please file issues and pull requests
against that repo. License: MIT
```

## Compilação de biblioteca e otimizações de pacote {#library-compilation-and-package-optimizations}

Esta seção descreve o processo de compilação para bibliotecas e as otimizações aplicadas ao pacote npm antes de publicar o artefato em um registro.

### Compilação parcial {#partial-compilation}

Bibliotecas no Formato de Pacote Angular devem ser publicadas no modo de "compilação parcial".
Este é um modo de compilação do `ngc` que produz código Angular compilado que não está vinculado a uma versão específica do runtime Angular, em contraste com a compilação completa usada para aplicações, em que as versões do compilador e do runtime Angular devem corresponder exatamente.

Para compilar parcialmente o código Angular, use a flag `compilationMode` na propriedade `angularCompilerOptions` do seu `tsconfig.json`:

```js
{
  …
  "angularCompilerOptions": {
    "compilationMode": "partial",
  }
}
```

O código de biblioteca parcialmente compilado é então convertido em código totalmente compilado durante o processo de build da aplicação, pelo Angular CLI.

Se o seu pipeline de build não usa o Angular CLI, consulte o guia [Consumindo código partial ivy fora do Angular CLI](tools/libraries/creating-libraries#consuming-partial-ivy-code-outside-the-angular-cli).

### Achatamento de ES modules {#flattening-of-es-modules}

O Formato de Pacote Angular especifica que o código seja publicado em formato de ES module "achatado".
Isso reduz significativamente o tempo de build das aplicações Angular, bem como o tempo de download e parse do bundle final da aplicação.
Confira o excelente post ["The cost of small modules"](https://nolanlawson.com/2016/08/15/the-cost-of-small-modules), de Nolan Lawson.

O compilador Angular pode gerar arquivos index de ES module. Ferramentas como Rollup / Rolldown podem usar esses arquivos para gerar módulos achatados em um formato de arquivo _Flattened ES Module_ (FESM).

FESM é um formato de arquivo criado ao achatar todos os ES Modules acessíveis a partir de um entrypoint em um único ES Module.
Ele é formado seguindo todos os imports de um pacote e copiando esse código para um único arquivo, preservando todas as exportações ES públicas e removendo todos os imports privados.
Em alguns casos, porém, o FESM pode depender de chunks compartilhados entre múltiplos entry points.

O nome abreviado, FESM, pronunciado _fe-som_, pode ser seguido por um número, como em FESM2020.
O número se refere ao nível de linguagem do JavaScript dentro do módulo.
Assim, um arquivo FESM2022 seria ESM+ES2022 e incluiria instruções import/export e código-fonte ES2022.

Para gerar um arquivo index de ES Module achatado, use as seguintes opções de configuração no seu arquivo tsconfig.json:

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

Depois que o arquivo index \(por exemplo, `my-ui-lib.js`\) é gerado pelo ngc, bundlers e otimizadores como Rollup e Rolldown podem ser usados para produzir o arquivo ESM achatado.

### Flag "sideEffects" {#sideeffects-flag}

Por padrão, EcmaScript Modules têm efeitos colaterais: importar de um módulo garante que qualquer código no nível superior desse módulo seja executado.
Isso costuma ser indesejável, pois a maior parte do código com efeitos colaterais em módulos típicos não é realmente com efeitos colaterais, mas afeta apenas símbolos específicos.
Se esses símbolos não forem importados e usados, muitas vezes é desejável removê-los em um processo de otimização conhecido como tree-shaking, e o código com efeitos colaterais pode impedir isso.

Ferramentas de build como o webpack oferecem suporte a uma flag que permite que pacotes declarem que não dependem de código com efeitos colaterais no nível superior de seus módulos, dando às ferramentas mais liberdade para fazer tree-shake do código do pacote.
O resultado final dessas otimizações deve ser um bundle menor e uma melhor distribuição de código nos chunks do bundle após o code-splitting.
Essa otimização pode quebrar seu código se ele contiver efeitos colaterais não locais - o que, no entanto, não é comum em aplicações Angular e geralmente é um sinal de design ruim.
A recomendação é que todos os pacotes declarem o status livre de efeitos colaterais definindo a propriedade `sideEffects` como `false`, e que os desenvolvedores sigam o [Guia de Estilo Angular](/style-guide), que naturalmente resulta em código sem efeitos colaterais não locais.

Mais informações: [documentação do webpack sobre efeitos colaterais](https://github.com/webpack/webpack/tree/main/examples/side-effects)

### Nível de linguagem ES2022 {#es2022-language-level}

O nível de linguagem ES2022 agora é o nível de linguagem padrão consumido pelo Angular CLI e por outras ferramentas.
O Angular CLI reduz o bundle para um nível de linguagem suportado por todos os navegadores alvo no momento do build da aplicação.

### Achatamento de definições de tipo (empacotamento de `.d.ts`) {#flattening-of-type-definitions-dts-bundling}

A partir do APF v8, é recomendado empacotar as definições TypeScript.
O empacotamento das definições de tipo pode acelerar significativamente as compilações para os usuários, especialmente se houver muitos arquivos-fonte `.ts` individuais na sua biblioteca.

O Angular usa o [`rolldown-plugin-dts`](https://github.com/sxzz/rolldown-plugin-dts) para achatar arquivos `.d.ts` (usando `rolldown`, de forma semelhante a como os arquivos FESM são criados).

Usar o rolldown para o empacotamento de `.d.ts` é benéfico, pois oferece suporte a code splitting entre entry-points.
Por exemplo, considere que você tem múltiplos entrypoints dependendo do mesmo tipo compartilhado: um arquivo `.d.ts` compartilhado seria criado junto com os arquivos `.d.ts` achatados maiores.
Isso é desejável e evita a duplicação de tipos.

### Tslib

A partir do APF v10, é recomendado adicionar o tslib como uma dependência direta do seu entry-point primário.
Isso ocorre porque a versão do tslib está vinculada à versão do TypeScript usada para compilar sua biblioteca.

## Exemplos {#examples}

As npm packages do framework Angular são uma boa referência para pacotes de biblioteca compatíveis com APF.
Navegue pelo layout de arquivos e pelo pacote npm no UNPKG:

<docs-pill-row>
  <docs-pill href="https://app.unpkg.com/@angular/core@latest" title="@angular/core package"/>
  <docs-pill href="https://app.unpkg.com/@angular/material@latest" title="@angular/material package"/>
</docs-pill-row>

## Definição de termos {#definition-of-terms}

Os seguintes termos são usados intencionalmente ao longo deste documento.
Nesta seção estão as definições de todos eles, para fornecer clareza adicional.

### Package

O menor conjunto de arquivos que são publicados no npm e instalados juntos, por exemplo `@angular/core`.
Este pacote inclui um manifesto chamado package.json, código-fonte compilado, arquivos de definição TypeScript, source maps, metadados, etc.
O pacote é instalado com `npm install @angular/core`.

### Symbol

Uma classe, função, constante ou variável contida em um módulo e, opcionalmente, tornada visível ao mundo externo por meio de uma exportação do módulo.

### Module

Abreviação de ECMAScript Modules.
Um arquivo que contém instruções que importam e exportam símbolos.
Isso é idêntico à definição de módulos na especificação ECMAScript.

### ESM

Abreviação de ECMAScript Modules \(veja acima\).

### FESM

Abreviação de Flattened ES Modules, e consiste em um formato de arquivo criado ao achatar todos os ES Modules acessíveis a partir de um entry point em um único ES Module.
Observe que o FESM costuma ser um único arquivo, mas pode depender de um chunk compartilhado com outros FESMs.

### Module ID

O identificador de um módulo usado nas instruções import \(por exemplo, `@angular/core`\).
O ID geralmente corresponde diretamente a um caminho no sistema de arquivos, mas isso nem sempre acontece devido a várias estratégias de resolução de módulo.

### Module specifier

Um identificador de módulo \(veja acima\).

### Module resolution strategy

Algoritmo usado para converter IDs de módulo em caminhos no sistema de arquivos.
O Node.js tem um algoritmo bem especificado e amplamente usado, o TypeScript oferece suporte a várias estratégias de resolução de módulo, e o [Closure Compiler](https://developers.google.com/closure/compiler) tem ainda outra estratégia.

### Module format

Especificação da sintaxe do módulo que cobre, no mínimo, a sintaxe para importar e exportar a partir de um arquivo.
Formatos de módulo comuns são CommonJS \(CJS, tipicamente usado em aplicações Node.js\) ou ECMAScript Modules \(ESM\).
O formato do módulo indica apenas o empacotamento dos módulos individuais, mas não os recursos da linguagem JavaScript usados para compor o conteúdo do módulo.
Por causa disso, a equipe Angular frequentemente usa o especificador de nível de linguagem como um sufixo para o formato do módulo \(por exemplo, ESM+ES2022 especifica que o módulo está no formato ESM e contém código ES2022\).

### Bundle

Um artefato na forma de um único arquivo JS, produzido por uma ferramenta de build \(por exemplo, [webpack](https://webpack.js.org) ou [Rollup](https://rollupjs.org)\) que contém símbolos originados de um ou mais módulos.
Bundles são uma solução específica para navegadores que reduz a carga de rede que seria causada se os navegadores começassem a baixar centenas, senão dezenas de milhares, de arquivos.
O Node.js normalmente não usa bundles.
Formatos de bundle comuns são UMD e System.register.

### Language level

A linguagem do código \(ES2022\).
Independente do formato do módulo.

### Entry point

Um módulo destinado a ser importado pelo usuário.
Ele é referenciado por um ID de módulo único e exporta a API pública referenciada por esse ID de módulo.
Um exemplo é `@angular/core` ou `@angular/core/testing`.
Ambos os entry points existem no pacote `@angular/core`, mas exportam símbolos diferentes.
Um pacote pode ter muitos entry points.

### Deep import

Um processo de recuperar símbolos de módulos que não são Entry Points.
Esses IDs de módulo geralmente são considerados APIs privadas, que podem mudar ao longo da vida do projeto ou enquanto o bundle do pacote dado está sendo criado.

### Top-Level import

Um import vindo de um entry point.
Os imports de nível superior disponíveis são o que define a API pública e são expostos nos módulos "@angular/name", como `@angular/core` ou `@angular/common`.

### Tree-shaking

O processo de identificar e remover código não usado por uma aplicação - também conhecido como eliminação de código morto.
Esta é uma otimização global, realizada no nível da aplicação, usando ferramentas como [Rollup](https://rollupjs.org), [Rolldown](https://rolldown.rs/), [Closure Compiler](https://developers.google.com/closure/compiler) ou [Terser](https://github.com/terser/terser).

### AOT compiler

O compilador Ahead of Time para Angular.

### Flattened type definitions

As definições TypeScript empacotadas, geradas com ferramentas como [API Extractor](https://api-extractor.com) ou [rollup-plugin-dts](https://github.com/Swatinem/rollup-plugin-dts).
