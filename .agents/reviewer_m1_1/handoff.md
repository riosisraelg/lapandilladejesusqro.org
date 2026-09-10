# Review & Adversarial Challenge Report: Mobile Modal Viewport & Architecture

**Reviewer**: Reviewer 1 (Code & Architecture Reviewer)  
**Date**: 2026-09-10T11:40:00-06:00  
**Target Milestone**: Mobile Modal Viewport & Scroll Fixes (`worker_m1`)  
**Verdict**: **APPROVE**  
**Overall Risk Assessment**: **LOW**  

---

## Review Summary

**Verdict**: **APPROVE**

The implementation submitted by `worker_m1` thoroughly resolves the mobile modal rendering bug where dialogs appeared clipped at the top or displaced off-screen on physical mobile devices. The solution implements sound CSS Box Alignment (CSS Level 3 `safe` alignment combined with `margin-top: auto`), dynamic viewport geometry (`inset: 0`, `100dvh`, `-webkit-fill-available`), sanitization of animation keyframes to relative bounding-box percentages (`translateY(100%)`), React Portal DOM isolation with SSR hydration guards, scroll containment, and iOS Safari position-fixed body scroll locking.

All verification commands (`npm test`, `npx tsc --noEmit`, and `npm run build`) pass cleanly with 0 errors. An exhaustive integrity audit confirmed no hardcoded test shortcuts, facade implementations, or fabricated claims.

---

## Findings

### [Minor] Finding 1: Unused Keyframe Definitions Retain `100vh`
- **What**: `@keyframes mobileSheetOpen` and `@keyframes mobileSheetClose` in `src/app/global.css:3652-3672` retain `transform: translateY(100vh);`.
- **Where**: `src/app/global.css:3654, 3669`.
- **Why**: While `@keyframes modalSlideUp`, `modalSlideDown`, and `scaleInModal` were properly sanitized to `translateY(100%)`, these two legacy keyframes were overlooked. Repo-wide search confirms they are not referenced by any CSS class or JSX component.
- **Suggestion**: Remove these two unused keyframe blocks or convert them to `translateY(100%)` during future CSS housekeeping.

### [Minor] Finding 2: Mobile Nav Overlay Uses `100vh`
- **What**: `.nav-mobile-overlay` at `src/app/global.css:206` uses `height: 100vh;`.
- **Where**: `src/app/global.css:206`.
- **Why**: This overlay controls the hamburger menu dropdown, not a modal dialog, and is outside the explicit scope of this task. However, on mobile browsers with collapsible address bars, switching to `height: 100dvh;` or `min-height: -webkit-fill-available;` would provide the same viewport resilience as the modals.
- **Suggestion**: Update `.nav-mobile-overlay` to use `height: 100dvh;` in a subsequent UX sweep.

---

## 1. Observation

### 1.1 Direct Source Code Observations

