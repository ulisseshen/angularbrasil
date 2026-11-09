<!-- ia-translate: true -->
# Erros não tratados no Angular

À medida que sua aplicação Angular é executada, parte do seu código pode lançar um erro. Se não forem tratados, esses erros podem levar a comportamentos inesperados e a uma UI que não responde. Este guia cobre como o Angular lida com erros que não são explicitamente capturados pelo código da sua aplicação. Para orientação sobre como escrever sua própria lógica de tratamento de erros dentro da aplicação, consulte as boas práticas para tratamento de erros em JavaScript e Angular.

Um princípio fundamental na estratégia de tratamento de erros do Angular é que os erros devem ser expostos aos desenvolvedores no local da chamada sempre que possível. Essa abordagem garante que o código que iniciou uma operação tenha o contexto necessário para entender o erro, tratá-lo adequadamente e decidir qual deve ser o estado apropriado da aplicação. Ao tornar os erros visíveis em sua origem, os desenvolvedores podem implementar tratamento de erros específico para a operação que falhou e ter acesso a informações relevantes para a recuperação ou para fornecer feedback informativo ao usuário final. Isso também ajuda a evitar o "erro excessivamente genérico", situação em que erros são relatados sem contexto suficiente para entender sua causa.

Por exemplo, considere um component que busca dados do usuário de uma API. O código responsável por fazer a chamada à API deve incluir tratamento de erros (por exemplo, usando um bloco `try...catch` ou o operador `catchError` no RxJS) para gerenciar possíveis problemas de rede ou erros retornados pela API. Isso permite que o component exiba uma mensagem de erro amigável para o usuário ou tente novamente a requisição, em vez de deixar o erro se propagar sem tratamento.

## Erros não tratados são relatados ao `ErrorHandler` {#unhandled-errors-are-reported-to-the-errorhandler}

O Angular relata erros não tratados ao `ErrorHandler` raiz da aplicação. Ao fornecer um `ErrorHandler` personalizado, forneça-o no seu `ApplicationConfig` como parte da chamada a `bootstrapApplication`.

Ao construir uma aplicação Angular, frequentemente você escreve código que é chamado automaticamente _pelo_ framework. Por exemplo, o Angular é responsável por chamar o construtor de um component e os métodos do ciclo de vida quando esse component aparece em um template. Quando o framework executa seu código, não há lugar onde você possa razoavelmente adicionar um bloco `try` para tratar erros de forma elegante. Em situações como essa, o Angular captura os erros e os envia ao `ErrorHandler`.

O Angular _não_ captura erros dentro de APIs que são chamadas diretamente pelo seu código. Por exemplo, se você tem um service com um método que lança um erro e chama esse método no seu component, o Angular não capturará esse erro automaticamente. Você é responsável por tratá-lo usando mecanismos como `try...catch`.

O Angular captura erros _assíncronos_ de promises ou observables do usuário apenas quando:

- Há um contrato explícito para o Angular esperar e usar o resultado da operação assíncrona, e
- Os erros não são apresentados no valor de retorno ou no estado.

Por exemplo, `AsyncPipe` e `PendingTasks.run` encaminham erros para o `ErrorHandler`, enquanto `resource` apresenta o erro nas propriedades `status` e `error`.

Erros que o Angular relata ao `ErrorHandler` são erros _inesperados_. Esses erros podem ser irrecuperáveis ou indicar que o estado da aplicação está corrompido. As aplicações devem fornecer tratamento de erros usando blocos `try` ou operadores apropriados de tratamento de erros (como `catchError` no RxJS) onde o erro ocorre sempre que possível, em vez de depender do `ErrorHandler`, que é usado com mais frequência e de forma mais adequada apenas como um mecanismo para relatar erros potencialmente fatais à infraestrutura de rastreamento e registro de erros.

```ts
export class GlobalErrorHandler implements ErrorHandler {
  private readonly analyticsService = inject(AnalyticsService);
  private readonly router = inject(Router);

  handleError(error: any) {
    const url = this.router.url;
    const errorMessage = error?.message ?? 'unknown';

    this.analyticsService.trackEvent({
      eventName: 'exception',
      description: `Screen: ${url} | ${errorMessage}`,
    });

    console.error(GlobalErrorHandler.name, {error});
  }
}
```

