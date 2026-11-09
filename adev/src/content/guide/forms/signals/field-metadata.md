<!-- ia-translate: true -->
# Metadados de campo

Metadados de campo são dados reativos que você pode anexar a um campo individual. Os validadores de restrição integrados do Angular, como `required()` e `min()`, usam esse sistema internamente. Em outras palavras, toda vez que você chama um validador, você está contribuindo para uma chave de metadados daquele campo específico.

Este guia cobre em profundidade o sistema de metadados: como os reducers combinam contribuições de múltiplas regras de schema, como escrever reducers personalizados, como a leitura se compõe com `hasMetadata()` e como os metadados gerenciados associam objetos com ciclo de vida a campos individuais.

## Você já está usando metadados {#you-have-already-been-using-metadata}

Quando você chama `required()` em um schema e lê `.required()` no campo resultante em um template, você está usando o sistema de metadados. `state.required` não é uma propriedade de caso especial. É um getter de conveniência que retorna o valor atual da chave de metadados integrada `REQUIRED`.

```angular-ts
import {Component, signal} from '@angular/core';
import {form, required, FormField} from '@angular/forms/signals';

@Component({
  selector: 'app-registration',
  imports: [FormField],
  template: `
    <form>
      <label>
        Username
        @if (registrationForm.username().required()) {
          <span class="required-marker" aria-hidden="true">*</span>
        }
        <input [formField]="registrationForm.username" />
      </label>
    </form>
  `,
})
export class Registration {
  registrationModel = signal({username: ''});

  registrationForm = form(this.registrationModel, (path) => {
    required(path.username);
  });
}
```

Chamar `required(path.username)` contribui com um valor para a chave de metadados `REQUIRED` naquele campo. Ler `registrationForm.username().required()` retorna o valor acumulado. A chave de metadados é a ponte que conecta os dois.

Vários validadores de restrição integrados seguem esse padrão:

| Validador     | Chave de metadados         | Tipo                  | Getter de `FieldState` |
| ------------- | -------------------------- | --------------------- | ---------------------- |
| `required()`  | `REQUIRED`                 | `boolean`             | `required`             |
| `min()`       | `MIN` seleciona `MIN_NUMBER` | `number \| undefined` | `min`                  |
| `max()`       | `MAX` seleciona `MAX_NUMBER` | `number \| undefined` | `max`                  |
| `minDate()`   | `MIN` seleciona `MIN_DATE`   | `Date \| undefined`   | `min`                  |
| `maxDate()`   | `MAX` seleciona `MAX_DATE`   | `Date \| undefined`   | `max`                  |
| `minLength()` | `MIN_LENGTH`               | `number \| undefined` | `minLength`            |
| `maxLength()` | `MAX_LENGTH`               | `number \| undefined` | `maxLength`            |
| `pattern()`   | `PATTERN`                  | `RegExp[]`            | `pattern`              |

Validadores que não são de restrição, como `email()` e `validate()`, não contribuem para os metadados. Eles executam a verificação e exibem um erro de validação, mas não publicam um valor reativo para os templates lerem.

## Quando usar metadados personalizados {#when-to-use-custom-metadata}

Quando você precisar de dados reativos anexados a um campo específico que os signals de estado integrados, como `valid()`, `disabled()` e `touched()`, não cobrem, use **metadados personalizados**.

Alguns exemplos incluem:

- **Configuração anexada a schemas de campo reutilizáveis.** Um símbolo de moeda em um campo de preço, para que qualquer template ou controle personalizado que renderize o campo possa exibi-lo. Ou `MIN_DATE` e `MAX_DATE` em um campo de data, lidos por um seletor de intervalo reutilizável.
- **Valores analisados compartilhados entre regras de um mesmo campo.** Um número de telefone analisado uma única vez para o formato E.164, para que um validador de formato e uma verificação de unicidade leiam a mesma forma canônica sem analisá-lo novamente.
- **Dicas de exibição montadas a partir do estado do campo.** Um nível de severidade (`'info' | 'warning' | 'error'`) que a interface mapeia para badges e ícones, ou uma mensagem de ajuda sensível ao contexto que muda conforme o que o usuário digitou e quais outros campos estão preenchidos.

