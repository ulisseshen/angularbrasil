// ia-translate: true
/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

import {isDevMode} from '@angular/core';
import type {NavigationItem} from '@angular/docs';
// These imports are expected to be red because they are generated a build time
// @ts-ignore
import ERRORS_NAV_DATA from '../../../content/reference/errors/routes.json' with {type: 'json'};
// @ts-ignore
import EXT_DIAGNOSTICS_NAV_DATA from '../../../content/reference/extended-diagnostics/routes.json' with {type: 'json'};
// @ts-ignore
import FIRST_APP_TUTORIAL_NAV_DATA from '../../../content/tutorials/first-app/first-app/routes.json' with {type: 'json'};
// @ts-ignore
import LEARN_ANGULAR_TUTORIAL_NAV_DATA from '../../../content/tutorials/learn-angular/learn-angular/routes.json' with {type: 'json'};
// @ts-ignore
import DEFERRABLE_VIEWS_TUTORIAL_NAV_DATA from '../../../content/tutorials/deferrable-views/deferrable-views/routes.json' with {type: 'json'};
// @ts-ignore
import SIGNALS_TUTORIAL_NAV_DATA from '../../../content/tutorials/signals/signals/routes.json' with {type: 'json'};
// @ts-ignore
import SIGNAL_FORMS_TUTORIAL_NAV_DATA from '../../../content/tutorials/signal-forms/signal-forms/routes.json' with {type: 'json'};
// @ts-ignore
import API_MANIFEST_JSON from '../../../assets/manifest.json' with {type: 'json'};

