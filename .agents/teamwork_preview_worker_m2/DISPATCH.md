# DISPATCH — Worker M2: Subproject 1 (Open Source Spanish Liturgy Scraper)

## 2026-09-11T05:59:37Z

## Working Directory
`/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/teamwork_preview_worker_m2`

## Role & Mission
You are Worker M2. Your mission is to implement **Subproject 1: Open Source Spanish Liturgy Scraper** (`subprojects/spanish-mass-readings`):

1. **Extraction from `~/teamwork_projects/guadalupe_mass_interactive`**:
   - Extract proven Spanish lectionary logic from `/Users/riosisraelg/teamwork_projects/guadalupe_mass_interactive` (`src/types/catholic-mass-readings.ts`, `src/lib/readings-adapter.ts`, `src/data/spanish_readings_2026_09_10.json`, and tests).
   - Retain provenance comment headers in source files referencing the origin: `// Provenance: Extracted and adapted from ~/teamwork_projects/guadalupe_mass_interactive`.

2. **Package Architecture (Inspired by `rcolfin/catholic-mass-readings`)**:
   - Directory: `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/subprojects/spanish-mass-readings`
   - `package.json`:
     - `"name": "spanish-mass-readings"`
     - `"version": "2026.09.0"` (CalVer format YYYY.MM.MINOR)
     - `"type": "module"`
     - `"bin": { "spanish-mass-readings": "dist/cli.js" }`
     - dependencies: `"cheerio": "^1.0.0"`, `"commander": "^14.0.0"`
   - `tsconfig.json`: ESM TypeScript configuration with declaration generation.
   - `src/models.ts`: Domain models (`Mass`, `Section`, `Reading`, `Verse`, `SectionType`, `SerializedMass`, etc.).
   - `src/constants.ts`: USCCB Spanish URL formats (`https://bible.usccb.org/es/bible/lecturas/{DATE}.cfm`, variant suffixes `-Day.cfm`, `-Dawn.cfm`, `-Night.cfm`), Spanish Lectionary book catalog, and Spanish closing remarks ("Palabra de Dios.", "Te alabamos, Señor.", "Palabra del Señor.", "Gloria a ti, Señor Jesús.").
   - `src/errors.ts`: Error hierarchy (`USCCBError`, `USCCBParseError`, `USCCBNetworkError`).
   - `src/http.ts`: Pluggable `HttpClient` interface and default HTTP client.
   - `src/obolus.ts`: Automated cryptographic proof-of-work solver for USCCB Pantheon/Varnish bot challenge (`X_Obolus_Proof` cookie).
   - `src/usccb-spanish.ts`: `USCCBSpanish` client. Cheerio parser that extracts plain-text citations from `.address` (without requiring `<a>` tags) and classifies Spanish headers ("Primera lectura", "Segunda lectura", "Salmo Responsorial", "Aclamación antes del Evangelio", "Evangelio").
   - `src/utils.ts`: Date formatting (`formatUrlDate`, `parseIsoDate`), Spanish book normalizer, citation parser.
   - `src/index.ts`: Central barrel export.
   - `bin/cli.ts`: Commander CLI tool (`spanish-mass-readings get-mass --date YYYY-MM-DD`).
   - `fixtures/2026-09-10.json`: Validated canonical JSON fixture.

3. **Testing**:
   - Programmatic test suite in `subprojects/spanish-mass-readings/tests/`:
     - Test fetching and parsing of Spanish readings (both with live request if available and offline fixture).
     - Test plain-text `.address` parsing.
     - Test schema conformance with `SerializedMass`.
   - Add npm test script in `subprojects/spanish-mass-readings/package.json`.

4. **Git Repository, GitHub CLI (`gh`), and CalVer Tagging**:
   - In `subprojects/spanish-mass-readings`:
     - Run `git init -b main`
     - Set git user: `git config user.name "riosisraelg"`, `git config user.email "riosisrael.g@icloud.com"`
     - Add files and commit: `git add . && git commit -m "feat: initial commit of spanish-mass-readings open-source scraper"`
     - Use GitHub CLI to create a public repository and push main branch:
       `gh repo create spanish-mass-readings --public --source=. --remote=origin --push`
       (If repository already exists on remote, set origin `git remote add origin https://github.com/riosisraelg/spanish-mass-readings.git` and push main).
     - Apply Calendar Versioning (CalVer) tag:
       `git tag -a 2026.09.0 -m "Release 2026.09.0: Initial CalVer release"`
       `git push origin 2026.09.0`
   - In parent repository (`lapandilladejesusqro.org`):
     - Ensure parent `.gitignore` ignores `/subprojects/spanish-mass-readings/.git` so git submodules or nested index issues are avoided.
   - Create verification shell script: `subprojects/spanish-mass-readings/scripts/verify-git-calver.sh` that checks:
     - Git repository is initialized
     - Remote origin is set
     - CalVer tag `2026.09.0` is present on the main branch

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## References
- `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/ORIGINAL_REQUEST.md`
- `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/PROJECT.md`
- `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/docs/architecture.md`
- `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/docs/srs.md`
- `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/docs/tasks.md`

## Deliverable
Write your complete handoff report to:
`/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/teamwork_preview_worker_m2/handoff.md`
and notify the orchestrator.
