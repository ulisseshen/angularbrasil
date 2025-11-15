# Phase New-05: Tools, Ecosystem, Examples, and Reference

**Status**: 🔴 Not Started
**Total Files**: 18
**Estimated Time**: 4-5 hours
**Priority**: Medium

## Translation Agent

Use the translation agent located at `.claude/agents/translate-to-pt-br.md` for all translations.

**To use the agent:**
```bash
# The agent will automatically apply when you edit these files
# Ensure each translated file starts with: <!-- ia-translate: true -->
```

## Overview

This phase covers CLI tools, libraries, ecosystem integrations, and examples - practical documentation for developers setting up and configuring Angular projects.

## Files to Translate

### Tools - CLI (8 files)

- [ ] `adev/src/content/tools/cli/setup-local.md`
  - **Topic**: Local development setup
  - **Estimated words**: ~800

- [ ] `adev/src/content/tools/cli/serve.md`
  - **Topic**: ng serve command
  - **Estimated words**: ~600

- [ ] `adev/src/content/tools/cli/cli-builder.md`
  - **Topic**: Custom CLI builders
  - **Estimated words**: ~1,200

- [ ] `adev/src/content/tools/cli/environments.md`
  - **Topic**: Environment configuration
  - **Estimated words**: ~900

- [ ] `adev/src/content/tools/cli/schematics.md`
  - **Topic**: Schematics overview
  - **Estimated words**: ~1,000

- [ ] `adev/src/content/tools/cli/schematics-authoring.md`
  - **Topic**: Creating custom schematics
  - **Estimated words**: ~1,500

- [ ] `adev/src/content/tools/cli/schematics-for-libraries.md`
  - **Topic**: Schematics for libraries
  - **Estimated words**: ~1,000

- [ ] `adev/src/content/tools/cli/template-typecheck.md`
  - **Topic**: Template type checking
  - **Estimated words**: ~1,200

### Tools - Libraries (2 files)

- [ ] `adev/src/content/tools/libraries/creating-libraries.md`
  - **Topic**: Creating Angular libraries
  - **Estimated words**: ~1,500

- [ ] `adev/src/content/tools/libraries/angular-package-format.md`
  - **Topic**: Angular package format (APF)
  - **Estimated words**: ~1,200

### Ecosystem (3 files)

- [ ] `adev/src/content/ecosystem/web-workers.md`
  - **Topic**: Using Web Workers with Angular
  - **Estimated words**: ~1,000

- [ ] `adev/src/content/ecosystem/custom-build-pipeline.md`
  - **Topic**: Custom build pipelines
  - **Estimated words**: ~800

- [ ] `adev/src/content/ecosystem/service-workers/custom-service-worker-scripts.md`
  - **Topic**: Custom service worker scripts
  - **Estimated words**: ~900

### Examples (2 files)

- [ ] `adev/src/content/examples/i18n/readme.md`
  - **Topic**: i18n example README
  - **Estimated words**: ~400

- [ ] `adev/src/content/examples/service-worker-getting-started/src/app/readme.md`
  - **Topic**: Service Worker example README
  - **Estimated words**: ~300

### Reference - Other (3 files)

- [ ] `adev/src/content/reference/cli.md`
  - **Topic**: CLI command reference
  - **Estimated words**: ~2,000

- [ ] `adev/src/content/reference/press-kit.md`
  - **Topic**: Angular press kit
  - **Estimated words**: ~400

- [ ] `adev/src/content/reference/license.md`
  - **Topic**: License information
  - **Estimated words**: ~200

- [ ] `adev/src/content/reference/versions.md`
  - **Topic**: Version information
  - **Estimated words**: ~600

## Translation Checklist

For each file, ensure:

- [ ] File starts with `<!-- ia-translate: true -->`
- [ ] Technical terms follow the agent guidelines
  - Keep: "CLI", "schematic", "builder", "web worker", "service worker", "library"
  - Translate: "ferramenta" (tool), "ambiente" (environment), "exemplo" (example)
- [ ] CLI commands remain in English (e.g., `ng serve`, `ng build`)
- [ ] File paths and package names are untranslated
- [ ] Configuration examples preserve JSON/TypeScript syntax
- [ ] Links and markdown formatting are intact

## Special Considerations

**CLI documentation:**
- Command syntax must remain in English
- Flags and options stay as-is
- Only explanatory text is translated

**Library documentation:**
- Package names unchanged
- API references stay in English
- Build configurations preserved

**Example READMEs:**
- Can be brief - these are supplementary
- Focus on clarity for beginners

## Commit Guidelines

When committing translations:

```bash
git commit -m "docs(pt-br): translate <section>/<file> to Brazilian Portuguese

Co-authored-by: Ulisses, Mago do Flutter <ulisseshen@gmail.com>"
```

## Progress Tracking

- **Started**: ___/___/___
- **Completed**: ___/___/___
- **Files translated**: 0/18
- **Completion**: 0%

## Notes

- CLI documentation is heavily referenced during development
- Schematics authoring is advanced content - ensure technical accuracy
- Library creation guides help the Angular ecosystem grow
- Example READMEs should be simple and welcoming
