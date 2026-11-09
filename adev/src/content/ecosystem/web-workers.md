<!-- ia-translate: true -->
# Processamento em segundo plano usando web workers {#background-processing-using-web-workers}

[Web workers](https://developer.mozilla.org/docs/Web/API/Web_Workers_API) permitem executar computações intensivas de CPU em uma thread em segundo plano, liberando a thread principal para atualizar a interface do usuário.
Aplicações que realizam muitas computações, como gerar desenhos de Desenho Assistido por Computador \(CAD\) ou fazer cálculos geométricos pesados, podem usar web workers para aumentar o desempenho.

ÚTIL: O Angular CLI não suporta executar a si mesmo em um web worker.

## Adicionando um web worker {#adding-a-web-worker}

Para adicionar um web worker a um projeto existente, use o comando `ng generate` do Angular CLI.

```shell
ng generate web-worker <location>
```

Você pode adicionar um web worker em qualquer lugar em sua aplicação.
Por exemplo, para adicionar um web worker ao component raiz, `src/app/app.ts`, execute o seguinte comando.

```shell
ng generate web-worker app
```

O comando executa as seguintes ações.

1. Configura seu projeto para usar web workers, se ainda não estiver configurado.
1. Adiciona o seguinte código esqueleto a `src/app/app.worker.ts` para receber mensagens.

   ```ts {header:"src/app/app.worker.ts"}
   addEventListener('message', ({data}) => {
     const response = `worker response to ${data}`;
     postMessage(response);
   });
   ```

1. Adiciona o seguinte código esqueleto a `src/app/app.ts` para usar o worker.

   ```ts {header:"src/app/app.ts"}
   if (typeof Worker !== 'undefined') {
     // Cria um novo
     const worker = new Worker(new URL('./app.worker', import.meta.url));
     worker.onmessage = ({data}) => {
       console.log(`page got message: ${data}`);
     };
     worker.postMessage('hello');
   } else {
     // Web workers não são suportados neste ambiente.
     // Você deve adicionar um fallback para que seu programa continue executando corretamente.
   }
   ```

Depois de criar este esqueleto inicial, você deve refatorar seu código para usar o web worker enviando mensagens para e do worker.

IMPORTANTE: Alguns ambientes ou plataformas, como `@angular/platform-server` usado em [Server-side Rendering](guide/ssr), não suportam web workers.

Para garantir que sua aplicação funcione nesses ambientes, você deve fornecer um mecanismo de fallback para realizar as computações que o worker normalmente realizaria.
