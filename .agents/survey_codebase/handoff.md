# Codebase Architecture & Repository Survey Report

**Agent**: Codebase Architecture Explorer (`survey_codebase`)  
**Project**: La Pandilla de Jesús (`lapandilladejesusqro.org`)  
**Working Directory**: `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/survey_codebase`  
**Date**: 2026-08-26T23:57:00-06:00  

---

## 1. Observation

Direct inspection of the repository structure, configuration files, source code, styling architecture, and build pipeline revealed the following exact layout and component implementations:

### 1.1 Project Structure & File Index
```
lapandilladejesusqro.org/
├── package.json                         # Dependencies & npm scripts
├── tsconfig.json                        # TypeScript 5.7 compiler options (@/* path alias)
├── next.config.mjs                      # Next.js 15 config (reactStrictMode: true)
├── next-env.d.ts                        # Next.js TypeScript declarations
├── README.md                            # Repository docs
├── scope-exploration.md                 # Requirements & scope exploration notes
├── .agents/
│   ├── ORIGINAL_REQUEST.md              # Authoritative multi-agent requirements prompt
│   └── survey_codebase/                 # Working directory (DISPATCH.md, BRIEFING.md, progress.md, handoff.md)
├── public/
│   ├── cancionero-icon.svg              # Cancionero icon asset
│   ├── community.png                    # Community graphic for Schema/OG
│   ├── favicon.png / favicon.svg        # Favicon assets
│   ├── hero-bg.png                      # Hero section background
│   ├── icons.svg                        # SVG symbol sheet
│   └── logo.png                         # Brand logo
└── src/
    ├── config.ts                        # Centralized config (ICAL_FEED_URL)
    ├── components/
    │   └── GlobalModal.tsx              # Reusable modal container wrapper
    ├── data/
    │   ├── confesionData.ts             # Confession guide database (bilingual)
    │   └── oracionesData.ts             # Prayers & Rosary deck database & generator
    ├── utils/
    │   └── icalParser.ts                # iCal .ics parser & RRULE recurrence expander
    └── app/
        ├── layout.tsx                   # Root server layout (SEO, Schema JSON-LD, Analytics)
        ├── page.tsx                     # Landing page server component (Suspense wrapper)
        ├── LandingClient.tsx            # Main client component (Decks, Modals, FAQs, Nav)
        ├── AppleMusicLyrics.tsx         # Karaoke/Apple Music style lyric/dialogue viewer
        ├── massResponses.ts             # Mass responses & dialogues database (ES/EN)
        ├── cancioneroArchive.ts         # Additional song lyrics archive
        ├── global.css                   # Monolithic global stylesheet (4146 lines)
        ├── robots.ts                    # Dynamic robots.txt route
        ├── sitemap.ts                   # Dynamic sitemap.xml route
        ├── api/
        │   └── calendar/
        │       └── route.ts             # Dynamic serverless proxy for Google Calendar iCal feed
        ├── calendario/
        │   ├── page.tsx                 # Calendar page server component
        │   └── CalendarioClient.tsx     # Calendar view, filters & native calendar integration
        └── donaciones/
            └── page.tsx                 # Donations under construction page
```

### 1.2 Build Setup & Runtime Dependencies
* **Framework**: Next.js 15.1.0 (`next` runtime 15.5.18 during build), React 19.0.0, React-DOM 19.0.0.
* **Build Command**: `npm run build` (`next build`) runs in ~2.0s and outputs 8 static/dynamic routes cleanly without errors.
* **Dependencies** (`package.json:12-18`):
  * `next`: `^15.1.0`
  * `react`: `^19.0.0`
  * `react-dom`: `^19.0.0`
  * `@vercel/analytics`: `^2.0.1` (rendered in `src/app/layout.tsx:88`)
  * `rrule`: `^2.8.1` (used for recurrent Google Calendar events in `src/utils/icalParser.ts:1`)
