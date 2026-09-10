## 2026-09-10T19:03:00Z

<USER_REQUEST>
You are the Project Orchestrator for the task: Replace Mass Readings Engine with catholic-mass-readings.

Authoritative Request: Read /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/ORIGINAL_REQUEST.md for full details.
Your working directory: /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/orchestrator_3
Project root: /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org

Task Summary:
Replace the current mass readings engine (which uses `evangelizo.org` XML feeds) with the `catholic-mass-readings` library. Ensure this new engine is used everywhere readings are displayed, supporting the active language if the library supports it.

Key Requirements:
1. R1: Replace the API Backend Fetcher: Modify `src/app/api/mass-readings/route.ts` to fetch readings using the `catholic-mass-readings` package instead of the Evangelizo HTTP feed. Map the library's output to the existing `MassReadingsResponse` interface (or a compatible structure) so the frontend does not require major redesigns.
2. R2: Language Support: Ensure that the language parameter (e.g., 'es', 'en') passed from the frontend is respected by the new library, if supported by the package.
3. R3: Update Frontend: Ensure `LandingClient.tsx` (and any other components where readings are displayed) correctly consumes the data from the updated API route and displays the First Reading, Psalm, Second Reading (if present), Alleluia, and Gospel.

Acceptance Criteria:
- A GET request to `/api/mass-readings` (with or without a language parameter) successfully returns a JSON object containing the daily readings.
- The returned JSON contains at least the `firstReading`, `psalm`, and `gospel` fields with `citation` and `text` sub-fields.
- Daily readings populate correctly in the UI.
- Clicking the "↻ Actualizar" button fetches and renders the readings without throwing React errors.

Engineering Standards:
- Apply the software engineering standards:
  - System Architecture (`docs/architecture.md`) [ISO/IEC/IEEE 42010]
  - Software Requirements Specification (`docs/srs.md`) [ISO/IEC/IEEE 29148]
  - Execution Plan & Atomic Task Matrix (`docs/tasks.md`) [ISO/IEC/IEEE 12207]
- Maintain your `BRIEFING.md`, `plan.md`, and `progress.md` in `.agents/orchestrator_3/`.
- Coordinate subagents (explorers, workers/implementers, reviewers/challengers, testers).
- Ensure thorough automated and regression testing passes.
- When all criteria are met and verified, deliver your completion report / handoff back to the Sentinel.
</USER_REQUEST>
