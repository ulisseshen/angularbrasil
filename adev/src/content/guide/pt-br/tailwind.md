<!-- ia-translate: true -->
# Usando Tailwind CSS com Angular

[Tailwind CSS](https://tailwindcss.com/) é um framework CSS utility-first que pode ser usado para construir sites modernos sem nunca sair do seu HTML. Este guia irá orientá-lo na configuração do Tailwind CSS no seu projeto Angular.

## Configurando Tailwind CSS

### 1. Criar um projeto Angular

Primeiro, crie um novo projeto Angular se você ainda não tem um configurado.

<docs-code language="shell">
ng new my-project
cd my-project
</docs-code>

### 2. Instalar Tailwind CSS

Em seguida, abra um terminal no diretório raiz do seu projeto Angular e execute o seguinte comando para instalar o Tailwind CSS e suas dependências peer:

<docs-code language="shell">
npm install tailwindcss @tailwindcss/postcss postcss
</docs-code>

### 3. Configurar PostCSS Plugins

Em seguida, adicione um arquivo `.postcssrc.json` na raiz do projeto.
Adicione o plugin `@tailwindcss/postcss` à sua configuração PostCSS.

<docs-code language="json" header=".postcssrc.json">
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
</docs-code>

### 4. Importar Tailwind CSS

Adicione um `@import` ao `./src/styles.css` que importa Tailwind CSS.

<docs-code language="css" header="src/styles.css">
@import "tailwindcss";
</docs-code>

Se você está usando SCSS, adicione `@use` ao `./src/styles.scss`.

<docs-code language="scss" header="src/styles.scss">
@use "tailwindcss";
</docs-code>

### 5. Começar a usar Tailwind no seu projeto

Agora você pode começar a usar as classes utility do Tailwind nos seus templates de components para estilizar sua aplicação.

Por exemplo, você pode adicionar o seguinte ao seu arquivo `app.html`:

<docs-code language="html">
<h1 class="text-3xl font-bold underline">
  Hello world!
</h1>
</docs-code>

### 6. Começar a usar Tailwind no seu projeto

Execute seu processo de build com `ng serve` e você deve ver o heading estilizado.

## Recursos Adicionais

- [Documentação do Tailwind CSS](https://tailwindcss.com/docs)
