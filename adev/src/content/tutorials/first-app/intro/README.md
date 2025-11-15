<!-- ia-translate: true -->
# Construa sua primeira aplicação Angular

Este tutorial consiste em lições que introduzem os conceitos do Angular que você precisa conhecer para começar a programar em Angular.

Você pode fazer quantas ou poucas lições quiser e pode fazê-las em qualquer ordem.

ÚTIL: Prefere vídeo? Também temos um [curso completo no YouTube](https://youtube.com/playlist?list=PL1w1q3fL4pmj9k1FrJ3Pe91EPub2_h4jF&si=1q9889ulHp8VZ0e7) para este tutorial!

<docs-video src="https://www.youtube.com/embed/xAT0lHYhHMY?si=cKUW_MGn3MesFT7o"/>

## Antes de começar

Para a melhor experiência com este tutorial, revise estes requisitos para ter certeza de que você tem o que precisa para ter sucesso.

### Sua experiência

As lições neste tutorial presumem que você tenha experiência com o seguinte:

1. Criou uma página web HTML editando o HTML diretamente.
1. Programou conteúdo de site web em JavaScript.
1. Leu conteúdo de Cascading Style Sheet (CSS) e entende como seletores são usados.
1. Usou instruções de linha de comando para realizar tarefas em seu computador.

### Seu equipamento

Essas lições podem ser completadas usando uma instalação local das ferramentas do Angular ou em nosso editor incorporado. O desenvolvimento local do Angular pode ser completado em sistemas baseados em Windows, MacOS ou Linux.

NOTA: Fique atento a alertas como este, que destacam passos que podem ser apenas para seu editor local.

## Pré-visualização conceitual de sua primeira aplicação Angular

As lições neste tutorial criam uma aplicação Angular que lista casas para alugar e mostra os detalhes de casas individuais.
Esta aplicação usa funcionalidades que são comuns a muitas aplicações Angular.

<img alt="Output of homes landing page" src="assets/images/tutorials/first-app/homes-app-landing-page.png">

## Ambiente de desenvolvimento local

NOTA: Este passo é apenas para seu ambiente local!

Execute esses passos em uma ferramenta de linha de comando no computador que você deseja usar para este tutorial.

<docs-workflow>

<docs-step title="Identificar a versão do `node.js` que o Angular requer">
Angular requer uma versão LTS ativa ou LTS de manutenção do Node. Vamos confirmar sua versão do `node.js`. Para informações sobre requisitos de versão específicos, consulte a propriedade engines no [arquivo package.json](https://unpkg.com/browse/@angular/core@15.1.5/package.json).

A partir de uma janela de **Terminal**:

1. Execute o seguinte comando: `node --version`
1. Confirme que o número da versão exibida atende aos requisitos.
   </docs-step>

<docs-step title="Instalar a versão correta do `node.js` para Angular">
Se você não tiver uma versão do `node.js` instalada, siga as [instruções de instalação no nodejs.org](https://nodejs.org/en/download/)
</docs-step>

<docs-step title="Instalar a versão mais recente do Angular">
Com `node.js` e `npm` instalados, o próximo passo é instalar o [Angular CLI](tools/cli) que fornece ferramentas para desenvolvimento eficaz do Angular.

A partir de uma janela de **Terminal**, execute o seguinte comando: `npm install -g @angular/cli`.
</docs-step>

<docs-step title="Instalar ambiente de desenvolvimento integrado (IDE)">
Você é livre para usar qualquer ferramenta que preferir para construir aplicações com Angular. Recomendamos o seguinte:

1. [Visual Studio Code](https://code.visualstudio.com/)
2. Como um passo opcional, mas recomendado, você pode melhorar ainda mais sua experiência de desenvolvedor instalando o [Angular Language Service](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template)
3. [WebStorm](https://www.jetbrains.com/webstorm/)
   </docs-step>

<docs-step title="Opcional: configure seu IDE com IA">

Caso você esteja seguindo este tutorial em seu IDE com IA preferido, [confira as regras de prompt e melhores práticas do Angular](/ai/develop-with-ai).

</docs-step>

</docs-workflow>

Para mais informações sobre os tópicos cobertos nesta lição, visite:

<docs-pill-row>
  <docs-pill href="/overview" title="O que é Angular"/>
  <docs-pill href="/tools/cli/setup-local" title="Configurando o ambiente local e workspace"/>
  <docs-pill href="/cli" title="Referência do Angular CLI"/>
</docs-pill-row>
