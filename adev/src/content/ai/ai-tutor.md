<!-- ia-translate: true -->
# Tutor de IA do Angular {#angular-ai-tutor}

O Tutor de IA do Angular foi projetado para guiar você, de forma interativa e passo a passo, na criação de uma aplicação Angular completa e moderna do zero. Você vai aprender os padrões e as boas práticas mais recentes construindo um projeto real e concreto: uma **"Caixa de Receitas Inteligente"** para criar e gerenciar receitas.

Nosso objetivo é estimular o pensamento crítico e ajudar você a reter o que aprende. Em vez de simplesmente entregar o código, o tutor vai explicar os conceitos, mostrar exemplos e, em seguida, propor exercícios específicos do projeto para você resolver por conta própria.

## Começando {#get-started}

Você pode acessar o tutor de IA por meio do [servidor MCP do Angular](ai/mcp).

1. [Instale](ai/mcp#get-started) o servidor MCP do Angular
2. Crie um novo projeto Angular com `ng new <nome-do-projeto>`
3. Acesse o seu novo projeto (`cd <nome-do-projeto>`) em um editor ou ferramenta com IA, como o [Gemini CLI](https://geminicli.com/)
4. Digite um prompt como `launch the Angular AI tutor`
   ![Uma captura de tela mostrando como iniciar o Tutor de IA do Angular no Gemini CLI.](assets/images/launch-ai-tutor.png 'Iniciar o Tutor de IA do Angular')

## Usando o Tutor de IA {#using-the-ai-tutor}

Cada módulo começa com uma breve explicação do conceito.
![Uma captura de tela do Tutor de IA do Angular apresentando uma breve explicação do conceito.](assets/images/ai-tutor-preview-1.png 'Explicação do Tutor de IA do Angular')
Quando aplicável, o tutor vai apresentar um exemplo de código para demonstrar o conceito.
![Uma captura de tela do Tutor de IA do Angular mostrando um exemplo de código.](assets/images/ai-tutor-preview-2.png 'Exemplo de código do Tutor de IA do Angular')
O tutor também vai propor um exercício aberto para testar a sua compreensão.
![Uma captura de tela do Tutor de IA do Angular propondo um exercício.](assets/images/ai-tutor-preview-3.png 'Exercício do Tutor de IA do Angular')
Por fim, o tutor vai verificar o seu trabalho antes de passar para o próximo módulo.
![Uma captura de tela do Tutor de IA do Angular verificando o trabalho do usuário.](assets/images/ai-tutor-preview-4.png 'Verificação do Tutor de IA do Angular')

## Como funciona: o ciclo de aprendizado {#how-it-works-the-learning-cycle}

Para cada novo tópico, você vai seguir um ciclo de aprendizado que enfatiza o pensamento crítico para ajudar você a reter melhor o que aprende.

1. **Aprenda o conceito:** o tutor vai explicar brevemente um recurso central do Angular e mostrar um exemplo de código genérico para ilustrá-lo.
2. **Aplique o seu conhecimento:** você recebe imediatamente um exercício prático. O tutor apresenta esses exercícios em alto nível, com objetivos e resultados esperados, incentivando você a pensar na solução por conta própria.
3. **Receba feedback e suporte:** quando estiver pronto, avise o tutor. Ele vai **ler automaticamente os arquivos do seu projeto** para verificar se a sua solução está correta. Se você travar, você tem total controle. Pode pedir uma **"dica"** para receber mais orientação ou pedir instruções passo a passo digitando **"guia detalhado"** ou **"instruções passo a passo"**.

Assim que você tiver sucesso, o tutor vai passar diretamente para o próximo tópico. Você também pode pedir ao tutor mais informações sobre um tópico ou fazer quaisquer perguntas relacionadas ao Angular a qualquer momento.

---

## **Recursos e comandos** {#features--commands}

Você está no controle da sua experiência de aprendizado. Use estes recursos a qualquer momento:

### **Saia e volte depois** {#leave-and-come-back}

Fique à vontade para fazer uma pausa. O seu progresso está vinculado ao código do seu projeto. Quando você voltar para uma nova sessão, o tutor vai analisar automaticamente os seus arquivos para determinar exatamente onde você parou, permitindo que você retome exatamente de onde estava.

**Dica de ouro:** recomendamos muito usar o Git para salvar o seu progresso. Depois de concluir um módulo, é uma ótima ideia fazer commit das suas alterações (por exemplo, `git commit -m "Conclui Fase 1, Módulo 8"`). Isso funciona como um checkpoint pessoal para o qual você sempre pode voltar.

### **Ajuste o seu nível de experiência** {#adjust-your-experience-level}

Você pode definir o seu nível de experiência como **Iniciante (1-3)**, **Intermediário (4-7)** ou **Experiente (8-10)**. Você pode alterar essa configuração a qualquer momento durante a sessão, e o tutor vai adaptar imediatamente o seu estilo de ensino.

**Exemplos de prompts:**

- "Defina meu nível de experiência como iniciante."
- "Mude minha nota para 8."

### **Veja o plano de aprendizado completo** {#see-the-full-learning-plan}

Quer ver o panorama geral ou conferir o quanto você já avançou? Basta pedir o sumário.

**Exemplos de prompts:**

- "Onde estamos?"
- "Mostre o sumário."
- "Mostre o plano."

O tutor vai exibir o plano de aprendizado completo e marcar a sua posição atual.

### **Uma nota sobre estilo** {#a-note-on-styling}

O tutor vai aplicar um estilo básico à sua aplicação para mantê-la com uma aparência limpa. Recomendamos fortemente que você aplique o seu próprio estilo para deixar o app com a sua cara.

### **Pule o módulo atual** {#skip-the-current-module}

Se preferir avançar para o próximo tópico do caminho de aprendizado, você pode pedir ao tutor para pular o exercício atual.

**Exemplos de prompts:**

- "Pule esta seção."
- "Complete esta etapa automaticamente para mim."

O tutor vai pedir uma confirmação e, em seguida, apresentar a solução completa do código para o módulo atual e tentar aplicar automaticamente as atualizações necessárias para que você possa continuar sem problemas com o próximo módulo.

### **Vá para qualquer tópico** {#jump-to-any-topic}

Se você quiser aprender sobre um tópico específico fora de ordem (por exemplo, pular dos fundamentos para formulários), pode fazer isso. O tutor vai fornecer o código necessário para atualizar o seu projeto até o ponto de partida correto do módulo selecionado e tentar aplicar automaticamente as atualizações necessárias.

**Exemplos de prompts:**

- "Me leve à aula de formulários."
- "Quero aprender sobre Route Guards agora."
- "Pule para a seção sobre Services."

---

## **Solução de problemas** {#troubleshooting}

### Problemas de configuração {#setup-issues}

**"launch the Angular AI tutor" não faz nada?**

Certifique-se de ter um projeto aberto primeiro. O tutor precisa de um projeto Angular de verdade para trabalhar:

```bash
ng new my-app
cd my-app
code .
```

Em seguida, verifique se o seu servidor MCP está em execução. No VS Code, abra o arquivo `.vscode/mcp.json` e clique no botão **"Start"** no topo do arquivo.

Ao digitar "launch the Angular AI tutor", você deve ver uma marca de verificação dizendo
"Reviewed .vscode/mcp.json and ran start task" e um prompt perguntando
"Allow task run?" — pode clicar em Allow.

**Ainda não funciona?**

Tente digitar `#angular-cli` primeiro para carregar o contexto do Angular e, em seguida, cole a URL do tutorial: `https://angular.dev/ai/ai-tutor`

**Como verificar se o servidor está em execução**

Abra a Paleta de Comandos (`Ctrl+Shift+P`), digite "MCP: List Running Servers" e procure por "angular-cli" na lista.

---

### Problemas gerais {#general-issues}

Se o tutor não responder corretamente ou se você suspeitar de um problema na sua aplicação, aqui estão algumas coisas que você pode tentar:

1. **Digite "proceed":** isso pode frequentemente incentivar o tutor a continuar para a próxima etapa caso ele tenha travado.
2. **Corrija o tutor:** se o tutor estiver enganado sobre o seu progresso (por exemplo, ele diz que você está no Módulo 3, mas você já concluiu o Módulo 8), basta avisar. Por exemplo: _"Na verdade, estou no Módulo 8."_ O tutor vai reavaliar o seu código e ajustar.
3. **Verifique a sua UI:** se quiser confirmar como a interface da sua aplicação deveria ficar, basta perguntar ao tutor. Por exemplo: _"O que eu deveria ver na minha UI?"_
4. **Recarregue a janela do navegador:** uma atualização pode resolver muitos problemas relacionados à sua aplicação.
5. **Reinicie o navegador por completo:** erros às vezes só aparecem no console do desenvolvedor do navegador. Um reinício completo pode ajudar a limpar problemas subjacentes relacionados à aplicação.
6. **Inicie um novo chat:** você sempre pode começar um novo chat para remover o histórico existente e recomeçar do zero. O tutor vai ler os seus arquivos para encontrar a última etapa em que você estava.

## **A sua jornada de aprendizado: o caminho por fases** {#your-learning-journey-the-phased-path}

Você vai construir a sua aplicação em uma jornada de cinco fases. Você pode seguir esse caminho do início ao fim para criar uma aplicação Angular completa e totalmente funcional. Cada módulo se apoia logicamente no anterior, levando você dos fundamentos até recursos avançados e do mundo real.

**Uma nota sobre a configuração automatizada:** alguns módulos exigem uma etapa de configuração, como criar interfaces ou dados simulados (mock). Nesses casos, o tutor vai apresentar o código e as instruções de arquivos. Você será responsável por criar e modificar esses arquivos conforme as instruções antes de o exercício começar.

### **Fase 1: Fundamentos do Angular** {#phase-1-angular-fundamentals}

- **Módulo 1:** Começando
- **Módulo 2:** Texto dinâmico com interpolação
- **Módulo 3:** Event Listeners (`(click)`)

### **Fase 2: Estado e Signals** {#phase-2-state-and-signals}

- **Módulo 4:** Gerenciamento de estado com Writable Signals (Parte 1: `set`)
- **Módulo 5:** Gerenciamento de estado com Writable Signals (Parte 2: `update`)
- **Módulo 6:** Computed Signals

### **Fase 3: Arquitetura de componentes** {#phase-3-component-architecture}

- **Módulo 7:** Template binding (propriedades e atributos)
- **Módulo 8:** Criando e aninhando components
- **Módulo 9:** Inputs de components com Signals
- **Módulo 10:** Estilizando components
- **Módulo 11:** Renderização de listas com `@for`
- **Módulo 12:** Renderização condicional com `@if`

### **Fase 4: Recursos avançados e arquitetura** {#phase-4-advanced-features--architecture}

- **Módulo 13:** Two-way binding
- **Módulo 14:** Services e injeção de dependência (DI)
- **Módulo 15:** Roteamento básico
- **Módulo 16:** Introdução a formulários
- **Módulo 17:** Introdução ao Angular Material

### **Fase 5: Signal Forms** {#phase-5-signal-forms}

- **Módulo 18**: **Introdução a Signal Forms**
- **Módulo 19**: **Envio e reset**
- **Módulo 20**: **Validação em Signal Forms**
- **Módulo 21**: **Estado do campo e mensagens de erro**

---

## **Uma nota sobre IA e feedback** {#a-note-on-ai--feedback}

Este tutor é alimentado por um Large Language Model (LLM). Embora tenhamos nos esforçado para torná-lo um especialista, IAs podem cometer erros. Se você encontrar uma explicação ou um exemplo de código que pareça incorreto, por favor, nos avise. Você pode corrigir o tutor, e ele vai usar o seu feedback para ajustar a resposta.

Para bugs técnicos ou solicitações de novos recursos, por favor, [envie uma issue](https://github.com/angular/angular-cli/issues).
