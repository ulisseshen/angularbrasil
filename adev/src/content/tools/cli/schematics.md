<!-- ia-translate: true -->
# Gerando código usando schematics {#generating-code-using-schematics}

Um schematic é um gerador de código baseado em templates que suporta lógica complexa.
É um conjunto de instruções para transformar um projeto de software gerando ou modificando código.
Schematics são empacotados em coleções e instalados com npm.

A coleção de schematics pode ser uma ferramenta poderosa para criar, modificar e manter qualquer projeto de software, mas é particularmente útil para personalizar projetos Angular de acordo com as necessidades específicas da sua própria organização.
Você pode usar schematics, por exemplo, para gerar padrões de UI comumente usados ou components específicos, usando templates ou layouts predefinidos.
Use schematics para aplicar regras e convenções arquiteturais, tornando seus projetos consistentes e interoperáveis.

## Schematics para o Angular CLI {#schematics-for-the-angular-cli}

Schematics fazem parte do ecossistema Angular.
O Angular CLI usa schematics para aplicar transformações a um projeto de aplicação web.
Você pode modificar esses schematics e definir novos para fazer coisas como atualizar seu código para corrigir breaking changes em uma dependência, por exemplo, ou para adicionar uma nova opção de configuração ou framework a um projeto existente.

Os schematics incluídos na coleção `@schematics/angular` são executados por padrão pelos comandos `ng generate` e `ng add`.
O pacote contém schematics nomeados que configuram as opções disponíveis no CLI para os sub-comandos `ng generate`, como `ng generate component` e `ng generate service`.
Os sub-comandos de `ng generate` são atalhos para o schematic correspondente.
Para especificar e gerar um schematic específico, ou uma coleção de schematics, usando a forma longa:

```shell

ng generate my-schematic-collection:my-schematic-name

```

ou

```shell

ng generate my-schematic-name --collection collection-name

```

### Configurando schematics do CLI {#configuring-cli-schematics}

Um schema JSON associado a um schematic informa ao Angular CLI quais opções estão disponíveis para comandos e sub-comandos, e determina os padrões.
Esses padrões podem ser sobrescritos fornecendo um valor diferente para uma opção na linha de comando.
Veja [Configuração do Workspace](reference/configs/workspace-config) para informações sobre como alterar os padrões de opções de geração do seu workspace.

