<!-- ia-translate: true -->
# Criar um pipe personalizado

Você pode criar pipes personalizados no Angular para atender às suas necessidades de transformação de dados.

NOTE: Saiba mais sobre [criação de pipes personalizados no guia detalhado](/guide/templates/pipes#creating-custom-pipes).

Nesta atividade, você criará um pipe personalizado e o usará no seu template.

<hr>

Um pipe é uma classe TypeScript com um decorator `@Pipe`. Aqui está um exemplo:

```ts
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'star',
})
export class StarPipe implements PipeTransform {
  transform(value: string): string {
    return `⭐️ ${value} ⭐️`;
  }
}
```

O `StarPipe` aceita um valor string e retorna essa string com estrelas ao redor. Observe que:

- o nome na configuração do decorator `@Pipe` é o que será usado no template
- a função `transform` é onde você coloca a sua lógica

Certo, agora é a sua vez de experimentar: você criará o `ReversePipe`.

<docs-workflow>

<docs-step title="Crie o `ReversePipe` {#create-the-reversepipe}">

Em `reverse.pipe.ts`, adicione o decorator `@Pipe` à classe `ReversePipe` e forneça a seguinte configuração:

```ts
@Pipe({
  name: 'reverse'
})
```

</docs-step>

<docs-step title="Implemente a função `transform` {#implement-the-transform-function}">

Agora a classe `ReversePipe` é um pipe. Atualize a função `transform` para adicionar a lógica de reversão:

```ts {highlight:[3,4,5,6,7,8,9]}
export class ReversePipe implements PipeTransform {
  transform(value: string): string {
    let reverse = '';

    for (let i = value.length - 1; i >= 0; i--) {
      reverse += value[i];
    }

    return reverse;
  }
}
```

</docs-step>

<docs-step title="Use o `ReversePipe` no template {#use-the-reversepipe-in-the-template}">
Com a lógica do pipe implementada, o passo final é usá-lo no template. Em `app.ts`, inclua o pipe no template e adicione-o aos imports do component:

```angular-ts {highlight:[3,4]}
@Component({
  ...
  template: `Reverse Machine: {{ word | reverse }}`,
  imports: [ReversePipe]
})
```

</docs-step>

</docs-workflow>

E com isso você concluiu a atividade. Parabéns! Agora você sabe como usar pipes e até como implementar seus próprios pipes personalizados.
