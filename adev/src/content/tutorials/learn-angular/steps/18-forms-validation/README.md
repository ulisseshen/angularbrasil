<!-- ia-translate: true -->
# Validando forms

Outro cenário comum ao trabalhar com forms é a necessidade de validar as entradas, para garantir que os dados corretos sejam enviados.

NOTE: Saiba mais sobre [validação de entrada de forms no guia detalhado](/guide/forms/reactive-forms#validating-form-input).

Nesta atividade, você aprenderá como validar forms com reactive forms.

<hr>

<docs-workflow>

<docs-step title="Importe Validators {#import-validators}">

O Angular fornece um conjunto de ferramentas de validação. Para usá-las, primeiro atualize o component para importar `Validators` de `@angular/forms`.

```ts {highlight:[1]}
import {ReactiveFormsModule, Validators} from '@angular/forms';

@Component({...})
export class App {}
```

</docs-step>

<docs-step title="Adicione validação ao form {#add-validation-to-form}">

Cada `FormControl` pode receber os `Validators` que você quer usar para validar seus valores. Por exemplo, se você quiser tornar o campo `name` em `profileForm` obrigatório, use `Validators.required`.
Para o campo `email` do nosso form Angular, queremos garantir que ele não seja deixado vazio e que siga a estrutura de um endereço de e-mail válido. Podemos conseguir isso combinando os validators `Validators.required` e `Validators.email` em um array.
Atualize os `FormControl` de `name` e `email`:

```ts
profileForm = new FormGroup({
  name: new FormControl('', Validators.required),
  email: new FormControl('', [Validators.required, Validators.email]),
});
```

</docs-step>

<docs-step title="Verifique a validação do form no template {#check-form-validation-in-template}">

Para determinar se um form é válido, a classe `FormGroup` tem uma propriedade `valid`.
Você pode usar essa propriedade para vincular atributos dinamicamente. Atualize o `button` de submit para ser habilitado com base na validade do form.

```angular-html
<button type="submit" [disabled]="!profileForm.valid">Submit</button>
```

</docs-step>

</docs-workflow>

Agora você conhece o básico de como a validação funciona com reactive forms.

Ótimo trabalho aprendendo esses conceitos centrais de trabalho com forms no Angular. Se quiser aprender mais, consulte a [documentação de forms do Angular](guide/forms/form-validation).
