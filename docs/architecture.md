# ISO/IEC/IEEE 42010:2022 System Architecture Description

**System Name**: La Pandilla de Jesús — Querétaro Web Platform  
**System URL**: `https://lapandilladejesusqro.org`  
**Standard**: ISO/IEC/IEEE 42010:2022 (Systems and software engineering — Architecture description)  
**Version**: 1.1.0  
**Date**: 2026-08-28  
**Status**: Approved & Authoritative  

---

## 1. Architecture Identification & Context

### 1.1 Purpose & Scope
This document establishes the formal architectural description for the **La Pandilla de Jesús** web platform (`lapandilladejesusqro.org`), serving the Catholic community and youth ministry in Querétaro, México.

The scope encompasses:
1. **Daily Catholic Food Prayers Deck**: Sunday-Saturday meal blessings (*Antes*) and thanksgivings (*Después*) transcribed from the Roman *Bendicional* (nn. 883-884).
2. **Interactive 3D Carousel & Motion Engine**: Auto-day detection, continuous infinite swipe navigation with circular modulo mechanics, and dynamic HSL color tone generation.
3. **Interactive Guided Rosary Subsystem**: 5-element mystery sequence, untruncated liturgical text, collapsible repeated prayers, dedicated sub-decks, and top-bar vibrating decade counter.
4. **Mass Guide & Liturgical Readings Scraper Subsystem (Subsystem 4 / RF-08)**:
   - Automated Daily Liturgy Scraper API (`/api/mass-readings`) querying Evangelizo XML with edge caching and resilient fallback.
   - Canonical Sequential Injection Pipeline dynamically embedding First Reading, Responsorial Psalm (response + all stanzas), conditional Second Reading, Gospel Acclamation (Alleluia), and Holy Gospel directly into the "Liturgia de la Palabra" section of the Roman Missal.
   - Interactive full-screen kinetic text stream reader (`AppleMusicLyrics`) for synchronized assembly and lector participation.
   - Standalone Direct Access Mass launcher buttons with autonomous background pre-fetching on page mount.
5. **Jesus Calendar & Misas de Precepto Subsystem**: Liturgical Computus engine (Canon 1246 and Mexican Episcopal Conference CEM), dynamic 1200x630px Open Graph social previews (`/api/og`), deep-linked event routing, and multi-platform export (.ics, Google, Apple, Outlook Web, Outlook Desktop, Yahoo).
6. **Global Usability & Ergonomics Subsystem**: 450ms long-press tooltips with haptic feedback.

---

### 1.2 Architectural Stakeholders & Concerns Matrix

| Stakeholder Group | Primary Architectural Concerns | Addressed In Viewpoints |
|---|---|---|
| **Parish Community & Assembly** | Instant offline-capable prayer access, seamless Mass reading participation without awkward page switching or broken accordions, mobile-first touch ergonomics, bilingual dialogues. | Functional View, Usability & UI View, Information View |
| **Catechists & Liturgical Ministers** | Strict doctrinal and liturgical fidelity (*Misal Romano* CEM 3ª Edición Típica, *Instrucción General del Misal Romano* - IGMR, *Bendicional*), exact sequential order of the Liturgy of the Word, complete antiphons, verses, and rubrics. | Functional View, Information View |
| **Priests & Deacons (Celebrants)** | Complete private Communion prayers (Fractio Panis, private preparation, purification), full dialogues (*"El Señor esté con ustedes"*, *"Palabra del Señor"*), correct liturgical seasonal acclamations (Lent vs Ordinary Time). | Functional View, Information View |
| **System Developers & Maintainers** | Strict TypeScript 5.7 typing, Next.js 15 App Router architecture, zero runtime CSS-in-JS overhead (pure Vanilla CSS), zero-dependency test runner, clean separation between edge scraping and UI presentation. | Development View, Concurrency & Execution View |
| **Parish Administrators** | Automated daily Mass readings scraping, automated Google Calendar syncing, dynamic Open Graph banners for social sharing without manual graphic design. | System Context, Physical & Deployment View |
| **Quality Assurance & Verification** | 100% deterministic test pass rate, multi-tier automated test suite (Tiers 1–5 in `scripts/test-e2e.mjs`), reproducible Next.js production builds, compliance with IEEE standards. | Quality Attributes View, Development View |

