# Handoff Report: API & Liturgical Scraper Specialist Survey

## 1. Observation

### 1.1 Current Route Implementation (`src/app/api/mass-readings/route.ts`)
Direct inspection of `src/app/api/mass-readings/route.ts` reveals:
- **Upstream Feed URL**: Queries `http://feed.evangelizo.org/v2/reader.php?date=${dateParam}&lang=${langParam}&type=xml` (lines 218-228).
- **TypeScript Interface (`MassReadingsResponse`)**:
  ```typescript
  export interface MassReadingsResponse {
    date: string;
    liturgicalDay: string;
    saint?: string;
    firstReading: {
      citation: string;
      shortCitation?: string;
      text: string;
    };
    psalm: {
      citation: string;
      shortCitation?: string;
      response: string;
      text: string;
    };
    secondReading?: {
      citation: string;
      shortCitation?: string;
      text: string;
    };
    gospel: {
      citation: string;
      shortCitation?: string;
      text: string;
    };
    meditation?: {
      author: string;
      text: string;
    };
    isFallback?: boolean;
  }
  ```
- **Defects & Gaps Observed**:
  1. **Missing Alleluia (`alleluia`)**: The interface and parsing logic completely omit the Gospel Acclamation / Alleluia (`alleluia` / `Aclamación antes del Evangelio`), which is required by R1 and liturgical canonical order (Primera Lectura → Salmo → Segunda Lectura → Aleluya → Evangelio).
  2. **Fragile / Incorrect Psalm Response Extraction**:
     Line 137:
     ```typescript
     const firstLine = psalmText.split('\n')[0]?.replace(/[—–\-]/g, '').trim();
     if (firstLine && firstLine.length < 120) {
       psalmResponse = firstLine;
     }
     ```
     *Impact*: In Evangelizo's XML `reading_text2`, there is no explicit antiphon tag. The first line is actually verse 1 of the psalm (e.g., *"Aclamen, justos, al Señor:"* or *"Señor, tú eres mi Dios,"*), NOT the liturgical antiphon response. Furthermore, this first verse line is both stored in `response` AND remains at the top of `text`, duplicating the verse text and losing the true responsorial structure.
  3. **Second Reading Handling on Weekdays vs Sundays/Feasts**:
     Lines 178-184: `reading_text3` is checked with `if (reading2Text && reading2Text.trim().length > 0)`. On weekdays, `reading_text3` in Evangelizo XML is empty or contains whitespace (`<reading_text3><![CDATA[]]></reading_text3>`). When empty, `result.secondReading` is omitted as expected. On Sundays, `reading_text3` contains the apostolic epistle.
  4. **Date Normalization & Timezone Handling**:
     Lines 200-213: Date formatting defaults to `America/Mexico_City` timezone formatted as `YYYYMMDD`. When `?date=YYYY-MM-DD` is passed, non-digits are stripped (`.replace(/[^0-9]/g, '')`).
  5. **Timeout & Caching**:
     - `fetch` uses `signal: AbortSignal.timeout(6000)` (6 seconds).
     - Next.js server revalidation: `next: { revalidate: 86400 }` (24h).
     - HTTP Cache-Control: `public, s-maxage=86400, stale-while-revalidate=43200` on success; `public, s-maxage=3600, stale-while-revalidate=86400` on fallback.

### 1.2 Upstream Data Sources Investigation
We tested and analyzed live external Catholic daily liturgy providers:

1. **Evangelizo Feed (`http://feed.evangelizo.org/v2/reader.php`)**:
   - **Response Speed**: Extremely fast (~200–400ms).
   - **Payload**: Standard XML with CDATA sections.
   - **Tags provided**:
     - `<litugic_t>`: Liturgical title (e.g. `Viernes de la 21a semana del Tiempo Ordinario`, `22o domingo del Tiempo Ordinario`).
     - `<saint>`: Daily saint commemoration (e.g. `San Agustin de Hipona`).
     - `<reading_text1_lt>`, `<reading_text1_st>`, `<reading_text1>`: 1st reading full citation, short citation, full text.
     - `<reading_text2_lt>`, `<reading_text2_st>`, `<reading_text2>`: Psalm citation and complete stanzas separated by `\n\n`.
     - `<reading_text3_lt>`, `<reading_text3_st>`, `<reading_text3>`: 2nd reading (Sundays/Solemnities).
     - `<reading_gospel_lt>`, `<reading_gospel_st>`, `<reading_gospel>`: Gospel full citation, short citation, full text.
     - `<comment_t>`, `<comment_a>`, `<comment>`: Patristic meditation.
   - **Supported Date Window**: Rolling window of ~30–45 days. Dates too far in the future/past return an HTML error/documentation page instead of `<evangelizo>`.
   - **Missing Elements**: No `<reading_alleluia>` tag; Psalm stanzas do not have inline `<R/>` markers.

