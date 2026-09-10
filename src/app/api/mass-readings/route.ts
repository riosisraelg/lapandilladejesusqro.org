import { NextResponse } from 'next/server';
import { USCCB, createNodeHttpClient, SectionType, type Mass } from 'catholic-mass-readings';

export interface LiturgicalReadingSection {
  citation: string;
  shortCitation?: string;
  text: string;
}

export interface LiturgicalPsalmSection extends LiturgicalReadingSection {
  response: string;
  stanzas?: string[];
}

export interface LiturgicalAlleluiaSection {
  citation?: string;
  acclamation: string;
  verse: string;
}

export interface LiturgicalMeditationSection {
  author: string;
  text: string;
}

export interface MassReadingsResponse {
  date: string; // Normalised 'YYYYMMDD' or 'YYYY-MM-DD'
  liturgicalDay: string; // e.g. "Thursday of the Twenty-third Week in Ordinary Time"
  saint?: string; // Daily saint commemoration
  firstReading: LiturgicalReadingSection;
  psalm: LiturgicalPsalmSection;
  secondReading?: LiturgicalReadingSection; // Omitted on weekdays, present on Sundays/Solemnities
  alleluia: LiturgicalAlleluiaSection;
  gospel: LiturgicalReadingSection;
  meditation?: LiturgicalMeditationSection;
  isFallback?: boolean; // True if served from embedded fallback
  source?: string; // 'catholic-mass-readings' | 'fallback'
}

// Fallback readings when network is unavailable or upstream feed fails
const FALLBACK_READINGS: MassReadingsResponse = {
  date: '20260827',
  liturgicalDay: 'Liturgia Cotidiana de la Palabra',
  saint: 'Santos del Día',
  firstReading: {
    citation: 'Lectura de la Carta del apóstol San Pablo a los Efesios (4, 1-6)',
    shortCitation: 'Ef 4, 1-6',
    text: 'Hermanos: Yo, el prisionero por el Señor, les ruego que caminen como es digno de la vocación a la que han sido llamados, con toda humildad y mansedumbre, con paciencia, sobrellevándose mutuamente con amor, esforzándose por conservar la unidad del Espíritu con el vínculo de la paz. Un solo Cuerpo y un solo Espíritu, como una sola es la esperanza de la vocación a la que han sido llamados. Un solo Señor, una sola fe, un solo bautismo, un solo Dios y Padre de todos, que está sobre todos, actúa por medio de todos y reside en todos.'
  },
  psalm: {
    citation: 'Salmo 23 (22), 1-3a. 3b-4. 5. 6',
    shortCitation: 'Sal 23',
    response: 'El Señor es mi pastor, nada me falta.',
    text: `El Señor es mi pastor, nada me falta:
en verdes praderas me hace reposar,
hacia aguas tranquilas me guía
y conforta mi alma.

Me conduce por senderos justos,
por el honor de su nombre.
Aunque camine por cañadas oscuras,
nada temo, porque tú vas conmigo:
tu vara y tu cayado me sosiegan.

Preparas una mesa ante mí,
frente a mis enemigos;
unges con óleo mi cabeza,
mi copa rebosa.

Tu bondad y tu misericordia me acompañan
todos los días de mi vida,
y habitaré en la casa del Señor
por años sin fin.`,
    stanzas: [
      `El Señor es mi pastor, nada me falta:
en verdes praderas me hace reposar,
hacia aguas tranquilas me guía
y conforta mi alma.`,
      `Me conduce por senderos justos,
por el honor de su nombre.
Aunque camine por cañadas oscuras,
nada temo, porque tú vas conmigo:
tu vara y tu cayado me sosiegan.`,
      `Preparas una mesa ante mí,
frente a mis enemigos;
unges con óleo mi cabeza,
mi copa rebosa.`,
      `Tu bondad y tu misericordia me acompañan
todos los días de mi vida,
y habitaré en la casa del Señor
por años sin fin.`
    ]
  },
  alleluia: {
    citation: 'Jn 6, 63c. 68c',
    acclamation: '¡Aleluya, aleluya!',
    verse: 'Tus palabras, Señor, son espíritu y vida; tú tienes palabras de vida eterna.'
  },
  gospel: {
    citation: 'Lectura del santo Evangelio según San Juan (14, 1-6)',
    shortCitation: 'Jn 14, 1-6',
    text: `En aquel tiempo, dijo Jesús a sus discípulos: «No se turbe su corazón. Crean en Dios y crean también en mí. En la casa de mi Padre hay muchas moradas; si no fuera así, se lo habría dicho, porque voy a prepararles un lugar. Y cuando haya ido y les haya preparado un lugar, volveré y los llevaré conmigo, para que donde estoy yo, estén también ustedes. Y a donde yo voy, ya saben el camino».

Tomás le dice: «Señor, no sabemos a dónde vas, ¿cómo podemos saber el camino?».

Jesús le responde: «Yo soy el Camino, la Verdad y la Vida. Nadie va al Padre sino por mí».`
  },
  meditation: {
    author: 'San Agustín de Hipona',
    text: 'Cristo es nuestro camino porque con su encarnación y vida nos mostró el sendero hacia la salvación. Es la verdad que ilumina nuestra inteligencia y la vida que sacia la sed inextinguible de nuestra alma.'
  },
  isFallback: true,
  source: 'fallback'
};

