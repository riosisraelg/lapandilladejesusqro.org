# Comprehensive Inventory & Structural Survey of Modals, Drawers, and Overlays

- **Agent**: Explorer 1 (Modal Inventory & Structure)
- **Target Project**: Next.js (App Router) — `lapandilladejesusqro.org`
- **Date**: 2026-09-10T17:28:00Z
- **Status**: Complete Inventory & Structural Analysis

---

## 1. Observation

### 1.1 Codebase Scope and Inventory Summary
Across the entire `src/` tree (35 scanned files), there are **9 distinct modal/overlay instances** categorized under 3 structural archetypes:
1. **GlobalModal Instances (5 in `LandingClient.tsx`, 2 in `CalendarioClient.tsx`)**: All mounted via the shared `GlobalModal` component (`src/components/GlobalModal.tsx`).
2. **Mobile Navigation Drawer Overlays (2 instances: `LandingClient.tsx` and `CalendarioClient.tsx`)**: Full-screen slide-down drawer overlays for mobile navigation.
3. **Internal Full-Screen Readers / Kinetic Overlays (2 instances inside GlobalModal: `AppleMusicLyrics.tsx`)**: Rendered inside Cancionero and Interactive Mass Guia.

Crucially, **no React Portals (`createPortal`) are used anywhere in the codebase**. Every modal and overlay is rendered inline conditionally within the React tree and relies on CSS `position: fixed`.

---

### 1.2 Core Shared Modal Wrapper: `GlobalModal`
- **File**: `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/src/components/GlobalModal.tsx` (Lines 1–53)
- **Mounting Mechanism**: Conditional inline rendering:
  ```tsx
  // src/components/GlobalModal.tsx:23
  if (!isOpen) return null;
  ```
- **DOM Hierarchy**:
  ```tsx
  // src/components/GlobalModal.tsx:26-51
  <div className="calendar-modal-overlay" onClick={onClose}>
    <div 
      className={`recursos-modal-card modal-large ${className}`} 
      style={style}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="global-modal-header-actions">
        {headerAction}
        {!hideCloseBtn && (
          <button 
            type="button"
            className="calendar-modal-close-btn" 
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        )}
      </div>
      {children}
    </div>
  </div>
  ```
- **Outer Wrapper CSS (`calendar-modal-overlay`)**:
  - `src/app/global.css:1944-1961`:
    ```css
    .calendar-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100dvh; /* Use dvh for mobile browsers */
      background: rgba(45, 27, 14, 0.45);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 1000;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      animation: modalOverlayFadeIn 0.28s ease forwards;
      padding: 0;
      overscroll-behavior: contain;
    }
    ```
  - `src/app/global.css:3501-3510` (Responsive override for `<= 1024px`):
    ```css
    @media (max-width: 1024px) {
      .calendar-modal-overlay {
        display: flex;
        flex-direction: column;
        justify-content: flex-end; /* Align bottom sheet to screen bottom */
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        overscroll-behavior: contain; /* Prevents background scroll chaining */
        padding: 0 !important; /* Edge-to-edge modal width */
      }
    ```
- **Inner Card CSS (`recursos-modal-card modal-large`)**:
  - `src/app/global.css:2833-2851`:
    ```css
    .recursos-modal-card {
      background: var(--white);
      border: 1px solid var(--border-subtle);
      border-radius: 24px 24px 0 0;
      width: 100%;
      max-width: 680px;
      height: calc(100dvh - 2.5rem);
      max-height: calc(100dvh - 2.5rem);
      display: flex;
      flex-direction: column;
      padding: 1.5rem 1.75rem 2rem 1.75rem;
      box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.15);
      position: relative;
      animation: modalSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      overflow: hidden;
      text-align: left;
      overscroll-behavior: contain;
      margin: 0 auto;
    }
    ```
  - `src/app/global.css:3567-3579` (Mobile override):
    ```css
    .recursos-modal-card.modal-large {
      height: calc(100dvh - 2rem); /* Occupy full space minus top gap */
      max-height: calc(100dvh - 2rem);
      width: 100%;
      max-width: 100%;
      border-radius: 24px 24px 0 0; /* Rounded top, flat bottom */
      margin: 0;
      padding: 1.25rem 1.25rem 2rem 1.25rem;
      box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.15);
      overscroll-behavior: contain;
      transform-origin: bottom center;
      animation: modalSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    ```
  - Mobile card height conflict at `src/app/global.css:3592-3595`:
    ```css
    .recursos-modal-card {
      padding: 1.5rem 1rem;
      max-height: 90vh;
    }
    ```
