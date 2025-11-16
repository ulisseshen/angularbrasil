<!-- ia-translate: true -->

# Arquivo de configuração do Service Worker

Este tópico descreve as propriedades do arquivo de configuração do service worker.

## Modificando a configuração {#modifying-the-configuration}

O arquivo de configuração JSON `ngsw-config.json` especifica quais arquivos e URLs de dados o Angular service worker deve armazenar em cache e como ele deve atualizar os arquivos e dados em cache.
O [Angular CLI](tools/cli) processa este arquivo de configuração durante `ng build`.

Todos os caminhos de arquivo devem começar com `/`, que corresponde ao diretório de deployment — geralmente `dist/<project-name>` em projetos CLI.

A menos que comentado de outra forma, os padrões usam um formato glob **limitado\*** que internamente será convertido em regex:

| Formatos glob | Detalhes                                                                                                             |
| :------------ | :------------------------------------------------------------------------------------------------------------------- |
| `**`          | Corresponde a 0 ou mais segmentos de caminho                                                                         |
| `*`           | Corresponde a 0 ou mais caracteres excluindo `/`                                                                     |
| `?`           | Corresponde exatamente a um caractere excluindo `/`                                                                  |
| prefixo `!`   | Marca o padrão como sendo negativo, o que significa que apenas arquivos que não correspondem ao padrão são incluídos |

<docs-callout important title="Caracteres especiais precisam ser escapados">
Preste atenção que alguns caracteres com significado especial em uma expressão regular não são escapados e também o padrão não é envolvido em `^`/`$` na conversão interna de glob para regex.

`$` é um caractere especial em regex que corresponde ao final da string e não será automaticamente escapado ao converter o padrão glob para uma expressão regular.

Se você quiser corresponder literalmente ao caractere `$`, você tem que escapá-lo você mesmo (com `\\$`). Por exemplo, o padrão glob `/foo/bar/$value` resulta em uma expressão incompatível, porque é impossível ter uma string que tenha quaisquer caracteres depois que ela terminou.

O padrão não será automaticamente envolvido em `^` e `$` ao convertê-lo para uma expressão regular. Portanto, os padrões corresponderão parcialmente às URLs de requisição.

Se você quiser que seus padrões correspondam ao início e/ou final de URLs, você pode adicionar `^`/`$` você mesmo. Por exemplo, o padrão glob `/foo/bar/*.js` corresponderá a arquivos `.js` e `.json`. Se você quiser corresponder apenas a arquivos `.js`, use `/foo/bar/*.js$`.
</docs-callout>

Exemplos de padrões:

| Padrões      | Detalhes                                |
| :----------- | :-------------------------------------- |
| `/**/*.html` | Especifica todos os arquivos HTML       |
| `/*.html`    | Especifica apenas arquivos HTML na raiz |
| `!/**/*.map` | Exclui todos os sourcemaps              |

## Propriedades de configuração do service worker

As seções a seguir descrevem cada propriedade do arquivo de configuração.

### `appData`

Esta seção permite que você passe quaisquer dados que descrever esta versão específica da aplicação.
O service `SwUpdate` inclui esses dados nas notificações de atualização.
Muitas aplicações usam esta seção para fornecer informações adicionais para a exibição de popups de UI, notificando os usuários da atualização disponível.

### `index`

Especifica o arquivo que serve como página de índice para satisfazer requisições de navegação.
Geralmente é `/index.html`.

### `assetGroups`

_Assets_ são recursos que fazem parte da versão da aplicação que são atualizados junto com a aplicação.
Eles podem incluir recursos carregados da origem da página, bem como recursos de terceiros carregados de CDNs e outras URLs externas.
Como nem todas essas URLs externas podem ser conhecidas em tempo de build, padrões de URL podem ser correspondidos.

