# ISO/IEC/IEEE 29148:2018 Software Requirements Specification (SRS)

**System Name**: La Pandilla de Jesús — Querétaro Web Platform  
**Standard**: ISO/IEC/IEEE 29148:2018 (Systems and software engineering — Life cycle processes — Requirements engineering)  
**Document Version**: 1.1.0  
**Date**: 2026-08-28  
**Status**: Approved & Authoritative  

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) establishes the complete, rigorous, and verifiable functional and non-functional requirements for the **La Pandilla de Jesús** web application (`lapandilladejesusqro.org`). It provides the single source of truth for engineering development, autonomous subagent collaboration, automated multi-tier opaque-box testing, quality assurance verification, and stakeholder acceptance.

### 1.2 Scope of the System
The platform is a progressive web application serving the Catholic youth community and parish of La Sagrada Familia in Querétaro, México. The system encompasses:
1. Daily Catholic Food Prayers deck (Domingo a Sábado, Antes y Después de las comidas) transcribed from the Roman *Bendicional*.
2. Interactive 3D deck carousel with auto-day selection, infinite continuous swiping, and dynamic brand color tone generation.
3. Complete Rosary overhaul featuring a 5-element mystery sequence, untruncated text, collapsible nested repeated prayers, dedicated sub-decks, and top-bar vibrating bead counter.
4. **Mass Guide & Liturgical Readings Scraper Subsystem (RF-08)**: Complete Roman Missal ordinary dialogues, priest private Communion prayers, Mexican sung liturgical hymns, automated edge scraper for daily Mass readings (`/api/mass-readings`), sequential canonical injection into the Liturgy of the Word (GIRM sequence), kinetic interactive streaming mode (`AppleMusicLyrics`), and direct access launchers with client mount pre-fetching.
5. Annual Jesus calendar integrating *Misas de Precepto* (Holy Days of Obligation per Canon 1246 and Mexican Episcopal Conference CEM), dynamic 1200x630px Open Graph social preview generation, deep-linked event modals, and universal multi-platform calendar export (.ics, Google, Apple, Outlook Web, Outlook Desktop, Yahoo).
6. Global usability enhancements including standardized 450ms long-press tooltips with haptic feedback.

### 1.3 Definitions, Acronyms and Abbreviations
- **CEM**: *Conferencia del Episcopado Mexicano* (Mexican Episcopal Conference).
- **Canon 1246**: Universal canon in the Code of Canon Law establishing Sundays and feast days of precept (Holy Days of Obligation).
- **Computus**: Mathematical algorithm calculating the astronomical date of Easter Sunday and dependent movable liturgical feasts.
- **GIRM / IGMR**: *General Instruction of the Roman Missal* / *Instrucción General del Misal Romano*.
- **Misal Romano 3ª Edición**: Official liturgical book for the celebration of Mass according to the Roman Rite.
- **Deck**: A card-stack user interface element rendered in 3D perspective with physical gesture navigation.
- **OG**: Open Graph protocol for generating dynamic social media link preview images.
- **RRULE**: Recurrence Rule format conforming to RFC 5545 (iCalendar specification).
- **WCAG**: Web Content Accessibility Guidelines (version 2.1 Level AA).

---

## 2. Overall Description

### 2.1 Product Perspective & Context
The application operates as a high-performance Next.js 15 App Router web system with client hydration on React 19. It interfaces upstream with:
- Google Calendar iCal feed (via `/api/calendar`).
- Evangelizo Daily Liturgical Reading XML API (via `/api/mass-readings`).
- Social Media metadata crawlers (via `/api/og` dynamic image generator).

