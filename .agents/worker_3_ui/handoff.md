# Handoff Report — Milestones M2 & M3: Canonical Mass UI & Kinetic Stream Integration (`TSK-M6-02`, `TSK-M6-03`, `TSK-M6-04`, `TSK-M6-05` / `RF-08.2`, `RF-08.3`)

**Author**: Worker 3 (UI & Canonical Flow Engineer)  
**Date**: 2026-08-28T19:07:30Z  
**Reference Standards**: ISO/IEC/IEEE 42010:2022, ISO/IEC/IEEE 29148:2018, ISO/IEC/IEEE 12207:2017  
**Affected Artifacts**: `src/app/LandingClient.tsx`, `src/app/massResponses.ts`

---

## 1. Observation
- **Pre-Implementation State**:
  - `src/app/LandingClient.tsx` contained an isolated accordion dropdown (`showLecturasInResponses`, lines 566 & 2587-2644) inside Tab 2 (`respuestas`), separating daily readings from the Mass Ordinary.
  - In `src/app/massResponses.ts`, Section 2 ("Liturgia de la Palabra") contained static placeholder strings (`"(El lector proclama la primera lectura)"`, `"(El salmista o cantor proclama la antífona y las estrofas del salmo)"`) instead of dynamic scripture data.
  - In `src/app/LandingClient.tsx`, `AppleMusicLyrics` was passed static Ordinary lines, preventing synchronized kinetic reading during the Liturgy of the Word.
  - `fetchDailyReadings` was only triggered if `showGuiaMisa` was open and `activeGuiaTab === 'lecturas'`, rather than proactively on component mount.
  - Hero and Navigation buttons used generic tab routing rather than opening directly into Section 1 (Ritos Iniciales, index 0).
- **Post-Implementation Verification**:
  - `npm test`: Exited with code 0 (157/157 tests passing in 31ms).
  - `npm run build`: Exited with code 0 (Next.js 15.5.18 production build compiled cleanly with zero TypeScript errors or warnings).

---

## 2. Logic Chain

1. **Accordion Removal (`TSK-M6-02` / `RF-08.2`)**:
   - Removed `const [showLecturasInResponses, setShowLecturasInResponses] = useState(false);` from `src/app/LandingClient.tsx`.
   - Removed the collapsible `{dailyReadings && ( ... )}` accordion block from Tab 2 (`respuestas`).
   - Cleaned Tab 2 to render the 5 canonical Mass sections directly without redundant wrappers.

2. **Sequential Canonical Injection in Liturgia de la Palabra (`TSK-M6-03` / `RF-08.2`)**:
   - Implemented `getCanonicalMassSection` and `getCanonicalMassResponses` in `src/app/massResponses.ts`.
   - Formatted Section 2 ("Liturgia de la Palabra") according to exact GIRM sequence:
     1. **Primera Lectura (Sentados)**: Citation, full scripture text paragraphs, concluding dialogue (*"Palabra de Dios." / "Te alabamos, Señor."*).
     2. **Salmo Responsorial (Sentados)**: Citation, antiphon `R.` box, all verse stanzas paired with repeating `R.` responses without truncating verse 1.
     3. **Segunda Lectura (Sentados)**: Rendered conditionally on Sundays and Solemnities when `dailyReadings.secondReading` exists with non-empty text. Omitted gracefully on weekdays/Feria without leaving empty headers.
     4. **Aclamación del Evangelio / Aleluya (De pie)**: Seasonal Alleluia (*"¡Aleluya, aleluya!"* vs Lenten acclamation) with lectionary verse.
     5. **Proclamación del Santo Evangelio (De pie)**: Complete introductory dialogue (*"El Señor esté con ustedes..."*, *"Lectura del santo Evangelio según..."*), full Gospel text, concluding dialogue (*"Palabra del Señor." / "Gloria a ti, Señor Jesús."*), and secret priest prayer (*"Las palabras del Evangelio borren nuestros pecados."*).
     6. **La Homilía (Sentados)**.
     7. **Profesión de Fe — El Credo (De pie)**.
     8. **Oración Universal — Plegaria de los Fieles (De pie)**.

3. **Interactive Mode (`AppleMusicLyrics`) Kinetic Stream Feed (`TSK-M6-04` / `RF-08.2`)**:
   - Implemented `getCanonicalMassLines(sectionIdx, dailyReadings, lang)` in `src/app/massResponses.ts`.
   - Generates structured kinetic lines with appropriate speaker rubrics (`Lector`, `Salmista`, `Sacerdote`, `Pueblo`, `Todos`), duet alignments (`isLeft: true` for priest/lector/salmista, `isLeft: false` for assembly/people), and section delimiter tokens (`---SECTION---`).
   - Wired `lines={getCanonicalMassLines(activeMisaSectionIdx, dailyReadings, guiaLang)}` into `AppleMusicLyrics` modal in `src/app/LandingClient.tsx`.

4. **Direct Access Launcher & Mount Auto-Fetch (`TSK-M6-05` / `RF-08.3`)**:
   - Updated Hero "Guía de Misa" and "Seguir la Misa" buttons and Mobile Navigation drawer link in `LandingClient.tsx` to set `activeGuiaTab('respuestas')`, `activeMisaSectionIdx(0)`, and `setModalUrl('guia', { seccion: 'respuestas' })`.
   - Updated `useEffect` lifecycle hook to call `fetchDailyReadings()` proactively on initial client mount.
   - Added offline fallback indicator in `AppleMusicLyrics` subtitle when `dailyReadings.isFallback === true`.

---

## 3. Caveats
- No caveats. The implementation strictly adheres to bilingual rubrics (ES/EN), preserves all Roman Missal ordinary texts, and falls back cleanly if network readings are loading or unavailable.

---

## 4. Conclusion
Milestones M2 and M3 tasks (`TSK-M6-02`, `TSK-M6-03`, `TSK-M6-04`, `TSK-M6-05` satisfying requirements `RF-08.2` and `RF-08.3`) are 100% complete and verified. The Mass Guide now delivers a seamless, canonical, and kinetic liturgical experience with zero accordion friction.

---

## 5. Verification Method
To independently verify:
1. **Automated E2E Suite**:
   ```bash
   npm test
   ```
   *Expected Output*: Exit code 0, 157/157 tests pass across Tiers 1–5 in < 100ms.
2. **Next.js Production Compilation**:
   ```bash
   npm run build
   ```
   *Expected Output*: Exit code 0, all routes generated without TypeScript or runtime errors.
3. **Inspect Modified Files**:
   - `src/app/LandingClient.tsx`
   - `src/app/massResponses.ts`
