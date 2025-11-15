<!-- ia-translate: true -->
# Vinculação bidirecional com model signals

Agora que você aprendeu [passar dados para componentes com input signals](/tutorials/signals/5-component-communication-with-signals), vamos explorar a API `model()` do Angular para vinculação bidirecional. Model signals são perfeitos para componentes de UI como checkboxes, sliders ou controles de formulário personalizados onde o componente precisa tanto receber um valor QUANTO atualizá-lo.

Nesta atividade, você criará um componente de checkbox personalizado que gerencia seu próprio estado enquanto mantém o pai sincronizado.

<hr />

<docs-workflow>

<docs-step title="Configure o checkbox personalizado com model signal">
Crie um model signal no componente `custom-checkbox` que pode tanto receber quanto atualizar o valor do pai.

```ts
// Adicione imports para model signals
import {Component, model, input} from '@angular/core';

// Model signal para vinculação bidirecional
checked = model.required<boolean>();

// Input opcional para label
label = input<string>('');
```

Diferente de signals `input()` que são somente leitura, signals `model()` podem ser tanto lidos quanto escritos.
</docs-step>

<docs-step title="Crie o template do checkbox">
Construa o template do checkbox que responde a cliques e atualiza seu próprio model.

```html
<label class="custom-checkbox">
  <input
    type="checkbox"
    [checked]="checked()"
    (change)="toggle()">
  <span class="checkmark"></span>
  {{ label() }}
</label>
```

O componente lê do seu model signal e tem um método para atualizá-lo.
</docs-step>

<docs-step title="Adicione o método toggle">
Implemente o método toggle que atualiza o model signal quando o checkbox é clicado.

```ts
toggle() {
  // Isso atualiza TANTO o estado do componente QUANTO o model do pai!
  this.checked.set(!this.checked());
}
```

Quando o componente filho chama `this.checked.set()`, ele automaticamente propaga a mudança de volta para o pai. Esta é a diferença chave de signals `input()`.
</docs-step>

<docs-step title="Configure a vinculação bidirecional no pai">
Primeiro, descomente as propriedades de model signal e métodos em `app.ts`:

```ts
// Parent signal models
agreedToTerms = model(false);
enableNotifications = model(true);

// Métodos para testar vinculação bidirecional
toggleTermsFromParent() {
  this.agreedToTerms.set(!this.agreedToTerms());
}

resetAll() {
  this.agreedToTerms.set(false);
  this.enableNotifications.set(false);
}
```

Então atualize o template:

Parte 1. **Descomente os checkboxes e adicione vinculação bidirecional:**

- Substitua `___ADD_TWO_WAY_BINDING___` por `[(checked)]="agreedToTerms"` para o primeiro checkbox
- Substitua `___ADD_TWO_WAY_BINDING___` por `[(checked)]="enableNotifications"` para o segundo

Parte 2. **Substitua os placeholders `???` por blocos @if:**

```angular-html
@if (agreedToTerms()) {
  Yes
} @else {
  No
}
```

Parte 3. **Adicione manipuladores de clique aos botões:**

```html
<button (click)="toggleTermsFromParent()">Toggle Terms from Parent</button>
<button (click)="resetAll()">Reset All</button>
```

A sintaxe `[(checked)]` cria vinculação bidirecional - dados fluem para baixo para o componente E mudanças fluem de volta para o pai emitindo um evento que referencia o próprio signal e _não_ chama o getter do signal diretamente.
</docs-step>

<docs-step title="Teste a vinculação bidirecional">
Interaja com sua aplicação para ver a vinculação bidirecional em ação:

1. **Clique nos checkboxes** - Componente atualiza seu próprio estado e notifica o pai
2. **Clique em "Toggle Terms from Parent"** - Atualizações do pai se propagam para o componente
3. **Clique em "Reset All"** - Pai reseta ambos os models e os componentes se atualizam automaticamente

Tanto o pai quanto o filho podem atualizar o estado compartilhado, e ambos permanecem sincronizados automaticamente!
</docs-step>

</docs-workflow>

Perfeito! Você aprendeu como model signals habilitam vinculação bidirecional:

- **Model signals** - Use `model()` e `model.required()` para valores que podem ser tanto lidos quanto escritos
- **Vinculação bidirecional** - Use a sintaxe `[(property)]` para vincular signals do pai aos models do filho
- **Perfeito para componentes de UI** - Checkboxes, controles de formulário e widgets que precisam gerenciar seu próprio estado
- **Sincronização automática** - Pai e filho permanecem sincronizados sem manipulação manual de eventos

**Quando usar `model()` vs `input()`:**

- Use `input()` para dados que fluem apenas para baixo (dados de exibição, configuração)
- Use `model()` para componentes de UI que precisam atualizar seu próprio valor (controles de formulário, toggles)

Na próxima lição, você aprenderá sobre [usar signals com services](/tutorials/signals/7-using-signals-with-services)!
