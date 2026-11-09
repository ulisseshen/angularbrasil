<!-- ia-translate: true -->
# Formulários dinâmicos com JSON {#dynamic-forms-with-json}

Alguns formulários não conseguem definir sua estrutura em tempo de compilação. Formulários dirigidos pelo servidor, painéis administrativos, aplicações multi-tenant e conteúdo gerenciado por CMS precisam renderizar campos a partir de uma configuração entregue em tempo de execução, normalmente como JSON vindo de um backend, de uma ferramenta administrativa ou de configurações por tenant.

Este guia mostra como construir formulários cujo modelo, schema, validação e renderização são todos derivados de uma única configuração em tempo de execução.

## Quando usar formulários orientados por JSON {#when-to-use-json-driven-forms}

Este padrão é uma boa escolha quando:

- Um backend define quais campos aparecem com base no papel do usuário, em feature flags ou em regras de negócio
- Pessoas não desenvolvedoras configuram a estrutura do formulário por meio de um painel administrativo ou de um CMS
- Cada tenant em uma aplicação multi-tenant tem sua própria estrutura de formulário, armazenada como configuração
- Os formulários precisam evoluir sem exigir um novo deploy do frontend

Use um formulário estático (com os campos definidos diretamente no seu componente) quando a estrutura for conhecida em tempo de build. Formulários estáticos têm checagem completa de tipos do TypeScript em cada campo, além de testes e suporte de ferramentas mais simples.

## Definindo uma configuração de campo tipada {#defining-a-typed-field-config}

Quando você quiser renderizar campos a partir de uma configuração em tempo de execução, comece com um tipo TypeScript que capture o formato de cada campo. Uma union discriminada pela propriedade `kind` permite que cada variante declare suas próprias opções de validação:

```ts
type FieldConfig =
  | {kind: 'text'; name: string; label: string; required?: boolean}
  | {kind: 'number'; name: string; label: string; required?: boolean; min?: number; max?: number};
```

Toda variante tem um `name`, um `label` e uma flag opcional `required`. Campos numéricos aceitam, além disso, os limites `min` e `max`. Para adicionar novas variantes, basta incluir novos ramos de `kind`.

Uma configuração concreta pode ser assim:

```ts
const profileConfig: FieldConfig[] = [
  {kind: 'text', name: 'fullName', label: 'Full Name', required: true},
  {kind: 'number', name: 'age', label: 'Age', required: true, min: 18, max: 120},
];
```

Na prática, esse `FieldConfig[]` normalmente chega do seu backend, de um painel administrativo ou de um CMS. Para simplificar, os exemplos abaixo usam um literal dentro do componente.

## Construindo o modelo a partir da configuração {#building-the-model-from-config}

O modelo do formulário precisa de uma entrada para cada campo, com um valor padrão compatível com o `kind` do campo. Um pequeno helper faz isso:

```ts
function buildModel(configs: FieldConfig[]): Record<string, string | number | null> {
  const initial: Record<string, string | number | null> = {};
  for (const config of configs) {
    initial[config.name] = config.kind === 'number' ? null : '';
  }
  return initial;
}
```

O modelo usa `Record<string, string | number | null>` porque as chaves não são conhecidas antecipadamente.

Além disso, campos numéricos são inicializados com `null` em vez de `0`, para que um campo vazio seja lido como vazio. Com `0`, [`required()`](api/forms/signals/required) trataria o campo como já preenchido, e qualquer restrição [`min()`](api/forms/signals/min) acima de zero marcaria o campo como inválido antes que o usuário digitasse qualquer coisa.

## Construindo o schema a partir da configuração {#building-the-schema-from-config}

O schema também é derivado da configuração. Você pode percorrer cada entrada e aplicar os validadores que correspondem ao seu `kind`:

```ts
import {required, min, max, SchemaFn, SchemaPath} from '@angular/forms/signals';

function buildSchema(configs: FieldConfig[]): SchemaFn<Record<string, string | number | null>> {
  return (path) => {
    for (const config of configs) {
      const fieldPath = path[config.name];

      if (config.required) {
        required(fieldPath);
      }

      if (config.kind === 'number') {
        const numberPath = fieldPath as unknown as SchemaPath<number | null>;
        if (config.min !== undefined) min(numberPath, config.min);
        if (config.max !== undefined) max(numberPath, config.max);
      }
    }
  };
}
```

A union discriminada restringe o tipo de `config` dentro de cada ramo, então `config.min` e `config.max` são tipados corretamente quando `config.kind === 'number'`.

