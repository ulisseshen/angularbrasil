<!-- ia-translate: true -->

# Verificação de tipo em template

## Visão geral da verificação de tipo em template {#overview-of-template-type-checking}

Assim como o TypeScript detecta erros de tipo no seu código, o Angular verifica as expressões e os bindings dentro dos templates da sua aplicação e pode reportar quaisquer erros de tipo que encontrar.
Por padrão, o Angular verifica os templates no modo estrito.
Se necessário, você pode desativar temporariamente definindo a flag `strictTemplates` nas [opções do compilador Angular](reference/configs/angular-compiler-options) como `false`, o que volta para um modo básico menos rigoroso.

### Modo básico {#basic-mode}

No modo de verificação de tipo básico, com a flag `strictTemplates` definida como `false`, o Angular valida apenas as expressões de nível superior em um template.

Se você escrever `<map [city]="user.address.city">`, o compilador verifica o seguinte:

- `user` é uma propriedade na classe do component
- `user` é um objeto com uma propriedade address
- `user.address` é um objeto com uma propriedade city

O compilador não verifica se o valor de `user.address.city` é atribuível ao input city do component `<map>`.

O compilador também tem algumas limitações importantes neste modo:

- Importante: ele não verifica as views embarcadas, como `@if`, `@for`, `*ngIf`, `*ngFor` ou outras views embarcadas de `<ng-template>`.
- Ele não descobre os tipos de `#refs`, os resultados de pipes nem o tipo de `$event` nos event bindings.

Em muitos casos, essas coisas acabam com o tipo `any`, o que pode fazer com que partes subsequentes da expressão não sejam verificadas.

### Modo estrito {#strict-mode}

O modo estrito é o padrão e é habilitado quando a flag `strictTemplates` é `true` ou não está definida.

No modo estrito, o Angular faz o seguinte:

- Verifica as views embarcadas \(como as que estão dentro de `@if`, `@for`, `*ngIf` ou `*ngFor`\)
- Infere o tipo de retorno correto dos pipes
- Infere o tipo correto de referências locais a directives e pipes
- Verifica se os bindings de component/directive são atribuíveis aos seus `input()`s
- Respeita a flag `strictNullChecks` do TypeScript ao validar input bindings
- Infere o tipo correto de components/directives, incluindo genéricos
- Infere os tipos de contexto de template quando configurados \(por exemplo, permitindo a verificação de tipo correta do `NgFor`\)
- Infere o tipo correto de `$event` em bindings de eventos de component/directive, DOM e animação
- Infere o tipo correto de referências locais a elementos DOM, com base no nome da tag \(por exemplo, o tipo que `document.createElement` retornaria para aquela tag\)

## Verificação de `*ngFor` {#checking-of-ngfor}

Os dois modos de verificação de tipo tratam as views embarcadas de forma diferente.
Considere o seguinte exemplo.

```ts {header:"Interface do usuário"}
interface User {
  name: string;
  address: {
    city: string;
    state: string;
  };
}
```

```html
<div *ngFor="let user of users">
  <h2>{{config.title}}</h2>
  <span>City: {{user.address.city}}</span>
</div>
```

O `<h2>` e o `<span>` estão na view embarcada do `*ngFor`.
No modo básico, o Angular não verifica nenhum dos dois.
No modo estrito, o Angular sabe que o `user` no `<span>` tem o tipo `User`, e que `address` é um objeto com uma propriedade `city` do tipo `string`.

## Solução de problemas de erros de template {#troubleshooting-template-errors}

No modo estrito, você pode encontrar erros de template que não apareciam no modo básico.
Esses erros geralmente representam incompatibilidades de tipo genuínas nos templates que não foram detectadas pelas ferramentas anteriores.
Se for esse o caso, a mensagem de erro deve deixar claro onde no template o problema ocorre.

Também podem ocorrer falsos positivos quando os tipos de uma biblioteca Angular estão incompletos ou incorretos, ou quando os tipos não correspondem às expectativas, como nos casos a seguir.

- Quando os tipos de uma biblioteca estão errados ou incompletos \(por exemplo, faltando `null | undefined` se a biblioteca não foi escrita pensando em `strictNullChecks`\)
- Quando os tipos de input de uma biblioteca são restritivos demais e a biblioteca não adicionou metadados apropriados para que o Angular identifique isso.
  Isso geralmente acontece com inputs booleanos desabilitados ou outros inputs booleanos comuns usados como atributos, por exemplo, `<input disabled>`.

