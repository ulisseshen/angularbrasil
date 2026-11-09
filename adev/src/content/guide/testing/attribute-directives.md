<!-- ia-translate: true -->
# Testes de Attribute Directives

Uma _attribute directive_ modifica o comportamento de um elemento, component ou outra directive.
Seu nome reflete a maneira como a directive é aplicada: como um atributo em um elemento host.

## Testando a directive `Highlight` {#testing-the-highlight-directive}

A directive `Highlight` da aplicação de exemplo define a cor de fundo de um elemento com base em uma cor vinculada por data ou em uma cor padrão \(lightgray\).
Ela também define uma propriedade personalizada do elemento \(`customProperty`\) como `true` apenas para mostrar que é possível.

```ts
import {Directive, inject, input} from '@angular/core';

/**
 * Define o backgroundColor do elemento anexado para a cor de destaque
 * e define o atributo customProperty do elemento como true
 */
@Directive({
  selector: '[highlight]',
  host: {
    '[style.backgroundColor]': 'bgColor() || defaultColor',
  },
})
export class Highlight {
  readonly defaultColor = 'rgb(211, 211, 211)'; // lightgray

  readonly bgColor = input('', {alias: 'highlight'});
}
```

Ela é usada em toda a aplicação, talvez de forma mais simples no component `About`:

```ts
@Component({
  imports: [Twain, Highlight],
  template: `
    <h2 highlight="skyblue">About</h2>
    <h3>Quote of the day:</h3>
    <twain-quote />
  `,
})
export class About {}
```

Testar o uso específico da directive `Highlight` dentro do component `About` requer apenas as técnicas exploradas na seção ["Nested component tests"](guide/testing/components-scenarios#nested-component-tests) de [Component testing scenarios](guide/testing/components-scenarios).

```ts
let fixture: ComponentFixture<About>;

beforeEach(async () => {
  TestBed.configureTestingModule({
    providers: [TwainService, UserService],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  });
  fixture = TestBed.createComponent(About);
  await fixture.whenStable();
});

it('should have skyblue <h2>', () => {
  const h2: HTMLElement = fixture.nativeElement.querySelector('h2');
  const bgColor = h2.style.backgroundColor;
  expect(bgColor).toBe('skyblue');
});
```

No entanto, testar um único caso de uso dificilmente explorará toda a gama de capacidades de uma directive.
Encontrar e testar todos os components que usam a directive é tedioso, frágil e quase tão improvável de oferecer cobertura total.

_Testes somente de classe_ podem ser úteis, mas attribute directives como esta tendem a manipular o DOM.
Testes unitários isolados não tocam o DOM e, por isso, não inspiram confiança na eficácia da directive.

Uma solução melhor é criar um component de teste artificial que demonstre todas as formas de aplicar a directive.

```angular-ts
@Component({
  imports: [Highlight],
  template: `
    <h2 highlight="yellow">Something Yellow</h2>
    <h2 highlight>The Default (Gray)</h2>
    <h2>No Highlight</h2>
    <input #box [highlight]="box.value" value="cyan" />
  `,
})
class Test {}
```

<img alt="Especificação HighlightDirective em ação" src="assets/images/guide/testing/highlight-directive-spec.png">

HELPFUL: O caso do `<input>` vincula o `Highlight` ao nome de um valor de cor na caixa de input.
O valor inicial é a palavra "cyan", que deve ser a cor de fundo da caixa de input.

Aqui estão alguns testes deste component:

```ts
let fixture: ComponentFixture<Test>;
let des: DebugElement[]; // os três elementos com a directive

beforeEach(async () => {
  fixture = TestBed.createComponent(Test);
  await fixture.whenStable();

  // todos os elementos com um Highlight anexado
  des = fixture.debugElement.queryAll(By.directive(Highlight));
});

// testes de cor
it('should have three highlighted elements', () => {
  expect(des.length).toBe(3);
});

it('should color 1st <h2> background "yellow"', () => {
  const bgColor = des[0].nativeElement.style.backgroundColor;
  expect(bgColor).toBe('yellow');
});

it('should color 2nd <h2> background w/ default color', () => {
  const dir = des[1].injector.get(Highlight);
  const bgColor = des[1].nativeElement.style.backgroundColor;
  expect(bgColor).toBe(dir.defaultColor);
});

it('should bind <input> background to value color', async () => {
  // mais fácil de trabalhar com nativeElement
  const input = des[2].nativeElement as HTMLInputElement;
  expect(input.style.backgroundColor, 'initial backgroundColor').toBe('cyan');

  input.value = 'green';

  // Dispara um evento DOM para que o Angular responda à mudança do valor do input.
  input.dispatchEvent(new Event('input'));
  await fixture.whenStable();

  expect(input.style.backgroundColor, 'changed backgroundColor').toBe('green');
});

it('bare <h2> should not have a backgroundColor', () => {
  // o h2 sem a directive Highlight
  const bareH2 = fixture.debugElement.query(By.css('h2:not([highlight])'));

  expect(bareH2.styles.backgroundColor).toBeUndefined();
});
```

Algumas técnicas merecem destaque:

- O predicate `By.directive` é uma ótima maneira de obter os elementos que têm esta directive _quando seus tipos de elemento são desconhecidos_
- A [pseudo-classe `:not`](https://developer.mozilla.org/docs/Web/CSS/:not) em `By.css('h2:not([highlight])')` ajuda a encontrar elementos `<h2>` que _não_ têm a directive.
  `By.css('*:not([highlight])')` encontra _qualquer_ elemento que não tenha a directive.

- `DebugElement.styles` oferece acesso aos estilos do elemento mesmo na ausência de um browser real, graças à abstração `DebugElement`.
  Mas sinta-se à vontade para usar o `nativeElement` quando isso parecer mais fácil ou mais claro do que a abstração.

- O Angular adiciona uma directive ao injector do elemento ao qual ela é aplicada.
  O teste para a cor padrão usa o injector do segundo `<h2>` para obter sua instância de `Highlight` e seu `defaultColor`.

- `DebugElement.properties` oferece acesso à propriedade personalizada artificial definida pela directive

## Testando uma directive isoladamente {#testing-a-directive-in-isolation}

Uma directive pode ser criada sozinha com `TestBed.createDirective()`, que retorna um `DirectiveFixture`. Alternativamente, você pode renderizá-la pelo template de um component.
A directive `Highlight` pode ser testada dessa forma, usando a input de um component de teste local para controlar a directive.

```ts
@Component({
  imports: [Highlight],
  template: `<p [highlight]="color()">{{ color() }}</p>`,
})
class Test {
  readonly color = input('');
}

describe('Highlight', () => {
  let fixture: ComponentFixture<Test>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(Test);
    await fixture.whenStable();
  });

  it('should use the specified color once an input is provided', async () => {
    fixture.componentRef.setInput('color', 'blue');
    await fixture.whenStable();

    const p = fixture.nativeElement.querySelector('p');
    expect(p.style.backgroundColor).toBe('blue');
  });
});
```
