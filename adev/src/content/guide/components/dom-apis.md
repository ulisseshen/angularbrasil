<!-- ia-translate: true -->
# Usando APIs DOM

TIP: Este guia pressupõe que você já leu o [Guia de Fundamentos](essentials). Leia-o primeiro se você é novo no Angular.

O Angular lida com a maioria das criações, atualizações e remoções do DOM para você. No entanto, você pode raramente precisar interagir diretamente com o DOM de um component. Components podem injetar ElementRef para obter uma referência ao elemento host do component:

```ts
@Component({...})
export class ProfilePhoto {
  constructor() {
    const elementRef = inject(ElementRef);
    console.log(elementRef.nativeElement);
  }
}
```

A propriedade `nativeElement` referencia a instância [Element](https://developer.mozilla.org/docs/Web/API/Element) do host.

Você pode usar as funções `afterEveryRender` e `afterNextRender` do Angular para registrar um **callback de renderização** que é executado quando o Angular termina de renderizar a página.

```ts
@Component({...})
export class ProfilePhoto {
  constructor() {
    const elementRef = inject(ElementRef);
    afterEveryRender(() => {
      // Focus the first input element in this component.
      elementRef.nativeElement.querySelector('input')?.focus();
    });
  }
}
```

`afterEveryRender` e `afterNextRender` devem ser chamados em um _contexto de injeção_, tipicamente no constructor de um component.

**Evite manipulação direta do DOM sempre que possível.** Sempre prefira expressar a estrutura do seu DOM em templates de component e atualizar esse DOM com bindings.

**Callbacks de renderização nunca são executados durante renderização no servidor ou pré-renderização em tempo de build.**

**Nunca manipule diretamente o DOM dentro de outros hooks de ciclo de vida do Angular**. O Angular não garante que o DOM de um component esteja totalmente renderizado em qualquer ponto que não seja em callbacks de renderização. Além disso, ler ou modificar o DOM durante outros hooks de ciclo de vida pode impactar negativamente o desempenho da página causando [layout thrashing](https://web.dev/avoid-large-complex-layouts-and-layout-thrashing).

## Usando o renderer de um component

Components podem injetar uma instância de `Renderer2` para realizar certas manipulações do DOM que estão vinculadas a outras funcionalidades do Angular.

Quaisquer elementos DOM criados pelo `Renderer2` de um component participam do [encapsulamento de estilo](guide/components/styling#style-scoping) daquele component.

Certas APIs do `Renderer2` também se vinculam ao sistema de animação do Angular. Você pode usar o método `setProperty` para atualizar propriedades de animação sintéticas e o método `listen` para adicionar event listeners para eventos de animação sintéticos. Consulte o guia de [Animações](guide/animations) para detalhes.

Além desses dois casos de uso específicos, não há diferença entre usar `Renderer2` e APIs DOM nativas. As APIs do `Renderer2` não suportam manipulação do DOM em contextos de renderização no servidor ou pré-renderização em tempo de build.

## Quando usar APIs DOM

Embora o Angular lide com a maioria das preocupações de renderização, alguns comportamentos ainda podem exigir o uso de APIs DOM. Alguns casos de uso comuns incluem:

- Gerenciar o foco do elemento
- Medir a geometria do elemento, como com `getBoundingClientRect`
- Ler o conteúdo de texto de um elemento
- Configurar observers nativos como [`MutationObserver`](https://developer.mozilla.org/docs/Web/API/MutationObserver), [`ResizeObserver`](https://developer.mozilla.org/docs/Web/API/ResizeObserver) ou [`IntersectionObserver`](https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API).

Evite inserir, remover e modificar elementos DOM. Em particular, **nunca defina diretamente a propriedade `innerHTML` de um elemento**, o que pode tornar sua aplicação vulnerável a [explorações de cross-site scripting (XSS)](https://developer.mozilla.org/docs/Glossary/Cross-site_scripting). Os bindings de template do Angular, incluindo bindings para `innerHTML`, incluem proteções que ajudam a proteger contra ataques XSS. Consulte o [guia de Segurança](best-practices/security) para detalhes.
