<!-- ia-translate: true -->

# Exemplo de Internacionalização i18n do Angular

Este exemplo vem da página "[Exemplo de aplicação Angular de Internacionalização](https://angular.dev/guide/i18n/example)" da documentação do Angular.

## Instalar e Executar o Download

1. `npm install` os pacotes node_module
2. `npm start` para vê-lo executar em inglês
3. `npm run start:fr` para vê-lo executar com tradução em francês.

> Veja os scripts em `package.json` para uma explicação desses comandos.

## Executar no Stackblitz

Stackblitz compila e executa a versão em inglês por padrão.

Para ver o exemplo traduzido para francês com Angular i18n:

1. Abra o arquivo `project.json` e adicione o seguinte ao final:

```json
  "stackblitz": {
    "startCommand": "npm run start:fr"
  }
```

1. Clique no botão "Fork" no cabeçalho do stackblitz. Isso faz uma nova cópia para você com esta mudança e re-executa o exemplo em francês.
