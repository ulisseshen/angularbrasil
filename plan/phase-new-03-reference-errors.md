# Phase New-03: Reference - Error Documentation

**Status**: 🔴 Not Started
**Total Files**: 14
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

This phase focuses on Angular error reference documentation. These files are critical for developers troubleshooting issues and understanding error messages.

## Files to Translate

### Runtime Errors

- [ ] `adev/src/content/reference/errors/NG0401.md`
  - **Error**: Platform already destroyed
  - **Estimated words**: ~400

- [ ] `adev/src/content/reference/errors/NG0501.md`
  - **Error**: Hydration mismatch
  - **Estimated words**: ~600

- [ ] `adev/src/content/reference/errors/NG0507.md`
  - **Error**: Invalid event binding
  - **Estimated words**: ~500

- [ ] `adev/src/content/reference/errors/NG0602.md`
  - **Error**: DI token not found
  - **Estimated words**: ~700

- [ ] `adev/src/content/reference/errors/NG0750.md`
  - **Error**: Router outlet not found
  - **Estimated words**: ~500

- [ ] `adev/src/content/reference/errors/NG0751.md`
  - **Error**: Route path invalid
  - **Estimated words**: ~500

- [ ] `adev/src/content/reference/errors/NG0955.md`
  - **Error**: Dependency cycle detected
  - **Estimated words**: ~600

- [ ] `adev/src/content/reference/errors/NG0956.md`
  - **Error**: Standalone component import
  - **Estimated words**: ~500

### Compiler Errors

- [ ] `adev/src/content/reference/errors/NG01101.md`
  - **Error**: Wrong async validator return type
  - **Estimated words**: ~400

- [ ] `adev/src/content/reference/errors/NG01203.md`
  - **Error**: Missing control flow directive
  - **Estimated words**: ~500

- [ ] `adev/src/content/reference/errors/NG02200.md`
  - **Error**: Missing value accessor
  - **Estimated words**: ~600

- [ ] `adev/src/content/reference/errors/NG02800.md`
  - **Error**: Duplicate decorator
  - **Estimated words**: ~400

- [ ] `adev/src/content/reference/errors/NG02802.md`
  - **Error**: Invalid decorator location
  - **Estimated words**: ~400

- [ ] `adev/src/content/reference/errors/NG05000.md`
  - **Error**: Hydration node mismatch
  - **Estimated words**: ~700

## Translation Checklist

For each file, ensure:

- [ ] File starts with `<!-- ia-translate: true -->`
- [ ] Error codes (NG####) remain unchanged
- [ ] Technical terms follow the agent guidelines
  - Keep: "hydration", "decorator", "validator", "router", "outlet"
  - Translate: "erro" (error), "problema" (problem), "solução" (solution)
- [ ] Code examples are preserved and untranslated
- [ ] Error messages in code can be translated when they're examples
- [ ] Links to API docs remain intact
- [ ] Debugging steps are clear in Portuguese

## Special Considerations

**Error documentation requires:**
- Clear explanation of what causes the error
- Step-by-step solutions in natural Portuguese
- Code examples showing both the error and the fix
- Links to related documentation

## Commit Guidelines

When committing translations:

```bash
git commit -m "docs(pt-br): translate error NG#### documentation to Brazilian Portuguese

Co-authored-by: Ulisses, Mago do Flutter <ulisseshen@gmail.com>"
```

## Progress Tracking

- **Started**: ___/___/___
- **Completed**: ___/___/___
- **Files translated**: 0/14
- **Completion**: 0%

## Notes

Error documentation is frequently accessed when developers encounter problems. Translations should be:
- **Clear and concise**: Developers are often frustrated when reading error docs
- **Action-oriented**: Focus on solutions
- **Technically accurate**: Don't oversimplify technical concepts
