# Survey & Canonical Flow Report — Mass Guide UI & Dynamic Liturgy Integration

**Author**: Explorer 2 (Mass Guide UI & Canonical Flow Specialist)  
**Date**: 2026-08-28T18:52:43-06:00  
**Target Repository**: `lapandilladejesusqro.org`  
**Reference Standards**: ISO/IEC/IEEE 42010:2022, ISO/IEC/IEEE 29148:2018, ISO/IEC/IEEE 12207:2017

---

## 1. Observation

### 1.1 Architecture of Mass UI Components & State Management
In `src/app/LandingClient.tsx`, Mass Guide state and modals are managed via:

1. **State Hooks** (`src/app/LandingClient.tsx:565-566, 752-766, 809-810`):
   ```tsx
   // Line 565-566
   const [showGuiaMisa, setShowGuiaMisa] = useState(false);
   const [showLecturasInResponses, setShowLecturasInResponses] = useState(false);

   // Line 752-766
   type GuiaSectionId = 'lecturas' | 'respuestas' | 'cantos' | 'misterio' | 'liturgia' | 'biblia' | 'precepto';
   const GUIA_SECTIONS: Array<{ id: GuiaSectionId; title: string }> = [
     { id: 'lecturas', title: 'Lecturas del Día' },
     { id: 'respuestas', title: 'Respuestas y Diálogos' },
     { id: 'cantos', title: 'Cantos Litúrgicos' },
     { id: 'misterio', title: 'El Misterio Pascual' },
     { id: 'liturgia', title: 'Año Litúrgico' },
     { id: 'biblia', title: 'Citas Bíblicas' },
     { id: 'precepto', title: 'Misas de Precepto' },
   ];
   const [activeGuiaTab, setActiveGuiaTab] = useState<GuiaSectionId>('lecturas');
   const [dailyReadings, setDailyReadings] = useState<MassReadingsResponse | null>(null);
   const [isLoadingReadings, setIsLoadingReadings] = useState(false);

   // Line 809-810
   const [showAppleMusicGuia, setShowAppleMusicGuia] = useState(false);
   const [activeMisaSectionIdx, setActiveMisaSectionIdx] = useState(0);
   ```

2. **URL Parameter Routing & Deep Linking** (`src/app/LandingClient.tsx:812-881`):
   - `modal=guia&seccion=<seccion>` opens `showGuiaMisa` (standard modal dialog).
   - `modal=guia_misa_interactiva&seccion=<slug>` opens `showAppleMusicGuia` (`AppleMusicLyrics` kinetic full-screen view).
   - Currently, URL synchronization runs in `useEffect` when query parameters change.

3. **Current Auto-Fetch Trigger** (`src/app/LandingClient.tsx:769-789`):
   ```tsx
   const fetchDailyReadings = useCallback(async (force = false) => {
     if (dailyReadings && !force) return;
     setIsLoadingReadings(true);
     try {
       const res = await fetch('/api/mass-readings');
       if (res.ok) {
         const data: MassReadingsResponse = await res.json();
         setDailyReadings(data);
       }
     } catch (err) {
       console.error('Error fetching daily mass readings:', err);
     } finally {
       setIsLoadingReadings(false);
     }
   }, [dailyReadings]);

   useEffect(() => {
     if (showGuiaMisa || activeGuiaTab === 'lecturas') {
       fetchDailyReadings();
     }
   }, [showGuiaMisa, activeGuiaTab, fetchDailyReadings]);
   ```
   *Defect Observed*: If a user accesses `showAppleMusicGuia` directly (or clicks a direct mass launcher), `showGuiaMisa` is `false` and `activeGuiaTab` might not be `'lecturas'`, so `fetchDailyReadings` was not guaranteed to run proactively without `showGuiaMisa` open.

---

### 1.2 Location of the Existing Readings UI & Accordion
The existing readings UI is fragmented across two disconnected locations:

