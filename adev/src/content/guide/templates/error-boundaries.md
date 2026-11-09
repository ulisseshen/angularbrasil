<!-- ia-translate: true -->
# Error boundaries com `@boundary`

IMPORTANT: `@boundary` está em [developer preview](reference/releases#developer-preview).

Os templates do Angular oferecem suporte a error boundaries para tratar de forma elegante erros de runtime que ocorrem durante a renderização e a detecção de mudanças.

Error boundaries impedem que a falha de um único component derrube a aplicação inteira e oferecem uma forma de exibir uma UI de fallback para o usuário.

## Capturando erros com `@boundary` e `@error` {#catching-errors-with-boundary-and-error}

O bloco `@boundary` envolve uma seção do seu template. Se qualquer component ou directive dentro desse boundary lançar um erro durante a inicialização ou a detecção de mudanças, o framework captura o erro e renderiza o bloco `@error`.

```angular-html
@boundary {
  <app-risky-component />
} @error {
  <p>Algo deu errado!</p>
}
```

## Acessando o objeto de erro {#accessing-the-error-object}

Você pode acessar o erro capturado por meio da variável implícita `$error`:

```angular-html
@boundary {
  <app-risky-component />
} @error {
  <p>Ocorreu um erro: {{ $error.message }}</p>
}
```

## Redefinindo o boundary {#resetting-the-boundary}

Você pode tentar renderizar novamente o conteúdo do `@boundary` chamando a função implícita `$reset` no bloco `@error`. Quando chamada, ela redefine o estado do boundary e tenta renderizar o conteúdo original outra vez.

```angular-html
@boundary {
  <app-flaky-component />
} @error {
  <p>Falha no carregamento.</p>
  <button (click)="$reset()">Tentar novamente</button>
}
```

## Tratamento condicional de erros com `when` {#conditional-error-handling-with-when}

Você pode usar cláusulas `when` para tratar condicionalmente tipos específicos de erro, permitindo oferecer UIs de fallback diferentes. O Angular avalia essa condição quando captura um erro.

```angular-html
@boundary {
  <app-chart-dashboard />
} @error (let err; reset = $reset; when isRenderError(err)) {
  <p>Problema de rede. Verifique sua conexão.</p>
  <button (click)="reset()">Tentar novamente</button>
} @error {
  <p>Ocorreu um erro inesperado: {{ $error.message }}</p>
}
```

Ordene seus blocos `@error` do mais específico para o menos específico, pois o Angular avalia as cláusulas `when` em ordem e usa a primeira que resultar em true. Um bloco `@error` final sem cláusula `when` atua como fallback genérico.

## Integração com o global error handler {#global-error-handler-integration}

Quando um boundary captura um erro, o Angular ainda pode notificar o `ErrorHandler` global. Você pode implementar o hook opcional `onViewError` no seu `ErrorHandler` personalizado para registrar esses erros capturados no seu serviço de rastreamento de erros.

```ts
@Injectable()
export class MyErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    // Trata erros não capturados
  }

  onViewError(error: Error, details: ErrorDetails): void {
    // Trata erros capturados por um @boundary
    console.warn('Capturado pelo boundary:', details.boundary);
    myErrorTrackingService.log(error);
  }
}
```

IMPORTANT: se um bloco `@error` lançar um erro, o erro se propaga para o próximo `@boundary` externo ou o Angular o trata como um erro não tratado da aplicação.

## Projeção de conteúdo {#content-projection}

Se o seu component usa [projeção de conteúdo](guide/components/content-projection), envolver `<ng-content>` em um `@boundary` não captura erros do conteúdo projetado. Esse conteúdo pertence à view que o declara, e não à view do component que o recebe.

Por exemplo, um component wrapper com o template a seguir não captura erros dos components projetados nele:

```angular-html {avoid}
@boundary {
  <ng-content />
} @error {
  <p>Algo deu errado!</p>
}
```

Para capturar esses erros, envolva o component wrapper e o seu conteúdo projetado em um `@boundary` no template pai:

```angular-html {prefer}
@boundary {
  <app-wrapper>
    <app-risky-component />
  </app-wrapper>
} @error {
  <p>Algo deu errado!</p>
}
```

## Views dinâmicas e tratamento programático de erros {#dynamic-views-and-programmatic-error-handling}

O tratamento de erros não se limita à sintaxe de template. Se você estiver criando components ou embedded views dinamicamente, pode usar a opção `onError` para tratar erros. Consulte a seção [Tratando erros de renderização](guide/components/programmatic-rendering#handling-rendering-errors) no guia de renderização programática para mais informações.
