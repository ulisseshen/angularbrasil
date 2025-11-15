<!-- ia-translate: true -->
# Aceitando dados com propriedades de input

TIP: Este guia pressupõe que você já leu o [Guia de Fundamentos](essentials). Leia-o primeiro se você é novo no Angular.

TIP: Se você está familiarizado com outros frameworks web, propriedades de input são similares a _props_.

Quando você usa um component, você comumente quer passar alguns dados para ele. Um component especifica os dados que aceita declarando **inputs**:

<docs-code language="ts" highlight="[5]">
import {Component, input} from '@angular/core';

@Component({/_..._/})
export class CustomSlider {
// Declare an input named 'value' with a default value of zero.
value = input(0);
}
</docs-code>

Isso permite vincular à propriedade em um template:

```angular-html
<custom-slider [value]="50" />
```

Se um input tem um valor padrão, o TypeScript infere o tipo a partir do valor padrão:

```ts
@Component({/*...*/})
export class CustomSlider {
  // TypeScript infers that this input is a number, returning InputSignal<number>.
  value = input(0);
}
```

Você pode declarar explicitamente um tipo para o input especificando um parâmetro genérico para a função.

Se um input sem um valor padrão não for definido, seu valor é `undefined`:

```ts
@Component({/*...*/})
export class CustomSlider {
  // Produces an InputSignal<number | undefined> because `value` may not be set.
  value = input<number>();
}
```

**O Angular registra inputs estaticamente em tempo de compilação**. Inputs não podem ser adicionados ou removidos em tempo de execução.

A função `input` tem significado especial para o compilador do Angular. **Você pode chamar exclusivamente `input` em inicializadores de propriedade de component e directive.**

Ao estender uma classe de component, **inputs são herdados pela classe filha.**

**Nomes de input são sensíveis a maiúsculas e minúsculas.**

## Lendo inputs

A função `input` retorna um `InputSignal`. Você pode ler o valor chamando o signal:

<docs-code language="ts" highlight="[5]">
import {Component, input} from '@angular/core';

@Component({/_..._/})
export class CustomSlider {
// Declare an input named 'value' with a default value of zero.
value = input(0);

// Create a computed expression that reads the value input
label = computed(() => `The slider's value is ${this.value()}`);
}
</docs-code>

Signals criados pela função `input` são somente leitura.

## Inputs obrigatórios

Você pode declarar que um input é `required` (obrigatório) chamando `input.required` em vez de `input`:

<docs-code language="ts" highlight="[3]">
@Component({/*...*/})
export class CustomSlider {
  // Declare a required input named value. Returns an `InputSignal<number>`.
  value = input.required<number>();
}
</docs-code>

O Angular garante que inputs obrigatórios _devem_ ser definidos quando o component é usado em um template. Se você tentar usar um component sem especificar todos os seus inputs obrigatórios, o Angular reporta um erro em tempo de build.

Inputs obrigatórios não incluem automaticamente `undefined` no parâmetro genérico do `InputSignal` retornado.

## Configurando inputs

A função `input` aceita um objeto de configuração como segundo parâmetro que permite alterar a forma como o input funciona.

### Transformações de input

Você pode especificar uma função `transform` para alterar o valor de um input quando ele é definido pelo Angular.

<docs-code language="ts" highlight="[6]">
@Component({
  selector: 'custom-slider',
  /*...*/
})
export class CustomSlider {
  label = input('', {transform: trimString});
}

function trimString(value: string | undefined): string {
return value?.trim() ?? '';
}
</docs-code>

```angular-html
<custom-slider [label]="systemVolume" />
```

No exemplo acima, sempre que o valor de `systemVolume` muda, o Angular executa `trimString` e define `label` para o resultado.

O caso de uso mais comum para transformações de input é aceitar uma gama mais ampla de tipos de valor em templates, frequentemente incluindo `null` e `undefined`.

**Funções de transformação de input devem ser estaticamente analisáveis em tempo de build.** Você não pode definir funções de transformação condicionalmente ou como resultado de uma avaliação de expressão.

