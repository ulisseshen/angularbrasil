<!-- ia-translate: true -->
# Usando APIs DOM

TIP: Este guia pressupõe que você já leu o [Guia de Fundamentos](essentials). Leia-o primeiro se você é novo no Angular.

O Angular cuida da maior parte da criação, atualização e remoção do DOM para você. No entanto, você raramente precisará interagir diretamente com o DOM de um component. Components podem injetar ElementRef para obter uma referência ao elemento host do component:

```ts
@Component(/* ... */)
export class ProfilePhoto {
  constructor() {
    const elementRef = inject(ElementRef);
    console.log(elementRef.nativeElement);
  }
}
```

A propriedade `nativeElement` faz referência à instância [Element](https://developer.mozilla.org/docs/Web/API/Element) do host.

Você pode usar as funções `afterEveryRender` e `afterNextRender` do Angular para registrar um **render callback** (callback de renderização) que é executado quando o Angular termina de renderizar a página.

```ts
@Component(/* ... */)
export class ProfilePhoto {
  constructor() {
    const elementRef = inject(ElementRef);
    afterEveryRender(() => {
      // Foca o primeiro elemento input deste component.
      elementRef.nativeElement.querySelector('input')?.focus();
    });
  }
}
```

`afterEveryRender` e `afterNextRender` devem ser chamados em um _contexto de injeção_, normalmente no constructor de um component.

**Evite manipulação direta do DOM sempre que possível.** Sempre prefira expressar a estrutura do DOM nos templates dos components e atualizar esse DOM com bindings.

**Render callbacks nunca são executados durante a renderização no servidor ou a pré-renderização em tempo de build.**

**Nunca manipule o DOM diretamente dentro de outros hooks de ciclo de vida do Angular**. O Angular não garante que o DOM de um component esteja totalmente renderizado em nenhum momento que não seja dentro de render callbacks. Além disso, ler ou modificar o DOM durante outros hooks de ciclo de vida pode prejudicar o desempenho da página ao causar [layout thrashing](https://web.dev/avoid-large-complex-layouts-and-layout-thrashing).

## Usando o renderer de um component {#using-a-components-renderer}

Components podem injetar uma instância de `Renderer2` para realizar certas manipulações do DOM que estão ligadas a outros recursos do Angular.

Quaisquer elementos DOM criados pelo `Renderer2` de um component participam do [encapsulamento de estilo](guide/components/styling#style-scoping) desse component.

Algumas APIs do `Renderer2` também se integram ao sistema de animações do Angular. Você pode usar o método `setProperty` para atualizar propriedades de animação sintéticas e o método `listen` para adicionar event listeners para eventos de animação sintéticos. Consulte o guia de [Animações](guide/animations) para mais detalhes.

Fora esses dois casos de uso específicos, não há diferença entre usar `Renderer2` e as APIs DOM nativas. Ambas funcionam na renderização no servidor e na pré-renderização em tempo de build, mas o DOM do servidor não possui APIs exclusivas do navegador, como medição de layout e observers.

## Quando usar APIs DOM {#when-to-use-dom-apis}

Embora o Angular cuide da maioria das questões de renderização, alguns comportamentos ainda podem exigir o uso de APIs DOM. Alguns casos de uso comuns incluem:

- Gerenciar o foco de um elemento
- Medir a geometria de um elemento, como com `getBoundingClientRect`
- Ler o conteúdo de texto de um elemento
- Configurar observers nativos, como [`MutationObserver`](https://developer.mozilla.org/docs/Web/API/MutationObserver), [`ResizeObserver`](https://developer.mozilla.org/docs/Web/API/ResizeObserver) ou [`IntersectionObserver`](https://developer.mozilla.org/docs/Web/API/Intersection_Observer_API).

Evite inserir, remover e modificar elementos DOM. Em particular, **nunca defina diretamente a propriedade `innerHTML` de um elemento**, pois isso pode tornar sua aplicação vulnerável a [explorações de cross-site scripting (XSS)](https://developer.mozilla.org/docs/Glossary/Cross-site_scripting). Os bindings de template do Angular, incluindo os bindings para `innerHTML`, incluem proteções que ajudam a proteger contra ataques XSS. Consulte o [guia de Segurança](best-practices/security) para mais detalhes.
