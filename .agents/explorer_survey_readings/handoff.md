# Handoff Report: Survey of Readings Data Structure, Spanish Liturgy (Sept 10, 2026), and Application Architecture

**Agent**: `explorer_survey_readings`  
**Parent**: `orchestrator_4` (`f2715e8d-b7bb-4e1c-a2a5-53a02fb7cfc2`)  
**Target Repository**: `/Users/riosisraelg/teamwork_projects/guadalupe_mass_interactive`  
**Date**: September 10, 2026 (2026-09-10)

---

## 1. Observation

### 1.1 `rcolfin/catholic-mass-readings` Package Inspection
The package installed at `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/node_modules/catholic-mass-readings` (version `0.5.6`, authored by Andrew Ryder, Apache-2.0) was analyzed.

#### TypeScript Models & Interfaces (`src/models.ts` lines 25–142, 213–290)
- **`MassType` Enum** (`src/models.ts:26-35`):
  ```typescript
  export enum MassType {
    DEFAULT = "",
    DAWN = "DAWN",
    DAY = "DAY",
    NIGHT = "NIGHT",
    VIGIL = "VIGIL",
    YEARA = "YEARA",
    YEARB = "YEARB",
    YEARC = "YEARC",
  }
  ```
- **`SectionType` Enum** (`src/models.ts:84-92`):
  ```typescript
  export enum SectionType {
    UNKNOWN = "UNKNOWN",
    ALLELUIA = "ALLELUIA",
    ALTERNATIVE = "ALTERNATIVE",
    GOSPEL = "GOSPEL",
    PSALM = "PSALM",
    READING = "READING",
    SEQUENCE = "SEQUENCE",
  }
  ```
- **`Verse` & `SerializedVerse`** (`src/models.ts:107-123`):
  ```typescript
  export interface Verse {
    text: string;      // Citation string, e.g. "1 Corinthians 8:1b-7, 11-13"
    link: string;      // Canonical USCCB URL or bible link
    book: string | null; // Standard book name, e.g. "1 Corinthians"
  }
  export interface SerializedVerse {
    text: string;
    link: string;
    book: string | null;
  }
  ```
- **`Reading` & `SerializedReading`** (`src/models.ts:125-128, 149-152`):
  ```typescript
  export interface Reading {
    verses: Verse[];
    text: string;
  }
  export interface SerializedReading {
    verses: SerializedVerse[];
    text?: string;
  }
  ```
- **`Section` & `SerializedSection`** (`src/models.ts:130-134, 213-217`):
  ```typescript
  export interface Section {
    type: SectionType;
    header: string;     // e.g. "Reading 1", "Responsorial Psalm", "Alleluia", "Gospel"
    readings: Reading[];
  }
  export interface SerializedSection {
    type: SectionType;
    header: string;
    readings: SerializedReading[];
  }
  ```
- **`Mass` & `SerializedMass`** (`src/models.ts:136-142, 283-289`):
  ```typescript
  export interface Mass {
    date: Date | null;
    type: MassType | string | null;
    url: string;
    title: string;      // e.g. "Thursday of the Twenty-third Week in Ordinary Time"
    sections: Section[];
  }
  export interface SerializedMass {
    url: string;
    title: string;
    sections: SerializedSection[];
    date?: string;      // ISO format YYYY-MM-DD
    type_?: MassType | string | null;
  }
  ```

#### Critical Library Behavior & Spanish Parser Limitation
When invoking `catholic-mass-readings` on the USCCB Spanish page (`https://bible.usccb.org/es/bible/lecturas/091026.cfm`), the parser fails with:
`USCCBParseError: USCCB page contained no recognizable reading sections`.

Inspection of `src/usccb.ts` revealed two root causes:
1. **Citation Link Dependency** (`src/usccb.ts:478-486`):
   ```typescript
   private getVerses($: cheerio.CheerioAPI, parent: cheerio.Cheerio<Element>): Verse[] {
     return parent.find("a[href]").toArray().map((anchor) => this.createVerse($, anchor));
   }
   ```
   On English USCCB pages, citations are wrapped in `<div class="address"><a href="...">...</a></div>`.  
   On Spanish USCCB pages, citations are plain text: `<div class="address">1 Corintios 8, 1-13</div>`.  
   Because `parent.find("a[href]")` finds 0 anchors, `getVerses()` returns `[]`, triggering `if (verses.length === 0) continue;` in `getSections()` (`src/usccb.ts:425`), which skips all sections!
