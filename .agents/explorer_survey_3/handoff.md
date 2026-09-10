# Architectural & Testing Standards Survey Report: Mass Readings Engine Migration

**Author**: `explorer_survey_3`  
**Date**: 2026-09-10  
**Target Milestone**: Survey of Architectural & Testing Standards for Mass Readings Migration (`catholic-mass-readings`)  
**Workspace**: `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org`

---

## 1. Observation

### 1.1 Project Documentation & Standards State

1. **`docs/architecture.md` (ISO/IEC/IEEE 42010:2022)**:
   - **Section 2.1 (Lines 107–151)**: Defines "Mass Readings Scraper Data Flow Architecture".
     - Specifies data flow starting at `[ GET /api/mass-readings?date=YYYY-MM-DD&lang=SP ]`.
     - Specifies upstream HTTP fetch to `feed.evangelizo.org` with `AbortSignal.timeout(6000)`.
     - Specifies an internal `[ XML Parser & Decoder ]` handling CDATA extraction, accented entity decoding, psalm stanza/antiphon parsing, and seasonal Alleluia generation.
     - Specifies fallback to `FALLBACK_READINGS` on timeout/5xx/bad XML.
   - **Section 3.1 Subsystem 4 (Lines 180–221)**:
     - Component 1: `EDGE SCRAPER API ENGINE (src/app/api/mass-readings/route.ts)` querying Evangelizo XML feed with 6s timeout, entity sanitizer, 24h Edge caching, and `FALLBACK_READINGS`.
     - Component 2: `CANONICAL LITURGICAL INJECTION PIPELINE (LandingClient.tsx & massResponses.ts)` eliminating `showLecturasInResponses` accordion and injecting readings into Section 2 (Liturgia de la Palabra).
     - Component 3: `DIRECT ACCESS & AUTONOMOUS FETCH LIFECYCLE` via client mount pre-fetch and direct launcher buttons.
   - **Section 3.2.1 (Lines 236–275)**: Defines `MassReadingsResponse` data contract:
     ```typescript
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
       source?: string; // currently 'evangelizo' | 'fallback'
     }
     ```
   - **Section 3.3 (Lines 313–316)**: Specifies `/api/mass-readings` Edge/Serverless execution with `revalidate: 86400` caching queries to Evangelizo.
   - **Section 4.3 (Lines 390–394)**: Specifies timeout protection for upstream Evangelizo queries (6,000ms).
   - **Section 5 (Lines 408–418)**: Technology stack table lists Next.js 15.1.0, React 19.0.0, TypeScript 5.7.3, Vanilla CSS, `rrule`, `@vercel/og`, and custom Node.js ESM Runner. Does not list `catholic-mass-readings`.
   - **Section 6 (Lines 422–437)**: Architectural Traceability Matrix links `RF-08.1` (Edge Scraper API Engine & XML Parser) to `src/app/api/mass-readings/route.ts` verified by Tier 1 tests `T1-R8-01` to `T1-R8-05`.

2. **`docs/srs.md` (ISO/IEC/IEEE 29148:2018)**:
   - **Section 2.4 (Line 43)**: Lists "Evangelizo Daily Liturgical Reading XML API (via `/api/mass-readings`)" as the external interface.
   - **RF-08 (Lines 144–260)**: Master Requirement for Mass Guide & Liturgical Readings Scraper Subsystem.
     - **RF-08.1 (Lines 152–179)**: Explicitly mandates querying `http://feed.evangelizo.org/v2/reader.php?date=${dateParam}&lang=${langParam}&type=xml` with tag extraction: `<litugic_t>`, `<saint>`, `<reading_text1>`, `<reading_text2>`, `<reading_text3>`, `<reading_gospel>`, `<comment>`, CDATA handling, and HTML/XML entity decoding.
     - **RF-08.2 (Lines 181–228)**: Mandates sequential canonical UI injection in `LandingClient.tsx` and `massResponses.ts`, deletion of `showLecturasInResponses` accordion, and feeding `AppleMusicLyrics.tsx` via `getCanonicalMassLines`.
     - **RF-08.3 (Lines 230–245)**: Mandates direct access launcher and proactive mount auto-fetch.
     - **AC-RF08 Matrix (Lines 247–260)**:
       - `AC-RF08-1` through `AC-RF08-5` explicitly specify Evangelizo XML tags, XML parser resilience, and full text preservation.
   - **Section 5.3 (Lines 349–380)**: Schema definition matches `MassReadingsResponse`.