### 2.2 User Persona Characteristics
1. **Youth Ministry Member / Teen**: Accesses the site via mobile phone during meal times, retreats, and prayer sessions. Demands zero load lag, haptic feedback, and fluid swipe gestures.
2. **Parishioner / Parent / Assembly**: Attends daily or Sunday Mass. Utilizes the Mass Guide to follow liturgical responses and read the Word of God in uninterrupted canonical sequence without clunky dropdown toggles.
3. **Catechist / Liturgical Minister / Lector**: Leads community prayer and reads Mass readings. Demands liturgical exactness, complete antiphon responses with verses, full citations, and doctrinal fidelity.
4. **Priest / Deacon (Celebrant)**: Needs complete dialogues, priest private prayers during Communion, and seasonal Gospel acclamations.

### 2.3 Design and Implementation Constraints
- **Zero Heavy UI Dependencies**: Styling must be authored in monolithic Vanilla CSS (`src/app/global.css`) using CSS Custom Properties without Tailwind, SCSS, or CSS-in-JS runtime overhead.
- **TypeScript Strictness**: TypeScript 5.7 compilation with `strict: true` and zero `any` declarations in production code.
- **Mobile First & Touch Ergonomics**: Minimum touch target size of 44x44 CSS pixels. Prevention of double-scroll jumping on mobile web browsers.

---

## 3. Specific Functional Requirements

### RF-01: Catholic Food Prayers Transcription & Deck Integration
- **ID**: `RF-01`
- **Priority**: High | **Source**: `ORIGINAL_REQUEST.md §R1`
- **Description**: The system shall provide a dedicated "Prayers for Food" deck containing the Catholic daily prayers for meals transcribed from the Roman *Bendicional* (nn. 883-884).
- **Functional Specification**:
  1. The deck shall replace all obsolete food prayers and contain structured entries for all 7 days of the week (Sunday through Saturday).
  2. Each day shall contain:
     - **Antes de las comidas**: Scripture Versicle (V.), Assembly Response (R.), and the "Oremos" Blessing Prayer.
     - **Después de las comidas**: Thanksgiving "Oremos" Prayer.
  3. The introductory liturgical rubric from *Bendicional* nn. 883-884 regarding charity toward the poor shall be included.
  4. Language shall default to Spanish.
- **Acceptance Criteria**:
  - **AC-RF01-1**: Given the food prayers deck is loaded, all 7 days (Domingo to Sábado) are present with exact verbatim text matching the *Bendicional* transcription.
  - **AC-RF01-2**: Given any day of the week, the "Antes de las comidas" section contains both the versicle, response, and prayer.
  - **AC-RF01-3**: Given Sunday through Saturday, the "Después de las comidas" thanksgiving prayer is rendered with complete liturgical doxologies.

---

### RF-02: Auto-Day Selection & Minimalist Deck Viewport
- **ID**: `RF-02`
- **Priority**: High | **Source**: `ORIGINAL_REQUEST.md §R2`
- **Description**: The food deck shall automatically detect the user's current day of the week and open directly to that day's meal prayer, while allowing manual swipe navigation to any other day.
- **Functional Specification**:
  1. Upon opening the Food Prayers deck, the system shall read `new Date().getDay()` (0=Domingo, 1=Lunes, ..., 6=Sábado).
  2. The deck shall initialize with the active card index corresponding to today's day of the week.
  3. The viewport shall feature a clean, minimalist card aesthetic matching the Rosary deck.
- **Acceptance Criteria**:
  - **AC-RF02-1**: Given the system clock is Tuesday, opening the food prayers deck initializes with the "Martes" card selected.
  - **AC-RF02-2**: Manual swipe gestures permit unrestricted navigation to all other days.

---

### RF-03: Minimalist Continuous Infinite Swipe Gesture Loop
- **ID**: `RF-03`
- **Priority**: High | **Source**: `ORIGINAL_REQUEST.md §R3`
- **Description**: The 3D deck carousel shall implement smooth, continuous infinite circular navigation via circular modulo index calculations.
- **Acceptance Criteria**:
  - **AC-RF03-1**: Swiping left on the last card loops seamlessly to the first card index.
  - **AC-RF03-2**: Swiping right on the first card loops seamlessly to the last card index.

---

