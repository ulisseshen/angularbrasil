<!-- ia-translate: true -->
# Outras Tarefas Comuns de Routing

Este guia cobre algumas outras tarefas comuns associadas ao uso do Angular router na sua aplicação.

## Obtendo informações de route

Frequentemente, quando um usuário navega pela sua aplicação, você quer passar informações de um component para outro.
Por exemplo, considere uma aplicação que exibe uma lista de compras de itens de mercado.
Cada item na lista tem um `id` único.
Para editar um item, os usuários clicam em um botão Edit, que abre um component `EditGroceryItem`.
Você quer que esse component recupere o `id` do item de mercado para que ele possa exibir as informações corretas para o usuário.

Use uma route para passar este tipo de informação para os components da sua aplicação.
Para fazer isso, você usa o recurso `withComponentInputBinding` com `provideRouter` ou a opção `bindToComponentInputs` de `RouterModule.forRoot`.

Para obter informações de uma route:

<docs-workflow>

<docs-step title="Adicione `withComponentInputBinding`">

Adicione o recurso `withComponentInputBinding` ao método `provideRouter`.

```ts
providers: [
  provideRouter(appRoutes, withComponentInputBinding()),
]
```

</docs-step>

<docs-step title="Adicione um `input` ao component">

Atualize o component para ter uma propriedade `input()` correspondente ao nome do parâmetro.

```ts
id = input.required<string>()
hero = computed(() => this.service.getHero(id()));
```

</docs-step>
<docs-step title="Opcional: Use um valor padrão">
O router atribui valores a todos os inputs com base na route atual quando `withComponentInputBinding` está habilitado.
O router atribui `undefined` se nenhum dado de route corresponder à chave do input, como quando um parâmetro de query opcional está ausente.
Você deve incluir `undefined` no tipo do `input` quando houver a possibilidade de que um input possa não ser correspondido pela route.

Forneça um valor padrão usando a opção `transform` no input ou gerenciando um estado local com um `linkedSignal`.

```ts
id = input.required({
  transform: (maybeUndefined: string | undefined) => maybeUndefined ?? '0',
});
// or
id = input<string|undefined>();
internalId = linkedSignal(() => this.id() ?? getDefaultId());
```

</docs-step>
</docs-workflow>

