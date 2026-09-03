## 2026-08-28T18:57:54-06:00
You are Worker 2 (API Scraper & Backend Engineer).
Working Directory: /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/worker_2_api/
Original User Request: /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/ORIGINAL_REQUEST.md
Project Document: /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/PROJECT.md
Architecture Doc: /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/docs/architecture.md
SRS Doc: /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/docs/srs.md
Tasks Doc: /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/docs/tasks.md

EXCLUSIVELY OWNED FILE:
- `src/app/api/mass-readings/route.ts`

TASK:
Implement Milestone M1 (Task `TSK-M6-01` in `docs/tasks.md` and `RF-08.1` in `docs/srs.md`):
1. Overhaul `src/app/api/mass-readings/route.ts`:
   - Export full `MassReadingsResponse` TypeScript interface with `alleluia: { acclamation: string; verse: string; citation?: string; }`, `psalm: { citation: string; shortCitation?: string; response: string; text: string; stanzas?: string[]; }`, full `firstReading`, optional `secondReading` (Sundays/Solemnities), `gospel`, `meditation`, `isFallback`, and `source`.
   - Update `extractXmlTag` to decode all Spanish accented HTML/XML numerical and named entities (`&aacute;`, `&eacute;`, `&iacute;`, `&oacute;`, `&uacute;`, `&ntilde;`, `&laquo;`, `&raquo;`, `&#39;`, `&quot;`, `&nbsp;`, `&amp;`, `&lt;`, `&gt;`, `&#\d+;`) and clean CDATA blocks.
   - Fix the Psalm parser: Cleanly separate stanzas (`\n\n`), extract/generate the antiphon `response` without chopping or duplicating verse 1, and ensure full stanzas with line breaks are preserved in `text` and `stanzas`.
   - Implement Alleluia / Gospel Acclamation builder: Detect liturgical season from `litugic_t` / `date` (Lent vs Ordinary Time / Easter / Advent) to provide the appropriate acclamation ("¡Aleluya, aleluya!" vs "Honor y gloria a ti, Señor Jesús") and lectionary verse.
   - Update `FALLBACK_READINGS` to contain complete liturgical texts including Psalm 23 (all 4 stanzas with `R.`), 1st Reading, Gospel, and Alleluia.
   - Retain 6-second timeout (`AbortSignal.timeout(6000)`), 24h Next.js revalidation (`revalidate = 86400`), and proper HTTP Cache-Control headers.
2. Run build and tests to verify no syntax/type regressions:
   - `npm test`
   - `npm run build`
3. Write your handoff report to `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/worker_2_api/handoff.md`.
4. Send a message to parent when completed.
