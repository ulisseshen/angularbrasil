<!-- ia-translate: true -->

# Angular sem ZoneJS (Zoneless)

## Por que usar Zoneless? {#why-use-zoneless}

As principais vantagens de remover o ZoneJS como dependência são:

- **Desempenho melhorado**: o ZoneJS usa eventos do DOM e tarefas assíncronas como indicadores de que o estado da aplicação _pode_ ter sido atualizado e, em seguida, aciona a sincronização da aplicação para executar a detecção de mudanças nas views da aplicação. O ZoneJS não tem nenhuma visão sobre se o estado da aplicação realmente mudou e, por isso, essa sincronização é acionada com mais frequência do que o necessário.
- **Core Web Vitals melhorados**: o ZoneJS traz uma quantidade considerável de overhead, tanto no tamanho do payload quanto no tempo de inicialização.
- **Experiência de debugging melhorada**: o ZoneJS torna a depuração de código mais difícil. Stack traces são mais difíceis de entender com o ZoneJS. Também é difícil entender quando o código quebra por estar fora da Angular Zone.
- **Melhor compatibilidade com o ecossistema**: o ZoneJS funciona por meio de patches nas APIs do navegador, mas não tem patches automáticos para toda nova API do navegador. Algumas APIs, como `async`/`await`, não podem ser corrigidas com patches de forma eficaz e precisam ser rebaixadas para funcionar com o ZoneJS. Às vezes, bibliotecas do ecossistema também são incompatíveis com a forma como o ZoneJS faz patches nas APIs nativas. Remover o ZoneJS como dependência garante uma compatibilidade melhor a longo prazo, eliminando uma fonte de complexidade, monkey patching e manutenção contínua.

## Habilitando Zoneless em uma aplicação {#enabling-zoneless-in-an-application}

Zoneless é o padrão no Angular v21+, então você não precisa fazer nada para habilitá-lo. Você deve verificar se o `provideZoneChangeDetection` não é usado em nenhum lugar para sobrescrever a configuração padrão.

Se você estiver usando o Angular v20, habilite a detecção de mudanças zoneless adicionando `provideZonelessChangeDetection()` na inicialização (bootstrap):

```ts {header: 'bootstrap standalone'}
bootstrapApplication(MyApp, {providers: [provideZonelessChangeDetection()]});
```

```ts {header: 'bootstrap com NgModule'}
platformBrowser().bootstrapModule(AppModule);

@NgModule({
  providers: [provideZonelessChangeDetection()],
})
export class AppModule {}
```

## Removendo o ZoneJS {#removing-zonejs}

Aplicações zoneless devem remover o ZoneJS completamente do build para reduzir o tamanho do bundle. O ZoneJS normalmente é carregado pela opção `polyfills` no `angular.json`, tanto no target `build` quanto no target `test`. Remova `zone.js` e `zone.js/testing` dos dois para retirá-lo do build. Projetos que usam um arquivo `polyfills.ts` explícito devem remover `import 'zone.js';` e `import 'zone.js/testing';` desse arquivo.

Depois de remover o ZoneJS do build, não há mais necessidade da dependência `zone.js`, e o pacote pode ser removido por completo:

```shell
npm uninstall zone.js
```

## Requisitos para compatibilidade com Zoneless {#requirements-for-zoneless-compatibility}

O Angular depende de notificações das APIs core para determinar quando executar a detecção de mudanças e em quais views.
Essas notificações incluem:

- `ChangeDetectorRef.markForCheck` (chamado automaticamente pelo `AsyncPipe`)
- `ComponentRef.setInput`
- Atualizar um signal que é lido em um template
- Callbacks de listeners de host ou de template vinculados
- Anexar uma view que foi marcada como dirty por algum dos itens acima

### Components compatíveis com `OnPush` {#onpush-compatible-components}

