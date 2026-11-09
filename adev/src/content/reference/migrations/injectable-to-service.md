<!-- ia-translate: true -->
# Migração de `@Injectable` para `@Service`

Este schematic converte classes `@Injectable` elegíveis para o decorator [`@Service`](/api/core/Service), um atalho ergonômico para `@Injectable({providedIn: 'root'})`.
Ele está disponível a partir da v22.1 e migra apenas classes consideradas seguras para migração.

Execute o schematic usando o seguinte comando:

```bash
ng generate @angular/core:service
```

Uma classe declarada com `providedIn: 'root'` se torna um `@Service` sem opções.

#### Antes {#before}

```ts
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class MyService {}
```

#### Depois {#after}

```ts
import {Service} from '@angular/core';

@Service()
export class MyService {}
```

Uma classe declarada sem opções não é provida automaticamente, então a migração mantém esse comportamento com `autoProvided: false`.
Você continua responsável por adicioná-la a um array `providers`, como antes.

#### Antes {#no-options-before}

```ts
import {Injectable} from '@angular/core';

@Injectable()
export class MyService {}
```

#### Depois {#no-options-after}

```ts
import {Service} from '@angular/core';

@Service({autoProvided: false})
export class MyService {}
```

Para mais detalhes, veja [Optando por não usar o provisionamento automático](guide/di/creating-and-using-services#opting-out-of-automatic-provisioning).

## Opções de configuração {#configuration-options}

### `--path`

Por padrão, a migração atualiza todo o seu workspace do Angular CLI, incluindo arquivos de teste.
Você pode limitar a migração a um subdiretório específico usando esta opção.

```bash
ng generate @angular/core:service --path src/app/sub-component
```

## Limitações {#limitations}

Para evitar introduzir quebras na sua aplicação, o schematic ignora uma classe quando:

- A classe, ou o ancestral mais próximo no seu próprio código-fonte que define um constructor, injeta dependências pelo seu constructor.
- O decorator `@Injectable` recebe qualquer opção além de `providedIn`.
- A opção `providedIn` é definida com qualquer valor diferente de `'root'`.

Quando todos os `@Injectable` de um arquivo são migrados, a migração remove o import de `Injectable`.
Um arquivo com classes migradas e ignoradas mantém os dois imports.

Se a migração informar que não encontrou nenhum arquivo para migrar, ela não alterou nenhum arquivo.
Ou não encontrou nenhuma classe `@Injectable` que pudesse converter, ou o código já está migrado.
A injeção por constructor é o motivo mais comum para uma classe ser ignorada, e você pode executar primeiro a [migração para a função `inject`](reference/migrations/inject-function) e depois executar esta novamente.
