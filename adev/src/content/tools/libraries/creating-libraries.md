<!-- ia-translate: true -->

# Criando bibliotecas

Esta página fornece uma visão geral conceitual de como criar e publicar novas bibliotecas para estender a funcionalidade do Angular.

Se você descobrir que precisa resolver o mesmo problema em mais de uma aplicação \(ou deseja compartilhar sua solução com outros desenvolvedores\), você tem um candidato para uma biblioteca.
Um exemplo simples pode ser um botão que envia usuários ao site da sua empresa, que seria incluído em todas as aplicações que sua empresa constrói.

## Começando

Use o Angular CLI para gerar um novo esqueleto de biblioteca em um novo workspace com os seguintes comandos.

```shell

ng new my-workspace --no-create-application
cd my-workspace
ng generate library my-lib

```

<docs-callout title="Nomeando sua biblioteca">

Você deve ter muito cuidado ao escolher o nome de sua biblioteca se quiser publicá-la posteriormente em um registro de pacote público como npm.
Veja [Publicando sua biblioteca](tools/libraries/creating-libraries#publishing-your-library).

Evite usar um nome que tenha prefixo `ng-`, como `ng-library`.
O prefixo `ng-` é uma palavra-chave reservada usada pelo framework Angular e suas bibliotecas.
O prefixo `ngx-` é preferido como uma convenção usada para denotar que a biblioteca é adequada para uso com Angular.
Também é uma excelente indicação para consumidores do registro para diferenciar entre bibliotecas de diferentes frameworks JavaScript.

</docs-callout>

O comando `ng generate` cria a pasta `projects/my-lib` em seu workspace, que contém um component.

ÚTIL: Para mais detalhes sobre como um projeto de biblioteca é estruturado, consulte a seção [Arquivos de projeto de biblioteca](reference/configs/file-structure#library-project-files) do [guia de Estrutura de Arquivos do Projeto](reference/configs/file-structure).

Use o modelo monorepo para usar o mesmo workspace para múltiplos projetos.
Veja [Configurando para um workspace multi-projeto](reference/configs/file-structure#multiple-projects).

Quando você gera uma nova biblioteca, o arquivo de configuração do workspace, `angular.json`, é atualizado com um projeto do tipo `library`.

```json

"projects": {
  …
  "my-lib": {
    "root": "projects/my-lib",
    "sourceRoot": "projects/my-lib/src",
    "projectType": "library",
    "prefix": "lib",
    "architect": {
      "build": {
        "builder": "@angular-devkit/build-angular:ng-packagr",
        …

```

Construa, teste e faça lint do projeto com comandos CLI:

```shell

ng build my-lib --configuration development
ng test my-lib
ng lint my-lib

```

Observe que o builder configurado para o projeto é diferente do builder padrão para projetos de aplicação.
Este builder, entre outras coisas, garante que a biblioteca sempre seja construída com o [compilador AOT](tools/cli/aot-compiler).

Para tornar o código da biblioteca reutilizável, você deve definir uma API pública para ela.
Esta "camada de usuário" define o que está disponível para consumidores de sua biblioteca.
Um usuário de sua biblioteca deve ser capaz de acessar funcionalidade pública \(como service providers e funções utilitárias gerais\) através de um único caminho de import.

A API pública para sua biblioteca é mantida no arquivo `public-api.ts` na pasta de sua biblioteca.
Qualquer coisa exportada deste arquivo é tornada pública quando sua biblioteca é importada em uma aplicação.

Sua biblioteca deve fornecer documentação \(tipicamente um arquivo README\) para instalação e manutenção.

## Refatorando partes de uma aplicação em uma biblioteca

Para tornar sua solução reutilizável, você precisa ajustá-la para que não dependa de código específico da aplicação.
Aqui estão algumas coisas a considerar ao migrar funcionalidade da aplicação para uma biblioteca.

- Declarações como components e pipes devem ser projetados como stateless, significando que não dependem ou alteram variáveis externas.
  Se você depende de estado, precisa avaliar cada caso e decidir se é estado da aplicação ou estado que a biblioteca gerenciaria.

- Quaisquer observables aos quais os components se inscrevem internamente devem ser limpos e descartados durante o ciclo de vida desses components
- Components devem expor suas interações através de inputs para fornecer contexto e outputs para comunicar eventos a outros components

- Verifique todas as dependências internas.
  - Para classes personalizadas ou interfaces usadas em components ou service, verifique se elas dependem de classes ou interfaces adicionais que também precisam ser migradas
  - Da mesma forma, se o código de sua biblioteca depende de um service, esse service precisa ser migrado
  - Se o código de sua biblioteca ou seus templates dependem de outras bibliotecas \(como Angular Material, por exemplo\), você deve configurar sua biblioteca com essas dependências

- Considere como você fornece services a aplicações clientes.
  - Services devem declarar seus próprios providers, em vez de declarar providers no NgModule ou em um component.
    Declarar um provider torna esse service _tree-shakable_.
    Esta prática permite ao compilador deixar o service fora do pacote se ele nunca for injetado na aplicação que importa a biblioteca.
    Para mais sobre isso, veja [Providers tree-shakable](guide/di/lightweight-injection-tokens).

  - Se você registrar service providers globais, exponha uma função provider `provideXYZ()`.
  - Se sua biblioteca fornece services opcionais que podem não ser usados por todas as aplicações clientes, suporte tree-shaking apropriado para esse caso usando o [padrão de design de token leve](guide/di/lightweight-injection-tokens)

## Integrando com o CLI usando schematics de geração de código

Uma biblioteca tipicamente inclui _código reutilizável_ que define components, services e outros artefatos Angular \(pipes, directives\) que você importa em um projeto.
Uma biblioteca é empacotada em um pacote npm para publicação e compartilhamento.
Este pacote também pode incluir schematics que fornecem instruções para gerar ou transformar código diretamente em seu projeto, da mesma forma que o CLI cria um novo component genérico com `ng generate component`.
Um schematic que é empacotado com uma biblioteca pode, por exemplo, fornecer ao Angular CLI as informações necessárias para gerar um component que configura e usa um recurso particular, ou conjunto de recursos, definido naquela biblioteca.
Um exemplo disso é o [schematic de navegação do Angular Material](https://material.angular.dev/guide/schematics#navigation-schematic) que configura o [BreakpointObserver](https://material.angular.dev/cdk/layout/overview#breakpointobserver) do CDK e o usa com os components [MatSideNav](https://material.angular.dev/components/sidenav/overview) e [MatToolbar](https://material.angular.dev/components/toolbar/overview) do Material.

Crie e inclua os seguintes tipos de schematics:

- Inclua um schematic de instalação para que `ng add` possa adicionar sua biblioteca a um projeto
- Inclua schematics de geração em sua biblioteca para que `ng generate` possa criar seus artefatos definidos \(components, services, testes\) em um projeto
- Inclua um schematic de atualização para que `ng update` possa atualizar as dependências de sua biblioteca e fornecer migrações para mudanças incompatíveis em novas versões

O que você inclui em sua biblioteca depende de sua tarefa.
Por exemplo, você poderia definir um schematic para criar um dropdown que é pré-populado com dados enlatados para mostrar como adicioná-lo a uma aplicação.
Se você quiser um dropdown que contenha valores passados diferentes a cada vez, sua biblioteca poderia definir um schematic para criá-lo com uma configuração dada.
Desenvolvedores poderiam então usar `ng generate` para configurar uma instância para sua própria aplicação.

Suponha que você queira ler um arquivo de configuração e então gerar um formulário baseado nessa configuração.
Se esse formulário precisa de personalização adicional pelo desenvolvedor que está usando sua biblioteca, pode funcionar melhor como um schematic.
No entanto, se o formulário sempre será o mesmo e não precisará de muita personalização pelos desenvolvedores, então você poderia criar um component dinâmico que recebe a configuração e gera o formulário.
Em geral, quanto mais complexa a personalização, mais útil é a abordagem de schematic.

Para mais informações, veja [Visão geral de Schematics](tools/cli/schematics) e [Schematics para Bibliotecas](tools/cli/schematics-for-libraries).

## Publicando sua biblioteca

Use o Angular CLI e o gerenciador de pacotes npm para construir e publicar sua biblioteca como um pacote npm.

Angular CLI usa uma ferramenta chamada [ng-packagr](https://github.com/ng-packagr/ng-packagr/blob/master/README.md) para criar pacotes a partir de seu código compilado que podem ser publicados no npm.
Veja [Construindo bibliotecas com Ivy](tools/libraries/creating-libraries#publishing-libraries) para informações sobre os formatos de distribuição suportados pelo `ng-packagr` e orientação sobre como
escolher o formato correto para sua biblioteca.

Você deve sempre construir bibliotecas para distribuição usando a configuração `production`.
Isso garante que a saída gerada use as otimizações apropriadas e o formato de pacote correto para npm.

```shell

ng build my-lib
cd dist/my-lib
npm publish

```

## Gerenciando assets em uma biblioteca

Em sua biblioteca Angular, o distribuível pode incluir assets adicionais como arquivos de temas, mixins Sass ou documentação \(como um changelog\).
Para mais informações [copie assets para sua biblioteca como parte do build](https://github.com/ng-packagr/ng-packagr/blob/master/docs/copy-assets.md) e [incorpore assets em estilos de component](https://github.com/ng-packagr/ng-packagr/blob/master/docs/embed-assets-css.md).

IMPORTANTE: Ao incluir assets adicionais como mixins Sass ou CSS pré-compilado.
Você precisa adicionar estes manualmente aos ["exports"](tools/libraries/angular-package-format#quotexportsquot) condicionais no `package.json` do entrypoint primário.

`ng-packagr` mesclará `"exports"` escritos manualmente com os auto-gerados, permitindo que autores de bibliotecas configurem subpaths de exportação adicionais ou condições personalizadas.

```json

"exports": {
  ".": {
    "sass": "./_index.scss",
  },
  "./theming": {
    "sass": "./_theming.scss"
  },
  "./prebuilt-themes/indigo-pink.css": {
    "style": "./prebuilt-themes/indigo-pink.css"
  }
}

```

O acima é um extrato do distribuível [@angular/material](https://unpkg.com/browse/@angular/material/package.json).

## Dependências peer

Bibliotecas Angular devem listar quaisquer dependências `@angular/*` das quais a biblioteca depende como peer dependencies.
Isso garante que quando módulos pedem por Angular, todos eles obtenham exatamente o mesmo módulo.
Se uma biblioteca lista `@angular/core` em `dependencies` em vez de `peerDependencies`, ela pode obter um módulo Angular diferente, o que causaria quebra em sua aplicação.

## Usando sua própria biblioteca em aplicações

Você não precisa publicar sua biblioteca no gerenciador de pacotes npm para usá-la no mesmo workspace, mas você precisa construí-la primeiro.

Para usar sua própria biblioteca em uma aplicação:

- Construa a biblioteca.
  Você não pode usar uma biblioteca antes de construí-la.

```shell
  ng build my-lib
```

- Em suas aplicações, importe da biblioteca por nome:

```ts
  import { myExport } from 'my-lib';
```

### Construindo e reconstruindo sua biblioteca

O passo de build é importante se você não publicou sua biblioteca como um pacote npm e então instalou o pacote de volta em sua aplicação do npm.
Por exemplo, se você clonar seu repositório git e executar `npm install`, seu editor mostra os imports `my-lib` como ausentes se você ainda não construiu sua biblioteca.

ÚTIL: Quando você importa algo de uma biblioteca em uma aplicação Angular, Angular procura por um mapeamento entre o nome da biblioteca e uma localização no disco.
Quando você instala um pacote de biblioteca, o mapeamento está na pasta `node_modules`.
Quando você constrói sua própria biblioteca, ela precisa encontrar o mapeamento em seus paths `tsconfig`.

Gerar uma biblioteca com o Angular CLI adiciona automaticamente seu caminho ao arquivo `tsconfig`.
O Angular CLI usa os paths `tsconfig` para dizer ao sistema de build onde encontrar a biblioteca.

Para mais informações, veja [Visão geral de mapeamento de paths](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping).

Se você descobrir que mudanças em sua biblioteca não estão refletidas em sua aplicação, sua aplicação provavelmente está usando um build antigo da biblioteca.

Você pode reconstruir sua biblioteca sempre que fizer mudanças nela, mas este passo extra leva tempo.
A funcionalidade de _builds incrementais_ melhora a experiência de desenvolvimento de biblioteca.
Toda vez que um arquivo é alterado, um build parcial é executado que emite os arquivos modificados.

Builds incrementais podem ser executados como um processo em segundo plano em seu ambiente de desenvolvimento.
Para aproveitar este recurso, adicione a flag `--watch` ao comando de build:

```shell

ng build my-lib --watch

```

IMPORTANTE: O comando `build` do CLI usa um builder diferente e invoca uma ferramenta de build diferente para bibliotecas do que para aplicações.

- O sistema de build para aplicações, `@angular-devkit/build-angular`, é baseado em `webpack` e está incluído em todos os novos projetos Angular CLI
- O sistema de build para bibliotecas é baseado em `ng-packagr`.
  Ele só é adicionado às suas dependências quando você adiciona uma biblioteca usando `ng generate library my-lib`.

Os dois sistemas de build suportam coisas diferentes, e mesmo onde suportam as mesmas coisas, fazem essas coisas de forma diferente.
Isso significa que o código-fonte TypeScript pode resultar em código JavaScript diferente em uma biblioteca construída do que em uma aplicação construída.

Por esta razão, uma aplicação que depende de uma biblioteca deve usar apenas mapeamentos de path TypeScript que apontem para a biblioteca _construída_.
Mapeamentos de path TypeScript _não_ devem apontar para os arquivos `.ts` de origem da biblioteca.

## Publicando bibliotecas

Existem dois formatos de distribuição a serem usados ao publicar uma biblioteca:

| Formatos de distribuição    | Detalhes                                                                                                                                                                                                                                                                                                                                                 |
| :-------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Partial-Ivy \(recomendado\) | Contém código portátil que pode ser consumido por aplicações Ivy construídas com qualquer versão do Angular a partir da v12.                                                                                                                                                                                                                             |
| Full-Ivy                    | Contém instruções privadas do Angular Ivy, que não são garantidas para funcionar em diferentes versões do Angular. Este formato requer que a biblioteca e a aplicação sejam construídas com a _mesma_ versão exata do Angular. Este formato é útil para ambientes onde todo o código de biblioteca e aplicação é construído diretamente do código-fonte. |

Para publicar no npm, use o formato partial-Ivy, pois é estável entre versões de patch do Angular.

Evite compilar bibliotecas com código full-Ivy se você está publicando no npm porque as instruções Ivy geradas não fazem parte da API pública do Angular e, portanto, podem mudar entre versões de patch.

## Garantindo compatibilidade de versão de biblioteca

A versão do Angular usada para construir uma aplicação deve sempre ser a mesma ou maior que as versões do Angular usadas para construir qualquer uma de suas bibliotecas dependentes.
Por exemplo, se você tivesse uma biblioteca usando Angular versão 13, a aplicação que depende dessa biblioteca deve usar Angular versão 13 ou posterior.
Angular não suporta usar uma versão anterior para a aplicação.

Se você pretende publicar sua biblioteca no npm, compile com código partial-Ivy definindo `"compilationMode": "partial"` em `tsconfig.prod.json`.
Este formato parcial é estável entre diferentes versões do Angular, portanto é seguro publicar no npm.
Código com este formato é processado durante o build da aplicação usando a mesma versão do compilador Angular, garantindo que a aplicação e todas as suas bibliotecas usem uma única versão do Angular.

Evite compilar bibliotecas com código full-Ivy se você está publicando no npm porque as instruções Ivy geradas não fazem parte da API pública do Angular e, portanto, podem mudar entre versões de patch.

Se você nunca publicou um pacote no npm antes, você deve criar uma conta de usuário.
Leia mais em [Publicando Pacotes npm](https://docs.npmjs.com/getting-started/publishing-npm-packages).

## Consumindo código partial-Ivy fora do Angular CLI

Uma aplicação instala muitas bibliotecas Angular do npm em seu diretório `node_modules`.
No entanto, o código nessas bibliotecas não pode ser empacotado diretamente junto com a aplicação construída, pois não está totalmente compilado.
Para finalizar a compilação, use o linker Angular.

Para aplicações que não usam o Angular CLI, o linker está disponível como um plugin [Babel](https://babeljs.io).
O plugin deve ser importado de `@angular/compiler-cli/linker/babel`.

O plugin Babel do linker Angular suporta cache de build, significando que bibliotecas só precisam ser processadas pelo linker uma única vez, independentemente de outras operações npm.

Exemplo de integração do plugin em um build [webpack](https://webpack.js.org) personalizado registrando o linker como um plugin [Babel](https://babeljs.io) usando [babel-loader](https://webpack.js.org/loaders/babel-loader/#options).

<docs-code header="webpack.config.mjs" path="adev/src/content/examples/angular-linker-plugin/webpack.config.mjs" visibleRegion="webpack-config"/>

ÚTIL: O Angular CLI integra o plugin linker automaticamente, então se consumidores de sua biblioteca estiverem usando o CLI, eles podem instalar bibliotecas nativas Ivy do npm sem nenhuma configuração adicional.
