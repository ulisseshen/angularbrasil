<!-- ia-translate: true -->

# Usando Tailwind CSS com Angular {#using-tailwind-css-with-angular}

[Tailwind CSS](https://tailwindcss.com/) é um framework CSS utility-first que pode ser usado para construir sites modernos sem nunca sair do seu HTML. Este guia vai orientá-lo na configuração do Tailwind CSS no seu projeto Angular.

## Configuração automatizada com `ng add` {#automated-setup-with-ng-add}

O Angular CLI oferece uma forma simplificada de integrar o Tailwind CSS ao seu projeto usando o comando `ng add`. Esse comando instala automaticamente os pacotes necessários, configura o Tailwind CSS e atualiza as configurações de build do seu projeto.

Primeiro, navegue até o diretório raiz do seu projeto Angular em um terminal e execute o seguinte comando:

```shell
ng add tailwindcss
```

Esse comando executa as seguintes ações:

- Instala `tailwindcss` e suas dependências peer.
- Configura o projeto para usar o Tailwind CSS.
- Adiciona a declaração `@import` do Tailwind CSS aos seus estilos.

Depois de executar `ng add tailwindcss`, você pode começar a usar imediatamente as classes utilitárias do Tailwind nos templates dos seus components.

## Configuração manual (método alternativo) {#manual-setup-alternative-method}

Se você preferir configurar o Tailwind CSS manualmente, siga estes passos:

### 1. Criar um projeto Angular {#1-create-an-angular-project}

Primeiro, crie um novo projeto Angular, caso ainda não tenha um configurado.

```shell
ng new my-project
cd my-project
```

### 2. Instalar Tailwind CSS {#2-install-tailwind-css}

Em seguida, abra um terminal no diretório raiz do seu projeto Angular e execute o seguinte comando para instalar o Tailwind CSS e suas dependências peer:

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install tailwindcss @tailwindcss/postcss postcss
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add tailwindcss @tailwindcss/postcss postcss
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add tailwindcss @tailwindcss/postcss postcss
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add tailwindcss @tailwindcss/postcss postcss
  </docs-code>
</docs-code-multifile>

### 3. Configurar plugins do PostCSS {#3-configure-postcss-plugins}

Em seguida, adicione um arquivo `.postcssrc.json` na raiz do projeto.
Adicione o plugin `@tailwindcss/postcss` à sua configuração do PostCSS.

```json {header: '.postcssrc.json'}
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

### 4. Importar Tailwind CSS {#4-import-tailwind-css}

Adicione um `@import` em `./src/styles.css` que importe o Tailwind CSS.

```css {header: "src/styles.css"}
@import 'tailwindcss';
```

Se você estiver usando SCSS, adicione um `@use` em `./src/styles.scss`.

```scss {header: "src/styles.scss"}
@use 'tailwindcss';
```

### 5. Começar a usar Tailwind no seu projeto {#5-start-using-tailwind-in-your-project}

Agora você pode começar a usar as classes utilitárias do Tailwind nos templates dos seus components para estilizar a sua aplicação. Execute o seu processo de build com `ng serve` e você deverá ver o heading estilizado.

Por exemplo, você pode adicionar o seguinte ao seu arquivo `app.html`:

```html
<h1 class="text-3xl font-bold underline">Hello world!</h1>
```

## Recursos adicionais {#additional-resources}

- [Documentação do Tailwind CSS](https://tailwindcss.com/docs)