**Funções de transformação de input devem sempre ser [funções puras](https://en.wikipedia.org/wiki/Pure_function).** Depender de estado fora da função de transformação pode levar a comportamento imprevisível.

#### Verificação de tipo

Quando você especifica uma transformação de input, o tipo do parâmetro da função de transformação determina os tipos de valores que podem ser definidos para o input em um template.

<docs-code language="ts">
@Component({/*...*/})
export class CustomSlider {
  widthPx = input('', {transform: appendPx});
}

function appendPx(value: number): string {
return `${value}px`;
}
</docs-code>

No exemplo acima, o input `widthPx` aceita um `number` enquanto a propriedade `InputSignal` retorna uma `string`.

#### Transformações integradas

O Angular inclui duas funções de transformação integradas para os dois cenários mais comuns: coerção de valores para booleano e números.

<docs-code language="ts">
import {Component, input, booleanAttribute, numberAttribute} from '@angular/core';

@Component({/_..._/})
export class CustomSlider {
disabled = input(false, {transform: booleanAttribute});
value = input(0, {transform: numberAttribute});
}
</docs-code>

`booleanAttribute` imita o comportamento de [atributos booleanos](https://developer.mozilla.org/docs/Glossary/Boolean/HTML) HTML padrão, onde a _presença_ do atributo indica um valor "verdadeiro". No entanto, o `booleanAttribute` do Angular trata a string literal `"false"` como o booleano `false`.

`numberAttribute` tenta analisar o valor fornecido para um número, produzindo `NaN` se a análise falhar.

### Aliases de input

Você pode especificar a opção `alias` para alterar o nome de um input em templates.

<docs-code language="ts" highlight="[3]">
@Component({/*...*/})
export class CustomSlider {
  value = input(0, {alias: 'sliderValue'});
}
</docs-code>

```angular-html
<custom-slider [sliderValue]="50" />
```

Este alias não afeta o uso da propriedade em código TypeScript.

Embora você deva geralmente evitar criar aliases para inputs de components, este recurso pode ser útil para renomear propriedades enquanto preserva um alias para o nome original ou para evitar colisões com o nome de propriedades de elementos DOM nativos.

## Model inputs

**Model inputs** são um tipo especial de input que permite que um component propague novos valores de volta para seu component pai.

Ao criar um component, você pode definir um model input de forma semelhante a como você cria um input padrão.

Ambos os tipos de input permitem que alguém vincule um valor à propriedade. No entanto, **model inputs permitem que o autor do component escreva valores na propriedade**. Se a propriedade estiver vinculada com um binding bidirecional, o novo valor propaga para aquele binding.

```angular-ts
@Component({ /* ... */})
export class CustomSlider {
  // Define a model input named "value".
  value = model(0);

  increment() {
    // Update the model input with a new value, propagating the value to any bindings.
    this.value.update(oldValue => oldValue + 10);
  }
}

@Component({
  /* ... */
  // Using the two-way binding syntax means that any changes to the slider's
  // value automatically propagate back to the `volume` signal.
  // Note that this binding uses the signal *instance*, not the signal value.
  template: `<custom-slider [(value)]="volume" />`,
})
export class MediaControls {
  // Create a writable signal for the `volume` local state.
  volume = signal(0);
}
```

No exemplo acima, o `CustomSlider` pode escrever valores em seu model input `value`, que então propaga esses valores de volta para o signal `volume` em `MediaControls`. Este binding mantém os valores de `value` e `volume` sincronizados. Observe que o binding passa a instância do signal `volume`, não o _valor_ do signal.

Em outros aspectos, model inputs funcionam de forma semelhante a inputs padrão. Você pode ler o valor chamando a função signal, incluindo em contextos reativos como `computed` e `effect`.

Consulte [Binding bidirecional](guide/templates/two-way-binding) para mais detalhes sobre binding bidirecional em templates.

### Binding bidirecional com propriedades simples

Você pode vincular uma propriedade JavaScript simples a um model input.

```angular-ts
@Component({
  /* ... */
  // `value` is a model input.
  // The parenthesis-inside-square-brackets syntax (aka "banana-in-a-box") creates a two-way binding
  template: '<custom-slider [(value)]="volume" />',
})
export class MediaControls {
  protected volume = 0;
}
```

No exemplo acima, o `CustomSlider` pode escrever valores em seu model input `value`, que então propaga esses valores de volta para a propriedade `volume` em `MediaControls`. Este binding mantém os valores de `value` e `volume` sincronizados.

### Eventos `change` implícitos

Quando você declara um model input em um component ou directive, o Angular automaticamente cria um [output](guide/components/outputs) correspondente para aquele model. O nome do output é o nome do model input sufixado com "Change".

```ts
@Directive({ /* ... */ })
export class CustomCheckbox {
  // This automatically creates an output named "checkedChange".
  // Can be subscribed to using `(checkedChange)="handler()"` in the template.
  checked = model(false);
}
```

O Angular emite este evento de mudança sempre que você escreve um novo valor no model input chamando seus métodos `set` ou `update`.

Consulte [Eventos personalizados com outputs](guide/components/outputs) para mais detalhes sobre outputs.

### Personalizando model inputs

Você pode marcar um model input como obrigatório ou fornecer um alias da mesma forma que um [input padrão](guide/signals/inputs).

Model inputs não suportam transformações de input.

### Quando usar model inputs

Use model inputs quando você quiser que um component suporte binding bidirecional. Isso é tipicamente apropriado quando um component existe para modificar um valor com base em interação do usuário. Mais comumente, controles de formulário personalizados, como um seletor de data ou combobox, devem usar model inputs para seu valor principal.

## Escolhendo nomes de input

Evite escolher nomes de input que colidam com propriedades em elementos DOM como HTMLElement. Colisões de nomes introduzem confusão sobre se a propriedade vinculada pertence ao component ou ao elemento DOM.

Evite adicionar prefixos para inputs de component como você faria com seletores de component. Como um determinado elemento pode hospedar apenas um component, quaisquer propriedades personalizadas podem ser assumidas como pertencentes ao component.

## Declarando inputs com o decorator `@Input`

TIP: Embora a equipe do Angular recomende usar a função `input` baseada em signal para novos projetos, a API `@Input` original baseada em decorator continua totalmente suportada.

Você pode alternativamente declarar inputs de component adicionando o decorator `@Input` a uma propriedade:

<docs-code language="ts" highlight="[3]">
@Component({...})
export class CustomSlider {
  @Input() value = 0;
}
</docs-code>

O binding a um input é o mesmo em inputs baseados em signal e baseados em decorator:

```angular-html
<custom-slider [value]="50" />
```

### Personalizando inputs baseados em decorator

O decorator `@Input` aceita um objeto de configuração que permite alterar a forma como o input funciona.

#### Inputs obrigatórios

Você pode especificar a opção `required` para garantir que um determinado input sempre tenha um valor.

<docs-code language="ts" highlight="[3]">
@Component({...})
export class CustomSlider {
  @Input({required: true}) value = 0;
}
</docs-code>

Se você tentar usar um component sem especificar todos os seus inputs obrigatórios, o Angular reporta um erro em tempo de build.

#### Transformações de input

Você pode especificar uma função `transform` para alterar o valor de um input quando ele é definido pelo Angular. Esta função de transformação funciona de forma idêntica às funções de transformação para inputs baseados em signal descritas acima.

<docs-code language="ts" highlight="[6]">
@Component({
  selector: 'custom-slider',
  ...
})
export class CustomSlider {
  @Input({transform: trimString}) label = '';
}

function trimString(value: string | undefined) { return value?.trim() ?? ''; }
</docs-code>

#### Aliases de input

Você pode especificar a opção `alias` para alterar o nome de um input em templates.

<docs-code language="ts" highlight="[3]">
@Component({...})
export class CustomSlider {
  @Input({alias: 'sliderValue'}) value = 0;
}
</docs-code>

```angular-html
<custom-slider [sliderValue]="50" />
```

O decorator `@Input` também aceita o alias como seu primeiro parâmetro no lugar do objeto de configuração.

Aliases de input funcionam da mesma forma que para inputs baseados em signal descritos acima.

### Inputs com getters e setters

Ao usar inputs baseados em decorator, uma propriedade implementada com getter e setter pode ser um input:

```ts
export class CustomSlider {
  @Input()
  get value(): number {
    return this.internalValue;
  }

  set value(newValue: number) { this.internalValue = newValue; }

  private internalValue = 0;
}
```

Você pode até criar um input _somente escrita_ definindo apenas um setter público:

```ts
export class CustomSlider {
  @Input()
  set value(newValue: number) {
    this.internalValue = newValue;
  }

  private internalValue = 0;
}
```

**Prefira usar transformações de input em vez de getters e setters** se possível.

Evite getters e setters complexos ou custosos. O Angular pode invocar o setter de um input múltiplas vezes, o que pode impactar negativamente o desempenho da aplicação se o setter executar quaisquer comportamentos custosos, como manipulação do DOM.

## Especificar inputs no decorator `@Component`

Além do decorator `@Input`, você também pode especificar os inputs de um component com a propriedade `inputs` no decorator `@Component`. Isso pode ser útil quando um component herda uma propriedade de uma classe base:

<docs-code language="ts" highlight="[4]">
// `CustomSlider` inherits the `disabled` property from `BaseSlider`.
@Component({
  ...,
  inputs: ['disabled'],
})
export class CustomSlider extends BaseSlider { }
</docs-code>

Você pode adicionalmente especificar um alias de input na lista `inputs` colocando o alias após dois pontos na string:

<docs-code language="ts" highlight="[4]">
// `CustomSlider` inherits the `disabled` property from `BaseSlider`.
@Component({
  ...,
  inputs: ['disabled: sliderDisabled'],
})
export class CustomSlider extends BaseSlider { }
</docs-code>
