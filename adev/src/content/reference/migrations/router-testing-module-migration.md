<!-- ia-translate: true -->
# Migração do RouterTestingModule

Este schematic migra usos de `RouterTestingModule` dentro de testes para `RouterModule`.

Quando um teste importa `SpyLocation` de `@angular/common/testing` e usa a propriedade `urlChanges`, o schematic também adicionará `provideLocationMocks()` para preservar o comportamento original.

Execute o schematic com:

```shell
ng generate @angular/core:router-testing-module-migration
```

## Opções {#options}

| Opção  | Detalhes                                                                                                                      |
| :----- | :---------------------------------------------------------------------------------------------------------------------------- |
| `path` | O caminho (relativo à raiz do projeto) a ser migrado. O padrão é `./`. Use isto para migrar incrementalmente um subconjunto do seu projeto. |

## Exemplos {#examples}

### Preservar opções do router {#preserve-router-options}

Antes:

```ts
import {RouterTestingModule} from '@angular/router/testing';
import {TestBed} from '@angular/core/testing';
import {SpyLocation} from '@angular/common/testing';

describe('test', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes, {initialNavigation: 'enabledBlocking'})],
    });
  });
});
```

Depois:

```ts
import {RouterModule} from '@angular/router';
import {TestBed} from '@angular/core/testing';
import {SpyLocation} from '@angular/common/testing';

describe('test', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot(routes, {initialNavigation: 'enabledBlocking'})],
    });
  });
});
```

### Adicionar provideLocationMocks quando `SpyLocation` é importado e `urlChanges` é usado {#add-providelocationmocks-when-spylocation-is-imported-and-urlchanges-is-used}

Antes:

```ts
import {RouterTestingModule} from '@angular/router/testing';
import {TestBed} from '@angular/core/testing';
import {SpyLocation} from '@angular/common/testing';

describe('test', () => {
  let spy: SpyLocation;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
    });
    spy = TestBed.inject(SpyLocation);
  });

  it('Awesome test', () => {
    expect(spy.urlChanges).toBeDefined();
  });
});
```

Depois:

```ts
import {RouterModule} from '@angular/router';
import {TestBed} from '@angular/core/testing';
import {SpyLocation, provideLocationMocks} from '@angular/common/testing';

describe('test', () => {
  let spy: SpyLocation;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule],
      providers: [provideLocationMocks()],
    });
    spy = TestBed.inject(SpyLocation);
  });

  it('Awesome test', () => {
    expect(spy.urlChanges).toBeDefined();
  });
});
```
