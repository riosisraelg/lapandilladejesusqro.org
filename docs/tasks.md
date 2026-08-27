# ISO/IEC/IEEE 12207:2017 Software Life Cycle Task Plan & Execution Matrix

**System Name**: La Pandilla de Jesús — Querétaro Web Platform  
**Standard**: ISO/IEC/IEEE 12207:2017 (Systems and software engineering — Software life cycle processes)  
**Document Version**: 1.0.0  
**Date**: 2026-08-27  
**Status**: Approved & Authoritative  

---

## 1. Life Cycle Process Model & Methodology

### 1.1 Process Model Overview
In accordance with ISO/IEC/IEEE 12207:2017, the platform execution adheres to the **Software Implementation**, **Software Verification**, **Software Validation**, and **Software Configuration Management** processes.

```
+--------------------------------------------------------------------------------------------------+
|                             ISO/IEC/IEEE 12207:2017 PROCESS LIFECYCLE                            |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   [M0: Architecture & Standards]                                                                 |
|                 |                                                                                |
|                 v                                                                                |
|   [M1: Food Prayers & Decks] ---------> [M2: Swipe & Dynamic Tones] -----> [M3: Tooltips/Haptic] |
|                 |                                                                    |           |
|                 +----------------------------+                                       |           |
|                                              v                                       v           |
|   [M4: OG Images & Modals] <-------- [M5: Rosary UI & Counter] <---------------------+           |
|                 |                                                                                |
|                 v                                                                                |
|   [M6: Mass Guide & Scraper] -------> [M7: Misas de Precepto & Export]                           |
|                                                      |                                           |
|                                                      v                                           |
|                                        [M8: 5-Tier E2E Verification]                             |
|                                                      |                                           |
|                                                      v                                           |
|                                        [M9: Git Commits, Tags & Push]                            |
+--------------------------------------------------------------------------------------------------+
```

---

## 2. Work Breakdown Structure (WBS) & Atomic Execution Matrix

### Milestone M0: Technical Standards & Verification Infrastructure
- **Objective**: Author foundational IEEE architectural, requirement, and lifecycle documentation and establish the 5-tier opaque-box E2E test harness.

| Task ID | Task Description | Assignee | Affected Artifacts | Completion Verification Criteria | Dependencies | Status |
|---|---|---|---|---|---|---|
| `TSK-M0-01` | Author ISO/IEC/IEEE 42010:2022 Architecture Description | Documentation Specialist | `docs/architecture.md` | All viewpoints, module boundaries, system context, and quality attributes documented. | None | DONE |
| `TSK-M0-02` | Author ISO/IEC/IEEE 29148:2018 Software Requirements Specification | Requirements Engineer | `docs/srs.md` | RF-01 to RF-10 with inputs, schemas, and acceptance criteria documented. | `TSK-M0-01` | DONE |
| `TSK-M0-03` | Author ISO/IEC/IEEE 12207:2017 Life Cycle Task Execution Plan | Implementation Lead | `docs/tasks.md` | Complete atomic task matrix, traceability, and semver tagging strategy defined. | `TSK-M0-02` | DONE |
| `TSK-M0-04` | Establish 5-Tier E2E Opaque-Box Test Infrastructure | QA Engineer | `TEST_INFRA.md`, `scripts/test-e2e.mjs` | Automated test runner verifying Tier 1 (50 tests), Tier 2 (50 tests), Tier 3, Tier 4, Tier 5. | None | DONE |

---

### Milestone M1: Food Prayers Transcription & Auto-Day Deck Implementation
- **Objective**: Populate the dedicated "Prayers for Food" deck with all 7 days of *Bendicional* meal blessings and thanksgivings, with automatic day-of-week detection.

