<!-- ia-translate: true -->
# Desempenho {#performance}

O Angular inclui muitas otimizações prontas para uso, mas, conforme as aplicações crescem, pode ser necessário ajustar tanto a velocidade com que sua aplicação carrega quanto a responsividade que ela apresenta durante o uso. Estes guias cobrem as ferramentas e técnicas que o Angular oferece para ajudar você a construir aplicações rápidas.

## Desempenho de carregamento {#loading-performance}

O desempenho de carregamento determina com que rapidez sua aplicação se torna visível e interativa. Um carregamento lento impacta diretamente os [Core Web Vitals](https://web.dev/vitals/), como Largest Contentful Paint (LCP) e Time to First Byte (TTFB).

| Técnica                                                                                                 | O que faz                                                                                                                                                                                                                       | Quando usar                                                                                   |
| :------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------- |
| [Rotas com lazy loading](best-practices/performance/lazy-loaded-routes#lazily-loaded-components-and-routes) | Adia o carregamento dos components de rota até a navegação, reduzindo o tamanho do bundle inicial                                                                                                                              | Aplicações com várias rotas, em que nem todas são necessárias no carregamento inicial          |
| [Carregamento adiado com `@defer`](best-practices/performance/defer)                                    | Divide os components em bundles separados que são carregados sob demanda                                                                                                                                                        | Components não visíveis na renderização inicial, bibliotecas de terceiros pesadas, conteúdo abaixo da dobra |
| [Lazy loading de services com `injectAsync`](guide/di/lazy-loading-services)                            | Separa services raramente usados em chunks independentes e os carrega sob demanda                                                                                                                                              | Services que dependem de bibliotecas grandes ou de funcionalidades pouco usadas               |
| [Otimização de imagens](best-practices/performance/image-optimization)                                  | Prioriza imagens do LCP, faz lazy loading das demais e gera atributos `srcset` responsivos                                                                                                                                      | Qualquer aplicação que exiba imagens                                                          |
| [Renderização no servidor](best-practices/performance/ssr)                                              | Renderiza páginas no servidor para um primeiro paint mais rápido e melhor SEO, com [hidratação](guide/hydration) para restaurar a interatividade e [hidratação incremental](guide/incremental-hydration) para adiar a hidratação de seções até que sejam necessárias | Aplicações com muito conteúdo, páginas que precisam ser indexadas por mecanismos de busca      |

## Desempenho em tempo de execução {#runtime-performance}

O desempenho em tempo de execução determina com que responsividade sua aplicação se comporta depois de carregar. O sistema de detecção de mudanças do Angular mantém o DOM sincronizado com seus dados, e otimizar como e quando ele é executado é a principal alavanca para melhorar o desempenho em tempo de execução.

| Técnica                                                         | O que faz                                                                                           | Quando usar                                                                           |
| :-------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------ |
| [Detecção de mudanças zoneless](guide/zoneless)                 | Remove a sobrecarga do ZoneJS e dispara a detecção de mudanças somente quando signals ou eventos indicam uma mudança | Novas aplicações (padrão no Angular v21+) ou aplicações existentes prontas para migrar |
| [Computações lentas](best-practices/slow-computations)          | Identifica e otimiza expressões de template custosas e lifecycle hooks                              | A profilagem revela components específicos causando ciclos lentos de detecção de mudanças |
| [Pulando subárvores de components](best-practices/skipping-subtrees) | Usa a detecção de mudanças `OnPush` para pular árvores de components que não mudaram            | Aplicações que precisam de controle mais fino sobre a detecção de mudanças            |
| [Poluição da Zone](best-practices/zone-pollution)               | Evita detecções de mudanças desnecessárias causadas por bibliotecas de terceiros ou timers          | Aplicações baseadas em Zone em que a profilagem revela ciclos excessivos de detecção de mudanças |

## Medindo o desempenho {#measuring-performance}

Identificar o que otimizar é tão importante quanto saber como otimizar. O Angular se integra às ferramentas de desenvolvedor do navegador para ajudar você a encontrar gargalos.

| Ferramenta                                                                 | O que faz                                                                                                                                                                        |
| :------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Profilagem com Chrome DevTools](best-practices/profiling-with-chrome-devtools) | Registra dados de desempenho específicos do Angular junto com a profilagem do navegador, com flame charts codificados por cores que mostram a renderização dos components, os ciclos de detecção de mudanças e os lifecycle hooks |
| [Angular DevTools](tools/devtools)                                         | Uma extensão do navegador que oferece um inspetor de árvore de components e um profiler para visualizar os ciclos de detecção de mudanças                                       |

## O que otimizar primeiro {#what-to-optimize-first}

Se você não tem certeza por onde começar, faça primeiro a profilagem da sua aplicação usando a [seção Angular do Chrome DevTools](best-practices/profiling-with-chrome-devtools) para identificar gargalos específicos.

Como ponto de partida geral:

- **Carregamento inicial lento** — Use o [`@defer`](best-practices/performance/defer) para separar components grandes do bundle principal, o [`NgOptimizedImage`](best-practices/performance/image-optimization) para priorizar imagens acima da dobra e a [renderização no servidor](best-practices/performance/ssr) para entregar o conteúdo mais rapidamente.
- **Interações lentas após o carregamento** — Verifique se a [detecção de mudanças zoneless](guide/zoneless) está habilitada, procure [computações lentas](best-practices/slow-computations) em templates ou lifecycle hooks e considere o [`OnPush`](best-practices/skipping-subtrees) para reduzir detecções de mudanças desnecessárias.
