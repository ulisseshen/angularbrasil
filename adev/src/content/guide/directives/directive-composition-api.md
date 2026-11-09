<!-- ia-translate: true -->
# Directive composition API

As directives do Angular oferecem uma ótima forma de encapsular comportamentos reutilizáveis. Directives podem aplicar atributos, classes CSS e event listeners a um elemento.

A _directive composition API_ permite aplicar directives ao elemento host de um component a partir de _dentro_ da classe TypeScript do component.

## Adicionando directives a um component {#adding-directives-to-a-component}

Você aplica directives a um component adicionando uma propriedade `hostDirectives` ao decorator do component. Essas directives são chamadas de _host directives_.

Neste exemplo, a directive `MenuBehavior` é aplicada ao elemento host de `AdminMenu`. Isso funciona de forma semelhante a aplicar `MenuBehavior` ao elemento `<admin-menu>` em um template.

```ts
@Component({
  selector: 'admin-menu',
  templateUrl: './admin-menu.html',
  hostDirectives: [MenuBehavior],
})
export class AdminMenu {}
```

Quando o framework renderiza um component, o Angular também cria uma instância de cada host directive. Os host bindings das directives se aplicam ao elemento host do component. Por padrão, os inputs e outputs das host directives não são expostos como parte da API pública do component. Veja [Incluindo inputs e outputs](#including-inputs-and-outputs) abaixo para mais informações.

Host directives têm as seguintes restrições:

- **O Angular aplica host directives estaticamente em tempo de compilação.** Você não pode adicionar directives dinamicamente em tempo de execução.
- **Directives usadas em `hostDirectives` não podem especificar `standalone: false`.**
- **O Angular ignora o `selector` de directives aplicadas na propriedade `hostDirectives`.**

## Incluindo inputs e outputs {#including-inputs-and-outputs}

Quando você aplica `hostDirectives` ao seu component, os inputs e outputs das host directives não são incluídos na API do component por padrão. Você pode incluir explicitamente inputs e outputs na API do component expandindo a entrada em `hostDirectives`:

```ts
@Component({
  selector: 'admin-menu',
  templateUrl: './admin-menu.html',
  hostDirectives: [
    {
      directive: MenuBehavior,
      inputs: ['menuId'],
      outputs: ['menuClosed'],
    },
  ],
})
export class AdminMenu {}
```

Ao especificar explicitamente os inputs e outputs, quem consome o component com `hostDirectives` pode vinculá-los em um template:

```angular-html
<admin-menu menuId="top-menu" (menuClosed)="logMenuClosed()"></admin-menu>
```

Além disso, você pode dar alias a inputs e outputs de uma host directive para personalizar a API do component:

```ts
@Component({
  selector: 'admin-menu',
  templateUrl: './admin-menu.html',
  hostDirectives: [
    {
      directive: MenuBehavior,
      inputs: ['menuId: id'],
      outputs: ['menuClosed: closed'],
    },
  ],
})
export class AdminMenu {}
```

```angular-html
<admin-menu id="top-menu" (closed)="logMenuClosed()"></admin-menu>
```

## Adicionando directives a outra directive {#adding-directives-to-another-directive}

Você também pode adicionar `hostDirectives` a outras directives, além de components. Isso permite a agregação transitiva de múltiplos comportamentos.

O exemplo a seguir define duas directives, `Menu` e `Tooltip`, depois compõe o comportamento delas em `MenuWithTooltip`. Por fim, aplica `MenuWithTooltip` a `SpecializedMenuWithTooltip`.

Quando `SpecializedMenuWithTooltip` é usada em um template, ela cria instâncias de `Menu`, `Tooltip` e `MenuWithTooltip`. Os host bindings de cada uma dessas directives se aplicam ao elemento host de `SpecializedMenuWithTooltip`.

```ts
@Directive({/* ... */})
export class Menu {}

@Directive({/* ... */})
export class Tooltip {}

// MenuWithTooltip pode compor comportamentos de múltiplas outras directives
@Directive({
  hostDirectives: [Tooltip, Menu],
})
export class MenuWithTooltip {}

// CustomWidget pode aplicar os comportamentos já compostos de MenuWithTooltip
@Directive({
  hostDirectives: [MenuWithTooltip],
})
export class SpecializedMenuWithTooltip {}
```

## Semântica de host directive {#host-directive-semantics}

### Ordem de execução de directive {#directive-execution-order}

Host directives passam pelo mesmo ciclo de vida que components e directives usadas diretamente em um template. No entanto, host directives sempre executam seu constructor, lifecycle hooks e bindings _antes_ do component ou da directive à qual são aplicadas.

O exemplo a seguir mostra o uso mínimo de uma host directive:

```ts
@Component({
  selector: 'admin-menu',
  templateUrl: './admin-menu.html',
  hostDirectives: [MenuBehavior],
})
export class AdminMenu {}
```

A ordem de execução aqui é:

1. `MenuBehavior` instanciada
2. `AdminMenu` instanciado
3. `MenuBehavior` recebe inputs (`ngOnInit`)
4. `AdminMenu` recebe inputs (`ngOnInit`)
5. `MenuBehavior` aplica host bindings
6. `AdminMenu` aplica host bindings

Essa ordem de operações significa que components com `hostDirectives` podem sobrescrever quaisquer host bindings especificados por uma host directive.

Essa ordem de operações se estende a cadeias aninhadas de host directives, como mostrado no exemplo a seguir.

```ts
@Directive({...})
export class Tooltip {}

@Directive({
  hostDirectives: [Tooltip],
})
export class CustomTooltip {}

@Directive({
  hostDirectives: [CustomTooltip],
})
export class EvenMoreCustomTooltip {}
```

No exemplo acima, a ordem de execução é:

1. `Tooltip` instanciada
2. `CustomTooltip` instanciada
3. `EvenMoreCustomTooltip` instanciada
4. `Tooltip` recebe inputs (`ngOnInit`)
5. `CustomTooltip` recebe inputs (`ngOnInit`)
6. `EvenMoreCustomTooltip` recebe inputs (`ngOnInit`)
7. `Tooltip` aplica host bindings
8. `CustomTooltip` aplica host bindings
9. `EvenMoreCustomTooltip` aplica host bindings

### Injeção de dependência {#dependency-injection}

Um component ou directive que especifica `hostDirectives` pode injetar as instâncias dessas host directives, e vice-versa.

Ao aplicar host directives a um component, tanto o component quanto as host directives podem definir providers.

Se um component ou directive com `hostDirectives` e essas host directives fornecerem o mesmo injection token, os providers definidos pela classe com `hostDirectives` têm precedência sobre os providers definidos pelas host directives.

### Deduplicação de host directive {#host-directive-de-duplication}

Quando a mesma directive aparece mais de uma vez na árvore de host directives resolvida, ela é automaticamente deduplicada, em vez de gerar um erro. Duas regras determinísticas são usadas para decidir qual correspondência sobrevive.

#### Correspondência de template tem precedência {#template-match-takes-precedence}

Se uma directive corresponde a um elemento uma vez por meio de um **seletor de template** e também aparece como **host directive**, o Angular mantém apenas a correspondência do template e descarta todas as correspondências de host directive.

O modelo mental é que uma correspondência de host directive representa `Partial<YourDirective>`, uma aplicação parcial em que apenas os inputs e outputs explicitamente listados em `hostDirectives` são expostos, enquanto uma correspondência de template representa a directive completa, com toda a sua API pública.

@Directive({selector: '[hoverable]'})
export class Hoverable {}

```ts
@Component({
  selector: 'app-button',
  hostDirectives: [Hoverable],
})
export class Button {}
```

```angular-html
<!-- Hoverable é correspondida pelo seletor E como host directive de Button. -->
<!-- O Angular mantém apenas a correspondência pelo seletor, que tem a API pública completa. -->
<app-button hoverable></app-button>
```

#### Múltiplas correspondências de host directive são mescladas {#multiple-host-directive-matches-are-merged}

Se a mesma directive aparece **mais de uma vez como host directive**, por exemplo, quando duas directives declaram uma dependência comum em seus `hostDirectives`, o Angular mescla todas as instâncias em uma única instância de directive. Os mapeamentos de inputs e outputs de todas as instâncias são combinados.

Isso resolve o clássico [problema do diamante](https://en.wikipedia.org/wiki/Multiple_inheritance#The_diamond_problem) na composição de host directives:

```ts
// Um comportamento compartilhado que ambos os gatilhos precisam
@Directive({
  host: {
    '[attr.data-trigger-id]': 'triggerId()',
  },
})
export class TriggerRef {
  readonly triggerId = input(`trigger-${crypto.randomUUID()}`);
}

// Dois gatilhos separados, cada um declarando TriggerRef como host directive
@Directive({
  selector: '[popoverTrigger]',
  hostDirectives: [TriggerRef],
})
export class PopoverTrigger {
  readonly triggerRef = inject(TriggerRef);
}

@Directive({
  selector: '[dropdownTrigger]',
  hostDirectives: [TriggerRef],
})
export class DropdownTrigger {
  readonly triggerRef = inject(TriggerRef);
}
```

```angular-html
<!-- O Angular mantém uma única instância de TriggerRef, compartilhada pelos dois gatilhos. -->
<button popoverTrigger dropdownTrigger>Actions</button>
```

HELPFUL: Como o Angular produz apenas uma instância da directive compartilhada, tanto `PopoverTrigger` quanto `DropdownTrigger` recebem a mesma instância de `TriggerRef` quando a injetam.

#### Aliases conflitantes {#conflicting-aliases}

Quando o Angular mescla correspondências duplicadas de host directive, ele também mescla os mapeamentos de inputs e outputs delas.

Se duas instâncias da mesma host directive expõem o **mesmo input ou output com aliases diferentes**, o Angular gera um erro em tempo de compilação ([NG8024](errors/NG8024)).

```ts
@Directive({
  selector: '[popoverTrigger]',
  hostDirectives: [{directive: TriggerRef, inputs: ['triggerId: popoverTriggerId']}],
})
export class PopoverTrigger {}

@Directive({
  selector: '[dropdownTrigger]',
  hostDirectives: [
    {directive: TriggerRef, inputs: ['triggerId: dropdownTriggerId']}, // alias diferente!
  ],
})
export class DropdownTrigger {}
```

```angular-html
<!-- Erro: triggerId é exposto tanto como "popoverTriggerId" quanto como "dropdownTriggerId". -->
<button popoverTrigger dropdownTrigger></button>
```

Para resolver isso, garanta que ambos os caminhos exponham o input ou output compartilhado com o mesmo alias, ou não o exponham de forma alguma.

## Próximos passos {#whats-next}

<docs-pill-row>
  <docs-pill href="guide/directives/structural-directives" title="Diretivas estruturais"/>
  <docs-pill href="guide/components/host-elements" title="Elementos host de components"/>
</docs-pill-row>
