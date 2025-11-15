<!-- ia-translate: true -->
<docs-decorative-header title="Templates" imgSrc="adev/src/assets/images/templates.svg"> <!-- markdownlint-disable-line -->
Use a sintaxe de template do Angular para criar interfaces de usuário dinâmicas.
</docs-decorative-header>

Templates de components não são apenas HTML estático— eles podem usar dados da sua classe de component e configurar manipuladores para interação do usuário.

## Mostrando texto dinâmico

No Angular, um _binding_ cria uma conexão dinâmica entre o template de um component e seus dados. Esta conexão garante que mudanças nos dados do component atualizem automaticamente o template renderizado.

Você pode criar um binding para mostrar algum texto dinâmico em um template usando chaves duplas:

```angular-ts
@Component({
  selector: 'user-profile',
  template: `<h1>Profile for {{userName()}}</h1>`,
})
export class UserProfile {
  userName = signal('pro_programmer_123');
}
```

Quando o Angular renderiza o component, você vê:

```html
<h1>Profile for pro_programmer_123</h1>
```

O Angular automaticamente mantém o binding atualizado quando o valor do signal muda. Construindo sobre
o exemplo acima, se atualizarmos o valor do signal `userName`:

```typescript
this.userName.set('cool_coder_789');
```

A página renderizada atualiza para refletir o novo valor:

```html
<h1>Profile for cool_coder_789</h1>
```

## Definindo propriedades e atributos dinâmicos

O Angular suporta binding de valores dinâmicos em propriedades do DOM com colchetes:

```angular-ts
@Component({
  /*...*/
  // Set the `disabled` property of the button based on the value of `isValidUserId`.
  template: `<button [disabled]="!isValidUserId()">Save changes</button>`,
})
export class UserProfile {
  isValidUserId = signal(false);
}
```

Você também pode fazer binding para _atributos_ HTML prefixando o nome do atributo com `attr.`:

```angular-html
<!-- Bind the `role` attribute on the `<ul>` element to value of `listRole`. -->
<ul [attr.role]="listRole()">
```

O Angular automaticamente atualiza propriedades e atributos do DOM quando o valor vinculado muda.

## Lidando com interação do usuário

O Angular permite que você adicione event listeners a um elemento no seu template com parênteses:

```angular-ts
@Component({
  /*...*/
  // Add an 'click' event handler that calls the `cancelSubscription` method.
  template: `<button (click)="cancelSubscription()">Cancel subscription</button>`,
})
export class UserProfile {
  /* ... */

  cancelSubscription() { /* Your event handling code goes here. */  }
}
```

Se você precisar passar o objeto [event](https://developer.mozilla.org/docs/Web/API/Event) para seu listener, você pode usar a variável embutida `$event` do Angular dentro da chamada da função:

```angular-ts
@Component({
  /*...*/
  // Add an 'click' event handler that calls the `cancelSubscription` method.
  template: `<button (click)="cancelSubscription($event)">Cancel subscription</button>`,
})
export class UserProfile {
  /* ... */

  cancelSubscription(event: Event) { /* Your event handling code goes here. */  }
}
```

## Controle de fluxo com `@if` e `@for`

Você pode condicionalmente ocultar e mostrar partes de um template com o bloco `@if` do Angular:

```angular-html
<h1>User profile</h1>

@if (isAdmin()) {
  <h2>Admin settings</h2>
  <!-- ... -->
}
```

O bloco `@if` também suporta um bloco `@else` opcional:

```angular-html
<h1>User profile</h1>

@if (isAdmin()) {
  <h2>Admin settings</h2>
  <!-- ... -->
} @else {
  <h2>User settings</h2>
  <!-- ... -->
}
```

Você pode repetir parte de um template múltiplas vezes com o bloco `@for` do Angular:

```angular-html
<h1>User profile</h1>

<ul class="user-badge-list">
  @for (badge of badges(); track badge.id) {
    <li class="user-badge">{{badge.name}}</li>
  }
</ul>
```

O Angular usa a palavra-chave `track`, mostrada no exemplo acima, para associar dados com os elementos DOM criados por `@for`. Veja [_Por que track em blocos @for é importante?_](guide/templates/control-flow#why-is-track-in-for-blocks-important) para mais informações.

DICA: Quer saber mais sobre templates do Angular? Veja o [guia detalhado de Templates](guide/templates) para todos os detalhes.

## Próximo Passo

Agora que você tem dados dinâmicos e templates na aplicação, é hora de aprender como aprimorar templates condicionalmente ocultando ou mostrando certos elementos, percorrendo elementos em loop e muito mais.

<docs-pill-row>
  <docs-pill title="Design modular com dependency injection" href="essentials/dependency-injection" />
  <docs-pill title="Guia detalhado de templates" href="guide/templates" />
</docs-pill-row>
