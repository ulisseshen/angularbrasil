<!-- ia-translate: true -->
# Service worker devops

Esta página é uma referência para implantar e dar suporte a aplicações em produção que usam o Angular service worker.
Ela explica como o Angular service worker se encaixa no ambiente de produção mais amplo, o comportamento do service worker sob várias condições e recursos e mecanismos de segurança disponíveis.

## Service worker e cache de recursos da aplicação

Imagine o Angular service worker como um cache forward ou uma borda de Content Delivery Network (CDN) instalada no navegador do usuário final.
O service worker responde a requisições feitas pela aplicação Angular para recursos ou dados de um cache local, sem precisar esperar pela rede.
Como qualquer cache, ele tem regras para como o conteúdo expira e é atualizado.

### Versões da aplicação

No contexto de um Angular service worker, uma "versão" é uma coleção de recursos que representam um build específico da aplicação Angular.
Sempre que um novo build da aplicação é implantado, o service worker trata esse build como uma nova versão da aplicação.
Isso é verdadeiro mesmo se apenas um único arquivo for atualizado.
A qualquer momento, o service worker pode ter múltiplas versões da aplicação em seu cache e pode estar servindo-as simultaneamente.
Para mais informações, consulte a seção [Abas da aplicação](#application-tabs).

Para preservar a integridade da aplicação, o Angular service worker agrupa todos os arquivos em uma versão juntos.
Os arquivos agrupados em uma versão geralmente incluem arquivos HTML, JS e CSS.
O agrupamento desses arquivos é essencial para a integridade porque arquivos HTML, JS e CSS frequentemente fazem referência uns aos outros e dependem de conteúdo específico.
Por exemplo, um arquivo `index.html` pode ter uma tag `<script>` que referencia `bundle.js` e pode tentar chamar uma função `startApp()` de dentro desse script.
Sempre que esta versão de `index.html` for servida, o `bundle.js` correspondente deve ser servido com ela.
Por exemplo, suponha que a função `startApp()` seja renomeada para `runApp()` em ambos os arquivos.
Neste cenário, não é válido servir o antigo `index.html`, que chama `startApp()`, junto com o novo bundle, que define `runApp()`.

Esta integridade de arquivo é especialmente importante ao fazer lazy loading.
Um bundle JS pode referenciar muitos lazy chunks, e os nomes de arquivo dos lazy chunks são únicos para o build específico da aplicação.
Se uma aplicação em execução na versão `X` tentar carregar um lazy chunk, mas o servidor já atualizou para a versão `X + 1`, a operação de lazy loading falhará.

O identificador de versão da aplicação é determinado pelo conteúdo de todos os recursos, e muda se qualquer um deles mudar.
Na prática, a versão é determinada pelo conteúdo do arquivo `ngsw.json`, que inclui hashes para todo o conteúdo conhecido.
Se qualquer um dos arquivos em cache mudar, o hash do arquivo muda em `ngsw.json`. Esta mudança faz com que o Angular service worker trate o conjunto ativo de arquivos como uma nova versão.

HELPFUL: O processo de build cria o arquivo manifest, `ngsw.json`, usando informações de `ngsw-config.json`.

Com o comportamento de versionamento do Angular service worker, um servidor de aplicação pode garantir que a aplicação Angular sempre tenha um conjunto consistente de arquivos.

#### Verificações de atualização

Toda vez que o usuário abre ou atualiza a aplicação, o Angular service worker verifica se há atualizações para a aplicação procurando por atualizações no manifest `ngsw.json`.
Se uma atualização for encontrada, ela é baixada e armazenada em cache automaticamente, e é servida na próxima vez que a aplicação for carregada.

### Integridade de recursos

Um dos potenciais efeitos colaterais do cache longo é inadvertidamente armazenar em cache um recurso que não é válido.
Em um cache HTTP normal, uma atualização forçada ou a expiração do cache limita os efeitos negativos de armazenar em cache um arquivo que não é válido.
Um service worker ignora tais restrições e efetivamente faz cache longo da aplicação inteira.
É importante que o service worker obtenha o conteúdo correto, então ele mantém hashes dos recursos para manter sua integridade.

#### Conteúdo com hash

Para garantir a integridade dos recursos, o Angular service worker valida os hashes de todos os recursos para os quais tem um hash.
Para uma aplicação criada com o [Angular CLI](tools/cli), isso é tudo no diretório `dist` coberto pela configuração `src/ngsw-config.json` do usuário.

Se um arquivo específico falhar na validação, o Angular service worker tenta buscar novamente o conteúdo usando um parâmetro de URL "cache-busting" para evitar cache do navegador ou intermediário.
Se esse conteúdo também falhar na validação, o service worker considera que a versão inteira da aplicação não é válida e para de servir a aplicação.
Se necessário, o service worker entra em um modo seguro onde as requisições voltam para a rede. O service worker não usa seu cache se houver um alto risco de servir conteúdo que está quebrado, desatualizado ou não é válido.

Incompatibilidades de hash podem ocorrer por uma variedade de razões:

- Camadas de cache entre o servidor de origem e o usuário final podem servir conteúdo obsoleto
- Uma implantação não atômica pode resultar no Angular service worker tendo visibilidade de conteúdo parcialmente atualizado
- Erros durante o processo de build podem resultar em recursos atualizados sem que `ngsw.json` seja atualizado.
  O reverso também pode acontecer resultando em um `ngsw.json` atualizado sem recursos atualizados.

#### Conteúdo sem hash

Os únicos recursos que têm hashes no manifest `ngsw.json` são recursos que estavam presentes no diretório `dist` no momento em que o manifest foi construído.
Outros recursos, especialmente aqueles carregados de CDNs, têm conteúdo desconhecido no momento do build ou são atualizados com mais frequência do que a aplicação é implantada.

Se o Angular service worker não tiver um hash para verificar se um recurso é válido, ele ainda armazena seu conteúdo em cache. Ao mesmo tempo, ele respeita os cabeçalhos de cache HTTP usando uma política de _stale while revalidate_.
O Angular service worker continua a servir um recurso mesmo depois que seus cabeçalhos de cache HTTP indicam
que ele não é mais válido. Ao mesmo tempo, ele tenta atualizar o recurso expirado em segundo plano.
Desta forma, recursos sem hash quebrados não permanecem no cache além de suas vidas úteis configuradas.

### Abas da aplicação

Pode ser problemático para uma aplicação se a versão dos recursos que ela está recebendo mudar repentinamente ou sem aviso.
Consulte a seção [Versões da aplicação](#application-versions) para uma descrição de tais problemas.

O Angular service worker fornece uma garantia: uma aplicação em execução continua executando a mesma versão da aplicação.
Se outra instância da aplicação for aberta em uma nova aba do navegador, então a versão mais atual da aplicação é servida.
Como resultado, essa nova aba pode estar executando uma versão diferente da aplicação do que a aba original.

IMPORTANT: Esta garantia é **mais forte** do que aquela fornecida pelo modelo de implantação web normal. Sem um service worker, não há garantia de que o código carregado de forma lazy seja da mesma versão que o código inicial da aplicação.

O Angular service worker pode mudar a versão de uma aplicação em execução sob condições de erro, tais como:

- A versão atual torna-se não válida devido a um hash que falhou.
- Um erro não relacionado causa o service worker entrar em modo seguro e desativá-lo temporariamente.

O Angular service worker limpa versões da aplicação quando nenhuma aba está usando-as.

Outras razões pelas quais o Angular service worker pode mudar a versão de uma aplicação em execução são eventos normais:

- A página é recarregada/atualizada.
- A página solicita que uma atualização seja imediatamente ativada usando o serviço `SwUpdate`.

### Atualizações do service worker

O Angular service worker é um pequeno script que é executado nos navegadores web.
De tempos em tempos, o service worker é atualizado com correções de bugs e melhorias de recursos.

O Angular service worker é baixado quando a aplicação é aberta pela primeira vez e quando a aplicação é acessada após um período de inatividade.
Se o service worker mudar, ele é atualizado em segundo plano.

A maioria das atualizações do Angular service worker são transparentes para a aplicação. Os caches antigos ainda são válidos e o conteúdo ainda é servido normalmente.
Ocasionalmente, uma correção de bug ou recurso no Angular service worker pode exigir a invalidação de caches antigos.
Neste caso, o service worker atualiza a aplicação a partir da rede de forma transparente.

### Ignorando o service worker

Em alguns casos, você pode querer ignorar o service worker completamente e deixar o navegador lidar com a requisição.
Um exemplo é quando você depende de um recurso que atualmente não é suportado em service workers, como [reportar progresso em arquivos enviados](https://github.com/w3c/ServiceWorker/issues/1141).

Para ignorar o service worker, defina `ngsw-bypass` como um cabeçalho de requisição, ou como um parâmetro de query.
O valor do cabeçalho ou parâmetro de query é ignorado e pode estar vazio ou omitido.

### Requisições do service worker quando o servidor não pode ser alcançado

O service worker processa todas as requisições a menos que o [service worker seja explicitamente ignorado](#bypassing-the-service-worker).
O service worker retorna uma resposta em cache ou envia a requisição ao servidor, dependendo do estado e configuração do cache.
O service worker apenas armazena em cache respostas a requisições que não fazem mutação, como `GET` e `HEAD`.

Se o service worker receber um erro do servidor ou não receber uma resposta, ele retorna um status de erro que indica o resultado da chamada.
Por exemplo, se o service worker não receber uma resposta, ele cria um status [504 Gateway Timeout](https://developer.mozilla.org/docs/Web/HTTP/Status/504) para retornar. O status `504` neste exemplo pode ser retornado porque o servidor está offline ou o cliente está desconectado.

## Fazendo debug do Angular service worker

Ocasionalmente, pode ser necessário examinar o Angular service worker em estado de execução para investigar problemas ou se ele está operando como projetado.
Navegadores fornecem ferramentas integradas para debug de service workers e o próprio Angular service worker inclui recursos úteis de debug.

### Localizando e analisando informações de debug

O Angular service worker expõe informações de debug sob o diretório virtual `ngsw/`.
Atualmente, a única URL exposta é `ngsw/state`.
Aqui está um exemplo do conteúdo desta página de debug:

<docs-code hideCopy language="shell">

NGSW Debug Info:

Driver version: 13.3.7
Driver state: NORMAL ((nominal))
Latest manifest hash: eea7f5f464f90789b621170af5a569d6be077e5c
Last update check: never

=== Version eea7f5f464f90789b621170af5a569d6be077e5c ===

Clients: 7b79a015-69af-4d3d-9ae6-95ba90c79486, 5bc08295-aaf2-42f3-a4cc-9e4ef9100f65

=== Idle Task Queue ===
Last update tick: 1s496u
Last update run: never
Task queue:

- init post-load (update, cleanup)

Debug log:

</docs-code>

#### Driver state

A primeira linha indica o estado do driver:

<docs-code hideCopy language="shell">

Driver state: NORMAL ((nominal))

</docs-code>

`NORMAL` indica que o service worker está operando normalmente e não está em um estado degradado.

Há dois possíveis estados degradados:

| Estados degradados      | Detalhes                                                                                                                                                                                                                                                                                                                                                                                                                             |
| :---------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `EXISTING_CLIENTS_ONLY` | O service worker não tem uma cópia limpa da versão mais recente conhecida da aplicação. Versões em cache mais antigas são seguras para usar, então abas existentes continuam a executar a partir do cache, mas novos carregamentos da aplicação serão servidos a partir da rede. O service worker tentará se recuperar deste estado quando uma nova versão da aplicação for detectada e instalada. Isso acontece quando um novo `ngsw.json` está disponível. |
| `SAFE_MODE`             | O service worker não pode garantir a segurança de usar dados em cache. Ou um erro inesperado ocorreu ou todas as versões em cache são inválidas. Todo o tráfego será servido a partir da rede, executando o mínimo possível de código do service worker.                                                                                                                                                                              |

Em ambos os casos, a anotação entre parênteses fornece o
erro que causou o service worker a entrar no estado degradado.

Ambos os estados são temporários; eles são salvos apenas durante o tempo de vida da [instância do ServiceWorker](https://developer.mozilla.org/docs/Web/API/ServiceWorkerGlobalScope).
O navegador às vezes termina um service worker ocioso para conservar memória e poder de processamento, e cria uma nova instância do service worker em resposta a eventos de rede.
A nova instância inicia no modo `NORMAL`, independentemente do estado da instância anterior.

#### Latest manifest hash

<docs-code hideCopy language="shell">

Latest manifest hash: eea7f5f464f90789b621170af5a569d6be077e5c

</docs-code>

Este é o hash SHA1 da versão mais atualizada da aplicação que o service worker conhece.

#### Last update check

<docs-code hideCopy language="shell">

Last update check: never

</docs-code>

Isso indica a última vez que o service worker verificou por uma nova versão, ou atualização, da aplicação.
`never` indica que o service worker nunca verificou por uma atualização.

Neste exemplo de arquivo de debug, a verificação de atualização está atualmente agendada, conforme explicado na próxima seção.

#### Version

<docs-code hideCopy language="shell">

=== Version eea7f5f464f90789b621170af5a569d6be077e5c ===

Clients: 7b79a015-69af-4d3d-9ae6-95ba90c79486, 5bc08295-aaf2-42f3-a4cc-9e4ef9100f65

</docs-code>

Neste exemplo, o service worker tem uma versão da aplicação em cache e está sendo usado para servir duas abas diferentes.

HELPFUL: Este hash de versão é o "latest manifest hash" listado acima. Ambos os clientes estão na versão mais recente. Cada cliente é listado por seu ID da API `Clients` no navegador.

#### Idle task queue

<docs-code hideCopy language="shell">

=== Idle Task Queue ===
Last update tick: 1s496u
Last update run: never
Task queue:

- init post-load (update, cleanup)

</docs-code>

A Idle Task Queue é a fila de todas as tarefas pendentes que acontecem em segundo plano no service worker.
Se houver alguma tarefa na fila, elas são listadas com uma descrição.
Neste exemplo, o service worker tem uma tarefa agendada, uma operação pós-inicialização envolvendo uma verificação de atualização e limpeza de caches obsoletos.

Os contadores de último tick/run de atualização dão o tempo desde que eventos específicos aconteceram relacionados à fila ociosa.
O contador "Last update run" mostra a última vez que as tarefas ociosas foram realmente executadas.
"Last update tick" mostra o tempo desde o último evento após o qual a fila pode ser processada.

#### Debug log

<docs-code hideCopy language="shell">

Debug log:

</docs-code>

Erros que ocorrem dentro do service worker são registrados aqui.

### Developer tools

Navegadores como Chrome fornecem ferramentas de desenvolvedor para interagir com service workers.
Tais ferramentas podem ser poderosas quando usadas adequadamente, mas há algumas coisas a ter em mente.

- Quando estiver usando as ferramentas de desenvolvedor, o service worker é mantido em execução em segundo plano e nunca reinicia.
  Isso pode causar comportamento com Dev Tools aberto que difere do comportamento que um usuário pode experimentar.

- Se você olhar no visualizador Cache Storage, o cache frequentemente está desatualizado.
  Clique com o botão direito no título Cache Storage e atualize os caches.

- Parar e iniciar o service worker no painel Service Worker verifica por atualizações

## Segurança do service worker

Bugs ou configurações quebradas podem fazer com que o Angular service worker aja de maneiras inesperadas.
Se isso acontecer, o Angular service worker contém vários mecanismos de segurança caso um administrador precise desativar o service worker rapidamente.

### Fail-safe

Para desativar o service worker, renomeie o arquivo `ngsw.json` ou exclua-o.
Quando a requisição do service worker por `ngsw.json` retorna um `404`, então o service worker remove todos os seus caches e cancela seu registro, essencialmente se autodestruindo.

### Safety worker

<!-- vale Angular.Google_Acronyms = NO -->

Um pequeno script, `safety-worker.js`, também está incluído no pacote NPM `@angular/service-worker`.
Quando carregado, ele cancela seu próprio registro do navegador e remove os caches do service worker.
Este script pode ser usado como último recurso para se livrar de service workers indesejados já instalados em páginas de clientes.

<!-- vale Angular.Google_Acronyms = YES -->

CRITICAL: Você não pode registrar este worker diretamente, pois clientes antigos com estado em cache podem não ver um novo `index.html` que instala o script de worker diferente.

Em vez disso, você deve servir o conteúdo de `safety-worker.js` na URL do script do Service Worker que você está tentando cancelar o registro. Você deve continuar a fazer isso até ter certeza de que todos os usuários cancelaram o registro com sucesso do worker antigo.
Para a maioria dos sites, isso significa que você deve servir o safety worker na URL antiga do Service Worker para sempre.
Este script pode ser usado para desativar `@angular/service-worker` e remover os caches correspondentes. Ele também remove quaisquer outros Service Workers que possam ter sido servidos no passado em seu site.

### Mudando a localização da sua aplicação

IMPORTANT: Service workers não funcionam atrás de redirect.
Você pode já ter encontrado o erro `The script resource is behind a redirect, which is disallowed`.

Isso pode ser um problema se você tiver que mudar a localização da sua aplicação.
Se você configurar um redirect da localização antiga, como `example.com`, para a nova localização, `www.example.com` neste exemplo, o worker para de funcionar.
Além disso, o redirect nem sequer será acionado para usuários que estão carregando o site inteiramente a partir do Service Worker.
O worker antigo, que foi registrado em `example.com`, tenta atualizar e envia uma requisição para a localização antiga `example.com`. Esta requisição é redirecionada para a nova localização `www.example.com` e cria o erro: `The script resource is behind a redirect, which is disallowed`.

Para remediar isso, você pode precisar desativar o worker antigo usando uma das técnicas anteriores: [Fail-safe](#fail-safe) ou [Safety Worker](#safety-worker).

## Mais sobre Angular service workers

Você também pode estar interessado no seguinte:

<docs-pill-row>
  <docs-pill href="ecosystem/service-workers/config" title="Arquivo de configuração"/>
  <docs-pill href="ecosystem/service-workers/communications" title="Comunicando com o Service Worker"/>
</docs-pill-row>
