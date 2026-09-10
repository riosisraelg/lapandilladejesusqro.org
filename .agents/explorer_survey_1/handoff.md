# Handoff Report: Mass Readings Implementation & Consumer Survey

## 1. Observation

### 1.1 `src/app/api/mass-readings/route.ts`
- **File Location**: `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/src/app/api/mass-readings/route.ts` (588 lines).
- **Exported TypeScript Interfaces** (lines 3–37):
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

  export interface LiturgicalMeditationSection {
    author: string;
    text: string;
  }

  export interface MassReadingsResponse {
    date: string; // Normalised 'YYYYMMDD' or 'YYYY-MM-DD'
    liturgicalDay: string; // e.g. "Viernes de la 21a semana del Tiempo Ordinario"
    saint?: string; // Daily saint commemoration
    firstReading: LiturgicalReadingSection;
    psalm: LiturgicalPsalmSection;
    secondReading?: LiturgicalReadingSection; // Omitted on weekdays, present on Sundays/Solemnities
    alleluia: LiturgicalAlleluiaSection;
    gospel: LiturgicalReadingSection;
    meditation?: LiturgicalMeditationSection;
    isFallback?: boolean; // True if served from embedded fallback
    source?: string; // 'evangelizo' | 'fallback'
  }
  ```
- **Query Parameter Handling** (lines 503–524):
  - `date`: If missing, formatted today in `America/Mexico_City` as `YYYYMMDD` via `Intl.DateTimeFormat('en-CA', { timeZone: 'America/Mexico_City', ... })`. If provided, non-digits are stripped (`dateParam.replace(/[^0-9]/g, '')`), turning `YYYY-MM-DD` into `YYYYMMDD`.
  - `lang`: `searchParams.get('lang')?.toUpperCase() || 'SP'`. If `'ES'`, mapped to `'SP'`.
- **Upstream Fetch Mechanism** (lines 524–535):
  - Endpoint: `http://feed.evangelizo.org/v2/reader.php?date=${dateParam}&lang=${langParam}&type=xml`
  - Headers:
    - `User-Agent: 'LaPandillaDeJesus-MassReader/1.0 (Querétaro; Catholic Youth Mission)'`
    - `Accept: 'application/xml, text/xml, */*'`
  - Next.js cache config: `next: { revalidate: 86400 }` (Edge cache for 24 hours).
  - Timeout: `signal: AbortSignal.timeout(6000)` (6 seconds).
- **XML Parsing & Tag Extraction** (lines 202–236, 425–500):
  - Tag extractor: `extractXmlTag(xml, tagName)` uses regex `<${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tagName}>`, removes `<![CDATA[ ... ]]>`, turns `<br>` into `\n` and `<p>` into paragraphs, strips HTML tags, decodes named and decimal/hex entities via `decodeEntities()` (lines 118–197).
  - XML field mapping in `parseEvangelizoXmlFeed()`:
    - `litugic_t` / `title` → `liturgicalDay`
    - `saint` → `saint`
    - `reading_text1_lt`, `reading_text1_st`, `reading_text1` → `firstReading`
    - `reading_text2_lt`, `reading_text2_st`, `reading_text2` → `psalm` (parsed by `parsePsalm()`, lines 241–334, which extracts antiphon response matching `/^(?:[—–\-]\s*)?(?:R\/?\.?|Respuesta:|Ant[ií]fona:)\s*/i` and separates stanzas into string array)
    - `buildLiturgicalAlleluia()` (lines 339–420): Liturgical season analyzer (Cuaresma, Pascua, Adviento, Navidad). If Lent, acclamation is `'Honor y gloria a ti, Señor Jesús'`, else `'¡Aleluya, aleluya!'`. Reads `reading_alleluia`, `reading_verse`, `reading_gospel_a`, or checks if `reading_text3` contains Alleluia.
    - `reading_text3_lt`, `reading_text3_st`, `reading_text3` → `secondReading` (only populated if non-empty and not an Alleluia).
    - `reading_gospel_lt`, `reading_gospel_st`, `reading_gospel` → `gospel`
    - `comment_t`, `comment_a`, `comment` → `meditation`