- **Slide Up Animation**:
  - `src/app/global.css:2402-2411`:
    ```css
    @keyframes modalSlideUp {
      0% {
        transform: translateY(100vh);
        opacity: 0.6;
      }
      100% {
        transform: translateY(0);
        opacity: 1;
      }
    }
    ```

---

### 1.3 Detailed Modal Inventory

#### Modal 1: Cancionero Modal (Horas Santas)
- **Component & File**: `<GlobalModal>` in `src/app/LandingClient.tsx:2325-2340`
- **Mounting**: Conditional inline rendering controlled by `showCancionero` (URL parameter `?modal=cancionero`).
- **Outer Wrapper Elements & Styling**:
  - `.calendar-modal-overlay` (fixed, top 0, left 0, width 100vw, height 100dvh, z-index 1000).
  - Inner Card: `.recursos-modal-card.modal-large.apple-music-mode`.
  - Class override (`src/app/global.css:3759-3766`):
    `background: transparent; color: #fff; border: none; box-shadow: none; padding: 0; overflow: hidden;`
  - `hideCloseBtn={true}` (defers close button to inner component).
- **Header Structure**:
  - Rendered by child component `AppleMusicLyrics` (`src/app/AppleMusicLyrics.tsx:240-283`).
  - `.lyric-header`: `position: absolute; top: 0; left: 0; right: 0; padding: 1rem 1.25rem; z-index: 50; display: flex; justify-content: space-between; align-items: center;`
  - Left: `.lyric-header-title-wrap` > `.lyric-title` (Song title) + `.lyric-subtitle` (Author / song index).
  - Right: `.lyric-header-actions` > `.lyric-nav-arrows` (Previous ◀ / Next ▶) + `.apple-music-close-btn` (✕ button).
- **Body Structure**:
  - Dynamic background backdrop: `.lyric-modal-backdrop` (`src/app/global.css:3664-3687`, `position: absolute; inset: 0; z-index: -1;`).
  - Scrollable lyric container: `.lyric-scroll-container` (`src/app/AppleMusicLyrics.tsx:285-315`, `src/app/global.css:3695-3704`):
    `overflow-y: auto; padding: calc(85px + 6vh) 1.5rem 50vh 1.5rem; -webkit-overflow-scrolling: touch;`
  - Typography lines: `.lyric-line`, `.lyric-section-title`.
- **Footer Structure**:
  - None (all controls contained in sticky header).

---

#### Modal 2: Oraciones Modal (Santo Rosario, Alimentos, Básicas, Comunidad)
- **Component & File**: `<GlobalModal>` in `src/app/LandingClient.tsx:2343-2677`
- **Mounting**: Conditional inline rendering controlled by `showOraciones` (URL parameter `?modal=oraciones`).
- **Outer Wrapper Elements & Styling**:
  - `.calendar-modal-overlay` (fixed, z-index 1000).
  - Inner Card: `.recursos-modal-card.modal-large.deck-modal-layout` (`src/app/global.css:3010-3024`):
    `display: flex; flex-direction: column; overflow: hidden !important; padding: 0 !important; height: min(92dvh, 880px); max-height: min(92dvh, 880px);`
- **Header Structure**:
  - `headerAction`: `.oracion-lang-toggle-btn` (ES/EN toggle) + `.rosario-top-counter-btn` (bead counter `📿 X/10` if rosary deck) + `.calendar-modal-close-btn` (✕).
  - `.oracion-top-bar` (`src/app/LandingClient.tsx:2400-2475`):
    - `.mobile-drag-handle` (`src/app/global.css:3546-3565`)
    - `.oracion-deck-switcher-new`: Left/Right deck navigation arrows, Deck Title, Deck dots indicator.
    - If Rosary: Mystery pill selectors (Gozosos, Luminosos, Dolorosos, Gloriosos) and duration selector (Corto / Tradicional).