2. **Ciudad Redonda (`https://www.ciudadredonda.org/`)**:
   - **Structure**: Rich HTML (`div.et_builder_inner_content` / `div.mec-event-content`) with `<h2>Primera Lectura</h2>`, `<h2>Salmo</h2>`, `<h2>Segunda Lectura</h2>`, `<h2>Evangelio</h2>`.
   - **Psalm Format**: Contains explicit `R/. <antiphon text>` and stanzas with repeated `<b>R/.</b>`.
   - **Dismissal Formulas**: Contains `Palabra de Dios` and `Palabra del Señor`.
   - **Limitations**: Slower (~900–1400ms), dynamic calendar URL paths per day (`/events/lecturas-del-...`), subject to CMS layout changes, no explicit Alleluia verse section.

3. **USCCB (`https://bible.usccb.org/es/bible/lecturas/`)**:
   - Protected by Cloudflare / Obolus JavaScript Proof-of-Work (`/obolus-challenge`) mining challenge. Direct Node.js HTTP fetches are blocked.

### 1.3 UI Integration Observations in `src/app/LandingClient.tsx`
- **Duplicate Views**:
  - Modal Tab 1 (`activeGuiaTab === 'lecturas'`): Renders cards for Primera Lectura, Salmo, Segunda Lectura (if present), Evangelio, Meditación.
  - Modal Tab 2 (`activeGuiaTab === 'respuestas'`): Renders a collapsible accordion `📖 Lecturas del Día` at lines 2588–2644 duplicating the exact same cards above the 5 Mass sections.
- **Section 2 ("Liturgia de la Palabra") in `massResponses.ts`**:
  Currently holds static generic placeholder lines (`"Lectura de la Sagrada Escritura... (El lector proclama la primera lectura)"`).
  The user request (R2) requires eliminating the detached accordion and dynamically embedding the live readings directly into the sequential flow of "Liturgia de la Palabra" (Primera Lectura → Salmo Responsorial → Segunda Lectura → Aleluya → Evangelio).
- **Auto-fetch & Entry Point (R3)**:
  `fetchDailyReadings` is currently called only when `showGuiaMisa` is opened or `activeGuiaTab === 'lecturas'`. Opening the Mass Guide modal should land directly on the Mass start (Ritos Iniciales) while automatically fetching readings in the background so they are ready by the time the user reaches Liturgia de la Palabra.

---

## 2. Logic Chain

1. **Premise 1 (R1 Completeness)**: The Mass readings API must return all canonical elements for the daily Catholic liturgy:
   - Date (`YYYYMMDD` / `YYYY-MM-DD`)
   - Liturgical Title (`liturgicalDay`, e.g., *"XXII Domingo del Tiempo Ordinario"*, *"Memoria de San Agustín"*)
   - Saint commemoration (`saint`)
   - First Reading (`firstReading`: full citation, short citation, full text, proclamation formula)
   - Responsorial Psalm (`psalm`: full citation, antiphon response `response`, complete stanzas `text` / `stanzas` with recurring `R.` indicators)
   - Second Reading (`secondReading`: full citation, short citation, full text, only when present on Sundays/Solemnities)
   - Gospel Acclamation (`alleluia`: acclamation formula `"¡Aleluya, aleluya!"` or Lenten equivalent, verse text, citation)
   - Gospel (`gospel`: full citation, short citation, full text, proclamation formula)
   - Patristic Meditation (`meditation`: author, text)
   - Status flags (`isFallback`, `source`)

2. **Premise 2 (Reliability & Resilience)**:
   - Evangelizo is the fastest, highest-uptime structured data feed, but lacks an Alleluia tag and has no dedicated Psalm `R.` antiphon tag.
   - We must enhance the scraper parser to:
     a) Cleanly format Psalm stanzas (splitting on stanza boundaries `\n\n`) and extract/format the true responsorial structure without corrupting verse 1.
     b) Provide the canonical Alleluia acclamation (with seasonal adaptation: Lent acclamation vs Ordinary Time / Easter Alleluia) and lectionary verse.
     c) Support optional multi-source cascading (e.g. Ciudad Redonda / Evangelizo / Fallback) with strict timeouts.
   - When upstream feeds fail (5xx, 4xx, network timeout > 6s, or malformed XML outside the 30-day window), gracefully return the bundled canonical `FALLBACK_READINGS` with `isFallback: true` so the application never crashes or displays empty cards.

3. **Premise 3 (Performance & Caching Strategy)**:
   - Readings for any calendar day are immutable once published.
   - Next.js Edge / Server Cache: `next: { revalidate: 86400 }` (24 hours).
   - HTTP Cache Headers: `Cache-Control: public, s-maxage=86400, stale-while-revalidate=43200` for successful scrapes; `s-maxage=300, stale-while-revalidate=3600` for fallbacks.
   - Browser client: In-memory React state caching in `LandingClient.tsx` (`dailyReadings`), with an explicit force refresh capability (`↻ Actualizar`).

