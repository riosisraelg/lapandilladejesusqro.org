# Project: lapandilladejesusqro.org

## Architecture
- **Framework**: Next.js 15.1.0 App Router, React 19, TypeScript 5.7.
- **Styling Architecture**: Monolithic Vanilla CSS (`src/app/global.css`) with CSS custom variables, 3D transform perspectives (`translate3d`, `rotate`, `scale`), and responsive media queries.
- **Data Layer**:
  - `src/data/oracionesData.ts`: Central prayer database, Food Prayers deck (Domingo–Sábado), Rosary mystery structures with 5-element sequence, and deck generation functions.
  - `src/data/confesionData.ts`: Examination of conscience and confession guide.
  - `src/app/massResponses.ts`: Liturgy of the Word, Eucharistic Prayer, Communion dialogues (priest & people), and traditional Mexican sung hymns.
- **API & Serverless Functions**:
  - `/api/calendar`: Google Calendar iCal proxy with cache busting.
  - `/api/mass-readings`: Evangelizo XML feed proxy for daily Liturgia de la Palabra with caching and offline fallback.
  - `/api/og`: Dynamic 1200x630px Open Graph banner generator using `next/og` (`ImageResponse`).
- **Client Components**:
  - `src/app/LandingClient.tsx`: Main interactive hub with infinite deck swiping, dynamic HSL tone generation, standalone Mass Guide modal, Rosary modal with top-bar vibrating counter and collapsible repeated prayers, and global long-press tooltips.
  - `src/app/calendario/CalendarioClient.tsx`: Annual Jesus calendar integrated with Misas de Precepto (Canon 1246 & CEM), layered event modal, URL deep-linking (`?evento=...`), and universal export (.ics, Google, Apple, Outlook Web, Outlook Desktop, Yahoo).
  - `src/components/GlobalModal.tsx`: Accessible modal wrapper.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | R1: Food Prayers Transcription | 18 images transcribed into Domingo–Sábado *Antes* & *Después* meal prayers in Spanish | M1 | ORIGINAL_REQUEST §R1 |
| 2 | R2: Auto-Day Selection & Minimalist Deck | Food deck auto-detects current day of week and opens directly to that card with manual swiping | M1 | ORIGINAL_REQUEST §R2 |
| 3 | R3: Infinite Swipe Animations | Minimal swipe gesture navigating between decks in an infinite continuous loop | M2 | ORIGINAL_REQUEST §R3 |
| 4 | R4: Dynamic Color Tones | Programmatic calculation of distinct HSL brand color tones/gradients per deck | M2 | ORIGINAL_REQUEST §R4 |
| 5 | R5: Global Long-Press Tooltips | Long-press on any interactive button triggers info tooltip with haptic vibration | M3 | ORIGINAL_REQUEST §R5 |
| 6 | R6: Event OG Previews & Shareable Modals | Dynamic OG images via `/api/og` and unique URLs (`/calendario?evento=[id]`) triggering modal | M4 | ORIGINAL_REQUEST §R6 |
| 7 | R7: Rosary UI Overhaul & Vibrating Counter | 5 mystery elements (image, citation, text, meditation, reflection question), untruncated text, collapsible repeated prayers, dedicated main/self decks, top-level vibrating counter | M5 | ORIGINAL_REQUEST §R7 |
| 8 | R8: Mass Guide, Dialogues, Songs & Scraper | Standalone button, missing priest Communion dialogues, Mexican songs (Gloria/Santo/Cordero), daily mass scraper (`/api/mass-readings`) | M6 | ORIGINAL_REQUEST §R8 |
| 9 | R9: Misas de Precepto Calendar Integration | Full Canon 1246 & CEM Holy Days of Obligation, Computus movable feast calculation, layered event modal, and multi-provider export | M7 | ORIGINAL_REQUEST §R9 |
| 10 | R10: Verification, Git Commits & Push | 100% E2E test passing, granular git commits with semantic version tags, and remote push | M8 & M9 | ORIGINAL_REQUEST §R10 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 0 | M0: Technical Manuals & Specs | ISO 42010 Architecture, ISO 29148 SRS, ISO 12207 Tasks, TEST_INFRA.md | none | DONE |
| E2E | E2E Testing Track | Requirement-driven opaque-box 4-tier test suite & TEST_READY.md | M0 | DONE |
| 1 | M1: Food Prayers & Auto-Day Deck | `src/data/oracionesData.ts`, food deck generator, current day auto-selection | M0 | DONE |
| 2 | M2: Infinite Swipe & Dynamic Tones | `LandingClient.tsx`, `global.css`, circular deck navigation, HSL dynamic palette | M1 | PLANNED |
| 3 | M3: Global Long-Press Tooltips | `useLongPress` hook, button integration across LandingClient, Calendario, Modals | M2 | PLANNED |
| 4 | M4: Event OG Image & Shareable Modals | `/api/og/route.tsx`, `CalendarioClient.tsx`, `/calendario/page.tsx` dynamic metadata | M0 | PLANNED |
| 5 | M5: Rosary UI Overhaul & Vibrating Counter | `oracionesData.ts`, `LandingClient.tsx`, `GlobalModal.tsx`, 5 mystery elements, collapsible repeats | M1 | PLANNED |
| 6 | M6: Mass Guide Standalone & Liturgy Scraper | `/api/mass-readings/route.ts`, `massResponses.ts`, `LandingClient.tsx` standalone button | M0 | PLANNED |
| 7 | M7: Misas de Precepto & Calendar Export | `src/data/preceptoData.ts`, `CalendarioClient.tsx`, multi-platform export (.ics, Google, Apple, Outlook) | M4 | PLANNED |
| 8 | M8: E2E Full Suite Verification & Adversarial Hardening | Pass 100% Tiers 1-4 tests + Tier 5 adversarial stress testing | M1-M7, E2E | PLANNED |
| 9 | M9: Granular Git Commits, Semver Tags & Production Push | Granular git commits, semver tags, and final remote push | M8 | PLANNED |

