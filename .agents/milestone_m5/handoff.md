# Milestone M5 Handoff Report: Rosary UI Overhaul & Vibrating Counter (Requirement R7)

## 1. Observation
- **Files Modified/Created**:
  - `src/data/oracionesData.ts`:
    - Updated interfaces (`PrayerCard`, `MysteryItem`, `RepeatedPrayer`) to support `biblicalRef`, `scriptureText`, `scriptureTextEn`, `reflectionQuestion`, `reflectionQuestionEn`, `image`, `repeatedPrayers`, and `subDeck`.
    - Populated all 20 mysteries across 4 mystery types (Gozosos, Luminosos, Dolorosos, Gloriosos) with complete 5-element fields (Artwork indicator key, Biblical citation reference, direct scripture text in ES/EN, deep meditation in ES/EN, and personal reflection question for the decade).
    - Untruncated all prayers across all variants (`mexicana`, `misionera`, `universal`, `latin`), eliminating ellipses (`...`) and providing complete canonical prayer texts (`PRAYERS_CANONICAL`).
    - Implemented dedicated sub-deck generators: `getRosarioOpeningDeck()`, `getRosarioMysteriesDeck()`, `getRosarioConcludingDeck()`, and `getSantoRosarioDeck(mysteryType, variant, subDeck)` supporting `'all' | 'opening' | 'mysteries' | 'concluding'`.
  - `src/components/RosarioArtworkIcons.tsx`:
    - Implemented curated SVG artwork indicators for all 20 mysteries with distinct symbolic iconography (e.g. Annunciation lilies/dove, Visitation embrace, Nativity Bethlehem star, Presentation Temple altar, Finding in the Temple scroll, Baptism Jordan waters, Cana water jars, Kingdom keys, Transfiguration Tabor light, Eucharist Chalice and Host, Agony in Gethsemane, Scourging at pillar, Crowning with thorns, Carrying the Cross, Crucifixion, Resurrection radiant tomb, Ascension clouds, Pentecost tongues of fire, Assumption of Mary, Coronation as Queen).
  - `src/components/GlobalModal.tsx`:
    - Added `headerAction?: React.ReactNode` prop to `GlobalModalProps` and positioned it in `.global-modal-header-actions` alongside the modal close button (`calendar-modal-close-btn`).
  - `src/app/LandingClient.tsx`:
    - Passed top-level vibrating counter button (`📿 count/10`) to `GlobalModal` as `headerAction` when `activeOracionDeck === 'rosario'`.
    - Implemented `handleIncrementDecadeCounter` with native device vibration (`navigator.vibrate([25])` for beads 1–9, `navigator.vibrate([15, 30, 15])` on decade completion at 10).
    - Added quick sub-deck switch bar (`[ Completo ] [ 1. Iniciales ] [ 2. 5 Misterios ] [ 3. Finales ]`).
    - Rendered 5 sequential mystery elements on every mystery card: (1) Artwork SVG indicator, (2) Biblical citation, (3) Direct scripture reading blockquote, (4) Contemplative meditation, (5) Personal reflection question for the decade.
    - Added collapsible nested repeats accordion for decade prayers (`Padre Nuestro`, `10 Ave Marías`, `Gloria al Padre`, `Jaculatorias`) with individual and "Toggle All" controls.
  - `src/app/global.css`:
    - Added complete responsive styling for `.global-modal-header-actions`, `.rosario-top-counter-btn`, `.rosario-subdeck-chips-bar`, `.rosario-subdeck-chip-btn`, `.rosario-mystery-5elements-container`, `.rosario-artwork-container`, `.rosario-element-section`, `.rosario-repeats-accordion`, and responsive typography.
  - `tests/m5_rosary_overhaul.test.mjs`:
    - Implemented 9 automated test suites verifying all aspects of Requirement R7.
- **Verification Results**:
  - `npm run build`: Exit code 0, clean build with zero TypeScript/lint errors.
  - `npm test`: 147/147 test cases passed (100% pass rate).
  - `node --test tests/m5_rosary_overhaul.test.mjs`: 9/9 tests passed (100% pass rate).

## 2. Logic Chain
1. *Requirement R7.1 (5-Element Mystery Cards)*: Each mystery must guide the faithful through a holistic contemplative structure. By augmenting `MISTERIOS_DATA` with dedicated fields for citation (`biblicalRef`), direct scripture (`scriptureText`, `scriptureTextEn`), meditation, and personal reflection questions for every single mystery in all 4 sets, and pairing them with curated SVG artwork indicators, the interactive cards provide a rich prayer experience.
2. *Requirement R7.2 (Untruncated Prayers & Collapsible Repeats)*: Ellipses (`...`) in prayer apps break rhythm. Replacing all truncated snippets with canonical full-text prayers (`PRAYERS_CANONICAL`) ensures uninterrupted reading. Structuring decade repetitions as collapsible nested items with count badges (`x10`, `x1`) allows both novice users to read full texts and experienced users to glance at summaries.
3. *Requirement R7.3 (Dedicated Sub-Decks)*: Users often want to pray just the 5 decades or specifically review opening/concluding prayers. Generating discrete sub-decks (`opening`, `mysteries`, `concluding`) alongside the unified `all` deck enables intuitive navigation via sub-deck chips without cluttering card flow.
4. *Requirement R7.4 (Top-Level Vibrating Counter)*: Placing the counter button in the top modal header adjacent to the close button (`GlobalModal`'s `headerAction`) guarantees it is always visible and accessible regardless of scroll position, while triggering `navigator.vibrate([25])` provides tactile feedback mimicking physical rosary beads.

## 3. Caveats
- `navigator.vibrate` is supported on mobile devices (Android/iOS web browsers supporting the Vibration API); on unsupported desktop environments, calls are wrapped in `try/catch` and fallback silently without breaking state.

## 4. Conclusion
Requirement R7 (Rosary UI Overhaul & Vibrating Counter) has been fully implemented, styled, integrated, and verified against all requirements with 100% test coverage and zero build errors.

## 5. Verification Method
1. Build verification:
   ```bash
   npm run build
   ```
   *Expected output*: Next.js build succeeds with code 0.
2. Complete E2E test suite:
   ```bash
   npm test
   ```
   *Expected output*: 147/147 tests passed.
3. Milestone M5 targeted test suite:
   ```bash
   node --test tests/m5_rosary_overhaul.test.mjs
   ```
   *Expected output*: 9/9 tests passed.