---

## 3. Caveats

1. **External Feed Availability Window**:
   Evangelizo XML feed operates on a rolling window (~30 to 45 days). Querying dates months into the future or years in the past will hit the fallback liturgy. This is normal for live liturgical scrapers.
2. **Liturgical Differences by Country**:
   Evangelizo `lang=SP` serves the Spanish-language lectionary commonly used across Latin America and Spain. Minor stylistic variations in translations (e.g., Spain Lectionary vs Mexican Episcopal Conference Lectionary) exist, but the biblical passages, citations, and liturgical cycles are identical across the Roman Rite.
3. **Lenten Gospel Acclamation**:
   During Lent (Cuaresma), the Catholic liturgy forbids singing/saying "Aleluya", substituting acclamations such as *"Honor y gloria a ti, Señor Jesús"* or *"Gloria y alabanza a ti, Señor Jesús"*. The Alleluia builder should inspect the liturgical season / title to supply the correct acclamation.
4. **No Code Modification Constraint**:
   As Explorer 1, this report is strictly read-only analysis. Proposed enhancements and code snippets are provided for implementation in the next phase.

---

## 4. Conclusion

### Summary of Architectural Findings & Recommendations:
1. **API Route Update (`src/app/api/mass-readings/route.ts`)**:
   - Expand `MassReadingsResponse` interface to include `alleluia: { citation?: string; acclamation: string; verse: string; }` and structured `psalm: { citation: string; shortCitation?: string; response: string; text: string; stanzas?: string[]; }`.
   - Fix the Psalm parser so it preserves all stanzas completely and accurately formats the antiphon response.
   - Add liturgical Alleluia generator that provides seasonal acclamations (Aleluya vs Lent) and canonical verse.
   - Update `FALLBACK_READINGS` to include the complete canonical Alleluia and 4-stanza Psalm 23 with `R.`.
   - Maintain robust 6-second timeout and 24-hour caching headers.

2. **Frontend UI Integration (`src/app/LandingClient.tsx` & `src/app/massResponses.ts`)**:
   - Remove the redundant accordion in Tab 2 (`📖 Lecturas del Día`).
   - Dynamically inject the readings directly into Section 2 ("Liturgia de la Palabra") of `massResponses`:
     * Part 0 (Primera Lectura) → Proclamation + Citation + Full Reading Text + *"Palabra de Dios. — Te alabamos, Señor."*
     * Part 1 (Salmo Responsorial) → Citation + Antiphon `R.` Box + Stanzas with recurring `R.` responses.
     * Part 2 (Segunda Lectura) → Conditionally rendered only when `secondReading` exists (Sundays/Solemnities).
     * Part 3 (Aclamación antes del Evangelio / Aleluya) → Standing posture + Acclamation + Gospel Verse.
     * Part 4 (Proclamación del Santo Evangelio) → Dialogues + Citation + Full Gospel Text + *"Palabra del Señor. — Gloria a ti, Señor Jesús."*
   - Configure the Mass button to launch directly into the Mass guide (Ritos Iniciales) while automatically prefetching the daily readings in the background.

---

## 5. Verification Method

### 5.1 Automated API Verification Commands
1. **Fetch Today's Readings**:
   ```bash
   curl -s "http://localhost:3000/api/mass-readings" | jq '{date, liturgicalDay, saint, firstReading: .firstReading.citation, psalm: .psalm.citation, secondReading: .secondReading.citation, alleluia: .alleluia.acclamation, gospel: .gospel.citation, isFallback}'
   ```
2. **Fetch Sunday Readings (Verify 2nd Reading & Full Psalm)**:
   ```bash
   curl -s "http://localhost:3000/api/mass-readings?date=20260830" | jq '{liturgicalDay, hasSecondReading: (.secondReading != null), secondReadingCitation: .secondReading.citation, psalmResponse: .psalm.response}'
   ```
3. **Verify Fallback on Invalid / Out-of-Range Date**:
   ```bash
   curl -s "http://localhost:3000/api/mass-readings?date=20350101" | jq '{isFallback, liturgicalDay, firstReading: .firstReading.citation}'
   ```
4. **Run Project Build & Tests**:
   ```bash
   npm run build
   npm test
   ```

### 5.2 Manual UI Verification Checklist
- Open the Mass Guide: Verify the modal opens immediately to Ritos Iniciales without lag.
- Navigate to "Liturgia de la Palabra": Verify readings are seamlessly embedded in canonical order (1st Reading → Responsorial Psalm with R. and all stanzas → 2nd Reading if Sunday → Alleluia → Gospel).
- Verify weekday vs Sunday: On weekdays, the 2nd Reading section is gracefully omitted; on Sundays, it is displayed.
- Test offline / fallback: When network is disabled, verified fallback liturgy renders with full texts.
