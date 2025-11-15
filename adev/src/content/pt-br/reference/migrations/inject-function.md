<!-- ia-translate: true -->
# Migração para a função `inject`

A função `inject` do Angular oferece tipos mais precisos e melhor compatibilidade com decorators padrão, em comparação com a injeção baseada em construtor.

Este schematic converte a injeção baseada em construtor em suas classes para usar a função `inject`.

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

A migração inclui várias opções para personalizar sua saída.

### `path`

Determina qual subcaminho em seu projeto deve ser migrado. Passe `.` ou deixe em branco para migrar o diretório inteiro.

### `migrateAbstractClasses`

O Angular não valida que os parâmetros de classes abstratas sejam injetáveis. Isso significa que a migração não pode migrá-los de forma confiável para `inject` sem arriscar problemas, razão pela qual estão desabilitados por padrão. Habilite esta opção se você quiser que classes abstratas sejam migradas, mas observe que você pode ter que **corrigir alguns problemas manualmente**.

### `backwardsCompatibleConstructors`

Por padrão, a migração tenta limpar o código o máximo possível, o que inclui deletar parâmetros do construtor, ou até mesmo o construtor inteiro se ele não incluir nenhum código. Em alguns casos, isso pode levar a erros de compilação quando classes com decorators do Angular herdam de outras classes com decorators do Angular. Se você habilitar esta opção, a migração gerará uma assinatura de construtor adicional para mantê-lo compatível com versões anteriores, à custa de mais código.

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

/\*_ Inserido pela migração inject() do Angular para compatibilidade com versões anteriores _/
constructor(...args: unknown[]);

constructor() {}
}
```

### `nonNullableOptional`

Se a injeção falhar para um parâmetro com o decorator `@Optional`, o Angular retorna `null`, o que significa que o tipo real de qualquer parâmetro `@Optional` será `| null`. No entanto, como decorators não podem influenciar seus tipos, há muito código existente cujo tipo está incorreto. O tipo é corrigido em `inject()`, o que pode causar novos erros de compilação. Se você habilitar esta opção, a migração produzirá uma asserção não-nula após a chamada `inject()` para corresponder ao tipo antigo, à custa de potencialmente ocultar erros de tipo.

**NOTA:** asserções não-nulas não serão adicionadas a parâmetros que já estão tipados como anuláveis, porque o código que depende deles provavelmente já leva em conta sua anulabilidade.

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
  // Observe o `!` no final.
  private tokenOne = inject(TOKEN_ONE, { optional: true })!;

  // Não tem `!` no final, porque o tipo já era anulável.
  private tokenTwo = inject(TOKEN_TWO, { optional: true });
}
```
