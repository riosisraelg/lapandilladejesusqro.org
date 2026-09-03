# ISO/IEC/IEEE 12207:2017 Software Life Cycle Task Plan & Execution Matrix

**System Name**: La Pandilla de Jesús — Querétaro Web Platform  
**Standard**: ISO/IEC/IEEE 12207:2017 (Systems and software engineering — Software life cycle processes)  
**Document Version**: 1.1.0  
**Date**: 2026-08-28  
**Status**: Approved & Authoritative  

---

## 1. Life Cycle Process Model & Methodology

### 1.1 Process Model Overview
In accordance with ISO/IEC/IEEE 12207:2017, the platform execution adheres to the **Software Implementation**, **Software Verification**, **Software Validation**, and **Software Configuration Management** processes across all functional milestones.

```
+--------------------------------------------------------------------------------------------------+
|                             ISO/IEC/IEEE 12207:2017 PROCESS LIFECYCLE                            |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   [M0: Architecture & Standards (ISO 42010, 29148, 12207)]                                       |
|                 │                                                                                |
|                 ▼                                                                                |
|   [M1: Scraper API Overhaul (RF-08.1)] ───────► [M2: Canonical UI Injection (RF-08.2)]           |
|                 │                                              │                                 |
|                 └──────────────────────┐                       ▼                                 |
|                                        ▼       [M3: Direct Access & Auto-fetch (RF-08.3)]        |
|                         [M4: 5-Tier Test Harness (Tiers 1-5)] ◄┘                                 |
|                                        │                                                         |
|                                        ▼                                                         |
|                         [M5: Build Verification & Regression]                                    |
|                                        │                                                         |
|                                        ▼                                                         |
|                         [M6: Forensic Audit & Production Release]                                |
+--------------------------------------------------------------------------------------------------+
```

---

## 2. Work Breakdown Structure (WBS) & Atomic Execution Matrix

### Milestone M0: Technical Standards & Architecture Documentation
- **Objective**: Author foundational IEEE architectural, requirements, and lifecycle documentation.

| Task ID | Task Description | Assignee | Affected Artifacts | Inputs | Outputs | Verification Method | Dependencies | Status |
|---|---|---|---|---|---|---|---|---|
| `TSK-M0-01` | Author ISO/IEC/IEEE 42010:2022 System Architecture Description | Docs Specialist | `docs/architecture.md` | Survey reports, GIRM rubrics | Authoritative architecture manual | Review against ISO 42010 standard | None | DONE |
| `TSK-M0-02` | Author ISO/IEC/IEEE 29148:2018 Software Requirements Specification | Docs Specialist | `docs/srs.md` | ORIGINAL_REQUEST.md, Stakeholder needs | Authoritative SRS with RF-08.1 to RF-08.3 & AC matrix | Review against ISO 29148 standard | `TSK-M0-01` | DONE |
| `TSK-M0-03` | Author ISO/IEC/IEEE 12207:2017 Life Cycle Task Execution Plan | Docs Specialist | `docs/tasks.md` | WBS & Test Matrix | Atomic task matrix TSK-M6-01 to TSK-M6-07 | Review against ISO 12207 standard | `TSK-M0-02` | DONE |

---

### Milestone M6: Mass Guide & Liturgical Readings Scraper Subsystem (RF-08)
- **Objective**: Deliver complete, verified, and canonical Mass readings scraping, sequential UI injection into the Liturgy of the Word, interactive kinetic text streaming, and direct one-touch launch.

