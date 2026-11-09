<!-- ia-translate: true -->
# Visão geral de Angular elements {#angular-elements-overview}

_Angular elements_ são components Angular empacotados como _custom elements_ \(também chamados Web Components\), um padrão web para definir novos elementos HTML de forma independente de framework.

[Custom elements](https://developer.mozilla.org/docs/Web/Web_Components/Using_custom_elements) são um recurso da Web Platform disponível em todos os browsers suportados pelo Angular.
Um custom element estende o HTML permitindo que você defina uma tag cujo conteúdo é criado e controlado por código JavaScript.
O browser mantém um `CustomElementRegistry` com os custom elements definidos, que mapeia uma classe JavaScript instanciável para uma tag HTML.

O pacote `@angular/elements` exporta uma API `createCustomElement()` que fornece uma ponte entre a interface de component do Angular, com sua funcionalidade de detecção de mudanças, e a API DOM nativa do browser.

Transformar um component em um custom element torna disponível para o browser toda a infraestrutura necessária do Angular.
Criar um custom element é simples e direto, e conecta automaticamente a view definida pelo seu component com a detecção de mudanças e o data binding, mapeando a funcionalidade do Angular para os equivalentes HTML nativos correspondentes.

## Usando custom elements {#using-custom-elements}

Custom elements fazem bootstrap de si mesmos: eles são iniciados quando são adicionados ao DOM e destruídos quando são removidos dele.
Depois que um custom element é adicionado ao DOM de qualquer página, ele se parece e se comporta como qualquer outro elemento HTML, sem exigir nenhum conhecimento especial dos termos ou das convenções de uso do Angular.

Para adicionar o pacote `@angular/elements` ao seu workspace, execute o seguinte comando:

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install @angular/elements
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add @angular/elements
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add @angular/elements
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add @angular/elements
  </docs-code>
</docs-code-multifile>

### Como funciona {#how-it-works}

A função `createCustomElement()` converte um component em uma classe que pode ser registrada no browser como um custom element.
Depois de registrar sua classe configurada no registro de custom elements do browser, use o novo elemento como se fosse um elemento HTML nativo em conteúdo que você adiciona diretamente ao DOM:

```html
<my-popup message="Use Angular!" />
```

Quando seu custom element é colocado em uma página, o browser cria uma instância da classe registrada e a adiciona ao DOM.
O conteúdo é fornecido pelo template do component, que usa a sintaxe de template do Angular e é renderizado com os dados do component e do DOM.
As propriedades de input do component correspondem aos atributos de input do elemento.

## Transformando components em custom elements {#transforming-components-to-custom-elements}

O Angular fornece a função `createCustomElement()` para converter um component Angular, junto com suas dependências, em um custom element.

O processo de conversão implementa a interface `NgElementConstructor` e cria uma
classe construtora configurada para produzir uma instância auto-inicializável do seu component.

Use a função nativa do browser [`customElements.define()`](https://developer.mozilla.org/docs/Web/API/CustomElementRegistry/define) para registrar o construtor configurado e a tag de custom element associada no [`CustomElementRegistry`](https://developer.mozilla.org/docs/Web/API/CustomElementRegistry) do browser.
Quando o browser encontra a tag do elemento registrado, ele usa o construtor para criar uma instância do custom element.

IMPORTANT: Evite usar o selector do component como nome da tag do custom element.
Isso pode levar a comportamentos inesperados, pois o Angular cria duas instâncias de component para um único elemento DOM:
um component Angular comum e uma segunda instância usando o custom element.

### Mapeamento {#mapping}

Um custom element _hospeda_ um component Angular, fornecendo uma ponte entre os dados e a lógica definidos no component e as APIs DOM padrão.
As propriedades e a lógica do component são mapeadas diretamente para atributos HTML e para o sistema de eventos do browser.

- A API de criação analisa o component procurando propriedades de input e define atributos correspondentes para o custom element.
  Ela transforma os nomes das propriedades para torná-los compatíveis com custom elements, que não diferenciam maiúsculas de minúsculas.
  Os nomes dos atributos resultantes usam minúsculas separadas por hífen.
  Por exemplo, para um component com `inputProp = input('', {alias: 'myInputProp'})`, o custom element correspondente define um atributo `my-input-prop`.

- Os outputs do component são despachados como [Custom Events](https://developer.mozilla.org/docs/Web/API/CustomEvent) HTML, com o nome do custom event correspondendo ao nome do output.
  Por exemplo, para um component com `valueChanged = output()`, o custom element correspondente despacha eventos com o nome "valueChanged", e os dados emitidos ficam armazenados na propriedade `detail` do evento.
  Se você fornecer um alias, esse valor é usado; por exemplo, `clicks = output<string>({alias: 'myClick'});` resulta em eventos despachados com o nome "myClick".

Para mais informações, veja a documentação de Web Components sobre [Creating custom events](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Events#creating_custom_events).

## Exemplo: um Popup Service {#example-a-popup-service}

Para adicionar um component a uma aplicação em tempo de execução, você pode [renderizá-lo programaticamente](guide/components/programmatic-rendering) com a API `createComponent`.
Com essa abordagem, você é responsável pela infraestrutura ao redor: anexar a host view do component ao `ApplicationRef` para que a detecção de mudanças seja executada, definir seus inputs, se inscrever nos seus outputs e desanexar e limpar a view quando o component for removido.

Usar um custom element do Angular torna o processo mais simples e transparente, pois fornece toda essa infraestrutura automaticamente. Tudo o que você precisa fazer é definir o tipo de tratamento de eventos que deseja.

A seguinte aplicação de exemplo Popup Service define um component que você pode carregar dinamicamente ou converter em um custom element.

| Arquivos           | Detalhes                                                                                                                                                                                                                                                  |
| :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `popup.ts`         | Define um elemento pop-up simples que exibe uma mensagem de input, com algumas animações e estilos.                                                                                                                                                       |
| `popup.service.ts` | Cria um service injetável que oferece duas formas diferentes de invocar o `Popup`: como um dynamic component ou como um custom element. Repare em quanta configuração adicional é necessária para o método de carregamento dinâmico.                       |
| `app.ts`           | Define o component raiz da aplicação, que usa o `PopupService` para adicionar o pop-up ao DOM em tempo de execução. Quando a aplicação roda, o construtor do component raiz converte o `Popup` em um custom element.                                     |

Para comparação, a demo mostra os dois métodos.
Um botão adiciona o popup usando o método de carregamento dinâmico, e o outro usa o custom element.
O resultado é o mesmo, mas a preparação é diferente.

<docs-code-multifile>
    <docs-code language="angular-ts" header="popup.ts" path="adev/src/content/examples/elements/src/app/popup.ts"/>
    <docs-code header="popup.service.ts" path="adev/src/content/examples/elements/src/app/popup.service.ts"/>
    <docs-code header="app.ts" path="adev/src/content/examples/elements/src/app/app.ts"/>
</docs-code-multifile>

## Tipagens para custom elements {#typings-for-custom-elements}

APIs DOM genéricas, como `document.createElement()` ou `document.querySelector()`, retornam um tipo de elemento apropriado para os argumentos especificados.
Por exemplo, chamar `document.createElement('a')` retorna um `HTMLAnchorElement`, que o TypeScript sabe que tem uma propriedade `href`.
Da mesma forma, `document.createElement('div')` retorna um `HTMLDivElement`, que o TypeScript sabe que não tem propriedade `href`.

Quando chamados com elementos desconhecidos, como o nome de um custom element \(`popup-element` em nosso exemplo\), os métodos retornam um tipo genérico, como `HTMLElement`, porque o TypeScript não consegue inferir o tipo correto do elemento retornado.

Custom elements criados com Angular estendem `NgElement` \(que, por sua vez, estende `HTMLElement`\).
Além disso, esses custom elements terão uma propriedade para cada input do component correspondente.
Por exemplo, nosso `popup-element` tem uma propriedade `message` do tipo `string`.

Existem algumas opções se você quiser obter tipos corretos para seus custom elements.
Suponha que você crie um custom element `my-dialog` com base no seguinte component:

```ts
@Component(/* ... */)
class MyDialog {
  content = input('');
}
```

A forma mais direta de obter tipagens precisas é fazer cast do valor de retorno dos métodos DOM relevantes para o tipo correto.
Para isso, use os tipos `NgElement` e `WithProperties` \(ambos exportados de `@angular/elements`\):

```ts
const aDialog = document.createElement('my-dialog') as NgElement &
  WithProperties<{content: string}>;
aDialog.content = 'Hello, world!';
aDialog.content = 123; // <-- ERRO: o TypeScript sabe que isso deve ser uma string.
aDialog.body = 'News'; // <-- ERRO: o TypeScript sabe que não há propriedade `body` em `aDialog`.
```

Essa é uma boa forma de obter rapidamente recursos do TypeScript, como verificação de tipos e suporte a autocomplete, para seu custom element.
Mas pode ficar trabalhoso se você precisar disso em vários lugares, porque terá que fazer cast do tipo de retorno em cada ocorrência.

Uma alternativa, que exige definir o tipo de cada custom element apenas uma vez, é estender o `HTMLElementTagNameMap`, que o TypeScript usa para inferir o tipo de um elemento retornado com base no nome da tag (para métodos DOM como `document.createElement()`, `document.querySelector()`, etc.):

```ts

declare global {
  interface HTMLElementTagNameMap {
    'my-dialog': NgElement & WithProperties<{content: string}>;
    'my-other-element': NgElement & WithProperties<{foo: 'bar'}>;
    …
  }
}

```

Agora, o TypeScript consegue inferir o tipo correto da mesma forma que faz para elementos nativos:

```ts
document.createElement('div'); //--> HTMLDivElement (elemento nativo)
document.querySelector('foo'); //--> Element        (elemento desconhecido)
document.createElement('my-dialog'); //--> NgElement & WithProperties<{content: string}> (custom element)
document.querySelector('my-other-element'); //--> NgElement & WithProperties<{foo: 'bar'}>      (custom element)
```

## Limitações {#limitations}

Tenha cuidado ao destruir e depois reanexar custom elements criados com `@angular/elements`, devido a problemas com o callback [disconnect()](https://github.com/angular/angular/issues/38778). Casos em que você pode encontrar esse problema são:

- Renderizar um component em um `ng-if` ou `ng-repeat` no `AngularJS`
- Desanexar e reanexar manualmente um elemento ao DOM
