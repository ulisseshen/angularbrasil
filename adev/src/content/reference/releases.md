<!-- ia-translate: true -->

# Versionamento e lançamentos do Angular

Reconhecemos que você precisa de estabilidade do framework Angular.
A estabilidade garante que components e bibliotecas reutilizáveis, tutoriais, ferramentas e práticas aprendidas não se tornem obsoletos inesperadamente.
A estabilidade é essencial para que o ecossistema em torno do Angular prospere.

Também compartilhamos com você a necessidade de o Angular continuar evoluindo.
Nos esforçamos para garantir que a base sobre a qual você está construindo esteja em melhoria contínua e que lhe permita se manter atualizado com o restante do ecossistema web e com as necessidades dos seus usuários.

Este documento contém as práticas que seguimos para oferecer uma plataforma de desenvolvimento de aplicações de ponta, equilibrada com estabilidade.
Nos esforçamos para garantir que mudanças futuras sejam sempre introduzidas de forma previsível.
Queremos que todos que dependem do Angular saibam quando e como novas funcionalidades são adicionadas, e que estejam bem preparados quando funcionalidades obsoletas forem removidas.

Às vezes, _breaking changes_, como a remoção de APIs ou funcionalidades, são necessárias para inovar e se manter atualizado com as práticas recomendadas em evolução, as dependências em mudança ou as mudanças na plataforma web. Essas breaking changes passam por um processo de depreciação explicado em nossa [política de depreciação](#deprecation-policy).

Para tornar essas transições as mais simples possível, o time do Angular assume estes compromissos:

- Trabalhamos duro para minimizar o número de breaking changes e fornecer ferramentas de migração sempre que possível
- Seguimos a política de depreciação descrita aqui, para que você tenha tempo de atualizar suas aplicações para as APIs e as boas práticas mais recentes

HELPFUL: As práticas descritas neste documento se aplicam ao Angular 2.0 e versões posteriores.
Se você está usando AngularJS atualmente, veja [Atualizando a partir do AngularJS](https://angular.io/guide/upgrade 'Upgrading from AngularJS').
_AngularJS_ é o nome de todas as versões v1.x do Angular.

## Versionamento do Angular {#angular-versioning}

Os números de versão do Angular indicam o nível de mudanças introduzidas por cada lançamento.
Este uso de [versionamento semântico](https://semver.org/ 'Semantic Versioning Specification') ajuda você a entender o impacto potencial de atualizar para uma nova versão.

Os números de versão do Angular têm três partes: `major.minor.patch`.
Por exemplo, a versão 7.2.11 indica a versão major 7, a versão minor 2 e o nível de patch 11.

O número da versão é incrementado com base no nível de mudança incluído no lançamento.

| Nível de mudança | Detalhes |
| :--------------- | :------- |
| Lançamento major | Contém novas funcionalidades significativas; é esperada alguma assistência mínima do desenvolvedor durante a atualização. Ao atualizar para um novo lançamento major, você pode precisar executar scripts de atualização, refatorar código, executar testes adicionais e aprender novas APIs. |
| Lançamento minor | Contém novas funcionalidades menores. Lançamentos minor são totalmente compatíveis com versões anteriores; não é esperada assistência do desenvolvedor durante a atualização, mas você pode, opcionalmente, modificar suas aplicações e bibliotecas para começar a usar novas APIs, funcionalidades e capacidades adicionadas no lançamento. Atualizamos as peer dependencies em versões minor expandindo as versões suportadas, mas não exigimos que os projetos atualizem essas dependências. |
| Lançamento patch | Lançamento de correção de bugs de baixo risco. Não é esperada assistência do desenvolvedor durante a atualização. |

HELPFUL: A partir da versão 7 do Angular, as versões major do core do Angular e do CLI estão alinhadas.
Isso significa que, para usar o CLI enquanto você desenvolve uma aplicação Angular, a versão de `@angular/core` e a do CLI precisam ser iguais.

### Lançamentos de preview {#preview-releases}

Permitimos que você veja o que está por vir, fornecendo pré-lançamentos "Next" e Release Candidates \(`rc`\) para cada lançamento major e minor:

| Tipo de pré-lançamento | Detalhes |
| :--------------------- | :------- |
| Next | O lançamento que está em desenvolvimento ativo e em testes. O próximo lançamento é indicado por uma tag de versão com o identificador `-next`, como `8.1.0-next.0`. |
| Release candidate | Um lançamento que está completo em funcionalidades e em testes finais. Um release candidate é indicado por uma tag de versão com o identificador `-rc`, como `8.1.0-rc.0`. |

A versão de pré-lançamento `next` ou `rc` mais recente da documentação está disponível em [next.angular.dev](https://next.angular.dev).

## Frequência de lançamentos {#release-frequency}

Trabalhamos em direção a um cronograma regular de lançamentos, para que você possa planejar e coordenar suas atualizações com a evolução contínua do Angular.

HELPFUL: As datas são oferecidas como orientação geral e estão sujeitas a mudanças.

Em geral, espere o seguinte ciclo de lançamentos:

- Um lançamento major a cada 12 meses
- 4-6 lançamentos minor para cada lançamento major
- Um lançamento patch e um build de pré-lançamento \(`next` ou `rc`\) quase toda semana

Essa cadência de lançamentos dá aos desenvolvedores mais ansiosos acesso a novas funcionalidades assim que elas estão totalmente desenvolvidas e passaram pelos nossos processos de revisão de código e testes de integração, ao mesmo tempo que mantém a estabilidade e a confiabilidade da plataforma para usuários de produção que preferem receber funcionalidades depois de validadas pelo Google e por outros desenvolvedores que usam os builds de pré-lançamento.

HELPFUL: Até o Angular v22, o Angular teve um ciclo de lançamentos major de 6 meses, com 1-3 lançamentos minor para cada lançamento major.

## Política e cronograma de suporte {#support-policy-and-schedule}

HELPFUL: As datas aproximadas são oferecidas como orientação geral e estão sujeitas a mudanças.

### Cronograma de lançamentos {#release-schedule}

| Versão | Data |
| :----- | :--- |
| v22.1 | Semana de 2026-07-27 |
| v22.2 | Semana de 2026-09-21 |
| v22.3 | ~ novembro de 2026 |
| v22.4 | ~ janeiro de 2027 |
| v22.5 | ~ março de 2027 |
| v23.0 | ~ junho de 2027 |

### Janela de suporte {#support-window}

Todos os lançamentos major são normalmente suportados por 24 meses.

| Estágio de suporte | Tempo de suporte | Detalhes |
| :----------------- | :--------------- | :------- |
| Ativo | 12 meses | Atualizações e patches com agendamento regular são lançados |
| Longo prazo \(LTS\) | 12 meses | Apenas [correções críticas e patches de segurança](#lts-fixes) são lançados |

### Versões ativamente suportadas {#actively-supported-versions}

A tabela a seguir apresenta o status das versões do Angular em suporte.

| Versão | Status | Lançada em | Fim do ativo | Fim do LTS |
| :----- | :----- | :--------- | :----------- | :--------- |
| ^22.0.0 | Ativa | 2026-06-03 | 2027-06 | 2028-06 |
| ^21.0.0 | LTS | 2025-11-19 | 2026-06-03 | 2027-06 |
| ^20.0.0 | LTS | 2025-05-28 | 2025-11-19 | 2026-11-28 |

IMPORTANT: As versões do Angular v2 a v19 não são mais suportadas.

### Correções LTS {#lts-fixes}

Como regra geral, uma correção é considerada para uma versão LTS se resolver um dos seguintes casos:

- Uma vulnerabilidade de segurança recém-identificada.
- Uma regressão, desde o início do LTS, causada por uma mudança de terceiros, como uma nova versão de navegador.

## Política de depreciação {#deprecation-policy}

Quando o time do Angular pretende remover uma API ou funcionalidade, ela será marcada como _depreciada_. Isso ocorre quando uma API está obsoleta, substituída por outra API ou descontinuada de outra forma. APIs depreciadas continuam disponíveis durante sua fase de depreciação, que dura no mínimo uma versão major (aproximadamente um ano).

Para ajudar a garantir que você tenha tempo suficiente e um caminho claro para atualizar, esta é a nossa política de depreciação:

| Estágios de depreciação | Detalhes |
| :---------------------- | :------- |
| Anúncio | Anunciamos APIs e funcionalidades depreciadas no [change log](https://github.com/angular/angular/blob/main/CHANGELOG.md 'Angular change log'). APIs depreciadas aparecem na [documentação](api?status=8) com ~~tachado~~. Quando anunciamos uma depreciação, também anunciamos um caminho de atualização recomendado. Além disso, todas as APIs depreciadas são anotadas com `@deprecated` na documentação correspondente, o que permite que editores de texto e IDEs forneçam dicas se o seu projeto depender delas. |
| Período de depreciação | Quando uma API ou funcionalidade é depreciada, ela continua presente pelo menos no próximo lançamento major (período de no mínimo 12 meses). Depois disso, APIs e funcionalidades depreciadas tornam-se candidatas à remoção. Uma depreciação pode ser anunciada em qualquer lançamento, mas a remoção de uma API ou funcionalidade depreciada acontece somente em um lançamento major. Até que uma API ou funcionalidade depreciada seja removida, ela é mantida de acordo com a política de suporte LTS, o que significa que apenas problemas críticos e de segurança são corrigidos. |
| Dependências npm | Fazemos atualizações de dependências npm que exigem mudanças nas suas aplicações apenas em um lançamento major. Em lançamentos minor, atualizamos as peer dependencies expandindo as versões suportadas, mas não exigimos que os projetos atualizem essas dependências até uma futura versão major. Isso significa que, durante os lançamentos minor do Angular, as atualizações de dependências npm dentro de aplicações e bibliotecas Angular são opcionais. |

## Política de compatibilidade {#compatibility-policy}

O Angular é uma coleção de muitos pacotes, subprojetos e ferramentas.
Para evitar o uso acidental de APIs privadas e para que você possa entender claramente o que é coberto pelas práticas descritas aqui, documentamos o que é e o que não é considerado a nossa superfície de API pública.
Para mais detalhes, veja [Superfície de API Pública Suportada do Angular](https://github.com/angular/angular/blob/main/contributing-docs/public-api-surface.md 'Supported Public API Surface of Angular').

Para garantir a compatibilidade retroativa do Angular, executamos uma série de verificações antes de fazer merge de qualquer mudança:

- Testes unitários e testes de integração
- Comparação das definições de tipo da superfície de API pública antes e depois da mudança
- Execução dos testes de todas as aplicações do Google que dependem do Angular

Quaisquer mudanças na superfície de API pública são feitas de acordo com as políticas de versionamento, suporte e depreciação descritas anteriormente. Em casos excepcionais, como patches críticos de segurança, correções podem introduzir mudanças incompatíveis com versões anteriores. Esses casos excepcionais são acompanhados de aviso explícito nos canais oficiais de comunicação do framework.

### Estabilidade da ABI do compilador {#compiler-abi-stability}

Além da estabilidade da API pública, o Angular mantém a **estabilidade da ABI do compilador (Application Binary Interface)** entre patches da mesma versão minor. A ABI se refere ao conjunto de APIs internas de runtime (como as prefixadas com `ɵɵ`) usadas pelo código gerado pelo compilador do Angular. Essa estabilidade garante que código compilado com a versão `X.Y.A` do compilador do Angular seja compatível com o runtime do Angular na versão `X.Y.B`.

Essa estabilidade viabiliza casos de uso como microfrontends, nos quais várias aplicações podem compartilhar um único runtime do Angular enquanto são construídas de forma independente com versões de patch diferentes. Observe que a estabilidade da ABI não é garantida entre versões minor, pois novas funcionalidades podem exigir mudanças nas APIs internas ou no formato do código gerado.

HELPFUL: Embora nos esforcemos para manter a compatibilidade da ABI e tratemos qualquer quebra como uma regressão, na prática é difícil validar essa compatibilidade em todas as combinações de versões.

## Política de breaking change e caminhos de atualização {#breaking-change-policy-and-update-paths}

Uma breaking change exige que você faça trabalho, porque o estado após ela não é compatível com versões anteriores. Você pode encontrar as raras exceções a esta regra na [Política de compatibilidade](#compatibility-policy). Exemplos de breaking changes são a remoção de APIs públicas ou outras mudanças na definição de tipo do Angular, mudanças no momento das chamadas ou a atualização para uma nova versão de uma dependência do Angular que contenha breaking changes em si.

Para apoiar você em caso de breaking changes no Angular:

- Seguimos nossa [política de depreciação](#deprecation-policy) antes de remover uma API pública.
- Oferecemos automação de atualização por meio do comando `ng update`. Ele fornece transformações de código que costumamos testar antecipadamente em centenas de milhares de projetos no Google.
- Instruções passo a passo de como atualizar de uma versão major para outra estão no ["Guia de Atualização do Angular"](update-guide).

Você pode usar `ng update` para qualquer versão do Angular, desde que os seguintes critérios sejam atendidos:

- A versão para a qual você quer atualizar é suportada.
- A versão da qual você quer atualizar está a no máximo uma versão major da versão para a qual você quer atualizar.

Por exemplo, você pode atualizar da versão 11 para a versão 12, desde que a versão 12 ainda seja suportada.
Se você quiser atualizar através de múltiplas versões major, execute cada atualização uma versão major por vez.
Por exemplo, para atualizar da versão 10 para a versão 12:

1. Atualize da versão 10 para a versão 11.
1. Atualize da versão 11 para a versão 12.

## Developer Preview

Ocasionalmente, introduzimos novas APIs sob o rótulo de "Developer Preview". São APIs totalmente funcionais e refinadas, mas que ainda não estamos prontos para estabilizar sob nossa política normal de depreciação.

Isso pode acontecer porque queremos coletar feedback de aplicações reais antes da estabilização, ou porque a documentação associada ou as ferramentas de migração ainda não estão totalmente completas. O feedback pode ser enviado por meio de uma [issue no GitHub](https://github.com/angular/angular/issues), onde desenvolvedores podem compartilhar suas experiências, relatar bugs ou sugerir melhorias para ajudar a refinar a funcionalidade.

As políticas e práticas descritas neste documento não se aplicam a APIs marcadas como Developer Preview. Tais APIs podem mudar a qualquer momento, inclusive em novas versões de patch do framework. Os times devem decidir por si mesmos se os benefícios de usar APIs Developer Preview valem o risco de breaking changes fora do nosso uso normal do versionamento semântico.

## Experimental

Essas APIs podem nunca se tornar estáveis ou sofrer mudanças significativas antes de se estabilizarem.

As políticas e práticas descritas neste documento não se aplicam a APIs marcadas como experimentais. Tais APIs podem mudar a qualquer momento, inclusive em novas versões de patch do framework. Os times devem decidir por si mesmos se os benefícios de usar APIs experimentais valem o risco de breaking changes fora do nosso uso normal do versionamento semântico.
