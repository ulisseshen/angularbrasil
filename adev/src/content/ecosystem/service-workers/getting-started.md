<!-- ia-translate: true -->
# Começando com service workers

Este documento explica como habilitar o suporte ao Angular service worker em projetos que você criou com o [Angular CLI](tools/cli). Ele então usa um exemplo para mostrar um service worker em ação, demonstrando carregamento e cache básico.

## Adicionando um service worker ao seu projeto

Para configurar o Angular service worker em seu projeto, execute o seguinte comando CLI:

```shell

ng add @angular/pwa

```

O CLI configura sua aplicação para usar service workers com as seguintes ações:

1. Adiciona o pacote `@angular/service-worker` ao seu projeto.
1. Habilita o suporte de build do service worker no CLI.
1. Importa e registra o service worker com os providers raiz da aplicação.
1. Atualiza o arquivo `index.html`:
   - Inclui um link para adicionar o arquivo `manifest.webmanifest`
   - Adiciona uma meta tag para `theme-color`
1. Instala arquivos de ícone para suportar o Progressive Web App (PWA) instalado.
1. Cria o arquivo de configuração do service worker chamado [`ngsw-config.json`](ecosystem/service-workers/config),
   que especifica os comportamentos de cache e outras configurações.

Agora, faça o build do projeto:

```shell

ng build

```

O projeto CLI agora está configurado para usar o Angular service worker.

## Service worker em ação: um tour

Esta seção demonstra um service worker em ação,
usando uma aplicação de exemplo. Para habilitar o suporte ao service worker durante o desenvolvimento local, use a configuração de produção com o seguinte comando:

```shell

ng serve --configuration=production

```

