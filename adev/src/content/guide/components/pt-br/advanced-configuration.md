<!-- ia-translate: true -->
# Configuração avançada de components

TIP: Este guia assume que você já leu o [Guia de Fundamentos](essentials). Leia-o primeiro se você é novo no Angular.

## ChangeDetectionStrategy

O decorator `@Component` aceita uma opção `changeDetection` que controla o **modo de detecção de mudanças** do component. Existem duas opções de modo de detecção de mudanças.

**`ChangeDetectionStrategy.Default`** é, sem surpresa, a estratégia padrão. Neste modo,
o Angular verifica se o DOM do component precisa de uma atualização sempre que qualquer atividade possa ter ocorrido
em toda a aplicação. Atividades que acionam esta verificação incluem interação do usuário, resposta de rede,
timers, e mais.

**`ChangeDetectionStrategy.OnPush`** é um modo opcional que reduz a quantidade de verificações que o Angular
precisa realizar. Neste modo, o framework verifica se o DOM de um component precisa de uma atualização apenas quando:

- Um input do component tem mudanças como resultado de um binding em um template, ou
- Um event listener neste component é executado
- O component é explicitamente marcado para verificação, via `ChangeDetectorRef.markForCheck` ou algo que o envolva, como `AsyncPipe`.

Além disso, quando um component OnPush é verificado, o Angular _também_ verifica todos os seus components
ancestrais, percorrendo para cima através da árvore da aplicação.

## PreserveWhitespaces

Por padrão, o Angular remove e colapsa espaços em branco supérfluos em templates, mais comumente de
quebras de linha e indentação. Você pode alterar esta configuração definindo explicitamente `preserveWhitespaces` como
`true` nos metadados de um component.

## Custom element schemas

Por padrão, o Angular lança um erro quando encontra um elemento HTML desconhecido. Você pode
desabilitar este comportamento para um component incluindo `CUSTOM_ELEMENTS_SCHEMA` na propriedade `schemas`
nos metadados do seu component.

```angular-ts
import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';

@Component({
  ...,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: '<some-unknown-component></some-unknown-component>'
})
export class ComponentWithCustomElements { }
```

O Angular não suporta nenhum outro schema neste momento.
