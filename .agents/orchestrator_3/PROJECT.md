# Project: Replace Mass Readings Engine with catholic-mass-readings

## Architecture
- **Upstream Provider**: `catholic-mass-readings` (version 0.5.6, USCCB Lectionary scraper using Cheerio).
- **Backend API Adapter**: `src/app/api/mass-readings/route.ts` (Next.js 15 App Router Route Handler, Node.js runtime).
- **Domain Contract**: `MassReadingsResponse` (`firstReading`, `psalm`, `secondReading`, `alleluia`, `gospel`, `liturgicalDay`, `date`, `isFallback`, `source`).
- **Frontend Consumer**: `src/app/LandingClient.tsx` (consumes `MassReadingsResponse`, triggers fetch on mount, force re-fetch on "↻ Actualizar").
- **Kinetic Audio-Liturgical Engine**: `src/app/massResponses.ts` (`getCanonicalMassLines`, `getCanonicalMassSection`).
- **Test Infrastructure**: `scripts/test-e2e.mjs` (ESM test runner executed via `npm test`).
- **Documentation Standards**: ISO/IEC/IEEE 42010 (`docs/architecture.md`), ISO/IEC/IEEE 29148 (`docs/srs.md`), ISO/IEC/IEEE 12207 (`docs/tasks.md`).

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Package Installation | Install `catholic-mass-readings` in `package.json` dependencies | M1 | Survey (Explorer 2) |
| 2 | Backend Route Migration | Replace Evangelizo XML scraper with `catholic-mass-readings` in `src/app/api/mass-readings/route.ts` mapping to `MassReadingsResponse` | M1 | ORIGINAL_REQUEST R1 |
| 3 | Responsorial Psalm & Alleluia Parsing | Parse antiphon response `R.`, recurring verses/stanzas, and seasonal Alleluia from `catholic-mass-readings` | M1 | ORIGINAL_REQUEST R1, Survey |
| 4 | Offline / Error Fallback Resilience | Retain `FALLBACK_READINGS` and timeout/error handling to prevent downtime | M1 | Survey (Explorer 1 & 2) |
| 5 | Language Parameter Handling | Read and respect `lang` query parameter ('es', 'en') gracefully per package capabilities | M1 | ORIGINAL_REQUEST R2 |
| 6 | Frontend Integration & UI Display | Ensure `LandingClient.tsx` displays First Reading, Psalm, Second Reading (conditional), Alleluia, and Gospel cleanly | M1 | ORIGINAL_REQUEST R3 |
| 7 | UI "↻ Actualizar" Button | Ensure clicking "↻ Actualizar" force refreshes readings without React errors | M1 | Acceptance Criteria, R3 |
| 8 | ISO Documentation Updates | Update `docs/architecture.md` (ISO 42010), `docs/srs.md` (ISO 29148), and `docs/tasks.md` (ISO 12207) | M1 | Engineering Standards, Survey 3 |
| 9 | Test Suite Adaptation & Verification | Adapt `scripts/test-e2e.mjs` R8 tests for `catholic-mass-readings` and verify zero regressions | M1 | Engineering Standards, Survey 3 |

## Code Layout
- `package.json`: Project dependencies.
- `src/app/api/mass-readings/route.ts`: API Route Handler and `MassReadingsResponse` interface.
- `src/app/LandingClient.tsx`: Client-side UI container and readings fetcher.
- `scripts/test-e2e.mjs`: Automated test harness.
- `docs/architecture.md`: System architecture specification.
- `docs/srs.md`: Software requirements specification.
- `docs/tasks.md`: Task breakdown and RTM.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Replace Mass Readings Engine & Full Verification | Install package, update route handler, adapt frontend, update ISO docs, overhaul test harness, run automated tests, and gate check | Survey complete | IN_PROGRESS |

## Interface Contracts
### `src/app/api/mass-readings/route.ts` ↔ `src/app/LandingClient.tsx` / `massResponses.ts`
```typescript
export interface LiturgicalReadingSection {
  citation: string;
  shortCitation?: string;
  text: string;
}

export interface LiturgicalPsalmSection extends LiturgicalReadingSection {
  response: string;
  stanzas?: string[];
}

export interface LiturgicalAlleluiaSection {
  citation?: string;
  acclamation: string;
  verse: string;
}

export interface MassReadingsResponse {
  date: string;
  liturgicalDay: string;
  saint?: string;
  firstReading: LiturgicalReadingSection;
  psalm: LiturgicalPsalmSection;
  secondReading?: LiturgicalReadingSection;
  alleluia: LiturgicalAlleluiaSection;
  gospel: LiturgicalReadingSection;
  meditation?: LiturgicalMeditationSection;
  isFallback?: boolean;
  source?: string; // 'catholic-mass-readings' | 'fallback'
}
```
