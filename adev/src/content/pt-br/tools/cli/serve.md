<!-- ia-translate: true -->
# Servindo aplicações Angular para desenvolvimento

Você pode servir sua aplicação Angular CLI com o comando `ng serve`.
Isso irá compilar sua aplicação, pular otimizações desnecessárias, iniciar um devserver e automaticamente reconstruir e recarregar ao vivo quaisquer alterações subsequentes.
Você pode parar o servidor pressionando `Ctrl+C`.

`ng serve` apenas executa o builder para o target `serve` no projeto padrão conforme especificado em `angular.json`.
Embora qualquer builder possa ser usado aqui, o builder mais comum (e padrão) é `@angular-devkit/build-angular:dev-server`.

Você pode determinar qual builder está sendo usado para um projeto específico procurando o target `serve` desse projeto.

```json

{
  "projects": {
    "my-app": {
      "architect": {
        // `ng serve` invokes the Architect target named `serve`.
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          // ...
        },
        "build": { /* ... */ }
        "test": { /* ... */ }
      }
    }
  }
}

```

Esta página discute o uso e as opções de `@angular-devkit/build-angular:dev-server`.

## Proxy para um servidor backend

Use o [suporte a proxy](https://webpack.js.org/configuration/dev-server/#devserverproxy) para desviar certas URLs para um servidor backend, passando um arquivo para a opção de build `--proxy-config`.
Por exemplo, para desviar todas as chamadas para `http://localhost:4200/api` para um servidor rodando em `http://localhost:3000/api`, siga os passos a seguir.

1. Crie um arquivo `proxy.conf.json` na pasta `src/` do seu projeto.
1. Adicione o seguinte conteúdo ao novo arquivo de proxy:

```json
{
  "/api": {
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
          "builder": "@angular-devkit/build-angular:dev-server",
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

Edite o arquivo de configuração de proxy para adicionar opções de configuração; a seguir estão alguns exemplos.
Para uma descrição detalhada de todas as opções, consulte a [documentação do webpack DevServer](https://webpack.js.org/configuration/dev-server/#devserverproxy) ao usar `@angular-devkit/build-angular:browser`, ou a [documentação do Vite DevServer](https://vite.dev/config/server-options#server-proxy) ao usar `@angular-devkit/build-angular:browser-esbuild` ou `@angular-devkit/build-angular:application`.

NOTE: Se você editar o arquivo de configuração de proxy, você deve relançar o processo `ng serve` para tornar suas alterações efetivas.