3. **`docs/tasks.md` (ISO/IEC/IEEE 12207:2017)**:
   - **Milestone M6 (Lines 53–65)**:
     - `TSK-M6-01`: "Overhaul Daily Readings Scraper Route Handler (`RF-08.1`)", with input: "Evangelizo XML feed format, `MassReadingsResponse` schema, `FALLBACK_READINGS`", and output: "High-fidelity XML parser, clean antiphon extraction, full psalm stanzas with `R.`, seasonal Alleluia builder, entity sanitizer, 6s timeout, 24h Edge caching".
     - Verification Method: `npm test` (Unit tests `UT-SCR-01` to `UT-SCR-08`) + live API curl test.
     - `TSK-M6-02` to `TSK-M6-05`: Cover accordion removal, canonical injection, kinetic text stream, and direct launcher.
   - **Section 3.1 Unit Testing Strategy (Lines 70–81)**:
     - `UT-SCR-01` to `UT-SCR-08`: Explicitly assert parsing of Evangelizo XML (`<reading_text1>`, `<reading_text3>`, etc.), CDATA sections, and accented XML entities.
   - **Section 4 RTM (Lines 105–121)**: Maps `RF-08.1` to `TSK-M6-01` and `UT-SCR-01..08`.

4. **Master Documentation Index & Zensical State**:
   - `docs/index.md` (Master Documentation Index SSOT) does not exist in the repository root or `docs/`.
   - `zensical.toml` does not exist in the repository root.

---

### 1.2 Testing Infrastructure & Existing Tests State

1. **Test Runner & Framework Audit (`package.json`)**:
   - Lines 5–12:
     ```json
     "scripts": {
       "dev": "next dev",
       "dev:debug": "NODE_OPTIONS='--inspect' next dev",
       "build": "next build",
       "start": "next start",
       "lint": "next lint",
       "test": "node scripts/test-e2e.mjs"
     }
     ```
   - **Jest**: Not installed. Zero config files (`jest.config.*`).
   - **Vitest**: Not installed. Zero config files (`vitest.config.*`).
   - **Playwright**: Not installed. (Only appears in `package-lock.json` as an optional peer dependency of `next`).
   - **Cypress**: Not installed.
   - **Test Runner**: A custom, zero-dependency Node.js ESM test harness implemented in `scripts/test-e2e.mjs` using native `node:assert/strict`.

2. **Existing Tests in `scripts/test-e2e.mjs`**:
   - Lines 293–710: Hardcodes local reference implementations of the Evangelizo XML tag extractor, psalm parser, seasonal Alleluia builder, and entity decoders.
   - Lines 1742–1915 (`runner.setRequirement('R8.1: Daily Mass Readings Scraper API Engine')`):
     - `R8.1`: XML Parser weekday extraction (1st reading, psalm, gospel).
     - `R8.2`: XML Parser Sunday/Solemnity 2nd reading extraction from `<reading_text3>`.
     - `R8.3`: Psalm parser response extraction without truncating verse 1.
     - `R8.4`: Psalm parser multi-stanza parsing with stanzas array.
     - `R8.5`: Gospel Acclamation / Alleluia seasonal builder (Ordinary Time).
     - `R8.6`: Gospel Acclamation / Alleluia seasonal builder (Lent).
     - `R8.7`: XML CDATA extraction for reading text and citations.
     - `R8.8`: Spanish accented entity decoding (`&aacute;`, `&eacute;`, etc.).
     - `R8.9`: Punctuation and numerical entity decoding (`&laquo;`, `&raquo;`, `&#39;`).
     - `R8.10`: Offline `FALLBACK_READINGS` data contract completeness.
     - `R8.10a`: XML Tag name prefix collision isolation.
     - `R8.10b`: Christmas liturgical season detection.
   - Lines 1918–2004 (`R8.2: Canonical Sequential UI Injection & Accordion Removal`):
     - `R8.11`: Accordion removal in `LandingClient.tsx`.
     - `R8.12`: GIRM sequence in `getCanonicalMassLines`.
     - `R8.13`–`R8.17`: Salmo Responsorial, Segunda Lectura, Alleluia, and Santo Evangelio injection.
     - `R8.18`: Kinetic line stream generator output verification.
   - Lines 2005–2035 (`R8.3: Direct Access & Auto-Fetch Subsystem`):
     - `R8.19`–`R8.20`: Direct Access button routing to Section 1 (Ritos Iniciales).
     - `R8.21`: Client mount auto-fetch verification.
     - `R8.22`: Traditional Mexican sung hymns repertoire.

