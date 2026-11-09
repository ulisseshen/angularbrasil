<!-- ia-translate: true -->
# Migração para a função `inject` {#migration-to-the-inject-function}

A função [`inject`](/api/core/inject) do Angular oferece tipos mais precisos e melhor compatibilidade com decorators padrão, em comparação com a injeção baseada em constructor.

Este schematic converte a injeção baseada em constructor das suas classes para usar a função [`inject`](/api/core/inject) em vez disso.

Execute o schematic usando o seguinte comando:

```shell
ng generate @angular/core:inject
```

#### Antes {#before}

```typescript
import {Component, Inject, Optional} from '@angular/core';
import {MyService} from './service';
import {DI_TOKEN} from './token';

@Component({template: ''})
export class MyComp {
  constructor(
    private service: MyService,
    @Inject(DI_TOKEN) @Optional() readonly token: string,
  ) {}
}
```

#### Depois {#after}

```typescript
import {Component, inject} from '@angular/core';
import {MyService} from './service';
import {DI_TOKEN} from './token';

@Component({template: ''})
export class MyComp {
  private service = inject(MyService);
  readonly token = inject(DI_TOKEN, {optional: true});
}
```

## Opções de migração {#migration-options}

A migração inclui várias opções para customizar sua saída.

### `path`

Determina qual subcaminho do seu projeto deve ser migrado. Passe `.` ou deixe em branco para
migrar o diretório inteiro.

### `migrateAbstractClasses`

O Angular não valida que os parâmetros de classes abstratas são injetáveis. Isso significa que a
migração não pode migrar de forma confiável para [`inject`](/api/core/inject) sem arriscar quebras, por isso elas estão
desabilitadas por padrão. Habilite esta opção se você quiser que classes abstratas sejam migradas, mas note
que você pode ter que **corrigir algumas quebras manualmente**.

### `backwardsCompatibleConstructors`

Por padrão, a migração tenta limpar o código o máximo possível, o que inclui deletar
parâmetros do constructor, ou até mesmo o constructor inteiro se ele não incluir nenhum código.
Em alguns casos, isso pode levar a erros de compilação quando classes com decorators do Angular herdam de
outras classes com decorators do Angular. Se você habilitar esta opção, a migração gerará uma
assinatura de constructor adicional para mantê-lo compatível com versões anteriores, ao custo de mais código.

#### Antes {#backwards-compatible-constructors-before}

```typescript
import {Component} from '@angular/core';
import {MyService} from './service';

@Component({template: ''})
export class MyComp {
  constructor(private service: MyService) {}
}
```

#### Depois {#backwards-compatible-constructors-after}

```typescript
import {Component, inject} from '@angular/core';
import {MyService} from './service';

@Component({template: ''})
export class MyComp {
  private service = inject(MyService);

  /** Inserido pela migração inject() do Angular para compatibilidade com versões anteriores */
  constructor(...args: unknown[]);

  constructor() {}
}
```

### `nonNullableOptional`

Se a injeção falhar para um parâmetro com o decorator `@Optional`, o Angular retorna `null`, o que
significa que o tipo real de qualquer parâmetro `@Optional` será `| null`. No entanto, como decorators
não podem influenciar seus tipos, há muito código existente cujo tipo está incorreto. O tipo é
corrigido em `inject()`, o que pode fazer com que novos erros de compilação apareçam. Se você habilitar esta opção,
a migração produzirá uma asserção não-nula após a chamada `inject()` para corresponder ao tipo antigo,
ao custo de potencialmente esconder erros de tipo.

NOTE: asserções não-nulas não serão adicionadas a parâmetros que já estão tipados como anuláveis,
porque o código que depende deles provavelmente já leva em conta sua anulabilidade.

#### Antes {#non-nullable-optional-before}

```typescript
import {Component, Inject, Optional} from '@angular/core';
import {TOKEN_ONE, TOKEN_TWO} from './token';

@Component({template: ''})
export class MyComp {
  constructor(
    @Inject(TOKEN_ONE) @Optional() private tokenOne: number,
    @Inject(TOKEN_TWO) @Optional() private tokenTwo: string | null,
  ) {}
}
```

#### Depois {#non-nullable-optional-after}

```typescript
import {Component, inject} from '@angular/core';
import {TOKEN_ONE, TOKEN_TWO} from './token';

@Component({template: ''})
export class MyComp {
  // Observe o `!` no final.
  private tokenOne = inject(TOKEN_ONE, {optional: true})!;

  // Não tem `!` no final, porque o tipo já era anulável.
  private tokenTwo = inject(TOKEN_TWO, {optional: true});
}
```
