<!-- ia-translate: true -->
# Construindo um formulário template-driven

Este tutorial mostra como criar um formulário template-driven. Os elementos de controle no formulário são vinculados a propriedades de dados que possuem validação de entrada. A validação de entrada ajuda a manter a integridade dos dados e o estilo melhora a experiência do usuário.

Formulários template-driven usam [vinculação de dados bidirecional](guide/templates/two-way-binding) para atualizar o modelo de dados no component conforme as alterações são feitas no template e vice-versa.

<docs-callout helpful title="Template vs Reactive forms">
Angular suporta duas abordagens de design para formulários interativos. Formulários template-driven permitem que você use directives específicas de formulário em seu template Angular. Formulários reactive fornecem uma abordagem orientada a modelo para construção de formulários.

Formulários template-driven são uma ótima escolha para formulários pequenos ou simples, enquanto formulários reactive são mais escaláveis e adequados para formulários complexos. Para uma comparação das duas abordagens, veja [Escolhendo uma abordagem](guide/forms#choosing-an-approach)
</docs-callout>

Você pode construir praticamente qualquer tipo de formulário com um template Angular — formulários de login, formulários de contato e praticamente qualquer formulário de negócios.
Você pode dispor os controles de forma criativa e vinculá-los aos dados no seu modelo de objeto.
Você pode especificar regras de validação e exibir erros de validação, permitir condicionalmente entrada de controles específicos, acionar feedback visual integrado e muito mais.

## Objetivos

Este tutorial ensina como fazer o seguinte:

- Construir um formulário Angular com um component e template
- Usar `ngModel` para criar vinculações de dados bidirecionais para leitura e escrita de valores de controle de entrada
- Fornecer feedback visual usando classes CSS especiais que rastreiam o estado dos controles
- Exibir erros de validação aos usuários e permitir condicionalmente entrada de controles de formulário com base no status do formulário
- Compartilhar informações entre elementos HTML usando [variáveis de referência de template](guide/templates/variables#template-reference-variables)

## Construir um formulário template-driven

Formulários template-driven dependem de directives definidas no `FormsModule`.

| Directives     | Detalhes                                                                                                                                                                                                                                                                         |
| :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `NgModel`      | Reconcilia mudanças de valor no elemento de formulário anexado com mudanças no modelo de dados, permitindo que você responda à entrada do usuário com validação de entrada e tratamento de erros.                                                                                           |
| `NgForm`       | Cria uma instância `FormGroup` de nível superior e a vincula a um elemento `<form>` para rastrear o valor agregado do formulário e o status de validação. Assim que você importa o `FormsModule`, esta directive se torna ativa por padrão em todas as tags `<form>`. Você não precisa adicionar um seletor especial. |
| `NgModelGroup` | Cria e vincula uma instância `FormGroup` a um elemento DOM.                                                                                                                                                                                                                      |

### Visão geral das etapas

No decorrer deste tutorial, você vincula um formulário de exemplo aos dados e lida com a entrada do usuário usando as seguintes etapas.

1. Construir o formulário básico.
   - Definir um modelo de dados de exemplo
   - Incluir a infraestrutura necessária, como o `FormsModule`
1. Vincular controles de formulário a propriedades de dados usando a directive `ngModel` e a sintaxe de vinculação de dados bidirecional.
   - Examinar como `ngModel` relata estados de controle usando classes CSS
   - Nomear controles para torná-los acessíveis ao `ngModel`
1. Rastrear a validade de entrada e o status do controle usando `ngModel`.
   - Adicionar CSS personalizado para fornecer feedback visual sobre o status
   - Mostrar e ocultar mensagens de erro de validação
1. Responder a um evento de clique de botão HTML nativo adicionando aos dados do modelo.
1. Lidar com o envio do formulário usando a propriedade de output [`ngSubmit`](api/forms/NgForm#properties) do formulário.
   - Desabilitar o botão **Submit** até que o formulário seja válido
   - Após o envio, trocar o formulário concluído por conteúdo diferente na página

## Construir o formulário

<!-- TODO: link to preview -->
<!-- <docs-code live/> -->

1. O aplicativo de exemplo fornecido cria a classe `Actor` que define o modelo de dados refletido no formulário.

<docs-code header="actor.ts" language="typescript" path="adev/src/content/examples/forms/src/app/actor.ts"/>

1. O layout e os detalhes do formulário são definidos na classe `ActorFormComponent`.

   <docs-code header="actor-form.component.ts (v1)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.ts" visibleRegion="v1"/>

   O valor do `selector` do component "app-actor-form" significa que você pode colocar este formulário em um template pai usando a tag `<app-actor-form>`.

2. O código a seguir cria uma nova instância de actor, para que o formulário inicial possa mostrar um actor de exemplo.

   <docs-code language="typescript" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.ts" language="typescript" visibleRegion="Marilyn"/>

   Esta demonstração usa dados fictícios para `model` e `skills`.
   Em um aplicativo real, você injetaria um service de dados para obter e salvar dados reais, ou exporia essas propriedades como inputs e outputs.

3. O component habilita o recurso de Forms importando o módulo `FormsModule`.

   <docs-code language="typescript" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.ts" language="typescript" visibleRegion="imports"/>

4. O formulário é exibido no layout do aplicativo definido pelo template do component raiz.

   <docs-code header="src/app/app.component.html" language="html" path="adev/src/content/examples/forms/src/app/app.component.html"/>

   O template inicial define o layout para um formulário com dois grupos de formulário e um botão de envio.
   Os grupos de formulário correspondem a duas propriedades do modelo de dados Actor, name e studio.
   Cada grupo tem um rótulo e uma caixa para entrada do usuário.
   - O elemento de controle `<input>` de **Name** tem o atributo HTML5 `required`
   - O elemento de controle `<input>` de **Studio** não tem porque `studio` é opcional

   O botão **Submit** tem algumas classes nele para estilização.
   Neste ponto, o layout do formulário é todo HTML5 simples, sem vinculações ou directives.

5. O formulário de exemplo usa algumas classes de estilo do [Twitter Bootstrap](https://getbootstrap.com/css): `container`, `form-group`, `form-control` e `btn`.
   Para usar esses estilos, a folha de estilo do aplicativo importa a biblioteca.

<docs-code header="src/styles.css" path="adev/src/content/examples/forms/src/styles.1.css"/>

1. O formulário requer que a habilidade de um actor seja escolhida de uma lista predefinida de `skills` mantida internamente em `ActorFormComponent`.
   O loop `@for` do Angular itera sobre os valores de dados para preencher o elemento `<select>`.

<docs-code header="actor-form.component.html (skills)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="skills"/>

Se você executar o aplicativo agora, verá a lista de habilidades no controle de seleção.
Os elementos de entrada ainda não estão vinculados a valores de dados ou eventos, portanto ainda estão em branco e não têm comportamento.

## Vincular controles de entrada a propriedades de dados

O próximo passo é vincular os controles de entrada às propriedades `Actor` correspondentes com vinculação de dados bidirecional, para que eles respondam à entrada do usuário atualizando o modelo de dados e também respondam a mudanças programáticas nos dados atualizando a exibição.

A directive `ngModel` declarada no `FormsModule` permite vincular controles em seu formulário template-driven a propriedades em seu modelo de dados.
Quando você inclui a directive usando a sintaxe para vinculação de dados bidirecional, `[(ngModel)]`, o Angular pode rastrear o valor e a interação do usuário com o controle e manter a view sincronizada com o modelo.

1. Edite o arquivo de template `actor-form.component.html`.
1. Encontre a tag `<input>` ao lado do rótulo **Name**.
1. Adicione a directive `ngModel`, usando a sintaxe de vinculação de dados bidirecional `[(ngModel)]="..."`.

<docs-code header="actor-form.component.html (excerpt)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="ngModelName-1"/>

HELPFUL: Este exemplo tem uma interpolação de diagnóstico temporária após cada tag de entrada, `{{model.name}}`, para mostrar o valor de dados atual da propriedade correspondente. O comentário lembra você de remover as linhas de diagnóstico quando terminar de observar a vinculação de dados bidirecional em funcionamento.

### Acessar o status geral do formulário

Quando você importou o `FormsModule` em seu component, o Angular criou e anexou automaticamente uma directive [NgForm](api/forms/NgForm) à tag `<form>` no template (porque `NgForm` tem o seletor `form` que corresponde aos elementos `<form>`).

Para obter acesso ao `NgForm` e ao status geral do formulário, declare uma [variável de referência de template](guide/templates/variables#template-reference-variables).

1. Edite o arquivo de template `actor-form.component.html`.
1. Atualize a tag `<form>` com uma variável de referência de template, `#actorForm`, e defina seu valor da seguinte forma.

   <docs-code header="actor-form.component.html (excerpt)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="template-variable"/>

   A variável de template `actorForm` agora é uma referência à instância da directive `NgForm` que governa o formulário como um todo.

1. Execute o aplicativo.
1. Comece a digitar na caixa de entrada **Name**.

   Conforme você adiciona e exclui caracteres, pode vê-los aparecer e desaparecer do modelo de dados.

A linha de diagnóstico que mostra valores interpolados demonstra que os valores estão realmente fluindo da caixa de entrada para o modelo e de volta novamente.

### Nomear elementos de controle

Quando você usa `[(ngModel)]` em um elemento, deve definir um atributo `name` para esse elemento.
O Angular usa o nome atribuído para registrar o elemento com a directive `NgForm` anexada ao elemento pai `<form>`.

O exemplo adicionou um atributo `name` ao elemento `<input>` e o definiu como "name", o que faz sentido para o nome do actor.
Qualquer valor único serve, mas usar um nome descritivo é útil.

1. Adicione vinculações `[(ngModel)]` e atributos `name` similares a **Studio** e **Skill**.
1. Agora você pode remover as mensagens de diagnóstico que mostram valores interpolados.
1. Para confirmar que a vinculação de dados bidirecional funciona para todo o modelo de actor, adicione uma nova vinculação de texto com o pipe [`json`](api/common/JsonPipe) no topo do template do component, que serializa os dados para uma string.

Após essas revisões, o template do formulário deve se parecer com o seguinte:

<docs-code header="actor-form.component.html (excerpt)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="ngModel-2"/>

Você notará que:

- Cada elemento `<input>` tem uma propriedade `id`.
  Isso é usado pelo atributo `for` do elemento `<label>` para corresponder o rótulo ao seu controle de entrada.
  Este é um [recurso HTML padrão](https://developer.mozilla.org/docs/Web/HTML/Element/label).

- Cada elemento `<input>` também tem a propriedade `name` necessária que o Angular usa para registrar o controle com o formulário.

Quando você tiver observado os efeitos, pode excluir a vinculação de texto `{{ model | json }}`.

## Rastrear estados do formulário

O Angular aplica a classe `ng-submitted` aos elementos `form` após o formulário ter sido enviado. Esta classe pode ser usada para alterar o estilo do formulário após ele ter sido enviado.

## Rastrear estados do controle

Adicionar a directive `NgModel` a um controle adiciona nomes de classe ao controle que descrevem seu estado.
Essas classes podem ser usadas para alterar o estilo de um controle com base em seu estado.

A tabela a seguir descreve os nomes de classe que o Angular aplica com base no estado do controle.

| Estados                                  | Classe se verdadeiro | Classe se falso |
| :--------------------------------------- | :------------------- | :-------------- |
| O controle foi visitado.                 | `ng-touched`         | `ng-untouched`  |
| O valor do controle foi alterado.        | `ng-dirty`           | `ng-pristine`   |
| O valor do controle é válido.            | `ng-valid`           | `ng-invalid`    |

O Angular também aplica a classe `ng-submitted` aos elementos `form` após o envio,
mas não aos controles dentro do elemento `form`.

Você usa essas classes CSS para definir os estilos para seu controle com base em seu status.

### Observar estados do controle

Para ver como as classes são adicionadas e removidas pelo framework, abra as ferramentas de desenvolvedor do navegador e inspecione o elemento `<input>` que representa o nome do actor.

1. Usando as ferramentas de desenvolvedor do seu navegador, encontre o elemento `<input>` que corresponde à caixa de entrada **Name**.
   Você pode ver que o elemento tem várias classes CSS além de "form-control".

1. Quando você o abre pela primeira vez, as classes indicam que ele tem um valor válido, que o valor não foi alterado desde a inicialização ou redefinição, e que o controle não foi visitado desde a inicialização ou redefinição.

   <docs-code language="html">

   <input class="form-control ng-untouched ng-pristine ng-valid">;

   </docs-code>

1. Execute as seguintes ações na caixa `<input>` de **Name** e observe quais classes aparecem.
   - Olhe mas não toque.
     As classes indicam que está intocado, pristine e válido.

   - Clique dentro da caixa de nome, depois clique fora dela.
     O controle foi visitado agora, e o elemento tem a classe `ng-touched` em vez da classe `ng-untouched`.

   - Adicione barras ao final do nome.
     Agora está touched e dirty.

   - Apague o nome.
     Isso torna o valor inválido, então a classe `ng-invalid` substitui a classe `ng-valid`.

### Criar feedback visual para estados

O par `ng-valid`/`ng-invalid` é particularmente interessante, porque você quer enviar um
sinal visual forte quando os valores são inválidos.
Você também quer marcar campos obrigatórios.

Você pode marcar campos obrigatórios e dados inválidos ao mesmo tempo com uma barra colorida
à esquerda da caixa de entrada.

Para alterar a aparência dessa forma, execute as seguintes etapas.

1. Adicione definições para as classes CSS `ng-*`.
1. Adicione essas definições de classe a um novo arquivo `forms.css`.
1. Adicione o novo arquivo ao projeto como irmão de `index.html`:

<docs-code header="src/assets/forms.css" language="css" path="adev/src/content/examples/forms/src/assets/forms.css"/>

1. No arquivo `index.html`, atualize a tag `<head>` para incluir a nova folha de estilo.

<docs-code header="src/index.html (styles)" path="adev/src/content/examples/forms/src/index.html" visibleRegion="styles"/>

### Mostrar e ocultar mensagens de erro de validação

A caixa de entrada **Name** é obrigatória e limpá-la deixa a barra vermelha.
Isso indica que algo está errado, mas o usuário não sabe o que está errado ou o que fazer a respeito.
Você pode fornecer uma mensagem útil verificando e respondendo ao estado do controle.

A caixa de seleção **Skill** também é obrigatória, mas não precisa desse tipo de tratamento de erro porque a caixa de seleção já restringe a seleção a valores válidos.

Para definir e mostrar uma mensagem de erro quando apropriado, execute as seguintes etapas.

<docs-workflow>
<docs-step title="Adicionar uma referência local à entrada">
Estenda a tag `input` com uma variável de referência de template que você pode usar para acessar o controle Angular da caixa de entrada de dentro do template. No exemplo, a variável é `#name="ngModel"`.

A variável de referência de template (`#name`) é definida como `"ngModel"` porque esse é o valor da propriedade [`NgModel.exportAs`](api/core/Directive#exportAs). Esta propriedade diz ao Angular como vincular uma variável de referência a uma directive.
</docs-step>

<docs-step title="Adicionar a mensagem de erro">
Adicione um `<div>` que contém uma mensagem de erro adequada.
</docs-step>

<docs-step title="Tornar a mensagem de erro condicional">
Mostre ou oculte a mensagem de erro vinculando propriedades do controle `name` à propriedade `hidden` do elemento `<div>` da mensagem.
</docs-step>

<docs-code header="actor-form.component.html (hidden-error-msg)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="hidden-error-msg"/>

<docs-step title="Adicionar uma mensagem de erro condicional ao name">
Adicione uma mensagem de erro condicional à caixa de entrada `name`, como no exemplo a seguir.

<docs-code header="actor-form.component.html (excerpt)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="name-with-error-msg"/>
</docs-step>
</docs-workflow>

<docs-callout title='Ilustrando o estado "pristine"'>

Neste exemplo, você oculta a mensagem quando o controle está válido ou _pristine_.
Pristine significa que o usuário não alterou o valor desde que foi exibido neste formulário.
Se você ignorar o estado `pristine`, ocultará a mensagem apenas quando o valor for válido.
Se você chegar neste component com um novo actor em branco ou um actor inválido, verá a mensagem de erro imediatamente, antes de ter feito qualquer coisa.

Você pode querer que a mensagem seja exibida apenas quando o usuário fizer uma alteração inválida.
Ocultar a mensagem enquanto o controle está no estado `pristine` alcança esse objetivo.
Você verá a importância dessa escolha quando adicionar um novo actor ao formulário na próxima etapa.

</docs-callout>

## Adicionar um novo actor

Este exercício mostra como você pode responder a um evento de clique de botão HTML nativo adicionando aos dados do modelo.
Para permitir que os usuários do formulário adicionem um novo actor, você adicionará um botão **New Actor** que responde a um evento de clique.

1. No template, coloque um elemento `<button>` "New Actor" na parte inferior do formulário.
1. No arquivo do component, adicione o método de criação de actor ao modelo de dados de actor.

<docs-code header="actor-form.component.ts (New Actor method)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.ts" visibleRegion="new-actor"/>

1. Vincule o evento de clique do botão a um método de criação de actor, `newActor()`.

<docs-code header="actor-form.component.html (New Actor button)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="new-actor-button-no-reset"/>

1. Execute o aplicativo novamente e clique no botão **New Actor**.

   O formulário é limpo e as barras _obrigatórias_ à esquerda da caixa de entrada ficam vermelhas, indicando propriedades `name` e `skill` inválidas.
   Observe que as mensagens de erro estão ocultas.
   Isso ocorre porque o formulário está pristine; você ainda não alterou nada.

1. Digite um nome e clique em **New Actor** novamente.

   Agora o aplicativo exibe uma mensagem de erro `Name is required`, porque a caixa de entrada não está mais pristine.
   O formulário lembra que você digitou um nome antes de clicar em **New Actor**.

1. Para restaurar o estado pristine dos controles do formulário, limpe todos os flags imperativamente chamando o método `reset()` do formulário após chamar o método `newActor()`.

   <docs-code header="actor-form.component.html (Reset the form)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="new-actor-button-form-reset"/>

   Agora clicar em **New Actor** redefine tanto o formulário quanto seus flags de controle.

## Enviar o formulário com `ngSubmit`

O usuário deve ser capaz de enviar este formulário depois de preenchê-lo.
O botão **Submit** na parte inferior do formulário não faz nada por si só, mas aciona um evento de envio de formulário por causa de seu tipo (`type="submit"`).

Para responder a este evento, execute as seguintes etapas.

<docs-workflow>

<docs-step title="Escutar ngOnSubmit">
Vincule a propriedade de evento [`ngSubmit`](api/forms/NgForm#properties) do formulário ao método `onSubmit()` do component actor-form.

<docs-code header="actor-form.component.html (ngSubmit)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="ngSubmit"/>
</docs-step>

<docs-step title="Vincular a propriedade disabled">
Use a variável de referência de template, `#actorForm` para acessar o formulário que contém o botão **Submit** e criar uma vinculação de evento.

Você vinculará a propriedade do formulário que indica sua validade geral à propriedade `disabled` do botão **Submit**.

<docs-code header="actor-form.component.html (submit-button)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="submit-button"/>
</docs-step>

<docs-step title="Executar o aplicativo">
Observe que o botão está habilitado — embora ainda não faça nada útil.
</docs-step>

<docs-step title="Excluir o valor Name">
Isso viola a regra "obrigatória", então exibe a mensagem de erro — e observe que também desabilita o botão **Submit**.

Você não precisou conectar explicitamente o estado habilitado do botão à validade do formulário.
O `FormsModule` fez isso automaticamente quando você definiu uma variável de referência de template no elemento de formulário aprimorado, depois referenciou essa variável no controle do botão.
</docs-step>
</docs-workflow>

### Responder ao envio do formulário

Para mostrar uma resposta ao envio do formulário, você pode ocultar a área de entrada de dados e exibir outra coisa em seu lugar.

<docs-workflow>
<docs-step title="Encapsular o formulário">
Envolva todo o formulário em um `<div>` e vincule sua propriedade `hidden` à propriedade `ActorFormComponent.submitted`.

<docs-code header="actor-form.component.html (excerpt)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="edit-div"/>

O formulário principal está visível desde o início porque a propriedade `submitted` é false até que você envie o formulário, como este fragmento do `ActorFormComponent` mostra:

<docs-code header="actor-form.component.ts (submitted)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.ts" visibleRegion="submitted"/>

Quando você clica no botão **Submit**, o flag `submitted` se torna true e o formulário desaparece.
</docs-step>

<docs-step title="Adicionar o estado submitted">
Para mostrar outra coisa enquanto o formulário está no estado submitted, adicione o seguinte HTML abaixo do novo wrapper `<div>`.

<docs-code header="actor-form.component.html (excerpt)" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="submitted"/>

Este `<div>`, que mostra um actor somente leitura com vinculações de interpolação, aparece apenas enquanto o component está no estado submitted.

A exibição alternativa inclui um botão _Edit_ cujo evento de clique está vinculado a uma expressão que limpa o flag `submitted`.
</docs-step>

<docs-step title="Testar o botão Edit">
Clique no botão *Edit* para alternar a exibição de volta para o formulário editável.
</docs-step>
</docs-workflow>

## Resumo

O formulário Angular discutido nesta página aproveita os seguintes
recursos do framework para fornecer suporte para modificação de dados, validação e muito mais.

- Um template de formulário HTML do Angular
- Uma classe component de formulário com um decorator `@Component`
- Manipulação de envio de formulário vinculando à propriedade de evento `NgForm.ngSubmit`
- Variáveis de referência de template como `#actorForm` e `#name`
- Sintaxe `[(ngModel)]` para vinculação de dados bidirecional
- O uso de atributos `name` para validação e rastreamento de alteração de elemento de formulário
- A propriedade `valid` da variável de referência em controles de entrada indica se um controle é válido ou deve mostrar mensagens de erro
- Controlar o estado habilitado do botão **Submit** vinculando à validade do `NgForm`
- Classes CSS personalizadas que fornecem feedback visual aos usuários sobre controles que não são válidos

Aqui está o código para a versão final do aplicativo:

<docs-code-multifile>
    <docs-code header="actor-form.component.ts" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.ts" visibleRegion="final"/>
    <docs-code header="actor-form.component.html" path="adev/src/content/examples/forms/src/app/actor-form/actor-form.component.html" visibleRegion="final"/>
    <docs-code header="actor.ts" path="adev/src/content/examples/forms/src/app/actor.ts"/>
    <docs-code header="app.component.html" path="adev/src/content/examples/forms/src/app/app.component.html"/>
    <docs-code header="app.component.ts" path="adev/src/content/examples/forms/src/app/app.component.ts"/>
    <docs-code header="main.ts" path="adev/src/content/examples/forms/src/main.ts"/>
    <docs-code header="forms.css" path="adev/src/content/examples/forms/src/assets/forms.css"/>
</docs-code-multifile>