---

## 2. System Context & External Interfaces

The application functions as a high-performance progressive web application with serverless edge extensions deployed on Vercel Edge infrastructure.

```
+--------------------------------------------------------------------------------------------------+
|                                    EXTERNAL ECOSYSTEM                                            |
|                                                                                                  |
|   +--------------------------+     +----------------------------+     +----------------------+   |
|   |  Google Calendar Feed    |     |   Evangelizo Liturgical    |     |  Social Platforms    |   |
|   |  (iCal / .ics HTTPS)     |     |   XML Feed API (v2)        |     |  (WhatsApp, FB, X)   |   |
|   +------------+-------------+     +-------------+--------------+     +----------+-----------+   |
+----------------|---------------------------------|-------------------------------|---------------+
                 | (Hourly / On-demand HTTPS)      | (Daily Cached XML over HTTPS) | (OG Scraping)
                 v                                 v                               v
+--------------------------------------------------------------------------------------------------+
|                     NEXT.JS 15 APP ROUTER SERVERLESS & EDGE LAYER                                |
|                                                                                                  |
|   +--------------------------+     +----------------------------+     +----------------------+   |
|   | /api/calendar/route.ts   |     | /api/mass-readings/route.ts|     | /api/og/route.tsx    |   |
|   | (iCal Proxy & Cache Bust)|     | (Liturgy Scraper & XML)    |     | (ImageResponse 1200x)|   |
|   +------------+-------------+     +-------------+--------------+     +----------+-----------+   |
|                                                  |                                               |
|                                    Next.js Data Cache: 86400s (24h)                              |
|                                    Cache-Control: public, s-maxage=86400                         |
|                                    Fallback: FALLBACK_READINGS (Offline/500)                     |
+--------------------------------------------------+-----------------------------------------------+
                                                   |
                                                   | JSON Stream: MassReadingsResponse
                                                   v
+--------------------------------------------------------------------------------------------------+
|                           CLIENT RUNTIME LAYER (React 19 / TypeScript 5.7)                       |
|                                                                                                  |
|   +------------------------------------------------------------------------------------------+   |
|   |                                  LandingClient.tsx Hub                                   |   |
|   |                                                                                          |   |
|   |   +--------------------+  +--------------------+  +----------------------------------+   |   |
|   |   | Infinite 3D Decks  |  | Rosary 5-Element   |  | Mass Guide Subsystem 4 (RF-08)   |   |   |
|   |   | Subsystem (R2-R4)  |  | Subsystem (R7)     |  | - Standalone Direct Mass Launch  |   |   |
|   |   +--------------------+  +--------------------+  | - Auto-Fetch on Mount            |   |   |
|   |                                                   | - Canonical Sequential Injection |   |   |
|   |   +--------------------+  +--------------------+  | - AppleMusicLyrics Stream Feed   |   |   |
|   |   | Long-Press Tooltip |  | Confession Guide   |  | - Complete Roman Missal & Hymns  |   |   |
|   |   | Subsystem (R5)     |  | Subsystem          |  +----------------------------------+   |   |
|   |   +--------------------+  +--------------------+                                         |   |
|   +------------------------------------------------------------------------------------------+   |
|                                     |                                                            |
|   +---------------------------------+--------------------------------------------------------+   |
|   |                          CalendarioClient.tsx Subsystem                                  |   |
|   |                                                                                          |   |
|   |   +-----------------------------+  +-------------------------------+  +--------------+   |   |
|   |   | iCal Parser & RRULE Engine  |  | Computus & Misas de Precepto  |  | Multi-Export |   |   |
|   |   | (Community Events)          |  | Engine (Canon 1246 & CEM)     |  | (.ics, GCal) |   |   |
|   |   +-----------------------------+  +-------------------------------+  +--------------+   |   |
|   +------------------------------------------------------------------------------------------+   |
|                                                                                                  |
|   +------------------------------------------------------------------------------------------+   |
|   |                      PRESENTATION & STYLING ARCHITECTURE (global.css)                    |   |
|   |   CSS Custom Properties | 3D Perspective Matrix | Touch Ergonomics | Vanilla CSS Tokens  |   |
|   +------------------------------------------------------------------------------------------+   |
+--------------------------------------------------------------------------------------------------+
```

