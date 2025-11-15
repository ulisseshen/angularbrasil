<!-- ia-translate: true -->
# Estratégias de renderização no Angular

Este guia ajuda você a escolher a estratégia de renderização certa para diferentes partes da sua aplicação Angular.

## O que são estratégias de renderização?

Estratégias de renderização determinam quando e onde o conteúdo HTML da sua aplicação Angular é gerado. Cada estratégia oferece diferentes compensações entre desempenho de carregamento inicial da página, interatividade, capacidades de SEO e uso de recursos do servidor.

O Angular suporta três estratégias de renderização principais:

- **Client-Side Rendering (CSR)** - O conteúdo é renderizado inteiramente no navegador
- **Static Site Generation (SSG/Prerendering)** - O conteúdo é pré-renderizado no momento da build
- **Server-Side Rendering (SSR)** - O conteúdo é renderizado no servidor para a requisição inicial de uma route

## Client-Side Rendering (CSR)

**CSR é o padrão do Angular.** O conteúdo renderiza inteiramente no navegador após o JavaScript carregar.

### Quando usar CSR

✅ Pode ser uma boa opção para:

- Aplicações interativas (dashboards, painéis de administração)
- Aplicações em tempo real
- Ferramentas internas onde SEO não importa
- Aplicações de página única com estado complexo do lado do cliente

❌ Quando possível, considere evitá-lo para:

- Conteúdo público que precisa de SEO
- Páginas onde o desempenho de carregamento inicial é crítico

### Compensações do CSR

| Aspect            | Impact                                                           |
| :---------------- | :--------------------------------------------------------------- |
| **SEO**           | Ruim - conteúdo não visível para crawlers até que o JS execute  |
| **Initial load**  | Mais lento - deve baixar e executar JavaScript primeiro         |
| **Interactivity** | Imediato uma vez carregado                                       |
| **Server needs**  | Mínimo fora de alguma configuração                               |
| **Complexity**    | Mais simples porque funciona com configuração mínima             |

## Static Site Generation (SSG/Prerendering)

**SSG pré-renderiza páginas no momento da build** em arquivos HTML estáticos. O servidor envia HTML pré-construído para o carregamento inicial da página. Após a hidratação, sua aplicação roda inteiramente no navegador como uma SPA tradicional - navegação subsequente, mudanças de route e chamadas de API acontecem todas do lado do cliente sem renderização do servidor.

### Quando usar SSG

✅ Pode ser uma boa opção para:

- Páginas de marketing e landing pages
- Posts de blog e documentação
- Catálogos de produtos com conteúdo estável
- Conteúdo que não muda por usuário

❌ Quando possível, considere evitá-lo para:

- Conteúdo específico do usuário
- Dados que mudam frequentemente
- Informações em tempo real

### Compensações do SSG

| Aspect              | Impact                                          |
| :------------------ | :---------------------------------------------- |
| **SEO**             | Excelente - HTML completo disponível imediatamente |
| **Initial load**    | Mais rápido - HTML pré-gerado                   |
| **Interactivity**   | Após a conclusão da hidratação                  |
| **Server needs**    | Nenhum para servir (compatível com CDN)         |
| **Build time**      | Mais longo - gera todas as páginas antecipadamente |
| **Content updates** | Requer rebuild e redeploy                       |

📖 **Implementação:** Veja [Customizando prerendering em tempo de build](guide/ssr#customizing-build-time-prerendering-ssg) no guia de SSR.

## Server-Side Rendering (SSR)

**SSR gera HTML no servidor para a requisição inicial de uma route**, fornecendo conteúdo dinâmico com bom SEO. O servidor renderiza HTML e o envia para o cliente.

Uma vez que o cliente renderiza a página, o Angular [hidrata](/guide/hydration#what-is-hydration) a aplicação e ela então roda inteiramente no navegador como uma SPA tradicional - navegação subsequente, mudanças de route e chamadas de API acontecem todas do lado do cliente sem renderização adicional do servidor.

### Quando usar SSR

✅ Pode ser uma boa opção para:

- Páginas de produtos de e-commerce (preços/inventário dinâmicos)
- Sites de notícias e feeds de mídia social
- Conteúdo personalizado que muda frequentemente

❌ Quando possível, considere evitá-lo para:

- Conteúdo estático (use SSG em vez disso)
- Quando custos de servidor são uma preocupação

### Compensações do SSR

| Aspect              | Impact                                                       |
| :------------------ | :----------------------------------------------------------- |
| **SEO**             | Excelente - HTML completo para crawlers                      |
| **Initial load**    | Rápido - visibilidade imediata do conteúdo                   |
| **Interactivity**   | Atrasado até a hidratação                                    |
| **Server needs**    | Requer servidor                                              |
| **Personalization** | Acesso completo ao contexto do usuário                       |
| **Server costs**    | Mais alto - renderiza na requisição inicial de uma route     |

📖 **Implementação:** Veja [Server routing](guide/ssr#server-routing) e [Criando components compatíveis com servidor](guide/ssr#authoring-server-compatible-components) no guia de SSR.

## Escolhendo a Estratégia Certa

### Matriz de decisão

| Se você precisa...             | Use esta estratégia | Por quê                                              |
| :----------------------------- | :------------------ | :--------------------------------------------------- |
| **SEO + Conteúdo estático**    | SSG                 | HTML pré-renderizado, carregamento mais rápido       |
| **SEO + Conteúdo dinâmico**    | SSR                 | Conteúdo atualizado na requisição inicial de uma route |
| **Sem SEO + Interatividade**   | CSR                 | Mais simples, não precisa de servidor                |
| **Requisitos mistos**          | Híbrido             | Estratégias diferentes por route                     |

## Tornando SSR/SSG Interativo com Hydration

Ao usar SSR ou SSG, o Angular "hidrata" o HTML renderizado no servidor para torná-lo interativo.

**Estratégias disponíveis:**

- **Full hydration** - A aplicação inteira se torna interativa de uma vez (padrão)
- **Incremental hydration** - Partes se tornam interativas conforme necessário (melhor desempenho)
- **Event replay** - Captura cliques antes da conclusão da hidratação

📖 **Saiba mais:**

- [Guia de Hydration](guide/hydration) - Configuração completa de hydration
- [Incremental hydration](guide/incremental-hydration) - Hydration avançada com blocos `@defer`

## Próximos passos

<docs-pill-row>
  <docs-pill href="/guide/ssr" title="Server-Side Rendering"/>
  <docs-pill href="/guide/hydration" title="Hydration"/>
  <docs-pill href="/guide/incremental-hydration" title="Incremental Hydration"/>
</docs-pill-row>
