<!-- ia-translate: true -->
# Converter uso do CommonModule para imports standalone

Esta migração ajuda projetos a remover imports do `CommonModule` dentro de components adicionando o conjunto mínimo de imports de diretivas e pipes que cada template requer (por exemplo, `NgIf`, `NgFor`, `AsyncPipe`, etc.).

Execute o schematic usando o seguinte comando:

```shell
ng generate @angular/core:common-to-standalone
```

## Opções

| Opção  | Detalhes                                                                                                                        |
| :----- | :------------------------------------------------------------------------------------------------------------------------------ |
| `path` | O caminho (relativo à raiz do projeto) a ser migrado. O padrão é `./`. Use isto para migrar incrementalmente um subconjunto do seu projeto. |

## Exemplo

Antes:

```angular-ts
import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-example',
  imports: [CommonModule],
  template: `
    <div *ngIf="show">
      {{ data | async | json }}
    </div>
  `,
})
export class Example {
  show = true;
  data = Promise.resolve({message: 'Hello'});
}
```

Depois de executar a migração (imports do component adicionados, CommonModule removido):

```angular-ts
import {Component} from '@angular/core';
import {AsyncPipe, JsonPipe, NgIf} from '@angular/common';

@Component({
  selector: 'app-example',
  imports: [AsyncPipe, JsonPipe, NgIf],
  template: `
    <div *ngIf="show">
      {{ data | async | json }}
    </div>
  `,
})
export class Example {
  show = true;
  data = Promise.resolve({message: 'Hello'});
}
```
