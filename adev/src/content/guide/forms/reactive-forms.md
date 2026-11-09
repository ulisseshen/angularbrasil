<!-- ia-translate: true -->

# Reactive forms

Reactive forms fornecem uma abordagem model-driven para lidar com entradas de formulário cujos valores mudam ao longo do tempo.
Este guia mostra como criar e atualizar um form control básico, usar vários controls em um grupo, validar valores de formulário e criar formulários dinâmicos onde você pode adicionar ou remover controls em tempo de execução.

## Visão geral de reactive forms {#overview-of-reactive-forms}

Reactive forms usam uma abordagem explícita e imutável para gerenciar o estado de um formulário em um determinado momento.
Cada mudança no estado do formulário retorna um novo estado, que mantém a integridade do modelo entre as mudanças.
Reactive forms são construídos em torno de observable streams, onde entradas e valores de formulário são fornecidos como streams que podem ser acessados de forma síncrona.

Reactive forms também fornecem um caminho direto para testes porque você tem a garantia de que seus dados são consistentes e previsíveis quando solicitados.
Quaisquer consumidores desses streams podem manipular os dados com segurança.

Reactive forms diferem de [template-driven forms](guide/forms/template-driven-forms) de maneiras distintas.
Reactive forms fornecem acesso síncrono ao data model, imutabilidade com operadores observable e rastreamento de mudanças por meio de observable streams.

Template-driven forms permitem acesso direto para modificar dados no seu template, mas são menos explícitos do que reactive forms porque dependem de directives embutidas no template, juntamente com dados mutáveis para rastrear mudanças de forma assíncrona.
Consulte a [Visão Geral de Forms](guide/forms) para comparações detalhadas entre os dois paradigmas.

## Adicionando um form control básico {#adding-a-basic-form-control}

Existem três etapas para usar form controls.

1. Gere um novo component e registre o módulo de reactive forms. Este módulo declara as directives de reactive forms necessárias para usar reactive forms.
1. Instancie um novo `FormControl`.
1. Registre o `FormControl` no template.

Você pode então exibir o formulário adicionando o component ao template.

Os exemplos a seguir mostram como adicionar um único form control.
No exemplo, o usuário insere seu nome em um campo de entrada, captura esse valor e exibe o valor atual do elemento form control.

<docs-workflow>

<docs-step title="Gere um novo component e importe o ReactiveFormsModule">
Use o comando CLI `ng generate component` para gerar um component no seu projeto, importe `ReactiveFormsModule` do pacote `@angular/forms` e adicione-o ao array `imports` do seu Component.

<docs-code header="name-editor.component.ts (excerpt)" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.ts" region="imports" />
</docs-step>

<docs-step title="Declare uma instância de FormControl">
Use o construtor de `FormControl` para definir seu valor inicial, que neste caso é uma string vazia. Ao criar esses controls na classe do seu component, você obtém acesso imediato para ouvir, atualizar e validar o estado da entrada do formulário.

<docs-code header="name-editor.component.ts" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.ts" region="create-control"/>
</docs-step>

<docs-step title="Registre o control no template">
Depois de criar o control na classe do component, você deve associá-lo a um elemento form control no template. Atualize o template com o form control usando o binding `formControl` fornecido por `FormControlDirective`, que também está incluído no `ReactiveFormsModule`.

<docs-code header="name-editor.component.html" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.html" region="control-binding" />

Usando a sintaxe de template binding, o form control agora está registrado no elemento de entrada `name` no template. O form control e o elemento DOM se comunicam entre si: a view reflete mudanças no model e o model reflete mudanças na view.
</docs-step>

<docs-step title="Exiba o component">
O `FormControl` atribuído à propriedade `name` é exibido quando o component `<app-name-editor>` é adicionado a um template.

<docs-code header="app.component.html (name editor)" path="adev/src/content/examples/reactive-forms/src/app/app.component.1.html" region="app-name-editor"/>
</docs-step>
</docs-workflow>

### Exibindo o valor de um form control {#displaying-a-form-control-value}

Você pode exibir o valor das seguintes maneiras:

- Através do observable `valueChanges`, onde você pode ouvir mudanças no valor do formulário no template usando `AsyncPipe` ou na classe do component usando o método `subscribe()`
- Com a propriedade `value`, que fornece um snapshot do valor atual

O exemplo a seguir mostra como exibir o valor atual usando interpolação no template.

<docs-code header="name-editor.component.html (control value)" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.html" region="display-value"/>

O valor exibido muda conforme você atualiza o elemento form control.

