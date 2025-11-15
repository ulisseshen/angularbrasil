<!-- ia-translate: true -->
<docs-decorative-header title="O que é Angular?" imgSrc="adev/src/assets/images/what_is_angular.svg"> <!-- markdownlint-disable-line -->
</docs-decorative-header>

<p style="margin-top: 2em; font-size: larger;">
Angular é um framework web que capacita desenvolvedores a construir aplicações rápidas e confiáveis.
</p>

Mantido por uma equipe dedicada no Google, o Angular fornece um amplo conjunto de ferramentas, APIs e
bibliotecas para simplificar e otimizar seu fluxo de trabalho de desenvolvimento. O Angular oferece
uma plataforma sólida para construir aplicações rápidas e confiáveis que escalam tanto com o tamanho da
sua equipe quanto com o tamanho da sua base de código.

**Quer ver algum código?** Pule para nossos [Essentials](essentials) para uma visão geral rápida de
como é usar Angular, ou comece no [Tutorial](tutorials/learn-angular) se você
prefere seguir instruções passo a passo.

## Recursos que impulsionam seu desenvolvimento

<docs-card-container>
  <docs-card title="Mantenha sua base de código organizada com um modelo de components opinativo e um sistema flexível de dependency injection" href="guide/components" link="Comece com Components">
  Components do Angular facilitam dividir seu código em partes bem encapsuladas.

O sistema versátil de dependency injection ajuda você a manter seu código modular, fracamente acoplado e
testável.
</docs-card>
<docs-card title="Obtenha atualizações de estado rápidas com reatividade granular baseada em Signals" href="guide/signals" link="Explore Angular Signals">
Nosso modelo de reatividade granular, combinado com otimizações em tempo de compilação, simplifica o desenvolvimento e ajuda a construir aplicações mais rápidas por padrão.

Rastreie de forma granular como e onde o estado é usado em toda a aplicação, dando ao framework o poder de renderizar atualizações rápidas através de instruções altamente otimizadas.
</docs-card>
<docs-card title="Alcance suas metas de performance com SSR, SSG, hydration e carregamento diferido de próxima geração" href="guide/ssr" link="Leia sobre SSR">
Angular suporta tanto server-side rendering (SSR) quanto static site generation (SSG) junto
com hydration completa do DOM. Blocos `@defer` em templates facilitam dividir declarativamente
seus templates em partes carregáveis sob demanda.
</docs-card>
<docs-card title="Garanta que tudo funcione junto com os módulos oficiais do Angular para formulários, roteamento e
muito mais">
[O router do Angular](guide/routing) fornece um kit de ferramentas de navegação rico em recursos, incluindo suporte
para route guards, resolução de dados, lazy-loading e muito mais.

[O módulo de formulários do Angular](guide/forms) fornece um sistema padronizado para participação e validação de formulários.
</docs-card>
</docs-card-container>

## Desenvolva aplicações mais rápido do que nunca

<docs-card-container>
  <docs-card title="Construa, sirva, teste e implante facilmente com Angular CLI" href="tools/cli" link="Angular CLI">
  O Angular CLI coloca seu projeto em execução em menos de um minuto com os comandos que você precisa para
  crescer até uma aplicação de produção implantada.
  </docs-card>
  <docs-card title="Depure visualmente, analise e otimize seu código com a extensão de navegador Angular DevTools" href="tools/devtools" link="Angular DevTools">
  O Angular DevTools fica ao lado das ferramentas de desenvolvedor do seu navegador. Ele ajuda a depurar e analisar sua
  aplicação, incluindo um inspetor de árvore de components, visualização de árvore de dependency injection
  e gráfico de chama de profiling de performance personalizado.
  </docs-card>
  <docs-card title="Nunca perca uma versão com ng update" href="cli/update" link="ng update">
  O comando `ng update` do Angular CLI executa transformações de código automatizadas que lidam automaticamente com
  mudanças incompatíveis de rotina, simplificando drasticamente atualizações de versões principais. Manter-se atualizado com a última
  versão mantém sua aplicação o mais rápida e segura possível.
  </docs-card>
  <docs-card title="Mantenha-se produtivo com integração de IDE no seu editor favorito" href="tools/language-service" link="Language service">
  Os serviços de linguagem de IDE do Angular fornecem autocompletar de código, navegação, refatoração e
  diagnósticos em tempo real no seu editor favorito.
  </docs-card>
</docs-card-container>

## Publique com confiança

<docs-card-container>
  <docs-card title="Verificado commit por commit contra o colossal monorepo do Google" href="https://cacm.acm.org/magazines/2016/7/204032-why-google-stores-billions-of-lines-of-code-in-a-single-repository/fulltext" link="Saiba mais sobre o monorepo do Google">
  Cada commit do Angular é verificado contra _centenas de milhares_ de testes no repositório de código interno do Google,
  representando incontáveis cenários do mundo real.

O Angular está comprometido com a estabilidade de alguns dos maiores produtos do Google, incluindo Google Cloud.
Este compromisso garante que as mudanças sejam bem testadas, compatíveis com versões anteriores e incluam ferramentas de migração
sempre que possível.
</docs-card>
<docs-card title="Políticas de suporte claras e cronograma de lançamento previsível" href="reference/releases" link="Versionamento e lançamentos">
O cronograma de lançamento previsível e baseado em tempo do Angular dá à sua organização confiança na
estabilidade e compatibilidade com versões anteriores do framework. Janelas de Long Term Support (LTS) garantem que
você obtenha correções críticas de segurança quando precisar delas. Ferramentas de atualização oficiais, guias e schematics de
migração automatizados ajudam a manter suas aplicações atualizadas com os últimos avanços do framework
e da plataforma web.
</docs-card>
</docs-card-container>