NOTA: Você pode vincular todos os dados de route com pares chave-valor aos inputs do component: dados de route estáticos ou resolvidos, parâmetros de path, parâmetros de matriz e parâmetros de query.
Se você quiser usar as informações de route dos components pais, você precisará configurar a opção `paramsInheritanceStrategy` do router:
`withRouterConfig({paramsInheritanceStrategy: 'always'})`. Veja [opções de configuração do router](guide/routing/customizing-route-behavior#router-configuration-options) para detalhes sobre outras configurações disponíveis.

## Exibindo uma página 404

Para exibir uma página 404, configure uma [route wildcard](guide/routing/common-router-tasks#setting-up-wildcard-routes) com a propriedade `component` definida para o component que você gostaria de usar para sua página 404 da seguinte forma:

```ts
const routes: Routes = [
  { path: 'first-component', component: FirstComponent },
  { path: 'second-component', component: SecondComponent },
  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];
```

A última route com o `path` de `**` é uma route wildcard.
O router seleciona esta route se a URL solicitada não corresponder a nenhum dos paths anteriores na lista e envia o usuário para o `PageNotFoundComponent`.

## Array de parâmetros de link

Um array de parâmetros de link contém os seguintes ingredientes para navegação do router:

- O path da route para o component de destino
- Parâmetros de route obrigatórios e opcionais que vão para a URL da route

Vincule a diretiva `RouterLink` a tal array assim:

```angular-html
<a [routerLink]="['/heroes']">Heroes</a>
```

O seguinte é um array de dois elementos ao especificar um parâmetro de route:

```angular-html
<a [routerLink]="['/hero', hero.id]">
  <span class="badge">{{ hero.id }}</span>{{ hero.name }}
</a>
```

Forneça parâmetros de route opcionais em um object, como em `{ foo: 'foo' }`:

```angular-html
<a [routerLink]="['/crisis-center', { foo: 'foo' }]">Crisis Center</a>
```

Esta sintaxe passa parâmetros de matriz, que são parâmetros opcionais associados a um segmento de URL específico. Saiba mais sobre [parâmetros de matriz](/guide/routing/read-route-state#matrix-parameters).

Estes três exemplos cobrem as necessidades de uma aplicação com um nível de routing.
No entanto, com um router filho, como no crisis center, você cria novas possibilidades de array de link.

O seguinte exemplo mínimo de `RouterLink` baseia-se em uma route filho padrão especificada para o crisis center.

```angular-html
<a [routerLink]="['/crisis-center']">Crisis Center</a>
```

Revise o seguinte:

- O primeiro item no array identifica a route pai \(`/crisis-center`\)
- Não há parâmetros para esta route pai
- Não há padrão para a route filho, então você precisa escolher uma
- Você está navegando para o `CrisisListComponent`, cujo path de route é `/`, mas você não precisa adicionar a barra explicitamente

Considere o seguinte link de router que navega da raiz da aplicação até a Dragon Crisis:

```angular-html
<a [routerLink]="['/crisis-center', 1]">Dragon Crisis</a>
```

- O primeiro item no array identifica a route pai \(`/crisis-center`\)
- Não há parâmetros para esta route pai
- O segundo item identifica os detalhes da route filho sobre uma crise específica \(`/:id`\)
- A route filho de detalhes requer um parâmetro de route `id`
- Você adicionou o `id` da Dragon Crisis como o segundo item no array \(`1`\)
- O path resultante é `/crisis-center/1`

Você também pode redefinir o template `AppComponent` com routes do Crisis Center exclusivamente:

```angular-ts
@Component({
  template: `
    <h1 class="title">Angular Router</h1>
    <nav>
      <a [routerLink]="['/crisis-center']">Crisis Center</a>
      <a [routerLink]="['/crisis-center/1', { foo: 'foo' }]">Dragon Crisis</a>
      <a [routerLink]="['/crisis-center/2']">Shark Crisis</a>
    </nav>
    <router-outlet />
  `
})
export class AppComponent {}
```

Em resumo, você pode escrever aplicações com um, dois ou mais níveis de routing.
O array de parâmetros de link oferece a flexibilidade para representar qualquer profundidade de routing e qualquer sequência legal de paths de route, parâmetros de router \(obrigatórios\) e objects de parâmetro de route \(opcionais\).

## `LocationStrategy` e estilos de URL do browser

Quando o router navega para uma nova view de component, ele atualiza a location e o histórico do browser com uma URL para essa view.

Browsers HTML5 modernos suportam [history.pushState](https://developer.mozilla.org/docs/Web/API/History_API/Working_with_the_History_API#adding_and_modifying_history_entries 'HTML5 browser history push-state'), uma técnica que altera a location e o histórico de um browser sem acionar uma requisição de página ao servidor.
O router pode compor uma URL "natural" que é indistinguível de uma que, de outra forma, exigiria um carregamento de página.

Aqui está a URL do Crisis Center neste estilo "HTML5 pushState":

```text
localhost:3002/crisis-center
```

Browsers mais antigos enviam requisições de página ao servidor quando a URL de location muda, a menos que a mudança ocorra após um "#" \(chamado de "hash"\).
Routers podem aproveitar esta exceção compondo URLs de route dentro da aplicação com hashes.
Aqui está uma "hash URL" que direciona para o Crisis Center.

```text
localhost:3002/src/#/crisis-center
```

O router suporta ambos os estilos com dois providers `LocationStrategy`:

| Providers              | Detalhes                             |
| :--------------------- | :----------------------------------- |
| `PathLocationStrategy` | O estilo padrão "HTML5 pushState".   |
| `HashLocationStrategy` | O estilo "hash URL".                 |

A função `RouterModule.forRoot()` define a `LocationStrategy` para a `PathLocationStrategy`, o que a torna a estratégia padrão.
Você também tem a opção de mudar para a `HashLocationStrategy` com uma substituição durante o processo de bootstrapping.

ÚTIL: Para mais informações sobre providers e o processo de bootstrap, veja [Dependency Injection](guide/di/dependency-injection-providers).
