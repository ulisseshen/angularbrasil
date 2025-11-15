<!-- ia-translate: true -->
# Consulte elementos filhos com signal queries

Agora que você aprendeu [como usar signals com directives](/tutorials/signals/8-using-signals-with-directives), vamos explorar APIs de query baseadas em signal. Elas fornecem uma maneira reativa de acessar e interagir com components e directives filhos. Tanto components quanto directives podem realizar queries, ao mesmo tempo que também podem ser consultados. Ao contrário do ViewChild tradicional, signal queries atualizam automaticamente e fornecem acesso type-safe a components e directives filhos.

Nesta atividade, você adicionará viewChild queries para interagir com components filhos programaticamente.

<hr />

<docs-workflow>

<docs-step title="Adicione o import viewChild">
Primeiro, adicione o import `viewChild` para acessar components filhos em `app.ts`.

```ts
import {Component, signal, computed, viewChild, ChangeDetectionStrategy} from '@angular/core';
```

</docs-step>

<docs-step title="Crie viewChild queries">
Adicione viewChild queries ao component App para acessar components filhos.

```ts
// Query APIs to access child components
firstProduct = viewChild(ProductCard);
cartSummary = viewChild(CartSummary);
```

Essas queries criam signals que referenciam instâncias de component filho.
</docs-step>

<docs-step title="Implemente métodos do pai">
Use as viewChild queries para chamar métodos em components filhos em `app.ts`:

```ts
showFirstProductDetails() {
  const product = this.firstProduct();
  if (product) {
    product.highlight();
  }
}

initiateCheckout() {
  const summary = this.cartSummary();
  if (summary) {
    summary.initiateCheckout();
  }
}
```

</docs-step>

<docs-step title="Teste as interações">
Os botões de controle devem funcionar agora:

- **"Show First Product Details"** - Chama `highlight()` no ProductCard
- **"Initiate Checkout"** - Chama `initiateCheckout()` no CartSummary

Clique nos botões para ver como viewChild queries permitem que components pai controlem o comportamento dos filhos.
</docs-step>

</docs-workflow>

Perfeito! Você aprendeu como usar APIs de query baseadas em signal para interação com components filhos:

Na próxima lição, você aprenderá sobre [como reagir a mudanças de signal com effect](/tutorials/signals/10-reacting-to-signal-changes-with-effect)!
