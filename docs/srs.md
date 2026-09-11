# ISO/IEC/IEEE 29148:2018 Software Requirements Specification (SRS)

**System Name**: La Pandilla de Jesús — Querétaro Web Platform & Liturgical Scraper Ecosystem  
**Governing Standard**: ISO/IEC/IEEE 29148:2018 (Systems and software engineering — Life cycle processes — Requirements engineering)  
**Document Identification**: `SRS-LPJQRO-2026-02`  
**Document Version**: 2.0.0  
**Date**: 2026-09-11  
**Status**: Authoritative & Approved  
**Author**: Worker M1 (Architecture & Requirements Engineering)  
**Lifecycle State**: State 2 (Requirements Baseline)  

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) establishes the definitive, complete, and verifiable functional, non-functional, and interface requirements for the **La Pandilla de Jesús Querétaro** ecosystem (`lapandilladejesusqro.org`), including its two specialized subprojects:
1. **Subproject 1 (`subprojects/spanish-mass-readings`)**: Open-source Spanish USCCB Mass Readings Scraper library and CLI.
2. **Subproject 2 (`subprojects/mass-transcript-miner`)**: YouTube Mass Transcript Mining and Liturgical Dialogue Curation Tool.
3. **Host Application Integration**: Dual-engine bilingual scraper route and interactive chat-style lyrics modal.

This specification serves as the formal contractual baseline for implementation, multi-tier automated testing, and independent quality auditing.

### 1.2 Scope of the System
The system delivers:
- Autonomous web scraping of Catholic daily Mass readings from the USCCB Spanish Lectionary (`https://bible.usccb.org/es/bible/lecturas/`) with anti-bot challenge solving (Obolus PoW).
- Standalone packaging, Calendar Versioning (`2026.09.0`), and public GitHub repository publication via GitHub CLI (`gh`).
- Speech-to-liturgy transcript ingestion from YouTube Mass recordings (video ID `EkoysbFU47c`), segmenting dialogues into 10 canonical Roman Rite steps.
- Dialogue curation aligning celebrant prompts with bilingual assembly responses from `rejoiceinfaith.org`.
- Chat-style visual presentation where priest sayings align to the right (`.duet-right`) and assembly responses align to the left (`.duet-left`).
- Dynamic backend route `/api/mass-readings` orchestrating English (`catholic-mass-readings`) and Spanish (`spanish-mass-readings`) queries based on `lang` parameters.
- Reusable logic extraction from the proven reference codebase `~/teamwork_projects/guadalupe_mass_interactive`.

### 1.3 Definitions, Acronyms and Abbreviations
- **CalVer**: Calendar Versioning format (`YYYY.MM.MINOR`, e.g., `2026.09.0`).
- **CEM**: *Conferencia del Episcopado Mexicano* (Mexican Episcopal Conference).
- **Cheerio**: Fast, flexible, and lean implementation of core jQuery designed for the server.
- **GIRM / IGMR**: *General Instruction of the Roman Missal* / *Instrucción General del Misal Romano*.
- **Obolus**: Cryptographic proof-of-work (PoW) challenge firewall protecting USCCB web endpoints.
- **RTM**: Requirements Traceability Matrix.
- **SSOT**: Single Source of Truth.
- **USCCB**: United States Conference of Catholic Bishops.

---

## 2. Overall Description

### 2.1 Product Perspective & Operating Environment
The system operates across three interoperable runtime environments:
1. **Node.js CLI & Library Runtime (Subproject 1)**: Executes in Node.js $\ge 20.0.0$ environments (CLI terminal or as an imported ESM package).
2. **Data-Mining & Curation Runtime (Subproject 2)**: Executes locally via Node.js scripts processing JSON streams and emitting curated liturgical catalogs.
3. **Serverless Edge & Client Hydration Runtime (Host App)**: Executes within Next.js 15 App Router running on Vercel infrastructure, hydrated in modern mobile and desktop browsers (iOS Safari, Chrome, Firefox, Edge).

### 2.2 User Classes and Characteristics
- **Open Source Consumers**: Developers incorporating Spanish Catholic lectionary data into apps. They require a zero-config CLI and standard ESM exports.
- **Parishioners & Assembly Users**: Congregants participating in daily Mass on smartphones. They require immediate loading, zero clipping or layout shifts, and intuitive visual speaker separation.
- **Lectors & Cantors**: Ministers proclaiming the First Reading, Psalm, and Second Reading. They require untruncated citations, full antiphon responses, and complete verses.
- **Presiders (Priests & Deacons)**: Celebrants leading liturgical rites. They require complete dialogues with canonical fidelity.

