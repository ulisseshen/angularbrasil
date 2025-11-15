<!-- ia-translate: true -->
# Migration do RouterTestingModule

Este schematic migra usos de `RouterTestingModule` dentro de testes para `RouterModule`.

Quando um teste importa `SpyLocation` de `@angular/common/testing` e usa a property `urlChanges`, o schematic também adicionará `provideLocationMocks()` para preservar o comportamento original.

Execute o schematic com:

<docs-code language="shell">

ng generate @angular/core:router-testing-module-migration

</docs-code>

## Opções

| Opção  | Detalhes                                                                                                                                    |
| :----- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| `path` | O caminho (relativo à raiz do projeto) para migrar. Padrão é `./`. Use isso para migrar incrementalmente um subconjunto do seu projeto. |

## Exemplos

### Preservar opções do router

Antes:

```ts
import { RouterTestingModule } from '@angular/router/testing';
import { SpyLocation } from '@angular/common/testing';

describe('test', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
       imports: [RouterTestingModule.withRoutes(routes, { initialNavigation: 'enabledBlocking' })]
    });
  });

});
```

Depois:

```ts
import { RouterModule } from '@angular/router';
import { SpyLocation } from '@angular/common/testing';

describe('test', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
       imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking' })]
    });
  });

});
```

### Adicionar provideLocationMocks quando `SpyLocation` é importado e `urlChanges` é usado

Antes:

```ts
import { RouterTestingModule } from '@angular/router/testing';
import { SpyLocation } from '@angular/common/testing';

describe('test', () => {
  let spy : SpyLocation;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule]
    });
    spy = TestBed.inject(SpyLocation);
  });

  it('Awesome test', () => {
    expect(spy.urlChanges).toBeDefined()
  })
});
```

Depois:

```ts
import { RouterModule } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';
import { SpyLocation } from '@angular/common/testing';

describe('test', () => {
  let spy : SpyLocation;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule],
      providers: [provideLocationMocks()]
    });
    spy = TestBed.inject(SpyLocation);
  });

  it('Awesome test', () => {
    expect(spy.urlChanges).toBeDefined()
  })
});
```
