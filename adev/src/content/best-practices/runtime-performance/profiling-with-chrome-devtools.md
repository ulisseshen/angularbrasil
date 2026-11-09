<!-- ia-translate: true -->
# Profiling com o Chrome DevTools

O Angular se integra à [API de extensibilidade do Chrome DevTools](https://developer.chrome.com/docs/devtools/performance/extension) para apresentar dados e insights específicos do framework diretamente no [painel de performance do Chrome DevTools](https://developer.chrome.com/docs/devtools/performance/overview).

Com a integração habilitada, você pode [gravar um perfil de performance](https://developer.chrome.com/docs/devtools/performance#record) contendo dois conjuntos de dados:

- Entradas de performance padrão, baseadas no entendimento do Chrome sobre o seu código sendo executado em um navegador, e
- Entradas específicas do Angular, contribuídas pelo runtime do framework.

Ambos os conjuntos de dados são apresentados juntos na mesma aba, mas em trilhas separadas:

<img alt="Angular custom track in Chrome DevTools profiler" src="assets/images/best-practices/runtime-performance/angular-perf-in-chrome.png">

Os dados específicos do Angular são expressos em termos de conceitos do framework (components, change detection, lifecycle hooks, etc.) ao lado de chamadas de função e método de nível mais baixo capturadas pelo navegador. Esses dois conjuntos de dados são correlacionados, e você pode alternar entre as diferentes visualizações e níveis de detalhe.

Você pode usar a trilha Angular para entender melhor como seu código é executado no navegador, incluindo:

- Determinar se um determinado bloco de código faz parte da aplicação Angular ou se pertence a outro script executando na mesma página.
- Identificar gargalos de performance e atribuí-los a components ou services específicos.
- Obter uma visão mais profunda do funcionamento interno do Angular, com uma divisão visual de cada ciclo de change detection.

## Gravando um perfil {#recording-a-profile}

### Habilitar integração {#enable-integration}

Você pode habilitar o profiling do Angular de duas maneiras:

1. Execute `ng.enableProfiling()` no painel de console do Chrome, ou
1. Inclua uma chamada para `enableProfiling()` no código de inicialização da sua aplicação (importado de `@angular/core`).

NOTE: O profiling do Angular funciona exclusivamente em modo de desenvolvimento.

Aqui está um exemplo de como habilitar a integração no bootstrap da aplicação para capturar todos os eventos possíveis:

```ts
import {enableProfiling} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {MyApp} from './my-app';

// Ative o profiling *antes* de fazer o bootstrap da sua aplicação
// para capturar todo o código executado na inicialização.
enableProfiling();
bootstrapApplication(MyApp);
```

### Gravar um perfil {#record-a-profile}

Use o botão **Record** no painel de performance do Chrome DevTools:

<img alt="Recording a profile" src="assets/images/best-practices/runtime-performance/recording-profile-in-chrome.png">

Veja a [documentação do Chrome DevTools](https://developer.chrome.com/docs/devtools/performance#record) para mais detalhes sobre a gravação de perfis.

## Abrir um component no Angular DevTools {#open-a-component-in-angular-devtools}

Depois de gravar um perfil, selecione um evento de component na trilha **Angular**.
A aba **Summary** pode incluir um link **Component** que usa o esquema de URL `angular-devtools://component/...`.

<img alt="Chrome DevTools Performance panel showing an Angular custom track with a selected _MainComponent event. The Summary tab displays a Component link that uses the angular-devtools://component URL scheme." src="assets/images/best-practices/runtime-performance/chrome-performance-deep-link.png">

Clique no link para abrir o Angular DevTools e selecione o component correspondente na aba **Components**.
Isso ajuda você a passar de um perfil em nível do navegador para o estado e os metadados do component do evento selecionado.

NOTE: Abrir links de component exige o Angular DevTools para Chrome e a flag experimental do Chrome `chrome://flags/#enable-devtools-deep-link-via-extensibility-api`.

## Interpretando um perfil gravado {#interpreting-a-recorded-profile}

Você pode usar a trilha personalizada "Angular" para identificar e diagnosticar rapidamente problemas de performance. As seções a seguir descrevem alguns cenários comuns de profiling.

### Diferenciando entre sua aplicação Angular e outras tarefas na mesma página {#differentiating-between-your-angular-application-and-other-tasks-on-the-same-page}

Como os dados do Angular e do Chrome são apresentados em trilhas separadas, mas correlacionadas, você pode ver quando o código da aplicação Angular é executado, em oposição a outro processamento do navegador (tipicamente layout e paint) ou a outros scripts executando na mesma página (neste caso, a trilha personalizada do Angular não terá nenhum dado):

<img alt="Profile data: Angular vs. 3rd party scripts execution" src="assets/images/best-practices/runtime-performance/profile-angular-vs-3rd-party.png">

Isso permite determinar se investigações adicionais devem focar no código da aplicação Angular ou em outras partes da sua base de código ou dependências.

### Codificação por cores {#color-coding}

O Angular usa cores no flame chart para distinguir tipos de tarefas:

- 🟦 Azul representa código TypeScript escrito pelo desenvolvedor da aplicação (por exemplo: services, construtores de components e lifecycle hooks, etc.).
- 🟪 Roxo representa código de templates escrito pelo desenvolvedor da aplicação e transformado pelo compilador Angular.
- 🟩 Verde representa pontos de entrada para o código da aplicação e identifica _razões_ para executar código.

Os exemplos a seguir ilustram a codificação por cores descrita em gravações reais de diversos cenários.

#### Exemplo: Bootstrap da aplicação {#example-application-bootstrapping}

O processo de bootstrap da aplicação geralmente consiste em:

- Gatilhos marcados em azul, como a chamada para `bootstrapApplication`, a instanciação do component raiz e o change detection inicial
- Vários services de DI instanciados durante o bootstrap, marcados em verde.

<img alt="Profile data: bootstrap application" src="assets/images/best-practices/runtime-performance/profile-bootstrap-application.png">

#### Exemplo: Execução de component {#example-component-execution}

O processamento de um component é tipicamente representado como um ponto de entrada (azul) seguido pela execução do seu template (roxo). Um template pode, por sua vez, desencadear a instanciação de directives e a execução de lifecycle hooks (verde):

<img alt="Profile data: component processing" src="assets/images/best-practices/runtime-performance/profile-component-processing.png">

#### Exemplo: Detecção de mudanças {#example-change-detection}

Um ciclo de change detection geralmente consiste em uma ou mais passagens de sincronização de dados (azul), em que cada passagem percorre um subconjunto de components.

<img alt="Profile data: change detection" src="assets/images/best-practices/runtime-performance/profile-change-detection.png">

Com essa visualização de dados, é possível identificar imediatamente os components que foram envolvidos no change detection e os que foram pulados (tipicamente os components `OnPush` que não foram marcados como dirty).

Além disso, você pode inspecionar o número de passagens de sincronização de um mesmo change detection. Ter mais de uma passagem de sincronização sugere que o estado é atualizado durante o change detection. Você deve evitar isso, pois torna as atualizações de página mais lentas e, nos piores casos, pode até resultar em loops infinitos.
