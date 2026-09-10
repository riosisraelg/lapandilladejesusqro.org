# Project: Guadalupe Mass Interactive (`guadalupe_mass_interactive`)

Target Application Directory: `/Users/riosisraelg/teamwork_projects/guadalupe_mass_interactive`
Metadata Directory: `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/orchestrator_4`
Reference Request: `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/ORIGINAL_REQUEST.md`

## Architecture

### System Overview
`guadalupe_mass_interactive` is a modern Next.js web application built with React 19, TypeScript, and Tailwind CSS. It provides:
1. **Interactive "Seguir Misa" Guide**: A guided liturgy companion capturing the exact sayings of the celebrant priest from the Sept 10, 2026 Mass at the Basilica de Guadalupe (video `https://www.youtube.com/watch?v=EkoysbFU47c`), systematically paired with standard bilingual (Spanish / English) assembly responses from `https://rejoiceinfaith.org/Mass_responses_in_English_and_Spanish`.
2. **Spanish Daily Mass Readings**: Full Spanish daily liturgy for September 10, 2026 (1 Corintios 8, 1b-7. 11-13; Salmo 138; 1 Juan 4, 12; Lucas 6, 27-38), strictly conforming to the `rcolfin/catholic-mass-readings` data structure (`SerializedMass` / `SerializedSection` / `SerializedReading` / `SerializedVerse`).
3. **Dual Verification Layer**: Programmatic schema & content validation using Vitest + end-to-end browser automation using Playwright.

### Data Flow & Component Architecture
```
+--------------------------------------------------------------------------------------+
|                                    Client UI                                         |
|  +---------------------------+  +-------------------------+  +--------------------+  |
|  |   Seguir Misa Stepper     |  |   Bilingual Toggle      |  |  Readings Viewer   |  |
|  | (Priest vs Assembly Card) |  |   (ES / EN / Ambos)     |  | (First, Psalm, etc)|  |
|  +-------------^-------------+  +------------^------------+  +---------^----------+  |
+----------------|-----------------------------|-------------------------|-------------+
                 |                             |                         |
                 +-----------------------------+-------------------------+
                                               |
                                     +---------v---------+
                                     |  Application Core |
                                     +---------+---------+
                                               |
                  +----------------------------+---------------------------+
                  |                                                        |
        +---------v---------+                                    +---------v---------+
        |  API: /api/misa   |                                    | API: /api/readings|
        +---------+---------+                                    +---------+---------+
                  |                                                        |
    +-------------v-------------+                            +-------------v-------------+
    | Liturgical Catalog &      |                            | Spanish Readings Engine   |
    | Guadalupe Transcript      |                            | (rcolfin/catholic-mass-   |
    | (EkoysbFU47c + rejoice)   |                            | readings JSON schema)     |
    +---------------------------+                            +---------------------------+
```

---

## Feature Inventory

| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Repository & Harness Scaffolding | Next.js 15 App Router, React 19, TypeScript, Tailwind CSS, Vitest, Playwright | M1 | Survey |
| 2 | Shared Data Contracts & Types | TypeScript interfaces for `SerializedMass`, `SeguirMisaStep`, `BilingualText` | M1 | Survey |
| 3 | Spanish Readings Data Structure | Data models matching `rcolfin/catholic-mass-readings` (`SerializedMass`, etc.) | M2 | Prompt R2 |
| 4 | Spanish Readings for Sept 10, 2026 | Full Spanish text: 1 Cor 8, Salmo 138, 1 Jn 4, Lc 6 for 2026-09-10 | M2 | Prompt R2 |
| 5 | Spanish Readings API & Parser | `/api/mass-readings` endpoint serving structured Spanish readings | M2 | Prompt R2 |
| 6 | Readings Schema Validation Test | Programmatic Vitest verifying exact `catholic-mass-readings` schema | M2 | Acceptance Criteria |
| 7 | Readings Retrieval Test | Programmatic test verifying retrieval/display of Sept 10, 2026 readings | M2 | Acceptance Criteria |
| 8 | Priest's Sayings Extraction Data | Canonical verbatim transcript of priest from YouTube `EkoysbFU47c` | M3 | Prompt R1 |
| 9 | Bilingual Assembly Responses | Complete EN/ES assembly responses from `rejoiceinfaith.org` | M3 | Prompt R1 |
| 10 | Liturgical Catalog & Pairing Model | Step-by-step pairing of priest sayings with bilingual assembly responses | M3 | Prompt R1 |
| 11 | Priest Sayings Verification Test | Programmatic test verifying exact priest sayings extracted from YouTube | M3 | Acceptance Criteria |
| 12 | Bilingual Pairing Verification Test | Programmatic test verifying UI/model pairs priest with EN/ES responses | M3 | Acceptance Criteria |
| 13 | Interactive "Seguir Misa" UI | Linear stepper, active turn highlight, next/prev, section jump pills | M4 | Prompt R1 |
| 14 | Bilingual Display Modes | UI toggles for Spanish-only, English-only, and side-by-side bilingual | M4 | Prompt R1 |
| 15 | Readings UI Tab / Integration | Seamless view of Spanish daily readings within the liturgy guide | M4 | Prompt R2 |
| 16 | Video Sync Integration | Embedded YouTube player sync with active liturgical timestamps | M4 | Prompt R1 |
| 17 | Automated Browser Test | Playwright E2E test verifying interactive "seguir misa" navigation | M4 | Acceptance Criteria |
| 18 | Dual-Track Acceptance Test Suite | Comprehensive Tiers 1-4 opaque-box acceptance test suite | M5 | Acceptance Criteria |
| 19 | Forensic Integrity & Adversarial Audit | Verification that all implementations are genuine and meet standards | M5 | Orchestrator Protocol |

