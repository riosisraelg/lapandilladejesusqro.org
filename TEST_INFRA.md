# E2E Test Infra: Mass Readings Scraper & Canonical Mass Guide Integration

## Test Philosophy
- Zero-dependency Node.js ESM test suite in `scripts/test-e2e.mjs` executed via `npm test`.
- Opaque-box, requirement-driven testing mapped to ISO 29148 requirements (R1, R2, R3).
- Fast execution (<100ms) with native assertions (`node:assert/strict`).

## Feature Inventory & Test Mapping
| # | Feature | Requirement | Tier 1 (Unit) | Tier 2 (Boundary) | Tier 3 (Pairwise) | Tier 4 (Scenario) | Tier 5 (Adversarial) |
|---|---|---|:---:|:---:|:---:|:---:|:---:|
| 1 | Full Liturgical Parser | R1 | 8 | 4 | 2 | 2 | 2 |
| 2 | Psalm Response & Multi-Stanza | R1 | 4 | 3 | 2 | 1 | 2 |
| 3 | Sunday 2nd Reading Conditional | R1, R2 | 3 | 2 | 2 | 2 | 1 |
| 4 | Alleluia & Seasonal Acclamation | R1, R2 | 3 | 2 | 1 | 1 | 1 |
| 5 | Entity Decoding & CDATA | R1 | 3 | 3 | 1 | 1 | 2 |
| 6 | Offline / 500 Fallback | R1 | 2 | 2 | 1 | 2 | 1 |
| 7 | Accordion Removal | R2 | 2 | 1 | 1 | 1 | 1 |
| 8 | Canonical Sequential Injection | R2 | 6 | 3 | 3 | 2 | 1 |
| 9 | Direct Access & Auto-Fetch | R3 | 4 | 2 | 3 | 2 | 1 |
| 10 | Bilingual Support & UI State | R2, R3 | 3 | 2 | 2 | 1 | 1 |

## Test Architecture
- **Runner**: `scripts/test-e2e.mjs`
- **Invocation**: `npm test` or `node scripts/test-e2e.mjs`
- **Output Format**: Concise grouped CLI reporting with timing, suite breakdown, and strict assertion traces.

## Coverage Thresholds
- **Tier 1 (Feature Coverage)**: ≥75 tests (100% pass)
- **Tier 2 (Boundary & Corner Cases)**: ≥65 tests (100% pass)
- **Tier 3 (Cross-Feature Combinations)**: ≥23 tests (100% pass)
- **Tier 4 (Real-World Application Scenarios)**: ≥13 tests (100% pass)
- **Tier 5 (Adversarial & Hardening)**: ≥13 tests (100% pass)
- **Total Suite Minimum**: ≥189 tests with 100% pass rate and clean build (`npm run build`).
