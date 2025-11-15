<!-- ia-translate: true -->
# Padrões de design para SDKs de IA e APIs de signal

Interagir com IA e APIs de Modelos de Linguagem Grandes (LLM) introduz desafios únicos, como gerenciar operações assíncronas, lidar com dados de streaming e projetar uma experiência de usuário responsiva para requisições de rede potencialmente lentas ou não confiáveis. Os [signals](guide/signals) do Angular e a API [`resource`](guide/signals/resource) fornecem ferramentas poderosas para resolver esses problemas de forma elegante.

## Disparando requisições com signals

Um padrão comum ao trabalhar com prompts fornecidos pelo usuário é separar a entrada ao vivo do usuário do valor submetido que dispara a chamada da API.

1. Armazene a entrada bruta do usuário em um signal enquanto ele digita
2. Quando o usuário submete (por exemplo, clicando em um botão), atualize um segundo signal com o conteúdo do primeiro signal.
3. Use o segundo signal no campo **`params`** do seu `resource`.

Essa configuração garante que a função **`loader`** do resource só seja executada quando o usuário submeter explicitamente seu prompt, não a cada tecla pressionada. Você pode usar parâmetros de signal adicionais, como um `sessionId` ou `userId` (que pode ser útil para criar sessões LLM persistentes), no campo `loader`. Dessa forma, a requisição sempre usa os valores atuais desses parâmetros sem re-disparar a função assíncrona definida no campo `loader`.

