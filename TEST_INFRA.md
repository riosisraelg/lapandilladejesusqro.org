# E2E Test Infra: lapandilladejesusqro.org

## Test Philosophy
- **Opaque-box, requirement-driven**: Derived directly from `ORIGINAL_REQUEST.md` and user-facing specifications (R1–R10).
- **Methodology**: Category-Partition + Boundary Value Analysis + Pairwise Combinations + Real-World Application Scenarios + Automated Integration Harness.

## Feature Inventory & Test Coverage Goals
| # | Feature | Requirement | Tier 1 (Min 5) | Tier 2 (Min 5) | Tier 3 (Pairwise) | Tier 4 (Real-World) |
|---|---------|-------------|:--------------:|:--------------:|:-----------------:|:-------------------:|
| 1 | Food Prayers Transcription (R1) | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | ✓ |
| 2 | Auto-Day Selection & Decks (R2) | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ | ✓ |
| 3 | Infinite Swipe Animations (R3) | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ | ✓ |
| 4 | Dynamic Color Tones (R4) | ORIGINAL_REQUEST §R4 | 5 | 5 | ✓ | ✓ |
| 5 | Long-Press Tooltips (R5) | ORIGINAL_REQUEST §R5 | 5 | 5 | ✓ | ✓ |
| 6 | Event OG Images & Modals (R6) | ORIGINAL_REQUEST §R6 | 5 | 5 | ✓ | ✓ |
| 7 | Rosary UI & Counter (R7) | ORIGINAL_REQUEST §R7 | 5 | 5 | ✓ | ✓ |
| 8 | Mass Guide & Liturgy Scraper (R8) | ORIGINAL_REQUEST §R8 | 5 | 5 | ✓ | ✓ |
| 9 | Misas de Precepto & Calendar (R9) | ORIGINAL_REQUEST §R9 | 5 | 5 | ✓ | ✓ |
| 10 | Autonomous Commits & Tags (R10) | ORIGINAL_REQUEST §R10 | 5 | 5 | ✓ | ✓ |

## Test Architecture
- Test runner: Automated Node/TypeScript test suites executable via `node --test` or custom runner script (`scripts/test-e2e.mjs` / `npm run test`).
- Assertions verify:
  1. Complete 7-day Spanish meal prayer text presence, versicles, and responses.
  2. Auto-day selection date mapping (Sunday=0 to Saturday=6).
  3. Dynamic HSL tone generation logic and circular modulo deck indexing.
  4. Global long-press duration and haptic feedback invocation.
  5. Dynamic OG image generation endpoint HTTP 200 response and valid PNG headers.
  6. 5-element mystery sequence structure and decade counter increment/vibrate logic.
  7. Liturgy scraper API XML parsing, Priest dialogues, and Mexican hymns.
  8. Misas de Precepto Computus algorithm and multi-calendar export formatting (Google, Apple, Outlook, Yahoo).
  9. Clean Next.js 15 build execution (`npm run build`).

## Tier Breakdown & Coverage Metrics
- **Tier 1 (Feature Coverage)**: ≥ 50 test cases (5 per feature × 10 features).
- **Tier 2 (Boundary & Corner Cases)**: ≥ 50 test cases (Edge days, leap years, offline scraper fallback, extreme drag thresholds).
- **Tier 3 (Cross-Feature Combinations)**: ≥ 15 pairwise interaction tests (Deck navigation + Dynamic color, Rosary deck + Top counter, Misas de Precepto + OG preview + Add-to-calendar).
- **Tier 4 (Real-World Application Scenarios)**: ≥ 8 comprehensive user workflow test scenarios.
- **Tier 5 (Adversarial Coverage Hardening)**: White-box adversarial testing verifying edge error boundaries and regression guards.
