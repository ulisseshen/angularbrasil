<!-- ia-translate: true -->
# Adicionando suporte de harness para ambientes de teste adicionais

## Antes de começar

DICA: Este guia assume que você já leu o [guia de visão geral de component harnesses](guide/testing/component-harnesses-overview). Leia aquele primeiro se você é novo no uso de component harnesses.

### Quando faz sentido adicionar suporte para um ambiente de teste?

Para usar component harnesses nos seguintes ambientes, você pode usar os dois ambientes integrados do Angular CDK:

- Unit tests
- Testes end-to-end com WebDriver

Para usar um ambiente de teste suportado, leia o [guia Criando harnesses para seus components](guide/testing/creating-component-harnesses).

Caso contrário, para adicionar suporte para outros ambientes, você precisa definir como interagir com um elemento DOM e como as interações DOM funcionam no seu ambiente. Continue lendo para saber mais.

### Instalação do CDK

O [Component Dev Kit (CDK)](https://material.angular.dev/cdk/categories) é um conjunto de primitivos de comportamento para construção de components. Para usar os component harnesses, primeiro instale `@angular/cdk` do npm. Você pode fazer isso do seu terminal usando o Angular CLI:

<docs-code language="shell">
  ng add @angular/cdk
</docs-code>

## Criando uma implementação de `TestElement`

Todo ambiente de teste deve definir uma implementação de `TestElement`. A interface `TestElement` serve como uma representação agnóstica de ambiente de um elemento DOM. Ela permite que harnesses interajam com elementos DOM independentemente do ambiente subjacente. Como alguns ambientes não suportam interagir com elementos DOM de forma síncrona (por exemplo, WebDriver), todos os métodos `TestElement` são assíncronos, retornando uma `Promise` com o resultado da operação.

`TestElement` oferece vários métodos para interagir com o DOM subjacente, como `blur()`, `click()`, `getAttribute()`, e mais. Veja a [página de referência da API TestElement](/api/cdk/testing/TestElement) para a lista completa de métodos.

A interface `TestElement` consiste em grande parte de métodos que se assemelham a métodos disponíveis em `HTMLElement`. Métodos similares existem na maioria dos ambientes de teste, o que torna a implementação dos métodos bastante direta. No entanto, uma diferença importante a notar ao implementar o método `sendKeys`, é que os códigos de tecla no enum `TestKey` provavelmente diferem dos códigos de tecla usados no ambiente de teste. Autores de ambiente devem manter um mapeamento de códigos `TestKey` para os códigos usados no ambiente de teste específico.

As implementações [UnitTestElement](/api/cdk/testing/testbed/UnitTestElement) e [SeleniumWebDriverElement](/api/cdk/testing/selenium-webdriver/SeleniumWebDriverElement) no Angular CDK servem como bons exemplos de implementações desta interface.

## Criando uma implementação de `HarnessEnvironment`

Autores de testes usam `HarnessEnvironment` para criar instâncias de component harness para uso em testes. `HarnessEnvironment` é uma classe abstrata que deve ser estendida para criar uma subclasse concreta para o novo ambiente. Ao suportar um novo ambiente de teste, crie uma subclasse `HarnessEnvironment` que adiciona implementações concretas para todos os membros abstratos.

`HarnessEnvironment` tem um parâmetro de tipo genérico: `HarnessEnvironment<E>`. Este parâmetro, `E`, representa o tipo de elemento bruto do ambiente. Por exemplo, este parâmetro é Element para ambientes de teste unitário.

Os seguintes são os métodos abstratos que devem ser implementados:

| Método                                                       | Descrição                                                                                                                                                                                                                     |
| :----------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `abstract getDocumentRoot(): E`                              | Obtém o elemento raiz para o ambiente (por exemplo, `document.body`).                                                                                                                                                        |
| `abstract createTestElement(element: E): TestElement`        | Cria um `TestElement` para o elemento bruto fornecido.                                                                                                                                                                       |
| `abstract createEnvironment(element: E): HarnessEnvironment` | Cria um `HarnessEnvironment` enraizado no elemento bruto fornecido.                                                                                                                                                          |
| `abstract getAllRawElements(selector: string): Promise<E[]>` | Obtém todos os elementos brutos sob o elemento raiz do ambiente que correspondem ao seletor fornecido.                                                                                                                       |
| `abstract forceStabilize(): Promise<void>`                   | Obtém uma `Promise` que resolve quando a `NgZone` está estável. Adicionalmente, se aplicável, diz à `NgZone` para estabilizar (por exemplo, chamar `flush()` em um teste `fakeAsync`).                                       |
| `abstract waitForTasksOutsideAngular(): Promise<void>`       | Obtém uma `Promise` que resolve quando a zone pai da `NgZone` está estável.                                                                                                                                                  |

Além de implementar os métodos faltantes, esta classe deve fornecer uma maneira para autores de testes obterem instâncias de `ComponentHarness`. Você deve definir um construtor protegido e fornecer um método estático chamado `loader` que retorna uma instância de `HarnessLoader`. Isso permite que autores de testes escrevam código como: `SomeHarnessEnvironment.loader().getHarness(...)`. Dependendo das necessidades do ambiente específico, a classe pode fornecer vários métodos estáticos diferentes ou exigir que argumentos sejam passados. (por exemplo, o método `loader` em `TestbedHarnessEnvironment` recebe um `ComponentFixture`, e a classe fornece métodos estáticos adicionais chamados `documentRootLoader` e `harnessForFixture`).

As implementações [`TestbedHarnessEnvironment`](/api/cdk/testing/testbed/TestbedHarnessEnvironment) e [SeleniumWebDriverHarnessEnvironment](/api/cdk/testing/selenium-webdriver/SeleniumWebDriverHarnessEnvironment) no Angular CDK servem como bons exemplos de implementações desta interface.

## Lidando com detecção de mudanças automática

Para suportar o `manualChangeDetection` e APIs paralelas, seu ambiente deve instalar um handler para o status de detecção de mudanças automática.

Quando seu ambiente quer começar a lidar com o status de detecção de mudanças automática, ele pode chamar `handleAutoChangeDetectionStatus(handler)`. A função handler receberá um `AutoChangeDetectionStatus` que tem duas propriedades `isDisabled` e `onDetectChangesNow()`. Veja a [página de referência da API AutoChangeDetectionStatus](/api/cdk/testing/AutoChangeDetectionStatus) para mais informações.
Se seu ambiente quer parar de lidar com o status de detecção de mudanças automática, ele pode chamar `stopHandlingAutoChangeDetectionStatus()`.
