<!-- ia-translate: true -->
<docs-decorative-header title="Forms with Angular Signals" imgSrc="adev/src/assets/images/signals.svg"> <!-- markdownlint-disable-line -->
</docs-decorative-header>

Signal Forms é uma biblioteca que permite gerenciar o state de formulários em aplicações Angular, construindo sobre a base reativa dos signals. Com two-way binding automático, acesso a fields type-safe e validação baseada em schema, Signal Forms ajudam você a criar formulários robustos.

TIP: Para uma introdução rápida ao Signal Forms, veja o [guia essencial de Signal Forms](essentials/signal-forms).

## Por que Signal Forms? {#why-signal-forms}

Construir formulários em aplicações web envolve gerenciar várias preocupações interconectadas: rastrear os valores dos fields, validar a entrada do usuário, tratar os states de erro e manter a UI sincronizada com o seu model de dados. Gerenciar essas preocupações separadamente cria código repetitivo (boilerplate) e complexidade.

Signal Forms resolve esses desafios:

- **Sincronizando o state automaticamente** - Sincroniza automaticamente o model de dados do formulário com os fields vinculados
- **Oferecendo type safety** - Suporta schemas e vínculos totalmente type-safe entre os controles da UI e o model de dados
- **Centralizando a lógica de validação** - Defina todas as regras de validação em um só lugar, usando um schema de validação

Signal Forms funcionam melhor em aplicações novas construídas com signals. Se você está trabalhando em uma aplicação existente que usa reactive forms, reactive forms continuam sendo uma escolha sólida.

NOTE: Se você vem de template forms ou reactive forms, pode se interessar pelo [guia de comparação](guide/forms/signals/comparison).

## Pré-requisitos {#prerequisites}

Signal Forms requer:

- Angular v21 ou superior

## Configuração {#setup}

Signal Forms já estão incluídos no pacote `@angular/forms`. Importe as funções e directives necessárias de `@angular/forms/signals`:

```ts
import {form, FormField, required, email} from '@angular/forms/signals';
```

A directive `FormField` deve ser importada em qualquer component que vincule fields de formulário a inputs HTML:

```ts
@Component({
  // ...
  imports: [FormField],
})
```

## Próximos passos {#next-steps}

Para saber mais sobre como o Signal Forms funciona, confira os guias a seguir:

<docs-pill-row>
  <docs-pill href="essentials/signal-forms" title="Signal forms essentials" />
  <docs-pill href="guide/forms/signals/models" title="Form models" />
  <docs-pill href="guide/forms/signals/model-design" title="Designing your form model" />
  <docs-pill href="guide/forms/signals/field-state-management" title="Field state management" />
  <docs-pill href="guide/forms/signals/validation" title="Validation" />
  <docs-pill href="guide/forms/signals/custom-controls" title="Custom controls" />
  <docs-pill href="guide/forms/signals/comparison" title="Comparison with other form systems" />
</docs-pill-row>
