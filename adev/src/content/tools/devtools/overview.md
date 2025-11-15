<!-- ia-translate: true -->
# Visão Geral do DevTools

O Angular DevTools é uma extensão de navegador que fornece recursos de debugging e profiling para aplicações Angular.

<docs-video src="https://www.youtube.com/embed/bavWOHZM6zE"/>

Instale o Angular DevTools da [Chrome Web Store](https://chrome.google.com/webstore/detail/angular-developer-tools/ienfalfjdbdpebioblfackkekamfmbnh) ou do [Firefox Addons](https://addons.mozilla.org/firefox/addon/angular-devtools/).

Você pode abrir o Chrome ou Firefox DevTools em qualquer página web pressionando <kbd>F12</kbd> ou <kbd><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>I</kbd></kbd> (Windows ou Linux) e <kbd><kbd>Fn</kbd>+<kbd>F12</kbd></kbd> ou <kbd><kbd>Cmd</kbd>+<kbd>Option</kbd>+<kbd>I</kbd></kbd> (Mac).
Uma vez que as DevTools do navegador estejam abertas e o Angular DevTools esteja instalado, você pode encontrá-lo na aba "Angular".

HELPFUL: A nova aba do Chrome não executa extensões instaladas, então a aba Angular não aparecerá nas DevTools. Visite qualquer outra página para vê-la.

<img src="assets/images/guide/devtools/devtools.png" alt="An overview of Angular DevTools showing a tree of components for an application.">

## Abrir sua aplicação

Quando você abrir a extensão, verá duas abas adicionais:

| Abas                                   | Detalhes                                                                                                                |
| :------------------------------------- | :--------------------------------------------------------------------------------------------------------------------- |
| [Components](tools/devtools/component) | Permite explorar os components e directives na sua aplicação e visualizar ou editar seu estado.                    |
| [Profiler](tools/devtools/profiler)    | Permite fazer o profile da sua aplicação e entender qual é o gargalo de performance durante a execução da detecção de mudanças. |

<!-- TODO: Add new sections like signals, router etc. -->

<img src="assets/images/guide/devtools/devtools-tabs.png" alt="A screenshot of the top of Angular DevTools illustrating two tabs in the upper-left corner, one labeled 'Components' and another labeled 'Profiler'.">

No canto superior direito do Angular DevTools você encontrará qual versão do Angular está sendo executada na página, bem como o último hash de commit da extensão.

### Aplicação Angular não detectada

Se você vir uma mensagem de erro "Angular application not detected" ao abrir o Angular DevTools, isso significa que ele não consegue se comunicar com uma aplicação Angular na página.
A razão mais comum para isso é porque a página web que você está inspecionando não contém uma aplicação Angular.
Verifique novamente se você está inspecionando a página web correta e se a aplicação Angular está em execução.

### Detectamos uma aplicação construída com configuração de produção

Se você vir uma mensagem de erro "We detected an application built with production configuration. Angular DevTools only supports development builds.", isso significa que uma aplicação Angular foi encontrada na página, mas ela foi compilada com otimizações de produção.
Ao compilar para produção, o Angular CLI remove vários recursos de debug para minimizar a quantidade de JavaScript na página e melhorar a performance. Isso inclui recursos necessários para se comunicar com as DevTools.

Para executar as DevTools, você precisa compilar sua aplicação com otimizações desabilitadas. `ng serve` faz isso por padrão.
Se você precisar debugar uma aplicação implantada, desabilite as otimizações no seu build com a [opção de configuração `optimization`](reference/configs/workspace-config#optimization-configuration) (`{"optimization": false}`).
