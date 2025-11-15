<!-- ia-translate: true -->
# Angular sem ZoneJS (Zoneless)

## Por que usar Zoneless?

As principais vantagens de remover ZoneJS como uma dependência são:

- **Desempenho melhorado**: ZoneJS usa eventos do DOM e tarefas assíncronas como indicadores de quando o estado da aplicação _pode_ ter atualizado e, subsequentemente, aciona a sincronização da aplicação para executar change detection nas views da aplicação. ZoneJS não tem nenhuma visão sobre se o estado da aplicação realmente mudou e, portanto, essa sincronização é acionada com mais frequência do que o necessário.
- **Core Web Vitals melhorados**: ZoneJS traz uma quantidade considerável de overhead, tanto em tamanho de payload quanto em custo de tempo de inicialização.
- **Experiência de debugging melhorada**: ZoneJS torna a depuração de código mais difícil. Stack traces são mais difíceis de entender com ZoneJS. Também é difícil entender quando o código quebra como resultado de estar fora da Angular Zone.
- **Melhor compatibilidade com o ecossistema**: ZoneJS funciona através de patching de APIs do navegador, mas não tem automaticamente patches para cada nova API do navegador. Algumas APIs não podem ser patchadas de forma eficaz, como `async`/`await`, e precisam ser rebaixadas para funcionar com ZoneJS. Às vezes, bibliotecas no ecossistema também são incompatíveis com a forma como ZoneJS patcha as APIs nativas. Remover ZoneJS como uma dependência garante melhor compatibilidade de longo prazo removendo uma fonte de complexidade, monkey patching e manutenção contínua.

## Habilitando Zoneless em uma aplicação

```typescript
// standalone bootstrap
bootstrapApplication(MyApp, {providers: [
  provideZonelessChangeDetection(),
]});

// NgModule bootstrap
platformBrowser().bootstrapModule(AppModule);
@NgModule({
  providers: [provideZonelessChangeDetection()]
})
export class AppModule {}
```

## Removendo ZoneJS

Aplicações zoneless devem remover ZoneJS inteiramente do build para reduzir o tamanho do bundle. ZoneJS é tipicamente
carregado via opção `polyfills` em `angular.json`, tanto nos targets `build` quanto `test`. Remova `zone.js`
e `zone.js/testing` de ambos para removê-lo do build. Projetos que usam um arquivo `polyfills.ts` explícito
devem remover `import 'zone.js';` e `import 'zone.js/testing';` do arquivo.

Depois de remover ZoneJS do build, não há mais necessidade de uma dependência `zone.js` e o
pacote pode ser removido inteiramente:

```shell
npm uninstall zone.js
```

## Requisitos para compatibilidade Zoneless

O Angular depende de notificações de APIs core para determinar quando executar change detection e em quais views.
Essas notificações incluem:

- `ChangeDetectorRef.markForCheck` (chamado automaticamente por `AsyncPipe`)
- `ComponentRef.setInput`
- Atualizar um signal que é lido em um template
- Callbacks de listeners de host ou template bound
- Anexar uma view que foi marcada como dirty por um dos itens acima

### Components compatíveis com `OnPush`