* **Styling Framework**:
  * **Vanilla CSS (No Tailwind, No CSS Modules, No SCSS)**.
  * Single central stylesheet: `src/app/global.css` (4146 lines, 87.6 KB).
  * Design tokens defined in `:root` (`src/app/global.css:16-38`):
    * Primary brand colors: `--coffee: #5C3D2E`, `--coffee-light: #8B6F5A`, `--mocha: #7A5C47`, `--beige: #F5F0E8`, `--cream: #FAF7F2`, `--white: #FFFFFF`, `--gold: #C5944E`, `--gold-hover: #a0783c`, `--purple: #6B4C8A`, `--purple-soft: #8E6DB0`, `--purple-bg: #F3EFF8`.
    * Text & neutrals: `--text-dark: #2D1B0E`, `--text-body: #5A4636`, `--text-light: #8C7B6B`, `--border-subtle: rgba(92, 61, 46, 0.1)`.
    * Border radii: `--radius: 16px`, `--radius-sm: 12px`, `--radius-xs: 8px`.

---

## 2. Logic Chain: Analysis of Codebase Systems

### 2.1 Deck Architecture & Current Implementation
1. **Deck Types and Data Models**:
   * Defined in `src/data/oracionesData.ts:6-43`:
     * Interface `PrayerCard`: `{ id, title, titleEn?, subtitle?, subtitleEn?, category?, categoryEn?, text, textEn?, isRosaryGuide?, isConfigCard?, isMysteryCard?, mysteryNumber?, mysteryName?, mysteryNameEn?, mysteryMeditation?, mysteryMeditationEn? }`.
     * `oracionesComunidad` (`oracionesData.ts:47-207`): Deck 1 containing community prayers (Oración de la Pandilla, Oración por la paz, Oración a la Sagrada Familia, etc.).
     * `oracionesBasicas` (`oracionesData.ts:212-626`): Deck 2 containing 11 basic prayers (Señal de la Cruz, Padre Nuestro, Ave María, Gloria, Credo, Salve, Ángel de la Guarda, Acto de Contrición, etc.), including `basicas-alimentos` at lines 600–625.
     * `getSantoRosarioDeck(manualType, variant)` (`oracionesData.ts:919-1879`): Deck 3 containing generated guided flow for Holy Rosary with 4 variants (`mexicana`, `misionera`, `universal`, `latin`) and 4 mystery types (`gozosos`, `dolorosos`, `gloriosos`, `luminosos`).
2. **Deck Switching & State Flow** (`src/app/LandingClient.tsx:780-865`):
   * `activeOracionDeck`: state variable (`'comunidad' | 'basicas' | 'rosario'`).
   * `activeOracionIdx`: current card index within deck.
   * `handleSwitchOracionDeck(deck)`: switches deck, resets `activeOracionIdx` to `0`, resets `decadeBeadsCount` to `0`, and calls `setModalUrl('oraciones', { deck, ... })`.
   * `handlePrevDeck()` / `handleNextDeck()`: cyclic deck switcher navigating across `['comunidad', 'basicas', 'rosario']`.
3. **Card Stacking & 3D Transitions** (`src/app/LandingClient.tsx:2094-2138`, `src/app/global.css:2466-2580`):
   * Rendered in `.stacked-deck-container` with perspective: `1000px`.
   * Relative offset `diff = (idx - activeOracionIdx + N) % N` calculates spatial card positions:
     * `active` (`diff === 0`): `transform: translate3d(0, 0, 0) scale(1) rotate(0deg)`, `z-index: 10`, `opacity: 1`.
     * `next` (`diff === 1`): `transform: translate3d(0, 12px, -40px) scale(0.96) rotate(-1deg)`, `z-index: 5`, `opacity: 0.95`.
     * `next-behind` (`diff === 2`): `transform: translate3d(0, 24px, -80px) scale(0.92) rotate(1.5deg)`, `z-index: 2`, `opacity: 0.85`.
     * `far-behind` (`diff >= 3`): `transform: translate3d(0, 36px, -120px) scale(0.88) rotate(-0.5deg)`, `z-index: 1`, `opacity: 0`.
     * Transition classes: `swiped-left` (`translate3d(-120%, 8%, 0) rotate(-18deg)`) and `swiped-right` (`translate3d(120%, 8%, 0) rotate(18deg)`).
4. **Gesture Handling & Physics-based Swiping** (`src/app/LandingClient.tsx:1010-1068`):
   * Touch start: records `cardTouchStartX` & `cardTouchStartY`.
   * Touch move: measures `deltaX` & `deltaY`, detects drag intent (`'horizontal'` vs `'vertical'`), and applies live transform `translate3d(${cardDragX}px, 0, 0) rotate(${cardDragX * 0.04}deg)`.
   * Touch end: threshold of `80px` triggers `handleOracionNav(activeOracionIdx - 1)` (right swipe) or `handleOracionNav(activeOracionIdx + 1)` (left swipe).
   * Single-scroll architecture: `.stacked-card` has `overflow-y: auto`, modal container has `overflow: hidden`, preventing double-scroll bugs.