| Task ID | Task Description | Assignee | Affected Artifacts | Completion Verification Criteria | Dependencies | Status |
|---|---|---|---|---|---|---|
| `TSK-M1-01` | Transcribe and structure 7-day Catholic Food Prayers (*Bendicional* nn. 883-884) | Implementer | `src/data/oracionesData.ts` | All 18 source images transcribed into Sunday-Saturday Antes/Después data structures with zero missing verses. | `TSK-M0-03` | PLANNED |
| `TSK-M1-02` | Implement Food Prayers deck generator function (`getFoodPrayersDeck`) | Implementer | `src/data/oracionesData.ts` | Returns ordered array of 7 `PrayerCard` items with proper titles, rubrics, and IDs. | `TSK-M1-01` | PLANNED |
| `TSK-M1-03` | Implement Auto-Day of Week detection and initial card index resolution | Implementer | `src/app/LandingClient.tsx` | Deck opens directly to card matching `new Date().getDay()` while allowing manual swipe. | `TSK-M1-02` | PLANNED |
| `TSK-M1-04` | Overhaul Food Deck CSS viewport to minimalist Rosary style | Implementer | `src/app/global.css` | Minimalist layout maximizing screen space for text, eliminating redundant margins. | `TSK-M1-03` | PLANNED |
| `TSK-M1-05` | Execute Tier 1 & Tier 2 tests for Food Prayers & Auto-Day Deck | QA Engineer | `scripts/test-e2e.mjs` | 100% pass on Food Prayers verification tests. | `TSK-M1-04` | PLANNED |

---

### Milestone M2: Infinite Swipe Animations & Dynamic Brand Color Tone Engine
- **Objective**: Replace complex legacy deck animations with a minimalist infinite swipe gesture loop and dynamic HSL brand tone calculation.

| Task ID | Task Description | Assignee | Affected Artifacts | Completion Verification Criteria | Dependencies | Status |
|---|---|---|---|---|---|---|
| `TSK-M2-01` | Implement circular modulo index navigation for continuous infinite loop | Implementer | `src/app/LandingClient.tsx` | Swiping left on last card loops to first; swiping right on first loops to last. | `TSK-M1-03` | PLANNED |
| `TSK-M2-02` | Streamline touch drag physics & 3D CSS transition matrix | Implementer | `src/app/LandingClient.tsx`, `src/app/global.css` | Physics threshold (80px), GPU-accelerated `translate3d`, zero frame drops. | `TSK-M2-01` | PLANNED |
| `TSK-M2-03` | Implement dynamic HSL color tone generator per deck index | Implementer | `src/app/LandingClient.tsx`, `src/app/global.css` | Programmatic lightness/chroma modulation maintaining WCAG 4.5:1 contrast. | `TSK-M2-02` | PLANNED |
| `TSK-M2-04` | Execute Tier 1 & Tier 2 tests for Infinite Swipe & Dynamic Tones | QA Engineer | `scripts/test-e2e.mjs` | Modulo mathematics and HSL calculation tests pass 100%. | `TSK-M2-03` | PLANNED |

---

### Milestone M3: Global Long-Press Tooltips & Haptic Feedback System
- **Objective**: Ensure all interactive buttons support standard 450ms long-press tooltips with tactile vibration feedback.

| Task ID | Task Description | Assignee | Affected Artifacts | Completion Verification Criteria | Dependencies | Status |
|---|---|---|---|---|---|---|
| `TSK-M3-01` | Author reusable `useLongPress` gesture hook | Implementer | `src/utils/useLongPress.ts` | 450ms timer, scroll cancel detection, and `navigator.vibrate([20])` trigger. | `TSK-M0-03` | PLANNED |
| `TSK-M3-02` | Wire `data-tooltip` attributes across all buttons in LandingClient & Calendario | Implementer | `src/app/LandingClient.tsx`, `src/app/calendario/CalendarioClient.tsx` | All navigation, modal, and action buttons declare descriptive tooltips. | `TSK-M3-01` | PLANNED |
| `TSK-M3-03` | Optimize tooltip popover CSS positioning and delay behavior | Implementer | `src/app/global.css` | Instant mobile tooltip display on hold; 1.8s delay on desktop hover; modal backdrop cleanup. | `TSK-M3-02` | PLANNED |
| `TSK-M3-04` | Execute Tier 1 & Tier 2 tests for Long-Press Tooltips | QA Engineer | `scripts/test-e2e.mjs` | Touch timing, cancellation, and DOM tooltip attributes pass 100%. | `TSK-M3-03` | PLANNED |

---

### Milestone M4: Dynamic Event OG Image Generator & Shareable Deep-Linked Modals
- **Objective**: Create the serverless `/api/og` dynamic image generator and implement unique URL routing that automatically opens event modals.

