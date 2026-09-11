# Handoff Report — Explorer Survey 3: Scraper Architecture, USCCB Spanish Endpoints & Git/gh Setup

**Working Directory**: `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/teamwork_preview_explorer_survey_3`  
**Date**: 2026-09-11T05:51:00Z  
**Author**: Explorer Survey 3  
**Target Audience**: Orchestrator (orchestrator_5), Architecture & Planning Agents, Implementer Agents  

---

## 1. Observation

### 1.1 Architectural Structure of `rcolfin/catholic-mass-readings`
Direct inspection of `node_modules/catholic-mass-readings` in `lapandilladejesusqro.org` (and corresponding sources in `~/teamwork_projects/guadalupe_mass_interactive/node_modules/catholic-mass-readings`) reveals the following architecture:

1. **Package Configuration (`package.json`)**:
   - Package name: `"catholic-mass-readings"`, version: `"0.5.6"`.
   - Module system: `"type": "module"` (ESM only).
   - Entry points:
     - Main: `"./dist/index.js"`
     - Types: `"./dist/index.d.ts"`
     - Exports: `{ ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" } }`
   - Executable CLI: `"bin": { "catholic-mass-readings": "dist/cli.js" }`.
   - Core runtime dependencies: `"cheerio": "^1.0.0"`, `"commander": "^14.0.0"`. Optional dependency: `"impit": "^0.14.1"` (used in Node for TLS/browser impersonation).
   - Engine requirement: `"engines": { "node": ">=20" }`.
   - Build scripts: `"build": "tsc -p tsconfig.build.json"`, `"typecheck": "tsc --noEmit"`.

2. **Module Layout (`src/`)**:
   - `src/index.ts` (lines 1–15): Central barrel export for constants, errors, http, models, usccb, and utils.
   - `src/models.ts` (lines 1–337): Defines domain models and serialization contracts:
     - `MassType`: Enum (`DEFAULT = ""`, `DAWN = "DAWN"`, `DAY = "DAY"`, `NIGHT = "NIGHT"`, `VIGIL = "VIGIL"`, `YEARA = "YEARA"`, `YEARB = "YEARB"`, `YEARC = "YEARC"`).
     - `SectionType`: String enum (`UNKNOWN`, `ALLELUIA`, `ALTERNATIVE`, `GOSPEL`, `PSALM`, `READING`, `SEQUENCE`).
     - `Verse`: `{ text: string; link: string; book: string | null }`.
     - `Reading`: `{ verses: Verse[]; text: string }`.
     - `Section`: `{ type: SectionType; header: string; readings: Reading[] }`.
     - `Mass`: `{ date: Date | null; type: MassType | string | null; url: string; title: string; sections: Section[] }`.
     - Serialized JSON equivalents: `SerializedVerse`, `SerializedReading`, `SerializedSection`, `SerializedMass`.
     - Helper functions: `massToDict`, `massToString`, `sectionToDict`, `sectionToString`, `readingToDict`, `verseToDict`.
   - `src/usccb.ts` (lines 1–594): Core `USCCB` scraper client:
     - Methods: `getTodayMass`, `getMass(date, type)`, `getMassFromDate(date, types)`, `getMassFromUrl(url)`, `getMassFromTrustedUrl(url)`, `getMassTypes(date)`, `getSundayMassDates(start, end)`, `getMassDates(start, end, stepDays)`.
     - Parser: `parseMass(html, url, date, type)`:
       - Title extracted from `$('title').text().split('|')[0].trim()`.
       - Sections parsed via `getSections($)`.
       - Reading verses extracted via `getVerses($, address)`.
       - Text cleaned and formatted via `cleanText(input)`.
   - `src/constants.ts` (lines 1–495):
     - English URL formats:
       - `DAILY_READING_DEFAULT_MSS_URL_FMT = "https://bible.usccb.org/bible/readings/{DATE}.cfm"`
       - Variants: `{DATE}-Dawn.cfm`, `{DATE}-Day.cfm`, `{DATE}-Night.cfm`, `{DATE}-Vigil.cfm`, `{DATE}-YearA.cfm`, `{DATE}-YearB.cfm`, `{DATE}-YearC.cfm`.
     - English closing remarks:
       - `READING_CLOSE_REMARKS = "The word of the Lord."`, `READING_CLOSE_RESPONSE = "Thanks be to God."`
       - `GOSPEL_CLOSE_REMARKS = "The Gospel of the Lord."`, `GOSPEL_CLOSE_RESPONSE = "Praise to you, Lord Jesus Christ."`
     - Biblical Book catalogues: `OLD_TESTAMENT_BOOKS` and `NEW_TESTAMENT_BOOKS` (English abbreviations and English book titles).
   - `src/http.ts`, `src/http-node.ts`, `src/http-obolus.ts`, `src/obolus.ts`:
     - Pluggable `HttpClient` interface with `get`, `head`, and `reset`.
     - `createNodeHttpClient()` dynamically imports `impit` with fallback to native `fetch`.
     - `obolus.ts`: Implements Proof-of-Work challenge solver for USCCB anti-bot firewall (`X_Obolus_Proof` cookie).
   - `src/cli.ts` (lines 1–384):
     - CLI built with `commander`.
     - Commands: `get-mass`, `get-mass-types`, `get-mass-range`, `get-sunday-mass-range`.
     - Options: `--date <YYYY-MM-DD>`, `-t, --type <type>`, `--citations-only`, `--save <file>`, `--concurrency <count>`, `--allow-partial`.