- **Body Structure**:
  - `.recursos-modal-body` (`src/app/global.css:3026-3035`, `flex: 1 1 0% !important; min-height: 0; overflow: hidden;`):
    - `.stacked-deck-container` (`src/app/global.css:2995-3005`, `3586-3590`): 3D perspective deck container (`height: 60vh;` desktop, `height: 72vh;` mobile).
    - Contains stacked swipe cards (`.stacked-card.active`, `.stacked-card.next`, `.stacked-card.next-behind`).
    - Inside active card: Mystery Artwork SVG (`MysteryArtworkIcon`), step badge, prayer title, prayer text, fruit badge.
    - Alternative mode: `.oracion-card-body-text` (scrollable text for long prayers).
- **Footer Structure**:
  - `.deck-nav` (`src/app/LandingClient.tsx:2659-2675`):
    - Left button: `.deck-nav-btn` (◀ Anterior / Previous).
    - Center counter: `.deck-counter` (e.g. "3 de 15").
    - Right button: `.deck-nav-btn` (Siguiente / Next ▶).

---

#### Modal 3: Guía de Misa Tradicional Modal (Ordinario y Lecturas del Día)
- **Component & File**: `<GlobalModal>` in `src/app/LandingClient.tsx:2680-3056`
- **Mounting**: Conditional inline rendering controlled by `showGuiaMisa` (URL parameter `?modal=guia`).
- **Outer Wrapper Elements & Styling**:
  - `.calendar-modal-overlay` (fixed, z-index 1000).
  - Inner Card: `.recursos-modal-card.modal-large` with inline `style={{ maxWidth: '650px' }}`.
- **Header Structure**:
  - Top-right close button `.calendar-modal-close-btn`.
  - `.oracion-top-bar` (`src/app/LandingClient.tsx:2687-2714`):
    - Section navigation arrows: ◀ (`handlePrevGuia`) and ▶ (`handleNextGuia`).
    - Title row: Section title (e.g., "Liturgia de la Palabra") and indicator `• 2/5`.
- **Body Structure**:
  - `.recursos-modal-body` (`src/app/global.css:2857-2862`, `overflow-y: auto; flex-grow: 1; padding-right: 0.5rem;`):
    - Tab 1 (`lecturas`): Dynamic daily readings scraper output (`fetchDailyReadings`), liturgical day, saint badge, First Reading, Psalm with refrain, Second Reading, Gospel.
    - Tab 2 (`intro`): Ritos Iniciales (Entrada, Saludo, Acto Penitencial, Señor Ten Piedad, Gloria, Oración Colecta).
    - Tab 3 (`palabra`): Liturgia de la Palabra dialogues, Creed, Prayers of the Faithful.
    - Tab 4 (`eucaristia`): Liturgia Eucarística (Ofertorio, Plegaria II, Santo, Consagración, Padre Nuestro, Paz, Cordero, Comunión).
    - Tab 5 (`conclusion`): Ritos de Conclusión & Calendario de Misas de Precepto Obligatorio.
- **Footer Structure**:
  - No pinned footer (navigation is handled in header top bar).

---

#### Modal 4: Guía de Confesión Modal
- **Component & File**: `<GlobalModal>` in `src/app/LandingClient.tsx:3059-3334`
- **Mounting**: Conditional inline rendering controlled by `showConfesion` (URL parameter `?modal=confesion`).
- **Outer Wrapper Elements & Styling**:
  - `.calendar-modal-overlay` (fixed, z-index 1000).
  - Inner Card: `.recursos-modal-card.modal-large.confesion-modal-layout` (`src/app/global.css:4273-4287`):
    `display: flex; flex-direction: column; overflow: hidden !important; padding: 1.15rem 1.25rem 1rem 1.25rem; height: min(92dvh, 880px); max-height: min(92dvh, 880px); max-width: 820px;`
