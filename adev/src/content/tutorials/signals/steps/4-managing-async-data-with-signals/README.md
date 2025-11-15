<!-- ia-translate: true -->
# Gerenciando dados assíncronos com signals usando a API Resources

Agora que você aprendeu [como derivar estado com linked signals](/tutorials/signals/3-deriving-state-with-linked-signals), vamos explorar como lidar com dados assíncronos com a API Resource. A API Resource fornece uma maneira poderosa de gerenciar operações assíncronas usando signals, com estados de carregamento integrados, tratamento de erros e gerenciamento de requisições.

Nesta atividade, você aprenderá como usar a função `resource()` para carregar dados de forma assíncrona e como lidar com diferentes estados de operações assíncronas construindo um carregador de perfil de usuário que demonstra a API Resource em ação.

<hr />

<docs-workflow>

<docs-step title="Importe a função resource e a API">
Adicione `resource` aos seus imports existentes e importe a função da API simulada.

```ts
// Adicione resource aos imports existentes
import {Component, signal, computed, resource, ChangeDetectionStrategy} from '@angular/core';
// Importe a função da API simulada
import {loadUser} from './user-api';
```

</docs-step>

<docs-step title="Crie um resource para dados de usuário">
Adicione uma propriedade na classe do componente que cria um resource para carregar dados de usuário com base em um signal de ID de usuário.

```ts
userId = signal(1);

userResource = resource({
  params: () => ({ id: this.userId() }),
  loader: (params) => loadUser(params.params.id)
});
```

</docs-step>

<docs-step title="Adicione métodos para interagir com o resource">
Adicione métodos para mudar o ID do usuário e recarregar o resource.

```ts
loadUser(id: number) {
  this.userId.set(id);
}

reloadUser() {
  this.userResource.reload();
}
```

Mudar o signal params automaticamente dispara um reload, ou você pode recarregar manualmente com `reload()`.
</docs-step>

<docs-step title="Crie computed signals para estados do resource">
Adicione computed signals para acessar diferentes estados do resource.

```ts
isLoading = computed(() => this.userResource.status() === 'loading');
hasError = computed(() => this.userResource.status() === 'error');
```

Resources fornecem um signal `status()` que pode ser 'loading', 'success' ou 'error', um signal `value()` para os dados carregados e um método `hasValue()` que verifica com segurança se os dados estão disponíveis.
</docs-step>

<docs-step title="Conecte os botões e exiba os estados do resource">
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

O resource fornece diferentes métodos para verificar seu estado:

- `isLoading()` - verdadeiro quando estiver buscando dados
- `hasError()` - verdadeiro quando ocorreu um erro
- `userResource.hasValue()` - verdadeiro quando os dados estão disponíveis
- `userResource.value()` - acessa os dados carregados
- `userResource.error()` - acessa informações de erro

</docs-step>

</docs-workflow>

Excelente! Agora você aprendeu como usar a API Resource com signals. Conceitos-chave para lembrar:

- **Resources são reativos**: Eles recarregam automaticamente quando os params mudam
- **Gerenciamento de estado integrado**: Resources fornecem signals `status()`, `value()` e `error()`
- **Limpeza automática**: Resources lidam com cancelamento de requisições e limpeza automaticamente
- **Controle manual**: Você pode recarregar ou abortar requisições manualmente quando necessário

Na próxima lição, você aprenderá [como passar dados para componentes com input signals](/tutorials/signals/5-component-communication-with-signals)!
