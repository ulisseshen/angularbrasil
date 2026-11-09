<!-- ia-translate: true -->
# Migrações {#migrations}

Aprenda como você pode migrar seu projeto Angular existente para os recursos mais recentes de forma incremental.

<docs-card-container>
  <docs-card title="Standalone" link="Migrate now" href="reference/migrations/standalone">
    Components standalone fornecem uma maneira simplificada de construir aplicações Angular. Components standalone especificam suas dependências diretamente em vez de obtê-las através de NgModules.
  </docs-card>
  <docs-card title="Sintaxe de Control Flow" link="Migrate now" href="reference/migrations/control-flow">
    A Sintaxe de Control Flow embutida permite que você use uma sintaxe mais ergonômica que é próxima ao JavaScript e tem melhor verificação de tipos. Ela substitui a necessidade de importar o `CommonModule` para usar funcionalidades como `*ngFor`, `*ngIf` e `*ngSwitch`.
  </docs-card>
  <docs-card title="Função inject()" link="Migrate now" href="reference/migrations/inject-function">
    A função [`inject`](/api/core/inject) do Angular oferece tipos mais precisos e melhor compatibilidade com decorators padrão, em comparação com a injeção baseada em constructor.
  </docs-card>
  <docs-card title="Rotas com lazy-loading" link="Migrate now" href="reference/migrations/route-lazy-loading">
    Converta rotas de components carregadas de forma eager para rotas lazy loaded. Isso permite que o processo de build divida os bundles de produção em chunks menores, para carregar menos JavaScript no carregamento inicial da página.
  </docs-card>
  <docs-card title="Nova API `input()`" link="Migrate now" href="reference/migrations/signal-inputs">
    Converta campos `@Input` existentes para a nova API de signal input, que agora está pronta para produção.
  </docs-card>
  <docs-card title="Nova função `output()`" link="Migrate now" href="reference/migrations/outputs">
    Converta eventos customizados `@Output` existentes para a nova função output, que agora está pronta para produção.
  </docs-card>
  <docs-card title="Queries como signal" link="Migrate now" href="reference/migrations/signal-queries">
    Converta campos de query decorados existentes para a API de signal queries aprimorada. A API agora está pronta para produção.
  </docs-card>
  <docs-card title="Limpeza de imports não utilizados" link="Try it now" href="reference/migrations/cleanup-unused-imports">
    Limpe imports não utilizados em seu projeto.
  </docs-card>
  <docs-card title="Tags auto-fechadas" link="Migrate now" href="reference/migrations/self-closing-tags">
    Converta templates de components para usar tags auto-fechadas sempre que possível.
  </docs-card>
  <docs-card title="NgClass para class bindings" link="Migrate now" href="reference/migrations/ngclass-to-class">
      Converta templates de components para preferir class bindings em vez das diretivas `NgClass` sempre que possível.
  </docs-card>
  <docs-card title="NgStyle para style bindings" link="Migrate now" href="reference/migrations/ngstyle-to-style">
      Converta templates de components para preferir style bindings em vez das diretivas `NgStyle` sempre que possível.
  </docs-card>
  <docs-card title="Migração do RouterTestingModule" link="Migrate now" href="reference/migrations/router-testing-module-migration">
    Converta usos do `RouterTestingModule` para `RouterModule` em configurações do TestBed e adicione `provideLocationMocks()` quando apropriado.
  </docs-card>
  <docs-card title="CommonModule para imports standalone" link="Migrate now" href="reference/migrations/common-to-standalone">
    Substitua imports do `CommonModule` por imports das diretivas e pipes individuais usados nos templates sempre que possível.
  </docs-card>
  <docs-card title="Injectable para Service" link="Migrate now" href="reference/migrations/injectable-to-service">
    Converta classes `@Injectable` elegíveis para o decorator `@Service`.
  </docs-card>
</docs-card-container>
