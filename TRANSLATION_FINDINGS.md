# Angular Brasil - Documentation Translation Status

## Translation System Overview

### Translation Agent
The translation process is managed by `.claude/agents/translate-to-pt-br.md`, which contains:

**Key Requirements:**
1. **Mandatory marker**: Every translated file MUST have `<!-- ia-translate: true -->` as the first line
2. **Co-author**: All commits must include: `Co-authored-by: Ulisses, Mago do Flutter <ulisseshen@gmail.com>`
3. **Target audience**: Brazilian software developers familiar with English technical terms

### Translation Guidelines Summary
- Keep in English: Framework names, programming concepts commonly used in English (component, service, directive, etc.), code-related terms
- Translate to Portuguese: UI elements, actions, general programming terms (file→arquivo, error→erro, etc.)
- Never translate code blocks, only explanatory text
- Use informal "você" voice
- Preserve all markdown formatting and links

## Current Translation Status

### Overall Statistics
```
Total documentation files:     339
Translated in-place:           253 (74.6%)
Has pt-br equivalent:           16 (4.7%)
Completely untranslated:        70 (20.6%)
Translation coverage:      269/339 (79.4%)
```

### Translation Approaches

**1. In-place translations (Current Standard)**: 253 files
   - Files with `<!-- ia-translate: true -->` marker
   - Translation in the original file location

**2. Separate pt-br directory (Legacy Approach)**: 16 files
   - Translations stored in parallel `pt-br/` subdirectories
   - These need to be migrated to in-place approach

## Files Requiring Attention

### Category A: Files with PT-BR Equivalents (Need Migration to In-Place)
These 16 files have translations in separate pt-br directories. They should be migrated to the in-place approach:

1. adev/src/content/guide/components/advanced-configuration.md
   → adev/src/content/guide/components/pt-br/advanced-configuration.md

2. adev/src/content/guide/components/queries.md
   → adev/src/content/guide/components/pt-br/queries.md

3. adev/src/content/guide/components/selectors.md
   → adev/src/content/guide/components/pt-br/selectors.md

4. adev/src/content/guide/di/creating-and-using-services.md
   → adev/src/content/guide/di/pt-br/creating-and-using-services.md

5. adev/src/content/guide/di/dependency-injection-context.md
   → adev/src/content/guide/di/pt-br/dependency-injection-context.md

6. adev/src/content/guide/forms/signals/models.md
   → adev/src/content/guide/forms/signals/pt-br/models.md

7. adev/src/content/guide/forms/typed-forms.md
   → adev/src/content/guide/forms/pt-br/typed-forms.md

8. adev/src/content/guide/http/http-resource.md
   → adev/src/content/guide/http/pt-br/http-resource.md

9. adev/src/content/guide/http/overview.md
   → adev/src/content/guide/http/pt-br/overview.md

10. adev/src/content/guide/hydration.md
    → adev/src/content/guide/pt-br/hydration.md

11. adev/src/content/guide/i18n/deploy.md
    → adev/src/content/guide/i18n/pt-br/deploy.md

12. adev/src/content/guide/i18n/import-global-variants.md
    → adev/src/content/guide/i18n/pt-br/import-global-variants.md

13. adev/src/content/guide/i18n/translation-files.md
    → adev/src/content/guide/i18n/pt-br/translation-files.md

14. adev/src/content/guide/incremental-hydration.md
    → adev/src/content/guide/pt-br/incremental-hydration.md

15. adev/src/content/guide/tailwind.md
    → adev/src/content/guide/pt-br/tailwind.md

16. adev/src/content/guide/zoneless.md
    → adev/src/content/guide/pt-br/zoneless.md

### Category B: Completely Untranslated Files (70 files)

#### ECOSYSTEM (3 files)
- adev/src/content/ecosystem/custom-build-pipeline.md
- adev/src/content/ecosystem/service-workers/custom-service-worker-scripts.md
- adev/src/content/ecosystem/web-workers.md

#### EXAMPLES (2 files)
- adev/src/content/examples/i18n/readme.md
- adev/src/content/examples/service-worker-getting-started/src/app/readme.md

#### GUIDE/ANIMATIONS (3 files)
- adev/src/content/guide/animations/css.md
- adev/src/content/guide/animations/enter-and-leave.md
- adev/src/content/guide/animations/migration.md

#### GUIDE/FORMS (3 files)
- adev/src/content/guide/forms/form-validation.md
- adev/src/content/guide/forms/overview.md
- adev/src/content/guide/forms/reactive-forms.md

#### GUIDE/HTTP (3 files)
- adev/src/content/guide/http/security.md
- adev/src/content/guide/http/setup.md
- adev/src/content/guide/http/testing.md