3. **`tests/` Directory**:
   - Contains 5 test files: `m1_challenger_stress.test.mjs`, `m1_food_prayers.test.mjs`, `m2_challenger_stress.test.mjs`, `m2_infinite_swipe_dynamic_tones.test.mjs`, `m5_rosary_overhaul.test.mjs`.
   - None of the files in `tests/` cover Milestone M6 (mass readings). All M6 tests are consolidated inside `scripts/test-e2e.mjs`.

---

### 1.3 `catholic-mass-readings` Package Capabilities & Constraints

1. **Package Inspection (`npm view catholic-mass-readings`)**:
   - Current Version: `0.5.6` (Apache-2.0, published by andrewtryder).
   - Core Dependencies: `cheerio: ^1.0.0`, `commander: ^14.0.0`.
   - Upstream Source: Scrapes and parses `https://bible.usccb.org/bible/readings/{DATE}.cfm`.
   - Core Domain Models:
     - `Mass`: `{ title: string, url: string, sections: Section[] }`
     - `Section`: `{ type: SectionType, header: string, readings: Reading[] }`
     - `SectionType`: `READING`, `PSALM`, `ALLELUIA`, `GOSPEL`, `SEQUENCE`, `ALTERNATIVE`, `UNKNOWN`
     - `Reading`: `{ verses: Verse[], text: string }`
     - `Verse`: `{ text: string, link: string, book: string | null }`
     - `MassType`: `DEFAULT` (""), `DAWN`, `DAY`, `NIGHT`, `VIGIL`, `YEARA`, `YEARB`, `YEARC`.
   - API Usage:
     ```typescript
     import { USCCB, MassType } from 'catholic-mass-readings';
     const usccb = new USCCB();
     const mass = await usccb.getMass(date, MassType.DEFAULT);
     ```
2. **Language Support in Package**:
   - Inspection of `constants.ts`, `models.ts`, and `usccb.ts` shows **no multilingual support** in `catholic-mass-readings`. All hardcoded URLs target `bible.usccb.org`, and liturgical closing formulas (`"The word of the Lord."`, `"Praise to you, Lord Jesus Christ."`) are English only.
   - The user requirement explicitly accounts for this: *"Ensure that the language parameter (e.g., 'es', 'en') passed from the frontend is respected by the new library, if supported by the package."*

---

## 2. Logic Chain

### 2.1 From Current Documentation to Required Architectural Updates
1. `ORIGINAL_REQUEST.md` (Follow-up 2026-09-10T19:02:31Z) mandates:
   > "Replace the current mass readings engine (which uses evangelizo.org XML feeds) with the catholic-mass-readings library. Ensure this new engine is used everywhere readings are displayed, supporting the active language if the library supports it."
2. `docs/architecture.md`, `docs/srs.md`, and `docs/tasks.md` currently describe an Evangelizo-centric XML scraper pipeline.
3. Therefore, all three ISO documents must be refactored to replace the Evangelizo XML pipeline with `catholic-mass-readings`:
   - In `docs/architecture.md`: Section 2.1 (Data Flow Diagram), Section 3.1 (Subsystem 4), Section 3.2.1 (Contract `source`), Section 4.3 (Reliability), Section 5 (Tech Stack table), and Section 6 (RTM).
   - In `docs/srs.md`: Section 2.4 (External Interfaces), RF-08.1 (Scraper engine specification), AC-RF08 matrix (replacing XML tag assertions with `catholic-mass-readings` model mapping).
   - In `docs/tasks.md`: `TSK-M6-01` description and deliverables, `UT-SCR-01` through `UT-SCR-08` test specifications, and the RTM.

### 2.2 From Test Harness Findings to Test Suite Adaptation
1. The project has no Jest/Vitest/Playwright/Cypress; the sole test runner is `scripts/test-e2e.mjs` executed via `npm test`.
2. Tests `R8.1` to `R8.10b` in `scripts/test-e2e.mjs` assert low-level Evangelizo XML parsing mechanics (`<reading_text1>`, CDATA handling, XML entity decoder).
3. If the backend is migrated to `catholic-mass-readings`, those tests will test obsolete code or fail against the actual route implementation.
4. Therefore, `scripts/test-e2e.mjs` must be updated to replace the Evangelizo XML tests with unit and integration tests verifying the `catholic-mass-readings` adapter, data transformation to `MassReadingsResponse`, language parameter pass-through, and fallback behavior.

