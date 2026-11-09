<!-- ia-translate: true -->
# Pipes

Pipes são funções usadas para transformar dados em templates. Em geral, pipes são funções "puras", que não causam efeitos colaterais. O Angular possui vários pipes integrados úteis, que você pode importar e usar nos seus components. Você também pode criar um pipe personalizado.

NOTE: Saiba mais sobre [pipes no guia detalhado](/guide/templates/pipes).

Nesta atividade, você importará um pipe e o usará no template.

<hr>

Para usar um pipe em um template, inclua-o em uma expressão interpolada. Confira este exemplo:

```angular-ts {highlight:[1,5,6]}
import {UpperCasePipe} from '@angular/common';

@Component({
  ...
  template: `{{ loudMessage | uppercase }}`,
  imports: [UpperCasePipe],
})
export class App {
  loudMessage = 'we think you are doing great!'
}
```

Agora é sua vez de experimentar:

<docs-workflow>

<docs-step title="Importe o pipe `LowerCase`">
Primeiro, atualize `app.ts` adicionando o import no nível do arquivo para `LowerCasePipe`, de `@angular/common`.

```ts
import {LowerCasePipe} from '@angular/common';
```

</docs-step>

<docs-step title="Adicione o pipe aos imports do template">
Em seguida, atualize o decorator `@Component()` adicionando, em `imports`, uma referência ao `LowerCasePipe`.

```ts {highlight:[3]}
@Component({
  ...
  imports: [LowerCasePipe]
})
```

</docs-step>

<docs-step title="Adicione o pipe ao template">
Por fim, em `app.ts`, atualize o template para incluir o pipe `lowercase`:

```angular-html
template: `{{ username | lowercase }}`
```

</docs-step>

</docs-workflow>

Pipes também podem aceitar parâmetros, que podem ser usados para configurar sua saída. Descubra mais na próxima atividade.

P.S. você está indo muito bem ⭐️
