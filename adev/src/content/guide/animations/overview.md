<!-- ia-translate: true -->
# Introdução às animations do Angular

IMPORTANTE: O pacote `@angular/animations` agora está depreciado. A equipe Angular recomenda usar CSS nativo com `animate.enter` e `animate.leave` para animations em todo código novo. Saiba mais no novo [guia de animation](guide/animations) de entrada e saída. Veja também [Migrando do pacote de Animations do Angular](guide/animations/migration) para aprender como você pode começar a migrar para animations CSS puras em suas aplicações.

Animation fornece a ilusão de movimento: elementos HTML mudam de estilo ao longo do tempo.
Animations bem projetadas podem tornar sua aplicação mais intuitiva e envolvente, mas elas não são apenas cosméticas.
Animations podem melhorar sua aplicação e a experiência do usuário de várias formas:

- Sem animations, as transições de páginas web podem parecer bruscas e desconfortáveis
- O movimento melhora muito a experiência do usuário, então as animations dão aos usuários a chance de perceber a resposta da aplicação às suas ações
- Boas animations chamam a atenção do usuário, de forma intuitiva, para onde ela é necessária

Normalmente, animations envolvem múltiplas _transformações_ de estilo ao longo do tempo.
Um elemento HTML pode se mover, mudar de cor, crescer ou encolher, desaparecer gradualmente ou deslizar para fora da página.
Essas mudanças podem ocorrer simultaneamente ou em sequência. Você pode controlar o timing de cada transformação.

