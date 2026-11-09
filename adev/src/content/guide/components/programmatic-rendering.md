<!-- ia-translate: true -->
# Renderizando components programaticamente

TIP: Este guia pressupõe que você já leu o [Guia de Fundamentos](essentials). Leia-o primeiro se você é novo no Angular.

Além de usar um component diretamente em um template, você também pode renderizar components dinamicamente de forma programática. Isso é útil em situações em que um component é desconhecido inicialmente (portanto não pode ser referenciado diretamente em um template) e depende de algumas condições.

Existem duas maneiras principais de renderizar um component programaticamente: em um template usando `NgComponentOutlet`, ou no seu código TypeScript usando `ViewContainerRef`.

HELPFUL: para casos de uso de lazy-loading (por exemplo, se você quer adiar o carregamento de um component pesado), considere usar o recurso integrado [`@defer`](/guide/templates/defer) em vez disso. O recurso `@defer` permite que o código de quaisquer components, directives e pipes dentro do bloco `@defer` seja extraído automaticamente para chunks JavaScript separados e carregado apenas quando necessário, com base nos triggers configurados.

## Usando NgComponentOutlet {#using-ngcomponentoutlet}

`NgComponentOutlet` é uma structural directive que renderiza dinamicamente um determinado component em um template.

```angular-ts
import {NgComponentOutlet} from '@angular/common';
import {Component, input, computed} from '@angular/core';

@Component({/*...*/})
export class AdminBio {
  /* ... */
}

@Component({/*...*/})
export class StandardBio {
  /* ... */
}

@Component({
  imports: [NgComponentOutlet],
  template: `
    <p>Perfil de {{ user().name }}</p>
    <ng-container *ngComponentOutlet="bioComponent()" />
  `,
})
export class CustomDialog {
  user = input.required<User>();

  bioComponent = computed(() => {
    return this.user().isAdmin ? AdminBio : StandardBio;
  });
}
```

### Passando inputs para components renderizados dinamicamente {#passing-inputs-to-dynamically-rendered-components}

Você pode passar inputs para o component renderizado dinamicamente usando a propriedade `ngComponentOutletInputs`. Essa propriedade aceita um objeto em que as chaves são os nomes dos inputs e os valores são os valores dos inputs.

```angular-ts
@Component({
  selector: 'user-greeting',
  template: `
    <div>
      <p>Usuário: {{ username() }}</p>
      <p>Papel: {{ role() }}</p>
    </div>
  `,
})
export class UserGreeting {
  username = input.required<string>();
  role = input('guest');
}

@Component({
  selector: 'profile-view',
  imports: [NgComponentOutlet],
  template: `<ng-container *ngComponentOutlet="greetingComponent; inputs: greetingInputs()" />`,
})
export class ProfileView {
  greetingComponent = UserGreeting;
  greetingInputs = signal({username: 'ngAwesome', role: 'admin'});
}
```

Os inputs são atualizados sempre que o signal `greetingInputs` muda, mantendo o component dinâmico sincronizado com o estado do pai.

### Fornecendo projeção de conteúdo {#providing-content-projection}

Use `ngComponentOutletContent` para passar conteúdo projetado ao component renderizado dinamicamente. Isso é útil quando o component dinâmico usa `<ng-content>` para exibir conteúdo.

```angular-ts
@Component({
  selector: 'card-wrapper',
  template: `
    <div class="card">
      <ng-content />
    </div>
  `,
})
export class CardWrapper {}

@Component({
  imports: [NgComponentOutlet],
  template: `
    <ng-container *ngComponentOutlet="cardComponent; content: cardContent()" />

    <ng-template #contentTemplate>
      <h3>Conteúdo dinâmico</h3>
      <p>Este conteúdo é projetado dentro do card.</p>
    </ng-template>
  `,
})
export class DynamicCard {
  private vcr = inject(ViewContainerRef);
  cardComponent = CardWrapper;

  private contentTemplate = viewChild<TemplateRef<unknown>>('contentTemplate');

  cardContent = computed(() => {
    const template = this.contentTemplate();
    if (!template) return [];
    // Retorna um array de slots de projeção. Cada elemento representa um slot <ng-content>.
    // CardWrapper tem um <ng-content>, então retornamos um array com um elemento.
    return [this.vcr.createEmbeddedView(template).rootNodes];
  });
}
```

NOTE: A hidratação não suporta a projeção de nós DOM criados com APIs DOM nativas. Isso causa um [erro NG0503](/errors/NG0503). Use APIs do Angular para criar o conteúdo projetado ou adicione `ngSkipHydration` ao component.

### Fornecendo injectors {#providing-injectors}

Você pode fornecer um injector personalizado ao component criado dinamicamente usando `ngComponentOutletInjector`. Isso é útil para fornecer serviços ou configurações específicos do component.

