# Handoff Report: Scroll Containment, Overflow Handling & Mobile Body Locking
**Explorer Agent**: Explorer 3 (Scroll Containment & Body Locking)  
**Date**: 2026-09-10  
**Target File**: `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/explorer_survey_3/handoff.md`  

---

## 1. Observation

### 1.1 Page Scrolling & Mobile Body Locking Implementation
1. **Body Locking in `LandingClient.tsx` (Lines 901–914)**:
   ```tsx
   // Lock body scroll when any modal is open to prevent background scrolling
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
   - Only sets `document.body.style.overflow = 'hidden'`.
   - Does NOT store or restore `window.scrollY`.
   - Does NOT set `position: fixed` or `top: -${scrollY}px` on `body`.
   - Does NOT set `touch-action: none` on `body` or `.calendar-modal-overlay`.
   - Does NOT set `overscroll-behavior: none` or `overscroll-behavior-y: contain` on `html` or `body`.

2. **Inert `body.modal-open` CSS in `src/app/global.css` (Lines 2633–2638)**:
   ```css
   /* Ocultar todos los tooltips cuando un modal está abierto para evitar que floten sobre el overlay */
   body.modal-open [data-tooltip]::before,
   body.modal-open [data-tooltip]::after {
     display: none !important;
     opacity: 0 !important;
     visibility: hidden !important;
     pointer-events: none !important;
   }
   ```
   - The class `.modal-open` applied to `body` contains ZERO CSS rules controlling `overflow`, `position`, `height`, `overscroll-behavior`, or `touch-action`.

3. **Complete Absence of Body Locking in `CalendarioClient.tsx`**:
   - `src/app/calendario/CalendarioClient.tsx` instantiates `<GlobalModal>` twice (Lines 965 and 1108) for event details:
     ```tsx
     <GlobalModal
       isOpen={!!selectedEvent}
       onClose={() => setSelectedEvent(null)}
     >
     ```
   - There is NO `useEffect` managing `document.body.style.overflow`, NO `classList.add('modal-open')`, and NO scroll locking whatsoever in `CalendarioClient.tsx`.

4. **Root HTML & Body Base CSS in `src/app/global.css` (Lines 40–62)**:
   ```css
   * { box-sizing: border-box; margin: 0; padding: 0; }
   html { scroll-behavior: smooth; }
   ...
   body.landing-body {
     ...
     overflow-x: hidden;
     -webkit-font-smoothing: antialiased;
   }
   ```
   - `html` has `scroll-behavior: smooth;`.
   - `body.landing-body` has `overflow-x: hidden;`. In WebKit, when `overflow-x: hidden` is combined with inline `overflow: hidden`, WebKit forces an internal scroll container recalculation.

---

### 1.2 Modal Overlay, Structure, and Positioning
1. **Modal Overlay CSS in `src/app/global.css` (Lines 1944–1961 & 3501–3510)**:
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
   Under `@media (max-width: 1024px)`:
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
   - `.calendar-modal-overlay` has `display: flex; flex-direction: column; justify-content: flex-end; align-items: center;`.
   - It does NOT have `overflow-y: auto`.
   - It uses `width: 100vw; height: 100dvh;` rather than `inset: 0; width: 100%; height: 100%;`.

2. **Modal Card Sizing in `src/app/global.css` (Lines 2833–2851 & 3567–3595)**:
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
   Under `@media (max-width: 1024px)`:
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
     overscroll-behavior: contain; /* Prevents background scroll chaining */
     transform-origin: bottom center;
     animation: modalSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
   }

   .stacked-deck-container {
     height: 72vh; /* Cards container expanded to occupy saved vertical space */
     min-height: 480px;
     max-height: 700px;
     margin: 0.5rem auto 1rem auto;
   }

   .recursos-modal-card {
     padding: 1.5rem 1rem;
     max-height: 90vh;
   }
   ```
   - Specifying `height: calc(100dvh - 2rem)` alongside fixed inner heights (such as `min-height: 480px` on `.stacked-deck-container` plus headers, controls, and safe-area padding) exceeds the dynamic mobile viewport on devices under 700px height.
   - Cascading order conflict: `.recursos-modal-card { max-height: 90vh; }` appears at line 3594, mixing `vh` and `dvh` units.

---

