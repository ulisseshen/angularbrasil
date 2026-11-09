<!-- ia-translate: true -->
# Lógica entre campos {#cross-field-logic}

A **lógica entre campos** é necessária quando qualquer regra, validação ou comportamento de um campo depende do valor ou do estado de outro campo.

Os Signal Forms fornecem um **contexto de campo** para toda função de regra. O contexto de campo dá acesso ao valor e ao estado do campo atual, e permite ler outros campos do formulário usando `valueOf()`, `stateOf()` e `fieldTreeOf()`.

Este guia aborda em profundidade a API de contexto de campo e mostra padrões comuns de lógica entre campos. Para validação de um único campo, veja o [guia de Validação](/guide/forms/signals/validation).

## Entendendo o contexto de campo {#understanding-the-field-context}

Toda função de regra nos Signal Forms recebe um parâmetro de **contexto de campo**, que é um objeto que descreve o campo atual e dá acesso ao restante do formulário.

Há três propriedades que você pode acessar para o campo atual:

| Propriedade | Tipo                 | Descrição                                                               |
| ----------- | -------------------- | ----------------------------------------------------------------------- |
| `value`     | `Signal<TValue>`     | O valor atual do campo, como um signal                                  |
| `state`     | `FieldState<TValue>` | O estado atual do campo (como validade, erros, tocado, sujo)            |
| `fieldTree` | `FieldTree<TValue>`  | A árvore do campo atual, para acesso programático aos campos filhos     |

Para a lógica entre campos, as três propriedades a seguir permitem acessar outras partes do formulário:

| Propriedade     | Tipo                           | Descrição                                                                                                                                  |
| --------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `valueOf()`     | `(path) => PValue`             | A mais comum. Use quando precisar do valor bruto de outro campo para comparações ou cálculos.                                              |
| `stateOf()`     | `(path) => FieldState<PValue>` | Use quando sua lógica depender do estado de outro campo, como se ele é válido, tocado ou sujo.                                             |
| `fieldTreeOf()` | `(path) => FieldTree<PModel>`  | Use quando precisar de acesso programático à árvore de outro campo, como para enviar erros a um campo filho específico com `validateTree`. |

Aqui está um exemplo que usa `value` e `valueOf()` para validar que o campo atual (data de término) vem depois da data de início no formulário:

```ts
import {Component, signal} from '@angular/core';
import {form, validate} from '@angular/forms/signals';

@Component({/* ... */})
export class EventForm {
  eventModel = signal({
    startDate: new Date('2026-06-01'),
    endDate: new Date('2026-06-05'),
  });

  eventForm = form(this.eventModel, (schemaPath) => {
    validate(schemaPath.endDate, ({value, valueOf}) => {
      if (value() <= valueOf(schemaPath.startDate)) {
        return {
          kind: 'invalidDateRange',
          message: 'End date must be after start date',
        };
      }

      return null;
    });
  });
}
```

NOTE: O parâmetro `fieldContext` normalmente é desestruturado para extrair apenas o que a regra precisa. Os demais exemplos deste guia seguem esse padrão.

## Padrões de validação entre campos {#cross-field-validation-patterns}

O exemplo de intervalo de datas da seção anterior valida a data de término em relação à data de início. Como a regra lê `valueOf(schemaPath.startDate)`, ela é reavaliada automaticamente sempre que qualquer uma das datas muda. Em outras palavras, um único validador basta para manter o estado de erro correto.

No entanto, esse validador único coloca o erro apenas no campo de data de término. Se você quiser que os dois campos mostrem erro quando o intervalo for inválido, adicione uma regra de validação correspondente a cada campo:

```ts
import {Component, signal} from '@angular/core';
import {form, validate} from '@angular/forms/signals';

@Component({/* ... */})
export class EventForm {
  eventModel = signal({
    startDate: new Date('2026-06-01'),
    endDate: new Date('2026-06-05'),
  });

  eventForm = form(this.eventModel, (schemaPath) => {
    validate(schemaPath.startDate, ({value, valueOf}) => {
      if (value() >= valueOf(schemaPath.endDate)) {
        return {
          kind: 'invalidDateRange',
          message: 'Start date must be before end date',
        };
      }
      return null;
    });

    validate(schemaPath.endDate, ({value, valueOf}) => {
      if (value() <= valueOf(schemaPath.startDate)) {
        return {
          kind: 'invalidDateRange',
          message: 'End date must be after start date',
        };
      }
      return null;
    });
  });
}
```

Ambas as regras usam `valueOf()` para ler o outro campo. Como cada regra é reativa, alterar qualquer uma das datas reavalia as duas validações automaticamente.

NOTE: Quando uma regra envolve vários campos, você precisa decidir onde o erro deve aparecer: em um campo específico, em vários campos ou no pai. Em geral, coloque o erro onde o usuário mais provavelmente irá para corrigir o problema.

### Requisitos condicionais {#conditional-requirements}

Em alguns formulários, certos campos são obrigatórios apenas em determinadas condições. Por exemplo, um formulário de cadastro pode exigir um nome de empresa apenas quando o usuário seleciona um tipo de conta empresarial:

```ts
import {Component, signal} from '@angular/core';
import {form, required} from '@angular/forms/signals';

@Component({/* ... */})
export class RegistrationForm {
  registrationModel = signal({
    accountType: 'personal' as 'personal' | 'business',
    companyName: '',
  });

  registrationForm = form(this.registrationModel, (schemaPath) => {
    required(schemaPath.companyName, {
      when: ({valueOf}) => valueOf(schemaPath.accountType) === 'business',
      message: 'Company name is required for business accounts',
    });
  });
}
```

