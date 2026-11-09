<!-- ia-translate: true -->
# Propriedades output de components {#component-output-properties}

Ao trabalhar com components, pode ser necessário notificar outros components de que algo aconteceu. Talvez um botão tenha sido clicado, um item tenha sido adicionado ou removido de uma lista, ou alguma outra atualização importante tenha ocorrido. Nesse cenário, os components precisam se comunicar com os components pais.

O Angular usa a função `output()` para habilitar esse tipo de comportamento.

NOTE: Saiba mais sobre [eventos customizados no guia de outputs](/guide/components/outputs).

Nesta atividade, você aprenderá como usar a função `output()` para se comunicar com components.

<hr />

Para criar o caminho de comunicação dos components filhos para os pais, use a função `output` para inicializar uma propriedade da classe.

```ts {header:"child.ts"}
@Component({...})
class Child {
  incrementCountEvent = output<number>();
}
```

Agora o component pode gerar eventos que podem ser escutados pelo component pai. Dispare eventos chamando o método `emit`:

```ts {header:"child.ts"}
class Child {
  ...

  onClick() {
    this.count++;
    this.incrementCountEvent.emit(this.count);
  }
}
```

A função `emit` gerará um evento com o mesmo tipo definido pelo `output`.

Agora é sua vez de tentar. Complete o código seguindo estas tarefas:

<docs-workflow>

<docs-step title="Adicionar uma propriedade `output()` {#add-an-output-property}">
Atualize `child.ts` adicionando uma propriedade output chamada `addItemEvent`. Certifique-se de definir o tipo do output como `string`.
</docs-step>

<docs-step title="Completar o método `addItem` {#complete-additem-method}">
Em `child.ts`, atualize o método `addItem`. Use o seguinte código como lógica:

```ts {header:"child.ts", highlight:[2]}
addItem() {
  this.addItemEvent.emit('🐢');
}
```

</docs-step>

<docs-step title="Atualizar o template do `App` {#update-the-app-template}">
Em `app.ts`, atualize o template para escutar o evento emitido adicionando o seguinte código:

```angular-html
<app-child (addItemEvent)="addItem($event)" />
```

Agora, o botão "Add Item" adiciona um novo item à lista toda vez que for clicado.

</docs-step>

</docs-workflow>

Uau, neste ponto você completou os fundamentos de components. Impressionante 👏

Continue aprendendo para desbloquear mais recursos incríveis do Angular.
