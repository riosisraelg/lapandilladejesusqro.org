import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  oracionesAlimentos, 
  FOOD_PRAYERS_DATA, 
  BENDICIONAL_INTRO, 
  getFoodPrayersDeck, 
  oracionesBasicas 
} from '../src/data/oracionesData.ts';

test('M1-R1: Catholic Food Prayers Structure & Transcription', async (t) => {
  await t.test('FOOD_PRAYERS_DATA contains all 7 liturgical days (Domingo to Sábado)', () => {
    assert.equal(FOOD_PRAYERS_DATA.length, 7, 'Must have exactly 7 days');
    const expectedDays = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const expectedDayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    FOOD_PRAYERS_DATA.forEach((day, idx) => {
      assert.equal(day.dayIndex, idx, `Day index must be ${idx}`);
      assert.equal(day.day, expectedDays[idx], `Day identifier must be ${expectedDays[idx]}`);
      assert.equal(day.dayName, expectedDayNames[idx], `Day name must be ${expectedDayNames[idx]}`);
    });
  });

  await t.test('Introductory Rubric Bendicional nn. 883-884 is complete and accurate', () => {
    assert.ok(BENDICIONAL_INTRO.citation.includes('883-884'), 'Citation must reference 883-884');
    assert.ok(BENDICIONAL_INTRO.text.includes('El cristiano, cuando se sienta a la mesa'), 'Must contain verbatim Spanish rubric');
    assert.ok(BENDICIONAL_INTRO.text.includes('pobres que posiblemente carecen del sustento'), 'Must contain poverty/charity exhortation');
    assert.ok(BENDICIONAL_INTRO.textEn.includes('The Christian, when sitting at the table'), 'Must contain English translation');
  });

  await t.test('Each day has "Antes de las comidas" with Versicle, Response, and Oremos prayer', () => {
    FOOD_PRAYERS_DATA.forEach((day) => {
      assert.ok(day.before, `${day.dayName} must have before meals object`);
      assert.ok(day.before.verse && day.before.verse.length > 10, `${day.dayName} must have scripture verse`);
      assert.ok(day.before.response && day.before.response.includes('Bendito seas por siempre'), `${day.dayName} must have standard Catholic response`);
      assert.ok(day.before.prayer && day.before.prayer.includes('Amén'), `${day.dayName} must have blessing prayer concluding with Amén`);

      // English before
      assert.ok(day.beforeEn, `${day.dayName} must have English before meals object`);
      assert.ok(day.beforeEn.verse, `${day.dayName} must have English verse`);
      assert.ok(day.beforeEn.response, `${day.dayName} must have English response`);
      assert.ok(day.beforeEn.prayer && day.beforeEn.prayer.includes('Amen'), `${day.dayName} must have English prayer`);
    });
  });

  await t.test('Each day has "Después de las comidas" thanksgiving prayer with doxology', () => {
    FOOD_PRAYERS_DATA.forEach((day) => {
      assert.ok(day.after, `${day.dayName} must have after meals object`);
      assert.ok(day.after.prayer && day.after.prayer.length > 20, `${day.dayName} must have thanksgiving prayer body`);
      assert.ok(day.after.prayer.includes('Amén'), `${day.dayName} after prayer must conclude with Amén`);

      // English after
      assert.ok(day.afterEn, `${day.dayName} must have English after meals object`);
      assert.ok(day.afterEn.prayer && day.afterEn.prayer.includes('Amen'), `${day.dayName} English after prayer must conclude with Amen`);
    });
  });

  await t.test('oracionesAlimentos generates 7 valid PrayerCard objects', () => {
    assert.equal(oracionesAlimentos.length, 7, 'oracionesAlimentos must have 7 cards');
    oracionesAlimentos.forEach((card, idx) => {
      assert.ok(card.id.startsWith('alimentos-'), `Card ${idx} id must start with alimentos-`);
      assert.ok(card.title.includes('Bendición de los Alimentos'), `Card ${idx} title must include category`);
      assert.ok(card.subtitle.includes('Bendicional nn. 883-884'), `Card ${idx} subtitle must include rubric citation`);
      assert.ok(card.text.includes('ANTES DE LAS COMIDAS'), `Card ${idx} text must format before meals`);
      assert.ok(card.text.includes('DESPUÉS DE LAS COMIDAS'), `Card ${idx} text must format after meals`);
      assert.ok(card.textEn && card.textEn.includes('BEFORE MEALS'), `Card ${idx} must have English text`);
    });
  });

  await t.test('getFoodPrayersDeck returns oracionesAlimentos array', () => {
    const deck = getFoodPrayersDeck();
    assert.equal(deck.length, 7);
    assert.equal(deck, oracionesAlimentos);
  });

  await t.test('Legacy basicas-alimentos is removed from oracionesBasicas', () => {
    const oldPrayer = oracionesBasicas.find(p => p.id === 'basicas-alimentos');
    assert.equal(oldPrayer, undefined, 'basicas-alimentos must not exist in oracionesBasicas');
    assert.equal(oracionesBasicas.length, 10, 'oracionesBasicas should now have exactly 10 fundamental basic prayers');
  });
});

test('M1-R2: Auto-Day Selection Logic', async (t) => {
  await t.test('Date.getDay() maps deterministically to 0-6 index in FOOD_PRAYERS_DATA', () => {
    for (let d = 0; d < 7; d++) {
      const prayer = FOOD_PRAYERS_DATA[d];
      assert.equal(prayer.dayIndex, d, `Day index ${d} must match array index ${d}`);
    }
  });

  await t.test('Sunday index 0 returns Domingo', () => {
    assert.equal(FOOD_PRAYERS_DATA[0].dayName, 'Domingo');
    assert.equal(oracionesAlimentos[0].id, 'alimentos-domingo');
  });

  await t.test('Monday index 1 returns Lunes', () => {
    assert.equal(FOOD_PRAYERS_DATA[1].dayName, 'Lunes');
    assert.equal(oracionesAlimentos[1].id, 'alimentos-lunes');
  });

  await t.test('Saturday index 6 returns Sábado', () => {
    assert.equal(FOOD_PRAYERS_DATA[6].dayName, 'Sábado');
    assert.equal(oracionesAlimentos[6].id, 'alimentos-sabado');
  });
});
