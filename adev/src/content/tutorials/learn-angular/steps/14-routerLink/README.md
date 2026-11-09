<!-- ia-translate: true -->
# Use RouterLink para navegação {#use-routerlink-for-navigation}

No estado atual do app, a página inteira é recarregada quando clicamos em um link interno que existe dentro do app. Embora isso possa não parecer significativo com um app pequeno, pode ter implicações de performance em páginas maiores, com mais conteúdo, nas quais os usuários precisam baixar os assets novamente e executar os cálculos outra vez.

NOTE: Saiba mais sobre [adicionar rotas à sua aplicação no guia detalhado](/guide/routing/define-routes#adding-the-router-to-your-application).

Nesta atividade, você aprenderá como aproveitar a directive `RouterLink` para fazer o melhor uso do Angular Router.

<hr>

<docs-workflow>

<docs-step title="Importe a directive `RouterLink` {#import-routerlink-directive}">

Em `app.ts`, adicione o import da directive `RouterLink` à declaração de import existente de `@angular/router` e inclua-a no array `imports` do decorator do seu component.

```ts
...
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterLink, RouterOutlet],
  ...
})
```

</docs-step>

<docs-step title="Adicione um `routerLink` ao template {#add-a-routerlink-to-template}">

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

Ao clicar nos links da navegação agora, você não deve ver nenhuma piscada, e apenas o conteúdo da própria página (ou seja, `router-outlet`) deve mudar 🎉

Ótimo trabalho aprendendo sobre routing com Angular. Isso é apenas a superfície da API do `Router`. Para aprender mais, confira a [documentação do Angular Router](guide/routing).
