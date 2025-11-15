# Phase New-04: Reference - Migrations, Configs, and Concepts

**Status**: 🔴 Not Started
**Total Files**: 11
**Estimated Time**: 3-4 hours
**Priority**: Medium

## Translation Agent

Use the translation agent located at `.claude/agents/translate-to-pt-br.md` for all translations.

**To use the agent:**
```bash
# The agent will automatically apply when you edit these files
# Ensure each translated file starts with: <!-- ia-translate: true -->
```

## Overview

This phase covers migration guides, configuration references, and conceptual documentation - essential for developers upgrading Angular versions or configuring their projects.

## Files to Translate

### Migrations (8 files)

- [ ] `adev/src/content/reference/migrations/overview.md`
  - **Topic**: Migrations overview
  - **Estimated words**: ~800
  - **Priority**: Critical (entry point)

- [ ] `adev/src/content/reference/migrations/control-flow.md`
  - **Topic**: Migrating to new control flow syntax
  - **Estimated words**: ~1,000

- [ ] `adev/src/content/reference/migrations/signal-inputs.md`
  - **Topic**: Migrating to signal inputs
  - **Estimated words**: ~900

- [ ] `adev/src/content/reference/migrations/signal-queries.md`
  - **Topic**: Migrating to signal queries
  - **Estimated words**: ~900

- [ ] `adev/src/content/reference/migrations/outputs.md`
  - **Topic**: Migrating output declarations
  - **Estimated words**: ~700

- [ ] `adev/src/content/reference/migrations/inject-function.md`
  - **Topic**: Migrating to inject() function
  - **Estimated words**: ~800

- [ ] `adev/src/content/reference/migrations/common-to-standalone.md`
  - **Topic**: Migrating from NgModule to standalone
  - **Estimated words**: ~1,200

- [ ] `adev/src/content/reference/migrations/route-lazy-loading.md`
  - **Topic**: Migrating route lazy loading
  - **Estimated words**: ~700

### Configurations (2 files)

- [ ] `adev/src/content/reference/configs/angular-compiler-options.md`
  - **Topic**: Angular compiler options reference
  - **Estimated words**: ~1,500

- [ ] `adev/src/content/reference/configs/file-structure.md`
  - **Topic**: Workspace file structure
  - **Estimated words**: ~1,000

### Concepts (1 file)

- [ ] `adev/src/content/reference/concepts/overview.md`
  - **Topic**: Angular concepts overview
  - **Estimated words**: ~1,200

## Translation Checklist

For each file, ensure:

- [ ] File starts with `<!-- ia-translate: true -->`
- [ ] Technical terms follow the agent guidelines
  - Keep: "signal", "inject", "standalone", "control flow", "migration"
  - Translate: "migração" (migration), "configuração" (configuration), "opções" (options)
- [ ] Configuration property names remain in English
- [ ] File paths and JSON examples are untranslated
- [ ] Migration steps are clear and actionable
- [ ] CLI commands remain in English

## Special Considerations

**Migration guides need:**
- Clear before/after code examples
- Step-by-step migration instructions
- Warnings about breaking changes
- Links to additional resources

**Configuration docs need:**
- Accurate property descriptions
- Default values preserved
- Type information clear

## Commit Guidelines

When committing translations:

```bash
git commit -m "docs(pt-br): translate reference/<section>/<file> to Brazilian Portuguese

Co-authored-by: Ulisses, Mago do Flutter <ulisseshen@gmail.com>"
```

## Progress Tracking

- **Started**: ___/___/___
- **Completed**: ___/___/___
- **Files translated**: 0/11
- **Completion**: 0%

## Notes

- Migration guides are critical when Angular releases new versions
- Configuration documentation is frequently referenced during project setup
- Ensure technical accuracy - these docs guide important decisions
