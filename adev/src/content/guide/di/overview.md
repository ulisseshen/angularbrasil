<!-- ia-translate: true -->
<docs-decorative-header title="Dependency injection no Angular" imgSrc="adev/src/assets/images/dependency_injection.svg"> <!-- markdownlint-disable-line -->

Dependency Injection (DI) é um padrão de design usado para organizar e compartilhar código através de uma aplicação.
</docs-decorative-header>

DICA: Confira os [Essenciais](essentials/dependency-injection) do Angular antes de mergulhar neste guia abrangente.

À medida que uma aplicação cresce, desenvolvedores frequentemente precisam reutilizar e compartilhar recursos em diferentes partes da base de código. [Dependency Injection (DI)](https://en.wikipedia.org/wiki/Dependency_injection) é um padrão de design usado para organizar e compartilhar código através de uma aplicação permitindo que você "injete" recursos em diferentes partes.

Dependency injection é um padrão popular porque permite que desenvolvedores abordem desafios comuns como:

- **Manutenibilidade de código melhorada**: Dependency injection permite separação mais limpa de responsabilidades, o que habilita refatoração mais fácil e reduz duplicação de código.
- **Escalabilidade**: Funcionalidade modular pode ser reutilizada através de múltiplos contextos e permite escalonamento mais fácil.
- **Melhor testabilidade**: DI permite que unit tests usem facilmente [test doubles](https://en.wikipedia.org/wiki/Test_double) para situações quando usar uma implementação real não é prático.

## Como funciona dependency injection no Angular?

Uma dependência é qualquer objeto, valor, função ou service que uma classe precisa para funcionar mas não cria por si mesma. Em outras palavras, ela cria uma relação entre diferentes partes da sua aplicação já que não funcionaria sem a dependência.

Há duas maneiras que o código interage com qualquer sistema de dependency injection:

- O código pode _fornecer_, ou tornar disponível, valores.
- O código pode _injetar_, ou pedir por, aqueles valores como dependências.

"Valores," neste contexto, podem ser qualquer valor JavaScript, incluindo objetos e funções. Tipos comuns de dependências injetadas incluem:

- **Valores de configuração**: Constantes específicas de ambiente, URLs de API, feature flags, etc.
- **Factories**: Funções que criam objetos ou valores baseados em condições de runtime
- **Services**: Classes que fornecem funcionalidade comum, lógica de negócio ou estado

Components e directives do Angular participam automaticamente de DI, significando que eles podem injetar dependências _e_ estão disponíveis para serem injetados.

## O que são services?

Um _service_ do Angular é uma classe TypeScript decorada com `@Injectable`, que torna uma instância da classe disponível para ser injetada como uma dependência. Services são a maneira mais comum de compartilhar dados e funcionalidade através de uma aplicação.

Tipos comuns de services incluem:

- **Clientes de dados:** Abstrai os detalhes de fazer requisições a um servidor para recuperação e mutação de dados
- **Gerenciamento de estado:** Define estado compartilhado através de múltiplos components ou páginas
- **Autenticação e autorização:** Gerencia autenticação de usuário, armazenamento de token e controle de acesso
- **Logging e tratamento de erros:** Estabelece uma API comum para logging ou comunicação de estados de erro ao usuário
- **Tratamento e dispatch de eventos:** Lida com eventos ou notificações que não estão associados a um component específico, ou para despachar eventos e notificações para components, seguindo o [padrão observer](https://en.wikipedia.org/wiki/Observer_pattern)
- **Funções utilitárias:** Oferece funções utilitárias reutilizáveis como formatação de dados, validação ou cálculos

O exemplo a seguir declara um service chamado `AnalyticsLogger`:

```ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AnalyticsLogger {
  trackEvent(category: string, value: string) {
    console.log('Analytics event logged:', {
      category,
      value,
      timestamp: new Date().toISOString()
    })
  }
}
```

NOTA: A opção `providedIn: 'root'` torna este service disponível em toda a sua aplicação como um singleton. Esta é a abordagem recomendada para a maioria dos services.

## Injetando dependências com `inject()`

Você pode injetar dependências usando a função `inject()` do Angular.

Aqui está um exemplo de uma barra de navegação que injeta `AnalyticsLogger` e o service `Router` do Angular para permitir que usuários naveguem para uma página diferente enquanto rastreiam o evento.

```angular-ts
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyticsLogger } from './analytics-logger';

@Component({
  selector: 'app-navbar',
  template: `
    <a href="#" (click)="navigateToDetail($event)">Detail Page</a>
  `,
})
export class NavbarComponent {
  private router = inject(Router);
  private analytics = inject(AnalyticsLogger);

  navigateToDetail(event: Event) {
    event.preventDefault();
    this.analytics.trackEvent('navigation', '/details');
    this.router.navigate(['/details']);
  }
}
```

### Onde `inject()` pode ser usado?

Você pode injetar dependências durante a construção de um component, directive ou service. A chamada para `inject` pode aparecer tanto no `constructor` quanto em um inicializador de campo. Aqui estão alguns exemplos comuns:

```ts
@Component({...})
export class MyComponent {
  // ✅ In class field initializer
  private service = inject(MyService);

  // ✅ In constructor body
  private anotherService: MyService;

  constructor() {
    this.anotherService = inject(MyService);
  }
}
```

```ts
@Directive({...})
export class MyDirective {
  // ✅ In class field initializer
  private element = inject(ElementRef);
}
```

```ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class MyService {
  // ✅ In a service
  private http = inject(HttpClient);
}
```

```ts
export const authGuard = () => {
  // ✅ In a route guard
  const auth = inject(AuthService);
  return auth.isAuthenticated();
}
```

O Angular usa o termo "contexto de injeção" para descrever qualquer lugar no seu código onde você pode chamar `inject`. Enquanto a construção de component, directive e service é o mais comum, veja [contextos de injeção](/guide/di/dependency-injection-context) para mais detalhes.

Para mais informações, veja a [documentação da API inject](api/core/inject#usage-notes).

## Próximos passos

Agora que você entende os fundamentos de dependency injection no Angular, você está pronto para aprender como criar seus próprios services.

O próximo guia, [Criando e usando services](guide/di/creating-and-using-services), mostrará a você:

- Como criar um service com o Angular CLI ou manualmente
- Como o padrão `providedIn: 'root'` funciona
- Como injetar services em components e outros services

Isso cobre o caso de uso mais comum para services em aplicações Angular.
