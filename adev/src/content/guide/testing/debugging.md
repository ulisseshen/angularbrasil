<!-- ia-translate: true -->
# Debug de testes

Se seus testes não estão funcionando como você espera, você pode inspecioná-los e fazer debug deles no browser.

NOTA: Este guia descreve debug com o test runner Karma.

Para fazer debug de uma aplicação com o test runner Karma:

1. Revele a janela do browser Karma.
   Veja [Configurar testes](guide/testing#set-up-testing) se você precisar de ajuda com este passo.

1. Clique no botão **DEBUG** para abrir uma nova aba do browser e executar novamente os testes.
1. Abra as **Ferramentas do Desenvolvedor** do browser. No Windows, pressione `Ctrl-Shift-I`. No macOS, pressione `Command-Option-I`.
1. Escolha a seção **Sources**.
1. Pressione `Control/Command-P` e então comece a digitar o nome do seu arquivo de teste para abri-lo.
1. Defina um breakpoint no teste.
1. Atualize o browser e observe como ele para no breakpoint.

<img alt="Karma debugging" src="assets/images/guide/testing/karma-1st-spec-debug.png">
