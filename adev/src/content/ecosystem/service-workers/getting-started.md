<!-- ia-translate: true -->

# Começando com service workers {#getting-started-with-service-workers}

Este documento explica como habilitar o suporte ao Angular service worker em projetos que você criou com o [Angular CLI](tools/cli). Em seguida, usa um exemplo para mostrar um service worker em ação, demonstrando carregamento e cache básico.

## Adicionando um service worker ao seu projeto {#adding-a-service-worker-to-your-project}

Para configurar o Angular service worker no seu projeto, execute o seguinte comando da CLI:

```shell

ng add @angular/pwa

```

A CLI configura sua aplicação para usar service workers com as seguintes ações:

1. Adiciona o pacote `@angular/service-worker` ao seu projeto.
1. Habilita o suporte de build do service worker na CLI.
1. Importa e registra o service worker com os providers raiz da aplicação.
1. Atualiza o arquivo `index.html`:
   - Inclui um link para adicionar o arquivo `manifest.webmanifest`
   - Adiciona uma meta tag para `theme-color`
1. Instala arquivos de ícone para dar suporte ao Progressive Web App (PWA) instalado.
1. Cria o arquivo de configuração do service worker chamado [`ngsw-config.json`](ecosystem/service-workers/config),
   que especifica os comportamentos de cache e outras configurações.

Agora, faça o build do projeto:

```shell

ng build

```

O projeto CLI agora está configurado para usar o Angular service worker.

## Service worker em ação: um tour {#service-worker-in-action-a-tour}

Esta seção demonstra um service worker em ação,
usando uma aplicação de exemplo. Para habilitar o suporte ao service worker durante o desenvolvimento local, use a configuração de produção com o seguinte comando:

```shell

ng serve --configuration=production

```

Alternativamente, você pode usar o [pacote `http-server`](https://www.npmjs.com/package/http-server) do
npm, que oferece suporte a aplicações com service worker. Execute-o sem instalação usando:

```shell

npx http-server -p 8080 -c-1 dist/<project-name>/browser

```

Isso servirá sua aplicação com suporte ao service worker em http://localhost:8080.

### Carregamento inicial {#initial-load}

Com o servidor em execução na porta `8080`, aponte seu navegador para `http://localhost:8080`.
Sua aplicação deve carregar normalmente.

TIP: Ao testar Angular service workers, é uma boa ideia usar uma janela anônima ou privada no seu navegador, para garantir que o service worker não acabe lendo de um estado residual anterior, o que pode causar comportamento inesperado.

HELPFUL: Se você não estiver usando HTTPS, o service worker só será registrado ao acessar a aplicação em `localhost`.

### Simulando um problema de rede {#simulating-a-network-issue}

Para simular um problema de rede, desabilite a interação de rede da sua aplicação.

No Chrome:

1. Selecione **Tools** > **Developer Tools** (no menu do Chrome, no canto superior direito).
1. Vá para a aba **Network**.
1. Selecione **Offline** no menu suspenso **Throttling**.

<img alt="A opção offline na aba Network está selecionada" src="assets/images/guide/service-worker/offline-option.png">

Agora a aplicação não tem acesso à interação de rede.

Para aplicações que não usam o Angular service worker, atualizar a página agora exibiria a página de Internet desconectada do Chrome, que diz "There is no Internet connection".

Com a adição de um Angular service worker, o comportamento da aplicação muda.
Ao atualizar, a página carrega normalmente.

Veja a aba Network para verificar que o service worker está ativo.

<img alt="Requisições estão marcadas como from ServiceWorker" src="assets/images/guide/service-worker/sw-active.png">

HELPFUL: Na coluna "Size", o estado das requisições é `(ServiceWorker)`.
Isso significa que os recursos não estão sendo carregados da rede.
Em vez disso, eles estão sendo carregados do cache do service worker.

### O que está sendo armazenado em cache? {#whats-being-cached}

Observe que todos os arquivos que o navegador precisa para renderizar esta aplicação estão em cache.
A configuração boilerplate `ngsw-config.json` está configurada para armazenar em cache os recursos específicos usados pela CLI:

- `index.html` (e `index.csr.html` para aplicações com server-side rendering ou prerendering)
- `favicon.ico` e `manifest.webmanifest`
- Artefatos de build (bundles JS e CSS)
- Imagens e fontes em qualquer lugar da saída do browser (por padrão `./dist/<project-name>/browser/`)

IMPORTANT: O `ngsw-config.json` gerado inclui uma lista limitada de extensões de fontes e imagens que podem ser armazenadas em cache. Em alguns casos, você pode querer modificar o padrão glob para atender às suas necessidades.

### Fazendo alterações na sua aplicação {#making-changes-to-your-application}

Agora que você viu como os service workers armazenam sua aplicação em cache, o próximo passo é entender como as atualizações funcionam.
Faça uma alteração na aplicação e observe o service worker instalar a atualização:

1. Se você estiver testando em uma janela anônima, abra uma segunda aba em branco.
   Isso mantém a janela anônima e o estado do cache ativos durante o seu teste.

1. Feche a aba da aplicação, mas não a janela.
   Isso também deve fechar as Developer Tools.

1. Desligue o `http-server` (Ctrl-c).
1. Abra `src/app/app.html` para edição.
1. Mude o texto `Hello, {{ title() }}` para `Bienvenue à {{ title() }}!`.
1. Faça o build e execute o servidor novamente:

```shell
    ng build
    npx http-server -p 8080 -c-1 dist/<project-name>/browser
```

### Atualizando sua aplicação no navegador {#updating-your-application-in-the-browser}

Agora veja como o navegador e o service worker lidam com a aplicação atualizada.

1. Abra [http://localhost:8080](http://localhost:8080) novamente na mesma janela.
   O que acontece?

   <img alt="Ainda diz Welcome to Service Workers!" src="assets/images/guide/service-worker/welcome-msg-en.png">

   O que deu errado?
   _Nada, na verdade!_
   O Angular service worker está fazendo seu trabalho e servindo a versão da aplicação que ele **instalou**, mesmo que haja uma atualização disponível.
   Por uma questão de velocidade, o service worker não espera para verificar atualizações antes de servir a aplicação que ele tem em cache.

   Veja os logs do `http-server` para ver o service worker requisitando `/ngsw.json`.

   ```text
   [2023-09-07T00:37:24.372Z]  "GET /ngsw.json?ngsw-cache-bust=0.9365263935102124" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
   ```

   É assim que o service worker verifica se há atualizações.

1. Atualize a página.

   <img alt="O texto mudou para dizer Bienvenue à app!" src="assets/images/guide/service-worker/welcome-msg-fr.png">

   O service worker instalou a versão atualizada da sua aplicação _em segundo plano_, e na próxima vez que a página for carregada ou recarregada, o service worker muda para a versão mais recente.

## Configuração do service worker {#service-worker-configuration}

Os Angular service workers oferecem opções de configuração abrangentes por meio da interface `SwRegistrationOptions`, fornecendo controle refinado sobre o comportamento de registro, cache e execução de scripts.

### Habilitando e desabilitando service workers {#enabling-and-disabling-service-workers}

A opção `enabled` controla se o service worker será registrado e se os serviços relacionados tentarão se comunicar com ele.

```ts
import {ApplicationConfig, isDevMode} from '@angular/core';
import {provideServiceWorker} from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(), // Desabilitar em desenvolvimento, habilitar em produção
    }),
  ],
};
```

### Controle de cache com updateViaCache {#cache-control-with-updateviacache}

A opção `updateViaCache` controla como o navegador consulta o cache HTTP durante as atualizações do service worker. Isso oferece controle refinado sobre quando o navegador busca scripts de service worker atualizados e módulos importados.

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      updateViaCache: 'imports',
    }),
  ],
};
```

A opção `updateViaCache` aceita os seguintes valores:

- **`'imports'`** - O cache HTTP é consultado para os scripts importados pelo service worker, mas não para o próprio script do service worker
- **`'all'`** - O cache HTTP é consultado tanto para o script do service worker quanto para seus scripts importados
- **`'none'`** - O cache HTTP não é consultado para o script do service worker nem para seus scripts importados

### Suporte a ES Module com opção type {#es-module-support-with-type-option}

A opção `type` permite especificar o tipo de script ao registrar service workers, oferecendo suporte a recursos de ES module nos seus scripts de service worker.

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      type: 'module', // Habilitar recursos de ES module
    }),
  ],
};
```

