<!-- ia-translate: true -->

# Directive composition API

As directives do Angular oferecem uma ótima maneira de encapsular comportamentos reutilizáveis — directives podem aplicar atributos, classes CSS e event listeners a um elemento.

A _directive composition API_ permite que você aplique directives ao elemento host de um component de _dentro_ da classe TypeScript do component.

## Adicionando directives a um component

Você aplica directives a um component adicionando uma propriedade `hostDirectives` ao decorator do component. Chamamos essas directives de _host directives_.

Neste exemplo, aplicamos a directive `MenuBehavior` ao elemento host de `AdminMenu`. Isso funciona de forma similar a aplicar o `MenuBehavior` ao elemento `<admin-menu>` em um template.

```typescript
@Component({
  selector: 'admin-menu',
  template: 'admin-menu.html',
  hostDirectives: [MenuBehavior],
})
export class AdminMenu { }
```

Quando o framework renderiza um component, o Angular também cria uma instância de cada host directive. Os host bindings das directives se aplicam ao elemento host do component. Por padrão, inputs e outputs de host directive não são expostos como parte da API pública do component. Veja [Incluindo inputs e outputs](#including-inputs-and-outputs) abaixo para mais informações.

**O Angular aplica host directives estaticamente em tempo de compilação.** Você não pode adicionar directives dinamicamente em runtime.

**Directives usadas em `hostDirectives` não podem especificar `standalone: false`.**

**O Angular ignora o `selector` de directives aplicadas na propriedade `hostDirectives`.**

## Incluindo inputs e outputs {#including-inputs-and-outputs}

Quando você aplica `hostDirectives` ao seu component, os inputs e outputs das host directives não são incluídos na API do seu component por padrão. Você pode incluir explicitamente inputs e outputs na API do seu component expandindo a entrada em `hostDirectives`:

```typescript
@Component({
  selector: 'admin-menu',
  template: 'admin-menu.html',
  hostDirectives: [{
    directive: MenuBehavior,
    inputs: ['menuId'],
    outputs: ['menuClosed'],
  }],
})
export class AdminMenu { }
```

Ao especificar explicitamente os inputs e outputs, consumidores do component com `hostDirective` podem fazer binding deles em um template:

```angular-html

<admin-menu menuId="top-menu" (menuClosed)="logMenuClosed()">
```

Além disso, você pode criar alias para inputs e outputs de `hostDirective` para personalizar a API do seu component:

```typescript
@Component({
  selector: 'admin-menu',
  template: 'admin-menu.html',
  hostDirectives: [{
    directive: MenuBehavior,
    inputs: ['menuId: id'],
    outputs: ['menuClosed: closed'],
  }],
})
export class AdminMenu { }
```

```angular-html

<admin-menu id="top-menu" (closed)="logMenuClosed()">
```

## Adicionando directives a outra directive

Você também pode adicionar `hostDirectives` a outras directives, além de components. Isso permite a agregação transitiva de múltiplos comportamentos.

No exemplo a seguir, definimos duas directives, `Menu` e `Tooltip`. Então, compomos o comportamento dessas duas directives em `MenuWithTooltip`. Finalmente, aplicamos `MenuWithTooltip` a `SpecializedMenuWithTooltip`.

Quando `SpecializedMenuWithTooltip` é usado em um template, ele cria instâncias de todos `Menu`, `Tooltip` e `MenuWithTooltip`. Os host bindings de cada uma dessas directives se aplicam ao elemento host de `SpecializedMenuWithTooltip`.

```typescript
@Directive({...})
export class Menu { }

@Directive({...})
export class Tooltip { }

// MenuWithTooltip pode compor comportamentos de múltiplas outras directives
@Directive({
  hostDirectives: [Tooltip, Menu],
})
export class MenuWithTooltip { }

// CustomWidget pode aplicar os comportamentos já compostos de MenuWithTooltip
@Directive({
  hostDirectives: [MenuWithTooltip],
})
export class SpecializedMenuWithTooltip { }
```

## Semântica de host directive

### Ordem de execução de directive

Host directives passam pelo mesmo ciclo de vida que components e directives usadas diretamente em um template. No entanto, host directives sempre executam seu constructor, lifecycle hooks e bindings _antes_ do component ou directive no qual são aplicadas.

O exemplo a seguir mostra uso mínimo de uma host directive:

```typescript
@Component({
  selector: 'admin-menu',
  template: 'admin-menu.html',
  hostDirectives: [MenuBehavior],
})
export class AdminMenu { }
```

A ordem de execução aqui é:

1. `MenuBehavior` instanciada
2. `AdminMenu` instanciado
3. `MenuBehavior` recebe inputs (`ngOnInit`)
4. `AdminMenu` recebe inputs (`ngOnInit`)
5. `MenuBehavior` aplica host bindings
6. `AdminMenu` aplica host bindings

Esta ordem de operações significa que components com `hostDirectives` podem sobrescrever quaisquer host bindings especificados por uma host directive.

Esta ordem de operações se estende a cadeias aninhadas de host directives, como mostrado no exemplo a seguir.

```typescript
@Directive({...})
export class Tooltip { }

@Directive({
  hostDirectives: [Tooltip],
})
export class CustomTooltip { }

@Directive({
  hostDirectives: [CustomTooltip],
})
export class EvenMoreCustomTooltip { }
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

### Dependency injection

Um component ou directive que especifica `hostDirectives` pode injetar as instâncias dessas host directives e vice-versa.

Ao aplicar host directives a um component, tanto o component quanto as host directives podem definir providers.

Se um component ou directive com `hostDirectives` e essas host directives ambos fornecem o mesmo injection token, os providers definidos pela classe com `hostDirectives` têm precedência sobre os providers definidos pelas host directives.
