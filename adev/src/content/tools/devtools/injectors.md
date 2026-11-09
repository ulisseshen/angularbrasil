<!-- ia-translate: true -->
# Inspecione seus injectors

NOTA: A árvore de injectors está disponível para aplicações Angular construídas com a versão 17 ou superior.

## Visualizar a hierarquia de injectors da sua aplicação {#view-the-injector-hierarchy-of-your-application}

A aba **Injector Tree** permite explorar a estrutura dos injectors configurados na sua aplicação. Aqui você verá duas árvores representando a [hierarquia de injectors](guide/di/hierarchical-dependency-injection) da sua aplicação. Uma árvore é a sua hierarquia de environment, a outra é a sua hierarquia de elementos.

<img src="assets/images/guide/devtools/di-injector-tree.png" alt="Captura de tela da aba 'Profiler' exibindo a aba injector tree nas Angular DevTools, visualizando o grafo de injectors de uma aplicação de exemplo.">

## Visualizar caminhos de resolução {#visualize-resolution-paths}

Quando um injector específico é selecionado, o caminho que o algoritmo de injeção de dependência do Angular percorre desse injector até a raiz é destacado. Para element injectors, isso inclui destacar os environment injectors para os quais o algoritmo de injeção de dependência salta quando uma dependência não pode ser resolvida na hierarquia de elementos.

Veja [regras de resolução](guide/di/hierarchical-dependency-injection#resolution-rules) para mais detalhes sobre como o Angular resolve os caminhos de resolução.

<img src="assets/images/guide/devtools/di-injector-tree-selected.png" alt="Captura de tela da aba 'Profiler' mostrando como a visualização da árvore de injectors destaca os caminhos de resolução quando um injector é selecionado.">

## Visualizar providers do injector {#view-injector-providers}

Clicar em um injector que possui providers configurados exibirá esses providers em uma lista à direita da visualização da árvore de injectors. Aqui você pode ver o token fornecido e o tipo dele. O botão à direita de cada provider permite registrar o provider no console.

<img src="assets/images/guide/devtools/di-injector-tree-providers.png" alt="Captura de tela da aba 'Profiler' mostrando como os providers ficam visíveis quando um injector é selecionado.">
