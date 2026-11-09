<!-- ia-translate: true -->
# Lazy loading de services

IMPORTANT: Para que o lazy loading funcione, o service que você carrega precisa ser provido automaticamente. Decore-o com `@Injectable({providedIn: 'root'})` ou com [`@Service()`](guide/di/creating-and-using-services#using-the-service-vs-injectable-decorator). Sem o provimento automático, o Angular não tem como construir o service depois que ele é carregado.

A função `injectAsync` do Angular permite carregar um service sob demanda, somente quando ele realmente é necessário. Isso é útil quando um service depende de uma biblioteca grande ou de um recurso pouco usado, e você não quer pagar por ele no carregamento inicial da página.

Quando você usa `injectAsync`, o código do service é separado pelo seu bundler em um chunk JavaScript próprio, que é baixado na primeira vez que você pede a instância. Depois de carregado, o Angular resolve o service pelo sistema de DI normal, então ele ainda pode depender de outros injectables e se comporta como qualquer outro singleton.

## Injetando um service de forma preguiçosa {#lazily-injecting-a-service}

Imagine um `ReportExporter` que depende de uma biblioteca pesada de planilhas. A maioria dos usuários abre o relatório; apenas alguns clicam em **Export**. Carregue o exportador sob demanda:

```angular-ts
import {Component, injectAsync} from '@angular/core';

@Component({
  selector: 'app-report',
  template: `<button (click)="export()">Export</button>`,
})
export class Report {
  private exporter = injectAsync(() => import('./report-exporter').then((m) => m.ReportExporter));

  async export() {
    const exporter = await this.exporter();
    exporter.export();
  }
}
```

A primeira chamada a `this.exporter()` dispara o import dinâmico e resolve o service a partir do DI. As chamadas seguintes reutilizam a mesma promise, então o chunk é buscado apenas uma vez.

Se o service carregado de forma preguiçosa for o [export default](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_the_default_export), passe o import dinâmico diretamente, e o Angular desembrulha o `default` para você:

```ts {header: "report-exporter.ts"}
@Service()
export default class ReportExporter {
  /* … */
}
```

```ts {header: "report.ts"}
private exporter = injectAsync(() => import('./report-exporter'));
```

## Pré-carregando a dependência {#prefetching-the-dependency}

Por padrão, o chunk preguiçoso só é buscado quando você invoca a função retornada. Você pode iniciar o download mais cedo passando um gatilho de `prefetch` nas opções. Um gatilho é qualquer função que retorna uma `Promise`; quando ela é resolvida, o Angular inicia o loader.

O Angular traz o `onIdle`, um gatilho embutido que espera até que o navegador fique ocioso:

```ts
import {Component, injectAsync, onIdle} from '@angular/core';

@Component({/* … */})
export class Report {
  private exporter = injectAsync(() => import('./report-exporter').then((m) => m.ReportExporter), {
    prefetch: onIdle,
  });
}
```

Você também pode configurar o `onIdle` com um tempo máximo de espera, para que o pré-carregamento sempre aconteça dentro de uma janela conhecida, mesmo em páginas ocupadas:

```ts
injectAsync(loader, {prefetch: () => onIdle({timeout: 1_000})});
```

NOTE: O pré-carregamento é oportunista. Se o usuário acionar o recurso antes de o pré-carregamento disparar, o Angular ainda carrega a dependência imediatamente e resolve o seu `await` assim que ela estiver pronta.

## Fornecendo um gatilho de pré-carregamento personalizado {#provide-a-custom-prefetch-trigger}

Um `PrefetchTrigger` é apenas uma função que retorna uma promise; o loader roda assim que a promise é resolvida. Use isso para alinhar o pré-carregamento com os seus próprios sinais, como um hover ou um tick de um scheduler:

```ts
import {PrefetchTrigger} from '@angular/core';

export function onHover(target: HTMLElement): PrefetchTrigger {
  return () =>
    new Promise<void>((resolve) => {
      target.addEventListener('pointerenter', () => resolve(), {once: true});
    });
}
```
