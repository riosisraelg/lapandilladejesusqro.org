## 2026-09-10T23:19:08Z

TASK & OBJECTIVE (Milestone 3: Liturgical Transcript & Bilingual Responses):
1. In `src/data/guadalupe_transcript_2026_09_10.json`, store the cleaned timestamped transcript data from the Guadalupe Sept 10, 2026 Mass (video `EkoysbFU47c`).
2. In `src/data/liturgical_catalog_guadalupe.json`, create the authoritative structured catalog conforming to `SeguirMisaCatalog` in `src/types/seguir-misa.ts`:
   - Spans the complete Mass across all 10 liturgical sections:
     1. Rito Inicial / Canto de Entrada y Saludo
     2. Acto Penitencial (Confiteor / Kyrie)
     3. Gloria (noted as omitted per GIRM #53 for weekday votive mass)
     4. Oración Colecta
     5. Liturgia de la Palabra / Evangelio
     6. Homilía
     7. Oración Universal / de los Fieles
     8. Liturgia Eucarística / Presentación de Dones / Prefacio / Santo / Plegaria Eucarística II
     9. Rito de la Comunión / Padre Nuestro / Paz / Cordero de Dios
     10. Rito de Conclusión / Adoración
   - For every liturgical turn:
     - If the speaker is the priest: record `exactPriestSayingEs` with the exact verbatim quote extracted from the YouTube transcript, along with `timecode` and `timestampSeconds`.
     - Systematically pair priest parts with the corresponding bilingual assembly responses from `https://rejoiceinfaith.org/Mass_responses_in_English_and_Spanish` (`bilingualText: { es, en }`).
3. Implement `src/lib/seguir-misa-engine.ts`:
   - Methods to load catalog, retrieve steps by ID or index, filter turns by language mode (`both`, `es`, `en`), search priest exact sayings, and get paired responses.
4. Implement `src/app/api/seguir-misa/route.ts`:
   - App Router GET route returning the catalog or specific step/rite.
5. Create Programmatic Vitest Suites:
   - `tests/unit/priest-sayings.test.ts`:
     - Acceptance criterion: A programmatic test verifies that the application's output contains the priest's exact sayings extracted from the provided YouTube transcript.
     - Verifies exact verbatim phrases spoken by the celebrant at Basilica de Guadalupe on Sept 10, 2026, including greeting ("La paz y la caridad..."), intentions ("Ezequiel Mayagón López..."), Collect, Gospel intro ("Del santo evangelio..."), homily quote ("tercera guerra mundial a pedazos..."), Preface dialogue, Eucharistic consecration, Peace, and the dismissal note ("No habrá la bendición final porque acompañaremos al Señor en procesión...").
   - `tests/unit/bilingual-responses.test.ts`:
     - Acceptance criterion: A test verifies that the UI/model pairs the priest's parts with the corresponding bilingual (English and Spanish) assembly responses.
     - Tests pairing across Greeting, Penitential Act, Gospel Dialogue, Preface Dialogue, Memorial Acclamation, Lord's Prayer, Sign of Peace, and Ecce Agnus Dei.
6. Run `npm test` and `npm run build` in `/Users/riosisraelg/teamwork_projects/guadalupe_mass_interactive` to ensure all tests pass and build succeeds.
7. Commit changes to git.
8. Write a detailed handoff report to `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/worker_m3_liturgy/handoff.md`.
9. Report back to parent when done.
