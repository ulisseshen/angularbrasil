# Phase New-01: Guide - Animations, Forms, and HTTP

**Status**: 🟢 Completed
**Total Files**: 12
**Estimated Time**: 3-4 hours
**Priority**: High

## Translation Agent

Use the translation agent located at `.claude/agents/translate-to-pt-br.md` for all translations.

**To use the agent:**
```bash
# The agent will automatically apply when you edit these files
# Ensure each translated file starts with: <!-- ia-translate: true -->
```

## Overview

This phase focuses on translating important guide sections related to animations, forms, and HTTP communication - core features frequently used by Angular developers.

## Files to Translate

### Animations (3 files)

- [x] `adev/src/content/guide/animations/css.md`
  - **Topic**: CSS-based animations in Angular
  - **Estimated words**: ~800

- [x] `adev/src/content/guide/animations/enter-and-leave.md`
  - **Topic**: Enter/Leave animations
  - **Estimated words**: ~1,000

- [x] `adev/src/content/guide/animations/migration.md`
  - **Topic**: Migration guide for animations
  - **Estimated words**: ~600

### Forms (3 files)

- [x] `adev/src/content/guide/forms/overview.md`
  - **Topic**: Forms overview and introduction
  - **Estimated words**: ~1,200

- [x] `adev/src/content/guide/forms/reactive-forms.md`
  - **Topic**: Reactive forms guide
  - **Estimated words**: ~1,500

- [x] `adev/src/content/guide/forms/form-validation.md`
  - **Topic**: Form validation techniques
  - **Estimated words**: ~1,200

### HTTP (3 files)

- [x] `adev/src/content/guide/http/setup.md`
  - **Topic**: Setting up HTTP client
  - **Estimated words**: ~800

- [x] `adev/src/content/guide/http/security.md`
  - **Topic**: HTTP security best practices
  - **Estimated words**: ~1,000

- [x] `adev/src/content/guide/http/testing.md`
  - **Topic**: Testing HTTP requests
  - **Estimated words**: ~1,000

### Other Guide Files (3 files)

- [x] `adev/src/content/guide/routing/common-router-tasks.md`
  - **Topic**: Common routing tasks
  - **Estimated words**: ~1,500

- [x] `adev/src/content/guide/performance/overview.md`
  - **Topic**: Performance optimization overview
  - **Estimated words**: ~1,200

- [x] `adev/src/content/guide/tailwind.md`
  - **Topic**: Using Tailwind CSS with Angular
  - **Estimated words**: ~800

## Translation Checklist

For each file, ensure:

- [ ] File starts with `<!-- ia-translate: true -->`
- [ ] Technical terms follow the agent guidelines (keep "component", "service", etc. in English)
- [ ] Code blocks are preserved and untranslated
- [ ] Comments in code examples are translated to Portuguese
- [ ] Links and markdown formatting are intact
- [ ] Brazilian Portuguese flows naturally
- [ ] Accents and special characters are correct (ã, õ, ç, á, é, í, ó, ú, â, ê, ô)

## Commit Guidelines

When committing translations:

```bash
git commit -m "docs(pt-br): translate guide/<section>/<file> to Brazilian Portuguese

Co-authored-by: Ulisses, Mago do Flutter <ulisseshen@gmail.com>"
```

## Progress Tracking

- **Started**: 2025/11/15
- **Completed**: 2025/11/15
- **Files translated**: 12/12
- **Completion**: 100%

## Notes

These are high-priority files frequently accessed by developers learning Angular's core features. Focus on clarity and natural Portuguese flow while maintaining technical accuracy.
