<!-- ia-translate: true -->
# NgModules

IMPORTANT: A equipe Angular recomenda usar [components standalone](guide/components/anatomy-of-components#-imports-in-the-component-decorator) em vez de `NgModule` para todo código novo. Use este guia para entender código existente construído com `@NgModule`.

Um NgModule é uma classe marcada pelo decorator `@NgModule`. Este decorator aceita _metadata_ que informa ao Angular como compilar templates de component e configurar injeção de dependência.

```typescript
import {NgModule} from '@angular/core';

@NgModule({
  // Metadata goes here
})
export class CustomMenuModule { }
```

Um NgModule tem duas responsabilidades principais:

- Declarar components, directives e pipes que pertencem ao NgModule
- Adicionar providers ao injector para components, directives e pipes que importam o NgModule

## Declarações

A propriedade `declarations` da metadata `@NgModule` declara os components, directives e pipes que pertencem ao NgModule.

```typescript
@NgModule({
  /* ... */
  // CustomMenu and CustomMenuItem are components.
  declarations: [CustomMenu, CustomMenuItem],
})
export class CustomMenuModule { }
```

No exemplo acima, os components `CustomMenu` e `CustomMenuItem` pertencem a `CustomMenuModule`.

A propriedade `declarations` também aceita _arrays_ de components, directives e pipes. Esses arrays, por sua vez, também podem conter outros arrays.

```typescript
const MENU_COMPONENTS = [CustomMenu, CustomMenuItem];
const WIDGETS = [MENU_COMPONENTS, CustomSlider];

@NgModule({
  /* ... */
  // This NgModule declares all of CustomMenu, CustomMenuItem,
  // CustomSlider, and CustomCheckbox.
  declarations: [WIDGETS, CustomCheckbox],
})
export class CustomMenuModule { }
```

Se o Angular descobrir quaisquer components, directives ou pipes declarados em mais de um NgModule, ele reporta um erro.

Quaisquer components, directives ou pipes devem ser explicitamente marcados como `standalone: false` para serem declarados em um NgModule.

```typescript
@Component({
  // Mark this component as `standalone: false` so that it can be declared in an NgModule.
  standalone: false,
  /* ... */
})
export class CustomMenu { /* ... */ }
```

### imports

Components declarados em um NgModule podem depender de outros components, directives e pipes. Adicione essas dependências à propriedade `imports` da metadata `@NgModule`.

```typescript
@NgModule({
  /* ... */
  // CustomMenu and CustomMenuItem depend on the PopupTrigger and SelectorIndicator components.
  imports: [PopupTrigger, SelectionIndicator],
  declarations: [CustomMenu, CustomMenuItem],
})
export class CustomMenuModule { }
```

O array `imports` aceita outros NgModules, assim como components, directives e pipes standalone.

### exports

Um NgModule pode _exportar_ seus components, directives e pipes declarados de forma que eles estejam disponíveis para outros components e NgModules.

```typescript
@NgModule({
 imports: [PopupTrigger, SelectionIndicator],
 declarations: [CustomMenu, CustomMenuItem],

 // Make CustomMenu and CustomMenuItem available to
 // components and NgModules that import CustomMenuModule.
 exports: [CustomMenu, CustomMenuItem],
})
export class CustomMenuModule { }
```

A propriedade `exports` não se limita a declarações, no entanto. Um NgModule também pode exportar quaisquer outros components, directives, pipes e NgModules que ele importa.

```typescript
@NgModule({
 imports: [PopupTrigger, SelectionIndicator],
 declarations: [CustomMenu, CustomMenuItem],

 // Also make PopupTrigger available to any component or NgModule that imports CustomMenuModule.
 exports: [CustomMenu, CustomMenuItem, PopupTrigger],
})
export class CustomMenuModule { }
```

## Providers de `NgModule`

TIP: Veja o [guia de Injeção de Dependência](guide/di) para informações sobre injeção de dependência e providers.

Um `NgModule` pode especificar `providers` para dependências injetadas. Esses providers estão disponíveis para:

- Qualquer component, directive ou pipe standalone que importa o NgModule, e
- As `declarations` e `providers` de qualquer _outro_ NgModule que importa o NgModule.

```typescript
@NgModule({
  imports: [PopupTrigger, SelectionIndicator],
  declarations: [CustomMenu, CustomMenuItem],

  // Provide the OverlayManager service
  providers: [OverlayManager],
  /* ... */
})
export class CustomMenuModule { }

@NgModule({
  imports: [CustomMenuModule],
  declarations: [UserProfile],
  providers: [UserDataClient],
})
export class UserProfileModule { }
```

No exemplo acima:

- O `CustomMenuModule` fornece `OverlayManager`.
- Os components `CustomMenu` e `CustomMenuItem` podem injetar `OverlayManager` porque são declarados em `CustomMenuModule`.
- `UserProfile` pode injetar `OverlayManager` porque seu NgModule importa `CustomMenuModule`.
- `UserDataClient` pode injetar `OverlayManager` porque seu NgModule importa `CustomMenuModule`.

### O padrão `forRoot` e `forChild`

Alguns NgModules definem um método estático `forRoot` que aceita alguma configuração e retorna um array de providers. O nome "`forRoot`" é uma convenção que indica que esses providers são destinados a serem adicionados exclusivamente à _raiz_ da sua aplicação durante o bootstrap.

Quaisquer providers incluídos desta forma são carregados ansiosamente, aumentando o tamanho do bundle JavaScript do seu carregamento inicial da página.

```typescript
bootstrapApplication(MyApplicationRoot, {
  providers: [
    CustomMenuModule.forRoot(/* some config */),
  ],
});
```

Similarmente, alguns NgModules podem definir um `forChild` estático que indica que os providers são destinados a serem adicionados a components dentro da hierarquia da sua aplicação.

```typescript
@Component({
  /* ... */
  providers: [
    CustomMenuModule.forChild(/* some config */),
  ],
})
export class UserProfile { /* ... */ }
```

## Inicializando uma aplicação

IMPORTANT: A equipe Angular recomenda usar [bootstrapApplication](api/platform-browser/bootstrapApplication) em vez de `bootstrapModule` para todo código novo. Use este guia para entender aplicações existentes inicializadas com `@NgModule`.

O decorator `@NgModule` aceita um array `bootstrap` opcional que pode conter um ou mais components.

Você pode usar o método [`bootstrapModule`](https://angular.dev/api/core/PlatformRef#bootstrapModule) de [`platformBrowser`](api/platform-browser/platformBrowser) ou [`platformServer`](api/platform-server/platformServer) para iniciar uma aplicação Angular. Quando executado, esta função localiza quaisquer elementos na página com um seletor CSS que corresponde ao(s) component(s) listado(s) e renderiza esses components na página.

```typescript
import {platformBrowser} from '@angular/platform-browser';

@NgModule({
  bootstrap: [MyApplication],
})
export class MyApplicationModule { }

platformBrowser().bootstrapModule(MyApplicationModule);
```

Components listados em `bootstrap` são automaticamente incluídos nas declarações do NgModule.

Quando você inicializa uma aplicação a partir de um NgModule, os `providers` coletados deste módulo e todos os `providers` de seus `imports` são carregados ansiosamente e disponíveis para injeção para toda a aplicação.