---

### 2.2 Modals, Routing, Buttons, and Tooltips Implementation
1. **Modal Architecture** (`src/components/GlobalModal.tsx:1-48`):
   * Overlay container `.calendar-modal-overlay` with backdrop click handler.
   * Inner card `.recursos-modal-card.modal-large` with `e.stopPropagation()`.
   * Close button `✕` (`.calendar-modal-close-btn`), hideable via `hideCloseBtn`.
   * Background scroll locking (`src/app/LandingClient.tsx:987-999`): toggles `document.body.style.overflow = 'hidden'` and adds `modal-open` class.
2. **URL Query Param Routing (Deep Linking)** (`src/app/LandingClient.tsx:739-767`, `899-962`):
   * `setModalUrl(modal, extraParams)` modifies browser history via `router.replace(url, { scroll: false })` using `URLSearchParams`.
   * Supported query params: `modal`, `deck`, `seccion`, `cancion`, `misterio`, `variante`, `etapa`, `lang`.
   * `useEffect` listens to `searchParams` on mount and changes, opening/closing modals accordingly.
3. **Button Interaction & Haptics**:
   * `triggerHaptic('light' | 'medium' | 'success')` (`LandingClient.tsx:697-710`): uses `navigator.vibrate([15])`, `[25]`, or `[15, 30, 15]`.
   * Elastic bounce feedback: `bounceBtn` state triggers `.bounce-active` CSS animation on modal close (`LandingClient.tsx:1069-1079`).
   * Dynamic hover buttons: `.dynamic-btn` in hero changes flex grow from `1` to `2.2` while unhovered buttons shrink to `0.8` (`global.css:643-685`).
4. **Declarative Long-Press / Hover Tooltip System**:
   * Declarative API: elements declare `data-tooltip="Description text"` (and optional modifiers like `.tooltip-down`, `.btn-cancionero`, `.btn-guia`).
   * CSS Implementation (`src/app/global.css:1959-2112`):
     * `[data-tooltip]::after`: absolute tooltip box with background `rgba(45, 27, 14, 0.96)`, white text, 8px radius, z-index 99999.
     * `[data-tooltip]::before`: 6px triangular pointer arrow.
     * Desktop behavior: `[data-tooltip]:hover::after` has `transition-delay: 1.8s` (preventing visual clutter on rapid cursor movement).
     * Mobile behavior: `@media (hover: none), (max-width: 768px)` removes delay (`transition-delay: 0s !important`) for tap/long-press feedback.
     * Modal cleanup: `body.modal-open [data-tooltip]::before, body.modal-open [data-tooltip]::after { display: none !important; }` prevents tooltips from bleeding over modal backdrops.

---

### 2.3 Calendar, Events & iCal Integration
1. **Config & Proxy**:
   * Feed URL stored in `src/config.ts:7` (`ICAL_FEED_URL` pointing to public Google Calendar iCal feed).
   * API Route `src/app/api/calendar/route.ts`: Serverless proxy with `dynamic = 'force-dynamic'`, `revalidate: 0`, and timestamp cache-buster preventing Vercel cache and Google CORS restrictions.
2. **Parser & Recurrence Expansion** (`src/utils/icalParser.ts:1-356`):
   * `parseICS(icsText)`: Parses VEVENT blocks, unfolds lines, unescapes strings, extracts `DTSTART`, `DTEND`, `RRULE`, `EXDATE`.
   * `expandRecurringEvent(baseEvent)`: Uses `rrule.rrulestr(rruleInput, { forceset: true })` to calculate all occurrences between today and a 6-month horizon.
   * `guessEventTypes(title)`: Infers categories (`Retiro`, `Colecta`, `Oración`, `Misión`, `Reunión`, `Apostolado`, `Otro`) by keyword matching.
3. **Calendar Page & Actions** (`src/app/calendario/CalendarioClient.tsx`):
   * Filters events by type badge.
   * Modal "Agregar al Calendario" (`CalendarioClient.tsx:652-706`): Direct web links for Google Calendar (`https://calendar.google.com/calendar/render?action=TEMPLATE&...`), Outlook.com (`https://outlook.live.com/calendar/0/deeplink/compose?...`), and `.ics` download (`downloadICSFile`).
   * Modal "Suscribirse al Calendario" (`CalendarioClient.tsx:708-759`): Live subscription URLs for Google Calendar (`?cid=...`) and Apple Calendar / Outlook Webcal (`webcal://...`).

