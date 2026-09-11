# ISO/IEC/IEEE 12207:2017 Software Life Cycle Task Plan & Execution Matrix

**System Name**: La Pandilla de Jesús — Querétaro Web Platform & Liturgical Scraper Ecosystem  
**Governing Standard**: ISO/IEC/IEEE 12207:2017 (Systems and software engineering — Software life cycle processes)  
**Document Identification**: `PLAN-LPJQRO-2026-02`  
**Document Version**: 2.0.0  
**Date**: 2026-09-11  
**Status**: Authoritative & Approved  
**Author**: Worker M1 (Architecture & Requirements Engineering)  
**Lifecycle State**: State 3 (Execution Planning Baseline)  

---

## 1. Life Cycle Process Model & Methodology

### 1.1 Process Model Overview
In accordance with ISO/IEC/IEEE 12207:2017, the execution lifecycle is structured into six discrete, phase-gated milestones spanning Software Implementation, Integration, Verification, Validation, and Software Configuration Management processes.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        ISO/IEC/IEEE 12207:2017 EXECUTION ROADMAP                       │
│                                                                                        │
│  [M1: Architecture, Requirements & Task Plan Baseline (ISO 42010, 29148, 12207)]       │
│                                           │                                            │
│                                           ▼                                            │
│  ┌────────────────────────────────────────┴─────────────────────────────────────────┐   │
│  │                                                                                  │   │
│  ▼                                                                                  ▼   │
│  [M2: Subproject 1 Extraction & Scraper Engine]     [M3: Subproject 2 Transcript    │   │
│  • spanish-mass-readings package setup              • Mining tool & segmentation    │   │
│  • Plain-text Cheerio citation parser               • 18 rejoiceinfaith pairs       │   │
│  • Obolus PoW challenge solver                      • Chat-style alignment          │   │
│  • CLI & unit test suite                            • Liturgical catalog export     │   │
│  │                                                                                  │   │
│  └────────────────────────────────────────┬─────────────────────────────────────────┘   │
│                                           │                                            │
│                                           ▼                                            │
│  [M4: Host Application Integration]                                                    │
│  • /api/mass-readings dual-scraper routing (lang=es|en|both)                           │
│  • LandingClient.tsx dynamic language toggle                                           │
│  • AppleMusicLyrics.tsx chat-style alignment rendering (.duet-right vs .duet-left)     │
│                                           │                                            │
│                                           ▼                                            │
│  [M5: Multi-Tier Verification & Adversarial Testing]                                   │
│  • Vitest unit tests (Subprojects 1 & 2)                                               │
│  • Host application E2E suite (test-e2e.mjs) & viewport regression tests              │
│                                           │                                            │
│                                           ▼                                            │
│  [M6: Release Engineering, CalVer Tagging & GitHub CLI Publication]                   │
│  • Subproject 1 Git initialization on branch main                                      │
│  • GitHub repo creation: riosisraelg/spanish-mass-readings via gh CLI                  │
│  • Calendar Versioning (CalVer) tag: 2026.09.0                                         │
│  • Final forensic audit sign-off                                                       │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Work Breakdown Structure (WBS) & Atomic Execution Matrix

### Milestone M1: Architecture & Requirements Baseline (ISO Standards)
- **Objective**: Author authoritative engineering manuals and top-level governance files.
- **Milestone Status**: `[⏳] In Progress`

| Task ID | Task Title & Summary | Traceability | Inputs | Target Files | Verification Command | Dependencies | Status |
|---|---|---|---|---|---|---|:---:|
| `TASK-M1-01` | **Author ISO 42010 System Architecture Description** | STD-GOV-2026-01 | Survey reports 1, 2, 3; ORIGINAL_REQUEST | `docs/architecture.md` | Check file structure against ISO 42010 checklist | None | `[x]` DONE |
| `TASK-M1-02` | **Author ISO 29148 Software Requirements Specification** | STD-GOV-2026-01 | Survey reports 1, 2, 3; ORIGINAL_REQUEST | `docs/srs.md` | Check file structure against ISO 29148 checklist | `TASK-M1-01` | `[x]` DONE |
| `TASK-M1-03` | **Author ISO 12207 Execution Plan & Atomic Task Matrix** | STD-GOV-2026-01 | WBS, RTM, survey handoffs | `docs/tasks.md` | Check file structure against ISO 12207 checklist | `TASK-M1-02` | `[⏳]` In Progress |
| `TASK-M1-04` | **Update Master Documentation Index (MDI)** | STD-GOV-2026-01 | Architecture, SRS, Tasks | `docs/index.md` | Audit active links & status badges | `TASK-M1-03` | `[ ]` PLANNED |
| `TASK-M1-05` | **Author Top-Level Project Governance (PROJECT.md)** | STD-GOV-2026-01 | Architecture, Survey findings | `PROJECT.md` | Verify Feature Inventory & Milestones | `TASK-M1-04` | `[ ]` PLANNED |

---

### Milestone M2: Subproject 1 Extraction & Scraper Development
- **Objective**: Build `subprojects/spanish-mass-readings` as an independent TypeScript package extracting logic from `~/teamwork_projects/guadalupe_mass_interactive`.
- **Milestone Status**: `[ ]` PLANNED

| Task ID | Task Title & Summary | Traceability | Inputs | Target Files | Verification Command | Dependencies | Status |
|---|---|---|---|---|---|---|:---:|
| `TASK-M2-01` | **Scaffold Subproject 1 Package Structure**<br>Initialize `subprojects/spanish-mass-readings` with `package.json` (`name: "spanish-mass-readings"`, `version: "2026.09.0"`, `type: "module"`), `tsconfig.json`, and directory layout. | `REQ-FUN-SCR-06`, `REQ-NFR-MNT-01` | `node_modules/catholic-mass-readings/package.json` | `subprojects/spanish-mass-readings/package.json`, `subprojects/spanish-mass-readings/tsconfig.json` | `node -e 'const pkg=JSON.parse(fs.readFileSync("subprojects/spanish-mass-readings/package.json")); assert.equal(pkg.version, "2026.09.0");'` | `TASK-M1-05` | `[ ]` PLANNED |
| `TASK-M2-02` | **Implement Data Models, Enums & Error Hierarchy**<br>Define `Mass`, `Section`, `Reading`, `Verse`, `SectionType`, `SerializedMass`, and custom errors (`USCCBParseError`, etc.). | `REQ-FUN-SCR-03` | `guadalupe/src/types/catholic-mass-readings.ts` | `subprojects/spanish-mass-readings/src/models.ts`, `subprojects/spanish-mass-readings/src/errors.ts` | `npx tsc --noEmit -p subprojects/spanish-mass-readings` | `TASK-M2-01` | `[ ]` PLANNED |
| `TASK-M2-03` | **Implement HTTP Client & Obolus PoW Challenge Solver**<br>Extract and implement `HttpClient` and `obolus.ts` to solve USCCB Pantheon/Varnish bot challenges and manage cookies. | `REQ-FUN-SCR-04`, `REQ-NFR-PERF-01` | `catholic-mass-readings/dist/obolus.js` | `subprojects/spanish-mass-readings/src/http.ts`, `subprojects/spanish-mass-readings/src/obolus.ts` | `node subprojects/spanish-mass-readings/tests/test-obolus.mjs` | `TASK-M2-02` | `[ ]` PLANNED |
| `TASK-M2-04` | **Implement Spanish HTML Lectionary Parser**<br>Implement Cheerio plain-text `.address` citation parsing and Spanish header classification (`sectionTypeFromHeaderEs`). | `REQ-FUN-SCR-01`, `REQ-FUN-SCR-02`, `REQ-FUN-SCR-03` | Survey 3 specifications, `guadalupe/src/lib/readings-adapter.ts` | `subprojects/spanish-mass-readings/src/usccb-spanish.ts`, `subprojects/spanish-mass-readings/src/constants.ts` | `node subprojects/spanish-mass-readings/tests/test-parser.mjs` | `TASK-M2-03` | `[ ]` PLANNED |
| `TASK-M2-05` | **Implement CLI Executable & Barrel Exports**<br>Create `bin/cli.ts` (using Commander) and `src/index.ts` central export. | `REQ-FUN-SCR-05` | `catholic-mass-readings/dist/cli.js` | `subprojects/spanish-mass-readings/bin/cli.ts`, `subprojects/spanish-mass-readings/src/index.ts` | `node subprojects/spanish-mass-readings/bin/cli.js get-mass --date 2026-09-10 --citations-only` | `TASK-M2-04` | `[ ]` PLANNED |
| `TASK-M2-06` | **Unit Test Suite for Subproject 1**<br>Implement comprehensive test suite verifying schema adherence, offline fixtures, plain-text citations, and Obolus PoW. | `REQ-FUN-SCR-01`..`05` | `guadalupe/src/data/spanish_readings_2026_09_10.json` | `subprojects/spanish-mass-readings/tests/` | `npm run test:subproject1` | `TASK-M2-05` | `[ ]` PLANNED |

---

### Milestone M3: Subproject 2 Transcript Mining & Curation Tool
- **Objective**: Build `subprojects/mass-transcript-miner` to ingest YouTube transcripts and curate chat-aligned liturgical dialogues.
- **Milestone Status**: `[ ]` PLANNED

| Task ID | Task Title & Summary | Traceability | Inputs | Target Files | Verification Command | Dependencies | Status |
|---|---|---|---|---|---|---|:---:|
| `TASK-M3-01` | **Scaffold Subproject 2 Structure & Ingest Raw YouTube Transcript**<br>Set up `subprojects/mass-transcript-miner` and copy `guadalupe_transcript_2026_09_10.json` (video `EkoysbFU47c`). | `REQ-FUN-MIN-01`, `REQ-FUN-EXT-01` | `guadalupe/src/data/guadalupe_transcript_2026_09_10.json` | `subprojects/mass-transcript-miner/package.json`, `subprojects/mass-transcript-miner/data/raw_transcript_EkoysbFU47c.json` | `node -e 'assert(fs.existsSync("subprojects/mass-transcript-miner/data/raw_transcript_EkoysbFU47c.json"))'` | `TASK-M1-05` | `[ ]` PLANNED |
| `TASK-M3-02` | **Implement 10 Roman Rite Step Segmenter**<br>Classify cues into 10 canonical steps (Rito Inicial through Rito de Conclusión) with timestamp boundaries. | `REQ-FUN-MIN-02` | `guadalupe/src/lib/seguir-misa-engine.ts` | `subprojects/mass-transcript-miner/src/segmenter.ts` | `node subprojects/mass-transcript-miner/tests/test-segmenter.mjs` | `TASK-M3-01` | `[ ]` PLANNED |
| `TASK-M3-03` | **Implement 18 Dialogue Pairs Matching & RejoiceInFaith Curation**<br>Pair celebrant prompts with standard English and Spanish assembly responses from `rejoiceinfaith.org`. | `REQ-FUN-MIN-03` | `guadalupe/src/data/liturgical_catalog_guadalupe.json` | `subprojects/mass-transcript-miner/src/dialogue-matcher.ts` | `node subprojects/mass-transcript-miner/tests/test-dialogue.mjs` | `TASK-M3-02` | `[ ]` PLANNED |
| `TASK-M3-04` | **Implement Chat-Style Alignment Logic (Priest Right vs Public Left)**<br>Assign `isLeft: false` to celebrant sayings and `isLeft: true` to assembly responses. | `REQ-FUN-MIN-04` | Survey 1, 2, 3 alignment specifications | `subprojects/mass-transcript-miner/src/chat-formatter.ts` | `node subprojects/mass-transcript-miner/tests/test-alignment.mjs` | `TASK-M3-03` | `[ ]` PLANNED |
| `TASK-M3-05` | **Export Curated Liturgical Catalog to Host App**<br>Execute curation pipeline to emit `src/data/liturgical_catalog_guadalupe.json`. | `REQ-FUN-MIN-05` | Mining engine output | `src/data/liturgical_catalog_guadalupe.json` | `node -e 'const cat=JSON.parse(fs.readFileSync("src/data/liturgical_catalog_guadalupe.json")); assert.equal(cat.steps.length, 10);'` | `TASK-M3-04` | `[ ]` PLANNED |

---

### Milestone M4: Host Application Integration & Dual-Scraper Routing
- **Objective**: Connect both subprojects into `lapandilladejesusqro.org`, upgrading the API route and UI.
- **Milestone Status**: `[ ]` PLANNED

| Task ID | Task Title & Summary | Traceability | Inputs | Target Files | Verification Command | Dependencies | Status |
|---|---|---|---|---|---|---|:---:|
| `TASK-M4-01` | **Configure Workspace & Path Aliases in Host App**<br>Add `workspaces: ["subprojects/*"]` in root `package.json` and `"spanish-mass-readings"` path alias in `tsconfig.json`. | `REQ-NFR-MNT-01` | Subproject 1 path | `package.json`, `tsconfig.json` | `npx tsc --noEmit` | `TASK-M2-05` | `[ ]` PLANNED |
| `TASK-M4-02` | **Upgrade `/api/mass-readings/route.ts` for Bilingual Routing**<br>Route `lang=es` to `USCCBSpanish`, `lang=en` to `catholic-mass-readings`, and support `lang=both`. Maintain fallback resilience. | `REQ-FUN-INT-01`, `REQ-FUN-INT-02` | `USCCBSpanish`, `USCCB`, `MassReadingsResponse` | `src/app/api/mass-readings/route.ts` | `curl -s "http://localhost:3000/api/mass-readings?lang=es" \| grep "1 Corintios"` | `TASK-M4-01` | `[ ]` PLANNED |
| `TASK-M4-03` | **Update `LandingClient.tsx` for Seamless Dynamic Language Switch**<br>Ensure language toggle re-fetches `/api/mass-readings?lang=` and updates state without React errors. | `REQ-FUN-INT-03` | `MassReadingsResponse` | `src/app/LandingClient.tsx` | `node scripts/test-e2e.mjs` | `TASK-M4-02` | `[ ]` PLANNED |
| `TASK-M4-04` | **Verify Chat-Style Alignment Rendering in `AppleMusicLyrics.tsx`**<br>Verify celebrant lines render with `.duet-right` (right aligned) and assembly lines render with `.duet-left` (left aligned). | `REQ-FUN-INT-04`, `REQ-NFR-USA-01` | `liturgical_catalog_guadalupe.json`, `global.css` | `src/app/AppleMusicLyrics.tsx`, `src/app/global.css` | `node scripts/verify-chat-alignment.mjs` | `TASK-M3-05`, `TASK-M4-03` | `[ ]` PLANNED |

---

### Milestone M5: Multi-Tier Verification & Adversarial Testing
- **Objective**: Validate the integrated platform across unit, integration, end-to-end, and viewport stress suites.
- **Milestone Status**: `[ ]` PLANNED

| Task ID | Task Title & Summary | Traceability | Inputs | Target Files | Verification Command | Dependencies | Status |
|---|---|---|---|---|---|---|:---:|
| `TASK-M5-01` | **Run Subproject 1 & 2 Automated Test Suites**<br>Verify all unit tests pass in both subprojects with zero failures. | `REQ-FUN-SCR-01`..`05`, `REQ-FUN-MIN-01`..`05` | Test suites in subprojects | `subprojects/*/tests/` | `npm run test:subprojects` | `TASK-M2-06`, `TASK-M3-05` | `[ ]` PLANNED |
| `TASK-M5-02` | **Execute Host E2E Test Harness (5 Tiers)**<br>Execute `scripts/test-e2e.mjs` ensuring all feature tiers, boundaries, user journeys, and fuzzing pass 100%. | All REQ-FUN-INT | Test runner | `scripts/test-e2e.mjs` | `node scripts/test-e2e.mjs` | `TASK-M4-04` | `[ ]` PLANNED |
| `TASK-M5-03` | **Execute Mobile Viewport Stress & Scroll Suites**<br>Execute `adversarial-mobile-viewport-suite.mjs` (21 viewports) and `modal-scroll-stress-suite.mjs`. | `REQ-NFR-USA-02` | Viewport test runners | `scripts/*.mjs` | `node scripts/adversarial-mobile-viewport-suite.mjs && node scripts/modal-scroll-stress-suite.mjs` | `TASK-M4-04` | `[ ]` PLANNED |
| `TASK-M5-04` | **Execute Strict TypeScript Compilation & Production Build**<br>Verify `tsc --noEmit` and `npm run build` succeed with exit code 0. | `REQ-NFR-MNT-01` | Entire workspace | All sources | `npx tsc --noEmit && npm run build` | `TASK-M5-02` | `[ ]` PLANNED |

---

### Milestone M6: Release Engineering, CalVer Tagging & GitHub CLI Publication
- **Objective**: Initialize Subproject 1 Git repo, create public GitHub repository via `gh`, tag `2026.09.0`, and audit.
- **Milestone Status**: `[ ]` PLANNED

| Task ID | Task Title & Summary | Traceability | Inputs | Target Files | Verification Command | Dependencies | Status |
|---|---|---|---|---|---|---|:---:|
| `TASK-M6-01` | **Initialize Git Repository in Subproject 1**<br>Execute `git init -b main`, configure local git user, stage files, and create initial commit. Ensure parent `.gitignore` ignores `subprojects/spanish-mass-readings/.git`. | `REQ-FUN-SCR-06` | Subproject 1 directory | `subprojects/spanish-mass-readings/.git`, `.gitignore` | `cd subprojects/spanish-mass-readings && git status` | `TASK-M5-04` | `[ ]` PLANNED |
| `TASK-M6-02` | **Create Public GitHub Repository & Push via `gh` CLI**<br>Execute `gh repo create spanish-mass-readings --public --source=. --remote=origin --push`. | `REQ-FUN-SCR-06` | GitHub CLI auth | GitHub remote repository | `gh repo view riosisraelg/spanish-mass-readings --json name,visibility` | `TASK-M6-01` | `[ ]` PLANNED |
| `TASK-M6-03` | **Apply Calendar Versioning (CalVer) Git Tag `2026.09.0`**<br>Create annotated git tag `git tag -a 2026.09.0 -m "Release 2026.09.0"` and push to origin. | `REQ-FUN-SCR-06` | Git commit on main | Git tag metadata | `cd subprojects/spanish-mass-readings && git tag --points-at HEAD` | `TASK-M6-02` | `[ ]` PLANNED |
| `TASK-M6-04` | **Run Automated Acceptance Verification Script**<br>Execute shell script verifying all 5 user acceptance criteria: Spanish scraper test, Git/gh/CalVer tag, mining tool dialogue output, dual-scraper host API call, and extraction review. | All Acceptance Criteria | Verification script | `scripts/verify-all-acceptance.sh` | `bash scripts/verify-all-acceptance.sh` | `TASK-M6-03` | `[ ]` PLANNED |
| `TASK-M6-05` | **Final Forensic Audit & Sign-off**<br>Independent verification by Forensic Auditor confirming zero hardcoded dummy facades and 100% genuine execution. | Integrity Mandate | All deliverables and test logs | `.agents/teamwork_preview_worker_m1/handoff.md` | Audit verification checklist | `TASK-M6-04` | `[ ]` PLANNED |

---

## 3. Atomic Verification Commands Quick Reference

```bash
# 1. Verify Subproject 1 Package Version:
node -e 'const pkg=JSON.parse(fs.readFileSync("subprojects/spanish-mass-readings/package.json")); assert.equal(pkg.version, "2026.09.0"); console.log("✓ CalVer 2026.09.0 verified in package.json");'

# 2. Verify Subproject 1 Git & Tag Status:
cd subprojects/spanish-mass-readings && git status && git remote -v && git tag -l "2026.09.0"

# 3. Verify Subproject 2 Output:
node -e 'const cat=JSON.parse(fs.readFileSync("src/data/liturgical_catalog_guadalupe.json")); assert.equal(cat.steps.length, 10); console.log("✓ Liturgical catalog contains 10 canonical steps");'

# 4. Verify Host Application TypeScript Compilation:
npx tsc --noEmit

# 5. Verify Host Application E2E Suite:
node scripts/test-e2e.mjs

# 6. Verify Mobile Viewport Stability:
node scripts/adversarial-mobile-viewport-suite.mjs
node scripts/modal-scroll-stress-suite.mjs
```

---
*End of ISO/IEC/IEEE 12207:2017 Software Life Cycle Task Plan & Execution Matrix.*