### 2.1 Mass Readings Scraper Data Flow Architecture
The daily liturgical readings data flow operates under a multi-tier resilient architecture:

```
[ Client Initial Mount / Direct Mass Open ]
                  │
                  ▼
   [ GET /api/mass-readings?date=YYYY-MM-DD&lang=SP ]
                  │
                  ├───────────────────────────────┐
                  ▼                               ▼
       [ Edge Server Cache Hit? ]       [ Server Cache Miss ]
                  │                               │
         YES ─────┘                               ▼
         │                        [ HTTP Fetch: feed.evangelizo.org ]
         │                        [ Signal: AbortSignal.timeout(6000) ]
         │                                        │
         │                        ┌───────────────┴───────────────┐
         │                        ▼                               ▼
         │                [ HTTP 200 OK ]                 [ Timeout / 5xx / Bad XML ]
         │                        │                               │
         │                        ▼                               ▼
         │             [ XML Parser & Decoder ]          [ Return FALLBACK_READINGS ]
         │             - CDATA Extraction                - Status 200 OK
         │             - Accented Entity Decoding        - isFallback: true
         │             - Psalm Stanza & Antiphon         - Caching: s-maxage=300
         │             - Seasonal Alleluia Generator              │
         │                        │                               │
         │                        ▼                               │
         │             [ MassReadingsResponse ]                   │
         │             - Status 200 OK                            │
         │             - Cache: s-maxage=86400                    │
         │                        │                               │
         └────────────────────────┼───────────────────────────────┘
                                  ▼
                     [ Client React State: dailyReadings ]
                                  │
                                  ▼
      [ Canonical Injection Pipeline (getCanonicalMassLines) ]
                                  │
          ┌───────────────────────┴───────────────────────┐
          ▼                                               ▼
[ Standard Mass Guide Dialog ]             [ AppleMusicLyrics Interactive View ]
(Liturgia de la Palabra Part)              (Kinetic Synced Proclamation Stream)
```

---

## 3. Architectural Viewpoints

### 3.1 Functional Viewpoint: Subsystems Breakdown

The system decomposes into six core modular functional subsystems:

#### Subsystem 1: Food Prayers & Auto-Day Decks (RF-01, RF-02, RF-03, RF-04)
- Transcribed Sunday-Saturday meal blessings (*Antes*) & thanksgivings (*Después*) from the Roman *Bendicional*.
- Automatic Day Detection mapping system local time to current day deck card.
- Infinite circular deck carousel supporting left/right swipe gestures with modulo math.
- Dynamic HSL palette generator calculating real-time lightness/chroma per deck index.

#### Subsystem 2: Rosary Guided Subsystem (RF-07)
- 5-element mystery sequence: Artwork/Icon, Scripture Citation, Scripture Text, Meditation, and Reflection Question.
- Untruncated full prayer typography.
- Dedicated sub-decks (Introductory, 5 Decades, Concluding & Self-Prayers).
- Collapsible nested repeated prayers (Padre Nuestro, 10 Ave Marías, Gloria, Jaculatoria).
- Top-bar bead counter button adjacent to Close 'X' triggering hardware haptic vibration.

#### Subsystem 3: Jesus Calendar & Misas de Precepto Subsystem (RF-09, RF-06)
- Full Canon 1246 §1 & §2 + CEM Holy Days of Obligation generator.
- Liturgical Computus algorithm computing Easter and movable solemnities.
- Layered interactive event detail modal.
- Universal calendar export engine (.ics, Google, Apple Calendar, Outlook Web, Outlook Desktop, Yahoo).

