<!-- ia-translate: true -->
# Use RouterLink para Navegação

No estado atual da aplicação, a página inteira é recarregada quando clicamos em um link interno que existe dentro da aplicação. Embora isso possa não parecer significativo com uma aplicação pequena, isso pode ter implicações de performance para páginas maiores com mais conteúdo onde os usuários têm que baixar novamente os assets e executar cálculos novamente.

Nota: Saiba mais sobre [adicionar rotas à sua aplicação no guia detalhado](/guide/routing/common-router-tasks#add-your-routes-to-your-application).

Nesta atividade, você aprenderá como aproveitar a directive `RouterLink` para fazer o melhor uso do Angular Router.

<hr>

<docs-workflow>

<docs-step title="Importe a directive `RouterLink`">

Em `app.ts` adicione o import da directive `RouterLink` à declaração de import existente de `@angular/router` e adicione-a ao array `imports` do seu decorator de component.

```ts
...
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterLink, RouterOutlet],
  ...
})
```

</docs-step>

<docs-step title="Adicione um `routerLink` ao template">

Para usar a directive `RouterLink`, substitua os atributos `href` por `routerLink`. Atualize o template com essa mudança.

```angular-ts
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  ...
  template: `
    ...
    <a routerLink="/">Home</a>
    <a routerLink="/user">User</a>
    ...
  `,
  imports: [RouterLink, RouterOutlet],
})
```

</docs-step>

</docs-workflow>

Quando você clicar nos links na navegação agora, você não deve ver nenhuma piscada e apenas o conteúdo da própria página (ou seja, `router-outlet`) sendo alterado 🎉

Ótimo trabalho aprendendo sobre routing com Angular. Isso é apenas a superfície da API do `Router`, para aprender mais confira a [Documentação do Angular Router](guide/routing).
