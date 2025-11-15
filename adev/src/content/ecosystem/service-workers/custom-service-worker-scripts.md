<!-- ia-translate: true -->

# Scripts personalizados de service worker

Embora o service worker Angular forneça excelentes capacidades, você pode precisar adicionar funcionalidade personalizada, como lidar com notificações push, sincronização em segundo plano ou outros eventos de service worker. Você pode criar um script de service worker personalizado que importa e estende o service worker Angular.

## Criando um service worker personalizado

Para criar um service worker personalizado que estende a funcionalidade do Angular:

1. Crie um arquivo de service worker personalizado (por exemplo, `custom-sw.js`) em seu diretório `src`:

```js
// Import the Angular service worker
importScripts('./ngsw-worker.js');

(function () {
  'use strict';

  // Add custom notification click handler
  self.addEventListener('notificationclick', (event) => {
    console.log('Custom notification click handler');
    console.log('Notification details:', event.notification);

    // Handle notification click - open URL if provided
    if (clients.openWindow && event.notification.data.url) {
      event.waitUntil(clients.openWindow(event.notification.data.url));
      console.log('Opening URL:', event.notification.data.url);
    }
  });

  // Add custom background sync handler
  self.addEventListener('sync', (event) => {
    console.log('Custom background sync handler');

    if (event.tag === 'background-sync') {
      event.waitUntil(doBackgroundSync());
    }
  });

  function doBackgroundSync() {
    // Implement your background sync logic here
    return fetch('https://example.com/api/sync')
      .then((response) => response.json())
      .then((data) => console.log('Background sync completed:', data))
      .catch((error) => console.error('Background sync failed:', error));
  }
})();
```

2. Atualize seu arquivo `angular.json` para usar o service worker personalizado:

```json
{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "options": {
            "assets": [
              {
                "glob": "**/*",
                "input": "public"
              },
              "app/src/custom-sw.js"
            ]
          }
        }
      }
    }
  }
}
```

3. Configure o registro do service worker para usar seu script personalizado:

```ts
import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('custom-sw.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
```

### Boas práticas para service workers personalizados

Ao estender o service worker Angular:

- **Sempre importe o service worker Angular primeiro** usando `importScripts('./ngsw-worker.js')` para garantir que você obtenha toda a funcionalidade de cache e atualização
- **Envolva seu código personalizado em uma IIFE** (Immediately Invoked Function Expression) para evitar poluir o escopo global
- **Use `event.waitUntil()`** para operações assíncronas para garantir que elas sejam concluídas antes que o service worker seja encerrado
- **Teste completamente** em ambientes de desenvolvimento e produção
- **Lide com erros graciosamente** para evitar que seu código personalizado quebre a funcionalidade do service worker Angular

### Casos de uso comuns

Service workers personalizados são comumente usados para:

- **Notificações push**: Lidar com mensagens push recebidas e exibir notificações
- **Sincronização em segundo plano**: Sincronizar dados quando a conexão de rede é restaurada
- **Navegação personalizada**: Lidar com cenários especiais de roteamento ou página offline
