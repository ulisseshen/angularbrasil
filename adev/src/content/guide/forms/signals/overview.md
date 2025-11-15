<!-- ia-translate: true -->
<docs-decorative-header title="Forms with Angular Signals" imgSrc="adev/src/assets/images/signals.svg"> <!-- markdownlint-disable-line -->
</docs-decorative-header>

CRITICAL: Signal Forms são [experimentais](/reference/releases#experimental). A API pode mudar em versões futuras. Evite usar APIs experimentais em aplicações de produção sem entender os riscos.

Signal Forms é uma biblioteca experimental que permite gerenciar o estado do formulário em aplicações Angular construindo sobre a base reativa de signals. Com vinculação bidirecional automática, acesso a campos type-safe e validação baseada em schema, Signal Forms ajudam você a criar formulários robustos.

TIP: Para uma introdução rápida ao Signal Forms, veja o [guia essencial de Signal Forms](essentials/signal-forms).

## Por que Signal Forms?

Construir formulários em aplicações web envolve gerenciar várias preocupações interconectadas: rastrear valores de campos, validar entrada do usuário, lidar com estados de erro e manter a UI sincronizada com seu modelo de dados. Gerenciar essas preocupações separadamente cria código boilerplate e complexidade.

Signal Forms abordam esses desafios ao:

- **Sincronizar estado automaticamente** - Sincroniza automaticamente o modelo de dados do formulário com os campos de formulário vinculados
- **Fornecer type safety** - Suporta schemas totalmente type safe e vinculações entre seus controles de UI e modelo de dados
- **Centralizar lógica de validação** - Defina todas as regras de validação em um só lugar usando um schema de validação

Signal Forms funcionam melhor em novas aplicações construídas com signals. Se você está trabalhando com uma aplicação existente que usa reactive forms, ou se você precisa de garantias de estabilidade de produção, reactive forms permanecem uma escolha sólida.

<!-- TODO: UNCOMMENT SECTION BELOW WHEN AVAILABLE -->
<!-- NOTE: If you're coming from template or reactive forms, you may be interested in our [comparison guide](guide/forms/signal-forms/comparison). -->

## Pré-requisitos

Signal Forms requerem:

- Angular v21 ou superior

## Configuração

Signal Forms já estão incluídos no pacote `@angular/forms`. Importe as funções e directives necessárias de `@angular/forms/signals`:

```ts
import { form, Field, required, email } from '@angular/forms/signals'
```

A directive `Field` deve ser importada em qualquer component que vincule campos de formulário a inputs HTML:

```ts
@Component({
  // ...
  imports: [Field],
})
```

<!-- TODO: UNCOMMENT SECTION BELOW WHEN AVAILABLE -->
<!-- ## Next steps

To learn more about how Signal Forms work, check out the following guides:

<docs-pill-row>
  <docs-pill href="essentials/signal-forms" title="Signal forms essentials" />
  <docs-pill href="guide/forms/signal-forms/models" title="Form models" />
  <docs-pill href="guide/forms/signal-forms/field-state-management" title="Field state management" />
  <docs-pill href="guide/forms/signal-forms/validation" title="Validation" />
  <docs-pill href="guide/forms/signal-forms/custom-controls" title="Custom controls" />
</docs-pill-row> -->
