# Survey Report: Existing Website & Scraper Investigation
**Author**: Explorer 1 (Survey: Existing Website & Scraper)  
**Target Path**: `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org`  
**Date**: 2026-09-11  

---

## 1. Observation

### 1.1 `src/app/api/mass-readings/route.ts`
- **Route Handler Type**: Next.js App Router API route handler (`export async function GET(request: Request)`).
- **Imports**:
  ```typescript
  import { NextResponse } from 'next/server';
  import { USCCB, createNodeHttpClient, SectionType, type Mass } from 'catholic-mass-readings';
  ```
- **Query Parameter Handling** (lines 323–326):
  - `date`: parsed via helper `parseDateQuery(searchParams.get('date'))` which accepts `YYYY-MM-DD`, `YYYYMMDD`, cleaned 8 digits, or null (defaults to today in `America/Mexico_City`).
  - `lang`: extracted via `const langParam = searchParams.get('lang')?.toLowerCase() || 'es';` (line 326).
  - **CRITICAL**: `langParam` is extracted on line 326, but is **never passed** to the scraper or used anywhere else in `route.ts`.
- **Scraper Invocation** (lines 328–338):
  ```typescript
  const httpClient = await createNodeHttpClient();
  const usccb = new USCCB(httpClient);
  const massPromise = usccb.getMassFromDate(dateObj);
  const timeoutPromise = new Promise<null>((_, reject) =>
    setTimeout(() => reject(new Error('USCCB query timeout')), 8000)
  );
  const mass = await Promise.race([massPromise, timeoutPromise]);
  ```
- **Mapping Logic** (`mapUsccbMassToResponse`, lines 205–264):
  - First Reading: finds section where `s.type === SectionType.READING` matching header with '1' or not '2'.
  - Responsorial Psalm: finds section where `s.type === SectionType.PSALM`, parsed via `parsePsalmFromReading(readingText, citation)` extracting antiphon response and stanzas.
  - Second Reading: finds section where `s.type === SectionType.READING` matching '2' or 'second'; omitted on weekdays.
  - Alleluia: finds section where `s.type === SectionType.ALLELUIA`, parsed via `parseAlleluiaFromReading(readingText, citation)`.
  - Gospel: finds section where `s.type === SectionType.GOSPEL`.
  - Returns `source: 'catholic-mass-readings'`, `isFallback: false`.
- **Fallback Mechanism** (lines 40–114, 340–352, 363–375):
  - On timeout (>8s), upstream error, or empty sections: returns static Spanish fallback `FALLBACK_READINGS` for date `20260827` (Efesios 4, 1-6; Salmo 23; Jn 6; Jn 14, 1-6; Meditación de San Agustín).
  - Flags: `isFallback: true`, `source: 'fallback'`.

### 1.2 `catholic-mass-readings` Package Analysis
- **Installation**: Defined in `package.json` line 15: `"catholic-mass-readings": "^0.5.6"`.
- **Package Details** (`node_modules/catholic-mass-readings/package.json`):
  - Version: `0.5.6`
  - Author: Andrew Ryder (`andrewtryder/catholic-mass-readings`)
  - Description: "TypeScript library and CLI for querying Daily Mass readings from bible.usccb.org"
  - Main dependencies: `cheerio: ^1.0.0`, `commander: ^14.0.0`
- **Target Source**:
  - `USCCB` class hardcodes fetching from `https://bible.usccb.org/bible/readings/` (English USCCB readings).
  - It does **NOT** provide Spanish scraping out of the box. USCCB Spanish readings reside at `https://bible.usccb.org/es/bible/lecturas/MMDDYY.cfm`.
  - Exported `SectionType` in `catholic-mass-readings` is a string enum:
    ```typescript
    export declare enum SectionType {
      UNKNOWN = "UNKNOWN",
      ALLELUIA = "ALLELUIA",
      ALTERNATIVE = "ALTERNATIVE",
      GOSPEL = "GOSPEL",
      PSALM = "PSALM",
      READING = "READING",
      SEQUENCE = "SEQUENCE"
    }
    ```

