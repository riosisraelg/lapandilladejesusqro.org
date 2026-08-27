## 2026-08-27T06:39:33Z

You are the E2E Test Writer for lapandilladejesusqro.org.
Working directory: /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/e2e_testing_track/
Project root: /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org
Authoritative Request: /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/ORIGINAL_REQUEST.md
Test Infrastructure Plan: /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/TEST_INFRA.md
Master Project Plan: /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/PROJECT.md
Requirements Spec: /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/docs/srs.md

Task:
Implement the complete, executable 4-tier E2E test suite in `scripts/test-e2e.mjs` (runnable via `node scripts/test-e2e.mjs`):
1. **Tier 1 — Feature Coverage (≥ 50 test cases, ≥ 5 per requirement R1-R10)**:
   - R1: Meal prayers for Domingo through Sábado, before & after texts, versicles & responses.
   - R2: Day-of-week index mapping (0=Domingo to 6=Sábado), card generation, Spanish default.
   - R3: Infinite deck loop modulo logic.
   - R4: Dynamic HSL brand tone calculation.
   - R5: Long-press threshold, event handlers, and haptic trigger calls.
   - R6: OG image endpoint parameters and event ID URL routing.
   - R7: 5-element mystery sequence validation, untruncated texts, collapsible repeats, vibrating counter logic.
   - R8: Mass guide standalone layout, Liturgy of the Word, priest communion dialogues, Mexican sung songs, scraper XML parser.
   - R9: Misas de Precepto Holy Days calculation (Computus), Canon 1246 & CEM, export formats (Google, Apple, Outlook, Yahoo).
   - R10: Verification runner and automated check.
2. **Tier 2 — Boundary & Corner Cases (≥ 50 test cases)**:
   - Edge days (Saturday to Sunday rollover, Leap year Computus, midnight time boundaries, missing optional fields, offline scraper fallback).
3. **Tier 3 — Cross-Feature Combinations (≥ 15 pairwise interaction tests)**:
   - Feature interactions across Decks + Rosary, Events + OG + Calendar Export, Mass Scraper + Lyrics viewer.
4. **Tier 4 — Real-World Application Scenarios (≥ 8 complete user journey tests)**.

Execute `node scripts/test-e2e.mjs` to verify test harness execution.
When ready, create `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/TEST_READY.md` with the full coverage summary and test command.

Write your report to `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/e2e_testing_track/handoff.md`.
Update `.agents/e2e_testing_track/progress.md` with your status.
Send a completion message when finished.
