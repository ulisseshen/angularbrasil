<!-- ia-translate: true -->
# Propriedades output de components

Ao trabalhar com components, pode ser necessário notificar outros components de que algo aconteceu. Talvez um botão tenha sido clicado, um item tenha sido adicionado/removido de uma lista ou alguma outra atualização importante tenha ocorrido. Neste cenário, components precisam se comunicar com components pais.

O Angular usa a função `output()` para habilitar este tipo de comportamento.

Nota: Saiba mais sobre [eventos customizados no guia de outputs](/guide/components/outputs).

Nesta atividade, você aprenderá como usar a função `output()` para se comunicar com components.

<hr />

Para criar o caminho de comunicação de components filhos para pais, use a função `output` para inicializar uma propriedade de classe.

<docs-code header="child.ts" language="ts">
@Component({...})
class Child {
  incrementCountEvent = output<number>();
}
</docs-code>

Agora o component pode gerar eventos que podem ser ouvidos pelo component pai. Dispare eventos chamando o método `emit`:

<docs-code header="child.ts" language="ts">
class Child {
  ...

onClick() {
this.count++;
this.incrementCountEvent.emit(this.count);
}
}
</docs-code>

A função emit gerará um evento com o mesmo tipo definido pelo `output`.

Certo, sua vez de tentar isso. Complete o código seguindo estas tarefas:

<docs-workflow>

<docs-step title="Adicione uma propriedade `output()`">
Atualize `child.ts` adicionando uma propriedade output chamada `addItemEvent`, certifique-se de definir o tipo de output como `string`.
</docs-step>

<docs-step title="Complete o método `addItem`">
Em `child.ts` atualize o método `addItem`; use o seguinte código como lógica:

<docs-code header="child.ts" highlight="[2]" language="ts">
addItem() {
  this.addItemEvent.emit('🐢');
}
</docs-code>

</docs-step>

<docs-step title="Atualize o template do `App`">
Em `app.ts` atualize o template para ouvir o evento emitido adicionando o seguinte código:

```angular-html
<app-child (addItemEvent)="addItem($event)" />
```

Agora, o botão "Add Item" adiciona um novo item à lista toda vez que o botão é clicado.

</docs-step>

</docs-workflow>

Uau, neste ponto você completou os fundamentos de components - impressionante 👏

Continue aprendendo para desbloquear mais recursos incríveis do Angular.
