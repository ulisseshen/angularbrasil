<!-- ia-translate: true -->
# Configuração avançada de components {#advanced-component-configuration}

TIP: Este guia pressupõe que você já leu o [Guia de Fundamentos](essentials). Leia-o primeiro se você é novo no Angular.

## ChangeDetectionStrategy

O decorator `@Component` aceita uma opção `changeDetection` que controla o **modo de detecção de mudanças** do component. Há dois modos de detecção de mudanças disponíveis.

**`ChangeDetectionStrategy.Eager`/`Default`** é um modo opcional. Neste modo, o Angular verifica se o DOM do component precisa de uma atualização sempre que alguma atividade possa ter ocorrido em toda a aplicação. Atividades que disparam essa verificação incluem interação do usuário, resposta de rede, timers e outras.

**`ChangeDetectionStrategy.OnPush`** é a estratégia padrão (desde a v22). Este modo reduz a quantidade de verificações que o Angular precisa realizar. Neste modo, o framework verifica se o DOM de um component precisa de uma atualização apenas quando:

- Um input do component sofre mudanças como resultado de um binding em um template, ou
- Um event listener neste component é executado
- O component é explicitamente marcado para verificação, via `ChangeDetectorRef.markForCheck` ou algo que o envolva, como o `AsyncPipe`.

Além disso, quando um component OnPush é verificado, o Angular _também_ verifica todos os seus components ancestrais, percorrendo a árvore da aplicação para cima.

## PreserveWhitespaces

Por padrão, o Angular remove e colapsa espaços em branco supérfluos nos templates, mais comumente provenientes de quebras de linha e indentação. Você pode alterar esta configuração definindo explicitamente `preserveWhitespaces` como
`true` nos metadados de um component.

## Schemas de elementos customizados {#custom-element-schemas}

Por padrão, o Angular lança um erro quando encontra um elemento HTML desconhecido. Você pode desabilitar esse comportamento para um component incluindo `CUSTOM_ELEMENTS_SCHEMA` na propriedade `schemas` dos metadados do seu component.

```angular-ts
import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

@Component({
  ...,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: '<some-unknown-component />'
})
export class ComponentWithCustomElements { }
```

O Angular também fornece `NO_ERRORS_SCHEMA`, que permite qualquer elemento e qualquer propriedade.
