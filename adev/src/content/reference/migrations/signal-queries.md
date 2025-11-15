<!-- ia-translate: true -->
# Migração para signal queries

O Angular introduziu APIs aprimoradas para queries que são consideradas
prontas para produção a partir da v19.
Leia mais sobre signal queries e seus benefícios no [guia dedicado](guide/signals/queries).

Para dar suporte a equipes existentes que gostariam de usar signal queries, o time do Angular
fornece uma migração automatizada que converte campos de query decorados existentes para a nova API.

Execute o schematic usando o seguinte comando:

```bash
ng generate @angular/core:signal-queries-migration
```

Alternativamente, a migração está disponível como uma [ação de refatoração de código](https://code.visualstudio.com/docs/typescript/typescript-refactoring#_refactoring) no VSCode.
Instale a versão mais recente da extensão do VSCode e clique em, por exemplo, um campo `@ViewChild`.
Veja mais detalhes na seção [abaixo](#vscode-extension).

## O que a migração modifica?

1. Membros de classe `@ViewChild()`, `@ViewChildren`, `@ContentChild` e `@ContentChildren`
   são atualizados para seus equivalentes de signal.
2. Referências em sua aplicação a queries migradas são atualizadas para chamar o signal.
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

Por padrão, a migração atualizará todo o seu workspace do Angular CLI.
Você pode limitar a migração a um subdiretório específico usando esta opção.

### `--best-effort-mode`

Por padrão, a migração pula queries que não podem ser migradas com segurança.
A migração tenta refatorar o código da forma mais segura possível.

Quando a flag `--best-effort-mode` está habilitada, a migração tenta
migrar o máximo possível, mesmo que possa quebrar sua build.

### `--insert-todos`

Quando habilitada, a migração adicionará TODOs às queries que não puderam ser migradas.
Os TODOs incluirão o motivo pelo qual as queries foram puladas. Por exemplo:

```ts
// TODO: Skipped for migration because:
//  Your application code writes to the query. This prevents migration.
@ViewChild('ref') ref?: ElementRef;
```

### `--analysis-dir`

Em projetos grandes, você pode usar esta opção para reduzir a quantidade de arquivos sendo analisados.
Por padrão, a migração analisa todo o workspace, independentemente da opção `--path`, a
fim de atualizar todas as referências afetadas por uma declaração de query sendo migrada.

Com esta opção, você pode limitar a análise a uma subpasta. Note que isso significa que qualquer
referência fora deste diretório será silenciosamente pulada, potencialmente quebrando sua build.

## Extensão do VSCode

![Screenshot da extensão do VSCode e clicando em um campo `@ViewChild`](assets/images/migrations/signal-queries-vscode.png 'Screenshot da extensão do VSCode e clicando em um campo `@ViewChild`.')

A migração está disponível como uma [ação de refatoração de código](https://code.visualstudio.com/docs/typescript/typescript-refactoring#_refactoring) no VSCode.

Para usar a migração via VSCode, instale a versão mais recente da extensão do VSCode e clique em:

- um campo `@ViewChild`, `@ViewChildren`, `@ContentChild`, ou `@ContentChildren`.
- uma diretiva/component

Em seguida, aguarde o botão amarelo de refatoração do VSCode (lâmpada) aparecer.
Através deste botão você pode então selecionar a migração de signal queries.
