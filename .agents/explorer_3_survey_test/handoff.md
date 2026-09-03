# Comprehensive Verification, Testing & Standards Survey Report

**Agent**: Explorer 3 (Verification, Testing & Standards Specialist)  
**Standard**: ISO/IEC/IEEE 29148:2018, ISO/IEC/IEEE 42010:2022, ISO/IEC/IEEE 12207:2017  
**Date**: 2026-08-28T18:53:00-06:00  
**Target File**: `.agents/explorer_3_survey_test/handoff.md`  

---

## 1. Observation

Direct code and environment observations conducted across the workspace:

### 1.1 Project Environment & Toolchain
- **Next.js**: Version `15.5.18` (App Router, Server Components + Client Hydration on React 19.0.0).
- **TypeScript**: Version `5.7.2` configured with strict typing in `tsconfig.json`.
- **Styling**: Monolithic Vanilla CSS (`src/app/global.css`) using CSS Custom Properties and 3D GPU-accelerated transforms (`translate3d`, `rotateY`). Zero runtime CSS-in-JS overhead.
- **Build Verification**: `npm run build` completed successfully with code `0`, generating all static and dynamic edge routes (including `/api/mass-readings`, `/api/calendar`, `/api/og`, `/calendario`, `/donaciones`).
- **Linter**: `npm run lint` invokes `next lint`. In Next.js 15, `next lint` defaults to interactive configuration when flat ESLint config is not present. Direct typechecking via `tsc --noEmit` verifies strict type validity.

### 1.2 Automated Test Infrastructure
- **Harness**: Zero-dependency Node.js ESM test suite located at `scripts/test-e2e.mjs`.
- **Execution**: Run via `npm test` or `node scripts/test-e2e.mjs`.
- **Current State**: 157/157 tests currently passing in **~47ms** across 5 tiers (Tier 1: 64, Tier 2: 55, Tier 3: 18, Tier 4: 10, Tier 5: 10).
- **Assert Module**: Uses Node.js native `node:assert/strict`.

### 1.3 Mass Readings API & Liturgy Scraper (`src/app/api/mass-readings/route.ts`)
- **Upstream Feed**: Evangelizo XML endpoint (`http://feed.evangelizo.org/v2/reader.php?date=${dateParam}&lang=${langParam}&type=xml`).
- **Tag Extraction**:
  - `reading_text1_lt`, `reading_text1_st`, `reading_text1` (Primera Lectura)
  - `reading_text2_lt`, `reading_text2_st`, `reading_text2` (Salmo Responsorial)
  - `reading_text3_lt`, `reading_text3_st`, `reading_text3` (Segunda Lectura)
  - `reading_gospel_lt`, `reading_gospel_st`, `reading_gospel` (Santo Evangelio)
  - `comment_t`, `comment_a`, `comment` (Meditación Patrística)
- **Current Gaps Observed**:
  1. **Psalm Response & Verse Handling**: In `src/app/api/mass-readings/route.ts` line 137, psalm response extraction only splits `psalmText.split('\n')[0]`. The full psalm payload often contains recurring antiphon indicators `R.` or `R/.` interspersed with multi-stanza verses. When displaying, assembly responses need complete verse lines without truncation.
  2. **Gospel Acclamation / Alleluia**: While `massResponses.ts` line 229 specifies "¡Aleluya, aleluya!", the scraper schema does not yet explicitly structure the optional Alleluia verse or Lent tract alternative (`Glory and praise to you...` / `Honor y gloria a ti, Señor Jesús`).
  3. **Entity Decoding**: `extractXmlTag` only handles basic entities (`&nbsp;`, `&amp;`, `&lt;`, `&gt;`, `&quot;`, `&#39;`, `&apos;`). Accented character entities or numerical XML entities (`&#225;` etc.) should be decoded cleanly.