---

## Milestones

| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Repo & Test Scaffolding | Next.js 15, TS, Tailwind, Vitest, Playwright setup in target repo | none | DONE |
| M2 | Spanish Readings Integration | Sept 10, 2026 Spanish readings engine & `catholic-mass-readings` schema | M1 | IN_PROGRESS |
| M3 | Transcript & Bilingual Responses | Exact priest transcript (`EkoysbFU47c`) paired with `rejoiceinfaith.org` | M1 | IN_PROGRESS |
| M4 | Interactive UI ("Seguir Misa") | Interactive guide UI, stepper, bilingual toggle, Playwright browser test | M2, M3 | PLANNED |
| M5 | E2E Testing & Final Verification | Full acceptance test pass (Tiers 1-4), adversarial tests & forensic audit | M4 | PLANNED |

---

## Interface Contracts

### 1. `rcolfin/catholic-mass-readings` Data Contract
```typescript
export enum SectionType {
  READING = 0,
  PSALM = 1,
  ALLELUIA = 2,
  GOSPEL = 3,
}

export interface SerializedVerse {
  text: string;
  link?: string;
  book?: string;
}

export interface SerializedReading {
  text: string;
  verses: SerializedVerse[];
}

export interface SerializedSection {
  type: SectionType;
  header: string;
  readings: SerializedReading[];
}

export interface SerializedMass {
  url: string;
  title: string;
  date: string; // YYYY-MM-DD
  type_: string;
  sections: SerializedSection[];
}
```

### 2. Interactive "Seguir Misa" Guide Contract
```typescript
export type LiturgicalRite =
  | 'RITO_INICIAL'
  | 'LITURGIA_DE_LA_PALABRA'
  | 'LITURGIA_EUCARISTICA'
  | 'RITO_DE_LA_COMUNION'
  | 'RITO_DE_CONCLUSION';

export type SpeakerRole = 'priest' | 'assembly' | 'all' | 'lector' | 'choir';

export interface BilingualText {
  es: string;
  en: string;
  latin?: string;
  greek?: string;
}

export interface LiturgicalTurn {
  id: string;
  speaker: SpeakerRole;
  text: BilingualText;
  exactPriestSayingEs?: string; // Verbatim quote from YouTube transcript EkoysbFU47c
  rubrics?: BilingualText;
  timestampSeconds?: number;
  timecode?: string;
}

export interface SeguirMisaStep {
  id: string;
  rite: LiturgicalRite;
  title: BilingualText;
  description?: BilingualText;
  posture?: BilingualText;
  turns: LiturgicalTurn[];
  videoTimestampSeconds?: number;
  readingsRef?: string;
}

export interface SeguirMisaCatalog {
  massTitle: string;
  date: string;
  location: string;
  celebrant: string;
  youtubeVideoId: string;
  steps: SeguirMisaStep[];
}
```

---

## Code Layout

Target Repository: `/Users/riosisraelg/teamwork_projects/guadalupe_mass_interactive`
```
guadalupe_mass_interactive/
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── vitest.config.ts
├── playwright.config.ts
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   └── api/
│   │       ├── mass-readings/
│   │       │   └── route.ts
│   │       └── seguir-misa/
│   │           └── route.ts
│   ├── components/
│   │   ├── SeguirMisaGuide.tsx
│   │   ├── LiturgicalTurnCard.tsx
│   │   ├── BilingualToggle.tsx
│   │   ├── SectionNavigator.tsx
│   │   ├── ReadingsViewer.tsx
│   │   └── YouTubeSyncPlayer.tsx
│   ├── data/
│   │   ├── spanish_readings_2026_09_10.json
│   │   ├── guadalupe_transcript_2026_09_10.json
│   │   └── liturgical_catalog_guadalupe.json
│   ├── lib/
│   │   ├── readings-adapter.ts
│   │   └── seguir-misa-engine.ts
│   └── types/
│       ├── catholic-mass-readings.ts
│       └── seguir-misa.ts
└── tests/
    ├── unit/
    │   ├── priest-sayings.test.ts
    │   ├── bilingual-responses.test.ts
    │   ├── readings-retrieval.test.ts
    │   └── readings-schema.test.ts
    └── e2e/
        └── seguir-misa.spec.ts
```