#### GUIDE/I18N (8 files)
- adev/src/content/guide/i18n/add-package.md
- adev/src/content/guide/i18n/example.md
- adev/src/content/guide/i18n/format-data-locale.md
- adev/src/content/guide/i18n/locale-id.md
- adev/src/content/guide/i18n/manage-marked-text.md
- adev/src/content/guide/i18n/merge.md
- adev/src/content/guide/i18n/overview.md
- adev/src/content/guide/i18n/prepare.md

#### GUIDE/PERFORMANCE (1 file)
- adev/src/content/guide/performance/overview.md

#### GUIDE/ROUTING (1 file)
- adev/src/content/guide/routing/common-router-tasks.md

#### GUIDE/TESTING (7 files)
- adev/src/content/guide/testing/component-harnesses-overview.md
- adev/src/content/guide/testing/component-harnesses-testing-environments.md
- adev/src/content/guide/testing/creating-component-harnesses.md
- adev/src/content/guide/testing/karma.md
- adev/src/content/guide/testing/migrating-to-vitest.md
- adev/src/content/guide/testing/using-component-harnesses.md
- adev/src/content/guide/testing/utility-apis.md

#### REFERENCE/CONCEPTS (1 file)
- adev/src/content/reference/concepts/overview.md

#### REFERENCE/CONFIGS (2 files)
- adev/src/content/reference/configs/angular-compiler-options.md
- adev/src/content/reference/configs/file-structure.md

#### REFERENCE/ERRORS (14 files)
- adev/src/content/reference/errors/NG01101.md
- adev/src/content/reference/errors/NG01203.md
- adev/src/content/reference/errors/NG02200.md
- adev/src/content/reference/errors/NG02800.md
- adev/src/content/reference/errors/NG02802.md
- adev/src/content/reference/errors/NG0401.md
- adev/src/content/reference/errors/NG05000.md
- adev/src/content/reference/errors/NG0501.md
- adev/src/content/reference/errors/NG0507.md
- adev/src/content/reference/errors/NG0602.md
- adev/src/content/reference/errors/NG0750.md
- adev/src/content/reference/errors/NG0751.md
- adev/src/content/reference/errors/NG0955.md
- adev/src/content/reference/errors/NG0956.md

#### REFERENCE/MIGRATIONS (8 files)
- adev/src/content/reference/migrations/common-to-standalone.md
- adev/src/content/reference/migrations/control-flow.md
- adev/src/content/reference/migrations/inject-function.md
- adev/src/content/reference/migrations/outputs.md
- adev/src/content/reference/migrations/overview.md
- adev/src/content/reference/migrations/route-lazy-loading.md
- adev/src/content/reference/migrations/signal-inputs.md
- adev/src/content/reference/migrations/signal-queries.md

#### REFERENCE/OTHER (4 files)
- adev/src/content/reference/cli.md
- adev/src/content/reference/license.md
- adev/src/content/reference/press-kit.md
- adev/src/content/reference/versions.md

#### TOOLS/CLI (8 files)
- adev/src/content/tools/cli/cli-builder.md
- adev/src/content/tools/cli/environments.md
- adev/src/content/tools/cli/schematics-authoring.md
- adev/src/content/tools/cli/schematics-for-libraries.md
- adev/src/content/tools/cli/schematics.md
- adev/src/content/tools/cli/serve.md
- adev/src/content/tools/cli/setup-local.md
- adev/src/content/tools/cli/template-typecheck.md

#### TOOLS/LIBRARIES (2 files)
- adev/src/content/tools/libraries/angular-package-format.md
- adev/src/content/tools/libraries/creating-libraries.md

## Verification Methods

### To check if a file is translated:
```bash
head -1 <file> | grep -q "<!-- ia-translate: true -->" && echo "Translated" || echo "Not translated"
```

### To find all untranslated files:
```bash
find adev/src/content -type f -name "*.md" ! -path "*/pt-br/*" | while read file; do
    if ! grep -q "<!-- ia-translate: true -->" "$file"; then
        echo "$file"
    fi
done
```

### To count translation coverage:
```bash
total=$(find adev/src/content -type f -name "*.md" ! -path "*/pt-br/*" | wc -l)
translated=$(find adev/src/content -type f -name "*.md" ! -path "*/pt-br/*" -exec grep -l "<!-- ia-translate: true -->" {} \; | wc -l)
echo "Coverage: $translated/$total files"
```

## Recommendations

1. **Priority 1**: Migrate the 16 files with pt-br equivalents to in-place translations
2. **Priority 2**: Translate the 70 completely untranslated files, focusing on:
   - High-traffic guide sections (Forms, HTTP, i18n, Testing)
   - Reference errors (important for developer troubleshooting)
   - Tools/CLI documentation
3. **Quality assurance**: Ensure all translations follow the agent guidelines in `.claude/agents/translate-to-pt-br.md`

## Translation Plan Reference

See the detailed translation plan in:
- Main plan: `plan/translation-plan.md`
- Phase plans: `plan/phase-*.md` (44 individual phase files)

These plans provide structured approach to translating all documentation systematically.
