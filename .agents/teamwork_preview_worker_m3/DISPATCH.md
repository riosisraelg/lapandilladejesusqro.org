# DISPATCH — Worker M3: Subproject 2 (Mass Transcript Mining & Curation Tool)

## Working Directory
`/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/teamwork_preview_worker_m3`

## Role & Mission
You are Worker M3. Your mission is to implement **Subproject 2: Mass Transcript Mining & Curation Tool** (`subprojects/mass-transcript-miner`):

1. **Extraction from `~/teamwork_projects/guadalupe_mass_interactive`**:
   - Extract proven transcript mining logic and datasets from `/Users/riosisraelg/teamwork_projects/guadalupe_mass_interactive` (`src/types/seguir-misa.ts`, `src/data/guadalupe_transcript_2026_09_10.json`, `src/data/liturgical_catalog_guadalupe.json`, `src/lib/seguir-misa-engine.ts`, and test suites).
   - Retain provenance comment headers in source files referencing the origin: `// Provenance: Extracted and adapted from ~/teamwork_projects/guadalupe_mass_interactive`.

2. **Subproject 2 Architecture (No separate git repository)**:
   - Directory: `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/subprojects/mass-transcript-miner`
   - `package.json`:
     - `"name": "mass-transcript-miner"`
     - `"type": "module"`
     - `"bin": { "transcript-curator": "src/index.js" }`
   - `src/types.ts`: Domain models (`LiturgicalTurn`, `SpeakerRole`, `LiturgicalRite`, `SeguirMisaStep`, `SeguirMisaCatalog`, `BilingualText`).
   - `src/ingest.ts`: Ingestion of raw YouTube transcripts (specifically video `EkoysbFU47c`, 5,413 cues for Basílica de Guadalupe, 2026-09-10). Filters out non-speech tags (`[Música]`, `[Aplausos]`).
   - `src/segmenter.ts`: Classifies raw cues into 10 canonical Roman rite steps (Rito Inicial through Rito de Conclusión) with timestamp boundaries.
   - `src/dialogue-matcher.ts`: Pairs celebrant utterances with 18 canonical Roman Missal assembly responses from `rejoiceinfaith.org`.
   - `src/chat-formatter.ts`: **Chat-Style Alignment Logic**:
     - Celebrant / Priest sayings $\rightarrow$ align right (`isLeft: false`, formatting to `.duet-right`).
     - Public / Assembly responses $\rightarrow$ align left (`isLeft: true`, formatting to `.duet-left`).
     - Output data structure explicitly supports this alignment contract needed for the main website's "Seguir misa" modal (`AppleMusicLyrics.tsx` / `global.css`).
   - `src/index.ts`: CLI/runner pipeline that processes transcripts and emits curated catalog.
   - Export curated catalog to `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/src/data/liturgical_catalog_guadalupe.json`.

3. **Testing**:
   - Implement programmatic test `subprojects/mass-transcript-miner/tests/mining-curation.test.ts`:
     - Ingests sample YouTube Mass transcript.
     - Verifies separation of priest sayings from public responses.
     - Verifies the output data structure explicitly supports the chat-style alignment logic (priest right / `isLeft: false`, public left / `isLeft: true`).
     - Verifies pairing with the 18 canonical assembly responses.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## References
- `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/ORIGINAL_REQUEST.md`
- `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/PROJECT.md`
- `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/docs/architecture.md`
- `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/docs/srs.md`
- `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/docs/tasks.md`

## Deliverable
Write your complete handoff report to:
`/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/teamwork_preview_worker_m3/handoff.md`
and notify the orchestrator.
