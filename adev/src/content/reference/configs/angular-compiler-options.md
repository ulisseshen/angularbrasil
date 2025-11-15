<!-- ia-translate: true -->

# Opções do compilador Angular {#angular-compiler-options}

Quando você usa [compilação ahead-of-time (AOT)](tools/cli/aot-compiler), você pode controlar como sua aplicação é compilada especificando opções do compilador Angular no [arquivo de configuração do TypeScript](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

O objeto de opções do Angular, `angularCompilerOptions`, é um irmão do objeto `compilerOptions` que fornece opções padrão para o compilador TypeScript.

<docs-code header="tsconfig.json" path="adev/src/content/examples/angular-compiler-options/tsconfig.json" visibleRegion="angular-compiler-options"/>

## Herança de configuração com `extends` {#configuration-inheritance-with-extends}

Assim como o compilador TypeScript, o compilador AOT do Angular também suporta `extends` na seção `angularCompilerOptions` do arquivo de configuração do TypeScript.
A propriedade `extends` está no nível superior, paralela a `compilerOptions` e `angularCompilerOptions`.

Uma configuração TypeScript pode herdar configurações de outro arquivo usando a propriedade `extends`.
As opções de configuração do arquivo base são carregadas primeiro, depois substituídas pelas do arquivo de configuração herdeiro.

Por exemplo:

<docs-code header="tsconfig.app.json" path="adev/src/content/examples/angular-compiler-options/tsconfig.app.json" visibleRegion="angular-compiler-options-app"/>

Para mais informações, veja o [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

## Opções de template {#template-options}

As seguintes opções estão disponíveis para configurar o compilador AOT do Angular.

### `annotationsAs`

Modifica como anotações específicas do Angular são emitidas para melhorar o tree-shaking.
Anotações não-Angular não são afetadas.
Um de `static fields` ou `decorators`. O valor padrão é `static fields`.

- Por padrão, o compilador substitui decorators por um campo estático na classe, o que permite que tree-shakers avançados como o [Closure compiler](https://github.com/google/closure-compiler) removam classes não utilizadas
- O valor `decorators` deixa os decorators no lugar, o que torna a compilação mais rápida.
  TypeScript emite chamadas para o helper `__decorate`.
  Use `--emitDecoratorMetadata` para reflexão em runtime.

  HELPFUL: O código resultante não pode fazer tree-shake adequadamente.

### `annotateForClosureCompiler`

<!-- vale Angular.Angular_Spelling = NO -->

Quando `true`, usa [Tsickle](https://github.com/angular/tsickle) para anotar o JavaScript emitido com comentários [JSDoc](https://jsdoc.app) necessários para o [Closure Compiler](https://github.com/google/closure-compiler).
O padrão é `false`.

<!-- vale Angular.Angular_Spelling = YES -->

### `compilationMode`

Especifica o modo de compilação a ser usado.
Os seguintes modos estão disponíveis:

| Modos       | Detalhes                                                                                                   |
| :---------- | :--------------------------------------------------------------------------------------------------------- |
| `'full'`    | Gera código totalmente compilado em AOT de acordo com a versão do Angular que está sendo usada atualmente. |
| `'partial'` | Gera código em uma forma estável, mas intermediária, adequada para uma biblioteca publicada.               |

O valor padrão é `'full'`.

Para a maioria das aplicações, `'full'` é o modo de compilação correto.

Use `'partial'` para bibliotecas publicadas independentemente, como pacotes NPM.
Compilações `'partial'` produzem um formato intermediário estável que suporta melhor o uso por aplicações construídas em diferentes versões do Angular da biblioteca.
Bibliotecas construídas em "HEAD" junto com suas aplicações e usando a mesma versão do Angular, como em um mono-repositório, podem usar `'full'` já que não há risco de incompatibilidade de versão.

### `disableExpressionLowering`

Quando `true`, o padrão, transforma código que é ou poderia ser usado em uma anotação, para permitir que seja importado de módulos factory de template.
Veja [reescrita de metadata](tools/cli/aot-compiler#metadata-rewriting) para mais informações.

Quando `false`, desabilita esta reescrita, exigindo que a reescrita seja feita manualmente.

### `disableTypeScriptVersionCheck`

Quando `true`, o compilador não verifica a versão do TypeScript e não reporta um erro quando uma versão não suportada do TypeScript é usada.
Não recomendado, pois versões não suportadas do TypeScript podem ter comportamento indefinido.
O padrão é `false`.

### `enableI18nLegacyMessageIdFormat`

Instrui o compilador de template Angular a criar ids legados para mensagens que são marcadas em templates pelo atributo `i18n`.
Veja [Marcar texto para traduções][GuideI18nCommonPrepareMarkTextInComponentTemplate] para mais informações sobre marcar mensagens para localização.

Defina esta opção como `false` a menos que seu projeto dependa de traduções que foram criadas anteriormente usando ids legados.
O padrão é `true`.

A ferramenta de extração de mensagens pré-Ivy criou uma variedade de formatos legados para ids de mensagens extraídas.
Esses formatos de mensagem têm alguns problemas, como tratamento de espaços em branco e dependência de informações dentro do HTML original de um template.

O novo formato de mensagem é mais resiliente a mudanças de espaços em branco, é o mesmo em todos os formatos de arquivo de tradução e pode ser criado diretamente de chamadas para `$localize`.
Isso permite que mensagens `$localize` no código da aplicação usem o mesmo ID que mensagens `i18n` idênticas em templates de components.

### `enableResourceInlining`

Quando `true`, substitui as propriedades `templateUrl` e `styleUrls` em todos os decorators `@Component` por conteúdo inline nas propriedades `template` e `styles`.

Quando habilitado, a saída `.js` do `ngc` não inclui nenhuma URL de template ou estilo carregada com lazy loading.

Para projetos de biblioteca criados com o Angular CLI, o padrão da configuração de desenvolvimento é `true`.

### `enableLegacyTemplate`

Quando `true`, habilita o elemento `<template>` obsoleto no lugar de `<ng-template>`.
O padrão é `false`.
Pode ser necessário para algumas bibliotecas Angular de terceiros.

### `flatModuleId`

O ID do módulo a ser usado para importar um módulo flat \(quando `flatModuleOutFile` é `true`\).
Referências criadas pelo compilador de template usam este nome de módulo ao importar símbolos do módulo flat.
Ignorado se `flatModuleOutFile` é `false`.

### `flatModuleOutFile`

Quando `true`, gera um índice de módulo flat com o nome de arquivo fornecido e os metadados de módulo flat correspondentes.
Use para criar módulos flat que são empacotados de forma similar a `@angular/core` e `@angular/common`.
Quando esta opção é usada, o `package.json` da biblioteca deve referenciar o índice de módulo flat criado em vez do arquivo de índice da biblioteca.

Produz apenas um arquivo `.metadata.json`, que contém todos os metadados necessários para símbolos exportados do índice da biblioteca.
Nos arquivos `.ngfactory.js` criados, o índice de módulo flat é usado para importar símbolos. Símbolos que incluem tanto a API pública do índice da biblioteca quanto símbolos internos ocultos.

Por padrão, o arquivo `.ts` fornecido no campo `files` é assumido como o índice da biblioteca.
Se mais de um arquivo `.ts` for especificado, `libraryIndex` é usado para selecionar o arquivo a ser usado.
Se mais de um arquivo `.ts` for fornecido sem um `libraryIndex`, um erro é produzido.

Um índice de módulo flat `.d.ts` e `.js` é criado com o nome `flatModuleOutFile` fornecido no mesmo local que o arquivo `.d.ts` do índice da biblioteca.

Por exemplo, se uma biblioteca usa o arquivo `public_api.ts` como índice da biblioteca do módulo, o campo `files` do `tsconfig.json` seria `["public_api.ts"]`.
A opção `flatModuleOutFile` poderia então ser definida, por exemplo, como `"index.js"`, que produz os arquivos `index.d.ts` e `index.metadata.json`.
O campo `module` do `package.json` da biblioteca seria `"index.js"` e o campo `typings` seria `"index.d.ts"`.

### `fullTemplateTypeCheck`

Quando `true`, o valor recomendado, habilita a fase de [validação de expressões de binding](tools/cli/aot-compiler#binding-expression-validation) do compilador de template. Esta fase usa TypeScript para verificar expressões de binding.
Para mais informações, veja [Verificação de tipo de template](tools/cli/template-typecheck).

O padrão é `false`, mas quando você usa o comando Angular CLI `ng new --strict`, é definido como `true` na configuração do novo projeto.

IMPORTANT: A opção `fullTemplateTypeCheck` foi descontinuada no Angular 13 em favor da família de opções de compilador `strictTemplates`.

### `generateCodeForLibraries`

Quando `true`, cria arquivos factory \(`.ngfactory.js` e `.ngstyle.js`\) para arquivos `.d.ts` com um arquivo `.metadata.json` correspondente. O valor padrão é `true`.

Quando `false`, arquivos factory são criados apenas para arquivos `.ts`.
Faça isso ao usar resumos de factory.

### `preserveWhitespaces`

Quando `false`, o padrão, remove nós de texto em branco de templates compilados, o que resulta em módulos factory de template emitidos menores.
Defina como `true` para preservar nós de texto em branco.

HELPFUL: Ao usar hydration, é recomendado que você use `preserveWhitespaces: false`, que é o valor padrão. Se você optar por habilitar a preservação de espaços em branco adicionando `preserveWhitespaces: true` ao seu tsconfig, é possível que você encontre problemas com hydration. Esta ainda não é uma configuração totalmente suportada. Certifique-se de que isso também está definido consistentemente entre os arquivos tsconfig do servidor e do cliente. Veja o [guia de hydration](guide/hydration#preserve-whitespaces) para mais detalhes.

### `skipMetadataEmit`

Quando `true`, não produz arquivos `.metadata.json`.
O padrão é `false`.

Os arquivos `.metadata.json` contêm informações necessárias pelo compilador de template de um arquivo `.ts` que não estão incluídas no arquivo `.d.ts` produzido pelo compilador TypeScript.
Essas informações incluem, por exemplo, o conteúdo de anotações, como o template de um component, que TypeScript emite para o arquivo `.js` mas não para o arquivo `.d.ts`.

Você pode definir como `true` ao usar resumos de factory, porque os resumos de factory incluem uma cópia das informações que estão no arquivo `.metadata.json`.

Defina como `true` se você estiver usando a opção `--outFile` do TypeScript, porque os arquivos de metadados não são válidos para este estilo de saída do TypeScript.
A comunidade Angular não recomenda usar `--outFile` com Angular.
Use um bundler, como [webpack](https://webpack.js.org), em vez disso.

### `skipTemplateCodegen`

Quando `true`, não emite arquivos `.ngfactory.js` e `.ngstyle.js`.
Isso desliga a maior parte do compilador de template e desabilita o relatório de diagnósticos de template.

Pode ser usado para instruir o compilador de template a produzir arquivos `.metadata.json` para distribuição com um pacote `npm`. Isso evita a produção de arquivos `.ngfactory.js` e `.ngstyle.js` que não podem ser distribuídos para `npm`.

Para projetos de biblioteca criados com o Angular CLI, o padrão da configuração de desenvolvimento é `true`.

### `strictMetadataEmit`

Quando `true`, reporta um erro para o arquivo `.metadata.json` se `"skipMetadataEmit"` é `false`.
O padrão é `false`.
Use apenas quando `"skipMetadataEmit"` é `false` e `"skipTemplateCodegen"` é `true`.

Esta opção destina-se a verificar os arquivos `.metadata.json` emitidos para empacotamento com um pacote `npm`.
A validação é estrita e pode emitir erros para metadados que nunca produziriam um erro quando usados pelo compilador de template.
Você pode optar por suprimir o erro emitido por esta opção para um símbolo exportado incluindo `@dynamic` no comentário que documenta o símbolo.

É válido para arquivos `.metadata.json` conterem erros.
O compilador de template reporta esses erros se os metadados são usados para determinar o conteúdo de uma anotação.
O coletor de metadados não pode prever os símbolos que são projetados para uso em uma anotação. Ele inclui preventivamente nós de erro nos metadados para os símbolos exportados.
O compilador de template pode então usar os nós de erro para reportar um erro se esses símbolos forem usados.

Se o cliente de uma biblioteca pretende usar um símbolo em uma anotação, o compilador de template normalmente não reporta isso. É reportado depois que o cliente realmente usa o símbolo.
Esta opção permite a detecção desses erros durante a fase de build da biblioteca e é usada, por exemplo, na produção das próprias bibliotecas Angular.

Para projetos de biblioteca criados com o Angular CLI, o padrão da configuração de desenvolvimento é `true`.

### `strictInjectionParameters`

Quando `true`, reporta um erro para um parâmetro fornecido cujo tipo de injeção não pode ser determinado.
Quando `false`, parâmetros de constructor de classes marcadas com `@Injectable` cujo tipo não pode ser resolvido produzem um aviso.
O valor recomendado é `true`, mas o valor padrão é `false`.

Quando você usa o comando Angular CLI `ng new --strict`, é definido como `true` na configuração do projeto criado.

### `strictTemplates`

Quando `true`, habilita [verificação de tipo de template estrita](tools/cli/template-typecheck#strict-mode).

As flags de rigor que esta opção habilita permitem que você ative e desative tipos específicos de verificação de tipo de template estrita.
Veja [solucionando erros de template](tools/cli/template-typecheck#troubleshooting-template-errors).

Quando você usa o comando Angular CLI `ng new --strict`, é definido como `true` na configuração do novo projeto.

### `strictStandalone`

Quando `true`, reporta um erro se um component, diretiva ou pipe não é standalone.

### `trace`

Quando `true`, imprime informações extras ao compilar templates.
O padrão é `false`.

## Opções de linha de comando {#command-line-options}

Na maioria das vezes, você interage com o compilador Angular indiretamente usando [Angular CLI](reference/configs/angular-compiler-options). Ao debugar certos problemas, você pode achar útil invocar o compilador Angular diretamente.
Você pode usar o comando `ngc` fornecido pelo pacote npm `@angular/compiler-cli` para chamar o compilador da linha de comando.

O comando `ngc` é um wrapper em torno do comando compilador `tsc` do TypeScript. O compilador Angular é configurado principalmente através do `tsconfig.json` enquanto o Angular CLI é configurado principalmente através do `angular.json`.

Além do arquivo de configuração, você também pode usar [opções de linha de comando do `tsc`](https://www.typescriptlang.org/docs/handbook/compiler-options.html) para configurar o `ngc`.

[GuideI18nCommonPrepareMarkTextInComponentTemplate]: guide/i18n/prepare#mark-text-in-component-template 'Mark text in component template - Prepare component for translation | Angular'
