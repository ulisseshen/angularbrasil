<!-- ia-translate: true -->
# O que são deferrable views? {#what-are-deferrable-views}

Uma página Angular totalmente renderizada pode conter muitos components, directives e pipes diferentes. Embora certas partes da página devam ser mostradas imediatamente ao usuário, pode haver porções que podem esperar para ser exibidas mais tarde.
As _deferrable views_ do Angular, usando a sintaxe `@defer`, podem ajudar a acelerar sua aplicação, dizendo ao Angular para esperar antes de baixar o JavaScript das partes da página que não precisam ser mostradas de imediato.

Nesta atividade, você aprenderá como usar deferrable views para fazer o defer load de uma seção do template do seu component.

<hr>

<docs-workflow>

<docs-step title="Adicione um bloco `@defer` a uma seção de um template">
No seu `app.ts`, envolva o component `article-comments` com um bloco `@defer` para fazer o defer load dele.

```angular-html
@defer {
  <article-comments />
}
```

Por padrão, `@defer` carrega o component `article-comments` quando o browser está ocioso.

No console do desenvolvedor do seu browser, você pode ver que o arquivo de chunk lazy `article-comments-component` é carregado separadamente (os nomes específicos dos arquivos podem mudar de uma execução para outra):

```markdown
Initial chunk files | Names | Raw size
chunk-NNSQHFIE.js | - | 769.00 kB |
main.js | main | 229.25 kB |

Lazy chunk files | Names | Raw size
chunk-T5UYXUSI.js | article-comments-component | 1.84 kB |
```

</docs-step>
</docs-workflow>

Ótimo trabalho! Você aprendeu o básico sobre deferrable views.
