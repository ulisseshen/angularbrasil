<!-- ia-translate: true -->
# Migrar um projeto Angular existente para standalone

**Standalone components** fornecem uma forma simplificada de construir aplicações Angular. Standalone components, directives e pipes visam simplificar a experiência de autoria reduzindo a necessidade de `NgModule`s. Aplicações existentes podem opcionalmente e incrementalmente adotar o novo estilo standalone sem nenhuma breaking change.

<docs-video src="https://www.youtube.com/embed/x5PZwb4XurU" title="Getting started with standalone components"/>

Este schematic ajuda a transformar components, directives e pipes em projetos existentes para se tornarem standalone. O schematic visa transformar o máximo de código possível automaticamente, mas pode exigir algumas correções manuais pelo autor do projeto.

Execute o schematic usando o seguinte comando:

<docs-code language="shell">

ng generate @angular/core:standalone

</docs-code>

## Antes de atualizar

Antes de usar o schematic, certifique-se de que o projeto:

1. Está usando Angular 15.2.0 ou posterior.
2. Compila sem erros de compilação.
3. Está em um branch Git limpo e todo o trabalho está salvo.

## Opções do schematic

| Opção  | Detalhes                                                                                                                      |
| :----- | :---------------------------------------------------------------------------------------------------------------------------- |
| `mode` | A transformação a executar. Veja [Modos de migração](#migration-modes) abaixo para detalhes sobre as opções disponíveis.     |
| `path` | O caminho a migrar, relativo à raiz do projeto. Você pode usar esta opção para migrar seções do seu projeto incrementalmente. |

## Passos de migração

O processo de migração é composto por três passos. Você terá que executá-lo múltiplas vezes e verificar manualmente que o projeto compila e se comporta como esperado.

NOTA: Embora o schematic possa atualizar automaticamente a maior parte do código, alguns casos extremos exigem intervenção do desenvolvedor.
Você deve planejar aplicar correções manuais após cada passo da migração. Adicionalmente, o novo código gerado pelo schematic pode não corresponder às regras de formatação do seu código.

Execute a migração na ordem listada abaixo, verificando que seu código compila e executa entre cada passo:

1. Execute `ng g @angular/core:standalone` e selecione "Convert all components, directives and pipes to standalone"
2. Execute `ng g @angular/core:standalone` e selecione "Remove unnecessary NgModule classes"
3. Execute `ng g @angular/core:standalone` e selecione "Bootstrap the project using standalone APIs"
4. Execute quaisquer verificações de linting e formatação, corrija quaisquer falhas e faça commit do resultado

## Após a migração

Parabéns, sua aplicação foi convertida para standalone 🎉. Estes são alguns passos opcionais de acompanhamento que você pode querer fazer agora:

- Encontre e remova quaisquer declarações `NgModule` restantes: já que o [passo "Remove unnecessary NgModules"](#remove-unnecessary-ngmodules) não pode remover todos os módulos automaticamente, você pode ter que remover as declarações restantes manualmente.
- Execute os unit tests do projeto e corrija quaisquer falhas.
- Execute quaisquer formatadores de código, se o projeto usa formatação automática.
- Execute quaisquer linters em seu projeto e corrija novos avisos. Alguns linters suportam uma flag `--fix` que pode resolver alguns de seus avisos automaticamente.

## Modos de migração

A migração tem os seguintes modos:

1. Converter declarações para standalone.
2. Remover NgModules desnecessários.
3. Mudar para API de bootstrapping standalone.
   Você deve executar estas migrações na ordem dada.

### Converter declarações para standalone

Neste modo, a migração converte todos os components, directives e pipes para standalone removendo `standalone: false` e adicionando dependências ao seu array `imports`.

ÚTIL: O schematic ignora NgModules que fazem bootstrap de um component durante este passo porque eles são provavelmente módulos raiz usados por `bootstrapModule` ao invés do `bootstrapApplication` compatível com standalone. O schematic converte estas declarações automaticamente como parte do passo ["Mudar para API de bootstrapping standalone"](#switch-to-standalone-bootstrapping-api).

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

Após converter todas as declarações para standalone, muitos NgModules podem ser removidos com segurança. Este passo exclui tais declarações de módulos e o máximo de referências correspondentes possível. Se a migração não puder excluir uma referência automaticamente, ela deixa o seguinte comentário TODO para que você possa excluir o NgModule manualmente:

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

### Mudar para API de bootstrapping standalone

Este passo converte quaisquer usos de `bootstrapModule` para a nova API baseada em standalone `bootstrapApplication`. Ele também remove `standalone: false` do root component e exclui o root NgModule. Se o root module tiver quaisquer `providers` ou `imports`, a migração tenta copiar o máximo possível desta configuração para a nova chamada de bootstrap.

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

- Como unit tests não são compilados ahead-of-time (AoT), `imports` adicionados a components em unit tests podem não estar totalmente corretos.
- O schematic se baseia em chamadas diretas para APIs Angular. O schematic não pode reconhecer wrappers customizados em torno de APIs Angular. Por exemplo, se você definir uma função `customConfigureTestModule` customizada que envolve `TestBed.configureTestingModule`, components que ela declara podem não ser reconhecidos.