Alternativamente, você pode usar o pacote [`http-server`](https://www.npmjs.com/package/http-server) do
npm, que suporta aplicações com service worker. Execute-o sem instalação usando:

```shell

npx http-server -p 8080 -c-1 dist/<project-name>/browser

```

Isso servirá sua aplicação com suporte ao service worker em http://localhost:8080.

### Carregamento inicial

Com o servidor rodando na porta `8080`, aponte seu navegador para `http://localhost:8080`.
Sua aplicação deve carregar normalmente.

TIP: Ao testar Angular service workers, é uma boa ideia usar uma janela anônima ou privada em seu navegador para garantir que o service worker não acabe lendo de um estado residual anterior, o que pode causar comportamento inesperado.

HELPFUL: Se você não estiver usando HTTPS, o service worker só será registrado ao acessar a aplicação em `localhost`.

### Simulando um problema de rede

Para simular um problema de rede, desabilite a interação de rede para sua aplicação.

No Chrome:

1. Selecione **Tools** > **Developer Tools** (do menu do Chrome localizado no canto superior direito).
1. Vá para a aba **Network**.
1. Selecione **Offline** no menu suspenso **Throttling**.

<img alt="A opção offline na aba Network está selecionada" src="assets/images/guide/service-worker/offline-option.png">

Agora a aplicação não tem acesso à interação de rede.

Para aplicações que não usam o Angular service worker, atualizar agora exibiria a página de Internet desconectada do Chrome que diz "There is no Internet connection".

Com a adição de um Angular service worker, o comportamento da aplicação muda.
Em uma atualização, a página carrega normalmente.

Veja a aba Network para verificar que o service worker está ativo.

<img alt="Requisições estão marcadas como from ServiceWorker" src="assets/images/guide/service-worker/sw-active.png">

HELPFUL: Na coluna "Size", o estado das requisições é `(ServiceWorker)`.
Isso significa que os recursos não estão sendo carregados da rede.
Em vez disso, eles estão sendo carregados do cache do service worker.

### O que está sendo armazenado em cache?

Observe que todos os arquivos que o navegador precisa para renderizar esta aplicação estão em cache.
A configuração boilerplate `ngsw-config.json` está configurada para armazenar em cache os recursos específicos usados pelo CLI:

- `index.html`
- `favicon.ico`
- Artefatos de build (bundles JS e CSS)
- Qualquer coisa em `assets`
- Imagens e fontes diretamente sob o `outputPath` configurado (por padrão `./dist/<project-name>/`) ou `resourcesOutputPath`.
  Consulte a documentação para `ng build` para mais informações sobre essas opções.

IMPORTANT: O `ngsw-config.json` gerado inclui uma lista limitada de extensões de fontes e imagens que podem ser armazenadas em cache. Em alguns casos, você pode querer modificar o padrão glob para atender às suas necessidades.

IMPORTANT: Se os caminhos `resourcesOutputPath` ou `assets` forem modificados após a geração do arquivo de configuração, você precisa alterar os caminhos manualmente em `ngsw-config.json`.

### Fazendo alterações na sua aplicação

Agora que você viu como service workers armazenam sua aplicação em cache, o próximo passo é entender como as atualizações funcionam.
Faça uma alteração na aplicação e observe o service worker instalar a atualização:

1. Se você estiver testando em uma janela anônima, abra uma segunda aba em branco.
   Isso mantém a janela anônima e o estado do cache ativos durante seu teste.

1. Feche a aba da aplicação, mas não a janela.
   Isso também deve fechar as Developer Tools.

1. Desligue o `http-server` (Ctrl-c).
1. Abra `src/app/app.component.html` para edição.
1. Mude o texto `Welcome to {{title}}!` para `Bienvenue à {{title}}!`.
1. Faça o build e execute o servidor novamente:

```shell
    ng build
    npx http-server -p 8080 -c-1 dist/<project-name>/browser
```

### Atualizando sua aplicação no navegador

Agora veja como o navegador e o service worker lidam com a aplicação atualizada.

1. Abra [http://localhost:8080](http://localhost:8080) novamente na mesma janela.
   O que acontece?

   <img alt="Ainda diz Welcome to Service Workers!" src="assets/images/guide/service-worker/welcome-msg-en.png">

   O que deu errado?
   _Nada, na verdade!_
   O Angular service worker está fazendo seu trabalho e servindo a versão da aplicação que ele **instalou**, mesmo que haja uma atualização disponível.
   No interesse da velocidade, o service worker não espera para verificar atualizações antes de servir a aplicação que ele tem em cache.

   Veja os logs do `http-server` para ver o service worker requisitando `/ngsw.json`.

   ```text
   [2023-09-07T00:37:24.372Z]  "GET /ngsw.json?ngsw-cache-bust=0.9365263935102124" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
   ```

   É assim que o service worker verifica por atualizações.

1. Atualize a página.

   <img alt="O texto mudou para dizer Bienvenue à app!" src="assets/images/guide/service-worker/welcome-msg-fr.png">

   O service worker instalou a versão atualizada da sua aplicação _em segundo plano_, e da próxima vez que a página for carregada ou recarregada, o service worker muda para a versão mais recente.

## Configuração do service worker

O Angular service workers suportam opções de configuração abrangentes através da interface `SwRegistrationOptions`, fornecendo controle refinado sobre comportamento de registro, cache e execução de script.

### Habilitando e desabilitando service workers

A opção `enabled` controla se o service worker será registrado e se os serviços relacionados tentarão se comunicar com ele.

```ts

import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(), // Desabilitar em desenvolvimento, habilitar em produção
    }),
  ],
};

```

### Controle de cache com updateViaCache

A opção `updateViaCache` controla como o navegador consulta o cache HTTP durante as atualizações do service worker. Isso fornece controle refinado sobre quando o navegador busca scripts de service worker atualizados e módulos importados.

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

- **`'imports'`** - O cache HTTP é consultado para os scripts importados do service worker, mas não para o próprio script do service worker
- **`'all'`** - O cache HTTP é consultado tanto para o script do service worker quanto para seus scripts importados
- **`'none'`** - O cache HTTP não é consultado para o script do service worker ou seus scripts importados

### Suporte a ES Module com opção type

A opção `type` permite especificar o tipo de script ao registrar service workers, fornecendo suporte para recursos de ES module em seus scripts de service worker.

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

- **`'classic'`** (padrão) - Execução de script de service worker tradicional. Recursos de ES module como `import` e `export` NÃO são permitidos no script
- **`'module'`** - Registra o script como um ES module. Permite uso de sintaxe `import`/`export` e recursos de module

### Controle de escopo de registro

A opção `scope` define o escopo de registro do service worker, determinando qual faixa de URLs ele pode controlar.

```ts

export const appConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      scope: '/app/', // Service worker só controlará URLs sob /app/
    }),
  ],
};

```

- Controla quais URLs o service worker pode interceptar e gerenciar
- Por padrão, o escopo é o diretório que contém o script do service worker
- Usado ao chamar `ServiceWorkerContainer.register()`

### Configuração de estratégia de registro

A opção `registrationStrategy` define quando o service worker será registrado com o navegador, fornecendo controle sobre o timing do registro.

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

- **`'registerWhenStable:timeout'`** (padrão: `'registerWhenStable:30000'`) - Registrar assim que a aplicação estabilizar (sem micro-/macro-tasks pendentes) mas não depois do timeout especificado em milissegundos
- **`'registerImmediately'`** - Registrar o service worker imediatamente
- **`'registerWithDelay:timeout'`** - Registrar com um atraso do timeout especificado em milissegundos

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

Você também pode fornecer uma função factory Observable para timing de registro personalizado:

```ts
import { timer } from 'rxjs';

export const customConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: () => timer(10_000), // Registrar após 10 segundos
    }),
  ],
};

```

## Mais sobre Angular service workers

Você também pode estar interessado no seguinte:

<docs-pill-row>
  <docs-pill href="ecosystem/service-workers/config" title="Arquivo de configuração"/>
  <docs-pill href="ecosystem/service-workers/communications" title="Comunicando com o Service Worker"/>
  <docs-pill href="ecosystem/service-workers/push-notifications" title="Push notifications"/>
  <docs-pill href="ecosystem/service-workers/devops" title="Service Worker devops"/>
  <docs-pill href="ecosystem/service-workers/app-shell" title="App shell pattern"/>
</docs-pill-row>
