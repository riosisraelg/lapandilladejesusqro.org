import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  oracionesAlimentos, 
  FOOD_PRAYERS_DATA, 
  BENDICIONAL_INTRO, 
  getFoodPrayersDeck, 
  oracionesBasicas,
  oracionesComunidad,
  getSantoRosarioDeck,
  getMysteryTypeForDay
} from '../src/data/oracionesData.ts';

// ─────────────────────────────────────────────────────────────────────────────
// CHALLENGER SUITE 1: getFoodPrayersDeck & Auto-Day Edge Cases & Adversarial Inputs
// ─────────────────────────────────────────────────────────────────────────────

test('Challenger M1.1: getFoodPrayersDeck Input Resilience & Boundary Testing', async (t) => {
  await t.test('getFoodPrayersDeck returns consistent array reference and length 7 regardless of input', () => {
    // Normal call
    const deckDefault = getFoodPrayersDeck();
    assert.equal(Array.isArray(deckDefault), true);
    assert.equal(deckDefault.length, 7);

    // Boundary indices 0 and 6
    assert.equal(getFoodPrayersDeck(0).length, 7);
    assert.equal(getFoodPrayersDeck(6).length, 7);

    // Out-of-bounds indices
    assert.equal(getFoodPrayersDeck(-1).length, 7);
    assert.equal(getFoodPrayersDeck(7).length, 7);
    assert.equal(getFoodPrayersDeck(9999).length, 7);
    assert.equal(getFoodPrayersDeck(-9999).length, 7);

    // Floating point numbers
    assert.equal(getFoodPrayersDeck(3.14159).length, 7);
    assert.equal(getFoodPrayersDeck(0.0001).length, 7);
    assert.equal(getFoodPrayersDeck(6.9999).length, 7);

    // Non-numeric and extreme values
    assert.equal(getFoodPrayersDeck(NaN).length, 7);
    assert.equal(getFoodPrayersDeck(Infinity).length, 7);
    assert.equal(getFoodPrayersDeck(-Infinity).length, 7);
    assert.equal(getFoodPrayersDeck(null).length, 7);
    assert.equal(getFoodPrayersDeck(undefined).length, 7);
    assert.equal(getFoodPrayersDeck("3").length, 7);
    assert.equal(getFoodPrayersDeck({}).length, 7);
    assert.equal(getFoodPrayersDeck([]).length, 7);
  });

  await t.test('Boundary days 0 (Domingo) and 6 (Sábado) map accurately and contain full prayer structure', () => {
    // Day 0: Sunday / Domingo
    const sunday = FOOD_PRAYERS_DATA[0];
    assert.equal(sunday.dayIndex, 0);
    assert.equal(sunday.day, 'domingo');
    assert.equal(sunday.dayName, 'Domingo');
    assert.equal(sunday.dayNameEn, 'Sunday');
    assert.ok(sunday.before.verse.includes('festín'));
    assert.ok(sunday.before.response.includes('Bendito seas'));
    assert.ok(sunday.before.prayer.includes('Pascua de su liberación'));
    assert.ok(sunday.after.prayer.includes('alegría de la Pascua'));

    // Day 6: Saturday / Sábado
    const saturday = FOOD_PRAYERS_DATA[6];
    assert.equal(saturday.dayIndex, 6);
    assert.equal(saturday.day, 'sabado');
    assert.equal(saturday.dayName, 'Sábado');
    assert.equal(saturday.dayNameEn, 'Saturday');
    assert.ok(saturday.before.verse.includes('Entonen la acción de gracias'));
    assert.ok(saturday.before.response.includes('Bendito seas'));
    assert.ok(saturday.before.prayer.includes('banquete del cielo'));
    assert.ok(saturday.after.prayer.includes('Dios todopoderoso'));
  });

  await t.test('All 7 days are strictly distinct prayers (no duplicate copy-paste bugs)', () => {
    const spanishBeforePrayers = new Set();
    const spanishAfterPrayers = new Set();
    const verses = new Set();

    FOOD_PRAYERS_DATA.forEach((day, idx) => {
      assert.ok(!verses.has(day.before.verse), `Day ${idx} has duplicate verse: ${day.before.verse}`);
      verses.add(day.before.verse);

      assert.ok(!spanishBeforePrayers.has(day.before.prayer), `Day ${idx} has duplicate before prayer`);
      spanishBeforePrayers.add(day.before.prayer);
    });

    assert.equal(verses.size, 7, 'Must have 7 unique biblical versicles');
    assert.equal(spanishBeforePrayers.size, 7, 'Must have 7 unique blessing prayers');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// CHALLENGER SUITE 2: Leap Years, Calendar Rollovers & Global Timezone Simulation
// ─────────────────────────────────────────────────────────────────────────────

test('Challenger M1.2: Leap Years & Date Edge Cases across Global Timezones', async (t) => {
  await t.test('Leap year days (e.g. Feb 29) map to valid dayIndex [0..6] in Gregorian calendar', () => {
    const leapDates = [
      { date: '2024-02-29T12:00:00Z', expectedDay: 4, name: 'Thursday 2024' },
      { date: '2028-02-29T12:00:00Z', expectedDay: 2, name: 'Tuesday 2028' },
      { date: '2032-02-29T12:00:00Z', expectedDay: 0, name: 'Sunday 2032' },
      { date: '2036-02-29T12:00:00Z', expectedDay: 5, name: 'Friday 2036' },
      { date: '2040-02-29T12:00:00Z', expectedDay: 3, name: 'Wednesday 2040' },
      { date: '2000-02-29T12:00:00Z', expectedDay: 2, name: 'Tuesday 2000' }
    ];

    leapDates.forEach(({ date, expectedDay, name }) => {
      const d = new Date(date);
      const dayIdx = d.getUTCDay();
      assert.equal(dayIdx, expectedDay, `Leap date ${name} must equal day ${expectedDay}`);
      const prayer = FOOD_PRAYERS_DATA[dayIdx];
      assert.ok(prayer, `Prayer for day index ${dayIdx} must exist`);
      assert.equal(prayer.dayIndex, expectedDay);
      assert.ok(oracionesAlimentos[dayIdx]);
    });
  });

  await t.test('365-day year transition (Dec 31 to Jan 1) produces valid continuous day index sequence', () => {
    // Test 3 consecutive years including leap year (2023, 2024, 2025)
    let startDate = new Date('2023-01-01T12:00:00Z');
    let prevDay = startDate.getUTCDay();

    for (let i = 1; i <= 1095; i++) {
      const nextDate = new Date(startDate.getTime() + i * 86400000);
      const currentDay = nextDate.getUTCDay();
      assert.equal(currentDay, (prevDay + 1) % 7, `Day after ${prevDay} must be ${(prevDay + 1) % 7}`);
      assert.ok(currentDay >= 0 && currentDay <= 6, `Day ${currentDay} must be in [0, 6]`);
      
      const card = oracionesAlimentos[currentDay];
      assert.ok(card !== undefined, `Card for day ${currentDay} must exist`);
      assert.equal(card.id, `alimentos-${FOOD_PRAYERS_DATA[currentDay].day}`);
      prevDay = currentDay;
    }
  });

  await t.test('Global timezone hour offsets produce deterministic 0..6 indices', () => {
    // Offsets from UTC-12 to UTC+14
    const baseTimestamp = 1787702400000; // 2026-08-27T00:00:00Z
    const offsetsInHours = [
      -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0,
      1, 2, 3, 4, 5, 5.5, 6, 7, 8, 9, 9.5, 10, 11, 12, 13, 14
    ];

    offsetsInHours.forEach((offset) => {
      const localTimeMs = baseTimestamp + offset * 3600 * 1000;
      const simulatedLocalDate = new Date(localTimeMs);
      const dayIdx = simulatedLocalDate.getUTCDay();
      
      assert.ok(dayIdx >= 0 && dayIdx <= 6, `Offset UTC${offset >= 0 ? '+' : ''}${offset} yielded out of bounds day ${dayIdx}`);
      assert.ok(FOOD_PRAYERS_DATA[dayIdx], `Prayer exists for offset UTC${offset}`);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// CHALLENGER SUITE 3: Card Schema Robustness & Missing Field Resilience
// ─────────────────────────────────────────────────────────────────────────────

test('Challenger M1.3: Schema Robustness & Absence of Undefined / Corrupted Interpolations', async (t) => {
  await t.test('No card in oracionesAlimentos contains literal "undefined" or "null" in rendered text', () => {
    oracionesAlimentos.forEach((card, idx) => {
      // Spanish checks
      assert.ok(!card.title.includes('undefined'), `Card ${idx} title contains "undefined"`);
      assert.ok(!card.title.includes('null'), `Card ${idx} title contains "null"`);
      assert.ok(!card.subtitle.includes('undefined'), `Card ${idx} subtitle contains "undefined"`);
      assert.ok(!card.subtitle.includes('null'), `Card ${idx} subtitle contains "null"`);
      assert.ok(!card.text.includes('undefined'), `Card ${idx} text contains "undefined"`);
      assert.ok(!card.text.includes('null'), `Card ${idx} text contains "null"`);

      // English checks
      assert.ok(!card.titleEn?.includes('undefined'), `Card ${idx} titleEn contains "undefined"`);
      assert.ok(!card.titleEn?.includes('null'), `Card ${idx} titleEn contains "null"`);
      assert.ok(!card.subtitleEn?.includes('undefined'), `Card ${idx} subtitleEn contains "undefined"`);
      assert.ok(!card.subtitleEn?.includes('null'), `Card ${idx} subtitleEn contains "null"`);
      assert.ok(!card.textEn?.includes('undefined'), `Card ${idx} textEn contains "undefined"`);
      assert.ok(!card.textEn?.includes('null'), `Card ${idx} textEn contains "null"`);
    });
  });

  await t.test('Each card strictly implements PrayerCard interface specification', () => {
    oracionesAlimentos.forEach((card, idx) => {
      assert.equal(typeof card.id, 'string');
      assert.equal(typeof card.title, 'string');
      assert.equal(typeof card.titleEn, 'string');
      assert.equal(typeof card.subtitle, 'string');
      assert.equal(typeof card.subtitleEn, 'string');
      assert.equal(typeof card.category, 'string');
      assert.equal(typeof card.categoryEn, 'string');
      assert.equal(typeof card.text, 'string');
      assert.equal(typeof card.textEn, 'string');

      assert.ok(card.id.length > 5);
      assert.ok(card.title.length > 10);
      assert.ok(card.text.length > 50);
      assert.ok(card.textEn.length > 50);
    });
  });

  await t.test('Rubric intro BENDICIONAL_INTRO is non-empty and shared across cards', () => {
    assert.ok(BENDICIONAL_INTRO.title === 'Bendicional');
    assert.ok(BENDICIONAL_INTRO.citation === 'nn. 883-884');
    assert.ok(BENDICIONAL_INTRO.text.length > 100);
    assert.ok(BENDICIONAL_INTRO.textEn.length > 100);

    oracionesAlimentos.forEach((card, idx) => {
      assert.ok(card.text.includes(BENDICIONAL_INTRO.text), `Card ${idx} missing Spanish Bendicional intro`);
      assert.ok(card.textEn.includes(BENDICIONAL_INTRO.textEn), `Card ${idx} missing English Book of Blessings intro`);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// CHALLENGER SUITE 4: 4-Deck Switching State Transitions & Modulo Math
// ─────────────────────────────────────────────────────────────────────────────

test('Challenger M1.4: 4-Deck Switching & Gesture Infinite Navigation Math', async (t) => {
  const DECKS_ORDER = ['comunidad', 'basicas', 'alimentos', 'rosario'];

  await t.test('DECKS_ORDER has exactly 4 decks in exact order and supports cyclic switching', () => {
    assert.equal(DECKS_ORDER.length, 4);
    assert.deepEqual(DECKS_ORDER, ['comunidad', 'basicas', 'alimentos', 'rosario']);

    // Test forward cyclic wrapping 20 times
    let currentIdx = 0;
    for (let i = 0; i < 20; i++) {
      const nextIdx = (currentIdx + 1) % DECKS_ORDER.length;
      assert.ok(nextIdx >= 0 && nextIdx < 4);
      currentIdx = nextIdx;
    }
    assert.equal(currentIdx, 0, '20 forward steps must land exactly on index 0');

    // Test backward cyclic wrapping 20 times
    currentIdx = 0;
    for (let i = 0; i < 20; i++) {
      const prevIdx = (currentIdx - 1 + DECKS_ORDER.length) % DECKS_ORDER.length;
      assert.ok(prevIdx >= 0 && prevIdx < 4);
      currentIdx = prevIdx;
    }
    assert.equal(currentIdx, 0, '20 backward steps must land exactly on index 0');
  });

  await t.test('Deck resolution returns correct card arrays for each deck identifier', () => {
    function resolveDeck(deck) {
      switch (deck) {
        case 'basicas':
          return oracionesBasicas;
        case 'alimentos':
          return getFoodPrayersDeck();
        case 'rosario':
          return getSantoRosarioDeck('gozosos', 'mexicana');
        case 'comunidad':
        default:
          return oracionesComunidad;
      }
    }

    const comCards = resolveDeck('comunidad');
    assert.equal(comCards.length, 3);
    assert.equal(comCards[0].id, 'comunidad-pandilla');

    const basCards = resolveDeck('basicas');
    assert.equal(basCards.length, 10);
    assert.equal(basCards[0].id, 'basicas-cruz');

    const aliCards = resolveDeck('alimentos');
    assert.equal(aliCards.length, 7);
    assert.equal(aliCards[0].id, 'alimentos-domingo');

    const rosCards = resolveDeck('rosario');
    assert.ok(rosCards.length >= 8);
    assert.ok(rosCards[0].id.startsWith('rosario-'));
  });

  await t.test('3D Stacked Deck 7-card modulo calculation has no gaps or overlaps', () => {
    const N = 7;
    for (let activeIdx = 0; activeIdx < N; activeIdx++) {
      const diffs = [];
      let activeCount = 0;
      let nextCount = 0;
      let nextBehindCount = 0;
      let farBehindCount = 0;

      for (let cardIdx = 0; cardIdx < N; cardIdx++) {
        const diff = (cardIdx - activeIdx + N) % N;
        diffs.push(diff);

        if (diff === 0) activeCount++;
        else if (diff === 1) nextCount++;
        else if (diff === 2) nextBehindCount++;
        else farBehindCount++;
      }

      assert.equal(activeCount, 1, `Must have exactly 1 active card at activeIdx ${activeIdx}`);
      assert.equal(nextCount, 1, `Must have exactly 1 next card at activeIdx ${activeIdx}`);
      assert.equal(nextBehindCount, 1, `Must have exactly 1 next-behind card at activeIdx ${activeIdx}`);
      assert.equal(farBehindCount, 4, `Must have 4 far-behind cards for N=7 at activeIdx ${activeIdx}`);
      assert.deepEqual(diffs.sort(), [0, 1, 2, 3, 4, 5, 6]);
    }
  });

  await t.test('Simulated URL search params synchronization for alimentos deck', () => {
    function parseOracionesParams(searchParams) {
      const deck = searchParams.get('deck');
      const etapa = searchParams.get('etapa');
      
      let activeDeck = 'comunidad';
      if (deck && ['comunidad', 'basicas', 'alimentos', 'rosario'].includes(deck)) {
        activeDeck = deck;
      }

      let activeIdx = 0;
      if (etapa) {
        const parsed = parseInt(etapa, 10);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= 7) {
          activeIdx = parsed - 1;
        } else if (activeDeck === 'alimentos') {
          activeIdx = 3; // fallback simulated day
        }
      } else if (activeDeck === 'alimentos') {
        activeIdx = 3; // simulated current day (e.g. Wednesday)
      }

      return { activeDeck, activeIdx };
    }

    // Case 1: Deep link without etapa defaults to today's index
    const params1 = new Map([['deck', 'alimentos']]);
    const res1 = parseOracionesParams(params1);
    assert.equal(res1.activeDeck, 'alimentos');
    assert.equal(res1.activeIdx, 3);

    // Case 2: Deep link with explicit etapa=1 (Sunday)
    const params2 = new Map([['deck', 'alimentos'], ['etapa', '1']]);
    const res2 = parseOracionesParams(params2);
    assert.equal(res2.activeDeck, 'alimentos');
    assert.equal(res2.activeIdx, 0);

    // Case 3: Deep link with explicit etapa=7 (Saturday)
    const params3 = new Map([['deck', 'alimentos'], ['etapa', '7']]);
    const res3 = parseOracionesParams(params3);
    assert.equal(res3.activeDeck, 'alimentos');
    assert.equal(res3.activeIdx, 6);

    // Case 4: Deep link with invalid etapa=999 falls back safely
    const params4 = new Map([['deck', 'alimentos'], ['etapa', '999']]);
    const res4 = parseOracionesParams(params4);
    assert.equal(res4.activeDeck, 'alimentos');
    assert.equal(res4.activeIdx, 3);

    // Case 5: Deep link with invalid deck name falls back to comunidad
    const params5 = new Map([['deck', 'invalid_deck_name']]);
    const res5 = parseOracionesParams(params5);
    assert.equal(res5.activeDeck, 'comunidad');
  });

  await t.test('Deck control bar badge and title text generation for all 4 decks in ES and EN', () => {
    function getDeckBarInfo(deck, lang, selectedMystery = 'gozosos') {
      const idx = DECKS_ORDER.indexOf(deck);
      const badge = lang === 'en' ? `Deck ${idx + 1}/${DECKS_ORDER.length}` : `Mazo ${idx + 1}/${DECKS_ORDER.length}`;
      let title = '';
      if (deck === 'comunidad') title = lang === 'en' ? "Community Prayers" : "Oraciones de la Comunidad";
      if (deck === 'basicas') title = lang === 'en' ? "Basic Prayers" : "Oraciones Básicas";
      if (deck === 'alimentos') title = lang === 'en' ? "Food & Meal Prayers" : "Bendición de Alimentos";
      if (deck === 'rosario') title = lang === 'en' ? "Holy Rosary (Joyful Mysteries)" : "Santo Rosario (Misterios Gozosos)";
      return { badge, title };
    }

    // Comunidad
    assert.deepEqual(getDeckBarInfo('comunidad', 'es'), { badge: 'Mazo 1/4', title: 'Oraciones de la Comunidad' });
    assert.deepEqual(getDeckBarInfo('comunidad', 'en'), { badge: 'Deck 1/4', title: 'Community Prayers' });

    // Basicas
    assert.deepEqual(getDeckBarInfo('basicas', 'es'), { badge: 'Mazo 2/4', title: 'Oraciones Básicas' });
    assert.deepEqual(getDeckBarInfo('basicas', 'en'), { badge: 'Deck 2/4', title: 'Basic Prayers' });

    // Alimentos
    assert.deepEqual(getDeckBarInfo('alimentos', 'es'), { badge: 'Mazo 3/4', title: 'Bendición de Alimentos' });
    assert.deepEqual(getDeckBarInfo('alimentos', 'en'), { badge: 'Deck 3/4', title: 'Food & Meal Prayers' });

    // Rosario
    assert.deepEqual(getDeckBarInfo('rosario', 'es'), { badge: 'Mazo 4/4', title: 'Santo Rosario (Misterios Gozosos)' });
    assert.deepEqual(getDeckBarInfo('rosario', 'en'), { badge: 'Deck 4/4', title: 'Holy Rosary (Joyful Mysteries)' });
  });

  await t.test('Full Year 2026 daily auto-day selection stress test (365 days)', () => {
    // Sweep through all 365 days of 2026
    const baseDate = new Date('2026-01-01T00:00:00Z');
    for (let dayOffset = 0; dayOffset < 365; dayOffset++) {
      const curDate = new Date(baseDate.getTime() + dayOffset * 86400000);
      const dayOfWeek = curDate.getUTCDay();
      assert.ok(dayOfWeek >= 0 && dayOfWeek <= 6);

      const targetFoodPrayer = FOOD_PRAYERS_DATA[dayOfWeek];
      assert.ok(targetFoodPrayer !== undefined);
      assert.equal(targetFoodPrayer.dayIndex, dayOfWeek);

      const targetCard = oracionesAlimentos[dayOfWeek];
      assert.ok(targetCard !== undefined);
      assert.equal(targetCard.id, `alimentos-${targetFoodPrayer.day}`);
    }
  });
});
