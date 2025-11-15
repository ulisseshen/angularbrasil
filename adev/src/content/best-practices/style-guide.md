<!-- ia-translate: true -->
# Guia de estilo de código Angular

## Introdução

Este guia cobre uma gama de convenções de estilo para código de aplicações Angular. Essas recomendações não são necessárias para que o Angular funcione, mas estabelecem um conjunto de práticas de codificação que promovem consistência no ecossistema Angular. Um conjunto consistente de práticas facilita o compartilhamento de código e a movimentação entre projetos.

Este guia _não_ cobre TypeScript ou práticas gerais de codificação não relacionadas ao Angular. Para TypeScript, confira o [guia de estilo TypeScript do Google](https://google.github.io/styleguide/tsguide.html).

### Na dúvida, prefira consistência

Sempre que você encontrar uma situação em que essas regras contradigam o estilo de um arquivo específico, priorize manter a consistência dentro do arquivo. Misturar diferentes convenções de estilo em um único arquivo cria mais confusão do que divergir das recomendações neste guia.

## Nomenclatura

### Separe palavras em nomes de arquivos com hífens

Separe palavras dentro de um nome de arquivo com hífens (`-`). Por exemplo, um component chamado `UserProfile` tem um nome de arquivo `user-profile.ts`.

### Use o mesmo nome para os testes de um arquivo com `.spec` no final

Para testes unitários, termine os nomes dos arquivos com `.spec.ts`. Por exemplo, o arquivo de teste unitário para o component `UserProfile` tem o nome de arquivo `user-profile.spec.ts`.

### Combine nomes de arquivos com o identificador TypeScript dentro deles

Os nomes de arquivos geralmente devem descrever o conteúdo do código no arquivo. Quando o arquivo contém uma classe TypeScript, o nome do arquivo deve refletir o nome dessa classe. Por exemplo, um arquivo contendo um component chamado `UserProfile` tem o nome `user-profile.ts`.

Se o arquivo contiver mais de um identificador principal nomeável, escolha um nome que descreva o tema comum ao código dentro dele. Se o código em um arquivo não se encaixar em um tema ou área de funcionalidade comum, considere dividir o código em arquivos diferentes. Evite nomes de arquivos excessivamente genéricos como `helpers.ts`, `utils.ts` ou `common.ts`.

### Use o mesmo nome de arquivo para o TypeScript, template e estilos de um component

Components geralmente consistem em um arquivo TypeScript, um arquivo de template e um arquivo de estilo. Esses arquivos devem compartilhar o mesmo nome com extensões de arquivo diferentes. Por exemplo, um component `UserProfile` pode ter os arquivos `user-profile.ts`, `user-profile.html` e `user-profile.css`.

Se um component tiver mais de um arquivo de estilo, acrescente ao nome palavras adicionais que descrevam os estilos específicos desse arquivo. Por exemplo, `UserProfile` pode ter arquivos de estilo `user-profile-settings.css` e `user-profile-subscription.css`.

## Estrutura do projeto

### Todo o código da aplicação vai em um diretório chamado `src`

Todo o seu código de UI Angular (TypeScript, HTML e estilos) deve ficar dentro de um diretório chamado `src`. Código que não está relacionado à UI, como arquivos de configuração ou scripts, deve ficar fora do diretório `src`.

Isso mantém o diretório raiz da aplicação consistente entre diferentes projetos Angular e cria uma separação clara entre código de UI e outro código no seu projeto.

### Inicialize sua aplicação em um arquivo chamado `main.ts` diretamente dentro de `src`

O código para iniciar, ou **bootstrap**, uma aplicação Angular deve sempre ficar em um arquivo chamado `main.ts`. Isso representa o ponto de entrada principal da aplicação.

### Agrupe arquivos intimamente relacionados no mesmo diretório

Components Angular consistem em um arquivo TypeScript e, opcionalmente, um template e um ou mais arquivos de estilo. Você deve agrupá-los no mesmo diretório.

Testes unitários devem ficar no mesmo diretório que o código em teste. Evite coletar testes não relacionados em um único diretório `tests`.

### Organize seu projeto por áreas de funcionalidade

Organize seu projeto em subdiretórios baseados nas funcionalidades da sua aplicação ou temas comuns ao código nesses diretórios. Por exemplo, a estrutura do projeto para um site de cinema, MovieReel, pode parecer com isso:

```
src/
├─ movie-reel/
│ ├─ show-times/
│ │ ├─ film-calendar/
│ │ ├─ film-details/
│ ├─ reserve-tickets/
│ │ ├─ payment-info/
│ │ ├─ purchase-confirmation/
```

Evite criar subdiretórios baseados no tipo de código que vive nesses diretórios. Por exemplo, evite criar diretórios como `components`, `directives` e `services`.

Evite colocar tantos arquivos em um diretório que se torne difícil de ler ou navegar. À medida que o número de arquivos em um diretório cresce, considere dividir ainda mais em subdiretórios adicionais.

### Um conceito por arquivo

Prefira focar arquivos de código em um único _conceito_. Para classes Angular especificamente, isso geralmente significa um component, directive ou service por arquivo. No entanto, não há problema se um arquivo contiver mais de um component ou directive se suas classes forem relativamente pequenas e se vincularem como parte de um único conceito.

Na dúvida, vá com a abordagem que leva a arquivos menores.

## Injeção de dependência

### Prefira a função `inject` sobre injeção de parâmetro de construtor

Prefira usar a função `inject` em vez de injetar parâmetros de construtor. A função `inject` funciona da mesma forma que a injeção de parâmetro de construtor, mas oferece várias vantagens de estilo:

- `inject` é geralmente mais legível, especialmente quando uma classe injeta muitas dependências.
- É sintaticamente mais direto adicionar comentários às dependências injetadas
- `inject` oferece melhor inferência de tipo.
- Ao direcionar para ES2022+ com [`useDefineForClassFields`](https://www.typescriptlang.org/tsconfig/#useDefineForClassFields), você pode evitar separar declaração e inicialização de campo quando os campos leem dependências injetadas.

[Você pode refatorar código existente para `inject` com uma ferramenta automática](reference/migrations/inject-function).

## Components e directives

### Escolhendo seletores de component

Veja o [guia de Components para detalhes sobre como escolher seletores de component](guide/components/selectors#choosing-a-selector).

### Nomeando membros de component e directive

Veja o guia de Components para detalhes sobre [nomear propriedades de input](guide/components/inputs#choosing-input-names) e [nomear propriedades de output](guide/components/outputs#choosing-event-names).

### Escolhendo seletores de directive

Directives devem usar o mesmo [prefixo específico da aplicação](guide/components/selectors#selector-prefixes) que seus components.

Ao usar um seletor de atributo para uma directive, use um nome de atributo camelCase. Por exemplo, se sua aplicação se chama "MovieReel" e você constrói uma directive que adiciona um tooltip a um elemento, você pode usar o seletor `[mrTooltip]`.

### Agrupe propriedades específicas do Angular antes dos métodos

Components e directives devem agrupar propriedades específicas do Angular, normalmente perto do topo da declaração da classe. Isso inclui dependências injetadas, inputs, outputs e queries. Defina essas e outras propriedades antes dos métodos da classe.

Essa prática facilita encontrar as APIs de template da classe e as dependências.

### Mantenha components e directives focados em apresentação

O código dentro dos seus components e directives geralmente deve se relacionar à UI mostrada na página. Para código que faça sentido por si só, desacoplado da UI, prefira refatorar para outros arquivos. Por exemplo, você pode extrair regras de validação de formulário ou transformações de dados em funções ou classes separadas.

### Evite lógica excessivamente complexa em templates

Templates do Angular são projetados para acomodar [expressões semelhantes a JavaScript](guide/templates/expression-syntax). Você deve aproveitar essas expressões para capturar lógica relativamente direta diretamente em expressões de template.

Quando o código em um template fica muito complexo, no entanto, refatore a lógica para o código TypeScript (normalmente com um [computed](guide/signals#computed-signals)).

Não há uma regra única e rápida que determine o que constitui "complexo". Use seu melhor julgamento.

### Use `protected` em membros de classe que são usados apenas pelo template de um component

Os membros públicos de uma classe de component definem intrinsecamente uma API pública que é acessível via injeção de dependência e [queries](guide/components/queries). Prefira acesso `protected` para quaisquer membros que são destinados a serem lidos do template do component.

```ts
@Component({
  ...,
  template: `<p>{{ fullName() }}</p>`,
})
export class UserProfile {
  firstName = input();
  lastName = input();

// `fullName` não faz parte da API pública do component, mas é usado no template.
  protected fullName = computed(() => `${this.firstName()} ${this.lastName()}`);
}
```

### Use `readonly` para propriedades que não devem mudar

Marque propriedades de component e directive inicializadas pelo Angular como `readonly`. Isso inclui propriedades inicializadas por `input`, `model`, `output` e queries. O modificador de acesso readonly garante que o valor definido pelo Angular não seja sobrescrito.

```ts
@Component({/* ... */})
export class UserProfile {
  readonly userId = input();
  readonly userSaved = output();
  readonly userName = model();
}
```

Para components e directives que usam as APIs `@Input`, `@Output` e queries baseadas em decorator, esse conselho se aplica a propriedades de output e queries, mas não a propriedades de input.

```ts
@Component({/* ... */})
export class UserProfile {
  @Output() readonly userSaved = new EventEmitter<void>();
  @ViewChildren(PaymentMethod) readonly paymentMethods?: QueryList<PaymentMethod>;
}
```

### Prefira `class` e `style` em vez de `ngClass` e `ngStyle`

Prefira bindings `class` e `style` em vez de usar as directives [`NgClass`](/api/common/NgClass) e [`NgStyle`](/api/common/NgStyle).

```html
<!-- PREFIRA -->
<div [class.admin]="isAdmin" [class.dense]="density === 'high'">
<!-- OU -->
<div [class]="{admin: isAdmin, dense: density === 'high'}">


<!-- EVITE -->
<div [ngClass]="{admin: isAdmin, dense: density === 'high'}">
```

Ambos os bindings `class` e `style` usam uma sintaxe mais direta que se alinha mais proximamente aos atributos HTML padrão. Isso torna seus templates mais fáceis de ler e entender, especialmente para desenvolvedores familiarizados com HTML básico.

Além disso, as directives `NgClass` e `NgStyle` incorrem em um custo de desempenho adicional em comparação com a sintaxe de binding `class` e `style` integrada.

Para mais detalhes, consulte o [guia de bindings](/guide/templates/binding#css-class-and-style-property-bindings)

### Nomeie event handlers pelo que eles _fazem_, não pelo evento que os dispara

Prefira nomear event handlers pela ação que executam em vez do evento que os dispara:

```html
<!-- PREFIRA -->
<button (click)="saveUserData()">Save</button>

<!-- EVITE -->
<button (click)="handleClick()">Save</button>
```

Usar nomes significativos como este facilita saber o que um evento faz ao ler o template.

Para eventos de teclado, você pode usar os modificadores de evento de tecla do Angular com nomes de handler específicos:

```html
<textarea (keydown.control.enter)="commitNotes()" (keydown.control.space)="showSuggestions()">
```

Às vezes, a lógica de tratamento de eventos é especialmente longa ou complexa, tornando impraticável declarar um único handler bem nomeado. Nesses casos, não há problema em voltar a um nome como 'handleKeydown' e então delegar a comportamentos mais específicos com base nos detalhes do evento:

```ts

@Component({/* ... */})
class RichText {
  handleKeydown(event: KeyboardEvent) {
    if (event.ctrlKey) {
      if (event.key === 'B') {
        this.activateBold();
      } else if (event.key === 'I') {
        this.activateItalic();
      }
// ...
    }
  }
}
```

### Mantenha métodos de ciclo de vida simples

Evite colocar lógica longa ou complexa dentro de hooks de ciclo de vida como `ngOnInit`. Em vez disso, prefira criar métodos bem nomeados para conter essa lógica e então _chamar esses métodos_ nos seus hooks de ciclo de vida. Nomes de hooks de ciclo de vida descrevem _quando_ eles executam, o que significa que o código dentro não tem um nome significativo que descreva o que o código está fazendo.

```typescript
// PREFIRA
ngOnInit() {
  this.startLogging();
  this.runBackgroundTask();
}

// EVITE
ngOnInit() {
  this.logger.setMode('info');
  this.logger.monitorErrors();
  // ...e todo o resto do código que seria desdobrado desses métodos.
}
```

### Use interfaces de hook de ciclo de vida

O Angular fornece uma interface TypeScript para cada método de ciclo de vida. Ao adicionar um hook de ciclo de vida à sua classe, importe e `implement` essas interfaces para garantir que os métodos sejam nomeados corretamente.

```ts
import {Component, OnInit} from '@angular/core';

@Component({/* ... */})
export class UserProfile implements OnInit {

  // A interface `OnInit` garante que este método seja nomeado corretamente.
  ngOnInit() { /* ... */ }
}
```
