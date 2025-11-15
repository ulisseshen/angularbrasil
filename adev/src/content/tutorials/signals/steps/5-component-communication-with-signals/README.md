<!-- ia-translate: true -->
# Passando dados para componentes com input signals

Agora que você aprendeu [gerenciar dados assíncronos com signals](/tutorials/signals/4-managing-async-data-with-signals), vamos explorar a API `input()` baseada em signals do Angular para passar dados de componentes pai para filhos, tornando o fluxo de dados de componentes mais reativo e eficiente. Se você está familiarizado com props de componentes de outros frameworks, inputs são a mesma ideia.

Nesta atividade, você adicionará signal inputs a um componente de cartão de produto e verá como os dados do pai fluem reativamente para baixo.

<hr />

<docs-workflow>

<docs-step title="Adicione signal inputs ao ProductCard">
Adicione funções signal `input()` para receber dados no componente `product-card`.

```ts
// Adicione imports para signal inputs
import {Component, input} from '@angular/core';

// Adicione estes signal inputs
name = input.required<string>();
price = input.required<number>();
available = input<boolean>(true);
```

Note como `input.required()` cria um input que deve ser fornecido, enquanto `input()` com um valor padrão é opcional.
</docs-step>

<docs-step title="Conecte inputs ao template">
Atualize o template em `product-card` para exibir os valores dos signal inputs.

```angular-html
<div class="product-card">
  <h3>{{ name() }}</h3>
  <p class="price">\${{ price() }}</p>
  <p class="status">Status:
    @if (available()) {
      Available
    } @else {
      Out of Stock
    }
  </p>
</div>
```

Input signals funcionam como signals regulares em templates - chame-os como funções para acessar seus valores.
</docs-step>

<docs-step title="Conecte signals do pai aos inputs do filho">
Atualize o uso de `product-card` em `app.ts` para passar valores de signals dinâmicos em vez de estáticos.

```html
<!-- Mude de valores estáticos: -->
<product-card
  name="Static Product"
  price="99"
  available="true"
/>

<!-- Para signals dinâmicos: -->
<product-card
  [name]="productName()"
  [price]="productPrice()"
  [available]="productAvailable()"
/>
```

Os colchetes `[]` criam property bindings que passam os valores atuais dos signals para o filho.
</docs-step>

<docs-step title="Teste atualizações reativas">
Adicione métodos em `app.ts` para atualizar os signals do pai e veja como o componente filho reage automaticamente.

```ts
updateProduct() {
  this.productName.set('Updated Product');
  this.productPrice.set(149);
}

toggleAvailability() {
  this.productAvailable.set(!this.productAvailable());
}
```

```html
<!-- Adicione controles para testar a reatividade -->
<div class="controls">
  <button (click)="updateProduct()">Update Product Info</button>
  <button (click)="toggleAvailability()">Toggle Availability</button>
</div>
```

Quando os signals do pai mudam, o componente filho automaticamente recebe e exibe os novos valores!
</docs-step>

</docs-workflow>

Excelente! Você aprendeu como signal inputs funcionam:

- **Signal inputs** - Use `input()` e `input.required()` para receber dados de componentes pai
- **Atualizações reativas** - Componentes filho se atualizam automaticamente quando valores de signals do pai mudam
- **Segurança de tipo** - Signal inputs fornecem verificação completa de tipo TypeScript
- **Valores padrão** - Inputs opcionais podem ter valores padrão enquanto inputs obrigatórios devem ser fornecidos

Signal inputs tornam a comunicação entre componentes mais reativa e eliminam a necessidade de lifecycle hooks `OnChanges` em muitos casos.

Na próxima lição, você aprenderá sobre [vinculação bidirecional com model signals](/tutorials/signals/6-two-way-binding-with-model-signals)!
