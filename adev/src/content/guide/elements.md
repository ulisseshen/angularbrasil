<!-- ia-translate: true -->
# Visão geral de Angular elements

_Angular elements_ são components Angular empacotados como _custom elements_ \(também chamados Web Components\), um padrão web para definir novos elementos HTML de forma independente de framework.

[Custom elements](https://developer.mozilla.org/docs/Web/Web_Components/Using_custom_elements) são uma funcionalidade da Web Platform disponível em todos os browsers suportados pelo Angular.
Um custom element estende o HTML permitindo que você defina uma tag cujo conteúdo é criado e controlado por código JavaScript.
O browser mantém um `CustomElementRegistry` de custom elements definidos, que mapeia uma classe JavaScript instanciável para uma tag HTML.

O pacote `@angular/elements` exporta uma API `createCustomElement()` que fornece uma ponte entre a interface de component do Angular e a funcionalidade de detecção de mudanças para a API DOM nativa.

Transformar um component em um custom element torna toda a infraestrutura Angular necessária disponível para o browser.
Criar um custom element é simples e direto, e conecta automaticamente a view definida pelo seu component com detecção de mudanças e data binding, mapeando a funcionalidade do Angular para os equivalentes HTML nativos correspondentes.

## Usando custom elements

Custom elements fazem bootstrap de si mesmos - eles iniciam quando são adicionados ao DOM, e são destruídos quando removidos do DOM.
Uma vez que um custom element é adicionado ao DOM de qualquer página, ele se parece e se comporta como qualquer outro elemento HTML, e não requer nenhum conhecimento especial de termos ou convenções de uso do Angular.

Para adicionar o pacote `@angular/elements` ao seu workspace, execute o seguinte comando:

```shell

npm install @angular/elements --save

```

### Como funciona

A função `createCustomElement()` converte um component em uma classe que pode ser registrada com o browser como um custom element.
Depois de registrar sua classe configurada com o registro de custom-element do browser, use o novo elemento como um elemento HTML nativo em conteúdo que você adiciona diretamente ao DOM:

```html

<my-popup message="Use Angular!"></my-popup>

```

Quando seu custom element é colocado em uma página, o browser cria uma instância da classe registrada e a adiciona ao DOM.
O conteúdo é fornecido pelo template do component, que usa a sintaxe de template do Angular, e é renderizado usando o component e os dados do DOM.
Propriedades de input no component correspondem a atributos de input para o elemento.

## Transformando components em custom elements

O Angular fornece a função `createCustomElement()` para converter um component Angular, junto com suas dependências, em um custom element.

O processo de conversão implementa a interface `NgElementConstructor`, e cria uma
classe construtora que é configurada para produzir uma instância auto-bootstrap do seu component.

Use a função nativa do browser [`customElements.define()`](https://developer.mozilla.org/docs/Web/API/CustomElementRegistry/define) para registrar o construtor configurado e sua tag de custom-element associada com o [`CustomElementRegistry`](https://developer.mozilla.org/docs/Web/API/CustomElementRegistry) do browser.
Quando o browser encontra a tag para o elemento registrado, ele usa o construtor para criar uma instância de custom-element.

IMPORTANTE: Evite usar o seletor do component como nome da tag do custom element.
Isso pode levar a comportamentos inesperados, devido ao Angular criar duas instâncias de component para um único elemento DOM:
Um component Angular regular e um segundo usando o custom element.

### Mapeamento

Um custom element _hospeda_ um component Angular, fornecendo uma ponte entre os dados e a lógica definidos no component e as APIs DOM padrão.
Propriedades e lógica do component mapeiam diretamente para atributos HTML e o sistema de eventos do browser.

- A API de criação analisa o component procurando por propriedades de input, e define atributos correspondentes para o custom element.
  Ela transforma os nomes das propriedades para torná-los compatíveis com custom elements, que não reconhecem distinções de maiúsculas e minúsculas.
  Os nomes de atributos resultantes usam lowercase separado por traços.
  Por exemplo, para um component com `inputProp = input({alias: 'myInputProp'})`, o custom element correspondente define um atributo `my-input-prop`.

- Outputs do component são despachados como [Custom Events](https://developer.mozilla.org/docs/Web/API/CustomEvent) HTML, com o nome do custom event correspondendo ao nome do output.
  Por exemplo, para um component `with valueChanged = output()`, o custom element correspondente despacha eventos com o nome "valueChanged", e os dados emitidos são armazenados na propriedade `detail` do evento.
  Se você fornecer um alias, esse valor é usado; por exemplo, `clicks = output<string>({alias: 'myClick'});` resulta em eventos despachados com o nome "myClick".

Para mais informações, veja a documentação de Web Component sobre [Creating custom events](https://developer.mozilla.org/docs/Web/Guide/Events/Creating_and_triggering_events#Creating_custom_events).

## Exemplo: Um Popup Service

Anteriormente, quando você queria adicionar um component a uma aplicação em tempo de execução, você tinha que definir um _dynamic component_, e então você teria que carregá-lo, anexá-lo a um elemento no DOM, e conectar todas as dependências, detecção de mudanças e tratamento de eventos.

Usar um custom element Angular torna o processo mais simples e transparente, fornecendo toda a infraestrutura e framework automaticamente —tudo que você precisa fazer é definir o tipo de tratamento de eventos que você deseja.
\(Você ainda precisa excluir o component da compilação, se você não for usá-lo em sua aplicação.\)

O seguinte exemplo de aplicação Popup Service define um component que você pode carregar dinamicamente ou converter para um custom element.

| Arquivos             | Detalhes                                                                                                                                                                                                                                      |
| :------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| `popup.component.ts` | Define um elemento pop-up simples que exibe uma mensagem de entrada, com algumas animações e estilização.                                                                                                                                    |
| `popup.service.ts`   | Cria um service injetável que fornece duas maneiras diferentes de invocar o `PopupComponent`; como um dynamic component, ou como um custom element. Note quanto mais configuração é necessária para o método de carregamento dinâmico.       |     |
| `app.component.ts`   | Define o component raiz da aplicação, que usa o `PopupService` para adicionar o pop-up ao DOM em tempo de execução. Quando a aplicação executa, o construtor do component raiz converte `PopupComponent` em um custom element.              |

Para comparação, a demo mostra ambos os métodos.
Um botão adiciona o popup usando o método de carregamento dinâmico, e o outro usa o custom element.
O resultado é o mesmo, mas a preparação é diferente.

<docs-code-multifile>
    <docs-code header="popup.component.ts" path="adev/src/content/examples/elements/src/app/popup.component.ts"/>
    <docs-code header="popup.service.ts" path="adev/src/content/examples/elements/src/app/popup.service.ts"/>
    <docs-code header="app.component.ts" path="adev/src/content/examples/elements/src/app/app.component.ts"/>
</docs-code-multifile>

## Tipagem para custom elements

APIs DOM genéricas, como `document.createElement()` ou `document.querySelector()`, retornam um tipo de elemento que é apropriado para os argumentos especificados.
Por exemplo, chamar `document.createElement('a')` retorna um `HTMLAnchorElement`, que o TypeScript sabe que tem uma propriedade `href`.
Similarmente, `document.createElement('div')` retorna um `HTMLDivElement`, que o TypeScript sabe que não tem propriedade `href`.

Quando chamadas com elementos desconhecidos, como um nome de custom element \(`popup-element` em nosso exemplo\), os métodos retornam um tipo genérico, como `HTMLElement`, porque o TypeScript não pode inferir o tipo correto do elemento retornado.

Custom elements criados com Angular estendem `NgElement` \(que por sua vez estende `HTMLElement`\).
Adicionalmente, esses custom elements terão uma propriedade para cada input do component correspondente.
Por exemplo, nosso `popup-element` tem uma propriedade `message` do tipo `string`.

Existem algumas opções se você quiser obter tipos corretos para seus custom elements.
Suponha que você crie um custom element `my-dialog` baseado no seguinte component:

```ts

@Component(…)
class MyDialog {
  content =  input(string);
}

```

A maneira mais direta de obter tipagem precisa é fazer cast do valor de retorno dos métodos DOM relevantes para o tipo correto.
Para isso, use os tipos `NgElement` e `WithProperties` \(ambos exportados de `@angular/elements`\):

```ts

const aDialog = document.createElement('my-dialog') as NgElement & WithProperties<{content: string}>;
aDialog.content = 'Hello, world!';
aDialog.content = 123; // <-- ERRO: TypeScript sabe que isso deve ser uma string.
aDialog.body = 'News'; // <-- ERRO: TypeScript sabe que não há propriedade `body` em `aDialog`.

```

Esta é uma boa maneira de obter rapidamente funcionalidades do TypeScript, como verificação de tipos e suporte a autocomplete, para seu custom element.
Mas pode se tornar trabalhoso se você precisar disso em vários lugares, porque você tem que fazer cast do tipo de retorno em cada ocorrência.

Uma maneira alternativa, que só requer definir o tipo de cada custom element uma vez, é aumentar o `HTMLElementTagNameMap`, que o TypeScript usa para inferir o tipo de um elemento retornado com base em seu nome de tag \(para métodos DOM como `document.createElement()`, `document.querySelector()`, etc.\):

```ts

declare global {
  interface HTMLElementTagNameMap {
    'my-dialog': NgElement & WithProperties<{content: string}>;
    'my-other-element': NgElement & WithProperties<{foo: 'bar'}>;
    …
  }
}

```

Agora, o TypeScript pode inferir o tipo correto da mesma forma que faz para elementos nativos:

```ts

document.createElement('div')               //--> HTMLDivElement (elemento nativo)
document.querySelector('foo')               //--> Element        (elemento desconhecido)
document.createElement('my-dialog')         //--> NgElement & WithProperties<{content: string}> (custom element)
document.querySelector('my-other-element')  //--> NgElement & WithProperties<{foo: 'bar'}>      (custom element)

```

## Limitações

Cuidado deve ser tomado ao destruir e depois reanexar custom elements criados com `@angular/elements` devido a problemas com o callback [disconnect()](https://github.com/angular/angular/issues/38778). Casos onde você pode encontrar esse problema são:

- Renderizar um component em um `ng-if` ou `ng-repeat` no `AngularJs`
- Desanexar e reanexar manualmente um elemento ao DOM
