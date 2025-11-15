<!-- ia-translate: true -->
# Drag and drop

## Visão geral

Esta página descreve as directives de drag and drop que permitem criar rapidamente interfaces de drag and drop com os seguintes recursos:

- Dragging livre
- Criar uma lista de elementos draggable reordenáveis
- Transferir elementos draggable entre listas
- Animações de dragging
- Bloquear elementos draggable ao longo de um eixo ou elemento
- Adicionar drag handles customizados
- Adicionar previews durante o drag
- Adicionar drag placeholder customizado

Para a referência completa da API, consulte a [página de referência da API de drag and drop do Angular CDK](api#angular_cdk_drag-drop).

## Antes de começar

### Instalação do CDK

O [Component Dev Kit (CDK)](https://material.angular.dev/cdk/categories) é um conjunto de primitivos de comportamento para construir components. Para usar as directives de drag and drop, primeiro instale `@angular/cdk` do npm. Você pode fazer isso do seu terminal usando Angular CLI:

<docs-code language="shell">
  ng add @angular/cdk
</docs-code>

### Importando drag and drop

Para usar drag and drop, importe o que você precisa das directives no seu component.

<docs-code language="typescript">
import {Component} from '@angular/core';
import {CdkDrag} from '@angular/cdk/drag-drop';

@Component({
selector: 'my-custom-component',
templateUrl: 'my-custom-component.html',
imports: [CdkDrag],
})
export class DragDropExample {}
</docs-code>

## Criar elementos draggable

Você pode tornar qualquer elemento draggable adicionando a directive `cdkDrag`. Por padrão, todos os elementos draggable suportam dragging livre.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/overview/app/app.component.ts">
  <docs-code header="app/app.component.html" path="adev/src/content/examples/drag-drop/src/overview/app/app.component.html"/>
  <docs-code header="app/app.component.ts" path="adev/src/content/examples/drag-drop/src/overview/app/app.component.ts"/>
  <docs-code header="app/app.component.css" path="adev/src/content/examples/drag-drop/src/overview/app/app.component.css"/>
</docs-code-multifile>

## Criar uma lista de elementos draggable reordenáveis

Adicione a directive `cdkDropList` a um elemento pai para agrupar elementos draggable em uma coleção reordenável. Isso define onde elementos draggable podem ser soltos. Os elementos draggable no grupo de drop list se reorganizam automaticamente conforme um elemento se move.

As directives de drag and drop não atualizam seu modelo de dados. Para atualizar o modelo de dados, escute o evento `cdkDropListDropped` (assim que o usuário terminar de arrastar) e atualize o modelo de dados manualmente.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/sorting/app/app.component.ts">
  <docs-code header="app/app.component.html" path="adev/src/content/examples/drag-drop/src/sorting/app/app.component.html"/>
  <docs-code header="app/app.component.ts" path="adev/src/content/examples/drag-drop/src/sorting/app/app.component.ts"/>
  <docs-code header="app/app.component.css" path="adev/src/content/examples/drag-drop/src/sorting/app/app.component.css"/>
</docs-code-multifile>

Você pode usar o token de injeção `CDK_DROP_LIST` que pode ser usado para referenciar instâncias de `cdkDropList`. Para mais informações, consulte o [guia de dependency injection](https://angular.dev/guide/di) e a [API do token de injeção drop list](api/cdk/drag-drop/CDK_DROP_LIST).

## Transferir elementos draggable entre listas

A directive `cdkDropList` suporta transferir elementos draggable entre drop lists conectadas. Existem duas formas de conectar uma ou mais instâncias de `cdkDropList`:

- Definir a propriedade `cdkDropListConnectedTo` para outra drop list.
- Envolver os elementos em um elemento com o atributo `cdkDropListGroup`.

A directive `cdkDropListConnectedTo` funciona tanto com uma referência direta a outro `cdkDropList` quanto referenciando o id de outro drop container.

<docs-code language="html">
<!-- Isto é válido -->
<div cdkDropList #listOne="cdkDropList" [cdkDropListConnectedTo]="[listTwo]"></div>
<div cdkDropList #listTwo="cdkDropList" [cdkDropListConnectedTo]="[listOne]"></div>

<!-- Isto também é válido -->
<div cdkDropList id="list-one" [cdkDropListConnectedTo]="['list-two']"></div>
<div cdkDropList id="list-two" [cdkDropListConnectedTo]="['list-one']"></div>
</docs-code>

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/connected-sorting/app/app.component.ts">
  <docs-code header="app/app.component.html" path="adev/src/content/examples/drag-drop/src/connected-sorting/app/app.component.html"/>
  <docs-code header="app/app.component.ts" path="adev/src/content/examples/drag-drop/src/connected-sorting/app/app.component.ts"/>
  <docs-code header="app/app.component.css" path="adev/src/content/examples/drag-drop/src/connected-sorting/app/app.component.css"/>
</docs-code-multifile>

Use a directive `cdkDropListGroup` se você tiver um número desconhecido de drop lists conectadas para configurar a conexão automaticamente. Qualquer novo `cdkDropList` que for adicionado sob um grupo conecta-se automaticamente a todas as outras listas.

<docs-code language="html">
<div cdkDropListGroup>
  <!-- Todas as listas aqui serão conectadas. -->
  @for (list of lists; track list) {
    <div cdkDropList></div>
  }
</div>
</docs-code>

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/connected-sorting-group/app/app.component.ts">
  <docs-code header="app/app.component.html" path="adev/src/content/examples/drag-drop/src/connected-sorting-group/app/app.component.html"/>
  <docs-code header="app/app.component.ts" path="adev/src/content/examples/drag-drop/src/connected-sorting-group/app/app.component.ts"/>
  <docs-code header="app/app.component.css" path="adev/src/content/examples/drag-drop/src/connected-sorting-group/app/app.component.css"/>
</docs-code-multifile>

Você pode usar o token de injeção `CDK_DROP_LIST_GROUP` que pode ser usado para referenciar instâncias de `cdkDropListGroup`. Para mais informações, consulte o [guia de dependency injection](https://angular.dev/guide/di) e a [API do token de injeção drop list group](api/cdk/drag-drop/CDK_DROP_LIST_GROUP).

### Dragging seletivo

Por padrão, um usuário pode mover elementos `cdkDrag` de um container para outro container conectado. Para controle mais refinado sobre quais elementos podem ser soltos em um container, use `cdkDropListEnterPredicate`. O Angular chama o predicate sempre que um elemento draggable entra em um novo container. Dependendo se o predicate retorna true ou false, o item pode ou não ser permitido no novo container.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/enter-predicate/app/app.component.ts">
  <docs-code header="app/app.component.html" path="adev/src/content/examples/drag-drop/src/enter-predicate/app/app.component.html"/>
  <docs-code header="app/app.component.ts" path="adev/src/content/examples/drag-drop/src/enter-predicate/app/app.component.ts"/>
  <docs-code header="app/app.component.css" path="adev/src/content/examples/drag-drop/src/enter-predicate/app/app.component.css"/>
</docs-code-multifile>

## Anexar dados

Você pode associar alguns dados arbitrários tanto com `cdkDrag` quanto com `cdkDropList` definindo `cdkDragData` ou `cdkDropListData`, respectivamente. Você pode fazer binding aos eventos disparados de ambas as directives que incluirão esses dados, permitindo que você identifique facilmente a origem da interação de drag ou drop.

<docs-code language="html">
@for (list of lists; track list) {
  <div cdkDropList [cdkDropListData]="list" (cdkDropListDropped)="drop($event)">
    @for (item of list; track item) {
      <div cdkDrag [cdkDragData]="item"></div>
    }
  </div>
}
</docs-code>

## Customizações de dragging

### Customizar drag handle

Por padrão, o usuário pode arrastar todo o elemento `cdkDrag` para movê-lo. Para restringir o usuário a poder fazer isso apenas usando um elemento handle, adicione a directive `cdkDragHandle` a um elemento dentro de `cdkDrag`. Você pode ter quantos elementos `cdkDragHandle` você quiser.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/custom-handle/app/app.component.ts">
  <docs-code header="app/app.component.html" path="adev/src/content/examples/drag-drop/src/custom-handle/app/app.component.html"/>
  <docs-code header="app/app.component.ts" path="adev/src/content/examples/drag-drop/src/custom-handle/app/app.component.ts"/>
  <docs-code header="app/app.component.css" path="adev/src/content/examples/drag-drop/src/custom-handle/app/app.component.css"/>
</docs-code-multifile>

Você pode usar o token de injeção `CDK_DRAG_HANDLE` que pode ser usado para referenciar instâncias de `cdkDragHandle`. Para mais informações, consulte o [guia de dependency injection](https://angular.dev/guide/di) e a [API do token de injeção drag handle](api/cdk/drag-drop/CDK_DRAG_HANDLE).

### Customizar drag preview

Um elemento preview torna-se visível quando um elemento `cdkDrag` está sendo arrastado. Por padrão, o preview é um clone do elemento original posicionado ao lado do cursor do usuário.

Para customizar o preview, forneça um template customizado via `*cdkDragPreview`. O preview customizado não corresponderá ao tamanho do elemento draggable original, já que não são feitas suposições sobre o conteúdo do elemento. Para corresponder ao tamanho do elemento para o drag preview, passe true para o input `matchSize`.

O elemento clonado remove seu atributo id para evitar ter múltiplos elementos com o mesmo id na página. Isso fará com que qualquer CSS que tenha como alvo esse id não seja aplicado.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/custom-preview/app/app.component.ts">
  <docs-code header="app/app.component.html" path="adev/src/content/examples/drag-drop/src/custom-preview/app/app.component.html"/>
  <docs-code header="app/app.component.ts" path="adev/src/content/examples/drag-drop/src/custom-preview/app/app.component.ts"/>
  <docs-code header="app/app.component.css" path="adev/src/content/examples/drag-drop/src/custom-preview/app/app.component.css"/>
</docs-code-multifile>

Você pode usar o token de injeção `CDK_DRAG_PREVIEW` que pode ser usado para referenciar instâncias de `cdkDragPreview`. Para mais informações, consulte o [guia de dependency injection](https://angular.dev/guide/di) e a [API do token de injeção drag preview](api/cdk/drag-drop/CDK_DRAG_PREVIEW).

### Customizar ponto de inserção do drag

Por padrão, o Angular insere o preview do `cdkDrag` no `<body>` da página para evitar problemas com posicionamento e overflow. Isso pode não ser desejável em alguns casos porque o preview não terá seus estilos herdados aplicados.

Você pode mudar onde o Angular insere o preview usando o input `cdkDragPreviewContainer` em `cdkDrag`. Os valores possíveis são:

| Valor                        | Descrição                                                                                     | Vantagens                                                                                                                         | Desvantagens                                                                                                                                                                                                           |
| :--------------------------- | :-------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `global`                     | Valor padrão. Angular insere o preview no <body> ou na shadow root mais próxima.              | Preview não será afetado por `z-index` ou `overflow: hidden`. Também não afetará seletores `:nth-child` e layouts flex.          | Não mantém estilos herdados.                                                                                                                                                                                           |
| `parent`                     | Angular insere o preview dentro do pai do elemento que está sendo arrastado.                 | Preview herda os mesmos estilos que o elemento arrastado.                                                                         | Preview pode ser cortado por `overflow: hidden` ou ser colocado sob outros elementos devido a `z-index`. Além disso, pode afetar seletores `:nth-child` e alguns layouts flex.                                        |
| `ElementRef` ou `HTMLElement` | Angular insere o preview no elemento especificado.                                           | Preview herda estilos do elemento container especificado.                                                                         | Preview pode ser cortado por `overflow: hidden` ou ser colocado sob outros elementos devido a `z-index`. Além disso, pode afetar seletores `:nth-child` e alguns layouts flex.                                        |

Alternativamente, você pode modificar o token de injeção `CDK_DRAG_CONFIG` para atualizar `previewContainer` dentro da configuração se o valor for `global` ou `parent`. Para mais informações, consulte o [guia de dependency injection](https://angular.dev/guide/di), [API do token de injeção drag config](api/cdk/drag-drop/CDK_DRAG_CONFIG), e a [API drag drop config](api/cdk/drag-drop/DragDropConfig).

### Customizar drag placeholder

Enquanto um elemento `cdkDrag` está sendo arrastado, a directive cria um elemento placeholder que mostra onde o elemento será colocado quando solto. Por padrão, o placeholder é um clone do elemento que está sendo arrastado. Você pode substituir o placeholder por um customizado usando a directive `*cdkDragPlaceholder`:

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/custom-placeholder/app/app.component.ts">
  <docs-code header="app/app.component.html" path="adev/src/content/examples/drag-drop/src/custom-placeholder/app/app.component.html"/>
  <docs-code header="app/app.component.ts" path="adev/src/content/examples/drag-drop/src/custom-placeholder/app/app.component.ts"/>
  <docs-code header="app/app.component.css" path="adev/src/content/examples/drag-drop/src/custom-placeholder/app/app.component.css"/>
</docs-code-multifile>

Você pode usar o token de injeção `CDK_DRAG_PLACEHOLDER` que pode ser usado para referenciar instâncias de `cdkDragPlaceholder`. Para mais informações, consulte o [guia de dependency injection](https://angular.dev/guide/di) e a [API do token de injeção drag placeholder](api/cdk/drag-drop/CDK_DRAG_PLACEHOLDER).

### Customizar drag root element

Defina o atributo `cdkDragRootElement` se houver um elemento que você quer tornar draggable mas você não tem acesso direto a ele.

O atributo aceita um selector e procura no DOM até encontrar um elemento que corresponda ao selector. Se um elemento for encontrado, ele se torna draggable. Isso é útil para casos como tornar um dialog draggable.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/root-element/app/app.component.ts">
  <docs-code header="app/app.component.html" path="adev/src/content/examples/drag-drop/src/root-element/app/app.component.html"/>
  <docs-code header="app/app.component.ts" path="adev/src/content/examples/drag-drop/src/root-element/app/app.component.ts"/>
  <docs-code header="app/app.component.css" path="adev/src/content/examples/drag-drop/src/root-element/app/app.component.css"/>
</docs-code-multifile>

Alternativamente, você pode modificar o token de injeção `CDK_DRAG_CONFIG` para atualizar `rootElementSelector` dentro da configuração. Para mais informações, consulte o [guia de dependency injection](https://angular.dev/guide/di), [API do token de injeção drag config](api/cdk/drag-drop/CDK_DRAG_CONFIG), e a [API drag drop config](api/cdk/drag-drop/DragDropConfig).

### Definir posição DOM de um elemento draggable

Por padrão, elementos `cdkDrag` não em um `cdkDropList` movem-se de sua posição DOM normal apenas quando um usuário move manualmente o elemento. Use o input `cdkDragFreeDragPosition` para definir explicitamente a posição do elemento. Um caso de uso comum para isso é restaurar a posição de um elemento draggable depois que um usuário navegou para outra página e então retornou.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/free-drag-position/app/app.component.ts">
  <docs-code header="app/app.component.html" path="adev/src/content/examples/drag-drop/src/free-drag-position/app/app.component.html"/>
  <docs-code header="app/app.component.ts" path="adev/src/content/examples/drag-drop/src/free-drag-position/app/app.component.ts"/>
  <docs-code header="app/app.component.css" path="adev/src/content/examples/drag-drop/src/free-drag-position/app/app.component.css"/>
</docs-code-multifile>

### Restringir movimento dentro de um elemento

Para impedir que o usuário possa arrastar um elemento `cdkDrag` para fora de outro elemento, passe um selector CSS para o atributo `cdkDragBoundary`. Este atributo aceita um selector e procura no DOM até encontrar um elemento que corresponda a ele. Se uma correspondência for encontrada, o elemento se torna o limite que o elemento draggable não pode ser arrastado para fora. `cdkDragBoundary` também pode ser usado quando `cdkDrag` está colocado dentro de um `cdkDropList`.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/boundary/app/app.component.ts">
  <docs-code header="app/app.component.html" path="adev/src/content/examples/drag-drop/src/boundary/app/app.component.html"/>
  <docs-code header="app/app.component.ts" path="adev/src/content/examples/drag-drop/src/boundary/app/app.component.ts"/>
  <docs-code header="app/app.component.css" path="adev/src/content/examples/drag-drop/src/boundary/app/app.component.css"/>
</docs-code-multifile>

Alternativamente, você pode modificar o token de injeção `CDK_DRAG_CONFIG` para atualizar boundaryElement dentro da configuração. Para mais informações, consulte o [guia de dependency injection](https://angular.dev/guide/di), [API do token de injeção drag config](api/cdk/drag-drop/CDK_DRAG_CONFIG), e a [API drag drop config](api/cdk/drag-drop/DragDropConfig).

### Restringir movimento ao longo de um eixo

Por padrão, `cdkDrag` permite movimento livre em todas as direções. Para restringir dragging a um eixo específico, defina `cdkDragLockAxis` como "x" ou "y" em `cdkDrag`. Para restringir dragging para múltiplos elementos draggable dentro de `cdkDropList`, defina `cdkDropListLockAxis` em `cdkDropList` em vez disso.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/axis-lock/app/app.component.ts">
  <docs-code header="app/app.component.html" path="adev/src/content/examples/drag-drop/src/axis-lock/app/app.component.html"/>
  <docs-code header="app/app.component.ts" path="adev/src/content/examples/drag-drop/src/axis-lock/app/app.component.ts"/>
  <docs-code header="app/app.component.css" path="adev/src/content/examples/drag-drop/src/axis-lock/app/app.component.css"/>
</docs-code-multifile>

Alternativamente, você pode modificar o token de injeção `CDK_DRAG_CONFIG` para atualizar `lockAxis` dentro da configuração. Para mais informações, consulte o [guia de dependency injection](https://angular.dev/guide/di), [API do token de injeção drag config](api/cdk/drag-drop/CDK_DRAG_CONFIG), e a [API drag drop config](api/cdk/drag-drop/DragDropConfig).

### Atrasar dragging

Por padrão, quando o usuário coloca seu pointer sobre um `cdkDrag`, a sequência de dragging começa. Esse comportamento pode não ser desejável em casos como elementos draggable fullscreen em dispositivos touch onde o usuário pode acidentalmente acionar um evento de drag enquanto rola na página.

Você pode atrasar a sequência de dragging usando o input `cdkDragStartDelay`. O input espera que o usuário segure seu pointer pelo número especificado de milissegundos antes de arrastar o elemento.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/delay-drag/app/app.component.ts">
  <docs-code header="app/app.component.html" path="adev/src/content/examples/drag-drop/src/delay-drag/app/app.component.html"/>
  <docs-code header="app/app.component.ts" path="adev/src/content/examples/drag-drop/src/delay-drag/app/app.component.ts"/>
  <docs-code header="app/app.component.css" path="adev/src/content/examples/drag-drop/src/delay-drag/app/app.component.css"/>
</docs-code-multifile>

Alternativamente, você pode modificar o token de injeção `CDK_DRAG_CONFIG` para atualizar dragStartDelay dentro da configuração. Para mais informações, consulte o [guia de dependency injection](https://angular.dev/guide/di), [API do token de injeção drag config](api/cdk/drag-drop/CDK_DRAG_CONFIG), e a [API drag drop config](api/cdk/drag-drop/DragDropConfig).

### Desabilitar dragging

Se você quiser desabilitar dragging para um item de drag particular, defina o input `cdkDragDisabled` em um item `cdkDrag` como true ou false. Você pode desabilitar uma lista inteira usando o input `cdkDropListDisabled` em um `cdkDropList`. Também é possível desabilitar um handle específico via `cdkDragHandleDisabled` em `cdkDragHandle`.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/disable-drag/app/app.component.ts">
  <docs-code header="app/app.component.html" path="adev/src/content/examples/drag-drop/src/disable-drag/app/app.component.html"/>
  <docs-code header="app/app.component.ts" path="adev/src/content/examples/drag-drop/src/disable-drag/app/app.component.ts"/>
  <docs-code header="app/app.component.css" path="adev/src/content/examples/drag-drop/src/disable-drag/app/app.component.css"/>
</docs-code-multifile>

Alternativamente, você pode modificar o token de injeção `CDK_DRAG_CONFIG` para atualizar `draggingDisabled` dentro da configuração. Para mais informações, consulte o [guia de dependency injection](https://angular.dev/guide/di), [API do token de injeção drag config](api/cdk/drag-drop/CDK_DRAG_CONFIG), e a [API drag drop config](api/cdk/drag-drop/DragDropConfig).

## Customizações de sorting

### Orientação de lista

Por padrão, a directive `cdkDropList` assume que listas são verticais. Isso pode ser alterado definindo a propriedade `cdkDropListOrientation` como horizontal.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/horizontal-sorting/app/app.component.ts">
  <docs-code header="app/app.component.html" path="adev/src/content/examples/drag-drop/src/horizontal-sorting/app/app.component.html"/>
  <docs-code header="app/app.component.ts" path="adev/src/content/examples/drag-drop/src/horizontal-sorting/app/app.component.ts"/>
  <docs-code header="app/app.component.css" path="adev/src/content/examples/drag-drop/src/horizontal-sorting/app/app.component.css"/>
</docs-code-multifile>

Alternativamente, você pode modificar o token de injeção `CDK_DRAG_CONFIG` para atualizar `listOrientation` dentro da configuração. Para mais informações, consulte o [guia de dependency injection](https://angular.dev/guide/di), [API do token de injeção drag config](api/cdk/drag-drop/CDK_DRAG_CONFIG), e a [API drag drop config](api/cdk/drag-drop/DragDropConfig).

### List wrapping

Por padrão, o `cdkDropList` ordena os elementos draggable movendo-os usando uma transform CSS. Isso permite que a ordenação seja animada, o que proporciona uma melhor experiência do usuário. No entanto, isso também vem com a desvantagem de que a drop list funciona apenas em uma direção: verticalmente ou horizontalmente.

Se você tiver uma lista ordenável que precisa quebrar para novas linhas, você pode definir o atributo `cdkDropListOrientation` como `mixed`. Isso faz com que a lista use uma estratégia diferente de ordenar os elementos que envolve movê-los no DOM. No entanto, a lista não pode mais animar a ação de ordenação.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/mixed-sorting/app/app.component.ts">
  <docs-code header="app/app.component.html" path="adev/src/content/examples/drag-drop/src/mixed-sorting/app/app.component.html"/>
  <docs-code header="app/app.component.ts" path="adev/src/content/examples/drag-drop/src/mixed-sorting/app/app.component.ts"/>
  <docs-code header="app/app.component.css" path="adev/src/content/examples/drag-drop/src/mixed-sorting/app/app.component.css"/>
</docs-code-multifile>

### Sorting seletivo

Por padrão, elementos `cdkDrag` são ordenados em qualquer posição dentro de um `cdkDropList`. Para mudar esse comportamento, defina o atributo `cdkDropListSortPredicate` que recebe uma função. A função predicate é chamada sempre que um elemento draggable está prestes a ser movido para um novo índice dentro da drop list. Se o predicate retornar true, o item será movido para o novo índice, caso contrário manterá sua posição atual.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/sort-predicate/app/app.component.ts">
  <docs-code header="app/app.component.html" path="adev/src/content/examples/drag-drop/src/sort-predicate/app/app.component.html"/>
  <docs-code header="app/app.component.ts" path="adev/src/content/examples/drag-drop/src/sort-predicate/app/app.component.ts"/>
  <docs-code header="app/app.component.css" path="adev/src/content/examples/drag-drop/src/sort-predicate/app/app.component.css"/>
</docs-code-multifile>

### Desabilitar sorting

Existem casos onde elementos draggable podem ser arrastados de um `cdkDropList` para outro, no entanto, o usuário não deveria poder ordená-los dentro da lista de origem. Para esses casos, adicione o atributo `cdkDropListSortingDisabled` para prevenir que elementos draggable em um `cdkDropList` sejam ordenados. Isso preserva a posição inicial do elemento arrastado na lista de origem se ele não for arrastado para uma nova posição válida.

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/disable-sorting/app/app.component.ts">
  <docs-code header="app/app.component.html" path="adev/src/content/examples/drag-drop/src/disable-sorting/app/app.component.html"/>
  <docs-code header="app/app.component.ts" path="adev/src/content/examples/drag-drop/src/disable-sorting/app/app.component.ts"/>
  <docs-code header="app/app.component.css" path="adev/src/content/examples/drag-drop/src/disable-sorting/app/app.component.css"/>
</docs-code-multifile>

Alternativamente, você pode modificar o token de injeção `CDK_DRAG_CONFIG` para atualizar sortingDisabled dentro da configuração. Para mais informações, consulte o [guia de dependency injection](https://angular.dev/guide/di), [API do token de injeção drag config](api/cdk/drag-drop/CDK_DRAG_CONFIG), e a [API drag drop config](api/cdk/drag-drop/DragDropConfig).

### Copiar itens entre listas

Por padrão, quando um item é arrastado de uma lista para outra, ele é movido para fora de sua lista original. No entanto, você pode configurar as directives para copiar o item, deixando o item original na lista de origem.

Para habilitar cópia, você pode definir o input `cdkDropListHasAnchor`. Isso diz ao `cdkDropList` para criar um elemento "anchor" que permanece no container original e não se move com o item. Se o usuário mover o item de volta para o container original, o anchor é removido automaticamente. O elemento anchor pode ser estilizado visando a classe CSS `.cdk-drag-anchor`.

Combinar `cdkDropListHasAnchor` com `cdkDropListSortingDisabled` torna possível construir uma lista da qual um usuário pode copiar itens sem poder reordenar a lista de origem (por exemplo, uma lista de produtos e um carrinho de compras).

<docs-code-multifile preview path="adev/src/content/examples/drag-drop/src/copy-list/app/app.component.ts">
  <docs-code header="app/app.component.html" path="adev/src/content/examples/drag-drop/src/copy-list/app/app.component.html"/>
  <docs-code header="app/app.component.ts" path="adev/src/content/examples/drag-drop/src/copy-list/app/app.component.ts"/>
  <docs-code header="app/app.component.css" path="adev/src/content/examples/drag-drop/src/copy-list/app/app.component.css"/>
</docs-code-multifile>

## Customizar animações

Drag and drop suporta animações para ambos:

- Ordenar um elemento draggable dentro de uma lista
- Mover o elemento draggable da posição onde o usuário o soltou para a posição final dentro da lista

Para configurar suas animações, defina uma transition CSS que tenha como alvo a propriedade transform. As seguintes classes podem ser usadas para animações:

| Nome da classe CSS  | Resultado de adicionar transition                                                                                                                                                                                                    |
| :------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| .cdk-drag           | Animar elementos draggable conforme eles estão sendo ordenados.                                                                                                                                                                      |
| .cdk-drag-animating | Animar o elemento draggable da sua posição solta para a posição final dentro do `cdkDropList`.<br><br>Esta classe CSS é aplicada a um elemento `cdkDrag` apenas quando a ação de dragging foi interrompida.                         |

## Estilização

Tanto as directives `cdkDrag` quanto `cdkDropList` aplicam apenas estilos essenciais necessários para funcionalidade. Aplicações podem customizar seus estilos visando essas classes CSS especificadas.

| Nome da classe CSS       | Descrição                                                                                                                                                                                                                                                                                                        |
| :----------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| .cdk-drop-list           | Selector para os elementos container `cdkDropList`.                                                                                                                                                                                                                                                              |
| .cdk-drag                | Selector para elementos `cdkDrag`.                                                                                                                                                                                                                                                                               |
| .cdk-drag-disabled       | Selector para elementos `cdkDrag` desabilitados.                                                                                                                                                                                                                                                                 |
| .cdk-drag-handle         | Selector para o elemento host do `cdkDragHandle`.                                                                                                                                                                                                                                                                |
| .cdk-drag-preview        | Selector para o elemento drag preview. Este é o elemento que aparece ao lado do cursor conforme um usuário arrasta um elemento em uma lista ordenável.<br><br>O elemento se parece exatamente com o elemento que está sendo arrastado, a menos que seja customizado com um template customizado através de `*cdkDragPreview`. |
| .cdk-drag-placeholder    | Selector para o elemento drag placeholder. Este é o elemento que é mostrado no local onde o elemento draggable será arrastado assim que a ação de dragging terminar.<br><br>Este elemento se parece exatamente com o elemento que está sendo ordenado, a menos que seja customizado com a directive cdkDragPlaceholder.      |
| .cdk-drop-list-dragging  | Selector para elemento container `cdkDropList` que tem um elemento draggable sendo arrastado atualmente.                                                                                                                                                                                                         |
| .cdk-drop-list-disabled  | Selector para elementos container `cdkDropList` que estão desabilitados.                                                                                                                                                                                                                                         |
| .cdk-drop-list-receiving | Selector para elemento container `cdkDropList` que tem um elemento draggable que pode receber de uma drop list conectada que está sendo arrastada atualmente.                                                                                                                                                    |
| .cdk-drag-anchor         | Selector para o elemento anchor que é criado quando `cdkDropListHasAnchor` está habilitado. Este elemento indica a posição da qual o item arrastado começou.                                                                                                                                                    |

## Dragging em um container com scroll

Se seus itens draggable estiverem dentro de um container com scroll (por exemplo, um `div` com `overflow: auto`), o scroll automático não funcionará a menos que o container com scroll tenha a directive `cdkScrollable`. Sem ela, o CDK não pode detectar ou controlar o comportamento de scroll do container durante operações de drag.

## Integrações com outros components

A funcionalidade de drag-and-drop do CDK pode ser integrada com diferentes components. Casos de uso comuns incluem components `MatTable` ordenáveis e components `MatTabGroup` ordenáveis.
