<!-- ia-translate: true -->
# Verificação de tipo em template

## Visão geral da verificação de tipo em template

Assim como TypeScript detecta erros de tipo em seu código, Angular verifica as expressões e bindings dentro dos templates de sua aplicação e pode reportar quaisquer erros de tipo que encontrar.
Angular atualmente tem três modos de fazer isso, dependendo do valor das flags `fullTemplateTypeCheck` e `strictTemplates` nas [opções do compilador Angular](reference/configs/angular-compiler-options).

### Modo básico

No modo de verificação de tipo mais básico, com a flag `fullTemplateTypeCheck` definida como `false`, Angular valida apenas expressões de nível superior em um template.

Se você escreve `<map [city]="user.address.city">`, o compilador verifica o seguinte:

- `user` é uma propriedade na classe do component
- `user` é um objeto com uma propriedade address
- `user.address` é um objeto com uma propriedade city

O compilador não verifica se o valor de `user.address.city` é atribuível ao input city do component `<map>`.

O compilador também tem algumas limitações importantes neste modo:

- Importante, ele não verifica views embarcadas, como `*ngIf`, `*ngFor`, outras views embarcadas `<ng-template>`.
- Ele não descobre os tipos de `#refs`, os resultados de pipes ou o tipo de `$event` em event bindings.

Em muitos casos, essas coisas acabam como tipo `any`, o que pode fazer com que partes subsequentes da expressão não sejam verificadas.

### Modo completo

Se a flag `fullTemplateTypeCheck` está definida como `true`, Angular é mais agressivo em sua verificação de tipo dentro de templates.
Em particular:

- Views embarcadas \(como aquelas dentro de um `*ngIf` ou `*ngFor`\) são verificadas
- Pipes têm o tipo de retorno correto
- Referências locais a directives e pipes têm o tipo correto \(exceto para quaisquer parâmetros genéricos, que serão `any`\)

O seguinte ainda tem tipo `any`.

- Referências locais a elementos DOM
- O objeto `$event`
- Expressões de navegação segura

IMPORTANTE: A flag `fullTemplateTypeCheck` foi descontinuada no Angular 13.
A família de opções do compilador `strictTemplates` deve ser usada em seu lugar.

### Modo estrito

Angular mantém o comportamento da flag `fullTemplateTypeCheck` e introduz um terceiro "modo estrito".
Modo estrito é um superconjunto do modo completo e é acessado definindo a flag `strictTemplates` como true.
Esta flag substitui a flag `fullTemplateTypeCheck`.

Além do comportamento do modo completo, Angular faz o seguinte:

- Verifica se bindings de component/directive são atribuíveis aos seus `input()`s
- Obedece a flag `strictNullChecks` do TypeScript ao validar o modo anterior
- Infere o tipo correto de components/directives, incluindo genéricos
- Infere tipos de contexto de template onde configurado \(por exemplo, permitindo verificação de tipo correta de `NgFor`\)
- Infere o tipo correto de `$event` em bindings de evento de component/directive, DOM e animação
- Infere o tipo correto de referências locais a elementos DOM, baseado no nome da tag \(por exemplo, o tipo que `document.createElement` retornaria para aquela tag\)

## Verificação de `*ngFor`

Os três modos de verificação de tipo tratam views embarcadas de forma diferente.
Considere o seguinte exemplo.

<docs-code language="typescript" header="User interface">

interface User {
name: string;
address: {
city: string;
state: string;
}
}

</docs-code>

```html

<div *ngFor="let user of users">
  <h2>{{config.title}}</h2>
  <span>City: {{user.address.city}}</span>
</div>

```

O `<h2>` e o `<span>` estão na view embarcada do `*ngFor`.
No modo básico, Angular não verifica nenhum deles.
No entanto, no modo completo, Angular verifica se `config` e `user` existem e assume um tipo de `any`.
No modo estrito, Angular sabe que o `user` no `<span>` tem um tipo de `User`, e que `address` é um objeto com uma propriedade `city` do tipo `string`.

## Solução de problemas de erros de template

Com o modo estrito, você pode encontrar erros de template que não surgiram em nenhum dos modos anteriores.
Esses erros geralmente representam incompatibilidades de tipo genuínas nos templates que não foram capturadas pela ferramenta anterior.
Se este for o caso, a mensagem de erro deve deixar claro onde no template o problema ocorre.