3. **Date Parameter Handling**:
   - Inputs accept ISO `YYYY-MM-DD` via `parseIsoDate()`.
   - Date instances are converted to the USCCB URL format `MMDDYY` via `formatUrlDate(date: Date)` (e.g. `2026-09-10` becomes `091026`).
   - Timezone: `todayInNewYork()` uses `America/New_York` to match USCCB publication rollover.

4. **Versioning (CalVer vs SemVer)**:
   - The original library uses standard SemVer (`0.5.6`).
   - The user specification mandates Calendar Versioning (CalVer) with the format `YYYY.MM.MINOR` (e.g. `2026.09.0`) for Subproject 1.

---

### 1.2 USCCB Spanish Daily Mass Endpoints & Format
Live empirical verification was conducted using HTTP requests against `https://bible.usccb.org`:

1. **URL Schema**:
   - Default Spanish Daily Mass: `https://bible.usccb.org/es/bible/lecturas/{MMDDYY}.cfm`
     - Verification command: `curl -I -s -A "Mozilla/5.0..." https://bible.usccb.org/es/bible/lecturas/091026.cfm`
     - Response: `HTTP/2 200`, `content-language: es`, `content-type: text/html; charset=UTF-8`, `content-length: 57171`.
   - Sunday Spanish Mass: `https://bible.usccb.org/es/bible/lecturas/091326.cfm`
     - Response: `HTTP/2 200`, Title: `XXIV Domingo Ordinario | USCCB`.
   - Solemnity / Variant Suffixes:
     - Live testing on Christmas 2026 (`122526`):
       - `122526.cfm` -> `HTTP/2 200`
       - `122526-Day.cfm` -> `HTTP/2 200`
       - `122526-Dawn.cfm` -> `HTTP/2 200`
       - `122526-Night.cfm` -> `HTTP/2 200`
       - `122526-dia.cfm` -> `HTTP/2 404`
       - `122426-vigilia.cfm` -> `HTTP/2 404`
     - **Key Insight**: USCCB retains the English liturgical suffix (`-Day.cfm`, `-Dawn.cfm`, `-Night.cfm`) even under the `/es/bible/lecturas/` Spanish path. Spanish translated suffixes do NOT exist.

2. **HTML DOM Structure Comparison**:
   | Element | English USCCB (`/bible/readings/`) | Spanish USCCB (`/es/bible/lecturas/`) |
   |---|---|---|
   | Container | `div.container` | `div.container` |
   | Header Selector | `div.container .name` | `div.container .name` |
   | Header Text | "First Reading", "Responsorial Psalm", "Alleluia", "Gospel" | "Primera lectura", "Salmo Responsorial", "Aclamación antes del Evangelio", "Evangelio" |
   | Citation Selector | `div.container .address` | `div.container .address` |
   | Citation Inner HTML | `<a href="/bible/1corinthians/8">1 Corinthians 8:1-13</a>` | **Plain text**: `1 Corintios 8, 1-13` (NO `<a>` anchor tags) |
   | Reading Text | `div.container .content-body` | `div.container .content-body` |