### 1.3 Modal Internal Scrolling & Overscroll Containment
1. **`AppleMusicLyrics.tsx` (Cancionero & Interactive Mass Guide)**:
   - Line 285: `<div className="lyric-scroll-container" ref={containerRef}>`
   - In `src/app/global.css` (Lines 3695–3707):
     ```css
     .lyric-scroll-container {
       height: 100%;
       overflow-y: auto;
       padding: calc(85px + 6vh) 1.5rem 50vh 1.5rem;
       width: 100%;
       max-width: 800px;
       margin: 0 auto;
       scrollbar-width: none;
       -ms-overflow-style: none;
       scroll-behavior: smooth;
       position: relative;
       z-index: 1;
     }
     ```
     - `overscroll-behavior: contain` is **completely missing**.
     - Line 226 in `AppleMusicLyrics.tsx`:
       ```tsx
       targetEl.scrollIntoView({ behavior: 'auto', block: 'center' });
       ```
       In mobile Safari, calling `Element.scrollIntoView()` on an element inside a modal forces the entire document/window to scroll to center that element, scrolling the background page out of place.

2. **Guía de Misa (Traditional Modal, `LandingClient.tsx:2716`)**:
   - Element: `<div className="recursos-modal-body">`
   - In `src/app/global.css` (Lines 2857–2862):
     ```css
     .recursos-modal-body {
       overflow-y: auto;
       margin-top: 0.75rem;
       padding-right: 0.5rem;
       flex-grow: 1;
     }
     ```
     - `min-height: 0` is **missing**. In Flexbox, flex items default to `min-height: auto`. When child content is tall, without `min-height: 0`, the flex child overflows rather than shrinking to fit and scrolling internally.
     - `overscroll-behavior: contain` is **missing**.
     - No initial scroll reset: reopening this modal leaves the scroll position at the previous scroll offset.

3. **Guía de Confesión Modal (`LandingClient.tsx:3125`)**:
   - Element: `<div className="confesion-modal-body">`
   - In `src/app/global.css` (Lines 4334–4339):
     ```css
     .confesion-modal-body {
       flex: 1 1 0%;
       overflow-y: auto;
       padding: 0.85rem 0.25rem 1.5rem;
       scrollbar-width: thin;
     }
     ```
     - `min-height: 0` is **missing** (only `flex: 1 1 0%` is declared, which leaves `min-height: auto` active in WebKit/Firefox).
     - `overscroll-behavior: contain` is **missing**.
     - No initial scroll reset.

4. **Calendario Event Modal (`CalendarioClient.tsx:972`)**:
   - Element: `<div className="gcal-scrollable-body">`
   - In `src/app/global.css` (Lines 2235–2244):
     ```css
     .gcal-scrollable-body {
       flex: 1 1 auto;
       overflow-y: auto;
       padding-right: 0.35rem;
       padding-bottom: 0.75rem;
       display: flex;
       flex-direction: column;
       gap: 1.15rem;
       overscroll-behavior: contain;
     }
     ```
     - Has `overscroll-behavior: contain`.
     - Has `overflow-y: auto`.
     - Wrapper has `min-height: 0`, but the modal card itself lacks initial scroll reset.

---

### 1.4 Test Infrastructure
1. **`package.json` Test Script**:
   - Line 11: `"test": "node scripts/test-e2e.mjs"`
2. **`scripts/test-e2e.mjs` Execution**:
   - Running `npm test` runs 217 tests across 5 tiers:
     - Tier 1: 85/86 passed (1 failure: `R10.1` checks for `PROJECT.md` at project root; the file currently resides at `docs/20260908/PROJECT.md`).
     - Tier 2: 74/74 passed.
     - Tier 3: 26/26 passed.
     - Tier 4: 15/15 passed. Line 3148 contains a unit oracle check: `const scrollLock = { bodyOverflow: 'hidden', modalOverflow: 'auto' }; assert.equal(scrollLock.bodyOverflow, 'hidden');`.
     - Tier 5: 16/16 passed.
3. **Absence of Browser / DOM Test Framework**:
   - There is no Jest, Vitest, Playwright, or Cypress installed in `devDependencies`.
   - Verification relies on static code analysis and Node.js-based assertions.

---

## 2. Logic Chain

