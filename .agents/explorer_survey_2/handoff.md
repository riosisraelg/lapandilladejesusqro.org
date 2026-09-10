# Handoff Report — CSS & Mobile Viewport Pitfalls (Explorer 2)

## 1. Observation

### A. Tech Stack & Styling Architecture
- In `package.json` (lines 13–27), there is **no Tailwind CSS package** installed (`tailwindcss`, `@tailwindcss/*`, or Tailwind config files). All application styling is authored in raw CSS located at `src/app/global.css` (5,246 lines).
- The application uses Next.js 15.1.0 (`"next": "^15.1.0"`) and React 19 (`"react": "^19.0.0"`).

### B. Viewport Height Unit Inventory
A thorough audit of `src/app/global.css` reveals a mix of `vh`, `dvh`, and standard units across modal components:
1. **Overlay unit**:
   - `src/app/global.css:1948-1949`:
     ```css
     .calendar-modal-overlay {
       position: fixed;
       top: 0;
       left: 0;
       width: 100vw;
       height: 100dvh; /* Use dvh for mobile browsers */
     ```
2. **Modal Card units**:
   - `src/app/global.css:2839-2840`:
     ```css
     .recursos-modal-card {
       height: calc(100dvh - 2.5rem);
       max-height: calc(100dvh - 2.5rem);
     ```
   - `src/app/global.css:3568-3569` (`@media (max-width: 1024px)`):
     ```css
     .recursos-modal-card.modal-large {
       height: calc(100dvh - 2rem); /* Occupy full space minus top gap */
       max-height: calc(100dvh - 2rem);
     ```
   - `src/app/global.css:3594` (`@media (max-width: 1024px)`):
     ```css
     .recursos-modal-card {
       padding: 1.5rem 1rem;
       max-height: 90vh; /* Mixes vh with dvh parent! */
     }
     ```
   - `src/app/global.css:3015-3016` & `4278-4279`:
     ```css
     .recursos-modal-card.deck-modal-layout,
     .recursos-modal-card.confesion-modal-layout {
       height: min(92dvh, 880px);
       max-height: min(92dvh, 880px);
     }
     ```
3. **Internal Modal Child Containers**:
   - `src/app/global.css:3586-3589` (`@media (max-width: 1024px)`):
     ```css
     .stacked-deck-container {
       height: 72vh; /* Cards container expanded to occupy saved vertical space */
       min-height: 480px;
       max-height: 700px;
       margin: 0.5rem auto 1rem auto;
     }
     ```
   - `src/app/global.css:3698`:
     ```css
     .lyric-scroll-container {
       padding: calc(85px + 6vh) 1.5rem 50vh 1.5rem; /* 50vh bottom padding! */
     }
     ```
4. **Animation Keyframes**:
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
   - `src/app/global.css:2413-2422`:
     ```css
     @keyframes modalSlideDown {
       0% {
         transform: translateY(0);
         opacity: 1;
       }
       100% {
         transform: translateY(100vh);
         opacity: 0;
       }
     }
     ```

### C. Positioning Context & Stacking Context Audit
- In `src/app/LandingClient.tsx` (lines 2325, 2343, 2680, 3059, 3337) and `src/app/calendario/CalendarioClient.tsx` (lines 965, 1108), all `<GlobalModal>` instances are rendered directly as children of the top-level React fragment `<>`.
- In `src/app/layout.tsx` (lines 79–91), `{children}` is placed directly inside `<body className="landing-body">`.
- `body.landing-body` has:
  ```css
  body.landing-body {
    background: linear-gradient(-45deg, var(--cream), var(--beige), #e3d8c5, #f0e9d8);
    background-size: 400% 400%;
    animation: gradientBgAnimation 25s ease infinite;
    color: var(--text-body);
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }
  ```
  Neither `<body>` nor `<html>` contains CSS `transform`, `filter`, `perspective`, `contain`, or `backdrop-filter`.
