<!-- ia-translate: true -->
# Components no Angular {#components-in-angular}

Components são os blocos de construção fundamentais para qualquer aplicação Angular. Cada component tem três partes:

- Classe TypeScript
- Template HTML
- Estilos CSS

NOTE: Saiba mais sobre [components no guia de fundamentos](/essentials/components).

Nesta atividade, você aprenderá como atualizar o template e os estilos de um component.

<hr />

Esta é uma ótima oportunidade para você começar com Angular.

<docs-workflow>

<docs-step title="Atualizar o template do component">
Atualize a propriedade `template` para exibir `Hello Universe`

```ts
template: `
  Hello Universe
`,
```

Quando você alterar o template HTML, a pré-visualização será atualizada com sua mensagem. Vamos um passo além: mude a cor do texto.
</docs-step>

<docs-step title="Atualizar os estilos do component">
Atualize o valor de styles e mude a propriedade `color` de `blue` para `#a144eb`.

```ts
styles: `
  :host {
    color: #a144eb;
  }
`,
```

Quando você verificar a pré-visualização, verá que a cor do texto foi alterada.
</docs-step>

</docs-workflow>

No Angular, você pode usar todo o CSS e HTML suportados pelos navegadores que estiverem disponíveis. Se quiser, você pode armazenar seu template e seus estilos em arquivos separados.
