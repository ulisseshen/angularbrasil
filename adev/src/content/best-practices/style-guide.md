<!-- ia-translate: true -->
# Guia de estilo de código Angular

## Introdução {#introduction}

Este guia cobre uma série de convenções de estilo para o código de aplicações Angular. Essas recomendações não são obrigatórias para que o Angular funcione, mas estabelecem um conjunto de práticas de codificação que promovem consistência em todo o ecossistema Angular. Um conjunto consistente de práticas facilita compartilhar código e trocar de projeto.

Este guia _não_ cobre TypeScript nem práticas gerais de codificação não relacionadas ao Angular. Para TypeScript, consulte o [guia de estilo TypeScript do Google](https://google.github.io/styleguide/tsguide.html).

### Na dúvida, prefira consistência {#when-in-doubt-prefer-consistency}

Sempre que você encontrar uma situação em que estas regras contradigam o estilo de um arquivo específico, priorize manter a consistência dentro desse arquivo. Misturar diferentes convenções de estilo em um único arquivo gera mais confusão do que divergir das recomendações deste guia.

## Nomenclatura {#naming}

### Separe palavras em nomes de arquivos com hífens {#separate-words-in-file-names-with-hyphens}

Separe as palavras dentro de um nome de arquivo com hífens (`-`). Por exemplo, um component chamado `UserProfile` tem o nome de arquivo `user-profile.ts`.

### Use o mesmo nome para os testes de um arquivo com `.spec` no final {#use-the-same-name-for-a-files-tests-with-spec-at-the-end}

Para testes unitários, termine os nomes dos arquivos com `.spec.ts`. Por exemplo, o arquivo de teste unitário do component `UserProfile` tem o nome `user-profile.spec.ts`.

### Combine nomes de arquivos com o identificador TypeScript dentro deles {#match-file-names-to-the-typescript-identifier-within}

Os nomes de arquivos devem, em geral, descrever o conteúdo do código neles. Quando o arquivo contém uma classe TypeScript, o nome do arquivo deve refletir o nome dessa classe. Por exemplo, um arquivo que contém um component chamado `UserProfile` tem o nome `user-profile.ts`.

Se o arquivo contiver mais de um identificador principal com nome, escolha um nome que descreva o tema comum ao código dentro dele. Se o código de um arquivo não se encaixar em um tema comum ou em uma área de funcionalidade, considere dividi-lo em arquivos diferentes. Evite nomes de arquivos excessivamente genéricos, como `helpers.ts`, `utils.ts` ou `common.ts`.

### Use o mesmo nome de arquivo para o TypeScript, o template e os estilos de um component {#use-the-same-file-name-for-a-components-typescript-template-and-styles}

Components normalmente consistem em um arquivo TypeScript, um arquivo de template e um arquivo de estilo. Esses arquivos devem compartilhar o mesmo nome, com extensões diferentes. Por exemplo, um component `UserProfile` pode ter os arquivos `user-profile.ts`, `user-profile.html` e `user-profile.css`.

Se um component tiver mais de um arquivo de estilo, acrescente ao nome palavras adicionais que descrevam os estilos específicos daquele arquivo. Por exemplo, `UserProfile` pode ter os arquivos de estilo `user-profile-settings.css` e `user-profile-subscription.css`.

## Estrutura do projeto {#project-structure}

### Todo o código da aplicação vai em um diretório chamado `src` {#all-the-applications-code-goes-in-a-directory-named-src}

Todo o seu código de UI Angular (TypeScript, HTML e estilos) deve ficar dentro de um diretório chamado `src`. Código que não está relacionado à UI, como arquivos de configuração ou scripts, deve ficar fora do diretório `src`.

Isso mantém o diretório raiz da aplicação consistente entre diferentes projetos Angular e cria uma separação clara entre o código de UI e os demais códigos do projeto.

### Inicialize sua aplicação em um arquivo chamado `main.ts` diretamente dentro de `src` {#bootstrap-your-application-in-a-file-named-maints-directly-inside-src}

O código para iniciar, ou **fazer o bootstrap** de, uma aplicação Angular deve sempre ficar em um arquivo chamado `main.ts`. Ele representa o ponto de entrada principal da aplicação.

### Agrupe arquivos intimamente relacionados no mesmo diretório {#group-closely-related-files-together-in-the-same-directory}

Components Angular consistem em um arquivo TypeScript e, opcionalmente, em um template e um ou mais arquivos de estilo. Você deve agrupá-los no mesmo diretório.

Testes unitários devem ficar no mesmo diretório do código testado. Evite reunir testes não relacionados em um único diretório `tests`.

### Organize seu projeto por áreas de funcionalidade {#organize-your-project-by-feature-areas}

Organize seu projeto em subdiretórios baseados nas funcionalidades da aplicação ou em temas comuns ao código de cada diretório. Por exemplo, a estrutura de projeto de um site de cinema, o MovieReel, pode ser assim:

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

Evite criar subdiretórios com base no tipo de código que existe neles. Por exemplo, evite criar diretórios como `components`, `directives` e `services`.

Evite colocar tantos arquivos em um mesmo diretório que ele se torne difícil de ler ou navegar. À medida que o número de arquivos em um diretório cresce, considere dividi-lo em subdiretórios adicionais.

### Um conceito por arquivo {#one-concept-per-file}

Prefira focar os arquivos de código em um único _conceito_. Para classes Angular, isso normalmente significa um component, directive ou service por arquivo. No entanto, é aceitável que um arquivo contenha mais de um component ou directive se suas classes forem relativamente pequenas e estiverem ligadas a um único conceito.

Na dúvida, opte pela abordagem que leva a arquivos menores.

## Injeção de dependência {#dependency-injection}

### Prefira a função `inject` sobre a injeção de parâmetros do construtor {#prefer-the-inject-function-over-constructor-parameter-injection}

Prefira usar a função [`inject`](/api/core/inject) em vez de injetar parâmetros do construtor. A função [`inject`](/api/core/inject) funciona da mesma forma que a injeção por parâmetro do construtor, mas oferece várias vantagens de estilo:

- [`inject`](/api/core/inject) é geralmente mais legível, especialmente quando uma classe injeta muitas dependências.
- É sintaticamente mais simples adicionar comentários às dependências injetadas.
- [`inject`](/api/core/inject) oferece melhor inferência de tipos.
- Ao direcionar para ES2022+ com [`useDefineForClassFields`](https://www.typescriptlang.org/tsconfig/#useDefineForClassFields), você pode evitar separar a declaração e a inicialização de campos que leem dependências injetadas.

[Você pode refatorar código existente para `inject` com uma ferramenta automática](reference/migrations/inject-function).

## Components e directives {#components-and-directives}

### Escolhendo seletores de component {#choosing-component-selectors}

Veja o [guia de Components para detalhes sobre como escolher seletores de component](guide/components/selectors#choosing-a-selector).

### Nomeando membros de component e directive {#naming-component-and-directive-members}

Veja o guia de Components para detalhes sobre como [nomear propriedades de input](guide/components/inputs#choosing-input-names) e [nomear propriedades de output](guide/components/outputs#choosing-event-names).

### Escolhendo seletores de directive {#choosing-directive-selectors}

Directives devem usar o mesmo [prefixo específico da aplicação](guide/components/selectors#selector-prefixes) que seus components.

Ao usar um seletor de atributo para uma directive, use um nome de atributo em camelCase. Por exemplo, se a sua aplicação se chama "MovieReel" e você cria uma directive que adiciona um tooltip a um elemento, pode usar o seletor `[mrTooltip]`.

### Agrupe propriedades específicas do Angular antes dos métodos {#group-angular-specific-properties-before-methods}

Components e directives devem agrupar as propriedades específicas do Angular, normalmente no topo da declaração da classe. Isso inclui dependências injetadas, inputs, outputs e queries. Defina essas propriedades, e as demais, antes dos métodos da classe.

Essa prática facilita encontrar as APIs de template e as dependências da classe.

### Mantenha components e directives focados na apresentação {#keep-components-and-directives-focused-on-presentation}

O código dentro dos seus components e directives deve, em geral, se relacionar com a UI exibida na página. Para código que faça sentido por si só, desacoplado da UI, prefira refatorar para outros arquivos. Por exemplo, você pode extrair regras de validação de formulário ou transformações de dados para funções ou classes separadas.

### Evite lógica excessivamente complexa em templates {#avoid-overly-complex-logic-in-templates}

Templates do Angular são projetados para acomodar [expressões semelhantes ao JavaScript](guide/templates/expression-syntax). Aproveite essas expressões para capturar lógica relativamente simples diretamente nas expressões do template.

Quando o código de um template ficar complexo demais, no entanto, refatore a lógica para o código TypeScript (normalmente com um [computed](guide/signals#computed-signals)).

Não existe uma regra única e definitiva que determine o que é "complexo". Use o seu melhor julgamento.

### Use `protected` em membros de classe que são usados apenas pelo template de um component {#use-protected-on-class-members-that-are-only-used-by-a-components-template}

Os membros públicos da classe de um component definem, por natureza, uma API pública acessível por meio de injeção de dependência e de [queries](guide/components/queries). Prefira o acesso `protected` para quaisquer membros que devam ser lidos pelo template do component.

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

### Use `readonly` para propriedades que não devem mudar {#use-readonly-for-properties-that-shouldnt-change}

Marque como `readonly` as propriedades de component e directive inicializadas pelo Angular. Isso inclui propriedades inicializadas por `input`, `model`, `output` e queries. O modificador de acesso readonly garante que o valor definido pelo Angular não seja sobrescrito.

```ts
@Component(/* ... */)
export class UserProfile {
  readonly userId = input();
  readonly userSaved = output();
  readonly userName = model();
}
```

Para components e directives que usam as APIs baseadas em decorator `@Input`, `@Output` e de queries, esse conselho se aplica às propriedades de output e às queries, mas não às propriedades de input.

```ts
@Component(/* ... */)
export class UserProfile {
  @Output() readonly userSaved = new EventEmitter<void>();
  @ViewChildren(PaymentMethod) readonly paymentMethods?: QueryList<PaymentMethod>;
}
```

### Prefira `class` e `style` em vez de `ngClass` e `ngStyle` {#prefer-class-and-style-over-ngclass-and-ngstyle}

Prefira os bindings `class` e `style` em vez de usar as directives [`NgClass`](/api/common/NgClass) e [`NgStyle`](/api/common/NgStyle).

```html {prefer}
<div [class.admin]="isAdmin" [class.dense]="density === 'high'">
  <div [style.color]="textColor" [style.background-color]="backgroundColor">
    <!-- OU -->
    <div [class]="{admin: isAdmin, dense: density === 'high'}">
      <div [style]="{'color': textColor, 'background-color': backgroundColor}"></div>
    </div>
  </div>
</div>
```

```html {avoid}
<div [ngClass]="{admin: isAdmin, dense: density === 'high'}">
  <div [ngStyle]="{'color': textColor, 'background-color': backgroundColor}"></div>
</div>
```

Ambos os bindings `class` e `style` usam uma sintaxe mais direta, que se alinha de perto aos atributos HTML padrão. Isso torna seus templates mais fáceis de ler e entender, especialmente para desenvolvedores familiarizados com HTML básico.

Além disso, as directives `NgClass` e `NgStyle` geram um custo de desempenho adicional em comparação com a sintaxe de binding `class` e `style` integrada.

Para mais detalhes, consulte o [guia de bindings](/guide/templates/binding#css-class-and-style-property-bindings)

### Nomeie event handlers pelo que eles _fazem_, não pelo evento que os dispara {#name-event-handlers-for-what-they-do-not-for-the-triggering-event}

Prefira nomear event handlers pela ação que executam, em vez do evento que os dispara:

```html {prefer}
<button (click)="saveUserData()">Save</button>
```

```html {avoid}
<button (click)="handleClick()">Save</button>
```

Usar nomes significativos como este facilita entender o que um evento faz apenas lendo o template.

Para eventos de teclado, você pode usar os modificadores de evento de tecla do Angular com nomes de handler específicos:

```html
<textarea (keydown.control.enter)="commitNotes()" (keydown.control.space)="showSuggestions()">
```

Às vezes, a lógica de tratamento de eventos é especialmente longa ou complexa, o que torna impraticável declarar um único handler bem nomeado. Nesses casos, é aceitável recorrer a um nome como 'handleKeydown' e então delegar a comportamentos mais específicos com base nos detalhes do evento:

```ts
@Component(/* ... */)
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

### Mantenha métodos de ciclo de vida simples {#keep-lifecycle-methods-simple}

Evite colocar lógica longa ou complexa dentro de lifecycle hooks como `ngOnInit`. Em vez disso, prefira criar métodos bem nomeados para conter essa lógica e então _chamar esses métodos_ nos seus lifecycle hooks. Os nomes dos lifecycle hooks descrevem _quando_ eles são executados, o que significa que o código dentro deles não tem um nome significativo que descreva o que ele faz.

```ts {prefer}
ngOnInit() {
  this.startLogging();
  this.runBackgroundTask();
}
```

```ts {avoid}
ngOnInit() {
  this.logger.setMode('info');
  this.logger.monitorErrors();
  // ...e todo o restante do código que seria desdobrado desses métodos.
}
```

### Use interfaces de lifecycle hooks {#use-lifecycle-hook-interfaces}

O Angular fornece uma interface TypeScript para cada método de ciclo de vida. Ao adicionar um lifecycle hook à sua classe, importe e `implement` essas interfaces para garantir que os métodos sejam nomeados corretamente.

```ts
import {Component, OnInit} from '@angular/core';

@Component(/* ... */)
export class UserProfile implements OnInit {
  // A interface `OnInit` garante que este método seja nomeado corretamente.
  ngOnInit() {
    /* ... */
  }
}
```
