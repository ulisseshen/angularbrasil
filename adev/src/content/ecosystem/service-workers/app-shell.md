<!-- ia-translate: true -->
# Padrão App shell

O [padrão App shell](https://developer.chrome.com/blog/app-shell) é uma forma de renderizar uma parte da sua aplicação usando uma rota em tempo de build.
Ele pode melhorar a experiência do usuário ao iniciar rapidamente uma página renderizada estaticamente (um esqueleto comum a todas as páginas), enquanto o navegador baixa a versão completa do client e alterna para ela automaticamente depois que o código carrega.

Isso oferece aos usuários uma primeira renderização significativa da sua aplicação, que aparece rapidamente porque o navegador pode renderizar o HTML e o CSS sem precisar inicializar nenhum JavaScript.

<docs-workflow>
<docs-step title="Preparar a aplicação {#prepare-the-application}">
Faça isso com o seguinte comando do Angular CLI:

```shell
ng new my-app
```

Para uma aplicação existente, você precisa adicionar manualmente o `Router` e definir um `<router-outlet>` dentro da sua aplicação.
</docs-step>
<docs-step title="Criar o application shell {#create-the-application-shell}">
Use o Angular CLI para criar automaticamente o application shell.

```shell
ng generate app-shell
```

Para mais informações sobre este comando, veja [Comando App shell](cli/generate/app-shell).

O comando atualiza o código da aplicação e adiciona arquivos extras à estrutura do projeto.

```text
src
├── app
│ ├── app.config.server.ts # server application configuration
│ ├── app.routes.server.ts # server routes configuration
│ └── app-shell # app-shell component
│   ├── app-shell.css
│   ├── app-shell.html
│   ├── app-shell.spec.ts
│   └── app-shell.ts
└── main.server.ts # main server application bootstrapping
```

</docs-step>
<docs-step title="Verifique se a aplicação é construída com o conteúdo do shell {#verify-the-application-is-built-with-the-shell-content}">

```shell
ng build --configuration=development
```

Ou, para usar a configuração de produção:

```shell
ng build
```

Para verificar a saída do build, abra <code class="no-auto-link">dist/my-app/browser/index.html</code>.
Procure pelo texto padrão `app-shell works!` para confirmar que a rota do application shell foi renderizada como parte da saída.
</docs-step>
</docs-workflow>
