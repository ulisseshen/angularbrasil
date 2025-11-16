<!-- ia-translate: true -->

# Diagnósticos Estendidos

Existem muitos padrões de codificação que são tecnicamente válidos para o compilador ou runtime, mas que podem ter nuances ou ressalvas complexas.
Esses padrões podem não ter o efeito pretendido esperado por um desenvolvedor, o que frequentemente leva a bugs.
O compilador Angular inclui "diagnósticos estendidos" que identificam muitos desses padrões, a fim de alertar desenvolvedores sobre problemas potenciais e impor boas práticas comuns dentro de uma base de código.

## Diagnósticos {#diagnostics}

Atualmente, o Angular suporta os seguintes diagnósticos estendidos:

| Código   | Nome                                                                  |
| :------- | :-------------------------------------------------------------------- |
| `NG8101` | [`invalidBananaInBox`](extended-diagnostics/NG8101)                   |
| `NG8102` | [`nullishCoalescingNotNullable`](extended-diagnostics/NG8102)         |
| `NG8103` | [`missingControlFlowDirective`](extended-diagnostics/NG8103)          |
| `NG8104` | [`textAttributeNotBinding`](extended-diagnostics/NG8104)              |
| `NG8105` | [`missingNgForOfLet`](extended-diagnostics/NG8105)                    |
| `NG8106` | [`suffixNotSupported`](extended-diagnostics/NG8106)                   |
| `NG8107` | [`optionalChainNotNullable`](extended-diagnostics/NG8107)             |
| `NG8108` | [`skipHydrationNotStatic`](extended-diagnostics/NG8108)               |
| `NG8109` | [`interpolatedSignalNotInvoked`](extended-diagnostics/NG8109)         |
| `NG8111` | [`uninvokedFunctionInEventBinding`](extended-diagnostics/NG8111)      |
| `NG8113` | [`unusedStandaloneImports`](extended-diagnostics/NG8113)              |
| `NG8114` | [`unparenthesizedNullishCoalescing`](extended-diagnostics/NG8114)     |
| `NG8115` | [`uninvokedTrackFunction`](extended-diagnostics/NG8115)               |
| `NG8116` | [`missingStructuralDirective`](extended-diagnostics/NG8116)           |
| `NG8117` | [`uninvokedFunctionInTextInterpolation`](extended-diagnostics/NG8117) |
| `NG8021` | [`deferTriggerMisconfiguration`](extended-diagnostics/NG8021)         |

## Configuração {#configuration}

Diagnósticos estendidos são avisos por padrão e não bloqueiam a compilação.
Cada diagnóstico pode ser configurado como:

| Categoria de erro | Efeito                                                                                                                                                                     |
| :---------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `warning`         | Padrão - O compilador emite o diagnóstico como um aviso mas não bloqueia a compilação. O compilador ainda existirá com código de status 0, mesmo se avisos forem emitidos. |
| `error`           | O compilador emite o diagnóstico como um erro e falha a compilação. O compilador sairá com um código de status diferente de zero se um ou mais erros forem emitidos.       |
| `suppress`        | O compilador _não_ emite o diagnóstico de forma alguma.                                                                                                                    |

A severidade da verificação pode ser configurada como uma [opção do compilador Angular](reference/configs/angular-compiler-options):

<docs-code language="json">
{
  "angularCompilerOptions": {
    "extendedDiagnostics": {
      // As categorias a usar para diagnósticos específicos.
      "checks": {
        // Mapeia nome da verificação para sua categoria.
        "invalidBananaInBox": "suppress"
      },

      // A categoria a usar para quaisquer diagnósticos não listados em `checks` acima.
      "defaultCategory": "error"
    }

}
}
</docs-code>

O campo `checks` mapeia o nome de diagnósticos individuais para sua categoria associada.
Veja [Diagnósticos](#diagnostics) para uma lista completa de diagnósticos estendidos e o nome a usar para configurá-los.

O campo `defaultCategory` é usado para quaisquer diagnósticos que não estejam explicitamente listados em `checks`.
Se não definido, tais diagnósticos serão tratados como `warning`.

Diagnósticos estendidos serão emitidos quando [`strictTemplates`](tools/cli/template-typecheck#strict-mode) estiver habilitado.
Isso é necessário para permitir que o compilador entenda melhor os tipos de template do Angular e forneça diagnósticos precisos e significativos.

## Versionamento Semântico

O time do Angular pretende adicionar ou habilitar novos diagnósticos estendidos em versões **minor** do Angular (veja [semver](https://docs.npmjs.com/about-semantic-versioning)).
Isso significa que atualizar o Angular pode mostrar novos avisos em sua base de código existente.
Isso permite que o time entregue funcionalidades mais rapidamente e torne os diagnósticos estendidos mais acessíveis aos desenvolvedores.

No entanto, definir `"defaultCategory": "error"` promoverá tais avisos a erros graves.
Isso pode fazer com que uma atualização de versão minor introduza erros de compilação, o que pode ser visto como uma breaking change não compatível com semver.
Quaisquer novos diagnósticos podem ser suprimidos ou rebaixados para avisos através da [configuração](#configuration) acima, então o impacto de um novo diagnóstico deve ser mínimo para projetos que tratam diagnósticos estendidos como erros por padrão.
Definir error como padrão é uma ferramenta muito poderosa; apenas esteja ciente desta ressalva de semver ao decidir se `error` é o padrão certo para seu projeto.

## Novos Diagnósticos

O time do Angular está sempre aberto a sugestões sobre novos diagnósticos que poderiam ser adicionados.
Diagnósticos estendidos geralmente devem:

- Detectar um erro comum e não óbvio de desenvolvedor com templates do Angular
- Articular claramente por que esse padrão pode levar a bugs ou comportamento não intencional
- Sugerir uma ou mais soluções claras
- Ter uma taxa baixa, preferencialmente zero, de falsos positivos
- Aplicar à grande maioria das aplicações Angular (não específico a uma biblioteca não oficial)
- Melhorar a correção ou performance do programa (não estilo, essa responsabilidade cabe a um linter)

Se você tem uma ideia para um diagnóstico estendido que se encaixa nesses critérios, considere registrar uma [solicitação de funcionalidade](https://github.com/angular/angular/issues/new?template=2-feature-request.yaml).
