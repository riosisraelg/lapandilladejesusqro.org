## 2026-09-10T17:31:42Z

You are the Mobile Viewport & Modal Worker.
Your working directory is: /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/worker_m1.
Initialize your BRIEFING.md and progress.md in your working directory.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Authoritative Documents to Read First:
1. /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/ORIGINAL_REQUEST.md
2. /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/PROJECT.md
3. /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/explorer_survey_1/handoff.md
4. /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/explorer_survey_2/handoff.md
5. /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/explorer_survey_3/handoff.md

Your Exclusive File Ownership:
- src/components/GlobalModal.tsx
- src/app/global.css
- src/app/LandingClient.tsx
- src/app/calendario/CalendarioClient.tsx
- src/app/AppleMusicLyrics.tsx

Task Objective:
Implement a comprehensive, genuine fix for the mobile modal rendering bug across the Next.js application, satisfying all acceptance criteria:
1. Fix Overlay Geometry & Safe Alignment in src/app/global.css:
   - On `.calendar-modal-overlay` (lines ~1944-1961 and responsive ~3501-3510):
     - Replace `position: fixed; top: 0; left: 0; width: 100vw; height: 100dvh;` with canonical viewport bounds: `position: fixed; inset: 0; width: 100%; height: 100%; height: 100dvh; min-height: -webkit-fill-available;`.
     - Replace unsafe `justify-content: flex-end;` with `justify-content: safe flex-end;` (with `margin-top: auto;` on the card) and add `overflow-y: auto; overscroll-behavior: contain; -webkit-overflow-scrolling: touch;`. When a modal is taller than the viewport, this ensures the content flows from top 0 and is scrollable, preventing the CSS flexbox data-loss bug that pushed the modal header off-screen into negative coordinates (`scrollTop < 0`).
     - On mobile media query (<= 1024px), ensure safe-area insets: `padding-bottom: env(safe-area-inset-bottom, 0px) !important;`.
   - On `.recursos-modal-card` and `.modal-large`:
     - Sizing: `height: auto; max-height: calc(100dvh - 2rem); max-height: calc(100svh - 2rem); margin: auto 0 0 0;` (or `margin: auto;` if centered, or auto margins for bottom sheet).
     - Remove conflicting `max-height: 90vh;` at line ~3594 in global.css.
     - Sizing for `.stacked-deck-container`: adjust so it flexes dynamically within its parent rather than forcing `height: 72vh; min-height: 480px;` that overflows small screens.
   - Animations:
     - In `@keyframes modalSlideUp` and `@keyframes modalSlideDown`, change `translateY(100vh)` to `translateY(100%)`.
   - Scroll Containment:
     - Add `overscroll-behavior: contain;` and `-webkit-overflow-scrolling: touch;` to `.lyric-scroll-container`, `.recursos-modal-body`, and `.confesion-modal-body`.
     - Add `min-height: 0;` to `.recursos-modal-body` and `.confesion-modal-body` to ensure flex child scroll containers shrink properly.

2. React Portal & Scroll Reset in src/components/GlobalModal.tsx:
   - Use `createPortal(content, document.body)` with an SSR-safe `mounted` state check (`useEffect(() => setMounted(true), [])`).
   - Ensure the modal card resets scroll position on open (`scrollTop = 0`).

3. Robust Mobile Body Scroll Lock:
   - In `src/app/LandingClient.tsx` (lines ~901-914) and `src/app/calendario/CalendarioClient.tsx`:
     - Implement position-fixed scroll lock on body: save `window.scrollY`, apply `position: fixed; top: -${scrollY}px; width: 100%; overflow: hidden;` to `document.body` and add class `modal-open`.
     - On modal close: remove fixed styles, restore `window.scrollTo(0, scrollY)`.
     - Apply this universally in both LandingClient and CalendarioClient (when `selectedEvent` or `showSubscribeModal` is active).

4. Contain Window-Level Scrolling in src/app/AppleMusicLyrics.tsx:
   - At line ~226, replace `targetEl.scrollIntoView({ behavior: 'auto', block: 'center' })` with container-level scrolling:
     `containerRef.current.scrollTo({ top: targetEl.offsetTop - 100, behavior: 'auto' });`
     to prevent displacing the mobile browser window.

5. Verification Commands:
   - Run `npm test` (verify all tests pass, including R10.1 since PROJECT.md is at root).
   - Run `npx tsc --noEmit` (clean TypeScript compilation).
   - Run `npm run build` (Next.js production build).
   - Document verification output and exact diffs in `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/worker_m1/handoff.md`.
6. Send a message to orchestrator upon completion.