- **Fallback & Error Handling** (lines 40–113, 536–586):
  - Constant `FALLBACK_READINGS` contains complete static offline liturgy: First Reading (Ef 4, 1-6), Psalm 23 with response and 4 stanzas, Alleluia (Jn 6, 63c), Gospel (Jn 14, 1-6), and Meditation (San Agustín de Hipona).
  - Triggers for fallback:
    1. HTTP status `!res.ok` (returns fallback with `isFallback: true`, `source: 'fallback'`).
    2. Missing or non-XML response `!xmlText || !xmlText.includes('<evangelizo>')`.
    3. Network error, timeout, or parsing exception caught in `catch (error)`.
  - In all fallback responses, HTTP status is 200 with headers `Cache-Control: 'public, s-maxage=300, stale-while-revalidate=3600'`.

---

### 1.2 Consumers of `/api/mass-readings` and `MassReadingsResponse`

#### 1.2.1 `src/app/LandingClient.tsx` (Note: File is in `src/app/`, not `src/components/`)
- **Import** (line 10):
  `import type { MassReadingsResponse } from "./api/mass-readings/route";`
- **State Definition** (lines 763–764):
  ```typescript
  const [dailyReadings, setDailyReadings] = useState<MassReadingsResponse | null>(null);
  const [isLoadingReadings, setIsLoadingReadings] = useState(false);
  ```
- **Fetch Execution** (lines 767–785):
  ```typescript
  const fetchDailyReadings = useCallback(async (force = false) => {
    if (dailyReadings && !force) return;
    setIsLoadingReadings(true);
    try {
      const res = await fetch('/api/mass-readings');
      if (res.ok) {
        const data: MassReadingsResponse = await res.json();
        setDailyReadings(data);
      }
    } catch (err) {
      console.error('Error fetching daily mass readings:', err);
    } finally {
      setIsLoadingReadings(false);
    }
  }, [dailyReadings]);

  useEffect(() => {
    fetchDailyReadings();
  }, [fetchDailyReadings]);
  ```
- **Readings Rendering in Tab 1 ("Lecturas del Día")** (lines 2747–2875):
  - Banner: Shows `dailyReadings?.liturgicalDay`, `dailyReadings?.saint` badge, and `dailyReadings?.isFallback` indicator.
  - "↻ Actualizar" Button (lines 2754–2762):
    ```tsx
    <button
      type="button"
      onClick={() => fetchDailyReadings(true)}
      disabled={isLoadingReadings}
      style={{ ... }}
      title="Actualizar lecturas de hoy"
    >
      {isLoadingReadings ? 'Cargando...' : '↻ Actualizar'}
    </button>
    ```
    Triggers `fetchDailyReadings(true)` with `force = true`, which clears the cache guard, toggles `isLoadingReadings`, and re-fetches `/api/mass-readings`.
  - Readings Cards:
    - **First Reading**: `dailyReadings?.firstReading?.citation` and `dailyReadings?.firstReading?.text` followed by acclamation "Palabra de Dios. — Te alabamos, Señor."
    - **Responsorial Psalm**: `dailyReadings?.psalm?.citation`, antiphon `dailyReadings?.psalm?.response` prefixed with `R.`, and body `dailyReadings?.psalm?.text`.
    - **Second Reading**: Conditional on `{dailyReadings?.secondReading && ...}`, rendering `citation`, `text`, and "Palabra de Dios. — Te alabamos, Señor."
    - **Gospel Acclamation (Alleluia)**: Conditional on `{dailyReadings?.alleluia && ...}`, rendering `citation`, `acclamation`, and `«{dailyReadings.alleluia.verse}»`.
    - **Holy Gospel**: Gold-bordered card rendering `dailyReadings?.gospel?.citation`, `dailyReadings?.gospel?.text`, and "Palabra del Señor. — Gloria a ti, Señor Jesús."
    - **Meditation**: Conditional on `{dailyReadings?.meditation && ...}`, rendering author and text.

