<!-- ia-translate: true -->
# Migração para a função `inject`

A função `inject` do Angular oferece tipos mais precisos e melhor compatibilidade com decorators padrão, comparada à injeção baseada em constructor.

Este schematic converte a injeção baseada em constructor em suas classes para usar a função `inject` em vez disso.

Execute o schematic usando o seguinte comando:

<docs-code language="shell">

ng generate @angular/core:inject

</docs-code>

#### Antes

```typescript
import { Component, Inject, Optional } from '@angular/core';
import { MyService } from './service';
import { DI_TOKEN } from './token';

@Component()
export class MyComp {
  constructor(
    private service: MyService,
    @Inject(DI_TOKEN) @Optional() readonly token: string
  ) {}
}
```

#### Depois

```typescript
import { Component, inject } from '@angular/core';
import { MyService } from './service';
import { DI_TOKEN } from './token';

@Component()
export class MyComp {
  private service = inject(MyService);
  readonly token = inject(DI_TOKEN, { optional: true });
}
```

## Opções de migração

A migração inclui várias opções para customizar sua saída.

### `path`

Determina qual subcaminho em seu projeto deve ser migrado. Passe `.` ou deixe em branco para
migrar o diretório inteiro.

### `migrateAbstractClasses`

O Angular não valida que parâmetros de classes abstratas são injetáveis. Isso significa que a
migração não pode migrar de forma confiável para `inject` sem arriscar quebras, razão pela qual elas estão
desabilitadas por padrão. Habilite esta opção se você quiser que classes abstratas sejam migradas, mas note
que você pode ter que **corrigir algumas quebras manualmente**.

### `backwardsCompatibleConstructors`

Por padrão, a migração tenta limpar o código o máximo possível, o que inclui deletar
parâmetros do constructor, ou até mesmo o constructor inteiro se ele não incluir nenhum código.
Em alguns casos, isso pode levar a erros de compilação quando classes com decorators do Angular herdam de
outras classes com decorators do Angular. Se você habilitar esta opção, a migração gerará uma
assinatura de constructor adicional para mantê-lo compatível com versões anteriores, às custas de mais código.

#### Antes

```typescript
import { Component } from '@angular/core';
import { MyService } from './service';

@Component()
export class MyComp {
  constructor(private service: MyService) {}
}
```

#### Depois

```typescript
import { Component } from '@angular/core';
import { MyService } from './service';

@Component()
export class MyComp {
private service = inject(MyService);

/\*_ Inserted by Angular inject() migration for backwards compatibility _/
constructor(...args: unknown[]);

constructor() {}
}
```

### `nonNullableOptional`

Se a injeção falha para um parâmetro com o decorator `@Optional`, o Angular retorna `null`, o que
significa que o tipo real de qualquer parâmetro `@Optional` será `| null`. No entanto, como decorators
não podem influenciar seus tipos, há muito código existente cujo tipo está incorreto. O tipo é
corrigido em `inject()`, o que pode causar novos erros de compilação aparecerem. Se você habilitar esta opção,
a migração produzirá uma asserção não-nula após a chamada `inject()` para corresponder ao tipo antigo,
às custas de potencialmente esconder erros de tipo.

**NOTA:** asserções não-nulas não serão adicionadas a parâmetros que já estão tipados como anuláveis,
porque o código que depende deles provavelmente já leva em conta sua anulabilidade.

#### Antes

```typescript
import { Component, Inject, Optional } from '@angular/core';
import { TOKEN_ONE, TOKEN_TWO } from './token';

@Component()
export class MyComp {
  constructor(
    @Inject(TOKEN_ONE) @Optional() private tokenOne: number,
    @Inject(TOKEN_TWO) @Optional() private tokenTwo: string | null
  ) {}
}
```

#### Depois

```typescript
import { Component, inject } from '@angular/core';
import { TOKEN_ONE, TOKEN_TWO } from './token';

@Component()
export class MyComp {
  // Note the `!` at the end.
  private tokenOne = inject(TOKEN_ONE, { optional: true })!;

  // Does not have `!` at the end, because the type was already nullable.
  private tokenTwo = inject(TOKEN_TWO, { optional: true });
}
```
