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

## Follow-up — 2026-09-10T23:11:12Z

# Teamwork Project Prompt — Draft

> Status: Launched
> Goal: Craft prompt → get user approval → delegate to teamwork_preview
> Requested team: Full team

Build a web application with its own repository to display daily Catholic Mass readings in Spanish (using the `rcolfin/catholic-mass-readings` structure) and interactive Mass responses/lyrics. It will generate a specific interactive guide for the Mass at the Basilica de Guadalupe (Sept 10, 2026) by combining the transcript of a provided YouTube video with standard English/Spanish Mass responses.

Working directory: `~/teamwork_projects/guadalupe_mass_interactive`
Integrity mode: development

## Requirements

### R1. Interactive "Seguir Misa" Guide
Create an interactive "seguir misa" (follow the mass) guide. Instead of building a generic new component, use a real example to capture the exact sayings of the priest: extract the transcript from the provided YouTube video (`https://www.youtube.com/watch?v=EkoysbFU47c`) for the Mass at the Basilica de Guadalupe (Sept 10, 2026). Combine the priest's exact words with the bilingual assembly responses from `https://rejoiceinfaith.org/Mass_responses_in_English_and_Spanish`.

### R2. Spanish Mass Readings Integration
The tool must provide the Spanish version of the actual daily mass readings for September 10, 2026. The current engine only has USCCB readings in English; you must implement the logic to integrate the Spanish equivalents, structuring the data based on the format used in the `rcolfin/catholic-mass-readings` repository.

## Acceptance Criteria

### Interactive Guide Verification
- [ ] A programmatic test verifies that the application's output contains the priest's exact sayings extracted from the provided YouTube transcript.
- [ ] A test verifies that the UI pairs the priest's parts with the corresponding bilingual (English and Spanish) assembly responses.
- [ ] An automated browser test (or similar script) verifies that an interactive element exists that allows the user to follow along ("seguir misa").

### Spanish Readings Verification
- [ ] A test verifies that the application successfully retrieves or displays the Spanish version of the readings for September 10, 2026.
- [ ] A programmatic test verifies that the Spanish readings data structure matches the `rcolfin/catholic-mass-readings` format.

## Follow-up — 2026-09-11T05:44:45Z

# Teamwork Project Prompt — Draft

> Status: Launched
> Goal: Craft prompt → get user approval → delegate to teamwork_preview
> Requested team: Full team

Create two distinct subprojects within `lapandilladejesusqro.org`: (1) a version-controlled, open-source Spanish liturgy scraper inspired by `catholic-mass-readings`, and (2) a transcript data-mining tool to curate bilingual Mass dialogues for the "Seguir misa" interactive lyrics modal.

Working directory: `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org`
Integrity mode: development

## Requirements

### R1. Subproject 1: Open Source Spanish Liturgy Scraper
Create a subproject directory for the Spanish USCCB daily mass scraper. Initialize it as its own Git repository. Use the GitHub CLI (`gh`) to create a public repository and push the main branch. Apply a Calendar Versioning (CalVer) tag (format: `YYYY.MM.MINOR`). Use the `rcolfin/catholic-mass-readings` repository as architectural inspiration for building this tool.

### R2. Subproject 2: Mass Transcript Mining & Curation Tool
Create a second subproject (without its own git repository) dedicated to mining, curating, and debugging the structure of the Mass from YouTube videos (English and Spanish). It must process transcripts to identify liturgical structure (songs, readings, psalms) and separate the dialogue between the priest and the public. The ultimate goal is to archive these transcripts to define a definitive bilingual base for the main website's "Seguir misa" modal (where priest sayings align right, public left).

### R3. Scraper Integration
Integrate the newly built Spanish liturgy scraper (from Subproject 1) with the existing English USCCB scraper currently running in the `lapandilladejesusqro.org` repository. Ensure the main website can access both data sources to power its bilingual features.

### R4. Codebase Extraction & Separation
Read the source code in `~/teamwork_projects/guadalupe_mass_interactive`. Extract and separate the logic found there to form the basis of both subprojects. Specifically, Subproject 2 must utilize the English scraper from GitHub alongside the proven Spanish scraping logic that already exists in the `guadalupe` folder. Refine this existing Spanish logic if necessary, but do not build it from scratch.

## Acceptance Criteria

### Subproject 1 (Scraper)
- [ ] A programmatic test verifies that the Spanish scraper successfully fetches and parses readings.
- [ ] A shell script verifies that a git repository is initialized in the subproject directory, a remote origin is set, and a CalVer tag is present on the main branch.

### Subproject 2 (Mining Tool)
- [ ] A programmatic test verifies that the mining tool can ingest a sample YouTube Mass transcript and output a structured format that separates the priest's sayings from the public's responses.
- [ ] The output data structure explicitly supports the required chat-style alignment logic (priest vs public) needed for the "Seguir misa" modal.

### Scraper Integration
- [ ] A programmatic test verifies that the `lapandilladejesusqro.org` application successfully calls both the existing English scraper and the new Spanish scraper, outputting a combined dataset for a specific date.

### Codebase Extraction
- [ ] A manual review or script confirms that the Spanish scraping logic utilized in the subprojects originates from the tested code in `~/teamwork_projects/guadalupe_mass_interactive`.