Os schemas JSON dos schematics padrão usados pelo CLI para gerar projetos e partes de projetos estão reunidos no pacote [`@schematics/angular`](https://github.com/angular/angular-cli/tree/main/packages/schematics/angular).
O schema descreve as opções disponíveis no CLI para cada um dos sub-comandos `ng generate`, conforme mostrado na saída de `--help`.

### Formatação automática {#automatic-formatting}

Se o [Prettier](https://prettier.io/) ou o [Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) estiver instalado no seu workspace, o Angular CLI formata automaticamente os arquivos criados ou modificados por schematics e pelas migrações do `ng update`.
O CLI formata apenas os arquivos afetados e deixa todos os outros arquivos intocados.

## Desenvolvendo schematics para bibliotecas {#developing-schematics-for-libraries}

Como desenvolvedor de biblioteca, você pode criar suas próprias coleções de schematics personalizados para integrar sua biblioteca ao Angular CLI.

- Um _add schematic_ permite que desenvolvedores instalem sua biblioteca em um workspace Angular usando `ng add`
- _Schematics de geração_ podem dizer aos sub-comandos `ng generate` como modificar projetos, adicionar configurações e scripts, e criar a estrutura de artefatos definidos na sua biblioteca
- Um _update schematic_ pode dizer ao comando `ng update` como atualizar as dependências da sua biblioteca e ajustar breaking changes quando você lança uma nova versão

Para mais detalhes sobre como eles são e como criá-los, veja:

<docs-pill-row>
  <docs-pill href="tools/cli/schematics-authoring" title="Criando Schematics"/>
  <docs-pill href="tools/cli/schematics-for-libraries" title="Schematics para Bibliotecas"/>
</docs-pill-row>

### Add schematics

Um _add schematic_ normalmente é fornecido com uma biblioteca, para que ela possa ser adicionada a um projeto existente com `ng add`.
O comando `add` usa seu gerenciador de pacotes para baixar novas dependências e invoca um script de instalação implementado como um schematic.

Por exemplo, o schematic do [`@angular/material`](https://material.angular.dev/guide/schematics) diz ao comando `add` para instalar e configurar o Angular Material e o theming, e registrar novos components starter que podem ser criados com `ng generate`.
Use este como exemplo e modelo para o seu próprio add schematic.

Bibliotecas parceiras e de terceiros também oferecem suporte ao Angular CLI com add schematics.
Por exemplo, `@ng-bootstrap/schematics` adiciona o [ng-bootstrap](https://ng-bootstrap.github.io) a uma aplicação, e `@clr/angular` instala e configura o [Clarity da VMWare](https://clarity.design/documentation/get-started).

Um _add schematic_ também pode atualizar um projeto com alterações de configuração, adicionar dependências extras (como polyfills) ou gerar código de inicialização específico do pacote.
Por exemplo, o schematic `@angular/pwa` transforma sua aplicação em uma PWA, adicionando um manifest de aplicação e um service worker.

### Schematics de geração {#generation-schematics}

Schematics de geração são instruções para o comando `ng generate`.
Os sub-comandos documentados usam os schematics de geração padrão do Angular, mas você pode especificar um schematic diferente (no lugar de um sub-comando) para gerar um artefato definido na sua biblioteca.

O Angular Material, por exemplo, fornece schematics de geração para os components de UI que ele define.
O comando a seguir usa um desses schematics para renderizar um `<mat-table>` do Angular Material pré-configurado com um datasource para ordenação e paginação.

```shell

ng generate @angular/material:table <component-name>

```

### Update schematics

O comando `ng update` pode ser usado para atualizar as dependências de biblioteca do seu workspace.
Se você não fornecer opções ou usar a opção help, o comando examina seu workspace e sugere bibliotecas para atualizar.

```shell

ng update
We analyzed your package.json, there are some packages to update:

    Name                                      Version                     Command to update
    --------------------------------------------------------------------------------
    @angular/cdk                       7.2.2 -> 7.3.1           ng update @angular/cdk
    @angular/cli                       7.2.3 -> 7.3.0           ng update @angular/cli
    @angular/core                      7.2.2 -> 7.2.3           ng update @angular/core
    @angular/material                  7.2.2 -> 7.3.1           ng update @angular/material
    rxjs                                      6.3.3 -> 6.4.0           ng update rxjs

```

Se você passar ao comando um conjunto de bibliotecas para atualizar, ele atualiza essas bibliotecas, suas dependências peer e as dependências peer que dependem delas.

HELPFUL: Se houver inconsistências (por exemplo, se as dependências peer não puderem ser correspondidas por um intervalo [semver](https://semver.org) simples), o comando gera um erro e não altera nada no workspace.

Recomendamos que você não force a atualização de todas as dependências por padrão.
Tente atualizar dependências específicas primeiro.

Para mais detalhes sobre como o comando `ng update` funciona, veja [Comando Update](https://github.com/angular/angular-cli/blob/main/docs/specifications/update.md).

Se você criar uma nova versão da sua biblioteca que introduz potenciais breaking changes, pode fornecer um _update schematic_ para que o comando `ng update` resolva automaticamente essas mudanças no projeto que está sendo atualizado.

Por exemplo, suponha que você queira atualizar a biblioteca Angular Material.

```shell
ng update @angular/material
```

Este comando atualiza tanto o `@angular/material` quanto sua dependência `@angular/cdk` no `package.json` do seu workspace.
Se qualquer um dos pacotes contiver um update schematic que cubra a migração da versão existente para uma nova versão, o comando executa esse schematic no seu workspace.
</content>