3. **Root Cause of Parser Incompatibility**:
   Executing `catholic-mass-readings` against Spanish HTML fails with:
   `USCCBParseError: USCCB page contained no recognizable reading sections`
   - **Reason 1 (`usccb.ts:482-486` & `usccb.ts:424-425`)**:
     ```ts
     const verses = this.getVerses($, address);
     if (verses.length === 0) continue;
     ```
     `getVerses` queries `address.find("a[href]")`. Because the Spanish page has NO `<a>` tags in `.address`, `verses.length` is 0. The parser skips every section.
   - **Reason 2 (`models.ts:94-104`)**:
     ```ts
     export function sectionTypeFromHeader(header: string): SectionType {
       const lower = header.toLowerCase();
       if (lower.includes("alleluia")) return SectionType.ALLELUIA;
       if (lower.includes("gospel")) return SectionType.GOSPEL;
       if (lower.includes("psalm")) return SectionType.PSALM;
       if (lower.includes("sequence")) return SectionType.SEQUENCE;
       if (lower.includes("reading")) return SectionType.READING;
       if (lower.includes("or")) return SectionType.ALTERNATIVE;
       return SectionType.UNKNOWN;
     }
     ```
     Spanish headers ("Primera lectura", "Salmo Responsorial", "Aclamación antes del Evangelio", "Evangelio") fail all string checks and are classified as `SectionType.UNKNOWN`.
   - **Reason 3 (Closing remarks & Biblical books)**:
     - Spanish readings end with:
       - Reading: *"Palabra de Dios."* / *"Te alabamos, Señor."*
       - Gospel: *"Palabra del Señor."* / *"Gloria a ti, Señor Jesús."*
     - Book citations use Spanish names (`1 Corintios`, `Salmos`, `Lucas`, `Sirácida`, `Mateo`) with comma chapter-verse delimiters.

---

### 1.3 GitHub CLI (`gh`) and Git Environment
Executing live diagnostic commands yielded:

1. **Git Environment**:
   - Version: `git version 2.54.0 (Apple Git-157)`.
   - System default branch: `init.defaultbranch=main` (configured in `/Library/Developer/CommandLineTools/usr/share/git-core/gitconfig`).
   - Git User:
     - System/Global: `user.name = riosisraelg`, `user.email = riosisrael.g@icloud.com`.
     - Local repository: `user.name = Fernando Israel Rios Garcia`, `user.email = fernando.israel.rios@gmail.com`.

2. **GitHub CLI (`gh`)**:
   - Version: `gh version 2.98.0 (2026-08-20)`.
   - Authentication check (`gh auth status`):
     ```
     github.com
       ✓ Logged in to github.com account riosisraelg (keyring)
       - Active account: true
       - Git operations protocol: https
       - Token: gho_************************************
       - Token scopes: 'gist', 'read:org', 'repo', 'workflow'
     ```
   - Authentication is fully active and has `repo` and `workflow` scopes.

3. **Subproject 1 Git & Release Automation Workflow**:
   - Subproject directory: `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/subprojects/spanish-mass-readings`.
   - Initialization sequence:
     ```bash
     cd subprojects/spanish-mass-readings
     git init -b main
     git add .
     git commit -m "feat: initial commit of spanish-mass-readings scraper"
     gh repo create spanish-mass-readings --public --source=. --remote=origin --push
     git tag -a 2026.09.0 -m "Release 2026.09.0: Initial CalVer release"
     git push origin 2026.09.0
     ```
   - Parent repository `.gitignore` compliance:
     To avoid Git submodule or dirty nested repository warnings in `lapandilladejesusqro.org`, the parent `.gitignore` must include:
     ```gitignore
     /subprojects/spanish-mass-readings/.git
     ```

---

### 1.4 Codebase Extraction from `~/teamwork_projects/guadalupe_mass_interactive`
Direct inspection of `~/teamwork_projects/guadalupe_mass_interactive` confirms the following reusable assets:
1. **Subproject 1 Foundation**:
   - `src/types/catholic-mass-readings.ts`: Data contract interfaces (`SerializedMass`, `SerializedSection`, `SerializedReading`, `SerializedVerse`, `SectionType`).
   - `src/data/spanish_readings_2026_09_10.json`: Validated canonical JSON fixture for the USCCB Spanish readings for Sept 10, 2026.
   - `tests/unit/adversarial-readings-stress.test.ts`: Comprehensive 5-suite stress test verifying schema adherence, canonical Vulgate/Lectionary text, and parameter handling.
