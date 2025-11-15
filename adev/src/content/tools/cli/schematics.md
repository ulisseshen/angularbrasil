<!-- ia-translate: true -->

# Gerando código usando schematics

Um schematic é um gerador de código baseado em template que suporta lógica complexa.
É um conjunto de instruções para transformar um projeto de software gerando ou modificando código.
Schematics são empacotados em coleções e instalados com npm.

A coleção de schematic pode ser uma ferramenta poderosa para criar, modificar e manter qualquer projeto de software, mas é particularmente útil para customizar projetos Angular para atender às necessidades particulares de sua própria organização.
Você pode usar schematics, por exemplo, para gerar padrões de UI comumente usados ou components específicos, usando templates ou layouts predefinidos.
Use schematics para forçar regras e convenções arquiteturais, tornando seus projetos consistentes e interoperáveis.

## Schematics para o Angular CLI

Schematics são parte do ecossistema Angular.
O Angular CLI usa schematics para aplicar transformações a um projeto de aplicação web.
Você pode modificar esses schematics, e definir novos para fazer coisas como atualizar seu código para corrigir breaking changes em uma dependência, por exemplo, ou para adicionar uma nova opção de configuração ou framework a um projeto existente.

Schematics que são incluídos na coleção `@schematics/angular` são executados por padrão pelos comandos `ng generate` e `ng add`.
O pacote contém schematics nomeados que configuram as opções que estão disponíveis para o CLI para sub-comandos `ng generate`, como `ng generate component` e `ng generate service`.
Os sub-comandos para `ng generate` são atalhos para o schematic correspondente.
Para especificar e gerar um schematic particular, ou uma coleção de schematics, usando a forma longa:

```shell

ng generate my-schematic-collection:my-schematic-name

```

ou

```shell

ng generate my-schematic-name --collection collection-name

```

### Configurando schematics do CLI

Um schema JSON associado a um schematic diz ao Angular CLI quais opções estão disponíveis para comandos e sub-comandos, e determina os padrões.
Esses padrões podem ser sobrescritos fornecendo um valor diferente para uma opção na linha de comando.
Veja [Configuração do Workspace](reference/configs/workspace-config) para informações sobre como alterar os padrões de opção de geração para seu workspace.

Os schemas JSON para os schematics padrão usados pelo CLI para gerar projetos e partes de projetos são coletados no pacote [`@schematics/angular`](https://github.com/angular/angular-cli/tree/main/packages/schematics/angular).
O schema descreve as opções disponíveis para o CLI para cada um dos sub-comandos `ng generate`, conforme mostrado na saída `--help`.

## Desenvolvendo schematics para bibliotecas

Como desenvolvedor de biblioteca, você pode criar suas próprias coleções de schematics customizados para integrar sua biblioteca com o Angular CLI.

- Um _add schematic_ permite que desenvolvedores instalem sua biblioteca em um workspace Angular usando `ng add`
- _Schematics de geração_ podem dizer aos sub-comandos `ng generate` como modificar projetos, adicionar configurações e scripts, e gerar estrutura de artefatos que são definidos em sua biblioteca
- Um _update schematic_ pode dizer ao comando `ng update` como atualizar as dependências de sua biblioteca e ajustar para breaking changes quando você lança uma nova versão

Para mais detalhes sobre como esses se parecem e como criá-los, veja:

<docs-pill-row>
  <docs-pill href="tools/cli/schematics-authoring" title="Authoring Schematics"/>
  <docs-pill href="tools/cli/schematics-for-libraries" title="Schematics for Libraries"/>
</docs-pill-row>

### Add schematics

Um _add schematic_ é tipicamente fornecido com uma biblioteca, para que a biblioteca possa ser adicionada a um projeto existente com `ng add`.
O comando `add` usa seu gerenciador de pacotes para baixar novas dependências, e invoca um script de instalação que é implementado como um schematic.

Por exemplo, o schematic [`@angular/material`](https://material.angular.dev/guide/schematics) diz ao comando `add` para instalar e configurar Angular Material e theming, e registrar novos components starter que podem ser criados com `ng generate`.
Veja este como um exemplo e modelo para seu próprio add schematic.

Bibliotecas parceiras e de terceiros também suportam o Angular CLI com add schematics.
Por exemplo, `@ng-bootstrap/schematics` adiciona [ng-bootstrap](https://ng-bootstrap.github.io) a uma aplicação, e `@clr/angular` instala e configura [Clarity da VMWare](https://clarity.design/documentation/get-started).

Um _add schematic_ também pode atualizar um projeto com alterações de configuração, adicionar dependências adicionais \(como polyfills\), ou gerar código de inicialização específico do pacote.
Por exemplo, o schematic `@angular/pwa` transforma sua aplicação em uma PWA adicionando um manifest de aplicação e service worker.

### Schematics de geração

Schematics de geração são instruções para o comando `ng generate`.
Os sub-comandos documentados usam os schematics de geração Angular padrão, mas você pode especificar um schematic diferente \(no lugar de um sub-comando\) para gerar um artefato definido em sua biblioteca.

Angular Material, por exemplo, fornece schematics de geração para os components UI que ele define.
O seguinte comando usa um desses schematics para renderizar um `<mat-table>` do Angular Material que está pré-configurado com um datasource para ordenação e paginação.

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

Se você passar ao comando um conjunto de bibliotecas para atualizar, ele atualiza essas bibliotecas, suas dependências peer, e as dependências peer que dependem delas.

ÚTIL: Se houver inconsistências \(por exemplo, se dependências peer não puderem ser correspondidas por um intervalo [semver](https://semver.io) simples\), o comando gera um erro e não altera nada no workspace.

Recomendamos que você não force uma atualização de todas as dependências por padrão.
Tente atualizar dependências específicas primeiro.

Para mais sobre como o comando `ng update` funciona, veja [Comando Update](https://github.com/angular/angular-cli/blob/main/docs/specifications/update.md).

Se você criar uma nova versão de sua biblioteca que introduz potenciais breaking changes, você pode fornecer um _update schematic_ para habilitar o comando `ng update` a resolver automaticamente quaisquer tais alterações no projeto sendo atualizado.

Por exemplo, suponha que você queira atualizar a biblioteca Angular Material.

```shell
ng update @angular/material
```

Este comando atualiza tanto `@angular/material` quanto sua dependência `@angular/cdk` no `package.json` do seu workspace.
Se qualquer um dos pacotes contiver um update schematic que cobre migração da versão existente para uma nova versão, o comando executa esse schematic no seu workspace.
