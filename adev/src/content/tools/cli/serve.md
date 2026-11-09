<!-- ia-translate: true -->
# Servindo aplicações Angular para desenvolvimento {#serving-angular-apps-for-development}

Você pode servir sua aplicação Angular CLI com o comando `ng serve`.
Isso compila sua aplicação, pula otimizações desnecessárias, inicia um devserver e, automaticamente, reconstrói e recarrega a página (live reload) a cada alteração subsequente.
Você pode parar o servidor pressionando `Ctrl+C`.

`ng serve` executa apenas o builder do target `serve` no projeto padrão, conforme especificado em `angular.json`. Embora qualquer builder possa ser usado aqui, o mais comum (e padrão) é `@angular/build:dev-server`.

Você pode determinar qual builder está sendo usado para um projeto específico consultando o target `serve` desse projeto.

```json

{
  "projects": {
    "my-app": {
      "architect": {
        // `ng serve` invoca o target Architect chamado `serve`.
        "serve": {
          "builder": "@angular/build:dev-server"
          // ...
        },
        "build": {/* ... */},
        "test": {/* ... */}
      }
    }
  }
}

```

## Proxying para um servidor backend {#proxying-to-a-backend-server}

Use o [suporte a proxy](https://vite.dev/config/server-options#server-proxy) para desviar certas URLs para um servidor backend, passando um arquivo para a opção de build `--proxy-config`.
Por exemplo, para desviar todas as chamadas para `http://localhost:4200/api` para um servidor executando em `http://localhost:3000/api`, siga os passos a seguir.

1. Crie um arquivo `proxy.conf.json` na pasta `src/` do seu projeto.
1. Adicione o seguinte conteúdo ao novo arquivo de proxy:

```json
{
  "/api/**": {
    "target": "http://localhost:3000",
    "secure": false
  }
}
```

1. No arquivo de configuração do CLI, `angular.json`, adicione a opção `proxyConfig` ao target `serve`:

```json
{
  "projects": {
    "my-app": {
      "architect": {
        "serve": {
          "builder": "@angular/build:dev-server",
          "options": {
            "proxyConfig": "src/proxy.conf.json"
          }
        }
      }
    }
  }
}
```

1. Para executar o servidor de desenvolvimento com esta configuração de proxy, chame `ng serve`.

NOTE: Para aplicar alterações feitas no seu arquivo de configuração de proxy, você deve reiniciar o processo `ng serve`.

### Comportamento de correspondência de caminhos {#path-matching-behavior}

- `/api` corresponde a `/api` e a qualquer caminho que comece com ele, como `/api/users/123` ou `/api-docs`.
- `/api/*` corresponde a `/api/users`, mas não a `/api` nem a `/api/users/123`.
- `/api/**` corresponde a `/api`, `/api/users` e `/api/users/123`, mas não a `/api-docs`.
