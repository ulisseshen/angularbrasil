<!-- ia-translate: true -->
# Renderizando components programaticamente

TIP: Este guia assume que você já leu o [Guia Essencial](essentials). Leia-o primeiro se você é novo no Angular.

Além de usar um component diretamente em um template, você também pode renderizar components dinamicamente de forma programática. Isso é útil para situações em que um component é desconhecido inicialmente (portanto não pode ser referenciado diretamente em um template) e depende de algumas condições.

Existem duas maneiras principais de renderizar um component programaticamente: em um template usando `NgComponentOutlet`, ou em seu código TypeScript usando `ViewContainerRef`.

HELPFUL: para casos de uso de lazy-loading (por exemplo, se você deseja atrasar o carregamento de um component pesado), considere usar o recurso integrado [`@defer`](/guide/templates/defer) em vez disso. O recurso `@defer` permite que o código de quaisquer components, directives e pipes dentro do bloco `@defer` seja extraído em chunks JavaScript separados automaticamente e carregado apenas quando necessário, com base nos triggers configurados.

## Usando NgComponentOutlet

`NgComponentOutlet` é uma structural directive que renderiza dinamicamente um determinado component em um template.

```angular-ts
@Component({ ... })
export class AdminBio { /* ... */ }

@Component({ ... })
export class StandardBio { /* ... */ }

@Component({
  ...,
  template: `
    <p>Profile for {{user.name}}</p>
    <ng-container *ngComponentOutlet="getBioComponent()" /> `
})
export class CustomDialog {
  user = input.required<User>();

  getBioComponent() {
    return this.user().isAdmin ? AdminBio : StandardBio;
  }
}
```

Veja a [referência da API NgComponentOutlet](api/common/NgComponentOutlet) para mais informações sobre as capacidades da directive.

## Usando ViewContainerRef

Um **view container** é um nó na árvore de components do Angular que pode conter conteúdo. Qualquer component ou directive pode injetar `ViewContainerRef` para obter uma referência a um view container correspondente à localização daquele component ou directive no DOM.

Você pode usar o método `createComponent` no `ViewContainerRef` para criar e renderizar dinamicamente um component. Quando você cria um novo component com um `ViewContainerRef`, o Angular o anexa ao DOM como o próximo sibling do component ou directive que injetou o `ViewContainerRef`.

```angular-ts
@Component({
  selector: 'leaf-content',
  template: `
    This is the leaf content
  `,
})
export class LeafContent {}

@Component({
  selector: 'outer-container',
  template: `
    <p>This is the start of the outer container</p>
    <inner-item />
    <p>This is the end of the outer container</p>
  `,
})
export class OuterContainer {}

@Component({
  selector: 'inner-item',
  template: `
    <button (click)="loadContent()">Load content</button>
  `,
})
export class InnerItem {
  private viewContainer = inject(ViewContainerRef);

  loadContent() {
    this.viewContainer.createComponent(LeafContent);
  }
}
```

No exemplo acima, clicar no botão "Load content" resulta na seguinte estrutura DOM:

```angular-html
<outer-container>
  <p>This is the start of the outer container</p>
  <inner-item>
    <button>Load content</button>
  </inner-item>
  <leaf-content>This is the leaf content</leaf-content>
  <p>This is the end of the outer container</p>
</outer-container>
```

## Lazy-loading de components

HELPFUL: se você deseja fazer lazy-load de alguns components, você pode considerar usar o recurso integrado [`@defer`](/guide/templates/defer) em vez disso.

Se seu caso de uso não é coberto pelo recurso `@defer`, você pode usar tanto `NgComponentOutlet` quanto `ViewContainerRef` com um [dynamic import](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/import) JavaScript padrão.

```angular-ts
@Component({
  ...,
  template: `
    <section>
      <h2>Basic settings</h2>
      <basic-settings />
    </section>
    <section>
      <h2>Advanced settings</h2>
      @if(!advancedSettings) {
        <button (click)="loadAdvanced()">
          Load advanced settings
        </button>
      }
      <ng-container *ngComponentOutlet="advancedSettings" />
    </section>
  `
})
export class AdminSettings {
  advancedSettings: {new(): AdvancedSettings} | undefined;

  async loadAdvanced() {
    const { AdvancedSettings } = await import('path/to/advanced_settings.js');
    this.advancedSettings = AdvancedSettings;
  }
}
```

O exemplo acima carrega e exibe o `AdvancedSettings` ao receber um clique de botão.

