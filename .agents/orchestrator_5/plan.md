# Project Execution Plan — orchestrator_5

## Objectives & Scope
Deliver the four core requirements from DISPATCH.md conforming to ISO/IEC/IEEE engineering standards:
1. **R1: Subproject 1 (Spanish Liturgy Scraper)**: Standalone Git repo, public GitHub repo via `gh`, CalVer tag `2026.09.0`, inspired by `rcolfin/catholic-mass-readings`.
2. **R2: Subproject 2 (Mass Transcript Mining & Curation Tool)**: Internal tool mining YouTube transcripts, separating priest sayings (align right) from public responses (align left) for the "Seguir misa" modal.
3. **R3: Scraper Integration**: Bilingual API route integration in `lapandilladejesusqro.org` supporting English, Spanish, and combined bilingual output.
4. **R4: Codebase Extraction & Separation**: Extract proven Spanish scraping and transcript mining logic from `~/teamwork_projects/guadalupe_mass_interactive`.

---

## Milestone Roadmap

### M0: Survey & Codebase Investigation [COMPLETED]
- Explorer 1: Investigated `lapandilladejesusqro.org`, `src/app/api/mass-readings/route.ts`, `LandingClient.tsx`, 389 passing tests.
- Explorer 2: Investigated `~/teamwork_projects/guadalupe_mass_interactive`, 130 passing unit tests, Obolus challenge, Cheerio plain-text address parser, 5,413 transcript cues, 10 liturgical steps, 81 turns, 18 paired dialogues.
- Explorer 3: Investigated `catholic-mass-readings` architecture, USCCB Spanish endpoints, `gh` authentication (`riosisraelg`), and CalVer setup.

### M1: System Architecture & Specification (ISO/IEC/IEEE Standards) [ACTIVE]
- Produce:
  - `docs/architecture.md` (ISO/IEC/IEEE 42010 System Architecture)
  - `docs/srs.md` (ISO/IEC/IEEE 29148 Software Requirements Specification)
  - `docs/tasks.md` (ISO/IEC/IEEE 12207 Execution Plan & Atomic Task Matrix)
  - `PROJECT.md` (Global Project Index & Interface Contracts)
- Verification: Reviewer approval and Forensic Auditor check.

### M2: Codebase Extraction & Separation
- Extract proven Spanish scraping logic and YouTube transcript mining logic from `~/teamwork_projects/guadalupe_mass_interactive`.
- Establish `subprojects/spanish-mass-readings` and `subprojects/mass-transcript-miner`.
- Create provenance verification script `scripts/verify-extraction.mjs`.

### M3: Subproject 1 — Open Source Spanish Liturgy Scraper
- Implement full `spanish-mass-readings` package (`src/index.ts`, `src/models.ts`, `src/usccb-spanish.ts`, `src/http.ts`, `src/obolus.ts`, `src/constants.ts`, `src/cli.ts`).
- Initialize Git repository inside `subprojects/spanish-mass-readings`.
- Create public GitHub repository via `gh repo create spanish-mass-readings --public --source=. --remote=origin --push`.
- Create and push CalVer tag `2026.09.0`.
- Verify with unit tests (`subprojects/spanish-mass-readings/tests/spanish-scraper.test.ts`) and shell script (`scripts/verify-subproject-1-git.sh`).

### M4: Subproject 2 — Mass Transcript Mining & Curation Tool
- Implement mining tool (`subprojects/mass-transcript-miner`):
  - Ingestion of raw YouTube transcripts (video `EkoysbFU47c`).
  - Liturgical rites segmenter (10 Roman rite steps).
  - Dialogue separation: priest verbatim sayings vs public responses.
  - Explicit chat-style alignment data structure (`isLeft: false` for priest / `.duet-right`, `isLeft: true` for assembly / `.duet-left`).
- Verify with programmatic test `subprojects/mass-transcript-miner/tests/mining-curation.test.ts`.

### M5: Scraper Integration in `lapandilladejesusqro.org`
- Update `src/app/api/mass-readings/route.ts` to consume `spanish-mass-readings` when `lang=es` and `catholic-mass-readings` when `lang=en`.
- Support `lang=bilingual` returning combined dataset for a specific date.
- Preserve `MassReadingsResponse` contract for frontend stability.
- Run full regression suite (389 tests).
- Verify with programmatic test `tests/integration/scraper-integration.test.ts`.

### M6: End-to-End Verification & Acceptance Gate
- Run all programmatic verification tests across all acceptance criteria.
- Execute Reviewer review, Challenger stress tests, and Forensic Audit.
- Synthesize victory claim and final handoff.
