import { NextResponse } from 'next/server';

export interface MassReadingsResponse {
  date: string;
  liturgicalDay: string;
  saint?: string;
  firstReading: {
    citation: string;
    shortCitation?: string;
    text: string;
  };
  psalm: {
    citation: string;
    shortCitation?: string;
    response: string;
    text: string;
  };
  secondReading?: {
    citation: string;
    shortCitation?: string;
    text: string;
  };
  gospel: {
    citation: string;
    shortCitation?: string;
    text: string;
  };
  meditation?: {
    author: string;
    text: string;
  };
  isFallback?: boolean;
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
por años sin fin.`
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
  isFallback: true
};

/**
 * Extracts and cleans text inside XML tags, supporting CDATA blocks and HTML entity decoding
 */
function extractXmlTag(xml: string, tagName: string): string {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
  const match = xml.match(regex);
  if (!match) return '';

  let content = match[1];

  // Remove CDATA wrapper if present: <![CDATA[ ... ]]>
  const cdataMatch = content.match(/<!\[CDATA\[([\s\S]*?)\]\]>/i);
  if (cdataMatch) {
    content = cdataMatch[1];
  }

  // Basic HTML entity decoding
  content = content
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");

  return content.trim();
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
  const psalmText = extractXmlTag(xmlString, 'reading_text2') || '';

  // Extract first line of psalm as response if available
  let psalmResponse = '';
  if (psalmText) {
    const firstLine = psalmText.split('\n')[0]?.replace(/[—–\-]/g, '').trim();
    if (firstLine && firstLine.length < 120) {
      psalmResponse = firstLine;
    }
  }

  const reading2Citation = extractXmlTag(xmlString, 'reading_text3_lt');
  const reading2Short = extractXmlTag(xmlString, 'reading_text3_st') || undefined;
  const reading2Text = extractXmlTag(xmlString, 'reading_text3');

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
    psalm: {
      citation: psalmCitation,
      shortCitation: psalmShort,
      response: psalmResponse,
      text: psalmText,
    },
    gospel: {
      citation: gospelCitation,
      shortCitation: gospelShort,
      text: gospelText,
    },
    isFallback: false,
  };

  if (reading2Text && reading2Text.trim().length > 0) {
    result.secondReading = {
      citation: reading2Citation || 'Segunda Lectura',
      shortCitation: reading2Short,
      text: reading2Text.trim(),
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
        { ...FALLBACK_READINGS, date: dateParam },
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        }
      );
    }

    const xmlText = await res.text();
    if (!xmlText || !xmlText.includes('<evangelizo>')) {
      console.warn('[MassReadings] Evangelizo returned empty or non-XML response: using fallback.');
      return NextResponse.json(
        { ...FALLBACK_READINGS, date: dateParam },
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
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
      { ...FALLBACK_READINGS, date: dateParam },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  }
}
