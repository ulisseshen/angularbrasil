<!-- ia-translate: true -->
<!-- TODO: need an Angular + AI logo -->

<docs-decorative-header title="Construa com IA" imgSrc="adev/src/assets/images/what_is_angular.svg"> <!-- markdownlint-disable-line -->
Construa aplicações com IA. Desenvolva mais rápido com IA.
</docs-decorative-header>

HELPFUL: Quer começar a construir no seu IDE favorito com IA? <br>Confira nossas [regras de prompt e boas práticas](/ai/develop-with-ai).

IA generativa (GenAI) com modelos de linguagem grandes (LLMs) permite a criação de experiências de aplicação sofisticadas e envolventes, incluindo conteúdo personalizado, recomendações inteligentes, geração e compreensão de mídia, resumo de informações e funcionalidades dinâmicas.

Desenvolver recursos como esses exigia, antes, uma profunda expertise de domínio e um esforço significativo de engenharia. No entanto, novos produtos e SDKs estão reduzindo a barreira de entrada. O Angular é adequado para integrar IA à sua aplicação web por causa de:

- As APIs de template robustas do Angular permitem a criação de UIs dinâmicas e bem compostas, feitas de conteúdo gerado
- Uma arquitetura sólida baseada em signals, projetada para gerenciar dados e estado de forma dinâmica
- O Angular se integra perfeitamente com SDKs e APIs de IA

