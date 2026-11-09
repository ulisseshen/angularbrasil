<!-- ia-translate: true -->
# Agrupando elementos com ng-container {#grouping-elements-with-ng-container}

`<ng-container>` é um elemento especial do Angular que agrupa vários elementos juntos ou marca uma localização em um template sem renderizar um elemento real no DOM.

```angular-html
<!-- Template do component -->
<section>
  <ng-container>
    <h3>User bio</h3>
    <p>Here's some info about the user</p>
  </ng-container>
</section>
```

```angular-html
<!-- DOM renderizado -->
<section>
  <h3>User bio</h3>
  <p>Here's some info about the user</p>
</section>
```

Você pode aplicar directives ao `<ng-container>` para adicionar comportamentos ou configurações a uma parte do seu template.

O Angular ignora class bindings, style bindings, event listeners do DOM e atributos estáticos aplicados ao `<ng-container>`, inclusive os aplicados por meio de directives. Attribute bindings causam erros, e property bindings funcionam apenas para inputs de directives.

## Usando `<ng-container>` para exibir conteúdo dinâmico {#using-ng-container-to-display-dynamic-contents}

`<ng-container>` pode atuar como um placeholder para renderizar conteúdo dinâmico.

### Renderizando components {#rendering-components}

Você pode usar a directive built-in do Angular `NgComponentOutlet` para renderizar dinamicamente um component na localização do `<ng-container>`.

```angular-ts
@Component({
  template: `
    <h2>Your profile</h2>
    <ng-container [ngComponentOutlet]="profileComponent()" />
  `,
})
export class UserProfile {
  isAdmin = input(false);
  profileComponent = computed(() => (this.isAdmin() ? AdminProfile : BasicUserProfile));
}
```

No exemplo acima, a directive `NgComponentOutlet` renderiza dinamicamente `AdminProfile` ou `BasicUserProfile` na localização do elemento `<ng-container>`.

### Renderizando fragmentos de template {#rendering-template-fragments}

Você pode usar a directive built-in do Angular `NgTemplateOutlet` para renderizar dinamicamente um fragmento de template na localização do `<ng-container>`.

```angular-ts
@Component({
  template: `
    <h2>Your profile</h2>
    <ng-container [ngTemplateOutlet]="profileTemplate()" />

    <ng-template #admin>This is the admin profile</ng-template>
    <ng-template #basic>This is the basic profile</ng-template>
  `,
})
export class UserProfile {
  isAdmin = input(false);
  adminTemplate = viewChild('admin', {read: TemplateRef});
  basicTemplate = viewChild('basic', {read: TemplateRef});
  profileTemplate = computed(() => (this.isAdmin() ? this.adminTemplate() : this.basicTemplate()));
}
```

No exemplo acima, a directive `ngTemplateOutlet` renderiza dinamicamente um dos dois fragmentos de template na localização do elemento `<ng-container>`.

Para mais informações sobre `NgTemplateOutlet`, consulte a [página de documentação da API do NgTemplateOutlet](/api/common/NgTemplateOutlet).

## Usando `<ng-container>` com structural directives {#using-ng-container-with-structural-directives}

Você também pode aplicar structural directives a elementos `<ng-container>`. Exemplos comuns são `ngIf` e `ngFor`.

```angular-html
<ng-container *ngIf="permissions == 'admin'">
  <h1>Admin Dashboard</h1>
  <admin-infographic />
</ng-container>

<ng-container *ngFor="let item of items; index as i; trackBy: trackByFn">
  <h2>{{ item.title }}</h2>
  <p>{{ item.description }}</p>
</ng-container>
```

## Usando `<ng-container>` para injeção {#using-ng-container-for-injection}

Consulte o [guia de Dependency Injection](/guide/di) para mais informações sobre o sistema de injeção de dependência do Angular.

Quando você aplica uma directive a um `<ng-container>`, elementos descendentes podem injetar a directive ou qualquer coisa que ela forneça. Use isso quando quiser fornecer declarativamente um valor a uma parte específica do seu template.

```angular-ts
@Directive({
  selector: '[theme]',
})
export class Theme {
  // Cria um input que aceita 'light' ou 'dark`, com 'light' como padrão.
  mode = input<'light' | 'dark'>('light');
}
```

```angular-html
<ng-container theme="dark">
  <profile-pic />
  <user-bio />
</ng-container>
```

No exemplo acima, os components `ProfilePic` e `UserBio` podem injetar a directive `Theme` e aplicar estilos com base no seu `mode`.