### 2.3 Operating Constraints
- **Zero Global Host Pollution**: All toolchains and dependencies must reside strictly inside `./node_modules` or local project folders. Global installations (`npm install -g`, `brew`) are strictly prohibited.
- **Strict TypeScript Compliance**: All code must compile cleanly under TypeScript 5.7+ with `strict: true`, zero diagnostic errors, and zero `any` evasions.
- **Network Resilience**: Upstream USCCB endpoints may fail, throttle, or present cryptographic challenges. The scraper must handle network timeouts ($< 8\text{s}$) with graceful fallback degradation.

---

## 3. Specific Functional Requirements

### 3.1 Subproject 1: Open Source Spanish Liturgy Scraper (`REQ-FUN-SCR`)

#### `REQ-FUN-SCR-01`: USCCB Spanish Endpoint & Date Resolution
- **Description**: The scraper shall accept an ISO date (`YYYY-MM-DD`) or a JavaScript `Date` object and format it into the USCCB URL date format `MMDDYY`. It shall target the base URL `https://bible.usccb.org/es/bible/lecturas/{MMDDYY}.cfm` and support liturgical variants (`-Day.cfm`, `-Dawn.cfm`, `-Night.cfm`).
- **BDD Scenario**:
  ```gherkin
  Scenario: Resolve target Spanish USCCB URL for a given date
    Given a target date of "2026-09-10"
    When the USCCBSpanish client builds the request URL
    Then the generated URL must be "https://bible.usccb.org/es/bible/lecturas/091026.cfm"
  ```

#### `REQ-FUN-SCR-02`: Plain-Text Citation Parsing for Unlinked `.address`
- **Description**: The HTML parser shall inspect `.address` elements inside `.container`. If no child anchor (`<a>`) tags exist (standard in Spanish USCCB pages), the parser must extract the raw text (e.g. `"1 Corintios 8, 1-13"`), trim whitespace, parse the book name, and construct a valid `Verse` and `Reading` object without throwing `USCCBParseError`.
- **BDD Scenario**:
  ```gherkin
  Scenario: Parse unlinked Spanish citation container
    Given a Cheerio DOM containing '<div class="address">1 Corintios 8, 1-13</div>' with 0 anchor tags
    When the Spanish parser extracts verses from the address container
    Then it must return an array of 1 Verse object
    And the verse text must equal "1 Corintios 8, 1-13"
    And the parsed book name must equal "1 Corintios"
  ```

#### `REQ-FUN-SCR-03`: Spanish Section Header Classification
- **Description**: The parser shall classify liturgical sections by matching Spanish header strings:
  - `"Primera lectura"`, `"Segunda lectura"`, `"Lectura"` $\rightarrow$ `SectionType.READING`
  - `"Salmo Responsorial"`, `"Salmo"` $\rightarrow$ `SectionType.PSALM`
  - `"Aclamación antes del Evangelio"`, `"Aleluya"` $\rightarrow$ `SectionType.ALLELUIA`
  - `"Evangelio"` $\rightarrow$ `SectionType.GOSPEL`
  - `"Secuencia"` $\rightarrow$ `SectionType.SEQUENCE`
  - `"O bien"` $\rightarrow$ `SectionType.ALTERNATIVE`
- **BDD Scenario**:
  ```gherkin
  Scenario: Classify Spanish lectionary headers into standard section enums
    Given the following header strings:
      | Header Text                       | Expected Enum         |
      | "Primera lectura"                 | SectionType.READING   |
      | "Salmo Responsorial"              | SectionType.PSALM     |
      | "Aclamación antes del Evangelio"  | SectionType.ALLELUIA  |
      | "Evangelio"                       | SectionType.GOSPEL    |
    When sectionTypeFromHeaderEs is invoked on each header
    Then the resulting section type must match the expected enum
  ```