#### Subsystem 4: Mass Guide & Daily Readings Scraper Subsystem (RF-08 / RF-08.1, RF-08.2, RF-08.3)
Subsystem 4 is architected with three tightly coupled, highly cohesive components:

```
+--------------------------------------------------------------------------------------------------+
|                    SUBSYSTEM 4: MASS GUIDE & DAILY READINGS SCRAPER ARCHITECTURE                 |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|  1. EDGE SCRAPER API ENGINE (`src/app/api/mass-readings/route.ts`)                               |
|     • Endpoint: `GET /api/mass-readings?date=YYYY-MM-DD&lang=SP`                                 |
|     • Upstream: Queries Evangelizo XML feed with 6-second timeout.                               |
|     • Parser: Robust extraction of First Reading, Responsorial Psalm, Second Reading,            |
|       Alleluia / Gospel Acclamation, Holy Gospel, and Patristic Meditation.                      |
|     • Psalm Formatter: Parses complete stanzas (`\n\n`), extracts antiphon `R.` phrase, and      |
|       maintains full verse structure without duplicating or clipping verse 1.                    |
|     • Alleluia Builder: Generates seasonal acclamation ("¡Aleluya, aleluya!" vs Lenten           |
|       "Honor y gloria a ti, Señor Jesús") and lectionary verse.                                  |
|     • Entity Sanitizer: Decodes all HTML/XML character entities (Spanish vowels, quotes, dashes).|
|     • Edge Cache Policy: 24h Next.js revalidation (`revalidate: 86400`) and HTTP `Cache-Control`.|
|     • Resilient Fallback: Bundles complete canonical `FALLBACK_READINGS` for zero-downtime.     |
|                                                                                                  |
|  2. CANONICAL LITURGICAL INJECTION PIPELINE (`LandingClient.tsx` & `massResponses.ts`)           |
|     • Removal of legacy accordion: Obsolete `showLecturasInResponses` toggle deleted.            |
|     • Strict GIRM Sequence in Section 2 ("Liturgia de la Palabra"):                              |
|       1. Primera Lectura (Sentados) + Citation + Full Text + Proclamation Dialogue.              |
|       2. Salmo Responsorial (Sentados) + Citation + Antiphon `R.` Box + Stanzas with responses.  |
|       3. Segunda Lectura (Sentados) [Conditional on Sundays/Solemnities] + Full Text.            |
|       4. Aclamación del Evangelio / Aleluya (De pie) + Acclamation + Gospel Verse.               |
|       5. Santo Evangelio (De pie) + Introductory Dialogue + Full Gospel Text + Concluding       |
|          Dialogue + Secret Priest Rubric.                                                        |
|       6. Homilía, Credo, and Oración Universal (continuing Roman Missal sequence).               |
|     • Kinetic Reader (`AppleMusicLyrics.tsx`): `getCanonicalMassLines` feeds kinetic lines array |
|       with real live scripture readings, speaker tags, and dynamic postures.                    |
|                                                                                                  |
|  3. DIRECT ACCESS & AUTONOMOUS FETCH LIFECYCLE                                                   |
|     • Page Mount Pre-fetch: `useEffect` executes `fetchDailyReadings()` on initial client mount, |
|       caching readings in memory before the user reaches the Liturgy of the Word.                |
|     • Direct Launcher: Hero "Guía de Misa" and "Seguir la Misa" buttons open modal directly      |
|       at Section 1 (Ritos Iniciales, index 0).                                                   |
|     • Dynamic UI States: Seamless spinner on fetch, offline badge on fallback, refresh button.   |
+--------------------------------------------------------------------------------------------------+
```

#### Subsystem 5: Social Sharing & Dynamic OG Image Subsystem (RF-06)
- Edge `/api/og` route generating 1200x630px high-contrast Catholic banners.
- Deep-linked URL query routing (`/calendario?evento=[id]`) triggering immediate modal.
- Dynamic HTML metadata injection via Next.js `generateMetadata`.

#### Subsystem 6: Usability & Global Tooltips Subsystem (RF-05)
- Unified `useLongPress` gesture hook with 450ms hold detection.
- Declarative `[data-tooltip]` system with zero-delay mobile execution and haptic feedback.