| Task ID | Task Description | Assignee | Affected Artifacts | Inputs | Outputs | Verification Method | Dependencies | Status |
|---|---|---|---|---|---|---|---|---|
| `TSK-M6-01` | **Overhaul Daily Readings Scraper Route Handler** (`RF-08.1`) | Scraper Engineer | `src/app/api/mass-readings/route.ts` | Evangelizo XML feed format, `MassReadingsResponse` schema, `FALLBACK_READINGS` | High-fidelity XML parser, clean antiphon extraction, full psalm stanzas with `R.`, seasonal Alleluia builder, entity sanitizer, 6s timeout, 24h Edge caching | `npm test` (Unit tests `UT-SCR-01` to `UT-SCR-08`) + live API curl test | `TSK-M0-03` | PLANNED |
| `TSK-M6-02` | **Obsolete Accordion Removal from Mass UI** (`RF-08.2`) | UI Engineer | `src/app/LandingClient.tsx` | `LandingClient.tsx` state and Tab 2 render tree | Complete deletion of `showLecturasInResponses` state, toggle button, and redundant dropdown container from DOM | `npm test` (Integration test `IT-UI-01`) + DOM inspection | `TSK-M0-03` | PLANNED |
| `TSK-M6-03` | **Implement Sequential Canonical Injection in Liturgia de la Palabra** (`RF-08.2`) | UI Engineer | `src/app/LandingClient.tsx`, `src/app/massResponses.ts` | `MassReadingsResponse` object, Missal ordinary sequence | Direct dynamic embedding of 1st Reading, Psalm (response + all stanzas), conditional 2nd Reading, Alleluia, and Gospel into Section 2 | `npm test` (Integration test `IT-UI-02`) + visual inspection | `TSK-M6-01`, `TSK-M6-02` | PLANNED |
| `TSK-M6-04` | **Update Interactive Mode (`AppleMusicLyrics`) Kinetic Stream Feed** (`RF-08.2`) | UI Engineer | `src/app/LandingClient.tsx`, `src/app/AppleMusicLyrics.tsx` | `getCanonicalMassLines` generator function | Kinetic text stream generator producing ordered lines with speaker labels (`Lector`, `Salmista`, `Sacerdote`, `Pueblo`, `Todos`) and alignments for Section 2 | `npm test` (Integration test `IT-UI-03`) + full-screen interactive test | `TSK-M6-03` | PLANNED |
| `TSK-M6-05` | **Implement Direct Access Launcher and Client Mount Auto-Fetch** (`RF-08.3`) | UI Engineer | `src/app/LandingClient.tsx` | Hero & Nav button handlers, mount lifecycle hook | Hero "Guía de Misa" and "Seguir la Misa" buttons opening directly to Section 1 (Ritos Iniciales, index 0); background pre-fetch on page mount; offline fallback banner | `npm test` (Integration tests `IT-UI-04`, `IT-UI-05`) + manual click journey | `TSK-M6-03` | PLANNED |
| `TSK-M6-06` | **Implement Comprehensive Automated Test Suite (Tiers 1–5)** | QA Engineer | `scripts/test-e2e.mjs` | Test specifications for R1, R2, R3, and edge cases | Extended test harness containing $\ge 189$ passing tests across Tiers 1 to 5 | `npm test` (100% pass across all $\ge 189$ tests in < 100ms) | `TSK-M6-01` to `TSK-M6-05` | PLANNED |
| `TSK-M6-07` | **Full Regression Suite Execution and Next.js 15 Production Build Verification** | QA Engineer | Whole project | Next.js build toolchain, TypeScript strict compiler | Production build artifact (`.next/`), zero type errors, zero linter regressions | `npm run build` (Exit code 0) & `tsc --noEmit` | `TSK-M6-06` | PLANNED |

---

## 3. Detailed Verification & Test Execution Plan

### 3.1 Unit Testing Strategy: Scraper Engine (`TSK-M6-01`)
| Test ID | Test Category | Specification & Verification Criteria |
|---|---|---|
| `UT-SCR-01` | Weekday Liturgy Parsing | Parse Evangelizo XML with 1st Reading, Psalm, Gospel, and Patristic Meditation. Assert all fields are populated and citations match. |
| `UT-SCR-02` | Sunday / Solemnity with 2nd Reading | Parse XML containing `<reading_text3>`. Assert `secondReading` object is present with full citation and text. |
| `UT-SCR-03` | Responsorial Psalm Antiphon & Stanzas | Verify `psalm.response` contains the antiphon phrase and `psalm.text` contains all verse stanzas with recurring `R.` indicators without truncating verse 1. |
| `UT-SCR-04` | Gospel Acclamation (Alleluia) | Verify generation of seasonal Alleluia ("¡Aleluya, aleluya!" vs Lenten acclamation) and lectionary verse. |
| `UT-SCR-05` | Entity Decoding & CDATA | Verify extraction of CDATA sections and decoding of Spanish accented characters (`&aacute;`, `&eacute;`, `&iacute;`, `&oacute;`, `&uacute;`, `&ntilde;`, `&laquo;`, `&raquo;`). |
| `UT-SCR-06` | Timeout & Network Failure Fallback | When upstream fails or responds with HTTP 500, return `FALLBACK_READINGS` with status 200 and `isFallback: true`. |
| `UT-SCR-07` | Mexico City Timezone Normalization | Verify default date resolution aligns with `America/Mexico_City` timezone regardless of local runner clock. |
| `UT-SCR-08` | HTTP Cache-Control Headers | Verify `Cache-Control: public, s-maxage=86400, stale-while-revalidate=43200` on success. |

### 3.2 Component & Integration Testing Strategy (`TSK-M6-02` to `TSK-M6-05`)
| Test ID | Test Category | Specification & Verification Criteria |
|---|---|---|
| `IT-UI-01` | Accordion Removal | Confirm legacy `showLecturasInResponses` toggle and container are completely absent from DOM. |
| `IT-UI-02` | Canonical Sequential Injection | Verify GIRM order in Section 2: 1. Primera Lectura → 2. Salmo Responsorial (with R. and stanzas) → 3. Segunda Lectura (conditional) → 4. Aleluya → 5. Santo Evangelio. |
| `IT-UI-03` | Interactive Kinetic Stream Mapping | Verify `getCanonicalMassLines` produces structured lines with correct speaker tags (`Lector`, `Salmista`, `Sacerdote`, `Pueblo`, `Todos`) for Section 2. |
| `IT-UI-04` | Direct Access Launcher | Clicking "Guía de Misa" / "Seguir la Misa" opens modal directly at Section 1 ("Ritos Iniciales", index 0). |
| `IT-UI-05` | Client Mount Auto-Fetch | Verify `fetchDailyReadings()` executes on client component mount without requiring manual click. |
| `IT-UI-06` | Bilingual Rubrics Synchronization | Switching language between `es` and `en` updates liturgical dialogues while preserving scripture readings. |