export const DOCS_SUB_NAVIGATION_DATA: NavigationItem[] = [
  {
    label: 'Introdução',
    children: [
      {
        label: 'O que é o Angular?',
        path: 'overview',
        contentPath: 'introduction/what-is-angular',
      },
      {
        label: 'Instalação',
        path: 'installation',
        contentPath: 'introduction/installation',
      },
      {
        label: 'Essenciais',
        children: [
          {
            label: 'Visão Geral',
            path: 'essentials',
            contentPath: 'introduction/essentials/overview',
          },
          {
            label: 'Composição com components',
            path: 'essentials/components',
            contentPath: 'introduction/essentials/components',
          },
          {
            label: 'Reatividade com signals',
            path: 'essentials/signals',
            contentPath: 'introduction/essentials/signals',
          },
          {
            label: 'Interfaces dinâmicas com templates',
            path: 'essentials/templates',
            contentPath: 'introduction/essentials/templates',
          },
          {
            label: 'Forms com signals',
            path: 'essentials/signal-forms',
            contentPath: 'introduction/essentials/signal-forms',
            status: 'new',
          },
          {
            label: 'Design modular com dependency injection',
            path: 'essentials/dependency-injection',
            contentPath: 'introduction/essentials/dependency-injection',
          },
          {
            label: 'Próximos Passos',
            path: 'essentials/next-steps',
            contentPath: 'introduction/essentials/next-steps',
          },
        ],
      },
      {
        label: 'Comece a programar! 🚀',
        path: 'tutorials/learn-angular',
      },
    ],
  },
  {
    label: 'Guias Detalhados',
    children: [
      {
        label: 'Signals',
        status: 'updated',
        children: [
          {
            label: 'Visão Geral',
            path: 'guide/signals',
            contentPath: 'guide/signals/overview',
          },
          {
            label: 'Estado dependente com linkedSignal',
            path: 'guide/signals/linked-signal',
            contentPath: 'guide/signals/linked-signal',
          },
          {
            label: 'Reatividade assíncrona com resources',
            path: 'guide/signals/resource',
            contentPath: 'guide/signals/resource',
          },
          {
            label: 'Signals com debounce',
            path: 'guide/signals/debounced',
            contentPath: 'guide/signals/debounced',
            status: 'new',
          },
          {
            label: 'Efeitos colaterais para APIs não reativas',
            path: 'guide/signals/effect',
            contentPath: 'guide/signals/effect',
            status: 'new',
          },
        ],
      },
      {
        label: 'Components',
        children: [
          {
            label: 'Anatomia dos components',
            path: 'guide/components',
            contentPath: 'guide/components/anatomy-of-components',
          },
          {
            label: 'Selectors',
            path: 'guide/components/selectors',
            contentPath: 'guide/components/selectors',
          },
          {
            label: 'Estilização',
            path: 'guide/components/styling',
            contentPath: 'guide/components/styling',
          },
          {
            label: 'Recebendo dados com input properties',
            path: 'guide/components/inputs',
            contentPath: 'guide/components/inputs',
          },
          {
            label: 'Eventos customizados com outputs',
            path: 'guide/components/outputs',
            contentPath: 'guide/components/outputs',
          },
          {
            label: 'Projeção de conteúdo com ng-content',
            path: 'guide/components/content-projection',
            contentPath: 'guide/components/content-projection',
          },
          {
            label: 'Elementos host',
            path: 'guide/components/host-elements',
            contentPath: 'guide/components/host-elements',
          },
          {
            label: 'Lifecycle',
            path: 'guide/components/lifecycle',
            contentPath: 'guide/components/lifecycle',
          },
          {
            label: 'Referenciando filhos do component com queries',
            path: 'guide/components/queries',
            contentPath: 'guide/components/queries',
          },
          {
            label: 'Usando DOM APIs',
            path: 'guide/components/dom-apis',
            contentPath: 'guide/components/dom-apis',
          },
          {
            label: 'Herança',
            path: 'guide/components/inheritance',
            contentPath: 'guide/components/inheritance',
          },
          {
            label: 'Renderizando components programaticamente',
            path: 'guide/components/programmatic-rendering',
            contentPath: 'guide/components/programmatic-rendering',
          },
          {
            label: 'Configuração avançada',
            path: 'guide/components/advanced-configuration',
            contentPath: 'guide/components/advanced-configuration',
          },
          {
            label: 'Custom Elements',
            path: 'guide/elements',
            contentPath: 'guide/elements',
          },
        ],
      },
      {
        label: 'Templates',
        children: [
          {
            label: 'Visão Geral',
            path: 'guide/templates',
            contentPath: 'guide/templates/overview',
          },
          {
            label: 'Binding de texto, properties e attributes dinâmicos',
            path: 'guide/templates/binding',
            contentPath: 'guide/templates/binding',
          },
          {
            label: 'Adicionando event listeners',
            path: 'guide/templates/event-listeners',
            contentPath: 'guide/templates/event-listeners',
          },
          {
            label: 'Two-way binding',
            path: 'guide/templates/two-way-binding',
            contentPath: 'guide/templates/two-way-binding',
          },
          {
            label: 'Fluxo de controle',
            path: 'guide/templates/control-flow',
            contentPath: 'guide/templates/control-flow',
          },
          {
            label: 'Pipes',
            path: 'guide/templates/pipes',
            contentPath: 'guide/templates/pipes',
          },
          {
            label: 'Encaixando conteúdo filho com ng-content',
            path: 'guide/templates/ng-content',
            contentPath: 'guide/templates/ng-content',
          },
          {
            label: 'Criando fragmentos de template com ng-template',
            path: 'guide/templates/ng-template',
            contentPath: 'guide/templates/ng-template',
          },
          {
            label: 'Agrupando elementos com ng-container',
            path: 'guide/templates/ng-container',
            contentPath: 'guide/templates/ng-container',
          },
          {
            label: 'Variáveis em templates',
            path: 'guide/templates/variables',
            contentPath: 'guide/templates/variables',
          },
          {
            label: 'Carregamento diferido com @defer',
            path: 'guide/templates/defer',
            contentPath: 'guide/templates/defer',
          },
          {
            label: 'Limites de erro com @boundary',
            path: 'guide/templates/error-boundaries',
            contentPath: 'guide/templates/error-boundaries',
            status: 'new',
          },
          {
            label: 'Sintaxe de expressões',
            path: 'guide/templates/expression-syntax',
            contentPath: 'guide/templates/expression-syntax',
          },
          {
            label: 'Espaços em branco em templates',
            path: 'guide/templates/whitespace',
            contentPath: 'guide/templates/whitespace',
          },
        ],
      },
      {
        label: 'Directives',
        children: [
          {
            label: 'Visão Geral',
            path: 'guide/directives',
            contentPath: 'guide/directives/overview',
          },
          {
            label: 'Attribute directives',
            path: 'guide/directives/attribute-directives',
            contentPath: 'guide/directives/attribute-directives',
          },
          {
            label: 'Structural directives',
            path: 'guide/directives/structural-directives',
            contentPath: 'guide/directives/structural-directives',
          },
          {
            label: 'Directive composition API',
            path: 'guide/directives/directive-composition-api',
            contentPath: 'guide/directives/directive-composition-api',
          },
          {
            label: 'Otimizando imagens com NgOptimizedImage',
            path: 'guide/image-optimization',
            contentPath: 'guide/image-optimization',
          },
        ],
      },
      {
        label: 'Dependency Injection',
        status: 'updated',
        children: [
          {
            label: 'Visão Geral',
            path: 'guide/di',
            contentPath: 'guide/di/overview',
          },
          {
            label: 'Criando e usando services',
            path: 'guide/di/creating-and-using-services',
            contentPath: 'guide/di/creating-and-using-services',
          },
          {
            label: 'Lazy loading de services',
            path: 'guide/di/lazy-loading-services',
            contentPath: 'guide/di/lazy-loading-services',
            status: 'new',
          },
          {
            label: 'Definindo dependency providers',
            path: 'guide/di/defining-dependency-providers',
            contentPath: 'guide/di/defining-dependency-providers',
          },
          {
            label: 'Contexto de injeção',
            path: 'guide/di/dependency-injection-context',
            contentPath: 'guide/di/dependency-injection-context',
          },
          {
            label: 'Injectors hierárquicos',
            path: 'guide/di/hierarchical-dependency-injection',
            contentPath: 'guide/di/hierarchical-dependency-injection',
          },
          {
            label: 'Otimizando injection tokens',
            path: 'guide/di/lightweight-injection-tokens',
            contentPath: 'guide/di/lightweight-injection-tokens',
          },
          {
            label: 'DI em ação',
            path: 'guide/di/di-in-action',
            contentPath: 'guide/di/di-in-action',
          },
          {
            label: 'Depuração e solução de problemas de DI',
            path: 'guide/di/debugging-and-troubleshooting-di',
            contentPath: 'guide/di/debugging-and-troubleshooting-di',
            status: 'new',
          },
        ],
      },
      {
        label: 'Routing',
        children: [
          {
            label: 'Visão Geral',
            path: 'guide/routing',
            contentPath: 'guide/routing/overview',
          },
          {
            label: 'Definindo routes',
            path: 'guide/routing/define-routes',
            contentPath: 'guide/routing/define-routes',
          },
          {
            label: 'Estratégias de carregamento de routes',
            path: 'guide/routing/loading-strategies',
            contentPath: 'guide/routing/loading-strategies',
          },
          {
            label: 'Exibindo routes com Outlets',
            path: 'guide/routing/show-routes-with-outlets',
            contentPath: 'guide/routing/show-routes-with-outlets',
          },
          {
            label: 'Navegando para routes',
            path: 'guide/routing/navigate-to-routes',
            contentPath: 'guide/routing/navigate-to-routes',
          },
          {
            label: 'Lendo o estado de routes',
            path: 'guide/routing/read-route-state',
            contentPath: 'guide/routing/read-route-state',
          },
          {
            label: 'Redirecionando routes',
            path: 'guide/routing/redirecting-routes',
            contentPath: 'guide/routing/redirecting-routes',
          },
          {
            label: 'Controlando acesso a routes com guards',
            path: 'guide/routing/route-guards',
            contentPath: 'guide/routing/route-guards',
          },
          {
            label: 'Route data resolvers',
            path: 'guide/routing/data-resolvers',
            contentPath: 'guide/routing/data-resolvers',
          },
          {
            label: 'Busca de dados com resources',
            path: 'guide/routing/data-fetching-with-resources',
            contentPath: 'guide/routing/data-fetching-with-resources',
            status: 'new',
          },
          {
            label: 'Lifecycle e eventos',
            path: 'guide/routing/lifecycle-and-events',
            contentPath: 'guide/routing/lifecycle-and-events',
          },
          {
            label: 'Testando routing e navegação',
            path: 'guide/routing/testing',
            contentPath: 'guide/routing/testing',
          },
          {
            label: 'Outras tarefas de routing',
            path: 'guide/routing/common-router-tasks',
            contentPath: 'guide/routing/common-router-tasks',
          },
          {
            label: 'Criando correspondências de route customizadas',
            path: 'guide/routing/routing-with-urlmatcher',
            contentPath: 'guide/routing/routing-with-urlmatcher',
          },
          {
            label: 'Estratégias de renderização',
            path: 'guide/routing/rendering-strategies',
            contentPath: 'guide/routing/rendering-strategies',
          },
          {
            label: 'Customizando comportamento de route',
            path: 'guide/routing/customizing-route-behavior',
            contentPath: 'guide/routing/customizing-route-behavior',
          },
          {
            label: 'Referência de Router',
            path: 'guide/routing/router-reference',
            contentPath: 'guide/routing/router-reference',
          },
          {
            label: 'Animações de transição de route',
            path: 'guide/routing/route-transition-animations',
            contentPath: 'guide/routing/route-transition-animations',
          },
        ],
      },
      {
        label: 'Forms',
        status: 'updated',
        preserveOtherCategoryOrder: true,
        categoriesStatus: [
          {
            'Signal Forms': 'new',
          },
        ],
        children: [
          {
            label: 'Visão Geral',
            path: 'guide/forms',
            contentPath: 'guide/forms/overview',
          },

          {
            label: 'Visão Geral',
            path: 'guide/forms/signals/overview',
            contentPath: 'guide/forms/signals/overview',
            category: 'Signal Forms',
          },
          {
            label: 'Modelos de form',
            path: 'guide/forms/signals/models',
            contentPath: 'guide/forms/signals/models',
            category: 'Signal Forms',
          },
          {
            label: 'Design de modelos de form',
            path: 'guide/forms/signals/model-design',
            contentPath: 'guide/forms/signals/designing-your-form-model',
            category: 'Signal Forms',
          },
          {
            label: 'Gerenciamento de estado de campos',
            path: 'guide/forms/signals/field-state-management',
            contentPath: 'guide/forms/signals/field-state-management',
            category: 'Signal Forms',
          },
          {
            label: 'Validação',
            path: 'guide/forms/signals/validation',
            contentPath: 'guide/forms/signals/validation',
            category: 'Signal Forms',
          },
          {
            label: 'Lógica de form',
            path: 'guide/forms/signals/form-logic',
            contentPath: 'guide/forms/signals/form-logic',
            category: 'Signal Forms',
          },
          {
            label: 'Lógica entre campos',
            path: 'guide/forms/signals/cross-field-logic',
            contentPath: 'guide/forms/signals/cross-field-logic',
            category: 'Signal Forms',
          },
          {
            label: 'Envio de form',
            path: 'guide/forms/signals/form-submission',
            contentPath: 'guide/forms/signals/form-submission',
            category: 'Signal Forms',
          },
          {
            label: 'Schemas',
            path: 'guide/forms/signals/schemas',
            contentPath: 'guide/forms/signals/schemas',
            category: 'Signal Forms',
          },
          {
            label: 'Metadados de campo',
            path: 'guide/forms/signals/field-metadata',
            contentPath: 'guide/forms/signals/field-metadata',
            category: 'Signal Forms',
          },
          {
            label: 'Operações assíncronas',
            path: 'guide/forms/signals/async-operations',
            contentPath: 'guide/forms/signals/async-operations',
            category: 'Signal Forms',
          },
          {
            label: 'Forms dinâmicos com JSON',
            path: 'guide/forms/signals/dynamic-forms-with-json',
            contentPath: 'guide/forms/signals/dynamic-forms-with-json',
            category: 'Signal Forms',
          },
          {
            label: 'Controles customizados',
            path: 'guide/forms/signals/custom-controls',
            contentPath: 'guide/forms/signals/custom-controls',
            category: 'Signal Forms',
          },
          {
            label: 'Testing',
            path: 'guide/forms/signals/testing',
            contentPath: 'guide/forms/signals/testing',
            category: 'Signal Forms',
          },
          {
            label: 'Comparação com outros sistemas de forms',
            path: 'guide/forms/signals/comparison',
            contentPath: 'guide/forms/signals/comparison',
            category: 'Signal Forms',
          },
          {
            label: 'Migrando de Reactive Forms',
            path: 'guide/forms/signals/migration',
            contentPath: 'guide/forms/signals/migration',
            category: 'Signal Forms',
          },
          {
            label: 'Reactive forms',
            path: 'guide/forms/reactive-forms',
            contentPath: 'guide/forms/reactive-forms',
            category: 'Reactive Forms',
          },
          {
            label: 'Reactive forms com tipagem estrita',
            path: 'guide/forms/typed-forms',
            contentPath: 'guide/forms/typed-forms',
            category: 'Reactive Forms',
          },
          {
            label: 'Template-driven forms',
            path: 'guide/forms/template-driven-forms',
            contentPath: 'guide/forms/template-driven-forms',
            category: 'Template driven Forms',
          },
          {
            label: 'Validando entrada de form',
            path: 'guide/forms/form-validation',
            contentPath: 'guide/forms/form-validation',
            category: 'Reactive Forms',
          },
          {
            label: 'Validando entrada de form',
            path: 'guide/forms/form-validation',
            contentPath: 'guide/forms/form-validation',
            category: 'Template driven Forms',
          },
          {
            label: 'Construindo forms dinâmicos',
            path: 'guide/forms/dynamic-forms',
            contentPath: 'guide/forms/dynamic-forms',
            category: 'Reactive Forms',
          },
        ],
      },
      {
        label: 'HTTP Client',
        children: [
          {
            label: 'Visão Geral',
            path: 'guide/http',
            contentPath: 'guide/http/overview',
          },
          {
            label: 'Configurando HttpClient',
            path: 'guide/http/setup',
            contentPath: 'guide/http/setup',
          },
          {
            label: 'Fazendo requisições',
            path: 'guide/http/making-requests',
            contentPath: 'guide/http/making-requests',
          },
          {
            label: 'Busca reativa de dados com httpResource',
            path: 'guide/http/http-resource',
            contentPath: 'guide/http/http-resource',
          },
          {
            label: 'Interceptando requisições e respostas',
            path: 'guide/http/interceptors',
            contentPath: 'guide/http/interceptors',
          },
          {
            label: 'Testing',
            path: 'guide/http/testing',
            contentPath: 'guide/http/testing',
          },
        ],
      },
      {
        label: 'Renderização server-side e híbrida',
        children: [
          {
            label: 'Visão Geral',
            path: 'guide/performance',
            contentPath: 'guide/performance/overview',
          },
          {
            label: 'Renderização server-side e híbrida',
            path: 'guide/ssr',
            contentPath: 'guide/ssr',
          },
          {
            label: 'Hydration',
            path: 'guide/hydration',
            contentPath: 'guide/hydration',
          },
          {
            label: 'Incremental Hydration',
            path: 'guide/incremental-hydration',
            contentPath: 'guide/incremental-hydration',
          },
        ],
      },
      {
        label: 'Testing',
        children: [
          {
            label: 'Visão Geral',
            path: 'guide/testing',
            contentPath: 'guide/testing/overview',
          },
          {
            label: 'Fundamentos de testing de components',
            path: 'guide/testing/components-basics',
            contentPath: 'guide/testing/components-basics',
          },
          {
            label: 'Cenários de testing de components',
            path: 'guide/testing/components-scenarios',
            contentPath: 'guide/testing/components-scenarios',
          },
          {
            label: 'Testando services',
            path: 'guide/testing/services',
            contentPath: 'guide/testing/services',
          },
          {
            label: 'Testando attribute directives',
            path: 'guide/testing/attribute-directives',
            contentPath: 'guide/testing/attribute-directives',
          },
          {
            label: 'Testando pipes',
            path: 'guide/testing/pipes',
            contentPath: 'guide/testing/pipes',
          },
          {
            label: 'Testando routing e navegação',
            path: 'guide/routing/testing',
            contentPath: 'guide/routing/testing',
            status: 'new',
            isCrossReferenced: true,
          },
          {
            label: 'Depurando testes',
            path: 'guide/testing/debugging',
            contentPath: 'guide/testing/debugging',
          },
          {
            label: 'Cobertura de código',
            path: 'guide/testing/code-coverage',
            contentPath: 'guide/testing/code-coverage',
          },
          {
            label: 'APIs utilitárias de testing',
            path: 'guide/testing/utility-apis',
            contentPath: 'guide/testing/utility-apis',
          },
          {
            label: 'Visão geral de component harnesses',
            path: 'guide/testing/component-harnesses-overview',
            contentPath: 'guide/testing/component-harnesses-overview',
          },
          {
            label: 'Usando component harnesses em testes',
            path: 'guide/testing/using-component-harnesses',
            contentPath: 'guide/testing/using-component-harnesses',
          },
          {
            label: 'Criando harnesses para seus components',
            path: 'guide/testing/creating-component-harnesses',
            contentPath: 'guide/testing/creating-component-harnesses',
          },
          {
            label: 'Adicionando suporte a harness para ambientes de testing adicionais',
            path: 'guide/testing/component-harnesses-testing-environments',
            contentPath: 'guide/testing/component-harnesses-testing-environments',
          },
          {
            label: 'Migrando de Karma para Vitest',
            path: 'guide/testing/migrating-to-vitest',
            contentPath: 'guide/testing/migrating-to-vitest',
          },
          {
            label: 'Testing com Karma e Jasmine',
            path: 'guide/testing/karma',
            contentPath: 'guide/testing/karma',
          },
          {
            label: 'Utilitários de testing do Zone.js',
            path: 'guide/testing/zone-js-testing-utilities',
            contentPath: 'guide/testing/zone-js-testing-utilities',
          },
        ],
      },
      {
        label: 'Angular Aria',
        status: 'new',
        children: [
          {
            label: 'Visão Geral',
            path: 'guide/aria/overview',
            contentPath: 'guide/aria/overview',
          },
          {
            label: 'Accordion',
            path: 'guide/aria/accordion',
            contentPath: 'guide/aria/accordion',
          },
          {
            label: 'Autocomplete',
            path: 'guide/aria/autocomplete',
            contentPath: 'guide/aria/autocomplete',
          },
          {
            label: 'Combobox',
            path: 'guide/aria/combobox',
            contentPath: 'guide/aria/combobox',
          },
          {
            label: 'Grid',
            path: 'guide/aria/grid',
            contentPath: 'guide/aria/grid',
          },
          {
            label: 'Listbox',
            path: 'guide/aria/listbox',
            contentPath: 'guide/aria/listbox',
          },
          {
            label: 'Menu',
            path: 'guide/aria/menu',
            contentPath: 'guide/aria/menu',
          },
          {
            label: 'Menubar',
            path: 'guide/aria/menubar',
            contentPath: 'guide/aria/menubar',
          },
          {
            label: 'Multiselect',
            path: 'guide/aria/multiselect',
            contentPath: 'guide/aria/multiselect',
          },
          {
            label: 'Select',
            path: 'guide/aria/select',
            contentPath: 'guide/aria/select',
          },
          {
            label: 'Tabs',
            path: 'guide/aria/tabs',
            contentPath: 'guide/aria/tabs',
          },
          {
            label: 'Toolbar',
            path: 'guide/aria/toolbar',
            contentPath: 'guide/aria/toolbar',
          },
          {
            label: 'Tree',
            path: 'guide/aria/tree',
            contentPath: 'guide/aria/tree',
          },
        ],
      },
      {
        label: 'Internacionalização',
        children: [
          {
            label: 'Visão Geral',
            path: 'guide/i18n',
            contentPath: 'guide/i18n/overview',
          },
          {
            label: 'Adicionando o pacote localize',
            path: 'guide/i18n/add-package',
            contentPath: 'guide/i18n/add-package',
          },
          {
            label: 'Referenciando locales por ID',
            path: 'guide/i18n/locale-id',
            contentPath: 'guide/i18n/locale-id',
          },
          {
            label: 'Formatando dados baseado no locale',
            path: 'guide/i18n/format-data-locale',
            contentPath: 'guide/i18n/format-data-locale',
          },
          {
            label: 'Preparando component para tradução',
            path: 'guide/i18n/prepare',
            contentPath: 'guide/i18n/prepare',
          },
          {
            label: 'Trabalhando com arquivos de tradução',
            path: 'guide/i18n/translation-files',
            contentPath: 'guide/i18n/translation-files',
          },
          {
            label: 'Mesclando traduções na aplicação',
            path: 'guide/i18n/merge',
            contentPath: 'guide/i18n/merge',
          },
          {
            label: 'Implantando múltiplos locales',
            path: 'guide/i18n/deploy',
            contentPath: 'guide/i18n/deploy',
          },
          {
            label: 'Importando variantes globais dos dados de locale',
            path: 'guide/i18n/import-global-variants',
            contentPath: 'guide/i18n/import-global-variants',
          },
          {
            label: 'Gerenciando texto marcado com IDs customizados',
            path: 'guide/i18n/manage-marked-text',
            contentPath: 'guide/i18n/manage-marked-text',
          },
          {
            label: 'Exemplo de aplicação Angular',
            path: 'guide/i18n/example',
            contentPath: 'guide/i18n/example',
          },
        ],
      },
      {
        label: 'Animations',
        children: [
          {
            label: 'Animações Enter e Leave',
            path: 'guide/animations',
            contentPath: 'guide/animations/enter-and-leave',
          },
          {
            label: 'Animations complexas com CSS',
            path: 'guide/animations/css',
            contentPath: 'guide/animations/css',
          },
          {
            label: 'Animações de transição de route',
            path: 'guide/routing/route-transition-animations',
            contentPath: 'guide/routing/route-transition-animations',
            isCrossReferenced: true,
          },
        ],
      },
      {
        label: 'Drag and drop',
        path: 'guide/drag-drop',
        contentPath: 'guide/drag-drop',
      },
    ],
  },
  {
    label: 'Construindo com IA',
    children: [
      {
        label: 'Primeiros Passos',
        path: 'ai',
        contentPath: 'ai/overview',
      },
      {
        label: 'Prompts LLM e configuração de IDE com IA',
        path: 'ai/develop-with-ai',
        contentPath: 'ai/develop-with-ai',
      },
      {
        label: 'Agent Skills',
        path: 'ai/agent-skills',
        contentPath: 'ai/agent-skills',
        status: 'new',
      },
      {
        label: 'Configuração do Angular CLI MCP Server',
        path: 'ai/mcp',
        contentPath: 'ai/mcp-server-setup',
      },
      {
        label: 'Tutor de IA do Angular',
        path: 'ai/ai-tutor',
        contentPath: 'ai/ai-tutor',
      },
      {
        label: 'Padrões de Design',
        path: 'ai/design-patterns',
        contentPath: 'ai/design-patterns',
      },
      {
        label: 'WebMCP',
        path: 'ai/webmcp',
        contentPath: 'ai/webmcp',
        status: 'new',
      },
    ],
  },
  {
    label: 'Ferramentas de Desenvolvimento',
    children: [
      {
        label: 'Angular CLI',
        children: [
          {
            label: 'Visão Geral',
            path: 'tools/cli',
            contentPath: 'tools/cli/overview',
          },
          {
            label: 'Configuração local',
            path: 'tools/cli/setup-local',
            contentPath: 'tools/cli/setup-local',
          },
          {
            label: 'Construindo aplicações Angular',
            path: 'tools/cli/build',
            contentPath: 'tools/cli/build',
          },
          {
            label: 'Servindo aplicações Angular para desenvolvimento',
            path: 'tools/cli/serve',
            contentPath: 'tools/cli/serve',
          },
          {
            label: 'Implantação',
            path: 'tools/cli/deployment',
            contentPath: 'tools/cli/deployment',
          },
          {
            label: 'Testing End-to-End',
            path: 'tools/cli/end-to-end',
            contentPath: 'tools/cli/end-to-end',
          },
          {
            label: 'Migrando para o novo sistema de build',
            path: 'tools/cli/build-system-migration',
            contentPath: 'tools/cli/build-system-migration',
          },
          {
            label: 'Ambientes de build',
            path: 'tools/cli/environments',
            contentPath: 'tools/cli/environments',
          },
          {
            label: 'Angular CLI builders',
            path: 'tools/cli/cli-builder',
            contentPath: 'tools/cli/cli-builder',
          },
          {
            label: 'Gerando código usando schematics',
            path: 'tools/cli/schematics',
            contentPath: 'tools/cli/schematics',
          },
          {
            label: 'Criando schematics',
            path: 'tools/cli/schematics-authoring',
            contentPath: 'tools/cli/schematics-authoring',
          },
          {
            label: 'Schematics para libraries',
            path: 'tools/cli/schematics-for-libraries',
            contentPath: 'tools/cli/schematics-for-libraries',
          },
          {
            label: 'Verificação de tipo de template',
            path: 'tools/cli/template-typecheck',
            contentPath: 'tools/cli/template-typecheck',
          },
          {
            label: 'Compilação Ahead-of-time (AOT)',
            path: 'tools/cli/aot-compiler',
            contentPath: 'tools/cli/aot-compiler',
          },
          {
            label: 'Erros de metadata AOT',
            path: 'tools/cli/aot-metadata-errors',
            contentPath: 'tools/cli/aot-metadata-errors',
          },
        ],
      },
      {
        label: 'Libraries',
        children: [
          {
            label: 'Visão Geral',
            path: 'tools/libraries',
            contentPath: 'tools/libraries/overview',
          },
          {
            label: 'Criando Libraries',
            path: 'tools/libraries/creating-libraries',
            contentPath: 'tools/libraries/creating-libraries',
          },
          {
            label: 'Usando Libraries',
            path: 'tools/libraries/using-libraries',
            contentPath: 'tools/libraries/using-libraries',
          },
          {
            label: 'Formato de Pacote Angular',
            path: 'tools/libraries/angular-package-format',
            contentPath: 'tools/libraries/angular-package-format',
          },
        ],
      },
      {
        label: 'DevTools',
        children: [
          {
            label: 'Visão Geral',
            path: 'tools/devtools',
            contentPath: 'tools/devtools/overview',
          },
          {
            label: 'Components',
            path: 'tools/devtools/component',
            contentPath: 'tools/devtools/component',
          },
          {
            label: 'Profiler',
            path: 'tools/devtools/profiler',
            contentPath: 'tools/devtools/profiler',
          },
          {
            label: 'Injectors',
            path: 'tools/devtools/injectors',
            contentPath: 'tools/devtools/injectors',
          },
          {
            label: 'Signals',
            path: 'tools/devtools/signals',
            contentPath: 'tools/devtools/signals',
          },
          {
            label: 'Árvore do Router',
            path: 'tools/devtools/router',
            contentPath: 'tools/devtools/router',
          },
        ],
      },
      {
        label: 'Language Service',
        path: 'tools/language-service',
        contentPath: 'tools/language-service',
      },
    ],
  },
  {
    label: 'Boas Práticas',
    children: [
      {
        label: 'Guia de Estilo',
        path: 'style-guide',
        contentPath: 'best-practices/style-guide',
      },
      {
        label: 'Segurança',
        path: 'best-practices/security',
        contentPath: 'guide/security', // Have not refactored due to build issues
      },
      {
        label: 'Acessibilidade',
        path: 'best-practices/a11y',
        contentPath: 'best-practices/a11y',
      },
      {
        label: 'Erros não tratados no Angular',
        path: 'best-practices/error-handling',
        contentPath: 'best-practices/error-handling',
      },
      {
        label: 'Performance',
        preserveOtherCategoryOrder: true,
        children: [
          {
            label: 'Visão Geral',
            path: 'best-practices/performance',
            contentPath: 'best-practices/performance/overview',
          },

          // Loading Performance
          {
            label: 'Routes com lazy loading',
            path: 'best-practices/performance/lazy-loaded-routes',
            contentPath: 'guide/routing/loading-strategies',
            category: 'Loading Performance',
          },
          {
            label: 'Carregamento diferido com @defer',
            path: 'best-practices/performance/defer',
            contentPath: 'guide/templates/defer',
            category: 'Loading Performance',
          },
          {
            label: 'Lazy loading de services',
            path: 'best-practices/performance/lazy-loading-services',
            contentPath: 'guide/di/lazy-loading-services',
            category: 'Loading Performance',
          },
          {
            label: 'Otimização de imagens',
            path: 'best-practices/performance/image-optimization',
            contentPath: 'guide/image-optimization',
            category: 'Loading Performance',
          },
          {
            label: 'Renderização server-side',
            path: 'best-practices/performance/ssr',
            contentPath: 'guide/ssr',
            category: 'Loading Performance',
          },

          // Runtime Performance
          {
            label: 'Visão Geral',
            path: 'best-practices/runtime-performance',
            contentPath: 'best-practices/runtime-performance/overview',
            category: 'Runtime Performance',
          },
          {
            label: 'Zoneless',
            path: 'guide/zoneless',
            contentPath: 'guide/zoneless',
            category: 'Runtime Performance',
          },
          {
            label: 'Computações lentas',
            path: 'best-practices/slow-computations',
            contentPath: 'best-practices/runtime-performance/slow-computations',
            category: 'Runtime Performance',
          },
          {
            label: 'Pulando subárvores de components',
            path: 'best-practices/skipping-subtrees',
            contentPath: 'best-practices/runtime-performance/skipping-subtrees',
            category: 'Runtime Performance',
          },
          {
            label: 'Poluição de zone',
            path: 'best-practices/zone-pollution',
            contentPath: 'best-practices/runtime-performance/zone-pollution',
            category: 'Runtime Performance',
          },

          {
            label: 'Criando perfil com o Chrome DevTools',
            path: 'best-practices/profiling-with-chrome-devtools',
            contentPath: 'best-practices/runtime-performance/profiling-with-chrome-devtools',
            category: 'Runtime Performance',
          },
        ],
      },
      {
        label: 'Mantendo-se atualizado',
        path: 'update',
        contentPath: 'best-practices/update',
      },
    ],
  },
  {
    label: 'Eventos para Desenvolvedores',
    children: [
      {
        label: 'Lançamento do Angular v22',
        path: 'events/v22',
        contentPath: 'events/v22',
        status: 'new',
      },
      {
        label: 'Lançamento do Angular v21',
        path: 'events/v21',
        contentPath: 'events/v21',
      },
    ],
  },
  {
    label: 'Ecossistema Estendido',
    children: [
      {
        label: 'NgModules',
        path: 'guide/ngmodules/overview',
        contentPath: 'guide/ngmodules/overview',
      },
      {
        label: 'Animations Legadas',
        children: [
          {
            label: 'Visão Geral',
            path: 'guide/legacy-animations',
            contentPath: 'guide/animations/overview',
          },
          {
            label: 'Transições e Triggers',
            path: 'guide/legacy-animations/transition-and-triggers',
            contentPath: 'guide/animations/transition-and-triggers',
          },
          {
            label: 'Sequências Complexas',
            path: 'guide/legacy-animations/complex-sequences',
            contentPath: 'guide/animations/complex-sequences',
          },
          {
            label: 'Animations Reutilizáveis',
            path: 'guide/legacy-animations/reusable-animations',
            contentPath: 'guide/animations/reusable-animations',
          },
          {
            label: 'Migrando para Animations CSS Nativas',
            path: 'guide/animations/migration',
            contentPath: 'guide/animations/migration',
          },
        ],
      },
      {
        label: 'Usando RxJS com Angular',
        children: [
          {
            label: 'Interoperabilidade com signals',
            path: 'ecosystem/rxjs-interop',
            contentPath: 'ecosystem/rxjs-interop/signals-interop',
          },
          {
            label: 'Interoperabilidade de output de component',
            path: 'ecosystem/rxjs-interop/output-interop',
            contentPath: 'ecosystem/rxjs-interop/output-interop',
          },
          {
            label: 'Cancelando inscrição com takeUntilDestroyed',
            path: 'ecosystem/rxjs-interop/take-until-destroyed',
            contentPath: 'ecosystem/rxjs-interop/take-until-destroyed',
          },
        ],
      },
      {
        label: 'Service Workers & PWAs',
        children: [
          {
            label: 'Visão Geral',
            path: 'ecosystem/service-workers',
            contentPath: 'ecosystem/service-workers/overview',
          },
          {
            label: 'Primeiros passos',
            path: 'ecosystem/service-workers/getting-started',
            contentPath: 'ecosystem/service-workers/getting-started',
          },
          {
            label: 'Scripts de service worker customizados',
            path: 'ecosystem/service-workers/custom-service-worker-scripts',
            contentPath: 'ecosystem/service-workers/custom-service-worker-scripts',
          },
          {
            label: 'Arquivo de configuração',
            path: 'ecosystem/service-workers/config',
            contentPath: 'ecosystem/service-workers/config',
          },
          {
            label: 'Comunicando com o service worker',
            path: 'ecosystem/service-workers/communications',
            contentPath: 'ecosystem/service-workers/communications',
          },
          {
            label: 'Notificações push',
            path: 'ecosystem/service-workers/push-notifications',
            contentPath: 'ecosystem/service-workers/push-notifications',
          },
          {
            label: 'DevOps de service worker',
            path: 'ecosystem/service-workers/devops',
            contentPath: 'ecosystem/service-workers/devops',
          },
          {
            label: 'Padrão app shell',
            path: 'ecosystem/service-workers/app-shell',
            contentPath: 'ecosystem/service-workers/app-shell',
          },
        ],
      },
      {
        label: 'Web workers',
        path: 'ecosystem/web-workers',
        contentPath: 'ecosystem/web-workers',
      },
      {
        label: 'Pipeline de build customizado',
        path: 'ecosystem/custom-build-pipeline',
        contentPath: 'ecosystem/custom-build-pipeline',
      },
      {
        label: 'Tailwind',
        path: 'guide/tailwind',
        contentPath: 'guide/tailwind',
      },
      {
        label: 'Angular Fire',
        path: 'https://github.com/angular/angularfire#readme',
      },
      {
        label: 'Google Maps',
        path: 'https://github.com/angular/components/tree/main/src/google-maps#readme',
      },
      {
        label: 'Google Pay',
        path: 'https://github.com/google-pay/google-pay-button#angular',
      },
      {
        label: 'YouTube player',
        path: 'https://github.com/angular/components/blob/main/src/youtube-player/README.md',
      },
      {
        label: 'Angular CDK',
        path: 'https://material.angular.dev/cdk/categories',
      },
      {
        label: 'Angular Material',
        path: 'https://material.angular.dev/',
      },
    ],
  },
  ...(isDevMode()
    ? [
        {
          label: 'Adev Dev Guide',
          children: [
            {
              label: 'Kitchen Sink',
              path: 'kitchen-sink',
              contentPath: 'kitchen-sink',
            },
          ],
        },
      ]
    : []),
];

