<!-- ia-translate: true -->
# Pipes

Pipes são funções que são usadas para transformar dados em templates. Em geral, pipes são funções "puras" que não causam efeitos colaterais. Angular possui vários pipes integrados úteis que você pode importar e usar em seus components. Você também pode criar um pipe personalizado.

Nota: Saiba mais sobre [pipes no guia detalhado](/guide/templates/pipes).

Nesta atividade, você importará um pipe e o usará no template.

<hr>

Para usar um pipe em um template, inclua-o em uma expressão interpolada. Confira este exemplo:

<docs-code language="angular-ts" highlight="[1,5,6]">
import {UpperCasePipe} from '@angular/common';

@Component({
...
template: `{{ loudMessage | uppercase }}`,
imports: [UpperCasePipe],
})
export class App {
loudMessage = 'we think you are doing great!'
}
</docs-code>

Agora, é sua vez de experimentar:

<docs-workflow>

<docs-step title="Importar o pipe `LowerCase`">
Primeiro, atualize `app.ts` adicionando o import no nível do arquivo para `LowerCasePipe` de `@angular/common`.

```ts
import { LowerCasePipe } from '@angular/common';
```

</docs-step>

<docs-step title="Adicionar o pipe aos imports do template">
Em seguida, atualize o decorator `@Component()` adicionando `imports` para incluir uma referência a `LowerCasePipe`

<docs-code language="ts" highlight="[3]">
@Component({
  ...
  imports: [LowerCasePipe]
})
</docs-code>

</docs-step>

<docs-step title="Adicionar o pipe ao template">
Por fim, em `app.ts` atualize o template para incluir o pipe `lowercase`:

```ts
template: `{{username | lowercase }}`
```

</docs-step>

</docs-workflow>

Pipes também podem aceitar parâmetros que podem ser usados para configurar sua saída. Descubra mais na próxima atividade.

P.S. você está indo muito bem ⭐️
