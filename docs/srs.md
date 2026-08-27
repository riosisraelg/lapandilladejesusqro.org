# ISO/IEC/IEEE 29148:2018 Software Requirements Specification (SRS)

**System Name**: La Pandilla de Jesús — Querétaro Web Platform  
**Standard**: ISO/IEC/IEEE 29148:2018 (Systems and software engineering — Life cycle processes — Requirements engineering)  
**Document Version**: 1.0.0  
**Date**: 2026-08-27  
**Status**: Approved & Authoritative  

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) establishes the complete, rigorous, and verifiable requirements for the **La Pandilla de Jesús** web application (`lapandilladejesusqro.org`). It serves as the single source of truth for engineering development, automated opaque-box testing, quality assurance verification, and stakeholder acceptance.

### 1.2 Scope of the System
The platform is a progressive web application serving the Catholic youth community and parish of La Sagrada Familia in Querétaro, México. The system encompasses:
1. Daily Catholic Food Prayers deck (Domingo a Sábado, Antes y Después de las comidas) transcribed from the Roman *Bendicional*.
2. Interactive 3D deck carousel with auto-day selection, infinite continuous swiping, and dynamic brand color tone generation.
3. Complete Rosary overhaul featuring a 5-element mystery sequence, untruncated text, collapsible nested repeated prayers, dedicated sub-decks, and top-bar vibrating bead counter.
4. Standalone Mass Guide ("Guía de Misa") with complete priest/people dialogues, traditional Mexican sung liturgical responses, and an edge scraper fetching daily Mass readings.
5. Annual Jesus calendar integrating *Misas de Precepto* (Holy Days of Obligation per Canon 1246 and Mexican Episcopal Conference CEM), dynamic 1200x630px Open Graph social preview generation, deep-linked event modals, and universal multi-platform calendar export (.ics, Google, Apple, Outlook Web, Outlook Desktop, Yahoo).
6. Global usability enhancements including standardized 450ms long-press tooltips with haptic feedback.

### 1.3 Definitions, Acronyms and Abbreviations
- **CEM**: *Conferencia del Episcopado Mexicano* (Mexican Episcopal Conference).
- **Canon 1246**: The universal canon in the Code of Canon Law establishing Sundays and feast days of precept (Holy Days of Obligation).
- **Computus**: Mathematical algorithm calculating the astronomical date of Easter Sunday and dependent movable liturgical feasts.
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
2. **Parishioner / Parent**: Attends daily or Sunday Mass. Utilizes the Mass Guide for liturgical responses and checks the calendar for Misas de Precepto.
3. **Catechist / Group Leader**: Guides Rosary decades and community prayers. Requires doctrinal exactness, complete scripture readings, meditation texts, and reflection questions.

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
- **Input Schema**:
  ```typescript
  export type DayOfWeek = 'domingo' | 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'sabado';
  
  export interface MealPrayer {
    verse?: string;
    response?: string;
    prayer: string;
  }
  
  export interface FoodPrayerDay {
    id: string;
    day: DayOfWeek;
    dayName: string;
    before: MealPrayer;
    after?: MealPrayer;
    intro?: { title: string; citation: string; text: string };
  }
  ```
- **Acceptance Criteria**:
  - **AC-RF01-1**: Given the food prayers deck is loaded, all 7 days (Domingo to Sábado) are present with exact verbatim text matching the *Bendicional* transcription.
  - **AC-RF01-2**: Given any day of the week, the "Antes de las comidas" section contains both the versicle, response, and prayer.
  - **AC-RF01-3**: Given Sunday through Saturday, the "Después de las comidas" thanksgiving prayer is rendered with complete liturgical doxologies ("Por Jesucristo nuestro Señor. Amén" / "Tú que vives y reinas...").

---