export const TUTORIALS_SUB_NAVIGATION_DATA: NavigationItem[] = [
  FIRST_APP_TUTORIAL_NAV_DATA,
  LEARN_ANGULAR_TUTORIAL_NAV_DATA,
  DEFERRABLE_VIEWS_TUTORIAL_NAV_DATA,
  SIGNALS_TUTORIAL_NAV_DATA,
  SIGNAL_FORMS_TUTORIAL_NAV_DATA,
  {
    path: 'tutorials',
    contentPath: 'tutorials/home',
    label: 'Tutorials',
  },
];

export const REFERENCE_SUB_NAVIGATION_DATA: NavigationItem[] = [
  {
    label: 'Roadmap',
    path: 'roadmap',
    contentPath: 'reference/roadmap',
  },
  {
    label: 'Envolva-se',
    path: 'https://github.com/angular/angular/blob/main/CONTRIBUTING.md',
  },
  {
    label: 'Referência de API',
    preserveOtherCategoryOrder: true,
    children: [
      {
        label: 'Visão Geral',
        path: 'api',
      },
      ...getApiNavigationItems(),
    ],
  },
  {
    label: 'Referência CLI',
    children: [
      {
        label: 'Visão Geral',
        path: 'cli',
        contentPath: 'reference/cli',
      },
      {
        label: 'ng add',
        path: 'cli/add',
      },
      {
        label: 'ng analytics',
        children: [
          {
            label: 'Visão Geral',
            path: 'cli/analytics',
          },
          {
            label: 'disable',
            path: 'cli/analytics/disable',
          },
          {
            label: 'enable',
            path: 'cli/analytics/enable',
          },
          {
            label: 'info',
            path: 'cli/analytics/info',
          },
          {
            label: 'prompt',
            path: 'cli/analytics/prompt',
          },
        ],
      },
      {
        label: 'ng build',
        path: 'cli/build',
      },
      {
        label: 'ng cache',
        children: [
          {
            label: 'Visão Geral',
            path: 'cli/cache',
          },
          {
            label: 'clean',
            path: 'cli/cache/clean',
          },
          {
            label: 'disable',
            path: 'cli/cache/disable',
          },
          {
            label: 'enable',
            path: 'cli/cache/enable',
          },
          {
            label: 'info',
            path: 'cli/cache/info',
          },
        ],
      },
      {
        label: 'ng completion',
        children: [
          {
            label: 'Visão Geral',
            path: 'cli/completion',
          },
          {
            label: 'script',
            path: 'cli/completion/script',
          },
        ],
      },
      {
        label: 'ng config',
        path: 'cli/config',
      },
      {
        label: 'ng deploy',
        path: 'cli/deploy',
      },
      {
        label: 'ng e2e',
        path: 'cli/e2e',
      },
      {
        label: 'ng extract-i18n',
        path: 'cli/extract-i18n',
      },
      {
        label: 'ng generate',
        children: [
          {
            label: 'Visão Geral',
            path: 'cli/generate',
          },
          {
            label: 'ai-config',
            path: 'cli/generate/ai-config',
          },
          {
            label: 'app-shell',
            path: 'cli/generate/app-shell',
          },
          {
            label: 'application',
            path: 'cli/generate/application',
          },
          {
            label: 'class',
            path: 'cli/generate/class',
          },
          {
            label: 'component',
            path: 'cli/generate/component',
          },
          {
            label: 'config',
            path: 'cli/generate/config',
          },
          {
            label: 'directive',
            path: 'cli/generate/directive',
          },
          {
            label: 'enum',
            path: 'cli/generate/enum',
          },
          {
            label: 'environments',
            path: 'cli/generate/environments',
          },
          {
            label: 'guard',
            path: 'cli/generate/guard',
          },
          {
            label: 'interceptor',
            path: 'cli/generate/interceptor',
          },
          {
            label: 'interface',
            path: 'cli/generate/interface',
          },
          {
            label: 'library',
            path: 'cli/generate/library',
          },
          {
            label: 'module',
            path: 'cli/generate/module',
          },
          {
            label: 'pipe',
            path: 'cli/generate/pipe',
          },
          {
            label: 'resolver',
            path: 'cli/generate/resolver',
          },
          {
            label: 'service-worker',
            path: 'cli/generate/service-worker',
          },
          {
            label: 'service',
            path: 'cli/generate/service',
          },
          {
            label: 'web-worker',
            path: 'cli/generate/web-worker',
          },
        ],
      },
      {
        label: 'ng lint',
        path: 'cli/lint',
      },
      {
        label: 'ng new',
        path: 'cli/new',
      },
      {
        label: 'ng run',
        path: 'cli/run',
      },
      {
        label: 'ng serve',
        path: 'cli/serve',
      },
      {
        label: 'ng test',
        path: 'cli/test',
      },
      {
        label: 'ng update',
        path: 'cli/update',
      },
      {
        label: 'ng version',
        path: 'cli/version',
      },
    ],
  },
  {
    label: 'Enciclopédia de Erros',
    children: [
      {
        label: 'Visão Geral',
        path: 'errors',
        contentPath: 'reference/errors/overview',
      },
      ...ERRORS_NAV_DATA,
    ],
  },
  {
    label: 'Diagnósticos Estendidos',
    children: [
      {
        label: 'Visão Geral',
        path: 'extended-diagnostics',
        contentPath: 'reference/extended-diagnostics/overview',
      },
      ...EXT_DIAGNOSTICS_NAV_DATA,
    ],
  },
  {
    label: 'Versionamento e lançamentos',
    path: 'reference/releases',
    contentPath: 'reference/releases',
  },
  {
    label: 'Compatibilidade de versões',
    path: 'reference/versions',
    contentPath: 'reference/versions',
  },
  {
    label: 'Guia de atualização',
    path: 'update-guide',
  },
  {
    label: 'Configurações',
    children: [
      {
        label: 'Estrutura de arquivos',
        path: 'reference/configs/file-structure',
        contentPath: 'reference/configs/file-structure',
      },
      {
        label: 'Configuração de workspace',
        path: 'reference/configs/workspace-config',
        contentPath: 'reference/configs/workspace-config',
      },
      {
        label: 'Opções do compilador Angular',
        path: 'reference/configs/angular-compiler-options',
        contentPath: 'reference/configs/angular-compiler-options',
      },
      {
        label: 'Dependências npm',
        path: 'reference/configs/npm-packages',
        contentPath: 'reference/configs/npm-packages',
      },
    ],
  },
  {
    label: 'Migrações',
    children: [
      {
        label: 'Visão Geral',
        path: 'reference/migrations',
        contentPath: 'reference/migrations/overview',
      },
      {
        label: 'Standalone',
        path: 'reference/migrations/standalone',
        contentPath: 'reference/migrations/standalone',
      },
      {
        label: 'Sintaxe de Control Flow',
        path: 'reference/migrations/control-flow',
        contentPath: 'reference/migrations/control-flow',
      },
      {
        label: 'Função inject()',
        path: 'reference/migrations/inject-function',
        contentPath: 'reference/migrations/inject-function',
      },
      {
        label: 'Routes com lazy loading',
        path: 'reference/migrations/route-lazy-loading',
        contentPath: 'reference/migrations/route-lazy-loading',
      },
      {
        label: 'Signal inputs',
        path: 'reference/migrations/signal-inputs',
        contentPath: 'reference/migrations/signal-inputs',
      },
      {
        label: 'Outputs',
        path: 'reference/migrations/outputs',
        contentPath: 'reference/migrations/outputs',
      },
      {
        label: 'Signal queries',
        path: 'reference/migrations/signal-queries',
        contentPath: 'reference/migrations/signal-queries',
      },
      {
        label: 'Limpando imports não utilizados',
        path: 'reference/migrations/cleanup-unused-imports',
        contentPath: 'reference/migrations/cleanup-unused-imports',
      },
      {
        label: 'Tags auto-fecháveis',
        path: 'reference/migrations/self-closing-tags',
        contentPath: 'reference/migrations/self-closing-tags',
      },
      {
        label: 'NgClass para Class',
        path: 'reference/migrations/ngclass-to-class',
        contentPath: 'reference/migrations/ngclass-to-class',
      },
      {
        label: 'NgStyle para Style',
        path: 'reference/migrations/ngstyle-to-style',
        contentPath: 'reference/migrations/ngstyle-to-style',
      },
      {
        label: 'Migração do Router Testing Module',
        path: 'reference/migrations/router-testing-module-migration',
        contentPath: 'reference/migrations/router-testing-module-migration',
      },
      {
        label: 'CommonModule para Standalone',
        path: 'reference/migrations/common-to-standalone',
        contentPath: 'reference/migrations/common-to-standalone',
      },
      {
        label: 'Injectable para Service',
        path: 'reference/migrations/injectable-to-service',
        contentPath: 'reference/migrations/injectable-to-service',
      },
    ],
  },
];