A opção `type` aceita os seguintes valores:

- **`'classic'`** (padrão) - Execução tradicional de script de service worker. Recursos de ES module como `import` e `export` NÃO são permitidos no script
- **`'module'`** - Registra o script como um ES module. Permite o uso da sintaxe `import`/`export` e dos recursos de module

### Controle de escopo de registro {#registration-scope-control}

A opção `scope` define o escopo de registro do service worker, determinando qual faixa de URLs ele pode controlar.

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      scope: '/app/', // O service worker só controlará URLs em /app/
    }),
  ],
};
```

- Controla quais URLs o service worker pode interceptar e gerenciar
- Por padrão, o escopo é o diretório que contém o script do service worker
- Usado ao chamar `ServiceWorkerContainer.register()`

### Configuração de estratégia de registro {#registration-strategy-configuration}

A opção `registrationStrategy` define quando o service worker será registrado no navegador, oferecendo controle sobre o momento do registro.

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
```

Estratégias de registro disponíveis:

- **`'registerWhenStable:timeout'`** (padrão: `'registerWhenStable:30000'`) - Registra assim que a aplicação estabilizar (sem micro/macro-tasks pendentes), mas não depois do timeout especificado em milissegundos
  O timeout é obrigatório. Sem ele, `'registerWhenStable'` registra o service worker imediatamente.
- **`'registerImmediately'`** - Registra o service worker imediatamente
- **`'registerWithDelay:timeout'`** - Registra com um atraso do timeout especificado em milissegundos

```ts
// Registrar imediatamente
export const immediateConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerImmediately',
    }),
  ],
};

// Registrar com um atraso de 5 segundos
export const delayedConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWithDelay:5000',
    }),
  ],
};
```

Você também pode fornecer uma função factory de Observable para definir um momento de registro personalizado:

```ts
import {ApplicationConfig, isDevMode} from '@angular/core';
import {provideServiceWorker} from '@angular/service-worker';
import {timer} from 'rxjs';

export const customConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: () => timer(10_000), // Registrar após 10 segundos
    }),
  ],
};
```

## Mais sobre Angular service workers {#more-on-angular-service-workers}

Você também pode se interessar pelo seguinte:

<docs-pill-row>
  <docs-pill href="ecosystem/service-workers/config" title="Arquivo de configuração"/>
  <docs-pill href="ecosystem/service-workers/communications" title="Comunicando com o Service Worker"/>
  <docs-pill href="ecosystem/service-workers/push-notifications" title="Notificações push"/>
  <docs-pill href="ecosystem/service-workers/devops" title="Devops do service worker"/>
  <docs-pill href="ecosystem/service-workers/app-shell" title="Padrão app shell"/>
</docs-pill-row>
