<!-- ia-translate: true -->

# Reactive forms

Reactive forms fornecem uma abordagem model-driven para lidar com entradas de formulário cujos valores mudam ao longo do tempo.
Este guia mostra como criar e atualizar um form control básico, progredir para o uso de vários controls em um grupo, validar valores de formulário e criar formulários dinâmicos onde você pode adicionar ou remover controls em tempo de execução.

## Visão geral de reactive forms

Reactive forms usam uma abordagem explícita e imutável para gerenciar o estado de um formulário em um determinado momento.
Cada mudança no estado do formulário retorna um novo estado, que mantém a integridade do modelo entre as mudanças.
Reactive forms são construídos em torno de observable streams, onde entradas e valores de formulário são fornecidos como streams de valores de entrada, que podem ser acessados de forma síncrona.

Reactive forms também fornecem um caminho direto para testes porque você tem a garantia de que seus dados são consistentes e previsíveis quando solicitados.
Quaisquer consumidores dos streams têm acesso para manipular esses dados com segurança.

Reactive forms diferem de [template-driven forms](guide/forms/template-driven-forms) de maneiras distintas.
Reactive forms fornecem acesso síncrono ao data model, imutabilidade com operadores observable e rastreamento de mudanças através de observable streams.

Template-driven forms permitem acesso direto para modificar dados no seu template, mas são menos explícitos do que reactive forms porque dependem de directives incorporadas no template, juntamente com dados mutáveis para rastrear mudanças de forma assíncrona.
Consulte a [Visão Geral de Forms](guide/forms) para comparações detalhadas entre os dois paradigmas.

## Adicionando um form control básico

Existem três etapas para usar form controls.

1. Gere um novo component e registre o módulo de reactive forms. Este módulo declara as directives de reactive-form que você precisa para usar reactive forms.
1. Instancie um novo `FormControl`.
1. Registre o `FormControl` no template.

Você pode então exibir o formulário adicionando o component ao template.

Os exemplos a seguir mostram como adicionar um único form control.
No exemplo, o usuário insere seu nome em um campo de entrada, captura esse valor de entrada e exibe o valor atual do elemento form control.

<docs-workflow>

<docs-step title="Gere um novo component e importe o ReactiveFormsModule">
Use o comando CLI `ng generate component` para gerar um component no seu projeto e importe `ReactiveFormsModule` do pacote `@angular/forms` e adicione-o ao array `imports` do seu Component.

<docs-code header="name-editor.component.ts (excerpt)" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.ts" visibleRegion="imports" />
</docs-step>

<docs-step title="Declare uma instância FormControl">
Use o construtor de `FormControl` para definir seu valor inicial, que neste caso é uma string vazia. Ao criar esses controls na classe do seu component, você obtém acesso imediato para ouvir, atualizar e validar o estado da entrada de formulário.

<docs-code header="name-editor.component.ts" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.ts" visibleRegion="create-control"/>
</docs-step>

<docs-step title="Registre o control no template">
Depois de criar o control na classe do component, você deve associá-lo a um elemento form control no template. Atualize o template com o form control usando o binding `formControl` fornecido por `FormControlDirective`, que também está incluído no `ReactiveFormsModule`.

<docs-code header="name-editor.component.html" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.html" visibleRegion="control-binding" />

Usando a sintaxe de template binding, o form control agora está registrado no elemento de entrada `name` no template. O form control e o elemento DOM se comunicam entre si: a view reflete mudanças no model e o model reflete mudanças na view.
</docs-step>

<docs-step title="Exiba o component">
O `FormControl` atribuído à propriedade `name` é exibido quando o component `<app-name-editor>` é adicionado a um template.

<docs-code header="src/app/app.component.html (name editor)" path="adev/src/content/examples/reactive-forms/src/app/app.component.1.html" visibleRegion="app-name-editor"/>
</docs-step>
</docs-workflow>

### Exibindo o valor de um form control