### RF-04: Dynamic Brand Color Tone Generator
- **ID**: `RF-04`
- **Priority**: Medium | **Source**: `ORIGINAL_REQUEST.md §R4`
- **Description**: The deck component shall dynamically compute brand color tone variations (lightness/chroma) based on card index while maintaining WCAG 2.1 AA text contrast.
- **Acceptance Criteria**:
  - **AC-RF04-1**: Each card index generates a distinct tone variant within brand guidelines.
  - **AC-RF04-2**: Contrast ratio between card text and calculated background is $\ge 4.5:1$.

---

### RF-05: Global Long-Press Tooltips with Haptic Feedback
- **ID**: `RF-05`
- **Priority**: High | **Source**: `ORIGINAL_REQUEST.md §R5`
- **Description**: All interactive action and navigation buttons shall declare descriptive tooltips accessible via a 450ms long-press touch gesture with haptic vibration.
- **Acceptance Criteria**:
  - **AC-RF05-1**: Holding touch for 450ms triggers `navigator.vibrate` and displays the tooltip popover.
  - **AC-RF05-2**: Scrolling or lifting touch before 450ms cancels tooltip display.

---

### RF-06: Event OG Image Generator & Shareable Deep-Linked Modals
- **ID**: `RF-06`
- **Priority**: High | **Source**: `ORIGINAL_REQUEST.md §R6`
- **Description**: The system shall generate dynamic 1200x630px Open Graph banner images via `/api/og` and provide shareable deep-linked URLs that immediately open event modals.
- **Acceptance Criteria**:
  - **AC-RF06-1**: Requesting `/api/og?title=...&date=...&category=...` returns a valid 1200x630 PNG image.
  - **AC-RF06-2**: Visiting `/calendario?evento=[id]` opens the corresponding event modal immediately on page load.

---

### RF-07: Rosary UI Overhaul, 5-Element Mystery Sequence & Top-Bar Vibrating Counter
- **ID**: `RF-07`
- **Priority**: High | **Source**: `ORIGINAL_REQUEST.md §R7`
- **Description**: The Rosary interface shall feature complete 5-element mystery sequences, untruncated text, collapsible repeated prayers, dedicated sub-decks, and a top-bar vibrating bead counter.
- **Acceptance Criteria**:
  - **AC-RF07-1**: Every mystery across all 4 Rosary types renders all 5 required elements (Artwork, Citation, Scripture, Meditation, Reflection Question).
  - **AC-RF07-2**: The decade bead counter is rendered in the top header, increments on tap, and invokes `navigator.vibrate`.
  - **AC-RF07-3**: Repeated prayers inside mystery cards expand and collapse on tap.

---

### RF-08: Mass Guide & Liturgical Readings Scraper Subsystem (Master Requirement)
- **ID**: `RF-08`
- **Priority**: Critical | **Source**: `ORIGINAL_REQUEST.md §R1, §R2, §R3`
- **Description**: The Mass Guide shall provide a complete, canonical, and seamless liturgical experience according to the *Misal Romano (3ª Edición Típica)* and *Instrucción General del Misal Romano* (IGMR). The system shall overhaul the daily liturgical readings scraper API, eliminate the detached readings accordion, dynamically inject the readings sequentially into the "Liturgia de la Palabra" ordinary flow and kinetic stream reader, and provide direct one-touch launch with proactive background pre-fetching.
- **Sub-Requirements**: Decomposed into `RF-08.1`, `RF-08.2`, and `RF-08.3`.

---

