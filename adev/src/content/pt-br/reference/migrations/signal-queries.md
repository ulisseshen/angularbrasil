<!-- ia-translate: true -->
# Migração para signal queries

O Angular introduziu APIs melhoradas para queries que são consideradas
prontas para produção a partir da v19.
Leia mais sobre signal queries e seus benefícios no [guia dedicado](guide/signals/queries).

Para apoiar equipes existentes que gostariam de usar signal queries, o time do Angular
fornece uma migração automatizada que converte campos de query decorator existentes para a nova API.

Execute o schematic usando o seguinte comando:

```bash
ng generate @angular/core:signal-queries-migration
```

Alternativamente, a migração está disponível como uma [code refactor action](https://code.visualstudio.com/docs/typescript/typescript-refactoring#_refactoring) no VSCode.
Instale a versão mais recente da extensão VSCode e clique em, por exemplo, um campo `@ViewChild`.
Veja mais detalhes na seção [abaixo](#vscode-extension).

## O que a migração altera?

1. Membros de classe `@ViewChild()`, `@ViewChildren`, `@ContentChild` e `@ContentChildren`
   são atualizados para seus equivalentes signal.
2. Referências na sua aplicação para queries migradas são atualizadas para chamar o signal.
   - Isso inclui referências em templates, host bindings ou código TypeScript.

**Antes**

```typescript
import {Component, ContentChild} from '@angular/core';

@Component({
  template: `Has ref: {{someRef ? 'Yes' : 'No'}}`
})
export class MyComponent {
  @ContentChild('someRef') ref: ElementRef|undefined = undefined;

  someMethod(): void {
    if (this.ref) {
      this.ref.nativeElement;
    }
  }
}
```

**Depois**

```typescript
import {Component, contentChild} from '@angular/core';

@Component({
  template: `Has ref: {{someRef() ? 'Yes' : 'No'}}`
})
export class MyComponent {
  readonly ref = contentChild<ElementRef>('someRef');

  someMethod(): void {
    const ref = this.ref();
    if (ref) {
      ref.nativeElement;
    }
  }
}
```

## Opções de configuração

A migração suporta algumas opções para ajustar a migração às suas necessidades específicas.

### `--path`

Por padrão, a migração atualizará todo o seu workspace Angular CLI.
Você pode limitar a migração a um subdiretório específico usando esta opção.

### `--best-effort-mode`

Por padrão, a migração ignora queries que não podem ser migradas com segurança.
A migração tenta refatorar o código da forma mais segura possível.

Quando a flag `--best-effort-mode` está habilitada, a migração tenta
migrar o máximo possível, mesmo que isso possa quebrar seu build.

### `--insert-todos`

Quando habilitada, a migração adicionará TODOs às queries que não puderam ser migradas.
Os TODOs incluirão o motivo pelo qual as queries foram ignoradas. Por exemplo:

```ts
// TODO: Skipped for migration because:
//  Your application code writes to the query. This prevents migration.
@ViewChild('ref') ref?: ElementRef;
```

### `--analysis-dir`

Em projetos grandes, você pode usar esta opção para reduzir a quantidade de arquivos sendo analisados.
Por padrão, a migração analisa todo o workspace, independentemente da opção `--path`, para
atualizar todas as referências afetadas por uma declaração de query sendo migrada.

Com esta opção, você pode limitar a análise a uma subpasta. Note que isso significa que quaisquer
referências fora deste diretório são silenciosamente ignoradas, potencialmente quebrando seu build.

## Extensão VSCode

![Screenshot da extensão VSCode e clicando em um campo `@ViewChild`](assets/images/migrations/signal-queries-vscode.png 'Screenshot da extensão VSCode e clicando em um campo `@ViewChild`.')

A migração está disponível como uma [code refactor action](https://code.visualstudio.com/docs/typescript/typescript-refactoring#_refactoring) no VSCode.

Para usar a migração via VSCode, instale a versão mais recente da extensão VSCode e clique:

- em um campo `@ViewChild`, `@ViewChildren`, `@ContentChild`, ou `@ContentChildren`.
- em uma directive/component

Em seguida, aguarde o botão de refatoração de lâmpada amarela do VSCode aparecer.
Através deste botão você pode então selecionar a migração de signal queries.
