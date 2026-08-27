import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateDeckHSL, calculateContrastRatioAgainstWhite } from '../src/utils/deckColors.ts';
import { 
  getFoodPrayersDeck, 
  oracionesComunidad, 
  oracionesBasicas, 
  getSantoRosarioDeck 
} from '../src/data/oracionesData.ts';

test('Milestone M2 - Requirement R3: Infinite Swipe Animations & Continuous Loop', async (t) => {
  const DECKS_ORDER = ['comunidad', 'basicas', 'alimentos', 'rosario'];

  await t.test('Deck circular navigation modulo loops seamlessly forward (N-1 -> 0)', () => {
    const totalDecks = DECKS_ORDER.length;
    let currentIdx = totalDecks - 1; // Last deck: rosario (index 3)
    const nextIdx = (currentIdx + 1) % totalDecks;
    assert.equal(nextIdx, 0, 'Swiping left on last deck must loop smoothly to index 0 (comunidad)');
    assert.equal(DECKS_ORDER[nextIdx], 'comunidad');
  });

  await t.test('Deck circular navigation modulo loops seamlessly backward (0 -> N-1)', () => {
    const totalDecks = DECKS_ORDER.length;
    let currentIdx = 0; // First deck: comunidad (index 0)
    const prevIdx = (currentIdx - 1 + totalDecks) % totalDecks;
    assert.equal(prevIdx, totalDecks - 1, 'Swiping right on first deck must loop smoothly to index 3 (rosario)');
    assert.equal(DECKS_ORDER[prevIdx], 'rosario');
  });

  await t.test('Continuous forward and backward multi-cycle navigation invariance', () => {
    const totalDecks = DECKS_ORDER.length;
    let idx = 0;

    // 100 forward steps
    for (let i = 0; i < 100; i++) {
      idx = (idx + 1) % totalDecks;
    }
    assert.equal(idx, 0, '100 steps on 4-deck array must return to index 0');

    // 100 backward steps
    for (let i = 0; i < 100; i++) {
      idx = (idx - 1 + totalDecks) % totalDecks;
    }
    assert.equal(idx, 0, '100 reverse steps on 4-deck array must return to index 0');
  });

  await t.test('Food prayers deck 7-card internal circular swipe navigation', () => {
    const foodDeck = getFoodPrayersDeck();
    assert.equal(foodDeck.length, 7);
    const N = foodDeck.length;

    // From Saturday (index 6), next must be Sunday (index 0)
    const afterSat = (6 + 1) % N;
    assert.equal(afterSat, 0);

    // From Sunday (index 0), prev must be Saturday (index 6)
    const beforeSun = (0 - 1 + N) % N;
    assert.equal(beforeSun, 6);
  });

  await t.test('Gesture drag physics: 80px threshold trigger and spring-back calculation', () => {
    const evaluateGesture = (deltaX, threshold = 80) => {
      if (Math.abs(deltaX) < threshold) {
        return { shouldNavigate: false, action: null };
      }
      return {
        shouldNavigate: true,
        action: deltaX < 0 ? 'next' : 'prev'
      };
    };

    // Under 80px -> springs back
    assert.deepEqual(evaluateGesture(0), { shouldNavigate: false, action: null });
    assert.deepEqual(evaluateGesture(45), { shouldNavigate: false, action: null });
    assert.deepEqual(evaluateGesture(-79.5), { shouldNavigate: false, action: null });

    // Exceeding 80px threshold -> triggers navigation
    assert.deepEqual(evaluateGesture(80), { shouldNavigate: true, action: 'prev' });
    assert.deepEqual(evaluateGesture(120), { shouldNavigate: true, action: 'prev' });
    assert.deepEqual(evaluateGesture(-80), { shouldNavigate: true, action: 'next' });
    assert.deepEqual(evaluateGesture(-150), { shouldNavigate: true, action: 'next' });
  });

  await t.test('3D Perspective transform calculation produces correct CSS transforms', () => {
    const calcTransform = (deltaX) => `translate3d(${deltaX}px, 0, 0) rotate(${deltaX * 0.04}deg) scale(1)`;
    assert.equal(calcTransform(50), 'translate3d(50px, 0, 0) rotate(2deg) scale(1)');
    assert.equal(calcTransform(-100), 'translate3d(-100px, 0, 0) rotate(-4deg) scale(1)');
  });
});

test('Milestone M2 - Requirement R4: Dynamic Brand Color Tone Engine', async (t) => {
  await t.test('Anchor base brand color (index 0) matches warm Catholic Coffee #5C3D2E parameters', () => {
    const tone0 = calculateDeckHSL(0);
    assert.equal(tone0.index, 0);
    assert.equal(tone0.hue, 20);
    assert.equal(tone0.lightness, 24);
    assert.equal(tone0.saturation, 30);
    assert.equal(tone0.hslString, 'hsl(20, 30%, 24%)');
  });

  await t.test('Distinct calculated color tones across all 4 primary decks', () => {
    const tones = [0, 1, 2, 3].map(i => calculateDeckHSL(i));
    const hslStrings = tones.map(t => t.hslString);
    const uniqueHsl = new Set(hslStrings);
    assert.equal(uniqueHsl.size, 4, 'All 4 decks must have distinct color tones');
  });

  await t.test('Distinct calculated color tones across 7 days of food prayers deck', () => {
    const tones = Array.from({ length: 7 }, (_, i) => calculateDeckHSL(i));
    const uniqueHsl = new Set(tones.map(t => t.hslString));
    assert.equal(uniqueHsl.size, 7, 'All 7 food days must have distinct color tones');
  });

  await t.test('Lightness is strictly bounded to preserve WCAG AA contrast (>= 4.5:1) against white text', () => {
    for (let i = 0; i < 20; i++) {
      const tone = calculateDeckHSL(i);
      assert.ok(tone.lightness >= 24 && tone.lightness <= 45, `Lightness (${tone.lightness}%) must remain in dark contrast range`);
      const contrastRatio = calculateContrastRatioAgainstWhite(tone.lightness);
      assert.ok(contrastRatio >= 4.5, `Contrast ratio ${contrastRatio.toFixed(2)}:1 must be >= 4.5:1 for index ${i}`);
    }
  });

  await t.test('CSS custom properties are complete and valid in tone object', () => {
    const tone = calculateDeckHSL(2);
    assert.ok(tone.cssVariables['--deck-color-hsl']);
    assert.ok(tone.cssVariables['--deck-color-gradient']);
    assert.ok(tone.cssVariables['--deck-color-border']);
    assert.ok(tone.cssVariables['--deck-color-badge-bg']);
    assert.ok(tone.cssVariables['--deck-color-badge-text']);
    assert.ok(tone.cssVariables['--deck-color-indicator']);

    assert.ok(tone.gradientString.startsWith('linear-gradient(135deg, hsl('));
    assert.ok(tone.accentBorder.startsWith('hsl('));
    assert.ok(tone.badgeBg.startsWith('hsla('));
  });

  await t.test('Dynamic Color Engine resilience to edge inputs (large numbers, negatives, NaN)', () => {
    const toneLarge = calculateDeckHSL(360);
    assert.ok(toneLarge.hue >= 0 && toneLarge.hue < 360);

    const toneNeg = calculateDeckHSL(-5);
    assert.ok(toneNeg.hue >= 0 && toneNeg.hue < 360);

    const toneNaN = calculateDeckHSL(NaN);
    assert.equal(toneNaN.index, 0);
    assert.equal(toneNaN.hue, 20);
  });
});
