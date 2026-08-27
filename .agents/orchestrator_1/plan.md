# Orchestration Plan - lapandilladejesusqro.org

## Objective
Deliver full implementation of R1-R10 adhering to ISO/IEC/IEEE standards, dual-track verification, complete test passing, and automated release.

## Execution Strategy
1. **Phase 0: Survey & Technical Manuals**
   - Explorer 1 (`survey_codebase`): Map Next.js 15 app router architecture, Deck components, Modals, styling, global state.
   - Explorer 2 (`survey_features`): Map Rosary data/components, Mass guide, Calendar integration (RRule, iCal parser, API routes), and scraping targets.
   - Spec Miner (`transcribe_prayers`): Inspect all 18 images in `/Users/riosisraelg/.gemini/antigravity-cli/brain/d4899b3d-c841-45a4-aff4-f09be1bad826/.user_uploaded/` and extract exact Spanish text for "Antes de las comidas" and "Después de las comidas" for every day of the week (Sunday to Saturday).
   - Author ISO/IEC/IEEE 42010 Architecture (`docs/architecture.md`), ISO/IEC/IEEE 29148 SRS (`docs/srs.md`), and ISO/IEC/IEEE 12207 Task Plan (`docs/tasks.md`), plus `PROJECT.md` and `TEST_INFRA.md`.

2. **Phase 1: E2E Test Suite Development (Parallel Track)**
   - E2E Testing Track creates test infrastructure and 4-tier test suite based on requirements.
   - Outputs `TEST_READY.md`.

3. **Phase 2: Milestone Decomposition & Iteration Loops**
   - **M1 (Food Prayers)**: Replace food prayers in data with transcribed text, Sunday-Saturday, auto-day selection, Spanish default.
   - **M2 (Deck Navigation & Styling)**: Minimalist swipe gesture, infinite loop transition, dynamic HSL brand color tones.
   - **M3 (Global Long-Press Tooltips)**: Reusable long-press hook/component applied across all interactive buttons.
   - **M4 (Event OG Images & Shareable URLs)**: Dynamic OG image generation route (`/api/og/event` or Next.js ImageResponse) and unique shareable URL routing opening layered modals.
   - **M5 (Rosary UI Overhaul)**: 5 mystery components (image, citation, direct text, meditation, reflection question), untruncated prayer text, collapsible nested repeats, dedicated decks for main/self prayers, top-level vibrating counter button.
   - **M6 (Mass Guide & Daily Scraper)**: Standalone button, completed priest dialogues, Mexican sung songs (Gloria, etc.), daily scraping API/service with trusted Catholic sources fallback.
   - **M7 (Misas de Precepto & Calendar)**: Research all Holy Days of Obligation, inject into annual Jesus calendar, layered modal with native calendar export/sync.

4. **Phase 3: E2E Verification & Adversarial Coverage Hardening**
   - Pass 100% of Tiers 1-4 tests.
   - Phase 2 adversarial stress testing (Tier 5).

5. **Phase 4: Granular Git Commits & Remote Deployment**
   - Ensure granular semantic commits with semantic version tags.
   - Push to remote repository per R10.
   - Publish final summary report.