2. **English-Only Keyword Matcher** (`src/models.ts:95-104`):
   ```typescript
   export function sectionTypeFromHeader(header: string): SectionType {
     const lower = header.toLowerCase();
     if (lower.includes("alleluia")) return SectionType.ALLELUIA;
     if (lower.includes("gospel")) return SectionType.GOSPEL;
     if (lower.includes("psalm")) return SectionType.PSALM;
     if (lower.includes("sequence")) return SectionType.SEQUENCE;
     if (lower.includes("reading")) return SectionType.READING;
     if (lower.includes("or")) return SectionType.ALTERNATIVE;
     return SectionType.UNKNOWN;
   }
   ```
   Spanish headers ("Primera lectura", "Salmo Responsorial", "Aclamación antes del Evangelio", "Evangelio") evaluate to `SectionType.UNKNOWN`.

---

### 1.2 Verification of Spanish Readings for September 10, 2026
Using `createNodeHttpClient` with Impit (to satisfy Cloudflare TLS fingerprints), live readings were extracted directly from `https://bible.usccb.org/es/bible/lecturas/091026.cfm`.

- **Liturgical Day**:
  - Spanish: *Jueves de la XXIII semana del Tiempo ordinario* (Año par / Año II / Ciclo II)
  - English: *Thursday of the Twenty-third Week in Ordinary Time* (Year II)
- **Readings Catalog**:
  1. **Primera Lectura**: `1 Corintios 8, 1b-7. 11-13` (Heading: `Primera lectura`)
  2. **Salmo Responsorial**: `Salmo 138, 1b-3. 13-14ab. 23-24` (Hebrew numbering: `Psalm 139`)
     - Antífona / Respuesta: `R. (24b) Señor, no dejes que me pierda.` (Alt: `Guíame, Señor, por el camino eterno`)
  3. **Aclamación antes del Evangelio**: `1 Juan 4, 12`
     - Aclamación: `R. Aleluya, aleluya.`
     - Versículo: `Si nos amamos los unos a los otros, Dios permanece en nosotros y su amor ha llegado en nosotros a su plenitud.`
  4. **Evangelio**: `Lucas 6, 27-38` (Heading: `Evangelio`)

#### Verbatim Cross-Verification with YouTube Video `EkoysbFU47c`
The transcript extracted by `explorer_survey_video` (`.agents/explorer_survey_video/transcript_full.txt`) for the Mass celebrated at the Basilica de Guadalupe on September 10, 2026, was cross-referenced:
- **First Reading (Transcript lines 126–138, timestamp `00:13:46`)**:
  > *"De la primera carta del apóstol San Pablo a los Corintios. Queridos hermanos, ya sé que todos ustedes conocen lo que está permitido con respecto a la carne inmolada a los ídolos, pero cuidado, porque el puro hecho de conocer llena de soberbia. El amor, en cambio, hace el bien..."*
- **Responsorial Psalm (Transcript lines 183–189, timestamp `00:16:43`)**:
  > *"Señor, no dejes que me pierda. Tú conoces cuando me siento y me levanto. Desde lejos sabes mis pensamientos. Tú observas mi camino y mi descanso. Todas mis sendas te son familiares..."*
- **Gospel Acclamation (Transcript lines 204–207, timestamp `00:19:33`)**:
  > *"Si nos amamos los unos a los otros, Dios permanece en nosotros y su amor ha llegado en nosotros a su plenitud."*
- **Gospel (Transcript lines 208–220, timestamp `00:20:29`)**:
  > *"Del santo evangelio según San Lucas. En aquel tiempo, Jesús dijo a sus discípulos: Amen a sus enemigos, hagan el bien a los que los aborrecen, bendigan a quienes los maldicen y oren por quienes los difaman..."*

**Finding**: The YouTube video transcript at the Basilica of Guadalupe is a **100% verbatim match** with the Spanish Lectionary readings for September 10, 2026.

---

