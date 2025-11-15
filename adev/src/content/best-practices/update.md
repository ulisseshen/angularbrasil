<!-- ia-translate: true -->
# Mantendo seus projetos Angular atualizados

Assim como a Web e todo o ecossistema web, o Angular está em constante melhoria.
O Angular equilibra melhoria contínua com um forte foco em estabilidade e em tornar as atualizações diretas.
Manter sua aplicação Angular atualizada permite que você aproveite novos recursos de ponta, bem como otimizações e correções de bugs.

Este documento contém informações e recursos para ajudá-lo a manter suas aplicações e bibliotecas Angular atualizadas.

Para informações sobre nossa política e práticas de versionamento — incluindo práticas de suporte e descontinuação, bem como o cronograma de lançamento — veja [Versionamento e lançamentos do Angular](reference/releases 'Angular versioning and releases').

DICA: Se você está usando atualmente AngularJS, veja [Atualizando do AngularJS](https://angular.io/guide/upgrade 'Upgrading from Angular JS').
_AngularJS_ é o nome para todas as versões v1.x do Angular.

## Sendo notificado sobre novos lançamentos

Para ser notificado quando novos lançamentos estiverem disponíveis, siga [@angular](https://x.com/angular '@angular on X') no X (anteriormente Twitter) ou assine o [blog do Angular](https://blog.angular.dev 'Angular blog').

## Aprendendo sobre novos recursos

O que há de novo? O que mudou? Compartilhamos as coisas mais importantes que você precisa saber no blog do Angular em [anúncios de lançamento](https://blog.angular.dev/ 'Angular blog - release announcements').

Para revisar uma lista completa de mudanças, organizadas por versão, veja o [log de mudanças do Angular](https://github.com/angular/angular/blob/main/CHANGELOG.md 'Angular change log').

## Verificando sua versão do Angular

Para verificar a versão do Angular da sua aplicação, use o comando `ng version` dentro do diretório do seu projeto.

## Encontrando a versão atual do Angular

A versão estável mais recente lançada do Angular aparece [no npm](https://www.npmjs.com/package/@angular/core 'Angular on npm') em "Version." Por exemplo, `16.2.4`.

Você também pode encontrar a versão mais atual do Angular usando o comando da CLI [`ng update`](cli/update).
Por padrão, [`ng update`](cli/update) (sem argumentos adicionais) lista as atualizações que estão disponíveis para você.

## Atualizando seu ambiente e aplicações

Para tornar a atualização descomplicada, fornecemos instruções completas no [Guia de Atualização do Angular](update-guide) interativo.

O Guia de Atualização do Angular fornece instruções de atualização personalizadas, baseadas nas versões atual e de destino que você especificar.
Ele inclui caminhos de atualização básicos e avançados, para corresponder à complexidade de suas aplicações.
Também inclui informações de solução de problemas e quaisquer mudanças manuais recomendadas para ajudá-lo a aproveitar ao máximo o novo lançamento.

Para atualizações simples, o comando da CLI [`ng update`](cli/update) é tudo que você precisa.
Sem argumentos adicionais, [`ng update`](cli/update) lista as atualizações que estão disponíveis para você e fornece etapas recomendadas para atualizar sua aplicação para a versão mais atual.

[Versionamento e Lançamentos do Angular](reference/releases#versioning 'Angular Release Practices, Versioning') descreve o nível de mudança que você pode esperar com base no número de versão de um lançamento.
Também descreve caminhos de atualização suportados.

## Resumo de recursos

- Anúncios de lançamento:
  [Blog do Angular - anúncios sobre lançamentos recentes](https://blog.angular.dev/ 'Angular blog announcements about recent releases')

- Detalhes do lançamento:
  [Log de mudanças do Angular](https://github.com/angular/angular/blob/main/CHANGELOG.md 'Angular change log')

- Instruções de atualização:
  [Guia de Atualização do Angular](update-guide)

- Referência do comando de atualização:
  [Referência do comando `ng update` da CLI Angular](cli/update)

- Práticas de versionamento, lançamento, suporte e descontinuação:
  [Versionamento e lançamentos do Angular](reference/releases 'Angular versioning and releases')
