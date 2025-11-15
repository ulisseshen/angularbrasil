<!-- ia-translate: true -->
# Migration de NgStyle para style bindings

Este schematic migra usos da directive NgStyle para style bindings em sua aplicação.
Ele migrará apenas os usos que são considerados seguros para migração.

Execute o schematic usando o seguinte comando:

```bash
ng generate @angular/core:ngstyle-to-style
```

#### Antes

```html
<div [ngStyle]="{'background-color': 'red'}">
```

#### Depois

```html
<div [style]="{'background-color': 'red'}">
```

## Opções de configuração

A migration suporta algumas opções para ajustar a migration às suas necessidades específicas.

### `--best-effort-mode`

Por padrão, a migration evita migrar usos de referências de object do `NgStyle`
Quando a flag `--best-effort-mode` está habilitada, instâncias de `ngStyle` vinculadas a referências de object também são migradas.
Isso pode não ser seguro para migração, por exemplo, se o object vinculado for mutado.

```html
<div [ngStyle]="styleObject"></div>
```

para

```html
<div [style]="styleObject"></div>
```
