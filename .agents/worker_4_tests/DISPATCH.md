## 2026-08-28T19:07:05Z
Implement Milestone M4 (Task TSK-M6-06 in docs/tasks.md and verification criteria in TEST_INFRA.md):
1. Overhaul and expand `scripts/test-e2e.mjs` to add comprehensive, robust tests across all 5 tiers covering:
   - Tier 1 (Feature Coverage):
     - Scraper parser engine tests (1st Reading, Gospel, Psalm response and all stanzas, seasonal Alleluia vs Lent, CDATA, Spanish entity decoding &aacute;, &eacute;, &iacute;, &oacute;, &uacute;, &ntilde;, &laquo;, &raquo;, &#39;, &quot;, &#\d+;, &#x[0-9a-fA-F]+;).
     - Canonical sequential injection tests in `getCanonicalMassSection` and `getCanonicalMassLines` (1st Reading → Psalm with R. and all stanzas → conditional Sunday 2nd Reading → Alleluia → Gospel → Homily → Creed → Universal Prayer).
     - Confirmation of accordion deletion from `LandingClient.tsx` (no `showLecturasInResponses`).
     - Direct access configuration & mount auto-fetch in `LandingClient.tsx`.
   - Tier 2 (Boundary & Corner Cases):
     - Weekday (2 readings) vs Sunday/Solemnity (3 readings with `secondReading`).
     - Multi-stanza psalm with repeating `R.` antiphon phrase across multiple stanzas.
     - Lenten liturgical title detecting "Honor y gloria a ti, Señor Jesús" vs Ordinary Time "¡Aleluya, aleluya!".
     - Offline / malformed upstream XML fallback to `FALLBACK_READINGS`.
     - Extreme whitespace, missing tags, empty CDATA blocks.
   - Tier 3 (Pairwise & Cross-Feature Interactions):
     - Full pipeline: Scraper payload → `getCanonicalMassResponses` → `getCanonicalMassLines` → AppleMusicLyrics line stream.
     - Bilingual toggle: `lang: 'es'` vs `lang: 'en'` speaker rubrics and section titles.
   - Tier 4 (Real-World Application Scenarios / User Journeys):
     - Sunday Mass Journey with full assembly dialogue and 2nd reading.
     - Weekday Mass Journey (Feria) with clean omission of 2nd reading.
     - Offline parishioner journey with fallback Psalm 23 and 4 stanzas.
   - Tier 5 (Adversarial Stress & Hardening):
     - Fuzzed XML tags, simulated script tags in citations sanitized safely.
     - Edge date strings (leap days, single digits, formatted dates).
2. Ensure the test suite reaches at least 189 tests with 100% pass rate.
3. Run the test suite (`node scripts/test-e2e.mjs` / `npm test`) and run production build (`npm run build`) to verify everything passes.
4. Write your handoff report to `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/worker_4_tests/handoff.md`.
5. Send a message to parent when completed.