### RF-02: Auto-Day Selection & Minimalist Deck Viewport
- **ID**: `RF-02`
- **Priority**: High | **Source**: `ORIGINAL_REQUEST.md §R2`
- **Description**: The food deck shall automatically detect the user's current day of the week and open directly to that day's meal prayer, while allowing manual swipe navigation to any other day.
- **Functional Specification**:
  1. Upon opening the Food Prayers deck, the system shall read `new Date().getDay()` (0=Domingo, 1=Lunes, ..., 6=Sábado).
  2. The initial active card index shall automatically match the current day of the week.
  3. The layout shall maximize screen space for prayer text, eliminating redundant margins and matching the minimalist Rosary viewport style.
- **Acceptance Criteria**:
  - **AC-RF02-1**: Given a user accesses the food prayers deck on a Thursday (day index 4), the active card displayed on initial mount is Thursday ("Jueves").
  - **AC-RF02-2**: Given the active card is initialized to the current day, the user can manually swipe left or right to inspect other days.

---

### RF-03: Infinite Continuous Swipe Animations (Decks)
- **ID**: `RF-03`
- **Priority**: High | **Source**: `ORIGINAL_REQUEST.md §R3`
- **Description**: The deck navigation shall utilize a clean, minimal swipe gesture operating in an infinite circular loop.
- **Functional Specification**:
  1. Swiping left past the last card/deck shall loop seamlessly to the first card/deck (`(index + 1) % totalCards`).
  2. Swiping right past the first card/deck shall loop seamlessly to the last card/deck (`(index - 1 + totalCards) % totalCards`).
  3. Dragging gestures shall apply live 3D transform tracking (`translate3d(dx, 0, 0) rotate(dx * 0.04deg)`).
  4. Drag releases exceeding `80px` delta or velocity threshold shall trigger card advancement with spring easing.
- **Acceptance Criteria**:
  - **AC-RF03-1**: Given the user is on the final card of a deck of size $N$, swiping left transitions smoothly to card index 0.
  - **AC-RF03-2**: Given the user is on card index 0, swiping right transitions smoothly to card index $N - 1$.
  - **AC-RF03-3**: Given a drag under 80px, the card springs back to the center position without changing index.

---

### RF-04: Dynamic Color Tone Engine (Decks)
- **ID**: `RF-04`
- **Priority**: Medium | **Source**: `ORIGINAL_REQUEST.md §R4`
- **Description**: The system shall dynamically calculate distinct tones and gradients of the primary brand color in code to visually distinguish decks.
- **Functional Specification**:
  1. Base brand color: Warm Catholic Coffee (`#5C3D2E`, HSL: 20°, 33%, 27%).
  2. For deck index $i$ in a set of size $M$, calculate dynamic card accent styles using HSL formula:
     $$\text{Hue} = (20 + i \times 12) \pmod{360}$$
     $$\text{Lightness} = 24\% + ((i \times 7) \pmod{22})\%$$
     $$\text{Saturation} = 30\% + ((i \times 5) \pmod{15})\%$$
  3. Compute card gradient background: `linear-gradient(135deg, hsl(H, S%, L%), hsl(H, S - 5%, L - 8%))`.
- **Acceptance Criteria**:
  - **AC-RF04-1**: Given two adjacent decks or cards, their rendered background/border accents have distinctly calculated HSL values.
  - **AC-RF04-2**: The contrast ratio between dynamically computed backgrounds and white text strictly meets or exceeds 4.5:1.

---

### RF-05: Global Long-Press Tooltip & Haptic System
- **ID**: `RF-05`
- **Priority**: Medium | **Source**: `ORIGINAL_REQUEST.md §R5`
- **Description**: Long-pressing any interactive button across the application shall display an informative description tooltip and trigger device haptic feedback.
- **Functional Specification**:
  1. All buttons declaring `data-tooltip="Text"` shall be wired to the long-press touch listener.
  2. Continuous touch hold for $\ge 450\text{ms}$ without scroll movement shall:
     - Invoke `navigator.vibrate([20])`.
     - Display the tooltip overlay immediately above/below the target element.
  3. Desktop devices shall support instant hover with a graceful 1.8s delay to avoid visual clutter during rapid pointer movement.
