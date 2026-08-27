# Handoff Report — Domain Features Investigation (R5–R9)

**Agent Role**: Domain Features Explorer  
**Working Directory**: `/Users/riosisraelg/Desktop/1/lapandilladejesusqro.org/.agents/survey_features/`  
**Date**: 2026-08-27T05:58:00Z  
**Parent Agent ID**: `367b9238-f1ab-4c6e-b44d-f936902ad2ff`

---

## 1. Observation

Direct examination of the codebase and external liturgical data feeds yielded the following verbatim facts and locations:

### 1.1 Rosary Architecture (`src/data/oracionesData.ts` & `src/app/LandingClient.tsx`)
- **Data Structures (`src/data/oracionesData.ts:6-42`)**:
  - `PrayerCard`:
    ```typescript
    export interface PrayerCard {
      id: string;
      title: string;
      titleEn?: string;
      subtitle?: string;
      subtitleEn?: string;
      category?: string;
      categoryEn?: string;
      text: string;
      textEn?: string;
      isRosaryGuide?: boolean;
      isConfigCard?: boolean;
      isMysteryCard?: boolean;
      mysteryNumber?: number;
      mysteryName?: string;
      mysteryNameEn?: string;
      mysteryMeditation?: string;
      mysteryMeditationEn?: string;
    }
    ```
  - `MysteryInfo`:
    ```typescript
    export interface MysteryInfo {
      type: MysteryType;
      name: string;
      nameEn: string;
      days: string;
      daysEn: string;
      mysteries: Array<{
        number: number;
        title: string;
        titleEn: string;
        biblicalRef?: string;
        meditation: string;
        meditationEn: string;
      }>;
    }
    ```
  - **Identified Gap in Mystery Structure**: `MysteryInfo.mysteries` only contains `biblicalRef` (e.g. `"Lucas 1, 26-38"`) and `meditation`. It is missing:
    1. Direct Scripture reading text (`scriptureText` / `scriptureTextEn`),
    2. Reflection question (`reflectionQuestion` / `reflectionQuestionEn`),
    3. Mystery illustration image asset (`image` / SVG identifier).
  - **Rosary Variants (`src/data/oracionesData.ts:852-1879`)**:
    - 4 variants supported: `'mexicana'`, `'misionera'`, `'universal'`, `'latin'`.
    - Current cards mix introductory prayers, the 5 mystery cards, and concluding prayers into one single monolithic card array (`PrayerCard[]`).
  - **Rosary UI & Decade Tracker (`src/app/LandingClient.tsx:2255-2283`)**:
    - Decade counter is currently rendered as an inline row of 10 circular buttons (`.rosario-beads-container`) inside each mystery card body.
    - Requirement R7 requires moving the counter to a top-bar button beside the close 'X' button with haptic feedback on each tap.
  - **Modal Close Button (`src/components/GlobalModal.tsx:33-41`)**:
    - Close button rendered as `<button type="button" className="calendar-modal-close-btn" onClick={onClose}>✕</button>`.

