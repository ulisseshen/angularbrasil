<!-- ia-translate: true -->
<docs-decorative-header title="Dependency Injection" imgSrc="adev/src/assets/images/dependency_injection.svg"> <!-- markdownlint-disable-line -->
Reutilize código e controle comportamentos em sua aplicação e testes.
</docs-decorative-header>

Quando você precisa compartilhar lógica entre components, o Angular aproveita o padrão de design de [dependency injection](guide/di) que permite criar um "service" que possibilita injetar código em components enquanto o gerencia a partir de uma única fonte de verdade.

## O que são services?

Services são pedaços de código reutilizáveis que podem ser injetados.

Semelhante à definição de um component, services são compostos pelo seguinte:

- Um **decorator TypeScript** que declara a classe como um service do Angular via `@Injectable` e permite definir que parte da aplicação pode acessar o service através da propriedade `providedIn` (que normalmente é `'root'`) para permitir que um service seja acessado em qualquer lugar dentro da aplicação.
- Uma **classe TypeScript** que define o código desejado que estará acessível quando o service for injetado

Aqui está um exemplo de um service `Calculator`.

```angular-ts
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class Calculator {
  add(x: number, y: number) {
    return x + y;
  }
}
```

## Como usar um service

Quando você quer usar um service em um component, você precisa:

1. Importar o service
2. Declarar um campo de classe onde o service é injetado. Atribua o campo de classe ao resultado da chamada da função integrada `inject` que cria o service

Aqui está como poderia ser no component `Receipt`:

```angular-ts
import { Component, inject } from '@angular/core';
import { Calculator } from './calculator';

@Component({
  selector: 'app-receipt',
  template: `<h1>The total is {{ totalCost }}</h1>`,
})

export class Receipt {
  private calculator = inject(Calculator);
  totalCost = this.calculator.add(50, 25);
}
```

Neste exemplo, o `Calculator` está sendo usado chamando a função `inject` do Angular e passando o service para ela.

## Próximo Passo

<docs-pill-row>
  <docs-pill title="Próximos Passos Após Essenciais" href="essentials/next-steps" />
  <docs-pill title="Guia detalhado de dependency injection" href="guide/di" />
</docs-pill-row>
