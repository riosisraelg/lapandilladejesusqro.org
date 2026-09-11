# Project: La Pandilla de Jesús Querétaro — Tripartite Liturgical Platform & Scraper Ecosystem

## 1. System Architecture & Project Overview
This project governs the expanded software ecosystem of **La Pandilla de Jesús Querétaro** (`lapandilladejesusqro.org`). It integrates three distinct software deliverables under formal international software engineering standards (ISO/IEC/IEEE 42010, ISO/IEC/IEEE 29148, ISO/IEC/IEEE 12207):

```
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 TRIPARTITE SOFTWARE ECOSYSTEM                                  │
│                                                                                                │
│  ┌───────────────────────────────────┐        ┌────────────────────────────────────────────┐   │
│  │ SUBPROJECT 1:                     │        │ SUBPROJECT 2:                              │   │
│  │ spanish-mass-readings             │        │ mass-transcript-miner                      │   │
│  │ --------------------------------- │        │ ------------------------------------------ │   │
│  │ • Independent Git Repository      │        │ • Internal Workspace Tool (No separate git)│   │
│  │ • Calendar Versioning: 2026.09.0  │        │ • Ingests YouTube Mass Transcripts         │   │
│  │ • Published via GitHub CLI (`gh`) │        │ • Partitions into 10 Roman Rite steps      │   │
│  │ • Scrapes bible.usccb.org/es/     │        │ • Pairs 18 canonical bilingual dialogues   │   │
│  │ • Cheerio plain-text citations    │        │ • Enforces chat alignment: Priest Right    │   │
│  │ • Obolus PoW challenge solver     │        │   (.duet-right) vs Public Left (.duet-left)│   │
│  └─────────────────┬─────────────────┘        └─────────────────────┬──────────────────────┘   │
│                    │                                                │                          │
│                    │ ESM Local Workspace Dependency                 │ Curated JSON Catalogs    │
│                    ▼                                                ▼                          │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────┐   │
│  │ HOST APPLICATION: lapandilladejesusqro.org (Next.js 15 App Router + React 19)           │   │
│  │ --------------------------------------------------------------------------------------- │   │
│  │ • Bilingual Route Handler: /api/mass-readings (dynamic lang=es|en|both branching)       │   │
│  │ • Sequential Liturgy of the Word injection into "Liturgia de la Palabra"                │   │
│  │ • Interactive "Seguir Misa" Kinetic Guide (AppleMusicLyrics.tsx)                        │   │
│  │ • Robust Mobile Viewport & Geometry Engine (100dvh, safe flexbox, fixed scroll lock)    │   │
│  └─────────────────────────────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Core Architectural Subsystems
1. **Subproject 1: Open Source Spanish Liturgy Scraper (`subprojects/spanish-mass-readings`)**:
   - Standalone Git repository published to GitHub (`riosisraelg/spanish-mass-readings`) via `gh` CLI.
   - Versioned using Calendar Versioning (`CalVer 2026.09.0`).
   - Architectural inspiration from `rcolfin/catholic-mass-readings`.
   - Dedicated Cheerio parser extracting unlinked plain-text citations from `.address` and classifying Spanish section headers.
   - Automated cryptographic proof-of-work (PoW) solver for Pantheon/Varnish Obolus bot challenges (`X_Obolus_Proof` cookie).
   - Standalone CLI executable (`bin/spanish-mass-readings`).
2. **Subproject 2: Mass Transcript Mining & Curation Tool (`subprojects/mass-transcript-miner`)**:
   - Internal tool ingesting raw YouTube video subtitle transcripts (video ID `EkoysbFU47c`, Basílica de Guadalupe, September 10, 2026).
   - Segments cues into 10 canonical Roman Rite steps (Rito Inicial through Rito de Conclusión).
   - Pairs celebrant utterances with 18 canonical Roman Missal assembly responses from `rejoiceinfaith.org`.
   - Explicit chat-style alignment: Celebrant / Priest lines format to `.duet-right` (`isLeft: false`), Assembly lines format to `.duet-left` (`isLeft: true`).
   - Exports verified JSON catalog to `src/data/liturgical_catalog_guadalupe.json`.
3. **Host Application Integration (`lapandilladejesusqro.org`)**:
   - `/api/mass-readings` route dynamically delegates between Subproject 1 (Spanish) and `catholic-mass-readings` (English).
   - Supports `lang=es`, `lang=en`, and `lang=both` (concurrent `Promise.all` returning combined bilingual liturgy).
   - UI consumers in `LandingClient.tsx` update seamlessly upon language toggle and support manual "↻ Actualizar" force reload.
   - `AppleMusicLyrics.tsx` consumes the curated catalog rendering celebrant sayings aligned right (2.2rem) and assembly responses aligned left (1.3rem).
4. **Mobile Viewport Geometry & Scroll Architecture (Preserved & Verified)**:
   - Dynamic viewport units (`100dvh` / `100svh`) across all modal overlays and animated keyframes.
   - Mathematical safe alignment `justify-content: safe flex-end;` preventing top-edge data loss.
   - Position-fixed mobile body scroll locking preserving `window.scrollY` offset.

---

## 2. Feature Inventory

| # | Feature | Description | Milestone | Source / Spec | Status |
|---|---|---|---|---|:---:|
| 1 | **Subproject 1 Directory & Package Scaffold** | Standalone npm package structure with `package.json` (`name: "spanish-mass-readings"`, `version: "2026.09.0"`), TypeScript config, and CLI entry point. | M2 | R1, REQ-FUN-SCR-06 | `[ ]` PLANNED |
| 2 | **USCCB Spanish Lectionary Cheerio Parser** | DOM extraction engine parsing plain-text `.address` citations (no anchor tags) and Spanish headers (`sectionTypeFromHeaderEs`). | M2 | R1, REQ-FUN-SCR-02,03 | `[ ]` PLANNED |
| 3 | **Obolus Anti-Bot Challenge PoW Solver** | Cryptographic proof-of-work solver for Pantheon/Varnish firewall (`X_Obolus_Proof`), enabling reliable live scraping. | M2 | R1, REQ-FUN-SCR-04 | `[ ]` PLANNED |
| 4 | **Subproject 1 CLI Executable** | Executable CLI binary (`bin/spanish-mass-readings`) supporting `--date`, `--citations-only`, and `--save` flags. | M2 | R1, REQ-FUN-SCR-05 | `[ ]` PLANNED |
| 5 | **Subproject 1 Standalone Git & CalVer Release** | Standalone Git repository initialized on `main`, remote origin set, pushed via `gh` CLI, and tagged with CalVer `2026.09.0`. | M6 | R1, REQ-FUN-SCR-06 | `[ ]` PLANNED |
| 6 | **Subproject 2 Directory & Transcript Ingest** | Ingestion pipeline for raw YouTube transcripts (`EkoysbFU47c`), cleaning audio tags (`[Música]`) and normalizing cues. | M3 | R2, REQ-FUN-MIN-01 | `[ ]` PLANNED |
| 7 | **10 Roman Rite Step Liturgical Segmenter** | Categorization of speech cues into 10 canonical Roman Rite steps (Rito Inicial through Rito de Conclusión). | M3 | R2, REQ-FUN-MIN-02 | `[ ]` PLANNED |
| 8 | **18 Canonical Dialogue Pairs Curation** | Pairing celebrant prompts with canonical bilingual Roman Missal assembly responses from `rejoiceinfaith.org`. | M3 | R2, REQ-FUN-MIN-03 | `[ ]` PLANNED |
| 9 | **Chat-Style Alignment Formatting** | Explicit data alignment: Celebrant / Priest $\rightarrow$ `.duet-right` (`isLeft: false`), Assembly $\rightarrow$ `.duet-left` (`isLeft: true`). | M3 | R2, REQ-FUN-MIN-04 | `[ ]` PLANNED |
| 10 | **Liturgical Catalog Archival Pipeline** | Compilation and export of curated bilingual catalog to `src/data/liturgical_catalog_guadalupe.json`. | M3 | R2, REQ-FUN-MIN-05 | `[ ]` PLANNED |
| 11 | **Host App Workspace & Path Alias Linkage** | Integration of `subprojects/spanish-mass-readings` into root `package.json` workspaces and `tsconfig.json` paths. | M4 | R3, REQ-NFR-MNT-01 | `[ ]` PLANNED |
| 12 | **Bilingual API Route (`/api/mass-readings`)** | Dynamic routing: `lang=es` queries Subproject 1, `lang=en` queries `catholic-mass-readings`, `lang=both` queries both. | M4 | R3, REQ-FUN-INT-01 | `[ ]` PLANNED |
| 13 | **UI Dynamic Language Switch & Mount Pre-fetch** | `LandingClient.tsx` auto-fetches readings on mount, switches language dynamically, and supports force refresh. | M4 | R3, REQ-FUN-INT-03 | `[ ]` PLANNED |
| 14 | **Kinetic Guide Chat Alignment Rendering** | `AppleMusicLyrics.tsx` renders celebrant lines right-aligned (2.2rem) and assembly lines left-aligned (1.3rem). | M4 | R2, REQ-FUN-INT-04 | `[ ]` PLANNED |
| 15 | **Codebase Extraction from Guadalupe Project** | Extraction and adaptation of proven Spanish logic from `~/teamwork_projects/guadalupe_mass_interactive`. | M2, M3 | R4, REQ-FUN-EXT-01 | `[ ]` PLANNED |
| 16 | **Mobile Viewport & Scroll Containment** | `100dvh` viewport units, safe flexbox, scroll chaining prevention, and position-fixed body scroll locking (389 tests passing). | Baseline | Follow-up 1 | `[x]` DONE |

---

## 3. Milestones & Lifecycle Roadmap

| # | Milestone Name | Scope | Dependencies | Status |
|---|---|---|---|:---:|
| **M1** | **Architecture, Requirements & Task Plan (ISO/IEEE)** | Author `docs/architecture.md` (ISO 42010), `docs/srs.md` (ISO 29148), `docs/tasks.md` (ISO 12207), `docs/index.md`, and `PROJECT.md`. | None | `[⏳]` In Progress |
| **M2** | **Subproject 1: Open Source Spanish Liturgy Scraper** | Build `subprojects/spanish-mass-readings`, Cheerio plain-text parser, Obolus solver, models, CLI, and unit test suite. | M1 | `[ ]` PLANNED |
| **M3** | **Subproject 2: Mass Transcript Mining & Curation Tool** | Build `subprojects/mass-transcript-miner`, 10-step segmenter, 18 dialogue pairs, chat formatter, and export curated catalog. | M1 | `[ ]` PLANNED |
| **M4** | **Host Application Integration** | Connect Subproject 1 into `/api/mass-readings`, upgrade `LandingClient.tsx` language toggle, and verify `AppleMusicLyrics.tsx` chat alignment. | M2, M3 | `[ ]` PLANNED |
| **M5** | **Multi-Tier Automated Verification** | Execute unit tests (Subprojects 1 & 2), E2E test harness (`test-e2e.mjs`), viewport stress suites, and production build. | M4 | `[ ]` PLANNED |
| **M6** | **Release Engineering, CalVer Tagging & GitHub CLI** | Initialize Subproject 1 git repo, push to GitHub via `gh`, tag `2026.09.0`, and run final forensic audit. | M5 | `[ ]` PLANNED |

---

## 4. Interface Contracts Between Modules

### 4.1 Subproject 1 ESM Interface (`spanish-mass-readings`)
```typescript
export interface USCCBSpanishOptions {
  httpClient?: HttpClient;
  timeoutMs?: number;
}