### 1.2 Mass Guide & Daily Liturgy Scraper (`src/app/massResponses.ts`, `cancioneroArchive.ts`, `LandingClient.tsx`)
- **Mass Structure (`src/app/massResponses.ts:1-258`)**:
  - Contains only:
    1. *Ritos Iniciales* (Saludo, Acto Penitencial, Gloria)
    2. *Liturgia Eucarística* (Ofertorio, Diálogo del Prefacio, Sanctus, Aclamación del Memorial)
    3. *Rito de Comunión* (Padre Nuestro, Saludo de la Paz, Cordero de Dios, Recepción de la Comunión)
    4. *Ritos de Conclusión* (Bendición Final, Despedida)
  - **Missing Sections**:
    - Complete *Liturgia de la Palabra* (Primera Lectura dialogue, Salmo responsorial, Segunda Lectura, Aclamación del Evangelio / Aleluya, Proclamación del Evangelio dialogues, Credo Niceno/Apostólico, Oración Universal de los Fieles).
    - **Missing Priest Dialogues & Private Prayers**:
      - *Fracción del Pan (Fractio Panis)*: *"El Cuerpo y la Sangre de nuestro Señor Jesucristo, unidos en este cáliz, sean para nosotros, que los recibimos, fuente de vida eterna."*
      - *Oración privada del sacerdote antes de comulgar*: *"Señor Jesucristo, Hijo de Dios vivo, que por voluntad del Padre y con la cooperación del Espíritu Santo..."*
      - *Comunión del Sacerdote*: *"El Cuerpo de Cristo me guarde para la vida eterna"*, *"La Sangre de Cristo me guarde para la vida eterna"*.
      - *Purificación de los vasos sagrados*: *"Haz, Señor, que recibamos con un corazón limpio el alimento corporal..."*
      - *Oración después de la Comunión*: *"Oremos... Por Jesucristo, nuestro Señor. Amén."*
    - **Mexican Adaptations (CEM)**:
      - Sacerdote: *"El Señor esté con ustedes"* -> Pueblo: *"Y con tu espíritu"*.
      - Saludo de la paz: *"Dense fraternalmente la paz"*.
      - Despedida: *"Pueden ir en paz"* -> *"Demos gracias a Dios"*.
    - **Mexican Sung Hymns (Tradición Mexicana)**:
      - Gloria de Mejía / Tradicional.
      - Santo de Mejía / Hosanna.
      - Cordero de Dios (Mejía / Misa Panamericana).
- **Daily Liturgical Scraper Source Verification**:
  - Live HTTP query tested against `http://feed.evangelizo.org/v2/reader.php?date=20260827&lang=SP&type=xml`:
    - Responded with clean, structured XML containing:
      - `<litugic_t>`: *"Jueves de la 21a semana del Tiempo Ordinario"*
      - `<saint>`: *"Santa Mónica de Tagaste"*
      - `<reading_text1_lt>` & `<reading_text1>`: *"Carta I de San Pablo a los Corintios 1,1-9."* + full reading text.
      - `<reading_text2_lt>` & `<reading_text2>`: *"Salmo 145(144),2-3.4-5.6-7."* + Psalm verses.
      - `<reading_gospel_lt>` & `<reading_gospel>`: *"Evangelio según San Mateo 24,42-51."* + full Gospel text.
      - `<comment_t>` & `<comment>`: Patristic meditation / homily commentary.
    - Also supports English via `lang=AM`.

### 1.3 Misas de Precepto & Calendar Architecture (`src/app/calendario/`, `src/utils/icalParser.ts`, `src/app/api/calendar/route.ts`)
- **Calendar Parsing (`src/utils/icalParser.ts:1-356`)**:
  - Parses iCal feed into `ParsedEvent` objects (`id`, `title`, `date`, `time`, `location`, `description`, `type`, `types`).
  - Fetches via local Next.js proxy route `/api/calendar` (`src/app/api/calendar/route.ts`).
- **Canonical Canon 1246 & Mexican Episcopal Conference (CEM) Analysis**:
  - Universal Canon 1246 §1 specifies 10 Holy Days of Obligation:
    1. Santa María, Madre de Dios (1 de enero)
    2. Epifanía del Señor (6 de enero)
    3. San José (19 de marzo)
    4. Ascensión del Señor (Jueves / Domingo de Ascensión)
    5. Santísimo Cuerpo y Sangre de Cristo - Corpus Christi (Jueves / Domingo)
    6. Santos Pedro y Pablo (29 de junio)
    7. Asunción de la Bienaventurada Virgen María (15 de agosto)
    8. Todos los Santos (1 de noviembre)
    9. Inmaculada Concepción de María (8 de diciembre)
    10. Natividad de Nuestro Señor Jesucristo - Navidad (25 de diciembre)
  - Under Canon 1246 §2, the **Mexican Episcopal Conference (CEM)** establishes mandatory Precepto for:
    - Todos los Domingos del año.
    - **1 de Enero**: Santa María, Madre de Dios.
    - **Jueves / Domingo de Corpus Christi**.
    - **12 de Diciembre**: Nuestra Señora de Guadalupe (Solemnidad y Precepto Nacional en México).
    - **25 de Diciembre**: Navidad.
    - (Epifanía, Ascensión y Corpus son celebradas solemnemente en domingo o fecha canónica, y las demás solemnidades como San José, San Pedro y San Pablo, Asunción, Todos los Santos e Inmaculada Concepción mantienen carácter solemne prioritario en el calendario litúrgico de la Iglesia mexicana).

