<!-- ia-translate: true -->
# Referência do Router

As seções a seguir destacam alguns conceitos e terminologias centrais do router.

## Eventos do Router

Durante cada navegação, o `Router` emite eventos de navegação através da propriedade `Router.events`.
Estes eventos são mostrados na tabela a seguir.

| Evento do Router                                          | Detalhes                                                                                                                                                                |
| :-------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`NavigationStart`](api/router/NavigationStart)           | Acionado quando a navegação começa.                                                                                                                                      |
| [`RouteConfigLoadStart`](api/router/RouteConfigLoadStart) | Acionado antes do `Router` fazer lazy load de uma configuração de rota.                                                                                                        |
| [`RouteConfigLoadEnd`](api/router/RouteConfigLoadEnd)     | Acionado após uma rota ter sido carregada com lazy loading.                                                                                                                          |
| [`RoutesRecognized`](api/router/RoutesRecognized)         | Acionado quando o Router analisa a URL e as rotas são reconhecidas.                                                                                                |
| [`GuardsCheckStart`](api/router/GuardsCheckStart)         | Acionado quando o Router inicia a fase de Guards do routing.                                                                                                          |
| [`ChildActivationStart`](api/router/ChildActivationStart) | Acionado quando o Router inicia a ativação dos filhos de uma rota.                                                                                                        |
| [`ActivationStart`](api/router/ActivationStart)           | Acionado quando o Router inicia a ativação de uma rota.                                                                                                                   |
| [`GuardsCheckEnd`](api/router/GuardsCheckEnd)             | Acionado quando o Router finaliza a fase de Guards do routing com sucesso.                                                                                           |
| [`ResolveStart`](api/router/ResolveStart)                 | Acionado quando o Router inicia a fase de Resolve do routing.                                                                                                         |
| [`ResolveEnd`](api/router/ResolveEnd)                     | Acionado quando o Router finaliza a fase de Resolve do routing com sucesso.                                                                                          |
| [`ChildActivationEnd`](api/router/ChildActivationEnd)     | Acionado quando o Router finaliza a ativação dos filhos de uma rota.                                                                                                      |
| [`ActivationEnd`](api/router/ActivationEnd)               | Acionado quando o Router finaliza a ativação de uma rota.                                                                                                                 |
| [`NavigationEnd`](api/router/NavigationEnd)               | Acionado quando a navegação termina com sucesso.                                                                                                                           |
| [`NavigationCancel`](api/router/NavigationCancel)         | Acionado quando a navegação é cancelada. Isso pode acontecer quando um Route Guard retorna false durante a navegação, ou redireciona retornando um `UrlTree` ou `RedirectCommand`. |
| [`NavigationError`](api/router/NavigationError)           | Acionado quando a navegação falha devido a um erro inesperado.                                                                                                            |
| [`Scroll`](api/router/Scroll)                             | Representa um evento de scroll.                                                                                                                                          |

Quando você habilita a feature `withDebugTracing`, o Angular registra esses eventos no console.

## Terminologia do Router

Aqui estão os termos-chave do `Router` e seus significados:

| Parte do Router       | Detalhes                                                                                                                                                                                                                                   |
| :-------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Router`              | Exibe o component da aplicação para a URL ativa. Gerencia a navegação de um component para o próximo.                                                                                                                                 |
| `provideRouter`       | Fornece os service providers necessários para navegar através de views da aplicação.                                                                                                                                                        |
| `RouterModule`        | Um NgModule separado que fornece os service providers e directives necessários para navegar através de views da aplicação.                                                                                                                |
| `Routes`              | Define um array de Routes, cada uma mapeando um caminho de URL para um component.                                                                                                                                                                       |
| `Route`               | Define como o router deve navegar para um component baseado em um padrão de URL. A maioria das rotas consiste de um caminho e um tipo de component.                                                                                                         |
| `RouterOutlet`        | A directive \(`<router-outlet>`\) que marca onde o router exibe uma view.                                                                                                                                                          |
| `RouterLink`          | A directive para vincular um elemento HTML clicável a uma rota. Clicar em um elemento com uma directive `routerLink` vinculada a uma _string_ ou a um _array de parâmetros de link_ aciona uma navegação.                                           |
| `RouterLinkActive`    | A directive para adicionar/remover classes de um elemento HTML quando um `routerLink` associado contido no elemento ou dentro dele se torna ativo/inativo. Também pode definir o `aria-current` de um link ativo para melhor acessibilidade. |
| `ActivatedRoute`      | Um service fornecido para cada route component que contém informações específicas da rota como parâmetros de rota, dados estáticos, dados de resolve, parâmetros de query globais e o fragmento global.                                         |
| `RouterState`         | O estado atual do router incluindo uma árvore das rotas atualmente ativadas junto com métodos convenientes para percorrer a árvore de rotas.                                                                                       |
| Array de parâmetros de link | Um array que o router interpreta como uma instrução de routing. Você pode vincular esse array a um `RouterLink` ou passar o array como argumento para o método `Router.navigate`.                                                                 |
| Routing component     | Um component Angular com um `RouterOutlet` que exibe views baseado em navegações do router.                                                                                                                                               |

## `<base href>`

O router usa o [history.pushState](https://developer.mozilla.org/docs/Web/API/History_API/Working_with_the_History_API#adding_and_modifying_history_entries 'HTML5 browser history push-state') do navegador para navegação.
`pushState` permite personalizar caminhos de URL dentro da aplicação; por exemplo, `localhost:4200/crisis-center`.
As URLs dentro da aplicação podem ser indistinguíveis de URLs do servidor.

Os navegadores HTML5 modernos foram os primeiros a suportar `pushState`, razão pela qual muitas pessoas se referem a essas URLs como URLs "estilo HTML5".

DICA: A navegação estilo HTML5 é o padrão do router.
Na seção [LocationStrategy e estilos de URL do browser](common-router-tasks#locationstrategy-and-browser-url-styles), saiba por que o estilo HTML5 é preferível, como ajustar seu comportamento e como mudar para o estilo hash \(`#`\) mais antigo, se necessário.

