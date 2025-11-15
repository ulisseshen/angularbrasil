<!-- ia-translate: true -->
# Typed Forms

A partir do Angular 14, reactive forms são estritamente tipados por padrão.

Como base para este guia, você já deve estar familiarizado com [Angular Reactive Forms](guide/forms/reactive-forms).

## Visão geral de Typed Forms

<docs-video src="https://www.youtube.com/embed/L-odCf4MfJc" alt="Typed Forms in Angular" />

Com reactive forms do Angular, você especifica explicitamente um _form model_. Como um exemplo simples, considere este formulário básico de login de usuário:

```ts
const login = new FormGroup({
  email: new FormControl(''),
  password: new FormControl(''),
});
```

O Angular fornece muitas APIs para interagir com este `FormGroup`. Por exemplo, você pode chamar `login.value`, `login.controls`, `login.patchValue`, etc. (Para uma referência completa da API, veja a [documentação da API](api/forms/FormGroup).)

Em versões anteriores do Angular, a maioria dessas APIs incluía `any` em algum lugar de seus tipos, e interagir com a estrutura dos controls, ou os valores em si, não era type-safe. Por exemplo: você poderia escrever o seguinte código inválido:

```ts
const emailDomain = login.value.email.domain;
```

Com reactive forms estritamente tipados, o código acima não compila, porque não há propriedade `domain` em `email`.

Além da segurança adicionada, os tipos habilitam uma variedade de outras melhorias, como melhor autocomplete em IDEs, e uma forma explícita de especificar a estrutura do formulário.

Essas melhorias atualmente aplicam-se apenas a _reactive_ forms (não [_template-driven_ forms](guide/forms/template-driven-forms)).

## Untyped Forms

Formulários não tipados ainda são suportados, e continuarão a funcionar como antes. Para usá-los, você deve importar os símbolos `Untyped` de `@angular/forms`:

```ts
const login = new UntypedFormGroup({
  email: new UntypedFormControl(''),
  password: new UntypedFormControl(''),
});
```

Cada símbolo `Untyped` tem exatamente a mesma semântica que nas versões anteriores do Angular. Ao remover os prefixos `Untyped`, você pode habilitar os tipos incrementalmente.

## `FormControl`: Começando

O formulário mais simples possível consiste de um único control:

```ts
const email = new FormControl('angularrox@gmail.com');
```

Este control será automaticamente inferido para ter o tipo `FormControl<string|null>`. O TypeScript automaticamente aplicará este tipo em toda a [API do `FormControl`](api/forms/FormControl), como `email.value`, `email.valueChanges`, `email.setValue(...)`, etc.

### Nullability

Você pode se perguntar: por que o tipo deste control inclui `null`? Isso é porque o control pode se tornar `null` a qualquer momento, ao chamar reset:

```ts
const email = new FormControl('angularrox@gmail.com');
email.reset();
console.log(email.value); // null
```

O TypeScript aplicará que você sempre lide com a possibilidade de que o control tenha se tornado `null`. Se você quiser tornar este control não-anulável, você pode usar a opção `nonNullable`. Isso fará com que o control seja resetado para seu valor inicial, ao invés de `null`:

```ts
const email = new FormControl('angularrox@gmail.com', {nonNullable: true});
email.reset();
console.log(email.value); // angularrox@gmail.com
```

Para reiterar, esta opção afeta o comportamento em tempo de execução do seu formulário quando `.reset()` é chamado, e deve ser alterada com cuidado.

### Especificando um tipo explícito

É possível especificar o tipo, ao invés de confiar na inferência. Considere um control que é inicializado como `null`. Como o valor inicial é `null`, o TypeScript inferirá `FormControl<null>`, que é mais restrito do que queremos.

```ts
const email = new FormControl(null);
email.setValue('angularrox@gmail.com'); // Error!
```

Para prevenir isso, especificamos explicitamente o tipo como `string|null`:

```ts
const email = new FormControl<string|null>(null);
email.setValue('angularrox@gmail.com');
```

## `FormArray`: Coleções dinâmicas e homogêneas

Um `FormArray` contém uma lista aberta de controls. O parâmetro de tipo corresponde ao tipo de cada control interno:

```ts
const names = new FormArray([new FormControl('Alex')]);
names.push(new FormControl('Jess'));
```

