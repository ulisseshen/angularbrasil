<!-- ia-translate: true -->
# Animations reutilizáveis {#reusable-animations}

IMPORTANTE: O pacote `@angular/animations` agora está depreciado. A equipe Angular recomenda usar CSS nativo com `animate.enter` e `animate.leave` para animations em todo código novo. Saiba mais no novo [guia de animations](guide/animations) de entrada e saída. Veja também [Migrando do pacote de Animations do Angular](guide/animations/migration) para aprender como você pode começar a migrar para animations CSS puras em suas aplicações.

Este tópico fornece exemplos de como criar animations reutilizáveis.

## Criar animations reutilizáveis {#create-reusable-animations}

Para criar uma animation reutilizável, use a função [`animation()`](api/animations/animation) para definir uma animation em um arquivo `.ts` separado e declare esta definição de animation como uma variável `const` exportada.
Você pode então importar e reutilizar esta animation nos components da sua aplicação usando a função [`useAnimation()`](api/animations/useAnimation).

<docs-code header="animations.ts" path="adev/src/content/examples/animations/src/app/animations.1.ts" region="animation-const"/>

No trecho de código anterior, `transitionAnimation` se torna reutilizável ao ser declarada como uma variável exportada.

ÚTIL: Os inputs `height`, `opacity`, `backgroundColor` e `time` são substituídos durante o runtime.

Você também pode exportar parte de uma animation.
Por exemplo, o trecho a seguir exporta o `trigger` da animation.

<docs-code header="animations.ts" path="adev/src/content/examples/animations/src/app/animations.1.ts" region="trigger-const"/>

A partir deste ponto, você pode importar variáveis de animation reutilizáveis na classe do seu component.
Por exemplo, o trecho de código a seguir importa a variável `transitionAnimation` e a usa através da função `useAnimation()`.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.3.ts" region="reusable"/>

## Mais sobre animations do Angular {#more-on-angular-animations}

Você também pode se interessar pelos seguintes conteúdos:

<docs-pill-row>
  <docs-pill href="guide/legacy-animations" title="Introdução às animations do Angular"/>
  <docs-pill href="guide/legacy-animations/transition-and-triggers" title="Transition e triggers"/>
  <docs-pill href="guide/legacy-animations/complex-sequences" title="Sequências complexas de animation"/>
  <docs-pill href="guide/routing/route-transition-animations" title="Animations de transição de rotas"/>
  <docs-pill href="guide/animations/migration" title="Migrando para Animations CSS Nativas"/>
</docs-pill-row>
