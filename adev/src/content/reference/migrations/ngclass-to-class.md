<!-- ia-translate: true -->
# Migration de NgClass para class bindings

Este schematic migra usos da directive NgClass para class bindings em sua aplicação.
Ele migrará apenas os usos que são considerados seguros para migração.

Execute o schematic usando o seguinte comando:

```bash
ng generate @angular/core:ngclass-to-class
```

#### Antes

```html
<div [ngClass]="{admin: isAdmin, dense: density === 'high'}">
```

#### Depois

```html
<div [class]="{admin: isAdmin, dense: density === 'high'}">
```

## Opções de configuração

A migration suporta algumas opções para ajustar a migration às suas necessidades específicas.

### `--migrate-space-separated-key`

Por padrão, a migration evita migrar usos de `NgClass` nos quais as chaves de object literals contêm nomes de classes separados por espaço.
Quando a flag --migrate-space-separated-key está habilitada, um binding é criado para cada chave individual.

```html
<div [ngClass]="{'class1 class2': condition}"></div>
```

para

```html
<div [class.class1]="condition" [class.class2]="condition"></div>
```