#### `REQ-FUN-SCR-04`: Obolus Bot-Challenge Proof-of-Work Solver
- **Description**: The HTTP client shall detect the USCCB Obolus bot challenge (HTTP 200 containing `<title>Checking connection</title>` or cookie `X_Obolus_Grace`). It shall compute the required proof-of-work hash in $\le 1.5$ seconds and re-issue the HTTP request with cookie `X_Obolus_Proof`, retrieving the actual lectionary HTML.
- **BDD Scenario**:
  ```gherkin
  Scenario: Transparently solve USCCB Obolus challenge
    Given an HTTP client targeting "https://bible.usccb.org/es/bible/lecturas/091026.cfm"
    When the upstream server responds with an Obolus challenge challenge payload
    Then the client must compute the cryptographic proof
    And successfully retrieve the parsed lectionary HTML without surfacing an HTTP error
  ```

#### `REQ-FUN-SCR-05`: Command-Line Interface (CLI)
- **Description**: The package shall provide an executable CLI binary (`bin/spanish-mass-readings`) supporting commands:
  - `get-mass --date <YYYY-MM-DD>`: Prints serialized JSON to stdout.
  - `--citations-only`: Prints only reading headings and verse citations.
  - `--save <path>`: Writes the serialized JSON payload to the specified disk path.
- **BDD Scenario**:
  ```gherkin
  Scenario: Execute CLI to output Spanish readings
    Given the CLI command "spanish-mass-readings get-mass --date 2026-09-10"
    When executed in a shell
    Then the process must exit with code 0
    And stdout must contain valid JSON conforming to the SerializedMass schema
    And the title must contain "XXIII semana del Tiempo ordinario"
  ```

#### `REQ-FUN-SCR-06`: Standalone Git Repository, GitHub CLI Publication & CalVer
- **Description**: Subproject 1 shall be initialized as its own independent Git repository located at `subprojects/spanish-mass-readings`. Using the GitHub CLI (`gh`), a public repository `riosisraelg/spanish-mass-readings` shall be created and pushed. The release shall be tagged with Calendar Versioning (CalVer) `2026.09.0`.
- **BDD Scenario**:
  ```gherkin
  Scenario: Verify Git initialization, remote origin and CalVer tag
    Given the subproject directory "subprojects/spanish-mass-readings"
    When inspecting git metadata
    Then "git status" must confirm an initialized git repository on branch "main"
    And "git remote get-url origin" must contain "github.com/riosisraelg/spanish-mass-readings"
    And "git tag -l" must contain the tag "2026.09.0"
  ```

---

### 3.2 Subproject 2: Mass Transcript Mining & Curation Tool (`REQ-FUN-MIN`)

#### `REQ-FUN-MIN-01`: YouTube Auto-Transcript Ingestion & Cleaning
- **Description**: The mining engine shall ingest timestamped subtitle segments from YouTube video `EkoysbFU47c` (schema: `{ start, end, startSeconds, endSeconds, text }`). It shall filter automated non-speech tags (such as `[Música]`), strip repetitive vocal pauses, and normalize whitespace.
- **BDD Scenario**:
  ```gherkin
  Scenario: Clean and ingest YouTube video transcript
    Given a raw transcript cue with text "[Música] El Señor esté con ustedes [Aplausos]"
    When the transcript ingestion cleaner processes the cue
    Then the sanitized text must equal "El Señor esté con ustedes"
  ```

#### `REQ-FUN-MIN-02`: 10 Canonical Roman Rite Step Segmentation
- **Description**: The segmenter shall categorize the transcript cues into the 10 canonical Roman Rite steps:
  1. `sec-1-rito-inicial`
  2. `sec-2-acto-penitencial`
  3. `sec-3-gloria`
  4. `sec-4-oracion-colecta`
  5. `sec-5-liturgia-palabra`
  6. `sec-6-homilia`
  7. `sec-7-oracion-universal`
  8. `sec-8-liturgia-eucaristica`
  9. `sec-9-rito-comunion`
  10. `sec-10-rito-conclusion`
- **BDD Scenario**:
  ```gherkin
  Scenario: Segment transcript into 10 canonical steps
    Given the raw Basílica de Guadalupe Mass transcript for September 10, 2026
    When the segmentation algorithm executes
    Then exactly 10 liturgical steps must be identified
    And each step must contain an array of ordered turns with valid start and end timestamps
  ```

#### `REQ-FUN-MIN-03`: Dialogue Pairing with RejoiceInFaith Assembly Responses
- **Description**: The curation tool shall pair celebrant prompt utterances with the 18 standard Roman Missal assembly responses extracted from `rejoiceinfaith.org` (e.g. `GREETING`, `PENITENTIAL_ACT`, `PREFACE_DIALOGUE_GREETING`, `MEMORIAL_ACCLAMATION`).
- **BDD Scenario**:
  ```gherkin
  Scenario: Pair celebrant prompt with canonical assembly response
    Given a celebrant cue containing "El Señor esté con ustedes"
    When matched against the canonical dialogue catalog
    Then it must be paired with the assembly response "Y con tu espíritu" (Spanish) and "And with your spirit" (English)
    And the dialogue key must be "GREETING"
  ```