- **Header Structure**:
  - `headerAction`: `.oracion-lang-toggle-btn` (🇲🇽 ES / 🇺🇸 EN) + `.calendar-modal-close-btn`.
  - `.oracion-top-bar` (`src/app/LandingClient.tsx:3085-3120`):
    - Section navigation arrows: ◀ (`handlePrevConfesion`) and ▶ (`handleNextConfesion`).
    - Title row: Section title (e.g. "5 Pasos", "10 Mandamientos") and indicator `• X/6`.
  - `.confesion-tab-switcher-bar` (`src/app/LandingClient.tsx:3122-3150`):
    - Horizontally scrollable pill tabs: 5 Pasos, 10 Mandamientos, Iglesia, Pecados Capitales, Oraciones, Todo.
- **Body Structure**:
  - `.confesion-modal-body` (`src/app/global.css:4336`, `overflow-y: auto;`):
    - Step 1: 5 Pasos explicados.
    - Step 2: Examen de conciencia detallado con preguntas interactivas por cada mandamiento.
    - Step 3: Mandamientos de la Iglesia.
    - Step 4: 7 Pecados Capitales, definiciones y manifestaciones.
    - Step 5: Oraciones del Penitente (Acto de Contrición, Salmo 50 Miserere, Acción de Gracias).
    - Step 6: Modo Todo.
- **Footer Structure**:
  - `.confesion-seal` (`src/app/LandingClient.tsx:3329-3332`):
    - Ecclesiastical seal card: `<span className="seal-cross">✠</span><p>{CONFESION_DATA.sello[activeLang]}</p>`.

---

#### Modal 5: Guía de Misa Apple Music Style (Interactive Kinetic Mass Mode)
- **Component & File**: `<GlobalModal>` in `src/app/LandingClient.tsx:3337-3362`
- **Mounting**: Conditional inline rendering controlled by `showAppleMusicGuia` (URL parameter `?modal=guia_misa_interactiva`).
- **Outer Wrapper Elements & Styling**:
  - `.calendar-modal-overlay` (fixed, z-index 1000).
  - Inner Card: `.recursos-modal-card.modal-large.apple-music-mode`.
  - `hideCloseBtn={true}`.
- **Header Structure**:
  - Rendered inside `AppleMusicLyrics` (`src/app/AppleMusicLyrics.tsx:240-283`):
    - `.lyric-header`: Fixed/sticky top gradient bar (`z-index: 50;`).
    - Title: "Guía de Misa".
    - Subtitle: Dynamic section title + progress + offline indicator.
    - Language switcher: `.lang-toggle-btn` (🇺🇸 English / 🇲🇽 Español).
    - Section nav: ◀ / ▶ arrows (`handleMisaNav`).
    - Close button: `.apple-music-close-btn` (✕).
- **Body Structure**:
  - `.lyric-modal-backdrop`: Dynamic gradient backdrop.
  - `.lyric-scroll-container` (`src/app/AppleMusicLyrics.tsx:285-315`):
    - Dynamic kinetic text lines (`getCanonicalMassLines(...)`).
    - IntersectionObserver triggers dynamic URL update (`onSectionChange`) for deep-linking.
    - Duet lines: `.duet-left` (Celebrante / Sacerdote), `.duet-right` (Asamblea / Pueblo).
- **Footer Structure**:
  - None.

---

#### Modal 6: Add to Calendar / Event Details Modal (Google Calendar Style)
- **Component & File**: `<GlobalModal>` in `src/app/calendario/CalendarioClient.tsx:965-1105`
- **Mounting**: Conditional inline rendering controlled by `isOpen={!!selectedEvent}`.
- **Outer Wrapper Elements & Styling**:
  - `.calendar-modal-overlay` (fixed, z-index 1000).
  - Inner Card: `.recursos-modal-card.modal-large` (no extra class passed).
