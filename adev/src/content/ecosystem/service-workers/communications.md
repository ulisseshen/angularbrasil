<!-- ia-translate: true -->
# Comunicando com o Service Worker {#communicating-with-the-service-worker}

Ativar o suporte a service worker faz mais do que apenas registrar o service worker; ele também fornece services que você pode usar para interagir com o service worker e controlar o caching da sua aplicação.

## Service `SwUpdate` {#swupdate-service}

O service `SwUpdate` dá acesso a eventos que indicam quando o service worker descobre e instala uma atualização disponível para sua aplicação.

O service `SwUpdate` oferece suporte a três operações separadas:

- Receber notificações quando uma versão atualizada é _detectada_ no servidor, _instalada e pronta_ para ser usada localmente ou quando uma _instalação falha_.
- Solicitar ao service worker que verifique o servidor por novas atualizações.
- Solicitar ao service worker que ative a última versão da aplicação para a aba atual.

### Atualizações de versão {#version-updates}

O `versionUpdates` é uma property `Observable` de `SwUpdate` e emite quatro tipos de evento:

| Tipos de evento                  | Detalhes                                                                                                                                                                                                 |
| :------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VersionDetectedEvent`           | Emitido quando o service worker detectou uma nova versão da aplicação no servidor e está prestes a começar a baixá-la.                                                                                   |
| `NoNewVersionDetectedEvent`      | Emitido quando o service worker verificou a versão da aplicação no servidor e não encontrou uma nova versão.                                                                                             |
| `VersionReadyEvent`              | Emitido quando uma nova versão da aplicação está disponível para ser ativada pelos clients. Pode ser usado para notificar o usuário sobre uma atualização disponível ou solicitar que ele atualize a página. |
| `VersionInstallationFailedEvent` | Emitido quando a instalação de uma nova versão falhou. Pode ser usado para fins de registro/monitoramento.                                                                                              |

<docs-code header="log-update.service.ts" path="adev/src/content/examples/service-worker-getting-started/src/app/log-update.service.ts" region="sw-update"/>

### Verificar atualizações {#checking-for-updates}

É possível pedir ao service worker que verifique se alguma atualização foi implantada no servidor.
O service worker verifica atualizações durante a inicialização e em cada requisição de navegação — ou seja, quando o usuário navega de um endereço diferente para sua aplicação.
No entanto, você pode optar por verificar manualmente por atualizações se tiver um site que muda com frequência ou quiser que as atualizações aconteçam em um cronograma.

Faça isso com o method `checkForUpdate()`:

<docs-code header="check-for-update.service.ts" path="adev/src/content/examples/service-worker-getting-started/src/app/check-for-update.service.ts"/>

Este method retorna uma `Promise<boolean>` que indica se uma atualização está disponível para ativação.
A verificação pode falhar, o que causará uma rejeição da `Promise`.

<docs-callout important title="Estabilização e registro do service worker">
Para evitar afetar negativamente a renderização inicial da página, por padrão o service do service worker do Angular aguarda até 30 segundos para a aplicação estabilizar antes de registrar o script do ServiceWorker.

Verificar constantemente por atualizações, por exemplo, com [setInterval()](https://developer.mozilla.org/docs/Web/API/WindowOrWorkerGlobalScope/setInterval) ou [interval()](https://rxjs.dev/api/index/function/interval) do RxJS, impede a aplicação de estabilizar e o script do ServiceWorker não é registrado no browser até que o limite superior de 30 segundos seja atingido.

Isso vale para qualquer tipo de polling feito pela sua aplicação.
Consulte a documentação de [isStable](api/core/ApplicationRef#isStable) para mais informações.

Evite esse atraso aguardando que a aplicação estabilize primeiro, antes de começar a verificar por atualizações, como mostrado no exemplo anterior.
Alternativamente, você pode querer definir uma [estratégia de registro](api/service-worker/SwRegistrationOptions#registrationStrategy) diferente para o ServiceWorker.
</docs-callout>

### Atualizando para a última versão {#updating-to-the-latest-version}

Você pode atualizar uma aba existente para a última versão recarregando a página assim que uma nova versão estiver pronta.
Para evitar interromper o progresso do usuário, geralmente é uma boa ideia solicitar ao usuário e deixá-lo confirmar que está tudo bem recarregar a página e atualizar para a última versão:

<docs-code header="prompt-update.service.ts" path="adev/src/content/examples/service-worker-getting-started/src/app/prompt-update.service.ts" region="sw-version-ready"/>

<docs-callout important title="Segurança de atualizar sem recarregar">
Chamar `activateUpdate()` atualiza uma aba para a última versão sem recarregar a página, mas isso pode quebrar a aplicação.

Atualizar sem recarregar pode criar uma incompatibilidade de versão entre o shell da aplicação e outros recursos da página, como chunks com lazy loading, cujos nomes de arquivo podem mudar entre versões.

Você deve usar `activateUpdate()` apenas se tiver certeza de que é seguro para o seu caso de uso específico.
</docs-callout>

### Lidando com um estado irrecuperável {#handling-an-unrecoverable-state}

Em alguns casos, a versão da aplicação usada pelo service worker para servir um client pode estar em um estado quebrado que não pode ser recuperado sem um recarregamento completo da página.

Por exemplo, imagine o seguinte cenário:

1. Um usuário abre a aplicação pela primeira vez e o service worker armazena em cache a última versão da aplicação.
   Suponha que os assets em cache da aplicação incluam `index.html`, `main.<main-hash-1>.js` e `lazy-chunk.<lazy-hash-1>.js`.

1. O usuário fecha a aplicação e não a abre por um tempo.
1. Depois de algum tempo, uma nova versão da aplicação é implantada no servidor.
   Esta versão mais recente inclui os arquivos `index.html`, `main.<main-hash-2>.js` e `lazy-chunk.<lazy-hash-2>.js`.

IMPORTANT: Os hashes são diferentes agora, porque o conteúdo dos arquivos mudou. A versão antiga não está mais disponível no servidor.

1. Enquanto isso, o browser do usuário decide remover `lazy-chunk.<lazy-hash-1>.js` do seu cache.
   Browsers podem decidir remover recursos específicos (ou todos) de um cache para recuperar espaço em disco.

1. O usuário abre a aplicação novamente.
   O service worker serve a última versão conhecida por ele neste ponto, ou seja, a versão antiga (`index.html` e `main.<main-hash-1>.js`).

1. Em algum momento posterior, a aplicação solicita o bundle lazy, `lazy-chunk.<lazy-hash-1>.js`.
1. O service worker não consegue encontrar o asset no cache (lembre-se de que o browser o removeu).
   Nem consegue recuperá-lo do servidor (porque o servidor agora só tem `lazy-chunk.<lazy-hash-2>.js` da versão mais recente).

No cenário anterior, o service worker não consegue servir um asset que normalmente estaria armazenado em cache.
Essa versão específica da aplicação está quebrada e não há como corrigir o estado do client sem recarregar a página.
Em tais casos, o service worker notifica o client enviando um evento `UnrecoverableStateEvent`.
Inscreva-se em `SwUpdate#unrecoverable` para ser notificado e lidar com esses erros.

<docs-code header="handle-unrecoverable-state.service.ts" path="adev/src/content/examples/service-worker-getting-started/src/app/handle-unrecoverable-state.service.ts" region="sw-unrecoverable-state"/>

## Mais sobre service workers do Angular {#more-on-angular-service-workers}

Você também pode se interessar pelo seguinte:

<docs-pill-row>
  <docs-pill href="ecosystem/service-workers/push-notifications" title="Notificações push"/>
  <docs-pill href="ecosystem/service-workers/devops" title="Devops do service worker"/>
</docs-pill-row>
