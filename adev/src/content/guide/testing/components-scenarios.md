<!-- ia-translate: true -->

# Cenários de teste de components

Este guia explora casos de uso comuns de teste de components.

## Binding de component {#component-binding}

Na aplicação de exemplo, o component `Banner` apresenta um texto de título estático no template HTML.

Após algumas alterações, o component `Banner` apresenta um título dinâmico, fazendo binding com a propriedade `title` do component, assim.

```angular-ts {header: "banner.ts"}
import {Component, signal} from '@angular/core';

@Component({
  selector: 'app-banner',
  template: '<h1>{{ title() }}</h1>',
  styles: ['h1 { color: green; font-size: 350%}'],
})
export class Banner {
  title = signal('Test Tour of Heroes');
}
```

Por mais mínimo que isso seja, você decide adicionar um teste para confirmar que o component realmente exibe o conteúdo correto onde você acha que deveria.

### Consulta do `<h1>` {#query-for-the-h1}

Você vai escrever uma sequência de testes que inspecionam o valor do elemento `<h1>` que envolve o binding de interpolação da propriedade _title_.

Você atualiza o `beforeEach` para encontrar esse elemento com um `querySelector` HTML padrão e atribuí-lo à variável `h1`.

```ts {header: "banner.component.spec.ts"}
let component: Banner;
let fixture: ComponentFixture<Banner>;
let h1: HTMLElement;

beforeEach(() => {
  fixture = TestBed.createComponent(Banner);
  component = fixture.componentInstance; // instância de teste do Banner
  h1 = fixture.nativeElement.querySelector('h1');
});
```

### `createComponent()` não faz binding de dados {#createcomponent-does-not-bind-data}

No seu primeiro teste, você gostaria de ver que a tela exibe o `title` padrão.
Seu instinto é escrever um teste que inspeciona imediatamente o `<h1>`, assim:

```ts
it('should display original title', () => {
  expect(h1.textContent).toContain(component.title());
});
```

_Esse teste falha_ com a mensagem:

```shell {hideCopy}
expected '' to contain 'Test Tour of Heroes'.
```

O binding acontece quando o Angular executa **change detection**.

Em produção, o change detection é disparado automaticamente quando o Angular cria um component ou quando o usuário pressiona uma tecla, por exemplo.

O `TestBed.createComponent` não dispara change detection de forma síncrona; um fato confirmado no teste revisado:

```ts
it('no title in the DOM after createComponent()', () => {
  expect(h1.textContent).toEqual('');
});
```

### `whenStable()`

Você pode dizer ao `TestBed` para aguardar a execução do change detection com `await fixture.whenStable()`.
Só então o `<h1>` tem o título esperado.

```ts
it('should display original title', async () => {
  await fixture.whenStable();
  expect(h1.textContent).toContain(component.title());
});
```

O change detection atrasado é intencional e útil.
Ele dá ao testador uma oportunidade de inspecionar e alterar o estado do component _antes que o Angular inicie o data binding e chame os [lifecycle hooks](guide/components/lifecycle)_.

Aqui está outro teste que altera a propriedade `title` do component _antes_ de chamar `fixture.whenStable()`.

```ts
it('should display a different test title', async () => {
  component.title.set('Test Title');
  await fixture.whenStable();
  expect(h1.textContent).toContain('Test Title');
});
```

### Binding de signals para inputs {#binding-signals-to-inputs}

Para refletir alterações em inputs e ouvir outputs, você pode vincular dinamicamente signals a inputs e funções a outputs.

```ts
import {inputBinding, outputBinding} from '@angular/core';
import {TestBed} from '@angular/core/testing';

const fixture = TestBed.createComponent(ValueDisplay, {
  bindings: [
    inputBinding('value', value),
    outputBinding('valueChange', () =>  (/* ... */) ),
  ],
});
```

### Alterar o valor de um input com `dispatchEvent()` {#change-an-input-value-with-dispatchevent}

Para simular a entrada do usuário, encontre o elemento input e defina sua propriedade `value`.

Mas há uma etapa intermediária essencial.

O Angular não sabe que você definiu a propriedade `value` do elemento input.
Ele não lerá essa propriedade até que você dispare o evento `input` do elemento chamando `dispatchEvent()`.

O exemplo a seguir, de um component que usa o `TitleCasePipe`, demonstra a sequência adequada.

```ts
it('should convert hero name to Title Case', async () => {
  const hostElement = fixture.nativeElement;
  const nameInput: HTMLInputElement = hostElement.querySelector('input')!;
  const nameDisplay: HTMLElement = hostElement.querySelector('span')!;

  // simula o usuário digitando um novo nome na caixa de input
  nameInput.value = 'quick BROWN  fOx';

  // Dispara um evento DOM para que o Angular saiba da alteração do valor do input.
  nameInput.dispatchEvent(new Event('input'));

  // Aguarda o Angular atualizar o binding de exibição através do pipe de título
  await fixture.whenStable();

  expect(nameDisplay.textContent).toBe('Quick Brown  Fox');
});
```

## Component com uma dependência {#component-with-a-dependency}

Components frequentemente têm dependências de services.

O component `Welcome` exibe uma mensagem de boas-vindas ao usuário logado.
Ele sabe quem é o usuário com base em uma propriedade do `UserAuthentication` injetado:

```angular-ts
import {Component, inject, OnInit, signal} from '@angular/core';
import {UserAuthentication} from '../model/user.authentication';

@Component({
  selector: 'app-welcome',
  template: '<h3 class="welcome"><i>{{ welcome() }}</i></h3>',
})
export class Welcome {
  private userAuth = inject(UserAuthentication);
  welcome = signal(
    this.userAuth.isLoggedIn() ? `Welcome, ${this.userAuth.user().name}` : 'Please log in.',
  );
}
```

O component `Welcome` tem lógica de decisão que interage com o service, uma lógica que torna este component digno de teste.

### Fornecer test doubles de service {#provide-service-test-doubles}

Um _component-under-test_ não precisa receber services reais.