### 3.3 5-Tier Regression Matrix Targets

| Tier | Focus Area | Target Test Count | Expected Pass Rate | Execution Time |
|---|---|:---:|:---:|:---:|
| **Tier 1** | **Feature Coverage (RF-01 to RF-10)** | $\ge 75$ tests | 100% | $\le 30\text{ms}$ |
| **Tier 2** | **Boundary & Corner Cases** | $\ge 65$ tests | 100% | $\le 25\text{ms}$ |
| **Tier 3** | **Cross-Feature Pairwise Combinations** | $\ge 23$ tests | 100% | $\le 15\text{ms}$ |
| **Tier 4** | **Real-World User Journeys** | $\ge 13$ tests | 100% | $\le 15\text{ms}$ |
| **Tier 5** | **Adversarial Stress & Hardening** | $\ge 13$ tests | 100% | $\le 15\text{ms}$ |
| **TOTAL** | **Comprehensive Regression Suite** | **$\ge 189$ Tests** | **100% PASS** | **$\le 100\text{ms}$** |

---

## 4. Requirements Traceability Matrix (RTM)

| Requirement ID | Requirement Description | Milestone Task | Affected Source Files | Primary Verification Test |
|---|---|---|---|---|
| **RF-01** | Food Prayers Transcription | `TSK-M1-01` | `src/data/oracionesData.ts` | Tier 1: `T1-R1-01` to `T1-R1-05` |
| **RF-02** | Auto-Day Selection & Decks | `TSK-M1-03` | `src/app/LandingClient.tsx` | Tier 1: `T1-R2-01` to `T1-R2-05` |
| **RF-03** | Infinite Swipe Animations | `TSK-M2-01` | `src/app/LandingClient.tsx`, `global.css` | Tier 1: `T1-R3-01` to `T1-R3-05` |
| **RF-04** | Dynamic Color Tones | `TSK-M2-03` | `src/app/LandingClient.tsx`, `global.css` | Tier 1: `T1-R4-01` to `T1-R4-05` |
| **RF-05** | Global Long-Press Tooltips | `TSK-M3-01` | `src/utils/useLongPress.ts`, `global.css` | Tier 1: `T1-R5-01` to `T1-R5-05` |
| **RF-06** | Event OG Images & Modals | `TSK-M4-01` | `src/app/api/og/route.tsx`, `calendario/` | Tier 1: `T1-R6-01` to `T1-R6-05` |
| **RF-07** | Rosary UI & Top Counter | `TSK-M5-01` | `src/data/oracionesData.ts`, `LandingClient.tsx` | Tier 1: `T1-R7-01` to `T1-R7-05` |
| **RF-08.1** | Daily Scraper API Engine | `TSK-M6-01` | `src/app/api/mass-readings/route.ts` | Tier 1: `T1-R8-01` to `T1-R8-05`, `UT-SCR-01..08` |
| **RF-08.2** | Canonical UI Injection | `TSK-M6-02`, `TSK-M6-03`, `TSK-M6-04` | `src/app/LandingClient.tsx`, `massResponses.ts` | Tier 1: `T1-R8-06` to `T1-R8-10`, `IT-UI-01..03` |
| **RF-08.3** | Direct Access & Auto-fetch | `TSK-M6-05` | `src/app/LandingClient.tsx` | Tier 1: `T1-R8-11` to `T1-R8-15`, `IT-UI-04..06` |
| **RF-09** | Misas de Precepto & Calendar | `TSK-M7-01` | `src/data/preceptoData.ts`, `calendarExport.ts` | Tier 1: `T1-R9-01` to `T1-R9-05` |
| **RF-10** | Autonomous Commits & Tags | `TSK-M9-01` | Git repository, `docs/tasks.md` | Tier 1: `T1-R10-01` to `T1-R10-05` |

---

## 5. Configuration Management & Release Tagging

### 5.1 Conventional Commit Convention
- Types: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`.
- Scopes: `docs`, `api-scraper`, `canonical-ui`, `direct-mass`, `testing`, `release`.

### 5.2 Release Tagging Roadmap
```
v1.0.0-m0.docs-standards     -> Foundational ISO 42010, ISO 29148, ISO 12207 manuals
v1.1.0-m1.scraper-overhaul   -> Scraper API engine with complete psalm stanzas, alleluia, and entity decoding
v1.1.0-m2.canonical-ui       -> Obsolete accordion removed, sequential injection in Liturgia de la Palabra
v1.1.0-m3.direct-mass        -> Direct Mass launcher and mount auto-fetch
v1.1.0-m4.e2e-verified       -> 100% passing across ≥189 automated test assertions
v1.1.0                       -> Official production release of upgraded Mass Readings platform
```