#### RF-08.1: Daily Mass Readings Scraper API Engine
- **ID**: `RF-08.1`
- **Priority**: Critical | **Source**: `ORIGINAL_REQUEST.md §R1`
- **Description**: The edge route handler at `src/app/api/mass-readings/route.ts` shall fetch, parse, and structure the complete text of the Catholic daily liturgy.
- **Functional Specification**:
  1. **Upstream Feed Query**:
     - Query `http://feed.evangelizo.org/v2/reader.php?date=${dateParam}&lang=${langParam}&type=xml`.
     - `dateParam` shall support normalized `YYYYMMDD` and `YYYY-MM-DD` formats; defaults to current date in `America/Mexico_City` timezone.
     - `langParam` shall default to `SP` (Spanish).
  2. **Comprehensive Tag & Content Extraction**:
     - `liturgicalDay`: Full liturgical title from `<litugic_t>` (e.g., *"XXII Domingo del Tiempo Ordinario"*).
     - `saint`: Daily saint commemoration from `<saint>` (e.g., *"San Agustín de Hipona"*).
     - `firstReading`: Full citation (`<reading_text1_lt>`), short citation (`<reading_text1_st>`), and full text (`<reading_text1>`).
     - `psalm`: Full citation (`<reading_text2_lt>`), short citation (`<reading_text2_st>`), antiphon response phrase (`response`), and complete verses formatted with recurring `R.` indicators (`text` / `stanzas`). The extraction shall not truncate verse 1 or confuse it with the antiphon.
     - `secondReading`: Full citation (`<reading_text3_lt>`), short citation (`<reading_text3_st>`), and full text (`<reading_text3>`). Handled conditionally: populated on Sundays and Solemnities; omitted (`undefined`) on ferial weekdays when `<reading_text3>` is empty.
     - `alleluia`: Canonical Gospel Acclamation object containing `acclamation` (e.g., `"¡Aleluya, aleluya!"` during Ordinary/Easter time; `"Honor y gloria a ti, Señor Jesús"` during Lent), lectionary verse (`verse`), and citation.
     - `gospel`: Full citation (`<reading_gospel_lt>`), short citation (`<reading_gospel_st>`), and full proclamation text (`<reading_gospel>`).
     - `meditation`: Patristic commentary author (`<comment_a>`), title (`<comment_t>`), and body text (`<comment>`).
  3. **Data Sanitization & CDATA Extraction**:
     - Safely extract content enclosed in `<![CDATA[ ... ]]>`.
     - Decode all XML and HTML entities (including accented vowels `&aacute;`, `&eacute;`, `&iacute;`, `&oacute;`, `&uacute;`, `&ntilde;`, `&laquo;`, `&raquo;`, `&#39;`, `&quot;`, `&amp;`).
     - Strip unwanted HTML markup while preserving paragraph line breaks (`\n\n`).
  4. **Timeout, Caching & Zero-Downtime Fallback**:
     - Fetch queries shall enforce `signal: AbortSignal.timeout(6000)` (6 seconds).
     - Success responses shall return HTTP status 200 with headers `Cache-Control: public, s-maxage=86400, stale-while-revalidate=43200` and Next.js revalidation (`revalidate: 86400`).
     - On upstream failure, network timeout, malformed XML, or out-of-range dates, the endpoint shall catch errors and return the bundled canonical `FALLBACK_READINGS` with HTTP status 200, `isFallback: true`, and `Cache-Control: public, s-maxage=300, stale-while-revalidate=3600`.

---