| Task ID | Task Description | Assignee | Affected Artifacts | Completion Verification Criteria | Dependencies | Status |
|---|---|---|---|---|---|---|
| `TSK-M4-01` | Author dynamic Open Graph image generation endpoint using `next/og` | Implementer | `src/app/api/og/route.tsx` | Returns 1200x630px PNG image with Catholic branding, date, and category. | `TSK-M0-03` | PLANNED |
| `TSK-M4-02` | Implement unique deep-link URL parsing in `/calendario` (`?evento=[id]`) | Implementer | `src/app/calendario/page.tsx`, `src/app/calendario/CalendarioClient.tsx` | Visiting `/calendario?evento=[id]` immediately renders the event detail modal. | `TSK-M4-01` | PLANNED |
| `TSK-M4-03` | Integrate dynamic Open Graph `<meta>` tags via `generateMetadata` | Implementer | `src/app/calendario/page.tsx` | Social platforms render custom OG image preview for shared event URLs. | `TSK-M4-02` | PLANNED |
| `TSK-M4-04` | Execute Tier 1 & Tier 2 tests for Event OG Images & Deep-Linking | QA Engineer | `scripts/test-e2e.mjs` | Image dimensions, HTTP status, and URL query handling pass 100%. | `TSK-M4-03` | PLANNED |

---

### Milestone M5: Rosary UI Overhaul, 5-Element Mystery Sequence & Top Counter
- **Objective**: Redesign the Rosary experience with untruncated text, collapsible repeats, 5-element mystery sequence, dedicated sub-decks, and top-bar vibrating bead counter.

| Task ID | Task Description | Assignee | Affected Artifacts | Completion Verification Criteria | Dependencies | Status |
|---|---|---|---|---|---|---|
| `TSK-M5-01` | Expand `MysteryItem` schema to full 5-element sequence in `oracionesData.ts` | Implementer | `src/data/oracionesData.ts` | All 20 mysteries include artwork/icon, biblicalRef, scriptureText, meditation, reflectionQuestion. | `TSK-M1-01` | PLANNED |
| `TSK-M5-02` | Partition Rosary into dedicated sub-decks (Opening, Mysteries, Concluding) | Implementer | `src/data/oracionesData.ts`, `src/app/LandingClient.tsx` | Clean separation between introductory prayers, decades, and concluding litany. | `TSK-M5-01` | PLANNED |
| `TSK-M5-03` | Implement collapsible nested repeated prayers component | Implementer | `src/app/LandingClient.tsx`, `src/app/global.css` | Tapping expands/collapses Padre Nuestro, 10 Ave Marías, Gloria, Jaculatorias. | `TSK-M5-02` | PLANNED |
| `TSK-M5-04` | Implement top-bar vibrating bead counter button adjacent to Close 'X' | Implementer | `src/app/LandingClient.tsx`, `src/app/global.css` | Top button displays count `0/10` to `10/10`, increments on tap, and vibrates device. | `TSK-M5-03` | PLANNED |
| `TSK-M5-05` | Execute Tier 1 & Tier 2 tests for Rosary UI & Counter | QA Engineer | `scripts/test-e2e.mjs` | 5-element mystery sequence and decade counter logic pass 100%. | `TSK-M5-04` | PLANNED |

---

### Milestone M6: Standalone Mass Guide, Roman Missal Dialogues & Liturgy Scraper
- **Objective**: Enhance the Mass Guide with missing priest dialogues, traditional Mexican hymns, a standalone launcher button, and daily Mass readings edge scraper.

| Task ID | Task Description | Assignee | Affected Artifacts | Completion Verification Criteria | Dependencies | Status |
|---|---|---|---|---|---|---|
| `TSK-M6-01` | Expand `massResponses.ts` with complete Liturgy of the Word & Priest Communion Prayers | Implementer | `src/app/massResponses.ts` | Includes Fractio Panis, Priest private prayer before communion, purification, and blessing. | `TSK-M0-03` | PLANNED |
| `TSK-M6-02` | Add traditional Mexican sung versions (Gloria de Mejía, Santo, Cordero de Dios) | Implementer | `src/app/massResponses.ts` | Verbatim lyrics and antiphons for traditional Mexican liturgical singing. | `TSK-M6-01` | PLANNED |
| `TSK-M6-03` | Implement `/api/mass-readings` daily Mass readings scraper endpoint | Implementer | `src/app/api/mass-readings/route.ts` | Fetches Evangelizo XML, parses readings/psalms, caches with 24h revalidation. | `TSK-M6-02` | PLANNED |
| `TSK-M6-04` | Convert Mass Guide to standalone launcher button in `LandingClient.tsx` | Implementer | `src/app/LandingClient.tsx`, `src/app/global.css` | Prominent dedicated button opening complete Mass Guide modal; legacy tab removed. | `TSK-M6-03` | PLANNED |
| `TSK-M6-05` | Execute Tier 1 & Tier 2 tests for Mass Guide & Scraper | QA Engineer | `scripts/test-e2e.mjs` | Scraper XML parsing, priest prayers, and Mexican songs pass 100%. | `TSK-M6-04` | PLANNED |

