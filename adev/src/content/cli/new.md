<!-- ia-translate: true -->
# ng new

Cria um novo workspace Angular.

Cria e inicializa uma nova aplicação Angular que é o projeto padrão para um novo workspace.

Fornece prompts interativos para configuração opcional, como adicionar suporte a roteamento.
Todos os prompts podem ser aceitos com segurança nos valores padrão.

- A nova pasta do workspace recebe o nome do projeto especificado e contém arquivos de configuração no nível superior.

- Por padrão, os arquivos para uma nova aplicação inicial (com o mesmo nome do workspace) são colocados na subpasta `src/`.
- A configuração da nova aplicação aparece na seção `projects` do arquivo de configuração do workspace `angular.json`, sob o nome do projeto.

- As aplicações subsequentes que você gerar no workspace residirão na subpasta `projects/`.

Se você planeja ter múltiplas aplicações no workspace, você pode criar um workspace vazio usando a opção `--no-create-application`.
Você pode então usar `ng generate application` para criar uma aplicação inicial.
Isso permite que o nome do workspace seja diferente do nome da aplicação inicial e garante que todas as aplicações residam na subpasta `/projects`, correspondendo à estrutura do arquivo de configuração.

## Uso

```bash
ng new [name]
```

## Argumentos

| Argumento | Descrição |
|:--- |:--- |
| name | O nome para o novo workspace e o projeto inicial. Este nome será usado para o diretório raiz e vários identificadores ao longo do projeto. |

## Opções

| Opção | Descrição |
|:--- |:--- |
| --ai-config | Especifica para quais ferramentas de IA gerar arquivos de configuração. Esses arquivos são usados para melhorar as saídas das ferramentas de IA seguindo as melhores práticas. Valores aceitos: `agents`, `claude`, `copilot`, `cursor`, `gemini`, `jetbrains`, `none`, `windsurf`. |
| --collection, -c | Uma coleção de schematics para usar na geração da aplicação inicial. |
| --commit | Configura o commit Git inicial para o novo repositório. Padrão: `true`. |
| --create-application | Cria um novo projeto de aplicação inicial no novo workspace. Quando false, cria um workspace vazio sem aplicação inicial. Você pode então usar o comando `ng generate application` para criar aplicações no diretório `projects`. Padrão: `true`. |
| --defaults | Desabilita prompts interativos de entrada para opções com um padrão. Padrão: `false`. |
| --directory | O diretório onde o novo workspace e projeto devem ser criados. Se não especificado, o workspace será criado no diretório atual. |
| --dry-run, -d | Executa e reporta atividades sem escrever os resultados. Padrão: `false`. |
| --file-name-style-guide | A convenção de nomenclatura de arquivos a ser usada para arquivos gerados. O guia de estilo '2025' (padrão) usa um formato conciso (por exemplo, `app.ts` para o component raiz), enquanto o guia de estilo '2016' inclui o tipo no nome do arquivo (por exemplo, `app.component.ts`). Para mais informações, consulte o Guia de Estilo Angular (https://angular.dev/style-guide). Valores aceitos: `2016`, `2025`. Padrão: `2025`. |
| --force | Força a sobrescrita de arquivos existentes. Padrão: `false`. |
| --help | Mostra uma mensagem de ajuda para este comando no console. |
| --inline-style, -s | Inclui os estilos para o component raiz da aplicação inicial diretamente dentro do arquivo `app.component.ts`. Por padrão, um arquivo de folha de estilos separado (por exemplo, `app.component.css`) é criado. |
| --inline-template, -t | Inclui o template HTML para o component raiz da aplicação inicial diretamente dentro do arquivo `app.component.ts`. Por padrão, um arquivo de template separado (por exemplo, `app.component.html`) é criado. |
| --interactive | Habilita prompts interativos de entrada. Padrão: `true`. |
| --minimal | Gera um workspace Angular mínimo sem quaisquer frameworks de teste. Isso é destinado para fins de aprendizado e experimentação simples, não para aplicações de produção. Padrão: `false`. |
| --new-project-root | O caminho onde novos projetos serão criados dentro do workspace, relativo à raiz do workspace. Por padrão, novos projetos são criados no diretório `projects`. Padrão: `projects`. |
| --package-manager | O gerenciador de pacotes usado para instalar dependências. Valores aceitos: `bun`, `npm`, `pnpm`, `yarn`. |
| --prefix, -p | O prefixo a ser aplicado aos seletores gerados para o projeto inicial. Por exemplo, se o prefixo for `my-app` e você gerar um component chamado `my-component`, o seletor será `my-app-my-component`. Padrão: `app`. |
| --routing | Habilita routing no projeto de aplicação inicial. Isso configura os arquivos e módulos necessários para gerenciar a navegação entre diferentes views em sua aplicação. |
| --skip-git, -g | Não inicializa um repositório Git no novo workspace. Por padrão, um repositório Git é inicializado para ajudá-lo a rastrear mudanças em seu projeto. Padrão: `false`. |
| --skip-install | Pula a instalação automática de pacotes. Você precisará instalar as dependências manualmente mais tarde. Padrão: `false`. |
| --skip-tests, -S | Pula a geração de arquivos de teste unitário `spec.ts`. Padrão: `false`. |
| --ssr | Configura a aplicação inicial para Server-Side Rendering (SSR) e Static Site Generation (SSG/Prerendering). |
| --standalone | Cria uma aplicação baseada na API standalone, sem NgModules. Padrão: `true`. |
| --strict | Habilita verificação de tipo mais rigorosa e configurações de orçamento de bundle mais rigorosas. Esta configuração ajuda a melhorar a manutenibilidade e detectar bugs antecipadamente. Para mais informações, consulte https://angular.dev/tools/cli/template-typecheck#strict-mode. Padrão: `true`. |
| --style | O tipo de arquivos de folha de estilos a serem criados para components no projeto inicial. Valores aceitos: `css`, `less`, `sass`, `scss`, `tailwind`. |
| --test-runner | O executor de testes unitários a ser usado. Valores aceitos: `karma`, `vitest`. Padrão: `vitest`. |
| --view-encapsulation | Define o modo de encapsulamento de view para components no projeto inicial. Isso determina como os estilos de components são delimitados e aplicados. As opções incluem: `Emulated` (padrão, estilos são delimitados ao component), `None` (estilos são globais) e `ShadowDom` (estilos são encapsulados usando Shadow DOM). Valores aceitos: `Emulated`, `None`, `ShadowDom`. |
| --zoneless | Cria uma aplicação inicial que não utiliza `zone.js`. |

## Aliases

- `n`