- Ao usar `$event.target` em eventos DOM \(por causa da possibilidade de propagação de eventos, `$event.target` nos tipos do DOM não tem o tipo que você pode esperar\)

Em caso de falso positivo como esses, existem algumas opções:

- Use a função de cast de tipo `$any()` em determinados contextos para desativar a verificação de tipo de parte de uma expressão
- Desative as verificações estritas por completo definindo `strictTemplates: false` no arquivo de configuração do TypeScript da aplicação, `tsconfig.json`
- Desative operações específicas de verificação de tipo individualmente, mantendo o rigor em outros aspectos, definindo uma _flag de rigor_ como `false`
- Se você quiser usar `strictTemplates` e `strictNullChecks` juntos, desative especificamente a verificação estrita de tipos nulos para input bindings usando `strictNullInputTypes`

Cada uma das opções a seguir é definida com o valor de `strictTemplates` \(`true` quando `strictTemplates` é `true` e vice-versa\):

| Flag de rigor               | Efeito                                                                                                                                                                                                                                                                                  |
| :-------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `strictInputTypes`          | Se a atribuibilidade de uma expressão de binding ao campo `@Input()` é verificada. Também afeta a inferência de tipos genéricos de directives.                                                                                                                                          |
| `strictNullInputTypes`      | Se `strictNullChecks` é respeitado ao verificar bindings de `@Input()` \(de acordo com `strictInputTypes`\). Desativar essa opção pode ser útil ao usar uma biblioteca que não foi construída pensando em `strictNullChecks`.                                                              |
| `strictAttributeTypes`      | Se os bindings de `@Input()` feitos com atributos de texto são verificados. Por exemplo, `<input matInput disabled="true">` \(define a propriedade `disabled` como a string `'true'`\) versus `<input matInput [disabled]="true">` \(define a propriedade `disabled` como o boolean `true`\). |
| `strictSafeNavigationTypes` | Se o tipo de retorno das operações de navegação segura é corretamente inferido \(por exemplo, `user?.name` será inferido corretamente com base no tipo de `user`\). Se desabilitado, `user?.name` será do tipo `any`.                                                                        |
| `strictDomLocalRefTypes`    | Se as referências locais a elementos DOM terão o tipo correto. Se desabilitado, `ref` será do tipo `any` para `<input #ref>`.                                                                                                                                                          |
| `strictOutputEventTypes`    | Se `$event` terá o tipo correto nos event bindings para um `@Output()` de component/directive, ou para eventos de animação. Se desabilitado, será `any`.                                                                                                                                  |
| `strictDomEventTypes`       | Se `$event` terá o tipo correto nos event bindings para eventos DOM. Se desabilitado, será `any`.                                                                                                                                                                                       |
| `strictContextGenerics`     | Se os parâmetros de tipo de components genéricos serão inferidos corretamente \(incluindo quaisquer limites genéricos\). Se desabilitado, quaisquer parâmetros de tipo serão `any`.                                                                                                       |
| `strictLiteralTypes`        | Se literais de objeto e de array declarados no template terão o tipo inferido. Se desabilitado, o tipo desses literais será `any`.                                                                                                                                                      |

Outras opções (independentes de `strictTemplates`):

| Flag de rigor                | Efeito                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| :--------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `strictInputAccessModifiers` | Se modificadores de acesso como `private`/`protected`/`readonly` são respeitados ao atribuir uma expressão de binding a um `@Input()` ou `input()`. Se desabilitado, os modificadores de acesso do input são ignorados; apenas o tipo é verificado. Observação: essa verificação se aplica apenas a inputs, não a outputs.                                                                                                                                                                                                                                                                                                                         |
| `strictUnclaimedEventNames`  | Se os event bindings cujo nome não corresponde nem a um output de uma directive aplicada ao elemento nem a um evento DOM nativo conhecido \(os descritos por `GlobalEventHandlersEventMap` do TypeScript, comparados sem diferenciar maiúsculas de minúsculas\) devem ser reportados, o que geralmente indica um nome de output digitado errado. Apenas nomes em camelCase de um único identificador são verificados; nomes separados por hífen \(por exemplo, `my-event`\), que eventos customizados disparados por descendentes costumam usar, são isentos, assim como elementos sem component correspondente quando `CUSTOM_ELEMENTS_SCHEMA` está em uso. Esta opção é `false` por padrão, mesmo com `strictTemplates` definido como `true`. |

