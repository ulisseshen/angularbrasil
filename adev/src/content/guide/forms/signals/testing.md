<!-- ia-translate: true -->
# Testando Signal Forms

Formulários costumam ser críticos para as aplicações, e os testes dão confiança de que eles se comportam corretamente conforme a base de código muda. Signal Forms mantém a maior parte da sua lógica no schema, e não no template, o que significa que você pode testar a maior parte do comportamento do formulário sem renderizar um component.

Este guia mostra como configurar esses testes, começando por testes de lógica isolada e depois cobrindo testes vinculados a components, para os casos em que a interação com o DOM importa.

## Testando a lógica do formulário isoladamente {#testing-form-logic-in-isolation}

Quando você só precisa verificar validação, estado disabled, estado required ou a saída de erros, teste o formulário diretamente, em vez de renderizar um component. Testes isolados mantêm a configuração enxuta e deixam o teste focado no comportamento do formulário.

O requisito principal é o injector. Signal Forms precisa de um injection context durante a criação do formulário. Se um teste chamar `form()` sem um, a chamada lança erro antes que o teste possa fazer qualquer verificação sobre o formulário.

A forma mais direta de atender a esse requisito é passar um injector explicitamente. O teste a seguir cria um formulário com uma regra `required` e verifica se o field fica válido depois de receber um valor:

```ts {header: 'profile-form.spec.ts'}
import {Injector, signal} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {form, required} from '@angular/forms/signals';
import {describe, expect, it} from 'vitest';

describe('profile form', () => {
  it('marks required fields as invalid until they have a value', () => {
    const model = signal({name: ''});

    const profileForm = form(
      model,
      (path) => {
        required(path.name);
      },
      {injector: TestBed.inject(Injector)},
    );

    expect(profileForm.name().valid()).toBe(false);
    expect(profileForm.name().errors()).toEqual([expect.objectContaining({kind: 'required'})]);

    profileForm.name().value.set('Ada');

    expect(profileForm.name().valid()).toBe(true);
    expect(profileForm.name().errors()).toEqual([]);
  });
});
```

Esse padrão funciona bem para a maioria dos testes isolados, porque o requisito do injector fica visível no ponto da chamada. Ele também espelha a forma como os testes unitários de Signal Forms no código-fonte do Angular criam formulários.

Quando o código testado chama `form()` internamente, pode não ser possível passar o injector diretamente. Nesse caso, envolva a chamada em um injection context ambiente:

```ts {header: 'profile-form.spec.ts'}
import {signal} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {form, required} from '@angular/forms/signals';
import {describe, expect, it} from 'vitest';

describe('profile form', () => {
  it('can create a form inside an injection context', () => {
    const model = signal({name: ''});

    TestBed.runInInjectionContext(() => {
      const profileForm = form(model, (path) => {
        required(path.name);
      });

      expect(profileForm.name().valid()).toBe(false);
    });
  });
});
```

Os dois padrões produzem o mesmo tipo de formulário. Passar `{injector}` costuma ser a escolha mais clara quando o teste cria o formulário diretamente. `TestBed.runInInjectionContext()` é útil quando o código testado chama `form()` internamente e você precisa fornecer o injection context ao redor.

Depois que o formulário existe, teste-o pelos signals de field state. Verificações comuns incluem `valid()`, `invalid()`, `disabled()`, `required()` e `errors()`. Para a maior parte da lógica de formulário, isso basta para verificar o comportamento sem envolver o DOM.

## Testando um formulário com múltiplas regras {#testing-a-form-with-multiple-rules}

Depois que a configuração do injector estiver pronta, um bom próximo passo é um teste completo que exercite alguns pedaços de lógica de formulário juntos. Esse tipo de teste continua isolado, mas se parece muito mais com um formulário real de aplicação.

Por exemplo, este teste verifica tanto uma regra básica de required quanto uma regra de required condicional que depende de outro field:

```ts {header: 'profile-form.spec.ts'}
import {Injector, signal} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {form, required} from '@angular/forms/signals';
import {describe, expect, it} from 'vitest';

describe('profile form', () => {
  it('updates validation state when related fields change', () => {
    const model = signal({
      name: '',
      age: 5,
    });

    const profileForm = form(
      model,
      (path) => {
        required(path.name);
        required(path.name, {
          error: (ctx) => ({kind: `required-${ctx.valueOf(path.age)}`}),
          when: ({valueOf}) => valueOf(path.age) > 10,
        });
      },
      {injector: TestBed.inject(Injector)},
    );

    expect(profileForm.name().invalid()).toBe(true);
    expect(profileForm.name().errors()).toEqual([expect.objectContaining({kind: 'required'})]);

    profileForm.age().value.set(15);

    expect(profileForm.name().errors()).toEqual([
      expect.objectContaining({kind: 'required'}),
      expect.objectContaining({kind: 'required-15'}),
    ]);

    profileForm.name().value.set('Ada');

    expect(profileForm.name().valid()).toBe(true);
    expect(profileForm.name().errors()).toEqual([]);
  });
});
```

