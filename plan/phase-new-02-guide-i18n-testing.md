# Phase New-02: Guide - i18n and Testing

**Status**: 🔴 Not Started
**Total Files**: 15
**Estimated Time**: 4-5 hours
**Priority**: High

## Translation Agent

Use the translation agent located at `.claude/agents/translate-to-pt-br.md` for all translations.

**To use the agent:**
```bash
# The agent will automatically apply when you edit these files
# Ensure each translated file starts with: <!-- ia-translate: true -->
```

## Overview

This phase focuses on internationalization (i18n) and testing documentation - critical topics for building production-ready Angular applications.

## Files to Translate

### Internationalization - i18n (8 files)

- [ ] `adev/src/content/guide/i18n/overview.md`
  - **Topic**: i18n overview and concepts
  - **Estimated words**: ~1,200
  - **Priority**: Critical (entry point for i18n)

- [ ] `adev/src/content/guide/i18n/add-package.md`
  - **Topic**: Adding i18n package to project
  - **Estimated words**: ~600

- [ ] `adev/src/content/guide/i18n/locale-id.md`
  - **Topic**: Working with locale identifiers
  - **Estimated words**: ~800

- [ ] `adev/src/content/guide/i18n/format-data-locale.md`
  - **Topic**: Formatting data based on locale
  - **Estimated words**: ~1,000

- [ ] `adev/src/content/guide/i18n/prepare.md`
  - **Topic**: Preparing components for translation
  - **Estimated words**: ~1,200

- [ ] `adev/src/content/guide/i18n/manage-marked-text.md`
  - **Topic**: Managing marked text for translation
  - **Estimated words**: ~900

- [ ] `adev/src/content/guide/i18n/merge.md`
  - **Topic**: Merging translations
  - **Estimated words**: ~700

- [ ] `adev/src/content/guide/i18n/example.md`
  - **Topic**: Complete i18n example
  - **Estimated words**: ~1,000

### Testing (7 files)

- [ ] `adev/src/content/guide/testing/component-harnesses-overview.md`
  - **Topic**: Component test harnesses overview
  - **Estimated words**: ~1,000

- [ ] `adev/src/content/guide/testing/component-harnesses-testing-environments.md`
  - **Topic**: Test harnesses in different environments
  - **Estimated words**: ~800

- [ ] `adev/src/content/guide/testing/using-component-harnesses.md`
  - **Topic**: Using component test harnesses
  - **Estimated words**: ~1,200

- [ ] `adev/src/content/guide/testing/creating-component-harnesses.md`
  - **Topic**: Creating custom test harnesses
  - **Estimated words**: ~1,500

- [ ] `adev/src/content/guide/testing/utility-apis.md`
  - **Topic**: Testing utility APIs
  - **Estimated words**: ~900

- [ ] `adev/src/content/guide/testing/karma.md`
  - **Topic**: Karma test runner configuration
  - **Estimated words**: ~800

- [ ] `adev/src/content/guide/testing/migrating-to-vitest.md`
  - **Topic**: Migrating from Karma to Vitest
  - **Estimated words**: ~1,000

## Translation Checklist

For each file, ensure:

- [ ] File starts with `<!-- ia-translate: true -->`
- [ ] Technical terms follow the agent guidelines
  - Keep: "test harness", "locale", "karma", "vitest", "component"
  - Translate: "teste" (test), "tradução" (translation), "exemplo" (example)
- [ ] Code blocks are preserved and untranslated
- [ ] CLI commands remain in English
- [ ] Links and markdown formatting are intact
- [ ] Brazilian Portuguese flows naturally

## Commit Guidelines

When committing translations:

```bash
git commit -m "docs(pt-br): translate guide/<section>/<file> to Brazilian Portuguese

Co-authored-by: Ulisses, Mago do Flutter <ulisseshen@gmail.com>"
```

## Progress Tracking

- **Started**: ___/___/___
- **Completed**: ___/___/___
- **Files translated**: 0/15
- **Completion**: 0%

## Notes

- The i18n section is particularly important for Brazilian developers who need to support pt-BR in their applications
- Testing documentation helps developers write better tests - focus on clarity
- These files contain many code examples - ensure they remain untranslated