- **Acceptance Criteria**:
  - **AC-RF05-1**: Given a touch press held for 450ms on any interactive button, haptic vibration is dispatched and the tooltip element is made visible.
  - **AC-RF05-2**: Given a touch press that moves $> 10\text{px}$ (scrolling), the long-press timer is cancelled and no tooltip is shown.

---

### RF-06: Dynamic Event OG Image Generator & Shareable Deep-Linked Modals
- **ID**: `RF-06`
- **Priority**: High | **Source**: `ORIGINAL_REQUEST.md §R6`
- **Description**: The system shall dynamically generate high-resolution Open Graph preview images for calendar events and support unique deep-linked URLs that automatically open the event detail modal.
- **Functional Specification**:
  1. Edge Route `/api/og` shall generate a 1200x630px PNG image using `next/og` (`ImageResponse`).
  2. Input query parameters: `title`, `date`, `time`, `category`, `location`.
  3. Output: Branded Catholic preview banner featuring gold accents, community logo, category badge, and formatted date.
  4. Each event shall have a canonical deep-link URL: `/calendario?evento=[id]`.
  5. Visiting `/calendario?evento=[id]` shall mount the calendar page and automatically display the layered event detail modal.
- **Acceptance Criteria**:
  - **AC-RF06-1**: Given a `GET /api/og?title=Retiro+Espiritual` request, the server returns HTTP 200 with `Content-Type: image/png` and dimensions 1200x630px.
  - **AC-RF06-2**: Given a user visits `/calendario?evento=precepto-guadalupe`, the event modal for "Nuestra Señora de Guadalupe" opens immediately on load.

---

### RF-07: Rosary UI Overhaul, 5-Element Mystery Sequence & Top-Bar Vibrating Counter
- **ID**: `RF-07`
- **Priority**: High | **Source**: `ORIGINAL_REQUEST.md §R7`
- **Description**: The Rosary user interface shall be overhauled into a minimalist layout matching the site aesthetics, featuring complete 5-element mystery sequences, untruncated text, collapsible repeated prayers, dedicated sub-decks, and a top-bar vibrating bead counter.
- **Functional Specification**:
  1. **5-Element Mystery Sequence**: Each mystery card must render in exact sequential order:
     1. Mystery illustration artwork / icon.
     2. Biblical citation reference (e.g. *Lucas 1, 26-38*).
     3. Direct Scripture reading text.
     4. Doctrinal meditation text.
     5. Reflection question for personal meditation.
  2. **Dedicated Decks**:
     - *Opening Prayers Deck*: Señal de la Cruz, Acto de Contrición, Credo, Padre Nuestro, 3 Ave Marías (Fe, Esperanza, Caridad), Gloria.
     - *Mysteries Deck*: The 5 decades of the day.
     - *Concluding & Self-Prayers Deck*: Salve Regina, 3 Ave Marías finales, Letanías Lauretanas, Bajo tu Amparo, Bendición final.
  3. **Collapsible Nested Repeated Prayers**: In each mystery decade, the repeated prayers (1 Padre Nuestro, 10 Ave Marías, 1 Gloria, Jaculatorias de Fátima) shall be contained within an expandable/collapsible toggleable list.
  4. **Top-Bar Vibrating Counter**:
     - Positioned at the top header immediately adjacent to the modal close button ('X').
     - Displays current count: `0/10` to `10/10`.
     - Tapping increments count and triggers `navigator.vibrate([25])`. Reaching 10 resets or triggers decade completion vibration `[15, 30, 15]`.
- **Acceptance Criteria**:
  - **AC-RF07-1**: Every mystery across all 4 Rosary types (Gozosos, Dolorosos, Gloriosos, Luminosos) renders all 5 required elements without text truncation.
  - **AC-RF07-2**: The decade bead counter is rendered in the top header beside the close button, increments on tap, and invokes `navigator.vibrate`.
  - **AC-RF07-3**: Repeated prayers inside mystery cards can be collapsed and expanded with a single tap.

---