---

### Milestone M7: Misas de Precepto Holy Days Integration & Calendar Export
- **Objective**: Integrate all Canon 1246 & CEM Holy Days of Obligation into the Jesus calendar with Computus algorithm and multi-platform export engine.

| Task ID | Task Description | Assignee | Affected Artifacts | Completion Verification Criteria | Dependencies | Status |
|---|---|---|---|---|---|---|
| `TSK-M7-01` | Implement liturgical Computus algorithm & Canon 1246/CEM Holy Days generator | Implementer | `src/data/preceptoData.ts` | Computes Easter and projects all fixed and movable Misas de Precepto for any year. | `TSK-M4-02` | PLANNED |
| `TSK-M7-02` | Author universal calendar export generators (Google, Apple, Outlook, Yahoo) | Implementer | `src/utils/calendarExport.ts` | Generates valid web links and RFC 5545 `.ics` blobs for all calendar providers. | `TSK-M7-01` | PLANNED |
| `TSK-M7-03` | Integrate Misas de Precepto into `CalendarioClient.tsx` with badge & layered modal | Implementer | `src/app/calendario/CalendarioClient.tsx`, `src/app/global.css` | Events display precept badge; modal provides multi-export buttons. | `TSK-M7-02` | PLANNED |
| `TSK-M7-04` | Execute Tier 1 & Tier 2 tests for Misas de Precepto & Export | QA Engineer | `scripts/test-e2e.mjs` | Computus calculation, precept dates, and export links pass 100%. | `TSK-M7-03` | PLANNED |

---

### Milestone M8: Full E2E 5-Tier Verification Suite & Adversarial Hardening
- **Objective**: Execute comprehensive opaque-box test suite across all 5 tiers (Feature coverage, Boundary analysis, Pairwise combinations, Real-world scenarios, and Adversarial stress testing).

| Task ID | Task Description | Assignee | Affected Artifacts | Completion Verification Criteria | Dependencies | Status |
|---|---|---|---|---|---|---|
| `TSK-M8-01` | Run Tier 1 Feature Coverage test suite (50+ tests) | QA Engineer | `scripts/test-e2e.mjs` | 100% pass across all 10 features (RF-01 to RF-10). | `TSK-M1-05` to `TSK-M7-04` | PLANNED |
| `TSK-M8-02` | Run Tier 2 Boundary & Corner Cases suite (50+ tests) | QA Engineer | `scripts/test-e2e.mjs` | 100% pass on leap years, offline fallbacks, and gesture edge bounds. | `TSK-M8-01` | PLANNED |
| `TSK-M8-03` | Run Tier 3 Cross-Feature Pairwise Combinations suite | QA Engineer | `scripts/test-e2e.mjs` | 100% pass on deck navigation + color, rosary + counter, precept + OG. | `TSK-M8-02` | PLANNED |
| `TSK-M8-04` | Run Tier 4 Real-World Application Scenarios suite | QA Engineer | `scripts/test-e2e.mjs` | 100% pass on end-to-end user journeys. | `TSK-M8-03` | PLANNED |
| `TSK-M8-05` | Execute Tier 5 Adversarial Stress & Build Compilation Verification | QA Engineer | `scripts/test-e2e.mjs`, `package.json` | Clean `npm run build` with zero type errors and zero build warnings. | `TSK-M8-04` | PLANNED |

---

### Milestone M9: Granular Git Commits, Semver Tagging & Production Push
- **Objective**: Create granular atomic git commits, assign semantic version tags for each milestone, and push all commits/tags to remote origin.