### 1.3 `LandingClient.tsx` & UI Components
- **State Management** (lines 762–765, 805):
  ```typescript
  const [activeGuiaTab, setActiveGuiaTab] = useState<GuiaSectionId>('lecturas');
  const [dailyReadings, setDailyReadings] = useState<MassReadingsResponse | null>(null);
  const [isLoadingReadings, setIsLoadingReadings] = useState(false);
  const [showAppleMusicGuia, setShowAppleMusicGuia] = useState(false);
  const [showGuiaMisa, setShowGuiaMisa] = useState(false);
  const [activeMisaSectionIdx, setActiveMisaSectionIdx] = useState(0);
  const [guiaLang, setGuiaLang] = useState<'es' | 'en'>('es');
  ```
- **Fetch Lifecycle** (lines 767–785):
  - `fetchDailyReadings` calls `fetch('/api/mass-readings?lang=' + guiaLang)`.
  - Automatically triggered on mount and on language switch.
  - Manual reload via button: "↻ Actualizar" calls `fetchDailyReadings(true)` (line 2763).
- **Two Modals**:
  1. **Standard "Guía de Misa" Modal** (`showGuiaMisa`, lines 2715–2910):
     - Deck with 6 tabs: `lecturas`, `cantos`, `misterio`, `liturgia`, `biblia`, `precepto`.
     - In `lecturas` tab: renders Primera Lectura, Salmo Responsorial (response and text), Segunda Lectura (if present), Aclamación del Evangelio (Aleluya), Santo Evangelio, and Meditación Patrística.
  2. **Interactive "Seguir Misa" Modal** (`showAppleMusicGuia`, lines 3371–3397):
     - Opens `<GlobalModal className="apple-music-mode">` with `<AppleMusicLyrics>`.
     - Title: "Seguir Misa", Subtitle: Section title with progress `(X de 5)` and optional offline indicator.
     - Has language toggle button: switches `guiaLang` between `'es'` and `'en'`.
     - Uses `getCanonicalMassLines(activeMisaSectionIdx, dailyReadings, guiaLang)` from `src/app/massResponses.ts`.
     - In Section 2 (Liturgia de la Palabra, index 1), live readings are dynamically and sequentially interleaved into the Ordinary dialogue.
- **Alignment / Speaker Convention in `massResponses.ts` vs `global.css`**:
  - In `src/app/massResponses.ts` line 633:
    `isLeft: l.speaker === 'Sacerdote' || l.speaker === 'Celebrant' || l.speaker === 'Priest' || ...`
  - In `src/app/AppleMusicLyrics.tsx` lines 306–307:
    `if (line.isLeft && line.speaker !== undefined) lineClass += " duet-left"; else if (line.speaker !== undefined && !line.isLeft) lineClass += " duet-right";`
  - In `src/app/global.css` lines 3764–3780:
    - `.lyric-line.duet-left`: `text-align: left; font-size: 1.3rem;`
    - `.lyric-line.duet-right`: `text-align: right; font-size: 2.2rem;`
  - **Notable Observation**: Currently, Priest is `duet-left` (left-aligned, smaller font) and Assembly is `duet-right` (right-aligned, prominent font). The user request R2 states: `"(where priest sayings align right, public left)"`.

### 1.4 Reference Codebase: `~/teamwork_projects/guadalupe_mass_interactive`
- Located at `/Users/riosisraelg/teamwork_projects/guadalupe_mass_interactive`.
- Key files:
  - `src/lib/readings-adapter.ts`: Schema validator `validateReadingsSchema()` and lectionary loader `getReadings()`.
  - `src/types/catholic-mass-readings.ts`: Defines `SerializedMass`, `SerializedSection`, `SerializedReading`, `SerializedVerse`. Note that `SectionType` in this file is defined as a numeric enum (`READING=0, PSALM=1, ALLELUIA=2, GOSPEL=3`), whereas npm `catholic-mass-readings` defines string enums.
  - `src/data/spanish_readings_2026_09_10.json`: Complete Spanish USCCB reading dataset for 2026-09-10 from `https://bible.usccb.org/es/bible/lecturas/091026.cfm`.
  - `src/lib/seguir-misa-engine.ts`: Logic parsing Basilica de Guadalupe YouTube video (`EkoysbFU47c`) transcript paired with bilingual assembly responses from `rejoiceinfaith.org`.
  - `src/types/seguir-misa.ts`: Interfaces `LiturgicalRite`, `SpeakerRole`, `BilingualText`, `LiturgicalTurn`, `SeguirMisaStep`, `SeguirMisaCatalog`.
  - `src/data/liturgical_catalog_guadalupe.json`: Full catalog of 10 steps and paired dialogues.