Se você se pegar mantendo um `Map<fieldKey, value>` paralelo ao seu formulário para acompanhar algo por campo, isso é um sinal de que metadados são a ferramenta certa. Os metadados ficam colocados junto ao schema, permanecem reativos e participam do ciclo de vida do campo.

## Criando uma chave de metadados {#creating-a-metadata-key}

Quando você quiser criar uma chave personalizada, chame `createMetadataKey<TWrite>()`. O parâmetro de tipo descreve o valor que suas regras de schema vão contribuir.

```ts
import {createMetadataKey} from '@angular/forms/signals';

export const USERNAME_HELP = createMetadataKey<string>();
```

Cada chamada a `createMetadataKey()` cria uma nova chave única. Duas chamadas com parâmetros de tipo iguais ainda são duas chaves distintas, então defina cada chave uma vez no escopo do módulo e importe-a onde for necessária.

NOTE: Uma chave criada sem reducer usa a semântica de "override" por padrão: a última contribuição vence se várias regras definirem a chave.

## Definindo valores a partir de um schema {#setting-values-from-a-schema}

Quando você precisar registrar um valor para a chave em um campo específico, use `metadata(path, key, logic)` dentro de uma função de schema.

```angular-ts
import {Component, computed, signal} from '@angular/core';
import {form, metadata, FormField} from '@angular/forms/signals';
import {USERNAME_HELP} from './metadata-keys';

@Component({
  selector: 'app-registration',
  imports: [FormField],
  template: `
    <form>
      <label>
        Username
        <input [formField]="registrationForm.username" />
      </label>
      <p class="help">{{ usernameHelp() }}</p>
    </form>
  `,
})
export class Registration {
  registrationModel = signal({username: ''});

  registrationForm = form(this.registrationModel, (path) => {
    metadata(path.username, USERNAME_HELP, ({value}) => {
      const username = value();
      if (username.length === 0) {
        return 'Choose a unique username between 3 and 20 characters.';
      }
      if (username.length < 3) {
        return 'Keep typing, usernames are at least 3 characters.';
      }
      if (username.length > 20) {
        return 'Usernames are at most 20 characters.';
      }
      return 'Looks good.';
    });
  });

  usernameHelp = computed(() => this.registrationForm.username().metadata(USERNAME_HELP)?.() ?? '');
}
```

A função de lógica recebe o contexto do campo, que expõe `value` como um signal com o valor atual do campo, `state` como o `FieldState` do campo, e métodos como `valueOf(path)` e `stateOf(path)` para ler outros campos do mesmo formulário. Qualquer signal que a função lê torna-se uma dependência reativa: quando `value()` muda, os metadados são recalculados e qualquer template que leia a chave é atualizado.

## Lendo metadados de um campo {#reading-metadata-from-a-field}

`hasMetadata(key)` retorna `true` se alguma regra de schema registrou a chave neste campo. `state.metadata(key)` retorna `undefined` quando nenhuma regra registrou a chave, e um signal com o valor reduzido atual caso contrário.

```ts
registrationForm.username().hasMetadata(USERNAME_HELP); // true se alguma regra metadata() registrou esta chave
```

O formato desse valor interno (se ele pode ser `undefined` e qual tipo ele carrega) depende do reducer da chave. Os reducers são abordados na próxima seção.

Quando a chave pode não estar registrada, proteja a leitura com `hasMetadata()`:

```angular-html
@if (registrationForm.username().hasMetadata(USERNAME_HELP)) {
  <p class="help">{{ registrationForm.username().metadata(USERNAME_HELP)!() }}</p>
}
```