export class USCCBSpanish {
  constructor(options?: USCCBSpanishOptions);
  getTodayMass(): Promise<SerializedMass>;
  getMassFromDate(date: Date): Promise<SerializedMass>;
  getMassFromUrl(url: string): Promise<SerializedMass>;
}
```

### 4.2 Host App API Route Contract (`/api/mass-readings`)
- **GET Request**: `/api/mass-readings?date=YYYY-MM-DD&lang=es|en|both`
- **Output JSON (`MassReadingsResponse`)**:
```typescript
export interface MassReadingsResponse {
  date: string;
  source: 'spanish-mass-readings' | 'catholic-mass-readings' | 'fallback';
  isFallback: boolean;
  language: 'es' | 'en' | 'bilingual';
  firstReading: { citation: string; text: string };
  psalm: { citation: string; response: string; text: string };
  secondReading?: { citation: string; text: string };
  alleluia: { citation: string; verse: string };
  gospel: { citation: string; text: string };
  reflection?: string;
}
```

### 4.3 Subproject 2 Curated Catalog Contract (`SeguirMisaCatalog`)
```typescript
export interface LiturgicalTurn {
  id: string;
  stepId: string;
  speaker: 'priest' | 'assembly' | 'lector' | 'cantor';
  isLeft: boolean;          // false = Celebrant (Right), true = Assembly (Left)
  text: { es: string; en: string };
  exactPriestSayingEs?: string;
  cueStartSeconds?: number;
  cueEndSeconds?: number;
}
```

### 4.4 Chat Alignment Contract (`global.css` & `AppleMusicLyrics.tsx`)
```css
/* Celebrant / Priest: Right-aligned, large font */
.lyric-line.duet-right {
  text-align: right;
  font-size: 2.2rem;
  transform-origin: right center;
  color: rgba(255, 255, 255, 0.95);
}

