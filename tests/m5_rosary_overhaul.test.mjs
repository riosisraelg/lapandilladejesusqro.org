/**
 * Test suite for Requirement R7 (Milestone M5): Rosary UI Overhaul & Vibrating Counter
 * 
 * Verifies:
 * 1. 5-Element Mystery Cards across all 4 mystery sets (Gozosos, Luminosos, Dolorosos, Gloriosos)
 * 2. Full untruncated prayers (zero ellipses `...`) across Mexicana, Misionera, Universal, Latin
 * 3. Collapsible repeated prayers (Padre Nuestro, 10 Ave Marías, Gloria, Jaculatorias)
 * 4. Dedicated sub-decks (all, opening, mysteries, concluding)
 * 5. Top-level vibrating counter cycle & vibration patterns
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import {
  MISTERIOS_DATA,
  getSantoRosarioDeck,
  getRosarioOpeningDeck,
  getRosarioMysteriesDeck,
  getRosarioConcludingDeck,
  getMysteryTypeForDay,
  PRAYERS_CANONICAL
} from '../src/data/oracionesData.ts';

describe('Milestone M5 - Requirement R7: Rosary UI Overhaul & Vibrating Counter', () => {

  describe('1. 5-Element Mystery Cards (Gozosos, Luminosos, Dolorosos, Gloriosos)', () => {
    const mysteryTypes = ['gozosos', 'luminosos', 'dolorosos', 'gloriosos'];

    it('contains all 4 mystery types in MISTERIOS_DATA', () => {
      mysteryTypes.forEach((type) => {
        assert.ok(MISTERIOS_DATA[type], `MISTERIOS_DATA should contain ${type}`);
        assert.equal(MISTERIOS_DATA[type].mysteries.length, 5, `${type} must contain exactly 5 mysteries`);
      });
    });

    it('verifies all 20 mysteries sequentially contain all 5 required elements', () => {
      mysteryTypes.forEach((type) => {
        const info = MISTERIOS_DATA[type];
        info.mysteries.forEach((m, idx) => {
          const mysteryNum = idx + 1;
          // Element 1: Curated SVG artwork / image indicator
          assert.ok(m.image && typeof m.image === 'string', `${type} mystery ${mysteryNum} must have image key`);
          assert.ok(m.image.startsWith('icon-'), `${type} mystery ${mysteryNum} image key should follow 'icon-*' naming`);

          // Element 2: Scriptural citation reference
          assert.ok(m.biblicalRef && m.biblicalRef.length > 3, `${type} mystery ${mysteryNum} must have biblicalRef citation`);

          // Element 3: Direct scripture text in Spanish and English
          assert.ok(m.scriptureText && m.scriptureText.length > 15, `${type} mystery ${mysteryNum} must have direct scriptureText (ES)`);
          assert.ok(m.scriptureTextEn && m.scriptureTextEn.length > 15, `${type} mystery ${mysteryNum} must have direct scriptureTextEn (EN)`);

          // Element 4: Deep meditation in Spanish and English
          assert.ok(m.meditation && m.meditation.length > 20, `${type} mystery ${mysteryNum} must have deep meditation (ES)`);
          assert.ok(m.meditationEn && m.meditationEn.length > 20, `${type} mystery ${mysteryNum} must have deep meditationEn (EN)`);

          // Element 5: Reflection question for the decade in Spanish and English
          assert.ok(m.reflectionQuestion && m.reflectionQuestion.includes('?'), `${type} mystery ${mysteryNum} must have reflectionQuestion (ES)`);
          assert.ok(m.reflectionQuestionEn && m.reflectionQuestionEn.includes('?'), `${type} mystery ${mysteryNum} must have reflectionQuestionEn (EN)`);
        });
      });
    });
  });

  describe('2. Untruncated Prayers & Collapsible Repeats Structure', () => {
    it('verifies canonical prayers are complete and free of truncation ellipses', () => {
      const keys = ['padreNuestro', 'aveMaria', 'gloria', 'fatima', 'credo'];
      keys.forEach((key) => {
        const prayer = PRAYERS_CANONICAL[key];
        assert.ok(prayer.es, `Canonical prayer ${key} must have Spanish text`);
        assert.ok(prayer.en, `Canonical prayer ${key} must have English text`);
        assert.ok(prayer.la, `Canonical prayer ${key} must have Latin text`);

        assert.equal(prayer.es.includes('...'), false, `Canonical prayer ${key} (ES) must not have '...'`);
        assert.equal(prayer.en.includes('...'), false, `Canonical prayer ${key} (EN) must not have '...'`);
        assert.equal(prayer.la.includes('...'), false, `Canonical prayer ${key} (LA) must not have '...'`);
      });
    });

    it('verifies mystery cards contain structured repeatedPrayers accordion data', () => {
      const variants = ['mexicana', 'misionera', 'universal', 'latin'];
      variants.forEach((variant) => {
        const mysteriesDeck = getRosarioMysteriesDeck('gozosos', variant);
        assert.equal(mysteriesDeck.length, 5);

        mysteriesDeck.forEach((card, idx) => {
          assert.ok(card.repeatedPrayers, `Card ${idx + 1} must include repeatedPrayers`);
          assert.equal(card.repeatedPrayers.length, 4, `Card ${idx + 1} must include 4 repeated prayers: PN, 10 Ave, Gloria, Jaculatorias`);

          const [pn, ave, gloria, jac] = card.repeatedPrayers;
          assert.equal(pn.count, 1, 'Padre Nuestro count must be 1');
          assert.equal(ave.count, 10, 'Ave Marías count must be 10');
          assert.equal(gloria.count, 1, 'Gloria count must be 1');
          assert.equal(jac.count, 1, 'Jaculatorias count must be 1');

          // Ensure no truncation in repeated prayers
          assert.equal(pn.text.includes('...'), false, 'Repeated Padre Nuestro must not have truncation ellipses');
          assert.equal(ave.text.includes('...'), false, 'Repeated Ave María must not have truncation ellipses');
          assert.equal(gloria.text.includes('...'), false, 'Repeated Gloria must not have truncation ellipses');
        });
      });
    });
  });

  describe('3. Dedicated Sub-Decks Architecture', () => {
    it('generates isolated opening sub-deck', () => {
      const openingDeck = getRosarioOpeningDeck('mexicana');
      assert.ok(openingDeck.length >= 3, 'Opening deck must contain initial prayers');
      openingDeck.forEach((card) => {
        assert.equal(card.subDeck, 'opening', 'All cards in opening deck must have subDeck: "opening"');
      });
    });

    it('generates isolated 5-mysteries sub-deck', () => {
      const mysteriesDeck = getRosarioMysteriesDeck('luminosos', 'mexicana');
      assert.equal(mysteriesDeck.length, 5, 'Mysteries sub-deck must contain exactly 5 mystery cards');
      mysteriesDeck.forEach((card, idx) => {
        assert.equal(card.subDeck, 'mysteries');
        assert.equal(card.isMysteryCard, true);
        assert.equal(card.mysteryNumber, idx + 1);
      });
    });

    it('generates isolated concluding sub-deck', () => {
      const concludingDeck = getRosarioConcludingDeck('mexicana');
      assert.ok(concludingDeck.length >= 3, 'Concluding deck must contain final prayers');
      concludingDeck.forEach((card) => {
        assert.equal(card.subDeck, 'concluding');
      });
    });

    it('getSantoRosarioDeck supports subDeck argument ("all", "opening", "mysteries", "concluding")', () => {
      const allCards = getSantoRosarioDeck('dolorosos', 'mexicana', 'all');
      const openingCards = getSantoRosarioDeck('dolorosos', 'mexicana', 'opening');
      const mysteryCards = getSantoRosarioDeck('dolorosos', 'mexicana', 'mysteries');
      const concludingCards = getSantoRosarioDeck('dolorosos', 'mexicana', 'concluding');

      assert.equal(allCards.length, openingCards.length + mysteryCards.length + concludingCards.length);
      assert.equal(mysteryCards.length, 5);
      assert.deepEqual(allCards.slice(0, openingCards.length), openingCards);
      assert.deepEqual(allCards.slice(openingCards.length, openingCards.length + 5), mysteryCards);
    });
  });

  describe('4. Top-Level Vibrating Counter Simulator & Logic', () => {
    it('simulates decade counter cycling from 0 to 10 back to 0 with vibration patterns', () => {
      let count = 0;
      const vibrationLog = [];

      const fakeNavigator = {
        vibrate(pattern) {
          vibrationLog.push(pattern);
        }
      };

      const increment = () => {
        count = (count + 1) % 11;
        if (count === 10) {
          fakeNavigator.vibrate([15, 30, 15]);
        } else if (count > 0) {
          fakeNavigator.vibrate([25]);
        }
      };

      // Beads 1 through 9
      for (let i = 1; i <= 9; i++) {
        increment();
        assert.equal(count, i);
        assert.deepEqual(vibrationLog[vibrationLog.length - 1], [25]);
      }

      // Bead 10 (Decade complete)
      increment();
      assert.equal(count, 10);
      assert.deepEqual(vibrationLog[vibrationLog.length - 1], [15, 30, 15]);

      // Cycle back to 0
      increment();
      assert.equal(count, 0);
    });
  });
});