Passe um array de controls para `aliases.push()` quando você precisar adicionar várias entradas de uma vez.

```ts
const aliases = new FormArray([new FormControl('ng')]);
aliases.push([new FormControl('ngDev'), new FormControl('ngAwesome')]);
```

Este `FormArray` terá o tipo de controls internos `FormControl<string|null>`.

Se você quiser ter múltiplos tipos de elementos diferentes dentro do array, você deve usar `UntypedFormArray`, porque o TypeScript não pode inferir qual tipo de elemento ocorrerá em qual posição.

Um `FormArray` também fornece um método `clear()` para remover todos os controls que contém:

```ts
const aliases = new FormArray([new FormControl('ngDev'), new FormControl('ngAwesome')]);
aliases.clear();
console.log(aliases.length); // 0
```

## `FormGroup` e `FormRecord`

O Angular fornece o tipo `FormGroup` para formulários com um conjunto enumerado de chaves, e um tipo chamado `FormRecord`, para grupos abertos ou dinâmicos.

### Valores parciais

Considere novamente um formulário de login:

```ts
const login = new FormGroup({
    email: new FormControl('', {nonNullable: true}),
    password: new FormControl('', {nonNullable: true}),
});
```

Em qualquer `FormGroup`, é [possível desabilitar controls](api/forms/FormGroup). Qualquer control desabilitado não aparecerá no valor do grupo.

Como consequência, o tipo de `login.value` é `Partial<{email: string, password: string}>`. O `Partial` neste tipo significa que cada membro pode estar undefined.

Mais especificamente, o tipo de `login.value.email` é `string|undefined`, e o TypeScript aplicará que você lide com o valor possivelmente `undefined` (se você tiver `strictNullChecks` habilitado).

Se você quiser acessar o valor _incluindo_ controls desabilitados, e assim contornar campos possivelmente `undefined`, você pode usar `login.getRawValue()`.

### Optional Controls e grupos dinâmicos

Alguns formulários têm controls que podem ou não estar presentes, que podem ser adicionados e removidos em tempo de execução. Você pode representar esses controls usando _optional fields_:

```ts
interface LoginForm {
  email: FormControl<string>;
  password?: FormControl<string>;
}

const login = new FormGroup<LoginForm>({
  email: new FormControl('', {nonNullable: true}),
  password: new FormControl('', {nonNullable: true}),
});

login.removeControl('password');
```

Neste formulário, especificamos explicitamente o tipo, o que nos permite tornar o control `password` opcional. O TypeScript aplicará que apenas controls opcionais podem ser adicionados ou removidos.

### `FormRecord`

Alguns usos de `FormGroup` não se encaixam no padrão acima porque as chaves não são conhecidas antecipadamente. A classe `FormRecord` é projetada para esse caso:

```ts
const addresses = new FormRecord<FormControl<string|null>>({});
addresses.addControl('Andrew', new FormControl('2340 Folsom St'));
```

Qualquer control do tipo `string|null` pode ser adicionado a este `FormRecord`.

Se você precisar de um `FormGroup` que seja tanto dinâmico (aberto) quanto heterogêneo (os controls são tipos diferentes), nenhuma melhoria de type safety é possível, e você deve usar `UntypedFormGroup`.

Um `FormRecord` também pode ser construído com o `FormBuilder`:

```ts
const addresses = fb.record({'Andrew': '2340 Folsom St'});
```

## `FormBuilder` e `NonNullableFormBuilder`

A classe `FormBuilder` foi atualizada para suportar os novos tipos também, da mesma maneira que os exemplos acima.

Adicionalmente, um builder adicional está disponível: `NonNullableFormBuilder`. Este tipo é uma abreviação para especificar `{nonNullable: true}` em cada control, e pode eliminar boilerplate significativo de grandes formulários não anuláveis. Você pode acessá-lo usando a propriedade `nonNullable` em um `FormBuilder`:

```ts
const fb = new FormBuilder();
const login = fb.nonNullable.group({
  email: '',
  password: '',
});
```

No exemplo acima, ambos os controls internos serão não anuláveis (ou seja, `nonNullable` será definido).

Você também pode injetá-lo usando o nome `NonNullableFormBuilder`.
