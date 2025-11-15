<!-- ia-translate: true -->
# Components no Angular

Components são os blocos de construção fundamentais para qualquer aplicação Angular. Cada component tem três partes:

- Classe TypeScript
- Template HTML
- Estilos CSS

Nota: Saiba mais sobre [components no guia de fundamentos](/essentials/components).

Nesta atividade, você aprenderá como atualizar o template e estilos de um component.

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

Quando você mudou o template HTML, a pré-visualização atualizou com sua mensagem. Vamos um passo além: mude a cor do texto.
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

No Angular, você pode usar todo o CSS e HTML suportado pelo browser que estiver disponível. Se desejar, você pode armazenar seu template e estilos em arquivos separados.