Quando você sabe que uma regra sempre registra a chave (porque o schema no mesmo arquivo faz isso), você pode pular a verificação com `hasMetadata()` e usar encadeamento opcional como uma alternativa mais compacta:

```ts
const message = registrationForm.username().metadata(USERNAME_HELP)?.();
// message: string | undefined
```

Ou, quando a regra é garantidamente registrada, remova o encadeamento opcional e use a asserção não nula:

```ts
const message = registrationForm.username().metadata(USERNAME_HELP)!();
// message: string | undefined (ainda assim, porque o valor interno pode ser undefined)
```

O exemplo de componente acima usa encadeamento opcional dentro de um `computed()`, para que o template se vincule a uma `string` simples, com um valor de fallback vazio para o quadro inicial.

Esta é toda a API para um único contribuidor. A próxima seção aborda o que acontece quando mais de uma regra de schema contribui para a mesma chave, e como combinar essas contribuições com reducers.

## Combinando contribuições com reducers {#combining-contributions-with-reducers}

A semântica de override funciona quando apenas uma regra contribui para uma chave em um determinado campo. Assim que duas regras contribuem, o primeiro valor é descartado silenciosamente:

```ts
const HELP = createMetadataKey<string>();

form(model, (path) => {
  metadata(path.username, HELP, () => 'Choose something unique across the system.');
  metadata(path.username, HELP, () => 'Usernames are 3 to 20 characters.');
});
```

Depois que ambas as regras são executadas, `state.metadata(HELP)!()` retorna apenas a segunda mensagem. Isso quase nunca é o que você quer. As contribuições frequentemente vêm de fontes diferentes: dois schemas compostos com `apply()` que cada um anexa um texto de ajuda, ou múltiplas regras de validação que cada uma contribui com uma dica.

Para combinar contribuições, passe um reducer para `createMetadataKey()`. Um reducer descreve como dobrar os valores individuais em um resultado acumulado:

```ts
import {createMetadataKey, MetadataReducer, form, metadata} from '@angular/forms/signals';
import {model} from '@angular/core';

const HELP = createMetadataKey<string, string[]>(MetadataReducer.list());

form(model, (path) => {
  metadata(path.username, HELP, () => 'Choose something unique across the system.');
  metadata(path.username, HELP, () => 'Usernames are 3 to 20 characters.');
});

// state.metadata(HELP)!() === [
//   'Choose something unique across the system.',
//   'Usernames are 3 to 20 characters.',
// ]
```

Observe os dois parâmetros de tipo em `createMetadataKey<TWrite, TAcc>`: o primeiro é o tipo que cada regra contribui, o segundo é o tipo que o reducer produz. Com `list()`, as regras contribuem com uma `string` e o campo devolve um `string[]`.

### Reducers integrados {#built-in-reducers}

O Angular oferece seis reducers integrados no namespace [`MetadataReducer`](api/forms/signals/MetadataReducer). `override()` tem duas formas com semânticas levemente diferentes, listadas separadamente na tabela:

| Reducer        | Tipo do acumulador    | O que faz                                                               | Valor inicial |
| -------------- | --------------------- | ----------------------------------------------------------------------- | ------------- |
| `list<T>()`    | `T[]`                 | Aceita contribuições `T \| undefined`; acrescenta valores não `undefined` | `[]`          |
| `or()`         | `boolean`             | `true` se qualquer contribuição for `true`                              | `false`       |
| `and()`        | `boolean`             | `true` somente se todas as contribuições forem `true`                   | `true`        |
| `min()`        | `number \| undefined` | Mantém o menor número contribuído                                       | `undefined`   |
| `max()`        | `number \| undefined` | Mantém o maior número contribuído                                       | `undefined`   |
| `override()`   | `T \| undefined`      | A última contribuição substitui a anterior (o padrão)                   | `undefined`   |
| `override(fn)` | `T`                   | Igual, mas com um valor inicial fornecido                               | `fn()`        |