Injetar o `UserAuthentication` real pode ser difícil.
O service real pode pedir ao usuário credenciais de login e tentar alcançar um servidor de autenticação.
Esses comportamentos podem ser difíceis de interceptar. Esteja ciente de que usar test doubles faz o teste se comportar de forma diferente da produção, então use-os com moderação.

### Obter services injetados {#get-injected-services}

Os testes precisam de acesso ao `UserAuthentication` injetado no component `Welcome`.

O Angular tem um sistema de injeção hierárquico.
Pode haver injectors em vários níveis, desde o injector raiz criado pelo `TestBed` até a árvore de components.

A forma mais segura de obter o service injetado, a forma que **_sempre funciona_**,
é **obtê-lo do injector do _component-under-test_**.
O injector do component é uma propriedade do `DebugElement` do fixture.

```ts
// UserAuthentication realmente injetado no component
userAuth = fixture.debugElement.injector.get(UserAuthentication);
```

HELPFUL: Isso _geralmente_ não é necessário. Services costumam ser fornecidos na raiz ou nos overrides do TestBed e podem ser recuperados mais facilmente com `TestBed.inject()` (veja abaixo).

### `TestBed.inject()`

Isso é mais fácil de lembrar e menos verboso do que recuperar um service usando o `DebugElement` do fixture.

Nesta suíte de testes, o _único_ provider do `UserAuthentication` é o module de teste raiz, então é seguro chamar `TestBed.inject()` assim:

```ts
userAuth = TestBed.inject(UserAuthentication);
```