## Interface Contracts
### `oracionesData.ts` ↔ `LandingClient.tsx` (Food Deck & Rosary)
- `FoodPrayerDay`: `{ id: string; day: DayOfWeek; dayName: string; before: MealPrayer; after?: MealPrayer; intro?: RubricIntro }`
- `MysteryItem`: `{ number: number; title: string; titleEn: string; biblicalRef: string; scriptureText: string; scriptureTextEn: string; meditation: string; meditationEn: string; reflectionQuestion: string; reflectionQuestionEn: string; image: string }`
- `getFoodPrayersDeck(dayIndex?: number): PrayerCard[]`
- `getSantoRosarioDeck(variant: RosaryVariant, mysteryType: MysteryType, subDeck: 'opening' | 'mysteries' | 'concluding'): PrayerCard[]`

### `/api/mass-readings` ↔ `LandingClient.tsx`
- Endpoint: `GET /api/mass-readings?date=YYYYMMDD&lang=es`
- Response: `{ liturgicalDay: string; saint?: string; firstReading: { citation: string; text: string }; psalm: { citation: string; response: string; text: string }; secondReading?: { citation: string; text: string }; gospel: { citation: string; text: string }; meditation?: { author: string; text: string } }`

### `/api/og` ↔ Social Share & Calendario
- Endpoint: `GET /api/og?title=[title]&date=[date]&time=[time]&category=[category]&location=[location]`
- Returns: `image/png` (1200x630 px) with Catholic branding.

### `preceptoData.ts` ↔ `CalendarioClient.tsx`
- `getMisasDePrecepto(year: number): ParsedEvent[]`
- Export functions: `generateGoogleCalendarUrl(event)`, `generateOutlookWebUrl(event)`, `generateICSContent(event)`, `downloadICSFile(event)`.

## Code Layout
- `docs/architecture.md`: ISO/IEC/IEEE 42010 Architecture Description
- `docs/srs.md`: ISO/IEC/IEEE 29148 Software Requirements Specification
- `docs/tasks.md`: ISO/IEC/IEEE 12207 Software Lifecycle Atomic Task Plan
- `PROJECT.md`: Project master architecture, feature inventory, milestones, contracts
- `TEST_INFRA.md`: E2E test infrastructure, 4-tier test specifications
- `src/data/oracionesData.ts`: Catholic prayers, Food prayers deck, Rosary deck structures
- `src/data/preceptoData.ts`: Holy Days of Obligation, Computus algorithm, CEM liturgical rules
- `src/app/massResponses.ts`: Full Liturgy of the Word, priest Communion prayers, Mexican sung hymns
- `src/app/api/mass-readings/route.ts`: Daily Mass readings scraper endpoint
- `src/app/api/og/route.tsx`: Dynamic Open Graph image generation endpoint
- `src/utils/useLongPress.ts`: Global long-press tooltip hook with haptic feedback
- `src/utils/calendarExport.ts`: Universal calendar export generators
- `src/app/LandingClient.tsx`: Decks, Infinite navigation, Rosary modal, Mass Guide button
- `src/app/calendario/CalendarioClient.tsx`: Calendar view, Misas de Precepto, layered event modals
- `src/app/global.css`: UI styling, infinite deck animations, top-level vibrating counter styles, tooltip popovers
