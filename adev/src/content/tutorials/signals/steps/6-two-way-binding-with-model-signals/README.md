<!-- ia-translate: true -->
# Vinculação bidirecional com model signals {#two-way-binding-with-model-signals}

Agora que você aprendeu [a passar dados para componentes com input signals](/tutorials/signals/5-component-communication-with-signals), vamos explorar a API `model()` do Angular para vinculação bidirecional. Model signals são perfeitos para componentes de UI como checkboxes, sliders ou controles de formulário personalizados, onde o componente precisa tanto receber um valor QUANTO atualizá-lo.

Nesta atividade, você vai criar um componente de checkbox personalizado que gerencia o próprio estado enquanto mantém o pai sincronizado.

<hr />

<docs-workflow>

<docs-step title="Configure o checkbox personalizado com model signal {#set-up-the-custom-checkbox-with-model-signal}">
Crie um model signal no componente `custom-checkbox` que pode tanto receber quanto atualizar o valor do pai.

```ts
// Adicione os imports para model signals
import {Component, model, input, ChangeDetectionStrategy} from '@angular/core';

// Model signal para vinculação bidirecional
checked = model.required<boolean>();

// Input opcional para o label
label = input<string>('');
```

Diferente dos signals `input()`, que são somente leitura, os signals `model()` podem ser tanto lidos quanto escritos.
</docs-step>

<docs-step title="Crie o template do checkbox {#create-the-checkbox-template}">
Construa o template do checkbox que responde a cliques e atualiza o próprio model.

```html
<label class="custom-checkbox">
  <input type="checkbox" [checked]="checked()" (change)="toggle()" />
  <span class="checkmark"></span>
  {{ label() }}
</label>
```

O componente lê do seu model signal e tem um método para atualizá-lo.
</docs-step>

<docs-step title="Adicione o método toggle {#add-the-toggle-method}">
Implemente o método toggle que atualiza o model signal quando o checkbox é clicado.

```ts
toggle() {
  // Isso atualiza TANTO o estado do componente QUANTO o model do pai!
  this.checked.set(!this.checked());
}
```

Quando o componente filho chama `this.checked.set()`, ele propaga automaticamente a mudança de volta para o pai. Esta é a diferença-chave em relação aos signals `input()`.
</docs-step>

<docs-step title="Configure a vinculação bidirecional no pai {#set-up-two-way-binding-in-the-parent}">
Primeiro, descomente as propriedades de model signal e os métodos em `app.ts`:

```ts
// Parent signal models
agreedToTerms = model(false);
enableNotifications = model(true);

// Métodos para testar a vinculação bidirecional
toggleTermsFromParent() {
  this.agreedToTerms.set(!this.agreedToTerms());
}

resetAll() {
  this.agreedToTerms.set(false);
  this.enableNotifications.set(false);
}
```

Depois, atualize o template:

Parte 1. **Descomente os checkboxes e adicione a vinculação bidirecional:**

- Substitua `___ADD_TWO_WAY_BINDING___` por `[(checked)]="agreedToTerms"` no primeiro checkbox
- Substitua `___ADD_TWO_WAY_BINDING___` por `[(checked)]="enableNotifications"` no segundo

Parte 2. **Substitua os placeholders `???` por blocos @if:**

```angular-html
@if (agreedToTerms()) {
  Yes
} @else {
  No
}

@if (enableNotifications()) {
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

A sintaxe `[(checked)]` cria a vinculação bidirecional: os dados fluem para baixo, para o componente, E as mudanças voltam para o pai emitindo um evento que referencia o próprio signal e _não_ chama diretamente o getter do signal.
</docs-step>

<docs-step title="Teste a vinculação bidirecional {#test-the-two-way-binding}">
Interaja com a sua aplicação para ver a vinculação bidirecional em ação:

1. **Clique nos checkboxes** - O componente atualiza o próprio estado e notifica o pai
2. **Clique em "Toggle Terms from Parent"** - As atualizações do pai se propagam para o componente
3. **Clique em "Reset All"** - O pai redefine ambos os models e os componentes se atualizam automaticamente

Tanto o pai quanto o filho podem atualizar o estado compartilhado, e ambos permanecem sincronizados automaticamente!
</docs-step>

</docs-workflow>

Perfeito! Você aprendeu como os model signals habilitam a vinculação bidirecional:

- **Model signals** - Use `model()` e `model.required()` para valores que podem ser tanto lidos quanto escritos
- **Vinculação bidirecional** - Use a sintaxe `[(property)]` para vincular signals do pai aos models do filho
- **Perfeito para componentes de UI** - Checkboxes, controles de formulário e widgets que precisam gerenciar o próprio estado
- **Sincronização automática** - Pai e filho permanecem sincronizados sem manipulação manual de eventos

**Quando usar `model()` vs `input()`:**

- Use `input()` para dados que fluem apenas para baixo (dados de exibição, configuração)
- Use `model()` para componentes de UI que precisam atualizar o próprio valor (controles de formulário, toggles)

Na próxima lição, você aprenderá sobre [como usar signals com services](/tutorials/signals/7-using-signals-with-services)!
