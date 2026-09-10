# Plan: Replace Mass Readings Engine with catholic-mass-readings

## Objective
Replace current Evangelizo HTTP/XML scraper with the `catholic-mass-readings` library in `src/app/api/mass-readings/route.ts`, maintain backwards compatibility for the UI (`LandingClient.tsx` and related components), support language preferences ('es', 'en'), update ISO-compliant documentation (`docs/architecture.md`, `docs/srs.md`, `docs/tasks.md`), and thoroughly test and audit.

## Architecture & Boundaries
- Backend API: `src/app/api/mass-readings/route.ts`
- Frontend Consumer: `src/components/LandingClient.tsx` (and any related components displaying readings)
- Documentation: `docs/architecture.md`, `docs/srs.md`, `docs/tasks.md`
- Tests: E2E and unit test suites validating API contract and UI rendering

## Execution Strategy
- Stage 0: Survey & Technical Exploration
  - Dispatch Explorers to inspect `catholic-mass-readings` package capabilities, types, exports, language support, and current route implementation & frontend usage.
- Stage 1: ISO Documentation & Task Matrix Alignment
  - Worker updates `docs/architecture.md` (ISO/IEC/IEEE 42010), `docs/srs.md` (ISO/IEC/IEEE 29148), `docs/tasks.md` (ISO/IEC/IEEE 12207).
- Stage 2: Implementation & Package Installation
  - Worker installs/verifies `catholic-mass-readings` package if needed.
  - Worker adapts `src/app/api/mass-readings/route.ts` to use `catholic-mass-readings`, mapping into `MassReadingsResponse`.
  - Worker verifies language parameter handling ('es', 'en') and fallback.
  - Worker updates frontend components (`LandingClient.tsx`) to ensure complete rendering (First Reading, Psalm, Second Reading, Alleluia, Gospel) and working refresh button without React errors.
- Stage 3: Verification & Auditing
  - Reviewers assess code quality, type correctness, error handling.
  - Challengers execute automated API calls and UI checks.
  - Forensic Auditor verifies authentic implementation without cheating or mocks.
- Stage 4: Final Synthesis & Sentinel Handoff.
