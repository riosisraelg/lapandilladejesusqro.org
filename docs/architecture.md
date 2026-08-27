# ISO/IEC/IEEE 42010:2022 System Architecture Description

**System Name**: La Pandilla de Jesús — Querétaro Web Platform  
**System URL**: `https://lapandilladejesusqro.org`  
**Standard**: ISO/IEC/IEEE 42010:2022 (Systems and software engineering — Architecture description)  
**Version**: 1.0.0  
**Date**: 2026-08-27  
**Status**: Approved & Authoritative  

---

## 1. Architecture Identification & Context

### 1.1 Purpose & Scope
This document provides the formal architectural description for the web platform of **La Pandilla de Jesús (Querétaro, México)**. The platform delivers liturgical resources, structured Catholic prayer decks, a guided interactive Rosary, Liturgy of the Word daily Mass readings, and an integrated parish calendar featuring *Misas de Precepto* (Holy Days of Obligation according to Canon 1246 and the Mexican Episcopal Conference CEM).

### 1.2 Architectural Stakeholders & Concerns Matrix

| Stakeholder Group | Primary Architectural Concerns | Addressed In Viewpoints |
|---|---|---|
| **Parish Community & Youth Ministry** | Instant offline-capable prayer access, zero-friction meal prayers, intuitive mobile gestures, bilingual prayers, responsive UI. | Functional View, Usability & UI View |
| **Catechists & Liturgical Coordinators** | Doctrinal fidelity (*Bendicional*, *Misal Romano* CEM, Canon 1246), 5-element Rosary mystery sequence, complete priest/assembly dialogues. | Information View, Functional View |
| **System Developers & Maintainers** | Maintainability, zero runtime CSS-in-JS overhead (pure Vanilla CSS), type safety (TypeScript 5.7 strict), Next.js 15 App Router architecture. | Development View, Concurrency & Execution View |
| **Parish Administrators** | Automated Google Calendar syncing, automated daily Mass readings scraping, dynamic Open Graph banners for social sharing without manual graphic design. | System Context, Physical & Deployment View |
| **Quality Assurance & Verification** | Deterministic E2E verification, testability, reproducible builds, semantic versioning. | Security & Quality Attributes View |

---

## 2. System Context & External Interfaces

The application functions as a high-performance, mobile-optimized progressive web application with serverless edge extensions.

