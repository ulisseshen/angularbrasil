<!-- ia-translate: true -->
# Deployment

Quando você estiver pronto para fazer o deploy da sua aplicação Angular em um servidor remoto, você tem várias opções.

## Deploy automático com o CLI

O comando `ng deploy` do Angular CLI executa o [CLI builder](tools/cli/cli-builder) de `deploy` associado ao seu projeto.
Vários builders de terceiros implementam capacidades de deployment para diferentes plataformas.
Você pode adicionar qualquer um deles ao seu projeto com `ng add`.

Quando você adiciona um package com capacidade de deployment, ele atualizará automaticamente a configuração do seu workspace (arquivo `angular.json`) com uma seção `deploy` para o projeto selecionado.
Você pode então usar o comando `ng deploy` para fazer o deploy desse projeto.

Por exemplo, o comando a seguir faz o deploy automático de um projeto para o [Firebase](https://firebase.google.com/).

```shell

ng add @angular/fire
ng deploy

```

O comando é interativo.
Neste caso, você deve ter ou criar uma conta do Firebase e autenticar usando ela.
O comando solicita que você selecione um projeto Firebase para deployment antes de fazer o build da sua aplicação e enviar os assets de produção para o Firebase.

A tabela abaixo lista ferramentas que implementam funcionalidade de deployment para diferentes plataformas.
O comando `deploy` para cada package pode exigir diferentes opções de linha de comando.
Você pode ler mais seguindo os links associados aos nomes dos packages abaixo:

| Deployment para                                                   | Comando de Setup                                                                            |
| :---------------------------------------------------------------- | :------------------------------------------------------------------------------------------ |
| [Firebase hosting](https://firebase.google.com/docs/hosting)      | [`ng add @angular/fire`](https://npmjs.org/package/@angular/fire)                           |
| [Vercel](https://vercel.com/solutions/angular)                    | [`vercel init angular`](https://github.com/vercel/vercel/tree/main/examples/angular)        |
| [Netlify](https://www.netlify.com)                                | [`ng add @netlify-builder/deploy`](https://npmjs.org/package/@netlify-builder/deploy)       |
| [GitHub pages](https://pages.github.com)                          | [`ng add angular-cli-ghpages`](https://npmjs.org/package/angular-cli-ghpages)               |
| [Amazon Cloud S3](https://aws.amazon.com/s3/?nc2=h_ql_prod_st_s3) | [`ng add @jefiozie/ngx-aws-deploy`](https://www.npmjs.com/package/@jefiozie/ngx-aws-deploy) |

Se você está fazendo deploy para um servidor auto-gerenciado ou não há um builder para sua plataforma de cloud favorita, você pode [criar um builder](tools/cli/cli-builder) que permita usar o comando `ng deploy`, ou ler este guia para aprender como fazer o deploy manual da sua aplicação.

## Deploy manual para um servidor remoto

Para fazer o deploy manual da sua aplicação, crie um build de produção e copie o diretório de saída para um servidor web ou rede de distribuição de conteúdo (CDN).
Por padrão, `ng build` usa a configuração `production`.
Se você personalizou suas configurações de build, talvez queira confirmar se as [otimizações de produção](tools/cli/deployment#production-optimizations) estão sendo aplicadas antes de fazer o deploy.

`ng build` gera os artefatos construídos em `dist/my-app/` por padrão, porém este caminho pode ser configurado com a opção `outputPath` no builder `@angular-devkit/build-angular:browser`.
Copie este diretório para o servidor e configure-o para servir o diretório.

Embora esta seja uma solução de deployment mínima, existem alguns requisitos para o servidor servir sua aplicação Angular corretamente.

## Configuração do servidor

Esta seção cobre mudanças que você pode precisar configurar no servidor para executar sua aplicação Angular.

### Aplicações com rotas devem redirecionar para `index.html`

Aplicações Angular renderizadas no lado do cliente são candidatas perfeitas para servir com um servidor HTML estático porque todo o conteúdo é estático e gerado em tempo de build.

Se a aplicação usa o Angular router, você deve configurar o servidor para retornar a página host da aplicação (`index.html`) quando solicitado um arquivo que ele não possui.

Uma aplicação com rotas deve suportar "deep links".
Um _deep link_ é uma URL que especifica um caminho para um component dentro da aplicação.
Por exemplo, `http://my-app.test/users/42` é um _deep link_ para a página de detalhes do usuário que exibe o usuário com `id` 42.

Não há problema quando o usuário inicialmente carrega a página index e então navega para essa URL de dentro de um client em execução.
O Angular router realiza a navegação _no lado do cliente_ e não solicita uma nova página HTML.

Mas clicar em um deep link em um email, digitá-lo na barra de endereços do browser, ou até mesmo atualizar o browser enquanto já estiver na página do deep link será tratado pelo próprio browser, _fora_ da aplicação em execução.
O browser faz uma solicitação direta ao servidor para `/users/42`, ignorando o router do Angular.

Um servidor estático rotineiramente retorna `index.html` quando recebe uma solicitação para `http://my-app.test/`.
Mas a maioria dos servidores por padrão rejeitará `http://my-app.test/users/42` e retorna um erro `404 - Not Found` _a menos que_ seja configurado para retornar `index.html` em vez disso.
Configure a rota de fallback ou página 404 para `index.html` no seu servidor, para que o Angular seja servido para deep links e possa exibir a rota correta.
Alguns servidores chamam esse comportamento de fallback de modo "Single-Page Application" (SPA).

Uma vez que o browser carregue a aplicação, o Angular router lerá a URL para determinar em qual página está e exibirá `/users/42` corretamente.

Para páginas 404 "reais" como `http://my-app.test/does-not-exist`, o servidor não requer nenhuma configuração adicional.
[Páginas 404 implementadas no Angular router](guide/routing/common-router-tasks#displaying-a-404-page) serão exibidas corretamente.

### Solicitando dados de um servidor diferente (CORS)

Desenvolvedores web podem encontrar um erro de [_cross-origin resource sharing_](https://developer.mozilla.org/docs/Web/HTTP/CORS 'Cross-origin resource sharing') ao fazer uma solicitação de rede para um servidor diferente do servidor host da aplicação.
Browsers proíbem tais solicitações a menos que o servidor as permita explicitamente.

Não há nada que o Angular ou a aplicação client possa fazer sobre esses erros.
O _servidor_ deve ser configurado para aceitar as solicitações da aplicação.
Leia sobre como habilitar CORS para servidores específicos em [enable-cors.org](https://enable-cors.org/server.html 'Enabling CORS server').

## Otimizações de produção

`ng build` usa a configuração `production` a menos que configurado de outra forma. Esta configuração habilita os seguintes recursos de otimização de build.

| Recursos                                                          | Detalhes                                                                                                        |
| :---------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------- |
| [Ahead-of-Time (AOT) Compilation](tools/cli/aot-compiler)         | Pré-compila os templates de components do Angular.                                                             |
| [Modo de produção](tools/cli/deployment#development-only-features) | Otimiza a aplicação para o melhor desempenho em tempo de execução                                             |
| Bundling                                                          | Concatena seus vários arquivos de aplicação e biblioteca em um número mínimo de arquivos para deployment.       |
| Minification                                                      | Remove espaços em branco excessivos, comentários e tokens opcionais.                                            |
| Mangling                                                          | Renomeia funções, classes e variáveis para usar identificadores mais curtos e arbitrários.                      |
| Dead code elimination                                             | Remove módulos não referenciados e código não utilizado.                                                        |

Veja [`ng build`](cli/build) para mais sobre as opções de build do CLI e seus efeitos.

### Recursos apenas para desenvolvimento

Quando você executa uma aplicação localmente usando `ng serve`, o Angular usa a configuração de desenvolvimento
em tempo de execução que habilita:

- Verificações extras de segurança como a detecção de [`expression-changed-after-checked`](errors/NG0100).
- Mensagens de erro mais detalhadas.
- Utilitários adicionais de debug como a variável global `ng` com [funções de debug](api#core-global) e suporte para [Angular DevTools](tools/devtools).

Esses recursos são úteis durante o desenvolvimento, mas eles exigem código extra na aplicação, o que é
indesejável em produção. Para garantir que esses recursos não impactem negativamente o tamanho do bundle para os usuários finais, o Angular CLI
remove código exclusivo de desenvolvimento do bundle ao fazer o build para produção.

Fazer o build da sua aplicação com `ng build` por padrão usa a configuração `production` que remove esses recursos da saída para um tamanho de bundle otimizado.

## `--deploy-url`

`--deploy-url` é uma opção de linha de comando usada para especificar o caminho base para resolver URLs relativas para assets como imagens, scripts e folhas de estilo em tempo de _compilação_.

```shell

ng build --deploy-url /my/assets

```

O efeito e propósito de `--deploy-url` se sobrepõe a [`<base href>`](guide/routing/common-router-tasks). Ambos podem ser usados para scripts iniciais, folhas de estilo, scripts lazy e recursos css.

Diferente de `<base href>` que pode ser definido em um único lugar em tempo de execução, o `--deploy-url` precisa ser codificado na aplicação em tempo de build.
Prefira `<base href>` quando possível.
