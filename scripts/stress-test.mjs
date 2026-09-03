#!/usr/bin/env node

/**
 * ============================================================================
 * ADVERSARIAL STRESS TEST SUITE — CHALLENGER 1
 * ============================================================================
 * Deep stress-testing for:
 *   - src/app/api/mass-readings/route.ts
 *   - src/app/massResponses.ts
 * ============================================================================
 */

import assert from 'node:assert/strict';

// Helper to simulate the route's helper logic directly or test against the module
// Since route.ts is TypeScript, we can extract and evaluate its logic or run tests against imported module via tsx / ts-node or evaluate with standard JS oracle identical to route.ts.

console.log('Starting Challenger 1 Adversarial Stress Test Suite...');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ✔ PASS: ${name}`);
  } catch (err) {
    failedTests++;
    console.error(`  ✖ FAIL: ${name}`);
    console.error(`    ${err.message}`);
    if (err.stack) {
      console.error(err.stack.split('\n').slice(1, 4).join('\n'));
    }
  }
}

// ============================================================================
// 1. DECODE ENTITIES TESTING
// ============================================================================
console.log('\n--- 1. Testing Entity Decoding ---');

function decodeEntities(str) {
  if (!str) return '';

  const NAMED_ENTITIES = {
    '&aacute;': 'á', '&Aacute;': 'Á',
    '&eacute;': 'é', '&Eacute;': 'É',
    '&iacute;': 'í', '&Iacute;': 'Í',
    '&oacute;': 'ó', '&Oacute;': 'Ó',
    '&uacute;': 'ú', '&Uacute;': 'Ú',
    '&ntilde;': 'ñ', '&Ntilde;': 'Ñ',
    '&uuml;': 'ü', '&Uuml;': 'Ü',
    '&laquo;': '«', '&raquo;': '»',
    '&ldquo;': '“', '&rdquo;': '”',
    '&lsquo;': '‘', '&rsquo;': '’',
    '&ndash;': '–', '&mdash;': '—',
    '&hellip;': '…', '&iquest;': '¿',
    '&iexcl;': '¡', '&deg;': '°',
    '&ordf;': 'ª', '&ordm;': 'º',
    '&sect;': '§', '&copy;': '©',
    '&reg;': '®', '&trade;': '™',
    '&bull;': '•', '&nbsp;': ' ',
    '&quot;': '"', '&apos;': "'",
    '&#39;': "'", '&lt;': '<',
    '&gt;': '>',
  };

  let result = str;
  for (const [entity, char] of Object.entries(NAMED_ENTITIES)) {
    result = result.replaceAll(entity, char);
  }

  // Decimal
  result = result.replace(/&#(\d+);/g, (_, dec) => {
    try {
      const code = parseInt(dec, 10);
      return isNaN(code) ? _ : String.fromCodePoint(code);
    } catch {
      return _;
    }
  });

  // Hex
  result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
    try {
      const code = parseInt(hex, 16);
      return isNaN(code) ? _ : String.fromCodePoint(code);
    } catch {
      return _;
    }
  });

  result = result.replaceAll('&amp;', '&');
  return result;
}

test('Spanish named accented entities & punctuation', () => {
  const input = '&iexcl;Se&ntilde;or, ten piedad! &iquest;D&oacute;nde est&aacute;s? &Eacute;l vendr&aacute; con Jes&uacute;s y Mar&iacute;a en Bel&eacute;n &amp; Nazaret.';
  const expected = '¡Señor, ten piedad! ¿Dónde estás? Él vendrá con Jesús y María en Belén & Nazaret.';
  assert.equal(decodeEntities(input), expected);
});

test('Decimal numeric entities', () => {
  // &#161; = ¡, &#241; = ñ, &#225; = á, &#233; = é, &#237; = í, &#243; = ó, &#250; = ú, &#191; = ¿
  const input = '&#161;Se&#241;or Jes&#250;s&#33; &#191;Qui&#233;n eres? Mar&#237;a y Jos&#233;';
  const expected = '¡Señor Jesús! ¿Quién eres? María y José';
  assert.equal(decodeEntities(input), expected);
});

test('Hexadecimal numeric entities (lowercase, uppercase, mixed)', () => {
  // &#xa1; = ¡, &#xf1; = ñ, &#xE1; = á, &#x00e9; = é
  const input = '&#xa1;Se&#xF1;or! &#xE1;ngel &#x00e9;xodo';
  const expected = '¡Señor! Ángel éxodo';
  assert.equal(decodeEntities(input), expected);
});

test('High-order unicode and emoji codepoint entities', () => {
  // &#128512; / &#x1F600; (😀), em-dash &#8212; (—)
  const input = 'Paz &#8212; &#128512; &#x1F64F;';
  const expected = 'Paz — 😀 🙏';
  assert.equal(decodeEntities(input), expected);
});

test('Double-escaped and malformed entities do not crash', () => {
  assert.equal(decodeEntities(''), '');
  assert.equal(decodeEntities(null), '');
  assert.equal(decodeEntities(undefined), '');
  assert.equal(decodeEntities('&amp;aacute;'), '&aacute;');
  assert.equal(decodeEntities('&#; &#x; &#999999999; &unknown;'), '&#; &#x; &#999999999; &unknown;');
});

// ============================================================================
// 2. XML TAG EXTRACTION & CORRUPTED FEED STRESS
// ============================================================================
console.log('\n--- 2. Testing XML Extraction & Corrupted XML Feeds ---');

function extractXmlTag(xml, tagName) {
  if (!xml) return '';
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i');
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

test('Standard CDATA block extraction', () => {
  const xml = `<reading_text1><![CDATA[En aquel tiempo, dijo Jesús...]]></reading_text1>`;
  assert.equal(extractXmlTag(xml, 'reading_text1'), 'En aquel tiempo, dijo Jesús...');
});

test('Multiple CDATA blocks in a single XML tag', () => {
  const xml = `<reading_text1><![CDATA[Parte 1. ]]><![CDATA[Parte 2 con &aacute;cento.]]></reading_text1>`;
  assert.equal(extractXmlTag(xml, 'reading_text1'), 'Parte 1. Parte 2 con ácento.');
});

test('Nested HTML tags and paragraph conversion', () => {
  const xml = `<reading_text1><p class="verse"><b>Hermanos:</b><br/>Caminen con humildad.</p><p><i>Un solo Se&ntilde;or.</i></p></reading_text1>`;
  const result = extractXmlTag(xml, 'reading_text1');
  assert.ok(result.includes('Hermanos:\nCaminen con humildad.'));
  assert.ok(result.includes('Un solo Señor.'));
  assert.ok(!result.includes('<p>'));
  assert.ok(!result.includes('<b>'));
  assert.ok(!result.includes('<i>'));
});

test('XML with tag attributes, namespaces, or mixed casing', () => {
  const xml = `<READING_TEXT1 lang="es" id="r1" data-attr="test">Lectura del libro de los Hechos.</READING_TEXT1>`;
  assert.equal(extractXmlTag(xml, 'reading_text1'), 'Lectura del libro de los Hechos.');
});

test('Corrupted XML: Missing closing tag returns empty string safely', () => {
  const xml = `<reading_text1>Lectura inconclusa sin cerrar`;
  assert.equal(extractXmlTag(xml, 'reading_text1'), '');
});

test('Corrupted XML: Empty tags or self-closing tags', () => {
  assert.equal(extractXmlTag('<reading_text1></reading_text1>', 'reading_text1'), '');
  assert.equal(extractXmlTag('<reading_text1/>', 'reading_text1'), '');
  assert.equal(extractXmlTag('', 'reading_text1'), '');
  assert.equal(extractXmlTag(null, 'reading_text1'), '');
});

test('Unclosed CDATA block inside valid XML tags', () => {
  const xml = `<reading_text1><![CDATA[Texto sin cerrar CDATA</reading_text1>`;
  const res = extractXmlTag(xml, 'reading_text1');
  assert.ok(res.includes('Texto sin cerrar CDATA'));
});

test('Dangerous script/iframe injection inside XML feed', () => {
  const xml = `<reading_text1><![CDATA[<script>alert("XSS")</script><iframe src="evil.com"></iframe>Palabra de Dios.]]></reading_text1>`;
  const res = extractXmlTag(xml, 'reading_text1');
  assert.ok(!res.includes('<script>'));
  assert.ok(!res.includes('<iframe>'));
  assert.ok(res.includes('Palabra de Dios.'));
});

// ============================================================================
// 3. PSALM PARSER STRESS TESTING
// ============================================================================
console.log('\n--- 3. Testing Psalm Parsing & Multi-Stanza Handling ---');

function parsePsalm(rawText, citation, shortCitation) {
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
  const paragraphs = cleaned
    .split(/\n\s*\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  let antiphon = '';
  let stanzas = [];

  const responsePrefixRegex = /^(?:[—–\-]\s*)?(?:R\/?\.?|Respuesta:|Ant[ií]fona:)\s*/i;

  if (paragraphs.length > 1 && responsePrefixRegex.test(paragraphs[0])) {
    const firstPara = paragraphs[0];
    let cleanResponse = firstPara.replace(responsePrefixRegex, '').trim();
    cleanResponse = cleanResponse.replace(/\s*\([oO]\s+bien:[^)]+\)/i, '').trim();
    antiphon = cleanResponse;

    const rawStanzas = paragraphs.slice(1);
    stanzas = rawStanzas
      .map(stanza => {
        if (responsePrefixRegex.test(stanza) && stanza.length < 150) {
          return '';
        }
        return stanza.trim();
      })
      .filter(s => s.length > 0);
  } else if (paragraphs.length === 1 && responsePrefixRegex.test(paragraphs[0])) {
    const lines = paragraphs[0].split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length > 1 && responsePrefixRegex.test(lines[0])) {
      antiphon = lines[0].replace(responsePrefixRegex, '').replace(/\s*\([oO]\s+bien:[^)]+\)/i, '').trim();
      stanzas = [lines.slice(1).join('\n')];
    } else {
      antiphon = lines[0].replace(responsePrefixRegex, '').replace(/\s*\([oO]\s+bien:[^)]+\)/i, '').trim();
      stanzas = [paragraphs[0]];
    }
  } else {
    const rIndex = paragraphs.findIndex(p => responsePrefixRegex.test(p));
    if (rIndex !== -1) {
      antiphon = paragraphs[rIndex].replace(responsePrefixRegex, '').replace(/\s*\([oO]\s+bien:[^)]+\)/i, '').trim();
      stanzas = paragraphs.filter((_, idx) => idx !== rIndex);
    } else {
      const firstLine = paragraphs[0].split('\n')[0].trim();
      if (firstLine.length > 0 && firstLine.length <= 140) {
        antiphon = firstLine.replace(/[:—–]$/, '').trim();
      } else {
        antiphon = 'El Señor es mi pastor, nada me falta.';
      }
      stanzas = [...paragraphs];
    }
  }

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

test('Psalm with 8 stanzas and explicit R. prefix', () => {
  const stanzasRaw = [];
  for (let i = 1; i <= 8; i++) {
    stanzasRaw.push(`Estrofa ${i}: Alabad al Señor en su templo,\nalabadlo en su fuerte firmamento,\ncantadle un cántico nuevo.`);
  }
  const rawText = `R. El Señor es bondadoso y compasivo.\n\n` + stanzasRaw.join('\n\n');
  const res = parsePsalm(rawText, 'Salmo 103 (102)', 'Sal 103');

  assert.equal(res.response, 'El Señor es bondadoso y compasivo.');
  assert.equal(res.stanzas.length, 8);
  assert.equal(res.stanzas[0], stanzasRaw[0]);
  assert.equal(res.stanzas[7], stanzasRaw[7]);
});

test('Psalm with interleaved repeating responses between 6 stanzas', () => {
  const rawText = `R. Tu palabra me da vida.\n\nEstrofa 1: Dichoso el que con vida intachable camina en la ley del Señor.\n\nR. Tu palabra me da vida.\n\nEstrofa 2: Dichoso el que guardando sus preceptos lo busca de todo corazón.\n\nR. Tu palabra me da vida.\n\nEstrofa 3: Tú promulgas tus decretos para que se observen con exactitud.\n\nR. Tu palabra me da vida.\n\nEstrofa 4: Ojalá mis caminos se mantengan firmes cumpliendo tus mandatos.\n\nR. Tu palabra me da vida.\n\nEstrofa 5: No tendré vergüenza al mirar todos tus mandatos.\n\nR. Tu palabra me da vida.\n\nEstrofa 6: Te alabaré con sincero corazón aprendiendo tus justos juicios.`;

  const res = parsePsalm(rawText, 'Salmo 118', 'Sal 118');
  assert.equal(res.response, 'Tu palabra me da vida.');
  assert.equal(res.stanzas.length, 6);
  assert.ok(res.stanzas[0].startsWith('Estrofa 1'));
  assert.ok(res.stanzas[5].startsWith('Estrofa 6'));
});

test('Psalm with optional alternative response: (o bien: ...)', () => {
  const rawText = `R. El Señor es mi luz y mi salvación. (o bien: El Señor es mi fortaleza)\n\nEl Señor es la defensa de mi vida,\n¿quién me hará temblar?`;
  const res = parsePsalm(rawText, 'Salmo 27', 'Sal 27');
  assert.equal(res.response, 'El Señor es mi luz y mi salvación.');
});

test('Psalm with single paragraph containing antiphon and verses on multiple lines', () => {
  const rawText = `R. Bendice, alma mía, al Señor.\nBendice, alma mía, al Señor,\ny todo mi ser a su santo nombre.\nÉl perdona todas tus culpas.`;
  const res = parsePsalm(rawText, 'Salmo 102', 'Sal 102');
  assert.equal(res.response, 'Bendice, alma mía, al Señor.');
  assert.equal(res.stanzas.length, 1);
  assert.ok(res.stanzas[0].includes('Él perdona todas tus culpas.'));
});

test('Psalm with no R. prefix: preserves all verses in stanzas and extracts line 1', () => {
  const rawText = `El Señor es mi pastor:\nnada me falta.\n\nEn verdes praderas me hace reposar,\nhacia aguas tranquilas me guía.`;
  const res = parsePsalm(rawText, 'Salmo 23', 'Sal 23');
  assert.equal(res.response, 'El Señor es mi pastor');
  assert.equal(res.stanzas.length, 2);
  assert.ok(res.stanzas[0].startsWith('El Señor es mi pastor'));
  assert.ok(res.stanzas[1].startsWith('En verdes praderas'));
});

test('Empty or whitespace-only psalm', () => {
  const res = parsePsalm('   \n  \t  ', 'Salmo 0');
  assert.equal(res.response, '');
  assert.equal(res.stanzas.length, 0);
});

// ============================================================================
// 4. LITURGICAL SEASON & ALLELUIA BUILDER STRESS
// ============================================================================
console.log('\n--- 4. Testing Liturgical Season Determination & Alleluia ---');

function buildLiturgicalAlleluia(liturgicalDay, xmlString, _requestedDate) {
  const dayLower = (liturgicalDay || '').toLowerCase();

  const isLent = /cuaresma|ceniza|semana santa|triduo|jueves santo|viernes santo|s[aá]bado santo|domingo de ramos|pasi[oó]n/i.test(dayLower);
  const isEaster = /pascua|pascual|resurrecci[oó]n|pentecost[eé]s|octava de pascua/i.test(dayLower);
  const isAdvent = /adviento/i.test(dayLower);
  const isChristmas = /navidad|epifan[ií]a|sagrada familia|bautismo del se[nñ]or|santa mar[ií]a, madre de dios/i.test(dayLower);

  const defaultAcclamation = isLent
    ? 'Honor y gloria a ti, Señor Jesús'
    : '¡Aleluya, aleluya!';

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

test('Lent season title suppresses "Aleluya" in favor of "Honor y gloria a ti, Señor Jesús"', () => {
  const lentDays = [
    'Miércoles de Ceniza',
    'I Domingo de Cuaresma',
    'Viernes de la 4a semana de Cuaresma',
    'Domingo de Ramos de la Pasión del Señor',
    'Jueves Santo en la Cena del Señor',
    'Viernes Santo de la Pasión del Señor'
  ];
  for (const day of lentDays) {
    const res = buildLiturgicalAlleluia(day, '<evangelizo></evangelizo>', '20260315');
    assert.equal(res.acclamation, 'Honor y gloria a ti, Señor Jesús', `Failed for ${day}`);
    assert.equal(res.citation, 'Mt 4, 4b');
  }
});

test('Easter season title uses Easter Paschal acclamation & verse', () => {
  const easterDays = [
    'Domingo de Pascua de la Resurrección del Señor',
    'Lunes de la Octava de Pascua',
    'Domingo de Pentecostés'
  ];
  for (const day of easterDays) {
    const res = buildLiturgicalAlleluia(day, '<evangelizo></evangelizo>', '20260405');
    assert.equal(res.acclamation, '¡Aleluya, aleluya!', `Failed for ${day}`);
    assert.equal(res.citation, '1 Co 5, 7b-8a');
  }
});

test('Advent season title uses Advent verse and citation', () => {
  const res = buildLiturgicalAlleluia('I Domingo de Adviento', '<evangelizo></evangelizo>', '20261129');
  assert.equal(res.acclamation, '¡Aleluya, aleluya!');
  assert.equal(res.citation, 'Sal 85, 8');
});

test('Christmas season title uses Christmas verse and citation', () => {
  const res = buildLiturgicalAlleluia('La Natividad del Señor', '<evangelizo></evangelizo>', '20261225');
  assert.equal(res.acclamation, '¡Aleluya, aleluya!');
  assert.equal(res.citation, 'Lc 2, 10-11');
});

test('Explicit XML Alleluia verse overrides seasonal default', () => {
  const xml = `<evangelizo><reading_alleluia>Yo soy la luz del mundo, dice el Señor.</reading_alleluia></evangelizo>`;
  const res = buildLiturgicalAlleluia('Viernes del Tiempo Ordinario', xml, '20260828');
  assert.equal(res.verse, 'Yo soy la luz del mundo, dice el Señor.');
});

// ============================================================================
// 5. SUNDAY VS WEEKDAY READING DISCRIMINATION
// ============================================================================
console.log('\n--- 5. Testing Sunday vs Weekday Feed Parsing ---');

function parseEvangelizoXmlFeed(xmlString, requestedDate) {
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

  const result = {
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

test('Sunday Solemnity with reading_text3 produces secondReading', () => {
  const xml = `<evangelizo>
    <litugic_t>Domingo XXI del Tiempo Ordinario</litugic_t>
    <reading_text1_lt>Lectura del profeta Isaías (22, 19-23)</reading_text1_lt>
    <reading_text1>Así dice el Señor a Sebná...</reading_text1>
    <reading_text2_lt>Salmo 138 (137)</reading_text2_lt>
    <reading_text2>R. Señor, tu misericordia es eterna.\n\nTe doy gracias, Señor, de todo corazón.</reading_text2>
    <reading_text3_lt>Lectura de la carta del apóstol san Pablo a los Romanos (11, 33-36)</reading_text3_lt>
    <reading_text3_st>Rm 11, 33-36</reading_text3_st>
    <reading_text3>¡Qué abismo de generosidad, de sabiduría y de conocimiento el de Dios!</reading_text3>
    <reading_gospel_lt>Lectura del santo Evangelio según san Mateo (16, 13-20)</reading_gospel_lt>
    <reading_gospel>En aquel tiempo, al llegar a la región de Cesarea de Filipo...</reading_gospel>
  </evangelizo>`;

  const parsed = parseEvangelizoXmlFeed(xml, '20260823');
  assert.ok(parsed.secondReading, 'Sunday should have secondReading');
  assert.equal(parsed.secondReading.citation, 'Lectura de la carta del apóstol san Pablo a los Romanos (11, 33-36)');
  assert.equal(parsed.secondReading.shortCitation, 'Rm 11, 33-36');
  assert.equal(parsed.secondReading.text, '¡Qué abismo de generosidad, de sabiduría y de conocimiento el de Dios!');
});

test('Weekday without reading_text3 omits secondReading', () => {
  const xml = `<evangelizo>
    <litugic_t>Viernes de la 21a semana del Tiempo Ordinario</litugic_t>
    <reading_text1_lt>1 Corintios 1, 17-25</reading_text1_lt>
    <reading_text1>Hermanos: No me envió Cristo a bautizar...</reading_text1>
    <reading_text2_lt>Salmo 33 (32)</reading_text2_lt>
    <reading_text2>R. La misericordia del Señor llena la tierra.\n\nAclamad, justos, al Señor.</reading_text2>
    <reading_gospel_lt>Mateo 25, 1-13</reading_gospel_lt>
    <reading_gospel>En aquel tiempo, dijo Jesús a sus discípulos esta parábola...</reading_gospel>
  </evangelizo>`;

  const parsed = parseEvangelizoXmlFeed(xml, '20260828');
  assert.equal(parsed.secondReading, undefined, 'Weekday must not have secondReading');
});

test('Weekday where reading_text3 is an Alleluia verse does NOT create secondReading', () => {
  const xml = `<evangelizo>
    <litugic_t>Martes de la 20a semana del Tiempo Ordinario</litugic_t>
    <reading_text1_lt>Lectura del libro de los Jueces</reading_text1_lt>
    <reading_text1>En aquellos días...</reading_text1>
    <reading_text2_lt>Salmo 85</reading_text2_lt>
    <reading_text2>R. El Señor anuncia la paz a su pueblo.</reading_text2>
    <reading_text3_lt>Aclamación antes del Evangelio</reading_text3_lt>
    <reading_text3>¡Aleluya! Jesucristo se hizo pobre por nosotros.</reading_text3>
    <reading_gospel_lt>Evangelio según San Mateo</reading_gospel_lt>
    <reading_gospel>Dijo Jesús a sus discípulos...</reading_gospel>
  </evangelizo>`;

  const parsed = parseEvangelizoXmlFeed(xml, '20260818');
  assert.equal(parsed.secondReading, undefined, 'Alleluia in reading_text3 must not become secondReading');
  assert.equal(parsed.alleluia.verse, 'Jesucristo se hizo pobre por nosotros.');
});

// ============================================================================
// 6. CANONICAL MASS INJECTION & APPLE MUSIC LYRICS STREAMING
// ============================================================================
console.log('\n--- 6. Testing Canonical Mass Injection & Dynamic Lyrics Generator ---');

// Import massResponses logic directly from massResponses.ts or equivalent
// Let's test canonical generation:
import { getCanonicalMassLines, getCanonicalMassSection, massResponses } from '../src/app/massResponses.ts';

test('Base Mass Responses array contains 5 canonical sections', () => {
  assert.equal(massResponses.length, 5);
  assert.equal(massResponses[0].title.es, 'Ritos Iniciales');
  assert.equal(massResponses[1].title.es, 'Liturgia de la Palabra');
  assert.equal(massResponses[2].title.es, 'Liturgia Eucarística');
  assert.equal(massResponses[3].title.es, 'Rito de Comunión');
  assert.equal(massResponses[4].title.es, 'Ritos Conclusivos');
});

test('getCanonicalMassSection injects 1st Reading, Psalm (with all stanzas), Alleluia, and Gospel for Weekday', () => {
  const dailyReadings = {
    date: '20260828',
    liturgicalDay: 'Viernes de la 21a semana',
    firstReading: { citation: '1 Co 1, 17-25', text: 'Hermanos: No me envió Cristo a bautizar...' },
    psalm: {
      citation: 'Salmo 33',
      response: 'La misericordia del Señor llena la tierra.',
      text: 'Estrofa 1\n\nEstrofa 2\n\nEstrofa 3\n\nEstrofa 4\n\nEstrofa 5\n\nEstrofa 6',
      stanzas: ['Estrofa 1', 'Estrofa 2', 'Estrofa 3', 'Estrofa 4', 'Estrofa 5', 'Estrofa 6']
    },
    alleluia: { acclamation: '¡Aleluya, aleluya!', verse: 'Estad en vela.' },
    gospel: { citation: 'Mt 25, 1-13', text: 'En aquel tiempo...' }
  };

  const section = getCanonicalMassSection(1, dailyReadings);
  assert.equal(section.parts.length, 7); // 1st, Psalm, Alleluia, Gospel, Homily, Creed, Universal Prayer (No 2nd reading)
  assert.equal(section.parts[0].title.es, 'Primera Lectura');
  assert.equal(section.parts[1].title.es, 'Salmo Responsorial');
  assert.equal(section.parts[2].title.es, 'Aclamación del Evangelio (Aleluya)');
  assert.equal(section.parts[3].title.es, 'Proclamación del Santo Evangelio');

  // Verify all 6 psalm stanzas are injected with assembly antiphon in section.parts[1]
  const psalmPart = section.parts[1];
  assert.equal(psalmPart.lines.es.length, 2 + (6 * 2)); // 2 initial + (6 * 2) = 14 lines
});

test('getCanonicalMassLines generates kinetic lines for Sunday with 2nd Reading and 6 Psalm stanzas', () => {
  const dailyReadings = {
    date: '20260823',
    liturgicalDay: 'Domingo XXI del Tiempo Ordinario',
    firstReading: { citation: 'Isaías 22', text: 'Así dice el Señor...' },
    psalm: {
      citation: 'Salmo 138',
      response: 'Señor, tu misericordia es eterna.',
      text: 'Stanza 1\n\nStanza 2\n\nStanza 3\n\nStanza 4\n\nStanza 5\n\nStanza 6',
      stanzas: ['Stanza 1', 'Stanza 2', 'Stanza 3', 'Stanza 4', 'Stanza 5', 'Stanza 6']
    },
    secondReading: { citation: 'Romanos 11', text: '¡Qué abismo de generosidad!' },
    alleluia: { acclamation: '¡Aleluya, aleluya!', verse: 'Tú eres Pedro.' },
    gospel: { citation: 'Mateo 16', text: 'En aquel tiempo...' }
  };

  const lines = getCanonicalMassLines(1, dailyReadings, 'es');
  assert.ok(lines.length > 30, `Expected >30 lines, got ${lines.length}`);

  // Check section markers
  const sectionMarkers = lines.filter(l => l.text.startsWith('---SECTION---')).map(l => l.text);
  assert.ok(sectionMarkers.some(s => s.includes('Primera Lectura')));
  assert.ok(sectionMarkers.some(s => s.includes('Salmo Responsorial')));
  assert.ok(sectionMarkers.some(s => s.includes('Segunda Lectura')));
  assert.ok(sectionMarkers.some(s => s.includes('Aclamación del Evangelio')));
  assert.ok(sectionMarkers.some(s => s.includes('Proclamación del Santo Evangelio')));
  assert.ok(sectionMarkers.some(s => s.includes('La Homilía')));
  assert.ok(sectionMarkers.some(s => s.includes('Profesión de Fe (El Credo)')));
  assert.ok(sectionMarkers.some(s => s.includes('Oración Universal')));

  // Check Psalm response occurrences: 1 initial Todos + 6 stanzas * 1 Todos = 7 'R. Señor, tu misericordia es eterna.'
  const respLines = lines.filter(l => l.text === 'R. Señor, tu misericordia es eterna.' && l.speaker === 'Todos');
  assert.equal(respLines.length, 7, 'Expected 7 assembly responses for 6 stanzas + initial antiphon');
});

// ============================================================================
// 7. NULL / UNDEFINED DEFENSIVE BOUNDARY CONDITIONS
// ============================================================================
console.log('\n--- 7. Testing Boundary Conditions & Null Safety ---');

test('getCanonicalMassSection handles null/undefined dailyReadings without crashing', () => {
  const s0 = getCanonicalMassSection(1, null);
  assert.ok(s0);
  const s1 = getCanonicalMassSection(1, undefined);
  assert.ok(s1);
  const s2 = getCanonicalMassSection(999, null);
  assert.ok(s2);
});

test('getCanonicalMassLines handles partial/empty dailyReadings object', () => {
  const emptyReadings = {
    date: '20260828',
    liturgicalDay: '',
    firstReading: { citation: '', text: '' },
    psalm: { citation: '', response: '', text: '', stanzas: [] },
    alleluia: { acclamation: '', verse: '' },
    gospel: { citation: '', text: '' }
  };
  const lines = getCanonicalMassLines(1, emptyReadings, 'es');
  assert.ok(lines.length > 0);
});

console.log(`\n===============================================================================`);
console.log(`STRESS TEST SUMMARY: ${passedTests}/${totalTests} Passed (${failedTests} Failed)`);
console.log(`===============================================================================\n`);

if (failedTests > 0) {
  process.exit(1);
}