Este exemplo mostra um padrão de teste importante: atualize um field e depois faça a verificação sobre o state de outro field. Como as regras de Signal Forms são reativas, a validação de um field pode depender de valores de fields irmãos, de valores do pai ou de outras condições derivadas. Os testes devem verificar essas relações diretamente, em vez de checar apenas o field que mudou.

Para testes focados em validação, `errors()` costuma ser a verificação mais útil. `valid()` e `invalid()` informam se o field passa na validação no momento, mas `errors()` mostra qual regra produziu a falha. Isso se torna especialmente útil quando um field tem vários validadores ou regras condicionais.

A mesma estrutura funciona para a maioria dos testes de formulário do dia a dia:

1. Crie um model signal com o menor formato que reproduza o comportamento.
1. Construa o formulário com um injector explícito.
1. Verifique o field state inicial.
1. Altere um field com `.value.set(...)`, incluindo os fields irmãos ao testar regras entre fields.
1. Verifique os signals de state atualizados, normalmente `errors()`, `valid()` ou `invalid()`.

Quando um teste trata do comportamento do schema, e não da renderização, use por padrão esse estilo isolado. Ele é mais rápido que um teste de component e facilita identificar qual regra é responsável quando o comportamento muda.

## Testando formulários vinculados a components {#testing-forms-bound-to-components}

Quando você precisa verificar um comportamento que depende de bindings do template, de interação do usuário via `dispatchEvent` ou de custom form controls que gerenciam a própria renderização, testes isolados não são suficientes. Você precisa de testes vinculados a components, que renderizam o template para que você possa interagir com elementos reais do DOM.

### Configurando um teste de component {#setting-up-a-component-test}

Testes vinculados a components renderizam o component para que você possa interagir com elementos reais do DOM. Crie o component com `TestBed.createComponent()` e aguarde a renderização terminar antes de fazer as verificações:

```angular-ts {header: 'profile-form.ts'}
import {Component, signal} from '@angular/core';
import {form, FormField, required} from '@angular/forms/signals';

@Component({
  selector: 'app-profile-form',
  imports: [FormField],
  template: `<input [formField]="profileForm.name" />`,
})
export class ProfileForm {
  readonly model = signal({name: 'Ada'});
  readonly profileForm = form(this.model, (path) => {
    required(path.name);
  });
}
```

```ts {header: 'profile-form.spec.ts'}
import {TestBed} from '@angular/core/testing';
import {describe, expect, it} from 'vitest';
import {ProfileForm} from './profile-form';

describe('ProfileForm', () => {
  it('reflects model values in the DOM and updates the model on user input', async () => {
    const fixture = TestBed.createComponent(ProfileForm);
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    // Model → View: o input reflete o valor inicial do model
    expect(input.value).toBe('Ada');

    // View → Model: simula o usuário limpando o field
    input.value = '';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    expect(fixture.componentInstance.profileForm.name().value()).toBe('');
    expect(fixture.componentInstance.profileForm.name().valid()).toBe(false);
  });
});
```

Repare que o component usa `form()` sem um injector explícito, porque o próprio injection context do component o fornece automaticamente. Depois de cada alteração, `await fixture.whenStable()` aguarda a renderização e os effects terminarem antes das verificações.

O mesmo padrão funciona para operações assíncronas, como validadores assíncronos ou chamadas ao servidor. Chame `await fixture.whenStable()` depois que o trabalho assíncrono for resolvido.

## Quando usar cada abordagem {#when-to-use-each-approach}

| O que você precisa verificar                              | Abordagem        |
| ---------------------------------------------------- | --------------- |
| Regras de validação, `errors()`, `valid()`, `invalid()` | Isolada         |
| Estado disabled, required ou readonly                | Isolada         |
| Dependências reativas entre fields                    | Isolada         |
| Schemas condicionais (`applyWhen`, `applyWhenValue`)  | Isolada         |
| Valores de input renderizados no DOM                 | Vinculada a component |
| Digitação do usuário atualizando o model             | Vinculada a component |
| Custom form controls com seus próprios templates     | Vinculada a component |
| Gerenciamento de foco ou atributos de acessibilidade | Vinculada a component |

A maioria dos formulários só precisa de testes isolados. A lógica do formulário (como validação, state disabled e regras entre fields) fica no schema, e os schemas não precisam de um template para rodar. Testes vinculados a components agregam valor quando o comportamento que você quer verificar atravessa a fronteira entre o formulário e o DOM.

## Próximos passos {#next-steps}

Este guia abordou o teste de Signal Forms de forma isolada e com templates de components. Estes são guias relacionados que exploram outros aspectos de Signal Forms:

<docs-pill-row>
  <docs-pill href="guide/forms/signals/validation" title="Validation" />
  <docs-pill href="guide/forms/signals/field-state-management" title="Field state management" />
  <docs-pill href="guide/forms/signals/form-submission" title="Form submission" />
</docs-pill-row>
