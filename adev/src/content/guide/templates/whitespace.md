<!-- ia-translate: true -->
# Whitespace em templates

Por padrão, templates Angular não preservam whitespace que o framework considera desnecessário. Isso ocorre comumente em duas situações: whitespace entre elementos e whitespace colapsável dentro de texto.

## Whitespace entre elementos

A maioria dos desenvolvedores prefere formatar seus templates com quebras de linha e indentação para tornar o template legível:

```angular-html
<section>
  <h3>User profile</h3>
  <label>
    User name
    <input>
  </label>
</section>
```

Este template contém whitespace entre todos os elementos. O seguinte trecho mostra o mesmo HTML com cada caractere de whitespace substituído pelo caractere hash (`#`) para destacar quanto whitespace está presente:

```angular-html
<!-- Total Whitespace: 20 -->
<section>###<h3>User profile</h3>###<label>#####User name#####<input>###</label>#</section>
```

Preservar o whitespace como escrito no template resultaria em muitos [nós de texto](https://developer.mozilla.org/en-US/docs/Web/API/Text) desnecessários e aumentaria a sobrecarga de renderização da página. Ao ignorar esse whitespace entre elementos, o Angular realiza menos trabalho ao renderizar o template na página, melhorando o desempenho geral.

## Whitespace colapsável dentro de texto

Quando seu navegador web renderiza HTML em uma página, ele colapsa múltiplos caracteres de whitespace consecutivos em um único caractere:

```angular-html
<!-- What it looks like in the template -->
<p>Hello         world</p>
```

Neste exemplo, o navegador exibe apenas um único espaço entre "Hello" e "world".

```angular-html
<!-- What shows up in the browser -->
<p>Hello world</p>
```

Consulte [Como whitespace é tratado por HTML, CSS e no DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Whitespace) para mais contexto sobre como isso funciona.

O Angular evita enviar esses caracteres de whitespace desnecessários para o navegador em primeiro lugar, colapsando-os em um único caractere quando compila o template.

## Preservando whitespace

Você pode instruir o Angular a preservar whitespace em um template especificando `preserveWhitespaces: true` no decorator `@Component` para um template.

```angular-ts
@Component({
  /* ... */,
  preserveWhitespaces: true,
  template: `
    <p>Hello         world</p>
  `
})
```

Evite configurar esta opção a menos que seja absolutamente necessário. Preservar whitespace pode fazer com que o Angular produza significativamente mais nós durante a renderização, desacelerando sua aplicação.

Você pode adicionalmente usar uma entidade HTML especial exclusiva do Angular, `&ngsp;`. Esta entidade produz um único caractere de espaço que é preservado na saída compilada.