export const FOOTER_NAVIGATION_DATA: NavigationItem[] = [
  {
    label: 'Kit de Imprensa',
    path: 'press-kit',
    contentPath: 'reference/press-kit',
  },
  {
    label: 'Licença',
    path: 'license',
    contentPath: 'reference/license',
  },
];

export const ALL_ITEMS = [
  ...DOCS_SUB_NAVIGATION_DATA,
  ...REFERENCE_SUB_NAVIGATION_DATA,
  ...FOOTER_NAVIGATION_DATA,
  ...TUTORIALS_SUB_NAVIGATION_DATA,
];

interface ApiManifestPackage {
  normalizedModuleName: string;
  moduleLabel: string;
  entries: {name: string; category: string | undefined}[];
}

function getApiNavigationItems(): NavigationItem[] {
  const manifest = API_MANIFEST_JSON as ApiManifestPackage[];

  const apiNavigationItems: NavigationItem[] = [];

  for (const packageEntry of manifest) {
    const packageNavigationItem: NavigationItem = {
      label: packageEntry.moduleLabel,
      children: packageEntry.entries.map((api) => ({
        path: getApiUrl(packageEntry, api.name),
        label: api.name,
        category: api.category,
      })),
    };

    apiNavigationItems.push(packageNavigationItem);
  }

  return apiNavigationItems;
}

function getApiUrl(packageEntry: ApiManifestPackage, apiName: string): string {
  const packageName = packageEntry.normalizedModuleName
    // packages like `angular_core` should be `core`
    // packages like `angular_animation_browser` should be `animation/browser`
    .replace('angular_', '')
    .replaceAll('_', '/');
  return `api/${packageName}/${apiName}`;
}