### 2.3 From Frontend Consumption Analysis to Integration Requirements
1. `LandingClient.tsx` (lines 763–781, 2750–2870) and `massResponses.ts` (lines 616–680) consume `MassReadingsResponse` fields: `firstReading`, `psalm`, `secondReading`, `alleluia`, `gospel`, `liturgicalDay`, `saint`, `isFallback`.
2. Currently, `LandingClient.tsx` executes `fetch('/api/mass-readings')` without passing a language parameter.
3. To fulfill requirement R2 and R3:
   - `route.ts` must map the `Mass` object from `catholic-mass-readings` into `MassReadingsResponse` without changing property names expected by the UI.
   - `LandingClient.tsx` should pass `?lang=${guiaLang}` during fetch, allowing the backend route to log, track, or handle the active language.

---

## 3. Detailed Requirements & Acceptance Criteria (R1, R2, R3)

### R1. Replace the API Backend Fetcher
- **Target File**: `src/app/api/mass-readings/route.ts`
- **Specification**:
  - Replace the Evangelizo HTTP fetch and XML regex parser with `catholic-mass-readings` (`USCCB.getMass()`).
  - Map `catholic-mass-readings` data models (`Mass`, `Section`, `Reading`, `Verse`) to the existing `MassReadingsResponse` structure:
    - `firstReading`: Extracted from Section where `section.type === SectionType.READING` (first occurrence) or header matches "Reading 1" / "First Reading".
    - `psalm`: Extracted from Section where `section.type === SectionType.PSALM`. Populates `citation`, `shortCitation`, `response` (extracted from antiphon line), and full `text` / `stanzas`.
    - `secondReading`: Extracted from Section where `section.type === SectionType.READING` (second occurrence, if present). Populated on Sundays/Solemnities; `undefined` on weekdays.
    - `alleluia`: Extracted from Section where `section.type === SectionType.ALLELUIA`. Populates `acclamation` and `verse`.
    - `gospel`: Extracted from Section where `section.type === SectionType.GOSPEL`. Populates `citation` and `text`.
    - `liturgicalDay`: Mapped from `mass.title`.
    - `source`: Set to `'catholic-mass-readings'` (or `'fallback'` on failure).
  - Retain `FALLBACK_READINGS` for zero-downtime resilience when USCCB is unreachable, offline, or returns null/errors.
  - Maintain HTTP headers: `Cache-Control: public, s-maxage=86400, stale-while-revalidate=43200`.

### R2. Language Support
- **Target Files**: `src/app/api/mass-readings/route.ts`, `src/app/LandingClient.tsx`
- **Specification**:
  - `LandingClient.tsx`: Pass the current UI language in the fetch query: `fetch(`/api/mass-readings?lang=${guiaLang}`)`.
  - `src/app/api/mass-readings/route.ts`:
    - Read `searchParams.get('lang')`.
    - Acknowledge that `catholic-mass-readings` scrapes `bible.usccb.org` which publishes exclusively in English.
    - If `lang === 'es'` (or default) and the external library does not provide native Spanish translation, the route gracefully serves the fetched readings with appropriate Spanish metadata/fallback labeling, or preserves existing fallback Spanish readings if requested, ensuring zero runtime crashes.

### R3. Frontend Integration Verification
- **Target File**: `src/app/LandingClient.tsx`
- **Specification**:
  - Ensure `LandingClient.tsx` seamlessly renders `firstReading`, `psalm`, conditional `secondReading`, `alleluia`, and `gospel`.
  - Ensure the "↻ Actualizar" button in the Mass Guide triggers a force refresh (`fetchDailyReadings(true)`), updating the state without React hydration errors or exceptions.

---

## 4. Gap Analysis