#### RF-08.2: Canonical Sequential UI Injection & Accordion Removal
- **ID**: `RF-08.2`
- **Priority**: Critical | **Source**: `ORIGINAL_REQUEST.md §R2`
- **Description**: The Mass Guide UI in `src/app/LandingClient.tsx` and `src/app/massResponses.ts` shall eliminate the detached readings accordion and dynamically inject the live readings directly into the canonical flow of Section 2 ("Liturgia de la Palabra") according to the General Instruction of the Roman Missal (GIRM).
- **Functional Specification**:
  1. **Accordion Removal**:
     - The legacy collapsible accordion button `showLecturasInResponses` and its associated dropdown container in Tab 2 (`activeGuiaTab === 'respuestas'`) shall be completely removed from the DOM hierarchy.
  2. **Canonical Sequential Injection Flow**:
     - Inside Section 2 ("Liturgia de la Palabra"), the static placeholder lines shall be dynamically replaced with the live structured readings in exact liturgical sequence:
       1. **Primera Lectura** (Sentados):
          - Rubric: *"Sentados"*
          - Title: *"Primera Lectura — [dailyReadings.firstReading.citation]"*
          - Speaker: *"Lector"*
          - Text: Full reading body paragraphs.
          - Proclamation Dialogue: Lector: *"Palabra de Dios."* | Pueblo: *"Te alabamos, Señor."*
       2. **Salmo Responsorial** (Sentados):
          - Rubric: *"Sentados"*
          - Title: *"Salmo Responsorial — [dailyReadings.psalm.citation]"*
          - Antiphon Box: Display highlighted response `"R. [dailyReadings.psalm.response]"`.
          - Stanzas: Complete psalm stanzas rendered with repeated assembly response `"R. [dailyReadings.psalm.response]"` after each stanza.
       3. **Segunda Lectura** (Sentados) [Conditional Rendering]:
          - Condition: Rendered ONLY when `dailyReadings.secondReading` exists and contains text (Sundays & Solemnities). Gracefully omitted on ferial weekdays with zero empty headers or gaps.
          - Rubric: *"Sentados"*
          - Title: *"Segunda Lectura — [dailyReadings.secondReading.citation]"*
          - Speaker: *"Lector"*
          - Text: Full epistle body paragraphs.
          - Proclamation Dialogue: Lector: *"Palabra de Dios."* | Pueblo: *"Te alabamos, Señor."*
       4. **Aclamación antes del Evangelio (Aleluya)** (De pie):
          - Rubric: *"De pie"*
          - Title: *"Aclamación antes del Evangelio"*
          - Speaker: *"Todos"*
          - Text: Acclamation formula (`"¡Aleluya, aleluya!"` or Lenten verse) followed by the lectionary verse (`dailyReadings.alleluia.verse`).
       5. **Proclamación del Santo Evangelio** (De pie):
          - Rubric: *"De pie"*
          - Title: *"Santo Evangelio — [dailyReadings.gospel.citation]"*
          - Introductory Dialogue:
            * Sacerdote: *"El Señor esté con ustedes."* | Pueblo: *"Y con tu espíritu."*
            * Sacerdote: *"Lectura del santo Evangelio según [evangelista]."* | Pueblo: *"Gloria a ti, Señor."*
          - Proclamation Text: Full Gospel body paragraphs.
          - Concluding Dialogue:
            * Sacerdote: *"Palabra del Señor."* | Pueblo: *"Gloria a ti, Señor Jesús."*
          - Secret Priest Rubric: *"Sacerdote (en secreto): Las palabras del Evangelio borren nuestros pecados."*
       6. **Homilía, Credo, y Oración Universal**:
          - Standard Roman Missal ordinary flow continues seamlessly.
  3. **Interactive Mode (`AppleMusicLyrics`) Stream Generator**:
     - The helper function `getCanonicalMassLines(sectionIdx, dailyReadings, lang)` shall dynamically produce the linear line stream for Section 2, pairing each line with appropriate speaker tags (`Lector`, `Salmista`, `Sacerdote`, `Pueblo`, `Todos`) and left/right kinetic alignments without hydration mismatches.

---

#### RF-08.3: Direct Access Mass Launcher & Proactive Auto-Fetch
- **ID**: `RF-08.3`
- **Priority**: High | **Source**: `ORIGINAL_REQUEST.md §R3`
- **Description**: The main Mass launcher buttons across the site shall open directly to the Mass Guide without intermediate menu friction, and daily readings shall be fetched proactively in the background on initial page mount.
- **Functional Specification**:
  1. **Autonomous Mount Pre-Fetching**:
     - `LandingClient.tsx` shall execute `fetchDailyReadings()` in a `useEffect` hook on client mount.
     - Fetched readings shall be cached in React state (`dailyReadings`), ensuring that readings are 100% pre-loaded and ready before the user opens or navigates to Liturgia de la Palabra.
     - A manual refresh button (`↻ Actualizar`) shall be available to force cache re-fetching.
  2. **Direct Mass Launcher Buttons**:
     - Main Hero CTA button ("Guía de Misa" / "Seguir la Misa") and Mobile Drawer navigation link shall directly open the Mass Guide modal initialized to Section 1 (Ritos Iniciales, `activeMisaSectionIdx = 0`).
  3. **UI Loading & Offline States**:
     - If the user accesses readings while fetching is in progress, a smooth non-blocking indicator shall be displayed.
     - If `dailyReadings.isFallback === true`, an unobtrusive badge `(Liturgia común / modo sin conexión)` shall indicate offline mode without disrupting Mass flow.

