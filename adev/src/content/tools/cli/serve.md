<!-- ia-translate: true -->

# Servindo aplicações Angular para desenvolvimento

Você pode servir sua aplicação Angular CLI com o comando `ng serve`.
Isso compilará sua aplicação, pulará otimizações desnecessárias, iniciará um devserver, e automaticamente reconstruirá e recarregará em tempo real quaisquer alterações subsequentes.
Você pode parar o servidor pressionando `Ctrl+C`.

`ng serve` executa apenas o builder para o target `serve` no projeto padrão conforme especificado em `angular.json`.
Embora qualquer builder possa ser usado aqui, o mais comum (e padrão) é `@angular-devkit/build-angular:dev-server`.

Você pode determinar qual builder está sendo usado para um projeto específico procurando o target `serve` para esse projeto.

```json

{
  "projects": {
    "my-app": {
      "architect": {
        // `ng serve` invoca o target Architect chamado `serve`.
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

Esta página discute o uso e opções de `@angular-devkit/build-angular:dev-server`.

## Proxying para um servidor backend

Use o [suporte a proxying](https://webpack.js.org/configuration/dev-server/#devserverproxy) para desviar certas URLs para um servidor backend, passando um arquivo para a opção de build `--proxy-config`.
Por exemplo, para desviar todas as chamadas para `http://localhost:4200/api` para um servidor executando em `http://localhost:3000/api`, siga os seguintes passos.

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

1. No arquivo de configuração CLI, `angular.json`, adicione a opção `proxyConfig` ao target `serve`:

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

NOTA: Se você editar o arquivo de configuração de proxy, você deve relançar o processo `ng serve` para tornar suas alterações efetivas.
