<!-- ia-translate: true -->
<docs-decorative-header title="Template syntax" imgSrc="adev/src/assets/images/templates.svg"> <!-- markdownlint-disable-line -->
No Angular, um template é um trecho de HTML.
Use sintaxe especial dentro de um template para aproveitar muitos dos recursos do Angular.
</docs-decorative-header>

TIP: Confira os [Fundamentos](essentials/templates) do Angular antes de mergulhar neste guia abrangente.

Todo component Angular tem um **template** que define o [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) que o component renderiza na página. Ao usar templates, o Angular consegue manter sua página atualizada automaticamente conforme os dados mudam.

Os templates geralmente ficam na propriedade `template` de um arquivo `*.ts` ou em um arquivo `*.html`. Para saber mais, consulte o [guia detalhado de components](/guide/components).

## Como funcionam os templates? {#how-do-templates-work}

Os templates são baseados na sintaxe [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML), com recursos adicionais, como funções de template built-in, data binding, event listening, variáveis e muito mais.

O Angular compila os templates em JavaScript para construir uma compreensão interna da sua aplicação. Um dos benefícios disso são as otimizações de renderização built-in que o Angular aplica automaticamente à sua aplicação.

### Diferenças do HTML padrão {#differences-from-standard-html}

Algumas diferenças entre templates e a sintaxe HTML padrão incluem:

- Comentários no código-fonte do template não são incluídos na saída renderizada
- Elementos de component e directive podem ser autofechados (ex.: `<UserProfile />`)
- Atributos com certos caracteres (ex.: `[]`, `()` etc.) têm significado especial para o Angular. Consulte a [documentação de binding](guide/templates/binding) e a [documentação de adição de event listeners](guide/templates/event-listeners) para mais informações.
- O caractere `@` tem um significado especial para o Angular, pois adiciona comportamento dinâmico aos templates, como o [control flow](guide/templates/control-flow). Você pode incluir um caractere `@` literal escapando-o como um código de entidade HTML (`&commat;` ou `&#64;`).
- O Angular ignora e colapsa caracteres de espaço em branco desnecessários. Consulte [whitespace em templates](guide/templates/whitespace) para mais detalhes.
- O Angular pode adicionar nós de comentário à página como placeholders para conteúdo dinâmico, mas os desenvolvedores podem ignorá-los.

Além disso, embora a maior parte da sintaxe HTML seja sintaxe de template válida, o Angular não suporta o elemento `<script>` em templates. Para mais informações, consulte a página de [Segurança](best-practices/security).

## Próximos passos {#whats-next}

Você também pode se interessar pelos seguintes tópicos:

| Tópicos                                                                         | Detalhes                                                                                |
| :------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------- |
| [Binding de texto, propriedades e atributos dinâmicos](guide/templates/binding) | Vincule dados dinâmicos a texto, propriedades e atributos.                              |
| [Adicionando event listeners](guide/templates/event-listeners)                  | Responda a eventos em seus templates.                                                   |
| [Two-way binding](guide/templates/two-way-binding)                              | Vincule um valor e propague as mudanças simultaneamente.                                |
| [Control flow](guide/templates/control-flow)                                    | Mostre, oculte e repita elementos condicionalmente.                                     |
| [Pipes](guide/templates/pipes)                                                  | Transforme dados declarativamente.                                                      |
| [Projetando conteúdo filho com ng-content](guide/templates/ng-content)          | Controle como os components renderizam conteúdo.                                        |
| [Criando fragmentos de template com ng-template](guide/templates/ng-template)   | Declare um fragmento de template.                                                       |
| [Agrupando elementos com ng-container](guide/templates/ng-container)            | Agrupe vários elementos juntos ou marque uma localização para renderização.             |
| [Variáveis em templates](guide/templates/variables)                             | Aprenda sobre declarações de variáveis.                                                 |
| [Carregamento diferido com @defer](guide/templates/defer)                       | Crie views diferíveis com `@defer`.                                                     |
| [Sintaxe de expressão](guide/templates/expression-syntax)                       | Aprenda as semelhanças e diferenças entre as expressões do Angular e o JavaScript padrão. |
| [Whitespace em templates](guide/templates/whitespace)                           | Aprenda como o Angular lida com whitespace.                                             |
