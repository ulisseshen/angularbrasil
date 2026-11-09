<!-- ia-translate: true -->
<docs-decorative-header title="Injeção de dependência no Angular" imgSrc="adev/src/assets/images/dependency_injection.svg"> <!-- markdownlint-disable-line -->

Dependency Injection (DI) é um padrão de design que você usa para organizar e compartilhar código através da sua aplicação, fornecendo dependências a uma classe em vez de criá-las dentro dela.
</docs-decorative-header>

TIP: Confira os [Essenciais](essentials/dependency-injection) do Angular antes de mergulhar neste guia abrangente.

À medida que uma aplicação cresce, desenvolvedores frequentemente precisam reutilizar e compartilhar funcionalidades entre diferentes partes da base de código. [Dependency Injection (DI)](https://en.wikipedia.org/wiki/Dependency_injection) ajuda você a conseguir isso permitindo fornecer dependências a uma classe em vez de criá-las diretamente dentro dela. Isso torna as diferentes partes da aplicação mais reutilizáveis e mais fáceis de gerenciar.

Injeção de dependência é um padrão popular porque permite que desenvolvedores lidem com desafios comuns, como:

- **Melhor manutenibilidade do código**: A injeção de dependência promove uma separação clara de responsabilidades, tornando o código mais fácil de refatorar e reduzindo duplicação.
- **Escalabilidade**: Você pode reutilizar funcionalidades modulares em diferentes partes de uma aplicação, tornando-a mais fácil de escalar.
- **Melhores testes**: A DI permite que testes unitários usem [test doubles](https://en.wikipedia.org/wiki/Test_double) no lugar de implementações reais quando necessário.

## Como a injeção de dependência funciona no Angular? {#how-does-dependency-injection-work-in-angular}

Uma dependência é qualquer objeto, valor, função ou service que uma classe precisa para funcionar, mas que ela não cria por conta própria. Em vez disso, você a fornece de fora, criando uma relação clara entre diferentes partes da aplicação.

Você interage com um sistema de injeção de dependência de duas maneiras principais:

- Você pode _fornecer_, ou disponibilizar, valores.
- Você pode _injetar_, ou pedir, esses valores como dependências.

Neste contexto, "valores" podem se referir a qualquer valor JavaScript, incluindo objetos, funções ou instâncias de classes. Tipos comuns de dependências injetadas incluem:

- **Valores de configuração**: Constantes específicas de ambiente, URLs de API, feature flags, etc.
- **Factories**: Funções que criam objetos ou valores com base em condições de tempo de execução
- **Services**: Classes que fornecem funcionalidades comuns, lógica de negócio ou estado

Components e directives do Angular participam automaticamente da DI, o que significa que você pode injetar dependências neles e também torná-los disponíveis para injeção.

## O que são services? {#what-are-services}

Um _service_ do Angular é uma classe TypeScript decorada com `@Service`, que permite injetar uma instância da classe como dependência. Services são a forma mais comum de compartilhar dados e funcionalidades em uma aplicação.

Tipos comuns de services incluem:

- **Clientes de dados:** Abstraem os detalhes de fazer requisições a um servidor para buscar e alterar dados
- **Gerenciamento de estado:** Define o estado compartilhado entre vários components ou páginas
- **Autenticação e autorização:** Gerencia a autenticação do usuário, o armazenamento de tokens e o controle de acesso
- **Logging e tratamento de erros:** Estabelece uma API comum para registrar logs ou comunicar estados de erro ao usuário
- **Tratamento e despacho de eventos:** Lida com eventos ou notificações que não estão associados a um component específico, ou despacha eventos e notificações para components, seguindo o [padrão observer](https://en.wikipedia.org/wiki/Observer_pattern)
- **Funções utilitárias:** Oferece funções utilitárias reutilizáveis, como formatação de dados, validação ou cálculos

O exemplo a seguir declara um service chamado `AnalyticsLogger`:

```ts
import {Service} from '@angular/core';

@Service()
export class AnalyticsLogger {
  trackEvent(category: string, value: string) {
    console.log('Analytics event logged:', {
      category,
      value,
      timestamp: new Date().toISOString(),
    });
  }
}
```

NOTE: O `@Service` torna este service disponível em toda a sua aplicação como um singleton. Esta é a abordagem recomendada para a maioria dos services.

HELPFUL: O decorator [`@Service`](guide/di/creating-and-using-services#using-the-service-vs-injectable-decorator) é um atalho ergonômico para `@Injectable({providedIn: 'root'})`.

## Injetando dependências com `inject()` {#injecting-dependencies-with-inject}

Você pode injetar dependências usando a função `inject()` do Angular.

Aqui está um exemplo de uma barra de navegação que injeta `AnalyticsLogger` e o service `Router` do Angular, para permitir que os usuários naveguem até outra página enquanto o evento é registrado.

```angular-ts
import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {AnalyticsLogger} from './analytics-logger';

@Component({
  selector: 'app-navbar',
  template: `<a href="#" (click)="navigateToDetail($event)">Detail Page</a>`,
})
export class Navbar {
  private router = inject(Router);
  private analytics = inject(AnalyticsLogger);

  navigateToDetail(event: Event) {
    event.preventDefault();
    this.analytics.trackEvent('navigation', '/details');
    this.router.navigate(['/details']);
  }
}
```

### Onde `inject()` pode ser usado? {#where-can-inject-be-used}

Você pode injetar dependências durante a construção de um component, directive ou service. A chamada a [`inject`](/api/core/inject) pode aparecer tanto no `constructor` quanto em um inicializador de campo. Aqui estão alguns exemplos comuns:

```ts
@Component(/* ... */)
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
import {Service, inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Service()
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
};
```

O Angular usa o termo "contexto de injeção" para descrever qualquer lugar do seu código onde você pode chamar [`inject`](/api/core/inject). Embora a construção de components, directives e services seja o caso mais comum, veja [contextos de injeção](/guide/di/dependency-injection-context) para mais detalhes.

Para mais informações, veja a [documentação da API de inject](api/core/inject#usage-notes).

## Próximos passos {#next-steps}

Agora que você entende os fundamentos da injeção de dependência no Angular, está pronto para aprender como criar os seus próprios services.

O próximo guia, [Criando e usando services](guide/di/creating-and-using-services), vai mostrar:

- Como criar um service com o Angular CLI ou manualmente
- Como funciona o padrão `providedIn: 'root'`
- Como injetar services em components e em outros services

Isso cobre o caso de uso mais comum de services em aplicações Angular.