2. **Subproject 2 Foundation**:
   - `src/types/seguir-misa.ts`: Types for interactive Mass (`LiturgicalRite`, `SpeakerRole`, `BilingualText`, `LiturgicalTurn`, `SeguirMisaStep`, `SeguirMisaCatalog`).
   - `src/data/guadalupe_transcript_2026_09_10.json`: 5,413 lines of timestamped transcript segments from YouTube video `EkoysbFU47c`.
   - `src/data/liturgical_catalog_guadalupe.json`: Structured, curated Mass catalog mapping celebrant sayings to bilingual assembly responses (`rejoiceinfaith.org`).
   - `src/lib/seguir-misa-engine.ts`: Core retrieval and dialogue-pairing engine (`getLiturgicalCatalog`, `getStepById`, `getPairedResponseByTurnId`, `filterTurnByLanguage`).
   - `src/components/LiturgicalTurnCard.tsx`: Chat-style liturgical turn display supporting priest alignment vs assembly alignment.

---

## 2. Logic Chain

1. **Deduction 1 (Why `catholic-mass-readings` cannot be used directly for Spanish)**:
   - *Premise (Observation 1.1 & 1.2)*: `catholic-mass-readings` hardcodes English URLs (`https://bible.usccb.org/bible/readings/`), English section keywords ("reading", "psalm", "gospel"), and requires `<a href="...">` inside `.address`.
   - *Fact (Observation 1.2)*: USCCB Spanish pages use `/es/bible/lecturas/`, have Spanish headers ("Primera lectura", "Evangelio"), and contain plain-text citations without `<a>` tags.
   - *Conclusion*: A dedicated Spanish scraper (Subproject 1) is required. It should mirror the modular architecture of `catholic-mass-readings` (client, models, http, obolus, CLI) but incorporate Spanish endpoint routing, Spanish Lectionary book mappings, and regex/plain-text citation parsing.

2. **Deduction 2 (CalVer Versioning Strategy)**:
   - *Premise (Observation 1.1 & 1.3)*: The user requirement mandates CalVer in the format `YYYY.MM.MINOR`.
   - *Fact*: Today's date is September 2026 (`2026-09`).
   - *Conclusion*: The initial release tag for Subproject 1 must be `2026.09.0`. The `package.json` version in Subproject 1 must also be set to `"2026.09.0"`.

3. **Deduction 3 (Clean Workspace Integration)**:
   - *Premise (Observation 1.1 & 1.3)*: `lapandilladejesusqro.org` is a Next.js 15 application using TypeScript.
   - *Options*:
     1. Remote npm publish: Slow, introduces external dependency before publication.
     2. Relative file import / npm workspace: Root `package.json` defines `"workspaces": ["subprojects/*"]` or `"dependencies": { "spanish-mass-readings": "file:./subprojects/spanish-mass-readings" }`, paired with a `tsconfig.json` path alias `"spanish-mass-readings": ["./subprojects/spanish-mass-readings/src/index.ts"]`.
   - *Conclusion*: Using a local workspace / file dependency paired with a TypeScript path alias allows instant Hot Module Replacement (HMR), zero build latency during local testing, and clean imports in `src/app/api/mass-readings/route.ts`.

4. **Deduction 4 (Subproject 2 Mining & Curation Role)**:
   - *Premise (Observation 1.4)*: `guadalupe_mass_interactive` contains 5,413 lines of raw transcript (`guadalupe_transcript_2026_09_10.json`) and a curated catalog (`liturgical_catalog_guadalupe.json`).
   - *Fact*: The user requested a data-mining tool to process transcripts, identify liturgical structure, separate priest vs public dialogue, and archive the results.
   - *Conclusion*: Subproject 2 should be implemented in `subprojects/transcript-curator` as a Node.js/TypeScript tool. It will ingest YouTube transcripts, filter noise/music, align them with liturgical templates, and output the curated JSON files directly into `lapandilladejesusqro.org/src/data/liturgy/`.

---

## 3. Caveats

1. **Obolus Bot-Challenge Protection**:
   - Live testing demonstrated that USCCB uses Varnish/Pantheon bot detection (`X_Obolus_Grace` and `X_Obolus_Proof` cookies).
   - `subprojects/spanish-mass-readings` MUST incorporate the Obolus PoW solver and user-agent emulation (`impit` or standard fetch with browser headers) copied from `catholic-mass-readings`. Without this, upstream USCCB calls will periodically receive HTTP 403 Forbidden.
