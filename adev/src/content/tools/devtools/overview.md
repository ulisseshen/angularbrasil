<!-- ia-translate: true -->
# Visão geral do DevTools {#devtools-overview}

O Angular DevTools é uma extensão de navegador que fornece recursos de debugging e profiling para aplicações Angular.

<docs-video src="https://www.youtube.com/embed/bavWOHZM6zE"/>

Instale o Angular DevTools pela [Chrome Web Store](https://chrome.google.com/webstore/detail/angular-developer-tools/ienfalfjdbdpebioblfackkekamfmbnh) ou pelo [Firefox Addons](https://addons.mozilla.org/firefox/addon/angular-devtools/).

Você pode abrir o Chrome ou o Firefox DevTools em qualquer página web pressionando <kbd>F12</kbd> ou <kbd><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>I</kbd></kbd> (Windows ou Linux) e <kbd><kbd>Fn</kbd>+<kbd>F12</kbd></kbd> ou <kbd><kbd>Cmd</kbd>+<kbd>Option</kbd>+<kbd>I</kbd></kbd> (Mac).
Quando as DevTools do navegador estiverem abertas e o Angular DevTools estiver instalado, você poderá encontrá-lo na aba "Angular".

DICA: A nova aba do Chrome não executa extensões instaladas, então a aba Angular não aparecerá nas DevTools. Visite qualquer outra página para vê-la.

<img src="assets/images/guide/devtools/devtools.png" alt="Visão geral do Angular DevTools mostrando uma árvore de components de uma aplicação.">

## Abrir sua aplicação {#open-your-application}

Quando você abrir a extensão, verá quatro abas adicionais:

| Abas                                      | Detalhes                                                                                                                                       |
| :---------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| [Components](tools/devtools/component)    | Permite explorar os components e directives da sua aplicação e visualizar ou editar o estado deles.                                            |
| [Profiler](tools/devtools/profiler)       | Permite fazer o profile da sua aplicação e entender qual é o gargalo de performance durante a execução da detecção de mudanças.                |
| [Injector Tree](tools/devtools/injectors) | Permite visualizar a hierarquia de injectors de Environment e de Element.                                                                      |
| [Router Tree](tools/devtools/router)      | Permite visualizar a árvore de rotas da sua aplicação.                                                                                         |

Outras abas, como `Transfer State`, são experimentais, podem ser habilitadas nas configurações do devtools e ainda não estão documentadas.

HELPFUL: Para usuários de navegadores baseados em Chromium, pode ser interessante conhecer a [integração com o painel Performance](/best-practices/profiling-with-chrome-devtools).

<img src="assets/images/guide/devtools/devtools-tabs.png" alt="Captura de tela do topo do Angular DevTools ilustrando duas abas no canto superior esquerdo, uma com o rótulo 'Components' e outra com o rótulo 'Profiler'.">

No canto superior direito do Angular DevTools, você encontra o botão de informações, que abre um popover.
O popover de informações contém, entre outras coisas, a versão do Angular em execução na página e a versão do DevTools.

### Aplicação Angular não detectada {#angular-application-not-detected}

Se você vir a mensagem de erro "Angular application not detected" ao abrir o Angular DevTools, isso significa que ele não consegue se comunicar com uma aplicação Angular na página.
A causa mais comum é que a página web que você está inspecionando não contém uma aplicação Angular.
Verifique se você está inspecionando a página web correta e se a aplicação Angular está em execução.

### Detectamos uma aplicação construída com configuração de produção {#we-detected-an-application-built-with-production-configuration}

Se você vir a mensagem de erro "We detected an application built with production configuration. Angular DevTools only supports development builds.", isso significa que uma aplicação Angular foi encontrada na página, mas ela foi compilada com otimizações de produção.
Ao compilar para produção, o Angular CLI remove vários recursos de debug para minimizar a quantidade de JavaScript na página e melhorar a performance. Isso inclui os recursos necessários para se comunicar com o DevTools.

Para executar o DevTools, você precisa compilar sua aplicação com as otimizações desabilitadas. O `ng serve` faz isso por padrão.
Se você precisar fazer debug de uma aplicação implantada, desabilite as otimizações no seu build com a [opção de configuração `optimization`](reference/configs/workspace-config#optimization-configuration) (`{"optimization": false}`).
