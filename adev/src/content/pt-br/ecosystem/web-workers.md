<!-- ia-translate: true -->
# Processamento em background usando web workers

[Web workers](https://developer.mozilla.org/docs/Web/API/Web_Workers_API) permitem que você execute computações intensivas de CPU em uma thread em background, liberando a thread principal para atualizar a interface do usuário.
Aplicações que realizam muitas computações, como gerar desenhos de Computer-Aided Design \(CAD\) ou fazer cálculos geométricos pesados, podem usar web workers para aumentar a performance.

HELPFUL: O Angular CLI não suporta executar a si mesmo em um web worker.

## Adicionando um web worker

Para adicionar um web worker a um projeto existente, use o comando `ng generate` do Angular CLI.

<docs-code language="shell">

ng generate web-worker <location>

</docs-code>

Você pode adicionar um web worker em qualquer lugar na sua aplicação.
Por exemplo, para adicionar um web worker ao component raiz, `src/app/app.component.ts`, execute o seguinte comando.

<docs-code language="shell">

ng generate web-worker app

</docs-code>

O comando realiza as seguintes ações.

1. Configura seu projeto para usar web workers, se ainda não estiver.
1. Adiciona o seguinte código estrutural a `src/app/app.worker.ts` para receber mensagens.

   ```ts {header:"src/app/app.worker.ts"}

     addEventListener('message', ({ data }) => {
        const response = `worker response to ${data}`;
        postMessage(response);
     });

   ```

1. Adiciona o seguinte código estrutural a `src/app/app.component.ts` para usar o worker.

   ```ts {header:"src/app/app.component.ts"}

     if (typeof Worker !== 'undefined') {
        // Create a new
        const worker = new Worker(new URL('./app.worker', import.meta.url));
        worker.onmessage = ({ data }) => {
           console.log(`page got message: ${data}`);
        };
        worker.postMessage('hello');
     } else {
        // Web workers are not supported in this environment.
        // You should add a fallback so that your program still executes correctly.
     }
   ```

Depois de criar esta estrutura inicial, você deve refatorar seu código para usar o web worker enviando mensagens de e para o worker.

IMPORTANT: Alguns ambientes ou plataformas, como `@angular/platform-server` usado em [Server-side Rendering](guide/ssr), não suportam web workers.

Para garantir que sua aplicação funcione nesses ambientes, você deve fornecer um mecanismo de fallback para realizar as computações que o worker faria de outra forma.
