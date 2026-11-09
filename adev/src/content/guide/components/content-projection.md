<!-- ia-translate: true -->
# Projeção de conteúdo com ng-content {#content-projection-with-ng-content}

TIP: Este guia pressupõe que você já leu o [Guia de Fundamentos](essentials). Leia-o primeiro se você é novo no Angular.

Com frequência, você precisa criar components que atuam como containers para diferentes tipos de conteúdo. Por exemplo, você pode querer criar um component de card personalizado:

```angular-ts
@Component({
  selector: 'custom-card',
  template: '<div class="card-shadow"> <!-- o conteúdo do card vai aqui --> </div>',
})
export class CustomCard {
  /* ... */
}
```

**Você pode usar o elemento `<ng-content>` como um espaço reservado para marcar onde o conteúdo deve ir**:

```angular-ts
@Component({
  selector: 'custom-card',
  template: '<div class="card-shadow"> <ng-content/> </div>',
})
export class CustomCard {
  /* ... */
}
```

TIP: `<ng-content>` funciona de forma semelhante ao [elemento nativo `<slot>`](https://developer.mozilla.org/docs/Web/HTML/Element/slot), mas com algumas funcionalidades específicas do Angular.

Quando você usa um component com `<ng-content>`, quaisquer filhos do elemento host do component são renderizados, ou **projetados**, no local desse `<ng-content>`:

```angular-ts
// Código-fonte do component
@Component({
  selector: 'custom-card',
  template: `
    <div class="card-shadow">
      <ng-content />
    </div>
  `,
})
export class CustomCard {
  /* ... */
}
```

```angular-html
<!-- Usando o component -->
<custom-card>
  <p>Este é o conteúdo projetado</p>
</custom-card>
```

```angular-html
<!-- O DOM renderizado -->
<custom-card>
  <div class="card-shadow">
    <p>Este é o conteúdo projetado</p>
  </div>
</custom-card>
```

O Angular se refere a quaisquer filhos de um component passados dessa forma como o **conteúdo** desse component. Isso é diferente da **view** do component, que se refere aos elementos definidos no template do component.

**O elemento `<ng-content>` não é um component nem um elemento DOM**. Em vez disso, ele é um espaço reservado especial que informa ao Angular onde renderizar o conteúdo. O compilador do Angular processa todos os elementos `<ng-content>` em tempo de build. Você não pode inserir, remover ou modificar `<ng-content>` em tempo de execução. Você não pode adicionar directives, estilos ou atributos arbitrários ao `<ng-content>`.

IMPORTANT: Você não deve incluir `<ng-content>` condicionalmente com `@if`, `@for` ou `@switch`. O Angular sempre instancia e cria nós DOM para o conteúdo renderizado em um espaço reservado `<ng-content>`, mesmo que esse espaço reservado esteja oculto. Para renderização condicional do conteúdo de um component, consulte [Fragmentos de template](api/core/ng-template).

## Múltiplos espaços reservados de conteúdo {#multiple-content-placeholders}

O Angular permite projetar múltiplos elementos diferentes em diferentes espaços reservados `<ng-content>` com base em seletores CSS. Expandindo o exemplo do card acima, você pode criar dois espaços reservados, um para o título do card e outro para o corpo, usando o atributo `select`:

```angular-ts
@Component({
  selector: 'card-title',
  template: `<ng-content>card-title</ng-content>`,
})
export class CardTitle {}

@Component({
  selector: 'card-body',
  template: `<ng-content>card-body</ng-content>`,
})
export class CardBody {}
```

```angular-ts
<!-- Template do component -->
@Component({
  selector: 'custom-card',
  template: `
  <div class="card-shadow">
    <ng-content select="card-title" />
    <div class="card-divider"></div>
    <ng-content select="card-body" />
  </div>
  `,
})
export class CustomCard {}
```

```angular-ts
<!-- Usando o component -->
@Component({
  selector: 'app-root',
  imports: [CustomCard, CardTitle, CardBody],
  template: `
    <custom-card>
      <card-title>Olá</card-title>
      <card-body>Bem-vindo ao exemplo</card-body>
    </custom-card>
`,
})
export class App {}
```

```angular-html
<!-- O DOM renderizado -->
<custom-card>
  <div class="card-shadow">
    <card-title>Olá</card-title>
    <div class="card-divider"></div>
    <card-body>Bem-vindo ao exemplo</card-body>
  </div>
</custom-card>
```

O espaço reservado `<ng-content>` suporta os mesmos seletores CSS que os [seletores de components](guide/components/selectors).

Se você incluir um ou mais espaços reservados `<ng-content>` com um atributo `select` e um espaço reservado `<ng-content>` sem atributo `select`, este último captura todos os elementos que não corresponderam a nenhum atributo `select`:

```angular-html
<!-- Template do component -->
<div class="card-shadow">
  <ng-content select="card-title" />
  <div class="card-divider"></div>
  <!-- captura tudo, exceto "card-title" -->
  <ng-content />
</div>
```

```angular-html
<!-- Usando o component -->
<custom-card>
  <card-title>Olá</card-title>
  <img src="..." />
  <p>Bem-vindo ao exemplo</p>
</custom-card>
```

```angular-html
<!-- O DOM renderizado -->
<custom-card>
  <div class="card-shadow">
    <card-title>Olá</card-title>
    <div class="card-divider"></div>
    <img src="..." />
    <p>Bem-vindo ao exemplo</p>
  </div>
</custom-card>
```

Se um component não incluir um espaço reservado `<ng-content>` sem atributo `select`, quaisquer elementos que não correspondam a nenhum dos espaços reservados do component não serão renderizados no DOM.

## Conteúdo de fallback {#fallback-content}

O Angular pode exibir _conteúdo de fallback_ para um espaço reservado `<ng-content>` de um component se esse component não tiver nenhum conteúdo filho correspondente. Você pode especificar o conteúdo de fallback adicionando conteúdo filho ao próprio elemento `<ng-content>`.

```angular-html
<!-- Template do component -->
<div class="card-shadow">
  <ng-content select="card-title">Título padrão</ng-content>
  <div class="card-divider"></div>
  <ng-content select="card-body">Corpo padrão</ng-content>
</div>
```

```angular-html
<!-- Usando o component -->
<custom-card>
  <card-title>Olá</card-title>
  <!-- Nenhum card-body foi fornecido -->
</custom-card>
```

```angular-html
<!-- O DOM renderizado -->
<custom-card>
  <div class="card-shadow">
    <card-title>Olá</card-title>
    <div class="card-divider"></div>
    Corpo padrão
  </div>
</custom-card>
```

## Criando alias de conteúdo para projeção {#aliasing-content-for-projection}

O Angular oferece um atributo especial, `ngProjectAs`, que permite especificar um seletor CSS em qualquer elemento. Sempre que um elemento com `ngProjectAs` é verificado contra um espaço reservado `<ng-content>`, o Angular compara com o valor de `ngProjectAs` em vez da identidade do elemento:

```angular-html
<!-- Template do component -->
<div class="card-shadow">
  <ng-content select="card-title" />
  <div class="card-divider"></div>
  <ng-content />
</div>
```

```angular-html
<!-- Usando o component -->
<custom-card>
  <h3 ngProjectAs="card-title">Olá</h3>

  <p>Bem-vindo ao exemplo</p>
</custom-card>
```

```angular-html
<!-- O DOM renderizado -->
<custom-card>
  <div class="card-shadow">
    <h3>Olá</h3>
    <div class="card-divider"></div>
    <p>Bem-vindo ao exemplo</p>
  </div>
</custom-card>
```

`ngProjectAs` aceita apenas valores estáticos e não pode ser vinculado a expressões dinâmicas.

## Ressalvas {#caveats}

### O conteúdo projetado fica na view do pai {#projected-content-lives-in-the-parents-view}

Mesmo que o conteúdo projetado seja _renderizado_ dentro do component que o recebe, ele continua pertencendo ao component que o declarou. O Angular o trata como parte da view do pai, o que tem alguns efeitos colaterais que vale conhecer.

**Detecção de mudanças:** O conteúdo projetado é verificado quando o _pai_ executa a detecção de mudanças. Se o component que recebe o conteúdo usar `OnPush`, o Angular pode pular a verificação do template próprio desse component, mas não pulará o conteúdo projetado, porque ele pertence ao pai.

```angular-html
<!-- Template do pai (detecção de mudanças padrão) -->
<onpush-wrapper>
  <!-- Continua sendo verificado a cada ciclo do pai; o OnPush não ajuda aqui -->
  <expensive-component />
</onpush-wrapper>
```

**Injeção de dependência:** O conteúdo projetado obtém suas dependências do injector do pai, e não dos `viewProviders` do component que o recebe. Consulte [Providers e viewProviders](guide/di/hierarchical-dependency-injection) para mais detalhes.

### Alguns componentes de biblioteca não suportam filhos projetados {#some-library-components-dont-support-projected-children}

Alguns components, como menus, tabs e listas, usam `ContentChildren` para encontrar seus filhos e configurar comportamentos como navegação por teclado, gerenciamento de foco ou atributos ARIA. Eles são escritos partindo do pressuposto de que são donos diretos dos seus filhos, por isso projetar conteúdo externo neles tende a quebrar as coisas de formas sutis.

Por exemplo, envolver elementos `<mat-menu-item>` em uma camada extra e projetá-los em `<mat-menu>` pode quebrar silenciosamente a navegação por teclado e o suporte a leitores de tela. A query ainda encontra os itens, mas a configuração interna que os torna interativos pode não funcionar corretamente quando os itens vêm de um contexto de view diferente.

Se um component de biblioteca gerencia o comportamento dos seus filhos, verifique a documentação dele antes de recorrer à projeção de conteúdo, pois pode não haver suporte.
