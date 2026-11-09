<!-- ia-translate: true -->
# Exemplo de internacionalização (i18n) do Angular

Este exemplo vem da página "[Exemplo de aplicação Angular de Internacionalização](https://angular.dev/guide/i18n/example)" da documentação do Angular.

## Instalar e executar o download {#install-and-run-the-download}

1. `npm install` para instalar os pacotes node_module
2. `npm start` para ver a aplicação executando em inglês
3. `npm run start:fr` para ver a aplicação executando com a tradução para francês.

> Veja os scripts em `package.json` para uma explicação desses comandos.

## Executar no StackBlitz {#run-in-stackblitz}

O StackBlitz compila e executa a versão em inglês por padrão.

Para ver o exemplo traduzido para francês com Angular i18n:

1. Abra o arquivo `project.json` e adicione o seguinte ao final:

```json
  "stackblitz": {
    "startCommand": "npm run start:fr"
  }
```

1. Clique no botão "Fork" no cabeçalho do StackBlitz. Isso cria uma nova cópia para você com esta mudança e executa novamente o exemplo em francês.
