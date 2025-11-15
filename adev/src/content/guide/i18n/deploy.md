<!-- ia-translate: true -->
# Deploy de múltiplos locales

Se `myapp` é o diretório que contém os arquivos distribuíveis do seu projeto, você normalmente disponibiliza diferentes versões para diferentes locales em diretórios de locale.
Por exemplo, sua versão em francês está localizada no diretório `myapp/fr` e a versão em espanhol está localizada no diretório `myapp/es`.

A tag HTML `base` com o atributo `href` especifica o URI base, ou URL, para links relativos.
Se você definir a opção `"localize"` no arquivo de configuração de build do workspace [`angular.json`][GuideWorkspaceConfig] como `true` ou como um array de IDs de locale, o CLI ajusta o `href` base para cada versão da aplicação.
Para ajustar o `href` base para cada versão da aplicação, o CLI adiciona o locale ao `"subPath"` configurado.
Especifique o `"subPath"` para cada locale no seu arquivo de configuração de build do workspace [`angular.json`][GuideWorkspaceConfig].
O exemplo a seguir exibe `"subPath"` definido como uma string vazia.

<docs-code header="angular.json" path="adev/src/content/examples/i18n/angular.json" visibleRegion="i18n-subPath"/>

## Configurar um servidor

O deploy típico de múltiplos idiomas serve cada idioma a partir de um subdiretório diferente.
Os usuários são redirecionados para o idioma preferido definido no navegador usando o header HTTP `Accept-Language`.
Se o usuário não tiver definido um idioma preferido, ou se o idioma preferido não estiver disponível, então o servidor volta para o idioma padrão.
Para mudar o idioma, você muda sua localização atual para outro subdiretório.
A mudança de subdiretório geralmente ocorre usando um menu implementado na aplicação.

Para mais informações sobre como fazer deploy de apps para um servidor remoto, veja [Deployment][GuideDeployment].

IMPORTANT: Se você estiver usando [Server rendering](guide/ssr) com `outputMode` definido como `server`, o Angular automaticamente trata o redirecionamento dinamicamente com base no header HTTP `Accept-Language`. Isso simplifica o deployment eliminando a necessidade de ajustes manuais no servidor ou na configuração.

### Exemplo Nginx

O exemplo a seguir exibe uma configuração Nginx.

<docs-code path="adev/src/content/examples/i18n/doc-files/nginx.conf" language="nginx"/>

### Exemplo Apache

O exemplo a seguir exibe uma configuração Apache.

<docs-code path="adev/src/content/examples/i18n/doc-files/apache2.conf" language="apache"/>

[CliBuild]: cli/build 'ng build | CLI | Angular'
[GuideDeployment]: tools/cli/deployment 'Deployment | Angular'
[GuideWorkspaceConfig]: reference/configs/workspace-config 'Angular workspace configuration | Angular'