O sistema de animation do Angular é construído sobre a funcionalidade do CSS, o que significa que você pode animar qualquer propriedade que o navegador considere animável.
Isso inclui posições, tamanhos, transforms, cores, bordas e muito mais.
O W3C mantém uma lista de propriedades animáveis em sua página de [CSS Transitions](https://www.w3.org/TR/css-transitions-1).

## Sobre este guia {#about-this-guide}

Este guia cobre os recursos básicos de animation do Angular para você começar a adicionar animations do Angular ao seu projeto.

## Começando {#getting-started}

Os principais módulos do Angular para animations são `@angular/animations` e `@angular/platform-browser`.

Para começar a adicionar animations do Angular ao seu projeto, importe os módulos específicos de animation junto com a funcionalidade padrão do Angular.

<docs-workflow>
<docs-step title="Habilitando o módulo de animations {#enabling-the-animations-module}">
Importe `provideAnimationsAsync` de `@angular/platform-browser/animations/async` e adicione-o à lista de providers na chamada da função `bootstrapApplication`.

```ts {header: "Habilitando Animations", linenums}
bootstrapApplication(AppComponent, {
  providers: [provideAnimationsAsync()],
});
```

<docs-callout important title="Se você precisa de animations imediatas na sua aplicação">
  Se você precisa que uma animation aconteça imediatamente quando sua aplicação for carregada,
  você vai querer mudar para o módulo de animations carregado de forma eager. Importe `provideAnimations`
  de `@angular/platform-browser/animations` no lugar, e use `provideAnimations` **em vez de**
  `provideAnimationsAsync` na chamada da função `bootstrapApplication`.
</docs-callout>

Para aplicações baseadas em `NgModule`, importe `BrowserAnimationsModule`, que introduz os recursos de animation no módulo raiz da sua aplicação Angular.

<docs-code header="app.module.ts" path="adev/src/content/examples/animations/src/app/app.module.1.ts"/>
</docs-step>
<docs-step title="Importando funções de animation em arquivos de components {#importing-animation-functions-into-component-files}">
Se você planeja usar funções específicas de animation em arquivos de components, importe essas funções de `@angular/animations`.

<docs-code header="app.ts" path="adev/src/content/examples/animations/src/app/app.ts" region="imports"/>

Veja todas as [funções de animation disponíveis](guide/legacy-animations#animations-api-summary) no final deste guia.

</docs-step>
<docs-step title="Adicionando a propriedade de metadados de animation {#adding-the-animation-metadata-property}">
No arquivo do component, adicione uma propriedade de metadados chamada `animations:` dentro do decorator `@Component()`.
Você coloca o trigger que define uma animation dentro da propriedade de metadados `animations`.

<docs-code header="app.ts" path="adev/src/content/examples/animations/src/app/app.ts" region="decorator"/>
</docs-step>
</docs-workflow>

## Animando uma transição {#animating-a-transition}

Vamos animar uma transição que muda um único elemento HTML de um estado para outro.
Por exemplo, você pode especificar que um botão exiba **Open** ou **Closed** com base na última ação do usuário.
Quando o botão está no estado `open`, ele está visível e amarelo.
Quando está no estado `closed`, ele fica translúcido e azul.

Em HTML, esses atributos são definidos usando estilos CSS comuns, como color e opacity.
No Angular, use a função `style()` para especificar um conjunto de estilos CSS para uso com animations.
Reúna um conjunto de estilos em um estado de animation e dê ao estado um nome, como `open` ou `closed`.

ÚTIL: Vamos criar um novo component `open-close` para animar com transições simples.

Execute o seguinte comando no terminal para gerar o component:

```shell
ng g component open-close
```

Isso criará o component em `src/app/open-close.ts`.

### Estado e estilos de animation {#animation-state-and-styles}

Use a função [`state()`](api/animations/state) do Angular para definir os diferentes estados que serão chamados no final de cada transição.
Essa função recebe dois argumentos:
um nome único, como `open` ou `closed`, e uma função `style()`.

Use a função `style()` para definir um conjunto de estilos a associar a um determinado nome de estado.
Você deve usar _camelCase_ para atributos de estilo que contêm hífens, como `backgroundColor`, ou envolvê-los em aspas, como `'background-color'`.

Veja como a função [`state()`](api/animations/state) do Angular funciona com a função `style⁣­(⁠)` para definir atributos de estilo CSS.
Neste trecho de código, vários atributos de estilo são definidos ao mesmo tempo para o estado.
No estado `open`, o botão tem altura de 200 pixels, opacidade de 1 e cor de fundo amarela.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="state1"/>

No estado `closed` a seguir, o botão tem altura de 100 pixels, opacidade de 0.8 e cor de fundo azul.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="state2"/>

### Transições e timing {#transitions-and-timing}

No Angular, você pode definir vários estilos sem nenhuma animation.
No entanto, sem mais refinamento, o botão muda instantaneamente, sem desaparecer gradualmente, sem encolher ou sem outro indicador visível de que uma mudança está acontecendo.

Para tornar a mudança menos abrupta, você precisa definir uma _transição_ de animation para especificar as mudanças que ocorrem entre um estado e outro ao longo de um período de tempo.
A função `transition()` aceita dois argumentos:
o primeiro argumento recebe uma expressão que define a direção entre dois estados de transição, e o segundo recebe uma ou uma série de etapas `animate()`.

Use a função `animate()` para definir a duração, o atraso e o easing de uma transição, e para designar a função de estilo que define os estilos enquanto as transições estão ocorrendo.
Use a função `animate()` para definir a função `keyframes()` em animations de várias etapas.
Essas definições são colocadas no segundo argumento da função `animate()`.

#### Metadados de animation: duração, atraso e easing {#animation-metadata-duration-delay-and-easing}

A função `animate()` \(segundo argumento da função transition\) aceita os parâmetros de entrada `timings` e `styles`.

O parâmetro `timings` recebe um número ou uma string definida em três partes.

```ts
animate(duration);
```

ou

```ts
animate('duration delay easing');
```

A primeira parte, `duration`, é obrigatória.
A duração pode ser expressa em milissegundos como um número sem aspas, ou em segundos com aspas e um especificador de tempo.
Por exemplo, uma duração de um décimo de segundo pode ser expressa da seguinte forma:

- Como um número simples, em milissegundos:
  `100`

- Em uma string, em milissegundos:
  `'100ms'`

- Em uma string, em segundos:
  `'0.1s'`

O segundo argumento, `delay`, tem a mesma sintaxe de `duration`.
Por exemplo:

- Aguardar 100ms e depois executar por 200ms: `'0.2s 100ms'`

O terceiro argumento, `easing`, controla como a animation [acelera e desacelera](https://easings.net) durante a sua execução.
Por exemplo, `ease-in` faz com que a animation comece devagar e ganhe velocidade conforme avança.

- Aguardar 100ms, executar por 200ms.
  Use uma curva de desaceleração para começar rápido e desacelerar lentamente até um ponto de repouso:
  `'0.2s 100ms ease-out'`

- Executar por 200ms, sem atraso.
  Use uma curva padrão para começar devagar, acelerar no meio e depois desacelerar lentamente no final:
  `'0.2s ease-in-out'`

- Começar imediatamente, executar por 200ms.
  Use uma curva de aceleração para começar devagar e terminar em velocidade máxima:
  `'0.2s ease-in'`

ÚTIL: Veja o tópico do site Material Design sobre [curvas de easing naturais](https://material.io/design/motion/speed.html#easing) para informações gerais sobre curvas de easing.

Este exemplo fornece uma transição de estado de `open` para `closed`, com uma transição de 1 segundo entre os estados.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="transition1"/>

No trecho de código anterior, o operador `=>` indica transições unidirecionais, e `<=>` é bidirecional.
Dentro da transição, `animate()` especifica quanto tempo a transição leva.
Neste caso, a mudança de estado de `open` para `closed` leva 1 segundo, expresso aqui como `1s`.

Este exemplo adiciona uma transição de estado do estado `closed` para o estado `open`, com um arco de transição de animation de 0.5 segundo.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="transition2"/>

ÚTIL: Algumas notas adicionais sobre o uso de estilos dentro das funções [`state`](api/animations/state) e `transition`.

- Use [`state()`](api/animations/state) para definir estilos que são aplicados ao final de cada transição; eles persistem após a conclusão da animation
- Use `transition()` para definir estilos intermediários, que criam a ilusão de movimento durante a animation
- Quando as animations estão desabilitadas, os estilos de `transition()` podem ser ignorados, mas os estilos de [`state()`](api/animations/state) não
- Inclua múltiplos pares de estados dentro do mesmo argumento de `transition()`:

  ```ts
  transition('on => off, off => void');
  ```

### Disparando a animation {#triggering-the-animation}

Uma animation precisa de um _trigger_ para saber quando começar.
A função `trigger()` reúne os estados e as transições e dá um nome à animation, para que você possa anexá-la ao elemento disparador no template HTML.

A função `trigger()` descreve o nome da propriedade que será observada em busca de mudanças.
Quando uma mudança ocorre, o trigger inicia as ações incluídas na sua definição.
Essas ações podem ser transições ou outras funções, como veremos mais adiante.

Neste exemplo, vamos nomear o trigger `openClose` e anexá-lo ao elemento `button`.
O trigger descreve os estados open e closed, e os timings das duas transições.

ÚTIL: Dentro de cada chamada da função `trigger()`, um elemento só pode estar em um estado em um dado momento.
No entanto, é possível que múltiplos triggers estejam ativos ao mesmo tempo.

### Definindo animations e anexando-as ao template HTML {#defining-animations-and-attaching-them-to-the-html-template}

As animations são definidas nos metadados do component que controla o elemento HTML a ser animado.
Coloque o código que define suas animations sob a propriedade `animations:` dentro do decorator `@Component()`.

<docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="component"/>

Quando você define um trigger de animation para um component, anexe-o a um elemento no template desse component, envolvendo o nome do trigger em colchetes e precedendo-o com um símbolo `@`.
Em seguida, você pode vincular o trigger a uma expressão de template usando a sintaxe padrão de property binding do Angular, como mostrado abaixo, em que `triggerName` é o nome do trigger e `expression` é avaliada como um estado de animation definido.

```angular-html
<div [@triggerName]="expression">…</div>
```

A animation é executada, ou disparada, quando o valor da expressão muda para um novo estado.

O trecho de código a seguir vincula o trigger ao valor da propriedade `isOpen`.

<docs-code header="open-close.html" path="adev/src/content/examples/animations/src/app/open-close.1.html" region="trigger"/>

Neste exemplo, quando a expressão `isOpen` é avaliada como um estado definido de `open` ou `closed`, ela notifica o trigger `openClose` de uma mudança de estado.
Cabe então ao código de `openClose` tratar a mudança de estado e iniciar uma animation de mudança de estado.

Para elementos que entram ou saem de uma página (inseridos ou removidos do DOM), você pode tornar as animations condicionais.
Por exemplo, use `*ngIf` com o trigger de animation no template HTML.

ÚTIL: No arquivo do component, defina o trigger que define as animations como o valor da propriedade `animations:` no decorator `@Component()`.

No arquivo de template HTML, use o nome do trigger para anexar as animations definidas ao elemento HTML a ser animado.

### Revisão de código {#code-review}

Estes são os arquivos de código discutidos no exemplo de transição.

<docs-code-multifile>
    <docs-code header="open-close.ts" path="adev/src/content/examples/animations/src/app/open-close.ts" region="component"/>
    <docs-code header="open-close.html" path="adev/src/content/examples/animations/src/app/open-close.1.html" region="trigger"/>
    <docs-code header="open-close.css" path="adev/src/content/examples/animations/src/app/open-close.css"/>
</docs-code-multifile>

### Resumo {#summary}

Você aprendeu a adicionar animation a uma transição entre dois estados, usando `style()` e [`state()`](api/animations/state) junto com `animate()` para o timing.

Saiba mais sobre os recursos avançados de animations do Angular na seção de Animation, começando pelas técnicas avançadas em [transição e triggers](guide/legacy-animations/transition-and-triggers).

## Resumo da API de animations {#animations-api-summary}

A API funcional fornecida pelo módulo `@angular/animations` oferece uma linguagem específica de domínio \(DSL\) para criar e controlar animations em aplicações Angular.
Veja a [referência da API](api?package=angular_animations&status=8) para uma listagem completa e os detalhes de sintaxe das funções principais e das estruturas de dados relacionadas.

| Nome da função                    | O que faz                                                                                                                                                                                                   |
| :-------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `trigger()`                       | Inicia a animation e serve como um container para todas as outras chamadas de funções de animation. O template HTML se vincula a `triggerName`. Use o primeiro argumento para declarar um nome de trigger único. Usa sintaxe de array. |
| `style()`                         | Define um ou mais estilos CSS para usar nas animations. Controla a aparência visual dos elementos HTML durante as animations. Usa sintaxe de objeto.                                                          |
| [`state()`](api/animations/state) | Cria um conjunto nomeado de estilos CSS que devem ser aplicados após uma transição bem-sucedida para um determinado estado. O estado pode então ser referenciado pelo nome dentro de outras funções de animation. |
| `animate()`                       | Especifica as informações de timing para uma transição. Valores opcionais para `delay` e `easing`. Pode conter chamadas `style()` dentro dela.                                                              |
| `transition()`                    | Define a sequência de animation entre dois estados nomeados. Usa sintaxe de array.                                                                                                                          |
| `keyframes()`                     | Permite uma mudança sequencial entre estilos dentro de um intervalo de tempo especificado. Use dentro de `animate()`. Pode incluir várias chamadas `style()` dentro de cada `keyframe()`. Usa sintaxe de array. |
| [`group()`](api/animations/group) | Especifica um grupo de etapas de animation (_animations internas_) a serem executadas em paralelo. A animation continua somente depois que todas as etapas internas forem concluídas. Usado dentro de `sequence()` ou `transition()`. |
| `query()`                         | Encontra um ou mais elementos HTML internos dentro do elemento atual.                                                                                                                                       |
| `sequence()`                      | Especifica uma lista de etapas de animation que são executadas em sequência, uma por uma.                                                                                                                   |
| `stagger()`                       | Escalona o horário de início das animations de vários elementos.                                                                                                                                            |
| `animation()`                     | Produz uma animation reutilizável que pode ser invocada de outro lugar. Usado junto com `useAnimation()`.                                                                                                   |
| `useAnimation()`                  | Ativa uma animation reutilizável. Usado com `animation()`.                                                                                                                                                  |
| `animateChild()`                  | Permite que as animations de components filhos sejam executadas dentro do mesmo intervalo de tempo do pai.                                                                                                 |

</table>

## Mais sobre animations do Angular {#more-on-angular-animations}

ÚTIL: Confira esta [apresentação](https://www.youtube.com/watch?v=rnTK9meY5us), exibida na conferência AngularConnect em novembro de 2017, e o [código-fonte](https://github.com/matsko/animationsftw.in) que a acompanha.

Você também pode se interessar pelo seguinte:

<docs-pill-row>
  <docs-pill href="guide/legacy-animations/transition-and-triggers" title="Transition e triggers"/>
  <docs-pill href="guide/legacy-animations/complex-sequences" title="Sequências complexas de animation"/>
  <docs-pill href="guide/legacy-animations/reusable-animations" title="Animations reutilizáveis"/>
  <docs-pill href="guide/routing/route-transition-animations" title="Animations de transição de rotas"/>
  <docs-pill href="guide/animations/migration" title="Migrando para Animations CSS Nativas"/>
</docs-pill-row>
