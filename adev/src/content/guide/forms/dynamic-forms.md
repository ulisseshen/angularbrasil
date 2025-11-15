<!-- ia-translate: true -->
# Construindo formulários dinâmicos

Muitos formulários, como questionários, podem ser muito semelhantes entre si em formato e intenção.
Para tornar mais rápido e fácil gerar diferentes versões de tal formulário, você pode criar um _template de formulário dinâmico_ baseado em metadados que descrevem o modelo de objeto de negócio.
Em seguida, use o template para gerar novos formulários automaticamente, de acordo com as mudanças no modelo de dados.

A técnica é particularmente útil quando você tem um tipo de formulário cujo conteúdo deve mudar frequentemente para atender a requisitos de negócio e regulatórios em rápida mudança.
Um caso de uso típico é um questionário.
Você pode precisar obter entrada de usuários em diferentes contextos.
O formato e o estilo dos formulários que um usuário vê devem permanecer constantes, enquanto as perguntas reais que você precisa fazer variam com o contexto.

Neste tutorial você construirá um formulário dinâmico que apresenta um questionário básico.
Você constrói um aplicativo online para heróis que buscam emprego.
A agência está constantemente ajustando o processo de inscrição, mas usando o formulário dinâmico
você pode criar os novos formulários dinamicamente sem alterar o código do aplicativo.

O tutorial orienta você através das seguintes etapas.

1. Habilitar reactive forms para um projeto.
1. Estabelecer um modelo de dados para representar controles de formulário.
1. Preencher o modelo com dados de exemplo.
1. Desenvolver um component para criar controles de formulário dinamicamente.

O formulário que você cria usa validação de entrada e estilização para melhorar a experiência do usuário.
Ele tem um botão Submit que só é habilitado quando toda a entrada do usuário é válida, e sinaliza entrada inválida com codificação de cores e mensagens de erro.

A versão básica pode evoluir para suportar uma variedade mais rica de perguntas, renderização mais elegante e experiência de usuário superior.

## Habilitar reactive forms para seu projeto

Formulários dinâmicos são baseados em reactive forms.

Para dar ao aplicativo acesso às directives de reactive forms, importe `ReactiveFormsModule` da biblioteca `@angular/forms` nos components necessários.

<docs-code-multifile>
    <docs-code header="dynamic-form.component.ts" path="adev/src/content/examples/dynamic-form/src/app/dynamic-form.component.ts"/>
    <docs-code header="dynamic-form-question.component.ts" path="adev/src/content/examples/dynamic-form/src/app/dynamic-form-question.component.ts"/>
</docs-code-multifile>

## Criar um modelo de objeto de formulário

Um formulário dinâmico requer um modelo de objeto que possa descrever todos os cenários necessários pela funcionalidade do formulário.
O formulário de exemplo de aplicação de herói é um conjunto de perguntas — isto é, cada controle no formulário deve fazer uma pergunta e aceitar uma resposta.

O modelo de dados para este tipo de formulário deve representar uma pergunta.
O exemplo inclui o `DynamicFormQuestionComponent`, que define uma pergunta como o objeto fundamental no modelo.

A seguinte `QuestionBase` é uma classe base para um conjunto de controles que podem representar a pergunta e sua resposta no formulário.

<docs-code header="question-base.ts" path="adev/src/content/examples/dynamic-form/src/app/question-base.ts"/>

### Definir classes de controle

A partir desta base, o exemplo deriva duas novas classes, `TextboxQuestion` e `DropdownQuestion`, que representam diferentes tipos de controle.
Quando você criar o template do formulário no próximo passo, você instanciará esses tipos de pergunta específicos para renderizar os controles apropriados dinamicamente.

O tipo de controle `TextboxQuestion` é representado em um template de formulário usando um elemento `<input>`. Ele apresenta uma pergunta e permite que os usuários insiram entrada. O atributo `type` do elemento é definido com base no campo `type` especificado no argumento `options` (por exemplo `text`, `email`, `url`).

<docs-code header="question-textbox.ts" path="adev/src/content/examples/dynamic-form/src/app/question-textbox.ts"/>

O tipo de controle `DropdownQuestion` apresenta uma lista de escolhas em uma caixa de seleção.

 <docs-code header="question-dropdown.ts" path="adev/src/content/examples/dynamic-form/src/app/question-dropdown.ts"/>

### Compor grupos de formulário

Um formulário dinâmico usa um service para criar conjuntos agrupados de controles de entrada, baseados no modelo de formulário.
O seguinte `QuestionControlService` coleta um conjunto de instâncias `FormGroup` que consomem os metadados do modelo de pergunta.
Você pode especificar valores padrão e regras de validação.

