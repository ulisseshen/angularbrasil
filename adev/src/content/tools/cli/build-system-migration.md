<!-- ia-translate: true -->

# Sistema de build de aplicações Angular {#angular-application-build-system}

Na v17 e superior, o novo sistema de build fornece uma maneira aprimorada de construir aplicações Angular. Este novo sistema de build inclui:

- Um formato de saída moderno usando ESM, com expressões de import dinâmico para suportar carregamento de módulos lazy.
- Desempenho de tempo de build mais rápido para builds iniciais e reconstruções incrementais.
- Ferramentas mais recentes do ecossistema JavaScript como [esbuild](https://esbuild.github.io/) e [Vite](https://vitejs.dev/).
- Capacidades integradas de SSR e pré-renderização.
- Substituição automática a quente de folhas de estilo globais e de components.

Este novo sistema de build está estável e totalmente suportado para uso com aplicações Angular.
Você pode migrar para o novo sistema de build com aplicações que usam o builder `browser`.
Se estiver usando um builder customizado, consulte a documentação desse builder sobre possíveis opções de migração.

IMPORTANT: O sistema de build baseado em webpack existente e o builder `browser` estão obsoletos.
Aplicações podem continuar a usar temporariamente o builder `browser` e projetos podem optar por não migrar durante uma atualização, mas a equipe Angular recomenda migrar para o novo sistema de build.

## Para novas aplicações {#for-new-applications}

Novas aplicações usarão este novo sistema de build por padrão via o builder `application`.

## Para aplicações existentes {#for-existing-applications}

Procedimentos automatizados e manuais estão disponíveis dependendo dos requisitos do projeto.
A partir da v18, o processo de atualização para uma nova versão major perguntará se você gostaria de migrar aplicações existentes para usar o novo sistema de build via migração automatizada.
Antes de migrar, considere revisar a seção [Problemas Conhecidos](#known-issues), pois ela pode conter informações relevantes para seu projeto.

HELPFUL: Lembre-se de remover quaisquer suposições CommonJS no código do servidor da aplicação se estiver usando SSR, como `require`, `__filename`, `__dirname`, ou outros construtos do [escopo de módulo CommonJS](https://nodejs.org/api/modules.html#the-module-scope). Todo código da aplicação deve ser compatível com ESM. Isso não se aplica a dependências de terceiros.

### Migração automatizada (Recomendado) {#automated-migration-recommended}

A migração automatizada ajustará tanto a configuração da aplicação dentro de `angular.json` quanto o código e as folhas de estilo para remover o uso de recursos específicos do webpack anteriores.
Embora muitas mudanças possam ser automatizadas e a maioria das aplicações não requeira mudanças adicionais, cada aplicação é única e pode haver algumas mudanças manuais necessárias.
Após a migração, tente fazer um build da aplicação, pois podem haver novos erros que requererão ajustes no código.
Os erros tentarão fornecer soluções para o problema quando possível, e as seções posteriores deste guia descrevem algumas das situações mais comuns que você pode encontrar.
Ao atualizar para uma nova versão major via `ng update`, será perguntado se você deseja executar a migração.
Esta migração é totalmente opcional e também pode ser executada manualmente a qualquer momento após uma atualização, via o seguinte comando:

```shell

ng update @angular/cli --name use-application-builder

```

A migração faz o seguinte:

- Converte o target `browser` ou `browser-esbuild` existente para `application`
- Remove quaisquer builders SSR anteriores (porque `application` faz isso agora).
- Atualiza a configuração adequadamente.
- Mescla `tsconfig.server.json` com `tsconfig.app.json` e adiciona a opção TypeScript `"esModuleInterop": true` para garantir que imports `express` sejam [compatíveis com ESM](#esm-default-imports-vs-namespace-imports).
- Atualiza o código do servidor da aplicação para usar a nova estrutura de bootstrapping e diretório de saída.
- Remove qualquer uso de folha de estilo específico do builder webpack, como til ou circunflexo em `@import`/`url()`, e atualiza a configuração para fornecer comportamento equivalente.
- Converte para usar o novo pacote Node.js `@angular/build`, de menor dependência, se nenhum outro uso de `@angular-devkit/build-angular` for encontrado.

### Migração manual {#manual-migration}

Adicionalmente, para projetos existentes, você pode optar manualmente por usar o novo builder em uma base por aplicação, com duas opções diferentes.
Ambas as opções são consideradas estáveis e totalmente suportadas pela equipe Angular.
A escolha de qual opção usar depende de quantas mudanças você precisará fazer para migrar e de quais novos recursos você gostaria de usar no projeto.

- O builder `browser-esbuild` constrói apenas o bundle do lado do client de uma aplicação, projetado para ser compatível com o builder `browser` existente que fornece o sistema de build pré-existente.
  Este builder fornece opções de build equivalentes e, em muitos casos, serve como um substituto direto para aplicações `browser` existentes.
- O builder `application` cobre uma aplicação inteira, como o bundle do lado do client, bem como opcionalmente constrói um servidor para renderização do lado do servidor e realiza a pré-renderização de páginas estáticas em tempo de build.

O builder `application` é geralmente preferido, pois melhora builds renderizadas do lado do servidor (SSR) e torna mais fácil para projetos renderizados do lado do client adotarem SSR no futuro.
No entanto, ele requer um pouco mais de esforço de migração, particularmente para aplicações SSR existentes, se realizado manualmente.
Se o builder `application` for difícil de adotar para o seu projeto, `browser-esbuild` pode ser uma solução mais fácil, que oferece a maioria dos benefícios de desempenho de build com menos mudanças disruptivas.

#### Migração manual para o builder de compatibilidade {#manual-migration-to-the-compatibility-builder}

Um builder chamado `browser-esbuild` está disponível dentro do pacote `@angular-devkit/build-angular`, que as aplicações que usam o builder `browser` já dependem.
Você pode experimentar o novo sistema de build para aplicações que usam o builder `browser`.
Se estiver usando um builder customizado, consulte a documentação desse builder sobre possíveis opções de migração.

A opção de compatibilidade foi implementada para minimizar a quantidade de mudanças necessárias para migrar inicialmente suas aplicações.
Ela é fornecida via um builder alternativo (`browser-esbuild`).
Você pode atualizar o target `build` de qualquer target de aplicação para migrar para o novo sistema de build.

O seguinte é o que você normalmente encontraria em `angular.json` para uma aplicação:

```json
...
"architect": {
  "build": {
    "builder": "@angular-devkit/build-angular:browser",
...
```

Mudar o campo `builder` é a única mudança que você precisará fazer.

```json
...
"architect": {
  "build": {
    "builder": "@angular-devkit/build-angular:browser-esbuild",
...
```

#### Migração manual para o novo builder `application` {#manual-migration-to-the-new-application-builder}

Um builder chamado `application` também está disponível dentro do pacote `@angular-devkit/build-angular`.
Novas aplicações criadas via `ng new` usam o mesmo builder do pacote `@angular/build` (`@angular/build:application`).

O seguinte é o que você normalmente encontraria em `angular.json` para uma aplicação:

```json
...
"architect": {
  "build": {
    "builder": "@angular-devkit/build-angular:browser",
...
```

Mudar o campo `builder` é a primeira mudança que você precisará fazer.

```json
...
"architect": {
  "build": {
    "builder": "@angular-devkit/build-angular:application",
...
```

Uma vez que o nome do builder tenha sido alterado, as opções dentro do target `build` precisarão ser atualizadas.
A lista a seguir discute todas as opções do builder `browser` que precisarão ser ajustadas.

- `main` deve ser renomeado para `browser`.
- `polyfills` deve ser um array, em vez de um único arquivo.
- `buildOptimizer` deve ser removido, pois isso é coberto pela opção `optimization`.
- `resourcesOutputPath` deve ser removido, pois agora é sempre `media`.
- `vendorChunk` deve ser removido, pois era uma otimização de desempenho que não é mais necessária.
- `commonChunk` deve ser removido, pois era uma otimização de desempenho que não é mais necessária.
- `ngswConfigPath` deve ser renomeado para `serviceWorker`.

Se a aplicação não estiver usando SSR atualmente, este deve ser o passo final para permitir que `ng build` funcione.
Após executar `ng build` pela primeira vez, podem haver novos avisos ou erros baseados em diferenças comportamentais ou no uso de recursos específicos do webpack pela aplicação.
Muitos dos avisos fornecerão sugestões sobre como remediar o problema.
Se parecer que um aviso está incorreto ou a solução não é aparente, por favor abra uma issue no [GitHub](https://github.com/angular/angular-cli/issues).
Além disso, as seções posteriores deste guia fornecem informações adicionais sobre vários casos específicos, bem como problemas conhecidos atuais.

Para aplicações novas em SSR, o [Guia de SSR Angular](guide/ssr) fornece informações adicionais sobre o processo de configuração para adicionar SSR a uma aplicação.

Para aplicações que já estão usando SSR, ajustes adicionais serão necessários para atualizar o servidor da aplicação e suportar as novas capacidades integradas de SSR.
O builder `application` agora fornece a funcionalidade integrada para todos os seguintes builders pré-existentes:

- `app-shell`
- `prerender`
- `server`
- `ssr-dev-server`

O processo `ng update` removerá automaticamente usos dos pacotes de escopo `@nguniversal` onde alguns desses builders estavam localizados anteriormente.
O novo pacote `@angular/ssr` também será adicionado automaticamente e usado, com configuração e código sendo ajustados durante a atualização.
O pacote `@angular/ssr` suporta o builder `browser`, bem como o builder `application`.

## Executando um build {#executing-a-build}

Uma vez que você tenha atualizado a configuração da aplicação, builds podem ser realizados usando `ng build`, como era feito anteriormente.
Dependendo da escolha de migração do builder, algumas das opções de linha de comando podem ser diferentes.
Se o comando de build estiver contido em quaisquer scripts `npm` ou outros, certifique-se de que sejam revisados e atualizados.
Para aplicações que migraram para o builder `application` e que usam SSR e/ou pré-renderização, você também pode ser capaz de remover comandos `ng run` extras dos scripts, agora que `ng build` tem suporte a SSR integrado.

```shell

ng build

```

## Iniciando o servidor de desenvolvimento {#starting-the-development-server}

O servidor de desenvolvimento detectará automaticamente o novo sistema de build e o usará para construir a aplicação.
Para iniciar o servidor de desenvolvimento, nenhuma mudança é necessária na configuração ou na linha de comando do builder `dev-server`.

```shell

ng serve

```

Você pode continuar a usar as [opções de linha de comando](/cli/serve) que você usou no passado com o servidor de desenvolvimento.

HELPFUL: Com o servidor de desenvolvimento, você pode ver um pequeno Flash of Unstyled Content (FOUC) na inicialização, conforme o servidor é inicializado.
O servidor de desenvolvimento tenta adiar o processamento de folhas de estilo até o primeiro uso, para melhorar os tempos de reconstrução.
Isso não ocorrerá em builds fora do servidor de desenvolvimento.

### Hot module replacement

Hot Module Replacement (HMR) é uma técnica usada por servidores de desenvolvimento para evitar recarregar a página inteira quando apenas parte de uma aplicação é alterada.
As mudanças, em muitos casos, podem ser mostradas imediatamente no browser, o que permite um ciclo de edição/atualização melhorado ao desenvolver uma aplicação.
Embora hot module replacement (HMR) geral baseado em JavaScript não seja suportado atualmente, várias formas mais específicas de HMR estão disponíveis:

- **folha de estilo global** (opção de build `styles`)
- **folha de estilo de component** (inline e baseada em arquivo)
- **template de component** (inline e baseado em arquivo)

As capacidades de HMR são ativadas automaticamente e não requerem mudanças de código ou configuração para usar.
O Angular fornece suporte a HMR para estilos e templates de components baseados em arquivo (`templateUrl`/`styleUrl`/`styleUrls`) e inline (`template`/`styles`).
O sistema de build tentará compilar e processar a menor quantidade possível de código da aplicação quando detectar uma mudança apenas em folha de estilo.

Se preferir, as capacidades de HMR podem ser desativadas definindo a opção `hmr` do servidor de desenvolvimento como `false`.
Isso também pode ser alterado na linha de comando via:

```shell

ng serve --no-hmr

```

### Vite como servidor de desenvolvimento {#vite-as-a-development-server}

O uso do Vite no Angular CLI está atualmente restrito a uma _capacidade de servidor de desenvolvimento apenas_. Mesmo sem usar o sistema de build subjacente do Vite, o Vite fornece um servidor de desenvolvimento completo, com suporte do lado do client, que foi empacotado em um pacote npm de baixa dependência. Isso o torna um candidato ideal para fornecer funcionalidade abrangente de servidor de desenvolvimento. O processo atual do servidor de desenvolvimento usa o novo sistema de build para gerar um build de desenvolvimento da aplicação em memória e passa os resultados para o Vite servir a aplicação. O uso do Vite, assim como o servidor de desenvolvimento baseado em Webpack, está encapsulado dentro do builder `dev-server` do Angular CLI e atualmente não pode ser configurado diretamente.

### Prebundling

Prebundling fornece tempos de build e reconstrução melhorados ao usar o servidor de desenvolvimento.
O Vite fornece [capacidades de prebundling](https://vite.dev/guide/dep-pre-bundling) que são ativadas por padrão ao usar o Angular CLI.
O processo de prebundling analisa todas as dependências de projeto de terceiros dentro de um projeto e as processa na primeira vez que o servidor de desenvolvimento é executado.
Este processo remove a necessidade de reconstruir e empacotar as dependências do projeto cada vez que uma reconstrução ocorre ou o servidor de desenvolvimento é executado.

Na maioria dos casos, nenhuma customização adicional é necessária. No entanto, algumas situações em que ela pode ser necessária incluem:

- Customizar o comportamento do loader para imports dentro da dependência, como a [opção `loader`](#file-extension-loader-customization)
- Criar um link simbólico de uma dependência para código local durante o desenvolvimento, como com [`npm link`](https://docs.npmjs.com/cli/v10/commands/npm-link)
- Contornar um erro encontrado durante o prebundling de uma dependência

O processo de prebundling pode ser totalmente desativado, ou dependências individuais podem ser excluídas, se necessário pelo projeto.
A opção `prebundle` do builder `dev-server` pode ser usada para essas customizações.
Para excluir dependências específicas, a opção `prebundle.exclude` está disponível:

```json
    "serve": {
      "builder": "@angular/build:dev-server",
      "options": {
        "prebundle": {
          "exclude": ["some-dep"]
        }
      },
```

Por padrão, `prebundle` é definido como `true`, mas pode ser definido como `false` para desativar totalmente o prebundling.
No entanto, excluir dependências específicas é recomendado em vez disso, pois os tempos de reconstrução aumentarão com o prebundling desativado.

```json
    "serve": {
      "builder": "@angular/build:dev-server",
      "options": {
        "prebundle": false
      },
```

## Novos recursos {#new-features}

Um dos principais benefícios do novo sistema de build de aplicação é o desempenho melhorado de build e reconstrução.
No entanto, o novo sistema de build de aplicação também fornece recursos adicionais não presentes no builder `browser`.

IMPORTANT: Os novos recursos do builder `application` descritos aqui são incompatíveis com o builder de teste `@angular-devkit/build-angular:karma` por padrão, porque ele usa o builder `browser` internamente.
Usuários podem optar por usar o builder `application` definindo a opção `builderMode` como `application` para esse builder.
Os builders `@angular/build:karma` e `@angular/build:unit-test` sempre usam o builder `application`.
Se você notar quaisquer problemas, por favor reporte-os [aqui](https://github.com/angular/angular-cli/issues).

### Substituição de valor em tempo de build com `define` {#build-time-value-replacement-with-define}

A opção `define` permite que identificadores presentes no código sejam substituídos por outro valor em tempo de build.
Isso é semelhante ao comportamento do `DefinePlugin` do Webpack, que era usado anteriormente com algumas configurações customizadas do Webpack que usavam builders de terceiros.
A opção pode ser usada dentro do arquivo de configuração `angular.json` ou na linha de comando.
Configurar `define` dentro de `angular.json` é útil para casos em que os valores são constantes e podem ser salvos no controle de código-fonte.

Dentro do arquivo de configuração, a opção está na forma de um objeto.
As chaves do objeto representam o identificador a ser substituído, e os valores do objeto representam o valor de substituição correspondente para o identificador.
Um exemplo é o seguinte:

```json
  "build": {
    "builder": "@angular/build:application",
    "options": {
      ...
      "define": {
          "SOME_NUMBER": "5",
          "ANOTHER": "'this is a string literal, note the extra single quotes'",
          "REFERENCE": "globalThis.someValue.noteTheAbsentSingleQuotes"
      }
    }
  }
```

HELPFUL: Todos os valores de substituição são definidos como strings dentro do arquivo de configuração.
Se a substituição pretende ser um string literal real, ela deve ser envolvida em aspas simples.
Isso permite a flexibilidade de usar qualquer tipo JSON válido, bem como um identificador diferente como substituição.

O uso de linha de comando é preferido para valores que podem mudar a cada execução de build, como o hash de commit do git ou uma variável de ambiente.
O CLI mesclará valores `--define` da linha de comando com valores `define` de `angular.json`, incluindo ambos em um build.
O uso da linha de comando tem precedência se o mesmo identificador estiver presente em ambos.
Para uso na linha de comando, a opção `--define` usa o formato `IDENTIFIER=VALUE`.

```shell
ng build --define SOME_NUMBER=5 --define "ANOTHER='these will overwrite existing'"
```

Variáveis de ambiente também podem ser incluídas seletivamente em um build.
Para shells não Windows, as aspas ao redor do literal hash podem ser escapadas diretamente, se preferido.
Este exemplo assume um shell tipo bash, mas comportamento semelhante está disponível para outros shells também.

```shell
export MY_APP_API_HOST="http://example.com"
export API_RETRY=3
ng build --define API_HOST=\'$MY_APP_API_HOST\' --define API_RETRY=$API_RETRY
```

Para qualquer um dos usos, o TypeScript precisa conhecer os tipos dos identificadores para evitar erros de verificação de tipo durante o build.
Isso pode ser feito com um arquivo de definição de tipo adicional dentro do código-fonte da aplicação (`src/types.d.ts`, por exemplo) com conteúdo semelhante:

```ts
declare const SOME_NUMBER: number;
declare const ANOTHER: string;
declare const GIT_HASH: string;
declare const API_HOST: string;
declare const API_RETRY: number;
```

A configuração padrão do projeto já está configurada para usar quaisquer arquivos de definição de tipo presentes nos diretórios de código-fonte do projeto.
Se a configuração TypeScript do projeto tiver sido alterada, ela pode precisar ser ajustada para referenciar este arquivo de definição de tipo recém-adicionado.

IMPORTANT: Esta opção não substituirá identificadores contidos dentro de metadados do Angular, como um decorator Component ou Directive.

### Customização de loader de extensão de arquivo {#file-extension-loader-customization}

IMPORTANT: Este recurso está disponível apenas com o builder `application`.

Alguns projetos podem precisar controlar como todos os arquivos com uma extensão de arquivo específica são carregados e empacotados em uma aplicação.
Ao usar o builder `application`, a opção `loader` pode ser usada para lidar com esses casos.
A opção permite que um projeto defina o tipo de loader a usar com uma extensão de arquivo especificada.
Um arquivo com a extensão definida pode então ser usado dentro do código da aplicação via uma instrução import ou uma expressão de import dinâmico.
Os loaders disponíveis são:

- `text` - incorpora o conteúdo como uma `string` disponível como export default
- `binary` - incorpora o conteúdo como um `Uint8Array` disponível como export default
- `file` - emite o arquivo no caminho de saída da aplicação e fornece a localização em tempo de execução do arquivo como export default
- `dataurl` - incorpora o conteúdo como uma [data URL](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URIs).
- `base64` - incorpora o conteúdo como uma string codificada em Base64.
- `empty` - considera o conteúdo vazio e não o incluirá nos bundles

O valor `empty`, embora menos comum, pode ser útil para a compatibilidade de bibliotecas de terceiros que podem conter uso de import específico do bundler que precisa ser removido.
Um caso para isso são imports de efeito colateral (`import 'my.css';`) de arquivos CSS, que não têm efeito em um browser.
Em vez disso, o projeto pode usar `empty` e então os arquivos CSS podem ser adicionados à opção de build `styles` ou usar algum outro método de injeção.

A opção `loader` é uma opção baseada em objeto, com as chaves usadas para definir a extensão de arquivo e os valores usados para definir o tipo de loader.

Um exemplo do uso da opção de build para incorporar o conteúdo de arquivos SVG na aplicação empacotada seria o seguinte:

```json
  "build": {
    "builder": "@angular/build:application",
    "options": {
      ...
      "loader": {
        ".svg": "text"
      }
    }
  }
```

Um arquivo SVG pode então ser importado:

```ts
import contents from './some-file.svg';

console.log(contents); // <svg>...</svg>
```

Adicionalmente, o TypeScript precisa conhecer o tipo de módulo para o import, para evitar erros de verificação de tipo durante o build. Isso pode ser feito com um arquivo de definição de tipo adicional dentro do código-fonte da aplicação (`src/types.d.ts`, por exemplo) com o seguinte conteúdo ou semelhante:

```ts
declare module '*.svg' {
  const content: string;
  export default content;
}
```

A configuração padrão do projeto já está configurada para usar quaisquer arquivos de definição de tipo (arquivos `.d.ts`) presentes nos diretórios de código-fonte do projeto. Se a configuração TypeScript do projeto tiver sido alterada, o tsconfig pode precisar ser ajustado para referenciar este arquivo de definição de tipo recém-adicionado.

### Customização de loader de atributo de import {#import-attribute-loader-customization}

Para casos em que apenas certos arquivos devem ser carregados de uma maneira específica, está disponível um controle por arquivo sobre o comportamento de carregamento.
Isso é feito com um [atributo de import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import/with) `loader`, que pode ser usado com instruções e expressões de import.
A presença do atributo de import tem precedência sobre todo outro comportamento de carregamento, incluindo JS/TS e quaisquer valores da opção de build `loader`.
Para carregamento geral de todos os arquivos de um tipo de arquivo não suportado de outra forma, a opção de build [`loader`](#file-extension-loader-customization) é recomendada.

Para o atributo de import, os seguintes valores de loader são suportados:

- `text` - incorpora o conteúdo como uma `string` disponível como export default
- `binary` - incorpora o conteúdo como um `Uint8Array` disponível como export default
- `file` - emite o arquivo no caminho de saída da aplicação e fornece a localização em tempo de execução do arquivo como export default
- `dataurl` - incorpora o conteúdo como uma [data URL](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URIs).
- `base64` - incorpora o conteúdo como uma string codificada em Base64.

Um requisito adicional para usar atributos de import é que a opção `module` do TypeScript deve ser definida como `esnext` ou `preserve`, para permitir que o TypeScript construa o código da aplicação com sucesso.
Novos projetos usam `preserve` por padrão, então nenhuma mudança é necessária.

Neste momento, o TypeScript não suporta definições de tipo baseadas em valores de atributo de import.
O uso de `@ts-expect-error`/`@ts-ignore` ou o uso de arquivos de definição de tipo individuais (assumindo que o arquivo é importado apenas com o mesmo atributo loader) é atualmente necessário.
Como exemplo, um arquivo SVG pode ser importado como texto via:

```ts
// @ts-expect-error TypeScript cannot provide types based on attributes yet
import contents from './some-file.svg' with {loader: 'text'};
```

O mesmo pode ser feito com uma expressão de import dentro de uma função async.

```ts
async function loadSvg(): Promise<string> {
  // @ts-expect-error TypeScript cannot provide types based on attributes yet
  return import('./some-file.svg', {with: {loader: 'text'}}).then((m) => m.default);
}
```

Para a expressão de import, o valor `loader` deve ser um string literal para ser analisado estaticamente.
Um aviso será emitido se o valor não for um string literal.

O loader `file` é útil quando um arquivo será carregado em tempo de execução por meio de um `fetch()`, de uma atribuição ao `src` de um elemento de imagem, ou de outro método semelhante.

```ts
// @ts-expect-error TypeScript cannot provide types based on attributes yet
import imagePath from './image.webp' with {loader: 'file'};

console.log(imagePath); // media/image-ULK2SIIB.webp
```

O loader `base64` é útil quando um arquivo precisa ser incorporado diretamente no bundle como uma string codificada, que pode ser usada posteriormente para construir uma Data URL.

```ts
// @ts-expect-error TypeScript cannot provide types based on attributes yet
import logo from './logo.png' with {loader: 'base64'};

console.log(logo); // "iVBORw0KGgoAAAANSUhEUgAA..."
```

O loader `dataurl` incorpora assets como Data URLs completas.

```ts
// @ts-expect-error TypeScript cannot provide types based on attributes yet
import icon from './icon.svg' with {loader: 'dataurl'};

console.log(icon); // "data:image/svg+xml;..."
```

Para builds de produção, como mostrado no comentário de código acima, o hash será adicionado automaticamente ao caminho para cache de longo prazo.

HELPFUL: Ao usar o servidor de desenvolvimento e um atributo `loader` para importar um arquivo de um pacote Node.js, esse pacote deve ser excluído do prebundling por meio da opção `prebundle` do servidor de desenvolvimento.

### Condições de import/export {#import-export-conditions}

Projetos podem precisar mapear certos caminhos de import para arquivos diferentes com base no tipo de build.
Isso pode ser particularmente útil em casos como `ng serve` precisar usar código específico de debug/desenvolvimento, enquanto `ng build` precisa usar código sem quaisquer recursos ou informações de desenvolvimento.
Várias [condições](https://nodejs.org/api/packages.html#community-conditions-definitions) de import/export são aplicadas automaticamente para suportar essas necessidades do projeto:

- Para builds otimizados, a condição `production` é ativada.
- Para builds não otimizados, a condição `development` é ativada.
- Para código de saída do browser, a condição `browser` é ativada.

Um build otimizado é determinado pelo valor da opção `optimization`.
Quando `optimization` é definido como `true`, ou mais especificamente se `optimization.scripts` for definido como `true`, então o build é considerado otimizado.
Esta classificação se aplica tanto a `ng build` quanto a `ng serve`.
Em um novo projeto, `ng build` é otimizado por padrão e `ng serve` não é otimizado por padrão.

Um método útil para aproveitar essas condições dentro do código da aplicação é combiná-las com [subpath imports](https://nodejs.org/api/packages.html#subpath-imports).
Usando a seguinte instrução de import:

```ts
import {verboseLogging} from '#logger';
```

O arquivo pode ser trocado no campo `imports` em `package.json`:

```json
{
  ...
  "imports": {
    "#logger": {
      "development": "./src/logging/debug.ts",
      "default": "./src/logging/noop.ts"
    }
  }
}
```

Para aplicações que também usam SSR, o código do browser e do servidor pode ser trocado usando a condição `browser`:

```json
{
  ...
  "imports": {
    "#crashReporter": {
      "browser": "./src/browser-logger.ts",
      "default": "./src/server-logger.ts"
    }
  }
}
```

Essas condições também se aplicam a pacotes Node.js e a quaisquer [`exports`](https://nodejs.org/api/packages.html#conditional-exports) definidos dentro dos pacotes.

HELPFUL: Se você estiver usando atualmente a opção de build `fileReplacements`, este recurso pode ser capaz de substituir o seu uso.

## Problemas Conhecidos {#known-issues}

Atualmente, existem vários problemas conhecidos que você pode encontrar ao experimentar o novo sistema de build. Esta lista será atualizada para se manter atual. Se algum desses problemas estiver bloqueando você de experimentar o novo sistema de build, por favor verifique novamente no futuro, pois ele pode ter sido resolvido.

### Verificação de tipo de código Web Worker e processamento de Web Workers aninhados {#type-checking-of-web-worker-code-and-processing-of-nested-web-workers}

Web Workers podem ser usados dentro do código da aplicação usando a mesma sintaxe (`new Worker(new URL('<workerfile>', import.meta.url))`) suportada pelo builder `browser`.
No entanto, o código dentro do Worker não será atualmente verificado quanto a tipos pelo compilador TypeScript. Código TypeScript é suportado, apenas não é verificado quanto a tipos.
Adicionalmente, quaisquer workers aninhados não serão processados pelo sistema de build. Um worker aninhado é uma instanciação de Worker dentro de outro arquivo de Worker.

### Imports default ESM vs. imports namespace {#esm-default-imports-vs-namespace-imports}

Por padrão, o TypeScript permite que exports default sejam importados como imports namespace e então usados em expressões de chamada.
Isso é, infelizmente, uma divergência da especificação ECMAScript.
O bundler subjacente (`esbuild`) dentro do novo sistema de build espera código ESM que esteja em conformidade com a especificação.
O sistema de build agora gerará um aviso se sua aplicação usar um tipo incorreto de import de um pacote.
No entanto, para permitir que o TypeScript aceite o uso correto, uma opção do TypeScript deve ser ativada no arquivo `tsconfig` da aplicação.
Quando ativada, a opção [`esModuleInterop`](https://www.typescriptlang.org/tsconfig#esModuleInterop) oferece melhor alinhamento com a especificação ECMAScript e também é recomendada pela equipe do TypeScript.
Uma vez ativada, você pode atualizar os imports de pacotes, onde aplicável, para uma forma conforme ECMAScript.

Usando o pacote [`moment`](https://npmjs.com/package/moment) como exemplo, o seguinte código da aplicação causará erros em tempo de execução:

```ts
import * as moment from 'moment';

console.log(moment().format());
```

O build gerará um aviso para notificá-lo de que há um problema potencial. O aviso será semelhante a:

```text
▲ [WARNING] Calling "moment" will crash at run-time because it's an import namespace object, not a function [call-import-namespace]

    src/main.ts:2:12:
      2 │ console.log(moment().format());
        ╵             ~~~~~~

Consider changing "moment" to a default import instead:

    src/main.ts:1:7:
      1 │ import * as moment from 'moment';
        │        ~~~~~~~~~~~
        ╵        moment

```

No entanto, você pode evitar os erros em tempo de execução e o aviso ativando a opção `esModuleInterop` do TypeScript para a aplicação e alterando o import para o seguinte:

```ts
import moment from 'moment';

console.log(moment().format());
```

### Imports com efeito colateral dependentes de ordem em módulos lazy {#order-dependent-side-effectful-imports-in-lazy-modules}

Instruções de import que dependem de uma ordenação específica e também são usadas em múltiplos módulos lazy podem fazer com que instruções de nível superior sejam executadas fora de ordem.
Isso não é comum, pois depende do uso de módulos com efeito colateral, e não se aplica à opção `polyfills`.
Isso é causado por um [defeito](https://github.com/evanw/esbuild/issues/399) no bundler subjacente, mas será corrigido em uma atualização futura.

IMPORTANT: Evitar o uso de módulos com efeitos colaterais não locais (fora de polyfills) é recomendado sempre que possível, independentemente do sistema de build utilizado, e evita este problema específico. Módulos com efeitos colaterais não locais podem ter um efeito negativo tanto no tamanho da aplicação quanto no desempenho em tempo de execução.

### Mudanças de localização de saída {#output-location-changes}

Por padrão, após um build bem-sucedido pelo builder application, o bundle está localizado em um diretório `dist/<nome-do-projeto>/browser` (em vez de `dist/<nome-do-projeto>` para o builder browser).
Isso pode quebrar algumas das toolchains que dependem da localização anterior. Nesse caso, você pode [configurar o caminho de saída](reference/configs/workspace-config#output-path-configuration) para atender às suas necessidades.

## Relatórios de bugs {#bug-reports}

Reporte problemas e solicitações de recursos no [GitHub](https://github.com/angular/angular-cli/issues).

Por favor, forneça uma reprodução mínima sempre que possível, para ajudar a equipe a resolver os problemas.
