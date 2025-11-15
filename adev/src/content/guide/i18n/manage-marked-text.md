<!-- ia-translate: true -->
# Gerenciar texto marcado com IDs personalizados

O extrator do Angular gera um arquivo com uma entrada de unidade de tradução para cada uma das seguintes instâncias.

- Cada atributo `i18n` em um template de component
- Cada tagged message string [`$localize`][ApiLocalizeInitLocalize] no código do component

Como descrito em [Como os significados controlam a extração e mesclagem de texto][GuideI18nCommonPrepareHowMeaningsControlTextExtractionAndMerges], o Angular atribui a cada unidade de tradução um ID único.

O exemplo a seguir exibe unidades de tradução com IDs únicos.

<docs-code header="messages.fr.xlf.html" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="generated-id"/>

Quando você muda o texto traduzível, o extrator gera um novo ID para aquela unidade de tradução.
Na maioria dos casos, mudanças no texto fonte também requerem uma mudança na tradução.
Portanto, usar um novo ID mantém a mudança de texto em sincronia com as traduções.

No entanto, alguns sistemas de tradução requerem uma forma ou sintaxe específica para o ID.
Para atender ao requisito, use um ID personalizado para marcar texto.
A maioria dos desenvolvedores não precisa usar um ID personalizado.
Se você quiser usar uma sintaxe única para transmitir metadados adicionais, use um ID personalizado.
Metadados adicionais podem incluir a biblioteca, component ou área da aplicação na qual o texto aparece.

Para especificar um ID personalizado no atributo `i18n` ou tagged message string [`$localize`][ApiLocalizeInitLocalize], use o prefixo `@@`.
O exemplo a seguir define o ID personalizado `introductionHeader` em um elemento de cabeçalho.

<docs-code header="app/app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" visibleRegion="i18n-attribute-solo-id"/>

O exemplo a seguir define o ID personalizado `introductionHeader` para uma variável.

<!--todo: replace with code example -->

<docs-code language="typescript">

variableText1 = $localize`:@@introductionHeader:Hello i18n!`;

</docs-code>

Quando você especifica um ID personalizado, o extrator gera uma unidade de tradução com o ID personalizado.

<docs-code header="messages.fr.xlf.html" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="custom-id"/>

Se você mudar o texto, o extrator não muda o ID.
Como resultado, você não precisa dar o passo extra de atualizar a tradução.
A desvantagem de usar IDs personalizados é que se você mudar o texto, sua tradução pode estar fora de sincronia com o texto fonte recém-alterado.

## Usar um ID personalizado com uma descrição

Use um ID personalizado em combinação com uma descrição e um significado para ajudar ainda mais o tradutor.

O exemplo a seguir inclui uma descrição, seguida pelo ID personalizado.

<docs-code header="app/app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" visibleRegion="i18n-attribute-id"/>

O exemplo a seguir define o ID personalizado `introductionHeader` e descrição para uma variável.

<!--todo: replace with code example -->

<docs-code language="typescript">

variableText2 = $localize`:An introduction header for this sample@@introductionHeader:Hello i18n!`;

</docs-code>

O exemplo a seguir adiciona um significado.

<docs-code header="app/app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" visibleRegion="i18n-attribute-meaning-and-id"/>

O exemplo a seguir define o ID personalizado `introductionHeader` para uma variável.

<!--todo: replace with code example -->

<docs-code language="typescript">

variableText3 = $localize`:site header|An introduction header for this sample@@introductionHeader:Hello i18n!`;

</docs-code>

### Definir IDs personalizados únicos

Certifique-se de definir IDs personalizados que sejam únicos.
Se você usar o mesmo ID para dois elementos de texto diferentes, a ferramenta de extração extrai apenas o primeiro, e o Angular usa a tradução no lugar de ambos os elementos de texto originais.

Por exemplo, no seguinte trecho de código, o mesmo ID personalizado `myId` é definido para dois elementos de texto diferentes.

<docs-code header="app/app.component.html" path="adev/src/content/examples/i18n/doc-files/app.component.html" visibleRegion="i18n-duplicate-custom-id"/>

O seguinte exibe a tradução em francês.

<docs-code header="src/locale/messages.fr.xlf" path="adev/src/content/examples/i18n/doc-files/messages.fr.xlf.html" visibleRegion="i18n-duplicate-custom-id"/>

Ambos os elementos agora usam a mesma tradução \(`Bonjour`\), porque ambos foram definidos com o mesmo ID personalizado.

<docs-code path="adev/src/content/examples/i18n/doc-files/rendered-output.html"/>

[ApiLocalizeInitLocalize]: api/localize/init/$localize '$localize | init - localize - API | Angular'
[GuideI18nCommonPrepareHowMeaningsControlTextExtractionAndMerges]: guide/i18n/prepare#h1-example 'How meanings control text extraction and merges - Prepare components for translations | Angular'