/* Assembly / Public: Left-aligned, muted secondary font */
.lyric-line.duet-left {
  text-align: left;
  font-size: 1.3rem;
  transform-origin: left center;
  color: rgba(255, 255, 255, 0.5);
}
```

---

## 5. Code Layout & File Ownership

```
lapandilladejesusqro.org/
├── package.json                         [Root package: Next.js + workspaces: ["subprojects/*"]]
├── tsconfig.json                        [TypeScript paths: "spanish-mass-readings" -> subprojects/...]
├── PROJECT.md                           [Top-level project governance & index]
│
├── docs/                                [ISO/IEC/IEEE Formal Engineering Manuals]
│   ├── index.md                         [Master Documentation Index (MDI) SSOT]
│   ├── architecture.md                  [ISO 42010 System Architecture Description]
│   ├── srs.md                           [ISO 29148 Software Requirements Specification]
│   └── tasks.md                         [ISO 12207 Execution Plan & Atomic Task Matrix]
│
├── src/                                 [Host Application Source]
│   ├── app/
│   │   ├── api/
│   │   │   └── mass-readings/route.ts   [Bilingual API Route Handler: delegates to SP1 & catholic-mass-readings]
│   │   ├── LandingClient.tsx            [Mass Guide tabs, language toggle, force refresh]
│   │   ├── AppleMusicLyrics.tsx         [Kinetic lyrics viewer with .duet-right & .duet-left alignment]
│   │   ├── massResponses.ts             [Canonical GIRM sequential injection engine]
│   │   └── global.css                   [Monolithic CSS: 100dvh viewport, safe flexbox, duet typography]
│   ├── components/
│   │   └── GlobalModal.tsx              [React portal container with SSR hydration gate]
│   └── data/
│       └── liturgical_catalog_guadalupe.json [Curated bilingual Mass catalog from Subproject 2]
│
├── subprojects/
│   ├── spanish-mass-readings/           [SUBPROJECT 1: Independent Git Repository + CalVer 2026.09.0]
│   │   ├── .git/                        [Initialized git repository with remote origin on GitHub]
│   │   ├── package.json                 [name: "spanish-mass-readings", version: "2026.09.0", type: "module"]
│   │   ├── bin/cli.ts                   [CLI executable: spanish-mass-readings get-mass]
│   │   ├── src/
│   │   │   ├── index.ts                 [Barrel export]
│   │   │   ├── usccb-spanish.ts         [Core scraper: plain-text .address parser, header classifier]
│   │   │   ├── obolus.ts                [Proof-of-work challenge solver]
│   │   │   ├── models.ts                [Mass, Section, Reading, Verse, SerializedMass]
│   │   │   ├── constants.ts             [Spanish book catalog & URL formats]
│   │   │   └── utils.ts                 [Date helpers, citation normalizers]
│   │   ├── fixtures/2026-09-10.json     [Validated offline test fixture from guadalupe project]
│   │   └── tests/                       [Vitest unit tests for parser, obolus, and CLI]
│   │
│   └── mass-transcript-miner/           [SUBPROJECT 2: Internal Mining Tool (No separate git repo)]
│       ├── package.json                 [name: "mass-transcript-miner", type: "module"]
│       ├── src/
│       │   ├── index.ts                 [CLI runner for transcript batch processing]
│       │   ├── ingest.ts                [YouTube auto-subtitle parser & cleaner]
│       │   ├── segmenter.ts             [10 Roman Rite step segmenter]
│       │   ├── dialogue-matcher.ts      [18 dialogue pairs from rejoiceinfaith.org]
│       │   └── chat-formatter.ts        [Chat alignment formatter: Priest Right vs Public Left]
│       ├── data/
│       │   ├── raw_transcript_EkoysbFU47c.json  [Raw cues from Basílica de Guadalupe Mass]
│       │   └── canonical_dialogues_rejoice.json [18 canonical bilingual dialogue pairs]
│       └── tests/                       [Unit tests for segmentation and dialogue alignment]
│
├── scripts/                             [Verification & Automation Tooling]
│   ├── test-e2e.mjs                     [5-Tier Host Application E2E test harness (217 tests)]
│   ├── adversarial-mobile-viewport-suite.mjs [Mobile viewport layout stress suite (148 tests)]
│   ├── modal-scroll-stress-suite.mjs    [Scroll containment & body scroll lock stress suite (24 tests)]
│   └── verify-all-acceptance.sh         [Automated verification script for all 5 user acceptance criteria]
│
└── .agents/                             [Multi-Agent Coordination & Audit Metadata ONLY]
    ├── orchestrator_5/                  [Orchestrator plan, progress, dispatch]
    └── teamwork_preview_worker_m1/      [Worker M1 briefing, progress, handoff]
