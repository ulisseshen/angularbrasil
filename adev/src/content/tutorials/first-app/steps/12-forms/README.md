<!-- ia-translate: true -->
# Adicionando um formulário à sua aplicação Angular

Esta lição do tutorial demonstra como adicionar um formulário que coleta dados do usuário a uma aplicação Angular.
Esta lição começa com uma aplicação Angular funcional e mostra como adicionar um formulário a ela.

Os dados que o formulário coleta são enviados apenas ao service da aplicação, que os escreve no console do browser.
Usar uma REST API para enviar e receber os dados do formulário não é coberto nesta lição.

<docs-video src="https://www.youtube.com/embed/kWbk-dOJaNQ?si=FYMXGdUiT-qh321h"/>

IMPORTANTE: Recomendamos usar seu ambiente local para este passo do tutorial.

## O que você vai aprender

- Sua aplicação tem um formulário no qual usuários podem inserir dados que são enviados ao service da sua aplicação.
- O service escreve os dados do formulário no log do console do browser.

<docs-workflow>

<docs-step title="Adicione um método para enviar dados do formulário">
Este passo adiciona um método ao service da sua aplicação que recebe os dados do formulário para enviar ao destino dos dados.
Neste exemplo, o método escreve os dados do formulário no log do console do browser.

No painel **Edit** do seu IDE:

1. Em `src/app/housing.service.ts`, dentro da classe `HousingService`, cole este método no final da definição da classe.

<docs-code header="Método submit em src/app/housing.service.ts" path="adev/src/content/tutorials/first-app/steps/13-search/src/app/housing.service.ts" visibleLines="[120,124]"/>

1. Confirme que a aplicação builda sem erro.
   Corrija quaisquer erros antes de continuar para o próximo passo.
   </docs-step>

<docs-step title="Adicione as funções do formulário à página de detalhes">
Este passo adiciona o código à página de detalhes que lida com as interações do formulário.

No painel **Edit** do seu IDE, em `src/app/details/details.ts`:

1. Após as declarações `import` no topo do arquivo, adicione o seguinte código para importar as classes de formulário do Angular.

<docs-code header="Imports de formulários em src/app/details/details.ts" path="adev/src/content/tutorials/first-app/steps/13-search/src/app/details/details.ts" visibleLines="[5]"/>

1. Nos metadados do decorator `Details`, atualize a propriedade `imports` com o seguinte código:

<docs-code header="Directive imports em src/app/details/details.ts" path="adev/src/content/tutorials/first-app/steps/13-search/src/app/details/details.ts" visibleLines="[9]"/>

1. Na classe `Details`, antes do método `constructor()`, adicione o seguinte código para criar o objeto de formulário.

   <docs-code header="Directive template em src/app/details/details.ts" path="adev/src/content/tutorials/first-app/steps/13-search/src/app/details/details.ts" visibleLines="[52,56]"/>

   No Angular, `FormGroup` e `FormControl` são tipos que permitem que você construa formulários. O tipo `FormControl` pode fornecer um valor padrão e moldar os dados do formulário. Neste exemplo `firstName` é uma `string` e o valor padrão é string vazia.

1. Na classe `Details`, após o método `constructor()`, adicione o seguinte código para lidar com o clique em **Apply now**.

   <docs-code header="Directive template em src/app/details/details.ts" path="adev/src/content/tutorials/first-app/steps/13-search/src/app/details/details.ts" visibleLines="[62,68]"/>

   Este botão ainda não existe - você o adicionará no próximo passo. No código acima, os `FormControl`s podem retornar `null`. Este código usa o operador de coalescência nula para usar string vazia como padrão se o valor for `null`.

1. Confirme que a aplicação builda sem erro.
   Corrija quaisquer erros antes de continuar para o próximo passo.
   </docs-step>

<docs-step title="Adicione a marcação do formulário à página de detalhes">
Este passo adiciona a marcação à página de detalhes que exibe o formulário.

No painel **Edit** do seu IDE, em `src/app/details/details.ts`:

1. Nos metadados do decorator `Details`, atualize o HTML do `template` para corresponder ao seguinte código para adicionar a marcação do formulário.

   <docs-code language="angular-ts" header="Directive template em src/app/details/details.ts" path="adev/src/content/tutorials/first-app/steps/13-search/src/app/details/details.ts" visibleLines="[10,45]"/>

   O template agora inclui um manipulador de evento `(submit)="submitApplication()"`. Angular usa sintaxe de parênteses em torno do nome do evento para definir eventos no código do template. O código do lado direito do sinal de igual é o código que deve ser executado quando este evento é disparado. Você pode vincular a eventos do browser e eventos customizados.

1. Confirme que a aplicação builda sem erro.
   Corrija quaisquer erros antes de continuar para o próximo passo.

<img alt="página de detalhes com um formulário para se candidatar a morar neste local" src="assets/images/tutorials/first-app/homes-app-lesson-12-step-3.png">

</docs-step>

<docs-step title="Teste o novo formulário da sua aplicação">
Este passo testa o novo formulário para ver que quando os dados do formulário são enviados à aplicação, os dados do formulário aparecem no log do console.

1. No painel **Terminal** do seu IDE, execute `ng serve`, se ele ainda não estiver rodando.
1. No seu browser, abra sua aplicação em `http://localhost:4200`.
1. Clique com o botão direito na aplicação no browser e no menu de contexto, escolha **Inspect**.
1. Na janela de ferramentas do desenvolvedor, escolha a aba **Console**.
   Certifique-se de que a janela de ferramentas do desenvolvedor esteja visível para os próximos passos
1. Na sua aplicação:
   1. Selecione uma localização de moradia e clique em **Learn more**, para ver detalhes sobre a casa.
   1. Na página de detalhes da casa, role até o final para encontrar o novo formulário.
   1. Insira dados nos campos do formulário - quaisquer dados servem.
   1. Escolha **Apply now** para enviar os dados.
1. Na janela de ferramentas do desenvolvedor, revise a saída do log para encontrar os dados do seu formulário.
   </docs-step>

</docs-workflow>

RESUMO: Nesta lição, você atualizou sua aplicação para adicionar um formulário usando o recurso de formulários do Angular, e conectou os dados capturados no formulário a um component usando um manipulador de evento.

Para mais informações sobre os tópicos cobertos nesta lição, visite:

<docs-pill-row>
  <docs-pill href="guide/forms" title="Formulários Angular"/>
  <docs-pill href="guide/templates/event-listeners" title="Manipulação de Eventos"/>
</docs-pill-row>
