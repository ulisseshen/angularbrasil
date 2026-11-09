<!-- ia-translate: true -->
# Migração de NgStyle para style bindings

Este schematic migra usos da directive NgStyle para style bindings em sua aplicação.
Ele migrará apenas os usos que são considerados seguros para migração.

Execute o schematic usando o seguinte comando:

```bash
ng generate @angular/core:ngstyle-to-style
```

Um objeto com uma única chave se torna um binding para essa única propriedade de estilo.

#### Antes {#before}

```html
<div [ngStyle]="{'background-color': 'red'}"></div>
```

#### Depois {#after}

```html
<div [style.background-color]="'red'"></div>
```

Um objeto com mais de uma chave se torna um único binding `[style]`.

#### Antes {#multiple-keys-before}

```html
<div [ngStyle]="{'color': 'blue', 'font-weight': 'bold'}"></div>
```

#### Depois {#multiple-keys-after}

```html
<div [style]="{'color': 'blue', 'font-weight': 'bold'}"></div>
```

## Opções de configuração {#configuration-options}

A migração oferece algumas opções para ajustar a migração às suas necessidades específicas.

### `--best-effort-mode`

Por padrão, a migração evita migrar usos de `NgStyle` que referenciam objetos.
Quando a flag `--best-effort-mode` está habilitada, instâncias de `ngStyle` vinculadas a referências de objetos também são migradas.
Isso pode não ser seguro, por exemplo, se o objeto vinculado for mutado.

```html
<div [ngStyle]="styleObject"></div>
```

para

```html
<div [style]="styleObject"></div>
```
