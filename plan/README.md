# Angular Documentation Translation Plans

This folder contains translation plans for completing the Angular documentation translation to Brazilian Portuguese (pt-BR).

## 📚 Current Status

- **Total Documentation Files**: 339
- **Already Translated**: 269 (79.4%)
- **Remaining to Translate**: 70 files
- **Translation Agent**: [.claude/agents/translate-to-pt-br.md](../.claude/agents/translate-to-pt-br.md)

## 🎯 Active Translation Plans

The following 5 phases cover all remaining untranslated files:

### Phase New-01: Guide - Animations, Forms, and HTTP (12 files)
**File**: [phase-new-01-guide-animations-forms-http.md](phase-new-01-guide-animations-forms-http.md)
**Priority**: High
**Content**:
- Animations (3): CSS, enter/leave, migration
- Forms (3): overview, reactive forms, validation
- HTTP (3): setup, security, testing
- Other (3): routing tasks, performance, tailwind

### Phase New-02: Guide - i18n and Testing (15 files)
**File**: [phase-new-02-guide-i18n-testing.md](phase-new-02-guide-i18n-testing.md)
**Priority**: High
**Content**:
- i18n (8): overview, add package, locale, format, prepare, manage, merge, example
- Testing (7): component harnesses, utility APIs, karma, vitest migration

### Phase New-03: Reference - Error Documentation (14 files)
**File**: [phase-new-03-reference-errors.md](phase-new-03-reference-errors.md)
**Priority**: High
**Content**:
- Runtime errors: NG0401, NG0501, NG0507, NG0602, NG0750, NG0751, NG0955, NG0956
- Compiler errors: NG01101, NG01203, NG02200, NG02800, NG02802, NG05000

### Phase New-04: Reference - Migrations, Configs, and Concepts (11 files)
**File**: [phase-new-04-reference-migrations-configs.md](phase-new-04-reference-migrations-configs.md)
**Priority**: Medium
**Content**:
- Migrations (8): overview, control flow, signals, outputs, inject, standalone, lazy loading
- Configs (2): compiler options, file structure
- Concepts (1): overview

### Phase New-05: Tools, Ecosystem, Examples, and Reference (18 files)
**File**: [phase-new-05-tools-ecosystem-examples.md](phase-new-05-tools-ecosystem-examples.md)
**Priority**: Medium
**Content**:
- CLI tools (8): setup, serve, builder, environments, schematics, template typecheck
- Libraries (2): creating libraries, package format
- Ecosystem (3): web workers, custom build, service workers
- Examples (2): i18n, service worker readmes
- Reference (3): CLI reference, press kit, license, versions

## 🚀 How to Use the Translation Agent

### Step 1: Read the Translation Agent Guide
Before translating, familiarize yourself with the guidelines:
- **File**: [.claude/agents/translate-to-pt-br.md](../.claude/agents/translate-to-pt-br.md)
- **Key Requirement**: Every translated file MUST start with `<!-- ia-translate: true -->`
- **Important**: Learn which technical terms to keep in English vs translate to Portuguese

### Step 2: Choose a Phase to Work On
Start with high-priority phases (New-01, New-02, New-03) as they contain frequently accessed documentation.

### Step 3: Translate Files
For each file in your chosen phase:

1. **Read** the original English file in `adev/src/content/`
2. **Translate** following the agent guidelines
3. **Add marker** `<!-- ia-translate: true -->` as the FIRST line
4. **Verify** your translation:
   - [ ] Marker is first line
   - [ ] Code blocks unchanged
   - [ ] Technical jargon follows guidelines (see agent file)
   - [ ] Links and markdown formatting intact
   - [ ] Portuguese flows naturally
5. **Save** the translated file
6. **Commit & Push**:
   ```bash
   git add adev/src/content/[path-to-file]
   git commit -m "docs(pt-br): translate [filename] to Brazilian Portuguese

   Co-authored-by: Ulisses, Mago do Flutter <ulisseshen@gmail.com>"
   git push
   ```
7. **Mark complete** by checking `- [ ]` to `- [x]` in the phase plan file

## 🔑 Key Translation Rules

### ✅ DO:
- Add `<!-- ia-translate: true -->` as the FIRST line of EVERY file
- Keep technical jargon in English (component, service, directive, pipe, etc.)
- Translate explanatory text to natural Brazilian Portuguese
- Preserve all code blocks exactly as they are
- Maintain all links and markdown formatting
- Use "você" (informal) instead of formal pronouns
- Include co-author in commit message

### ❌ DON'T:
- Translate code examples
- Translate technical terms commonly used in English by Brazilian developers
- Skip the `<!-- ia-translate: true -->` marker
- Change file structure or paths
- Translate framework/library names (Angular, TypeScript, RxJS, etc.)

## 📊 Progress Tracking

Each phase file includes:
- Individual checkboxes for each file
- Progress counter (e.g., "0/12 files")
- Estimated completion time
- Topic summaries

Update checkboxes as you complete files to track progress!

## 📁 Folder Structure

```
plan/
├── README.md (this file)
├── phase-new-01-guide-animations-forms-http.md
├── phase-new-02-guide-i18n-testing.md
├── phase-new-03-reference-errors.md
├── phase-new-04-reference-migrations-configs.md
├── phase-new-05-tools-ecosystem-examples.md
└── completed/
    ├── translation-plan.md (original master plan)
    └── phase-00 through phase-44 (47 completed plan files)
```

## 💡 Translation Tips

1. **Use the Agent**: Always refer to `.claude/agents/translate-to-pt-br.md` for guidelines
2. **One File at a Time**: Complete, commit, and push each file individually
3. **Check the Marker**: Never forget `<!-- ia-translate: true -->` as the first line!
4. **Natural Portuguese**: Make sure the text sounds natural to Brazilian developers
5. **Technical Accuracy**: Don't oversimplify technical concepts
6. **Code Preservation**: Never translate code blocks, CLI commands, or API names

## 📝 Commit Message Format

Always use this format:

```bash
git commit -m "docs(pt-br): translate <section>/<file> to Brazilian Portuguese

Co-authored-by: Ulisses, Mago do Flutter <ulisseshen@gmail.com>"
```

## 🎉 Getting Started

**Recommended starting order:**
1. **Phase New-01** - Common features developers use daily
2. **Phase New-02** - i18n (ironic!) and testing
3. **Phase New-03** - Error documentation (high traffic when troubleshooting)
4. **Phase New-04** - Migrations and configs
5. **Phase New-05** - Tools and ecosystem

Good luck with your translation! 🇧🇷

---

**Last Updated**: 2025-11-15
**Status**: 70 files remaining to translate
**Previous Work**: 269 files already translated (see TRANSLATION_FINDINGS.md in repo root)
