<!-- ia-translate: true -->
# Versionamento e lançamentos do Angular

Reconhecemos que você precisa de estabilidade do framework Angular.
A estabilidade garante que components e bibliotecas reutilizáveis, tutoriais, ferramentas e práticas aprendidas não se tornem obsoletos inesperadamente.
A estabilidade é essencial para que o ecossistema ao redor do Angular prospere.

Também compartilhamos com você a necessidade de que o Angular continue evoluindo.
Nos esforçamos para garantir que a base sobre a qual você está construindo esteja continuamente melhorando e permitindo que você se mantenha atualizado com o restante do ecossistema web e as necessidades de seus usuários.

Este documento contém as práticas que seguimos para fornecer a você uma plataforma de desenvolvimento de aplicações de ponta, equilibrada com estabilidade.
Nos esforçamos para garantir que mudanças futuras sejam sempre introduzidas de forma previsível.
Queremos que todos que dependem do Angular saibam quando e como novas funcionalidades são adicionadas, e estejam bem preparados quando as obsoletas forem removidas.

Às vezes _breaking changes_, como a remoção de APIs ou funcionalidades, são necessárias para inovar e se manter atualizado com boas práticas em evolução, dependências em mudança ou mudanças na plataforma web. Estas breaking changes passam por um processo de depreciação explicado em nossa [política de depreciação](#deprecation-policy).

Para tornar essas transições o mais diretas possível, o time do Angular assume estes compromissos:

- Trabalhamos duro para minimizar o número de breaking changes e fornecer ferramentas de migração quando possível
- Seguimos a política de depreciação descrita aqui, para que você tenha tempo de atualizar suas aplicações para as APIs e boas práticas mais recentes

ÚTIL: As práticas descritas neste documento se aplicam ao Angular 2.0 e posteriores.
Se você está atualmente usando AngularJS, veja [Atualizando do AngularJS](https://angular.io/guide/upgrade 'Upgrading from Angular JS').
_AngularJS_ é o nome para todas as versões v1.x do Angular.

## Versionamento do Angular

Os números de versão do Angular indicam o nível de mudanças introduzidas pelo lançamento.
Este uso de [versionamento semântico](https://semver.org/ 'Semantic Versioning Specification') ajuda você a entender o impacto potencial de atualizar para uma nova versão.

Os números de versão do Angular têm três partes: `major.minor.patch`.
Por exemplo, a versão 7.2.11 indica versão major 7, versão minor 2 e nível de patch 11.

O número da versão é incrementado com base no nível de mudança incluído no lançamento.

| Nível de mudança | Detalhes                                                                                                                                                                                                                                                                                                                                                                                                                             |
| :--------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lançamento major | Contém novas funcionalidades significativas, alguma assistência mínima do desenvolvedor é esperada durante a atualização. Ao atualizar para um novo lançamento major, você pode precisar executar scripts de atualização, refatorar código, executar testes adicionais e aprender novas APIs.                                                                                                                                        |
| Lançamento minor | Contém novas funcionalidades menores. Lançamentos minor são totalmente compatíveis com versões anteriores; nenhuma assistência do desenvolvedor é esperada durante a atualização, mas você pode opcionalmente modificar suas aplicações e bibliotecas para começar a usar novas APIs, funcionalidades e capacidades que foram adicionadas no lançamento. Atualizamos peer dependencies em versões minor expandindo as versões suportadas, mas não exigimos que projetos atualizem essas dependências. |
| Lançamento patch | Lançamento de correção de bugs de baixo risco. Nenhuma assistência do desenvolvedor é esperada durante a atualização.                                                                                                                                                                                                                                                                                                                |

ÚTIL: A partir do Angular versão 7, as versões major do Angular core e do CLI estão alinhadas.
Isso significa que para usar o CLI enquanto você desenvolve uma aplicação Angular, a versão do `@angular/core` e do CLI precisam ser a mesma.

### Lançamentos preview

Permitimos que você visualize o que está por vir fornecendo pré-lançamentos "Next" e Release Candidates \(`rc`\) para cada lançamento major e minor:

| Tipo de pré-lançamento | Detalhes                                                                                                                                                                       |
| :--------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Next                   | O lançamento que está sob desenvolvimento e testes ativos. O próximo lançamento é indicado por uma tag de lançamento anexada com o identificador `-next`, como `8.1.0-next.0`. |
| Release candidate      | Um lançamento que está completo em funcionalidades e em testes finais. Um release candidate é indicado por uma tag de lançamento anexada com o identificador `-rc`, como a versão `8.1.0-rc.0`. |

A versão mais recente `next` ou `rc` de pré-lançamento da documentação está disponível em [next.angular.dev](https://next.angular.dev).

## Frequência de lançamentos

Trabalhamos em direção a um cronograma regular de lançamentos, para que você possa planejar e coordenar suas atualizações com a evolução contínua do Angular.

ÚTIL: As datas são oferecidas como orientação geral e estão sujeitas a alterações.

Em geral, espere o seguinte ciclo de lançamento:

- Um lançamento major a cada 6 meses
- 1-3 lançamentos minor para cada lançamento major
- Um lançamento patch e build de pré-lançamento \(`next` ou `rc`\) quase toda semana

Esta cadência de lançamentos dá aos desenvolvedores ansiosos acesso a novas funcionalidades assim que elas são totalmente desenvolvidas e passam por nossos processos de revisão de código e testes de integração, mantendo ao mesmo tempo a estabilidade e confiabilidade da plataforma para usuários de produção que preferem receber funcionalidades depois de terem sido validadas pelo Google e outros desenvolvedores que usam os builds de pré-lançamento.

## Política e cronograma de suporte

ÚTIL: Datas aproximadas são oferecidas como orientação geral e estão sujeitas a alterações.

### Cronograma de lançamentos

| Versão | Data               |
| :----- | :----------------- |
| v20.1  | Semana de 2025-07-07 |
| v20.2  | Semana de 2025-08-18 |
| v21.0  | Semana de 2025-11-17 |

### Janela de suporte

Todos os lançamentos major são tipicamente suportados por 18 meses.

| Estágio de suporte    | Tempo de suporte | Detalhes                                                                       |
| :-------------------- | :--------------- | :----------------------------------------------------------------------------- |
| Ativo                 | 6 meses          | Atualizações e patches regularmente agendados são lançados                     |
| Longo prazo \(LTS\)   | 12 meses         | Apenas [correções críticas e patches de segurança](#lts-fixes) são lançados   |

### Versões ativamente suportadas

A tabela a seguir fornece o status das versões do Angular sob suporte.

| Versão  | Status | Lançado    | Fim do ativo | Fim do LTS |
| :------ | :----- | :--------- | :----------- | :--------- |
| ^20.0.0 | Ativo  | 2025-05-28 | 2025-11-21   | 2026-11-21 |
| ^19.0.0 | LTS    | 2024-11-19 | 2025-05-28   | 2026-05-19 |
| ^18.0.0 | LTS    | 2024-05-22 | 2024-11-19   | 2025-11-21 |

As versões do Angular v2 a v17 não são mais suportadas.

### Correções LTS

Como regra geral, uma correção é considerada para uma versão LTS se ela resolver uma das seguintes situações:

- Uma vulnerabilidade de segurança recém-identificada,
- Uma regressão, desde o início do LTS, causada por uma mudança de terceiros, como uma nova versão de browser.

## Política de depreciação

Quando o time do Angular pretende remover uma API ou funcionalidade, ela será marcada como _deprecated_ (depreciada). Isso ocorre quando uma API é obsoleta, substituída por outra API ou descontinuada de outra forma. APIs depreciadas permanecem disponíveis durante sua fase de depreciação, que dura no mínimo duas versões major (aproximadamente um ano).

Para ajudar a garantir que você tenha tempo suficiente e um caminho claro para atualizar, esta é nossa política de depreciação:

| Estágios de depreciação | Detalhes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| :---------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Anúncio                 | Anunciamos APIs e funcionalidades depreciadas no [change log](https://github.com/angular/angular/blob/main/CHANGELOG.md 'Angular change log'). APIs depreciadas aparecem na [documentação](api?status=deprecated) com ~~tachado~~. Quando anunciamos uma depreciação, também anunciamos um caminho de atualização recomendado. Adicionalmente, todas as APIs depreciadas são anotadas com `@deprecated` na documentação correspondente, o que permite que editores de texto e IDEs forneçam dicas se seu projeto depende delas. |
| Período de depreciação  | Quando uma API ou funcionalidade é depreciada, ela ainda está presente em pelo menos os próximos dois lançamentos major (período de pelo menos 12 meses). Depois disso, APIs e funcionalidades depreciadas são candidatas à remoção. Uma depreciação pode ser anunciada em qualquer lançamento, mas a remoção de uma API ou funcionalidade depreciada acontece apenas em lançamento major. Até que uma API ou funcionalidade depreciada seja removida, ela é mantida de acordo com a política de suporte LTS, o que significa que apenas problemas críticos e de segurança são corrigidos. |
| Dependências npm        | Fazemos atualizações de dependências npm que exigem mudanças em suas aplicações apenas em um lançamento major. Em lançamentos minor, atualizamos peer dependencies expandindo as versões suportadas, mas não exigimos que projetos atualizem essas dependências até uma futura versão major. Isso significa que durante lançamentos minor do Angular, atualizações de dependências npm dentro de aplicações e bibliotecas Angular são opcionais.                                                                          |

## Política de compatibilidade

O Angular é uma coleção de muitos pacotes, subprojetos e ferramentas.
Para evitar o uso acidental de APIs privadas e para que você possa entender claramente o que é coberto pelas práticas descritas aqui — documentamos o que é e o que não é considerado nossa superfície de API pública.
Para detalhes, veja [Superfície de API Pública Suportada do Angular](https://github.com/angular/angular/blob/main/contributing-docs/public-api-surface.md 'Supported Public API Surface of Angular').

Para garantir a compatibilidade retroativa do Angular, executamos uma série de verificações antes de fazer merge de qualquer mudança:

- Testes unitários e testes de integração
- Comparar as definições de tipo da superfície de API pública antes e depois da mudança
- Executar os testes de todas as aplicações no Google que dependem do Angular

Quaisquer mudanças na superfície de API pública são feitas de acordo com as políticas de versionamento, suporte e depreciação descritas anteriormente. Em casos excepcionais, como patches críticos de segurança, correções podem introduzir mudanças incompatíveis com versões anteriores. Tais casos excepcionais são acompanhados por aviso explícito nos canais oficiais de comunicação do framework.

## Política de breaking changes e caminhos de atualização

Breaking change requer que você faça trabalho porque o estado depois dela não é compatível com versões anteriores ao estado antes dela. Você pode encontrar as raras exceções desta regra na [Política de compatibilidade](#compatibility-policy). Exemplos de breaking changes são a remoção de APIs públicas ou outras mudanças da definição de tipo do Angular, mudança no timing de chamadas ou atualização para uma nova versão de uma dependência do Angular, que inclui breaking changes em si.

Para apoiá-lo em caso de breaking changes no Angular:

- Seguimos nossa [política de depreciação](#deprecation-policy) antes de removermos uma API pública
- Suportamos automação de atualização via comando `ng update`. Ele fornece transformações de código que frequentemente testamos antecipadamente em centenas de milhares de projetos no Google
- Instruções passo a passo de como atualizar de uma versão major para outra no ["Guia de Atualização do Angular"](update-guide)

Você pode usar `ng update` para qualquer versão do Angular, desde que os seguintes critérios sejam atendidos:

- A versão para a qual você quer atualizar é suportada.
- A versão da qual você quer atualizar está dentro de uma versão major da versão para a qual você quer atualizar.

Por exemplo, você pode atualizar da versão 11 para a versão 12, desde que a versão 12 ainda seja suportada.
Se você quiser atualizar através de múltiplas versões major, execute cada atualização uma versão major por vez.
Por exemplo, para atualizar da versão 10 para a versão 12:

1. Atualize da versão 10 para a versão 11.
1. Atualize da versão 11 para a versão 12.

## Developer Preview

Ocasionalmente introduzimos novas APIs sob o rótulo de "Developer Preview". Estas são APIs que são totalmente funcionais e polidas, mas que não estamos prontos para estabilizar sob nossa política normal de depreciação.

Isso pode ser porque queremos reunir feedback de aplicações reais antes da estabilização, ou porque a documentação associada ou ferramentas de migração não estão totalmente completas. Feedback pode ser fornecido via [issue no GitHub](https://github.com/angular/angular/issues), onde desenvolvedores podem compartilhar suas experiências, reportar bugs ou sugerir melhorias para ajudar a refinar a funcionalidade.

As políticas e práticas descritas neste documento não se aplicam a APIs marcadas como Developer Preview. Tais APIs podem mudar a qualquer momento, mesmo em novas versões patch do framework. Os times devem decidir por si mesmos se os benefícios de usar APIs Developer Preview valem o risco de breaking changes fora de nosso uso normal de versionamento semântico.

## Experimental

Estas APIs podem não se tornar estáveis de forma alguma ou ter mudanças significativas antes de se tornarem estáveis.

As políticas e práticas descritas neste documento não se aplicam a APIs marcadas como experimental. Tais APIs podem mudar a qualquer momento, mesmo em novas versões patch do framework. Os times devem decidir por si mesmos se os benefícios de usar APIs experimentais valem o risco de breaking changes fora de nosso uso normal de versionamento semântico.