Uma forma de garantir que um component esteja usando os mecanismos de notificação corretos mencionados acima é
usar a [ChangeDetectionStrategy.OnPush](/best-practices/skipping-subtrees#using-onpush).

A estratégia de detecção de mudanças `OnPush` não é obrigatória, mas é um passo recomendado em direção à compatibilidade com zoneless para components de aplicação. Nem sempre é possível para components de biblioteca usar `ChangeDetectionStrategy.OnPush`.
Quando um component de biblioteca é host de user components que podem usar `ChangeDetectionStrategy.Eager`/`Default`, ele não pode usar `OnPush`, pois isso impediria a atualização do component filho caso ele não seja compatível com `OnPush` e dependa do ZoneJS para acionar a detecção de mudanças. Components podem usar a estratégia `Default` desde que notifiquem o Angular quando a detecção de mudanças precisar ser executada (chamando `markForCheck`, usando signals, `AsyncPipe` etc.).
Ser host de um user component significa usar uma API como `ViewContainerRef.createComponent`, e não apenas hospedar uma parte do template de um user component (ou seja, projeção de conteúdo ou usar um input de template ref).

### Remova `NgZone.onMicrotaskEmpty`, `NgZone.onUnstable`, `NgZone.isStable` ou `NgZone.onStable` {#remove-ngzoneonmicrotaskempty-ngzoneonunstable-ngzoneisstable-or-ngzoneonstable}

Aplicações e bibliotecas precisam remover o uso de `NgZone.onMicrotaskEmpty`, `NgZone.onUnstable` e `NgZone.onStable`.
Esses observables nunca emitirão valores quando uma aplicação habilitar a detecção de mudanças zoneless.
Da mesma forma, `NgZone.isStable` sempre será `true` e não deve ser usado como condição para a execução de código.

Os observables `NgZone.onMicrotaskEmpty` e `NgZone.onStable` são mais frequentemente usados para esperar que o Angular
conclua a detecção de mudanças antes de executar uma tarefa. Em vez disso, eles podem ser substituídos por `afterNextRender`
se precisarem esperar por uma única detecção de mudanças, ou por `afterEveryRender` se houver alguma condição que possa abranger
várias rodadas de detecção de mudanças. Em outros casos, esses observables foram usados simplesmente porque eram
familiares e tinham um timing semelhante ao necessário. APIs de DOM mais simples e diretas podem ser usadas no lugar,
como o `MutationObserver`, quando o código precisa esperar por um certo estado do DOM (em vez de esperar por ele indiretamente
por meio dos hooks de renderização do Angular).

<docs-callout title="NgZone.run e NgZone.runOutsideAngular são compatíveis com Zoneless">
`NgZone.run` e `NgZone.runOutsideAngular` não precisam ser removidos para que o código seja compatível com
aplicações zoneless. Na verdade, remover essas chamadas pode levar a regressões de desempenho em bibliotecas que
são usadas em aplicações que ainda dependem do ZoneJS.
</docs-callout>

### `PendingTasks` para Server Side Rendering (SSR) {#pendingtasks-for-server-side-rendering-ssr}

Se você usa SSR com Angular, talvez saiba que ele depende do ZoneJS para ajudar a determinar quando a aplicação
está "estável" e pode ser serializada. Se houver tarefas assíncronas que devem impedir a serialização, uma aplicação
que não usa o ZoneJS deve tornar o Angular ciente delas por meio do service [PendingTasks](/api/core/PendingTasks). A serialização
aguardará o primeiro momento em que todas as tarefas pendentes tiverem sido removidas.

Os dois usos mais diretos de pending tasks são o método `run`:

```typescript
const taskService = inject(PendingTasks);
taskService.run(async () => {
  const someResult = await doSomeWorkThatNeedsToBeRendered();
  this.someState.set(someResult);
});
```

Para casos de uso mais complexos, você pode adicionar e remover manualmente uma pending task:

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

Além disso, o helper [pendingUntilEvent](/api/core/rxjs-interop/pendingUntilEvent) do `rxjs-interop` garante
que a aplicação permaneça instável até que o observable emita, complete, gere um erro ou seja descadastrado (unsubscribed).

```typescript
readonly myObservableState = someObservable.pipe(pendingUntilEvent());
```

O framework também usa este service internamente para impedir a serialização até que as tarefas assíncronas sejam concluídas. Isso inclui, entre outros, uma navegação de Router em andamento e uma requisição `HttpClient` incompleta.

### Formulários reativos em aplicações zoneless {#reactive-forms-in-zoneless-applications}

As atualizações de modelo de formulários reativos (`setValue`, `patchValue`, `FormArray.push` e APIs semelhantes) atualizam o estado do formulário e emitem os observables do formulário, mas não agendam automaticamente a detecção de mudanças do component.

Se um template depende do estado de formulários reativos, conecte os observables do formulário a uma notificação de detecção de mudanças (por exemplo, `ChangeDetectorRef.markForCheck()`), ou reflita os dados por meio de signals consumidos pelo template.

## Testes e depuração {#testing-and-debugging}

### Usando Zoneless no `TestBed` {#using-zoneless-in-testbed}

O `TestBed` usa a detecção de mudanças zoneless por padrão, mesmo quando o `zone.js` é carregado pelos `polyfills`.

Para usar a detecção de mudanças baseada em Zone em um teste, adicione `provideZoneChangeDetection()` aos providers do `TestBed`. Adicionar `provideZonelessChangeDetection()` é opcional:

```typescript
TestBed.configureTestingModule({
  // Opcional: inclua o provider para forçar o ambiente de teste
  // a usar o mesmo comportamento zoneless de uma aplicação zoneless.
  providers: [provideZonelessChangeDetection()],
});

const fixture = TestBed.createComponent(MyComponent);
await fixture.whenStable();
```

Para garantir que os testes tenham o comportamento mais parecido possível com o código de produção,
evite usar `fixture.detectChanges()` sempre que possível. Isso força
a execução da detecção de mudanças quando o Angular, de outra forma, talvez não tivesse
agendado a detecção de mudanças. Os testes devem garantir que essas notificações
estão acontecendo e deixar que o Angular decida quando sincronizar
o estado, em vez de forçar isso manualmente no teste.

Para suítes de teste existentes, usar `fixture.detectChanges()` é um padrão comum,
e provavelmente não vale o esforço de converter tudo para
`await fixture.whenStable()`. O `TestBed` ainda vai exigir que o
component do fixture seja compatível com `OnPush` e lançará `ExpressionChangedAfterItHasBeenCheckedError`
se encontrar valores do template atualizados sem uma
notificação de mudança (por exemplo, `fixture.componentInstance.someValue = 'newValue';`).
Se o component for usado em produção, esse problema deve ser resolvido atualizando
o component para usar signals no estado ou chamando `ChangeDetectorRef.markForCheck()`.
Se o component for usado apenas como wrapper de teste e nunca em uma aplicação,
é aceitável usar `ChangeDetectionStrategy.Eager` nele e chamar `fixture.changeDetectorRef.markForCheck()`.

IMPORTANT: O `fixture.changeDetectorRef` pertence à view host do fixture, então o seu `markForCheck()`
não atualiza o template de um component `OnPush`. Os components da sua aplicação não devem precisar dele
nos testes. Se um teste precisar dele, normalmente o component não é totalmente reativo ou não é
[compatível com zoneless](#requirements-for-zoneless-compatibility).

### Verificação em modo debug para garantir que as atualizações sejam detectadas {#debug-mode-check-to-ensure-updates-are-detected}

IMPORTANT: O `provideCheckNoChangesConfig` está em [developer preview](reference/releases#developer-preview).

O Angular também oferece uma ferramenta adicional para ajudar a verificar se uma aplicação está fazendo
atualizações de estado de forma compatível com zoneless. `provideCheckNoChangesConfig({exhaustive: true, interval: <milliseconds>})`
pode ser usado para verificar periodicamente se nenhum binding foi atualizado
sem uma notificação. O Angular lança `ExpressionChangedAfterItHasBeenCheckedError`
se houver um binding atualizado que não seria atualizado pela detecção de mudanças zoneless.
