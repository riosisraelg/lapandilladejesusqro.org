# Handoff Report — Catholic Mass Readings Library Survey

## 1. Observation

### A. Project Root Installation Status
- Inspection of `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/package.json` (lines 13–27):
  `catholic-mass-readings` is **not installed** in `dependencies` or `devDependencies`.
- Direct check in `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/node_modules/catholic-mass-readings`:
  The module directory does not exist.
- NPM Registry information (`npm view catholic-mass-readings`):
  - **Version**: `0.5.6` (published early September 2026 by `andrewtryder`).
  - **License**: Apache-2.0.
  - **Unpacked size**: 298.8 kB.
  - **Dependencies**: `cheerio: ^1.0.0`, `commander: ^14.0.0`.
  - **Optional dependencies**: `impit: ^0.14.1` (Chrome-like fetch backend, gracefully falls back to native `fetch`).
  - **Node.js Engine**: `"engines": { "node": ">=20" }`. Host environment Node version is `v26.7.0` (exceeds requirement).

### B. Library Architecture, API Methods, and Exports
Inspected from `catholic-mass-readings@0.5.6` unpacked source (`dist/index.d.ts` and `src/index.ts`):
1. **Primary Exports**:
   - Class: `USCCB` (client for querying and parsing USCCB daily mass readings).
   - Enums:
     - `MassType`: `DEFAULT = ""` | `DAWN = "DAWN"` | `DAY = "DAY"` | `NIGHT = "NIGHT"` | `VIGIL = "VIGIL"` | `YEARA = "YEARA"` | `YEARB = "YEARB"` | `YEARC = "YEARC"`.
     - `SectionType`: `READING = "READING"` | `PSALM = "PSALM"` | `ALLELUIA = "ALLELUIA"` | `GOSPEL = "GOSPEL"` | `SEQUENCE = "SEQUENCE"` | `ALTERNATIVE = "ALTERNATIVE"` | `UNKNOWN = "UNKNOWN"`.
   - Functions:
     - `createNodeHttpClient(options?: CreateFetchClientOptions): Promise<HttpClient>`
     - `createFetchClient(fetchImpl?: FetchLike, options?: CreateFetchClientOptions): HttpClient`
     - Utility functions: `readingHeader`, `readingTitle`, `massTypeToUrl`, `sectionTypeFromHeader`, `cleanText`, etc.
2. **Key Methods on `USCCB`**:
   - `constructor(client: HttpClient = createFetchClient())`
   - `static today(): Date`: Returns current date in `America/New_York` liturgical calendar.
   - `static maxQueryDate(): Date`: Computes upper liturgical calendar limit.
   - `getTodayMass(typeOrOptions?, options?): Promise<Mass | null>`
   - `getMass(date: Date, type: MassType, options?): Promise<Mass | null>`
   - `getMassFromDate(date: Date, typesOrOptions?: MassType[], options?): Promise<Mass | null>`: Automatically iterates fallback mass types (`DAY` -> `YEARA` -> `YEARB` -> `YEARC` -> `DEFAULT`) until a valid mass is fetched and parsed.
   - `getMassFromUrl(url: string, options?): Promise<Mass | null>`
   - `getMassTypes(date: Date, options?): Promise<MassType[]>`: Performs HTTP HEAD requests to discover available types (`VIGIL`, `NIGHT`, `DAWN`, `DAY`).
   - `parseMass(html: string, url: string, date: Date | null, type: MassType | string | null): Mass`: Standalone Cheerio-based parser.

