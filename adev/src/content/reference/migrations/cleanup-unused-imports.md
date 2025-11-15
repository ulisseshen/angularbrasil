<!-- ia-translate: true -->
# Limpeza de imports não utilizados

A partir da versão 19, o Angular reporta quando o array `imports` de um component contém símbolos que não são usados em seu template.

Executar este schematic fará a limpeza de todos os imports não utilizados dentro do projeto.

Execute o schematic usando o seguinte comando:

<docs-code language="shell">

ng generate @angular/core:cleanup-unused-imports

</docs-code>

#### Antes

<docs-code language="typescript">
import { Component } from '@angular/core';
import { UnusedDirective } from './unused';

@Component({
template: 'Hello',
imports: [UnusedDirective],
})
export class MyComp {}
</docs-code>

#### Depois

<docs-code language="typescript">
import { Component } from '@angular/core';

@Component({
template: 'Hello',
imports: [],
})
export class MyComp {}
</docs-code>
