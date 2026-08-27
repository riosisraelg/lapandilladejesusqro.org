# Dispatch Assignment — Milestone M6

## 2026-08-27T00:49:46-06:00
Role: Milestone M6 Implementation Worker (Mass Guide Standalone Button, Mexican Sung Hymns & Daily Mass Scraper)
Working directory: /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/milestone_m6/
Project root: /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org
Authoritative Request: /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/ORIGINAL_REQUEST.md
Domain Survey: /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/survey_features/handoff.md
Master Project Plan: /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/PROJECT.md
Architecture Doc: /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/docs/architecture.md
SRS Doc: /Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/docs/srs.md

Task:
Implement Requirement R8 (Mass Guide Enhancements & Daily Scraping):
1. Liturgical Content Completion (`src/app/massResponses.ts`):
   - Add complete Liturgia de la Palabra dialogue and readings structure.
   - Complete missing priest dialogues (especially during Communion: Fractio Panis, private priest prayers before and after communion, vessel purification, dismissal).
   - Add traditional Mexican sung versions of prayers (Gloria de Mejía, Santo, Cordero de Dios tradicional mexicano).
2. Daily Mass Liturgy Scraper API (`src/app/api/mass-readings/route.ts`):
   - Create Next.js serverless route fetching daily mass readings (Lecturas, Salmo responsorial, Evangelio, comentario) from Evangelizo XML feed (`http://feed.evangelizo.org/v2/reader.php?date=YYYYMMDD&lang=SP&type=xml`).
   - Include caching (`revalidate: 86400`) and fallback for offline / common masses.
3. Standalone Mass Guide Button (`src/app/LandingClient.tsx`):
   - Make the Mass Guide a prominent standalone button in the UI navigation.
   - Connect it to open the full interactive Mass Guide modal with daily readings auto-populated.
4. Build & Test:
   - Run `npm run build` and `npm test` to verify zero errors.