```angular-ts
export const THEME_DATA = new InjectionToken<string>('THEME_DATA', {
  factory: () => 'light',
});

@Component({
  selector: 'themed-panel',
  template: `<div [class]="theme">...</div>`,
})
export class ThemedPanel {
  theme = inject(THEME_DATA);
}

@Component({
  selector: 'dynamic-panel',
  imports: [NgComponentOutlet],
  template: `<ng-container *ngComponentOutlet="panelComponent; injector: customInjector" />`,
})
export class DynamicPanel {
  panelComponent = ThemedPanel;

  customInjector = Injector.create({
    providers: [{provide: THEME_DATA, useValue: 'dark'}],
  });
}
```

### Acessando a instância do component {#accessing-the-component-instance}

Você pode acessar a instância do component criado dinamicamente usando o recurso `exportAs` da directive:

```angular-ts
@Component({
  selector: 'counter',
  template: `<p>Contagem: {{ count() }}</p>`,
})
export class Counter {
  count = signal(0);
  increment() {
    this.count.update((c) => c + 1);
  }
}

@Component({
  imports: [NgComponentOutlet],
  template: `
    <ng-container [ngComponentOutlet]="counterComponent" #outlet="ngComponentOutlet" />

    <button (click)="outlet.componentInstance?.increment()">Incrementar</button>
  `,
})
export class CounterHost {
  counterComponent = Counter;
}
```

NOTE: A propriedade `componentInstance` é `null` antes de o component ser renderizado.

Consulte a [referência da API do NgComponentOutlet](api/common/NgComponentOutlet) para mais informações sobre as capacidades da directive.

## Usando ViewContainerRef {#using-viewcontainerref}

Um **view container** é um nó na árvore de components do Angular que pode conter conteúdo. Qualquer component ou directive pode injetar `ViewContainerRef` para obter uma referência a um view container correspondente à localização desse component ou directive no DOM.

Você pode usar o método `createComponent` do `ViewContainerRef` para criar e renderizar dinamicamente um component. Quando você cria um novo component com um `ViewContainerRef`, o Angular o insere no DOM como o próximo irmão do component ou directive que injetou o `ViewContainerRef`.

```angular-ts
@Component({
  selector: 'leaf-content',
  template: `Este é o conteúdo final`,
})
export class LeafContent {}

@Component({
  selector: 'outer-container',
  template: `
    <p>Este é o início do container externo</p>
    <inner-item />
    <p>Este é o fim do container externo</p>
  `,
})
export class OuterContainer {}

@Component({
  selector: 'inner-item',
  template: `<button (click)="loadContent()">Carregar conteúdo</button>`,
})
export class InnerItem {
  private viewContainer = inject(ViewContainerRef);

  loadContent() {
    this.viewContainer.createComponent(LeafContent);
  }
}
```

No exemplo acima, clicar no botão "Carregar conteúdo" resulta na seguinte estrutura DOM:

```angular-html
<outer-container>
  <p>Este é o início do container externo</p>
  <inner-item>
    <button>Carregar conteúdo</button>
  </inner-item>
  <leaf-content>Este é o conteúdo final</leaf-content>
  <p>Este é o fim do container externo</p>
</outer-container>
```

## Lazy-loading de components {#lazy-loading-components}

HELPFUL: se você quer fazer lazy-load de alguns components, pode considerar usar o recurso integrado [`@defer`](/guide/templates/defer) em vez disso.

Se o seu caso de uso não for coberto pelo recurso `@defer`, você pode usar `NgComponentOutlet` ou `ViewContainerRef` com um [dynamic import](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/import) JavaScript padrão.

