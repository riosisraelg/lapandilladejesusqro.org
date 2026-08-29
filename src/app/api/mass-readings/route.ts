import { NextResponse } from 'next/server';

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
  liturgicalDay: string; // e.g. "Viernes de la 21a semana del Tiempo Ordinario"
  saint?: string; // Daily saint commemoration
  firstReading: LiturgicalReadingSection;
  psalm: LiturgicalPsalmSection;
  secondReading?: LiturgicalReadingSection; // Omitted on weekdays, present on Sundays/Solemnities
  alleluia: LiturgicalAlleluiaSection;
  gospel: LiturgicalReadingSection;
  meditation?: LiturgicalMeditationSection;
  isFallback?: boolean; // True if served from embedded fallback
  source?: string; // 'evangelizo' | 'fallback'
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
 * Decodes XML/HTML named and numerical entities (decimal and hex) and Spanish accented characters.
 */
function decodeEntities(str: string): string {
  if (!str) return '';

  const NAMED_ENTITIES: Record<string, string> = {
    // Accented vowels & Spanish characters
    '&aacute;': 'á',
    '&Aacute;': 'Á',
    '&eacute;': 'é',
    '&Eacute;': 'É',
    '&iacute;': 'í',
    '&Iacute;': 'Í',
    '&oacute;': 'ó',
    '&Oacute;': 'Ó',
    '&uacute;': 'ú',
    '&Uacute;': 'Ú',
    '&ntilde;': 'ñ',
    '&Ntilde;': 'Ñ',
    '&uuml;': 'ü',
    '&Uuml;': 'Ü',
    // Punctuation & Quotes
    '&laquo;': '«',
    '&raquo;': '»',
    '&ldquo;': '“',
    '&rdquo;': '”',
    '&lsquo;': '‘',
    '&rsquo;': '’',
    '&ndash;': '–',
    '&mdash;': '—',
    '&hellip;': '…',
    '&iquest;': '¿',
    '&iexcl;': '¡',
    '&deg;': '°',
    '&ordf;': 'ª',
    '&ordm;': 'º',
    '&sect;': '§',
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™',
    '&bull;': '•',
    // Standard XML/HTML
    '&nbsp;': ' ',
    '&quot;': '"',
    '&apos;': "'",
    '&#39;': "'",
    '&lt;': '<',
    '&gt;': '>',
  };

  let result = str;

  // Replace named entities
  for (const [entity, char] of Object.entries(NAMED_ENTITIES)) {
    result = result.replaceAll(entity, char);
  }

  // Replace decimal numerical entities: &#123;
  result = result.replace(/&#(\d+);/g, (_, dec) => {
    try {
      const code = parseInt(dec, 10);
      return isNaN(code) ? _ : String.fromCodePoint(code);
    } catch {
      return _;
    }
  });

  // Replace hex numerical entities: &#x1f;
  result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
    try {
      const code = parseInt(hex, 16);
      return isNaN(code) ? _ : String.fromCodePoint(code);
    } catch {
      return _;
    }
  });

  // Replace &amp; last
  result = result.replaceAll('&amp;', '&');

  return result;
}

/**
 * Extracts and cleans text inside XML tags, supporting CDATA blocks, HTML tag stripping, and entity decoding.
 */
