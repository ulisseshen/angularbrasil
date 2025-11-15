<!-- ia-translate: true -->
# [Angular.dev](https://www.angular.dev)

Este site é construído com Angular.

O conteúdo é escrito principalmente em formato Markdown localizado em `src/content`. Para edições simples, você pode editar diretamente o arquivo no GitHub e gerar um Pull Request.

## Desenvolvimento Local

Para desenvolvimento local, [pnpm](https://pnpm.io/) é o gerenciador de pacotes preferido. Você pode configurar um ambiente local com os seguintes comandos:

```bash
# Clone do repositório Angular
git clone https://github.com/angular/angular.git

# Navegue para o diretório do projeto
cd angular

# Instale as dependências
pnpm

# Compile e execute o servidor de desenvolvimento local
# NOTA: A compilação inicial levará algum tempo
pnpm adev
```

Se você estiver tendo problemas com a compilação da documentação, consulte a seção [FAQs](#faqs).

## Contribuindo

Quer reportar um bug, contribuir com código ou melhorar a documentação? Excelente!

Leia nossas [diretrizes de contribuição](/CONTRIBUTING.md) para aprender sobre nosso processo de submissão, regras de código e mais.

E se você é novo, confira uma de nossas issues marcadas como <kbd>[help wanted](https://github.com/angular/angular/labels/help%20wanted)</kbd> ou <kbd>[good first issue](https://github.com/angular/angular/labels/good%20first%20issue)</kbd>.

### Código de Conduta

Ajude-nos a manter o Angular aberto e inclusivo. Por favor, leia e siga nosso [Código de Conduta](/CODE_OF_CONDUCT.md).

## Perguntas Frequentes

### A compilação está falhando e estou vendo mensagens `bazel:bazel failed: missing input file`.

Isso provavelmente se deve a um problema de dependência / cache do bazel. Para resolver isso, execute o seguinte comando:

```
# Tente isso primeiro
pnpm bazel clean

# Se isso não funcionar, tente com a flag expunge
pnpm bazel clean --expunge
```

## Arquitetura de Alto Nível

O site angular.dev é uma aplicação Angular moderna que utiliza Static Site Generation (SSG) para entregar conteúdo pré-renderizado e de alta performance aos usuários.

A arquitetura é projetada para eficiência e manutenibilidade:

Fontes de Conteúdo: A documentação é originada de dois lugares principais dentro do monorepo. Os guias e tutoriais são escritos em arquivos Markdown, enquanto as páginas de referência da API são automaticamente geradas extraindo documentação diretamente do código-fonte TypeScript dos pacotes do framework Angular.

Processo de Build: Durante o processo de build, os arquivos Markdown são convertidos em HTML. Simultaneamente, a documentação da API é extraída dos comentários do código. Este conteúdo é então integrado na aplicação Angular.