| Task ID | Task Description | Assignee | Affected Artifacts | Completion Verification Criteria | Dependencies | Status |
|---|---|---|---|---|---|---|
| `TSK-M9-01` | Create granular git commits for each milestone following Conventional Commits | Implementer | Git repository history | Clean git log with descriptive atomic commit messages. | `TSK-M8-05` | PLANNED |
| `TSK-M9-02` | Create semantic version tags for all milestone checkpoints | Implementer | Git repository tags | Tags created: `v1.0.0-m1.food-prayers`, `v1.0.0-m2.decks-swipe`, ..., `v1.0.0`. | `TSK-M9-01` | PLANNED |
| `TSK-M9-03` | Push all commits and semantic version tags to remote repository | Implementer | Remote Git repository | `git push origin main --tags` completes successfully. | `TSK-M9-02` | PLANNED |

---

## 3. Requirements Traceability Matrix (RTM)

| Requirement ID | Requirement Title | Milestone | Core Source Files | Primary Verification Test |
|---|---|---|---|---|
| **RF-01** | Food Prayers Transcription | M1 | `src/data/oracionesData.ts` | Tier 1: `T1-R1-01` to `T1-R1-05` |
| **RF-02** | Auto-Day Selection & Decks | M1 | `src/app/LandingClient.tsx` | Tier 1: `T1-R2-01` to `T1-R2-05` |
| **RF-03** | Infinite Swipe Animations | M2 | `src/app/LandingClient.tsx`, `global.css` | Tier 1: `T1-R3-01` to `T1-R3-05` |
| **RF-04** | Dynamic Color Tones | M2 | `src/app/LandingClient.tsx`, `global.css` | Tier 1: `T1-R4-01` to `T1-R4-05` |
| **RF-05** | Global Long-Press Tooltips | M3 | `src/utils/useLongPress.ts`, `global.css` | Tier 1: `T1-R5-01` to `T1-R5-05` |
| **RF-06** | Event OG Images & Modals | M4 | `src/app/api/og/route.tsx`, `calendario/` | Tier 1: `T1-R6-01` to `T1-R6-05` |
| **RF-07** | Rosary UI & Top Counter | M5 | `src/data/oracionesData.ts`, `LandingClient.tsx`| Tier 1: `T1-R7-01` to `T1-R7-05` |
| **RF-08** | Mass Guide & Liturgy Scraper | M6 | `src/app/massResponses.ts`, `api/mass-readings/`| Tier 1: `T1-R8-01` to `T1-R8-05` |
| **RF-09** | Misas de Precepto & Calendar | M7 | `src/data/preceptoData.ts`, `calendarExport.ts` | Tier 1: `T1-R9-01` to `T1-R9-05` |
| **RF-10** | Autonomous Commits & Tags | M9 | Git repo, `scripts/test-e2e.mjs` | Tier 1: `T1-R10-01` to `T1-R10-05` |

---

## 4. Configuration Management & Semantic Version Tagging Strategy

### 4.1 Git Branching & Commit Conventions
- Branch: `main` (trunk-based development for autonomous multi-agent pipeline).
- Commit format: `<type>(<scope>): <summary>`
  - Types: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`.
  - Scopes: `docs`, `prayers`, `decks`, `tooltips`, `og-images`, `rosary`, `mass-guide`, `precepto`, `e2e`, `release`.

### 4.2 Semantic Version Tagging Roadmap

```
v1.0.0-m0.docs-standards     -> Technical manuals (ISO 42010, ISO 29148, ISO 12207, TEST_INFRA)
v1.0.0-m1.food-prayers       -> Complete Catholic Food Prayers deck & auto-day detection
v1.0.0-m2.decks-swipe        -> Infinite swipe animations & dynamic HSL brand tones
v1.0.0-m3.tooltips           -> Global long-press tooltips with haptic feedback
v1.0.0-m4.og-images          -> Dynamic OG image generation (/api/og) & deep-linked event URLs
v1.0.0-m5.rosary-ui          -> 5-element mystery sequence, untruncated text, top vibrating counter
v1.0.0-m6.mass-guide         -> Standalone button, Roman Missal dialogues, Mexican hymns, scraper
v1.0.0-m7.misas-precepto     -> Computus Holy Days engine & multi-calendar export (.ics, GCal, Outlook)
v1.0.0-m8.e2e-verified       -> 100% passing across 5-tier test suite
v1.0.0                       -> Final production release tag pushed to remote repository
```