`list()` é o único reducer integrado cujo tipo de item é mais amplo do que o tipo de elemento do seu acumulador. Uma regra pode contribuir com `undefined` e o reducer o descartará silenciosamente. É assim que a chave integrada `PATTERN` lida com regras `pattern()` dinâmicas cuja função de lógica retorna `undefined`: a contribuição `undefined` é ignorada em vez de ser incluída na lista final de regex.

### Como as chaves de validadores integrados usam reducers {#how-built-in-validator-keys-use-reducers}

Embora `MetadataReducer.min()` e `MetadataReducer.max()` sejam reducers, você pode se surpreender ao saber que eles não são validadores. `MetadataReducer.min()` escolhe a menor contribuição para uma chave, enquanto o validador `min()` impõe um limite inferior ao valor de um campo. Eles compartilham um nome, mas resolvem problemas diferentes.

As chaves de restrição integradas escolhem seus reducers com base no que significa "mais restritivo" para cada restrição, o que frequentemente é o oposto do que o nome da chave sugere:

| Chave        | Reducer          | Justificativa                                                                                                                              |
| ------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `REQUIRED`   | `or()`           | Se qualquer regra `required()` avaliar como `true`, o campo é obrigatório.                                                                 |
| `MIN_NUMBER` | `max()`          | Uma restrição de número mínimo é mais restritiva quando é a maior. Se uma regra exige `>= 5` e outra `>= 10`, o mínimo efetivo é `10`.    |
| `MIN_DATE`   | `max()`          | Mesma lógica de `MIN_NUMBER`: a data exigida mais tardia vence.                                                                            |
| `MAX_NUMBER` | `min()`          | Uma restrição de número máximo é mais restritiva quando é a menor. Se uma regra limita a `100` e outra a `50`, o máximo efetivo é `50`.   |
| `MAX_DATE`   | `min()`          | Mesma lógica de `MAX_NUMBER`: a data permitida mais antiga vence.                                                                          |
| `MIN_LENGTH` | `max()`          | Mesma lógica de `MIN_NUMBER`: o maior comprimento exigido vence.                                                                           |
| `MAX_LENGTH` | `min()`          | Mesma lógica de `MAX_NUMBER`: o menor comprimento permitido vence.                                                                         |
| `PATTERN`    | `list<RegExp>()` | Cada chamada a `pattern()` contribui com uma regex; o valor precisa casar com todas elas.                                                  |

`MIN` e `MAX` são chaves de seleção. Elas apontam para a chave concreta que corresponde ao tipo de valor do campo, como `MIN_NUMBER` para `min()` e `MIN_DATE` para `minDate()`. É por isso que `field().min()` e `field().max()` funcionam tanto para campos numéricos quanto para campos de data.

Essa combinação de "o mais restritivo vence" é o motivo pelo qual chamar `min(path.age, 18)` e `min(path.age, 21)` em dois schemas compostos funciona corretamente. Cada chamada registra seu próprio validador que impõe seu limite específico (assim, um valor abaixo de qualquer um dos limites falha na validação). Separadamente, cada chamada contribui para a chave `MIN_NUMBER`, e `state.min!()` informa o agregado (`21`) para que a interface e os controles personalizados possam ler o mínimo efetivo.

### Escrevendo um reducer personalizado {#writing-a-custom-reducer}

Quando você quiser escrever seu próprio reducer, implemente um objeto que corresponda à interface `MetadataReducer<TAcc, TItem>`:

```ts
interface MetadataReducer<TAcc, TItem> {
  reduce: (acc: TAcc, item: TItem) => TAcc;
  getInitial: () => TAcc;
}
```

Você pode definir um reducer personalizado quando nenhum dos integrados corresponde à semântica que você precisa. Por exemplo, uma chave `SEVERITY` que mantém o nível mais grave contribuído por qualquer regra:

```ts
import {createMetadataKey, type MetadataReducer} from '@angular/forms/signals';

type Severity = 'info' | 'warning' | 'error';

const SEVERITY_RANK: Record<Severity, number> = {info: 0, warning: 1, error: 2};

const maxSeverity: MetadataReducer<Severity | undefined, Severity> = {
  reduce(acc, item) {
    if (acc === undefined) return item;
    return SEVERITY_RANK[item] > SEVERITY_RANK[acc] ? item : acc;
  },
  getInitial: () => undefined,
};

export const SEVERITY = createMetadataKey<Severity, Severity | undefined>(maxSeverity);
```

Agora, qualquer número de regras pode contribuir com uma severidade, e o campo informa a mais alta:

```ts
form(model, (path) => {
  metadata(path.password, SEVERITY, () => 'info');
  metadata(path.password, SEVERITY, ({value}) => (value().length < 12 ? 'warning' : 'info'));
  metadata(path.password, SEVERITY, ({value}) =>
    /password|1234/i.test(value()) ? 'error' : 'info',
  );
});
```

O reducer é executado sempre que os signals de qualquer contribuição mudam, então `state.metadata(SEVERITY)!()` permanece sincronizado com o pior caso atual entre todas as regras.

TIP: Mantenha seus reducers puros: `reduce()` deve depender apenas de seus dois argumentos, e `getInitial()` deve retornar sempre o mesmo valor a cada chamada. Os reducers rodam dentro de uma computação reativa que é reexecutada sempre que os signals de qualquer contribuição mudam, então reducers impuros produzem metadados inconsistentes.

## Anexando objetos com ciclo de vida usando metadados gerenciados {#attaching-lifecycle-aware-objects-with-managed-metadata}

Metadados gerenciados armazenam em um campo um objeto com ciclo de vida, em vez de um valor reativo. Use-os para objetos por campo, como um `resource()` que busca dados externos, um `effect()` que sincroniza com um sistema externo ou um handle de serviço com escopo em um único campo.

### Criando uma chave gerenciada {#creating-a-managed-key}

Quando você quiser definir uma chave gerenciada, chame `createManagedMetadataKey<TRead, TWrite>(create)`. A função `create` que você passa produz o valor que a chave armazena.

```ts
import {Signal} from '@angular/core';
import {httpResource} from '@angular/common/http';
import {createManagedMetadataKey} from '@angular/forms/signals';

export interface UrlPreview {
  title: string;
  description?: string;
  image?: string;
}

export const URL_PREVIEW = createManagedMetadataKey((_state, url: Signal<string | undefined>) => {
  return httpResource<UrlPreview>(() => {
    const currentUrl = url();
    return currentUrl ? {url: '/api/url-preview', params: {url: currentUrl}} : undefined;
  });
});
```

A função `create` recebe o `FieldState` do campo e um `Signal<TAcc>` com os dados contribuídos pelas regras `metadata()` para esta chave, e retorna o objeto que deve viver no campo. O valor retornado é armazenado como está: diferentemente das chaves não gerenciadas, o framework não o envolve em um `computed()`.

`create` é executada uma única vez quando um campo é construído, dentro do contexto de injeção do campo. Isso permite chamar `inject()`, `resource()` e `effect()` dentro de `create`, e vincula a limpeza ao ciclo de vida do campo: quando o campo é destruído, o Angular destrói o contexto de injeção, e qualquer callback de `resource()`, `effect()` ou `DestroyRef` que você registrou ali é limpo automaticamente.

Como `create` em si não é reativa, qualquer comportamento que precise responder a mudanças de signals precisa viver dentro de um `effect()`, `resource()` ou `httpResource()` configurado durante essa chamada inicial. `URL_PREVIEW` demonstra o padrão: o `httpResource()` lê o signal de URL dentro de sua função de requisição, então a requisição é refeita sempre que o signal muda. A regra de schema (`metadata(path.url, URL_PREVIEW, ({value}) => value())`) decide quais dados alimentar, e a chave gerenciada decide o que fazer com eles.