### 1.4 Mass Guide UI & Canonical Injection (`src/app/LandingClient.tsx`)
- **Current State in `LandingClient.tsx`**:
  - Tab 1 (`activeGuiaTab === 'lecturas'`): Renders cards for Primera Lectura, Salmo Responsorial, Segunda Lectura, Santo Evangelio, and Meditación.
  - Tab 2 (`activeGuiaTab === 'respuestas'`): Contains a collapsible accordion (`showLecturasInResponses`, line 2589) that redundantly previews readings above the 5 Mass moments.
  - Interactive Mode (`AppleMusicLyrics` / `showAppleMusicGuia`): Currently feeds `massResponses[activeMisaSectionIdx].parts` directly. When viewing `activeMisaSectionIdx === 1` ("Liturgia de la Palabra"), parts contain generic placeholder rubrics (e.g. `"(El lector proclama la primera lectura)"`) instead of dynamically injecting the live fetched readings.
  - Navigation Buttons: "Guía de Misa" and "Seguir la Misa" buttons exist in hero (lines 1733, 1776) and mobile drawer (line 1363). `showGuiaMisa` and `showAppleMusicGuia` modal triggers can open directly to start of Mass (`activeMisaSectionIdx = 0`, Ritos Iniciales) while auto-triggering `fetchDailyReadings()`.

---

## 2. Logic Chain

1. **Test Infrastructure Selection**: The repository already possesses a mature, zero-dependency, ultra-fast (~47ms) ESM test harness in `scripts/test-e2e.mjs` tied directly to `package.json` (`npm test`). Adding Jest/Vitest/Playwright dependencies would violate the project's minimal dependency constraints and increase bundle size. Therefore, all new unit, integration, and E2E test cases for R1, R2, and R3 will be integrated directly into `scripts/test-e2e.mjs`.
2. **Scraper Unit Testing Strategy (R1)**:
   - The parser logic must be validated against real-world and synthetic Evangelizo XML payloads for:
     a) Weekday readings (1st Reading + Psalm + Alleluia + Gospel).
     b) Sunday & Solemnity readings (1st Reading + Psalm + 2nd Reading + Alleluia + Gospel).
     c) Multi-stanza Responsorial Psalm with recurring `R.` antiphon phrase and stanzas.
     d) Accented entity decoding and CDATA block wrapping.
     e) Network failure and malformed XML graceful fallback to `FALLBACK_READINGS`.
3. **UI & Canonical Ordering Integration Strategy (R2 & R3)**:
   - Deleting the redundant accordion (`showLecturasInResponses`) eliminates UI clutter.
   - Injecting readings sequentially into "Liturgia de la Palabra" ensures compliance with the General Instruction of the Roman Missal (GIRM) canonical order:
     * Primera Lectura → Salmo Responsorial (con estrofas y respuesta recurrente) → Segunda Lectura (si aplica) → Aclamación del Evangelio (Aleluya) → Santo Evangelio → Homilía → Credo → Oración Universal.
   - The main Mass buttons must open directly to the Mass guide and auto-trigger `fetchDailyReadings()` so that readings are cached and ready before the user reaches the Liturgy of the Word.
4. **Standards & Documentation Alignment**:
   - Updates must be synchronized with `docs/architecture.md` (ISO 42010), `docs/srs.md` (ISO 29148), and `docs/tasks.md` (ISO 12207) to maintain single-source-of-truth integrity.

---

## 3. Comprehensive Testing Strategy & Tier Matrix Mapping

### 3.1 Unit Testing Strategy: Scraper Parser Engine
The unit test suite validates the parser under isolated input conditions:

| Test ID | Test Category | Specification & Verification Criteria |
|---|---|---|
| `UT-SCR-01` | **Full Liturgical Parsing (Weekday)** | Parse XML containing First Reading, Psalm with response & verses, Gospel, and Patristic commentary. Assert all fields are non-empty strings and citations match. |
| `UT-SCR-02` | **Sunday / Solemnity with 2nd Reading** | Parse XML with `reading_text3` present. Assert `secondReading` object is populated with citation and body text. |
| `UT-SCR-03` | **Multi-Stanza Psalm with Recurring Response** | Verify that `psalm.response` extracts the antiphon and `psalm.text` contains all verse stanzas separated by clean line breaks, preserving line indentation. |
| `UT-SCR-04` | **Gospel Acclamation / Alleluia Extraction** | Verify parsing or generation of canonical Alleluia verse and Lenten acclamation alternative. |
| `UT-SCR-05` | **HTML & XML Entity Sanitization** | Decode `&aacute;`, `&eacute;`, `&iacute;`, `&oacute;`, `&uacute;`, `&ntilde;`, `&laquo;`, `&raquo;`, `&#39;`, `&quot;` to native UTF-8 Spanish characters. |
| `UT-SCR-06` | **CDATA Block Extraction** | Extract text enclosed in `<![CDATA[ ... ]]>` tags within any liturgical field without regex corruption. |
| `UT-SCR-07` | **Offline / Network 500 Fallback** | When XML payload is invalid, empty, or upstream responds with HTTP 500/timeout, return `FALLBACK_READINGS` with `isFallback: true` and normalized YYYYMMDD date. |
| `UT-SCR-08` | **Mexico City Timezone Resolution** | Given no `?date=` query param, resolve current date in `America/Mexico_City` timezone regardless of local runner clock. |