## Expressando regras condicionais na configuração {#expressing-conditional-rules-in-config}

Algumas regras de validação só fazem sentido sob certas condições. Por exemplo, códigos de estado dos EUA só precisam ser validados quando o país é os EUA. Expresse essas dependências na configuração adicionando um discriminador `when` que indica outro campo e o valor que ele deve ter:

```ts
type WhenCondition = {field: string; equals: string | number};

type FieldConfig =
  | {kind: 'text'; name: string; label: string; required?: boolean; when?: WhenCondition}
  | {
      kind: 'number';
      name: string;
      label: string;
      required?: boolean;
      min?: number;
      max?: number;
      when?: WhenCondition;
    };
```

Atualize `buildSchema()` para traduzir `when` em uma chamada a [`applyWhen()`](api/forms/signals/applyWhen). A lógica de aplicação de regras compartilhada passa para um pequeno closure, de modo que os ramos condicional e incondicional chamem a mesma função:

```ts
import {applyWhen, required, min, max, SchemaFn, SchemaPath} from '@angular/forms/signals';

function buildSchema(configs: FieldConfig[]): SchemaFn<Record<string, string | number | null>> {
  return (rootPath) => {
    for (const config of configs) {
      const applyRules = (path: typeof rootPath) => {
        const fieldPath = path[config.name];
        if (config.required) required(fieldPath);
        if (config.kind === 'number') {
          const numberPath = fieldPath as unknown as SchemaPath<number | null>;
          if (config.min !== undefined) min(numberPath, config.min);
          if (config.max !== undefined) max(numberPath, config.max);
        }
      };

      if (config.when) {
        const {field, equals} = config.when;
        applyWhen(rootPath, ({valueOf}) => valueOf(rootPath[field]) === equals, applyRules);
      } else {
        applyRules(rootPath);
      }
    }
  };
}
```

Quando a condição de `applyWhen()` é verdadeira, as regras internas são ativadas. Quando a condição se torna falsa, as regras são desativadas e o estado de validação do campo é limpo. Como a função de condição lê por meio de `valueOf(rootPath[field])`, o formulário reavalia essa condição sempre que o campo referenciado muda.

Uma configuração que usa `when` fica assim:

```ts
const addressConfig: FieldConfig[] = [
  {kind: 'text', name: 'country', label: 'Country', required: true},
  {
    kind: 'text',
    name: 'stateCode',
    label: 'State',
    required: true,
    when: {field: 'country', equals: 'US'},
  },
];
```

O campo `stateCode` só exige um valor quando `country` é `'US'`. Usuários que informarem qualquer outro país podem deixar `stateCode` em branco sem bloquear o envio.

Para condições mais complexas (múltiplos campos, intervalos ou verificações que não sejam de igualdade), estenda `WhenCondition` com discriminadores adicionais (como `in: string[]` ou `notEquals: string | number`) e traduza cada variante dentro de `buildSchema()`. O princípio é o mesmo: a configuração carrega os dados, e `buildSchema()` os traduz em chamadas a `applyWhen()`.

