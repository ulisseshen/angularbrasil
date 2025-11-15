<!-- ia-translate: true -->
# Migrar um projeto Angular existente para standalone

**Components standalone** fornecem uma maneira simplificada de construir aplicações Angular. Components, directives e pipes standalone visam simplificar a experiência de autoria reduzindo a necessidade de `NgModule`s. Aplicações existentes podem opcionalmente e incrementalmente adotar o novo estilo standalone sem nenhuma breaking change.

<docs-video src="https://www.youtube.com/embed/x5PZwb4XurU" title="Getting started with standalone components"/>

Este schematic ajuda a transformar components, directives e pipes em projetos existentes para se tornarem standalone. O schematic visa transformar o máximo de código possível automaticamente, mas pode exigir algumas correções manuais pelo autor do projeto.

Execute o schematic usando o seguinte comando:

<docs-code language="shell">

ng generate @angular/core:standalone

</docs-code>

## Antes de atualizar

Antes de usar o schematic, certifique-se de que o projeto:

1. Está usando Angular 15.2.0 ou posterior.
2. Compila sem nenhum erro de compilação.
3. Está em um branch Git limpo e todo o trabalho está salvo.

## Opções do schematic

| Opção  | Detalhes                                                                                                                                    |
| :----- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| `mode` | A transformação a realizar. Veja [Modos de migração](#migration-modes) abaixo para detalhes sobre as opções disponíveis.                   |
| `path` | O caminho para migrar, relativo à raiz do projeto. Você pode usar esta opção para migrar seções do seu projeto incrementalmente.           |

## Etapas de migração

O processo de migração é composto de três etapas. Você terá que executá-lo várias vezes e verificar manualmente se o projeto compila e se comporta conforme esperado.

NOTE: Embora o schematic possa atualizar automaticamente a maioria do código, alguns casos extremos requerem intervenção do desenvolvedor.
Você deve planejar aplicar correções manuais após cada etapa da migração. Adicionalmente, o novo código gerado pelo schematic pode não corresponder às regras de formatação do seu código.

Execute a migração na ordem listada abaixo, verificando se seu código compila e executa entre cada etapa:

1. Execute `ng g @angular/core:standalone` e selecione "Convert all components, directives and pipes to standalone"
2. Execute `ng g @angular/core:standalone` e selecione "Remove unnecessary NgModule classes"
3. Execute `ng g @angular/core:standalone` e selecione "Bootstrap the project using standalone APIs"
4. Execute quaisquer verificações de linting e formatação, corrija quaisquer falhas e faça commit do resultado

## Após a migração

Parabéns, sua aplicação foi convertida para standalone 🎉. Aqui estão algumas etapas opcionais de acompanhamento que você pode querer realizar agora:

- Encontre e remova quaisquer declarações `NgModule` restantes: como a [etapa "Remove unnecessary NgModules"](#remove-unnecessary-ngmodules) não pode remover todos os módulos automaticamente, você pode ter que remover as declarações restantes manualmente.
- Execute os testes unitários do projeto e corrija quaisquer falhas.
- Execute quaisquer formatadores de código, se o projeto usa formatação automática.
- Execute quaisquer linters em seu projeto e corrija novos avisos. Alguns linters suportam uma flag `--fix` que pode resolver alguns de seus avisos automaticamente.

## Modos de migração

A migração tem os seguintes modos:

1. Converter declarações para standalone.
2. Remover NgModules desnecessários.
3. Mudar para API de bootstrap standalone.
   Você deve executar essas migrações na ordem dada.

### Converter declarações para standalone

Neste modo, a migração converte todos os components, directives e pipes para standalone removendo `standalone: false` e adicionando dependências ao seu array `imports`.

HELPFUL: O schematic ignora NgModules que fazem bootstrap de um component durante esta etapa porque eles são provavelmente módulos raiz usados por `bootstrapModule` em vez do `bootstrapApplication` compatível com standalone. O schematic converte essas declarações automaticamente como parte da etapa ["Mudar para API de bootstrap standalone"](#switch-to-standalone-bootstrapping-api).

**Antes:**

```typescript
// shared.module.ts
@NgModule({
  imports: [CommonModule],
  declarations: [GreeterComponent],
  exports: [GreeterComponent]
})
export class SharedModule {}
```

```typescript
// greeter.component.ts
@Component({
  selector: 'greeter',
  template: '<div *ngIf="showGreeting">Hello</div>',
  standalone: false,
})
export class GreeterComponent {
  showGreeting = true;
}
```

**Depois:**

```typescript
// shared.module.ts
@NgModule({
  imports: [CommonModule, GreeterComponent],
  exports: [GreeterComponent]
})
export class SharedModule {}
```

```typescript
// greeter.component.ts
@Component({
  selector: 'greeter',
  template: '<div *ngIf="showGreeting">Hello</div>',
  imports: [NgIf]
})
export class GreeterComponent {
  showGreeting = true;
}
```

### Remover NgModules desnecessários

Após converter todas as declarações para standalone, muitos NgModules podem ser removidos com segurança. Esta etapa deleta tais declarações de módulo e o máximo de referências correspondentes possível. Se a migração não puder deletar uma referência automaticamente, ela deixa o seguinte comentário TODO para que você possa deletar o NgModule manualmente:

```typescript
/* TODO(standalone-migration): clean up removed NgModule reference manually */
```

A migração considera um módulo seguro para remover se esse módulo:

- Não tem `declarations`.
- Não tem `providers`.
- Não tem components de `bootstrap`.
- Não tem `imports` que referenciam um símbolo `ModuleWithProviders` ou um módulo que não pode ser removido.
- Não tem membros de classe. Construtores vazios são ignorados.

**Antes:**

```typescript
// importer.module.ts
@NgModule({
  imports: [FooComponent, BarPipe],
  exports: [FooComponent, BarPipe]
})
export class ImporterModule {}
```

**Depois:**

```typescript
// importer.module.ts
// Não existe!
```

### Mudar para API de bootstrap standalone

Esta etapa converte quaisquer usos de `bootstrapModule` para a nova API `bootstrapApplication` baseada em standalone. Ela também remove `standalone: false` do component raiz e deleta o NgModule raiz. Se o módulo raiz tiver quaisquer `providers` ou `imports`, a migração tenta copiar o máximo possível dessa configuração para a nova chamada de bootstrap.

**Antes:**

```typescript
// ./app/app.module.ts
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

```typescript
// ./app/app.component.ts
@Component({
  selector: 'app',
  template: 'hello',
  standalone: false,
})
export class AppComponent {}
```

```typescript
// ./main.ts
import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app.module';

platformBrowser().bootstrapModule(AppModule).catch(e => console.error(e));
```

**Depois:**

```typescript
// ./app/app.module.ts
// Não existe!
```

```typescript
// ./app/app.component.ts
@Component({
  selector: 'app',
  template: 'hello'
})
export class AppComponent {}
```

```typescript
// ./main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent).catch(e => console.error(e));
```

## Problemas comuns

Alguns problemas comuns que podem impedir que o schematic funcione corretamente incluem:

- Erros de compilação - se o projeto tem erros de compilação, o Angular não pode analisar e migrá-lo corretamente.
- Arquivos não incluídos em um tsconfig - o schematic determina quais arquivos migrar analisando os arquivos `tsconfig.json` do seu projeto. O schematic exclui quaisquer arquivos não capturados por um tsconfig.
- Código que não pode ser analisado estaticamente - o schematic usa análise estática para entender seu código e determinar onde fazer mudanças. A migração pode pular quaisquer classes com metadata que não podem ser analisados estaticamente em tempo de build.

## Limitações

Devido ao tamanho e complexidade da migração, existem alguns casos que o schematic não pode lidar:

- Como testes unitários não são compilados ahead-of-time (AoT), `imports` adicionados a components em testes unitários podem não estar totalmente corretos.
- O schematic depende de chamadas diretas para APIs do Angular. O schematic não pode reconhecer wrappers customizados em torno de APIs do Angular. Por exemplo, se você definir uma função customizada `customConfigureTestModule` que envolve `TestBed.configureTestingModule`, components que ela declara podem não ser reconhecidos.