- **Header Structure**:
  - Close button `.calendar-modal-close-btn` (top right).
  - `.gcal-title-row` (`src/app/calendario/CalendarioClient.tsx:974-986`):
    - Event Title: `.gcal-event-title`.
    - Date and time: `.gcal-event-datetime`.
    - Recurrence badge: `.gcal-event-recurrence` (e.g. "✝ Misa de Precepto Obligatorio").
- **Body Structure**:
  - Nested wrapper: `.gcal-modal-wrapper` (`src/app/global.css:2226-2233`, `display: flex; flex-direction: column; height: 100%; overflow: hidden;`).
  - `.gcal-scrollable-body` (`src/app/global.css:2235-2244`, `flex: 1 1 auto; overflow-y: auto; overscroll-behavior: contain;`):
    - Location row: Pin icon + Google Maps link (`.gcal-location-link`).
    - Description row: Notes icon + clean text description (`cleanDescription`).
    - Calendar source row: Calendar icon + link to official calendar.
- **Footer Structure**:
  - `.gcal-actions-section.gcal-actions-pinned` (`src/app/global.css:2274-2291`, `src/app/calendario/CalendarioClient.tsx:1049-1103`):
    - Sticky bottom actions bar (`position: sticky; bottom: 0; z-index: 10; background: var(--white);`).
    - 4 calendar export buttons in `.gcal-actions-grid`: Google Calendar, Outlook Web, Yahoo Calendar, Apple / iCal (.ics download).
    - Share link button: `.gcal-share-btn` (copies URL to clipboard).

---

#### Modal 7: Subscribe to Calendar Feed Modal (iCal / Webcal)
- **Component & File**: `<GlobalModal>` in `src/app/calendario/CalendarioClient.tsx:1108-1156`
- **Mounting**: Conditional inline rendering controlled by `showSubscribeModal`.
- **Outer Wrapper Elements & Styling**:
  - `.calendar-modal-overlay` (fixed, z-index 1000).
  - Inner Card: `.recursos-modal-card.modal-large`.
- **Header Structure**:
  - Close button `.calendar-modal-close-btn` (top right).
  - Title: `.calendar-modal-title` ("Suscribirse al Calendario").
  - Description: `.calendar-modal-desc` ("Sincroniza todos los eventos de La Pandilla de Jesús en tu dispositivo...").
- **Body Structure**:
  - `.recursos-modal-body` (`src/app/calendario/CalendarioClient.tsx:1112-1155`):
    - Google Calendar web link button (`.calendar-btn-google`).
    - Apple Calendar / Outlook webcal button (`.calendar-btn-ical`).
    - Copy iCal Link button (`.calendar-btn-outlook`).
- **Footer Structure**:
  - None.

---

#### Overlay 8: Mobile Navigation Menu Overlay (Landing Page)
- **Component & File**: `<div className="nav-mobile-overlay">` in `src/app/LandingClient.tsx:1355-1522`
- **Mounting**: Inline DOM child inside `<nav className="nav">` (`src/app/LandingClient.tsx:1310`), toggled by adding class `.open` when `mobileMenuOpen === true`.
- **Outer Wrapper Elements & Styling**:
  - `.nav-mobile-overlay` (`src/app/global.css:201-226`):
    ```css
    .nav-mobile-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh; /* PITFALL: Raw 100vh on mobile */
      background: rgba(250, 247, 242, 0.98);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      z-index: 95;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      overflow-y: auto;
      padding: 5.5rem 1.25rem 3rem 1.25rem;
      opacity: 0;
      pointer-events: none;
      transform: translateY(-100%);
      transition: all 0.45s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .nav-mobile-overlay.open {
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0);
    }
    ```
- **Header Structure**:
  - Controlled by the fixed navbar `<nav className="nav">` (`position: fixed; top: 0; width: 100%; z-index: 100;`).
  - Mobile hamburger toggle button `.nav-mobile-btn` has `z-index: 110;`.