### 1.4 OG Image Previews & Shareable Modals (`src/app/layout.tsx`, `CalendarioClient.tsx`)
- Next.js 15.1.0 is installed (`package.json:14`) with built-in `next/og` (`ImageResponse`).
- Currently no `/api/og` route exists in `src/app/api/`.
- Event URLs can be structured as `/calendario?evento=[id]` or `/eventos/[id]`, which on page load reads the search param / route param, matches the event, and triggers `setSelectedEvent(matchingEvent)`.

---

## 2. Logic Chain

```
[Observation 1.1: Mystery data lacks 5 sequential elements & counter is buried in card]
  └──> [Requirement R7: Mystery sequence + untruncated text + collapsible repeated prayers + top vibrating counter]
         └──> [Design: Extend MysteryInfo schema with scriptureText, reflectionQuestion, image; add top-bar bead counter button with navigator.vibrate([30]); group prayers into dedicated sub-decks with collapsible nested prayer components]

[Observation 1.2: massResponses.ts is missing Liturgia de la Palabra, priest communion prayers & Mexican hymns; Evangelizo XML feed verified]
  └──> [Requirement R8: Complete priest dialogues, add Mexican sung prayers, scrape daily mass readings, standalone Mass Guide button]
         └──> [Design: Add /api/mass-readings endpoint fetching & caching Evangelizo XML; expand massResponses.ts with full Liturgy of the Word + Priest Communion dialogues + Mexican Gloria/Santo/Cordero songs; replace landing tab section with dedicated 'Guía de Misa' button]

[Observation 1.3: Canon 1246 & CEM Holy Days of Obligation need dynamic annual integration & calendar export]
  └──> [Requirement R9: Misas de Precepto in Jesus calendar + add to personal calendar (.ics / Google / Apple / Outlook)]
         └──> [Design: Implement liturgical Computus algorithm generating full annual Misas de Precepto; merge into calendar view with distinct precept badge; enhance event modal with universal export buttons (Google, Apple iCal, Outlook Web, Outlook Desktop, Yahoo)]

[Observation 1.4: Next.js 15 supports next/og ImageResponse + query parameter event selection]
  └──> [Requirement R6: Custom OG image generation + unique shareable event URLs triggering modal]
         └──> [Design: Implement /api/og/route.tsx rendering 1200x630px Catholic brand banner + auto-open modal on /calendario?evento=[id]]
```

---

## 3. Detailed Technical Blueprint

### 3.1 Rosary Overhaul Specification (R7)

#### A. Data Structure Enhancement (`src/data/oracionesData.ts`)
Update `MysteryInfo` to support all 5 required elements:
```typescript
export interface MysteryItem {
  number: number;
  title: string;
  titleEn: string;
  biblicalRef: string;
  scriptureText: string;
  scriptureTextEn: string;
  meditation: string;
  meditationEn: string;
  reflectionQuestion: string;
  reflectionQuestionEn: string;
  image: string; // SVG icon or artwork path
}
```

#### B. Dedicated Decks Architecture
Break Rosary into structured sub-decks:
1. **Mazo 1: Oraciones Iniciales (Main Opening Prayers)**
   - Señal de la Santa Cruz
   - Acto de Contrición
   - Credo de los Apóstoles
   - Padre Nuestro y 3 Ave Marías (Fe, Esperanza, Caridad) + Gloria
