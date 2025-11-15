<!-- ia-translate: true -->
# Gerenciar texto marcado com IDs customizados

O extrator do Angular gera um arquivo com uma entrada de translation unit para cada uma das seguintes instâncias.

- Cada atributo `i18n` em um template de component
- Cada string de mensagem marcada com [`$localize`][ApiLocalizeInitLocalize] no código do component

Como descrito em [How meanings control text extraction and merges][GuideI18nCommonPrepareHowMeaningsControlTextExtractionAndMerges], o Angular atribui a cada translation unit um ID único.

O exemplo a seguir exibe translation units com IDs únicos.

<docs-code header="messages.fr.xlf.html" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="generated-id"/>

Quando você altera o texto traduzível, o extrator gera um novo ID para aquela translation unit.
Na maioria dos casos, mudanças no texto fonte também exigem uma mudança na tradução.
Portanto, usar um novo ID mantém a mudança de texto sincronizada com as traduções.

No entanto, alguns sistemas de tradução exigem uma forma ou sintaxe específica para o ID.
Para atender a esse requisito, use um ID customizado para marcar o texto.
A maioria dos desenvolvedores não precisa usar um ID customizado.
Se você deseja usar uma sintaxe única para transmitir metadados adicionais, use um ID customizado.
Metadados adicionais podem incluir a biblioteca, component ou área da aplicação na qual o texto aparece.

Para especificar um ID customizado no atributo `i18n` ou string de mensagem marcada com [`$localize`][ApiLocalizeInitLocalize], use o prefixo `@@`.
O exemplo a seguir define o ID customizado `introductionHeader` em um elemento de cabeçalho.

<docs-code header="app/app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" visibleRegion="i18n-attribute-solo-id"/>

O exemplo a seguir define o ID customizado `introductionHeader` para uma variável.

<!--todo: replace with code example -->

<docs-code language="typescript">

variableText1 = $localize`:@@introductionHeader:Hello i18n!`;

</docs-code>

Quando você especifica um ID customizado, o extrator gera uma translation unit com o ID customizado.

<docs-code header="messages.fr.xlf.html" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="custom-id"/>

Se você alterar o texto, o extrator não altera o ID.
Como resultado, você não precisa seguir o passo extra de atualizar a tradução.
A desvantagem de usar IDs customizados é que se você alterar o texto, sua tradução pode ficar fora de sincronia com o texto fonte recém-alterado.

## Use um ID customizado com uma descrição

Use um ID customizado em combinação com uma descrição e um significado para ajudar ainda mais o tradutor.

O exemplo a seguir inclui uma descrição, seguida pelo ID customizado.

<docs-code header="app/app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" visibleRegion="i18n-attribute-id"/>

O exemplo a seguir define o ID customizado `introductionHeader` e uma descrição para uma variável.

<!--todo: replace with code example -->

<docs-code language="typescript">

variableText2 = $localize`:An introduction header for this sample@@introductionHeader:Hello i18n!`;

</docs-code>

O exemplo a seguir adiciona um significado.

<docs-code header="app/app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" visibleRegion="i18n-attribute-meaning-and-id"/>

O exemplo a seguir define o ID customizado `introductionHeader` para uma variável.

<!--todo: replace with code example -->

<docs-code language="typescript">

variableText3 = $localize`:site header|An introduction header for this sample@@introductionHeader:Hello i18n!`;

</docs-code>

### Defina IDs customizados únicos

Certifique-se de definir IDs customizados que sejam únicos.
Se você usar o mesmo ID para dois elementos de texto diferentes, a ferramenta de extração extrai apenas o primeiro, e o Angular usa a tradução no lugar de ambos os elementos de texto originais.

Por exemplo, no trecho de código a seguir, o mesmo ID customizado `myId` é definido para dois elementos de texto diferentes.

<docs-code header="app/app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" visibleRegion="i18n-duplicate-custom-id"/>

O exemplo a seguir exibe a tradução em francês.

<docs-code header="src/locale/messages.fr.xlf" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="i18n-duplicate-custom-id"/>

Ambos os elementos agora usam a mesma tradução \(`Bonjour`\), porque ambos foram definidos com o mesmo ID customizado.

<docs-code path="adev/src/content/examples/i18n/doc-files/rendered-output.html"/>

[ApiLocalizeInitLocalize]: api/localize/init/$localize '$localize | init - localize - API | Angular'
[GuideI18nCommonPrepareHowMeaningsControlTextExtractionAndMerges]: guide/i18n/prepare#h1-example 'How meanings control text extraction and merges - Prepare components for translations | Angular'