1. **CSS Geometry & Safe Flexbox Alignment (`src/app/global.css`)**:
   - Lines 1944–1964:
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
       justify-content: safe flex-end;
       align-items: center;
       animation: modalOverlayFadeIn 0.28s ease forwards;
       padding: 0;
       overflow-y: auto;
       overscroll-behavior: contain;
       -webkit-overflow-scrolling: touch;
     }
     ```
   - Lines 2840–2859 (`.recursos-modal-card`):
     ```css
     height: auto;
     max-height: calc(100dvh - 2rem);
     max-height: calc(100svh - 2rem);
     ...
     margin: auto 0 0 0;
     ```
   - Lines 3512–3524 (`@media (max-width: 1024px)`):
     ```css
     .calendar-modal-overlay {
       ...
       justify-content: safe flex-end;
       overflow-y: auto;
       overscroll-behavior: contain;
       -webkit-overflow-scrolling: touch;
       padding: 0 !important;
       padding-bottom: env(safe-area-inset-bottom, 0px) !important;
     }
     ```
   - Lines 3581–3594 (`.recursos-modal-card.modal-large`):
     ```css
     height: auto;
     max-height: calc(100dvh - 2rem);
     max-height: calc(100svh - 2rem);
     margin: auto 0 0 0;
     ```
   - Lines 3600–3606 (`.stacked-deck-container`):
     ```css
     flex: 1 1 auto;
     height: 100%;
     min-height: 0;
     max-height: none;
     ```
   - The conflicting `max-height: 90vh;` was completely removed from `.recursos-modal-card`.

2. **Animation Keyframe Sanitization (`src/app/global.css`)**:
   - Lines 2405–2435:
     - `@keyframes modalSlideUp`: `0% { transform: translateY(100%); opacity: 0.6; } 100% { transform: translateY(0); opacity: 1; }`
     - `@keyframes modalSlideDown`: `0% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(100%); opacity: 0; }`
     - `@keyframes scaleInModal`: `from { transform: translateY(100%); opacity: 0.6; } to { transform: translateY(0); opacity: 1; }`
     - All active modal animations now translate relative to the modal element's bounding box (`100%`) rather than the browser window (`100vh`).

3. **Scroll Containment & Touch Behavior (`src/app/global.css`)**:
   - `.recursos-modal-body` (lines 2865–2873): `overflow-y: auto; overscroll-behavior: contain; -webkit-overflow-scrolling: touch; min-height: 0;`
   - `.confesion-modal-body` (lines 4351–4359): `flex: 1 1 0%; min-height: 0; overflow-y: auto; overscroll-behavior: contain; -webkit-overflow-scrolling: touch;`
   - `.lyric-scroll-container` (lines 3710–3716): `overflow-y: auto; overscroll-behavior: contain; -webkit-overflow-scrolling: touch; padding: calc(85px + 6dvh) 1.5rem 50dvh 1.5rem;`
   - `body.modal-open` (lines 2636–2638): `overscroll-behavior: none;`

4. **React Portal & SSR Safety (`src/components/GlobalModal.tsx`)**:
   - Lines 27–33:
     ```tsx
     const [mounted, setMounted] = useState(false);
     useEffect(() => {
       setMounted(true);
     }, []);
     ```
   - Line 53: `if (!isOpen || !mounted) return null;`
   - Line 85: `return createPortal(content, document.body);`
   - Lines 36–51 (Scroll position reset on open):
     ```tsx
     useEffect(() => {
       if (isOpen) {
         if (overlayRef.current) overlayRef.current.scrollTop = 0;
         if (cardRef.current) cardRef.current.scrollTop = 0;
         const scrollableChildren = cardRef.current?.querySelectorAll<HTMLElement>(
           '.recursos-modal-body, .confesion-modal-body, .lyric-scroll-container, .gcal-scrollable-body'
         );
         scrollableChildren?.forEach((el) => {
           el.scrollTop = 0;
         });
       }
     }, [isOpen]);
     ```

5. **Mobile Body Scroll Lock (`LandingClient.tsx` & `CalendarioClient.tsx`)**:
   - `src/app/LandingClient.tsx:902-924` and `src/app/calendario/CalendarioClient.tsx:268-290`:
     ```tsx
     const isModalOpen = Boolean(...);
     if (isModalOpen) {
       const existingTop = document.body.style.top;
       const scrollY = existingTop ? Math.abs(parseInt(existingTop, 10)) : window.scrollY;
       document.body.style.position = 'fixed';
       document.body.style.top = `-${scrollY}px`;
       document.body.style.width = '100%';
       document.body.style.overflow = 'hidden';
       document.body.classList.add('modal-open');
       return () => {
         const currentTop = document.body.style.top;
         document.body.style.position = '';
         document.body.style.top = '';
         document.body.style.width = '';
         document.body.style.overflow = '';
         document.body.classList.remove('modal-open');
         const restoredY = currentTop ? Math.abs(parseInt(currentTop, 10)) : scrollY;
         window.scrollTo(0, restoredY);
       };
     }
     ```

6. **Interactive Lyrics Section Scrolling (`src/app/AppleMusicLyrics.tsx`)**:
   - Lines 224–227:
     ```tsx
     if (targetEl && containerRef.current) {
       containerRef.current.scrollTo({ top: targetEl.offsetTop - 100, behavior: 'auto' });
     }
     ```
     Replaced `targetEl.scrollIntoView({ behavior: 'auto', block: 'center' })`.

### 1.2 Verification Tool Invocations & Results

1. **E2E Test Suite (`npm test`)**:
   - Command: `npm test`
   - Output: 217 test cases executed, 217 passed, 0 failed across Tier 1 (Feature Coverage 86/86), Tier 2 (Boundaries 74/74), Tier 3 (Combinations 26/26), Tier 4 (Scenarios 15/15), and Tier 5 (Adversarial 16/16).
   - Execution time: 68ms.

2. **TypeScript Strict Type Check (`npx tsc --noEmit`)**:
   - Command: `npx tsc --noEmit`
   - Exit Code: 0 (clean compilation, zero type errors).

3. **Next.js Production Build (`npm run build`)**:
   - Command: `npm run build`
   - Exit Code: 0 (compiled in 1742ms). All 9 static and dynamic routes compiled cleanly:
     - `/` (Static)
     - `/_not-found` (Static)
     - `/api/calendar` (Dynamic)
     - `/api/mass-readings` (Dynamic)
     - `/api/og` (Dynamic)
     - `/calendario` (Dynamic)
     - `/donaciones` (Static)
     - `/robots.txt` (Static)
     - `/sitemap.xml` (Static)

4. **Integrity Audit**:
   - Checked source files for hardcoded test responses: None found.
   - Checked for facade or dummy implementations: None found.
   - Checked for modified test assertions to artificially force a pass: `git status` shows no test files were touched (`scripts/test-e2e.mjs` and `tests/` are completely unmodified).

---

## 2. Logic Chain

1. **Root Cause Analysis of the Mobile Cut-Off Bug**:
   - On mobile browsers (Safari on iOS, Chrome on Android), when browser chrome (URL bar, bottom navigation) expands, the viewport height shrinks to the small viewport height (`100svh`).
   - Previously, `.calendar-modal-overlay` used `justify-content: flex-end;` without `safe`. In the CSS Box Alignment specification, when flex content exceeds the cross/main container size, standard `flex-end` aligns content such that the start edge overflows into negative scroll coordinate space (`scrollTop < 0`).
   - Because standard DOM containers cannot scroll into negative coordinates, the upper portion of the modal (title, close button, top instructions) was irrevocably clipped off-screen on mobile devices.
   - Simultaneously, child containers like `.stacked-deck-container` had fixed `height: 72vh; min-height: 480px;`, which exceeded the available space on small screens (e.g., iPhone SE), forcing the overflow to worsen.

2. **Resolution via Safe Alignment & Flex Mechanics**:
   - Changing `justify-content: flex-end;` to `justify-content: safe flex-end;` guarantees that whenever the modal card overflows the viewport, the browser falls back to `start` alignment, preserving the top edge and close button.
   - Adding `margin: auto 0 0 0;` to `.recursos-modal-card` leverages CSS flex auto-margins: when space permits, `margin-top: auto` pins the card to the bottom; when space is tight or overflowing, the margin collapses to 0, ensuring the card starts at `top: 0`.
   - Combining `safe flex-end` with `margin: auto 0 0 0` provides defense-in-depth across mobile rendering engines (even browsers with incomplete support for the `safe` keyword).
   - Adding `overflow-y: auto; overscroll-behavior: contain; -webkit-overflow-scrolling: touch;` to `.calendar-modal-overlay` allows the overlay itself to scroll smoothly if any unexpected content expansion occurs.

3. **Resolution via Dynamic Viewport Geometry**:
   - Setting `inset: 0; width: 100%; height: 100%; height: 100dvh; min-height: -webkit-fill-available;` on the overlay ensures it covers the active visual viewport under all mobile toolbar configurations.
   - Constraining `.recursos-modal-card` and `.modal-large` to `max-height: calc(100dvh - 2rem); max-height: calc(100svh - 2rem);` guarantees at least a 2rem clearance from the top edge on every device, maintaining a clear closing target and visual boundary.
   - Removing `max-height: 90vh;` eliminates the conflicting rule that used the large viewport (`lvh`), which previously induced overflow when mobile keyboards or bars expanded.

4. **Resolution via Keyframe Sanitization**:
   - In `@keyframes modalSlideUp` and `modalSlideDown`, changing `transform: translateY(100vh)` to `transform: translateY(100%)` anchors the slide animation to the modal card's own bounding box rather than the browser window. This eliminates off-screen clipping artifacts during opening and closing transitions.

5. **Resolution of Mobile Window Scrolling & Rubber-Banding**:
   - In `AppleMusicLyrics.tsx`, replacing `targetEl.scrollIntoView()` with `containerRef.current.scrollTo()` restricts automatic scrolling strictly to the modal's internal lyric container. Calling `scrollIntoView()` on mobile WebKit often scrolled the parent `window` object, shifting the entire modal upwards and exposing background content.
   - The position-fixed body lock hook in `LandingClient.tsx` and `CalendarioClient.tsx` sets `document.body.style.position = 'fixed'`, `top: -${scrollY}px`, and `width: 100%`. Unlike naive `overflow: hidden`, this stops iOS Safari touch rubber-banding completely and restores the user's exact scroll position upon closing (`window.scrollTo(0, restoredY)`).

6. **DOM Isolation & SSR Hydration Guard**:
   - Portaling `<GlobalModal>` via `createPortal(content, document.body)` moves the modal root directly under `<body>`, immune to any parent CSS transforms, stacking contexts, or `overflow: hidden` restrictions.
   - The `mounted` state guard (`useState(false)` + `useEffect(() => setMounted(true), [])`) ensures no portal creation occurs during SSR or before hydration, preventing server crashes and hydration mismatch errors.
   - The `scrollTop = 0` reset on `isOpen` ensures that reopening any modal always presents clean content starting at the top.

---

## 3. Caveats

1. **Physical Hardware Multi-Browser Validation**:
   - Code analysis and automated test suites verify the CSS syntax, AST validity, DOM layout, and Next.js build. However, edge-case quirks on very specific legacy mobile hardware (e.g. iOS 14 WebKit rendering of `-webkit-fill-available` inside nested flex containers) cannot be 100% simulated without physical devices or cloud device farms (BrowserStack/SauceLabs).
2. **Dead Keyframe Definitions**:
   - As flagged in Minor Finding 1, `@keyframes mobileSheetOpen` and `mobileSheetClose` retain `100vh`. They are currently unreferenced in CSS and JSX, so they do not impact runtime behavior, but should eventually be cleaned up.

---

## 4. Conclusion

The changes implemented across `src/components/GlobalModal.tsx`, `src/app/global.css`, `src/app/LandingClient.tsx`, `src/app/calendario/CalendarioClient.tsx`, and `src/app/AppleMusicLyrics.tsx` are architecturally sound, thoroughly tested, and completely resolve the mobile modal clipping and viewport displacement defects.

**Verdict**: **APPROVE**.

---

## 5. Verification Method

To independently reproduce and verify this review:

1. **Verify E2E Test Suite**:
   ```bash
   npm test
   ```
   *Expected output*: 217 tests passing across all 5 tiers with 0 failures.

2. **Verify TypeScript Type Check**:
   ```bash
   npx tsc --noEmit
   ```
   *Expected output*: Exit code 0 with no diagnostic messages.

3. **Verify Production Build**:
   ```bash
   npm run build
   ```
   *Expected output*: Next.js production build completes with 0 errors; all 9 static and dynamic routes compile successfully.

4. **Verify CSS Rules**:
   Inspect `src/app/global.css`:
   - Line 1957 & 3516: `justify-content: safe flex-end;`
   - Line 1946–1950: `inset: 0; width: 100%; height: 100%; height: 100dvh; min-height: -webkit-fill-available;`
   - Line 2407 & 2422: `transform: translateY(100%);`
   - Confirm `max-height: 90vh` is not present in `src/app/global.css`.

5. **Invalidation Conditions**:
   - Any reintroduction of `justify-content: flex-end;` without `safe`.
   - Any reintroduction of `targetEl.scrollIntoView()` within modal sub-components.
   - Any removal of the `mounted` check before `createPortal(..., document.body)` in `GlobalModal.tsx`.

---

## Verified Claims

- `.calendar-modal-overlay` bounds and safe alignment → verified via `view_file` on `src/app/global.css` (lines 1944–1964) → **PASS**
- Keyframes sanitized to `translateY(100%)` → verified via `view_file` on `src/app/global.css` (lines 2405–2435) → **PASS**
- `max-height: 90vh` removed → verified via `grep_search` across `src/` (0 matches) → **PASS**
- React Portal implemented with SSR check in `GlobalModal.tsx` → verified via `view_file` (lines 27–33, 53, 85) → **PASS**
- Scroll reset on open in `GlobalModal.tsx` → verified via `view_file` (lines 36–51) → **PASS**
- Position-fixed body scroll lock in `LandingClient.tsx` & `CalendarioClient.tsx` → verified via `view_file` → **PASS**
- Container `.scrollTo()` in `AppleMusicLyrics.tsx` → verified via `view_file` (lines 224–227) → **PASS**
- Automated tests pass → verified via `npm test` (217/217 pass) → **PASS**
- TypeScript type check passes → verified via `npx tsc --noEmit` (code 0) → **PASS**
- Production build passes → verified via `npm run build` (code 0) → **PASS**
- Absence of integrity violations → verified via source and git history audit → **PASS**

---

## Adversarial Stress Testing & Attack Surface Challenges

### Challenge 1: Browser Incompatibility with `safe` Flexbox Keyword
- **Assumption**: Modern mobile browsers support `justify-content: safe flex-end`.
- **Attack Scenario**: An older mobile browser does not recognize the `safe` keyword, ignoring the declaration or reverting to default alignment.
- **Blast Radius**: Could the top of the modal card clip off again on older devices?
- **Defense / Mitigation**: `worker_m1` added `margin: auto 0 0 0;` directly to `.recursos-modal-card` and `.modal-large`. In flexbox, `margin-top: auto` overrides the parent's alignment along the main axis. When space is available, it pushes the card to the bottom; when overflowing, it collapses to 0, pinning the top of the card at the top. The dual approach guarantees safe rendering even if the `safe` keyword is unrecognized.

### Challenge 2: Rapid Sequential Modal Transitions Under Body Scroll Lock
- **Assumption**: When closing one modal and immediately opening another, `window.scrollY` could reset to 0 or jump erratically.
- **Attack Scenario**: User has scrolled 1200px down the page, opens `guiaMisa`, then navigates directly to `cancionero`.
- **Blast Radius**: The second modal might capture `window.scrollY = 0` (because the body was already `fixed` at `top: -1200px`), causing the page to reset to the top upon final close.
- **Defense / Mitigation**: Verified the implementation in `LandingClient.tsx:905-906` and `CalendarioClient.tsx:271-272`:
  ```tsx
  const existingTop = document.body.style.top;
  const scrollY = existingTop ? Math.abs(parseInt(existingTop, 10)) : window.scrollY;
  ```
  If `document.body.style.top` is already set from a preceding modal, it extracts the original offset instead of reading the displaced `window.scrollY`. The original offset is preserved and restored without jitter.

### Challenge 3: SSR / Hydration Mismatch via React Portal
- **Assumption**: `createPortal` targeting `document.body` might execute during server rendering or before the client DOM is ready.
- **Attack Scenario**: Next.js server pre-renders a route or static build evaluates the component tree where `document` is undefined.
- **Blast Radius**: Server-side runtime crash (`ReferenceError: document is not defined`) or React hydration mismatch warning (React error #418/425).
- **Defense / Mitigation**: `GlobalModal` gates rendering with `const [mounted, setMounted] = useState(false)`. Before hydration, `mounted` is `false`, returning `null`. Only after `useEffect` executes on the client does `mounted` become `true` and the portal mounts. The Next.js production build succeeded with 0 errors across all 9 pages.