---

### 2.4 Mass Guide & AppleMusicLyrics System
1. **Data Model** (`src/app/massResponses.ts:1-258`):
   * `MassResponseSection`: Array of liturgical sections (Introductory Rites, Liturgy of the Eucharist, Communion Rite, Concluding Rites) with bilingual dialogue lines (`Celebrant`/`Sacerdote`, `People`/`Pueblo`, `All`/`Todos`).
2. **AppleMusicLyrics Component** (`src/app/AppleMusicLyrics.tsx:1-319`):
   * Dynamic animated gradient backdrops generated from 20 day and 20 night curated color palettes (excluding purple 260-310° hue range).
   * Line-by-line synchronized visual focus with `IntersectionObserver` highlighting active line and updating URL section slugs (`onSectionChange`).

---

## 3. Caveats

1. **Food Prayers (R1)**: Currently, only a single prayer exists (`basicas-alimentos` in `src/data/oracionesData.ts:600-625`). The 18 meal prayer images in the artifact directory need to be transcribed into Sunday–Saturday "Antes de las comidas" and "Después de las comidas" structure and organized as a dedicated deck.
2. **Infinite Deck Looping (R3)**: Current deck navigation cycles through cards within the active deck, but swipe animation uses a standard offset rather than an infinite circular gesture loop with dynamic color tone variations (R4).
3. **Event OG Images & Unique URLs (R6)**: Events currently display in a client-side list in `CalendarioClient.tsx` and hero summary; there is no dynamic OpenGraph (`/api/og` or `generateImageMetadata`) route or unique event URL route structure yet.
4. **Rosary UI (R7)**: Current Rosary implementation in `oracionesData.ts` and `LandingClient.tsx` has 10 beads in a row within mystery cards; R7 requires moving the counter to the top next to 'X' with vibration, adding the 5-element mystery sequence (image, citation, text, meditation, question), un-truncating all text, and creating collapsible nested repeats.
5. **Mass Readings Scraper (R8)**: Currently, Mass Guide only has static liturgy texts in `src/app/massResponses.ts`. There is no scraper fetching daily readings/salmos from liturgical sources yet.
6. **Misas de Precepto (R9)**: Current list is static in `LandingClient.tsx:2467-2525`; needs deep integration into the calendar system with direct event modals and add-to-calendar actions.

---

## 4. Conclusion

* **Architecture Baseline**: The codebase is a well-structured Next.js 15 App Router application with zero external UI dependencies (pure Vanilla CSS with CSS custom properties and 3D transforms).
* **Build Integrity**: `npm run build` succeeds completely without errors (`Route (app)` size 56.8 kB for `/`, 8.64 kB for `/calendario`).
* **Modularity**:
  * Data layer in `src/data/` (`oracionesData.ts`, `confesionData.ts`) and `src/app/` (`massResponses.ts`, `cancioneroArchive.ts`).
  * Modal system centralized in `src/components/GlobalModal.tsx` and URL query sync in `LandingClient.tsx`.
  * Calendar integration centralized in `src/utils/icalParser.ts` and `/api/calendar/route.ts`.
* **Actionable Next Steps**: Subsequent feature implementation teams can cleanly extend `src/data/oracionesData.ts` (adding the Food Prayers Deck and Rosary structure), `src/app/LandingClient.tsx` and `src/app/global.css` (updating deck animations and Rosary UI), `src/app/api/` (adding OG image generation and daily mass scraper), and `src/app/calendario/` (integrating Misas de Precepto).

---

## 5. Verification Method

To independently verify these findings:
1. **Inspect Files**:
   * Review `src/data/oracionesData.ts` lines 47–207, 212–626, and 919–1879.
   * Review `src/app/LandingClient.tsx` lines 780–865, 1010–1068, 2030–2312.
   * Review `src/app/global.css` lines 16–38, 1959–2112, 2412–2620.
   * Review `src/utils/icalParser.ts` lines 1–356.
2. **Run Build**:
   ```bash
   npm run build
   ```
   Confirm that all 8 routes compile with 0 type errors.
