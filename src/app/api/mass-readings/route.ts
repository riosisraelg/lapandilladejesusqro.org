import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import { USCCB, createNodeHttpClient, SectionType, type Mass } from 'catholic-mass-readings';
import {
  USCCBSpanish,
  createNodeHttpClient as createSpanishHttpClient,
  SectionType as SpanishSectionType,
  type SerializedMass,
  type SerializedSection,
  getFirstReading,
  getResponsorialPsalm,
  getAlleluia,
  getGospel,
  extractPsalmResponse,
} from 'spanish-mass-readings';

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
  source?: string; // 'spanish-mass-readings' | 'catholic-mass-readings' | 'dual-scraper' | 'fallback'
  language?: 'es' | 'en' | 'bilingual';
  readings?: {
    es: MassReadingsResponse;
    en: MassReadingsResponse;
  };
}

// Fallback readings when network is unavailable or upstream feed fails
const FALLBACK_READINGS: MassReadingsResponse = {
  date: '20260827',
  liturgicalDay: 'Liturgia Cotidiana de la Palabra',
  saint: 'Santos del Día',
  language: 'es',
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

const FALLBACK_READINGS_EN: MassReadingsResponse = {
  date: '20260827',
  liturgicalDay: 'Daily Liturgy of the Word',
  saint: 'Saints of the Day',
  language: 'en',
  firstReading: {
    citation: 'Reading from the Letter of Saint Paul to the Ephesians (4:1-6)',
    shortCitation: 'Eph 4:1-6',
    text: 'Brothers and sisters: I, a prisoner for the Lord, urge you to live in a manner worthy of the call you have received, with all humility and gentleness, with patience, bearing with one another through love, striving to preserve the unity of the spirit through the bond of peace: one Body and one Spirit, as you were also called to the one hope of your call; one Lord, one faith, one baptism; one God and Father of all, who is over all and through all and in all.'
  },
  psalm: {
    citation: 'Psalm 24:1-2, 3-4ab, 5-6',
    shortCitation: 'Ps 24',
    response: 'The Lord is my shepherd; there is nothing I shall want.',
    text: `The LORD's are the earth and its fullness;
the world and those who dwell in it.
For he founded it upon the seas
and established it upon the rivers.

Who can ascend the mountain of the LORD?
or who may stand in his holy place?
One whose hands are sinless, whose heart is clean,
who desires not what is vain.

He shall receive a blessing from the LORD,
a reward from God his savior.
Such is the race that seeks for him,
that seeks the face of the God of Jacob.`,
    stanzas: [
      `The LORD's are the earth and its fullness;\nthe world and those who dwell in it.\nFor he founded it upon the seas\nand established it upon the rivers.`,
      `Who can ascend the mountain of the LORD?\nor who may stand in his holy place?\nOne whose hands are sinless, whose heart is clean,\nwho desires not what is vain.`,
      `He shall receive a blessing from the LORD,\na reward from God his savior.\nSuch is the race that seeks for him,\nthat seeks the face of the God of Jacob.`
    ]
  },
  alleluia: {
    citation: 'Jn 6:63c, 68c',
    acclamation: 'Alleluia, alleluia!',
    verse: 'Your words, Lord, are Spirit and life; you have the words of everlasting life.'
  },
  gospel: {
    citation: 'Reading from the holy Gospel according to John (14:1-6)',
    shortCitation: 'Jn 14:1-6',
    text: `Jesus said to his disciples: "Do not let your hearts be troubled. You have faith in God; have faith also in me. In my Father's house there are many dwelling places. If there were not, would I have told you that I am going to prepare a place for you? And if I go and prepare a place for you, I will come back again and take you to myself, so that where I am you also may be. Where I am going you know the way."

Thomas said to him, "Master, we do not know where you are going; how can we know the way?"

Jesus said to him, "I am the way and the truth and the life. No one comes to the Father except through me."`
  },
  meditation: {
    author: 'Saint Augustine of Hippo',
    text: 'Christ is our way because through His incarnation and life He showed us the path to salvation.'
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
    language: 'en',
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
 * Maps USCCBSpanish SerializedMass from spanish-mass-readings to MassReadingsResponse
 */
function mapSpanishMassToResponse(mass: SerializedMass, requestedDateStr: string): MassReadingsResponse {
  const sections = mass.sections || [];

  // First Reading
  const r1Sec = getFirstReading(mass) || sections.find(s =>
    (s.header || '').toLowerCase().includes('primera') ||
    !(s.header || '').toLowerCase().includes('segunda')
  );
  const r1Reading = r1Sec?.readings?.[0];
  const r1Citation = r1Reading?.verses?.map(v => v.text).join(', ') || r1Sec?.header || 'Primera lectura';
  const r1Text = r1Reading?.text || '';

  // Responsorial Psalm
  const psalmSec = getResponsorialPsalm(mass) || sections.find(s => (s.header || '').toLowerCase().includes('salmo'));
  const psalmReading = psalmSec?.readings?.[0];
  const psalmCitation = psalmReading?.verses?.map(v => v.text).join(', ') || psalmSec?.header || 'Salmo Responsorial';
  const rawPsalmText = psalmReading?.text || '';
  const psalm = parsePsalmFromReading(rawPsalmText, psalmCitation);
  if (!psalm.response) {
    const extracted = extractPsalmResponse(rawPsalmText);
    if (extracted) {
      psalm.response = extracted;
    }
  }

  // Second Reading (Sundays / Solemnities)
  const r2Sec = sections.find(s => {
    const hdr = (s.header || '').toLowerCase();
    return hdr.includes('segunda') || hdr.includes('second');
  });
  let secondReading: LiturgicalReadingSection | undefined = undefined;
  if (r2Sec && r2Sec.readings && r2Sec.readings[0]?.text) {
    const r2 = r2Sec.readings[0];
    const r2Citation = r2.verses?.map(v => v.text).join(', ') || r2Sec.header || 'Segunda lectura';
    secondReading = { citation: r2Citation, shortCitation: r2Citation, text: r2.text || '' };
  }

  // Alleluia
  const alleluiaSec = getAlleluia(mass) || sections.find(s =>
    (s.header || '').toLowerCase().includes('aclamación') ||
    (s.header || '').toLowerCase().includes('aleluya')
  );
  const alleluiaReading = alleluiaSec?.readings?.[0];
  const alleluiaCitation = alleluiaReading?.verses?.map(v => v.text).join(', ') || undefined;
  const alleluia = parseAlleluiaFromReading(alleluiaReading?.text || '', alleluiaCitation);

  // Gospel
  const gospelSec = getGospel(mass) || sections.find(s => (s.header || '').toLowerCase().includes('evangelio'));
  const gospelReading = gospelSec?.readings?.[0];
  const gospelCitation = gospelReading?.verses?.map(v => v.text).join(', ') || gospelSec?.header || 'Evangelio';
  const gospelText = gospelReading?.text || '';

  return {
    date: requestedDateStr,
    liturgicalDay: mass.title || 'Misa Diaria',
    language: 'es',
    firstReading: {
      citation: r1Citation,
      shortCitation: r1Citation,
      text: r1Text,
    },
    psalm,
    ...(secondReading ? { secondReading } : {}),
    alleluia,
    gospel: {
      citation: gospelCitation,
      shortCitation: gospelCitation,
      text: gospelText,
    },
    isFallback: false,
    source: 'spanish-mass-readings',
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

/**
 * Fetch and map Spanish lectionary using USCCBSpanish
 */
async function fetchSpanishMass(dateObj: Date, dateStr: string): Promise<MassReadingsResponse> {
  try {
    const usccbSpanish = new USCCBSpanish();

    const massPromise = usccbSpanish.getMassFromDate(dateObj);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('USCCB Spanish query timeout')), 12000)
    );

    const serializedMass = await Promise.race([massPromise, timeoutPromise]);
    if (!serializedMass || !serializedMass.sections || serializedMass.sections.length === 0) {
      throw new Error(`Empty Spanish liturgy returned for date ${dateStr}`);
    }
    return mapSpanishMassToResponse(serializedMass, dateStr);
  } catch (liveErr) {
    // Offline fixture fallback if live network is unreachable
    const isoDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
    const fixturePath = path.resolve(process.cwd(), 'subprojects/spanish-mass-readings/fixtures', `${isoDate}.json`);
    if (fs.existsSync(fixturePath)) {
      try {
        const fixtureData: SerializedMass = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
        return mapSpanishMassToResponse(fixtureData, dateStr);
      } catch {
        // fall through
      }
    }
    throw liveErr;
  }
}

/**
 * Fetch and map English lectionary using USCCB from catholic-mass-readings
 */
async function fetchEnglishMass(dateObj: Date, dateStr: string): Promise<MassReadingsResponse> {
  const httpClient = await createNodeHttpClient();
  const usccb = new USCCB(httpClient);

  const massPromise = usccb.getMassFromDate(dateObj);
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('USCCB English query timeout')), 8000)
  );

  const mass = await Promise.race([massPromise, timeoutPromise]);
  if (!mass || !mass.sections || mass.sections.length === 0) {
    throw new Error(`Empty English liturgy returned for date ${dateStr}`);
  }
  return mapUsccbMassToResponse(mass, dateStr);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const { dateObj, dateStr } = parseDateQuery(searchParams.get('date'));
  const langParam = searchParams.get('lang')?.toLowerCase() || 'es';

  // Branch 1: Concurrent Dual / Bilingual Lectionary (lang=both or lang=bilingual)
  if (langParam === 'both' || langParam === 'bilingual') {
    try {
      const [spanishRes, englishRes] = await Promise.allSettled([
        fetchSpanishMass(dateObj, dateStr),
        fetchEnglishMass(dateObj, dateStr),
      ]);

      const spanish = spanishRes.status === 'fulfilled'
        ? spanishRes.value
        : { ...FALLBACK_READINGS, date: dateStr, isFallback: true, source: 'fallback', language: 'es' as const };

      const english = englishRes.status === 'fulfilled'
        ? englishRes.value
        : { ...FALLBACK_READINGS_EN, date: dateStr, isFallback: true, source: 'fallback', language: 'en' as const };

      const isBothFallback = (spanish.isFallback ?? false) && (english.isFallback ?? false);

      const combined: MassReadingsResponse = {
        ...spanish,
        date: dateStr,
        language: 'bilingual',
        source: isBothFallback ? 'fallback' : 'dual-scraper',
        isFallback: isBothFallback,
        readings: {
          es: spanish,
          en: english,
        },
      };

      return NextResponse.json(combined, {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': isBothFallback
            ? 'public, s-maxage=300, stale-while-revalidate=3600'
            : 'public, s-maxage=86400, stale-while-revalidate=43200',
        },
      });
    } catch (error: any) {
      console.error('[MassReadings] Dual-scraper error:', error?.message || error);
      const fallbackCombined: MassReadingsResponse = {
        ...FALLBACK_READINGS,
        date: dateStr,
        language: 'bilingual',
        isFallback: true,
        source: 'fallback',
        readings: {
          es: { ...FALLBACK_READINGS, date: dateStr, language: 'es' },
          en: { ...FALLBACK_READINGS_EN, date: dateStr, language: 'en' },
        },
      };
      return NextResponse.json(fallbackCombined, {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
        },
      });
    }
  }

  // Branch 2: English Lectionary (lang=en)
  if (langParam === 'en') {
    try {
      const payload = await fetchEnglishMass(dateObj, dateStr);
      return NextResponse.json(payload, {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
        },
      });
    } catch (error: any) {
      console.error('[MassReadings] English scraper error:', error?.message || error);
      return NextResponse.json(
        { ...FALLBACK_READINGS_EN, date: dateStr, isFallback: true, source: 'fallback', language: 'en' },
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

  // Branch 3: Spanish Lectionary (lang=es or default)
  try {
    const payload = await fetchSpanishMass(dateObj, dateStr);
    return NextResponse.json(payload, {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
      },
    });
  } catch (error: any) {
    console.error('[MassReadings] Spanish scraper error:', error?.message || error);
    return NextResponse.json(
      { ...FALLBACK_READINGS, date: dateStr, isFallback: true, source: 'fallback', language: 'es' },
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
