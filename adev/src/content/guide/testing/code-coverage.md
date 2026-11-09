<!-- ia-translate: true -->
# Cobertura de código

Relatórios de cobertura de código mostram quaisquer partes da sua base de código que podem não estar devidamente testadas pelos seus unit tests.

## Pré-requisitos {#prerequisites}

Para gerar relatórios de cobertura de código com o Vitest, você precisa instalar o pacote `@vitest/coverage-v8`:

<docs-code-multifile>
  <docs-code header="npm" language="shell">
    npm install --save-dev @vitest/coverage-v8
  </docs-code>
  <docs-code header="yarn" language="shell">
    yarn add --dev @vitest/coverage-v8
  </docs-code>
  <docs-code header="pnpm" language="shell">
    pnpm add -D @vitest/coverage-v8
  </docs-code>
  <docs-code header="bun" language="shell">
    bun add --dev @vitest/coverage-v8
  </docs-code>
</docs-code-multifile>

## Gerando um relatório {#generating-a-report}

Para gerar um relatório de cobertura, adicione a flag `--coverage` ao comando `ng test`:

```shell
ng test --coverage
```

Depois que os testes forem executados, o comando cria um novo diretório `coverage/` no projeto. Abra o arquivo `index.html` para ver um relatório com o seu código-fonte e os valores de cobertura de código.

Se você quiser criar relatórios de cobertura de código toda vez que executar os testes, pode definir a opção `coverage` como `true` no seu arquivo `angular.json`:

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "coverage": true
          }
        }
      }
    }
  }
}
```

## Aplicando limites de cobertura de código {#enforcing-code-coverage-thresholds}

As porcentagens de cobertura de código permitem estimar quanto do seu código está testado. Se a sua equipe decidir um valor mínimo de código coberto por unit tests, você pode aplicar esse mínimo na sua configuração.

Por exemplo, suponha que você queira que a base de código tenha um mínimo de 80% de cobertura de código. Para habilitar isso, adicione a opção `coverageThresholds` ao seu arquivo `angular.json`:

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
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

Agora, se a sua cobertura cair abaixo de 80% ao executar os testes, o comando falhará.

## Configuração avançada {#advanced-configuration}

Você pode configurar várias outras opções de cobertura no seu arquivo `angular.json`:

- `coverageInclude`: padrões glob dos arquivos a serem incluídos no relatório de cobertura.
- `coverageExclude`: padrões glob dos arquivos a serem excluídos do relatório de cobertura.
- `coverageReporters`: um array de reporters a serem usados (por exemplo, `html`, `lcov`, `json`).
- `coverageWatermarks`: um objeto que especifica marcas d'água `[low, high]` para o reporter HTML, o que pode afetar a codificação de cores do relatório.

```json
{
  "projects": {
    "your-project-name": {
      "architect": {
        "test": {
          "builder": "@angular/build:unit-test",
          "options": {
            "coverage": true,
            "coverageReporters": ["html", "lcov"],
            "coverageWatermarks": {
              "statements": [50, 80],
              "branches": [50, 80],
              "functions": [50, 80],
              "lines": [50, 80]
            }
          }
        }
      }
    }
  }
}
```
