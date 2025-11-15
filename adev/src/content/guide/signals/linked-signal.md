<!-- ia-translate: true -->
# Estado dependente com `linkedSignal`

Você pode usar a função `signal` para armazenar algum estado no seu código Angular. Às vezes, este estado depende de algum _outro_ estado. Por exemplo, imagine um component que permite ao usuário selecionar um método de envio para um pedido:

```typescript
@Component({/* ... */})
export class ShippingMethodPicker {
  shippingOptions: Signal<ShippingMethod[]> = getShippingOptions();

  // Select the first shipping option by default.
  selectedOption = signal(this.shippingOptions()[0]);

  changeShipping(newOptionIndex: number) {
    this.selectedOption.set(this.shippingOptions()[newOptionIndex]);
  }
}
```

Neste exemplo, o `selectedOption` usa como padrão a primeira opção, mas muda se o usuário selecionar outra opção. Mas `shippingOptions` é um signal— seu valor pode mudar! Se `shippingOptions` muda, `selectedOption` pode conter um valor que não é mais uma opção válida.

**A função `linkedSignal` permite que você crie um signal para armazenar algum estado que está intrinsecamente _vinculado_ a algum outro estado.** Revisitando o exemplo acima, `linkedSignal` pode substituir `signal`:

```typescript
@Component({/* ... */})
export class ShippingMethodPicker {
  shippingOptions: Signal<ShippingMethod[]> = getShippingOptions();

  // Initialize selectedOption to the first shipping option.
  selectedOption = linkedSignal(() => this.shippingOptions()[0]);

  changeShipping(index: number) {
    this.selectedOption.set(this.shippingOptions()[index]);
  }
}
```

`linkedSignal` funciona de forma similar ao `signal` com uma diferença chave— em vez de passar um valor padrão, você passa uma _função de computação_, assim como `computed`. Quando o valor da computação muda, o valor do `linkedSignal` muda para o resultado da computação. Isso ajuda a garantir que o `linkedSignal` sempre tenha um valor válido.

O exemplo a seguir mostra como o valor de um `linkedSignal` pode mudar com base em seu estado vinculado:

```typescript
const shippingOptions = signal(['Ground', 'Air', 'Sea']);
const selectedOption = linkedSignal(() => shippingOptions()[0]);
console.log(selectedOption()); // 'Ground'

selectedOption.set(shippingOptions()[2]);
console.log(selectedOption()); // 'Sea'

shippingOptions.set(['Email', 'Will Call', 'Postal service']);
console.log(selectedOption()); // 'Email'
```

## Considerando o estado anterior

Em alguns casos, a computação para um `linkedSignal` precisa considerar o valor anterior do `linkedSignal`.

No exemplo acima, `selectedOption` sempre atualiza de volta para a primeira opção quando `shippingOptions` muda. Você pode, no entanto, querer preservar a seleção do usuário se sua opção selecionada ainda estiver em algum lugar da lista. Para realizar isso, você pode criar um `linkedSignal` com uma _source_ e _computation_ separadas:

```typescript
interface ShippingMethod {
  id: number;
  name: string;
}

@Component({/* ... */})
export class ShippingMethodPicker {
  constructor() {
    this.changeShipping(2);
    this.changeShippingOptions();
    console.log(this.selectedOption()); // {"id":2,"name":"Postal Service"}
  }

  shippingOptions = signal<ShippingMethod[]>([
    { id: 0, name: 'Ground' },
    { id: 1, name: 'Air' },
    { id: 2, name: 'Sea' },
  ]);

  selectedOption = linkedSignal<ShippingMethod[], ShippingMethod>({
    // `selectedOption` is set to the `computation` result whenever this `source` changes.
    source: this.shippingOptions,
    computation: (newOptions, previous) => {
      // If the newOptions contain the previously selected option, preserve that selection.
      // Otherwise, default to the first option.
      return (
        newOptions.find((opt) => opt.id === previous?.value.id) ?? newOptions[0]
      );
    },
  });

  changeShipping(index: number) {
    this.selectedOption.set(this.shippingOptions()[index]);
  }

  changeShippingOptions() {
    this.shippingOptions.set([
      { id: 0, name: 'Email' },
      { id: 1, name: 'Sea' },
      { id: 2, name: 'Postal Service' },
    ]);
  }
}
```

Quando você cria um `linkedSignal`, você pode passar um objeto com propriedades `source` e `computation` separadas em vez de fornecer apenas uma computação.

A `source` pode ser qualquer signal, como um `computed` ou `input` de component. Quando o valor de `source` muda, `linkedSignal` atualiza seu valor para o resultado da `computation` fornecida.

A `computation` é uma função que recebe o novo valor de `source` e um objeto `previous`. O objeto `previous` tem duas propriedades— `previous.source` é o valor anterior de `source`, e `previous.value` é o valor anterior do `linkedSignal`. Você pode usar esses valores anteriores para decidir o novo resultado da computação.

HELPFUL: Ao usar o parâmetro `previous`, é necessário fornecer os argumentos de tipo genérico de `linkedSignal` explicitamente. O primeiro tipo genérico corresponde ao tipo de `source` e o segundo tipo genérico determina o tipo de saída de `computation`.

## Comparação de igualdade customizada

`linkedSignal`, como qualquer outro signal, pode ser configurado com uma função de igualdade customizada. Esta função é usada por dependências downstream para determinar se o valor do `linkedSignal` (resultado de uma computação) mudou:

```typescript
const activeUser = signal({id: 123, name: 'Morgan', isAdmin: true});

const activeUserEditCopy = linkedSignal(() => activeUser(), {
  // Consider the user as the same if it's the same `id`.
  equal: (a, b) => a.id === b.id,
});

// Or, if separating `source` and `computation`
const activeUserEditCopy = linkedSignal({
  source: activeUser,
  computation: user => user,
  equal: (a, b) => a.id === b.id,
});
```