/**
 * Parses Psalm text into antiphon response and verse stanzas
 */
function parsePsalmFromReading(readingText: string, citation: string, shortCitation?: string): LiturgicalPsalmSection {
  if (!readingText || !readingText.trim()) {
    return {
      citation: citation || 'Responsorial Psalm',
      shortCitation: shortCitation || citation,
      response: '',
      text: '',
      stanzas: []
    };
  }

  const responsePrefixRegex = /^R\.\s*(?:\([^\)]+\)\s*)?/i;
  const paragraphs = readingText.split(/\n\s*\n+/).map(p => p.trim()).filter(Boolean);

  let response = '';
  const stanzas: string[] = [];
  let currentStanzaLines: string[] = [];

  for (const p of paragraphs) {
    if (responsePrefixRegex.test(p)) {
      if (!response) {
        response = p.replace(responsePrefixRegex, '').trim();
      }
      if (currentStanzaLines.length > 0) {
        stanzas.push(currentStanzaLines.join('\n\n'));
        currentStanzaLines = [];
      }
    } else {
      currentStanzaLines.push(p);
    }
  }

  if (currentStanzaLines.length > 0) {
    stanzas.push(currentStanzaLines.join('\n\n'));
  }

  if (!response && paragraphs.length > 0) {
    response = paragraphs[0].replace(/^R\.\s*/i, '').trim();
    if (stanzas.length === 0 && paragraphs.length > 1) {
      stanzas.push(...paragraphs.slice(1));
    }
  }

  return {
    citation: citation || 'Responsorial Psalm',
    shortCitation: shortCitation || citation,
    response,
    text: stanzas.join('\n\n') || readingText,
    stanzas: stanzas.length > 0 ? stanzas : [readingText],
  };
}

/**
 * Parses Alleluia section into acclamation and lectionary verse
 */
function parseAlleluiaFromReading(readingText: string, citation?: string): LiturgicalAlleluiaSection {
  if (!readingText || !readingText.trim()) {
    return { citation, acclamation: 'Alleluia, alleluia!', verse: '' };
  }

  const paragraphs = readingText.split(/\n\s*\n+/).map(p => p.trim()).filter(Boolean);
  const rAlleluiaRegex = /^R\.\s*(?:alleluia|aleluya)/i;
  let acclamation = 'Alleluia, alleluia!';
  const verseParas: string[] = [];

  for (const para of paragraphs) {
    if (rAlleluiaRegex.test(para)) {
      acclamation = para.replace(/^R\.\s*/i, '').trim();
      if (!acclamation.endsWith('!') && !acclamation.endsWith('.')) {
        acclamation += '!';
      }
    } else {
      verseParas.push(para);
    }
  }

  return {
    citation,
    acclamation,
    verse: verseParas.join('\n\n') || readingText,
  };
}

/**
 * Maps USCCB Mass domain object from catholic-mass-readings to MassReadingsResponse
 */
function mapUsccbMassToResponse(mass: Mass, requestedDateStr: string): MassReadingsResponse {
  const sections = mass.sections || [];

  // First Reading
  const r1Sec = sections.find(s =>
    s.type === SectionType.READING &&
    (s.header.toLowerCase().includes('1') || !s.header.toLowerCase().includes('2'))
  ) || sections.find(s => s.type === SectionType.READING);
  const r1 = r1Sec?.readings[0];
  const r1Citation = r1?.verses?.map(v => v.text).join(', ') || r1Sec?.header || 'Reading 1';

  // Responsorial Psalm
  const psalmSec = sections.find(s => s.type === SectionType.PSALM);
  const psalmReading = psalmSec?.readings[0];
  const psalmCitation = psalmReading?.verses?.map(v => v.text).join(', ') || psalmSec?.header || 'Responsorial Psalm';
  const psalm = parsePsalmFromReading(psalmReading?.text || '', psalmCitation);

  // Second Reading (Sundays / Solemnities)
  const r2Sec = sections.find(s =>
    s.type === SectionType.READING &&
    (s.header.toLowerCase().includes('2') || s.header.toLowerCase().includes('second'))
  );
  let secondReading: LiturgicalReadingSection | undefined = undefined;
  if (r2Sec && r2Sec.readings && r2Sec.readings[0]?.text) {
    const r2 = r2Sec.readings[0];
    const r2Citation = r2.verses?.map(v => v.text).join(', ') || r2Sec.header || 'Reading 2';
    secondReading = { citation: r2Citation, shortCitation: r2Citation, text: r2.text };
  }

  // Alleluia
  const alleluiaSec = sections.find(s => s.type === SectionType.ALLELUIA);
  const alleluiaReading = alleluiaSec?.readings[0];
  const alleluiaCitation = alleluiaReading?.verses?.map(v => v.text).join(', ') || undefined;
  const alleluia = parseAlleluiaFromReading(alleluiaReading?.text || '', alleluiaCitation);

  // Gospel
  const gospelSec = sections.find(s => s.type === SectionType.GOSPEL);
  const gospelReading = gospelSec?.readings[0];
  const gospelCitation = gospelReading?.verses?.map(v => v.text).join(', ') || gospelSec?.header || 'Gospel';

  return {
    date: requestedDateStr,
    liturgicalDay: mass.title || 'Daily Mass',
    firstReading: {
      citation: r1Citation,
      shortCitation: r1Citation,
      text: r1?.text || '',
    },
    psalm,
    ...(secondReading ? { secondReading } : {}),
    alleluia,
    gospel: {
      citation: gospelCitation,
      shortCitation: gospelCitation,
      text: gospelReading?.text || '',
    },
    isFallback: false,
    source: 'catholic-mass-readings',
  };
}

