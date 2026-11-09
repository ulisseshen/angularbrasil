<!-- ia-translate: true -->

# DI em ação {#di-in-action}

Este guia explora recursos adicionais da injeção de dependência (DI) no Angular.

NOTE: Para a cobertura completa de InjectionToken e de providers customizados, veja o [guia de definição de providers de dependência](guide/di/defining-dependency-providers#injection-tokens).

## Injetar o elemento DOM do component {#inject-the-components-dom-element}

Embora os desenvolvedores geralmente evitem isso, alguns efeitos visuais e ferramentas de terceiros exigem acesso direto ao DOM.
Nesses casos, você pode precisar acessar o elemento DOM de um component.

O Angular expõe o elemento DOM subjacente de um `@Component` ou `@Directive` por meio de injeção, usando o token `ElementRef`:

```ts {highlight:[7]}
import {Directive, ElementRef, inject} from '@angular/core';

@Directive({
  selector: '[appHighlight]',
})
export class HighlightDirective {
  private element = inject(ElementRef);

  update() {
    this.element.nativeElement.style.color = 'red';
  }
}
```

## Injetar o nome da tag do elemento host {#inject-the-host-elements-tag-name}

Para obter o nome da tag de um elemento host, injete-o usando o token `HOST_TAG_NAME`.

```ts
import {Directive, HOST_TAG_NAME, inject} from '@angular/core';

@Directive({
  selector: '[roleButton]',
})
export class RoleButtonDirective {
  private tagName = inject(HOST_TAG_NAME);

  onAction() {
    switch (this.tagName) {
      case 'button':
        // Trata a ação de botão
        break;
      case 'a':
        // Trata a ação de link
        break;
      default:
        // Trata outros elementos
        break;
    }
  }
}
```

NOTE: Se o elemento host talvez não tenha um nome de tag (por exemplo, `ng-container` ou `ng-template`), torne a injeção opcional.

## Resolver dependências circulares com uma referência forward {#resolve-circular-dependencies-with-a-forward-reference}

Em TypeScript, a ordem de declaração das classes importa.
Você não pode referenciar uma classe diretamente antes de defini-la.

Isso geralmente não é um problema, especialmente se você seguir a regra recomendada de _uma classe por arquivo_.
Porém, em alguns casos, referências circulares são inevitáveis.
Por exemplo, se a classe 'A' se refere à classe 'B' e a classe 'B' se refere à classe 'A', uma delas precisa ser definida primeiro.

A função `forwardRef()` do Angular cria uma referência _indireta_ que o Angular pode resolver depois.

Você enfrenta um problema semelhante quando uma classe faz _uma referência a si mesma_.
Por exemplo, no seu array `providers`.
O array `providers` é uma propriedade do decorator de função `@Component()`, que precisa aparecer antes da definição da classe.
Essas referências circulares podem ser resolvidas usando `forwardRef`.

```typescript {header: 'app.component.ts', highlight: [4]}
providers: [
  {
    provide: PARENT_MENU_ITEM,
    useExisting: forwardRef(() => MenuItem),
  },
],
```
