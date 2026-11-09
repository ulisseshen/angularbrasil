<!-- ia-translate: true -->
# Aceitando dados com propriedades de input {#accepting-data-with-input-properties}

TIP: Este guia pressupõe que você já leu o [Guia de Fundamentos](essentials). Leia-o primeiro se você é novo no Angular. Se você está familiarizado com outros frameworks web, propriedades de input são semelhantes às _props_.

Quando você usa um component, normalmente quer passar alguns dados para ele. Um component especifica os dados que aceita declarando **inputs**:

```ts {highlight:[6]}
import {Component, input} from '@angular/core';

@Component(/* ... */)
export class CustomSlider {
  // Declara um input chamado 'value' com valor padrão zero.
  value = input(0);
}
```

Isso permite vincular a propriedade em um template:

```angular-html
<custom-slider [value]="50" />
```

Se um input tem um valor padrão, o TypeScript infere o tipo a partir desse valor:

```ts
@Component(/* ... */)
export class CustomSlider {
  // TypeScript infere que este input é um number, retornando InputSignal<number>.
  value = input(0);
}
```

Você pode declarar explicitamente um tipo para o input especificando um parâmetro genérico na função.

Se um input sem valor padrão não for definido, seu valor é `undefined`:

```ts
@Component(/* ... */)
export class CustomSlider {
  // Produz um InputSignal<number | undefined> porque `value` pode não ser definido.
  value = input<number>();
}
```

**O Angular registra os inputs estaticamente em tempo de compilação**. Inputs não podem ser adicionados ou removidos em tempo de execução.

A função `input` tem significado especial para o compilador do Angular. **Você pode chamar `input` exclusivamente em inicializadores de propriedade de components e directives.**

Ao estender uma classe de component, **os inputs são herdados pela classe filha.**

**Nomes de input diferenciam maiúsculas de minúsculas.**

## Lendo inputs {#reading-inputs}

A função `input` retorna um `InputSignal`. Você pode ler o valor chamando o signal:

```ts {highlight:[9]}
import {Component, input, computed} from '@angular/core';

@Component(/* ... */)
export class CustomSlider {
  // Declara um input chamado 'value' com valor padrão zero.
  value = input(0);

  // Cria uma expressão computed que lê o input value
  label = computed(() => `O valor do slider é ${this.value()}`);
}
```

Signals criados pela função `input` são somente leitura.

## Inputs obrigatórios {#required-inputs}

Você pode declarar que um input é `required` (obrigatório) chamando `input.required` em vez de `input`:

```ts {highlight:[4]}
@Component(/* ... */)
export class CustomSlider {
  // Declara um input obrigatório chamado value. Retorna um `InputSignal<number>`.
  value = input.required<number>();
}
```

O Angular exige que inputs obrigatórios _devem_ ser definidos quando o component é usado em um template. Se você tentar usar um component sem especificar todos os seus inputs obrigatórios, o Angular reporta um erro em tempo de build.

Inputs obrigatórios não incluem automaticamente `undefined` no parâmetro genérico do `InputSignal` retornado.

## Configurando inputs {#configuring-inputs}

A função `input` aceita um objeto de configuração como segundo parâmetro, que permite alterar a forma como o input funciona.

### Transformações de input {#input-transforms}

Você pode especificar uma função `transform` para alterar o valor de um input quando ele é definido pelo Angular.

```ts {highlight:[6]}
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
```

```angular-html
<custom-slider [label]="systemVolume" />
```

No exemplo acima, sempre que o valor de `systemVolume` muda, o Angular executa `trimString` e define `label` com o resultado.

O caso de uso mais comum para transformações de input é aceitar uma gama mais ampla de tipos de valor em templates, frequentemente incluindo `null` e `undefined`.

**Funções de transformação de input devem ser estaticamente analisáveis em tempo de build.** Você não pode definir funções de transformação condicionalmente ou como resultado da avaliação de uma expressão.