function extractXmlTag(xml: string, tagName: string): string {
  if (!xml) return '';
  const regex = new RegExp(`<${tagName}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const match = xml.match(regex);
  if (!match) return '';

  let content = match[1];

  // Strip or unwrap CDATA blocks: <![CDATA[ ... ]]>
  content = content.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1');

  // Convert HTML break tags to newlines before tag removal
  content = content
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>\s*<p[^>]*>/gi, '\n\n')
    .replace(/<\/?p[^>]*>/gi, '\n\n');

  // Strip remaining HTML tags
  content = content.replace(/<\/?[a-zA-Z][^>]*>/g, '');

  // Decode entities
  content = decodeEntities(content);

  // Normalize line breaks and whitespace
  content = content
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return content;
}

/**
 * Parses Psalm text into antiphon response and structured stanzas with line breaks preserved.
 */
function parsePsalm(
  rawText: string,
  citation: string,
  shortCitation?: string
): LiturgicalPsalmSection {
  if (!rawText || !rawText.trim()) {
    return {
      citation: citation || 'Salmo Responsorial',
      shortCitation,
      response: '',
      text: '',
      stanzas: [],
    };
  }

  const cleaned = rawText.trim();
  
  // Normalize paragraphs (split by 2 or more newlines)
  const paragraphs = cleaned
    .split(/\n\s*\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  let antiphon = '';
  let stanzas: string[] = [];

  // Antiphon prefix detection regex: "R.", "R/.", "R:", "Respuesta:", "Antífona:", "— R.", etc.
  const responsePrefixRegex = /^(?:[—–\-]\s*)?(?:R\/?\.?|Respuesta:|Ant[ií]fona:)\s*/i;

  if (paragraphs.length > 1 && responsePrefixRegex.test(paragraphs[0])) {
    // Case 1: First paragraph is explicitly the antiphon response
    const firstPara = paragraphs[0];
    let cleanResponse = firstPara.replace(responsePrefixRegex, '').trim();
    cleanResponse = cleanResponse.replace(/\s*\([oO]\s+bien:[^)]+\)/i, '').trim();
    antiphon = cleanResponse;

    const rawStanzas = paragraphs.slice(1);
    stanzas = rawStanzas
      .map(stanza => {
        // If a stanza begins with a repeated "R. ...", strip it or if it is solely the antiphon, omit
        if (responsePrefixRegex.test(stanza) && stanza.length < 150) {
          return '';
        }
        return stanza.trim();
      })
      .filter(s => s.length > 0);
  } else if (paragraphs.length === 1 && responsePrefixRegex.test(paragraphs[0])) {
    // Case 2: Only 1 paragraph provided, but it contains an antiphon header on line 1
    const lines = paragraphs[0].split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length > 1 && responsePrefixRegex.test(lines[0])) {
      antiphon = lines[0].replace(responsePrefixRegex, '').replace(/\s*\([oO]\s+bien:[^)]+\)/i, '').trim();
      stanzas = [lines.slice(1).join('\n')];
    } else {
      antiphon = lines[0].replace(responsePrefixRegex, '').replace(/\s*\([oO]\s+bien:[^)]+\)/i, '').trim();
      stanzas = [paragraphs[0]];
    }
  } else {
    // Case 3: No explicit R. in the first paragraph
    const rIndex = paragraphs.findIndex(p => responsePrefixRegex.test(p));
    if (rIndex !== -1) {
      antiphon = paragraphs[rIndex].replace(responsePrefixRegex, '').replace(/\s*\([oO]\s+bien:[^)]+\)/i, '').trim();
      stanzas = paragraphs.filter((_, idx) => idx !== rIndex);
    } else {
      // Case 4: No R. markers at all.
      // Extract the first line or first sentence as the antiphon response, while preserving all stanzas
      const firstLine = paragraphs[0].split('\n')[0].trim();
      if (firstLine.length > 0 && firstLine.length <= 140) {
        antiphon = firstLine.replace(/[:—–]$/, '').trim();
      } else {
        antiphon = 'El Señor es mi pastor, nada me falta.';
      }
      // CRITICAL: Preserve all original paragraphs in stanzas so verse 1 is never lost or truncated!
      stanzas = [...paragraphs];
    }
  }

  // Ensure stanzas array is not empty
  if (stanzas.length === 0 && cleaned) {
    stanzas = [cleaned];
    if (!antiphon) {
      antiphon = cleaned.split('\n')[0].trim();
    }
  }

  const fullText = stanzas.join('\n\n');

  return {
    citation: citation || 'Salmo Responsorial',
    shortCitation,
    response: antiphon,
    text: fullText,
    stanzas,
  };
}

/**
 * Liturgical season determination and Alleluia / Gospel Acclamation builder.
 */
function buildLiturgicalAlleluia(
  liturgicalDay: string,
  xmlString: string,
  _requestedDate: string
): LiturgicalAlleluiaSection {
  const dayLower = (liturgicalDay || '').toLowerCase();

  // 1. Detect Liturgical Season
  const isLent = /cuaresma|ceniza|semana santa|triduo|jueves santo|viernes santo|s[aá]bado santo|domingo de ramos|pasi[oó]n/i.test(dayLower);
  const isEaster = /pascua|pascual|resurrecci[oó]n|pentecost[eé]s|octava de pascua/i.test(dayLower);
  const isAdvent = /adviento/i.test(dayLower);
  const isChristmas = /navidad|natividad|epifan[ií]a|sagrada familia|bautismo del se[nñ]or|santa mar[ií]a, madre de dios/i.test(dayLower);

  // 2. Determine base acclamation
  const defaultAcclamation = isLent
    ? 'Honor y gloria a ti, Señor Jesús'
    : '¡Aleluya, aleluya!';

  // 3. Seasonal default verses & citations
  let defaultVerse = 'Tus palabras, Señor, son espíritu y vida; tú tienes palabras de vida eterna.';
  let defaultCitation = 'Jn 6, 63c. 68c';

  if (isLent) {
    defaultVerse = 'El hombre no vive solamente de pan, sino de toda palabra que sale de la boca de Dios.';
    defaultCitation = 'Mt 4, 4b';
  } else if (isEaster) {
    defaultVerse = 'Cristo, nuestra Pascua, ha sido inmolado; celebremos, pues, la fiesta en el Señor.';
    defaultCitation = '1 Co 5, 7b-8a';
  } else if (isAdvent) {
    defaultVerse = 'Muéstranos, Señor, tu misericordia y danos tu salvación.';
    defaultCitation = 'Sal 85, 8';
  } else if (isChristmas) {
    defaultVerse = 'Les anuncio una gran alegría: hoy nos ha nacido el Salvador, que es Cristo el Señor.';
    defaultCitation = 'Lc 2, 10-11';
  }

  // 4. Check for explicit Alleluia in Evangelizo XML
  const explicitVerse = extractXmlTag(xmlString, 'reading_alleluia') ||
                        extractXmlTag(xmlString, 'reading_verse') ||
                        extractXmlTag(xmlString, 'reading_gospel_a');

  const text3Lt = extractXmlTag(xmlString, 'reading_text3_lt');
  const text3St = extractXmlTag(xmlString, 'reading_text3_st');
  const text3 = extractXmlTag(xmlString, 'reading_text3');

  const isText3Alleluia = Boolean(
    text3 && (
      /aleluya|aclamaci[oó]n|acclamatio/i.test(text3Lt) ||
      /^(?:¡?aleluya|honor y gloria|gloria y honor|r\.\s*aleluya)/i.test(text3.trim()) ||
      (text3.length < 250 && /aleluya/i.test(text3))
    )
  );

  if (explicitVerse) {
    return {
      acclamation: defaultAcclamation,
      verse: explicitVerse,
      citation: defaultCitation,
    };
  }

  if (isText3Alleluia && text3) {
    let cleanVerse = text3
      .replace(/^(?:¡?aleluya,?\s*aleluya!?|honor y gloria a ti,?\s*se[nñ]or jes[uú]s!?|r\.\s*aleluya)\.?\s*/i, '')
      .replace(/\s*(?:¡?aleluya!?)\.?$/i, '')
      .trim();

    if (!cleanVerse) cleanVerse = defaultVerse;

    return {
      acclamation: defaultAcclamation,
      verse: cleanVerse,
      citation: text3St || text3Lt || defaultCitation,
    };
  }

  return {
    acclamation: defaultAcclamation,
    verse: defaultVerse,
    citation: defaultCitation,
  };
}

/**
 * Parses Evangelizo XML into a strongly typed MassReadingsResponse
 */
function parseEvangelizoXmlFeed(xmlString: string, requestedDate: string): MassReadingsResponse {
  if (!xmlString || typeof xmlString !== 'string') {
    throw new Error('Invalid XML payload');
  }

  const liturgicalDay = extractXmlTag(xmlString, 'litugic_t') || extractXmlTag(xmlString, 'title') || 'Liturgia Cotidiana de la Palabra';
  const saint = extractXmlTag(xmlString, 'saint') || undefined;

  const reading1Citation = extractXmlTag(xmlString, 'reading_text1_lt') || 'Primera Lectura';
  const reading1Short = extractXmlTag(xmlString, 'reading_text1_st') || undefined;
  const reading1Text = extractXmlTag(xmlString, 'reading_text1') || '';

  const psalmCitation = extractXmlTag(xmlString, 'reading_text2_lt') || 'Salmo Responsorial';
  const psalmShort = extractXmlTag(xmlString, 'reading_text2_st') || undefined;
  const psalmRawText = extractXmlTag(xmlString, 'reading_text2') || '';
  const parsedPsalm = parsePsalm(psalmRawText, psalmCitation, psalmShort);

  const parsedAlleluia = buildLiturgicalAlleluia(liturgicalDay, xmlString, requestedDate);

  const reading3Lt = extractXmlTag(xmlString, 'reading_text3_lt');
  const reading3St = extractXmlTag(xmlString, 'reading_text3_st') || undefined;
  const reading3Text = extractXmlTag(xmlString, 'reading_text3');

  const isReading3Alleluia = Boolean(
    reading3Text && (
      /aleluya|aclamaci[oó]n|acclamatio/i.test(reading3Lt) ||
      /^(?:¡?aleluya|honor y gloria|gloria y honor|r\.\s*aleluya)/i.test(reading3Text.trim()) ||
      (reading3Text.length < 250 && /aleluya/i.test(reading3Text))
    )
  );

  const gospelCitation = extractXmlTag(xmlString, 'reading_gospel_lt') || 'Santo Evangelio';
  const gospelShort = extractXmlTag(xmlString, 'reading_gospel_st') || undefined;
  const gospelText = extractXmlTag(xmlString, 'reading_gospel') || '';

  const commentTitle = extractXmlTag(xmlString, 'comment_t');
  const commentAuthor = extractXmlTag(xmlString, 'comment_a') || commentTitle || 'Padres de la Iglesia';
  const commentText = extractXmlTag(xmlString, 'comment');

  const result: MassReadingsResponse = {
    date: requestedDate,
    liturgicalDay,
    saint: saint || undefined,
    firstReading: {
      citation: reading1Citation,
      shortCitation: reading1Short,
      text: reading1Text,
    },
    psalm: parsedPsalm,
    alleluia: parsedAlleluia,
    gospel: {
      citation: gospelCitation,
      shortCitation: gospelShort,
      text: gospelText,
    },
    isFallback: false,
    source: 'evangelizo',
  };

  if (reading3Text && reading3Text.trim().length > 0 && !isReading3Alleluia) {
    result.secondReading = {
      citation: reading3Lt || 'Segunda Lectura',
      shortCitation: reading3St,
      text: reading3Text.trim(),
    };
  }

  if (commentText && commentText.trim().length > 0) {
    result.meditation = {
      author: commentAuthor,
      text: commentText.trim(),
    };
  }

  return result;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  
  // Format today's date in Mexico City (YYYYMMDD) as default
  let dateParam = searchParams.get('date');
  if (!dateParam) {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Mexico_City',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    dateParam = formatter.format(now).replace(/-/g, '');
  } else {
    // Normalize YYYY-MM-DD to YYYYMMDD
    dateParam = dateParam.replace(/[^0-9]/g, '');
  }

  let langParam = searchParams.get('lang')?.toUpperCase() || 'SP';
  if (langParam === 'ES') langParam = 'SP';

  const feedUrl = `http://feed.evangelizo.org/v2/reader.php?date=${dateParam}&lang=${langParam}&type=xml`;

  try {
    const res = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'LaPandillaDeJesus-MassReader/1.0 (Querétaro; Catholic Youth Mission)',
        'Accept': 'application/xml, text/xml, */*',
      },
      next: { revalidate: 86400 }, // Cache on Next.js edge / server for 24 hours
      signal: AbortSignal.timeout(6000), // 6 second safety timeout
    });

    if (!res.ok) {
      console.warn(`[MassReadings] Evangelizo returned HTTP ${res.status}: falling back to static liturgy.`);
      return NextResponse.json(
        { ...FALLBACK_READINGS, date: dateParam, isFallback: true, source: 'fallback' },
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
          },
        }
      );
    }

    const xmlText = await res.text();
    if (!xmlText || !xmlText.includes('<evangelizo>')) {
      console.warn('[MassReadings] Evangelizo returned empty or non-XML response: using fallback.');
      return NextResponse.json(
        { ...FALLBACK_READINGS, date: dateParam, isFallback: true, source: 'fallback' },
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
          },
        }
      );
    }

    const parsedData = parseEvangelizoXmlFeed(xmlText, dateParam);

    return NextResponse.json(parsedData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
      },
    });
  } catch (error: any) {
    console.error('[MassReadings] Scraper error:', error?.message || error);
    return NextResponse.json(
      { ...FALLBACK_READINGS, date: dateParam, isFallback: true, source: 'fallback' },
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