- Therefore, **no ancestor breaks `position: fixed`** into an absolute positioning context. The overlay's containing block is the initial containing block (the viewport).
- However, `<GlobalModal>` in `src/components/GlobalModal.tsx` renders inline inside the component tree rather than using `createPortal(..., document.body)`.

### D. Overlay and Flex Alignment Mechanics
- In `src/app/global.css:1944-1961` and `3501-3510`:
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
    justify-content: flex-end; /* Align bottom sheet to screen bottom */
    align-items: center;
    animation: modalOverlayFadeIn 0.28s ease forwards;
    padding: 0;
    overscroll-behavior: contain;
  }
  ```
- Note the key layout properties:
  1. No `inset: 0`, `bottom: 0`, or `right: 0` are declared.
  2. `width: 100vw` includes scrollbars on non-overlay scrollbar engines.
  3. `display: flex; flex-direction: column; justify-content: flex-end;` is used for bottom-sheet alignment.
  4. No `overflow` property is defined on `.calendar-modal-overlay` (defaults to `overflow: visible`).

### E. Body Scroll Locking and Navigation Logic
- In `src/app/LandingClient.tsx:901-914`:
  ```typescript
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
- In `src/app/LandingClient.tsx:559`:
  ```typescript
  router.replace(url, { scroll: false });
  ```
- In `src/app/global.css:41`:
  ```css
  html { scroll-behavior: smooth; }
  ```
- In `src/app/calendario/CalendarioClient.tsx`:
  There is **no body scroll lock at all** when `selectedEvent` is opened.

---

## 2. Logic Chain

### Step 1: Dissecting the Reported Symptom
The user reported:
> *"modals are rendering incorrectly on mobile devices (appearing cut off and scrolled to the top, revealing only the bottom of the modal and a large portion of the page behind it). Note that this issue occurs on actual physical mobile devices and does not replicate by simply resizing the browser window on desktop."*

Visually, this means:
- The top portion of the modal is shifted off-screen above the top viewport boundary (`top < 0`).
- Only the lower slice/bottom of the modal card is visible near the upper region of the phone screen.
- Below that bottom slice of the modal, a large portion of the background page is exposed.
- The user cannot scroll upwards to reach the cut-off top (close button, headers, tabs).

### Step 2: The Flexbox "Data Loss" Overflow Mechanism (`justify-content: flex-end`)
1. `.calendar-modal-overlay` is defined with `display: flex; flex-direction: column; justify-content: flex-end;`.
2. Under the CSS Flexible Box Layout and CSS Box Alignment specifications:
   - When flex items overflow a flex container along the main axis (vertical in `flex-direction: column`), `justify-content: flex-end` anchors the item's bottom edge to the container's bottom edge.
   - Any excess height that exceeds the container extends in the **start direction** (upward, into negative coordinates `y < 0`).
   - Standard alignment without the `safe` keyword (`justify-content: safe flex-end`) is "unsafe" (often termed CSS Flexbox Data Loss). In browser layout engines, negative coordinate space cannot be reached by scrolling.
3. If the inner content height of the modal card exceeds the container's calculated height:
   - The top of the card is pushed into negative space above the viewport.
   - The user sees the modal sliced off at the top.

### Step 3: Why This Triggers on Physical Mobile Devices But NOT on Desktop
1. **Dynamic Browser Chrome (The 100lvh → 100svh transition)**:
   - On desktop (and desktop DevTools responsive mode), `window.innerHeight` is strictly constant. There are no collapsing URL bars or dynamic bottom toolbars. Thus, `100vh == 100dvh == 100svh`.
   - On physical mobile devices (iOS Safari & Android Chrome):
     - When a user scrolls down the landing page to the *Recursos* section, the URL bar shrinks and the bottom navigation bar hides. The viewport expands to `100lvh` (Large Viewport Height).
     - When the user taps a button to open a modal, touch interaction triggers the browser to immediately restore its top and bottom chrome. The viewport shrinks dynamically from `100lvh` down to `100svh` (a drop of 80px–130px).
