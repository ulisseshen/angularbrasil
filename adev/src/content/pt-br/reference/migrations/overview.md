<!-- ia-translate: true -->
# Migrações

Aprenda como você pode migrar seu projeto Angular existente para os recursos mais recentes de forma incremental.

<docs-card-container>
  <docs-card title="Standalone" link="Migrar agora" href="reference/migrations/standalone">
    Standalone components fornecem uma maneira simplificada de construir aplicações Angular. Standalone components especificam suas dependências diretamente, em vez de obtê-las por meio de NgModules.
  </docs-card>
  <docs-card title="Sintaxe de Control Flow" link="Migrar agora" href="reference/migrations/control-flow">
    A sintaxe de Control Flow integrada permite que você use uma sintaxe mais ergonômica, próxima ao JavaScript e com melhor verificação de tipos. Ela substitui a necessidade de importar o `CommonModule` para usar funcionalidades como `*ngFor`, `*ngIf` e `*ngSwitch`.
  </docs-card>
  <docs-card title="Função inject()" link="Migrar agora" href="reference/migrations/inject-function">
    A função `inject` do Angular oferece tipos mais precisos e melhor compatibilidade com decorators padrão, em comparação com injeção baseada em construtor.
  </docs-card>
  <docs-card title="Lazy-loaded routes" link="Migrar agora" href="reference/migrations/route-lazy-loading">
    Converta routes de component carregadas ansiosamente para carregamento lazy. Isso permite que o processo de build divida os bundles de produção em chunks menores, para carregar menos JavaScript no carregamento inicial da página.
  </docs-card>
  <docs-card title="Nova API input()" link="Migrar agora" href="reference/migrations/signal-inputs">
    Converta campos `@Input` existentes para a nova API de signal input que agora está pronta para produção.
  </docs-card>
  <docs-card title="Nova função output()" link="Migrar agora" href="reference/migrations/outputs">
    Converta eventos customizados `@Output` existentes para a nova função output que agora está pronta para produção.
  </docs-card>
  <docs-card title="Queries como signal" link="Migrar agora" href="reference/migrations/signal-queries">
    Converta campos de query com decorator existentes para a API de signal queries aprimorada. A API agora está pronta para produção.
  </docs-card>
  <docs-card title="Limpar imports não utilizados" link="Experimentar agora" href="reference/migrations/cleanup-unused-imports">
    Limpe imports não utilizados no seu projeto.
  </docs-card>
  <docs-card title="Tags de auto-fechamento" link="Migrar agora" href="reference/migrations/self-closing-tags">
    Converta templates de component para usar tags de auto-fechamento quando possível.
  </docs-card>
  <docs-card title="NgClass para Class Bindings" link="Migrar agora" href="reference/migrations/ngclass-to-class">
      Converta templates de component para preferir class bindings em vez de diretivas `NgClass` quando possível.
  </docs-card>
  <docs-card title="NgStyle para Style Bindings" link="Migrar agora" href="reference/migrations/ngstyle-to-style">
      Converta templates de component para preferir style bindings em vez de diretivas `NgStyle` quando possível.
  </docs-card>
  <docs-card title="Migração do RouterTestingModule" link="Migrar agora" href="reference/migrations/router-testing-module-migration">
    Converta usos de `RouterTestingModule` para `RouterModule` em configurações TestBed e adicione `provideLocationMocks()` quando apropriado.
  </docs-card>
  <docs-card title="CommonModule para imports standalone" link="Migrar agora" href="reference/migrations/common-to-standalone">
    Substitua imports do `CommonModule` por imports de diretivas e pipes individuais usados nos templates quando possível.
  </docs-card>
</docs-card-container>