## Vinculando inputs, outputs e configurando host directives na criação

Ao criar components dinamicamente, configurar manualmente inputs e assinar outputs pode ser propenso a erros. Você geralmente precisa escrever código extra apenas para conectar bindings após a instanciação do component.

Para simplificar isso, tanto `createComponent` quanto `ViewContainerRef.createComponent` suportam passar um array `bindings` com helpers como `inputBinding()`, `outputBinding()` e `twoWayBinding()` para configurar inputs e outputs antecipadamente. Você também pode especificar um array `directives` para aplicar quaisquer host directives. Isso permite criar components programaticamente com bindings semelhantes aos de template em uma única chamada declarativa.

### Host view usando `ViewContainerRef.createComponent`

`ViewContainerRef.createComponent` cria um component e insere automaticamente sua host view e host element na hierarquia de views do container na localização do container. Use isso quando o component dinâmico deve se tornar parte da estrutura lógica e visual do container (por exemplo, adicionar itens de lista ou UI inline).

Em contraste, a API standalone `createComponent` não anexa o novo component a nenhuma view ou localização DOM existente — ela retorna um `ComponentRef` e lhe dá controle explícito sobre onde colocar o host element do component.

```angular-ts
import { Component, input, model, output } from "@angular/core";

@Component({
  selector: 'app-warning',
  template: `
      @if(isExpanded()) {
        <section>
            <p>Warning: Action needed!</p>
            <button (click)="close.emit(true)">Close</button>
        </section>
      }
  `
})
export class AppWarningComponent {
  readonly canClose = input.required<boolean>();
  readonly isExpanded = model<boolean>();
  readonly close = output<boolean>();
}
```

```ts
import { Component, ViewContainerRef, signal, inputBinding, outputBinding, twoWayBinding, inject } from '@angular/core';
import { FocusTrap } from "@angular/cdk/a11y";
import { ThemeDirective } from '../theme.directive';

@Component({
  template: `<ng-container #container />`
})
export class HostComponent {
  private vcr = inject(ViewContainerRef);
  readonly canClose = signal(true);
  readonly isExpanded = signal(true);

  showWarning() {
    const compRef = this.vcr.createComponent(AppWarningComponent, {
      bindings: [
        inputBinding('canClose', this.canClose),
        twoWayBinding('isExpanded', this.isExpanded),
        outputBinding<boolean>('close', (confirmed) => {
          console.log('Closed with result:', confirmed);
        })
      ],
      directives: [
        FocusTrap,
        { type: ThemeDirective, bindings: [inputBinding('theme', () => 'warning')] }
      ]
    });
  }
}
```

No exemplo acima, o **AppWarningComponent** dinâmico é criado com seu input `canClose` vinculado a um signal reativo, um binding bidirecional em seu estado `isExpanded`, e um listener de output para `close`. O `FocusTrap` e `ThemeDirective` são anexados ao host element via `directives`.

### Popup anexado ao `document.body` com `createComponent` + `hostElement`

Use isso ao renderizar fora da hierarquia de views atual (por exemplo, overlays). O `hostElement` fornecido se torna o host do component no DOM, então o Angular não cria um novo elemento correspondente ao seletor. Permite que você configure **bindings** diretamente.

```ts
import {
  ApplicationRef,
  createComponent,
  EnvironmentInjector,
  inject,
  Injectable,
  inputBinding,
  outputBinding,
} from '@angular/core';
import { PopupComponent } from './popup.component';

@Injectable({ providedIn: 'root' })
export class PopupService {
  private readonly injector = inject(EnvironmentInjector);
  private readonly appRef = inject(ApplicationRef);

  show(message: string) {
    // Create a host element for the popup
    const host = document.createElement('popup-host');

    // Create the component and bind in one call
    const ref = createComponent(PopupComponent, {
      environmentInjector: this.injector,
      hostElement: host,
      bindings: [
        inputBinding('message', () => message),
        outputBinding('closed', () => {
          document.body.removeChild(host);
          this.appRef.detachView(ref.hostView);
          ref.destroy();
        }),
      ],
    });

    // Registers the component's view so it participates in change detection cycle.
    this.appRef.attachView(ref.hostView);
    // Inserts the provided host element into the DOM (outside the normal Angular view hierarchy).
    // This is what makes the popup visible on screen, typically used for overlays or modals.
    document.body.appendChild(host);
  }
}
```
