<!-- ia-translate: true -->
# Outras Tarefas Comuns de Routing {#other-common-routing-tasks}

Este guia cobre algumas outras tarefas comuns associadas ao uso do router do Angular na sua aplicação.

## Obtendo informações de route {#getting-route-information}

Frequentemente, conforme um usuário navega pela sua aplicação, você quer passar informações de um component para outro.
Por exemplo, considere uma aplicação que exibe uma lista de compras de itens de mercado.
Cada item da lista tem um `id` único.
Para editar um item, os usuários clicam em um botão Edit, que abre um component `EditGroceryItem`.
Você quer que esse component recupere o `id` do item de mercado para que ele possa exibir as informações corretas para o usuário.

Use uma route para passar esse tipo de informação para os components da sua aplicação.
Para isso, você usa o recurso `withComponentInputBinding` com `provideRouter` ou a opção `bindToComponentInputs` de `RouterModule.forRoot`.

Para obter informações de uma route:

<docs-workflow>

<docs-step title="Adicione `withComponentInputBinding`">

Adicione o recurso `withComponentInputBinding` ao método `provideRouter`.

```ts
providers: [provideRouter(appRoutes, withComponentInputBinding())];
```

</docs-step>

<docs-step title="Adicione um `input` ao component">

Atualize o component para ter uma propriedade `input()` correspondente ao nome do parâmetro.

```ts
id = input.required<string>();
hero = computed(() => this.service.getHero(this.id()));
```

</docs-step>
<docs-step title="Opcional: Use um valor padrão">
O router atribui valores a todos os inputs com base na route atual quando `withComponentInputBinding` está habilitado.
O router atribui `undefined` se nenhum dado de route corresponder à chave do input, como quando um parâmetro de query opcional está ausente.
Você deve incluir `undefined` no tipo do `input` quando houver a possibilidade de que um input não seja correspondido pela route.

Forneça um valor padrão usando a opção `transform` no input ou gerenciando um estado local com um `linkedSignal`.

```ts
id = input.required({
  transform: (maybeUndefined: string | undefined) => maybeUndefined ?? '0',
});
// ou
id = input<string | undefined>();
internalId = linkedSignal(() => this.id() ?? getDefaultId());
```

</docs-step>
</docs-workflow>

NOTE: Você pode vincular todos os dados de route com pares chave-valor aos inputs do component: recursos de route, dados estáticos ou resolvidos de route, parâmetros de path, parâmetros de matriz e parâmetros de query.

### Prioridade de binding de inputs {#input-binding-priority}

Quando múltiplas fontes de route definem chaves idênticas, o router resolve as colisões na seguinte ordem de prioridade (da mais alta para a mais baixa):

1. **Recursos de route**: valores definidos no mapa `resources` da route. Recursos bloqueantes vinculam seu valor desembrulhado (`resource.value()`), enquanto recursos não bloqueantes vinculam a instância `Resource`.
2. **Dados de route e resolvers**: dados estáticos definidos em `data` ou valores resolvidos via `resolve`.
3. **Parâmetros de path e parâmetros de matriz**: parâmetros da URL de path (como `:id`) e parâmetros de matriz.
4. **Parâmetros de query**: parâmetros da query string (como `?id=123`).

Por exemplo, se uma route tem tanto um parâmetro de path `:id` quanto um parâmetro de query `?id=...`, o valor do parâmetro de path é vinculado ao input `id` do component. Se a route também define um recurso chamado `id`, o valor do recurso tem precedência sobre ambos.

### Desabilitar o binding de parâmetros de query {#disable-query-parameter-binding}

Use `ComponentInputBindingOptions` para desabilitar o binding de parâmetros de query se você gerencia os parâmetros de query separadamente:

```ts
provideRouter(appRoutes, withComponentInputBinding({queryParams: false}));
```

### Configurar o comportamento para inputs não disponíveis nos dados do router {#configure-behavior-for-inputs-not-available-in-router-data}

Por padrão, o router define um input como `undefined` se ele não estava disponível nos dados do router durante uma navegação. Isso garante que dados obsoletos não sejam retidos.

Se você quiser evitar definir `undefined` para inputs que _nunca_ estiveram disponíveis nos dados do router para a instância ativa do component, pode definir a opção `unmatchedInputBehavior` como `'undefinedIfStale'`:

```ts
provideRouter(appRoutes, withComponentInputBinding({unmatchedInputBehavior: 'undefinedIfStale'}));
```

Quando você combina `unmatchedInputBehavior: 'undefinedIfStale'` com `queryParams: false`, os inputs mantêm seus valores iniciais, a menos que sejam fornecidos explicitamente pelo router. A exceção são os parâmetros de matriz: se um parâmetro de matriz é fornecido em uma navegação e removido em uma navegação subsequente, o router define o input como `undefined` para evitar reter dados obsoletos.

```ts
provideRouter(
  appRoutes,
  withComponentInputBinding({
    queryParams: false,
    unmatchedInputBehavior: 'undefinedIfStale',
  }),
);
```

### Herdar dados da route pai {#inherit-parent-route-data}

Por padrão, as routes filhas herdam parâmetros e dados das routes pai (equivalente a `paramsInheritanceStrategy: 'always'`). Isso significa que você pode acessar informações da route pai diretamente nos components filhos.

Se você precisar restaurar o comportamento legado, em que os parâmetros só eram herdados de routes de path vazio, pode definir `paramsInheritanceStrategy` como `'emptyOnly'`:

```ts
provideRouter(routes, withRouterConfig({paramsInheritanceStrategy: 'emptyOnly'}));
```

