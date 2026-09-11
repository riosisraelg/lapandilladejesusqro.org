# Master Documentation Index (MDI)

> **Repository**: `lapandilladejesusqro.org`  
> **Governing Standards**: ISO/IEC/IEEE 42010:2022, ISO/IEC/IEEE 29148:2018, ISO/IEC/IEEE 12207:2017  
> **Status**: `[Approved]`  
> **Last Synchronized**: 2026-09-11T05:58:00Z  

---

## 1. Executive Summary & SSOT Governance

This Master Documentation Index (MDI) serves as the definitive Single Source of Truth (SSOT) for the architecture, requirements specification, and execution lifecycle of the **La Pandilla de Jesús Querétaro** digital platform and its accompanying liturgical software subprojects. 

Under the September 2026 expansion directives, the repository governs a tripartite software ecosystem:
1. **Subproject 1 (`subprojects/spanish-mass-readings`)**: Standalone open-source TypeScript scraper library and CLI targeting the USCCB Spanish Lectionary, versioned under Calendar Versioning (`2026.09.0`), and published via GitHub CLI (`gh`).
2. **Subproject 2 (`subprojects/mass-transcript-miner`)**: Internal liturgical data-mining and curation tool processing YouTube Mass transcripts (Basílica de Guadalupe, 2026-09-10), segmenting 10 Roman Rite steps, pairing 18 canonical dialogues, and formatting chat-style alignments (Priest Right vs Public Left).
3. **Host Platform (`lapandilladejesusqro.org`)**: Next.js 15 App Router application providing dynamic dual-scraper routing (`/api/mass-readings`), youth ministry prayer decks, liturgical computus calendars, and the interactive "Seguir Misa" kinetic guide (`AppleMusicLyrics.tsx`).

---

## 2. Engineering Artifacts Catalog

| Document | Standard Conformance | Scope & Purpose | Lifecycle Status | Last Updated |
|---|---|---|:---:|:---:|
| [`docs/architecture.md`](./architecture.md) | **ISO/IEC/IEEE 42010:2022** | System Architecture Description: Tripartite ecosystem decomposition, C4 models (Context, Container, Component), plain-text Cheerio citation extraction, Obolus PoW challenge engine, CalVer protocol, and chat-style alignment matrix. | `[Approved]` | 2026-09-11 |
| [`docs/srs.md`](./srs.md) | **ISO/IEC/IEEE 29148:2018** | Software Requirements Specification: Functional requirements for Subproject 1 (`REQ-FUN-SCR`), Subproject 2 (`REQ-FUN-MIN`), Scraper Integration (`REQ-FUN-INT`), and Codebase Extraction (`REQ-FUN-EXT`) with executable BDD Gherkin scenarios, ISO 25010 NFRs, and RTM. | `[Approved]` | 2026-09-11 |
| [`docs/tasks.md`](./tasks.md) | **ISO/IEC/IEEE 12207:2017** | Execution Plan & Atomic Task Matrix: 6-milestone WBS (M1-M6), atomic task matrix (`TASK-M1-01` to `TASK-M6-05`), non-interactive verification commands, and release engineering checklist. | `[Approved]` | 2026-09-11 |
| [`PROJECT.md`](../PROJECT.md) | **Project Governance** | Top-level Project Index: Architecture overview, Feature Inventory, Milestones table, Interface Contracts, and Code Layout directory tree. | `[Approved]` | 2026-09-11 |

---

## 3. Subsystem Architecture Index

### Subsystem 1: Subproject 1 — Spanish Mass Readings Scraper (`spanish-mass-readings`)
- **Specification**: `docs/srs.md §3.1 (REQ-FUN-SCR-01 to 06)`
- **Architecture**: `docs/architecture.md §5.1`
- **Location**: `subprojects/spanish-mass-readings/`
- **Versioning**: Calendar Versioning (`CalVer 2026.09.0`)
- **Key Modules**:
  - `src/usccb-spanish.ts`: Spanish HTML scraper with unlinked `.address` plain-text citation parsing
  - `src/obolus.ts`: Automated cryptographic proof-of-work (PoW) solver for Pantheon/Varnish bot firewalls
  - `src/constants.ts`: Spanish Lectionary book dictionary and URL patterns
  - `bin/cli.ts`: Standalone CLI tool (`spanish-mass-readings get-mass --date YYYY-MM-DD`)

