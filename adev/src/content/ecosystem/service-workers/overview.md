<!-- ia-translate: true -->
# Visão geral do Angular service worker

IMPORTANT: O Angular Service Worker é um utilitário básico de cache para suporte offline simples com um conjunto de recursos limitado. Não aceitaremos novos recursos além de correções de segurança. Para recursos de cache e offline mais avançados, recomendamos explorar as APIs nativas do navegador diretamente.

Service workers aumentam o modelo de implantação web tradicional e capacitam aplicações a entregar uma experiência de usuário com confiabilidade e desempenho no nível de código escrito para rodar em seu sistema operacional e hardware.
Adicionar um service worker a uma aplicação Angular é um dos passos para transformar uma aplicação em uma [Progressive Web App](https://web.dev/progressive-web-apps/) (também conhecida como PWA).

Em sua forma mais simples, um service worker é um script que roda no navegador web e gerencia cache para uma aplicação.

Service workers funcionam como um proxy de rede.
Eles interceptam todas as requisições HTTP de saída feitas pela aplicação e podem escolher como responder a elas.
Por exemplo, eles podem consultar um cache local e entregar uma resposta em cache se uma estiver disponível.
O proxy não está limitado a requisições feitas através de APIs programáticas, como `fetch`; ele também inclui recursos referenciados no HTML e até mesmo a requisição inicial para `index.html`.
O cache baseado em service worker é, portanto, completamente programável e não depende de cabeçalhos de cache especificados pelo servidor.

Ao contrário dos outros scripts que compõem uma aplicação, como o bundle da aplicação Angular, o service worker é preservado depois que o usuário fecha a aba.
Na próxima vez que o navegador carregar a aplicação, o service worker carrega primeiro, e pode interceptar cada requisição de recursos para carregar a aplicação.
Se o service worker for projetado para fazer isso, ele pode _satisfazer completamente o carregamento da aplicação, sem a necessidade da rede_.

Mesmo em uma rede rápida e confiável, atrasos de ida e volta podem introduzir latência significativa ao carregar a aplicação.
Usar um service worker para reduzir a dependência da rede pode melhorar significativamente a experiência do usuário.

## Service workers no Angular

Aplicações Angular, como aplicações de página única, estão em uma posição privilegiada para se beneficiar das vantagens dos service workers. Angular já vem com uma implementação de service worker. Desenvolvedores Angular podem aproveitar este service worker e se beneficiar da maior confiabilidade e desempenho que ele fornece, sem precisar programar contra APIs de baixo nível.

O service worker do Angular foi projetado para otimizar a experiência do usuário final ao usar uma aplicação em uma conexão de rede lenta ou não confiável, ao mesmo tempo minimizando os riscos de servir conteúdo desatualizado.

Para alcançar isso, o Angular service worker segue estas diretrizes:

- Fazer cache de uma aplicação é como instalar uma aplicação nativa.
  A aplicação é armazenada em cache como uma unidade, e todos os arquivos são atualizados juntos.

- Uma aplicação em execução continua a executar com a mesma versão de todos os arquivos.
  Ela não começa repentinamente a receber arquivos em cache de uma versão mais nova, que provavelmente são incompatíveis.

- Quando os usuários atualizam a aplicação, eles veem a versão mais recente totalmente em cache.
  Novas abas carregam o código mais recente em cache.

- Atualizações acontecem em segundo plano, relativamente rápido após as mudanças serem publicadas.
  A versão anterior da aplicação é servida até que uma atualização seja instalada e esteja pronta.

- O service worker conserva largura de banda quando possível.
  Recursos são baixados apenas se foram alterados.

Para suportar estes comportamentos, o Angular service worker carrega um arquivo _manifest_ do servidor.
O arquivo, chamado `ngsw.json` (não deve ser confundido com o [web app manifest](https://developer.mozilla.org/docs/Web/Manifest)), descreve os recursos para fazer cache e inclui hashes do conteúdo de cada arquivo.
Quando uma atualização para a aplicação é implantada, o conteúdo do manifest muda, informando ao service worker que uma nova versão da aplicação deve ser baixada e armazenada em cache.
Este manifest é gerado a partir de um arquivo de configuração gerado pelo CLI chamado `ngsw-config.json`.

Instalar o Angular service worker é tão simples quanto [executar um comando do Angular CLI](ecosystem/service-workers/getting-started#adding-a-service-worker-to-your-project).
Além de registrar o Angular service worker com o navegador, isso também torna alguns serviços disponíveis para injeção que interagem com o service worker e podem ser usados para controlá-lo.
Por exemplo, uma aplicação pode pedir para ser notificada quando uma nova atualização se torna disponível, ou uma aplicação pode pedir ao service worker para verificar o servidor por atualizações disponíveis.

## Antes de começar

Para fazer uso de todos os recursos dos Angular service workers, use as versões mais recentes do Angular e do [Angular CLI](tools/cli).

Para que os service workers sejam registrados, a aplicação deve ser acessada via HTTPS, não HTTP.
Navegadores ignoram service workers em páginas que são servidas através de uma conexão insegura.
A razão é que service workers são bastante poderosos, então cuidado extra é necessário para garantir que o script do service worker não foi adulterado.

Há uma exceção a esta regra: para tornar o desenvolvimento local mais direto, navegadores _não_ requerem uma conexão segura ao acessar uma aplicação em `localhost`.

### Suporte de navegadores

Para se beneficiar do Angular service worker, sua aplicação deve rodar em um navegador web que suporte service workers em geral.
Atualmente, service workers são suportados nas versões mais recentes do Chrome, Firefox, Edge, Safari, Opera, UC Browser (versão Android) e Samsung Internet.
Navegadores como IE e Opera Mini não suportam service workers.

Se o usuário estiver acessando sua aplicação com um navegador que não suporta service workers, o service worker não é registrado e comportamentos relacionados como gerenciamento de cache offline e push notifications não acontecem.
Mais especificamente:

- O navegador não baixa o script do service worker e o arquivo manifest `ngsw.json`
- Tentativas ativas de interagir com o service worker, como chamar `SwUpdate.checkForUpdate()`, retornam promises rejeitadas
- Os eventos observáveis de serviços relacionados, como `SwUpdate.available`, não são acionados

É altamente recomendado que você garanta que sua aplicação funcione mesmo sem suporte ao service worker no navegador.
Embora um navegador sem suporte ignore o cache do service worker, ele ainda reporta erros se a aplicação tentar interagir com o service worker.
Por exemplo, chamar `SwUpdate.checkForUpdate()` retorna promises rejeitadas.
Para evitar tal erro, verifique se o Angular service worker está habilitado usando `SwUpdate.isEnabled`.

Para saber mais sobre outros navegadores que estão prontos para service worker, consulte a página [Can I Use](https://caniuse.com/#feat=serviceworkers) e [documentação MDN](https://developer.mozilla.org/docs/Web/API/Service_Worker_API).

## Recursos relacionados

O restante dos artigos nesta seção abordam especificamente a implementação Angular de service workers.

<docs-pill-row>
  <docs-pill href="ecosystem/service-workers/config" title="Arquivo de configuração"/>
  <docs-pill href="ecosystem/service-workers/communications" title="Comunicando com o Service Worker"/>
  <docs-pill href="ecosystem/service-workers/push-notifications" title="Push notifications"/>
  <docs-pill href="ecosystem/service-workers/devops" title="Service Worker devops"/>
  <docs-pill href="ecosystem/service-workers/app-shell" title="App shell pattern"/>
</docs-pill-row>

Para mais informações sobre service workers em geral, consulte [Service Workers: an Introduction](https://developers.google.com/web/fundamentals/primers/service-workers).

Para mais informações sobre suporte de navegadores, consulte a seção [browser support](https://developers.google.com/web/fundamentals/primers/service-workers/#browser_support) de [Service Workers: an Introduction](https://developers.google.com/web/fundamentals/primers/service-workers), [Is Serviceworker ready?](https://jakearchibald.github.io/isserviceworkerready) de Jake Archibald, e [Can I Use](https://caniuse.com/serviceworkers).

Para recomendações adicionais e exemplos, consulte:

<docs-pill-row>
  <docs-pill href="https://web.dev/precaching-with-the-angular-service-worker" title="Precaching with Angular Service Worker"/>
  <docs-pill href="https://web.dev/creating-pwa-with-angular-cli" title="Creating a PWA with Angular CLI"/>
</docs-pill-row>

## Próximo passo

Para começar a usar Angular service workers, consulte [Começando com service workers](ecosystem/service-workers/getting-started).