Também pode haver falsos positivos quando os tipos de uma biblioteca Angular estão incompletos ou incorretos, ou quando os tipos não se alinham perfeitamente com as expectativas, como nos seguintes casos.

- Quando os tipos de uma biblioteca estão errados ou incompletos \(por exemplo, faltando `null | undefined` se a biblioteca não foi escrita com `strictNullChecks` em mente\)
- Quando os tipos de entrada de uma biblioteca são muito estreitos e a biblioteca não adicionou metadados apropriados para Angular descobrir isso.
  Isso geralmente ocorre com inputs Boolean desabilitados ou outros comuns usados como atributos, por exemplo, `<input disabled>`.

- Ao usar `$event.target` para eventos DOM \(devido à possibilidade de bubbling de eventos, `$event.target` nos tipos DOM não tem o tipo que você pode esperar\)

No caso de um falso positivo como estes, existem algumas opções:

- Use a função de type-cast `$any()` em certos contextos para desabilitar a verificação de tipo para uma parte da expressão
- Desabilite verificações estritas inteiramente definindo `strictTemplates: false` no arquivo de configuração TypeScript da aplicação, `tsconfig.json`
- Desabilite certas operações de verificação de tipo individualmente, mantendo rigor em outros aspectos, definindo uma _flag de rigor_ como `false`
- Se você quiser usar `strictTemplates` e `strictNullChecks` juntos, desabilite especificamente a verificação estrita de tipo nulo para input bindings usando `strictNullInputTypes`

A menos que comentado de outra forma, cada opção seguinte é definida com o valor de `strictTemplates` \(`true` quando `strictTemplates` é `true` e inversamente, da outra forma\).

| Flag de rigor                | Efeito                                                                                                                                                                                                                                                                                                             |
| :--------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `strictInputTypes`           | Se a atribuibilidade de uma expressão de binding ao campo `@Input()` é verificada. Também afeta a inferência de tipos genéricos de directive.                                                                                                                                                                    |
| `strictInputAccessModifiers` | Se modificadores de acesso como `private`/`protected`/`readonly` são honrados ao atribuir uma expressão de binding a um `@Input()`. Se desabilitado, os modificadores de acesso do `@Input` são ignorados; apenas o tipo é verificado. Esta opção é `false` por padrão, mesmo com `strictTemplates` definido como `true`. |
| `strictNullInputTypes`       | Se `strictNullChecks` é honrado ao verificar bindings `@Input()` \(por `strictInputTypes`\). Desativar isso pode ser útil ao usar uma biblioteca que não foi construída com `strictNullChecks` em mente.                                                                                                         |
| `strictAttributeTypes`       | Se verifica bindings `@Input()` que são feitos usando atributos de texto. Por exemplo, `<input matInput disabled="true">` \(definindo a propriedade `disabled` para a string `'true'`\) vs `<input matInput [disabled]="true">` \(definindo a propriedade `disabled` para o boolean `true`\).                   |
| `strictSafeNavigationTypes`  | Se o tipo de retorno de operações de navegação segura \(por exemplo, `user?.name` será corretamente inferido com base no tipo de `user`\). Se desabilitado, `user?.name` será do tipo `any`.                                                                                                                     |
| `strictDomLocalRefTypes`     | Se referências locais a elementos DOM terão o tipo correto. Se desabilitado `ref` será do tipo `any` para `<input #ref>`.                                                                                                                                                                                         |
| `strictOutputEventTypes`     | Se `$event` terá o tipo correto para event bindings a um `@Output()` de component/directive, ou a eventos de animação. Se desabilitado, será `any`.                                                                                                                                                               |
| `strictDomEventTypes`        | Se `$event` terá o tipo correto para event bindings a eventos DOM. Se desabilitado, será `any`.                                                                                                                                                                                                                   |
| `strictContextGenerics`      | Se os parâmetros de tipo de components genéricos serão inferidos corretamente \(incluindo quaisquer limites genéricos\). Se desabilitado, quaisquer parâmetros de tipo serão `any`.                                                                                                                               |
| `strictLiteralTypes`         | Se literais de objeto e array declarados no template terão seu tipo inferido. Se desabilitado, o tipo de tais literais será `any`. Esta flag é `true` quando _tanto_ `fullTemplateTypeCheck` ou `strictTemplates` está definido como `true`.                                                                      |

