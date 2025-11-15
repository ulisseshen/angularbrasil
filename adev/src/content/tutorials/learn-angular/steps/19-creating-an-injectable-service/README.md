<!-- ia-translate: true -->
# Criando um service injetável

Injeção de dependência (DI) no Angular é uma das funcionalidades mais poderosas do framework. Considere a injeção de dependência como a capacidade do Angular de _fornecer_ recursos que você precisa para sua aplicação em tempo de execução. Uma dependência pode ser um service ou algum outro recurso.

Nota: Saiba mais sobre [injeção de dependência no guia essencial](/essentials/dependency-injection).

Nesta atividade, você aprenderá como criar um service `injectable`.

<hr>

Uma forma de usar um service é agir como uma maneira de interagir com dados e APIs. Para tornar um service reutilizável, você deve manter a lógica no service e compartilhá-la por toda a aplicação quando necessário.

Para tornar um service elegível para ser injetado pelo sistema de DI, use o decorator `@Injectable`. Por exemplo:

<docs-code language="ts" highlight="[1, 2, 3]">
@Injectable({
  providedIn: 'root'
})
class UserService {
  // methods to retrieve and return data
}
</docs-code>

O decorator `@Injectable` notifica o sistema de DI que o `UserService` está disponível para ser requisitado em uma classe. `providedIn` define o escopo no qual este recurso está disponível. Por enquanto, é suficiente entender que `providedIn: 'root'` significa que o `UserService` está disponível para toda a aplicação.

Certo, agora é com você:

<docs-workflow>

<docs-step title="Adicionar o decorator `@Injectable`">
Atualize o código em `car.service.ts` adicionando o decorator `@Injectable`.
</docs-step>

<docs-step title="Configurar o decorator">
Os valores no objeto passado para o decorator são considerados a configuração para o decorator.
<br>
Atualize o decorator `@Injectable` em `car.service.ts` para incluir a configuração para `providedIn: 'root'`.

DICA: Use o exemplo acima para encontrar a sintaxe correta.

</docs-step>

</docs-workflow>

Muito bem 👍 esse service agora é `injectable` e pode participar da diversão. Agora que o service é `injectable`, vamos tentar injetá-lo em um component 👉
