<!-- ia-translate: true -->

# Segurança {#security}

Este tópico descreve as proteções integradas do Angular contra vulnerabilidades e ataques comuns em aplicações web, como ataques de cross-site scripting.
Ele não cobre segurança no nível da aplicação, como autenticação e autorização.

Para mais informações sobre os ataques e as mitigações descritas abaixo, consulte o [Open Web Application Security Project (OWASP) Guide](https://www.owasp.org/index.php/Category:OWASP_Guide_Project).

<a id="report-issues"></a>

<docs-callout title="Reportando vulnerabilidades">

O Angular faz parte do [Open Source Software Vulnerability Reward Program](https://bughunters.google.com/about/rules/6521337925468160/google-open-source-software-vulnerability-reward-program-rules) do Google. Para vulnerabilidades no Angular, envie seu relatório em [https://bughunters.google.com](https://bughunters.google.com/report).

Para mais informações sobre como o Google trata questões de segurança, consulte a [filosofia de segurança do Google](https://www.google.com/about/appsecurity).

</docs-callout>

## Boas práticas {#best-practices}

Estas são algumas boas práticas para garantir que sua aplicação Angular seja segura.

1. **Mantenha-se atualizado com as versões mais recentes das bibliotecas Angular** - As bibliotecas Angular recebem atualizações regulares, e essas atualizações podem corrigir defeitos de segurança descobertos em versões anteriores. Verifique o [change log](https://github.com/angular/angular/blob/main/CHANGELOG.md) do Angular para atualizações relacionadas à segurança.
2. **Não altere sua cópia do Angular** - Versões privadas e personalizadas do Angular tendem a ficar para trás em relação à versão atual e podem não incluir correções e melhorias de segurança importantes. Em vez disso, compartilhe suas melhorias com a comunidade e envie um pull request.
3. **Evite APIs do Angular marcadas na documentação como "_Security Risk_"** - Para mais informações, consulte a seção [Confiando em valores seguros](#trusting-safe-values) desta página.

## Prevenindo cross-site scripting (XSS) {#preventing-cross-site-scripting-xss}

[Cross-site scripting (XSS)](https://en.wikipedia.org/wiki/Cross-site_scripting) permite que atacantes injetem código malicioso em páginas web.
Esse código pode então, por exemplo, roubar dados do usuário e de login, ou executar ações que se passem pelo usuário.
Este é um dos ataques mais comuns na web.

Para bloquear ataques XSS, você deve impedir que código malicioso entre no Document Object Model (DOM).
Por exemplo, se atacantes conseguirem fazer você inserir uma tag `<script>` no DOM, eles poderão executar código arbitrário no seu site.
O ataque não se limita às tags `<script>`: muitos elementos e propriedades do DOM permitem execução de código, como `<img alt="" onerror="...">` e `<a href="javascript:...">`.
Se dados controlados por atacantes entrarem no DOM, espere vulnerabilidades de segurança.

### Modelo de segurança contra cross-site scripting do Angular {#angulars-cross-site-scripting-security-model}

Para bloquear sistematicamente bugs de XSS, o Angular trata todos os valores como não confiáveis por padrão.
Quando um valor é inserido no DOM a partir de um binding de template ou de uma interpolação, o Angular sanitiza e escapa os valores não confiáveis.
Se um valor já tiver sido sanitizado fora do Angular e for considerado seguro, comunique isso ao Angular marcando o [valor como confiável](#trusting-safe-values).

Diferentemente dos valores usados para renderização, os templates Angular são considerados confiáveis por padrão e devem ser tratados como código executável.
Nunca crie templates concatenando entrada do usuário com sintaxe de template.
Fazer isso permitiria que atacantes [injetassem código arbitrário](https://en.wikipedia.org/wiki/Code_injection) na sua aplicação.
Para prevenir essas vulnerabilidades, sempre use o compilador de template [Ahead-Of-Time (AOT)](#use-the-aot-template-compiler) padrão em deployments de produção.

Uma camada extra de proteção pode ser fornecida pelo uso de Content Security Policy e Trusted Types.
Esses recursos da plataforma web operam no nível do DOM, que é o lugar mais eficaz para prevenir problemas de XSS. Aqui eles não podem ser contornados usando APIs de nível mais baixo.
Por isso, é fortemente recomendado aproveitar esses recursos. Para isso, configure a [content security policy](#content-security-policy) da aplicação e habilite a [imposição de trusted types](#enforcing-trusted-types).

### Sanitização e contextos de segurança {#sanitization-and-security-contexts}

_Sanitização_ é a inspeção de um valor não confiável, transformando-o em um valor seguro para inserção no DOM.
Em muitos casos, a sanitização não altera o valor de forma alguma.
A sanitização depende de um contexto.
Por exemplo, um valor inofensivo em CSS é potencialmente perigoso em uma URL.

O Angular define os seguintes contextos de segurança:

| Contextos de segurança | Detalhes                                                                               |
| :--------------------- | :------------------------------------------------------------------------------------- |
| HTML                   | Usado ao interpretar um valor como HTML, por exemplo, ao fazer binding em `innerHtml`. |
| Style                  | Usado ao fazer binding de CSS na propriedade `style`.                                  |
| URL                    | Usado para propriedades de URL, como `<a href>`.                                       |
| Resource URL           | Uma URL que é carregada e executada como código, por exemplo, em `<script src>`.      |

O Angular sanitiza valores não confiáveis para HTML e URLs. Não é possível sanitizar resource URLs, pois elas contêm código arbitrário.
No modo de desenvolvimento, o Angular exibe um aviso no console quando precisa alterar um valor durante a sanitização.

### Exemplo de sanitização {#sanitization-example}

O template a seguir faz binding do valor de `htmlSnippet` duas vezes: uma interpolando-o no conteúdo de um elemento e outra vinculando-o à propriedade `innerHTML` de um elemento:

<docs-code header="inner-html-binding.component.html" path="adev/src/content/examples/security/src/app/inner-html-binding.component.html"/>

Conteúdo interpolado é sempre escapado: o HTML não é interpretado, e o navegador exibe os colchetes angulares como texto do elemento.

Para que o HTML seja interpretado, faça o binding em uma propriedade HTML, como `innerHTML`.
Esteja ciente de que vincular a `innerHTML` um valor que um atacante possa controlar normalmente causa uma vulnerabilidade XSS.
Por exemplo, alguém poderia executar JavaScript da seguinte forma:

<docs-code header="inner-html-binding.component.ts (class)" path="adev/src/content/examples/security/src/app/inner-html-binding.component.ts" region="class"/>

O Angular reconhece o valor como inseguro e o sanitiza automaticamente, o que remove o elemento `script`, mas mantém conteúdo seguro, como o elemento `<b>`.

<img alt="Uma captura de tela mostrando valores HTML interpolados e vinculados" src="assets/images/guide/security/binding-inner-html.png#small">

### Uso direto das APIs do DOM e chamadas explícitas de sanitização {#direct-use-of-the-dom-apis-and-explicit-sanitization-calls}

A menos que você imponha Trusted Types, as APIs do DOM integradas do navegador não protegem automaticamente contra vulnerabilidades de segurança.
Por exemplo, `document`, o node disponível por meio de `ElementRef` e muitas APIs de terceiros contêm métodos inseguros.
Da mesma forma, se você interagir com outras bibliotecas que manipulam o DOM, provavelmente não terá a mesma sanitização automática que existe nas interpolações do Angular.
Evite interagir diretamente com o DOM e use templates Angular sempre que possível.

Quando isso for inevitável, use as funções de sanitização integradas do Angular.
Sanitize valores não confiáveis com o método [DomSanitizer.sanitize](api/platform-browser/DomSanitizer#sanitize) e o `SecurityContext` apropriado.
Essa função também aceita valores marcados como confiáveis com as funções `bypassSecurityTrust`, e não os sanitiza, conforme [descrito abaixo](#trusting-safe-values).

### Confiando em valores seguros {#trusting-safe-values}

Às vezes, aplicações realmente precisam incluir código executável, exibir um `<iframe>` de alguma URL ou construir URLs potencialmente perigosas.
Para impedir a sanitização automática nessas situações, informe ao Angular que você inspecionou um valor, verificou como ele foi criado e garantiu que é seguro.
Tenha _cuidado_.
Se você confiar em um valor que pode ser malicioso, estará introduzindo uma vulnerabilidade de segurança na sua aplicação.
Em caso de dúvida, procure um revisor de segurança profissional.

Para marcar um valor como confiável, injete `DomSanitizer` e chame um dos seguintes métodos:

- `bypassSecurityTrustHtml`
- `bypassSecurityTrustScript`
- `bypassSecurityTrustStyle`
- `bypassSecurityTrustUrl`
- `bypassSecurityTrustResourceUrl`

Lembre-se: se um valor é seguro depende do contexto, então escolha o contexto certo para o uso pretendido do valor.
Imagine que o template a seguir precisa vincular uma URL a uma chamada `javascript:alert(...)`:

<docs-code header="bypass-security.component.html (URL)" path="adev/src/content/examples/security/src/app/bypass-security.component.html" region="URL"/>

Normalmente, o Angular sanitiza automaticamente a URL, desabilita o código perigoso e, no modo de desenvolvimento, registra essa ação no console.
Para evitar isso, marque o valor da URL como uma URL confiável usando a chamada `bypassSecurityTrustUrl`:

<docs-code header="bypass-security.component.ts (trust-url)" path="adev/src/content/examples/security/src/app/bypass-security.component.ts" region="trust-url"/>

<img alt="Uma captura de tela mostrando uma caixa de alerta criada a partir de uma URL confiável" src="assets/images/guide/security/bypass-security-component.png#medium">

Se você precisar converter a entrada do usuário em um valor confiável, use um método do component.
O template a seguir permite que os usuários insiram um ID de vídeo do YouTube e carreguem o vídeo correspondente em um `<iframe>`.
O atributo `<iframe src>` é um contexto de segurança de resource URL, porque uma fonte não confiável pode, por exemplo, contrabandear downloads de arquivos que usuários desavisados poderiam executar.
Para evitar isso, chame um método no component para construir uma URL de vídeo confiável, o que faz o Angular permitir o binding em `<iframe src>`:

<docs-code header="bypass-security.component.html (iframe)" path="adev/src/content/examples/security/src/app/bypass-security.component.html" region="iframe"/>

<docs-code header="bypass-security.component.ts (trust-video-url)" path="adev/src/content/examples/security/src/app/bypass-security.component.ts" region="trust-video-url"/>

### Content security policy {#content-security-policy}

Content Security Policy \(CSP\) é uma técnica de defesa em profundidade para prevenir XSS.
Para habilitar a CSP, configure seu servidor web para retornar um header HTTP `Content-Security-Policy` apropriado.
Leia mais sobre content security policy no [Web Fundamentals guide](https://developers.google.com/web/fundamentals/security/csp), no site do Google Developers.

A política mínima necessária para uma aplicação Angular recém-criada é:

```txt
default-src 'self'; style-src 'self' 'nonce-randomNonceGoesHere'; script-src 'self' 'nonce-randomNonceGoesHere';
```

Ao servir sua aplicação Angular, o servidor deve incluir um nonce gerado aleatoriamente no header HTTP de cada requisição.
Você deve fornecer esse nonce ao Angular para que o framework possa renderizar os elementos `<style>`.
Você pode definir o nonce para o Angular de uma das seguintes formas:

1. Defina o atributo `ngCspNonce` no elemento raiz da aplicação, como `<app ngCspNonce="randomNonceGoesHere"></app>`. Use essa abordagem se você tiver acesso a templating no servidor, capaz de adicionar o nonce tanto ao header quanto ao `index.html` ao construir a resposta.
1. Forneça o nonce usando o token de injeção `CSP_NONCE`. Use essa abordagem se você tiver acesso ao nonce em runtime e quiser poder armazenar em cache o `index.html`.

```ts
import {CSP_NONCE} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: CSP_NONCE,
      useValue: globalThis.myRandomNonceValue,
    },
  ],
});
```

<docs-callout title="Nonces únicos">

Sempre garanta que os nonces fornecidos sejam <strong>únicos por requisição</strong> e que não sejam previsíveis ou adivinháveis.
Se um atacante conseguir prever nonces futuros, ele poderá contornar as proteções oferecidas pela CSP.

Gerar um nonce no servidor de origem geralmente é desencorajado ao usar um CDN, pois as respostas são frequentemente armazenadas em cache. Se o servidor gerar um nonce e o CDN armazenar em cache essa resposta HTML, todo visitante subsequente receberá o mesmo valor "único", permitindo que um atacante descubra o valor estático e contorne as proteções da CSP.

Para manter a integridade de uso único de um nonce, ele idealmente deve ser gerado na camada de borda (por exemplo, no CDN), logo antes de o conteúdo ser entregue ao usuário.

</docs-callout>

NOTE: Se você quiser [fazer inline do CSS crítico](/tools/cli/build#critical-css-inlining) da sua aplicação, não pode usar o token `CSP_NONCE` e deve preferir a opção `security.autoCsp` na [configuração do workspace](reference/configs/workspace-config#extra-build-and-test-options) ou definir o atributo `ngCspNonce` no elemento raiz da aplicação.

Se você não puder gerar nonces no seu projeto, pode permitir estilos inline adicionando `'unsafe-inline'` à seção `style-src` do header CSP.

| Seções                                           | Detalhes                                                                                                                                                                                                                                                                                                                                                  |
| :----------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `default-src 'self';`                            | Permite que a página carregue todos os recursos necessários da mesma origem.                                                                                                                                                                                                                                                                              |
| `style-src 'self' 'nonce-randomNonceGoesHere';`  | Permite que a página carregue estilos globais da mesma origem \(`'self'`\) e estilos inseridos pelo Angular com o `nonce-randomNonceGoesHere`.                                                                                                                                                                                                           |
| `script-src 'self' 'nonce-randomNonceGoesHere';` | Permite que a página carregue JavaScript da mesma origem \(`'self'`\) e scripts inseridos pelo Angular CLI com o `nonce-randomNonceGoesHere`. É necessário apenas quando você habilita o inlining de CSS crítico ou a subresource integrity (que injeta um import map para validar chunks importados dinamicamente), pois ambos adicionam scripts inline ao `index.html`. |

O próprio Angular exige apenas essas configurações para funcionar corretamente.
À medida que seu projeto cresce, você pode precisar expandir suas configurações de CSP para acomodar recursos extras específicos da sua aplicação.

#### Hospedagem estática sem nonces por resposta {#static-hosting-without-per-response-nonces}

Se o seu ambiente de hospedagem ou CDN puder substituir um token de placeholder no HTML em cache na borda (por exemplo, usando SSI, ESI ou uma edge function), você pode construir o `index.html` com um placeholder em `ngCspNonce` (como `<app ngCspNonce="__CSP_NONCE__"></app>`) e substituí-lo por um nonce único em cada resposta.

Se você fizer deploy da aplicação em um host estático que serve o `index.html` sem alterações e sem transformação na borda, não fixe um nonce estático no código. Em vez disso, use uma das seguintes abordagens:

##### Gerando hash de scripts inline com `autoCsp` {#hash-inline-scripts-with-autocsp}

Defina a opção `security.autoCsp` como `true` na [configuração do workspace](reference/configs/workspace-config#extra-build-and-test-options).
Em tempo de build, o Angular CLI calcula um hash de cada script inline no `index.html`, incluindo os scripts adicionados pelo inlining de CSS crítico e pela subresource integrity.
A CLI substitui os elementos `<script src>` por um script loader com hash e adiciona uma tag `<meta>` no início do `<head>`:

```txt
script-src 'strict-dynamic' 'sha256-...' https: 'unsafe-inline'; object-src 'none'; base-uri 'self';
```

Como os hashes dependem apenas do conteúdo dos scripts, o `index.html` permanece válido para todos os visitantes e pode ser armazenado em cache.
Navegadores que oferecem suporte a hashes e a `'strict-dynamic'` ignoram os fallbacks `https:` e `'unsafe-inline'`.

A política gerada pelo `autoCsp` tem as seguintes limitações:

- Ela cobre apenas scripts. Você deve configurar o `style-src` separadamente.
- Os navegadores ignoram algumas diretivas, como `frame-ancestors`, `report-uri` e `sandbox`, quando aparecem em uma tag `<meta>`. Envie essas diretivas em um header HTTP `Content-Security-Policy`.
- Quando uma página tem múltiplas políticas, o navegador aplica todas elas. Se você também enviar um header CSP, omita tanto `script-src` quanto `default-src` do header, para que eles não bloqueiem os scripts inline com hash.
- Você não pode usar `autoCsp` com server-side rendering.

##### Evite scripts inline {#avoid-inline-scripts}

O Angular CLI adiciona scripts inline ao `index.html` apenas para o inlining de CSS crítico e para a subresource integrity (que emite um import map para carregar metadados de integridade para imports dinâmicos de módulos).
Se você definir `optimization.styles.inlineCritical` como `false` e deixar a `subresourceIntegrity` desabilitada, o `index.html` não conterá scripts inline. Nesse caso, você pode configurar um header `Content-Security-Policy` com `script-src 'self'`.

NOTE: Desabilitar o inlining de CSS crítico pode deixar a renderização inicial da aplicação mais lenta, e desabilitar a subresource integrity remove as verificações de integridade dos scripts.

##### Configure estilos para hospedagem estática {#configure-styles-for-static-hosting}

O Angular insere elementos `<style>` para os estilos dos components em runtime, e o inlining de CSS crítico adiciona um elemento `<style>` ao `index.html`.
Nem o `autoCsp` nem a desabilitação de scripts inline cobrem esses estilos. Sem um nonce por resposta, permita-os adicionando `'unsafe-inline'` ao `style-src`.
Por exemplo, se o seu build evitar scripts inline, configure seu host para enviar o seguinte header:

```txt
default-src 'self'; style-src 'self' 'unsafe-inline';
```

Se você usar `autoCsp`, envie `style-src 'self' 'unsafe-inline'` no header HTTP, sem `default-src` ou `script-src`.

O código da sua aplicação e as bibliotecas de terceiros podem exigir diretivas adicionais em ambos os casos.

### Impondo Trusted Types {#enforcing-trusted-types}

Recomenda-se o uso de [Trusted Types](https://w3c.github.io/trusted-types/dist/spec/) como uma forma de ajudar a proteger suas aplicações contra ataques de cross-site scripting.
Trusted Types é um recurso da [plataforma web](https://en.wikipedia.org/wiki/Web_platform) que pode ajudar a prevenir ataques de cross-site scripting ao impor práticas de codificação mais seguras.
Trusted Types também pode ajudar a simplificar a auditoria do código da aplicação.

<docs-callout title="Trusted types">

Trusted Types talvez ainda não estejam disponíveis em todos os navegadores que sua aplicação tem como alvo.
Caso sua aplicação habilitada para Trusted Types seja executada em um navegador que não suporta Trusted Types, os recursos da aplicação são preservados. Sua aplicação continua protegida contra XSS pelo DomSanitizer do Angular.
Consulte [caniuse.com/trusted-types](https://caniuse.com/trusted-types) para ver o suporte atual dos navegadores.

</docs-callout>

Para impor Trusted Types na sua aplicação, você deve configurar o servidor web para emitir headers HTTP com uma das seguintes políticas do Angular:

| Políticas                | Detalhes                                                                                                                                                                                                                                                                                                      |
| :----------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `angular`                | Esta política é usada em código revisado por segurança que é interno ao Angular, e é necessária para que o Angular funcione quando Trusted Types são impostos. Qualquer valor de template inline ou conteúdo sanitizado pelo Angular é tratado como seguro por esta política.                                  |
| `angular#bundler`        | Esta política é usada pelo bundler do Angular CLI ao criar arquivos de chunk lazy.                                                                                                                                                                                                                            |
| `angular#unsafe-bypass`  | Esta política é usada por aplicações que utilizam qualquer um dos métodos do [DomSanitizer](api/platform-browser/DomSanitizer) do Angular que contornam a segurança, como `bypassSecurityTrustHtml`. Qualquer aplicação que use esses métodos deve habilitar esta política.                                        |
| `angular#unsafe-jit`     | Esta política é usada pelo [compilador Just-In-Time (JIT)](api/core/Compiler). Você deve habilitar esta política se sua aplicação interagir diretamente com o compilador JIT ou estiver rodando em modo JIT usando o [platform browser dynamic](api/platform-browser-dynamic/platformBrowserDynamic). |
| `angular#unsafe-upgrade` | Esta política é usada pelo pacote [@angular/upgrade](api/upgrade/static/UpgradeModule). Você deve habilitar esta política se sua aplicação for um híbrido com AngularJS.                                                                                                                                       |

Você deve configurar os headers HTTP para Trusted Types nos seguintes locais:

- Infraestrutura de produção que serve a aplicação
- Angular CLI \(`ng serve`\), usando a propriedade `headers` no arquivo `angular.json`, para desenvolvimento local e testes end-to-end
- Karma \(`ng test`\), usando a propriedade `customHeaders` no arquivo `karma.config.js`, para testes unitários

O exemplo a seguir é um header configurado especificamente para Trusted Types e Angular:

```html
Content-Security-Policy: trusted-types angular; require-trusted-types-for 'script';
```

Um exemplo de header configurado especificamente para Trusted Types em aplicações Angular que usam qualquer um dos métodos do [DomSanitizer](api/platform-browser/DomSanitizer) do Angular que contornam a segurança:

```html
Content-Security-Policy: trusted-types angular angular#unsafe-bypass; require-trusted-types-for
'script';
```

O exemplo a seguir é um header configurado especificamente para Trusted Types em aplicações Angular que usam JIT:

```html
Content-Security-Policy: trusted-types angular angular#unsafe-jit; require-trusted-types-for
'script';
```

O exemplo a seguir é um header configurado especificamente para Trusted Types em aplicações Angular que usam lazy loading de módulos:

```html
Content-Security-Policy: trusted-types angular angular#bundler; require-trusted-types-for 'script';
```

<docs-callout title="Contribuições da comunidade">

Para saber mais sobre a solução de problemas em configurações de Trusted Types, o recurso a seguir pode ser útil:

[Prevent DOM-based cross-site scripting vulnerabilities with Trusted Types](https://web.dev/trusted-types/#how-to-use-trusted-types)

</docs-callout>

### Use o compilador de template AOT {#use-the-aot-template-compiler}

O compilador de template AOT previne uma classe inteira de vulnerabilidades chamada template injection e melhora muito o desempenho da aplicação.
O compilador de template AOT é o compilador padrão usado por aplicações Angular CLI, e você deve usá-lo em todos os deployments de produção.

Uma alternativa ao compilador AOT é o compilador JIT, que compila templates para código de template executável dentro do navegador, em runtime.
O Angular confia no código de template; portanto, gerar templates dinamicamente e compilá-los, principalmente templates que contêm dados do usuário, contorna as proteções integradas do Angular. Isso é um anti-padrão de segurança.
Para informações sobre como construir formulários dinamicamente de forma segura, consulte o guia [Dynamic Forms](guide/forms/dynamic-forms).

### Proteção contra XSS no servidor {#server-side-xss-protection}

HTML construído no servidor é vulnerável a ataques de injeção.
Injetar código de template em uma aplicação Angular equivale a injetar código executável na aplicação:
isso dá ao atacante controle total sobre a aplicação.
Para evitar isso, use uma linguagem de template que escape automaticamente os valores, prevenindo vulnerabilidades XSS no servidor.
Não crie templates Angular no lado do servidor usando uma linguagem de template. Isso apresenta um alto risco de introduzir vulnerabilidades de template injection.

## Vulnerabilidades em nível HTTP {#http-level-vulnerabilities}

O Angular tem suporte integrado para ajudar a prevenir duas vulnerabilidades HTTP comuns: cross-site request forgery \(CSRF ou XSRF\) e cross-site script inclusion \(XSSI\).
Ambas devem ser mitigadas principalmente no lado do servidor, mas o Angular fornece helpers para tornar a integração no lado do cliente mais fácil.

### Cross-site request forgery

Em um cross-site request forgery \(CSRF ou XSRF\), um atacante engana o usuário para que ele visite outra página web (como `evil.com`) que contém código malicioso. Essa página envia secretamente uma requisição maliciosa ao servidor web da aplicação (como `example-bank.com`).

Suponha que o usuário esteja logado na aplicação em `example-bank.com`.
O usuário abre um e-mail e clica em um link para `evil.com`, que abre em uma nova aba.

A página `evil.com` envia imediatamente uma requisição maliciosa para `example-bank.com`.
Talvez seja uma requisição para transferir dinheiro da conta do usuário para a conta do atacante.
O navegador envia automaticamente os cookies de `example-bank.com`, incluindo o cookie de autenticação, junto com essa requisição.

Se o servidor de `example-bank.com` não tiver proteção XSRF, ele não consegue diferenciar uma requisição legítima da aplicação de uma requisição forjada por `evil.com`.

Para evitar isso, a aplicação deve garantir que a requisição do usuário se origina da aplicação real, e não de outro site.
Servidor e cliente devem cooperar para frustrar esse ataque.

Em uma técnica comum de proteção anti-XSRF, o servidor da aplicação envia um token de autenticação gerado aleatoriamente em um cookie.
O código do cliente lê o cookie e adiciona um header customizado com o token em todas as requisições seguintes.
O servidor compara o valor do cookie recebido com o valor do header da requisição e rejeita a requisição se os valores estiverem ausentes ou não corresponderem.

Essa técnica é eficaz porque todos os navegadores implementam a _same origin policy_ (política de mesma origem).
Apenas o código do site no qual os cookies foram definidos pode ler os cookies desse site e definir headers customizados em requisições para ele.
Ou seja, somente a sua aplicação pode ler esse token de cookie e definir o header customizado.
O código malicioso em `evil.com` não consegue.

### Segurança XSRF/CSRF do `HttpClient` {#httpclient-xsrfcsrf-security}

O `HttpClient` oferece suporte a um [mecanismo comum](https://en.wikipedia.org/wiki/Cross-site_request_forgery#Cookie-to-header_token) usado para prevenir ataques XSRF. Ao executar requisições HTTP, um interceptor lê um token de um cookie, por padrão `XSRF-TOKEN`, e o define como um header HTTP, `X-XSRF-TOKEN`. Como apenas código executado no seu domínio pode ler o cookie, o backend pode ter certeza de que a requisição HTTP veio da sua aplicação cliente, e não de um atacante.

Por padrão, um interceptor envia esse header em todas as requisições que alteram estado (como `POST`) para URLs relativas e de mesma origem, mas não em requisições `GET` ou `HEAD`.

<docs-callout helpful title="Por que não proteger requisições GET?">
A proteção CSRF só é necessária para requisições que podem alterar estado no backend. Por natureza, ataques CSRF cruzam limites de domínio, e a [política de mesma origem](https://developer.mozilla.org/docs/Web/Security/Same-origin_policy) da web impedirá que uma página atacante recupere os resultados de requisições `GET` autenticadas.
</docs-callout>

Para aproveitar isso, seu servidor precisa definir um token em um cookie de sessão legível por JavaScript chamado `XSRF-TOKEN`, no carregamento da página ou na primeira requisição `GET`. Nas requisições seguintes, o servidor pode verificar se o cookie corresponde ao header HTTP `X-XSRF-TOKEN` e, assim, ter certeza de que apenas código executado no seu domínio poderia ter enviado a requisição. O token deve ser único para cada usuário e verificável pelo servidor; isso impede que o cliente crie seus próprios tokens. Defina o token como um digest do cookie de autenticação do seu site, com um salt para mais segurança.

Para evitar colisões em ambientes onde várias aplicações Angular compartilham o mesmo domínio ou subdomínio, dê a cada aplicação um nome de cookie único.

<docs-callout important title="O HttpClient suporta apenas a metade cliente do esquema de proteção XSRF">
  Seu serviço de backend deve estar configurado para definir o cookie da sua página e verificar se o header está presente em todas as requisições elegíveis. Não fazer isso torna a proteção padrão do Angular ineficaz.
</docs-callout>

### Configure nomes customizados de cookie/header {#configure-custom-cookieheader-names}

Se o seu serviço de backend usar nomes diferentes para o cookie ou o header do token XSRF, use `withXsrfConfiguration` para sobrescrever os padrões.

Adicione-o à chamada `provideHttpClient` da seguinte forma:

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withXsrfConfiguration({
        cookieName: 'CUSTOM_XSRF_TOKEN',
        headerName: 'X-Custom-Xsrf-Header',
      }),
    ),
  ],
};
```

### Desabilitando a proteção XSRF {#disabling-xsrf-protection}

Se o mecanismo de proteção XSRF integrado não funcionar para a sua aplicação, você pode desabilitá-lo usando o recurso `withNoXsrfProtection`:

```ts
export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withNoXsrfProtection())],
};
```

Para informações sobre CSRF no Open Web Application Security Project \(OWASP\), consulte [Cross-Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/csrf) e [Cross-Site Request Forgery (CSRF) Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html).
O artigo da Stanford University [Robust Defenses for Cross-Site Request Forgery](https://seclab.stanford.edu/websec/csrf/csrf.pdf) é uma rica fonte de detalhes.

Veja também a [palestra de Dave Smith sobre XSRF na AngularConnect 2016](https://www.youtube.com/watch?v=9inczw6qtpY 'Cross Site Request Funkery Securing Your Angular Apps From Evil Doers').

### Cross-site script inclusion (XSSI) {#cross-site-script-inclusion-xssi}

Cross-site script inclusion, também conhecido como JSON vulnerability, pode permitir que o site de um atacante leia dados de uma API JSON.
O ataque funciona em navegadores mais antigos ao sobrescrever os construtores de objetos JavaScript integrados e, em seguida, incluir uma URL de API usando uma tag `<script>`.

Esse ataque só tem sucesso se o JSON retornado for executável como JavaScript.
Servidores podem evitar o ataque prefixando todas as respostas JSON para torná-las não executáveis, por convenção, usando a string conhecida `")]}',\n"`.

A biblioteca `HttpClient` do Angular reconhece essa convenção e remove automaticamente a string `")]}',\n"` de todas as respostas antes de processá-las.

Para mais informações, consulte a seção XSSI deste [post do blog de segurança web do Google](https://security.googleblog.com/2011/05/website-security-for-webmasters.html).

## Prevenindo Server-Side Request Forgery (SSRF) {#preventing-server-side-request-forgery-ssrf}

O Angular inclui validação rigorosa dos headers `Host`, `Forwarded`, `X-Forwarded-Host`, `X-Forwarded-Proto`, `X-Forwarded-Prefix` e `X-Forwarded-Port` no pipeline de tratamento de requisições, para prevenir [Server-Side Request Forgery (SSRF)](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/SSRF) baseado em headers.

As regras de validação são:

- `Host`, `X-Forwarded-Host` e o parâmetro `host` do header `Forwarded` são validados contra uma allowlist rigorosa e não podem conter separadores de caminho.
- O header `X-Forwarded-Port` deve ser numérico.
- O header `X-Forwarded-Proto` e o parâmetro `proto` do header `Forwarded` devem ser `http` ou `https`.
- O header `X-Forwarded-Prefix` deve começar com `/` e conter apenas caracteres alfanuméricos, hífens e underscores, separados por barras simples.
- Por padrão, o header `Forwarded` e todos os headers `X-Forwarded-*` são tratados como não confiáveis e são removidos da requisição. Para mantê-los, eles devem ser explicitamente permitidos por meio da configuração de `trustProxyHeaders`.

Headers inválidos disparam um log de erro, e os headers de proxy não permitidos são removidos da requisição. Requisições com nomes de host não reconhecidos resultam em `400 Bad Request`.

NOTE: A maioria dos provedores de nuvem e de CDN realiza validação automática desses headers antes de a requisição chegar à origem da aplicação. Essa filtragem nativa reduz significativamente a superfície de ataque na prática.

### Configurando hosts permitidos {#configuring-allowed-hosts}

Para permitir hostnames específicos, você precisa adicioná-los à allowlist. Isso é essencial para garantir que a aplicação funcione corretamente e de forma segura quando for implantada. Os padrões aceitam wildcards para uma correspondência de hostname mais flexível.

Você pode configurar a opção `allowedHosts` no seu `angular.json`:

```json {hideCopy}
{
  // ...
  "projects": {
    "your-project-name": {
      // ...
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "security": {
              "allowedHosts": [
                "example.com",
                "*.example.com" // permite todos os subdomínios de example.com
              ]
            }
            // ... other options
          }
        }
      }
    }
  }
}
```

Você também pode configurar `allowedHosts` ao inicializar o application engine:

```typescript
const appEngine = new AngularAppEngine({
  allowedHosts: ['example.com', '*.trusted-example.com'],
});

const nodeAppEngine = new AngularNodeAppEngine({
  allowedHosts: ['example.com', '*.trusted-example.com'],
});
```

Para a variante Node.js `AngularNodeAppEngine`, você também pode fornecer a variável de ambiente `NG_ALLOWED_HOSTS` (lista separada por vírgulas) para autorizar hosts.

```bash {hideDollar}
export NG_ALLOWED_HOSTS="example.com,*.trusted-example.com"
```

IMPORTANT: Você pode usar `*` como valor em `allowedHosts` para permitir todos os hostnames, embora isso seja geralmente desencorajado e represente um risco de segurança. Aceitar qualquer header Host pode expor sua aplicação a host header injection e a ataques de [Server-Side Request Forgery (SSRF)](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/SSRF). Essa configuração só deve ser usada quando a validação dos headers `Host` e `X-Forwarded-Host` for feita em outra camada, como um load balancer ou um reverse proxy. Para maior segurança, recomendamos usar uma lista explícita de hosts permitidos sempre que possível. Veja [GHSA-x288-3778-4hhx](https://github.com/angular/angular-cli/security/advisories/GHSA-x288-3778-4hhx) para mais detalhes.

### Configurando headers de proxy confiáveis {#configuring-trusted-proxy-headers}

Por padrão, o Angular ignora o header `Forwarded` padrão e todos os headers `X-Forwarded-*`. Se a sua aplicação estiver atrás de um reverse proxy confiável (como um load balancer) que define esses headers, você pode configurar o Angular para confiar neles.

Se o header `Forwarded` for confiável, seus parâmetros `host` e `proto` são extraídos e têm precedência sobre os headers `x-forwarded-host` e `x-forwarded-proto` correspondentes.

Você pode configurar `trustProxyHeaders` ao inicializar o application engine:

```typescript
const appEngine = new AngularAppEngine({
  trustProxyHeaders: ['forwarded'], // Confia no header Forwarded padrão
});

const appEngine = new AngularAppEngine({
  trustProxyHeaders: ['x-forwarded-host', 'x-forwarded-proto'], // Confia em headers não padronizados
});

const nodeAppEngine = new AngularNodeAppEngine({
  trustProxyHeaders: true, // Confia no header Forwarded padrão e em todos os X-Forwarded-*
});
```

Para a variante Node.js `AngularNodeAppEngine`, você também pode fornecer a variável de ambiente `NG_TRUST_PROXY_HEADERS` (com uma lista de headers separada por vírgulas como valor) para permitir o uso desses headers.

```bash {hideDollar}
export NG_TRUST_PROXY_HEADERS="X-FORWARDED-HOST,X-FORWARDED-PREFIX"
```

IMPORTANT: Habilite `trustProxyHeaders` apenas se a sua aplicação estiver atrás de um proxy confiável que valide ou sobrescreva rigorosamente esses headers. Caso contrário, atacantes podem falsificar esses headers e provocar ataques de [Server-Side Request Forgery (SSRF)](https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/SSRF).

## Auditando aplicações Angular {#auditing-angular-applications}

Aplicações Angular devem seguir os mesmos princípios de segurança das aplicações web comuns e devem ser auditadas da mesma forma.
As APIs específicas do Angular que devem ser auditadas em uma revisão de segurança, como os métodos [_bypassSecurityTrust_](#trusting-safe-values), estão marcadas na documentação como sensíveis à segurança.
