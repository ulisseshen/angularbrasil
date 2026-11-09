<!-- ia-translate: true -->

# Testando pipes

Você pode testar [pipes](guide/templates/pipes) sem os utilitários de teste do Angular.

## Testando o `TitleCasePipe` {#testing-the-titlecasepipe}

Uma classe de pipe tem um método, `transform`, que manipula o valor de entrada e o transforma em um valor de saída.
A implementação de `transform` raramente interage com o DOM.
A maioria dos pipes não depende do Angular, exceto pelos metadados `@Pipe` e por uma interface.

Considere um `TitleCasePipe` que coloca em maiúscula a primeira letra de cada palavra.
Aqui está uma implementação com uma expressão regular.

```ts
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'titlecase', pure: true})
/** Transforma para Title Case: deixa em maiúscula a primeira letra das palavras de uma string. */
export class TitleCasePipe implements PipeTransform {
  transform(input: string): string {
    return input.length === 0
      ? ''
      : input.replace(/\w\S*/g, (txt) => txt[0].toUpperCase() + txt.slice(1).toLowerCase());
  }
}
```

Qualquer coisa que use uma expressão regular vale a pena ser testada com cuidado. Você pode usar técnicas padrão de testes unitários para explorar os casos esperados e os casos extremos.

```ts
describe('TitleCasePipe', () => {
  // Este pipe é uma função pura e sem estado, então não é necessário usar BeforeEach
  const pipe = new TitleCasePipe();

  it('transforma "abc" em "Abc"', () => {
    expect(pipe.transform('abc')).toBe('Abc');
  });

  it('transforma "abc def" em "Abc Def"', () => {
    expect(pipe.transform('abc def')).toBe('Abc Def');
  });

  // ... mais testes ...
});
```

## Escrevendo testes de DOM para dar suporte ao teste de um pipe {#writing-dom-tests-to-support-a-pipe-test}

Estes são testes do pipe _isoladamente_.
Eles não conseguem dizer se o `TitleCasePipe` está funcionando corretamente quando aplicado nos components da aplicação.

Considere adicionar testes de component como este:

```ts
it('deve converter o nome do herói para Title Case', async () => {
  // obtenha os elementos de input e de exibição do nome a partir do DOM
  const hostElement: HTMLElement = harness.routeNativeElement!;
  const nameInput: HTMLInputElement = hostElement.querySelector('input')!;
  const nameDisplay: HTMLElement = hostElement.querySelector('span')!;

  // simule o usuário digitando um novo nome na caixa de input
  nameInput.value = 'quick BROWN  fOx';

  // Dispare um evento DOM para que o Angular saiba que o valor do input mudou.
  nameInput.dispatchEvent(new Event('input'));

  // Aguarde o Angular atualizar o binding de exibição através do pipe de Title Case
  await harness.fixture.whenStable();

  expect(nameDisplay.textContent).toBe('Quick Brown  Fox');
});
```
