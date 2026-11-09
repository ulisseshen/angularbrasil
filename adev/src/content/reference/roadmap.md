<!-- ia-translate: true -->

<docs-decorative-header title="Roadmap do Angular" imgSrc="adev/src/assets/images/roadmap.svg"> <!-- markdownlint-disable-line -->
Saiba como o time do Angular está ganhando momentum na web.
</docs-decorative-header>

Como projeto open source, os commits diários, PRs e o progresso do Angular podem ser acompanhados no GitHub. Para aumentar a transparência sobre como esse trabalho diário se conecta ao futuro do framework, nosso roadmap reúne a visão atual e futura planejada pelo time.

Os projetos a seguir não estão associados a uma versão específica do Angular. Nós os lançaremos quando estiverem concluídos, e eles farão parte de uma versão específica com base no nosso cronograma de lançamentos, seguindo o versionamento semântico. Por exemplo, lançamos funcionalidades na próxima versão minor após a conclusão, ou na próxima major se elas incluírem breaking changes.

Atualmente, o Angular tem três objetivos para o framework:

1. Melhorar a [experiência de IA para desenvolvedores](/ai)
1. Melhorar a [experiência do desenvolvedor Angular](#improving-the-angular-developer-experience)
1. Melhorar a performance do framework

Continue lendo para saber como planejamos entregar esses objetivos com trabalhos de projetos específicos.

## Explore o Angular moderno {#explore-modern-angular}

Comece a desenvolver com as funcionalidades mais recentes do Angular do nosso roadmap. Esta lista representa o status atual das novas funcionalidades do nosso roadmap:

### Disponível para experimentação {#available-to-experiment-with}

- [Web MCP](/ai/webmcp)

### Pronto para produção {#production-ready}

- [Signal Forms](/guide/forms/signals/overview)
- [Resource API](/guide/signals/resource)
- [httpResource](/api/common/http/httpResource)
- [Detecção de mudanças sem zone](/guide/zoneless)
- [Linked Signal API](/guide/signals/linked-signal)
- [Hidratação incremental](/guide/incremental-hydration)
- [Effect API](/api/core/effect)
- [Event replay com SSR](/api/platform-browser/withEventReplay)
- [Modo de renderização por rota](/guide/ssr)

## Melhorando a experiência com IA para desenvolvedores Angular {#improving-the-ai-experience-for-angular-developers}

### Trazendo o melhor da IA para o Angular {#bringing-the-best-of-ai-to-angular}

<docs-card-container>
  <docs-card title="Angular potencializado por IA">
  A IA continua a moldar o cenário de desenvolvimento. Ela mudou a forma como desenvolvemos aplicações e os tipos de experiências de usuário que são possíveis. Pretendemos apoiar da melhor forma a comunidade de desenvolvedores na programação assistida por IA e na integração de IA em suas aplicações.
  </docs-card>
  <docs-card title="Desenvolvimento com IA">
  O time continuará desenvolvendo integrações significativas com ferramentas como Google AI Studio, Gemini CLI e outras ferramentas agênticas, como IDEs agênticas como o Antigravity. Pretendemos lançar soluções alinhadas com a indústria em rápida evolução. Alguns exemplos incluem agent skills, novas funcionalidades de MCP e SDKs de IA.
  </docs-card>
  <docs-card title="Geração de código">
  [Com base em nossa pesquisa](https://blog.angular.dev/beyond-the-horizon-how-angular-is-embracing-ai-for-next-gen-apps-7a7ed706e1a3), a geração de código para Angular já tem alta qualidade com LLMs modernos. Continuaremos investindo em melhorar a geração de código para Angular. Isso significa que avaliaremos regularmente a qualidade da geração de código usando modelos atuais e trabalharemos para melhorá-la por meio de instruções de sistema, documentação e mudanças táticas no framework.
  </docs-card>
  <docs-card title="Experiências potencializadas por IA">
  Há uma nova fronteira para desenvolvedores Angular explorarem com novos conceitos, como a geração dinâmica de UI. Começamos construindo suporte do Angular para o A2UI e estamos ativamente buscando mais oportunidades para oferecer experiências de aplicação modernas.
  </docs-card>
</docs-card-container>

## Melhorando a experiência do desenvolvedor Angular {#improving-the-angular-developer-experience}

### Velocidade do desenvolvedor {#developer-velocity}

<docs-card-container>
  <docs-card title="Compilador">
    A Microsoft passou o último ano portando o compilador do TypeScript para Go, com a promessa de uma compilação de TypeScript típica de 5 a 10 vezes mais rápida. O Angular talvez tenha uma das integrações mais profundas com o compilador do TypeScript, o que exigirá mudanças arquiteturais maiores para dar suporte a novos fluxos de trabalho baseados em tsgo, tanto para o compilador quanto para o language service.

Estamos no processo de prototipar e explorar como seria esse suporte, e entregaremos um compilador do Angular compatível com o tsgo, que traz para o ecossistema Angular os ganhos de performance do port nativo da Microsoft.
  </docs-card>

  <docs-card title="Compatibilidade ampliada com o ecossistema">
    Desenvolvedores estão misturando código gerado por IA com código escrito manualmente, e querem usar bibliotecas populares e integrar novas experiências rapidamente. O Angular quer se integrar bem a esse ecossistema: desenvolvedores devem poder usar as ferramentas de que gostam e combinar frameworks conforme seus requisitos.

Como parte deste projeto, exploraremos o espaço de requisitos de interoperabilidade entre frameworks e nossas ferramentas de build para melhorar a compatibilidade.

  </docs-card>

  <docs-card title="Components">
  No Angular v21, lançamos o Angular Aria em developer preview, oferecendo oito padrões de components acessíveis e headless. No Angular v22, promovemos o Angular Aria para estável, e planejamos introduzir novos padrões quando necessário. Queremos oferecer aos desenvolvedores uma base sólida para criar seus próprios components usando o Angular Aria: nós fornecemos as interações e você traz o estilo que combina com seu design system. Os desenvolvedores poderão criar components personalizados com o Angular Aria, usar padrões de interação do CDK ou usar Material Components prontos e estilizados.

Para acessibilidade, avaliamos continuamente os components e padrões em relação a padrões de acessibilidade como WCAG e trabalhamos para corrigir quaisquer problemas que surjam desse processo.
  </docs-card>
</docs-card-container>

### Melhorar ferramentas {#improve-tooling}

<docs-card-container>
  <docs-card title="Modernizar ferramentas de testes unitários com ng test">
  Após o lançamento estável do Vitest no Angular v21, ele agora é nosso test runner principal. Agora estamos focados em tornar estável também nossa ferramenta de migração experimental do Karma para o Vitest, além de investigar novas funcionalidades para refinar e melhorar ainda mais o fluxo de testes do desenvolvedor.
</docs-card>
</docs-card-container>

## Projetos concluídos {#completed-projects}

<docs-card-container>

  <docs-card title="Signal Forms" href="/guide/forms/signals/overview" link="Concluído em 2026">
  Os Signal Forms agora são estáveis. Essa nova abordagem permite que desenvolvedores gerenciem o estado de formulários usando signals, oferecendo uma experiência ergonômica para criação de formulários. Promovemos os Signal Forms para estáveis e melhoramos a interoperabilidade com reactive forms, permitindo que times migrem formulários grandes progressivamente, no seu próprio ritmo.
  </docs-card>

  <docs-card title="Reatividade" href="/guide/signals" link="Concluído em 2026">
  Introduzimos novas APIs de signal, `resource()` e `httpResource()`, para tratamento flexível de dados assíncronos. Promovemos essas APIs para estáveis para desenvolvedores.
  </docs-card>

  <docs-card title="Detecção de mudanças" href="/api/core/ChangeDetectionStrategy" link="Concluído em 2026">
  Com o Zoneless estável e como padrão, definimos a estratégia padrão de detecção de mudanças como `OnPush`, seguindo as boas práticas atuais. Também renomeamos `ChangeDetectionStrategy.Default` para `ChangeDetectionStrategy.Eager`.

[Veja a discussão do RFC para mais detalhes](https://github.com/angular/angular/discussions/66779).
  </docs-card>

  <docs-card title="Debugging de signals no Angular DevTools" link="Concluído em 2026">
  Adicionamos ferramentas melhores para depurar signals usando o Angular DevTools. Essa mudança inclui uma nova UI para inspecionar e depurar signals.
  </docs-card>

  <docs-card title="Melhorar o HMR (Hot Module Reload)" href="https://github.com/angular/angular/issues/39367#issuecomment-1439537306" link="Concluído em 2025">
  Estamos trabalhando para um ciclo de edição e atualização mais rápido, habilitando o hot module replacement. No Angular v19 lançamos o suporte inicial para HMR de CSS e de template, e na v20 o HMR de template passou para estável. Continuaremos coletando feedback para garantir que estamos atendendo às necessidades dos desenvolvedores antes de marcar este projeto como concluído.
</docs-card>

<docs-card title="Angular Zoneless"  link="Concluído no T4 2025">
Na v18 lançamos o suporte experimental a zoneless no Angular. Ele permite que desenvolvedores usem o framework sem incluir o zone.js no bundle, o que melhora a performance, a experiência de depuração e a interoperabilidade. Como parte do lançamento inicial, também introduzimos suporte a zoneless no Angular CDK e no Angular Material.

Na v19 introduzimos suporte a zoneless em server-side rendering, tratamos alguns casos extremos e criamos um schematic para gerar projetos zoneless. Migramos o <a href="https://fonts.google.com/" target="_blank">Google Fonts</a> para zoneless, o que melhorou a performance e a experiência do desenvolvedor, e nos permitiu identificar lacunas que precisamos resolver antes de mover este recurso para o developer preview.

A partir do Angular v20.2, o Angular Zoneless agora é estável e inclui melhorias no tratamento de erros e no server-side rendering.
</docs-card>

<docs-card title="Configuração de rotas no servidor" link="Concluído no T2 2025"  >
Estamos trabalhando para permitir uma configuração de rotas mais ergonômica no servidor. Queremos tornar trivial declarar quais rotas devem ser renderizadas no servidor, pré-renderizadas ou renderizadas no cliente.

No Angular v19 lançamos o developer preview do modo de renderização por rota, que permite configurar de forma granular quais rotas você quer que o Angular pré-renderize, renderize no servidor ou renderize no cliente. No Angular v20 esse recurso passou para estável.
</docs-card>
<docs-card title="Habilitar hidratação incremental" link="Concluído no T2 2025">
Na v17 graduamos a hidratação do developer preview e observamos consistentemente melhorias de 40-50% no LCP. Desde então, começamos a prototipar a hidratação incremental e apresentamos uma demo no palco da ng-conf.

Na v19 lançamos a hidratação incremental em developer preview, alimentada por blocos `@defer`. No Angular v20 ela passou para estável!
</docs-card>
<docs-card title="Entregar Angular Signals" link="Concluído no T2 2025" href="https://github.com/angular/angular/discussions/49685">
Este projeto repensa o modelo de reatividade do Angular ao introduzir os Signals como uma primitiva de reatividade. O planejamento inicial resultou em centenas de discussões, conversas com desenvolvedores, sessões de feedback, estudos de experiência do usuário e uma série de RFCs, que receberam mais de 1.000 comentários.

No Angular v20 graduamos para estáveis todas as primitivas fundamentais de reatividade, incluindo signal, effect, linkedSignal, queries baseadas em signal e inputs.
</docs-card>
<docs-card title="Suporte a drag-and-drop bidimensional" link="Concluído no T2 2024" href="https://github.com/angular/components/issues/13372">
Como parte deste projeto, implementamos suporte a orientação mista para o drag and drop do Angular CDK. Esta é uma das funcionalidades mais solicitadas do repositório.
</docs-card>
<docs-card title="Event replay com SSR e prerendering" link="Concluído no T4 2024" href="api/platform-browser/withEventReplay">
Na v18 introduzimos uma funcionalidade de event replay ao usar server-side rendering ou prerendering. Para esse recurso, dependemos da primitiva de dispatch de eventos (anteriormente conhecida como jsaction) que roda no Google.com.

No Angular v19 graduamos o event replay para estável e o habilitamos por padrão em todos os novos projetos.
</docs-card>
<docs-card title="Integrar o Angular Language Service com schematics" link="Concluído no T4 2024">
Para facilitar o uso das APIs modernas do Angular pelos desenvolvedores, habilitamos a integração entre o Angular language service e os schematics, o que permite refatorar sua aplicação com um único clique.
</docs-card>
<docs-card title="Simplificar imports standalone com o Language Service" link="Concluído no T4 2024">
Como parte dessa iniciativa, o language service importa automaticamente components e pipes em aplicações standalone e baseadas em NgModules. Além disso, adicionamos um diagnóstico de template para destacar imports não utilizados em components standalone, o que deve ajudar a deixar os bundles das aplicações menores.
</docs-card>
<docs-card title="Variáveis de template locais" link="Concluído no T3 2024">
Lançamos o suporte a variáveis de template locais no Angular, veja [`@let`](/api/core/@let) para mais informações.
</docs-card>
<docs-card title="Ampliar a customização do Angular Material" link="Concluído no T2 2024" href="https://material.angular.dev/guide/theming">
Para oferecer melhor customização dos components do Angular Material e habilitar os recursos do Material 3, vamos colaborar com o time de Material Design do Google na definição de APIs de theming baseadas em tokens.

Na v17.2 compartilhamos o suporte experimental ao Angular Material 3, e na v18 o graduamos para estável.
</docs-card>
<docs-card title="Introduzir carregamento adiado" link="Concluído no T2 2024" href="guide/templates/defer">
Na v17 lançamos as deferrable views em developer preview, que oferecem uma API ergonômica para carregamento adiado de código. Na v18 habilitamos as deferrable views para desenvolvedores de bibliotecas e graduamos a API para estável.
</docs-card>
<docs-card title="Suporte a iframe no Angular DevTools" link="Concluído no T2 2024">
Habilitamos a depuração e o profiling de aplicações Angular incorporadas dentro de um iframe na página.
</docs-card>
<docs-card title="Automação para transição de projetos existentes com renderização híbrida para esbuild e vite" link="Concluído no T2 2024" href="tools/cli/build-system-migration">
Na v17 lançamos um application builder baseado em vite e esbuild e o habilitamos por padrão para novos projetos. Ele melhora o tempo de build de projetos que usam renderização híbrida em até 87%. Como parte da v18, lançamos schematics e um guia que migram projetos existentes com renderização híbrida para o novo pipeline de build.
</docs-card>
<docs-card title="Tornar o Angular.dev o lar oficial para desenvolvedores Angular" link="Concluído no T2 2024" href="https://goo.gle/angular-dot-dev">
O Angular.dev é o novo site, domínio e lar do desenvolvimento Angular. O novo site contém documentação, tutoriais e orientações atualizados, que ajudarão os desenvolvedores a construir com as funcionalidades mais recentes do Angular.
</docs-card>
<docs-card title="Introduzir o controle de fluxo integrado" link="Concluído no T2 2024" href="guide/templates/control-flow">
Na v17 lançamos uma versão developer preview de um novo controle de fluxo. Ele traz melhorias significativas de performance e melhor ergonomia para a escrita de templates. Também fornecemos uma migração dos `*ngIf`, `*ngFor` e `*ngSwitch` existentes, que você pode executar para mover seu projeto para a nova implementação. A partir da v18, o controle de fluxo integrado agora é estável.
</docs-card>
<docs-card title="Modernizar o tutorial de introdução" link="Concluído no T4 2023">
Nos últimos dois trimestres, desenvolvemos um novo [vídeo](https://www.youtube.com/watch?v=xAT0lHYhHMY&list=PL1w1q3fL4pmj9k1FrJ3Pe91EPub2_h4jF) e um tutorial [textual](/tutorials/learn-angular) baseados em components standalone.
</docs-card>
<docs-card title="Investigar bundlers modernos" link="Concluído no T4 2023" href="guide/hydration">
No Angular v16, lançamos um developer preview de um builder baseado em esbuild com suporte a `ng build` e `ng serve`. O servidor de desenvolvimento `ng serve` usa Vite e uma compilação multiarquivo feita pelo esbuild e pelo compilador do Angular. Na v17 graduamos as ferramentas de build para fora do developer preview e as habilitamos por padrão para novos projetos.
</docs-card>
<docs-card title="Introduzir APIs de debugging para injeção de dependência" link="Concluído no T4 2023" href="tools/devtools">
Para melhorar os utilitários de debugging do Angular e do Angular DevTools, trabalharemos em APIs que dão acesso ao runtime de injeção de dependência. Como parte do projeto, expomos métodos de debugging que permitem explorar a hierarquia de injetores e as dependências entre seus providers associados. A partir da v17, lançamos um recurso que nos permite nos conectar ao ciclo de vida da injeção de dependência. Também lançamos uma visualização da árvore de injetores e a inspeção dos providers declarados em cada nó individual.
</docs-card>
<docs-card title="Melhorar a documentação e os schematics para components standalone" link="Concluído no T4 2023" href="essentials/components">
Lançamos um developer preview da coleção de schematics `ng new --standalone`, que permite criar aplicações sem NgModules. Na v17, mudamos o formato de escrita de novas aplicações para as APIs standalone e alteramos a documentação para refletir essa recomendação. Além disso, lançamos schematics que oferecem suporte à atualização de aplicações existentes para components, directives e pipes standalone. Embora os NgModules vão continuar por um futuro previsível, recomendamos que você explore os benefícios das novas APIs para melhorar a experiência do desenvolvedor e aproveitar as novas funcionalidades que construímos para elas.
</docs-card>
<docs-card title="Explorar melhorias de hidratação e server-side rendering" link="Concluído no T4 2023">
Na v16, lançamos um developer preview de hidratação completa não destrutiva; veja o [guia de hidratação](guide/hydration) e o [post do blog](https://blog.angular.dev/whats-next-for-server-side-rendering-in-angular-2a6f27662b67) para mais informações. Já estamos vendo melhorias significativas nos Core Web Vitals, incluindo [LCP](https://web.dev/lcp) e [CLS](https://web.dev/cls). Em testes de laboratório, observamos consistentemente 45% de melhoria no LCP de uma aplicação real.

Na v17 lançamos a hidratação fora do developer preview e fizemos uma série de melhorias na história de server-side rendering, incluindo: descoberta de rotas em runtime para SSG, tempos de build até 87% mais rápidos para aplicações com renderização híbrida e um prompt que habilita a renderização híbrida para novos projetos.
</docs-card>
<docs-card title="Hidratação completa de aplicações não destrutiva" link="Concluído no T1 2023" href="guide/hydration">
Na v16, lançamos um developer preview de hidratação completa não destrutiva, que permite ao Angular reutilizar nós DOM existentes em uma página renderizada no servidor, em vez de recriar a aplicação do zero. Veja mais informações no guia de hidratação.
</docs-card>
<docs-card title="Melhorias na image directive" link="Concluído no T1 2023" href="guide/image-optimization">
Lançamos a image directive do Angular como estável na v15. Introduzimos um novo modo fill que permite que as imagens se ajustem dentro do seu contêiner pai, em vez de ter dimensões explícitas. Nos últimos dois meses, o time Chrome Aurora fez o backport da directive para a v12 e versões mais recentes.
</docs-card>
<docs-card title="Refatoração da documentação" link="Concluído no T1 2023" href="https://angular.io">
Garantir que toda a documentação existente se encaixe em um conjunto consistente de tipos de conteúdo. Atualizar o uso excessivo de documentação no estilo tutorial para tópicos independentes. Queremos garantir que o conteúdo fora dos tutoriais principais seja autossuficiente, sem estar fortemente acoplado a uma série de guias. No T2 2022, refatoramos o conteúdo de templates e de injeção de dependência. No T1 2023, melhoramos os guias de HTTP e, com isso, colocamos o projeto de refatoração da documentação em espera.
</docs-card>
<docs-card title="Melhorar a performance de imagens" link="Concluído no T4 2022" href="guide/image-optimization">
Os times Aurora e Angular estão trabalhando na implementação de uma image directive que visa melhorar os Core Web Vitals. Lançamos uma versão estável da image directive na v15.
</docs-card>
<docs-card title="CSS moderno" link="Concluído no T4 2022" href="https://blog.angular.dev/modern-css-in-angular-layouts-4a259dca9127">
O ecossistema web evolui constantemente, e queremos refletir os padrões modernos mais recentes no Angular. Neste projeto, buscamos fornecer diretrizes sobre o uso de funcionalidades modernas de CSS no Angular, para garantir que os desenvolvedores sigam as boas práticas de layout, estilização etc. Compartilhamos diretrizes oficiais para layout e, como parte da iniciativa, deixamos de publicar o flex layout.
</docs-card>
<docs-card title="Suporte a adicionar directives a elementos host" link="Concluído no T4 2022" href="guide/directives/directive-composition-api">
Um pedido de funcionalidade antigo é a possibilidade de adicionar directives a elementos host. O recurso permite que desenvolvedores ampliem seus próprios components com comportamentos adicionais sem usar herança. Na v15 lançamos nossa API de composição de directives, que permite aprimorar elementos host com directives.
</docs-card>
<docs-card title="Stack traces melhores" link="Concluído no T4 2022" href="https://developer.chrome.com/blog/devtools-better-angular-debugging/">
O Angular e o Chrome DevTools estão trabalhando juntos para habilitar stack traces mais legíveis para mensagens de erro. Na v15 lançamos stack traces melhorados, relevantes e com links. Como iniciativa de menor prioridade, vamos explorar como tornar os stack traces mais amigáveis, fornecendo nomes de call frames mais precisos para templates.
</docs-card>
<docs-card title="Components do Angular Material aprimorados com a integração do MDC Web" link="Concluído no T4 2022" href="https://material.angular.dev/guide/mdc-migration">
O MDC Web é uma biblioteca criada pelo time de Material Design do Google que fornece primitivas reutilizáveis para construir components Material Design. O time do Angular está incorporando essas primitivas ao Angular Material. Usar o MDC Web alinha mais de perto o Angular Material com a especificação Material Design, amplia a acessibilidade, melhora a qualidade dos components e aumenta a velocidade do nosso time.
</docs-card>
<docs-card title="Implementar APIs para NgModules opcionais" link="Concluído no T4 2022" href="https://blog.angular.dev/angular-v15-is-now-available-df7be7f2f4c8">
No processo de tornar o Angular mais simples, estamos trabalhando na introdução de APIs que permitem aos desenvolvedores inicializar aplicações, instanciar components e usar o router sem NgModules. O Angular v14 introduziu o developer preview das APIs para components, directives e pipes standalone. Nos próximos trimestres, coletaremos feedback dos desenvolvedores e finalizaremos o projeto, tornando as APIs estáveis. Como próximo passo, trabalharemos em melhorar casos de uso como TestBed, Angular elements etc.
</docs-card>
<docs-card title="Permitir binding a campos protegidos em templates" link="Concluído no T2 2022" href="guide/templates/binding">
Para melhorar o encapsulamento dos components do Angular, habilitamos o binding a membros protegidos da instância do component. Assim, você não precisará mais expor um campo ou método como público para usá-lo dentro dos seus templates.
</docs-card>
<docs-card title="Publicar guias sobre conceitos avançados" link="Concluído no T2 2022" href="https://angular.io/guide/change-detection">
Desenvolver e publicar um guia aprofundado sobre detecção de mudanças. Desenvolver conteúdo para profiling de performance de aplicações Angular. Abordar como a detecção de mudanças interage com o Zone.js e explicar quando ela é acionada, como fazer o profiling de sua duração, bem como práticas comuns para otimização de performance.
</docs-card>
<docs-card title="Lançar tipagens estritas para @angular/forms" link="Concluído no T2 2022" href="guide/forms/typed-forms">
No T4 de 2021, projetamos uma solução para introduzir tipagens estritas para forms e, no T1 de 2022, concluímos a solicitação de comentários correspondente. Atualmente, estamos implementando uma estratégia de lançamento com uma etapa de migração automatizada que habilitará as melhorias para projetos existentes. Estamos testando a solução primeiro com mais de 2.500 projetos no Google, para garantir um caminho de migração suave para a comunidade externa.
</docs-card>
<docs-card title="Remover o View Engine legado" link="Concluído no T1 2022" href="https://blog.angular.dev/angular-v15-is-now-available-df7be7f2f4c8">
Após a conclusão da transição de todas as nossas ferramentas internas para o Ivy, removeremos o View Engine legado, para reduzir a complexidade conceitual do Angular, diminuir o tamanho do pacote, reduzir o custo de manutenção e a complexidade da base de código.
</docs-card>
<docs-card title="Modelo mental simplificado do Angular com NgModules opcionais" link="Concluído no T1 2022" href="https://blog.angular.dev/angular-v15-is-now-available-df7be7f2f4c8">
Para simplificar o modelo mental do Angular e a jornada de aprendizado, vamos trabalhar para tornar os NgModules opcionais. Esse trabalho permite que desenvolvedores criem components standalone e implementem uma API alternativa para declarar o escopo de compilação do component. Iniciamos o projeto com discussões de design de alto nível, que registramos em um RFC.
</docs-card>
<docs-card title="Projetar tipagem estrita para @angular/forms" link="Concluído no T1 2022" href="guide/forms/typed-forms">
Vamos encontrar uma forma de implementar uma verificação de tipos mais estrita para reactive forms, com implicações mínimas de incompatibilidade retroativa. Dessa forma, permitimos que desenvolvedores identifiquem mais problemas durante o desenvolvimento, habilitamos melhor suporte de editores de texto e IDEs e melhoramos a verificação de tipos para reactive forms.
</docs-card>
<docs-card title="Melhorar a integração do Angular DevTools com o framework" link="Concluído no T1 2022" href="tools/devtools">
Para melhorar a integração do Angular DevTools com o framework, estamos trabalhando para mover a base de código para o monorepo angular/angular. Isso inclui fazer a transição do Angular DevTools para o Bazel e integrá-lo aos processos existentes e ao pipeline de CI.
</docs-card>
<docs-card title="Lançar diagnósticos avançados do compilador" link="Concluído no T1 2022" href="reference/extended-diagnostics">
Estender os diagnósticos do compilador Angular para além da verificação de tipos. Introduzir outras verificações de correção e conformidade para garantir ainda mais a correção e as boas práticas.
</docs-card>
<docs-card title="Atualizar nossa estratégia de testes e2e" link="Concluído no T3 2021" href="guide/testing">
Para garantir uma estratégia de testes e2e preparada para o futuro, queremos avaliar o estado do Protractor, as inovações da comunidade, as boas práticas de e2e e explorar novas oportunidades. Como primeiros passos do esforço, compartilhamos um RFC e trabalhamos com parceiros para garantir uma integração suave entre o Angular CLI e as ferramentas mais avançadas de testes e2e. Como próximo passo, precisamos finalizar as recomendações e compilar uma lista de recursos para a transição.
</docs-card>
<docs-card title="Bibliotecas Angular usando Ivy" link="Concluído no T3 2021" href="tools/libraries">
No início de 2020, compartilhamos um RFC para a distribuição de bibliotecas Ivy. Após feedback valioso da comunidade, desenvolvemos um design para o projeto. Agora estamos investindo no desenvolvimento da distribuição de bibliotecas Ivy, incluindo uma atualização do formato de pacote de bibliotecas para usar a compilação Ivy, desbloquear a depreciação do formato de bibliotecas View Engine e o ngcc.
</docs-card>
<docs-card title="Melhorar os tempos de teste e a depuração com a desmontagem automática do ambiente de teste" link="Concluído no T3 2021" href="guide/testing">
Para melhorar o tempo de teste e criar um melhor isolamento entre os testes, queremos alterar o TestBed para limpar e desmontar automaticamente o ambiente de teste após cada execução de teste.
</docs-card>
<docs-card title="Depreciar e remover o suporte ao IE11" link="Concluído no T3 2021" href="https://github.com/angular/angular/issues/41840">
O Internet Explorer 11 (IE11) tem impedido o Angular de aproveitar algumas das funcionalidades modernas da plataforma web. Como parte deste projeto, vamos depreciar e remover o suporte ao IE11 para abrir caminho para as funcionalidades modernas que os navegadores evergreen oferecem. Executamos um RFC para coletar feedback da comunidade e decidir os próximos passos.
</docs-card>
<docs-card title="Usar ES2017+ como linguagem de saída padrão" link="Concluído no T3 2021" href="https://www.typescriptlang.org/docs/handbook/tsconfig-json.html">
Suportar navegadores modernos nos permite aproveitar a sintaxe mais compacta, expressiva e performática do JavaScript. Como parte deste projeto, investigaremos quais são os bloqueios para avançar nesse esforço e tomaremos as medidas para habilitá-lo.
</docs-card>
<docs-card title="Debugging acelerado e profiling de performance com o Angular DevTools" link="Concluído no T2 2021" href="tools/devtools">
Estamos trabalhando em ferramentas de desenvolvimento para o Angular que oferecem utilitários para depuração e profiling de performance. Este projeto visa ajudar os desenvolvedores a entender a estrutura dos components e a detecção de mudanças em uma aplicação Angular.
</docs-card>
<docs-card title="Simplificar os lançamentos com versionamento e branching consolidados do Angular" link="Concluído no T2 2021" href="reference/releases">
Queremos consolidar as ferramentas de gerenciamento de lançamentos entre os múltiplos repositórios GitHub do Angular (angular/angular, angular/angular-cli e angular/components). Esse esforço nos permite reutilizar infraestrutura, unificar e simplificar processos e melhorar a confiabilidade do nosso processo de lançamento.
</docs-card>
<docs-card title="Maior consistência entre desenvolvedores com padronização de mensagens de commit" link="Concluído no T2 2021" href="https://github.com/angular/angular">
Queremos unificar os requisitos e a conformidade das mensagens de commit entre os repositórios do Angular (angular/angular, angular/components e angular/angular-cli), para trazer consistência ao nosso processo de desenvolvimento e reutilizar as ferramentas de infraestrutura.
</docs-card>
<docs-card title="Fazer a transição do Angular language service para o Ivy" link="Concluído no T2 2021" href="tools/language-service">
O objetivo deste projeto é melhorar a experiência e remover uma dependência legada, fazendo a transição do language service para o Ivy. Hoje, o language service ainda usa o compilador e a verificação de tipos do View Engine, mesmo para aplicações Ivy. Queremos usar o parser de templates do Ivy e a verificação de tipos aprimorada no Angular Language Service, para corresponder ao comportamento da aplicação. Essa migração também é um passo para desbloquear a remoção do View Engine, o que simplificará o Angular, reduzirá o tamanho do pacote npm e melhorará a manutenibilidade do framework.
</docs-card>
<docs-card title="Mais segurança com Trusted Types nativos no Angular" link="Concluído no T2 2021" href="best-practices/security">
Em colaboração com o time de segurança do Google, estamos adicionando suporte à nova API Trusted Types. Essa API da plataforma web ajuda os desenvolvedores a construir aplicações web mais seguras.
</docs-card>
<docs-card title="Velocidade de build e tamanhos de bundle otimizados com o webpack 5 no Angular CLI" link="Concluído no T2 2021" href="tools/cli/build">
Como parte do lançamento da v11, introduzimos uma prévia opt-in do webpack 5 no Angular CLI. Para garantir a estabilidade, continuaremos iterando na implementação para habilitar melhorias na velocidade de build e no tamanho dos bundles.
</docs-card>
<docs-card title="Aplicações mais rápidas com inlining de estilos críticos em aplicações Universal" link="Concluído no T1 2021" href="guide/ssr">
Carregar folhas de estilo externas é uma operação bloqueante, o que significa que o navegador não pode começar a renderizar sua aplicação até carregar todo o CSS referenciado. Ter recursos que bloqueiam a renderização no cabeçalho de uma página pode impactar significativamente seu desempenho de carregamento, por exemplo, o seu first contentful paint. Para tornar as aplicações mais rápidas, temos colaborado com o time do Google Chrome no inlining de CSS crítico e no carregamento assíncrono do restante dos estilos.
</docs-card>
<docs-card title="Melhorar a depuração com mensagens de erro melhores do Angular" link="Concluído no T1 2021" href="errors">
As mensagens de erro frequentemente trazem informações limitadas e acionáveis para ajudar os desenvolvedores a resolvê-las. Temos trabalhado para tornar as mensagens de erro mais fáceis de encontrar, adicionando códigos associados, desenvolvendo guias e outros materiais para garantir uma experiência de depuração mais suave.
</docs-card>
<docs-card title="Onboarding de desenvolvedores melhorado com documentação introdutória atualizada" link="Concluído no T1 2021" href="tutorials">
Vamos redefinir as jornadas de aprendizado dos usuários e atualizar a documentação introdutória. Vamos declarar claramente os benefícios do Angular, como explorar suas capacidades e fornecer orientações para que os desenvolvedores se tornem proficientes no framework no menor tempo possível.
</docs-card>
<docs-card title="Expandir as boas práticas de component harnesses" link="Concluído no T1 2021" href="https://material.angular.dev/guide/using-component-harnesses">
O Angular CDK introduziu o conceito de component test harnesses no Angular na versão 9. Os test harnesses permitem que autores de components criem APIs suportadas para testar interações com components. Continuamos a melhorar essa infraestrutura de harnesses e a esclarecer as boas práticas para usá-los. Também estamos trabalhando para impulsionar mais adoção de harnesses dentro do Google.
</docs-card>
<docs-card title="Escrever um guia para content projection" link="Concluído no T2 2021" href="https://angular.io/docs">
A content projection é um conceito central do Angular que não tem a presença que merece na documentação. Como parte deste projeto, queremos identificar os principais casos de uso e conceitos de content projection e documentá-los.
</docs-card>
<docs-card title="Migrar para o ESLint" link="Concluído no T4 2020" href="tools/cli">
Com a depreciação do TSLint, vamos migrar para o ESLint. Como parte do processo, trabalharemos para garantir a compatibilidade retroativa com nossa configuração recomendada atual do TSLint, implementar uma estratégia de migração para aplicações Angular existentes e introduzir novas ferramentas no toolchain do Angular CLI.
</docs-card>
<docs-card title="Operation Bye Bye Backlog (também conhecida como Operation Byelog)" link="Concluído no T4 2020" href="https://github.com/angular/angular/issues">
Estamos investindo ativamente até 50% da nossa capacidade de engenharia na triagem de issues e PRs, até termos uma compreensão clara das necessidades mais amplas da comunidade. Depois disso, vamos comprometer até 20% da nossa capacidade de engenharia para acompanhar prontamente as novas submissões.
</docs-card>
</docs-card-container>