```angular-ts
@Component({
  ...,
  template: `
    <section>
      <h2>Configurações básicas</h2>
      <basic-settings />
    </section>
    <section>
      <h2>Configurações avançadas</h2>
      @if(!advancedSettings) {
        <button (click)="loadAdvanced()">
          Carregar configurações avançadas
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

O exemplo acima carrega e exibe o `AdvancedSettings` ao receber um clique no botão.

## Vinculando inputs, outputs e configurando host directives na criação {#binding-inputs-outputs-and-setting-host-directives-at-creation}

Ao criar components dinamicamente, configurar inputs manualmente e assinar outputs pode ser propenso a erros. Muitas vezes é necessário escrever código extra apenas para conectar os bindings depois que o component é instanciado.

Para simplificar isso, tanto `createComponent` quanto `ViewContainerRef.createComponent` aceitam um array `bindings` com helpers como `inputBinding()`, `outputBinding()` e `twoWayBinding()` para configurar inputs e outputs antecipadamente. Você também pode especificar um array `directives` para aplicar quaisquer host directives. Isso permite criar components programaticamente com bindings semelhantes aos de template em uma única chamada declarativa.

### Host view usando `ViewContainerRef.createComponent` {#host-view-using-viewcontainerrefcreatecomponent}

`ViewContainerRef.createComponent` cria um component e insere automaticamente sua host view e seu host element na hierarquia de views do container, na localização do container. Use isso quando o component dinâmico deve fazer parte da estrutura lógica e visual do container (por exemplo, ao adicionar itens de lista ou UI inline).

Em contraste, a API standalone `createComponent` não anexa o novo component a nenhuma view ou localização do DOM existente. Ela retorna um `ComponentRef` e dá controle explícito sobre onde colocar o host element do component.

```angular-ts
import {Component, input, model, output} from '@angular/core';

@Component({
  selector: 'app-warning',
  template: `
    @if (isExpanded()) {
      <section>
        <p>Aviso: ação necessária!</p>
        <button (click)="close.emit(true)">Fechar</button>
      </section>
    }
  `,
})
export class AppWarning {
  readonly canClose = input.required<boolean>();
  readonly isExpanded = model<boolean>();
  readonly close = output<boolean>();
}
```

```ts
import {
  Component,
  ViewContainerRef,
  signal,
  inputBinding,
  outputBinding,
  twoWayBinding,
  inject,
} from '@angular/core';
import {FocusTrap} from '@angular/cdk/a11y';
import {ThemeDirective} from '../theme.directive';

@Component({
  template: `<ng-container #container />`,
})
export class Host {
  private vcr = inject(ViewContainerRef);
  readonly canClose = signal(true);
  readonly isExpanded = signal(true);

  showWarning() {
    const compRef = this.vcr.createComponent(AppWarning, {
      bindings: [
        inputBinding('canClose', this.canClose),
        twoWayBinding('isExpanded', this.isExpanded),
        outputBinding<boolean>('close', (confirmed) => {
          console.log('Fechado com o resultado:', confirmed);
        }),
      ],
      directives: [
        FocusTrap,
        {type: ThemeDirective, bindings: [inputBinding('theme', () => 'warning')]},
      ],
    });
  }
}
```

No exemplo acima, o **AppWarning** dinâmico é criado com seu input `canClose` vinculado a um signal reativo, um binding bidirecional em seu estado `isExpanded` e um listener de output para `close`. O `FocusTrap` e o `ThemeDirective` são anexados ao host element por meio de `directives`.

### Popup anexado ao `document.body` com `createComponent` + `hostElement` {#popup-attached-to-documentbody-with-createcomponent--hostelement}

Use isso ao renderizar fora da hierarquia de views atual (por exemplo, overlays). O `hostElement` fornecido se torna o host do component no DOM, então o Angular não cria um novo elemento correspondente ao seletor. Isso permite configurar **bindings** diretamente.

```ts
import {
  ApplicationRef,
  createComponent,
  EnvironmentInjector,
  inject,
  Injectable,
  inputBinding,
  outputBinding,
  Service,
} from '@angular/core';
import {Popup} from './popup';

@Service()
export class PopupService {
  private readonly injector = inject(EnvironmentInjector);
  private readonly appRef = inject(ApplicationRef);

  show(message: string) {
    // Cria um host element para o popup
    const host = document.createElement('popup-host');

    // Cria o component e configura os bindings em uma única chamada
    const ref = createComponent(Popup, {
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

    // Registra a view do component para que ela participe do ciclo de detecção de mudanças.
    this.appRef.attachView(ref.hostView);
    // Insere o host element fornecido no DOM (fora da hierarquia de views normal do Angular).
    // É isso que torna o popup visível na tela, normalmente usado para overlays ou modais.
    document.body.appendChild(host);
  }
}
```

## Tratando erros de renderização {#handling-rendering-errors}

IMPORTANT: A opção `onError` e seu parâmetro `ErrorDetails` estão em [prévia para desenvolvedores](reference/releases#developer-preview).

Ao criar components dinamicamente usando `ViewContainerRef.createComponent` ou a função standalone `createComponent`, você pode fornecer um callback `onError` no objeto de opções para tratar erros que ocorrem nas fases de renderização ou de detecção de mudanças. Esse é o equivalente programático de usar um bloco `@error` em templates.

```ts
viewContainerRef.createComponent(DynamicComponent, {
  onError: (err: Error, details: ErrorDetails) => {
    console.error('Falha na renderização do component:', err);
    // Renderize uma UI alternativa ou registre métricas
  },
});
```

NOTE: O callback `onError` captura apenas erros que ocorrem nas fases de renderização ou de detecção de mudanças. Ele não captura erros que ocorrem durante a instanciação do component (por exemplo, no constructor). O Angular lança erros de construção de forma síncrona quando você chama a API.
