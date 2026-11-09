<!-- ia-translate: true -->
# Migração para a sintaxe de Control Flow

A [sintaxe de Control Flow](guide/templates/control-flow) está disponível a partir do Angular v17. A nova sintaxe é integrada ao template, então você não precisa mais importar o `CommonModule`.

Este schematic migra todo o código existente em sua aplicação para usar a nova sintaxe de Control Flow.

Execute o schematic usando o seguinte comando:

```shell
ng generate @angular/core:control-flow
```

## Opções de configuração {#configuration-options}

A migração oferece algumas opções para ajustar a migração às suas necessidades específicas.

### `--path` {#--path}

Por padrão, a migração atualizará todo o seu workspace do Angular CLI.
Você pode limitar a migração a um subdiretório específico usando esta opção.

### `--format` {#--format}

Por padrão, a migração reformata os templates que ela altera.
Desative esta opção para manter a formatação existente dos seus templates.

## Mudanças que quebram compatibilidade {#breaking-changes}

### Reutilização de view em `@for` {#for-view-reuse}

Se uma propriedade usada na expressão `track` de um bloco `@for` mudar, mas a referência do objeto permanecer a mesma (modificação in-place), o Angular atualiza os bindings da view (incluindo inputs de components) em vez de destruir e recriar o elemento.

Isso difere de `*ngFor`, que executaria uma remontagem (destruir e recriar) do elemento em um cenário semelhante se a função `trackBy` retornasse um valor diferente.