### C. Data Structures Returned
The parsed structure returned by `getMass`, `getTodayMass`, and `getMassFromDate` conforms to the `Mass` interface:
```typescript
export interface Mass {
  date: Date | null;
  type: MassType | string | null;
  url: string;
  title: string;
  sections: Section[];
}

export interface Section {
  type: SectionType; // READING | PSALM | ALLELUIA | GOSPEL | SEQUENCE | ALTERNATIVE | UNKNOWN
  header: string;    // e.g. "Reading 1", "Responsorial Psalm", "Reading 2", "Alleluia", "Gospel"
  readings: Reading[];
}

export interface Reading {
  verses: Verse[];
  text: string;
}

export interface Verse {
  text: string;      // e.g. "1 Corinthians 8:1b-7, 11-13" or "Psalm 139:1b-3, 13-14ab, 23-24"
  link: string;      // e.g. "https://bible.usccb.org/bible/1corinthians/8?1"
  book: string | null; // e.g. "1 Corinthians", "Psalms", "Sirach", "Luke"
}
```

Direct live execution of `npx catholic-mass-readings get-mass` produced:
- `title`: `"Thursday of the Twenty-third Week in Ordinary Time"`
- `sections[0]` (`READING` / `"Reading 1"`):
  - `verses`: `[ { text: "1 Corinthians 8:1b-7, 11-13", link: "...", book: "1 Corinthians" } ]`
  - `text`: Full multi-paragraph reading body.
- `sections[1]` (`PSALM` / `"Responsorial Psalm"`):
  - `verses`: `[ { text: "Psalm 139:1b-3, 13-14ab, 23-24", link: "...", book: "Psalms" } ]`
  - `text`: Formatted with recurring responses `R. (24b) Guide me, Lord, along the everlasting way.` alternating with stanzas.
- `sections[2]` (`ALLELUIA` / `"Alleluia"`):
  - `verses`: `[ { text: "1 John 4:12", link: "...", book: "1 John" } ]`
  - `text`: Acclamation and verse body (`"R. Alleluia, alleluia.\n\nIf we love one another..."`).
- `sections[3]` (`GOSPEL` / `"Gospel"`):
  - `verses`: `[ { text: "Luke 6:27-38", link: "...", book: "Luke" } ]`
  - `text`: Full Gospel body.

Sunday execution (`2026-09-13`) verified 5 sequential sections:
- `Reading 1` (Sirach 27:30—28:7)
- `Responsorial Psalm` (Psalm 103)
- `Reading 2` (Romans 14:7-9)
- `Alleluia` (John 13:34)
- `Gospel` (Matthew 18:21-35)

### D. Language Support Audit
A search across all source code, models, and constants in `catholic-mass-readings` confirms:
- **No language configuration parameter exists**: The library contains no options, parameters, or functions for localization (`lang`, `locale`, `es`, `sp`).
- **Hardcoded upstream target**: It targets `https://bible.usccb.org/bible/readings/{DATE}.cfm`, which is exclusively the English-language Lectionary of the United States Conference of Catholic Bishops.
- **English-specific constants and regexes**:
  - Book names (`OLD_TESTAMENT_BOOKS`, `NEW_TESTAMENT_BOOKS`) are in English.
  - Section headers (`"Reading 1"`, `"Responsorial Psalm"`, `"Second Reading"`, `"Gospel"`, `"Alleluia"`) are matched against English keywords (`psalm`, `gospel`, `alleluia`, `reading`, `or`).
  - Liturgical day titles (`"Twenty-fourth Sunday in Ordinary Time"`) are in English.
- `utils.ts` line 48 strictly enforces that URLs must begin with `https://bible.usccb.org/bible/readings/`.

### E. Next.js Server Environment Compatibility
1. **Runtime Requirements**:
   - Next.js 15 App Router Route Handlers (`src/app/api/mass-readings/route.ts`) run in the Node.js runtime by default (`runtime = 'nodejs'`).
   - The package requires Node.js >= 20. The current runtime is Node.js v26.7.0.
   - It relies on `node:crypto` (`createHash`) to compute proof-of-work nonces when USCCB issues an Obolus challenge (`http-obolus.ts`). `node:crypto` is a built-in Node.js module and works in Route Handlers.
   - Dependencies `cheerio` and `commander` have zero browser/DOM dependencies.
   - `createNodeHttpClient()` uses platform `fetch` natively supported in Node 18+ and Next.js.