---

### RF-08 Acceptance Criteria Matrix

| Criterion ID | Target Feature | Acceptance Verification Condition |
|---|---|---|
| **AC-RF08-1** | Full Text Preservation | `GET /api/mass-readings` returns non-empty full text, short citations, and full citations for First Reading, Psalm, Gospel, and Meditation. |
| **AC-RF08-2** | Responsorial Psalm Integrity | The Psalm object contains both a clean antiphon `response` string and the complete verse stanzas without duplications or truncation of verse 1. |
| **AC-RF08-3** | Sunday vs Weekday 2nd Reading | Querying a Sunday date returns a populated `secondReading` object; querying a weekday ferial date returns `secondReading === undefined` without errors. |
| **AC-RF08-4** | Seasonal Gospel Acclamation | The `alleluia` object provides the seasonal acclamation ("¡Aleluya, aleluya!" during Ordinary/Easter vs Lenten acclamation) and lectionary verse. |
| **AC-RF08-5** | Resilience & Edge Caching | Upstream timeouts or errors return `FALLBACK_READINGS` with status 200, `isFallback: true`, and valid `Cache-Control` headers. |
| **AC-RF08-6** | Accordion Removal | The legacy `showLecturasInResponses` accordion button and dropdown container are completely removed from Tab 2 in `LandingClient.tsx`. |
| **AC-RF08-7** | Sequential Canonical Injection | Navigating to Section 2 ("Liturgia de la Palabra") renders the readings in exact GIRM sequence (1st Reading → Psalm with R. → 2nd Reading [if Sunday] → Aleluya → Gospel) in both standard modal and `AppleMusicLyrics` interactive mode. |
| **AC-RF08-8** | Direct Launch & Auto-Fetch | Clicking the Mass button in Hero/Nav opens the Mass modal directly at Section 1 (Ritos Iniciales), with readings automatically fetched on mount without manual intervention. |

---

### RF-09: Misas de Precepto Calendar Integration & Multi-Platform Export
- **ID**: `RF-09`
- **Priority**: High | **Source**: `ORIGINAL_REQUEST.md §R9`
- **Description**: The system shall compute and integrate all Holy Days of Obligation (*Misas de Precepto* per Canon 1246 and Mexican Episcopal Conference CEM) into the Jesus calendar, providing detailed event modals and universal multi-platform export.
- **Acceptance Criteria**:
  - **AC-RF09-1**: Given any target year, all fixed and movable Misas de Precepto are generated with correct dates and tagged with `isPrecepto: true`.
  - **AC-RF09-2**: Clicking "Agregar a Google Calendar" on any event opens a pre-populated Google Calendar event creation URL.
  - **AC-RF09-3**: Clicking "Descargar archivo iCal (.ics)" initiates a valid RFC 5545 `.ics` file download.

---

### RF-10: Autonomous Execution, Granular Git Commits, Semver Tagging & Remote Deployment
- **ID**: `RF-10`
- **Priority**: High | **Source**: `ORIGINAL_REQUEST.md §R10`
- **Description**: The development workflow shall execute autonomously, creating granular atomic git commits, assigning semantic version tags to each milestone commit, verifying 100% test passing, and pushing all branches/tags to the remote repository.
- **Acceptance Criteria**:
  - **AC-RF10-1**: Git log contains granular, descriptive commits corresponding to each milestone.
  - **AC-RF10-2**: Git repository contains valid annotated/lightweight semantic version tags.
  - **AC-RF10-3**: Final release tag `v1.0.0` is pushed to remote origin.

