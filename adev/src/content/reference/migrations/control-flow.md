<!-- ia-translate: true -->
# Migração para a sintaxe de Control Flow

A [sintaxe de Control Flow](guide/templates/control-flow) está disponível a partir do Angular v17. A nova sintaxe é integrada ao template, então você não precisa mais importar o `CommonModule`.

Este schematic migra todo o código existente em sua aplicação para usar a nova sintaxe de Control Flow.

Execute o schematic usando o seguinte comando:

```shell
ng generate @angular/core:control-flow
```

## Configuration options

The migration supports a few options for fine tuning the migration to your specific needs.

### `--path`

By default, the migration will update your whole Angular CLI workspace.
You can limit the migration to a specific sub-directory using this option.

### `--format`

By default, the migration reformats the templates it touches.
Disable this option to keep your existing template formatting.

## Breaking changes

### `@for` view reuse

If a property used in the `track` expression of a `@for` block changes but the object reference remains the same (in-place modification), Angular updates the view's bindings (including component inputs) instead of destroying and recreating the element.

This differs from `*ngFor`, which would execute a remount (destroy and recreate) of the element in a similar scenario if the `trackBy` function returned a different value.