| Category | Item | Current State | Target State | Severity |
|---|---|---|---|:---:|
| **Documentation** | `docs/architecture.md` | Documents Evangelizo XML scraping (`feed.evangelizo.org`) and XML parser. | Document `catholic-mass-readings` library, USCCB scraping, and model mapper. | **High** |
| **Documentation** | `docs/srs.md` | `RF-08.1` and `AC-RF08` matrix mandate Evangelizo XML tag extraction. | Redefine `RF-08.1` and acceptance criteria for `catholic-mass-readings`. | **High** |
| **Documentation** | `docs/tasks.md` | `TSK-M6-01` and `UT-SCR-01..08` describe Evangelizo XML parser tasks. | Update `TSK-M6-01` and unit tests for `catholic-mass-readings`. | **High** |
| **Documentation** | `docs/index.md` | File does not exist (MDI SSOT missing per software-architecture skill). | Create `docs/index.md` cataloging Stage 1–3 artifacts. | **Medium** |
| **Dependencies** | `package.json` | `catholic-mass-readings` is not listed in `dependencies`. | Add `catholic-mass-readings: "^0.5.6"` locally. | **Critical** |
| **Test Suite** | `scripts/test-e2e.mjs` | Tests `R8.1`–`R8.10b` assert Evangelizo XML parsing and CDATA extraction. | Overhaul `R8.1`–`R8.10b` to test `catholic-mass-readings` mapper, contract completeness, language handling, and fallback. | **Critical** |
| **Frontend Call** | `LandingClient.tsx` | Calls `fetch('/api/mass-readings')` without `lang` parameter. | Call `fetch(`/api/mass-readings?lang=${guiaLang}`)` and handle re-fetch on language change. | **Medium** |
| **Build Verification** | Node.js Runtime | Next.js 15 App Router serverless route. `cheerio` works under standard Node.js serverless runtime. | Verify `next build` passes with zero type errors. | **Medium** |

---

## 5. Caveats

1. **USCCB Language Limitation**: `catholic-mass-readings` exclusively fetches from `bible.usccb.org`, which provides readings in English (NABRE). The package does not support Spanish. Requirement R2 explicitly states: *"if supported by the package"*.
2. **Network Dependency During Live Scraping**: USCCB occasionally utilizes anti-bot challenges (e.g. Obolus / Cloudflare). The `catholic-mass-readings` package includes an internal `isObolusChallenge` check. Resilient fallback to `FALLBACK_READINGS` remains mandatory to guarantee zero downtime.
3. **No Code Modification Undertaken**: In strict compliance with the Teamwork Explorer read-only mandate, no source code outside of `.agents/explorer_survey_3` was modified.

---

## 6. Conclusion

1. The architectural specifications (`docs/architecture.md`), software requirements (`docs/srs.md`), and lifecycle execution task matrix (`docs/tasks.md`) are thoroughly documented under ISO 42010, 29148, and 12207, but are currently aligned with the deprecated Evangelizo XML scraper. They must be updated to specify the `catholic-mass-readings` integration.
2. The testing harness is custom-built in `scripts/test-e2e.mjs` (Node.js ESM runner). No Jest, Vitest, Playwright, or Cypress is installed. Existing tests for R8 (`R8.1` through `R8.10b`) test Evangelizo XML parsing and must be adapted for `catholic-mass-readings`.
3. The frontend (`LandingClient.tsx` and `massResponses.ts`) is cleanly decoupled through the `MassReadingsResponse` interface. A proper adapter in `src/app/api/mass-readings/route.ts` mapping `catholic-mass-readings` to `MassReadingsResponse` will satisfy R1, R2, and R3 without breaking changes to the UI.

---

## 7. Verification Method

### 7.1 Independent Inspection Commands
To independently verify the observations:

```bash
# 1. Verify test framework and absence of Jest/Vitest/Playwright/Cypress
cat package.json | grep -E "jest|vitest|playwright|cypress"
# (Outputs nothing)

# 2. Verify current test script
npm test

# 3. Verify catholic-mass-readings package presence on npm
npm view catholic-mass-readings version

# 4. Verify Evangelizo references across docs/
grep -rn "evangelizo" docs/

# 5. Verify existing R8 tests in test harness
grep -n "R8.1: Daily Mass Readings Scraper" scripts/test-e2e.mjs
```

### 7.2 Invalidation Conditions
This survey report would be invalidated if:
- `catholic-mass-readings` had a native Spanish translation endpoint that was overlooked (disproved by inspecting `constants.ts` and `usccb.ts`).
- A Jest/Vitest test runner existed elsewhere in the repository (disproved by searching repository config and dependency files).