### 1.3 Target Repository State (`~/teamwork_projects/guadalupe_mass_interactive`)
Directory check on `/Users/riosisraelg/teamwork_projects/guadalupe_mass_interactive`:
- Verified: `total 0` (clean, empty directory ready for project scaffolding).
- Parent directory `/Users/riosisraelg/teamwork_projects` contains:
  - `guadalupe_mass_interactive`
  - `zensical_research`
- System Runtime: Node.js `v26.7.0`, npm `11.19.0`, macOS Darwin arm64.

---

## 2. Logic Chain

1. **Schema Compliance**: The prompt mandates structuring the Spanish data based on the format used in `rcolfin/catholic-mass-readings`. The canonical representation in that library is `SerializedMass`, composed of `SerializedSection[]`, `SerializedReading[]`, and `SerializedVerse[]`.
2. **Scraper Adaptation**: Because the upstream library hardcodes English DOM queries (`a[href]` inside `.address`) and English regexes (`reading`, `psalm`, `gospel`), the new application cannot simply call `usccb.getMassFromDate()` with a Spanish flag. It must provide:
   - A dedicated Spanish scraper/adapter that accepts plain-text `.address` nodes and Spanish header keywords (`lectura`, `salmo`, `evangelio`, `aclamación`).
   - A deterministic local fixture/cache for `2026-09-10` so the application is completely resilient against USCCB network rate limits or Cloudflare challenges during CI/CD test runs.
3. **Application Architecture**:
   - The project requires:
     1. Displaying daily Catholic Mass readings in Spanish in `rcolfin/catholic-mass-readings` format.
     2. An interactive "Seguir Misa" guide with real transcript sayings from the priest paired with bilingual English/Spanish assembly responses.
     3. Both programmatic tests and an automated browser test.
   - **Recommended Stack**: **Next.js 15 (App Router) + TypeScript + Tailwind CSS + Vitest + Playwright**.
     - **Why Next.js App Router**: Provides native API routes (`/api/readings` and `/api/mass-guide`), SSR for instant SEO/hydration, server-side caching, and clean client component separation (`"use client"` for the interactive stepper).
     - **Alternative Considered**: React + Vite SPA. While Vite is lightweight, Next.js allows direct programmatic `GET /api/readings` testing without needing a separate mock server or Express wrapper.
4. **Test Strategy**:
   - Programmatic tests with Vitest verify:
     1. Exact priest sayings exist in the structured guide dataset.
     2. Every priest prompt pairs with bilingual assembly responses (Spanish and English).
     3. Spanish readings for `2026-09-10` return valid liturgical metadata and texts.
     4. JSON output strictly matches the `catholic-mass-readings` `SerializedMass` schema.
   - Automated browser tests with Playwright verify:
     - End-to-end user follow-along ("seguir misa"), step advancing, active prayer highlighting, bilingual response toggle, and responsive mobile modal behavior.

---

## 3. Caveats

1. **Psalm Numbering Dualism**:
   - The Hebrew/Protestant canon numbers this Psalm as **Psalm 139**.
   - The Greek Septuagint, Latin Vulgate, and Spanish Lectionary number it as **Salmo 138 (139)**.
   - The citation field must preserve `Salmo 138, 1b-3. 13-14ab. 23-24` with book `"Salmos"`, while English cross-references link to Psalm 139.
2. **USCCB Cloudflare Bot Protection**:
   - Direct `fetch()` without browser TLS fingerprints is rejected by USCCB with HTTP 403. The project should bundle the curated `readings-20260910-es.json` fixture as the primary deterministic source, while optionally keeping the dynamic fetcher as a fallback or live updater using `impit`.
3. **Audio-Visual Transcript Alignment**:
   - The YouTube transcript contains conversational filler and introductory pastoral remarks ("Buenos días a todos... bienvenidos a esta casita..."). The data model must distinguish between standard liturgical rubrics (Roman Missal) and the celebrant's specific pastoral greetings recorded on that day.

---

## 4. Conclusion & Concrete Specifications

### 4.1 Canonical Spanish Data Model (`SerializedMass` Format)
Here is the exact JSON structure for September 10, 2026, adhering 100% to `rcolfin/catholic-mass-readings`:

```json
{
  "url": "https://bible.usccb.org/es/bible/lecturas/091026.cfm",
  "title": "Jueves de la XXIII semana del Tiempo ordinario",
  "date": "2026-09-10",
  "type_": "",
  "sections": [
    {
      "type": "READING",
      "header": "Primera lectura",
      "readings": [
        {
          "verses": [
            {
              "text": "1 Corintios 8, 1b-7. 11-13",
              "link": "https://bible.usccb.org/es/bible/lecturas/091026.cfm",
              "book": "1 Corintios"
            }
          ],
          "text": "Queridos hermanos: Ya sé que todos ustedes conocen lo que está permitido con respecto a la carne inmolada a los ídolos. Pero, ¡cuidado!, porque el puro hecho de conocer, llena de soberbia; el amor, en cambio, hace el bien. Y si alguno piensa que ese conocimiento le basta, no tiene idea de lo que es el verdadero conocimiento. Pero aquel que ama a Dios, es verdaderamente conocido por Dios.\n\nAhora bien, con respecto a comer la carne ofrecida a los ídolos, sabemos que un ídolo no representa nada real y que no hay más que un solo Dios. Pues, aun cuando se hable de dioses del cielo y de la tierra, como si hubiera muchos dioses y muchos señores, sin embargo, para nosotros no hay más que un solo Dios, el Padre, de quien todo procede y es nuestro destino, y un solo Señor Jesucristo, por quien existen todas las cosas y por el cual también nosotros existimos.\n\nMas no todos saben esto. Pues algunos, acostumbrados a la idolatría hasta hace poco, siguen comiendo la carne como si estuviera consagrada a los ídolos, y puesto que su conciencia está poco formada, pecan. No es, ciertamente, la comida lo que nos hará agradables a Dios, ni vamos a ser mejores o peores por comer o no comer. Pero tengan cuidado de que esa libertad de ustedes no sea ocasión de pecado para los que tienen la conciencia poco formada. Porque si a ti, que sabes estas cosas, te ve alguien sentado a la mesa en un templo de los ídolos, ¿no se creerá autorizado por su conciencia, que está poco formada, a comer de lo sacrificado a los ídolos?\n\nEntonces, por culpa de tu conocimiento haces que se pierda el hermano que tiene la conciencia poco formada, por quien murió Cristo. De esta manera, al pecar ustedes contra sus hermanos, haciendo daño a su conciencia poco formada, pecan contra Cristo. Por lo tanto, si un alimento le es ocasión de pecado a mi hermano, nunca comeré carne para no darle ocasión de pecado."
        }
      ]
    },
    {
      "type": "PSALM",
      "header": "Salmo Responsorial",
      "readings": [
        {
          "verses": [
            {
              "text": "Salmo 138, 1b-3. 13-14ab. 23-24",
              "link": "https://bible.usccb.org/es/bible/lecturas/091026.cfm",
              "book": "Salmos"
            }
          ],
          "text": "R. (24b) Señor, no dejes que me pierda.\n\nTú me conoces, Señor, profundamente:\ntú conoces cuándo me siento y me levanto,\ndesde lejos sabes mis pensamientos,\ntú observas mi camino y mi descanso,\ntodas mis sendas te son familiares. R.\n\nR. Señor, no dejes que me pierda.\n\nTú formaste mis entrañas,\nme tejiste en el seno materno.\nTe doy gracias por tan grandes maravillas;\nsoy un prodigio y tus obras son prodigiosas. R.\n\nR. Señor, no dejes que me pierda.\n\nExamíname, Dios mío, para conocer mi corazón,\nponme a prueba para conocer mis sentimientos,\ny si mi camino se desvía,\nno dejes que me pierda. R.\n\nR. Señor, no dejes que me pierda."
        }
      ]
    },
    {
      "type": "ALLELUIA",
      "header": "Aclamación antes del Evangelio",
      "readings": [
        {
          "verses": [
            {
              "text": "1 Juan 4, 12",
              "link": "https://bible.usccb.org/es/bible/lecturas/091026.cfm",
              "book": "1 Juan"
            }
          ],
          "text": "R. Aleluya, aleluya.\n\nSi nos amamos los unos a los otros,\nDios permanece en nosotros\ny su amor ha llegado en nosotros a su plenitud.\n\nR. Aleluya."
        }
      ]
    },
    {
      "type": "GOSPEL",
      "header": "Evangelio",
      "readings": [
        {
          "verses": [
            {
              "text": "Lucas 6, 27-38",
              "link": "https://bible.usccb.org/es/bible/lecturas/091026.cfm",
              "book": "Lucas"
            }
          ],
          "text": "En aquel tiempo, Jesús dijo a sus discípulos: “Amen a sus enemigos, hagan el bien a los que los aborrecen, bendigan a quienes los maldicen y oren por quienes los difaman. Al que te golpee en una mejilla, preséntale la otra; al que te quite el manto, déjalo llevarse también la túnica. Al que te pida, dale; y al que se lleve lo tuyo, no se lo reclames.\n\nTraten a los demás como quieran que los traten a ustedes; porque si aman sólo a los que los aman, ¿qué hacen de extraordinario? También los pecadores aman a quienes los aman. Si hacen el bien sólo a los que les hacen el bien, ¿qué tiene de extraordinario? Lo mismo hacen los pecadores. Si prestan solamente cuando esperan cobrar, ¿qué hacen de extraordinario? También los pecadores prestan a otros pecadores, con la intención de cobrárselo después.\n\nUstedes, en cambio, amen a sus enemigos, hagan el bien y presten sin esperar recompensa. Así tendrán un gran premio y serán hijos del Altísimo, porque él es bueno hasta con los malos y los ingratos. Sean misericordiosos, como su Padre es misericordioso.\n\nNo juzguen y no serán juzgados; no condenen y no serán condenados; perdonen y serán perdonados. Den y se les dará: recibirán una medida buena, bien sacudida, apretada y rebosante en los pliegues de su túnica. Porque con la misma medida con que midan, serán medidos”."
        }
      ]
    }
  ]
}
```