2. **Date Suffixes**:
   - Solemnity suffixes on USCCB are in English (`-Day.cfm`, `-Dawn.cfm`, `-Night.cfm`), NOT Spanish (`-dia.cfm`, `-vigilia.cfm`). The Spanish scraper must query `-Day.cfm`, etc.
3. **Alternative Readings (`O bien`)**:
   - In Spanish liturgies, optional readings are preceded by *"O bien"* or *"O bien:"*. The Spanish parser must detect this delimiter to segment alternative readings.
4. **Git Isolation**:
   - Because Subproject 1 has its own git repository inside the main project directory, the parent repository must ignore `subprojects/spanish-mass-readings/.git` to avoid git index conflicts.

---

## 4. Conclusion & Actionable Proposals

### 4.1 Target Architecture Overview

```
lapandilladejesusqro.org/
├── package.json                         [Root: Next.js + workspaces: ["subprojects/*"]]
├── tsconfig.json                        [Paths: "spanish-mass-readings" -> subprojects/.../src/index.ts]
├── src/
│   ├── app/api/mass-readings/route.ts   [Bilingual API: calls USCCB English + Spanish scraper]
│   ├── components/SeguirMisaModal.tsx   [Interactive guide: Priest (Right) vs Public (Left)]
│   └── data/liturgy/                    [Archived curated bilingual catalogs from Subproject 2]
│
├── subprojects/
│   ├── spanish-mass-readings/           [SUBPROJECT 1: Own Git repo + CalVer 2026.09.0]
│   │   ├── .git/                        [Initialized git repo with remote origin on GitHub]
│   │   ├── package.json                 [name: "spanish-mass-readings", version: "2026.09.0"]
│   │   ├── src/
│   │   │   ├── index.ts                 [Barrel export]
│   │   │   ├── constants.ts             [Spanish book catalog, URL formats, Spanish responses]
│   │   │   ├── errors.ts                [Custom USCCB error hierarchy]
│   │   │   ├── http.ts / obolus.ts      [HTTP client with Obolus PoW challenge solver]
│   │   │   ├── models.ts                [Mass, Section, Reading, Verse, SectionType]
│   │   │   ├── usccb-spanish.ts         [Spanish HTML parser & USCCBSpanish client]
│   │   │   ├── utils.ts                 [Date helpers, text normalizer, citation parser]
│   │   │   └── cli.ts                   [CLI: spanish-mass-readings get-mass --date YYYY-MM-DD]
│   │   └── tests/                       [Vitest unit and schema validation tests]
│   │
│   └── transcript-curator/              [SUBPROJECT 2: Data Mining Tool, NO separate git]
│       ├── package.json                 [name: "transcript-curator"]
│       ├── src/
│       │   ├── miner.ts                 [Ingests raw YouTube transcripts]
│       │   ├── liturgical-matcher.ts    [Matches rites: Inicial, Palabra, Eucaristía...]
│       │   ├── speaker-separator.ts     [Separates Priest (Right) vs Assembly (Left)]
│       │   └── index.ts                 [CLI/Script to output curated catalogs]
│       └── data/                        [Raw transcripts archive: EkoysbFU47c]
```

### 4.2 Concrete Implementation Specifications

#### Specification for Subproject 1: `spanish-mass-readings`
1. **Constants (`src/constants.ts`)**:
   ```ts
   export const USCCB_SPANISH_DEFAULT_URL_FMT = "https://bible.usccb.org/es/bible/lecturas/{DATE}.cfm";
   export const USCCB_SPANISH_DAY_URL_FMT     = "https://bible.usccb.org/es/bible/lecturas/{DATE}-Day.cfm";
   export const USCCB_SPANISH_DAWN_URL_FMT    = "https://bible.usccb.org/es/bible/lecturas/{DATE}-Dawn.cfm";
   export const USCCB_SPANISH_NIGHT_URL_FMT   = "https://bible.usccb.org/es/bible/lecturas/{DATE}-Night.cfm";

   export const READING_CLOSE_REMARKS_ES = "Palabra de Dios.";
   export const READING_CLOSE_RESPONSE_ES = "Te alabamos, Señor.";
   export const GOSPEL_CLOSE_REMARKS_ES = "Palabra del Señor.";
   export const GOSPEL_CLOSE_RESPONSE_ES = "Gloria a ti, Señor Jesús.";
   ```