### 1.5 Dependencies, Package Manager, and Tooling
- **Package Manager**: `npm` (`package-lock.json` present).
- **Core Dependencies**:
  - `next`: `^15.1.0` (App Router)
  - `react`: `^19.0.0`
  - `react-dom`: `^19.0.0`
  - `catholic-mass-readings`: `^0.5.6`
  - `rrule`: `^2.8.1`
  - `@vercel/analytics`: `^2.0.1`
- **Dev Dependencies**: TypeScript 5.7.2, ESLint 9.17.0, eslint-config-next 15.1.0, @types/node 22.10.2, @types/react 19.0.2.
- **Npm Scripts**:
  - `"dev": "next dev"`
  - `"dev:debug": "NODE_OPTIONS='--inspect' next dev"`
  - `"build": "next build"`
  - `"start": "next start"`
  - `"lint": "next lint"`
  - `"test": "node scripts/test-e2e.mjs"`
- **Test Infrastructure**:
  - `scripts/test-e2e.mjs`: 217 tests across 5 tiers (Feature coverage, boundaries, pairwise combinations, user journeys, adversarial fuzzing).
  - `scripts/adversarial-mobile-viewport-suite.mjs`: 148 tests across 21 devices/viewports.
  - `scripts/modal-scroll-stress-suite.mjs`: 24 tests on body scroll lock, modal scroll state, and AST invariants.
  - Current status: **All 389 automated checks pass 100%**.
  - TypeScript compilation: `npx tsc --noEmit` runs with **0 errors**.

### 1.6 Git Status & Environment
- Root directory: `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org`
- Active branch: `main` (synced with `origin/main`).
- Remote: `origin -> https://github.com/riosisraelg/lapandilladejesusqro.org.git`.
- GitHub CLI (`gh`): Authenticated as `riosisraelg` with active token scopes `gist`, `read:org`, `repo`, `workflow`.

---

## 2. Logic Chain

1. **Current Scraper Limitation**:
   - Observation 1.1 shows `route.ts` imports `USCCB` from `catholic-mass-readings`.
   - Observation 1.2 shows `catholic-mass-readings` strictly scrapes `bible.usccb.org/bible/readings/` in English.
   - Although `route.ts` reads `langParam = searchParams.get('lang')`, it cannot pass it to the library because `USCCB` has no language option.
   - Therefore, the live API currently serves English readings. When Spanish is expected, the app only gets Spanish if it falls back to the static `FALLBACK_READINGS` (August 27, 2026).
   - This directly confirms the necessity of Subproject 1 (the open-source Spanish liturgy scraper).

2. **UI Integration Points**:
   - Observation 1.3 shows `LandingClient.tsx` consumes `MassReadingsResponse` from `/api/mass-readings`.
   - The contract between backend and frontend is `MassReadingsResponse` (Observation 1.1).
   - Both the standard card view (`showGuiaMisa`) and the Apple Music kinetic guide (`showAppleMusicGuia`) rely on the same interface.
   - Therefore, integrating the new Spanish scraper into `/api/mass-readings` must preserve or cleanly adapt to `MassReadingsResponse` so the UI functions seamlessly without regression.

3. **Subproject Separation & Extraction Feasibility**:
   - Observation 1.4 confirms that `~/teamwork_projects/guadalupe_mass_interactive` contains working TypeScript implementations:
     - `readings-adapter.ts` and `spanish_readings_2026_09_10.json` for Spanish USCCB data.
     - `seguir-misa-engine.ts` and `liturgical_catalog_guadalupe.json` for YouTube transcript curation and dialogue pairing.
   - Observation 1.6 confirms GitHub CLI (`gh`) is authenticated, enabling Subproject 1 to be initialized as its own repository, tagged with CalVer (`YYYY.MM.MINOR`), and pushed to GitHub as required by R1.
   - Subproject 2 can be placed in a dedicated directory within the workspace to mine and curate transcripts for the "Seguir misa" modal.

