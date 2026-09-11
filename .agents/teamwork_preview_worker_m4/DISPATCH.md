# DISPATCH — Worker M4: Scraper Integration & Bilingual Host Wiring

## Working Directory
`/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/teamwork_preview_worker_m4`

## Role & Mission
You are Worker M4. Your mission is to implement **Scraper Integration** in `lapandilladejesusqro.org` and establish the unified test suites:

1. **Workspace & TypeScript Linkage**:
   - In root `package.json`, ensure `workspaces: ["subprojects/*"]` and/or `"spanish-mass-readings": "file:./subprojects/spanish-mass-readings"`.
   - In `tsconfig.json`, configure path alias for `"spanish-mass-readings"` pointing to `["./subprojects/spanish-mass-readings/src/index.ts"]` and/or `["./subprojects/spanish-mass-readings/dist/index.d.ts"]`.

2. **Upgrade `src/app/api/mass-readings/route.ts`**:
   - Import `USCCBSpanish` and related models from `spanish-mass-readings`.
   - Import `USCCB` from `catholic-mass-readings`.
   - Read `lang` query parameter (`lang = searchParams.get('lang')?.toLowerCase() || 'es'`).
   - If `lang === 'es'` (or Spanish default):
     - Query `USCCBSpanish.getMassFromDate(dateObj)`
     - Map the Spanish lectionary sections into `MassReadingsResponse` (Primera lectura, Salmo Responsorial with response antiphon and text, Segunda lectura if present, Aleluya, Evangelio).
     - Set `language: 'es'`, `source: 'spanish-mass-readings'`, `isFallback: false`.
   - If `lang === 'en'`:
     - Query existing `USCCB.getMassFromDate(dateObj)` from `catholic-mass-readings`.
     - Map sections into `MassReadingsResponse`.
     - Set `language: 'en'`, `source: 'catholic-mass-readings'`, `isFallback: false`.
   - If `lang === 'both'` or `lang === 'bilingual'`:
     - Concurrently invoke both `USCCBSpanish` and `USCCB` via `Promise.allSettled` or `Promise.all`.
     - Return a combined bilingual dataset containing both English and Spanish readings for the requested date (e.g. `readings: { es: ..., en: ... }` along with top-level fields for backwards compatibility with `MassReadingsResponse`).
     - Set `language: 'bilingual'`, `source: 'dual-scraper'`.
   - Preserve error handling and fallback resilience (`FALLBACK_READINGS`).

3. **Frontend Compatibility**:
   - Ensure `LandingClient.tsx` and `AppleMusicLyrics.tsx` continue to work seamlessly without errors.
   - Confirm chat-style alignment in "Seguir misa" modal: celebrant sayings align right (`.duet-right`), public responses align left (`.duet-left`).

4. **Automated Integration Tests & Scripts**:
   - Programmatic test: `tests/integration/scraper-integration.test.ts` (or runnable script `scripts/test-scraper-integration.mjs`) verifying:
     - Calling the API route handler / underlying scrapers for English (`lang=en`).
     - Calling for Spanish (`lang=es`).
     - Calling for combined bilingual dataset (`lang=both` / `lang=bilingual`) and verifying combined output for a specific date (e.g. `2026-09-10`).
   - Codebase Extraction Provenance Verification script:
     - Create `scripts/verify-extraction-provenance.mjs` that inspects `subprojects/spanish-mass-readings` and `subprojects/mass-transcript-miner`, verifying that the Spanish scraping logic and transcript curation logic originated from `~/teamwork_projects/guadalupe_mass_interactive`.
   - Master Acceptance Verification script:
     - Create `scripts/verify-all-acceptance.sh` executing all acceptance criteria checks:
       1. Subproject 1 programmatic test
       2. Subproject 1 git, remote, and CalVer tag
       3. Subproject 2 transcript ingestion, dialogue separation, and chat alignment data structure
       4. Scraper integration dual-call combined dataset
       5. Codebase extraction provenance confirmation

5. **Regression Verification**:
   - Run `npx tsc --noEmit` -> ensure 0 errors.
   - Run `node scripts/test-e2e.mjs` -> ensure all 217 tests pass.
   - Run `node scripts/adversarial-mobile-viewport-suite.mjs` and `node scripts/modal-scroll-stress-suite.mjs` -> ensure all checks pass.
   - Run `npm run build` -> ensure Next.js production build succeeds.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## References
- `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/ORIGINAL_REQUEST.md`
- `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/PROJECT.md`
- `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/docs/architecture.md`
- `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/docs/srs.md`
- `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/docs/tasks.md`

## 2026-09-11T06:10:18Z
You are Worker M4 (Scraper Integration & Bilingual Host Wiring).
Your working directory is:
/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/teamwork_preview_worker_m4

MANDATORY FIRST STEP:
Read /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/ORIGINAL_REQUEST.md and /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/orchestrator_5/DISPATCH.md, and your local task assignment at /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/teamwork_preview_worker_m4/DISPATCH.md.
Also read handoffs from Worker M2 (/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/teamwork_preview_worker_m2/handoff.md) and Worker M3 (/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/teamwork_preview_worker_m3/handoff.md), as well as docs/architecture.md, docs/srs.md, docs/tasks.md, and PROJECT.md.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

TASK:
1. Link subprojects/spanish-mass-readings in root package.json and tsconfig.json.
2. Upgrade src/app/api/mass-readings/route.ts to route to USCCBSpanish (lang=es), catholic-mass-readings USCCB (lang=en), and both concurrently (lang=both or lang=bilingual) returning a combined dataset for the date while preserving the MassReadingsResponse shape and fallback resilience.
3. Ensure LandingClient.tsx and AppleMusicLyrics.tsx work seamlessly with the upgraded route and chat alignment (.duet-right for celebrant, .duet-left for public).
4. Implement programmatic integration test (scripts/test-scraper-integration.mjs or tests/integration/scraper-integration.test.ts) verifying the application successfully calls both existing English scraper and new Spanish scraper, outputting combined dataset for a specific date.
5. Create provenance verification script (scripts/verify-extraction-provenance.mjs) verifying Spanish scraping logic originated from ~/teamwork_projects/guadalupe_mass_interactive.
6. Create master acceptance verification script (scripts/verify-all-acceptance.sh) verifying all 5 acceptance criteria.
7. Run all tests (npm run test, mobile viewport stress, modal scroll stress, npx tsc --noEmit, and npm run build).

Update progress.md in your working directory as you work.
Write your complete handoff report to:
/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/teamwork_preview_worker_m4/handoff.md
When done, message the caller with your completion status.


## Deliverable
Write your complete handoff report to:
`/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/teamwork_preview_worker_m4/handoff.md`
and notify the orchestrator.