1. **Standalone Tab 1 (`activeGuiaTab === 'lecturas'`)** (`src/app/LandingClient.tsx:2466-2576`):
   - Displays daily readings as a static list of cards (`Primera Lectura`, `Salmo Responsorial`, `Segunda Lectura`, `Santo Evangelio`, `Meditación y Reflexión`).
   - Disconnected from the Mass dialogues and ordinary prayers.

2. **Accordion in Tab 2 (`activeGuiaTab === 'respuestas'`)** (`src/app/LandingClient.tsx:2587-2644`):
   - A collapsible accordion dropdown button toggling `showLecturasInResponses`:
     ```tsx
     {/* Line 2587-2601 */}
     {dailyReadings && (
       <div style={{ marginBottom: '1.5rem', background: 'rgba(255, 252, 245, 0.7)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xs)', overflow: 'hidden' }}>
         <button
           type="button"
           onClick={() => setShowLecturasInResponses(prev => !prev)}
           style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-dark)' }}
         >
           <div style={{ textAlign: 'left' }}>
             <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--gold-dark)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>📖 Lecturas del Día</span>
             <div style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '2px' }}>{dailyReadings.liturgicalDay || 'Liturgia de la Palabra'}</div>
           </div>
           <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', transition: 'transform 0.2s', transform: showLecturasInResponses ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
         </button>
         {showLecturasInResponses && (
           <div style={{ padding: '0 1rem 1rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
             {/* Duplicate cards of readings */}
           </div>
         )}
       </div>
     )}
     ```
   - Below this accordion (lines 2646-2704), it lists the 5 static parts of the Roman Missal with "Abrir en Letras ▶" and "Abrir Modo Interactivo Completo ▶".

3. **Generic Placeholders in `massResponses.ts`** (`src/app/massResponses.ts:181-265`):
   - Inside `massResponses[1]` ("Liturgia de la Palabra"), readings currently contain static dummy placeholders:
     - First reading (line 192): `"(El lector proclama la primera lectura)."`
     - Psalm (line 207): `"(El salmista o cantor proclama la antífona y las estrofas del salmo)."`
     - Second reading (line 222): `"(En domingos y solemnidades, el lector proclama la epístola apostólica)."`
     - Gospel (line 259): `"(El sacerdote o diácono proclama el pasaje del Evangelio del día)."`

---

### 1.3 Canonical Mass Structure in `src/app/massResponses.ts`
The Mass Ordinary in `src/app/massResponses.ts` conforms strictly to the *Misal Romano (3ª Edición Típica)* in 5 canonical sections:

| Section Index | Canonical Title (ES) | Canonical Title (EN) | Key Parts Included |
|---|---|---|---|
| **0** | **Ritos Iniciales** | *Introductory Rites* | El Saludo Inicial, Acto Penitencial (Confiteor / Kyrie), El Gloria, Oración Colecta |
| **1** | **Liturgia de la Palabra** | *Liturgy of the Word* | Primera Lectura, Salmo Responsorial, Segunda Lectura, Aclamación del Evangelio (Aleluya), Proclamación del Santo Evangelio, La Homilía, Profesión de Fe (El Credo), Oración Universal (Plegaria de los Fieles) |
| **2** | **Liturgia Eucarística** | *Liturgy of the Eucharist* | Presentación de las Ofrendas y Ofertorio, Diálogo del Prefacio, Sanctus (Santo, Santo), Plegaria Eucarística y Consagración, Aclamación del Memorial, Doxología Mayor |
| **3** | **Rito de Comunión** | *The Communion Rite* | Padre Nuestro (Our Father), El Saludo de la Paz, Fracción del Pan (Fractio Panis), Agnus Dei (Cordero de Dios), Oración Privada del Sacerdote, Invitación y Recepción de la Santa Comunión, Purificación de los Vasos Sagrados, Oración Después de la Comunión |
| **4** | **Ritos Conclusivos** | *Concluding Rites* | Bendición Final, La Despedida y Envío (Ite, missa est) |

---

### 1.4 Hero and Navigation CTA Triggers
In `src/app/LandingClient.tsx`:

1. **Mobile Header Menu** (`src/app/LandingClient.tsx:1363-1369`):
   ```tsx
   <button 
     type="button"
     onClick={() => { setMobileMenuOpen(false); setModalUrl('guia'); triggerHaptic('medium'); }}
     style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', padding: 0, textAlign: 'left', width: '100%' }}
   >
     Guía de Misa y Lecturas
   </button>
   ```

2. **Action Grid "Guía de Misa" Button** (`src/app/LandingClient.tsx:1732-1744`):
   ```tsx
   <button 
     className={`recursos-btn btn-guia ${bounceBtn === 'guia' ? 'bounce-active' : ''}`} 
     onClick={() => { setModalUrl('guia', { seccion: activeGuiaTab }); triggerHaptic('medium'); }}
     data-tooltip="Abrir Guía de Misa para principiantes"
   >
     Guía de Misa
   </button>
   ```

3. **Action Grid "Seguir la Misa" Button** (`src/app/LandingClient.tsx:1775-1791`):
   ```tsx
   <button 
     className={`recursos-btn btn-seguir-misa ${bounceBtn === 'seguir-misa' ? 'bounce-active' : ''}`} 
     onClick={() => { 
       setActiveGuiaTab('respuestas'); 
       setModalUrl('guia', { seccion: 'respuestas' }); 
       triggerHaptic('medium'); 
     }}
     data-tooltip="Seguir la Misa: lecturas, salmos, respuestas y cantos litúrgicos"
   >
     Seguir la Misa
   </button>
   ```

---

### 1.5 Loading, Error, and Offline UI States
1. **Loading State**:
   - Tab 1 displays a centered spinner banner: `"Cargando la Liturgia de la Palabra de hoy..."` (`LandingClient.tsx:2495-2498`).
   - In `AppleMusicLyrics` modal, no loading indicator was present if opened while fetching.
2. **Offline & Fallback Banner**:
   - `LandingClient.tsx:2488-2492` renders `(Liturgia común / modo sin conexión)` when `dailyReadings?.isFallback === true`.
3. **Upstream Error Handling**:
   - `src/app/api/mass-readings/route.ts` catches any network timeouts or HTTP failures and safely returns `FALLBACK_READINGS` with status `200` and `isFallback: true`.

---

## 2. Logic Chain

```
[Observation 1.2: Accordion in Tab 2 separates readings from the Ordinary]
  + [Observation 1.3: massResponses.ts Section 2 has static placeholder lines]
  ↓
(Inference: The user has to click an accordion or switch between tabs to read the Word of God during Mass, breaking liturgical immersion)
  ↓
[Requirement R2: Remove accordion & dynamically inject readings sequentially into Liturgia de la Palabra]
  ↓
(Actionable Solution: Construct a canonical injection pipeline that replaces placeholder parts in Section 2 with real scraped readings in exact liturgical order)
```

```
[Observation 1.4: Main Mass button triggers setModalUrl('guia', { seccion: activeGuiaTab })]
  + [Observation 1.1: fetchDailyReadings only called if showGuiaMisa is open and activeTab is 'lecturas']
  ↓
(Inference: Direct access is delayed; readings may not be cached if user clicks directly into Mass mode)
  ↓
[Requirement R3: Direct Access & Auto-fetch]
  ↓
(Actionable Solution: Auto-fetch readings on initial client mount, and configure Main Mass button to launch the integrated interactive Mass guide starting directly at Ritos Iniciales with 100% pre-loaded readings)
```

---

## 3. Canonical Injection Pipeline Design

The 5 exact canonical injection points in **Liturgia de la Palabra** (`massResponses[1]`):

