<!-- ia-translate: true -->
# Criando um service injetável

Service é uma categoria ampla que abrange qualquer valor, função ou recurso que uma aplicação precisa.
Um service é tipicamente uma classe com um propósito restrito e bem definido.
Um component é um tipo de classe que pode usar DI.

O Angular distingue components de services para aumentar a modularidade e reutilização.
Ao separar os recursos relacionados à visualização de um component de outros tipos de processamento, você pode tornar suas classes de component enxutas e eficientes.

Idealmente, o trabalho de um component é habilitar a experiência do usuário e nada mais.
Um component deve apresentar propriedades e métodos para data binding, para mediar entre a view (renderizada pelo template) e a lógica da aplicação (que frequentemente inclui alguma noção de um modelo).

Um component pode delegar certas tarefas a services, como buscar dados do servidor, validar entrada do usuário ou fazer log diretamente no console.
Ao definir tais tarefas de processamento em uma classe de service injetável, você torna essas tarefas disponíveis para qualquer component.
Você também pode tornar sua aplicação mais adaptável configurando diferentes providers do mesmo tipo de service, conforme apropriado em diferentes circunstâncias.

O Angular não impõe esses princípios.
O Angular ajuda você a seguir esses princípios tornando fácil fatorar a lógica da sua aplicação em services e tornar esses services disponíveis para components através de DI.

## Exemplos de service

Aqui está um exemplo de uma classe de service que faz log no console do navegador:

<docs-code header="src/app/logger.service.ts (class)" language="typescript">
export class Logger {
  log(msg: unknown) { console.log(msg); }
  error(msg: unknown) { console.error(msg); }
  warn(msg: unknown) { console.warn(msg); }
}
</docs-code>

Services podem depender de outros services.
Por exemplo, aqui está um `HeroService` que depende do service `Logger`, e também usa `BackendService` para obter heroes.
Esse service por sua vez pode depender do service `HttpClient` para buscar heroes assincronamente de um servidor:

<docs-code header="src/app/hero.service.ts" language="typescript"
           highlight="[7,8,12,13]">
import { inject } from "@angular/core";

export class HeroService {
private heroes: Hero[] = [];

private backend = inject(BackendService);
private logger = inject(Logger);

async getHeroes() {
// Fetch
this.heroes = await this.backend.getAll(Hero);
// Log
this.logger.log(`Fetched ${this.heroes.length} heroes.`);
return this.heroes;
}
}
</docs-code>

## Criando um service injetável com o CLI

O Angular CLI fornece um comando para criar um novo service. No exemplo a seguir, você adiciona um novo service a uma aplicação existente.

Para gerar uma nova classe `HeroService` na pasta `src/app/heroes`, siga estes passos:

1. Execute este comando do [Angular CLI](/tools/cli):

<docs-code language="sh">
ng generate service heroes/hero
</docs-code>

Este comando cria o seguinte `HeroService` padrão:

<docs-code header="src/app/heroes/hero.service.ts (gerado pelo CLI)" language="typescript">
import { Injectable } from '@angular/core';

@Injectable({
providedIn: 'root',
})
export class HeroService {}
</docs-code>

O decorator `@Injectable()` especifica que o Angular pode usar esta classe no sistema DI.
Os metadados, `providedIn: 'root'`, significam que o `HeroService` é fornecido por toda a aplicação.

Adicione um método `getHeroes()` que retorna os heroes de `mock.heroes.ts` para obter os dados mock de hero:

<docs-code header="src/app/heroes/hero.service.ts" language="typescript">
import { Injectable } from '@angular/core';
import { HEROES } from './mock-heroes';

@Injectable({
// declara que este service deve ser criado
// pelo injector raiz da aplicação.
providedIn: 'root',
})
export class HeroService {
getHeroes() {
return HEROES;
}
}
</docs-code>

Para clareza e manutenibilidade, é recomendado que você defina components e services em arquivos separados.

## Injetando services

Para injetar um service como uma dependência em um component, você pode declarar um campo de classe representando a dependência e usar a função `inject` do Angular para inicializá-lo.

O exemplo a seguir especifica o `HeroService` no `HeroListComponent`.
O tipo de `heroService` é `HeroService`.

<docs-code header="src/app/heroes/hero-list.component.ts" language="typescript">
import { inject } from "@angular/core";

export class HeroListComponent {
private heroService = inject(HeroService);
}
</docs-code>

Também é possível injetar um service em um component usando o constructor do component:

<docs-code header="src/app/heroes/hero-list.component.ts (assinatura do constructor)" language="typescript">
  constructor(private heroService: HeroService)
</docs-code>

O método `inject` pode ser usado tanto em classes quanto em funções, enquanto o método do constructor naturalmente só pode ser usado em um constructor de classe. No entanto, em qualquer caso, uma dependência só pode ser injetada em um [contexto de injeção](guide/di/dependency-injection-context) válido, geralmente na construção ou inicialização de um component.

## Injetando services em outros services

Quando um service depende de outro service, siga o mesmo padrão de injetar em um component.
No exemplo a seguir, `HeroService` depende de um service `Logger` para reportar suas atividades:

<docs-code header="src/app/heroes/hero.service.ts" language="typescript"
           highlight="[3,9,12]">
import { inject, Injectable } from '@angular/core';
import { HEROES } from './mock-heroes';
import { Logger } from '../logger.service';

@Injectable({
providedIn: 'root',
})
export class HeroService {
private logger = inject(Logger);

getHeroes() {
this.logger.log('Getting heroes.');
return HEROES;
}
}
</docs-code>

Neste exemplo, o método `getHeroes()` usa o service `Logger` fazendo log de uma mensagem ao buscar heroes.

## Próximos passos

<docs-pill-row>
  <docs-pill href="/guide/di/dependency-injection-providers" title="Configurando dependency providers"/>
  <docs-pill href="/guide/di/dependency-injection-providers#using-an-injectiontoken-object" title="`InjectionTokens`"/>
</docs-pill-row>
