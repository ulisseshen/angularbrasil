<!-- ia-translate: true -->
# Migração para a função output

O Angular introduziu uma API aprimorada para outputs na v17.3 que é considerada
pronta para produção a partir da v19. Esta API imita a API `input()` mas não é baseada em Signals.
Leia mais sobre a função output de eventos customizados e seus benefícios no [guia dedicado](guide/components/outputs).

Para dar suporte a projetos existentes que gostariam de usar a função output, o time do Angular
fornece uma migração automatizada que converte eventos customizados `@Output` para a nova API `output()`.

Execute o schematic usando o seguinte comando:

```bash
ng generate @angular/core:output-migration
```

## O que a migração modifica?

1. Membros de classe `@Output()` são atualizados para seu equivalente `output()`.
2. Imports no arquivo de components ou diretivas, no nível de módulo TypeScript, também são atualizados.
3. Migra as funções de API como `event.next()`, cujo uso não é recomendado, para `event.emit()` e remove chamadas `event.complete()`.

**Antes**

```typescript
import {Component, Output, EventEmitter} from '@angular/core';

@Component({
  template: `<button (click)="someMethod('test')">emit</button>`
})
export class MyComponent {
  @Output() someChange = new EventEmitter<string>();

  someMethod(value: string): void {
    this.someChange.emit(value);
  }
}
```

**Depois**

```typescript
import {Component, output} from '@angular/core';

@Component({
  template: `<button (click)="someMethod('test')">emit</button>`
})
export class MyComponent {
  readonly someChange = output<string>();

  someMethod(value: string): void {
    this.someChange.emit(value);
  }
}
```

## Opções de configuração

A migração suporta algumas opções para ajustar a migração às suas necessidades específicas.

### `--path`

Se não especificado, a migração perguntará por um caminho e atualizará todo o seu workspace do Angular CLI.
Você pode limitar a migração a um subdiretório específico usando esta opção.

### `--analysis-dir`

Em projetos grandes, você pode usar esta opção para reduzir a quantidade de arquivos sendo analisados.
Por padrão, a migração analisa todo o workspace, independentemente da opção `--path`, a
fim de atualizar todas as referências afetadas por uma migração de `@Output()`.

Com esta opção, você pode limitar a análise a uma subpasta. Note que isso significa que qualquer
referência fora deste diretório será silenciosamente pulada, potencialmente quebrando sua build.

Use estas opções como mostrado abaixo:

```bash
ng generate @angular/core:output-migration --path src/app/sub-folder
```

## Exceções

Em alguns casos, a migração não tocará o código.
Uma dessas exceções é o caso onde o evento é usado com um método `pipe()`.
O seguinte código não será migrado:

```typescript
export class MyDialogComponent {
  @Output() close = new EventEmitter<void>();
  doSome(): void {
    this.close.complete();
  }
  otherThing(): void {
    this.close.pipe();
  }
}
```
