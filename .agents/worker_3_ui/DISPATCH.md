## 2026-08-28T19:01:28Z
You are Worker 3 (UI & Canonical Flow Engineer).
Working Directory: /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/worker_3_ui/
Original User Request: /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/ORIGINAL_REQUEST.md
Project Document: /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/PROJECT.md
Architecture Doc: /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/docs/architecture.md
SRS Doc: /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/docs/srs.md
Tasks Doc: /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/docs/tasks.md
Survey Report: /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/explorer_2_survey_ui/handoff.md
API Scraper Handoff: /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/worker_2_api/handoff.md

EXCLUSIVELY OWNED FILES:
- `src/app/LandingClient.tsx`
- `src/app/massResponses.ts`

TASK:
Implement Milestones M2 & M3 (Tasks `TSK-M6-02`, `TSK-M6-03`, `TSK-M6-04`, `TSK-M6-05` in `docs/tasks.md` and requirements `RF-08.2`, `RF-08.3` in `docs/srs.md`):

1. **Accordion Removal (`TSK-M6-02`)**:
   - In `src/app/LandingClient.tsx`, remove the obsolete accordion `showLecturasInResponses` and its toggle button from Tab 2 (`respuestas`). Remove the unused state `showLecturasInResponses` if no longer needed.
   
2. **Canonical Sequential Injection in Liturgia de la Palabra (`TSK-M6-03`)**:
   - In `LandingClient.tsx` (and `massResponses.ts` if helper functions or structure updates are needed), dynamically inject live daily readings into Section 2 ("Liturgia de la Palabra") in exact GIRM canonical order:
     (1) Primera Lectura (Sentados) + Citation + Full Text + Dialogue ("Palabra de Dios." / "Te alabamos, Señor.")
     (2) Salmo Responsorial (Sentados) + Citation + Antiphon `R.` Box + All stanzas with recurring `R.` antiphon phrase
     (3) Segunda Lectura (Sentados) [Conditional: only rendered on Sundays/Solemnities when `dailyReadings.secondReading` exists with text. Omitted gracefully on weekdays/Feria without leaving empty boxes or broken layout] + Citation + Full Text + Dialogue ("Palabra de Dios." / "Te alabamos, Señor.")
     (4) Aclamación del Evangelio / Aleluya (De pie) + "¡Aleluya, aleluya!" (or Lenten acclamation from `dailyReadings.alleluia.acclamation`) + Gospel verse
     (5) Proclamación del Santo Evangelio (De pie) + Full dialogues ("El Señor esté con ustedes...", "Lectura del santo Evangelio según...") + Citation + Full Gospel Text + Concluding dialogue ("Palabra del Señor." / "Gloria a ti, Señor Jesús.")
     (6) La Homilía (Sentados)
     (7) Profesión de Fe (El Credo) (De pie)
     (8) Oración Universal / Plegaria de los Fieles (De pie)

3. **Interactive Mode (`AppleMusicLyrics`) Kinetic Stream Feed (`TSK-M6-04`)**:
   - Update the dynamic line array generator (such as `getCanonicalMassLines`) used by `AppleMusicLyrics` so that when `activeMisaSectionIdx === 1` ("Liturgia de la Palabra"), live readings are fed as clean kinetic lines with appropriate speaker rubrics (`Lector`, `Salmista`, `Sacerdote`, `Pueblo`, `Todos`) and section breaks.

4. **Direct Access Launcher & Auto-Fetch on Mount (`TSK-M6-05`)**:
   - Configure Hero "Guía de Misa" / "Seguir la Misa" buttons and Mobile Navigation drawer triggers to open the Mass modal directly at Section 1 (Ritos Iniciales, `activeMisaSectionIdx = 0` / standard modal).
   - In `LandingClient.tsx`, trigger `fetchDailyReadings()` proactively in a `useEffect` on initial component mount so readings are prefetched and cached in state.
   - Maintain clear loading indicator, fallback indicator (`isFallback === true`), and bilingual toggles (`es` / `en`).

5. **Build & Test Verification**:
   - Run `npm test` and `npm run build` to verify 100% clean compilation and no runtime or hydration errors.
6. Write your handoff report to `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/worker_3_ui/handoff.md`.
7. Send a message to parent when completed.
