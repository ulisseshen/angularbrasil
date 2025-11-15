<!-- ia-translate: true -->
# Otimização de performance em runtime

A renderização rápida é crítica para o Angular e construímos o framework com muitas otimizações em mente para ajudar você a desenvolver aplicações performáticas. Para entender melhor a performance da sua aplicação, oferecemos o [Angular DevTools](tools/devtools) e um [guia em vídeo](https://www.youtube.com/watch?v=FjyX_hkscII) sobre como usar o Chrome DevTools para profiling. Nesta seção, cobrimos as técnicas de otimização de performance mais comuns.

**Change detection** é o processo através do qual o Angular verifica se o estado da sua aplicação mudou e se algum DOM precisa ser atualizado. Em alto nível, o Angular percorre seus components de cima para baixo, procurando por mudanças. O Angular executa seu mecanismo de change detection periodicamente para que as mudanças no modelo de dados sejam refletidas na view da aplicação. A change detection pode ser disparada manualmente ou através de um evento assíncrono (por exemplo, uma interação do usuário ou a conclusão de um XMLHttpRequest).

A change detection é altamente otimizada e performática, mas ainda pode causar lentidão se a aplicação a executar com muita frequência.

Neste guia, você aprenderá como controlar e otimizar o mecanismo de change detection pulando partes da sua aplicação e executando change detection apenas quando necessário.

Assista a este vídeo se você preferir aprender mais sobre otimizações de performance em formato de mídia:

<docs-video src="https://www.youtube.com/embed/f8sA-i6gkGQ"/>