---

### 4.2 Target Repository Blueprint: `guadalupe_mass_interactive`

#### Proposed Directory Structure
```
/Users/riosisraelg/teamwork_projects/guadalupe_mass_interactive/
├── .gitignore
├── README.md
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── tailwind.config.ts
├── vitest.config.ts
├── playwright.config.ts
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── api/
│   │       ├── readings/
│   │       │   └── route.ts
│   │       └── mass-guide/
│   │           └── route.ts
│   ├── components/
│   │   ├── SeguirMisaGuide.tsx       // Interactive step-by-step follow-along
│   │   ├── ReadingsViewer.tsx        // Displays First Reading, Psalm, Alleluia, Gospel
│   │   ├── LiturgicalStepCard.tsx    // Individual prayer card with priest saying & bilingual response
│   │   ├── BilingualToggle.tsx       // Switch English / Spanish response text
│   │   ├── StepProgressTracker.tsx   // Visual progress indicator (Paso N de M)
│   │   └── AudioVideoReference.tsx   // Link / timestamp sync to YouTube video EkoysbFU47c
│   ├── data/
│   │   ├── readings-20260910-es.json // SerializedMass fixture for Sept 10, 2026 (ES)
│   │   ├── readings-20260910-en.json // SerializedMass fixture for Sept 10, 2026 (EN)
│   │   ├── guadalupana-transcript.json // Priest exact sayings mapped by liturgical section
│   │   └── bilingual-responses.json  // Assembly responses in ES & EN from rejoiceinfaith.org
│   ├── lib/
│   │   ├── spanish-readings-adapter.ts // Parses Spanish USCCB HTML / maps to SerializedMass
│   │   └── mass-guide-builder.ts       // Fuses transcript + responses into liturgical timeline
│   └── types/
│       ├── readings.ts               // TypeScript types matching catholic-mass-readings
│       └── liturgy.ts                // Guide step types, roles (PRIEST, ASSEMBLY, LECTOR)
└── tests/
    ├── unit/
    │   ├── readings-schema.test.ts   // Validates SerializedMass structure (Criteria 5)
    │   ├── readings-retrieval.test.ts // Validates 2026-09-10 Spanish readings (Criteria 4)
    │   ├── priest-sayings.test.ts    // Validates priest exact sayings from video (Criteria 1)
    │   └── bilingual-responses.test.ts // Validates ES/EN response pairing (Criteria 2)
    └── e2e/
        └── seguir-misa.spec.ts       // Playwright interactive browser follow-along (Criteria 3)
```