- **Body Structure**:
  - `.nav-mobile-content`:
    - Section 1 (`.nav-mobile-section`): Navigation links (Inicio, Eventos, Donaciones).
    - Section 2 (`.nav-mobile-section`): Shortcuts to interactive modals (Guía de Misa, Santo Rosario, Bendición de Alimentos, El Ángelus, Cancionero, Guía de Confesión).
    - Section 3 (`.nav-mobile-footer-section`): Social icons (Instagram, Threads, Facebook) and Community WhatsApp button (`.nav-mobile-cta-wa`).
- **Footer Structure**:
  - Integrated inside Section 3.

---

#### Overlay 9: Mobile Navigation Menu Overlay (Calendario Page)
- **Component & File**: `<div className="nav-mobile-overlay">` in `src/app/calendario/CalendarioClient.tsx:509-661`
- **Mounting**: Inline DOM child inside `<nav className={"nav " + (mobileMenuOpen ? "nav-expanded" : "")}>`.
- **Outer Wrapper Elements & Styling**:
  - Uses the exact same `.nav-mobile-overlay` rules from `src/app/global.css:201-226`.
- **Header Structure**:
  - Fixed navbar header with logo and hamburger button.
- **Body Structure**:
  - `.nav-mobile-content`: Pages links, modal links to Landing (`/?modal=guia`, `/?modal=oraciones`, etc.), social links, WhatsApp CTA.
- **Footer Structure**:
  - Integrated inside Section 3.

---

### 1.4 Background Scroll Lock Observation
In `src/app/LandingClient.tsx:901-914`:
```tsx
useEffect(() => {
  if (showCancionero || showOraciones || showGuiaMisa || showConfesion || showAppleMusicGuia) {
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
  } else {
    document.body.style.overflow = '';
    document.body.classList.remove('modal-open');
  }
  return () => {
    document.body.style.overflow = '';
    document.body.classList.remove('modal-open');
  };
}, [showCancionero, showOraciones, showGuiaMisa, showConfesion, showAppleMusicGuia]);
```
- In `src/app/calendario/CalendarioClient.tsx`: **No body scroll lock is implemented**. Neither `document.body.style.overflow = 'hidden'` nor `modal-open` is invoked when `selectedEvent` or `showSubscribeModal` is active.

---

## 2. Logic Chain

1. **Premise 1 (Symptom Reported)**: Modals render incorrectly on actual physical mobile devices (appearing cut off and scrolled to the top, revealing only the bottom of the modal and a large portion of the page behind it). This does not replicate by simple desktop browser resizing.
2. **Premise 2 (Flex Alignment in Overlay)**: Observation 1.2 shows that `.calendar-modal-overlay` in `src/app/global.css:1956` and `3505` specifies:
   `justify-content: flex-end; align-items: center;`
   In flexbox column layout, `justify-content: flex-end` anchors the modal card to the very bottom of the flex container.
3. **Premise 3 (Mobile Viewport Units & Dynamic URL Bars)**: 
   - `.calendar-modal-overlay` uses `width: 100vw; height: 100dvh;` with `position: fixed; top: 0; left: 0;`.
   - On mobile Safari and Android Chrome, the browser address bar dynamically resizes. `100dvh` constantly recalculates when bars retract/expand.
   - When combined with `justify-content: flex-end` and a card height of `calc(100dvh - 2rem)` or `min(92dvh, 880px)`, the card is pushed to the bottom. If the browser's dynamic viewport calculation is offset by the address bar or body scrolling, the top part of the card (the header, drag handle, and close button) is pushed upward off-screen, or the bottom sheet sticks to the bottom while the top is clipped.
   - Conversely, if the requirement is: *"Ensure modals display fully centered and correctly sized on mobile browsers"*, having `justify-content: flex-end` directly violates the centering requirement and causes the bottom-sheet anchoring behavior.
4. **Premise 4 (Animation Units)**:
   Observation 1.2 shows that `@keyframes modalSlideUp` and `scaleInModal` (`src/app/global.css:2402-2432`) use `transform: translateY(100vh)`. On mobile, `100vh` exceeds the visible viewport when address bars are visible, which causes animation translation glitches on mobile WebKit.