Veja [opções de configuração do router](guide/routing/customizing-route-behavior#router-configuration-options) para detalhes sobre outras configurações disponíveis.

## Exibindo uma página 404 {#displaying-a-404-page}

Para exibir uma página 404, configure uma [route wildcard](guide/routing/define-routes#wildcards) com a propriedade `component` definida para o component que você gostaria de usar na sua página 404, da seguinte forma:

```ts
const routes: Routes = [
  {path: 'first-component', component: First},
  {path: 'second-component', component: Second},
  {path: '**', component: PageNotFound}, // Route wildcard para a página 404
];
```

A última route com o `path` de `**` é uma route wildcard.
O router seleciona essa route se a URL solicitada não corresponder a nenhum dos paths anteriores na lista, e envia o usuário para o `PageNotFound`.

## Array de parâmetros de link {#link-parameters-array}

Um array de parâmetros de link contém os seguintes ingredientes para a navegação do router:

- O path da route para o component de destino
- Parâmetros de route obrigatórios e opcionais que vão para a URL da route

Vincule a diretiva `RouterLink` a esse array assim:

```angular-html
<a [routerLink]="['/heroes']">Heroes</a>
```

O seguinte é um array de dois elementos ao especificar um parâmetro de route:

```angular-html
<a [routerLink]="['/hero', hero.id]">
  <span class="badge">{{ hero.id }}</span
  >{{ hero.name }}
</a>
```

Forneça parâmetros de route opcionais em um objeto, como em `{ foo: 'foo' }`:

```angular-html
<a [routerLink]="['/crisis-center', {foo: 'foo'}]">Crisis Center</a>
```

Essa sintaxe passa parâmetros de matriz, que são parâmetros opcionais associados a um segmento específico da URL. Saiba mais sobre [parâmetros de matriz](/guide/routing/read-route-state#matrix-parameters).

Esses três exemplos cobrem as necessidades de uma aplicação com um nível de routing.
No entanto, com um router filho, como no crisis center, você cria novas possibilidades de array de link.

O seguinte exemplo mínimo de `RouterLink` se baseia em uma route filha padrão especificada para o crisis center.

```angular-html
<a [routerLink]="['/crisis-center']">Crisis Center</a>
```

Revise o seguinte:

- O primeiro item do array identifica a route pai \(`/crisis-center`\)
- Não há parâmetros para esta route pai
- Não há padrão para a route filha, então você precisa escolher uma
- Você está navegando para o `CrisisList`, cujo path de route é `/`, mas você não precisa adicionar a barra explicitamente

Considere o seguinte link de router, que navega da raiz da aplicação até a Dragon Crisis:

```angular-html
<a [routerLink]="['/crisis-center', 1]">Dragon Crisis</a>
```

- O primeiro item do array identifica a route pai \(`/crisis-center`\)
- Não há parâmetros para esta route pai
- O segundo item identifica a route filha de detalhes sobre uma crise específica \(`/:id`\)
- A route filha de detalhes requer um parâmetro de route `id`
- Você adicionou o `id` da Dragon Crisis como o segundo item do array \(`1`\)
- O path resultante é `/crisis-center/1`

Você também pode redefinir o template `App` apenas com as routes do Crisis Center:

```angular-ts
@Component({
  template: `
    <h1 class="title">Angular Router</h1>
    <nav>
      <a [routerLink]="['/crisis-center']">Crisis Center</a>
      <a [routerLink]="['/crisis-center/1', {foo: 'foo'}]">Dragon Crisis</a>
      <a [routerLink]="['/crisis-center/2']">Shark Crisis</a>
    </nav>
    <router-outlet />
  `,
})
export class App {}
```

Em resumo, você pode escrever aplicações com um, dois ou mais níveis de routing.
O array de parâmetros de link oferece a flexibilidade de representar qualquer profundidade de routing e qualquer sequência válida de paths de route, parâmetros de router \(obrigatórios\) e objetos de parâmetros de route \(opcionais\).

## `LocationStrategy` e estilos de URL do browser {#locationstrategy-and-browser-url-styles}

Quando o router navega para uma nova view de component, ele atualiza a location e o histórico do browser com uma URL para essa view.

Browsers HTML5 modernos suportam o [history.pushState](https://developer.mozilla.org/docs/Web/API/History_API/Working_with_the_History_API#adding_and_modifying_history_entries 'HTML5 browser history push-state'), uma técnica que altera a location e o histórico de um browser sem acionar uma requisição de página ao servidor.
O router pode compor uma URL "natural" que é indistinguível de uma que, de outra forma, exigiria um carregamento de página.

Aqui está a URL do Crisis Center nesse estilo "HTML5 pushState":

```text
localhost:3002/crisis-center
```

Browsers mais antigos enviam requisições de página ao servidor quando a URL de location muda, a menos que a mudança ocorra após um "#" \(chamado de "hash"\).
Routers podem aproveitar essa exceção compondo URLs de route dentro da aplicação com hashes.
Aqui está uma "hash URL" que direciona para o Crisis Center.

```text
localhost:3002/src/#/crisis-center
```

O router suporta os dois estilos com dois providers `LocationStrategy`:

| Providers              | Detalhes                              |
| :--------------------- | :------------------------------------ |
| `PathLocationStrategy` | O estilo padrão "HTML5 pushState".    |
| `HashLocationStrategy` | O estilo "hash URL".                  |

A função `RouterModule.forRoot()` define a `LocationStrategy` como `PathLocationStrategy`, o que a torna a estratégia padrão.
Você também tem a opção de mudar para a `HashLocationStrategy` com uma substituição durante o processo de bootstrap.

HELPFUL: Para mais informações sobre providers e o processo de bootstrap, veja [Injeção de Dependência](guide/di/defining-dependency-providers).
