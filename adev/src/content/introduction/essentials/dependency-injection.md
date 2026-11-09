<!-- ia-translate: true -->
<docs-decorative-header title="Dependency Injection" imgSrc="adev/src/assets/images/dependency_injection.svg"> <!-- markdownlint-disable-line -->
Reutilize código e controle comportamentos em toda a sua aplicação e nos seus testes.
</docs-decorative-header>

Quando você precisa compartilhar lógica entre components, o Angular utiliza o padrão de design de [dependency injection](guide/di), que permite criar um "service" para injetar código em components enquanto o gerencia a partir de uma única fonte de verdade.

## O que são services? {#what-are-services}

Services são pedaços de código reutilizáveis que podem ser injetados.

Semelhante à definição de um component, services são compostos por:

- Um **decorator TypeScript** que declara a classe como um service do Angular via `@Service` e permite definir um service que pode ser acessado em qualquer lugar da sua aplicação.
- Uma **classe TypeScript** que define o código desejado que ficará acessível quando o service for injetado

Aqui está um exemplo de um service `Calculator`.

```angular-ts
import {Service} from '@angular/core';

@Service()
export class Calculator {
  add(x: number, y: number) {
    return x + y;
  }
}
```

## Como usar um service {#how-to-use-a-service}

Quando você quer usar um service em um component, você precisa:

1. Importar o service
2. Declarar um campo de classe onde o service será injetado. Atribua ao campo de classe o resultado da chamada da função integrada [`inject`](/api/core/inject), que cria o service

Veja como isso pode ficar no component `Receipt`:

```angular-ts
import {Component, inject} from '@angular/core';
import {Calculator} from './calculator';

@Component({
  selector: 'app-receipt',
  template: `<h1>The total is {{ totalCost }}</h1>`,
})
export class Receipt {
  private calculator = inject(Calculator);
  totalCost = this.calculator.add(50, 25);
}
```

Neste exemplo, o `Calculator` é usado chamando a função `inject` do Angular e passando o service para ela.

## Próximo passo {#next-step}

<docs-pill-row>
  <docs-pill title="Próximos passos após o essencial" href="essentials/next-steps" />
  <docs-pill title="Guia detalhado de dependency injection" href="guide/di" />
</docs-pill-row>