### Usando uma chave gerenciada em um formulário {#using-a-managed-key-in-a-form}

Quando você precisar usar uma chave gerenciada em um formulário, registre uma regra `metadata()` para a chave e depois leia o objeto retornado a partir do estado do campo.

```angular-ts
import {Component, computed, signal} from '@angular/core';
import {applyEach, form, metadata, FormField} from '@angular/forms/signals';
import {URL_PREVIEW} from './url-preview';

@Component({
  selector: 'app-link-editor',
  imports: [FormField],
  template: `
    <form>
      @for (link of linksForm.links; track link) {
        <fieldset>
          <label>
            URL
            <input [formField]="link.url" />
          </label>
          <!-- Lê a chave URL_PREVIEW do campo url deste link; o resultado é o resource que a função create produziu -->
          @let preview = link.url().metadata(URL_PREVIEW);
          @if (preview?.isLoading()) {
            <p>Loading preview...</p>
          } @else if (preview?.hasValue() && preview.value(); as data) {
            <article class="preview">
              <h3>{{ data.title }}</h3>
              @if (data.description) {
                <p>{{ data.description }}</p>
              }
            </article>
          } @else if (preview?.error()) {
            <p class="error">Could not load preview.</p>
          }
        </fieldset>
      }
      <button type="button" (click)="addLink()">Add link</button>
    </form>
  `,
})
export class LinkEditor {
  URL_PREVIEW = URL_PREVIEW;

  linksModel = signal({links: [{url: ''}]});

  linksForm = form(this.linksModel, (path) => {
    // Registra a chave URL_PREVIEW no campo url de cada link.
    // applyEach executa o schema por item, então create() é executada uma vez por link
    // e cada link recebe seu próprio resource.
    applyEach(path.links, (itemPath) => {
      metadata(itemPath.url, URL_PREVIEW, ({value}) => value());
    });
  });

  addLink() {
    this.linksForm.links().value.update((links) => [...links, {url: ''}]);
  }
}
```

Cada item do array recebe seu próprio resource `URL_PREVIEW` porque `applyEach` registra as regras de schema para cada item de forma independente. Quando o usuário adiciona um link, `create` é executada para o campo do novo item. Quando um link é removido (não mostrado aqui, mas um padrão comum), o framework desmonta o injector daquele campo junto com o resource.

## Próximos passos {#next-steps}

Lembre-se de que os metadados existem para que dados reativos viajem com o campo através da composição de schemas, se acumulem entre regras e sejam desmontados junto com o ciclo de vida do campo. Eles utilizam o mesmo sistema que os validadores integrados do Angular usam, e podem ser adaptados aos seus próprios casos de uso.

Para a documentação detalhada da API, veja:

- [`createMetadataKey()`](api/forms/signals/createMetadataKey) - Define uma chave de metadados com reducer opcional
- [`createManagedMetadataKey()`](api/forms/signals/createManagedMetadataKey) - Define uma chave de metadados com ciclo de vida
- [`metadata()`](api/forms/signals/metadata) - Contribui com um valor para uma chave de metadados em um schema
- [`MetadataReducer`](api/forms/signals/MetadataReducer) - Reducers integrados para combinar contribuições

Para guias relacionados adicionais sobre Signal Forms, confira:

<docs-pill-row>
  <docs-pill href="guide/forms/signals/form-logic" title="Adicionando lógica ao formulário" />
  <docs-pill href="guide/forms/signals/validation" title="Validação" />
  <docs-pill href="guide/forms/signals/field-state-management" title="Gerenciamento de estado dos campos" />
  <docs-pill href="guide/forms/signals/async-operations" title="Operações assíncronas" />
</docs-pill-row>