ÚTIL: Para que o service worker manipule recursos que são carregados de diferentes origens, certifique-se de que [CORS](https://developer.mozilla.org/docs/Web/HTTP/CORS) esteja configurado corretamente no servidor de cada origem.

Este campo contém um array de grupos de assets, cada um dos quais define um conjunto de recursos de assets e a política pela qual eles são armazenados em cache.

```ts
{
  "assetGroups": [
    {
      …
    },
    {
      …
    }
  ]
}
```

ÚTIL: Quando o ServiceWorker manipula uma requisição, ele verifica os grupos de assets na ordem em que aparecem em `ngsw-config.json`.
O primeiro grupo de assets que corresponde ao recurso solicitado manipula a requisição.

É recomendado que você coloque os grupos de assets mais específicos no topo da lista.
Por exemplo, um grupo de assets que corresponde a `/foo.js` deve aparecer antes de um que corresponde a `*.js`.

Cada grupo de assets especifica tanto um grupo de recursos quanto uma política que os governa.
Esta política determina quando os recursos são buscados e o que acontece quando mudanças são detectadas.

Grupos de assets seguem a interface TypeScript mostrada aqui:

```ts
interface AssetGroup {
  name: string;
  installMode?: 'prefetch' | 'lazy';
  updateMode?: 'prefetch' | 'lazy';
  resources: {
    files?: string[];
    urls?: string[];
  };
  cacheQueryOptions?: {
    ignoreSearch?: boolean;
  };
}
```

Cada `AssetGroup` é definido pelas seguintes propriedades de grupo de assets.

#### `name`

Um `name` é obrigatório.
Ele identifica este grupo específico de assets entre versões da configuração.

#### `installMode`

O `installMode` determina como esses recursos são inicialmente armazenados em cache.
O `installMode` pode ter um de dois valores:

| Valores    | Detalhes                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| :--------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `prefetch` | Instrui o Angular service worker a buscar cada recurso listado enquanto está armazenando em cache a versão atual da aplicação. Isso consome muita banda, mas garante que os recursos estejam disponíveis sempre que forem solicitados, mesmo se o browser estiver offline no momento.                                                                                                                                                                     |
| `lazy`     | Não armazena em cache nenhum dos recursos antecipadamente. Em vez disso, o Angular service worker armazena em cache apenas os recursos para os quais recebe requisições. Este é um modo de cache sob demanda. Recursos que nunca são solicitados não são armazenados em cache. Isso é útil para coisas como imagens em diferentes resoluções, para que o service worker armazene em cache apenas os assets corretos para a tela e orientação específicas. |

Padrão para `prefetch`.

#### `updateMode`

Para recursos já no cache, o `updateMode` determina o comportamento de caching quando uma nova versão da aplicação é descoberta.
Quaisquer recursos no grupo que mudaram desde a versão anterior são atualizados de acordo com `updateMode`.

| Valores    | Detalhes                                                                                                                                                                                                                                                               |
| :--------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `prefetch` | Instrui o service worker a baixar e armazenar em cache os recursos alterados imediatamente.                                                                                                                                                                            |
| `lazy`     | Instrui o service worker a não armazenar em cache esses recursos. Em vez disso, ele os trata como não solicitados e aguarda até que sejam solicitados novamente antes de atualizá-los. Um `updateMode` de `lazy` é válido apenas se o `installMode` também for `lazy`. |

Padrão para o valor ao qual `installMode` está definido.

#### `resources`

Esta seção descreve os recursos a armazenar em cache, divididos nos seguintes grupos:

| Grupos de recursos | Detalhes                                                                                                                                                                                                                                                                                                                                                                                                                            |
| :----------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `files`            | Lista padrões que correspondem a arquivos no diretório de distribuição. Estes podem ser arquivos únicos ou padrões semelhantes a glob que correspondem a vários arquivos.                                                                                                                                                                                                                                                           |
| `urls`             | Inclui URLs e padrões de URL que são correspondidos em tempo de execução. Esses recursos não são buscados diretamente e não têm hashes de conteúdo, mas são armazenados em cache de acordo com seus cabeçalhos HTTP. Isso é mais útil para CDNs como o serviço Google Fonts. <br /> _(Padrões glob negativos não são suportados e `?` será correspondido literalmente; ou seja, não corresponderá a nenhum caractere além de `?`.)_ |

#### `cacheQueryOptions`

Essas opções são usadas para modificar o comportamento de correspondência de requisições.
Elas são passadas para a função `Cache#match` do browser.
Veja [MDN](https://developer.mozilla.org/docs/Web/API/Cache/match) para detalhes.
Atualmente, apenas as seguintes opções são suportadas:

| Opções         | Detalhes                                          |
| :------------- | :------------------------------------------------ |
| `ignoreSearch` | Ignorar parâmetros de query. Padrão para `false`. |

### `dataGroups`

Ao contrário de recursos de assets, requisições de dados não têm versão junto com a aplicação.
Eles são armazenados em cache de acordo com políticas configuradas manualmente que são mais úteis para situações como requisições de API e outras dependências de dados.

Este campo contém um array de grupos de dados, cada um dos quais define um conjunto de recursos de dados e a política pela qual eles são armazenados em cache.

```json
{
  "dataGroups": [
    {
      …
    },
    {
      …
    }
  ]
}
```

ÚTIL: Quando o ServiceWorker manipula uma requisição, ele verifica os grupos de dados na ordem em que aparecem em `ngsw-config.json`.
O primeiro grupo de dados que corresponde ao recurso solicitado manipula a requisição.

É recomendado que você coloque os grupos de dados mais específicos no topo da lista.
Por exemplo, um grupo de dados que corresponde a `/api/foo.json` deve aparecer antes de um que corresponde a `/api/*.json`.

Grupos de dados seguem esta interface TypeScript:

```ts
export interface DataGroup {
  name: string;
  urls: string[];
  version?: number;
  cacheConfig: {
    maxSize: number;
    maxAge: string;
    timeout?: string;
    refreshAhead?: string;
    strategy?: 'freshness' | 'performance';
  };
  cacheQueryOptions?: {
    ignoreSearch?: boolean;
  };
}
```

Cada `DataGroup` é definido pelas seguintes propriedades de grupo de dados.

#### `name`

Semelhante a `assetGroups`, cada grupo de dados tem um `name` que o identifica exclusivamente.

#### `urls`

Uma lista de padrões de URL.
URLs que correspondem a esses padrões são armazenadas em cache de acordo com a política deste grupo de dados.
Apenas requisições não-mutantes (GET e HEAD) são armazenadas em cache.

- Padrões glob negativos não são suportados
- `?` é correspondido literalmente; ou seja, corresponde _apenas_ ao caractere `?`

#### `version`

Ocasionalmente as APIs mudam formatos de uma maneira que não é retrocompatível.
Uma nova versão da aplicação pode não ser compatível com o formato de API antigo e, portanto, pode não ser compatível com recursos em cache existentes dessa API.

`version` fornece um mecanismo para indicar que os recursos sendo armazenados em cache foram atualizados de maneira incompatível com versões anteriores, e que as entradas de cache antigas — aquelas de versões anteriores — devem ser descartadas.

`version` é um campo inteiro e o padrão é `1`.

#### `cacheConfig`

As seguintes propriedades definem a política pela qual requisições correspondentes são armazenadas em cache.

##### `maxSize`

O número máximo de entradas, ou respostas, no cache.

CRÍTICO: Caches sem limites podem crescer de maneiras ilimitadas e eventualmente exceder quotas de armazenamento, resultando em remoção.

##### `maxAge`

O parâmetro `maxAge` indica quanto tempo as respostas têm permissão para permanecer no cache antes de serem consideradas inválidas e removidas. `maxAge` é uma string de duração, usando os seguintes sufixos de unidade:

| Sufixos | Detalhes      |
| :------ | :------------ |
| `d`     | Dias          |
| `h`     | Horas         |
| `m`     | Minutos       |
| `s`     | Segundos      |
| `u`     | Milissegundos |

Por exemplo, a string `3d12h` armazena em cache o conteúdo por até três dias e meio.

##### `timeout`

Esta string de duração especifica o timeout de rede.
O timeout de rede é quanto tempo o Angular service worker aguarda a rede responder antes de usar uma resposta em cache, se configurado para fazê-lo.
`timeout` é uma string de duração, usando os seguintes sufixos de unidade:

| Sufixos | Detalhes      |
| :------ | :------------ |
| `d`     | Dias          |
| `h`     | Horas         |
| `m`     | Minutos       |
| `s`     | Segundos      |
| `u`     | Milissegundos |

Por exemplo, a string `5s30u` se traduz em cinco segundos e 30 milissegundos de timeout de rede.

##### `refreshAhead`

Esta string de duração especifica o tempo antes da expiração de um recurso em cache quando o Angular service worker deve tentar proativamente atualizar o recurso da rede.
A duração `refreshAhead` é uma configuração opcional que determina quanto tempo antes da expiração de uma resposta em cache o service worker deve iniciar uma requisição para atualizar o recurso da rede.

| Sufixos | Detalhes      |
| :------ | :------------ |
| `d`     | Dias          |
| `h`     | Horas         |
| `m`     | Minutos       |
| `s`     | Segundos      |
| `u`     | Milissegundos |

Por exemplo, a string `1h30m` se traduz em uma hora e 30 minutos antes do tempo de expiração.

##### `strategy`

O Angular service worker pode usar uma de duas estratégias de cache para recursos de dados.

| Estratégias de cache | Detalhes                                                                                                                                                                                                                                                                                                                                                    |
| :------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `performance`        | O padrão, otimiza para respostas o mais rápido possível. Se um recurso existe no cache, a versão em cache é usada, e nenhuma requisição de rede é feita. Isso permite alguma desatualização, dependendo do `maxAge`, em troca de melhor performance. Isso é adequado para recursos que não mudam com frequência; por exemplo, imagens de avatar de usuário. |
| `freshness`          | Otimiza para atualização dos dados, preferencialmente buscando dados solicitados da rede. Apenas se a rede atingir o timeout, de acordo com `timeout`, a requisição recorre ao cache. Isso é útil para recursos que mudam com frequência; por exemplo, saldos de contas.                                                                                    |

ÚTIL: Você também pode emular uma terceira estratégia, [staleWhileRevalidate](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#stale-while-revalidate), que retorna dados em cache se estiverem disponíveis, mas também busca dados atualizados da rede em segundo plano para a próxima vez.
Para usar esta estratégia, defina `strategy` como `freshness` e `timeout` como `0u` em `cacheConfig`.

Isso essencialmente faz o seguinte:

1. Tenta buscar da rede primeiro.
2. Se a requisição de rede não for concluída imediatamente, ou seja, após um timeout de 0&nbsp;ms, ignora a idade do cache e recorre ao valor em cache.
3. Quando a requisição de rede for concluída, atualiza o cache para requisições futuras.
4. Se o recurso não existir no cache, aguarda a requisição de rede de qualquer forma.

##### `cacheOpaqueResponses`

Se o Angular service worker deve armazenar em cache respostas opacas ou não.

Se não especificado, o valor padrão depende da estratégia configurada do grupo de dados:

| Estratégias                           | Detalhes                                                                                                                                                                                                                                                                                                                                    |
| :------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Grupos com a estratégia `freshness`   | O valor padrão é `true` e o service worker armazena em cache respostas opacas. Esses grupos solicitarão os dados toda vez e apenas recorrerão à resposta em cache quando offline ou em uma rede lenta. Portanto, não importa se o service worker armazenar em cache uma resposta de erro.                                                   |
| Grupos com a estratégia `performance` | O valor padrão é `false` e o service worker não armazena em cache respostas opacas. Esses grupos continuariam a retornar uma resposta em cache até `maxAge` expirar, mesmo se o erro fosse devido a um problema temporário de rede ou servidor. Portanto, seria problemático para o service worker armazenar em cache uma resposta de erro. |

<docs-callout title="Comentário sobre respostas opacas">

Caso você não esteja familiarizado, uma [resposta opaca](https://fetch.spec.whatwg.org#concept-filtered-response-opaque) é um tipo especial de resposta retornada ao solicitar um recurso que está em uma origem diferente que não retorna cabeçalhos CORS.
Uma das características de uma resposta opaca é que o service worker não tem permissão para ler seu status, o que significa que não pode verificar se a requisição foi bem-sucedida ou não.
Veja [Introdução a `fetch()`](https://developers.google.com/web/updates/2015/03/introduction-to-fetch#response_types) para mais detalhes.

Se você não conseguir implementar CORS — por exemplo, se você não controla a origem — prefira usar a estratégia `freshness` para recursos que resultam em respostas opacas.

</docs-callout>

#### `cacheQueryOptions`

Veja [assetGroups](#assetgroups) para detalhes.

### `navigationUrls`

Esta seção opcional permite que você especifique uma lista personalizada de URLs que serão redirecionadas para o arquivo de índice.

#### Manipulando requisições de navegação

O ServiceWorker redireciona requisições de navegação que não correspondem a nenhum grupo `asset` ou `data` para o [arquivo de índice](#index) especificado.
Uma requisição é considerada uma requisição de navegação se:

- Seu [method](https://developer.mozilla.org/docs/Web/API/Request/method) é `GET`
- Seu [mode](https://developer.mozilla.org/docs/Web/API/Request/mode) é `navigation`
- Ela aceita uma resposta `text/html` conforme determinado pelo valor do cabeçalho `Accept`
- Sua URL corresponde aos seguintes critérios:
  - A URL não deve conter uma extensão de arquivo (ou seja, um `.`) no último segmento de caminho
  - A URL não deve conter `__`

ÚTIL: Para configurar se requisições de navegação são enviadas para a rede ou não, veja as seções [navigationRequestStrategy](#navigationrequeststrategy) e [applicationMaxAge](#applicationmaxage).

#### Correspondendo URLs de requisição de navegação

Embora esses critérios padrão sejam adequados na maioria dos casos, às vezes é desejável configurar regras diferentes.
Por exemplo, você pode querer ignorar rotas específicas, como aquelas que não fazem parte da aplicação Angular, e passá-las para o servidor.

Este campo contém um array de URLs e padrões de URL [semelhantes a glob](#modifying-the-configuration) que são correspondidos em tempo de execução.
Ele pode conter tanto padrões negativos (ou seja, padrões começando com `!`) quanto padrões e URLs não-negativos.

Apenas requisições cujas URLs correspondem a _qualquer_ uma das URLs/padrões não-negativos e _nenhum_ dos negativos são consideradas requisições de navegação.
A query da URL é ignorada ao fazer a correspondência.

Se o campo for omitido, ele assume o seguinte padrão:

<docs-code language="typescript">

[
'/**', // Inclui todas as URLs.
'!/**/*.*', // Exclui URLs para arquivos (contendo uma extensão de arquivo no último segmento).
'!/**/*__*', // Exclui URLs contendo `__` no último segmento.
'!/**/*__*/**', // Exclui URLs contendo `__` em qualquer outro segmento.
]

</docs-code>

### `navigationRequestStrategy`

Esta propriedade opcional permite que você configure como o service worker manipula requisições de navegação:

<docs-code language="json">

{
"navigationRequestStrategy": "freshness"
}

</docs-code>

| Valores possíveis | Detalhes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| :---------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `'performance'`   | A configuração padrão. Serve o [arquivo de índice](#index) especificado, que normalmente está em cache.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `'freshness'`     | Passa as requisições para a rede e recorre ao comportamento `performance` quando offline. Este valor é útil quando o servidor redireciona as requisições de navegação para outro lugar usando um código de status de redirecionamento HTTP `3xx`. Razões para usar este valor incluem: <ul> <li> Redirecionar para um site de autenticação quando a autenticação não é manipulada pela aplicação </li> <li> Redirecionar URLs específicas para evitar quebrar links/favoritos existentes após um redesign do site </li> <li> Redirecionar para um site diferente, como uma página de status do servidor, enquanto uma página está temporariamente fora do ar </li> </ul> |

IMPORTANTE: A estratégia `freshness` geralmente resulta em mais requisições enviadas ao servidor, o que pode aumentar a latência de resposta. É recomendado que você use a estratégia de performance padrão sempre que possível.

### `applicationMaxAge`

Esta propriedade opcional permite que você configure quanto tempo o service worker armazenará em cache quaisquer requisições. Dentro do `maxAge`, os arquivos serão servidos do cache. Além disso, todas as requisições serão servidas apenas da rede, incluindo requisições de assets e dados.
