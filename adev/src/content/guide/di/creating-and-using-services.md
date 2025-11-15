<!-- ia-translate: true -->
# Criando e usando services

Services são pedaços de código reutilizáveis que podem ser compartilhados em toda a sua aplicação Angular. Eles tipicamente lidam com busca de dados, lógica de negócio, ou outra funcionalidade que múltiplos components precisam acessar.

## Criando um service

Você pode criar um service com o [Angular CLI](tools/cli) com o seguinte comando:

```bash
ng generate service CUSTOM_NAME
```

Isso cria um arquivo dedicado `CUSTOM_NAME.ts` no seu diretório `src`.

Você também pode criar manualmente um service adicionando o decorator `@Injectable()` a uma classe TypeScript. Isso informa ao Angular que o service pode ser injetado como uma dependência.

Aqui está um exemplo de um service que permite aos usuários adicionar e requisitar dados:

```ts
// 📄 src/app/basic-data-store.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BasicDataStore {
  private data: string[] = []

  addData(item: string): void {
   this.data.push(item)
  }

  getData(): string[] {
    return [...this.data]
  }
}
```

## Como services se tornam disponíveis

Quando você usa `@Injectable({ providedIn: 'root' })` no seu service, o Angular:

- **Cria uma única instância** (singleton) para toda a sua aplicação
- **Torna disponível em todos os lugares** sem nenhuma configuração adicional
- **Habilita tree-shaking** para que o service seja incluído apenas no seu bundle JavaScript se for realmente usado

Esta é a abordagem recomendada para a maioria dos services.

## Injetando um service

Uma vez que você criou um service com `providedIn: 'root'`, você pode injetá-lo em qualquer lugar da sua aplicação usando a função `inject()` de `@angular/core`.

### Injetando em um component

```angular-ts
import { Component, inject } from '@angular/core';
import { BasicDataStore } from './basic-data-store';

@Component({
  selector: 'app-example',
  template: `
    <div>
      <p>{{ dataStore.getData() }}</p>
      <button (click)="dataStore.addData('More data')">
        Add more data
      </button>
    </div>
  `
})
export class ExampleComponent {
  dataStore = inject(BasicDataStore);
}
```

### Injetando em outro service

```ts
import { inject, Injectable } from '@angular/core';
import { AdvancedDataStore } from './advanced-data-store';

@Injectable({
  providedIn: 'root',
})
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

## Próximos passos

Enquanto `providedIn: 'root'` cobre a maioria dos casos de uso, o Angular oferece formas adicionais de prover services para cenários especializados:

- **Instâncias específicas de component** - Quando components precisam de suas próprias instâncias isoladas de service
- **Configuração manual** - Para services que requerem configuração em tempo de execução
- **Factory providers** - Para criação dinâmica de service baseada em condições de tempo de execução
- **Value providers** - Para prover objetos de configuração ou constantes

Você pode aprender mais sobre esses padrões avançados no próximo guia: [definindo dependency providers](/guide/di/defining-dependency-providers).