HELPFUL: Para um caso de uso em que o `TestBed.inject()` não funciona, veja a seção [_Override de component providers_](#override-component-providers), que explica quando e por que você deve obter o service do injector do component.

### Configuração final e testes {#final-setup-and-tests}

Aqui está o `beforeEach()` completo, usando `TestBed.inject()`:

```ts
let fixture: ComponentFixture<Welcome>;
let comp: Welcome;
let userAuth: UserAuthentication; // o service injetado pelo TestBed
let el: HTMLElement; // o elemento DOM com a mensagem de boas-vindas

beforeEach(() => {
  fixture = TestBed.createComponent(Welcome);
  comp = fixture.componentInstance;

  // UserAuthentication do injector raiz
  userAuth = TestBed.inject(UserAuthentication);

  //  obtém o elemento "welcome" pelo seletor CSS (por exemplo, pelo nome da classe)
  el = fixture.nativeElement.querySelector('.welcome');
});
```

E aqui estão alguns testes:

```ts
it('should welcome the user', async () => {
  await fixture.whenStable();
  const content = el.textContent;

  expect(content, '"Welcome ..."').toContain('Welcome');
  expect(content, 'expected name').toContain('Test User');
});

it('should welcome "Bubba"', async () => {
  userAuth.user.set({name: 'Bubba'}); // a mensagem de boas-vindas ainda não foi exibida
  await fixture.whenStable();

  expect(el.textContent).toContain('Bubba');
});

it('should request login if not logged in', async () => {
  userAuth.isLoggedIn.set(false); // a mensagem de boas-vindas ainda não foi exibida
  await fixture.whenStable();
  const content = el.textContent;

  expect(content, 'not welcomed').not.toContain('Welcome');
  expect(content, '"log in"').toMatch(/log in/i);
});
```

O primeiro é um teste de sanidade; ele confirma que o `UserAuthentication` é chamado e está funcionando.

HELPFUL: O 2º argumento de `expect` \(por exemplo, `'expected name'`\) é um rótulo opcional de falha.
Se a expectation falhar, o Vitest acrescenta esse rótulo à mensagem de falha da expectation.
Em uma spec com várias expectations, isso pode ajudar a esclarecer o que deu errado e qual expectation falhou.

Os testes restantes confirmam a lógica do component quando o service retorna valores diferentes.
O segundo teste valida o efeito de alterar o nome do usuário.
O terceiro teste verifica se o component exibe a mensagem adequada quando não há usuário logado.

## Component com service assíncrono {#component-with-async-service}

Neste exemplo, o template do component `About` hospeda um component `Twain`.
O component `Twain` exibe citações de Mark Twain.

```angular-html
<p class="twain">
  <i>{{ quote | async }}</i>
</p>
<button type="button" (click)="getQuote()">Next quote</button>
@if (errorMessage()) {
  <p class="error">{{ errorMessage() }}</p>
}
```

HELPFUL: O valor da propriedade `quote` do component passa por um `AsyncPipe`.
Isso significa que a propriedade retorna uma `Promise` ou um `Observable`.

Neste exemplo, o método `TwainQuotes.getQuote()` indica que a propriedade `quote` retorna um `Observable`.

```ts
getQuote() {
  this.errorMessage.set('');
  this.quote = this.twainQuotes.getQuote().pipe(
    startWith('...'),
    catchError((err: any) => {
      this.errorMessage.set(err.message || err.toString());
      return of('...'); // redefine a mensagem para o placeholder
    }),
  );
}
```

O component `Twain` obtém citações de um `TwainQuotes` injetado.
O component inicia o `Observable` retornado com um valor placeholder \(`'...'`\), antes que o service possa retornar sua primeira citação.

O `catchError` intercepta erros do service, prepara uma mensagem de erro e retorna o valor placeholder no canal de sucesso.

Todos esses são recursos que você vai querer testar.

### Testando por meio de mock de requisições HTTP com o `HttpTestingController`. {#testing-by-mocking-http-requests-with-the-httptestingcontroller}

Ao testar um component, apenas a API pública do service deve importar.
Em geral, os próprios testes não devem fazer chamadas a servidores remotos.
Eles devem emular essas chamadas.

Caso o seu service assíncrono dependa do `HttpClient` para carregar dados remotos, recomenda-se retornar respostas mockadas no nível HTTP com o `HttpTestingController`.

Para mais detalhes sobre como fazer mock do `HttpBackend`, consulte o [guia dedicado](guide/http/testing).

### Testando fornecendo uma implementação stub de um service. {#testing-by-providing-a-stubbed-implementation-of-a-service}

Quando não é possível fazer mock de requisições assíncronas no nível HTTP, uma alternativa é usar spies.

A configuração em `app/twain/twain-quotes.spec.ts` mostra uma forma de fazer isso:

```ts {header: "twain.spec.ts"}
class TwainQuotesStub implements TwainQuotes {
  private testQuote = 'Test Quote';

  getQuote() {
    return of(this.testQuote);
  }

  // ... Implementa tudo para estar em conformidade com a API
}

beforeEach(async () => {
  TestBed.configureTestingModule({
    providers: [{provide: TwainQuotes, useClass: TwainQuotesStub}],
  });

  fixture = TestBed.createComponent(Twain);
  component = fixture.componentInstance;
  await fixture.whenStable();
  quoteEl = fixture.nativeElement.querySelector('.twain');
});
```

Foque em como a implementação stub substitui a original.

```ts
TestBed.configureTestingModule({
  providers: [{provide: TwainQuotes, useClass: TwainQuotesStub}],
});
```

O stub é projetado de forma que qualquer component ou service que o injete receberá a implementação stub.
Isso significa que qualquer chamada a `getQuote` recebe um observable com uma citação de teste.

Diferentemente do método `getQuote()` real, este spy ignora o servidor e retorna um observable síncrono cujo valor está disponível imediatamente.

### Teste assíncrono com fake timers do Vitest {#async-test-with-a-vitest-fake-timers}

Para fazer mock de funções assíncronas, como `setTimeout` ou `Promise`s, você pode usar os fake timers do Vitest para controlar quando elas disparam.

```ts
it('should display error when TwainQuotes service fails', async () => {
  class TwainQuotesStub implements TwainQuotes {
    getQuote() {
      return defer(() => {
        return new Promise<string>((_, reject) => {
          setTimeout(() => reject('TwainService test failure'));
        });
      });
    }

    // ... Implementa tudo para estar em conformidade com a API
  }

  TestBed.configureTestingModule({
    providers: [{provide: TwainQuotes, useClass: TwainQuotesStub}],
  });

  vi.useFakeTimers(); // configurando os fake timers
  const fixture = TestBed.createComponent(TwainComponent);

  // a renderização não é assíncrona, precisamos executar as tarefas pendentes
  await vi.runAllTimersAsync();

  await expect(fixture.nativeElement.querySelector('.error')!.textContent).toMatch(/test failure/);
  expect(fixture.nativeElement.querySelector('.twain')!.textContent).toBe('...');

  vi.useRealTimers(); // restaura a execução assíncrona regular
});
```

### Mais testes assíncronos {#more-async-tests}

Com o service stub retornando observables assíncronos, a maioria dos seus testes também terá que ser assíncrona.

Aqui está um teste que demonstra o fluxo de dados que você esperaria no mundo real.

```ts
class MockTwainQuotes implements TwainQuotes {
  private subject = new Subject<string>();

  getQuote() {
    return this.subject.asObservable();
  }

  emit(val: string) {
    this.subject.next(val);
  }
}

it('should show quote after getQuote (success)', async () => {
  vi.useFakeTimers();

  TestBed.configureTestingModule({
    providers: [{provide: TwainQuotes, useClass: MockTwainQuotes}],
  });

  const fixture = TestBed.createComponent(TwainComponent);
  const twainQuotes = TestBed.inject(TwainQuotes) as MockTwainQuotes;
  await vi.runAllTimersAsync(); // renderiza antes que a citação seja recebida

  const quoteEl = fixture.nativeElement.querySelector('.twain');
  expect(quoteEl.textContent).toBe('...');

  twainQuotes.emit('Twain Quote'); // emite a citação
  await vi.runAllTimersAsync(); // renderiza com a citação recebida

  expect(quoteEl.textContent).toBe('Twain Quote');
  expect(fixture.nativeElement.querySelector('.error')).toBeNull();

  vi.useRealTimers();
});
```

Observe que o elemento de citação exibe o valor placeholder \(`'...'`\) na primeira renderização.
A primeira citação ainda não chegou.

Em seguida, você pode verificar se o elemento de citação exibe o texto esperado.

### Testes assíncronos com `zone.js` e `fakeAsync` {#async-tests-with-zonejs-and-fakeasync}

A função auxiliar `fakeAsync` é outro relógio simulado que depende de patches em APIs assíncronas com o `zone.js`. Ela era comumente usada em aplicações baseadas em `zone.js` para testes. O uso de `fakeAsync` não é mais recomendado.

TIP: Prefira usar estratégias nativas de teste assíncrono ou outros fake timers (também chamados de mock clocks), como os do Vitest ou do Jasmine.

IMPORTANT: O `fakeAsync` requer `zone.js`. Para usá-lo com o test runner do Vitest, adicione o polyfill `zone.js/plugins/vitest-patch`, conforme descrito em [o guia de migração para o Vitest](guide/testing/migrating-to-vitest#zonejs-vitest-patch).

## Component com inputs e outputs {#component-with-inputs-and-outputs}

Um component com inputs e outputs normalmente aparece dentro do template de view de um component host.
O host usa um property binding para definir a propriedade input e um event binding para ouvir os eventos disparados pela propriedade output.

O objetivo do teste é verificar se esses bindings funcionam como esperado.
Os testes devem definir valores de input e ouvir eventos de output.

O component `DashboardHero` é um pequeno exemplo de component nesse papel.
Ele exibe um hero individual fornecido pelo component `Dashboard`.
Clicar nesse hero informa ao component `Dashboard` que o usuário selecionou o hero.

O component `DashboardHero` é incorporado ao template do component `Dashboard` assim:

```angular-html
@for (hero of heroes; track hero) {
  <dashboard-hero class="col-1-4" [hero]="hero" (selected)="gotoDetail($event)" />
}
```

O component `DashboardHero` aparece em um bloco `@for`, que define a propriedade input `hero` de cada component com o valor do loop e ouve o evento `selected` do component.

Aqui está a definição completa do component:

```angular-ts
@Component({
  selector: 'dashboard-hero',
  imports: [UpperCasePipe],
  template: `
    <button type="button" (click)="click()" class="hero">
      {{ hero().name | uppercase }}
    </button>
  `,
})
export class DashboardHero {
  readonly hero = input.required<Hero>();
  readonly selected = output<Hero>();

  click() {
    this.selected.emit(this.hero());
  }
}
```

Embora testar um component tão simples tenha pouco valor intrínseco, vale a pena saber como.
Use uma destas abordagens:

- Teste-o como é usado pelo component `Dashboard`
- Teste-o como um component independente
- Teste-o como é usado por um substituto do component `Dashboard`

O objetivo imediato é testar o component `DashboardHero`, não o component `Dashboard`, então experimente a segunda e a terceira opções.

### Testar o component `DashboardHero` isoladamente {#test-the-dashboardhero-component-standalone}

Aqui está a parte principal da configuração do arquivo spec.

```ts
let fixture: ComponentFixture<DashboardHero>;
let comp: DashboardHero;
let heroDe: DebugElement;
let heroEl: HTMLElement;
let expectedHero: Hero;

beforeEach(async () => {
  fixture = TestBed.createComponent(DashboardHero);
  comp = fixture.componentInstance;

  // encontra o DebugElement e o elemento do herói
  heroDe = fixture.debugElement.query(By.css('.hero'));
  heroEl = heroDe.nativeElement;

  // simula o herói fornecido pelo component pai
  expectedHero = {id: 42, name: 'Test Name'};

  // simula o pai definindo a propriedade input com esse herói
  fixture.componentRef.setInput('hero', expectedHero);

  // aguarda o data binding inicial
  await fixture.whenStable();
});
```

Observe como o código de configuração atribui um herói de teste \(`expectedHero`\) à propriedade `hero` do component, emulando a forma como o `Dashboard` faria isso usando o property binding em seu repetidor.

O teste a seguir verifica se o nome do herói é propagado para o template usando um binding.

```ts
it('should display hero name in uppercase', () => {
  const expectedPipedName = expectedHero.name.toUpperCase();
  expect(heroEl.textContent).toContain(expectedPipedName);
});
```

Como o template passa o nome do herói pelo `UpperCasePipe` do Angular, o teste deve comparar o valor do elemento com o nome em maiúsculas.

### Clicando {#clicking}

Clicar no herói deve disparar um evento `selected` que o component host \(presumivelmente `Dashboard`\) pode ouvir:

```ts
it('should raise selected event when clicked (triggerEventHandler)', () => {
  let selectedHero: Hero | undefined;
  comp.selected.subscribe((hero: Hero) => (selectedHero = hero));

  heroDe.triggerEventHandler('click');
  expect(selectedHero).toBe(expectedHero);
});
```

A propriedade `selected` do component é um `OutputEmitterRef`, cujo método `subscribe` notifica os subscribers de forma síncrona.
O teste se inscreve nela _explicitamente_, assim como o component host faz _implicitamente_.

Se o component se comportar como esperado, clicar no elemento do herói deve fazer a propriedade `selected` do component emitir o objeto `hero`.

O teste detecta esse evento pela sua inscrição em `selected`.

### `triggerEventHandler`

O `heroDe` do teste anterior é um `DebugElement` que representa o `<button>` do herói.

Ele tem propriedades e métodos do Angular que abstraem a interação com o elemento nativo.
Este teste chama o `DebugElement.triggerEventHandler` com o nome do evento "click".
O event binding de "click" responde chamando `DashboardHero.click()`.

O `DebugElement.triggerEventHandler` do Angular pode disparar _qualquer evento com data binding_ pelo seu _nome de evento_.
O segundo parâmetro é o objeto de evento passado ao handler.

O teste disparou um evento "click".

```ts
heroDe.triggerEventHandler('click');
```

Neste caso, o teste assume corretamente que o handler de evento em runtime, o método `click()` do component, não se importa com o objeto de evento.

HELPFUL: Outros handlers são menos tolerantes.
Por exemplo, a directive `RouterLink` espera um objeto com uma propriedade `button` que identifica qual botão do mouse, se algum, foi pressionado durante o clique.
A directive `RouterLink` lança um erro se o objeto de evento estiver ausente.

### Clicar no elemento {#click-the-element}

A alternativa de teste a seguir chama o método `click()` do próprio elemento nativo, o que é perfeitamente adequado para _este component_.

```ts
it('should raise selected event when clicked (element.click)', () => {
  let selectedHero: Hero | undefined;
  comp.selected.subscribe((hero: Hero) => (selectedHero = hero));

  heroEl.click();
  expect(selectedHero).toBe(expectedHero);
});
```

### Helper `click()` {#click-helper}

Clicar em um botão, em uma âncora ou em um elemento HTML arbitrário é uma tarefa de teste comum.

Torne isso consistente e direto encapsulando o processo de _disparo do clique_ em um helper, como a função `click()` a seguir:

```ts
/** Eventos de botão a passar para `DebugElement.triggerEventHandler` para o handler de evento do RouterLink */
export const ButtonClickEvents = {
  left: {button: 0},
  right: {button: 2},
};

/** Simula o clique em um elemento. Por padrão, usa o evento de clique com o botão esquerdo do mouse. */
export function click(
  el: DebugElement | HTMLElement,
  eventObj: any = ButtonClickEvents.left,
): void {
  if (el instanceof HTMLElement) {
    el.click();
  } else {
    el.triggerEventHandler('click', eventObj);
  }
}
```

O primeiro parâmetro é o _elemento a ser clicado_.
Se quiser, passe um objeto de evento personalizado como segundo parâmetro.
O padrão é um [objeto de evento de mouse com botão esquerdo](https://developer.mozilla.org/docs/Web/API/MouseEvent/button) parcial, aceito por muitos handlers, incluindo a directive `RouterLink`.

IMPORTANT: A função helper `click()` **não** é um dos utilitários de teste do Angular.
Ela é uma função definida no _código de exemplo deste guia_.
Todos os testes de exemplo a usam.
Se você gostar dela, adicione-a à sua própria coleção de helpers.

Aqui está o teste anterior, reescrito usando o helper `click`.

```ts
it('should raise selected event when clicked (click helper with DebugElement)', () => {
  let selectedHero: Hero | undefined;
  comp.selected.subscribe((hero: Hero) => (selectedHero = hero));

  click(heroDe); // helper click com DebugElement

  expect(selectedHero).toBe(expectedHero);
});
```

## Component dentro de um test host {#component-inside-a-test-host}

Os testes anteriores desempenharam eles mesmos o papel do component host `Dashboard`.
Mas o component `DashboardHero` funciona corretamente quando devidamente vinculado por data binding a um component host?

```angular-ts
@Component({
  imports: [DashboardHero],
  template: ` <dashboard-hero [hero]="hero" (selected)="onSelected($event)" />`,
})
class TestHost {
  hero: Hero = {id: 42, name: 'Test Name'};
  selectedHero: Hero | undefined;

  onSelected(hero: Hero) {
    this.selectedHero = hero;
  }
}
```

O test host define a propriedade input `hero` do component com seu herói de teste.
Ele vincula o evento `selected` do component ao seu handler `onSelected`, que registra o herói emitido na propriedade `selectedHero`.

Mais tarde, os testes poderão verificar `selectedHero` para confirmar que o evento `DashboardHero.selected` emitiu o herói esperado.

A configuração dos testes do `test-host` é semelhante à dos testes isolados:

```ts
beforeEach(async () => {
  // cria o TestHost em vez do DashboardHero
  fixture = TestBed.createComponent(TestHost);
  testHost = fixture.componentInstance;
  heroEl = fixture.nativeElement.querySelector('.hero');

  await fixture.whenStable();
});
```

Esta configuração do module de teste mostra duas diferenças importantes:

- Ela _cria_ o component `TestHost` em vez do `DashboardHero`
- O component `TestHost` define o `DashboardHero.hero` com um binding

O `createComponent` retorna um `fixture` que contém uma instância de `TestHost` em vez de uma instância de `DashboardHero`.

Criar o `TestHost` tem o efeito colateral de criar um `DashboardHero`, porque este aparece dentro do template do primeiro.
A consulta ao elemento do herói \(`heroEl`\) ainda o encontra no DOM de teste, embora em uma profundidade maior na árvore de elementos do que antes.

Os próprios testes são quase idênticos à versão isolada:

```ts
it('should display hero name', () => {
  const expectedPipedName = testHost.hero.name.toUpperCase();
  expect(heroEl.textContent).toContain(expectedPipedName);
});

it('should raise selected event when clicked', () => {
  click(heroEl);
  // o herói selecionado deve ser o mesmo herói com data binding
  expect(testHost.selectedHero).toBe(testHost.hero);
});
```

Apenas o teste do evento selected é diferente.
Ele confirma que o herói selecionado do `DashboardHero` realmente chega até o component host por meio do event binding.

## Routing component {#routing-component}

Um _routing component_ é um component que diz ao `Router` para navegar até outro component.
O component `Dashboard` é um _routing component_, porque o usuário pode navegar até o component `HeroDetail` clicando em um dos _botões de herói_ no dashboard.

O Angular fornece helpers de teste para reduzir o boilerplate e testar de forma mais eficaz o código que depende do `HttpClient`. A função `provideRouter` também pode ser usada diretamente no module de teste.

```ts
beforeEach(async () => {
  TestBed.configureTestingModule({
    providers: [
      provideRouter([{path: '**', component: Dashboard}]),
      provideHttpClientTesting(),
      HeroService,
    ],
  });
  harness = await RouterTestingHarness.create();
  comp = await harness.navigateByUrl('/', Dashboard);
  TestBed.inject(HttpTestingController).expectOne('api/heroes').flush(getTestHeroes());
});
```

O teste a seguir clica no herói exibido e confirma que navegamos para a URL esperada.

```ts
it('should tell navigate when hero clicked', async () => {
  // obtém o primeiro DebugElement do <dashboard-hero>
  const heroDe = harness.routeDebugElement!.query(By.css('dashboard-hero'));
  heroDe.triggerEventHandler('selected', comp.heroes[0]);

  // esperando navegar para o id do primeiro herói do component
  const id = comp.heroes[0].id;
  expect(TestBed.inject(Router).url, 'should nav to HeroDetail for first hero').toEqual(
    `/heroes/${id}`,
  );
});
```

## Routed components {#routed-components}

Um _routed component_ é o destino de uma navegação do `Router`.
Ele pode ser mais complicado de testar, especialmente quando a rota até o component _inclui parâmetros_.
O `HeroDetail` é um _routed component_ que é o destino de uma rota assim.

Quando um usuário clica em um herói do _Dashboard_, o `Dashboard` diz ao `Router` para navegar até `heroes/:id`.
O `:id` é um parâmetro de rota cujo valor é o `id` do herói a ser editado.

O `Router` associa essa URL a uma rota para o `HeroDetail`.
Ele cria um objeto `ActivatedRoute` com as informações de roteamento e o injeta em uma nova instância do `HeroDetail`.

Aqui estão os services injetados no `HeroDetail`:

```ts
private heroDetailService = inject(HeroDetailService);
private route = inject(ActivatedRoute);
private router = inject(Router);
```

O component `HeroDetail` precisa do parâmetro `id` para buscar o herói correspondente usando o `HeroDetailService`.
O component precisa obter o `id` da propriedade `ActivatedRoute.paramMap`, que é um `Observable`.

Ele não pode simplesmente referenciar a propriedade `id` do `ActivatedRoute.paramMap`.
O component precisa _se inscrever_ no observable `ActivatedRoute.paramMap` e estar preparado para que o `id` mude durante seu ciclo de vida.

```ts
constructor() {
  // obtém o herói quando o parâmetro `id` muda
  this.route.paramMap.subscribe((pmap) => this.getHero(pmap.get('id')));
}
```

Os testes podem explorar como o `HeroDetail` responde a diferentes valores do parâmetro `id`, navegando para rotas diferentes.

## Nested component tests {#nested-component-tests}

Templates de components frequentemente têm components aninhados, cujos templates podem conter mais components.

A árvore de components pode ser muito profunda, e às vezes os components aninhados não têm papel algum no teste do component no topo da árvore.

O component `App`, por exemplo, exibe uma barra de navegação com âncoras e suas directives `RouterLink`.

```angular-html
<app-banner />
<app-welcome />

<nav>
  <a routerLink="/dashboard">Dashboard</a>
  <a routerLink="/heroes">Heroes</a>
  <a routerLink="/about">About</a>
</nav>

<router-outlet />
```

Para validar os links, mas não a navegação, você não precisa que o `Router` navegue, nem precisa do `<router-outlet>` para marcar onde o `Router` insere os _routed components_.

Os components `Banner` e `Welcome` \(indicados por `<app-banner>` e `<app-welcome>`\) também são irrelevantes.

No entanto, qualquer teste que crie o component `App` no DOM também cria instâncias desses três components e, se você deixar isso acontecer, precisará configurar o `TestBed` para criá-los.

Se você negligenciar declará-los, o compilador do Angular não reconhecerá as tags `<app-banner>`, `<app-welcome>` e `<router-outlet>` no template do `App` e lançará um erro.

Se você declarar os components reais, também precisará declarar _os components aninhados deles_ e fornecer _todos_ os services injetados em _qualquer_ component da árvore.

Esta seção descreve duas técnicas para minimizar a configuração.
Use-as, sozinhas ou combinadas, para manter o foco em testar o component principal.

### Stubbing de components desnecessários {#stubbing-unneeded-components}

Na primeira técnica, você cria e declara versões stub dos components e da directive que têm pouco ou nenhum papel nos testes.

```ts
@Component({selector: 'app-banner', template: ''})
class BannerStub {}

@Component({selector: 'router-outlet', template: ''})
class RouterOutletStub {}

@Component({selector: 'app-welcome', template: ''})
class WelcomeStub {}
```

Os seletores stub correspondem aos seletores dos components reais correspondentes. Mas seus templates e classes estão vazios.

Em seguida, declare-os sobrescrevendo os `imports` do seu component com `TestBed.overrideComponent`.

```ts
let comp: App;
let fixture: ComponentFixture<App>;

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [provideRouter([]), UserAuthentication],
  }).overrideComponent(App, {
    set: {
      imports: [RouterLink, BannerStub, RouterOutletStub, WelcomeStub],
    },
  });

  fixture = TestBed.createComponent(App);
  comp = fixture.componentInstance;
});
```

HELPFUL: A chave `set` deste exemplo substitui todos os imports existentes do seu component, então certifique-se de importar todas as dependências, não apenas os stubs. Alternativamente, você pode usar as chaves `remove`/`add` para remover e adicionar imports seletivamente.

### `NO_ERRORS_SCHEMA`

Na segunda abordagem, adicione `NO_ERRORS_SCHEMA` aos overrides de metadata do seu component.

```ts
beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [provideRouter([]), UserAuthentication],
  }).overrideComponent(App, {
    set: {
      imports: [], // redefine todos os imports
      schemas: [NO_ERRORS_SCHEMA],
    },
  });
});
```

O `NO_ERRORS_SCHEMA` diz ao compilador do Angular para ignorar elementos e atributos não reconhecidos.

O compilador reconhece o elemento `<app-root>` e o atributo `routerLink` porque você declarou um component `App` e a `RouterLink` correspondentes na configuração do `TestBed`.

Mas o compilador não lançará um erro ao encontrar `<app-banner>`, `<app-welcome>` ou `<router-outlet>`.
Ele simplesmente os renderiza como tags vazias, e o browser os ignora.

Você não precisa mais dos components stub.

### Use as duas técnicas juntas {#use-both-techniques-together}

Estas são técnicas de _Shallow Component Testing_, assim chamadas porque reduzem a superfície visual do component apenas aos elementos do template do component que importam para os testes.

A abordagem com `NO_ERRORS_SCHEMA` é a mais fácil das duas, mas não a use em excesso.

O `NO_ERRORS_SCHEMA` também impede que o compilador informe sobre os components e atributos ausentes que você omitiu sem querer ou digitou errado.
Você pode perder horas caçando bugs fantasmas que o compilador teria detectado em um instante.

A abordagem de _stub component_ tem outra vantagem.
Embora os stubs _deste_ exemplo estejam vazios, você poderia dar a eles templates e classes simplificados, caso seus testes precisem interagir com eles de alguma forma.

Na prática, você combinará as duas técnicas na mesma configuração, como visto neste exemplo.

```ts
beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [provideRouter([]), UserAuthentication],
  }).overrideComponent(App, {
    remove: {imports: [RouterOutlet, Welcome]},
    set: {schemas: [NO_ERRORS_SCHEMA]},
  });
});
```

O compilador do Angular cria o `BannerStub` para o elemento `<app-banner>` e aplica o `RouterLink` às âncoras com o atributo `routerLink`, mas ignora as tags `<app-welcome>` e `<router-outlet>`.

### `By.directive` e directives injetadas {#bydirective-and-injected-directives}

Um pouco mais de configuração dispara o data binding inicial e obtém referências aos links de navegação:

```ts
beforeEach(async () => {
  await fixture.whenStable();

  // encontra os DebugElements com uma RouterLinkStubDirective anexada
  linkDes = fixture.debugElement.queryAll(By.directive(RouterLink));

  // obtém as instâncias da directive de link anexadas
  // usando o injector de cada DebugElement
  routerLinks = linkDes.map((de) => de.injector.get(RouterLink));
});
```

Três pontos de especial interesse:

- Localize os elementos âncora com uma directive anexada usando `By.directive`
- A consulta retorna wrappers `DebugElement` em torno dos elementos correspondentes
- Cada `DebugElement` expõe um dependency injector com a instância específica da directive anexada àquele elemento

Os links do component `App` a validar são estes:

```angular-html
<nav>
  <a routerLink="/dashboard">Dashboard</a>
  <a routerLink="/heroes">Heroes</a>
  <a routerLink="/about">About</a>
</nav>
```

Aqui estão alguns testes que confirmam que esses links estão associados às directives `routerLink`, como esperado:

```ts
it('can get RouterLinks from template', () => {
  expect(routerLinks.length, 'should have 3 routerLinks').toBe(3);
  expect(routerLinks[0].href).toBe('/dashboard');
  expect(routerLinks[1].href).toBe('/heroes');
  expect(routerLinks[2].href).toBe('/about');
});

it('can click Heroes link in template', async () => {
  const heroesLinkDe = linkDes[1]; // DebugElement do link de heroes

  TestBed.inject(Router).resetConfig([{path: '**', children: []}]);
  heroesLinkDe.triggerEventHandler('click', {button: 0});

  await fixture.whenStable();

  expect(TestBed.inject(Router).url).toBe('/heroes');
});
```

## Usar um objeto `page` {#use-a-page-object}

O component `HeroDetail` é uma view simples, com um título, dois campos do herói e dois botões.

Mas há bastante complexidade no template, mesmo neste formulário simples.

```angular-html
@if (hero) {
  <div>
    <h2>
      <span>{{ hero.name | titlecase }}</span> Details
    </h2>
    <div><span>id: </span>{{ hero.id }}</div>
    <div>
      <label for="name">name: </label>
      <input id="name" [(ngModel)]="hero.name" placeholder="name" />
    </div>
    <button type="button" (click)="save()">Save</button>
    <button type="button" (click)="cancel()">Cancel</button>
  </div>
}
```

Os testes que exercitam o component precisam de:

- Esperar até que um herói chegue antes que os elementos apareçam no DOM
- Uma referência ao texto do título
- Uma referência à caixa de input do nome, para inspecioná-la e defini-la
- Referências aos dois botões, para que possam clicá-los

Mesmo um formulário pequeno como este pode produzir uma bagunça de configuração condicional complicada e seleção de elementos CSS.

Domine a complexidade com uma classe `Page` que cuida do acesso às propriedades do component e encapsula a lógica que as define.

Aqui está essa classe `Page` para o `hero-detail.component.spec.ts`

```ts
class Page {
  // as propriedades getter só consultam o DOM quando chamadas.
  get buttons() {
    return this.queryAll<HTMLButtonElement>('button');
  }
  get saveBtn() {
    return this.buttons[0];
  }
  get cancelBtn() {
    return this.buttons[1];
  }
  get nameDisplay() {
    return this.query<HTMLElement>('span');
  }
  get nameInput() {
    return this.query<HTMLInputElement>('input');
  }

  //// helpers de consulta ////
  private query<T>(selector: string): T {
    return harness.routeNativeElement!.querySelector(selector)! as T;
  }

  private queryAll<T>(selector: string): T[] {
    return harness.routeNativeElement!.querySelectorAll(selector) as any as T[];
  }
}
```

Agora, os hooks importantes para manipulação e inspeção do component estão organizados e acessíveis a partir de uma instância de `Page`.

Um método `createComponent` cria um objeto `page` e preenche os valores ausentes assim que o `hero` chega.

```ts
async function createComponent(id: number) {
  harness = await RouterTestingHarness.create();
  component = await harness.navigateByUrl(`/heroes/${id}`, HeroDetail);
  page = new Page();

  const request = TestBed.inject(HttpTestingController).expectOne(`api/heroes/?id=${id}`);
  const hero = getTestHeroes().find((h) => h.id === Number(id));
  request.flush(hero ? [hero] : []);
  await harness.fixture.whenStable();
}
```

Aqui estão mais alguns testes do component `HeroDetail` para reforçar o ponto.

```ts
it("should display that hero's name", () => {
  expect(page.nameDisplay.textContent).toBe(expectedHero.name);
});

it('should navigate when click cancel', () => {
  click(page.cancelBtn);
  expect(TestBed.inject(Router).url).toEqual(`/heroes/${expectedHero.id}`);
});

it('should save when click save but not navigate immediately', () => {
  click(page.saveBtn);
  expect(TestBed.inject(HttpTestingController).expectOne({method: 'PUT', url: 'api/heroes'}));
  expect(TestBed.inject(Router).url).toEqual('/heroes/41');
});

it('should navigate when click save and save resolves', async () => {
  click(page.saveBtn);
  await harness.fixture.whenStable();
  expect(TestBed.inject(Router).url).toEqual('/heroes/41');
});

it('should convert hero name to Title Case', async () => {
  // obtém os elementos de input e de exibição do nome a partir do DOM
  const hostElement: HTMLElement = harness.routeNativeElement!;
  const nameInput: HTMLInputElement = hostElement.querySelector('input')!;
  const nameDisplay: HTMLElement = hostElement.querySelector('span')!;

  // simula o usuário digitando um novo nome na caixa de input
  nameInput.value = 'quick BROWN  fOx';

  // Dispara um evento DOM para que o Angular saiba da alteração do valor do input.
  nameInput.dispatchEvent(new Event('input'));

  // Aguarda o Angular atualizar o binding de exibição através do pipe de título
  await harness.fixture.whenStable();

  expect(nameDisplay.textContent).toBe('Quick Brown  Fox');
});
```

## Override de component providers {#override-component-providers}

O `HeroDetail` fornece seu próprio `HeroDetailService`.

```ts
@Component({
  /* ... */
  providers: [HeroDetailService],
})
export class HeroDetail {
  private heroDetailService = inject(HeroDetailService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
}
```

Não é possível fazer stub do `HeroDetailService` do component nos `providers` do `TestBed.configureTestingModule`.
Esses são providers do _module de teste_, não do component.
Eles preparam o dependency injector no _nível do fixture_.

O Angular cria o component com seu _próprio_ injector, que é um _filho_ do injector do fixture.
Ele registra os providers do component \(o `HeroDetailService`, neste caso\) no injector filho.

Um teste não consegue obter services do injector filho a partir do injector do fixture.
E o `TestBed.configureTestingModule` também não consegue configurá-los.

O Angular criou novas instâncias do `HeroDetailService` real o tempo todo!

HELPFUL: Esses testes podem falhar ou expirar se o `HeroDetailService` fizer suas próprias chamadas XHR a um servidor remoto.
Pode não haver um servidor remoto para chamar.

Felizmente, o `HeroDetailService` delega a responsabilidade pelo acesso a dados remotos a um `HeroService` injetado.

```ts
@Service()
export class HeroDetailService {
  private heroService = inject(HeroService);
}
```

A configuração de teste anterior substitui o `HeroService` real por um `TestHeroService`, que intercepta as requisições ao servidor e falsifica suas respostas.

E se você não tiver tanta sorte? E se falsificar o `HeroService` for difícil? E se o `HeroDetailService` fizer suas próprias requisições ao servidor?

O método `TestBed.overrideComponent` pode substituir os `providers` do component por _test doubles_ fáceis de gerenciar, como visto na seguinte variação de configuração:

```ts
beforeEach(async () => {
  await TestBed.configureTestingModule({
    providers: [
      provideRouter([
        {path: 'heroes', component: HeroList},
        {path: 'heroes/:id', component: HeroDetail},
      ]),
      // O HeroDetailService neste nível é IRRELEVANTE!
      {provide: HeroDetailService, useValue: {}},
    ],
  }).overrideComponent(HeroDetail, {
    set: {providers: [{provide: HeroDetailService, useClass: HeroDetailServiceSpy}]},
  });
});
```

Observe que o `TestBed.configureTestingModule` não fornece mais um `HeroService` falso, porque [não é necessário](#provide-a-spy-stub-herodetailservicespy).

### O método `overrideComponent` {#the-overridecomponent-method}

Foque no método `overrideComponent`.

```ts
.overrideComponent(HeroDetail, {
  set: {providers: [{provide: HeroDetailService, useClass: HeroDetailServiceSpy}]},
});
```

Ele recebe dois argumentos: o tipo do component a ser sobrescrito \(`HeroDetail`\) e um objeto de metadata de override.
O [objeto de metadata de override](/guide/testing/utility-apis#testbed-class-summary) é um genérico definido assim:

```ts
type MetadataOverride<T> = {
  add?: Partial<T>;
  remove?: Partial<T>;
  set?: Partial<T>;
};
```

Um objeto de metadata de override pode adicionar e remover elementos em propriedades de metadata, ou redefinir essas propriedades por completo.
Este exemplo redefine a metadata `providers` do component.

O parâmetro de tipo, `T`, é o tipo de metadata que você passaria para o decorator `@Component`:

```ts
selector?: string;
template?: string;
templateUrl?: string;
providers?: any[];
…
```

### Fornecer um _spy stub_ (`HeroDetailServiceSpy`) {#provide-a-spy-stub-herodetailservicespy}

Este exemplo substitui completamente o array `providers` do component por um novo array contendo um `HeroDetailServiceSpy`.

O `HeroDetailServiceSpy` é uma versão stub do `HeroDetailService` real, que simula todos os recursos necessários desse service.
Ele não injeta nem delega ao `HeroService` de nível inferior, então não há necessidade de fornecer um test double para ele.

Os testes relacionados do component `HeroDetail` vão verificar se os métodos do `HeroDetailService` foram chamados, espionando os métodos do service.
Por isso, o stub implementa seus métodos como spies:

```ts
import {vi} from 'vitest';

class HeroDetailServiceSpy {
  testHero: Hero = {...testHero};

  /* emite um clone do herói de teste */
  getHero = vi.fn(() => asyncData({...this.testHero}));

  /* emite um clone do herói de teste, com as alterações mescladas */
  saveHero = vi.fn((hero: Hero) => asyncData(Object.assign(this.testHero, hero)));
}
```

### Os testes de override {#the-override-tests}

Agora os testes podem controlar diretamente o herói do component, manipulando o `testHero` do spy stub, e confirmar que os métodos do service foram chamados.

```ts
let hdsSpy: HeroDetailServiceSpy;

beforeEach(async () => {
  harness = await RouterTestingHarness.create();
  component = await harness.navigateByUrl(`/heroes/${testHero.id}`, HeroDetail);
  page = new Page();
  // obtém o HeroDetailServiceSpy injetado no component
  hdsSpy = harness.routeDebugElement!.injector.get(HeroDetailService) as any;

  harness.detectChanges();
});

it('should have called `getHero`', () => {
  expect(hdsSpy.getHero, 'getHero called once').toHaveBeenCalledTimes(1);
});

it("should display stub hero's name", () => {
  expect(page.nameDisplay.textContent).toBe(hdsSpy.testHero.name);
});

it('should save stub hero change', async () => {
  const origName = hdsSpy.testHero.name;
  const newName = 'New Name';

  page.nameInput.value = newName;

  page.nameInput.dispatchEvent(new Event('input')); // avisa o Angular

  expect(component.hero.name, 'component hero has new name').toBe(newName);
  expect(hdsSpy.testHero.name, 'service hero unchanged before save').toBe(origName);

  click(page.saveBtn);
  expect(hdsSpy.saveHero, 'saveHero called once').toHaveBeenCalledTimes(1);

  await harness.fixture.whenStable();
  expect(hdsSpy.testHero.name, 'service hero has new name after save').toBe(newName);
  expect(TestBed.inject(Router).url).toEqual('/heroes');
});
```

### Mais overrides {#more-overrides}

O método `TestBed.overrideComponent` pode ser chamado várias vezes, para os mesmos components ou para components diferentes.
O `TestBed` oferece métodos semelhantes, `overrideDirective`, `overrideModule` e `overridePipe`, para investigar e substituir partes dessas outras classes.

Explore as opções e combinações por conta própria.
