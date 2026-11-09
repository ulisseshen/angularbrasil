<!-- ia-translate: true -->

# Depuração e solução de problemas de injeção de dependência {#debugging-and-troubleshooting-dependency-injection}

Problemas de injeção de dependência (DI) normalmente surgem de erros de configuração, problemas de escopo ou padrões de uso incorretos. Este guia ajuda você a identificar e resolver os problemas comuns de DI que os desenvolvedores encontram.

## Armadilhas comuns e soluções {#common-pitfalls-and-solutions}

### Services não disponíveis onde se espera {#services-not-available-where-expected}

Um dos problemas de DI mais comuns acontece quando você tenta injetar um service, mas o Angular não consegue encontrá-lo no injector atual nem em nenhum injector pai. Isso geralmente acontece quando o service é fornecido no escopo errado ou não é fornecido de forma alguma.

#### Incompatibilidade de escopo do provider {#provider-scope-mismatch}

Quando você fornece um service no array `providers` de um component, o Angular cria uma instância no injector desse component. Essa instância fica disponível apenas para esse component e para os seus filhos. Components pais e components irmãos não conseguem acessá-la, porque usam injectors diferentes.

```angular-ts {header: 'child-view.ts'}
import {Component} from '@angular/core';
import {DataStore} from './data-store';

@Component({
  selector: 'app-child',
  template: '<p>Child</p>',
  providers: [DataStore], // Disponível apenas neste component e nos seus filhos
})
export class ChildView {}
```

```angular-ts {header: 'parent-view.ts'}
import {Component, inject} from '@angular/core';
import {DataStore} from './data-store';

@Component({
  selector: 'app-parent',
  template: '<app-child />',
})
export class ParentView {
  private dataService = inject(DataStore); // ERRO: não disponível para o pai
}
```

O Angular procura apenas para cima na hierarquia, nunca para baixo. Components pais não podem acessar services fornecidos em components filhos.

**Solução:** forneça o service em um nível superior (aplicação ou component pai).

```ts {prefer}
import {Service} from '@angular/core';

@Service()
export class DataStore {
  // Disponível em qualquer lugar
}
```

TIP: `@Service` torna os services disponíveis em qualquer lugar e habilita o tree-shaking. Se você não quiser que ele seja escopado para a aplicação inteira, especifique `autoProvided: false`.

#### Services e routes lazy-loaded {#services-and-lazy-loaded-routes}

Quando você fornece um service no array `providers` de uma route lazy-loaded, o Angular cria um injector filho para essa route. Esse injector e seus services só ficam disponíveis depois que a route é carregada. Components das partes eager da aplicação não conseguem acessar esses services, porque usam injectors diferentes que já existem antes de o injector lazy ser criado.

```ts {header: 'feature.routes.ts'}
import {Routes} from '@angular/router';
import {FeatureClient} from './feature-client';

export const featureRoutes: Routes = [
  {
    path: 'feature',
    providers: [FeatureClient],
    loadComponent: () => import('./feature-view'),
  },
];
```

```angular-ts {header: 'eager-view.ts'}
import {Component, inject} from '@angular/core';
import {FeatureClient} from './feature-client';

@Component({
  selector: 'app-eager',
  template: '<p>Eager Component</p>',
})
export class EagerView {
  private featureService = inject(FeatureClient); // ERRO: ainda não disponível
}
```

Routes lazy-loaded criam injectors filhos que só ficam disponíveis depois que a route é carregada.

