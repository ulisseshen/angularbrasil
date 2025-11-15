<!-- ia-translate: true -->

# Segurança

Este tópico descreve as proteções integradas do Angular contra vulnerabilidades e ataques comuns em aplicações web, como ataques de cross-site scripting.
Ele não cobre segurança no nível da aplicação, como autenticação e autorização.

Para mais informações sobre os ataques e mitigações descritos abaixo, consulte o [Open Web Application Security Project (OWASP) Guide](https://www.owasp.org/index.php/Category:OWASP_Guide_Project).

<a id="report-issues"></a>

<docs-callout title="Reportando vulnerabilidades">

Angular faz parte do [Open Source Software Vulnerability Reward Program](https://bughunters.google.com/about/rules/6521337925468160/google-open-source-software-vulnerability-reward-program-rules) do Google. Para vulnerabilidades no Angular, por favor envie seu relatório em [https://bughunters.google.com](https://bughunters.google.com/report).

Para mais informações sobre como o Google lida com questões de segurança, consulte [Google's security philosophy](https://www.google.com/about/appsecurity).

</docs-callout>

## Boas práticas

Estas são algumas boas práticas para garantir que sua aplicação Angular seja segura.

1. **Mantenha-se atualizado com as versões mais recentes das bibliotecas Angular** - As bibliotecas Angular recebem atualizações regulares, e essas atualizações podem corrigir defeitos de segurança descobertos em versões anteriores. Verifique o [change log](https://github.com/angular/angular/blob/main/CHANGELOG.md) do Angular para atualizações relacionadas à segurança.
2. **Não altere sua cópia do Angular** - Versões privadas e personalizadas do Angular tendem a ficar atrás da versão atual e podem não incluir correções e melhorias de segurança importantes. Em vez disso, compartilhe suas melhorias no Angular com a comunidade e faça um pull request.
3. **Evite APIs do Angular marcadas na documentação como "_Security Risk_"** - Para mais informações, consulte a seção [Confiando em valores seguros](#trusting-safe-values) desta página.

## Prevenindo cross-site scripting (XSS)

[Cross-site scripting (XSS)](https://en.wikipedia.org/wiki/Cross-site_scripting) permite que atacantes injetem código malicioso em páginas web.
Esse código pode então, por exemplo, roubar dados de usuário e login, ou executar ações que se passam pelo usuário.
Este é um dos ataques mais comuns na web.

Para bloquear ataques XSS, você deve prevenir que código malicioso entre no Document Object Model (DOM).
Por exemplo, se atacantes conseguirem enganá-lo para inserir uma tag `<script>` no DOM, eles podem executar código arbitrário no seu site.
O ataque não está limitado a tags `<script>` — muitos elementos e propriedades no DOM permitem execução de código, por exemplo, `<img alt="" onerror="...">` e `<a href="javascript:...">`.
Se dados controlados por atacantes entrarem no DOM, espere vulnerabilidades de segurança.

### Modelo de segurança contra cross-site scripting do Angular

Para bloquear sistematicamente bugs de XSS, o Angular trata todos os valores como não confiáveis por padrão.
Quando um valor é inserido no DOM a partir de um template binding, ou interpolation, o Angular sanitiza e escapa valores não confiáveis.
Se um valor já foi sanitizado fora do Angular e é considerado seguro, comunique isso ao Angular marcando o [valor como confiável](#trusting-safe-values).

Diferentemente de valores a serem usados para renderização, templates Angular são considerados confiáveis por padrão e devem ser tratados como código executável.
Nunca crie templates concatenando entrada do usuário e sintaxe de template.
Fazer isso permitiria que atacantes [injetem código arbitrário](https://en.wikipedia.org/wiki/Code_injection) na sua aplicação.
Para prevenir essas vulnerabilidades, sempre use o [compilador de template Ahead-Of-Time (AOT)](#use-the-aot-template-compiler) padrão em deployments de produção.

Uma camada extra de proteção pode ser fornecida através do uso de Content security policy e Trusted Types.
Essas funcionalidades da plataforma web operam no nível do DOM, que é o lugar mais eficaz para prevenir problemas de XSS. Aqui elas não podem ser contornadas usando outras APIs de nível mais baixo.
Por essa razão, é fortemente encorajado aproveitar essas funcionalidades. Para fazer isso, configure a [content security policy](#content-security-policy) para a aplicação e habilite a [imposição de trusted types](#enforcing-trusted-types).

### Sanitização e contextos de segurança

_Sanitização_ é a inspeção de um valor não confiável, transformando-o em um valor seguro para inserir no DOM.
Em muitos casos, a sanitização não altera um valor de forma alguma.
A sanitização depende de um contexto.
Por exemplo, um valor que é inofensivo em CSS é potencialmente perigoso em uma URL.

O Angular define os seguintes contextos de segurança:

| Contextos de segurança | Detalhes                                                                               |
| :--------------------- | :------------------------------------------------------------------------------------- |
| HTML                   | Usado ao interpretar um valor como HTML, por exemplo, ao fazer binding em `innerHtml`. |
| Style                  | Usado ao fazer binding de CSS na propriedade `style`.                                  |
| URL                    | Usado para propriedades de URL, como `<a href>`.                                       |
| Resource URL           | Uma URL que é carregada e executada como código, por exemplo, em `<script src>`.       |

O Angular sanitiza valores não confiáveis para HTML e URLs. Sanitizar resource URLs não é possível porque elas contêm código arbitrário.
Em modo de desenvolvimento, o Angular exibe um aviso no console quando precisa alterar um valor durante a sanitização.

### Exemplo de sanitização {#trusting-safe-values}

O template a seguir faz binding do valor de `htmlSnippet`. Uma vez interpolando-o no conteúdo de um elemento, e outra fazendo binding na propriedade `innerHTML` de um elemento:

<docs-code header="src/app/inner-html-binding.component.html" path="adev/src/content/examples/security/src/app/inner-html-binding.component.html"/>

Conteúdo interpolado sempre tem escape — o HTML não é interpretado e o navegador exibe colchetes angulares no conteúdo de texto do elemento.

Para que o HTML seja interpretado, faça binding em uma propriedade HTML como `innerHTML`.
Esteja ciente de que fazer binding de um valor que um atacante possa controlar em `innerHTML` normalmente causa uma vulnerabilidade XSS.
Por exemplo, alguém poderia executar JavaScript da seguinte forma:

<docs-code header="src/app/inner-html-binding.component.ts (class)" path="adev/src/content/examples/security/src/app/inner-html-binding.component.ts" visibleRegion="class"/>

O Angular reconhece o valor como inseguro e automaticamente o sanitiza, o que remove o elemento `script` mas mantém conteúdo seguro como o elemento `<b>`.

<img alt="A screenshot showing interpolated and bound HTML values" src="assets/images/guide/security/binding-inner-html.png#small">

### Uso direto das APIs do DOM e chamadas de sanitização explícitas

A menos que você imponha Trusted Types, as APIs do DOM integradas do navegador não protegem você automaticamente de vulnerabilidades de segurança.
Por exemplo, `document`, o node disponível através de `ElementRef`, e muitas APIs de terceiros contêm métodos inseguros.
Da mesma forma, se você interagir com outras bibliotecas que manipulam o DOM, você provavelmente não terá a mesma sanitização automática que com interpolações do Angular.
Evite interagir diretamente com o DOM e use templates Angular sempre que possível.

Para casos onde isso é inevitável, use as funções de sanitização integradas do Angular.
Sanitize valores não confiáveis com o método [DomSanitizer.sanitize](api/platform-browser/DomSanitizer#sanitize) e o `SecurityContext` apropriado.
Essa função também aceita valores que foram marcados como confiáveis usando as funções `bypassSecurityTrust`, e não os sanitiza, conforme [descrito abaixo](#trusting-safe-values).

### Confiando em valores seguros

Às vezes aplicações genuinamente precisam incluir código executável, exibir um `<iframe>` de alguma URL, ou construir URLs potencialmente perigosas.
Para prevenir sanitização automática nessas situações, diga ao Angular que você inspecionou um valor, verificou como ele foi criado e garantiu que é seguro.
_Tenha cuidado_.
Se você confiar em um valor que pode ser malicioso, você está introduzindo uma vulnerabilidade de segurança na sua aplicação.
Em caso de dúvida, procure um revisor de segurança profissional.

Para marcar um valor como confiável, injete `DomSanitizer` e chame um dos seguintes métodos:

- `bypassSecurityTrustHtml`
- `bypassSecurityTrustScript`
- `bypassSecurityTrustStyle`
- `bypassSecurityTrustUrl`
- `bypassSecurityTrustResourceUrl`

Lembre-se, se um valor é seguro depende do contexto, então escolha o contexto certo para o uso pretendido do valor.
Imagine que o template a seguir precisa fazer binding de uma URL para uma chamada `javascript:alert(...)`:

<docs-code header="src/app/bypass-security.component.html (URL)" path="adev/src/content/examples/security/src/app/bypass-security.component.html" visibleRegion="URL"/>

Normalmente, o Angular sanitiza automaticamente a URL, desabilita o código perigoso e, em modo de desenvolvimento, registra essa ação no console.
Para prevenir isso, marque o valor da URL como uma URL confiável usando a chamada `bypassSecurityTrustUrl`:

<docs-code header="src/app/bypass-security.component.ts (trust-url)" path="adev/src/content/examples/security/src/app/bypass-security.component.ts" visibleRegion="trust-url"/>

<img alt="A screenshot showing an alert box created from a trusted URL" src="assets/images/guide/security/bypass-security-component.png#medium">

Se você precisar converter entrada do usuário em um valor confiável, use um método do component.
O template a seguir permite que usuários insiram um ID de vídeo do YouTube e carreguem o vídeo correspondente em um `<iframe>`.
O atributo `<iframe src>` é um contexto de segurança de resource URL, porque uma fonte não confiável pode, por exemplo, contrabandear downloads de arquivos que usuários desavisados poderiam executar.
Para prevenir isso, chame um método no component para construir uma URL de vídeo confiável, o que faz com que o Angular permita o binding em `<iframe src>`:

<docs-code header="src/app/bypass-security.component.html (iframe)" path="adev/src/content/examples/security/src/app/bypass-security.component.html" visibleRegion="iframe"/>

<docs-code header="src/app/bypass-security.component.ts (trust-video-url)" path="adev/src/content/examples/security/src/app/bypass-security.component.ts" visibleRegion="trust-video-url"/>

### Content security policy {#enforcing-trusted-types}

Content Security Policy \(CSP\) é uma técnica de defesa em profundidade para prevenir XSS.
Para habilitar CSP, configure seu servidor web para retornar um header HTTP `Content-Security-Policy` apropriado.
Leia mais sobre content security policy no guia [Web Fundamentals](https://developers.google.com/web/fundamentals/security/csp) no site Google Developers.

A política mínima necessária para uma nova aplicação Angular é:

```txt
default-src 'self'; style-src 'self' 'nonce-randomNonceGoesHere'; script-src 'self' 'nonce-randomNonceGoesHere';
```

Ao servir sua aplicação Angular, o servidor deve incluir um nonce gerado aleatoriamente no header HTTP para cada requisição.
Você deve fornecer esse nonce ao Angular para que o framework possa renderizar elementos `<style>`.
Você pode definir o nonce para o Angular de duas formas:

1. Defina a opção `autoCsp` como `true` na [configuração do workspace](reference/configs/workspace-config#extra-build-and-test-options).
1. Defina o atributo `ngCspNonce` no elemento raiz da aplicação como `<app ngCspNonce="randomNonceGoesHere"></app>`. Use essa abordagem se você tiver acesso a templating server-side que pode adicionar o nonce tanto ao header quanto ao `index.html` ao construir a resposta.
1. Forneça o nonce usando o token de injeção `CSP_NONCE`. Use essa abordagem se você tiver acesso ao nonce em runtime e quiser poder fazer cache do `index.html`.

```ts
import {bootstrapApplication, CSP_NONCE} from '@angular/core';
import {AppComponent} from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [{
    provide: CSP_NONCE,
    useValue: globalThis.myRandomNonceValue
  }]
});
```

<docs-callout title="Nonces únicos">

Sempre garanta que os nonces que você fornece sejam <strong>únicos por requisição</strong> e que não sejam previsíveis ou adivinhá​veis.
Se um atacante puder prever nonces futuros, eles podem contornar as proteções oferecidas pelo CSP.

</docs-callout>

NOTE: Se você quiser [fazer inline do CSS crítico](/tools/cli/build#critical-css-inlining) da sua aplicação, você não pode usar o token `CSP_NONCE`, e deve preferir a opção `autoCsp` ou definir o atributo `ngCspNonce` no elemento raiz da aplicação.

Se você não puder gerar nonces no seu projeto, você pode permitir estilos inline adicionando `'unsafe-inline'` à seção `style-src` do header CSP.

| Seções                                           | Detalhes                                                                                                                                                                                                           |
| :----------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `default-src 'self';`                            | Permite que a página carregue todos os seus recursos necessários da mesma origem.                                                                                                                                  |
| `style-src 'self' 'nonce-randomNonceGoesHere';`  | Permite que a página carregue estilos globais da mesma origem \(`'self'`\) e estilos inseridos pelo Angular com o `nonce-randomNonceGoesHere`.                                                                     |
| `script-src 'self' 'nonce-randomNonceGoesHere';` | Permite que a página carregue JavaScript da mesma origem \(`'self'`\) e scripts inseridos pelo Angular CLI com o `nonce-randomNonceGoesHere`. Isso só é necessário se você estiver usando inlining de CSS crítico. |

O Angular em si requer apenas essas configurações para funcionar corretamente.
À medida que seu projeto cresce, você pode precisar expandir suas configurações de CSP para acomodar funcionalidades extras específicas da sua aplicação.

### Impondo Trusted Types

É recomendado que você use [Trusted Types](https://w3c.github.io/trusted-types/dist/spec/) como uma forma de ajudar a proteger suas aplicações de ataques de cross-site scripting.
Trusted Types é uma funcionalidade da [plataforma web](https://en.wikipedia.org/wiki/Web_platform) que pode ajudá-lo a prevenir ataques de cross-site scripting impondo práticas de codificação mais seguras.
Trusted Types também pode ajudar a simplificar a auditoria de código da aplicação.

<docs-callout title="Trusted types">

Trusted Types podem ainda não estar disponíveis em todos os navegadores que sua aplicação tem como alvo.
No caso de sua aplicação habilitada para Trusted-Types ser executada em um navegador que não suporta Trusted Types, as funcionalidades da aplicação são preservadas. Sua aplicação é protegida contra XSS por meio do DomSanitizer do Angular.
Consulte [caniuse.com/trusted-types](https://caniuse.com/trusted-types) para o suporte atual dos navegadores.

</docs-callout>

Para impor Trusted Types para sua aplicação, você deve configurar o servidor web da sua aplicação para emitir headers HTTP com uma das seguintes políticas Angular:

| Políticas                | Detalhes                                                                                                                                                                                                                                                                                                      |
| :----------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `angular`                | Esta política é usada em código revisado de segurança que é interno ao Angular, e é necessária para que o Angular funcione quando Trusted Types são impostos. Qualquer valor de template inline ou conteúdo sanitizado pelo Angular é tratado como seguro por esta política.                                  |
| `angular#bundler`        | Esta política é usada pelo bundler do Angular CLI ao criar arquivos de chunk lazy.                                                                                                                                                                                                                            |
| `angular#unsafe-bypass`  | Esta política é usada para aplicações que usam qualquer um dos métodos no [DomSanitizer](api/platform-browser/DomSanitizer) do Angular que contornam segurança, como `bypassSecurityTrustHtml`. Qualquer aplicação que use esses métodos deve habilitar esta política.                                        |
| `angular#unsafe-jit`     | Esta política é usada pelo [compilador Just-In-Time (JIT)](api/core/Compiler). Você deve habilitar esta política se sua aplicação interagir diretamente com o compilador JIT ou estiver sendo executada em modo JIT usando o [platform browser dynamic](api/platform-browser-dynamic/platformBrowserDynamic). |
| `angular#unsafe-upgrade` | Esta política é usada pelo pacote [@angular/upgrade](api/upgrade/static/UpgradeModule). Você deve habilitar esta política se sua aplicação é um híbrido AngularJS.                                                                                                                                            |

Você deve configurar os headers HTTP para Trusted Types nos seguintes locais:

- Infraestrutura de serving de produção
- Angular CLI \(`ng serve`\), usando a propriedade `headers` no arquivo `angular.json`, para desenvolvimento local e testes end-to-end
- Karma \(`ng test`\), usando a propriedade `customHeaders` no arquivo `karma.config.js`, para testes unitários

O seguinte é um exemplo de header especificamente configurado para Trusted Types e Angular:

```html
Content-Security-Policy: trusted-types angular; require-trusted-types-for 'script';
```

Um exemplo de header especificamente configurado para Trusted Types e aplicações Angular que usam qualquer um dos métodos no [DomSanitizer](api/platform-browser/DomSanitizer) do Angular que contornam segurança:

```html
Content-Security-Policy: trusted-types angular angular#unsafe-bypass; require-trusted-types-for 'script';
```

O seguinte é um exemplo de header especificamente configurado para Trusted Types e aplicações Angular usando JIT:

```html
Content-Security-Policy: trusted-types angular angular#unsafe-jit; require-trusted-types-for 'script';
```

O seguinte é um exemplo de header especificamente configurado para Trusted Types e aplicações Angular que usam lazy loading de modules:

```html
Content-Security-Policy: trusted-types angular angular#bundler; require-trusted-types-for 'script';
```

<docs-callout title="Contribuições da comunidade">

Para saber mais sobre solução de problemas de configurações de Trusted Type, o seguinte recurso pode ser útil:

[Prevent DOM-based cross-site scripting vulnerabilities with Trusted Types](https://web.dev/trusted-types/#how-to-use-trusted-types)

</docs-callout>

### Use o compilador de template AOT {#use-the-aot-template-compiler}

O compilador de template AOT previne toda uma classe de vulnerabilidades chamada template injection, e melhora muito o desempenho da aplicação.
O compilador de template AOT é o compilador padrão usado por aplicações Angular CLI, e você deve usá-lo em todos os deployments de produção.

Uma alternativa ao compilador AOT é o compilador JIT que compila templates para código de template executável dentro do navegador em runtime.
O Angular confia no código de template, então gerar templates dinamicamente e compilá-los, em particular templates contendo dados de usuários, contorna as proteções integradas do Angular. Este é um anti-padrão de segurança.
Para informações sobre como construir formulários dinamicamente de forma segura, consulte o guia [Dynamic Forms](guide/forms/dynamic-forms).

### Proteção XSS server-side

HTML construído no servidor é vulnerável a ataques de injeção.
Injetar código de template em uma aplicação Angular é o mesmo que injetar código executável na aplicação:
Isso dá ao atacante controle total sobre a aplicação.
Para prevenir isso, use uma linguagem de template que automaticamente escapa valores para prevenir vulnerabilidades XSS no servidor.
Não crie templates Angular no lado do servidor usando uma linguagem de template. Isso carrega um alto risco de introduzir vulnerabilidades de template-injection.

## Vulnerabilidades em nível HTTP

O Angular tem suporte integrado para ajudar a prevenir duas vulnerabilidades HTTP comuns, cross-site request forgery \(CSRF ou XSRF\) e cross-site script inclusion \(XSSI\).
Ambas devem ser mitigadas principalmente no lado do servidor, mas o Angular fornece helpers para tornar a integração no lado do cliente mais fácil.

### Cross-site request forgery

Em um cross-site request forgery \(CSRF ou XSRF\), um atacante engana o usuário para visitar uma página web diferente \(como `evil.com`\) com código malicioso. Esta página web envia secretamente uma requisição maliciosa para o servidor web da aplicação \(como `example-bank.com`\).

Assuma que o usuário está logado na aplicação em `example-bank.com`.
O usuário abre um email e clica em um link para `evil.com`, que abre em uma nova aba.

A página `evil.com` imediatamente envia uma requisição maliciosa para `example-bank.com`.
Talvez seja uma requisição para transferir dinheiro da conta do usuário para a conta do atacante.
O navegador automaticamente envia os cookies de `example-bank.com`, incluindo o cookie de autenticação, com essa requisição.

Se o servidor `example-bank.com` não tiver proteção XSRF, ele não pode distinguir entre uma requisição legítima da aplicação e a requisição forjada de `evil.com`.

Para prevenir isso, a aplicação deve garantir que uma requisição de usuário se origina da aplicação real, não de um site diferente.
O servidor e o cliente devem cooperar para combater esse ataque.

Em uma técnica anti-XSRF comum, o servidor da aplicação envia um token de autenticação criado aleatoriamente em um cookie.
O código do cliente lê o cookie e adiciona um header de requisição customizado com o token em todas as requisições seguintes.
O servidor compara o valor do cookie recebido com o valor do header da requisição e rejeita a requisição se os valores estiverem faltando ou não corresponderem.

Essa técnica é eficaz porque todos os navegadores implementam a _política de mesma origem_.
Apenas código do site no qual os cookies estão definidos pode ler os cookies desse site e definir headers customizados em requisições para esse site.
Isso significa que apenas sua aplicação pode ler esse token de cookie e definir o header customizado.
O código malicioso em `evil.com` não pode.

### Segurança XSRF/CSRF do `HttpClient`

`HttpClient` suporta um [mecanismo comum](https://en.wikipedia.org/wiki/Cross-site_request_forgery#Cookie-to-header_token) usado para prevenir ataques XSRF. Ao executar requisições HTTP, um interceptor lê um token de um cookie, por padrão `XSRF-TOKEN`, e o define como um header HTTP, `X-XSRF-TOKEN`. Como apenas código que executa no seu domínio poderia ler o cookie, o backend pode ter certeza de que a requisição HTTP veio da sua aplicação cliente e não de um atacante.

Por padrão, um interceptor envia esse header em todas as requisições mutantes (como `POST`) para URLs relativas, mas não em requisições GET/HEAD ou em requisições com uma URL absoluta.

<docs-callout helpful title="Por que não proteger requisições GET?">
Proteção CSRF só é necessária para requisições que podem mudar estado no backend. Por sua natureza, ataques CSRF cruzam limites de domínio, e a [política de mesma origem](https://developer.mozilla.org/docs/Web/Security/Same-origin_policy) da web impedirá que uma página atacante recupere os resultados de requisições GET autenticadas.
</docs-callout>

Para aproveitar isso, seu servidor precisa definir um token em um cookie de sessão legível por JavaScript chamado `XSRF-TOKEN` no carregamento da página ou na primeira requisição GET. Em requisições subsequentes, o servidor pode verificar que o cookie corresponde ao header HTTP `X-XSRF-TOKEN`, e portanto ter certeza de que apenas código executando no seu domínio poderia ter enviado a requisição. O token deve ser único para cada usuário e deve ser verificável pelo servidor; isso previne que o cliente crie seus próprios tokens. Defina o token como um digest do cookie de autenticação do seu site com um salt para segurança adicional.

Para prevenir colisões em ambientes onde múltiplas aplicações Angular compartilham o mesmo domínio ou subdomínio, dê a cada aplicação um nome de cookie único.

<docs-callout important title="HttpClient suporta apenas a metade cliente do esquema de proteção XSRF">
  Seu serviço de backend deve ser configurado para definir o cookie para sua página, e verificar que o header está presente em todas as requisições elegíveis. Falhar em fazer isso torna a proteção padrão do Angular ineficaz.
</docs-callout>

### Configure nomes customizados de cookie/header

Se seu serviço de backend usa nomes diferentes para o cookie ou header do token XSRF, use `withXsrfConfiguration` para sobrescrever os padrões.

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
  ]
};
```

### Desabilitando proteção XSRF

Se o mecanismo de proteção XSRF integrado não funcionar para sua aplicação, você pode desabilitá-lo usando a feature `withNoXsrfProtection`:

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withNoXsrfProtection(),
    ),
  ]
};
```

Para informações sobre CSRF no Open Web Application Security Project \(OWASP\), consulte [Cross-Site Request Forgery (CSRF)](https://owasp.org/www-community/attacks/csrf) e [Cross-Site Request Forgery (CSRF) Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html).
O paper da Stanford University [Robust Defenses for Cross-Site Request Forgery](https://seclab.stanford.edu/websec/csrf/csrf.pdf) é uma rica fonte de detalhes.

Veja também a [palestra de Dave Smith sobre XSRF na AngularConnect 2016](https://www.youtube.com/watch?v=9inczw6qtpY 'Cross Site Request Funkery Securing Your Angular Apps From Evil Doers').

### Cross-site script inclusion (XSSI)

Cross-site script inclusion, também conhecida como vulnerabilidade JSON, pode permitir que o site de um atacante leia dados de uma API JSON.
O ataque funciona em navegadores mais antigos substituindo construtores de objetos JavaScript integrados e então incluindo uma URL de API usando uma tag `<script>`.

Esse ataque só é bem-sucedido se o JSON retornado for executável como JavaScript.
Servidores podem prevenir um ataque prefixando todas as respostas JSON para torná-las não executáveis, por convenção, usando a string bem conhecida `")]}',\n"`.

A biblioteca `HttpClient` do Angular reconhece essa convenção e automaticamente remove a string `")]}',\n"` de todas as respostas antes de processá-las posteriormente.

Para mais informações, consulte a seção XSSI deste [post do blog de segurança web do Google](https://security.googleblog.com/2011/05/website-security-for-webmasters.html).

## Auditando aplicações Angular

Aplicações Angular devem seguir os mesmos princípios de segurança que aplicações web regulares e devem ser auditadas como tal.
APIs específicas do Angular que devem ser auditadas em uma revisão de segurança, como os métodos [_bypassSecurityTrust_](#trusting-safe-values), são marcadas na documentação como sensíveis à segurança.