---

### 3.2 Information & Data Viewpoint: Interface Contracts

#### 3.2.1 Edge Scraper API Data Contract (`MassReadingsResponse`)
Defined in `src/app/api/mass-readings/route.ts` and consumed in `LandingClient.tsx`:

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

#### 3.2.2 Canonical Mass Response Data Contracts (`massResponses.ts`)
```typescript
export interface MassResponseLine {
  speaker?: 'Sacerdote' | 'Pueblo' | 'Lector' | 'Salmista' | 'Todos' | 'Celebrant' | 'People' | 'Priest' | 'Diácono';
  text: string;
  rubric?: string;
}

export interface MassResponsePart {
  title: { es: string; en: string };
  posture?: { es: string; en: string }; // 'De pie' | 'Sentados' | 'De rodillas'
  citation?: string;
  rubric?: { es: string; en: string };
  lines: { es: MassResponseLine[]; en: MassResponseLine[] };
}

export interface MassResponseSection {
  title: { es: string; en: string };
  slug: string;
  parts: MassResponsePart[];
}
```

#### 3.2.3 Canonical Mass Stream Generator Function Contract
```typescript
export function getCanonicalMassLines(
  sectionIdx: number,
  dailyReadings: MassReadingsResponse | null,
  lang: 'es' | 'en'
): Array<{ text: string; speaker?: string; isLeft?: boolean }>;
```

---

### 3.3 Concurrency & Execution Viewpoint

1. **Edge Serverless Execution**:
   - `/api/mass-readings`: Executes on Next.js Edge/Serverless runtime. Utilizes Next.js Data Cache (`revalidate: 86400`) to minimize upstream queries to Evangelizo to at most 1 request per liturgical date.
   - `/api/calendar`: Executes on dynamic Serverless runtime. Employs `revalidate: 0` and timestamp headers to prevent stale calendar caches when parish coordinators modify schedules.
   - `/api/og`: Edge runtime using `@vercel/og` (`ImageResponse`). Compiles React JSX and vector typography into a PNG array buffer in < 60ms.

2. **Client-Side Event Loop & Gesture Concurrency**:
   - Non-blocking client-mount pre-fetching: `fetchDailyReadings()` executes asynchronously via `fetch()` without interrupting DOM rendering or animations.
   - Touch gestures execute on a single passive touch event listener binding on the card container:
     - `touchstart`: Records `(startX, startY, startTime)`.
     - `touchmove`: Checks `Math.abs(dx) > Math.abs(dy)` to lock horizontal swipe vs native vertical scroll without main-thread jank.
     - `touchend`: Applies discrete physics threshold: if `|dx| > 80px` or velocity `> 0.5px/ms`, trigger state transition; otherwise spring back via CSS transition `cubic-bezier(0.2, 0.8, 0.2, 1)`.

---

### 3.4 Development Viewpoint & Code Layout

The project enforces strict separation of concerns with zero UI framework bloat:

```
lapandilladejesusqro.org/
├── docs/                                    # Standardized technical manuals (IEEE 42010, 29148, 12207)
│   ├── architecture.md                      # This document (System Architecture Specification)
│   ├── srs.md                               # Software Requirements Specification (ISO 29148)
│   └── tasks.md                             # Software Life Cycle Execution Task Matrix (ISO 12207)
├── scripts/
│   └── test-e2e.mjs                         # 5-Tier automated test suite (≥189 tests, ~50ms execution)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── calendar/route.ts            # Calendar proxy endpoint
│   │   │   ├── mass-readings/route.ts       # Daily Mass readings scraper endpoint (RF-08.1)
│   │   │   └── og/route.tsx                 # Dynamic Open Graph image generator (RF-06)
│   │   ├── calendario/
│   │   │   ├── page.tsx                     # Server component with dynamic metadata
│   │   │   └── CalendarioClient.tsx         # Interactive calendar, filters, export modal (RF-09)
│   │   ├── LandingClient.tsx                # Master client UI (Decks, Rosary, Mass Guide RF-08.2/RF-08.3)
│   │   ├── massResponses.ts                 # Full Missal dialogues & Mexican hymns (RF-08)
│   │   ├── cancioneroArchive.ts             # Active song repertoire & lyrics archive
│   │   ├── AppleMusicLyrics.tsx             # Interactive kinetic synced lyric display (RF-08.2)
│   │   ├── global.css                       # Monolithic Vanilla CSS design system
│   │   ├── layout.tsx                       # Root layout (SEO, JSON-LD, Fonts)
│   │   └── page.tsx                         # Landing entry point
│   ├── components/
│   │   └── GlobalModal.tsx                  # Accessible backdrop & dialog container
│   ├── data/
│   │   ├── oracionesData.ts                 # Food prayers, Rosary 5-element data, decks
│   │   ├── preceptoData.ts                  # Misas de Precepto & Computus algorithm
│   │   └── confesionData.ts                 # Confession guide & examination
│   └── utils/
│       ├── icalParser.ts                    # RFC 5545 iCal parser & RRULE engine
│       ├── calendarExport.ts                # Multi-platform calendar export formatters
│       └── useLongPress.ts                  # Global long-press tooltip & haptic hook
```

---

### 3.5 Physical & Deployment Viewpoint

- **Hosting Platform**: Vercel Cloud Platform.
- **Node Runtime**: Node.js 20.x LTS / Next.js 15 Serverless & Edge Engine.
- **Static Assets**: Edge CDN cached with immutable hashing (`/_next/static/...` cache-control max-age 31536000).
- **Public Domain**: `https://lapandilladejesusqro.org`.

---

## 4. Quality Attributes & Non-Functional Architecture (ISO/IEC 25010)

### 4.1 Performance & Responsiveness
- **Edge API Latency**: Scraper API serves cached responses in < 50ms from Edge cache; cold scrapes complete in < 500ms.
- **UI Render Latency**: Mass Guide modal renders in < 50ms with pre-cached readings.
- **Animation Fluidity**: 60 FPS sustained animation rate across kinetic text streaming and 3D deck card dragging using `translate3d` and GPU compositing.

### 4.2 Liturgical Fidelity & Canonical Compliance
- Strict adherence to the *Misal Romano (3ª Edición Típica)* approved by the Conferencia del Episcopado Mexicano (CEM) and the *Instrucción General del Misal Romano* (IGMR).
- Exact liturgical sequence of the Liturgy of the Word without omissions or transpositions.
- Accurate seasonal Gospel acclamations (Aleluya vs Lenten tract).

### 4.3 Reliability, Resilience & Graceful Degradation
- **Timeout Protection**: Upstream Evangelizo queries abort after 6,000ms.
- **Zero-Downtime Fallback**: If external feeds fail (5xx, network loss, DNS failure, out-of-range dates), `FALLBACK_READINGS` returns valid Catholic liturgical texts with HTTP 200 and `isFallback: true`.
- **Offline Mode**: If client loses network connectivity, cached readings or fallback liturgy remain fully accessible.

### 4.4 Usability & Ergonomics
- **Direct Launch**: One tap on "Guía de Misa" / "Seguir la Misa" opens directly into the active Mass guide without intermediate menus or redundant accordion dropdowns.
- **Zero Scroll Conflict**: Modal viewports lock background scrolling (`overflow: hidden`), while `.stacked-card` and reading containers scroll smoothly without mobile browser jumping.
- **Haptic Tactility**: Tactile haptic feedback triggers on navigation buttons and bead counters.

### 4.5 Accessibility (WCAG 2.1 Level AA)
- Contrast ratio between text and background exceeds 4.5:1 for normal text and 7:1 for headers.
- All interactive controls feature semantic `aria-label`, `role="button"`, and keyboard focus rings (`:focus-visible`).
- Touch targets strictly adhere to minimum dimensions of 44x44 CSS pixels.

---

## 5. Technology Stack & Decision Rationale