Muitos SDKs de IA fornecem métodos auxiliares para fazer chamadas de API. Por exemplo, a biblioteca cliente Genkit expõe um método `runFlow` para chamar flows Genkit, que você pode chamar de um `loader` de resource. Para outras APIs, você pode usar o [`httpResource`](guide/signals/resource#reactive-data-fetching-with-httpresource).

O exemplo a seguir mostra um `resource` que busca partes de uma história gerada por IA. O `loader` é disparado apenas quando o signal `storyInput` muda.

```ts
// A resource that fetches three parts of an AI generated story
storyResource = resource({
  // The default value to use before the first request or on error
  defaultValue: DEFAULT_STORY,
  // The loader is re-triggered when this signal changes
  params: () => this.storyInput(),
  // The async function to fetch data
  loader: ({params}): Promise<StoryData> => {
    // The params value is the current value of the storyInput signal
    const url = this.endpoint();
    return runFlow({ url, input: {
      userInput: params,
      sessionId: this.storyService.sessionId() // Read from another signal
    }});
  }
});
```

## Preparando dados do LLM para templates

Você pode configurar APIs de LLM para retornar dados estruturados. Tipar fortemente seu `resource` para corresponder à saída esperada do LLM fornece melhor segurança de tipo e autocompletar do editor.

Para gerenciar estado derivado de um resource, use um signal `computed` ou `linkedSignal`. Como `linkedSignal` [fornece acesso a valores anteriores](guide/signals/linked-signal), ele pode servir uma variedade de casos de uso relacionados a IA, incluindo

- construir um histórico de chat
- preservar ou customizar dados que os templates exibem enquanto LLMs geram conteúdo

No exemplo abaixo, `storyParts` é um `linkedSignal` que anexa as últimas partes da história retornadas de `storyResource` ao array existente de partes da história.

```ts
storyParts = linkedSignal<string[], string[]>({
  // The source signal that triggers the computation
  source: () => this.storyResource.value().storyParts,
  // The computation function
  computation: (newStoryParts, previous) => {
    // Get the previous value of this linkedSignal, or an empty array
    const existingStoryParts = previous?.value || [];
    // Return a new array with the old and new parts
    return [...existingStoryParts, ...newStoryParts];
  }
});
```

## Performance e experiência do usuário

APIs de LLM podem ser mais lentas e mais propensas a erros do que APIs convencionais e mais determinísticas. Você pode usar vários recursos do Angular para construir uma interface performática e amigável ao usuário.

- **Scoped Loading:** coloque o `resource` no component que usa diretamente os dados. Isso ajuda a limitar ciclos de change detection (especialmente em aplicações zoneless) e previne bloquear outras partes da sua aplicação. Se os dados precisam ser compartilhados entre múltiplos components, forneça o `resource` de um service.
- **SSR e Hydration:** use Server-Side Rendering (SSR) com incremental hydration para renderizar o conteúdo inicial da página rapidamente. Você pode mostrar um placeholder para o conteúdo gerado por IA e adiar a busca dos dados até que o component seja hidratado no cliente.
- **Loading State:** use o [status](guide/signals/resource#resource-status) `LOADING` do `resource` para mostrar um indicador, como um spinner, enquanto a requisição está em andamento. Este status cobre tanto carregamentos iniciais quanto recarregamentos.
- **Error Handling e Retries:** use o método [**`reload()`**](guide/signals/resource#reloading) do `resource` como uma maneira simples para usuários tentarem novamente requisições que falharam, que podem ser mais prevalentes ao depender de conteúdo gerado por IA.

O exemplo a seguir demonstra como criar uma UI responsiva para exibir dinamicamente uma imagem gerada por IA com funcionalidade de carregamento e retry.

```angular-html
<!-- Display a loading spinner while the LLM generates the image -->
@if (imgResource.isLoading()) {
  <div class="img-placeholder">
    <mat-spinner [diameter]="50" />
  </div>
<!-- Dynamically populates the src attribute with the generated image URL -->
} @else if (imgResource.hasValue()) {
  <img [src]="imgResource.value()" />
<!-- Provides a retry option if the request fails  -->
} @else {
  <div class="img-placeholder" (click)="imgResource.reload()">
    <mat-icon fontIcon="refresh" />
      <p>Failed to load image. Click to retry.</p>
  </div>
}
```

## Padrões de IA em ação: streaming de respostas de chat

Interfaces frequentemente exibem resultados parciais de APIs baseadas em LLM de forma incremental à medida que os dados de resposta chegam. A API resource do Angular fornece a capacidade de fazer streaming de respostas para suportar este tipo de padrão. A propriedade `stream` de `resource` aceita uma função assíncrona que você pode usar para aplicar atualizações a um valor de signal ao longo do tempo. O signal sendo atualizado representa os dados sendo transmitidos.

```ts
characters = resource({
  stream: async () => {
    const data = signal<ResourceStreamItem<string>>({value: ''});
    // Calls a Genkit streaming flow using the streamFlow method
    // exposed by the Genkit client SDK
    const response = streamFlow({
      url: '/streamCharacters',
      input: 10
    });

    (async () => {
      for await (const chunk of response.stream) {
        data.update((prev) => {
          if ('value' in prev) {
            return { value: `${prev.value} ${chunk}` };
          } else {
            return { error: chunk as unknown as Error };
          }
        });
      }
    })();

    return data;
  }
});
```

O membro `characters` é atualizado de forma assíncrona e pode ser exibido no template.

```angular-html
@if (characters.isLoading()) {
  <p>Loading...</p>
} @else if (characters.hasValue()) {
  <p>{{characters.value()}}</p>
} @else {
  <p>{{characters.error()}}</p>
}
```

No lado do servidor, em `server.ts` por exemplo, o endpoint definido envia os dados a serem transmitidos para o cliente. O código a seguir usa Gemini com o framework Genkit, mas esta técnica é aplicável a outras APIs que suportam respostas de streaming de LLMs:

```ts
import { startFlowServer } from '@genkit-ai/express';
import { genkit } from "genkit/beta";
import { googleAI, gemini20Flash } from "@genkit-ai/googleai";

const ai = genkit({ plugins: [googleAI()] });

export const streamCharacters = ai.defineFlow({
    name: 'streamCharacters',
    inputSchema: z.number(),
    outputSchema: z.string(),
    streamSchema: z.string(),
  },
  async (count, { sendChunk }) => {
    const { response, stream } = ai.generateStream({
    model: gemini20Flash,
    config: {
      temperature: 1,
    },
    prompt: `Generate ${count} different RPG game characters.`,
  });

  (async () => {
    for await (const chunk of stream) {
      sendChunk(chunk.content[0].text!);
    }
  })();

  return (await response).text;
});

startFlowServer({
  flows: [streamCharacters],
});

```