A opção `when` recebe o mesmo contexto de campo de qualquer outra função de regra, então `valueOf` funciona da mesma forma. Quando o usuário volta para `'personal'`, a condição é reavaliada e o requisito — junto com o seu erro — é removido automaticamente.

Usar `required()` com `when` em vez de uma verificação manual com `validate()` também adiciona os metadados de obrigatoriedade adequados ao campo, o que habilita recursos de acessibilidade, como marcar o campo como obrigatório para leitores de tela.

### Validando com base no estado de outro campo {#validating-based-on-another-fields-state}

Os exemplos até agora usam `valueOf()` para ler o valor de outro campo. Às vezes, sua lógica depende do _estado_ de outro campo — se ele é válido, tocado ou sujo. Use `stateOf()` para isso.

Por exemplo, um campo de confirmação de senha só deve verificar se as senhas coincidem depois que o usuário interagir com o campo de senha. Se o usuário ainda não tocou na senha, sinalizar uma divergência na confirmação seria prematuro:

```ts
import {Component, signal} from '@angular/core';
import {form, validate} from '@angular/forms/signals';

@Component({/* ... */})
export class PasswordForm {
  passwordModel = signal({
    password: '',
    confirmPassword: '',
  });

  passwordForm = form(this.passwordModel, (schemaPath) => {
    validate(schemaPath.confirmPassword, ({value, valueOf, stateOf}) => {
      if (!stateOf(schemaPath.password).touched()) {
        return null;
      }
      if (value() !== valueOf(schemaPath.password)) {
        return {
          kind: 'passwordMismatch',
          message: 'Passwords do not match',
        };
      }
      return null;
    });
  });
}
```

A chamada `stateOf()` retorna o [estado do campo](api/forms/signals/FieldState) do outro campo, dando acesso a signals como `invalid()`, `touched()` e `dirty()`. Como esses são signals, a regra é reavaliada sempre que a validade do campo de senha muda.

CRITICAL: Tome cuidado para não ler um estado que depende da validação do seu próprio campo, pois isso cria um ciclo circular. Por exemplo, um validador que verifica se o campo pai é válido criará um loop infinito, porque a validade do pai depende da validade dos filhos (que inclui o seu validador).

## Usando validateTree {#using-validatetree}

Os exemplos até agora usam `validate()` para verificar campos individuais. Às vezes, você precisa validar um grupo de campos em que a lógica é inerentemente sobre vários campos de um grupo, e direcionar os erros a filhos específicos dentro dele. O `validateTree` é ideal para esses cenários.

Por exemplo, em um quebra-cabeça de Sudoku, cada linha precisa conter números únicos. Esta é uma regra em nível de grupo: você verifica a linha inteira e, em seguida, sinaliza as células específicas que violam a regra. Esse tipo de validação não pode ser expresso de forma limpa com `validate` em campos individuais, porque cada célula precisaria conhecer todas as outras células:

```ts
import {Component, signal} from '@angular/core';
import {form, validateTree} from '@angular/forms/signals';

@Component({/* ... */})
export class SudokuRow {
  rowModel = signal({
    cell1: 1,
    cell2: 3,
    cell3: 1,
    cell4: 4,
  });

  rowForm = form(this.rowModel, (schemaPath) => {
    validateTree(schemaPath, ({value, fieldTreeOf}) => {
      const row = value();
      const entries = [
        {val: row.cell1, fieldTree: fieldTreeOf(schemaPath.cell1)},
        {val: row.cell2, fieldTree: fieldTreeOf(schemaPath.cell2)},
        {val: row.cell3, fieldTree: fieldTreeOf(schemaPath.cell3)},
        {val: row.cell4, fieldTree: fieldTreeOf(schemaPath.cell4)},
      ];

      const counts = new Map<number, number>();
      for (const {val} of entries) {
        if (val !== 0) {
          counts.set(val, (counts.get(val) ?? 0) + 1);
        }
      }

      const errors = entries
        .filter(({val}) => val !== 0 && (counts.get(val) ?? 0) > 1)
        .map(({val, fieldTree}) => ({
          kind: 'duplicateInRow',
          message: `${val} already appears in this row`,
          fieldTree,
        }));

      return errors.length > 0 ? errors : null;
    });
  });
}
```

O validador é executado no campo pai (a linha), lê os valores de todas as células, conta as duplicatas e retorna um erro para cada célula que contém um número repetido. A propriedade `fieldTree` de cada erro informa ao Angular exatamente qual célula deve mostrar o erro. Sem `fieldTree`, os erros se aplicariam à própria linha — e não ao lugar onde o usuário precisa vê-los.

Como o `validateTree` pode retornar um array de erros, um único validador pode sinalizar várias células de uma vez. Cada erro inclui um `fieldTree` apontando para o seu destino, então o Angular direciona os erros aos campos corretos.

### Quando usar validateTree ou validate {#when-to-use-validatetree-vs-validate}

Prefira `validate()` com `valueOf()` quando o erro pertencer ao campo que está sendo validado — mesmo que a regra leia outros campos. Use `validateTree` quando:

- A lógica de validação for inerentemente sobre um grupo de campos, e não sobre um campo isolado
- O validador precisar retornar erros direcionados a campos filhos diferentes

TIP: Para uma introdução ao `validateTree` e ao seu tipo de retorno, veja o [guia de Validação](/guide/forms/signals/validation).

## Próximos passos {#next-steps}

Este guia abordou a API de contexto de campo e padrões comuns de lógica entre campos. Para saber mais sobre guias relacionados de Signal Forms, confira:

<docs-pill-row>
  <docs-pill href="guide/forms/signals/validation" title="Validação" />
  <docs-pill href="guide/forms/signals/field-state-management" title="Gerenciamento de estado do campo" />
  <docs-pill href="guide/forms/signals/custom-controls" title="Controles personalizados" />
</docs-pill-row>
