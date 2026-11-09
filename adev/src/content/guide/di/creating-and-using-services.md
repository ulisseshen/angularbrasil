<!-- ia-translate: true -->
# Criando e usando services

Services são trechos de código reutilizáveis que você pode compartilhar em toda a sua aplicação Angular. Você normalmente os usa para lidar com busca de dados, lógica de negócio ou outras funcionalidades que vários components precisam acessar.

## Criando um service {#creating-a-service}

Você pode criar um service usando o [Angular CLI](tools/cli) com o seguinte comando:

```bash
ng generate service CUSTOM_NAME
```

Esse comando cria um arquivo dedicado `CUSTOM_NAME.ts` no seu diretório `src`.

Você também pode criar manualmente um service adicionando o decorator `@Service()` a uma classe TypeScript. Isso informa ao Angular que a classe pode ser usada como uma dependência injetável.

O exemplo a seguir define um service que permite aos usuários adicionar e obter dados:

```ts {header: "src/app/basic-data-store.ts"}
import {Service} from '@angular/core';

@Service()
export class BasicDataStore {
  private data: string[] = [];

  addData(item: string): void {
    this.data.push(item);
  }

  getData(): string[] {
    return [...this.data];
  }
}
```

## Como services ficam disponíveis {#how-services-become-available}

Services são fornecidos no nível raiz por padrão. Quando um service é fornecido globalmente, o Angular garante três benefícios principais:

- **Instância singleton:** cria uma única instância compartilhada para toda a aplicação.
- **Disponibilidade global:** fica acessível automaticamente em qualquer lugar, sem registro manual de provider.
- **Tree-shakability:** garante que o service seja excluído do bundle final de produção caso o seu código nunca o utilize explicitamente.

### Usando o decorator `@Service` vs `@Injectable` {#using-the-service-vs-injectable-decorator}

O decorator `@Service` é um atalho moderno e ergonômico para a sintaxe tradicional `@Injectable({ providedIn: 'root' })`.

Use esta referência rápida para decidir qual decorator se encaixa no seu cenário:

| Recurso / Requisito                           | `@Service` | `@Injectable`                           |
| --------------------------------------------- | ---------- | --------------------------------------- |
| **Suporte à função `inject()`**               | Sim        | Sim                                     |
| **DI baseada em construtor**                  | ❌ Não     | Sim                                     |
| **Provider singleton raiz implícito**         | Sim        | ❌ Não (requer `{providedIn: 'root'}`)  |
| **Chaves de provider avançadas (`useClass`, etc.)** | ❌ Não | Sim                                 |
| **Factories de inicialização personalizadas** | Sim        | Sim                                     |
| **Escopos não raiz (`platform`, etc.)**       | ❌ Não     | Sim                                     |

### Substituindo a implementação com uma factory {#replacing-the-implementation-with-a-factory}

Se você precisar controlar como o singleton é criado, por exemplo, para trocar por outra implementação dependendo do ambiente, passe uma função `factory`.

A factory é executada em um [contexto de injeção](guide/di/dependency-injection-context), então você pode usar [`inject()`](api/core/inject) dentro dela para ler outras dependências.

O service `Analytics` a seguir não faz nada localmente, para que os eventos não poluam o console durante o desenvolvimento. Em produção, a factory lê um token `ANALYTICS_ENABLED` e retorna uma subclasse de `GoogleAnalytics` que encaminha os eventos para o rastreador real:

```ts {header: "src/app/analytics.ts"}
import {inject, InjectionToken, Service} from '@angular/core';
import {ANALYTICS_ENABLED} from './token';

@Service({
  factory: () => (inject(ANALYTICS_ENABLED) ? new GoogleAnalytics() : new Analytics()),
})
export class Analytics {
  track(event: string, payload?: Record<string, unknown>) {
    // Não faz nada por padrão.
  }
}

class GoogleAnalytics extends Analytics {
  override track(event: string, payload?: Record<string, unknown>) {
    // Envia um evento de analytics para o Google Analytics
  }
}
```

NOTE: A opção `factory` substitui as opções `useClass`, `useValue`, `useExisting` e `useFactory` de `@Injectable`. Se você precisar de alguma delas, continue usando `@Injectable`.

### Desativando o provisionamento automático {#opting-out-of-automatic-provisioning}

Por padrão, `@Service` fornece a classe no injector raiz. Se você quiser fornecê-la manualmente, por exemplo, para limitá-la a uma rota ou a um component específico, defina `autoProvided: false`:

```ts {header: "src/app/analytics-logger.ts"}
import {Service} from '@angular/core';

@Service({autoProvided: false})
export class AnalyticsLogger {
  trackEvent(name: string) {
    console.log('event:', name);
  }
}
```

Depois disso, você é responsável por adicionar o service a um array `providers`, assim como acontece com um `@Injectable()` simples:

### Quando usar `@Service` vs `@Injectable` {#when-to-use-service-vs-injectable}

Use `@Service` quando estiver criando uma nova classe singleton que usa `inject()` para as suas dependências. Continue usando `@Injectable` quando precisar de qualquer um dos itens a seguir:

- **Injeção de dependência baseada em construtor.** `@Service` suporta apenas a função [`inject()`](api/core/inject).
- **Configuração avançada de provider**, como `useClass`, `useValue`, `useExisting` ou `useFactory`. `@Service` expõe uma única opção `factory`.
- **Escopos não raiz**, como `providedIn: 'platform'`.

## Injetando um service {#injecting-a-service}

Depois de criar um service com `providedIn: 'root'`, você pode injetá-lo em qualquer lugar da aplicação usando a função `inject()` de `@angular/core`.

### Injetando em um component {#injecting-into-a-component}

```angular-ts
import {Component, inject} from '@angular/core';
import {BasicDataStore} from './basic-data-store';

@Component({
  selector: 'app-example',
  template: `
    <div>
      <p>{{ dataStore.getData() }}</p>
      <button (click)="dataStore.addData('More data')">Add more data</button>
    </div>
  `,
})
export class Example {
  dataStore = inject(BasicDataStore);
}
```

### Injetando em outro service {#injecting-into-another-service}

```ts
import {inject, Service} from '@angular/core';
import {AdvancedDataStore} from './advanced-data-store';

@Service()
export class BasicDataStore {
  private advancedDataStore = inject(AdvancedDataStore);
  private data: string[] = [];

  addData(item: string): void {
    this.data.push(item);
  }

  getData(): string[] {
    return [...this.data, ...this.advancedDataStore.getData()];
  }
}
```

## Próximos passos {#next-steps}

Embora `providedIn: 'root'` cubra a maioria dos casos de uso, o Angular também oferece formas adicionais de configurar services para cenários mais especializados:

- **Instâncias específicas de component** - Quando components precisam de suas próprias instâncias isoladas de service
- **Configuração manual** - Para services que exigem configuração em tempo de execução
- **Factory providers** - Para criação dinâmica de services com base em condições de tempo de execução
- **Value providers** - Para fornecer objetos de configuração ou constantes

Você pode aprender mais sobre esses padrões avançados no próximo guia: [definindo dependency providers](/guide/di/defining-dependency-providers).
