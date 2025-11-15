<!-- ia-translate: true -->
# Descubra quanto código você está testando

A Angular CLI pode executar unit tests e criar relatórios de cobertura de código.
Relatórios de cobertura de código mostram quaisquer partes da sua base de código que podem não estar devidamente testadas pelos seus unit tests.

Para gerar um relatório de cobertura, execute o seguinte comando na raiz do seu projeto.

```shell
ng test --no-watch --coverage
```

Quando os testes forem concluídos, o comando cria um novo diretório `/coverage` no projeto.
Abra o arquivo `index.html` para ver um relatório com seu código fonte e valores de cobertura de código.

Se você quiser criar relatórios de cobertura de código toda vez que testar, defina a seguinte opção no arquivo de configuração da Angular CLI, `angular.json`:

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "options": {
            "coverage": true
          }
        }
      }
    }
  }
}
```

## Aplicação de cobertura de código

As porcentagens de cobertura de código permitem estimar quanto do seu código está testado.
Se sua equipe decidir sobre uma quantidade mínima definida para ser testada por unit tests, você pode aplicar esse mínimo diretamente na sua configuração da Angular CLI.

Por exemplo, suponha que você queira que a base de código tenha um mínimo de 80% de cobertura de código.
Para habilitar isso, abra o arquivo `angular.json` e adicione a opção `coverageThresholds` à sua configuração de teste:

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "options": {
            "coverage": true,
            "coverageThresholds": {
              "statements": 80,
              "branches": 80,
              "functions": 80,
              "lines": 80
            }
          }
        }
      }
    }
  }
}
```

Agora, quando você executar `ng test`, a ferramenta lançará um erro se a cobertura cair abaixo de 80%.