<docs-code header="question-control.service.ts" path="adev/src/content/examples/dynamic-form/src/app/question-control.service.ts"/>

## Compor conteúdo de formulário dinâmico

O formulário dinâmico em si é representado por um component contêiner, que você adiciona em uma etapa posterior.
Cada pergunta é representada no template do component do formulário por uma tag `<app-question>`, que corresponde a uma instância de `DynamicFormQuestionComponent`.

O `DynamicFormQuestionComponent` é responsável por renderizar os detalhes de uma pergunta individual com base nos valores no objeto de pergunta vinculado aos dados.
O formulário depende de uma [directive `[formGroup]`](api/forms/FormGroupDirective 'API reference') para conectar o HTML do template aos objetos de controle subjacentes.
O `DynamicFormQuestionComponent` cria grupos de formulário e os preenche com controles definidos no modelo de pergunta, especificando regras de exibição e validação.

<docs-code-multifile>
  <docs-code header="dynamic-form-question.component.html" path="adev/src/content/examples/dynamic-form/src/app/dynamic-form-question.component.html"/>
  <docs-code header="dynamic-form-question.component.ts" path="adev/src/content/examples/dynamic-form/src/app/dynamic-form-question.component.ts"/>
</docs-code-multifile>

O objetivo do `DynamicFormQuestionComponent` é apresentar tipos de pergunta definidos em seu modelo.
Você tem apenas dois tipos de perguntas neste ponto, mas pode imaginar muitos mais.
O bloco `@switch` no template determina qual tipo de pergunta exibir.
O switch usa directives com os seletores [`formControlName`](api/forms/FormControlName 'FormControlName directive API reference') e [`formGroup`](api/forms/FormGroupDirective 'FormGroupDirective API reference').
Ambas as directives são definidas em `ReactiveFormsModule`.

### Fornecer dados

Outro service é necessário para fornecer um conjunto específico de perguntas a partir das quais construir um formulário individual.
Para este exercício, você cria o `QuestionService` para fornecer este array de perguntas a partir dos dados de exemplo codificados.
Em um aplicativo do mundo real, o service pode buscar dados de um sistema backend.
O ponto chave, no entanto, é que você controla as perguntas de inscrição de emprego de herói inteiramente através dos objetos retornados de `QuestionService`.
Para manter o questionário conforme os requisitos mudam, você só precisa adicionar, atualizar e remover objetos do array `questions`.

O `QuestionService` fornece um conjunto de perguntas na forma de um array vinculado ao `input()` questions.

<docs-code header="question.service.ts" path="adev/src/content/examples/dynamic-form/src/app/question.service.ts"/>

## Criar um template de formulário dinâmico

O component `DynamicFormComponent` é o ponto de entrada e o contêiner principal para o formulário, que é representado usando `<app-dynamic-form>` em um template.

O component `DynamicFormComponent` apresenta uma lista de perguntas vinculando cada uma a um elemento `<app-question>` que corresponde ao `DynamicFormQuestionComponent`.

<docs-code-multifile>
    <docs-code header="dynamic-form.component.html" path="adev/src/content/examples/dynamic-form/src/app/dynamic-form.component.html"/>
    <docs-code header="dynamic-form.component.ts" path="adev/src/content/examples/dynamic-form/src/app/dynamic-form.component.ts"/>
</docs-code-multifile>

### Exibir o formulário

Para exibir uma instância do formulário dinâmico, o template shell do `AppComponent` passa o array `questions` retornado pelo `QuestionService` para o component contêiner do formulário, `<app-dynamic-form>`.

<docs-code header="app.component.ts" path="adev/src/content/examples/dynamic-form/src/app/app.component.ts"/>

Esta separação de modelo e dados permite reutilizar os components para qualquer tipo de pesquisa, desde que seja compatível com o modelo de objeto _question_.

### Garantir dados válidos

O template do formulário usa vinculação de dados dinâmica de metadados para renderizar o formulário sem fazer suposições codificadas sobre perguntas específicas.
Ele adiciona tanto metadados de controle quanto critérios de validação dinamicamente.

Para garantir entrada válida, o botão _Save_ é desabilitado até que o formulário esteja em um estado válido.
Quando o formulário está válido, clique em _Save_ e o aplicativo renderiza os valores atuais do formulário como JSON.

A figura a seguir mostra o formulário final.

<img alt="Dynamic-Form" src="assets/images/guide/dynamic-form/dynamic-form.png">

## Próximos passos

<docs-pill-row>
  <docs-pill title="Validating form input" href="guide/forms/reactive-forms#validating-form-input" />
  <docs-pill title="Form validation guide" href="guide/forms/form-validation" />
</docs-pill-row>