NOTE: Por padrão, os injectors de route e os seus services persistem mesmo depois que você navega para fora da route. Eles só são destruídos quando a aplicação é fechada. Para a limpeza automática de injectors de routes não utilizados, veja [personalizando o comportamento de routes](guide/routing/customizing-route-behavior#automatic-cleanup-of-unused-route-injectors).

**Solução:** use `@Service` para services que precisam ser compartilhados entre limites lazy.

```ts {prefer, header: 'Fornecer na raiz para services compartilhados'}
import {Service} from '@angular/core';

@Service()
export class FeatureClient {
  // Disponível em qualquer lugar, inclusive antes do lazy load
}
```

Se o service deve ser lazy-loaded, mas ainda assim estar disponível para components eager, injete-o somente onde for necessário e use injeção opcional para lidar com a disponibilidade.

### Múltiplas instâncias em vez de singletons {#multiple-instances-instead-of-singletons}

Você espera uma única instância compartilhada (singleton), mas recebe instâncias separadas em components diferentes.

#### Fornecer no component em vez da raiz {#providing-in-component-instead-of-root}

Quando você adiciona um service ao array `providers` de um component, o Angular cria uma nova instância desse service para cada instância do component. Cada component tem sua própria instância separada do service, o que significa que mudanças em um component não afetam a instância do service nos outros components. Isso costuma ser inesperado quando você quer um estado compartilhado em toda a aplicação.

```angular-ts {avoid, header: 'Provider no component cria múltiplas instâncias'}
import {Component, inject} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-profile',
  template: '<p>Profile</p>',
  providers: [UserClient], // Cria uma nova instância por component!
})
export class UserProfile {
  private userService = inject(UserClient);
}

@Component({
  selector: 'app-settings',
  template: '<p>Settings</p>',
  providers: [UserClient], // Instância diferente!
})
export class UserSettings {
  private userService = inject(UserClient);
}
```

Cada component tem sua própria instância de `UserClient`. Mudanças em um deles não afetam o outro.

**Solução:** use `@Service` para singletons.

```ts {prefer, header: 'Singleton no nível da raiz'}
import {Service} from '@angular/core';

@Service()
export class UserClient {
  // Instância única compartilhada por todos os components
}
```

#### Quando múltiplas instâncias são intencionais {#when-multiple-instances-are-intentional}

Às vezes você quer uma instância separada por component, para um estado específico do component.

```angular-ts {header: 'Intencional: estado com escopo de component'}
import {Injectable, signal, Component, inject} from '@angular/core';

@Injectable() // Sem providedIn - precisa ser fornecido explicitamente
export class FormStateStore {
  private formData = signal({});

  setData(data: any) {
    this.formData.set(data);
  }

  getData() {
    return this.formData();
  }
}

@Component({
  selector: 'app-user-form',
  template: '<form>...</form>',
  providers: [FormStateStore], // Cada formulário tem seu próprio estado
})
export class UserForm {
  private formState = inject(FormStateStore);
}
```

Esse padrão é útil para:

- Gerenciamento de estado de formulário (cada formulário tem um estado isolado)
- Cache específico de component
- Dados temporários que não devem ser compartilhados

### Uso incorreto de inject() {#incorrect-inject-usage}

A função `inject()` só funciona em contextos específicos, durante a construção da classe e a execução de factories.

#### Usando inject() em hooks do ciclo de vida {#using-inject-in-lifecycle-hooks}

Quando você chama `inject()` dentro de hooks do ciclo de vida como `ngOnInit()`, `ngAfterViewInit()` ou `ngOnDestroy()`, o Angular lança um erro, porque esses métodos rodam fora do contexto de injeção. O contexto de injeção só está disponível durante a execução síncrona da construção da classe, que acontece antes de os hooks do ciclo de vida serem chamados.

```angular-ts {avoid, header: 'inject() em ngOnInit'}
import {Component, inject} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-profile',
  template: '<p>User: {{userName}}</p>',
})
export class UserProfile {
  userName = '';

  ngOnInit() {
    const userService = inject(UserClient); // ERRO: não é um contexto de injeção
    this.userName = userService.getUser().name;
  }
}
```

**Solução:** capture as dependências e derive valores nos inicializadores de campo.

```angular-ts {prefer, header: 'Derivar valores nos inicializadores de campo'}
import {Component, inject} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-profile',
  template: '<p>User: {{userName}}</p>',
})
export class UserProfile {
  private userService = inject(UserClient);
  userName = this.userService.getUser().name;
}
```

#### Usando o Injector para injeção adiada {#using-the-injector-for-deferred-injection}

Quando você precisa obter services fora de um contexto de injeção, use o `Injector` capturado diretamente com `injector.get()`:

```angular-ts
import {Component, inject, Injector} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-profile',
  template: '<button (click)="delayedLoad()">Load Later</button>',
})
export class UserProfile {
  private injector = inject(Injector);

  delayedLoad() {
    setTimeout(() => {
      const userService = this.injector.get(UserClient);
      console.log(userService.getUser());
    }, 1000);
  }
}
```

#### Usando runInInjectionContext para callbacks {#using-runininjectioncontext-for-callbacks}

Use `runInInjectionContext()` quando precisar permitir que **outro código** chame `inject()`. Isso é útil ao aceitar callbacks que podem usar injeção de dependência:

```angular-ts
import {Component, inject, Injector, input, runInInjectionContext} from '@angular/core';

@Component({
  selector: 'app-data-loader',
  template: '<button (click)="load()">Load</button>',
})
export class DataLoader {
  private injector = inject(Injector);
  onLoad = input<() => void>();

  load() {
    const callback = this.onLoad();
    if (callback) {
      // Permite que o callback use inject()
      runInInjectionContext(this.injector, callback);
    }
  }
}
```

A função `runInInjectionContext()` cria um contexto de injeção temporário, permitindo que o código dentro do callback chame `inject()`.

IMPORTANT: Sempre capture as dependências no nível da classe quando possível. Use `injector.get()` para uma recuperação adiada simples, e `runInInjectionContext()` somente quando código externo precisar chamar `inject()`.

TIP: Use `assertInInjectionContext()` para verificar se o seu código está rodando em um contexto de injeção válido. Isso é útil ao criar funções reutilizáveis que chamam `inject()`. Veja [Verificando o contexto](guide/di/dependency-injection-context#asserts-the-context) para mais detalhes.

### Confusão entre providers e viewProviders {#providers-vs-viewproviders-confusion}

A diferença entre `providers` e `viewProviders` afeta cenários de projeção de conteúdo.

#### Entendendo a diferença {#understanding-the-difference}

**providers:** disponível para o template do component E para qualquer conteúdo projetado nele (ng-content).

**viewProviders:** disponível apenas para o template do component, NÃO para o conteúdo projetado.

```angular-ts {header: 'parent-view.ts'}
import {Component, inject} from '@angular/core';
import {ThemeStore} from './theme-store';

@Component({
  selector: 'app-parent',
  template: `
    <div>
      <p>Theme: {{ themeService.theme() }}</p>
      <ng-content />
    </div>
  `,
  providers: [ThemeStore], // Disponível para os filhos projetados
})
export class ParentView {
  protected themeService = inject(ThemeStore);
}

@Component({
  selector: 'app-parent-view',
  template: `
    <div>
      <p>Theme: {{ themeService.theme() }}</p>
      <ng-content />
    </div>
  `,
  viewProviders: [ThemeStore], // NÃO disponível para os filhos projetados
})
export class ParentViewOnly {
  protected themeService = inject(ThemeStore);
}
```

```angular-ts {header: 'child-view.ts'}
import {Component, inject} from '@angular/core';
import {ThemeStore} from './theme-store';

@Component({
  selector: 'app-child',
  template: '<p>Child theme: {{theme()}}</p>',
})
export class ChildView {
  private themeService = inject(ThemeStore, {optional: true});
  theme = () => this.themeService?.theme() ?? 'none';
}
```

```angular-ts {header: 'app.ts'}
@Component({
  selector: 'app-root',
  template: `
    <app-parent>
      <app-child />
      <!-- Pode acessar ThemeStore -->
    </app-parent>

    <app-parent-view>
      <app-child />
      <!-- Não pode acessar ThemeStore -->
    </app-parent-view>
  `,
})
export class App {}
```

**Quando projetado em `app-parent`:** o component filho pode injetar `ThemeStore`, porque `providers` o disponibiliza para o conteúdo projetado.

**Quando projetado em `app-parent-view`:** o component filho não pode injetar `ThemeStore`, porque `viewProviders` restringe o service ao template do pai.

#### Escolhendo entre providers e viewProviders {#choosing-between-providers-and-viewproviders}

Use `providers` quando:

- O service deve estar disponível para o conteúdo projetado
- Você quer que os filhos projetados acessem o service
- Você está fornecendo services de propósito geral

Use `viewProviders` quando:

- O service deve estar disponível somente para o template do seu component
- Você quer esconder detalhes de implementação do conteúdo projetado
- Você está fornecendo services internos que não devem vazar

**Recomendação padrão:** use `providers`, a menos que você tenha um motivo específico para restringir o acesso com `viewProviders`.

### Problemas com InjectionToken {#injectiontoken-issues}

Ao usar `InjectionToken` para dependências que não são classes, os desenvolvedores costumam encontrar problemas relacionados à identidade do token, à segurança de tipos e à configuração de providers. Esses problemas geralmente vêm de como o JavaScript trata a identidade de objetos e de como o TypeScript infere tipos.

#### Confusão de identidade de token {#token-identity-confusion}

Quando você cria uma nova instância de `InjectionToken`, o JavaScript cria um objeto único na memória. Mesmo que você crie outro `InjectionToken` com exatamente a mesma string de descrição, trata-se de um objeto completamente diferente. O Angular usa a identidade do objeto do token (e não a sua descrição) para associar providers aos pontos de injeção, então tokens com a mesma descrição, mas identidades de objeto diferentes, não conseguem acessar os valores uns dos outros.

```ts {header: 'config.token.ts'}
import {InjectionToken} from '@angular/core';

export interface AppConfig {
  apiUrl: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app config');
```

```ts {header: 'app.config.ts'}
import {bootstrapApplication} from '@angular/platform-browser';
import {APP_CONFIG} from './config.token';

export const appConfig: AppConfig = {
  apiUrl: 'https://api.example.com',
};

bootstrapApplication(App, {
  providers: [{provide: APP_CONFIG, useValue: appConfig}],
});
```

```angular-ts {avoid, header: 'feature-view.ts'}
// Cria um novo token com a mesma descrição
import {InjectionToken, inject, Component} from '@angular/core';
import {AppConfig} from './config.token';

const APP_CONFIG = new InjectionToken<AppConfig>('app config');

@Component({
  selector: 'app-feature',
  template: '<p>Feature</p>',
})
export class FeatureView {
  private config = inject(APP_CONFIG); // ERRO: instância de token diferente!
}
```

Mesmo que os dois tokens tenham a descrição `'app config'`, são objetos diferentes. O Angular compara tokens por referência, não pela descrição.

**Solução:** importe a mesma instância do token.

```angular-ts {prefer, header: 'feature-view.ts'}
import {inject, Component} from '@angular/core';
import {APP_CONFIG, AppConfig} from './config.token';

@Component({
  selector: 'app-feature',
  template: '<p>API: {{config.apiUrl}}</p>',
})
export class FeatureView {
  protected config = inject(APP_CONFIG); // Funciona: mesma instância de token
}
```

TIP: Sempre exporte os tokens de um arquivo compartilhado e importe-os em todos os lugares onde forem necessários. Nunca crie múltiplas instâncias de `InjectionToken` com a mesma descrição.

#### Tentando injetar interfaces {#trying-to-inject-interfaces}

Quando você define uma interface TypeScript, ela existe apenas durante a compilação, para a checagem de tipos. O TypeScript apaga todas as definições de interface ao compilar para JavaScript, então em runtime não existe nenhum objeto que o Angular possa usar como token de injeção. Se você tentar injetar um tipo de interface, o Angular não tem nada para comparar com a configuração do provider.

```angular-ts {avoid, header: "Não é possível injetar interface"}
interface UserConfig {
  name: string;
  email: string;
}

@Component({
  selector: 'app-profile',
  template: '<p>Profile</p>',
})
export class UserProfile {
  // ERRO: interfaces não existem em runtime
  constructor(private config: UserConfig) {}
}
```

**Solução:** use `InjectionToken` para tipos de interface.

```angular-ts {prefer, header: 'Use InjectionToken para interfaces'}
import {InjectionToken, inject, Component} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';

interface UserConfig {
  name: string;
  email: string;
}

export const USER_CONFIG = new InjectionToken<UserConfig>('user configuration');

// Fornece a configuração
bootstrapApplication(App, {
  providers: [
    {
      provide: USER_CONFIG,
      useValue: {name: 'Alice', email: 'alice@example.com'},
    },
  ],
});

// Injeta usando o token
@Component({
  selector: 'app-profile',
  template: '<p>User: {{config.name}}</p>',
})
export class UserProfile {
  protected config = inject(USER_CONFIG);
}
```

O `InjectionToken` existe em runtime e pode ser usado para injeção, enquanto a interface `UserConfig` fornece segurança de tipos durante o desenvolvimento.

### Dependências circulares {#circular-dependencies}

Dependências circulares ocorrem quando services injetam uns aos outros, criando um ciclo que o Angular não consegue resolver. Para explicações detalhadas e exemplos de código, veja [NG0200: Dependência circular](errors/NG0200).

**Estratégias de resolução** (em ordem de preferência):

1. **Reestruturar** - Extraia a lógica compartilhada para um terceiro service, quebrando o ciclo
2. **Usar eventos** - Substitua as dependências diretas por comunicação baseada em eventos (como um `Subject`)
3. **Injeção lazy** - Use `Injector.get()` para adiar uma das dependências (último recurso)

NOTE: Não use `forwardRef()` para dependências circulares entre services. Ele só resolve imports circulares em configurações de components standalone.

## Depurando a resolução de dependências {#debugging-dependency-resolution}

### Entendendo o processo de resolução {#understanding-the-resolution-process}

O Angular resolve dependências percorrendo a hierarquia de injectors para cima. Quando ocorre um `NullInjectorError`, entender esta ordem de busca ajuda você a identificar onde adicionar o provider que está faltando.

O Angular busca nesta ordem:

1. **Element injector** - O component ou directive atual
2. **Element injectors pais** - Subindo pela árvore do DOM através dos components pais
3. **Environment injector** - O injector da route ou da aplicação
4. **NullInjector** - Lança `NullInjectorError` se não encontrar

Quando você vir um `NullInjectorError`, o service não está fornecido em nenhum nível que o component consiga acessar. Verifique se:

- O service tem `@Service()` ou
- O service tem `@Injectable({providedIn: 'root'})`, ou
- O service está em um array `providers` que o component consegue alcançar

Você pode modificar esse comportamento de busca com modificadores de resolução como `self`, `skipSelf`, `host` e `optional`. Para a cobertura completa das regras de resolução e dos modificadores, veja o [guia de injectors hierárquicos](guide/di/hierarchical-dependency-injection).

### Usando o Angular DevTools {#using-angular-devtools}

O Angular DevTools inclui um inspetor de árvore de injectors que visualiza a hierarquia inteira de injectors e mostra quais providers estão disponíveis em cada nível. Para instalação e uso geral, veja a [documentação de injectors do Angular DevTools](tools/devtools/injectors).

Ao depurar problemas de DI, use o DevTools para responder a estas perguntas:

- **O service está fornecido?** Selecione o component que falha na injeção e verifique se o service aparece na seção Injector.
- **Em qual nível?** Suba na árvore de components para descobrir onde o service é realmente fornecido (component, route ou nível da aplicação).
- **Múltiplas instâncias?** Se um service singleton aparece em vários injectors de components, provavelmente ele está sendo fornecido nos arrays `providers` dos components, em vez de usar `@Service` ou `providedIn: 'root'`.

Se um service nunca aparece em nenhum injector, verifique se ele tem o decorator `@Service` ou se está listado em um array `providers`.

### Registrando logs e rastreando a injeção {#logging-and-tracing-injection}

Quando o DevTools não for suficiente, use logs para rastrear o comportamento da injeção.

#### Registrando a criação de services {#logging-service-creation}

Adicione logs no console aos construtores dos services para ver quando eles são criados.

```ts
import {Service} from '@angular/core';

@Service()
export class UserClient {
  constructor() {
    console.log('UserClient created');
    console.trace(); // Mostra a call stack
  }

  getUser() {
    return {name: 'Alice'};
  }
}
```

Quando o service for criado, você verá a mensagem de log e uma stack trace mostrando onde a injeção ocorreu.

**O que observar:**

- Quantas vezes o construtor é chamado? (deveria ser uma vez para singletons)
- Onde no código ele está sendo injetado? (verifique a stack trace)
- Ele é criado no momento esperado? (inicialização da aplicação ou lazy)

#### Verificando a disponibilidade de services {#checking-service-availability}

Use injeção opcional com logs para descobrir se um service está disponível.

```angular-ts
import {Component, inject} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-debug',
  template: '<p>Debug Component</p>',
})
export class DebugView {
  private userService = inject(UserClient, {optional: true});

  constructor() {
    if (this.userService) {
      console.log('UserClient available:', this.userService);
    } else {
      console.warn('UserClient NOT available');
      console.trace(); // Mostra onde tentamos injetar
    }
  }
}
```

Esse padrão ajuda a verificar se um service está disponível sem derrubar a aplicação.

#### Registrando modificadores de resolução {#logging-resolution-modifiers}

Teste diferentes estratégias de resolução com logs.

```angular-ts
import {Component, inject} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-debug',
  template: '<p>Debug Component</p>',
  providers: [UserClient],
})
export class DebugView {
  // Tenta obter a instância local
  private localService = inject(UserClient, {self: true, optional: true});

  // Tenta obter a instância do pai
  private parentService = inject(UserClient, {
    skipSelf: true,
    optional: true,
  });

  constructor() {
    console.log('Local instance:', this.localService);
    console.log('Parent instance:', this.parentService);
    console.log('Same instance?', this.localService === this.parentService);
  }
}
```

Isso mostra quais instâncias estão disponíveis em diferentes níveis de injector.

### Fluxo de depuração {#debugging-workflow}

Quando a DI falha, siga esta abordagem sistemática:

**Passo 1: leia a mensagem de erro**

- Identifique o código do erro (NG0200, NG0203, etc.)
- Leia o caminho de dependência
- Anote qual token falhou

**Passo 2: verifique o básico**

- O service tem `@Service` ou `@Injectable()`?
- Se você usa `@Injectable`, o `providedIn` está configurado corretamente?
- Os imports estão corretos?
- O arquivo está incluído na compilação?

**Passo 3: verifique o contexto de injeção**

- O `inject()` está sendo chamado em um contexto válido?
- Verifique problemas de assincronismo (await, setTimeout, promises)
- Verifique o momento (não depois do destroy)

**Passo 4: use as ferramentas de depuração**

- Abra o Angular DevTools
- Verifique a hierarquia de injectors
- Adicione logs no console nos construtores
- Use injeção opcional para testar a disponibilidade

**Passo 5: simplifique e isole**

- Remova as dependências uma por uma
- Teste em um component mínimo
- Verifique cada nível de injector separadamente
- Crie um caso de reprodução

## Referência de erros de DI {#di-error-reference}

Esta seção traz informações detalhadas sobre códigos de erro específicos de DI do Angular que você pode encontrar. Use-a como referência quando esses erros aparecerem no seu console.

### NullInjectorError: nenhum provider para [Service] {#nullinjectorerror-no-provider-for-service}

**Código do erro:** [NG0201](errors/NG0201)

Esse erro ocorre quando o Angular não consegue encontrar um provider para um token na hierarquia de injectors. A mensagem de erro inclui um caminho de dependência mostrando onde a injeção foi tentada.

```
NG0201: No provider found for `UserClient`. Path: AuthClient -> UserClient.
```

O caminho de dependência mostra que `AuthClient` tentou injetar `UserClient`, mas nenhum provider foi encontrado.

#### Faltando o decorator `@Service` ou `@Injectable` {#missing-the-service--or-injectable-decorator}

A causa mais comum é esquecer o decorator `@Service` ou `@Injectable()` em uma classe de service.

```ts {avoid, header: 'Decorator faltando'}
export class UserClient {
  getUser() {
    return {name: 'Alice'};
  }
}
```

O Angular exige o decorator `@Service()` para gerar os metadados necessários para a injeção de dependência.

```ts {prefer, header: 'Incluindo @Service'}
import {Service} from '@angular/core';

@Service()
export class UserClient {
  getUser() {
    return {name: 'Alice'};
  }
}
```

NOTE: Classes com construtores sem argumentos podem funcionar sem `@Service()`, mas isso não é recomendado. Sempre inclua o decorator por consistência e para evitar problemas quando você adicionar dependências depois.

#### Faltando a configuração de providedIn {#missing-providedin-configuration}

Um service pode ter `@Injectable()` sem especificar onde deveria ser fornecido.

```ts {avoid, header: 'Sem providedIn especificado'}
import {Injectable} from '@angular/core';

@Injectable()
export class UserClient {
  getUser() {
    return {name: 'Alice'};
  }
}
```

Use o decorator `@Service` para tornar o service disponível em toda a aplicação.

```ts {prefer, header: 'Especificando providedIn'}
import {Service} from '@angular/core';

@Service()
export class UserClient {
  getUser() {
    return {name: 'Alice'};
  }
}
```

O decorator `@Service` torna o service disponível em toda a aplicação e habilita o tree-shaking (o service é removido do bundle se nunca for injetado).

#### Component standalone sem imports {#standalone-component-missing-imports}

No Angular v20+ com components standalone, você precisa importar ou fornecer explicitamente as dependências em cada component.

```angular-ts {avoid, header: 'Falta o import do service'}
import {Component, inject} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-profile',
  template: '<p>User: {{user.name}}</p>',
})
export class UserProfile {
  private userService = inject(UserClient); // ERRO: nenhum provider
  user = this.userService.getUser();
}
```

Garanta que o service use `@Service` ou adicione-o ao array `providers` do component.

```angular-ts {prefer, header: 'Service usa providedIn: root'}
import {Component, inject} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-profile',
  template: '<p>User: {{user.name}}</p>',
})
export class UserProfile {
  private userService = inject(UserClient); // Funciona: providedIn: 'root'
  user = this.userService.getUser();
}
```

#### Depurando com o caminho de dependência {#debugging-with-the-dependency-path}

O caminho de dependência na mensagem de erro mostra a cadeia de injeções que levou à falha.

```
NG0201: No provider found for `LoggerStore`. Path: DataStore -> ApiClient -> LoggerStore.
```

Esse caminho diz:

1. `DataStore` injetou `ApiClient`
2. `ApiClient` tentou injetar `LoggerStore`
3. Nenhum provider para `LoggerStore` foi encontrado

Comece a investigação pelo fim da cadeia (`LoggerStore`) e verifique se ele tem a configuração correta.

#### Verificando a disponibilidade do provider com injeção opcional {#checking-provider-availability-with-optional-injection}

Use injeção opcional para verificar se um provider existe sem lançar um erro.

```angular-ts
import {Component, inject} from '@angular/core';
import {UserClient} from './user-client';

@Component({
  selector: 'app-debug',
  template: '<p>Service available: {{serviceAvailable}}</p>',
})
export class DebugView {
  private userService = inject(UserClient, {optional: true});
  serviceAvailable = this.userService !== null;
}
```

A injeção opcional retorna `null` se nenhum provider for encontrado, permitindo que você trate a ausência de forma adequada.

### NG0203: inject() deve ser chamado de um contexto de injeção {#ng0203-inject-must-be-called-from-an-injection-context}

**Código do erro:** NG0203

Esse erro ocorre quando você chama `inject()` fora de um contexto de injeção válido. O Angular exige que `inject()` seja chamado de forma síncrona durante a construção da classe ou a execução de uma factory.

```
NG0203: The `UserClient` token injection failed. `inject()` function must
be called from an injection context such as a constructor, a factory
function, a field initializer, or a function used with
`runInInjectionContext`.
```

#### Contextos de injeção válidos {#valid-injection-contexts}

O Angular permite `inject()` nestes locais:

1. **Inicializadores de campos de classe**

   ```angular-ts
   import {Component, inject} from '@angular/core';
   import {UserClient} from './user-client';

   @Component({
     selector: 'app-profile',
     template: '<p>User: {{user.name}}</p>',
   })
   export class UserProfile {
     private userService = inject(UserClient); // Válido
     user = this.userService.getUser();
   }
   ```

2. **Construtor da classe**

   ```angular-ts
   import {Component, inject} from '@angular/core';
   import {UserClient} from './user-client';

   @Component({
     selector: 'app-profile',
     template: '<p>User: {{user.name}}</p>',
   })
   export class UserProfile {
     private userService: UserClient;
     user: ReturnType<UserClient['getUser']>;

     constructor() {
       this.userService = inject(UserClient); // Válido
       this.user = this.userService.getUser();
     }
   }
   ```

3. **Funções factory de providers**

   ```ts
   import {inject, InjectionToken} from '@angular/core';
   import {UserClient} from './user-client';

   export const GREETING = new InjectionToken<string>('greeting', {
     factory() {
       const userService = inject(UserClient); // Válido
       const user = userService.getUser();
       return `Hello, ${user.name}`;
     },
   });
   ```

4. **Dentro de runInInjectionContext()**

   ```angular-ts
   import {Component, inject, Injector, runInInjectionContext} from '@angular/core';
   import {UserClient} from './user-client';

   @Component({
     selector: 'app-profile',
     template: '<button (click)="loadUser()">Load User</button>',
   })
   export class UserProfile {
     private injector = inject(Injector);

     loadUser() {
       runInInjectionContext(this.injector, () => {
         const userService = inject(UserClient); // Válido
         console.log(userService.getUser());
       });
     }
   }
   ```

Outros contextos de injeção em que `inject()` também funciona incluem:

- [provideAppInitializer](api/core/provideAppInitializer)
- [provideEnvironmentInitializer](api/core/provideEnvironmentInitializer)
- [Route guards](guide/routing/route-guards) funcionais
- [Resolvers de dados](guide/routing/data-resolvers) funcionais
- [Resources](guide/routing/data-fetching-with-resources) de route

#### Quando este erro ocorre {#when-this-error-occurs}

Este erro ocorre quando:

- Você chama `inject()` em hooks do ciclo de vida (`ngOnInit`, `ngAfterViewInit`, etc.)
- Você chama `inject()` depois de um `await` em funções assíncronas
- Você chama `inject()` em callbacks (`setTimeout`, `Promise.then()`, etc.)
- Você chama `inject()` fora da fase de construção da classe

Veja a seção "Uso incorreto de inject()" para exemplos detalhados e soluções.

#### Soluções e alternativas {#solutions-and-workarounds}

**Solução 1:** capture as dependências nos inicializadores de campos (o mais comum)

```ts
private userService = inject(UserClient) // Captura no nível da classe
```

**Solução 2:** use `runInInjectionContext()` para callbacks

```ts
private injector = inject(Injector)

someCallback() {
  runInInjectionContext(this.injector, () => {
    const service = inject(MyClient)
  })
}
```

**Solução 3:** passe as dependências como parâmetros em vez de injetá-las

```ts
// Em vez de injetar dentro de um callback
setTimeout(() => {
  const service = inject(MyClient) // ERRO
}, 1000)

// Captura primeiro, depois usa
private service = inject(MyClient)

setTimeout(() => {
  this.service.doSomething() // Usa a referência capturada
}, 1000)
```

### NG0200: dependência circular detectada {#ng0200-circular-dependency-detected}

**Código do erro:** NG0200

Esse erro ocorre quando dois ou mais services dependem uns dos outros, criando uma dependência circular que o Angular não consegue resolver.

```
NG0200: Circular dependency detected for `AuthClient`. Path: AuthClient -> UserClient -> AuthClient.
```

O caminho de dependência mostra o ciclo: `AuthClient` depende de `UserClient`, que depende de volta de `AuthClient`.

#### Entendendo o erro {#understanding-the-error}

O Angular cria instâncias de services chamando seus construtores e injetando as dependências. Quando services dependem uns dos outros de forma circular, o Angular não consegue determinar qual criar primeiro.

#### Causas comuns {#common-causes}

- Dependência circular direta (Service A → Service B → Service A)
- Dependência circular indireta (Service A → Service B → Service C → Service A)
- Ciclos de import em arquivos de módulo que também têm dependências de services

#### Estratégias de resolução {#resolution-strategies}

Veja a seção "Dependências circulares" para exemplos detalhados e soluções:

1. **Reestruturar** - Extraia a lógica compartilhada para um terceiro service (recomendado)
2. **Usar eventos** - Substitua as dependências diretas por comunicação baseada em eventos
3. **Injeção lazy** - Use `Injector.get()` para adiar uma das dependências (último recurso)

Não use `forwardRef()` para dependências circulares entre services. Ele só resolve imports circulares em configurações de components.

### Outros códigos de erro de DI {#other-di-error-codes}

Para explicações detalhadas e soluções desses erros, veja a [referência de erros do Angular](errors):

| Código de erro          | Descrição                                                                                       |
| ----------------------- | ----------------------------------------------------------------------------------------------- |
| [NG0204](errors/NG0204) | Não é possível resolver todos os parâmetros - falta o decorator `@Injectable()`                 |
| [NG0205](errors/NG0205) | Injector já destruído - acessando services depois da destruição do component                    |
| [NG0207](errors/NG0207) | EnvironmentProviders no contexto errado - usando `provideHttpClient()` nos providers de component |

## Próximos passos {#next-steps}

Quando você encontrar erros de DI, lembre-se de:

1. Ler a mensagem de erro e o caminho de dependência com atenção
2. Verificar a configuração básica (decorators, `providedIn`, imports)
3. Verificar o contexto de injeção e o momento da execução
4. Usar o DevTools e logs para investigar
5. Simplificar e isolar o problema

Para entender melhor tópicos específicos de injeção de dependência, confira:

- [Entendendo a injeção de dependência](guide/di) - Conceitos e padrões centrais de DI
- [Injeção de dependência hierárquica](guide/di/hierarchical-dependency-injection) - Como funciona a hierarquia de injectors
- [Testando com injeção de dependência](guide/testing) - Usando TestBed e mocks de dependências