Você pode exibir o valor das seguintes maneiras.

- Através do observable `valueChanges`, onde você pode ouvir mudanças no valor do formulário no template usando `AsyncPipe` ou na classe do component usando o método `subscribe()`
- Com a propriedade `value`, que fornece um snapshot do valor atual

O exemplo a seguir mostra como exibir o valor atual usando interpolação no template.

<docs-code header="name-editor.component.html (control value)" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.html" visibleRegion="display-value"/>

O valor exibido muda conforme você atualiza o elemento form control.

Reactive forms fornecem acesso a informações sobre um determinado control através de propriedades e métodos fornecidos com cada instância.
Essas propriedades e métodos da classe subjacente [AbstractControl](api/forms/AbstractControl 'API reference') são usados para controlar o estado do formulário e determinar quando exibir mensagens ao lidar com [validação de entrada](#validating-form-input).

Leia sobre outras propriedades e métodos de `FormControl` na [Referência da API](api/forms/FormControl 'Detailed syntax reference').

### Substituindo o valor de um form control

Reactive forms têm métodos para alterar o valor de um control programaticamente, o que oferece a flexibilidade de atualizar o valor sem interação do usuário.
Uma instância de form control fornece um método `setValue()` que atualiza o valor do form control e valida a estrutura do valor fornecido em relação à estrutura do control.
Por exemplo, ao recuperar dados de formulário de uma API ou serviço de backend, use o método `setValue()` para atualizar o control com seu novo valor, substituindo o valor antigo inteiramente.

O exemplo a seguir adiciona um método à classe do component para atualizar o valor do control para _Nancy_ usando o método `setValue()`.

<docs-code header="name-editor.component.ts (update value)" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.ts" visibleRegion="update-value"/>

Atualize o template com um botão para simular uma atualização de nome.
Quando você clica no botão **Update Name**, o valor inserido no elemento form control é refletido como seu valor atual.

<docs-code header="name-editor.component.html (update value)" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.html" visibleRegion="update-value"/>

O form model é a fonte da verdade para o control, então quando você clica no botão, o valor da entrada é alterado dentro da classe do component, sobrescrevendo seu valor atual.

HELPFUL: Neste exemplo, você está usando um único control.
Ao usar o método `setValue()` com um form group ou form array, o valor precisa corresponder à estrutura do grupo ou array.

## Agrupando form controls

Os formulários normalmente contêm vários controls relacionados.
Reactive forms fornecem duas maneiras de agrupar vários controls relacionados em um único formulário de entrada.

| Form groups | Detalhes                                                                                                                                                                                                                                                                         |
| :---------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Form group  | Define um formulário com um conjunto fixo de controls que você pode gerenciar juntos. Os fundamentos do form group são discutidos nesta seção. Você também pode [aninhar form groups](#creating-nested-form-groups) para criar formulários mais complexos.                       |
| Form array  | Define um formulário dinâmico, onde você pode adicionar e remover controls em tempo de execução. Você também pode aninhar form arrays para criar formulários mais complexos. Para mais sobre esta opção, consulte [Criando formulários dinâmicos](#criando-formulrios-dinmicos). |

Assim como uma instância de form control oferece controle sobre um único campo de entrada, uma instância de form group rastreia o estado do formulário de um grupo de instâncias de form control \(por exemplo, um formulário\).
Cada control em uma instância de form group é rastreado por nome ao criar o form group.
O exemplo a seguir mostra como gerenciar várias instâncias de form control em um único grupo.

Gere um component `ProfileEditor` e importe as classes `FormGroup` e `FormControl` do pacote `@angular/forms`.

<docs-code language="shell">
ng generate component ProfileEditor
</docs-code>

<docs-code header="profile-editor.component.ts (imports)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" visibleRegion="imports"/>

Para adicionar um form group a este component, siga as seguintes etapas.

1. Crie uma instância `FormGroup`.
1. Associe o model `FormGroup` e a view.
1. Salve os dados do formulário.

<docs-workflow>

<docs-step title="Crie uma instância FormGroup">
Crie uma propriedade na classe do component chamada `profileForm` e defina a propriedade como uma nova instância de form group. Para inicializar o form group, forneça ao construtor um objeto de chaves nomeadas mapeadas para seus controls.

Para o formulário de perfil, adicione duas instâncias de form control com os nomes `firstName` e `lastName`

<docs-code header="profile-editor.component.ts (form group)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" visibleRegion="formgroup"/>

Os form controls individuais agora estão coletados dentro de um grupo. Uma instância `FormGroup` fornece seu valor de modelo como um objeto reduzido dos valores de cada control no grupo. Uma instância de form group tem as mesmas propriedades (como `value` e `untouched`) e métodos (como `setValue()`) que uma instância de form control.
</docs-step>

<docs-step title="Associe o model FormGroup e a view">
Um form group rastreia o status e as mudanças de cada um de seus controls, portanto, se um dos controls mudar, o control pai também emite um novo status ou mudança de valor. O model para o grupo é mantido a partir de seus membros. Depois de definir o model, você deve atualizar o template para refletir o model na view.

<docs-code header="profile-editor.component.html (template form group)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.html" visibleRegion="formgroup"/>

Assim como um form group contém um grupo de controls, o `FormGroup` _profileForm_ é vinculado ao elemento `form` com a directive `FormGroup`, criando uma camada de comunicação entre o model e o formulário contendo as entradas. A entrada `formControlName` fornecida pela directive `FormControlName` vincula cada entrada individual ao form control definido no `FormGroup`. Os form controls se comunicam com seus respectivos elementos. Eles também comunicam mudanças à instância do form group, que fornece a fonte da verdade para o valor do modelo.
</docs-step>

<docs-step title="Salve os dados do formulário">
O component `ProfileEditor` aceita entrada do usuário, mas em um cenário real você deseja capturar o valor do formulário e disponibilizá-lo para processamento adicional fora do component. A directive `FormGroup` escuta o evento `submit` emitido pelo elemento `form` e emite um evento `ngSubmit` ao qual você pode vincular uma função de callback. Adicione um event listener `ngSubmit` à tag `form` com o método de callback `onSubmit()`.

<docs-code header="profile-editor.component.html (submit event)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.html" visibleRegion="ng-submit"/>

O método `onSubmit()` no component `ProfileEditor` captura o valor atual de `profileForm`. Use `EventEmitter` para manter o formulário encapsulado e fornecer o valor do formulário fora do component. O exemplo a seguir usa `console.warn` para registrar uma mensagem no console do navegador.

<docs-code header="profile-editor.component.ts (submit method)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" visibleRegion="on-submit"/>

O evento `submit` é emitido pela tag `form` usando o evento DOM nativo. Você aciona o evento clicando em um botão com tipo `submit`. Isso permite que o usuário pressione a tecla **Enter** para enviar o formulário concluído.

Use um elemento `button` para adicionar um botão na parte inferior do formulário para acionar o envio do formulário.

<docs-code header="profile-editor.component.html (submit button)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.html" visibleRegion="submit-button"/>

O botão no trecho anterior também tem um binding `disabled` anexado a ele para desabilitar o botão quando `profileForm` for inválido. Você ainda não está executando nenhuma validação, então o botão está sempre ativado. A validação básica de formulário é abordada na seção [Validando entrada de formulário](#validating-form-input).
</docs-step>

<docs-step title="Exiba o component">
Para exibir o component `ProfileEditor` que contém o formulário, adicione-o a um template de component.

<docs-code header="app.component.html (profile editor)" path="adev/src/content/examples/reactive-forms/src/app/app.component.1.html" visibleRegion="app-profile-editor"/>

`ProfileEditor` permite que você gerencie as instâncias de form control para os controls `firstName` e `lastName` dentro da instância do form group.

### Criando form groups aninhados

Form groups podem aceitar tanto instâncias individuais de form control quanto outras instâncias de form group como filhos.
Isso torna a composição de modelos de formulário complexos mais fácil de manter e agrupar logicamente.

Ao construir formulários complexos, gerenciar as diferentes áreas de informação é mais fácil em seções menores.
Usar uma instância de form group aninhado permite que você divida form groups grandes em grupos menores e mais gerenciáveis.

Para criar formulários mais complexos, use as seguintes etapas.

1. Crie um grupo aninhado.
1. Agrupe o formulário aninhado no template.

Alguns tipos de informação naturalmente se enquadram no mesmo grupo.
Um nome e endereço são exemplos típicos de tais grupos aninhados e são usados nos exemplos a seguir.

<docs-workflow>
<docs-step title="Crie um grupo aninhado {#grouping-form-controls}">
Para criar um grupo aninhado em `profileForm`, adicione um elemento `address` aninhado à instância do form group.

<docs-code header="profile-editor.component.ts (nested form group)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" visibleRegion="nested-formgroup"/>

Neste exemplo, `address group` combina os controls atuais `firstName` e `lastName` com os novos controls `street`, `city`, `state` e `zip`. Embora o elemento `address` no form group seja um filho do elemento `profileForm` geral no form group, as mesmas regras se aplicam com mudanças de valor e status. As mudanças no status e valor do form group aninhado se propagam para o form group pai, mantendo a consistência com o modelo geral.
</docs-step>

<docs-step title="Agrupe o formulário aninhado no template">
Depois de atualizar o model na classe do component, atualize o template para conectar a instância do form group e seus elementos de entrada. Adicione o form group `address` contendo os campos `street`, `city`, `state` e `zip` ao template `ProfileEditor`.

<docs-code header="profile-editor.component.html (template nested form group)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.html" visibleRegion="formgroupname"/>

O formulário `ProfileEditor` é exibido como um grupo, mas o modelo é dividido ainda mais para representar as áreas de agrupamento lógico.

Exiba o valor da instância do form group no template do component usando a propriedade `value` e `JsonPipe`.
</docs-step>
</docs-workflow>

### Atualizando partes do data model

Ao atualizar o valor de uma instância de form group que contém vários controls, você pode querer atualizar apenas partes do modelo.
Esta seção cobre como atualizar partes específicas de um data model de form control.

Existem duas maneiras de atualizar o valor do modelo:

| Métodos        | Detalhes                                                                                                                                                 |
| :------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `setValue()`   | Define um novo valor para um control individual. O método `setValue()` adere estritamente à estrutura do form group e substitui todo o valor do control. |
| `patchValue()` | Substitui quaisquer propriedades definidas no objeto que foram alteradas no form model.                                                                  |

As verificações estritas do método `setValue()` ajudam a capturar erros de aninhamento em formulários complexos, enquanto `patchValue()` falha silenciosamente nesses erros.

Em `ProfileEditorComponent`, use o método `updateProfile` com o exemplo a seguir para atualizar o primeiro nome e endereço de rua do usuário.

<docs-code header="profile-editor.component.ts (patch value)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" visibleRegion="patch-value"/>

Simule uma atualização adicionando um botão ao template para atualizar o perfil do usuário sob demanda.

<docs-code header="profile-editor.component.html (update value)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.html" visibleRegion="patch-value"/>

Quando um usuário clica no botão, o model `profileForm` é atualizado com novos valores para `firstName` e `street`. Observe que `street` é fornecido em um objeto dentro da propriedade `address`.
Isso é necessário porque o método `patchValue()` aplica a atualização contra a estrutura do modelo.
`PatchValue()` atualiza apenas as propriedades que o form model define.

## Usando o serviço FormBuilder para gerar controls

Criar instâncias de form control manualmente pode se tornar repetitivo ao lidar com vários formulários.
O serviço `FormBuilder` fornece métodos convenientes para gerar controls.

Use as seguintes etapas para aproveitar este serviço.

1. Importe a classe `FormBuilder`.
1. Injete o serviço `FormBuilder`.
1. Gere o conteúdo do formulário.

Os exemplos a seguir mostram como refatorar o component `ProfileEditor` para usar o serviço form builder para criar instâncias de form control e form group.

<docs-workflow>
<docs-step title="Importe a classe FormBuilder">
Importe a classe `FormBuilder` do pacote `@angular/forms`.

<docs-code header="profile-editor.component.ts (import)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" visibleRegion="form-builder-imports"/>

</docs-step>

<docs-step title="Injete o serviço FormBuilder">
O serviço `FormBuilder` é um provider injetável do módulo de reactive forms. Use a função `inject()` para injetar essa dependência no seu component.

<docs-code header="profile-editor.component.ts (property init)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" visibleRegion="inject-form-builder"/>

</docs-step>
<docs-step title="Gere form controls">
O serviço `FormBuilder` tem três métodos: `control()`, `group()` e `array()`. Estes são métodos de fábrica para gerar instâncias nas classes de seus components, incluindo form controls, form groups e form arrays. Use o método `group` para criar os controls `profileForm`.

<docs-code header="profile-editor.component.ts (form builder)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" visibleRegion="form-builder"/>

No exemplo anterior, você usa o método `group()` com o mesmo objeto para definir as propriedades no model. O valor para cada nome de control é um array contendo o valor inicial como o primeiro item no array.

TIP: Você pode definir o control apenas com o valor inicial, mas se seus controls precisarem de validação síncrona ou assíncrona, adicione validadores síncronos e assíncronos como segundo e terceiro itens no array. Compare o uso do form builder com a criação manual das instâncias.

  <docs-code-multifile>
    <docs-code header="profile-editor.component.ts (instances)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" visibleRegion="formgroup-compare"/>
    <docs-code header="profile-editor.component.ts (form builder)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" visibleRegion="formgroup-compare"/>
  </docs-code-multifile>
</docs-step>

</docs-workflow>

## Validando entrada de formulário {#validating-form-input}

_Validação de formulário_ é usada para garantir que a entrada do usuário esteja completa e correta.
Esta seção cobre adicionar um único validador a um form control e exibir o status geral do formulário.
A validação de formulário é abordada mais extensivamente no guia [Validação de Formulário](guide/forms/form-validation).

Use as seguintes etapas para adicionar validação de formulário.

1. Importe uma função validadora no seu component de formulário.
1. Adicione o validador ao campo no formulário.
1. Adicione lógica para lidar com o status de validação.

A validação mais comum é tornar um campo obrigatório.
O exemplo a seguir mostra como adicionar uma validação obrigatória ao control `firstName` e exibir o resultado da validação.

<docs-workflow>
<docs-step title="Importe uma função validadora">
Reactive forms incluem um conjunto de funções validadoras para casos de uso comuns. Essas funções recebem um control para validar e retornam um objeto de erro ou um valor nulo com base na verificação de validação.

Importe a classe `Validators` do pacote `@angular/forms`.

<docs-code header="profile-editor.component.ts (import)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" visibleRegion="validator-imports"/>
</docs-step>

<docs-step title="Torne um campo obrigatório">
No component `ProfileEditor`, adicione o método estático `Validators.required` como o segundo item no array para o control `firstName`.

<docs-code header="profile-editor.component.ts (required validator)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" visibleRegion="required-validator"/>
</docs-step>

<docs-step title="Exiba o status do formulário">
Quando você adiciona um campo obrigatório ao form control, seu status inicial é inválido. Este status inválido se propaga para o elemento form group pai, tornando seu status inválido. Acesse o status atual da instância do form group através de sua propriedade `status`.

Exiba o status atual de `profileForm` usando interpolação.

<docs-code header="profile-editor.component.html (display status)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.html" visibleRegion="display-status"/>

O botão **Submit** está desabilitado porque `profileForm` é inválido devido ao control de formulário `firstName` obrigatório. Depois de preencher a entrada `firstName`, o formulário se torna válido e o botão **Submit** é habilitado.

Para mais sobre validação de formulário, visite o guia [Validação de Formulário](guide/forms/form-validation).
</docs-step>
</docs-workflow>

## Criando formulários dinâmicos

`FormArray` é uma alternativa a `FormGroup` para gerenciar qualquer número de controls sem nome.
Assim como nas instâncias de form group, você pode inserir e remover dinamicamente controls de instâncias de form array, e o valor da instância de form array e o status de validação são calculados a partir de seus controls filhos.
No entanto, você não precisa definir uma chave para cada control por nome, então esta é uma ótima opção se você não sabe o número de valores filhos antecipadamente.

Para definir um formulário dinâmico, siga as seguintes etapas.

1. Importe a classe `FormArray`.
1. Defina um control `FormArray`.
1. Acesse o control `FormArray` com um método getter.
1. Exiba o form array em um template.

O exemplo a seguir mostra como gerenciar um array de _aliases_ em `ProfileEditor`.

<docs-workflow>
<docs-step title="Importe a classe `FormArray`">
Importe a classe `FormArray` de `@angular/forms` para usar para informações de tipo. O serviço `FormBuilder` está pronto para criar uma instância `FormArray`.

<docs-code header="profile-editor.component.ts (import)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" visibleRegion="form-array-imports"/>
</docs-step>

<docs-step title="Defina um control `FormArray`">
Você pode inicializar um form array com qualquer número de controls, de zero a muitos, definindo-os em um array. Adicione uma propriedade `aliases` à instância do form group para `profileForm` para definir o form array.

Use o método `FormBuilder.array()` para definir o array e o método `FormBuilder.control()` para preencher o array com um control inicial.

<docs-code header="profile-editor.component.ts (aliases form array)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" visibleRegion="aliases"/>

O control aliases na instância do form group agora está preenchido com um único control até que mais controls sejam adicionados dinamicamente.
</docs-step>

<docs-step title="Acesse o control `FormArray`">
Um getter fornece acesso aos aliases na instância do form array em comparação com repetir o método `profileForm.get()` para obter cada instância. A instância do form array representa um número indefinido de controls em um array. É conveniente acessar um control através de um getter, e esta abordagem é direta de repetir para controls adicionais. <br />

Use a sintaxe getter para criar uma propriedade de classe `aliases` para recuperar o control de form array de aliases do form group pai.

<docs-code header="profile-editor.component.ts (aliases getter)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" visibleRegion="aliases-getter"/>

Como o control retornado é do tipo `AbstractControl`, você precisa fornecer um tipo explícito para acessar a sintaxe do método para a instância do form array. Defina um método para inserir dinamicamente um control de alias no form array de aliases. O método `FormArray.push()` insere o control como um novo item no array, e você também pode passar um array de controls para FormArray.push() para registrar vários controls de uma vez.

<docs-code header="profile-editor.component.ts (add alias)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" visibleRegion="add-alias"/>

No template, cada control é exibido como um campo de entrada separado.

</docs-step>

<docs-step title="Exiba o form array no template">

Para anexar os aliases do seu form model, você deve adicioná-lo ao template. Semelhante à entrada `formGroupName` fornecida por `FormGroupNameDirective`, `formArrayName` vincula a comunicação da instância do form array ao template com `FormArrayNameDirective`.

Adicione o seguinte HTML de template após a `<div>` que fecha o elemento `formGroupName`.

<docs-code header="profile-editor.component.html (aliases form array template)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.html" visibleRegion="formarrayname"/>

O bloco `@for` itera sobre cada instância de form control fornecida pela instância do form array de aliases. Como os elementos do form array não têm nome, você atribui o índice à variável `i` e o passa para cada control para vinculá-lo à entrada `formControlName`.

Cada vez que uma nova instância de alias é adicionada, a nova instância do form array é fornecida com seu control com base no índice. Isso permite que você rastreie cada control individual ao calcular o status e o valor do control raiz.

</docs-step>

<docs-step title="Adicione um alias">

Inicialmente, o formulário contém um campo `Alias`. Para adicionar outro campo, clique no botão **Add Alias**. Você também pode validar o array de aliases relatado pelo form model exibido por `Form Value` na parte inferior do template. Em vez de uma instância de form control para cada alias, você pode compor outra instância de form group com campos adicionais. O processo de definir um control para cada item é o mesmo.
</docs-step>

</docs-workflow>

## Eventos unificados de mudança de estado de control

Todos os form controls expõem um único stream unificado de **eventos de mudança de estado de control** através do observable `events` em `AbstractControl` (`FormControl`, `FormGroup`, `FormArray` e `FormRecord`).
Este stream unificado permite que você reaja a mudanças de estado de **value**, **status**, **pristine**, **touched** e **reset** e também para **ações no nível de formulário**, como **submit**, permitindo que você lide com todas as atualizações com uma única assinatura em vez de conectar vários observables.

### Tipos de evento

Cada item emitido por `events` é uma instância de uma classe de evento específica:

- **`ValueChangeEvent`** — quando o **value** do control muda.
- **`StatusChangeEvent`** — quando o **status de validação** do control atualiza para um dos valores `FormControlStatus` (`VALID`, `INVALID`, `PENDING` ou `DISABLED`).
- **`PristineChangeEvent`** — quando o estado **pristine/dirty** do control muda.
- **`TouchedChangeEvent`** — quando o estado **touched/untouched** do control muda.
- **`FormResetEvent`** — quando um control ou formulário é resetado, seja através da API `reset()` ou de uma ação nativa.
- **`FormSubmittedEvent`** — quando o formulário é enviado.

Todas as classes de evento estendem `ControlEvent` e incluem uma referência `source` ao `AbstractControl` que originou a mudança, o que é útil em formulários grandes.

```ts
import { Component } from '@angular/core';
import {
  FormControl,
  ValueChangeEvent,
  StatusChangeEvent,
  PristineChangeEvent,
  TouchedChangeEvent,
  FormResetEvent,
  FormSubmittedEvent,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';

@Component({/* ... */ })
export class UnifiedEventsBasicComponent {
  form = new FormGroup({
    username: new FormControl(''),
  });

  constructor() {
    this.form.events.subscribe((e) => {
      if (e instanceof ValueChangeEvent) {
        console.log('Value changed to: ', e.value);
      }

      if (e instanceof StatusChangeEvent) {
        console.log('Status changed to: ', e.status);
      }

      if (e instanceof PristineChangeEvent) {
        console.log('Pristine status changed to: ', e.pristine);
      }

      if (e instanceof TouchedChangeEvent) {
        console.log('Touched status changed to: ', e.touched);
      }

      if (e instanceof FormResetEvent) {
        console.log('Form was reset');
      }

      if (e instanceof FormSubmittedEvent) {
        console.log('Form was submitted');
      }
    });
  }
}
```

### Filtrando eventos específicos

Prefira operadores RxJS quando você precisar apenas de um subconjunto de tipos de evento.

```ts
import { filter } from 'rxjs/operators';
import { StatusChangeEvent } from '@angular/forms';

control.events
  .pipe(filter((e) => e instanceof StatusChangeEvent))
  .subscribe((e) => console.log('Status:', e.status));
```

### Unificando de múltiplas assinaturas

**Antes**

```ts
import { combineLatest } from 'rxjs/operators';

combineLatest([control.valueChanges, control.statusChanges])
  .subscribe(([value, status]) => { /* ... */ });
```

**Depois**

```ts
control.events.subscribe((e) => {
  // Handle ValueChangeEvent, StatusChangeEvent, etc.
});
```

NOTE: Na mudança de valor, a emissão acontece logo após um valor deste control ser atualizado. O valor de um control pai (por exemplo, se este FormControl faz parte de um FormGroup) é atualizado mais tarde, portanto, acessar um valor de um control pai (usando a propriedade `value`) do callback deste evento pode resultar em obter um valor que ainda não foi atualizado. Assine os `events` do control pai em vez disso.

## Funções utilitárias para restringir tipos de form control {#creating-nested-form-groups 'See more about nesting groups'} {#validating-form-input 'Learn more about validating form input'}

O Angular fornece quatro funções utilitárias que ajudam a determinar o tipo concreto de um `AbstractControl`. Essas funções atuam como **type guards** e restringem o tipo de control quando retornam `true`, o que permite que você acesse com segurança propriedades específicas do subtipo dentro do mesmo bloco.

| Função utilitária | Detalhes                                            |
| :---------------- | :-------------------------------------------------- |
| `isFormControl`   | Retorna `true` quando o control é um `FormControl`. |
| `isFormGroup`     | Retorna `true` quando o control é um `FormGroup`    |
| `isFormRecord`    | Retorna `true` quando o control é um `FormRecord`   |
| `isFormArray`     | Retorna `true` quando o control é um `FormArray`    |

Esses helpers são particularmente úteis em **validadores personalizados**, onde a assinatura da função recebe um `AbstractControl`, mas a lógica é destinada a um tipo específico de control.

```ts
import { AbstractControl, isFormArray } from '@angular/forms';

export function positiveValues(control: AbstractControl) {
    if (!isFormArray(control)) {
        return null; // Not a FormArray: validator is not applicable.
    }

    // Safe to access FormArray-specific API after narrowing.
    const hasNegative = control.controls.some(c => c.value < 0);
    return hasNegative ? { positiveValues: true } : null;
}
```

## Resumo da API de reactive forms

A tabela a seguir lista as classes base e serviços usados para criar e gerenciar reactive form controls.
Para detalhes de sintaxe completos, consulte a documentação de referência da API para o [pacote Forms](api#forms 'API reference').

### Classes

| Classe            | Detalhes                                                                                                                                                                                                    |
| :---------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AbstractControl` | A classe base abstrata para as classes concretas de form control `FormControl`, `FormGroup` e `FormArray`. Ela fornece seus comportamentos e propriedades comuns.                                           |
| `FormControl`     | Gerencia o valor e o status de validação de um form control individual. Ele corresponde a um form control HTML, como `<input>` ou `<select>`.                                                               |
| `FormGroup`       | Gerencia o valor e o estado de validação de um grupo de instâncias `AbstractControl`. As propriedades do grupo incluem seus controls filhos. O formulário de nível superior no seu component é `FormGroup`. |
| `FormArray`       | Gerencia o valor e o estado de validação de um array numericamente indexado de instâncias `AbstractControl`.                                                                                                |
| `FormBuilder`     | Um serviço injetável que fornece métodos de fábrica para criar instâncias de control.                                                                                                                       |
| `FormRecord`      | Rastreia o valor e o estado de validação de uma coleção de instâncias `FormControl`, cada uma das quais tem o mesmo tipo de valor.                                                                          |

### Directives

| Directive              | Detalhes                                                                                             |
| :--------------------- | :--------------------------------------------------------------------------------------------------- |
| `FormControlDirective` | Sincroniza uma instância `FormControl` autônoma a um elemento form control.                          |
| `FormControlName`      | Sincroniza `FormControl` em uma instância `FormGroup` existente a um elemento form control por nome. |
| `FormGroupDirective`   | Sincroniza uma instância `FormGroup` existente a um elemento DOM.                                    |
| `FormGroupName`        | Sincroniza uma instância `FormGroup` aninhada a um elemento DOM.                                     |
| `FormArrayName`        | Sincroniza uma instância `FormArray` aninhada a um elemento DOM.                                     |
