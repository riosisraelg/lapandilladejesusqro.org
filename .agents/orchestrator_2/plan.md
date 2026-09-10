# Execution Plan: Mobile Modal Rendering Fix

## Objective
Fix the mobile modal rendering bug where modals appear cut off, scrolled to the top, revealing only the bottom of the modal and a large portion of the page behind it on physical mobile devices. Ensure modals are fully centered, properly sized, use dynamic viewport units (such as `dvh`), contain internal scrolling, and avoid body scroll leakage / transform context issues.

## Milestones & Stages

### Stage 0: Survey & Technical Exploration (3 Parallel Explorers)
- **Explorer 1 (Modal Inventory & Structure)**: Inspect all modal components across the repository (e.g. Mass Guide, Lyrics modal, Prayer modal, Song modal, etc.), mapping their DOM hierarchy, wrapper elements, and open/close state logic.
- **Explorer 2 (CSS / Tailwind & Mobile Viewport Pitfalls)**: Analyze all CSS rules, Tailwind utility classes (e.g., `h-screen`, `max-h-screen`, `h-[100vh]`, `fixed`, `absolute`, `inset-0`), viewport units (`vh` vs `dvh`), and parent transforms (`transform`, `filter`, `perspective`) that break `fixed` positioning on mobile browsers.
- **Explorer 3 (Scroll Containment & Body Locking)**: Analyze overflow handling (`overflow-y-auto`, `overflow-hidden`), body scroll lock implementations, address bar dynamic height recalculations on mobile Safari/Chrome, and existing automated tests.

### Stage 1: Synthesis & Project Specification (`PROJECT.md`)
- Aggregate findings into root causes.
- Document exact files to modify and design rules (e.g. `min-h-[100dvh]`, `h-full`, `overscroll-contain`, safe-area insets).
- Formulate verification criteria and test strategy.

### Stage 2: Implementation & Fixes (Worker)
- Dispatch Worker to apply robust mobile viewport fixes across all identified modals.
- Ensure proper use of `dvh`, safe areas, scroll containment, and removal of any positioning traps.
- Ensure builds (`npm run build`), TypeScript checks (`npx tsc --noEmit`), and existing test suites pass.

### Stage 3: Verification & Auditing
- Reviewers: Independent code review across all modified files.
- Challengers: Adversarial layout and mobile viewport stress checks.
- Forensic Auditor: Verify integrity, genuine fixes without hacks or bypassing tests.

### Stage 4: Final Validation & Victory Report
- Run comprehensive verification.
- Report completion to Sentinel with detailed evidence chain.