---

## 4. Non-Functional Requirements (RNF)

| ID | Category | Requirement Specification | Measurement Metric |
|---|---|---|---|
| **RNF-01** | **Performance** | The application shall achieve sub-second initial load on standard 4G mobile networks. | FCP $\le 1.0\text{s}$, LCP $\le 1.8\text{s}$, CLS $= 0.00$. |
| **RNF-02** | **Animation Frame Rate** | 3D card deck dragging and kinetic text streaming shall maintain smooth hardware-accelerated GPU rendering. | 60 FPS consistent with zero dropped frames. |
| **RNF-03** | **Usability** | The interface shall provide single-scroll containment, eliminating double-scroll jump bugs. | Modal container has `overflow: hidden`, inner card has `overflow-y: auto`. |
| **RNF-04** | **Accessibility** | All text, buttons, and dialogs shall comply with WCAG 2.1 Level AA standards. | Text contrast $\ge 4.5:1$, touch targets $\ge 44 \times 44\text{px}$, full keyboard navigation. |
| **RNF-05** | **Internationalization** | All UI copy and prayer texts shall maintain authentic Spanish Catholic liturgical phrasing, with English support for universal dialogues. | 100% translation completeness in bilingual prayer cards. |
| **RNF-06** | **Reliability & Resilience** | The daily Mass readings scraper and Google Calendar integration shall gracefully fall back to local canonical data when offline. | Zero unhandled exceptions; fallback UI rendered seamlessly. |
| **RNF-07** | **Security & Privacy** | Public read-only architecture with zero collection of personally identifiable information (PII). | No cookies, no unauthorized trackers, sanitized external XML inputs. |
| **RNF-08** | **Cross-Platform Support** | Flawless rendering and interaction across iOS Safari (15+), Android Chrome, macOS Safari/Chrome, and Windows Edge. | 100% automated test passing on Chromium, WebKit, and Firefox engines. |

---

## 5. Complete Data Models & Schemas

### 5.1 Food Prayers Data Schema
```typescript
export interface MealPrayer {
  verse?: string;
  response?: string;
  prayer: string;
}

export interface FoodPrayerDay {
  id: string;
  day: 'domingo' | 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado';
  dayName: string;
  before: MealPrayer;
  after?: MealPrayer;
  intro?: {
    title: string;
    citation: string;
    text: string;
  };
}
```

### 5.2 Rosary 5-Element Mystery Schema
```typescript
export interface MysteryItem {
  number: number;
  title: string;
  titleEn: string;
  biblicalRef: string;
  scriptureText: string;
  scriptureTextEn: string;
  meditation: string;
  meditationEn: string;
  reflectionQuestion: string;
  reflectionQuestionEn: string;
  image: string;
}

export interface MysteryInfo {
  type: 'gozosos' | 'dolorosos' | 'gloriosos' | 'luminosos';
  name: string;
  nameEn: string;
  days: string;
  daysEn: string;
  mysteries: MysteryItem[];
}
```

### 5.3 Daily Mass Readings API Schema (`MassReadingsResponse`)
```typescript
export interface MassReadingsResponse {
  date: string; // 'YYYYMMDD' or 'YYYY-MM-DD'
  liturgicalDay: string; // e.g. "Viernes de la 21a semana del Tiempo Ordinario"
  saint?: string; // Saint commemoration
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
    stanzas?: string[];
  };
  secondReading?: {
    citation: string;
    shortCitation?: string;
    text: string;
  };
  alleluia: {
    citation?: string;
    acclamation: string;
    verse: string;
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
  source?: string;
}
```