2. **Execution Test**:
   - Tested directly using Node.js with live calls to `usccb.getTodayMass()` and `usccb.getMassFromDate()`. Responses completed in under 400ms without bot blocks, timeouts, or exceptions.

---

## 2. Logic Chain

1. **Premise**: `package.json` does not currently list `catholic-mass-readings`.
   - **Inference**: To use it, `npm install catholic-mass-readings` must be run in the project root.

2. **Premise**: The prompt requires replacing `evangelizo.org` XML feeds with `catholic-mass-readings` while mapping to `MassReadingsResponse` so that `LandingClient.tsx` and `massResponses.ts` continue functioning without UI regressions.
   - **Inference**: `MassReadingsResponse` requires:
     - `firstReading`: `{ citation, shortCitation, text }`
     - `psalm`: `{ citation, shortCitation, response, text, stanzas }`
     - `secondReading` (optional): present on Sundays / Solemnities when a second reading section is returned.
     - `alleluia`: `{ citation, acclamation, verse }`
     - `gospel`: `{ citation, shortCitation, text }`
     - `liturgicalDay`: string (maps to `mass.title`)
     - `date`: string (`YYYYMMDD`)
     - `source`: `'catholic-mass-readings'`
   - **Inference**: Each section returned by `USCCB.getMassFromDate()` maps cleanly to these fields:
     - `reading.verses.map(v => v.text).join(', ')` gives the accurate canonical citation.
     - `reading.text` gives the full text.
     - In the Responsorial Psalm, `R. (...) <phrase>` lines provide the antiphon response, and non-response paragraphs provide the `stanzas` array.
     - In Alleluia, `R. Alleluia...` provides the acclamation and remaining text provides the verse.

3. **Premise**: User Requirement R2 states:
   *"Ensure that the language parameter (e.g., 'es', 'en') passed from the frontend is respected by the new library, if supported by the package."*
   - **Observation**: The library does **not** support language parameters; USCCB only provides English lectionary readings via `catholic-mass-readings`.
   - **Inference**: The implementation in `route.ts` must acknowledge this limitation:
     - For `en` requests: `catholic-mass-readings` returns the official USCCB text.
     - For `es` requests: Since `catholic-mass-readings` does not support Spanish, the backend can either:
       1. Default to returning the USCCB readings (in English) as the unified readings engine, per the overarching goal: *"Replace the current mass readings engine (which uses evangelizo.org XML feeds) with the catholic-mass-readings library. Ensure this new engine is used everywhere readings are displayed"*.
       2. Or implement a dual-engine fallback: if `lang === 'es'`, query Evangelizo if available, falling back to `catholic-mass-readings` (or vice-versa).
     - Because `LandingClient.tsx` has bilingual support (`activeLang`, `guiaLang`), providing USCCB English readings when `guiaLang === 'en'` fulfills bilingual expectations, while `guiaLang === 'es'` displays the scripture readings from the active engine.

4. **Premise**: Route Handlers must handle potential network downtime or USCCB outages gracefully.
   - **Inference**: The existing `FALLBACK_READINGS` static object in `src/app/api/mass-readings/route.ts` should be retained so that if USCCB network requests timeout or fail, the API still returns HTTP 200 with fallback data.

---

## 3. Caveats

1. **Strictly English Scripture**:
   `catholic-mass-readings` only scrapes `bible.usccb.org/bible/readings/`. No Spanish translations are exposed by this package. Downstream agents and users must know that Spanish liturgical texts cannot be fetched via this library alone.
2. **No Dedicated Meditation / Daily Saint Field**:
   USCCB does not provide patristic meditations or separate daily saint memorial fields. `meditation` and `saint` in `MassReadingsResponse` should be optional or omitted unless extracted from the liturgical day title.