4. **Speaker Alignment Discrepancy**:
   - Observation 1.3 notes that current CSS/code maps Priest to `duet-left` (left-aligned) and Assembly to `duet-right` (right-aligned).
   - The prompt R2 states: `"(where priest sayings align right, public left)"`.
   - Downstream implementers must be informed of this difference so that any alignment adjustment is explicitly coordinated.

---

## 3. Caveats

1. **Subproject 1 Scope**:
   - The tested Spanish reading file in `guadalupe_mass_interactive` (`spanish_readings_2026_09_10.json`) is a structured JSON fixture. Subproject 1 will need live HTTP scraping logic targeting `bible.usccb.org/es/bible/lecturas/MMDDYY.cfm` modeled after `catholic-mass-readings`'s Cheerio parser, or an adapter that fetches and validates the HTML.
2. **Schema Discrepancy**:
   - In `catholic-mass-readings` npm package, `SectionType` is a string enum (`"READING"`, `"PSALM"`, etc.). In `guadalupe_mass_interactive/src/types/catholic-mass-readings.ts`, `SectionType` is a numeric enum (`0, 1, 2, 3`).
   - When integrating Subproject 1 with `lapandilladejesusqro.org`, ensure type mapping handles string vs numeric enum values gracefully.
3. **No Project Modifications**:
   - As an explorer, no production source code was modified during this survey. All existing tests and builds remain in their initial verified state.

---

## 4. Conclusion

The `lapandilladejesusqro.org` codebase is in a stable, well-architected, and fully tested state (389 tests passing, clean TypeScript). The API route `/api/mass-readings` currently only fetches English readings from `catholic-mass-readings` and ignores the `lang` parameter, using a hardcoded static Spanish fallback when an error occurs. 

All prerequisites for executing the two subprojects are in place:
1. **Subproject 1 (Spanish Liturgy Scraper)**: Can be scaffolded as an independent package/repository within a subproject folder, leveraging the architecture of `catholic-mass-readings` and the tested Spanish data structures from `~/teamwork_projects/guadalupe_mass_interactive`. `gh` CLI is authenticated and ready for repo creation and CalVer tagging.
2. **Subproject 2 (Transcript Mining & Curation Tool)**: Can be extracted and adapted from `guadalupe_mass_interactive/src/lib/seguir-misa-engine.ts` and `src/data/`, maintaining compatibility with the "Seguir misa" interactive modal.
3. **Scraper Integration**: `/api/mass-readings/route.ts` can be upgraded to dynamically call the Spanish scraper when `lang === 'es'` (or when Spanish is requested) and `catholic-mass-readings` when `lang === 'en'`, mapping both into `MassReadingsResponse`.

---

## 5. Verification Method

To independently verify all findings in this survey:

1. **Verify Test Suite**:
   ```bash
   npm test
   node scripts/adversarial-mobile-viewport-suite.mjs
   node scripts/modal-scroll-stress-suite.mjs
   ```
   *Expected*: All 389 tests pass with 0 failures.

2. **Verify TypeScript Compilation**:
   ```bash
   npx tsc --noEmit
   ```
   *Expected*: Exit code 0, no diagnostic errors.

3. **Verify Git & GitHub CLI Auth**:
   ```bash
   git status
   git remote -v
   gh auth status
   ```
   *Expected*: Clean working tree on `main`; `gh` logged in as `riosisraelg`.

4. **Verify Route & Scraper Files**:
   Inspect `src/app/api/mass-readings/route.ts` lines 322–376 to verify `langParam` is ignored and `USCCB` only fetches English.
   Inspect `~/teamwork_projects/guadalupe_mass_interactive/src/lib/readings-adapter.ts` and `src/lib/seguir-misa-engine.ts` to verify available logic.