#### 1.2.2 `src/app/massResponses.ts`
- **Import** (line 1):
  `import type { MassReadingsResponse } from "./api/mass-readings/route";`
- **Functions Consuming `dailyReadings`**:
  - `getCanonicalMassLines(sectionIdx, dailyReadings, lang)` (lines 616–864):
    - Converts Liturgia de la Palabra (section index 1) into kinetic streaming lines for `AppleMusicLyrics.tsx` (consumed in `LandingClient.tsx` line 3388).
    - Injects First Reading, Responsorial Psalm (with alternating `Salmista` stanzas and `Todos` `R. ${response}`), Second Reading (if present), Alleluia, and Gospel with full GIRM rubrics and dialogs. Overrides Homily with `meditation` if present.
  - `getCanonicalMassSection(sectionIdx, dailyReadings)` (lines 869–1044):
    - Transforms section index 1 parts dynamically into structured `MassResponsePart[]` objects.
  - `getCanonicalMassResponses(dailyReadings)` (lines 1049–1053):
    - Maps all 4 Mass sections through `getCanonicalMassSection`.

#### 1.2.3 Test Suites
- `scripts/test-e2e.mjs` (lines 1902–2030, 2928–2965):
  - Tests `FALLBACK_READINGS`, `extractXmlTag`, `buildLiturgicalAlleluia`, `getCanonicalMassSection`, `getCanonicalMassLines`.
  - Notice tests `R8.19` and `R8.20` currently fail because they expect `setActiveGuiaTab('respuestas')` and `setModalUrl('guia', { seccion: 'respuestas' })` on the "Seguir Misa" button, whereas the button currently routes to `guia_misa_interactiva`.

---

### 1.3 `catholic-mass-readings` NPM Package Analysis
- **Version**: `catholic-mass-readings@0.5.6` (Apache-2.0).
- **Core Architecture**:
  - Scrapes `https://bible.usccb.org/bible/readings/` using `cheerio`.
  - Uses class `USCCB` with method `getMass(date: Date, type: MassType)` or `getMassFromDate(date: Date)`.
  - Returns `Mass` object:
    - `date: Date | null`
    - `type: MassType | string | null`
    - `title: string` (e.g. "Thursday of the Twenty-third Week in Ordinary Time")
    - `url: string`
    - `sections: Section[]`
      - Each `Section` has `type: SectionType` (`READING`, `PSALM`, `ALLELUIA`, `GOSPEL`, `ALTERNATIVE`, `SEQUENCE`, `UNKNOWN`), `header: string`, and `readings: Reading[]`.
      - Each `Reading` has `verses: Verse[]` (`text`: citation, `link`: USCCB URL, `book`: book name) and `text: string` (the scripture passage).
- **Language Support**:
  - The package is strictly a parser for `bible.usccb.org`, which is published in English.
  - There is **no language parameter** supported by the `catholic-mass-readings` package.
  - The requirement R2 in `ORIGINAL_REQUEST.md` states: *"Ensure that the language parameter (e.g., 'es', 'en') passed from the frontend is respected by the new library, if supported by the package."* Because the package does not support `es`, the implementation must gracefully accommodate this limitation or provide appropriate mappings/fallbacks.

---

## 2. Logic Chain

1. **API Contract Stability**:
   - `src/app/LandingClient.tsx` and `src/app/massResponses.ts` both depend directly on `MassReadingsResponse` (`firstReading`, `psalm`, `secondReading`, `alleluia`, `gospel`, `meditation`, `liturgicalDay`, `saint`, `isFallback`, `source`).
   - If `src/app/api/mass-readings/route.ts` maintains this exact interface, neither `LandingClient.tsx` nor `massResponses.ts` will break.

