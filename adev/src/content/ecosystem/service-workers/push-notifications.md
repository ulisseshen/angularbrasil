<!-- ia-translate: true -->
# Push notifications

Push notifications são uma maneira convincente de engajar usuários.
Através do poder dos service workers, notificações podem ser entregues a um dispositivo mesmo quando sua aplicação não está em foco.

O Angular service worker habilita a exibição de push notifications e o tratamento de eventos de clique em notificações.

HELPFUL: Ao usar o Angular service worker, interações de push notification são tratadas usando o serviço `SwPush`.
Para saber mais sobre as APIs do navegador envolvidas, consulte [Push API](https://developer.mozilla.org/docs/Web/API/Push_API) e [Using the Notifications API](https://developer.mozilla.org/docs/Web/API/Notifications_API/Using_the_Notifications_API).

## Payload de notificação

Invoque push notifications enviando uma mensagem com um payload válido.
Consulte `SwPush` para orientação.

HELPFUL: No Chrome, você pode testar push notifications sem um backend.
Abra Devtools -> Application -> Service Workers e use o input `Push` para enviar um payload de notificação JSON.

## Tratamento de clique em notificações

O comportamento padrão para o evento `notificationclick` é fechar a notificação e notificar `SwPush.notificationClicks`.

Você pode especificar uma operação adicional a ser executada em `notificationclick` adicionando uma propriedade `onActionClick` ao objeto `data`, e fornecendo uma entrada `default`.
Isso é especialmente útil para quando não há clientes abertos quando uma notificação é clicada.

```json
{
  "notification": {
    "title": "New Notification!",
    "data": {
      "onActionClick": {
        "default": {"operation": "openWindow", "url": "foo"}
      }
    }
  }
}
```

### Operações

O Angular service worker suporta as seguintes operações:

| Operações                   | Detalhes                                                                                                                                             |
| :-------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------- |
| `openWindow`                | Abre uma nova aba na URL especificada.                                                                                                               |
| `focusLastFocusedOrOpen`    | Foca no último cliente focado. Se não houver cliente aberto, então abre uma nova aba na URL especificada.                                            |
| `navigateLastFocusedOrOpen` | Foca no último cliente focado e navega para a URL especificada. Se não houver cliente aberto, então abre uma nova aba na URL especificada.           |
| `sendRequest`               | Envia uma requisição GET simples para a URL especificada.                                                                                            |

IMPORTANT: URLs são resolvidas relativamente ao escopo de registro do service worker.<br />Se um item `onActionClick` não definir uma `url`, então o escopo de registro do service worker é usado.

### Actions

Actions oferecem uma maneira de customizar como o usuário pode interagir com uma notificação.

Usando a propriedade `actions`, você pode definir um conjunto de ações disponíveis.
Cada ação é representada como um botão de ação que o usuário pode clicar para interagir com a notificação.

Além disso, usando a propriedade `onActionClick` no objeto `data`, você pode vincular cada ação a uma operação a ser executada quando o botão de ação correspondente for clicado:

```json
{
  "notification": {
    "title": "New Notification!",
    "actions": [
      {"action": "foo", "title": "Open new tab"},
      {"action": "bar", "title": "Focus last"},
      {"action": "baz", "title": "Navigate last"},
      {"action": "qux", "title": "Send request in the background"},
      {"action": "other", "title": "Just notify existing clients"}
    ],
    "data": {
      "onActionClick": {
        "default": {"operation": "openWindow"},
        "foo": {"operation": "openWindow", "url": "/absolute/path"},
        "bar": {"operation": "focusLastFocusedOrOpen", "url": "relative/path"},
        "baz": {"operation": "navigateLastFocusedOrOpen", "url": "https://other.domain.com/"},
        "qux": {"operation": "sendRequest", "url": "https://yet.another.domain.com/"}
      }
    }
  }
}
```

IMPORTANT: Se uma ação não tiver uma entrada `onActionClick` correspondente, então a notificação é fechada e `SwPush.notificationClicks` é notificado em clientes existentes.

## Mais sobre Angular service workers

Você também pode estar interessado no seguinte:

<docs-pill-row>
  <docs-pill href="ecosystem/service-workers/communications" title="Comunicando com o Service Worker"/>
  <docs-pill href="ecosystem/service-workers/devops" title="Service Worker devops"/>
</docs-pill-row>
