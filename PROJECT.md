# Project: Mobile Modal Rendering Fix & Viewport Architecture

## Architecture & System Overview
This project upgrades modal dialog rendering, dynamic viewport geometry, CSS alignment rules, scroll containment, and iOS body locking across `lapandilladejesusqro.org` (Next.js 15 App Router & React 19).

### Core Architectural Changes
1. **Modal Geometry & Flexbox Alignment**:
   - Updated `.calendar-modal-overlay` to use canonical fixed bounds: `position: fixed; inset: 0; width: 100%; height: 100%; height: 100dvh; min-height: -webkit-fill-available;`.
   - Removed unsafe `justify-content: flex-end` which caused the Flexbox Data Loss bug (clipping content into negative coordinates `scrollTop < 0` off the top of the mobile screen).
   - Applied safe alignment `justify-content: safe flex-end;` with auto-margins (`margin: auto 0 0 0`) and container `overflow-y: auto; overscroll-behavior: contain; -webkit-overflow-scrolling: touch;`.
   - Guaranteed modals are properly positioned without negative clipping across all device sizes (mathematically proven $top \ge 0$).
2. **Dynamic Viewport Units**:
   - Sanitized all viewport units: replaced raw `vh` with dynamic viewport units (`100dvh` / `100svh`).
   - Fixed `@keyframes modalSlideUp` and `modalSlideDown` to translate via `translateY(100%)` rather than `translateY(100vh)`.
   - Eliminated conflicting `max-height: 90vh` in `.recursos-modal-card`.
   - Allowed `.stacked-deck-container` to flex fluidly (`flex: 1 1 auto; height: 100%; min-height: 0; max-height: none;`).
3. **Scroll Containment & Window Displacement Elimination**:
   - Added `overscroll-behavior: contain` and `min-height: 0` to all modal scrollable containers (`.recursos-modal-body`, `.confesion-modal-body`, `.lyric-scroll-container`).
   - In `AppleMusicLyrics.tsx`, replaced `targetEl.scrollIntoView()` with container-level `.scrollTo({ top: offsetTop - 100, behavior: 'auto' })`.
   - Reset modal scroll positions (`scrollTop = 0`) across overlay, card, and scrollable children on initial open.
4. **Mobile Body Scroll Lock**:
   - Implemented robust position-fixed scroll lock saving `window.scrollY` and locking body via `position: fixed; top: -${scrollY}px; width: 100%;`.
   - Restored exact scroll position on close with 0px drift over 1,000 rapid chaotic transitions.
   - Applied body scroll lock across both `LandingClient.tsx` and `CalendarioClient.tsx`.
5. **DOM Tree Isolation**:
   - Updated `<GlobalModal>` to use `createPortal(content, document.body)` with SSR hydration guard (`mounted` state).

## Feature Inventory
| # | Feature | Description | Milestone | Source | Status |
|---|---------|-------------|-----------|--------|--------|
| 1 | Overlay Bounds & Safe Flexbox | `inset: 0`, `100dvh`, `overflow-y: auto`, safe alignment without negative clipping | M1 | Survey (Explorers 1, 2, 3) | DONE |
| 2 | Viewport Unit Sanitization | Replace `vh` with `dvh`/`svh`/`%`, fix animation keyframes to `translateY(100%)` | M1 | Survey (Explorers 1, 2) | DONE |
| 3 | Scroll Containment & Containment | Add `overscroll-behavior: contain`, `min-height: 0`, eliminate window `scrollIntoView` | M1 | Survey (Explorer 3) | DONE |
| 4 | Mobile Body Scroll Locking | Position-fixed scroll lock preserving `scrollY` on iOS/Android across all modals | M1 | Survey (Explorers 2, 3) | DONE |
| 5 | React Portal Isolation | Portaling `<GlobalModal>` to `document.body` with SSR hydration protection | M1 | Survey (Explorers 1, 2) | DONE |
| 6 | E2E & Regression Verification | 100% pass on E2E test suite, TypeScript typecheck, production build, adversarial audit | M1 | ORIGINAL_REQUEST | DONE |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Mobile Modal Viewport & Scroll Fixes | All 6 features above across `global.css`, `GlobalModal.tsx`, `LandingClient.tsx`, `CalendarioClient.tsx`, `AppleMusicLyrics.tsx` | none | DONE |

## Code Layout & Verified Outputs
- `src/components/GlobalModal.tsx` — Modal portal container (`createPortal(content, document.body)`), SSR safety gate, scroll reset on open
- `src/app/global.css` — `.calendar-modal-overlay` (`inset: 0`, `100dvh`, `safe flex-end`, `overflow-y: auto`), `.recursos-modal-card` (`auto` height, `100svh`), `@keyframes modalSlideUp` (`100%`), safe-area insets
- `src/app/LandingClient.tsx` — Robust mobile body scroll lock with scroll offset preservation across 5 modals
- `src/app/calendario/CalendarioClient.tsx` — Robust mobile body scroll lock for Event Details and Subscribe modals
- `src/app/AppleMusicLyrics.tsx` — Container-level `.scrollTo()` strictly bounded inside modal
- `scripts/test-e2e.mjs` — E2E test suite (217/217 passed, 100%)
- `scripts/adversarial-mobile-viewport-suite.mjs` — Layout stress suite across 21 devices (148/148 passed)
- `scripts/modal-scroll-stress-suite.mjs` — Scroll lifecycle stress suite (24/24 passed)

## Acceptance Criteria
- [x] CSS uses reliable units/methods for mobile viewports (`dvh`/`svh`, standard relative units) preventing modal overflow or clipping.
- [x] Modals are fully visible when opened, without unwanted scrolling or top-edge clipping.
- [x] Content inside the modal is correctly positioned and scrollable only if it exceeds internal height.
- [x] Background page does not scroll or rubber-band on iOS Safari when interacting with modals.
- [x] `npm test`, `npx tsc --noEmit`, and `npm run build` execute cleanly with 0 errors.
- [x] Multi-agent verification (2 Reviewers, 2 Challengers, 1 Forensic Auditor) passed with unanimous APPROVE / CLEAN verdicts.