Reactive forms fornecem acesso a informações sobre um determinado control por meio de propriedades e métodos fornecidos com cada instância.
Essas propriedades e métodos da classe base [AbstractControl](api/forms/AbstractControl 'API reference') são usados para controlar o estado do formulário e determinar quando exibir mensagens ao lidar com [validação de entrada](#validating-form-input 'Saiba mais sobre validação de entrada de formulário').

Leia sobre outras propriedades e métodos de `FormControl` na [Referência da API](api/forms/FormControl 'Referência detalhada de sintaxe').

### Substituindo o valor de um form control {#replacing-a-form-control-value}

Reactive forms têm métodos para alterar o valor de um control programaticamente, o que oferece a flexibilidade de atualizar o valor sem interação do usuário.
Uma instância de form control fornece um método `setValue()` que atualiza o valor do form control e valida a estrutura do valor fornecido em relação à estrutura do control.
Por exemplo, ao recuperar dados de formulário de uma API ou serviço de backend, use o método `setValue()` para atualizar o control com seu novo valor, substituindo o valor antigo por completo.

O exemplo a seguir adiciona um método à classe do component para atualizar o valor do control para _Nancy_ usando o método `setValue()`.

<docs-code header="name-editor.component.ts (update value)" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.ts" region="update-value"/>

Atualize o template com um botão para simular uma atualização de nome.
Quando você clica no botão **Update Name**, o valor inserido no elemento form control é refletido como seu valor atual.

<docs-code header="name-editor.component.html (update value)" path="adev/src/content/examples/reactive-forms/src/app/name-editor/name-editor.component.html" region="update-value"/>

O form model é a fonte da verdade para o control, então quando você clica no botão, o valor da entrada é alterado dentro da classe do component, sobrescrevendo seu valor atual.

HELPFUL: Neste exemplo, você está usando um único control.
Ao usar o método `setValue()` com um [form group](#grouping-form-controls) ou uma instância de [form array](#creating-dynamic-forms), o valor precisa corresponder à estrutura do grupo ou array.

## Agrupando form controls {#grouping-form-controls}

Formulários normalmente contêm vários controls relacionados.
Reactive forms fornecem duas maneiras de agrupar vários controls relacionados em um único formulário de entrada.

| Form groups | Detalhes |
| :---------- | :------- |
| Form group  | Define um formulário com um conjunto fixo de controls que você pode gerenciar em conjunto. Os fundamentos do form group são discutidos nesta seção. Você também pode [aninhar form groups](#creating-nested-form-groups 'Saiba mais sobre aninhamento de grupos') para criar formulários mais complexos. |
| Form array  | Define um formulário dinâmico, onde você pode adicionar e remover controls em tempo de execução. Você também pode aninhar form arrays para criar formulários mais complexos. Para mais sobre esta opção, consulte [Criando formulários dinâmicos](#creating-dynamic-forms). |

Assim como uma instância de form control oferece controle sobre um único campo de entrada, uma instância de form group rastreia o estado do formulário de um grupo de instâncias de form control \(por exemplo, um formulário\).
Cada control em uma instância de form group é rastreado por nome ao criar o form group.
O exemplo a seguir mostra como gerenciar várias instâncias de form control em um único grupo.

Gere um component `ProfileEditor` e importe as classes `FormGroup` e `FormControl` do pacote `@angular/forms`.

```shell
ng generate component ProfileEditor
```

<docs-code header="profile-editor.component.ts (imports)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="imports"/>

Para adicionar um form group a este component, siga estas etapas.

1. Crie uma instância de `FormGroup`.
1. Associe o model `FormGroup` e a view.
1. Salve os dados do formulário.

<docs-workflow>

<docs-step title="Crie uma instância de FormGroup">
Crie uma propriedade na classe do component chamada `profileForm` e defina a propriedade como uma nova instância de form group. Para inicializar o form group, forneça ao construtor um objeto de chaves nomeadas mapeadas para seus controls.

Para o formulário de perfil, adicione duas instâncias de form control com os nomes `firstName` e `lastName`.

<docs-code header="profile-editor.component.ts (form group)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="formgroup"/>

Os form controls individuais agora estão reunidos dentro de um grupo. Uma instância de `FormGroup` fornece seu valor de model como um objeto reduzido a partir dos valores de cada control no grupo. Uma instância de form group tem as mesmas propriedades (como `value` e `untouched`) e métodos (como `setValue()`) que uma instância de form control.
</docs-step>

<docs-step title="Associe o model FormGroup e a view">
Um form group rastreia o status e as mudanças de cada um de seus controls, então, se um dos controls mudar, o control pai também emite um novo status ou uma mudança de valor. O model do grupo é mantido a partir de seus membros. Depois de definir o model, você deve atualizar o template para refletir o model na view.

<docs-code header="profile-editor.component.html (template form group)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.html" region="formgroup"/>

Assim como um form group contém um grupo de controls, o `FormGroup` _profileForm_ é vinculado ao elemento `form` com a directive `FormGroup`, criando uma camada de comunicação entre o model e o formulário que contém as entradas. A entrada `formControlName` fornecida pela directive `FormControlName` vincula cada entrada individual ao form control definido no `FormGroup`. Os form controls se comunicam com seus respectivos elementos. Eles também comunicam mudanças à instância do form group, que fornece a fonte da verdade para o valor do model.
</docs-step>

<docs-step title="Salve os dados do formulário">
O component `ProfileEditor` aceita entrada do usuário, mas em um cenário real você quer capturar o valor do formulário e disponibilizá-lo para processamento adicional fora do component. A directive `FormGroup` escuta o evento `submit` emitido pelo elemento `form` e emite um evento `ngSubmit` ao qual você pode vincular uma função de callback. Adicione um event listener `ngSubmit` à tag `form` com o método de callback `onSubmit()`.

<docs-code header="profile-editor.component.html (submit event)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.html" region="ng-submit"/>

O método `onSubmit()` no component `ProfileEditor` captura o valor atual de `profileForm`. Use `output()` para manter o formulário encapsulado e fornecer o valor do formulário fora do component. O exemplo a seguir usa `console.warn` para registrar uma mensagem no console do navegador.

<docs-code header="profile-editor.component.ts (submit method)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="on-submit"/>

O evento `submit` é emitido pela tag `form` usando o evento DOM nativo. Você aciona o evento clicando em um botão do tipo `submit`. Isso permite que o usuário pressione a tecla **Enter** para enviar o formulário concluído.

Use um elemento `button` para adicionar um botão na parte inferior do formulário para acionar o envio.

<docs-code header="profile-editor.component.html (submit button)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.html" region="submit-button"/>

O botão do trecho anterior também tem um binding `disabled` anexado para desabilitá-lo quando `profileForm` for inválido. Como você ainda não está executando nenhuma validação, o botão está sempre habilitado. A validação básica de formulário é abordada na seção [Validando entrada de formulário](#validating-form-input).
</docs-step>

<docs-step title="Exiba o component {#display-the-component-form-group}">
Para exibir o component `ProfileEditor` que contém o formulário, adicione-o a um template de component.

<docs-code header="app.component.html (profile editor)" path="adev/src/content/examples/reactive-forms/src/app/app.component.1.html" region="app-profile-editor"/>

`ProfileEditor` permite que você gerencie as instâncias de form control para os controls `firstName` e `lastName` dentro da instância do form group.
</docs-step>
</docs-workflow>

### Criando form groups aninhados {#creating-nested-form-groups}

Form groups podem aceitar tanto instâncias individuais de form control quanto outras instâncias de form group como filhos.
Isso torna a composição de models de formulário complexos mais fácil de manter e de agrupar logicamente.

Ao construir formulários complexos, gerenciar as diferentes áreas de informação é mais fácil em seções menores.
Usar uma instância de form group aninhado permite dividir form groups grandes em grupos menores e mais gerenciáveis.

Para criar formulários mais complexos, use as seguintes etapas.

1. Crie um grupo aninhado.
1. Agrupe o formulário aninhado no template.

Alguns tipos de informação naturalmente se enquadram no mesmo grupo.
Um nome e um endereço são exemplos típicos de tais grupos aninhados e são usados nos exemplos a seguir.

<docs-workflow>
<docs-step title="Crie um grupo aninhado">
Para criar um grupo aninhado em `profileForm`, adicione um elemento `address` aninhado à instância do form group.

<docs-code header="profile-editor.component.ts (nested form group)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="nested-formgroup"/>

Neste exemplo, o `address group` combina os controls atuais `firstName` e `lastName` com os novos controls `street`, `city`, `state` e `zip`. Mesmo que o elemento `address` no form group seja filho do elemento `profileForm` geral, as mesmas regras se aplicam às mudanças de valor e status. As mudanças de status e valor do form group aninhado se propagam para o form group pai, mantendo a consistência com o model geral.
</docs-step>

<docs-step title="Agrupe o formulário aninhado no template">
Depois de atualizar o model na classe do component, atualize o template para conectar a instância do form group e seus elementos de entrada. Adicione o form group `address`, contendo os campos `street`, `city`, `state` e `zip`, ao template do `ProfileEditor`.

<docs-code header="profile-editor.component.html (template nested form group)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.html" region="formgroupname"/>

O formulário `ProfileEditor` é exibido como um grupo, mas o model é dividido ainda mais para representar as áreas de agrupamento lógico.

Exiba o valor da instância do form group no template do component usando a propriedade `value` e o `JsonPipe`.
</docs-step>
</docs-workflow>

### Atualizando partes do data model {#updating-parts-of-the-data-model}

Ao atualizar o valor de uma instância de form group que contém vários controls, você pode querer atualizar apenas partes do model.
Esta seção mostra como atualizar partes específicas de um data model de form control.

Existem duas maneiras de atualizar o valor do model:

| Métodos        | Detalhes |
| :------------- | :------- |
| `setValue()`   | Define um novo valor para um control individual. O método `setValue()` adere estritamente à estrutura do form group e substitui todo o valor do control. |
| `patchValue()` | Substitui quaisquer propriedades definidas no objeto que foram alteradas no form model. |

As verificações rígidas do método `setValue()` ajudam a capturar erros de aninhamento em formulários complexos, enquanto `patchValue()` falha silenciosamente nesses erros.

Em `ProfileEditorComponent`, use o método `updateProfile` com o exemplo a seguir para atualizar o primeiro nome e o endereço de rua do usuário.

<docs-code header="profile-editor.component.ts (patch value)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="patch-value"/>

Simule uma atualização adicionando um botão ao template para atualizar o perfil do usuário sob demanda.

<docs-code header="profile-editor.component.html (update value)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.html" region="patch-value"/>

Quando um usuário clica no botão, o model `profileForm` é atualizado com novos valores para `firstName` e `street`. Observe que `street` é fornecido em um objeto dentro da propriedade `address`.
Isso é necessário porque o método `patchValue()` aplica a atualização contra a estrutura do model.
`patchValue()` atualiza apenas as propriedades que o form model define.

## Usando o serviço FormBuilder para gerar controls {#using-the-formbuilder-service-to-generate-controls}

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

<docs-code header="profile-editor.component.ts (import)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="form-builder-imports"/>

</docs-step>

<docs-step title="Injete o serviço FormBuilder">
O serviço `FormBuilder` é um provider injetável do módulo de reactive forms. Use a função `inject()` para injetar essa dependência no seu component.

<docs-code header="profile-editor.component.ts (property init)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="inject-form-builder"/>

</docs-step>
<docs-step title="Gere form controls">
O serviço `FormBuilder` tem três métodos: `control()`, `group()` e `array()`. Estes são métodos de fábrica para gerar instâncias nas classes de seus components, incluindo form controls, form groups e form arrays. Use o método `group` para criar os controls do `profileForm`.

<docs-code header="profile-editor.component.ts (form builder)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="form-builder"/>

No exemplo anterior, você usa o método `group()` com o mesmo objeto para definir as propriedades no model. O valor de cada nome de control é um array contendo o valor inicial como o primeiro item do array.

TIP: Você pode definir o control apenas com o valor inicial, mas se seus controls precisarem de validação síncrona ou assíncrona, adicione validadores síncronos e assíncronos como segundo e terceiro itens do array. Compare o uso do form builder com a criação manual das instâncias.

  <docs-code-multifile>
    <docs-code header="profile-editor.component.ts (instances)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.1.ts" region="formgroup-compare"/>
    <docs-code header="profile-editor.component.ts (form builder)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="formgroup-compare"/>
  </docs-code-multifile>
</docs-step>

</docs-workflow>

## Validando entrada de formulário {#validating-form-input}

_Validação de formulário_ é usada para garantir que a entrada do usuário esteja completa e correta.
Esta seção mostra como adicionar um único validador a um form control e exibir o status geral do formulário.
A validação de formulário é abordada com mais profundidade no guia [Validação de Formulário](guide/forms/form-validation).

Use as seguintes etapas para adicionar validação de formulário.

1. Importe uma função validadora no seu component de formulário.
1. Adicione o validador ao campo no formulário.
1. Adicione lógica para tratar o status de validação.

A validação mais comum é tornar um campo obrigatório.
O exemplo a seguir mostra como adicionar uma validação obrigatória ao control `firstName` e exibir o resultado da validação.

<docs-workflow>
<docs-step title="Importe uma função validadora">
Reactive forms incluem um conjunto de funções validadoras para casos de uso comuns. Essas funções recebem um control para validar e retornam um objeto de erro ou um valor nulo, com base na verificação de validação.

Importe a classe `Validators` do pacote `@angular/forms`.

<docs-code header="profile-editor.component.ts (import)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="validator-imports"/>
</docs-step>

<docs-step title="Torne um campo obrigatório">
No component `ProfileEditor`, adicione o método estático `Validators.required` como o segundo item do array para o control `firstName`.

<docs-code header="profile-editor.component.ts (required validator)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="required-validator"/>
</docs-step>

<docs-step title="Exiba o status do formulário">
Quando você adiciona um campo obrigatório ao form control, o status inicial dele é inválido. Esse status inválido se propaga para o elemento form group pai, tornando o status dele inválido. Acesse o status atual da instância do form group pela sua propriedade `status`.

Exiba o status atual de `profileForm` usando interpolação.

<docs-code header="profile-editor.component.html (display status)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.html" region="display-status"/>

O botão **Submit** está desabilitado porque `profileForm` é inválido devido ao form control `firstName` obrigatório. Depois que você preenche a entrada `firstName`, o formulário se torna válido e o botão **Submit** é habilitado.

Para mais sobre validação de formulário, visite o guia [Validação de Formulário](guide/forms/form-validation).
</docs-step>
</docs-workflow>

## Criando formulários dinâmicos {#creating-dynamic-forms}

`FormArray` é uma alternativa a `FormGroup` para gerenciar qualquer número de controls sem nome.
Assim como nas instâncias de form group, você pode inserir e remover controls dinamicamente de instâncias de form array, e o valor da instância de form array e o status de validação são calculados a partir de seus controls filhos.
No entanto, você não precisa definir uma chave para cada control por nome, então esta é uma ótima opção se você não sabe o número de valores filhos antecipadamente.

Para definir um formulário dinâmico, siga as seguintes etapas.

1. Importe a classe `FormArray`.
1. Defina um control `FormArray`.
1. Acesse o control `FormArray` com um método getter.
1. Exiba o form array em um template.

O exemplo a seguir mostra como gerenciar um array de _aliases_ em `ProfileEditor`.

<docs-workflow>
<docs-step title="Importe a classe `FormArray`">
Importe a classe `FormArray` de `@angular/forms` para usar como informação de tipo. O serviço `FormBuilder` está pronto para criar uma instância de `FormArray`.

<docs-code header="profile-editor.component.ts (import)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.2.ts" region="form-array-imports"/>
</docs-step>

<docs-step title="Defina um control `FormArray`">
Você pode inicializar um form array com qualquer número de controls, de zero a muitos, definindo-os em um array. Adicione uma propriedade `aliases` à instância do form group de `profileForm` para definir o form array.

Use o método `FormBuilder.array()` para definir o array e o método `FormBuilder.control()` para preencher o array com um control inicial.

<docs-code header="profile-editor.component.ts (aliases form array)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="aliases"/>

O control aliases na instância do form group agora está preenchido com um único control, até que mais controls sejam adicionados dinamicamente.
</docs-step>

<docs-step title="Acesse o control `FormArray`">
Um getter fornece acesso aos aliases na instância do form array, em comparação com repetir o método `profileForm.get()` para obter cada instância. A instância do form array representa um número indefinido de controls em um array. É conveniente acessar um control por meio de um getter, e essa abordagem é direta de repetir para controls adicionais. <br />

Use a sintaxe de getter para criar uma propriedade de classe `aliases` que recupera o control do form array de aliases do form group pai.

<docs-code header="profile-editor.component.ts (aliases getter)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="aliases-getter"/>

Como o control retornado é do tipo `AbstractControl`, você precisa fornecer um tipo explícito para acessar a sintaxe de método da instância do form array. Defina um método para inserir dinamicamente um control de alias no form array de aliases. O método `FormArray.push()` insere o control como um novo item do array, e você também pode passar um array de controls para `FormArray.push()` para registrar vários controls de uma vez.

<docs-code header="profile-editor.component.ts (add alias)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.ts" region="add-alias"/>

No template, cada control é exibido como um campo de entrada separado.

</docs-step>

<docs-step title="Exiba o form array no template">

Para anexar os aliases do seu form model, você deve adicioná-los ao template. Semelhante à entrada `formGroupName` fornecida por `FormGroupName`, `formArrayName` vincula a comunicação da instância do form array ao template com `FormArrayName`.

Adicione o seguinte HTML de template depois do `<div>` que fecha o elemento `formGroupName`.

<docs-code header="profile-editor.component.html (aliases form array template)" path="adev/src/content/examples/reactive-forms/src/app/profile-editor/profile-editor.component.html" region="formarrayname"/>

O bloco `@for` itera sobre cada instância de form control fornecida pela instância do form array de aliases. Como os elementos do form array não têm nome, você atribui o índice à variável `i` e o passa para cada control para vinculá-lo à entrada `formControlName`.

Cada vez que uma nova instância de alias é adicionada, a nova instância do form array recebe seu control com base no índice. Isso permite que você rastreie cada control individual ao calcular o status e o valor do control raiz.

NOTE: Em aplicações zoneless, mutar um model de reactive forms (por exemplo, chamando `FormArray.push()`) não agenda automaticamente a detecção de mudanças do component. Se o seu template depender de mudanças estruturais no model, como `aliases.controls`, garanta que o component notifique o Angular para executar a detecção de mudanças, por exemplo, conectando um observable de forms a `ChangeDetectorRef.markForCheck()`:

```ts
import {ChangeDetectorRef, Component, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({/* ... */})
export class ProfileEditor {
  private readonly cdr = inject(ChangeDetectorRef);

  constructor() {
    this.profileForm.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.cdr.markForCheck());
  }
}
```

</docs-step>

### Usando `FormArrayDirective` para form arrays de nível superior {#using-formarraydirective-for-top-level-form-arrays}

Você pode vincular um `FormArray` diretamente a um elemento `<form>` usando a `FormArrayDirective`.  
Isso é útil quando o formulário não usa um `FormGroup` de nível superior e o próprio array representa todo o model do formulário.

```angular-ts
import {Component} from '@angular/core';
import {FormArray, FormControl, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'form-array-example',
  imports: [ReactiveFormsModule],
  template: `
    <form [formArray]="form">
      @for (control of form.controls; track $index) {
        <input [formControlName]="$index" />
      }
    </form>
  `,
})
export class FormArrayExampleComponent {
  controls = [new FormControl('fish'), new FormControl('cat'), new FormControl('dog')];

  form = new FormArray(this.controls);
}
```

<docs-step title="Adicione um alias">

Inicialmente, o formulário contém um campo `Alias`. Para adicionar outro campo, clique no botão **Add Alias**. Você também pode validar o array de aliases informado pelo form model exibido em `Form Value` na parte inferior do template. Em vez de uma instância de form control para cada alias, você pode compor outra instância de form group com campos adicionais. O processo de definir um control para cada item é o mesmo.
</docs-step>

</docs-workflow>

## Eventos unificados de mudança de estado de control {#unified-control-state-change-events}

Todos os form controls expõem um único stream unificado de **eventos de mudança de estado de control** por meio do observable `events` em `AbstractControl` (`FormControl`, `FormGroup`, `FormArray` e `FormRecord`).
Este stream unificado permite que você reaja a mudanças de estado de **value**, **status**, **pristine**, **touched** e **reset**, bem como a **ações no nível do formulário**, como **submit**, permitindo tratar todas as atualizações com uma única assinatura em vez de conectar vários observables.

### Tipos de evento {#event-types}

Cada item emitido por `events` é uma instância de uma classe de evento específica:

- **`ValueChangeEvent`** — quando o **value** do control muda.
- **`StatusChangeEvent`** — quando o **status de validação** do control é atualizado para um dos valores de `FormControlStatus` (`VALID`, `INVALID`, `PENDING` ou `DISABLED`).
- **`PristineChangeEvent`** — quando o estado **pristine/dirty** do control muda.
- **`TouchedChangeEvent`** — quando o estado **touched/untouched** do control muda.
- **`FormResetEvent`** — quando um control ou formulário é resetado, seja pela API `reset()` ou por uma ação nativa.
- **`FormSubmittedEvent`** — quando o formulário é enviado.

Todas as classes de evento estendem `ControlEvent` e incluem uma referência `source` ao `AbstractControl` que originou a mudança, o que é útil em formulários grandes.

```ts
import {Component} from '@angular/core';
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

@Component(/* ... */)
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

### Filtrando eventos específicos {#filtering-specific-events}

Prefira operadores RxJS quando você precisar apenas de um subconjunto dos tipos de evento.

```ts
import {filter} from 'rxjs/operators';
import {StatusChangeEvent} from '@angular/forms';

control.events
  .pipe(filter((e) => e instanceof StatusChangeEvent))
  .subscribe((e) => console.log('Status:', e.status));
```

### Unificando múltiplas assinaturas {#unifying-from-multiple-subscriptions}

**Antes**

```ts
import {combineLatest} from 'rxjs';

combineLatest([control.valueChanges, control.statusChanges]).subscribe(([value, status]) => {
  /* ... */
});
```

**Depois**

```ts
control.events.subscribe((e) => {
  // Trata ValueChangeEvent, StatusChangeEvent, etc.
});
```

NOTE: Na mudança de valor, a emissão acontece logo após o valor deste control ser atualizado. O valor de um control pai (por exemplo, se este FormControl faz parte de um FormGroup) é atualizado depois, então acessar o valor de um control pai (usando a propriedade `value`) a partir do callback deste evento pode resultar em um valor que ainda não foi atualizado. Assine os `events` do control pai em vez disso.

## Gerenciando o estado do form control {#managing-form-control-state}

Reactive forms rastreiam o estado do control por meio de **touched/untouched** e **pristine/dirty**. O Angular atualiza esses estados automaticamente durante as interações com o DOM, mas você também pode gerenciá-los programaticamente.

**[`markAsTouched`](api/forms/FormControl#markAsTouched)** — Marca um control ou formulário como touched por eventos de foco e blur que não alteram o valor. Propaga para os controls pai por padrão.

```ts
// Mostra erros de validação depois que o usuário sai de um campo
onEmailBlur() {
  const email = this.form.get('email');
  email.markAsTouched();
}
```

**[`markAsUntouched`](api/forms/FormControl#markAsUntouched)** — Marca um control ou formulário como untouched. Propaga para todos os controls filhos e recalcula o estado touched de todos os controls pai.

```ts
// Redefine o estado do formulário após um envio bem-sucedido
onSubmitSuccess() {
  this.form.markAsUntouched();
  this.form.markAsPristine();
}
```

**[`markAsDirty`](api/forms/FormControl#markAsDirty)** — Marca um control ou formulário como dirty, ou seja, o valor foi alterado. Propaga para os controls pai por padrão.

```ts
// Marca como modificados os valores alterados programaticamente
autofillAddress() {
  const previousAddress = getAddress();
  this.form.patchValue(previousAddress, { emitEvent: false });
  this.form.markAsDirty();
}
```

**[`markAsPristine`](api/forms/FormControl#markAsPristine)** — Marca um control ou formulário como pristine. Marca todos os controls filhos como pristine e recalcula o estado pristine de todos os controls pai.

```ts
// Redefine o estado pristine após salvar para rastrear novas alterações
saveForm() {
  this.api.save(this.form.value).subscribe(() => {
    this.form.markAsPristine();
  });
}
```

**[`markAllAsDirty`](api/forms/FormControl#markAllAsDirty)** — Marca o control ou formulário e todos os seus controls descendentes como dirty.

```ts
// Marca os dados importados como dirty
loadData(data: FormData) {
  this.form.patchValue(data);
  this.form.markAllAsDirty();
}
```

**[`markAllAsTouched`](api/forms/FormControl#markAllAsTouched)** — Marca o control ou formulário e todos os seus controls descendentes como touched. Útil para exibir erros de validação em todo o formulário.

```ts
// Mostra todos os erros de validação antes do envio
onSubmit() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }
  this.saveForm();
}
```

## Controlando a emissão e a propagação de eventos {#controlling-event-emission-and-propagation}

Ao atualizar form controls programaticamente, você tem controle preciso sobre como as mudanças se propagam pela hierarquia do formulário e sobre se os eventos são emitidos.

### Entendendo a emissão de eventos {#understanding-event-emission}

Por padrão, `emitEvent: true`: qualquer mudança em um control emite eventos pelos observables `valueChanges` e `statusChanges`. Definir `emitEvent: false` suprime essas emissões, o que é útil ao definir valores programaticamente sem acionar comportamentos reativos, como salvamento automático, para evitar atualizações circulares entre controls ou para fazer atualizações em lote em que os eventos devem ser emitidos apenas uma vez, no final.

```ts
@Component({/* ... */})
export class BlogPostEditor {
  postForm = new FormGroup({
    title: new FormControl(''),
    content: new FormControl(''),
  });

  constructor() {
    // Salva o rascunho automaticamente toda vez que o usuário digita
    this.postForm.valueChanges.subscribe((formValue) => {
      this.autosaveDraft(formValue);
    });
  }

  loadExistingDraft(savedDraft: {title: string; content: string}) {
    // Restaura o rascunho sem acionar o salvamento automático
    this.postForm.setValue(savedDraft, {emitEvent: false});
  }
}
```

### Entendendo o controle de propagação {#understanding-propagation-control}

Por padrão, `onlySelf: false`: as atualizações se propagam para os controls pai, recalculando seus valores e status de validação. Definir `onlySelf: true` isola a atualização ao control atual, impedindo a notificação ao pai. Isso é útil em operações em lote em que você quer disparar a atualização do pai manualmente, uma única vez.

```ts
updatePostalCodeValidator(country: string) {
  const postal = this.addressForm.get('postalCode');

  const validators = country === 'US'
    ? [Validators.maxLength(5)]
    : [Validators.maxLength(7)];

  postal.setValidators(validators);
  postal.updateValueAndValidity({ onlySelf: true, emitEvent: false });
}
```

HELPFUL: Para gerenciar validadores dinamicamente em tempo de execução, consulte a seção [Gerenciando validadores dinamicamente em reactive forms](guide/forms/form-validation#managing-validators-dynamically-in-reactive-forms) no guia de Validação de Formulário.

## Funções utilitárias para restringir tipos de form control {#utility-functions-for-narrowing-form-control-types}

O Angular fornece quatro funções utilitárias que ajudam a determinar o tipo concreto de um `AbstractControl`. Essas funções atuam como **type guards** e restringem o tipo do control quando retornam `true`, o que permite acessar com segurança propriedades específicas do subtipo dentro do mesmo bloco.

| Função utilitária | Detalhes |
| :---------------- | :------- |
| `isFormControl`   | Retorna `true` quando o control é um `FormControl`. |
| `isFormGroup`     | Retorna `true` quando o control é um `FormGroup`. |
| `isFormRecord`    | Retorna `true` quando o control é um `FormRecord`. |
| `isFormArray`     | Retorna `true` quando o control é um `FormArray`. |

Esses helpers são particularmente úteis em **validadores personalizados**, em que a assinatura da função recebe um `AbstractControl`, mas a lógica é destinada a um tipo específico de control.

```ts
import {AbstractControl, isFormArray} from '@angular/forms';

export function positiveValues(control: AbstractControl) {
  if (!isFormArray(control)) {
    return null; // Não é um FormArray: o validador não se aplica.
  }

  // Seguro acessar a API específica de FormArray após a restrição de tipo.
  const hasNegative = control.controls.some((c) => c.value < 0);
  return hasNegative ? {positiveValues: true} : null;
}
```

## Resumo da API de reactive forms {#reactive-forms-api-summary}

A tabela a seguir lista as classes base e os serviços usados para criar e gerenciar reactive form controls.
Para detalhes completos de sintaxe, consulte a documentação de referência da API do [pacote Forms](api#angular_forms 'Referência da API').

### Classes

| Classe            | Detalhes |
| :---------------- | :------- |
| `AbstractControl` | A classe base abstrata para as classes concretas de form control `FormControl`, `FormGroup` e `FormArray`. Ela fornece seus comportamentos e propriedades comuns. |
| `FormControl`     | Gerencia o valor e o status de validação de um form control individual. Corresponde a um form control HTML, como `<input>` ou `<select>`. |
| `FormGroup`       | Gerencia o valor e o estado de validação de um grupo de instâncias de `AbstractControl`. As propriedades do grupo incluem seus controls filhos. O formulário de nível superior no seu component é um `FormGroup`. |
| `FormArray`       | Gerencia o valor e o estado de validação de um array indexado numericamente de instâncias de `AbstractControl`. |
| `FormBuilder`     | Um serviço injetável que fornece métodos de fábrica para criar instâncias de control. |
| `FormRecord`      | Rastreia o valor e o estado de validação de uma coleção de instâncias de `FormControl`, cada uma com o mesmo tipo de valor. |

### Directives

| Directive              | Detalhes |
| :--------------------- | :------- |
| `FormControlDirective` | Sincroniza uma instância `FormControl` autônoma com um elemento form control. |
| `FormControlName`      | Sincroniza o `FormControl` de uma instância `FormGroup` existente com um elemento form control, pelo nome. |
| `FormGroupDirective`   | Sincroniza uma instância `FormGroup` existente com um elemento DOM. |
| `FormGroupName`        | Sincroniza uma instância `FormGroup` aninhada com um elemento DOM. |
| `FormArrayName`        | Sincroniza uma instância `FormArray` aninhada com um elemento DOM. |
| `FormArrayDirective`   | Sincroniza uma instância `FormArray` autônoma com um elemento DOM. |
