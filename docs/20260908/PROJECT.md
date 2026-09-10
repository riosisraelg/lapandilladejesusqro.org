# Project: Mass Readings Scraper Upgrade & Canonical Mass Guide Integration

## Architecture
- **API Edge Subsystem**: `src/app/api/mass-readings/route.ts` - Next.js Route Handler querying Evangelizo XML feed, parsing full liturgical readings, formatting multi-stanza psalms with recurring responses, providing seasonal Alleluia/Lent acclamations, and returning structured JSON with Edge/HTTP 24h caching and resilient fallback.
- **Data Models**: `MassReadingsResponse` supporting `firstReading`, `psalm` (with antiphon `response` & stanzas), `secondReading` (conditional on Sundays/Solemnities), `alleluia` (acclamation & verse), `gospel`, `meditation`, and status flags.
- **UI Presentation Subsystem**: `src/app/LandingClient.tsx` & `src/app/massResponses.ts` - Interactive and standard Mass Guide modal. Removal of legacy accordion. Sequential canonical injection of live readings into "Liturgia de la Palabra" (GIRM canonical sequence).
- **Navigation & Lifecycle**: Auto-fetch daily readings on initial client mount, Hero & Navigation direct access buttons opening directly to Ritos Iniciales with cached live readings.
- **Verification Harness**: `scripts/test-e2e.mjs` - 5-tier zero-dependency test harness executing unit, integration, and E2E journeys.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Full Text Liturgical Scraper | Scrape & parse complete 1st Reading, Psalm (response + all stanzas), 2nd Reading (Sunday/Solemnity), Alleluia, and Gospel | M1 (API Scraper) | ORIGINAL_REQUEST R1 |
| 2 | Robust Entity Decoding & CDATA | Decode all Spanish accented & HTML entities, parse CDATA safely | M1 (API Scraper) | ORIGINAL_REQUEST R1 |
| 3 | Resilient Fallback & 24h Caching | Cache-Control headers, 6s timeout, robust `FALLBACK_READINGS` on offline/upstream fail | M1 (API Scraper) | ORIGINAL_REQUEST R1 |
| 4 | Obsolete Accordion Removal | Delete `showLecturasInResponses` accordion toggle from Tab 2 in `LandingClient.tsx` | M2 (UI Canonical Injection) | ORIGINAL_REQUEST R2 |
| 5 | Canonical Sequential Injection | Inject 1st Reading → Psalm (R. + stanzas) → 2nd Reading (if present) → Alleluia → Gospel into Liturgia de la Palabra | M2 (UI Canonical Injection) | ORIGINAL_REQUEST R2 |
| 6 | Interactive Streaming Mode (`AppleMusicLyrics`) | Dynamically generate kinetic line array with live readings and speaker rubrics in Section 2 | M2 (UI Canonical Injection) | ORIGINAL_REQUEST R2 |
| 7 | Direct Access Mass Launcher | Configure hero and mobile navigation buttons to open directly to Mass guide at Section 1 (Ritos Iniciales) | M3 (Direct Access & Auto-fetch) | ORIGINAL_REQUEST R3 |
| 8 | Auto-Fetch on Mount | Proactively fetch and cache daily readings in background on client mount | M3 (Direct Access & Auto-fetch) | ORIGINAL_REQUEST R3 |
| 9 | 3-Stage Engineering Documentation | ISO 42010 (`docs/architecture.md`), ISO 29148 (`docs/srs.md`), ISO 12207 (`docs/tasks.md`) | M0 (Standards Docs) | Engineering Standards |
| 10 | 5-Tier E2E & Unit Test Suite | Comprehensive automated tests covering all 5 tiers (≥189 tests) in `scripts/test-e2e.mjs` | M4 (E2E Testing Track) | Testing Standards |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M0 | Standards Documentation | Generate `docs/architecture.md`, `docs/srs.md`, `docs/tasks.md` | Survey Complete | DONE |
| M1 | API & Liturgical Scraper Overhaul | `src/app/api/mass-readings/route.ts` full text, psalm parsing, alleluia, entity decoding | M0 | PLANNED |
| M2 | Canonical UI Injection | `src/app/LandingClient.tsx`, `src/app/massResponses.ts` accordion removal, sequential injection, AppleMusicLyrics feed | M1 | PLANNED |
| M3 | Direct Access & Auto-Fetch | Direct Mass button trigger, client mount auto-fetch, loading/offline handling | M2 | PLANNED |
| M4 | E2E & Comprehensive Testing Track | Extend `scripts/test-e2e.mjs` with Tier 1–5 test suite (≥189 tests), 100% pass | M1, M2, M3 | PLANNED |
| M5 | Final Verification & Forensic Audit | Full regression run, Next.js production build, Forensic Integrity Audit | M4 | PLANNED |

## Interface Contracts
### API Route `GET /api/mass-readings`
- **Request**: `GET /api/mass-readings?date=YYYY-MM-DD&lang=SP`
- **Response**: `200 OK` (JSON conforming to `MassReadingsResponse`)
  ```typescript
  export interface MassReadingsResponse {
    date: string; // YYYYMMDD
    liturgicalDay: string;
    saint?: string;
    firstReading: { citation: string; shortCitation?: string; text: string; };
    psalm: { citation: string; shortCitation?: string; response: string; text: string; stanzas?: string[]; };
    secondReading?: { citation: string; shortCitation?: string; text: string; };
    alleluia: { acclamation: string; verse: string; citation?: string; };
    gospel: { citation: string; shortCitation?: string; text: string; };
    meditation?: { author: string; text: string; };
    isFallback?: boolean;
    source?: string;
  }
  ```

### Canonical Mass Generator Function
- `getCanonicalMassLines(sectionIdx: number, dailyReadings: MassReadingsResponse | null, lang: 'es' | 'en')`:
  Returns structured lines array for `AppleMusicLyrics` kinetic reader and ordinary display.

## Code Layout
- `src/app/api/mass-readings/route.ts`: Scraper API route handler and liturgical parser
- `src/app/LandingClient.tsx`: Main client view, modal state, navigation buttons, Mass Guide UI
- `src/app/massResponses.ts`: Liturgical ordinaries, dialogues, and baseline structure
- `src/app/AppleMusicLyrics.tsx`: Kinetic full-screen liturgical text reader
- `scripts/test-e2e.mjs`: Zero-dependency automated test harness (Tiers 1–5)
- `docs/architecture.md`: System Architecture Specification (ISO/IEC/IEEE 42010:2022)
- `docs/srs.md`: Software Requirements Specification (ISO/IEC/IEEE 29148:2018)
- `docs/tasks.md`: Life Cycle Task Matrix (ISO/IEC/IEEE 12207:2017)
