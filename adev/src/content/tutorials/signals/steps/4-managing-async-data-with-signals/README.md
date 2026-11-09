<!-- ia-translate: true -->
# Gerenciando dados assíncronos com signals usando a API Resource

Agora que você aprendeu [como derivar estado com linked signals](/tutorials/signals/3-deriving-state-with-linked-signals), vamos explorar como lidar com dados assíncronos com a API Resource. A API Resource fornece uma maneira poderosa de gerenciar operações assíncronas usando signals, com estados de carregamento integrados, tratamento de erros e gerenciamento de requisições.

Nesta atividade, você aprenderá como usar a função `resource()` para carregar dados de forma assíncrona e como lidar com diferentes estados de operações assíncronas construindo um carregador de perfil de usuário que demonstra a API Resource em ação.

<hr />

<docs-workflow>

<docs-step title="Importe a função resource e a API {#import-resource-function-and-api}">
Adicione `resource` aos seus imports existentes e importe a função de API simulada.

```ts
// Adicione resource aos imports existentes
import {Component, signal, computed, resource, ChangeDetectionStrategy} from '@angular/core';
// Importe a função de API simulada
import {getUserData} from './user-api';
```

</docs-step>

<docs-step title="Crie um resource para os dados do usuário {#create-a-resource-for-user-data}">
Adicione uma propriedade na classe do component que cria um resource para carregar os dados do usuário com base em um signal de ID de usuário.

```ts
userId = signal(1);

userResource = resource({
  params: () => ({id: this.userId()}),
  loader: (params) => getUserData(params.params.id),
});
```

</docs-step>

<docs-step title="Adicione métodos para interagir com o resource {#add-methods-to-interact-with-the-resource}">
Adicione métodos para alterar o ID do usuário e recarregar o resource.

```ts
loadUser(id: number) {
  this.userId.set(id);
}

reloadUser() {
  this.userResource.reload();
}
```

Alterar o signal de params dispara um reload automaticamente, ou você pode recarregar manualmente com `reload()`.
</docs-step>

<docs-step title="Crie computed signals para os estados do resource {#create-computed-signals-for-resource-states}">
Adicione computed signals para acessar os diferentes estados do resource.

```ts
isLoading = this.userResource.isLoading;
hasError = computed(() => this.userResource.status() === 'error');
```

Resources fornecem um signal `status()` que pode ser `'loading'`, `'reloading'`, `'resolved'` ou `'error'`, um signal `value()` para os dados carregados e um método `hasValue()` que verifica com segurança se os dados estão disponíveis. O signal `isLoading()` é verdadeiro tanto para `'loading'` quanto para `'reloading'`.
</docs-step>

<docs-step title="Conecte os botões e exiba os estados do resource {#wire-up-the-buttons-and-display-resource-states}">
A estrutura do template já está fornecida. Agora conecte tudo:

Parte 1. **Adicione manipuladores de clique aos botões:**

```html
<button (click)="loadUser(1)">Load User 1</button>
<button (click)="loadUser(2)">Load User 2</button>
<button (click)="loadUser(999)">Load Invalid User</button>
<button (click)="reloadUser()">Reload</button>
```

Parte 2. **Substitua o placeholder pelo tratamento de estado do resource:**

```angular-html
@if (isLoading()) {
  <p>Loading user...</p>
} @else if (hasError()) {
  <p class="error">Error: {{ userResource.error()?.message }}</p>
} @else if (userResource.hasValue()) {
  <div class="user-info">
    <h3>{{ userResource.value().name }}</h3>
    <p>{{ userResource.value().email }}</p>
  </div>
}
```

O resource fornece diferentes métodos para verificar o seu estado:

- `isLoading()` - verdadeiro quando está buscando dados
- `hasError()` - verdadeiro quando ocorreu um erro
- `userResource.hasValue()` - verdadeiro quando os dados estão disponíveis
- `userResource.value()` - acessa os dados carregados
- `userResource.error()` - acessa as informações de erro

</docs-step>

</docs-workflow>

Excelente! Agora você aprendeu como usar a API Resource com signals. Conceitos-chave para lembrar:

- **Resources são reativos**: Eles recarregam automaticamente quando os params mudam
- **Gerenciamento de estado integrado**: Resources fornecem os signals `status()`, `value()` e `error()`
- **Limpeza automática**: Resources cuidam do cancelamento de requisições e da limpeza automaticamente
- **Controle manual**: Você pode recarregar ou abortar requisições manualmente quando necessário

Na próxima lição, você aprenderá [como passar dados para componentes com input signals](/tutorials/signals/5-component-communication-with-signals)!