Uma maneira de garantir que um component está usando os mecanismos de notificação corretos acima é
usar [ChangeDetectionStrategy.OnPush](/best-practices/skipping-subtrees#using-onpush).

A estratégia de change detection `OnPush` não é obrigatória, mas é uma etapa recomendada em direção à compatibilidade zoneless para components de aplicação. Nem sempre é possível para components de biblioteca usar `ChangeDetectionStrategy.OnPush`.
Quando um component de biblioteca é um host para user-components que podem usar `ChangeDetectionStrategy.Default`, ele não pode usar `OnPush` porque isso impediria que o component filho fosse atualizado se não for compatível com `OnPush` e depende de ZoneJS para acionar change detection. Components podem usar a estratégia `Default` desde que notifiquem o Angular quando change detection precisa executar (chamando `markForCheck`, usando signals, `AsyncPipe`, etc.).
Ser um host para um user component significa usar uma API como `ViewContainerRef.createComponent` e não apenas hospedar uma parte de um template de um user component (ou seja, projeção de conteúdo ou usar um input de template ref).

### Remover `NgZone.onMicrotaskEmpty`, `NgZone.onUnstable`, `NgZone.isStable`, ou `NgZone.onStable`

Aplicações e bibliotecas precisam remover usos de `NgZone.onMicrotaskEmpty`, `NgZone.onUnstable` e `NgZone.onStable`.
Esses observables nunca emitirão quando uma Aplicação habilitar zoneless change detection.
Da mesma forma, `NgZone.isStable` sempre será `true` e não deve ser usado como uma condição para execução de código.

Os observables `NgZone.onMicrotaskEmpty` e `NgZone.onStable` são mais frequentemente usados para esperar o Angular
completar change detection antes de realizar uma tarefa. Em vez disso, eles podem ser substituídos por `afterNextRender`
se precisarem esperar por um único change detection ou `afterEveryRender` se houver alguma condição que pode abranger
várias rodadas de change detection. Em outros casos, esses observables foram usados porque eram
familiares e tinham timing similar ao que era necessário. APIs DOM mais diretas ou diretas podem ser usadas em vez disso,
como `MutationObserver` quando o código precisa esperar por certo estado do DOM (em vez de esperar por ele indiretamente
através dos hooks de renderização do Angular).

<docs-callout title="NgZone.run e NgZone.runOutsideAngular são compatíveis com Zoneless">
`NgZone.run` e `NgZone.runOutsideAngular` não precisam ser removidos para que o código seja compatível com
aplicações Zoneless. Na verdade, remover essas chamadas pode levar a regressões de desempenho para bibliotecas que
são usadas em aplicações que ainda dependem de ZoneJS.
</docs-callout>

### `PendingTasks` para Server Side Rendering (SSR)

Se você está usando SSR com Angular, você pode saber que ele depende de ZoneJS para ajudar a determinar quando a aplicação
está "estável" e pode ser serializada. Se houver tarefas assíncronas que devem prevenir serialização, uma aplicação
que não usa ZoneJS deve tornar o Angular ciente dessas com o serviço [PendingTasks](/api/core/PendingTasks). A serialização
aguardará o primeiro momento em que todas as tarefas pendentes foram removidas.

Os dois usos mais diretos de pending tasks são o método `run`:

```typescript
const taskService = inject(PendingTasks);
taskService.run(async () => {
  const someResult = await doSomeWorkThatNeedsToBeRendered();
  this.someState.set(someResult);
});
```

Para casos de uso mais complicados, você pode adicionar e remover manualmente uma pending task:

```typescript
const taskService = inject(PendingTasks);
const taskCleanup = taskService.add();
try {
  await doSomeWorkThatNeedsToBeRendered();
} catch {
  // handle error
} finally {
  taskCleanup();
}
```

Além disso, o helper [pendingUntilEvent](/api/core/rxjs-interop/pendingUntilEvent#) em `rxjs-interop` garante
que a aplicação permaneça instável até que o observable emita, complete, dê erro ou seja unsubscribed.

```typescript
readonly myObservableState = someObservable.pipe(pendingUntilEvent());
```

O framework usa este serviço internamente também para prevenir serialização até que tarefas assíncronas estejam completas. Isso inclui, mas não se limita a,
uma navegação de Router em andamento e uma requisição `HttpClient` incompleta.

## Testes e Debugging

### Usando Zoneless em `TestBed`

A função provider zoneless também pode ser usada com `TestBed` para ajudar
a garantir que os components sob teste sejam compatíveis com uma aplicação
Angular Zoneless.

```typescript
TestBed.configureTestingModule({
  providers: [provideZonelessChangeDetection()]
});

const fixture = TestBed.createComponent(MyComponent);
await fixture.whenStable();
```

Para garantir que os testes tenham o comportamento mais similar ao código de produção,
evite usar `fixture.detectChanges()` quando possível. Isso força
change detection a executar quando o Angular de outra forma pode não ter
agendado change detection. Os testes devem garantir que essas notificações
estão acontecendo e permitir que o Angular controle quando sincronizar
o estado em vez de forçá-lo manualmente a acontecer no teste.

Para suites de teste existentes, usar `fixture.detectChanges()` é um padrão comum
e provavelmente não vale o esforço de converter esses para
`await fixture.whenStable()`. `TestBed` ainda aplicará que o
component do fixture seja compatível com `OnPush` e lança `ExpressionChangedAfterItHasBeenCheckedError`
se encontrar que valores de template foram atualizados sem uma
notificação de mudança (ou seja, `fixture.componentInstance.someValue = 'newValue';`).
Se o component é usado em produção, este problema deve ser resolvido atualizando
o component para usar signals para estado ou chamar `ChangeDetectorRef.markForCheck()`.
Se o component é usado apenas como um wrapper de teste e nunca usado em uma aplicação,
é aceitável usar `fixture.changeDetectorRef.markForCheck()`.

### Verificação em modo debug para garantir que atualizações são detectadas

O Angular também fornece uma ferramenta adicional para ajudar a verificar que uma aplicação está fazendo
atualizações de estado de uma forma compatível com zoneless. `provideCheckNoChangesConfig({exhaustive: true, interval: <milliseconds>})`
pode ser usado para verificar periodicamente para garantir que nenhum binding foi atualizado
sem uma notificação. O Angular lança `ExpressionChangedAfterItHasBeenCheckedError`
se houver um binding atualizado que não teria sido atualizado pela change
detection zoneless.
