<!-- ia-translate: true -->

# Opções do compilador Angular

Quando você usa a [compilação ahead-of-time (AOT)](tools/cli/aot-compiler), pode controlar como sua aplicação é compilada especificando opções do compilador Angular no [arquivo de configuração do TypeScript](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

O objeto de opções do Angular, `angularCompilerOptions`, é irmão do objeto `compilerOptions`, que fornece opções padrão para o compilador TypeScript.

<docs-code header="tsconfig.json" path="adev/src/content/examples/angular-compiler-options/tsconfig.json" region="angular-compiler-options"/>

## Herança de configuração com `extends` {#configuration-inheritance-with-extends}

Assim como o compilador TypeScript, o compilador AOT do Angular também oferece suporte a `extends` na seção `angularCompilerOptions` do arquivo de configuração do TypeScript.
A propriedade `extends` fica no nível superior, em paralelo a `compilerOptions` e `angularCompilerOptions`.

Uma configuração do TypeScript pode herdar configurações de outro arquivo usando a propriedade `extends`.
As opções de configuração do arquivo base são carregadas primeiro e depois substituídas pelas do arquivo que herda.

Por exemplo:

<docs-code header="tsconfig.app.json" path="adev/src/content/examples/angular-compiler-options/tsconfig.app.json" region="angular-compiler-options-app"/>

Para mais informações, veja o [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

## Opções de template {#template-options}

As seguintes opções estão disponíveis para configurar o compilador AOT do Angular.

### `annotationsAs`

Modifica como as anotações específicas do Angular são emitidas para melhorar o tree-shaking.
Anotações não relacionadas ao Angular não são afetadas.
Um de `static fields` ou `decorators`. O valor padrão é `static fields`.

- Por padrão, o compilador substitui os decorators por um campo estático na classe, o que permite que tree-shakers avançados, como o [Closure compiler](https://github.com/google/closure-compiler), removam classes não utilizadas
- O valor `decorators` mantém os decorators no lugar, o que torna a compilação mais rápida.
  O TypeScript emite chamadas ao helper `__decorate`.
  Use `--emitDecoratorMetadata` para reflexão em runtime.

  HELPFUL: O código resultante não pode sofrer tree-shaking adequadamente.

### `annotateForClosureCompiler`

<!-- vale Angular.Angular_Spelling = NO -->

Quando `true`, usa o [Tsickle](https://github.com/angular/tsickle) para anotar o JavaScript emitido com comentários [JSDoc](https://jsdoc.app) necessários para o [Closure Compiler](https://github.com/google/closure-compiler).
O padrão é `false`.

<!-- vale Angular.Angular_Spelling = YES -->

### `compilationMode`

Especifica o modo de compilação a ser usado.
Os seguintes modos estão disponíveis:

| Modos       | Detalhes                                                                                                                                                                                                       |
| :---------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `'full'`    | Gera código totalmente compilado com AOT. A ABI do compilador (as APIs internas de runtime usadas por esse código) é estável entre versões de patch da mesma versão minor.                                    |
| `'partial'` | Gera código em uma forma estável, mas intermediária, adequada para bibliotecas publicadas independentemente.                                                                                                    |

O valor padrão é `'full'`.

Para a maioria das aplicações, `'full'` é o modo de compilação correto.

Use `'partial'` para bibliotecas publicadas independentemente, como pacotes NPM.
Compilações `'partial'` geram um formato intermediário estável, que oferece melhor suporte ao uso por aplicações criadas com versões major ou minor diferentes do Angular em relação à biblioteca.
Bibliotecas construídas em "HEAD" junto com suas aplicações e usando a mesma versão do Angular, como em um mono-repositório, podem usar `'full'`, já que não há risco de incompatibilidade entre versões minor. Observe que a ABI do compilador é estável entre versões de patch da mesma minor, o que permite compartilhar com segurança o runtime do Angular em arquiteturas de microfrontends, em que diferentes aplicações podem estar em níveis de patch distintos.

### `disableTypeScriptVersionCheck`

Quando `true`, o compilador não verifica a versão do TypeScript e não reporta erro quando uma versão não suportada é usada.
Não é recomendado, pois versões não suportadas do TypeScript podem ter comportamento indefinido.
O padrão é `false`.

### `enableI18nLegacyMessageIdFormat`

Instrui o compilador de templates do Angular a criar IDs legados para as mensagens marcadas nos templates pelo atributo `i18n`.
Veja [Marcar texto para traduções][GuideI18nCommonPrepareMarkTextInComponentTemplate] para mais informações sobre como marcar mensagens para localização.

Defina esta opção como `false`, a menos que o seu projeto dependa de traduções criadas anteriormente usando IDs legados.
O padrão é `true`.

A ferramenta de extração de mensagens pré-Ivy criava vários formatos legados para os IDs das mensagens extraídas.
Esses formatos têm alguns problemas, como o tratamento de espaços em branco e a dependência de informações do HTML original de um template.

O novo formato de mensagem é mais resistente a mudanças de espaços em branco, é o mesmo em todos os formatos de arquivo de tradução e pode ser criado diretamente a partir de chamadas a `$localize`.
Isso permite que mensagens `$localize` no código da aplicação usem o mesmo ID das mensagens `i18n` idênticas nos templates de components.

IMPORTANT: Esta opção é suportada apenas pelo builder `@angular-devkit/build-angular:browser`.
Ao usar o builder `@angular/build:application` (esbuild), esta opção não tem efeito, e o novo formato de ID decimal é sempre usado, independentemente desta configuração.

### `enableResourceInlining`

Quando `true`, substitui as propriedades `templateUrl` e `styleUrls` em todos os decorators `@Component` por conteúdo inline nas propriedades `template` e `styles`.

Quando habilitado, a saída `.js` do `ngc` não inclui nenhuma URL de template ou estilo carregada sob demanda (lazy loading).

Para projetos de biblioteca criados com o Angular CLI, o padrão da configuração de desenvolvimento é `true`.

### `flatModuleId`

O ID do módulo a ser usado para importar um módulo flat \(quando `flatModuleOutFile` é `true`\).
As referências criadas pelo compilador de templates usam esse nome de módulo ao importar símbolos do módulo flat.
É ignorado se `flatModuleOutFile` for `false`.

### `flatModuleOutFile`

Quando `true`, gera um índice de módulo flat com o nome de arquivo fornecido e os metadados de módulo flat correspondentes.
Use para criar módulos flat empacotados de forma semelhante a `@angular/core` e `@angular/common`.
Quando esta opção é usada, o `package.json` da biblioteca deve referenciar o índice de módulo flat criado, em vez do arquivo de índice da biblioteca.

Produz apenas um arquivo `.metadata.json`, que contém todos os metadados necessários para os símbolos exportados do índice da biblioteca.
Nos arquivos `.ngfactory.js` criados, o índice de módulo flat é usado para importar símbolos. Esses símbolos incluem tanto a API pública do índice da biblioteca quanto símbolos internos ocultos.

Por padrão, o arquivo `.ts` fornecido no campo `files` é considerado o índice da biblioteca.
Se mais de um arquivo `.ts` for especificado, `libraryIndex` é usado para selecionar o arquivo a ser usado.
Se mais de um arquivo `.ts` for fornecido sem um `libraryIndex`, um erro é gerado.

Um índice de módulo flat `.d.ts` e `.js` é criado com o nome definido em `flatModuleOutFile`, no mesmo local do arquivo `.d.ts` do índice da biblioteca.

Por exemplo, se uma biblioteca usa o arquivo `public_api.ts` como índice do módulo, o campo `files` do `tsconfig.json` seria `["public_api.ts"]`.
A opção `flatModuleOutFile` poderia então ser definida, por exemplo, como `"index.js"`, que produz os arquivos `index.d.ts` e `index.metadata.json`.
O campo `module` do `package.json` da biblioteca seria `"index.js"`, e o campo `typings` seria `"index.d.ts"`.

### `generateCodeForLibraries`

Quando `true`, cria arquivos factory \(`.ngfactory.js` e `.ngstyle.js`\) para arquivos `.d.ts` com um arquivo `.metadata.json` correspondente. O valor padrão é `true`.

Quando `false`, arquivos factory são criados apenas para arquivos `.ts`.
Faça isso ao usar factory summaries.

### `preserveWhitespaces`

Quando `false`, o padrão, remove nós de texto em branco dos templates compilados, o que resulta em módulos factory de template emitidos menores.
Defina como `true` para preservar os nós de texto em branco.

HELPFUL: Ao usar hydration, recomenda-se usar `preserveWhitespaces: false`, que é o valor padrão. Se você optar por habilitar a preservação de espaços em branco adicionando `preserveWhitespaces: true` ao seu tsconfig, pode encontrar problemas com hydration. Esta ainda não é uma configuração totalmente suportada. Garanta que essa opção também esteja definida de forma consistente entre os arquivos tsconfig do servidor e do cliente. Veja o [guia de hydration](guide/hydration#preserve-whitespaces-configuration) para mais detalhes.

### `skipMetadataEmit`

Quando `true`, não produz arquivos `.metadata.json`.
O padrão é `false`.

Os arquivos `.metadata.json` contêm informações necessárias ao compilador de templates de um arquivo `.ts` que não estão incluídas no arquivo `.d.ts` produzido pelo compilador TypeScript.
Essas informações incluem, por exemplo, o conteúdo de anotações, como o template de um component, que o TypeScript emite para o arquivo `.js`, mas não para o `.d.ts`.

Você pode definir como `true` ao usar factory summaries, porque eles incluem uma cópia das informações que estão no arquivo `.metadata.json`.

Defina como `true` se estiver usando a opção `--outFile` do TypeScript, pois os arquivos de metadados não são válidos para esse estilo de saída do TypeScript.
A comunidade Angular não recomenda o uso de `--outFile` com Angular.
Use um bundler, como o [webpack](https://webpack.js.org), em vez disso.

### `skipTemplateCodegen`

Quando `true`, não emite os arquivos `.ngfactory.js` e `.ngstyle.js`.
Isso desliga a maior parte do compilador de templates e desabilita o relatório de diagnósticos de template.

Pode ser usado para instruir o compilador de templates a produzir arquivos `.metadata.json` para distribuição com um pacote `npm`. Isso evita a produção de arquivos `.ngfactory.js` e `.ngstyle.js`, que não podem ser distribuídos para o `npm`.

Para projetos de biblioteca criados com o Angular CLI, o padrão da configuração de desenvolvimento é `true`.

### `strictMetadataEmit`

Quando `true`, reporta um erro no arquivo `.metadata.json` se `"skipMetadataEmit"` for `false`.
O padrão é `false`.
Use apenas quando `"skipMetadataEmit"` for `false` e `"skipTemplateCodegen"` for `true`.

Esta opção se destina a verificar os arquivos `.metadata.json` emitidos para empacotamento com um pacote `npm`.
A validação é estrita e pode emitir erros para metadados que nunca produziriam um erro quando usados pelo compilador de templates.
Você pode optar por suprimir o erro emitido por esta opção para um símbolo exportado incluindo `@dynamic` no comentário que documenta o símbolo.

É válido que os arquivos `.metadata.json` contenham erros.
O compilador de templates reporta esses erros se os metadados forem usados para determinar o conteúdo de uma anotação.
O coletor de metadados não consegue prever os símbolos projetados para uso em uma anotação. Ele inclui preventivamente nós de erro nos metadados dos símbolos exportados.
O compilador de templates pode então usar os nós de erro para reportar um erro se esses símbolos forem usados.

Se o cliente de uma biblioteca pretende usar um símbolo em uma anotação, o compilador de templates normalmente não reporta isso. O erro só é reportado depois que o cliente realmente usa o símbolo.
Esta opção permite detectar esses erros durante a fase de build da biblioteca e é usada, por exemplo, na produção das próprias bibliotecas Angular.

Para projetos de biblioteca criados com o Angular CLI, o padrão da configuração de desenvolvimento é `true`.

### `strictInjectionParameters`

Quando `true`, reporta um erro para um parâmetro injetado cujo tipo de injeção não pode ser determinado.
Quando `false`, parâmetros de constructor de classes marcadas com `@Injectable` cujo tipo não pode ser resolvido geram um aviso.
O valor recomendado é `true`, mas o valor padrão é `false`.

Quando você usa o comando `ng new --strict` do Angular CLI, essa opção é definida como `true` na configuração do projeto criado.

### `strictTemplates`

Quando `true`, habilita a [verificação de tipos de template estrita](tools/cli/template-typecheck#strict-mode).

As flags de rigor que esta opção habilita permitem ligar e desligar tipos específicos de verificação de tipos de template estrita.
Veja [solucionando erros de template](tools/cli/template-typecheck#troubleshooting-template-errors).
O padrão é `true`.

### `strictStandalone`

Quando `true`, reporta um erro se um component, diretiva ou pipe não for standalone.

### `trace`

Quando `true`, imprime informações extras ao compilar templates.
O padrão é `false`.

### `typeCheckHostBindings`

Quando `true`, habilita a verificação de tipos das expressões no objeto literal `host` e nos decorators `@HostBinding`/`@HostListener` de components e diretivas.
O padrão é `true`.

## Opções de linha de comando {#command-line-options}

Na maioria das vezes, você interage com o compilador Angular indiretamente, usando o [Angular CLI](reference/configs/angular-compiler-options). Ao depurar certos problemas, pode ser útil invocar o compilador Angular diretamente.
Você pode usar o comando `ngc`, fornecido pelo pacote npm `@angular/compiler-cli`, para chamar o compilador pela linha de comando.

O comando `ngc` é um wrapper em torno do comando `tsc` do TypeScript. O compilador Angular é configurado principalmente pelo `tsconfig.json`, enquanto o Angular CLI é configurado principalmente pelo `angular.json`.

Além do arquivo de configuração, você também pode usar [opções de linha de comando do `tsc`](https://www.typescriptlang.org/docs/handbook/compiler-options.html) para configurar o `ngc`.

[GuideI18nCommonPrepareMarkTextInComponentTemplate]: guide/i18n/prepare#mark-text-in-component-template 'Marcar texto no template do component - Preparar o component para tradução | Angular'