### RF-08: Mass Guide Standalone Module, Complete Liturgy & Daily Scraper
- **ID**: `RF-08`
- **Priority**: High | **Source**: `ORIGINAL_REQUEST.md §R8`
- **Description**: The Mass Guide shall become a standalone launcher button, expanded with complete Roman Missal dialogues (including priest private Communion prayers), traditional Mexican sung hymns, and an edge scraper fetching daily Mass readings.
- **Functional Specification**:
  1. The Mass Guide shall be accessible via a prominent standalone button in the navigation/hero, replacing the embedded tab section.
  2. Missing liturgical dialogues shall be fully added to `massResponses.ts`:
     - *Liturgia de la Palabra*: Monición, Primera Lectura, Salmo responsorial, Segunda Lectura, Aclamación del Evangelio (Aleluya), Proclamación del Evangelio, Credo Niceno/Apostólico, Oración Universal.
     - *Priest Private Communion Prayers*: Fracción del Pan (*"El Cuerpo y la Sangre de nuestro Señor Jesucristo..."*), Oración antes de comulgar (*"Señor Jesucristo, Hijo de Dios vivo..."*), Comunión del Sacerdote (*"El Cuerpo de Cristo me guarde..."*), Purificación de los vasos sagrados, y Oración después de la Comunión.
     - *Mexican Sung Hymns*: Gloria de Mejía, Santo tradicional mexicano, Cordero de Dios.
  3. **Edge Mass Readings Scraper** (`/api/mass-readings`):
     - Fetches and parses daily readings from Evangelizo XML feed (`http://feed.evangelizo.org/v2/reader.php?date=YYYYMMDD&lang=SP&type=xml`).
     - Extracts: Liturgical day, Saint of the day, Primera Lectura, Salmo Responsorial, Segunda Lectura, Santo Evangelio, and Patristic Meditation.
     - Implements Next.js caching (`revalidate: 86400`) and static offline fallback.
- **Acceptance Criteria**:
  - **AC-RF08-1**: Clicking the "Guía de Misa" standalone button opens the full Mass Guide modal.
  - **AC-RF08-2**: The Communion Rite section displays all priest private prayers and dialogues.
  - **AC-RF08-3**: The Liturgia de la Palabra section fetches and renders the live daily readings from `/api/mass-readings`.

---

### RF-09: Misas de Precepto Calendar Integration & Multi-Platform Export
- **ID**: `RF-09`
- **Priority**: High | **Source**: `ORIGINAL_REQUEST.md §R9`
- **Description**: The system shall compute and integrate all Holy Days of Obligation (*Misas de Precepto* per Canon 1246 and Mexican Episcopal Conference CEM) into the Jesus calendar, providing detailed event modals and universal multi-platform export.
- **Functional Specification**:
  1. Liturgical Computus Algorithm: Calculates Easter Sunday for any year and accurately projects all movable feasts:
     - Domingo de Ramos (Easter - 7 days).
     - Jueves Santo & Viernes Santo (Triduo Pascual).
     - Domingo de Pascua de la Resurrección.
     - Ascensión del Señor (Pascua + 42 días / VII Domingo).
     - Domingo de Pentecostés (Pascua + 49 días).
     - Santísima Trinidad (Pascua + 56 días).
     - Santísimo Cuerpo y Sangre de Cristo / Corpus Christi (Pascua + 60 / 63 días).
     - Sagrado Corazón de Jesús (Pascua + 68 días).
     - Jesucristo, Rey del Universo (Último domingo de Tiempo Ordinario).
  2. Fixed Holy Days:
     - 1 de Enero: Santa María, Madre de Dios (Precepto).
     - 6 de Enero: Epifanía del Señor.
     - 19 de Marzo: San José.
     - 29 de Junio: Santos Pedro y Pablo.
     - 15 de Agosto: Asunción de la Virgen María.
     - 1 de Noviembre: Todos los Santos.
     - 8 de Diciembre: Inmaculada Concepción.
     - 12 de Diciembre: Nuestra Señora de Guadalupe (Precepto Nacional en México).
     - 25 de Diciembre: Natividad del Señor - Navidad (Precepto).
  3. Multi-Platform Export Engine:
     - Google Calendar web template URL.
     - Apple Calendar / iOS direct `.ics` download / webcal.
     - Microsoft Outlook.com Web compose link.
     - Microsoft Outlook Desktop RFC 5545 `.ics` file.
     - Yahoo Calendar compose link.