```
+--------------------------------------------------------------------------------------------------+
|                                    EXTERNAL ECOSYSTEM                                            |
|                                                                                                  |
|   +--------------------------+     +----------------------------+     +----------------------+   |
|   |  Google Calendar Feed    |     |   Evangelizo Liturgical    |     |  Social Platforms    |   |
|   |  (iCal / .ics HTTPS)     |     |   XML Feed API             |     |  (WhatsApp, FB, X)   |   |
|   +------------+-------------+     +-------------+--------------+     +----------+-----------+   |
+----------------|---------------------------------|-------------------------------|---------------+
                 | (Hourly / On-demand HTTPS)      | (Daily Cached HTTPS)          | (OG Scraping)
                 v                                 v                               v
+--------------------------------------------------------------------------------------------------+
|                     NEXT.JS 15 APP ROUTER SERVERLESS & EDGE LAYER                                |
|                                                                                                  |
|   +--------------------------+     +----------------------------+     +----------------------+   |
|   | /api/calendar/route.ts   |     | /api/mass-readings/route.ts|     | /api/og/route.tsx    |   |
|   | (iCal Proxy & Cache Bust)|     | (Liturgy Scraper & XML)    |     | (ImageResponse 1200x)|   |
|   +------------+-------------+     +-------------+--------------+     +----------+-----------+   |
+----------------|---------------------------------|-------------------------------|---------------+
                 |                                 |                               |
                 +-------------------+-------------+-------------------------------+
                                     | Data / Dynamic Metadata / JSX Stream
                                     v
+--------------------------------------------------------------------------------------------------+
|                           CLIENT RUNTIME LAYER (React 19 / TypeScript)                           |
|                                                                                                  |
|   +------------------------------------------------------------------------------------------+   |
|   |                                  LandingClient.tsx Hub                                   |   |
|   |                                                                                          |   |
|   |   +--------------------+  +--------------------+  +-----------------+  +-------------+   |   |
|   |   | Infinite 3D Decks  |  | Rosary 5-Element   |  | Standalone Mass |  | Long-Press  |   |   |
|   |   | Subsystem (R2-R4)  |  | Subsystem (R7)     |  | Guide (R8)      |  | Tooltips R5 |   |   |
|   |   +--------------------+  +--------------------+  +-----------------+  +-------------+   |   |
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

---

## 3. Architectural Viewpoints

### 3.1 Functional Viewpoint

The system decomposes into six core modular functional subsystems:

```
+------------------------------------------------------------------------------------------------+
|                                    CORE FUNCTIONAL MODULES                                     |
+------------------------------------------------------------------------------------------------+
| 1. Prayers for Food & Decks Subsystem (RF-01, RF-02, RF-03, RF-04)                             |
|    - Transcribed Sunday-Saturday meal blessings ("Antes") & thanksgivings ("Después").         |
|    - Automatic Day Detection mapping system local time to current day deck card.               |
|    - Infinite circular deck carousel supporting left/right swipe gestures with modulo math.    |
|    - Dynamic HSL palette generator calculating real-time lightness/chroma per deck index.      |
+------------------------------------------------------------------------------------------------+
| 2. Rosary Guided Subsystem (RF-07)                                                             |
|    - 5-element mystery sequence: Artwork/Icon, Scripture Citation, Scripture Text,             |
|      Meditation, and Reflection Question.                                                      |
|    - Untruncated full prayer typography.                                                       |
|    - Dedicated sub-decks (Introductory, 5 Decades, Concluding & Self-Prayers).                 |
|    - Collapsible nested repeated prayers (Padre Nuestro, 10 Ave Marías, Gloria, Jaculatoria).  |
|    - Top-bar bead counter button adjacent to Close 'X' triggering hardware haptic vibration.   |
+------------------------------------------------------------------------------------------------+
| 3. Mass Guide & Liturgy Scraper Subsystem (RF-08)                                              |
|    - Standalone "Guía de Misa" modal launcher button.                                          |
|    - Complete Roman Missal dialogues (Liturgy of the Word, Priest private Communion prayers).  |
|    - Traditional Mexican sung versions (Gloria de Mejía, Santo, Cordero de Dios).             |
|    - Live edge scraper proxying Evangelizo XML readings with graceful offline fallback.        |
+------------------------------------------------------------------------------------------------+
| 4. Calendar & Misas de Precepto Subsystem (RF-09, RF-06)                                       |
|    - Full Canon 1246 §1 & §2 + CEM Holy Days of Obligation generator.                          |
|    - Liturgical Computus algorithm computing Easter and movable solemnities.                   |
|    - Layered interactive event detail modal.                                                   |
|    - Universal calendar export engine (.ics, Google, Apple Calendar, Outlook Web, Outlook App).|
+------------------------------------------------------------------------------------------------+
| 5. Social Sharing & Dynamic OG Image Subsystem (RF-06)                                         |
|    - Edge `/api/og` route generating 1200x630px high-contrast Catholic banners.                |
|    - Deep-linked URL query routing (`/calendario?evento=[id]`) triggering immediate modal.     |
|    - Dynamic HTML metadata injection via Next.js `generateMetadata`.                           |
+------------------------------------------------------------------------------------------------+
| 6. Usability & Global Tooltips Subsystem (RF-05)                                               |
|    - Unified `useLongPress` gesture hook with 450ms hold detection.                            |
|    - Declarative `[data-tooltip]` system with zero-delay mobile execution and haptic feedback. |
+------------------------------------------------------------------------------------------------+
```

### 3.2 Information & Data Viewpoint

The domain information model is organized into strictly typed TypeScript interfaces across `src/data/` and `src/app/`.

```
+--------------------------------------------------------------------------------------------------+
|                                    DATA SCHEMAS & RELATIONSHIPS                                  |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   +------------------------------------+          +------------------------------------------+   |
|   | FoodPrayerDay                      |          | MysteryItem                              |   |
|   +------------------------------------+          +------------------------------------------+   |
|   | id: string                         |          | number: number                           |   |
|   | day: DayOfWeek                     |          | title: string / titleEn: string          |   |
|   | dayName: string                    |          | biblicalRef: string                      |   |
|   | before: {                          |          | scriptureText: string / scriptureTextEn  |   |
|   |   verse: string                    |          | meditation: string / meditationEn        |   |
|   |   response: string                 |          | reflectionQuestion: string / En          |   |
|   |   prayer: string                   |          | image: string (SVG asset identifier)     |   |
|   | }                                  |          +------------------------------------------+   |
|   | after?: { prayer: string }         |                                                         |
|   | intro?: { citation: string, ... }  |          +------------------------------------------+   |
|   +------------------------------------+          | ParsedEvent / HolyDayOfObligation        |   |
|                                                   +------------------------------------------+   |
|   +------------------------------------+          | id: string                               |   |
|   | DailyMassReadings                  |          | title: string / summary: string          |   |
|   +------------------------------------+          | date: string (YYYY-MM-DD)                |   |
|   | liturgicalDay: string              |          | time: string (HH:mm)                     |   |
|   | saint?: string                     |          | location: string                         |   |
|   | firstReading: { citation, text }   |          | isPrecepto: boolean                      |   |
|   | psalm: { citation, response, text }|          | preceptoRule: 'CEM_OBLIGATION' | ...     |   |
|   | secondReading?: { citation, text } |          | category: EventCategory                  |   |
|   | gospel: { citation, text }         |          +------------------------------------------+   |
|   | meditation?: { author, text }      |                                                         |
|   +------------------------------------+                                                         |
+--------------------------------------------------------------------------------------------------+
```

### 3.3 Concurrency & Execution Viewpoint

1. **Edge Serverless Execution**:
   - `/api/mass-readings`: Executes on Next.js Edge/Serverless runtime. Utilizes Next.js Data Cache (`revalidate: 86400`) to minimize upstream queries to Evangelizo to at most 1 request per liturgical date.
   - `/api/calendar`: Executes on dynamic Serverless runtime. Employs `revalidate: 0` and timestamp headers to prevent stale calendar caches when parish coordinators modify schedules.
   - `/api/og`: Edge runtime using `@vercel/og` (`ImageResponse`). Compiles React JSX and vector typography into a PNG array buffer in < 60ms.

2. **Client-Side Event Loop & Gesture Concurrency**:
   - Single passive touch event listener binding on the card container:
     - `touchstart`: Records `(startX, startY, startTime)`.
     - `touchmove`: Checks `Math.abs(dx) > Math.abs(dy)` to lock horizontal swipe vs native vertical scroll without main-thread jank.
     - `touchend`: Applies discrete physics threshold: if `|dx| > 80px` or velocity `> 0.5px/ms`, trigger state transition; otherwise spring back via CSS transition `cubic-bezier(0.2, 0.8, 0.2, 1)`.

### 3.4 Development Viewpoint & Code Layout

The project enforces strict separation of concerns with zero UI framework bloat:

```
lapandilladejesusqro.org/
├── docs/                                    # Standardized technical manuals (IEEE 42010, 29148, 12207)
│   ├── architecture.md                      # This document
│   ├── srs.md                               # Software Requirements Specification
│   └── tasks.md                             # Software Life Cycle Execution Task Matrix
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── calendar/route.ts            # Calendar proxy endpoint
│   │   │   ├── mass-readings/route.ts       # Daily Mass readings scraper endpoint
│   │   │   └── og/route.tsx                 # Dynamic Open Graph image generator
│   │   ├── calendario/
│   │   │   ├── page.tsx                     # Server component with dynamic metadata
│   │   │   └── CalendarioClient.tsx         # Interactive calendar, filters, export modal
│   │   ├── LandingClient.tsx                # Master client UI (Decks, Rosary, Mass Guide)
│   │   ├── massResponses.ts                 # Full Missal dialogues & Mexican hymns
│   │   ├── cancioneroArchive.ts             # Lyrics archive
│   │   ├── AppleMusicLyrics.tsx             # Interactive synced lyric display
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