### Subsystem 2: Subproject 2 — Mass Transcript Mining & Curation Tool (`mass-transcript-miner`)
- **Specification**: `docs/srs.md §3.2 (REQ-FUN-MIN-01 to 05)`
- **Architecture**: `docs/architecture.md §5.2`
- **Location**: `subprojects/mass-transcript-miner/`
- **Key Modules**:
  - `src/ingest.ts`: Raw YouTube subtitle ingestion and noise cleaning (video `EkoysbFU47c`)
  - `src/segmenter.ts`: 10 Roman Rite canonical step segmenter
  - `src/dialogue-matcher.ts`: 18 dialogue pairs mapped from `rejoiceinfaith.org`
  - `src/chat-formatter.ts`: Chat alignment formatting: Priest Right (`isLeft: false`) vs Public Left (`isLeft: true`)
  - `data/`: Exported verified liturgical catalog `liturgical_catalog_guadalupe.json`

### Subsystem 3: Host Application Dual-Scraper Liturgical Route
- **Specification**: `docs/srs.md §3.3 (REQ-FUN-INT-01 to 02)`
- **Architecture**: `docs/architecture.md §5.3`
- **Source Artifact**: `src/app/api/mass-readings/route.ts`
- **Routing**:
  - `lang=es` $\rightarrow$ `subprojects/spanish-mass-readings` (`USCCBSpanish`)
  - `lang=en` $\rightarrow$ `catholic-mass-readings` (`USCCB`)
  - `lang=both` $\rightarrow$ Concurrently queries both via `Promise.all`
  - Fallback: 8-second timeout guard with static `FALLBACK_READINGS`

### Subsystem 4: Interactive "Seguir Misa" Kinetic Guide
- **Specification**: `docs/srs.md §3.3 (REQ-FUN-INT-03 to 04)`
- **Architecture**: `docs/architecture.md §5.3 & §8.2`
- **Source Artifacts**: `src/app/AppleMusicLyrics.tsx`, `src/app/global.css`
- **Alignment Classes**:
  - Celebrant / Priest: `.duet-right` (Right-aligned, 2.2rem font size)
  - Assembly / Public: `.duet-left` (Left-aligned, 1.3rem font size)

### Subsystem 5: Mobile Viewport Robustness & Geometry
- **Specification**: `docs/srs.md §5.3`
- **Architecture**: `docs/architecture.md §8.3`
- **Source Artifacts**: `src/app/global.css`, `src/components/GlobalModal.tsx`, `src/app/LandingClient.tsx`
- **Principles**: Dynamic viewport units (`100dvh`), mathematical safe flexbox (`justify-content: safe flex-end`), position-fixed body scroll locking.

---

## 4. Verification & Testing Traceability

Verification across the tripartite ecosystem is enforced through automated testing suites:
- **Subproject 1 Unit Tests**: `subprojects/spanish-mass-readings/tests/` (schema validation, citation extraction, Obolus PoW, CLI).
- **Subproject 2 Curation Tests**: `subprojects/mass-transcript-miner/tests/` (10 steps, 18 dialogue pairs, chat alignment).
- **Host Application E2E Harness**: `scripts/test-e2e.mjs` (217 tests across 5 tiers).
- **Mobile Viewport Stress Suites**: `scripts/adversarial-mobile-viewport-suite.mjs` (148 tests across 21 devices) and `scripts/modal-scroll-stress-suite.mjs` (24 tests).
- **Release Verification**: `scripts/verify-all-acceptance.sh` (validates all 5 user acceptance criteria).

Refer to [`docs/tasks.md`](./tasks.md) for full execution details.
