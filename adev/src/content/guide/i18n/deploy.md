<!-- ia-translate: true -->
# Fazer deploy de múltiplos locales {#deploy-multiple-locales}

Se `myapp` é o diretório que contém os arquivos distribuíveis do seu projeto, normalmente você disponibiliza versões diferentes para locales diferentes, em diretórios de locale.
Por exemplo, a versão em francês fica no diretório `myapp/fr` e a versão em espanhol fica no diretório `myapp/es`.

A tag HTML `base` com o atributo `href` especifica o URI base, ou URL, para links relativos.
Se você definir a opção `"localize"` no arquivo de configuração de build do workspace [`angular.json`][GuideWorkspaceConfig] como `true` ou como um array de IDs de locale, o CLI ajusta o `href` base para cada versão da aplicação.
Para ajustar o `href` base de cada versão da aplicação, o CLI usa o `"subPath"` configurado como segmento de URL para o locale.
Se você não definir o `"subPath"`, o valor padrão será o ID do locale.
Especifique o `"subPath"` de cada locale no seu arquivo de configuração de build do workspace [`angular.json`][GuideWorkspaceConfig].
O exemplo a seguir mostra o `"subPath"` definido como uma string vazia.

<docs-code header="angular.json" path="adev/src/content/examples/i18n/angular.json" region="i18n-subPath"/>

## Configurar um servidor {#configure-a-server}

O deploy típico de múltiplos idiomas serve cada idioma a partir de um subdiretório diferente.
Os usuários são redirecionados para o idioma preferido definido no navegador, usando o header HTTP `Accept-Language`.
Se o usuário não tiver definido um idioma preferido, ou se o idioma preferido não estiver disponível, o servidor volta para o idioma padrão.
Para mudar o idioma, você altera sua localização atual para outro subdiretório.
A mudança de subdiretório normalmente acontece por meio de um menu implementado na aplicação.

Para mais informações sobre como fazer deploy de aplicações em um servidor remoto, veja [Deployment][GuideDeployment].

IMPORTANT: Se você estiver usando [Server rendering](guide/ssr) com `outputMode` definido como `server`, o Angular trata automaticamente o redirecionamento de forma dinâmica, com base no header HTTP `Accept-Language`. Isso simplifica o deploy, eliminando a necessidade de ajustes manuais no servidor ou na configuração.

### Exemplo Nginx {#nginx-example}

O exemplo a seguir mostra uma configuração Nginx.

<docs-code path="adev/src/content/examples/i18n/doc-files/nginx.conf" language="nginx"/>

### Exemplo Apache {#apache-example}

O exemplo a seguir mostra uma configuração Apache.

<docs-code path="adev/src/content/examples/i18n/doc-files/apache2.conf" language="apache"/>

## Pré-renderização {#prerendering}

Se você definir `outputMode` como `static`, o CLI pré-renderiza, para cada locale, no momento do build, as rotas que as rotas do seu servidor configuram com `RenderMode.Prerender`, e não gera nenhum servidor.
Para mais informações, veja [Gerar uma aplicação totalmente estática](guide/ssr#generate-a-fully-static-application).
Como nenhum servidor escolhe o idioma, a configuração de hospedagem é responsável pelos redirecionamentos e pelas páginas de não encontrado.

### Layout de saída {#output-layout}

O CLI grava cada locale em seu próprio diretório dentro de `browser/`.
Cada diretório contém o HTML pré-renderizado, os bundles e uma cópia dos arquivos de `public/` para aquele locale.
O atributo `lang` e o `<base href>` das páginas pré-renderizadas correspondem ao locale.

O layout a seguir considera que o locale de origem é servido a partir da raiz, conforme descrito na próxima seção.

```text
browser/
├── index.html
├── about/index.html
├── tr/
│   ├── index.html
│   └── about/index.html
└── es/
    ├── index.html
    └── about/index.html
```

As páginas da raiz usam `lang="en"` e `<base href="/">`. As páginas de `tr/` usam `lang="tr"` e `<base href="/tr/">`, e as páginas de `es/` usam `lang="es"` e `<base href="/es/">`.

### Servir o locale de origem a partir da raiz {#serve-the-source-locale-from-the-root}

Para servir o locale de origem a partir de `/` e aninhar os demais locales abaixo dele, use a forma de objeto de `sourceLocale` e defina `"subPath"` como uma string vazia.

```json
{
  "i18n": {
    "sourceLocale": {
      "code": "en",
      "subPath": ""
    },
    "locales": {
      "tr": "src/locale/messages.tr.xlf",
      "es": "src/locale/messages.es.xlf"
    }
  }
}
```

Sem o `"subPath"` vazio, o CLI coloca o locale de origem em seu próprio diretório, nomeado com o código do locale, como `/en/`.

### Redirecionar os usuários para o idioma deles {#redirect-users-to-their-language}

A saída estática não redireciona com base no header HTTP `Accept-Language`.
Configure sua hospedagem para redirecionar com base nesse header.
Os exemplos de [Nginx](#nginx-example) e [Apache](#apache-example) assumem que cada locale, incluindo o padrão, fica em seu próprio subdiretório.
Se você servir o locale de origem a partir da raiz, adapte-os para redirecionar `/` somente para os outros locales.

### Páginas de não encontrado {#not-found-pages}

O CLI não pré-renderiza uma página para a rota curinga `**`.
Para ter uma página de não encontrado, declare uma rota concreta, como `404`, e garanta que as rotas do seu servidor pré-renderizem essa página.
Cada locale então terá a própria página, por exemplo `/404/index.html` e `/tr/404/index.html`.
Configure sua hospedagem para servir a página que corresponde ao caminho do locale da URL ausente, por exemplo com `error_page` no Nginx ou `ErrorDocument` no Apache.

[CliBuild]: cli/build 'ng build | CLI | Angular'
[GuideDeployment]: tools/cli/deployment 'Deployment | Angular'
[GuideWorkspaceConfig]: reference/configs/workspace-config 'Angular workspace configuration | Angular'
