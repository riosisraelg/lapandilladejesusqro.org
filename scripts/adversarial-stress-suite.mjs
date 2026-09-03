#!/usr/bin/env node

/**
 * ============================================================================
 * ADVERSARIAL STRESS SUITE — CHALLENGER 1
 * ============================================================================
 * Comprehensive empirical stress testing of:
 *   1. src/app/api/mass-readings/route.ts
 *   2. src/app/massResponses.ts
 * ============================================================================
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = resolve(__dirname, '..');

console.log('===============================================================================');
console.log('         CHALLENGER 1: BACKEND & PARSER ADVERSARIAL STRESS SUITE                ');
console.log('===============================================================================');

import ts from 'typescript';

// Extract source code of route.ts to test exact functions
const routeSource = readFileSync(resolve(ROOT_DIR, 'src/app/api/mass-readings/route.ts'), 'utf-8');

// Transpile route.ts with TS
const transpiled = ts.transpileModule(routeSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 }
}).outputText;

// Extract internal functions into scope
const evalScope = {};
const preparedCode = transpiled
  .replace(/export interface[\s\S]*?}/g, '')
  .replace(/import[\s\S]*?;/g, '')
  .replace(/export async function GET[\s\S]*$/, '')
  + `
  scope.FALLBACK_READINGS = FALLBACK_READINGS;
  scope.decodeEntities = decodeEntities;
  scope.extractXmlTag = extractXmlTag;
  scope.parsePsalm = parsePsalm;
  scope.buildLiturgicalAlleluia = buildLiturgicalAlleluia;
  scope.parseEvangelizoXmlFeed = parseEvangelizoXmlFeed;
`;

new Function('scope', preparedCode)(evalScope);

const {
  decodeEntities,
  extractXmlTag,
  parsePsalm,
  buildLiturgicalAlleluia,
  parseEvangelizoXmlFeed,
  FALLBACK_READINGS
} = evalScope;

import {
  getCanonicalMassLines,
  getCanonicalMassSection,
  getCanonicalMassResponses,
  massResponses
} from '../src/app/massResponses.ts';

let suitePassed = 0;
let suiteFailed = 0;
const failures = [];

function runCheck(category, testName, testFn) {
  try {
    testFn();
    suitePassed++;
    console.log(`  [${category}] ✔ PASS: ${testName}`);
  } catch (err) {
    suiteFailed++;
    failures.push({ category, testName, error: err.message });
    console.log(`  [${category}] ✖ FAIL: ${testName}`);
    console.log(`    Error: ${err.message}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. MALFORMED / CORRUPTED XML FEEDS
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- Category 1: Malformed & Corrupted XML Feeds ---');

runCheck('XML', 'Unclosed tag returns empty string safely without throwing', () => {
  const xml = '<evangelizo><reading_text1>Text without closing tag';
  assert.equal(extractXmlTag(xml, 'reading_text1'), '');
});

runCheck('XML', 'Self-closing tag returns empty string', () => {
  const xml = '<evangelizo><reading_text1/></evangelizo>';
  assert.equal(extractXmlTag(xml, 'reading_text1'), '');
});

runCheck('XML', 'Unclosed CDATA block inside valid XML', () => {
  const xml = '<evangelizo><reading_text1><![CDATA[Unfinished CDATA block</reading_text1></evangelizo>';
  const res = extractXmlTag(xml, 'reading_text1');
  assert.ok(res.includes('Unfinished CDATA block'));
});

runCheck('XML', 'Multiple concatenated CDATA blocks', () => {
  const xml = '<evangelizo><reading_text1><![CDATA[First part. ]]><![CDATA[Second part.]]></reading_text1></evangelizo>';
  assert.equal(extractXmlTag(xml, 'reading_text1'), 'First part. Second part.');
});

runCheck('XML', 'Nested HTML tags (<b>, <i>, <span>, <p>, <br>) stripped and converted', () => {
  const xml = `<evangelizo><reading_text1><p class="lead"><b>Hermanos:</b></p><p>Caminen con <i>amor</i>.<br/>Un solo Señor.</p></reading_text1></evangelizo>`;
  const res = extractXmlTag(xml, 'reading_text1');
  assert.ok(!res.includes('<p>'));
  assert.ok(!res.includes('<b>'));
  assert.ok(!res.includes('<i>'));
  assert.ok(res.includes('Hermanos:'));
  assert.ok(res.includes('Caminen con amor.'));
  assert.ok(res.includes('Un solo Señor.'));
});

runCheck('XML', 'Malicious script / iframe injection neutralized', () => {
  const xml = `<evangelizo><reading_gospel><script>alert("XSS")</script><iframe src="evil.com"></iframe>Lectura del Evangelio.</reading_gospel></evangelizo>`;
  const res = extractXmlTag(xml, 'reading_gospel');
  assert.ok(!res.includes('<script>'));
  assert.ok(!res.includes('<iframe>'));
  assert.ok(res.includes('Lectura del Evangelio.'));
});

runCheck('XML', 'TAG COLLISION TEST: reading_text1 vs reading_text1_lt', () => {
  const xml = `<evangelizo>
    <reading_text1_lt>Lectura de la carta de San Pablo (1, 1-5)</reading_text1_lt>
    <reading_text1_st>1 Co 1, 1-5</reading_text1_st>
    <reading_text1>Hermanos: Les deseo la gracia de Dios.</reading_text1>
  </evangelizo>`;
  const res = extractXmlTag(xml, 'reading_text1');
  // CRITICAL: reading_text1 must NOT contain reading_text1_lt or reading_text1_st!
  assert.equal(res, 'Hermanos: Les deseo la gracia de Dios.', 'extractXmlTag matched reading_text1_lt instead of reading_text1!');
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. ACCENTED SPANISH & NUMERICAL ENTITIES
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- Category 2: Accented Spanish & Numerical Entities ---');

runCheck('Entities', 'Spanish named accented vowels and special punctuation', () => {
  const input = '&iexcl;&iquest;&Aacute;&aacute;&Eacute;&eacute;&Iacute;&iacute;&Oacute;&oacute;&Uacute;&uacute;&Ntilde;&ntilde;&Uuml;&uuml;&laquo;&raquo;&ldquo;&rdquo;&ndash;&mdash;&hellip;&deg;&ordf;&ordm;&sect;&copy;&reg;&trade;&bull;&nbsp;&quot;&apos;&#39;&lt;&gt;';
  const expected = '¡¿ÁáÉéÍíÓóÚúÑñÜü«»“”–—…°ªº§©®™• "\'\'<>';
  assert.equal(decodeEntities(input), expected);
});

runCheck('Entities', 'Decimal entities for Spanish vowels', () => {
  const input = '&#161;&#193;&#225;&#201;&#233;&#205;&#237;&#211;&#243;&#218;&#250;&#209;&#241;&#191;';
  const expected = '¡ÁáÉéÍíÓóÚúÑñ¿';
  assert.equal(decodeEntities(input), expected);
});

runCheck('Entities', 'Hexadecimal entities for Spanish vowels (mixed case)', () => {
  const input = '&#xA1;&#xC1;&#xE1;&#xC9;&#xE9;&#xCD;&#xED;&#xD3;&#xF3;&#xDA;&#xFA;&#xD1;&#xF1;&#xBF;';
  const expected = '¡ÁáÉéÍíÓóÚúÑñ¿';
  assert.equal(decodeEntities(input), expected);
});

runCheck('Entities', 'Malformed and boundary entities', () => {
  assert.equal(decodeEntities(''), '');
  assert.equal(decodeEntities(null), '');
  assert.equal(decodeEntities(undefined), '');
  assert.equal(decodeEntities('&#; &#x; &#999999999; &unknown;'), '&#; &#x; &#999999999; &unknown;');
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. LITURGICAL SEASONS (SUNDAY VS WEEKDAY VS LENT VS EASTER VS CHRISTMAS)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- Category 3: Liturgical Seasons & Readings Discrimination ---');

runCheck('Season', 'Lent liturgical title suppresses Alleluia in favor of Lent Acclamation', () => {
  const res = buildLiturgicalAlleluia('I Domingo de Cuaresma', '<evangelizo></evangelizo>', '20260301');
  assert.equal(res.acclamation, 'Honor y gloria a ti, Señor Jesús');
  assert.equal(res.citation, 'Mt 4, 4b');
});

runCheck('Season', 'Easter season uses Easter Paschal acclamation & verse', () => {
  const res = buildLiturgicalAlleluia('Domingo de Pascua de la Resurrección', '<evangelizo></evangelizo>', '20260405');
  assert.equal(res.acclamation, '¡Aleluya, aleluya!');
  assert.equal(res.citation, '1 Co 5, 7b-8a');
});

runCheck('Season', 'Christmas: "Navidad" matches Christmas season', () => {
  const res = buildLiturgicalAlleluia('Misa de Navidad', '<evangelizo></evangelizo>', '20261225');
  assert.equal(res.acclamation, '¡Aleluya, aleluya!');
  assert.equal(res.citation, 'Lc 2, 10-11');
});

runCheck('Season', 'Christmas: "La Natividad del Señor" matches Christmas season', () => {
  const res = buildLiturgicalAlleluia('La Natividad del Señor', '<evangelizo></evangelizo>', '20261225');
  assert.equal(res.citation, 'Lc 2, 10-11', 'Failed to identify "Natividad del Señor" as Christmas season!');
});

runCheck('Season', 'Sunday Solemnity with reading_text3 produces secondReading', () => {
  const xml = `<evangelizo>
    <litugic_t>Domingo XXI del Tiempo Ordinario</litugic_t>
    <reading_text1_lt>Isaías 22</reading_text1_lt>
    <reading_text1>Texto 1</reading_text1>
    <reading_text2_lt>Salmo 138</reading_text2_lt>
    <reading_text2>R. Señor, tu misericordia es eterna.\n\nEstrofa 1</reading_text2>
    <reading_text3_lt>Lectura de la carta a los Romanos (11, 33-36)</reading_text3_lt>
    <reading_text3_st>Rm 11, 33-36</reading_text3_st>
    <reading_text3>¡Qué abismo de generosidad!</reading_text3>
    <reading_gospel_lt>Mateo 16</reading_gospel_lt>
    <reading_gospel>Texto Evangelio</reading_gospel>
  </evangelizo>`;
  const parsed = parseEvangelizoXmlFeed(xml, '20260823');
  assert.ok(parsed.secondReading, 'Sunday must have secondReading');
  assert.equal(parsed.secondReading.citation, 'Lectura de la carta a los Romanos (11, 33-36)');
  assert.equal(parsed.secondReading.shortCitation, 'Rm 11, 33-36');
  assert.equal(parsed.secondReading.text, '¡Qué abismo de generosidad!');
});

runCheck('Season', 'Weekday without reading_text3 omits secondReading', () => {
  const xml = `<evangelizo>
    <litugic_t>Viernes de la 21a semana</litugic_t>
    <reading_text1_lt>1 Corintios 1</reading_text1_lt>
    <reading_text1>Texto 1</reading_text1>
    <reading_text2_lt>Salmo 33</reading_text2_lt>
    <reading_text2>R. Salmo\n\nEstrofa 1</reading_text2>
    <reading_gospel_lt>Mateo 25</reading_gospel_lt>
    <reading_gospel>Texto Evangelio</reading_gospel>
  </evangelizo>`;
  const parsed = parseEvangelizoXmlFeed(xml, '20260828');
  assert.equal(parsed.secondReading, undefined);
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. MULTI-STANZA PSALMS (6+ STANZAS & REPEATING RESPONSES)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- Category 4: Multi-Stanza Psalms & Canonical Alignment ---');

runCheck('Psalm', 'Psalm with 8 stanzas and explicit R. antiphon', () => {
  const rawText = `R. El Señor es bondadoso y compasivo.\n\n` +
    Array.from({ length: 8 }, (_, i) => `Estrofa ${i + 1}: Versos del salmo ${i + 1}`).join('\n\n');
  const res = parsePsalm(rawText, 'Salmo 103');
  assert.equal(res.response, 'El Señor es bondadoso y compasivo.');
  assert.equal(res.stanzas.length, 8);
});

runCheck('Psalm', 'Psalm with repeating R. interlaced between 6 stanzas strips interstitial R.', () => {
  const rawText = `R. Tu palabra me da vida.\n\nEstrofa 1\n\nR. Tu palabra me da vida.\n\nEstrofa 2\n\nR. Tu palabra me da vida.\n\nEstrofa 3\n\nR. Tu palabra me da vida.\n\nEstrofa 4\n\nR. Tu palabra me da vida.\n\nEstrofa 5\n\nR. Tu palabra me da vida.\n\nEstrofa 6`;
  const res = parsePsalm(rawText, 'Salmo 118');
  assert.equal(res.response, 'Tu palabra me da vida.');
  assert.equal(res.stanzas.length, 6);
  assert.equal(res.stanzas[0], 'Estrofa 1');
  assert.equal(res.stanzas[5], 'Estrofa 6');
});

runCheck('Psalm', 'getCanonicalMassLines accurately generates 6-stanza antiphonal responses', () => {
  const dailyReadings = {
    date: '20260828',
    liturgicalDay: 'Viernes',
    firstReading: { citation: '1 Co 1', text: 'Lectura 1' },
    psalm: {
      citation: 'Salmo 118',
      response: 'Tu palabra me da vida.',
      text: 'E1\n\nE2\n\nE3\n\nE4\n\nE5\n\nE6',
      stanzas: ['E1', 'E2', 'E3', 'E4', 'E5', 'E6']
    },
    alleluia: { acclamation: '¡Aleluya, aleluya!', verse: 'Verso' },
    gospel: { citation: 'Mt 25', text: 'Evangelio' }
  };

  const lines = getCanonicalMassLines(1, dailyReadings, 'es');
  const psalmSalmistaLines = lines.filter(l => l.speaker === 'Salmista');
  const psalmPuebloLines = lines.filter(l => l.speaker === 'Todos' && l.text === 'R. Tu palabra me da vida.');

  // 1 initial antiphon by Salmista + 6 stanzas by Salmista = 7
  assert.equal(psalmSalmistaLines.length, 7);
  // 1 initial antiphon response by Todos + 6 stanzas response by Todos = 7
  assert.equal(psalmPuebloLines.length, 7);
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. FALLBACK & NETWORK RESILIENCE
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n--- Category 5: Fallback & Offline Resilience ---');

runCheck('Fallback', 'FALLBACK_READINGS structure is fully compliant with MassReadingsResponse', () => {
  assert.ok(FALLBACK_READINGS.firstReading.text.length > 50);
  assert.ok(FALLBACK_READINGS.psalm.stanzas.length >= 4);
  assert.ok(FALLBACK_READINGS.psalm.response.length > 10);
  assert.ok(FALLBACK_READINGS.alleluia.verse.length > 10);
  assert.ok(FALLBACK_READINGS.gospel.text.length > 50);
  assert.equal(FALLBACK_READINGS.isFallback, true);
  assert.equal(FALLBACK_READINGS.source, 'fallback');
});

runCheck('Fallback', 'Fallback data generates complete Canonical Section 2 without gaps', () => {
  const section = getCanonicalMassSection(1, FALLBACK_READINGS);
  assert.equal(section.parts[0].title.es, 'Primera Lectura (Ef 4, 1-6)');
  assert.equal(section.parts[1].title.es, 'Salmo Responsorial (Sal 23)');
  assert.equal(section.parts[2].title.es, 'Aclamación del Evangelio (Aleluya)');
  assert.equal(section.parts[3].title.es, 'Proclamación del Santo Evangelio (Jn 14, 1-6)');
  assert.equal(section.parts[4].title.es, 'La Homilía');
  assert.equal(section.parts[5].title.es, 'Profesión de Fe (El Credo)');
  assert.equal(section.parts[6].title.es, 'Oración Universal (Plegaria de los Fieles)');
});

console.log('\n===============================================================================');
console.log(`TOTAL TESTS: ${suitePassed + suiteFailed} | PASSED: ${suitePassed} | FAILED: ${suiteFailed}`);
console.log('===============================================================================');

if (failures.length > 0) {
  console.log('\nFailures Detected:');
  for (const f of failures) {
    console.log(`  - [${f.category}] ${f.testName}: ${f.error}`);
  }
}
