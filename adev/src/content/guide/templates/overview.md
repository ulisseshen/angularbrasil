<!-- ia-translate: true -->
<docs-decorative-header title="Template syntax" imgSrc="adev/src/assets/images/templates.svg"> <!-- markdownlint-disable-line -->
No Angular, um template é um trecho de HTML.
Use sintaxe especial dentro de um template para aproveitar muitas das funcionalidades do Angular.
</docs-decorative-header>

TIP: Confira os [Fundamentos](essentials/templates) do Angular antes de mergulhar neste guia abrangente.

Todo component Angular tem um **template** que define o [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model) que o component renderiza na página. Ao usar templates, o Angular é capaz de manter automaticamente sua página atualizada conforme os dados mudam.

Os templates geralmente são encontrados dentro da propriedade `template` de um arquivo `*.component.ts` ou do arquivo `*.component.html`. Para saber mais, consulte o [guia detalhado de components](/guide/components).

## Como funcionam os templates?

Os templates são baseados na sintaxe [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML), com funcionalidades adicionais como funções de template built-in, data binding, event listening, variáveis e muito mais.

O Angular compila templates em JavaScript para construir uma compreensão interna da sua aplicação. Um dos benefícios disso são as otimizações de renderização built-in que o Angular aplica à sua aplicação automaticamente.

### Diferenças do HTML padrão

Algumas diferenças entre templates e sintaxe HTML padrão incluem:

- Comentários no código fonte do template não são incluídos na saída renderizada
- Elementos de component e directive podem ser auto-fechados (ex.: `<UserProfile />`)
- Atributos com certos caracteres (i.e., `[]`, `()`, etc.) têm significado especial para o Angular. Consulte a [documentação de binding](guide/templates/binding) e [documentação de adição de event listeners](guide/templates/event-listeners) para mais informações.
- O caractere `@` tem um significado especial para o Angular para adicionar comportamento dinâmico, como [control flow](guide/templates/control-flow), aos templates. Você pode incluir um caractere `@` literal escapando-o como um código de entidade HTML (`&commat;` ou `&#64;`).
- O Angular ignora e colapsa caracteres de espaço em branco desnecessários. Consulte [whitespace em templates](guide/templates/whitespace) para mais detalhes.
- O Angular pode adicionar nós de comentário a uma página como espaços reservados para conteúdo dinâmico, mas desenvolvedores podem ignorá-los.

Além disso, embora a maioria da sintaxe HTML seja sintaxe de template válida, o Angular não suporta o elemento `<script>` em templates. Para mais informações, consulte a página de [Segurança](best-practices/security).

## Próximos passos

Você também pode estar interessado no seguinte:

| Tópicos                                                                      | Detalhes                                                                                 |
| :-------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------- |
| [Binding de texto, propriedades e atributos dinâmicos](guide/templates/binding) | Vincular dados dinâmicos a texto, propriedades e atributos.                                   |
| [Adicionando event listeners](guide/templates/event-listeners)                   | Responder a eventos em seus templates.                                                    |
| [Two-way binding](guide/templates/two-way-binding)                          | Vincular simultaneamente um valor e propagar mudanças.                                     |
| [Control flow](guide/templates/control-flow)                                | Mostrar, ocultar e repetir elementos condicionalmente.                                           |
| [Pipes](guide/templates/pipes)                                              | Transformar dados declarativamente.                                                           |
| [Inserindo conteúdo filho com ng-content](guide/templates/ng-content)        | Controlar como components renderizam conteúdo.                                                  |
| [Criar fragmentos de template com ng-template](guide/templates/ng-template)   | Declarar um fragmento de template.                                                            |
| [Agrupando elementos com ng-container](guide/templates/ng-container)         | Agrupar múltiplos elementos juntos ou marcar uma localização para renderização.                      |
| [Variáveis em templates](guide/templates/variables)                         | Aprender sobre declarações de variáveis.                                                      |
| [Carregamento diferido com @defer](guide/templates/defer)                       | Criar views diferíveis com `@defer`.                                                  |
| [Sintaxe de expressão](guide/templates/expression-syntax)                      | Aprender semelhanças e diferenças entre expressões Angular e JavaScript padrão. |
| [Whitespace em templates](guide/templates/whitespace)                       | Aprender como o Angular lida com whitespace.                                                   |