#### `REQ-FUN-MIN-04`: Chat-Style Alignment Formatting (Priest Right vs Public Left)
- **Description**: The curation output data structure shall explicitly enforce chat alignment metadata:
  - Celebrant / Priest sayings: `speaker: "priest"`, `isLeft: false` (maps to `.duet-right`).
  - Assembly / Public responses: `speaker: "assembly"`, `isLeft: true` (maps to `.duet-left`).
- **BDD Scenario**:
  ```gherkin
  Scenario: Enforce chat alignment attributes
    Given a dialogue turn for the celebrant saying "Oremos"
    And a dialogue turn for the assembly saying "Amén"
    When the chat formatter processes both turns
    Then the celebrant turn must have isLeft set to false
    And the assembly turn must have isLeft set to true
  ```

#### `REQ-FUN-MIN-05`: Liturgical Catalog Archival Pipeline
- **Description**: The tool shall compile the segmented and aligned dialogues into a verified JSON catalog file `src/data/liturgical_catalog_guadalupe.json` conforming to `SeguirMisaCatalog`.
- **BDD Scenario**:
  ```gherkin
  Scenario: Export structured liturgical catalog
    Given the completed curation of video EkoysbFU47c
    When the catalog exporter writes to disk
    Then the file "src/data/liturgical_catalog_guadalupe.json" must exist
    And validate successfully against the SeguirMisaCatalog TypeScript schema
  ```

---

### 3.3 Host Application Scraper Integration (`REQ-FUN-INT`)

#### `REQ-FUN-INT-01`: Bilingual Route Handler Delegation
- **Description**: `src/app/api/mass-readings/route.ts` shall parse the query parameters `date` and `lang`.
  - If `lang=es`: Query `USCCBSpanish` from `subprojects/spanish-mass-readings`.
  - If `lang=en`: Query `USCCB` from `catholic-mass-readings`.
  - If `lang=both` or `bilingual`: Execute both concurrently via `Promise.all` and return merged readings.
  - Map results to `MassReadingsResponse`.
- **BDD Scenario**:
  ```gherkin
  Scenario: Fetch Spanish readings via API route
    Given a GET request to "/api/mass-readings?lang=es&date=2026-09-10"
    When the route handler executes
    Then the response status must be 200
    And the JSON response must have language equal to "es"
    And source equal to "spanish-mass-readings"
    And the firstReading citation must equal "1 Corintios 8, 1-13"
  ```

#### `REQ-FUN-INT-02`: Fallback Graceful Degradation
- **Description**: If upstream USCCB queries exceed 8 seconds or encounter network failure, the route shall return HTTP 200 with static cached Spanish lectionary readings, setting `isFallback: true` and `source: 'fallback'`.
- **BDD Scenario**:
  ```gherkin
  Scenario: Graceful degradation upon network failure
    Given a simulated network disconnection from bible.usccb.org
    When a GET request is made to "/api/mass-readings?lang=es"
    Then the route must return HTTP 200 within 8.5 seconds
    And the response must contain isFallback equal to true
    And firstReading, psalm, and gospel must be populated
  ```

#### `REQ-FUN-INT-03`: UI Consumer Dynamic Language Switch
- **Description**: In `LandingClient.tsx`, switching `guiaLang` between `'es'` and `'en'` shall immediately re-fetch the readings from `/api/mass-readings?lang=` and re-render the First Reading, Psalm, Alleluia, and Gospel without throwing React runtime errors or hydration mismatches.
- **BDD Scenario**:
  ```gherkin
  Scenario: Switch language in UI
    Given the user is viewing the Mass Guide modal
    When the user toggles the language switch from "ES" to "EN"
    Then the UI must fetch "/api/mass-readings?lang=en"
    And replace Spanish readings with English readings dynamically
  ```