Este guia demonstra como você pode usar o [Genkit](/ai#build-ai-powered-applications-with-genkit-and-angular), o [Firebase AI Logic](/ai#build-ai-powered-applications-with-firebase-ai-logic-and-angular) e a [Gemini API](/ai#build-ai-powered-applications-with-gemini-api-and-angular) para infundir suas aplicações Angular com IA hoje. Ele vai impulsionar a sua jornada de desenvolvimento de aplicações web com IA, explicando como começar a integrar IA em aplicações Angular. Este guia também compartilha recursos, como starter kits, código de exemplo e receitas para fluxos de trabalho comuns, que você pode usar para se atualizar rapidamente.

Para começar, você deve ter um entendimento básico do Angular. Novo no Angular? Experimente nosso [guia de essenciais](/essentials) ou nossos [tutoriais de introdução](/tutorials).

NOTE: Embora esta página apresente integrações e exemplos com produtos de IA do Google, ferramentas como o Genkit são agnósticas de modelo e permitem que você escolha o seu próprio modelo. Em muitos casos, os exemplos e amostras de código são aplicáveis a outras soluções de terceiros.

## Começando {#getting-started}

Construir aplicações com IA é um campo novo e em rápido desenvolvimento. Pode ser desafiador decidir por onde começar e quais tecnologias escolher. A seção a seguir apresenta três opções para você escolher:

1. _Genkit_ oferece a escolha de [modelos suportados e uma interface com uma API unificada](https://genkit.dev) para construir aplicações full-stack. Ideal para aplicações que exigem lógica de IA sofisticada no back-end, como recomendações personalizadas.

1. _Firebase AI Logic_ fornece uma API segura do lado do cliente para os modelos do Google, para construir aplicações somente do lado do cliente ou aplicativos móveis. Melhor para recursos de IA interativos diretamente no navegador, como análise de texto em tempo real ou chatbots básicos.

1. _Gemini API_ permite construir uma aplicação que usa diretamente os métodos e as funcionalidades expostos pela superfície da API, sendo melhor para aplicações full-stack. Adequada para aplicações que precisam de controle direto sobre os modelos de IA, como geração de imagens personalizadas ou processamento profundo de dados.

### Construa aplicações com IA usando Genkit e Angular {#build-ai-powered-applications-with-genkit-and-angular}

O [Genkit](https://genkit.dev) é um toolkit open-source projetado para ajudar você a construir recursos com IA em aplicações web e móveis. Ele oferece uma interface unificada para integrar modelos de IA do Google, OpenAI, Anthropic, Ollama e outros, para que você possa explorar e escolher os melhores modelos para as suas necessidades. Como uma solução do lado do servidor, suas aplicações web precisam de um ambiente de servidor compatível, como um servidor baseado em Node, para integrar com o Genkit. Construir uma aplicação full-stack usando Angular SSR oferece, por exemplo, o código inicial do lado do servidor.

Aqui estão exemplos de como construir com Genkit e Angular:

- [Aplicações agênticas com o starter-kit de Genkit e Angular](https://github.com/angular/examples/tree/main/genkit-angular-starter-kit) — Novo em construir com IA? Comece aqui com uma aplicação básica que apresenta um fluxo de trabalho agêntico. O lugar perfeito para começar a sua primeira experiência de construção com IA.

- [Use o Genkit em uma aplicação Angular](https://genkit.dev/docs/frameworks/angular/) — Construa uma aplicação básica que usa Genkit Flows, Angular e Gemini 2.5 Flash. Este passo a passo guia você na criação de uma aplicação Angular full-stack com recursos de IA.

- [Aplicação Dynamic Story Generator](https://github.com/angular/examples/tree/main/genkit-angular-story-generator) — Aprenda a construir uma aplicação Angular agêntica com Genkit, Gemini e Imagen 3 para gerar dinamicamente uma história com base na interação do usuário, com painéis de imagens bonitos para acompanhar os eventos que acontecem. Comece aqui se você quiser experimentar um caso de uso mais avançado.

  Este exemplo também tem um vídeo passo a passo detalhado da funcionalidade:
  - [Assista "Building Agentic Apps with Angular and Genkit live!"](https://youtube.com/live/mx7yZoIa2n4?feature=share)
  - [Assista "Building Agentic Apps with Angular and Genkit live! PT 2"](https://youtube.com/live/YR6LN5_o3B0?feature=share)

- [Building Agentic apps with Firebase and Google Cloud (Barista Example)](https://developers.google.com/solutions/learn/agentic-barista) - Aprenda a construir uma aplicação agêntica de pedidos de café com Firebase e Google Cloud. Este exemplo usa tanto o Firebase AI Logic quanto o Genkit.

- [Creating Dynamic, Server-Driven UIs](https://github.com/angular/examples/tree/main/dynamic-sdui-app) - Aprenda a construir aplicações Angular agênticas com views de UI geradas em tempo de execução com base na entrada do usuário.

  Este exemplo também tem um vídeo passo a passo detalhado da funcionalidade:
  - [Assista "Exploring the future of web apps"](https://www.youtube.com/live/4qargCqOu70?feature=share)

### Construa aplicações com IA usando Firebase AI Logic e Angular {#build-ai-powered-applications-with-firebase-ai-logic-and-angular}

O [Firebase AI Logic](https://firebase.google.com/products/vertex-ai-in-firebase) fornece uma forma segura de interagir com a API Vertex AI Gemini ou a API Imagen diretamente das suas aplicações web e móveis. Isso é interessante para desenvolvedores Angular, já que as aplicações podem ser full-stack ou somente do lado do cliente. Se você está desenvolvendo uma aplicação somente do lado do cliente, o Firebase AI Logic é uma boa escolha para incorporar IA às suas aplicações web.

Aqui está um exemplo de como construir com Firebase AI Logic e Angular:

- [Firebase AI Logic x Angular Starter Kit](https://github.com/angular/examples/tree/main/firebase-ai-logic-angular-example) - Use este starter-kit para construir uma aplicação de e-commerce com um agente de chat que pode executar tarefas. Comece aqui se você não tem experiência em construir com Firebase AI Logic e Angular.

  Este exemplo inclui um [vídeo passo a passo detalhado explicando a funcionalidade e demonstrando como adicionar novos recursos](https://youtube.com/live/4vfDz2al_BI).

### Construa aplicações com IA usando Gemini API e Angular {#build-ai-powered-applications-with-gemini-api-and-angular}

A [Gemini API](https://ai.google.dev/gemini-api/docs) fornece acesso a modelos de última geração do Google que aceitam entrada de áudio, imagens, vídeo e texto. Esses modelos são otimizados para casos de uso específicos. [Saiba mais no site de documentação da Gemini API](https://ai.google.dev/gemini-api/docs/models).

- [Template de aplicação Angular de editor de texto com IA](https://github.com/FirebaseExtended/firebase-framework-tools/tree/main/starters/angular/ai-text-editor) - Use este template para começar com um editor de texto totalmente funcional, com recursos de IA como refinar texto, expandir texto e formalizar texto. Este é um bom ponto de partida para ganhar experiência com chamadas à Gemini API via HTTP.

- [Template de aplicação Angular de chatbot com IA](https://github.com/FirebaseExtended/firebase-framework-tools/tree/main/starters/angular/ai-chatbot) - Este template começa com uma interface de chatbot que se comunica com a Gemini API via HTTP.

## Boas práticas {#best-practices}

### Conectando a provedores de modelos e mantendo suas credenciais de API seguras {#connecting-to-model-providers-and-keeping-your-api-credentials-secure}

Ao conectar a provedores de modelos, é importante manter seus segredos de API seguros. _Nunca coloque sua chave de API em um arquivo que é enviado para o cliente, como o `environments.ts`_.

A arquitetura da sua aplicação determina quais APIs e ferramentas de IA escolher. Especificamente, escolha com base em se a sua aplicação é do lado do cliente ou do lado do servidor. Ferramentas como o Firebase AI Logic fornecem uma conexão segura com as APIs de modelo para código do lado do cliente. Se você quiser usar uma API diferente do Firebase AI Logic ou preferir usar outro provedor de modelo, considere criar um proxy-server ou até mesmo o [Cloud Functions for Firebase](https://firebase.google.com/docs/functions) para servir como proxy e não expor suas chaves de API.

Para um exemplo de conexão usando uma aplicação do lado do cliente, veja o código: [repositório de exemplo Firebase AI Logic Angular](https://github.com/angular/examples/tree/main/firebase-ai-logic-angular-example).

Para conexões do lado do servidor com APIs de modelo que exigem chaves de API, prefira usar um gerenciador de segredos ou variável de ambiente, e não o `environments.ts`. Você deve seguir as boas práticas padrão para proteger chaves de API e credenciais. O Firebase agora fornece um novo gerenciador de segredos com as atualizações mais recentes do Firebase App Hosting. Para saber mais, [confira a documentação oficial](https://firebase.google.com/docs/app-hosting/configure).

Para um exemplo de conexão do lado do servidor em uma aplicação full-stack, veja o código: [repositório Angular AI Example (Genkit and Angular Story Generator)](https://github.com/angular/examples/tree/main/genkit-angular-story-generator).

### Use tool calling para aprimorar aplicações {#use-tool-calling-to-enhance-apps}

Se você quer construir fluxos de trabalho agênticos, em que agentes são capazes de agir e usar ferramentas para resolver problemas com base em prompts, use "tool calling". Tool calling, também conhecido como function calling, é uma forma de dar aos LLMs a capacidade de fazer requisições de volta para a aplicação que os chamou. Como desenvolvedor, você define quais ferramentas estão disponíveis e controla como ou quando as ferramentas são chamadas.

Tool calling aprimora ainda mais as suas aplicações web, expandindo a sua integração de IA além de um chatbot de perguntas e respostas. Na prática, você pode capacitar o seu modelo a solicitar chamadas de função usando a API de function calling do seu provedor de modelo. As ferramentas disponíveis podem ser usadas para executar ações mais complexas no contexto da sua aplicação.

No [exemplo de e-commerce](https://github.com/angular/examples/blob/main/firebase-ai-logic-angular-example/src/app/ai.service.ts#L88) do [repositório de exemplos do Angular](https://github.com/angular/examples), o LLM solicita chamadas a funções de inventário para obter o contexto necessário para executar tarefas mais complexas, como calcular quanto custará um grupo de itens na loja. O escopo da API disponível fica a seu critério como desenvolvedor, assim como decidir se deve ou não chamar uma função solicitada pelo LLM. Você continua no controle do fluxo de execução. Você pode expor, por exemplo, funções específicas de um serviço, mas não todas as funções desse serviço.

### Lidando com respostas não determinísticas {#handling-non-deterministic-responses}

Como os modelos podem retornar resultados não determinísticos, suas aplicações devem ser projetadas com isso em mente. Aqui estão algumas estratégias que você pode usar na implementação da sua aplicação:

- Ajuste prompts e parâmetros do modelo (como a [temperature](https://ai.google.dev/gemini-api/docs/prompting-strategies)) para respostas mais ou menos determinísticas. Você pode [descobrir mais na seção de estratégias de prompting](https://ai.google.dev/gemini-api/docs/prompting-strategies) de [ai.google.dev](https://ai.google.dev/).
- Use a estratégia "humano no circuito", em que um humano verifica as saídas antes de prosseguir em um fluxo de trabalho. Construa os fluxos de trabalho da sua aplicação para permitir que operadores (humanos ou outros modelos) verifiquem as saídas e confirmem decisões-chave.
- Empregue tool calling (ou function calling) e restrições de schema para guiar e restringir as respostas do modelo a formatos predefinidos, aumentando a previsibilidade da resposta.

Mesmo considerando essas estratégias e técnicas, fallbacks sensatos devem ser incorporados ao design da sua aplicação. Siga os padrões existentes de resiliência de aplicações. Por exemplo, não é aceitável que uma aplicação quebre se um recurso ou API não estiver disponível. Nesse cenário, uma mensagem de erro é exibida ao usuário e, se aplicável, opções para os próximos passos também são exibidas. Construir aplicações com IA exige a mesma consideração. Confirme que a resposta está alinhada com a saída esperada e forneça um "pouso seguro" caso ela não esteja alinhada, por meio de [degradação elegante (graceful degradation)](https://developer.mozilla.org/en-US/docs/Glossary/Graceful_degradation). Isso também se aplica a interrupções de API dos provedores de LLM.

Considere este exemplo: o provedor de LLM não está respondendo. Uma estratégia potencial para lidar com a interrupção é:

- Salvar a entrada do usuário para usar em um cenário de nova tentativa (agora ou mais tarde)
- Alertar o usuário sobre a interrupção com uma mensagem apropriada que não revele informações sensíveis
- Retomar a conversa mais tarde, assim que os serviços estiverem disponíveis novamente.

## Próximos passos {#next-steps}

Para aprender sobre prompts de LLM e configuração de IDE com IA, consulte os seguintes guias:

<docs-pill-row>
  <docs-pill href="ai/develop-with-ai" title="Prompts de LLM e configuração de IDE"/>
  <docs-pill href="ai/agent-skills" title="Skills de agente"/>
</docs-pill-row>