**Funções de transformação de input devem sempre ser [funções puras](https://en.wikipedia.org/wiki/Pure_function).** Depender de estado fora da função de transformação pode levar a comportamentos imprevisíveis.

#### Verificação de tipo {#type-checking}

Quando você especifica uma transformação de input, o tipo do parâmetro da função de transformação determina os tipos de valores que podem ser definidos no input em um template.

```ts
@Component(/* ... */)
export class CustomSlider {
  widthPx = input('', {transform: appendPx});
}

function appendPx(value: number): string {
  return `${value}px`;
}
```

No exemplo acima, o input `widthPx` aceita um `number`, enquanto a propriedade `InputSignal` retorna uma `string`.

#### Transformações integradas {#built-in-transformations}

O Angular inclui duas funções de transformação integradas para os dois cenários mais comuns: conversão de valores para booleano e para números.

```ts
import {Component, input, booleanAttribute, numberAttribute} from '@angular/core';

@Component(/* ... */)
export class CustomSlider {
  disabled = input(false, {transform: booleanAttribute});
  value = input(0, {transform: numberAttribute});
}
```

`booleanAttribute` imita o comportamento dos [atributos booleanos](https://developer.mozilla.org/docs/Glossary/Boolean/HTML) padrão do HTML, em que a _presença_ do atributo indica um valor "verdadeiro". No entanto, o `booleanAttribute` do Angular trata a string literal `"false"` como o booleano `false`.

`numberAttribute` tenta converter o valor fornecido para um número, produzindo `NaN` se a conversão falhar.

### Aliases de input {#input-aliases}

Você pode especificar a opção `alias` para alterar o nome de um input em templates.

```ts {highlight:[3]}
@Component(/* ... */)
export class CustomSlider {
  value = input(0, {alias: 'sliderValue'});
}
```

```angular-html
<custom-slider [sliderValue]="50" />
```

Esse alias não afeta o uso da propriedade em código TypeScript.

Embora você deva geralmente evitar criar aliases para inputs de components, esse recurso pode ser útil para renomear propriedades preservando um alias para o nome original ou para evitar colisões com nomes de propriedades de elementos DOM nativos.

## Model inputs

**Model inputs** são um tipo especial de input que permite a um component propagar novos valores de volta ao seu component pai.

Ao criar um component, você pode definir um model input de forma semelhante à de um input padrão.

Ambos os tipos de input permitem que alguém vincule um valor à propriedade. No entanto, **model inputs permitem que o autor do component escreva valores na propriedade**. Se a propriedade estiver vinculada com um binding bidirecional, o novo valor é propagado para esse binding.

```ts
@Component(/* ... */)
export class CustomSlider {
  // Define um model input chamado "value".
  value = model(0);

  increment() {
    // Atualiza o model input com um novo valor, propagando o valor para quaisquer bindings.
    this.value.update((oldValue) => oldValue + 10);
  }
}

@Component({
  /* ... */
  // Usar a sintaxe de binding bidirecional significa que quaisquer mudanças no
  // value do slider são automaticamente propagadas de volta para o signal `volume`.
  // Observe que este binding usa a *instância* do signal, não o valor do signal.
  template: `<custom-slider [(value)]="volume" />`,
})
export class MediaControls {
  // Cria um signal gravável para o estado local `volume`.
  volume = signal(0);
}
```

No exemplo acima, o `CustomSlider` pode escrever valores em seu model input `value`, que então propaga esses valores de volta para o signal `volume` em `MediaControls`. Esse binding mantém os valores de `value` e `volume` sincronizados. Observe que o binding passa a instância do signal `volume`, não o _valor_ do signal.

Em outros aspectos, model inputs funcionam de forma semelhante aos inputs padrão. Você pode ler o valor chamando a função do signal, inclusive em [contextos reativos](guide/signals#reactive-contexts) como `computed` e `effect`.

Consulte [Binding bidirecional](guide/templates/two-way-binding) para mais detalhes sobre binding bidirecional em templates.

### Binding bidirecional com propriedades simples {#two-way-binding-with-plain-properties}

Você pode vincular uma propriedade JavaScript simples a um model input.

```angular-ts
@Component({
  /* ... */
  // `value` é um model input.
  // A sintaxe de parênteses dentro de colchetes (conhecida como "banana-in-a-box") cria um binding bidirecional
  template: '<custom-slider [(value)]="volume" />',
})
export class MediaControls {
  protected volume = 0;
}
```

No exemplo acima, o `CustomSlider` pode escrever valores em seu model input `value`, que então propaga esses valores de volta para a propriedade `volume` em `MediaControls`. Esse binding mantém os valores de `value` e `volume` sincronizados.

### Eventos `change` implícitos {#implicit-change-events}

Quando você declara um model input em um component ou directive, o Angular cria automaticamente um [output](guide/components/outputs) correspondente para esse model. O nome do output é o nome do model input seguido do sufixo "Change".

```ts
@Directive(/* ... */)
export class CustomCheckbox {
  // Isso cria automaticamente um output chamado "checkedChange".
  // Pode ser assinado usando `(checkedChange)="handler()"` no template.
  checked = model(false);
}
```

O Angular emite esse evento de mudança sempre que você escreve um novo valor no model input chamando seus métodos `set` ou `update`.

Consulte [Eventos personalizados com outputs](guide/components/outputs) para mais detalhes sobre outputs.

### Personalizando model inputs {#customizing-model-inputs}

Você pode marcar um model input como [obrigatório](#required-inputs) ou fornecer um [alias](#input-aliases) da mesma forma que um input padrão.

Model inputs não suportam transformações de input.

### Quando usar model inputs {#when-to-use-model-inputs}

Use model inputs quando quiser que um component suporte binding bidirecional. Isso normalmente é apropriado quando um component existe para modificar um valor com base na interação do usuário. Mais comumente, controles de formulário personalizados, como um seletor de data ou um combobox, devem usar model inputs para o seu valor principal.

## Escolhendo nomes de input {#choosing-input-names}

Evite escolher nomes de input que colidam com propriedades de elementos DOM, como as de HTMLElement. Colisões de nomes geram confusão sobre se a propriedade vinculada pertence ao component ou ao elemento DOM.

Evite adicionar prefixos aos inputs de components, como você faria com seletores de components. Como um determinado elemento pode hospedar apenas um component, quaisquer propriedades personalizadas podem ser consideradas como pertencentes ao component.

## Declarando inputs com o decorator `@Input` {#declaring-inputs-with-the-input-decorator}

TIP: Embora a equipe do Angular recomende usar a função `input` baseada em signals para novos projetos, a API original `@Input`, baseada em decorator, continua totalmente suportada.

Você pode, alternativamente, declarar inputs de component adicionando o decorator `@Input` a uma propriedade:

```ts {highlight:[3]}
@Component(/* ... */)
export class CustomSlider {
  @Input() value = 0;
}
```

O binding a um input é o mesmo em inputs baseados em signals e em inputs baseados em decorator:

```angular-html
<custom-slider [value]="50" />
```

### Personalizando inputs baseados em decorator {#customizing-decorator-based-inputs}

O decorator `@Input` aceita um objeto de configuração que permite alterar a forma como o input funciona.

#### Inputs obrigatórios {#required-inputs-decorator}

Você pode especificar a opção `required` para garantir que um determinado input sempre tenha um valor.

```ts {highlight:[3]}
@Component(/* ... */)
export class CustomSlider {
  @Input({required: true}) value = 0;
}
```

Se você tentar usar um component sem especificar todos os seus inputs obrigatórios, o Angular reporta um erro em tempo de build.

#### Transformações de input {#input-transforms-decorator}

Você pode especificar uma função `transform` para alterar o valor de um input quando ele é definido pelo Angular. Essa função de transformação funciona de forma idêntica às funções de transformação para inputs baseados em signals descritas acima.

```ts {highlight:[6]}
@Component({
  selector: 'custom-slider',
  ...
})
export class CustomSlider {
  @Input({transform: trimString}) label = '';
}

function trimString(value: string | undefined) {
  return value?.trim() ?? '';
}
```

#### Aliases de input {#input-aliases-decorator}

Você pode especificar a opção `alias` para alterar o nome de um input em templates.

```ts {highlight:[3]}
@Component(/* ... */)
export class CustomSlider {
  @Input({alias: 'sliderValue'}) value = 0;
}
```

```angular-html
<custom-slider [sliderValue]="50" />
```

O decorator `@Input` também aceita o alias como seu primeiro parâmetro, no lugar do objeto de configuração.

Aliases de input funcionam da mesma forma que para inputs baseados em signals descritos acima.

### Inputs com getters e setters {#inputs-with-getters-and-setters}

Ao usar inputs baseados em decorator, uma propriedade implementada com getter e setter pode ser um input:

```ts
export class CustomSlider {
  @Input()
  get value(): number {
    return this.internalValue;
  }

  set value(newValue: number) {
    this.internalValue = newValue;
  }

  private internalValue = 0;
}
```

Você pode até criar um input _somente de escrita_ definindo apenas um setter público:

```ts
export class CustomSlider {
  @Input()
  set value(newValue: number) {
    this.internalValue = newValue;
  }

  private internalValue = 0;
}
```

**Prefira usar transformações de input em vez de getters e setters** sempre que possível.

Evite getters e setters complexos ou custosos. O Angular pode invocar o setter de um input várias vezes, o que pode impactar negativamente o desempenho da aplicação se o setter executar comportamentos custosos, como manipulação do DOM.

## Especificar inputs no decorator `@Component` {#specify-inputs-in-the-component-decorator}

Além do decorator `@Input`, você também pode especificar os inputs de um component com a propriedade `inputs` no decorator `@Component`. Isso pode ser útil quando um component herda uma propriedade de uma classe base:

```ts {highlight:[4]}
// `CustomSlider` herda a propriedade `disabled` de `BaseSlider`.
@Component({
  ...,
  inputs: ['disabled'],
})
export class CustomSlider extends BaseSlider { }
```

Você pode, adicionalmente, especificar um alias de input na lista `inputs` colocando o alias após dois-pontos na string:

```ts {highlight:[4]}
// `CustomSlider` herda a propriedade `disabled` de `BaseSlider`.
@Component({
  ...,
  inputs: ['disabled: sliderDisabled'],
})
export class CustomSlider extends BaseSlider { }
```