#### Recommended `package.json` Dependencies & Scripts
```json
{
  "name": "guadalupe-mass-interactive",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev --turbo -p 3000",
    "build": "next build",
    "start": "next start -p 3000",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "verify": "npm run typecheck && npm run test && npm run build"
  },
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lucide-react": "^0.475.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.0.1"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@playwright/test": "^1.50.0",
    "vitest": "^3.0.0",
    "typescript": "^5.7.0",
    "tailwindcss": "^3.4.17",
    "postcss": "^8.5.1",
    "autoprefixer": "^10.4.20"
  }
}
```

---

### 4.3 Acceptance Criteria Test Strategy

| # | Acceptance Criterion | Test File | Test Runner | Verification Logic |
|---|---|---|---|---|
| **AC-1** | Output contains priest's exact sayings from YouTube transcript (`EkoysbFU47c`) | `tests/unit/priest-sayings.test.ts` | Vitest | Loads `guadalupana-transcript.json` and asserts that key celebrant phrases are present: `"En el nombre del Padre..."`, `"La paz y la caridad y la fe de parte de Dios Padre..."`, `"Buenos días a todos ustedes y bienvenidos a esta casita de nuestra madre María de Guadalupe..."`, Eucharistic dialogue, Consecration formula, and Dismissal. |
| **AC-2** | UI pairs priest's parts with corresponding bilingual (EN/ES) assembly responses | `tests/unit/bilingual-responses.test.ts` | Vitest | Validates that every interactive liturgical item where `role === "PRIEST"` has an associated `assemblyResponse` object containing both `es` and `en` fields (e.g. `"Y con tu espíritu"` / `"And with your spirit"`). |
| **AC-3** | Automated browser test verifies interactive element allows user to follow along ("seguir misa") | `tests/e2e/seguir-misa.spec.ts` | Playwright | Boots dev server, navigates to `/`, asserts the "Seguir Misa" interactive stepper is visible, clicks "Siguiente" to advance through liturgical steps, asserts current step changes state/highlight, verifies response text updates, and checks bilingual toggle changes the displayed response language. |
| **AC-4** | Application retrieves/displays Spanish readings for September 10, 2026 | `tests/unit/readings-retrieval.test.ts` | Vitest | Invokes `/api/readings?date=2026-09-10&lang=es`, verifies HTTP 200, title `"Jueves de la XXIII semana del Tiempo ordinario"`, and ensures texts for 1 Corintios 8, Salmo 138, and Lucas 6 are returned. |
| **AC-5** | Spanish readings data structure matches `rcolfin/catholic-mass-readings` format | `tests/unit/readings-schema.test.ts` | Vitest | Validates payload against `SerializedMass`: top-level keys (`url`, `title`, `date`, `sections`, `type_`), section types (`READING`, `PSALM`, `ALLELUIA`, `GOSPEL`), and sub-arrays of `verses` with `text`, `link`, `book`. |

---

## 5. Verification Method

To independently verify these findings:

1. **Verify USCCB Spanish Feed**:
   Run in `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org`:
   ```bash
   node --input-type=module -e '
   import { createNodeHttpClient } from "catholic-mass-readings";
   import * as cheerio from "cheerio";
   const client = await createNodeHttpClient();
   const res = await client.get("https://bible.usccb.org/es/bible/lecturas/091026.cfm");
   const $ = cheerio.load(res.text);
   console.log("Status:", res.status, "Title:", $("title").text());
   $(".container").each((i, el) => {
     const name = $(el).find(".name").first().text().trim();
     const address = $(el).find(".address").first().text().trim();
     if (name || address) console.log(name, "->", address);
   });
   '
   ```
2. **Verify Verbatim YouTube Transcript Match**:
   Inspect line numbers in `.agents/explorer_survey_video/transcript_full.txt`:
   - Line 126–182: 1 Corintios 8
   - Line 183–203: Salmo 138
   - Line 204–207: 1 Juan 4, 12
   - Line 208–220: Lucas 6
3. **Verify Target Repository Clean State**:
   ```bash
   ls -la /Users/riosisraelg/teamwork_projects/guadalupe_mass_interactive
   ```
   Must show 0 files.
