<!-- ia-translate: true -->
# O que são deferrable views?

Uma página Angular totalmente renderizada pode conter muitos components, directives e pipes diferentes. Embora certas partes da página devam ser mostradas ao usuário imediatamente, pode haver porções que podem esperar para exibir até mais tarde.
As _deferrable views_ do Angular, usando a sintaxe `@defer`, podem ajudá-lo a acelerar sua aplicação dizendo ao Angular para esperar para baixar o JavaScript das partes da página que não precisam ser mostradas imediatamente.

Nesta atividade, você aprenderá como usar deferrable views para fazer defer load de uma seção do seu template de component.

<hr>

<docs-workflow>

<docs-step title="Adicione um bloco `@defer` a uma seção de um template">
No seu `app.ts`, envolva o component `article-comments` com um bloco `@defer` para fazer defer load dele.

<docs-code language="angular-html">
@defer {
  <article-comments />
}
</docs-code>

Por padrão, `@defer` carrega o component `article-comments` quando o browser está ocioso.

No console do desenvolvedor do seu browser, você pode ver que o arquivo de chunk lazy `article-comments-component` é carregado separadamente (Os nomes de arquivo específicos podem mudar de execução para execução):

<docs-code language="markdown">
Initial chunk files | Names                      |  Raw size
chunk-NNSQHFIE.js   | -                          | 769.00 kB |
main.js             | main                       | 229.25 kB |

Lazy chunk files | Names | Raw size
chunk-T5UYXUSI.js | article-comments-component | 1.84 kB |
</docs-code>

</docs-step>
</docs-workflow>

Ótimo trabalho! Você aprendeu o básico de deferrable views.
