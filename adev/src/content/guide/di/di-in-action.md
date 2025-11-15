<!-- ia-translate: true -->
# DI em ação

Este guia explora recursos adicionais de dependency injection no Angular.

NOTA: Para cobertura abrangente de InjectionToken e providers customizados, veja o [guia de definição de providers de dependência](guide/di/defining-dependency-providers#injection-tokens).

## Injetar o elemento DOM do component

Embora desenvolvedores se esforcem para evitar isso, alguns efeitos visuais e ferramentas de terceiros requerem acesso direto ao DOM.
Como resultado, você pode precisar acessar o elemento DOM de um component.

O Angular expõe o elemento subjacente de um `@Component` ou `@Directive` via injeção usando o token de injeção `ElementRef`:

<docs-code language="typescript" highlight="[7]">
import { Directive, ElementRef } from '@angular/core';

@Directive({
selector: '[appHighlight]'
})
export class HighlightDirective {
private element = inject(ElementRef)

update() {
this.element.nativeElement.style.color = 'red';
}
}
</docs-code>

## Resolver dependências circulares com uma referência forward

A ordem de declaração de classe importa no TypeScript.
Você não pode se referir diretamente a uma classe até que ela tenha sido definida.

Isso geralmente não é um problema, especialmente se você adere à regra recomendada de _uma classe por arquivo_.
Mas às vezes referências circulares são inevitáveis.
Por exemplo, quando a classe 'A' se refere à classe 'B' e 'B' se refere a 'A', uma delas tem que ser definida primeiro.

A função `forwardRef()` do Angular cria uma referência _indireta_ que o Angular pode resolver posteriormente.

Você enfrenta um problema similar quando uma classe faz _uma referência a si mesma_.
Por exemplo, no seu array `providers`.
O array `providers` é uma propriedade da função decorator `@Component()`, que deve aparecer antes da definição da classe.
Você pode quebrar tais referências circulares usando `forwardRef`.

<docs-code header="app.component.ts" language="typescript" highlight="[4]">
providers: [
  {
    provide: PARENT_MENU_ITEM,
    useExisting: forwardRef(() => MenuItem),
  },
],
</docs-code>