Para controlar a visibilidade em vez da validação, siga o mesmo padrão usando [`hidden()`](api/forms/signals/hidden) no caminho do campo. Veja [Configurando o estado `hidden()` nos campos](guide/forms/signals/form-logic#configuring-hidden-state-on-fields) para mais detalhes.

## Expressando campos repetidos na configuração {#expressing-repeating-fields-in-config}

Algumas configurações precisam de campos que crescem e diminuem em tempo de execução, como uma lista de números de telefone, tags ou itens de uma fatura. Adicione um `kind` do tipo `array` à configuração e traduza-o para [`applyEach()`](api/forms/signals/applyEach), para que as regras por item sejam aplicadas de forma uniforme conforme os itens entram e saem.

Estenda `FieldConfig` com uma variante `array`. Este exemplo usa arrays de strings; a mesma abordagem se aplica a arrays de objetos, substituindo o formato do item por um registro:

```ts
type FieldConfig =
  | {kind: 'text'; name: string; label: string; required?: boolean; when?: WhenCondition}
  | {
      kind: 'number';
      name: string;
      label: string;
      required?: boolean;
      min?: number;
      max?: number;
      when?: WhenCondition;
    }
  | {kind: 'array'; name: string; label: string; itemRequired?: boolean; when?: WhenCondition};
```

Atualize `buildModel()` para inicializar campos do tipo array com um array vazio. O modelo passa a incluir `string[]`:

```ts
function buildModel(configs: FieldConfig[]): Record<string, string | number | null | string[]> {
  const initial: Record<string, string | number | null | string[]> = {};
  for (const config of configs) {
    if (config.kind === 'number') initial[config.name] = null;
    else if (config.kind === 'array') initial[config.name] = [];
    else initial[config.name] = '';
  }
  return initial;
}
```

Atualize `buildSchema()` para aplicar regras por item com `applyEach()`. O caminho vindo de um modelo `Record<string, string | number | null | string[]>` é amplo demais para que `applyEach()` (e também `min()` / `max()`) sejam verificados pelo tipo diretamente, então faça cast de `fieldPath` para o formato apropriado dentro de cada ramo de `kind`:

```ts
import {
  applyEach,
  applyWhen,
  required,
  min,
  max,
  SchemaFn,
  SchemaPath,
} from '@angular/forms/signals';

function buildSchema(
  configs: FieldConfig[],
): SchemaFn<Record<string, string | number | null | string[]>> {
  return (rootPath) => {
    for (const config of configs) {
      const applyRules = (path: typeof rootPath) => {
        const fieldPath = path[config.name];

        if (config.kind === 'array') {
          const arrayPath = fieldPath as unknown as SchemaPath<string[]>;
          if (config.itemRequired) {
            applyEach(arrayPath, (item) => required(item));
          }
          return;
        }

        if (config.required) required(fieldPath);

        if (config.kind === 'number') {
          const numberPath = fieldPath as unknown as SchemaPath<number | null>;
          if (config.min !== undefined) min(numberPath, config.min);
          if (config.max !== undefined) max(numberPath, config.max);
        }
      };

      if (config.when) {
        const {field, equals} = config.when;
        applyWhen(rootPath, ({valueOf}) => valueOf(rootPath[field]) === equals, applyRules);
      } else {
        applyRules(rootPath);
      }
    }
  };
}
```

Os casts dentro de cada ramo são escolhas deliberadas: você troca a garantia estrutural do compilador por um invariante de tempo de execução que a verificação de `kind` ao redor assegura. Cada cast fica restrito a um bloco de `kind`, então a suposição permanece local e fácil de auditar.

Uma configuração que usa o `kind` do tipo `array` fica assim:

```ts
const contactConfig: FieldConfig[] = [
  {kind: 'text', name: 'fullName', label: 'Full name', required: true},
  {kind: 'array', name: 'phoneNumbers', label: 'Phone numbers', itemRequired: true},
];
```

Para renderizar um campo do tipo array, itere-o com `@for` e deixe os usuários adicionarem ou removerem itens atualizando o signal do modelo. Adicione um acessor tipado que retorne um [`FieldTree`](api/forms/signals/FieldTree), para que a iteração enxergue a estrutura do array, e defina métodos para aumentar e diminuir o modelo:

```ts
import {FieldTree} from '@angular/forms/signals';

// dentro da classe do componente
asArrayField(name: string): FieldTree<string[]> {
  return this.dynamicForm[name] as unknown as FieldTree<string[]>;
}

addItem(name: string) {
  this.model.update(current => ({
    ...current,
    [name]: [...(current[name] as string[]), ''],
  }));
}

removeItem(name: string, index: number) {
  this.model.update(current => ({
    ...current,
    [name]: (current[name] as string[]).filter((_, i) => i !== index),
  }));
}
```

`FieldTree<string[]>` é iterável, então `@for` consegue percorrê-lo; cada item é um `FieldTree<string>` que satisfaz diretamente `[formField]`. Campos folha podem usar acessores `Field<T>`, já que `Field<T>` é a assinatura chamável sem iteração.

No template, renderize um caso de array assim:

```angular-html
@case ('array') {
  <fieldset>
    <legend>{{ config.label }}</legend>
    @for (item of asArrayField(config.name); track item) {
      <input type="text" [formField]="item" />
      <button type="button" (click)="removeItem(config.name, $index)">Remove</button>
    }
    <button type="button" (click)="addItem(config.name)">Add</button>
  </fieldset>
}
```

O método `addItem()` estende o modelo; o formulário rederiva os campos do array automaticamente. Novos itens começam com estado de validação novo. O método `removeItem()` filtra o modelo. Como arrays de valores primitivos são [rastreados pela posição](#tracking-item-identity), o estado do campo fica ligado ao índice e não ao valor: quando um item é removido, os valores seguintes deslocam-se para posições anteriores e herdam o estado de campo existente, enquanto o último campo é descartado.

### Rastreando a identidade dos itens {#tracking-item-identity}

Signal Forms rastreia cada item de um array de objetos pela sua identidade. Quando você armazena uma referência a um campo em uma posição específica, essa referência acompanha o dado subjacente, não a posição. Ler o estado pela referência guardada retorna o dado mesmo que ele tenha se movido:

```ts
const contactModel = signal([
  {name: 'Alice', phone: '555-0001'},
  {name: 'Bob', phone: '555-0002'},
]);

const contactForm = form(contactModel);

// Guarda uma referência ao campo que está atualmente no índice 0 (Alice).
const aliceField = contactForm[0];

// Troca os itens do array para que Bob fique no índice 0 e Alice no índice 1.
contactModel.update(([alice, bob]) => [bob, alice]);

// A referência guardada ainda aponta para o campo de Alice, mesmo após a troca.
console.log(aliceField().value().phone); // '555-0001' (número da Alice)
console.log(contactForm[0]().value().phone); // '555-0002' (Bob, agora no índice 0)
```

Esse rastreamento de identidade evita bugs ao ordenar, reordenar ou filtrar, desde que o item referenciado continue no array. Referências de campo armazenadas continuam válidas mesmo quando a ordem do array muda; remover o próprio item referenciado deixa a referência guardada órfã.

Para arrays de valores primitivos (o exemplo `phoneNumbers` acima), Signal Forms rastreia os itens pela posição: o índice 0 sempre se refere ao valor atualmente na posição 0.

A identidade aqui é pela referência de objeto do JavaScript, não por um id lógico como uma chave de banco de dados. Se você substituir o array por objetos desserializados novamente (por exemplo, após um recarregamento do servidor), o estado do campo não acompanha o item lógico mesmo que o `id` de cada item permaneça igual. A garantia cobre operações em memória, como ordenar, reordenar e filtrar, mas não a atualização de dados.

## Validando a configuração {#validating-the-config}

Configurações vindas de fontes externas precisam ser validadas antes de o formulário ser construído. Diversos modos de falha podem se esconder em JSON não confiável:

- Valores de `name` duplicados sobrescrevem entradas anteriores do modelo e quebram a expressão `track config.name` no template.
- Uma cláusula `when` que aponta para um campo inexistente falha em tempo de execução quando a condição é avaliada pela primeira vez.
- Uma cláusula `when` que compara com um campo do tipo `array` não tem semântica de igualdade definida.
- Um valor de `when.equals` cujo tipo não corresponde ao `kind` do campo referenciado nunca bate, escondendo o comportamento condicional como se a regra nunca estivesse ativa.

Capture os quatro no limite:

```ts
function validateConfigs(configs: FieldConfig[]): FieldConfig[] {
  const knownNames = new Set<string>();

  for (const config of configs) {
    if (knownNames.has(config.name)) {
      throw new Error(`Duplicate field name in config: "${config.name}"`);
    }
    knownNames.add(config.name);
  }

  for (const config of configs) {
    if (!config.when) continue;
    if (!knownNames.has(config.when.field)) {
      throw new Error(
        `Field "${config.name}" references unknown field "${config.when.field}" in its 'when' condition.`,
      );
    }
    const referenced = configs.find((c) => c.name === config.when!.field)!;
    if (referenced.kind === 'array') {
      throw new Error(
        `Field "${config.name}" cannot use 'when' to compare against array field "${config.when.field}".`,
      );
    }
    const expected = referenced.kind === 'text' ? 'string' : 'number';
    if (typeof config.when.equals !== expected) {
      throw new Error(
        `Field "${config.name}" compares ${referenced.kind} field "${config.when.field}" against a ${typeof config.when.equals} value; expected a ${expected}.`,
      );
    }
  }

  return configs;
}
```

A primeira passagem garante a unicidade; a segunda percorre cada cláusula `when` para confirmar que o campo referenciado existe, não é um array e está sendo comparado com um valor do tipo correto. A função retorna as configurações sem alterações em caso de sucesso, então ela se compõe bem com o inicializador do campo que guarda as configurações no componente. As falhas aparecem na fronteira entre sua aplicação e a fonte upstream, em vez de se manifestarem depois como um comportamento estranho do formulário.

## Renderizando o formulário dinamicamente {#rendering-the-form-dynamically}

No componente, use `@for` para iterar as configurações e `@switch` sobre `kind` para escolher o controle de entrada correto:

```angular-ts
import {Component, signal} from '@angular/core';
import {Field, FieldTree, form, FormField, FormRoot} from '@angular/forms/signals';

@Component({
  selector: 'app-dynamic-form',
  imports: [FormField, FormRoot],
  template: `
    <form [formRoot]="dynamicForm">
      @for (config of configs; track config.name) {
        @switch (config.kind) {
          @case ('text') {
            <label>
              {{ config.label }}
              <input type="text" [formField]="asTextField(config.name)" />
            </label>
          }
          @case ('number') {
            <label>
              {{ config.label }}
              <input type="number" [formField]="asNumberField(config.name)" />
            </label>
          }
          @case ('array') {
            <fieldset>
              <legend>{{ config.label }}</legend>
              @for (item of asArrayField(config.name); track item; let i = $index) {
                <input type="text" [formField]="item" />
                <button type="button" (click)="removeItem(config.name, i)">Remove</button>
              }
              <button type="button" (click)="addItem(config.name)">Add</button>
            </fieldset>
          }
        }
      }
    </form>
  `,
})
export class DynamicForm {
  configs: FieldConfig[] = validateConfigs([
    {kind: 'text', name: 'fullName', label: 'Full Name', required: true},
    {kind: 'number', name: 'age', label: 'Age', required: true, min: 18, max: 120},
    {kind: 'array', name: 'phoneNumbers', label: 'Phone numbers', itemRequired: true},
  ]);

  model = signal(buildModel(this.configs));

  dynamicForm = form(this.model, buildSchema(this.configs));

  asTextField(name: string): Field<string> {
    // <input type="text"> requer Field<string>.
    return this.dynamicForm[name] as unknown as Field<string>;
  }

  asNumberField(name: string): Field<number | null> {
    // <input type="number"> requer Field<number | null>.
    return this.dynamicForm[name] as unknown as Field<number | null>;
  }

  asArrayField(name: string): FieldTree<string[]> {
    // FieldTree (e não Field) para que @for possa iterar o array.
    return this.dynamicForm[name] as unknown as FieldTree<string[]>;
  }

  addItem(name: string) {
    this.model.update((current) => ({
      ...current,
      [name]: [...(current[name] as string[]), ''],
    }));
  }

  removeItem(name: string, index: number) {
    this.model.update((current) => ({
      ...current,
      [name]: (current[name] as string[]).filter((_, i) => i !== index),
    }));
  }
}
```

A verificação de tipos do template trata `dynamicForm[name]` como uma expressão independente, então o estreitamento do `@switch` sobre `config.kind` não chega até o acesso indexado. Os acessores reafirmam esse estreitamento como um cast no ponto de binding, e o ramo `kind` correspondente garante que o tipo estreitado está correto em tempo de execução.

Como o modelo e o schema são ambos derivados do mesmo `FieldConfig[]` na construção do componente, eles não podem divergir para uma dada configuração. O exemplo acima assume que a configuração está disponível de forma síncrona quando o componente é criado.

## Próximos passos {#next-steps}

Formulários orientados por JSON mantêm o modelo e o schema alinhados ao derivar ambos do mesmo `FieldConfig[]`. Cada extensão deste guia (regras condicionais, campos repetidos) amplia o tipo e adiciona uma etapa de tradução dentro de `buildSchema()`, preservando esse alinhamento. O modelo e o schema permanecem travados juntos, independentemente de onde a configuração venha ou de como ela cresça.

Para outros guias relacionados que cobrem outros aspectos de Signal Forms, confira:

<docs-pill-row>
  <docs-pill href="guide/forms/signals/schemas" title="Schemas e composição de schemas" />
  <docs-pill href="guide/forms/signals/validation" title="Validação" />
  <docs-pill href="guide/forms/signals/form-logic" title="Adicionando lógica ao formulário" />
  <docs-pill href="guide/forms/signals/field-state-management" title="Gerenciamento de estado dos campos" />
</docs-pill-row>

Para a documentação detalhada da API, veja:

- [`form()`](api/forms/signals/form) - Cria um formulário a partir de um signal de modelo
- [`applyWhen()`](api/forms/signals/applyWhen) - Aplica um schema condicionalmente com base em estado reativo
- [`applyEach()`](api/forms/signals/applyEach) - Aplica um schema a cada item de um campo array
- [`FieldTree`](api/forms/signals/FieldTree) - Árvore navegável de campos exposta por `form()`
- [`SchemaFn`](api/forms/signals/SchemaFn) - Assinatura de tipo para funções de schema
