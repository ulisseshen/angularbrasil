<!-- ia-translate: true -->
# Eventos personalizados com outputs

TIP: Este guia pressupõe que você já leu o [Guia de Fundamentos](essentials). Leia-o primeiro se você é novo no Angular.

Components Angular podem definir eventos personalizados atribuindo uma propriedade à função `output`:

<docs-code language="ts" highlight="3">
@Component({/*...*/})
export class ExpandablePanel {
  panelClosed = output<void>();
}
</docs-code>

```angular-html
<expandable-panel (panelClosed)="savePanelState()" />
```

A função `output` retorna um `OutputEmitterRef`. Você pode emitir um evento chamando o método `emit` no `OutputEmitterRef`:

```ts
  this.panelClosed.emit();
```

O Angular se refere a propriedades inicializadas com a função `output` como **outputs**. Você pode usar outputs para disparar eventos personalizados, semelhantes a eventos nativos do navegador como `click`.

**Eventos personalizados do Angular não propagam para cima no DOM**.

**Nomes de output são sensíveis a maiúsculas e minúsculas.**

Ao estender uma classe de component, **outputs são herdados pela classe filha.**

A função `output` tem significado especial para o compilador do Angular. **Você pode chamar exclusivamente `output` em inicializadores de propriedade de component e directive.**

## Emitindo dados de evento

Você pode passar dados de evento ao chamar `emit`:

```ts
// You can emit primitive values.
this.valueChanged.emit(7);

// You can emit custom event objects
this.thumbDropped.emit({
  pointerX: 123,
  pointerY: 456,
})
```

Ao definir um event listener em um template, você pode acessar os dados do evento a partir da variável `$event`:

```angular-html
<custom-slider (valueChanged)="logValue($event)" />
```

Receba os dados do evento no component pai:

```ts
@Component({
 /*...*/
})
export class App {
  logValue(value: number) {
    ...
  }
}

```

## Personalizando nomes de output

A função `output` aceita um parâmetro que permite especificar um nome diferente para o evento em um template:

```ts
@Component({/*...*/})
export class CustomSlider {
  changed = output({alias: 'valueChanged'});
}
```

```angular-html
<custom-slider (valueChanged)="saveVolume()" />
```

Este alias não afeta o uso da propriedade em código TypeScript.

Embora você deva geralmente evitar criar aliases para outputs de components, este recurso pode ser útil para renomear propriedades enquanto preserva um alias para o nome original ou para evitar colisões com o nome de eventos DOM nativos.

## Assinando outputs programaticamente

Ao criar um component dinamicamente, você pode programaticamente assinar eventos de output da instância do component. O tipo `OutputRef` inclui um método `subscribe`:

```ts
const someComponentRef: ComponentRef<SomeComponent> = viewContainerRef.createComponent(/*...*/);

someComponentRef.instance.someEventProperty.subscribe(eventData => {
  console.log(eventData);
});
```

O Angular automaticamente limpa as assinaturas de eventos quando destrói components com assinantes. Alternativamente, você pode cancelar manualmente a assinatura de um evento. A função `subscribe` retorna um `OutputRefSubscription` com um método `unsubscribe`:

```ts
const eventSubscription = someComponent.someEventProperty.subscribe(eventData => {
  console.log(eventData);
});

// ...

eventSubscription.unsubscribe();
```

## Escolhendo nomes de evento

Evite escolher nomes de output que colidam com eventos em elementos DOM como HTMLElement. Colisões de nomes introduzem confusão sobre se a propriedade vinculada pertence ao component ou ao elemento DOM.

Evite adicionar prefixos para outputs de component como você faria com seletores de component. Como um determinado elemento pode hospedar apenas um component, quaisquer propriedades personalizadas podem ser assumidas como pertencentes ao component.

Sempre use nomes de output em [camelCase](https://en.wikipedia.org/wiki/Camel_case). Evite prefixar nomes de output com "on".

## Usando outputs com RxJS

Consulte [Interoperabilidade RxJS com outputs de component e directive](ecosystem/rxjs-interop/output-interop) para detalhes sobre interoperabilidade entre outputs e RxJS.

## Declarando outputs com o decorator `@Output`

TIP: Embora a equipe do Angular recomende usar a função `output` para novos projetos, a API `@Output` original baseada em decorator continua totalmente suportada.

Você pode alternativamente definir eventos personalizados atribuindo uma propriedade a um novo `EventEmitter` e adicionando o decorator `@Output`:

```ts
@Component({/*...*/})
export class ExpandablePanel {
  @Output() panelClosed = new EventEmitter<void>();
}
```

Você pode emitir um evento chamando o método `emit` no `EventEmitter`.

### Aliases com o decorator `@Output`

O decorator `@Output` aceita um parâmetro que permite especificar um nome diferente para o evento em um template:

```ts
@Component({/*...*/})
export class CustomSlider {
  @Output('valueChanged') changed = new EventEmitter<number>();
}
```

```angular-html
<custom-slider (valueChanged)="saveVolume()" />
```

Este alias não afeta o uso da propriedade em código TypeScript.

## Especificar outputs no decorator `@Component`

Além do decorator `@Output`, você também pode especificar os outputs de um component com a propriedade `outputs` no decorator `@Component`. Isso pode ser útil quando um component herda uma propriedade de uma classe base:

```ts
// `CustomSlider` inherits the `valueChanged` property from `BaseSlider`.
@Component({
  /*...*/
  outputs: ['valueChanged'],
})
export class CustomSlider extends BaseSlider {}
```

Você pode adicionalmente especificar um alias de output na lista `outputs` colocando o alias após dois pontos na string:

```ts
// `CustomSlider` inherits the `valueChanged` property from `BaseSlider`.
@Component({
  /*...*/
  outputs: ['valueChanged: volumeChanged'],
})
export class CustomSlider extends BaseSlider {}
```