### 3.2 Component & Integration Testing Strategy: Mass Guide UI
The integration test suite validates `LandingClient.tsx` state and canonical rendering:

| Test ID | Test Category | Specification & Verification Criteria |
|---|---|---|
| `IT-UI-01` | **Accordion Deletion Verification** | Confirm removal of legacy `showLecturasInResponses` toggle and verify clean DOM hierarchy. |
| `IT-UI-02` | **Sequential Canonical Injection** | In Liturgia de la Palabra, verify the sequential order: 1. Primera Lectura → 2. Salmo Responsorial → 3. Segunda Lectura (conditional) → 4. Aleluya → 5. Santo Evangelio. |
| `IT-UI-03` | **Interactive Mode (`AppleMusicLyrics`) Feed** | In `AppleMusicLyrics` for Section 2 ("Liturgia de la Palabra"), verify that `lines` array contains the actual scraped reading text lines and speaker tags rather than static placeholders. |
| `IT-UI-04` | **Direct Access Opening** | Clicking "Guía de Misa" / "Seguir la Misa" opens the modal at Section 1 ("Ritos Iniciales", index 0) or directly to the interactive Mass reader. |
| `IT-UI-05` | **Auto-Fetch on Open** | Opening the Mass modal automatically invokes `fetchDailyReadings()` without requiring manual click on "↻ Actualizar". |
| `IT-UI-06` | **Bilingual Toggle Synchronization** | Switching language between `es` and `en` updates liturgical dialogue speaker tags and ordinary rubrics while maintaining Spanish scripture readings. |

### 3.3 5-Tier Test Matrix Breakdown

| Tier | Focus Area | New/Updated Tests | Target Count | Expected Pass Rate |
|---|---|---|:---:|:---:|
| **Tier 1** | **Feature Coverage (R1–R3)** | Unit parser tests (R1.1–R1.8), Canonical injection tests (R2.1–R2.6), Direct access & auto-fetch (R3.1–R3.5) | $\ge 19$ new tests (Total: 75+) | 100% |
| **Tier 2** | **Boundary & Corner Cases** | Leap days (Feb 29), Easter Computus edge days, missing 2nd reading, multi-stanza psalm wrapping, extreme network timeouts | $\ge 10$ new tests (Total: 65+) | 100% |
| **Tier 3** | **Cross-Feature (Pairwise)** | Direct Mass button click → Auto-fetch → Canonical injection → Interactive Apple Music navigation → Haptic feedback | $\ge 5$ new tests (Total: 23+) | 100% |
| **Tier 4** | **Real-World User Journeys** | Sunday Mass Journey (with 2nd Reading), Weekday Mass Journey, Offline Parishioner Journey with Fallback | $\ge 3$ new journeys (Total: 13+) | 100% |
| **Tier 5** | **Adversarial Hardening** | CDATA payload fuzzing, XSS script injection in citations, network abort race conditions | $\ge 3$ new tests (Total: 13+) | 100% |
| **TOTAL** | **Full Regression Suite** | | **$\ge 189$ Tests** | **100% PASS** |

---

## 4. Requirements for 3-Stage Engineering Documentation

To comply with the mandatory engineering standards, the following updates are specified for each stage:

### 4.1 Stage 1: System Architecture (`docs/architecture.md` — ISO/IEC/IEEE 42010:2022)
- **Section 1.2 (Stakeholder Concerns)**: Add Catechist and Assembly concerns regarding seamless canonical reading flow during liturgical celebrations.
- **Section 2 (System Context & External Interfaces)**: Update the data flow diagram illustrating the Evangelizo XML pipeline with edge revalidation (24h cache) and client-side reactive state injection.
- **Section 3.1 (Functional Viewpoint - Subsystem 4)**: Update Mass Guide Subsystem specifications:
  - Add Canonical Liturgy of the Word Generator component.
  - Document the sequential injection pipeline feeding both standard modal view and `AppleMusicLyrics` streaming interface.
- **Section 4 (Information Viewpoint)**: Document the updated `MassReadingsResponse` data contract including full psalm response, verse array/stanzas, and optional second reading.

### 4.2 Stage 2: Software Requirements Specification (`docs/srs.md` — ISO/IEC/IEEE 29148:2018)
- **Update RF-08 (Mass Guide & Liturgy Scraper Subsystem)**:
  - `RF-08.1`: **Daily Mass Readings Scraper API** — Formal input/output JSON schemas, caching policies (`Cache-Control: public, s-maxage=86400`), fallback guarantees.
  - `RF-08.2`: **Canonical Sequential Injection** — Strict GIRM sequence requirement, elimination of obsolete accordion.
  - `RF-08.3`: **Direct Access & Autonomous Fetching** — Modal initialization at Ritos Iniciales (Index 0), automatic background fetch lifecycle.
- **Acceptance Criteria**:
  - `AC-RF08-1` through `AC-RF08-8` covering full text preservation, psalm response recurrence, zero missing readings on Sundays, and sub-50ms render performance.

### 4.3 Stage 3: Life Cycle Task Execution Plan (`docs/tasks.md` — ISO/IEC/IEEE 12207:2017)
- **Update Milestone M6 (Mass Guide & Liturgical Readings Scraper)**:
  - Breakdown into atomic tasks:
    - `TSK-M6-01`: Overhaul `src/app/api/mass-readings/route.ts` parser for complete psalm verses, response, and entity decoding.
    - `TSK-M6-02`: Remove obsolete readings accordion from `src/app/LandingClient.tsx`.
    - `TSK-M6-03`: Implement sequential canonical injection into "Liturgia de la Palabra" in `LandingClient.tsx`.
    - `TSK-M6-04`: Update `AppleMusicLyrics` interactive mode mapping for Section 2 with dynamic live readings.
    - `TSK-M6-05`: Configure hero & nav Mass buttons for direct access and auto-fetch.
    - `TSK-M6-06`: Extend `scripts/test-e2e.mjs` with comprehensive Tier 1–5 test suite for R1–R3.
    - `TSK-M6-07`: Verify complete regression test execution and Next.js 15 build validation.

---

## 5. Caveats

- **External Feed Dependency**: The Evangelizo XML feed is an external HTTP service. The edge API route implements an `AbortSignal.timeout(6000)` and robust fallback to `FALLBACK_READINGS` to ensure zero client downtime even during upstream outages.
- **Language Scope**: While the Mass Ordinary dialogues support bilingual switching (Spanish/English), daily scraped readings are currently provided in Spanish (`lang=SP`), which aligns with the local Mexican diocesan use case.
- **No Assumptions**: No third-party testing libraries (e.g. Jest, Playwright) are introduced, adhering strictly to the local toolchain and zero-bloat architecture.

---

## 6. Conclusion

The verification and testing survey confirms that:
1. The project has a solid, fast, 100% passing test runner (`scripts/test-e2e.mjs`) and clean Next.js 15 build pipeline (`npm run build`).
2. The requirements for R1 (Scraper overhaul), R2 (Canonical sequential UI injection), and R3 (Direct access & auto-fetch) are clearly scoped with precise input/output contracts and UI integration points.
3. The comprehensive test strategy spanning Tier 1 through Tier 5 provides complete verification guarantees with zero ambiguity.
4. The 3-Stage Engineering documentation (`docs/architecture.md`, `docs/srs.md`, `docs/tasks.md`) has clear, actionable update blueprints mapped directly to IEEE 42010, 29148, and 12207 standards.

---

## 7. Verification Method

To independently verify all findings and test executions:

```bash
# 1. Execute full E2E & unit test regression harness
npm test

# 2. Directly execute test runner script
node scripts/test-e2e.mjs

# 3. Verify Next.js production build and TypeScript compilation
npm run build
```
