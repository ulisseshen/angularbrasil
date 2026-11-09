<!-- ia-translate: true -->

# Testando services

Services normalmente contêm a lógica de negócio da sua aplicação, da qual os components dependem. Testar services verifica se essa lógica funciona corretamente de forma isolada, independentemente de qualquer component ou template.

Este guia usa o [Vitest](https://vitest.dev/), que os projetos do Angular CLI incluem por padrão. Para mais informações sobre a configuração de testes, veja o [guia de visão geral de testes](guide/testing#set-up-for-testing).

## Testando um service {#testing-a-service}

Considere um service `Calculator` que realiza operações aritméticas básicas:

```ts { header: 'calculator.ts' }
import {Service} from '@angular/core';

@Service()
export class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }

  subtract(a: number, b: number): number {
    return a - b;
  }
}
```

Para testar este service, configure um `TestBed`, que é o utilitário de testes do Angular para criar um ambiente de teste isolado para cada teste. Ele configura a injeção de dependência e permite recuperar instâncias de services, simulando como o Angular conecta as peças em uma aplicação real.

```ts { header: 'calculator.spec.ts' }
import {TestBed} from '@angular/core/testing';
import {beforeEach, describe, expect, it} from 'vitest';
import {Calculator} from './calculator';

describe('Calculator', () => {
  let service: Calculator;

  beforeEach(() => {
    // Injeta o service Calculator, que está disponível para o Angular
    // porque o service usa `@Service`
    service = TestBed.inject(Calculator);
  });

  it('soma dois números', () => {
    expect(service.add(1, 2)).toBe(3);
  });

  it('subtrai dois números', () => {
    expect(service.subtract(5, 3)).toBe(2);
  });
});
```

No exemplo acima, o bloco `beforeEach` injeta uma nova instância do service antes de cada teste. Isso garante que cada teste seja executado de forma isolada, sem estado vazado de testes anteriores.

## Testando services com dependências {#testing-services-with-dependencies}

A maioria dos services depende de outros services para funcionar corretamente. Por padrão, o `TestBed` fornece as implementações reais dessas dependências, o que significa que seus testes exercitam os caminhos de código reais usados pela sua aplicação. Às vezes, porém, uma dependência pode ser complexa, lenta ou imprevisível. Nesses casos, você pode substituí-la por uma versão controlada.

Considere um service `OrderTotal` que depende de um `TaxCalculator` para calcular o preço final de um pedido:

```ts { header: 'tax-calculator.ts' }
import {Service} from '@angular/core';

@Service()
export class TaxCalculator {
  calculate(subtotal: number): number {
    return subtotal * 0.05;
  }
}
```

```ts { header: 'order-total.ts' }
import {inject, Service} from '@angular/core';
import {TaxCalculator} from './tax-calculator';

@Service()
export class OrderTotal {
  private taxCalculator = inject(TaxCalculator);

  total(subtotal: number): number {
    return subtotal + this.taxCalculator.calculate(subtotal);
  }
}
```

Neste exemplo, `OrderTotal` usa `inject()` para solicitar o `TaxCalculator` ao sistema de injeção de dependência do Angular. Por padrão, o `TestBed` fornece o `TaxCalculator` real, o que é perfeito para cálculos simples como este. No entanto, se o `TaxCalculator` envolvesse lógica complexa, requisições de rede ou resultados imprevisíveis, você poderia querer substituí-lo por uma versão controlada.

### Substituindo uma dependência por um stub {#replacing-a-dependency-with-a-stub}

Um stub é uma forma de substituir uma dependência ou método por um que retorna valores previsíveis, o que pode facilitar a verificação dos resultados dos testes.

Para testar o `OrderTotal` sem depender do `TaxCalculator` real, você pode fornecer um stub na configuração do `TestBed`.

```ts { header: 'order-total.spec.ts' }
import {TestBed} from '@angular/core/testing';
import {beforeEach, describe, expect, it, vi, type Mocked} from 'vitest';
import {OrderTotal} from './order-total';
import {TaxCalculator} from './tax-calculator';

// O tipo utilitário `Mocked` do Vitest garante que o stub seja type-safe,
// enquanto `vi.fn()` cria uma função mock para cada método
const taxCalculatorStub: Mocked<TaxCalculator> = {
  calculate: vi.fn(),
};

describe('OrderTotal', () => {
  let service: OrderTotal;

  beforeEach(() => {
    // `mockReturnValue` define um valor de retorno controlado para o stub
    taxCalculatorStub.calculate.mockReturnValue(5);

    TestBed.configureTestingModule({
      // O array `providers` aceita um objeto de provider em que `provide`
      // especifica a dependência a ser substituída e `useValue` define o stub
      providers: [{provide: TaxCalculator, useValue: taxCalculatorStub}],
    });
    service = TestBed.inject(OrderTotal);
  });

  it('adiciona o imposto ao subtotal', () => {
    expect(service.total(100)).toBe(105);
  });
});
```

Com este stub, sempre que o `OrderTotal` solicitar o `TaxCalculator`, o `TestBed` saberá que deve usar o `taxCalculatorStub`. Como o stub sempre retorna 5, o teste verifica se o `OrderTotal` adiciona corretamente o valor do imposto ao subtotal, independentemente de a alíquota mudar no `TaxCalculator`.

### Verificando interações com spies {#verifying-interactions-with-spies}

Um stub controla o que uma dependência retorna, mas às vezes você também precisa verificar se um service chamou sua dependência com os argumentos corretos. Isso pode ser feito com spies, que rastreiam como uma função é chamada. Com o Vitest, essa funcionalidade está embutida no `vi.fn()` e permite fazer asserções sobre as interações entre services.

```ts { header: 'order-total.spec.ts' }
import {TestBed} from '@angular/core/testing';
import {afterEach, beforeEach, describe, expect, it, vi, type Mocked} from 'vitest';
import {OrderTotal} from './order-total';
import {TaxCalculator} from './tax-calculator';

const taxCalculatorStub: Mocked<TaxCalculator> = {
  calculate: vi.fn(),
};

describe('OrderTotal', () => {
  let service: OrderTotal;

  beforeEach(() => {
    taxCalculatorStub.calculate.mockReturnValue(5);

    TestBed.configureTestingModule({
      providers: [{provide: TaxCalculator, useValue: taxCalculatorStub}],
    });
    service = TestBed.inject(OrderTotal);
  });

  afterEach(() => {
    taxCalculatorStub.calculate.mockClear();
  });

  it('adiciona o imposto ao subtotal', () => {
    expect(service.total(100)).toBe(105);
  });

  // Verifica a interação com um spy
  it('chama a calculadora de imposto', () => {
    service.total(100);
    expect(taxCalculatorStub.calculate).toHaveBeenCalledExactlyOnceWith(100);
  });
});
```

O novo teste verifica se o `OrderTotal` chamou `TaxCalculator.calculate` ao calcular o total. Isso é útil para confirmar que a interação entre os services aconteceu corretamente.

## Testando services HTTP {#testing-http-services}

Muitos services usam o `HttpClient` do Angular para buscar dados de um servidor. O Angular fornece utilitários de teste dedicados para o `HttpClient`, que permitem controlar as respostas HTTP sem fazer requisições de rede reais.

Para detalhes sobre como testar services que usam o `HttpClient`, veja o [guia de testes HTTP](guide/http/testing).
