<!-- ia-translate: true -->
# Criando um service injetável {#creating-an-injectable-service}

A injeção de dependência (DI) no Angular é um dos recursos mais poderosos do framework. Considere a injeção de dependência como a capacidade do Angular de _fornecer_ os recursos de que sua aplicação precisa em tempo de execução. Uma dependência pode ser um service ou algum outro recurso.

NOTE: Saiba mais sobre [injeção de dependência no guia essencial](/essentials/dependency-injection).

Nesta atividade, você aprenderá como criar um service `injectable`.

<hr>

Uma forma de usar um service é atuar como uma maneira de interagir com dados e APIs. Para tornar um service reutilizável, mantenha a lógica no service e compartilhe-a por toda a aplicação quando for necessário.

Para tornar uma classe elegível para ser injetada pelo sistema de DI, use o decorator `@Service`. Por exemplo:

```ts {highlight:[1]}
@Service()
class UserService {
  // methods to retrieve and return data
}
```

O decorator `@Service` marca a classe como um service e notifica o sistema de DI de que o `UserService` pode ser acessado em qualquer parte da aplicação. Por padrão, o Angular fornece o service em toda a aplicação, então você não precisa escrever nenhuma configuração extra.

NOTE: Por padrão, `@Service` fornece a classe no root injector. Se você quiser fornecê-la manualmente, por exemplo, para restringi-la a uma rota ou component específico, defina `autoProvided: false`. Saiba mais no [guia sobre como criar e usar services](guide/di/creating-and-using-services#using-the-service-vs-injectable-decorator).

Certo, agora é sua vez:

<docs-workflow>

<docs-step title="Adicione o decorator `@Service`">
Atualize o código em `car.service.ts` adicionando o decorator `@Service()` à classe `CarService`.

TIP: Use o exemplo acima para encontrar a sintaxe correta.

</docs-step>

</docs-workflow>

Muito bem 👍 esse service agora é `injectable` e pode participar da diversão. Agora que o service é `injectable`, vamos tentar injetá-lo em um component 👉
