<!-- ia-translate: true -->

# Debug de testes

Se seus testes não estiverem funcionando como você espera, você pode fazer debug deles tanto no ambiente Node.js padrão quanto em um browser real.

## Debug no Node.js {#debugging-in-nodejs}

Fazer debug no ambiente Node.js padrão costuma ser a forma mais rápida de diagnosticar problemas que não estão relacionados a APIs específicas do browser ou à renderização.

1.  Execute o comando `ng test` com a flag `--debug`:
    ```shell
    ng test --debug
    ```
2.  O test runner será iniciado no modo de debug e aguardará um debugger ser conectado.
3.  Agora você pode conectar o debugger de sua preferência. Por exemplo, você pode usar o debugger nativo do Node.js no VS Code ou o Chrome DevTools para Node.js.

## Debug em um browser {#debugging-in-a-browser}

Da mesma forma que você inicia uma sessão de debug no Node, você pode usar `ng test` com a flag `--debug` com o Vitest e o [modo browser](/guide/testing/migrating-to-vitest#5-configure-browser-mode-optional).

O test runner será iniciado no modo de debug e aguardará você abrir as ferramentas de desenvolvedor do browser para fazer o debug dos testes.