### 3.5 Physical & Deployment Viewpoint

- **Hosting Platform**: Vercel Cloud Platform.
- **Node Runtime**: Node.js 20.x LTS / Next.js 15 Serverless & Edge Engine.
- **Static Assets**: Edge CDN cached with immutable hashing (`/_next/static/...` cache-control max-age 31536000).
- **Public Domain**: `https://lapandilladejesusqro.org`.

---

## 4. Quality Attributes & Non-Functional Architecture (ISO/IEC 25010)

### 4.1 Performance & Responsiveness
- **Core Web Vitals**:
  - First Contentful Paint (FCP): < 1.0s on 4G mobile networks.
  - Largest Contentful Paint (LCP): < 1.8s.
  - Cumulative Layout Shift (CLS): 0.00.
  - Interaction to Next Paint (INP): < 50ms.
- **Hardware Acceleration**: Card transformations use `translate3d(x, y, 0)` and `will-change: transform`, keeping compositing on the GPU and maintaining a solid 60 FPS during card drags.

### 4.2 Usability & Ergonomics
- **Zero Scroll Conflict (Single-Scroll Architecture)**: Modal outer containers lock viewport scrolling (`overflow: hidden`), while `.stacked-card` maintains its own smooth internal scrolling (`overflow-y: auto`), preventing double-scrollbar jumps on mobile devices.
- **Haptic Feedback**: Standardized 15ms, 25ms, and 30ms haptic pulses via `navigator.vibrate` for Rosary decade bead counting, long-press triggers, and modal actions.

