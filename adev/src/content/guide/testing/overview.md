<!-- ia-translate: true -->
# Testing

Testar sua aplicação Angular ajuda você a verificar se sua aplicação está funcionando conforme esperado.

NOTA: Embora o Vitest seja o test runner padrão, o Karma ainda é totalmente suportado. Para informações sobre testes com Karma, veja o [guia de testes Karma](guide/testing/karma).

## Configurar testes

A Angular CLI baixa e instala tudo o que você precisa para testar uma aplicação Angular com o [framework de testes Vitest](https://vitest.dev).

O projeto que você cria com a CLI está imediatamente pronto para testar.
Apenas execute o comando CLI [`ng test`](cli/test):

```shell

ng test

```

O comando `ng test` constrói a aplicação em _modo watch_ e inicia o [test runner Vitest](https://vitest.dev).

A saída do console se parece com isto:

```shell

 ✓ src/app/app.component.spec.ts (3)
   ✓ AppComponent should create the app
   ✓ AppComponent should have as title 'my-app'
   ✓ AppComponent should render title
 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  18:18:01
   Duration  2.46s (transform 615ms, setup 2ms, collect 2.21s, tests 5ms)

```

Enquanto isso, o comando `ng test` está observando mudanças.

Para ver isso em ação, faça uma pequena alteração em `app.ts` e salve.
Os testes executam novamente e os novos resultados dos testes aparecem no console.

## Configuração

A Angular CLI cuida da configuração do Vitest para você. Ela constrói a configuração completa em memória, com base nas opções especificadas no arquivo `angular.json`.

Se você quiser customizar o Vitest, pode criar um `vitest-base.config.ts` executando o seguinte comando:

```shell

ng generate config vitest

```

IMPORTANTE: Usar um `vitest-base.config.ts` personalizado fornece opções de customização poderosas. No entanto, a equipe Angular não fornece suporte para o conteúdo específico deste arquivo ou para quaisquer plugins de terceiros usados dentro dele.

ÚTIL: Leia mais sobre configuração do Vitest no [guia de configuração do Vitest](https://vitest.dev/config/).

### Outros frameworks de teste

Você também pode fazer unit test de uma aplicação Angular com outras bibliotecas de teste e test runners.
Cada biblioteca e runner tem seus próprios procedimentos de instalação, configuração e sintaxe distintivos.

### Nome e localização do arquivo de teste

Dentro da pasta `src/app`, a Angular CLI gerou um arquivo de teste para o component `App` chamado `app.spec.ts`.

IMPORTANTE: A extensão do arquivo de teste **deve ser `.spec.ts` ou `.test.ts`** para que as ferramentas possam identificá-lo como um arquivo com testes \(também conhecido como arquivo _spec_\).

Os arquivos `app.ts` e `app.spec.ts` são irmãos na mesma pasta.
Os nomes dos arquivos raiz \(`app`\) são os mesmos para ambos os arquivos.

Adote essas duas convenções em seus próprios projetos para _todo tipo_ de arquivo de teste.

#### Coloque seu arquivo spec ao lado do arquivo que ele testa

É uma boa ideia colocar arquivos spec de unit test na mesma pasta
que os arquivos de código fonte da aplicação que eles testam:

- Tais testes são indolores de encontrar
- Você vê de relance se uma parte de sua aplicação não tem testes
- Testes próximos podem revelar como uma parte funciona em contexto
- Quando você move o código fonte \(inevitável\), você lembra de mover o teste
- Quando você renomeia o arquivo fonte \(inevitável\), você lembra de renomear o arquivo de teste

#### Coloque seus arquivos spec em uma pasta test

Specs de integração de aplicação podem testar as interações de múltiplas partes
espalhadas por pastas e modules.
Elas não pertencem realmente a nenhuma parte em particular, então não têm um
lugar natural ao lado de nenhum arquivo.

Geralmente é melhor criar uma pasta apropriada para elas no diretório `tests`.

Claro que specs que testam os helpers de teste pertencem à pasta `test`,
ao lado de seus arquivos helper correspondentes.

## Testes em integração contínua

Uma das melhores maneiras de manter seu projeto livre de bugs é através de um conjunto de testes, mas você pode esquecer de executar os testes o tempo todo.

Servidores de integração contínua \(CI\) permitem que você configure seu repositório de projeto para que seus testes sejam executados em cada commit e pull request.

Para testar sua aplicação Angular em um servidor de integração contínua (CI), você pode normalmente executar o comando de teste padrão:

```shell
ng test
```

A maioria dos servidores CI define uma variável de ambiente `CI=true`, que `ng test` detecta. Isso executa automaticamente seus testes no modo apropriado não interativo de execução única.

Se seu servidor CI não define esta variável, ou se você precisa forçar o modo de execução única manualmente, você pode usar as flags `--no-watch` e `--no-progress`:

```shell
ng test --no-watch --no-progress
```

## Mais informações sobre testes

Depois de configurar sua aplicação para testes, você pode achar os seguintes guias de testes úteis.

|                                                                    | Detalhes                                                                           |
| :----------------------------------------------------------------- | :-------------------------------------------------------------------------------- |
| [Cobertura de código](guide/testing/code-coverage)                       | Quanto da sua aplicação seus testes estão cobrindo e como especificar quantidades necessárias. |
| [Testes de services](guide/testing/services)                         | Como testar os services que sua aplicação usa.                                   |
| [Fundamentos de testes de components](guide/testing/components-basics)    | Fundamentos de testes de components Angular.                                             |
| [Cenários de testes de components](guide/testing/components-scenarios)  | Vários tipos de cenários e casos de uso de testes de components.                       |
| [Testes de attribute directives](guide/testing/attribute-directives) | Como testar suas attribute directives.                                            |
| [Testes de pipes](guide/testing/pipes)                               | Como testar pipes.                                                                |
| [Debug de testes](guide/testing/debugging)                         | Bugs comuns de testes.                                                              |
| [APIs utilitárias de testes](guide/testing/utility-apis)                 | Recursos de testes do Angular.                                                         |
