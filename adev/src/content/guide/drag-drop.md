<!-- ia-translate: true -->
# Drag and drop

## Visão geral {#overview}

Esta página descreve as directives de drag and drop, que permitem criar rapidamente interfaces de drag and drop com os seguintes recursos:

- Dragging livre
- Criar uma lista de elementos draggable reordenáveis
- Transferir elementos draggable entre listas
- Animações de dragging
- Bloquear elementos draggable ao longo de um eixo ou elemento
- Adicionar drag handles customizados
- Adicionar previews durante o drag
- Adicionar drag placeholder customizado

Para a referência completa da API, consulte a [página de referência da API de drag and drop do Angular CDK](api#angular_cdk_drag-drop).

## Antes de começar {#before-you-start}

### Instalação do CDK {#cdk-installation}

O [Component Dev Kit (CDK)](https://material.angular.dev/cdk/categories) é um conjunto de primitivos de comportamento para construir components. Para usar as directives de drag and drop, primeiro instale `@angular/cdk` do npm. Você pode fazer isso no seu terminal usando o Angular CLI:

```shell
ng add @angular/cdk
```

### Importando drag and drop {#importing-drag-and-drop}

Para usar drag and drop, importe do pacote o que você precisa das directives no seu component.

```ts
import {Component} from '@angular/core';
import {CdkDrag} from '@angular/cdk/drag-drop';

@Component({
  selector: 'drag-drop-example',
  templateUrl: 'drag-drop-example.html',
  imports: [CdkDrag],
})
export class DragDropExample {}
```

## Criar elementos draggable {#create-draggable-elements}

Você pode tornar qualquer elemento draggable adicionando a directive `cdkDrag`. Por padrão, todos os elementos draggable suportam dragging livre.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/overview/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/overview/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/overview/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/overview/app/app.css"/>
</docs-code-multifile>

## Criar uma lista de elementos draggable reordenáveis {#create-a-list-of-reorderable-draggable-elements}

Adicione a directive `cdkDropList` a um elemento pai para agrupar elementos draggable em uma coleção reordenável. Isso define onde os elementos draggable podem ser soltos. Os elementos draggable no grupo da drop list se reorganizam automaticamente conforme um elemento se move.

As directives de drag and drop não atualizam seu modelo de dados. Para atualizar o modelo de dados, escute o evento `cdkDropListDropped` (assim que o usuário terminar de arrastar) e atualize o modelo de dados manualmente.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/sorting/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/sorting/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/sorting/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/sorting/app/app.css"/>
</docs-code-multifile>

Você pode usar o token de injeção `CDK_DROP_LIST`, que pode ser usado para referenciar instâncias de `cdkDropList`. Para mais informações, consulte o [guia de dependency injection](/guide/di) e a [API do token de injeção drop list](api/cdk/drag-drop/CDK_DROP_LIST).

## Transferir elementos draggable entre listas {#transfer-draggable-elements-between-lists}

A directive `cdkDropList` oferece suporte à transferência de elementos draggable entre drop lists conectadas. Há duas formas de conectar uma ou mais instâncias de `cdkDropList`:

- Definir a propriedade `cdkDropListConnectedTo` com outra drop list.
- Envolver os elementos em um elemento com o atributo `cdkDropListGroup`.

A propriedade `cdkDropListConnectedTo` funciona tanto com uma referência direta a outro `cdkDropList` quanto referenciando o id de outro drop container.

```html
<!-- Isto é válido -->
<div cdkDropList #listOne="cdkDropList" [cdkDropListConnectedTo]="[listTwo]"></div>
<div cdkDropList #listTwo="cdkDropList" [cdkDropListConnectedTo]="[listOne]"></div>

<!-- Isto também é válido -->
<div cdkDropList id="list-one" [cdkDropListConnectedTo]="['list-two']"></div>
<div cdkDropList id="list-two" [cdkDropListConnectedTo]="['list-one']"></div>
```

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/connected-sorting/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/connected-sorting/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/connected-sorting/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/connected-sorting/app/app.css"/>
</docs-code-multifile>

Use a directive `cdkDropListGroup` se você tiver um número desconhecido de drop lists conectadas e quiser configurar a conexão automaticamente. Qualquer novo `cdkDropList` adicionado sob um grupo se conecta automaticamente a todas as outras listas.

```angular-html
<div cdkDropListGroup>
  <!-- Todas as listas aqui serão conectadas. -->
  @for (list of lists; track list) {
    <div cdkDropList></div>
  }
</div>
```

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/connected-sorting-group/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/connected-sorting-group/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/connected-sorting-group/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/connected-sorting-group/app/app.css"/>
</docs-code-multifile>

Você pode usar o token de injeção `CDK_DROP_LIST_GROUP`, que pode ser usado para referenciar instâncias de `cdkDropListGroup`. Para mais informações, consulte o [guia de dependency injection](/guide/di) e a [API do token de injeção drop list group](api/cdk/drag-drop/CDK_DROP_LIST_GROUP).

### Dragging seletivo {#selective-dragging}

Por padrão, um usuário pode mover elementos `cdkDrag` de um container para outro container conectado. Para um controle mais refinado sobre quais elementos podem ser soltos em um container, use `cdkDropListEnterPredicate`. O Angular chama o predicate sempre que um elemento draggable entra em um novo container. Dependendo de o predicate retornar true ou false, o item pode ou não ser aceito no novo container.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/enter-predicate/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/enter-predicate/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/enter-predicate/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/enter-predicate/app/app.css"/>
</docs-code-multifile>

## Anexar dados {#attach-data}

Você pode associar dados arbitrários tanto a `cdkDrag` quanto a `cdkDropList`, definindo `cdkDragData` ou `cdkDropListData`, respectivamente. Você pode fazer binding aos eventos disparados por ambas as directives, que incluirão esses dados, permitindo identificar facilmente a origem da interação de drag ou drop.

```angular-html
@for (list of lists; track list) {
  <div cdkDropList [cdkDropListData]="list" (cdkDropListDropped)="drop($event)">
    @for (item of list; track item) {
      <div cdkDrag [cdkDragData]="item"></div>
    }
  </div>
}
```

## Customizações de dragging {#dragging-customizations}

### Customizar drag handle {#customize-drag-handle}

Por padrão, o usuário pode arrastar todo o elemento `cdkDrag` para movê-lo. Para restringir o usuário a fazer isso apenas por meio de um elemento handle, adicione a directive `cdkDragHandle` a um elemento dentro de `cdkDrag`. Você pode ter quantos elementos `cdkDragHandle` quiser.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/custom-handle/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/custom-handle/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/custom-handle/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/custom-handle/app/app.css"/>
</docs-code-multifile>

Você pode usar o token de injeção `CDK_DRAG_HANDLE`, que pode ser usado para referenciar instâncias de `cdkDragHandle`. Para mais informações, consulte o [guia de dependency injection](/guide/di) e a [API do token de injeção drag handle](api/cdk/drag-drop/CDK_DRAG_HANDLE).

### Customizar drag preview {#customize-drag-preview}

Um elemento preview fica visível quando um elemento `cdkDrag` está sendo arrastado. Por padrão, o preview é um clone do elemento original posicionado ao lado do cursor do usuário.

Para customizar o preview, forneça um template customizado via `*cdkDragPreview`. O preview customizado não terá o mesmo tamanho do elemento original arrastado, já que não se fazem suposições sobre o conteúdo do elemento. Para que o preview tenha o mesmo tamanho do elemento, passe true para o input `matchSize`.

O elemento clonado remove seu atributo id para evitar que haja múltiplos elementos com o mesmo id na página. Isso faz com que qualquer CSS que tenha como alvo esse id não seja aplicado.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/custom-preview/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/custom-preview/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/custom-preview/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/custom-preview/app/app.css"/>
</docs-code-multifile>

Você pode usar o token de injeção `CDK_DRAG_PREVIEW`, que pode ser usado para referenciar instâncias de `cdkDragPreview`. Para mais informações, consulte o [guia de dependency injection](/guide/di) e a [API do token de injeção drag preview](api/cdk/drag-drop/CDK_DRAG_PREVIEW).

### Customizar ponto de inserção do drag {#customize-drag-insertion-point}

Por padrão, o Angular insere o preview do `cdkDrag` no `<body>` da página para evitar problemas de posicionamento e overflow. Isso pode não ser desejável em alguns casos, porque o preview não terá os estilos herdados aplicados.

Você pode mudar onde o Angular insere o preview usando o input `cdkDragPreviewContainer` em `cdkDrag`. Os valores possíveis são:

| Valor                         | Descrição                                                                                      | Vantagens                                                                                                                    | Desvantagens                                                                                                                                                                |
| :---------------------------- | :--------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `global`                      | Valor padrão. O Angular insere o preview no <body> ou na shadow root mais próxima.             | O preview não será afetado por `z-index` ou `overflow: hidden`. Também não afetará seletores `:nth-child` nem layouts flex. | Não mantém os estilos herdados.                                                                                                                                             |
| `parent`                      | O Angular insere o preview dentro do pai do elemento que está sendo arrastado.                 | O preview herda os mesmos estilos do elemento arrastado.                                                                     | O preview pode ser cortado por `overflow: hidden` ou ficar sob outros elementos por causa de `z-index`. Além disso, pode afetar seletores `:nth-child` e alguns layouts flex. |
| `ElementRef` ou `HTMLElement` | O Angular insere o preview no elemento especificado.                                           | O preview herda os estilos do elemento container especificado.                                                               | O preview pode ser cortado por `overflow: hidden` ou ficar sob outros elementos por causa de `z-index`. Além disso, pode afetar seletores `:nth-child` e alguns layouts flex. |

Alternativamente, você pode modificar o token de injeção `CDK_DRAG_CONFIG` para atualizar `previewContainer` dentro da configuração, se o valor for `global` ou `parent`. Para mais informações, consulte o [guia de dependency injection](/guide/di), a [API do token de injeção drag config](api/cdk/drag-drop/CDK_DRAG_CONFIG) e a [API drag drop config](api/cdk/drag-drop/DragDropConfig).

### Customizar drag placeholder {#customize-drag-placeholder}

Enquanto um elemento `cdkDrag` está sendo arrastado, a directive cria um elemento placeholder que mostra onde o elemento será colocado quando for solto. Por padrão, o placeholder é um clone do elemento que está sendo arrastado. Você pode substituir o placeholder por um customizado usando a directive `*cdkDragPlaceholder`:

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/custom-placeholder/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/custom-placeholder/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/custom-placeholder/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/custom-placeholder/app/app.css"/>
</docs-code-multifile>

Você pode usar o token de injeção `CDK_DRAG_PLACEHOLDER`, que pode ser usado para referenciar instâncias de `cdkDragPlaceholder`. Para mais informações, consulte o [guia de dependency injection](/guide/di) e a [API do token de injeção drag placeholder](api/cdk/drag-drop/CDK_DRAG_PLACEHOLDER).

### Customizar drag root element {#customize-drag-root-element}

Defina o atributo `cdkDragRootElement` se houver um elemento que você quer tornar draggable, mas ao qual você não tem acesso direto.

O atributo aceita um selector e percorre o DOM até encontrar um elemento que corresponda ao selector. Se um elemento for encontrado, ele se torna draggable. Isso é útil em casos como tornar um dialog draggable.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/root-element/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/root-element/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/root-element/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/root-element/app/app.css"/>
</docs-code-multifile>

Alternativamente, você pode modificar o token de injeção `CDK_DRAG_CONFIG` para atualizar `rootElementSelector` dentro da configuração. Para mais informações, consulte o [guia de dependency injection](/guide/di), a [API do token de injeção drag config](api/cdk/drag-drop/CDK_DRAG_CONFIG) e a [API drag drop config](api/cdk/drag-drop/DragDropConfig).

### Definir posição DOM de um elemento draggable {#set-dom-position-of-a-draggable-element}

Por padrão, elementos `cdkDrag` que não estão em um `cdkDropList` só saem de sua posição DOM normal quando o usuário move o elemento manualmente. Use o input `cdkDragFreeDragPosition` para definir explicitamente a posição do elemento. Um caso de uso comum é restaurar a posição de um elemento draggable depois que o usuário navegou para outra página e então voltou.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/free-drag-position/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/free-drag-position/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/free-drag-position/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/free-drag-position/app/app.css"/>
</docs-code-multifile>

### Restringir movimento dentro de um elemento {#restrict-movement-within-an-element}

Para impedir que o usuário arraste um elemento `cdkDrag` para fora de outro elemento, passe um selector CSS para o atributo `cdkDragBoundary`. Este atributo aceita um selector e percorre o DOM até encontrar um elemento que corresponda a ele. Se uma correspondência for encontrada, o elemento se torna o limite para fora do qual o elemento draggable não pode ser arrastado. `cdkDragBoundary` também pode ser usado quando `cdkDrag` está colocado dentro de um `cdkDropList`.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/boundary/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/boundary/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/boundary/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/boundary/app/app.css"/>
</docs-code-multifile>

Alternativamente, você pode modificar o token de injeção `CDK_DRAG_CONFIG` para atualizar `boundaryElement` dentro da configuração. Para mais informações, consulte o [guia de dependency injection](/guide/di), a [API do token de injeção drag config](api/cdk/drag-drop/CDK_DRAG_CONFIG) e a [API drag drop config](api/cdk/drag-drop/DragDropConfig).

### Restringir movimento ao longo de um eixo {#restrict-movement-along-an-axis}

Por padrão, `cdkDrag` permite movimento livre em todas as direções. Para restringir o dragging a um eixo específico, defina `cdkDragLockAxis` como "x" ou "y" em `cdkDrag`. Para restringir o dragging de múltiplos elementos draggable dentro de um `cdkDropList`, defina `cdkDropListLockAxis` no próprio `cdkDropList`.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/axis-lock/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/axis-lock/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/axis-lock/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/axis-lock/app/app.css"/>
</docs-code-multifile>

Alternativamente, você pode modificar o token de injeção `CDK_DRAG_CONFIG` para atualizar `lockAxis` dentro da configuração. Para mais informações, consulte o [guia de dependency injection](/guide/di), a [API do token de injeção drag config](api/cdk/drag-drop/CDK_DRAG_CONFIG) e a [API drag drop config](api/cdk/drag-drop/DragDropConfig).

### Atrasar dragging {#delay-dragging}

Por padrão, quando o usuário pressiona o ponteiro sobre um `cdkDrag`, a sequência de dragging começa. Esse comportamento pode não ser desejável em casos como elementos draggable em tela cheia em dispositivos touch, onde o usuário pode acionar um evento de drag acidentalmente ao rolar a página.

Você pode atrasar a sequência de dragging usando o input `cdkDragStartDelay`. O input espera que o usuário mantenha o ponteiro pressionado pelo número de milissegundos especificado antes de arrastar o elemento.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/delay-drag/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/delay-drag/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/delay-drag/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/delay-drag/app/app.css"/>
</docs-code-multifile>

Alternativamente, você pode modificar o token de injeção `CDK_DRAG_CONFIG` para atualizar `dragStartDelay` dentro da configuração. Para mais informações, consulte o [guia de dependency injection](/guide/di), a [API do token de injeção drag config](api/cdk/drag-drop/CDK_DRAG_CONFIG) e a [API drag drop config](api/cdk/drag-drop/DragDropConfig).

### Desabilitar dragging {#disable-dragging}

Se você quiser desabilitar o dragging de um item de drag específico, defina o input `cdkDragDisabled` em um item `cdkDrag` como true ou false. Você pode desabilitar uma lista inteira usando o input `cdkDropListDisabled` em um `cdkDropList`. Também é possível desabilitar um handle específico por meio de `cdkDragHandleDisabled` em `cdkDragHandle`.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/disable-drag/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/disable-drag/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/disable-drag/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/disable-drag/app/app.css"/>
</docs-code-multifile>

Alternativamente, você pode modificar o token de injeção `CDK_DRAG_CONFIG` para atualizar `draggingDisabled` dentro da configuração. Para mais informações, consulte o [guia de dependency injection](/guide/di), a [API do token de injeção drag config](api/cdk/drag-drop/CDK_DRAG_CONFIG) e a [API drag drop config](api/cdk/drag-drop/DragDropConfig).

## Customizações de sorting {#sorting-customizations}

### Orientação de lista {#list-orientation}

Por padrão, a directive `cdkDropList` assume que as listas são verticais. Isso pode ser alterado definindo a propriedade `cdkDropListOrientation` como horizontal.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/horizontal-sorting/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/horizontal-sorting/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/horizontal-sorting/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/horizontal-sorting/app/app.css"/>
</docs-code-multifile>

Alternativamente, você pode modificar o token de injeção `CDK_DRAG_CONFIG` para atualizar `listOrientation` dentro da configuração. Para mais informações, consulte o [guia de dependency injection](/guide/di), a [API do token de injeção drag config](api/cdk/drag-drop/CDK_DRAG_CONFIG) e a [API drag drop config](api/cdk/drag-drop/DragDropConfig).

### Quebra de linhas da lista {#list-wrapping}

Por padrão, o `cdkDropList` ordena os elementos draggable movendo-os com uma transform CSS. Isso permite animar a ordenação, o que proporciona uma experiência melhor para o usuário. No entanto, a drop list passa a funcionar em apenas uma direção: vertical ou horizontal.

Se você tiver uma lista ordenável que precisa quebrar em novas linhas, pode definir o atributo `cdkDropListOrientation` como `mixed`. Isso faz com que a lista use outra estratégia de ordenação, que consiste em mover os elementos no DOM. No entanto, a lista não consegue mais animar a ação de ordenação.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/mixed-sorting/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/mixed-sorting/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/mixed-sorting/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/mixed-sorting/app/app.css"/>
</docs-code-multifile>

### Sorting seletivo {#selective-sorting}

Por padrão, elementos `cdkDrag` são ordenados em qualquer posição dentro de um `cdkDropList`. Para mudar esse comportamento, defina o atributo `cdkDropListSortPredicate`, que recebe uma função. A função predicate é chamada sempre que um elemento draggable está prestes a ser movido para um novo índice dentro da drop list. Se o predicate retornar true, o item será movido para o novo índice; caso contrário, manterá sua posição atual.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/sort-predicate/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/sort-predicate/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/sort-predicate/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/sort-predicate/app/app.css"/>
</docs-code-multifile>

### Desabilitar sorting {#disable-sorting}

Há casos em que elementos draggable podem ser arrastados de um `cdkDropList` para outro, mas o usuário não deveria poder ordená-los dentro da lista de origem. Para esses casos, adicione o atributo `cdkDropListSortingDisabled` para impedir que os elementos draggable de um `cdkDropList` sejam ordenados. Isso preserva a posição inicial do elemento arrastado na lista de origem se ele não for arrastado para uma nova posição válida.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/disable-sorting/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/disable-sorting/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/disable-sorting/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/disable-sorting/app/app.css"/>
</docs-code-multifile>

Alternativamente, você pode modificar o token de injeção `CDK_DRAG_CONFIG` para atualizar `sortingDisabled` dentro da configuração. Para mais informações, consulte o [guia de dependency injection](/guide/di), a [API do token de injeção drag config](api/cdk/drag-drop/CDK_DRAG_CONFIG) e a [API drag drop config](api/cdk/drag-drop/DragDropConfig).

### Copiar itens entre listas {#copying-items-between-lists}

Por padrão, quando um item é arrastado de uma lista para outra, ele é movido para fora da lista original. No entanto, você pode configurar as directives para copiar o item, deixando o item original na lista de origem.

Para habilitar a cópia, você pode definir o input `cdkDropListHasAnchor`. Isso faz com que o `cdkDropList` crie um elemento "anchor" que permanece no container original e não se move com o item. Se o usuário mover o item de volta para o container original, o anchor é removido automaticamente. O elemento anchor pode ser estilizado visando a classe CSS `.cdk-drag-anchor`.

Combinar `cdkDropListHasAnchor` com `cdkDropListSortingDisabled` torna possível construir uma lista da qual o usuário pode copiar itens sem poder reordenar a lista de origem (por exemplo, uma lista de produtos e um carrinho de compras).

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/copy-list/app/app.ts">
  <docs-code header="app.html" path="adev/src/content/examples/drag-drop/src/copy-list/app/app.html"/>
  <docs-code header="app.ts" path="adev/src/content/examples/drag-drop/src/copy-list/app/app.ts"/>
  <docs-code header="app.css" path="adev/src/content/examples/drag-drop/src/copy-list/app/app.css"/>
</docs-code-multifile>

## Customizar animações {#customize-animations}

Drag and drop oferece suporte a animações para:

- Ordenar um elemento draggable dentro de uma lista
- Mover o elemento draggable da posição em que o usuário o soltou até a posição final dentro da lista

Para configurar suas animações, defina uma transição CSS que tenha como alvo a propriedade transform. As seguintes classes podem ser usadas para animações:

| Nome da classe CSS  | Resultado de adicionar transition                                                                                                                                                                                                    |
| :------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| .cdk-drag           | Anima elementos draggable conforme eles são ordenados.                                                                                                                                                                               |
| .cdk-drag-animating | Anima o elemento draggable da sua posição solta até a posição final dentro do `cdkDropList`.<br><br>Esta classe CSS é aplicada a um elemento `cdkDrag` somente quando a ação de dragging foi interrompida.                           |

## Estilização {#styling}

Tanto a directive `cdkDrag` quanto a `cdkDropList` aplicam apenas os estilos essenciais necessários para o funcionamento. As aplicações podem customizar seus estilos visando essas classes CSS especificadas.

| Nome da classe CSS       | Descrição                                                                                                                                                                                                                                                                                                        |
| :----------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| .cdk-drop-list           | Selector para os elementos container `cdkDropList`.                                                                                                                                                                                                                                                              |
| .cdk-drag                | Selector para elementos `cdkDrag`.                                                                                                                                                                                                                                                                               |
| .cdk-drag-disabled       | Selector para elementos `cdkDrag` desabilitados.                                                                                                                                                                                                                                                                 |
| .cdk-drag-handle         | Selector para o elemento host do `cdkDragHandle`.                                                                                                                                                                                                                                                                |
| .cdk-drag-preview        | Selector para o elemento de drag preview. Este é o elemento que aparece ao lado do cursor conforme um usuário arrasta um elemento em uma lista ordenável.<br><br>O elemento tem exatamente a aparência do elemento que está sendo arrastado, a menos que seja customizado com um template próprio via `*cdkDragPreview`. |
| .cdk-drag-placeholder    | Selector para o elemento de drag placeholder. Este é o elemento exibido no local para onde o elemento draggable será movido quando a ação de dragging terminar.<br><br>Este elemento tem exatamente a aparência do elemento que está sendo ordenado, a menos que seja customizado com a directive `cdkDragPlaceholder`. |
| .cdk-drop-list-dragging  | Selector para o elemento container `cdkDropList` que tem um elemento draggable sendo arrastado no momento.                                                                                                                                                                                                       |
| .cdk-drop-list-disabled  | Selector para os elementos container `cdkDropList` que estão desabilitados.                                                                                                                                                                                                                                      |
| .cdk-drop-list-receiving | Selector para o elemento container `cdkDropList` que tem um elemento draggable que pode receber de uma drop list conectada que está sendo arrastada no momento.                                                                                                                                                  |
| .cdk-drag-anchor         | Selector para o elemento anchor criado quando `cdkDropListHasAnchor` está habilitado. Este elemento indica a posição de onde o item arrastado começou.                                                                                                                                                           |

## Dragging em um container com scroll {#dragging-in-a-scrollable-container}

Se seus itens draggable estiverem dentro de um container com scroll (por exemplo, uma `div` com `overflow: auto`), o scroll automático não funcionará, a menos que o container com scroll tenha a directive `cdkScrollable`. Sem ela, o CDK não consegue detectar nem controlar o comportamento de scroll do container durante as operações de drag.

## Integrações com outros components {#integrations-with-other-components}

A funcionalidade de drag-and-drop do CDK pode ser integrada a diferentes components. Casos de uso comuns incluem components `MatTable` ordenáveis e components `MatTabGroup` ordenáveis.