### `TestBed` relança erros por padrão {#testbed-rethrows-errors-by-default}

Em muitos casos, o `ErrorHandler` pode apenas registrar erros e permitir que a aplicação continue funcionando. Em testes, no entanto, você quase sempre quer expor esses erros. O `TestBed` do Angular relança erros inesperados para garantir que erros capturados pelo framework não possam ser perdidos ou ignorados sem intenção. Em raras circunstâncias, um teste pode tentar especificamente garantir que erros não façam a aplicação deixar de responder ou travar. Nessas situações, você pode [configurar o `TestBed` para _não_ relançar erros da aplicação](api/core/testing/TestModuleMetadata#rethrowApplicationErrors) com `TestBed.configureTestingModule({rethrowApplicationErrors: false})`.

### Erros lançados enquanto sua aplicação ainda está iniciando {#errors-thrown-while-your-app-is-still-starting-up}

Há um breve momento em que o Angular ainda não consegue enviar erros para o seu `ErrorHandler`: enquanto ele ainda está criando o módulo raiz ou o component raiz da aplicação. O Angular precisa que essa instância raiz exista antes de conseguir localizar o `ErrorHandler` que você forneceu, então um erro lançado antes disso não tem para onde ir. Ele se comporta como um erro não capturado comum, em vez de ser relatado pelo `ErrorHandler`.

Você tem mais chances de encontrar isso com [elementos Angular](guide/elements). Se você definir um elemento customizado enquanto a tag dele já estiver presente na página, o navegador o atualiza imediatamente, executando o construtor e o `ngOnInit` do component como parte desse trabalho inicial de inicialização. Qualquer erro lançado ali pode se perder.

Se isso acontecer com você, mova o código que lança o erro para que ele seja executado depois que a aplicação terminar de iniciar, por exemplo:

- Envolva-o em `setTimeout(() => /* seu código */)` para que ele rode em seu próprio turno, em vez de durante a inicialização.
- Forneça-o como um `APP_BOOTSTRAP_LISTENER` em vez de executá-lo a partir de um construtor.
- Defina seus elementos customizados em `ngDoBootstrap` em vez de no construtor do módulo raiz.

Ativar o `provideBrowserGlobalErrorListeners()` (veja abaixo) também pode ajudar a capturar esses erros, já que eles ainda chegam ao navegador como erros não capturados.

## Listeners globais de erros {#global-error-listeners}

Erros que não são capturados nem pelo código da aplicação nem pela instância da aplicação do framework podem atingir o escopo global. Erros que atingem o escopo global podem ter consequências não intencionais se não forem levados em conta. Em ambientes que não são navegadores, eles podem causar o travamento do processo. No navegador, esses erros podem não ser relatados e os visitantes do site podem ver os erros no console do navegador. O Angular fornece listeners globais para ambos os ambientes para lidar com esses problemas.

### Renderização do lado do cliente {#client-side-rendering}

Adicionar [`provideBrowserGlobalErrorListeners()`](/api/core/provideBrowserGlobalErrorListeners) ao [ApplicationConfig](guide/di/defining-dependency-providers#application-bootstrap) adiciona os listeners `'error'` e `'unhandledrejection'` à janela do navegador e encaminha esses erros para o `ErrorHandler`. O Angular CLI gera novas aplicações com este provider por padrão. A equipe Angular recomenda tratar esses erros globais para a maioria das aplicações, seja com os listeners integrados do framework ou com seus próprios listeners personalizados. Se você fornecer listeners personalizados, pode remover o `provideBrowserGlobalErrorListeners`.

### Renderização do lado do servidor e híbrida {#server-side-and-hybrid-rendering}

Ao usar [Angular com SSR](guide/ssr), o Angular adiciona automaticamente os listeners `'unhandledRejection'` e `'uncaughtException'` ao processo do servidor. Esses handlers impedem que o servidor trave e, em vez disso, registram os erros capturados no console.

IMPORTANTE: Se a aplicação estiver usando Zone.js, apenas o handler `'unhandledRejection'` é adicionado. Quando o Zone.js está presente, erros dentro da Zone da aplicação já são encaminhados para o `ErrorHandler` da aplicação e não atingem o processo do servidor.