| Layer | Chosen Technology | Version | Architectural Rationale |
|---|---|---|---|
| **Framework** | Next.js App Router | 15.1.0 | Serverless edge routes, dynamic Open Graph generation, optimal SSR/SSG hybrid rendering. |
| **UI Library** | React | 19.0.0 | Concurrent rendering, modern hooks, zero client runtime bloat. |
| **Language** | TypeScript | 5.7.3 | Strict static typing across prayer structures, iCal parsing, and liturgical calculation. |
| **Styling** | Pure Vanilla CSS | Custom Tokens | High performance, zero CSS-in-JS runtime penalty, direct 3D GPU transforms, easily inspectable. |
| **Calendar Engine**| `rrule` + RFC 5545 | 2.8.1 | Robust recurrence expansion for parish Google Calendar events. |
| **Image Generation**| `next/og` (`@vercel/og`) | Built-in | Dynamic server-side rasterization of event banners with custom Catholic typography. |
| **Test Harness** | Node.js ESM Runner | Built-in | Zero-dependency, ultra-fast (~50ms) test execution across Tiers 1–5 in `scripts/test-e2e.mjs`. |

---

## 6. Architectural Traceability Matrix

| Requirement | Architectural Component | Implementation Path | Verification Test |
|---|---|---|---|
| **R1 / RF-01 (Food Prayers Transcription)** | Central Prayer Data Layer | `src/data/oracionesData.ts` | Tier 1: `T1-R1-01` to `T1-R1-05` |
| **R2 / RF-02 (Auto-Day Selection)** | Deck State Machine | `src/app/LandingClient.tsx` | Tier 1: `T1-R2-01` to `T1-R2-05` |
| **R3 / RF-03 (Infinite Swipe Gesture)** | 3D Perspective Card Stack & Modulo Physics | `src/app/LandingClient.tsx`, `src/app/global.css` | Tier 1: `T1-R3-01` to `T1-R3-05` |
| **R4 / RF-04 (Dynamic Color Tones)** | HSL Chroma Engine | `src/app/LandingClient.tsx`, `src/app/global.css` | Tier 1: `T1-R4-01` to `T1-R4-05` |
| **R5 / RF-05 (Long-Press Tooltips)** | Global Long-Press & Haptic Hook | `src/utils/useLongPress.ts`, `src/app/global.css` | Tier 1: `T1-R5-01` to `T1-R5-05` |
| **R6 / RF-06 (OG Preview & Deep-Links)**| Edge Image Engine & Calendar Query Router | `src/app/api/og/route.tsx`, `src/app/calendario/` | Tier 1: `T1-R6-01` to `T1-R6-05` |
| **R7 / RF-07 (Rosary Overhaul & Counter)**| 5-Element Mystery Schema & Top Bar Counter | `src/data/oracionesData.ts`, `src/app/LandingClient.tsx` | Tier 1: `T1-R7-01` to `T1-R7-05` |
| **R8 / RF-08.1 (Daily Scraper API)** | Edge Scraper API Engine & XML Parser | `src/app/api/mass-readings/route.ts` | Tier 1: `T1-R8-01` to `T1-R8-05` |
| **R8 / RF-08.2 (Canonical UI Injection)**| Canonical Liturgy Injection & Kinetic Stream | `src/app/LandingClient.tsx`, `src/app/massResponses.ts` | Tier 1: `T1-R8-06` to `T1-R8-10` |
| **R8 / RF-08.3 (Direct Access & Auto-fetch)**| Direct Launchers & Mount Background Fetch | `src/app/LandingClient.tsx` | Tier 1: `T1-R8-11` to `T1-R8-15` |
| **R9 / RF-09 (Misas de Precepto & Export)**| Computus Algorithm & Multi-Export Suite | `src/data/preceptoData.ts`, `src/utils/calendarExport.ts` | Tier 1: `T1-R9-01` to `T1-R9-05` |
| **R10 / RF-10 (Autonomous Commits/Tags)** | Lifecycle & CI/CD Verification Engine | `scripts/test-e2e.mjs`, `docs/tasks.md` | Tier 1: `T1-R10-01` to `T1-R10-05` |
