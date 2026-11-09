<!-- ia-translate: true -->

# Migração para signal inputs

O Angular introduziu uma API aprimorada para inputs que é considerada
pronta para produção a partir da v19.
Leia mais sobre signal inputs e seus benefícios no [guia dedicado](guide/components/inputs).

Para dar suporte a equipes existentes que gostariam de usar signal inputs, o time do Angular
fornece uma migração automatizada que converte campos `@Input` para a nova API `input()`.

Execute o schematic usando o seguinte comando:

```bash
ng generate @angular/core:signal-input-migration
```

Alternativamente, a migração está disponível como uma [ação de refatoração de código](https://code.visualstudio.com/docs/typescript/typescript-refactoring#_refactoring) no VSCode.
Instale a versão mais recente da extensão do VSCode e clique em um campo `@Input`.
Veja mais detalhes na seção [abaixo](#vscode-extension).

## O que a migração altera? {#what-does-the-migration-change}

1. Membros de classe `@Input()` são atualizados para seu equivalente `input()` de signal.
2. Referências a inputs migrados são atualizadas para chamar o signal.
   - Isso inclui referências em templates, host bindings ou código TypeScript.

**Antes**

```angular-ts
import {Component, Input} from '@angular/core';

@Component({
  template: `Name: {{ name ?? '' }}`,
})
export class MyComponent {
  @Input() name: string | undefined = undefined;

  someMethod(): number {
    if (this.name) {
      return this.name.length;
    }
    return -1;
  }
}
```

**Depois**

```angular-ts {highlight: [[4],[7], [10,12]]}
import {Component, input} from '@angular/core';

@Component({
  template: `Name: {{ name() ?? '' }}`,
})
export class MyComponent {
  readonly name = input<string>();

  someMethod(): number {
    const name = this.name();
    if (name) {
      return name.length;
    }
    return -1;
  }
}
```

## Opções de configuração {#configuration-options}

A migração oferece algumas opções para ajustar a migração às suas necessidades específicas.

### `--path`

Por padrão, a migração atualizará todo o seu workspace do Angular CLI.
Você pode limitar a migração a um subdiretório específico usando esta opção.

### `--best-effort-mode`

Por padrão, a migração ignora inputs que não podem ser migrados com segurança.
A migração tenta refatorar o código da forma mais segura possível.

Quando a flag `--best-effort-mode` está habilitada, a migração tenta
migrar o máximo possível, mesmo que isso possa quebrar sua build.

### `--insert-todos`

Quando habilitada, a migração adicionará TODOs aos inputs que não puderam ser migrados.
Os TODOs incluirão o motivo pelo qual os inputs foram ignorados. Por exemplo:

```ts
// TODO: Skipped for migration because:
//  Your application code writes to the input. This prevents migration.
@Input() myInput = false;
```

### `--analysis-dir`

Em projetos grandes, você pode usar esta opção para reduzir a quantidade de arquivos sendo analisados.
Por padrão, a migração analisa todo o workspace, independentemente da opção `--path`, a
fim de atualizar todas as referências afetadas por uma migração de `@Input()`.

Com esta opção, você pode limitar a análise a uma subpasta. Observe que isso significa que qualquer
referência fora deste diretório será silenciosamente ignorada, potencialmente quebrando sua build.

## Extensão do VSCode {#vscode-extension}

![Captura de tela da extensão do VSCode e clicando em um campo `@Input`](assets/images/migrations/signal-inputs-vscode.png 'Captura de tela da extensão do VSCode e clicando em um campo `@Input`.')

A migração está disponível como uma [ação de refatoração de código](https://code.visualstudio.com/docs/typescript/typescript-refactoring#_refactoring) no VSCode.

Para usar a migração via VSCode, instale a versão mais recente da extensão do VSCode e clique em:

- um campo `@Input`.
- ou, em uma diretiva/component

Em seguida, aguarde o botão amarelo de refatoração do VSCode (lâmpada) aparecer.
Através deste botão você pode então selecionar a migração de signal input.
