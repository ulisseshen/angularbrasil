<!-- ia-translate: true -->
# Mantendo seus projetos Angular atualizados

Assim como a Web e todo o ecossistema web, o Angular está em constante evolução.
O Angular equilibra melhorias contínuas com um forte foco em estabilidade e em tornar as atualizações simples.
Manter sua aplicação Angular atualizada permite que você aproveite novos recursos de ponta, além de otimizações e correções de bugs.

Este documento contém informações e recursos para ajudá-lo a manter suas aplicações e bibliotecas Angular atualizadas.

Para informações sobre nossa política e práticas de versionamento — incluindo práticas de suporte e descontinuação, bem como o cronograma de lançamentos — veja [Versionamento e lançamentos do Angular](reference/releases 'Angular versioning and releases').

HELPFUL: Se você está usando AngularJS, veja [Atualizando do AngularJS](https://angular.io/guide/upgrade 'Upgrading from AngularJS').
_AngularJS_ é o nome de todas as versões v1.x do Angular.

## Sendo notificado sobre novos lançamentos {#getting-notified-of-new-releases}

Para ser notificado quando novos lançamentos estiverem disponíveis, siga [@angular](https://x.com/angular '@angular on X') no X (antigo Twitter) ou assine o [blog do Angular](https://blog.angular.dev 'Angular blog').

## Aprendendo sobre novos recursos {#learning-about-new-features}

O que há de novo? O que mudou? Compartilhamos as informações mais importantes que você precisa saber no blog do Angular, nos [anúncios de lançamento](https://blog.angular.dev/ 'Angular blog - release announcements').

Para revisar uma lista completa de mudanças, organizada por versão, veja o [log de mudanças do Angular](https://github.com/angular/angular/blob/main/CHANGELOG.md 'Angular change log').

## Verificando sua versão do Angular {#checking-your-version-of-angular}

Para verificar a versão do Angular da sua aplicação, use o comando `ng version` dentro do diretório do seu projeto.

## Encontrando a versão atual do Angular {#finding-the-current-version-of-angular}

A versão estável mais recente do Angular aparece [no npm](https://www.npmjs.com/package/@angular/core 'Angular on npm') em "Version". Por exemplo, `16.2.4`.

Você também pode encontrar a versão mais atual do Angular usando o comando da CLI [`ng update`](cli/update).
Por padrão, o [`ng update`](cli/update) (sem argumentos adicionais) lista as atualizações disponíveis para você.

## Atualizando seu ambiente e suas aplicações {#updating-your-environment-and-apps}

Para tornar a atualização descomplicada, fornecemos instruções completas no [Guia de Atualização do Angular](update-guide), que é interativo.

O Guia de Atualização do Angular fornece instruções de atualização personalizadas, com base nas versões atual e de destino que você especificar.
Ele inclui caminhos de atualização básicos e avançados, para corresponder à complexidade das suas aplicações.
Também inclui informações de solução de problemas e quaisquer mudanças manuais recomendadas, para ajudar você a aproveitar ao máximo a nova versão.

Para atualizações simples, o comando da CLI [`ng update`](cli/update) é tudo o que você precisa.
Sem argumentos adicionais, o [`ng update`](cli/update) lista as atualizações disponíveis para você e fornece as etapas recomendadas para atualizar sua aplicação para a versão mais atual.

[Versionamento e lançamentos do Angular](reference/releases#angular-versioning 'Angular Release Practices, Versioning') descreve o nível de mudança que você pode esperar com base no número de versão de um lançamento.
Também descreve os caminhos de atualização suportados.

## Resumo de recursos {#resource-summary}

- Anúncios de lançamento:
  [Blog do Angular - anúncios sobre lançamentos recentes](https://blog.angular.dev/ 'Angular blog announcements about recent releases')

- Detalhes do lançamento:
  [Log de mudanças do Angular](https://github.com/angular/angular/blob/main/CHANGELOG.md 'Angular change log')

- Instruções de atualização:
  [Guia de Atualização do Angular](update-guide)

- Referência do comando de atualização:
  [Referência do comando `ng update` da CLI do Angular](cli/update)

- Práticas de versionamento, lançamento, suporte e descontinuação:
  [Versionamento e lançamentos do Angular](reference/releases 'Angular versioning and releases')
