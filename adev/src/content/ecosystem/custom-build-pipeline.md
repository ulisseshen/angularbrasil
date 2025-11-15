<!-- ia-translate: true -->
# Pipeline de build personalizado

Ao construir uma aplicação Angular, recomendamos fortemente que você use o Angular CLI para aproveitar sua funcionalidade de atualização dependente de estrutura e abstração do sistema de build. Dessa forma, seus projetos se beneficiam das melhorias mais recentes de segurança, desempenho e API e melhorias transparentes de build.

Esta página explora os **casos de uso raros** quando você precisa de um pipeline de build personalizado que não usa o Angular CLI. Todas as ferramentas listadas abaixo são plugins de build de código aberto que são mantidos por membros da comunidade Angular. Para saber mais sobre seu modelo de suporte e status de manutenção, consulte sua documentação e URLs de repositório GitHub.

## Quando você deve usar um pipeline de build personalizado?

Existem alguns casos de uso de nicho quando você pode querer manter um pipeline de build personalizado. Por exemplo:

- Você tem uma aplicação existente usando uma toolchain diferente e gostaria de adicionar Angular a ela
- Você está fortemente acoplado a [module federation](https://module-federation.io/) e incapaz de adotar [native federation](https://www.npmjs.com/package/@angular-architects/native-federation) agnóstico de bundler
- Você gostaria de criar um experimento de curta duração usando sua ferramenta de build favorita

## Quais são as opções?

Atualmente, existem duas ferramentas comunitárias bem suportadas que permitem criar um pipeline de build personalizado com um [plugin Vite](https://www.npmjs.com/package/@analogjs/vite-plugin-angular) e [plugin Rspack](https://www.npmjs.com/package/@nx/angular-rspack). Ambos usam abstrações subjacentes que alimentam o Angular CLI. Eles permitem que você crie um pipeline de build flexível e requerem manutenção manual e nenhuma experiência de atualização automatizada.

### Rspack

Rspack é um bundler baseado em Rust que visa fornecer compatibilidade com o ecossistema de plugins webpack.

Se seu projeto está fortemente acoplado ao ecossistema webpack, dependendo muito de uma configuração webpack personalizada, você pode aproveitar o Rspack para melhorar seus tempos de build.

Você pode encontrar mais sobre Angular Rspack no [site de documentação](https://nx.dev/recipes/angular/rspack/introduction) do projeto.

### Vite

Vite é uma ferramenta de build frontend que visa fornecer uma experiência de desenvolvimento mais rápida e enxuta para projetos web modernos. Vite também é extensível através de seu sistema de plugins que permite que ecossistemas construam integrações com Vite, como Vitest para testes de unidade e browser, Storybook para criar components isoladamente e mais. O Angular CLI também usa Vite como seu servidor de desenvolvimento.

O [plugin Vite AnalogJS para Angular](https://www.npmjs.com/package/@analogjs/vite-plugin-angular) permite a adoção do Angular com um projeto ou framework que usa ou é construído em cima do Vite. Isso pode consistir em desenvolver e construir um projeto Angular com Vite diretamente, ou adicionar Angular a um projeto ou pipeline existente. Um exemplo é integrar components UI Angular em um site de documentação usando [Astro e Starlight](https://analogjs.org/docs/packages/astro-angular/overview).

Você pode aprender mais sobre AnalogJS e como usar o plugin através de sua [página de documentação](https://analogjs.org/docs/packages/vite-plugin-angular/overview).