2. **Mazo 2: Los 5 Misterios del Día (Mysteries Deck)**
   - Misterio 1 a 5 con:
     1. Ilustración / Imagen del misterio
     2. Cita bíblica (e.g. *Lucas 1, 26-38*)
     3. Texto bíblico directo
     4. Meditación profunda
     5. Pregunta de reflexión para la decena
     6. Lista anidada de oraciones repetidas (1 Padre Nuestro, 10 Ave Marías, 1 Gloria, Jaculatorias) con botón de colapsar/expandir
3. **Mazo 3: Oraciones Finales y Personales (Concluding & Self Prayers)**
   - Tres Últimas Ave Marías (Tres Divinas Personas)
   - La Salve Regina
   - Letanías Lauretanas
   - Bajo tu Amparo
   - Oración Final y Bendición

#### C. Top-Bar Vibrating Counter
- Positioned in the modal header bar immediately adjacent to the 'X' (`.calendar-modal-close-btn`):
```tsx
<button
  type="button"
  className="rosario-top-counter-btn"
  onClick={() => {
    setDecadeCount(prev => (prev >= 10 ? 0 : prev + 1));
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([25]);
    }
  }}
  data-tooltip="Contador de Ave Marías (Toca para contar, vibrará en cada cuenta)"
>
  <span className="bead-icon">📿</span>
  <span className="bead-num">{decadeCount}/10</span>
</button>
```

---

### 3.2 Mass Guide, Priest Dialogues, Mexican Hymns & Scraper (R8)