3. **Bot Mitigation (Obolus Proof-of-Work)**:
   USCCB employs a proof-of-work challenge ("Obolus"). `catholic-mass-readings` handles this internally via `node:crypto`, but requests from heavily rate-limited cloud IPs (like standard Vercel serverless ranges) could occasionally encounter high difficulty challenges. A timeout of 6–10 seconds with fallback to static liturgy is recommended.
4. **Date Format Differences**:
   The existing route accepts `date` in `YYYYMMDD` format (e.g. `20260910`). `catholic-mass-readings` expects a JavaScript `Date` object (or formats as `MMDDYY` for USCCB URLs). The route must parse `YYYYMMDD` or `YYYY-MM-DD` into a `Date` object before calling `usccb.getMassFromDate(date)`.

---

## 4. Conclusion

The `catholic-mass-readings` library (version `0.5.6`) is completely viable and ready to be integrated into the Next.js server environment (`src/app/api/mass-readings/route.ts`).

### Recommended Implementation Steps for the Implementer:

1. **Install Package**:
   Run in project root:
   ```bash
   npm install catholic-mass-readings
   ```
2. **Update `src/app/api/mass-readings/route.ts`**:
   Replace the Evangelizo scraper with a `USCCB` client instance and the tested mapping logic.
3. **Maintain API Contract**:
   Ensure `MassReadingsResponse` remains backwards compatible with `LandingClient.tsx` and `massResponses.ts`.

