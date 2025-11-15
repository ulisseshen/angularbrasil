<!-- ia-translate: true -->
# Padrão App shell

O [padrão App shell](https://developer.chrome.com/blog/app-shell) é uma maneira de renderizar uma parte da sua aplicação usando um route em tempo de build.
Ele pode melhorar a experiência do usuário ao iniciar rapidamente uma página renderizada estaticamente (um esqueleto comum a todas as páginas) enquanto o browser baixa a versão completa do client e muda para ela automaticamente após o código carregar.

Isso oferece aos usuários uma primeira renderização significativa da sua aplicação que aparece rapidamente porque o browser pode renderizar o HTML e CSS sem a necessidade de inicializar qualquer JavaScript.

<docs-workflow>
<docs-step title="Preparar a aplicação">
Faça isso com o seguinte comando do Angular CLI:

<docs-code language="shell">

ng new my-app

</docs-code>

Para uma aplicação existente, você tem que adicionar manualmente o `Router` e definir um `<router-outlet>` dentro da sua aplicação.
</docs-step>
<docs-step title="Criar o application shell">
Use o Angular CLI para criar automaticamente o application shell.

<docs-code language="shell">

ng generate app-shell

</docs-code>

Para mais informações sobre este comando, veja [Comando App shell](cli/generate/app-shell).

O comando atualiza o código da aplicação e adiciona arquivos extras à estrutura do projeto.

<docs-code language="text">
src
├── app
│ ├── app.config.server.ts # server application configuration
│ └── app-shell # app-shell component
│   ├── app-shell.component.html
│   ├── app-shell.component.scss
│   ├── app-shell.component.spec.ts
│   └── app-shell.component.ts
└── main.server.ts # main server application bootstrapping
</docs-code>

<docs-step title="Verificar se a aplicação é construída com o conteúdo do shell">

<docs-code language="shell">

ng build --configuration=development

</docs-code>

Ou para usar a configuração de produção.

<docs-code language="shell">

ng build

</docs-code>

Para verificar a saída do build, abra <code class="no-auto-link">dist/my-app/browser/index.html</code>.
Procure pelo texto padrão `app-shell works!` para mostrar que o route do application shell foi renderizado como parte da saída.
</docs-step>
</docs-workflow>