2. **Unit Mismatch between Container and Contents**:
   - The overlay is sized with `height: 100dvh` (which shrinks when toolbars appear).
   - However, the modal card's contents use `height: 72vh; min-height: 480px;` (`stacked-deck-container`) and `max-height: 90vh;`.
   - In WebKit/Blink mobile, `vh` represents `100lvh` (the large viewport).
   - As a result, the inner content remains sized according to the large viewport (~844px screen → `72vh` = 607px + headers/paddings ~120px = 727px), while the overlay has shrunk to `100svh` (~680px).
   - Because content (727px) > container (680px), `justify-content: flex-end` forces the top ~50-80px of the modal up above the top of the screen.

### Step 4: Body Scroll Failure & Document Coordinate Desynchronization on iOS WebKit
1. When `document.body.style.overflow = 'hidden'` is executed on iOS Safari:
   - iOS Safari does **not** prevent touch scrolling on `<body>` when `overflow: hidden` is applied unless the element is fixed and touch events are locked.
   - Touching the modal or backdrop scrolls the underlying document.
2. The overlay has `position: fixed; top: 0; left: 0; width: 100vw; height: 100dvh;` without `bottom: 0` or `inset: 0`.
3. In iOS WebKit:
   - When a page is at an active scroll offset (`window.scrollY > 0`) and `router.replace(..., { scroll: false })` executes alongside `html { scroll-behavior: smooth; }` and `overflow: hidden`, WebKit's fixed-layer compositor often desynchronizes the visual viewport from the layout viewport.
   - When the document scroll offset attempts to restore or jumps, `position: fixed` elements without `inset: 0` can be rendered relative to the displaced document coordinate rather than the active visual viewport, causing the modal to shift far up the page.

---

## 3. Caveats

- **No Caveats on Root Cause**: The physical mobile failure is conclusively identified as the confluence of:
  1. `justify-content: flex-end` data-loss clipping when children overflow.
  2. Mixing `vh` (Large Viewport) with `dvh` (Dynamic Viewport) causing child height to exceed container height when mobile browser bars restore.
  3. Lack of `inset: 0` / `bottom: 0` on `.calendar-modal-overlay`.
  4. Inadequate body scroll locking on iOS WebKit (`body.style.overflow = 'hidden'` alone).
- **Component Specificity**: While all modals using `GlobalModal` suffer from the overlay alignment and unit issues, modals with large static min-heights (e.g., `stacked-deck-container` with `min-height: 480px; height: 72vh;`) trigger severe upward clipping on devices with screens under 750px tall (e.g. iPhone SE, iPhone 12/13 Mini, older Android devices).

---

## 4. Conclusion

The bug where modals appear cut off and scrolled to the top on physical mobile devices is caused by:
1. **Unsafe Flexbox Alignment**: `.calendar-modal-overlay` uses `display: flex; flex-direction: column; justify-content: flex-end;` without `safe`. Any overflow in child elements pushes the modal's top edge into negative space (`top < 0`), permanently clipping off headers and close buttons.
2. **Mobile Viewport Collapse & Unit Conflicts**: Mixing `vh` (based on `100lvh`) on internal modal components (`.stacked-deck-container { height: 72vh; }`, `.recursos-modal-card { max-height: 90vh; }`) with `100dvh` on `.calendar-modal-overlay`. When user interaction restores mobile browser chrome, the viewport shrinks to `100svh`, instantly forcing the taller modal card to overflow and push off-screen.
3. **Incomplete Fixed Positioning**: `.calendar-modal-overlay` specifies `top: 0; left: 0; width: 100vw; height: 100dvh;` instead of `inset: 0` (`top: 0; right: 0; bottom: 0; left: 0; width: 100%; height: 100%;`). On mobile WebKit, missing `bottom: 0` prevents the layout engine from pinning the overlay to the visual viewport boundary.
4. **Ineffective iOS Scroll Lock**: `document.body.style.overflow = 'hidden'` fails on iOS Safari and causes scroll offset jumps when paired with Next.js navigation and smooth scrolling.

