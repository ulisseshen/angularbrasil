<!-- ia-translate: true -->
<docs-decorative-header title="Templates" imgSrc="adev/src/assets/images/templates.svg"> <!-- markdownlint-disable-line -->
Use a sintaxe de templates do Angular para criar interfaces de usuário dinâmicas.
</docs-decorative-header>

Os templates de components não são apenas HTML estático: eles podem usar dados da classe do component e configurar handlers para a interação do usuário.

## Mostrando texto dinâmico {#showing-dynamic-text}

No Angular, um _binding_ cria uma conexão dinâmica entre o template de um component e os seus dados. Essa conexão garante que mudanças nos dados do component atualizem automaticamente o template renderizado.

Você pode criar um binding para mostrar algum texto dinâmico em um template usando chaves duplas:

```angular-ts
@Component({
  selector: 'user-profile',
  template: `<h1>Profile for {{ userName() }}</h1>`,
})
export class UserProfile {
  userName = signal('pro_programmer_123');
}
```

Quando o Angular renderiza o component, você vê:

```html
<h1>Profile for pro_programmer_123</h1>
```

O Angular mantém o binding atualizado automaticamente quando o valor do signal muda. Continuando o exemplo acima, se atualizarmos o valor do signal `userName`:

```typescript
this.userName.set('cool_coder_789');
```

A página renderizada é atualizada para refletir o novo valor:

```html
<h1>Profile for cool_coder_789</h1>
```

## Definindo propriedades e atributos dinâmicos {#setting-dynamic-properties-and-attributes}

O Angular permite fazer o binding de valores dinâmicos em propriedades do DOM usando colchetes:

```angular-ts
@Component({
  /*...*/
  // Define a propriedade `disabled` do botão com base no valor de `isValidUserId`.
  template: `<button [disabled]="!isValidUserId()">Save changes</button>`,
})
export class UserProfile {
  isValidUserId = signal(false);
}
```

Você também pode fazer binding com atributos HTML, prefixando o nome do atributo com `attr.`:

```angular-html
<!-- Vincula o atributo `role` do elemento `<ul>` ao valor de `listRole`. -->
<ul [attr.role]="listRole()"></ul>
```

O Angular atualiza automaticamente as propriedades e os atributos do DOM quando o valor vinculado muda.

## Lidando com a interação do usuário {#handling-user-interaction}

O Angular permite adicionar event listeners a um elemento do template usando parênteses:

```angular-ts
@Component({
  /*...*/
  // Adiciona um handler de evento 'click' que chama o método `cancelSubscription`.
  template: `<button (click)="cancelSubscription()">Cancel subscription</button>`,
})
export class UserProfile {
  /* ... */

  cancelSubscription() {
    /* Seu código de tratamento de evento vai aqui. */
  }
}
```

Se você precisar passar o objeto [event](https://developer.mozilla.org/docs/Web/API/Event) para o seu listener, pode usar a variável integrada `$event` do Angular dentro da chamada da função:

```angular-ts
@Component({
  /*...*/
  // Adiciona um handler de evento 'click' que chama o método `cancelSubscription`.
  template: `<button (click)="cancelSubscription($event)">Cancel subscription</button>`,
})
export class UserProfile {
  /* ... */

  cancelSubscription(event: Event) {
    /* Seu código de tratamento de evento vai aqui. */
  }
}
```

## Controle de fluxo com `@if` e `@for` {#control-flow-with-if-and-for}

Você pode ocultar e mostrar condicionalmente partes de um template com o bloco `@if` do Angular:

```angular-html
<h1>User profile</h1>

@if (isAdmin()) {
  <h2>Admin settings</h2>
  <!-- ... -->
}
```

O bloco `@if` também oferece suporte a um bloco `@else` opcional:

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

Você pode repetir parte de um template várias vezes com o bloco `@for` do Angular:

```angular-html
<h1>User profile</h1>

<ul class="user-badge-list">
  @for (badge of badges(); track badge.id) {
    <li class="user-badge">{{ badge.name }}</li>
  }
</ul>
```

O Angular usa a palavra-chave `track`, mostrada no exemplo acima, para associar dados aos elementos do DOM criados pelo `@for`. Veja [_Por que track nos blocos @for é importante?_](guide/templates/control-flow#why-is-track-in-for-blocks-important) para mais informações.

TIP: Quer saber mais sobre templates do Angular? Veja o [guia detalhado de Templates](guide/templates) para todos os detalhes.

## Próximo passo {#next-step}

Agora que você tem dados dinâmicos e templates na aplicação, é hora de aprender a aprimorar os templates, ocultando ou mostrando elementos condicionalmente, percorrendo elementos em loop e muito mais.

<docs-pill-row>
  <docs-pill title="Forms com Signals" href="essentials/signal-forms" />
  <docs-pill title="Guia detalhado de templates" href="guide/templates" />
</docs-pill-row>