### 4.3 Reliability, Resilience & Graceful Degradation
- **Offline & Network Failure Resilience**:
  - If the Evangelizo scraper fails or network is unavailable, `/api/mass-readings` serves embedded canonical Sunday/Weekday readings.
  - If the Google Calendar iCal feed is unreachable, `preceptoData.ts` continues to supply the full annual calendar of Misas de Precepto deterministically computed via the Computus algorithm.

### 4.4 Accessibility (WCAG 2.1 Level AA)
- Contrast ratio between text and backgrounds exceeds 4.5:1 for normal text and 7:1 for headers.
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

---

## 6. Architectural Traceability Matrix

| Requirement | Architectural Component | Implementation Path |
|---|---|---|
| **R1 (Food Prayers Transcription)** | Central Prayer Data Layer | `src/data/oracionesData.ts` |
| **R2 (Auto-Day Selection)** | Deck State Machine | `src/app/LandingClient.tsx` |
| **R3 (Infinite Swipe Gesture)** | 3D Perspective Card Stack & Modulo Physics | `src/app/LandingClient.tsx`, `src/app/global.css` |
| **R4 (Dynamic Color Tones)** | HSL Chroma Engine | `src/app/LandingClient.tsx`, `src/app/global.css` |
| **R5 (Long-Press Tooltips)** | Global Long-Press & Haptic Hook | `src/utils/useLongPress.ts`, `src/app/global.css` |
| **R6 (OG Preview & Deep-Links)**| Edge Image Engine & Calendar Query Router | `src/app/api/og/route.tsx`, `src/app/calendario/` |
| **R7 (Rosary Overhaul & Counter)**| 5-Element Mystery Schema & Top Bar Counter | `src/data/oracionesData.ts`, `src/app/LandingClient.tsx` |
| **R8 (Mass Guide & Scraper)** | Edge Scraper & Liturgy Expansion | `src/app/api/mass-readings/`, `src/app/massResponses.ts` |
| **R9 (Misas de Precepto & Export)**| Computus Algorithm & Multi-Export Suite | `src/data/preceptoData.ts`, `src/utils/calendarExport.ts` |
| **R10 (Autonomous Commits/Tags)** | Lifecycle & CI/CD Verification Engine | `scripts/test-e2e.mjs`, `docs/tasks.md` |