2. **Mapping `catholic-mass-readings` to `MassReadingsResponse`**:
   - `mass.title` maps directly to `liturgicalDay`.
   - `sections.find(s => s.type === SectionType.READING && s.header.includes('1'))` maps to `firstReading` (`citation = verses[0]?.text`, `text = reading.text`).
   - `sections.find(s => s.type === SectionType.PSALM)` maps to `psalm` (`citation = verses[0]?.text`, `text = reading.text`). The antiphon response and stanzas can be parsed from `reading.text` or lines starting with `R.`.
   - `sections.find(s => s.type === SectionType.READING && (s.header.includes('2') || s.header.includes('Second')))` maps to `secondReading` (if present).
   - `sections.find(s => s.type === SectionType.ALLELUIA)` maps to `alleluia` (`acclamation`, `verse`, `citation`).
   - `sections.find(s => s.type === SectionType.GOSPEL)` maps to `gospel` (`citation = verses[0]?.text`, `text = reading.text`).

3. **Query Parameters & Language Handling**:
   - The route handler currently accepts `date` and `lang`.
   - For `date`, `catholic-mass-readings` takes a JavaScript `Date` object: `new Date(year, monthIndex, day)`.
   - For `lang`, since `catholic-mass-readings` only scrapes `bible.usccb.org` (English), it cannot natively return Spanish readings. If `lang=es` is requested, the system can either return the USCCB readings or retain a Spanish fallback/hybrid approach, but per R2's qualifier ("if supported by the package"), returning the English USCCB readings is compliant because the package itself does not support multilingual feeds.

4. **Frontend "↻ Actualizar" Button**:
   - When the user taps "↻ Actualizar", `LandingClient.tsx` calls `fetchDailyReadings(true)`.
   - This sends `GET /api/mass-readings`. As long as the route handler responds with valid `MassReadingsResponse` JSON, the state updates and the UI renders without throwing React errors.

---

## 3. Caveats

1. **File Location**: The parent request referenced `src/components/LandingClient.tsx`. The actual path is `src/app/LandingClient.tsx`.
2. **Package Not Installed**: `catholic-mass-readings` is not yet listed in `package.json` dependencies and must be installed with `npm install catholic-mass-readings`.
3. **No Spanish Support in Upstream USCCB**: `catholic-mass-readings` only parses English readings from `bible.usccb.org`.
4. **Responsorial Psalm Formatting**: USCCB formatted psalm text contains `R. (...) <verse lines>` paragraphs. The antiphon extractor should parse `R. (...)` to populate `response` and `stanzas` accurately for antiphonal display in both Tab 1 and `AppleMusicLyrics`.
5. **Pre-existing Test Mismatches in `test-e2e.mjs`**: Tests `R8.19` and `R8.20` currently fail because they expect old string literals in `LandingClient.tsx`. Downstream teams must be aware so they do not attribute these two existing failures to the new library integration.

---

## 4. Conclusion

- The Mass Readings architecture is clean, highly modular, and decoupled via the `MassReadingsResponse` interface.
- Upgrading `src/app/api/mass-readings/route.ts` to use `catholic-mass-readings` requires:
  1. Installing `catholic-mass-readings` via npm.
  2. Instantiating `new USCCB(await createNodeHttpClient())` and querying `usccb.getMassFromDate(date)`.
  3. Mapping `mass.sections` (`SectionType.READING`, `PSALM`, `ALLELUIA`, `GOSPEL`) into `MassReadingsResponse`.
  4. Retaining `FALLBACK_READINGS` and the 6-second timeout error handler so the endpoint remains 100% resilient.
- `src/app/LandingClient.tsx` and `src/app/massResponses.ts` require no breaking changes if `MassReadingsResponse` field definitions remain intact.

---

## 5. Verification Method

1. **Verify Existing Files and Types**:
   - Inspect interface: `view_file` on `src/app/api/mass-readings/route.ts` lines 25–37.
   - Inspect consumer hook: `view_file` on `src/app/LandingClient.tsx` lines 763–785.
   - Inspect UI tab: `view_file` on `src/app/LandingClient.tsx` lines 2747–2875.
2. **Verify Tests**:
   - Run `node scripts/test-e2e.mjs` to confirm baseline test suite execution.
3. **Verify Upstream Package Contract**:
   - Run `node -e "const { USCCB } = require('catholic-mass-readings'); console.log(typeof USCCB);"` after package installation.