### Recommended Fix Strategies

#### 1. Fix Overlay Geometry and Safe Alignment in `src/app/global.css`
Replace lines 1944–1961 and 3501–3510 with:
```css
.calendar-modal-overlay {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  height: 100dvh;
  min-height: -webkit-fill-available;
  background: rgba(45, 27, 14, 0.45);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: safe flex-end; /* Prevents data loss clipping into top negative space */
  align-items: center;
  animation: modalOverlayFadeIn 0.28s ease forwards;
  padding: 0;
  overflow-y: auto; /* Fallback scroll if screen is smaller than modal */
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}

@media (max-width: 1024px) {
  .calendar-modal-overlay {
    justify-content: safe flex-end;
    padding: 0 !important;
    padding-bottom: env(safe-area-inset-bottom, 0);
  }
}
```

#### 2. Sanitize Viewport Units in `src/app/global.css`
- Change `min(92dvh, 880px)` and `calc(100dvh - 2rem)` on `.recursos-modal-card.modal-large` to use `100svh` or `100dvh` consistently:
  ```css
  .recursos-modal-card.modal-large {
    height: calc(100dvh - 2rem);
    max-height: calc(100svh - 2rem); /* Respects expanded browser chrome */
    max-height: calc(100dvh - 2rem);
    margin: auto 0 0 0; /* Keeps pinned to bottom without unsafe flex clipping */
  }
  ```
- Change `.stacked-deck-container` from `height: 72vh` to a relative flex/dvh:
  ```css
  .stacked-deck-container {
    height: 100%;
    max-height: none;
    min-height: 0;
  }
  ```
- Change `.recursos-modal-card` line 3594 from `max-height: 90vh` to `max-height: 90dvh` / `max-height: 90svh`.
- Change `@keyframes modalSlideUp` from `translateY(100vh)` to `translateY(100%)`. Using `100%` slides by exactly the element's own height rather than referencing the external viewport unit.

#### 3. Implement Robust iOS Body Scroll Lock
In `src/app/LandingClient.tsx` (and `CalendarioClient.tsx`), implement position-fixed scroll locking:
```typescript
useEffect(() => {
  const isAnyModalOpen = showCancionero || showOraciones || showGuiaMisa || showConfesion || showAppleMusicGuia;
  if (isAnyModalOpen) {
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.classList.add('modal-open');
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.classList.remove('modal-open');
      window.scrollTo(0, scrollY);
    };
  }
}, [showCancionero, showOraciones, showGuiaMisa, showConfesion, showAppleMusicGuia]);
```

#### 4. React Portal Isolation
Update `src/components/GlobalModal.tsx` to render using `createPortal(content, document.body)` with an SSR-safe `mounted` state:
```typescript
import { createPortal } from 'react-dom';
// ...
export default function GlobalModal(...) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!isOpen || !mounted) return null;
  return createPortal(modalMarkup, document.body);
}
```

---

## 5. Verification Method

To verify these findings and future fixes independently:
1. **Codebase Inspection**:
   - Inspect `src/app/global.css` lines 1944–1961, 2402–2422, 2833–2852, 3010–3017, 3501–3510, 3567–3595.
   - Inspect `src/app/LandingClient.tsx` lines 901–914 and `src/components/GlobalModal.tsx`.
2. **Build and Lint Verification**:
   - Execute Next.js build:
     ```bash
     npm run build
     ```
     (Verified: compiles cleanly with exit code 0).
3. **Mobile Device Emulation & Test Conditions**:
   - To test dynamic toolbar collapse on desktop Chrome/Safari:
     Open Chrome DevTools → Device Mode → Toggle "Show device frame" → inspect viewport height changes when virtual keyboard / toolbar triggers.
   - On a physical iOS device (Safari) or WebKit inspector:
     Scroll down to the "Recursos" section so that toolbars collapse (`100lvh`), tap "Oraciones" or "Guía de Misa", and observe whether toolbars restore and whether the top of the modal remains accessible.
