<!-- ia-translate: true -->

# Validando entrada de formulário

Você pode melhorar a qualidade geral dos dados validando a entrada do usuário quanto à precisão e completude.
Esta página mostra como validar a entrada do usuário a partir da UI e exibir mensagens de validação úteis, tanto em reactive forms quanto em template-driven forms.

## Validando entrada em template-driven forms

Para adicionar validação a um template-driven form, você adiciona os mesmos atributos de validação que faria com [validação de formulário HTML nativa](https://developer.mozilla.org/docs/Web/Guide/HTML/HTML5/Constraint_validation).
O Angular usa directives para corresponder esses atributos a funções validadoras no framework.

Toda vez que o valor de um form control muda, o Angular executa a validação e gera uma lista de erros de validação que resulta em um status `INVALID`, ou null, que resulta em um status VALID.

Você pode então inspecionar o estado do control exportando `ngModel` para uma variável local de template.
O exemplo a seguir exporta `NgModel` para uma variável chamada `name`:

<docs-code header="template/actor-form-template.component.html (name)" path="adev/src/content/examples/form-validation/src/app/template/actor-form-template.component.html" visibleRegion="name-with-error-msg"/>

Observe os seguintes recursos ilustrados pelo exemplo.

- O elemento `<input>` carrega os atributos de validação HTML: `required` e `minlength`.
  Ele também carrega uma directive validadora personalizada, `forbiddenName`.
  Para mais informações, consulte a seção [Validadores personalizados](#defining-custom-validators).

- `#name="ngModel"` exporta `NgModel` para uma variável local chamada `name`.
  `NgModel` espelha muitas das propriedades de sua instância `FormControl` subjacente, então você pode usar isso no template para verificar estados de control como `valid` e `dirty`.
  Para uma lista completa de propriedades de control, consulte a referência da API [AbstractControl](api/forms/AbstractControl).
  - O `@if` mais externo revela um conjunto de mensagens aninhadas, mas apenas se o `name` for inválido e o control estiver `dirty` ou `touched`.

  - Cada `@if` aninhado pode apresentar uma mensagem personalizada para um dos possíveis erros de validação.
    Existem mensagens para `required`, `minlength` e `forbiddenName`.

HELPFUL: Para evitar que o validador exiba erros antes que o usuário tenha a chance de editar o formulário, você deve verificar os estados `dirty` ou `touched` em um control.

- Quando o usuário altera o valor no campo observado, o control é marcado como "dirty"
- Quando o usuário desfoca o elemento form control, o control é marcado como "touched"

## Validando entrada em reactive forms

Em um reactive form, a fonte da verdade é a classe do component.
Em vez de adicionar validadores através de atributos no template, você adiciona funções validadoras diretamente ao form control model na classe do component.
O Angular então chama essas funções sempre que o valor do control muda.

### Funções validadoras

Funções validadoras podem ser síncronas ou assíncronas.

| Tipo de validador       | Detalhes                                                                                                                                                                                                                               |
| :---------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Validadores síncronos   | Funções síncronas que recebem uma instância de control e retornam imediatamente um conjunto de erros de validação ou `null`. Passe-os como o segundo argumento ao instanciar um `FormControl`.                                         |
| Validadores assíncronos | Funções assíncronas que recebem uma instância de control e retornam uma Promise ou Observable que posteriormente emite um conjunto de erros de validação ou `null`. Passe-os como o terceiro argumento ao instanciar um `FormControl`. |

Por razões de desempenho, o Angular executa validadores assíncronos apenas se todos os validadores síncronos passarem.
Cada um deve ser concluído antes que os erros sejam definidos.

### Funções validadoras nativas

Você pode optar por [escrever suas próprias funções validadoras](#defining-custom-validators), ou pode usar alguns dos validadores nativos do Angular.

Os mesmos validadores nativos que estão disponíveis como atributos em template-driven forms, como `required` e `minlength`, estão todos disponíveis para uso como funções da classe `Validators`.
Para uma lista completa de validadores nativos, consulte a referência da API [Validators](api/forms/Validators).

Para atualizar o formulário de ator para ser um reactive form, use alguns dos mesmos
validadores nativos—desta vez, na forma de função, como no exemplo a seguir.

<docs-code header="reactive/actor-form-reactive.component.ts (validator functions)" path="adev/src/content/examples/form-validation/src/app/reactive/actor-form-reactive.component.1.ts" visibleRegion="form-group"/>

Neste exemplo, o control `name` configura dois validadores nativos—`Validators.required` e `Validators.minLength(4)`— e um validador personalizado, `forbiddenNameValidator`.

Todos esses validadores são síncronos, então são passados como o segundo argumento.
Observe que você pode suportar vários validadores passando as funções como um array.

Este exemplo também adiciona alguns métodos getter.
Em um reactive form, você sempre pode acessar qualquer form control através do método `get` em seu grupo pai, mas às vezes é útil definir getters como atalho para o template.

Se você olhar para o template da entrada `name` novamente, é bastante semelhante ao exemplo template-driven.

<docs-code header="reactive/actor-form-reactive.component.html (name with error msg)" path="adev/src/content/examples/form-validation/src/app/reactive/actor-form-reactive.component.html" visibleRegion="name-with-error-msg"/>

Este formulário difere da versão template-driven pelo fato de não exportar mais nenhuma directive. Em vez disso, ele usa o getter `name` definido na classe do component.

Observe que o atributo `required` ainda está presente no template. Embora não seja necessário para validação, ele deve ser mantido para fins de acessibilidade.

## Definindo validadores personalizados {#defining-custom-validators}

Os validadores nativos nem sempre correspondem ao caso de uso exato da sua aplicação, então às vezes você precisa criar um validador personalizado.

Considere a função `forbiddenNameValidator` do exemplo anterior.
Aqui está a definição dessa função.

<docs-code header="shared/forbidden-name.directive.ts (forbiddenNameValidator)" path="adev/src/content/examples/form-validation/src/app/shared/forbidden-name.directive.ts" visibleRegion="custom-validator"/>

A função é uma fábrica que recebe uma expressão regular para detectar um nome proibido _específico_ e retorna uma função validadora.

Nesta amostra, o nome proibido é "bob", então o validador rejeita qualquer nome de ator contendo "bob".
Em outro lugar, poderia rejeitar "alice" ou qualquer nome que a expressão regular configurada corresponda.

A fábrica `forbiddenNameValidator` retorna a função validadora configurada.
Essa função recebe um objeto de control Angular e retorna _ou_ null se o valor do control for válido _ou_ um objeto de erro de validação.
O objeto de erro de validação normalmente tem uma propriedade cujo nome é a chave de validação, `'forbiddenName'`, e cujo valor é um dicionário arbitrário de valores que você poderia inserir em uma mensagem de erro, `{name}`.

Validadores assíncronos personalizados são semelhantes aos validadores síncronos, mas devem retornar uma Promise ou observable que posteriormente emite null ou um objeto de erro de validação.
No caso de um observable, o observable deve ser completado, momento em que o formulário usa o último valor emitido para validação.

### Adicionando validadores personalizados a reactive forms

Em reactive forms, adicione um validador personalizado passando a função diretamente para o `FormControl`.

<docs-code header="reactive/actor-form-reactive.component.ts (validator functions)" path="adev/src/content/examples/form-validation/src/app/reactive/actor-form-reactive.component.1.ts" visibleRegion="custom-validator"/>

### Adicionando validadores personalizados a template-driven forms

Em template-driven forms, adicione uma directive ao template, onde a directive encapsula a função validadora.
Por exemplo, a `ForbiddenValidatorDirective` correspondente serve como um wrapper em torno do `forbiddenNameValidator`.

O Angular reconhece o papel da directive no processo de validação porque a directive se registra com o provider `NG_VALIDATORS`, conforme mostrado no exemplo a seguir.
`NG_VALIDATORS` é um provider predefinido com uma coleção extensível de validadores.

<docs-code header="shared/forbidden-name.directive.ts (providers)" path="adev/src/content/examples/form-validation/src/app/shared/forbidden-name.directive.ts" visibleRegion="directive-providers"/>

A classe directive então implementa a interface `Validator`, para que possa se integrar facilmente com formulários Angular.
Aqui está o resto da directive para ajudá-lo a entender como tudo se encaixa.

<docs-code header="shared/forbidden-name.directive.ts (directive)" path="adev/src/content/examples/form-validation/src/app/shared/forbidden-name.directive.ts" visibleRegion="directive"/>

Uma vez que a `ForbiddenValidatorDirective` esteja pronta, você pode adicionar seu seletor, `appForbiddenName`, a qualquer elemento de entrada para ativá-la.
Por exemplo:

<docs-code header="template/actor-form-template.component.html (forbidden-name-input)" path="adev/src/content/examples/form-validation/src/app/template/actor-form-template.component.html" visibleRegion="name-input"/>

HELPFUL: Observe que a directive de validação personalizada é instanciada com `useExisting` em vez de `useClass`.
O validador registrado deve ser _esta instância_ da `ForbiddenValidatorDirective`—a instância no formulário com sua propriedade `forbiddenName` vinculada a "bob".

Se você substituísse `useExisting` por `useClass`, então você estaria registrando uma nova instância de classe, uma que não tem `forbiddenName`.

## Classes CSS de status de control

O Angular espelha automaticamente muitas propriedades de control no elemento form control como classes CSS.
Use essas classes para estilizar elementos form control de acordo com o estado do formulário.
As seguintes classes são atualmente suportadas.

- `.ng-valid`
- `.ng-invalid`
- `.ng-pending`
- `.ng-pristine`
- `.ng-dirty`
- `.ng-untouched`
- `.ng-touched`
- `.ng-submitted` \(apenas elemento form envolvente\)

No exemplo a seguir, o formulário de ator usa as classes `.ng-valid` e `.ng-invalid` para
definir a cor da borda de cada form control.

<docs-code header="forms.css (status classes)" path="adev/src/content/examples/form-validation/src/assets/forms.css"/>

## Validação de campos cruzados {#control-status-css-classes}

Um validador de campos cruzados é um [validador personalizado](#defining-custom-validators 'Read about custom validators') que compara os valores de diferentes campos em um formulário e os aceita ou rejeita em combinação.
Por exemplo, você pode ter um formulário que oferece opções mutuamente incompatíveis, de modo que se o usuário puder escolher A ou B, mas não ambos.
Alguns valores de campo também podem depender de outros; um usuário pode ser permitido escolher B apenas se A também for escolhido.

Os exemplos de validação cruzada a seguir mostram como fazer o seguinte:

- Validar entrada de formulário reactive ou baseado em template com base nos valores de dois controls irmãos,
- Mostrar uma mensagem de erro descritiva depois que o usuário interagiu com o formulário e a validação falhou.

Os exemplos usam validação cruzada para garantir que os atores não reutilizem o mesmo nome em seu papel preenchendo o Formulário de Ator.
Os validadores fazem isso verificando que os nomes e papéis dos atores não correspondem.

### Adicionando validação cruzada a reactive forms

O formulário tem a seguinte estrutura:

<docs-code language="javascript">

const actorForm = new FormGroup({
'name': new FormControl(),
'role': new FormControl(),
'skill': new FormControl()
});

</docs-code>

Observe que `name` e `role` são controls irmãos.
Para avaliar ambos os controls em um único validador personalizado, você deve executar a validação em um control ancestral comum: o `FormGroup`.
Você consulta o `FormGroup` por seus controls filhos para poder comparar seus valores.

Para adicionar um validador ao `FormGroup`, passe o novo validador como o segundo argumento na criação.

<docs-code language="javascript">

const actorForm = new FormGroup({
'name': new FormControl(),
'role': new FormControl(),
'skill': new FormControl()
}, { validators: unambiguousRoleValidator });

</docs-code>

O código do validador é o seguinte.

<docs-code header="shared/unambiguous-role.directive.ts" path="adev/src/content/examples/form-validation/src/app/shared/unambiguous-role.directive.ts" visibleRegion="cross-validation-validator"/>

O validador `unambiguousRoleValidator` implementa a interface `ValidatorFn`.
Ele recebe um objeto de control Angular como argumento e retorna null se o formulário for válido, ou `ValidationErrors` caso contrário.

O validador recupera os controls filhos chamando o método [get](api/forms/AbstractControl#get) do `FormGroup`, depois compara os valores dos controls `name` e `role`.

Se os valores não corresponderem, o papel é inequívoco, ambos são válidos e o validador retorna null.
Se eles corresponderem, o papel do ator é ambíguo e o validador deve marcar o formulário como inválido retornando um objeto de erro.

Para fornecer uma melhor experiência ao usuário, o template mostra uma mensagem de erro apropriada quando o formulário é inválido.

<docs-code header="reactive/actor-form-template.component.html" path="adev/src/content/examples/form-validation/src/app/reactive/actor-form-reactive.component.html" visibleRegion="cross-validation-error-message"/>

Este `@if` exibe o erro se o `FormGroup` tiver o erro de validação cruzada retornado pelo validador `unambiguousRoleValidator`, mas apenas se o usuário terminou de [interagir com o formulário](#control-status-css-classes).

### Adicionando validação cruzada a template-driven forms

Para um template-driven form, você deve criar uma directive para encapsular a função validadora.
Você fornece essa directive como validador usando o token [`NG_VALIDATORS` token](/api/forms/NG_VALIDATORS), conforme mostrado no exemplo a seguir.

<docs-code header="shared/unambiguous-role.directive.ts" path="adev/src/content/examples/form-validation/src/app/shared/unambiguous-role.directive.ts" visibleRegion="cross-validation-directive"/>

Você deve adicionar a nova directive ao template HTML.
Como o validador deve ser registrado no nível mais alto no formulário, o template a seguir coloca a directive na tag `form`.

<docs-code header="template/actor-form-template.component.html" path="adev/src/content/examples/form-validation/src/app/template/actor-form-template.component.html" visibleRegion="cross-validation-register-validator"/>

Para fornecer uma melhor experiência ao usuário, uma mensagem de erro apropriada aparece quando o formulário é inválido.

<docs-code header="template/actor-form-template.component.html" path="adev/src/content/examples/form-validation/src/app/template/actor-form-template.component.html" visibleRegion="cross-validation-error-message"/>

Isso é o mesmo tanto em template-driven quanto em reactive forms.

## Criando validadores assíncronos

Validadores assíncronos implementam as interfaces `AsyncValidatorFn` e `AsyncValidator`.
Estes são muito semelhantes aos seus equivalentes síncronos, com as seguintes diferenças.

- As funções `validate()` devem retornar uma Promise ou um observable,
- O observable retornado deve ser finito, ou seja, deve ser completado em algum momento.
  Para converter um observable infinito em um finito, faça o pipe do observable através de um operador de filtragem como `first`, `last`, `take` ou `takeUntil`.

A validação assíncrona acontece após a validação síncrona e é executada apenas se a validação síncrona for bem-sucedida.
Essa verificação permite que os formulários evitem processos de validação assíncrona potencialmente caros \(como uma solicitação HTTP\) se os métodos de validação mais básicos já encontraram entrada inválida.

Após o início da validação assíncrona, o form control entra em um estado `pending`.
Inspecione a propriedade `pending` do control e use-a para fornecer feedback visual sobre a operação de validação em andamento.

Um padrão de UI comum é mostrar um spinner enquanto a validação assíncrona está sendo executada.
O exemplo a seguir mostra como alcançar isso em um template-driven form.

<docs-code language="html">

<input [(ngModel)]="name" #model="ngModel" appSomeAsyncValidator>
@if(model.pending) {
<app-spinner />
}
</docs-code>

### Implementando um validador assíncrono personalizado

No exemplo a seguir, um validador assíncrono garante que os atores sejam escolhidos para um papel que ainda não está ocupado.
Novos atores estão constantemente fazendo audições e atores antigos estão se aposentando, então a lista de papéis disponíveis não pode ser recuperada antecipadamente.
Para validar a potencial entrada de papel, o validador deve iniciar uma operação assíncrona para consultar um banco de dados central de todos os atores atualmente escalados.

O código a seguir cria a classe validadora, `UniqueRoleValidator`, que implementa a interface `AsyncValidator`.

<docs-code path="adev/src/content/examples/form-validation/src/app/shared/role.directive.ts" visibleRegion="async-validator"/>

A propriedade `actorsService` é inicializada com uma instância do token `ActorsService`, que define a seguinte interface.

<docs-code language="typescript">
interface ActorsService {
  isRoleTaken: (role: string) => Observable<boolean>;
}
</docs-code>

Em uma aplicação do mundo real, o `ActorsService` seria responsável por fazer uma solicitação HTTP ao banco de dados de atores para verificar se o papel está disponível.
Do ponto de vista do validador, a implementação real do serviço não é importante, então o exemplo pode apenas codificar contra a interface `ActorsService`.

À medida que a validação começa, o `UnambiguousRoleValidator` delega ao método `isRoleTaken()` do `ActorsService` com o valor atual do control.
Neste ponto, o control é marcado como `pending` e permanece neste estado até que a cadeia observable retornada do método `validate()` seja concluída.

O método `isRoleTaken()` despacha uma solicitação HTTP que verifica se o papel está disponível e retorna `Observable<boolean>` como resultado.
O método `validate()` faz o pipe da resposta através do operador `map` e a transforma em um resultado de validação.

O método então, como qualquer validador, retorna `null` se o formulário for válido e `ValidationErrors` se não for.
Este validador lida com quaisquer erros potenciais com o operador `catchError`.
Neste caso, o validador trata o erro `isRoleTaken()` como uma validação bem-sucedida, porque a falha ao fazer uma solicitação de validação não significa necessariamente que o papel é inválido.
Você poderia lidar com o erro de forma diferente e retornar o objeto `ValidationError` em vez disso.

Depois de algum tempo, a cadeia observable é concluída e a validação assíncrona é feita.
A flag `pending` é definida como `false` e a validade do formulário é atualizada.

### Adicionando validadores assíncronos a reactive forms

Para usar um validador assíncrono em reactive forms, comece injetando o validador em uma propriedade da classe do component.

<docs-code path="adev/src/content/examples/form-validation/src/app/reactive/actor-form-reactive.component.2.ts" visibleRegion="async-validator-inject"/>

Em seguida, passe a função validadora diretamente para o `FormControl` para aplicá-la.

No exemplo a seguir, a função `validate` de `UnambiguousRoleValidator` é aplicada a `roleControl` passando-a para a opção `asyncValidators` do control e vinculando-a à instância de `UnambiguousRoleValidator` que foi injetada em `ActorFormReactiveComponent`.
O valor de `asyncValidators` pode ser uma única função validadora assíncrona ou um array de funções.
Para saber mais sobre opções de `FormControl`, consulte a referência da API [AbstractControlOptions](api/forms/AbstractControlOptions).

<docs-code path="adev/src/content/examples/form-validation/src/app/reactive/actor-form-reactive.component.2.ts" visibleRegion="async-validator-usage"/>

### Adicionando validadores assíncronos a template-driven forms {#defining-custom-validators 'Read about custom validators'}

Para usar um validador assíncrono em template-driven forms, crie uma nova directive e registre o provider `NG_ASYNC_VALIDATORS` nela.

No exemplo abaixo, a directive injeta a classe `UniqueRoleValidator` que contém a lógica de validação real e a invoca na função `validate`, acionada pelo Angular quando a validação deve acontecer.

<docs-code path="adev/src/content/examples/form-validation/src/app/shared/role.directive.ts" visibleRegion="async-validator-directive"/>

Em seguida, assim como com validadores síncronos, adicione o seletor da directive a uma entrada para ativá-la.

<docs-code header="template/actor-form-template.component.html (unique-unambiguous-role-input)" path="adev/src/content/examples/form-validation/src/app/template/actor-form-template.component.html" visibleRegion="role-input"/>

### Otimizando o desempenho de validadores assíncronos

Por padrão, todos os validadores são executados após cada mudança de valor do formulário.
Com validadores síncronos, isso normalmente não tem um impacto perceptível no desempenho da aplicação.
Validadores assíncronos, no entanto, normalmente executam algum tipo de solicitação HTTP para validar o control.
Despachar uma solicitação HTTP após cada pressionamento de tecla pode sobrecarregar a API backend e deve ser evitado, se possível.

Você pode atrasar a atualização da validade do formulário alterando a propriedade `updateOn` de `change` (padrão) para `submit` ou `blur`.

Com template-driven forms, defina a propriedade no template.

<docs-code language="html">
<input [(ngModel)]="name" [ngModelOptions]="{updateOn: 'blur'}">
</docs-code>

Com reactive forms, defina a propriedade na instância `FormControl`.

<docs-code language="typescript">
new FormControl('', {updateOn: 'blur'});
</docs-code>

## Interação com validação de formulário HTML nativa

Por padrão, o Angular desabilita [validação de formulário HTML nativa](https://developer.mozilla.org/docs/Web/Guide/HTML/Constraint_validation) adicionando o atributo `novalidate` no `<form>` envolvente e usa directives para corresponder esses atributos a funções validadoras no framework.
Se você quiser usar validação nativa **em combinação** com validação baseada em Angular, pode reativá-la com a directive `ngNativeValidate`.
Consulte a [documentação da API](api/forms/NgForm#native-dom-validation-ui) para detalhes.