### 2.1 Why the Modal Appears "Cut Off and Scrolled to the Top, Revealing Only the Bottom of the Modal and the Page Behind It" on Physical Mobile Devices
1. **The CSS Flexbox Specification Behavior (CSS Box Alignment §4.4)**:
   - When a flex container has `display: flex; flex-direction: column; justify-content: flex-end;`, child elements are anchored to the bottom edge of the container.
   - If the combined height of the child elements exceeds the available container height (`100dvh`), the overflow spills out of the **start (top)** of the container into **negative coordinate space**.
   - In all web browsers (and specifically WebKit on iOS), scroll containers cannot scroll into negative coordinates (`scrollTop < 0`).
   - Consequently, the top of the modal (header, title bar, close button) is pushed above the physical screen edge and permanently clipped.
   - Only the bottom portion of the modal card remains visible on screen.
   - If the overlay or body is displaced or if the card height is constrained, the lower/surrounding area reveals the underlying page.

2. **Why This Replicates on Physical Mobile Devices but NOT When Resizing Desktop Windows**:
   - On desktop browsers (even in responsive emulation mode), the viewport height is stable and does not include mobile browser chrome (dynamic address bar, bottom toolbar, virtual keyboard, home indicator safe area).
   - On a physical phone (e.g., iPhone with Safari):
     - The viewport is restricted (often 550px–650px when the URL bar is expanded).
     - The CSS rule `.stacked-deck-container` imposes `min-height: 480px` (line 3587), and `.recursos-modal-card.modal-large` adds 1.25rem + 2rem padding (52px), plus the top bar and close button (60px) = total min height > 592px, exceeding available space.
     - When the content exceeds the viewport, `justify-content: flex-end` forces the top of the modal into negative coordinates.
     - On desktop, viewports are 800px–1080px tall, so the modal card height (~600px) never exceeds the container, and `justify-content: flex-end` simply places it at the bottom without overflow clipping.

3. **The `position: fixed` + `overflow: hidden` WebKit Scroll Anomaly**:
   - When a user on mobile scrolls down the landing page (e.g., to the "Recursos de la Comunidad" cards at `scrollY = 1200px`) and taps a button:
     - `LandingClient.tsx` executes `document.body.style.overflow = 'hidden'`.
     - On iOS Safari, toggling `overflow: hidden` on `body` while `body` has `overflow-x: hidden` and `html` has `scroll-behavior: smooth` triggers WebKit's root scroll recalculation bug.
     - WebKit resets the layout viewport scroll coordinates to `0`, while leaving visual scroll or touch offsets disconnected, or anchoring `position: fixed` to the document root rather than the visual viewport.
     - Next.js's `router.replace(url, { scroll: false })` combined with URL query parameters causes mobile Safari to attempt scroll restoration to the top.
     - The modal overlay is rendered at document `top: 0` while the viewport is scrolled down, resulting in the modal appearing scrolled away at the top of the page.

4. **Why Body Scrolling and Rubber-Banding Persist**:
   - Setting `document.body.style.overflow = 'hidden'` is known to be ineffective on iOS Safari because WebKit handles touch drag gestures at the `window` level, ignoring body overflow.
   - Without `touch-action: none` on the overlay, touch drags on the backdrop pass through to the document.
   - Without `overscroll-behavior: contain` on `.lyric-scroll-container`, `.recursos-modal-body`, and `.confesion-modal-body`, swiping to the top or bottom of a scrollable section triggers scroll chaining and mobile pull-to-refresh.

---

## 3. Caveats
- **No Physical Device in Explorer Shell**: This investigation is based on rigorous CSS specification analysis, WebKit engine behavior, and codebase exploration; live testing on physical iPhones and Android devices must be performed during verification.
- **Root `PROJECT.md` Test**: Test case `R10.1` in `scripts/test-e2e.mjs` currently fails because `PROJECT.md` is in `docs/20260908/PROJECT.md` rather than root. This is unrelated to the modal bug, but implementers must be aware of it when running `npm test`.
- **No Visual Regression Suite**: The project lacks visual regression tooling (e.g. Playwright screenshots); validation relies on CSS architectural correctness and headless property assertion.

---

## 4. Conclusion & Recommended Action Plan

### 4.1 Required Fixes

