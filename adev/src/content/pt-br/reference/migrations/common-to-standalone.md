<!-- ia-translate: true -->
# Converter o uso de CommonModule para imports standalone

Esta migração ajuda projetos a removerem imports do `CommonModule` dentro de components adicionando o conjunto mínimo de imports de diretivas e pipes que cada template requer (por exemplo, `NgIf`, `NgFor`, `AsyncPipe`, etc.).

Execute o schematic usando o seguinte comando:

<docs-code language="shell">

ng generate @angular/core:common-to-standalone

</docs-code>

## Opções

| Opção  | Detalhes                                                                                                                                       |
| :----- | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| `path` | O caminho (relativo à raiz do projeto) para migrar. O padrão é `./`. Use isso para migrar incrementalmente um subconjunto do seu projeto. |

## Exemplo

Antes:

```angular-ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="show">
      {{ data | async | json }}
    </div>
  `
})
export class ExampleComponent {
  show = true;
  data = Promise.resolve({ message: 'Hello' });
}
```

Após executar a migração (imports do component adicionados, CommonModule removido):

```angular-ts
import { Component } from '@angular/core';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [AsyncPipe, JsonPipe, NgIf],
  template: `
    <div *ngIf="show">
      {{ data | async | json }}
    </div>
  `
})
export class ExampleComponent {
  show = true;
  data = Promise.resolve({ message: 'Hello' });
}
```
