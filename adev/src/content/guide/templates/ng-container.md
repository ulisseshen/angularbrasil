<!-- ia-translate: true -->
# Agrupando elementos com ng-container

`<ng-container>` é um elemento especial no Angular que agrupa múltiplos elementos juntos ou marca uma localização em um template sem renderizar um elemento real no DOM.

```angular-html
<!-- Component template -->
<section>
  <ng-container>
    <h3>User bio</h3>
    <p>Here's some info about the user</p>
  </ng-container>
</section>
```

```angular-html
<!-- Rendered DOM -->
<section>
  <h3>User bio</h3>
  <p>Here's some info about the user</p>
</section>
```

Você pode aplicar directives ao `<ng-container>` para adicionar comportamentos ou configurações a uma parte do seu template.

O Angular ignora todos os attribute bindings e event listeners aplicados ao `<ng-container>`, incluindo aqueles aplicados via directive.

## Usando `<ng-container>` para exibir conteúdo dinâmico

`<ng-container>` pode atuar como um espaço reservado para renderizar conteúdo dinâmico.

### Renderizando components

Você pode usar a directive built-in do Angular `NgComponentOutlet` para renderizar dinamicamente um component na localização do `<ng-container>`.

```angular-ts
@Component({
  template: `
    <h2>Your profile</h2>
    <ng-container [ngComponentOutlet]="profileComponent()" />
  `
})
export class UserProfile {
  isAdmin = input(false);
  profileComponent = computed(() => this.isAdmin() ? AdminProfile : BasicUserProfile);
}
```

No exemplo acima, a directive `NgComponentOutlet` renderiza dinamicamente `AdminProfile` ou `BasicUserProfile` na localização do elemento `<ng-container>`.

### Renderizando fragmentos de template

Você pode usar a directive built-in do Angular `NgTemplateOutlet` para renderizar dinamicamente um fragmento de template na localização do `<ng-container>`.

```angular-ts
@Component({
  template: `
    <h2>Your profile</h2>
    <ng-container [ngTemplateOutlet]="profileTemplate()" />

    <ng-template #admin>This is the admin profile</ng-template>
    <ng-template #basic>This is the basic profile</ng-template>
  `
})
export class UserProfile {
  isAdmin = input(false);
  adminTemplate = viewChild('admin', {read: TemplateRef});
  basicTemplate = viewChild('basic', {read: TemplateRef});
  profileTemplate = computed(() => this.isAdmin() ? this.adminTemplate() : this.basicTemplate());
}
```

No exemplo acima, a directive `ngTemplateOutlet` renderiza dinamicamente um dos dois fragmentos de template na localização do elemento `<ng-container>`.

Para mais informações sobre NgTemplateOutlet, consulte a [página da documentação da API NgTemplateOutlet](/api/common/NgTemplateOutlet).

## Usando `<ng-container>` com structural directives

Você também pode aplicar structural directives a elementos `<ng-container>`. Exemplos comuns disso incluem `ngIf` e `ngFor`.

```angular-html
<ng-container *ngIf="permissions == 'admin'">
  <h1>Admin Dashboard</h1>
  <admin-infographic></admin-infographic>
</ng-container>

<ng-container *ngFor="let item of items; index as i; trackBy: trackByFn">
  <h2>{{ item.title }}</h2>
  <p>{{ item.description }}</p>
</ng-container>
```

## Usando `<ng-container>` para injeção

Consulte o guia de Dependency Injection para mais informações sobre o sistema de injeção de dependência do Angular.

Quando você aplica uma directive ao `<ng-container>`, elementos descendentes podem injetar a directive ou qualquer coisa que a directive forneça. Use isso quando você quiser fornecer declarativamente um valor para uma parte específica do seu template.

```angular-ts
@Directive({
  selector: '[theme]',
})
export class Theme {
  // Create an input that accepts 'light' or 'dark`, defaulting to 'light'.
  mode = input<'light' | 'dark'>('light');
}
```

```angular-html
<ng-container theme="dark">
  <profile-pic />
  <user-bio />
</ng-container>
```

No exemplo acima, os components `ProfilePic` e `UserBio` podem injetar a directive `Theme` e aplicar estilos baseados no seu `mode`.