5. **Premise 5 (iOS Safari Scroll Chaining & Lack of Fixed Body Lock)**:
   Observation 1.4 shows `document.body.style.overflow = 'hidden'`. On iOS Safari, setting `overflow: hidden` on `<body>` does not prevent viewport rubber-banding or background page scrolling unless `position: fixed; width: 100%; top: -scrollY` is used or touch gestures are constrained. When the background page scrolls beneath the modal, the visual viewport coordinate system shifts, causing the modal to appear scrolled away.
6. **Conclusion of Logic Chain**: The modal inventory reveals that all modals share a single wrapper (`GlobalModal`) and single overlay CSS class (`.calendar-modal-overlay`). Fixing the viewport sizing, centering, positioning, and mobile CSS rules on `.calendar-modal-overlay` and `.recursos-modal-card` will simultaneously resolve the bug across all 7 modals in the application.

---

## 3. Caveats

1. **No Source Code Modifications**: As Explorer 1 (investigator role), no files in `src/` were modified.
2. **Device-Specific Emulation**: Pure desktop viewport resizing cannot replicate dynamic mobile browser chrome (address bar collapsing on iOS/Android). Analysis is based on CSS specifications and known WebKit/Blink mobile viewport behaviors.
3. **Desktop Intent**: The desktop version of `.calendar-modal-overlay` also had `justify-content: flex-end`. Any change to center modals on mobile (`justify-content: center`) should verify whether desktop was intended to be centered or bottom-anchored.

---

## 4. Conclusion

1. **Total Count**: There are **9 modal/overlay structures** across 2 pages (`LandingClient.tsx` and `CalendarioClient.tsx`):
   - 5 Recursos Modals on Landing: Cancionero, Oraciones, Guía de Misa Tradicional, Guía de Confesión, Guía de Misa Apple Music Style.
   - 2 Modals on Calendario: Event Details (Google Calendar Style), Subscribe to Calendar Feed.
   - 2 Mobile Navigation Overlays: One in Landing, one in Calendario.
2. **Single Point of Architecture**: All 7 dialog modals use `<GlobalModal>` (`src/components/GlobalModal.tsx`) with `.calendar-modal-overlay` and `.recursos-modal-card`. They are rendered inline without React Portals.
3. **Root Causes of Mobile Cut-off / Clipping**:
   - `justify-content: flex-end` in `.calendar-modal-overlay` (`src/app/global.css:1956, 3505`) forcing modals to bottom-sheet mode.
   - Use of `height: 100dvh` / `width: 100vw` instead of canonical `inset: 0` for `position: fixed`.
   - `100vh` used in animations (`modalSlideUp`, `modalSlideDown`) and in `.nav-mobile-overlay`.
   - Conflicting `max-height: 90vh` in `.recursos-modal-card` (`src/app/global.css:3594`) overriding `dvh` settings.
   - Lack of robust iOS scroll-locking on `body`.

---

## 5. Verification Method

### How to Independently Verify

1. **Inspect `GlobalModal.tsx`**:
   `view_file` at `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/src/components/GlobalModal.tsx` lines 1 to 53 to verify props, conditional rendering, and wrapper elements.
2. **Inspect Overlay & Card CSS**:
   `view_file` at `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/src/app/global.css`:
   - Lines 1944–1978: `.calendar-modal-overlay` and `.calendar-modal-card`
   - Lines 2402–2433: `@keyframes modalSlideUp`
   - Lines 2833–2863: `.recursos-modal-card`
   - Lines 3010–3035: `.recursos-modal-card.deck-modal-layout`
   - Lines 3501–3611: `@media (max-width: 1024px)` responsive modal styles
   - Lines 4273–4288: `.recursos-modal-card.confesion-modal-layout`
3. **Run Project Build & Typecheck**:
   Run `npm run build` or `npx tsc --noEmit` from the workspace root to confirm TypeScript and Next.js project integrity:
   ```bash
   cd /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org && npm run build
   ```
4. **Invalidation Condition**:
   If another modal is introduced outside `GlobalModal` or `nav-mobile-overlay`, or if a React Portal root (`<div id="modal-root">`) is added, this inventory would need to be updated.