Se você ainda tiver problemas depois de solucionar com essas flags, a opção de último recurso é voltar ao modo básico desabilitando `strictTemplates`.

Um erro de verificação de tipo que você não consegue resolver com nenhum dos métodos recomendados pode ser resultado de um bug no próprio verificador de tipos de template.
Se você obtiver erros que exigem voltar ao modo básico, é provável que seja um bug desse tipo.
Se isso acontecer, [abra um issue](https://github.com/angular/angular/issues) para que a equipe possa resolvê-lo.

## Inputs e verificação de tipo {#inputs-and-type-checking}

O verificador de tipos de template confere se o tipo de uma expressão de binding é compatível com o do input da directive correspondente.
Como exemplo, considere o seguinte component:

```angular-ts
export interface User {
  name: string;
}

@Component({
  selector: 'user-detail',
  template: '{{ user().name }}',
})
export class UserDetailComponent {
  user = input.required<User>();
}
```

O template de `AppComponent` usa este component da seguinte forma:

```angular-ts
@Component({
  selector: 'app-root',
  template: '<user-detail [user]="selectedUser"></user-detail>',
})
export class AppComponent {
  selectedUser: User | null = null;
}
```

Aqui, durante a verificação de tipos do template de `AppComponent`, o binding `[user]="selectedUser"` corresponde ao input `UserDetailComponent.user`.
Portanto, o Angular atribui a propriedade `selectedUser` a `UserDetailComponent.user`, o que resultaria em erro se os tipos fossem incompatíveis.
O TypeScript verifica a atribuição de acordo com o seu sistema de tipos, respeitando flags como `strictNullChecks`, conforme configuradas na aplicação.

Evite erros de tipo em tempo de execução fornecendo requisitos de tipo mais específicos no template para o verificador de tipos.
Torne os requisitos de tipo de input das suas próprias directives o mais específicos possível, fornecendo funções template-guard na definição da directive.
Veja [Melhorando a verificação de tipos de template para directives customizadas](/guide/directives/structural-directives#improving-template-type-checking-for-custom-directives) neste guia.

### Verificações estritas de nulo {#strict-null-checks}

Quando você habilita `strictTemplates` e a flag `strictNullChecks` do TypeScript, podem ocorrer erros de verificação de tipo em certas situações que nem sempre são fáceis de evitar.
Por exemplo:

- Um valor nulável vinculado a uma directive de uma biblioteca que não tinha `strictNullChecks` habilitado.

  Para uma biblioteca compilada sem `strictNullChecks`, seus arquivos de declaração não indicam se um campo pode ser `null` ou não.
  Em situações nas quais a biblioteca trata `null` corretamente, isso é problemático, pois o compilador verifica o valor nulável contra os arquivos de declaração, que omitem o tipo `null`.
  Assim, o compilador produz um erro de verificação de tipo porque segue `strictNullChecks`.

- Usar o pipe `async` com um Observable que você sabe que emitirá de forma síncrona.

  O pipe `async` atualmente assume que o Observable ao qual se inscreve pode ser assíncrono, o que significa que pode não haver valor disponível ainda.
  Nesse caso, ele ainda precisa retornar algo, que é `null`.
  Em outras palavras, o tipo de retorno do pipe `async` inclui `null`, o que pode gerar erros em situações nas quais se sabe que o Observable emite um valor não nulável de forma síncrona.

Há duas soluções possíveis para os problemas anteriores:

- No template, inclua o operador de asserção não nula `!` no final de uma expressão nulável, como

```html
<user-detail [user]="user!"></user-detail>
```

Neste exemplo, o compilador desconsidera incompatibilidades de tipo em relação à nulabilidade, assim como no código TypeScript.
No caso do pipe `async`, observe que a expressão precisa estar entre parênteses, como em

```html
<user-detail [user]="(user$ | async)!"></user-detail>
```

- Desative completamente as verificações estritas de nulo nos templates Angular.

  Quando `strictTemplates` está habilitado, ainda é possível desativar certos aspectos da verificação de tipo.
  Definir a opção `strictNullInputTypes` como `false` desabilita as verificações estritas de nulo dentro dos templates Angular.
  Essa flag se aplica a todos os components que fazem parte da aplicação.

### Conselho para autores de bibliotecas {#advice-for-library-authors}

Como autor de biblioteca, você pode tomar várias medidas para oferecer uma experiência ideal aos seus usuários.
Primeiro, habilitar `strictNullChecks` e incluir `null` no tipo de um input, quando apropriado, comunica aos consumidores se eles podem fornecer um valor nulável ou não.
Além disso, é possível fornecer dicas de tipo específicas para o verificador de tipos de template.
Veja [Melhorando a verificação de tipos de template para directives customizadas](/guide/directives/structural-directives#improving-template-type-checking-for-custom-directives) e [Coerção de setter de input](#input-setter-coercion).

## Coerção de setter de input {#input-setter-coercion}

Às vezes é desejável que a propriedade `input()` de uma directive ou component altere o valor que é vinculado a ela, normalmente usando uma função `transform` para o input.
Como exemplo, considere este component de botão customizado:

Considere a seguinte directive:

```angular-ts
@Component({
  selector: 'submit-button',
  template: `
    <div class="wrapper">
      <button [disabled]="disabled()">Submit</button>
    </div>
  `,
})
class SubmitButton {
  disabled = input.required({transform: booleanAttribute});
}
```

Aqui, o input `disabled` do component está sendo repassado para o `<button>` no template.
Tudo isso funciona como esperado, desde que um valor `boolean` seja vinculado ao input.
Mas suponha que um consumidor use esse input no template como um atributo:

```html
<submit-button disabled></submit-button>
```

Isso tem o mesmo efeito que o binding:

```html
<submit-button [disabled]="''"></submit-button>
```

Em tempo de execução, o input será definido como string vazia, que não é um valor `boolean`.
Bibliotecas de components Angular que lidam com esse problema frequentemente "coagem" o valor para o tipo correto no setter:

```ts
set disabled(value: boolean) {
  this._disabled = (value === '') || value;
}
```

Seria ideal alterar o tipo de `value` aqui, de `boolean` para `boolean|''`, para corresponder ao conjunto de valores que o setter realmente aceita.
O TypeScript anterior à versão 4.3 exige que o getter e o setter tenham o mesmo tipo, então, se o getter deve retornar um `boolean`, o setter fica preso ao tipo mais restrito.

Se o consumidor tiver a verificação de tipos mais estrita do Angular para templates habilitada, isso cria um problema: a string vazia \(`''`\) não é atribuível ao campo `disabled`, o que gera um erro de tipo quando a forma de atributo é usada.

Como solução para esse problema, o Angular permite verificar um tipo mais amplo e permissivo para o `@Input()` do que o declarado para o próprio campo de input.
Para habilitar isso, adicione uma propriedade estática com o prefixo `ngAcceptInputType_` à classe do component:

```ts
class SubmitButton {
  private _disabled: boolean;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = value === '' || value;
  }

  static ngAcceptInputType_disabled: boolean | '';
}
```

Desde o TypeScript 4.3, o setter poderia ter sido declarado para aceitar `boolean|''` como tipo, o que torna os campos de coerção de setter de input obsoletos.
Por isso, os campos de coerção de setters de input foram descontinuados.

Este campo não precisa ter um valor.
A sua existência comunica ao verificador de tipos do Angular que o input `disabled` deve ser considerado como aceitando bindings que correspondam ao tipo `boolean|''`.
O sufixo deve ser o nome do _campo_ `@Input`.

Deve-se tomar cuidado: se um override `ngAcceptInputType_` estiver presente para determinado input, o setter deve ser capaz de lidar com quaisquer valores do tipo sobrescrito.

## Desabilitando verificação de tipo usando `$any()` {#disabling-type-checking-using-any}

Desabilite a verificação de uma expressão de binding envolvendo a expressão em uma chamada à pseudo-função de cast `$any()`.
O compilador a trata como um cast para o tipo `any`, assim como no TypeScript quando um cast `<any>` ou `as any` é usado.

No exemplo a seguir, fazer o cast de `person` para o tipo `any` suprime o erro `Property address does not exist`.

```angular-ts
@Component({
  selector: 'my-component',
  template: '{{$any(person).address.street}}',
})
class MyComponent {
  person?: Person;
}
```
