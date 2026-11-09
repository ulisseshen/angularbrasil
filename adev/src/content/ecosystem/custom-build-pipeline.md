<!-- ia-translate: true -->

# Pipeline de build personalizado {#custom-build-pipeline}

Ao construir uma aplicação Angular, recomendamos fortemente que você use o Angular CLI para aproveitar sua funcionalidade de atualização dependente de estrutura e sua abstração do sistema de build. Dessa forma, seus projetos se beneficiam das melhorias mais recentes de segurança, desempenho e APIs, além de melhorias transparentes no build.

Esta página explora os **casos de uso raros** em que você precisa de um pipeline de build personalizado que não usa o Angular CLI. Todas as ferramentas listadas abaixo são plugins de build de código aberto mantidos por membros da comunidade Angular. Para saber mais sobre o modelo de suporte e o status de manutenção delas, consulte a documentação e as URLs dos repositórios no GitHub.

## Quando você deve usar um pipeline de build personalizado? {#when-should-you-use-a-custom-build-pipeline}

Existem alguns casos de uso de nicho em que você pode querer manter um pipeline de build personalizado. Por exemplo:

- Você tem uma aplicação existente que usa uma toolchain diferente e gostaria de adicionar Angular a ela
- Você está fortemente acoplado ao [module federation](https://module-federation.io/) e não consegue adotar o [native federation](https://www.npmjs.com/package/@angular-architects/native-federation), que é agnóstico de bundler
- Você gostaria de criar um experimento de curta duração usando sua ferramenta de build favorita

## Quais são as opções? {#what-are-the-options}

Atualmente, existem duas ferramentas comunitárias bem suportadas que permitem criar um pipeline de build personalizado: um [plugin Vite](https://www.npmjs.com/package/@analogjs/vite-plugin-angular) e um [plugin Rspack](https://www.npmjs.com/package/@nx/angular-rspack). Ambos usam abstrações subjacentes que também alimentam o Angular CLI. Eles permitem que você crie um pipeline de build flexível, mas exigem manutenção manual e não oferecem uma experiência de atualização automatizada.

### Rspack

Rspack é um bundler baseado em Rust que visa oferecer compatibilidade com o ecossistema de plugins do webpack.

Se o seu projeto está fortemente acoplado ao ecossistema webpack, dependendo muito de uma configuração personalizada do webpack, você pode usar o Rspack para melhorar seus tempos de build.

Você pode encontrar mais informações sobre o Angular Rspack no [site de documentação](https://nx.dev/recipes/angular/rspack/introduction) do projeto.

### Vite

Vite é uma ferramenta de build frontend que visa oferecer uma experiência de desenvolvimento mais rápida e enxuta para projetos web modernos. O Vite também é extensível por meio do seu sistema de plugins, que permite que ecossistemas construam integrações com ele, como o Vitest para testes de unidade e de browser, o Storybook para criar components isoladamente e outras. O Angular CLI também usa o Vite como seu servidor de desenvolvimento.

O [plugin Vite do AnalogJS para Angular](https://www.npmjs.com/package/@analogjs/vite-plugin-angular) permite a adoção do Angular em um projeto ou framework que usa ou é construído sobre o Vite. Isso pode consistir em desenvolver e construir um projeto Angular diretamente com o Vite, ou em adicionar Angular a um projeto ou pipeline existente. Um exemplo é integrar components de UI Angular a um site de documentação usando [Astro e Starlight](https://analogjs.org/docs/packages/astro-angular/overview).

Você pode aprender mais sobre o AnalogJS e como usar o plugin por meio da sua [página de documentação](https://analogjs.org/docs/packages/vite-plugin-angular/overview).