### Tested Mapping Logic Reference:
```typescript
import { NextResponse } from 'next/server';
import { USCCB, SectionType, createNodeHttpClient, Mass, Section, Reading } from 'catholic-mass-readings';
import type { MassReadingsResponse, LiturgicalPsalmSection, LiturgicalAlleluiaSection } from './route';

function parsePsalmFromReading(readingText: string, citation: string): LiturgicalPsalmSection {
  if (!readingText || !readingText.trim()) {
    return { citation: citation || 'Responsorial Psalm', response: '', text: '', stanzas: [] };
  }
  const paragraphs = readingText.split(/\n\s*\n+/).map(p => p.trim()).filter(Boolean);
  const responsePrefixRegex = /^R\.\s*(?:\([^\)]+\)\s*)?/i;

  let response = '';
  const stanzas: string[] = [];

  for (const para of paragraphs) {
    if (responsePrefixRegex.test(para)) {
      if (!response) {
        response = para.replace(responsePrefixRegex, '').trim();
      }
      const withoutR = para.replace(responsePrefixRegex, '').trim();
      if (withoutR === response || para.startsWith('R.')) continue;
    }
    stanzas.push(para);
  }

  if (!response && paragraphs.length > 0) {
    response = paragraphs[0].replace(/^R\.\s*/i, '').trim();
    if (stanzas.length === 0) stanzas.push(...paragraphs.slice(1));
  }

  return {
    citation: citation || 'Responsorial Psalm',
    shortCitation: citation,
    response,
    text: stanzas.join('\n\n') || readingText,
    stanzas: stanzas.length > 0 ? stanzas : [readingText],
  };
}

function parseAlleluiaFromReading(readingText: string, citation?: string): LiturgicalAlleluiaSection {
  if (!readingText || !readingText.trim()) {
    return { citation, acclamation: 'Alleluia, alleluia!', verse: '' };
  }
  const lines = readingText.split(/\n+/).map(l => l.trim()).filter(Boolean);
  const rAlleluiaRegex = /^R\.\s*(?:alleluia|aleluya)/i;
  let acclamation = 'Alleluia, alleluia!';
  const verseLines: string[] = [];

  for (const line of lines) {
    if (rAlleluiaRegex.test(line)) {
      acclamation = line.replace(/^R\.\s*/i, '').trim();
    } else {
      verseLines.push(line);
    }
  }

  return {
    citation,
    acclamation,
    verse: verseLines.join('\n') || readingText,
  };
}

export function mapUsccbMassToResponse(mass: Mass, requestedDateStr: string): MassReadingsResponse {
  const sections = mass.sections || [];

  // First Reading
  const r1Sec = sections.find(s =>
    s.type === SectionType.READING &&
    (s.header.toLowerCase().includes('1') || !s.header.toLowerCase().includes('2'))
  ) || sections.find(s => s.type === SectionType.READING);
  const r1 = r1Sec?.readings[0];
  const r1Citation = r1?.verses.map(v => v.text).join(', ') || r1Sec?.header || 'Reading 1';

  // Psalm
  const psalmSec = sections.find(s => s.type === SectionType.PSALM);
  const psalmReading = psalmSec?.readings[0];
  const psalmCitation = psalmReading?.verses.map(v => v.text).join(', ') || psalmSec?.header || 'Responsorial Psalm';
  const psalm = parsePsalmFromReading(psalmReading?.text || '', psalmCitation);

  // Second Reading (Sundays / Solemnities)
  const r2Sec = sections.find(s =>
    s.type === SectionType.READING &&
    (s.header.toLowerCase().includes('2') || s.header.toLowerCase().includes('second'))
  );
  let secondReading = undefined;
  if (r2Sec && r2Sec.readings[0]?.text) {
    const r2 = r2Sec.readings[0];
    const r2Citation = r2.verses.map(v => v.text).join(', ') || r2Sec.header || 'Reading 2';
    secondReading = { citation: r2Citation, shortCitation: r2Citation, text: r2.text };
  }

  // Alleluia
  const alleluiaSec = sections.find(s => s.type === SectionType.ALLELUIA);
  const alleluiaReading = alleluiaSec?.readings[0];
  const alleluiaCitation = alleluiaReading?.verses.map(v => v.text).join(', ') || undefined;
  const alleluia = parseAlleluiaFromReading(alleluiaReading?.text || '', alleluiaCitation);

  // Gospel
  const gospelSec = sections.find(s => s.type === SectionType.GOSPEL);
  const gospelReading = gospelSec?.readings[0];
  const gospelCitation = gospelReading?.verses.map(v => v.text).join(', ') || gospelSec?.header || 'Gospel';

  return {
    date: requestedDateStr,
    liturgicalDay: mass.title || 'Daily Mass',
    firstReading: { citation: r1Citation, shortCitation: r1Citation, text: r1?.text || '' },
    psalm,
    ...(secondReading ? { secondReading } : {}),
    alleluia,
    gospel: { citation: gospelCitation, shortCitation: gospelCitation, text: gospelReading?.text || '' },
    isFallback: false,
    source: 'catholic-mass-readings',
  };
}
```

---

## 5. Verification Method

To independently verify these findings:

1. **CLI Verification of readings & schema**:
   ```bash
   npx catholic-mass-readings get-mass --date 2026-09-10
   npx catholic-mass-readings get-mass --date 2026-09-13
   ```
   Inspect stdout for presence of Reading 1, Psalm with recurring responses, Reading 2 (Sunday), Alleluia, and Gospel.

2. **Package Inspection**:
   ```bash
   npm view catholic-mass-readings
   ```
   Confirm version `0.5.6`, Node engine `>=20`, dependencies `cheerio` and `commander`.

3. **Check Language Options in Package**:
   ```bash
   npx catholic-mass-readings --help
   npx catholic-mass-readings get-mass --help
   ```
   Notice flags: `--date`, `--type`, `--citations-only`, `--save`, `--output`. No `--lang` or `--locale` option exists.

4. **Integration Test Verification**:
   Once implemented in `src/app/api/mass-readings/route.ts`:
   ```bash
   curl -s http://localhost:3000/api/mass-readings | jq .
   ```
   Check that response contains `.firstReading.citation`, `.firstReading.text`, `.psalm.response`, `.psalm.stanzas`, `.gospel.citation`, `.gospel.text`, and `.source == "catholic-mass-readings"`.