#### `REQ-FUN-INT-04`: Interactive "Seguir Misa" Chat-Style Alignment Rendering
- **Description**: In `AppleMusicLyrics.tsx`, dialogue lines shall be rendered according to the `isLeft` property: lines with `isLeft: false` shall apply `.lyric-line.duet-right` (right aligned, celebrant), and lines with `isLeft: true` shall apply `.lyric-line.duet-left` (left aligned, assembly).
- **BDD Scenario**:
  ```gherkin
  Scenario: Render chat lines with correct alignment classes
    Given an active "Seguir Misa" session
    When the component renders a celebrant line
    Then the DOM element must contain the CSS class "duet-right"
    When the component renders an assembly line
    Then the DOM element must contain the CSS class "duet-left"
  ```

---

### 3.4 Codebase Extraction & Separation (`REQ-FUN-EXT`)

#### `REQ-FUN-EXT-01`: Proven Spanish Logic Reusability
- **Description**: Subproject 1 and Subproject 2 shall extract and reuse the proven algorithms from `~/teamwork_projects/guadalupe_mass_interactive` (including `readings-adapter.ts`, `seguir-misa-engine.ts`, and test fixtures) rather than re-implementing scraping and dialogue parsing from scratch.
- **BDD Scenario**:
  ```gherkin
  Scenario: Verify codebase extraction provenance
    Given the source files in "~/teamwork_projects/guadalupe_mass_interactive"
    When comparing extracted adapter logic in "subprojects/spanish-mass-readings"
    Then the extraction review script must confirm algorithmic equivalence
  ```

---

## 4. External Interface Specifications

### 4.1 USCCB Spanish HTTP/Cheerio Interface
- **Endpoint**: `https://bible.usccb.org/es/bible/lecturas/{MMDDYY}.cfm`
- **Method**: `GET`
- **Headers**:
  - `User-Agent`: Modern browser impersonation string
  - `Accept`: `text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8`
  - `Accept-Language`: `es-ES,es;q=0.9,en;q=0.8`
  - `Cookie`: `X_Obolus_Proof={hash}` (when challenge active)
- **DOM Parsing Target**:
  - Main containers: `.container`
  - Section title: `.name` (e.g. "Primera lectura")
  - Address: `.address` (plain text, e.g. "1 Corintios 8, 1-13")
  - Content: `.content-body`

### 4.2 Next.js Route Handler Contract (`/api/mass-readings`)
- **URL**: `/api/mass-readings`
- **Method**: `GET`
- **Query Parameters**:
  - `date` (optional): `YYYY-MM-DD` or `YYYYMMDD` (defaults to today in `America/Mexico_City`).
  - `lang` (optional): `'es'` | `'en'` | `'both'` | `'bilingual'` (defaults to `'es'`).
- **Response Format**: `application/json`
- **Response Status Codes**:
  - `200 OK`: Readings retrieved successfully (either live or fallback).
  - `400 Bad Request`: Malformed date format.
  - `500 Internal Server Error`: Critical unhandled server fault.

### 4.3 GitHub CLI Interface
- **Tool**: `gh` (version $\ge 2.98.0$)
- **Authentication**: `gh auth status` must confirm active login for user `riosisraelg` with `repo` and `workflow` scopes.
- **Repository Creation Command**:
  ```bash
  gh repo create spanish-mass-readings --public --source=. --remote=origin --push
  ```

---

## 5. Non-Functional Requirements (ISO/IEC 25010)

### 5.1 Performance Efficiency (`REQ-NFR-PERF`)
- **`REQ-NFR-PERF-01`**: The Obolus PoW challenge solver shall complete cryptographic hash verification in under $1,500\text{ms}$ on standard x86/ARM hardware.
- **`REQ-NFR-PERF-02`**: The `/api/mass-readings` route handler shall respond within $400\text{ms}$ on cached requests and within $3,000\text{ms}$ on cold live scraping requests.

### 5.2 Reliability & Fault Tolerance (`REQ-NFR-REL`)
- **`REQ-NFR-REL-01`**: Under complete network severance from `bible.usccb.org`, `/api/mass-readings` shall return HTTP 200 with `isFallback: true` and populated reading fields within $8.5\text{seconds}$.
- **`REQ-NFR-REL-02`**: Subproject 1 CLI shall exit with code 1 and a descriptive stderr message if an invalid date format is supplied, never throwing unhandled stack traces.

