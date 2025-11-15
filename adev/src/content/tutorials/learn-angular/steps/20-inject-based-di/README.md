<!-- ia-translate: true -->
# Injeção de dependência baseada em Inject

Criar um service injetável é a primeira parte do sistema de injeção de dependência (DI) no Angular. Como você injeta um service em um component? Angular tem uma função conveniente chamada `inject()` que pode ser usada no contexto apropriado.

NOTA: Contextos de injeção estão além do escopo deste tutorial, mas você pode aprender mais no [guia essencial de injeção de dependência (DI)](/essentials/dependency-injection) e no [guia de contexto de DI](guide/di/dependency-injection-context).

Nesta atividade, você aprenderá como injetar um service e usá-lo em um component.

<hr>

É frequentemente útil inicializar propriedades de classe com valores fornecidos pelo sistema de DI. Aqui está um exemplo:

<docs-code language="ts" highlight="[3]">
@Component({...})
class PetCareDashboard {
  petRosterService = inject(PetRosterService);
}
</docs-code>

<docs-workflow>

<docs-step title="Injetar o `CarService`">

Em `app.ts`, usando a função `inject()`, injete o `CarService` e atribua-o a uma propriedade chamada `carService`

NOTA: Observe a diferença entre a propriedade `carService` e a classe `CarService`.

</docs-step>

<docs-step title="Usar a instância `carService`">

Chamar `inject(CarService)` forneceu a você uma instância do `CarService` que você pode usar em sua aplicação, armazenada na propriedade `carService`.

Inicialize a propriedade `display` com a seguinte implementação:

```ts
display = this.carService.getCars().join(' ⭐️ ');
```

</docs-step>

<docs-step title="Atualizar o template do `App`">

Atualize o template do component em `app.ts` com o seguinte código:

```ts
template: `<p>Car Listing: {{ display }}</p>`,
```

</docs-step>

</docs-workflow>

Você acabou de injetar seu primeiro service em um component - esforço fantástico.