```
┌────────────────────────────────────────────────────────────────────────────┐
│                    SECCIÓN 2: LITURGIA DE LA PALABRA                       │
├────────────────────────────────────────────────────────────────────────────┤
│ 1. PRIMERA LECTURA (Sentados)                                              │
│    • Rubric: Sentados                                                      │
│    • Title: Primera Lectura (dailyReadings.firstReading.citation)          │
│    • Speaker: Lector                                                       │
│    • Content: dailyReadings.firstReading.text                              │
│    • Acclamation:                                                          │
│        Lector: "Palabra de Dios."                                          │
│        Pueblo: "Te alabamos, Señor."                                       │
├────────────────────────────────────────────────────────────────────────────┤
│ 2. SALMO RESPONSORIAL (Sentados)                                           │
│    • Rubric: Sentados                                                      │
│    • Title: Salmo Responsorial (dailyReadings.psalm.citation)              │
│    • Response Box: R. [dailyReadings.psalm.response]                       │
│    • Speaker: Salmista / Pueblo (Duet style)                               │
│    • Content: Stanzas from dailyReadings.psalm.text with recurring         │
│      response line "R. [dailyReadings.psalm.response]"                     │
├────────────────────────────────────────────────────────────────────────────┤
│ 3. SEGUNDA LECTURA (Sentados) [CONDITIONAL RENDERING]                      │
│    • Condition: Render ONLY if dailyReadings.secondReading exists          │
│      (Sundays and Solemnities). Omit on weekdays (Feria).                  │
│    • Title: Segunda Lectura (dailyReadings.secondReading.citation)         │
│    • Speaker: Lector                                                       │
│    • Content: dailyReadings.secondReading.text                             │
│    • Acclamation:                                                          │
│        Lector: "Palabra de Dios."                                          │
│        Pueblo: "Te alabamos, Señor."                                       │
├────────────────────────────────────────────────────────────────────────────┤
│ 4. ACLAMACIÓN DEL EVANGELIO (De pie)                                       │
│    • Rubric: De pie                                                        │
│    • Title: Aclamación del Evangelio (Aleluya)                             │
│    • Speaker: Todos                                                        │
│    • Content: "¡Aleluya, aleluya!" (or Lenten verse)                       │
├────────────────────────────────────────────────────────────────────────────┤
│ 5. PROCLAMACIÓN DEL SANTO EVANGELIO (De pie)                               │
│    • Rubric: De pie                                                        │
│    • Title: Proclamación del Santo Evangelio (dailyReadings.gospel.citation│
│    • Introductory Dialogue:                                                │
│        Sacerdote: "El Señor esté con ustedes."                             │
│        Pueblo: "Y con tu espíritu."                                        │
│        Sacerdote: "Lectura del santo Evangelio según..."                   │
│        Pueblo: "Gloria a ti, Señor."                                       │
│    • Content: dailyReadings.gospel.text                                    │
│    • Concluding Dialogue:                                                  │
│        Sacerdote: "Palabra del Señor."                                     │
│        Pueblo: "Gloria a ti, Señor Jesús."                                 │
│        Sacerdote (en secreto): "Las palabras del Evangelio borren..."      │
├────────────────────────────────────────────────────────────────────────────┤
│ 6. LA HOMILÍA (Sentados)                                                   │
│ 7. PROFESIÓN DE FE — EL CREDO (De pie)                                     │
│ 8. ORACIÓN UNIVERSAL — PLEGARIA DE LOS FIELES (De pie)                     │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Proposed Dynamic Generator Function

To dynamically build the line array for `AppleMusicLyrics` and standard section views without altering static types or causing hydration mismatches:

```typescript
export function getCanonicalMassLines(
  sectionIdx: number,
  dailyReadings: MassReadingsResponse | null,
  lang: 'es' | 'en'
): Array<{ text: string; speaker?: string; isLeft?: boolean }> {
  const section = massResponses[sectionIdx];
  if (!section) return [];

  // If section is not Liturgia de la Palabra, return standard ordinary lines
  if (sectionIdx !== 1 || !dailyReadings) {
    return [
      { text: `---SECTION---${section.title[lang]}` },
      ...section.parts.flatMap(part => [
        { text: `---SECTION---${part.title[lang]}` },
        ...part.lines[lang].map(l => ({
          text: l.text,
          speaker: l.speaker,
          isLeft: l.speaker === 'Sacerdote' || l.speaker === 'Celebrant' || l.speaker === 'Priest' || l.speaker === 'Diácono'
        }))
      ])
    ];
  }

  // Dynamic Injection for Liturgia de la Palabra
  const lines: Array<{ text: string; speaker?: string; isLeft?: boolean }> = [
    { text: `---SECTION---${section.title[lang]}` }
  ];

  // 1. Primera Lectura
  const r1 = dailyReadings.firstReading;
  lines.push({ text: `---SECTION---${lang === 'en' ? 'First Reading' : 'Primera Lectura'}${r1.shortCitation ? ` (${r1.shortCitation})` : ''}` });
  lines.push({ text: r1.citation, speaker: lang === 'en' ? 'Lector' : 'Lector', isLeft: true });
  // Split reading text into natural paragraphs/sentences for kinetic text reading
  r1.text.split('\n\n').forEach(paragraph => {
    if (paragraph.trim()) {
      lines.push({ text: paragraph.trim(), speaker: lang === 'en' ? 'Lector' : 'Lector', isLeft: true });
    }
  });
  lines.push({ text: lang === 'en' ? 'The Word of the Lord.' : 'Palabra de Dios.', speaker: lang === 'en' ? 'Lector' : 'Lector', isLeft: true });
  lines.push({ text: lang === 'en' ? 'Thanks be to God.' : 'Te alabamos, Señor.', speaker: lang === 'en' ? 'People' : 'Pueblo', isLeft: false });

  // 2. Salmo Responsorial
  const psalm = dailyReadings.psalm;
  lines.push({ text: `---SECTION---${lang === 'en' ? 'Responsorial Psalm' : 'Salmo Responsorial'}${psalm.shortCitation ? ` (${psalm.shortCitation})` : ''}` });
  if (psalm.response) {
    lines.push({ text: `R. ${psalm.response}`, speaker: lang === 'en' ? 'Psalmist' : 'Salmista', isLeft: true });
    lines.push({ text: `R. ${psalm.response}`, speaker: lang === 'en' ? 'All' : 'Todos', isLeft: false });
  }
  psalm.text.split('\n\n').forEach(stanza => {
    if (stanza.trim()) {
      lines.push({ text: stanza.trim(), speaker: lang === 'en' ? 'Psalmist' : 'Salmista', isLeft: true });
      if (psalm.response) {
        lines.push({ text: `R. ${psalm.response}`, speaker: lang === 'en' ? 'All' : 'Todos', isLeft: false });
      }
    }
  });

  // 3. Segunda Lectura (Conditional)
  if (dailyReadings.secondReading && dailyReadings.secondReading.text.trim()) {
    const r2 = dailyReadings.secondReading;
    lines.push({ text: `---SECTION---${lang === 'en' ? 'Second Reading' : 'Segunda Lectura'}${r2.shortCitation ? ` (${r2.shortCitation})` : ''}` });
    lines.push({ text: r2.citation, speaker: lang === 'en' ? 'Lector' : 'Lector', isLeft: true });
    r2.text.split('\n\n').forEach(paragraph => {
      if (paragraph.trim()) {
        lines.push({ text: paragraph.trim(), speaker: lang === 'en' ? 'Lector' : 'Lector', isLeft: true });
      }
    });
    lines.push({ text: lang === 'en' ? 'The Word of the Lord.' : 'Palabra de Dios.', speaker: lang === 'en' ? 'Lector' : 'Lector', isLeft: true });
    lines.push({ text: lang === 'en' ? 'Thanks be to God.' : 'Te alabamos, Señor.', speaker: lang === 'en' ? 'People' : 'Pueblo', isLeft: false });
  }

  // 4. Aleluya
  lines.push({ text: `---SECTION---${lang === 'en' ? 'Gospel Acclamation' : 'Aclamación del Evangelio (Aleluya)'}` });
  lines.push({
    text: lang === 'en' ? 'Alleluia, alleluia!' : '¡Aleluya, aleluya!',
    speaker: lang === 'en' ? 'All' : 'Todos',
    isLeft: false
  });

  // 5. Santo Evangelio
  const gospel = dailyReadings.gospel;
  lines.push({ text: `---SECTION---${lang === 'en' ? 'Holy Gospel' : 'Santo Evangelio'}${gospel.shortCitation ? ` (${gospel.shortCitation})` : ''}` });
  lines.push({ text: lang === 'en' ? 'The Lord be with you.' : 'El Señor esté con ustedes.', speaker: lang === 'en' ? 'Celebrant' : 'Sacerdote', isLeft: true });
  lines.push({ text: lang === 'en' ? 'And with your spirit.' : 'Y con tu espíritu.', speaker: lang === 'en' ? 'People' : 'Pueblo', isLeft: false });
  lines.push({ text: gospel.citation, speaker: lang === 'en' ? 'Celebrant' : 'Sacerdote', isLeft: true });
  lines.push({ text: lang === 'en' ? 'Glory to you, O Lord.' : 'Gloria a ti, Señor.', speaker: lang === 'en' ? 'People' : 'Pueblo', isLeft: false });
  gospel.text.split('\n\n').forEach(paragraph => {
    if (paragraph.trim()) {
      lines.push({ text: paragraph.trim(), speaker: lang === 'en' ? 'Celebrant' : 'Sacerdote', isLeft: true });
    }
  });
  lines.push({ text: lang === 'en' ? 'The Gospel of the Lord.' : 'Palabra del Señor.', speaker: lang === 'en' ? 'Celebrant' : 'Sacerdote', isLeft: true });
  lines.push({ text: lang === 'en' ? 'Praise to you, Lord Jesus Christ.' : 'Gloria a ti, Señor Jesús.', speaker: lang === 'en' ? 'People' : 'Pueblo', isLeft: false });

  // 6. Remaining parts of Section 2: Homily, Creed, Universal Prayer
  const remainingParts = section.parts.slice(5);
  remainingParts.forEach(part => {
    lines.push({ text: `---SECTION---${part.title[lang]}` });
    part.lines[lang].forEach(l => {
      lines.push({
        text: l.text,
        speaker: l.speaker,
        isLeft: l.speaker === 'Sacerdote' || l.speaker === 'Celebrant' || l.speaker === 'Priest' || l.speaker === 'Diácono'
      });
    });
  });

  return lines;
}
```

---

## 5. Caveats
1. **Network Mode**: The scraper API relies on Evangelizo XML endpoint; when offline or during upstream downtime, it safely provides `FALLBACK_READINGS` with standard liturgical texts.
2. **Sunday vs Weekday Second Reading**: Scraper and UI must cleanly handle both 3-reading Sunday liturgies and 2-reading weekday liturgies without empty headers or UI stutter.

---

## 6. Conclusion
The Mass Guide UI architecture is modular and ready for the canonical overhaul:
1. The old accordion dropdown `showLecturasInResponses` in `LandingClient.tsx:2587-2644` can be cleanly removed.
2. The dynamic injection pipeline integrates the 5 canonical readings directly into `Liturgia de la Palabra`.
3. Auto-fetching on page mount ensures instantaneous reading availability.
4. Main Mass buttons in Hero and Navigation can be configured to directly launch the Mass Guide without intermediate menu friction.

---

## 7. Verification Method
1. **Automated E2E Suite**:
   ```bash
   npm test
   ```
2. **Build Verification**:
   ```bash
   npm run build
   ```
3. **Manual Flow Verification Checklist**:
   - Click "Guía de Misa" / "Seguir la Misa" → modal opens directly at Ritos Iniciales.
   - Navigate to "Liturgia de la Palabra" → verify Primera Lectura, Salmo Responsorial with response phrase, conditional Segunda Lectura, Aleluya, and Evangelio are presented in exact canonical order with no accordion.