## Funciona em qualquer escala

<docs-card-container>
  <docs-card title="Alcance usuários em todos os lugares com suporte a internacionalização" href="guide/i18n" link="Internacionalização">
  Os recursos de internacionalização do Angular lidam com traduções e formatação de mensagens, incluindo
  suporte para a sintaxe padrão unicode ICU.
  </docs-card>
  <docs-card title="Proteja seus usuários com segurança por padrão" href="best-practices/security" link="Segurança">
  Em colaboração com engenheiros de segurança de classe mundial do Google, o Angular visa tornar o desenvolvimento
  seguro por padrão. Recursos de segurança integrados, incluindo sanitização de HTML e
  suporte a trusted types, ajudam a proteger seus usuários de vulnerabilidades comuns como
  cross-site scripting e cross-site request forgery.
  </docs-card>
  <docs-card title="Mantenha grandes equipes produtivas com Vite e esbuild" href="tools/cli/build-system-migration" link="ESBuild e Vite">
  O Angular CLI inclui um pipeline de build rápido e moderno usando Vite e ESBuild. Desenvolvedores relatam
  construir projetos com centenas de milhares de linhas de código em menos de um minuto.
  </docs-card>
  <docs-card title="Comprovado em algumas das maiores aplicações web do Google">
  Grandes produtos do Google são construídos sobre a arquitetura do Angular e ajudam a desenvolver novos recursos que
  melhoram ainda mais a escalabilidade do Angular, do [Google Fonts](https://fonts.google.com/) ao [Google Cloud](https://console.cloud.google.com).
  </docs-card>
</docs-card-container>

## Open-source em primeiro lugar

<docs-card-container>
  <docs-card title="Feito abertamente no GitHub" href="https://github.com/angular/angular" link="Dê uma estrela no nosso GitHub">
  Curioso sobre o que estamos trabalhando? Cada PR e commit está disponível no nosso GitHub. Encontrou um problema ou bug? Fazemos triagem de issues do GitHub regularmente para garantir que somos responsivos e engajados com nossa comunidade, e resolvendo os problemas do mundo real que você está enfrentando.
  </docs-card>
  <docs-card title="Construído com transparência" href="roadmap" link="Leia nosso roadmap público">
  Nossa equipe publica um roadmap público de nosso trabalho atual e futuro e valoriza seu feedback. Publicamos Request for Comments (RFCs) para coletar feedback sobre mudanças de recursos maiores e garantir que a voz da comunidade seja ouvida ao moldar a direção futura do Angular.
  </docs-card>
</docs-card-container>

## Uma comunidade próspera

<docs-card-container>
  <docs-card title="Cursos, blogs e recursos" href="https://devlibrary.withgoogle.com/products/angular?sort=added" link="Confira o DevLibrary">
  Nossa comunidade é composta por desenvolvedores talentosos, escritores, instrutores, podcasters e muito mais. A Google for Developers library é apenas uma amostra dos recursos de alta qualidade disponíveis para desenvolvedores novos e experientes continuarem se desenvolvendo.
  </docs-card>
  <docs-card title="Open Source" href="https://github.com/angular/angular/blob/main/CONTRIBUTING.md" link="Contribua com o Angular">
  Somos gratos aos contribuidores open source que tornam o Angular um framework melhor para todos. Desde corrigir um erro de digitação nos documentos até adicionar recursos importantes, encorajamos qualquer pessoa interessada a começar no nosso GitHub.
  </docs-card>
  <docs-card title="Parcerias com a comunidade" href="https://developers.google.com/community/experts/directory?specialization=angular" link="Conheça os Angular GDEs">
  Nossa equipe faz parceria com indivíduos, educadores e empresas para garantir que estamos constantemente apoiando desenvolvedores. Angular Google Developer Experts (GDEs) representam líderes da comunidade ao redor do mundo educando, organizando e desenvolvendo com Angular. Parcerias empresariais ajudam a garantir que o Angular escale bem para líderes da indústria de tecnologia.
  </docs-card>
  <docs-card title="Parceria com outras tecnologias do Google">
  O Angular trabalha em estreita colaboração com outras tecnologias e equipes do Google para melhorar a web.

Nossa parceria contínua com o Chrome Aurora explora ativamente melhorias na experiência do usuário em toda a web, desenvolvendo otimizações de performance integradas como NgOptimizedImage e melhorias nos Core Web Vitals do Angular.

Também estamos trabalhando com [Firebase](https://firebase.google.com/), [Tensorflow](https://www.tensorflow.org/), [Flutter](https://flutter.dev/), [Material Design](https://m3.material.io/) e [Google Cloud](https://cloud.google.com/) para garantir que fornecemos integrações significativas em todo o fluxo de trabalho do desenvolvedor.
</docs-card>
</docs-card-container>

<docs-callout title="Junte-se ao movimento!">
  <docs-pill-row>
    <docs-pill href="roadmap" title="Leia o roadmap do Angular"/>
    <docs-pill href="playground" title="Experimente nosso playground"/>
    <docs-pill href="tutorials" title="Aprenda com tutoriais"/>
    <docs-pill href="https://youtube.com/playlist?list=PL1w1q3fL4pmj9k1FrJ3Pe91EPub2_h4jF" title="Assista nosso curso no YouTube"/>
    <docs-pill href="api" title="Consulte nossas APIs"/>
  </docs-pill-row>
</docs-callout>
