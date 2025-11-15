<!-- ia-translate: true -->
# Usando signals com services

Agora que você aprendeu [vinculação bidirecional com model signals](/tutorials/signals/6-two-way-binding-with-model-signals), vamos explorar como usar signals com services Angular. Services são perfeitos para compartilhar estado reativo entre múltiplos componentes, e signals tornam isso ainda mais poderoso fornecendo detecção automática de mudanças e padrões reativos limpos.

Nesta atividade, você aprenderá como criar um cart store com signals que permitem que o componente de exibição do carrinho reaja a mudanças de estado automaticamente.

<hr />

<docs-workflow>

<docs-step title="Adicione signals ao cart store">
Adicione signals readonly e computed para tornar o estado do carrinho reativo em `cart-store.ts`.

```ts
// Adicione o import computed
import {Injectable, signal, computed} from '@angular/core';

// Então adicione estes signals à classe:

// Readonly signals
readonly cartItems = this.items.asReadonly();

// Computed signals
readonly totalQuantity = computed(() => {
  return this.items().reduce((sum, item) => sum + item.quantity, 0);
});

readonly totalPrice = computed(() => {
  return this.items().reduce((sum, item) => sum + item.price * item.quantity, 0);
});
```

Esses signals permitem que componentes acessem reativamente dados do carrinho e totais computados. O método `asReadonly()` previne que código externo modifique os itens do carrinho diretamente, enquanto `computed()` cria estado derivado que se atualiza automaticamente quando o signal de origem muda.
</docs-step>

<docs-step title="Complete os métodos de atualização de quantidade">
O componente de exibição do carrinho em `cart-display.ts` já usa os signals do cart store em seu template. Complete os métodos de atualização de quantidade para modificar itens do carrinho:

```ts
increaseQuantity(id: string) {
  const items = this.cartStore.cartItems();
  const currentItem = items.find((item) => item.id === id);
  if (currentItem) {
    this.cartStore.updateQuantity(id, currentItem.quantity + 1);
  }
}

decreaseQuantity(id: string) {
  const items = this.cartStore.cartItems();
  const currentItem = items.find((item) => item.id === id);
  if (currentItem && currentItem.quantity > 1) {
    this.cartStore.updateQuantity(id, currentItem.quantity - 1);
  }
}
```

Esses métodos leem o estado atual do carrinho usando `cartItems()` e atualizam quantidades através dos métodos do store. A UI se atualiza automaticamente quando os signals mudam!
</docs-step>

<docs-step title="Atualize o componente principal da aplicação">
Atualize o componente principal da aplicação em `app.ts` para usar o cart service e exibir o componente do carrinho.

```angular-ts
import {Component, inject} from '@angular/core';
import {CartStore} from './cart-store';
import {CartDisplay} from './cart-display';

@Component({
  selector: 'app-root',
  imports: [CartDisplay],
  template: `
    <div class="shopping-app">
      <header>
        <h1>Signals with Services Demo</h1>
        <div class="cart-badge">
          Cart: {{ cartStore.totalQuantity() }} items (\${{ cartStore.totalPrice() }})
        </div>
      </header>

      <main>
        <cart-display></cart-display>
      </main>
    </div>
  `,
  styleUrl: './app.css',
})
export class App {
  cartStore = inject(CartStore);
}
```

</docs-step>

</docs-workflow>

Excelente! Agora você aprendeu como usar signals com services. Conceitos-chave para lembrar:

- **Signals em nível de service**: Services podem usar signals para gerenciar estado reativo
- **Injeção de dependência**: Use `inject()` para acessar services com signals em componentes
- **Computed signals em services**: Crie estado derivado que se atualiza automaticamente
- **Readonly signals**: Exponha versões somente leitura de signals para prevenir mutações externas

Na próxima lição, você aprenderá sobre [como usar signals com directives](/tutorials/signals/8-using-signals-with-directives)!
