<!-- ia-translate: true -->
# WebMCP

O WebMCP é um [padrão web proposto](https://github.com/webmachinelearning/webmcp/) que permite que aplicações web exponham ferramentas estruturadas diretamente para agentes de IA que rodam nativamente no navegador. As ferramentas definidas por uma aplicação permitem que assistentes de IA interajam com ela diretamente, oferecendo capacidades adicionais ao agente e reduzindo a necessidade de interações com o DOM.

Por exemplo, uma aplicação para cadastrar um novo usuário pode fornecer uma ferramenta WebMCP para que o agente de IA do navegador crie o usuário diretamente, em vez de exigir que o agente percorra uma interface de assistente complexa por meio de interações com o DOM.

O Angular oferece suporte experimental ao WebMCP, permitindo registrar facilmente ferramentas vinculadas ao ciclo de vida da injeção de dependência da sua aplicação e transformar automaticamente os seus Signal Forms em ferramentas prontas para IA.

IMPORTANT: A especificação do WebMCP está em um estágio muito inicial do ciclo de vida e passa por mudanças frequentes. Por isso, o suporte ao WebMCP no Angular está atualmente [**experimental**](reference/releases#experimental). As APIs podem mudar mesmo fora de versões major.

## Forneça ferramentas para a aplicação {#provide-tools-for-the-application}

Use [`provideExperimentalWebMcpTools`](api/core/provideExperimentalWebMcpTools) na configuração da sua aplicação para registrar ferramentas durante todo o ciclo de vida da aplicação. As ferramentas fornecidas dessa forma são registradas automaticamente quando a aplicação é inicializada e removidas do registro quando a aplicação é destruída.

O callback `execute` é invocado no contexto de injeção do `Injector` associado, o que significa que você pode [`inject`](api/core/inject) services diretamente.

```ts {header:"main.ts"}
import {Service, inject, provideExperimentalWebMcpTools} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {AppRoot} from './app-root';

@Service()
class Greeter {
  sayHello(): string {
    return 'Hello agent!';
  }
}

bootstrapApplication(AppRoot, {
  providers: [
    provideExperimentalWebMcpTools([
      {
        name: 'greet',
        description: 'Greets the agent.',
        execute: () => {
          const greeter = inject(Greeter);

          return {content: [{type: 'text', text: greeter.sayHello()}]};
        },
      },
    ]),
  ],
});
```

### Defina os parâmetros da ferramenta {#define-tool-parameters}

Quando uma ferramenta precisa de entrada do assistente de IA, defina os argumentos esperados dentro de `inputSchema` usando a sintaxe do [JSON Schema](https://json-schema.org/). O Angular infere automaticamente os tipos dos parâmetros passados para o seu callback `execute` com base na definição do schema.

```ts {header:"main.ts"}
import {provideExperimentalWebMcpTools} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {AppRoot} from './app-root';

bootstrapApplication(AppRoot, {
  providers: [
    provideExperimentalWebMcpTools([
      {
        name: 'searchCatalog',
        description: 'Searches the store catalog for products matching a query.',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'The search keywords.',
            },
            maxResults: {
              type: 'number',
              description: 'Maximum number of results to return.',
            },
          },
          required: ['query'],
          additionalProperties: false,
        },
        execute: ({query, maxResults}) => {
          // Type of `query` is inferred as `string`.
          // Type of `maxResults` is inferred as `number | undefined`.

          // Consider validating this at runtime, since inputs may not be validated to match the schema.
          if (typeof query !== 'string') throw new Error(`Bad query: ${query}`);
          if (typeof maxResults !== 'number' && maxResults !== undefined)
            throw new Error(`Bad maxResults: ${maxResults}`);

          const limit = maxResults ?? 5;
          return {
            content: [{type: 'text', text: `Returning up to ${limit} results for "${query}".`}],
          };
        },
      },
    ]),
  ],
});
```

TIP: Use `required: ['param1', 'param2', ...]` para remover `undefined` dos tipos desses parâmetros e use `additionalProperties: false` para restringir o tipo do objeto de argumentos apenas a esses parâmetros.

## Forneça ferramentas para uma rota {#provide-tools-for-a-route}

Ao construir aplicações complexas, você pode querer que certas ferramentas estejam disponíveis somente quando o usuário estiver visualizando rotas específicas. Você pode fazer isso fornecendo ferramentas diretamente nas definições de rota.

```ts {header:"routes.ts"}
import {provideExperimentalWebMcpTools} from '@angular/core';
import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard').then((m) => m.Dashboard),
    providers: [
      provideExperimentalWebMcpTools([
        {
          name: 'exportDashboardReports',
          description: 'Exports the current dashboard analytics.',
          execute: () => ({
            content: [{type: 'text', text: 'Dashboard export successfully triggered.'}],
          }),
        },
      ]),
    ],
  },
];
```

NOTE: Ao registrar ferramentas para uma rota específica, considere configurar o router para usar [`withAutoCleanupInjectors`](api/router/withAutoCleanupInjectors) para garantir que as ferramentas sejam automaticamente _removidas do registro_ quando o usuário sair da rota. Sem essa opção, as ferramentas WebMCP declaradas nas rotas continuarão acessíveis para os agentes de IA mesmo depois que o usuário navegar para outra rota.

```ts {header:"app.config.ts"}
import {ApplicationConfig} from '@angular/core';
import {provideRouter, withAutoCleanupInjectors} from '@angular/router';
import {routes} from './routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withAutoCleanupInjectors())],
};
```

## Forneça ferramentas dentro de services {#provide-tools-within-services}

Para casos de uso dinâmicos, a função [`declareExperimentalWebMcpTool`](api/core/declareExperimentalWebMcpTool) registra uma ferramenta diretamente dentro de um contexto de injeção e a remove automaticamente do registro quando esse contexto é destruído.

```ts {header:"counter.ts"}
import {Service, declareExperimentalWebMcpTool, signal, inject} from '@angular/core';

@Service()
export class Counter {
  readonly count = signal(0);

  constructor() {
    declareExperimentalWebMcpTool({
      name: 'getCounter',
      description: 'Reads the global counter.',
      execute: () => ({
        content: [{type: 'text', text: `The count is: ${this.count()}.`}],
      }),
    });
  }
}
```

Embora `declareExperimentalWebMcpTool` funcione em qualquer contexto de injeção, fique atento a [colisões de nomes](#name-collisions) e prefira usá-la em services raiz.

## Ferramentas implícitas em Signal Forms {#implicit-tools-in-signal-forms}

Você pode criar uma ferramenta WebMCP implicitamente a partir de um [Signal Form](essentials/signal-forms) existente do Angular, com configuração mínima. O Angular converte os modelos dos seus formulários em ferramentas WebMCP completas, dando suporte efetivo a formulários altamente dinâmicos sem exigir que você escreva manualmente schemas JSON ou manipuladores de eventos.

### Habilite o recurso de formulários do WebMCP {#enable-the-webmcp-forms-feature}

Primeiro, adicione [`provideExperimentalWebMcpForms`](api/forms/signals/provideExperimentalWebMcpForms) aos providers da sua aplicação raiz:

```ts {header:"main.ts"}
import {bootstrapApplication} from '@angular/platform-browser';
import {provideExperimentalWebMcpForms} from '@angular/forms/signals';
import {AppRoot} from './app-root';

bootstrapApplication(AppRoot, {
  providers: [provideExperimentalWebMcpForms()],
});
```

### Ative um Signal Form {#opt-in-a-signal-form}

Em segundo lugar, ao definir um Signal Form usando [`form`](api/forms/signals/form), passe a opção de configuração `experimentalWebMcpTool` para ativar uma ferramenta WebMCP implícita. O Angular vai inspecionar o modelo de dados do seu formulário e gerar automaticamente um JSON schema para os agentes de IA conectados.

```ts {header:"user-registration.ts"}
import {Component, signal} from '@angular/core';
import {form, required, minLength} from '@angular/forms/signals';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.html',
})
export class UserRegistration {
  private readonly model = signal({
    firstName: '',
    lastName: '',
    age: 0,
    hobbies: ['Web Development'],
  });

  readonly userForm = form(
    this.model,
    (f) => {
      required(f.firstName, {message: 'First name is mandatory.'});
      required(f.lastName, {message: 'Last name is mandatory.'});
    },
    {
      // Implicitly registers a WebMCP tool named `registerUser` with parameters derived from `model`.
      experimentalWebMcpTool: {
        name: 'registerUser',
        description: 'Registers a new user.',
      },
      submission: {
        action: async (formValue) => {
          console.log('Submitting user:', formValue().value());
          // ...
        },
      },
    },
  );
}
```

Neste exemplo, o Angular gera uma ferramenta WebMCP com um JSON schema que:

1. inclui `firstName`, `lastName`, `age` e `hobbies` como parâmetros inferidos do valor inicial do signal `model`.
2. define `firstName` e `lastName` como campos _obrigatórios_, conforme inferido do validador [`required`](api/forms/signals/required).
3. define `hobbies` como um array de strings, permitindo que o agente informe uma quantidade arbitrária de hobbies.

Além de inferir o schema de entrada, o Angular também conecta a ferramenta WebMCP à lógica de validação e ao manipulador de envio do formulário. Isso significa que o agente vai observar quaisquer erros de validação disparados pelas suas entradas ou quaisquer falhas que ocorram durante o envio, permitindo que ele se autocorrija e, potencialmente, tente novamente.

NOTE: Por padrão, validadores assíncronos não bloqueiam o envio: a ação de envio é executada antes que eles terminem, portanto os erros deles não são reportados ao agente. Trate essas verificações na ação de envio.

#### Restrições {#constraints}

O Angular infere o schema do WebMCP a partir do valor inicial do modelo do seu formulário. Isso exige:

- Valores iniciais concretos (`''`, `0`, `false`): o Angular não consegue inferir tipos de dados a partir de `null` ou `undefined`.
- Arrays não vazios (`['Hello!']`): o Angular não consegue inferir tipos de dados a partir de um array vazio e exige pelo menos um valor inicial.

## Boas práticas {#best-practices}

Tenha em mente as seguintes boas práticas:

### Colisões de nomes {#name-collisions}

O WebMCP exige que cada ferramenta tenha um nome único e lança um erro se o mesmo nome de ferramenta for registrado mais de uma vez. Isso significa que chamar `declareExperimentalWebMcpTool` ou `provideExperimentalWebMcpTools` em um contexto onde elas possam ser registradas várias vezes (como o construtor de um component) pode gerar erros em tempo de execução.

Sempre que possível, prefira colocar as ferramentas nos providers da aplicação, nos providers de rota ou em services raiz. Ao colocar ferramentas em um component, incluindo [ferramentas implícitas em Signal Forms](#implicit-tools-in-signal-forms), garanta que esse component seja renderizado na página no máximo _uma vez_ por vez.

### Valide as entradas das ferramentas {#validate-tool-inputs}

O Angular não oferece nenhuma validação implícita de que as entradas fornecidas por um agente realmente correspondam ao JSON schema definido. Considere validar explicitamente os argumentos da função `execute` antes de usá-los, para garantir confiabilidade.

### Testes {#testing}

Considere usar uma implementação simulada (mock) do WebMCP, como o [`@mcp-b/webmcp-polyfill`](https://www.npmjs.com/package/@mcp-b/webmcp-polyfill), para testar suas ferramentas unitariamente de forma eficaz.
