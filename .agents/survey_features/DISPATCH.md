## 2026-08-27T05:54:03Z

Investigate the existing domain features and data structures related to requirements R5-R9:
1. Rosary (R7): Inspect src/data/oracionesData.ts and related files. How are mysteries, citations, texts, repetitions, counters, and decks structured?
2. Mass Guide & Scraper (R8): Inspect src/app/massResponses.ts, src/app/cancioneroArchive.ts, existing Mass guide UI. Investigate priest dialogues (especially Communion), Mexican sung versions (Gloria, etc.), and viable sources/APIs/scrapers for daily liturgical readings (Salmos, Lecturas) (e.g., USCCB, Vatican, evangelizo, rezandovoy, or direct liturgical feeds/scrapers).
3. Misas de Precepto & Calendar (R9): Inspect src/app/calendario/, src/app/api/calendar/route.ts, src/utils/icalParser.ts. Detail all Catholic Holy Days of Obligation (Misas de Precepto) according to the Code of Canon Law (Canon 1246) and the Mexican Episcopal Conference (CEM) / Universal calendar. Design the event modal and calendar export (.ics / Google Calendar / Apple Calendar).
4. OG Image Preview & Events (R6): Inspect existing event structures, URLs, modal triggers, and Next.js @vercel/og / next/og ImageResponse capabilities.

Write your comprehensive investigation report to /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/survey_features/handoff.md.
Update .agents/survey_features/progress.md with your status.
Send a completion message when finished.
