<!-- ia-translate: true -->
# Renderizar templates de um component pai com `ng-content`

`<ng-content>` é um elemento especial que aceita markup ou um fragmento de template e controla como os components renderizam conteúdo. Ele não renderiza um elemento real do DOM.

Aqui está um exemplo de um component `BaseButton` que aceita qualquer markup de seu pai.

```angular-ts
// ./base-button/base-button.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'button[baseButton]',
  template: `
      <ng-content />
  `,
})
export class BaseButton {}
```

```angular-ts
// ./app.component.ts
import { Component } from '@angular/core';
import { BaseButton } from './base-button/base-button.component';

@Component({
  selector: 'app-root',
  imports: [BaseButton],
  template: `
    <button baseButton>
      Next <span class="icon arrow-right"></span>
    </button>
  `,
})
export class AppComponent {}
```

Para mais detalhes, consulte o [guia detalhado de `<ng-content>`](/guide/components/content-projection) para outras maneiras de aproveitar este padrão.