### 5.3 Usability & Ergonomics (`REQ-NFR-USA`)
- **`REQ-NFR-USA-01`**: The "Seguir Misa" interactive modal shall display celebrant lines in `.duet-right` (font-size 2.2rem) and assembly lines in `.duet-left` (font-size 1.3rem) with contrast ratio $\ge 4.5:1$ conforming to WCAG 2.1 AA.
- **`REQ-NFR-USA-02`**: Modal dialogs shall utilize `100dvh` viewport height bounds with body scroll locking to ensure zero vertical clipping or top-edge data loss on mobile devices.

### 5.4 Modularity & Maintainability (`REQ-NFR-MNT`)
- **`REQ-NFR-MNT-01`**: Subproject 1 shall have zero dependencies on Next.js or React, maintaining standalone portability.
- **`REQ-NFR-MNT-02`**: Calendar Versioning `YYYY.MM.MINOR` shall be strictly synchronized between `package.json` and Git release tags.

### 5.5 Security (`REQ-NFR-SEC`)
- **`REQ-NFR-SEC-01`**: Input date parameters shall be strictly sanitized using regular expressions (`/^\d{4}-?\d{2}-?\d{2}$/`) to prevent Server-Side Request Forgery (SSRF) or path traversal attacks against upstream endpoints.

---

## 6. Requirements Traceability Matrix (RTM)

| Requirement ID | Description | Architecture Component | Test Case Verification ID |
|---|---|---|---|
| `REQ-FUN-SCR-01` | Spanish Endpoint & Date Resolution | `subprojects/spanish-mass-readings/src/usccb-spanish.ts` | `UT-SCR-01` (parser.test.ts) |
| `REQ-FUN-SCR-02` | Plain-Text Citation Parsing | `subprojects/spanish-mass-readings/src/usccb-spanish.ts` | `UT-SCR-02` (parser.test.ts) |
| `REQ-FUN-SCR-03` | Spanish Header Classification | `subprojects/spanish-mass-readings/src/usccb-spanish.ts` | `UT-SCR-03` (parser.test.ts) |
| `REQ-FUN-SCR-04` | Obolus PoW Challenge Solver | `subprojects/spanish-mass-readings/src/obolus.ts` | `UT-SCR-04` (obolus.test.ts) |
| `REQ-FUN-SCR-05` | Standalone CLI Binary | `subprojects/spanish-mass-readings/bin/cli.ts` | `UT-SCR-05` (cli.test.ts) |
| `REQ-FUN-SCR-06` | Git Repo, `gh` CLI & CalVer | `subprojects/spanish-mass-readings/` | `ST-SCR-01` (verify-subproject-1.sh) |
| `REQ-FUN-MIN-01` | YouTube Auto-Transcript Ingestion | `subprojects/mass-transcript-miner/src/ingest.ts` | `UT-MIN-01` (ingest.test.ts) |
| `REQ-FUN-MIN-02` | 10 Roman Rite Step Segmentation | `subprojects/mass-transcript-miner/src/segmenter.ts` | `UT-MIN-02` (segmenter.test.ts) |
| `REQ-FUN-MIN-03` | Dialogue Pairing with RejoiceInFaith | `subprojects/mass-transcript-miner/src/dialogue-matcher.ts` | `UT-MIN-03` (dialogue.test.ts) |
| `REQ-FUN-MIN-04` | Chat Alignment (Right/Left) | `subprojects/mass-transcript-miner/src/chat-formatter.ts` | `UT-MIN-04` (chat.test.ts) |
| `REQ-FUN-MIN-05` | Liturgical Catalog Archival | `subprojects/mass-transcript-miner/src/index.ts` | `UT-MIN-05` (catalog.test.ts) |
| `REQ-FUN-INT-01` | Bilingual Route Handler Delegation | `src/app/api/mass-readings/route.ts` | `IT-INT-01` (test-e2e.mjs) |
| `REQ-FUN-INT-02` | Fallback Graceful Degradation | `src/app/api/mass-readings/route.ts` | `IT-INT-02` (test-e2e.mjs) |
| `REQ-FUN-INT-03` | UI Dynamic Language Switch | `src/app/LandingClient.tsx` | `IT-INT-03` (test-e2e.mjs) |
| `REQ-FUN-INT-04` | Interactive "Seguir Misa" Alignment | `src/app/AppleMusicLyrics.tsx`, `src/app/global.css` | `IT-INT-04` (test-e2e.mjs) |
| `REQ-FUN-EXT-01` | Codebase Extraction & Provenance | `subprojects/` | `ST-EXT-01` (extraction-audit.sh) |

---
*End of ISO/IEC/IEEE 29148:2018 Software Requirements Specification.*