2. **Spanish Section Detection (`src/usccb-spanish.ts`)**:
   ```ts
   export function sectionTypeFromHeaderEs(header: string): SectionType {
     const lower = header.toLowerCase();
     if (lower.includes("aleluya") || lower.includes("aclamación")) return SectionType.ALLELUIA;
     if (lower.includes("evangelio")) return SectionType.GOSPEL;
     if (lower.includes("salmo")) return SectionType.PSALM;
     if (lower.includes("secuencia")) return SectionType.SEQUENCE;
     if (lower.includes("lectura")) return SectionType.READING;
     if (lower.includes("o bien")) return SectionType.ALTERNATIVE;
     return SectionType.UNKNOWN;
   }
   ```

3. **Plain-Text Citation Parsing in `.address`**:
   ```ts
   // In usccb-spanish.ts:
   private getVerses($: cheerio.CheerioAPI, address: cheerio.Cheerio<Element>): Verse[] {
     const anchors = address.find("a[href]").toArray();
     if (anchors.length > 0) {
       return anchors.map(a => this.createVerse($, a));
     }
     // Fallback for Spanish USCCB: raw text inside .address
     const text = cleanText(address.text().trim());
     if (!text) return [];
     const book = extractSpanishBookName(text);
     return [{ text, link: "", book }];
   }
   ```

4. **Git & CalVer Release Script (`scripts/release-subproject-1.sh`)**:
   ```bash
   #!/usr/bin/env bash
   set -euo pipefail
   SUBPROJECT_DIR="subprojects/spanish-mass-readings"
   cd "$SUBPROJECT_DIR"
   git init -b main
   git config user.name "riosisraelg"
   git config user.email "riosisrael.g@icloud.com"
   git add .
   git commit -m "feat: initial commit of spanish-mass-readings open source scraper"
   gh repo create spanish-mass-readings --public --source=. --remote=origin --push
   git tag -a 2026.09.0 -m "Release 2026.09.0"
   git push origin 2026.09.0
   ```

#### Specification for Scraper Integration in `src/app/api/mass-readings/route.ts`
When `lang=es`, query the new `USCCBSpanish` client. Map the output to `MassReadingsResponse` so `LandingClient.tsx` seamlessly displays Spanish First Reading, Psalm (with response antiphon and strophes), Alleluia, and Gospel.
When `lang=bilingual`, execute `Promise.all` across both the English and Spanish scrapers, returning a unified bilingual reading payload.

---

## 5. Verification Method

To independently reproduce and verify all findings:

1. **Verify Git & GitHub CLI Environment**:
   ```bash
   git --version
   gh --version
   gh auth status
   ```
   *Expected*: `git version 2.54.0`, `gh version 2.98.0`, `Logged in to github.com account riosisraelg (keyring)`, `Active account: true`.

2. **Verify USCCB Spanish Live Endpoints**:
   ```bash
   # Test weekday mass:
   curl -I -s -A "Mozilla/5.0" "https://bible.usccb.org/es/bible/lecturas/091026.cfm" | grep -E "HTTP|content-language"
   # Test Sunday mass:
   curl -I -s -A "Mozilla/5.0" "https://bible.usccb.org/es/bible/lecturas/091326.cfm" | grep -E "HTTP|content-language"
   # Test Day variant:
   curl -I -s -A "Mozilla/5.0" "https://bible.usccb.org/es/bible/lecturas/122526-Day.cfm" | grep -E "HTTP|content-language"
   ```
   *Expected*: `HTTP/2 200` and `content-language: es` for all three requests.

3. **Verify Existing Scraping Logic & Tests in `guadalupe_mass_interactive`**:
   ```bash
   cd /Users/riosisraelg/teamwork_projects/guadalupe_mass_interactive
   npm test
   ```
   *Expected*: All unit and stress tests (including `adversarial-readings-stress.test.ts` and `readings-retrieval.test.ts`) pass.

4. **Verify CalVer & Repository Setup (Subproject 1 post-implementation)**:
   ```bash
   cd /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/subprojects/spanish-mass-readings
   git status
   git remote get-url origin
   git tag --points-at HEAD
   ```
   *Expected*: Clean working tree, remote URL pointing to `https://github.com/riosisraelg/spanish-mass-readings.git`, and tag output `2026.09.0`.

---
*End of Handoff Report.*