### 5.4 Calendar & Misas de Precepto Schema
```typescript
export interface ParsedEvent {
  id: string;
  title: string;
  summary?: string;
  description: string;
  date: string; // YYYY-MM-DD
  endDate?: string;
  time: string;
  location: string;
  type: string;
  types: string[];
  isPrecepto?: boolean;
  preceptoRule?: 'CEM_OBLIGATION' | 'UNIVERSAL_CANON_1246' | 'SOLEMNITY';
  shareUrl?: string;
  ogImageUrl?: string;
}
```

---

## 6. Use Case Specifications

### UC-01: Blessing Daily Meals with Auto-Day Food Deck
- **Actor**: Community Member.
- **Precondition**: User opens `lapandilladejesusqro.org` on a smartphone at lunch time.
- **Main Flow**:
  1. User taps "Oraciones" or scrolls to Decks section.
  2. System detects local day of week and displays the corresponding day's card (e.g. "Jueves").
  3. User reads the versicle, leads the group in the response ("Bendito seas por siempre, Señor"), and recites the "Oremos" blessing.
  4. After eating, user views the "Después de las comidas" section on the same card for thanksgiving.
  5. User can swipe horizontally to view upcoming days.
- **Postcondition**: Daily meal prayer completed with authentic liturgical text.

### UC-02: Praying the Holy Rosary with Top-Bar Counter & 5-Element Mysteries
- **Actor**: Youth Group Leader / Catechist.
- **Precondition**: User opens the Rosary modal.
- **Main Flow**:
  1. User selects mystery type (e.g., "Misterios Gozosos") and variant ("mexicana").
  2. System loads dedicated Opening Prayers deck.
  3. User advances to Mystery 1: System displays (1) Mystery illustration, (2) Scripture citation, (3) Direct Scripture text, (4) Meditation, and (5) Reflection question.
  4. User taps the top-bar bead counter button (`📿 0/10`) for each Ave María; device emits a gentle 25ms haptic vibration on each count.
  5. User expands the collapsible repeated prayers list if needed.
  6. Upon completing 5 decades, user advances to the Concluding Prayers deck.
- **Postcondition**: Complete Rosary recited with guided meditation and verified decade counting.

### UC-03: Exporting Misas de Precepto to Personal Calendar
- **Actor**: Parishioner.
- **Precondition**: User is viewing `/calendario`.
- **Main Flow**:
  1. User filters events or browses to "Nuestra Señora de Guadalupe" (12 de Diciembre).
  2. Event card displays prominent "Misa de Precepto Obligatorio" badge.
  3. User taps the event card: Layered event modal opens displaying liturgical description, Mass times, and location.
  4. User taps "Agregar a Google Calendar" or "Descargar archivo iCal (.ics)".
  5. Personal calendar app opens with pre-populated event details.
- **Postcondition**: Holy Day of Obligation successfully synced to the user's personal device calendar.

### UC-04: Participating in Daily and Sunday Mass with Canonical Reading Flow
- **Actor**: Parishioner / Assembly Member.
- **Precondition**: User is attending Mass at La Sagrada Familia and opens `lapandilladejesusqro.org`.
- **Main Flow**:
  1. User taps the standalone "Guía de Misa" button on the hero section.
  2. System opens the modal directly at Section 1 (Ritos Iniciales) while automatically pre-fetching today's daily readings in the background.
  3. User participates in the Introductory Rites (Greeting, Penitential Act, Gloria).
  4. User advances to Section 2 ("Liturgia de la Palabra"):
     - Primera Lectura is seamlessly rendered with full scripture text and dialogue.
     - Salmo Responsorial is rendered with the antiphon response and all verse stanzas.
     - Segunda Lectura is rendered if Sunday, or omitted smoothly if a weekday.
     - Gospel Acclamation (Aleluya) and Holy Gospel are rendered with complete rubrics and dialogues.
  5. User can switch to "AppleMusicLyrics" kinetic full-screen reader for synchronized text following during the homily or liturgy.
  6. User continues through Liturgia Eucarística, Rito de Comunión (with priest private prayers), and Ritos Conclusivos.
- **Postcondition**: Complete Catholic Mass followed in exact canonical order with live daily scriptures and zero UI friction.
