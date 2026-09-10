# Original User Request

## Initial Request — 2026-08-28T18:50:14-06:00

Task Overview:
Upgrade the Mass Readings web scraper to accurately fetch the complete text of all daily readings, and dynamically integrate them into their exact canonical order within the Mass Guide UI. Configure the main Mass button to open directly to this guide.

Key Requirements:
1. R1: Overhaul Daily Readings Scraper API (`src/app/api/mass-readings/route.ts` or similar) to accurately scrape and return the FULL text of the daily liturgy (full citations, First Reading, entire Responsorial Psalm with recurring response phrase and all verses, Second Reading if applicable, Alleluia, and Gospel).
2. R2: Canonical UI Integration in `LandingClient.tsx` removing old accordion, dynamically injecting readings sequentially into "Liturgia de la Palabra" (Primera Lectura → Salmo Responsorial → Segunda Lectura → Aleluya → Evangelio).
3. R3: Direct Access & Auto-fetch: Configure main Mass button to open modal directly to the start of the mass and auto-fetch readings without manual button press.

Engineering Standards:
Comply with 3-stage engineering standards:
- Stage 1: System Architecture (`docs/architecture.md`) [ISO/IEC/IEEE 42010]
- Stage 2: Software Requirements Specification (`docs/srs.md`) [ISO/IEC/IEEE 29148]
- Stage 3: Execution Plan & Atomic Task Matrix (`docs/tasks.md`) [ISO/IEC/IEEE 12207]
Maintain your `BRIEFING.md` and `progress.md` in your working directory.
Coordinate subagents (explorers, implementers, reviewers, etc.) to deliver, verify with automated/manual tests, and report completion when verified.

## Follow-up — 2026-09-10T17:23:23Z

# Teamwork Project Prompt — Draft

> Status: Launched
> Goal: Craft prompt → get user approval → delegate to teamwork_preview
> Requested team: Full team

Fix a bug in a Next.js project where modals are rendering incorrectly on mobile devices (appearing cut off and scrolled to the top, revealing only the bottom of the modal and a large portion of the page behind it). Note that this issue occurs on actual physical mobile devices and does not replicate by simply resizing the browser window on desktop.

Working directory: /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org

## Requirements

### R1. Fix Mobile Modal Rendering Bug
Ensure modals display fully centered and correctly sized on mobile browsers (accounting for mobile browser UI elements like address bars).
Analyze CSS/Tailwind rules (e.g., `vh` vs `dvh`, fixed positioning, overflow handling) that typically cause differences between desktop responsive modes and actual mobile devices.

## Verification Resources
Since the issue cannot be replicated on desktop responsive mode, rely on code analysis of mobile-specific CSS pitfalls (like `100vh` issues on iOS/Android browsers, fixed positioning within transformed parents, or overflow-y hidden on body). Run the Next.js app via `npm run dev` (or equivalent) for general layout checks.

## Acceptance Criteria

### Visual & Code Verification
- [ ] CSS uses reliable units/methods for mobile viewports (e.g., `dvh` or standard relative units) to prevent the modal from overflowing or clipping.
- [ ] Modals are fully visible when opened, without unwanted scrolling.
- [ ] Content inside the modal is correctly positioned and scrollable only if it exceeds the modal's internal height.

## Follow-up — 2026-09-10T19:02:31Z

# Teamwork Project Prompt — Draft

> Status: Launched
> Goal: Craft prompt → get user approval → delegate to teamwork_preview
> Requested team: Full team

Replace the current mass readings engine (which uses `evangelizo.org` XML feeds) with the `catholic-mass-readings` library. Ensure this new engine is used everywhere readings are displayed, supporting the active language if the library supports it.

Working directory: /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org
Integrity mode: development

## Requirements

### R1. Replace the API Backend Fetcher
Modify `src/app/api/mass-readings/route.ts` to fetch readings using the `catholic-mass-readings` package instead of the Evangelizo HTTP feed. Map the library's output to the existing `MassReadingsResponse` interface (or a compatible structure) so the frontend does not require major redesigns.

### R2. Language Support
Ensure that the language parameter (e.g., 'es', 'en') passed from the frontend is respected by the new library, if supported by the package.

### R3. Update Frontend (if necessary)
Ensure `LandingClient.tsx` correctly consumes the data from the updated API route and displays the First Reading, Psalm, Second Reading (if present), Alleluia, and Gospel.

## Acceptance Criteria

### API Contract
- [ ] A GET request to `/api/mass-readings` (with or without a language parameter) successfully returns a JSON object containing the daily readings.
- [ ] The returned JSON contains at least the `firstReading`, `psalm`, and `gospel` fields with `citation` and `text` sub-fields.

### UI Integration
- [ ] Running the local Next.js dev server shows the daily readings populated correctly in the UI.
- [ ] Clicking the "↻ Actualizar" button fetches and renders the readings without throwing React errors.