Você deve adicionar um [elemento `<base href>`](https://developer.mozilla.org/docs/Web/HTML/Element/base 'base href') ao `index.html` da aplicação para que o routing `pushState` funcione.
O navegador usa o valor `<base href>` para prefixar URLs relativas ao referenciar arquivos CSS, scripts e imagens.

Adicione o elemento `<base>` logo após a tag `<head>`.
Se a pasta `app` é a raiz da aplicação, como é para esta aplicação, defina o valor `href` em `index.html` como mostrado aqui.

<docs-code header="src/index.html (base-href)" path="adev/src/content/examples/router/src/index.html" visibleRegion="base-href"/>

### URLs HTML5 e o `<base href>`

As diretrizes a seguir farão referência a diferentes partes de uma URL.
Este diagrama descreve a que essas partes se referem:

<docs-code hideCopy language="text">
foo://example.com:8042/over/there?name=ferret#nose
\_/   \______________/\_________/ \_________/ \__/
 |           |            |            |        |
scheme    authority      path        query   fragment
</docs-code>

Embora o router use o estilo [HTML5 pushState](https://developer.mozilla.org/docs/Web/API/History_API#Adding_and_modifying_history_entries 'Browser history push-state') por padrão, você deve configurar essa strategy com um `<base href>`.

A forma preferida de configurar a strategy é adicionar uma [tag `<base href>`](https://developer.mozilla.org/docs/Web/HTML/Element/base 'base href') no `<head>` do `index.html`.

```angular-html
<base href="/">
```

Sem essa tag, o navegador pode não conseguir carregar recursos \(imagens, CSS, scripts\) ao fazer "deep linking" na aplicação.

Alguns desenvolvedores podem não conseguir adicionar o elemento `<base>`, talvez porque não tenham acesso ao `<head>` ou ao `index.html`.

Esses desenvolvedores ainda podem usar URLs HTML5 seguindo os dois passos a seguir:

1. Fornecer ao router um valor `APP_BASE_HREF` apropriado.
1. Usar URLs raiz \(URLs com uma `authority`\) para todos os recursos web: CSS, imagens, scripts e arquivos HTML de template.
   - O `path` do `<base href>` deve terminar com "/", pois os navegadores ignoram caracteres no `path` que seguem o "`/`" mais à direita
   - Se o `<base href>` incluir uma parte `query`, a `query` só é usada se o `path` de um link na página estiver vazio e não tiver `query`.
     Isso significa que uma `query` no `<base href>` só é incluída ao usar `HashLocationStrategy`.

   - Se um link na página for uma URL raiz \(tem uma `authority`\), o `<base href>` não é usado.
     Desta forma, um `APP_BASE_HREF` com uma authority fará com que todos os links criados pelo Angular ignorem o valor `<base href>`.

   - Um fragment no `<base href>` _nunca_ é persistido

Para informações mais completas sobre como `<base href>` é usado para construir URIs de destino, veja a seção [RFC](https://tools.ietf.org/html/rfc3986#section-5.2.2) sobre transformação de referências.

### `HashLocationStrategy`

Use `HashLocationStrategy` fornecendo `useHash: true` em um objeto como segundo argumento do `RouterModule.forRoot()` no `AppModule`.

```ts
providers: [
  provideRouter(appRoutes, withHashLocation())
]
```

Ao usar `RouterModule.forRoot`, isso é configurado com `useHash: true` no segundo argumento: `RouterModule.forRoot(routes, {useHash: true})`.
