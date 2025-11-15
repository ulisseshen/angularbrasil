<!-- ia-translate: true -->
<docs-decorative-header title="Roadmap do Angular" imgSrc="adev/src/assets/images/roadmap.svg"> <!-- markdownlint-disable-line -->
Saiba como o time do Angular está construindo momentum na web.
</docs-decorative-header>

Como um projeto open source, os commits diários, PRs e o progresso do Angular podem ser acompanhados no GitHub. Para aumentar a transparência sobre como esse trabalho diário se conecta ao futuro do framework, nosso roadmap reúne a visão atual e futura planejada pelo time.

Os projetos a seguir não estão associados a uma versão específica do Angular. Nós os lançaremos quando estiverem completos, e eles farão parte de uma versão específica baseada em nosso cronograma de lançamento, seguindo o versionamento semântico. Por exemplo, lançamos funcionalidades na próxima versão minor após a conclusão, ou na próxima major se incluírem mudanças que quebram compatibilidade.

Atualmente, o Angular tem dois objetivos para o framework:

1. Melhorar a [experiência do desenvolvedor Angular](#improving-the-angular-developer-experience) e
2. Melhorar a performance do framework.

Continue lendo para saber como planejamos entregar esses objetivos com trabalhos de projetos específicos.

## Explore o Angular moderno

Comece a desenvolver com as funcionalidades mais recentes do Angular do nosso roadmap. Esta lista representa o status atual de novas funcionalidades do nosso roadmap:

### Disponível para experimentação

- [Resource API](/guide/signals/resource)
- [httpResource](/api/common/http/httpResource)

### Pronto para produção

- [Detecção de mudanças sem zone](/guide/zoneless)
- [Linked Signal API](/guide/signals/linked-signal)
- [Hidratação incremental](/guide/incremental-hydration)
- [Effect API](/api/core/effect)
- [Event replay com SSR](/api/platform-browser/withEventReplay)
- [Modo de renderização por rota](/guide/ssr)

## Melhorando a experiência do desenvolvedor Angular

### Velocidade do desenvolvedor

<docs-card-container>
  <docs-card title="Selectorless" href="">
  Para reduzir boilerplate e melhorar a ergonomia de components standalone, estamos agora projetando uma solução que tornará os selectors opcionais. Para usar um component ou directive você poderá importá-lo e usá-lo diretamente no template de um component.

Iniciamos a prototipagem inicial de selectorless e ainda estamos nos estágios iniciais de planejamento. Compartilharemos uma solicitação de comentários quando tivermos um design e estivermos prontos para os próximos passos.
</docs-card>
<docs-card title="Signal Forms" href="">
Planejamos analisar o feedback existente sobre forms do Angular e projetar uma solução que atenda aos requisitos dos desenvolvedores e use Signals para gerenciamento de estado reativo.
</docs-card>
<docs-card title="Reatividade assíncrona" href="https://github.com/angular/angular/discussions/60121">
Para permitir que desenvolvedores lidem com fluxo de dados assíncrono com signals, desenvolvemos a primitiva assíncrona `resource`. Construindo sobre ela, introduzimos `httpResource` que permite você enviar requisições HTTP e receber sua resposta como um signal.

Ainda estamos ativamente coletando feedback para essas novas APIs experimentais. Por favor, experimente-as e compartilhe seu feedback conosco no GitHub!
</docs-card>
<docs-card title="Angular sem Zone" href="">
Na v18 lançamos suporte experimental para zoneless no Angular. Isso permite que desenvolvedores usem o framework sem incluir zone.js no bundle, o que melhora a performance, experiência de debugging e interoperabilidade. Como parte do lançamento inicial também introduzimos suporte zoneless para o Angular CDK e Angular Material.

Na v19 introduzimos suporte zoneless em server-side rendering, abordamos alguns casos extremos e criamos um schematic para scaffoldar projetos zoneless. Fizemos a transição do <a href="https://fonts.google.com/">Google Fonts</a> para zoneless, o que melhorou a performance, experiência do desenvolvedor e nos permitiu identificar lacunas que precisamos abordar antes de mover essa funcionalidade para developer preview.

A partir do Angular v20.2, o Angular sem Zone agora está estável e inclui melhorias no tratamento de erros e server-side rendering.
</docs-card>
<docs-card title="Integrações com Signal" href="">
Estamos trabalhando para melhorar a integração de pacotes fundamentais do Angular, como forms, HTTP e router, com Signals. Como parte deste projeto, buscaremos oportunidades para introduzir APIs ou wrappers convenientes baseados em signal para melhorar a experiência holística do desenvolvedor.
</docs-card>
<docs-card title="Melhorar HMR (Hot Module Reload)" href="https://github.com/angular/angular/issues/39367#issuecomment-1439537306">
Estamos trabalhando para um ciclo de edição/atualização mais rápido habilitando hot module replacement.

No Angular v19 lançamos suporte inicial para HMR de CSS e template e na v20 graduamos o HMR de template para estável. Continuaremos coletando feedback para garantir que estamos atendendo às necessidades dos desenvolvedores antes de marcar este projeto como completo.
</docs-card>
</docs-card-container>

### Melhorar Angular Material e o CDK

<docs-card-container>
  <docs-card title="Novas primitivas do CDK" href="">
  Estamos trabalhando em novas primitivas do CDK para facilitar a criação de components customizados baseados nos padrões de design WAI-ARIA para [Combobox](https://www.w3.org/TR/wai-aria-practices-1.1/#combobox). O Angular v14 introduziu [primitivas estáveis de menu e dialog](https://material.angular.dev/cdk/categories) como parte deste projeto, e na v15 Listbox.
  </docs-card>
  <docs-card title="Acessibilidade de components do Angular" href="">
  Estamos avaliando components no Angular Material em relação a padrões de acessibilidade como WCAG e trabalhando para corrigir quaisquer problemas que surjam deste processo.
  </docs-card>
</docs-card-container>

### Melhorar ferramentas

<docs-card-container>
  <docs-card title="Modernizar ferramentas de teste unitário com ng test" href="">
  Na v12, revisitamos a experiência de testes end-to-end do Angular substituindo Protractor por alternativas modernas como Cypress, Nightwatch, Puppeteer, Playwright e Webdriver.io. Em seguida, gostaríamos de abordar `ng test` para modernizar a experiência de testes unitários do Angular.

No Angular v20 introduzimos suporte experimental para vitest. Certifique-se de experimentar e compartilhar seu feedback conosco!
</docs-card>
<docs-card title="Avaliando suporte a Nitro no Angular CLI" href="https://nitro.unjs.io/">
Estamos animados com o conjunto de funcionalidades que Nitro oferece, como mais opções de deployment, melhor compatibilidade de server-side rendering com diferentes runtimes e roteamento baseado em arquivos. Em 2025 avaliaremos como ele se encaixa no modelo de server-side rendering do Angular.

Compartilharemos atualizações conforme fazemos progresso nesta investigação.
</docs-card>
<docs-card title="Debugging de Signal no Angular DevTools" href="">
Com a evolução dos Signals no Angular, estamos trabalhando em melhores ferramentas para debugá-los. Alta prioridade na lista é uma UI para inspecionar e debugar signals.
</docs-card>
</docs-card-container>

## Trabalho futuro, explorações e prototipagem

Esta seção representa explorações e prototipagem de potenciais projetos futuros. Um resultado razoável é decidir que nossas soluções atuais são as melhores opções. Outros projetos podem resultar em RFCs, graduando para projetos em andamento, ou sendo despriorizados conforme a web continua a inovar junto com nosso framework.

<docs-card-container>
  <docs-card title="Exploração de server-side rendering em streaming" href="">
  Nos últimos lançamentos temos trabalhado em tornar a história de server-side rendering do Angular mais robusta. Em nossa lista de prioridades está explorar server-side rendering em streaming para aplicações zoneless.
  </docs-card>
  <docs-card title="Investigação para melhorias no formato de autoria" href="">
  Baseado nos resultados de nossas pesquisas com desenvolvedores, vimos que há oportunidades para melhorar a ergonomia do formato de autoria de components. O primeiro passo do processo será reunir requisitos e entender o espaço do problema antes de um RFC. Compartilharemos atualizações conforme fazemos progresso. Alta prioridade no trabalho futuro será compatibilidade retroativa e interoperabilidade.
  </docs-card>
  <docs-card title="Melhorar TestBed" href="">
  Baseado em feedback ao longo dos anos e nas atualizações recentes no runtime do Angular, avaliaremos TestBed para identificar oportunidades de melhorar a experiência do desenvolvedor e reduzir boilerplate ao desenvolver testes unitários.
  </docs-card>
  <docs-card title="Adoção incremental" href="">
  O Angular tem carecido das ferramentas e flexibilidade para adicionar interatividade a uma aplicação multi-página ou incorporar um component do Angular dentro de uma aplicação existente construída com um framework diferente.

Como parte deste projeto, exploraremos o espaço de requisitos de interoperabilidade entre frameworks e nossa oferta de ferramentas de build para tornar este caso de uso possível.
</docs-card>
</docs-card-container>

## Projetos completos

<docs-card-container>
  <docs-card title="Configuração de rotas do servidor" link="Completo em Q2 2025" href="">
  Estamos trabalhando para habilitar uma configuração de rotas mais ergonômica no servidor. Queremos tornar trivial declarar quais rotas devem ser renderizadas no servidor, pré-renderizadas ou renderizadas no cliente.

No Angular v19 lançamos developer preview do modo de renderização por rota que permite você configurar granularmente quais rotas você quer que o Angular pré-renderize, renderize no servidor ou renderize no cliente. No Angular v20 graduamos isso para estável.
</docs-card>
<docs-card title="Habilitar hidratação incremental" link="Completo em Q2 2025" href="">
Na v17 graduamos hidratação de developer preview e temos observado consistentemente melhorias de 40-50% no LCP. Desde então começamos a prototipar hidratação incremental e compartilhamos uma demo no palco na ng-conf.

Na v19 lançamos a hidratação incremental no modo developer preview, impulsionada por blocos `@defer`. No Angular v20 graduamos isso para estável!
</docs-card>
<docs-card title="Entregar Angular Signals" link="Completo em Q2 2025" href="https://github.com/angular/angular/discussions/49685">
Este projeto repensa o modelo de reatividade do Angular introduzindo Signals como uma primitiva de reatividade. O planejamento inicial resultou em centenas de discussões, conversas com desenvolvedores, sessões de feedback, estudos de experiência do usuário e uma série de RFCs, que receberam mais de 1.000 comentários.

No Angular v20 graduamos todas as primitivas fundamentais de reatividade para estável, incluindo signal, effect, linkedSignal, queries baseadas em signal e inputs.
</docs-card>
<docs-card title="Suporte a drag-and-drop bidimensional" link="Completo em Q2 2024" href="https://github.com/angular/components/issues/13372">
Como parte deste projeto, implementamos suporte a orientação mista para drag and drop do Angular CDK. Esta é uma das funcionalidades mais solicitadas do repositório.
</docs-card>
<docs-card title="Event replay com SSR e prerendering" link="Completo em Q4 2024" href="https://angular.dev/api/platform-browser/withEventReplay">
Na v18 introduzimos uma funcionalidade de event replay ao usar server-side rendering ou prerendering. Para essa funcionalidade dependemos da primitiva de event dispatch (anteriormente conhecida como jsaction) que está rodando no Google.com.

No Angular v19 graduamos event replay para estável e habilitamos por padrão para todos os novos projetos.
</docs-card>
<docs-card title="Integrar Angular Language Service com Schematics" link="Completo em Q4 2024" href="">
Para facilitar para desenvolvedores o uso de APIs modernas do Angular, habilitamos integração entre o Angular language service e schematics que permite você refatorar sua aplicação com um único clique.
</docs-card>
<docs-card title="Simplificar imports standalone com Language Service" link="Completo em Q4 2024" href="">
Como parte desta iniciativa, o language service automaticamente importa components e pipes em aplicações standalone e baseadas em NgModule. Adicionalmente, adicionamos um diagnóstico de template para destacar imports não utilizados em components standalone, o que deve ajudar a tornar os bundles da aplicação menores.
</docs-card>
<docs-card title="Variáveis locais de template" link="Completo em Q3 2024">
Lançamos o suporte para variáveis locais de template no Angular, veja a [documentação de `@let`](https://angular.dev/api/core/@let) para informações adicionais.
</docs-card>
<docs-card title="Expandir a customização do Angular Material" link="Completo em Q2 2024" href="https://material.angular.dev/guide/theming">
Para fornecer melhor customização de nossos components do Angular Material e habilitar capacidades do Material 3, estaremos colaborando com o time de Material Design do Google na definição de APIs de theming baseadas em tokens.

Na v17.2 compartilhamos suporte experimental para Angular Material 3 e na v18 graduamos para estável.
</docs-card>
<docs-card title="Introduzir carregamento diferido" link="Completo em Q2 2024" href="https://next.angular.dev/guide/defer">
Na v17 lançamos deferrable views em developer preview, que fornecem uma API ergonômica para carregamento de código diferido. Na v18 habilitamos deferrable views para desenvolvedores de bibliotecas e graduamos a API para estável.
</docs-card>
<docs-card title="Suporte a iframe no Angular DevTools" link="Completo em Q2 2024" href="">
Habilitamos debugging e profiling de aplicações Angular incorporadas dentro de um iframe na página.
</docs-card>
<docs-card title="Automação para transição de projetos de renderização híbrida existentes para esbuild e vite" link="Completo em Q2 2024" href="tools/cli/build-system-migration">
Na v17 lançamos um application builder baseado em vite e esbuild e o habilitamos por padrão para novos projetos. Ele melhora o tempo de build para projetos usando renderização híbrida em até 87%. Como parte da v18 lançamos schematics e um guia que migram projetos existentes usando renderização híbrida para o novo pipeline de build.
</docs-card>
<docs-card title="Tornar Angular.dev o lar oficial para desenvolvedores Angular" link="Completo em Q2 2024" href="https://goo.gle/angular-dot-dev">
Angular.dev é o novo site, domínio e lar para desenvolvimento Angular. O novo site contém documentação atualizada, tutoriais e orientações que ajudarão desenvolvedores a construir com as funcionalidades mais recentes do Angular.
</docs-card>
<docs-card title="Introduzir controle de fluxo embutido" link="Completo em Q2 2024" href="https://next.angular.dev/essentials/conditionals-and-loops">
Na v17 lançamos uma versão developer preview de um novo controle de fluxo. Ele traz melhorias significativas de performance e melhor ergonomia para autoria de templates. Também fornecemos uma migração de `*ngIf`, `*ngFor` e `*ngSwitch` existentes que você pode executar para mover seu projeto para a nova implementação. A partir da v18 o controle de fluxo embutido agora está estável.
</docs-card>
<docs-card title="Modernizar tutorial de introdução" link="Completo Q4 2023" href="">
Nos últimos dois trimestres, desenvolvemos um novo tutorial em [vídeo](https://www.youtube.com/watch?v=xAT0lHYhHMY&list=PL1w1q3fL4pmj9k1FrJ3Pe91EPub2_h4jF) e [texto](https://angular.dev/tutorials/learn-angular) baseado em components standalone.
</docs-card>
<docs-card title="Investigar bundlers modernos" link="Completo Q4 2023" href="guide/hydration">
No Angular v16, lançamos um developer preview de um builder baseado em esbuild com suporte para `ng build` e `ng serve`. O servidor de desenvolvimento `ng serve` usa Vite e uma compilação multi-arquivo por esbuild e o compilador Angular. Na v17 graduamos as ferramentas de build de developer preview e habilitamos por padrão para novos projetos.
</docs-card>
<docs-card title="Introduzir APIs de debugging para dependency injection" link="Completo Q4 2023" href="tools/devtools">
Para melhorar os utilitários de debugging do Angular e Angular DevTools, trabalharemos em APIs que fornecem acesso ao runtime de dependency injection. Como parte do projeto, exporemos métodos de debugging que nos permitem explorar a hierarquia de injetores e as dependências através de seus providers associados. A partir da v17, lançamos uma funcionalidade que nos permite conectar ao ciclo de vida de dependency injection. Também lançamos uma visualização da árvore de injetores e inspeção dos providers declarados dentro de cada nó individual.
</docs-card>
<docs-card title="Melhorar documentação e schematics para components standalone" link="Completo Q4 2023" href="components">
Lançamos um developer preview da coleção de schematics `ng new --standalone`, permitindo você criar aplicações livres de NgModules. Na v17 mudamos o formato de autoria de novas aplicações para APIs standalone e alteramos a documentação para refletir a recomendação. Adicionalmente, lançamos schematics que suportam atualizar aplicações existentes para components, directives e pipes standalone. Embora NgModules permaneçam pelo futuro previsível, recomendamos que você explore os benefícios das novas APIs para melhorar a experiência do desenvolvedor e se beneficiar das novas funcionalidades que construímos para elas.
</docs-card>
<docs-card title="Explorar melhorias de hidratação e server-side rendering" link="Completo Q4 2023">
Na v16, lançamos um developer preview de hidratação completa não destrutiva, veja o [guia de hidratação](guide/hydration) e o [post do blog](https://blog.angular.dev/whats-next-for-server-side-rendering-in-angular-2a6f27662b67) para informações adicionais. Já estamos vendo melhorias significativas nos Core Web Vitals, incluindo [LCP](https://web.dev/lcp) e [CLS](https://web.dev/cls). Em testes de laboratório, observamos consistentemente 45% de melhoria no LCP de uma aplicação do mundo real.

Na v17 lançamos hidratação fora de developer preview e fizemos uma série de melhorias na história de server-side rendering, incluindo: descoberta de rotas em runtime para SSG, até 87% de build times mais rápidos para aplicações renderizadas híbridas, prompt que habilita renderização híbrida para novos projetos.
</docs-card>
<docs-card title="Hidratação completa de aplicação não destrutiva" link="Completo Q1 2023" href="guide/hydration">
Na v16, lançamos um developer preview de hidratação completa não destrutiva, que permite ao Angular reutilizar nós DOM existentes em uma página renderizada no servidor, em vez de recriar uma aplicação do zero. Veja informações adicionais no guia de hidratação.
</docs-card>
<docs-card title="Melhorias na image directive" link="Completo Q1 2023" href="guide/image-optimization">
Lançamos a image directive do Angular como estável na v15. Introduzimos uma nova funcionalidade de modo fill que permite imagens se ajustarem dentro de seu container pai em vez de ter dimensões explícitas. Nos últimos dois meses, o time Chrome Aurora fez backport da directive para v12 e mais recentes.
</docs-card>
<docs-card title="Refatoração da documentação" link="Completo Q1 2023" href="https://angular.io">
Garantir que toda a documentação existente se encaixe em um conjunto consistente de tipos de conteúdo. Atualizar uso excessivo de documentação estilo tutorial em tópicos independentes. Queremos garantir que o conteúdo fora dos tutoriais principais seja autossuficiente sem estar fortemente acoplado a uma série de guias. No Q2 2022, refatoramos o conteúdo de templates e dependency injection. No Q1 2023, melhoramos os guias HTTP e, com isso, estamos colocando o projeto de refatoração de documentação em espera.
</docs-card>
<docs-card title="Melhorar performance de imagens" link="Completo Q4 2022" href="guide/image-optimization">
Os times Aurora e Angular estão trabalhando na implementação de uma image directive que visa melhorar os Core Web Vitals. Lançamos uma versão estável da image directive na v15.
</docs-card>
<docs-card title="CSS moderno" link="Completo Q4 2022" href="https://blog.angular.dev/modern-css-in-angular-layouts-4a259dca9127">
O ecossistema web evolui constantemente e queremos refletir os últimos padrões modernos no Angular. Neste projeto visamos fornecer diretrizes sobre o uso de funcionalidades modernas de CSS no Angular para garantir que desenvolvedores sigam boas práticas para layout, estilização, etc. Compartilhamos diretrizes oficiais para layout e como parte da iniciativa paramos de publicar flex layout.
</docs-card>
<docs-card title="Suporte para adicionar directives a elementos host" link="Completo Q4 2022" href="guide/directives/directive-composition-api">
Uma solicitação de funcionalidade de longa data é adicionar a capacidade de adicionar directives a elementos host. A funcionalidade permite desenvolvedores aumentarem seus próprios components com comportamentos adicionais sem usar herança. Na v15 lançamos nossa API de composição de directive, que permite aprimorar elementos host com directives.
</docs-card>
<docs-card title="Melhores stack traces" link="Completo Q4 2022" href="https://developer.chrome.com/blog/devtools-better-angular-debugging/">
Os times Angular e Chrome DevTools estão trabalhando juntos para habilitar stack traces mais legíveis para mensagens de erro. Na v15 lançamos stack traces melhoradas, relevantes e linkadas. Como uma iniciativa de menor prioridade, estaremos explorando como tornar os stack traces mais amigáveis fornecendo nomes de call frame mais precisos para templates.
</docs-card>
<docs-card title="Components Angular Material aprimorados integrando MDC Web" link="Completo Q4 2022" href="https://material.angular.dev/guide/mdc-migration">
MDC Web é uma biblioteca criada pelo time Google Material Design que fornece primitivas reutilizáveis para construir components Material Design. O time Angular está incorporando essas primitivas no Angular Material. Usar MDC Web alinha o Angular Material mais proximamente com a especificação Material Design, expande acessibilidade, melhora qualidade de components e melhora a velocidade do nosso time.
</docs-card>
<docs-card title="Implementar APIs para NgModules opcionais" link="Completo Q4 2022" href="https://blog.angular.dev/angular-v15-is-now-available-df7be7f2f4c8">
No processo de tornar o Angular mais simples, estamos trabalhando em introduzir APIs que permitem desenvolvedores inicializarem aplicações, instanciarem components e usar o router sem NgModules. O Angular v14 introduz developer preview das APIs para components, directives e pipes standalone. Nos próximos trimestres coletaremos feedback de desenvolvedores e finalizaremos o projeto tornando as APIs estáveis. Como próximo passo trabalharemos em melhorar casos de uso como TestBed, Angular elements, etc.
</docs-card>
<docs-card title="Permitir binding a campos protegidos em templates" link="Completo Q2 2022" href="guide/templates/binding">
Para melhorar o encapsulamento de components do Angular habilitamos binding a membros protegidos da instância do component. Dessa forma você não precisará mais expor um campo ou método como público para usá-lo dentro de seus templates.
</docs-card>
<docs-card title="Publicar guias sobre conceitos avançados" link="Completo Q2 2022" href="https://angular.io/guide/change-detection">
Desenvolver e publicar um guia aprofundado sobre detecção de mudanças. Desenvolver conteúdo para profiling de performance de aplicações Angular. Cobrir como a detecção de mudanças interage com Zone.js e explicar quando ela é acionada, como fazer profiling de sua duração, bem como práticas comuns para otimização de performance.
</docs-card>
<docs-card title="Lançamento de tipagens estritas para @angular/forms" link="Completo Q2 2022" href="guide/forms/typed-forms">
No Q4 2021 projetamos uma solução para introduzir tipagens estritas para forms e no Q1 2022 concluímos a solicitação de comentários correspondente. Atualmente, estamos implementando uma estratégia de lançamento com uma etapa de migração automatizada que habilitará as melhorias para projetos existentes. Estamos primeiro testando a solução com mais de 2.500 projetos no Google para garantir um caminho de migração suave para a comunidade externa.
</docs-card>
<docs-card title="Remover View Engine legado" link="Completo Q1 2022" href="https://blog.angular.dev/angular-v15-is-now-available-df7be7f2f4c8">
Após a transição de todas as nossas ferramentas internas para Ivy estar completa, removeremos o View Engine legado para reduzir a sobrecarga conceitual do Angular, tamanho menor de pacote, menor custo de manutenção e menor complexidade da base de código.
</docs-card>
<docs-card title="Modelo mental simplificado do Angular com NgModules opcionais" link="Completo Q1 2022" href="https://blog.angular.dev/angular-v15-is-now-available-df7be7f2f4c8">
Para simplificar o modelo mental do Angular e a jornada de aprendizado, estaremos trabalhando em tornar NgModules opcionais. Este trabalho permite desenvolvedores desenvolverem components standalone e implementarem uma API alternativa para declarar o escopo de compilação do component. Iniciamos este projeto com discussões de design de alto nível que capturamos em um RFC.
</docs-card>
<docs-card title="Projetar tipagem estrita para @angular/forms" link="Completo Q1 2022" href="guide/forms/typed-forms">
Trabalharemos em encontrar uma maneira de implementar verificação de tipo mais estrita para reactive forms com implicações mínimas de incompatibilidade retroativa. Dessa forma, permitimos desenvolvedores capturarem mais problemas durante o tempo de desenvolvimento, habilitamos melhor suporte de editor de texto e IDE e melhoramos a verificação de tipo para reactive forms.
</docs-card>
<docs-card title="Melhorar integração do Angular DevTools com framework" link="Completo Q1 2022" href="tools/devtools">
Para melhorar a integração do Angular DevTools com o framework, estamos trabalhando em mover a base de código para o monorepositório angular/angular. Isso inclui fazer a transição do Angular DevTools para Bazel e integrá-lo nos processos existentes e pipeline de CI.
</docs-card>
<docs-card title="Lançar diagnósticos avançados do compilador" link="Completo Q1 2022" href="reference/extended-diagnostics">
Estender os diagnósticos do compilador Angular além da verificação de tipo. Introduzir outras verificações de correção e conformidade para garantir ainda mais correção e boas práticas.
</docs-card>
<docs-card title="Atualizar nossa estratégia de testes e2e" link="Completo Q3 2021" href="guide/testing">
Para garantir que fornecemos uma estratégia de testes e2e à prova de futuro, queremos avaliar o estado do Protractor, inovações da comunidade, boas práticas de e2e e explorar novas oportunidades. Como primeiros passos do esforço, compartilhamos um RFC e trabalhamos com parceiros para garantir integração suave entre o Angular CLI e ferramentas de ponta para testes e2e. Como próximo passo, precisamos finalizar as recomendações e compilar uma lista de recursos para a transição.
</docs-card>
<docs-card title="Bibliotecas Angular usam Ivy" link="Completo Q3 2021" href="tools/libraries">
No início de 2020, compartilhamos um RFC para distribuição de bibliotecas Ivy. Após feedback inestimável da comunidade, desenvolvemos um design do projeto. Agora estamos investindo no desenvolvimento da distribuição de bibliotecas Ivy, incluindo uma atualização do formato de pacote de biblioteca para usar compilação Ivy, desbloquear a depreciação do formato de biblioteca View Engine e ngcc.
</docs-card>
<docs-card title="Melhorar tempos de teste e debugging com desmontagem automática do ambiente de teste" link="Completo Q3 2021" href="guide/testing">
Para melhorar o tempo de teste e criar melhor isolamento entre testes, queremos mudar TestBed para automaticamente limpar e desmontar o ambiente de teste após cada execução de teste.
</docs-card>
<docs-card title="Depreciar e remover suporte a IE11" link="Completo Q3 2021" href="https://github.com/angular/angular/issues/41840">
Internet Explorer 11 (IE11) tem impedido o Angular de tirar proveito de algumas das funcionalidades modernas da plataforma web. Como parte deste projeto vamos depreciar e remover o suporte a IE11 para abrir o caminho para funcionalidades modernas que navegadores evergreen fornecem. Executamos um RFC para coletar feedback da comunidade e decidir sobre os próximos passos para avançar.
</docs-card>
<docs-card title="Aproveitar ES2017+ como linguagem de saída padrão" link="Completo Q3 2021" href="https://www.typescriptlang.org/docs/handbook/tsconfig-json.html">
Suportar navegadores modernos nos permite tirar proveito da sintaxe mais compacta, expressiva e performática do novo JavaScript. Como parte deste projeto investigaremos quais são os bloqueadores para avançar com este esforço e tomaremos as medidas para habilitá-lo.
</docs-card>
<docs-card title="Debugging acelerado e profiling de performance com Angular DevTools" link="Completo Q2 2021" href="tools/devtools">
Estamos trabalhando em ferramentas de desenvolvimento para Angular que fornecem utilitários para debugging e profiling de performance. Este projeto visa ajudar desenvolvedores a entender a estrutura de components e a detecção de mudanças em uma aplicação Angular.
</docs-card>
<docs-card title="Simplificar lançamentos com versionamento e branching consolidados do Angular" link="Completo Q2 2021" href="reference/releases">
Queremos consolidar ferramentas de gerenciamento de lançamento entre os múltiplos repositórios GitHub para Angular (angular/angular, angular/angular-cli e angular/components). Este esforço nos permite reutilizar infraestrutura, unificar e simplificar processos e melhorar a confiabilidade do nosso processo de lançamento.
</docs-card>
<docs-card title="Maior consistência de desenvolvimento com padronização de mensagens de commit" link="Completo Q2 2021" href="https://github.com/angular/angular">
Queremos unificar requisitos de mensagem de commit e conformidade entre repositórios Angular (angular/angular, angular/components e angular/angular-cli) para trazer consistência ao nosso processo de desenvolvimento e reutilizar ferramentas de infraestrutura.
</docs-card>
<docs-card title="Fazer transição do Angular language service para Ivy" link="Completo Q2 2021" href="tools/language-service">
O objetivo deste projeto é melhorar a experiência e remover dependência legada fazendo a transição do language service para Ivy. Hoje o language service ainda usa o compilador View Engine e verificação de tipo, mesmo para aplicações Ivy. Queremos usar o parser de template Ivy e verificação de tipo melhorada para o Angular Language service para corresponder ao comportamento da aplicação. Esta migração também é um passo em direção a desbloquear a remoção do View Engine, o que simplificará o Angular, reduzirá o tamanho do pacote npm e melhorará a manutenibilidade do framework.
</docs-card>
<docs-card title="Maior segurança com Trusted Types nativo no Angular" link="Completo Q2 2021" href="best-practices/security">
Em colaboração com o time de segurança do Google, estamos adicionando suporte para a nova API Trusted Types. Esta API de plataforma web ajuda desenvolvedores a construir aplicações web mais seguras.
</docs-card>
<docs-card title="Velocidade de build otimizada e tamanhos de bundle com webpack 5 no Angular CLI" link="Completo Q2 2021" href="tools/cli/build">
Como parte do lançamento v11, introduzimos um preview opt-in de webpack 5 no Angular CLI. Para garantir estabilidade, continuaremos iterando na implementação para habilitar melhorias de velocidade de build e tamanho de bundle.
</docs-card>
<docs-card title="Aplicações mais rápidas através de inlining de estilos críticos em aplicações Universal" link="Completo Q1 2021" href="guide/ssr">
Carregar folhas de estilo externas é uma operação bloqueante, o que significa que o navegador não pode começar a renderizar sua aplicação até carregar todo o CSS referenciado. Ter recursos que bloqueiam renderização no cabeçalho de uma página pode impactar significativamente sua performance de carregamento, por exemplo, seu first contentful paint. Para tornar aplicações mais rápidas, temos colaborado com o time do Google Chrome no inlining de CSS crítico e carregamento do resto dos estilos assincronamente.
</docs-card>
<docs-card title="Melhorar debugging com melhores mensagens de erro do Angular" link="Completo Q1 2021" href="reference/errors">
Mensagens de erro frequentemente trazem informação acionável limitada para ajudar desenvolvedores a resolvê-las. Temos trabalhado em tornar mensagens de erro mais descobríveis adicionando códigos associados, desenvolvendo guias e outros materiais para garantir uma experiência de debugging mais suave.
</docs-card>
<docs-card title="Melhor onboarding de desenvolvedor com documentação introdutória atualizada" link="Completo Q1 2021" href="tutorials">
Redefiniremos as jornadas de aprendizado do usuário e atualizaremos a documentação introdutória. Declararemos claramente os benefícios do Angular, como explorar suas capacidades e forneceremos orientação para que desenvolvedores possam se tornar proficientes com o framework no menor tempo possível.
</docs-card>
<docs-card title="Expandir boas práticas de component harnesses" link="Completo Q1 2021" href="https://material.angular.dev/guide/using-component-harnesses">
O Angular CDK introduziu o conceito de component test harnesses ao Angular na versão 9. Test harnesses permitem autores de components criarem APIs suportadas para testar interações de components. Estamos continuando a melhorar esta infraestrutura de harness e esclarecendo as boas práticas sobre usar harnesses. Também estamos trabalhando para impulsionar mais adoção de harness dentro do Google.
</docs-card>
<docs-card title="Criar um guia para projeção de conteúdo" link="Completo Q2 2021" href="https://angular.io/docs">
Projeção de conteúdo é um conceito central do Angular que não tem a presença que merece na documentação. Como parte deste projeto queremos identificar os principais casos de uso e conceitos para projeção de conteúdo e documentá-los.
</docs-card>
<docs-card title="Migrar para ESLint" link="Completo Q4 2020" href="tools/cli">
Com a depreciação de TSLint estaremos migrando para ESLint. Como parte do processo, trabalharemos em garantir compatibilidade retroativa com nossa configuração TSLint recomendada atual, implementar uma estratégia de migração para aplicações Angular existentes e introduzir novas ferramentas à toolchain do Angular CLI.
</docs-card>
<docs-card title="Operation Bye Bye Backlog (também conhecida como Operation Byelog)" link="Completo Q4 2020" href="https://github.com/angular/angular/issues">
Estamos investindo ativamente até 50% de nossa capacidade de engenharia em triagem de issues e PRs até termos uma compreensão clara das necessidades mais amplas da comunidade. Depois disso, nos comprometeremos com até 20% de nossa capacidade de engenharia para acompanhar novas submissões prontamente.
</docs-card>
</docs-card-container>