```

---

## 6. Acceptance Criteria Matrix

| Criteria # | Requirement | Acceptance Verification Method | Target Milestone |
|---|---|---|:---:|
| **AC-1** | Subproject 1 Scraper Programmatic Test | `npm run test:subproject1` fetches and parses Spanish readings into `SerializedMass` schema. | M2, M5 |
| **AC-2** | Subproject 1 Git, Remote & CalVer Tag | `cd subprojects/spanish-mass-readings && git remote -v && git tag -l "2026.09.0"` confirms clean repo, GitHub origin, and CalVer tag. | M6 |
| **AC-3** | Subproject 2 Mining Tool Separation & Alignment | `node subprojects/mass-transcript-miner/tests/test-alignment.mjs` verifies priest sayings separated from public responses with chat alignment metadata. | M3, M5 |
| **AC-4** | Scraper Integration Bilingual Dataset | `curl -s "http://localhost:3000/api/mass-readings?lang=both"` calls both scrapers and outputs merged readings for the target date. | M4, M5 |
| **AC-5** | Codebase Extraction Provenance | Script `scripts/verify-extraction-provenance.sh` confirms Spanish scraping logic originates from `~/teamwork_projects/guadalupe_mass_interactive`. | M2, M5 |
| **AC-6** | Zero Mobile Regression | `node scripts/adversarial-mobile-viewport-suite.mjs` and `node scripts/modal-scroll-stress-suite.mjs` pass 100%. | M5 |

---
*End of PROJECT.md.*
