<!-- ia-translate: true -->
# Adicionar o pacote localize

Para aproveitar os recursos de localização do Angular, use o [Angular CLI][CliMain] para adicionar o pacote `@angular/localize` ao seu projeto.

Para adicionar o pacote `@angular/localize`, use o seguinte comando para atualizar os arquivos `package.json` e de configuração do TypeScript em seu projeto.

<docs-code path="adev/src/content/examples/i18n/doc-files/commands.sh" visibleRegion="add-localize"/>

Ele adiciona `types: ["@angular/localize"]` nos arquivos de configuração do TypeScript.
Também adiciona a linha `/// <reference types="@angular/localize" />` no topo do arquivo `main.ts`, que é a referência à definição de tipo.

HELPFUL: Para mais informações sobre os arquivos `package.json` e `tsconfig.json`, veja [Dependências npm do workspace][GuideNpmPackages] e [Configuração do TypeScript][GuideTsConfig]. Para aprender sobre Triple-slash Directives visite [Typescript Handbook](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html#-reference-types-).

Se `@angular/localize` não estiver instalado e você tentar buildar uma versão localizada do seu projeto (por exemplo, ao usar os atributos `i18n` em templates), o [Angular CLI][CliMain] gerará um erro, que conterá os passos que você pode seguir para habilitar i18n em seu projeto.

## Opções

| OPÇÃO              | DESCRIÇÃO                                                                                                                                                                                                                   | TIPO DO VALOR | VALOR PADRÃO |
| :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------ | :----------- |
| `--project`        | O nome do projeto.                                                                                                                                                                                                          | `string`      |
| `--use-at-runtime` | Se definido, então `$localize` pode ser usado em tempo de execução. Também `@angular/localize` é incluído na seção `dependencies` do `package.json`, ao invés de `devDependencies`, que é o padrão. | `boolean`     | `false`      |

Para mais opções disponíveis, veja `ng add` no [Angular CLI][CliMain].

## Próximos passos

<docs-pill-row>
  <docs-pill href="guide/i18n/locale-id" title="Referenciar locales por ID"/>
</docs-pill-row>

[CliMain]: cli 'CLI Overview and Command Reference | Angular'
[GuideNpmPackages]: reference/configs/npm-packages 'Workspace npm dependencies | Angular'
[GuideTsConfig]: https://www.typescriptlang.org/docs/handbook/tsconfig-json.html 'TypeScript Configuration'