Se você ainda tiver problemas após solucionar problemas com essas flags, volte ao modo completo desabilitando `strictTemplates`.

Se isso não funcionar, uma opção de último recurso é desligar o modo completo inteiramente com `fullTemplateTypeCheck: false`.

Um erro de verificação de tipo que você não pode resolver com nenhum dos métodos recomendados pode ser resultado de um bug no verificador de tipo de template.
Se você obtiver erros que exigem voltar ao modo básico, é provável que seja tal bug.
Se isso acontecer, [registre um issue](https://github.com/angular/angular/issues) para que a equipe possa resolvê-lo.

## Inputs e verificação de tipo

O verificador de tipo de template verifica se o tipo de uma expressão de binding é compatível com o do input de directive correspondente.
Como exemplo, considere o seguinte component:

```angular-ts

export interface User {
  name: string;
}

@Component({
  selector: 'user-detail',
  template: '{{ user.name }}',
})
export class UserDetailComponent {
  user = input.required<User>();
}

```

O template `AppComponent` usa este component da seguinte forma:

```angular-ts

@Component({
  selector: 'app-root',
  template: '<user-detail [user]="selectedUser"></user-detail>',
})
export class AppComponent {
  selectedUser: User | null = null;
}

```

Aqui, durante a verificação de tipo do template para `AppComponent`, o binding `[user]="selectedUser"` corresponde ao input `UserDetailComponent.user`.
Portanto, Angular atribui a propriedade `selectedUser` a `UserDetailComponent.user`, o que resultaria em um erro se seus tipos fossem incompatíveis.
TypeScript verifica a atribuição de acordo com seu sistema de tipos, obedecendo flags como `strictNullChecks` conforme configuradas na aplicação.

Evite erros de tipo em tempo de execução fornecendo requisitos de tipo mais específicos no template ao verificador de tipo de template.
Torne os requisitos de tipo de input para suas próprias directives tão específicos quanto possível fornecendo funções template-guard na definição da directive.
Veja [Melhorando a verificação de tipo de template para directives personalizadas](guide/directives/structural-directives#directive-type-checks) neste guia.

### Verificações estritas de nulo

Quando você habilita `strictTemplates` e a flag TypeScript `strictNullChecks`, erros de typecheck podem ocorrer para certas situações que podem não ser facilmente evitadas.
Por exemplo:

- Um valor nullable que está vinculado a uma directive de uma biblioteca que não tinha `strictNullChecks` habilitado.

  Para uma biblioteca compilada sem `strictNullChecks`, seus arquivos de declaração não indicarão se um campo pode ser `null` ou não.
  Para situações onde a biblioteca lida corretamente com `null`, isso é problemático, pois o compilador verificará um valor nullable contra os arquivos de declaração que omitem o tipo `null`.
  Como tal, o compilador produz um erro de verificação de tipo porque adere a `strictNullChecks`.

- Usar o pipe `async` com um Observable que você sabe que emitirá sincronamente.

  O pipe `async` atualmente assume que o Observable ao qual se inscreve pode ser assíncrono, o que significa que é possível que ainda não haja valor disponível.
  Nesse caso, ele ainda precisa retornar algo — que é `null`.
  Em outras palavras, o tipo de retorno do pipe `async` inclui `null`, o que pode resultar em erros em situações onde o Observable é conhecido por emitir um valor não-nullable sincronamente.

Existem duas soluções potenciais para os problemas anteriores:

- No template, inclua o operador de asserção não-nulo `!` no final de uma expressão nullable, como

```html

<user-detail [user]="user!"></user-detail>

```

Neste exemplo, o compilador desconsidera incompatibilidades de tipo em nulabilidade, assim como no código TypeScript.
No caso do pipe `async`, note que a expressão precisa ser envolvida em parênteses, como em

```html

<user-detail [user]="(user$ | async)!"></user-detail>

```

- Desabilite verificações estritas de nulo em templates Angular completamente.

  Quando `strictTemplates` está habilitado, ainda é possível desabilitar certos aspectos da verificação de tipo.
  Definir a opção `strictNullInputTypes` como `false` desabilita verificações estritas de nulo dentro de templates Angular.
  Esta flag se aplica a todos os components que fazem parte da aplicação.

### Conselho para autores de bibliotecas

Como autor de biblioteca, você pode tomar várias medidas para fornecer uma experiência ideal para seus usuários.
Primeiro, habilitar `strictNullChecks` e incluir `null` no tipo de um input, conforme apropriado, comunica aos seus consumidores se eles podem fornecer um valor nullable ou não.
Além disso, é possível fornecer dicas de tipo específicas para o verificador de tipo de template.
Veja [Melhorando a verificação de tipo de template para directives personalizadas](guide/directives/structural-directives#directive-type-checks) e [Coerção de setter de input](#input-setter-coercion).

## Coerção de setter de input

Ocasionalmente é desejável que a propriedade `input()` de uma directive ou component altere o valor vinculado a ela, tipicamente usando uma função `transform` para o input.
Como exemplo, considere este component de botão personalizado:

Considere a seguinte directive:

```angular-ts

@Component({
  selector: 'submit-button',
  template: `
    <div class="wrapper">
      <button [disabled]="disabled">Submit</button>
    </div>
  `,
})
class SubmitButton {
  disabled = input.required({transform: booleanAttribute });
}

```

Aqui, o input `disabled` do component está sendo passado para o `<button>` no template.
Tudo isso funciona como esperado, desde que um valor `boolean` seja vinculado ao input.
Mas, suponha que um consumidor use este input no template como um atributo:

```html

<submit-button disabled></submit-button>

```

Isso tem o mesmo efeito que o binding:

```html

<submit-button [disabled]="''"></submit-button>

```

Em tempo de execução, o input será definido como string vazia, que não é um valor `boolean`.
Bibliotecas de components Angular que lidam com este problema frequentemente "coagem" o valor para o tipo certo no setter:

```ts

set disabled(value: boolean) {
  this._disabled = (value === '') || value;
}

```

Seria ideal mudar o tipo de `value` aqui, de `boolean` para `boolean|''`, para corresponder ao conjunto de valores que são realmente aceitos pelo setter.
TypeScript anterior à versão 4.3 requer que tanto o getter quanto o setter tenham o mesmo tipo, então se o getter deve retornar um `boolean`, então o setter fica preso ao tipo mais estreito.

Se o consumidor tiver a verificação de tipo mais estrita do Angular para templates habilitada, isso cria um problema: a string vazia \(`''`\) não é realmente atribuível ao campo `disabled`, o que cria um erro de tipo quando a forma de atributo é usada.

Como uma solução para este problema, Angular suporta verificar um tipo mais amplo e permissivo para `@Input()` do que o declarado para o próprio campo de input.
Habilite isso adicionando uma propriedade estática com o prefixo `ngAcceptInputType_` à classe do component:

```ts

class SubmitButton {
  private _disabled: boolean;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = (value === '') || value;
  }

  static ngAcceptInputType_disabled: boolean|'';
}

```

Desde o TypeScript 4.3, o setter poderia ter sido declarado para aceitar `boolean|''` como tipo, tornando o campo de coerção de setter de input obsoleto.
Como tal, campos de coerção de setters de input foram descontinuados.

Este campo não precisa ter um valor.
Sua existência comunica ao verificador de tipo Angular que o input `disabled` deve ser considerado como aceitando bindings que correspondem ao tipo `boolean|''`.
O sufixo deve ser o nome do campo `@Input`.

Deve-se tomar cuidado para que se um override `ngAcceptInputType_` estiver presente para um determinado input, então o setter deve ser capaz de lidar com quaisquer valores do tipo substituído.

## Desabilitando verificação de tipo usando `$any()`

Desabilite a verificação de uma expressão de binding envolvendo a expressão em uma chamada à pseudo-função de cast `$any()`.
O compilador a trata como um cast para o tipo `any` assim como no TypeScript quando um cast `<any>` ou `as any` é usado.

No exemplo a seguir, fazer cast de `person` para o tipo `any` suprime o erro `Property address does not exist`.

```angular-ts

@Component({
  selector: 'my-component',
  template: '{{$any(person).address.street}}'
})
class MyComponent {
  person?: Person;
}

```
