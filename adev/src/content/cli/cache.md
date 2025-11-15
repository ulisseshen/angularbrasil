<!-- ia-translate: true -->
# ng cache

Configure cache de disco persistente e recupere estatísticas de cache.

Angular CLI salva uma série de operações cacheáveis no disco por padrão.

Quando você executa novamente o mesmo build, o sistema de build restaura o estado do build anterior e reutiliza operações executadas anteriormente, o que diminui o tempo necessário para construir e testar suas aplicações e bibliotecas.

Para alterar as configurações padrão de cache, adicione o objeto `cli.cache` à sua [Configuração de Workspace](reference/configs/workspace-config).
O objeto vai em `cli.cache` no nível superior do arquivo, fora das seções `projects`.

```jsonc
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "cli": {
    "cache": {
      // ...
    },
  },
  "projects": {},
}
```

Para mais informações, veja [opções de cache](reference/configs/workspace-config#cache-options).

## Ambientes de cache

Por padrão, o cache de disco é habilitado apenas para ambientes locais. O valor de environment pode ser um dos seguintes:

- `all` - permite cache de disco em todas as máquinas.
- `local` - permite cache de disco apenas em máquinas de desenvolvimento.
- `ci` - permite cache de disco apenas em sistemas de integração contínua (CI).

Para alterar a configuração de ambiente para `all`, execute o seguinte comando:

```bash
ng config cli.cache.environment all
```

Para mais informações, veja `environment` em [opções de cache](reference/configs/workspace-config#cache-options).

<div class="alert is-helpful">

O Angular CLI verifica a presença e o valor da variável de ambiente `CI` para determinar em qual ambiente está sendo executado.

</div>

## Caminho do cache

Por padrão, `.angular/cache` é usado como diretório base para armazenar resultados de cache.

Para alterar este caminho para `.cache/ng`, execute o seguinte comando:

```bash
ng config cli.cache.path ".cache/ng"
```

## Subcomandos

| Subcomando | Descrição |
|:--- |:--- |
| [clean](cli/cache/clean) | Deleta o cache de disco persistente do disco. |
| [disable](cli/cache/disable) | Desabilita o cache de disco persistente para todos os projetos no workspace. |
| [enable](cli/cache/enable) | Habilita o cache de disco para todos os projetos no workspace. |
| [info](cli/cache/info) | Imprime a configuração e estatísticas do cache de disco persistente no console. |