- **Acceptance Criteria**:
  - **AC-RF09-1**: Given any target year, all fixed and movable Misas de Precepto are generated with correct dates and tagged with `isPrecepto: true`.
  - **AC-RF09-2**: Clicking "Agregar a Google Calendar" on any event opens a pre-populated Google Calendar event creation URL.
  - **AC-RF09-3**: Clicking "Descargar archivo iCal (.ics)" initiates a valid RFC 5545 `.ics` file download.

---

### RF-10: Autonomous Execution, Granular Git Commits, Semver Tagging & Remote Deployment
- **ID**: `RF-10`
- **Priority**: High | **Source**: `ORIGINAL_REQUEST.md §R10`
- **Description**: The development workflow shall execute autonomously, creating granular atomic git commits, assigning semantic version tags to each milestone commit, verifying 100% test passing, and pushing all branches/tags to the remote repository.
- **Functional Specification**:
  1. Granular commits following Conventional Commits format (`feat(module): description`).
  2. Semantic version tagging (`v1.0.0-m1.food-prayers`, `v1.0.0-m2.decks-swipe`, ..., `v1.0.0`).
  3. 100% automated opaque-box E2E test verification across all 5 test tiers before pushing.
- **Acceptance Criteria**:
  - **AC-RF10-1**: Git log contains granular, descriptive commits corresponding to each milestone.
  - **AC-RF10-2**: Git repository contains valid annotated/lightweight semantic version tags.
  - **AC-RF10-3**: Final release tag `v1.0.0` is pushed to remote origin.

---

## 4. Non-Functional Requirements (RNF)

| ID | Category | Requirement Specification | Measurement Metric |
|---|---|---|---|
| **RNF-01** | **Performance** | The application shall achieve sub-second initial load on standard 4G mobile networks. | FCP $\le 1.0\text{s}$, LCP $\le 1.8\text{s}$, CLS $= 0.00$. |
| **RNF-02** | **Animation Frame Rate** | 3D card deck dragging and swiping shall maintain smooth hardware-accelerated GPU rendering. | 60 FPS consistent with zero dropped frames. |
| **RNF-03** | **Usability** | The interface shall provide single-scroll containment, eliminating double-scroll jump bugs. | Modal container has `overflow: hidden`, inner card has `overflow-y: auto`. |
| **RNF-04** | **Accessibility** | All text, buttons, and dialogs shall comply with WCAG 2.1 Level AA standards. | Text contrast $\ge 4.5:1$, touch targets $\ge 44 \times 44\text{px}$, full keyboard navigation. |
| **RNF-05** | **Internationalization** | All UI copy and prayer texts shall maintain authentic Spanish Catholic liturgical phrasing, with English support for universal prayers. | 100% translation completeness in bilingual prayer cards. |
| **RNF-06** | **Reliability & Resilience** | The daily Mass readings scraper and Google Calendar integration shall gracefully fall back to local data when offline. | Zero unhandled exceptions; fallback UI rendered seamlessly. |
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
  image: string; // SVG icon identifier or asset path
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

### 5.3 Daily Mass Readings API Schema
```typescript
export interface DailyMassReadings {
  date: string; // YYYY-MM-DD
  liturgicalDay: string;
  saint?: string;
  firstReading: {
    citation: string;
    text: string;
  };
  psalm: {
    citation: string;
    response: string;
    text: string;
  };
  secondReading?: {
    citation: string;
    text: string;
  };
  gospel: {
    citation: string;
    text: string;
  };
  meditation?: {
    author: string;
    text: string;
  };
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
