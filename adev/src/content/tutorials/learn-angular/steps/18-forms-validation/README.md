<!-- ia-translate: true -->
# Validando formulários

Outro cenário comum ao trabalhar com formulários é a necessidade de validar as entradas para garantir que os dados corretos sejam enviados.

Nota: Saiba mais sobre [validação de entrada de formulário no guia detalhado](/guide/forms/reactive-forms#validating-form-input).

Nesta atividade, você aprenderá como validar formulários com reactive forms.

<hr>

<docs-workflow>

<docs-step title="Importar Validators">

Angular fornece um conjunto de ferramentas de validação. Para usá-las, primeiro atualize o component para importar `Validators` de `@angular/forms`.

<docs-code language="ts" highlight="[1]">
import {ReactiveFormsModule, Validators} from '@angular/forms';

@Component({...})
export class App {}
</docs-code>

</docs-step>

<docs-step title="Adicionar validação ao formulário">

Cada `FormControl` pode receber os `Validators` que você deseja usar para validar os valores do `FormControl`. Por exemplo, se você quiser tornar o campo `name` em `profileForm` obrigatório, use `Validators.required`.
Para o campo `email` em nosso formulário Angular, queremos garantir que ele não seja deixado vazio e siga uma estrutura de endereço de e-mail válida. Podemos conseguir isso combinando os validators `Validators.required` e `Validators.email` em um array.
Atualize os `FormControl` de `name` e `email`:

```ts
profileForm = new FormGroup({
  name: new FormControl('', Validators.required),
  email: new FormControl('', [Validators.required, Validators.email]),
});
```

</docs-step>

<docs-step title="Verificar validação do formulário no template">

Para determinar se um formulário é válido, a classe `FormGroup` tem uma propriedade `valid`.
Você pode usar essa propriedade para vincular atributos dinamicamente. Atualize o `button` de submit para ser ativado com base na validade do formulário.

```angular-html
<button type="submit" [disabled]="!profileForm.valid">Submit</button>
```

</docs-step>

</docs-workflow>

Agora você conhece o básico sobre como a validação funciona com reactive forms.

Ótimo trabalho aprendendo esses conceitos fundamentais de trabalho com formulários no Angular. Se você quiser aprender mais, consulte a [documentação de formulários do Angular](guide/forms/form-validation).