/**
 * Normalizes input date parameter to Date object and YYYYMMDD string
 */
function parseDateQuery(dateParam: string | null): { dateObj: Date; dateStr: string } {
  if (!dateParam) {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Mexico_City',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const parts = formatter.formatToParts(now);
    const y = parseInt(parts.find(p => p.type === 'year')?.value || '2026', 10);
    const m = parseInt(parts.find(p => p.type === 'month')?.value || '9', 10);
    const d = parseInt(parts.find(p => p.type === 'day')?.value || '10', 10);
    const dateStr = `${y}${String(m).padStart(2, '0')}${String(d).padStart(2, '0')}`;
    return { dateObj: new Date(y, m - 1, d), dateStr };
  }

  const isoMatch = dateParam.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const y = parseInt(isoMatch[1], 10);
    const m = parseInt(isoMatch[2], 10);
    const d = parseInt(isoMatch[3], 10);
    return { dateObj: new Date(y, m - 1, d), dateStr: `${y}${String(m).padStart(2, '0')}${String(d).padStart(2, '0')}` };
  }

  const compactMatch = dateParam.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (compactMatch) {
    const y = parseInt(compactMatch[1], 10);
    const m = parseInt(compactMatch[2], 10);
    const d = parseInt(compactMatch[3], 10);
    return { dateObj: new Date(y, m - 1, d), dateStr: dateParam };
  }

  const cleaned = dateParam.replace(/[^0-9]/g, '');
  if (cleaned.length === 8) {
    const y = parseInt(cleaned.slice(0, 4), 10);
    const m = parseInt(cleaned.slice(4, 6), 10);
    const d = parseInt(cleaned.slice(6, 8), 10);
    return { dateObj: new Date(y, m - 1, d), dateStr: cleaned };
  }

  const parsed = new Date(dateParam);
  if (!isNaN(parsed.getTime())) {
    const y = parsed.getFullYear();
    const m = parsed.getMonth() + 1;
    const d = parsed.getDate();
    return { dateObj: parsed, dateStr: `${y}${String(m).padStart(2, '0')}${String(d).padStart(2, '0')}` };
  }

  const now = new Date();
  return { dateObj: now, dateStr: '20260910' };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const { dateObj, dateStr } = parseDateQuery(searchParams.get('date'));
  const langParam = searchParams.get('lang')?.toLowerCase() || 'es';

  try {
    const httpClient = await createNodeHttpClient();
    const usccb = new USCCB(httpClient);

    // Timeout guard for upstream USCCB queries
    const massPromise = usccb.getMassFromDate(dateObj);
    const timeoutPromise = new Promise<null>((_, reject) =>
      setTimeout(() => reject(new Error('USCCB query timeout')), 8000)
    );

    const mass = await Promise.race([massPromise, timeoutPromise]);

    if (!mass || !mass.sections || mass.sections.length === 0) {
      console.warn(`[MassReadings] USCCB returned empty liturgy for date ${dateStr}: using fallback.`);
      return NextResponse.json(
        { ...FALLBACK_READINGS, date: dateStr, isFallback: true, source: 'fallback' },
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
          },
        }
      );
    }

    const payload = mapUsccbMassToResponse(mass, dateStr);

    return NextResponse.json(payload, {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
      },
    });
  } catch (error: any) {
    console.error('[MassReadings] Scraper error:', error?.message || error);
    return NextResponse.json(
      { ...FALLBACK_READINGS, date: dateStr, isFallback: true, source: 'fallback' },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
        },
      }
    );
  }
}
