<!-- ia-translate: true -->
# Build pipeline personalizado

Ao construir uma aplicação Angular, recomendamos fortemente que você use o Angular CLI para aproveitar sua funcionalidade de atualização dependente da estrutura e abstração do build system. Dessa forma, seus projetos se beneficiam das melhorias mais recentes de segurança, performance e API, além de melhorias de build transparentes.

Esta página explora os **casos de uso raros** quando você precisa de um build pipeline personalizado que não usa o Angular CLI. Todas as ferramentas listadas abaixo são build plugins open source que são mantidos por membros da comunidade Angular. Para saber mais sobre seu modelo de suporte e status de manutenção, consulte sua documentação e URLs do repositório GitHub.

## Quando você deve usar um build pipeline personalizado?

Existem alguns casos de uso específicos quando você pode querer manter um build pipeline personalizado. Por exemplo:

- Você tem uma aplicação existente usando uma toolchain diferente e gostaria de adicionar Angular a ela
- Você está fortemente acoplado ao [module federation](https://module-federation.io/) e não consegue adotar o [native federation](https://www.npmjs.com/package/@angular-architects/native-federation) independente de bundler
- Você gostaria de criar um experimento de curta duração usando sua ferramenta de build favorita

## Quais são as opções?

Atualmente, existem duas ferramentas da comunidade bem suportadas que permitem que você crie um build pipeline personalizado com um [Vite plugin](https://www.npmjs.com/package/@analogjs/vite-plugin-angular) e [Rspack plugin](https://www.npmjs.com/package/@nx/angular-rspack). Ambas usam abstrações subjacentes que alimentam o Angular CLI. Elas permitem que você crie um build pipeline flexível e requerem manutenção manual e nenhuma experiência de atualização automatizada.

### Rspack

Rspack é um bundler baseado em Rust que visa fornecer compatibilidade com o ecossistema de plugins do webpack.

Se o seu projeto está fortemente acoplado ao ecossistema webpack, dependendo muito de uma configuração webpack personalizada, você pode aproveitar o Rspack para melhorar seus tempos de build.

Você pode encontrar mais sobre Angular Rspack no [site de documentação](https://nx.dev/recipes/angular/rspack/introduction) do projeto.

### Vite

Vite é uma ferramenta de build frontend que visa fornecer uma experiência de desenvolvimento mais rápida e enxuta para projetos web modernos. Vite também é extensível através do seu plugin system que permite que ecossistemas construam integrações com Vite, como Vitest para testes unitários e de browser, Storybook para criar components em isolamento, e muito mais. O Angular CLI também usa Vite como seu development server.

O [AnalogJS Vite plugin para Angular](https://www.npmjs.com/package/@analogjs/vite-plugin-angular) permite a adoção do Angular com um projeto ou framework que usa ou é construído em cima do Vite. Isso pode consistir em desenvolver e construir um projeto Angular com Vite diretamente, ou adicionar Angular a um projeto ou pipeline existente. Um exemplo é integrar components UI Angular em um site de documentação usando [Astro e Starlight](https://analogjs.org/docs/packages/astro-angular/overview).

Você pode aprender mais sobre AnalogJS e como usar o plugin através de sua [página de documentação](https://analogjs.org/docs/packages/vite-plugin-angular/overview).
