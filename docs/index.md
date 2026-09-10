# Master Documentation Index (MDI)

> **Repository**: `lapandilladejesusqro.org`  
> **Governing Standards**: ISO/IEC/IEEE 42010:2022, ISO/IEC/IEEE 29148:2018, ISO/IEC/IEEE 12207:2017  
> **Status**: `[Implemented]`  
> **Last Synchronized**: 2026-09-10T20:35:00Z  

---

## 1. Executive Summary & SSOT Governance

This Master Documentation Index (MDI) serves as the definitive Single Source of Truth (SSOT) for the architecture, specification, and execution lifecycle of **La Pandilla de Jesús Querétaro** digital platform. All architectural decisions, interface contracts, and lifecycle task tracking are governed by this index under international software engineering standards.

---

## 2. Engineering Artifacts Catalog

| Document | Standard Conformance | Scope & Purpose | Lifecycle Status | Last Updated |
|---|---|---|:---:|:---:|
| [`docs/architecture.md`](./architecture.md) | **ISO/IEC/IEEE 42010:2022** | System architecture, C4 context/container/component models, data flow pipelines, Mass Readings engine adapter (`catholic-mass-readings`), reliability patterns, and architectural traceability. | `[Implemented]` | 2026-09-10 |
| [`docs/srs.md`](./srs.md) | **ISO/IEC/IEEE 29148:2018** | Software Requirements Specification covering functional requirements (RF-01 through RF-10), Mass Guide scraper subsystem (`RF-08.1` `catholic-mass-readings`), canonical sequential UI injection (`RF-08.2`), direct launcher (`RF-08.3`), and acceptance criteria matrix. | `[Implemented]` | 2026-09-10 |
| [`docs/tasks.md`](./tasks.md) | **ISO/IEC/IEEE 12207:2017** | Execution roadmap, milestone task breakdown, atomic work breakdown structure (WBS), 5-tier test matrix, unit test specifications (`UT-SCR-01`..`08`), and Requirements Traceability Matrix (RTM). | `[Implemented]` | 2026-09-10 |

---

## 3. Subsystem Architecture Index

### Subsystem 1: Food Prayers Transcription & Central Data Layer (RF-01)
- **Specification**: `docs/srs.md §RF-01`
- **Architecture**: `docs/architecture.md §3.1 Subsystem 1`
- **Source Artifact**: `src/data/oracionesData.ts`

### Subsystem 2: Interactive Prayer Decks & Motion Physics (RF-02, RF-03, RF-04)
- **Specification**: `docs/srs.md §RF-02, §RF-03, §RF-04`
- **Architecture**: `docs/architecture.md §3.1 Subsystem 2`
- **Source Artifacts**: `src/app/LandingClient.tsx`, `src/app/global.css`

### Subsystem 3: Global Usability & Long-Press Tooltips (RF-05)
- **Specification**: `docs/srs.md §RF-05`
- **Architecture**: `docs/architecture.md §3.1 Subsystem 6`
- **Source Artifacts**: `src/utils/useLongPress.ts`, `src/app/global.css`

### Subsystem 4: Daily Mass Readings & Canonical Liturgical Guide (RF-08)
- **Specification**: `docs/srs.md §RF-08` (RF-08.1, RF-08.2, RF-08.3)
- **Architecture**: `docs/architecture.md §2.1, §3.1 Subsystem 4, §3.2.1`
- **Engine Provider**: `catholic-mass-readings` (^0.5.6) querying USCCB Lectionary
- **Source Artifacts**:
  - `src/app/api/mass-readings/route.ts` (Edge / Serverless route handler and model adapter)
  - `src/app/LandingClient.tsx` (Client consumer, state management, force-refresh launcher)
  - `src/app/massResponses.ts` (Canonical GIRM sequential injection and kinetic streaming)
  - `src/app/AppleMusicLyrics.tsx` (Interactive synchronized line-by-line viewer)

### Subsystem 5: Holy Days of Obligation & Recurrence Engine (RF-09)
- **Specification**: `docs/srs.md §RF-09`
- **Architecture**: `docs/architecture.md §3.1 Subsystem 3`
- **Source Artifacts**: `src/data/preceptoData.ts`, `src/utils/calendarExport.ts`

---

## 4. Verification & Testing Traceability

The testing harness is implemented in `scripts/test-e2e.mjs` executing zero-dependency native ESM assertion suites across 5 verification tiers:
- **Tier 1**: Feature Coverage (`T1-R1-01` through `T1-R10-05`)
- **Tier 2**: Boundary & Corner Cases
- **Tier 3**: Cross-Feature Pairwise Combinations
- **Tier 4**: Real-World User Journeys
- **Tier 5**: Adversarial Stress & Hardening

Refer to `docs/tasks.md §3` for complete test execution details.