#### A. Daily Mass Readings Scraper API (`src/app/api/mass-readings/route.ts`)
- Next.js Edge/Serverless Route:
```typescript
// GET /api/mass-readings?date=YYYYMMDD&lang=es
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date') || getFormattedDate(new Date());
  const lang = searchParams.get('lang') === 'en' ? 'AM' : 'SP';
  
  const upstreamUrl = `http://feed.evangelizo.org/v2/reader.php?date=${date}&lang=${lang}&type=xml`;
  const res = await fetch(upstreamUrl, { next: { revalidate: 86400 } });
  const xml = await res.text();
  
  // Parse XML fields: <litugic_t>, <saint>, <reading_text1>, <reading_text2>, <reading_gospel>, <comment>
  const parsedData = parseEvangelizoXml(xml);
  return NextResponse.json(parsedData);
}
```

#### B. Mass Guide Content Expansion (`src/app/massResponses.ts`)
1. **Complete Liturgia de la Palabra**:
   - Monición y Primera Lectura (`"Palabra de Dios"` -> `"Te alabamos, Señor"`).
   - Salmo Responsorial con aclamación del pueblo.
   - Segunda Lectura (en domingos y solemnidades).
   - Aclamación del Evangelio (Aleluya / Canto de alabanza en Cuaresma).
   - Diálogo del Evangelio (`"El Señor esté con ustedes"`, `"Lectura del Santo Evangelio..."`, `"Gloria a ti, Señor"`).
   - Despedida del Evangelio (`"Palabra del Señor"` -> `"Gloria a ti, Señor Jesús"`).
   - Profesión de Fe (Credo Apostólico y Credo Niceno-Constantinopolitano).
   - Oración Universal de los Fieles (`"Roguemos al Señor"` -> `"Te rogamos, óyenos"`).
2. **Missing Priest Dialogues in Communion**:
   - Fracción del Pan: *"El Cuerpo y la Sangre de nuestro Señor Jesucristo..."*
   - Oración privada del sacerdote: *"Señor Jesucristo, Hijo de Dios vivo..."*
   - Comunión: *"El Cuerpo de Cristo me guarde para la vida eterna."* / *"La Sangre de Cristo me guarde para la vida eterna."*
   - Purificación: *"Haz, Señor, que recibamos con un corazón limpio..."*
   - Oración después de la Comunión: *"Oremos..."* -> *"Amén."*
3. **Mexican Sung Versions Included**:
   - *Gloria de Mejía* y *Gloria Giombini/Palazón*.
   - *Santo de Mejía* y *Santo Hosanna de la Tierra*.
   - *Cordero de Dios tradicional mexicano*.

---

### 3.3 Misas de Precepto & Calendar Export Engine (R9)

#### A. Canonical Holy Days Matrix (Canon 1246 & CEM)

| Fecha / Cálculo | Solemnidad | Estatus Precepto (México CEM) | Estatus Canónico Universal |
|---|---|---|---|
| 1 de Enero | Santa María, Madre de Dios | **Precepto Obligatorio** | Precepto Universal |
| 6 de Enero | Epifanía del Señor | Celebrado el domingo cercano | Precepto (o trasladado) |
| 19 de Marzo | San José, Esposo de la Virgen María | Solemnidad prioritaria | Precepto (o dispensado) |
| Jueves Santo | La Cena del Señor | Asistencia ferviente recomendada | Triduo Pascual |
| Viernes Santo | Pasión y Muerte del Señor | Ayuno y abstinencia | Triduo Pascual |
| Domingo de Pascua (Computus) | Resurrección del Señor | **Precepto Obligatorio** | Precepto Primordial |
| Pascua + 42 días | Ascensión del Señor | Celebrado el VII Domingo de Pascua | Precepto (trasladado a domingo) |
| Pascua + 49 días | Domingo de Pentecostés | **Precepto Obligatorio** | Precepto Primordial |
| Pascua + 56 días | Santísima Trinidad | **Precepto Obligatorio** | Domingo de Precepto |
| Pascua + 60 / 63 días | El Santísimo Cuerpo y Sangre de Cristo (Corpus Christi) | **Precepto Obligatorio** | Precepto Universal |
| Pascua + 68 días | Sagrado Corazón de Jesús | Solemnidad mayor | Solemnidad |
| 29 de Junio | Santos Pedro y Pablo, Apóstoles | Solemnidad | Precepto Universal / Trasladado |
| 15 de Agosto | Asunción de la Santísima Virgen María | Solemnidad | Precepto Universal |
| 1 de Noviembre | Todos los Santos | Solemnidad | Precepto Universal |
| Último Domingo T.O. | Jesucristo, Rey del Universo | **Precepto Obligatorio** | Domingo de Precepto |
| 8 de Diciembre | Inmaculada Concepción de la Virgen María | Solemnidad | Precepto Universal |
| 12 de Diciembre | Nuestra Señora de Guadalupe, Patrona de México | **Precepto Nacional Obligatorio** | Patrona de América / México |
| 25 de Diciembre | Natividad de Nuestro Señor Jesucristo (Navidad) | **Precepto Obligatorio** | Precepto Universal |

#### B. Liturgical Computus Algorithm
A pure JavaScript/TypeScript algorithm calculates Easter (`Computus Gregoriano`) and automatically projects all movable Misas de Precepto for any target year.

#### C. Comprehensive Export Engine
Supports 5 calendar destinations:
1. **Google Calendar**: Direct web compose URL with URL-encoded parameters.
2. **Apple Calendar**: Direct `webcal://` link or instant `.ics` blob download.
3. **Outlook.com (Web)**: Direct deeplink URL (`https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent...`).
4. **Outlook Desktop / iCal File**: RFC 5545 formatted `.ics` file generation and download.
5. **Yahoo Calendar**: Web compose link.

---

### 3.4 OG Image Preview & Dynamic Shareable Modals (R6)

#### A. Dynamic OG Image Route (`src/app/api/og/route.tsx`)
Utilizing Next.js 15 `ImageResponse`:
- **Dimensions**: 1200 x 630 px.
- **Visual Design**:
  - Deep Catholic Midnight Slate background (`#0b1329` to `#1e293b` gradient).
  - Gold border accents (`#D4AF37`).
  - Event category chip (e.g. `MISA DE PRECEPTO`, `RETIRO ESPIRITUAL`).
  - Event title in prominent bold display typography.
  - Event Date & Time with calendar and clock icons.
  - Location: *"Parroquia de La Sagrada Familia · Querétaro"*.
  - Community Branding: *"La Pandilla de Jesús · lapandilladejesusqro.org"*.