#### A. Fix Modal Overlay Alignment & Safe Auto-Margins (Solves the Cut-off Bug)
1. In `src/app/global.css`:
   - On `.calendar-modal-overlay`:
     - Remove `justify-content: flex-end`.
     - Replace with `overflow-y: auto; overscroll-behavior: contain; -webkit-overflow-scrolling: touch;`.
     - Change positioning to `position: fixed; inset: 0; width: 100%; height: 100dvh;`.
   - On `.recursos-modal-card`:
     - Apply `margin-top: auto;` (or on mobile `margin: auto auto 0 auto;`). When the card is shorter than the viewport, `margin-top: auto` pushes it to the bottom (achieving the bottom sheet look). When the card is taller than the viewport, `margin-top` becomes 0, and the container scrolls naturally from `top: 0`, preventing any negative-space clipping!
     - Ensure `max-height: calc(100dvh - env(safe-area-inset-top, 1rem) - 1rem);` is respected.
     - Remove contradictory `max-height: 90vh` at line 3594.

#### B. Implement Robust Mobile Body Scroll Locking
1. Create a centralized hook (e.g., `src/utils/useBodyScrollLock.ts`) or integrate it into `GlobalModal.tsx`:
   - On open:
     ```ts
     const scrollY = window.scrollY;
     document.body.style.position = 'fixed';
     document.body.style.top = `-${scrollY}px`;
     document.body.style.width = '100%';
     document.body.style.overflow = 'hidden';
     document.body.classList.add('modal-open');
     ```
   - On close:
     ```ts
     const scrollY = document.body.style.top;
     document.body.style.position = '';
     document.body.style.top = '';
     document.body.style.width = '';
     document.body.style.overflow = '';
     document.body.classList.remove('modal-open');
     window.scrollTo(0, parseInt(scrollY || '0') * -1);
     ```
2. Apply this body scroll lock universally:
   - When any modal opens in `LandingClient.tsx`.
   - When the event modal opens in `CalendarioClient.tsx` (`selectedEvent !== null`).
3. In `src/app/global.css`, add to `body.modal-open`:
   ```css
   body.modal-open {
     overscroll-behavior: none;
     touch-action: none;
   }
   ```
4. Add `touch-action: none;` to `.calendar-modal-overlay` backdrop, and `touch-action: pan-y;` to scrollable modal card bodies.

#### C. Ensure Scroll Containment & Internal Sizing
1. Add `overscroll-behavior: contain;` and `-webkit-overflow-scrolling: touch;` to:
   - `.lyric-scroll-container`
   - `.recursos-modal-body`
   - `.confesion-modal-body`
2. Add `flex: 1 1 auto; min-height: 0;` to:
   - `.recursos-modal-body`
   - `.confesion-modal-body`
3. In `AppleMusicLyrics.tsx` (Line 226):
   - Replace `targetEl.scrollIntoView(...)` with internal container scroll:
     ```ts
     const offsetTop = targetEl.offsetTop;
     containerRef.current.scrollTo({ top: offsetTop - 100, behavior: 'auto' });
     ```
   - This prevents window-level displacement while centering the section inside the modal.
4. Initial scroll reset:
   - When any modal opens, reset the scroll container's `scrollTop = 0` to ensure user always starts at the top of the modal content.

---

## 5. Verification Method

### 5.1 Independent Code Verification Steps
1. **Inspect `.calendar-modal-overlay`**: Verify removal of `justify-content: flex-end` and inclusion of `inset: 0`, `overflow-y: auto`, and auto-margins on the card.
2. **Inspect Body Locking**: Verify that `useBodyScrollLock` or `useEffect` saves `window.scrollY` and applies `position: fixed; top: -${scrollY}px; width: 100%;` to `body`.
3. **Inspect Scroll Containment**: Verify `overscroll-behavior: contain` on `.lyric-scroll-container`, `.recursos-modal-body`, `.confesion-modal-body`, and `.stacked-card`.
4. **Inspect `scrollIntoView` elimination**: Verify `AppleMusicLyrics.tsx` uses container-level `scrollTo` rather than `targetEl.scrollIntoView`.

### 5.2 Automated Verification Command
Run:
```bash
npm test
```
To verify that existing features R1–R10, Computus logic, and E2E journeys remain unregressed.

### 5.3 Invalidation Conditions
- If `.calendar-modal-overlay` retains `justify-content: flex-end`, the cut-off bug will persist whenever modal contents exceed small mobile viewports.
- If body locking relies solely on `overflow: hidden` without `position: fixed; top: -${scrollY}px;`, iOS Safari will continue to scroll the background page and rubber-band under touch drag gestures.