#### B. Unique Shareable URL & Modal Auto-Open
- URLs: `/calendario?evento=[id]` (e.g. `/calendario?evento=precepto-2026-12-12-guadalupe`).
- Page metadata (`src/app/calendario/page.tsx`) uses `generateMetadata({ searchParams })` to dynamically set `openGraph.images = ['/api/og?title=...']`.
- On client mount, `useEffect` inspects query parameters and immediately opens the layered event modal.

---

### 3.5 Long-Press Usability (R5)
- Standardized `useLongPress` utility hook:
  - Listens to `touchstart`, `touchend`, `touchmove`.
  - 450ms hold threshold triggers:
    1. Haptic tick (`navigator.vibrate([20])`).
    2. Floating tooltip popover or toast banner displaying `data-tooltip` text.
  - Cancels immediately if touch scrolls (`touchmove`).

---

## 4. Caveats

1. **Evangelizo API Network Availability**: While Evangelizo is extremely reliable, client devices should never break if offline. The Next.js API proxy should cache responses with `next: { revalidate: 86400 }` and include static fallback readings for Common Liturgical Masses.
2. **Canonical Nuances (Canon 1246 §2)**: In Mexico, certain universal Holy Days (like St. Joseph or All Saints) are not civil non-working holidays, so their obligation is either transferred to Sunday or celebrated with pastoral flexibility by the CEM. The calendar modal will clearly display both the Universal Canon status and the Mexican Episcopal Conference practice.
3. **`next/og` Edge Font Rendering**: Font files should use standard web-safe fonts or embedded Google Fonts (`Inter`, `Cinzel`, `Playfair Display`) loaded via `fetch()` arrayBuffer in the Edge runtime.

---

## 5. Conclusion

All domain features for R5-R9 have been comprehensively surveyed and architected:
1. **R7 (Rosary)**: Ready for data schema expansion (5-element mystery sequence), sub-deck partitioning, and top-bar vibrating bead counter.
2. **R8 (Mass Guide & Scraper)**: Evangelizo XML feed verified live for Spanish & English; missing Liturgia de la Palabra, priest Communion dialogues, and Mexican hymns mapped out for implementation.
3. **R9 (Misas de Precepto & Calendar)**: Complete Canon 1246 & CEM Holy Days matrix compiled with Computus date generator and multi-platform export engine.
4. **R6 (OG Preview & Shareable Modals)**: `next/og` dynamic image generation and URL-driven modal triggers designed.
5. **R5 (Tooltips)**: Long-press touch hook and CSS `:hover` ready for global application.

---

## 6. Verification Method

To verify these domain features independently:

1. **Evangelizo Feed Live Response Verification**:
   ```bash
   curl -s "http://feed.evangelizo.org/v2/reader.php?date=20260827&lang=SP&type=xml" | grep -E "litugic_t|reading_gospel_lt"
   ```
   *Expected result*: Valid XML tags with liturgical day and Gospel citation.

2. **Next.js Project Build & Typecheck**:
   ```bash
   npm run build
   ```
   *Expected result*: Zero compilation errors and clean bundle output.

3. **Verify Files Inspected**:
   - `src/data/oracionesData.ts` (lines 1-1880)
   - `src/app/massResponses.ts` (lines 1-258)
   - `src/app/cancioneroArchive.ts` (lines 1-116)
   - `src/app/calendario/CalendarioClient.tsx` (lines 1-763)
   - `src/utils/icalParser.ts` (lines 1-356)
   - `src/app/api/calendar/route.ts` (lines 1-50)
   - `src/components/GlobalModal.tsx` (lines 1-48)
